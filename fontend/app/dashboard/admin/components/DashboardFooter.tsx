'use client';

import React from 'react';
import { Heart } from 'lucide-react';

export default function DashboardFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-[1920px] mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* Left: Copyright */}
          <div className="flex items-center space-x-2 text-sm text-[#6B7280]">
            <span>© {currentYear} YourCompany</span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-[#EF4444] fill-current" />
              <span>for Admin</span>
            </span>
          </div>

          {/* Center: Links */}
          <div className="flex items-center space-x-6">
            <a
              href="#"
              className="text-sm text-[#6B7280] hover:text-[#4C5BF5] transition-colors font-medium"
            >
              Terms & Conditions
            </a>
            <a
              href="#"
              className="text-sm text-[#6B7280] hover:text-[#4C5BF5] transition-colors font-medium"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-sm text-[#6B7280] hover:text-[#4C5BF5] transition-colors font-medium"
            >
              Contact Support
            </a>
          </div>

          {/* Right: Version */}
          <div className="flex items-center space-x-4">
            <span className="text-xs text-[#6B7280]">
              Admin Portal v2.5.1
            </span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse"></div>
              <span className="text-xs text-[#10B981] font-medium">All Systems Operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
