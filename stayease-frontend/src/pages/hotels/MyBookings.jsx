// pages/booking/MyBookings.jsx
import { useState, useEffect } from 'react';
import { useApp } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';

const MyBookings = () => {
  const { user, myBookings, fetchMyBookings } = useApp();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);

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
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600 mt-2">Manage and view your hotel reservations</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-6">
            {successMessage}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap gap-4">
            {[
              { key: 'all', label: 'All Bookings', count: myBookings.length },
              { key: 'upcoming', label: 'Upcoming', count: myBookings.filter(b => new Date(b.checkIn) > new Date() && b.status === 'CONFIRMED').length },
              { key: 'completed', label: 'Completed', count: myBookings.filter(b => new Date(b.checkOut) < new Date()).length },
              { key: 'cancelled', label: 'Cancelled', count: myBookings.filter(b => b.status === 'CANCELLED').length }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition duration-200 ${
                  activeTab === tab.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  activeTab === tab.key
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-300 text-gray-700'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-6">
          {filteredBookings.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings found</h3>
              <p className="text-gray-600 mb-6">
                {activeTab === 'all' 
                  ? "You haven't made any bookings yet."
                  : `No ${activeTab} bookings found.`
                }
              </p>
              {activeTab === 'all' && (
                <button 
                  onClick={() => window.location.href = '/'}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  Browse Hotels
                </button>
              )}
            </div>
          ) : (
            filteredBookings.map(booking => (
              <div key={booking.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    {/* Booking Info */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{booking.hotelName || 'Hotel'}</h3>
                          <p className="text-gray-600 mt-1">{booking.roomType || 'Room'} • {booking.guests} Guests</p>
                          
                          <div className="flex flex-wrap gap-4 mt-3">
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span>Check-in: {formatDate(booking.checkIn)}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span>Check-out: {formatDate(booking.checkOut)}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>{calculateNights(booking.checkIn, booking.checkOut)} nights</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 sm:mt-0 sm:text-right">
                          <div className="text-2xl font-bold text-gray-900">
                            ₹{booking.totalAmount?.toLocaleString() || '0'}
                          </div>
                          <div className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full mt-2 ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Booking ID: #{booking.id}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200">
                    {booking.status === 'CONFIRMED' && new Date(booking.checkIn) > new Date() && (
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition duration-200"
                      >
                        Cancel Booking
                      </button>
                    )}
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200">
                      View Details
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200">
                      Download Invoice
                    </button>
                    {booking.status === 'CONFIRMED' && new Date(booking.checkIn) <= new Date() && (
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200">
                        Check-in Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Booking Stats */}
        {myBookings.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-2xl font-bold text-blue-600">{myBookings.length}</div>
              <div className="text-gray-600">Total Bookings</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-2xl font-bold text-green-600">
                {myBookings.filter(b => b.status === 'CONFIRMED').length}
              </div>
              <div className="text-gray-600">Confirmed</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-2xl font-bold text-purple-600">
                ₹{myBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0).toLocaleString()}
              </div>
              <div className="text-gray-600">Total Spent</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;