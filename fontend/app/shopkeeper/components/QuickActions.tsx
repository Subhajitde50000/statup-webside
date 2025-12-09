'use client';

import React from 'react';
import { Plus, Package, CreditCard, History } from 'lucide-react';

const actions = [
  {
    icon: Plus,
    label: 'Add New Product',
    href: '#',
  },
  {
    icon: Package,
    label: 'Manage Inventory',
    href: '#',
  },
  {
    icon: CreditCard,
    label: 'View Payments',
    href: '#',
  },
  {
    icon: History,
    label: 'Order History',
    href: '#',
  },
];

export default function QuickActions() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action, index) => (
        <button
          key={index}
          className="bg-[#00C897] hover:bg-[#00a077] text-white p-6 rounded-xl shadow-sm hover:shadow-md transition flex items-center justify-center space-x-3 font-medium"
        >
          <action.icon className="w-6 h-6" />
          <span>{action.label}</span>
        </button>
      ))}
    </div>
  );
}
