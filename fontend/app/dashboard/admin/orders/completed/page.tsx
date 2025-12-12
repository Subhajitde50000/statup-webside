'use client';

import React from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { CheckCircle2, Star, Download, DollarSign, Clock, Eye, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

interface CompletedOrder {
  id: string;
  customer: { name: string };
  professional: { name: string; category: string };
  shop: { name: string };
  amount: number;
  completedTime: string;
  completedDate: string;
  rating?: number;
  earnings: { shop: number; platform: number; professional: number };
  hasComplaint: boolean;
}

export default function CompletedOrdersPage() {
  const completedOrders: CompletedOrder[] = [
    {
      id: 'ORD001236',
      customer: { name: 'Vikram Malhotra' },
      professional: { name: 'Suresh Yadav', category: 'Carpenter' },
      shop: { name: 'Wood Works' },
      amount: 4200,
      completedTime: '1 hour ago',
      completedDate: '2024-12-12 13:30',
      rating: 4.5,
      earnings: { shop: 3780, platform: 420, professional: 0 },
      hasComplaint: false,
    },
    {
      id: 'ORD001239',
      customer: { name: 'Sanjay Gupta' },
      professional: { name: 'Ramesh Kumar', category: 'Plumber' },
      shop: { name: 'Hardware Hub' },
      amount: 3150,
      completedTime: '3 hours ago',
      completedDate: '2024-12-12 11:45',
      rating: 5,
      earnings: { shop: 2835, platform: 315, professional: 0 },
      hasComplaint: true,
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F7FA]">
      <AdminSidebar />
      
      <div className="flex-1 ml-72 flex flex-col">
        <div className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <div>
            <h1 className="text-2xl font-bold text-[#0B0F19]">Completed Orders</h1>
            <p className="text-sm text-gray-500">Successfully finished orders</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-1 gap-6">
            {completedOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl border border-green-200 shadow-sm p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <Link href={`/dashboard/admin/orders/${order.id}`} className="text-xl font-bold text-[#1A73E8] hover:underline">
                      {order.id}
                    </Link>
                    <div className="flex items-center space-x-2 mt-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Completed {order.completedTime}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{order.completedDate}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    {order.hasComplaint && (
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold border border-red-200 flex items-center space-x-1">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Complaint Filed</span>
                      </span>
                    )}
                    <span className="px-4 py-2 bg-green-100 text-green-700 rounded-xl font-semibold border border-green-200 flex items-center space-x-2">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Completed</span>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6 mb-6">
                  <div>
                    <p className="text-xs text-gray-500 mb-2">CUSTOMER</p>
                    <p className="font-bold text-[#0B0F19]">{order.customer.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-2">PROFESSIONAL</p>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                      {order.professional.category}
                    </span>
                    <p className="font-bold text-[#0B0F19] mt-1">{order.professional.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-2">SHOP</p>
                    <p className="font-bold text-[#0B0F19]">{order.shop.name}</p>
                  </div>
                </div>

                {/* Customer Rating */}
                {order.rating && (
                  <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                        <span className="font-semibold text-yellow-900">Customer Rating</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-2xl font-bold text-yellow-900">{order.rating}</span>
                        <span className="text-sm text-yellow-700">/ 5.0</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Earnings Summary */}
                <div className="mb-6">
                  <p className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                    <DollarSign className="w-5 h-5" />
                    <span>Earnings Breakdown</span>
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                      <p className="text-xs text-blue-700 mb-1">Shop Earnings</p>
                      <p className="font-bold text-blue-900 text-lg">₹{order.earnings.shop.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
                      <p className="text-xs text-purple-700 mb-1">Platform Fee</p>
                      <p className="font-bold text-purple-900 text-lg">₹{order.earnings.platform.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-xl border border-green-200">
                      <p className="text-xs text-green-700 mb-1">Total Amount</p>
                      <p className="font-bold text-green-900 text-lg">₹{order.amount.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Link
                    href={`/dashboard/admin/orders/${order.id}`}
                    className="flex-1 px-4 py-3 bg-[#1A73E8] text-white rounded-xl hover:bg-[#1557b0] transition-colors font-semibold flex items-center justify-center space-x-2"
                  >
                    <Eye className="w-5 h-5" />
                    <span>View Details</span>
                  </Link>
                  <button className="flex-1 px-4 py-3 bg-[#00C853] text-white rounded-xl hover:bg-[#00a844] transition-colors font-semibold flex items-center justify-center space-x-2">
                    <Download className="w-5 h-5" />
                    <span>Download Invoice</span>
                  </button>
                  {order.hasComplaint && (
                    <button className="flex-1 px-4 py-3 bg-[#D32F2F] text-white rounded-xl hover:bg-[#b71c1c] transition-colors font-semibold">
                      View Complaint
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
