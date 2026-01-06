/**
 * Authentication API service
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '/api') || 'http://localhost:8000/api';

// Token storage keys
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user';

// Types
export interface User {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  role: 'user' | 'professional' | 'shopkeeper' | 'manager' | 'admin' | 'pending_professional';
  is_verified: boolean;
  profile_image: string | null;
  email_verified: boolean;
  phone_verified: boolean;
  created_at: string;
  approval_status?: 'pending' | 'approved' | 'rejected';
  approval_data?: Record<string, any>;
  rejected_reason?: string;
  is_suspended?: boolean;
  suspension_reason?: string;
  suspended_at?: string;
}

export interface AuthResponse {
  message: string;
  access_token?: string;
  refresh_token?: string;
  token_type?: string;
  user?: User;
  requires_otp?: boolean;
}

export interface SignupData {
  name: string;
  email?: string;  // Optional - auto-generated if not provided
  phone: string;
  password: string;
}

export interface LoginData {
  identifier: string;
  password: string;
  login_method: 'email' | 'phone';
}

export interface OTPVerifyData {
  identifier: string;
  otp_code: string;
  purpose: string;
}

export interface ResetPasswordData {
  identifier: string;
  otp_code: string;
  new_password: string;
  confirm_password: string;
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
    // Log detailed error for debugging
    console.error('API Error Response:', {
      status: response.status,
      statusText: response.statusText,
      data: data
    });
    
    // Handle validation errors (422)
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

// Token management
export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem(USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
}

export function saveAuthData(accessToken: string, refreshToken: string, user: User): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  // Store user_id separately for socket connections
  localStorage.setItem('user_id', user.id);
  localStorage.setItem('user_name', user.name);
}

export function clearAuthData(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem('user_id');
  localStorage.removeItem('user_name');
}

export function isAuthenticated(): boolean {
  return !!getAccessToken();
}

// ============ AUTH API FUNCTIONS ============

// Signup
export async function signup(data: SignupData): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Verify signup OTP
export async function verifySignup(data: OTPVerifyData): Promise<AuthResponse> {
  const response = await apiRequest<AuthResponse>('/auth/signup/verify', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (response.access_token && response.refresh_token && response.user) {
    saveAuthData(response.access_token, response.refresh_token, response.user);
  }

  return response;
}

// Login with password
export async function login(data: LoginData): Promise<AuthResponse> {
  const response = await apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (response.access_token && response.refresh_token && response.user) {
    saveAuthData(response.access_token, response.refresh_token, response.user);
  }

  return response;
}

// Send login OTP
export async function sendLoginOTP(identifier: string, login_method: 'email' | 'phone'): Promise<{ message: string; success: boolean }> {
  return apiRequest('/auth/login/otp/send', {
    method: 'POST',
    body: JSON.stringify({ identifier, login_method }),
  });
}

// Verify login OTP
export async function verifyLoginOTP(data: OTPVerifyData): Promise<AuthResponse> {
  const response = await apiRequest<AuthResponse>('/auth/login/otp/verify', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (response.access_token && response.refresh_token && response.user) {
    saveAuthData(response.access_token, response.refresh_token, response.user);
  }

  return response;
}

// Forgot password
export async function forgotPassword(identifier: string, reset_method: 'email' | 'phone'): Promise<{ message: string; otp_sent_to: string }> {
  return apiRequest('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ identifier, reset_method }),
  });
}

// Reset password
export async function resetPassword(data: ResetPasswordData): Promise<{ message: string; success: boolean }> {
  return apiRequest('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Send OTP (general)
export async function sendOTP(
  identifier: string, 
  otp_type: 'email' | 'phone', 
  purpose: string
): Promise<{ message: string; success: boolean }> {
  return apiRequest('/auth/otp/send', {
    method: 'POST',
    body: JSON.stringify({ identifier, otp_type, purpose }),
  });
}

// Resend OTP
export async function resendOTP(
  identifier: string,
  otp_type: 'email' | 'phone',
  purpose: string
): Promise<{ message: string; success: boolean }> {
  return apiRequest('/auth/otp/resend', {
    method: 'POST',
    body: JSON.stringify({ identifier, otp_type, purpose }),
  });
}

// Refresh token
export async function refreshToken(): Promise<AuthResponse> {
  const refresh = getRefreshToken();
  if (!refresh) {
    throw new APIError('No refresh token', 401);
  }

  const response = await apiRequest<AuthResponse>('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refresh_token: refresh }),
  });

  if (response.access_token && response.refresh_token) {
    const user = getStoredUser();
    if (user) {
      saveAuthData(response.access_token, response.refresh_token, user);
    }
  }

  return response;
}

// Logout
export async function logout(): Promise<void> {
  try {
    await apiRequest('/auth/logout', { method: 'POST' });
  } catch (error) {
    // Ignore errors during logout
  } finally {
    clearAuthData();
  }
}

// Get current user
export async function getCurrentUser(): Promise<User> {
  const user = await apiRequest<User>('/auth/me');
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return user;
}

// ============ OAUTH FUNCTIONS ============

export async function getGoogleAuthUrl(): Promise<string> {
  const response = await apiRequest<{ auth_url: string }>('/oauth/google/login');
  return response.auth_url;
}

export async function getFacebookAuthUrl(): Promise<string> {
  const response = await apiRequest<{ auth_url: string }>('/oauth/facebook/login');
  return response.auth_url;
}

export function handleOAuthCallback(accessToken: string, refreshToken: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

// ============ USER API FUNCTIONS ============

export async function updateProfile(data: { name?: string; profile_image?: string }): Promise<User> {
  return apiRequest<User>('/users/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function uploadProfileImage(file: File): Promise<{ message: string; image_url: string; user: User }> {
  const formData = new FormData();
  formData.append('file', file);
  
  const token = getAccessToken();
  const response = await fetch(`${API_BASE_URL}/users/upload-profile-image`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new APIError(data.detail || 'Failed to upload image', response.status);
  }

  // Update stored user data
  if (data.user) {
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  }

  return data;
}

export async function deleteProfileImage(): Promise<{ message: string }> {
  return apiRequest('/users/profile-image', {
    method: 'DELETE',
  });
}

export async function changePassword(data: { 
  current_password: string; 
  new_password: string; 
  confirm_password: string 
}): Promise<{ message: string; success: boolean }> {
  return apiRequest('/users/change-password', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function sendEmailVerification(): Promise<{ message: string; success: boolean }> {
  return apiRequest('/users/verify-email/send', { method: 'POST' });
}

export async function verifyEmail(otp_code: string): Promise<{ message: string; success: boolean }> {
  return apiRequest('/users/verify-email', {
    method: 'POST',
    body: JSON.stringify({ otp_code }),
  });
}

export async function sendPhoneVerification(): Promise<{ message: string; success: boolean }> {
  return apiRequest('/users/verify-phone/send', { method: 'POST' });
}

export async function verifyPhone(otp_code: string): Promise<{ message: string; success: boolean }> {
  return apiRequest('/users/verify-phone', {
    method: 'POST',
    body: JSON.stringify({ otp_code }),
  });
}

// ============ ADDRESS MANAGEMENT ============

export interface Address {
  id: string;
  label?: string;
  house_no: string;
  area: string;
  landmark?: string;
  city: string;
  state?: string;
  pincode: string;
  is_default: boolean;
  created_at: string;
  updated_at?: string;
}

export interface AddressCreate {
  label?: string;
  house_no: string;
  area: string;
  landmark?: string;
  city: string;
  state?: string;
  pincode: string;
  is_default?: boolean;
}

export interface AddressUpdate {
  label?: string;
  house_no?: string;
  area?: string;
  landmark?: string;
  city?: string;
  state?: string;
  pincode?: string;
  is_default?: boolean;
}

// Get all user addresses
export async function getUserAddresses(): Promise<{ addresses: Address[]; total: number }> {
  return apiRequest('/users/addresses', {
    method: 'GET',
  });
}

// Add a new address
export async function addUserAddress(address: AddressCreate): Promise<Address> {
  return apiRequest('/users/addresses', {
    method: 'POST',
    body: JSON.stringify(address),
  });
}

// Get a specific address
export async function getAddress(addressId: string): Promise<Address> {
  return apiRequest(`/users/addresses/${addressId}`, {
    method: 'GET',
  });
}

// Update an address
export async function updateUserAddress(addressId: string, address: AddressUpdate): Promise<Address> {
  return apiRequest(`/users/addresses/${addressId}`, {
    method: 'PUT',
    body: JSON.stringify(address),
  });
}

// Delete an address
export async function deleteUserAddress(addressId: string): Promise<{ message: string }> {
  return apiRequest(`/users/addresses/${addressId}`, {
    method: 'DELETE',
  });
}

// Set an address as default
export async function setDefaultAddress(addressId: string): Promise<{ message: string }> {
  return apiRequest(`/users/addresses/${addressId}/default`, {
    method: 'PUT',
  });
}

// ============ ROLE-BASED REDIRECT ============

/**
 * Get the appropriate landing page URL based on user role
 */
export function getRoleBasedRedirectUrl(role: string, approvalStatus?: string): string {
  // For professional/shopkeeper with pending approval
  if ((role === 'professional' || role === 'shopkeeper') && approvalStatus === 'pending') {
    return '/register/status';
  }
  
  switch (role) {
    case 'admin':
      return '/dashboard/admin';
    case 'manager':
      return '/dashboard/manager';
    case 'shopkeeper':
      return '/shopkeeper';
    case 'professional':
      return '/professional';
    case 'user':
    default:
      return '/';
  }
}

/**
 * Redirect user to appropriate landing page based on role
 */
export function redirectByRole(user: User): string {
  const baseUrl = getRoleBasedRedirectUrl(user.role, user.approval_status);
  
  // Add phone query param for pending users
  if (user.approval_status === 'pending') {
    return `${baseUrl}?phone=${user.phone}`;
  }
  
  return baseUrl;
}
