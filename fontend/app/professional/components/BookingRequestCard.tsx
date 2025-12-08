'use client';

import React from 'react';
import { User, Clock, DollarSign, MapPin, Flame } from 'lucide-react';

interface BookingRequest {
  id: string;
  customerName: string;
  customerImage?: string;
  service: string;
  time: string;
  budget: number;
  distance: number;
  urgency: 'high' | 'normal' | 'low';
  address?: string;
  estimatedDuration?: string;
}

interface BookingRequestCardProps {
  request: BookingRequest;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onViewDetails: (id: string) => void;
}

export default function BookingRequestCard({
  request,
  onAccept,
  onReject,
  onViewDetails
}: BookingRequestCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-md border-2 border-gray-100 hover:border-teal-200 transition-all">
      {/* Customer Info */}
      <div className="flex items-center gap-3 mb-4">
        {request.customerImage ? (
          <img
            src={request.customerImage}
            alt={request.customerName}
            className="w-12 h-12 rounded-full object-cover border-2 border-teal-400"
          />
        ) : (
          <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
        )}
        <div className="flex-1">
          <p className="font-bold text-gray-900">{request.customerName}</p>
          <p className="text-sm text-gray-600">{request.service}</p>
        </div>
        {request.urgency === 'high' && (
          <span className="bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full">
            URGENT
          </span>
        )}
      </div>

      {/* Details Grid */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="text-gray-700">
            <span className="font-semibold">Time:</span> {request.time}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <DollarSign className="w-4 h-4 text-gray-500" />
          <span className="text-gray-700">
            <span className="font-semibold">Budget:</span> ₹{request.budget}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-gray-500" />
          <span className="text-gray-700">
            <span className="font-semibold">Distance:</span> {request.distance} km
            {request.address && <span className="text-gray-500"> • {request.address}</span>}
          </span>
        </div>
        {request.estimatedDuration && (
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700">
              <span className="font-semibold">Duration:</span> {request.estimatedDuration}
            </span>
          </div>
        )}
        {request.urgency === 'high' && (
          <div className="flex items-center gap-2 text-sm bg-red-50 p-2 rounded-lg -mx-2">
            <Flame className="w-4 h-4 text-red-500" />
            <span className="text-red-600 font-bold">🔥 High Priority - Quick response needed!</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-3">
        <button
          onClick={() => onAccept(request.id)}
          className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-md hover:shadow-lg"
        >
          Accept
        </button>
        <button
          onClick={() => onReject(request.id)}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-md hover:shadow-lg"
        >
          Reject
        </button>
      </div>

      {/* View Details Link */}
      <button
        onClick={() => onViewDetails(request.id)}
        className="text-sm text-teal-600 hover:text-teal-700 font-semibold hover:underline w-full text-center"
      >
        View full booking details
      </button>
    </div>
  );
}
