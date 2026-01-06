'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  HelpCircle, 
  Zap, 
  Calendar, 
  Clock, 
  Phone, 
  MessageCircle, 
  Shield, 
  Star,
  CheckCircle,
  Circle,
  Lock,
  AlertTriangle,
  Download,
  FileText,
  Edit3,
  MapPin,
  Award,
  Wrench,
  ThumbsUp,
  XCircle,
  ChevronRight,
  Camera,
  User,
  CreditCard,
  Package,
  Loader2,
  RefreshCw,
  Info,
  Bell,
  Key
} from 'lucide-react';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { getBookingById, cancelBooking, rateBooking, Booking as APIBooking } from '@/utils/bookings';
import { getAccessToken } from '@/utils/auth';
import { useBookingUpdates } from '@/utils/BookingSocketContext';

// API Base URL for images
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000';

// TypeScript Interfaces
interface Booking {
  id: string;
  serviceType: string;
  category: string;
  bookingId: string;
  date: string;
  time: string;
  status: 'scheduled' | 'confirmed' | 'accepted' | 'assigned' | 'on-the-way' | 'ongoing' | 'completed' | 'cancelled';
  otp: string;
  professional: {
    name: string;
    role: string;
    image: string;
    rating: number;
    reviews: number;
    experience: number;
    skills: string[];
    verified: boolean;
    phone: string;
  };
  serviceDetails: {
    description: string;
    itemsProvided: string[];
    photos: string[];
  };
  payment: {
    serviceCharge: number;
    platformFee: number;
    gst: number;
    total: number;
    method: string;
    transactionId: string;
  };
  cancellationPolicy: {
    freeCancellationBefore: string;
    feeAfterArrival: number;
  };
  timeline: {
    stage: string;
    completed: boolean;
    timestamp?: string;
  }[];
  location: string;
  safety: {
    idVerified: boolean;
    backgroundChecked: boolean;
    covidSafe: boolean;
    toolsSanitized: boolean;
  };
}

