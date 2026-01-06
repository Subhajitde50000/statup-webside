'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { CancelledJobCard } from '../components';
import { ProfessionalNavbar } from '../../../professional/components';
import { getProfessionalBookings, Booking } from '@/utils/bookings';

interface CancelledJob {
  id: string;
  customerName: string;
  customerPhoto?: string;
  service: string;
  date: string;
  time: string;
  cancellationReason: 'customer' | 'professional' | 'auto';
  reasonText: string;
}

export default function CancelledJobsPage() {
  const [cancelledJobs, setCancelledJobs] = useState<CancelledJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCancelledJobs = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getProfessionalBookings({ status: 'cancelled' });
      
      const transformedJobs: CancelledJob[] = response.bookings.map((booking: Booking) => ({
        id: booking.id,
        customerName: booking.user?.name || 'Customer',
        customerPhoto: booking.user?.name ? `https://ui-avatars.com/api/?name=${encodeURIComponent(booking.user.name)}&size=80&background=1E2A5E&color=fff` : undefined,
        service: booking.service_name || booking.service_type,
        date: booking.date,
        time: booking.time,
        cancellationReason: (booking.cancelled_by === 'user' ? 'customer' : booking.cancelled_by === 'professional' ? 'professional' : 'auto') as 'customer' | 'professional' | 'auto',
        reasonText: booking.cancellation_reason || 'No reason provided'
      }));
      
      setCancelledJobs(transformedJobs);
    } catch (err) {
      console.error('Error fetching cancelled jobs:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch cancelled jobs');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCancelledJobs();
  }, [fetchCancelledJobs]);

  const groupedByReason = {
    customer: cancelledJobs.filter(j => j.cancellationReason === 'customer').length,
    professional: cancelledJobs.filter(j => j.cancellationReason === 'professional').length,
    auto: cancelledJobs.filter(j => j.cancellationReason === 'auto').length
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50">
        <ProfessionalNavbar activeTab="bookings" notificationCount={0} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-red-600 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Loading cancelled jobs...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50">
      {/* Navbar */}
      <ProfessionalNavbar
        activeTab="bookings"
        notificationCount={0}
      />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href="/professional/bookings"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-bold mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </Link>

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

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-6 text-center">
            <p className="text-red-600 font-semibold">{error}</p>
            <button
              onClick={fetchCancelledJobs}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Cancelled Job Cards */}
        <div className="space-y-6">
          {cancelledJobs.map((job) => (
            <CancelledJobCard key={job.id} job={job} />
          ))}

          {cancelledJobs.length === 0 && !error && (
            <div className="text-center py-16 bg-white rounded-3xl shadow-lg">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Cancelled Jobs</h3>
              <p className="text-gray-600">Great! You don&apos;t have any cancelled bookings.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
