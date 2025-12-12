'use client';

import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  Wallet,
  ShoppingCart,
  AlertCircle,
  Key,
  Bell,
  Shield,
  Ban,
  Trash2
} from 'lucide-react';

interface UserProfileDrawerProps {
  user: {
    id: string;
    photo: string;
    name: string;
    email: string;
    phone: string;
    location: string;
    status: 'active' | 'pending' | 'suspended';
    verified: boolean;
    totalBookings: number;
    walletBalance: number;
  };
  onClose: () => void;
}

export default function UserProfileDrawer({ user, onClose }: UserProfileDrawerProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'wallet' | 'complaints'>('overview');

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50 animate-fadeIn"
        onClick={onClose}
      ></div>

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-screen w-full max-w-2xl bg-white shadow-2xl z-50 animate-slideInRight overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#1A73E8] to-[#6C63FF] text-white p-6 z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-bold text-2xl">
                {user.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-white/80 text-sm">User ID: #{user.id}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Status Badge */}
          <div className="flex items-center space-x-3">
            {user.status === 'active' && (
              <span className="inline-flex items-center space-x-1 px-3 py-1 bg-[#00C853] text-white rounded-full text-xs font-semibold">
                <CheckCircle className="w-3 h-3" />
                <span>Active</span>
              </span>
            )}
            {user.verified && (
              <span className="inline-flex items-center space-x-1 px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs font-semibold">
                <Shield className="w-3 h-3" />
                <span>Verified</span>
              </span>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-[#E8ECF2] bg-white sticky top-[140px] z-10">
          <div className="flex space-x-1 px-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-[#1A73E8] text-[#1A73E8]'
                  : 'border-transparent text-[#6B7280] hover:text-[#0B0F19]'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'bookings'
                  ? 'border-[#1A73E8] text-[#1A73E8]'
                  : 'border-transparent text-[#6B7280] hover:text-[#0B0F19]'
              }`}
            >
              Bookings
            </button>
            <button
              onClick={() => setActiveTab('wallet')}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'wallet'
                  ? 'border-[#1A73E8] text-[#1A73E8]'
                  : 'border-transparent text-[#6B7280] hover:text-[#0B0F19]'
              }`}
            >
              Wallet
            </button>
            <button
              onClick={() => setActiveTab('complaints')}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'complaints'
                  ? 'border-[#1A73E8] text-[#1A73E8]'
                  : 'border-transparent text-[#6B7280] hover:text-[#0B0F19]'
              }`}
            >
              Complaints
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {activeTab === 'overview' && (
            <>
              {/* Basic Information */}
              <div className="bg-[#F5F7FA] rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#0B0F19] mb-4">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[#6B7280] mb-1">Full Name</p>
                    <p className="font-semibold text-[#0B0F19]">{user.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#6B7280] mb-1">Gender</p>
                    <p className="font-semibold text-[#0B0F19]">Male</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#6B7280] mb-1">Email</p>
                    <p className="font-semibold text-[#0B0F19]">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#6B7280] mb-1">Phone</p>
                    <p className="font-semibold text-[#0B0F19]">{user.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#6B7280] mb-1">Date of Birth</p>
                    <p className="font-semibold text-[#0B0F19]">15 Aug 1990</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#6B7280] mb-1">Signup Date</p>
                    <p className="font-semibold text-[#0B0F19]">12 Jan 2024</p>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="bg-[#F5F7FA] rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#0B0F19] mb-4">Address Information</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-white rounded-lg">
                    <MapPin className="w-5 h-5 text-[#1A73E8] mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-[#0B0F19]">Home</p>
                      <p className="text-sm text-[#6B7280]">123, MG Road, {user.location}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-[#1A73E8]/10 text-[#1A73E8] text-xs font-medium rounded">
                        Default
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-white rounded-lg">
                    <MapPin className="w-5 h-5 text-[#6B7280] mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-[#0B0F19]">Office</p>
                      <p className="text-sm text-[#6B7280]">456, Tech Park, {user.location}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Status */}
              <div className="bg-[#F5F7FA] rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#0B0F19] mb-4">Account Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[#6B7280]">Account Status</span>
                    <span className="font-semibold text-[#00C853]">Active</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#6B7280]">Verification Status</span>
                    <span className="font-semibold text-[#00C853]">Verified</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#6B7280]">Strike History</span>
                    <span className="font-semibold text-[#0B0F19]">0 Strikes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#6B7280]">Last Login</span>
                    <span className="font-semibold text-[#0B0F19]">2 hours ago</span>
                  </div>
                </div>
              </div>

              {/* Booking Summary */}
              <div className="bg-[#F5F7FA] rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-[#0B0F19]">Booking Summary</h3>
                  <button className="text-sm text-[#1A73E8] font-medium hover:underline">
                    View All →
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-[#6B7280] mb-1">Total Bookings</p>
                    <p className="text-2xl font-bold text-[#0B0F19]">{user.totalBookings}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-[#6B7280] mb-1">Completed</p>
                    <p className="text-2xl font-bold text-[#00C853]">41</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-[#6B7280] mb-1">Cancelled</p>
                    <p className="text-2xl font-bold text-[#D32F2F]">3</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-[#6B7280] mb-1">Ongoing</p>
                    <p className="text-2xl font-bold text-[#FFAB00]">1</p>
                  </div>
                </div>
              </div>

              {/* Wallet & Payments */}
              <div className="bg-[#F5F7FA] rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-[#0B0F19]">Wallet & Payments</h3>
                  <button className="text-sm text-[#1A73E8] font-medium hover:underline">
                    Manage →
                  </button>
                </div>
                <div className="bg-white rounded-lg p-4 mb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-[#00C853]/10 rounded-lg flex items-center justify-center">
                        <Wallet className="w-5 h-5 text-[#00C853]" />
                      </div>
                      <div>
                        <p className="text-sm text-[#6B7280]">Wallet Balance</p>
                        <p className="text-2xl font-bold text-[#0B0F19]">₹{user.walletBalance}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-[#6B7280]">Recent Transactions</p>
                  <div className="bg-white rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-[#0B0F19]">Booking Payment</p>
                      <p className="text-xs text-[#6B7280]">12 Dec 2024</p>
                    </div>
                    <span className="text-sm font-bold text-[#D32F2F]">-₹2,500</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-[#0B0F19]">Cashback Added</p>
                      <p className="text-xs text-[#6B7280]">10 Dec 2024</p>
                    </div>
                    <span className="text-sm font-bold text-[#00C853]">+₹150</span>
                  </div>
                </div>
              </div>

              {/* Complaints */}
              <div className="bg-[#F5F7FA] rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-[#0B0F19]">Complaints</h3>
                  <button className="text-sm text-[#1A73E8] font-medium hover:underline">
                    View All →
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-[#6B7280] mb-1">Filed by User</p>
                    <p className="text-2xl font-bold text-[#0B0F19]">2</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-[#6B7280] mb-1">Against User</p>
                    <p className="text-2xl font-bold text-[#D32F2F]">0</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'bookings' && (
            <div>
              <p className="text-[#6B7280]">Booking details will be shown here</p>
            </div>
          )}

          {activeTab === 'wallet' && (
            <div>
              <p className="text-[#6B7280]">Wallet details will be shown here</p>
            </div>
          )}

          {activeTab === 'complaints' && (
            <div>
              <p className="text-[#6B7280]">Complaints details will be shown here</p>
            </div>
          )}
        </div>

        {/* Admin Actions Footer */}
        <div className="sticky bottom-0 bg-white border-t border-[#E8ECF2] p-6 space-y-3">
          <h3 className="text-lg font-bold text-[#0B0F19] mb-3">Admin Actions</h3>
          <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-[#6C63FF] hover:bg-[#5A52D5] text-white rounded-xl transition-colors">
            <Key className="w-5 h-5" />
            <span className="font-medium">Reset Password</span>
          </button>
          <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-[#1A73E8] hover:bg-[#1557B0] text-white rounded-xl transition-colors">
            <Bell className="w-5 h-5" />
            <span className="font-medium">Send Push Notification</span>
          </button>
          <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-[#00C853] hover:bg-[#00A84B] text-white rounded-xl transition-colors">
            <Shield className="w-5 h-5" />
            <span className="font-medium">Manually Verify</span>
          </button>
          <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-[#FFAB00] hover:bg-[#E69B00] text-white rounded-xl transition-colors">
            <Ban className="w-5 h-5" />
            <span className="font-medium">Suspend User</span>
          </button>
          <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-[#D32F2F] hover:bg-[#B71C1C] text-white rounded-xl transition-colors">
            <Trash2 className="w-5 h-5" />
            <span className="font-medium">Delete User</span>
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
