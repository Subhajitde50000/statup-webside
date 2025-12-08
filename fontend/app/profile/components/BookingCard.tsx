'use client';

import React from 'react';
import { Circle, Check, Clock, X } from 'lucide-react';

interface BookingCardProps {
  service: string;
  provider: string;
  status: 'completed' | 'ongoing' | 'cancelled';
  date: string;
  totalPaid: number;
  onViewInvoice: () => void;
  onRateService?: () => void;
}

export default function BookingCard({ 
  service, 
  provider, 
  status, 
  date, 
  totalPaid, 
  onViewInvoice, 
  onRateService 
}: BookingCardProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'completed':
        return {
          icon: <Check className="w-3 h-3" />,
          color: 'text-[#00C28C]',
          bgColor: 'bg-[#00C28C]',
          label: 'Completed'
        };
      case 'ongoing':
        return {
          icon: <Clock className="w-3 h-3" />,
          color: 'text-[#0066FF]',
          bgColor: 'bg-[#0066FF]',
          label: 'Ongoing'
        };
      case 'cancelled':
        return {
          icon: <X className="w-3 h-3" />,
          color: 'text-gray-500',
          bgColor: 'bg-gray-500',
          label: 'Cancelled'
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3 mb-3">
        <Circle className={`w-5 h-5 ${statusConfig.color} fill-current mt-1`} />
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 mb-1">{service}</h4>
          <div className="space-y-1 text-sm">
            <p className="text-gray-600">
              Provider: <span className="font-medium">{provider}</span>
              <span className={`ml-2 inline-flex items-center gap-1 ${statusConfig.color}`}>
                {statusConfig.icon}
                {statusConfig.label}
              </span>
            </p>
            <p className="text-gray-600">Date: {date}</p>
            <p className="text-gray-600">
              Total Paid: <span className="font-semibold text-gray-900">₹{totalPaid}</span>
            </p>
          </div>
        </div>
      </div>
      <div className="flex gap-3">
        <button 
          onClick={onViewInvoice}
          className="flex-1 border-2 border-[#0066FF] text-[#0066FF] py-2 rounded-lg font-medium hover:bg-[#0066FF] hover:text-white transition-colors"
        >
          View Invoice
        </button>
        {status === 'completed' && onRateService && (
          <button 
            onClick={onRateService}
            className="flex-1 bg-[#0066FF] text-white py-2 rounded-lg font-medium hover:bg-[#0052CC] transition-colors"
          >
            Rate Service
          </button>
        )}
      </div>
    </div>
  );
}
