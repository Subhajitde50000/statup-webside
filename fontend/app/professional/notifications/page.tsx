'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Bell, 
  Calendar, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Clock,
  MessageSquare,
  User,
  Trash2,
  Check,
  ArrowLeft,
  Loader2,
  Filter,
  Star
} from 'lucide-react';
import Link from 'next/link';
import { getNotifications, markAsRead, deleteNotification, getUnreadCount, markAllAsRead } from '@/utils/notifications';

interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'booking' | 'payment' | 'review' | 'offer' | 'message' | 'system';
  category: string;
  is_read: boolean;
  related_id?: string;
  action_url?: string;
  created_at: string;
}

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchNotifications();
  }, [filterType]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        router.push('/auth');
        return;
      }

      const data = await getNotifications(
        1,
        50,
        filterType !== 'all' ? filterType : undefined
      );
      setNotifications(data.notifications);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching notifications:', err);
      setError(err.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      setProcessingId(id);
      await markAsRead(id);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id ? { ...notif, is_read: true } : notif
        )
      );
    } catch (err: any) {
      console.error('Error marking notification as read:', err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this notification?')) return;

    try {
      setProcessingId(id);
      await deleteNotification(id);
      setNotifications(prev => prev.filter(notif => notif.id !== id));
    } catch (err: any) {
      console.error('Error deleting notification:', err);
      alert('Failed to delete notification');
    } finally {
      setProcessingId(null);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setNotifications(prev => prev.map(notif => ({ ...notif, is_read: true })));
    } catch (err: any) {
      console.error('Error marking all as read:', err);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <Calendar className="w-5 h-5 text-blue-600" />;
      case 'payment':
        return <DollarSign className="w-5 h-5 text-green-600" />;
      case 'review':
        return <Star className="w-5 h-5 text-yellow-600" />;
      case 'offer':
        return <DollarSign className="w-5 h-5 text-purple-600" />;
      case 'message':
        return <MessageSquare className="w-5 h-5 text-teal-600" />;
      case 'system':
        return <Bell className="w-5 h-5 text-gray-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'booking':
        return 'bg-blue-50 border-blue-200';
      case 'payment':
        return 'bg-green-50 border-green-200';
      case 'review':
        return 'bg-yellow-50 border-yellow-200';
      case 'offer':
        return 'bg-purple-50 border-purple-200';
      case 'message':
        return 'bg-teal-50 border-teal-200';
      case 'system':
        return 'bg-gray-50 border-gray-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-green-600 text-white sticky top-0 z-10 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Bell className="w-7 h-7" />
                Notifications
              </h1>
              <p className="text-teal-100 text-sm mt-1">
                {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Mark all read
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {['all', 'booking', 'payment', 'offer', 'message', 'review', 'system'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                  filterType === type
                    ? 'bg-white text-teal-600'
                    : 'bg-white/20 hover:bg-white/30'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-teal-600 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Loading notifications...</p>
            </div>
          </div>
        ) : notifications.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No notifications yet</h3>
            <p className="text-gray-600">
              {filterType === 'all' 
                ? "You're all caught up! New notifications will appear here."
                : `No ${filterType} notifications found.`}
            </p>
          </div>
        ) : (
          /* Notifications List */
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-xl shadow-md border-2 transition-all hover:shadow-lg ${
                  notification.is_read ? 'opacity-70' : ''
                } ${getNotificationColor(notification.type || notification.category)}`}
              >
                <div className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`p-3 rounded-xl ${getNotificationColor(notification.type)}`}>
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-bold text-gray-900">
                          {notification.title}
                        </h3>
                        {!notification.is_read && (
                          <div className="w-2 h-2 bg-teal-600 rounded-full flex-shrink-0 mt-1.5"></div>
                        )}
                      </div>
                      <p className="text-gray-700 text-sm mb-2">{notification.message}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{getTimeAgo(notification.created_at)}</span>
                        <span>•</span>
                        <span className="capitalize">{notification.type}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {!notification.is_read && (
                        <button
                          onClick={() => handleMarkAsRead(notification._id)}
                          disabled={processingId === notification._id}
                          className="p-2 hover:bg-teal-100 rounded-lg transition-colors disabled:opacity-50"
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4 text-teal-600" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notification._id)}
                        disabled={processingId === notification._id}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        {processingId === notification._id ? (
                          <Loader2 className="w-4 h-4 text-red-600 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4 text-red-600" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Action Link if related_id exists */}
                  {notification.related_id && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <Link
                        href={
                          notification.type === 'booking' ? `/professional/bookings/${notification.related_id}` :
                          notification.type === 'offer' ? `/professional/offers` :
                          notification.type === 'message' ? `/professional/messages` :
                          '#'
                        }
                        className="text-sm font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
                      >
                        View Details
                        <ArrowLeft className="w-4 h-4 rotate-180" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Spacing */}
        <div className="h-20"></div>
      </div>
    </div>
  );
}
