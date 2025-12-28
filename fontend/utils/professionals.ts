/**
 * Professional API utilities - Advanced search like Zomato/Flipkart
 */

const API_BASE_URL = 'http://localhost:8000/api';

interface SearchFilters {
  query?: string;
  profession?: string;
  city?: string;
  min_experience?: string | number;
  max_hourly_rate?: string | number;
  sort_by?: string;
  page?: string | number;
  limit?: string | number;
}

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
 * Search professionals with advanced filters
 */
export const searchProfessionals = async (filters: SearchFilters = {}) => {
  const params = new URLSearchParams();
  
  if (filters.query) params.append('query', filters.query);
  if (filters.profession) params.append('profession', filters.profession);
  if (filters.city) params.append('city', filters.city);
  if (filters.min_experience) params.append('min_experience', filters.min_experience.toString());
  if (filters.max_hourly_rate) params.append('max_hourly_rate', filters.max_hourly_rate.toString());
  if (filters.sort_by) params.append('sort_by', filters.sort_by);
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());

  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/professionals/search?${params}`, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    throw new Error('Failed to search professionals');
  }

  return response.json();
};

/**
 * Get professional detail by ID
 */
export const getProfessionalDetail = async (professionalId: string) => {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/professionals/${professionalId}`, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    throw new Error('Failed to fetch professional details');
  }

  return response.json();
};

/**
 * Get all available professions
 */
export const getProfessions = async () => {
  const response = await fetch(`${API_BASE_URL}/professionals/professions`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch professions');
  }

  return response.json();
};

/**
 * Get all available cities
 */
export const getCities = async () => {
  const response = await fetch(`${API_BASE_URL}/professionals/cities`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch cities');
  }

  return response.json();
};

/**
 * Get featured/top professionals
 */
export const getFeaturedProfessionals = async (limit: number = 10) => {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/professionals/featured/top?limit=${limit}`, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    throw new Error('Failed to fetch featured professionals');
  }

  return response.json();
};
