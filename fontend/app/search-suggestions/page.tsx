'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, TrendingUp, Clock, MapPin, Star, ChevronRight, Zap } from 'lucide-react';
import Link from 'next/link';

export default function SearchSuggestionsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-focus on mobile
    if (inputRef.current) {
      inputRef.current.focus();
    }

    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Save to recent searches
      const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      
      // Navigate to search results
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    handleSearch();
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const clearInput = () => {
    setSearchQuery('');
    setShowSuggestions(false);
  };

  // Mock data - Replace with actual API calls
  const serviceSuggestions = [
    { icon: '🔌', name: 'Electrician near you', badge: 'Popular' },
    { icon: '🚰', name: 'Plumbing service', badge: null },
    { icon: '🧹', name: 'House cleaning', badge: 'Popular' },
    { icon: '🍳', name: 'Home cooking service', badge: null },
    { icon: '🚗', name: 'Driver on demand', badge: null },
    { icon: '❄️', name: 'AC repair & service', badge: 'Trending' },
    { icon: '🔧', name: 'Carpenter', badge: null },
    { icon: '👔', name: 'Laundry service', badge: null },
  ];

  const professionalSuggestions = [
    { name: 'Rahul Das', category: 'Electrician', rating: 4.8, distance: '2 km', photo: 'https://ui-avatars.com/api/?name=Rahul+Das&size=40&background=1E2A5E&color=fff' },
    { name: 'Amit Kumar', category: 'Plumber', rating: 4.9, distance: '1.5 km', photo: 'https://ui-avatars.com/api/?name=Amit+Kumar&size=40&background=00BFA6&color=fff' },
    { name: 'Priya Sharma', category: 'Cleaner', rating: 4.7, distance: '3 km', photo: 'https://ui-avatars.com/api/?name=Priya+Sharma&size=40&background=FF9F43&color=fff' },
  ];

  const shopSuggestions = [
    { name: 'Sharma Electricals', category: 'Electrical Store', status: 'Open', logo: '⚡' },
    { name: 'Modern Hardware', category: 'Hardware Shop', status: 'Open', logo: '🔨' },
    { name: 'Home Essentials', category: 'Home Goods', status: 'Closed', logo: '🏠' },
  ];

  const productSuggestions = [
    { name: 'LED Bulb', price: '₹199', image: '💡' },
    { name: 'Switch Board', price: '₹450', image: '🔌' },
    { name: 'PVC Pipe', price: '₹120', image: '🚰' },
    { name: 'Water Motor', price: '₹3,500', image: '⚙️' },
  ];

  const trendingSearches = [
    { text: 'Emergency electrician', badge: '🔥' },
    { text: 'Deep cleaning', badge: '⭐' },
    { text: 'Festival services', badge: '🔥' },
    { text: 'New professionals', badge: '⭐' },
    { text: 'AC installation', badge: '🔥' },
  ];

  const quickActions = [
    { icon: '🔌', label: 'Electrician' },
    { icon: '🚰', label: 'Plumbing' },
    { icon: '🧹', label: 'Cleaning' },
    { icon: '🔧', label: 'Repair' },
  ];

  return (
    <div className="min-h-screen bg-[#F6F7FB]">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            {/* Back Button */}
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Search Input */}
            <div className="flex-1 relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#00BFA6]" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(e.target.value.length > 0);
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search for electrician, plumber, cleaning, or shop items…"
                  className="w-full pl-12 pr-12 py-3 border-2 border-[#00BFA6] rounded-full focus:outline-none focus:ring-2 focus:ring-[#00BFA6] focus:border-transparent bg-white shadow-sm text-[#1F2937] font-medium"
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
            </div>

            {/* Search Button */}
            {searchQuery && (
              <button
                onClick={handleSearch}
                className="px-6 py-3 bg-gradient-to-r from-[#1E2A5E] to-[#00BFA6] text-white rounded-full font-bold hover:shadow-lg transition"
              >
                Search
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-20 pb-8 px-4 max-w-7xl mx-auto">
        {/* Empty State - No Input */}
        {!searchQuery && !showSuggestions && (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="bg-white rounded-3xl p-8 shadow-lg max-w-md w-full text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-2xl font-bold text-[#1E2A5E] mb-2">
                Search services, professionals, or shops near you
              </h2>
              <p className="text-[#6B7280] mb-6">
                Find the best local services in your area
              </p>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(action.label)}
                    className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-[#F6F7FB] to-white border-2 border-[#E5E7EB] rounded-xl hover:border-[#00BFA6] hover:shadow-md transition"
                  >
                    <span className="text-3xl">{action.icon}</span>
                    <span className="text-sm font-bold text-[#1F2937]">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Trending Searches */}
            <div className="mt-8 w-full max-w-2xl">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-[#FF9F43]" />
                <h3 className="text-lg font-bold text-[#1E2A5E]">Trending Searches</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {trendingSearches.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(item.text)}
                    className="px-4 py-2 bg-white rounded-full border border-[#E5E7EB] hover:border-[#00BFA6] hover:shadow-md transition text-sm font-medium text-[#1F2937] flex items-center gap-2"
                  >
                    <span>{item.badge}</span>
                    <span>{item.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Suggestions Panel - When Typing */}
        {(searchQuery || showSuggestions) && (
          <div className="space-y-6">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="bg-white rounded-2xl p-4 shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#6B7280]" />
                    <h3 className="font-bold text-[#1E2A5E]">Recent Searches</h3>
                  </div>
                  <button
                    onClick={clearRecentSearches}
                    className="text-sm text-[#FF9F43] font-medium hover:underline"
                  >
                    Clear
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(search)}
                      className="px-3 py-1.5 bg-[#F6F7FB] rounded-full text-sm font-medium text-[#1F2937] hover:bg-[#00BFA6] hover:text-white transition"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Service Suggestions */}
            <div className="bg-white rounded-2xl p-4 shadow-md">
              <h3 className="font-bold text-[#1E2A5E] mb-3">Services</h3>
              <div className="space-y-2">
                {serviceSuggestions
                  .filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .slice(0, 5)
                  .map((service, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(service.name)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-[#F6F7FB] rounded-xl transition group"
                    >
                      <span className="text-2xl">{service.icon}</span>
                      <span className="flex-1 text-left font-medium text-[#1F2937]">{service.name}</span>
                      {service.badge && (
                        <span className="px-2 py-1 bg-gradient-to-r from-[#FF9F43] to-[#FFB800] text-white text-xs rounded-full font-bold">
                          {service.badge}
                        </span>
                      )}
                      <ChevronRight className="w-5 h-5 text-[#6B7280] group-hover:text-[#00BFA6] transition" />
                    </button>
                  ))}
              </div>
            </div>

            {/* Professional Suggestions */}
            <div className="bg-white rounded-2xl p-4 shadow-md">
              <h3 className="font-bold text-[#1E2A5E] mb-3">Professionals</h3>
              <div className="space-y-3">
                {professionalSuggestions.map((pro, index) => (
                  <button
                    key={index}
                    onClick={() => router.push(`/professional/${pro.name}`)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-[#F6F7FB] rounded-xl transition"
                  >
                    <img
                      src={pro.photo}
                      alt={pro.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1 text-left">
                      <div className="font-bold text-[#1F2937]">{pro.name}</div>
                      <div className="text-sm text-[#6B7280] flex items-center gap-2">
                        <span>{pro.category}</span>
                        <span>•</span>
                        <Star className="w-3 h-3 fill-[#FFB800] text-[#FFB800]" />
                        <span>{pro.rating}</span>
                        <span>•</span>
                        <span>{pro.distance}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#6B7280]" />
                  </button>
                ))}
              </div>
            </div>

            {/* Shop Suggestions */}
            <div className="bg-white rounded-2xl p-4 shadow-md">
              <h3 className="font-bold text-[#1E2A5E] mb-3">Nearby Shops</h3>
              <div className="space-y-2">
                {shopSuggestions.map((shop, index) => (
                  <button
                    key={index}
                    onClick={() => router.push(`/shop/${shop.name}`)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-[#F6F7FB] rounded-xl transition"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-[#1E2A5E] to-[#00BFA6] rounded-lg flex items-center justify-center text-2xl">
                      {shop.logo}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-bold text-[#1F2937]">{shop.name}</div>
                      <div className="text-sm text-[#6B7280]">{shop.category}</div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      shop.status === 'Open' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {shop.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Product Suggestions */}
            <div className="bg-white rounded-2xl p-4 shadow-md">
              <h3 className="font-bold text-[#1E2A5E] mb-3">Products</h3>
              <div className="grid grid-cols-2 gap-3">
                {productSuggestions.map((product, index) => (
                  <button
                    key={index}
                    onClick={() => router.push(`/product/${product.name}`)}
                    className="p-3 bg-[#F6F7FB] hover:bg-gradient-to-br hover:from-[#F6F7FB] hover:to-white rounded-xl transition border-2 border-transparent hover:border-[#00BFA6]"
                  >
                    <div className="text-4xl mb-2">{product.image}</div>
                    <div className="font-medium text-[#1F2937] text-sm">{product.name}</div>
                    <div className="text-[#00BFA6] font-bold text-sm">{product.price}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* No Results State */}
            {searchQuery && 
              !serviceSuggestions.some(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())) && (
              <div className="bg-white rounded-2xl p-8 shadow-md text-center">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-[#1E2A5E] mb-2">No suggestions found</h3>
                <p className="text-[#6B7280] mb-4">Try searching a different service</p>
                <button
                  onClick={() => router.push('/service')}
                  className="px-6 py-3 bg-gradient-to-r from-[#1E2A5E] to-[#00BFA6] text-white rounded-full font-bold hover:shadow-lg transition"
                >
                  Browse All Services
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
