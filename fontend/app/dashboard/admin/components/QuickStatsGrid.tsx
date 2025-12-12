'use client';

import React from 'react';
import { Users, Wrench, Store, Package, Star, AlertTriangle, Clock, FileText } from 'lucide-react';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  stats: { label: string; value: string; color?: string }[];
  gradient: string;
}

function StatCard({ icon, title, stats, gradient }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
      <div className="flex items-center space-x-3 mb-4">
        <div className={`w-12 h-12 ${gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <h3 className="text-lg font-bold text-[#1F2937]">{title}</h3>
      </div>
      
      <div className="space-y-3">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm text-[#6B7280]">{stat.label}</span>
            <span className={`text-sm font-bold ${stat.color || 'text-[#1F2937]'}`}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function QuickStatsGrid() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#1F2937]">Quick Statistics</h2>
        <button className="text-sm text-[#4C5BF5] hover:text-[#8B5CF6] font-medium transition-colors">
          View Detailed Reports →
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Customers */}
        <StatCard
          icon={<Users className="w-6 h-6 text-white" />}
          title="Customers"
          gradient="bg-gradient-to-br from-[#4C5BF5] to-[#4C5BF5]/80"
          stats={[
            { label: 'Total Registrations', value: '38,420' },
            { label: 'New Today', value: '+284', color: 'text-[#10B981]' },
            { label: 'Users Flagged', value: '12', color: 'text-[#EF4444]' },
          ]}
        />

        {/* Professionals */}
        <StatCard
          icon={<Wrench className="w-6 h-6 text-white" />}
          title="Professionals"
          gradient="bg-gradient-to-br from-[#8B5CF6] to-[#8B5CF6]/80"
          stats={[
            { label: 'Bookings Completed', value: '12,458' },
            { label: 'Pending Verification', value: '228', color: 'text-[#F59E0B]' },
            { label: 'Average Rating', value: '4.7 ⭐' },
          ]}
        />

        {/* Shops */}
        <StatCard
          icon={<Store className="w-6 h-6 text-white" />}
          title="Shops"
          gradient="bg-gradient-to-br from-[#10B981] to-[#10B981]/80"
          stats={[
            { label: 'Products Listed', value: '45,890' },
            { label: 'Out-of-Stock Alerts', value: '156', color: 'text-[#EF4444]' },
            { label: 'Support Requests', value: '24', color: 'text-[#F59E0B]' },
          ]}
        />

        {/* Orders */}
        <StatCard
          icon={<Package className="w-6 h-6 text-white" />}
          title="Orders"
          gradient="bg-gradient-to-br from-[#F59E0B] to-[#F59E0B]/80"
          stats={[
            { label: 'New Orders', value: '568' },
            { label: 'In Progress', value: '892' },
            { label: 'For Review', value: '45', color: 'text-[#4C5BF5]' },
            { label: 'Disputes Open', value: '8', color: 'text-[#EF4444]' },
          ]}
        />
      </div>

      {/* Additional Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* Performance Metrics */}
        <div className="bg-gradient-to-br from-[#4C5BF5]/10 to-[#8B5CF6]/10 rounded-2xl p-6 border border-[#4C5BF5]/20">
          <div className="flex items-center space-x-3 mb-4">
            <Star className="w-6 h-6 text-[#4C5BF5]" />
            <h3 className="font-bold text-[#1F2937]">Overall Performance</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#6B7280]">Platform Rating</span>
              <span className="font-semibold text-[#1F2937]">4.6/5.0</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#6B7280]">Customer Satisfaction</span>
              <span className="font-semibold text-[#1F2937]">92%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#6B7280]">Repeat Customers</span>
              <span className="font-semibold text-[#1F2937]">68%</span>
            </div>
          </div>
        </div>

        {/* Critical Alerts */}
        <div className="bg-gradient-to-br from-[#EF4444]/10 to-[#EF4444]/5 rounded-2xl p-6 border border-[#EF4444]/20">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-[#EF4444]" />
            <h3 className="font-bold text-[#1F2937]">Critical Alerts</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#6B7280]">Payment Failures</span>
              <span className="font-semibold text-[#EF4444]">23</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#6B7280]">Delivery Delays</span>
              <span className="font-semibold text-[#F59E0B]">45</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#6B7280]">Fraud Alerts</span>
              <span className="font-semibold text-[#EF4444]">5</span>
            </div>
          </div>
        </div>

        {/* Pending Actions */}
        <div className="bg-gradient-to-br from-[#F59E0B]/10 to-[#F59E0B]/5 rounded-2xl p-6 border border-[#F59E0B]/20">
          <div className="flex items-center space-x-3 mb-4">
            <Clock className="w-6 h-6 text-[#F59E0B]" />
            <h3 className="font-bold text-[#1F2937]">Pending Actions</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#6B7280]">Verifications</span>
              <span className="font-semibold text-[#F59E0B]">326</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#6B7280]">Refund Requests</span>
              <span className="font-semibold text-[#F59E0B]">78</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#6B7280]">Support Tickets</span>
              <span className="font-semibold text-[#F59E0B]">142</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
