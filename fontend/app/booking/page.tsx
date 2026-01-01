'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  MapPin,
  User,
  DollarSign,
  Star,
  Phone,
  MessageCircle,
  Eye,
  XCircle,
  RefreshCw,
  Download,
  Search,
  Filter,
  Zap,
  Wrench,
  Package,
  Home as HomeIcon,
  ChevronRight,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  TrendingUp,
  Lock,
  LogIn,
  Loader2,
  X
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/app/Component/Navbar';
import Footer from '@/app/Component/Footer';
import { getAccessToken } from '@/utils/auth';
import { getUserBookings, cancelBooking, rateBooking, Booking } from '@/utils/bookings';

// API Base URL for images
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000';

export default function BookingHistoryPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [statusCounts, setStatusCounts] = useState({
    all: 0,
    pending: 0,
    confirmed: 0,
    upcoming: 0,
    ongoing: 0,
    completed: 0,
    cancelled: 0
  });
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'ongoing' | 'completed' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    category: 'all',
    dateRange: 'all',
    priceRange: 'all'
  });

  // Cancel Modal State
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellingBooking, setCancellingBooking] = useState<Booking | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

  // Rating Modal State
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingBooking, setRatingBooking] = useState<Booking | null>(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);

  // Fetch bookings from API
  const fetchBookings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getUserBookings({
        status: activeTab === 'all' ? undefined : activeTab,
        category: filters.category === 'all' ? undefined : filters.category,
        search: searchQuery || undefined,
        limit: 50
      });
      setBookings(response.bookings);
      setStatusCounts(response.status_counts);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch bookings');
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, filters.category, searchQuery]);

  // Check authentication and fetch bookings
  useEffect(() => {
    const token = getAccessToken();
    setIsAuthenticated(!!token);
    if (token) {
      fetchBookings();
    } else {
      setIsLoading(false);
    }
  }, [fetchBookings]);

  // Handle cancel booking
  const handleCancelBooking = async () => {
    if (!cancellingBooking) return;
    
    try {
      setIsCancelling(true);
      await cancelBooking(cancellingBooking.id, cancelReason);
      setShowCancelModal(false);
      setCancellingBooking(null);
      setCancelReason('');
      // Refresh bookings
      fetchBookings();
    } catch (err) {
      console.error('Error cancelling booking:', err);
      alert(err instanceof Error ? err.message : 'Failed to cancel booking');
    } finally {
      setIsCancelling(false);
    }
  };

  // Handle rate booking
  const handleRateBooking = async () => {
    if (!ratingBooking || selectedRating === 0) return;
    
    try {
      setIsSubmittingRating(true);
      await rateBooking(ratingBooking.id, selectedRating, reviewText);
      setShowRatingModal(false);
      setRatingBooking(null);
      setSelectedRating(0);
      setReviewText('');
      // Refresh bookings
      fetchBookings();
    } catch (err) {
      console.error('Error rating booking:', err);
      alert(err instanceof Error ? err.message : 'Failed to submit rating');
    } finally {
      setIsSubmittingRating(false);
    }
  };

  // Filter bookings based on active tab and search
  const filteredBookings = useMemo(() => {
    let filtered = bookings;

    // Filter by search query (additional client-side filtering)
    if (searchQuery) {
      filtered = filtered.filter(b =>
        b.booking_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.service_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.professional?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply additional filters
    if (filters.category !== 'all') {
      filtered = filtered.filter(b => b.category === filters.category);
    }

    return filtered;
  }, [bookings, searchQuery, filters]);

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    const badges = {
      'pending': { bg: 'bg-[#FFA500]', text: 'text-white', label: '🟠 Pending' },
      'confirmed': { bg: 'bg-[#00BFA6]', text: 'text-white', label: '✅ Confirmed' },
      'upcoming': { bg: 'bg-[#00BFA6]', text: 'text-white', label: '🟨 Upcoming' },
      'ongoing': { bg: 'bg-[#FF9F43]', text: 'text-white', label: '🟧 Ongoing' },
      'completed': { bg: 'bg-[#22C55E]', text: 'text-white', label: '🟩 Completed' },
      'cancelled': { bg: 'bg-[#EF4444]', text: 'text-white', label: '🟥 Cancelled' }
    };
    return badges[status as keyof typeof badges] || badges['pending'];
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      'Electrical': <Zap className="w-5 h-5 text-yellow-600" />,
      'Plumbing': <Wrench className="w-5 h-5 text-blue-600" />,
      'Cleaning': <HomeIcon className="w-5 h-5 text-green-600" />,
      'Appliance': <Package className="w-5 h-5 text-purple-600" />
    };
    return icons[category] || <Wrench className="w-5 h-5 text-gray-600" />;
  };

  // Get tab count from status_counts
  const getTabCount = (status: string) => {
    return statusCounts[status as keyof typeof statusCounts] || 0;
  };

  // Helper to get professional photo URL
  const getProfessionalPhoto = (professional?: Booking['professional']) => {
    if (!professional) return 'https://ui-avatars.com/api/?name=Unknown&size=80&background=1E2A5E&color=fff';
    if (professional.photo) {
      if (professional.photo.startsWith('http')) return professional.photo;
      return `${API_BASE_URL}${professional.photo}`;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(professional.name || 'Unknown')}&size=80&background=1E2A5E&color=fff`;
  };

  // Helper to format date
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F7FB]">
      {/* Navbar */}
      <Navbar 
        onNotificationClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
        isNotificationsOpen={isNotificationsOpen}
      />

      {/* Page Header */}
      <div className="pt-20 bg-gradient-to-br from-[#1E2A5E] to-[#00BFA6] text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">My Bookings</h1>
          <p className="text-white/80">Track your past, ongoing, and upcoming services</p>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E2A5E]"></div>
        </div>
      )}

      {/* Login Required Prompt */}
      {!isLoading && !isAuthenticated && (
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center max-w-2xl mx-auto border-2 border-gray-100">
            {/* Icon */}
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-[#1E2A5E] to-[#00BFA6] rounded-full flex items-center justify-center mb-6">
              <Lock className="w-10 h-10 text-white" />
            </div>
            
            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Login Required
            </h2>
            
            {/* Description */}
            <p className="text-gray-600 mb-8 text-lg">
              Please login to view your booking history and track your services.
            </p>

            {/* Login Button */}
            <Link 
              href="/auth"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-[#1E2A5E] to-[#00BFA6] text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <LogIn className="w-5 h-5" />
              <span>Login to Continue</span>
            </Link>

            {/* Additional Info */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-gray-500 text-sm mb-4">
                Don't have an account?
              </p>
              <Link 
                href="/auth"
                className="text-[#00BFA6] font-medium hover:underline"
              >
                Sign up now →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Only show when authenticated */}
      {!isLoading && isAuthenticated && (
        <>
      {/* Search & Filters Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-[70px] z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by booking ID, service, or professional..."
                className="w-full pl-11 pr-4 py-2.5 text-gray-700 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#00BFA6] transition"
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-2.5 bg-white border-2 border-gray-200 rounded-lg font-medium text-gray-700 hover:border-[#00BFA6] hover:text-[#00BFA6] transition flex items-center gap-2 justify-center"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="px-4 py-2 text-gray-700 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#00BFA6]"
                >
                  <option value="all">All Categories</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="Appliance">Appliance</option>
                </select>

                <select
                  value={filters.dateRange}
                  onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
                  className="px-4 py-2 border-2 text-gray-700 border-gray-200 rounded-lg focus:outline-none focus:border-[#00BFA6]"
                >
                  <option value="all">All Time</option>
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                  <option value="year">Last Year</option>
                </select>

                <select
                  value={filters.priceRange}
                  onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                  className="px-4 py-2 text-gray-700 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#00BFA6]"
                >
                  <option value="all">All Prices</option>
                  <option value="low">₹0 - ₹500</option>
                  <option value="mid">₹500 - ₹1000</option>
                  <option value="high">₹1000+</option>
                </select>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setFilters({ category: 'all', dateRange: 'all', priceRange: 'all' })}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto scrollbar-hide -mb-px">
            {[
              { key: 'all', label: 'All', icon: '🟦', color: '#1E2A5E' },
              { key: 'upcoming', label: 'Upcoming', icon: '🟨', color: '#00BFA6' },
              { key: 'ongoing', label: 'Ongoing', icon: '🟧', color: '#FF9F43' },
              { key: 'completed', label: 'Completed', icon: '🟩', color: '#22C55E' },
              { key: 'cancelled', label: 'Cancelled', icon: '🟥', color: '#EF4444' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-6 py-4 font-bold text-sm whitespace-nowrap transition-all relative ${
                  activeTab === tab.key
                    ? 'text-[#00BFA6]'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                  <span className="ml-1 px-2 py-0.5 bg-gray-100 rounded-full text-xs font-bold">
                    {getTabCount(tab.key)}
                  </span>
                </span>
                {activeTab === tab.key && (
                  <div
                    className="absolute bottom-0 left-0 right-0 h-1 rounded-t-full"
                    style={{ backgroundColor: tab.color }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Booking List */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-700">{error}</span>
            <button
              onClick={() => fetchBookings()}
              className="ml-auto text-red-600 hover:text-red-800 font-medium"
            >
              Retry
            </button>
          </div>
        )}

        {filteredBookings.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredBookings.map((booking) => {
              const statusBadge = getStatusBadge(booking.status);
              
              return (
                <div
                  key={booking.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => router.push(`/booking/${booking.id}`)}
                >
                  {/* Top Section */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        {getCategoryIcon(booking.category)}
                      </div>
                      <div>
                        <h3 className="font-bold text-[#1F2937] text-lg">{booking.service_name}</h3>
                        <p className="text-sm text-[#6B7280]">#{booking.booking_id}</p>
                      </div>
                    </div>
                    <span className={`${statusBadge.bg} ${statusBadge.text} px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap`}>
                      {statusBadge.label}
                    </span>
                  </div>

                  {/* Middle Section - Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Date & Time */}
                    <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                      <Calendar className="w-4 h-4 text-[#00BFA6]" />
                      <span>{formatDate(booking.date)} • {booking.time}</span>
                    </div>

                    {/* Address */}
                    <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                      <MapPin className="w-4 h-4 text-[#00BFA6]" />
                      <span className="truncate">{booking.address_display || 'Address not specified'}</span>
                    </div>

                    {/* Professional */}
                    <div className="flex items-center gap-2">
                      <img
                        src={getProfessionalPhoto(booking.professional)}
                        alt={booking.professional?.name || 'Professional'}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="text-sm">
                        <p className="font-medium text-[#1F2937]">{booking.professional?.name || 'Assigned Professional'}</p>
                        <p className="text-xs text-[#6B7280] flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                          {booking.professional?.rating?.toFixed(1) || '4.5'}
                        </p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="w-4 h-4 text-[#00BFA6]" />
                      <span className="font-bold text-[#1F2937]">₹{booking.price}</span>
                    </div>
                  </div>

                  {/* Bottom Section - Actions */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                    {/* Pending/Confirmed Actions */}
                    {(booking.status === 'pending' || booking.status === 'confirmed') && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/booking/${booking.id}`);
                          }}
                          className="flex-1 min-w-[120px] px-4 py-2 bg-[#00BFA6] text-white rounded-lg font-medium hover:bg-[#00A890] transition text-sm flex items-center justify-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setCancellingBooking(booking);
                            setShowCancelModal(true);
                          }}
                          className="px-4 py-2 border-2 border-red-200 text-red-600 rounded-lg font-medium hover:bg-red-50 transition text-sm flex items-center justify-center gap-2"
                        >
                          <XCircle className="w-4 h-4" />
                          Cancel
                        </button>
                        {booking.otp && (
                          <div className="w-full mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
                            <p className="text-xs text-blue-700 mb-1">OTP for Professional</p>
                            <p className="text-2xl font-bold text-blue-900 tracking-wider">{booking.otp}</p>
                          </div>
                        )}
                      </>
                    )}

                    {/* Upcoming Actions */}
                    {booking.status === 'upcoming' && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/booking/${booking.id}`);
                          }}
                          className="flex-1 min-w-[120px] px-4 py-2 bg-[#00BFA6] text-white rounded-lg font-medium hover:bg-[#00A890] transition text-sm flex items-center justify-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('Reschedule', booking.id);
                          }}
                          className="flex-1 min-w-[120px] px-4 py-2 border-2 border-gray-200 text-gray-700 rounded-lg font-medium hover:border-[#00BFA6] hover:text-[#00BFA6] transition text-sm flex items-center justify-center gap-2"
                        >
                          <RefreshCw className="w-4 h-4" />
                          Reschedule
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setCancellingBooking(booking);
                            setShowCancelModal(true);
                          }}
                          className="px-4 py-2 border-2 border-red-200 text-red-600 rounded-lg font-medium hover:bg-red-50 transition text-sm flex items-center justify-center gap-2"
                        >
                          <XCircle className="w-4 h-4" />
                          Cancel
                        </button>
                      </>
                    )}

                    {/* Ongoing Actions */}
                    {booking.status === 'ongoing' && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/booking/${booking.id}`);
                          }}
                          className="flex-1 min-w-[100px] px-4 py-2 bg-[#FF9F43] text-white rounded-lg font-medium hover:bg-[#FF8C1F] transition text-sm flex items-center justify-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Track
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (booking.professional?.phone) {
                              window.location.href = `tel:${booking.professional.phone}`;
                            }
                          }}
                          className="flex-1 min-w-[100px] px-4 py-2 border-2 border-gray-200 text-gray-700 rounded-lg font-medium hover:border-[#00BFA6] hover:text-[#00BFA6] transition text-sm flex items-center justify-center gap-2"
                        >
                          <Phone className="w-4 h-4" />
                          Call
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/messages/${booking.id}`);
                          }}
                          className="flex-1 min-w-[100px] px-4 py-2 border-2 border-gray-200 text-gray-700 rounded-lg font-medium hover:border-[#00BFA6] hover:text-[#00BFA6] transition text-sm flex items-center justify-center gap-2"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Chat
                        </button>
                        {booking.otp && (
                          <div className="w-full mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
                            <p className="text-xs text-blue-700 mb-1">OTP for Professional</p>
                            <p className="text-2xl font-bold text-blue-900 tracking-wider">{booking.otp}</p>
                          </div>
                        )}
                      </>
                    )}

                    {/* Completed Actions */}
                    {booking.status === 'completed' && (
                      <>
                        {booking.rating && (
                          <div className="w-full mb-2 flex items-center gap-2 text-sm">
                            <span className="text-[#6B7280]">Your Rating:</span>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < booking.rating!
                                      ? 'fill-yellow-500 text-yellow-500'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('Download invoice', booking.id);
                          }}
                          className="flex-1 min-w-[120px] px-4 py-2 bg-[#22C55E] text-white rounded-lg font-medium hover:bg-[#16A34A] transition text-sm flex items-center justify-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Invoice
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Navigate to booking flow with professional and service pre-selected
                            if (booking.professional?.id) {
                              router.push(`/booking-flow/${booking.professional.id}?serviceId=${booking.service?.id || ''}`);
                            }
                          }}
                          className="flex-1 min-w-[120px] px-4 py-2 border-2 border-gray-200 text-gray-700 rounded-lg font-medium hover:border-[#00BFA6] hover:text-[#00BFA6] transition text-sm flex items-center justify-center gap-2"
                        >
                          <RefreshCw className="w-4 h-4" />
                          Rebook
                        </button>
                        {!booking.rating && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setRatingBooking(booking);
                              setShowRatingModal(true);
                            }}
                            className="flex-1 min-w-[120px] px-4 py-2 border-2 border-gray-200 text-gray-700 rounded-lg font-medium hover:border-[#00BFA6] hover:text-[#00BFA6] transition text-sm flex items-center justify-center gap-2"
                          >
                            <Star className="w-4 h-4" />
                            Rate
                          </button>
                        )}
                      </>
                    )}

                    {/* Cancelled Actions */}
                    {booking.status === 'cancelled' && (
                      <>
                        {booking.cancellation_reason && (
                          <div className="w-full mb-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-xs text-red-700 mb-1">Cancellation Reason</p>
                            <p className="text-sm font-medium text-red-900">{booking.cancellation_reason}</p>
                            {booking.refund_status && (
                              <p className="text-xs text-red-600 mt-2">
                                <CheckCircle className="w-3 h-3 inline mr-1" />
                                {booking.refund_status}
                              </p>
                            )}
                          </div>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (booking.professional?.id) {
                              router.push(`/booking-flow/${booking.professional.id}?serviceId=${booking.service?.id || ''}`);
                            }
                          }}
                          className="flex-1 min-w-[120px] px-4 py-2 bg-[#00BFA6] text-white rounded-lg font-medium hover:bg-[#00A890] transition text-sm flex items-center justify-center gap-2"
                        >
                          <RefreshCw className="w-4 h-4" />
                          Rebook Service
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/booking/${booking.id}`);
                          }}
                          className="px-4 py-2 border-2 border-gray-200 text-gray-700 rounded-lg font-medium hover:border-[#00BFA6] hover:text-[#00BFA6] transition text-sm flex items-center justify-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Details
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // Empty State
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <FileText className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-[#1F2937] mb-2">
              {searchQuery ? 'No bookings found' : 'No bookings yet'}
            </h3>
            <p className="text-[#6B7280] mb-6 text-center max-w-md">
              {searchQuery
                ? 'Try adjusting your search or filters'
                : 'Start booking services to see your booking history here'}
            </p>
            <Link
              href="/service"
              className="px-8 py-3 bg-gradient-to-r from-[#1E2A5E] to-[#00BFA6] text-white rounded-full font-bold hover:shadow-lg transition"
            >
              Book a Service
            </Link>
          </div>
        )}
      </div>
        </>
      )}

      {/* Cancel Booking Modal */}
      {showCancelModal && cancellingBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Cancel Booking</h3>
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancellingBooking(null);
                  setCancelReason('');
                }}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-gray-600 mb-4">
              Are you sure you want to cancel the booking for <span className="font-semibold">{cancellingBooking.service_name}</span>?
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for cancellation (optional)
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Please provide a reason..."
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#00BFA6] resize-none"
                rows={3}
              />
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-yellow-800">
                <AlertCircle className="w-4 h-4 inline mr-2" />
                Cancellation may attract charges based on timing. Refunds will be processed within 5-7 business days.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancellingBooking(null);
                  setCancelReason('');
                }}
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
              >
                Keep Booking
              </button>
              <button
                onClick={handleCancelBooking}
                disabled={isCancelling}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isCancelling ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4" />
                    Cancel Booking
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rating Modal */}
      {showRatingModal && ratingBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Rate Your Experience</h3>
              <button
                onClick={() => {
                  setShowRatingModal(false);
                  setRatingBooking(null);
                  setSelectedRating(0);
                  setReviewText('');
                }}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="text-center mb-6">
              <p className="text-gray-600 mb-2">How was your experience with</p>
              <p className="font-semibold text-gray-900">{ratingBooking.professional?.name || 'the professional'}?</p>
              <p className="text-sm text-gray-500">{ratingBooking.service_name}</p>
            </div>
            
            {/* Star Rating */}
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setSelectedRating(star)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-10 h-10 ${
                      star <= selectedRating
                        ? 'fill-yellow-500 text-yellow-500'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            
            {/* Rating Labels */}
            {selectedRating > 0 && (
              <p className="text-center text-sm font-medium text-gray-700 mb-4">
                {selectedRating === 1 && 'Poor'}
                {selectedRating === 2 && 'Fair'}
                {selectedRating === 3 && 'Good'}
                {selectedRating === 4 && 'Very Good'}
                {selectedRating === 5 && 'Excellent!'}
              </p>
            )}
            
            {/* Review Text */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Write a review (optional)
              </label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience..."
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#00BFA6] resize-none"
                rows={3}
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRatingModal(false);
                  setRatingBooking(null);
                  setSelectedRating(0);
                  setReviewText('');
                }}
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRateBooking}
                disabled={isSubmittingRating || selectedRating === 0}
                className="flex-1 px-4 py-3 bg-[#00BFA6] text-white rounded-lg font-medium hover:bg-[#00A890] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmittingRating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Star className="w-4 h-4" />
                    Submit Rating
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
