'use client';

import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { toggleFavorite, checkFavorite } from '../../utils/favorites';

export default function FavoriteButton({ professionalId, size = 'default', className = '' }) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentProfId, setCurrentProfId] = useState(professionalId);

  // Check authentication
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    setIsAuthenticated(!!token);
  }, []);

  // Reset state when professionalId changes
  useEffect(() => {
    if (currentProfId !== professionalId) {
      setCurrentProfId(professionalId);
      setIsFavorited(false);
      setIsLoading(false);
    }
  }, [professionalId, currentProfId]);

  // Check if professional is favorited
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!isAuthenticated || !professionalId) return;
      
      try {
        const result = await checkFavorite(professionalId);
        setIsFavorited(result.is_favorited);
      } catch (error) {
        console.error('Error checking favorite status:', error);
        setIsFavorited(false);
      }
    };

    checkFavoriteStatus();
  }, [professionalId, isAuthenticated]);

  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      alert('Please login to save favorites');
      return;
    }

    if (isLoading) return;

    // Store the previous state to revert on error
    const previousState = isFavorited;
    
    // Optimistically update UI
    setIsFavorited(!isFavorited);
    setIsLoading(true);
    
    try {
      const result = await toggleFavorite(professionalId);
      // Update with server response
      setIsFavorited(result.is_favorited);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Revert to previous state on error
      setIsFavorited(previousState);
      alert(error.message || 'Failed to update favorite');
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    small: 'w-8 h-8',
    default: 'w-10 h-10',
    large: 'w-12 h-12'
  };

  const iconSizes = {
    small: 16,
    default: 20,
    large: 24
  };

  if (!isAuthenticated) {
    return null; // Don't show favorite button if not logged in
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`
        ${sizeClasses[size]}
        rounded-full 
        flex items-center justify-center
        transition-all duration-200
        ${isFavorited 
          ? 'bg-red-500 text-white hover:bg-red-600' 
          : 'bg-white text-gray-400 hover:text-red-500 border-2 border-gray-200 hover:border-red-500'
        }
        ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        shadow-md hover:shadow-lg
        ${className}
      `}
      title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart 
        size={iconSizes[size]} 
        fill={isFavorited ? 'currentColor' : 'none'}
        className={isLoading ? 'animate-pulse' : ''}
      />
    </button>
  );
}
