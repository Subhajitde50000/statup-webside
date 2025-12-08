'use client';

import React from 'react';
import { CreditCard, X } from 'lucide-react';

interface PaymentMethodCardProps {
  type: 'card' | 'upi' | 'wallet';
  name: string;
  icon?: React.ReactNode;
  onRemove?: () => void;
}

export default function PaymentMethodCard({ type, name, icon, onRemove }: PaymentMethodCardProps) {
  return (
    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        {icon || <CreditCard className="w-6 h-6 text-gray-700" />}
        <span className="text-gray-900 font-medium">{name}</span>
      </div>
      {onRemove && (
        <button 
          onClick={onRemove}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
