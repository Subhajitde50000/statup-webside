'use client';

import React, { useState } from 'react';
import { 
  Bell, 
  MessageSquare, 
  Plus, 
  Search, 
  User, 
  LogOut, 
  Moon, 
  Sun,
  ChevronDown,
  Tag,
  Store,
  UserPlus,
  Megaphone
} from 'lucide-react';

export default function DashboardHeader() {
  const [showQuickCreate, setShowQuickCreate] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1920px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#4C5BF5] to-[#8B5CF6] rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#1F2937]">Admin Dashboard</h1>
              <p className="text-xs text-[#6B7280]">Manage your marketplace</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
              <input
                type="text"
                placeholder="Search users, shops, professionals, orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#F4F6FA] border border-transparent rounded-xl text-[#1F2937] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#4C5BF5] focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Quick Create Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowQuickCreate(!showQuickCreate)}
                className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-[#4C5BF5] to-[#8B5CF6] text-white rounded-xl hover:shadow-lg hover:shadow-[#4C5BF5]/30 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <Plus className="w-5 h-5" />
                <span className="font-medium">Quick Create</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showQuickCreate ? 'rotate-180' : ''}`} />
              </button>

              {showQuickCreate && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-fadeIn">
                  <button className="w-full px-4 py-2.5 text-left hover:bg-[#F4F6FA] flex items-center space-x-3 text-[#1F2937] transition-colors">
                    <Tag className="w-4 h-4 text-[#F59E0B]" />
                    <span>Create Coupon</span>
                  </button>
                  <button className="w-full px-4 py-2.5 text-left hover:bg-[#F4F6FA] flex items-center space-x-3 text-[#1F2937] transition-colors">
                    <Store className="w-4 h-4 text-[#10B981]" />
                    <span>Add Shop</span>
                  </button>
                  <button className="w-full px-4 py-2.5 text-left hover:bg-[#F4F6FA] flex items-center space-x-3 text-[#1F2937] transition-colors">
                    <UserPlus className="w-4 h-4 text-[#4C5BF5]" />
                    <span>Add Professional</span>
                  </button>
                  <button className="w-full px-4 py-2.5 text-left hover:bg-[#F4F6FA] flex items-center space-x-3 text-[#1F2937] transition-colors">
                    <Megaphone className="w-4 h-4 text-[#8B5CF6]" />
                    <span>Send Announcement</span>
                  </button>
                </div>
              )}
            </div>

            {/* Notifications */}
            <button className="relative p-2.5 hover:bg-[#F4F6FA] rounded-xl transition-colors">
              <Bell className="w-6 h-6 text-[#6B7280]" />
              <span className="absolute top-1 right-1 w-5 h-5 bg-[#EF4444] text-white text-xs font-bold rounded-full flex items-center justify-center">
                12
              </span>
            </button>

            {/* Messages */}
            <button className="relative p-2.5 hover:bg-[#F4F6FA] rounded-xl transition-colors">
              <MessageSquare className="w-6 h-6 text-[#6B7280]" />
              <span className="absolute top-1 right-1 w-5 h-5 bg-[#10B981] text-white text-xs font-bold rounded-full flex items-center justify-center">
                5
              </span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center space-x-3 px-3 py-2 hover:bg-[#F4F6FA] rounded-xl transition-colors"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-[#10B981] to-[#10B981]/80 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="text-left hidden lg:block">
                  <p className="text-sm font-semibold text-[#1F2937]">Admin User</p>
                  <p className="text-xs text-[#6B7280]">Super Admin</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-[#6B7280] transition-transform ${showProfile ? 'rotate-180' : ''}`} />
              </button>

              {showProfile && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-fadeIn">
                  <button className="w-full px-4 py-2.5 text-left hover:bg-[#F4F6FA] flex items-center space-x-3 text-[#1F2937] transition-colors">
                    <User className="w-4 h-4 text-[#4C5BF5]" />
                    <span>My Profile</span>
                  </button>
                  <button className="w-full px-4 py-2.5 text-left hover:bg-[#F4F6FA] flex items-center space-x-3 text-[#1F2937] transition-colors">
                    <Moon className="w-4 h-4 text-[#6B7280]" />
                    <span>Dark Mode</span>
                  </button>
                  <div className="border-t border-gray-100 my-2"></div>
                  <button className="w-full px-4 py-2.5 text-left hover:bg-[#FEE2E2] flex items-center space-x-3 text-[#EF4444] transition-colors">
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </header>
  );
}
