'use client';

import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';

interface ChartData {
  day: string;
  earnings: number;
  jobs: number;
}

interface WeeklyChartProps {
  data: ChartData[];
}

export default function WeeklyChart({ data }: WeeklyChartProps) {
  const [activeTab, setActiveTab] = useState<'earnings' | 'jobs'>('earnings');

  const maxValue = Math.max(...data.map(d => activeTab === 'earnings' ? d.earnings : d.jobs));

  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-teal-600" />
          <h3 className="text-lg font-bold text-gray-900">Weekly Activity Chart</h3>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('earnings')}
          className={`flex-1 py-2 px-4 rounded-xl font-bold transition-all ${
            activeTab === 'earnings'
              ? 'bg-teal-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Earnings
        </button>
        <button
          onClick={() => setActiveTab('jobs')}
          className={`flex-1 py-2 px-4 rounded-xl font-bold transition-all ${
            activeTab === 'jobs'
              ? 'bg-teal-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Jobs Completed
        </button>
      </div>

      {/* Chart */}
      <div className="relative h-48">
        <div className="absolute inset-0 flex items-end justify-between gap-2">
          {data.map((item, index) => {
            const value = activeTab === 'earnings' ? item.earnings : item.jobs;
            const height = (value / maxValue) * 100;
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center group">
                <div className="relative w-full flex items-end justify-center mb-2">
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs py-1 px-3 rounded-lg whitespace-nowrap z-10">
                    {activeTab === 'earnings' ? `₹${value.toLocaleString()}` : `${value} jobs`}
                  </div>
                  
                  {/* Bar */}
                  <div
                    className="w-full bg-gradient-to-t from-teal-500 to-blue-400 rounded-t-lg transition-all duration-300 hover:from-teal-600 hover:to-blue-500 cursor-pointer"
                    style={{ height: `${height}%`, minHeight: '8px' }}
                  />
                </div>
                
                {/* Day Label */}
                <span className="text-xs font-semibold text-gray-600">{item.day}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
