// Offer Types
export interface PriceOffer {
  _id: string;
  user_id: string;
  professional_id: string;
  service_type: string;
  description: string;
  offered_price: number;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  created_at: string;
  updated_at: string;
  expires_at: string;
  response_message?: string;
  booking_id?: string;
  user_details?: {
    full_name: string;
    email: string;
    phone?: string;
  };
  professional_details?: {
    full_name: string;
    email: string;
    phone?: string;
  };
}

export interface CreateOfferData {
  professional_id: string;
  service_type: string;
  description: string;
  offered_price: number;
}

const API_BASE = 'http://localhost:8000/api/offers';

// Helper to get auth token
const getAuthToken = () => {
  return localStorage.getItem('access_token');
};

// Create a new price offer
export const createOffer = async (offerData: CreateOfferData): Promise<PriceOffer> => {
  const token = getAuthToken();
  if (!token) throw new Error('Not authenticated');

  const response = await fetch(`${API_BASE}/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(offerData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to create offer');
  }

  return response.json();
};

// Get offers created by current user
export const getMyOffers = async (status?: string): Promise<PriceOffer[]> => {
  const token = getAuthToken();
  if (!token) throw new Error('Not authenticated');

  const url = status 
    ? `${API_BASE}/my-offers?status=${status}`
    : `${API_BASE}/my-offers`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch offers');
  }

  const data = await response.json();
  return data.offers || [];
};

// Get offers received by professional (professional only)
export const getReceivedOffers = async (status?: string): Promise<PriceOffer[]> => {
  const token = getAuthToken();
  if (!token) throw new Error('Not authenticated');

  const url = status 
    ? `${API_BASE}/received-offers?status=${status}`
    : `${API_BASE}/received-offers`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch received offers');
  }

  const data = await response.json();
  return data.offers || [];
};

// Accept an offer (professional only)
export const acceptOffer = async (offerId: string): Promise<{ message: string; offer: PriceOffer; booking: any }> => {
  const token = getAuthToken();
  if (!token) throw new Error('Not authenticated');

  const response = await fetch(`${API_BASE}/accept/${offerId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to accept offer');
  }

  return response.json();
};

// Reject an offer (professional only)
export const rejectOffer = async (offerId: string, message?: string): Promise<{ message: string; offer: PriceOffer }> => {
  const token = getAuthToken();
  if (!token) throw new Error('Not authenticated');

  const response = await fetch(`${API_BASE}/reject/${offerId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ message: message || '' }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to reject offer');
  }

  return response.json();
};

// Cancel an offer (user only, pending offers)
export const cancelOffer = async (offerId: string): Promise<{ message: string }> => {
  const token = getAuthToken();
  if (!token) throw new Error('Not authenticated');

  const response = await fetch(`${API_BASE}/${offerId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to cancel offer');
  }

  return response.json();
};
