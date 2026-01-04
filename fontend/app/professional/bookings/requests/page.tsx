'use client';

import React, { useState } from 'react';
import { 
  Clock, 
  MapPin, 
  DollarSign, 
  Star,
  CheckCircle,
  XCircle,
  Phone,
  MessageCircle,
  AlertCircle,
  Filter,
  SortAsc
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProfessionalNavbar from '../../components/ProfessionalNavbar';

interface BookingRequest {
  id: string;
  customerName: string;
  customerPhoto: string;
  customerRating: number;
  totalBookings: number;
  isVerified: boolean;
  service: string;
  description: string;
  time: string;
  date: string;
  duration: string;
  distance: number;
  location: string;
  earnings: number;
  isUrgent?: boolean;
  requestedAt: string;
}

export default function BookingRequestsPage() {
  const router = useRouter();
  const [sortBy, setSortBy] = useState<'time' | 'distance' | 'earnings'>('time');
  const [filterUrgent, setFilterUrgent] = useState(false);
  const [requests, setRequests] = useState<BookingRequest[]>([
    {
      id: '1',
      customerName: 'Subhajit De',
      customerPhoto: 'https://i.pravatar.cc/150?img=33',
      customerRating: 4.8,
      totalBookings: 23,
      isVerified: true,
      service: 'Switchboard Repair',
      description: 'Main switchboard tripping frequently. Need urgent inspection and repair.',
      time: 'Today, 2:00 PM',
      date: '15 Dec 2025',
      duration: '40–50 minutes',
      distance: 1.1,
      location: 'Sector 5, Salt Lake',
      earnings: 450,
      isUrgent: true,
      requestedAt: '5 min ago'
    },
    {
      id: '2',
      customerName: 'Priya Sharma',
      customerPhoto: 'https://i.pravatar.cc/150?img=5',
      customerRating: 4.6,
      totalBookings: 12,
      isVerified: true,
      service: 'Fan Installation',
      description: 'Need to install 2 ceiling fans in newly painted rooms.',
      time: 'Today, 4:30 PM',
      date: '15 Dec 2025',
      duration: '60–90 minutes',
      distance: 2.2,
      location: 'New Town, Action Area 1',
      earnings: 600,
      isUrgent: false,
      requestedAt: '12 min ago'
    },
    {
      id: '3',
      customerName: 'Rajesh Kumar',
      customerPhoto: 'https://i.pravatar.cc/150?img=12',
      customerRating: 4.9,
      totalBookings: 45,
      isVerified: true,
      service: 'Wiring Check',
      description: 'Complete home wiring inspection before moving in. Need detailed report.',
      time: 'Tomorrow, 10:00 AM',
      date: '16 Dec 2025',
      duration: '120 minutes',
      distance: 4.5,
      location: 'EM Bypass, Kasba',
      earnings: 800,
      isUrgent: false,
      requestedAt: '25 min ago'
    },
    {
      id: '4',
      customerName: 'Ananya Das',
      customerPhoto: 'https://i.pravatar.cc/150?img=10',
      customerRating: 4.7,
      totalBookings: 8,
      isVerified: false,
      service: 'Light Fitting',
      description: 'Install LED panel lights in 3 rooms.',
      time: 'Tomorrow, 3:00 PM',
      date: '16 Dec 2025',
      duration: '45 minutes',
      distance: 3.5,
      location: 'Park Street',
      earnings: 350,
      isUrgent: true,
      requestedAt: '32 min ago'
    },
    {
      id: '5',
      customerName: 'Vikram Singh',
      customerPhoto: 'https://i.pravatar.cc/150?img=15',
      customerRating: 4.5,
      totalBookings: 5,
      isVerified: true,
      service: 'MCB Replacement',
      description: 'Replace faulty MCB in distribution board.',
      time: 'Tomorrow, 5:00 PM',
      date: '16 Dec 2025',
      duration: '30 minutes',
      distance: 6.2,
      location: 'Howrah, Shibpur',
      earnings: 300,
      isUrgent: false,
      requestedAt: '1 hour ago'
    }
  ]);

  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  const filteredRequests = requests
    .filter(r => !filterUrgent || r.isUrgent)
    .sort((a, b) => {
      if (sortBy === 'distance') return a.distance - b.distance;
      if (sortBy === 'earnings') return b.earnings - a.earnings;
      return 0; // time sorting (default order)
    });

  const handleAccept = async (id: string) => {
    setAcceptingId(id);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRequests(prev => prev.filter(r => r.id !== id));
    setAcceptingId(null);
    // Show success message or redirect
    router.push('/professional/bookings/accepted');
  };

  const handleReject = async (id: string) => {
    if (!confirm('Are you sure you want to reject this request?')) return;
    
    setRejectingId(id);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    setRequests(prev => prev.filter(r => r.id !== id));
    setRejectingId(null);
  };

  const handleViewDetails = (id: string) => {
    router.push(`/professional/bookings/request/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-red-50">
      <ProfessionalNavbar activeTab="bookings" notificationCount={requests.length} />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-orange-600 to-red-600 rounded-xl shadow-lg">
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-gray-900">New Requests</h1>
              <p className="text-gray-600 font-medium">{requests.length} customer{requests.length > 1 ? 's' : ''} waiting for response</p>
            </div>
          </div>

          {/* Alert Banner */}
          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 flex items-center gap-3">
            <Clock className="w-6 h-6 text-red-600 flex-shrink-0" />
            <div>
              <p className="font-black text-red-900 text-sm">⏱️ Respond within 15 minutes to maintain high acceptance rate!</p>
              <p className="text-xs text-red-700 mt-1">Delayed responses reduce your visibility and customer trust.</p>
            </div>
          </div>
        </div>

        {/* Filters & Sort */}
        <div className="bg-white rounded-2xl p-4 shadow-lg border-2 border-gray-100 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-600" />
                <span className="font-bold text-gray-700 text-sm">Filters:</span>
              </div>
              <button
                onClick={() => setFilterUrgent(!filterUrgent)}
                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                  filterUrgent
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🔥 Urgent Only {filterUrgent && `(${requests.filter(r => r.isUrgent).length})`}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <SortAsc className="w-5 h-5 text-gray-600" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 rounded-lg border-2 border-gray-200 font-bold text-sm focus:outline-none focus:border-teal-500"
              >
                <option value="time">Sort by Time</option>
                <option value="distance">Sort by Distance</option>
                <option value="earnings">Sort by Earnings</option>
              </select>
            </div>
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-6">
          {filteredRequests.length > 0 ? (
            filteredRequests.map((request) => (
              <div
                key={request.id}
                className={`bg-white rounded-2xl shadow-lg border-2 transition-all hover:shadow-xl ${
                  request.isUrgent ? 'border-red-300 bg-gradient-to-r from-red-50 to-orange-50' : 'border-gray-200'
                }`}
              >
                {/* Request Header */}
                <div className="p-6 border-b-2 border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <img
                          src={request.customerPhoto}
                          alt={request.customerName}
                          className="w-16 h-16 rounded-full border-3 border-white shadow-md"
                        />
                        {request.isVerified && (
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-black text-gray-900">{request.customerName}</h3>
                          {request.isUrgent && (
                            <span className="bg-red-500 text-white text-xs font-black px-3 py-1 rounded-full animate-pulse">
                              URGENT
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="font-bold text-gray-700">{request.customerRating}</span>
                          </div>
                          <span className="text-gray-500">•</span>
                          <span className="text-gray-600 font-semibold">{request.totalBookings} bookings</span>
                        </div>
                        <p className="text-xs text-gray-500 font-semibold mt-1">Requested {request.requestedAt}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-3xl font-black text-green-600">₹{request.earnings}</p>
                      <p className="text-xs text-gray-600 font-semibold">Estimated</p>
                    </div>
                  </div>

                  {/* Service Details */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-black text-gray-900 text-lg mb-2">{request.service}</h4>
                    <p className="text-sm text-gray-700 font-medium">{request.description}</p>
                  </div>
                </div>

                {/* Request Details Grid */}
                <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-teal-600 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 font-semibold">Time</p>
                      <p className="font-black text-gray-900 text-sm">{request.time}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 font-semibold">Duration</p>
                      <p className="font-black text-gray-900 text-sm">{request.duration}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 font-semibold">Distance</p>
                      <p className="font-black text-gray-900 text-sm">{request.distance} km</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 font-semibold">Earnings</p>
                      <p className="font-black text-green-600 text-sm">₹{request.earnings}</p>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="px-6 pb-4">
                  <p className="text-sm text-gray-600 font-semibold">
                    📍 {request.location}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="p-6 pt-0 grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleReject(request.id)}
                    disabled={rejectingId === request.id || acceptingId === request.id}
                    className="flex items-center justify-center gap-2 px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-black rounded-xl transition-all disabled:opacity-50 border-2 border-gray-200"
                  >
                    <XCircle className="w-5 h-5" />
                    {rejectingId === request.id ? 'Rejecting...' : 'Reject'}
                  </button>

                  <button
                    onClick={() => handleAccept(request.id)}
                    disabled={acceptingId === request.id || rejectingId === request.id}
                    className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-teal-600 to-green-600 hover:shadow-xl text-white font-black rounded-xl transition-all disabled:opacity-50"
                  >
                    <CheckCircle className="w-5 h-5" />
                    {acceptingId === request.id ? 'Accepting...' : 'Accept Job'}
                  </button>
                </div>

                {/* Quick Actions */}
                <div className="px-6 pb-6 flex gap-3">
                  <button
                    onClick={() => handleViewDetails(request.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 text-blue-700 font-bold rounded-xl hover:bg-blue-100 transition-all border-2 border-blue-200"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">View Full Details</span>
                  </button>
                  
                  <button className="flex items-center justify-center px-4 py-3 bg-green-50 text-green-700 font-bold rounded-xl hover:bg-green-100 transition-all border-2 border-green-200">
                    <Phone className="w-5 h-5" />
                  </button>
                  
                  <button className="flex items-center justify-center px-4 py-3 bg-purple-50 text-purple-700 font-bold rounded-xl hover:bg-purple-100 transition-all border-2 border-purple-200">
                    <MessageCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-black text-gray-900 mb-2">All Caught Up!</h3>
              <p className="text-gray-600 font-semibold">
                {filterUrgent 
                  ? 'No urgent requests at the moment. Check back soon!'
                  : 'No new booking requests at the moment. Check back soon!'}
              </p>
              <Link
                href="/professional/bookings"
                className="inline-block mt-6 px-6 py-3 bg-gradient-to-r from-teal-600 to-green-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
              >
                Back to Dashboard
              </Link>
            </div>
          )}
        </div>

        {/* Bottom Tips */}
        <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
          <h3 className="font-black text-blue-900 mb-3">📌 Quick Tips for Managing Requests</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="font-black">•</span>
              <span className="font-semibold">Respond to urgent requests first - they expire faster!</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-black">•</span>
              <span className="font-semibold">Check distance before accepting - factor in travel time</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-black">•</span>
              <span className="font-semibold">Verified customers have completed identity verification</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-black">•</span>
              <span className="font-semibold">Contact customers before accepting to confirm details</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
