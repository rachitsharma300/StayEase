// pages/booking/Checkout.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AuthContext';

const Checkout = () => {
  const { user, createBooking, selectedHotel } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  // Get room data from navigation state or selectedHotel
  const room = location.state?.room || selectedHotel?.rooms?.[0];

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    specialRequests: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-fill user data if available
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.fullName || user.username || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  // Redirect if no room selected
  useEffect(() => {
    if (!room) {
      navigate('/');
    }
  }, [room, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const calculateTotal = () => {
    if (!room || !formData.checkIn || !formData.checkOut) return 0;
    
    const checkIn = new Date(formData.checkIn);
    const checkOut = new Date(formData.checkOut);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    
    return nights * room.price;
  };

  const calculateNights = () => {
    if (!formData.checkIn || !formData.checkOut) return 0;
    const checkIn = new Date(formData.checkIn);
    const checkOut = new Date(formData.checkOut);
    return Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation
    if (!formData.fullName || !formData.email || !formData.phone || !formData.checkIn || !formData.checkOut) {
      setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    if (new Date(formData.checkIn) >= new Date(formData.checkOut)) {
      setError('Check-out date must be after check-in date');
      setIsLoading(false);
      return;
    }

    if (new Date(formData.checkIn) < new Date().setHours(0, 0, 0, 0)) {
      setError('Check-in date cannot be in the past');
      setIsLoading(false);
      return;
    }

    const bookingData = {
      roomId: room.id,
      hotelId: room.hotelId,
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
      guests: parseInt(formData.guests),
      totalAmount: calculateTotal(),
      guestName: formData.fullName,
      guestEmail: formData.email,
      guestPhone: formData.phone,
      specialRequests: formData.specialRequests
    };

    const result = await createBooking(bookingData);
    
    if (result.success) {
      // Redirect to payment page or booking confirmation
      navigate('/my-bookings', { 
        state: { message: 'Booking confirmed successfully!' } 
      });
    } else {
      setError(result.message);
    }
    
    setIsLoading(false);
  };

  if (!room) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">No Room Selected</h2>
          <p className="text-gray-600 mt-2">Please select a room to proceed with booking.</p>
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

  const nights = calculateNights();
  const total = calculateTotal();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Booking</h1>
          <p className="text-gray-600 mt-2">Review your details and confirm your stay</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Guest Information</h2>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700 mb-1">
                      Check-in Date *
                    </label>
                    <input
                      type="date"
                      id="checkIn"
                      name="checkIn"
                      required
                      value={formData.checkIn}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    />
                  </div>

                  <div>
                    <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700 mb-1">
                      Check-out Date *
                    </label>
                    <input
                      type="date"
                      id="checkOut"
                      name="checkOut"
                      required
                      value={formData.checkOut}
                      onChange={handleChange}
                      min={formData.checkIn || new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    />
                  </div>

                  <div>
                    <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">
                      Guests *
                    </label>
                    <select
                      id="guests"
                      name="guests"
                      required
                      value={formData.guests}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    >
                      {[1, 2, 3, 4, 5, 6].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-1">
                    Special Requests
                  </label>
                  <textarea
                    id="specialRequests"
                    name="specialRequests"
                    rows={3}
                    value={formData.specialRequests}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="Any special requests or requirements..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing Booking...
                    </div>
                  ) : (
                    `Confirm Booking - ₹${total.toLocaleString()}`
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Summary</h2>

              {/* Hotel Info */}
              <div className="border-b border-gray-200 pb-4 mb-4">
                <h3 className="font-semibold text-gray-900">{room.hotelName || 'Hotel'}</h3>
                <p className="text-gray-600 text-sm mt-1">{room.type} Room</p>
                <p className="text-gray-500 text-sm">{room.description}</p>
              </div>

              {/* Dates */}
              <div className="space-y-3 border-b border-gray-200 pb-4 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Check-in</span>
                  <span className="font-medium">
                    {formData.checkIn ? new Date(formData.checkIn).toLocaleDateString() : 'Select date'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Check-out</span>
                  <span className="font-medium">
                    {formData.checkOut ? new Date(formData.checkOut).toLocaleDateString() : 'Select date'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Nights</span>
                  <span className="font-medium">{nights}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Guests</span>
                  <span className="font-medium">{formData.guests}</span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Room price ({nights} nights)</span>
                  <span>₹{(room.price * nights).toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Taxes & Fees</span>
                  <span>Included</span>
                </div>

                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">What's included:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Free WiFi
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Air Conditioning
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    {room.hasBreakfast ? 'Breakfast Included' : 'No Breakfast'}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;