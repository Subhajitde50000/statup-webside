'use client';

import React from 'react';
import { Star } from 'lucide-react';
import Image from 'next/image';

interface ProfessionalCardProps {
  name: string;
  profession: string;
  rating: number;
  skills: string;
  rate: number;
  image?: string;
  onBook: () => void;
}

export default function ProfessionalCard({ 
  name, 
  profession, 
  rating, 
  skills, 
  rate, 
  image = '/api/placeholder/64/64',
  onBook 
}: ProfessionalCardProps) {
  return (
    <div className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all">
      <div className="flex gap-3 mb-3">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
          <Image 
            src={image} 
            alt={name}
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 text-sm mb-1 truncate">
            {name} — {profession}
          </h4>
          <div className="flex items-center gap-1 mb-1">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-medium text-gray-900">{rating}</span>
          </div>
          <p className="text-xs text-gray-600 truncate">{skills}</p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-gray-900">₹{rate}/hr</span>
        <button 
          onClick={onBook}
          className="bg-[#0066FF] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0052CC] transition-colors"
        >
          Book Again
        </button>
      </div>
    </div>
  );
}
