'use client';

import React, { useState } from 'react';
import { 
  BarChart3, TrendingUp, TrendingDown, ShoppingBag, DollarSign, Users, 
  Store, AlertTriangle, XCircle, Download, Calendar, RefreshCw, Filter,
  FileText, PieChart, Award, Star, Clock, Package, ArrowUp, ArrowDown,
  CheckCircle, Edit3, Settings
} from 'lucide-react';
import TopNavbar from '../components/TopNavbar';
import LeftSidebar from '../components/LeftSidebar';

export default function ReportsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dateRange, setDateRange] = useState('last-7-days');
  const [autoRefresh, setAutoRefresh] = useState(false);

  // KPI Data
  const kpiData = [
    {
      title: 'Total Orders',
      value: '2,456',
      change: '+12.5%',
      trend: 'up',
      subtitle: 'vs yesterday',
      color: 'from-[#10B981] to-[#059669]',
      borderColor: 'border-[#10B981]',
      sparkline: [40, 45, 50, 48, 55, 60, 58],
    },
    {
      title: 'Total Earnings',
      value: '₹4,85,230',
      change: '+8.3%',
      trend: 'up',
      subtitle: 'Avg order: ₹1,245',
      color: 'from-[#3B82F6] to-[#2563EB]',
      borderColor: 'border-[#3B82F6]',
      sparkline: [35, 40, 38, 45, 50, 48, 52],
    },
    {
      title: 'Active Professionals',
      value: '342',
      change: '+5.2%',
      trend: 'up',
      subtitle: '28 new this week',
      color: 'from-[#F59E0B] to-[#D97706]',
      borderColor: 'border-[#F59E0B]',
      sparkline: [30, 32, 35, 33, 38, 40, 42],
    },
    {
      title: 'Active Shops',
      value: '156',
      change: '+3.1%',
      trend: 'up',
      subtitle: '12 new this month',
      color: 'from-[#8B5CF6] to-[#7C3AED]',
      borderColor: 'border-[#8B5CF6]',
      sparkline: [25, 28, 30, 32, 35, 38, 40],
    },
    {
      title: 'Complaints Today',
      value: '45',
      change: '-15.2%',
      trend: 'down',
      subtitle: '7 high priority',
      color: 'from-[#EF4444] to-[#DC2626]',
      borderColor: 'border-[#EF4444]',
      sparkline: [50, 48, 45, 42, 40, 38, 35],
    },
    {
      title: 'Cancelled Orders',
      value: '89',
      change: '-8.5%',
      trend: 'down',
      subtitle: '3.6% cancellation rate',
      color: 'from-[#DC2626] to-[#991B1B]',
      borderColor: 'border-[#DC2626]',
      sparkline: [45, 42, 40, 38, 35, 32, 30],
    },
  ];

  // Orders by Time
  const ordersData = [
    { day: 'Mon', completed: 320, cancelled: 25, scheduled: 45 },
    { day: 'Tue', completed: 380, cancelled: 30, scheduled: 50 },
    { day: 'Wed', completed: 450, cancelled: 35, scheduled: 60 },
    { day: 'Thu', completed: 340, cancelled: 28, scheduled: 48 },
    { day: 'Fri', completed: 420, cancelled: 32, scheduled: 55 },
    { day: 'Sat', completed: 380, cancelled: 29, scheduled: 52 },
    { day: 'Sun', completed: 290, cancelled: 22, scheduled: 40 },
  ];

  // Order Distribution by Category
  const categoryDistribution = [
    { category: 'Electrical', percentage: 28, count: 687, color: '#F59E0B' },
    { category: 'Plumbing', percentage: 22, count: 540, color: '#3B82F6' },
    { category: 'Carpentry', percentage: 18, count: 442, color: '#10B981' },
    { category: 'Cleaning', percentage: 15, count: 368, color: '#8B5CF6' },
    { category: 'Driving', percentage: 10, count: 245, color: '#EF4444' },
    { category: 'Cooking', percentage: 7, count: 172, color: '#06B6D4' },
  ];

  // Top Performing Areas
  const topAreas = [
    { area: 'Sector 15, Noida', orders: 456, revenue: '₹5,67,890' },
    { area: 'Dwarka, Delhi', orders: 398, revenue: '₹4,89,450' },
    { area: 'Gurgaon Cyber City', orders: 342, revenue: '₹4,23,120' },
    { area: 'Rohini, Delhi', orders: 289, revenue: '₹3,56,780' },
    { area: 'Vasant Kunj', orders: 256, revenue: '₹3,18,900' },
  ];

  // Revenue Breakdown
  const revenueBreakdown = [
    { source: 'Service Fees', amount: '₹2,85,450', percentage: 58.8, trend: 'up' },
    { source: 'Shop Sales', amount: '₹1,45,230', percentage: 29.9, trend: 'up' },
    { source: 'Platform Commission', amount: '₹42,350', percentage: 8.7, trend: 'up' },
    { source: 'Taxes & Others', amount: '₹12,200', percentage: 2.6, trend: 'down' },
  ];

  // Top Professionals
  const topProfessionals = [
    { name: 'Rajesh Kumar', category: 'Electrician', rating: 4.8, jobs: 342, earnings: '₹1,23,450', cancelRate: '2%' },
    { name: 'Amit Sharma', category: 'Plumber', rating: 4.7, jobs: 298, earnings: '₹98,760', cancelRate: '3%' },
    { name: 'Priya Patel', category: 'Carpenter', rating: 4.9, jobs: 256, earnings: '₹1,45,230', cancelRate: '1%' },
    { name: 'Vikram Singh', category: 'Driver', rating: 4.6, jobs: 412, earnings: '₹87,650', cancelRate: '4%' },
    { name: 'Neha Gupta', category: 'Cleaner', rating: 4.8, jobs: 378, earnings: '₹76,340', cancelRate: '2%' },
  ];

  // User Growth Data
  const userGrowthData = [
    { day: 'Mon', newUsers: 45, returning: 280 },
    { day: 'Tue', newUsers: 52, returning: 310 },
    { day: 'Wed', newUsers: 68, returning: 340 },
    { day: 'Thu', newUsers: 48, returning: 295 },
    { day: 'Fri', newUsers: 62, returning: 320 },
    { day: 'Sat', newUsers: 58, returning: 305 },
    { day: 'Sun', newUsers: 42, returning: 270 },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      <TopNavbar />
      <div className="flex">
        <LeftSidebar isOpen={sidebarOpen} />
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
          <div className="p-8">
            <div className="max-w-[1800px] mx-auto">
              {/* Page Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-[#1E293B] mb-2 flex items-center gap-3">
                    <BarChart3 className="w-8 h-8 text-[#10B981]" />
                    Reports & Analytics Dashboard
                  </h1>
                  <p className="text-sm text-[#64748B]">Comprehensive business insights and performance metrics</p>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                  >
                    <option value="today">Today</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="last-7-days">Last 7 Days</option>
                    <option value="last-30-days">Last 30 Days</option>
                    <option value="custom">Custom Range</option>
                  </select>
                  <button className="p-2 border border-[#E2E8F0] rounded-lg hover:bg-[#F8FAFC] transition-colors">
                    <RefreshCw className="w-5 h-5 text-[#64748B]" />
                  </button>
                  <button className="px-4 py-2 bg-[#EF4444] text-white rounded-lg hover:bg-[#DC2626] transition-colors flex items-center gap-2 text-sm font-medium">
                    <Download className="w-4 h-4" />
                    PDF
                  </button>
                  <button className="px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-colors flex items-center gap-2 text-sm font-medium">
                    <Download className="w-4 h-4" />
                    Excel
                  </button>
                  <button className="px-4 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors flex items-center gap-2 text-sm font-medium">
                    <Download className="w-4 h-4" />
                    CSV
                  </button>
                </div>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-6">
                {kpiData.map((kpi, index) => (
                  <div key={index} className={`bg-white rounded-xl border-l-4 ${kpi.borderColor} p-5 shadow-sm hover:shadow-md transition-shadow`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className="text-xs font-medium text-[#64748B] mb-1">{kpi.title}</p>
                        <p className="text-2xl font-bold text-[#1E293B] mb-1">{kpi.value}</p>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold flex items-center gap-1 ${
                            kpi.trend === 'up' ? 'text-[#10B981]' : 'text-[#EF4444]'
                          }`}>
                            {kpi.trend === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                            {kpi.change}
                          </span>
                          <span className="text-xs text-[#64748B]">{kpi.subtitle}</span>
                        </div>
                      </div>
                    </div>
                    {/* Sparkline */}
                    <div className="flex items-end justify-between h-8 gap-1">
                      {kpi.sparkline.map((value, idx) => (
                        <div
                          key={idx}
                          className={`flex-1 bg-gradient-to-t ${kpi.color} rounded-sm`}
                          style={{ height: `${(value / 60) * 100}%` }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Advanced Filter Panel */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 mb-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-[#1E293B] flex items-center gap-2">
                    <Filter className="w-5 h-5 text-[#10B981]" />
                    Advanced Filters
                  </h2>
                  <button className="text-sm text-[#3B82F6] hover:underline font-medium">Reset All</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                  <select className="px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]">
                    <option>All Cities</option>
                    <option>Delhi</option>
                    <option>Noida</option>
                    <option>Gurgaon</option>
                  </select>
                  <select className="px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]">
                    <option>All Categories</option>
                    <option>Electrical</option>
                    <option>Plumbing</option>
                    <option>Carpentry</option>
                  </select>
                  <select className="px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]">
                    <option>User Type</option>
                    <option>Shop</option>
                    <option>Professional</option>
                  </select>
                  <select className="px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]">
                    <option>Payment Method</option>
                    <option>UPI</option>
                    <option>Card</option>
                    <option>Cash</option>
                  </select>
                  <select className="px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]">
                    <option>Order Status</option>
                    <option>Completed</option>
                    <option>Pending</option>
                    <option>Cancelled</option>
                  </select>
                  <select className="px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]">
                    <option>Customer Segment</option>
                    <option>New</option>
                    <option>Returning</option>
                    <option>VIP</option>
                  </select>
                  <select className="px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]">
                    <option>Service Type</option>
                    <option>Immediate</option>
                    <option>Scheduled</option>
                  </select>
                  <select className="px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]">
                    <option>Revenue Source</option>
                    <option>Service</option>
                    <option>Shop</option>
                  </select>
                </div>
              </div>

              {/* Orders Overview Section */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
                {/* Line Chart - Orders vs Time */}
                <div className="xl:col-span-2 bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-[#1E293B]">📈 Orders vs Time</h2>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-[#10B981] text-white rounded-lg text-xs font-medium">Day</button>
                      <button className="px-3 py-1 bg-[#F8FAFC] text-[#64748B] rounded-lg text-xs font-medium">Week</button>
                      <button className="px-3 py-1 bg-[#F8FAFC] text-[#64748B] rounded-lg text-xs font-medium">Month</button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {ordersData.map((data, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-[#64748B]">{data.day}</span>
                          <div className="flex items-center gap-4 text-xs">
                            <span className="text-[#10B981]">✓ {data.completed}</span>
                            <span className="text-[#EF4444]">✗ {data.cancelled}</span>
                            <span className="text-[#3B82F6]">⏱ {data.scheduled}</span>
                          </div>
                        </div>
                        <div className="relative h-10 bg-[#F8FAFC] rounded-lg overflow-hidden">
                          <div 
                            className="absolute left-0 h-full bg-[#10B981]"
                            style={{ width: `${(data.completed / 500) * 100}%` }}
                          />
                          <div 
                            className="absolute h-full bg-[#EF4444]"
                            style={{ 
                              left: `${(data.completed / 500) * 100}%`,
                              width: `${(data.cancelled / 500) * 100}%` 
                            }}
                          />
                          <div 
                            className="absolute h-full bg-[#3B82F6]"
                            style={{ 
                              left: `${((data.completed + data.cancelled) / 500) * 100}%`,
                              width: `${(data.scheduled / 500) * 100}%` 
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-[#E2E8F0]">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-[#10B981] rounded-full" />
                      <span className="text-sm text-[#64748B]">Completed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-[#EF4444] rounded-full" />
                      <span className="text-sm text-[#64748B]">Cancelled</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-[#3B82F6] rounded-full" />
                      <span className="text-sm text-[#64748B]">Scheduled</span>
                    </div>
                  </div>
                </div>

                {/* Pie Chart - Order Distribution */}
                <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                  <h2 className="text-lg font-bold text-[#1E293B] mb-6">📊 Order Distribution</h2>
                  <div className="relative w-48 h-48 mx-auto mb-6">
                    <svg viewBox="0 0 100 100" className="transform -rotate-90">
                      {categoryDistribution.reduce((acc, cat, idx) => {
                        const prevPercentage = categoryDistribution.slice(0, idx).reduce((sum, c) => sum + c.percentage, 0);
                        const strokeDasharray = `${cat.percentage} ${100 - cat.percentage}`;
                        const strokeDashoffset = -prevPercentage;
                        acc.push(
                          <circle
                            key={idx}
                            cx="50"
                            cy="50"
                            r="15.9"
                            fill="transparent"
                            stroke={cat.color}
                            strokeWidth="8"
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={strokeDashoffset}
                          />
                        );
                        return acc;
                      }, [] as React.ReactElement[])}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <p className="text-2xl font-bold text-[#1E293B]">2,454</p>
                      <p className="text-xs text-[#64748B]">Total Orders</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {categoryDistribution.map((cat, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                          <span className="text-sm text-[#64748B]">{cat.category}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-[#1E293B]">{cat.count}</span>
                          <span className="text-xs text-[#64748B]">({cat.percentage}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Top Performing Areas */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 mb-6 shadow-sm">
                <h2 className="text-lg font-bold text-[#1E293B] mb-6">📊 Top Performing Areas</h2>
                <div className="space-y-4">
                  {topAreas.map((area, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-[#10B981]">#{index + 1}</span>
                          <span className="text-sm font-medium text-[#1E293B]">{area.area}</span>
                        </div>
                        <div className="flex items-center gap-6">
                          <span className="text-sm text-[#64748B]">{area.orders} orders</span>
                          <span className="text-sm font-bold text-[#1E293B]">{area.revenue}</span>
                        </div>
                      </div>
                      <div className="w-full bg-[#F8FAFC] rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-[#10B981] to-[#059669] h-2 rounded-full"
                          style={{ width: `${(area.orders / 456) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Reports Section */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                {/* Revenue Breakdown */}
                <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                  <h2 className="text-lg font-bold text-[#1E293B] mb-6">💰 Revenue Breakdown</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#E2E8F0]">
                          <th className="text-left text-xs font-semibold text-[#64748B] pb-3">Source</th>
                          <th className="text-right text-xs font-semibold text-[#64748B] pb-3">Amount</th>
                          <th className="text-right text-xs font-semibold text-[#64748B] pb-3">% Share</th>
                          <th className="text-center text-xs font-semibold text-[#64748B] pb-3">Trend</th>
                        </tr>
                      </thead>
                      <tbody>
                        {revenueBreakdown.map((item, index) => (
                          <tr key={index} className="border-b border-[#E2E8F0] last:border-0">
                            <td className="py-4 text-sm font-medium text-[#1E293B]">{item.source}</td>
                            <td className="py-4 text-sm font-bold text-[#1E293B] text-right">{item.amount}</td>
                            <td className="py-4 text-sm text-[#64748B] text-right">{item.percentage}%</td>
                            <td className="py-4 text-center">
                              {item.trend === 'up' ? (
                                <TrendingUp className="w-4 h-4 text-[#10B981] mx-auto" />
                              ) : (
                                <TrendingDown className="w-4 h-4 text-[#EF4444] mx-auto" />
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-6 pt-6 border-t border-[#E2E8F0]">
                    <h3 className="text-sm font-bold text-[#1E293B] mb-3">🧾 Downloadable Reports</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <button className="px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] rounded-lg hover:bg-[#E2E8F0] transition-colors text-xs font-medium">
                        Daily Sales Report
                      </button>
                      <button className="px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] rounded-lg hover:bg-[#E2E8F0] transition-colors text-xs font-medium">
                        Monthly P&L
                      </button>
                      <button className="px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] rounded-lg hover:bg-[#E2E8F0] transition-colors text-xs font-medium">
                        Commission Report
                      </button>
                      <button className="px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] rounded-lg hover:bg-[#E2E8F0] transition-colors text-xs font-medium">
                        GST Report
                      </button>
                      <button className="px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] rounded-lg hover:bg-[#E2E8F0] transition-colors text-xs font-medium">
                        Settlement Report
                      </button>
                      <button className="px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] rounded-lg hover:bg-[#E2E8F0] transition-colors text-xs font-medium">
                        Payout Report
                      </button>
                    </div>
                  </div>
                </div>

                {/* Revenue Graph */}
                <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                  <h2 className="text-lg font-bold text-[#1E293B] mb-6">💰 Revenue Graph</h2>
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-[#64748B]">Daily Revenue</span>
                      <span className="text-sm font-bold text-[#1E293B]">₹69,318 avg</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-[#64748B]">Peak Hours</span>
                      <span className="text-sm font-bold text-[#1E293B]">2PM - 6PM</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-[#64748B]">Avg per Customer</span>
                      <span className="text-sm font-bold text-[#1E293B]">₹1,245</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                      const revenue = [65000, 72000, 68000, 75000, 71000, 69000, 64000][index];
                      return (
                        <div key={day}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-[#64748B]">{day}</span>
                            <span className="text-sm font-bold text-[#1E293B]">₹{revenue.toLocaleString()}</span>
                          </div>
                          <div className="w-full bg-[#F8FAFC] rounded-full h-3">
                            <div 
                              className="bg-gradient-to-r from-[#3B82F6] to-[#2563EB] h-3 rounded-full"
                              style={{ width: `${(revenue / 75000) * 100}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Professional Performance */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 mb-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-[#1E293B]">📈 Best Performing Professionals</h2>
                  <button className="text-sm text-[#3B82F6] hover:underline font-medium">View All →</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#E2E8F0]">
                        <th className="text-left text-xs font-semibold text-[#64748B] pb-3">Name</th>
                        <th className="text-left text-xs font-semibold text-[#64748B] pb-3">Category</th>
                        <th className="text-center text-xs font-semibold text-[#64748B] pb-3">Avg Rating</th>
                        <th className="text-center text-xs font-semibold text-[#64748B] pb-3">Jobs Completed</th>
                        <th className="text-right text-xs font-semibold text-[#64748B] pb-3">Earnings</th>
                        <th className="text-center text-xs font-semibold text-[#64748B] pb-3">Cancel Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topProfessionals.map((pro, index) => (
                        <tr key={index} className="border-b border-[#E2E8F0] last:border-0 hover:bg-[#F8FAFC] transition-colors">
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <span className="text-lg font-bold text-[#10B981]">#{index + 1}</span>
                              <span className="text-sm font-medium text-[#1E293B]">{pro.name}</span>
                            </div>
                          </td>
                          <td className="py-4 text-sm text-[#64748B]">{pro.category}</td>
                          <td className="py-4">
                            <div className="flex items-center justify-center gap-1">
                              <Star className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" />
                              <span className="text-sm font-bold text-[#1E293B]">{pro.rating}</span>
                            </div>
                          </td>
                          <td className="py-4 text-sm font-bold text-[#1E293B] text-center">{pro.jobs}</td>
                          <td className="py-4 text-sm font-bold text-[#1E293B] text-right">{pro.earnings}</td>
                          <td className="py-4 text-center">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              parseInt(pro.cancelRate) <= 2 ? 'bg-[#D1FAE5] text-[#065F46]' :
                              parseInt(pro.cancelRate) <= 4 ? 'bg-[#FEF3C7] text-[#92400E]' :
                              'bg-[#FEE2E2] text-[#991B1B]'
                            }`}>
                              {pro.cancelRate}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* User Growth Analytics */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 mb-6 shadow-sm">
                <h2 className="text-lg font-bold text-[#1E293B] mb-6">🟩 User Growth Analytics</h2>
                <div className="space-y-4">
                  {userGrowthData.map((data, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-[#64748B]">{data.day}</span>
                        <div className="flex items-center gap-4 text-xs">
                          <span className="text-[#3B82F6]">New: {data.newUsers}</span>
                          <span className="text-[#10B981]">Returning: {data.returning}</span>
                        </div>
                      </div>
                      <div className="relative h-8 bg-[#F8FAFC] rounded-lg overflow-hidden">
                        <div 
                          className="absolute left-0 h-full bg-[#3B82F6]"
                          style={{ width: `${(data.newUsers / 400) * 100}%` }}
                        />
                        <div 
                          className="absolute h-full bg-[#10B981]"
                          style={{ 
                            left: `${(data.newUsers / 400) * 100}%`,
                            width: `${(data.returning / 400) * 100}%` 
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Export Full Report & Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Export Full Report */}
                <div className="bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl p-8 text-white shadow-lg">
                  <h2 className="text-xl font-bold mb-3">📥 Download Full Business Report</h2>
                  <p className="text-sm text-white/80 mb-6">
                    Comprehensive report including overview, financials, trends, user behavior, high-risk flags, and payout summary
                  </p>
                  <button className="w-full px-6 py-4 bg-white text-[#10B981] rounded-xl hover:bg-[#F8FAFC] transition-all text-base font-bold flex items-center justify-center gap-3">
                    <Download className="w-5 h-5" />
                    Download PDF Report
                  </button>
                </div>

                {/* Report Automation Settings */}
                <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                  <h2 className="text-lg font-bold text-[#1E293B] mb-4 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-[#10B981]" />
                    Report Automation Settings
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-[#64748B] mb-2 block">Auto-generate reports</label>
                      <select className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm">
                        <option>Daily at 9 AM</option>
                        <option>Weekly on Monday</option>
                        <option>Monthly on 1st</option>
                        <option>Disabled</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-[#64748B] mb-2 block">Send to email</label>
                      <input 
                        type="email" 
                        placeholder="admin@platform.com" 
                        className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-[#64748B] mb-2 block">Include sections</label>
                      <div className="space-y-2">
                        {['Overview', 'Financials', 'Orders', 'Users', 'Complaints'].map((section) => (
                          <label key={section} className="flex items-center gap-2">
                            <input type="checkbox" defaultChecked className="w-4 h-4" />
                            <span className="text-sm text-[#64748B]">{section}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <button className="w-full px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-colors text-sm font-medium">
                      Save Settings
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
