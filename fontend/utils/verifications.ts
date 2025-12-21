/**
 * Verifications API service
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '/api') || 'http://localhost:8000/api';

// Types
export interface Verification {
  id: string;
  user_id: string | null;
  verification_type: 'professional' | 'shop';
  status: 'pending' | 'approved' | 'rejected' | 'more_info_needed';
  risk_score: 'low' | 'medium' | 'high';
  
  // Common fields
  name: string;
  phone: string;
  email: string | null;
  city: string;
  pincode: string;
  
  // Professional specific
  profession: string | null;
  experience: string | null;
  service_radius: string | null;
  aadhaar_number: string | null;
  
  // Shop specific
  shop_name: string | null;
  category: string | null;
  shop_address: string | null;
  gst_number: string | null;
  has_gst: boolean | null;
  
  // Documents
  documents: DocumentInfo[];
  documents_count: number;
  
  // Admin fields
  admin_notes: string | null;
  rejection_reason: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  
  // Timestamps
  submitted_at: string;
  updated_at: string;
}

export interface DocumentInfo {
  document_type: string;
  document_url: string;
  document_name: string;
  uploaded_at: string;
  verified: boolean;
}

export interface VerificationStats {
  pending: number;
  approved_today: number;
  rejected_today: number;
  high_risk: number;
  total_professionals?: number;
  total_shops?: number;
}

export interface ProfessionalVerificationData {
  name: string;
  phone: string;
  email?: string;
  profession: string;
  experience: string;
  address?: string;
  city: string;
  pincode: string;
  service_radius?: string;
  aadhaar_number?: string;
  profile_image?: string;
}

export interface ShopVerificationData {
  owner_name: string;
  phone: string;
  email?: string;
  shop_name: string;
  category: string;
  shop_address: string;
  city: string;
  pincode: string;
  gst_number?: string;
  has_gst: boolean;
  shop_image?: string;
}

export interface VerificationUpdateData {
  status?: 'pending' | 'approved' | 'rejected' | 'more_info_needed';
  risk_score?: 'low' | 'medium' | 'high';
  admin_notes?: string;
  rejection_reason?: string;
}

export interface VerificationListResponse {
  verifications: Verification[];
  total: number;
  page: number;
  limit: number;
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
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new APIError(data.detail || 'An error occurred', response.status);
  }

  return data;
}

// ============ PUBLIC ENDPOINTS (for registration) ============

/**
 * Submit professional verification request (called during registration)
 */
export async function submitProfessionalVerification(data: ProfessionalVerificationData): Promise<Verification> {
  return apiRequest<Verification>('/verifications/professional', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Register professional - alias for submitProfessionalVerification
 */
export async function registerProfessional(data: ProfessionalVerificationData): Promise<Verification> {
  return submitProfessionalVerification(data);
}

/**
 * Submit shop verification request (called during registration)
 */
export async function submitShopVerification(data: ShopVerificationData): Promise<Verification> {
  return apiRequest<Verification>('/verifications/shop', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Register shop - alias for submitShopVerification
 */
export async function registerShop(data: ShopVerificationData): Promise<Verification> {
  return submitShopVerification(data);
}

// ============ MANAGER ENDPOINTS ============

/**
 * Get all verification requests (for managers/admins)
 */
export async function getAllVerifications(params?: {
  status?: string;
  verification_type?: string;
  search?: string;
  risk_score?: string;
  page?: number;
  limit?: number;
}): Promise<VerificationListResponse> {
  const searchParams = new URLSearchParams();
  
  if (params?.status) searchParams.append('status', params.status);
  if (params?.verification_type) searchParams.append('verification_type', params.verification_type);
  if (params?.search) searchParams.append('search', params.search);
  if (params?.risk_score) searchParams.append('risk_score', params.risk_score);
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.limit) searchParams.append('limit', params.limit.toString());
  
  const queryString = searchParams.toString();
  const endpoint = `/verifications${queryString ? `?${queryString}` : ''}`;
  
  return apiRequest<VerificationListResponse>(endpoint);
}

/**
 * Get verification statistics
 */
export async function getVerificationStats(): Promise<VerificationStats> {
  return apiRequest<VerificationStats>('/verifications/stats');
}

/**
 * Get verification by ID
 */
export async function getVerificationById(id: string): Promise<Verification> {
  return apiRequest<Verification>(`/verifications/${id}`);
}

/**
 * Update verification (approve/reject/request more info)
 */
export async function updateVerification(id: string, data: VerificationUpdateData): Promise<Verification> {
  return apiRequest<Verification>(`/verifications/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Delete verification (admin only)
 */
export async function deleteVerification(id: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/verifications/${id}`, {
    method: 'DELETE',
  });
}

// ============ HELPER FUNCTIONS ============

/**
 * Get status color classes
 */
export function getStatusColor(status: string): string {
  switch (status) {
    case 'approved':
      return 'bg-[#D1FAE5] text-[#065F46]';
    case 'rejected':
      return 'bg-[#FEE2E2] text-[#991B1B]';
    case 'pending':
      return 'bg-[#FEF3C7] text-[#92400E]';
    case 'more_info_needed':
      return 'bg-[#DBEAFE] text-[#1E40AF]';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

/**
 * Get risk score color classes
 */
export function getRiskScoreColor(riskScore: string): string {
  switch (riskScore) {
    case 'low':
      return 'bg-[#D1FAE5] text-[#065F46] border-[#10B981]';
    case 'medium':
      return 'bg-[#FED7AA] text-[#9A3412] border-[#F59E0B]';
    case 'high':
      return 'bg-[#FEE2E2] text-[#991B1B] border-[#EF4444]';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
}

/**
 * Format verification type for display
 */
export function formatVerificationType(type: string): string {
  return type === 'professional' ? 'Professional' : 'Shop';
}

/**
 * Format status for display
 */
export function formatStatus(status: string): string {
  return status.replace(/_/g, ' ').toUpperCase();
}
