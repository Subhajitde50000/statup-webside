'use client';

import React from 'react';
import { Bell, User, Home, Calendar, Briefcase, MessageSquare, Clock, DollarSign } from 'lucide-react';
import Link from 'next/link';

interface ProfessionalNavbarProps {
  activeTab?: string;
  notificationCount?: number;
  currentTime?: string;
  professionalName?: string;
  professionalRole?: string;
  profileImage?: string;
  isOnline?: boolean;
}

export default function ProfessionalNavbar({
  activeTab = 'home',
  notificationCount = 0,
  currentTime = '--:--',
  professionalName = 'Professional',
  professionalRole = 'Service Provider',
  profileImage = 'https://i.pravatar.cc/150?img=12',
  isOnline = true
}: ProfessionalNavbarProps) {
  return (
    <>
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left - Profile */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={profileImage}
                  alt={professionalName}
                  className="w-10 h-10 rounded-full border-2 border-teal-500 object-cover"
                />
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                  isOnline ? 'bg-green-500' : 'bg-gray-400'
                }`} />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-bold text-gray-900">{professionalName}</p>
                <p className="text-xs text-gray-500">{professionalRole}</p>
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
                href="/bookings"
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
                href="/services"
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
                href="/messages"
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

              <Link
                href="/professional/profile"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
                  activeTab === 'profile'
                    ? 'bg-teal-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <User className="w-5 h-5" />
                <span>Profile</span>
              </Link>
            </nav>

            {/* Right - Notifications & Time */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span className="font-semibold">
                  {currentTime}
                </span>
              </div>
              <Link href="/notifications" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Bell className="w-6 h-6 text-gray-700" />
                {notificationCount > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {notificationCount}
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
              href="/bookings"
              className={`flex flex-col items-center gap-1 px-3 py-2 transition-colors ${
                activeTab === 'bookings' ? 'text-teal-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Calendar className="w-6 h-6" />
              <span className="text-xs font-bold">Bookings</span>
            </Link>

            <Link
              href="/services"
              className={`flex flex-col items-center gap-1 px-3 py-2 transition-colors ${
                activeTab === 'services' ? 'text-teal-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Briefcase className="w-6 h-6" />
              <span className="text-xs font-bold">Services</span>
            </Link>

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
              href="/messages"
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
