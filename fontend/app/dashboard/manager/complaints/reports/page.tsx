'use client';

import React, { useState } from 'react';
import { Download, TrendingUp, Clock, BarChart3, PieChart, Users } from 'lucide-react';
import TopNavbar from '../../../components/TopNavbar';
import LeftSidebar from '../../../components/LeftSidebar';

export default function ReportsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dateRange, setDateRange] = useState('last-7-days');

  const stats = {
    totalComplaints: 240,
    resolved: 234,
    pending: 18,
    avgResolutionTime: '4.2h',
    resolutionRate: '97.5%',
    customerComplaints: 152,
    professionalComplaints: 68,
    shopComplaints: 20,
  };

  const categoryData = [
    { category: 'Service Quality', count: 84, percentage: 35 },
    { category: 'Payment Issues', count: 53, percentage: 22 },
    { category: 'Behavior/Abuse', count: 38, percentage: 16 },
    { category: 'Fraud', count: 29, percentage: 12 },
    { category: 'Product Quality', count: 22, percentage: 9 },
    { category: 'Other', count: 14, percentage: 6 },
  ];

  const dailySummary = [
    { day: 'Mon', received: 32, resolved: 30, pending: 2 },
    { day: 'Tue', received: 38, resolved: 36, pending: 2 },
    { day: 'Wed', received: 45, resolved: 42, pending: 3 },
    { day: 'Thu', received: 34, resolved: 33, pending: 1 },
    { day: 'Fri', received: 40, resolved: 38, pending: 2 },
    { day: 'Sat', received: 28, resolved: 27, pending: 1 },
    { day: 'Sun', received: 23, resolved: 22, pending: 1 },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      <TopNavbar />
      <div className="flex">
        <LeftSidebar isOpen={sidebarOpen} />
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
          <div className="p-8">
            <div className="max-w-[1600px] mx-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-semibold text-[#1E293B] mb-2">Complaint Resolution Reports</h1>
                  <p className="text-sm text-[#64748B]">Analyze complaint trends and resolution performance</p>
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
                    <option value="this-month">This Month</option>
                    <option value="last-month">Last Month</option>
                  </select>
                  <button className="px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-colors flex items-center gap-2 text-sm font-medium">
                    <Download className="w-4 h-4" />
                    Export PDF
                  </button>
                  <button className="px-4 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors flex items-center gap-2 text-sm font-medium">
                    <Download className="w-4 h-4" />
                    Export Excel
                  </button>
                </div>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-gradient-to-br from-[#DBEAFE] to-[#BFDBFE] rounded-xl p-6 border border-[#3B82F6]/20">
                  <div className="flex items-center justify-between mb-2">
                    <BarChart3 className="w-8 h-8 text-[#3B82F6]" />
                    <span className="text-2xl font-bold text-[#1E293B]">{stats.totalComplaints}</span>
                  </div>
                  <p className="text-sm font-medium text-[#64748B]">Total Complaints</p>
                  <p className="text-xs text-[#10B981] mt-1">↑ 12% from last week</p>
                </div>

                <div className="bg-gradient-to-br from-[#D1FAE5] to-[#A7F3D0] rounded-xl p-6 border border-[#10B981]/20">
                  <div className="flex items-center justify-between mb-2">
                    <TrendingUp className="w-8 h-8 text-[#10B981]" />
                    <span className="text-2xl font-bold text-[#1E293B]">{stats.resolutionRate}</span>
                  </div>
                  <p className="text-sm font-medium text-[#64748B]">Resolution Rate</p>
                  <p className="text-xs text-[#10B981] mt-1">Excellent performance</p>
                </div>

                <div className="bg-gradient-to-br from-[#FED7AA] to-[#FDBA74] rounded-xl p-6 border border-[#F59E0B]/20">
                  <div className="flex items-center justify-between mb-2">
                    <Clock className="w-8 h-8 text-[#F59E0B]" />
                    <span className="text-2xl font-bold text-[#1E293B]">{stats.avgResolutionTime}</span>
                  </div>
                  <p className="text-sm font-medium text-[#64748B]">Avg Resolution Time</p>
                  <p className="text-xs text-[#10B981] mt-1">↓ 0.8h improvement</p>
                </div>

                <div className="bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] rounded-xl p-6 border border-[#F59E0B]/20">
                  <div className="flex items-center justify-between mb-2">
                    <Users className="w-8 h-8 text-[#F59E0B]" />
                    <span className="text-2xl font-bold text-[#1E293B]">{stats.pending}</span>
                  </div>
                  <p className="text-sm font-medium text-[#64748B]">Pending Complaints</p>
                  <p className="text-xs text-[#64748B] mt-1">Needs attention</p>
                </div>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Daily Trend Chart */}
                <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-[#1E293B] mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-[#10B981]" />
                    Daily Complaint Summary
                  </h2>
                  <div className="space-y-3">
                    {dailySummary.map((day) => (
                      <div key={day.day}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-[#64748B]">{day.day}</span>
                          <div className="flex items-center gap-3 text-xs">
                            <span className="text-[#3B82F6]">Received: {day.received}</span>
                            <span className="text-[#10B981]">Resolved: {day.resolved}</span>
                            <span className="text-[#F59E0B]">Pending: {day.pending}</span>
                          </div>
                        </div>
                        <div className="relative h-8 bg-[#F8FAFC] rounded-lg overflow-hidden">
                          <div 
                            className="absolute left-0 h-full bg-[#10B981]"
                            style={{ width: `${(day.resolved / day.received) * 100}%` }}
                          />
                          <div 
                            className="absolute h-full bg-[#F59E0B]"
                            style={{ 
                              left: `${(day.resolved / day.received) * 100}%`,
                              width: `${(day.pending / day.received) * 100}%` 
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Category Distribution */}
                <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-[#1E293B] mb-4 flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-[#10B981]" />
                    Complaint Category Trends
                  </h2>
                  <div className="space-y-4">
                    {categoryData.map((item) => (
                      <div key={item.category}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-[#1E293B]">{item.category}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-[#64748B]">{item.count}</span>
                            <span className="text-xs text-[#64748B]">({item.percentage}%)</span>
                          </div>
                        </div>
                        <div className="w-full bg-[#F8FAFC] rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-[#10B981] to-[#059669] h-2 rounded-full transition-all duration-300"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* User-Based Analysis */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-[#1E293B] mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#10B981]" />
                  User-Based Complaint Analysis
                </h2>
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-[#DBEAFE] rounded-xl">
                    <p className="text-3xl font-bold text-[#3B82F6] mb-2">{stats.customerComplaints}</p>
                    <p className="text-sm font-medium text-[#64748B]">From Customers</p>
                    <p className="text-xs text-[#64748B] mt-1">63% of total</p>
                  </div>
                  <div className="text-center p-6 bg-[#E9D5FF] rounded-xl">
                    <p className="text-3xl font-bold text-[#8B5CF6] mb-2">{stats.professionalComplaints}</p>
                    <p className="text-sm font-medium text-[#64748B]">From Professionals</p>
                    <p className="text-xs text-[#64748B] mt-1">28% of total</p>
                  </div>
                  <div className="text-center p-6 bg-[#FED7AA] rounded-xl">
                    <p className="text-3xl font-bold text-[#F59E0B] mb-2">{stats.shopComplaints}</p>
                    <p className="text-sm font-medium text-[#64748B]">Against Shops</p>
                    <p className="text-xs text-[#64748B] mt-1">9% of total</p>
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
