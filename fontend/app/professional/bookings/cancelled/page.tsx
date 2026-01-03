'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { CancelledJobCard } from '../components';
import { ProfessionalNavbar } from '../../../professional/components';

export default function CancelledJobsPage() {
  const cancelledJobs = [
    {
      id: '1',
      customerName: 'Customer',
      service: 'Fan Repair',
      date: '15 Dec 2025',
      time: '4:30 PM',
      cancellationReason: 'customer' as const,
      reasonText: 'Customer cancelled because professional was far away.'
    },
    {
      id: '2',
      customerName: 'Subhajit De',
      customerPhoto: 'https://i.pravatar.cc/150?img=33',
      service: 'Switchboard Installation',
      date: '14 Dec 2025',
      time: '2:00 PM',
      cancellationReason: 'professional' as const,
      reasonText: 'Professional cancelled due to emergency.'
    },
    {
      id: '3',
      customerName: 'Priya Sharma',
      customerPhoto: 'https://i.pravatar.cc/150?img=5',
      service: 'Wiring Check',
      date: '12 Dec 2025',
      time: '10:00 AM',
      cancellationReason: 'auto' as const,
      reasonText: 'Auto-cancelled after 24 hours of no response from professional.'
    },
    {
      id: '4',
      customerName: 'Rajesh Kumar',
      customerPhoto: 'https://i.pravatar.cc/150?img=12',
      service: 'Light Fitting',
      date: '10 Dec 2025',
      time: '6:00 PM',
      cancellationReason: 'customer' as const,
      reasonText: 'Customer found another service provider.'
    }
  ];

  const groupedByReason = {
    customer: cancelledJobs.filter(j => j.cancellationReason === 'customer').length,
    professional: cancelledJobs.filter(j => j.cancellationReason === 'professional').length,
    auto: cancelledJobs.filter(j => j.cancellationReason === 'auto').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50">
      {/* Navbar */}
      <ProfessionalNavbar
        activeTab="bookings"
        notificationCount={0}
      />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Stats */}
        <div className="bg-white rounded-3xl p-6 shadow-lg mb-6">
          <h2 className="text-lg font-black text-gray-900 mb-4">Cancellation Summary</h2>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-orange-50 rounded-xl border-2 border-orange-200">
              <p className="text-3xl font-black text-orange-700">{groupedByReason.customer}</p>
              <p className="text-sm text-gray-600 font-semibold mt-1">By Customer</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-xl border-2 border-red-200">
              <p className="text-3xl font-black text-red-700">{groupedByReason.professional}</p>
              <p className="text-sm text-gray-600 font-semibold mt-1">By You</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
              <p className="text-3xl font-black text-gray-700">{groupedByReason.auto}</p>
              <p className="text-sm text-gray-600 font-semibold mt-1">Auto-Cancel</p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
            <p className="text-sm text-blue-700 font-semibold">
              💡 Tip: Respond quickly to booking requests to reduce auto-cancellations and maintain your rating.
            </p>
          </div>
        </div>

        {/* Cancelled Job Cards */}
        <div className="space-y-6">
          {cancelledJobs.map((job) => (
            <CancelledJobCard key={job.id} job={job} />
          ))}

          {cancelledJobs.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl shadow-lg">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Cancelled Jobs</h3>
              <p className="text-gray-600">Great! You don't have any cancelled bookings.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
