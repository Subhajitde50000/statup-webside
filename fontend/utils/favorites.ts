/**
 * Favorites API utilities
 */

const API_BASE_URL = 'http://localhost:8000/api';

/**
 * Get auth token from localStorage
 */
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
};

/**
 * Toggle a professional in favorites
 */
export const toggleFavorite = async (professionalId: string) => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_BASE_URL}/favorites/toggle/${professionalId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to toggle favorite');
  }

  return response.json();
};

/**
 * Check if a professional is favorited
 */
export const checkFavorite = async (professionalId: string) => {
  const token = getAuthToken();
  
  if (!token) {
    return { is_favorited: false };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/favorites/check/${professionalId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return { is_favorited: false };
    }

    return response.json();
  } catch (error) {
    console.error('Error checking favorite:', error);
    return { is_favorited: false };
  }
};

/**
 * Get all favorite professionals
 */
export const getFavorites = async () => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('Authentication required');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/favorites/list`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to fetch favorites' }));
      throw new Error(error.detail || 'Failed to fetch favorites');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching favorites:', error);
    throw error;
  }
};

/**
 * Clear all favorites
 */
export const clearAllFavorites = async () => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_BASE_URL}/favorites/clear`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to clear favorites');
  }

  return response.json();
};

/**
 * Get favorites count
 */
export const getFavoritesCount = async () => {
  const token = getAuthToken();
  
  // Return 0 if not authenticated
  if (!token) {
    return { count: 0 };
  }

  const response = await fetch(`${API_BASE_URL}/favorites/count`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    // Return 0 on error instead of throwing
    return { count: 0 };
  }

  return response.json();
};
