'use client';

import React, { useState } from 'react';
import { 
  X, 
  Star, 
  MapPin, 
  Phone, 
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Award,
  Briefcase,
  Shield,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  FileText,
  Edit,
  Ban,
  Trash2,
  RefreshCw,
  Eye,
  Languages
} from 'lucide-react';
import Link from 'next/link';

interface ProfessionalProfileDrawerProps {
  professional: any;
  onClose: () => void;
}

export default function ProfessionalProfileDrawer({ professional, onClose }: ProfessionalProfileDrawerProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'kyc' | 'skills' | 'stats'>('overview');

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      ></div>

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full md:w-[600px] bg-white shadow-2xl z-50 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#1A73E8] to-[#6C63FF] text-white p-6 z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-2xl font-bold">
                {professional.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{professional.name}</h2>
                <p className="text-white/90">{professional.category}</p>
                <p className="text-xs text-white/75 mt-1">ID: {professional.id}</p>
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
          <div className="flex items-center space-x-2">
            {professional.status === 'active' && (
              <span className="px-3 py-1 bg-[#00C853] text-white rounded-full text-sm font-semibold">
                🟢 Active
              </span>
            )}
            {professional.verified && (
              <span className="px-3 py-1 bg-white/20 backdrop-blur text-white rounded-full text-sm font-semibold">
                ✓ Verified
              </span>
            )}
            {professional.online && (
              <span className="px-3 py-1 bg-white/20 backdrop-blur text-white rounded-full text-sm font-semibold">
                🟢 Online
              </span>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="sticky top-[140px] bg-white border-b border-gray-200 px-6 flex space-x-6 z-10">
          {['overview', 'kyc', 'skills', 'stats'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`py-3 px-1 border-b-2 font-medium transition-colors capitalize ${
                activeTab === tab
                  ? 'border-[#1A73E8] text-[#1A73E8]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              {/* Basic Info */}
              <div className="bg-[#F5F7FA] rounded-xl p-4 space-y-3">
                <h3 className="font-semibold text-[#0B0F19] mb-3">Basic Information</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="w-4 h-4 text-[#6B7280]" />
                    <span className="text-[#0B0F19]">{professional.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="w-4 h-4 text-[#6B7280]" />
                    <span className="text-[#0B0F19]">{professional.city}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="w-4 h-4 text-[#6B7280]" />
                    <span className="text-[#0B0F19]">email@example.com</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="w-4 h-4 text-[#6B7280]" />
                    <span className="text-[#0B0F19]">Joined Jan 2024</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Languages className="w-4 h-4 text-[#6B7280]" />
                    <span className="text-[#0B0F19]">Hindi, English</span>
                  </div>
                </div>
              </div>

              {/* Ratings & Reviews */}
              <div className="bg-white border border-[#E8ECF2] rounded-xl p-4">
                <h3 className="font-semibold text-[#0B0F19] mb-3">Ratings & Reviews</h3>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-[#1A73E8]">{professional.rating}</div>
                    <div className="flex items-center justify-center mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= Math.floor(professional.rating)
                              ? 'fill-[#FFAB00] text-[#FFAB00]'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-[#6B7280] mt-1">{professional.reviewCount} reviews</p>
                  </div>
                  <div className="flex-1">
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center space-x-2">
                          <span className="text-xs text-[#6B7280] w-3">{rating}</span>
                          <Star className="w-3 h-3 fill-[#FFAB00] text-[#FFAB00]" />
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#FFAB00]"
                              style={{ width: `${Math.random() * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <Link
                  href={`/dashboard/admin/professionals/reviews/${professional.id}`}
                  className="text-sm text-[#1A73E8] hover:underline font-medium"
                >
                  View All Reviews →
                </Link>
              </div>

              {/* Account Health */}
              <div className="bg-white border border-[#E8ECF2] rounded-xl p-4">
                <h3 className="font-semibold text-[#0B0F19] mb-3 flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-[#FFAB00]" />
                  <span>Account Health</span>
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#FEE2E2] rounded-lg p-3">
                    <p className="text-2xl font-bold text-[#D32F2F]">1</p>
                    <p className="text-sm text-[#D32F2F]">Strikes</p>
                  </div>
                  <div className="bg-[#FEF3C7] rounded-lg p-3">
                    <p className="text-2xl font-bold text-[#FFAB00]">2</p>
                    <p className="text-sm text-[#FFAB00]">Warnings</p>
                  </div>
                  <div className="bg-[#FEE2E2] rounded-lg p-3">
                    <p className="text-2xl font-bold text-[#D32F2F]">3</p>
                    <p className="text-sm text-[#D32F2F]">Late Cancellations</p>
                  </div>
                  <div className="bg-[#FEF3C7] rounded-lg p-3">
                    <p className="text-2xl font-bold text-[#FFAB00]">6</p>
                    <p className="text-sm text-[#FFAB00]">Complaints</p>
                  </div>
                </div>
                <Link
                  href={`/dashboard/admin/professionals/complaints/${professional.id}`}
                  className="text-sm text-[#D32F2F] hover:underline font-medium mt-3 inline-block"
                >
                  View All Complaints →
                </Link>
              </div>
            </>
          )}

          {/* KYC Tab */}
          {activeTab === 'kyc' && (
            <>
              <div className="bg-white border border-[#E8ECF2] rounded-xl p-4">
                <h3 className="font-semibold text-[#0B0F19] mb-3">KYC Verification Status</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Government ID', status: 'verified', date: '2024-01-15' },
                    { label: 'Address Proof', status: 'verified', date: '2024-01-15' },
                    { label: 'Skill Certificate', status: 'pending', date: '-' },
                    { label: 'Selfie Verification', status: 'verified', date: '2024-01-15' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-[#F5F7FA] rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-[#6B7280]" />
                        <div>
                          <p className="font-medium text-[#0B0F19]">{item.label}</p>
                          <p className="text-xs text-[#6B7280]">Verified on: {item.date}</p>
                        </div>
                      </div>
                      {item.status === 'verified' ? (
                        <CheckCircle className="w-5 h-5 text-[#00C853]" />
                      ) : (
                        <Clock className="w-5 h-5 text-[#FFAB00]" />
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex space-x-2">
                  <button className="flex-1 px-4 py-2 bg-[#00C853] text-white rounded-lg hover:bg-[#00A844] transition-colors">
                    Approve Verification
                  </button>
                  <button className="flex-1 px-4 py-2 bg-[#D32F2F] text-white rounded-lg hover:bg-[#B71C1C] transition-colors">
                    Reject
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Skills Tab */}
          {activeTab === 'skills' && (
            <>
              <div className="bg-white border border-[#E8ECF2] rounded-xl p-4">
                <h3 className="font-semibold text-[#0B0F19] mb-3">Skills & Experience</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-[#6B7280] mb-1">Primary Skill</p>
                    <p className="font-semibold text-[#0B0F19]">{professional.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#6B7280] mb-1">Secondary Skills</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-[#1A73E8]/10 text-[#1A73E8] rounded-full text-sm">AC Service</span>
                      <span className="px-3 py-1 bg-[#1A73E8]/10 text-[#1A73E8] rounded-full text-sm">Fan Repair</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-[#6B7280] mb-1">Experience</p>
                    <p className="font-semibold text-[#0B0F19]">6 years</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#6B7280] mb-1">Tools Owned</p>
                    <p className="text-[#0B0F19]">Complete electrical toolkit</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Stats Tab */}
          {activeTab === 'stats' && (
            <>
              {/* Booking Stats */}
              <div className="bg-white border border-[#E8ECF2] rounded-xl p-4">
                <h3 className="font-semibold text-[#0B0F19] mb-3">Booking & Job Stats</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#D1FAE5] rounded-lg p-3">
                    <p className="text-2xl font-bold text-[#00C853]">{professional.jobsCompleted}</p>
                    <p className="text-sm text-[#00C853]">Completed Jobs</p>
                  </div>
                  <div className="bg-[#FEE2E2] rounded-lg p-3">
                    <p className="text-2xl font-bold text-[#D32F2F]">12</p>
                    <p className="text-sm text-[#D32F2F]">Cancelled by User</p>
                  </div>
                  <div className="bg-[#FEF3C7] rounded-lg p-3">
                    <p className="text-2xl font-bold text-[#FFAB00]">9</p>
                    <p className="text-sm text-[#FFAB00]">Cancelled by Pro</p>
                  </div>
                  <div className="bg-[#E0E7FF] rounded-lg p-3">
                    <p className="text-2xl font-bold text-[#1A73E8]">90%</p>
                    <p className="text-sm text-[#1A73E8]">Acceptance Rate</p>
                  </div>
                </div>
              </div>

              {/* Earnings */}
              <div className="bg-white border border-[#E8ECF2] rounded-xl p-4">
                <h3 className="font-semibold text-[#0B0F19] mb-3">Earnings Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-[#F5F7FA] rounded-lg">
                    <span className="text-[#6B7280]">Total Earnings</span>
                    <span className="font-bold text-[#00C853]">₹{professional.totalEarnings.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-[#F5F7FA] rounded-lg">
                    <span className="text-[#6B7280]">Monthly Earnings</span>
                    <span className="font-bold text-[#1A73E8]">₹25,000</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-[#F5F7FA] rounded-lg">
                    <span className="text-[#6B7280]">Upcoming Payout</span>
                    <span className="font-bold text-[#FFAB00]">₹12,500</span>
                  </div>
                </div>
                <Link
                  href={`/dashboard/admin/professionals/earnings/${professional.id}`}
                  className="text-sm text-[#1A73E8] hover:underline font-medium mt-3 inline-block"
                >
                  View Earnings Report →
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Admin Actions Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 space-y-3">
          <h3 className="font-semibold text-[#0B0F19] mb-3">Admin Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href={`/dashboard/admin/professionals/edit/${professional.id}`}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-[#1A73E8] text-white rounded-lg hover:bg-[#1557B0] transition-colors"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Profile</span>
            </Link>
            <Link
              href={`/dashboard/admin/professionals/verify/${professional.id}`}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-[#00C853] text-white rounded-lg hover:bg-[#00A844] transition-colors"
            >
              <Shield className="w-4 h-4" />
              <span>Verify Now</span>
            </Link>
            <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-[#6C63FF] text-white rounded-lg hover:bg-[#5A52D5] transition-colors">
              <RefreshCw className="w-4 h-4" />
              <span>Reset Password</span>
            </button>
            <Link
              href={`/dashboard/admin/professionals/suspend/${professional.id}`}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-[#FFAB00] text-white rounded-lg hover:bg-[#F59E0B] transition-colors"
            >
              <Ban className="w-4 h-4" />
              <span>Suspend</span>
            </Link>
            <button className="col-span-2 flex items-center justify-center space-x-2 px-4 py-2 bg-[#D32F2F] text-white rounded-lg hover:bg-[#B71C1C] transition-colors">
              <Trash2 className="w-4 h-4" />
              <span>Permanently Delete</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
