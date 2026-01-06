'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Play, MapPin, Clock, Phone, MessageCircle, Navigation, Calendar, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProfessionalNavbar from '../../components/ProfessionalNavbar';
import { getProfessionalBookings, Booking } from '@/utils/bookings';
import { useBookingSocket } from '@/utils/BookingSocketContext';

interface AcceptedBooking {
  id: string;
  customerName: string;
  customerPhoto: string;
  customerRating: number;
  customerPhone: string;
  service: string;
  time: string;
  date: string;
  duration: string;
  distance: number;
  address: string;
  note?: string;
  isUrgent?: boolean;
  category: 'today' | 'upcoming';
}

export default function AcceptedBookingsPage() {
  const router = useRouter();
  const { isConnected } = useBookingSocket();
  const [activeTab, setActiveTab] = useState<'today' | 'upcoming' | 'all'>('today');
  const [bookings, setBookings] = useState<AcceptedBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch accepted bookings
  const fetchAcceptedBookings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getProfessionalBookings({ status: 'accepted' });
      
      // Determine if booking is today or upcoming
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const transformedBookings: AcceptedBooking[] = response.bookings.map((booking: Booking) => {
        const bookingDate = new Date(booking.date);
        bookingDate.setHours(0, 0, 0, 0);
        const isToday = bookingDate.getTime() === today.getTime();
        
        return {
          id: booking.id,
          customerName: booking.user?.name || 'Customer',
          customerPhoto: `https://ui-avatars.com/api/?name=${encodeURIComponent(booking.user?.name || 'Customer')}&size=80&background=1E2A5E&color=fff`,
          customerRating: 4.5,
          customerPhone: booking.user?.phone || 'N/A',
          service: booking.service_name || booking.service_type,
          time: booking.time,
          date: booking.date,
          duration: '30-60 minutes',
          distance: 0,
          address: booking.address_display,
          note: booking.notes || undefined,
          isUrgent: false,
          category: isToday ? 'today' : 'upcoming'
        };
      });
      
      setBookings(transformedBookings);
    } catch (err) {
      console.error('Error fetching accepted bookings:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch bookings');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAcceptedBookings();
  }, [fetchAcceptedBookings]);

  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'today') return booking.category === 'today';
    if (activeTab === 'upcoming') return booking.category === 'upcoming';
    return true; // 'all'
  });

  const todayCount = bookings.filter(b => b.category === 'today').length;
  const upcomingCount = bookings.filter(b => b.category === 'upcoming').length;

  const handleStartJob = (id: string) => {
    router.push(`/professional/bookings/ongoing`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50">
        <ProfessionalNavbar activeTab="bookings" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Loading bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50">
      <ProfessionalNavbar activeTab="bookings" />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Connection Status */}
        <div className={`mb-4 px-4 py-2 rounded-lg flex items-center gap-2 ${isConnected ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          <span className="text-sm font-medium">
            {isConnected ? 'Live Updates Active' : 'Reconnecting...'}
          </span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <Link
            href="/professional/bookings"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-bold mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-black text-gray-900 mb-2">Accepted Bookings</h1>
          <p className="text-gray-600 font-medium">{bookings.length} job{bookings.length !== 1 ? 's' : ''} scheduled</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl p-2 shadow-lg border-2 border-gray-100 mb-8 flex gap-2">
          <button
            onClick={() => setActiveTab('today')}
            className={`flex-1 py-4 px-6 rounded-xl font-black transition-all ${
              activeTab === 'today'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Calendar className="w-5 h-5" />
              Today
              {todayCount > 0 && (
                <span className={`text-xs font-black px-2 py-1 rounded-full ${
                  activeTab === 'today' ? 'bg-white text-blue-600' : 'bg-blue-100 text-blue-600'
                }`}>
                  {todayCount}
                </span>
              )}
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`flex-1 py-4 px-6 rounded-xl font-black transition-all ${
              activeTab === 'upcoming'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              Upcoming
              {upcomingCount > 0 && (
                <span className={`text-xs font-black px-2 py-1 rounded-full ${
                  activeTab === 'upcoming' ? 'bg-white text-blue-600' : 'bg-blue-100 text-blue-600'
                }`}>
                  {upcomingCount}
                </span>
              )}
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-4 px-6 rounded-xl font-black transition-all ${
              activeTab === 'all'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              All
              <span className={`text-xs font-black px-2 py-1 rounded-full ${
                activeTab === 'all' ? 'bg-white text-blue-600' : 'bg-blue-100 text-blue-600'
              }`}>
                {bookings.length}
              </span>
            </div>
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-6 text-center">
            <p className="text-red-600 font-semibold">{error}</p>
            <button
              onClick={fetchAcceptedBookings}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Booking Cards */}
        <div className="space-y-6">
          {filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden hover:shadow-2xl transition-all"
            >
              <div className="p-6">
                {/* Customer Info */}
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-start gap-4">
                    <img
                      src={booking.customerPhoto}
                      alt={booking.customerName}
                      className="w-16 h-16 rounded-full border-3 border-blue-200 shadow-md"
                    />
                    <div>
                      <h3 className="text-2xl font-black text-gray-900 mb-1">{booking.customerName}</h3>
                      <p className="text-sm text-gray-600 font-semibold mb-2">{booking.service}</p>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-yellow-600 font-bold">⭐ {booking.customerRating}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-600 font-semibold">{booking.customerPhone}</span>
                      </div>
                    </div>
                  </div>
                  {booking.isUrgent && (
                    <span className="bg-red-500 text-white text-xs font-black px-3 py-1 rounded-full animate-pulse">
                      URGENT
                    </span>
                  )}
                </div>

                {/* Service Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-5">
                  <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                    <Clock className="w-5 h-5 text-blue-600 mb-2" />
                    <p className="text-xs text-gray-600 font-semibold mb-1">Date & Time</p>
                    <p className="font-black text-gray-900">{booking.date}</p>
                    <p className="font-bold text-gray-700 text-sm">{booking.time}</p>
                  </div>
                  
                  <div className="bg-purple-50 rounded-xl p-4 border-2 border-purple-200">
                    <Clock className="w-5 h-5 text-purple-600 mb-2" />
                    <p className="text-xs text-gray-600 font-semibold mb-1">Duration</p>
                    <p className="font-black text-gray-900">{booking.duration}</p>
                  </div>
                  
                  <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
                    <MapPin className="w-5 h-5 text-green-600 mb-2" />
                    <p className="text-xs text-gray-600 font-semibold mb-1">Location</p>
                    <p className="font-black text-gray-900 text-sm truncate">{booking.address}</p>
                  </div>
                </div>

                {booking.note && (
                  <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4 mb-5">
                    <p className="text-sm font-bold text-yellow-900">📝 Customer Note:</p>
                    <p className="text-sm text-yellow-800 font-semibold mt-1">{booking.note}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="grid grid-cols-3 gap-3">
                  <a 
                    href={`tel:${booking.customerPhone}`}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-green-50 text-green-700 font-bold rounded-xl hover:bg-green-100 transition-all border-2 border-green-200"
                  >
                    <Phone className="w-5 h-5" />
                    <span className="hidden md:inline">Call</span>
                  </a>
                  
                  <button className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 text-blue-700 font-bold rounded-xl hover:bg-blue-100 transition-all border-2 border-blue-200">
                    <MessageCircle className="w-5 h-5" />
                    <span className="hidden md:inline">Message</span>
                  </button>
                  
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(booking.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-50 text-purple-700 font-bold rounded-xl hover:bg-purple-100 transition-all border-2 border-purple-200"
                  >
                    <Navigation className="w-5 h-5" />
                    <span className="hidden md:inline">Navigate</span>
                  </a>
                </div>
              </div>

              {/* Start Job Button */}
              <button
                onClick={() => handleStartJob(booking.id)}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-black py-5 flex items-center justify-center gap-3 hover:shadow-xl transition-all"
              >
                <Play className="w-6 h-6" />
                START JOB
              </button>
            </div>
          ))}

          {filteredBookings.length === 0 && !error && (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg border-2 border-gray-100">
              <Calendar className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-black text-gray-900 mb-2">
                No {activeTab === 'today' ? "Today's" : activeTab === 'upcoming' ? 'Upcoming' : ''} Bookings
              </h3>
              <p className="text-gray-600 font-semibold mb-6">
                {activeTab === 'today' 
                  ? "You don't have any bookings scheduled for today." 
                  : "You don't have any upcoming bookings."}
              </p>
              <Link
                href="/professional/bookings/requests"
                className="inline-block bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold py-3 px-8 rounded-xl hover:shadow-lg transition-all"
              >
                View New Requests
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
