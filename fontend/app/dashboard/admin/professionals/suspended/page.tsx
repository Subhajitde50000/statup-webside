'use client';

import React, { useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { Search, Ban, AlertTriangle, Clock, CheckCircle2, XCircle, Calendar, User, FileText, Eye } from 'lucide-react';

interface SuspendedProfessional {
  id: string;
  name: string;
  email: string;
  phone: string;
  category: string;
  city: string;
  photo: string;
  suspensionReason: string;
  suspendedDate: string;
  suspensionDuration: string;
  expiryDate: string;
  strikes: number;
  previousSuspensions: number;
  status: 'active' | 'expired';
}

export default function SuspendedProfessionalsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDuration, setFilterDuration] = useState('all');
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState<SuspendedProfessional | null>(null);

  // Mock data
  const suspendedProfessionals: SuspendedProfessional[] = [
    {
      id: 'PRO123',
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@email.com',
      phone: '+91 98765 43210',
      category: 'Plumber',
      city: 'Mumbai',
      photo: 'RK',
      suspensionReason: 'Multiple customer complaints about unprofessional behavior',
      suspendedDate: '2024-12-01',
      suspensionDuration: '7 days',
      expiryDate: '2024-12-08',
      strikes: 2,
      previousSuspensions: 1,
      status: 'active',
    },
    {
      id: 'PRO124',
      name: 'Amit Patel',
      email: 'amit.patel@email.com',
      phone: '+91 87654 32109',
      category: 'Electrician',
      city: 'Delhi',
      photo: 'AP',
      suspensionReason: 'Safety violations reported by customers',
      suspendedDate: '2024-11-25',
      suspensionDuration: '30 days',
      expiryDate: '2024-12-25',
      strikes: 3,
      previousSuspensions: 2,
      status: 'active',
    },
  ];

  const stats = [
    { label: 'Total Suspended', value: '125', icon: Ban, color: 'bg-[#D32F2F]', textColor: 'text-[#D32F2F]' },
    { label: 'Active Suspensions', value: '98', icon: Clock, color: 'bg-[#FFAB00]', textColor: 'text-[#FFAB00]' },
    { label: 'Expiring Soon', value: '15', icon: AlertTriangle, color: 'bg-[#FF6B00]', textColor: 'text-[#FF6B00]' },
    { label: 'Total Strikes', value: '342', icon: XCircle, color: 'bg-[#6C63FF]', textColor: 'text-[#6C63FF]' },
  ];

  const suspensionOptions = [
    { duration: '24h', label: '24 Hours', color: 'bg-yellow-500' },
    { duration: '3days', label: '3 Days', color: 'bg-orange-500' },
    { duration: '7days', label: '7 Days', color: 'bg-red-500' },
    { duration: '30days', label: '30 Days', color: 'bg-purple-500' },
    { duration: 'permanent', label: 'Permanent Ban', color: 'bg-black' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F7FA]">
      <AdminSidebar />
      
      <div className="flex-1 ml-72 flex flex-col">
        {/* Top Navigation */}
        <div className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <div>
            <h1 className="text-2xl font-bold text-[#0B0F19]">Suspended Professionals</h1>
            <p className="text-sm text-gray-500">Manage suspensions and strikes</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.color} bg-opacity-10 rounded-xl flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-[#0B0F19]">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Filters & Search */}
          <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, email, category..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A73E8] focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select
                className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A73E8] bg-white"
                value={filterDuration}
                onChange={(e) => setFilterDuration(e.target.value)}
              >
                <option value="all">All Durations</option>
                <option value="24h">24 Hours</option>
                <option value="3days">3 Days</option>
                <option value="7days">7 Days</option>
                <option value="30days">30 Days</option>
                <option value="permanent">Permanent</option>
              </select>
            </div>
          </div>

          {/* Suspended Professionals List */}
          <div className="space-y-6">
            {suspendedProfessionals.map((professional) => (
              <div key={professional.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#D32F2F] to-[#B71C1C] p-6 text-white">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                        <span className="text-2xl font-bold">{professional.photo}</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{professional.name}</h3>
                        <p className="text-white text-opacity-90 text-sm">{professional.category} • {professional.city}</p>
                        <p className="text-white text-opacity-80 text-xs mt-1">ID: {professional.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-4 py-2 bg-white bg-opacity-20 rounded-lg text-sm font-semibold">
                        {professional.suspensionDuration}
                      </span>
                      <p className="text-xs text-white text-opacity-80 mt-2">
                        Expires: {new Date(professional.expiryDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Contact & Stats */}
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-sm">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{professional.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{professional.phone}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-end space-x-4">
                      <div className="text-center px-4 py-2 bg-red-50 rounded-lg border border-red-200">
                        <p className="text-2xl font-bold text-red-600">{professional.strikes}</p>
                        <p className="text-xs text-red-600">Active Strikes</p>
                      </div>
                      <div className="text-center px-4 py-2 bg-orange-50 rounded-lg border border-orange-200">
                        <p className="text-2xl font-bold text-orange-600">{professional.previousSuspensions}</p>
                        <p className="text-xs text-orange-600">Previous</p>
                      </div>
                    </div>
                  </div>

                  {/* Suspension Reason */}
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                        <p className="font-semibold text-red-900 mb-1">Suspension Reason</p>
                        <p className="text-sm text-red-700">{professional.suspensionReason}</p>
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Suspended On</p>
                        <p className="font-semibold text-gray-900">{new Date(professional.suspendedDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Expiry Date</p>
                        <p className="font-semibold text-gray-900">{new Date(professional.expiryDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <button className="flex-1 px-4 py-3 bg-[#00C853] text-white rounded-xl hover:bg-[#00a844] transition-colors font-semibold flex items-center justify-center space-x-2">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Reactivate Now</span>
                    </button>
                    <button className="flex-1 px-4 py-3 bg-[#FFAB00] text-white rounded-xl hover:bg-[#ff9100] transition-colors font-semibold flex items-center justify-center space-x-2">
                      <Clock className="w-5 h-5" />
                      <span>Extend Suspension</span>
                    </button>
                    <button className="px-4 py-3 bg-[#1A73E8] text-white rounded-xl hover:bg-[#1557b0] transition-colors font-semibold flex items-center justify-center space-x-2">
                      <Eye className="w-5 h-5" />
                      <span>View Details</span>
                    </button>
                    <button className="px-4 py-3 bg-[#D32F2F] text-white rounded-xl hover:bg-[#b71c1c] transition-colors font-semibold flex items-center justify-center space-x-2">
                      <Ban className="w-5 h-5" />
                      <span>Permanent Ban</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Suspension Tools */}
          <div className="mt-8 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-[#0B0F19] mb-4">Quick Suspension Tools</h3>
            <div className="grid grid-cols-5 gap-4">
              {suspensionOptions.map((option) => (
                <button
                  key={option.duration}
                  className={`${option.color} text-white rounded-xl p-4 hover:opacity-90 transition-opacity`}
                >
                  <p className="font-bold text-lg mb-1">{option.label}</p>
                  <p className="text-xs opacity-90">Quick Action</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
