// context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();

  // Auth State
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(false);

  // Hotel & Booking State
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [myBookings, setMyBookings] = useState([]);
  const [featuredHotels, setFeaturedHotels] = useState([]);

  // Auth Functions
  const login = async (username, password) => {
    try {
      setLoading(true);
      const res = await axios.post("/auth/login", { username, password });
      
      if (res.data.token) {
        const userData = { 
          username: res.data.username, 
          email: res.data.email,
          role: res.data.role 
        };
        
        setUser(userData);
        setToken(res.data.token);

        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", res.data.token);

        console.log("✅ Login successful");

        // Redirect based on role
        if (res.data.role === "ADMIN") {
          navigate("/admin");
        } else {
          navigate("/");
        }

        return { success: true, message: res.data.message };
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      const errorMessage = err.response?.data?.message || "Login failed";
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (fullName, username, email, password) => {
  try {
    setLoading(true);
    
    // ✅ CORRECT: Create userData object from parameters
    const userData = {
      fullName: fullName,
      username: username,
      email: email,
      password: password,
      role: "USER"
    };

    console.log('📤 Registration data:', userData);

    const res = await axios.post("/auth/register", userData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('📦 Registration response:', res.data);
    
    if (res.data.id || res.data.success) {
      console.log("✅ Registration successful");
      return { 
        success: true, 
        message: res.data.message || "Registration successful" 
      };
    } else {
      throw new Error(res.data.message || "Registration failed");
    }
  } catch (err) {
    console.error("❌ Registration error:", err);
    const errorMessage = err.response?.data?.message || err.message || "Registration failed";
    return { 
      success: false, 
      message: errorMessage 
    };
  } finally {
    setLoading(false);
  }
};

  const logout = () => {
    setUser(null);
    setToken(null);
    setHotels([]);
    setMyBookings([]);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    console.log("✅ Logged out successfully");
    navigate("/login");
  };

  const isAdmin = () => user?.role === "ADMIN";

  // Hotel Functions
 const fetchHotels = async () => {
  try {
    console.log("📡 Fetching hotels...");
    const res = await axios.get("/hotels");
    
    // Ensure hotels is always an array
    const hotelsData = Array.isArray(res.data) ? res.data : [];
    
    setHotels(hotelsData);
    console.log("✅ Hotels fetched:", hotelsData.length);
    
    // Set featured hotels (first 3) - ensure it's an array
    setFeaturedHotels(hotelsData.slice(0, 3));
    return hotelsData;
  } catch (err) {
    console.error("❌ Failed to fetch hotels:", err);
    // Set empty arrays on error
    setHotels([]);
    setFeaturedHotels([]);
    throw err;
  }
};

  const fetchHotelById = async (id) => {
    try {
      const res = await axios.get(`/hotels/${id}`);
      return res.data;
    } catch (err) {
      console.error("❌ Failed to fetch hotel:", err);
      throw err;
    }
  };

  const searchHotels = async (searchParams) => {
    try {
      console.log("🔍 Searching hotels with:", searchParams);
      const params = new URLSearchParams();
      
      if (searchParams.location) params.append('location', searchParams.location);
      if (searchParams.minPrice) params.append('minPrice', searchParams.minPrice);
      if (searchParams.maxPrice) params.append('maxPrice', searchParams.maxPrice);
      if (searchParams.minRating) params.append('minRating', searchParams.minRating);

      const res = await axios.get(`/hotels/search?${params}`);
      console.log("✅ Search results:", res.data.length);
      return { success: true, data: res.data };
    } catch (err) {
      console.error("❌ Search failed:", err);
      return {
        success: false,
        message: err.response?.data?.message || "Search failed",
      };
    }
  };

  // Booking Functions
// ✅ Also update fetchMyBookings method
const fetchMyBookings = async () => {
  try {
    console.log("📡 Fetching bookings...");
    const response = await axios.get("/bookings/my", {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.data.success) {
      setMyBookings(response.data.bookings);
      console.log("✅ Bookings fetched:", response.data.bookings.length);
      return response.data.bookings;
    } else {
      throw new Error(response.data.message);
    }
  } catch (err) {
    console.error("❌ Failed to fetch bookings:", err);
    throw err;
  }
};

const createBooking = async (bookingData) => {
  try {
    console.log('📦 Creating booking:', bookingData);
    
    // ✅ FIXED: Use correct endpoint
    const response = await axios.post('/bookings', bookingData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('📦 Booking response:', response.data);

    if (response.data.success) {
      console.log('✅ Booking created successfully:', response.data.booking);
      return { 
        success: true, 
        data: response.data.booking,
        message: response.data.message 
      };
    } else {
      console.error('❌ Booking creation failed:', response.data.message);
      return { 
        success: false, 
        message: response.data.message 
      };
    }
  } catch (err) {
    console.error('❌ Booking creation error:', err);
    const errorMessage = err.response?.data?.message || err.message || 'Failed to create booking';
    return { 
      success: false, 
      message: errorMessage 
    };
  }
};

  const selectHotel = (hotel) => {
    setSelectedHotel(hotel);
  };

  // Initialize data
  useEffect(() => {
    if (user && token) {
      fetchHotels();
      fetchMyBookings();
    }
  }, [user, token]);

  return (
    <AppContext.Provider
      value={{
        // Auth
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAdmin,

        // Hotels
        hotels,
        featuredHotels,
        fetchHotels,
        fetchHotelById,
        selectedHotel,
        selectHotel,
        searchHotels,

        // Bookings
        myBookings,
        fetchMyBookings,
        createBooking,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};