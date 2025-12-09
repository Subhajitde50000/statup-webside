'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Database, Server, CheckCircle, HelpCircle } from 'lucide-react';

export default function Footer() {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const systemHealth = [
    { name: 'API Server', status: 'online', icon: Server },
    { name: 'Database', status: 'online', icon: Database },
    { name: 'Services', status: 'online', icon: Activity },
  ];

  return (
    <footer className="mt-12 bg-white border-t border-[#E2E8F0] shadow-sm">
      <div className="px-8 py-6">
        {/* System Health Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-4">
          {/* Left - System Health */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-[#1E293B]">System Health:</span>
            </div>
            
            <div className="flex items-center gap-4">
              {systemHealth.map((system) => {
                const Icon = system.icon;
                return (
                  <div key={system.name} className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-[#10B981]" />
                    <span className="text-sm text-[#64748B]">{system.name}</span>
                    <CheckCircle className="w-4 h-4 text-[#10B981]" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Center - Version */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#64748B]">Manager Portal</span>
            <span className="px-3 py-1 bg-[#3B82F6] text-white text-xs font-bold rounded-full">
              v2.0.1
            </span>
          </div>

          {/* Right - Last Updated */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#64748B]">Last Updated:</span>
            <span className="text-sm font-medium text-[#1E293B]">{currentTime}</span>
          </div>
        </div>

        <hr className="border-[#E2E8F0] mb-4" />

        {/* Bottom Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 text-sm text-[#64748B]">
          {/* Copyright */}
          <div>
            <p>© 2024 Manager Platform. All rights reserved.</p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-[#3B82F6] transition-colors font-medium">
              Terms & Conditions
            </a>
            <a href="#" className="hover:text-[#FF7A00] transition-colors font-medium">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-[#FF7A00] transition-colors font-medium flex items-center gap-1">
              <HelpCircle className="w-4 h-4" />
              Support
            </a>
            <a href="#" className="hover:text-[#FF7A00] transition-colors font-medium">
              Documentation
            </a>
          </div>

          {/* Build Info */}
          <div className="text-xs text-[#6B7280]">
            Build: <span className="font-mono">2024.12.09-prod</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
