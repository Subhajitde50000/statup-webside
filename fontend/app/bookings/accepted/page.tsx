'use client';

import React, { useState } from 'react';
import { ArrowLeft, Bell } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AcceptedBookingCard } from '../components';
import { ProfessionalNavbar } from '../../professional/components';

export default function AcceptedBookingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'today' | 'upcoming' | 'all'>('today');

  const bookings = [
    {
      id: '1',
      customerName: 'Subhajit De',
      customerPhoto: 'https://i.pravatar.cc/150?img=33',
      customerRating: 4.8,
      customerPhone: '+91 98765 43210',
      service: 'Switchboard Repair',
      time: 'Today, 2:00 PM',
      duration: '40–50 minutes',
      distance: 1.1,
      note: 'Please come soon, urgent',
      isUrgent: true,
      category: 'today'
    },
    {
      id: '2',
      customerName: 'Priya Sharma',
      customerPhoto: 'https://i.pravatar.cc/150?img=5',
      customerRating: 4.6,
      customerPhone: '+91 98765 43211',
      service: 'Fan Repair',
      time: 'Today, 4:30 PM',
      duration: '45–60 minutes',
      distance: 2.2,
      category: 'today'
    },
    {
      id: '3',
      customerName: 'Ananya Das',
      customerPhoto: 'https://i.pravatar.cc/150?img=10',
      customerRating: 4.9,
      customerPhone: '+91 98765 43212',
      service: 'Light Fitting',
      time: 'Tomorrow, 10:00 AM',
      duration: '30–40 minutes',
      distance: 3.0,
      note: 'Please bring necessary equipment',
      category: 'upcoming'
    },
    {
      id: '4',
      customerName: 'Vikram Singh',
      customerPhoto: 'https://i.pravatar.cc/150?img=15',
      customerRating: 4.7,
      customerPhone: '+91 98765 43213',
      service: 'MCB Replacement',
      time: 'Tomorrow, 2:30 PM',
      duration: '60 minutes',
      distance: 4.5,
      category: 'upcoming'
    }
  ];

  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'today') return booking.category === 'today';
    if (activeTab === 'upcoming') return booking.category === 'upcoming';
    return true; // 'all'
  });

  const handleStartJob = (id: string) => {
    router.push(`/bookings/ongoing/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50">
      {/* Navbar */}
      <ProfessionalNavbar
        activeTab="bookings"
        notificationCount={bookings.length}
      />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-2xl p-2 shadow-md mb-6 flex gap-2">
          <button
            onClick={() => setActiveTab('today')}
            className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all ${
              activeTab === 'today'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            🔵 Today
            {bookings.filter(b => b.category === 'today').length > 0 && (
              <span className="ml-2 bg-white text-teal-600 text-xs font-bold px-2 py-1 rounded-full">
                {bookings.filter(b => b.category === 'today').length}
              </span>
            )}
          </button>
          
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all ${
              activeTab === 'upcoming'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Upcoming
            {bookings.filter(b => b.category === 'upcoming').length > 0 && (
              <span className="ml-2 bg-white text-teal-600 text-xs font-bold px-2 py-1 rounded-full">
                {bookings.filter(b => b.category === 'upcoming').length}
              </span>
            )}
          </button>
          
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all ${
              activeTab === 'all'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            All
            <span className="ml-2 bg-white text-teal-600 text-xs font-bold px-2 py-1 rounded-full">
              {bookings.length}
            </span>
          </button>
        </div>

        {/* Booking Cards */}
        <div className="space-y-6">
          {filteredBookings.map((booking) => (
            <AcceptedBookingCard
              key={booking.id}
              booking={booking}
              onStartJob={handleStartJob}
            />
          ))}

          {filteredBookings.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl shadow-lg">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No {activeTab === 'today' ? 'Today\'s' : activeTab === 'upcoming' ? 'Upcoming' : ''} Bookings
              </h3>
              <p className="text-gray-600 mb-6">
                {activeTab === 'today' 
                  ? 'You don\'t have any bookings scheduled for today.' 
                  : 'You don\'t have any upcoming bookings.'}
              </p>
              <Link
                href="/bookings/requests"
                className="inline-block bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-xl transition-colors"
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
