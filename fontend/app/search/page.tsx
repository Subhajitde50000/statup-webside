'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../Component/Navbar';
import Footer from '../Component/Footer';
import Notifications from '../Component/Notifications';
import FavoriteButton from '../Component/FavoriteButton';

export default function SearchResults() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const locationParam = searchParams.get('location') || '';

  const [searchInput, setSearchInput] = useState(query);
  const [location, setLocation] = useState(locationParam || 'Salt Lake, Sector 2');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    rating: 'all',
    priceRange: 'all',
    distance: 'all',
    availability: 'all',
    experience: 'all',
    sortBy: 'best-match'
  });

  // Real data from API
  const [allprofessional_views, setAllProfessionalViews] = useState([]);

  // Back to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Apply filters and sorting
  const filteredprofessional_views = useMemo(() => {
    let filtered = [...allprofessional_views];

    // Rating filter
    if (filters.rating !== 'all') {
      filtered = filtered.filter(p => p.rating >= parseFloat(filters.rating));
    }

    // Distance filter
    if (filters.distance !== 'all') {
      filtered = filtered.filter(p => p.distance <= parseFloat(filters.distance));
    }

    // Availability filter
    if (filters.availability === 'now') {
      filtered = filtered.filter(p => p.availability === 'Available now');
    } else if (filters.availability === 'today') {
      filtered = filtered.filter(p => p.availability.includes('today') || p.availability === 'Available now');
    }

    // Experience filter
    if (filters.experience !== 'all') {
      if (filters.experience === '1-3') {
        filtered = filtered.filter(p => p.experience >= 1 && p.experience <= 3);
      } else if (filters.experience === '3-5') {
        filtered = filtered.filter(p => p.experience >= 3 && p.experience <= 5);
      } else if (filters.experience === '5+') {
        filtered = filtered.filter(p => p.experience >= 5);
      }
    }

    // Sorting
    switch (filters.sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'price-low':
        filtered.sort((a, b) => a.pricePerHour - b.pricePerHour);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.pricePerHour - a.pricePerHour);
        break;
      case 'experience':
        filtered.sort((a, b) => b.experience - a.experience);
        break;
      case 'fastest':
        filtered.sort((a, b) => parseInt(a.responseTime) - parseInt(b.responseTime));
        break;
      default:
        // Best match - combination of rating and jobs completed
        filtered.sort((a, b) => (b.rating * b.jobsCompleted) - (a.rating * a.jobsCompleted));
    }

    return filtered;
  }, [allprofessional_views, filters]);

  // Pagination
  const itemsPerPage = 4;
  const totalPages = Math.ceil(filteredprofessional_views.length / itemsPerPage);
  const paginatedprofessional_views = filteredprofessional_views.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Update page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleSearch = () => {
    if (searchInput.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchInput)}&location=${encodeURIComponent(location)}`);
    }
  };

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const clearAllFilters = () => {
    setFilters({
      rating: 'all',
      priceRange: 'all',
      distance: 'all',
      availability: 'all',
      experience: 'all',
      sortBy: 'best-match'
    });
  };

  const hasActiveFilters = () => {
    return filters.rating !== 'all' || 
           filters.distance !== 'all' || 
           filters.availability !== 'all' || 
           filters.experience !== 'all';
  };

  const getAvailabilityColor = (availability: string) => {
    if (availability === 'Available now') return 'text-green-600 bg-green-50';
    if (availability.includes('today')) return 'text-blue-600 bg-blue-50';
    return 'text-gray-600 bg-gray-50';
  };

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
          <div className="flex gap-4">
            <div className="w-20 h-20 rounded-full bg-gray-200"></div>
            <div className="flex-1 space-y-3">
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-[#1A73E8] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            {/* Back Button */}
            <button
              onClick={() => router.back()}
              className="hover:bg-white/10 p-2 rounded-lg transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Search Bar */}
            <div className="flex-1 flex items-center bg-white rounded-xl px-4 py-2 text-gray-800">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Electrician near me"
                className="flex-1 outline-none text-sm md:text-base"
              />
              <button onClick={handleSearch} className="text-[#1A73E8] hover:text-blue-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>

            {/* Notification Bell */}
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="hover:bg-white/10 p-2 rounded-lg transition relative"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>
          </div>
        </div>
      </header>

      {/* Navbar (hidden behind header) */}
      <div className="hidden">
        <Navbar 
          onNotificationClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
          isNotificationsOpen={isNotificationsOpen}
        />
      </div>

      {/* Notifications Panel */}
      <Notifications 
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      {/* Location Display */}
      <div className="bg-[#F5F7FA] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-2xl">📍</span>
              <span className="text-gray-700">Showing results near: <span className="font-semibold">{location}</span></span>
            </div>
            <button
              onClick={() => setShowLocationModal(true)}
              className="text-[#1A73E8] hover:underline text-sm font-medium"
            >
              Change Location →
            </button>
          </div>
        </div>
      </div>

      {/* Filters & Sorting Toolbar */}
      <div className="bg-white border-b border-gray-200 sticky top-[72px] z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Mobile Filter Toggle */}
          <div className="flex md:hidden items-center justify-between mb-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-[#1A73E8] text-white rounded-lg font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Filters {hasActiveFilters() && `(${Object.values(filters).filter(v => v !== 'all' && v !== 'best-match').length})`}
            </button>
            <span className="text-sm text-gray-600">
              {filteredprofessional_views.length} results
            </span>
          </div>

          <div className={`flex gap-3 overflow-x-auto pb-2 scrollbar-hide ${showFilters || 'hidden md:flex'}`}>
            {/* Rating Filter */}
            <select
              value={filters.rating}
              onChange={(e) => handleFilterChange('rating', e.target.value)}
              className={`px-4 py-2 rounded-full border-2 text-sm font-medium whitespace-nowrap cursor-pointer ${
                filters.rating !== 'all' ? 'bg-[#1A73E8] text-white border-[#1A73E8]' : 'bg-white text-gray-700 border-[#FFB800] hover:bg-gray-50'
              }`}
            >
              <option value="all">⭐ All Ratings</option>
              <option value="4.5">⭐ 4.5+</option>
              <option value="4.0">⭐ 4.0+</option>
            </select>

            {/* Price Range Filter */}
            <select
              value={filters.priceRange}
              onChange={(e) => handleFilterChange('priceRange', e.target.value)}
              className={`px-4 py-2 rounded-full border-2 text-sm font-medium whitespace-nowrap cursor-pointer ${
                filters.priceRange !== 'all' ? 'bg-[#1A73E8] text-white border-[#1A73E8]' : 'bg-white text-gray-700 border-[#FFB800] hover:bg-gray-50'
              }`}
            >
              <option value="all">₹ Price Range</option>
              <option value="low-high">Low → High</option>
              <option value="high-low">High → Low</option>
            </select>

            {/* Distance Filter */}
            <select
              value={filters.distance}
              onChange={(e) => handleFilterChange('distance', e.target.value)}
              className={`px-4 py-2 rounded-full border-2 text-sm font-medium whitespace-nowrap cursor-pointer ${
                filters.distance !== 'all' ? 'bg-[#1A73E8] text-white border-[#1A73E8]' : 'bg-white text-gray-700 border-[#FFB800] hover:bg-gray-50'
              }`}
            >
              <option value="all">📏 Distance</option>
              <option value="1">1 km</option>
              <option value="3">3 km</option>
              <option value="5">5 km</option>
              <option value="10">10 km</option>
            </select>

            {/* Availability Filter */}
            <select
              value={filters.availability}
              onChange={(e) => handleFilterChange('availability', e.target.value)}
              className={`px-4 py-2 rounded-full border-2 text-sm font-medium whitespace-nowrap cursor-pointer ${
                filters.availability !== 'all' ? 'bg-[#1A73E8] text-white border-[#1A73E8]' : 'bg-white text-gray-700 border-[#FFB800] hover:bg-gray-50'
              }`}
            >
              <option value="all">🕒 Availability</option>
              <option value="now">Available now</option>
              <option value="today">Today</option>
              <option value="week">This week</option>
            </select>

            {/* Experience Filter */}
            <select
              value={filters.experience}
              onChange={(e) => handleFilterChange('experience', e.target.value)}
              className={`px-4 py-2 rounded-full border-2 text-sm font-medium whitespace-nowrap cursor-pointer ${
                filters.experience !== 'all' ? 'bg-[#1A73E8] text-white border-[#1A73E8]' : 'bg-white text-gray-700 border-[#FFB800] hover:bg-gray-50'
              }`}
            >
              <option value="all">🧰 Experience</option>
              <option value="1-3">1–3 years</option>
              <option value="3-5">3–5 years</option>
              <option value="5+">5+ years</option>
            </select>

            {/* Sort By */}
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="px-4 py-2 rounded-full border-2 border-[#FFB800] bg-white text-gray-700 text-sm font-medium whitespace-nowrap cursor-pointer hover:bg-gray-50"
            >
              <option value="best-match">Sort: Best Match ▼</option>
              <option value="rating">Rating</option>
              <option value="price-low">Price: Low → High</option>
              <option value="price-high">Price: High → Low</option>
              <option value="experience">Experience</option>
              <option value="fastest">Fastest Arrival</option>
            </select>
          </div>
        </div>
      </div>

      {/* View Toggle & Results Count */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Breadcrumbs */}
        <nav className="mb-4 text-sm">
          <ol className="flex items-center gap-2 text-gray-600">
            <li>
              <Link href="/" className="hover:text-[#1A73E8] transition">Home</Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/service" className="hover:text-[#1A73E8] transition">Services</Link>
            </li>
            <li>/</li>
            <li className="text-gray-900 font-medium">{query || 'Search Results'}</li>
          </ol>
        </nav>

        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-600 text-sm md:text-base">
            Found <span className="font-semibold text-[#1A73E8]">{filteredprofessional_views.length}</span> professional_views
            {query && <span className="text-gray-500"> for "{query}"</span>}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                viewMode === 'list' ? 'bg-[#1A73E8] text-white' : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                viewMode === 'map' ? 'bg-[#1A73E8] text-white' : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              🗺 Map View
            </button>
          </div>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters() && (
          <div className="mb-4 flex items-center gap-3">
            <button
              onClick={clearAllFilters}
              className="text-sm text-[#1A73E8] hover:underline font-medium flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear All Filters
            </button>
            <span className="text-sm text-gray-500">
              {Object.values(filters).filter(v => v !== 'all' && v !== 'best-match').length} active
            </span>
          </div>
        )}

        {/* Trust Banner */}
        {!isLoading && paginatedprofessional_views.length > 0 && (
          <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700 font-medium">All professional_views verified</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span className="text-gray-700 font-medium">Instant booking confirmation</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-gray-700 font-medium">4.8+ avg rating</span>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <>
            {/* Results List */}
            {paginatedprofessional_views.length > 0 ? (
              <div className="space-y-4">
                {paginatedprofessional_views.map((professional_view, index) => (
                  <div key={professional_view.id}>
                    {/* Offer Banner - Random between cards */}
                    {index === 1 && (
                      <div className="bg-gradient-to-r from-[#FFB800] to-yellow-400 rounded-xl p-4 mb-4 shadow-md">
                        <p className="text-white font-bold text-lg">🎉 Flat 10% OFF on first electrician booking</p>
                        <p className="text-white text-sm">Limited time offer. Use code: FIRST10</p>
                      </div>
                    )}

                    {/* professional_view Card */}
                    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 md:p-6 relative border border-gray-100">
                      {/* Favorite Button */}
                      <div className="absolute top-4 right-16">
                        <FavoriteButton 
                          key={`fav-${professional_view.id}`}
                          professionalId={professional_view.id}
                          size="small"
                        />
                      </div>
                      
                      {/* Distance Badge */}
                      <div className="absolute top-4 right-4 bg-[#F5F7FA] px-3 py-1 rounded-full text-xs font-medium text-gray-600 flex items-center gap-1">
                        📍 {professional_view.distance} km away
                      </div>

                      <div className="flex flex-col md:flex-row gap-4">
                        {/* Profile Photo */}
                        <div className="flex-shrink-0">
                          <div className="relative">
                            <div className="w-20 h-20 rounded-full border-4 border-[#FFB800] overflow-hidden">
                              <img
                                src={professional_view.photo}
                                alt={professional_view.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            {professional_view.availability === 'Available now' && (
                              <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                            )}
                          </div>
                        </div>

                        {/* Main Info */}
                        <div className="flex-1 space-y-2.5">
                          {/* Name & Profession */}
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-xl font-bold text-gray-800">{professional_view.name}</h3>
                            <span className="bg-[#1A73E8] text-white px-3 py-1 rounded-full text-xs font-medium">
                              {professional_view.profession}
                            </span>
                            {professional_view.verified && (
                              <span className="text-green-600 text-sm" title="Verified professional_view">
                                ✓
                              </span>
                            )}
                          </div>

                          {/* Rating & Reviews */}
                          <div className="flex items-center gap-3 text-sm flex-wrap">
                            <div className="flex items-center gap-1">
                              <span className="text-[#FFB800] font-bold">⭐ {professional_view.rating}</span>
                              <span className="text-gray-600">({professional_view.reviews} reviews)</span>
                            </div>
                            <span className="text-gray-300">•</span>
                            <span className="text-gray-600">{professional_view.experience} years exp</span>
                            <span className="text-gray-300">•</span>
                            <span className="text-gray-600">⚡ Responds in {professional_view.responseTime}</span>
                          </div>

                          {/* Description */}
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {professional_view.description}
                          </p>

                          {/* Price */}
                          <div className="flex items-center gap-4 text-sm flex-wrap">
                            <div>
                              <span className="text-2xl font-black text-gray-800">₹{professional_view.pricePerHour}</span>
                              <span className="text-gray-600">/hour</span>
                            </div>
                            <div className="text-gray-600">
                              Visit charge: <span className="text-[#1A73E8] font-semibold">₹{professional_view.inspectionFee}</span>
                            </div>
                          </div>

                          {/* Skills */}
                          <div className="flex flex-wrap gap-2">
                            {professional_view.skills.map((skill, idx) => (
                              <span
                                key={idx}
                                className="bg-[#F5F7FA] text-gray-700 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 border border-gray-200"
                              >
                                {idx === 0 && '⚡'}
                                {idx === 1 && '🔌'}
                                {idx === 2 && '💡'}
                                {idx === 3 && '🛠'}
                                {skill}
                              </span>
                            ))}
                          </div>

                          {/* Additional Info */}
                          <div className="flex flex-wrap gap-4 text-sm">
                            <span className="flex items-center gap-1.5 text-gray-600">
                              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              {professional_view.jobsCompleted.toLocaleString()}+ jobs completed
                            </span>
                            {professional_view.verified && (
                              <span className="flex items-center gap-1.5 text-green-600 font-medium">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Verified professional_view
                              </span>
                            )}
                          </div>

                          {/* Availability */}
                          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${getAvailabilityColor(professional_view.availability)}`}>
                            <span className="w-2 h-2 rounded-full bg-current"></span>
                            {professional_view.availability}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex md:flex-col gap-2 justify-end md:min-w-[140px]">
                          <button
                            onClick={() => router.push('/professional_view')}
                            className="flex-1 md:flex-initial bg-[#1A73E8] text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg active:scale-95"
                          >
                            Book Now
                          </button>
                          <button
                            onClick={() => router.push('/professional_view')}
                            className="flex-1 md:flex-initial border-2 border-[#1A73E8] text-[#1A73E8] px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all active:scale-95"
                          >
                            View Profile
                          </button>
                        </div>
                      </div>

                      {/* Category-Specific Services Strip */}
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex flex-wrap gap-4 text-xs text-gray-600">
                          <span className="flex items-center gap-1.5">
                            <span className="text-[#FFB800] text-base">⚡</span>
                            <span className="font-medium">Emergency Fixing</span>
                          </span>
                          <span className="flex items-center gap-1.5">
                            <span className="text-[#FFB800] text-base">🔧</span>
                            <span className="font-medium">Appliance Repair</span>
                          </span>
                          <span className="flex items-center gap-1.5">
                            <span className="text-[#FFB800] text-base">🎛</span>
                            <span className="font-medium">Wiring Check</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // No Results State
              <div className="bg-white rounded-xl shadow-md p-8 md:p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="text-6xl mb-6">🔍</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    No professional_views found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    We couldn't find any professional_views matching your criteria in this area.
                  </p>
                  
                  <div className="bg-blue-50 rounded-lg p-6 mb-6 text-left">
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      Try these suggestions:
                    </h4>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5">•</span>
                        <span>Expand your search radius to {filters.distance !== 'all' ? 'more than ' + filters.distance + ' km' : '10+ km'}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5">•</span>
                        <span>Remove some filters to see more results</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5">•</span>
                        <span>Try searching for a broader service category</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5">•</span>
                        <span>Check availability for different time slots</span>
                      </li>
                    </ul>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={clearAllFilters}
                      className="bg-[#1A73E8] text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
                    >
                      Clear All Filters
                    </button>
                    <button
                      onClick={() => router.push('/service')}
                      className="border-2 border-[#1A73E8] text-[#1A73E8] px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all"
                    >
                      Browse Services
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Pagination */}
        {!isLoading && paginatedprofessional_views.length > 0 && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              ← Previous
            </button>
            
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    currentPage === page
                      ? 'bg-[#1A73E8] text-white shadow-md'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />

      {/* Location Change Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Change Location</h3>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 outline-none focus:border-[#1A73E8]"
              placeholder="Enter location"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowLocationModal(false)}
                className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowLocationModal(false)}
                className="flex-1 bg-[#1A73E8] text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700"
              >
                Update Location
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-24 md:bottom-8 right-4 bg-[#1A73E8] text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all hover:scale-110 z-50"
          aria-label="Back to top"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}

      {/* Mobile Bottom Info Bar */}
      {!isLoading && paginatedprofessional_views.length > 0 && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 p-4 z-40 shadow-lg">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600">
              <span className="font-bold text-[#1A73E8]">{filteredprofessional_views.length}</span> professional_views found
            </span>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="text-[#1A73E8] font-medium flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Filters
            </button>
          </div>
          <div className="text-xs text-gray-500 text-center">
            Scroll to explore professional_views
          </div>
        </div>
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
