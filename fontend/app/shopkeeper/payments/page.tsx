'use client';

import React, { useState } from 'react';
import ShopkeeperNavbar from '../components/ShopkeeperNavbar';
import { CreditCard, Download, Search, Filter, Calendar, CheckCircle, Clock, XCircle, TrendingUp, ArrowUpRight, ArrowDownRight, ChevronDown } from 'lucide-react';

// Mock payment data
const MOCK_PAYMENTS = [
  {
    id: 'PAY001',
    type: 'credit',
    amount: 15000,
    status: 'completed',
    method: 'Bank Transfer',
    description: 'Payment for Order #12345, #12346, #12347',
    date: '2026-01-02',
    time: '10:30 AM',
    transactionId: 'TXN789456123',
    customerName: 'Rajesh Kumar'
  },
  {
    id: 'PAY002',
    type: 'credit',
    amount: 8500,
    status: 'completed',
    method: 'UPI',
    description: 'Payment for Order #12344',
    date: '2026-01-01',
    time: '03:45 PM',
    transactionId: 'TXN789456122',
    customerName: 'Amit Electricals'
  },
  {
    id: 'PAY003',
    type: 'debit',
    amount: 2500,
    status: 'completed',
    method: 'Platform Fee',
    description: 'Monthly subscription fee - Premium Plan',
    date: '2026-01-01',
    time: '12:00 PM',
    transactionId: 'TXN789456121',
    customerName: 'MegaStore Platform'
  },
  {
    id: 'PAY004',
    type: 'credit',
    amount: 12000,
    status: 'pending',
    method: 'Bank Transfer',
    description: 'Payment for Order #12340, #12341',
    date: '2025-12-31',
    time: '05:20 PM',
    transactionId: 'TXN789456120',
    customerName: 'Priya Sharma'
  },
  {
    id: 'PAY005',
    type: 'credit',
    amount: 6500,
    status: 'completed',
    method: 'Cash',
    description: 'Payment for Order #12339',
    date: '2025-12-30',
    time: '11:15 AM',
    transactionId: 'TXN789456119',
    customerName: 'Vikram Singh'
  },
  {
    id: 'PAY006',
    type: 'credit',
    amount: 9200,
    status: 'failed',
    method: 'UPI',
    description: 'Payment for Order #12338',
    date: '2025-12-29',
    time: '02:30 PM',
    transactionId: 'TXN789456118',
    customerName: 'Anita Hardware'
  },
  {
    id: 'PAY007',
    type: 'credit',
    amount: 18500,
    status: 'completed',
    method: 'Bank Transfer',
    description: 'Payment for Order #12335, #12336',
    date: '2025-12-28',
    time: '09:45 AM',
    transactionId: 'TXN789456117',
    customerName: 'Suresh Enterprises'
  },
  {
    id: 'PAY008',
    type: 'debit',
    amount: 500,
    status: 'completed',
    method: 'Transaction Fee',
    description: 'Payment gateway charges for December',
    date: '2025-12-28',
    time: '12:00 AM',
    transactionId: 'TXN789456116',
    customerName: 'MegaStore Platform'
  },
  {
    id: 'PAY009',
    type: 'credit',
    amount: 7800,
    status: 'completed',
    method: 'UPI',
    description: 'Payment for Order #12334',
    date: '2025-12-27',
    time: '04:20 PM',
    transactionId: 'TXN789456115',
    customerName: 'Ravi Electronics'
  },
  {
    id: 'PAY010',
    type: 'credit',
    amount: 11200,
    status: 'completed',
    method: 'Cash',
    description: 'Payment for Order #12332, #12333',
    date: '2025-12-26',
    time: '10:30 AM',
    transactionId: 'TXN789456114',
    customerName: 'Deepak Traders'
  }
];

