'use client';

import React, { useState } from 'react';
import { Play, MapPin, Clock, Phone, MessageCircle, Navigation, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProfessionalNavbar from '../../components/ProfessionalNavbar';

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
    router.push(`/professional/bookings/ongoing/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50">
      <ProfessionalNavbar activeTab="bookings" />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-2">Accepted Bookings</h1>
          <p className="text-gray-600 font-medium">{bookings.length} job{bookings.length > 1 ? 's' : ''} scheduled</p>
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
              {bookings.filter(b => b.category === 'today').length > 0 && (
                <span className="bg-white text-blue-600 text-xs font-black px-2 py-1 rounded-full">
                  {bookings.filter(b => b.category === 'today').length}
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
              {bookings.filter(b => b.category === 'upcoming').length > 0 && (
                <span className="bg-white text-blue-600 text-xs font-black px-2 py-1 rounded-full">
                  {bookings.filter(b => b.category === 'upcoming').length}
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
              <span className="bg-white text-blue-600 text-xs font-black px-2 py-1 rounded-full">
                {bookings.length}
              </span>
            </div>
          </button>
        </div>

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
                    <p className="text-xs text-gray-600 font-semibold mb-1">Time</p>
                    <p className="font-black text-gray-900">{booking.time}</p>
                  </div>
                  
                  <div className="bg-purple-50 rounded-xl p-4 border-2 border-purple-200">
                    <Clock className="w-5 h-5 text-purple-600 mb-2" />
                    <p className="text-xs text-gray-600 font-semibold mb-1">Duration</p>
                    <p className="font-black text-gray-900">{booking.duration}</p>
                  </div>
                  
                  <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
                    <MapPin className="w-5 h-5 text-green-600 mb-2" />
                    <p className="text-xs text-gray-600 font-semibold mb-1">Distance</p>
                    <p className="font-black text-gray-900">{booking.distance} km</p>
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
                  <button className="flex items-center justify-center gap-2 px-4 py-3 bg-green-50 text-green-700 font-bold rounded-xl hover:bg-green-100 transition-all border-2 border-green-200">
                    <Phone className="w-5 h-5" />
                    <span className="hidden md:inline">Call</span>
                  </button>
                  
                  <button className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 text-blue-700 font-bold rounded-xl hover:bg-blue-100 transition-all border-2 border-blue-200">
                    <MessageCircle className="w-5 h-5" />
                    <span className="hidden md:inline">Message</span>
                  </button>
                  
                  <button className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-50 text-purple-700 font-bold rounded-xl hover:bg-purple-100 transition-all border-2 border-purple-200">
                    <Navigation className="w-5 h-5" />
                    <span className="hidden md:inline">Navigate</span>
                  </button>
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

          {filteredBookings.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg border-2 border-gray-100">
              <Calendar className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-black text-gray-900 mb-2">
                No {activeTab === 'today' ? 'Today\'s' : activeTab === 'upcoming' ? 'Upcoming' : ''} Bookings
              </h3>
              <p className="text-gray-600 font-semibold mb-6">
                {activeTab === 'today' 
                  ? 'You don\'t have any bookings scheduled for today.' 
                  : 'You don\'t have any upcoming bookings.'}
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
