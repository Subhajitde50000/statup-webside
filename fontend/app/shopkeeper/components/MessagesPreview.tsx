'use client';

import React from 'react';
import { MessageCircle, User } from 'lucide-react';

const messagesData = [
  {
    id: 1,
    name: 'Rahul Das',
    message: 'Thanks for the update!',
    time: '10:45 AM',
    isRead: true,
  },
  {
    id: 2,
    name: 'Priya Sen',
    message: 'When will my order be ready?',
    time: '11:30 AM',
    isRead: false,
  },
];

export default function MessagesPreview() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-5 h-5 text-[#555555]" />
            <h3 className="text-lg font-semibold text-[#0C0C0C]">Messages</h3>
          </div>
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            {messagesData.filter(m => !m.isRead).length}
          </span>
        </div>
      </div>

      {/* Messages List */}
      <div className="divide-y divide-gray-100">
        {messagesData.map((msg) => (
          <div
            key={msg.id}
            className={`p-4 hover:bg-gray-50 cursor-pointer transition ${
              !msg.isRead ? 'bg-blue-50' : ''
            }`}
          >
            <div className="flex items-start space-x-3">
              {/* Avatar */}
              <div className="w-10 h-10 bg-[#00C897] rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-white" />
              </div>

              {/* Message Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-semibold text-[#0C0C0C]">{msg.name}</h4>
                  <span className="text-xs text-[#555555]">{msg.time}</span>
                </div>
                <p className="text-sm text-[#555555] truncate">{msg.message}</p>
                {!msg.isRead && (
                  <span className="inline-block mt-1 text-xs text-red-600 font-medium">Unread</span>
                )}
                {msg.isRead && (
                  <span className="inline-block mt-1 text-xs text-green-600 font-medium">Read</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Messages Button */}
      <div className="p-4 border-t border-gray-100">
        <button className="w-full text-[#00C897] hover:text-[#00a077] font-medium text-sm transition">
          View All Messages →
        </button>
      </div>
    </div>
  );
}
