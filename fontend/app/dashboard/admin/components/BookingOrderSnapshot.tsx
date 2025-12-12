'use client';

import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, Package, Truck, Box } from 'lucide-react';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  bgColor: string;
}

function StatCard({ icon, label, value, color, bgColor }: StatCardProps) {
  return (
    <div className={`${bgColor} rounded-xl p-4 flex items-center space-x-3`}>
      <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-[#1F2937]">{value}</p>
        <p className="text-xs text-[#6B7280]">{label}</p>
      </div>
    </div>
  );
}

export default function BookingOrderSnapshot() {
  const [activeTab, setActiveTab] = useState<'bookings' | 'shop_orders'>('bookings');

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-[#1F2937] mb-1">Booking & Order Snapshot</h2>
        <p className="text-sm text-[#6B7280]">Today's overview</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 px-6">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`flex items-center space-x-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'bookings'
              ? 'border-[#4C5BF5] text-[#4C5BF5]'
              : 'border-transparent text-[#6B7280] hover:text-[#1F2937]'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Service Bookings</span>
        </button>
        <button
          onClick={() => setActiveTab('shop_orders')}
          className={`flex items-center space-x-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'shop_orders'
              ? 'border-[#4C5BF5] text-[#4C5BF5]'
              : 'border-transparent text-[#6B7280] hover:text-[#1F2937]'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Shop Orders</span>
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'bookings' ? (
          <div className="space-y-4">
            {/* Bookings Stats */}
            <div className="grid grid-cols-2 gap-4">
              <StatCard
                icon={<Calendar className="w-5 h-5 text-white" />}
                label="New Bookings"
                value="284"
                color="bg-gradient-to-br from-[#4C5BF5] to-[#4C5BF5]/80"
                bgColor="bg-[#4C5BF5]/10"
              />
              <StatCard
                icon={<Clock className="w-5 h-5 text-white" />}
                label="Ongoing Jobs"
                value="892"
                color="bg-gradient-to-br from-[#F59E0B] to-[#F59E0B]/80"
                bgColor="bg-[#F59E0B]/10"
              />
              <StatCard
                icon={<AlertCircle className="w-5 h-5 text-white" />}
                label="Need Attention"
                value="23"
                color="bg-gradient-to-br from-[#EF4444] to-[#EF4444]/80"
                bgColor="bg-[#EF4444]/10"
              />
              <StatCard
                icon={<XCircle className="w-5 h-5 text-white" />}
                label="Cancelled"
                value="45"
                color="bg-gradient-to-br from-[#6B7280] to-[#6B7280]/80"
                bgColor="bg-gray-100"
              />
            </div>

            {/* Additional Info */}
            <div className="mt-6 p-4 bg-[#F4F6FA] rounded-xl">
              <h4 className="text-sm font-semibold text-[#1F2937] mb-3">Job Status Breakdown</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#6B7280]">Completed Today</span>
                  <span className="font-semibold text-[#10B981]">1,124 jobs</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#6B7280]">Scheduled for Tomorrow</span>
                  <span className="font-semibold text-[#4C5BF5]">456 jobs</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#6B7280]">Delayed Jobs</span>
                  <span className="font-semibold text-[#EF4444]">12 jobs</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#6B7280]">Average Completion Time</span>
                  <span className="font-semibold text-[#1F2937]">2.4 hours</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Shop Orders Stats */}
            <div className="grid grid-cols-2 gap-4">
              <StatCard
                icon={<Package className="w-5 h-5 text-white" />}
                label="New Orders"
                value="568"
                color="bg-gradient-to-br from-[#10B981] to-[#10B981]/80"
                bgColor="bg-[#10B981]/10"
              />
              <StatCard
                icon={<Box className="w-5 h-5 text-white" />}
                label="Packed"
                value="342"
                color="bg-gradient-to-br from-[#8B5CF6] to-[#8B5CF6]/80"
                bgColor="bg-[#8B5CF6]/10"
              />
              <StatCard
                icon={<Truck className="w-5 h-5 text-white" />}
                label="Out for Delivery"
                value="218"
                color="bg-gradient-to-br from-[#F59E0B] to-[#F59E0B]/80"
                bgColor="bg-[#F59E0B]/10"
              />
              <StatCard
                icon={<CheckCircle className="w-5 h-5 text-white" />}
                label="Completed"
                value="1,456"
                color="bg-gradient-to-br from-[#10B981] to-[#10B981]/80"
                bgColor="bg-[#10B981]/10"
              />
            </div>

            {/* Additional Info */}
            <div className="mt-6 p-4 bg-[#F4F6FA] rounded-xl">
              <h4 className="text-sm font-semibold text-[#1F2937] mb-3">Order Metrics</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#6B7280]">Total Order Value (Today)</span>
                  <span className="font-semibold text-[#10B981]">₹12.4L</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#6B7280]">Average Order Value</span>
                  <span className="font-semibold text-[#4C5BF5]">₹2,180</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#6B7280]">Pending Pickups</span>
                  <span className="font-semibold text-[#F59E0B]">89 orders</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#6B7280]">Return Requests</span>
                  <span className="font-semibold text-[#EF4444]">24 orders</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-[#F4F6FA] border-t border-gray-100">
        <button className="w-full text-center text-sm text-[#4C5BF5] hover:text-[#8B5CF6] font-medium transition-colors">
          View All {activeTab === 'bookings' ? 'Bookings' : 'Orders'} →
        </button>
      </div>
    </div>
  );
}
