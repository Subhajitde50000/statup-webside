'use client';

import React from 'react';
import { TrendingUp, BarChart3 } from 'lucide-react';

export default function SalesChart() {
  const chartData = [
    { day: 'Sun', value: 45 },
    { day: 'Mon', value: 65 },
    { day: 'Tue', value: 58 },
    { day: 'Wed', value: 85 },
    { day: 'Thu', value: 72 },
    { day: 'Fri', value: 90 },
    { day: 'Sat', value: 68 },
    { day: 'Sun', value: 52 },
  ];

  const maxValue = Math.max(...chartData.map(d => d.value));

  return (
    <div className="bg-gradient-to-br from-[#00C897] to-[#00a077] rounded-xl shadow-lg p-6 text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <BarChart3 className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Sales Chart</h3>
          </div>
          <p className="text-sm text-white/80">Weekly Performance</p>
        </div>
        <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition backdrop-blur-sm">
          View Reports
        </button>
      </div>

      {/* Chart */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-1 text-sm">
          <span className="text-white/80">₹20K</span>
        </div>
        <div className="flex items-center space-x-1 text-sm">
          <span className="text-white/80">90K</span>
        </div>
        <div className="flex items-center space-x-1 text-sm">
          <span className="text-white/80">60K</span>
        </div>
        <div className="flex items-center space-x-1 text-sm">
          <span className="text-white/80">30K</span>
        </div>
        <div className="flex items-center space-x-1 text-sm">
          <span className="text-white/80">0</span>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="flex items-end justify-between space-x-2 h-40 mb-4">
        {chartData.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div className="w-full bg-white/20 rounded-t-lg relative" style={{ height: '100%' }}>
              <div
                className="w-full bg-white rounded-t-lg absolute bottom-0 transition-all duration-500"
                style={{ height: `${(item.value / maxValue) * 100}%` }}
              ></div>
            </div>
            <span className="text-xs mt-2 text-white/80">{item.day}</span>
          </div>
        ))}
      </div>

      {/* Trend Indicator */}
      <div className="flex items-center justify-center space-x-2 pt-4 border-t border-white/20">
        <TrendingUp className="w-5 h-5 text-white" />
        <span className="text-sm font-medium">Sales up by 12% this week</span>
      </div>
    </div>
  );
}
