'use client';

import React, { useState } from 'react';
import { 
  Search, Filter, Download, Eye, CheckCircle, XCircle, Clock,
  AlertTriangle, Building, Phone, Mail, RefreshCw, FileText
} from 'lucide-react';
import Link from 'next/link';
import TopNavbar from '../../components/TopNavbar';
import LeftSidebar from '../../components/LeftSidebar';

export default function SettlementsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [cycleFilter, setCycleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const stats = {
    pendingSettlements: 34,
    totalPendingAmount: 456000,
    settledToday: 18,
    settledAmount: 324000,
  };

  const settlements = [
    {
      settlementId: 'SET20241210001',
      vendor: { name: 'ElectroWorld Pro', type: 'Shop', phone: '+91 98765 11111', email: 'electroworld@shop.com' },
      amountToSettle: 45000,
      ordersCount: 12,
      commissionDeducted: 5400,
      commissionPercentage: 12,
      bankDetails: { method: 'Bank Transfer', account: 'HDFC ***4567' },
      status: 'Pending',
      cycle: 'Daily',
      dueDate: '2024-12-11',
    },
    {
      settlementId: 'SET20241210002',
      vendor: { name: 'Quick Repairs', type: 'Professional', phone: '+91 98765 22222', email: 'quick@repairs.com' },
      amountToSettle: 32000,
      ordersCount: 8,
      commissionDeducted: 3840,
      commissionPercentage: 12,
      bankDetails: { method: 'UPI', account: 'quickrepairs@paytm' },
      status: 'Approved',
      cycle: 'Weekly',
      dueDate: '2024-12-10',
    },
    {
      settlementId: 'SET20241210003',
      vendor: { name: 'Fresh Mart Groceries', type: 'Shop', phone: '+91 98765 33333', email: 'freshmart@shop.com' },
      amountToSettle: 67000,
      ordersCount: 24,
      commissionDeducted: 8040,
      commissionPercentage: 12,
      bankDetails: { method: 'Bank Transfer', account: 'ICICI ***8901' },
      status: 'Settled',
      cycle: 'Daily',
      dueDate: '2024-12-10',
    },
    {
      settlementId: 'SET20241210004',
      vendor: { name: 'Home Services', type: 'Professional', phone: '+91 98765 44444', email: 'home@services.com' },
      amountToSettle: 28000,
      ordersCount: 6,
      commissionDeducted: 3360,
      commissionPercentage: 12,
      bankDetails: { method: 'UPI', account: 'homeservices@oksbi' },
      status: 'Hold',
      cycle: 'Weekly',
      dueDate: '2024-12-15',
    },
    {
      settlementId: 'SET20241210005',
      vendor: { name: 'Tasty Bites Restaurant', type: 'Shop', phone: '+91 98765 55555', email: 'tasty@bites.com' },
      amountToSettle: 54000,
      ordersCount: 18,
      commissionDeducted: 6480,
      commissionPercentage: 12,
      bankDetails: { method: 'Bank Transfer', account: 'SBI ***2345' },
      status: 'Failed',
      cycle: 'Daily',
      dueDate: '2024-12-10',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Settled': return 'bg-[#D1FAE5] text-[#065F46]';
      case 'Approved': return 'bg-[#DBEAFE] text-[#1E40AF]';
      case 'Pending': return 'bg-[#FEF3C7] text-[#92400E]';
      case 'Hold': return 'bg-[#E9D5FF] text-[#6B21A8]';
      case 'Failed': return 'bg-[#FEE2E2] text-[#991B1B]';
      default: return 'bg-[#F1F5F9] text-[#475569]';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Settled': return <CheckCircle className="w-4 h-4" />;
      case 'Approved': return <CheckCircle className="w-4 h-4" />;
      case 'Pending': return <Clock className="w-4 h-4" />;
      case 'Hold': return <AlertTriangle className="w-4 h-4" />;
      case 'Failed': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <TopNavbar />
      <div className="flex">
        <LeftSidebar isOpen={sidebarOpen} />
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
          <div className="p-8">
            <div className="max-w-[1600px] mx-auto">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-semibold text-[#1E293B] mb-2">Settlements Management</h1>
                    <p className="text-[#64748B] text-sm">Manage payouts to shops and professionals</p>
                  </div>
                  <button className="px-4 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors flex items-center gap-2 text-sm font-medium">
                    <Download className="w-4 h-4" />
                    Export Report
                  </button>
                </div>
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Clock className="w-8 h-8 opacity-80" />
                    <AlertTriangle className="w-5 h-5 opacity-80" />
                  </div>
                  <h3 className="text-3xl font-bold mb-1">{stats.pendingSettlements}</h3>
                  <p className="text-sm opacity-90">Pending Settlements</p>
                  <p className="text-xs opacity-75 mt-2">Requires action</p>
                </div>

                <div className="bg-gradient-to-br from-[#EF4444] to-[#DC2626] rounded-xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Building className="w-8 h-8 opacity-80" />
                  </div>
                  <h3 className="text-3xl font-bold mb-1">₹{(stats.totalPendingAmount / 1000).toFixed(0)}K</h3>
                  <p className="text-sm opacity-90">Pending Amount</p>
                  <p className="text-xs opacity-75 mt-2">Total to be settled</p>
                </div>

                <div className="bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <CheckCircle className="w-8 h-8 opacity-80" />
                  </div>
                  <h3 className="text-3xl font-bold mb-1">{stats.settledToday}</h3>
                  <p className="text-sm opacity-90">Settled Today</p>
                  <p className="text-xs opacity-75 mt-2">Successful payouts</p>
                </div>

                <div className="bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <FileText className="w-8 h-8 opacity-80" />
                  </div>
                  <h3 className="text-3xl font-bold mb-1">₹{(stats.settledAmount / 1000).toFixed(0)}K</h3>
                  <p className="text-sm opacity-90">Settled Amount</p>
                  <p className="text-xs opacity-75 mt-2">Total paid today</p>
                </div>
              </div>

              {/* Filters */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 mb-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#64748B] w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search by shop/professional name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                    />
                  </div>

                  <select
                    value={cycleFilter}
                    onChange={(e) => setCycleFilter(e.target.value)}
                    className="px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  >
                    <option value="all">All Cycles</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="settled">Settled</option>
                    <option value="hold">On Hold</option>
                    <option value="failed">Failed</option>
                  </select>

                  <select
                    className="px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  >
                    <option value="all">All Payment Modes</option>
                    <option value="bank">Bank Transfer</option>
                    <option value="upi">UPI</option>
                  </select>
                </div>
              </div>

              {/* Auto-Settlement System Section */}
              <div className="bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] rounded-xl border border-[#3B82F6]/20 p-6 mb-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-[#1E293B] mb-2 flex items-center gap-2">
                      <RefreshCw className="w-5 h-5 text-[#3B82F6]" />
                      Auto-Settlement System
                    </h2>
                    <p className="text-sm text-[#64748B] mb-4">Automated daily payouts with fraud detection and verification</p>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-white rounded-lg p-3 border border-[#E2E8F0]">
                        <p className="text-xs text-[#64748B] mb-1">Next Auto-Settlement</p>
                        <p className="text-sm font-semibold text-[#1E293B]">Tomorrow 2:00 AM</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-[#E2E8F0]">
                        <p className="text-xs text-[#64748B] mb-1">Fraud Detection</p>
                        <span className="inline-block px-2 py-1 bg-[#D1FAE5] text-[#065F46] rounded text-xs font-medium">Active</span>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-[#E2E8F0]">
                        <p className="text-xs text-[#64748B] mb-1">Verified Vendors</p>
                        <p className="text-sm font-semibold text-[#1E293B]">156 vendors</p>
                      </div>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors flex items-center gap-2 text-sm font-medium">
                    <RefreshCw className="w-4 h-4" />
                    Configure Auto-Settlement
                  </button>
                </div>
              </div>

              {/* Settlements Table */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] sticky top-0">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Settlement ID</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Shop/Professional</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Orders</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Commission</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Bank/UPI</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Cycle</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Due Date</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0]">
                      {settlements.map((settlement) => (
                        <tr key={settlement.settlementId} className="hover:bg-[#F8FAFC] transition-colors">
                          <td className="px-6 py-4">
                            <span className="text-sm font-mono text-[#3B82F6] font-medium">{settlement.settlementId}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-sm font-medium text-[#1E293B] flex items-center gap-2">
                                {settlement.vendor.name}
                                <span className="px-2 py-0.5 bg-[#F1F5F9] text-[#64748B] rounded text-xs">
                                  {settlement.vendor.type}
                                </span>
                              </p>
                              <a href={`tel:${settlement.vendor.phone}`} className="text-xs text-[#3B82F6] hover:underline flex items-center gap-1 mt-1">
                                <Phone className="w-3 h-3" />
                                {settlement.vendor.phone}
                              </a>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-bold text-[#10B981]">₹{settlement.amountToSettle.toLocaleString()}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-medium text-[#1E293B]">{settlement.ordersCount} orders</span>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-sm font-medium text-[#EF4444]">₹{settlement.commissionDeducted.toLocaleString()}</p>
                              <p className="text-xs text-[#64748B]">({settlement.commissionPercentage}%)</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-sm font-medium text-[#1E293B]">{settlement.bankDetails.method}</p>
                              <p className="text-xs text-[#64748B] font-mono">{settlement.bankDetails.account}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 bg-[#F1F5F9] text-[#64748B] rounded text-xs font-medium">
                              {settlement.cycle}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${getStatusColor(settlement.status)}`}>
                              {getStatusIcon(settlement.status)}
                              {settlement.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-[#64748B]">{settlement.dueDate}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button className="p-2 text-[#3B82F6] hover:bg-[#EFF6FF] rounded-lg transition-colors" title="View Details">
                                <Eye className="w-4 h-4" />
                              </button>
                              {settlement.status === 'Pending' && (
                                <>
                                  <button className="px-3 py-1.5 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-colors text-xs font-medium">
                                    Approve
                                  </button>
                                  <button className="px-3 py-1.5 bg-[#F59E0B] text-white rounded-lg hover:bg-[#D97706] transition-colors text-xs font-medium">
                                    Hold
                                  </button>
                                </>
                              )}
                              {settlement.status === 'Failed' && (
                                <button className="px-3 py-1.5 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors text-xs font-medium flex items-center gap-1">
                                  <RefreshCw className="w-3 h-3" />
                                  Retry
                                </button>
                              )}
                              {settlement.status === 'Settled' && (
                                <button className="p-2 text-[#64748B] hover:bg-[#F8FAFC] rounded-lg transition-colors" title="Download Report">
                                  <Download className="w-4 h-4" />
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
                <div className="px-6 py-4 border-t border-[#E2E8F0] flex items-center justify-between">
                  <p className="text-sm text-[#64748B]">Showing 1 to 5 of 34 settlements</p>
                  <div className="flex items-center gap-2">
                    <button className="px-4 py-2 border border-[#E2E8F0] text-[#64748B] rounded-lg hover:bg-[#F8FAFC] transition-colors text-sm">
                      Previous
                    </button>
                    <button className="px-4 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors text-sm">
                      1
                    </button>
                    <button className="px-4 py-2 border border-[#E2E8F0] text-[#64748B] rounded-lg hover:bg-[#F8FAFC] transition-colors text-sm">
                      2
                    </button>
                    <button className="px-4 py-2 border border-[#E2E8F0] text-[#64748B] rounded-lg hover:bg-[#F8FAFC] transition-colors text-sm">
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
