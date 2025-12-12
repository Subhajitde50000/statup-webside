'use client';

import React from 'react';
import { DollarSign, CreditCard, Wallet, TrendingUp, ArrowUpRight } from 'lucide-react';

export default function FinancialSummary() {
  const paymentGateways = [
    { name: 'Razorpay', amount: '₹3.2L', percentage: 38, color: 'bg-[#4C5BF5]' },
    { name: 'Paytm', amount: '₹2.8L', percentage: 33, color: 'bg-[#00BAF2]' },
    { name: 'Stripe', amount: '₹1.2L', percentage: 14, color: 'bg-[#635BFF]' },
    { name: 'COD', amount: '₹1.2L', percentage: 15, color: 'bg-[#10B981]' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-[#1F2937] mb-1">Financial Summary</h2>
        <p className="text-sm text-[#6B7280]">Revenue & payouts</p>
      </div>

      {/* Total Revenue */}
      <div className="p-6 bg-gradient-to-br from-[#10B981]/10 to-[#10B981]/5 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-[#6B7280]">Total Revenue (Today)</span>
          <div className="flex items-center space-x-1 text-[#10B981]">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs font-semibold">+22%</span>
          </div>
        </div>
        <div className="flex items-end space-x-2">
          <h3 className="text-3xl font-bold text-[#1F2937]">₹8.4L</h3>
          <span className="text-sm text-[#6B7280] mb-1">today</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 p-6 border-b border-gray-100">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-8 h-8 bg-[#F59E0B]/10 rounded-lg flex items-center justify-center">
              <Wallet className="w-4 h-4 text-[#F59E0B]" />
            </div>
            <span className="text-xs text-[#6B7280]">Pending Payouts</span>
          </div>
          <p className="text-lg font-bold text-[#1F2937]">₹2.8L</p>
        </div>
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-8 h-8 bg-[#10B981]/10 rounded-lg flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-[#10B981]" />
            </div>
            <span className="text-xs text-[#6B7280]">Paid This Week</span>
          </div>
          <p className="text-lg font-bold text-[#1F2937]">₹42.6L</p>
        </div>
      </div>

      {/* Revenue Split */}
      <div className="p-6 border-b border-gray-100">
        <h4 className="text-sm font-semibold text-[#1F2937] mb-4">Revenue Split</h4>
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-[#6B7280]">Customer Payments</span>
              <span className="text-sm font-semibold text-[#1F2937]">₹5.2L</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#4C5BF5] to-[#8B5CF6]" style={{ width: '62%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-[#6B7280]">Professional Commissions</span>
              <span className="text-sm font-semibold text-[#1F2937]">₹1.8L</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#8B5CF6]/80" style={{ width: '21%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-[#6B7280]">Shop Sales</span>
              <span className="text-sm font-semibold text-[#1F2937]">₹1.4L</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#10B981] to-[#10B981]/80" style={{ width: '17%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Gateway Overview */}
      <div className="p-6">
        <h4 className="text-sm font-semibold text-[#1F2937] mb-4">Payment Gateway Breakdown</h4>
        <div className="space-y-3">
          {paymentGateways.map((gateway, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 ${gateway.color} rounded-full`}></div>
                  <span className="text-sm font-medium text-[#1F2937]">{gateway.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-[#6B7280]">{gateway.percentage}%</span>
                  <span className="text-sm font-semibold text-[#1F2937]">{gateway.amount}</span>
                </div>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full ${gateway.color}`} style={{ width: `${gateway.percentage}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-[#F4F6FA] border-t border-gray-100">
        <button className="w-full flex items-center justify-center space-x-2 text-sm text-[#4C5BF5] hover:text-[#8B5CF6] font-medium transition-colors">
          <DollarSign className="w-4 h-4" />
          <span>View Financial Reports</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
