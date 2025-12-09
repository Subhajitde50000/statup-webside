'use client';

import React, { useState } from 'react';
import { 
  Search, Filter, Eye, CheckCircle, XCircle, Clock, AlertTriangle,
  Image as ImageIcon, Phone, FileText, Download
} from 'lucide-react';
import Link from 'next/link';
import TopNavbar from '../../components/TopNavbar';
import LeftSidebar from '../../components/LeftSidebar';

export default function RefundsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const stats = {
    pendingRefunds: 12,
    approvedRefunds: 45,
    rejectedRefunds: 8,
    totalPendingAmount: 125000,
  };

  const refunds = [
    {
      refundId: 'REF20241210001',
      orderId: 'ORD12345',
      transactionId: 'TXN20241210001',
      customer: { name: 'Rajesh Kumar', phone: '+91 98765 43210' },
      amount: 2500,
      reason: 'Product damaged during delivery',
      hasProof: true,
      paymentMode: 'UPI',
      status: 'Pending',
      requestDate: '2024-12-09 03:30 PM',
    },
    {
      refundId: 'REF20241210002',
      orderId: 'ORD12346',
      transactionId: 'TXN20241210002',
      customer: { name: 'Priya Sharma', phone: '+91 98765 43211' },
      amount: 1800,
      reason: 'Wrong product delivered',
      hasProof: true,
      paymentMode: 'Card',
      status: 'Approved',
      requestDate: '2024-12-08 11:20 AM',
    },
    {
      refundId: 'REF20241210003',
      orderId: 'ORD12347',
      transactionId: 'TXN20241210003',
      customer: { name: 'Amit Patel', phone: '+91 98765 43212' },
      amount: 3200,
      reason: 'Product quality not as expected',
      hasProof: false,
      paymentMode: 'UPI',
      status: 'On-Hold',
      requestDate: '2024-12-09 09:15 AM',
    },
    {
      refundId: 'REF20241210004',
      orderId: 'ORD12348',
      transactionId: 'TXN20241210004',
      customer: { name: 'Sneha Verma', phone: '+91 98765 43213' },
      amount: 4500,
      reason: 'Changed mind, want to cancel',
      hasProof: false,
      paymentMode: 'Wallet',
      status: 'Rejected',
      requestDate: '2024-12-07 02:45 PM',
    },
    {
      refundId: 'REF20241210005',
      orderId: 'ORD12349',
      transactionId: 'TXN20241210005',
      customer: { name: 'Vikram Singh', phone: '+91 98765 43214' },
      amount: 850,
      reason: 'Order never arrived, suspected lost',
      hasProof: true,
      paymentMode: 'Card',
      status: 'Pending',
      requestDate: '2024-12-09 05:00 PM',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-[#D1FAE5] text-[#065F46]';
      case 'Pending': return 'bg-[#FEF3C7] text-[#92400E]';
      case 'Rejected': return 'bg-[#FEE2E2] text-[#991B1B]';
      case 'On-Hold': return 'bg-[#E9D5FF] text-[#6B21A8]';
      default: return 'bg-[#F1F5F9] text-[#475569]';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved': return <CheckCircle className="w-4 h-4" />;
      case 'Pending': return <Clock className="w-4 h-4" />;
      case 'Rejected': return <XCircle className="w-4 h-4" />;
      case 'On-Hold': return <AlertTriangle className="w-4 h-4" />;
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
                    <h1 className="text-3xl font-semibold text-[#1E293B] mb-2">Refund Requests</h1>
                    <p className="text-[#64748B] text-sm">Manage and process customer refund requests</p>
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
                  <h3 className="text-3xl font-bold mb-1">{stats.pendingRefunds}</h3>
                  <p className="text-sm opacity-90">Pending Refunds</p>
                  <p className="text-xs opacity-75 mt-2">Awaiting review</p>
                </div>

                <div className="bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <CheckCircle className="w-8 h-8 opacity-80" />
                  </div>
                  <h3 className="text-3xl font-bold mb-1">{stats.approvedRefunds}</h3>
                  <p className="text-sm opacity-90">Approved Refunds</p>
                  <p className="text-xs opacity-75 mt-2">This month</p>
                </div>

                <div className="bg-gradient-to-br from-[#EF4444] to-[#DC2626] rounded-xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <XCircle className="w-8 h-8 opacity-80" />
                  </div>
                  <h3 className="text-3xl font-bold mb-1">{stats.rejectedRefunds}</h3>
                  <p className="text-sm opacity-90">Rejected Refunds</p>
                  <p className="text-xs opacity-75 mt-2">This month</p>
                </div>

                <div className="bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] rounded-xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <FileText className="w-8 h-8 opacity-80" />
                  </div>
                  <h3 className="text-3xl font-bold mb-1">₹{(stats.totalPendingAmount / 1000).toFixed(0)}K</h3>
                  <p className="text-sm opacity-90">Total Pending Amount</p>
                  <p className="text-xs opacity-75 mt-2">To be processed</p>
                </div>
              </div>

              {/* Refund Flow Info */}
              <div className="bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] rounded-xl border border-[#3B82F6]/20 p-6 mb-6">
                <h2 className="text-lg font-semibold text-[#1E293B] mb-4">Refund Processing Flow</h2>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-[#FEF3C7] border-2 border-[#F59E0B] flex items-center justify-center">
                        <span className="text-sm font-bold text-[#F59E0B]">1</span>
                      </div>
                      <p className="text-xs text-[#64748B] mt-2 text-center">Requested</p>
                    </div>
                    <div className="w-12 h-0.5 bg-[#E2E8F0]" />
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-[#DBEAFE] border-2 border-[#3B82F6] flex items-center justify-center">
                        <span className="text-sm font-bold text-[#3B82F6]">2</span>
                      </div>
                      <p className="text-xs text-[#64748B] mt-2 text-center">Under Review</p>
                    </div>
                    <div className="w-12 h-0.5 bg-[#E2E8F0]" />
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-[#E9D5FF] border-2 border-[#8B5CF6] flex items-center justify-center">
                        <span className="text-sm font-bold text-[#8B5CF6]">3</span>
                      </div>
                      <p className="text-xs text-[#64748B] mt-2 text-center">Decision</p>
                    </div>
                    <div className="w-12 h-0.5 bg-[#E2E8F0]" />
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-[#D1FAE5] border-2 border-[#10B981] flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-[#10B981]" />
                      </div>
                      <p className="text-xs text-[#64748B] mt-2 text-center">Approved</p>
                    </div>
                    <div className="w-12 h-0.5 bg-[#E2E8F0]" />
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-[#D1FAE5] border-2 border-[#10B981] flex items-center justify-center">
                        <span className="text-sm font-bold text-[#10B981]">₹</span>
                      </div>
                      <p className="text-xs text-[#64748B] mt-2 text-center">Refunded</p>
                    </div>
                  </div>
                  <div className="text-sm text-[#64748B]">
                    <p>Average processing time: <span className="font-semibold text-[#1E293B]">2-3 business days</span></p>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 mb-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#64748B] w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search by Refund ID, Order ID, Customer..."
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
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="on-hold">On-Hold</option>
                  </select>

                  <select
                    className="px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  >
                    <option value="all">All Payment Modes</option>
                    <option value="upi">UPI</option>
                    <option value="card">Card</option>
                    <option value="wallet">Wallet</option>
                  </select>
                </div>
              </div>

              {/* Refunds Table */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] sticky top-0">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Refund ID</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Order ID</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Reason</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Payment Mode</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Request Date</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0]">
                      {refunds.map((refund) => (
                        <tr key={refund.refundId} className="hover:bg-[#F8FAFC] transition-colors">
                          <td className="px-6 py-4">
                            <span className="text-sm font-mono text-[#3B82F6] font-medium">{refund.refundId}</span>
                          </td>
                          <td className="px-6 py-4">
                            <Link href={`/dashboard/manager/orders/${refund.orderId}`}>
                              <span className="text-sm font-mono text-[#3B82F6] hover:underline cursor-pointer">{refund.orderId}</span>
                            </Link>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-sm font-medium text-[#1E293B]">{refund.customer.name}</p>
                              <a href={`tel:${refund.customer.phone}`} className="text-xs text-[#3B82F6] hover:underline flex items-center gap-1 mt-1">
                                <Phone className="w-3 h-3" />
                                {refund.customer.phone}
                              </a>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-bold text-[#EF4444]">₹{refund.amount.toLocaleString()}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-start gap-2">
                              <p className="text-sm text-[#1E293B] max-w-xs">{refund.reason}</p>
                              {refund.hasProof && (
                                <ImageIcon className="w-4 h-4 text-[#3B82F6] flex-shrink-0" title="Customer uploaded proof" />
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-medium text-[#1E293B]">{refund.paymentMode}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${getStatusColor(refund.status)}`}>
                              {getStatusIcon(refund.status)}
                              {refund.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-[#64748B]">{refund.requestDate}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Link href={`/dashboard/manager/payments/refunds/${refund.refundId}`}>
                                <button className="p-2 text-[#3B82F6] hover:bg-[#EFF6FF] rounded-lg transition-colors" title="View Details">
                                  <Eye className="w-4 h-4" />
                                </button>
                              </Link>
                              {refund.status === 'Pending' && (
                                <>
                                  <button className="px-3 py-1.5 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-colors text-xs font-medium">
                                    Approve
                                  </button>
                                  <button className="px-3 py-1.5 bg-[#EF4444] text-white rounded-lg hover:bg-[#DC2626] transition-colors text-xs font-medium">
                                    Reject
                                  </button>
                                  <button className="px-3 py-1.5 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#7C3AED] transition-colors text-xs font-medium">
                                    Hold
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
                  <p className="text-sm text-[#64748B]">Showing 1 to 5 of 12 refund requests</p>
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
