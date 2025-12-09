'use client';

import React from 'react';
import { Clock, MapPin, Phone } from 'lucide-react';

interface AcceptedBooking {
  id: string;
  customerName: string;
  customerPhoto: string;
  customerRating: number;
  customerPhone?: string;
  service: string;
  time: string;
  duration: string;
  distance: number;
  note?: string;
  isUrgent?: boolean;
}

interface AcceptedBookingCardProps {
  booking: AcceptedBooking;
  onStartJob: (id: string) => void;
}

export default function AcceptedBookingCard({ booking, onStartJob }: AcceptedBookingCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-lg border-2 border-gray-100">
      {/* Customer Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <img
            src={booking.customerPhoto}
            alt={booking.customerName}
            className="w-12 h-12 rounded-full object-cover border-2 border-teal-400"
          />
          <div>
            <h3 className="font-bold text-gray-900">{booking.customerName}</h3>
            <div className="flex items-center gap-1">
              <span className="text-yellow-500">⭐</span>
              <span className="text-sm font-bold text-gray-700">{booking.customerRating}</span>
            </div>
          </div>
        </div>
        
        {booking.customerPhone && (
          <a
            href={`tel:${booking.customerPhone}`}
            className="bg-teal-600 hover:bg-teal-700 p-3 rounded-full transition-colors shadow-md"
          >
            <Phone className="w-5 h-5 text-white" />
          </a>
        )}
      </div>

      {/* Job Info */}
      <div className="bg-blue-50 p-4 rounded-xl mb-4 border-2 border-blue-100">
        <p className="font-bold text-gray-900 mb-2">{booking.service}</p>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="text-gray-700 font-semibold">{booking.time}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Duration:</span>
            <span className="font-semibold text-gray-800">{booking.duration}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-red-500" />
            <span className="font-semibold text-gray-800">{booking.distance} km away</span>
          </div>
        </div>
      </div>

      {/* Note */}
      {booking.note && (
        <div className={`p-3 rounded-lg mb-4 ${
          booking.isUrgent 
            ? 'bg-red-50 border-2 border-red-200' 
            : 'bg-gray-50 border-2 border-gray-200'
        }`}>
          <p className={`text-sm font-semibold ${
            booking.isUrgent ? 'text-red-700' : 'text-gray-700'
          }`}>
            📝 Note: {booking.note}
          </p>
        </div>
      )}

      {/* Start Job Button */}
      <button
        onClick={() => onStartJob(booking.id)}
        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
      >
        🟢 Start Job →
      </button>
    </div>
  );
}
