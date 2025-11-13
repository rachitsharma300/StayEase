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
  const [bookingDates, setBookingDates] = useState({
    checkIn: location.state?.checkIn || '',
    checkOut: location.state?.checkOut || '',
    guests: location.state?.guests || 1
  });

  useEffect(() => {
    fetchHotelDetails();
  }, [id, bookingDates.checkIn, bookingDates.checkOut]);

  const fetchHotelDetails = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch hotel details
      const hotelResponse = await axios.get(`/hotels/${id}`);
      setHotel(hotelResponse.data);

      // Fetch available rooms with date filtering
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
      navigate('/login', { state: { returnUrl: `/hotel/${id}` } });
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading hotel details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Hotel Not Found</h2>
          <p className="text-gray-600 mt-2">{error}</p>
          <button 
            onClick={() => navigate('/')}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Browse Hotels
          </button>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return null;
  }

  const nights = calculateNights();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hotel Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <button onClick={() => navigate('/')} className="hover:text-blue-600">Hotels</button>
            <span>›</span>
            <span className="text-gray-900">{hotel.name}</span>
          </nav>
          
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{hotel.name}</h1>
              <div className="flex items-center mt-2 space-x-4">
                <div className="flex items-center">
                  <span className="text-yellow-600">⭐ {hotel.rating || '4.2'}</span>
                  <span className="ml-1 text-gray-600">({hotel.reviews || '120'} reviews)</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {hotel.location}
                </div>
              </div>
            </div>

            {/* Quick Booking Widget */}
            <div className="mt-4 lg:mt-0 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Check-in</label>
                  <input
                    type="date"
                    name="checkIn"
                    value={bookingDates.checkIn}
                    onChange={handleDateChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Check-out</label>
                  <input
                    type="date"
                    name="checkOut"
                    value={bookingDates.checkOut}
                    onChange={handleDateChange}
                    min={bookingDates.checkIn || new Date().toISOString().split('T')[0]}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Guests</label>
                  <select
                    name="guests"
                    value={bookingDates.guests}
                    onChange={handleDateChange}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  >
                    {[1, 2, 3, 4].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
              </div>
              {nights > 0 && (
                <div className="text-xs text-gray-600 text-center">
                  {nights} night{nights > 1 ? 's' : ''}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Hotel Images */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
              <img
                src={hotel.image || '/api/placeholder/800/400'}
                alt={hotel.name}
                className="w-full h-64 lg:h-96 object-cover"
              />
            </div>

            {/* Hotel Description */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About this hotel</h2>
              <p className="text-gray-600 leading-relaxed">
                {hotel.description || 'No description available.'}
              </p>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {hotel.amenities?.map((amenity, index) => (
                  <div key={index} className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{amenity}</span>
                  </div>
                ))}
                {(!hotel.amenities || hotel.amenities.length === 0) && (
                  <p className="text-gray-600 col-span-3">No amenities listed.</p>
                )}
              </div>
            </div>

            {/* Available Rooms - FIXED PRICE DISPLAY */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Available Rooms</h2>
              
              {rooms.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No rooms available</h3>
                  <p className="text-gray-600">
                    {bookingDates.checkIn && bookingDates.checkOut 
                      ? 'No rooms available for the selected dates. Try different dates.'
                      : 'Select check-in and check-out dates to see available rooms.'
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {rooms.map(room => (
                    <div key={room.id} className="border border-gray-200 rounded-lg p-6 hover:border-blue-500 transition duration-200">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                        {/* Room Info */}
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{room.type}</h3>
                          <p className="text-gray-600 mb-3">{room.description}</p>
                          
                          {/* ✅ FIXED PRICE DISPLAY */}
                          <div className="mb-4">
                            <div className="text-2xl font-bold text-gray-900 mb-1">
                              ₹{room.pricePerNight?.toLocaleString() || room.price?.toLocaleString()} 
                              <span className="text-sm font-normal text-gray-600 ml-1">per night</span>
                            </div>
                            {nights > 0 && (
                              <div className="text-lg font-semibold text-green-600">
                                Total: ₹{((room.pricePerNight || room.price) * nights).toLocaleString()} 
                                for {nights} night{nights > 1 ? 's' : ''}
                              </div>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                            <div className="flex items-center">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                              </svg>
                              Sleeps {room.capacity} guests
                            </div>
                            <div className="flex items-center">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                              </svg>
                              {room.size || 'N/A'} sq ft
                            </div>
                          </div>

                          {/* Room Features */}
                          <div className="flex flex-wrap gap-2">
                            {room.features?.slice(0, 4).map((feature, index) => (
                              <span key={index} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                                {feature}
                              </span>
                            ))}
                            {room.features && room.features.length > 4 && (
                              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                +{room.features.length - 4} more
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Price and Booking */}
                        <div className="mt-4 lg:mt-0 lg:ml-6 lg:text-right">
                          <div className="text-2xl font-bold text-gray-900 mb-1">
                            ₹{(room.pricePerNight || room.price)?.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600 mb-2">per night</div>
                          
                          {nights > 0 && (
                            <div className="text-lg font-semibold text-green-600 mb-3">
                              ₹{((room.pricePerNight || room.price) * nights).toLocaleString()}
                            </div>
                          )}
                          
                          <button
                            onClick={() => handleBookNow(room)}
                            className="w-full lg:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold transition duration-200"
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Contact Info */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{hotel.address || hotel.location}</span>
                </div>
                
                {hotel.phone && (
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{hotel.phone}</span>
                  </div>
                )}
                
                {hotel.email && (
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>{hotel.email}</span>
                  </div>
                )}
              </div>

              {/* Policies */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Hotel Policies</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Check-in: 2:00 PM</li>
                  <li>• Check-out: 12:00 PM</li>
                  <li>• Free cancellation 24 hours before check-in</li>
                  <li>• No smoking</li>
                  <li>• Pets not allowed</li>
                </ul>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Location</h3>
              <div className="bg-gray-200 h-48 rounded-lg flex items-center justify-center text-gray-500">
                Map View
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetails;