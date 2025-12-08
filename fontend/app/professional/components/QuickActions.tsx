'use client';

import React from 'react';
import { Calendar, Settings, Briefcase, DollarSign } from 'lucide-react';

interface QuickActionsProps {
  onViewBookings: () => void;
  onSetAvailability: () => void;
  onManageServices: () => void;
  onWithdraw: () => void;
}

export default function QuickActions({
  onViewBookings,
  onSetAvailability,
  onManageServices,
  onWithdraw
}: QuickActionsProps) {
  const actions = [
    {
      icon: Calendar,
      label: 'View All Bookings',
      color: 'from-teal-600 to-teal-700',
      onClick: onViewBookings
    },
    {
      icon: Calendar,
      label: 'Set Availability Calendar',
      color: 'from-blue-600 to-blue-700',
      onClick: onSetAvailability
    },
    {
      icon: Briefcase,
      label: 'Manage Services',
      color: 'from-purple-600 to-purple-700',
      onClick: onManageServices
    },
    {
      icon: DollarSign,
      label: 'Withdraw Earnings / Payouts',
      color: 'from-green-600 to-green-700',
      onClick: onWithdraw
    }
  ];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg">
      <h3 className="text-lg font-bold text-gray-900 mb-4">⚡ Quick Actions</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={action.onClick}
              className={`bg-gradient-to-br ${action.color} hover:opacity-90 text-white font-bold py-6 px-4 rounded-2xl transition-all shadow-md hover:shadow-lg flex flex-col items-center gap-3`}
            >
              <Icon className="w-8 h-8" />
              <span className="text-sm text-center leading-tight">{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
