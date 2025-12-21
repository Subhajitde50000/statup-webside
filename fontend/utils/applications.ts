/**
 * Job Application API service
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '/api') || 'http://localhost:8000/api';

// Types
export interface Application {
  id: string;
  vacancy_id: string;
  vacancy_title: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone: string;
  current_location: string;
  date_of_birth?: string;
  
  // Professional
  current_company?: string;
  current_designation?: string;
  total_experience: string;
  current_salary?: string;
  expected_salary: string;
  notice_period: string;
  
  // Education
  highest_qualification: string;
  university?: string;
  graduation_year?: string;
  cgpa?: string;
  
  // Additional
  cover_letter?: string;
  portfolio?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  
  // Preferences
  willing_to_relocate: boolean;
  available_for_interview: boolean;
  
  // Tracking
  stage: string;
  score: number;
  status: string;
  notes?: string;
  applied_at: string;
  updated_at: string;
  user_id?: string;
}

export interface ApplicationCreateData {
  vacancy_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  current_location: string;
  date_of_birth?: string;
  
  current_company?: string;
  current_designation?: string;
  total_experience: string;
  current_salary?: string;
  expected_salary: string;
  notice_period: string;
  
  highest_qualification: string;
  university?: string;
  graduation_year?: string;
  cgpa?: string;
  
  cover_letter?: string;
  portfolio?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  
  willing_to_relocate?: boolean;
  available_for_interview?: boolean;
}

export interface ApplicationsResponse {
  total: number;
  applications: Application[];
  skip: number;
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
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
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

// ============ APPLICATION API FUNCTIONS ============

// Submit application (no authentication required)
export async function submitApplication(data: ApplicationCreateData): Promise<{ message: string; application: Application }> {
  const response = await fetch(`${API_BASE_URL}/applications/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new APIError(responseData.detail || 'An error occurred', response.status);
  }

  return responseData;
}

// Get all applications (admin)
export async function getAllApplications(params?: {
  stage?: string;
  vacancy_id?: string;
  search?: string;
  skip?: number;
  limit?: number;
}): Promise<ApplicationsResponse> {
  const queryParams = new URLSearchParams();
  
  if (params?.stage) queryParams.append('stage', params.stage);
  if (params?.vacancy_id) queryParams.append('vacancy_id', params.vacancy_id);
  if (params?.search) queryParams.append('search', params.search);
  if (params?.skip !== undefined) queryParams.append('skip', params.skip.toString());
  if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString());
  
  const query = queryParams.toString();
  return apiRequest(`/applications/admin/list${query ? `?${query}` : ''}`);
}

// Get application by ID
export async function getApplicationById(applicationId: string): Promise<{ application: Application }> {
  return apiRequest(`/applications/${applicationId}`);
}

// Update application
export async function updateApplication(
  applicationId: string,
  data: {
    stage?: string;
    score?: number;
    notes?: string;
    status?: string;
  }
): Promise<{ message: string; application: Application }> {
  return apiRequest(`/applications/${applicationId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// Get current user's applications
export async function getMyApplications(): Promise<ApplicationsResponse> {
  return apiRequest('/applications/user/my-applications');
}
