'use client';

import React from 'react';
import { Store, Users, Calendar, CheckCircle2, AlertTriangle, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

export default function KPICards() {
  const kpiData = [
    {
      id: 1,
      title: 'Total Shops',
      value: '1,248',
      icon: Store,
      color: 'from-[#3B82F6] to-[#2563EB]',
      badge: '+18 today',
      badgeColor: 'bg-[#10B981]',
      trend: 'up',
      trendValue: '+12%',
      sparklineData: [30, 40, 35, 50, 49, 60, 70, 65, 75, 80, 85, 90]
    },
    {
      id: 2,
      title: 'Total Professionals',
      value: '3,462',
      icon: Users,
      color: 'from-[#8B5CF6] to-[#7C3AED]',
      badge: '+42 new today',
      badgeColor: 'bg-[#8B5CF6]',
      trend: 'up',
      trendValue: '+18%',
      sparklineData: [40, 45, 35, 55, 60, 65, 70, 75, 80, 85, 90, 95]
    },
    {
      id: 3,
      title: 'Jobs Booked Today',
      value: '987',
      icon: Calendar,
      color: 'from-[#10B981] to-[#059669]',
      badge: 'Active',
      badgeColor: 'bg-[#10B981]',
      trend: 'up',
      trendValue: '+8%',
      sparklineData: [20, 30, 25, 40, 45, 50, 55, 60, 65, 70, 75, 80]
    },
    {
      id: 4,
      title: 'Completed Jobs',
      value: '842',
      icon: CheckCircle2,
      color: 'from-[#06B6D4] to-[#0891B2]',
      badge: 'Today',
      badgeColor: 'bg-[#06B6D4]',
      trend: 'up',
      trendValue: '+15%',
      sparklineData: [15, 25, 35, 40, 50, 55, 60, 65, 70, 75, 80, 85]
    },
    {
      id: 5,
      title: 'New Complaints',
      value: '12',
      icon: AlertTriangle,
      color: 'from-[#EF4444] to-[#DC2626]',
      badge: 'Urgent',
      badgeColor: 'bg-[#EF4444]',
      trend: 'down',
      trendValue: '-3%',
      sparklineData: [40, 38, 35, 32, 30, 28, 25, 22, 20, 18, 15, 12]
    },
    {
      id: 6,
      title: 'Revenue Today',
      value: '₹42,560',
      icon: DollarSign,
      color: 'from-[#F59E0B] to-[#D97706]',
      badge: 'Target: ₹50k',
      badgeColor: 'bg-[#F59E0B]',
      trend: 'up',
      trendValue: '+25%',
      sparklineData: [200, 250, 300, 350, 380, 400, 420, 450, 480, 500, 520, 550]
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {kpiData.map((kpi) => {
        const Icon = kpi.icon;
        const TrendIcon = kpi.trend === 'up' ? TrendingUp : TrendingDown;
        
        return (
          <div
            key={kpi.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group cursor-pointer border border-[#E2E8F0]"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${kpi.color} flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                
                <span className={`${kpi.badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                  {kpi.badge}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-[#64748B] text-xs font-semibold uppercase tracking-wide mb-2">{kpi.title}</h3>

              {/* Value and Trend */}
              <div className="flex items-end justify-between mb-4">
                <div className="text-3xl font-bold text-[#1E293B]">{kpi.value}</div>
                <div className={`flex items-center gap-1 ${
                  kpi.trend === 'up' ? 'text-[#10B981]' : 'text-[#EF4444]'
                }`}>
                  <TrendIcon className="w-4 h-4" />
                  <span className="text-sm font-bold">{kpi.trendValue}</span>
                </div>
              </div>

              {/* Mini Sparkline Chart */}
              <div className="h-12 flex items-end gap-1">
                {kpi.sparklineData.map((value, index) => (
                  <div
                    key={index}
                    className={`flex-1 bg-gradient-to-t ${kpi.color} rounded-t opacity-30 group-hover:opacity-60 transition-opacity duration-300`}
                    style={{ height: `${(value / 100) * 100}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
