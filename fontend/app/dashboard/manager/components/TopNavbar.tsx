'use client';

import React, { useState } from 'react';
import { Bell, Search, Settings, Moon, Sun, ChevronDown } from 'lucide-react';
import Image from 'next/image';

export default function TopNavbar() {
  const [darkMode, setDarkMode] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

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
            <button className="relative text-[#64748B] hover:text-[#3B82F6] transition-colors p-2 rounded-lg hover:bg-[#F1F5F9]">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#EF4444] rounded-full text-white text-xs flex items-center justify-center font-semibold">
                7
              </span>
            </button>

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
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 border border-[#E2E8F0]">
                  <a href="#" className="block px-4 py-3 text-[#1E293B] hover:bg-[#F8FAFC] transition-colors">
                    <div className="font-semibold text-sm">Profile Settings</div>
                    <div className="text-xs text-[#64748B]">Manage your account</div>
                  </a>
                  <a href="#" className="block px-4 py-3 text-[#1E293B] hover:bg-[#F8FAFC] transition-colors">
                    <div className="font-semibold text-sm">Preferences</div>
                    <div className="text-xs text-[#64748B]">Customize dashboard</div>
                  </a>
                  <hr className="my-2 border-[#E2E8F0]" />
                  <a href="#" className="block px-4 py-3 text-[#EF4444] hover:bg-[#FEF2F2] transition-colors font-semibold text-sm">
                    Logout
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
