'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Calendar, Clock, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  StatusToggle,
  EarningsOverview,
  BookingsOverview,
  BookingRequestCard,
  QuickStats,
  WeeklyChart,
  QuickActions,
  RecentReviews,
  ProfessionalNavbar
} from './components';
import { getCurrentUser, User } from '@/utils/auth';

export default function ProfessionalDashboard() {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(true);
  const [notificationCount, setNotificationCount] = useState(3);
  const [currentTime, setCurrentTime] = useState<string>('--:--');
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  // Check authentication and role
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          router.push('/auth');
          return;
        }

        const currentUser = await getCurrentUser();
        setUser(currentUser);

        // Check if user is a professional
        if (currentUser.role === 'professional') {
          setLoading(false);
        } else if (currentUser.role === 'pending_professional') {
          setAccessDenied(true);
          setLoading(false);
        } else {
          // Not a professional at all - redirect to home
          router.push('/');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/auth');
      }
    };

    checkAuth();
  }, [router]);

  // Update time every minute after mounting
  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  // Simulate real professional data
  const professionalData = {
    name: 'Rahul',
    profileImage: 'https://i.pravatar.cc/150?img=12',
    profession: 'Senior Electrician',
    totalEarnings: 32500,
    todayEarnings: 1200,
    completedJobs: 18,
    payoutDate: '28 Dec 2025',
    percentageChange: 12,
    todayBookings: {
      total: 4,
      completed: 1,
      pending: 2,
      cancelled: 1
    },
    stats: {
      rating: 4.8,
      totalJobs: 9,
      newReviews: 2,
      travelDistance: 34
    },
    weeklyData: [
      { day: 'Mon', earnings: 600, jobs: 2 },
      { day: 'Tue', earnings: 900, jobs: 3 },
      { day: 'Wed', earnings: 1200, jobs: 4 },
      { day: 'Thu', earnings: 1500, jobs: 5 },
      { day: 'Fri', earnings: 1300, jobs: 4 },
      { day: 'Sat', earnings: 800, jobs: 2 },
      { day: 'Sun', earnings: 0, jobs: 0 }
    ],
    bookingRequests: [
      {
        id: '1',
        customerName: 'Subhajit De',
        customerImage: 'https://i.pravatar.cc/100?img=33',
        service: 'Fan Repair — Electrical',
        time: 'Today, 4:30 PM',
        budget: 300,
        distance: 2.1,
        urgency: 'high' as const,
        address: 'Salt Lake, Sector V',
        estimatedDuration: '1-2 hours'
      },
      {
        id: '2',
        customerName: 'Priya Sharma',
        customerImage: 'https://i.pravatar.cc/100?img=5',
        service: 'Switchboard Installation',
        time: 'Today, 6:00 PM',
        budget: 500,
        distance: 3.5,
        urgency: 'normal' as const,
        address: 'Park Street',
        estimatedDuration: '2-3 hours'
      }
    ],
    recentReviews: [
      {
        id: '1',
        customerName: 'Amit Shaw',
        rating: 5,
        comment: 'Very professional and fast service!',
        date: '2 days ago',
        service: 'Wiring Installation'
      },
      {
        id: '2',
        customerName: 'Priya Sen',
        rating: 4,
        comment: 'Good behaviour, fixed the issue quickly.',
        date: '5 days ago',
        service: 'Fan Repair'
      },
      {
        id: '3',
        customerName: 'Rajesh Kumar',
        rating: 5,
        comment: 'Highly skilled technician. Will recommend!',
        date: '1 week ago',
        service: 'Full Home Inspection'
      }
    ],
    upcomingBookings: [
      {
        id: 'b1',
        customerName: 'Ananya Das',
        service: 'Light Fitting',
        time: 'Tomorrow, 10:00 AM',
        address: 'Ballygunge'
      },
      {
        id: 'b2',
        customerName: 'Vikram Singh',
        service: 'MCB Replacement',
        time: 'Tomorrow, 2:30 PM',
        address: 'Howrah'
      }
    ]
  };

  const handleAcceptBooking = (id: string) => {
    console.log('Accept booking:', id);
    setNotificationCount(prev => prev - 1);
    // Add API call here
    alert('Booking accepted! Customer will be notified.');
  };

  const handleRejectBooking = (id: string) => {
    console.log('Reject booking:', id);
    setNotificationCount(prev => prev - 1);
    // Add API call here
    alert('Booking rejected.');
  };

  const handleViewDetails = (id: string) => {
    console.log('View details:', id);
    // Navigate to booking details
  };

  const handleStatusToggle = (status: boolean) => {
    setIsOnline(status);
    if (status) {
      alert('You are now ONLINE. You will receive new booking requests.');
    } else {
      alert('You are now OFFLINE. You will not receive new booking requests.');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#0AA06E] mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Access denied for pending professionals
  if (accessDenied) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Verification Pending
          </h1>
          <p className="text-gray-600 mb-6">
            Your professional registration is currently being reviewed by our team. 
            You'll be able to access the dashboard once your account is approved.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>💡 Tip:</strong> This usually takes 24-48 hours. We'll notify you via SMS and email once approved.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/register/status?phone={user?.phone}" className="flex-1">
              <button className="w-full px-4 py-3 bg-[#0AA06E] text-white rounded-lg hover:bg-[#098F5E] font-medium transition-colors">
                Check Status
              </button>
            </Link>
            <Link href="/" className="flex-1">
              <button className="w-full px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors">
                Go Home
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50">
       {/* Navbar */}
            <ProfessionalNavbar
              activeTab="home"
              notificationCount={3}
              currentTime={currentTime}
            />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
                Welcome Back, {professionalData.name}!
              </h1>
              <p className="text-gray-600 font-medium">Your daily service overview</p>
            </div>
            <div className="hidden md:block">
              <div className="text-right">
                <p className="text-sm text-gray-500">Today's Date</p>
                <p className="text-lg font-bold text-gray-900">
                  {mounted ? new Date().toLocaleDateString('en-IN', { 
                    day: 'numeric', 
                    month: 'short', 
                    year: 'numeric' 
                  }) : 'Loading...'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Alert Banner for Pending Requests */}
        {professionalData.bookingRequests.length > 0 && (
          <div className="mb-6 bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-500 rounded-xl p-4 shadow-md">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-bold text-gray-900">
                  You have {professionalData.bookingRequests.length} pending booking request{professionalData.bookingRequests.length > 1 ? 's' : ''}!
                </p>
                <p className="text-sm text-gray-600">
                  Please review and respond quickly to maintain your response time rating.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Status Toggle */}
        <div className="mb-6">
          <StatusToggle isOnline={isOnline} onToggle={handleStatusToggle} />
        </div>

        {/* Main Grid Layout */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Left Column - 2 cols */}
          <div className="lg:col-span-2 space-y-6">
            {/* Earnings Overview */}
            <EarningsOverview
              totalEarnings={professionalData.totalEarnings}
              todayEarnings={professionalData.todayEarnings}
              completedJobs={professionalData.completedJobs}
              payoutDate={professionalData.payoutDate}
              percentageChange={professionalData.percentageChange}
            />

            {/* New Booking Requests */}
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🔔</span>
                  <h3 className="text-lg font-bold text-gray-900">New Requests (Live)</h3>
                </div>
                {professionalData.bookingRequests.length > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {professionalData.bookingRequests.length} New
                  </span>
                )}
              </div>
              <div className="space-y-4">
                {professionalData.bookingRequests.map((request) => (
                  <BookingRequestCard
                    key={request.id}
                    request={request}
                    onAccept={handleAcceptBooking}
                    onReject={handleRejectBooking}
                    onViewDetails={handleViewDetails}
                  />
                ))}
                {professionalData.bookingRequests.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="font-semibold text-gray-600">No new booking requests</p>
                    <p className="text-sm mt-2">You're all caught up! Check back later for new requests.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Upcoming Bookings */}
            {professionalData.upcomingBookings.length > 0 && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-6 shadow-lg border-2 border-blue-200">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-6 h-6 text-blue-600" />
                  <h3 className="text-lg font-bold text-gray-900">Upcoming Bookings</h3>
                </div>
                <div className="space-y-3">
                  {professionalData.upcomingBookings.map((booking) => (
                    <div key={booking.id} className="bg-white rounded-xl p-4 border-2 border-blue-100">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-bold text-gray-900">{booking.customerName}</p>
                          <p className="text-sm text-gray-600">{booking.service}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <span className="flex items-center gap-1 text-blue-600 font-semibold">
                              <Clock className="w-4 h-4" />
                              {booking.time}
                            </span>
                            <span className="text-gray-500">{booking.address}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <QuickStats
              rating={professionalData.stats.rating}
              totalJobs={professionalData.stats.totalJobs}
              newReviews={professionalData.stats.newReviews}
              travelDistance={professionalData.stats.travelDistance}
            />

            {/* Weekly Activity Chart */}
            <WeeklyChart data={professionalData.weeklyData} />

            {/* Quick Actions */}
            <QuickActions
              onViewBookings={() => window.location.href = '/professional/bookings/requests'}
              onSetAvailability={() => window.location.href = '/professional/schedule'}
              onManageServices={() => window.location.href = '/professional/services'}
              onWithdraw={() => window.location.href = '/professional/earnings'}
            />
          </div>

          {/* Right Column - 1 col */}
          <div className="space-y-6">
            {/* Today's Bookings Overview */}
            <BookingsOverview
              total={professionalData.todayBookings.total}
              completed={professionalData.todayBookings.completed}
              pending={professionalData.todayBookings.pending}
              cancelled={professionalData.todayBookings.cancelled}
              onViewSchedule={() => window.location.href = '/professional/schedule'}
            />

            {/* Performance Summary */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-6 shadow-lg border-2 border-purple-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">💎 Performance Summary</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 font-semibold">Response Rate</span>
                  <span className="text-lg font-black text-green-600">98%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 font-semibold">Completion Rate</span>
                  <span className="text-lg font-black text-green-600">96%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 font-semibold">Avg. Response Time</span>
                  <span className="text-lg font-black text-blue-600">12 min</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 font-semibold">Customer Satisfaction</span>
                  <span className="text-lg font-black text-yellow-600">4.8/5.0</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t-2 border-purple-200">
                <p className="text-xs text-gray-600 text-center">
                  Keep up the great work! You're in the top 10% of professionals.
                </p>
              </div>
            </div>

            {/* Recent Reviews */}
            <RecentReviews
              reviews={professionalData.recentReviews}
              onViewAll={() => window.location.href = '/professional/reviews'}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
