'use client';

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Store, 
  Users, 
  ShoppingBag, 
  CreditCard, 
  AlertTriangle, 
  Star, 
  CheckCircle, 
  FileText, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

interface SidebarProps {
  isOpen: boolean;
}

export default function LeftSidebar({ isOpen }: SidebarProps) {
  const [activeItem, setActiveItem] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard/manager' },
    { id: 'shops', icon: Store, label: 'Shop Management', href: '/dashboard/manager/shops', badge: '12' },
    { id: 'professionals', icon: Users, label: 'Professional Management', href: '/dashboard/manager/professionals', badge: '8' },
    { id: 'orders', icon: ShoppingBag, label: 'Orders', href: '/dashboard/manager/orders' },
    { id: 'payments', icon: CreditCard, label: 'Payments', href: '/dashboard/manager/payments' },
    { id: 'complaints', icon: AlertTriangle, label: 'Complaints', href: '/dashboard/manager/complaints', badge: '5', badgeColor: 'bg-[#E74C3C]' },
    { id: 'ratings', icon: Star, label: 'Ratings & Reviews', href: '/dashboard/manager/ratings' },
    { id: 'verifications', icon: CheckCircle, label: 'Verifications', href: '/dashboard/manager/verifications', badge: '15', badgeColor: 'bg-[#FFB800]' },
    { id: 'reports', icon: FileText, label: 'Reports', href: '/dashboard/manager/reports' },
    { id: 'settings', icon: Settings, label: 'System Settings', href: '/dashboard/manager/settings' },
  ];

  return (
    <aside 
      className={`fixed left-0 top-[73px] h-[calc(100vh-73px)] bg-white border-r border-[#E2E8F0] transition-all duration-300 z-40 ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Menu Items */}
        <nav className="flex-1 px-3 py-6 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;
              
              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    onClick={() => setActiveItem(item.id)}
                    className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all group relative ${
                      isActive
                        ? 'bg-[#EFF6FF] text-[#3B82F6] shadow-sm border border-[#BFDBFE]'
                        : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#1E293B]'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-[#3B82F6]' : 'text-[#64748B] group-hover:text-[#1E293B]'}`} />
                    
                    {isOpen && (
                      <>
                        <span className="font-medium">{item.label}</span>
                        {item.badge && (
                          <span className={`ml-auto px-2 py-1 text-xs font-bold rounded-full ${
                            item.badgeColor === 'bg-[#E74C3C]' ? 'bg-[#FEE2E2] text-[#DC2626]' :
                            item.badgeColor === 'bg-[#FFB800]' ? 'bg-[#FEF3C7] text-[#D97706]' :
                            'bg-[#D1FAE5] text-[#059669]'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}

                    {/* Tooltip for collapsed state */}
                    {!isOpen && (
                      <div className="absolute left-full ml-4 px-3 py-2 bg-[#1E293B] text-white text-sm rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                        {item.label}
                        {item.badge && (
                          <span className={`ml-2 px-2 py-0.5 text-xs font-bold rounded-full ${
                            item.badgeColor === 'bg-[#E74C3C]' ? 'bg-[#DC2626]' :
                            item.badgeColor === 'bg-[#FFB800]' ? 'bg-[#D97706]' :
                            'bg-[#059669]'
                          } text-white`}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Section - Version Info */}
        {isOpen && (
          <div className="px-6 py-4 border-t border-[#E2E8F0]">
            <div className="text-[#64748B] text-xs">
              <p className="font-semibold text-[#1E293B] mb-1">Manager Portal v2.0</p>
              <p>© 2024 Platform</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
