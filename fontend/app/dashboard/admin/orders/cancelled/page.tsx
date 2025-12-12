'use client';

import React from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { XCircle, AlertTriangle, DollarSign, FileText, Eye } from 'lucide-react';
import Link from 'next/link';

interface CancelledOrder {
  id: string;
  customer: { name: string };
  professional: { name: string; category: string };
  shop: { name: string };
  amount: number;
  cancelledTime: string;
  cancelReason: string;
  cancelSource: 'Shop' | 'Admin' | 'Customer' | 'Professional';
  refundStatus: 'Pending' | 'Processed' | 'N/A';
  refundAmount?: number;
  riskScore: number;
}

export default function CancelledOrdersPage() {
  const cancelledOrders: CancelledOrder[] = [
    {
      id: 'ORD001237',
      customer: { name: 'Anjali Gupta' },
      professional: { name: 'Mohan Lal', category: 'Painter' },
      shop: { name: 'Color Palace' },
      amount: 3600,
      cancelledTime: '2 hours ago',
      cancelReason: 'Payment failed - Customer did not retry',
      cancelSource: 'Customer',
      refundStatus: 'N/A',
      riskScore: 2,
    },
    {
      id: 'ORD001241',
      customer: { name: 'Rohan Kapoor' },
      professional: { name: 'Ajay Kumar', category: 'Electrician' },
      shop: { name: 'Power Plus' },
      amount: 2800,
      cancelledTime: '4 hours ago',
      cancelReason: 'Items out of stock - Shop unable to fulfill',
      cancelSource: 'Shop',
      refundStatus: 'Processed',
      refundAmount: 2800,
      riskScore: 5,
    },
  ];

  const getRiskColor = (score: number) => {
    if (score <= 3) return 'bg-green-100 text-green-700 border-green-200';
    if (score <= 6) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-red-100 text-red-700 border-red-200';
  };

  const getSourceColor = (source: string) => {
    const colors = {
      Shop: 'bg-purple-100 text-purple-700',
      Admin: 'bg-blue-100 text-blue-700',
      Customer: 'bg-orange-100 text-orange-700',
      Professional: 'bg-teal-100 text-teal-700',
    };
    return colors[source as keyof typeof colors];
  };

  const getRefundColor = (status: string) => {
    const colors = {
      Pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      Processed: 'bg-green-100 text-green-700 border-green-200',
      'N/A': 'bg-gray-100 text-gray-700 border-gray-200',
    };
    return colors[status as keyof typeof colors];
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F7FA]">
      <AdminSidebar />
      
      <div className="flex-1 ml-72 flex flex-col">
        <div className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <div>
            <h1 className="text-2xl font-bold text-[#0B0F19]">Cancelled Orders</h1>
            <p className="text-sm text-gray-500">Orders that were cancelled</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-1 gap-6">
            {cancelledOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl border-2 border-red-200 shadow-sm p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <Link href={`/dashboard/admin/orders/${order.id}`} className="text-xl font-bold text-[#1A73E8] hover:underline">
                      {order.id}
                    </Link>
                    <p className="text-sm text-gray-600 mt-1">Cancelled {order.cancelledTime}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRiskColor(order.riskScore)}`}>
                      Risk: {order.riskScore}/10
                    </span>
                    <span className="px-4 py-2 bg-red-100 text-red-700 rounded-xl font-semibold border border-red-200 flex items-center space-x-2">
                      <XCircle className="w-5 h-5" />
                      <span>Cancelled</span>
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

                {/* Cancel Reason */}
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-start space-x-3 mb-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-red-900">Cancel Reason</p>
                      <p className="text-sm text-red-700 mt-1">{order.cancelReason}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSourceColor(order.cancelSource)}`}>
                      By {order.cancelSource}
                    </span>
                  </div>
                </div>

                {/* Refund Information */}
                <div className="mb-6">
                  <p className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                    <DollarSign className="w-5 h-5" />
                    <span>Financial Information</span>
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <p className="text-xs text-gray-700 mb-1">Order Amount</p>
                      <p className="font-bold text-gray-900 text-lg">₹{order.amount.toLocaleString()}</p>
                    </div>
                    <div className={`p-3 rounded-xl border ${getRefundColor(order.refundStatus)}`}>
                      <p className="text-xs mb-1">Refund Status</p>
                      <p className="font-bold text-lg">{order.refundStatus}</p>
                    </div>
                    {order.refundAmount && (
                      <div className="p-3 bg-green-50 rounded-xl border border-green-200">
                        <p className="text-xs text-green-700 mb-1">Refunded Amount</p>
                        <p className="font-bold text-green-900 text-lg">₹{order.refundAmount.toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* History Log */}
                <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <FileText className="w-5 h-5 text-gray-600" />
                    <p className="font-semibold text-gray-900">Cancellation Timeline</p>
                  </div>
                  <div className="space-y-2 mt-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Order Placed</span>
                      <span className="text-gray-900 font-semibold">2024-12-12 10:30</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Cancelled by {order.cancelSource}</span>
                      <span className="text-gray-900 font-semibold">2024-12-12 12:45</span>
                    </div>
                    {order.refundStatus === 'Processed' && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Refund Processed</span>
                        <span className="text-gray-900 font-semibold">2024-12-12 13:00</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Link
                    href={`/dashboard/admin/orders/${order.id}`}
                    className="flex-1 px-4 py-3 bg-[#1A73E8] text-white rounded-xl hover:bg-[#1557b0] transition-colors font-semibold flex items-center justify-center space-x-2"
                  >
                    <Eye className="w-5 h-5" />
                    <span>View Full Details</span>
                  </Link>
                  {order.refundStatus === 'Pending' && (
                    <button className="flex-1 px-4 py-3 bg-[#00C853] text-white rounded-xl hover:bg-[#00a844] transition-colors font-semibold">
                      Process Refund
                    </button>
                  )}
                  {order.riskScore >= 7 && (
                    <button className="flex-1 px-4 py-3 bg-[#D32F2F] text-white rounded-xl hover:bg-[#b71c1c] transition-colors font-semibold">
                      Flag for Review
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
