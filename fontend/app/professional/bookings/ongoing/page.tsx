'use client';

import React, { useState } from 'react';
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
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProfessionalNavbar from '../../components/ProfessionalNavbar';

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
  
  const [ongoingJobs] = useState<OngoingJob[]>([
    {
      id: '1',
      customerName: 'Subhajit De',
      customerPhoto: 'https://i.pravatar.cc/150?img=33',
      customerRating: 4.8,
      customerPhone: '+91 98765 43210',
      service: 'Switchboard Repair',
      description: 'Main switchboard tripping frequently',
      startTime: '2:00 PM',
      expectedDuration: '40-50 min',
      address: '22/5, Sector 5, Salt Lake, Kolkata',
      distance: 1.1,
      earnings: 450,
      status: 'otp-pending',
      isUrgent: true
    },
    {
      id: '2',
      customerName: 'Priya Sharma',
      customerPhoto: 'https://i.pravatar.cc/150?img=5',
      customerRating: 4.6,
      customerPhone: '+91 98765 43211',
      service: 'Fan Installation',
      description: 'Install new ceiling fan in bedroom',
      startTime: '4:30 PM',
      expectedDuration: '30-40 min',
      address: 'New Town, Action Area 1, Kolkata',
      distance: 2.2,
      earnings: 350,
      status: 'in-progress',
      elapsedTime: '00:18:42'
    }
  ]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50">
      <ProfessionalNavbar activeTab="bookings" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                  Some jobs are waiting for OTP verification before you can start work
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
                    
                    <button
                      onClick={() => router.push(`/professional/bookings/ongoing/${job.id}`)}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-xl transition-all"
                    >
                      {job.status === 'otp-pending' ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Verify & Start
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          Continue
                        </>
                      )}
                    </button>
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
    </div>
  );
}
