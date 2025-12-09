'use client';

import React, { useState } from 'react';
import ShopkeeperNavbar from './components/ShopkeeperNavbar';
import QuickStats from './components/QuickStats';
import OrdersOverview from './components/OrdersOverview';
import InventoryAlerts from './components/InventoryAlerts';
import MessagesPreview from './components/MessagesPreview';
import SalesChart from './components/SalesChart';
import QuickActions from './components/QuickActions';

export default function ShopkeeperDashboard() {
  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <ShopkeeperNavbar />
      
      <main className="max-w-[1400px] mx-auto px-4 lg:px-6 py-6 lg:py-8 pb-24 lg:pb-8">
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
