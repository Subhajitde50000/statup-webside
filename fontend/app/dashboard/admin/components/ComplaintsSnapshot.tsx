'use client';

import React from 'react';
import { AlertCircle, Clock, CheckCircle } from 'lucide-react';

interface Complaint {
  id: string;
  user: string;
  type: string;
  status: 'pending' | 'under_review' | 'assigned' | 'resolved';
  priority: 'high' | 'medium' | 'low';
  timestamp: string;
}

function ComplaintRow({ complaint }: { complaint: Complaint }) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return { bg: 'bg-[#FEF3C7]', text: 'text-[#F59E0B]', label: 'Pending' };
      case 'under_review':
        return { bg: 'bg-[#DBEAFE]', text: 'text-[#4C5BF5]', label: 'Under Review' };
      case 'assigned':
        return { bg: 'bg-[#E0E7FF]', text: 'text-[#8B5CF6]', label: 'Assigned' };
      case 'resolved':
        return { bg: 'bg-[#D1FAE5]', text: 'text-[#10B981]', label: 'Resolved' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-600', label: status };
    }
  };

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'high':
        return { emoji: '🔴', color: 'text-[#EF4444]' };
      case 'medium':
        return { emoji: '🟡', color: 'text-[#F59E0B]' };
      case 'low':
        return { emoji: '🟢', color: 'text-[#10B981]' };
      default:
        return { emoji: '⚪', color: 'text-gray-600' };
    }
  };

  const statusConfig = getStatusConfig(complaint.status);
  const priorityConfig = getPriorityConfig(complaint.priority);

  return (
    <tr className="hover:bg-[#F4F6FA] transition-colors cursor-pointer">
      <td className="px-4 py-3">
        <p className="text-sm font-semibold text-[#1F2937]">{complaint.user}</p>
      </td>
      <td className="px-4 py-3">
        <p className="text-sm text-[#6B7280]">{complaint.type}</p>
      </td>
      <td className="px-4 py-3">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${statusConfig.bg} ${statusConfig.text}`}>
          {statusConfig.label}
        </span>
      </td>
      <td className="px-4 py-3 text-center">
        <span className="text-lg" title={complaint.priority}>
          {priorityConfig.emoji}
        </span>
      </td>
    </tr>
  );
}

export default function ComplaintsSnapshot() {
  const complaints: Complaint[] = [
    {
      id: '1',
      user: 'Rahul Kumar',
      type: 'Payment Issue',
      status: 'pending',
      priority: 'high',
      timestamp: '2h ago',
    },
    {
      id: '2',
      user: 'Anita Desai',
      type: 'Shop Behaviour',
      status: 'under_review',
      priority: 'medium',
      timestamp: '4h ago',
    },
    {
      id: '3',
      user: 'Sohan Patel',
      type: 'Wrong Job Done',
      status: 'assigned',
      priority: 'low',
      timestamp: '6h ago',
    },
    {
      id: '4',
      user: 'Priya Singh',
      type: 'Delayed Delivery',
      status: 'pending',
      priority: 'high',
      timestamp: '8h ago',
    },
    {
      id: '5',
      user: 'Vikram Mehta',
      type: 'Product Quality',
      status: 'under_review',
      priority: 'medium',
      timestamp: '10h ago',
    },
  ];

  const pendingCount = complaints.filter(c => c.status === 'pending').length;
  const highPriorityCount = complaints.filter(c => c.priority === 'high').length;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-[#1F2937]">Complaints & Reports</h2>
          {highPriorityCount > 0 && (
            <span className="px-2.5 py-1 bg-[#FEE2E2] text-[#EF4444] rounded-lg text-xs font-bold flex items-center space-x-1">
              <AlertCircle className="w-3 h-3" />
              <span>{highPriorityCount} High Priority</span>
            </span>
          )}
        </div>
        <p className="text-sm text-[#6B7280]">{pendingCount} pending resolution</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 p-4 bg-[#F4F6FA] border-b border-gray-100">
        <div className="text-center">
          <p className="text-2xl font-bold text-[#EF4444]">{pendingCount}</p>
          <p className="text-xs text-[#6B7280] mt-1">Pending</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-[#4C5BF5]">
            {complaints.filter(c => c.status === 'under_review').length}
          </p>
          <p className="text-xs text-[#6B7280] mt-1">Under Review</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-[#10B981]">
            {complaints.filter(c => c.status === 'assigned').length}
          </p>
          <p className="text-xs text-[#6B7280] mt-1">Assigned</p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#F4F6FA] border-b border-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                User
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                Priority
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {complaints.map((complaint) => (
              <ComplaintRow key={complaint.id} complaint={complaint} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-[#F4F6FA] border-t border-gray-100">
        <button className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-[#4C5BF5] hover:bg-[#8B5CF6] text-white rounded-xl font-medium text-sm transition-colors">
          <AlertCircle className="w-4 h-4" />
          <span>Go to Complaints Dashboard</span>
        </button>
      </div>
    </div>
  );
}
