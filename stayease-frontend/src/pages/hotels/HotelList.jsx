// pages/hotels/HotelList.jsx
import { useState, useEffect } from 'react';
import { useApp } from '../../context/AuthContext';
import SearchBar from '../../components/SearchBar';
import { useNavigate } from 'react-router-dom';

const HotelList = () => {
  const { hotels, fetchHotels, selectHotel } = useApp();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [filters, setFilters] = useState({
    location: '',
    priceRange: [0, 50000],
    rating: 0,
    sortBy: 'featured'
  });

  useEffect(() => {
    loadHotels();
  }, []);

  useEffect(() => {
    filterAndSortHotels();
  }, [hotels, filters]);

  const loadHotels = async () => {
    setLoading(true);
    await fetchHotels();
    setLoading(false);
  };

  const filterAndSortHotels = () => {
    let result = [...hotels];

    // Filter by location
    if (filters.location) {
      result = result.filter(hotel =>
        hotel.location?.toLowerCase().includes(filters.location.toLowerCase()) ||
        hotel.city?.toLowerCase().includes(filters.location.toLowerCase()) ||
        hotel.name?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Filter by price
    result = result.filter(hotel => {
      const minPrice = hotel.rooms?.reduce((min, room) => Math.min(min, room.price || 0), Infinity) || 0;
      return minPrice >= filters.priceRange[0] && minPrice <= filters.priceRange[1];
    });

    // Filter by rating
    if (filters.rating > 0) {
      result = result.filter(hotel => (hotel.rating || 0) >= filters.rating);
    }

    // Sort hotels
    switch (filters.sortBy) {
      case 'price-low':
        result.sort((a, b) => {
          const priceA = a.rooms?.[0]?.price || 0;
          const priceB = b.rooms?.[0]?.price || 0;
          return priceA - priceB;
        });
        break;
      case 'price-high':
        result.sort((a, b) => {
          const priceA = a.rooms?.[0]?.price || 0;
          const priceB = b.rooms?.[0]?.price || 0;
          return priceB - priceA;
        });
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'name':
        result.sort((a, b) => a.name?.localeCompare(b.name));
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
    return hotel.rooms?.reduce((min, room) => Math.min(min, room.price || 0), Infinity) || 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading hotels...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Search */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Find Your Perfect Stay</h1>
            <p className="text-xl text-blue-100">
              Discover amazing hotels at great prices
            </p>
          </div>
          <SearchBar />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
              
              {/* Location Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Search location..."
                  value={filters.location}
                  onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range: ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="50000"
                    step="1000"
                    value={filters.priceRange[0]}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      priceRange: [parseInt(e.target.value), prev.priceRange[1]]
                    }))}
                    className="w-full"
                  />
                  <input
                    type="range"
                    min="0"
                    max="50000"
                    step="1000"
                    value={filters.priceRange[1]}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      priceRange: [prev.priceRange[0], parseInt(e.target.value)]
                    }))}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Rating
                </label>
                <div className="space-y-2">
                  {[0, 3, 4, 4.5].map(rating => (
                    <label key={rating} className="flex items-center">
                      <input
                        type="radio"
                        name="rating"
                        checked={filters.rating === rating}
                        onChange={() => setFilters(prev => ({ ...prev, rating }))}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {rating === 0 ? 'Any rating' : `${rating}+ stars`}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Rating: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>

              {/* Reset Filters */}
              <button
                onClick={() => setFilters({
                  location: '',
                  priceRange: [0, 50000],
                  rating: 0,
                  sortBy: 'featured'
                })}
                className="w-full mt-4 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Hotels Grid */}
          <div className="lg:w-3/4">
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {filteredHotels.length} Hotels Found
                </h2>
                <p className="text-gray-600">
                  {filters.location && `in ${filters.location}`}
                </p>
              </div>
              
              <div className="text-sm text-gray-600">
                Sorted by: {
                  filters.sortBy === 'featured' ? 'Featured' :
                  filters.sortBy === 'price-low' ? 'Price: Low to High' :
                  filters.sortBy === 'price-high' ? 'Price: High to Low' :
                  filters.sortBy === 'rating' ? 'Rating' : 'Name'
                }
              </div>
            </div>

            {/* Hotels Grid */}
            {filteredHotels.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No hotels found</h3>
                <p className="text-gray-600">
                  Try adjusting your search criteria or filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredHotels.map(hotel => (
                  <div
                    key={hotel.id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition duration-200 cursor-pointer"
                    onClick={() => handleHotelSelect(hotel)}
                  >
                    {/* Hotel Image */}
                    <div className="relative">
                      <img
                        src={hotel.image || '/api/placeholder/400/250'}
                        alt={hotel.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                        ⭐ {hotel.rating || '4.2'}
                      </div>
                      {hotel.featured && (
                        <div className="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                          Featured
                        </div>
                      )}
                    </div>

                    {/* Hotel Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">
                        {hotel.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {hotel.location}
                      </p>

                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {hotel.description}
                      </p>

                      {/* Amenities */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {hotel.amenities?.slice(0, 3).map((amenity, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                          >
                            {amenity}
                          </span>
                        ))}
                        {hotel.amenities && hotel.amenities.length > 3 && (
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                            +{hotel.amenities.length - 3} more
                          </span>
                        )}
                      </div>

                      {/* Price and Action */}
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-2xl font-bold text-gray-900">
                            ₹{getMinPrice(hotel).toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">per night</div>
                        </div>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200">
                          View Details
                        </button>
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

export default HotelList;