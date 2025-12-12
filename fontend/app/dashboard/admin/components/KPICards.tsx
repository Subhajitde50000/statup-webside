'use client';

import React from 'react';
import { Users, Wrench, Store, ShoppingCart, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
  breakdown?: { label: string; value: string }[];
  graphData?: number[];
}

function KPICard({ title, value, change, icon, color, breakdown, graphData }: KPICardProps) {
  const isPositive = change >= 0;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-[#6B7280] mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-[#1F2937]">{value}</h3>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          {icon}
        </div>
      </div>

      {/* Change Indicator */}
      <div className="flex items-center space-x-2 mb-4">
        <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg ${
          isPositive ? 'bg-[#D1FAE5] text-[#10B981]' : 'bg-[#FEE2E2] text-[#EF4444]'
        }`}>
          {isPositive ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span className="text-sm font-semibold">{Math.abs(change)}%</span>
        </div>
        <span className="text-xs text-[#6B7280]">vs last month</span>
      </div>

      {/* Mini Graph */}
      {graphData && (
        <div className="flex items-end justify-between h-16 mb-4 space-x-1">
          {graphData.map((value, index) => (
            <div
              key={index}
              className={`flex-1 rounded-t transition-all duration-300 ${color} opacity-70`}
              style={{ height: `${value}%` }}
            ></div>
          ))}
        </div>
      )}

      {/* Breakdown */}
      {breakdown && (
        <div className="space-y-2 pt-4 border-t border-gray-100">
          {breakdown.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span className="text-[#6B7280]">{item.label}</span>
              <span className="font-semibold text-[#1F2937]">{item.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function KPICards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
      {/* Total Users */}
      <KPICard
        title="Total Users"
        value="45,238"
        change={12}
        icon={<Users className="w-6 h-6 text-white" />}
        color="bg-gradient-to-br from-[#4C5BF5] to-[#4C5BF5]/80"
        graphData={[45, 52, 48, 65, 58, 72, 68, 75, 82, 78, 85, 92]}
        breakdown={[
          { label: 'Customers', value: '38,420' },
          { label: 'Professionals', value: '4,218' },
          { label: 'Shop Owners', value: '2,600' },
        ]}
      />

      {/* Total Professionals */}
      <KPICard
        title="Total Professionals"
        value="4,218"
        change={8}
        icon={<Wrench className="w-6 h-6 text-white" />}
        color="bg-gradient-to-br from-[#8B5CF6] to-[#8B5CF6]/80"
        graphData={[40, 45, 50, 55, 52, 60, 65, 62, 70, 68, 75, 80]}
        breakdown={[
          { label: 'Approved', value: '3,890' },
          { label: 'Pending KYC', value: '228' },
          { label: 'Suspended', value: '100' },
        ]}
      />

      {/* Total Shops */}
      <KPICard
        title="Total Shops"
        value="2,600"
        change={15}
        icon={<Store className="w-6 h-6 text-white" />}
        color="bg-gradient-to-br from-[#10B981] to-[#10B981]/80"
        graphData={[35, 42, 48, 45, 55, 60, 58, 65, 72, 70, 78, 85]}
        breakdown={[
          { label: 'Active Shops', value: '2,450' },
          { label: 'Pending Verification', value: '98' },
          { label: 'Suspended', value: '52' },
        ]}
      />

      {/* Total Orders Today */}
      <KPICard
        title="Orders (Today)"
        value="1,842"
        change={-5}
        icon={<ShoppingCart className="w-6 h-6 text-white" />}
        color="bg-gradient-to-br from-[#F59E0B] to-[#F59E0B]/80"
        graphData={[60, 55, 62, 58, 65, 70, 68, 75, 72, 80, 78, 85]}
        breakdown={[
          { label: 'Completed', value: '1,124' },
          { label: 'Pending', value: '568' },
          { label: 'Cancelled', value: '150' },
        ]}
      />

      {/* Revenue Today */}
      <KPICard
        title="Revenue (Today)"
        value="₹8.4L"
        change={22}
        icon={<DollarSign className="w-6 h-6 text-white" />}
        color="bg-gradient-to-br from-[#EF4444] to-[#EF4444]/80"
        graphData={[50, 58, 62, 68, 65, 72, 78, 75, 82, 88, 85, 92]}
        breakdown={[
          { label: 'Online', value: '₹6.2L (74%)' },
          { label: 'COD', value: '₹2.2L (26%)' },
        ]}
      />
    </div>
  );
}
