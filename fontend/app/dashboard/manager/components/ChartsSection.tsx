'use client';

import React from 'react';
import { TrendingUp, BarChart3, PieChart } from 'lucide-react';

export default function ChartsSection() {
  // Sample data for orders trend
  const ordersTrendData = [
    { day: 'Mon', new: 120, completed: 95, cancelled: 8 },
    { day: 'Tue', new: 145, completed: 110, cancelled: 12 },
    { day: 'Wed', new: 160, completed: 130, cancelled: 10 },
    { day: 'Thu', new: 180, completed: 150, cancelled: 15 },
    { day: 'Fri', new: 195, completed: 170, cancelled: 12 },
    { day: 'Sat', new: 210, completed: 185, cancelled: 18 },
    { day: 'Sun', new: 175, completed: 155, cancelled: 10 },
  ];

  // Sample data for earnings
  const earningsData = [
    { label: 'Shops', value: 28500, color: '#3B82F6' },
    { label: 'Professionals', value: 42300, color: '#8B5CF6' },
    { label: 'Commission', value: 12200, color: '#10B981' },
  ];

  // Sample data for categories
  const categoryData = [
    { label: 'Electrical', value: 32, color: '#3B82F6' },
    { label: 'Plumbing', value: 24, color: '#8B5CF6' },
    { label: 'Carpenter', value: 18, color: '#10B981' },
    { label: 'AC Repair', value: 15, color: '#06B6D4' },
    { label: 'Mechanic', value: 11, color: '#F59E0B' },
  ];

  const maxValue = Math.max(...ordersTrendData.map(d => d.new));

  return (
    <div className="space-y-6">
      {/* Orders Trend Chart */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#E0E4EA]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-[#1E293B] flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#3B82F6]" />
              Orders Trend (Last 7 Days)
            </h3>
            <p className="text-[#64748B] text-xs mt-1">Track order volumes across the week</p>
          </div>
          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#3B82F6]"></div>
              <span className="text-[#64748B]">New Orders</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#10B981]"></div>
              <span className="text-[#64748B]">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#EF4444]"></div>
              <span className="text-[#64748B]">Cancelled</span>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="flex items-end justify-between h-64 gap-4">
          {ordersTrendData.map((data, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex flex-col items-center gap-1 flex-1 justify-end">
                {/* New Orders Bar */}
                <div 
                  className="w-full bg-gradient-to-t from-[#3B82F6] to-[#60A5FA] rounded-t-lg transition-all hover:opacity-80 cursor-pointer relative group"
                  style={{ height: `${(data.new / maxValue) * 100}%` }}
                >
                  <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-[#1E293B] opacity-0 group-hover:opacity-100 transition-opacity">
                    {data.new}
                  </span>
                </div>
                
                {/* Completed Orders Bar */}
                <div 
                  className="w-full bg-gradient-to-t from-[#10B981] to-[#34D399] rounded-t-lg transition-all hover:opacity-80 cursor-pointer relative group"
                  style={{ height: `${(data.completed / maxValue) * 85}%` }}
                >
                  <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-[#1E293B] opacity-0 group-hover:opacity-100 transition-opacity">
                    {data.completed}
                  </span>
                </div>
                
                {/* Cancelled Orders Bar */}
                <div 
                  className="w-full bg-gradient-to-t from-[#EF4444] to-[#F87171] rounded-t-lg transition-all hover:opacity-80 cursor-pointer relative group"
                  style={{ height: `${(data.cancelled / maxValue) * 50}%` }}
                >
                  <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-[#1E293B] opacity-0 group-hover:opacity-100 transition-opacity">
                    {data.cancelled}
                  </span>
                </div>
              </div>
              <span className="text-xs font-medium text-[#64748B]">{data.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Earnings and Categories Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings Trend Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-[#E2E8F0]">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[#1E293B] flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#10B981]" />
              Earnings Breakdown
            </h3>
            <p className="text-[#64748B] text-xs mt-1">Revenue distribution today</p>
          </div>

          <div className="space-y-4">
            {earningsData.map((item, index) => {
              const maxEarnings = Math.max(...earningsData.map(d => d.value));
              const percentage = (item.value / maxEarnings) * 100;
              
              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[#1E293B]">{item.label}</span>
                    <span className="text-base font-bold text-[#1E293B]">₹{item.value.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-8 bg-[#F1F5F9] rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500 flex items-center justify-end pr-3"
                      style={{ 
                        width: `${percentage}%`,
                        background: `linear-gradient(90deg, ${item.color}, ${item.color}dd)`
                      }}
                    >
                      <span className="text-xs font-bold text-white">{Math.round(percentage)}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-[#E2E8F0]">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#64748B]">Total Revenue</span>
              <span className="text-xl font-bold text-[#1E293B]">
                ₹{earningsData.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Category Distribution Pie Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-[#E2E8F0]">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[#1E293B] flex items-center gap-2">
              <PieChart className="w-5 h-5 text-[#8B5CF6]" />
              Service Categories
            </h3>
            <p className="text-[#64748B] text-xs mt-1">Order distribution by category</p>
          </div>

          <div className="flex items-center justify-center mb-6">
            <div className="relative w-48 h-48">
              {/* Simple Donut Chart Simulation */}
              <div className="w-full h-full rounded-full bg-gradient-to-br from-[#3B82F6] via-[#8B5CF6] via-[#10B981] via-[#06B6D4] to-[#F59E0B]"></div>
              <div className="absolute inset-6 bg-white rounded-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#1E293B]">100%</div>
                  <div className="text-xs text-[#64748B]">Total Orders</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {categoryData.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <span className="text-sm font-medium text-[#1E293B]">{category.label}</span>
                </div>
                <span className="text-sm font-bold text-[#1E293B]">{category.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
