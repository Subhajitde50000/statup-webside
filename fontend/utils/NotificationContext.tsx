'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  Notification as AppNotification,
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
} from '@/utils/notifications';
import { getAccessToken, getStoredUser } from '@/utils/auth';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:8000';

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  isLoading: boolean;
  isConnected: boolean;
  error: string | null;
  
  // Actions
  fetchNotifications: (page?: number) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  removeNotification: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
  refreshUnreadCount: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [totalNotifications, setTotalNotifications] = useState(0);

  // Initialize Socket.IO connection
  useEffect(() => {
    const token = getAccessToken();
    const user = getStoredUser();
    
    if (!token || !user) {
      setIsLoading(false);
      return;
    }

    // Create socket connection - use polling first, then upgrade to websocket
    const newSocket = io(SOCKET_URL, {
      transports: ['polling', 'websocket'],  // Start with polling, then upgrade
      upgrade: true,
      auth: {
        user_id: user.id,
        token: token
      },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
      forceNew: true,
    });

    newSocket.on('connect', () => {
      console.log('Socket.IO connected');
      setIsConnected(true);
      setError(null);
      
      // Authenticate after connection
      newSocket.emit('authenticate', { user_id: user.id });
    });

    newSocket.on('disconnect', () => {
      console.log('Socket.IO disconnected');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (err) => {
      console.error('Socket.IO connection error:', err);
      setError('Failed to connect to notification server');
    });

    newSocket.on('authenticated', (data) => {
      console.log('Socket.IO authenticated:', data);
    });

    // Handle new notification
    newSocket.on('new_notification', (notification: AppNotification) => {
      console.log('New notification received:', notification);
      
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
      setTotalNotifications(prev => prev + 1);
      
      // Play notification sound (optional)
      playNotificationSound();
      
      // Show browser notification if permitted
      showBrowserNotification(notification);
    });

    // Handle notification read sync (for multi-tab support)
    newSocket.on('notification_read', (data: { notification_id: string }) => {
      setNotifications(prev =>
        prev.map(n =>
          n.id === data.notification_id ? { ...n, is_read: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.close();
    };
  }, []);

  // Fetch initial notifications
  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      fetchNotifications();
      refreshUnreadCount();
    } else {
      setIsLoading(false);
    }
  }, []);

  // Request browser notification permission
  useEffect(() => {
    if ('Notification' in window && window.Notification.permission === 'default') {
      window.Notification.requestPermission();
    }
  }, []);

  const fetchNotifications = useCallback(async (page: number = 1) => {
    try {
      setIsLoading(true);
      const response = await getNotifications(page, 20);
      
      if (page === 1) {
        setNotifications(response.notifications);
      } else {
        setNotifications(prev => [...prev, ...response.notifications]);
      }
      
      setUnreadCount(response.unread_count);
      setTotalNotifications(response.total);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching notifications:', err);
      setError(err.message || 'Failed to fetch notifications');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshUnreadCount = useCallback(async () => {
    try {
      const response = await getUnreadCount();
      setUnreadCount(response.unread_count);
    } catch (err) {
      console.error('Error fetching unread count:', err);
    }
  }, []);

  const markNotificationRead = useCallback(async (id: string) => {
    try {
      await markAsRead(id);
      
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      // Emit to socket for multi-tab sync
      if (socket) {
        socket.emit('mark_read', { notification_id: id });
      }
    } catch (err: any) {
      console.error('Error marking notification read:', err);
      throw err;
    }
  }, [socket]);

  const markAllNotificationsRead = useCallback(async () => {
    try {
      await markAllAsRead();
      
      setNotifications(prev =>
        prev.map(n => ({ ...n, is_read: true }))
      );
      setUnreadCount(0);
    } catch (err: any) {
      console.error('Error marking all as read:', err);
      throw err;
    }
  }, []);

  const removeNotification = useCallback(async (id: string) => {
    try {
      await deleteNotification(id);
      
      const notification = notifications.find(n => n.id === id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      setTotalNotifications(prev => prev - 1);
      
      if (notification && !notification.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err: any) {
      console.error('Error deleting notification:', err);
      throw err;
    }
  }, [notifications]);

  const clearAll = useCallback(async () => {
    try {
      await clearAllNotifications();
      setNotifications([]);
      setUnreadCount(0);
      setTotalNotifications(0);
    } catch (err: any) {
      console.error('Error clearing notifications:', err);
      throw err;
    }
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isLoading,
        isConnected,
        error,
        fetchNotifications,
        markNotificationRead,
        markAllNotificationsRead,
        removeNotification,
        clearAll,
        refreshUnreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

// Helper functions

function playNotificationSound() {
  try {
    // Create a simple notification sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  } catch (error) {
    // Audio might be blocked by browser
    console.log('Could not play notification sound');
  }
}

function showBrowserNotification(notification: AppNotification) {
  if ('Notification' in window && window.Notification.permission === 'granted') {
    const browserNotif = new window.Notification(notification.title, {
      body: notification.message,
      icon: '/favicon.ico',
      tag: notification.id,
      requireInteraction: notification.priority === 'urgent',
    });

    browserNotif.onclick = () => {
      window.focus();
      if (notification.action_url) {
        window.location.href = notification.action_url;
      }
      browserNotif.close();
    };

    // Auto-close after 5 seconds for non-urgent notifications
    if (notification.priority !== 'urgent') {
      setTimeout(() => browserNotif.close(), 5000);
    }
  }
}
