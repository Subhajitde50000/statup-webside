'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Store, User, Package, CheckCircle, AlertCircle, Clock } from 'lucide-react';

export default function LiveActivityFeed() {
  const [activities, setActivities] = useState([
    {
      id: 1,
      type: 'shop',
      icon: Store,
      color: 'text-[#3B82F6]',
      bgColor: 'bg-[#EFF6FF]',
      message: 'Shop "ElectroWorld" added 12 new products',
      time: '2 mins ago',
      category: 'shop'
    },
    {
      id: 2,
      type: 'professional',
      icon: User,
      color: 'text-[#3B82F6]',
      bgColor: 'bg-[#EEF2FF]',
      message: 'Professional "Ravi Kumar" completed job #45213',
      time: '5 mins ago',
      category: 'professional'
    },
    {
      id: 3,
      type: 'complaint',
      icon: AlertCircle,
      color: 'text-[#E74C3C]',
      bgColor: 'bg-[#FEE]',
      message: 'Customer filed a complaint against Shop "ABC Electronics"',
      time: '8 mins ago',
      category: 'complaint'
    },
    {
      id: 4,
      type: 'approval',
      icon: CheckCircle,
      color: 'text-[#2ECC71]',
      bgColor: 'bg-[#E8F5E9]',
      message: 'Manager approved 3 new shops for platform',
      time: '12 mins ago',
      category: 'approval'
    },
    {
      id: 5,
      type: 'shop',
      icon: Store,
      color: 'text-[#FF7A00]',
      bgColor: 'bg-[#FFF5EB]',
      message: 'Shop "TechFix Pro" updated product prices',
      time: '15 mins ago',
      category: 'shop'
    },
    {
      id: 6,
      type: 'professional',
      icon: User,
      color: 'text-[#3B82F6]',
      bgColor: 'bg-[#EEF2FF]',
      message: 'Professional "Amit Sharma" accepted new job request',
      time: '18 mins ago',
      category: 'professional'
    },
    {
      id: 7,
      type: 'order',
      icon: Package,
      color: 'text-[#8B5CF6]',
      bgColor: 'bg-[#F5F3FF]',
      message: 'New order #89234 placed by customer "Priya Singh"',
      time: '22 mins ago',
      category: 'order'
    },
    {
      id: 8,
      type: 'professional',
      icon: User,
      color: 'text-[#3B82F6]',
      bgColor: 'bg-[#EEF2FF]',
      message: 'Professional "Rahul Verma" registered on platform',
      time: '28 mins ago',
      category: 'professional'
    },
  ]);

  const [filter, setFilter] = useState('all');

  const filteredActivities = filter === 'all' 
    ? activities 
    : activities.filter(activity => activity.category === filter);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-[#E2E8F0] sticky top-24 max-h-[calc(100vh-120px)] overflow-hidden flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-[#1E293B] flex items-center gap-2 mb-2">
          <Activity className="w-5 h-5 text-[#3B82F6]" />
          Live Activity Feed
        </h3>
        <p className="text-[#64748B] text-xs">Real-time platform activities</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
            filter === 'all'
              ? 'bg-gradient-to-r from-[#FF7A00] to-[#FFB800] text-white'
              : 'bg-[#F5F7FA] text-[#6B7280] hover:bg-[#E0E4EA]'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('shop')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
            filter === 'shop'
              ? 'bg-gradient-to-r from-[#FF7A00] to-[#FFB800] text-white'
              : 'bg-[#F5F7FA] text-[#6B7280] hover:bg-[#E0E4EA]'
          }`}
        >
          Shops
        </button>
        <button
          onClick={() => setFilter('professional')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
            filter === 'professional'
              ? 'bg-gradient-to-r from-[#FF7A00] to-[#FFB800] text-white'
              : 'bg-[#F5F7FA] text-[#6B7280] hover:bg-[#E0E4EA]'
          }`}
        >
          Professionals
        </button>
        <button
          onClick={() => setFilter('order')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
            filter === 'order'
              ? 'bg-gradient-to-r from-[#FF7A00] to-[#FFB800] text-white'
              : 'bg-[#F5F7FA] text-[#6B7280] hover:bg-[#E0E4EA]'
          }`}
        >
          Orders
        </button>
      </div>

      {/* Activity List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        {filteredActivities.map((activity) => {
          const Icon = activity.icon;
          
          return (
            <div
              key={activity.id}
              className="flex gap-3 p-3 rounded-lg hover:bg-[#F5F7FA] transition-colors cursor-pointer border border-transparent hover:border-[#E0E4EA]"
            >
              <div className={`w-10 h-10 rounded-lg ${activity.bgColor} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-5 h-5 ${activity.color}`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#0D1B2A] font-medium leading-snug mb-1">
                  {activity.message}
                </p>
                <div className="flex items-center gap-1 text-xs text-[#6B7280]">
                  <Clock className="w-3 h-3" />
                  <span>{activity.time}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* View All Button */}
      <div className="mt-4 pt-4 border-t border-[#E2E8F0]">
        <button className="w-full py-2 text-[#3B82F6] font-semibold text-sm hover:text-[#2563EB] transition-colors">
          View All Activities →
        </button>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #F5F7FA;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E0E4EA;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #FF7A00;
        }
      `}</style>
    </div>
  );
}
