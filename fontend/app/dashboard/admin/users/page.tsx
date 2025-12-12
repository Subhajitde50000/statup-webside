'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Users as UsersIcon, 
  CheckCircle, 
  XCircle, 
  Clock,
  Eye,
  Edit,
  Ban,
  Trash2,
  MoreVertical,
  MapPin,
  Phone,
  Mail,
  Plus,
  Bell,
  Settings as SettingsIcon,
  User as UserIcon
} from 'lucide-react';
import Link from 'next/link';
import UserProfileDrawer from './components/UserProfileDrawer';
import AdminSidebar from '../components/AdminSidebar';

interface User {
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
}

export default function UsersManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedVerification, setSelectedVerification] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);

  // Mock data
  const users: User[] = [
    {
      id: '1',
      photo: '/avatars/user1.jpg',
      name: 'Rahul Sharma',
      email: 'rahulsharma@gmail.com',
      phone: '+91 98765 43210',
      location: 'Mumbai, Maharashtra',
      status: 'active',
      verified: true,
      totalBookings: 45,
      walletBalance: 450,
    },
    {
      id: '2',
      photo: '/avatars/user2.jpg',
      name: 'Priya Patel',
      email: 'priya.patel@gmail.com',
      phone: '+91 98765 43211',
      location: 'Delhi, Delhi',
      status: 'active',
      verified: true,
      totalBookings: 28,
      walletBalance: 320,
    },
    {
      id: '3',
      photo: '/avatars/user3.jpg',
      name: 'Amit Kumar',
      email: 'amit.k@gmail.com',
      phone: '+91 98765 43212',
      location: 'Bangalore, Karnataka',
      status: 'pending',
      verified: false,
      totalBookings: 2,
      walletBalance: 0,
    },
    {
      id: '4',
      photo: '/avatars/user4.jpg',
      name: 'Sneha Gupta',
      email: 'sneha.gupta@gmail.com',
      phone: '+91 98765 43213',
      location: 'Chennai, Tamil Nadu',
      status: 'suspended',
      verified: true,
      totalBookings: 15,
      walletBalance: 150,
    },
  ];

  const stats = {
    total: 12450,
    active: 10900,
    suspended: 240,
    pendingVerification: 310,
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
            <XCircle className="w-3 h-3" />
            <span>Suspended</span>
          </span>
        );
    }
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
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
                {/* Notifications */}
                <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Settings */}
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <SettingsIcon className="w-5 h-5 text-gray-600" />
                </button>

                {/* Quick Create */}
                <Link
                  href="/dashboard/admin/users/add"
                  className="px-4 py-2 bg-gradient-to-r from-[#4C5BF5] to-[#8B5CF6] text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm font-medium">Quick Create</span>
                </Link>

                {/* Admin Profile */}
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
        <h1 className="text-3xl font-bold text-[#0B0F19] mb-2">Users Management</h1>
        <p className="text-[#6B7280]">Manage all customer accounts in the system</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Users */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8ECF2]">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-[#1A73E8]/10 rounded-xl flex items-center justify-center">
              <UsersIcon className="w-6 h-6 text-[#1A73E8]" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-[#0B0F19] mb-1">{stats.total.toLocaleString()}</h3>
          <p className="text-sm text-[#6B7280]">Total registered customers</p>
        </div>

        {/* Active Users */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8ECF2]">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-[#00C853]/10 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-[#00C853]" />
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-[#00C853] rounded-full animate-pulse"></div>
              <span className="text-xs text-[#00C853] font-medium">Online</span>
            </div>
          </div>
          <h3 className="text-3xl font-bold text-[#0B0F19] mb-1">{stats.active.toLocaleString()}</h3>
          <p className="text-sm text-[#6B7280]">Active users</p>
        </div>

        {/* Suspended Users */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8ECF2]">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-[#D32F2F]/10 rounded-xl flex items-center justify-center">
              <Ban className="w-6 h-6 text-[#D32F2F]" />
            </div>
            <span className="px-2 py-1 bg-[#FEE2E2] text-[#D32F2F] rounded-lg text-xs font-bold">Alert</span>
          </div>
          <h3 className="text-3xl font-bold text-[#0B0F19] mb-1">{stats.suspended.toLocaleString()}</h3>
          <p className="text-sm text-[#6B7280]">Suspended users</p>
        </div>

        {/* Pending Verification */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8ECF2]">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-[#FFAB00]/10 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-[#FFAB00]" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-[#0B0F19] mb-1">{stats.pendingVerification.toLocaleString()}</h3>
          <p className="text-sm text-[#6B7280]">Pending verification</p>
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
              placeholder="Search by name, phone, email, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#F5F7FA] border border-transparent rounded-xl text-[#0B0F19] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#1A73E8] focus:bg-white transition-all"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            {/* Filters */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-3 bg-[#F5F7FA] hover:bg-[#E8ECF2] rounded-xl transition-colors"
            >
              <Filter className="w-5 h-5 text-[#6B7280]" />
              <span className="font-medium text-[#0B0F19]">Filters</span>
            </button>

            {/* Export */}
            <div className="relative group">
              <button className="flex items-center space-x-2 px-4 py-3 bg-[#1A73E8] hover:bg-[#1557B0] text-white rounded-xl transition-colors">
                <Download className="w-5 h-5" />
                <span className="font-medium">Export</span>
              </button>
              
              {/* Export Dropdown */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-[#E8ECF2] py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                <button className="w-full px-4 py-2 text-left hover:bg-[#F5F7FA] text-[#0B0F19] transition-colors">
                  Export as CSV
                </button>
                <button className="w-full px-4 py-2 text-left hover:bg-[#F5F7FA] text-[#0B0F19] transition-colors">
                  Export as Excel
                </button>
              </div>
            </div>

            {/* Add User */}
            <Link
              href="/dashboard/admin/users/add"
              className="flex items-center space-x-2 px-4 py-3 bg-[#6C63FF] hover:bg-[#5A52D5] text-white rounded-xl transition-colors"
            >
              <span className="font-medium">+ Add User</span>
            </Link>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-[#E8ECF2] grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 bg-[#F5F7FA] border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A73E8]"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="pending">Pending</option>
            </select>

            <select
              value={selectedVerification}
              onChange={(e) => setSelectedVerification(e.target.value)}
              className="px-4 py-2 bg-[#F5F7FA] border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A73E8]"
            >
              <option value="all">All Verification</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
            </select>

            <select className="px-4 py-2 bg-[#F5F7FA] border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A73E8]">
              <option value="all">All Cities</option>
              <option value="mumbai">Mumbai</option>
              <option value="delhi">Delhi</option>
              <option value="bangalore">Bangalore</option>
            </select>

            <select className="px-4 py-2 bg-[#F5F7FA] border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A73E8]">
              <option value="all">Signup Date</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E8ECF2] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F5F7FA] border-b border-[#E8ECF2]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                  Verification
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                  Bookings
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                  Wallet
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8ECF2]">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-[#F5F7FA] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#1A73E8] to-[#6C63FF] rounded-full flex items-center justify-center text-white font-semibold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-[#0B0F19]">{user.name}</p>
                        <p className="text-sm text-[#6B7280]">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2 text-sm text-[#6B7280]">
                      <Phone className="w-4 h-4" />
                      <span>{user.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2 text-sm text-[#6B7280]">
                      <MapPin className="w-4 h-4" />
                      <span>{user.location}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(user.status)}
                  </td>
                  <td className="px-6 py-4">
                    {user.verified ? (
                      <span className="inline-flex items-center space-x-1 text-[#00C853] text-sm font-medium">
                        <CheckCircle className="w-4 h-4" />
                        <span>Verified</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 text-[#D32F2F] text-sm font-medium">
                        <XCircle className="w-4 h-4" />
                        <span>Not Verified</span>
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-[#0B0F19]">{user.totalBookings}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-[#0B0F19]">₹{user.walletBalance}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewUser(user)}
                        className="p-2 hover:bg-[#1A73E8]/10 text-[#1A73E8] rounded-lg transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <Link
                        href={`/dashboard/admin/users/edit/${user.id}`}
                        className="p-2 hover:bg-[#6C63FF]/10 text-[#6C63FF] rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        className="p-2 hover:bg-[#FFAB00]/10 text-[#FFAB00] rounded-lg transition-colors"
                        title="Suspend"
                      >
                        <Ban className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 hover:bg-[#D32F2F]/10 text-[#D32F2F] rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-[#E8ECF2] text-[#6B7280] rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
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
            Showing <span className="font-semibold">1-10</span> of <span className="font-semibold">12,450</span> users
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

      {/* User Profile Drawer */}
      {showDrawer && selectedUser && (
        <UserProfileDrawer
          user={selectedUser}
          onClose={() => setShowDrawer(false)}
        />
      )}
          </div>
        </div>
      </div>
    </div>
  );
}
