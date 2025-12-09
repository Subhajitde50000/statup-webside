'use client';

import React from 'react';
import { AlertTriangle, XCircle } from 'lucide-react';

const inventoryData = [
  {
    name: 'Motor Oil 20W40',
    currentStock: 2,
    minRequired: 10,
    status: 'Low Stock',
    statusColor: 'text-orange-600',
    statusBg: 'bg-orange-100',
    icon: AlertTriangle,
  },
  {
    name: 'Brake Cleaner',
    currentStock: 0,
    minRequired: 5,
    status: 'Out of Stock',
    statusColor: 'text-red-600',
    statusBg: 'bg-red-100',
    icon: XCircle,
  },
];

export default function InventoryAlerts() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          <h3 className="text-lg font-semibold text-[#0C0C0C]">Inventory Alerts</h3>
        </div>
        <p className="text-sm text-[#555555] mt-1">🔥 Shows items that need restocking</p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-[#0C0C0C]">Item Name</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-[#0C0C0C]">Current Stock</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-[#0C0C0C]">Minimum Required</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-[#0C0C0C]">Status</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-[#0C0C0C]">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {inventoryData.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm font-medium text-[#0C0C0C]">{item.name}</td>
                <td className="px-6 py-4 text-sm text-[#555555]">{item.currentStock}</td>
                <td className="px-6 py-4 text-sm text-[#555555]">{item.minRequired}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${item.statusBg} ${item.statusColor}`}>
                    <item.icon className="w-4 h-4 mr-1" />
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="bg-[#00C897] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#00a077] transition">
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
