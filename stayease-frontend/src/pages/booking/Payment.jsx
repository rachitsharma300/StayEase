// pages/booking/Payment.jsx - COMPLETE FIXED VERSION
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AuthContext';
import axios from '../../api/axios';
import { useToast } from '../../context/ToastContext';

const Payment = () => {
  const { user } = useApp();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  const bookingData = location.state?.bookingData;
  
  const [paymentMethod, setPaymentMethod] = useState('mock'); // ✅ Default to mock for testing
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('pending');

  useEffect(() => {
    if (!bookingData) {
      console.log('❌ No booking data found, redirecting...');
      navigate('/');
      return;
    }
    console.log('💰 Payment page loaded with booking:', bookingData);
  }, [bookingData, navigate]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const processRazorpayPayment = async () => {
    try {
      setIsProcessing(true);
      
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        error('Failed to load payment gateway');
        return;
      }

      // Create order
      const orderResponse = await axios.post('/payments/create-order', {
        amount: bookingData.totalAmount,
        bookingId: bookingData.id
      });

      if (!orderResponse.data.success) {
        error(orderResponse.data.message);
        return;
      }

      const orderData = orderResponse.data;

      // ✅ FIX: Remove process.env and use direct key
      const razorpayKey = 'rzp_test_RexSddehHHkC49'; 

      // Razorpay options
      const options = {
        key: razorpayKey, 
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'StayEase Hotels',
        description: `Booking for ${bookingData.hotelName}`,
        // image: '/logo.png',
        order_id: orderData.orderId,
        handler: async function (response) {
          try {
            console.log('🔄 Verifying payment...', response);
            
            // Verify payment
            const verifyResponse = await axios.post('/payments/verify', {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyResponse.data.success) {
              success('Payment successful! Booking confirmed.');
              setPaymentStatus('success');
              
              // Redirect to bookings page after 2 seconds
              setTimeout(() => {
                navigate('/my-bookings', {
                  state: { 
                    message: 'Payment successful! Your booking is confirmed.',
                    bookingId: bookingData.id
                  }
                });
              }, 2000);
            } else {
              error('Payment verification failed');
              setPaymentStatus('failed');
            }
          } catch (err) {
            console.error('Payment verification error:', err);
            error('Payment verification failed');
            setPaymentStatus('failed');
          }
        },
        prefill: {
          name: user?.username || 'Guest',
          email: user?.email || 'guest@example.com',
          contact: user?.phone || '9999999999'
        },
        notes: {
          bookingId: bookingData.id,
          hotel: bookingData.hotelName
        },
        theme: {
          color: '#2563eb'
        }
      };

      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
      razorpay.on('payment.failed', function (response) {
        console.error('❌ Payment failed:', response);
        error(`Payment failed: ${response.error.description}`);
        setPaymentStatus('failed');
      });

    } catch (err) {
      console.error('Payment processing error:', err);
      error('Payment processing failed: ' + err.message);
      setPaymentStatus('failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const processMockPayment = async () => {
    try {
      setIsProcessing(true);
      
      console.log('🔄 Processing mock payment for booking:', bookingData.id);
      
      // ✅ FIX: Use correct endpoint without /api prefix
      const response = await axios.post(`/payments/mock-payment/${bookingData.id}`);
      
      console.log('📦 Mock payment response:', response.data);
      
      if (response.data.success) {
        console.log('✅ Mock payment successful');
        success('Mock payment successful! Booking confirmed.');
        setPaymentStatus('success');
        
        setTimeout(() => {
          navigate('/my-bookings', {
            state: { 
              message: 'Payment successful! Your booking is confirmed.',
              bookingId: bookingData.id
            }
          });
        }, 2000);
      } else {
        throw new Error(response.data.message || 'Mock payment failed');
      }
    } catch (err) {
      console.error('❌ Mock payment error:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Mock payment failed';
      error('Mock payment failed: ' + errorMsg);
      setPaymentStatus('failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayment = async () => {
    if (paymentMethod === 'razorpay') {
      await processRazorpayPayment();
    } else {
      await processMockPayment();
    }
  };

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">No Booking Data</h2>
          <p className="text-gray-600 mt-2">Please start a new booking</p>
          <button 
            onClick={() => navigate('/')}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Browse Hotels
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Complete Payment</h1>
          <p className="text-gray-600 mt-2">Secure payment for your booking</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Method</h2>

              {/* Payment Method Selection */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => setPaymentMethod('razorpay')}
                  className={`p-4 border-2 rounded-lg text-left transition duration-200 ${
                    paymentMethod === 'razorpay'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                      R
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Razorpay</div>
                      <div className="text-sm text-gray-600">Credit/Debit Card, UPI, Net Banking</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setPaymentMethod('mock')}
                  className={`p-4 border-2 rounded-lg text-left transition duration-200 ${
                    paymentMethod === 'mock'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                      T
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Test Payment</div>
                      <div className="text-sm text-gray-600">Mock payment for testing</div>
                    </div>
                  </div>
                </button>
              </div>

              {/* Payment Status */}
              {paymentStatus === 'success' && (
                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-6">
                  ✅ Payment successful! Redirecting...
                </div>
              )}

              {paymentStatus === 'failed' && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
                  ❌ Payment failed. Please try again.
                </div>
              )}

              {/* Pay Button */}
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-green-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing Payment...
                  </div>
                ) : (
                  `Pay ₹${bookingData.totalAmount?.toLocaleString()}`
                )}
              </button>

              <div className="mt-4 text-center">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>Your payment is secure and encrypted</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Summary</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{bookingData.hotelName}</h3>
                  <p className="text-gray-600 text-sm">{bookingData.roomType}</p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Check-in</span>
                    <span>{new Date(bookingData.checkIn).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Check-out</span>
                    <span>{new Date(bookingData.checkOut).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Guests</span>
                    <span>{bookingData.guests}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nights</span>
                    <span>{bookingData.nights}</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount</span>
                    <span>₹{bookingData.totalAmount?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;