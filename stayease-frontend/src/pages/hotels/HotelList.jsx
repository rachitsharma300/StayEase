// pages/hotels/HotelList.jsx
import { useState, useEffect } from 'react';
import { useApp } from '../../context/AuthContext';
import SearchBar from '../../components/SearchBar';
import { useNavigate } from 'react-router-dom';

const HotelList = () => {
  const { hotels, featuredHotels, fetchHotels, selectHotel } = useApp();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [filters, setFilters] = useState({
    location: '',
    priceRange: [0, 10000],
    rating: 0,
    sortBy: 'featured'
  });

  // Popular destinations data
  const popularDestinations = [
    { name: 'Goa', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=300&h=200&fit=crop', hotels: 234 },
    { name: 'Mumbai', image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=300&h=200&fit=crop', hotels: 189 },
    { name: 'Delhi', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=300&h=200&fit=crop', hotels: 167 },
    { name: 'Bangalore', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=300&h=200&fit=crop', hotels: 145 },
    { name: 'Jaipur', image: 'https://images.unsplash.com/photo-1592478411213-6153e4ebc696?w=300&h=200&fit=crop', hotels: 98 },
    { name: 'Kerala', image: 'https://images.unsplash.com/photo-1580105117397-f9b44cdf38a8?w=300&h=200&fit=crop', hotels: 76 }
  ];

  // Safe featured hotels array
  const safeFeaturedHotels = Array.isArray(featuredHotels) ? featuredHotels : [];
  const safeHotels = Array.isArray(hotels) ? hotels : [];

  useEffect(() => {
    loadHotels();
  }, []);

  useEffect(() => {
    filterAndSortHotels();
  }, [safeHotels, filters]);

  const loadHotels = async () => {
    setLoading(true);
    try {
      await fetchHotels();
    } catch (error) {
      console.error('Error loading hotels:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortHotels = () => {
    let result = [...safeHotels];

    // Filter by location
    if (filters.location) {
      result = result.filter(hotel =>
        hotel?.address?.toLowerCase().includes(filters.location.toLowerCase()) ||
        hotel?.city?.toLowerCase().includes(filters.location.toLowerCase()) ||
        hotel?.name?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Filter by rating
    if (filters.rating > 0) {
      result = result.filter(hotel => (hotel?.rating || 0) >= filters.rating);
    }

    // Sort hotels
    switch (filters.sortBy) {
      case 'price-low':
        result.sort((a, b) => {
          const priceA = a?.rooms?.[0]?.pricePerNight || 0;
          const priceB = b?.rooms?.[0]?.pricePerNight || 0;
          return priceA - priceB;
        });
        break;
      case 'price-high':
        result.sort((a, b) => {
          const priceA = a?.rooms?.[0]?.pricePerNight || 0;
          const priceB = b?.rooms?.[0]?.pricePerNight || 0;
          return priceB - priceA;
        });
        break;
      case 'rating':
        result.sort((a, b) => (b?.rating || 0) - (a?.rating || 0));
        break;
      case 'name':
        result.sort((a, b) => (a?.name || '').localeCompare(b?.name || ''));
        break;
      default:
        // Featured - default sorting
        break;
    }

    setFilteredHotels(result);
  };

  const handleHotelSelect = (hotel) => {
    selectHotel(hotel);
    navigate(`/hotel/${hotel.id}`);
  };

  const getMinPrice = (hotel) => {
    if (!hotel?.rooms || hotel.rooms.length === 0) return 0;
    const prices = hotel.rooms.map(room => room.pricePerNight || 0).filter(price => price > 0);
    return prices.length > 0 ? Math.min(...prices) : 0;
  };

  const getHotelType = (hotel) => {
    const price = getMinPrice(hotel);
    if (price > 5000) return 'Luxury';
    if (price > 2500) return 'Premium';
    return 'Budget';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 font-medium">Finding amazing stays for you...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Enhanced Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full translate-x-1/3 translate-y-1/3 opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Find Your Perfect
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200">
                Stay
              </span>
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Discover amazing hotels, luxury resorts, and unique stays at unbeatable prices. 
              Book with confidence and create unforgettable memories.
            </p>
          </div>
          
          {/* Enhanced Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-2 transform hover:shadow-3xl transition-all duration-300">
              <SearchBar />
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-8 mt-12 pt-8 border-t border-blue-700">
            <div className="flex items-center text-blue-100">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold">✓</span>
              </div>
              <span className="font-medium">Best Price Guarantee</span>
            </div>
            <div className="flex items-center text-blue-100">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold">✓</span>
              </div>
              <span className="font-medium">Free Cancellation</span>
            </div>
            <div className="flex items-center text-blue-100">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold">✓</span>
              </div>
              <span className="font-medium">24/7 Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Destinations */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Destinations
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Explore these trending destinations loved by travelers worldwide
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularDestinations.map((destination, index) => (
              <div
                key={index}
                className="group cursor-pointer transform hover:-translate-y-2 transition-all duration-300"
              >
                <div className="relative overflow-hidden rounded-2xl shadow-lg">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-32 object-cover group-hover:scale-110 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-white font-semibold text-sm">{destination.name}</h3>
                    <p className="text-blue-200 text-xs">{destination.hotels} hotels</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Hotels - Enhanced */}
      {safeFeaturedHotels.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Featured Hotels
                </h2>
                <p className="text-gray-600 text-lg">
                  Handpicked stays for an exceptional experience
                </p>
              </div>
              <button className="hidden md:flex items-center text-blue-600 font-semibold hover:text-blue-700 transition duration-200">
                View all
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {safeFeaturedHotels.map(hotel => (
                <div
                  key={hotel.id}
                  className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer group"
                  onClick={() => handleHotelSelect(hotel)}
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={hotel?.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=250&fit=crop'}
                      alt={hotel?.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=250&fit=crop';
                      }}
                    />
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-gray-900 px-3 py-2 rounded-full text-sm font-semibold flex items-center">
                      ⭐ {hotel?.rating || '4.2'}
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        getHotelType(hotel) === 'Luxury' ? 'bg-purple-500 text-white' :
                        getHotelType(hotel) === 'Premium' ? 'bg-blue-500 text-white' :
                        'bg-green-500 text-white'
                      }`}>
                        {getHotelType(hotel)}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-3 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-xl font-semibold hover:bg-blue-700 transition duration-200">
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition duration-200">
                        {hotel?.name}
                      </h3>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          ₹{getMinPrice(hotel).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">per night</div>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3 flex items-center">
                      <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {hotel?.city}, {hotel?.state}
                    </p>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {hotel?.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {hotel?.amenities?.slice(0, 3).map((amenity, index) => (
                        <span
                          key={index}
                          className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium"
                        >
                          {amenity}
                        </span>
                      ))}
                      {hotel?.amenities && hotel.amenities.length > 3 && (
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                          +{hotel.amenities.length - 3} more
                        </span>
                      )}
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <span className="text-green-600 text-sm font-semibold flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Free cancellation
                      </span>
                      <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-xl hover:from-blue-700 hover:to-purple-700 transition duration-200 font-semibold shadow-lg hover:shadow-xl">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Hotels Section - Enhanced */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Enhanced Filters Sidebar */}
            <div className="lg:w-80">
              <div className="bg-white rounded-3xl shadow-xl p-6 sticky top-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Filters</h3>
                  <button 
                    onClick={() => setFilters({
                      location: '',
                      priceRange: [0, 10000],
                      rating: 0,
                      sortBy: 'featured'
                    })}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium transition duration-200"
                  >
                    Clear all
                  </button>
                </div>
                
                {/* Location Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    📍 Location
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Where are you going?"
                      value={filters.location}
                      onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-gray-50"
                    />
                    <svg className="w-5 h-5 text-gray-400 absolute right-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    💰 Price Range
                  </label>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>₹{filters.priceRange[0]}</span>
                      <span>₹{filters.priceRange[1]}</span>
                    </div>
                    <div className="relative">
                      <input
                        type="range"
                        min="0"
                        max="10000"
                        step="500"
                        value={filters.priceRange[0]}
                        onChange={(e) => setFilters(prev => ({
                          ...prev,
                          priceRange: [parseInt(e.target.value), prev.priceRange[1]]
                        }))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600"
                      />
                      <input
                        type="range"
                        min="0"
                        max="10000"
                        step="500"
                        value={filters.priceRange[1]}
                        onChange={(e) => setFilters(prev => ({
                          ...prev,
                          priceRange: [prev.priceRange[0], parseInt(e.target.value)]
                        }))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 absolute top-0 left-0"
                      />
                    </div>
                  </div>
                </div>

                {/* Rating Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    ⭐ Guest Rating
                  </label>
                  <div className="space-y-3">
                    {[0, 3, 4, 4.5].map(rating => (
                      <label key={rating} className="flex items-center cursor-pointer group">
                        <input
                          type="radio"
                          name="rating"
                          checked={filters.rating === rating}
                          onChange={() => setFilters(prev => ({ ...prev, rating }))}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900 transition duration-200">
                          {rating === 0 ? 'Any rating' : (
                            <div className="flex items-center">
                              {Array.from({ length: 5 }, (_, i) => (
                                <span
                                  key={i}
                                  className={`text-lg ${
                                    i < Math.floor(rating) ? 'text-yellow-400' :
                                    i < rating ? 'text-yellow-400' : 'text-gray-300'
                                  }`}
                                >
                                  {i < rating ? '★' : '☆'}
                                </span>
                              ))}
                              <span className="ml-2">& up</span>
                            </div>
                          )}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Sort By */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    🔄 Sort By
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-gray-50 appearance-none"
                  >
                    <option value="featured">Recommended</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                    <option value="name">Property Name (A-Z)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Enhanced Hotels Grid */}
            <div className="lg:flex-1">
              {/* Enhanced Results Header */}
              <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {filteredHotels.length} properties found
                    </h2>
                    <p className="text-gray-600 mt-1 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {filters.location ? `in ${filters.location}` : 'across India'}
                    </p>
                  </div>
                  
                  <div className="mt-4 sm:mt-0 bg-blue-50 text-blue-700 px-4 py-2 rounded-xl font-medium">
                    Sorted by: {
                      filters.sortBy === 'featured' ? 'Recommended' :
                      filters.sortBy === 'price-low' ? 'Price: Low to High' :
                      filters.sortBy === 'price-high' ? 'Price: High to Low' :
                      filters.sortBy === 'rating' ? 'Top Rated' : 'Property Name'
                    }
                  </div>
                </div>
              </div>

              {/* Enhanced Hotels Grid */}
              {filteredHotels.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-xl p-16 text-center">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">No hotels found</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
                    {filters.location 
                      ? `We couldn't find any hotels matching "${filters.location}". Try adjusting your search criteria.`
                      : 'Try adjusting your filters or search for a different location.'
                    }
                  </p>
                  <button 
                    onClick={() => setFilters({
                      location: '',
                      priceRange: [0, 10000],
                      rating: 0,
                      sortBy: 'featured'
                    })}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition duration-200 font-semibold text-lg shadow-lg hover:shadow-xl"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredHotels.map(hotel => (
                    <div
                      key={hotel.id}
                      className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 cursor-pointer group"
                      onClick={() => handleHotelSelect(hotel)}
                    >
                      <div className="flex flex-col md:flex-row">
                        {/* Hotel Image */}
                        <div className="md:w-80 relative">
                          <img
                            src={hotel?.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop'}
                            alt={hotel?.name}
                            className="w-full h-64 md:h-full object-cover group-hover:scale-105 transition duration-700"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop';
                            }}
                          />
                          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-gray-900 px-3 py-2 rounded-full text-sm font-semibold flex items-center">
                            ⭐ {hotel?.rating || '4.2'}
                          </div>
                          <div className="absolute top-4 left-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              getHotelType(hotel) === 'Luxury' ? 'bg-purple-500 text-white' :
                              getHotelType(hotel) === 'Premium' ? 'bg-blue-500 text-white' :
                              'bg-green-500 text-white'
                            }`}>
                              {getHotelType(hotel)}
                            </span>
                          </div>
                        </div>

                        {/* Hotel Info */}
                        <div className="flex-1 p-6">
                          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-4">
                            <div className="flex-1">
                              <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition duration-200 mb-2">
                                {hotel?.name}
                              </h3>
                              <p className="text-gray-600 mb-3 flex items-center">
                                <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {hotel?.address}, {hotel?.city}
                              </p>
                            </div>
                            <div className="lg:text-right mt-4 lg:mt-0 lg:ml-6">
                              <div className="text-3xl font-bold text-gray-900">
                                ₹{getMinPrice(hotel).toLocaleString()}
                              </div>
                              <div className="text-sm text-gray-600">per night</div>
                              <div className="text-green-600 text-sm font-semibold mt-1">
                                + ₹{Math.round(getMinPrice(hotel) * 0.18).toLocaleString()} taxes & fees
                              </div>
                            </div>
                          </div>

                          <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                            {hotel?.description}
                          </p>

                          {/* Amenities */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {hotel?.amenities?.slice(0, 4).map((amenity, index) => (
                              <span
                                key={index}
                                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium"
                              >
                                {amenity}
                              </span>
                            ))}
                            {hotel?.amenities && hotel.amenities.length > 4 && (
                              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                                +{hotel.amenities.length - 4} more
                              </span>
                            )}
                          </div>

                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-4 border-t border-gray-100">
                            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                              <span className="text-green-600 text-sm font-semibold flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Free cancellation
                              </span>
                              <span className="text-blue-600 text-sm font-semibold flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Instant confirmation
                              </span>
                            </div>
                            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition duration-200 font-semibold shadow-lg hover:shadow-xl text-lg">
                              View Details & Book
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Get Exclusive Deals & Offers
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and be the first to receive special discounts and travel tips
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition duration-200">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HotelList;