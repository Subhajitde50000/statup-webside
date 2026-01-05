'use client';

import React, { useState, useEffect } from 'react';
import { Search, Download, Filter, Eye, CheckCircle, Ban, MessageSquare, Star, Phone, UserPlus, Clock, AlertTriangle, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import TopNavbar from '../components/TopNavbar';
import LeftSidebar from '../components/LeftSidebar';

interface Professional {
  id: string;
  name: string;
  email?: string;
  phone: string;
  role: string;
  is_active: boolean;
  is_verified?: boolean;
  profile_image?: string;
  created_at: string;
  updated_at: string;
  is_suspended?: boolean;
  suspension_reason?: string;
}

export default function ProfessionalsListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [kycFilter, setKycFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfessionals();
  }, []);

  const fetchProfessionals = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        setError('No access token found. Please login.');
        return;
      }

      const response = await fetch('http://localhost:8000/api/users/list?role=professional&per_page=100', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch professionals');
      }

      const data = await response.json();
      setProfessionals(data.users || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load professionals');
      console.error('Error fetching professionals:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', 'Electrician', 'Plumber', 'Housekeeper', 'Cook', 'Driver', 'Mechanic', 'Carpenter', 'Painter'];

  const filteredProfessionals = professionals.filter((professional) => {
    const matchesSearch = 
      professional.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      professional.phone.includes(searchQuery) ||
      professional.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && professional.is_active) ||
      (statusFilter === 'inactive' && !professional.is_active) ||
      (statusFilter === 'pending' && professional.role === 'pending_professional') ||
      (statusFilter === 'suspended' && professional.is_suspended);
    
    const matchesKyc = kycFilter === 'all' || 
      (kycFilter === 'verified' && professional.is_verified) ||
      (kycFilter === 'not-verified' && !professional.is_verified);
    
    return matchesSearch && matchesStatus && matchesKyc;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <TopNavbar />
      <div className="flex">
        <LeftSidebar isOpen={sidebarOpen} />
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
          <div className="p-8">
            <div className="max-w-[1400px] mx-auto">
              {/* Header Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-semibold text-[#1E293B] mb-2">All Service Professionals</h1>
                    <p className="text-[#64748B] text-sm">Manage and monitor all registered service professionals</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-white border border-[#E2E8F0] text-[#64748B] rounded-lg hover:bg-[#F8FAFC] transition-colors flex items-center gap-2 text-sm font-medium">
                      <Download className="w-4 h-4" />
                      Export CSV
                    </button>
                    <button className="px-4 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors flex items-center gap-2 text-sm font-medium shadow-sm">
                      <UserPlus className="w-4 h-4" />
                      Add Professional
                    </button>
                  </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-xl border border-[#E2E8F0] p-4">
                  <div className="flex flex-col lg:flex-row gap-4 mb-4">
                    {/* Search Bar */}
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#94A3B8] w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search by name, phone, or category..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 text-gray-700 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
                      />
                    </div>

                    {/* Category Filter */}
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="px-4 py-2.5 text-gray-700 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] bg-white"
                    >
                      <option value="all">All Categories</option>
                      {categories.slice(1).map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>

                    {/* KYC Filter */}
                    <select
                      value={kycFilter}
                      onChange={(e) => setKycFilter(e.target.value)}
                      className="px-4 py-2.5 text-gray-700 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] bg-white"
                    >
                      <option value="all">All KYC Status</option>
                      <option value="verified">Verified</option>
                      <option value="not-verified">Not Verified</option>
                    </select>
                  </div>

                  {/* Status Filter Chips */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {['all', 'active', 'inactive', 'pending'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          statusFilter === status
                            ? 'bg-[#3B82F6] text-white shadow-sm'
                            : 'bg-[#F8FAFC] text-[#64748B] hover:bg-[#E2E8F0]'
                        }`}
                      >
                        {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-xl p-5 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm opacity-90">Total Professionals</span>
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <UserPlus className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold">{professionals.length}</h3>
                  <p className="text-xs opacity-75 mt-1">Registered users</p>
                </div>

                <div className="bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl p-5 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm opacity-90">Active Now</span>
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold">{professionals.filter(p => p.is_active).length}</h3>
                  <p className="text-xs opacity-75 mt-1">Currently available</p>
                </div>

                <div className="bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-xl p-5 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm opacity-90">Suspended</span>
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <Ban className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold">{professionals.filter(p => p.is_suspended).length}</h3>
                  <p className="text-xs opacity-75 mt-1">Suspended accounts</p>
                </div>

                <div className="bg-gradient-to-br from-[#EF4444] to-[#DC2626] rounded-xl p-5 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm opacity-90">Inactive</span>
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <Clock className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold">{professionals.filter(p => !p.is_active).length}</h3>
                  <p className="text-xs opacity-75 mt-1">Not available</p>
                </div>
              </div>

              {/* Table Section */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <RefreshCw className="w-8 h-8 text-[#3B82F6] animate-spin" />
                    <span className="ml-3 text-[#64748B]">Loading professionals...</span>
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center py-12 text-red-600">
                    <AlertTriangle className="w-6 h-6 mr-2" />
                    {error}
                  </div>
                ) : filteredProfessionals.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-[#64748B]">
                    <Search className="w-12 h-12 mb-3 opacity-50" />
                    <p>No professionals found</p>
                  </div>
                ) : (
                  <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="sticky top-0 bg-[#F8FAFC] z-10">
                      <tr className="border-b border-[#E2E8F0]">
                        <th className="text-left py-4 px-6 text-xs font-semibold text-[#64748B] uppercase tracking-wide">Professional</th>
                        <th className="text-left py-4 px-6 text-xs font-semibold text-[#64748B] uppercase tracking-wide">Email</th>
                        <th className="text-left py-4 px-6 text-xs font-semibold text-[#64748B] uppercase tracking-wide">Phone</th>
                        <th className="text-left py-4 px-6 text-xs font-semibold text-[#64748B] uppercase tracking-wide">Status</th>
                        <th className="text-left py-4 px-6 text-xs font-semibold text-[#64748B] uppercase tracking-wide">Verification</th>
                        <th className="text-left py-4 px-6 text-xs font-semibold text-[#64748B] uppercase tracking-wide">Joined</th>
                        <th className="text-left py-4 px-6 text-xs font-semibold text-[#64748B] uppercase tracking-wide">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProfessionals.map((professional) => (
                        <tr 
                          key={professional.id} 
                          className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors cursor-pointer group"
                        >
                          {/* Professional Name + Photo */}
                          <td className="py-4 px-6">
                            <Link href={`/dashboard/manager/professionals/${professional.id}`}>
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#3B82F6] flex items-center justify-center text-white font-semibold overflow-hidden ring-2 ring-[#E2E8F0]">
                                  {professional.profile_image ? (
                                    <img 
                                      src={`http://localhost:8000${professional.profile_image}`} 
                                      alt={professional.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    professional.name.charAt(0).toUpperCase()
                                  )}
                                </div>
                                <span className="font-semibold text-[#1E293B] group-hover:text-[#3B82F6] transition-colors">
                                  {professional.name}
                                </span>
                              </div>
                            </Link>
                          </td>

                          {/* Email */}
                          <td className="py-4 px-6">
                            <div className="text-sm text-[#1E293B]">{professional.email || '-'}</div>
                          </td>

                          {/* Phone */}
                          <td className="py-4 px-6">
                            <a 
                              href={`tel:${professional.phone}`}
                              className="text-[#3B82F6] hover:underline flex items-center gap-1 text-sm"
                            >
                              <Phone className="w-3 h-3" />
                              {professional.phone}
                            </a>
                          </td>

                          {/* Status Badge */}
                          <td className="py-4 px-6">
                            <div className="flex flex-col gap-1">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                professional.is_active 
                                  ? 'bg-[#D1FAE5] text-[#059669]' 
                                  : 'bg-[#F1F5F9] text-[#64748B]'
                              }`}>
                                {professional.is_active ? 'ACTIVE' : 'INACTIVE'}
                              </span>
                              {professional.is_suspended && (
                                <span className="px-3 py-1 bg-[#FEF3C7] text-[#D97706] rounded-full text-xs font-semibold">
                                  SUSPENDED
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Verification */}
                          <td className="py-4 px-6">
                            {professional.is_verified ? (
                              <div className="flex items-center gap-1 text-[#059669]">
                                <CheckCircle className="w-4 h-4" />
                                <span className="text-xs font-semibold">Verified</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-[#F59E0B]">
                                <Clock className="w-4 h-4" />
                                <span className="text-xs font-semibold">Pending</span>
                              </div>
                            )}
                          </td>

                          {/* Joined Date */}
                          <td className="py-4 px-6">
                            <div className="text-sm text-[#64748B]">
                              {new Date(professional.created_at).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <Link href={`/dashboard/manager/professionals/${professional.id}`}>
                                <button className="p-2 text-[#3B82F6] hover:bg-[#EFF6FF] rounded-lg transition-colors" title="View Profile">
                                  <Eye className="w-4 h-4" />
                                </button>
                              </Link>
                              {!professional.is_verified && (
                                <button className="p-2 text-[#10B981] hover:bg-[#D1FAE5] rounded-lg transition-colors" title="Verify">
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                              )}
                              {professional.is_active && (
                                <button className="p-2 text-[#EF4444] hover:bg-[#FEE2E2] rounded-lg transition-colors" title="Suspend">
                                  <Ban className="w-4 h-4" />
                                </button>
                              )}
                              <button className="p-2 text-[#8B5CF6] hover:bg-[#F3E8FF] rounded-lg transition-colors" title="Message">
                                <MessageSquare className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                </>
                )}

                {/* Pagination */}
                {!loading && !error && filteredProfessionals.length > 0 && (
                <div className="border-t border-[#E2E8F0] px-6 py-4 flex items-center justify-between">
                  <div className="text-sm text-[#64748B]">
                    Showing <span className="font-semibold text-[#1E293B]">{filteredProfessionals.length}</span> of <span className="font-semibold text-[#1E293B]">{professionals.length}</span> professionals
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-4 py-2 border border-[#E2E8F0] text-[#64748B] rounded-lg hover:bg-[#F8FAFC] transition-colors text-sm font-medium">
                      Previous
                    </button>
                    <button className="px-4 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors text-sm font-medium">
                      Next
                    </button>
                  </div>
                </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
