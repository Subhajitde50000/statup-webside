'use client';

import React from 'react';
import { Wifi } from 'lucide-react';

interface StatusToggleProps {
  isOnline: boolean;
  onToggle: (status: boolean) => void;
}

export default function StatusToggle({ isOnline, onToggle }: StatusToggleProps) {
  return (
    <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-3xl p-6 shadow-lg text-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-3 rounded-full">
            <Wifi className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold">
              {isOnline ? '🟢 Online' : '⚪ Offline'}
            </h3>
            <p className="text-sm text-teal-100">
              {isOnline ? 'Accepting bookings' : 'Not visible to customers'}
            </p>
          </div>
        </div>
        
        {/* Toggle Switch */}
        <button
          onClick={() => onToggle(!isOnline)}
          className={`relative w-16 h-8 rounded-full transition-all duration-300 ${
            isOnline ? 'bg-white' : 'bg-white/30'
          }`}
        >
          <div
            className={`absolute top-1 left-1 w-6 h-6 rounded-full transition-all duration-300 ${
              isOnline ? 'translate-x-8 bg-teal-600' : 'translate-x-0 bg-gray-400'
            }`}
          />
        </button>
      </div>
      
      <p className="text-sm text-teal-50">
        Switch to Online to receive new booking requests.
      </p>
    </div>
  );
}
