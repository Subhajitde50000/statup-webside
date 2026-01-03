'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Phone, MapPin, MoreVertical, Smile, Paperclip, Mic, Send, Camera, Image as ImageIcon, FileText, Navigation, ChevronDown, ChevronUp, AlertCircle, CheckCheck, Check } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface ChatMessage {
  id: number;
  sender: 'customer' | 'professional' | 'system';
  message: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'seen';
  type?: 'text' | 'image' | 'location' | 'invoice';
}

export default function ChatConversationPage() {
  const params = useParams();
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [message, setMessage] = useState('');
  const [showBookingCard, setShowBookingCard] = useState(true);
  const [showAttachments, setShowAttachments] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const customer = {
    id: params.id,
    name: 'Subhajit De',
    photo: 'https://i.pravatar.cc/150?img=33',
    isOnline: true,
    lastSeen: 'Online',
    phone: '+91 98765 43210'
  };

  const booking = {
    service: 'Fan Repair — Electrical',
    time: 'Today, 4:30 PM',
    location: 'Lake Town, Kolkata',
    earnings: 250,
    status: 'ongoing' as const
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: 'system',
      message: 'Booking #BK2458 accepted at 4:15 PM',
      timestamp: '4:15 PM',
      type: 'text'
    },
    {
      id: 2,
      sender: 'customer',
      message: 'Hi, I saw you accepted the booking. Can you please come 30 minutes earlier? I have to leave by 5 PM for an important meeting.',
      timestamp: '4:20 PM',
      type: 'text'
    },
    {
      id: 3,
      sender: 'professional',
      message: 'Hello! Yes, I can come earlier. I\'m currently finishing another job nearby. I should reach your place by 4:00 PM.',
      timestamp: '4:22 PM',
      status: 'seen',
      type: 'text'
    },
    {
      id: 4,
      sender: 'customer',
      message: 'That\'s perfect! Thank you so much. The main issue is with the ceiling fan in the living room - it\'s wobbling and making noise.',
      timestamp: '4:23 PM',
      type: 'text'
    },
    {
      id: 5,
      sender: 'professional',
      message: 'Understood. I\'ll bring the necessary tools. It might be a balance issue or loose screws. Should be fixed quickly.',
      timestamp: '4:24 PM',
      status: 'seen',
      type: 'text'
    },
    {
      id: 6,
      sender: 'customer',
      message: 'Great! Also, could you check the regulator? Sometimes the speed doesn\'t change properly.',
      timestamp: '4:25 PM',
      type: 'text'
    },
    {
      id: 7,
      sender: 'professional',
      message: 'Sure, I\'ll inspect the regulator as well. I\'m leaving now. Will reach in 10 minutes.',
      timestamp: '4:28 PM',
      status: 'delivered',
      type: 'text'
    },
    {
      id: 8,
      sender: 'customer',
      message: 'Perfect! I\'ll be waiting. The building is Lake Paradise Apartments, Tower B.',
      timestamp: '4:29 PM',
      type: 'text'
    },
    {
      id: 9,
      sender: 'professional',
      message: 'Got it! See you soon.',
      timestamp: '4:30 PM',
      status: 'sent',
      type: 'text'
    }
  ]);

  const quickReplies = [
    "I'm on the way. Reaching in 10 min.",
    "Running 5 minutes late.",
    "Please share the OTP.",
    "Can you describe the problem in detail?",
    "Job completed successfully!",
    "I'll need to check and get back to you."
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: ChatMessage = {
        id: messages.length + 1,
        sender: 'professional',
        message: message.trim(),
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        status: 'sent',
        type: 'text'
      };
      setMessages([...messages, newMessage]);
      setMessage('');
      
      // Simulate status updates
      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
        ));
      }, 1000);
      
      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === newMessage.id ? { ...msg, status: 'seen' } : msg
        ));
      }, 3000);
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
        return 'bg-green-100 text-green-800 border-green-300';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

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
                  src={customer.photo}
                  alt={customer.name}
                  className="w-10 h-10 rounded-full border-2 border-white object-cover"
                />
                {customer.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div>
                <h2 className="text-white font-black">{customer.name}</h2>
                <p className="text-white/90 text-xs font-semibold">{customer.lastSeen}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <a
                href={`tel:${customer.phone}`}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <Phone className="w-5 h-5 text-white" />
              </a>
              <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
                <MapPin className="w-5 h-5 text-white" />
              </button>
              <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
                <MoreVertical className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Booking Info Card */}
      {showBookingCard && (
        <div className="bg-gradient-to-br from-[#00A884]/10 to-blue-50 border-b-2 border-[#00A884]/20 p-4">
          <div className="bg-white rounded-2xl shadow-lg p-4 border-2 border-[#00A884]/30">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
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
                <span className="text-gray-700 font-semibold">{booking.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm justify-end">
                <span className="text-gray-600 font-semibold">Earnings:</span>
                <span className="text-green-700 font-black">₹{booking.earnings}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm text-gray-600 font-semibold">Status:</span>
              <span className={`px-3 py-1 rounded-full text-xs font-black border-2 ${getStatusColor(booking.status)}`}>
                {booking.status.toUpperCase()}
              </span>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold py-2 px-4 rounded-xl border-2 border-blue-300 transition-colors">
                <Navigation className="w-4 h-4" />
                <span className="text-sm">Open in Maps</span>
              </button>
              <Link
                href={`/professional/bookings/ongoing/${params.id}`}
                className="flex-1 flex items-center justify-center gap-2 bg-[#00A884] hover:bg-[#00796B] text-white font-bold py-2 px-4 rounded-xl transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span className="text-sm">View Full Details</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {!showBookingCard && (
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

          const isCustomer = msg.sender === 'customer';
          return (
            <div key={msg.id} className={`flex ${isCustomer ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[80%] ${isCustomer ? 'order-1' : 'order-2'}`}>
                <div
                  className={`rounded-2xl px-4 py-3 shadow-md ${
                    isCustomer
                      ? 'bg-white text-gray-900 border-2 border-gray-200 rounded-tl-sm'
                      : 'bg-[#00A884] text-white rounded-tr-sm'
                  }`}
                >
                  <p className="text-sm font-medium break-words leading-relaxed">{msg.message}</p>
                </div>
                <div className={`flex items-center gap-1.5 mt-1 px-1 ${isCustomer ? 'justify-start' : 'justify-end'}`}>
                  <span className={`font-semibold text-xs ${isCustomer ? 'text-gray-500' : 'text-gray-600'}`}>
                    {msg.timestamp}
                  </span>
                  {!isCustomer && msg.status && (
                    <span className="flex items-center">
                      {getStatusIcon(msg.status)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Typing Indicator - shows when customer is typing */}
        {isTyping && (
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
              onChange={(e) => {
                setMessage(e.target.value);
                setIsTyping(e.target.value.length > 0);
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="w-full pl-12 pr-4 py-3 rounded-full bg-gray-100 border-2 border-gray-200 focus:border-[#00A884] focus:ring-2 focus:ring-[#00A884]/20 outline-none font-medium transition-all"
            />
            <button className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-200 rounded-full transition-colors">
              <Smile className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {message.trim() ? (
            <button
              onClick={handleSendMessage}
              className="p-3.5 bg-[#00A884] hover:bg-[#00796B] rounded-full transition-all transform hover:scale-110 shadow-lg flex-shrink-0"
            >
              <Send className="w-5 h-5 text-white" />
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
            <button className="flex flex-col items-center gap-2 p-4 bg-orange-100 hover:bg-orange-200 rounded-2xl transition-colors">
              <FileText className="w-8 h-8 text-orange-600" />
              <span className="text-xs font-bold text-orange-900">Invoice</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 bg-red-100 hover:bg-red-200 rounded-2xl transition-colors">
              <Mic className="w-8 h-8 text-red-600" />
              <span className="text-xs font-bold text-red-900">Voice</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 bg-teal-100 hover:bg-teal-200 rounded-2xl transition-colors">
              <FileText className="w-8 h-8 text-teal-600" />
              <span className="text-xs font-bold text-teal-900">Summary</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
