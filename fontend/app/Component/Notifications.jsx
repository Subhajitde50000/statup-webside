'use client';

import React from 'react';
import { Bell, X, CheckCircle, AlertCircle, Info, Star, Clock, TrendingUp } from 'lucide-react';

export default function Notifications({ isOpen, onClose }) {
  const notifications = [
    {
      id: 1,
      type: 'success',
      icon: CheckCircle,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50',
      title: 'Booking Confirmed',
      message: 'Your electrician will arrive at 3:00 PM today',
      time: '5 min ago',
      unread: true
    },
    {
      id: 2,
      type: 'info',
      icon: Star,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      title: 'Rate Your Service',
      message: 'How was your experience with Suman Das?',
      time: '1 hour ago',
      unread: true
    },
    {
      id: 3,
      type: 'alert',
      icon: AlertCircle,
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      title: 'Special Offer!',
      message: 'Get 20% off on your next plumbing service',
      time: '2 hours ago',
      unread: true
    },
    {
      id: 4,
      type: 'info',
      icon: Clock,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      title: 'Professional On The Way',
      message: 'Rajesh Kumar is 10 minutes away',
      time: '3 hours ago',
      unread: false
    },
    {
      id: 5,
      type: 'success',
      icon: TrendingUp,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50',
      title: 'Service Completed',
      message: 'Your home cleaning service is complete',
      time: '1 day ago',
      unread: false
    },
    {
      id: 6,
      type: 'info',
      icon: Info,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      title: 'New Feature Available',
      message: 'Now book services for later dates!',
      time: '2 days ago',
      unread: false
    }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

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
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/50 rounded-lg transition-all"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          {unreadCount > 0 && (
            <p className="text-sm font-semibold text-blue-600">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Bell className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No Notifications</h3>
              <p className="text-sm text-gray-600">You're all caught up!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => {
                const Icon = notification.icon;
                return (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-all cursor-pointer group ${
                      notification.unread ? 'bg-blue-50/30' : ''
                    }`}
                  >
                    <div className="flex gap-3">
                      {/* Icon */}
                      <div className={`${notification.bgColor} p-2 rounded-lg h-fit group-hover:scale-110 transition-transform flex-shrink-0`}>
                        <Icon className={`w-5 h-5 ${notification.iconColor}`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-bold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
                            {notification.title}
                          </h4>
                          {notification.unread && (
                            <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {notification.message}
                        </p>
                        <span className="text-xs text-gray-500 font-medium">
                          {notification.time}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-2">
            <button className="flex-1 py-2.5 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
              Mark All Read
            </button>
            <button className="flex-1 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-200 rounded-lg transition-all">
              Clear All
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
