'use client';

import React, { useState } from 'react';
import { Bell, Search, Settings, Moon, Sun, ChevronDown, LogOut } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { logout } from '@/utils/auth';

export default function TopNavbar() {
  const [darkMode, setDarkMode] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      type: 'order',
      title: 'New Order Received',
      message: 'Order #ORD-2024-001 from Amit Sharma',
      time: '5 min ago',
      read: false,
      icon: '📦'
    },
    {
      id: 2,
      type: 'booking',
      title: 'Service Booking',
      message: 'Rajesh Kumar accepted booking #BOOK-2024-003',
      time: '15 min ago',
      read: false,
      icon: '🔧'
    },
    {
      id: 3,
      type: 'payment',
      title: 'Payment Received',
      message: 'Payment of ₹2,500 received for Order #ORD-2024-005',
      time: '1 hour ago',
      read: false,
      icon: '💰'
    },
    {
      id: 4,
      type: 'shop',
      title: 'Shop Approval Pending',
      message: 'New shop registration awaiting approval',
      time: '2 hours ago',
      read: true,
      icon: '🏪'
    },
    {
      id: 5,
      type: 'refund',
      title: 'Refund Request',
      message: 'Customer requested refund for Order #ORD-2024-004',
      time: '3 hours ago',
      read: true,
      icon: '↩️'
    },
    {
      id: 6,
      type: 'professional',
      title: 'Professional Verification',
      message: 'New professional verification request received',
      time: '4 hours ago',
      read: true,
      icon: '👤'
    },
    {
      id: 7,
      type: 'system',
      title: 'System Update',
      message: 'Platform maintenance scheduled for tonight',
      time: '5 hours ago',
      read: true,
      icon: '⚙️'
    }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      router.push('/auth');
    } catch (error) {
      console.error('Logout error:', error);
      // Still redirect even if API call fails
      router.push('/auth');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-[#E2E8F0]">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#3B82F6] rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <span className="text-[#1E293B] font-semibold text-lg hidden lg:block">Manager Portal</span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8 hidden md:block">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#94A3B8] w-5 h-5" />
              <input
                type="text"
                placeholder="Search shops, professionals, orders..."
                className="w-full pl-12 pr-4 py-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#1E293B] text-sm placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center gap-6">
            {/* Dark Mode Toggle */}
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="text-[#64748B] hover:text-[#3B82F6] transition-colors p-2 rounded-lg hover:bg-[#F1F5F9]"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative text-[#64748B] hover:text-[#3B82F6] transition-colors p-2 rounded-lg hover:bg-[#F1F5F9]"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#EF4444] rounded-full text-white text-xs flex items-center justify-center font-semibold">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-[#E2E8F0] z-50">
                  {/* Header */}
                  <div className="px-4 py-3 border-b border-[#E2E8F0] flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-[#1E293B] text-sm">Notifications</h3>
                      <p className="text-xs text-[#64748B]">{unreadCount} unread notifications</p>
                    </div>
                    <button className="text-xs text-[#3B82F6] font-medium hover:underline">
                      Mark all read
                    </button>
                  </div>

                  {/* Notifications List */}
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div 
                        key={notification.id}
                        className={`px-4 py-3 border-b border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors cursor-pointer ${
                          !notification.read ? 'bg-[#EFF6FF]' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="text-2xl">{notification.icon}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className={`text-sm font-semibold ${
                                !notification.read ? 'text-[#1E293B]' : 'text-[#64748B]'
                              }`}>
                                {notification.title}
                              </h4>
                              {!notification.read && (
                                <span className="w-2 h-2 bg-[#3B82F6] rounded-full flex-shrink-0 mt-1"></span>
                              )}
                            </div>
                            <p className="text-xs text-[#64748B] mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <span className="text-xs text-[#94A3B8] mt-1 block">
                              {notification.time}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="px-4 py-3 border-t border-[#E2E8F0] bg-[#F8FAFC]">
                    <a 
                      href="/dashboard/manager/notifications"
                      className="text-sm text-[#3B82F6] font-medium hover:underline w-full text-center block"
                    >
                      View all notifications
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Settings */}
            <button className="text-[#64748B] hover:text-[#3B82F6] transition-colors p-2 rounded-lg hover:bg-[#F1F5F9]">
              <Settings className="w-5 h-5" />
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 hover:bg-[#F1F5F9] px-3 py-2 rounded-lg transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-[#3B82F6] flex items-center justify-center text-white font-semibold text-sm">
                  AM
                </div>
                <div className="text-left hidden lg:block">
                  <p className="text-[#1E293B] font-semibold text-sm">Admin Manager</p>
                  <p className="text-[#64748B] text-xs">manager@platform.com</p>
                </div>
                <ChevronDown className="text-[#64748B] w-4 h-4 hidden lg:block" />
              </button>

              {/* Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 border border-[#E2E8F0] z-50">
                  <a href="#" className="block px-4 py-3 text-[#1E293B] hover:bg-[#F8FAFC] transition-colors">
                    <div className="font-semibold text-sm">Profile Settings</div>
                    <div className="text-xs text-[#64748B]">Manage your account</div>
                  </a>
                  <a href="#" className="block px-4 py-3 text-[#1E293B] hover:bg-[#F8FAFC] transition-colors">
                    <div className="font-semibold text-sm">Preferences</div>
                    <div className="text-xs text-[#64748B]">Customize dashboard</div>
                  </a>
                  <hr className="my-2 border-[#E2E8F0]" />
                  <button 
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full text-left px-4 py-3 text-[#EF4444] hover:bg-[#FEF2F2] transition-colors font-semibold text-sm flex items-center gap-2 disabled:opacity-50"
                  >
                    <LogOut className="w-4 h-4" />
                    {isLoggingOut ? 'Logging out...' : 'Logout'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
