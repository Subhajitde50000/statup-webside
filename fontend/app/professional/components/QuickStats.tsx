'use client';

import React from 'react';
import { Star, Briefcase, MessageSquare, Car } from 'lucide-react';

interface QuickStatsProps {
  rating: number;
  totalJobs: number;
  newReviews: number;
  travelDistance: number;
}

export default function QuickStats({
  rating,
  totalJobs,
  newReviews,
  travelDistance
}: QuickStatsProps) {
  const stats = [
    {
      icon: Star,
      label: 'Rating',
      value: `${rating} / 5`,
      color: 'from-yellow-400 to-yellow-500',
      iconColor: 'text-yellow-600'
    },
    {
      icon: Briefcase,
      label: 'Total Jobs',
      value: totalJobs,
      color: 'from-blue-400 to-blue-500',
      iconColor: 'text-blue-600'
    },
    {
      icon: MessageSquare,
      label: 'New Reviews',
      value: newReviews,
      color: 'from-green-400 to-green-500',
      iconColor: 'text-green-600'
    },
    {
      icon: Car,
      label: 'Travel Distance',
      value: `${travelDistance} km`,
      color: 'from-purple-400 to-purple-500',
      iconColor: 'text-purple-600'
    }
  ];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg">
      <h3 className="text-lg font-bold text-gray-900 mb-4">📊 Quick Stats (This Week)</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl p-4 text-center border-2 border-gray-100 hover:border-teal-200 transition-all"
            >
              <div className="flex justify-center mb-2">
                <div className={`bg-gradient-to-br ${stat.color} p-3 rounded-full`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-xs text-gray-600 font-semibold mb-1">{stat.label}</p>
              <p className="text-xl font-black text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
