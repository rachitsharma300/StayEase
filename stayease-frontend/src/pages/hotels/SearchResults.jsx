// pages/hotels/SearchResults.jsx
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AuthContext';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectHotel, searchHotels } = useApp();

  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 50000,
    rating: 0,
    sortBy: 'price'
  });

  // Extract query parameters safely
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = {
    location: queryParams.get('location') || 'Patna',
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
        setError(result.message || 'No results found');
      }
    } catch (err) {
      console.error('Search error:', err);
      setSearchResults([]);
      setError('Failed to fetch search results');
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

  // Safe array for filtering
  const filteredAndSortedResults = (Array.isArray(searchResults) ? searchResults : [])
    .filter(hotel => {
      const roomPrice = hotel.rooms?.[0]?.price || 0;
      return roomPrice >= filters.minPrice &&
             roomPrice <= filters.maxPrice &&
             hotel.rating >= filters.rating;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'price':
          return (a.rooms?.[0]?.price || 0) - (b.rooms?.[0]?.price || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Searching for hotels...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {searchQuery.location ? `Hotels in ${searchQuery.location}` : 'All Hotels'}
          </h1>
          <p className="text-gray-600 mt-2">
            {searchQuery.checkIn && searchQuery.checkOut 
              ? `${formatDate(searchQuery.checkIn)} - ${formatDate(searchQuery.checkOut)} • ${searchQuery.guests} guest${searchQuery.guests > 1 ? 's' : ''}`
              : 'Flexible dates'}
          </p>
          <p className="text-gray-600">Found {filteredAndSortedResults.length} hotels</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range (₹{filters.minPrice} - ₹{filters.maxPrice})
                </label>
                <div className="space-y-2">
                  <input type="range" min="0" max="50000" step="1000" value={filters.minPrice} onChange={e => setFilters(prev => ({ ...prev, minPrice: parseInt(e.target.value) }))} className="w-full" />
                  <input type="range" min="0" max="50000" step="1000" value={filters.maxPrice} onChange={e => setFilters(prev => ({ ...prev, maxPrice: parseInt(e.target.value) }))} className="w-full" />
                </div>
              </div>

              {/* Rating */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
                {[0,3,4,4.5].map(r => (
                  <label key={r} className="flex items-center">
                    <input type="radio" name="rating" checked={filters.rating === r} onChange={() => setFilters(prev => ({ ...prev, rating: r }))} className="text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-700">{r===0 ? 'Any rating' : `${r}+ stars`}</span>
                  </label>
                ))}
              </div>

              {/* Sort */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select value={filters.sortBy} onChange={e => setFilters(prev => ({ ...prev, sortBy: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="price">Price: Low to High</option>
                  <option value="rating">Rating: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>

              {/* Reset */}
              <button onClick={() => setFilters({ minPrice:0, maxPrice:50000, rating:0, sortBy:'price' })} className="w-full mt-4 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200">Reset Filters</button>
            </div>
          </div>

          {/* Hotel Results */}
          <div className="lg:col-span-3 space-y-6">
            {filteredAndSortedResults.length===0 ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No hotels found</h3>
                <p className="text-gray-600">{searchQuery.location ? `No hotels found in ${searchQuery.location}` : 'Try adjusting your filters'}</p>
                <button onClick={() => navigate('/')} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200">Browse All Hotels</button>
              </div>
            ) : filteredAndSortedResults.map(hotel => (
              <div key={hotel.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition duration-200">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3">
                    <img src={hotel.image || '/api/placeholder/400/250'} alt={hotel.name} className="w-full h-48 md:h-full object-cover" onError={e=>{e.target.src='/api/placeholder/400/250'}}/>
                  </div>
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{hotel.name}</h3>
                        <p className="text-gray-600 mt-1">{hotel.location}</p>
                        <div className="flex items-center mt-2">
                          <span className="text-yellow-600">⭐ {hotel.rating || '4.2'}</span>
                          <span className="mx-2 text-gray-300">•</span>
                          <span className="text-gray-600">{hotel.reviews || '120'} reviews</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">₹{hotel.rooms?.[0]?.price?.toLocaleString() || '0'}</div>
                        <div className="text-sm text-gray-600">per night</div>
                        <div className="text-xs text-green-600">Free cancellation</div>
                      </div>
                    </div>
                    <p className="text-gray-600 mt-3 line-clamp-2">{hotel.description || 'Comfortable stay with modern amenities.'}</p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {hotel.amenities?.slice(0,3).map((a,i)=><span key={i} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">{a}</span>)}
                      {hotel.amenities && hotel.amenities.length>3 && <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">+{hotel.amenities.length-3} more</span>}
                    </div>
                    <button onClick={()=>handleHotelSelect(hotel)} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200">View Rooms</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' });
};

export default SearchResults;
