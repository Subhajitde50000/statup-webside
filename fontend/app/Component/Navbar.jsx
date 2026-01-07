'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, MapPin, Search, Bell, Bookmark, Menu, Home, Briefcase, Calendar, User, LogOut, Settings, Heart } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/utils/AuthContext';
import { getFavoritesCount } from '@/utils/favorites';
import { useNotifications } from '@/utils/NotificationContext';
import SearchDropdown from './SearchDropdown';

export default function Navbar({ onNotificationClick, isNotificationsOpen }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { unreadCount: notificationCount } = useNotifications();
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const profileDropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch favorites count
  useEffect(() => {
    const fetchFavCount = async () => {
      if (isAuthenticated) {
        try {
          const result = await getFavoritesCount();
          setFavoritesCount(result.count || 0);
        } catch (error) {
          console.error('Error fetching favorites count:', error);
        }
      }
    };
    fetchFavCount();
    
    // Refresh count every 10 seconds
    const interval = setInterval(fetchFavCount, 10000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileDropdownOpen(false);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      {/* Top Bar - Minimal on Mobile, Full on Desktop */}
      <nav className={`fixed top-0 left-0 right-0 h-[70px] bg-white/95 backdrop-blur-md z-50 transition-all duration-300 ${
        isScrolled ? 'shadow-lg border-b border-gray-200' : 'shadow-sm border-b border-gray-100'
      }`}>
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 h-full flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4 md:gap-8">
          {/* Logo - Always Visible */}
          <Link href="/" className="flex items-center gap-2.5 cursor-pointer group">
            <div className="w-10 h-10 md:w-11 md:h-11 bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg group-hover:shadow-xl">
              <span className="text-white font-extrabold text-lg md:text-xl tracking-tight">HE</span>
            </div>
            <span className="text-lg md:text-xl font-extrabold text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">HomeExpert</span>
          </Link>

          {/* Location Selector - Hidden on mobile */}
          <button 
            onClick={() => setIsLocationOpen(!isLocationOpen)}
            className="hidden lg:flex items-center gap-3 px-4 py-2.5 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 rounded-xl transition-all relative border border-transparent hover:border-blue-200 group"
          >
            <div className="p-1.5 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg group-hover:scale-110 transition-transform">
              <MapPin className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-left">
              <div className="text-xs text-gray-500 font-medium">Service Location:</div>
              <div className="text-sm font-bold text-gray-900 flex items-center gap-1">
                Salt Lake, Kolkata
                <ChevronDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
              </div>
            </div>
          </button>

          {/* Navigation Links - Hidden on mobile */}
          <div className="hidden lg:flex items-center gap-1">
            <Link 
              href="/"
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                pathname === '/' 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/service"
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                pathname === '/service' 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              Services
            </Link>
            <Link 
              href="/about"
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                pathname === '/about' 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              About
            </Link>
          </div>
        </div>

        {/* Center Section - Search - Hidden on mobile */}
        <SearchDropdown 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearch={() => {
            if (searchQuery.trim()) {
              router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
            }
          }}
        />

        {/* Right Section */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Desktop Only Items */}
          {isLoading ? (
            <div className="hidden md:block w-24 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
          ) : isAuthenticated && user ? (
            /* Profile Dropdown for Logged In Users */
            <div className="hidden md:block relative" ref={profileDropdownRef}>
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 p-2 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 rounded-xl transition-all group border border-transparent hover:border-blue-200"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 max-w-[100px] truncate">
                  {user.name?.split(' ')[0] || 'User'}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email || user.phone}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                      user.role === 'professional' ? 'bg-green-100 text-green-700' :
                      user.role === 'shopkeeper' ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                  <Link
                    href="/profile"
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">My Profile</span>
                  </Link>
                  <Link
                    href="/bookings"
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium">My Bookings</span>
                  </Link>
                  <Link
                    href="/favorites"
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Heart className="w-4 h-4" />
                    <span className="text-sm font-medium">My Favorites</span>
                  </Link>
                  <Link
                    href="/offers"
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Briefcase className="w-4 h-4" />
                    <span className="text-sm font-medium">My Offers</span>
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="text-sm font-medium">Settings</span>
                  </Link>
                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors w-full"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm font-medium">Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Login/Sign Up for Non-Logged In Users */
            <Link href="/auth" className="hidden md:block text-sm font-bold text-gray-700 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 transition-all px-3 py-2 rounded-lg hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50">
              Login/Sign Up
            </Link>
          )}
          <Link href="/favorites" className=" p-2.5 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 rounded-xl transition-all group border border-transparent hover:border-blue-200 relative">
            <Heart className="w-5 h-5 text-gray-600 group-hover:text-red-600 transition-colors group-hover:scale-110" />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                {favoritesCount > 9 ? '9+' : favoritesCount}
              </span>
            )}
          </Link>
          
          {/* Notification - Always Visible */}
          <button 
            onClick={onNotificationClick}
            className="p-2 md:p-2.5 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 rounded-xl relative transition-all group border border-transparent hover:border-blue-200"
          >
            <Bell className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors group-hover:scale-110 group-hover:rotate-12" />
            {notificationCount > 0 ? (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg animate-pulse">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            ) : (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gray-300 rounded-full"></span>
            )}
          </button>
          
          {/* Desktop Only Partner Button */}
          <Link href="/register/professional" className="hidden lg:block px-4 lg:px-6 py-2.5 border-2 border-blue-600 text-blue-600 rounded-full font-bold hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white hover:border-transparent transition-all shadow-md hover:shadow-xl hover:scale-105 text-sm">
            Become a Partner
          </Link>
          
          {/* Mobile Menu Button - Removed */}
        </div>
      </div>
      
      {/* Mobile Menu - Removed */}
    </nav>

    {/* Mobile Bottom Navigation */}
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-2xl z-50 pb-safe">
      <div className="grid grid-cols-5 h-16">
        <Link 
          href="/"
          className={`flex flex-col items-center justify-center gap-1 transition-all ${
            pathname === '/' 
              ? 'text-blue-600' 
              : 'text-gray-600'
          }`}
        >
          <Home className={`w-5 h-5 ${pathname === '/' ? 'fill-blue-600' : ''}`} />
          <span className="text-[10px] font-bold">Home</span>
        </Link>

        <Link 
          href="/service"
          className={`flex flex-col items-center justify-center gap-1 transition-all ${
            pathname === '/service' 
              ? 'text-blue-600' 
              : 'text-gray-600'
          }`}
        >
          <Briefcase className={`w-5 h-5 ${pathname === '/service' ? 'fill-blue-600' : ''}`} />
          <span className="text-[10px] font-bold">Services</span>
        </Link>

        <Link 
          href="/search-suggestions"
          className="flex flex-col items-center justify-center gap-1 text-white relative"
        >
          <div className="absolute -top-4 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-xl">
            <Search className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-bold text-gray-600 mt-6">Search</span>
        </Link>

        <Link 
          href="/booking"
          className={`flex flex-col items-center justify-center gap-1 transition-all ${
            pathname === '/bookings' 
              ? 'text-blue-600' 
              : 'text-gray-600'
          }`}
        >
          <Calendar className={`w-5 h-5 ${pathname === '/bookings' ? 'fill-blue-600' : ''}`} />
          <span className="text-[10px] font-bold">Bookings</span>
        </Link>

        <Link 
          href={isAuthenticated ? "/profile" : "/auth"}
          className={`flex flex-col items-center justify-center gap-1 transition-all ${
            pathname === '/profile' 
              ? 'text-blue-600' 
              : 'text-gray-600'
          }`}
        >
          {isAuthenticated && user ? (
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          ) : (
            <User className={`w-5 h-5 ${pathname === '/profile' ? 'fill-blue-600' : ''}`} />
          )}
          <span className="text-[10px] font-bold">{isAuthenticated ? 'Profile' : 'Login'}</span>
        </Link>
      </div>
    </div>
    </>
  );
}
