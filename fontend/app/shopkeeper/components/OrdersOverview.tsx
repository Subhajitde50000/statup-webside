'use client';

import React, { useState } from 'react';
import { FileText, Eye } from 'lucide-react';

const ordersData = [
  {
    id: '#ORD101',
    professional: 'Rahul Das',
    items: 'Electrical Tape (5), Bulb 12W (10)',
    amount: '₹850.00',
    status: 'Pending',
    statusColor: 'bg-yellow-100 text-yellow-700',
    statusDot: 'bg-yellow-500',
    time: '10:30 AM',
  },
  {
    id: '#ORD102',
    professional: 'Priya Sen',
    items: 'PVC Pipe 20ft (2), Elbows (10)',
    amount: '₹1,200.00',
    status: 'Preparing',
    statusColor: 'bg-orange-100 text-orange-700',
    statusDot: 'bg-orange-500',
    time: '11:15 AM',
  },
  {
    id: '#ORD103',
    professional: 'Amit Kumar',
    items: 'Screwdriver Set (1), Hammer (1)',
    amount: '₹650.00',
    status: 'Ready',
    statusColor: 'bg-green-100 text-green-700',
    statusDot: 'bg-green-500',
    time: '11:45 AM',
  },
];

export default function OrdersOverview() {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-[#555555]" />
          <h3 className="text-lg font-semibold text-[#0C0C0C]">Recent Orders Table</h3>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-[#0C0C0C]">Order ID</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-[#0C0C0C]">Professional Name</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-[#0C0C0C]">Item(s) Ordered</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-[#0C0C0C]">Amount</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-[#0C0C0C]">Order Status</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-[#0C0C0C]">Placed Time</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-[#0C0C0C]">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {ordersData.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm font-medium text-[#0C0C0C]">{order.id}</td>
                <td className="px-6 py-4 text-sm text-[#555555]">{order.professional}</td>
                <td className="px-6 py-4 text-sm text-[#555555]">{order.items}</td>
                <td className="px-6 py-4 text-sm font-semibold text-[#0C0C0C]">{order.amount}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${order.statusColor}`}>
                    <span className={`w-2 h-2 rounded-full ${order.statusDot} mr-2`}></span>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-[#555555]">{order.time}</td>
                <td className="px-6 py-4">
                  <button className="text-[#00C897] hover:text-[#00a077] font-medium text-sm flex items-center space-x-1 transition">
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Order Details Button */}
      <div className="p-6 border-t border-gray-100 flex justify-center">
        <button className="bg-[#00C897] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#00a077] transition shadow-sm">
          View Order Details
        </button>
      </div>
    </div>
  );
}