export default function PaymentsPage() {
  const [payments, setPayments] = useState(MOCK_PAYMENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'credit' | 'debit'>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Calculate totals
  const totalCredit = payments
    .filter(p => p.type === 'credit' && p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);
  
  const totalDebit = payments
    .filter(p => p.type === 'debit' && p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);
  
  const pendingAmount = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  // Filter payments
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         payment.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         payment.transactionId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesType = typeFilter === 'all' || payment.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-orange-600 bg-orange-50';
      case 'failed': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const handleExport = () => {
    alert('Exporting payment history to CSV...');
    // Add CSV export logic here
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <ShopkeeperNavbar />

      <main className="max-w-[1400px] mx-auto px-4 lg:px-6 py-6 lg:py-8 pb-24 lg:pb-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-[#0C0C0C] flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-[#00C897]" />
            Payment History
          </h1>
          <p className="text-[#555555] mt-1">
            Track all your payment transactions and revenue
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-6">
          {/* Total Received */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-600 font-medium">Total Received</span>
              <div className="bg-green-100 p-2 rounded-lg">
                <ArrowDownRight className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">₹{totalCredit.toLocaleString()}</div>
            <div className="text-sm text-green-600 font-medium">+12% from last month</div>
          </div>

          {/* Total Deducted */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-600 font-medium">Total Deducted</span>
              <div className="bg-red-100 p-2 rounded-lg">
                <ArrowUpRight className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">₹{totalDebit.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Fees & Charges</div>
          </div>

          {/* Pending Payments */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-600 font-medium">Pending</span>
              <div className="bg-orange-100 p-2 rounded-lg">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">₹{pendingAmount.toLocaleString()}</div>
            <div className="text-sm text-orange-600 font-medium">{payments.filter(p => p.status === 'pending').length} transactions</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by transaction ID, customer name, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C897] focus:border-transparent"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                <Filter className="w-5 h-5" />
                Filters
              </button>
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#00C897] text-white rounded-lg hover:bg-[#00B184] transition font-medium"
              >
                <Download className="w-5 h-5" />
                Export
              </button>
            </div>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col sm:flex-row gap-4">
              {/* Status Filter */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C897]"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              {/* Type Filter */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as any)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C897]"
                >
                  <option value="all">All Types</option>
                  <option value="credit">Credit (Received)</option>
                  <option value="debit">Debit (Paid)</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Transaction ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date & Time</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Description</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Method</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm text-gray-900">{payment.transactionId}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{payment.date}</div>
                      <div className="text-xs text-gray-500">{payment.time}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">{payment.customerName}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{payment.description}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">{payment.method}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-semibold ${
                        payment.type === 'credit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {payment.type === 'credit' ? '+' : '-'}₹{payment.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                        {payment.status === 'completed' && <CheckCircle className="w-3 h-3" />}
                        {payment.status === 'pending' && <Clock className="w-3 h-3" />}
                        {payment.status === 'failed' && <XCircle className="w-3 h-3" />}
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden divide-y divide-gray-200">
            {filteredPayments.map((payment) => (
              <div key={payment.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 mb-1">{payment.customerName}</div>
                    <div className="text-xs text-gray-500 font-mono">{payment.transactionId}</div>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                    {payment.status === 'completed' && <CheckCircle className="w-3 h-3" />}
                    {payment.status === 'pending' && <Clock className="w-3 h-3" />}
                    {payment.status === 'failed' && <XCircle className="w-3 h-3" />}
                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                  </span>
                </div>
                
                <div className="text-sm text-gray-600 mb-2">{payment.description}</div>
                
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div>
                    <div className="text-xs text-gray-500">{payment.date} • {payment.time}</div>
                    <div className="text-xs text-gray-600 mt-0.5">{payment.method}</div>
                  </div>
                  <div className={`text-lg font-bold ${
                    payment.type === 'credit' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {payment.type === 'credit' ? '+' : '-'}₹{payment.amount.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredPayments.length === 0 && (
            <div className="py-16 text-center">
              <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Payments Found</h3>
              <p className="text-gray-500">
                {searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
                  ? 'Try adjusting your filters or search query'
                  : 'You don\'t have any payment transactions yet'}
              </p>
            </div>
          )}
        </div>

        {/* Results Count */}
        {filteredPayments.length > 0 && (
          <div className="mt-4 text-center text-sm text-gray-600">
            Showing {filteredPayments.length} of {payments.length} transactions
          </div>
        )}
      </main>
    </div>
  );
}
