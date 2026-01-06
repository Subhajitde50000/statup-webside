'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  ArrowLeft,
  Clock, 
  MapPin,
  Star,
  Phone,
  MessageCircle,
  Navigation,
  Play,
  AlertCircle,
  CheckCircle,
  Loader2,
  Key,
  Send
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProfessionalNavbar from '../../components/ProfessionalNavbar';
import { getProfessionalBookings, sendOTPRequest, startBooking, completeBooking, Booking } from '@/utils/bookings';
import { useBookingSocket } from '@/utils/BookingSocketContext';

interface OngoingJob {
  id: string;
  customerName: string;
  customerPhoto: string;
  customerRating: number;
  customerPhone: string;
  service: string;
  description: string;
  startTime: string;
  expectedDuration: string;
  address: string;
  distance: number;
  earnings: number;
  status: 'otp-pending' | 'in-progress' | 'documentation';
  elapsedTime?: string;
  isUrgent?: boolean;
}

export default function OngoingJobsPage() {
  const router = useRouter();
  const { isConnected } = useBookingSocket();
  
  const [ongoingJobs, setOngoingJobs] = useState<OngoingJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [otpInput, setOtpInput] = useState('');
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const [isSendingOTP, setIsSendingOTP] = useState<string | null>(null);
  const [isCompleting, setIsCompleting] = useState<string | null>(null);

  // Fetch ongoing bookings
  const fetchOngoingJobs = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get accepted and ongoing bookings
      const [acceptedResponse, ongoingResponse] = await Promise.all([
        getProfessionalBookings({ status: 'accepted' }),
        getProfessionalBookings({ status: 'ongoing' })
      ]);
      
      const allBookings = [...acceptedResponse.bookings, ...ongoingResponse.bookings];
      
      // Transform to OngoingJob format
      const transformedJobs: OngoingJob[] = allBookings.map((booking: Booking) => ({
        id: booking.id,
        customerName: booking.user?.name || 'Customer',
        customerPhoto: `https://ui-avatars.com/api/?name=${encodeURIComponent(booking.user?.name || 'Customer')}&size=80&background=1E2A5E&color=fff`,
        customerRating: 4.5,
        customerPhone: booking.user?.phone || '',
        service: booking.service_name || booking.service_type,
        description: booking.notes || 'Service request',
        startTime: booking.time,
        expectedDuration: '30-60 min',
        address: booking.address_display,
        distance: 0,
        earnings: booking.price,
        status: booking.status === 'ongoing' ? 'in-progress' : 'otp-pending',
        isUrgent: false,
        elapsedTime: booking.started_at ? calculateElapsed(booking.started_at) : undefined
      }));
      
      setOngoingJobs(transformedJobs);
    } catch (err) {
      console.error('Error fetching ongoing jobs:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch jobs');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOngoingJobs();
  }, [fetchOngoingJobs]);

  // Calculate elapsed time
  const calculateElapsed = (startedAt: string): string => {
    const start = new Date(startedAt);
    const now = new Date();
    const diff = now.getTime() - start.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle send OTP request
  const handleSendOTP = async (jobId: string) => {
    setIsSendingOTP(jobId);
    try {
      await sendOTPRequest(jobId);
      alert('OTP request sent to customer. They will share it with you.');
    } catch (err) {
      console.error('Error sending OTP:', err);
      alert(err instanceof Error ? err.message : 'Failed to send OTP request');
    } finally {
      setIsSendingOTP(null);
    }
  };

  // Handle verify OTP and start work
  const handleVerifyOTP = async () => {
    if (!selectedJobId || !otpInput) return;
    
    setIsVerifyingOTP(true);
    try {
      await startBooking(selectedJobId, otpInput);
      setShowOTPModal(false);
      setOtpInput('');
      setSelectedJobId(null);
      fetchOngoingJobs(); // Refresh the list
    } catch (err) {
      console.error('Error verifying OTP:', err);
      alert(err instanceof Error ? err.message : 'Invalid OTP. Please try again.');
    } finally {
      setIsVerifyingOTP(false);
    }
  };

  // Handle complete job
  const handleCompleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to mark this job as completed?')) return;
    
    setIsCompleting(jobId);
    try {
      await completeBooking(jobId);
      router.push('/professional/bookings/completed');
    } catch (err) {
      console.error('Error completing job:', err);
      alert(err instanceof Error ? err.message : 'Failed to complete job');
    } finally {
      setIsCompleting(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'otp-pending':
        return (
          <span className="bg-orange-100 text-orange-700 text-xs font-black px-3 py-1 rounded-full border-2 border-orange-300">
            🔒 OTP Pending
          </span>
        );
      case 'in-progress':
        return (
          <span className="bg-purple-100 text-purple-700 text-xs font-black px-3 py-1 rounded-full border-2 border-purple-300 animate-pulse">
            ⏱️ In Progress
          </span>
        );
      case 'documentation':
        return (
          <span className="bg-blue-100 text-blue-700 text-xs font-black px-3 py-1 rounded-full border-2 border-blue-300">
            📸 Documentation
          </span>
        );
      default:
        return null;
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'otp-pending':
        return 'Verify OTP to start work';
      case 'in-progress':
        return 'Work in progress';
      case 'documentation':
        return 'Add photos and complete';
      default:
        return '';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50">
        <ProfessionalNavbar activeTab="bookings" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Loading jobs...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50">
      <ProfessionalNavbar activeTab="bookings" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Connection Status */}
        <div className={`mb-4 px-4 py-2 rounded-lg flex items-center gap-2 ${isConnected ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          <span className="text-sm font-medium">
            {isConnected ? 'Live Updates Active' : 'Reconnecting...'}
          </span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <Link
            href="/professional/bookings"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-bold mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black text-gray-900 mb-2">Ongoing Jobs</h1>
              <p className="text-gray-600 font-semibold">
                {ongoingJobs.length} active job{ongoingJobs.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Alert Banner */}
        {ongoingJobs.some(job => job.status === 'otp-pending') && (
          <div className="bg-orange-50 border-2 border-orange-300 rounded-2xl p-5 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-black text-orange-900 mb-1">OTP Verification Required</h3>
                <p className="text-sm text-orange-800 font-semibold">
                  Click &quot;Request OTP&quot; button when you arrive at the customer&apos;s location
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Jobs List */}
        {ongoingJobs.length > 0 ? (
          <div className="space-y-6">
            {ongoingJobs.map((job) => (
              <div
                key={job.id}
                className={`bg-white rounded-2xl shadow-lg border-2 transition-all hover:shadow-2xl ${
                  job.isUrgent ? 'border-red-300' : 'border-purple-200'
                }`}
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-start gap-4">
                      <img
                        src={job.customerPhoto}
                        alt={job.customerName}
                        className="w-16 h-16 rounded-full border-4 border-purple-200 shadow-md"
                      />
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-black text-gray-900">{job.customerName}</h3>
                          {job.isUrgent && (
                            <span className="bg-red-500 text-white text-xs font-black px-3 py-1 rounded-full animate-pulse">
                              URGENT
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                          <span className="font-bold text-gray-700">{job.customerRating}</span>
                        </div>
                        <p className="text-sm text-gray-600 font-semibold">{job.customerPhone}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      {getStatusBadge(job.status)}
                      {job.elapsedTime && (
                        <p className="text-2xl font-black text-purple-600 mt-2">{job.elapsedTime}</p>
                      )}
                    </div>
                  </div>

                  {/* Service Info */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-200 mb-6">
                    <h4 className="font-black text-gray-900 text-lg mb-1">{job.service}</h4>
                    <p className="text-sm text-gray-700 font-medium">{job.description}</p>
                  </div>

                  {/* Job Details Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-xl p-3 border-2 border-blue-200">
                      <Clock className="w-5 h-5 text-blue-600 mb-1" />
                      <p className="text-xs text-gray-600 font-semibold">Start Time</p>
                      <p className="font-black text-gray-900">{job.startTime}</p>
                    </div>
                    
                    <div className="bg-purple-50 rounded-xl p-3 border-2 border-purple-200">
                      <Clock className="w-5 h-5 text-purple-600 mb-1" />
                      <p className="text-xs text-gray-600 font-semibold">Duration</p>
                      <p className="font-black text-gray-900">{job.expectedDuration}</p>
                    </div>
                    
                    <div className="bg-green-50 rounded-xl p-3 border-2 border-green-200">
                      <MapPin className="w-5 h-5 text-green-600 mb-1" />
                      <p className="text-xs text-gray-600 font-semibold">Distance</p>
                      <p className="font-black text-gray-900">{job.distance} km</p>
                    </div>
                    
                    <div className="bg-yellow-50 rounded-xl p-3 border-2 border-yellow-200">
                      <p className="text-xs text-gray-600 font-semibold">Earnings</p>
                      <p className="font-black text-green-600 text-xl">₹{job.earnings}</p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-2 mb-6">
                    <MapPin className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm font-semibold text-gray-700">{job.address}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <a
                      href={`tel:${job.customerPhone}`}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-green-50 text-green-700 font-bold rounded-xl hover:bg-green-100 transition-all border-2 border-green-200"
                    >
                      <Phone className="w-4 h-4" />
                      Call
                    </a>
                    
                    <a
                      href={`sms:${job.customerPhone}`}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 text-blue-700 font-bold rounded-xl hover:bg-blue-100 transition-all border-2 border-blue-200"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Message
                    </a>
                    
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(job.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-cyan-50 text-cyan-700 font-bold rounded-xl hover:bg-cyan-100 transition-all border-2 border-cyan-200"
                    >
                      <Navigation className="w-4 h-4" />
                      Navigate
                    </a>
                    
                    {job.status === 'otp-pending' ? (
                      <>
                        {/* Send OTP Request Button */}
                        <button
                          onClick={() => handleSendOTP(job.id)}
                          disabled={isSendingOTP === job.id}
                          className="flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-all disabled:opacity-50"
                        >
                          {isSendingOTP === job.id ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              Request OTP
                            </>
                          )}
                        </button>
                        
                        {/* Enter OTP Button */}
                        <button
                          onClick={() => {
                            setSelectedJobId(job.id);
                            setShowOTPModal(true);
                          }}
                          className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-xl transition-all col-span-2 lg:col-span-1"
                        >
                          <Key className="w-4 h-4" />
                          Enter OTP & Start
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleCompleteJob(job.id)}
                        disabled={isCompleting === job.id}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:shadow-xl transition-all disabled:opacity-50"
                      >
                        {isCompleting === job.id ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Completing...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            Complete Job
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Status Message */}
                  <div className="mt-4 bg-purple-50 border-2 border-purple-200 rounded-xl p-3">
                    <p className="text-sm text-purple-800 font-semibold text-center">
                      {getStatusMessage(job.status)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-12 h-12 text-purple-600" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-3">No Ongoing Jobs</h3>
              <p className="text-gray-600 font-semibold mb-6">
                You don&apos;t have any active jobs at the moment. Check accepted bookings to start a job.
              </p>
              <div className="flex gap-3 justify-center">
                <Link
                  href="/professional/bookings/accepted"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-xl transition-all"
                >
                  View Accepted Jobs
                </Link>
                <Link
                  href="/professional/bookings/requests"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-700 font-bold rounded-xl hover:bg-gray-50 transition-all border-2 border-purple-200"
                >
                  Browse Requests
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Tips */}
        {ongoingJobs.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-lg p-6 text-white">
            <h3 className="text-lg font-black mb-3">💡 Tips for Ongoing Jobs</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white bg-opacity-20 rounded-xl p-3">
                <p className="text-sm font-bold mb-1">Stay in Touch</p>
                <p className="text-xs opacity-90">Keep customer informed about progress</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-xl p-3">
                <p className="text-sm font-bold mb-1">Document Everything</p>
                <p className="text-xs opacity-90">Take clear before & after photos</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-xl p-3">
                <p className="text-sm font-bold mb-1">Track Time</p>
                <p className="text-xs opacity-90">Use pause/resume for accurate timing</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* OTP Verification Modal */}
      {showOTPModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="text-center">
              {/* Key Icon */}
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Key className="w-10 h-10 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Enter OTP to Start Work
              </h3>
              <p className="text-gray-600 mb-6">
                Ask the customer for the OTP code they received
              </p>
              
              {/* OTP Input */}
              <div className="mb-6">
                <input
                  type="text"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 5))}
                  placeholder="Enter 5-digit OTP"
                  className="w-full text-center text-2xl font-bold tracking-widest border-2 border-purple-300 rounded-xl py-4 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
                  maxLength={5}
                />
              </div>
              
              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowOTPModal(false);
                    setOtpInput('');
                    setSelectedJobId(null);
                  }}
                  disabled={isVerifyingOTP}
                  className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleVerifyOTP}
                  disabled={isVerifyingOTP || otpInput.length !== 5}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isVerifyingOTP ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Verify & Start Work
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
