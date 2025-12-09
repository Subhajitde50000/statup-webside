'use client';

import React, { useState } from 'react';
import { 
  Search, Download, Eye, CheckCircle, XCircle, Clock, DollarSign, 
  AlertTriangle, FileText, Image as ImageIcon
} from 'lucide-react';
import Link from 'next/link';
import TopNavbar from '../../components/TopNavbar';
import LeftSidebar from '../../components/LeftSidebar';

export default function RefundsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const refunds = [
    {
      id: 'REF-001',
      orderId: 'ORD-2024-004',
      customer: 'Sneha Patel',
      phone: '+91 98765 43213',
      amountRequested: 3200,
      reason: 'Payment failed but amount deducted',
      paymentMode: 'UPI',
      status: 'pending',
      date: '2024-12-09 02:45 PM',
      hasProof: true,
    },
    {
      id: 'REF-002',
      orderId: 'ORD-2024-008',
      customer: 'Rahul Sharma',
      phone: '+91 98765 43215',
      amountRequested: 1500,
      reason: 'Product not delivered',
      paymentMode: 'Card',
      status: 'approved',
      date: '2024-12-08 11:30 AM',
      hasProof: false,
    },
    {
      id: 'REF-003',
      orderId: 'ORD-2024-012',
      customer: 'Priya Singh',
      phone: '+91 98765 43211',
      amountRequested: 850,
      reason: 'Wrong item delivered',
      paymentMode: 'COD',
      status: 'rejected',
      date: '2024-12-07 04:15 PM',
      hasProof: true,
    },
    {
      id: 'REF-004',
      orderId: 'ORD-2024-015',
      customer: 'Amit Kumar',
      phone: '+91 98765 43216',
      amountRequested: 2200,
      reason: 'Order cancelled by shop',
      paymentMode: 'UPI',
      status: 'pending',
      date: '2024-12-10 09:20 AM',
      hasProof: false,
    },
  ];

  const filteredRefunds = refunds.filter((refund) => {
    const matchesSearch = 
      refund.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      refund.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      refund.customer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || refund.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      'pending': 'bg-[#FEF3C7] text-[#D97706]',
      'approved': 'bg-[#D1FAE5] text-[#059669]',
      'rejected': 'bg-[#FEE2E2] text-[#DC2626]',
      'on-hold': 'bg-[#E0E7FF] text-[#6366F1]',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <TopNavbar />
      <div className="flex">
        <LeftSidebar isOpen={sidebarOpen} />
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
          <div className="p-8">
            <div className="max-w-[1400px] mx-auto">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-semibold text-[#1E293B] mb-2">Refund Management</h1>
                    <p className="text-[#64748B] text-sm">Handle refund requests from customers</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-white border border-[#E2E8F0] text-[#64748B] rounded-lg hover:bg-[#F8FAFC] transition-colors flex items-center gap-2 text-sm font-medium">
                      <Download className="w-4 h-4" />
                      Export Report
                    </button>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-xl p-5 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm opacity-90">Pending Refunds</span>
                      <Clock className="w-5 h-5 opacity-80" />
                    </div>
                    <h3 className="text-2xl font-bold">{refunds.filter(r => r.status === 'pending').length}</h3>
                    <p className="text-xs opacity-75 mt-1">Awaiting review</p>
                  </div>

                  <div className="bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl p-5 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm opacity-90">Approved</span>
                      <CheckCircle className="w-5 h-5 opacity-80" />
                    </div>
                    <h3 className="text-2xl font-bold">{refunds.filter(r => r.status === 'approved').length}</h3>
                    <p className="text-xs opacity-75 mt-1">This month</p>
                  </div>

                  <div className="bg-gradient-to-br from-[#EF4444] to-[#DC2626] rounded-xl p-5 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm opacity-90">Rejected</span>
                      <XCircle className="w-5 h-5 opacity-80" />
                    </div>
                    <h3 className="text-2xl font-bold">{refunds.filter(r => r.status === 'rejected').length}</h3>
                    <p className="text-xs opacity-75 mt-1">Invalid requests</p>
                  </div>

                  <div className="bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-xl p-5 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm opacity-90">Total Amount</span>
                      <DollarSign className="w-5 h-5 opacity-80" />
                    </div>
                    <h3 className="text-2xl font-bold">
                      ₹{refunds.filter(r => r.status === 'pending').reduce((sum, r) => sum + r.amountRequested, 0).toLocaleString()}
                    </h3>
                    <p className="text-xs opacity-75 mt-1">Pending amount</p>
                  </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-xl border border-[#E2E8F0] p-4">
                  <div className="flex flex-col lg:flex-row gap-4 mb-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#94A3B8] w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search by Refund ID, Order ID, or Customer Name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {['all', 'pending', 'approved', 'rejected', 'on-hold'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          statusFilter === status
                            ? 'bg-[#3B82F6] text-white shadow-sm'
                            : 'bg-[#F8FAFC] text-[#64748B] hover:bg-[#E2E8F0]'
                        }`}
                      >
                        {status === 'all' ? 'All Refunds' : status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="sticky top-0 bg-[#F8FAFC] z-10">
                      <tr className="border-b border-[#E2E8F0]">
                        <th className="text-left py-4 px-6 text-xs font-semibold text-[#64748B] uppercase">Refund ID</th>
                        <th className="text-left py-4 px-6 text-xs font-semibold text-[#64748B] uppercase">Order ID</th>
                        <th className="text-left py-4 px-6 text-xs font-semibold text-[#64748B] uppercase">Customer</th>
                        <th className="text-left py-4 px-6 text-xs font-semibold text-[#64748B] uppercase">Amount</th>
                        <th className="text-left py-4 px-6 text-xs font-semibold text-[#64748B] uppercase">Reason</th>
                        <th className="text-left py-4 px-6 text-xs font-semibold text-[#64748B] uppercase">Payment Mode</th>
                        <th className="text-left py-4 px-6 text-xs font-semibold text-[#64748B] uppercase">Status</th>
                        <th className="text-left py-4 px-6 text-xs font-semibold text-[#64748B] uppercase">Date</th>
                        <th className="text-left py-4 px-6 text-xs font-semibold text-[#64748B] uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRefunds.map((refund) => (
                        <tr key={refund.id} className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors">
                          <td className="py-4 px-6">
                            <span className="font-mono text-sm font-semibold text-[#3B82F6]">{refund.id}</span>
                          </td>
                          <td className="py-4 px-6">
                            <Link href={`/dashboard/manager/orders/${refund.orderId}`}>
                              <span className="font-mono text-sm text-[#6366F1] hover:underline">{refund.orderId}</span>
                            </Link>
                          </td>
                          <td className="py-4 px-6">
                            <div>
                              <p className="font-semibold text-[#1E293B] text-sm">{refund.customer}</p>
                              <p className="text-xs text-[#64748B]">{refund.phone}</p>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-sm font-bold text-[#EF4444]">₹{refund.amountRequested.toLocaleString()}</span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-start gap-1 max-w-xs">
                              <p className="text-sm text-[#64748B] line-clamp-2">{refund.reason}</p>
                              {refund.hasProof && (
                                <ImageIcon className="w-4 h-4 text-[#3B82F6] flex-shrink-0" title="Has proof" />
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-sm text-[#1E293B]">{refund.paymentMode}</span>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(refund.status)}`}>
                              {refund.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-xs text-[#64748B]">{refund.date}</span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <button className="p-2 text-[#3B82F6] hover:bg-[#EFF6FF] rounded-lg transition-colors" title="View Details">
                                <Eye className="w-4 h-4" />
                              </button>
                              {refund.status === 'pending' && (
                                <>
                                  <button className="p-2 text-[#10B981] hover:bg-[#D1FAE5] rounded-lg transition-colors" title="Approve">
                                    <CheckCircle className="w-4 h-4" />
                                  </button>
                                  <button className="p-2 text-[#EF4444] hover:bg-[#FEE2E2] rounded-lg transition-colors" title="Reject">
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                  <button className="p-2 text-[#F59E0B] hover:bg-[#FEF3C7] rounded-lg transition-colors" title="Hold">
                                    <Clock className="w-4 h-4" />
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
                <div className="border-t border-[#E2E8F0] px-6 py-4 flex items-center justify-between">
                  <div className="text-sm text-[#64748B]">
                    Showing <span className="font-semibold text-[#1E293B]">{filteredRefunds.length}</span> of <span className="font-semibold text-[#1E293B]">{refunds.length}</span> refunds
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
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
