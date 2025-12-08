'use client';

import React from 'react';
import { Home, Briefcase, MapPin, Edit2, Trash2 } from 'lucide-react';

interface AddressCardProps {
  type: 'home' | 'work' | 'other';
  label: string;
  address: string;
  onEdit: () => void;
  onDelete: () => void;
}

export default function AddressCard({ type, label, address, onEdit, onDelete }: AddressCardProps) {
  const getIcon = () => {
    switch (type) {
      case 'home':
        return <Home className="w-5 h-5 text-[#0066FF]" />;
      case 'work':
        return <Briefcase className="w-5 h-5 text-[#0066FF]" />;
      default:
        return <MapPin className="w-5 h-5 text-[#0066FF]" />;
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <div className="bg-[#0066FF]/10 p-2 rounded-lg">
          {getIcon()}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 mb-1">{label}</h4>
          <p className="text-sm text-gray-600 line-clamp-2">{address}</p>
        </div>
      </div>
      <div className="flex gap-3 mt-3 pl-11">
        <button 
          onClick={onEdit}
          className="text-[#0066FF] text-sm font-medium hover:underline flex items-center gap-1"
        >
          <Edit2 className="w-3 h-3" />
          Edit
        </button>
        <span className="text-gray-300">|</span>
        <button 
          onClick={onDelete}
          className="text-red-500 text-sm font-medium hover:underline flex items-center gap-1"
        >
          <Trash2 className="w-3 h-3" />
          Delete
        </button>
      </div>
    </div>
  );
}
