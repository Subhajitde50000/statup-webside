'use client';

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Filter,
  Star,
  Clock,
  Calendar,
  TrendingUp,
  CheckCircle,
  FileText,
  Download,
  Eye,
  Phone,
  MessageCircle,
  Award,
  DollarSign
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProfessionalNavbar from '../../components/ProfessionalNavbar';

interface CompletedJob {
  id: string;
  customerName: string;
  customerPhoto: string;
  service: string;
  description: string;
  date: string;
  time: string;
  duration: string;
  earnings: number;
  customerRating: number;
  customerFeedback?: string;
  category: 'today' | 'week' | 'month' | 'all';
  paymentStatus: 'paid' | 'pending';
  hasInvoice: boolean;
}

export default function CompletedJobsPage() {
  const router = useRouter();
  const [filterOption, setFilterOption] = useState<'today' | 'week' | 'month' | 'all'>('all');

  const completedJobs: CompletedJob[] = [
    {
      id: '1',
      customerName: 'Subhajit De',
      customerPhoto: 'https://i.pravatar.cc/150?img=33',
      service: 'Switchboard Repair',
      description: 'Fixed main switchboard tripping issue',
      date: 'Today',
      time: '2:00 PM',
      duration: '45 min',
      earnings: 450,
      customerRating: 5,
      customerFeedback: 'Excellent work! Very professional and quick.',
      category: 'today',
      paymentStatus: 'paid',
      hasInvoice: true
    },
    {
      id: '2',
      customerName: 'Priya Sharma',
      customerPhoto: 'https://i.pravatar.cc/150?img=5',
      service: 'Fan Installation',
      description: 'Installed new ceiling fan in bedroom',
      date: 'Yesterday',
      time: '4:30 PM',
      duration: '35 min',
      earnings: 350,
      customerRating: 4,
      customerFeedback: 'Good service, but took a bit longer than expected.',
      category: 'week',
      paymentStatus: 'paid',
      hasInvoice: true
    },
    {
      id: '3',
      customerName: 'Ananya Das',
      customerPhoto: 'https://i.pravatar.cc/150?img=10',
      service: 'Light Fitting',
      description: 'Installed decorative lights in living room',
      date: '2 Jan 2026',
      time: '10:00 AM',
      duration: '40 min',
      earnings: 280,
      customerRating: 5,
      customerFeedback: 'Amazing work! Lights look beautiful.',
      category: 'week',
      paymentStatus: 'paid',
      hasInvoice: true
    },
    {
      id: '4',
      customerName: 'Rajesh Kumar',
      customerPhoto: 'https://i.pravatar.cc/150?img=12',
      service: 'MCB Replacement',
      description: 'Replaced faulty circuit breaker',
      date: '30 Dec 2025',
      time: '2:30 PM',
      duration: '30 min',
      earnings: 400,
      customerRating: 4,
      category: 'week',
      paymentStatus: 'paid',
      hasInvoice: true
    },
    {
      id: '5',
      customerName: 'Vikram Singh',
      customerPhoto: 'https://i.pravatar.cc/150?img=15',
      service: 'Electrical Inspection',
      description: 'Complete house wiring inspection and testing',
      date: '28 Dec 2025',
      time: '11:00 AM',
      duration: '90 min',
      earnings: 650,
      customerRating: 5,
      customerFeedback: 'Very thorough inspection. Highly recommended!',
      category: 'week',
      paymentStatus: 'paid',
      hasInvoice: true
    },
    {
      id: '6',
      customerName: 'Sneha Patel',
      customerPhoto: 'https://i.pravatar.cc/150?img=20',
      service: 'Socket Installation',
      description: 'Installed 4 new power sockets',
      date: '20 Dec 2025',
      time: '3:00 PM',
      duration: '50 min',
      earnings: 320,
      customerRating: 5,
      category: 'month',
      paymentStatus: 'paid',
      hasInvoice: true
    }
  ];

  const filteredJobs = completedJobs.filter(job => {
    if (filterOption === 'today') return job.category === 'today';
    if (filterOption === 'week') return ['today', 'week'].includes(job.category);
    if (filterOption === 'month') return ['today', 'week', 'month'].includes(job.category);
    return true;
  });

  const totalEarnings = filteredJobs.reduce((sum, job) => sum + job.earnings, 0);
  const avgRating = filteredJobs.length > 0 
    ? filteredJobs.reduce((sum, job) => sum + job.customerRating, 0) / filteredJobs.length 
    : 0;
  const fiveStarJobs = filteredJobs.filter(job => job.customerRating === 5).length;

  const handleViewDetails = (id: string) => {
    router.push(`/professional/bookings/completed/${id}`);
  };

  const handleDownloadInvoice = (id: string) => {
    alert(`📄 Invoice #${id} will be downloaded`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-emerald-50">
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
              <h1 className="text-4xl font-black text-gray-900 mb-2">Completed Jobs</h1>
              <p className="text-gray-600 font-semibold">
                Your work history and earnings
              </p>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 shadow-lg text-white">
            <div className="flex items-center justify-between mb-3">
              <CheckCircle className="w-8 h-8 opacity-80" />
            </div>
            <p className="text-5xl font-black mb-2">{filteredJobs.length}</p>
            <p className="text-sm font-bold opacity-90">Total Jobs</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-6 shadow-lg text-white">
            <div className="flex items-center justify-between mb-3">
              <DollarSign className="w-8 h-8 opacity-80" />
            </div>
            <p className="text-5xl font-black mb-2">₹{totalEarnings}</p>
            <p className="text-sm font-bold opacity-90">Total Earnings</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 shadow-lg text-white">
            <div className="flex items-center justify-between mb-3">
              <Star className="w-8 h-8 opacity-80 fill-white" />
            </div>
            <p className="text-5xl font-black mb-2">{avgRating.toFixed(1)}</p>
            <p className="text-sm font-bold opacity-90">Avg Rating</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 shadow-lg text-white">
            <div className="flex items-center justify-between mb-3">
              <Award className="w-8 h-8 opacity-80" />
            </div>
            <p className="text-5xl font-black mb-2">{fiveStarJobs}</p>
            <p className="text-sm font-bold opacity-90">5-Star Jobs</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-2 mb-8">
          <div className="flex items-center gap-2 overflow-x-auto">
            <Filter className="w-5 h-5 text-gray-500 ml-2 flex-shrink-0" />
            <button
              onClick={() => setFilterOption('today')}
              className={`py-3 px-6 rounded-xl font-bold whitespace-nowrap transition-all ${
                filterOption === 'today'
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setFilterOption('week')}
              className={`py-3 px-6 rounded-xl font-bold whitespace-nowrap transition-all ${
                filterOption === 'week'
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setFilterOption('month')}
              className={`py-3 px-6 rounded-xl font-bold whitespace-nowrap transition-all ${
                filterOption === 'month'
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => setFilterOption('all')}
              className={`py-3 px-6 rounded-xl font-bold whitespace-nowrap transition-all ${
                filterOption === 'all'
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              All Time
            </button>
          </div>
        </div>

        {/* Jobs List */}
        {filteredJobs.length > 0 ? (
          <div className="space-y-6">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 hover:shadow-2xl transition-all"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-start gap-4">
                      <img
                        src={job.customerPhoto}
                        alt={job.customerName}
                        className="w-16 h-16 rounded-full border-4 border-green-200 shadow-md"
                      />
                      <div>
                        <h3 className="text-2xl font-black text-gray-900 mb-1">
                          {job.customerName}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-5 h-5 ${
                                  i < job.customerRating
                                    ? 'text-yellow-500 fill-yellow-500'
                                    : 'text-gray-300 fill-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="font-black text-gray-700">
                            {job.customerRating}.0
                          </span>
                        </div>
                        {job.customerFeedback && (
                          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-3 max-w-md">
                            <p className="text-sm text-gray-700 font-semibold italic">
                              &ldquo;{job.customerFeedback}&rdquo;
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="bg-green-100 text-green-800 px-4 py-2 rounded-xl border-2 border-green-300 mb-2">
                        <p className="text-xs font-bold mb-1">Earnings</p>
                        <p className="text-3xl font-black">₹{job.earnings}</p>
                      </div>
                      <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-xs font-black px-3 py-1 rounded-full border-2 border-blue-300">
                        <CheckCircle className="w-3 h-3" />
                        {job.paymentStatus === 'paid' ? 'PAID' : 'PENDING'}
                      </span>
                    </div>
                  </div>

                  {/* Service Details */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200 mb-6">
                    <h4 className="font-black text-gray-900 text-lg mb-1">{job.service}</h4>
                    <p className="text-sm text-gray-700 font-medium">{job.description}</p>
                  </div>

                  {/* Job Info Grid */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-xl p-3 border-2 border-blue-200">
                      <Calendar className="w-5 h-5 text-blue-600 mb-1" />
                      <p className="text-xs text-gray-600 font-semibold">Date</p>
                      <p className="font-black text-gray-900 text-sm">{job.date}</p>
                    </div>
                    
                    <div className="bg-purple-50 rounded-xl p-3 border-2 border-purple-200">
                      <Clock className="w-5 h-5 text-purple-600 mb-1" />
                      <p className="text-xs text-gray-600 font-semibold">Time</p>
                      <p className="font-black text-gray-900 text-sm">{job.time}</p>
                    </div>
                    
                    <div className="bg-pink-50 rounded-xl p-3 border-2 border-pink-200">
                      <TrendingUp className="w-5 h-5 text-pink-600 mb-1" />
                      <p className="text-xs text-gray-600 font-semibold">Duration</p>
                      <p className="font-black text-gray-900 text-sm">{job.duration}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    <button
                      onClick={() => handleViewDetails(job.id)}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-xl hover:shadow-xl transition-all"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                    
                    {job.hasInvoice && (
                      <button
                        onClick={() => handleDownloadInvoice(job.id)}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-50 text-purple-700 font-bold rounded-xl hover:bg-purple-100 transition-all border-2 border-purple-200"
                      >
                        <Download className="w-4 h-4" />
                        Invoice
                      </button>
                    )}
                    
                    <button
                      onClick={() => router.push(`/professional/messages?customer=${job.customerName}`)}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-green-50 text-green-700 font-bold rounded-xl hover:bg-green-100 transition-all border-2 border-green-200"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Message
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-3">No Completed Jobs</h3>
              <p className="text-gray-600 font-semibold mb-6">
                No jobs found for the selected time period. Complete some jobs to see them here!
              </p>
              <Link
                href="/professional/bookings/accepted"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:shadow-xl transition-all"
              >
                View Accepted Jobs
              </Link>
            </div>
          </div>
        )}

        {/* Bottom Tips */}
        {filteredJobs.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg p-6 text-white">
            <h3 className="text-lg font-black mb-4">🎯 Keep Up The Great Work!</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white bg-opacity-20 rounded-xl p-4">
                <Star className="w-6 h-6 mb-2 fill-white" />
                <p className="text-sm font-bold mb-1">Maintain High Ratings</p>
                <p className="text-xs opacity-90">Your {avgRating.toFixed(1)} rating is excellent!</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-xl p-4">
                <TrendingUp className="w-6 h-6 mb-2" />
                <p className="text-sm font-bold mb-1">Consistency Pays</p>
                <p className="text-xs opacity-90">Complete jobs regularly for bonuses</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-xl p-4">
                <Award className="w-6 h-6 mb-2" />
                <p className="text-sm font-bold mb-1">Build Your Reputation</p>
                <p className="text-xs opacity-90">Great feedback attracts more customers</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
