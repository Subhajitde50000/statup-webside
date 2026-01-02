'use client';

import React, { useState } from 'react';
import ShopkeeperNavbar from './components/ShopkeeperNavbar';
import QuickStats from './components/QuickStats';
import OrdersOverview from './components/OrdersOverview';
import InventoryAlerts from './components/InventoryAlerts';
import MessagesPreview from './components/MessagesPreview';
import SalesChart from './components/SalesChart';
import QuickActions from './components/QuickActions';
import { Store, Clock } from 'lucide-react';

export default function ShopkeeperDashboard() {
  const [isShopOpen, setIsShopOpen] = useState(true);

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
