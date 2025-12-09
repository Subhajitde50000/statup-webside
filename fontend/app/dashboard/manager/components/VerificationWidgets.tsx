'use client';

import React from 'react';
import { Store, UserCheck, Package, CheckCircle, XCircle } from 'lucide-react';

export default function VerificationWidgets() {
  const verificationData = [
    {
      id: 1,
      title: 'Pending Shop Verifications',
      count: 8,
      icon: Store,
      color: 'from-[#3B82F6] to-[#2563EB]',
      items: [
        { name: 'TechFix Electronics', submitted: '2 days ago' },
        { name: 'HomeService Pro', submitted: '3 days ago' },
        { name: 'QuickRepair Hub', submitted: '5 days ago' },
      ]
    },
    {
      id: 2,
      title: 'Pending Professional KYC',
      count: 12,
      icon: UserCheck,
      color: 'from-[#8B5CF6] to-[#7C3AED]',
      items: [
        { name: 'Rahul Sharma - Electrician', submitted: '1 day ago' },
        { name: 'Priya Verma - Plumber', submitted: '2 days ago' },
        { name: 'Amit Singh - Carpenter', submitted: '4 days ago' },
      ]
    },
    {
      id: 3,
      title: 'Pending Product Approvals',
      count: 15,
      icon: Package,
      color: 'from-[#10B981] to-[#059669]',
      items: [
        { name: 'LED Bulbs - 100W (Updated)', submitted: '3 hours ago' },
        { name: 'Wall Switches - Modular', submitted: '5 hours ago' },
        { name: 'PVC Pipes - 2 inch', submitted: '1 day ago' },
      ]
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {verificationData.map((widget) => {
        const Icon = widget.icon;
        
        return (
          <div
            key={widget.id}
            className="bg-white rounded-xl shadow-sm p-6 border border-[#E2E8F0] hover:shadow-md transition-all"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${widget.color} flex items-center justify-center shadow-sm`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <span className="px-3 py-1 bg-[#FEF3C7] text-[#D97706] text-xs font-bold rounded-full">
                {widget.count} Pending
              </span>
            </div>

            <h3 className="text-base font-semibold text-[#1E293B] mb-4">{widget.title}</h3>

            {/* Items List */}
            <div className="space-y-3 mb-4">
              {widget.items.map((item, index) => (
                <div
                  key={index}
                  className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] hover:bg-white transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-[#1E293B] line-clamp-1">{item.name}</p>
                  </div>
                  <p className="text-xs text-[#64748B]">{item.submitted}</p>
                  
                  {/* Quick Actions */}
                  <div className="flex items-center gap-2 mt-2">
                    <button className="flex-1 px-2 py-1 bg-[#10B981] text-white text-xs font-semibold rounded hover:bg-[#059669] transition-colors flex items-center justify-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Approve
                    </button>
                    <button className="flex-1 px-2 py-1 bg-[#EF4444] text-white text-xs font-semibold rounded hover:bg-[#DC2626] transition-colors flex items-center justify-center gap-1">
                      <XCircle className="w-3 h-3" />
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* View All Button */}
            <button className={`w-full py-2 bg-gradient-to-r ${widget.color} text-white font-semibold rounded-lg hover:shadow-lg transition-all`}>
              Review All ({widget.count})
            </button>
          </div>
        );
      })}
    </div>
  );
}
