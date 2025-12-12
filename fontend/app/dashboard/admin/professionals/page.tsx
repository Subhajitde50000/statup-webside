'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Filter, 
  Download, 
  Users,
  CheckCircle,
  Clock,
  Ban,
  Eye,
  Shield,
  FileText,
  History,
  DollarSign,
  AlertTriangle,
  Star,
  MapPin,
  Phone,
  Award,
  Plus,
  Bell,
  Settings as SettingsIcon,
  User as UserIcon
} from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import ProfessionalProfileDrawer from './components/ProfessionalProfileDrawer';

interface Professional {
  id: string;
  photo: string;
  name: string;
  category: string;
  phone: string;
  city: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  online: boolean;
  jobsCompleted: number;
  totalEarnings: number;
  status: 'active' | 'pending' | 'suspended';
}

export default function ProfessionalsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedVerification, setSelectedVerification] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);

  // Mock data
  const professionals: Professional[] = [
    {
      id: 'P001',
      photo: '/professionals/1.jpg',
      name: 'Rahul Das',
      category: 'Electrician',
      phone: '+91 98765 43210',
      city: 'Mumbai',
      rating: 4.7,
      reviewCount: 315,
      verified: true,
      online: true,
      jobsCompleted: 295,
      totalEarnings: 145000,
      status: 'active'
    },
    {
      id: 'P002',
      photo: '/professionals/2.jpg',
      name: 'Amit Kumar',
      category: 'Plumber',
      phone: '+91 98765 43211',
      city: 'Delhi',
      rating: 4.9,
      reviewCount: 428,
      verified: true,
      online: false,
      jobsCompleted: 410,
      totalEarnings: 198000,
      status: 'active'
    },
    {
      id: 'P003',
      photo: '/professionals/3.jpg',
      name: 'Suresh Yadav',
      category: 'AC Technician',
      phone: '+91 98765 43212',
      city: 'Bangalore',
      rating: 4.5,
      reviewCount: 187,
      verified: false,
      online: true,
      jobsCompleted: 156,
      totalEarnings: 89000,
      status: 'pending'
    },
    {
      id: 'P004',
      photo: '/professionals/4.jpg',
      name: 'Prakash Singh',
      category: 'Driver',
      phone: '+91 98765 43213',
      city: 'Pune',
      rating: 3.8,
      reviewCount: 95,
      verified: true,
      online: false,
      jobsCompleted: 78,
      totalEarnings: 45000,
      status: 'suspended'
    },
  ];

  const stats = {
    total: 8320,
    pending: 445,
    active: 7500,
    suspended: 125
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-1 bg-[#D1FAE5] text-[#00C853] rounded-full text-xs font-semibold">
            <CheckCircle className="w-3 h-3" />
            <span>Active</span>
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-1 bg-[#FEF3C7] text-[#FFAB00] rounded-full text-xs font-semibold">
            <Clock className="w-3 h-3" />
            <span>Pending</span>
          </span>
        );
      case 'suspended':
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-1 bg-[#FEE2E2] text-[#D32F2F] rounded-full text-xs font-semibold">
            <Ban className="w-3 h-3" />
            <span>Suspended</span>
          </span>
        );
    }
  };

  const handleViewProfile = (professional: Professional) => {
    setSelectedProfessional(professional);
    setShowDrawer(true);
  };

  return (
    <div className="flex h-screen bg-[#F5F7FA] overflow-hidden">
      {/* Admin Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-72 flex flex-col overflow-hidden">
        {/* Top Navigation Bar */}
        <div className="bg-white border-b border-gray-200 flex-shrink-0 z-20">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search across admin panel..."
                    className="w-96 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4C5BF5] focus:border-transparent text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <SettingsIcon className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                  <div className="w-9 h-9 bg-gradient-to-br from-[#10B981] to-[#10B981]/80 rounded-lg flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Admin User</p>
                    <p className="text-xs text-gray-500">Super Admin</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-[#0B0F19] mb-2">Professional Management</h1>
              <p className="text-[#6B7280]">Manage all service professionals in the system</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Professionals */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8ECF2]">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-12 h-12 bg-[#1A73E8]/10 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-[#1A73E8]" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-[#0B0F19] mb-1">{stats.total.toLocaleString()}</h3>
                <p className="text-sm text-[#6B7280]">Total registered</p>
              </div>

              {/* Pending Verification */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8ECF2]">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-12 h-12 bg-[#FFAB00]/10 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-[#FFAB00]" />
                  </div>
                  <span className="px-2 py-1 bg-[#FEF3C7] text-[#FFAB00] rounded-lg text-xs font-bold">Pending</span>
                </div>
                <h3 className="text-3xl font-bold text-[#0B0F19] mb-1">{stats.pending.toLocaleString()}</h3>
                <p className="text-sm text-[#6B7280]">Awaiting verification</p>
              </div>

              {/* Active Professionals */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8ECF2]">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-12 h-12 bg-[#00C853]/10 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-[#00C853]" />
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-[#00C853] rounded-full animate-pulse"></div>
                    <span className="text-xs text-[#00C853] font-medium">Active</span>
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-[#0B0F19] mb-1">{stats.active.toLocaleString()}</h3>
                <p className="text-sm text-[#6B7280]">Active professionals</p>
              </div>

              {/* Suspended/Banned */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8ECF2]">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-12 h-12 bg-[#D32F2F]/10 rounded-xl flex items-center justify-center">
                    <Ban className="w-6 h-6 text-[#D32F2F]" />
                  </div>
                  <span className="px-2 py-1 bg-[#FEE2E2] text-[#D32F2F] rounded-lg text-xs font-bold">Alert</span>
                </div>
                <h3 className="text-3xl font-bold text-[#0B0F19] mb-1">{stats.suspended.toLocaleString()}</h3>
                <p className="text-sm text-[#6B7280]">Suspended / Banned</p>
              </div>
            </div>

            {/* Filters & Actions Bar */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8ECF2] mb-6">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                  <input
                    type="text"
                    placeholder="Search by name, mobile, ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-[#F5F7FA] border border-transparent rounded-xl text-[#0B0F19] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#1A73E8] focus:bg-white transition-all"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center space-x-2 px-4 py-3 bg-[#F5F7FA] hover:bg-[#E8ECF2] rounded-xl transition-colors"
                  >
                    <Filter className="w-5 h-5 text-[#6B7280]" />
                    <span className="font-medium text-[#0B0F19]">Filters</span>
                  </button>

                  <div className="relative group">
                    <button className="flex items-center space-x-2 px-4 py-3 bg-[#1A73E8] hover:bg-[#1557B0] text-white rounded-xl transition-colors">
                      <Download className="w-5 h-5" />
                      <span className="font-medium">Export</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Advanced Filters Panel */}
              {showFilters && (
                <div className="mt-4 pt-4 border-t border-[#E8ECF2] grid grid-cols-1 md:grid-cols-5 gap-4">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 bg-[#F5F7FA] border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A73E8]"
                  >
                    <option value="all">All Categories</option>
                    <option value="electrician">Electrician</option>
                    <option value="plumber">Plumber</option>
                    <option value="driver">Driver</option>
                    <option value="ac_tech">AC Technician</option>
                    <option value="carpenter">Carpenter</option>
                  </select>

                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="px-4 py-2 bg-[#F5F7FA] border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A73E8]"
                  >
                    <option value="all">All Cities</option>
                    <option value="mumbai">Mumbai</option>
                    <option value="delhi">Delhi</option>
                    <option value="bangalore">Bangalore</option>
                    <option value="pune">Pune</option>
                  </select>

                  <select
                    value={selectedVerification}
                    onChange={(e) => setSelectedVerification(e.target.value)}
                    className="px-4 py-2 bg-[#F5F7FA] border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A73E8]"
                  >
                    <option value="all">Verification Status</option>
                    <option value="verified">Verified</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>

                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-4 py-2 bg-[#F5F7FA] border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A73E8]"
                  >
                    <option value="all">Status</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="suspended">Suspended</option>
                  </select>

                  <select className="px-4 py-2 bg-[#F5F7FA] border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A73E8]">
                    <option value="all">Rating</option>
                    <option value="high">High to Low</option>
                    <option value="low">Low to High</option>
                  </select>
                </div>
              )}
            </div>

            {/* Professionals Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#E8ECF2] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#F5F7FA] border-b border-[#E8ECF2]">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                        Professional
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                        City
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                        Rating
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                        Verification
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                        Jobs
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                        Earnings
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8ECF2]">
                    {professionals.map((professional) => (
                      <tr key={professional.id} className="hover:bg-[#F5F7FA] transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="relative">
                              <div className="w-10 h-10 bg-gradient-to-br from-[#1A73E8] to-[#6C63FF] rounded-full flex items-center justify-center text-white font-semibold">
                                {professional.name.charAt(0)}
                              </div>
                              {professional.online && (
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#00C853] border-2 border-white rounded-full"></div>
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-[#0B0F19]">{professional.name}</p>
                              <p className="text-sm text-[#6B7280]">{professional.category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2 text-sm text-[#6B7280]">
                            <Phone className="w-4 h-4" />
                            <span>{professional.phone}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2 text-sm text-[#6B7280]">
                            <MapPin className="w-4 h-4" />
                            <span>{professional.city}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <Star className="w-4 h-4 fill-[#FFAB00] text-[#FFAB00]" />
                            <span className="font-semibold text-[#0B0F19]">{professional.rating}</span>
                            <span className="text-sm text-[#6B7280]">({professional.reviewCount})</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {professional.verified ? (
                            <span className="inline-flex items-center space-x-1 text-[#00C853] text-sm font-medium">
                              <CheckCircle className="w-4 h-4" />
                              <span>Verified</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1 text-[#FFAB00] text-sm font-medium">
                              <Clock className="w-4 h-4" />
                              <span>Pending</span>
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(professional.status)}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-semibold text-[#0B0F19]">{professional.jobsCompleted}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-semibold text-[#00C853]">₹{professional.totalEarnings.toLocaleString()}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleViewProfile(professional)}
                              className="p-2 hover:bg-[#1A73E8]/10 text-[#1A73E8] rounded-lg transition-colors"
                              title="View Profile"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <Link
                              href={`/dashboard/admin/professionals/verify/${professional.id}`}
                              className="p-2 hover:bg-[#00C853]/10 text-[#00C853] rounded-lg transition-colors"
                              title="Verify"
                            >
                              <Shield className="w-4 h-4" />
                            </Link>
                            <Link
                              href={`/dashboard/admin/professionals/documents/${professional.id}`}
                              className="p-2 hover:bg-[#6C63FF]/10 text-[#6C63FF] rounded-lg transition-colors"
                              title="Documents"
                            >
                              <FileText className="w-4 h-4" />
                            </Link>
                            <Link
                              href={`/dashboard/admin/professionals/work-history/${professional.id}`}
                              className="p-2 hover:bg-[#FFAB00]/10 text-[#FFAB00] rounded-lg transition-colors"
                              title="Work History"
                            >
                              <History className="w-4 h-4" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-[#E8ECF2] flex items-center justify-between">
                <p className="text-sm text-[#6B7280]">
                  Showing <span className="font-semibold">1-4</span> of <span className="font-semibold">8,320</span> professionals
                </p>
                <div className="flex items-center space-x-2">
                  <button className="px-4 py-2 bg-[#F5F7FA] hover:bg-[#E8ECF2] text-[#0B0F19] rounded-lg transition-colors">
                    Previous
                  </button>
                  <button className="px-4 py-2 bg-[#1A73E8] text-white rounded-lg">1</button>
                  <button className="px-4 py-2 bg-[#F5F7FA] hover:bg-[#E8ECF2] text-[#0B0F19] rounded-lg transition-colors">2</button>
                  <button className="px-4 py-2 bg-[#F5F7FA] hover:bg-[#E8ECF2] text-[#0B0F19] rounded-lg transition-colors">3</button>
                  <button className="px-4 py-2 bg-[#F5F7FA] hover:bg-[#E8ECF2] text-[#0B0F19] rounded-lg transition-colors">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Profile Drawer */}
      {showDrawer && selectedProfessional && (
        <ProfessionalProfileDrawer
          professional={selectedProfessional}
          onClose={() => setShowDrawer(false)}
        />
      )}
    </div>
  );
}
