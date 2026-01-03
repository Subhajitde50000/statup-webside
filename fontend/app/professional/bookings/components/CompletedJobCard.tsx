'use client';

import React from 'react';
import { Star } from 'lucide-react';

interface CompletedJob {
  id: string;
  customerName: string;
  customerPhoto: string;
  service: string;
  date: string;
  time: string;
  earnings: number;
  customerRating?: number;
}

interface CompletedJobCardProps {
  job: CompletedJob;
  onViewSummary: (id: string) => void;
}

export default function CompletedJobCard({ job, onViewSummary }: CompletedJobCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-lg border-2 border-gray-100 hover:border-teal-200 transition-all">
      {/* Customer Info */}
      <div className="flex items-center gap-3 mb-4">
        <img
          src={job.customerPhoto}
          alt={job.customerName}
          className="w-12 h-12 rounded-full object-cover border-2 border-green-400"
        />
        <div className="flex-1">
          <h3 className="font-bold text-gray-900">{job.customerName}</h3>
          <p className="text-sm text-gray-600">{job.service}</p>
        </div>
      </div>

      {/* Job Details */}
      <div className="bg-green-50 p-4 rounded-xl mb-4 border-2 border-green-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Date & Time</span>
          <span className="text-sm font-bold text-gray-900">{job.date}</span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Time</span>
          <span className="text-sm font-bold text-gray-900">{job.time}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Total Earnings</span>
          <span className="text-xl font-black text-green-600">₹{job.earnings}</span>
        </div>
      </div>

      {/* Customer Rating */}
      {job.customerRating && (
        <div className="flex items-center justify-center gap-2 mb-4 bg-yellow-50 p-3 rounded-xl border-2 border-yellow-100">
          <span className="text-sm font-semibold text-gray-700">Customer Rating:</span>
          <div className="flex items-center gap-1">
            {Array.from({ length: job.customerRating }).map((_, i) => (
              <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            ))}
          </div>
          <span className="font-bold text-gray-900">{job.customerRating}/5</span>
        </div>
      )}

      {/* View Summary Button */}
      <button
        onClick={() => onViewSummary(job.id)}
        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-xl transition-all"
      >
        View Summary
      </button>
    </div>
  );
}
