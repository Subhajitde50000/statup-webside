'use client';

import React from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { MapPin, Key, Navigation, Phone, Eye, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

interface ReadyOrder {
  id: string;
  professional: { name: string; phone: string; category: string };
  shop: { name: string; location: string; phone: string; lat: number; lng: number };
  otp: string;
  pickupInstructions: string;
  amount: number;
}

export default function ReadyForPickupPage() {
  const readyOrders: ReadyOrder[] = [
    {
      id: 'ORD001240',
      professional: { name: 'Amit Singh', phone: '+91 98234 56789', category: 'Electrician' },
      shop: { 
        name: 'Super Electronics', 
        location: 'Shop 12, Connaught Place, New Delhi', 
        phone: '+91 97654 32109',
        lat: 28.6304,
        lng: 77.2177,
      },
      otp: '8745',
      pickupInstructions: 'Items are packed and kept at the counter. Show OTP to shop owner for verification.',
      amount: 2450,
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F7FA]">
      <AdminSidebar />
      
      <div className="flex-1 ml-72 flex flex-col">
        <div className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <div>
            <h1 className="text-2xl font-bold text-[#0B0F19]">Ready for Pickup</h1>
            <p className="text-sm text-gray-500">Orders awaiting professional pickup</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-1 gap-6">
            {readyOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl border border-yellow-200 shadow-sm p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <Link href={`/dashboard/admin/orders/${order.id}`} className="text-xl font-bold text-[#1A73E8] hover:underline">
                      {order.id}
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">Awaiting pickup</p>
                  </div>
                  <span className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-xl font-semibold border border-yellow-200">
                    Ready for Pickup
                  </span>
                </div>

                {/* Pickup OTP */}
                <div className="mb-6 p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-400 rounded-2xl">
                  <div className="flex items-center space-x-3 mb-2">
                    <Key className="w-6 h-6 text-yellow-700" />
                    <p className="text-sm font-semibold text-yellow-800">PICKUP OTP</p>
                  </div>
                  <p className="text-5xl font-bold text-yellow-900 tracking-wider">{order.otp}</p>
                  <p className="text-xs text-yellow-700 mt-2">Professional must show this OTP to collect items</p>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                  {/* Professional Info */}
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <p className="text-xs text-blue-700 font-semibold mb-3">PROFESSIONAL</p>
                    <span className="px-2 py-1 bg-blue-200 text-blue-800 rounded-full text-xs font-semibold">
                      {order.professional.category}
                    </span>
                    <p className="font-bold text-blue-900 mt-2">{order.professional.name}</p>
                    <div className="flex items-center space-x-1 text-xs text-blue-700 mt-2">
                      <Phone className="w-3 h-3" />
                      <a href={`tel:${order.professional.phone}`} className="hover:underline">
                        {order.professional.phone}
                      </a>
                    </div>
                    <button className="mt-3 w-full px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-semibold flex items-center justify-center space-x-1">
                      <Navigation className="w-4 h-4" />
                      <span>Track Live Location</span>
                    </button>
                  </div>

                  {/* Shop Info */}
                  <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                    <p className="text-xs text-purple-700 font-semibold mb-3">SHOP LOCATION</p>
                    <p className="font-bold text-purple-900 mb-2">{order.shop.name}</p>
                    <div className="flex items-start space-x-1 text-xs text-purple-700 mb-3">
                      <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span>{order.shop.location}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-purple-700 mb-3">
                      <Phone className="w-3 h-3" />
                      <a href={`tel:${order.shop.phone}`} className="hover:underline">
                        {order.shop.phone}
                      </a>
                    </div>
                    <button className="w-full px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-semibold flex items-center justify-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>Open in Maps</span>
                    </button>
                  </div>
                </div>

                {/* Shop Location Map */}
                <div className="mb-6 bg-gray-100 rounded-2xl overflow-hidden h-64 border border-gray-200">
                  <iframe
                    src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.2!2d${order.shop.lng}!3d${order.shop.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!5e0!3m2!1sen!2sin!4v1234567890`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                  />
                </div>

                {/* Pickup Instructions */}
                <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="font-semibold text-gray-900 mb-2">Pickup Instructions</p>
                  <p className="text-sm text-gray-700">{order.pickupInstructions}</p>
                </div>

                <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200 mb-6">
                  <p className="font-semibold text-green-900">Order Amount</p>
                  <p className="text-2xl font-bold text-green-700">₹{order.amount.toLocaleString()}</p>
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
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Mark as Completed</span>
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
