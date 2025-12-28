/**
 * Services API service
 * Urban Company / Zomato style service listings
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '/api') || 'http://localhost:8000/api';

// Types
export interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  price_type: 'fixed' | 'starting_from' | 'hourly';
  duration: string;
  image: string | null;
  gallery_images: string[];
  is_active: boolean;
  
  // Service Details
  service_area: string | null;
  service_includes: string[];
  service_excludes: string[];
  tags: string[];
  
  // Service Features
  features: string[];
  warranty_days: number | null;
  
  // Availability
  available_days: string[];
  available_time_start: string | null;
  available_time_end: string | null;
  emergency_available: boolean;
  
  // Professional Info
  professional_id: string;
  professional_name: string;
  professional_image: string | null;
  professional_rating: number | null;
  professional_experience: string | null;
  professional_verified: boolean;
  
  // Stats
  bookings_count: number;
  rating: number;
  total_ratings: number;
  reviews_count: number;
  earnings: number;
  created_at: string;
  updated_at: string;
}

export interface ServiceCreate {
  name: string;
  category: string;
  description: string;
  price: number;
  price_type?: string;
  duration: string;
  image?: string;
  gallery_images?: string[];
  is_active?: boolean;
  
  // Service Details
  service_area?: string;
  service_includes?: string[];
  service_excludes?: string[];
  tags?: string[];
  
  // Service Features
  features?: string[];
  warranty_days?: number;
  
  // Availability
  available_days?: string[];
  available_time_start?: string;
  available_time_end?: string;
  emergency_available?: boolean;
}

export interface ServiceUpdate {
  name?: string;
  category?: string;
  description?: string;
  price?: number;
  price_type?: string;
  duration?: string;
  image?: string;
  gallery_images?: string[];
  is_active?: boolean;
  
  // Service Details
  service_area?: string;
  service_includes?: string[];
  service_excludes?: string[];
  tags?: string[];
  
  // Service Features
  features?: string[];
  warranty_days?: number;
  
  // Availability
  available_days?: string[];
  available_time_start?: string;
  available_time_end?: string;
  emergency_available?: boolean;
}

export interface ServiceStats {
  total_services: number;
  active_services: number;
  total_bookings: number;
  total_earnings: number;
  avg_rating: number;
}

export interface ServicesResponse {
  total: number;
  services: Service[];
  skip: number;
  limit: number;
  stats?: ServiceStats;
  categories?: string[];
  filters_applied?: {
    category: string | null;
    search: string | null;
    min_price: number | null;
    max_price: number | null;
    min_rating: number | null;
    service_area: string | null;
    emergency_available: boolean | null;
    sort_by: string;
  };
}

export interface ServiceResponse {
  message: string;
  service: Service;
}

// Professional Profile Types
export interface ProfessionalProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  profile_image: string | null;
  is_verified: boolean;
  approval_status: string;
  
  // Business Profile
  bio: string;
  experience: string;
  hourly_rate: number | null;
  service_areas: string[];
  skills: string[];
  languages: string[];
  certifications: string[];
  working_hours_start: string;
  working_hours_end: string;
  working_days: string[];
  emergency_available: boolean;
  
  // Address
  address: string;
  city: string;
  state: string;
  pincode: string;
  
  // Professional category
  category: string;
  sub_category: string;
  
  // Stats
  rating: number;
  total_reviews: number;
  total_bookings: number;
  member_since: string | null;
}

export interface ProfessionalPublicProfile {
  id: string;
  name: string;
  phone: string | null;
  profile_image: string | null;
  is_verified: boolean;
  approval_status: string;
  bio: string;
  experience: string;
  hourly_rate: number | null;
  category: string;
  sub_category: string;
  service_areas: string[];
  skills: string[];
  languages: string[];
  certifications: string[];
  working_hours_start: string;
  working_hours_end: string;
  working_days: string[];
  emergency_available: boolean;
  city: string;
  state: string;
  rating: number;
  total_reviews: number;
  total_bookings: number;
  member_since: string | null;
}

// API Error class
export class APIError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'APIError';
  }
}

// Get access token
function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

// Helper function for API requests
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add auth token if available
  const token = getAccessToken();
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('API Error Response:', {
      status: response.status,
      statusText: response.statusText,
      data: data
    });
    
    if (response.status === 422 && data.detail) {
      const errorMessage = Array.isArray(data.detail)
        ? data.detail.map((err: any) => `${err.loc.join('.')}: ${err.msg}`).join(', ')
        : data.detail;
      throw new APIError(errorMessage, response.status);
    }
    
    throw new APIError(data.detail || 'An error occurred', response.status);
  }

  return data;
}

// ============ SERVICE API FUNCTIONS ============

/**
 * Create a new service
 */
export async function createService(serviceData: ServiceCreate): Promise<ServiceResponse> {
  return apiRequest<ServiceResponse>('/services/', {
    method: 'POST',
    body: JSON.stringify(serviceData),
  });
}

/**
 * Get my services (for professionals)
 */
