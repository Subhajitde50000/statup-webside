'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, TrendingUp, Clock, Star, ChevronRight } from 'lucide-react';

export default function SearchDropdown({ searchQuery, setSearchQuery, onSearch }) {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    // Save to recent searches
    const updated = [suggestion, ...recentSearches.filter(s => s !== suggestion)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
    setShowDropdown(false);
    router.push(`/search?q=${encodeURIComponent(suggestion)}`);
  };

  const clearInput = () => {
    setSearchQuery('');
    setShowDropdown(false);
  };

  // Mock suggestions - Replace with actual API
  const serviceSuggestions = [
    { icon: '🔌', name: 'Electrician near you' },
    { icon: '🚰', name: 'Plumbing service' },
    { icon: '🧹', name: 'House cleaning' },
    { icon: '🍳', name: 'Home cooking service' },
    { icon: '❄️', name: 'AC repair & service' },
  ];

  const professionalSuggestions = [
    { name: 'Rahul Das', category: 'Electrician', rating: 4.8, photo: 'https://ui-avatars.com/api/?name=Rahul+Das&size=32&background=1E2A5E&color=fff' },
    { name: 'Amit Kumar', category: 'Plumber', rating: 4.9, photo: 'https://ui-avatars.com/api/?name=Amit+Kumar&size=32&background=00BFA6&color=fff' },
  ];

  const trendingSearches = ['Emergency electrician', 'Deep cleaning', 'AC installation'];

  const filteredServices = serviceSuggestions.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div ref={dropdownRef} className="hidden md:flex relative flex-1 max-w-2xl mx-4 lg:mx-8">
      <div className="relative group w-full">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg group-hover:scale-110 transition-transform">
          <Search className="w-4 h-4 text-blue-600" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && searchQuery.trim()) {
              setShowDropdown(false);
              onSearch();
            }
          }}
          placeholder="Search services — electrician, plumber, cleaner, cook…"
          className="w-full pl-14 pr-12 py-3.5 border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-300 bg-white shadow-sm hover:shadow-md font-medium text-gray-700"
        />
        {searchQuery && (
          <button
            onClick={clearInput}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        )}
      </div>

      {/* Dropdown Suggestions */}
      {showDropdown && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-2xl shadow-2xl border border-gray-200 max-h-[70vh] overflow-y-auto z-50">
          {/* Recent Searches */}
          {!searchQuery && recentSearches.length > 0 && (
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-bold text-gray-700">Recent Searches</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(search)}
                    className="px-3 py-1.5 bg-gray-100 rounded-full text-sm font-medium text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Service Suggestions */}
          {filteredServices.length > 0 && (
            <div className="p-4">
              <div className="text-sm font-bold text-gray-700 mb-2">Services</div>
              <div className="space-y-1">
                {filteredServices.slice(0, 5).map((service, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(service.name)}
                    className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition text-left"
                  >
                    <span className="text-xl">{service.icon}</span>
                    <span className="flex-1 text-sm font-medium text-gray-700">{service.name}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Professional Suggestions */}
          {searchQuery && professionalSuggestions.length > 0 && (
            <div className="p-4 border-t border-gray-100">
              <div className="text-sm font-bold text-gray-700 mb-2">Professionals</div>
              <div className="space-y-2">
                {professionalSuggestions.slice(0, 3).map((pro, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(pro.name)}
                    className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition"
                  >
                    <img
                      src={pro.photo}
                      alt={pro.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium text-gray-700">{pro.name}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <span>{pro.category}</span>
                        <span>•</span>
                        <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                        <span>{pro.rating}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Trending Searches */}
          {!searchQuery && (
            <div className="p-4 border-t border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-bold text-gray-700">Trending</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {trendingSearches.map((trend, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(trend)}
                    className="px-3 py-1.5 bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-full text-sm font-medium text-orange-700 hover:shadow-md transition"
                  >
                    🔥 {trend}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {searchQuery && filteredServices.length === 0 && (
            <div className="p-8 text-center">
              <div className="text-4xl mb-2">🔍</div>
              <div className="text-sm text-gray-500">No suggestions found</div>
              <button
                onClick={() => {
                  setShowDropdown(false);
                  router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
                }}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition"
              >
                Search anyway
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
