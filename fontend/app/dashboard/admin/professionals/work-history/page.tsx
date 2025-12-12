'use client';

import React, { useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { Search, Filter, Calendar, MapPin, User, DollarSign, Clock, CheckCircle2, XCircle, AlertCircle, TrendingUp, BarChart3, Download } from 'lucide-react';

interface WorkHistory {
  jobId: string;
  date: string;
  service: string;
  customer: string;
  location: string;
  earnings: number;
  duration: string;
  status: 'completed' | 'cancelled' | 'ongoing' | 'refund';
}

export default function WorkHistoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMonth, setFilterMonth] = useState('all');

  // Mock data
  const workHistory: WorkHistory[] = [
    {
      jobId: 'JOB12345',
      date: '2024-12-10',
      service: 'Plumbing Repair',
      customer: 'Amit Sharma',
      location: 'Mumbai, MH',
      earnings: 850,
      duration: '2h 30m',
      status: 'completed',
    },
    {
      jobId: 'JOB12346',
      date: '2024-12-09',
      service: 'Electrical Installation',
      customer: 'Priya Patel',
      location: 'Delhi, DL',
      earnings: 1200,
      duration: '3h 15m',
      status: 'completed',
    },
    {
      jobId: 'JOB12347',
      date: '2024-12-08',
      service: 'AC Servicing',
      customer: 'Rahul Gupta',
      location: 'Bangalore, KA',
      earnings: 650,
      duration: '1h 45m',
      status: 'cancelled',
    },
    {
      jobId: 'JOB12348',
      date: '2024-12-07',
      service: 'Carpentry Work',
      customer: 'Neha Singh',
      location: 'Pune, MH',
      earnings: 1500,
      duration: '4h 20m',
      status: 'refund',
    },
  ];

  const stats = [
    { label: 'Total Jobs', value: '2,458', icon: CheckCircle2, color: 'bg-[#1A73E8]', textColor: 'text-[#1A73E8]' },
    { label: 'Completed', value: '2,195', icon: CheckCircle2, color: 'bg-[#00C853]', textColor: 'text-[#00C853]' },
    { label: 'Cancelled', value: '142', icon: XCircle, color: 'bg-[#D32F2F]', textColor: 'text-[#D32F2F]' },
    { label: 'Avg. Rating', value: '4.7★', icon: TrendingUp, color: 'bg-[#FFAB00]', textColor: 'text-[#FFAB00]' },
  ];

  const monthlyData = [
    { month: 'Jan', completed: 185, cancelled: 12 },
    { month: 'Feb', completed: 192, cancelled: 8 },
    { month: 'Mar', completed: 205, cancelled: 15 },
    { month: 'Apr', completed: 198, cancelled: 10 },
    { month: 'May', completed: 210, cancelled: 14 },
    { month: 'Jun', completed: 188, cancelled: 9 },
  ];

  const categoryPerformance = [
    { category: 'Plumbing', jobs: 520, earnings: 442000, rating: 4.8 },
    { category: 'Electrical', jobs: 485, earnings: 582000, rating: 4.7 },
    { category: 'Carpentry', jobs: 380, earnings: 570000, rating: 4.6 },
    { category: 'AC Repair', jobs: 295, earnings: 192250, rating: 4.9 },
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      completed: 'bg-green-50 text-green-700 border-green-200',
      cancelled: 'bg-red-50 text-red-700 border-red-200',
      ongoing: 'bg-blue-50 text-blue-700 border-blue-200',
      refund: 'bg-orange-50 text-orange-700 border-orange-200',
    };
    return styles[status as keyof typeof styles] || styles.completed;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      case 'ongoing': return <Clock className="w-4 h-4" />;
      case 'refund': return <AlertCircle className="w-4 h-4" />;
      default: return <CheckCircle2 className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F7FA]">
      <AdminSidebar />
      
      <div className="flex-1 ml-72 flex flex-col">
        {/* Top Navigation */}
        <div className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <div>
            <h1 className="text-2xl font-bold text-[#0B0F19]">Work History & Analytics</h1>
            <p className="text-sm text-gray-500">Complete job history and performance analytics</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 bg-[#1A73E8] text-white rounded-lg hover:bg-[#1557b0] transition-colors font-medium flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export Report</span>
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

          {/* Analytics Charts */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Monthly Completed Jobs */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-[#0B0F19] mb-6 flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-[#1A73E8]" />
                <span>Monthly Job Completion</span>
              </h3>
              <div className="space-y-4">
                {monthlyData.map((data) => (
                  <div key={data.month}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">{data.month}</span>
                      <span className="text-sm font-bold text-[#0B0F19]">{data.completed} completed</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-[#1A73E8] to-[#6C63FF] h-3 rounded-full transition-all"
                        style={{ width: `${(data.completed / 220) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Performance */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-[#0B0F19] mb-6 flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-[#1A73E8]" />
                <span>Category Performance</span>
              </h3>
              <div className="space-y-4">
                {categoryPerformance.map((cat) => (
                  <div key={cat.category} className="border border-gray-100 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-[#0B0F19]">{cat.category}</span>
                      <span className="text-sm text-yellow-600 font-bold">{cat.rating}★</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Jobs Completed</p>
                        <p className="font-bold text-[#0B0F19]">{cat.jobs}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Total Earnings</p>
                        <p className="font-bold text-[#00C853]">₹{cat.earnings.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by job ID, customer, service..."
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
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="ongoing">Ongoing</option>
                <option value="refund">Refund Issued</option>
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
                <option value="last-6-months">Last 6 Months</option>
              </select>
            </div>
          </div>

          {/* Work History Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-[#1A73E8] to-[#6C63FF] text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Job ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Service</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Customer</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Location</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Earnings</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Duration</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {workHistory.map((job) => (
                    <tr key={job.jobId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-semibold text-[#1A73E8]">{job.jobId}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{new Date(job.date).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-[#0B0F19]">{job.service}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{job.customer}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{job.location}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4 text-[#00C853]" />
                          <span className="text-sm font-bold text-[#00C853]">₹{job.earnings}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{job.duration}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(job.status)}`}>
                          {getStatusIcon(job.status)}
                          <span className="capitalize">{job.status}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <p className="text-sm text-gray-600">Showing 1-4 of 2,458 jobs</p>
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
