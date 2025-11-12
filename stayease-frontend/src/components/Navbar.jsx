// components/Navbar.jsx
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <span className="text-xl font-bold text-gray-800">StayEase</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`${isActive('/') ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'} font-medium transition duration-200`}
            >
              Hotels
            </Link>
            
            {user && (
              <>
                <Link 
                  to="/my-bookings" 
                  className={`${isActive('/my-bookings') ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'} font-medium transition duration-200`}
                >
                  My Bookings
                </Link>
                
                {isAdmin() && (
                  <Link 
                    to="/admin" 
                    className={`${isActive('/admin') ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'} font-medium transition duration-200`}
                  >
                    Admin Dashboard
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Auth Buttons / User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition duration-200">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user.username?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-gray-700 font-medium">{user.username}</span>
                  <span className="text-blue-600">▼</span>
                </button>
                
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm text-gray-600">Signed in as</p>
                    <p className="text-sm font-medium text-gray-800">{user.username}</p>
                    <p className="text-xs text-blue-600 capitalize">{user.role?.toLowerCase()}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-200"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-gray-600 hover:text-blue-600 font-medium transition duration-200"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium transition duration-200"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-gray-600 hover:text-blue-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Hotels
              </Link>
              
              {user && (
                <>
                  <Link 
                    to="/my-bookings" 
                    className="text-gray-600 hover:text-blue-600 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Bookings
                  </Link>
                  
                  {isAdmin() && (
                    <Link 
                      to="/admin" 
                      className="text-gray-600 hover:text-blue-600 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-sm text-gray-500">Signed in as {user.username}</p>
                    <button
                      onClick={handleLogout}
                      className="text-red-600 hover:text-red-700 font-medium mt-2"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              )}
              
              {!user && (
                <div className="flex space-x-4 pt-2 border-t border-gray-200">
                  <Link 
                    to="/login" 
                    className="text-gray-600 hover:text-blue-600 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="text-blue-600 hover:text-blue-700 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;