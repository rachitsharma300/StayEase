// pages/booking/MyBookings.jsx
import { useState, useEffect } from 'react';
import { useApp } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';

const MyBookings = () => {
  const { user, myBookings, fetchMyBookings } = useApp();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const successMessage = location.state?.message;

  useEffect(() => {
    const loadBookings = async () => {
      setLoading(true);
      await fetchMyBookings();
      setLoading(false);
    };
    
    loadBookings();
  }, []);

  const filteredBookings = myBookings.filter(booking => {
    if (activeTab === 'all') return true;
    if (activeTab === 'upcoming') {
      return new Date(booking.checkIn) > new Date() && booking.status === 'CONFIRMED';
    }
    if (activeTab === 'completed') {
      return new Date(booking.checkOut) < new Date();
    }
    if (activeTab === 'cancelled') {
      return booking.status === 'CANCELLED';
    }
    return true;
  }).filter(booking => 
    booking.hotelName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.roomType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.id?.toString().includes(searchTerm)
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-green-100 text-green-800 border border-green-200';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border border-red-200';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800 border border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'CONFIRMED': return '✅';
      case 'PENDING': return '⏳';
      case 'CANCELLED': return '❌';
      case 'COMPLETED': return '✅';
      default: return '📋';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const calculateNights = (checkIn, checkOut) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      // Implement cancel booking functionality
      alert('Cancellation feature will be implemented here');
    }
  };

  const getTimeDifference = (checkInDate) => {
    const now = new Date();
    const checkIn = new Date(checkInDate);
    const diffTime = checkIn - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays > 1) return `In ${diffDays} days`;
    return 'Past';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading your bookings...</p>
          <p className="text-gray-500 text-sm mt-2">Please wait while we fetch your reservations</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">My Bookings</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Manage and track all your hotel reservations in one place
          </p>
        </div>
                {/* Enhanced Booking Stats */}
        {myBookings.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl p-6 text-center text-white">
              <div className="text-3xl font-bold">{myBookings.length}</div>
              <div className="text-blue-100">Total Bookings</div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl p-6 text-center text-white">
              <div className="text-3xl font-bold">
                {myBookings.filter(b => b.status === 'CONFIRMED').length}
              </div>
              <div className="text-green-100">Confirmed</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-xl p-6 text-center text-white">
              <div className="text-3xl font-bold">
                {myBookings.filter(b => new Date(b.checkIn) > new Date() && b.status === 'CONFIRMED').length}
              </div>
              <div className="text-purple-100">Upcoming</div>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-xl p-6 text-center text-white">
              <div className="text-3xl font-bold">
                ₹{myBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0).toLocaleString()}
              </div>
              <div className="text-orange-100">Total Spent</div>
            </div>
          </div>
        )}

        {/* Success Message with better styling */}
        {successMessage && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl mb-8 shadow-sm flex items-center">
            <svg className="w-5 h-5 mr-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {successMessage}
          </div>
        )}

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by hotel name, room type, or booking ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                />
              </div>
            </div>

            {/* Tabs with enhanced design */}
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all', label: 'All Bookings', count: myBookings.length },
                { key: 'upcoming', label: 'Upcoming', count: myBookings.filter(b => new Date(b.checkIn) > new Date() && b.status === 'CONFIRMED').length },
                { key: 'completed', label: 'Completed', count: myBookings.filter(b => new Date(b.checkOut) < new Date()).length },
                { key: 'cancelled', label: 'Cancelled', count: myBookings.filter(b => b.status === 'CANCELLED').length }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition duration-200 font-medium ${
                    activeTab === tab.key
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`px-2 py-1 text-xs rounded-full font-bold ${
                    activeTab === tab.key
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-300 text-gray-700'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bookings List with enhanced cards */}
        <div className="space-y-6">
          {filteredBookings.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-16 text-center border border-gray-100">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No bookings found</h3>
              <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                {activeTab === 'all' 
                  ? "You haven't made any bookings yet. Start exploring our amazing hotels!"
                  : `No ${activeTab} bookings match your current filters.`
                }
              </p>
              {activeTab === 'all' && (
                <button 
                  onClick={() => window.location.href = '/'}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl hover:shadow-lg transition duration-200 font-semibold text-lg shadow-lg shadow-blue-500/25"
                >
                  Explore Hotels
                </button>
              )}
            </div>
          ) : (
            filteredBookings.map(booking => (
              <div key={booking.id} className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition duration-300 transform hover:-translate-y-1">
                <div className="p-8">
                  {/* Header with status and timing */}
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                    <div className="flex items-center space-x-3 mb-4 lg:mb-0">
                      <span className="text-2xl">{getStatusIcon(booking.status)}</span>
                      <div>
                        <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </div>
                        {booking.status === 'CONFIRMED' && new Date(booking.checkIn) > new Date() && (
                          <p className="text-sm text-blue-600 font-medium mt-1">
                            🗓️ {getTimeDifference(booking.checkIn)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        ₹{booking.totalAmount?.toLocaleString() || '0'}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Booking ID: <span className="font-mono font-semibold">#{booking.id}</span>
                      </p>
                    </div>
                  </div>

                  {/* Main booking info */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Hotel and Room Details */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{booking.hotelName || 'Hotel'}</h3>
                        <div className="flex items-center space-x-4 text-gray-600">
                          <span className="flex items-center space-x-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                            </svg>
                            <span>{booking.roomType || 'Room'}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
                            </svg>
                            <span>{booking.guests} Guests</span>
                          </span>
                        </div>
                      </div>

                      {/* Date and Duration */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                        <div className="text-center">
                          <div className="text-sm text-gray-600 font-medium">Check-in</div>
                          <div className="text-lg font-bold text-gray-900">{formatDate(booking.checkIn)}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-600 font-medium">Duration</div>
                          <div className="text-lg font-bold text-gray-900">{calculateNights(booking.checkIn, booking.checkOut)} nights</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-600 font-medium">Check-out</div>
                          <div className="text-lg font-bold text-gray-900">{formatDate(booking.checkOut)}</div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col justify-center space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        {booking.status === 'CONFIRMED' && new Date(booking.checkIn) > new Date() && (
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            className="px-4 py-3 border border-red-600 text-red-600 rounded-xl hover:bg-red-50 transition duration-200 font-semibold flex items-center justify-center space-x-2"
                          >
                            <span>❌</span>
                            <span>Cancel</span>
                          </button>
                        )}
                        <button className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition duration-200 font-semibold flex items-center justify-center space-x-2">
                          <span>👁️</span>
                          <span>Details</span>
                        </button>
                        <button className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition duration-200 font-semibold flex items-center justify-center space-x-2">
                          <span>📄</span>
                          <span>Invoice</span>
                        </button>
                        {booking.status === 'CONFIRMED' && new Date(booking.checkIn) <= new Date() && (
                          <button className="px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg transition duration-200 font-semibold flex items-center justify-center space-x-2">
                            <span>🏨</span>
                            <span>Check-in</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>


      </div>
    </div>
  );
};

export default MyBookings;