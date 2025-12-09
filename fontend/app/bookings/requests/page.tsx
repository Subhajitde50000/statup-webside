'use client';

import React, { useState } from 'react';
import { ArrowLeft, RefreshCw, MessageCircle, Bell } from 'lucide-react';
import Link from 'next/link';
import { BookingRequestCard } from '../components';
import { ProfessionalNavbar } from '../../professional/components';

export default function BookingRequestsPage() {
  const [requests, setRequests] = useState([
    {
      id: '1',
      customerName: 'Subhajit De',
      customerPhoto: 'https://i.pravatar.cc/150?img=33',
      customerRating: 4.6,
      isVerified: true,
      service: 'Fan Repair – Electrical',
      serviceCategory: 'Electrical',
      description: 'Fan making noise, needs quick check',
      time: 'Today, 4:30 PM',
      date: '15 Dec 2025',
      duration: '45–60 minutes',
      distance: 2.2,
      earnings: 250
    },
    {
      id: '2',
      customerName: 'Priya Sharma',
      customerPhoto: 'https://i.pravatar.cc/150?img=5',
      customerRating: 4.8,
      isVerified: true,
      service: 'Switchboard Installation',
      serviceCategory: 'Electrical',
      description: 'Need new switchboard installed in bedroom',
      time: 'Today, 6:00 PM',
      date: '15 Dec 2025',
      duration: '60–90 minutes',
      distance: 3.5,
      earnings: 400
    },
    {
      id: '3',
      customerName: 'Rajesh Kumar',
      customerPhoto: 'https://i.pravatar.cc/150?img=12',
      customerRating: 4.9,
      isVerified: false,
      service: 'Wiring Check',
      serviceCategory: 'Electrical',
      description: 'Need complete home wiring inspection',
      time: 'Tomorrow, 10:00 AM',
      date: '16 Dec 2025',
      duration: '90–120 minutes',
      distance: 1.8,
      earnings: 500
    }
  ]);

  const handleAccept = (id: string) => {
    const request = requests.find(r => r.id === id);
    if (request) {
      alert(`✅ Booking accepted!\n\nConnecting you to ${request.customerName}...\n\nThis job has been moved to "Accepted Bookings"`);
      // Remove from list after accepting
      setRequests(requests.filter(r => r.id !== id));
    }
  };

  const handleReject = (id: string) => {
    const request = requests.find(r => r.id === id);
    if (request) {
      const confirmed = confirm(`Are you sure you want to reject this booking from ${request.customerName}?`);
      if (confirmed) {
        setRequests(requests.filter(r => r.id !== id));
        alert('Booking rejected.');
      }
    }
  };

  const handleRefresh = () => {
    alert('🔄 Refreshing booking requests...');
    // Add API call here to fetch new requests
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50">
      {/* Navbar */}
      <ProfessionalNavbar
        activeTab="bookings"
        notificationCount={requests.length}
      />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Banner */}
        {requests.length > 0 && (
          <div className="bg-gradient-to-r from-teal-500 to-green-500 text-white rounded-2xl p-6 mb-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black mb-1">
                  {requests.length} New Request{requests.length > 1 ? 's' : ''}
                </h2>
                <p className="text-teal-50">Review and respond quickly to maintain your rating</p>
              </div>
              <div className="text-4xl">📋</div>
            </div>
          </div>
        )}

        {/* Request Cards */}
        <div className="space-y-6">
          {requests.map((request) => (
            <BookingRequestCard
              key={request.id}
              request={request}
              onAccept={handleAccept}
              onReject={handleReject}
            />
          ))}

          {requests.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No New Requests</h3>
              <p className="text-gray-600">You're all caught up! Check back later for new booking requests.</p>
              <Link
                href="/professional"
                className="inline-block mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-xl transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
