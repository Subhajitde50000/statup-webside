'use client';

import React, { useState } from 'react';
import { TrendingUp, BarChart3, PieChart, Activity } from 'lucide-react';

export default function ChartsAnalytics() {
  const [selectedChart, setSelectedChart] = useState<'bookings' | 'revenue'>('bookings');

  // Sample data for 30 days
  const bookingsData = [
    45, 52, 48, 65, 58, 72, 68, 75, 82, 78, 85, 92, 88, 95, 90, 98, 94, 102, 99, 106, 103, 110, 108, 115, 112, 118, 122, 128, 125, 132
  ];

  const revenueData = [
    4.2, 4.8, 5.1, 5.6, 6.2, 6.8, 7.1, 7.5, 7.9, 8.2, 8.6, 9.1, 8.8, 9.4, 9.2, 9.8, 9.5, 10.2, 9.9, 10.5, 10.3, 11.0, 10.8, 11.4, 11.2, 11.8, 12.1, 12.6, 12.3, 12.9
  ];

  const maxBookings = Math.max(...bookingsData);
  const maxRevenue = Math.max(...revenueData);

  // Professional categories for pie chart
  const categories = [
    { name: 'Electrician', value: 28, color: 'bg-[#4C5BF5]' },
    { name: 'Plumber', value: 24, color: 'bg-[#8B5CF6]' },
    { name: 'Carpenter', value: 18, color: 'bg-[#10B981]' },
    { name: 'Mechanic', value: 15, color: 'bg-[#F59E0B]' },
    { name: 'Others', value: 15, color: 'bg-[#6B7280]' },
  ];

  // Monthly revenue comparison
  const monthlyRevenue = [
    { month: 'Jan', value: 285 },
    { month: 'Feb', value: 310 },
    { month: 'Mar', value: 295 },
    { month: 'Apr', value: 340 },
    { month: 'May', value: 365 },
    { month: 'Jun', value: 390 },
  ];

  const maxMonthlyRevenue = Math.max(...monthlyRevenue.map(m => m.value));

  return (
    <div className="space-y-6">
      {/* Daily Bookings/Revenue Graph */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-[#1F2937]">Performance Analytics</h2>
            <p className="text-sm text-[#6B7280] mt-1">Last 30 days trend</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSelectedChart('bookings')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedChart === 'bookings'
                  ? 'bg-[#4C5BF5] text-white'
                  : 'bg-gray-100 text-[#6B7280] hover:bg-gray-200'
              }`}
            >
              Bookings
            </button>
            <button
              onClick={() => setSelectedChart('revenue')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedChart === 'revenue'
                  ? 'bg-[#10B981] text-white'
                  : 'bg-gray-100 text-[#6B7280] hover:bg-gray-200'
              }`}
            >
              Revenue
            </button>
          </div>
        </div>

        {/* Line Chart */}
        <div className="relative h-64">
          <div className="absolute inset-0 flex items-end justify-between space-x-1">
            {(selectedChart === 'bookings' ? bookingsData : revenueData).map((value, index) => {
              const maxValue = selectedChart === 'bookings' ? maxBookings : maxRevenue;
              const height = (value / maxValue) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center group">
                  <div className="relative w-full">
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block">
                      <div className="bg-[#1F2937] text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                        {selectedChart === 'bookings' ? `${value} bookings` : `₹${value}L`}
                      </div>
                    </div>
                    {/* Bar */}
                    <div
                      className={`w-full rounded-t-sm transition-all duration-300 ${
                        selectedChart === 'bookings'
                          ? 'bg-gradient-to-t from-[#4C5BF5] to-[#8B5CF6]'
                          : 'bg-gradient-to-t from-[#10B981] to-[#10B981]/80'
                      } hover:opacity-80 cursor-pointer`}
                      style={{ height: `${height}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* X-axis labels */}
        <div className="flex items-center justify-between mt-2 text-xs text-[#6B7280]">
          <span>Day 1</span>
          <span>Day 15</span>
          <span>Day 30</span>
        </div>
      </div>

      {/* Bottom Row: Pie Chart and Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Professional Category Split (Pie Chart) */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2 mb-6">
            <PieChart className="w-5 h-5 text-[#4C5BF5]" />
            <h3 className="text-lg font-bold text-[#1F2937]">Professional Categories</h3>
          </div>

          <div className="flex items-center justify-center mb-6">
            {/* Simple Donut Chart Visualization */}
            <div className="relative w-48 h-48">
              {categories.map((category, index) => {
                const previousTotal = categories.slice(0, index).reduce((sum, cat) => sum + cat.value, 0);
                const rotation = (previousTotal / 100) * 360;
                const percentage = (category.value / 100) * 360;
                
                return (
                  <div
                    key={index}
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `conic-gradient(from ${rotation}deg, transparent 0deg, transparent ${rotation}deg, var(--color) ${rotation}deg, var(--color) ${rotation + percentage}deg, transparent ${rotation + percentage}deg)`,
                      '--color': category.color.includes('4C5BF5') ? '#4C5BF5' :
                                 category.color.includes('8B5CF6') ? '#8B5CF6' :
                                 category.color.includes('10B981') ? '#10B981' :
                                 category.color.includes('F59E0B') ? '#F59E0B' : '#6B7280'
                    } as React.CSSProperties}
                  ></div>
                );
              })}
              <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#1F2937]">100%</p>
                  <p className="text-xs text-[#6B7280]">Total</p>
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-2">
            {categories.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 ${category.color} rounded-sm`}></div>
                  <span className="text-sm text-[#6B7280]">{category.name}</span>
                </div>
                <span className="text-sm font-semibold text-[#1F2937]">{category.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Revenue Chart (Bar Graph) */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2 mb-6">
            <BarChart3 className="w-5 h-5 text-[#10B981]" />
            <h3 className="text-lg font-bold text-[#1F2937]">Monthly Revenue</h3>
          </div>

          <div className="h-48 flex items-end justify-between space-x-4">
            {monthlyRevenue.map((month, index) => {
              const height = (month.value / maxMonthlyRevenue) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center group">
                  <div className="relative w-full mb-2">
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                      <div className="bg-[#1F2937] text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                        ₹{month.value}L
                      </div>
                    </div>
                    {/* Bar */}
                    <div
                      className="w-full bg-gradient-to-t from-[#10B981] to-[#10B981]/70 rounded-t-lg hover:from-[#10B981]/80 hover:to-[#10B981]/60 transition-all cursor-pointer"
                      style={{ height: `${height * 1.5}px` }}
                    ></div>
                  </div>
                  <span className="text-xs text-[#6B7280] font-medium">{month.month}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#6B7280]">Average Monthly Revenue</span>
              <span className="font-bold text-[#10B981]">₹330.8L</span>
            </div>
          </div>
        </div>
      </div>

      {/* User Growth Chart (Area Graph) */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-2 mb-6">
          <Activity className="w-5 h-5 text-[#8B5CF6]" />
          <h3 className="text-lg font-bold text-[#1F2937]">User Growth Trend</h3>
        </div>

        <div className="relative h-48">
          {/* Area Chart */}
          <svg className="w-full h-full" viewBox="0 0 400 192" preserveAspectRatio="none">
            <defs>
              <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.05" />
              </linearGradient>
            </defs>
            <path
              d={`M 0 ${192 - (bookingsData[0] / maxBookings * 170)} ${bookingsData.map((val, idx) => {
                const x = (idx / (bookingsData.length - 1)) * 400;
                const y = 192 - (val / maxBookings * 170);
                return `L ${x} ${y}`;
              }).join(' ')} L 400 192 L 0 192 Z`}
              fill="url(#areaGradient)"
            />
            <path
              d={`M 0 ${192 - (bookingsData[0] / maxBookings * 170)} ${bookingsData.map((val, idx) => {
                const x = (idx / (bookingsData.length - 1)) * 400;
                const y = 192 - (val / maxBookings * 170);
                return `L ${x} ${y}`;
              }).join(' ')}`}
              fill="none"
              stroke="#8B5CF6"
              strokeWidth="2"
            />
          </svg>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
          <div className="text-center">
            <p className="text-xs text-[#6B7280] mb-1">New Users</p>
            <p className="text-lg font-bold text-[#8B5CF6]">+2,458</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-[#6B7280] mb-1">Returning Users</p>
            <p className="text-lg font-bold text-[#4C5BF5]">68%</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-[#6B7280] mb-1">Growth Rate</p>
            <p className="text-lg font-bold text-[#10B981]">+12%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
