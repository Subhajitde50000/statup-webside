// API functions for professional schedule/availability management

const API_BASE_URL = 'http://localhost:8000/api';

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface DayAvailability {
  date: string; // YYYY-MM-DD format
  slots: TimeSlot[];
  isFullyAvailable: boolean;
}

export interface AvailabilityResponse {
  availability: DayAvailability[];
  message?: string;
}

// Get authentication token from localStorage
function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
}

// Fetch professional's availability for a date range
export async function getAvailability(
  startDate: string,
  endDate: string
): Promise<DayAvailability[]> {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(
      `${API_BASE_URL}/professionals/availability?start_date=${startDate}&end_date=${endDate}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch availability: ${response.statusText}`);
    }

    const data: AvailabilityResponse = await response.json();
    return data.availability || [];
  } catch (error) {
    console.error('Error fetching availability:', error);
    return [];
  }
}

// Update availability for a specific date
export async function updateDayAvailability(
  dayAvailability: DayAvailability
): Promise<boolean> {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(
      `${API_BASE_URL}/professionals/availability`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dayAvailability),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update availability: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('Error updating availability:', error);
    return false;
  }
}

// Update availability for multiple dates (bulk update)
export async function updateMultipleDaysAvailability(
  availabilityData: DayAvailability[]
): Promise<boolean> {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(
      `${API_BASE_URL}/professionals/availability/bulk`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ availability: availabilityData }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update availability: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('Error updating availability:', error);
    return false;
  }
}

// Toggle a specific time slot for a date
export async function toggleTimeSlot(
  date: string,
  time: string,
  available: boolean
): Promise<boolean> {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(
      `${API_BASE_URL}/professionals/availability/slot`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date, time, available }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to toggle time slot: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('Error toggling time slot:', error);
    return false;
  }
}

// Mark an entire day as available or unavailable
export async function setDayStatus(
  date: string,
  available: boolean
): Promise<boolean> {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(
      `${API_BASE_URL}/professionals/availability/day`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date, available }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to set day status: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('Error setting day status:', error);
    return false;
  }
}

// Get upcoming bookings for schedule view
export async function getUpcomingBookings(): Promise<any[]> {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(
      `${API_BASE_URL}/professionals/bookings?status=confirmed&status=pending`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch bookings: ${response.statusText}`);
    }

    const data = await response.json();
    return data.bookings || [];
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
}
