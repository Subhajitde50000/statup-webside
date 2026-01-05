'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Ban, Mail } from 'lucide-react';
import ShopkeeperNavbar from './components/ShopkeeperNavbar';
import QuickStats from './components/QuickStats';
import OrdersOverview from './components/OrdersOverview';
import InventoryAlerts from './components/InventoryAlerts';
import MessagesPreview from './components/MessagesPreview';
import SalesChart from './components/SalesChart';
import QuickActions from './components/QuickActions';
import { Store, Clock } from 'lucide-react';

export default function ShopkeeperDashboard() {
  const router = useRouter();
  const [isShopOpen, setIsShopOpen] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthAndSuspension();
  }, []);

  const checkAuthAndSuspension = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const storedUser = localStorage.getItem('user');
      
      if (!token || !storedUser) {
        router.push('/auth');
        return;
      }

      const userData = JSON.parse(storedUser);
      
      // Check if user is a shopkeeper
      if (userData.role !== 'shopkeeper' && userData.role !== 'pending_shopkeeper') {
        router.push('/');
        return;
      }

      // Check if suspended
      if (userData.is_suspended) {
        setUser(userData);
        setLoading(false);
        return;
      }

      setUser(userData);
      setLoading(false);
    } catch (error) {
      console.error('Auth check error:', error);
      router.push('/auth');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3B82F6]"></div>
      </div>
    );
  }

  // Show suspension message if suspended
  if (user?.is_suspended) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Ban className="w-10 h-10 text-red-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Account Suspended
          </h1>
          
          <p className="text-gray-600 mb-6">
            Your shop account has been suspended by the management team.
          </p>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm font-semibold text-red-900 mb-2">Suspension Reason:</p>
            <p className="text-sm text-red-800">
              {user.suspension_reason || 'No specific reason provided'}
            </p>
          </div>
          
          <p className="text-sm text-gray-500 mb-6">
            If you believe this is a mistake or would like to appeal this decision,
            please contact our support team.
          </p>
          
          <a
            href="mailto:support@electromart.com"
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            <Mail className="w-5 h-5" />
            Contact Support
          </a>
          
          <button
            onClick={() => {
              localStorage.clear();
              router.push('/auth');
            }}
            className="mt-4 w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  const handleToggleShop = () => {
    const newStatus = !isShopOpen;
    setIsShopOpen(newStatus);
    
    // Here you would make an API call to update the shop status
    console.log('Shop status changed to:', newStatus ? 'OPEN' : 'CLOSED');
    
    // Show a toast notification (you can add a toast library)
    alert(`Shop is now ${newStatus ? 'OPEN' : 'CLOSED'}`);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <ShopkeeperNavbar />
      
      <main className="max-w-[1400px] mx-auto px-4 lg:px-6 py-6 lg:py-8 pb-24 lg:pb-8">
        {/* Shop Status Toggle */}
        <section className="mb-8">
          <div className={`bg-gradient-to-r ${
            isShopOpen 
              ? 'from-green-500 to-emerald-600' 
              : 'from-red-500 to-rose-600'
          } rounded-2xl shadow-lg p-6 md:p-8 text-white transition-all duration-300`}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  isShopOpen ? 'bg-white/20' : 'bg-white/20'
                } backdrop-blur-sm`}>
                  <Store className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-1">
                    Shop Status: {isShopOpen ? 'OPEN' : 'CLOSED'}
                  </h2>
                  <p className="text-white/90 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {isShopOpen 
                      ? 'Customers can browse and order products' 
                      : 'Customers cannot place new orders'}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col items-center gap-3">
                <button
                  onClick={handleToggleShop}
                  className={`relative inline-flex items-center h-14 w-28 rounded-full transition-colors focus:outline-none focus:ring-4 focus:ring-white/30 ${
                    isShopOpen ? 'bg-white/30' : 'bg-white/20'
                  }`}
                >
                  <span
                    className={`inline-block h-10 w-10 transform rounded-full bg-white shadow-lg transition-transform ${
                      isShopOpen ? 'translate-x-16' : 'translate-x-2'
                    }`}
                  />
                  <span className={`absolute text-xs font-bold ${
                    isShopOpen ? 'left-3' : 'right-3'
                  }`}>
                    {isShopOpen ? 'ON' : 'OFF'}
                  </span>
                </button>
                <span className="text-sm font-medium text-white/90">
                  Tap to {isShopOpen ? 'Close' : 'Open'} Shop
                </span>
              </div>
            </div>
            
            {!isShopOpen && (
              <div className="mt-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <p className="text-sm text-white/90">
                  ⚠️ <strong>Note:</strong> While your shop is closed, customers cannot place new orders. 
                  Existing orders will still need to be fulfilled.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Quick Stats Overview */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-[#0C0C0C] mb-6">Quick Stats Overview</h2>
          <QuickStats />
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Orders & Inventory */}
          <div className="xl:col-span-2 space-y-8">
            {/* Orders Overview Section */}
            <section>
              <h2 className="text-2xl font-bold text-[#0C0C0C] mb-6">Orders Overview Section</h2>
              <OrdersOverview />
            </section>

            {/* Inventory Alerts Section */}
            <section>
              <h2 className="text-2xl font-bold text-[#0C0C0C] mb-6">Inventory Alerts Section</h2>
              <InventoryAlerts />
            </section>
          </div>

          {/* Right Column - Messages & Chart */}
          <div className="space-y-8">
            {/* Messages from Professionals */}
            <section>
              <h2 className="text-2xl font-bold text-[#0C0C0C] mb-6">New Messages from Professionals</h2>
              <MessagesPreview />
            </section>

            {/* Sales Chart */}
            <section>
              <SalesChart />
            </section>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <section className="mt-8">
          <h2 className="text-2xl font-bold text-[#0C0C0C] mb-6">Quick Action Buttons</h2>
          <QuickActions />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-[1400px] mx-auto px-6 py-6 text-center text-[#555555]">
          <p>© 2024 MegaStore Supplies. | <a href="#" className="hover:text-[#00C897]">Terms & Conditions</a> | <a href="#" className="hover:text-[#00C897]">Support</a></p>
        </div>
      </footer>
    </div>
  );
}
