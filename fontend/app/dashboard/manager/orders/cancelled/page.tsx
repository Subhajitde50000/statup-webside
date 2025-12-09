'use client';

import React, { useState } from 'react';
import { Search, Download, XCircle, AlertTriangle, Calendar } from 'lucide-react';
import Link from 'next/link';
import TopNavbar from '../../components/TopNavbar';
import LeftSidebar from '../../components/LeftSidebar';

export default function CancelledOrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [cancelledByFilter, setCancelledByFilter] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const cancelledOrders = [
    {
      id: 'ORD-2024-004',
      customer: 'Sneha Patel',
      shop: 'Quick Repairs',
      amount: 3200,
      reason: 'Payment validation failed',
      cancelledBy: 'system',
      refundStatus: 'processing',
      date: '2024-12-09 02:30 PM',
    },
    {
      id: 'ORD-2024-019',
      customer: 'Rahul Verma',
      shop: 'ElectroWorld Pro',
      amount: 1500,
      reason: 'Customer request',
      cancelledBy: 'customer',
      refundStatus: 'completed',
      date: '2024-12-08 05:45 PM',
    },
    {
      id: 'ORD-2024-022',
      customer: 'Amit Kumar',
      shop: 'Fresh Mart Groceries',
      amount: 850,
      reason: 'Shop unavailable',
      cancelledBy: 'shop',
      refundStatus: 'pending',
      date: '2024-12-07 11:20 AM',
    },
    {
      id: 'ORD-2024-025',
      customer: 'Priya Singh',
      shop: 'Tasty Bites Restaurant',
      amount: 650,
      reason: 'Delivery boy unavailable',
      cancelledBy: 'admin',
      refundStatus: 'completed',
      date: '2024-12-06 03:15 PM',
    },
    {
      id: 'ORD-2024-028',
      customer: 'Vikram Patel',
      shop: 'Quick Electronics',
      amount: 2100,
      reason: 'Out of stock',
      cancelledBy: 'shop',
      refundStatus: 'processing',
      date: '2024-12-05 09:30 AM',
    },
    {
      id: 'ORD-2024-031',
      customer: 'Suresh Reddy',
      shop: 'Home Services',
      amount: 3500,
      reason: 'Fake order',
      cancelledBy: 'admin',
      refundStatus: 'rejected',
      date: '2024-12-04 01:45 PM',
    },
  ];

  const filteredOrders = cancelledOrders.filter((order) => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.shop.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCancelledBy = cancelledByFilter === 'all' || order.cancelledBy === cancelledByFilter;
    
    return matchesSearch && matchesCancelledBy;
  });

  const getCancelledByColor = (by: string) => {
    const colors = {
      'customer': 'bg-[#DBEAFE] text-[#2563EB]',
      'shop': 'bg-[#FEF3C7] text-[#D97706]',
      'admin': 'bg-[#E0E7FF] text-[#6366F1]',
      'system': 'bg-[#F1F5F9] text-[#64748B]',
    };
    return colors[by as keyof typeof colors] || 'bg-gray-100 text-gray-600';
  };

  const getRefundStatusColor = (status: string) => {
    const colors = {
      'pending': 'bg-[#FEF3C7] text-[#D97706]',
      'processing': 'bg-[#DBEAFE] text-[#2563EB]',
      'completed': 'bg-[#D1FAE5] text-[#059669]',
      'rejected': 'bg-[#FEE2E2] text-[#DC2626]',
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
                    <h1 className="text-3xl font-semibold text-[#1E293B] mb-2">Cancelled Orders</h1>
                    <p className="text-[#64748B] text-sm">Review and manage cancelled orders</p>
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
                  <div className="bg-gradient-to-br from-[#EF4444] to-[#DC2626] rounded-xl p-5 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm opacity-90">Total Cancelled</span>
                      <XCircle className="w-5 h-5 opacity-80" />
                    </div>
                    <h3 className="text-2xl font-bold">{cancelledOrders.length}</h3>
                    <p className="text-xs opacity-75 mt-1">This month</p>
                  </div>

                  <div className="bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-xl p-5 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm opacity-90">By Customer</span>
                      <AlertTriangle className="w-5 h-5 opacity-80" />
                    </div>
                    <h3 className="text-2xl font-bold">{cancelledOrders.filter(o => o.cancelledBy === 'customer').length}</h3>
                    <p className="text-xs opacity-75 mt-1">Customer initiated</p>
                  </div>

                  <div className="bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-xl p-5 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm opacity-90">By Shop</span>
                      <XCircle className="w-5 h-5 opacity-80" />
                    </div>
                    <h3 className="text-2xl font-bold">{cancelledOrders.filter(o => o.cancelledBy === 'shop').length}</h3>
                    <p className="text-xs opacity-75 mt-1">Shop cancelled</p>
                  </div>

                  <div className="bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] rounded-xl p-5 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm opacity-90">By Admin</span>
                      <AlertTriangle className="w-5 h-5 opacity-80" />
                    </div>
                    <h3 className="text-2xl font-bold">{cancelledOrders.filter(o => o.cancelledBy === 'admin').length}</h3>
                    <p className="text-xs opacity-75 mt-1">Admin action</p>
                  </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-xl border border-[#E2E8F0] p-4">
                  <div className="flex flex-col lg:flex-row gap-4 mb-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#94A3B8] w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search by Order ID, Customer, or Shop..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {['all', 'customer', 'shop', 'admin', 'system'].map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setCancelledByFilter(filter)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          cancelledByFilter === filter
                            ? 'bg-[#3B82F6] text-white shadow-sm'
                            : 'bg-[#F8FAFC] text-[#64748B] hover:bg-[#E2E8F0]'
                        }`}
                      >
                        {filter === 'all' ? 'All' : `By ${filter.charAt(0).toUpperCase() + filter.slice(1)}`}
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
                        <th className="text-left py-4 px-6 text-xs font-semibold text-[#64748B] uppercase">Order ID</th>
                        <th className="text-left py-4 px-6 text-xs font-semibold text-[#64748B] uppercase">Customer</th>
                        <th className="text-left py-4 px-6 text-xs font-semibold text-[#64748B] uppercase">Shop/Professional</th>
                        <th className="text-left py-4 px-6 text-xs font-semibold text-[#64748B] uppercase">Amount</th>
                        <th className="text-left py-4 px-6 text-xs font-semibold text-[#64748B] uppercase">Cancellation Reason</th>
                        <th className="text-left py-4 px-6 text-xs font-semibold text-[#64748B] uppercase">Cancelled By</th>
                        <th className="text-left py-4 px-6 text-xs font-semibold text-[#64748B] uppercase">Refund Status</th>
                        <th className="text-left py-4 px-6 text-xs font-semibold text-[#64748B] uppercase">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors">
                          <td className="py-4 px-6">
                            <Link href={`/dashboard/manager/orders/${order.id}`}>
                              <span className="font-mono text-sm font-semibold text-[#3B82F6] hover:underline">{order.id}</span>
                            </Link>
                          </td>
                          <td className="py-4 px-6">
                            <span className="font-semibold text-[#1E293B] text-sm">{order.customer}</span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-sm text-[#1E293B]">{order.shop}</span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-sm font-bold text-[#1E293B]">₹{order.amount.toLocaleString()}</span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
                              <span className="text-sm text-[#64748B]">{order.reason}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCancelledByColor(order.cancelledBy)}`}>
                              {order.cancelledBy.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRefundStatusColor(order.refundStatus)}`}>
                              {order.refundStatus.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-1 text-xs text-[#64748B]">
                              <Calendar className="w-3 h-3" />
                              <span>{order.date}</span>
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
                    Showing <span className="font-semibold text-[#1E293B]">{filteredOrders.length}</span> of <span className="font-semibold text-[#1E293B]">{cancelledOrders.length}</span> cancelled orders
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
