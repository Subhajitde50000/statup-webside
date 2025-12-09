'use client';

import React from 'react';
import { AlertTriangle, Shield, Eye, Ban, X } from 'lucide-react';

export default function AlertsSection() {
  const alerts = [
    {
      id: 1,
      type: 'critical',
      title: 'Fake Document Detection',
      description: 'Professional "Amit Kumar" submitted suspicious Aadhar card',
      time: '5 mins ago',
      actionRequired: true,
    },
    {
      id: 2,
      type: 'warning',
      title: 'Suspicious Login Attempts',
      description: 'Multiple failed login attempts from Shop "TechFix Electronics"',
      time: '18 mins ago',
      actionRequired: true,
    },
    {
      id: 3,
      type: 'info',
      title: 'Shop Flagged by Users',
      description: 'Shop "MegaStore Supplies" received 3 complaints in last 24 hours',
      time: '1 hour ago',
      actionRequired: false,
    },
    {
      id: 4,
      type: 'warning',
      title: 'High Cancellation Rate',
      description: 'Professional "Ravi Singh" cancelled 5 jobs in last 2 days',
      time: '2 hours ago',
      actionRequired: true,
    },
  ];

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical':
        return 'border-l-[#EF4444] bg-[#FEF2F2]';
      case 'warning':
        return 'border-l-[#F59E0B] bg-[#FFFBEB]';
      case 'info':
        return 'border-l-[#3B82F6] bg-[#EFF6FF]';
      default:
        return 'border-l-[#64748B] bg-[#F8FAFC]';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-[#EF4444]" />;
      case 'warning':
        return <Shield className="w-5 h-5 text-[#F59E0B]" />;
      case 'info':
        return <AlertTriangle className="w-5 h-5 text-[#3B82F6]" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-[#64748B]" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-[#E2E8F0]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-[#1E293B] flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#EF4444]" />
            Important Alerts
          </h3>
          <p className="text-[#64748B] text-xs mt-1">Urgent items requiring attention</p>
        </div>
        <span className="px-3 py-1 bg-[#FEE2E2] text-[#DC2626] text-xs font-bold rounded-full">
          {alerts.filter(a => a.actionRequired).length} Urgent
        </span>
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`border-l-4 ${getAlertColor(alert.type)} rounded-r-lg p-4 transition-all hover:shadow-md`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-1">{getIcon(alert.type)}</div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-1">
                  <h4 className="font-semibold text-[#1E293B] text-sm">{alert.title}</h4>
                  <span className="text-xs text-[#64748B] whitespace-nowrap ml-2">{alert.time}</span>
                </div>
                <p className="text-sm text-[#64748B] mb-3">{alert.description}</p>
                
                {alert.actionRequired && (
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 bg-[#3B82F6] text-white text-xs font-semibold rounded-lg hover:bg-[#2563EB] transition-colors flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      View Details
                    </button>
                    <button className="px-3 py-1.5 bg-[#EF4444] text-white text-xs font-semibold rounded-lg hover:bg-[#DC2626] transition-colors flex items-center gap-1">
                      <Ban className="w-3 h-3" />
                      Suspend
                    </button>
                    <button className="px-3 py-1.5 bg-[#64748B] text-white text-xs font-semibold rounded-lg hover:bg-[#475569] transition-colors flex items-center gap-1">
                      <X className="w-4 h-4" />
                      Ignore
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-[#E2E8F0]">
        <button className="text-[#3B82F6] font-semibold text-sm hover:text-[#2563EB] transition-colors">
          View All Alerts →
        </button>
      </div>
    </div>
  );
}
