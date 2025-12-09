'use client';

import React, { useState } from 'react';
import { 
  ArrowLeft, Package, TrendingUp, TrendingDown, DollarSign, 
  XCircle, Clock, Store, ShoppingBag, Star, Download
} from 'lucide-react';
import Link from 'next/link';
import TopNavbar from '../../components/TopNavbar';
import LeftSidebar from '../../components/LeftSidebar';

export default function OrderAnalyticsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [timeFilter, setTimeFilter] = useState('today');

  const stats = {
    totalOrders: 245,
    successfulOrders: 198,
    cancelledOrders: 12,
    totalRevenue: 245000,
    averageOrderValue: 1000,
    deliverySuccessRate: 95.5,
  };

  const topShops = [
    { name: 'ElectroWorld Pro', orders: 45, revenue: 112500, rating: 4.8 },
    { name: 'Fresh Mart Groceries', orders: 38, revenue: 67200, rating: 4.7 },
    { name: 'Tasty Bites Restaurant', orders: 32, revenue: 28800, rating: 4.9 },
    { name: 'Quick Repairs', orders: 28, revenue: 84000, rating: 4.6 },
    { name: 'Home Services', orders: 24, revenue: 72000, rating: 4.8 },
  ];

  const topProducts = [
    { name: 'LED Bulb 15W', orders: 156, revenue: 46644 },
    { name: 'Wall Socket Modular', orders: 132, revenue: 19668 },
    { name: 'Extension Cord 5M', orders: 98, revenue: 39102 },
    { name: 'MCB 32A Double Pole', orders: 87, revenue: 47763 },
    { name: 'Fan Installation Service', orders: 76, revenue: 60800 },
  ];

  const peakTimes = [
    { time: '9:00 AM', orders: 12 },
    { time: '10:00 AM', orders: 18 },
    { time: '11:00 AM', orders: 24 },
    { time: '12:00 PM', orders: 32 },
    { time: '1:00 PM', orders: 28 },
    { time: '2:00 PM', orders: 22 },
    { time: '3:00 PM', orders: 19 },
    { time: '4:00 PM', orders: 25 },
    { time: '5:00 PM', orders: 30 },
    { time: '6:00 PM', orders: 35 },
    { time: '7:00 PM', orders: 38 },
    { time: '8:00 PM', orders: 42 },
  ];

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
                <Link href="/dashboard/manager/orders">
                  <button className="flex items-center gap-2 text-[#64748B] hover:text-[#3B82F6] mb-4 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm font-medium">Back to Orders</span>
                  </button>
                </Link>

                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-semibold text-[#1E293B] mb-2">Order Analytics</h1>
                    <p className="text-[#64748B] text-sm">Comprehensive insights into order performance and trends</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <select
                      value={timeFilter}
                      onChange={(e) => setTimeFilter(e.target.value)}
                      className="px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] bg-white"
                    >
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                      <option value="year">This Year</option>
                    </select>
                    <button className="px-4 py-2 bg-white border border-[#E2E8F0] text-[#64748B] rounded-lg hover:bg-[#F8FAFC] transition-colors flex items-center gap-2 text-sm font-medium">
                      <Download className="w-4 h-4" />
                      Export Report
                    </button>
                  </div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                <div className="bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-xl p-5 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <Package className="w-6 h-6 opacity-80" />
                    <TrendingUp className="w-4 h-4 opacity-80" />
                  </div>
                  <h3 className="text-2xl font-bold">{stats.totalOrders}</h3>
                  <p className="text-xs opacity-75 mt-1">Total Orders</p>
                  <p className="text-xs opacity-90 mt-2">+12% from last period</p>
                </div>

                <div className="bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl p-5 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <Package className="w-6 h-6 opacity-80" />
                    <TrendingUp className="w-4 h-4 opacity-80" />
                  </div>
                  <h3 className="text-2xl font-bold">{stats.successfulOrders}</h3>
                  <p className="text-xs opacity-75 mt-1">Successful Orders</p>
                  <p className="text-xs opacity-90 mt-2">{((stats.successfulOrders / stats.totalOrders) * 100).toFixed(1)}% success rate</p>
                </div>

                <div className="bg-gradient-to-br from-[#EF4444] to-[#DC2626] rounded-xl p-5 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <XCircle className="w-6 h-6 opacity-80" />
                    <TrendingDown className="w-4 h-4 opacity-80" />
                  </div>
                  <h3 className="text-2xl font-bold">{stats.cancelledOrders}</h3>
                  <p className="text-xs opacity-75 mt-1">Cancelled Orders</p>
                  <p className="text-xs opacity-90 mt-2">{((stats.cancelledOrders / stats.totalOrders) * 100).toFixed(1)}% cancellation rate</p>
                </div>

                <div className="bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] rounded-xl p-5 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <DollarSign className="w-6 h-6 opacity-80" />
                    <TrendingUp className="w-4 h-4 opacity-80" />
                  </div>
                  <h3 className="text-2xl font-bold">₹{(stats.totalRevenue / 1000).toFixed(0)}K</h3>
                  <p className="text-xs opacity-75 mt-1">Total Revenue</p>
                  <p className="text-xs opacity-90 mt-2">+18% from last period</p>
                </div>

                <div className="bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-xl p-5 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <ShoppingBag className="w-6 h-6 opacity-80" />
                    <TrendingUp className="w-4 h-4 opacity-80" />
                  </div>
                  <h3 className="text-2xl font-bold">₹{stats.averageOrderValue}</h3>
                  <p className="text-xs opacity-75 mt-1">Avg Order Value</p>
                  <p className="text-xs opacity-90 mt-2">+8% from last period</p>
                </div>

                <div className="bg-gradient-to-br from-[#06B6D4] to-[#0891B2] rounded-xl p-5 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <Clock className="w-6 h-6 opacity-80" />
                    <TrendingUp className="w-4 h-4 opacity-80" />
                  </div>
                  <h3 className="text-2xl font-bold">{stats.deliverySuccessRate}%</h3>
                  <p className="text-xs opacity-75 mt-1">Delivery Success</p>
                  <p className="text-xs opacity-90 mt-2">On-time delivery rate</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Orders Trend Chart */}
                <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-[#1E293B] mb-6">Daily Orders Trend</h2>
                  <div className="space-y-3">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                      const value = [45, 52, 38, 61, 48, 67, 54][index];
                      const maxValue = 70;
                      return (
                        <div key={day}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-[#64748B]">{day}</span>
                            <span className="text-sm font-semibold text-[#1E293B]">{value} orders</span>
                          </div>
                          <div className="w-full bg-[#F1F5F9] rounded-full h-3">
                            <div 
                              className="bg-gradient-to-r from-[#3B82F6] to-[#2563EB] h-3 rounded-full transition-all duration-500"
                              style={{ width: `${(value / maxValue) * 100}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Peak Order Times */}
                <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-[#1E293B] mb-6">Peak Order Times</h2>
                  <div className="flex items-end justify-between gap-2 h-48">
                    {peakTimes.map((time) => {
                      const maxOrders = Math.max(...peakTimes.map(t => t.orders));
                      const height = (time.orders / maxOrders) * 100;
                      return (
                        <div key={time.time} className="flex-1 flex flex-col items-center">
                          <div className="w-full flex items-end justify-center h-40">
                            <div 
                              className="w-full bg-gradient-to-t from-[#3B82F6] to-[#60A5FA] rounded-t hover:from-[#2563EB] hover:to-[#3B82F6] transition-all cursor-pointer relative group"
                              style={{ height: `${height}%` }}
                            >
                              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-xs font-semibold text-[#1E293B] bg-white px-2 py-1 rounded shadow-sm whitespace-nowrap">
                                  {time.orders} orders
                                </span>
                              </div>
                            </div>
                          </div>
                          <span className="text-[10px] text-[#64748B] mt-2 transform -rotate-45 origin-top-left">
                            {time.time}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Selling Shops */}
                <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-[#1E293B] mb-6 flex items-center gap-2">
                    <Store className="w-5 h-5 text-[#3B82F6]" />
                    Top Performing Shops
                  </h2>
                  <div className="space-y-4">
                    {topShops.map((shop, index) => (
                      <div key={shop.name} className="flex items-center gap-4 p-4 bg-[#F8FAFC] rounded-lg hover:bg-[#EFF6FF] transition-colors">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#2563EB] flex items-center justify-center text-white font-bold">
                          #{index + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-[#1E293B] text-sm">{shop.name}</h3>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-[#64748B]">{shop.orders} orders</span>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-[#F59E0B] text-[#F59E0B]" />
                              <span className="text-xs font-semibold text-[#1E293B]">{shop.rating}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-[#10B981]">₹{(shop.revenue / 1000).toFixed(1)}K</p>
                          <p className="text-xs text-[#64748B]">Revenue</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Most Ordered Products */}
                <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-[#1E293B] mb-6 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-[#3B82F6]" />
                    Most Ordered Products
                  </h2>
                  <div className="space-y-4">
                    {topProducts.map((product, index) => (
                      <div key={product.name} className="flex items-center gap-4 p-4 bg-[#F8FAFC] rounded-lg hover:bg-[#EFF6FF] transition-colors">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] flex items-center justify-center text-white font-bold">
                          #{index + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-[#1E293B] text-sm">{product.name}</h3>
                          <p className="text-xs text-[#64748B] mt-1">{product.orders} orders</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-[#8B5CF6]">₹{(product.revenue / 1000).toFixed(1)}K</p>
                          <p className="text-xs text-[#64748B]">Revenue</p>
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
