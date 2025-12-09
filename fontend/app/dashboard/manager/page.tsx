'use client';

import React, { useState } from 'react';
import TopNavbar from './components/TopNavbar';
import LeftSidebar from './components/LeftSidebar';
import KPICards from './components/KPICards';
import ChartsSection from './components/ChartsSection';
import AlertsSection from './components/AlertsSection';
import VerificationWidgets from './components/VerificationWidgets';
import LiveActivityFeed from './components/LiveActivityFeed';
import TablesSection from './components/TablesSection';
import Footer from './components/Footer';

export default function ManagerDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dateFilter, setDateFilter] = useState('today');

  return (
    <div className="min-h-screen bg-[#F8FAFC]" style={{ fontFamily: 'Inter, Poppins, sans-serif' }}>
      {/* Top Navbar */}
      <TopNavbar />
      
      <div className="flex">
        {/* Left Sidebar */}
        <LeftSidebar isOpen={sidebarOpen} />
        
        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
          <div className="p-8">
            {/* Header Section */}
            <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-3xl font-semibold text-[#1E293B] mb-2">Manager Dashboard</h1>
                <p className="text-[#64748B] text-sm">Real-Time Overview of Shops & Professionals</p>
              </div>
              
              <div className="flex items-center gap-4 mt-4 lg:mt-0">
                {/* Date Filter */}
                <select 
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[#1E293B] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                >
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="custom">Custom Range</option>
                </select>
                
                {/* Refresh Button */}
                <button className="px-4 py-2 bg-white rounded-lg border border-[#E2E8F0] text-[#475569] hover:bg-[#F1F5F9] transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
                
                {/* Export Button */}
                <button className="px-6 py-2 bg-[#3B82F6] text-white text-sm font-medium rounded-lg hover:bg-[#2563EB] transition-colors shadow-sm">
                  Export Report
                </button>
              </div>
            </div>

            {/* KPI Cards */}
            <KPICards />

            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
              {/* Left & Center Columns - Charts and Alerts */}
              <div className="lg:col-span-2 space-y-8">
                <ChartsSection />
                <AlertsSection />
                <VerificationWidgets />
                <TablesSection />
              </div>

              {/* Right Column - Live Activity Feed */}
              <div className="lg:col-span-1">
                <LiveActivityFeed />
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <Footer />
        </main>
      </div>
    </div>
  );
}
