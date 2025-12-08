'use client';

import React from 'react';
import { Zap, Wrench, ChefHat, Car, UtensilsCrossed, Star, MapPin, Clock, Calendar, Download, Package } from 'lucide-react';
import Image from 'next/image';

interface OrderCardProps {
  order: {
    id: string;
    service: string;
    category: 'electrical' | 'plumbing' | 'housekeeping' | 'cooking' | 'driving';
    status: 'completed' | 'cancelled' | 'ongoing';
    professional: {
      name: string;
      role: string;
      rating: number;
      image: string;
    };
    date: string;
    time: string;
    location: string;
    duration: string;
    payment: string;
    paymentStatus: string;
    badges?: string[];
  };
  onBookAgain?: () => void;
  onViewDetails?: () => void;
  onDownloadInvoice?: () => void;
  onCancel?: () => void;
}

export default function OrderCard({
  order,
  onBookAgain,
  onViewDetails,
  onDownloadInvoice,
  onCancel
}: OrderCardProps) {
  // Get service icon
  const getServiceIcon = (category: string) => {
    const iconProps = "w-5 h-5";
    switch (category) {
      case 'electrical':
        return <Zap className={`${iconProps} text-[#0066FF]`} />;
      case 'plumbing':
        return <Wrench className={`${iconProps} text-red-500`} />;
      case 'cooking':
        return <ChefHat className={`${iconProps} text-[#0066FF]`} />;
      case 'housekeeping':
        return <UtensilsCrossed className={`${iconProps} text-purple-500`} />;
      case 'driving':
        return <Car className={`${iconProps} text-green-500`} />;
      default:
        return <Package className={`${iconProps} text-gray-500`} />;
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 text-xs font-semibold rounded-full";
    switch (status) {
      case 'completed':
        return (
          <span className={`${baseClasses} bg-[#00C28C] text-white`}>
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className={`${baseClasses} bg-red-500 text-white`}>
            Cancelled
          </span>
        );
      case 'ongoing':
        return (
          <span className={`${baseClasses} bg-[#0066FF] text-white`}>
            Ongoing
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow">
      {/* Top Row - Service Info & Status */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
            {getServiceIcon(order.category)}
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{order.service}</h3>
          </div>
        </div>
        {getStatusBadge(order.status)}
      </div>

      {/* Professional Details */}
      <div className="mb-4 pb-4 border-b border-gray-100">
        <p className="text-xs font-semibold text-gray-500 mb-2">Professional</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
              <Image
                src={order.professional.image}
                alt={order.professional.name}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-semibold text-gray-900">{order.professional.name}</p>
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-600">{order.professional.role}</p>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-medium text-gray-900">
                    {order.professional.rating}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <button className="text-[#0066FF] text-sm font-semibold hover:underline">
            View Profile
          </button>
        </div>

        {/* Badges (if any) */}
        {order.badges && order.badges.length > 0 && (
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            {order.badges.map((badge, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded"
              >
                ✓ {badge}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Job Summary */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-500 mb-3">Job Summary</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-start gap-2">
            <Calendar className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500">Date:</p>
              <p className="text-sm font-medium text-gray-900">{order.date}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Clock className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500">Time:</p>
              <p className="text-sm font-medium text-gray-900">{order.time}</p>
            </div>
          </div>
          <div className="flex items-start gap-2 col-span-2">
            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500">Location:</p>
              <p className="text-sm font-medium text-gray-900">{order.location}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Clock className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500">Duration:</p>
              <p className="text-sm font-medium text-gray-900">{order.duration}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-4 h-4 flex items-center justify-center mt-0.5 flex-shrink-0">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div>
              <p className="text-xs text-gray-500">Payment:</p>
              <p className="text-sm font-medium text-gray-900">
                {order.payment} ({order.paymentStatus})
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={onBookAgain}
          className="flex-1 min-w-[120px] bg-[#0066FF] text-white py-2.5 rounded-lg font-semibold hover:bg-[#0052CC] transition-colors"
        >
          Book Again
        </button>
        <button
          onClick={onViewDetails}
          className="flex-1 min-w-[120px] border-2 border-[#0066FF] text-[#0066FF] py-2.5 rounded-lg font-semibold hover:bg-[#0066FF] hover:text-white transition-colors"
        >
          View Details
        </button>
        
        {/* Conditional buttons based on status */}
        {order.status === 'completed' && onDownloadInvoice && (
          <button
            onClick={onDownloadInvoice}
            className="border-2 border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download Invoice</span>
          </button>
        )}
        
        {order.status === 'cancelled' && onCancel && (
          <button
            onClick={onCancel}
            className="border-2 border-red-300 text-red-600 px-4 py-2.5 rounded-lg font-semibold hover:bg-red-50 transition-colors"
          >
            Cancele
          </button>
        )}
      </div>
    </div>
  );
}
