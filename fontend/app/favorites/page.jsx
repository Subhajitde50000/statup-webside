'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Heart, Star, MapPin, Phone, Mail, Briefcase, ChevronRight, 
  Loader2, AlertCircle, Trash2, User
} from 'lucide-react';
import Link from 'next/link';
import Navbar from '../Component/Navbar';
import Footer from '../Component/Footer';
import FavoriteButton from '../Component/FavoriteButton';
import { getFavorites, clearAllFavorites } from '../../utils/favorites';

export default function FavoritesPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    setIsAuthenticated(!!token);
    
    if (!token) {
      setLoading(false);
      return;
    }

    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getFavorites();
      setFavorites(response.favorites || []);
    } catch (err) {
      console.error('Error fetching favorites:', err);
      setError(err.message || 'Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = async () => {
    if (!confirm('Are you sure you want to remove all favorites?')) return;

    try {
      await clearAllFavorites();
      setFavorites([]);
    } catch (err) {
      console.error('Error clearing favorites:', err);
      alert(err.message || 'Failed to clear favorites');
    }
  };

  const handleFavoriteToggle = () => {
    // Refresh the list after a favorite is removed
    fetchFavorites();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[70vh] px-4">
          <div className="text-center max-w-md">
            <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-10 h-10 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
            <p className="text-gray-600 mb-6">Please login to view your favorite professionals.</p>
            <Link 
              href="/auth"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
            >
              Login Now
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading your favorites...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[70vh] px-4">
          <div className="text-center max-w-md">
            <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Favorites</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={fetchFavorites}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-red-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
                <Heart className="w-10 h-10" fill="white" />
                My Favorites
              </h1>
              <p className="text-pink-100 text-lg">
                {favorites.length === 0 
                  ? 'No professionals saved yet' 
                  : `${favorites.length} professional${favorites.length > 1 ? 's' : ''} saved`}
              </p>
            </div>
            {favorites.length > 0 && (
              <button
                onClick={handleClearAll}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {favorites.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
              <Heart className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Favorites Yet</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Start saving your favorite professionals to quickly access them later!
            </p>
            <Link
              href="/service"
              className="inline-block bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors"
            >
              Browse Services
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((professional) => (
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

                {/* Header with Profile Image */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-24 relative">
                  <div className="absolute -bottom-12 left-6">
                    <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden shadow-xl bg-gradient-to-br from-blue-500 to-purple-600">
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
                          <User className="w-12 h-12 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="pt-16 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {professional.name}
                  </h3>
                  
                  <p className="text-blue-600 font-semibold mb-4">
                    {professional.profession}
                  </p>

                  <div className="space-y-2 mb-4">
                    {professional.experience_years > 0 && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Briefcase className="w-4 h-4 text-gray-400" />
                        <span>{professional.experience_years} years experience</span>
                      </div>
                    )}
                    
                    {professional.city && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{professional.city}, {professional.pincode}</span>
                      </div>
                    )}
                    
                    {professional.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{professional.phone}</span>
                      </div>
                    )}
                  </div>

                  {professional.hourly_rate && (
                    <div className="bg-green-50 rounded-xl p-3 mb-4">
                      <p className="text-sm text-gray-600">Starting from</p>
                      <p className="text-2xl font-bold text-green-600">
                        ₹{professional.hourly_rate}/hr
                      </p>
                    </div>
                  )}

                  <Link
                    href={`/professional_view?id=${professional.id}`}
                    className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
                  >
                    View Profile
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}
