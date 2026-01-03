'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, Clock, XCircle, AlertCircle, ArrowRight, TrendingUp, TrendingDown, DollarSign, Star, MapPin, Filter, Search, Download, Calendar as CalendarIcon } from 'lucide-react';
import Link from 'next/link';
import { ProfessionalNavbar } from '../components';

export default function BookingsPage() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showAnalytics, setShowAnalytics] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Real-world data calculations - static values that don't change
  const todayEarnings = 450;
  const weekEarnings = 2340;
  const monthEarnings = 8750;
  const avgRating = 4.8;
  const totalReviews = 156;
  const completionRate = 96;
  const responseTime = '4 min';

  // Get date info only after mounting to avoid hydration issues
  const today = currentTime || new Date();
  const dayName = mounted ? today.toLocaleDateString('en-US', { weekday: 'long' }) : 'Loading...';
  const monthName = mounted ? today.toLocaleDateString('en-US', { month: 'long' }) : '';
  const formattedTime = mounted && currentTime ? currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '--:--';

  const bookingSections = [
    {
      title: 'New Booking Requests',
      description: 'Review and accept new job requests from customers waiting for your response',
      icon: AlertCircle,
      count: 3,
      urgent: 2,
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-50 to-red-50',
      borderColor: 'border-orange-300',
      href: '/professional/bookings/requests',
      details: 'Avg. response needed: 15 min',
      earning: '₹1,850',
      image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&h=300&fit=crop',
      stats: ['3 pending', '2 urgent', 'Within 1 km']
    },
    {
      title: 'Accepted Bookings',
      description: 'Upcoming jobs scheduled and confirmed. Prepare your tools and plan your route',
      icon: Calendar,
      count: 4,
      urgent: 1,
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'from-blue-50 to-indigo-50',
      borderColor: 'border-blue-300',
      href: '/professional/bookings/accepted',
      details: 'Next job in 2 hours',
      earning: '₹2,400',
      image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&h=300&fit=crop',
      stats: ['4 scheduled', '1 today', 'All prepared']
    },
    {
      title: 'Ongoing Jobs',
      description: 'Active jobs in progress. Track time, upload photos, and complete work professionally',
      icon: Clock,
      count: 1,
      urgent: 1,
      color: 'from-teal-500 to-green-500',
      bgColor: 'from-teal-50 to-green-50',
      borderColor: 'border-teal-300',
      href: '/professional/bookings/ongoing/1',
      details: 'Started 45 min ago',
      earning: '₹650',
      isActive: true,
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop',
      stats: ['Fan Repair', '45 min elapsed', 'Customer verified']
    },
    {
      title: 'Completed Jobs',
      description: 'Successfully completed jobs with customer ratings. View your work history and earnings',
      icon: CheckCircle,
      count: 18,
      urgent: 0,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-300',
      href: '/professional/bookings/completed',
      details: '3 completed today',
      earning: '₹8,750 this month',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop',
      stats: ['18 jobs done', '4.8★ rating', '₹8,750 earned']
    },
    {
      title: 'Cancelled Jobs',
      description: 'Jobs cancelled by customer or due to unavailability. Review reasons and improve service',
      icon: XCircle,
      count: 2,
      urgent: 0,
      color: 'from-gray-500 to-slate-500',
      bgColor: 'from-gray-50 to-slate-50',
      borderColor: 'border-gray-300',
      href: '/professional/bookings/cancelled',
      details: 'Cancellation rate: 4%',
      earning: '-₹350',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop',
      stats: ['2 cancelled', '4% rate', 'Low impact']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50">
      {/* Navbar */}
      <ProfessionalNavbar
        activeTab="bookings"
        notificationCount={3}
        currentTime={formattedTime}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header with Live Stats */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-1">
                Booking Management
              </h1>
              <p className="text-gray-600 font-medium">
                {mounted ? `${dayName}, ${monthName} ${today.getDate()} • ${formattedTime}` : 'Loading...'}
              </p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-bold py-3 px-4 rounded-xl shadow-md border-2 border-gray-200 transition-colors">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </button>
              <button className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-colors">
                <CalendarIcon className="w-4 h-4" />
                <span className="hidden sm:inline">My Schedule</span>
              </button>
            </div>
          </div>
        </div>

        {/* Performance Dashboard */}
        <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-4 shadow-md border-2 border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-2xl font-black text-gray-900">₹{todayEarnings}</p>
            <p className="text-xs text-gray-600 font-semibold">Today's Earnings</p>
          </div>
          
          <div className="bg-white rounded-2xl p-4 shadow-md border-2 border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="text-xs text-gray-600 font-semibold">{totalReviews} reviews</span>
            </div>
            <p className="text-2xl font-black text-gray-900">{avgRating}</p>
            <p className="text-xs text-gray-600 font-semibold">Average Rating</p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-md border-2 border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-5 h-5 text-teal-600" />
              <TrendingUp className="w-4 h-4 text-teal-500" />
            </div>
            <p className="text-2xl font-black text-gray-900">{completionRate}%</p>
            <p className="text-xs text-gray-600 font-semibold">Completion Rate</p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-md border-2 border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span className="text-xs text-green-600 font-bold">Fast</span>
            </div>
            <p className="text-2xl font-black text-gray-900">{responseTime}</p>
            <p className="text-xs text-gray-600 font-semibold">Avg. Response</p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search bookings by customer name, service, or booking ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none font-medium transition-all"
            />
          </div>
          <button className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-bold py-3 px-5 rounded-xl shadow-md border-2 border-gray-200 transition-colors">
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-black text-gray-900 mb-1">
            📋 All Booking Categories
          </h2>
          <p className="text-gray-600 font-medium">Select a category to view and manage your bookings</p>
        </div>

        {/* Booking Sections Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
          {bookingSections.map((section, index) => {
            const Icon = section.icon;
            return (
              <Link
                key={index}
                href={section.href}
                className="block group"
              >
                <div className={`relative bg-white rounded-3xl shadow-lg border-2 ${section.borderColor} hover:shadow-2xl transition-all transform hover:-translate-y-2 overflow-hidden ${section.isActive ? 'ring-4 ring-teal-400' : ''}`}>
                  {/* Image Header */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={section.image} 
                      alt={section.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${section.color} opacity-60`}></div>
                    
                    {/* Active Indicator */}
                    {section.isActive && (
                      <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg animate-pulse flex items-center gap-1">
                        <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
                        LIVE NOW
                      </div>
                    )}

                    {/* Urgent Badge */}
                    {section.urgent > 0 && !section.isActive && (
                      <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg">
                        🔥 {section.urgent} URGENT
                      </div>
                    )}

                    {/* Count Badge */}
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-gray-900 font-black text-2xl px-4 py-2 rounded-2xl shadow-xl border-2 border-white">
                      {section.count}
                    </div>

                    {/* Icon */}
                    <div className={`absolute bottom-3 left-3 p-3 bg-white rounded-2xl shadow-xl`}>
                      <Icon className={`w-7 h-7 bg-gradient-to-br ${section.color} bg-clip-text text-transparent`} style={{
                        WebkitTextFillColor: 'transparent',
                        WebkitBackgroundClip: 'text'
                      }} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-black text-gray-900 mb-2">
                      {section.title}
                    </h3>
                    <p className="text-gray-600 text-sm font-medium mb-4 line-clamp-2">
                      {section.description}
                    </p>

                    {/* Stats Pills */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {section.stats.map((stat, i) => (
                        <span key={i} className="bg-gray-100 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-full">
                          {stat}
                        </span>
                      ))}
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-600" />
                        <span className="text-xs text-gray-700 font-semibold">{section.details}</span>
                      </div>
                      <div className="flex items-center gap-2 justify-end">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-700 font-black">{section.earning}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className={`flex items-center justify-between p-4 bg-gradient-to-r ${section.bgColor} rounded-xl border-2 ${section.borderColor} group-hover:shadow-md transition-all`}>
                      <span className="font-bold text-gray-900">View All Details</span>
                      <ArrowRight className="w-5 h-5 text-gray-700 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Weekly Performance & Analytics */}
        <div className="mt-6 grid md:grid-cols-2 gap-5">
          {/* Weekly Earnings */}
          <div className="bg-white rounded-3xl p-6 shadow-lg border-2 border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-gray-900">📈 Weekly Performance</h3>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-semibold text-gray-600">Total Earnings</span>
                  <span className="text-xl font-black text-green-600">₹{weekEarnings}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-gradient-to-r from-green-500 to-teal-500 h-3 rounded-full" style={{ width: '78%' }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">78% of monthly target</p>
              </div>
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="text-center p-3 bg-blue-50 rounded-xl">
                  <p className="text-2xl font-black text-blue-600">12</p>
                  <p className="text-xs text-gray-600 font-semibold">Jobs Done</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-xl">
                  <p className="text-2xl font-black text-purple-600">38h</p>
                  <p className="text-xs text-gray-600 font-semibold">Hours</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-xl">
                  <p className="text-2xl font-black text-green-600">+18%</p>
                  <p className="text-xs text-gray-600 font-semibold">Growth</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-3xl p-6 shadow-lg border-2 border-teal-200">
            <h3 className="text-lg font-black text-gray-900 mb-4">⚡ Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full bg-white hover:bg-gray-50 text-left p-4 rounded-xl shadow-md border-2 border-gray-200 transition-all transform hover:scale-[1.02] flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Review Requests</p>
                    <p className="text-xs text-gray-600">3 new bookings waiting</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
              </button>

              <button className="w-full bg-white hover:bg-gray-50 text-left p-4 rounded-xl shadow-md border-2 border-gray-200 transition-all transform hover:scale-[1.02] flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Today's Schedule</p>
                    <p className="text-xs text-gray-600">4 bookings scheduled</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
              </button>

              <button className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-bold p-4 rounded-xl shadow-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2">
                <Download className="w-5 h-5" />
                <span>Download Monthly Report</span>
              </button>
            </div>
          </div>
        </div>

        {/* Today's Summary */}
        <div className="mt-6 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-3xl p-6 shadow-lg text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-2xl font-black mb-1">🎯 Today's Summary</h3>
              <p className="text-white/90">You're doing great! Keep up the excellent work.</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center bg-white/20 backdrop-blur-sm rounded-xl p-3">
                <p className="text-2xl font-black">3</p>
                <p className="text-xs font-semibold">Completed</p>
              </div>
              <div className="text-center bg-white/20 backdrop-blur-sm rounded-xl p-3">
                <p className="text-2xl font-black">₹{todayEarnings}</p>
                <p className="text-xs font-semibold">Earned</p>
              </div>
              <div className="text-center bg-white/20 backdrop-blur-sm rounded-xl p-3">
                <p className="text-2xl font-black">5.0</p>
                <p className="text-xs font-semibold">Avg Rating</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
