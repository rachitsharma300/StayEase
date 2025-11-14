// components/SearchBar.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 1
  });

  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!searchData.location) {
      alert('Please enter a location');
      return;
    }

    // Navigate to search results page with query parameters
    navigate(`/search?location=${encodeURIComponent(searchData.location)}&checkIn=${searchData.checkIn}&checkOut=${searchData.checkOut}&guests=${searchData.guests}`);
  };

  const today = new Date().toISOString().split('T')[0];

  // Calculate minimum check-out date (check-in date or today)
  const getMinCheckoutDate = () => {
    return searchData.checkIn || today;
  };

  // Get tomorrow's date for default check-out
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Popular destinations for quick selection
  const popularDestinations = [
    'Delhi', 'Bangalore', 'Goa', 'Kolkata',
    'Chennai', 'Hyderabad', 'Pune', 'Jaipur', 'Kerala'
  ];

  return (
    <div className={`bg-white rounded-2xl shadow-2xl p-8 w-full max-w-6xl mx-auto transition-all duration-500 ${
      isFocused ? 'shadow-2xl ring-2 ring-blue-500/20 transform -translate-y-1' : 'shadow-xl'
    }`}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Find Your Perfect Stay</h2>
        <p className="text-gray-600">Discover amazing hotels at the best prices</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Popular Destinations */}
        <div className="flex flex-wrap gap-2 justify-center">
          {popularDestinations.map((destination) => (
            <button
              key={destination}
              type="button"
              onClick={() => setSearchData({...searchData, location: destination})}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                searchData.location === destination
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
              }`}
            >
              {destination}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
          {/* Location - Enhanced */}
          <div className="lg:col-span-3">
            <label htmlFor="location" className="block text-sm font-semibold text-gray-800 mb-2 flex items-center">
              <svg className="w-4 h-4 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              Destination
            </label>
            <div className="relative">
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <input
                type="text"
                id="location"
                name="location"
                value={searchData.location}
                onChange={handleChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Where are you going?"
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 bg-gray-50 hover:bg-white"
                required
              />
            </div>
          </div>

          {/* Check-in - Enhanced */}
          <div className="lg:col-span-2">
            <label htmlFor="checkIn" className="block text-sm font-semibold text-gray-800 mb-2 flex items-center">
              <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Check-in
            </label>
            <input
              type="date"
              id="checkIn"
              name="checkIn"
              value={searchData.checkIn}
              onChange={handleChange}
              min={today}
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 bg-gray-50 hover:bg-white font-medium"
            />
          </div>

          {/* Check-out - Enhanced */}
          <div className="lg:col-span-2">
            <label htmlFor="checkOut" className="block text-sm font-semibold text-gray-800 mb-2 flex items-center">
              <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Check-out
            </label>
            <input
              type="date"
              id="checkOut"
              name="checkOut"
              value={searchData.checkOut}
              onChange={handleChange}
              min={getMinCheckoutDate()}
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 bg-gray-50 hover:bg-white font-medium"
            />
          </div>

          {/* Guests - Enhanced */}
          <div className="lg:col-span-2">
            <label htmlFor="guests" className="block text-sm font-semibold text-gray-800 mb-2 flex items-center">
              <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Guests
            </label>
            <div className="relative">
              <select
                id="guests"
                name="guests"
                value={searchData.guests}
                onChange={handleChange}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 bg-gray-50 hover:bg-white appearance-none font-medium"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Guest' : 'Guests'}
                  </option>
                ))}
              </select>
              <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Search Button - Enhanced */}
          <div className="lg:col-span-3">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-4 rounded-xl hover:shadow-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:from-blue-700 hover:to-indigo-800 shadow-lg shadow-blue-500/25 group"
            >
              <div className="flex items-center justify-center space-x-3">
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Search Hotels</span>
              </div>
            </button>
          </div>
        </div>

        {/* Quick Date Suggestions */}
        <div className="flex flex-wrap gap-3 justify-center text-sm">
          <button
            type="button"
            onClick={() => {
              const today = new Date();
              const tomorrow = new Date(today);
              tomorrow.setDate(tomorrow.getDate() + 1);
              const dayAfter = new Date(today);
              dayAfter.setDate(dayAfter.getDate() + 2);
              
              setSearchData({
                ...searchData,
                checkIn: today.toISOString().split('T')[0],
                checkOut: tomorrow.toISOString().split('T')[0]
              });
            }}
            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-200"
          >
            Today - Tomorrow
          </button>
          <button
            type="button"
            onClick={() => {
              const today = new Date();
              const nextWeek = new Date(today);
              nextWeek.setDate(nextWeek.getDate() + 7);
              const nextWeekPlus = new Date(today);
              nextWeekPlus.setDate(nextWeekPlus.getDate() + 8);
              
              setSearchData({
                ...searchData,
                checkIn: nextWeek.toISOString().split('T')[0],
                checkOut: nextWeekPlus.toISOString().split('T')[0]
              });
            }}
            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-200"
          >
            Next Weekend
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;