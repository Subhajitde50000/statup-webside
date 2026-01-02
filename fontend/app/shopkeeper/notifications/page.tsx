'use client';

import React, { useState } from 'react';
import ShopkeeperNavbar from '../components/ShopkeeperNavbar';
import { Bell, Package, MessageCircle, TrendingUp, AlertCircle, CheckCircle, XCircle, Clock, Trash2, Check } from 'lucide-react';

// Mock notification data
const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: 'order',
    title: 'New Order Received',
    message: 'Order #12345 for ₹2,500 has been placed by Rajesh Kumar',
    timestamp: '2 min ago',
    time: '10:45 AM',
    read: false,
    icon: Package,
    color: 'bg-blue-500'
  },
  {
    id: 2,
    type: 'message',
    title: 'New Message',
    message: 'Amit Electricals: "Thanks for the quick delivery!"',
    timestamp: '15 min ago',
    time: '10:32 AM',
    read: false,
    icon: MessageCircle,
    color: 'bg-green-500'
  },
  {
    id: 3,
    type: 'order',
    title: 'Order Delivered',
    message: 'Order #12340 has been successfully delivered',
    timestamp: '1 hour ago',
    time: '09:45 AM',
    read: true,
    icon: CheckCircle,
    color: 'bg-green-600'
  },
  {
    id: 4,
    type: 'inventory',
    title: 'Low Stock Alert',
    message: 'Copper Wire 10mm is running low. Only 5 units left',
    timestamp: '2 hours ago',
    time: '08:30 AM',
    read: false,
    icon: AlertCircle,
    color: 'bg-orange-500'
  },
  {
    id: 5,
    type: 'order',
    title: 'Order Cancelled',
    message: 'Order #12338 has been cancelled by customer',
    timestamp: '3 hours ago',
    time: '07:15 AM',
    read: true,
    icon: XCircle,
    color: 'bg-red-500'
  },
  {
    id: 6,
    type: 'system',
    title: 'Payment Received',
    message: '₹15,000 has been credited to your account',
    timestamp: 'Yesterday',
    time: '06:30 PM',
    read: true,
    icon: TrendingUp,
    color: 'bg-emerald-500'
  },
  {
    id: 7,
    type: 'message',
    title: 'New Message',
    message: 'Priya Sharma: "Can I get bulk discount on switches?"',
    timestamp: 'Yesterday',
    time: '04:20 PM',
    read: true,
    icon: MessageCircle,
    color: 'bg-green-500'
  },
  {
    id: 8,
    type: 'order',
    title: 'Order Confirmed',
    message: 'Order #12335 has been confirmed and ready for dispatch',
    timestamp: 'Yesterday',
    time: '02:15 PM',
    read: true,
    icon: Clock,
    color: 'bg-blue-600'
  },
  {
    id: 9,
    type: 'inventory',
    title: 'Stock Replenished',
    message: 'MCB 32A stock has been updated. 50 new units added',
    timestamp: '2 days ago',
    time: '11:00 AM',
    read: true,
    icon: CheckCircle,
    color: 'bg-green-600'
  },
  {
    id: 10,
    type: 'system',
    title: 'Subscription Renewal',
    message: 'Your premium subscription will expire in 7 days',
    timestamp: '2 days ago',
    time: '09:00 AM',
    read: true,
    icon: AlertCircle,
    color: 'bg-purple-500'
  }
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

  const handleMarkAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleDelete = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all notifications?')) {
      setNotifications([]);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <ShopkeeperNavbar />

      <main className="max-w-[1400px] mx-auto px-4 lg:px-6 py-6 lg:py-8 pb-24 lg:pb-8">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-[#0C0C0C] flex items-center gap-3">
              <Bell className="w-8 h-8 text-[#00C897]" />
              Notifications
            </h1>
            <p className="text-[#555555] mt-1">
              {unreadCount > 0 ? (
                <span>You have <span className="font-semibold text-[#E53935]">{unreadCount} unread</span> notifications</span>
              ) : (
                <span>All caught up! No new notifications</span>
              )}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-2 px-4 py-2 bg-[#00C897] text-white rounded-lg hover:bg-[#00B184] transition font-medium"
              >
                <Check className="w-4 h-4" />
                Mark All Read
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={handleClearAll}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1 mb-6 inline-flex">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              filter === 'all'
                ? 'bg-[#00C897] text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              filter === 'unread'
                ? 'bg-[#00C897] text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {filteredNotifications.length === 0 ? (
            <div className="py-16 text-center">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Notifications</h3>
              <p className="text-gray-500">
                {filter === 'unread' 
                  ? "You're all caught up! No unread notifications."
                  : "You don't have any notifications yet."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredNotifications.map((notification) => {
                const IconComponent = notification.icon;
                
                return (
                  <div
                    key={notification.id}
                    className={`p-4 sm:p-5 hover:bg-gray-50 transition ${
                      !notification.read ? 'bg-blue-50/50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`flex-shrink-0 w-12 h-12 ${notification.color} rounded-full flex items-center justify-center`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-1">
                          <h3 className={`font-semibold ${
                            !notification.read ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {notification.title}
                            {!notification.read && (
                              <span className="ml-2 inline-block w-2 h-2 bg-[#E53935] rounded-full"></span>
                            )}
                          </h3>
                          <span className="text-xs text-gray-500 flex-shrink-0">
                            {notification.timestamp}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{notification.time}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {!notification.read && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="p-2 text-gray-400 hover:text-[#00C897] hover:bg-[#00C897]/10 rounded-lg transition"
                            title="Mark as read"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                          title="Delete notification"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Notification Settings Link */}
        <div className="mt-6 text-center">
          <button className="text-[#00C897] hover:text-[#00B184] font-medium transition">
            Notification Settings
          </button>
        </div>
      </main>
    </div>
  );
}
