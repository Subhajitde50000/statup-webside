'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, TrendingUp, TrendingDown, ShoppingBag, DollarSign, Users, 
  Store, AlertTriangle, XCircle, Download, Calendar, RefreshCw, Filter,
  FileText, PieChart, Award, Star, Clock, Package, ArrowUp, ArrowDown,
  CheckCircle, Edit3, Settings, Activity, Target, Zap, Percent, Eye,
  ThumbsUp, MessageSquare, MapPin, CreditCard, Smartphone, Globe,
  Briefcase, TrendingDown as TrendDown, Shield, Bell
} from 'lucide-react';
import TopNavbar from '../components/TopNavbar';
import LeftSidebar from '../components/LeftSidebar';

export default function ReportsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dateRange, setDateRange] = useState('last-7-days');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [ordersPeriod, setOrdersPeriod] = useState<'week' | 'month' | 'year'>('week');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // KPI Data - Enhanced with more metrics
  const kpiData = [
    {
      title: 'Total Revenue',
      value: '₹8,45,230',
      change: '+18.2%',
      trend: 'up',
      subtitle: 'vs last week',
      color: 'from-[#10B981] to-[#059669]',
      borderColor: 'border-[#10B981]',
      icon: DollarSign,
      sparkline: [40, 45, 50, 48, 55, 60, 62, 65],
      target: 90,
      details: { today: '₹1,21,180', average: '₹1,20,748' }
    },
    {
      title: 'Total Orders',
      value: '3,847',
      change: '+12.5%',
      trend: 'up',
      subtitle: 'Completion: 94.2%',
      color: 'from-[#3B82F6] to-[#2563EB]',
      borderColor: 'border-[#3B82F6]',
      icon: Package,
      sparkline: [35, 40, 38, 45, 50, 48, 52, 55],
      target: 85,
      details: { today: '549', average: '549' }
    },
    {
      title: 'Active Users',
      value: '12,456',
      change: '+24.8%',
      trend: 'up',
      subtitle: '1,847 new users',
      color: 'from-[#8B5CF6] to-[#7C3AED]',
      borderColor: 'border-[#8B5CF6]',
      icon: Users,
      sparkline: [30, 35, 40, 42, 48, 52, 55, 58],
      target: 95,
      details: { today: '1,780', average: '1,779' }
    },
    {
      title: 'Professionals',
      value: '542',
      change: '+8.4%',
      trend: 'up',
      subtitle: '38 new this week',
      color: 'from-[#F59E0B] to-[#D97706]',
      borderColor: 'border-[#F59E0B]',
      icon: Briefcase,
      sparkline: [30, 32, 35, 33, 38, 40, 42, 44],
      target: 75,
      details: { today: '487 active', average: '485' }
    },
    {
      title: 'Active Shops',
      value: '256',
      change: '+5.7%',
      trend: 'up',
      subtitle: '18 new registrations',
      color: 'from-[#06B6D4] to-[#0891B2]',
      borderColor: 'border-[#06B6D4]',
      icon: Store,
      sparkline: [25, 28, 30, 32, 35, 38, 40, 42],
      target: 80,
      details: { today: '234 active', average: '231' }
    },
    {
      title: 'Avg Rating',
      value: '4.7',
      change: '+0.3',
      trend: 'up',
      subtitle: 'Customer satisfaction',
      color: 'from-[#EC4899] to-[#DB2777]',
      borderColor: 'border-[#EC4899]',
      icon: Star,
      sparkline: [4.2, 4.3, 4.4, 4.5, 4.6, 4.6, 4.7, 4.7],
      target: 94,
      details: { today: '4.7/5.0', average: '4.6/5.0' }
    },
    {
      title: 'Response Time',
      value: '3.2 min',
      change: '-12.5%',
      trend: 'down',
      subtitle: 'Faster than target',
      color: 'from-[#14B8A6] to-[#0D9488]',
      borderColor: 'border-[#14B8A6]',
      icon: Clock,
      sparkline: [5, 4.8, 4.5, 4.2, 3.8, 3.5, 3.3, 3.2],
      target: 88,
      details: { today: '3.2 min', target: '5 min' }
    },
    {
      title: 'Conversion Rate',
      value: '68.4%',
      change: '+5.2%',
      trend: 'up',
      subtitle: 'Above target',
      color: 'from-[#EF4444] to-[#DC2626]',
      borderColor: 'border-[#EF4444]',
      icon: Target,
      sparkline: [60, 62, 64, 65, 66, 67, 68, 68.4],
      target: 92,
      details: { today: '68.4%', target: '65%' }
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

  // Monthly Orders Data
  const monthlyOrdersData = [
    { day: 'Week 1', completed: 2450, cancelled: 180, scheduled: 320 },
    { day: 'Week 2', completed: 2680, cancelled: 195, scheduled: 350 },
    { day: 'Week 3', completed: 2890, cancelled: 210, scheduled: 380 },
    { day: 'Week 4', completed: 2520, cancelled: 175, scheduled: 310 },
  ];

  // Yearly Orders Data
  const yearlyOrdersData = [
    { day: 'Jan', completed: 8450, cancelled: 520, scheduled: 1120 },
    { day: 'Feb', completed: 9200, cancelled: 580, scheduled: 1240 },
    { day: 'Mar', completed: 10100, cancelled: 620, scheduled: 1380 },
    { day: 'Apr', completed: 9580, cancelled: 590, scheduled: 1290 },
    { day: 'May', completed: 10450, cancelled: 640, scheduled: 1420 },
    { day: 'Jun', completed: 9820, cancelled: 610, scheduled: 1340 },
    { day: 'Jul', completed: 10680, cancelled: 660, scheduled: 1480 },
    { day: 'Aug', completed: 11200, cancelled: 690, scheduled: 1560 },
    { day: 'Sep', completed: 10890, cancelled: 670, scheduled: 1510 },
    { day: 'Oct', completed: 11450, cancelled: 710, scheduled: 1590 },
    { day: 'Nov', completed: 10980, cancelled: 680, scheduled: 1530 },
    { day: 'Dec', completed: 12100, cancelled: 740, scheduled: 1680 },
  ];

  // Get current orders data based on selected period
  const getCurrentOrdersData = () => {
    switch (ordersPeriod) {
      case 'month':
        return monthlyOrdersData;
      case 'year':
        return yearlyOrdersData;
      default:
        return ordersData;
    }
  };

  // Get max value for scaling based on period
  const getMaxOrderValue = () => {
    switch (ordersPeriod) {
      case 'month':
        return 3500;
      case 'year':
        return 15000;
      default:
        return 600;
    }
  };

  // Get total orders based on period
  const getTotalOrders = () => {
    const data = getCurrentOrdersData();
    return data.reduce((sum, item) => sum + item.completed + item.cancelled + item.scheduled, 0);
  };

  // Get completion rate
  const getCompletionRate = () => {
    const data = getCurrentOrdersData();
    const total = data.reduce((sum, item) => sum + item.completed + item.cancelled + item.scheduled, 0);
    const completed = data.reduce((sum, item) => sum + item.completed, 0);
    return ((completed / total) * 100).toFixed(1);
  };

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
              {/* Page Header - Enhanced */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-2xl flex items-center justify-center shadow-lg">
                    <BarChart3 className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-[#1E293B] mb-1 flex items-center gap-3">
                      Advanced Analytics Dashboard
                      <span className="px-3 py-1 bg-gradient-to-r from-[#10B981] to-[#059669] text-white text-xs font-bold rounded-full flex items-center gap-1">
                        <Activity className="w-3 h-3" />
                        LIVE
                      </span>
                    </h1>
                    <p className="text-sm text-[#64748B] flex items-center gap-3">
                      Real-time business intelligence & performance metrics
                      <span className="text-xs text-[#10B981] font-semibold">
                        Last updated: {currentTime.toLocaleTimeString()}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setAutoRefresh(!autoRefresh)}
                    className={`px-4 py-2.5 border rounded-xl transition-all flex items-center gap-2 text-sm font-medium ${
                      autoRefresh 
                        ? 'bg-[#10B981] text-white border-[#10B981]' 
                        : 'bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#10B981]'
                    }`}
                  >
                    <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
                    Auto-refresh
                  </button>
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="px-4 py-2.5 text-gray-700 bg-white border border-[#E2E8F0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent font-medium"
                  >
                    <option value="today">📅 Today</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="last-7-days">Last 7 Days</option>
                    <option value="last-30-days">Last 30 Days</option>
                    <option value="this-month">This Month</option>
                    <option value="last-month">Last Month</option>
                    <option value="custom">Custom Range</option>
                  </select>
                  <button className="px-5 py-2.5 bg-gradient-to-r from-[#EF4444] to-[#DC2626] text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2 text-sm font-bold">
                    <Download className="w-4 h-4" />
                    PDF
                  </button>
                  <button className="px-5 py-2.5 bg-gradient-to-r from-[#10B981] to-[#059669] text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2 text-sm font-bold">
                    <Download className="w-4 h-4" />
                    Excel
                  </button>
                </div>
              </div>

              {/* KPI Cards - Enhanced Design */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                {kpiData.map((kpi, index) => {
                  const Icon = kpi.icon;
                  return (
                    <div 
                      key={index} 
                      className="group bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm hover:shadow-xl hover:border-transparent hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
                    >
                      {/* Background Gradient Effect */}
                      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${kpi.color} opacity-5 rounded-full -mr-16 -mt-16 group-hover:opacity-10 transition-opacity`} />
                      
                      <div className="relative z-10">
                        {/* Header with Icon */}
                        <div className="flex items-start justify-between mb-4">
                          <div className={`w-12 h-12 bg-gradient-to-br ${kpi.color} rounded-xl flex items-center justify-center shadow-lg`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                            kpi.trend === 'up' 
                              ? 'bg-[#D1FAE5] text-[#065F46]' 
                              : 'bg-[#FEE2E2] text-[#991B1B]'
                          }`}>
                            {kpi.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {kpi.change}
                          </div>
                        </div>

                        {/* Title and Value */}
                        <p className="text-sm font-semibold text-[#64748B] mb-2">{kpi.title}</p>
                        <p className="text-3xl font-bold text-[#1E293B] mb-1">{kpi.value}</p>
                        <p className="text-xs text-[#94A3B8] mb-4">{kpi.subtitle}</p>

                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-[#64748B]">Target Progress</span>
                            <span className="text-xs font-bold text-[#1E293B]">{kpi.target}%</span>
                          </div>
                          <div className="w-full bg-[#F1F5F9] rounded-full h-2 overflow-hidden">
                            <div 
                              className={`h-full bg-gradient-to-r ${kpi.color} rounded-full transition-all duration-500`}
                              style={{ width: `${kpi.target}%` }}
                            />
                          </div>
                        </div>

                        {/* Sparkline */}
                        <div className="flex items-end justify-between h-12 gap-1">
                          {kpi.sparkline.map((value, idx) => (
                            <div
                              key={idx}
                              className={`flex-1 bg-gradient-to-t ${kpi.color} rounded-t-sm transition-all duration-300 group-hover:opacity-100 opacity-60`}
                              style={{ height: `${(value / Math.max(...kpi.sparkline)) * 100}%` }}
                            />
                          ))}
                        </div>

                        {/* Details on Hover */}
                        <div className="mt-4 pt-4 border-t border-[#E2E8F0] opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-[#64748B]">Today:</span>
                            <span className="font-bold text-[#1E293B]">{kpi.details.today}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs mt-1">
                            <span className="text-[#64748B]">Average:</span>
                            <span className="font-bold text-[#1E293B]">{kpi.details.average}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Advanced Filter Panel - Enhanced */}
              <div className="bg-gradient-to-br from-white to-[#F8FAFC] rounded-2xl border border-[#E2E8F0] p-6 mb-8 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-bold text-[#1E293B] flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-xl flex items-center justify-center">
                      <Filter className="w-5 h-5 text-white" />
                    </div>
                    Advanced Filters & Segmentation
                  </h2>
                  <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-white border border-[#E2E8F0] text-[#64748B] rounded-xl hover:border-[#3B82F6] hover:text-[#3B82F6] transition-all text-sm font-medium">
                      Save Filter
                    </button>
                    <button className="text-sm text-[#3B82F6] hover:text-[#2563EB] font-bold flex items-center gap-1">
                      <RefreshCw className="w-4 h-4" />
                      Reset All
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                  {[
                    { label: 'All Cities', options: ['Delhi', 'Noida', 'Gurgaon', 'Mumbai', 'Bangalore'] },
                    { label: 'All Categories', options: ['Electrical', 'Plumbing', 'Carpentry', 'Cleaning'] },
                    { label: 'User Type', options: ['Shop', 'Professional', 'Customer'] },
                    { label: 'Payment Method', options: ['UPI', 'Card', 'Cash', 'Wallet'] },
                    { label: 'Order Status', options: ['Completed', 'Pending', 'Cancelled', 'Processing'] },
                    { label: 'Customer Segment', options: ['New', 'Returning', 'VIP', 'Inactive'] },
                    { label: 'Service Type', options: ['Immediate', 'Scheduled', 'Recurring'] },
                    { label: 'Revenue Source', options: ['Service', 'Shop', 'Commission', 'Subscription'] }
                  ].map((filter, idx) => (
                    <select 
                      key={idx}
                      className="px-3 py-2.5 text-gray-700 bg-white border border-[#E2E8F0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent font-medium transition-all"
                    >
                      <option>{filter.label}</option>
                      {filter.options.map((opt, i) => (
                        <option key={i}>{opt}</option>
                      ))}
                    </select>
                  ))}
                </div>
                
                {/* Quick Filters */}
                <div className="mt-5 pt-5 border-t border-[#E2E8F0]">
                  <p className="text-sm font-semibold text-[#64748B] mb-3">Quick Filters:</p>
                  <div className="flex flex-wrap gap-2">
                    {['High Value Orders', 'New Customers', 'Repeat Bookings', 'Low Ratings', 'Pending Payments', 'Top Performers', 'At Risk'].map((tag, idx) => (
                      <button
                        key={idx}
                        className="px-4 py-2 bg-white border border-[#E2E8F0] text-[#64748B] rounded-full hover:bg-[#3B82F6] hover:text-white hover:border-[#3B82F6] transition-all text-sm font-medium"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Orders Overview Section - Enhanced */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
                {/* Line Chart - Orders vs Time - Enhanced */}
                <div className="xl:col-span-2 bg-white rounded-2xl border border-[#E2E8F0] p-7 shadow-sm hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl flex items-center justify-center">
                        <Activity className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-[#1E293B]">Orders Performance</h2>
                        <p className="text-xs text-[#64748B]">Weekly trend analysis</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setOrdersPeriod('week')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all ${
                          ordersPeriod === 'week' 
                            ? 'bg-gradient-to-r from-[#10B981] to-[#059669] text-white' 
                            : 'bg-[#F8FAFC] text-[#64748B] hover:bg-[#E2E8F0]'
                        }`}
                      >
                        Week
                      </button>
                      <button 
                        onClick={() => setOrdersPeriod('month')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all ${
                          ordersPeriod === 'month' 
                            ? 'bg-gradient-to-r from-[#10B981] to-[#059669] text-white' 
                            : 'bg-[#F8FAFC] text-[#64748B] hover:bg-[#E2E8F0]'
                        }`}
                      >
                        Month
                      </button>
                      <button 
                        onClick={() => setOrdersPeriod('year')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all ${
                          ordersPeriod === 'year' 
                            ? 'bg-gradient-to-r from-[#10B981] to-[#059669] text-white' 
                            : 'bg-[#F8FAFC] text-[#64748B] hover:bg-[#E2E8F0]'
                        }`}
                      >
                        Year
                      </button>
                    </div>
                  </div>

                  {/* Statistics Summary */}
                  <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gradient-to-br from-[#F8FAFC] to-white rounded-xl">
                    <div className="text-center">
                      <p className="text-xs font-semibold text-[#64748B] mb-1">Total Orders</p>
                      <p className="text-2xl font-bold text-[#1E293B]">{getTotalOrders().toLocaleString()}</p>
                      <p className="text-xs text-[#10B981] font-bold">+12.5%</p>
                    </div>
                    <div className="text-center border-x border-[#E2E8F0]">
                      <p className="text-xs font-semibold text-[#64748B] mb-1">Completion Rate</p>
                      <p className="text-2xl font-bold text-[#1E293B]">{getCompletionRate()}%</p>
                      <p className="text-xs text-[#10B981] font-bold">+2.1%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-semibold text-[#64748B] mb-1">Avg Value</p>
                      <p className="text-2xl font-bold text-[#1E293B]">₹1,245</p>
                      <p className="text-xs text-[#10B981] font-bold">+5.8%</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {getCurrentOrdersData().map((data, index) => {
                      const total = data.completed + data.cancelled + data.scheduled;
                      const completionRate = ((data.completed / total) * 100).toFixed(1);
                      const maxValue = getMaxOrderValue();
                      
                      return (
                        <div key={index} className="group">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-bold text-[#1E293B] w-16">{data.day}</span>
                              <span className="text-xs text-[#64748B]">({total.toLocaleString()} total)</span>
                            </div>
                            <div className="flex items-center gap-4 text-xs font-semibold">
                              <span className="flex items-center gap-1 text-[#10B981]">
                                <CheckCircle className="w-3 h-3" />
                                {data.completed.toLocaleString()}
                              </span>
                              <span className="flex items-center gap-1 text-[#EF4444]">
                                <XCircle className="w-3 h-3" />
                                {data.cancelled.toLocaleString()}
                              </span>
                              <span className="flex items-center gap-1 text-[#3B82F6]">
                                <Clock className="w-3 h-3" />
                                {data.scheduled.toLocaleString()}
                              </span>
                              <span className="text-[#8B5CF6]">{completionRate}%</span>
                            </div>
                          </div>
                          <div className="relative h-12 bg-[#F8FAFC] rounded-xl overflow-hidden group-hover:shadow-inner transition-all">
                            <div 
                              className="absolute left-0 h-full bg-gradient-to-r from-[#10B981] to-[#059669] transition-all duration-500 group-hover:opacity-90"
                              style={{ width: `${(data.completed / maxValue) * 100}%` }}
                            />
                            <div 
                              className="absolute h-full bg-gradient-to-r from-[#EF4444] to-[#DC2626] transition-all duration-500"
                              style={{ 
                                left: `${(data.completed / maxValue) * 100}%`,
                                width: `${(data.cancelled / maxValue) * 100}%` 
                              }}
                            />
                            <div 
                              className="absolute h-full bg-gradient-to-r from-[#3B82F6] to-[#2563EB] transition-all duration-500"
                              style={{ 
                                left: `${((data.completed + data.cancelled) / maxValue) * 100}%`,
                                width: `${(data.scheduled / maxValue) * 100}%` 
                              }}
                            />
                            {/* Percentage Labels */}
                            <div className="absolute inset-0 flex items-center px-3 text-xs font-bold text-white">
                              <span style={{ marginLeft: `${((data.completed / 2) / maxValue) * 100}%` }}>
                                {data.completed > (ordersPeriod === 'year' ? 5000 : ordersPeriod === 'month' ? 1000 : 50) && data.completed.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-[#E2E8F0]">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gradient-to-r from-[#10B981] to-[#059669] rounded-md" />
                      <span className="text-sm font-medium text-[#64748B]">Completed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gradient-to-r from-[#EF4444] to-[#DC2626] rounded-md" />
                      <span className="text-sm font-medium text-[#64748B]">Cancelled</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gradient-to-r from-[#3B82F6] to-[#2563EB] rounded-md" />
                      <span className="text-sm font-medium text-[#64748B]">Scheduled</span>
                    </div>
                  </div>
                </div>

                {/* Pie Chart - Order Distribution - Enhanced */}
                <div className="bg-white rounded-2xl border border-[#E2E8F0] p-7 shadow-sm hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] rounded-xl flex items-center justify-center">
                      <PieChart className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-[#1E293B]">Category Distribution</h2>
                      <p className="text-xs text-[#64748B]">By service type</p>
                    </div>
                  </div>

                  {/* Donut Chart */}
                  <div className="relative w-56 h-56 mx-auto mb-6">
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
                            strokeWidth="10"
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={strokeDashoffset}
                            className="transition-all duration-500 hover:stroke-width-12"
                          />
                        );
                        return acc;
                      }, [] as React.ReactElement[])}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <p className="text-3xl font-bold text-[#1E293B]">2,454</p>
                      <p className="text-xs text-[#64748B] font-semibold">Total Orders</p>
                      <p className="text-xs text-[#10B981] font-bold mt-1">+12.5%</p>
                    </div>
                  </div>

                  {/* Category List */}
                  <div className="space-y-3">
                    {categoryDistribution.map((cat, index) => (
                      <div key={index} className="group hover:bg-[#F8FAFC] p-2 rounded-lg transition-colors cursor-pointer">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2 flex-1">
                            <div 
                              className="w-4 h-4 rounded-lg shadow-sm group-hover:scale-110 transition-transform" 
                              style={{ backgroundColor: cat.color }} 
                            />
                            <span className="text-sm font-semibold text-[#1E293B]">{cat.category}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-[#1E293B]">{cat.count}</span>
                            <span className="text-xs font-bold text-[#64748B] bg-[#F8FAFC] px-2 py-1 rounded-md min-w-[50px] text-center">
                              {cat.percentage}%
                            </span>
                          </div>
                        </div>
                        {/* Progress bar */}
                        <div className="w-full bg-[#F1F5F9] rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-500 group-hover:h-2"
                            style={{ 
                              width: `${cat.percentage}%`,
                              backgroundColor: cat.color 
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* View Details Button */}
                  <button 
                    onClick={() => window.location.href = '/dashboard/manager/reports/category-analytics'}
                    className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white rounded-xl hover:shadow-lg transition-all text-sm font-bold flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View Detailed Analytics
                  </button>
                </div>
              </div>

              {/* Top Performing Areas - Enhanced */}
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-7 mb-8 shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-xl flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-[#1E293B]">Top Performing Locations</h2>
                      <p className="text-xs text-[#64748B]">By order volume & revenue</p>
                    </div>
                  </div>
                  <button className="text-sm text-[#3B82F6] hover:text-[#2563EB] font-bold flex items-center gap-1">
                    View Heat Map
                    <ArrowUp className="w-4 h-4 rotate-45" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                  {topAreas.map((area, index) => (
                    <div 
                      key={index}
                      className="group relative bg-gradient-to-br from-[#F8FAFC] to-white p-5 rounded-xl border border-[#E2E8F0] hover:border-[#F59E0B] hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
                    >
                      {/* Rank Badge */}
                      <div className={`absolute top-3 right-3 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                        index === 0 ? 'bg-gradient-to-br from-[#F59E0B] to-[#D97706] text-white' :
                        index === 1 ? 'bg-gradient-to-br from-[#94A3B8] to-[#64748B] text-white' :
                        index === 2 ? 'bg-gradient-to-br from-[#D97706] to-[#92400E] text-white' :
                        'bg-[#F1F5F9] text-[#64748B]'
                      }`}>
                        #{index + 1}
                      </div>

                      {/* Location Icon */}
                      <div className="w-12 h-12 bg-gradient-to-br from-[#F59E0B]/10 to-[#D97706]/10 rounded-xl flex items-center justify-center mb-4">
                        <MapPin className="w-6 h-6 text-[#F59E0B]" />
                      </div>

                      {/* Area Name */}
                      <h3 className="text-sm font-bold text-[#1E293B] mb-3">{area.area}</h3>

                      {/* Metrics */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-[#64748B]">Orders</span>
                          <span className="text-sm font-bold text-[#1E293B]">{area.orders}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-[#64748B]">Revenue</span>
                          <span className="text-sm font-bold text-[#10B981]">{area.revenue}</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-[#F1F5F9] rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-[#F59E0B] to-[#D97706] h-2 rounded-full transition-all duration-500 group-hover:scale-x-105"
                          style={{ width: `${(area.orders / 456) * 100}%` }}
                        />
                      </div>

                      {/* Performance Indicator */}
                      <div className="mt-3 flex items-center justify-center gap-1 text-xs font-bold text-[#10B981]">
                        <TrendingUp className="w-3 h-3" />
                        +{(index + 1) * 2}% vs last week
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Reports Section - Enhanced */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
                {/* Revenue Breakdown - Enhanced */}
                <div className="bg-white rounded-2xl border border-[#E2E8F0] p-7 shadow-sm hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-[#1E293B]">Revenue Breakdown</h2>
                      <p className="text-xs text-[#64748B]">By revenue source</p>
                    </div>
                  </div>
                  <div className="space-y-4 mb-6">
                    {revenueBreakdown.map((item, index) => (
                      <div key={index} className="group hover:bg-[#F8FAFC] p-4 rounded-xl transition-all cursor-pointer border border-transparent hover:border-[#E2E8F0]">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              index === 0 ? 'bg-gradient-to-br from-[#10B981] to-[#059669]' :
                              index === 1 ? 'bg-gradient-to-br from-[#3B82F6] to-[#2563EB]' :
                              index === 2 ? 'bg-gradient-to-br from-[#F59E0B] to-[#D97706]' :
                              'bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED]'
                            }`}>
                              <DollarSign className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-[#1E293B]">{item.source}</p>
                              <p className="text-xs text-[#64748B]">{item.percentage}% of total</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="text-lg font-bold text-[#1E293B]">{item.amount}</p>
                              <div className={`flex items-center justify-end gap-1 text-xs font-bold ${
                                item.trend === 'up' ? 'text-[#10B981]' : 'text-[#EF4444]'
                              }`}>
                                {item.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                {item.trend === 'up' ? '+' : '-'}8%
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full bg-[#F1F5F9] rounded-full h-2 overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 group-hover:h-2.5 ${
                              index === 0 ? 'bg-gradient-to-r from-[#10B981] to-[#059669]' :
                              index === 1 ? 'bg-gradient-to-r from-[#3B82F6] to-[#2563EB]' :
                              index === 2 ? 'bg-gradient-to-r from-[#F59E0B] to-[#D97706]' :
                              'bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED]'
                            }`}
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-6 border-t border-[#E2E8F0]">
                    <h3 className="text-sm font-bold text-[#1E293B] mb-4 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#10B981]" />
                      Quick Download Reports
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {['Daily Sales', 'Monthly P&L', 'Commission', 'GST Report', 'Settlement', 'Payout'].map((report, idx) => (
                        <button 
                          key={idx}
                          className="px-4 py-3 bg-gradient-to-br from-[#F8FAFC] to-white border border-[#E2E8F0] text-[#64748B] rounded-xl hover:border-[#10B981] hover:text-[#10B981] hover:shadow-md transition-all text-xs font-semibold flex items-center justify-center gap-2 group"
                        >
                          <Download className="w-3 h-3 group-hover:animate-bounce" />
                          {report}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Revenue Graph - Enhanced */}
                <div className="bg-white rounded-2xl border border-[#E2E8F0] p-7 shadow-sm hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-xl flex items-center justify-center">
                      <Activity className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-[#1E293B]">Daily Revenue Trends</h2>
                      <p className="text-xs text-[#64748B]">Weekly performance</p>
                    </div>
                  </div>
                  
                  {/* Key Metrics Cards */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="bg-gradient-to-br from-[#F8FAFC] to-white p-4 rounded-xl border border-[#E2E8F0]">
                      <p className="text-xs font-semibold text-[#64748B] mb-1">Daily Avg</p>
                      <p className="text-lg font-bold text-[#1E293B]">₹69,318</p>
                      <p className="text-xs text-[#10B981] font-bold">+5.2%</p>
                    </div>
                    <div className="bg-gradient-to-br from-[#F8FAFC] to-white p-4 rounded-xl border border-[#E2E8F0]">
                      <p className="text-xs font-semibold text-[#64748B] mb-1">Peak Hours</p>
                      <p className="text-lg font-bold text-[#1E293B]">2-6 PM</p>
                      <p className="text-xs text-[#3B82F6] font-bold">High Traffic</p>
                    </div>
                    <div className="bg-gradient-to-br from-[#F8FAFC] to-white p-4 rounded-xl border border-[#E2E8F0]">
                      <p className="text-xs font-semibold text-[#64748B] mb-1">Per Order</p>
                      <p className="text-lg font-bold text-[#1E293B]">₹1,245</p>
                      <p className="text-xs text-[#10B981] font-bold">+3.8%</p>
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

              {/* Professional Performance - Enhanced */}
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-7 mb-8 shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] rounded-xl flex items-center justify-center">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-[#1E293B]">Top Performing Professionals</h2>
                      <p className="text-xs text-[#64748B]">Based on ratings, jobs & earnings</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => window.location.href = '/dashboard/manager/reports/professionals-analytics'}
                    className="px-5 py-2.5 bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white rounded-xl hover:shadow-lg transition-all text-sm font-bold flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View All Professionals
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-[#E2E8F0]">
                        <th className="text-left text-xs font-bold text-[#1E293B] pb-4 uppercase tracking-wide">Rank</th>
                        <th className="text-left text-xs font-bold text-[#1E293B] pb-4 uppercase tracking-wide">Professional</th>
                        <th className="text-left text-xs font-bold text-[#1E293B] pb-4 uppercase tracking-wide">Category</th>
                        <th className="text-center text-xs font-bold text-[#1E293B] pb-4 uppercase tracking-wide">Rating</th>
                        <th className="text-center text-xs font-bold text-[#1E293B] pb-4 uppercase tracking-wide">Jobs</th>
                        <th className="text-right text-xs font-bold text-[#1E293B] pb-4 uppercase tracking-wide">Earnings</th>
                        <th className="text-center text-xs font-bold text-[#1E293B] pb-4 uppercase tracking-wide">Cancel Rate</th>
                        <th className="text-center text-xs font-bold text-[#1E293B] pb-4 uppercase tracking-wide">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topProfessionals.map((pro, index) => (
                        <tr key={index} className="border-b border-[#E2E8F0] last:border-0 hover:bg-[#F8FAFC] transition-colors group">
                          <td className="py-5">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
                              index === 0 ? 'bg-gradient-to-br from-[#F59E0B] to-[#D97706] text-white shadow-md' :
                              index === 1 ? 'bg-gradient-to-br from-[#94A3B8] to-[#64748B] text-white shadow-md' :
                              index === 2 ? 'bg-gradient-to-br from-[#D97706] to-[#92400E] text-white shadow-md' :
                              'bg-[#F1F5F9] text-[#64748B]'
                            }`}>
                              #{index + 1}
                            </div>
                          </td>
                          <td className="py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] rounded-xl flex items-center justify-center text-white font-bold shadow-sm">
                                {pro.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-[#1E293B]">{pro.name}</p>
                                <p className="text-xs text-[#64748B]">ID: PRO-{1000 + index}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-5">
                            <span className="px-3 py-1.5 bg-gradient-to-r from-[#DBEAFE] to-[#BFDBFE] text-[#1E40AF] rounded-lg text-xs font-bold">
                              {pro.category}
                            </span>
                          </td>
                          <td className="py-5">
                            <div className="flex flex-col items-center gap-1">
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" />
                                <span className="text-sm font-bold text-[#1E293B]">{pro.rating}</span>
                              </div>
                              <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <div 
                                    key={i} 
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      i < Math.floor(pro.rating) ? 'bg-[#F59E0B]' : 'bg-[#E2E8F0]'
                                    }`} 
                                  />
                                ))}
                              </div>
                            </div>
                          </td>
                          <td className="py-5 text-center">
                            <div className="inline-flex flex-col items-center gap-1 px-3 py-1.5 bg-[#F8FAFC] rounded-lg">
                              <span className="text-sm font-bold text-[#1E293B]">{pro.jobs}</span>
                              <span className="text-xs text-[#10B981] font-bold">+{index * 5 + 10}%</span>
                            </div>
                          </td>
                          <td className="py-5 text-right">
                            <p className="text-sm font-bold text-[#10B981]">{pro.earnings}</p>
                            <p className="text-xs text-[#64748B]">This month</p>
                          </td>
                          <td className="py-5 text-center">
                            <div className="flex flex-col items-center gap-1">
                              <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                                parseInt(pro.cancelRate) <= 2 ? 'bg-[#D1FAE5] text-[#065F46]' :
                                parseInt(pro.cancelRate) <= 4 ? 'bg-[#FEF3C7] text-[#92400E]' :
                                'bg-[#FEE2E2] text-[#991B1B]'
                              }`}>
                                {pro.cancelRate}
                              </span>
                              <div className="w-16 bg-[#F1F5F9] rounded-full h-1">
                                <div 
                                  className={`h-1 rounded-full ${
                                    parseInt(pro.cancelRate) <= 2 ? 'bg-[#10B981]' :
                                    parseInt(pro.cancelRate) <= 4 ? 'bg-[#F59E0B]' :
                                    'bg-[#EF4444]'
                                  }`}
                                  style={{ width: `${parseInt(pro.cancelRate) * 20}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="py-5 text-center">
                            <span className="px-3 py-1.5 bg-gradient-to-r from-[#D1FAE5] to-[#A7F3D0] text-[#065F46] rounded-lg text-xs font-bold flex items-center justify-center gap-1 w-fit mx-auto">
                              <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse" />
                              Active
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Top Selling Shops - Enhanced */}
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-7 mb-8 shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-[#1E293B]">Top Selling Shops</h2>
                      <p className="text-xs text-[#64748B]">Based on revenue, orders & ratings</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => window.location.href = '/dashboard/manager/reports/shops-analytics'}
                    className="px-5 py-2.5 bg-gradient-to-r from-[#10B981] to-[#059669] text-white rounded-xl hover:shadow-lg transition-all text-sm font-bold flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View All Shops
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-[#E2E8F0]">
                        <th className="text-left text-xs font-bold text-[#1E293B] pb-4 uppercase tracking-wide">Rank</th>
                        <th className="text-left text-xs font-bold text-[#1E293B] pb-4 uppercase tracking-wide">Shop</th>
                        <th className="text-left text-xs font-bold text-[#1E293B] pb-4 uppercase tracking-wide">Category</th>
                        <th className="text-center text-xs font-bold text-[#1E293B] pb-4 uppercase tracking-wide">Rating</th>
                        <th className="text-center text-xs font-bold text-[#1E293B] pb-4 uppercase tracking-wide">Orders</th>
                        <th className="text-right text-xs font-bold text-[#1E293B] pb-4 uppercase tracking-wide">Revenue</th>
                        <th className="text-center text-xs font-bold text-[#1E293B] pb-4 uppercase tracking-wide">Products</th>
                        <th className="text-center text-xs font-bold text-[#1E293B] pb-4 uppercase tracking-wide">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: 'Fashion Hub Store', owner: 'Priya Sharma', category: 'Fashion', rating: 4.7, orders: 2134, revenue: '₹12,56,780', products: 568, growth: '+22%' },
                        { name: 'Beauty Bazaar', owner: 'Sunita Verma', category: 'Beauty', rating: 4.7, orders: 1923, revenue: '₹9,34,120', products: 687, growth: '+20%' },
                        { name: 'TechZone Electronics', owner: 'Rahul Mehta', category: 'Electronics', rating: 4.8, orders: 1547, revenue: '₹8,45,230', products: 342, growth: '+18%' },
                        { name: 'Pet Paradise', owner: 'Kavita Reddy', category: 'Pet Supplies', rating: 4.9, orders: 1456, revenue: '₹7,12,340', products: 456, growth: '+17%' },
                        { name: 'Home Decor Paradise', owner: 'Amit Kumar', category: 'Home & Living', rating: 4.9, orders: 986, revenue: '₹6,78,450', products: 245, growth: '+15%' },
                      ].map((shop, index) => (
                        <tr key={index} className="border-b border-[#E2E8F0] last:border-0 hover:bg-[#F8FAFC] transition-colors group">
                          <td className="py-5">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
                              index === 0 ? 'bg-gradient-to-br from-[#F59E0B] to-[#D97706] text-white shadow-md' :
                              index === 1 ? 'bg-gradient-to-br from-[#94A3B8] to-[#64748B] text-white shadow-md' :
                              index === 2 ? 'bg-gradient-to-br from-[#D97706] to-[#92400E] text-white shadow-md' :
                              'bg-[#F1F5F9] text-[#64748B]'
                            }`}>
                              #{index + 1}
                            </div>
                          </td>
                          <td className="py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl flex items-center justify-center shadow-sm">
                                <ShoppingBag className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-[#1E293B]">{shop.name}</p>
                                <p className="text-xs text-[#64748B]">Owner: {shop.owner}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-5">
                            <span className="px-3 py-1.5 bg-gradient-to-r from-[#DBEAFE] to-[#BFDBFE] text-[#1E40AF] rounded-lg text-xs font-bold">
                              {shop.category}
                            </span>
                          </td>
                          <td className="py-5">
                            <div className="flex flex-col items-center gap-1">
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" />
                                <span className="text-sm font-bold text-[#1E293B]">{shop.rating}</span>
                              </div>
                              <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <div 
                                    key={i} 
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      i < Math.floor(shop.rating) ? 'bg-[#F59E0B]' : 'bg-[#E2E8F0]'
                                    }`} 
                                  />
                                ))}
                              </div>
                            </div>
                          </td>
                          <td className="py-5 text-center">
                            <div className="inline-flex flex-col items-center gap-1 px-3 py-1.5 bg-[#F8FAFC] rounded-lg">
                              <span className="text-sm font-bold text-[#1E293B]">{shop.orders.toLocaleString()}</span>
                              <span className="text-xs text-[#10B981] font-bold">{shop.growth}</span>
                            </div>
                          </td>
                          <td className="py-5 text-right">
                            <p className="text-sm font-bold text-[#10B981]">{shop.revenue}</p>
                            <p className="text-xs text-[#64748B]">This month</p>
                          </td>
                          <td className="py-5 text-center">
                            <div className="inline-flex flex-col items-center gap-1 px-3 py-1.5 bg-[#F8FAFC] rounded-lg">
                              <span className="text-sm font-bold text-[#1E293B]">{shop.products}</span>
                              <span className="text-xs text-[#64748B]">items</span>
                            </div>
                          </td>
                          <td className="py-5 text-center">
                            <span className="px-3 py-1.5 bg-gradient-to-r from-[#D1FAE5] to-[#A7F3D0] text-[#065F46] rounded-lg text-xs font-bold flex items-center justify-center gap-1 w-fit mx-auto">
                              <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse" />
                              Active
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

              {/* Export Full Report & Settings - Enhanced */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Export Full Report - Enhanced */}
                <div className="relative bg-gradient-to-br from-[#10B981] via-[#059669] to-[#047857] rounded-2xl p-8 text-white shadow-2xl overflow-hidden">
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                        <FileText className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">Download Full Business Report</h2>
                        <p className="text-sm text-white/80">Last generated: {currentTime.toLocaleTimeString()}</p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-white/90 mb-6 leading-relaxed">
                      Comprehensive report including overview, financials, trends, user behavior, 
                      performance metrics, high-risk flags, and detailed payout summary with actionable insights.
                    </p>

                    {/* Report Stats */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                        <p className="text-2xl font-bold">45+</p>
                        <p className="text-xs text-white/80">Pages</p>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                        <p className="text-2xl font-bold">12</p>
                        <p className="text-xs text-white/80">Sections</p>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                        <p className="text-2xl font-bold">8.5MB</p>
                        <p className="text-xs text-white/80">Size</p>
                      </div>
                    </div>

                    {/* Download Buttons */}
                    <div className="space-y-3">
                      <button className="w-full px-6 py-4 bg-white text-[#10B981] rounded-xl hover:bg-[#F8FAFC] transition-all text-base font-bold flex items-center justify-center gap-3 shadow-lg group">
                        <Download className="w-5 h-5 group-hover:animate-bounce" />
                        Download PDF Report
                        <span className="ml-auto px-3 py-1 bg-[#10B981] text-white rounded-lg text-xs">Recommended</span>
                      </button>
                      <div className="grid grid-cols-2 gap-3">
                        <button className="px-4 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all text-sm font-bold flex items-center justify-center gap-2">
                          <Download className="w-4 h-4" />
                          Excel
                        </button>
                        <button className="px-4 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all text-sm font-bold flex items-center justify-center gap-2">
                          <Download className="w-4 h-4" />
                          CSV
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Report Automation Settings - Enhanced */}
                <div className="bg-white rounded-2xl border border-[#E2E8F0] p-8 shadow-sm hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-xl flex items-center justify-center">
                      <Settings className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-[#1E293B]">Report Automation</h2>
                      <p className="text-xs text-[#64748B]">Configure automated report generation</p>
                    </div>
                  </div>
                  
                  <div className="space-y-5">
                    <div>
                      <label className="text-sm font-bold text-[#1E293B] mb-3 flex items-center gap-2 block">
                        <Clock className="w-4 h-4 text-[#3B82F6]" />
                        Schedule Frequency
                      </label>
                      <select className="w-full px-4 py-3 text-gray-700 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all">
                        <option>Daily at 9:00 AM</option>
                        <option>Weekly on Monday</option>
                        <option>Bi-weekly</option>
                        <option>Monthly on 1st</option>
                        <option>Quarterly</option>
                        <option>Disabled</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-bold text-[#1E293B] mb-3 flex items-center gap-2 block">
                        <Bell className="w-4 h-4 text-[#3B82F6]" />
                        Notification Email
                      </label>
                      <input 
                        type="email" 
                        placeholder="admin@platform.com" 
                        className="w-full px-4 py-3 text-gray-700 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-bold text-[#1E293B] mb-3 flex items-center gap-2 block">
                        <FileText className="w-4 h-4 text-[#3B82F6]" />
                        Include Sections
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { label: 'Overview', icon: '📊' },
                          { label: 'Financials', icon: '💰' },
                          { label: 'Orders', icon: '📦' },
                          { label: 'Users', icon: '👥' },
                          { label: 'Complaints', icon: '⚠️' },
                          { label: 'Performance', icon: '📈' }
                        ].map((section, idx) => (
                          <label key={idx} className="flex items-center gap-2 p-3 bg-[#F8FAFC] rounded-xl hover:bg-[#EFF6FF] transition-colors cursor-pointer group">
                            <input 
                              type="checkbox" 
                              defaultChecked 
                              className="w-4 h-4 text-[#3B82F6] border-[#E2E8F0] rounded focus:ring-[#3B82F6]" 
                            />
                            <span className="text-sm font-medium text-[#64748B] group-hover:text-[#3B82F6] transition-colors">
                              {section.icon} {section.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button className="flex-1 px-5 py-3 bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white rounded-xl hover:shadow-lg transition-all text-sm font-bold flex items-center justify-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Save Settings
                      </button>
                      <button className="px-5 py-3 bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] rounded-xl hover:bg-[#E2E8F0] transition-all text-sm font-semibold">
                        Reset
                      </button>
                    </div>
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
``