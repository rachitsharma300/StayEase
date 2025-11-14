// pages/admin/Admin.jsx
import { useState, useEffect } from 'react';
import { useApp } from '../context/AuthContext';
import axios from '../api/axios';
import { useToast } from '../context/ToastContext';

const Admin = () => {
  const { user } = useApp();
  const { success, error } = useToast();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalHotels: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingBookings: 0,
    confirmedBookings: 0
  });
  const [users, setUsers] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Hotel Form State
  const [showHotelForm, setShowHotelForm] = useState(false);
  const [newHotel, setNewHotel] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    state: '',
    rating: 4,
    amenities: [],
    images: []
  });
  const [newAmenity, setNewAmenity] = useState('');

  // Add Room Form State
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState({
    roomNumber: '',
    type: 'Standard',
    pricePerNight: 0,
    capacity: 2,
    size: 300,
    features: [],
    available: true
  });
  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load dashboard stats
      const statsResponse = await axios.get('/admin/dashboard/stats');
      if (statsResponse.data.success) {
        setStats(statsResponse.data);
      }

      // Load recent activity
      const activityResponse = await axios.get('/admin/recent-activity');
      if (activityResponse.data.success) {
        setRecentActivity(activityResponse.data.activity);
      }

    } catch (err) {
      console.error('❌ Error loading dashboard data:', err);
      error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await axios.get('/admin/users');
      if (response.data.success) {
        setUsers(response.data.users);
      }
    } catch (err) {
      console.error('Error loading users:', err);
      error('Failed to load users');
    }
  };

  const loadHotels = async () => {
    try {
      const response = await axios.get('/admin/hotels');
      if (response.data.success) {
        setHotels(response.data.hotels);
      }
    } catch (err) {
      console.error('Error loading hotels:', err);
      error('Failed to load hotels');
    }
  };

  const loadBookings = async () => {
    try {
      const response = await axios.get('/admin/bookings');
      if (response.data.success) {
        setBookings(response.data.bookings);
      }
    } catch (err) {
      console.error('Error loading bookings:', err);
      error('Failed to load bookings');
    }
  };

  const loadHotelRooms = async (hotelId) => {
    try {
      const response = await axios.get(`/admin/hotels/${hotelId}/rooms`);
      if (response.data.success) {
        setRooms(response.data.rooms);
      }
    } catch (err) {
      console.error('Error loading rooms:', err);
      error('Failed to load rooms');
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    
    if (tab === 'users') {
      loadUsers();
    } else if (tab === 'hotels') {
      loadHotels();
    } else if (tab === 'bookings') {
      loadBookings();
    } else if (tab === 'activity') {
      loadRecentActivity();
    }
  };

  const loadRecentActivity = async () => {
    try {
      const response = await axios.get('/admin/recent-activity');
      if (response.data.success) {
        setRecentActivity(response.data.activity);
      }
    } catch (err) {
      console.error('Error loading recent activity:', err);
      error('Failed to load recent activity');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`/admin/users/${userId}`);
        success('User deleted successfully');
        loadUsers();
      } catch (err) {
        error('Failed to delete user');
      }
    }
  };

  const handleDeleteHotel = async (hotelId) => {
    if (window.confirm('Are you sure you want to delete this hotel?')) {
      try {
        await axios.delete(`/admin/hotels/${hotelId}`);
        success('Hotel deleted successfully');
        loadHotels();
        loadDashboardData(); // Refresh stats
      } catch (err) {
        error('Failed to delete hotel');
      }
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        await axios.delete(`/admin/rooms/${roomId}`);
        success('Room deleted successfully');
        if (selectedHotel) {
          loadHotelRooms(selectedHotel.id);
        }
      } catch (err) {
        error('Failed to delete room');
      }
    }
  };

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      await axios.put(`/admin/bookings/${bookingId}/status`, { status: newStatus });
      success('Booking status updated successfully');
      loadBookings();
      loadDashboardData(); // Refresh stats
    } catch (err) {
      error('Failed to update booking status');
    }
  };

  const handleAddHotel = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/admin/hotels', newHotel);
      success('Hotel added successfully');
      setShowHotelForm(false);
      setNewHotel({
        name: '',
        description: '',
        address: '',
        city: '',
        state: '',
        rating: 4,
        amenities: [],
        images: []
      });
      loadHotels();
      loadDashboardData(); // Refresh stats
    } catch (err) {
      error('Failed to add hotel');
    }
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/admin/hotels/${selectedHotel.id}/rooms`, newRoom);
      success('Room added successfully');
      setShowRoomForm(false);
      setNewRoom({
        roomNumber: '',
        type: 'Standard',
        pricePerNight: 0,
        capacity: 2,
        size: 300,
        features: [],
        available: true
      });
      setNewFeature('');
      loadHotelRooms(selectedHotel.id);
    } catch (err) {
      error('Failed to add room');
    }
  };

  const handleAddAmenity = () => {
    if (newAmenity.trim() && !newHotel.amenities.includes(newAmenity.trim())) {
      setNewHotel(prev => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()]
      }));
      setNewAmenity('');
    }
  };

  const handleRemoveAmenity = (amenityToRemove) => {
    setNewHotel(prev => ({
      ...prev,
      amenities: prev.amenities.filter(amenity => amenity !== amenityToRemove)
    }));
  };

  const handleAddFeature = () => {
    if (newFeature.trim() && !newRoom.features.includes(newFeature.trim())) {
      setNewRoom(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (featureToRemove) => {
    setNewRoom(prev => ({
      ...prev,
      features: prev.features.filter(feature => feature !== featureToRemove)
    }));
  };

  const handleViewRooms = async (hotel) => {
    setSelectedHotel(hotel);
    await loadHotelRooms(hotel.id);
    setShowRoomForm(false);
  };

  const handleAddRoomClick = (hotel) => {
    setSelectedHotel(hotel);
    setShowRoomForm(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateTimeString) => {
    return new Date(dateTimeString).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'CONFIRMED': { color: 'green', text: 'Confirmed' },
      'PENDING': { color: 'yellow', text: 'Pending' },
      'CANCELLED': { color: 'red', text: 'Cancelled' },
      'COMPLETED': { color: 'blue', text: 'Completed' }
    };
    
    const config = statusConfig[status] || { color: 'gray', text: status };
    
    return `bg-${config.color}-100 text-${config.color}-800`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 font-medium">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Welcome back, {user?.username}! Manage your hotel booking system.
              </p>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
              {user?.role} • {formatDateTime(new Date().toISOString())}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Hotels</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalHotels}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalBookings}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.confirmedBookings} confirmed • {stats.pendingBookings} pending
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-orange-500 hover:shadow-xl transition duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">₹{stats.totalRevenue?.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-xl">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Tabs Navigation */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {[
                { key: 'overview', label: 'Overview', icon: '📊' },
                { key: 'users', label: 'Users', icon: '👥' },
                { key: 'hotels', label: 'Hotels', icon: '🏨' },
                { key: 'bookings', label: 'Bookings', icon: '📋' },
                { key: 'activity', label: 'Recent Activity', icon: '🕒' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => handleTabChange(tab.key)}
                  className={`flex items-center py-4 px-6 text-center border-b-2 font-medium text-sm transition duration-200 ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2 text-lg">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Activity */}
                  <div className="bg-white border border-gray-200 rounded-2xl">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-2xl">
                      <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                    </div>
                    <div className="p-6">
                      {recentActivity.length > 0 ? (
                        <div className="space-y-4">
                          {recentActivity.slice(0, 5).map((activity) => (
                            <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                              <span className="text-lg mt-1">{activity.icon}</span>
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">{activity.message}</p>
                                <p className="text-sm text-gray-600">
                                  {formatDateTime(activity.timestamp)} • by {activity.user}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-8">No recent activity</p>
                      )}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-white border border-gray-200 rounded-2xl">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-2xl">
                      <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-2 gap-4">
                        <button 
                          onClick={() => handleTabChange('users')}
                          className="p-4 bg-blue-50 rounded-xl text-center hover:bg-blue-100 transition duration-200 border border-blue-100"
                        >
                          <div className="text-blue-600 text-2xl mb-2">👥</div>
                          <div className="text-sm font-medium text-gray-900">Manage Users</div>
                        </button>
                        <button 
                          onClick={() => handleTabChange('bookings')}
                          className="p-4 bg-green-50 rounded-xl text-center hover:bg-green-100 transition duration-200 border border-green-100"
                        >
                          <div className="text-green-600 text-2xl mb-2">📋</div>
                          <div className="text-sm font-medium text-gray-900">Manage Bookings</div>
                        </button>
                        <button 
                          onClick={() => setShowHotelForm(true)}
                          className="p-4 bg-purple-50 rounded-xl text-center hover:bg-purple-100 transition duration-200 border border-purple-100"
                        >
                          <div className="text-purple-600 text-2xl mb-2">🏨</div>
                          <div className="text-sm font-medium text-gray-900">Add Hotel</div>
                        </button>
                        <button 
                          onClick={() => handleTabChange('hotels')}
                          className="p-4 bg-orange-50 rounded-xl text-center hover:bg-orange-100 transition duration-200 border border-orange-100"
                        >
                          <div className="text-orange-600 text-2xl mb-2">🏢</div>
                          <div className="text-sm font-medium text-gray-900">View Hotels</div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                  <span className="text-sm text-gray-600">{users.length} users found</span>
                </div>
                
                <div className="overflow-hidden border border-gray-200 rounded-2xl">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50 transition duration-200">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                                {user.username?.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-gray-900">{user.username}</div>
                                <div className="text-sm text-gray-500">{user.fullName}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                              user.role === 'ADMIN' 
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(user.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600 hover:text-red-900 transition duration-200 font-semibold"
                              disabled={user.role === 'ADMIN'}
                            >
                              {user.role === 'ADMIN' ? 'Protected' : 'Delete'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Hotels Tab */}
            {activeTab === 'hotels' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Hotel Management</h3>
                    <p className="text-sm text-gray-600 mt-1">Manage all hotels in the system</p>
                  </div>
                  <div className="flex space-x-4">
                    <span className="text-sm text-gray-600">{hotels.length} hotels found</span>
                    <button 
                      onClick={() => setShowHotelForm(true)}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 font-semibold transition duration-200"
                    >
                      + Add Hotel
                    </button>
                  </div>
                </div>

                {/* Hotel Rooms Section */}
                {selectedHotel && (
                  <div className="mb-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h4 className="text-xl font-semibold text-gray-900">Rooms for {selectedHotel.name}</h4>
                        <p className="text-sm text-gray-600">Manage rooms for this hotel</p>
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => setSelectedHotel(null)}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200 font-semibold"
                        >
                          Back to Hotels
                        </button>
                        <button
                          onClick={() => handleAddRoomClick(selectedHotel)}
                          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200 font-semibold"
                        >
                          + Add Room
                        </button>
                      </div>
                    </div>

                    {/* Rooms List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {rooms.map((room) => (
                        <div key={room.id} className="bg-white border border-gray-200 rounded-xl p-4">
                          <div className="flex justify-between items-start mb-3">
                            <h5 className="font-semibold text-gray-900">Room {room.roomNumber}</h5>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              room.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {room.available ? 'Available' : 'Occupied'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{room.type}</p>
                          <p className="text-lg font-bold text-blue-600 mb-2">₹{room.pricePerNight}/night</p>
                          <div className="text-sm text-gray-500 mb-3">
                            <span>Capacity: {room.capacity} • Size: {room.size} sq.ft</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {room.features?.slice(0, 3).map((feature, index) => (
                              <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                {feature}
                              </span>
                            ))}
                            {room.features?.length > 3 && (
                              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                +{room.features.length - 3} more
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => handleDeleteRoom(room.id)}
                            className="w-full bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100 transition duration-200 font-semibold text-sm"
                          >
                            Delete Room
                          </button>
                        </div>
                      ))}
                    </div>

                    {rooms.length === 0 && (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl">🏨</span>
                        </div>
                        <h5 className="text-lg font-semibold text-gray-900 mb-2">No Rooms Added</h5>
                        <p className="text-gray-600 mb-4">Add rooms to make this hotel bookable</p>
                        <button
                          onClick={() => handleAddRoomClick(selectedHotel)}
                          className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition duration-200 font-semibold"
                        >
                          Add First Room
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Hotels List */}
                {!selectedHotel && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {hotels.map((hotel) => (
                      <div key={hotel.id} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition duration-200">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="text-lg font-semibold text-gray-900">{hotel.name}</h4>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
                            ⭐ {hotel.rating}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-4">{hotel.city}, {hotel.state}</p>
                        <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                          <span>Rooms: {hotel.totalRooms}</span>
                          <span>Available: {hotel.availableRooms}</span>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewRooms(hotel)}
                            className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200 font-semibold text-sm"
                          >
                            View Rooms
                          </button>
                          <button
                            onClick={() => handleDeleteHotel(hotel.id)}
                            className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100 transition duration-200 font-semibold text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Booking Management</h3>
                  <span className="text-sm text-gray-600">{bookings.length} bookings found</span>
                </div>
                
                <div className="overflow-hidden border border-gray-200 rounded-2xl">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Booking ID</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Hotel</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Dates</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {bookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-gray-50 transition duration-200">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">#{booking.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.hotelName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.userName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div>{formatDate(booking.checkIn)}</div>
                            <div>to {formatDate(booking.checkOut)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                            ₹{booking.totalAmount?.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(booking.status)}`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            {booking.status === 'PENDING' && (
                              <button
                                onClick={() => handleUpdateBookingStatus(booking.id, 'CONFIRMED')}
                                className="text-green-600 hover:text-green-900 transition duration-200 font-semibold"
                              >
                                Confirm
                              </button>
                            )}
                            <button
                              onClick={() => handleUpdateBookingStatus(booking.id, 'CANCELLED')}
                              className="text-red-600 hover:text-red-900 transition duration-200 font-semibold"
                            >
                              Cancel
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Recent Activity Tab */}
            {activeTab === 'activity' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                  <button 
                    onClick={loadRecentActivity}
                    className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition duration-200 font-semibold"
                  >
                    Refresh
                  </button>
                </div>
                
                <div className="space-y-4">
                  {recentActivity.length > 0 ? (
                    recentActivity.map((activity) => (
                      <div key={activity.id} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition duration-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl">
                              {activity.icon}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{activity.message}</p>
                              <p className="text-sm text-gray-600 mt-1">
                                {formatDateTime(activity.timestamp)} • by {activity.user}
                              </p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            activity.type === 'booking' ? 'bg-purple-100 text-purple-800' :
                            activity.type === 'user' ? 'bg-green-100 text-green-800' :
                            activity.type === 'payment' ? 'bg-blue-100 text-blue-800' :
                            'bg-orange-100 text-orange-800'
                          }`}>
                            {activity.type}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-2xl">📊</span>
                      </div>
                      <h3 className="text-2xl font-semibold text-gray-900 mb-3">No Activity Yet</h3>
                      <p className="text-gray-600 mb-6">System activity will appear here as users interact with the platform.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Hotel Modal */}
      {showHotelForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">Add New Hotel</h3>
                <button 
                  onClick={() => setShowHotelForm(false)}
                  className="text-gray-400 hover:text-gray-600 transition duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <form onSubmit={handleAddHotel} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Hotel Name</label>
                  <input
                    type="text"
                    required
                    value={newHotel.name}
                    onChange={(e) => setNewHotel(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="Enter hotel name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Rating</label>
                  <select
                    value={newHotel.rating}
                    onChange={(e) => setNewHotel(prev => ({ ...prev, rating: parseFloat(e.target.value) }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  >
                    {[1, 2, 3, 4, 5].map(rating => (
                      <option key={rating} value={rating}>{rating} Star{rating > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  required
                  value={newHotel.description}
                  onChange={(e) => setNewHotel(prev => ({ ...prev, description: e.target.value }))}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  placeholder="Enter hotel description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    required
                    value={newHotel.city}
                    onChange={(e) => setNewHotel(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="Enter city"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                  <input
                    type="text"
                    required
                    value={newHotel.state}
                    onChange={(e) => setNewHotel(prev => ({ ...prev, state: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="Enter state"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  required
                  value={newHotel.address}
                  onChange={(e) => setNewHotel(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  placeholder="Enter full address"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Amenities</label>
                <div className="flex space-x-2 mb-3">
                  <input
                    type="text"
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="Add amenity"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAmenity())}
                  />
                  <button
                    type="button"
                    onClick={handleAddAmenity}
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-200 font-semibold"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {newHotel.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1"
                    >
                      <span>{amenity}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAmenity(amenity)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowHotelForm(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition duration-200 font-semibold shadow-lg"
                >
                  Add Hotel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Room Modal */}
      {showRoomForm && selectedHotel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">Add Room to {selectedHotel.name}</h3>
                <button 
                  onClick={() => setShowRoomForm(false)}
                  className="text-gray-400 hover:text-gray-600 transition duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <form onSubmit={handleAddRoom} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Room Number</label>
                  <input
                    type="text"
                    required
                    value={newRoom.roomNumber}
                    onChange={(e) => setNewRoom(prev => ({ ...prev, roomNumber: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="e.g., 101, 201"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Room Type</label>
                  <select
                    value={newRoom.type}
                    onChange={(e) => setNewRoom(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Suite">Suite</option>
                    <option value="Executive">Executive</option>
                    <option value="Presidential">Presidential</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Price Per Night (₹)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={newRoom.pricePerNight}
                    onChange={(e) => setNewRoom(prev => ({ ...prev, pricePerNight: parseFloat(e.target.value) }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="Enter price"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Capacity</label>
                  <select
                    value={newRoom.capacity}
                    onChange={(e) => setNewRoom(prev => ({ ...prev, capacity: parseInt(e.target.value) }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  >
                    <option value={1}>1 Guest</option>
                    <option value={2}>2 Guests</option>
                    <option value={3}>3 Guests</option>
                    <option value={4}>4 Guests</option>
                    <option value={5}>5+ Guests</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Room Size (sq.ft)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={newRoom.size}
                  onChange={(e) => setNewRoom(prev => ({ ...prev, size: parseInt(e.target.value) }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  placeholder="Enter room size"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Room Features</label>
                <div className="flex space-x-2 mb-3">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="Add feature (e.g., AC, TV, WiFi)"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-200 font-semibold"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {newRoom.features.map((feature, index) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1"
                    >
                      <span>{feature}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(feature)}
                        className="text-green-600 hover:text-green-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowRoomForm(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-3 rounded-lg hover:from-green-600 hover:to-blue-700 transition duration-200 font-semibold shadow-lg"
                >
                  Add Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;