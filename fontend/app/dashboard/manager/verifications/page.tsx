'use client';

import React, { useState } from 'react';
import { 
  Shield, Eye, CheckCircle, XCircle, Clock, AlertTriangle, 
  User, Store, Search, Filter, Download
} from 'lucide-react';
import Link from 'next/link';
import TopNavbar from '../components/TopNavbar';
import LeftSidebar from '../components/LeftSidebar';

export default function VerificationsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const verifications = [
    {
      id: 'PRO12345',
      name: 'Rajesh Kumar Singh',
      type: 'Professional',
      category: 'Electrician',
      status: 'Pending',
      submittedOn: '2024-12-05',
      phone: '+91 98765 43210',
      riskScore: 'Low',
      documentsCount: 5,
    },
    {
      id: 'SHP67890',
      name: 'Quick Electronics Store',
      type: 'Shop',
      category: 'Electronics',
      status: 'Pending',
      submittedOn: '2024-12-06',
      phone: '+91 98765 11111',
      riskScore: 'Medium',
      documentsCount: 6,
    },
    {
      id: 'PRO23456',
      name: 'Amit Sharma',
      type: 'Professional',
      category: 'Plumber',
      status: 'Approved',
      submittedOn: '2024-12-04',
      phone: '+91 98765 22222',
      riskScore: 'Low',
      documentsCount: 5,
    },
    {
      id: 'PRO34567',
      name: 'Priya Patel',
      type: 'Professional',
      category: 'Carpenter',
      status: 'Rejected',
      submittedOn: '2024-12-03',
      phone: '+91 98765 33333',
      riskScore: 'High',
      documentsCount: 4,
    },
    {
      id: 'SHP78901',
      name: 'Home Decor Hub',
      type: 'Shop',
      category: 'Furniture',
      status: 'More Info Needed',
      submittedOn: '2024-12-07',
      phone: '+91 98765 44444',
      riskScore: 'Low',
      documentsCount: 5,
    },
  ];

  const stats = [
    { label: 'Pending Reviews', count: 15, color: 'from-[#FED7AA] to-[#FDBA74]', icon: Clock, iconColor: 'text-[#F59E0B]' },
    { label: 'Approved Today', count: 8, color: 'from-[#D1FAE5] to-[#A7F3D0]', icon: CheckCircle, iconColor: 'text-[#10B981]' },
    { label: 'Rejected Today', count: 2, color: 'from-[#FEE2E2] to-[#FECACA]', icon: XCircle, iconColor: 'text-[#EF4444]' },
    { label: 'High Risk', count: 3, color: 'from-[#FEE2E2] to-[#FECACA]', icon: AlertTriangle, iconColor: 'text-[#EF4444]' },
  ];

  const filteredVerifications = verifications.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         v.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || v.status === filterStatus;
    const matchesType = filterType === 'all' || v.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      <TopNavbar />
      <div className="flex">
        <LeftSidebar isOpen={sidebarOpen} />
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
          <div className="p-8">
            <div className="max-w-[1600px] mx-auto">
              {/* Header */}
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#1E293B] mb-2 flex items-center gap-3">
                  <Shield className="w-8 h-8 text-[#0AA06E]" />
                  Verification Center
                </h1>
                <p className="text-sm text-[#64748B]">Review and approve professional and shop registrations</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className={`bg-gradient-to-br ${stat.color} rounded-xl p-6 border border-white/20 shadow-sm`}>
                      <div className="flex items-center justify-between mb-2">
                        <Icon className={`w-8 h-8 ${stat.iconColor}`} />
                        <span className="text-3xl font-bold text-[#1E293B]">{stat.count}</span>
                      </div>
                      <p className="text-sm font-medium text-[#64748B]">{stat.label}</p>
                    </div>
                  );
                })}
              </div>

              {/* Filters */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 mb-6 shadow-sm">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex-1 min-w-[250px]">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                      <input
                        type="text"
                        placeholder="Search by name or ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0AA06E]"
                      />
                    </div>
                  </div>

                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0AA06E]"
                  >
                    <option value="all">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                    <option value="More Info Needed">More Info Needed</option>
                  </select>

                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0AA06E]"
                  >
                    <option value="all">All Types</option>
                    <option value="Professional">Professional</option>
                    <option value="Shop">Shop</option>
                  </select>

                  <button className="px-4 py-2 bg-[#0AA06E] text-white rounded-lg hover:bg-[#098F5E] transition-colors flex items-center gap-2 text-sm font-medium">
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                </div>
              </div>

              {/* Verifications Table */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">ID</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Type</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Category</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Risk Score</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Documents</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Submitted On</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0]">
                      {filteredVerifications.map((verification) => (
                        <tr key={verification.id} className="hover:bg-[#F8FAFC] transition-colors">
                          <td className="px-4 py-4">
                            <span className="text-sm font-mono text-[#0AA06E] font-medium">{verification.id}</span>
                          </td>
                          <td className="px-4 py-4">
                            <div>
                              <p className="text-sm font-medium text-[#1E293B]">{verification.name}</p>
                              <p className="text-xs text-[#64748B]">{verification.phone}</p>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                              verification.type === 'Professional' ? 'bg-[#E9D5FF] text-[#6B21A8]' : 'bg-[#FED7AA] text-[#9A3412]'
                            }`}>
                              {verification.type === 'Professional' ? <User className="w-3 h-3" /> : <Store className="w-3 h-3" />}
                              {verification.type}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-sm text-[#1E293B]">{verification.category}</span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              verification.status === 'Approved' ? 'bg-[#D1FAE5] text-[#065F46]' :
                              verification.status === 'Rejected' ? 'bg-[#FEE2E2] text-[#991B1B]' :
                              verification.status === 'Pending' ? 'bg-[#FEF3C7] text-[#92400E]' :
                              'bg-[#DBEAFE] text-[#1E40AF]'
                            }`}>
                              {verification.status}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${
                              verification.riskScore === 'High' ? 'bg-[#FEE2E2] text-[#991B1B] border-[#EF4444]' :
                              verification.riskScore === 'Medium' ? 'bg-[#FED7AA] text-[#9A3412] border-[#F59E0B]' :
                              'bg-[#D1FAE5] text-[#065F46] border-[#10B981]'
                            }`}>
                              {verification.riskScore}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-sm text-[#64748B]">{verification.documentsCount} docs</span>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-sm text-[#64748B]">{verification.submittedOn}</span>
                          </td>
                          <td className="px-4 py-4">
                            <Link href={`/dashboard/manager/verification/${verification.id}`}>
                              <button className="px-4 py-2 bg-[#0AA06E] text-white rounded-lg hover:bg-[#098F5E] transition-colors flex items-center gap-2 text-sm font-medium">
                                <Eye className="w-4 h-4" />
                                Review
                              </button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-[#E2E8F0] flex items-center justify-between">
                  <p className="text-sm text-[#64748B]">
                    Showing <span className="font-medium text-[#1E293B]">1</span> to{' '}
                    <span className="font-medium text-[#1E293B]">{filteredVerifications.length}</span> of{' '}
                    <span className="font-medium text-[#1E293B]">{verifications.length}</span> verifications
                  </p>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm font-medium text-[#64748B] hover:bg-[#F8FAFC] transition-colors">
                      Previous
                    </button>
                    <button className="px-4 py-2 bg-[#0AA06E] text-white rounded-lg text-sm font-medium hover:bg-[#098F5E] transition-colors">
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
