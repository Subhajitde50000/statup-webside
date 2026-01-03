'use client';

import React, { useState, useEffect } from 'react';
import { Search, Settings, Phone, MapPin, MoreVertical, MessageSquare, Bell, Clock, Zap, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { ProfessionalNavbar } from '../components';

interface Message {
  id: number;
  customerId: number;
  customerName: string;
  customerPhoto: string;
  isOnline: boolean;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  serviceBadge: string;
  serviceBadgeColor: string;
  isMuted: boolean;
  isPriority: boolean;
  priorityText?: string;
  bookingStatus: 'pending' | 'ongoing' | 'completed';
}

export default function MessagesPage() {
  const [currentTime, setCurrentTime] = useState<string>('--:--');
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'new' | 'unread' | 'ongoing' | 'completed'>('all');
  const [showQuickStats, setShowQuickStats] = useState(true);

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

  const messages: Message[] = [
    {
      id: 1,
      customerId: 101,
      customerName: 'Subhajit De',
      customerPhoto: 'https://i.pravatar.cc/150?img=33',
      isOnline: true,
      lastMessage: 'Hi, can you come 30 minutes earlier? I have to leave by 5 PM.',
      timestamp: '4:32 PM',
      unreadCount: 3,
      serviceBadge: 'Fan Repair',
      serviceBadgeColor: 'bg-yellow-500',
      isMuted: false,
      isPriority: true,
      priorityText: 'Urgent — Awaiting response (8 min)',
      bookingStatus: 'ongoing'
    },
    {
      id: 2,
      customerId: 102,
      customerName: 'Priya Sharma',
      customerPhoto: 'https://i.pravatar.cc/150?img=45',
      isOnline: false,
      lastMessage: '5 stars! Really impressed with your professional work. Will recommend to friends.',
      timestamp: '3:15 PM',
      unreadCount: 0,
      serviceBadge: 'Plumbing',
      serviceBadgeColor: 'bg-blue-500',
      isMuted: false,
      isPriority: false,
      bookingStatus: 'completed'
    },
    {
      id: 3,
      customerId: 103,
      customerName: 'Rajesh Kumar',
      customerPhoto: 'https://i.pravatar.cc/150?img=12',
      isOnline: true,
      lastMessage: 'What is your current location? Expected time of arrival?',
      timestamp: '2:45 PM',
      unreadCount: 2,
      serviceBadge: 'Wiring Work',
      serviceBadgeColor: 'bg-orange-500',
      isMuted: false,
      isPriority: true,
      priorityText: 'Customer tracking your location',
      bookingStatus: 'ongoing'
    },
    {
      id: 4,
      customerId: 104,
      customerName: 'Anita Das',
      customerPhoto: 'https://i.pravatar.cc/150?img=25',
      isOnline: false,
      lastMessage: 'The fan is making noise again. Can you check once more tomorrow?',
      timestamp: '1:30 PM',
      unreadCount: 0,
      serviceBadge: 'Follow-up',
      serviceBadgeColor: 'bg-purple-500',
      isMuted: true,
      isPriority: false,
      bookingStatus: 'completed'
    },
    {
      id: 5,
      customerId: 105,
      customerName: 'Amit Gupta',
      customerPhoto: 'https://i.pravatar.cc/150?img=8',
      isOnline: true,
      lastMessage: 'OTP is 4567. Please verify when you arrive.',
      timestamp: '12:20 PM',
      unreadCount: 0,
      serviceBadge: 'MCB Repair',
      serviceBadgeColor: 'bg-red-500',
      isMuted: false,
      isPriority: false,
      bookingStatus: 'ongoing'
    },
    {
      id: 6,
      customerId: 106,
      customerName: 'Neha Singh',
      customerPhoto: 'https://i.pravatar.cc/150?img=47',
      isOnline: false,
      lastMessage: 'I need urgent help. Water pipe is leaking badly in kitchen. Can you come today?',
      timestamp: '11:45 AM',
      unreadCount: 5,
      serviceBadge: 'Emergency',
      serviceBadgeColor: 'bg-red-600',
      isMuted: false,
      isPriority: true,
      priorityText: 'URGENT — Emergency service needed',
      bookingStatus: 'pending'
    },
    {
      id: 7,
      customerId: 107,
      customerName: 'Vikram Rao',
      customerPhoto: 'https://i.pravatar.cc/150?img=15',
      isOnline: false,
      lastMessage: 'Payment completed via UPI. Thank you for quick service!',
      timestamp: '10:30 AM',
      unreadCount: 0,
      serviceBadge: 'Switch Repair',
      serviceBadgeColor: 'bg-yellow-500',
      isMuted: false,
      isPriority: false,
      bookingStatus: 'completed'
    },
    {
      id: 8,
      customerId: 108,
      customerName: 'Deepa Menon',
      customerPhoto: 'https://i.pravatar.cc/150?img=32',
      isOnline: true,
      lastMessage: 'Rescheduling to tomorrow 11 AM. Is that okay for you?',
      timestamp: '9:15 AM',
      unreadCount: 1,
      serviceBadge: 'AC Service',
      serviceBadgeColor: 'bg-cyan-500',
      isMuted: false,
      isPriority: false,
      bookingStatus: 'pending'
    },
    {
      id: 9,
      customerId: 109,
      customerName: 'Arjun Patel',
      customerPhoto: 'https://i.pravatar.cc/150?img=68',
      isOnline: false,
      lastMessage: 'Job completed successfully! Added ₹50 tip for excellent work 👍',
      timestamp: 'Yesterday',
      unreadCount: 0,
      serviceBadge: 'Geyser Install',
      serviceBadgeColor: 'bg-orange-500',
      isMuted: false,
      isPriority: false,
      bookingStatus: 'completed'
    },
    {
      id: 10,
      customerId: 110,
      customerName: 'Kavita Joshi',
      customerPhoto: 'https://i.pravatar.cc/150?img=41',
      isOnline: false,
      lastMessage: 'Booking cancelled due to change in plans. Sorry for inconvenience.',
      timestamp: 'Yesterday',
      unreadCount: 0,
      serviceBadge: 'Light Install',
      serviceBadgeColor: 'bg-gray-500',
      isMuted: false,
      isPriority: false,
      bookingStatus: 'completed'
    }
  ];

  const filteredMessages = messages.filter(message => {
    // Filter by search
    const matchesSearch = message.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.serviceBadge.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    // Filter by tab
    switch (activeTab) {
      case 'new':
        return message.unreadCount > 0 && message.bookingStatus === 'pending';
      case 'unread':
        return message.unreadCount > 0;
      case 'ongoing':
        return message.bookingStatus === 'ongoing';
      case 'completed':
        return message.bookingStatus === 'completed';
      default:
        return true;
    }
  });

  const unreadCount = messages.filter(m => m.unreadCount > 0).length;
  const ongoingCount = messages.filter(m => m.bookingStatus === 'ongoing').length;
  const newCount = messages.filter(m => m.unreadCount > 0 && m.bookingStatus === 'pending').length;
  const urgentCount = messages.filter(m => m.isPriority).length;
  const totalUnreadMessages = messages.reduce((sum, m) => sum + m.unreadCount, 0);
  const avgResponseTime = '4 min';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50">
      {/* Navbar */}
      <ProfessionalNavbar
        activeTab="messages"
        notificationCount={3}
        currentTime={currentTime}
      />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="bg-[#00A884] rounded-t-3xl shadow-lg px-6 py-5">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-black text-white">Messages</h1>
            <div className="flex gap-3">
              <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
                <Search className="w-5 h-5 text-white" />
              </button>
              <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
                <Settings className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers, bookings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/95 backdrop-blur-sm border-2 border-white/50 focus:border-white focus:ring-2 focus:ring-white/30 outline-none font-medium transition-all"
            />
          </div>
        </div>

        {/* Quick Stats Bar */}
        {showQuickStats && (
          <div className="bg-gradient-to-r from-[#00A884] to-[#00796B] px-4 py-3">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-sm font-bold">{totalUnreadMessages} New</span>
                </div>
                <div className="w-px h-4 bg-white/30"></div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-bold">{urgentCount} Urgent</span>
                </div>
                <div className="w-px h-4 bg-white/30"></div>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm font-bold">{ongoingCount} Active</span>
                </div>
              </div>
              <div className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">
                Avg response: {avgResponseTime}
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white shadow-md px-4 py-2 flex gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-all ${
              activeTab === 'all'
                ? 'bg-[#00A884] text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All ({messages.length})
          </button>
          <button
            onClick={() => setActiveTab('new')}
            className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-all ${
              activeTab === 'new'
                ? 'bg-[#00A884] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            New {newCount > 0 && <span className="ml-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{newCount}</span>}
          </button>
          <button
            onClick={() => setActiveTab('unread')}
            className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-all ${
              activeTab === 'unread'
                ? 'bg-[#00A884] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Unread {unreadCount > 0 && <span className="ml-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
          </button>
          <button
            onClick={() => setActiveTab('ongoing')}
            className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-all ${
              activeTab === 'ongoing'
                ? 'bg-[#00A884] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Ongoing Job {ongoingCount > 0 && <span className="ml-1 bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full">{ongoingCount}</span>}
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-all ${
              activeTab === 'completed'
                ? 'bg-[#00A884] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Completed Jobs
          </button>
        </div>

        {/* Messages List */}
        <div className="bg-white rounded-b-3xl shadow-lg overflow-hidden">
          {filteredMessages.length === 0 ? (
            <div className="text-center py-16">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Messages</h3>
              <p className="text-gray-600">
                {searchQuery ? 'No messages found matching your search' : 'You have no messages yet'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredMessages.map((message) => (
                <Link
                  key={message.id}
                  href={`/professional/messages/${message.customerId}`}
                  className={`block hover:bg-gray-50 transition-all ${message.unreadCount > 0 ? 'bg-[#00A884]/5' : ''}`}
                >
                  <div className="p-4">
                    <div className="flex gap-3">
                      {/* Profile Photo */}
                      <div className="relative flex-shrink-0">
                        <img
                          src={message.customerPhoto}
                          alt={message.customerName}
                          className={`w-14 h-14 rounded-full object-cover border-2 ${
                            message.isOnline ? 'border-green-500' : 'border-gray-200'
                          }`}
                        />
                        {message.isOnline && (
                          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <h3 className={`font-black ${message.unreadCount > 0 ? 'text-gray-900' : 'text-gray-700'}`}>
                              {message.customerName}
                            </h3>
                            {message.isMuted && (
                              <div className="p-1 bg-gray-200 rounded-full">
                                <Bell className="w-3 h-3 text-gray-500" strokeWidth={2} />
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className={`text-xs font-semibold ${message.unreadCount > 0 ? 'text-[#00A884]' : 'text-gray-500'}`}>
                              {message.timestamp}
                            </span>
                            {message.unreadCount > 0 && (
                              <span className="bg-[#00A884] text-white text-xs font-black px-2 py-0.5 rounded-full min-w-[20px] text-center shadow-md">
                                {message.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>

                        <p className={`text-sm font-medium mb-2 line-clamp-2 ${
                          message.unreadCount > 0 ? 'text-gray-900' : 'text-gray-600'
                        }`}>
                          {message.lastMessage}
                        </p>

                        <div className="flex items-center justify-between">
                          <span className={`${message.serviceBadgeColor} text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm`}>
                            <Zap className="w-3 h-3" />
                            {message.serviceBadge}
                          </span>

                          {/* Booking Status Indicator */}
                          {message.bookingStatus === 'ongoing' && !message.isPriority && (
                            <span className="text-xs font-semibold text-green-600 flex items-center gap-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              In Progress
                            </span>
                          )}
                          {message.bookingStatus === 'completed' && (
                            <span className="text-xs font-semibold text-blue-600 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Completed
                            </span>
                          )}
                        </div>

                        {/* Priority Indicator */}
                        {message.isPriority && message.priorityText && (
                          <div className={`mt-2 flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg ${
                            message.serviceBadge === 'Emergency' 
                              ? 'bg-red-50 border border-red-200'
                              : 'bg-orange-50 border border-orange-200'
                          }`}>
                            <Clock className={`w-3.5 h-3.5 ${
                              message.serviceBadge === 'Emergency' ? 'text-red-500' : 'text-orange-500'
                            } animate-pulse`} />
                            <span className={`font-bold ${
                              message.serviceBadge === 'Emergency' ? 'text-red-700' : 'text-orange-700'
                            }`}>
                              {message.priorityText}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
