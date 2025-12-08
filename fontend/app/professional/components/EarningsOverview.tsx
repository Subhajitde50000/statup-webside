'use client';

import React, { useState } from 'react';
import { TrendingUp, Eye, EyeOff } from 'lucide-react';

interface EarningsOverviewProps {
  totalEarnings: number;
  todayEarnings: number;
  completedJobs: number;
  payoutDate: string;
  percentageChange: number;
}

export default function EarningsOverview({
  totalEarnings,
  todayEarnings,
  completedJobs,
  payoutDate,
  percentageChange
}: EarningsOverviewProps) {
  const [showEarnings, setShowEarnings] = useState(true);

  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Earnings Overview</h3>
        <button
          onClick={() => setShowEarnings(!showEarnings)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          {showEarnings ? (
            <Eye className="w-5 h-5 text-gray-600" />
          ) : (
            <EyeOff className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Main Earnings */}
      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-2">💰 Total Earnings (This Month)</p>
        <div className="flex items-baseline gap-3">
          <h2 className="text-4xl font-black text-gray-900">
            {showEarnings ? `₹ ${totalEarnings.toLocaleString()}` : '₹ ••,•••'}
          </h2>
          <span className="text-green-600 font-bold flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            +{percentageChange}%
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Payout scheduled on: <span className="font-bold text-gray-700">{payoutDate}</span>
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        {/* Today's Earnings */}
        <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl p-4 border-2 border-teal-200">
          <p className="text-sm text-teal-700 font-semibold mb-1">Today's Earnings</p>
          <p className="text-xs text-teal-600 mb-2">(This Month)</p>
          <p className="text-2xl font-black text-teal-800">
            {showEarnings ? `→ ₹${todayEarnings.toLocaleString()}` : '→ ₹•,•••'}
          </p>
        </div>

        {/* Completed Jobs */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 border-2 border-green-200">
          <p className="text-sm text-green-700 font-semibold mb-1">Completed Jobs</p>
          <p className="text-xs text-green-600 mb-2">(This Month)</p>
          <p className="text-2xl font-black text-green-800">→ {completedJobs}</p>
        </div>
      </div>
    </div>
  );
}
