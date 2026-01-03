'use client';

import React from 'react';
import { Clock, MapPin, DollarSign, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface BookingRequest {
  id: string;
  customerName: string;
  customerPhoto: string;
  customerRating: number;
  isVerified: boolean;
  service: string;
  serviceCategory: string;
  description: string;
  time: string;
  date: string;
  duration: string;
  distance: number;
  earnings: number;
}

interface BookingRequestCardProps {
  request: BookingRequest;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}

export default function BookingRequestCard({ request, onAccept, onReject }: BookingRequestCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-lg border-2 border-gray-100 hover:border-teal-300 transition-all">
      {/* Customer Info */}
      <div className="flex items-center gap-3 mb-4">
        <img
          src={request.customerPhoto}
          alt={request.customerName}
          className="w-14 h-14 rounded-full object-cover border-2 border-teal-400"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-900 text-lg">{request.customerName}</h3>
            {request.isVerified && (
              <CheckCircle className="w-5 h-5 text-blue-500 fill-blue-500" />
            )}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-yellow-500 text-lg">⭐</span>
            <span className="font-bold text-gray-700">{request.customerRating}</span>
          </div>
        </div>
      </div>

      {/* Service Info */}
      <div className="mb-4 bg-teal-50 p-4 rounded-xl border-2 border-teal-100">
        <p className="font-bold text-gray-900 text-lg mb-1">{request.service}</p>
        <p className="text-sm text-gray-600 mb-3">{request.description}</p>
        
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-teal-600" />
            <span className="text-gray-700 font-semibold">{request.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">📅</span>
            <span className="text-gray-700 font-semibold">{request.date}</span>
          </div>
        </div>
        
        <div className="mt-2 flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="text-gray-600">Duration: <span className="font-semibold text-gray-800">{request.duration}</span></span>
        </div>
      </div>

      {/* Location & Earnings */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-red-500" />
          <span className="font-bold text-gray-900">{request.distance} km away</span>
        </div>
        <Link
          href={`https://maps.google.com/?q=${request.distance}km`}
          target="_blank"
          className="text-sm text-blue-600 hover:text-blue-700 font-semibold underline"
        >
          Open in Maps
        </Link>
      </div>

      {/* Earnings */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl mb-4 border-2 border-green-200">
        <div className="flex items-center justify-between">
          <span className="text-gray-700 font-semibold">💰 You Earn:</span>
          <span className="text-2xl font-black text-green-600">₹{request.earnings}</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">After platform fee</p>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onAccept(request.id)}
          className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          <span className="text-lg">🟢</span>
          ACCEPT JOB
        </button>
        <button
          onClick={() => onReject(request.id)}
          className="bg-white hover:bg-gray-50 text-gray-700 font-bold py-4 px-6 rounded-xl transition-all border-2 border-gray-300 hover:border-gray-400"
        >
          <span className="text-lg">⚪</span>
          REJECT
        </button>
      </div>

      {/* View Details Link */}
      <Link
        href={`/professional/bookings/request/${request.id}`}
        className="block text-center text-sm text-teal-600 hover:text-teal-700 font-semibold hover:underline mt-3"
      >
        View Full Details →
      </Link>
    </div>
  );
}
