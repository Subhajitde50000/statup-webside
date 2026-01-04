'use client';

import React, { useState, useEffect } from 'react';
import { Bell, User, Home, Calendar, Briefcase, MessageSquare, Clock, DollarSign, LogOut, ChevronDown, CalendarDays } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getUnreadCount } from '@/utils/notifications';

interface ProfessionalNavbarProps {
  activeTab?: string;
  notificationCount?: number;
  currentTime?: string;
  professionalName?: string;
  professionalRole?: string;
  profileImage?: string;
  isOnline?: boolean;
}

interface UserProfile {
  id: string;
  name: string;
  email?: string;
  phone: string;
  role: string;
  profile_image?: string;
  approval_data?: {
    category?: string;
  };
}

export default function ProfessionalNavbar({
  activeTab = 'home',
  notificationCount = 0,
  currentTime = '--:--',
  professionalName,
  professionalRole,
  profileImage,
  isOnline = true
}: ProfessionalNavbarProps) {
  const router = useRouter();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [time, setTime] = useState<string>('--:--');
  const [realNotificationCount, setRealNotificationCount] = useState<number>(0);

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) return;

        const response = await fetch('http://localhost:8000/api/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserProfile(data);
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
      }
    };

    fetchUserProfile();
  }, []);

  // Fetch unread notification count
  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        const count = await getUnreadCount();
        setRealNotificationCount(count);
      } catch (err) {
        console.error('Error fetching notification count:', err);
      }
    };

    fetchNotificationCount();

    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotificationCount, 30000);
    return () => clearInterval(interval);
  }, []);

  // Update time every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      // Clear all auth data
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      // Redirect to login
      router.push('/auth');
    }
  };

  // Get display values - use props if provided, otherwise use fetched data
  const displayName = professionalName || userProfile?.name || 'Professional';
  const displayRole = professionalRole || (userProfile?.approval_data?.category ? `${userProfile.approval_data.category} Professional` : 'Service Provider');
  const displayImage = profileImage || userProfile?.profile_image || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(displayName) + '&background=0AA06E&color=fff&bold=true';
  const displayTime = currentTime || time;
  const displayNotificationCount = notificationCount || realNotificationCount;

  return (
    <>
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left - Profile */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 hover:bg-gray-50 rounded-lg p-1 transition-colors"
                >
                  <div className="relative">
                    <img
                      src={displayImage}
                      alt={displayName}
                      className="w-10 h-10 rounded-full border-2 border-teal-500 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(displayName) + '&background=0AA06E&color=fff&bold=true';
                      }}
                    />
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                      isOnline ? 'bg-green-500' : 'bg-gray-400'
                    }`} />
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-bold text-gray-900">{displayName}</p>
                    <p className="text-xs text-gray-500">{displayRole}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-600 hidden md:block" />
                </button>

                {/* Profile Dropdown Menu */}
                {showProfileMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowProfileMenu(false)}
                    />
                    <div className="absolute left-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border-2 border-gray-100 py-2 z-50">
                      <Link
                        href="/professional/profile"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <User className="w-5 h-5 text-teal-600" />
                        <div>
                          <p className="font-bold text-gray-900">View Profile</p>
                          <p className="text-xs text-gray-500">Manage your account</p>
                        </div>
                      </Link>
                      <div className="border-t border-gray-100 my-2" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-red-600 font-bold"
                      >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Center - Desktop Navigation (hidden on mobile/tablet) */}
            <nav className="hidden lg:flex items-center gap-1">
              <Link
                href="/professional"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
                  activeTab === 'home'
                    ? 'bg-teal-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </Link>

              <Link
                href="/professional/bookings"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
                  activeTab === 'bookings'
                    ? 'bg-teal-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Calendar className="w-5 h-5" />
                <span>Bookings</span>
              </Link>

              <Link
                href="/professional/services"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
                  activeTab === 'services'
                    ? 'bg-teal-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Briefcase className="w-5 h-5" />
                <span>Services</span>
              </Link>

              <Link
                href="/professional/messages"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
                  activeTab === 'messages'
                    ? 'bg-teal-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <MessageSquare className="w-5 h-5" />
                <span>Messages</span>
              </Link>

              <Link
                href="/professional/schedule"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
                  activeTab === 'schedule'
                    ? 'bg-teal-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <CalendarDays className="w-5 h-5" />
                <span>Schedule</span>
              </Link>

              <Link
                href="/professional/offers"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
                  activeTab === 'offers'
                    ? 'bg-teal-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <DollarSign className="w-5 h-5" />
                <span>Offers</span>
              </Link>

              <Link
                href="/professional/subscription"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
                  activeTab === 'subscription'
                    ? 'bg-teal-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Briefcase className="w-5 h-5" />
                <span>Subscription</span>
              </Link>
              
            </nav>

            {/* Right - Notifications & Time */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span className="font-semibold">
                  {displayTime}
                </span>
              </div>
              <Link href="/professional/notifications" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Bell className="w-6 h-6 text-gray-700" />
                {displayNotificationCount > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {displayNotificationCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Footer Navigation - Only visible on mobile/tablet, hidden on desktop */}
      <footer className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-2">
          <div className="flex items-center justify-around h-16">
            <Link
              href="/professional"
              className={`flex flex-col items-center gap-1 px-3 py-2 transition-colors ${
                activeTab === 'home' ? 'text-teal-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Home className="w-6 h-6" />
              <span className="text-xs font-bold">Home</span>
            </Link>

            <Link
              href="/professional/bookings"
              className={`flex flex-col items-center gap-1 px-3 py-2 transition-colors ${
                activeTab === 'bookings' ? 'text-teal-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Calendar className="w-6 h-6" />
              <span className="text-xs font-bold">Bookings</span>
            </Link>

            <Link
              href="/professional/services"
              className={`flex flex-col items-center gap-1 px-3 py-2 transition-colors ${
                activeTab === 'services' ? 'text-teal-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Briefcase className="w-6 h-6" />
              <span className="text-xs font-bold">Services</span>
            </Link>

            {/* <Link
              href="/professional/schedule"
              className={`flex flex-col items-center gap-1 px-3 py-2 transition-colors ${
                activeTab === 'schedule' ? 'text-teal-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <CalendarDays className="w-6 h-6" />
              <span className="text-xs font-bold">Schedule</span>
            </Link> */}

            <Link
              href="/professional/offers"
              className={`flex flex-col items-center gap-1 px-3 py-2 transition-colors ${
                activeTab === 'offers' ? 'text-teal-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <DollarSign className="w-6 h-6" />
              <span className="text-xs font-bold">Offers</span>
            </Link>

            <Link
              href="/professional/messages"
              className={`flex flex-col items-center gap-1 px-3 py-2 transition-colors ${
                activeTab === 'messages' ? 'text-teal-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <MessageSquare className="w-6 h-6" />
              <span className="text-xs font-bold">Messages</span>
            </Link>

            <Link
              href="/professional/profile"
              className={`flex flex-col items-center gap-1 px-3 py-2 transition-colors ${
                activeTab === 'profile' ? 'text-teal-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <User className="w-6 h-6" />
              <span className="text-xs font-bold">Profile</span>
            </Link>
          </div>
        </div>
      </footer>

      {/* Bottom padding to prevent content hiding behind footer on mobile/tablet */}
      <div className="lg:hidden h-20" />
    </>
  );
}
