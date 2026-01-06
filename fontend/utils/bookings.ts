/**
 * Bookings API Utility Functions
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Get access token from localStorage
function getAccessToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
}

// API request helper
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAccessToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(error.detail || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}

// Types
export interface BookingProfessional {
  id: string;
  name: string;
  photo: string;
  rating: number;
  phone?: string;
  category?: string;
}

export interface BookingService {
  id: string;
  name: string;
  category: string;
  price: number;
  duration: string;
  image?: string;
}

export interface BookingAddress {
  label?: string;
  house_no?: string;
  area?: string;
  landmark?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export interface Booking {
  id: string;
  booking_id: string;
  service_type: string;
  service_name: string;
  category: string;
  status: 'pending' | 'confirmed' | 'accepted' | 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  date: string;
  time: string;
  address: BookingAddress;
  address_display: string;
  price: number;
  payment_status: string;
  payment_method: string;
  otp?: string;
  notes?: string;
  rating?: number;
  review?: string;
  cancellation_reason?: string;
  cancelled_by?: string;
  refund_status?: string;
  created_at: string;
  updated_at: string;
  accepted_at?: string;
  started_at?: string;
  completed_at?: string;
  otp_requested_at?: string;
  professional?: BookingProfessional;
  service?: BookingService;
  user?: {
    id: string;
    name: string;
    phone?: string;
    email?: string;
  };
}

export interface BookingsResponse {
  bookings: Booking[];
  total: number;
  status_counts: {
    all: number;
    pending: number;
    confirmed: number;
    upcoming: number;
    ongoing: number;
    completed: number;
    cancelled: number;
  };
  skip: number;
  limit: number;
}

export interface BookingDetailResponse {
  booking: Booking;
}

export interface CreateBookingData {
  professional_id: string;
  service_id?: string;
  service_type?: string;
  service_name?: string;
  category?: string;
  description?: string;
  scheduled_date: string;
  scheduled_time: string;
  address: BookingAddress;
  price?: number;
  payment_method?: string;
  notes?: string;
}

export interface CreateBookingResponse {
  message: string;
  booking: Booking;
  otp: string;
}

// API Functions

/**
 * Get user's bookings with optional filters
 */
export async function getUserBookings(params?: {
  status?: string;
  category?: string;
  search?: string;
  skip?: number;
  limit?: number;
}): Promise<BookingsResponse> {
  const searchParams = new URLSearchParams();
  
  if (params?.status) searchParams.append('status', params.status);
  if (params?.category) searchParams.append('category', params.category);
  if (params?.search) searchParams.append('search', params.search);
  if (params?.skip !== undefined) searchParams.append('skip', String(params.skip));
  if (params?.limit !== undefined) searchParams.append('limit', String(params.limit));
  
  const queryString = searchParams.toString();
  return apiRequest<BookingsResponse>(`/bookings/my-bookings${queryString ? `?${queryString}` : ''}`);
}

/**
 * Get booking details by ID
 */
export async function getBookingById(bookingId: string): Promise<BookingDetailResponse> {
  return apiRequest<BookingDetailResponse>(`/bookings/booking/${bookingId}`);
}

/**
 * Create a new booking
 */
export async function createBooking(data: CreateBookingData): Promise<CreateBookingResponse> {
  return apiRequest<CreateBookingResponse>('/bookings/create', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Update a booking
 */
export async function updateBooking(
  bookingId: string,
  data: Partial<{
    scheduled_date: string;
    scheduled_time: string;
    address: BookingAddress;
    notes: string;
  }>
): Promise<{ message: string; booking: Booking }> {
  return apiRequest(`/bookings/update/${bookingId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Cancel a booking
 */
export async function cancelBooking(
  bookingId: string,
  reason?: string
): Promise<{ message: string; booking: Booking; refund_status: string }> {
  const searchParams = new URLSearchParams();
  if (reason) searchParams.append('cancellation_reason', reason);
  
  return apiRequest(`/bookings/cancel/${bookingId}?${searchParams.toString()}`, {
    method: 'POST',
  });
}

/**
 * Rate a completed booking
 */
export async function rateBooking(
  bookingId: string,
  rating: number,
  review?: string
): Promise<{ message: string; booking: Booking }> {
  const searchParams = new URLSearchParams();
  searchParams.append('rating', String(rating));
  if (review) searchParams.append('review', review);
  
  return apiRequest(`/bookings/rate/${bookingId}?${searchParams.toString()}`, {
    method: 'POST',
  });
}

/**
 * Get professional's bookings (for professionals)
 */
export async function getProfessionalBookings(params?: {
  status?: string;
  skip?: number;
  limit?: number;
}): Promise<BookingsResponse> {
  const searchParams = new URLSearchParams();
  
  if (params?.status) searchParams.append('status', params.status);
  if (params?.skip !== undefined) searchParams.append('skip', String(params.skip));
  if (params?.limit !== undefined) searchParams.append('limit', String(params.limit));
  
  const queryString = searchParams.toString();
  return apiRequest<BookingsResponse>(`/bookings/professional-bookings${queryString ? `?${queryString}` : ''}`);
}

/**
 * Start a booking (professional verifies OTP)
 */
export async function startBooking(
  bookingId: string,
  otp: string
): Promise<{ message: string; booking: Booking }> {
  return apiRequest(`/bookings/start/${bookingId}?otp=${otp}`, {
    method: 'POST',
  });
}

/**
 * Complete a booking (professional marks as done)
 */
export async function completeBooking(
  bookingId: string
): Promise<{ message: string; booking: Booking }> {
  return apiRequest(`/bookings/complete/${bookingId}`, {
    method: 'POST',
  });
}

/**
 * Accept a booking (professional accepts the job)
 */
export async function acceptBooking(
  bookingId: string
): Promise<{ message: string; booking: Booking }> {
  return apiRequest(`/bookings/accept/${bookingId}`, {
    method: 'POST',
  });
}

/**
 * Reject a booking (professional rejects the job)
 */
export async function rejectBooking(
  bookingId: string,
  reason?: string
): Promise<{ message: string; booking: Booking }> {
  const searchParams = new URLSearchParams();
  if (reason) searchParams.append('rejection_reason', reason);
  
  return apiRequest(`/bookings/reject/${bookingId}?${searchParams.toString()}`, {
    method: 'POST',
  });
}

/**
 * Send OTP request (professional arrived at location)
 */
export async function sendOTPRequest(
  bookingId: string
): Promise<{ message: string; booking_id: string }> {
  return apiRequest(`/bookings/send-otp/${bookingId}`, {
    method: 'POST',
  });
}
