'use client';

import React, { useState } from 'react';
import { FileText, Image, MapPin, CheckCircle, Clock, Store, Wrench, ChevronRight } from 'lucide-react';

interface VerificationItem {
  id: string;
  name: string;
  type: 'professional' | 'shop';
  documentType: string;
  submittedAt: string;
  status: 'pending' | 'under_review';
}

function VerificationCard({ item }: { item: VerificationItem }) {
  const isProfessional = item.type === 'professional';

  return (
    <div className="flex items-center justify-between p-4 hover:bg-[#F4F6FA] rounded-xl transition-colors cursor-pointer group">
      <div className="flex items-center space-x-3 flex-1">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          isProfessional 
            ? 'bg-[#8B5CF6]/10' 
            : 'bg-[#10B981]/10'
        }`}>
          {isProfessional ? (
            <Wrench className={`w-5 h-5 text-[#8B5CF6]`} />
          ) : (
            <Store className={`w-5 h-5 text-[#10B981]`} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#1F2937] truncate">
            {item.name}
          </p>
          <p className="text-xs text-[#6B7280]">{item.documentType}</p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <div className="text-right hidden sm:block">
          <div className="flex items-center space-x-1 text-xs text-[#6B7280]">
            <Clock className="w-3 h-3" />
            <span>{item.submittedAt}</span>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-[#6B7280] group-hover:text-[#4C5BF5] transition-colors" />
      </div>
    </div>
  );
}

export default function VerificationQueue() {
  const [activeTab, setActiveTab] = useState<'professionals' | 'shops'>('professionals');

  const professionalVerifications: VerificationItem[] = [
    {
      id: '1',
      name: 'Amit Kumar Singh',
      type: 'professional',
      documentType: 'ID Proof (Aadhaar)',
      submittedAt: '2h ago',
      status: 'pending',
    },
    {
      id: '2',
      name: 'Rajesh Electricals',
      type: 'professional',
      documentType: 'Trade Certificate',
      submittedAt: '4h ago',
      status: 'pending',
    },
    {
      id: '3',
      name: 'Priya Sharma',
      type: 'professional',
      documentType: 'Address Proof',
      submittedAt: '6h ago',
      status: 'under_review',
    },
    {
      id: '4',
      name: 'Vikram Plumbing',
      type: 'professional',
      documentType: 'Background Check',
      submittedAt: '8h ago',
      status: 'pending',
    },
  ];

  const shopVerifications: VerificationItem[] = [
    {
      id: '5',
      name: 'TechMart Electronics',
      type: 'shop',
      documentType: 'GST Certificate',
      submittedAt: '1h ago',
      status: 'pending',
    },
    {
      id: '6',
      name: 'HomeFix Hardware',
      type: 'shop',
      documentType: 'Business License',
      submittedAt: '3h ago',
      status: 'pending',
    },
    {
      id: '7',
      name: 'Urban Supplies Co.',
      type: 'shop',
      documentType: 'Shop Photographs',
      submittedAt: '5h ago',
      status: 'under_review',
    },
  ];

  const currentData = activeTab === 'professionals' ? professionalVerifications : shopVerifications;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-[#1F2937] mb-1">Verification Queue</h2>
        <p className="text-sm text-[#6B7280]">Pending verifications</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 px-6">
        <button
          onClick={() => setActiveTab('professionals')}
          className={`flex items-center space-x-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'professionals'
              ? 'border-[#4C5BF5] text-[#4C5BF5]'
              : 'border-transparent text-[#6B7280] hover:text-[#1F2937]'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Professionals</span>
          <span className="px-2 py-0.5 bg-[#8B5CF6]/10 text-[#8B5CF6] rounded-full text-xs font-bold">
            {professionalVerifications.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('shops')}
          className={`flex items-center space-x-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'shops'
              ? 'border-[#4C5BF5] text-[#4C5BF5]'
              : 'border-transparent text-[#6B7280] hover:text-[#1F2937]'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Shops</span>
          <span className="px-2 py-0.5 bg-[#10B981]/10 text-[#10B981] rounded-full text-xs font-bold">
            {shopVerifications.length}
          </span>
        </button>
      </div>

      {/* Verification List */}
      <div className="divide-y divide-gray-100">
        {currentData.length > 0 ? (
          currentData.map((item) => (
            <VerificationCard key={item.id} item={item} />
          ))
        ) : (
          <div className="p-8 text-center">
            <CheckCircle className="w-12 h-12 text-[#10B981] mx-auto mb-3" />
            <p className="text-sm font-medium text-[#1F2937]">All caught up!</p>
            <p className="text-xs text-[#6B7280] mt-1">No pending verifications</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-[#F4F6FA] border-t border-gray-100">
        <button className="w-full text-center text-sm text-[#4C5BF5] hover:text-[#8B5CF6] font-medium transition-colors">
          Go to Verification Center →
        </button>
      </div>
    </div>
  );
}
