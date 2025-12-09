'use client';

import React, { useState } from 'react';
import { 
  Search, Filter, Download, Eye, RefreshCw, FileDown, Phone,
  Calendar, MoreVertical, CreditCard, Smartphone, Wallet, Banknote
} from 'lucide-react';
import Link from 'next/link';
import TopNavbar from '../../components/TopNavbar';
import LeftSidebar from '../../components/LeftSidebar';

export default function TransactionsListPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentModeFilter, setPaymentModeFilter] = useState('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
  const [gatewayFilter, setGatewayFilter] = useState('all');

  const transactions = [
    {
      transactionId: 'TXN20241210001',
      orderId: 'ORD12345',
      customer: { name: 'Rajesh Kumar', phone: '+91 98765 43210' },
      vendor: 'ElectroWorld Pro',
      vendorType: 'Shop',
      amount: 2500,
      paymentMode: 'UPI',
      paymentStatus: 'Success',
      settlementStatus: 'Settled',
      gateway: 'Razorpay',
      dateTime: '2024-12-10 10:30 AM',
    },
    {
      transactionId: 'TXN20241210002',
      orderId: 'ORD12346',
      customer: { name: 'Priya Sharma', phone: '+91 98765 43211' },
      vendor: 'Quick Repairs',
      vendorType: 'Professional',
      amount: 1800,
      paymentMode: 'Card',
      paymentStatus: 'Success',
      settlementStatus: 'Pending',
      gateway: 'Stripe',
      dateTime: '2024-12-10 11:15 AM',
    },
    {
      transactionId: 'TXN20241210003',
      orderId: 'ORD12347',
      customer: { name: 'Amit Patel', phone: '+91 98765 43212' },
      vendor: 'Fresh Mart Groceries',
      vendorType: 'Shop',
      amount: 3200,
      paymentMode: 'COD',
      paymentStatus: 'Success',
      settlementStatus: 'Settled',
      gateway: 'N/A',
      dateTime: '2024-12-10 12:00 PM',
    },
    {
      transactionId: 'TXN20241210004',
      orderId: 'ORD12348',
      customer: { name: 'Sneha Verma', phone: '+91 98765 43213' },
      vendor: 'Home Services',
      vendorType: 'Professional',
      amount: 4500,
      paymentMode: 'UPI',
      paymentStatus: 'Failed',
      settlementStatus: 'N/A',
      gateway: 'Razorpay',
      dateTime: '2024-12-10 01:20 PM',
    },
    {
      transactionId: 'TXN20241210005',
      orderId: 'ORD12349',
      customer: { name: 'Vikram Singh', phone: '+91 98765 43214' },
      vendor: 'Tasty Bites Restaurant',
      vendorType: 'Shop',
      amount: 850,
      paymentMode: 'Wallet',
      paymentStatus: 'Success',
      settlementStatus: 'Pending',
      gateway: 'Paytm',
      dateTime: '2024-12-10 02:45 PM',
    },
    {
      transactionId: 'TXN20241210006',
      orderId: 'ORD12350',
      customer: { name: 'Neha Gupta', phone: '+91 98765 43215' },
      vendor: 'ElectroWorld Pro',
      vendorType: 'Shop',
      amount: 5600,
      paymentMode: 'Card',
      paymentStatus: 'Pending',
      settlementStatus: 'N/A',
      gateway: 'Stripe',
      dateTime: '2024-12-10 03:10 PM',
    },
  ];

  const getPaymentModeIcon = (mode: string) => {
    switch (mode) {
      case 'UPI': return <Smartphone className="w-4 h-4" />;
      case 'Card': return <CreditCard className="w-4 h-4" />;
      case 'Wallet': return <Wallet className="w-4 h-4" />;
      case 'COD': return <Banknote className="w-4 h-4" />;
      default: return <CreditCard className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Success': return 'bg-[#D1FAE5] text-[#065F46]';
      case 'Pending': return 'bg-[#FEF3C7] text-[#92400E]';
      case 'Failed': return 'bg-[#FEE2E2] text-[#991B1B]';
      default: return 'bg-[#F1F5F9] text-[#475569]';
    }
  };

  const getSettlementColor = (status: string) => {
    switch (status) {
      case 'Settled': return 'bg-[#D1FAE5] text-[#065F46]';
      case 'Pending': return 'bg-[#FEF3C7] text-[#92400E]';
      case 'N/A': return 'bg-[#F1F5F9] text-[#64748B]';
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
                    <h1 className="text-3xl font-semibold text-[#1E293B] mb-2">All Transactions</h1>
                    <p className="text-[#64748B] text-sm">View and manage all payment transactions</p>
                  </div>
                  <button className="px-4 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors flex items-center gap-2 text-sm font-medium">
                    <Download className="w-4 h-4" />
                    Export CSV
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 mb-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#64748B] w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search Transaction ID, Order ID, Customer..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                    />
                  </div>

                  <select
                    value={paymentModeFilter}
                    onChange={(e) => setPaymentModeFilter(e.target.value)}
                    className="px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  >
                    <option value="all">All Payment Modes</option>
                    <option value="upi">UPI</option>
                    <option value="card">Card</option>
                    <option value="cod">Cash on Delivery</option>
                    <option value="wallet">Wallet</option>
                  </select>

                  <select
                    value={paymentStatusFilter}
                    onChange={(e) => setPaymentStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  >
                    <option value="all">All Statuses</option>
                    <option value="success">Success</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>

                  <select
                    value={gatewayFilter}
                    onChange={(e) => setGatewayFilter(e.target.value)}
                    className="px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  >
                    <option value="all">All Gateways</option>
                    <option value="razorpay">Razorpay</option>
                    <option value="stripe">Stripe</option>
                    <option value="paytm">Paytm</option>
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

              {/* Transactions Table */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Transaction ID</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Order ID</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Shop/Professional</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Payment Mode</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Payment Status</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Settlement</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Date & Time</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0]">
                      {transactions.map((txn) => (
                        <tr key={txn.transactionId} className="hover:bg-[#F8FAFC] transition-colors">
                          <td className="px-6 py-4">
                            <span className="text-sm font-mono text-[#3B82F6] font-medium">{txn.transactionId}</span>
                          </td>
                          <td className="px-6 py-4">
                            <Link href={`/dashboard/manager/orders/${txn.orderId}`}>
                              <span className="text-sm font-mono text-[#3B82F6] hover:underline cursor-pointer">{txn.orderId}</span>
                            </Link>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-sm font-medium text-[#1E293B]">{txn.customer.name}</p>
                              <a href={`tel:${txn.customer.phone}`} className="text-xs text-[#3B82F6] hover:underline flex items-center gap-1 mt-1">
                                <Phone className="w-3 h-3" />
                                {txn.customer.phone}
                              </a>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-sm font-medium text-[#1E293B]">{txn.vendor}</p>
                              <span className="text-xs text-[#64748B]">{txn.vendorType}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-bold text-[#1E293B]">₹{txn.amount.toLocaleString()}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="text-[#64748B]">{getPaymentModeIcon(txn.paymentMode)}</div>
                              <div>
                                <p className="text-sm font-medium text-[#1E293B]">{txn.paymentMode}</p>
                                <p className="text-xs text-[#64748B]">{txn.gateway}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(txn.paymentStatus)}`}>
                              {txn.paymentStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSettlementColor(txn.settlementStatus)}`}>
                              {txn.settlementStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-sm text-[#64748B]">
                              <Calendar className="w-4 h-4" />
                              {txn.dateTime}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Link href={`/dashboard/manager/payments/transactions/${txn.transactionId}`}>
                                <button className="p-2 text-[#3B82F6] hover:bg-[#EFF6FF] rounded-lg transition-colors" title="View Details">
                                  <Eye className="w-4 h-4" />
                                </button>
                              </Link>
                              {txn.paymentStatus === 'Success' && (
                                <button className="p-2 text-[#10B981] hover:bg-[#F0FDF4] rounded-lg transition-colors" title="Process Refund">
                                  <RefreshCw className="w-4 h-4" />
                                </button>
                              )}
                              <button className="p-2 text-[#64748B] hover:bg-[#F8FAFC] rounded-lg transition-colors" title="Download Invoice">
                                <FileDown className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-[#64748B] hover:bg-[#F8FAFC] rounded-lg transition-colors" title="More Options">
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
                <div className="px-6 py-4 border-t border-[#E2E8F0] flex items-center justify-between">
                  <p className="text-sm text-[#64748B]">Showing 1 to 6 of 245 transactions</p>
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
