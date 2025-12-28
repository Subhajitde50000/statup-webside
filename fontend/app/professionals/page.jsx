'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Search, SlidersHorizontal, X, MapPin, Star, TrendingUp, 
  ChevronDown, Filter, Loader2, Heart, Phone, Calendar,
  Award, Briefcase, IndianRupee, User, CheckCircle, ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import Navbar from '../Component/Navbar';
import Footer from '../Component/Footer';
import FavoriteButton from '../Component/FavoriteButton';

const API_BASE_URL = 'http://localhost:8000/api';

export default function ProfessionalsSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Search state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedProfession, setSelectedProfession] = useState(searchParams.get('profession') || '');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || '');
  const [minExperience, setMinExperience] = useState(searchParams.get('exp') || '');
  const [maxRate, setMaxRate] = useState(searchParams.get('rate') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'relevance');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Data state
  const [professionals, setProfessionals] = useState([]);
  const [professions, setProfessions] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch professions and cities
  useEffect(() => {
    fetchProfessions();
    fetchCities();
  }, []);

  // Fetch professionals when filters change
  useEffect(() => {
    searchProfessionals();
  }, [searchQuery, selectedProfession, selectedCity, minExperience, maxRate, sortBy, currentPage]);

  const fetchProfessions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/professionals/professions`);
      const data = await response.json();
      if (data.success) {
        setProfessions(data.professions);
      }
    } catch (error) {
      console.error('Error fetching professions:', error);
    }
  };

  const fetchCities = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/professionals/cities`);
      const data = await response.json();
      if (data.success) {
        setCities(data.cities);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const searchProfessionals = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('query', searchQuery);
      if (selectedProfession) params.append('profession', selectedProfession);
      if (selectedCity) params.append('city', selectedCity);
      if (minExperience) params.append('min_experience', minExperience);
      if (maxRate) params.append('max_hourly_rate', maxRate);
      params.append('sort_by', sortBy);
      params.append('page', currentPage.toString());
      params.append('limit', '12');

      const token = localStorage.getItem('access_token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

      const response = await fetch(`${API_BASE_URL}/professionals/search?${params}`, { headers });
      const data = await response.json();
      
      if (data.success) {
        setProfessionals(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error searching professionals:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedProfession('');
    setSelectedCity('');
    setMinExperience('');
    setMaxRate('');
    setSortBy('relevance');
    setCurrentPage(1);
  };

  const hasActiveFilters = searchQuery || selectedProfession || selectedCity || minExperience || maxRate;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-4">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          <h1 className="text-4xl font-black mb-4">Find Professional Services</h1>
          <p className="text-blue-100 text-lg">Search from verified professionals in your area</p>
          
          {/* Search Bar */}
          <div className="mt-6 bg-white rounded-2xl shadow-2xl p-2">
            <div className="flex gap-2">
              <div className="flex-1 flex items-center gap-3 px-4">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, profession, skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 py-3 text-gray-900 placeholder-gray-500 focus:outline-none"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                <SlidersHorizontal className="w-5 h-5" />
                Filters
                {hasActiveFilters && (
                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                    {[searchQuery, selectedProfession, selectedCity, minExperience, maxRate].filter(Boolean).length}
                  </span>
                )}
              </button>
              <button
                onClick={searchProfessionals}
                className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white border-b shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Profession Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Profession</label>
                <select
                  value={selectedProfession}
                  onChange={(e) => setSelectedProfession(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                >
                  <option value="">All Professions</option>
                  {professions.map((prof) => (
                    <option key={prof} value={prof}>{prof}</option>
                  ))}
                </select>
              </div>

              {/* City Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                >
                  <option value="">All Cities</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Experience Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Min Experience (years)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g., 3"
                  value={minExperience}
                  onChange={(e) => setMinExperience(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Rate Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Max Rate (₹/hr)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g., 500"
                  value={maxRate}
                  onChange={(e) => setMaxRate(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold"
              >
                <X className="w-4 h-4" />
                Clear All Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Sort and Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            {loading ? 'Searching...' : (
              <>
                <span className="font-bold text-gray-900">{pagination?.total_items || 0}</span> professionals found
              </>
            )}
          </p>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
          >
            <option value="relevance">Most Relevant</option>
            <option value="experience">Most Experienced</option>
            <option value="rate_low">Price: Low to High</option>
            <option value="rate_high">Price: High to Low</option>
            <option value="recent">Newest First</option>
          </select>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          </div>
        ) : (
          <>
            {/* Professionals Grid */}
            {professionals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {professionals.map((professional) => (
                  <div
                    key={professional.id}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group relative"
                  >
                    {/* Favorite Button */}
                    <div className="absolute top-4 right-4 z-10">
                      <FavoriteButton 
                        key={`fav-${professional.id}`}
                        professionalId={professional.id}
                        size="default"
                      />
                    </div>

                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-20 relative">
                      <div className="absolute -bottom-10 left-6">
                        <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden shadow-xl bg-gradient-to-br from-blue-500 to-purple-600">
                          {professional.profile_image ? (
                            <img
                              src={professional.profile_image.startsWith('http') 
                                ? professional.profile_image 
                                : `http://localhost:8000${professional.profile_image}`}
                              alt={professional.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <User className="w-10 h-10 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="pt-14 p-6">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-1">
                            {professional.name}
                          </h3>
                          <p className="text-blue-600 font-semibold text-sm">
                            {professional.profession}
                          </p>
                        </div>
                        {professional.is_verified && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Briefcase className="w-4 h-4 text-gray-400" />
                          <span>{professional.experience_years} years experience</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span>{professional.city}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span>{professional.rating} rating</span>
                        </div>
                      </div>

                      {professional.hourly_rate && (
                        <div className="bg-green-50 rounded-xl p-3 mb-4">
                          <p className="text-xs text-gray-600">Starting from</p>
                          <p className="text-xl font-bold text-green-600">
                            ₹{professional.hourly_rate}/hr
                          </p>
                        </div>
                      )}

                      <Link
                        href={`/professional_view?id=${professional.id}`}
                        className="block w-full bg-blue-600 text-white text-center py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
                  <Search className="w-16 h-16 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No Professionals Found</h3>
                <p className="text-gray-500 mb-8">Try adjusting your filters or search query</p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.total_pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={!pagination.has_prev}
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                
                <div className="flex gap-2">
                  {Array.from({ length: Math.min(5, pagination.total_pages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-lg font-bold ${
                          page === currentPage
                            ? 'bg-blue-600 text-white'
                            : 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={!pagination.has_next}
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
