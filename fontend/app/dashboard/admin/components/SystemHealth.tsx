'use client';

import React from 'react';
import { Server, Zap, AlertCircle, Activity, Users as UsersIcon, CreditCard, Mail, MessageSquare } from 'lucide-react';

interface HealthMetricProps {
  label: string;
  value: string;
  status: 'good' | 'warning' | 'critical';
  icon: React.ReactNode;
}

function HealthMetric({ label, value, status, icon }: HealthMetricProps) {
  const statusColors = {
    good: 'bg-[#D1FAE5] text-[#10B981] border-[#10B981]/20',
    warning: 'bg-[#FEF3C7] text-[#F59E0B] border-[#F59E0B]/20',
    critical: 'bg-[#FEE2E2] text-[#EF4444] border-[#EF4444]/20',
  };

  const dotColors = {
    good: 'bg-[#10B981]',
    warning: 'bg-[#F59E0B]',
    critical: 'bg-[#EF4444]',
  };

  return (
    <div className={`relative px-4 py-3 rounded-xl border ${statusColors[status]} backdrop-blur-sm`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="opacity-80">
            {icon}
          </div>
          <div>
            <p className="text-xs font-medium opacity-75">{label}</p>
            <p className="text-sm font-bold">{value}</p>
          </div>
        </div>
        <div className={`w-2 h-2 rounded-full ${dotColors[status]} animate-pulse`}></div>
      </div>
    </div>
  );
}

export default function SystemHealth() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#1F2937]">System Health</h2>
          <p className="text-sm text-[#6B7280] mt-1">Real-time system monitoring</p>
        </div>
        <div className="flex items-center space-x-2 px-4 py-2 bg-[#D1FAE5] text-[#10B981] rounded-xl">
          <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse"></div>
          <span className="text-sm font-semibold">All Systems Operational</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
        <HealthMetric
          label="Server Uptime"
          value="99.98%"
          status="good"
          icon={<Server className="w-5 h-5" />}
        />
        <HealthMetric
          label="API Response"
          value="124ms"
          status="good"
          icon={<Zap className="w-5 h-5" />}
        />
        <HealthMetric
          label="Error Logs (24h)"
          value="12 errors"
          status="warning"
          icon={<AlertCircle className="w-5 h-5" />}
        />
        <HealthMetric
          label="Live Traffic"
          value="2,458"
          status="good"
          icon={<Activity className="w-5 h-5" />}
        />
        <HealthMetric
          label="Active Sessions"
          value="3,842"
          status="good"
          icon={<UsersIcon className="w-5 h-5" />}
        />
        <HealthMetric
          label="Payment Gateway"
          value="Online"
          status="good"
          icon={<CreditCard className="w-5 h-5" />}
        />
        <HealthMetric
          label="SMS Gateway"
          value="Active"
          status="good"
          icon={<MessageSquare className="w-5 h-5" />}
        />
        <HealthMetric
          label="Email/OTP"
          value="Delayed"
          status="warning"
          icon={<Mail className="w-5 h-5" />}
        />
      </div>

      {/* Additional Details */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#D1FAE5] rounded-lg flex items-center justify-center">
              <Server className="w-5 h-5 text-[#10B981]" />
            </div>
            <div>
              <p className="text-xs text-[#6B7280]">Last Deployment</p>
              <p className="text-sm font-semibold text-[#1F2937]">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#DBEAFE] rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-[#4C5BF5]" />
            </div>
            <div>
              <p className="text-xs text-[#6B7280]">Database Performance</p>
              <p className="text-sm font-semibold text-[#1F2937]">Optimal</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#FEF3C7] rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-[#F59E0B]" />
            </div>
            <div>
              <p className="text-xs text-[#6B7280]">CDN Status</p>
              <p className="text-sm font-semibold text-[#1F2937]">All regions active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
