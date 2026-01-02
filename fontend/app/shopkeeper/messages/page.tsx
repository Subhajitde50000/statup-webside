'use client';

import React, { useState } from 'react';
import ShopkeeperNavbar from '../components/ShopkeeperNavbar';
import { Search, Send, MoreVertical, Phone, Video, Archive, Trash2, Image, Paperclip, Smile, Check, CheckCheck, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Mock data for conversations
const MOCK_CONVERSATIONS = [
  {
    id: 1,
    userName: 'Rajesh Kumar',
    userType: 'Professional',
    avatar: 'RK',
    lastMessage: 'Do you have the 10mm copper wire in stock?',
    timestamp: '2 min ago',
    unreadCount: 3,
    online: true,
    messages: [
      {
        id: 1,
        sender: 'user',
        text: 'Hi, I need some electrical supplies',
        timestamp: '10:30 AM',
        date: 'Today',
        read: true
      },
      {
        id: 2,
        sender: 'shop',
        text: 'Hello! Yes, please let me know what you need.',
        timestamp: '10:31 AM',
        date: 'Today',
        read: true
      },
      {
        id: 3,
        sender: 'user',
        text: 'Do you have the 10mm copper wire in stock?',
        timestamp: '10:35 AM',
        date: 'Today',
        read: false
      }
    ]
  },
  {
    id: 2,
    userName: 'Amit Electricals',
    userType: 'Professional',
    avatar: 'AE',
    lastMessage: 'Thanks for the quick delivery!',
    timestamp: '15 min ago',
    unreadCount: 0,
    online: false,
    messages: [
      {
        id: 1,
        sender: 'user',
        text: 'Order #12345 has been delivered',
        timestamp: '09:45 AM',
        date: 'Today',
        read: true
      },
      {
        id: 2,
        sender: 'shop',
        text: 'Great! Hope everything is in good condition.',
        timestamp: '09:50 AM',
        date: 'Today',
        read: true
      },
      {
        id: 3,
        sender: 'user',
        text: 'Thanks for the quick delivery!',
        timestamp: '10:20 AM',
        date: 'Today',
        read: true
      }
    ]
  },
  {
    id: 3,
    userName: 'Priya Sharma',
    userType: 'Customer',
    avatar: 'PS',
    lastMessage: 'Can I get bulk discount on switches?',
    timestamp: '1 hour ago',
    unreadCount: 5,
    online: true,
    messages: [
      {
        id: 1,
        sender: 'user',
        text: 'Hello, I need 50 anchor switches',
        timestamp: '08:30 AM',
        date: 'Today',
        read: true
      },
      {
        id: 2,
        sender: 'shop',
        text: 'Sure, which model are you looking for?',
        timestamp: '08:35 AM',
        date: 'Today',
        read: true
      },
      {
        id: 3,
        sender: 'user',
        text: 'Anchor Roma Classic 6A',
        timestamp: '08:40 AM',
        date: 'Today',
        read: false
      },
      {
        id: 4,
        sender: 'user',
        text: 'Can I get bulk discount on switches?',
        timestamp: '09:15 AM',
        date: 'Today',
        read: false
      }
    ]
  },
  {
    id: 4,
    userName: 'Suresh Plumbing',
    userType: 'Professional',
    avatar: 'SP',
    lastMessage: 'When will the PVC pipes arrive?',
    timestamp: '2 hours ago',
    unreadCount: 1,
    online: false,
    messages: [
      {
        id: 1,
        sender: 'user',
        text: 'I ordered PVC pipes yesterday',
        timestamp: 'Yesterday 05:30 PM',
        date: 'Yesterday',
        read: true
      },
      {
        id: 2,
        sender: 'shop',
        text: 'Yes, your order is being prepared.',
        timestamp: 'Yesterday 05:35 PM',
        date: 'Yesterday',
        read: true
      },
      {
        id: 3,
        sender: 'user',
        text: 'When will the PVC pipes arrive?',
        timestamp: '08:45 AM',
        date: 'Today',
        read: false
      }
    ]
  },
  {
    id: 5,
    userName: 'Vikram Tools',
    userType: 'Professional',
    avatar: 'VT',
    lastMessage: 'Payment completed for order #12348',
    timestamp: '3 hours ago',
    unreadCount: 0,
    online: true,
    messages: [
      {
        id: 1,
        sender: 'user',
        text: 'I have placed an order for drill bits',
        timestamp: '07:00 AM',
        date: 'Today',
        read: true
      },
      {
        id: 2,
        sender: 'shop',
        text: 'Received! Will ship today.',
        timestamp: '07:15 AM',
        date: 'Today',
        read: true
      },
      {
        id: 3,
        sender: 'user',
        text: 'Payment completed for order #12348',
        timestamp: '07:30 AM',
        date: 'Today',
        read: true
      }
    ]
  },
  {
    id: 6,
    userName: 'Anita Hardware',
    userType: 'Customer',
    avatar: 'AH',
    lastMessage: 'Do you deliver to Sector 5?',
    timestamp: 'Yesterday',
    unreadCount: 2,
    online: false,
    messages: [
      {
        id: 1,
        sender: 'user',
        text: 'Hi, I need some hardware items',
        timestamp: 'Yesterday 03:00 PM',
        date: 'Yesterday',
        read: true
      },
      {
        id: 2,
        sender: 'user',
        text: 'Do you deliver to Sector 5?',
        timestamp: 'Yesterday 03:15 PM',
        date: 'Yesterday',
        read: false
      }
    ]
  }
];

export default function ShopkeeperMessagesPage() {
  const router = useRouter();
  const [selectedConversation, setSelectedConversation] = useState(MOCK_CONVERSATIONS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [showChatOnMobile, setShowChatOnMobile] = useState(false);

  const filteredConversations = MOCK_CONVERSATIONS.filter(conv =>
    conv.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUnread = MOCK_CONVERSATIONS.reduce((sum, conv) => sum + conv.unreadCount, 0);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      console.log('Sending message:', messageInput);
      // Add API call here
      setMessageInput('');
    }
  };

  const handleSelectConversation = (conversation: typeof MOCK_CONVERSATIONS[0]) => {
    setSelectedConversation(conversation);
    setShowChatOnMobile(true);
  };

  const handleBackToList = () => {
    setShowChatOnMobile(false);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <ShopkeeperNavbar />

      <main className="max-w-[1400px] mx-auto px-4 lg:px-6 py-6 lg:py-8 pb-24 lg:pb-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-[#0C0C0C]">Messages</h1>
          <p className="text-[#555555] mt-1">
            {totalUnread > 0 ? (
              <span className="font-semibold text-[#E53935]">{totalUnread} unread messages</span>
            ) : (
              <span>All caught up!</span>
            )}
          </p>
        </div>

        {/* Messages Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 h-[calc(100vh-250px)] min-h-[600px]">
            
            {/* Left Sidebar - Conversations List */}
            <div className={`lg:col-span-1 border-r border-gray-200 flex flex-col ${
              showChatOnMobile ? 'hidden lg:flex' : 'flex'
            }`}>
              {/* Search */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C897] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => handleSelectConversation(conversation)}
                    className={`w-full p-4 border-b border-gray-200 hover:bg-gray-50 transition text-left ${
                      selectedConversation.id === conversation.id ? 'bg-[#00C897]/10 border-l-4 border-l-[#00C897]' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                          {conversation.avatar}
                        </div>
                        {conversation.online && (
                          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-gray-900 truncate">{conversation.userName}</h3>
                          <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{conversation.timestamp}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600 truncate pr-2">{conversation.lastMessage}</p>
                          {conversation.unreadCount > 0 && (
                            <span className="flex-shrink-0 bg-[#E53935] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500 mt-1 inline-block">{conversation.userType}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Side - Chat Area */}
            <div className={`lg:col-span-2 flex flex-col ${
              showChatOnMobile ? 'flex' : 'hidden lg:flex'
            }`}>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                <div className="flex items-center gap-3">
                  {/* Back button for mobile */}
                  <button
                    onClick={handleBackToList}
                    className="lg:hidden p-2 hover:bg-gray-200 rounded-lg transition -ml-2"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                      {selectedConversation.avatar}
                    </div>
                    {selectedConversation.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedConversation.userName}</h3>
                    <p className="text-xs text-gray-500">
                      {selectedConversation.online ? (
                        <span className="text-green-600 font-medium">● Online</span>
                      ) : (
                        <span>Offline</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-200 rounded-lg transition">
                    <Phone className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="hidden sm:block p-2 hover:bg-gray-200 rounded-lg transition">
                    <Video className="w-5 h-5 text-gray-600" />
                  </button>
                  <div className="relative">
                    <button
                      onClick={() => setShowOptions(!showOptions)}
                      className="p-2 hover:bg-gray-200 rounded-lg transition"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-600" />
                    </button>
                    {showOptions && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                        <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                          <Archive className="w-4 h-4" />
                          Archive Chat
                        </button>
                        <button className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2">
                          <Trash2 className="w-4 h-4" />
                          Delete Chat
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                {selectedConversation.messages.map((message, index) => {
                  const showDateSeparator = index === 0 || 
                    selectedConversation.messages[index - 1].date !== message.date;

                  return (
                    <div key={message.id}>
                      {/* Date Separator */}
                      {showDateSeparator && (
                        <div className="flex items-center justify-center my-4">
                          <div className="bg-gray-200 text-gray-600 text-xs font-medium px-3 py-1 rounded-full">
                            {message.date}
                          </div>
                        </div>
                      )}

                      {/* Message */}
                      <div className={`flex ${message.sender === 'shop' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] ${message.sender === 'shop' ? 'order-2' : 'order-1'}`}>
                          <div className={`rounded-2xl px-4 py-2.5 ${
                            message.sender === 'shop'
                              ? 'bg-[#00C897] text-white rounded-br-none'
                              : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
                          }`}>
                            <p className="text-sm">{message.text}</p>
                          </div>
                          <div className={`flex items-center gap-1 mt-1 text-xs text-gray-500 ${
                            message.sender === 'shop' ? 'justify-end' : 'justify-start'
                          }`}>
                            <span>{message.timestamp}</span>
                            {message.sender === 'shop' && (
                              message.read ? (
                                <CheckCheck className="w-4 h-4 text-blue-500" />
                              ) : (
                                <Check className="w-4 h-4" />
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-end gap-2">
                  <button className="p-2.5 hover:bg-gray-100 rounded-lg transition">
                    <Paperclip className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2.5 hover:bg-gray-100 rounded-lg transition">
                    <Image className="w-5 h-5 text-gray-600" />
                  </button>
                  
                  <div className="flex-1 relative">
                    <textarea
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder="Type a message..."
                      rows={1}
                      className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C897] focus:border-transparent resize-none"
                    />
                    <button className="absolute right-3 bottom-2.5 p-1 hover:bg-gray-100 rounded-lg transition">
                      <Smile className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                  
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                    className="p-3 bg-[#00C897] text-white rounded-lg hover:bg-[#00B184] transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
