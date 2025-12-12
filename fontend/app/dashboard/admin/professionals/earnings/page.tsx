'use client';

import React, { useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { Search, DollarSign, TrendingUp, Calendar, Download, CreditCard, Clock, CheckCircle2, Filter } from 'lucide-react';

interface EarningsRecord {
  id: string;
  date: string;
  jobId: string;
  service: string;
  amount: number;
  commission: number;
  netEarnings: number;
  status: 'paid' | 'pending' | 'processing';
  paymentMethod: string;
}

export default function EarningsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMonth, setFilterMonth] = useState('all');

  // Mock data
  const earningsRecords: EarningsRecord[] = [
    {
      id: 'PAY001',
      date: '2024-12-10',
      jobId: 'JOB12345',
      service: 'Plumbing Repair',
      amount: 850,
      commission: 170,
      netEarnings: 680,
      status: 'paid',
      paymentMethod: 'Bank Transfer',
    },
    {
      id: 'PAY002',
      date: '2024-12-09',
      jobId: 'JOB12346',
      service: 'Electrical Installation',
      amount: 1200,
      commission: 240,
      netEarnings: 960,
      status: 'pending',
      paymentMethod: 'UPI',
    },
    {
      id: 'PAY003',
      date: '2024-12-08',
      jobId: 'JOB12347',
      service: 'AC Servicing',
      amount: 650,
      commission: 130,
      netEarnings: 520,
      status: 'processing',
      paymentMethod: 'Bank Transfer',
    },
    {
      id: 'PAY004',
      date: '2024-12-07',
      jobId: 'JOB12348',
      service: 'Carpentry Work',
      amount: 1500,
      commission: 300,
      netEarnings: 1200,
      status: 'paid',
      paymentMethod: 'UPI',
    },
  ];

  const stats = [
    { label: 'Total Earnings', value: '₹1,45,000', icon: DollarSign, color: 'bg-[#00C853]', textColor: 'text-[#00C853]' },
    { label: 'Pending Payout', value: '₹12,500', icon: Clock, color: 'bg-[#FFAB00]', textColor: 'text-[#FFAB00]' },
    { label: 'Last Payout', value: '₹25,000', icon: CheckCircle2, color: 'bg-[#1A73E8]', textColor: 'text-[#1A73E8]' },
    { label: 'This Month', value: '₹28,750', icon: TrendingUp, color: 'bg-[#6C63FF]', textColor: 'text-[#6C63FF]' },
  ];

  const monthlyEarnings = [
    { month: 'Jan', earnings: 18500, commission: 3700 },
    { month: 'Feb', earnings: 21200, commission: 4240 },
    { month: 'Mar', earnings: 19800, commission: 3960 },
    { month: 'Apr', earnings: 23500, commission: 4700 },
    { month: 'May', earnings: 25000, commission: 5000 },
    { month: 'Jun', earnings: 22300, commission: 4460 },
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      paid: 'bg-green-50 text-green-700 border-green-200',
      pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      processing: 'bg-blue-50 text-blue-700 border-blue-200',
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle2 className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'processing': return <TrendingUp className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F7FA]">
      <AdminSidebar />
      
      <div className="flex-1 ml-72 flex flex-col">
        {/* Top Navigation */}
        <div className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <div>
            <h1 className="text-2xl font-bold text-[#0B0F19]">Earnings & Payouts</h1>
            <p className="text-sm text-gray-500">Track earnings, commission and payment history</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 bg-[#1A73E8] text-white rounded-lg hover:bg-[#1557b0] transition-colors font-medium flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export Statement</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.color} bg-opacity-10 rounded-xl flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-[#0B0F19]">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Monthly Earnings Chart */}
          <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-[#0B0F19] mb-6 flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-[#1A73E8]" />
              <span>Monthly Earnings Overview</span>
            </h3>
            <div className="space-y-4">
              {monthlyEarnings.map((data) => (
                <div key={data.month}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">{data.month} 2024</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">Commission: ₹{data.commission.toLocaleString()}</span>
                      <span className="text-sm font-bold text-[#00C853]">₹{data.earnings.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-4">
                    <div
                      className="bg-gradient-to-r from-[#00C853] to-[#00a844] h-4 rounded-full transition-all flex items-center justify-end pr-2"
                      style={{ width: `${(data.earnings / 25000) * 100}%` }}
                    >
                      <span className="text-xs text-white font-bold">{Math.round((data.earnings / 25000) * 100)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Filters & Search */}
          <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by job ID, service..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A73E8] focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select
                className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A73E8] bg-white"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
              </select>
              <select
                className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A73E8] bg-white"
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="this-month">This Month</option>
                <option value="last-month">Last Month</option>
                <option value="last-3-months">Last 3 Months</option>
              </select>
            </div>
          </div>

          {/* Earnings Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-[#1A73E8] to-[#6C63FF] text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Payment ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Job ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Service</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Commission (20%)</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Net Earnings</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Payment Method</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {earningsRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-semibold text-[#1A73E8]">{record.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{new Date(record.date).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{record.jobId}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-[#0B0F19]">{record.service}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-[#0B0F19]">₹{record.amount}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-[#D32F2F]">-₹{record.commission}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-[#00C853]">₹{record.netEarnings}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <CreditCard className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{record.paymentMethod}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(record.status)}`}>
                          {getStatusIcon(record.status)}
                          <span className="capitalize">{record.status}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary Footer */}
            <div className="px-6 py-4 bg-gradient-to-r from-[#00C853] to-[#00a844] text-white">
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-white text-opacity-80 mb-1">Total Amount</p>
                  <p className="text-xl font-bold">₹{earningsRecords.reduce((sum, r) => sum + r.amount, 0).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-white text-opacity-80 mb-1">Total Commission</p>
                  <p className="text-xl font-bold">₹{earningsRecords.reduce((sum, r) => sum + r.commission, 0).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-white text-opacity-80 mb-1">Net Earnings</p>
                  <p className="text-xl font-bold">₹{earningsRecords.reduce((sum, r) => sum + r.netEarnings, 0).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-white text-opacity-80 mb-1">Transactions</p>
                  <p className="text-xl font-bold">{earningsRecords.length}</p>
                </div>
              </div>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <p className="text-sm text-gray-600">Showing 1-4 of 2,458 transactions</p>
              <div className="flex items-center space-x-2">
                <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                  Previous
                </button>
                <button className="px-4 py-2 bg-[#1A73E8] text-white rounded-lg text-sm font-medium hover:bg-[#1557b0] transition-colors">
                  1
                </button>
                <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                  2
                </button>
                <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                  3
                </button>
                <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
