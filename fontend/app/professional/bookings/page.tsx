'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  DollarSign,
  AlertCircle,
  MapPin,
  Star,
  ArrowRight,
  Loader,
  User,
  Phone
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProfessionalNavbar from '../components/ProfessionalNavbar';

interface BookingStats {
  pending: number;
  accepted: number;
  ongoing: number;
  completed: number;
  cancelled: number;
  todayEarnings: number;
  weekEarnings: number;
  rating: number;
}

interface UpcomingBooking {
  id: string;
  customerName: string;
  customerPhoto: string;
  service: string;
  time: string;
  location: string;
  distance: number;
  isUrgent?: boolean;
}

interface NewRequest {
  id: string;
  customerName: string;
  customerPhoto: string;
  customerRating: number;
  service: string;
  description: string;
  time: string;
  distance: number;
  location: string;
  earnings: number;
  isUrgent?: boolean;
  requestedAt: string;
}

export default function BookingsDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<BookingStats>({
    pending: 5,
    accepted: 8,
    ongoing: 2,
    completed: 142,
    cancelled: 12,
    todayEarnings: 1250,
    weekEarnings: 8450,
    rating: 4.8
  });

  const [upcomingBookings, setUpcomingBookings] = useState<UpcomingBooking[]>([
    {
      id: '1',
      customerName: 'Subhajit De',
      customerPhoto: 'https://i.pravatar.cc/150?img=33',
      service: 'Switchboard Repair',
      time: 'Today, 2:00 PM',
      location: 'Sector 5, Salt Lake',
      distance: 1.1,
      isUrgent: true
    },
    {
      id: '2',
      customerName: 'Priya Sharma',
      customerPhoto: 'https://i.pravatar.cc/150?img=5',
      service: 'Fan Installation',
      time: 'Today, 4:30 PM',
      location: 'New Town, Action Area 1',
      distance: 2.2
    },
    {
      id: '3',
      customerName: 'Ananya Das',
      customerPhoto: 'https://i.pravatar.cc/150?img=10',
      service: 'Light Fitting',
      time: 'Tomorrow, 10:00 AM',
      location: 'Park Street',
      distance: 3.5
    }
  ]);

  const [newRequests, setNewRequests] = useState<NewRequest[]>([
    {
      id: 'req1',
      customerName: 'Ramesh Gupta',
      customerPhoto: 'https://i.pravatar.cc/150?img=20',
      customerRating: 4.7,
      service: 'AC Installation',
      description: 'Need to install new 1.5 ton split AC in bedroom',
      time: 'Tomorrow, 11:00 AM',
      distance: 2.5,
      location: 'Salt Lake, Sector 3',
      earnings: 650,
      isUrgent: true,
      requestedAt: '8 min ago'
    },
    {
      id: 'req2',
      customerName: 'Neha Singh',
      customerPhoto: 'https://i.pravatar.cc/150?img=25',
      customerRating: 4.9,
      service: 'Wiring Repair',
      description: 'Loose wiring in kitchen area, sparking issue',
      time: 'Today, 5:00 PM',
      distance: 1.8,
      location: 'New Town, Block AA',
      earnings: 400,
      isUrgent: false,
      requestedAt: '15 min ago'
    },
    {
      id: 'req3',
      customerName: 'Amit Sharma',
      customerPhoto: 'https://i.pravatar.cc/150?img=30',
      customerRating: 4.6,
      service: 'MCB Replacement',
      description: 'Main circuit breaker keeps tripping',
      time: 'Tomorrow, 2:00 PM',
      distance: 3.2,
      location: 'Park Circus',
      earnings: 350,
      isUrgent: false,
      requestedAt: '22 min ago'
    }
  ]);

  const handleAcceptRequest = async (id: string) => {
    // Simulate accepting request
    const request = newRequests.find(r => r.id === id);
    if (request) {
      setNewRequests(prev => prev.filter(r => r.id !== id));
      setStats(prev => ({ ...prev, pending: prev.pending - 1, accepted: prev.accepted + 1 }));
    }
  };

  const handleRejectRequest = async (id: string) => {
    if (!confirm('Are you sure you want to reject this request?')) return;
    setNewRequests(prev => prev.filter(r => r.id !== id));
    setStats(prev => ({ ...prev, pending: prev.pending - 1 }));
  };

  const todayDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50 to-green-50">
      <ProfessionalNavbar activeTab="bookings" notificationCount={stats.pending} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-2">Bookings Dashboard</h1>
          <p className="text-gray-600 font-medium">{todayDate}</p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Pending Requests */}
          <Link href="/professional/bookings/requests">
            <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all cursor-pointer transform hover:scale-105">
              <div className="flex items-center justify-between mb-3">
                <AlertCircle className="w-8 h-8 text-white opacity-80" />
                {stats.pending > 0 && (
                  <span className="bg-white text-red-600 text-xs font-black px-3 py-1 rounded-full animate-pulse">
                    NEW
                  </span>
                )}
              </div>
              <p className="text-5xl font-black text-white mb-2">{stats.pending}</p>
              <p className="text-white text-sm font-bold opacity-90">Pending Requests</p>
              <div className="mt-3 flex items-center text-white text-xs font-semibold">
                <span>Respond Now</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </Link>

          {/* Accepted Bookings */}
          <Link href="/professional/bookings/accepted">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all cursor-pointer transform hover:scale-105">
              <Calendar className="w-8 h-8 text-white opacity-80 mb-3" />
              <p className="text-5xl font-black text-white mb-2">{stats.accepted}</p>
              <p className="text-white text-sm font-bold opacity-90">Accepted Jobs</p>
              <div className="mt-3 flex items-center text-white text-xs font-semibold">
                <span>View Schedule</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </Link>

          {/* Ongoing Jobs */}
          <Link href="/professional/bookings/ongoing">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all cursor-pointer transform hover:scale-105">
              <Loader className="w-8 h-8 text-white opacity-80 mb-3 animate-spin" />
              <p className="text-5xl font-black text-white mb-2">{stats.ongoing}</p>
              <p className="text-white text-sm font-bold opacity-90">Ongoing Jobs</p>
              <div className="mt-3 flex items-center text-white text-xs font-semibold">
                <span>In Progress</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </Link>

          {/* Completed Jobs */}
          <Link href="/professional/bookings/completed">
            <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all cursor-pointer transform hover:scale-105">
              <CheckCircle className="w-8 h-8 text-white opacity-80 mb-3" />
              <p className="text-5xl font-black text-white mb-2">{stats.completed}</p>
              <p className="text-white text-sm font-bold opacity-90">Completed Jobs</p>
              <div className="mt-3 flex items-center text-white text-xs font-semibold">
                <span>View History</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </Link>
        </div>

        {/* Earnings & Performance Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Today's Earnings */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-gray-900">Today&apos;s Earnings</h3>
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-4xl font-black text-green-600 mb-2">₹{stats.todayEarnings}</p>
            <div className="flex items-center text-sm text-gray-600">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="font-semibold">+23% from yesterday</span>
            </div>
          </div>

          {/* Week's Earnings */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-gray-900">This Week</h3>
              <DollarSign className="w-6 h-6 text-teal-600" />
            </div>
            <p className="text-4xl font-black text-teal-600 mb-2">₹{stats.weekEarnings}</p>
            <div className="flex items-center text-sm text-gray-600">
              <TrendingUp className="w-4 h-4 text-teal-500 mr-1" />
              <span className="font-semibold">On track for ₹33k/month</span>
            </div>
          </div>

          {/* Rating */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-gray-900">Your Rating</h3>
              <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
            </div>
            <p className="text-4xl font-black text-yellow-600 mb-2">{stats.rating} ⭐</p>
            <div className="flex items-center text-sm text-gray-600">
              <span className="font-semibold">Based on {stats.completed} reviews</span>
            </div>
          </div>
        </div>

        {/* New Booking Requests Section */}
        {newRequests.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                <AlertCircle className="w-8 h-8 text-orange-600" />
                New Booking Requests
                <span className="bg-red-500 text-white text-sm font-black px-3 py-1 rounded-full animate-pulse">
                  {newRequests.length}
                </span>
              </h2>
              <Link 
                href="/professional/bookings/requests"
                className="text-orange-600 font-bold hover:text-orange-700 flex items-center gap-1"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {newRequests.slice(0, 4).map((request) => (
                <div
                  key={request.id}
                  className={`bg-white rounded-2xl shadow-lg border-2 transition-all hover:shadow-2xl ${
                    request.isUrgent ? 'border-red-300 bg-gradient-to-br from-red-50 to-orange-50' : 'border-gray-200'
                  }`}
                >
                  {/* Request Header */}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <img
                          src={request.customerPhoto}
                          alt={request.customerName}
                          className="w-14 h-14 rounded-full border-3 border-white shadow-md"
                        />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-black text-gray-900">{request.customerName}</h3>
                            {request.isUrgent && (
                              <span className="bg-red-500 text-white text-xs font-black px-2 py-1 rounded-full animate-pulse">
                                URGENT
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="font-bold text-gray-700">{request.customerRating}</span>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-500 font-semibold">{request.requestedAt}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-green-600">₹{request.earnings}</p>
                      </div>
                    </div>

                    {/* Service Info */}
                    <div className="bg-gray-50 rounded-xl p-3 mb-4">
                      <h4 className="font-black text-gray-900 mb-1">{request.service}</h4>
                      <p className="text-xs text-gray-600 font-medium">{request.description}</p>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-teal-600" />
                        <span className="font-bold text-gray-700">{request.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-red-600" />
                        <span className="font-bold text-gray-700">{request.distance} km</span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 font-semibold mb-4">📍 {request.location}</p>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => handleRejectRequest(request.id)}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl transition-all border-2 border-gray-200"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                      <button
                        onClick={() => handleAcceptRequest(request.id)}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-teal-600 to-green-600 hover:shadow-xl text-white font-bold rounded-xl transition-all"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Accept
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {newRequests.length > 4 && (
              <div className="mt-6 text-center">
                <Link
                  href="/professional/bookings/requests"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white font-black rounded-xl hover:shadow-xl transition-all"
                >
                  View All {newRequests.length} Requests
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Upcoming Schedule */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Schedule */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-gray-900">Today&apos;s Schedule</h2>
                <Link 
                  href="/professional/bookings/accepted"
                  className="text-teal-600 font-bold text-sm hover:text-teal-700 flex items-center"
                >
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>

              {upcomingBookings.length > 0 ? (
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <div
                      key={booking.id}
                      onClick={() => router.push(`/professional/bookings/ongoing/${booking.id}`)}
                      className="bg-gradient-to-r from-teal-50 to-green-50 rounded-xl p-5 border-2 border-teal-200 hover:shadow-lg transition-all cursor-pointer"
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={booking.customerPhoto}
                          alt={booking.customerName}
                          className="w-14 h-14 rounded-full border-3 border-white shadow-md"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-black text-gray-900 text-lg">
                                {booking.customerName}
                              </h3>
                              <p className="text-sm text-gray-600 font-semibold">
                                {booking.service}
                              </p>
                            </div>
                            {booking.isUrgent && (
                              <span className="bg-red-500 text-white text-xs font-black px-3 py-1 rounded-full animate-pulse">
                                URGENT
                              </span>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3 mt-3">
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="w-4 h-4 text-teal-600" />
                              <span className="font-bold text-gray-700">{booking.time}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="w-4 h-4 text-teal-600" />
                              <span className="font-bold text-gray-700">{booking.distance} km away</span>
                            </div>
                          </div>
                          
                          <p className="text-xs text-gray-500 mt-2 font-semibold">
                            📍 {booking.location}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-semibold">No bookings scheduled for today</p>
                  <Link
                    href="/professional/bookings/requests"
                    className="inline-block mt-4 text-teal-600 font-bold hover:text-teal-700"
                  >
                    Check New Requests →
                  </Link>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
              <h2 className="text-2xl font-black text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                <Link href="/professional/bookings/requests">
                  <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-4 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    View Requests
                    {stats.pending > 0 && (
                      <span className="bg-white text-red-600 text-xs font-black px-2 py-1 rounded-full">
                        {stats.pending}
                      </span>
                    )}
                  </button>
                </Link>

                <Link href="/professional/schedule">
                  <button className="w-full bg-gradient-to-r from-teal-500 to-green-500 text-white font-bold py-4 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Manage Schedule
                  </button>
                </Link>

                <Link href="/professional/bookings/completed">
                  <button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold py-4 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    View History
                  </button>
                </Link>

                <Link href="/professional/bookings/cancelled">
                  <button className="w-full bg-gradient-to-r from-gray-500 to-gray-600 text-white font-bold py-4 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2">
                    <XCircle className="w-5 h-5" />
                    Cancelled ({stats.cancelled})
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column - Tips & Insights */}
          <div className="space-y-6">
            {/* Performance Tips */}
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 shadow-lg text-white">
              <h3 className="text-xl font-black mb-4">💡 Pro Tips</h3>
              <div className="space-y-3">
                <div className="bg-white bg-opacity-20 rounded-xl p-3">
                  <p className="text-sm font-bold">Respond within 10 minutes</p>
                  <p className="text-xs opacity-90 mt-1">Fast responses get 40% more bookings!</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-xl p-3">
                  <p className="text-sm font-bold">Update availability daily</p>
                  <p className="text-xs opacity-90 mt-1">Keep your schedule accurate to avoid cancellations</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-xl p-3">
                  <p className="text-sm font-bold">Maintain 4.5+ rating</p>
                  <p className="text-xs opacity-90 mt-1">Higher ratings mean more visibility</p>
                </div>
              </div>
            </div>

            {/* Weekly Goal */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
              <h3 className="text-xl font-black text-gray-900 mb-4">Weekly Goal</h3>
              <div className="mb-4">
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span className="text-gray-600">Jobs Completed</span>
                  <span className="text-teal-600">18 / 25</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-teal-500 to-green-500 h-full transition-all"
                    style={{ width: '72%' }}
                  />
                </div>
              </div>
              <p className="text-xs text-gray-600 font-semibold">
                Complete 7 more jobs to earn a ₹500 bonus! 🎯
              </p>
            </div>

            {/* Critical Alerts */}
            {stats.pending > 0 && (
              <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-black text-red-900 mb-2">Action Required!</h3>
                    <p className="text-sm text-red-800 font-semibold mb-3">
                      You have {stats.pending} pending request{stats.pending > 1 ? 's' : ''} waiting for response
                    </p>
                    <Link href="/professional/bookings/requests">
                      <button className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors text-sm">
                        Respond Now →
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Today's Summary */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
              <h3 className="text-xl font-black text-gray-900 mb-4">Today Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-semibold text-sm">Jobs Today</span>
                  <span className="font-black text-gray-900">{upcomingBookings.filter(b => b.time.includes('Today')).length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-semibold text-sm">Earnings</span>
                  <span className="font-black text-green-600">₹{stats.todayEarnings}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-semibold text-sm">Completion Rate</span>
                  <span className="font-black text-teal-600">94%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-semibold text-sm">Avg Response Time</span>
                  <span className="font-black text-blue-600">8 min</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
