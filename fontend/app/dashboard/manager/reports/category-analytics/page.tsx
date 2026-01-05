'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TopNavbar from '../../components/TopNavbar';
import LeftSidebar from '../../components/LeftSidebar';
import { 
  ArrowLeft, PieChart, TrendingUp, TrendingDown, Users, DollarSign, 
  Clock, Star, MapPin, Calendar, Filter, Download, Activity,
  CheckCircle, XCircle, AlertCircle, BarChart3, LineChart,
  Package, Target, Award, Zap, ThumbsUp, ThumbsDown, Eye,
  RefreshCw, Settings, Search, ArrowUpRight, ArrowDownRight,
  Briefcase, ShoppingBag, Wrench, Home, Car, ChefHat
} from 'lucide-react';

export default function CategoryAnalyticsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [timePeriod, setTimePeriod] = useState<'week' | 'month' | 'year'>('month');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Category Icons Mapping
  const categoryIcons: { [key: string]: any } = {
    'Electrical': Zap,
    'Plumbing': Wrench,
    'Carpentry': Home,
    'Cleaning': ShoppingBag,
    'Driving': Car,
    'Cooking': ChefHat,
  };

  // Comprehensive Category Data
  const categories = [
    { 
      name: 'Electrical', 
      percentage: 28, 
      count: 687, 
      revenue: '₹8,56,450',
      avgOrder: '₹1,247',
      professionals: 45,
      rating: 4.7,
      growth: '+12.5%',
      color: '#F59E0B',
      trend: 'up',
      completionRate: 96.2,
      cancelRate: 2.1,
      avgDuration: '2.5 hrs',
      peakHours: '10 AM - 2 PM',
      topService: 'Wiring & Installation',
      customerSatisfaction: 94.5
    },
    { 
      name: 'Plumbing', 
      percentage: 22, 
      count: 540, 
      revenue: '₹6,72,300',
      avgOrder: '₹1,245',
      professionals: 38,
      rating: 4.6,
      growth: '+8.3%',
      color: '#3B82F6',
      trend: 'up',
      completionRate: 94.8,
      cancelRate: 3.2,
      avgDuration: '3.0 hrs',
      peakHours: '9 AM - 12 PM',
      topService: 'Pipe Repair',
      customerSatisfaction: 92.8
    },
    { 
      name: 'Carpentry', 
      percentage: 18, 
      count: 442, 
      revenue: '₹5,98,150',
      avgOrder: '₹1,354',
      professionals: 32,
      rating: 4.8,
      growth: '+15.2%',
      color: '#10B981',
      trend: 'up',
      completionRate: 97.5,
      cancelRate: 1.5,
      avgDuration: '4.5 hrs',
      peakHours: '8 AM - 11 AM',
      topService: 'Furniture Assembly',
      customerSatisfaction: 96.2
    },
    { 
      name: 'Cleaning', 
      percentage: 15, 
      count: 368, 
      revenue: '₹3,86,240',
      avgOrder: '₹1,050',
      professionals: 52,
      rating: 4.5,
      growth: '+6.7%',
      color: '#8B5CF6',
      trend: 'up',
      completionRate: 98.1,
      cancelRate: 1.2,
      avgDuration: '2.0 hrs',
      peakHours: '7 AM - 10 AM',
      topService: 'Deep Cleaning',
      customerSatisfaction: 95.8
    },
    { 
      name: 'Driving', 
      percentage: 10, 
      count: 245, 
      revenue: '₹2,45,000',
      avgOrder: '₹1,000',
      professionals: 28,
      rating: 4.4,
      growth: '+4.2%',
      color: '#EF4444',
      trend: 'up',
      completionRate: 92.5,
      cancelRate: 4.8,
      avgDuration: '5.0 hrs',
      peakHours: '6 AM - 9 AM',
      topService: 'Airport Transfer',
      customerSatisfaction: 90.3
    },
    { 
      name: 'Cooking', 
      percentage: 7, 
      count: 172, 
      revenue: '₹1,89,200',
      avgOrder: '₹1,100',
      professionals: 18,
      rating: 4.9,
      growth: '+18.5%',
      color: '#06B6D4',
      trend: 'up',
      completionRate: 99.2,
      cancelRate: 0.5,
      avgDuration: '3.5 hrs',
      peakHours: '11 AM - 2 PM',
      topService: 'Party Catering',
      customerSatisfaction: 98.5
    },
  ];

  // Monthly Trend Data
  const monthlyTrends = [
    { month: 'Jan', electrical: 580, plumbing: 450, carpentry: 380, cleaning: 320, driving: 210, cooking: 145 },
    { month: 'Feb', electrical: 620, plumbing: 480, carpentry: 400, cleaning: 340, driving: 225, cooking: 155 },
    { month: 'Mar', electrical: 650, plumbing: 510, carpentry: 420, cleaning: 350, driving: 235, cooking: 165 },
    { month: 'Apr', electrical: 687, plumbing: 540, carpentry: 442, cleaning: 368, driving: 245, cooking: 172 },
  ];

  // Regional Distribution
  const regionalData = [
    { region: 'Sector 15, Noida', electrical: 125, plumbing: 98, carpentry: 82, cleaning: 75, driving: 48, cooking: 32 },
    { region: 'Dwarka, Delhi', electrical: 110, plumbing: 85, carpentry: 70, cleaning: 65, driving: 42, cooking: 28 },
    { region: 'Gurgaon Cyber City', electrical: 98, plumbing: 78, carpentry: 65, cleaning: 58, driving: 38, cooking: 25 },
    { region: 'Rohini, Delhi', electrical: 85, plumbing: 68, carpentry: 55, cleaning: 48, driving: 32, cooking: 20 },
    { region: 'Vasant Kunj', electrical: 75, plumbing: 60, carpentry: 48, cleaning: 42, driving: 28, cooking: 18 },
  ];

  // Daily Performance Data
  const dailyPerformance = [
    { day: 'Mon', orders: 385, revenue: 482000, avgRating: 4.6 },
    { day: 'Tue', orders: 425, revenue: 531000, avgRating: 4.7 },
    { day: 'Wed', orders: 468, revenue: 585000, avgRating: 4.8 },
    { day: 'Thu', orders: 398, revenue: 497000, avgRating: 4.6 },
    { day: 'Fri', orders: 442, revenue: 552000, avgRating: 4.7 },
    { day: 'Sat', orders: 412, revenue: 515000, avgRating: 4.7 },
    { day: 'Sun', orders: 324, revenue: 405000, avgRating: 4.5 },
  ];

  const filteredCategories = selectedCategory === 'all' 
    ? categories 
    : categories.filter(cat => cat.name.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      <TopNavbar />
      <div className="flex">
        <LeftSidebar isOpen={sidebarOpen} />
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
          <div className="p-8">
            <div className="max-w-[1800px] mx-auto">
              {/* Page Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => router.back()}
                    className="w-12 h-12 bg-white border border-[#E2E8F0] rounded-xl hover:bg-[#F8FAFC] transition-all flex items-center justify-center group"
                  >
                    <ArrowLeft className="w-5 h-5 text-[#64748B] group-hover:text-[#1E293B]" />
                  </button>
                  <div className="w-16 h-16 bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] rounded-2xl flex items-center justify-center shadow-lg">
                    <PieChart className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-[#1E293B] mb-1 flex items-center gap-3">
                      Advanced Category Analytics
                      <span className="px-3 py-1 bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white text-xs font-bold rounded-full flex items-center gap-1">
                        <Activity className="w-3 h-3" />
                        LIVE DATA
                      </span>
                    </h1>
                    <p className="text-sm text-[#64748B] flex items-center gap-3">
                      Deep dive into service category performance & insights
                      <span className="text-xs text-[#8B5CF6] font-semibold">
                        Updated: {currentTime.toLocaleTimeString()}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="px-5 py-2.5 bg-white border border-[#E2E8F0] text-[#64748B] rounded-xl hover:border-[#8B5CF6] hover:text-[#8B5CF6] transition-all flex items-center gap-2 text-sm font-bold">
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                  </button>
                  <button className="px-5 py-2.5 bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2 text-sm font-bold">
                    <Download className="w-4 h-4" />
                    Export Report
                  </button>
                </div>
              </div>

              {/* Filters Panel */}
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 mb-8 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex items-center gap-2">
                      <Filter className="w-5 h-5 text-[#8B5CF6]" />
                      <span className="text-sm font-bold text-[#1E293B]">Filters:</span>
                    </div>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-4 py-2.5 text-gray-700 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent font-medium"
                    >
                      <option value="all">All Categories</option>
                      {categories.map(cat => (
                        <option key={cat.name} value={cat.name.toLowerCase()}>{cat.name}</option>
                      ))}
                    </select>
                    <select
                      value={timePeriod}
                      onChange={(e) => setTimePeriod(e.target.value as 'week' | 'month' | 'year')}
                      className="px-4 py-2.5 text-gray-700 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent font-medium"
                    >
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                      <option value="year">This Year</option>
                    </select>
                  </div>
                  <button className="text-sm text-[#8B5CF6] hover:text-[#7C3AED] font-bold flex items-center gap-1">
                    <RefreshCw className="w-4 h-4" />
                    Reset Filters
                  </button>
                </div>
              </div>

              {/* Summary KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm hover:shadow-lg transition-all group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] rounded-xl flex items-center justify-center">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <span className="px-3 py-1 bg-[#D1FAE5] text-[#065F46] rounded-full text-xs font-bold flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      +10.2%
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-[#64748B] mb-1">Total Orders</p>
                  <p className="text-3xl font-bold text-[#1E293B]">2,454</p>
                  <p className="text-xs text-[#64748B] mt-1">Across all categories</p>
                </div>

                <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm hover:shadow-lg transition-all group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <span className="px-3 py-1 bg-[#D1FAE5] text-[#065F46] rounded-full text-xs font-bold flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      +12.8%
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-[#64748B] mb-1">Total Revenue</p>
                  <p className="text-3xl font-bold text-[#1E293B]">₹29.5L</p>
                  <p className="text-xs text-[#64748B] mt-1">Average: ₹1,202 per order</p>
                </div>

                <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm hover:shadow-lg transition-all group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <span className="px-3 py-1 bg-[#D1FAE5] text-[#065F46] rounded-full text-xs font-bold flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      +7.5%
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-[#64748B] mb-1">Active Professionals</p>
                  <p className="text-3xl font-bold text-[#1E293B]">213</p>
                  <p className="text-xs text-[#64748B] mt-1">Across 6 categories</p>
                </div>

                <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm hover:shadow-lg transition-all group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-xl flex items-center justify-center">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <span className="px-3 py-1 bg-[#D1FAE5] text-[#065F46] rounded-full text-xs font-bold flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      +0.3
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-[#64748B] mb-1">Avg. Rating</p>
                  <p className="text-3xl font-bold text-[#1E293B]">4.7</p>
                  <p className="text-xs text-[#64748B] mt-1">94.8% satisfaction rate</p>
                </div>
              </div>

              {/* Category Performance Cards */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-[#1E293B] mb-5 flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-[#8B5CF6]" />
                  Category Performance Overview
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCategories.map((category) => {
                    const Icon = categoryIcons[category.name];
                    return (
                      <div 
                        key={category.name}
                        className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer"
                      >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-5">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-md"
                              style={{ backgroundColor: `${category.color}20` }}
                            >
                              <Icon className="w-7 h-7" style={{ color: category.color }} />
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-[#1E293B]">{category.name}</h3>
                              <p className="text-xs text-[#64748B]">{category.topService}</p>
                            </div>
                          </div>
                          <div className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 ${
                            category.trend === 'up' ? 'bg-[#D1FAE5] text-[#065F46]' : 'bg-[#FEE2E2] text-[#991B1B]'
                          }`}>
                            {category.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {category.growth}
                          </div>
                        </div>

                        {/* Key Metrics Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-5">
                          <div className="bg-gradient-to-br from-[#F8FAFC] to-white p-3 rounded-xl">
                            <p className="text-xs font-semibold text-[#64748B] mb-1">Orders</p>
                            <p className="text-2xl font-bold text-[#1E293B]">{category.count}</p>
                            <p className="text-xs text-[#8B5CF6] font-bold">{category.percentage}% share</p>
                          </div>
                          <div className="bg-gradient-to-br from-[#F8FAFC] to-white p-3 rounded-xl">
                            <p className="text-xs font-semibold text-[#64748B] mb-1">Revenue</p>
                            <p className="text-xl font-bold text-[#10B981]">{category.revenue}</p>
                            <p className="text-xs text-[#64748B]">{category.avgOrder}/order</p>
                          </div>
                          <div className="bg-gradient-to-br from-[#F8FAFC] to-white p-3 rounded-xl">
                            <p className="text-xs font-semibold text-[#64748B] mb-1">Rating</p>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" />
                              <p className="text-xl font-bold text-[#1E293B]">{category.rating}</p>
                            </div>
                            <p className="text-xs text-[#64748B]">{category.customerSatisfaction}% satisfied</p>
                          </div>
                          <div className="bg-gradient-to-br from-[#F8FAFC] to-white p-3 rounded-xl">
                            <p className="text-xs font-semibold text-[#64748B] mb-1">Professionals</p>
                            <p className="text-2xl font-bold text-[#1E293B]">{category.professionals}</p>
                            <p className="text-xs text-[#64748B]">Active</p>
                          </div>
                        </div>

                        {/* Performance Indicators */}
                        <div className="space-y-3 mb-5">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-semibold text-[#64748B]">Completion Rate</span>
                              <span className="text-xs font-bold text-[#10B981]">{category.completionRate}%</span>
                            </div>
                            <div className="w-full bg-[#F1F5F9] rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-[#10B981] to-[#059669] h-2 rounded-full transition-all duration-500"
                                style={{ width: `${category.completionRate}%` }}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-semibold text-[#64748B]">Customer Satisfaction</span>
                              <span className="text-xs font-bold text-[#3B82F6]">{category.customerSatisfaction}%</span>
                            </div>
                            <div className="w-full bg-[#F1F5F9] rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-[#3B82F6] to-[#2563EB] h-2 rounded-full transition-all duration-500"
                                style={{ width: `${category.customerSatisfaction}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Additional Info */}
                        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#E2E8F0]">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-[#64748B]" />
                            <div>
                              <p className="text-xs text-[#64748B]">Avg. Duration</p>
                              <p className="text-sm font-bold text-[#1E293B]">{category.avgDuration}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-[#64748B]" />
                            <div>
                              <p className="text-xs text-[#64748B]">Cancel Rate</p>
                              <p className="text-sm font-bold text-[#EF4444]">{category.cancelRate}%</p>
                            </div>
                          </div>
                        </div>

                        {/* Peak Hours Badge */}
                        <div className="mt-4 p-3 bg-gradient-to-r from-[#EFF6FF] to-[#DBEAFE] rounded-xl">
                          <p className="text-xs text-[#64748B] mb-1">Peak Hours</p>
                          <p className="text-sm font-bold text-[#1E40AF] flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {category.peakHours}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Monthly Trends Chart */}
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-7 mb-8 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl flex items-center justify-center">
                      <LineChart className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-[#1E293B]">Category Trends (Last 4 Months)</h2>
                      <p className="text-xs text-[#64748B]">Order volume comparison by category</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {categories.slice(0, 6).map(cat => (
                      <div key={cat.name} className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: cat.color }} />
                        <span className="text-xs font-medium text-[#64748B]">{cat.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-5">
                  {monthlyTrends.map((month, idx) => {
                    const maxValue = 700;
                    return (
                      <div key={idx}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-bold text-[#1E293B] w-12">{month.month}</span>
                          <div className="flex items-center gap-4 text-xs font-semibold">
                            <span style={{ color: categories[0].color }}>{month.electrical}</span>
                            <span style={{ color: categories[1].color }}>{month.plumbing}</span>
                            <span style={{ color: categories[2].color }}>{month.carpentry}</span>
                            <span style={{ color: categories[3].color }}>{month.cleaning}</span>
                            <span style={{ color: categories[4].color }}>{month.driving}</span>
                            <span style={{ color: categories[5].color }}>{month.cooking}</span>
                          </div>
                        </div>
                        <div className="relative h-12 bg-[#F8FAFC] rounded-xl overflow-hidden">
                          {[month.electrical, month.plumbing, month.carpentry, month.cleaning, month.driving, month.cooking].reduce((acc, value, catIdx) => {
                            const previousWidth = acc.width;
                            const currentWidth = (value / maxValue) * 100;
                            acc.elements.push(
                              <div 
                                key={catIdx}
                                className="absolute h-full transition-all duration-500 hover:opacity-90"
                                style={{ 
                                  left: `${previousWidth}%`,
                                  width: `${currentWidth}%`,
                                  backgroundColor: categories[catIdx].color
                                }}
                              />
                            );
                            acc.width += currentWidth;
                            return acc;
                          }, { elements: [] as React.ReactElement[], width: 0 }).elements}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Regional Distribution */}
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-7 mb-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-xl flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#1E293B]">Regional Category Distribution</h2>
                    <p className="text-xs text-[#64748B]">Top 5 locations by category performance</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {regionalData.map((region, idx) => (
                    <div key={idx} className="group">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                            idx === 0 ? 'bg-gradient-to-br from-[#F59E0B] to-[#D97706] text-white' :
                            'bg-[#F1F5F9] text-[#64748B]'
                          }`}>
                            #{idx + 1}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#1E293B]">{region.region}</p>
                            <p className="text-xs text-[#64748B]">
                              Total: {region.electrical + region.plumbing + region.carpentry + region.cleaning + region.driving + region.cooking} orders
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-6 gap-2">
                        {[
                          { name: 'Electrical', value: region.electrical, color: categories[0].color },
                          { name: 'Plumbing', value: region.plumbing, color: categories[1].color },
                          { name: 'Carpentry', value: region.carpentry, color: categories[2].color },
                          { name: 'Cleaning', value: region.cleaning, color: categories[3].color },
                          { name: 'Driving', value: region.driving, color: categories[4].color },
                          { name: 'Cooking', value: region.cooking, color: categories[5].color },
                        ].map((cat, catIdx) => (
                          <div key={catIdx} className="text-center">
                            <div className="mb-2 p-3 bg-[#F8FAFC] rounded-xl group-hover:bg-[#F1F5F9] transition-colors">
                              <p className="text-lg font-bold text-[#1E293B]">{cat.value}</p>
                              <p className="text-xs text-[#64748B]">{cat.name}</p>
                            </div>
                            <div className="w-full bg-[#F1F5F9] rounded-full h-1.5">
                              <div 
                                className="h-1.5 rounded-full transition-all duration-500"
                                style={{ 
                                  width: `${(cat.value / 125) * 100}%`,
                                  backgroundColor: cat.color 
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Daily Performance */}
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-7 mb-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#1E293B]">Weekly Daily Performance</h2>
                    <p className="text-xs text-[#64748B]">Orders, revenue & ratings by day</p>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-4">
                  {dailyPerformance.map((day, idx) => {
                    const isWeekend = day.day === 'Sat' || day.day === 'Sun';
                    return (
                      <div 
                        key={idx}
                        className={`p-5 rounded-2xl border-2 transition-all hover:shadow-lg cursor-pointer ${
                          isWeekend 
                            ? 'bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] border-[#F59E0B]' 
                            : 'bg-gradient-to-br from-[#F8FAFC] to-white border-[#E2E8F0] hover:border-[#8B5CF6]'
                        }`}
                      >
                        <p className="text-xs font-bold text-[#64748B] mb-3">{day.day}</p>
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs text-[#64748B] mb-1">Orders</p>
                            <p className="text-2xl font-bold text-[#1E293B]">{day.orders}</p>
                          </div>
                          <div>
                            <p className="text-xs text-[#64748B] mb-1">Revenue</p>
                            <p className="text-sm font-bold text-[#10B981]">₹{(day.revenue / 1000).toFixed(0)}K</p>
                          </div>
                          <div>
                            <p className="text-xs text-[#64748B] mb-1">Rating</p>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-[#F59E0B] fill-[#F59E0B]" />
                              <p className="text-sm font-bold text-[#1E293B]">{day.avgRating}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Insights & Recommendations */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Key Insights */}
                <div className="bg-gradient-to-br from-[#10B981] to-[#059669] rounded-2xl p-7 text-white shadow-lg">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-xl font-bold">Key Insights</h2>
                  </div>
                  <div className="space-y-4">
                    {[
                      { icon: ThumbsUp, text: 'Carpentry has the highest completion rate (97.5%) and customer satisfaction (96.2%)', color: 'from-white/20 to-white/10' },
                      { icon: TrendingUp, text: 'Cooking category showing fastest growth (+18.5%) despite smaller volume', color: 'from-white/20 to-white/10' },
                      { icon: Target, text: 'Electrical services dominate with 28% market share and highest revenue', color: 'from-white/20 to-white/10' },
                      { icon: AlertCircle, text: 'Driving category needs attention with 4.8% cancellation rate', color: 'from-white/20 to-white/10' },
                    ].map((insight, idx) => {
                      const Icon = insight.icon;
                      return (
                        <div key={idx} className={`bg-gradient-to-r ${insight.color} backdrop-blur-sm p-4 rounded-xl flex items-start gap-3`}>
                          <Icon className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-white/90">{insight.text}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-2xl p-7 text-white shadow-lg">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-xl font-bold">Recommendations</h2>
                  </div>
                  <div className="space-y-4">
                    {[
                      { icon: Zap, text: 'Increase professional capacity in Carpentry to meet growing demand', priority: 'High' },
                      { icon: Users, text: 'Invest in Cooking category marketing - shows strong potential', priority: 'Medium' },
                      { icon: AlertCircle, text: 'Improve driver training and verification to reduce cancellations', priority: 'High' },
                      { icon: MapPin, text: 'Expand services in Sector 15 Noida - highest performing location', priority: 'Medium' },
                    ].map((rec, idx) => (
                      <div key={idx} className="bg-white/10 backdrop-blur-sm p-4 rounded-xl flex items-start gap-3">
                        <rec.icon className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm text-white/90 mb-2">{rec.text}</p>
                          <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                            rec.priority === 'High' ? 'bg-[#EF4444] text-white' : 'bg-white/20 text-white'
                          }`}>
                            {rec.priority} Priority
                          </span>
                        </div>
                      </div>
                    ))}
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
