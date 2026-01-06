'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, Phone, MapPin, MoreVertical, Smile, Paperclip, Mic, Send, Camera, Image as ImageIcon, FileText, Navigation, ChevronDown, ChevronUp, AlertCircle, CheckCheck, Check, Loader2, Star } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMessageSocket } from '@/utils/MessageSocketContext';
import { 
  getConversationDetail, 
  sendMessage as sendMessageApi, 
  markConversationRead,
  startConversation,
  Message,
  Conversation,
  NewMessageEvent,
  MessageStatusEvent,
  TypingEvent
} from '@/utils/messages';

interface ChatMessage {
  id: string;
  sender: 'user' | 'professional' | 'system';
  message: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'seen';
  type?: 'text' | 'image' | 'location' | 'system';
}

function transformMessage(msg: Message, currentUserId: string): ChatMessage {
  let sender: 'user' | 'professional' | 'system' = 'professional';
  if (msg.message_type === 'system') {
    sender = 'system';
  } else if (msg.sender_id === currentUserId) {
    sender = 'user';
  }
  
  return {
    id: msg.id,
    sender,
    message: msg.content,
    timestamp: new Date(msg.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    status: msg.status,
    type: msg.message_type
  };
}

export default function UserChatPage() {
  const params = useParams();
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const conversationId = params.id as string;
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [message, setMessage] = useState('');
  const [showBookingCard, setShowBookingCard] = useState(true);
  const [showAttachments, setShowAttachments] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [otherParticipant, setOtherParticipant] = useState<{
    id: string;
    name: string;
    photo?: string;
    phone?: string;
    isOnline?: boolean;
    lastSeen?: string;
    rating?: number;
    profession?: string;
  } | null>(null);
  const [booking, setBooking] = useState<{
    service: string;
    time: string;
    location: string;
    price: number;
    status: string;
  } | null>(null);

  const { 
    joinConversation, 
    leaveConversation, 
    onNewMessage, 
    onMessageStatusChange, 
    onTyping,
    emitTyping,
    isUserOnline, 
    isConnected,
    getCurrentUserId
  } = useMessageSocket();

  // Fetch conversation details
  const fetchConversation = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // First try to get the conversation directly
      let response = await getConversationDetail(conversationId);
      
      // If 404, it might be a professional ID - try to start/get conversation
      if (!response.success && response.error?.includes('not found')) {
        console.log('Conversation not found, attempting to start conversation with professional:', conversationId);
        
        try {
          // Try to start a conversation with this professional
          const newConversation = await startConversation({
            professional_id: conversationId,
            initial_message: ''
          });
          
          // Redirect to the actual conversation ID
          router.replace(`/messages/${newConversation.id}`);
          return;
        } catch (startError) {
          setError('Could not start conversation. Please try again.');
          setLoading(false);
          return;
        }
      }
      
      if (response.success && response.data) {
        const data = response.data;
        setConversation(data.conversation);
        
        // Find the professional (other participant)
        const currentUserId = getCurrentUserId();
        const professional = data.conversation.participants?.find(
          (p: any) => p.user_id !== currentUserId && p.user_type === 'professional'
        );
        
        if (professional) {
          setOtherParticipant({
            id: professional.user_id,
            name: professional.name || 'Professional',
            photo: professional.photo,
            phone: professional.phone,
            isOnline: isUserOnline(professional.user_id),
            lastSeen: professional.last_seen ? new Date(professional.last_seen).toLocaleString() : 'Recently',
            rating: professional.rating,
            profession: professional.profession
          });
        }

        // Transform messages
        if (data.messages) {
          const transformedMessages = data.messages.map((msg: Message) => 
            transformMessage(msg, currentUserId)
          );
          setMessages(transformedMessages);
        }

        // Set booking if exists
        if (data.booking) {
          setBooking({
            service: data.booking.service_name || 'Service',
            time: new Date(data.booking.scheduled_time || data.booking.created_at).toLocaleString(),
            location: data.booking.address || 'Location not specified',
            price: data.booking.total_amount || 0,
            status: data.booking.status || 'pending'
          });
        }

        // Mark as read
        await markConversationRead(conversationId);
      } else {
        setError(response.error || 'Failed to load conversation');
      }
    } catch (err) {
      console.error('Error fetching conversation:', err);
      setError('Failed to load conversation');
    } finally {
      setLoading(false);
    }
  }, [conversationId, getCurrentUserId, isUserOnline]);

  // Initial fetch
  useEffect(() => {
    fetchConversation();
  }, [fetchConversation]);

  // Join/leave conversation room
  useEffect(() => {
    if (conversationId && isConnected) {
      joinConversation(conversationId);
      
      return () => {
        leaveConversation(conversationId);
      };
    }
  }, [conversationId, isConnected, joinConversation, leaveConversation]);

  // Listen for new messages
  useEffect(() => {
    const unsubscribe = onNewMessage((event: NewMessageEvent) => {
      if (event.conversation_id === conversationId) {
        const currentUserId = getCurrentUserId();
        const newMessage: ChatMessage = {
          id: event.message?.id || event.message_id,
          sender: event.sender_id === currentUserId ? 'user' : 'professional',
          message: event.message?.content || event.content,
          timestamp: new Date(event.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          status: event.message?.status || 'delivered',
          type: (event.message?.message_type || event.message_type) as 'text' | 'image' | 'location' | 'system'
        };
        
        setMessages(prev => {
          // Check for duplicates - avoid adding if message ID already exists
          if (prev.some(m => m.id === newMessage.id)) {
            return prev;
          }
          return [...prev, newMessage];
        });
        
        // Mark as read only if message is from other user
        if (event.sender_id !== currentUserId) {
          markConversationRead(conversationId);
        }
      }
    });
    
    return unsubscribe;
  }, [conversationId, getCurrentUserId, onNewMessage]);

  // Listen for message status changes
  useEffect(() => {
    const unsubscribe = onMessageStatusChange((event: MessageStatusEvent) => {
      if (event.conversation_id === conversationId) {
        setMessages(prev => prev.map(msg => {
          if (msg.id === event.message_id || event.message_id === 'all') {
            return { ...msg, status: event.status as 'sent' | 'delivered' | 'seen' };
          }
          return msg;
        }));
      }
    });
    
    return unsubscribe;
  }, [conversationId, onMessageStatusChange]);

  // Listen for typing indicators
  useEffect(() => {
    const unsubscribe = onTyping((event: TypingEvent) => {
      if (event.conversation_id === conversationId && event.user_id !== getCurrentUserId()) {
        setIsOtherTyping(event.is_typing);
        
        // Auto-clear typing indicator after 3 seconds
        if (event.is_typing) {
          setTimeout(() => setIsOtherTyping(false), 3000);
        }
      }
    });
    
    return unsubscribe;
  }, [conversationId, onTyping, getCurrentUserId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTyping = (value: string) => {
    setMessage(value);
    
    // Emit typing indicator
    if (value.length > 0) {
      emitTyping(conversationId, true);
      
      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Stop typing after 2 seconds of no input
      typingTimeoutRef.current = setTimeout(() => {
        emitTyping(conversationId, false);
      }, 2000);
    } else {
      emitTyping(conversationId, false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !otherParticipant || sending) return;
    
    const messageText = message.trim();
    setMessage('');
    emitTyping(conversationId, false);
    
    // Optimistic update
    const tempId = `temp-${Date.now()}`;
    const optimisticMessage: ChatMessage = {
      id: tempId,
      sender: 'user',
      message: messageText,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
      type: 'text'
    };
    
    setMessages(prev => [...prev, optimisticMessage]);
    
    try {
      setSending(true);
      const response = await sendMessageApi({
        conversation_id: conversationId,
        receiver_id: otherParticipant.id,
        message_type: 'text',
        content: messageText
      });
      
      // Update with real message
      setMessages(prev => prev.map(msg => 
        msg.id === tempId 
          ? { ...msg, id: response.data.id, status: response.data.status }
          : msg
      ));
    } catch (err) {
      console.error('Error sending message:', err);
      // Remove optimistic message on error
      setMessages(prev => prev.filter(msg => msg.id !== tempId));
      // Restore message to input
      setMessage(messageText);
    } finally {
      setSending(false);
    }
  };

  const handleQuickReply = (reply: string) => {
    setMessage(reply);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'ongoing':
      case 'in_progress':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const quickReplies = [
    "Thanks! On my way.",
    "Can you share your location?",
    "What's the status?",
    "How long will it take?",
    "Please share photos of work.",
    "Great work! Thank you."
  ];

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-[#F3F6F6] items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#00A884] animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Loading conversation...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-screen bg-[#F3F6F6] items-center justify-center p-4">
        <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Chat</h2>
        <p className="text-gray-600 mb-4 text-center">{error}</p>
        <button
          onClick={fetchConversation}
          className="px-4 py-2 bg-[#00A884] text-white rounded-lg font-bold hover:bg-[#00796B] transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#F3F6F6]">
      {/* Header */}
      <header className="bg-[#00A884] shadow-lg sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div className="relative">
                <img
                  src={otherParticipant?.photo || 'https://ui-avatars.com/api/?name=P&background=1E2A5E&color=fff'}
                  alt={otherParticipant?.name || 'Professional'}
                  className="w-10 h-10 rounded-full border-2 border-white object-cover"
                />
                {(otherParticipant?.isOnline || isUserOnline(otherParticipant?.id || '')) && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div>
                <h2 className="text-white font-black">{otherParticipant?.name || 'Professional'}</h2>
                <div className="flex items-center gap-2">
                  <p className="text-white/90 text-xs font-semibold">
                    {isOtherTyping ? 'typing...' : (otherParticipant?.isOnline || isUserOnline(otherParticipant?.id || '') ? 'Online' : otherParticipant?.lastSeen)}
                  </p>
                  {otherParticipant?.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-white/90 text-xs font-semibold">{otherParticipant.rating}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {otherParticipant?.phone && (
                <a
                  href={`tel:${otherParticipant.phone}`}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <Phone className="w-5 h-5 text-white" />
                </a>
              )}
              <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
                <MoreVertical className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Connection status */}
        {!isConnected && (
          <div className="bg-yellow-500 text-yellow-900 text-xs font-bold px-4 py-1 text-center">
            Reconnecting...
          </div>
        )}
      </header>

      {/* Booking Info Card */}
      {showBookingCard && booking && (
        <div className="bg-gradient-to-br from-[#00A884]/10 to-blue-50 border-b-2 border-[#00A884]/20 p-4">
          <div className="bg-white rounded-2xl shadow-lg p-4 border-2 border-[#00A884]/30">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-black text-gray-900">{booking.service}</h3>
                  <p className="text-sm text-gray-600 font-semibold">{booking.time}</p>
                </div>
              </div>
              <button
                onClick={() => setShowBookingCard(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ChevronUp className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700 font-semibold truncate">{booking.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm justify-end">
                <span className="text-gray-600 font-semibold">Price:</span>
                <span className="text-green-700 font-black">₹{booking.price}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm text-gray-600 font-semibold">Status:</span>
              <span className={`px-3 py-1 rounded-full text-xs font-black border-2 ${getStatusColor(booking.status)}`}>
                {booking.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            <div className="flex gap-2">
              <Link
                href={`/booking/${conversation?.booking_id || params.id}`}
                className="flex-1 flex items-center justify-center gap-2 bg-[#00A884] hover:bg-[#00796B] text-white font-bold py-2 px-4 rounded-xl transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span className="text-sm">View Booking</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {!showBookingCard && booking && (
        <button
          onClick={() => setShowBookingCard(true)}
          className="bg-[#00A884]/20 hover:bg-[#00A884]/30 text-[#00796B] font-bold py-2 px-4 border-b-2 border-[#00A884]/30 transition-colors flex items-center justify-center gap-2"
        >
          <ChevronDown className="w-4 h-4" />
          <span className="text-sm">Show Booking Details</span>
        </button>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-20">
        {messages.map((msg) => {
          if (msg.sender === 'system') {
            return (
              <div key={msg.id} className="flex justify-center my-4">
                <div className="bg-[#00A884]/10 backdrop-blur-sm text-[#00796B] text-xs font-bold px-4 py-2 rounded-full max-w-md text-center border border-[#00A884]/20">
                  {msg.message}
                </div>
              </div>
            );
          }

          const isProfessional = msg.sender === 'professional';
          return (
            <div key={msg.id} className={`flex ${isProfessional ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[80%] ${isProfessional ? 'order-1' : 'order-2'}`}>
                <div
                  className={`rounded-2xl px-4 py-3 shadow-md ${
                    isProfessional
                      ? 'bg-white text-gray-900 border-2 border-gray-200 rounded-tl-sm'
                      : 'bg-[#00A884] text-white rounded-tr-sm'
                  }`}
                >
                  <p className="text-sm font-medium break-words leading-relaxed">{msg.message}</p>
                </div>
                <div className={`flex items-center gap-1.5 mt-1 px-1 ${isProfessional ? 'justify-start' : 'justify-end'}`}>
                  <span className={`font-semibold text-xs ${isProfessional ? 'text-gray-500' : 'text-gray-600'}`}>
                    {msg.timestamp}
                  </span>
                  {!isProfessional && msg.status && (
                    <span className="flex items-center">
                      {getStatusIcon(msg.status)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Typing Indicator */}
        {isOtherTyping && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-900 border-2 border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-md">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      <div className="bg-white border-t-2 border-gray-200 px-4 py-3 overflow-x-auto">
        <div className="flex gap-2 pb-1">
          {quickReplies.map((reply, index) => (
            <button
              key={index}
              onClick={() => handleQuickReply(reply)}
              className="flex-shrink-0 bg-gradient-to-r from-[#00A884]/10 to-[#00796B]/10 hover:from-[#00A884]/20 hover:to-[#00796B]/20 text-[#00796B] font-bold text-sm px-4 py-2.5 rounded-full border-2 border-[#00A884]/30 transition-all transform hover:scale-105 shadow-sm"
            >
              {reply}
            </button>
          ))}
        </div>
      </div>

      {/* Typing Area */}
      <div className="bg-white border-t-2 border-gray-200 p-4 shadow-lg">
        {isRecording && (
          <div className="mb-2 flex items-center justify-center gap-2 bg-red-50 px-4 py-2 rounded-xl">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-red-700 font-bold text-sm">Recording... {recordingTime}s</span>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAttachments(!showAttachments)}
            className="p-2.5 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
          >
            <Paperclip className="w-5 h-5 text-gray-600" />
          </button>

          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={(e) => handleTyping(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="w-full text-gray-700 pl-12 pr-4 py-3 rounded-full bg-gray-100 border-2 border-gray-200 focus:border-[#00A884] focus:ring-2 focus:ring-[#00A884]/20 outline-none font-medium transition-all"
            />
            <button className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-200 rounded-full transition-colors">
              <Smile className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {message.trim() ? (
            <button
              onClick={handleSendMessage}
              disabled={sending}
              className="p-3.5 bg-[#00A884] hover:bg-[#00796B] disabled:opacity-50 rounded-full transition-all transform hover:scale-110 shadow-lg flex-shrink-0"
            >
              {sending ? (
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              ) : (
                <Send className="w-5 h-5 text-white" />
              )}
            </button>
          ) : (
            <button
              onClick={() => setIsRecording(!isRecording)}
              className={`p-3.5 ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-200 hover:bg-gray-300'} rounded-full transition-all transform hover:scale-110 flex-shrink-0 shadow-md`}
            >
              <Mic className={`w-5 h-5 ${isRecording ? 'text-white' : 'text-gray-600'} ${isRecording ? 'animate-pulse' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Attachments Sheet */}
      {showAttachments && (
        <div className="absolute bottom-20 left-0 right-0 bg-white rounded-t-3xl shadow-2xl border-t-2 border-gray-200 p-6 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-black text-gray-900">Share</h3>
            <button
              onClick={() => setShowAttachments(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronDown className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <button className="flex flex-col items-center gap-2 p-4 bg-purple-100 hover:bg-purple-200 rounded-2xl transition-colors">
              <Camera className="w-8 h-8 text-purple-600" />
              <span className="text-xs font-bold text-purple-900">Camera</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 bg-blue-100 hover:bg-blue-200 rounded-2xl transition-colors">
              <ImageIcon className="w-8 h-8 text-blue-600" />
              <span className="text-xs font-bold text-blue-900">Gallery</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 bg-green-100 hover:bg-green-200 rounded-2xl transition-colors">
              <MapPin className="w-8 h-8 text-green-600" />
              <span className="text-xs font-bold text-green-900">Location</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
