'use client';

import React, { useState } from 'react';
import { 
  LayoutDashboard,
  Users,
  Wrench,
  Store,
  ShoppingCart,
  FileText,
  AlertCircle,
  CreditCard,
  FolderCheck,
  Settings,
  BarChart3,
  MessageSquare,
  Bell,
  Tag,
  Package,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  Briefcase
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
  submenu?: { name: string; href: string }[];
}

export default function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      name: 'Dashboard',
      href: '/dashboard/admin',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      name: 'Users',
      href: '/dashboard/admin/users',
      icon: <Users className="w-5 h-5" />,
      badge: 284,
      submenu: [
        { name: 'All Users', href: '/dashboard/admin/users' },
        { name: 'Add User', href: '/dashboard/admin/users/add' },
        { name: 'Suspended Users', href: '/dashboard/admin/users/suspended' },
        { name: 'Verification', href: '/dashboard/admin/users/verification' },
      ],
    },
    {
      name: 'Professionals',
      href: '/dashboard/admin/professionals',
      icon: <Wrench className="w-5 h-5" />,
      badge: 228,
      submenu: [
        { name: 'All Professionals', href: '/dashboard/admin/professionals' },
        { name: 'Pending Verification', href: '/dashboard/admin/professionals/verification' },
        { name: 'Documents', href: '/dashboard/admin/professionals/documents' },
        { name: 'Suspended', href: '/dashboard/admin/professionals/suspended' },
        { name: 'Work History', href: '/dashboard/admin/professionals/work-history' },
        { name: 'Earnings', href: '/dashboard/admin/professionals/earnings' },
        { name: 'Complaints', href: '/dashboard/admin/professionals/complaints' },
      ],
    },
    {
      name: 'Shops',
      href: '/dashboard/admin/shops',
      icon: <Store className="w-5 h-5" />,
      badge: 98,
      submenu: [
        { name: 'All Shops', href: '/dashboard/admin/shops/all' },
        { name: 'Pending Verification', href: '/dashboard/admin/shops/pending' },
        { name: 'Products', href: '/dashboard/admin/shops/products' },
        { name: 'Inventory Alerts', href: '/dashboard/admin/shops/inventory' },
      ],
    },
    {
      name: 'Orders',
      href: '/dashboard/admin/orders',
      icon: <ShoppingCart className="w-5 h-5" />,
      badge: 156,
      submenu: [
        { name: 'All Orders', href: '/dashboard/admin/orders' },
        { name: 'New Orders', href: '/dashboard/admin/orders/new' },
        { name: 'Accepted', href: '/dashboard/admin/orders/accepted' },
        { name: 'Processing', href: '/dashboard/admin/orders/processing' },
        { name: 'Ready for Pickup', href: '/dashboard/admin/orders/ready' },
        { name: 'Completed', href: '/dashboard/admin/orders/completed' },
        { name: 'Cancelled', href: '/dashboard/admin/orders/cancelled' },
        { name: 'Order Tracking', href: '/dashboard/admin/orders/tracking' },
        { name: 'Bulk Management', href: '/dashboard/admin/orders/bulk' },
      ],
    },
    {
      name: 'Vacancies & Jobs',
      href: '/dashboard/admin/vacancies',
      icon: <Briefcase className="w-5 h-5" />,
      badge: 62,
      submenu: [
        { name: 'Dashboard', href: '/dashboard/admin/vacancies' },
        { name: 'Create Vacancy', href: '/dashboard/admin/vacancies/create' },
        { name: 'All Vacancies', href: '/dashboard/admin/vacancies/list' },
        { name: 'All Applicants', href: '/dashboard/admin/vacancies/applicants' },
        { name: 'Job Assignment', href: '/dashboard/admin/vacancies/assignment' },
        { name: 'Role Management', href: '/dashboard/admin/vacancies/roles' },
        { name: 'Resignation/Termination', href: '/dashboard/admin/vacancies/resignation' },
      ],
    },
    {
      name: 'Verification',
      href: '/dashboard/admin/verification',
      icon: <FolderCheck className="w-5 h-5" />,
      badge: 326,
      submenu: [
        { name: 'Professional KYC', href: '/dashboard/admin/verification/professional' },
        { name: 'Shop Documents', href: '/dashboard/admin/verification/shop' },
        { name: 'Background Checks', href: '/dashboard/admin/verification/background' },
      ],
    },
    {
      name: 'Complaints',
      href: '/dashboard/admin/complaints',
      icon: <AlertCircle className="w-5 h-5" />,
      badge: 45,
      submenu: [
        { name: 'All Complaints', href: '/dashboard/admin/complaints/all' },
        { name: 'High Priority', href: '/dashboard/admin/complaints/high' },
        { name: 'Pending', href: '/dashboard/admin/complaints/pending' },
        { name: 'Resolved', href: '/dashboard/admin/complaints/resolved' },
      ],
    },
    {
      name: 'Payments',
      href: '/dashboard/admin/payments',
      icon: <CreditCard className="w-5 h-5" />,
      submenu: [
        { name: 'All Transactions', href: '/dashboard/admin/payments/transactions' },
        { name: 'Pending Payouts', href: '/dashboard/admin/payments/payouts' },
        { name: 'Refunds', href: '/dashboard/admin/payments/refunds' },
        { name: 'Gateway Status', href: '/dashboard/admin/payments/gateways' },
      ],
    },
    {
      name: 'Analytics',
      href: '/dashboard/admin/analytics',
      icon: <BarChart3 className="w-5 h-5" />,
      submenu: [
        { name: 'Overview', href: '/dashboard/admin/analytics/overview' },
        { name: 'Revenue Reports', href: '/dashboard/admin/analytics/revenue' },
        { name: 'User Growth', href: '/dashboard/admin/analytics/growth' },
        { name: 'Performance', href: '/dashboard/admin/analytics/performance' },
      ],
    },
    {
      name: 'Products',
      href: '/dashboard/admin/products',
      icon: <Package className="w-5 h-5" />,
      submenu: [
        { name: 'All Products', href: '/dashboard/admin/products/all' },
        { name: 'Categories', href: '/dashboard/admin/products/categories' },
        { name: 'Low Stock', href: '/dashboard/admin/products/low-stock' },
      ],
    },
    {
      name: 'Coupons',
      href: '/dashboard/admin/coupons',
      icon: <Tag className="w-5 h-5" />,
    },
    {
      name: 'Messages',
      href: '/dashboard/admin/messages',
      icon: <MessageSquare className="w-5 h-5" />,
      badge: 12,
    },
    {
      name: 'Reports',
      href: '/dashboard/admin/reports',
      icon: <FileText className="w-5 h-5" />,
    },
    {
      name: 'Settings',
      href: '/dashboard/admin/settings',
      icon: <Settings className="w-5 h-5" />,
      submenu: [
        { name: 'General', href: '/dashboard/admin/settings/general' },
        { name: 'Platform Config', href: '/dashboard/admin/settings/platform' },
        { name: 'Integrations', href: '/dashboard/admin/settings/integrations' },
        { name: 'Security', href: '/dashboard/admin/settings/security' },
      ],
    },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard/admin') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const toggleSubmenu = (name: string) => {
    if (isCollapsed) return;
    setExpandedMenu(expandedMenu === name ? null : name);
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 z-40 ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Logo Section */}
      <div className="h-20 border-b border-gray-200 flex items-center justify-between px-6">
        {!isCollapsed ? (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#4C5BF5] to-[#8B5CF6] rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#1F2937]">Admin Panel</h1>
              <p className="text-xs text-[#6B7280]">Marketplace Control</p>
            </div>
          </div>
        ) : (
          <div className="w-10 h-10 bg-gradient-to-br from-[#4C5BF5] to-[#8B5CF6] rounded-xl flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-xl">A</span>
          </div>
        )}
      </div>

      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-24 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-[#4C5BF5] hover:text-white hover:border-[#4C5BF5] transition-colors shadow-md z-50"
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 custom-scrollbar h-[calc(100vh-240px)]">
        <div className="space-y-1">
          {navItems.map((item) => (
            <div key={item.name}>
              <Link
                href={item.href}
                onClick={(e) => {
                  if (item.submenu) {
                    e.preventDefault();
                    toggleSubmenu(item.name);
                  }
                }}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive(item.href)
                    ? 'bg-gradient-to-r from-[#4C5BF5] to-[#8B5CF6] text-white shadow-lg shadow-[#4C5BF5]/30'
                    : 'text-[#6B7280] hover:bg-[#F4F6FA] hover:text-[#1F2937]'
                }`}
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className={`flex-shrink-0 ${isActive(item.href) ? 'text-white' : ''}`}>
                    {item.icon}
                  </div>
                  {!isCollapsed && (
                    <>
                      <span className="font-medium truncate">{item.name}</span>
                      {item.badge && (
                        <span
                          className={`ml-auto px-2 py-0.5 rounded-full text-xs font-bold ${
                            isActive(item.href)
                              ? 'bg-white/20 text-white'
                              : 'bg-[#EF4444] text-white'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </div>
                {!isCollapsed && item.submenu && (
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      expandedMenu === item.name ? 'rotate-90' : ''
                    }`}
                  />
                )}
              </Link>

              {/* Submenu */}
              {!isCollapsed && item.submenu && expandedMenu === item.name && (
                <div className="mt-1 ml-4 space-y-1 border-l-2 border-gray-200 pl-4">
                  {item.submenu.map((subItem) => (
                    <Link
                      key={subItem.href}
                      href={subItem.href}
                      className={`flex items-center px-4 py-2 rounded-lg text-sm transition-colors ${
                        isActive(subItem.href)
                          ? 'text-[#4C5BF5] bg-[#4C5BF5]/10 font-medium'
                          : 'text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F4F6FA]'
                      }`}
                    >
                      {subItem.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* User Profile Section */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white p-4">
        {!isCollapsed ? (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#10B981] to-[#10B981]/80 rounded-lg flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#1F2937] truncate">Admin User</p>
              <p className="text-xs text-[#6B7280]">Super Admin</p>
            </div>
            <button className="p-2 hover:bg-[#FEE2E2] rounded-lg transition-colors group">
              <LogOut className="w-4 h-4 text-[#6B7280] group-hover:text-[#EF4444]" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#10B981] to-[#10B981]/80 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <button className="p-2 hover:bg-[#FEE2E2] rounded-lg transition-colors group">
              <LogOut className="w-4 h-4 text-[#6B7280] group-hover:text-[#EF4444]" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
