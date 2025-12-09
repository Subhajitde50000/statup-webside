'use client';

import React, { useState } from 'react';
import { 
  AlertTriangle, Users, CheckCircle, AlertOctagon, Briefcase, 
  ShoppingBag, User, Shield, TrendingUp, FileText, ArrowRight, Activity
} from 'lucide-react';
import Link from 'next/link';
import TopNavbar from '../components/TopNavbar';
import LeftSidebar from '../components/LeftSidebar';

export default function ComplaintsDashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const stats = {
    totalToday: 45,
    pending: 18,
    resolved: 234,
    highPriority: 7,
    fromProfessionals: 12,
    fromCustomers: 28,
    againstShops: 15,
    safetyAbuse: 3,
  };

  const complaintTypes = [
    { type: 'Service Quality', count: 85, percentage: 35, color: '#3B82F6' },
    { type: 'Payment Issue', count: 52, percentage: 22, color: '#10B981' },
    { type: 'Behavior', count: 38, percentage: 16, color: '#F59E0B' },
    { type: 'Fraud', count: 28, percentage: 12, color: '#EF4444' },
    { type: 'Product Issue', count: 22, percentage: 9, color: '#8B5CF6' },
    { type: 'Other', count: 15, percentage: 6, color: '#64748B' },
  ];

  const resolutionTime = [
    { day: 'Mon', hours: 4.5 },
    { day: 'Tue', hours: 3.8 },
    { day: 'Wed', hours: 5.2 },
    { day: 'Thu', hours: 4.1 },
    { day: 'Fri', hours: 3.5 },
    { day: 'Sat', hours: 4.8 },
    { day: 'Sun', hours: 3.9 },
  ];

  const statusTrend = [
    { week: 'Week 1', pending: 25, resolved: 45 },
    { week: 'Week 2', pending: 30, resolved: 52 },
    { week: 'Week 3', pending: 22, resolved: 58 },
    { week: 'Week 4', pending: 18, resolved: 63 },
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
              <div className="mb-8">
                <h1 className="text-3xl font-semibold text-[#1E293B] mb-2 flex items-center gap-3">
                  <AlertTriangle className="w-8 h-8 text-[#10B981]" />
                  Complaints & Reports Management
                </h1>
                <p className="text-[#64748B] text-sm">Monitor, manage, and resolve customer complaints and service issues</p>
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <AlertTriangle className="w-8 h-8 opacity-80" />
                    <TrendingUp className="w-5 h-5 opacity-80" />
                  </div>
                  <h3 className="text-3xl font-bold mb-1">{stats.totalToday}</h3>
                  <p className="text-sm opacity-90">Total Complaints Today</p>
                  <p className="text-xs opacity-75 mt-2">+8% from yesterday</p>
                </div>

                <div className="bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <AlertOctagon className="w-8 h-8 opacity-80" />
                    <AlertTriangle className="w-5 h-5 opacity-80" />
                  </div>
                  <h3 className="text-3xl font-bold mb-1">{stats.pending}</h3>
                  <p className="text-sm opacity-90">Pending Complaints</p>
                  <p className="text-xs opacity-75 mt-2">Requires attention</p>
                </div>

                <div className="bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <CheckCircle className="w-8 h-8 opacity-80" />
                    <TrendingUp className="w-5 h-5 opacity-80" />
                  </div>
                  <h3 className="text-3xl font-bold mb-1">{stats.resolved}</h3>
                  <p className="text-sm opacity-90">Resolved Complaints</p>
                  <p className="text-xs opacity-75 mt-2">This month</p>
                </div>

                <div className="bg-gradient-to-br from-[#EF4444] to-[#DC2626] rounded-xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <AlertOctagon className="w-8 h-8 opacity-80" />
                    <AlertTriangle className="w-5 h-5 opacity-80" />
                  </div>
                  <h3 className="text-3xl font-bold mb-1">{stats.highPriority}</h3>
                  <p className="text-sm opacity-90">High Priority / Critical</p>
                  <p className="text-xs opacity-75 mt-2">Immediate action needed</p>
                </div>

                <div className="bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] rounded-xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Briefcase className="w-8 h-8 opacity-80" />
                  </div>
                  <h3 className="text-3xl font-bold mb-1">{stats.fromProfessionals}</h3>
                  <p className="text-sm opacity-90">From Professionals</p>
                  <p className="text-xs opacity-75 mt-2">Service providers</p>
                </div>

                <div className="bg-gradient-to-br from-[#06B6D4] to-[#0891B2] rounded-xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Users className="w-8 h-8 opacity-80" />
                  </div>
                  <h3 className="text-3xl font-bold mb-1">{stats.fromCustomers}</h3>
                  <p className="text-sm opacity-90">From Customers</p>
                  <p className="text-xs opacity-75 mt-2">End users</p>
                </div>

                <div className="bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <ShoppingBag className="w-8 h-8 opacity-80" />
                  </div>
                  <h3 className="text-3xl font-bold mb-1">{stats.againstShops}</h3>
                  <p className="text-sm opacity-90">Against Shops</p>
                  <p className="text-xs opacity-75 mt-2">Shop-related issues</p>
                </div>

                <div className="bg-gradient-to-br from-[#EF4444] to-[#DC2626] rounded-xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Shield className="w-8 h-8 opacity-80" />
                    <AlertTriangle className="w-5 h-5 opacity-80" />
                  </div>
                  <h3 className="text-3xl font-bold mb-1">{stats.safetyAbuse}</h3>
                  <p className="text-sm opacity-90">Safety / Abuse Complaints</p>
                  <p className="text-xs opacity-75 mt-2">Critical priority</p>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Complaint Types Distribution */}
                <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-[#1E293B] mb-6">Complaint Types Distribution</h2>
                  <div className="flex items-center justify-center mb-6 h-48">
                    <div className="relative w-48 h-48">
                      {complaintTypes.map((type, index) => {
                        const prevPercentage = complaintTypes.slice(0, index).reduce((sum, t) => sum + t.percentage, 0);
                        const dashArray = `${type.percentage * 3.14} 314`;
                        const dashOffset = -prevPercentage * 3.14;
                        
                        return (
                          <svg key={type.type} className="absolute inset-0 transform -rotate-90" viewBox="0 0 100 100">
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="none"
                              stroke={type.color}
                              strokeWidth="20"
                              strokeDasharray={dashArray}
                              strokeDashoffset={dashOffset}
                            />
                          </svg>
                        );
                      })}
                      <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <span className="text-3xl font-bold text-[#1E293B]">240</span>
                        <span className="text-sm text-[#64748B]">Total</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {complaintTypes.map((type) => (
                      <div key={type.type} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }} />
                          <span className="text-sm text-[#64748B]">{type.type}</span>
                        </div>
                        <span className="text-sm font-semibold text-[#1E293B]">{type.count} ({type.percentage}%)</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Resolution Time */}
                <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-[#1E293B] mb-6">Average Resolution Time</h2>
                  <div className="space-y-3">
                    {resolutionTime.map((item) => {
                      const maxHours = Math.max(...resolutionTime.map(r => r.hours));
                      return (
                        <div key={item.day}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-[#64748B]">{item.day}</span>
                            <span className="text-sm font-semibold text-[#1E293B]">{item.hours}h</span>
                          </div>
                          <div className="w-full bg-[#F1F5F9] rounded-full h-3">
                            <div 
                              className="bg-gradient-to-r from-[#10B981] to-[#059669] h-3 rounded-full transition-all duration-500"
                              style={{ width: `${(item.hours / maxHours) * 100}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-6 p-3 bg-[#F0FDF4] rounded-lg border border-[#10B981]/20">
                    <p className="text-sm text-[#064E3B]">
                      <span className="font-bold">Average: 4.2 hours</span> - Meeting SLA targets
                    </p>
                  </div>
                </div>

                {/* Complaint Status Trend */}
                <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-[#1E293B] mb-6">Complaint Status Trend</h2>
                  <div className="space-y-4">
                    {statusTrend.map((week) => (
                      <div key={week.week}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-[#64748B]">{week.week}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-[#F59E0B]">Pending: {week.pending}</span>
                            <span className="text-xs text-[#10B981]">Resolved: {week.resolved}</span>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <div 
                            className="bg-[#FEF3C7] rounded h-2"
                            style={{ width: `${(week.pending / (week.pending + week.resolved)) * 100}%` }}
                          />
                          <div 
                            className="bg-[#D1FAE5] rounded h-2"
                            style={{ width: `${(week.resolved / (week.pending + week.resolved)) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-[#FEF3C7] rounded" />
                      <span className="text-xs text-[#64748B]">Pending</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-[#D1FAE5] rounded" />
                      <span className="text-xs text-[#64748B]">Resolved</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-[#1E293B] mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Link href="/dashboard/manager/complaints/all">
                    <div className="p-4 bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] rounded-lg border border-[#3B82F6]/20 hover:shadow-md transition-all cursor-pointer group">
                      <FileText className="w-8 h-8 text-[#3B82F6] mb-3" />
                      <h3 className="font-semibold text-[#1E293B] mb-1 group-hover:text-[#3B82F6] transition-colors">View All Complaints</h3>
                      <p className="text-xs text-[#64748B]">{stats.totalToday} active today</p>
                      <div className="flex items-center gap-1 mt-2 text-[#3B82F6] text-sm font-medium">
                        <span>View</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>

                  <Link href="/dashboard/manager/complaints/create">
                    <div className="p-4 bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7] rounded-lg border border-[#10B981]/20 hover:shadow-md transition-all cursor-pointer group">
                      <AlertTriangle className="w-8 h-8 text-[#10B981] mb-3" />
                      <h3 className="font-semibold text-[#1E293B] mb-1 group-hover:text-[#10B981] transition-colors">Create Manual Complaint</h3>
                      <p className="text-xs text-[#64748B]">Admin-initiated</p>
                      <div className="flex items-center gap-1 mt-2 text-[#10B981] text-sm font-medium">
                        <span>Create</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>

                  <Link href="/dashboard/manager/complaints/high-priority">
                    <div className="p-4 bg-gradient-to-br from-[#FEE2E2] to-[#FECACA] rounded-lg border border-[#EF4444]/20 hover:shadow-md transition-all cursor-pointer group">
                      <AlertOctagon className="w-8 h-8 text-[#EF4444] mb-3" />
                      <h3 className="font-semibold text-[#1E293B] mb-1 group-hover:text-[#EF4444] transition-colors">High Priority Issues</h3>
                      <p className="text-xs text-[#64748B]">{stats.highPriority} critical complaints</p>
                      <div className="flex items-center gap-1 mt-2 text-[#EF4444] text-sm font-medium">
                        <span>View</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>

                  <Link href="/dashboard/manager/complaints/escalations">
                    <div className="p-4 bg-gradient-to-br from-[#F3E8FF] to-[#E9D5FF] rounded-lg border border-[#8B5CF6]/20 hover:shadow-md transition-all cursor-pointer group">
                      <Activity className="w-8 h-8 text-[#8B5CF6] mb-3" />
                      <h3 className="font-semibold text-[#1E293B] mb-1 group-hover:text-[#8B5CF6] transition-colors">Open Dispute Panel</h3>
                      <p className="text-xs text-[#64748B]">Escalated cases</p>
                      <div className="flex items-center gap-1 mt-2 text-[#8B5CF6] text-sm font-medium">
                        <span>View</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
