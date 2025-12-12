'use client';

import React from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { Clock, CheckCircle2, Package, MapPin, Phone, Eye, Edit } from 'lucide-react';
import Link from 'next/link';

interface AcceptedOrder {
  id: string;
  customer: { name: string; phone: string };
  professional: { name: string; category: string };
  shop: { name: string; location: string };
  items: string[];
  amount: number;
  acceptedTime: string;
  eta: string;
  etaMinutes: number;
}

export default function AcceptedOrdersPage() {
  const acceptedOrders: AcceptedOrder[] = [
    {
      id: 'ORD001235',
      customer: { name: 'Priya Sharma', phone: '+91 98234 56789' },
      professional: { name: 'Ravi Verma', category: 'Plumber' },
      shop: { name: 'Hardware Hub', location: 'Lajpat Nagar' },
      items: ['Pipe 20ft', 'Tap x2', 'Sealant'],
      amount: 1850,
      acceptedTime: '28 mins ago',
      eta: '15 mins',
      etaMinutes: 15,
    },
    {
      id: 'ORD001238',
      customer: { name: 'Karan Mehta', phone: '+91 95432 10987' },
      professional: { name: 'Sunil Kumar', category: 'Electrician' },
      shop: { name: 'Power Plus', location: 'Karol Bagh' },
      items: ['LED Strip 5m', 'Adapter 12V', 'Connectors'],
      amount: 2100,
      acceptedTime: '18 mins ago',
      eta: '25 mins',
      etaMinutes: 25,
    },
  ];

  const getEtaColor = (minutes: number) => {
    if (minutes <= 15) return 'bg-green-100 text-green-700 border-green-200';
    if (minutes <= 30) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-red-100 text-red-700 border-red-200';
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F7FA]">
      <AdminSidebar />
      
      <div className="flex-1 ml-72 flex flex-col">
        {/* Top Navigation */}
        <div className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <div>
            <h1 className="text-2xl font-bold text-[#0B0F19]">Accepted Orders</h1>
            <p className="text-sm text-gray-500">Orders confirmed by shops</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-1 gap-6">
            {acceptedOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl border border-green-200 shadow-sm p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <Link href={`/dashboard/admin/orders/${order.id}`} className="text-xl font-bold text-[#1A73E8] hover:underline">
                      {order.id}
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">Accepted {order.acceptedTime}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className={`px-4 py-2 rounded-xl border-2 font-bold ${getEtaColor(order.etaMinutes)}`}>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-5 h-5" />
                        <span>ETA: {order.eta}</span>
                      </div>
                    </div>
                    <span className="px-4 py-2 bg-green-100 text-green-700 rounded-xl font-semibold border border-green-200">
                      Accepted
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6 mb-6">
                  <div>
                    <p className="text-xs text-gray-500 mb-2">CUSTOMER</p>
                    <p className="font-bold text-[#0B0F19]">{order.customer.name}</p>
                    <div className="flex items-center space-x-1 text-sm text-gray-600 mt-1">
                      <Phone className="w-3 h-3" />
                      <span>{order.customer.phone}</span>
                    </div>
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
                    <div className="flex items-center space-x-1 text-sm text-gray-600 mt-1">
                      <MapPin className="w-3 h-3" />
                      <span>{order.shop.location}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <Package className="w-5 h-5 text-gray-600" />
                    <p className="font-semibold text-gray-900">Items:</p>
                  </div>
                  <p className="text-sm text-gray-700">{order.items.join(', ')}</p>
                  <p className="font-bold text-[#00C853] text-lg mt-2">₹{order.amount.toLocaleString()}</p>
                </div>

                <div className="flex items-center space-x-3">
                  <Link
                    href={`/dashboard/admin/orders/${order.id}`}
                    className="flex-1 px-4 py-3 bg-[#1A73E8] text-white rounded-xl hover:bg-[#1557b0] transition-colors font-semibold flex items-center justify-center space-x-2"
                  >
                    <Eye className="w-5 h-5" />
                    <span>View Details</span>
                  </Link>
                  <button className="flex-1 px-4 py-3 bg-[#FFAB00] text-white rounded-xl hover:bg-[#f59e00] transition-colors font-semibold">
                    Mark as Processing
                  </button>
                  <button className="flex-1 px-4 py-3 bg-[#6C63FF] text-white rounded-xl hover:bg-[#5b52e6] transition-colors font-semibold">
                    Mark as Packed
                  </button>
                  <button className="flex-1 px-4 py-3 bg-[#00C853] text-white rounded-xl hover:bg-[#00a844] transition-colors font-semibold">
                    Mark as Ready
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
