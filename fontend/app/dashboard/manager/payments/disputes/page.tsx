'use client';

import React, { useState } from 'react';
import { 
  Search, Filter, Eye, AlertTriangle, Shield, FileText, Image as ImageIcon,
  Phone, Mail, CheckCircle, XCircle, Upload, Download, MessageSquare
} from 'lucide-react';
import Link from 'next/link';
import TopNavbar from '../../components/TopNavbar';
import LeftSidebar from '../../components/LeftSidebar';

export default function DisputesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const stats = {
    activeDisputes: 8,
    resolvedThisMonth: 15,
    chargebacks: 3,
    fraudulentTransactions: 2,
  };

  const disputes = [
    {
      disputeId: 'DSP20241210001',
      orderId: 'ORD12345',
      transactionId: 'TXN20241210001',
      customer: { name: 'Rajesh Kumar', phone: '+91 98765 43210', email: 'rajesh@email.com' },
      amount: 2500,
      reason: 'Unauthorized transaction - Card stolen',
      type: 'Fraud',
      gateway: 'Razorpay',
      status: 'Under Investigation',
      hasEvidence: true,
      priority: 'High',
      filedDate: '2024-12-09 02:30 PM',
    },
    {
      disputeId: 'DSP20241210002',
      orderId: 'ORD12346',
      transactionId: 'TXN20241210002',
      customer: { name: 'Priya Sharma', phone: '+91 98765 43211', email: 'priya@email.com' },
      amount: 1800,
      reason: 'Product not received, but payment deducted',
      type: 'Chargeback',
      gateway: 'Stripe',
      status: 'Pending',
      hasEvidence: false,
      priority: 'Medium',
      filedDate: '2024-12-08 05:45 PM',
    },
    {
      disputeId: 'DSP20241210003',
      orderId: 'ORD12347',
      transactionId: 'TXN20241210003',
      customer: { name: 'Amit Patel', phone: '+91 98765 43212', email: 'amit@email.com' },
      amount: 3200,
      reason: 'Duplicate payment charged twice',
      type: 'Dispute',
      gateway: 'Razorpay',
      status: 'Resolved',
      hasEvidence: true,
      priority: 'Low',
      filedDate: '2024-12-07 11:20 AM',
    },
    {
      disputeId: 'DSP20241210004',
      orderId: 'ORD12348',
      transactionId: 'TXN20241210004',
      customer: { name: 'Sneha Verma', phone: '+91 98765 43213', email: 'sneha@email.com' },
      amount: 4500,
      reason: 'Bank chargeback initiated - Product defective',
      type: 'Chargeback',
      gateway: 'Paytm',
      status: 'Escalated',
      hasEvidence: true,
      priority: 'High',
      filedDate: '2024-12-06 09:15 AM',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resolved': return 'bg-[#D1FAE5] text-[#065F46]';
      case 'Pending': return 'bg-[#FEF3C7] text-[#92400E]';
      case 'Under Investigation': return 'bg-[#DBEAFE] text-[#1E40AF]';
      case 'Escalated': return 'bg-[#FEE2E2] text-[#991B1B]';
      default: return 'bg-[#F1F5F9] text-[#475569]';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Fraud': return 'bg-[#FEE2E2] text-[#991B1B]';
      case 'Chargeback': return 'bg-[#FEF3C7] text-[#92400E]';
      case 'Dispute': return 'bg-[#E9D5FF] text-[#6B21A8]';
      default: return 'bg-[#F1F5F9] text-[#475569]';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-[#EF4444]';
      case 'Medium': return 'text-[#F59E0B]';
      case 'Low': return 'text-[#10B981]';
      default: return 'text-[#64748B]';
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
                      <Shield className="w-8 h-8 text-[#EF4444]" />
                      Disputes & Chargebacks
                    </h1>
                    <p className="text-[#64748B] text-sm">Manage customer disputes, unauthorized transactions, and chargeback requests</p>
                  </div>
                  <button className="px-4 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors flex items-center gap-2 text-sm font-medium">
                    <Download className="w-4 h-4" />
                    Export Report
                  </button>
                </div>
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-[#EF4444] to-[#DC2626] rounded-xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <AlertTriangle className="w-8 h-8 opacity-80" />
                  </div>
                  <h3 className="text-3xl font-bold mb-1">{stats.activeDisputes}</h3>
                  <p className="text-sm opacity-90">Active Disputes</p>
                  <p className="text-xs opacity-75 mt-2">Requires attention</p>
                </div>

                <div className="bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <CheckCircle className="w-8 h-8 opacity-80" />
                  </div>
                  <h3 className="text-3xl font-bold mb-1">{stats.resolvedThisMonth}</h3>
                  <p className="text-sm opacity-90">Resolved This Month</p>
                  <p className="text-xs opacity-75 mt-2">Successfully closed</p>
                </div>

                <div className="bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <FileText className="w-8 h-8 opacity-80" />
                  </div>
                  <h3 className="text-3xl font-bold mb-1">{stats.chargebacks}</h3>
                  <p className="text-sm opacity-90">Bank Chargebacks</p>
                  <p className="text-xs opacity-75 mt-2">Requires evidence</p>
                </div>

                <div className="bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] rounded-xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Shield className="w-8 h-8 opacity-80" />
                  </div>
                  <h3 className="text-3xl font-bold mb-1">{stats.fraudulentTransactions}</h3>
                  <p className="text-sm opacity-90">Fraudulent Transactions</p>
                  <p className="text-xs opacity-75 mt-2">Under investigation</p>
                </div>
              </div>

              {/* Alert Box */}
              <div className="bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] rounded-xl border border-[#F59E0B]/20 p-6 mb-6">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="w-6 h-6 text-[#F59E0B] flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-[#1E293B] mb-2">Important: Chargeback Response Time</h3>
                    <p className="text-sm text-[#64748B] mb-3">You have <span className="font-bold text-[#EF4444]">7-14 days</span> to respond to bank chargebacks with evidence. Delayed responses may result in automatic fund reversal and penalties from payment gateways.</p>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-white rounded-lg text-xs font-medium text-[#F59E0B] border border-[#F59E0B]/20">
                        3 chargebacks need immediate response
                      </span>
                      <button className="text-sm font-medium text-[#3B82F6] hover:underline">View All Pending →</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 mb-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#64748B] w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search Dispute ID, Order ID, Customer..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="investigation">Under Investigation</option>
                    <option value="escalated">Escalated</option>
                    <option value="resolved">Resolved</option>
                  </select>

                  <select
                    className="px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  >
                    <option value="all">All Types</option>
                    <option value="fraud">Fraud</option>
                    <option value="chargeback">Chargeback</option>
                    <option value="dispute">Customer Dispute</option>
                  </select>

                  <select
                    className="px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  >
                    <option value="all">All Gateways</option>
                    <option value="razorpay">Razorpay</option>
                    <option value="stripe">Stripe</option>
                    <option value="paytm">Paytm</option>
                  </select>
                </div>
              </div>

              {/* Disputes Table */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] sticky top-0">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Dispute ID</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Order ID</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Reason</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Type</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Gateway</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0]">
                      {disputes.map((dispute) => (
                        <tr key={dispute.disputeId} className="hover:bg-[#F8FAFC] transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-mono text-[#3B82F6] font-medium">{dispute.disputeId}</span>
                              <AlertTriangle className={`w-4 h-4 ${getPriorityColor(dispute.priority)}`} title={`${dispute.priority} Priority`} />
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Link href={`/dashboard/manager/orders/${dispute.orderId}`}>
                              <span className="text-sm font-mono text-[#3B82F6] hover:underline cursor-pointer">{dispute.orderId}</span>
                            </Link>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-sm font-medium text-[#1E293B]">{dispute.customer.name}</p>
                              <a href={`tel:${dispute.customer.phone}`} className="text-xs text-[#3B82F6] hover:underline flex items-center gap-1 mt-1">
                                <Phone className="w-3 h-3" />
                                {dispute.customer.phone}
                              </a>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-bold text-[#EF4444]">₹{dispute.amount.toLocaleString()}</span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-[#1E293B] max-w-xs">{dispute.reason}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(dispute.type)}`}>
                              {dispute.type}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-medium text-[#1E293B]">{dispute.gateway}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(dispute.status)}`}>
                              {dispute.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Link href={`/dashboard/manager/payments/disputes/${dispute.disputeId}`}>
                                <button className="p-2 text-[#3B82F6] hover:bg-[#EFF6FF] rounded-lg transition-colors" title="View Details">
                                  <Eye className="w-4 h-4" />
                                </button>
                              </Link>
                              {dispute.status !== 'Resolved' && (
                                <>
                                  <button className="px-3 py-1.5 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-colors text-xs font-medium flex items-center gap-1" title="Resolve Dispute">
                                    <CheckCircle className="w-3 h-3" />
                                    Resolve
                                  </button>
                                  <button className="p-2 text-[#8B5CF6] hover:bg-[#F3E8FF] rounded-lg transition-colors" title="Upload Evidence">
                                    <Upload className="w-4 h-4" />
                                  </button>
                                  <button className="p-2 text-[#F59E0B] hover:bg-[#FEF3C7] rounded-lg transition-colors" title="Contact Customer">
                                    <MessageSquare className="w-4 h-4" />
                                  </button>
                                </>
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
                  <p className="text-sm text-[#64748B]">Showing 1 to 4 of 8 disputes</p>
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
