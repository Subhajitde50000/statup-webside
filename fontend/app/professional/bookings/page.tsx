'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
  Loader2,
  User,
  Phone
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProfessionalNavbar from '../components/ProfessionalNavbar';
import { getProfessionalBookings, acceptBooking, rejectBooking, Booking } from '@/utils/bookings';
import { useBookingSocket } from '@/utils/BookingSocketContext';

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
  date: string;
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
  date: string;
  distance: number;
  location: string;
  earnings: number;
  isUrgent?: boolean;
  requestedAt: string;
}

export default function BookingsDashboardPage() {
  const router = useRouter();
  const { isConnected } = useBookingSocket();
  const [isLoading, setIsLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  
  const [stats, setStats] = useState<BookingStats>({
    pending: 0,
    accepted: 0,
    ongoing: 0,
    completed: 0,
    cancelled: 0,
    todayEarnings: 0,
    weekEarnings: 0,
    rating: 0
  });

  const [upcomingBookings, setUpcomingBookings] = useState<UpcomingBooking[]>([]);
  const [newRequests, setNewRequests] = useState<NewRequest[]>([]);

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Fetch all booking types in parallel
      const [pendingRes, acceptedRes, ongoingRes, completedRes, cancelledRes] = await Promise.all([
        getProfessionalBookings({ status: 'pending' }),
        getProfessionalBookings({ status: 'accepted' }),
        getProfessionalBookings({ status: 'ongoing' }),
        getProfessionalBookings({ status: 'completed' }),
        getProfessionalBookings({ status: 'cancelled' })
      ]);
      
      // Calculate stats
      const completedBookings = completedRes.bookings;
      const todayStr = new Date().toISOString().split('T')[0];
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const todayEarnings = completedBookings
        .filter((b: Booking) => b.completed_at && b.completed_at.startsWith(todayStr))
        .reduce((sum: number, b: Booking) => sum + b.price, 0);
      
      const weekEarnings = completedBookings
        .filter((b: Booking) => b.completed_at && new Date(b.completed_at) >= weekAgo)
        .reduce((sum: number, b: Booking) => sum + b.price, 0);
      
      const ratings = completedBookings.filter((b: Booking) => b.rating).map((b: Booking) => b.rating || 0);
      const avgRating = ratings.length > 0 ? ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length : 0;
      
      setStats({
        pending: pendingRes.bookings.length,
        accepted: acceptedRes.bookings.length,
        ongoing: ongoingRes.bookings.length,
        completed: completedRes.bookings.length,
        cancelled: cancelledRes.bookings.length,
        todayEarnings,
        weekEarnings,
        rating: avgRating
      });
      
      // Transform pending bookings to new requests
      const transformedRequests: NewRequest[] = pendingRes.bookings.slice(0, 5).map((booking: Booking) => ({
        id: booking.id,
        customerName: booking.user?.name || 'Customer',
        customerPhoto: `https://ui-avatars.com/api/?name=${encodeURIComponent(booking.user?.name || 'Customer')}&size=80&background=1E2A5E&color=fff`,
        customerRating: 4.5,
        service: booking.service_name || booking.service_type,
        description: booking.notes || 'Service request',
        time: booking.time,
        date: booking.date,
        distance: 0,
        location: booking.address_display,
        earnings: booking.price,
        isUrgent: false,
        requestedAt: getTimeAgo(booking.created_at)
      }));
      setNewRequests(transformedRequests);
      
      // Transform accepted bookings to upcoming
      const transformedUpcoming: UpcomingBooking[] = acceptedRes.bookings.slice(0, 5).map((booking: Booking) => ({
        id: booking.id,
        customerName: booking.user?.name || 'Customer',
        customerPhoto: `https://ui-avatars.com/api/?name=${encodeURIComponent(booking.user?.name || 'Customer')}&size=80&background=1E2A5E&color=fff`,
        service: booking.service_name || booking.service_type,
        time: booking.time,
        date: booking.date,
        location: booking.address_display,
        distance: 0,
        isUrgent: false
      }));
      setUpcomingBookings(transformedUpcoming);
      
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getTimeAgo = (dateStr: string): string => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleAcceptRequest = async (id: string) => {
    setAcceptingId(id);
    try {
      await acceptBooking(id);
      setNewRequests(prev => prev.filter(r => r.id !== id));
      setStats(prev => ({ ...prev, pending: prev.pending - 1, accepted: prev.accepted + 1 }));
      fetchDashboardData(); // Refresh data
    } catch (err) {
      console.error('Error accepting request:', err);
      alert(err instanceof Error ? err.message : 'Failed to accept request');
    } finally {
      setAcceptingId(null);
    }
  };

  const handleRejectRequest = async (id: string) => {
    if (!confirm('Are you sure you want to reject this request?')) return;
    setRejectingId(id);
    try {
      await rejectBooking(id, 'Rejected by professional');
      setNewRequests(prev => prev.filter(r => r.id !== id));
      setStats(prev => ({ ...prev, pending: prev.pending - 1 }));
    } catch (err) {
      console.error('Error rejecting request:', err);
      alert(err instanceof Error ? err.message : 'Failed to reject request');
    } finally {
      setRejectingId(null);
    }
  };

  const todayDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50 to-green-50">
        <ProfessionalNavbar activeTab="bookings" notificationCount={0} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-teal-600 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50 to-green-50">
      <ProfessionalNavbar activeTab="bookings" notificationCount={stats.pending} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Connection Status */}
        <div className={`mb-4 px-4 py-2 rounded-lg flex items-center gap-2 w-fit ${isConnected ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          <span className="text-sm font-medium">
            {isConnected ? 'Live Updates Active' : 'Reconnecting...'}
          </span>
        </div>

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
