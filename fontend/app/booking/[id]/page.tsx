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
  Loader2
} from 'lucide-react';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';

// TypeScript Interfaces
interface Booking {
  id: string;
  serviceType: string;
  category: string;
  bookingId: string;
  date: string;
  time: string;
  status: 'scheduled' | 'confirmed' | 'assigned' | 'on-the-way' | 'ongoing' | 'completed' | 'cancelled';
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

// Sample Data
const sampleBooking: Booking = {
  id: 'ELX-824412',
  serviceType: 'Electrical — Fan Repair',
  category: 'Electrical',
  bookingId: '#ELX-824412',
  date: '12 Oct 2025',
  time: '3:00 PM – 4:30 PM',
  status: 'scheduled',
  otp: '64382',
  professional: {
    name: 'Rahul Das',
    role: 'Electrician',
    image: '/professionals/rahul.jpg',
    rating: 4.9,
    reviews: 120,
    experience: 7,
    skills: ['Wiring', 'appliance repair', 'short circuit fixing'],
    verified: true,
    phone: '+91 98765 43210'
  },
  serviceDetails: {
    description: 'Fan not rotating properly, Possible motor replacement, Noise issue',
    itemsProvided: ['Ladder', 'Basic tools (optional)'],
    photos: ['/uploads/fan1.jpg', '/uploads/fan2.jpg', '/uploads/fan3.jpg']
  },
  payment: {
    serviceCharge: 300,
    platformFee: 20,
    gst: 30,
    total: 350,
    method: 'GPay / UPI',
    transactionId: '#TXN-456789'
  },
  cancellationPolicy: {
    freeCancellationBefore: 'technician arrives',
    feeAfterArrival: 80
  },
  timeline: [
    { stage: 'Booking Confirmed', completed: true, timestamp: '12 Oct, 2:30 PM' },
    { stage: 'Professional Assigned', completed: true, timestamp: '12 Oct, 2:35 PM' },
    { stage: 'Professional on the Way', completed: false },
    { stage: 'Work Started', completed: false },
    { stage: 'Work Completed', completed: false }
  ],
  location: 'HSR Layout, Bangalore',
  safety: {
    idVerified: true,
    backgroundChecked: true,
    covidSafe: true,
    toolsSanitized: true
  }
};

export default function BookingDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [booking, setBooking] = useState<Booking>(sampleBooking);
  const [isLoading, setIsLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // Get status color and label
  const getStatusBadge = (status: string) => {
    const badges: { [key: string]: { color: string; bg: string; label: string; emoji: string } } = {
      'scheduled': { color: 'text-yellow-700', bg: 'bg-yellow-100', label: 'Scheduled', emoji: '🟡' },
      'confirmed': { color: 'text-blue-700', bg: 'bg-blue-100', label: 'Confirmed', emoji: '🔵' },
      'on-the-way': { color: 'text-purple-700', bg: 'bg-purple-100', label: 'On the Way', emoji: '🟣' },
      'ongoing': { color: 'text-blue-700', bg: 'bg-blue-100', label: 'Ongoing', emoji: '🔵' },
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

  const handleCall = () => {
    window.location.href = `tel:${booking.professional.phone}`;
  };

  const handleChat = () => {
    router.push(`/chat/${booking.id}`);
  };

  const handleCancelBooking = () => {
    setShowCancelModal(true);
  };

  const confirmCancellation = () => {
    // API call to cancel booking
    console.log('Cancelling booking:', booking.id);
    setShowCancelModal(false);
    router.push('/order-history');
  };

  const handleSubmitReview = () => {
    // API call to submit review
    console.log('Submitting review:', { rating, reviewText });
    setShowReviewModal(false);
  };

  const handleDownloadInvoice = () => {
    // API call to download invoice
    console.log('Downloading invoice for:', booking.id);
  };

  const statusBadge = getStatusBadge(booking.status);
  const showOTP = ['scheduled', 'confirmed', 'assigned', 'on-the-way'].includes(booking.status);
  const showReview = booking.status === 'completed';
  const canCancel = !['completed', 'cancelled', 'ongoing'].includes(booking.status);

  return (
    <div className="min-h-screen bg-[#F7F9FC] pb-24">
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

        {/* 7. Cancellation Policy Card */}
        {canCancel && (
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
                disabled={rating === 0}
                className="w-full mt-4 bg-[#00C28C] text-white py-3 rounded-xl font-semibold hover:bg-[#00A876] transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ThumbsUp className="w-5 h-5" />
                Submit Review
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

          <button className="flex flex-col items-center gap-1 text-gray-600 hover:text-[#0066FF] transition-colors">
            <HelpCircle className="w-6 h-6" />
            <span className="text-xs font-medium">Support</span>
          </button>

          {canCancel && (
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

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowCancelModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Cancel Booking?</h3>
              <p className="text-gray-600">
                Are you sure you want to cancel this booking? This action cannot be undone.
              </p>
              {booking.status !== 'scheduled' && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-800">
                    <span className="font-semibold">Note:</span> A cancellation fee of ₹{booking.cancellationPolicy.feeAfterArrival} may apply.
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Keep Booking
              </button>
              <button
                onClick={confirmCancellation}
                className="flex-1 bg-[#FF4D4D] text-white py-3 rounded-xl font-semibold hover:bg-[#E63939] transition-colors"
              >
                Yes, Cancel
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
    </div>
  );
}
