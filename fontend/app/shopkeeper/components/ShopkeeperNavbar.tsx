'use client';

import React, { useState } from 'react';
import { Store, Bell, MessageCircle, User, ChevronDown, Home, Package, BarChart3 } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function ShopkeeperNavbar() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Navigation - Top */}
      <nav className="hidden lg:block bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left - Logo */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <div className="bg-[#00C897] p-2 rounded-lg">
                  <Store className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-[#0C0C0C]">MegaStore Supplies</span>
              </div>

              {/* Navigation Links */}
              <div className="flex items-center space-x-6">
                <Link 
                  href="/shopkeeper" 
                  className={`flex items-center space-x-2 font-medium hover:text-[#00C897] transition ${
                    pathname === '/shopkeeper' ? 'text-[#00C897]' : 'text-[#555555]'
                  }`}
                >
                  <Home className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>
                <Link 
                  href="/shopkeeper/orders" 
                  className={`flex items-center space-x-2 font-medium hover:text-[#00C897] transition ${
                    pathname?.startsWith('/shopkeeper/orders') ? 'text-[#00C897]' : 'text-[#555555]'
                  }`}
                >
                  <Package className="w-5 h-5" />
                  <span>Orders</span>
                </Link>
                <Link 
                  href="/shopkeeper/products" 
                  className={`flex items-center space-x-2 font-medium hover:text-[#00C897] transition ${
                    pathname?.startsWith('/shopkeeper/products') ? 'text-[#00C897]' : 'text-[#555555]'
                  }`}
                >
                  <BarChart3 className="w-5 h-5" />
                  <span>Product</span>
                </Link>
                <Link 
                  href="/shopkeeper/profile" 
                  className={`flex items-center space-x-2 font-medium hover:text-[#00C897] transition ${
                    pathname?.startsWith('/shopkeeper/profile') ? 'text-[#00C897]' : 'text-[#555555]'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span>Profile</span>
                </Link>
              </div>
            </div>

            {/* Right - Icons & Profile */}
            <div className="flex items-center space-x-6">
              {/* Notifications */}
              <button className="relative hover:bg-gray-100 p-2 rounded-lg transition">
                <Bell className="w-6 h-6 text-[#555555]" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  1
                </span>
              </button>

              {/* Messages */}
              <button className="relative hover:bg-gray-100 p-2 rounded-lg transition">
                <MessageCircle className="w-6 h-6 text-[#555555]" />
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-lg transition"
                >
                  <div className="w-10 h-10 bg-[#00C897] rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <span className="font-medium text-[#0C0C0C]">Profile</span>
                  <ChevronDown className="w-4 h-4 text-[#555555]" />
                </button>

                {/* Dropdown Menu */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                    <Link
                      href="/shopkeeper/profile"
                      className="block px-4 py-2 text-[#555555] hover:bg-gray-100 transition"
                    >
                      View Profile
                    </Link>
                    <Link
                      href="/shopkeeper/payments"
                      className="block px-4 py-2 text-[#555555] hover:bg-gray-100 transition"
                    >
                      Payments
                    </Link>
                    <hr className="my-2" />
                    <button
                      onClick={() => alert('Logout functionality')}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 transition"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile/Tablet Navigation - Top Bar (Simple) */}
      <nav className="lg:hidden bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="bg-[#00C897] p-2 rounded-lg">
                <Store className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-[#0C0C0C]">MegaStore</span>
            </div>

            {/* Notifications */}
            <div className="flex items-center space-x-3">
              <button className="relative hover:bg-gray-100 p-2 rounded-lg transition">
                <Bell className="w-5 h-5 text-[#555555]" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold text-[10px]">
                  1
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile/Tablet Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="grid grid-cols-4 gap-1">
          {/* Home */}
          <Link 
            href="/shopkeeper" 
            className={`flex flex-col items-center justify-center py-3 px-2 hover:bg-gray-50 transition ${
              pathname === '/shopkeeper' ? 'bg-[#00C897]/10' : ''
            }`}
          >
            <Home className={`w-6 h-6 mb-1 ${
              pathname === '/shopkeeper' ? 'text-[#00C897]' : 'text-[#555555]'
            }`} />
            <span className={`text-xs font-medium ${
              pathname === '/shopkeeper' ? 'text-[#00C897]' : 'text-[#555555]'
            }`}>Home</span>
          </Link>

          {/* Orders */}
          <Link 
            href="/shopkeeper/orders" 
            className={`flex flex-col items-center justify-center py-3 px-2 hover:bg-gray-50 transition ${
              pathname?.startsWith('/shopkeeper/orders') ? 'bg-[#00C897]/10' : ''
            }`}
          >
            <Package className={`w-6 h-6 mb-1 ${
              pathname?.startsWith('/shopkeeper/orders') ? 'text-[#00C897]' : 'text-[#555555]'
            }`} />
            <span className={`text-xs ${
              pathname?.startsWith('/shopkeeper/orders') ? 'text-[#00C897] font-medium' : 'text-[#555555]'
            }`}>Orders</span>
          </Link>

          {/* Inventory */}
          <Link 
            href="/shopkeeper/products" 
            className={`relative flex flex-col items-center justify-center py-3 px-2 hover:bg-gray-50 transition ${
              pathname?.startsWith('/shopkeeper/products') ? 'bg-[#00C897]/10' : ''
            }`}
          >
            <BarChart3 className={`w-6 h-6 mb-1 ${
              pathname?.startsWith('/shopkeeper/products') ? 'text-[#00C897]' : 'text-[#555555]'
            }`} />
            <span className={`text-xs ${
              pathname?.startsWith('/shopkeeper/products') ? 'text-[#00C897] font-medium' : 'text-[#555555]'
            }`}>Inventory</span>
          </Link>

          {/* Profile */}
          <Link 
            href="/shopkeeper/profile"
            className={`relative flex flex-col items-center justify-center py-3 px-2 hover:bg-gray-50 transition ${
              pathname?.startsWith('/shopkeeper/profile') ? 'bg-[#00C897]/10' : ''
            }`}
          >
            <User className={`w-6 h-6 mb-1 ${
              pathname?.startsWith('/shopkeeper/profile') ? 'text-[#00C897]' : 'text-[#555555]'
            }`} />
            <span className={`text-xs ${
              pathname?.startsWith('/shopkeeper/profile') ? 'text-[#00C897] font-medium' : 'text-[#555555]'
            }`}>Profile</span>
          </Link>
        </div>
      </nav>
    </>
  );
}
