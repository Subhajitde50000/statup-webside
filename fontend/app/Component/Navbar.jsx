'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, MapPin, Search, Bell, Bookmark, Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Navbar({ onNotificationClick, isNotificationsOpen }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 h-[70px] bg-white/95 backdrop-blur-md z-50 transition-all duration-300 ${
      isScrolled ? 'shadow-lg border-b border-gray-200' : 'shadow-sm border-b border-gray-100'
    }`}>
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 h-full flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4 md:gap-8">
          {/* Logo */}
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
        <div className="hidden md:flex flex-1 max-w-2xl mx-4 lg:mx-8">
          <div className="relative group w-full">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg group-hover:scale-110 transition-transform">
              <Search className="w-4 h-4 text-blue-600" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
                }
              }}
              placeholder="Search services — electrician, plumber, cleaner, cook…"
              className="w-full pl-14 pr-4 py-3.5 border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-300 bg-white shadow-sm hover:shadow-md font-medium text-gray-700"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 md:gap-3">
          <Link href="/auth" className="hidden md:block text-sm font-bold text-gray-700 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 transition-all px-3 py-2 rounded-lg hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50">
            Login/Sign Up
          </Link>
          <button className="hidden md:block p-2.5 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 rounded-xl transition-all group border border-transparent hover:border-blue-200">
            <Bookmark className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors group-hover:scale-110" />
          </button>
          <button 
            onClick={onNotificationClick}
            className="p-2 md:p-2.5 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 rounded-xl relative transition-all group border border-transparent hover:border-blue-200"
          >
            <Bell className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors group-hover:scale-110 group-hover:rotate-12" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-lg"></span>
          </button>
          <button className="hidden lg:block px-4 lg:px-6 py-2.5 border-2 border-blue-600 text-blue-600 rounded-full font-bold hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white hover:border-transparent transition-all shadow-md hover:shadow-xl hover:scale-105 text-sm">
            Become a Partner
          </button>
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-all"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-[70px] left-0 right-0 bg-white border-b border-gray-200 shadow-lg">
          <div className="px-4 py-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search services..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Link 
              href="/"
              className={`w-full px-4 py-3 rounded-lg font-bold transition-colors ${
                pathname === '/' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/service"
              className={`w-full px-4 py-3 rounded-lg font-bold transition-colors ${
                pathname === '/service' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              Services
            </Link>
            <Link 
              href="/about"
              className={`w-full px-4 py-3 rounded-lg font-bold transition-colors ${
                pathname === '/about' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              About
            </Link>
            <button className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors">
              <MapPin className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-gray-900">Salt Lake, Kolkata</span>
            </button>
            <Link href="/auth" className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-center block">
              Login/Sign Up
            </Link>
            <button className="w-full py-3 border-2 border-blue-600 text-blue-600 rounded-xl font-bold">
              Become a Partner
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
