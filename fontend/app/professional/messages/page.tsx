'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search, Settings, Bell, Clock, Zap, CheckCircle, MessageSquare, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { ProfessionalNavbar } from '../components';
import { useMessageSocket } from '@/utils/MessageSocketContext';
import { 
  getConversations, 
  Conversation, 
  ConversationListResponse,
  NewMessageEvent 
} from '@/utils/messages';

interface ConversationDisplay {
  id: string;
  customerId: string;
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

const SERVICE_BADGE_COLORS: Record<string, string> = {
  'electrical': 'bg-yellow-500',
  'plumbing': 'bg-blue-500',
  'wiring': 'bg-orange-500',
  'repair': 'bg-red-500',
  'installation': 'bg-green-500',
  'service': 'bg-cyan-500',
  'emergency': 'bg-red-600',
  'default': 'bg-teal-500'
};

function getServiceBadgeColor(serviceName: string): string {
  const lowerName = serviceName.toLowerCase();
  for (const [key, color] of Object.entries(SERVICE_BADGE_COLORS)) {
    if (lowerName.includes(key)) {
      return color;
    }
  }
  return SERVICE_BADGE_COLORS.default;
}

function formatTimestamp(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  
  if (diffHours < 24 && date.getDate() === now.getDate()) {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  } else if (diffDays < 2) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}

function transformConversation(conv: Conversation, currentUserId: string): ConversationDisplay {
  const otherParticipant = conv.other_participant || conv.participants.find(p => p.user_id !== currentUserId);
  const currentUserParticipant = conv.participants.find(p => p.user_id === currentUserId);
  
  // Determine booking status
  let bookingStatus: 'pending' | 'ongoing' | 'completed' = 'pending';
  if (conv.booking_reference) {
    const status = conv.booking_reference.status.toLowerCase();
    if (status === 'completed' || status === 'cancelled') {
      bookingStatus = 'completed';
    } else if (status === 'ongoing' || status === 'accepted' || status === 'started') {
      bookingStatus = 'ongoing';
    }
  }
  
  return {
    id: conv.id,
    customerId: otherParticipant?.user_id || conv.user_id,
    customerName: otherParticipant?.name || 'Customer',
    customerPhoto: otherParticipant?.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherParticipant?.name || 'C')}&background=1E2A5E&color=fff`,
    isOnline: otherParticipant?.is_online || false,
    lastMessage: conv.last_message_content || 'Start a conversation',
    timestamp: conv.last_message_at ? formatTimestamp(conv.last_message_at) : formatTimestamp(conv.created_at),
    unreadCount: conv.unread_count,
    serviceBadge: conv.service_badge || conv.booking_reference?.service_name || 'Message',
    serviceBadgeColor: conv.service_badge_color || getServiceBadgeColor(conv.service_badge || conv.booking_reference?.service_name || ''),
    isMuted: currentUserParticipant?.is_muted || false,
    isPriority: conv.is_priority,
    priorityText: conv.priority_text,
    bookingStatus
  };
}

export default function MessagesPage() {
  const [currentTime, setCurrentTime] = useState<string>('--:--');
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'new' | 'unread' | 'ongoing' | 'completed'>('all');
  const [showQuickStats, setShowQuickStats] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [conversations, setConversations] = useState<ConversationDisplay[]>([]);
  const [totalUnread, setTotalUnread] = useState(0);
  
  const { isConnected, onNewMessage, onUserOnlineStatus, isUserOnline } = useMessageSocket();

  // Get current user ID with fallback to stored user object
  const getCurrentUserId = () => {
    if (typeof window === 'undefined') return '';
    
    // Try direct user_id first
    let userId = localStorage.getItem('user_id');
    if (userId) return userId;
    
    // Fallback: get from stored user object
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user?.id) {
          localStorage.setItem('user_id', user.id);
          return user.id;
        }
      } catch (e) {}
    }
    return '';
  };

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getConversations({
        status: 'active',
        limit: 50
      });
      
      if (response.success && response.data) {
        const currentUserId = getCurrentUserId();
        const transformed = response.data.map(conv => transformConversation(conv, currentUserId));
        
        setConversations(transformed);
        setTotalUnread(transformed.reduce((sum, c) => sum + c.unreadCount, 0));
      } else {
        setError(response.error || 'Failed to load conversations');
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError(err instanceof Error ? err.message : 'Failed to load conversations');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 60000);
    
    fetchConversations();
    
    return () => clearInterval(timer);
  }, [fetchConversations]);

  // Listen for new messages
  useEffect(() => {
    const unsubscribe = onNewMessage((event: NewMessageEvent) => {
      // Update conversation list with new message
      setConversations(prev => {
        const updated = [...prev];
        const index = updated.findIndex(c => c.id === event.conversation_id);
        
        if (index !== -1) {
          updated[index] = {
            ...updated[index],
            lastMessage: event.message.content,
            timestamp: 'Just now',
            unreadCount: updated[index].unreadCount + (event.sender_id !== getCurrentUserId() ? 1 : 0)
          };
          // Move to top
          const [conv] = updated.splice(index, 1);
          updated.unshift(conv);
        }
        
        return updated;
      });
      
      // Refresh to get accurate data
      fetchConversations();
    });
    
    return unsubscribe;
  }, [onNewMessage, fetchConversations]);

  // Update online status
  useEffect(() => {
    const unsubscribe = onUserOnlineStatus((event) => {
      setConversations(prev => prev.map(conv => {
        if (conv.customerId === event.user_id) {
          return { ...conv, isOnline: event.is_online };
        }
        return conv;
      }));
    });
    
    return unsubscribe;
  }, [onUserOnlineStatus]);

  const filteredMessages = conversations.filter(message => {
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

  const unreadCount = conversations.filter(m => m.unreadCount > 0).length;
  const ongoingCount = conversations.filter(m => m.bookingStatus === 'ongoing').length;
  const newCount = conversations.filter(m => m.unreadCount > 0 && m.bookingStatus === 'pending').length;
  const urgentCount = conversations.filter(m => m.isPriority).length;
  const totalUnreadMessages = conversations.reduce((sum, m) => sum + m.unreadCount, 0);
  const avgResponseTime = '4 min';

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50">
      {/* Navbar */}
      <ProfessionalNavbar
        activeTab="messages"
        notificationCount={totalUnreadMessages}
        currentTime={currentTime}
      />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Connection Status */}
        <div className={`mb-2 px-3 py-1.5 rounded-lg flex items-center gap-2 w-fit text-sm ${
          isConnected ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          {isConnected ? 'Connected' : 'Disconnected'}
        </div>

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
              className="w-full text-gray-900 pl-12 pr-4 py-3 rounded-xl bg-white/95 backdrop-blur-sm border-2 border-white/50 focus:border-white focus:ring-2 focus:ring-white/30 outline-none font-medium transition-all"
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
            All ({conversations.length})
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
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-[#00A884] animate-spin" />
              <span className="ml-3 text-gray-600 font-medium">Loading conversations...</span>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <MessageSquare className="w-16 h-16 text-red-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Error Loading Messages</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={fetchConversations}
                className="px-4 py-2 bg-[#00A884] text-white rounded-lg font-bold hover:bg-[#00796B] transition-colors"
              >
                Retry
              </button>
            </div>
          ) : filteredMessages.length === 0 ? (
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
                  href={`/professional/messages/${message.id}`}
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
                            message.isOnline || isUserOnline(message.customerId) ? 'border-green-500' : 'border-gray-200'
                          }`}
                        />
                        {(message.isOnline || isUserOnline(message.customerId)) && (
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
                            message.serviceBadge.toLowerCase().includes('emergency')
                              ? 'bg-red-50 border border-red-200'
                              : 'bg-orange-50 border border-orange-200'
                          }`}>
                            <Clock className={`w-3.5 h-3.5 ${
                              message.serviceBadge.toLowerCase().includes('emergency') ? 'text-red-500' : 'text-orange-500'
                            } animate-pulse`} />
                            <span className={`font-bold ${
                              message.serviceBadge.toLowerCase().includes('emergency') ? 'text-red-700' : 'text-orange-700'
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
