'use client';

import React, { useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { MapPin, Navigation, Clock, Phone, Package, User } from 'lucide-react';

export default function OrderTrackingPage() {
  const [selectedOrder, setSelectedOrder] = useState('ORD001234');

  const trackingData = {
    orderId: 'ORD001234',
    status: 'Ready for Pickup',
    professional: {
      name: 'Amit Singh',
      category: 'Electrician',
      phone: '+91 98234 56789',
      location: { lat: 28.6289, lng: 77.2065, address: 'Near Metro Station, CP' },
      isMoving: true,
    },
    shop: {
      name: 'Super Electronics',
      location: { lat: 28.6304, lng: 77.2177, address: 'Shop 12, Connaught Place' },
      phone: '+91 97654 32109',
    },
    eta: '8 mins',
    distance: '1.2 km',
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F7FA]">
      <AdminSidebar />
      
      <div className="flex-1 ml-72 flex flex-col">
        <div className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <div>
            <h1 className="text-2xl font-bold text-[#0B0F19]">Live Order Tracking</h1>
            <p className="text-sm text-gray-500">Real-time location monitoring</p>
          </div>
          <select
            className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A73E8] bg-white font-semibold"
            value={selectedOrder}
            onChange={(e) => setSelectedOrder(e.target.value)}
          >
            <option value="ORD001234">ORD001234</option>
            <option value="ORD001235">ORD001235</option>
            <option value="ORD001236">ORD001236</option>
          </select>
        </div>

        <div className="flex-1 flex">
          {/* Map Section */}
          <div className="flex-1 relative">
            <div className="absolute inset-0 bg-gray-200">
              {/* Google Maps Embed */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.2!2d77.2177!3d28.6304!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
              />
            </div>

            {/* ETA Overlay */}
            <div className="absolute top-6 left-6 right-6">
              <div className="bg-white rounded-2xl p-6 shadow-2xl border-2 border-[#1A73E8]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                      <Navigation className="w-8 h-8 text-white animate-pulse" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Estimated Arrival</p>
                      <p className="text-3xl font-bold text-[#00C853]">{trackingData.eta}</p>
                      <p className="text-sm text-gray-500">{trackingData.distance} away</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-xl font-semibold border border-yellow-200">
                      {trackingData.status}
                    </span>
                    <p className="text-sm text-gray-500 mt-2">Order {trackingData.orderId}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="absolute bottom-6 left-6">
              <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200">
                <p className="font-semibold text-gray-900 mb-3">Map Legend</p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Professional Location</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Shop Location</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-1 bg-blue-500"></div>
                    <span className="text-sm text-gray-700">Route</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Info Panel */}
          <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold text-[#0B0F19] mb-6">Tracking Details</h3>

              {/* Professional Info */}
              <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center space-x-2 mb-3">
                  <User className="w-5 h-5 text-green-700" />
                  <p className="font-semibold text-green-900">Professional</p>
                </div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                    AS
                  </div>
                  <div>
                    <p className="font-bold text-green-900">{trackingData.professional.name}</p>
                    <span className="px-2 py-0.5 bg-green-200 text-green-800 rounded-full text-xs font-semibold">
                      {trackingData.professional.category}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-green-700">
                    <Phone className="w-4 h-4" />
                    <a href={`tel:${trackingData.professional.phone}`} className="hover:underline">
                      {trackingData.professional.phone}
                    </a>
                  </div>
                  <div className="flex items-start space-x-2 text-sm text-green-700">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{trackingData.professional.location.address}</span>
                  </div>
                </div>
                {trackingData.professional.isMoving && (
                  <div className="mt-3 flex items-center space-x-2 text-sm text-green-800">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="font-semibold">Moving towards shop</span>
                  </div>
                )}
              </div>

              {/* Shop Info */}
              <div className="mb-6 p-4 bg-purple-50 rounded-xl border border-purple-200">
                <div className="flex items-center space-x-2 mb-3">
                  <Package className="w-5 h-5 text-purple-700" />
                  <p className="font-semibold text-purple-900">Shop Location</p>
                </div>
                <p className="font-bold text-purple-900 mb-2">{trackingData.shop.name}</p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-purple-700">
                    <Phone className="w-4 h-4" />
                    <a href={`tel:${trackingData.shop.phone}`} className="hover:underline">
                      {trackingData.shop.phone}
                    </a>
                  </div>
                  <div className="flex items-start space-x-2 text-sm text-purple-700">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{trackingData.shop.location.address}</span>
                  </div>
                </div>
                <button className="mt-3 w-full px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-semibold flex items-center justify-center space-x-2">
                  <Navigation className="w-4 h-4" />
                  <span>Get Directions</span>
                </button>
              </div>

              {/* Journey Timeline */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center space-x-2 mb-4">
                  <Clock className="w-5 h-5 text-gray-700" />
                  <p className="font-semibold text-gray-900">Journey Timeline</p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Current Location</p>
                      <p className="text-sm text-gray-600">{trackingData.professional.location.address}</p>
                      <p className="text-xs text-gray-500 mt-1">Last updated: Just now</p>
                    </div>
                  </div>
                  <div className="ml-4 h-8 w-0.5 bg-gray-300"></div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Destination</p>
                      <p className="text-sm text-gray-600">{trackingData.shop.location.address}</p>
                      <p className="text-xs text-green-600 mt-1 font-semibold">ETA: {trackingData.eta}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
