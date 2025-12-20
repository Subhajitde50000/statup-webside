/**
 * Vacancy API service
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '/api') || 'http://localhost:8000/api';

// Types
export interface Vacancy {
  id: string;
  job_title: string;
  role_level: string;
  department: string;
  hiring_for: string;
  employment_type: string;
  positions: number;
  salary_min: number;
  salary_max: number;
  location: string;
  description: string;
  responsibilities: string[];
  skills: string[];
  experience: string;
  auto_close: boolean;
  ai_screening: boolean;
  priority: string;
  posting_type: string;
  status: string;
  created_by: string;
  created_by_name: string;
  created_at: string;
  updated_at: string;
  applicant_count: number;
}

export interface VacancyCreateData {
  job_title: string;
  role_level: string;
  department: string;
  hiring_for: string;
  employment_type: string;
  positions: number;
  salary_min: number;
  salary_max: number;
  location: string;
  description: string;
  responsibilities: string[];
  skills: string[];
  experience: string;
  auto_close?: boolean;
  ai_screening?: boolean;
  priority?: string;
  posting_type?: string;
}

export interface VacanciesResponse {
  total: number;
  vacancies: Vacancy[];
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

// ============ VACANCY API FUNCTIONS ============

// Create vacancy
export async function createVacancy(data: VacancyCreateData): Promise<{ message: string; vacancy: Vacancy }> {
  return apiRequest('/vacancies/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Get all vacancies (public)
export async function getVacancies(params?: {
  status?: string;
  department?: string;
  employment_type?: string;
  search?: string;
  skip?: number;
  limit?: number;
}): Promise<VacanciesResponse> {
  const queryParams = new URLSearchParams();
  
  if (params?.status) queryParams.append('status', params.status);
  if (params?.department) queryParams.append('department', params.department);
  if (params?.employment_type) queryParams.append('employment_type', params.employment_type);
  if (params?.search) queryParams.append('search', params.search);
  if (params?.skip !== undefined) queryParams.append('skip', params.skip.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  
  const queryString = queryParams.toString();
  return apiRequest(`/vacancies/${queryString ? '?' + queryString : ''}`);
}

// Get vacancy by ID
export async function getVacancyById(id: string): Promise<{ vacancy: Vacancy }> {
  return apiRequest(`/vacancies/${id}`);
}

// Update vacancy
export async function updateVacancy(id: string, data: Partial<VacancyCreateData>): Promise<{ message: string; vacancy: Vacancy }> {
  return apiRequest(`/vacancies/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// Delete vacancy
export async function deleteVacancy(id: string): Promise<{ message: string }> {
  return apiRequest(`/vacancies/${id}`, {
    method: 'DELETE',
  });
}

// Get admin vacancies (includes drafts, closed, etc.)
export async function getAdminVacancies(params?: {
  status?: string;
  skip?: number;
  limit?: number;
}): Promise<VacanciesResponse> {
  const queryParams = new URLSearchParams();
  
  if (params?.status) queryParams.append('status', params.status);
  if (params?.skip !== undefined) queryParams.append('skip', params.skip.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  
  const queryString = queryParams.toString();
  return apiRequest(`/vacancies/admin/list${queryString ? '?' + queryString : ''}`);
}
