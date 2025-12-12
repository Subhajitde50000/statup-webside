'use client';

import React from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { Package, AlertTriangle, CheckCircle2, Clock, Eye } from 'lucide-react';
import Link from 'next/link';

interface ProcessingOrder {
  id: string;
  shop: { name: string; location: string };
  items: { name: string; status: 'picked' | 'pending' | 'out-of-stock'; }[];
  amount: number;
  packingProgress: number;
}

export default function ProcessingOrdersPage() {
  const processingOrders: ProcessingOrder[] = [
    {
      id: 'ORD001234',
      shop: { name: 'Super Electronics', location: 'Connaught Place' },
      items: [
        { name: 'Wire 10m', status: 'picked' },
        { name: 'Switch Board', status: 'picked' },
        { name: 'LED Bulb x5', status: 'pending' },
      ],
      amount: 2450,
      packingProgress: 66,
    },
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      picked: 'bg-green-100 text-green-700 border-green-200',
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'out-of-stock': 'bg-red-100 text-red-700 border-red-200',
    };
    return colors[status as keyof typeof colors];
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F7FA]">
      <AdminSidebar />
      
      <div className="flex-1 ml-72 flex flex-col">
        <div className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <div>
            <h1 className="text-2xl font-bold text-[#0B0F19]">Processing Orders</h1>
            <p className="text-sm text-gray-500">Shops preparing items</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-1 gap-6">
            {processingOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl border border-amber-200 shadow-sm p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <Link href={`/dashboard/admin/orders/${order.id}`} className="text-xl font-bold text-[#1A73E8] hover:underline">
                      {order.id}
                    </Link>
                    <p className="text-sm text-gray-600 mt-1">{order.shop.name} • {order.shop.location}</p>
                  </div>
                  <span className="px-4 py-2 bg-amber-100 text-amber-700 rounded-xl font-semibold border border-amber-200">
                    Processing
                  </span>
                </div>

                {/* Packing Progress */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">Packing Progress</span>
                    <span className="text-sm font-bold text-amber-700">{order.packingProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-amber-400 to-amber-600 h-3 rounded-full transition-all"
                      style={{ width: `${order.packingProgress}%` }}
                    />
                  </div>
                </div>

                {/* Product Picking Status */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                    <Package className="w-5 h-5" />
                    <span>Product Picking Status</span>
                  </h4>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="flex items-center space-x-3">
                          {item.status === 'picked' && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                          {item.status === 'pending' && <Clock className="w-5 h-5 text-yellow-600" />}
                          {item.status === 'out-of-stock' && <AlertTriangle className="w-5 h-5 text-red-600" />}
                          <span className="font-semibold text-gray-900">{item.name}</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(item.status)}`}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1).replace('-', ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stock Issue Alerts */}
                {order.items.some(item => item.status === 'out-of-stock') && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                        <p className="font-semibold text-red-900">Stock Issue Detected</p>
                        <p className="text-sm text-red-700 mt-1">Some items are out of stock. Contact shop immediately.</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <Link
                    href={`/dashboard/admin/orders/${order.id}`}
                    className="flex-1 px-4 py-3 bg-[#1A73E8] text-white rounded-xl hover:bg-[#1557b0] transition-colors font-semibold flex items-center justify-center space-x-2"
                  >
                    <Eye className="w-5 h-5" />
                    <span>View Details</span>
                  </Link>
                  <button className="flex-1 px-4 py-3 bg-[#00C853] text-white rounded-xl hover:bg-[#00a844] transition-colors font-semibold">
                    Mark as Ready for Pickup
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
