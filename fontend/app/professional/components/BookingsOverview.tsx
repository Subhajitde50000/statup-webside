'use client';

import React from 'react';
import { Calendar } from 'lucide-react';

interface BookingsOverviewProps {
  total: number;
  completed: number;
  pending: number;
  cancelled: number;
  onViewSchedule: () => void;
}

export default function BookingsOverview({
  total,
  completed,
  pending,
  cancelled,
  onViewSchedule
}: BookingsOverviewProps) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <Calendar className="w-6 h-6 text-teal-600" />
        <h3 className="text-lg font-bold text-gray-900">Today's Bookings Overview</h3>
      </div>

      {/* Stats */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-semibold">Total:</span>
          <span className="text-2xl font-black text-gray-900">{total}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-700">Completed:</span>
          <span className="text-xl font-bold text-green-600">{completed}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-700">Pending:</span>
          <span className="text-xl font-bold text-orange-600">{pending}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-700">Cancelled:</span>
          <span className="text-xl font-bold text-red-600">{cancelled}</span>
        </div>
      </div>

      {/* Button */}
      <button
        onClick={onViewSchedule}
        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 rounded-xl transition-colors"
      >
        View Today's Schedule
      </button>
    </div>
  );
}
