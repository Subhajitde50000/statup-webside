'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Search, MessageCircle, CheckCheck, Check, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../Component/Navbar';
import { useMessageSocket } from '@/utils/MessageSocketContext';
import { getConversations, Conversation, NewMessageEvent } from '@/utils/messages';

export default function UserMessagesPage() {
  const router = useRouter();
  const { onNewMessage, isUserOnline, isConnected, getCurrentUserId } = useMessageSocket();
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getConversations();
      if (response.success && response.data) {
        setConversations(response.data);
      } else {
        setError(response.error || 'Failed to load conversations');
      }
    } catch (err) {
      setError('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Listen for new messages to update conversation list
  useEffect(() => {
    const unsubscribe = onNewMessage((event: NewMessageEvent) => {
      const currentUserId = getCurrentUserId();
      setConversations(prev => {
        const updatedConversations = prev.map(conv => {
          if (conv.id === event.conversation_id) {
            return {
              ...conv,
              last_message: event.content,
              last_message_at: event.created_at,
              // Only increment unread if message is from other user
              unread_count: event.sender_id !== currentUserId ? conv.unread_count + 1 : conv.unread_count
            };
          }
          return conv;
        });
        // Sort by last message time
        return updatedConversations.sort((a, b) => 
          new Date(b.last_message_at || 0).getTime() - new Date(a.last_message_at || 0).getTime()
        );
      });
    });
    
    return unsubscribe;
  }, [onNewMessage, getCurrentUserId]);

  const filteredConversations = conversations.filter(conv => {
    const otherParticipant = conv.participants?.find(p => p.user_type === 'professional' || p.role === 'professional');
    return otherParticipant?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           conv.last_message?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const formatTime = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'sent':
        return <Check className="w-4 h-4 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="w-4 h-4 text-gray-400" />;
      case 'seen':
        return <CheckCheck className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar onNotificationClick={() => setIsNotificationsOpen(!isNotificationsOpen)} isNotificationsOpen={isNotificationsOpen} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-10 h-10 text-[#00A884] animate-spin mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Loading conversations...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar onNotificationClick={() => setIsNotificationsOpen(!isNotificationsOpen)} isNotificationsOpen={isNotificationsOpen} />
      
      {/* Header */}
      <header className="bg-[#00A884] shadow-lg sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <h1 className="text-xl font-black text-white">Messages</h1>
            </div>
            
            <div className="flex items-center gap-2">
              {!isConnected && (
                <span className="text-xs bg-yellow-500 text-yellow-900 px-2 py-1 rounded-full font-semibold">
                  Reconnecting...
                </span>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-gray-900 pl-10 pr-4 py-3 rounded-2xl bg-white/20 text-white placeholder-white/70 border-2 border-white/30 focus:border-white/50 focus:bg-white/30 outline-none font-medium transition-all"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70" />
          </div>
        </div>
      </header>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-3">
          <p className="text-red-600 text-sm font-medium">{error}</p>
          <button 
            onClick={fetchConversations}
            className="text-red-700 underline text-sm font-semibold mt-1"
          >
            Retry
          </button>
        </div>
      )}

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <MessageCircle className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No Conversations Yet</h3>
            <p className="text-gray-500 text-center text-sm max-w-xs">
              {searchQuery 
                ? 'No conversations match your search'
                : 'Start a conversation by booking a service'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredConversations.map((conv) => {
              const professional = conv.participants?.find(p => p.user_type === 'professional' || p.role === 'professional');
              const isOnline = professional ? isUserOnline(professional.user_id) : false;
              
              return (
                <Link
                  key={conv.id}
                  href={`/messages/${conv.id}`}
                  className="flex items-center gap-4 px-4 py-4 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={professional?.photo || `https://ui-avatars.com/api/?name=${professional?.name || 'P'}&background=00A884&color=fff`}
                      alt={professional?.name || 'Professional'}
                      className="w-14 h-14 rounded-full object-cover border-2 border-gray-200"
                    />
                    {isOnline && (
                      <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-gray-900 truncate">
                        {professional?.name || 'Professional'}
                      </h3>
                      <span className={`text-xs font-semibold ${conv.unread_count > 0 ? 'text-[#00A884]' : 'text-gray-500'}`}>
                        {formatTime(conv.last_message_at)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {conv.last_message_status && getStatusIcon(conv.last_message_status)}
                      <p className={`text-sm truncate ${conv.unread_count > 0 ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                        {conv.last_message || 'Start a conversation'}
                      </p>
                    </div>
                  </div>

                  {conv.unread_count > 0 && (
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 bg-[#00A884] text-white text-xs font-bold rounded-full">
                        {conv.unread_count > 99 ? '99+' : conv.unread_count}
                      </span>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
