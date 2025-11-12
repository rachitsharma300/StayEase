import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

// 1️⃣ Create Context
const AppContext = createContext();

// 2️⃣ Custom hook for easy usage
export const useApp = () => useContext(AppContext);

// 3️⃣ Provider
export const AppProvider = ({ children }) => {
  const navigate = useNavigate();

  /** 🔹 AUTH / USER STATE */
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(
    () => localStorage.getItem("token") || null
  );
  const [loading, setLoading] = useState(false);

  /** 🔹 HOTEL / BOOKING STATE */
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [myBookings, setMyBookings] = useState([]);

  /** 🔹 AUTH FUNCTIONS */
  const login = async (username, password) => {
    try {
      setLoading(true);
      const res = await axios.post("/auth/login", { username, password });
      const { token, username: uname, role } = res.data;

      const userData = { username: uname, role };
      setUser(userData);
      setToken(token);

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);

      console.log("✅ Login successful. Token saved:", token.substring(0, 20) + "...");

      if (role === "ADMIN") navigate("/admin");
      else navigate("/");

      return { success: true };
    } catch (err) {
      console.error("❌ Login error:", err);
      return {
        success: false,
        message: err.response?.data?.message || "Login failed",
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (fullName, username, email, password) => {
    try {
      setLoading(true);
      const res = await axios.post("/auth/register", {
        fullName,
        username,
        email,
        password,
      });
      return { success: true, data: res.data };
    } catch (err) {
      console.error("❌ Registration error:", err);
      return {
        success: false,
        message: err.response?.data?.message || "Registration failed",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    console.log("✅ Logged out successfully");
    navigate("/auth/login");
  };

  const isAdmin = () => user?.role === "ADMIN";

  /** 🔹 HOTEL FUNCTIONS */
  const fetchHotels = async () => {
    try {
      console.log("📡 Fetching hotels...");
      const res = await axios.get("/hotels");
      setHotels(res.data);
      console.log("✅ Hotels fetched:", res.data.length);
    } catch (err) {
      console.error("❌ Failed to fetch hotels:", err.response?.data || err.message);
      if (err.response?.status === 403) {
        console.error("🔒 Token might be invalid. Try logging in again.");
      }
    }
  };

  const selectHotel = (hotel) => {
    setSelectedHotel(hotel);
    navigate(`/hotels/${hotel.id}`);
  };

  /** 🔹 BOOKING FUNCTIONS */
  const fetchMyBookings = async () => {
    try {
      console.log("📡 Fetching bookings...");
      const res = await axios.get("/booking/my");
      setMyBookings(res.data);
      console.log("✅ Bookings fetched:", res.data.length);
    } catch (err) {
      console.error("❌ Failed to fetch bookings:", err.response?.data || err.message);
      if (err.response?.status === 403) {
        console.error("🔒 Token might be invalid. Try logging in again.");
      }
    }
  };

  const createBooking = async (bookingData) => {
    try {
      const res = await axios.post("/booking/create", bookingData);
      await fetchMyBookings(); // refresh bookings
      return { success: true, data: res.data };
    } catch (err) {
      console.error("❌ Booking failed:", err);
      return {
        success: false,
        message: err.response?.data?.message || "Booking failed",
      };
    }
  };

  /** 🔹 SEARCH FUNCTION */
  const searchHotels = async (searchParams) => {
    try {
      console.log("🔍 Searching hotels with:", searchParams);
      const res = await axios.get("/hotels/search", {
        params: { location: searchParams.location },
      });
      console.log("✅ Search results:", res.data.length);
      return { success: true, data: res.data };
    } catch (err) {
      console.error("❌ Search failed:", err.response?.data || err.message);
      return {
        success: false,
        message: err.response?.data?.message || "Search failed",
      };
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAdmin,
        hotels,
        fetchHotels,
        selectedHotel,
        selectHotel,
        myBookings,
        fetchMyBookings,
        createBooking,
        searchHotels,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};