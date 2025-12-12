'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  XCircle, 
  UserPlus, 
  Store, 
  CreditCard, 
  AlertCircle,
  CheckCircle,
  FileText,
  Package,
  Clock
} from 'lucide-react';

interface Activity {
  id: string;
  type: 'order_placed' | 'order_cancelled' | 'professional_registered' | 'shop_updated' | 'payment_received' | 'complaint_created' | 'verification_submitted' | 'order_completed';
  message: string;
  user?: string;
  timestamp: string;
  details?: string;
  clickable?: boolean;
}

function ActivityItem({ activity }: { activity: Activity }) {
  const getIcon = () => {
    switch (activity.type) {
      case 'order_placed':
        return <ShoppingCart className="w-5 h-5 text-[#4C5BF5]" />;
      case 'order_cancelled':
        return <XCircle className="w-5 h-5 text-[#EF4444]" />;
      case 'professional_registered':
        return <UserPlus className="w-5 h-5 text-[#8B5CF6]" />;
      case 'shop_updated':
        return <Store className="w-5 h-5 text-[#10B981]" />;
      case 'payment_received':
        return <CreditCard className="w-5 h-5 text-[#10B981]" />;
      case 'complaint_created':
        return <AlertCircle className="w-5 h-5 text-[#EF4444]" />;
      case 'verification_submitted':
        return <FileText className="w-5 h-5 text-[#F59E0B]" />;
      case 'order_completed':
        return <CheckCircle className="w-5 h-5 text-[#10B981]" />;
      default:
        return <Package className="w-5 h-5 text-[#6B7280]" />;
    }
  };

  const getBackgroundColor = () => {
    switch (activity.type) {
      case 'order_placed':
        return 'bg-[#4C5BF5]/10';
      case 'order_cancelled':
        return 'bg-[#EF4444]/10';
      case 'professional_registered':
        return 'bg-[#8B5CF6]/10';
      case 'shop_updated':
        return 'bg-[#10B981]/10';
      case 'payment_received':
        return 'bg-[#10B981]/10';
      case 'complaint_created':
        return 'bg-[#EF4444]/10';
      case 'verification_submitted':
        return 'bg-[#F59E0B]/10';
      case 'order_completed':
        return 'bg-[#10B981]/10';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <div 
      className={`flex items-start space-x-4 p-4 rounded-xl transition-all duration-300 ${
        activity.clickable ? 'hover:bg-[#F4F6FA] cursor-pointer hover:shadow-md' : ''
      }`}
    >
      <div className={`w-10 h-10 ${getBackgroundColor()} rounded-lg flex items-center justify-center flex-shrink-0`}>
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#1F2937]">
          {activity.message}
          {activity.user && (
            <span className="font-bold text-[#4C5BF5]"> {activity.user}</span>
          )}
        </p>
        {activity.details && (
          <p className="text-xs text-[#6B7280] mt-1">{activity.details}</p>
        )}
        <div className="flex items-center space-x-2 mt-1">
          <Clock className="w-3 h-3 text-[#6B7280]" />
          <span className="text-xs text-[#6B7280]">{activity.timestamp}</span>
        </div>
      </div>
    </div>
  );
}

export default function LiveActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: '1',
      type: 'order_placed',
      message: 'New order placed by',
      user: 'Rahul Kumar',
      timestamp: '2 minutes ago',
      details: 'Order #ORD-2024-4582 • Plumbing Service • ₹2,500',
      clickable: true,
    },
    {
      id: '2',
      type: 'payment_received',
      message: 'Payment received from',
      user: 'Priya Sharma',
      timestamp: '5 minutes ago',
      details: '₹4,200 • Order #ORD-2024-4579 • Razorpay',
      clickable: true,
    },
    {
      id: '3',
      type: 'professional_registered',
      message: 'New professional registered:',
      user: 'Amit Singh',
      timestamp: '8 minutes ago',
      details: 'Category: Electrician • Location: Mumbai',
      clickable: true,
    },
    {
      id: '4',
      type: 'order_completed',
      message: 'Order completed by',
      user: 'Rajesh Electricals',
      timestamp: '12 minutes ago',
      details: 'Order #ORD-2024-4575 • Customer Rating: 5⭐',
      clickable: true,
    },
    {
      id: '5',
      type: 'shop_updated',
      message: 'Shop inventory updated by',
      user: 'TechMart Electronics',
      timestamp: '15 minutes ago',
      details: '45 new products added',
      clickable: true,
    },
    {
      id: '6',
      type: 'complaint_created',
      message: 'New complaint created by',
      user: 'Sneha Patel',
      timestamp: '18 minutes ago',
      details: 'Issue: Payment not refunded • Priority: High',
      clickable: true,
    },
    {
      id: '7',
      type: 'verification_submitted',
      message: 'Verification request submitted by',
      user: 'HomeFix Services',
      timestamp: '22 minutes ago',
      details: 'Type: Business License • Shop ID: #SHP-2458',
      clickable: true,
    },
    {
      id: '8',
      type: 'order_cancelled',
      message: 'Order cancelled by',
      user: 'Vikram Mehta',
      timestamp: '25 minutes ago',
      details: 'Order #ORD-2024-4568 • Reason: Changed mind',
      clickable: true,
    },
  ]);

  const [autoRefresh, setAutoRefresh] = useState(true);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-[#1F2937]">Live Activity Feed</h2>
          <p className="text-sm text-[#6B7280] mt-1">Real-time platform updates</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              autoRefresh
                ? 'bg-[#D1FAE5] text-[#10B981]'
                : 'bg-gray-100 text-[#6B7280]'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-[#10B981] animate-pulse' : 'bg-[#6B7280]'}`}></div>
            <span>{autoRefresh ? 'Live' : 'Paused'}</span>
          </button>
          <button className="text-sm text-[#4C5BF5] hover:text-[#8B5CF6] font-medium transition-colors">
            View All
          </button>
        </div>
      </div>

      {/* Activity List */}
      <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
        <div className="divide-y divide-gray-100">
          {activities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-[#F4F6FA] border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#6B7280]">
            Showing {activities.length} recent activities
          </span>
          <button className="text-[#4C5BF5] hover:text-[#8B5CF6] font-medium transition-colors">
            Load More →
          </button>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #F4F6FA;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #CBD5E1;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94A3B8;
        }
      `}</style>
    </div>
  );
}
