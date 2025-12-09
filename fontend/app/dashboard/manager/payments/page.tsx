'use client';

import React, { useState } from 'react';
import { 
  DollarSign, CreditCard, Wallet, Clock, RefreshCw, XCircle, 
  TrendingUp, AlertTriangle, ArrowRight, FileText, Shield, Activity
} from 'lucide-react';
import Link from 'next/link';
import TopNavbar from '../components/TopNavbar';
import LeftSidebar from '../components/LeftSidebar';

export default function PaymentDashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const stats = {
    totalPaymentsToday: 245,
    onlinePayments: 198,
    codPayments: 47,
    pendingSettlements: 34,
    refundsToday: 8,
    failedTransactions: 12,
    revenueThisMonth: 3456000,
    chargebacks: 3,
  };

  const dailyRevenue = [
    { day: 'Mon', amount: 45000 },
    { day: 'Tue', amount: 52000 },
    { day: 'Wed', amount: 38000 },
    { day: 'Thu', amount: 61000 },
    { day: 'Fri', amount: 48000 },
    { day: 'Sat', amount: 67000 },
    { day: 'Sun', amount: 54000 },
  ];

  const paymentModes = [
    { mode: 'UPI', count: 120, percentage: 49 },
    { mode: 'Card', count: 68, percentage: 28 },
    { mode: 'COD', count: 47, percentage: 19 },
    { mode: 'Wallet', count: 10, percentage: 4 },
  ];

  const transactionStats = [
    { label: 'Success', count: 233, percentage: 95, color: '#10B981' },
    { label: 'Failed', count: 12, percentage: 5, color: '#EF4444' },
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
                <h1 className="text-3xl font-semibold text-[#1E293B] mb-2">Payment Management</h1>
                <p className="text-[#64748B] text-sm">Manage all payment transactions, settlements, refunds, and financial analytics</p>
              </div>

              {/* Key Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <DollarSign className="w-8 h-8 opacity-80" />
                    <TrendingUp className="w-5 h-5 opacity-80" />
                  </div>
                  <h3 className="text-3xl font-bold mb-1">{stats.totalPaymentsToday}</h3>
                  <p className="text-sm opacity-90">Total Payments Today</p>
                  <p className="text-xs opacity-75 mt-2">+12% from yesterday</p>
                </div>

                <div className="bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <CreditCard className="w-8 h-8 opacity-80" />
                    <TrendingUp className="w-5 h-5 opacity-80" />
                  </div>
                  <h3 className="text-3xl font-bold mb-1">{stats.onlinePayments}</h3>
                  <p className="text-sm opacity-90">Total Online Payments</p>
                  <p className="text-xs opacity-75 mt-2">{((stats.onlinePayments / stats.totalPaymentsToday) * 100).toFixed(0)}% of total</p>
                </div>

                <div className="bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Wallet className="w-8 h-8 opacity-80" />
                    <TrendingUp className="w-5 h-5 opacity-80" />
                  </div>
                  <h3 className="text-3xl font-bold mb-1">{stats.codPayments}</h3>
                  <p className="text-sm opacity-90">Total COD Payments</p>
                  <p className="text-xs opacity-75 mt-2">{((stats.codPayments / stats.totalPaymentsToday) * 100).toFixed(0)}% of total</p>
                </div>

                <div className="bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] rounded-xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Clock className="w-8 h-8 opacity-80" />
                    <AlertTriangle className="w-5 h-5 opacity-80" />
                  </div>
                  <h3 className="text-3xl font-bold mb-1">{stats.pendingSettlements}</h3>
                  <p className="text-sm opacity-90">Pending Settlements</p>
                  <p className="text-xs opacity-75 mt-2">Requires action</p>
                </div>

                <div className="bg-gradient-to-br from-[#06B6D4] to-[#0891B2] rounded-xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <RefreshCw className="w-8 h-8 opacity-80" />
                    <TrendingUp className="w-5 h-5 opacity-80" />
                  </div>
                  <h3 className="text-3xl font-bold mb-1">{stats.refundsToday}</h3>
                  <p className="text-sm opacity-90">Refunds Processed Today</p>
                  <p className="text-xs opacity-75 mt-2">₹{(stats.refundsToday * 850).toLocaleString()}</p>
                </div>

                <div className="bg-gradient-to-br from-[#EF4444] to-[#DC2626] rounded-xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <XCircle className="w-8 h-8 opacity-80" />
                    <AlertTriangle className="w-5 h-5 opacity-80" />
                  </div>
                  <h3 className="text-3xl font-bold mb-1">{stats.failedTransactions}</h3>
                  <p className="text-sm opacity-90">Failed Transactions</p>
                  <p className="text-xs opacity-75 mt-2">{((stats.failedTransactions / stats.totalPaymentsToday) * 100).toFixed(1)}% failure rate</p>
                </div>

                <div className="bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <DollarSign className="w-8 h-8 opacity-80" />
                    <TrendingUp className="w-5 h-5 opacity-80" />
                  </div>
                  <h3 className="text-3xl font-bold mb-1">₹{(stats.revenueThisMonth / 100000).toFixed(1)}L</h3>
                  <p className="text-sm opacity-90">Revenue This Month</p>
                  <p className="text-xs opacity-75 mt-2">+23% from last month</p>
                </div>

                <div className="bg-gradient-to-br from-[#EF4444] to-[#DC2626] rounded-xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Shield className="w-8 h-8 opacity-80" />
                    <AlertTriangle className="w-5 h-5 opacity-80" />
                  </div>
                  <h3 className="text-3xl font-bold mb-1">{stats.chargebacks}</h3>
                  <p className="text-sm opacity-90">Chargebacks / Disputes</p>
                  <p className="text-xs opacity-75 mt-2">Requires immediate attention</p>
                </div>
              </div>

              {/* Graphs Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Daily Revenue Chart */}
                <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-[#1E293B] mb-6">Daily Revenue Trend</h2>
                  <div className="space-y-3">
                    {dailyRevenue.map((item) => {
                      const maxValue = Math.max(...dailyRevenue.map(d => d.amount));
                      return (
                        <div key={item.day}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-[#64748B]">{item.day}</span>
                            <span className="text-sm font-semibold text-[#1E293B]">₹{(item.amount / 1000).toFixed(0)}K</span>
                          </div>
                          <div className="w-full bg-[#F1F5F9] rounded-full h-3">
                            <div 
                              className="bg-gradient-to-r from-[#10B981] to-[#059669] h-3 rounded-full transition-all duration-500"
                              style={{ width: `${(item.amount / maxValue) * 100}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Payment Mode Distribution */}
                <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-[#1E293B] mb-6">Payment Mode Usage</h2>
                  <div className="space-y-4">
                    {paymentModes.map((mode, index) => {
                      const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];
                      return (
                        <div key={mode.mode}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-4 h-4 rounded"
                                style={{ backgroundColor: colors[index] }}
                              />
                              <span className="text-sm font-medium text-[#1E293B]">{mode.mode}</span>
                            </div>
                            <span className="text-sm font-semibold text-[#64748B]">{mode.count} ({mode.percentage}%)</span>
                          </div>
                          <div className="w-full bg-[#F1F5F9] rounded-full h-2">
                            <div 
                              className="h-2 rounded-full transition-all duration-500"
                              style={{ 
                                width: `${mode.percentage}%`,
                                backgroundColor: colors[index]
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Success vs Failed */}
                <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-[#1E293B] mb-6">Transaction Status</h2>
                  <div className="flex items-center justify-center h-48">
                    <div className="relative w-48 h-48">
                      {transactionStats.map((stat, index) => {
                        const prevPercentage = transactionStats.slice(0, index).reduce((sum, s) => sum + s.percentage, 0);
                        const dashArray = `${stat.percentage * 3.14} 314`;
                        const dashOffset = -prevPercentage * 3.14;
                        
                        return (
                          <svg key={stat.label} className="absolute inset-0 transform -rotate-90" viewBox="0 0 100 100">
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="none"
                              stroke={stat.color}
                              strokeWidth="20"
                              strokeDasharray={dashArray}
                              strokeDashoffset={dashOffset}
                            />
                          </svg>
                        );
                      })}
                      <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <span className="text-3xl font-bold text-[#1E293B]">{stats.totalPaymentsToday}</span>
                        <span className="text-sm text-[#64748B]">Total</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 space-y-2">
                    {transactionStats.map((stat) => (
                      <div key={stat.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stat.color }} />
                          <span className="text-sm text-[#64748B]">{stat.label}</span>
                        </div>
                        <span className="text-sm font-semibold text-[#1E293B]">{stat.count} ({stat.percentage}%)</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-[#1E293B] mb-6">Quick Access</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <Link href="/dashboard/manager/payments/transactions">
                    <div className="p-4 bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] rounded-lg border border-[#3B82F6]/20 hover:shadow-md transition-all cursor-pointer group">
                      <FileText className="w-8 h-8 text-[#3B82F6] mb-3" />
                      <h3 className="font-semibold text-[#1E293B] mb-1 group-hover:text-[#3B82F6] transition-colors">View All Transactions</h3>
                      <p className="text-xs text-[#64748B]">{stats.totalPaymentsToday} transactions today</p>
                      <div className="flex items-center gap-1 mt-2 text-[#3B82F6] text-sm font-medium">
                        <span>View</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>

                  <Link href="/dashboard/manager/payments/settlements">
                    <div className="p-4 bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7] rounded-lg border border-[#10B981]/20 hover:shadow-md transition-all cursor-pointer group">
                      <Clock className="w-8 h-8 text-[#10B981] mb-3" />
                      <h3 className="font-semibold text-[#1E293B] mb-1 group-hover:text-[#10B981] transition-colors">View Settlements</h3>
                      <p className="text-xs text-[#64748B]">{stats.pendingSettlements} pending</p>
                      <div className="flex items-center gap-1 mt-2 text-[#10B981] text-sm font-medium">
                        <span>View</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>

                  <Link href="/dashboard/manager/payments/refunds">
                    <div className="p-4 bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] rounded-lg border border-[#F59E0B]/20 hover:shadow-md transition-all cursor-pointer group">
                      <RefreshCw className="w-8 h-8 text-[#F59E0B] mb-3" />
                      <h3 className="font-semibold text-[#1E293B] mb-1 group-hover:text-[#F59E0B] transition-colors">View Refund Requests</h3>
                      <p className="text-xs text-[#64748B]">{stats.refundsToday} processed today</p>
                      <div className="flex items-center gap-1 mt-2 text-[#F59E0B] text-sm font-medium">
                        <span>View</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>

                  <Link href="/dashboard/manager/payments/disputes">
                    <div className="p-4 bg-gradient-to-br from-[#FEE2E2] to-[#FECACA] rounded-lg border border-[#EF4444]/20 hover:shadow-md transition-all cursor-pointer group">
                      <Shield className="w-8 h-8 text-[#EF4444] mb-3" />
                      <h3 className="font-semibold text-[#1E293B] mb-1 group-hover:text-[#EF4444] transition-colors">View Disputes</h3>
                      <p className="text-xs text-[#64748B]">{stats.chargebacks} active disputes</p>
                      <div className="flex items-center gap-1 mt-2 text-[#EF4444] text-sm font-medium">
                        <span>View</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>

                  <Link href="/dashboard/manager/payments/gateway-logs">
                    <div className="p-4 bg-gradient-to-br from-[#F3E8FF] to-[#E9D5FF] rounded-lg border border-[#8B5CF6]/20 hover:shadow-md transition-all cursor-pointer group">
                      <Activity className="w-8 h-8 text-[#8B5CF6] mb-3" />
                      <h3 className="font-semibold text-[#1E293B] mb-1 group-hover:text-[#8B5CF6] transition-colors">Payment Gateway Logs</h3>
                      <p className="text-xs text-[#64748B]">Debug & monitoring</p>
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
