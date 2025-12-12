'use client';

import React from 'react';
import AdminSidebar from './components/AdminSidebar';
import DashboardHeader from './components/DashboardHeader';
import KPICards from './components/KPICards';
import SystemHealth from './components/SystemHealth';
import QuickStatsGrid from './components/QuickStatsGrid';
import LiveActivityFeed from './components/LiveActivityFeed';
import VerificationQueue from './components/VerificationQueue';
import ComplaintsSnapshot from './components/ComplaintsSnapshot';
import BookingOrderSnapshot from './components/BookingOrderSnapshot';
import FinancialSummary from './components/FinancialSummary';
import ProductInventoryOverview from './components/ProductInventoryOverview';
import ChartsAnalytics from './components/ChartsAnalytics';
import CTAButtons from './components/CTAButtons';
import DashboardFooter from './components/DashboardFooter';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-[#F4F6FA] flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-72 transition-all duration-300">
        {/* Header - Hidden on admin dashboard, shown on sub-pages */}
        <div className="sr-only">
          <DashboardHeader />
        </div>

        {/* Main Content */}
        <main className="max-w-[1920px] mx-auto px-6 py-8 space-y-8">
        {/* KPI Cards */}
        <KPICards />

        {/* System Health */}
        <SystemHealth />

        {/* Quick Stats Grid */}
        <QuickStatsGrid />

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - 2/3 width */}
          <div className="xl:col-span-2 space-y-8">
            {/* Live Activity Feed */}
            <LiveActivityFeed />

            {/* Charts & Analytics */}
            <ChartsAnalytics />

            {/* Booking & Order Snapshot */}
            <BookingOrderSnapshot />
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-8">
            {/* Verification Queue */}
            <VerificationQueue />

            {/* Complaints Snapshot */}
            <ComplaintsSnapshot />

            {/* Financial Summary */}
            <FinancialSummary />

            {/* Product & Inventory */}
            <ProductInventoryOverview />
          </div>
        </div>

        {/* CTA Buttons Section */}
        <CTAButtons />
      </main>

        {/* Footer */}
        <DashboardFooter />
      </div>
    </div>
  );
}
