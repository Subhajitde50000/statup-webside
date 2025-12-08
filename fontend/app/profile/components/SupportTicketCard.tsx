'use client';

import React from 'react';

interface SupportTicketCardProps {
  ticketId: string;
  title: string;
  status: 'resolved' | 'pending' | 'in-progress';
  onViewDetails: () => void;
}

export default function SupportTicketCard({ ticketId, title, status, onViewDetails }: SupportTicketCardProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'resolved':
        return {
          color: 'bg-green-100 text-green-700',
          label: 'Resolved'
        };
      case 'pending':
        return {
          color: 'bg-yellow-100 text-yellow-700',
          label: 'Pending'
        };
      case 'in-progress':
        return {
          color: 'bg-blue-100 text-blue-700',
          label: 'In Progress'
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
      <h4 className="font-semibold text-gray-900 mb-2">Ticket ID #{ticketId} —</h4>
      <p className="text-sm text-gray-600 mb-3">{title}</p>
      <div className="flex items-center justify-between">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
          {statusConfig.label}
        </span>
        <button 
          onClick={onViewDetails}
          className="border-2 border-[#0066FF] text-[#0066FF] px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-[#0066FF] hover:text-white transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );
}
