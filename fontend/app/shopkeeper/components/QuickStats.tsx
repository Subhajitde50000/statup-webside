'use client';

import React from 'react';
import { Package, DollarSign, Clock, AlertTriangle } from 'lucide-react';

const statsData = [
  {
    icon: Package,
    title: 'Total Orders Today',
    value: '12 Orders',
    subtitle: 'Total orders received today',
    color: 'bg-green-50',
    iconColor: 'text-[#00C897]',
  },
  {
    icon: DollarSign,
    title: 'Earnings Today',
    value: '₹4,520.00',
    subtitle: "Today's earnings",
    color: 'bg-green-50',
    iconColor: 'text-[#00C897]',
  },
  {
    icon: Clock,
    title: 'Pending Orders',
    value: '5 Pending',
    subtitle: 'Awaiting confirmation / packing',
    color: 'bg-yellow-50',
    iconColor: 'text-yellow-600',
  },
  {
    icon: AlertTriangle,
    title: 'Inventory Alerts',
    value: '3 Alerts',
    subtitle: 'Low & Out-of-stock items',
    color: 'bg-red-50',
    iconColor: 'text-red-600',
  },
];

export default function QuickStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {statsData.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition"
        >
          <div className="flex items-start space-x-4">
            <div className={`${stat.color} p-3 rounded-lg`}>
              <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-[#555555] mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-[#0C0C0C] mb-1">{stat.value}</p>
              <p className="text-xs text-[#555555]">{stat.subtitle}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
