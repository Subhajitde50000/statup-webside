'use client';

import React from 'react';
import { XCircle } from 'lucide-react';

interface CancelledJob {
  id: string;
  customerName: string;
  customerPhoto?: string;
  service: string;
  date: string;
  time: string;
  cancellationReason: 'customer' | 'professional' | 'auto';
  reasonText: string;
}

interface CancelledJobCardProps {
  job: CancelledJob;
}

export default function CancelledJobCard({ job }: CancelledJobCardProps) {
  const getCancellationBadge = () => {
    switch (job.cancellationReason) {
      case 'customer':
        return { text: 'Customer Cancelled', color: 'bg-orange-100 text-orange-700 border-orange-300' };
      case 'professional':
        return { text: 'Professional Cancelled', color: 'bg-red-100 text-red-700 border-red-300' };
      case 'auto':
        return { text: 'Auto-Cancelled', color: 'bg-gray-100 text-gray-700 border-gray-300' };
    }
  };

  const badge = getCancellationBadge();

  return (
    <div className="bg-white rounded-2xl p-5 shadow-lg border-2 border-gray-100">
      {/* Header with Badge */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {job.customerPhoto ? (
            <img
              src={job.customerPhoto}
              alt={job.customerName}
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-300 opacity-60"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
              <XCircle className="w-6 h-6 text-gray-400" />
            </div>
          )}
          <div>
            <h3 className="font-bold text-gray-900">{job.customerName}</h3>
            <p className="text-sm text-gray-600">{job.service}</p>
          </div>
        </div>
      </div>

      {/* Job Details */}
      <div className="bg-gray-50 p-4 rounded-xl mb-4 border-2 border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Date</span>
          <span className="text-sm font-bold text-gray-900">{job.date}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Time</span>
          <span className="text-sm font-bold text-gray-900">{job.time}</span>
        </div>
      </div>

      {/* Cancellation Badge */}
      <div className={`px-4 py-2 rounded-lg border-2 ${badge.color} mb-3 text-center`}>
        <span className="font-bold text-sm">{badge.text}</span>
      </div>

      {/* Reason */}
      <div className="bg-red-50 p-4 rounded-xl border-2 border-red-100">
        <p className="text-sm font-semibold text-gray-700 mb-1">Cancellation Reason:</p>
        <p className="text-sm text-gray-600 italic">"{job.reasonText}"</p>
      </div>
    </div>
  );
}