export default function BookingDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [realtimeOTP, setRealtimeOTP] = useState<string | null>(null);
  
  // Real-time booking updates
  const bookingId = params.id as string;
  const { status: realtimeStatus, otp: socketOTP, otpPending, isConnected } = useBookingUpdates(bookingId);

  // Fetch booking details
  useEffect(() => {
    const token = getAccessToken();
    setIsAuthenticated(!!token);

    const fetchBooking = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const bookingId = Array.isArray(params.id) ? params.id[0] : params.id;
        
        if (!bookingId) {
          setError('Invalid booking ID');
          setIsLoading(false);
          return;
        }
        
        const response = await getBookingById(bookingId);
        
        // Map API response to UI format
        const mappedBooking: Booking = {
          id: response.booking.id,
          serviceType: `${response.booking.category} — ${response.booking.service_name}`,
          category: response.booking.category,
          bookingId: `#${response.booking.booking_id}`,
          date: formatDate(response.booking.date),
          time: response.booking.time,
          status: mapStatus(response.booking.status),
          otp: response.booking.otp || '',
          professional: {
            name: response.booking.professional?.name || 'Assigned Professional',
            role: response.booking.category,
            image: getProfessionalPhoto(response.booking.professional?.photo),
            rating: response.booking.professional?.rating || 4.5,
            reviews: 120,
            experience: 7,
            skills: [],
            verified: true,
            phone: response.booking.professional?.phone || ''
          },
          serviceDetails: {
            description: response.booking.notes || 'Service details',
            itemsProvided: [],
            photos: []
          },
          payment: {
            serviceCharge: response.booking.price || 0,
            platformFee: 0,
            gst: 0,
            total: response.booking.price || 0,
            method: response.booking.payment_method || 'Online',
            transactionId: '#TXN-000000'
          },
          cancellationPolicy: {
            freeCancellationBefore: 'technician arrives',
            feeAfterArrival: 80
          },
          timeline: generateTimeline(response.booking.status),
          location: response.booking.address_display || 'Address not specified',
          safety: {
            idVerified: true,
            backgroundChecked: true,
            covidSafe: true,
            toolsSanitized: true
          }
        };
        
        setBooking(mappedBooking);
      } catch (err) {
        console.error('Error fetching booking:', err);
        setError(err instanceof Error ? err.message : 'Failed to load booking details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooking();
  }, [params.id]);

  // Handle real-time status updates
  useEffect(() => {
    if (realtimeStatus && booking) {
      // Map real-time status to booking status
      const statusMapping: { [key: string]: Booking['status'] } = {
        'confirmed': 'confirmed',
        'accepted': 'confirmed',
        'ongoing': 'ongoing',
        'completed': 'completed',
        'cancelled': 'cancelled',
      };
      
      const mappedStatus = statusMapping[realtimeStatus];
      if (mappedStatus && mappedStatus !== booking.status) {
        setBooking(prev => prev ? { ...prev, status: mappedStatus, timeline: generateTimeline(realtimeStatus) } : null);
      }
    }
  }, [realtimeStatus, booking]);

  // Handle OTP request from professional
  useEffect(() => {
    if (otpPending && socketOTP) {
      setRealtimeOTP(socketOTP);
      setShowOTPModal(true);
    }
  }, [otpPending, socketOTP]);

  // Helper functions
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const mapStatus = (apiStatus: string): Booking['status'] => {
    const statusMap: { [key: string]: Booking['status'] } = {
      'pending': 'scheduled',
      'confirmed': 'confirmed',
      'accepted': 'confirmed',
      'upcoming': 'scheduled',
      'ongoing': 'ongoing',
      'completed': 'completed',
      'cancelled': 'cancelled'
    };
    return statusMap[apiStatus] || 'scheduled';
  };

  const generateTimeline = (status: string) => {
    const stages = [
      { stage: 'Booking Confirmed', completed: ['confirmed', 'accepted', 'upcoming', 'ongoing', 'completed'].includes(status) },
      { stage: 'Professional Accepted', completed: ['accepted', 'ongoing', 'completed'].includes(status) },
      { stage: 'Professional Arrived (OTP)', completed: ['ongoing', 'completed'].includes(status) },
      { stage: 'Work Started', completed: ['ongoing', 'completed'].includes(status) },
      { stage: 'Work Completed', completed: status === 'completed' }
    ];
    return stages;
  };

  const getProfessionalPhoto = (photo?: string) => {
    if (!photo) return 'https://ui-avatars.com/api/?name=Professional&size=80&background=0066FF&color=fff';
    if (photo.startsWith('http')) return photo;
    return `${API_BASE_URL}${photo}`;
  };

  // Get status color and label
  const getStatusBadge = (status: string) => {
    const badges: { [key: string]: { color: string; bg: string; label: string; emoji: string } } = {
      'scheduled': { color: 'text-yellow-700', bg: 'bg-yellow-100', label: 'Scheduled', emoji: '🟡' },
      'confirmed': { color: 'text-blue-700', bg: 'bg-blue-100', label: 'Confirmed', emoji: '🔵' },
      'accepted': { color: 'text-cyan-700', bg: 'bg-cyan-100', label: 'Accepted', emoji: '✅' },
      'on-the-way': { color: 'text-purple-700', bg: 'bg-purple-100', label: 'On the Way', emoji: '🟣' },
      'ongoing': { color: 'text-orange-700', bg: 'bg-orange-100', label: 'Work Started', emoji: '🔶' },
      'completed': { color: 'text-green-700', bg: 'bg-green-100', label: 'Completed', emoji: '🟢' },
      'cancelled': { color: 'text-red-700', bg: 'bg-red-100', label: 'Cancelled', emoji: '🔴' }
    };
    return badges[status] || badges['scheduled'];
  };

  const getServiceIcon = (category: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      'Electrical': <Zap className="w-5 h-5" />,
      'Plumbing': <Wrench className="w-5 h-5" />,
      'Appliance': <Package className="w-5 h-5" />
    };
    return icons[category] || <Wrench className="w-5 h-5" />;
  };

  // Check if user can reschedule (work not started and 10+ min before scheduled time)
  const canReschedule = () => {
    if (!booking) return false;
    
    // Can only reschedule if status is scheduled/confirmed (not started yet)
    const normalizedStatus = booking.status.toLowerCase();
    if (!['scheduled', 'confirmed', 'pending'].includes(normalizedStatus)) return false;
    
    // Check if work has started by looking at timeline
    const workStarted = booking.timeline.some(t => 
      (t.stage === 'Work Started' || t.stage === 'In Progress') && t.completed
    );
    
    if (workStarted) return false;
    
    // Check if it's 10+ minutes before scheduled time
    try {
      // Get the raw date and time from the API response
      // The booking.date might be formatted already, so we need the original date
      const dateMatch = booking.date.match(/\d{1,2}\s+\w+\s+\d{4}/);
      const timeMatch = booking.time.match(/\d{1,2}:\d{2}\s*(?:AM|PM)?/i);
      
      if (!dateMatch || !timeMatch) {
        console.log('Date/time format issue:', { date: booking.date, time: booking.time });
        return true; // Allow reschedule if we can't parse the date
      }
      
      // Parse the date and time properly
      const dateStr = dateMatch[0];
      const timeStr = timeMatch[0];
      const bookingDateTime = new Date(`${dateStr} ${timeStr}`);
      
      if (isNaN(bookingDateTime.getTime())) {
        console.log('Invalid date/time:', { dateStr, timeStr });
        return true; // Allow reschedule if date is invalid
      }
      
      const now = new Date();
      const minutesUntilBooking = (bookingDateTime.getTime() - now.getTime()) / (1000 * 60);
      
      console.log('Reschedule check:', { 
        bookingDateTime: bookingDateTime.toISOString(), 
        now: now.toISOString(), 
        minutesUntil: minutesUntilBooking 
      });
      
      return minutesUntilBooking >= 10;
    } catch (error) {
      console.error('Error checking reschedule time:', error);
      return true; // Allow reschedule if there's an error
    }
  };

  // Check if user can rebook (after cancelled or completed)
  const canRebook = () => {
    if (!booking) return false;
    return ['cancelled', 'completed'].includes(booking.status);
  };

  const handleCall = () => {
    if (booking) {
      window.location.href = `tel:${booking.professional.phone}`;
    }
  };

  const handleChat = () => {
    if (booking) {
      router.push(`/messages/${booking.id}`);
    }
  };

  const handleRebook = () => {
    if (!booking) return;
    
    // Navigate to booking flow or service page to rebook
    router.push(`/service`);
  };

  const handleReschedule = () => {
    setShowRescheduleModal(true);
  };

  const confirmReschedule = async () => {
    if (!booking || !rescheduleDate || !rescheduleTime) {
      alert('Please select both date and time');
      return;
    }
    
    try {
      setIsRescheduling(true);
      // Call updateBooking API with new date and time
      const { updateBooking } = await import('@/utils/bookings');
      await updateBooking(booking.id, {
        scheduled_date: rescheduleDate,
        scheduled_time: rescheduleTime
      });
      
      setShowRescheduleModal(false);
      window.location.reload();
    } catch (err) {
      console.error('Error rescheduling booking:', err);
      alert(err instanceof Error ? err.message : 'Failed to reschedule booking');
    } finally {
      setIsRescheduling(false);
    }
  };

  const handleCancelBooking = () => {
    setShowCancelModal(true);
  };

  const confirmCancellation = async () => {
    if (!booking) return;
    
    try {
      setIsCancelling(true);
      await cancelBooking(booking.id, cancelReason);
      setShowCancelModal(false);
      router.push('/booking');
    } catch (err) {
      console.error('Error cancelling booking:', err);
      alert(err instanceof Error ? err.message : 'Failed to cancel booking');
    } finally {
      setIsCancelling(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!booking || rating === 0) return;
    
    try {
      setIsSubmittingReview(true);
      await rateBooking(booking.id, rating, reviewText);
      setShowReviewModal(false);
      window.location.reload();
    } catch (err) {
      console.error('Error submitting review:', err);
      alert(err instanceof Error ? err.message : 'Failed to submit review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleDownloadInvoice = () => {
    if (booking) {
      console.log('Downloading invoice for:', booking.id);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#0066FF] mx-auto mb-4" />
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  // Authentication required
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <Lock className="w-16 h-16 text-[#0066FF] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
          <p className="text-gray-600 mb-6">Please login to view booking details</p>
          <button
            onClick={() => router.push('/auth')}
            className="w-full bg-[#0066FF] text-white py-3 rounded-xl font-semibold hover:bg-[#0052CC]"
          >
            Login to Continue
          </button>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !booking) {
    return (
      <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <AlertTriangle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Booking</h2>
          <p className="text-gray-600 mb-6">{error || 'Booking not found'}</p>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/booking')}
              className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50"
            >
              View All Bookings
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex-1 bg-[#0066FF] text-white py-3 rounded-xl font-semibold hover:bg-[#0052CC]"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const statusBadge = getStatusBadge(booking.status);
  const showOTP = ['scheduled', 'confirmed', 'assigned', 'on-the-way'].includes(booking.status);
  const showReview = booking.status === 'completed';
  const canCancel = !['completed', 'cancelled', 'ongoing'].includes(booking.status);

  return (
    <div className="min-h-screen bg-[#F7F9FC] pb-24">{/* Rest of the JSX remains the same */}
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Booking Details</h1>
          <button 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Help"
          >
            <HelpCircle className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
        {/* 1. Booking Summary Card */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#0066FF]/10 rounded-xl flex items-center justify-center text-[#0066FF]">
                {getServiceIcon(booking.category)}
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">{booking.serviceType}</h2>
                <p className="text-sm text-gray-600">Booking ID: {booking.bookingId}</p>
              </div>
            </div>
            <span className={`${statusBadge.bg} ${statusBadge.color} px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1`}>
              <span>{statusBadge.emoji}</span>
              {statusBadge.label}
            </span>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#0066FF]" />
              <span>{booking.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#0066FF]" />
              <span>{booking.time}</span>
            </div>
          </div>
        </div>

        {/* 2. Professional Details Card */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wide">Professional Details</h3>
          
          <div className="flex items-start gap-4 mb-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-lg">
                <Image
                  src={booking.professional.image}
                  alt={booking.professional.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
              {booking.professional.verified && (
                <>
                  <div className="absolute -top-1 -right-1 w-7 h-7 bg-[#0066FF] rounded-full flex items-center justify-center border-2 border-white shadow-md">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#00C28C] rounded-full flex items-center justify-center border-2 border-white shadow-md">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                </>
              )}
            </div>

            <div className="flex-1">
              <h4 className="text-xl font-bold text-gray-900 mb-1">{booking.professional.name}</h4>
              <p className="text-sm text-gray-600 mb-2">{booking.professional.role}</p>
              <div className="flex items-center gap-1 mb-2">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="font-semibold text-gray-900">{booking.professional.rating}</span>
                <span className="text-sm text-gray-600">({booking.professional.reviews} reviews)</span>
              </div>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Experience:</span> {booking.professional.experience} years
              </p>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-500 mb-2">SKILLS</p>
            <div className="flex flex-wrap gap-2">
              {booking.professional.skills.map((skill, index) => (
                <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={handleCall}
              className="flex-1 bg-[#0066FF] text-white py-3 rounded-xl font-semibold hover:bg-[#0052CC] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
            >
              <Phone className="w-5 h-5" />
              Call Professional
            </button>
            <button 
              onClick={handleChat}
              className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Chat Now
            </button>
          </div>
        </div>

        {/* 3. OTP Verification Section */}
        {showOTP && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm p-5 border-2 border-[#0066FF]/20">
            <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">OTP Verification</h3>
            <p className="text-sm text-gray-600 mb-4">
              Share this OTP with the professional to begin the job
            </p>
            
            <div className="bg-white rounded-xl p-6 mb-4 text-center border-2 border-[#0066FF] shadow-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Lock className="w-5 h-5 text-[#0066FF]" />
                <p className="text-sm font-semibold text-gray-600">Your OTP:</p>
              </div>
              <p className="text-5xl font-bold text-[#0066FF] tracking-wider" style={{ fontFamily: 'monospace' }}>
                {booking.otp}
              </p>
            </div>

            <div className="flex items-start gap-2 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-yellow-800">
                <span className="font-semibold">Do not share</span> until the professional arrives.
              </p>
            </div>
          </div>
        )}

        {/* 4. Live Status Tracker */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wide">Live Status Tracker</h3>
          
          <div className="space-y-1">
            {booking.timeline.map((item, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    item.completed 
                      ? 'bg-[#00C28C] border-[#00C28C] text-white' 
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}>
                    {item.completed ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </div>
                  {index < booking.timeline.length - 1 && (
                    <div className={`w-0.5 h-12 ${item.completed ? 'bg-[#00C28C]' : 'bg-gray-300'}`}></div>
                  )}
                </div>
                
                <div className="flex-1 pb-8">
                  <p className={`font-semibold ${item.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                    {item.stage}
                  </p>
                  {item.timestamp && (
                    <p className="text-xs text-gray-500 mt-1">{item.timestamp}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Service Details Card */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wide">Service Details</h3>
          
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-500 mb-2">SERVICE DESCRIPTION</p>
            <p className="text-sm text-gray-700 leading-relaxed">
              {booking.serviceDetails.description}
            </p>
          </div>

          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-500 mb-2">ITEMS CUSTOMER PROVIDED</p>
            <div className="flex flex-wrap gap-2">
              {booking.serviceDetails.itemsProvided.map((item, index) => (
                <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 mb-3">PHOTOS UPLOADED BY CUSTOMER</p>
            <div className="grid grid-cols-3 gap-3">
              {booking.serviceDetails.photos.map((photo, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedPhoto(photo)}
                  className="relative aspect-square rounded-lg overflow-hidden bg-gray-200 hover:opacity-80 transition-opacity group"
                >
                  <Image
                    src={photo}
                    alt={`Service photo ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <Camera className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 6. Payment Details Card */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wide">Payment Details</h3>
          
          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Service Charge:</span>
              <span className="font-medium text-gray-900">₹{booking.payment.serviceCharge}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Platform Fee:</span>
              <span className="font-medium text-gray-900">₹{booking.payment.platformFee}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">GST:</span>
              <span className="font-medium text-gray-900">₹{booking.payment.gst}</span>
            </div>
            <div className="h-px bg-gray-200"></div>
            <div className="flex justify-between">
              <span className="font-bold text-gray-900">Total Paid:</span>
              <span className="font-bold text-[#0066FF] text-lg">₹{booking.payment.total}</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 mb-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Payment Method:</span>
              <span className="font-medium text-gray-900">{booking.payment.method}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Transaction ID:</span>
              <span className="font-medium text-gray-900">{booking.payment.transactionId}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={handleDownloadInvoice}
              className="flex-1 border-2 border-gray-300 text-gray-700 py-2.5 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Invoice
            </button>
            <button className="flex-1 border-2 border-gray-300 text-gray-700 py-2.5 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
              <FileText className="w-4 h-4" />
              Payment Summary
            </button>
          </div>
        </div>

        {/* Action Buttons Section */}
        {(canReschedule() || canRebook()) && (
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wide">Quick Actions</h3>
            
            <div className="flex flex-col gap-3">
              {canReschedule() && (
                <>
                  <button 
                    onClick={handleReschedule}
                    className="w-full bg-[#0066FF] text-white py-3 rounded-xl font-semibold hover:bg-[#0052CC] transition-colors flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Calendar className="w-5 h-5" />
                    Reschedule Booking
                  </button>
                  
                  <button 
                    onClick={handleCancelBooking}
                    className="w-full border-2 border-red-300 text-red-600 py-3 rounded-xl font-semibold hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-5 h-5" />
                    Cancel Booking
                  </button>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
                    <p className="text-xs text-blue-800">
                      <span className="font-semibold">Note:</span> You can reschedule or cancel free of charge if done at least 10 minutes before the scheduled time.
                    </p>
                  </div>
                </>
              )}
              
              {canRebook() && (
                <>
                  <button 
                    onClick={handleRebook}
                    className="w-full bg-gradient-to-r from-[#00BFA6] to-[#00A890] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-5 h-5" />
                    Rebook This Service
                  </button>
                  
                  <p className="text-xs text-gray-600 text-center">
                    {booking.status === 'completed' 
                      ? 'Loved the service? Book again with the same professional!'
                      : 'Need this service again? Rebook now!'}
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        {/* 7. Cancellation Policy Card */}
        {canCancel && !canReschedule() && (
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl shadow-sm p-5 border border-orange-200">
            <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-600" />
              Cancellation Policy
            </h3>
            
            <p className="text-sm text-gray-700 mb-4 leading-relaxed">
              <span className="font-semibold">⚠️ Free cancellation</span> if cancelled before {booking.cancellationPolicy.freeCancellationBefore}.<br/>
              After arrival: cancellation fee may apply (<span className="font-semibold">₹{booking.cancellationPolicy.feeAfterArrival}</span>).
            </p>

            <button 
              onClick={handleCancelBooking}
              className="w-full bg-[#FF4D4D] text-white py-3 rounded-xl font-semibold hover:bg-[#E63939] transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              <XCircle className="w-5 h-5" />
              Cancel Booking
            </button>
          </div>
        )}

        {/* 8. Review Section (After Completion) */}
        {showReview && (
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wide">Rate Your Experience</h3>
            
            <div className="text-center mb-4">
              <p className="text-gray-700 mb-4">How was your experience with {booking.professional.name}?</p>
              
              <div className="flex justify-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star 
                      className={`w-10 h-10 ${
                        star <= rating 
                          ? 'text-yellow-400 fill-yellow-400' 
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>

              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Write a review..."
                className="w-full border-2 border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#0066FF] focus:border-[#0066FF] resize-none"
                rows={4}
              ></textarea>

              <button 
                onClick={handleSubmitReview}
                disabled={rating === 0 || isSubmittingReview}
                className="w-full mt-4 bg-[#00C28C] text-white py-3 rounded-xl font-semibold hover:bg-[#00A876] transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmittingReview ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <ThumbsUp className="w-5 h-5" />
                    Submit Review
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* 9. Safety & Verification Section */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-sm p-5 border border-green-200">
          <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-600" />
            Safety & Verification
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            {booking.safety.idVerified && (
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-sm text-gray-700">Professional verified ID</span>
              </div>
            )}
            {booking.safety.backgroundChecked && (
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-sm text-gray-700">Background checked</span>
              </div>
            )}
            {booking.safety.covidSafe && (
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-sm text-gray-700">Covid-safe guidelines</span>
              </div>
            )}
            {booking.safety.toolsSanitized && (
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-sm text-gray-700">Tools sanitized</span>
              </div>
            )}
          </div>
        </div>

        {/* 10. Need Help Section */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wide">Need Help?</h3>
          
          <div className="space-y-2">
            <button className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-[#0066FF]" />
                <span className="font-medium text-gray-900">Chat with Support</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#0066FF]" />
                <span className="font-medium text-gray-900">Call Support</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-[#0066FF]" />
                <span className="font-medium text-gray-900">File Complaint</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-[#0066FF]" />
                <span className="font-medium text-gray-900">Visit Help Center</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex justify-around items-center">
          <button 
            onClick={handleCall}
            className="flex flex-col items-center gap-1 text-gray-600 hover:text-[#0066FF] transition-colors"
          >
            <Phone className="w-6 h-6" />
            <span className="text-xs font-medium">Call</span>
          </button>

          <button 
            onClick={handleChat}
            className="flex flex-col items-center gap-1 text-gray-600 hover:text-[#0066FF] transition-colors"
          >
            <MessageCircle className="w-6 h-6" />
            <span className="text-xs font-medium">Chat</span>
          </button>

          {canReschedule() && (
            <button 
              onClick={handleReschedule}
              className="flex flex-col items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <Calendar className="w-6 h-6" />
              <span className="text-xs font-medium">Reschedule</span>
            </button>
          )}

          {canRebook() && (
            <button 
              onClick={handleRebook}
              className="flex flex-col items-center gap-1 text-green-600 hover:text-green-700 transition-colors"
            >
              <RefreshCw className="w-6 h-6" />
              <span className="text-xs font-medium">Rebook</span>
            </button>
          )}

          {!canReschedule() && !canRebook() && (
            <button className="flex flex-col items-center gap-1 text-gray-600 hover:text-[#0066FF] transition-colors">
              <HelpCircle className="w-6 h-6" />
              <span className="text-xs font-medium">Support</span>
            </button>
          )}

          {canCancel && !canReschedule() && (
            <button 
              onClick={handleCancelBooking}
              className="flex flex-col items-center gap-1 text-red-600 hover:text-red-700 transition-colors"
            >
              <XCircle className="w-6 h-6" />
              <span className="text-xs font-medium">Cancel</span>
            </button>
          )}
        </div>
      </div>

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn" onClick={() => setShowRescheduleModal(false)}>
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] shadow-2xl transform transition-all flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Header - Fixed */}
            <div className="relative bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-3xl p-6 text-white flex-shrink-0">
              <button
                onClick={() => setShowRescheduleModal(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                  <Calendar className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Reschedule Booking</h3>
                  <p className="text-blue-100 text-sm">Update your service date & time</p>
                </div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 overflow-y-auto flex-1" style={{ scrollbarWidth: 'thin', scrollbarColor: '#0066FF #f3f4f6' }}>
              {/* Current Booking Info */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-4 mb-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Current Schedule</p>
                    <p className="text-base text-gray-900 font-semibold">{booking.date}</p>
                    <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                      <Clock className="w-4 h-4" />
                      {booking.time}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <Calendar className="w-6 h-6 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* New Schedule Section */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <RefreshCw className="w-4 h-4 text-[#0066FF]" />
                  </div>
                  <h4 className="font-bold text-gray-900">New Schedule</h4>
                </div>

                {/* Date Picker - Calendar Style */}
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    Select New Date
                  </label>
                  <div className="grid grid-cols-7 gap-2">
                    {/* Calendar Days */}
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <div key={day} className="text-center text-xs font-semibold text-gray-500 py-2">
                        {day}
                      </div>
                    ))}
                    {/* Generate next 14 days */}
                    {Array.from({ length: 14 }, (_, i) => {
                      const date = new Date();
                      date.setDate(date.getDate() + i);
                      const dateStr = date.toISOString().split('T')[0];
                      const isSelected = rescheduleDate === dateStr;
                      const dayOfWeek = date.getDay();
                      const isFirstDay = i === 0;
                      
                      return (
                        <React.Fragment key={i}>
                          {isFirstDay && Array.from({ length: dayOfWeek }, (_, j) => (
                            <div key={`empty-${j}`} />
                          ))}
                          <button
                            type="button"
                            onClick={() => setRescheduleDate(dateStr)}
                            className={`
                              relative p-2 rounded-xl text-sm font-medium transition-all
                              ${isSelected 
                                ? 'bg-[#0066FF] text-white shadow-lg scale-105' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                              }
                            `}
                          >
                            <div className="text-xs">{date.getDate()}</div>
                            {isSelected && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                            )}
                          </button>
                        </React.Fragment>
                      );
                    })}
                  </div>
                  {rescheduleDate && (
                    <div className="mt-3 text-center text-sm text-gray-600 font-medium">
                      Selected: {new Date(rescheduleDate + 'T00:00:00').toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                  )}
                </div>

                {/* Time Picker - Slot Style */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    Select New Time
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {/* Morning Slots */}
                    {['09:00', '10:00', '11:00', '12:00'].map((time) => {
                      const isSelected = rescheduleTime === time;
                      return (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setRescheduleTime(time)}
                          className={`
                            relative py-3 px-4 rounded-xl text-sm font-semibold transition-all
                            ${isSelected 
                              ? 'bg-[#0066FF] text-white shadow-lg scale-105 ring-2 ring-blue-300' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                            }
                          `}
                        >
                          {time}
                          {isSelected && (
                            <CheckCircle className="absolute -top-1 -right-1 w-5 h-5 text-green-500 bg-white rounded-full" />
                          )}
                        </button>
                      );
                    })}
                    
                    {/* Afternoon Slots */}
                    {['13:00', '14:00', '15:00', '16:00'].map((time) => {
                      const isSelected = rescheduleTime === time;
                      return (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setRescheduleTime(time)}
                          className={`
                            relative py-3 px-4 rounded-xl text-sm font-semibold transition-all
                            ${isSelected 
                              ? 'bg-[#0066FF] text-white shadow-lg scale-105 ring-2 ring-blue-300' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                            }
                          `}
                        >
                          {time}
                          {isSelected && (
                            <CheckCircle className="absolute -top-1 -right-1 w-5 h-5 text-green-500 bg-white rounded-full" />
                          )}
                        </button>
                      );
                    })}
                    
                    {/* Evening Slots */}
                    {['17:00', '18:00', '19:00', '20:00'].map((time) => {
                      const isSelected = rescheduleTime === time;
                      return (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setRescheduleTime(time)}
                          className={`
                            relative py-3 px-4 rounded-xl text-sm font-semibold transition-all
                            ${isSelected 
                              ? 'bg-[#0066FF] text-white shadow-lg scale-105 ring-2 ring-blue-300' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                            }
                          `}
                        >
                          {time}
                          {isSelected && (
                            <CheckCircle className="absolute -top-1 -right-1 w-5 h-5 text-green-500 bg-white rounded-full" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border-l-4 border-blue-500 rounded-xl p-4 mb-6">
                <div className="flex gap-3">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-blue-900 mb-1">Free Rescheduling</p>
                    <p className="text-xs text-blue-800 leading-relaxed">
                      You can reschedule your booking at no additional cost when done at least 10 minutes before the scheduled time. The professional will be notified immediately.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRescheduleModal(false)}
                  disabled={isRescheduling}
                  className="flex-1 border-2 border-gray-300 text-gray-700 py-3.5 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmReschedule}
                  disabled={isRescheduling || !rescheduleDate || !rescheduleTime}
                  className="flex-1 bg-gradient-to-r from-[#0066FF] to-[#0052CC] text-white py-3.5 rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  {isRescheduling ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Confirm Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowCancelModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Cancel Booking?</h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to cancel this booking?
              </p>
              
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Reason for cancellation (optional)"
                className="w-full border-2 border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#0066FF] focus:border-[#0066FF] resize-none mb-4"
                rows={3}
              />
              
              {booking.status !== 'scheduled' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-800">
                    <span className="font-semibold">Note:</span> A cancellation fee of ₹{booking.cancellationPolicy.feeAfterArrival} may apply.
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                disabled={isCancelling}
                className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Keep Booking
              </button>
              <button
                onClick={confirmCancellation}
                disabled={isCancelling}
                className="flex-1 bg-[#FF4D4D] text-white py-3 rounded-xl font-semibold hover:bg-[#E63939] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isCancelling ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  'Yes, Cancel'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Photo Viewer Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setSelectedPhoto(null)}>
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
          >
            <XCircle className="w-8 h-8 text-white" />
          </button>
          <div className="relative w-full max-w-4xl aspect-square">
            <Image
              src={selectedPhoto}
              alt="Service photo"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}

      {/* OTP Modal - Shown when professional arrives */}
      {showOTPModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-bounce-in">
            <div className="text-center">
              {/* Bell Icon Animation */}
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Bell className="w-10 h-10 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Professional Has Arrived! 🎉
              </h3>
              <p className="text-gray-600 mb-6">
                Share this OTP with the professional to start the work
              </p>
              
              {/* OTP Display */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-6 mb-6">
                <p className="text-sm text-gray-500 mb-2">Your OTP Code</p>
                <div className="flex justify-center gap-2">
                  {(realtimeOTP || booking?.otp || '').split('').map((digit, index) => (
                    <div
                      key={index}
                      className="w-12 h-14 bg-white border-2 border-blue-400 rounded-xl flex items-center justify-center shadow-lg"
                    >
                      <span className="text-2xl font-bold text-blue-600">{digit}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-3 flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3" />
                  Do not share with anyone except your professional
                </p>
              </div>
              
              {/* Real-time Connection Status */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                <span className="text-xs text-gray-500">
                  {isConnected ? 'Connected - Live Updates' : 'Reconnecting...'}
                </span>
              </div>
              
              <button
                onClick={() => setShowOTPModal(false)}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all"
              >
                Got it, Thanks!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Real-time Status Banner */}
      {isConnected && realtimeStatus && (
        <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-xl shadow-2xl z-40 animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <RefreshCw className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <p className="font-semibold">Status Updated</p>
              <p className="text-sm text-white/80">
                {realtimeStatus === 'accepted' && 'Professional has accepted your booking'}
                {realtimeStatus === 'ongoing' && 'Work has started'}
                {realtimeStatus === 'completed' && 'Work completed! Please rate your experience'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
