'use client';

import React from 'react';
import { Package, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function EmptyOrderState() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* Icon with Question Mark */}
      <div className="relative w-48 h-48 mb-6">
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Empty Box Illustration */}
          <div className="w-32 h-32 border-4 border-dashed border-gray-300 rounded-2xl flex items-center justify-center bg-gray-50">
            <Package className="w-16 h-16 text-gray-300" />
          </div>
          {/* Question Mark Badge */}
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-4xl text-white font-bold">?</span>
          </div>
        </div>
      </div>

      {/* Text Content */}
      <h3 className="text-2xl font-bold text-gray-900 mb-2">No bookings yet!</h3>
      <p className="text-gray-600 mb-8 text-center max-w-sm">
        Once you book a service, your orders will appear here.
      </p>

      {/* CTA Button */}
      <button
        onClick={() => router.push('/service')}
        className="bg-[#00C28C] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#00A876] transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        Book Your First Service
      </button>

      {/* Popular Services Section */}
      <div className="mt-16 w-full max-w-4xl">
        <h4 className="text-lg font-bold text-gray-900 mb-6 text-center">
          Popular Services Near You
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: '🧹', name: 'Deep Cleaning', color: 'from-purple-50 to-pink-50' },
            { icon: '❄️', name: 'AC Repair', color: 'from-blue-50 to-cyan-50' },
            { icon: '🛵', name: 'Driver on Demand', color: 'from-green-50 to-teal-50' }
          ].map((service) => (
            <button
              key={service.name}
              onClick={() => router.push(`/service?category=${service.name.toLowerCase()}`)}
              className={`bg-gradient-to-br ${service.color} rounded-xl p-6 text-center hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-blue-200 transform hover:scale-105`}
            >
              <div className="text-5xl mb-3">{service.icon}</div>
              <p className="text-sm font-bold text-gray-900">{service.name}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
