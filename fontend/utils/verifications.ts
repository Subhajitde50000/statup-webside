/**
 * Simplified Verifications API service
 * Works with users collection directly - no separate verifications collection
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '/api') || 'http://localhost:8000/api';

// Types
export interface Verification {
  id: string;
  user_id: string;
  verification_type: 'professional' | 'shop';
  status: 'pending' | 'approved' | 'rejected' | 'more_info_needed';
  risk_score: string;
  name: string;
  phone: string;
  email: string | null;
  city: string;
  pincode: string;
  profession: string | null;
  experience: string | null;
  service_radius: string | null;
  shop_name: string | null;
  category: string | null;
  shop_address: string | null;
  admin_notes: string | null;
  rejection_reason: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  documents: any[];
  documents_count: number;
  submitted_at: string;
  updated_at: string;
}

export interface VerificationStats {
  pending: number;
  approved_today: number;
  rejected_today: number;
  high_risk: number;
  total_professionals?: number;
  total_shops?: number;
}

export interface VerificationListResponse {
  verifications: Verification[];
  total: number;
  page: number;
  limit: number;
}

export interface VerificationUpdateData {
  status: 'approved' | 'rejected' | 'more_info_needed';
  admin_notes?: string;
  rejection_reason?: string;
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
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers: HeadersInit = { 'Content-Type': 'application/json', ...options.headers };

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, { ...options, headers });
  const data = await response.json();

  if (!response.ok) {
    throw new APIError(data.detail || 'An error occurred', response.status);
  }

  return data;
}

// ============ MANAGER ENDPOINTS ============

/**
 * Get all verifications (pending registrations)
 */
export async function getAllVerifications(params?: {
  status?: string;
  verification_type?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<VerificationListResponse> {
  const searchParams = new URLSearchParams();
  
  if (params?.status) searchParams.append('status', params.status);
  if (params?.verification_type) searchParams.append('verification_type', params.verification_type);
  if (params?.search) searchParams.append('search', params.search);
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
 * Update verification (approve/reject)
 */
export async function updateVerification(id: string, data: VerificationUpdateData): Promise<any> {
  return apiRequest(`/verifications/${id}`, {
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

export function getStatusColor(status: string): string {
  switch (status) {
    case 'approved': return 'bg-[#D1FAE5] text-[#065F46]';
    case 'rejected': return 'bg-[#FEE2E2] text-[#991B1B]';
    case 'pending': return 'bg-[#FEF3C7] text-[#92400E]';
    case 'more_info_needed': return 'bg-[#DBEAFE] text-[#1E40AF]';
    default: return 'bg-gray-100 text-gray-800';
  }
}

export function formatVerificationType(type: string): string {
  return type === 'professional' ? 'Professional' : 'Shop';
}

export function formatStatus(status: string): string {
  return status.replace(/_/g, ' ').toUpperCase();
}

export function getRiskScoreColor(riskScore: string): string {
  switch (riskScore) {
    case 'low': return 'bg-[#D1FAE5] text-[#065F46] border-[#10B981]';
    case 'medium': return 'bg-[#FED7AA] text-[#9A3412] border-[#F59E0B]';
    case 'high': return 'bg-[#FEE2E2] text-[#991B1B] border-[#EF4444]';
    default: return 'bg-gray-100 text-gray-800 border-gray-300';
  }
}
