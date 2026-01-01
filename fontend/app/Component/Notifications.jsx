'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Bell, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  Star, 
  Clock, 
  TrendingUp,
  Calendar,
  MapPin,
  DollarSign,
  RefreshCw,
  User,
  Truck,
  Key,
  Tag,
  Zap,
  MessageCircle,
  Shield,
  Lock,
  Settings,
  Heart,
  Gift,
  Award,
  Users,
  AlertTriangle,
  XCircle,
  Play,
  Sparkles,
  Loader2,
  WifiOff
} from 'lucide-react';
import { useNotifications } from '@/utils/NotificationContext';
import { getRelativeTime } from '@/utils/notifications';

// Icon mapping
const iconComponents = {
  CheckCircle,
  AlertCircle,
  Info,
  Star,
  Clock,
  TrendingUp,
  Calendar,
  MapPin,
  DollarSign,
  RefreshCw,
  User,
  Truck,
  Key,
  Tag,
  Zap,
  MessageCircle,
  Shield,
  Lock,
  Settings,
  Heart,
  Gift,
  Award,
  Users,
  AlertTriangle,
  XCircle,
  Play,
  Sparkles,
  Bell
};

// Get icon component by name
const getIconComponent = (iconName) => {
  return iconComponents[iconName] || Bell;
};

// Get colors based on notification type
const getNotificationColors = (type, category) => {
  const successTypes = [
    'booking_confirmed',
    'booking_completed',
    'payment_received',
    'refund_completed',
    'account_verified',
    'success'
  ];
  
  const warningTypes = [
    'booking_cancelled',
    'payment_failed',
    'offer_expiring',
    'alert',
    'warning'
  ];
  
  const infoTypes = [
    'professional_on_way',
    'professional_arrived',
    'booking_started',
    'new_feature',
    'professional_assigned',
    'rate_service',
    'info'
  ];
  
  const promoTypes = [
    'new_offer',
    'flash_sale',
    'birthday_offer',
    'loyalty_reward',
    'welcome',
    'referral_bonus'
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
};

export default function Notifications({ isOpen, onClose }) {
  const router = useRouter();
  const {
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
  } = useNotifications();

  // Refresh notifications when panel opens
  useEffect(() => {
    if (isOpen) {
      fetchNotifications(1);
    }
  }, [isOpen, fetchNotifications]);

  // Handle notification click
  const handleNotificationClick = async (notification) => {
    // Mark as read if not already
    if (!notification.is_read) {
      try {
        await markNotificationRead(notification.id);
      } catch (err) {
        console.error('Error marking notification as read:', err);
      }
    }

    // Navigate to action URL if present
    if (notification.action_url) {
      onClose();
      router.push(notification.action_url);
    }
  };

  // Handle mark all read
  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  // Handle clear all
  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to clear all notifications?')) {
      try {
        await clearAll();
      } catch (err) {
        console.error('Error clearing notifications:', err);
      }
    }
  };

  // Handle delete single notification
  const handleDeleteNotification = async (e, notification) => {
    e.stopPropagation();
    try {
      await removeNotification(notification.id);
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
        onClick={onClose}
      ></div>

      {/* Notification Panel */}
      <div className="fixed top-[70px] right-0 w-full sm:w-[400px] h-[calc(100vh-70px)] bg-white shadow-2xl z-50 flex flex-col animate-slide-in">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-black text-gray-900">Notifications</h2>
            </div>
            <div className="flex items-center gap-2">
              {/* Connection status indicator */}
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} 
                   title={isConnected ? 'Connected' : 'Disconnected'} />
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/50 rounded-lg transition-all"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
          {unreadCount > 0 && (
            <p className="text-sm font-semibold text-blue-600">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          )}
          {!isConnected && (
            <div className="mt-2 flex items-center gap-2 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
              <WifiOff className="w-3 h-3" />
              <span>Reconnecting to live updates...</span>
            </div>
          )}
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {/* Loading State */}
          {isLoading && notifications.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
              <p className="text-sm text-gray-600">Loading notifications...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="p-4 m-4 bg-red-50 border border-red-200 rounded-lg text-center">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className="text-sm text-red-600">{error}</p>
              <button 
                onClick={() => fetchNotifications(1)}
                className="mt-2 text-sm text-blue-600 hover:underline"
              >
                Try again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && notifications.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Bell className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No Notifications</h3>
              <p className="text-sm text-gray-600">You're all caught up!</p>
            </div>
          )}

          {/* Notifications */}
          {!error && notifications.length > 0 && (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => {
                const IconComponent = getIconComponent(notification.icon || 'Bell');
                const colors = notification.icon_color && notification.bg_color 
                  ? { bg: notification.bg_color, icon: notification.icon_color }
                  : getNotificationColors(notification.type, notification.category);
                
                return (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-all cursor-pointer group relative ${
                      !notification.is_read ? 'bg-blue-50/30' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex gap-3">
                      {/* Icon */}
                      <div className={`${colors.bg} p-2 rounded-lg h-fit group-hover:scale-110 transition-transform flex-shrink-0`}>
                        <IconComponent className={`w-5 h-5 ${colors.icon}`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-bold text-gray-900 text-sm group-hover:text-blue-600 transition-colors line-clamp-1">
                            {notification.title}
                          </h4>
                          {!notification.is_read && (
                            <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 font-medium">
                            {getRelativeTime(notification.created_at)}
                          </span>
                          {notification.action_text && (
                            <span className="text-xs text-blue-600 font-medium">
                              {notification.action_text} →
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Delete button - shows on hover */}
                      <button
                        onClick={(e) => handleDeleteNotification(e, notification)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-all flex-shrink-0 absolute top-2 right-2"
                        title="Delete notification"
                      >
                        <X className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {notifications.length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex gap-2">
              <button 
                onClick={handleMarkAllRead}
                disabled={unreadCount === 0}
                className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                  unreadCount > 0 
                    ? 'text-blue-600 hover:bg-blue-50' 
                    : 'text-gray-400 cursor-not-allowed'
                }`}
              >
                Mark All Read
              </button>
              <button 
                onClick={handleClearAll}
                className="flex-1 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-200 rounded-lg transition-all"
              >
                Clear All
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
