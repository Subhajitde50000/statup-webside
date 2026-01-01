/**
 * Notification API utilities
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '/api') || 'http://localhost:8000/api';

// Get auth token from localStorage
const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
};

// Types
export interface Notification {
  id: string;
  user_id: string;
  type: string;
  category: string;
  priority: string;
  title: string;
  message: string;
  data?: Record<string, any>;
  action_url?: string;
  action_text?: string;
  image_url?: string;
  icon?: string;
  icon_color?: string;
  bg_color?: string;
  is_read: boolean;
  created_at: string;
  read_at?: string;
}

export interface NotificationListResponse {
  notifications: Notification[];
  total: number;
  unread_count: number;
  page: number;
  limit: number;
}

export interface NotificationSettings {
  push_enabled: boolean;
  email_enabled: boolean;
  email_booking_updates: boolean;
  email_offers: boolean;
  email_system_updates: boolean;
  booking_notifications: boolean;
  payment_notifications: boolean;
  offer_notifications: boolean;
  promotional_notifications: boolean;
  system_notifications: boolean;
  quiet_hours_enabled: boolean;
  quiet_hours_start?: string;
  quiet_hours_end?: string;
}

/**
 * Get user notifications with pagination
 */
export async function getNotifications(
  page: number = 1,
  limit: number = 20,
  category?: string,
  isRead?: boolean
): Promise<NotificationListResponse> {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Not authenticated');
  }

  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (category) {
    params.append('category', category);
  }

  if (isRead !== undefined) {
    params.append('is_read', isRead.toString());
  }

  const response = await fetch(`${API_BASE_URL}/notifications?${params}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to fetch notifications');
  }

  return response.json();
}

/**
 * Get unread notification count
 */
export async function getUnreadCount(): Promise<{ unread_count: number }> {
  const token = getAuthToken();
  if (!token) {
    return { unread_count: 0 };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/notifications/unread-count`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return { unread_count: 0 };
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching unread count:', error);
    return { unread_count: 0 };
  }
}

/**
 * Mark a notification as read
 */
export async function markAsRead(notificationId: string): Promise<void> {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to mark notification as read');
  }
}

/**
 * Mark all notifications as read
 */
export async function markAllAsRead(): Promise<{ count: number }> {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(`${API_BASE_URL}/notifications/read-all`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to mark all as read');
  }

  return response.json();
}

/**
 * Delete a notification
 */
export async function deleteNotification(notificationId: string): Promise<void> {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to delete notification');
  }
}

/**
 * Clear all notifications
 */
export async function clearAllNotifications(): Promise<{ count: number }> {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(`${API_BASE_URL}/notifications/clear-all`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to clear notifications');
  }

  return response.json();
}

/**
 * Get notification settings
 */
export async function getNotificationSettings(): Promise<NotificationSettings> {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(`${API_BASE_URL}/notifications/settings/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to fetch settings');
  }

  return response.json();
}

/**
 * Update notification settings
 */
export async function updateNotificationSettings(settings: Partial<NotificationSettings>): Promise<void> {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(`${API_BASE_URL}/notifications/settings/me`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(settings),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to update settings');
  }
}

/**
 * Get relative time string (e.g., "5 min ago", "2 hours ago")
 */
export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} min ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  }

  return date.toLocaleDateString();
}

/**
 * Get icon component name from notification type
 */
export function getIconForType(type: string): string {
  const iconMap: Record<string, string> = {
    // Booking
    booking_confirmed: 'CheckCircle',
    booking_cancelled: 'XCircle',
    booking_rescheduled: 'Calendar',
    booking_completed: 'CheckCircle',
    booking_started: 'Play',
    professional_assigned: 'User',
    professional_on_way: 'Truck',
    professional_arrived: 'MapPin',
    otp_generated: 'Key',
    
    // Payment
    payment_received: 'DollarSign',
    payment_failed: 'AlertCircle',
    refund_initiated: 'RefreshCw',
    refund_completed: 'CheckCircle',
    
    // Offer
    new_offer: 'Tag',
    offer_expiring: 'Clock',
    flash_sale: 'Zap',
    
    // Rating
    rate_service: 'Star',
    review_response: 'MessageCircle',
    
    // Account
    account_verified: 'Shield',
    profile_updated: 'User',
    password_changed: 'Lock',
    
    // System
    system_update: 'Settings',
    new_feature: 'Sparkles',
    maintenance: 'Tool',
    
    // Promotional
    welcome: 'Heart',
    birthday_offer: 'Gift',
    loyalty_reward: 'Award',
    referral_bonus: 'Users',
    
    // Default
    info: 'Info',
    alert: 'AlertCircle',
    success: 'CheckCircle',
    warning: 'AlertTriangle',
  };

  return iconMap[type] || 'Bell';
}

/**
 * Get colors for notification type
 */
export function getColorsForType(type: string): { bg: string; icon: string } {
  const successTypes = [
    'booking_confirmed',
    'booking_completed',
    'payment_received',
    'refund_completed',
    'account_verified',
  ];
  
  const warningTypes = [
    'booking_cancelled',
    'payment_failed',
    'offer_expiring',
  ];
  
  const infoTypes = [
    'professional_on_way',
    'professional_arrived',
    'booking_started',
    'new_feature',
    'professional_assigned',
  ];
  
  const promoTypes = [
    'new_offer',
    'flash_sale',
    'birthday_offer',
    'loyalty_reward',
    'welcome',
  ];

  if (successTypes.includes(type)) {
    return { bg: 'bg-green-50', icon: 'text-green-600' };
  } else if (warningTypes.includes(type)) {
    return { bg: 'bg-red-50', icon: 'text-red-600' };
  } else if (infoTypes.includes(type)) {
    return { bg: 'bg-blue-50', icon: 'text-blue-600' };
  } else if (promoTypes.includes(type)) {
    return { bg: 'bg-orange-50', icon: 'text-orange-600' };
  }
  
  return { bg: 'bg-purple-50', icon: 'text-purple-600' };
}