export async function getMyServices(params?: {
  is_active?: boolean;
  category?: string;
  search?: string;
  skip?: number;
  limit?: number;
}): Promise<ServicesResponse> {
  const searchParams = new URLSearchParams();
  
  if (params?.is_active !== undefined) {
    searchParams.append('is_active', String(params.is_active));
  }
  if (params?.category) {
    searchParams.append('category', params.category);
  }
  if (params?.search) {
    searchParams.append('search', params.search);
  }
  if (params?.skip !== undefined) {
    searchParams.append('skip', String(params.skip));
  }
  if (params?.limit !== undefined) {
    searchParams.append('limit', String(params.limit));
  }
  
  const queryString = searchParams.toString();
  const endpoint = `/services/my-services${queryString ? `?${queryString}` : ''}`;
  
  return apiRequest<ServicesResponse>(endpoint);
}

/**
 * Get all services (public) - Urban Company style with advanced filters
 */
export async function getAllServices(params?: {
  category?: string;
  search?: string;
  min_price?: number;
  max_price?: number;
  min_rating?: number;
  service_area?: string;
  emergency_available?: boolean;
  sort_by?: 'recommended' | 'price_low' | 'price_high' | 'rating' | 'newest' | 'popular';
  skip?: number;
  limit?: number;
}): Promise<ServicesResponse> {
  const searchParams = new URLSearchParams();
  
  if (params?.category) {
    searchParams.append('category', params.category);
  }
  if (params?.search) {
    searchParams.append('search', params.search);
  }
  if (params?.min_price !== undefined) {
    searchParams.append('min_price', String(params.min_price));
  }
  if (params?.max_price !== undefined) {
    searchParams.append('max_price', String(params.max_price));
  }
  if (params?.min_rating !== undefined) {
    searchParams.append('min_rating', String(params.min_rating));
  }
  if (params?.service_area) {
    searchParams.append('service_area', params.service_area);
  }
  if (params?.emergency_available !== undefined) {
    searchParams.append('emergency_available', String(params.emergency_available));
  }
  if (params?.sort_by) {
    searchParams.append('sort_by', params.sort_by);
  }
  if (params?.skip !== undefined) {
    searchParams.append('skip', String(params.skip));
  }
  if (params?.limit !== undefined) {
    searchParams.append('limit', String(params.limit));
  }
  
  const queryString = searchParams.toString();
  const endpoint = `/services/${queryString ? `?${queryString}` : ''}`;
  
  return apiRequest<ServicesResponse>(endpoint);
}

/**
 * Get service by ID
 */
export async function getServiceById(serviceId: string): Promise<{ service: Service }> {
  return apiRequest<{ service: Service }>(`/services/${serviceId}`);
}

/**
 * Update a service
 */
export async function updateService(serviceId: string, serviceData: ServiceUpdate): Promise<ServiceResponse> {
  return apiRequest<ServiceResponse>(`/services/${serviceId}`, {
    method: 'PUT',
    body: JSON.stringify(serviceData),
  });
}

/**
 * Toggle service status (active/inactive)
 */
export async function toggleServiceStatus(serviceId: string): Promise<ServiceResponse> {
  return apiRequest<ServiceResponse>(`/services/${serviceId}/toggle-status`, {
    method: 'PATCH',
  });
}

/**
 * Delete a service
 */
export async function deleteService(serviceId: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/services/${serviceId}`, {
    method: 'DELETE',
  });
}

/**
 * Get services by professional ID (public)
 */
export async function getServicesByProfessional(professionalId: string, params?: {
  skip?: number;
  limit?: number;
}): Promise<ServicesResponse> {
  const searchParams = new URLSearchParams();
  
  if (params?.skip !== undefined) {
    searchParams.append('skip', String(params.skip));
  }
  if (params?.limit !== undefined) {
    searchParams.append('limit', String(params.limit));
  }
  
  const queryString = searchParams.toString();
  const endpoint = `/services/professional/${professionalId}${queryString ? `?${queryString}` : ''}`;
  
  return apiRequest<ServicesResponse>(endpoint);
}

/**
 * Get all service categories
 */
export async function getServiceCategories(): Promise<{ categories: string[] }> {
  return apiRequest<{ categories: string[] }>('/services/categories/list');
}

// ============ PROFESSIONAL PROFILE API FUNCTIONS ============

/**
 * Get professional business profile
 */
export async function getProfessionalProfile(): Promise<{ profile: ProfessionalProfile }> {
  return apiRequest<{ profile: ProfessionalProfile }>('/users/professional-profile');
}

/**
 * Update professional business profile
 */
export async function updateProfessionalProfile(data: Partial<{
  bio: string;
  experience: string;
  hourly_rate: number;
  service_areas: string[];
  skills: string[];
  languages: string[];
  certifications: string[];
  working_hours_start: string;
  working_hours_end: string;
  working_days: string[];
  emergency_available: boolean;
  address: string;
  city: string;
  state: string;
  pincode: string;
}>): Promise<{ message: string; user: any }> {
  const params = new URLSearchParams();
  
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach(v => params.append(key, v));
      } else {
        params.append(key, String(value));
      }
    }
  });
  
  return apiRequest<{ message: string; user: any }>(`/users/professional-profile?${params.toString()}`, {
    method: 'PUT',
  });
}

/**
 * Get public professional profile
 */
export async function getProfessionalPublicProfile(professionalId: string): Promise<{ professional: ProfessionalPublicProfile }> {
  return apiRequest<{ professional: ProfessionalPublicProfile }>(`/users/professional/${professionalId}/public`);
}
