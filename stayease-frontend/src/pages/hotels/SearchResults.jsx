// pages/hotels/SearchResults.jsx
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectHotel, searchHotels } = useApp();
  const { error: toastError } = useToast();

  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 50000,
    rating: 0,
    sortBy: 'recommended',
    amenities: []
  });

  // Available amenities for filtering
  const availableAmenities = [
    'Free WiFi', 'Swimming Pool', 'Spa', 'Fitness Center', 'Restaurant', 
    'Bar', 'Parking', 'Room Service', 'Air Conditioning', 'Breakfast Included'
  ];

  // Extract query parameters safely
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = {
    location: queryParams.get('location') || '',
    checkIn: queryParams.get('checkIn'),
    checkOut: queryParams.get('checkOut'),
    guests: parseInt(queryParams.get('guests')) || 1
  };

  useEffect(() => {
    fetchSearchResults();
  }, [location.search]);

  const fetchSearchResults = async () => {
    try {
      setLoading(true);
      setError('');

      const result = await searchHotels(searchQuery);

      if (result.success && Array.isArray(result.data)) {
        setSearchResults(result.data);
      } else {
        setSearchResults([]);
        setError(result.message || 'No hotels found for your search criteria');
      }
    } catch (err) {
      console.error('Search error:', err);
      setSearchResults([]);
      setError('Failed to fetch search results. Please try again.');
      toastError('Search failed. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleHotelSelect = (hotel) => {
    selectHotel(hotel);
    navigate(`/hotel/${hotel.id}`, {
      state: {
        checkIn: searchQuery.checkIn,
        checkOut: searchQuery.checkOut,
        guests: searchQuery.guests
      }
    });
  };

  const toggleAmenity = (amenity) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const getMinPrice = (hotel) => {
    if (!hotel.rooms || hotel.rooms.length === 0) return 0;
    return Math.min(...hotel.rooms.map(room => room.pricePerNight || room.price || 0));
  };

  const hasAmenities = (hotel, requiredAmenities) => {
    if (!requiredAmenities.length) return true;
    if (!hotel.amenities) return false;
    return requiredAmenities.every(amenity => hotel.amenities.includes(amenity));
  };

  // Safe array for filtering
  const filteredAndSortedResults = (Array.isArray(searchResults) ? searchResults : [])
    .filter(hotel => {
      const minPrice = getMinPrice(hotel);
      return minPrice >= filters.minPrice &&
             minPrice <= filters.maxPrice &&
             (hotel.rating || 0) >= filters.rating &&
             hasAmenities(hotel, filters.amenities);
    })
    .sort((a, b) => {
      const priceA = getMinPrice(a);
      const priceB = getMinPrice(b);

      switch (filters.sortBy) {
        case 'price-low':
          return priceA - priceB;
        case 'price-high':
          return priceB - priceA;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'recommended':
        default:
          // Sort by rating first, then by price
          const ratingDiff = (b.rating || 0) - (a.rating || 0);
          return ratingDiff !== 0 ? ratingDiff : priceA - priceB;
      }
    });

  const resetFilters = () => {
    setFilters({
      minPrice: 0,
      maxPrice: 50000,
      rating: 0,
      sortBy: 'recommended',
      amenities: []
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 font-medium">Searching for the best stays...</p>
          <p className="text-sm text-gray-500 mt-2">Finding perfect hotels in {searchQuery.location || 'your location'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4 shadow-lg">
            <span className="text-2xl text-white">🏨</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {searchQuery.location ? `Hotels in ${searchQuery.location}` : 'Discover Amazing Stays'}
          </h1>
          <div className="flex flex-wrap justify-center items-center gap-4 mt-4 text-gray-600">
            {searchQuery.checkIn && searchQuery.checkOut && (
              <>
                <span className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
                  <span className="text-blue-600 mr-2">📅</span>
                  {formatDate(searchQuery.checkIn)} - {formatDate(searchQuery.checkOut)}
                </span>
                <span className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
                  <span className="text-green-600 mr-2">👥</span>
                  {searchQuery.guests} guest{searchQuery.guests > 1 ? 's' : ''}
                </span>
              </>
            )}
            <span className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
              <span className="text-purple-600 mr-2">🔍</span>
              {filteredAndSortedResults.length} propert{filteredAndSortedResults.length === 1 ? 'y' : 'ies'} found
            </span>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-2xl mb-6 text-center max-w-2xl mx-auto">
            <div className="flex items-center justify-center">
              <span className="text-xl mr-3">⚠️</span>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Enhanced Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-8 hover:shadow-2xl transition duration-300">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Filters</h3>
                <button 
                  onClick={resetFilters}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium transition duration-200"
                >
                  Reset All
                </button>
              </div>

              {/* Price Range */}
              <div className="mb-8">
                <label className="block text-lg font-semibold text-gray-900 mb-4">
                  💰 Price Range
                </label>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>₹{filters.minPrice.toLocaleString()}</span>
                    <span>₹{filters.maxPrice.toLocaleString()}</span>
                  </div>
                  <div className="relative">
                    <input 
                      type="range" 
                      min="0" 
                      max="50000" 
                      step="1000" 
                      value={filters.minPrice} 
                      onChange={e => setFilters(prev => ({ ...prev, minPrice: parseInt(e.target.value) }))} 
                      className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600"
                    />
                    <input 
                      type="range" 
                      min="0" 
                      max="50000" 
                      step="1000" 
                      value={filters.maxPrice} 
                      onChange={e => setFilters(prev => ({ ...prev, maxPrice: parseInt(e.target.value) }))} 
                      className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600"
                    />
                  </div>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-8">
                <label className="block text-lg font-semibold text-gray-900 mb-4">
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
                      <span className="ml-3 text-gray-700 group-hover:text-gray-900 transition duration-200">
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
                            <span className="ml-2 text-sm">& up</span>
                          </div>
                        )}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Amenities Filter */}
              <div className="mb-8">
                <label className="block text-lg font-semibold text-gray-900 mb-4">
                  🛎️ Amenities
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {availableAmenities.map(amenity => (
                    <label key={amenity} className="flex items-center cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={filters.amenities.includes(amenity)} 
                        onChange={() => toggleAmenity(amenity)} 
                        className="text-blue-600 focus:ring-blue-500 rounded" 
                      />
                      <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900 transition duration-200">
                        {amenity}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div className="mb-4">
                <label className="block text-lg font-semibold text-gray-900 mb-4">
                  🔄 Sort By
                </label>
                <select 
                  value={filters.sortBy} 
                  onChange={e => setFilters(prev => ({ ...prev, sortBy: e.target.value }))} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white"
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>
            </div>
          </div>

          {/* Enhanced Hotel Results */}
          <div className="lg:col-span-3">
            {filteredAndSortedResults.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">🏨</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No hotels found</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {searchQuery.location 
                    ? `We couldn't find any hotels matching your criteria in ${searchQuery.location}. Try adjusting your filters or search for a different location.`
                    : 'Try adjusting your filters or search for a different location.'
                  }
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={resetFilters}
                    className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition duration-200 font-semibold"
                  >
                    Reset All Filters
                  </button>
                  <button 
                    onClick={() => navigate('/')} 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition duration-200 font-semibold shadow-lg hover:shadow-xl"
                  >
                    Browse All Hotels
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {filteredAndSortedResults.map(hotel => (
                  <div 
                    key={hotel.id} 
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                    onClick={() => handleHotelSelect(hotel)}
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Hotel Image */}
                      <div className="md:w-2/5 relative">
                        <img 
                          src={hotel.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop'} 
                          alt={hotel.name} 
                          className="w-full h-48 md:h-full object-cover group-hover:scale-105 transition duration-700"
                          onError={e => {
                            e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop';
                          }}
                        />
                        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-gray-900 px-3 py-2 rounded-full text-sm font-semibold flex items-center">
                          ⭐ {hotel.rating || '4.2'}
                        </div>
                        {getMinPrice(hotel) < 2000 && (
                          <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                            Great Deal
                          </div>
                        )}
                      </div>

                      {/* Hotel Info */}
                      <div className="flex-1 p-6">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition duration-200 line-clamp-1">
                              {hotel.name}
                            </h3>
                            <p className="text-gray-600 text-sm mt-1 flex items-center">
                              <span className="mr-2">📍</span>
                              {hotel.address}, {hotel.city}
                            </p>
                          </div>
                          <div className="text-right ml-4">
                            <div className="text-2xl font-bold text-gray-900">
                              ₹{getMinPrice(hotel).toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-600">per night</div>
                            <div className="text-green-600 text-xs font-semibold mt-1">
                              Free cancellation
                            </div>
                          </div>
                        </div>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                          {hotel.description || 'Experience comfortable accommodation with modern amenities and excellent service.'}
                        </p>

                        {/* Amenities */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {hotel.amenities?.slice(0, 4).map((amenity, index) => (
                            <span
                              key={index}
                              className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium"
                            >
                              {amenity}
                            </span>
                          ))}
                          {hotel.amenities && hotel.amenities.length > 4 && (
                            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                              +{hotel.amenities.length - 4} more
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="flex items-center">
                              <span className="text-green-500 mr-1">✓</span>
                              Best Price
                            </span>
                            <span className="flex items-center">
                              <span className="text-green-500 mr-1">✓</span>
                              Instant Confirmation
                            </span>
                          </div>
                          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-xl hover:from-blue-700 hover:to-purple-700 transition duration-200 font-semibold text-sm shadow-lg hover:shadow-xl transform group-hover:-translate-y-0.5">
                            View Rooms
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
    </div>
  );
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-IN', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  });
};

export default SearchResults;