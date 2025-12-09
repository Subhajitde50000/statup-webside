'use client';

import React, { useState } from 'react';
import { 
  Search, Filter, Wallet, TrendingUp, Gift, Clock, DollarSign,
  Plus, Minus, Lock, Eye, Phone, Mail, Download, Calendar
} from 'lucide-react';
import Link from 'next/link';
import TopNavbar from '../../components/TopNavbar';
import LeftSidebar from '../../components/LeftSidebar';

export default function WalletManagementPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [transactionTypeFilter, setTransactionTypeFilter] = useState('all');

  const stats = {
    totalWalletBalance: 2456000,
    activeWallets: 1245,
    expiredCashback: 12000,
    upcomingCashback: 45000,
  };

  const walletTransactions = [
    {
      walletId: 'WAL20241210001',
      customer: { name: 'Rajesh Kumar', phone: '+91 98765 43210', email: 'rajesh@email.com' },
      currentBalance: 1250,
      amount: 500,
      type: 'Cashback',
      reason: 'Order completion bonus - ORD12345',
      date: '2024-12-10 10:30 AM',
      expiryDate: '2025-03-10',
      status: 'Active',
    },
    {
      walletId: 'WAL20241210002',
      customer: { name: 'Priya Sharma', phone: '+91 98765 43211', email: 'priya@email.com' },
      currentBalance: 850,
      amount: 1800,
      type: 'Refund',
      reason: 'Order cancellation refund - ORD12346',
      date: '2024-12-09 03:15 PM',
      expiryDate: null,
      status: 'Active',
    },
    {
      walletId: 'WAL20241210003',
      customer: { name: 'Amit Patel', phone: '+91 98765 43212', email: 'amit@email.com' },
      currentBalance: 2200,
      amount: -500,
      type: 'Debit',
      reason: 'Used for order payment - ORD12347',
      date: '2024-12-09 11:45 AM',
      expiryDate: null,
      status: 'Active',
    },
    {
      walletId: 'WAL20241210004',
      customer: { name: 'Sneha Verma', phone: '+91 98765 43213', email: 'sneha@email.com' },
      currentBalance: 0,
      amount: 300,
      type: 'Cashback',
      reason: 'Referral bonus - New user joined',
      date: '2024-12-08 05:20 PM',
      expiryDate: '2024-12-08',
      status: 'Expired',
    },
    {
      walletId: 'WAL20241210005',
      customer: { name: 'Vikram Singh', phone: '+91 98765 43214', email: 'vikram@email.com' },
      currentBalance: 3500,
      amount: 1000,
      type: 'Manual Credit',
      reason: 'Compensation for service delay - Admin added',
      date: '2024-12-07 02:30 PM',
      expiryDate: null,
      status: 'Active',
    },
    {
      walletId: 'WAL20241210006',
      customer: { name: 'Neha Gupta', phone: '+91 98765 43215', email: 'neha@email.com' },
      currentBalance: 750,
      amount: 0,
      type: 'Manual Debit',
      reason: 'Fraud suspected - Wallet frozen by admin',
      date: '2024-12-06 09:00 AM',
      expiryDate: null,
      status: 'Frozen',
    },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Cashback': return 'bg-[#D1FAE5] text-[#065F46]';
      case 'Refund': return 'bg-[#DBEAFE] text-[#1E40AF]';
      case 'Manual Credit': return 'bg-[#E9D5FF] text-[#6B21A8]';
      case 'Debit': return 'bg-[#FEE2E2] text-[#991B1B]';
      case 'Manual Debit': return 'bg-[#FEE2E2] text-[#991B1B]';
      case 'Promotion': return 'bg-[#FEF3C7] text-[#92400E]';
      default: return 'bg-[#F1F5F9] text-[#475569]';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-[#D1FAE5] text-[#065F46]';
      case 'Expired': return 'bg-[#FEE2E2] text-[#991B1B]';
      case 'Frozen': return 'bg-[#F1F5F9] text-[#64748B]';
      default: return 'bg-[#F1F5F9] text-[#475569]';
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
                    <h1 className="text-3xl font-semibold text-[#1E293B] mb-2 flex items-center gap-3">
                      <Wallet className="w-8 h-8 text-[#8B5CF6]" />
                      Customer Wallet Management
                    </h1>
                    <p className="text-[#64748B] text-sm">Manage customer wallet balances, cashback, and transactions</p>
                  </div>
                  <button className="px-4 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors flex items-center gap-2 text-sm font-medium">
                    <Download className="w-4 h-4" />
                    Export Report
                  </button>
                </div>
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] rounded-xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Wallet className="w-8 h-8 opacity-80" />
                    <TrendingUp className="w-5 h-5 opacity-80" />
                  </div>
                  <h3 className="text-3xl font-bold mb-1">₹{(stats.totalWalletBalance / 100000).toFixed(1)}L</h3>
                  <p className="text-sm opacity-90">Total Wallet Balance</p>
                  <p className="text-xs opacity-75 mt-2">Across all customers</p>
                </div>

                <div className="bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <DollarSign className="w-8 h-8 opacity-80" />
                  </div>
                  <h3 className="text-3xl font-bold mb-1">{stats.activeWallets.toLocaleString()}</h3>
                  <p className="text-sm opacity-90">Active Wallets</p>
                  <p className="text-xs opacity-75 mt-2">Customers with balance</p>
                </div>

                <div className="bg-gradient-to-br from-[#EF4444] to-[#DC2626] rounded-xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Clock className="w-8 h-8 opacity-80" />
                  </div>
                  <h3 className="text-3xl font-bold mb-1">₹{(stats.expiredCashback / 1000).toFixed(0)}K</h3>
                  <p className="text-sm opacity-90">Expired Cashback</p>
                  <p className="text-xs opacity-75 mt-2">This month</p>
                </div>

                <div className="bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Gift className="w-8 h-8 opacity-80" />
                  </div>
                  <h3 className="text-3xl font-bold mb-1">₹{(stats.upcomingCashback / 1000).toFixed(0)}K</h3>
                  <p className="text-sm opacity-90">Upcoming Cashback</p>
                  <p className="text-xs opacity-75 mt-2">To be credited</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] rounded-xl border border-[#3B82F6]/20 p-6 mb-6">
                <h2 className="text-lg font-semibold text-[#1E293B] mb-4">Admin Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="flex items-center justify-between p-4 bg-white rounded-lg border border-[#E2E8F0] hover:shadow-md transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#D1FAE5] flex items-center justify-center">
                        <Plus className="w-5 h-5 text-[#10B981]" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-[#1E293B] group-hover:text-[#10B981] transition-colors">Add Wallet Balance</p>
                        <p className="text-xs text-[#64748B]">Credit to customer wallet</p>
                      </div>
                    </div>
                  </button>

                  <button className="flex items-center justify-between p-4 bg-white rounded-lg border border-[#E2E8F0] hover:shadow-md transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#FEE2E2] flex items-center justify-center">
                        <Minus className="w-5 h-5 text-[#EF4444]" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-[#1E293B] group-hover:text-[#EF4444] transition-colors">Deduct Wallet Balance</p>
                        <p className="text-xs text-[#64748B]">Debit from customer wallet</p>
                      </div>
                    </div>
                  </button>

                  <button className="flex items-center justify-between p-4 bg-white rounded-lg border border-[#E2E8F0] hover:shadow-md transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#F1F5F9] flex items-center justify-center">
                        <Lock className="w-5 h-5 text-[#64748B]" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-[#1E293B] group-hover:text-[#64748B] transition-colors">Freeze Wallet</p>
                        <p className="text-xs text-[#64748B]">Suspend suspicious accounts</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 mb-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#64748B] w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search by Wallet ID, Customer name, Phone..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                    />
                  </div>

                  <select
                    value={transactionTypeFilter}
                    onChange={(e) => setTransactionTypeFilter(e.target.value)}
                    className="px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  >
                    <option value="all">All Transaction Types</option>
                    <option value="cashback">Cashback</option>
                    <option value="refund">Refund</option>
                    <option value="credit">Manual Credit</option>
                    <option value="debit">Debit</option>
                    <option value="promotion">Promotion</option>
                  </select>

                  <select
                    className="px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="expired">Expired</option>
                    <option value="frozen">Frozen</option>
                  </select>

                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#64748B] w-4 h-4" />
                    <input
                      type="date"
                      className="w-full pl-10 pr-4 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                    />
                  </div>
                </div>
              </div>

              {/* Wallet Transactions Table */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] sticky top-0">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Wallet ID</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Current Balance</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Type</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Reason</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Date</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Expiry</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0]">
                      {walletTransactions.map((wallet) => (
                        <tr key={wallet.walletId} className="hover:bg-[#F8FAFC] transition-colors">
                          <td className="px-6 py-4">
                            <span className="text-sm font-mono text-[#3B82F6] font-medium">{wallet.walletId}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-sm font-medium text-[#1E293B]">{wallet.customer.name}</p>
                              <a href={`tel:${wallet.customer.phone}`} className="text-xs text-[#3B82F6] hover:underline flex items-center gap-1 mt-1">
                                <Phone className="w-3 h-3" />
                                {wallet.customer.phone}
                              </a>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-bold text-[#8B5CF6]">₹{wallet.currentBalance.toLocaleString()}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-sm font-bold ${wallet.amount >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                              {wallet.amount >= 0 ? '+' : ''}₹{Math.abs(wallet.amount).toLocaleString()}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(wallet.type)}`}>
                              {wallet.type}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-[#1E293B] max-w-xs">{wallet.reason}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-[#64748B]">{wallet.date}</span>
                          </td>
                          <td className="px-6 py-4">
                            {wallet.expiryDate ? (
                              <span className="text-sm text-[#64748B]">{wallet.expiryDate}</span>
                            ) : (
                              <span className="text-sm text-[#64748B] italic">N/A</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(wallet.status)}`}>
                              {wallet.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button className="p-2 text-[#3B82F6] hover:bg-[#EFF6FF] rounded-lg transition-colors" title="View Details">
                                <Eye className="w-4 h-4" />
                              </button>
                              {wallet.status === 'Active' && (
                                <>
                                  <button className="px-3 py-1.5 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-colors text-xs font-medium flex items-center gap-1">
                                    <Plus className="w-3 h-3" />
                                    Add
                                  </button>
                                  <button className="px-3 py-1.5 bg-[#EF4444] text-white rounded-lg hover:bg-[#DC2626] transition-colors text-xs font-medium flex items-center gap-1">
                                    <Minus className="w-3 h-3" />
                                    Deduct
                                  </button>
                                </>
                              )}
                              {wallet.status === 'Active' && (
                                <button className="p-2 text-[#64748B] hover:bg-[#F8FAFC] rounded-lg transition-colors" title="Freeze Wallet">
                                  <Lock className="w-4 h-4" />
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
                  <p className="text-sm text-[#64748B]">Showing 1 to 6 of 1245 wallet transactions</p>
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
                      3
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
