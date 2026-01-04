'use client';

import React from 'react';
import { 
  ArrowLeft,
  Star,
  Clock,
  Calendar,
  MapPin,
  Phone,
  MessageCircle,
  CheckCircle,
  Download,
  Share2,
  Camera,
  FileText,
  DollarSign,
  Award,
  ThumbsUp,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import ProfessionalNavbar from '../../../components/ProfessionalNavbar';

export default function CompletedJobDetailsPage() {
  const params = useParams();
  const router = useRouter();

  // Sample completed job data
  const job = {
    id: params.id,
    customerName: 'Subhajit De',
    customerPhoto: 'https://i.pravatar.cc/150?img=33',
    customerRating: 4.8,
    totalBookings: 23,
    customerPhone: '+91 98765 43210',
    service: 'Switchboard Repair',
    description: 'Main switchboard tripping frequently. Need urgent inspection and repair.',
    completedDate: '4 Jan 2026',
    completedTime: '3:45 PM',
    startTime: '2:00 PM',
    duration: '45 min',
    address: '22/5, Sector 5, Salt Lake, Kolkata - 700091',
    distance: 1.1,
    earnings: 450,
    paymentStatus: 'paid',
    paymentMethod: 'Cash',
    invoiceNumber: 'INV-2026-001234',
    
    // Customer feedback
    jobRating: 5,
    customerFeedback: 'Excellent work! Very professional and quick. Fixed the issue perfectly. Highly recommend this professional for any electrical work.',
    
    // Work details
    workSummary: '• Identified main switchboard tripping issue\n• Replaced faulty MCB (circuit breaker)\n• Checked all wire connections\n• Tested the entire circuit\n• Issue completely resolved\n• Provided safety tips to customer',
    
    // Photos
    beforePhotos: [
      'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400',
      'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400'
    ],
    afterPhotos: [
      'https://images.unsplash.com/photo-1621905252472-be1d8d8c5c8a?w=400',
      'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400',
      'https://images.unsplash.com/photo-1621905252472-be1d8d8c5c8a?w=400'
    ],
    
    // Performance metrics
    responseTime: '8 min',
    arrivalTime: 'On Time',
    professionalismScore: 5,
    qualityScore: 5,
    timelinesScore: 5
  };

  const handleDownloadInvoice = () => {
    alert(`📄 Downloading Invoice ${job.invoiceNumber}...`);
  };

  const handleShareJob = () => {
    alert('📤 Share job details on social media or with others!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-emerald-50">
      <ProfessionalNavbar activeTab="bookings" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/professional/bookings/completed"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-bold mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Completed Jobs
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-black text-gray-900">Job Completed</h1>
                <span className="bg-green-100 text-green-800 px-4 py-2 rounded-xl border-2 border-green-300 font-black flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  SUCCESS
                </span>
              </div>
              <p className="text-gray-600 font-semibold">
                Invoice #{job.invoiceNumber}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleDownloadInvoice}
                className="flex items-center gap-2 px-6 py-3 bg-purple-50 text-purple-700 font-bold rounded-xl hover:bg-purple-100 transition-all border-2 border-purple-200"
              >
                <Download className="w-5 h-5" />
                Invoice
              </button>
              <button
                onClick={handleShareJob}
                className="flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-700 font-bold rounded-xl hover:bg-blue-100 transition-all border-2 border-blue-200"
              >
                <Share2 className="w-5 h-5" />
                Share
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer & Rating */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
              <h2 className="text-xl font-black text-gray-900 mb-4">Customer & Rating</h2>
              
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <img
                    src={job.customerPhoto}
                    alt={job.customerName}
                    className="w-20 h-20 rounded-full border-4 border-green-200 shadow-md"
                  />
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 mb-1">{job.customerName}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      <span className="font-bold text-gray-700">{job.customerRating}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-600 font-semibold">{job.totalBookings} bookings</span>
                    </div>
                    <p className="text-sm text-gray-600 font-semibold">{job.customerPhone}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <a
                    href={`tel:${job.customerPhone}`}
                    className="p-3 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-all border-2 border-green-200"
                  >
                    <Phone className="w-5 h-5" />
                  </a>
                  <a
                    href={`sms:${job.customerPhone}`}
                    className="p-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-all border-2 border-blue-200"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* Customer Rating */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-5 border-2 border-yellow-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-black text-gray-900 text-lg">Your Rating from Customer</h4>
                  <div className="flex items-center gap-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-7 h-7 ${
                          i < job.jobRating
                            ? 'text-yellow-500 fill-yellow-500'
                            : 'text-gray-300 fill-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                {job.customerFeedback && (
                  <div className="bg-white rounded-xl p-4 border-2 border-yellow-200">
                    <p className="text-sm text-gray-700 font-semibold italic">
                      &ldquo;{job.customerFeedback}&rdquo;
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Service Details */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
              <h2 className="text-xl font-black text-gray-900 mb-4">Service Details</h2>
              
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200 mb-6">
                <h4 className="font-black text-gray-900 text-lg mb-1">{job.service}</h4>
                <p className="text-sm text-gray-700 font-medium">{job.description}</p>
              </div>

              {/* Time & Location Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                  <Calendar className="w-5 h-5 text-blue-600 mb-2" />
                  <p className="text-xs text-gray-600 font-semibold mb-1">Completed Date</p>
                  <p className="font-black text-gray-900">{job.completedDate}</p>
                  <p className="text-sm text-gray-600 font-semibold">{job.completedTime}</p>
                </div>
                
                <div className="bg-purple-50 rounded-xl p-4 border-2 border-purple-200">
                  <Clock className="w-5 h-5 text-purple-600 mb-2" />
                  <p className="text-xs text-gray-600 font-semibold mb-1">Duration</p>
                  <p className="font-black text-gray-900">{job.duration}</p>
                  <p className="text-sm text-gray-600 font-semibold">Started: {job.startTime}</p>
                </div>
              </div>

              <div className="bg-red-50 rounded-xl p-4 border-2 border-red-200 flex items-start gap-3">
                <MapPin className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-600 font-semibold mb-1">Location</p>
                  <p className="font-semibold text-gray-900">{job.address}</p>
                  <p className="text-sm text-gray-600 font-semibold mt-1">{job.distance} km from you</p>
                </div>
              </div>
            </div>

            {/* Work Summary */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-7 h-7 text-green-600" />
                <h2 className="text-xl font-black text-gray-900">Work Summary</h2>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                <pre className="text-sm text-gray-700 font-semibold whitespace-pre-wrap font-sans">
                  {job.workSummary}
                </pre>
              </div>
            </div>

            {/* Before & After Photos */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Camera className="w-7 h-7 text-green-600" />
                <h2 className="text-xl font-black text-gray-900">Work Documentation</h2>
              </div>
              
              {/* Before Photos */}
              <div className="mb-6">
                <h3 className="font-black text-gray-700 mb-4 flex items-center gap-2">
                  📷 Before Work Photos
                  <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    {job.beforePhotos.length}
                  </span>
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {job.beforePhotos.map((photo, index) => (
                    <div key={index} className="relative aspect-square rounded-xl overflow-hidden border-4 border-blue-200 shadow-md group cursor-pointer hover:scale-105 transition-all">
                      <img src={photo} alt={`Before ${index + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                        <span className="text-white font-black opacity-0 group-hover:opacity-100 transition-all">
                          View Full
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* After Photos */}
              <div>
                <h3 className="font-black text-gray-700 mb-4 flex items-center gap-2">
                  ✅ After Work Photos
                  <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    {job.afterPhotos.length}
                  </span>
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {job.afterPhotos.map((photo, index) => (
                    <div key={index} className="relative aspect-square rounded-xl overflow-hidden border-4 border-green-200 shadow-md group cursor-pointer hover:scale-105 transition-all">
                      <img src={photo} alt={`After ${index + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                        <span className="text-white font-black opacity-0 group-hover:opacity-100 transition-all">
                          View Full
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Payment & Stats */}
          <div className="space-y-6">
            {/* Payment Details */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <DollarSign className="w-8 h-8" />
                <h3 className="text-lg font-black">Payment Details</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-green-100 text-sm mb-1 font-semibold">Total Earnings</p>
                  <p className="text-5xl font-black">₹{job.earnings}</p>
                </div>

                <div className="bg-white bg-opacity-20 rounded-xl p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold">Status</span>
                    <span className="bg-white text-green-700 px-3 py-1 rounded-full text-xs font-black">
                      {job.paymentStatus.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold">Method</span>
                    <span className="font-black">{job.paymentMethod}</span>
                  </div>
                </div>

                <button
                  onClick={handleDownloadInvoice}
                  className="w-full bg-white text-green-700 font-black py-3 rounded-xl hover:bg-green-50 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download Invoice
                </button>
              </div>
            </div>

            {/* Performance Scores */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-7 h-7 text-purple-600" />
                <h3 className="text-lg font-black text-gray-900">Performance</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 font-semibold">Professionalism</span>
                    <span className="font-black text-gray-900">{job.professionalismScore}/5</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all"
                      style={{ width: `${(job.professionalismScore / 5) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 font-semibold">Quality of Work</span>
                    <span className="font-black text-gray-900">{job.qualityScore}/5</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all"
                      style={{ width: `${(job.qualityScore / 5) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 font-semibold">Timeliness</span>
                    <span className="font-black text-gray-900">{job.timelinesScore}/5</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all"
                      style={{ width: `${(job.timelinesScore / 5) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
              <h3 className="text-lg font-black text-gray-900 mb-4">Quick Stats</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-semibold text-sm">Response Time</span>
                  <span className="font-black text-blue-600">{job.responseTime}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-semibold text-sm">Arrival</span>
                  <span className="font-black text-green-600">{job.arrivalTime}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-semibold text-sm">Distance</span>
                  <span className="font-black text-gray-900">{job.distance} km</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-semibold text-sm">Duration</span>
                  <span className="font-black text-purple-600">{job.duration}</span>
                </div>
              </div>
            </div>

            {/* Achievement Badge */}
            {job.jobRating === 5 && (
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-lg p-6 text-white text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-10 h-10 text-yellow-500" />
                </div>
                <h3 className="text-lg font-black mb-2">Perfect Job! 🎉</h3>
                <p className="text-sm font-semibold opacity-90">
                  You received a 5-star rating for this job. Keep up the excellent work!
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-5">
              <h4 className="font-black text-blue-900 mb-3 flex items-center gap-2">
                <ThumbsUp className="w-5 h-5" />
                Share Your Success
              </h4>
              <p className="text-sm text-blue-800 font-semibold mb-4">
                Showcase this successful job on your profile to attract more customers!
              </p>
              <button
                onClick={handleShareJob}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Share2 className="w-5 h-5" />
                Share Job
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
