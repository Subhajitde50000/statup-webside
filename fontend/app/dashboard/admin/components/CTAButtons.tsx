'use client';

import React from 'react';
import { 
  Store, 
  Wrench, 
  Users, 
  FileText, 
  AlertCircle, 
  CreditCard, 
  FolderCheck, 
  Settings,
  ArrowRight
} from 'lucide-react';

interface CTAButtonProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  onClick?: () => void;
}

function CTAButton({ icon, title, description, gradient, onClick }: CTAButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`relative overflow-hidden group ${gradient} rounded-2xl p-6 text-left transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border border-white/20`}
    >
      {/* Animated Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative z-10">
        <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-white/80 text-sm mb-4">{description}</p>
        
        <div className="flex items-center space-x-2 text-white font-medium group-hover:translate-x-2 transition-transform duration-300">
          <span>Access Now</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12 group-hover:scale-150 transition-transform duration-500"></div>
    </button>
  );
}

export default function CTAButtons() {
  const buttons = [
    {
      icon: <Store className="w-7 h-7 text-white" />,
      title: 'Manage Shops',
      description: 'View all shops, approve verifications, manage inventory',
      gradient: 'bg-gradient-to-br from-[#10B981] to-[#059669]',
    },
    {
      icon: <Wrench className="w-7 h-7 text-white" />,
      title: 'Manage Professionals',
      description: 'Professional profiles, ratings, performance tracking',
      gradient: 'bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED]',
    },
    {
      icon: <Users className="w-7 h-7 text-white" />,
      title: 'Manage Customers',
      description: 'User accounts, activity logs, support tickets',
      gradient: 'bg-gradient-to-br from-[#4C5BF5] to-[#4338CA]',
    },
    {
      icon: <FileText className="w-7 h-7 text-white" />,
      title: 'Manage Orders',
      description: 'All bookings, shop orders, delivery tracking',
      gradient: 'bg-gradient-to-br from-[#F59E0B] to-[#D97706]',
    },
    {
      icon: <AlertCircle className="w-7 h-7 text-white" />,
      title: 'View Complaints',
      description: 'Support tickets, disputes, resolution center',
      gradient: 'bg-gradient-to-br from-[#EF4444] to-[#DC2626]',
    },
    {
      icon: <CreditCard className="w-7 h-7 text-white" />,
      title: 'Payments',
      description: 'Transactions, payouts, financial reports',
      gradient: 'bg-gradient-to-br from-[#06B6D4] to-[#0891B2]',
    },
    {
      icon: <FolderCheck className="w-7 h-7 text-white" />,
      title: 'Verification Center',
      description: 'KYC approvals, document verification, background checks',
      gradient: 'bg-gradient-to-br from-[#EC4899] to-[#DB2777]',
    },
    {
      icon: <Settings className="w-7 h-7 text-white" />,
      title: 'System Settings',
      description: 'Platform configuration, admin controls, integrations',
      gradient: 'bg-gradient-to-br from-[#6B7280] to-[#4B5563]',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#1F2937]">Quick Actions</h2>
          <p className="text-sm text-[#6B7280] mt-1">Access key management areas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {buttons.map((button, index) => (
          <CTAButton
            key={index}
            icon={button.icon}
            title={button.title}
            description={button.description}
            gradient={button.gradient}
          />
        ))}
      </div>
    </div>
  );
}
