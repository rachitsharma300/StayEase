// pages/hotels/HotelDetails.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AuthContext';
import axios from '../../api/axios';

const HotelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, selectHotel } = useApp();
  
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [bookingDates, setBookingDates] = useState({
    checkIn: location.state?.checkIn || '',
    checkOut: location.state?.checkOut || '',
    guests: location.state?.guests || 1
  });
  const [showAllAmenities, setShowAllAmenities] = useState(false);

  // Premium fallback images
  const fallbackImages = [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aG90ZWx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aG90ZWx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aG90ZWx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGhvdGVsfGVufDB8fDB8fHww&auto=format&fit=crop&w=1200&q=80'
  ];

  const getHotelImages = () => {
    if (!hotel) return fallbackImages;

    const images = [];
    
    if (hotel.images && Array.isArray(hotel.images) && hotel.images.length > 0) {
      images.push(...hotel.images);
    }
    
    if (hotel.image && !images.includes(hotel.image)) {
      images.push(hotel.image);
    }
    
    if (hotel.imageUrl && !images.includes(hotel.imageUrl)) {
      images.push(hotel.imageUrl);
    }
    
    if (hotel.photo && !images.includes(hotel.photo)) {
      images.push(hotel.photo);
    }

    return images.length === 0 ? fallbackImages : images;
  };

  const hotelImages = getHotelImages();

  useEffect(() => {
    fetchHotelDetails();
  }, [id, bookingDates.checkIn, bookingDates.checkOut]);

  const fetchHotelDetails = async () => {
    try {
      setLoading(true);
      setError('');

      const hotelResponse = await axios.get(`/hotels/${id}`);
      const hotelData = hotelResponse.data;
      setHotel(hotelData);

      const params = {};
      if (bookingDates.checkIn && bookingDates.checkOut) {
        params.checkIn = bookingDates.checkIn;
        params.checkOut = bookingDates.checkOut;
      }

      const roomsResponse = await axios.get(`/hotels/${id}/rooms`, { params });
      setRooms(roomsResponse.data);

    } catch (err) {
      setError('Failed to load hotel details');
      console.error('Hotel details error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (room) => {
    if (!user) {
      navigate('/login', { 
        state: { 
          returnUrl: `/hotel/${id}`,
          message: 'Please login to book this hotel'
        }
      });
      return;
    }

    if (!bookingDates.checkIn || !bookingDates.checkOut) {
      setError('Please select check-in and check-out dates');
      return;
    }

    setSelectedRoom(room);
    selectHotel(hotel);
    
    navigate('/checkout', {
      state: {
        room,
        hotel,
        checkIn: bookingDates.checkIn,
        checkOut: bookingDates.checkOut,
        guests: bookingDates.guests
      }
    });
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setBookingDates(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateNights = () => {
    if (!bookingDates.checkIn || !bookingDates.checkOut) return 0;
    const checkIn = new Date(bookingDates.checkIn);
    const checkOut = new Date(bookingDates.checkOut);
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  };

  const handleImageError = (e) => {
    setImageError(true);
    e.target.src = fallbackImages[0];
  };

  const getRoomImage = (room) => {
    if (room.image) return room.image;
    if (room.imageUrl) return room.imageUrl;
    if (room.photo) return room.photo;
    
    const roomType = room.type?.toLowerCase() || 'standard';
    if (roomType.includes('deluxe') || roomType.includes('premium')) {
      return 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
    } else if (roomType.includes('suite')) {
      return 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
    } else {
      return 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Discovering Your Perfect Stay</h3>
          <p className="text-gray-600">Loading hotel details...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !hotel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Oops! Hotel Not Found</h2>
          <p className="text-gray-600 text-lg mb-8">{error || 'The hotel you are looking for is not available.'}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl hover:shadow-xl transition duration-300 font-semibold hover:scale-105 transform"
            >
              Explore More Hotels
            </button>
            <button 
              onClick={fetchHotelDetails}
              className="border-2 border-gray-300 text-gray-700 px-6 py-4 rounded-2xl hover:bg-gray-50 transition duration-300 font-semibold"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const nights = calculateNights();
  const displayedAmenities = showAllAmenities ? hotel.amenities : (hotel.amenities?.slice(0, 8) || []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section with Image Gallery */}
      <div className="relative">
        <div className="h-96 lg:h-[500px] relative overflow-hidden">
          <img
            src={hotelImages[activeImage]}
            alt={hotel.name}
            className="w-full h-full object-cover transition-transform duration-500"
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-black/40"></div>
          
          {/* Navigation Arrows */}
          {hotelImages.length > 1 && (
            <>
              <button
                onClick={() => setActiveImage(prev => prev > 0 ? prev - 1 : hotelImages.length - 1)}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => setActiveImage(prev => prev < hotelImages.length - 1 ? prev + 1 : 0)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
            {activeImage + 1} / {hotelImages.length}
          </div>

          {/* Back Button */}
          <button
            onClick={() => navigate('/')}
            className="absolute top-6 left-6 bg-white/90 hover:bg-white text-gray-800 px-4 py-2 rounded-2xl flex items-center space-x-2 transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-semibold">Back to Hotels</span>
          </button>
        </div>

        {/* Hotel Info Overlay */}
  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-6 lg:p-8">
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl lg:text-5xl font-bold text-white mb-3 lg:mb-4">{hotel.name}</h1>
      <div className="flex flex-wrap items-center gap-3 text-white/90">
        <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-3 py-1 lg:px-4 lg:py-2 rounded-2xl">
          <span className="text-yellow-400">★</span>
          <span className="font-semibold text-sm lg:text-base">{hotel.rating || '4.2'}</span>
          <span className="text-sm lg:text-base">({hotel.totalReviews || '120'} reviews)</span>
        </div>
        <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-3 py-1 lg:px-4 lg:py-2 rounded-2xl">
          <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          <span className="text-sm lg:text-base">{hotel.city}, {hotel.state}</span>
        </div>
        <div className="flex items-center space-x-2 bg-green-500/20 backdrop-blur-sm px-3 py-1 lg:px-4 lg:py-2 rounded-2xl">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm lg:text-base">Available Now</span>
        </div>
      </div>
    </div>
  </div>
</div>

      {/* Main Content */}
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Booking Card */}
   <div className="bg-white rounded-3xl shadow-2xl p-6 lg:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Check-in</label>
                  <input
                    type="date"
                    name="checkIn"
                    value={bookingDates.checkIn}
                    onChange={handleDateChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 bg-gray-50 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Check-out</label>
                  <input
                    type="date"
                    name="checkOut"
                    value={bookingDates.checkOut}
                    onChange={handleDateChange}
                    min={bookingDates.checkIn || new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 bg-gray-50 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Guests</label>
                  <select
                    name="guests"
                    value={bookingDates.guests}
                    onChange={handleDateChange}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 bg-gray-50 font-semibold"
                  >
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {nights > 0 && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 mb-6">
                  <div className="text-center text-blue-800 font-bold text-lg">
                    🗓️ {nights} night{nights > 1 ? 's' : ''} selected
                  </div>
                </div>
              )}

              <button
                onClick={() => rooms.length > 0 && document.getElementById('rooms-section')?.scrollIntoView({ behavior: 'smooth' })}
                className={`w-full py-5 rounded-2xl font-bold text-lg transition duration-300 transform hover:scale-105 ${
                  rooms.length > 0 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-2xl' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {rooms.length > 0 ? '🎯 View Available Rooms' : 'Select Dates to Continue'}
              </button>
            </div>

            {/* Hotel Description */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-3 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mr-4"></span>
                About This Hotel
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {hotel.description || 'Experience luxury and comfort at its finest. This hotel offers exceptional service and amenities to make your stay memorable.'}
              </p>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                <span className="w-3 h-8 bg-gradient-to-b from-green-500 to-blue-500 rounded-full mr-4"></span>
                Hotel Amenities
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedAmenities.map((amenity, index) => (
                  <div key={index} className="flex items-center p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl hover:from-blue-50 hover:to-purple-50 transition duration-300 group">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition duration-300">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="font-semibold text-gray-800">{amenity}</span>
                  </div>
                ))}
              </div>
              
              {hotel.amenities && hotel.amenities.length > 8 && (
                <button
                  onClick={() => setShowAllAmenities(!showAllAmenities)}
                  className="mt-6 w-full py-4 border-2 border-gray-300 rounded-2xl text-gray-700 font-semibold hover:bg-gray-50 transition duration-300"
                >
                  {showAllAmenities ? 'Show Less' : `Show All ${hotel.amenities.length} Amenities`}
                </button>
              )}
            </div>

            {/* Available Rooms */}
            <div id="rooms-section" className="bg-white rounded-3xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                <span className="w-3 h-8 bg-gradient-to-b from-orange-500 to-red-500 rounded-full mr-4"></span>
                Available Rooms
                {rooms.length > 0 && (
                  <span className="ml-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    {rooms.length} room{rooms.length > 1 ? 's' : ''} available
                  </span>
                )}
              </h2>
              
              {rooms.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">No Rooms Available</h3>
                  <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                    {bookingDates.checkIn && bookingDates.checkOut 
                      ? 'Please try different dates to find available rooms.'
                      : 'Select your check-in and check-out dates to see available rooms.'
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {rooms.map(room => (
                    <div key={room.id} className="border-2 border-gray-100 rounded-3xl p-6 hover:border-blue-300 hover:shadow-2xl transition duration-500 group">
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Room Image */}
                        <div className="lg:w-64 lg:h-64 flex-shrink-0">
                          <img
                            src={getRoomImage(room)}
                            alt={room.type}
                            className="w-full h-48 lg:h-full object-cover rounded-2xl group-hover:scale-105 transition duration-500"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                            }}
                          />
                        </div>

                        {/* Room Details */}
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                            <div>
                              <h3 className="text-2xl font-bold text-gray-900 mb-2">{room.type}</h3>
                              <p className="text-gray-600 mb-4">{room.description}</p>
                            </div>
                          </div>
                          
                          {/* Room Specs */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <div className="flex items-center text-gray-700">
                              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-3">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                              </div>
                              <span className="font-semibold">Sleeps {room.capacity}</span>
                            </div>
                            <div className="flex items-center text-gray-700">
                              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mr-3">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                              </div>
                              <span className="font-semibold">{room.size || 'N/A'} sq ft</span>
                            </div>
                          </div>

                          {/* Features */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {room.features?.slice(0, 4).map((feature, index) => (
                              <span key={index} className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 px-3 py-2 rounded-xl text-sm font-semibold">
                                {feature}
                              </span>
                            ))}
                            {room.features && room.features.length > 4 && (
                              <span className="bg-gray-100 text-gray-700 px-3 py-2 rounded-xl text-sm font-semibold">
                                +{room.features.length - 4} more
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Price & Booking */}
                        <div className="lg:text-right lg:min-w-56">
                          <div className="space-y-4">
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4">
                              <div className="text-3xl font-bold text-gray-900 mb-1">
                                ₹{(room.pricePerNight || room.price)?.toLocaleString()}
                              </div>
                              <div className="text-gray-600 font-semibold">per night</div>
                              
                              {nights > 0 && (
                                <div className="text-xl font-bold text-green-600 mt-2">
                                  ₹{((room.pricePerNight || room.price) * nights).toLocaleString()}
                                  <div className="text-sm text-gray-600 font-normal">for {nights} nights</div>
                                </div>
                              )}
                            </div>
                            
                            <button
                              onClick={() => handleBookNow(room)}
                              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-2xl hover:shadow-2xl transition duration-300 font-bold text-lg hover:scale-105 transform"
                            >
                              Book Now
                            </button>
                            
                            <div className="flex items-center justify-center lg:justify-end space-x-2 text-green-600 font-semibold">
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              <span>Free cancellation</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Contact Card */}
             <div className="bg-white rounded-3xl shadow-xl p-6 lg:p-8 sticky top-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-3 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full mr-4"></span>
                Contact Info
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Address</div>
                    <div className="text-gray-600">{hotel.address}, {hotel.city}, {hotel.state} - {hotel.pincode}</div>
                  </div>
                </div>
                
                {hotel.contactPhone && (
                  <div className="flex items-center p-4 bg-gradient-to-r from-gray-50 to-green-50 rounded-2xl">
                    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">Phone</div>
                      <div className="text-gray-600">{hotel.contactPhone}</div>
                    </div>
                  </div>
                )}
                
                {hotel.contactEmail && (
                  <div className="flex items-center p-4 bg-gradient-to-r from-gray-50 to-purple-50 rounded-2xl">
                    <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">Email</div>
                      <div className="text-gray-600">{hotel.contactEmail}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Policies */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="w-3 h-8 bg-gradient-to-b from-orange-500 to-yellow-500 rounded-full mr-4"></span>
                  Hotel Policies
                </h4>
                <ul className="text-gray-700 space-y-3">
                  {[
                    'Check-in: 2:00 PM',
                    'Check-out: 12:00 PM', 
                    'Free cancellation 24 hours before check-in',
                    'No smoking in rooms',
                    'Pets not allowed',
                    'Breakfast included'
                  ].map((policy, index) => (
                    <li key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      {policy}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetails;