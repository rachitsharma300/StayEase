// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AuthContext";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Hotel Pages
// import HotelList from "./pages/hotels/HotelList";
// import HotelDetails from "./pages/hotels/HotelDetails";
import SearchResults from "./pages/hotels/SearchResults";

// Booking Pages
import Checkout from "./pages/hotels/Checkout";
import MyBookings from "./pages/hotels/MyBookings";
import Payment from "./pages/booking/Payment";

// Admin Page
import Admin from "./pages/Admin";

// Components
import ProtectedRoute from "./components/ProtectedRoutes";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          {/* <Route path="/" element={<HotelList />} /> */}
          <Route path="/" element={<SearchResults />} /> {/* Temporary until HotelList is created */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* <Route path="/hotel/:id" element={<HotelDetails />} /> */}
          <Route path="/search" element={<SearchResults />} />

          {/* Protected Routes */}
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />

          {/* Admin Only Route */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="ADMIN">
                <Admin />
              </ProtectedRoute>
            }
          />

          {/* 404 Page */}
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900">404</h1>
                <p className="text-gray-600 mt-2">Page not found</p>
              </div>
            </div>
          } />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}