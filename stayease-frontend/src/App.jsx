// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import ErrorBoundary from "./components/ErrorBoundary";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Hotel Pages
import HotelList from "./pages/hotels/HotelList";
import HotelDetails from "./pages/hotels/HotelDetails";
import SearchResults from "./pages/hotels/SearchResults";

// Booking Pages
import Checkout from "./pages/hotels/Checkout";
import MyBookings from "./pages/hotels/MyBookings";
import Payment from "./pages/booking/Payment";

// Admin Page
import Admin from "./pages/Admin";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AppProvider>
          <ToastProvider>
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <main>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<HotelList />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/hotel/:id" element={<HotelDetails />} />
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
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                        <p className="text-gray-600 mb-4">Page not found</p>
                        <a href="/" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                          Go Home
                        </a>
                      </div>
                    </div>
                  } />
                </Routes>
              </main>
               <Footer />
            </div>
          </ToastProvider>
        </AppProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}