'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Download, 
  AlertTriangle,
  Ban,
  Clock,
  User,
  Calendar,
  MessageSquare,
  CheckCircle,
  XCircle,
  RefreshCw,
  Trash2,
  Shield,
  FileText,
  Plus,
  Bell,
  Settings as SettingsIcon,
  User as UserIcon
} from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';

interface SuspendedUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  suspendedDate: string;
  reason: string;
  duration: string;
  expiryDate: string;
  suspendedBy: string;
  suspendedByRole: string;
  appealStatus: 'none' | 'pending' | 'approved' | 'rejected';
  appealDate?: string;
  severity: 'low' | 'medium' | 'high' | 'permanent';
  previousSuspensions: number;
  lastActivity: string;
}

export default function SuspendedUsersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReason, setSelectedReason] = useState('all');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [selectedAppeal, setSelectedAppeal] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Mock suspended users data
  const suspendedUsers: SuspendedUser[] = [
    {
      id: 'U001',
      name: 'Rahul Sharma',
      email: 'rahul.sharma@email.com',
      phone: '+91 98765 43210',
      avatar: 'RS',
      suspendedDate: '2024-01-15',
      reason: 'Multiple customer complaints',
      duration: '30 days',
      expiryDate: '2024-02-14',
      suspendedBy: 'Admin Kumar',
      suspendedByRole: 'Senior Admin',
      appealStatus: 'pending',
      appealDate: '2024-01-18',
      severity: 'high',
      previousSuspensions: 2,
      lastActivity: '2024-01-14'
    },
    {
      id: 'U002',
      name: 'Priya Patel',
      email: 'priya.patel@email.com',
      phone: '+91 98765 43211',
      avatar: 'PP',
      suspendedDate: '2024-01-10',
      reason: 'Payment fraud attempt',
      duration: 'Permanent',
      expiryDate: 'Never',
      suspendedBy: 'System Auto',
      suspendedByRole: 'Automated System',
      appealStatus: 'rejected',
      appealDate: '2024-01-12',
      severity: 'permanent',
      previousSuspensions: 0,
      lastActivity: '2024-01-09'
    },
    {
      id: 'U003',
      name: 'Amit Singh',
      email: 'amit.singh@email.com',
      phone: '+91 98765 43212',
      avatar: 'AS',
      suspendedDate: '2024-01-20',
      reason: 'Abusive behavior',
      duration: '7 days',
      expiryDate: '2024-01-27',
      suspendedBy: 'Admin Verma',
      suspendedByRole: 'Support Admin',
      appealStatus: 'none',
      severity: 'medium',
      previousSuspensions: 1,
      lastActivity: '2024-01-19'
    },
    {
      id: 'U004',
      name: 'Sneha Reddy',
      email: 'sneha.reddy@email.com',
      phone: '+91 98765 43213',
      avatar: 'SR',
      suspendedDate: '2024-01-22',
      reason: 'Policy violation',
      duration: '14 days',
      expiryDate: '2024-02-05',
      suspendedBy: 'Admin Kumar',
      suspendedByRole: 'Senior Admin',
      appealStatus: 'approved',
      appealDate: '2024-01-23',
      severity: 'low',
      previousSuspensions: 0,
      lastActivity: '2024-01-21'
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-yellow-600 bg-yellow-50';
      case 'medium': return 'text-orange-600 bg-orange-50';
      case 'high': return 'text-red-600 bg-red-50';
      case 'permanent': return 'text-gray-900 bg-gray-200';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getAppealStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-blue-600 bg-blue-50';
      case 'approved': return 'text-green-600 bg-green-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getAppealStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
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
                <button
                  onClick={() => router.back()}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-xl font-bold text-[#0B0F19]">Suspended Users</h1>
                  <p className="text-xs text-gray-600">Manage suspended accounts</p>
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

        {/* Page Header */}
        <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-[#0B0F19]">Suspended Users</h1>
                <p className="text-sm text-gray-600 mt-1">Manage suspended accounts and appeals</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-50 rounded-lg">
                <Ban className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Total Suspended</p>
            <p className="text-3xl font-bold text-[#0B0F19]">240</p>
            <p className="text-xs text-red-600 mt-2">↑ 12 this week</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Pending Appeals</p>
            <p className="text-3xl font-bold text-[#0B0F19]">18</p>
            <p className="text-xs text-blue-600 mt-2">Requires action</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-50 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Expiring Soon</p>
            <p className="text-3xl font-bold text-[#0B0F19]">45</p>
            <p className="text-xs text-orange-600 mt-2">Within 7 days</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <Shield className="w-6 h-6 text-gray-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Permanent Bans</p>
            <p className="text-3xl font-bold text-[#0B0F19]">67</p>
            <p className="text-xs text-gray-600 mt-2">No expiry</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl border border-gray-200 mb-6">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or reason..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A73E8] focus:border-transparent"
                />
              </div>

              {/* Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
            </div>

            {/* Filter Dropdowns */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                  <select
                    value={selectedReason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A73E8] focus:border-transparent"
                  >
                    <option value="all">All Reasons</option>
                    <option value="complaints">Customer Complaints</option>
                    <option value="fraud">Payment Fraud</option>
                    <option value="abuse">Abusive Behavior</option>
                    <option value="policy">Policy Violation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                  <select
                    value={selectedDuration}
                    onChange={(e) => setSelectedDuration(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A73E8] focus:border-transparent"
                  >
                    <option value="all">All Durations</option>
                    <option value="temporary">Temporary</option>
                    <option value="permanent">Permanent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Appeal Status</label>
                  <select
                    value={selectedAppeal}
                    onChange={(e) => setSelectedAppeal(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A73E8] focus:border-transparent"
                  >
                    <option value="all">All Appeals</option>
                    <option value="none">No Appeal</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Suspended Users Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Suspended Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Reason</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Suspended By</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Appeal</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Severity</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {suspendedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#1A73E8] to-[#4285F4] rounded-full flex items-center justify-center text-white font-semibold">
                          {user.avatar}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                          <p className="text-xs text-gray-400">{user.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-900">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{new Date(user.suspendedDate).toLocaleDateString()}</span>
                      </div>
                      {user.previousSuspensions > 0 && (
                        <p className="text-xs text-orange-600 mt-1">
                          {user.previousSuspensions} previous suspension(s)
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{user.reason}</p>
                      <p className="text-xs text-gray-500 mt-1">ID: {user.id}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.duration}</p>
                        {user.expiryDate !== 'Never' && (
                          <p className="text-xs text-gray-500 mt-1">Until {new Date(user.expiryDate).toLocaleDateString()}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-900">{user.suspendedBy}</p>
                          <p className="text-xs text-gray-500">{user.suspendedByRole}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full ${getAppealStatusColor(user.appealStatus)}`}>
                        {getAppealStatusIcon(user.appealStatus)}
                        <span className="text-xs font-medium capitalize">{user.appealStatus}</span>
                      </div>
                      {user.appealDate && (
                        <p className="text-xs text-gray-500 mt-1">{new Date(user.appealDate).toLocaleDateString()}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize ${getSeverityColor(user.severity)}`}>
                        {user.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          className="p-2 hover:bg-green-50 rounded-lg transition-colors group"
                          title="Reactivate"
                        >
                          <RefreshCw className="w-4 h-4 text-gray-400 group-hover:text-green-600" />
                        </button>
                        <button
                          className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                          title="Extend Suspension"
                        >
                          <Clock className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                        </button>
                        <button
                          className="p-2 hover:bg-purple-50 rounded-lg transition-colors group"
                          title="View Details"
                        >
                          <FileText className="w-4 h-4 text-gray-400 group-hover:text-purple-600" />
                        </button>
                        {user.severity !== 'permanent' && (
                          <button
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                            title="Permanent Delete"
                          >
                            <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-600" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing <span className="font-medium">1-4</span> of <span className="font-medium">240</span> suspended users
            </p>
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                Previous
              </button>
              <button className="px-4 py-2 bg-[#1A73E8] text-white rounded-lg text-sm hover:bg-[#1557B0] transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
        </div>
        </div>
      </div>
    </div>
  );
}
