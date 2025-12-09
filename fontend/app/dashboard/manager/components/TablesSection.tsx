'use client';

import React from 'react';
import { Store, User, ShoppingBag, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function TablesSection() {
  const latestShops = [
    {
      id: 1,
      name: 'ElectroWorld Pro',
      owner: 'Rajesh Kumar',
      category: 'Electronics',
      status: 'active',
      registeredDate: '2024-12-08'
    },
    {
      id: 2,
      name: 'TechFix Solutions',
      owner: 'Priya Sharma',
      category: 'Electronics Repair',
      status: 'pending',
      registeredDate: '2024-12-07'
    },
    {
      id: 3,
      name: 'HomeService Supplies',
      owner: 'Amit Verma',
      category: 'Home Repair',
      status: 'active',
      registeredDate: '2024-12-06'
    },
    {
      id: 4,
      name: 'QuickFix Hub',
      owner: 'Neha Singh',
      category: 'General Services',
      status: 'pending',
      registeredDate: '2024-12-05'
    },
  ];

  const latestProfessionals = [
    {
      id: 1,
      name: 'Ravi Kumar',
      phone: '+91 98765 43210',
      category: 'Electrician',
      kycStatus: 'verified',
      registeredDate: '2024-12-08'
    },
    {
      id: 2,
      name: 'Anita Desai',
      phone: '+91 98765 43211',
      category: 'Plumber',
      kycStatus: 'pending',
      registeredDate: '2024-12-07'
    },
    {
      id: 3,
      name: 'Suresh Patel',
      phone: '+91 98765 43212',
      category: 'Carpenter',
      kycStatus: 'verified',
      registeredDate: '2024-12-06'
    },
    {
      id: 4,
      name: 'Kavita Joshi',
      phone: '+91 98765 43213',
      category: 'AC Technician',
      kycStatus: 'pending',
      registeredDate: '2024-12-05'
    },
  ];

  const recentOrders = [
    {
      id: '#ORD-45213',
      professional: 'Ravi Kumar',
      shop: 'ElectroWorld Pro',
      amount: 1250,
      status: 'completed',
      date: '2024-12-09'
    },
    {
      id: '#ORD-45212',
      professional: 'Anita Desai',
      shop: 'HomeService Supplies',
      amount: 850,
      status: 'ongoing',
      date: '2024-12-09'
    },
    {
      id: '#ORD-45211',
      professional: 'Suresh Patel',
      shop: 'TechFix Solutions',
      amount: 2100,
      status: 'pending',
      date: '2024-12-08'
    },
    {
      id: '#ORD-45210',
      professional: 'Kavita Joshi',
      shop: 'QuickFix Hub',
      amount: 1500,
      status: 'completed',
      date: '2024-12-08'
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
      case 'verified':
      case 'completed':
        return 'bg-[#D1FAE5] text-[#059669]';
      case 'pending':
      case 'ongoing':
        return 'bg-[#FEF3C7] text-[#D97706]';
      default:
        return 'bg-[#F1F5F9] text-[#64748B]';
    }
  };

  return (
    <div className="space-y-6">
      {/* Latest Shops Registered */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#E0E4EA]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-[#1E293B] flex items-center gap-2">
              <Store className="w-5 h-5 text-[#3B82F6]" />
              Latest Shops Registered
            </h3>
            <p className="text-[#64748B] text-xs mt-1">Recently joined shops on the platform</p>
          </div>
          <button className="text-[#3B82F6] font-semibold text-sm hover:text-[#2563EB] transition-colors">
            View All →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E2E8F0]">
                <th className="text-left py-3 px-4 text-xs font-semibold text-[#64748B] uppercase tracking-wide">Shop Name</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-[#64748B] uppercase tracking-wide">Owner</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-[#64748B] uppercase tracking-wide">Category</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-[#64748B] uppercase tracking-wide">Status</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-[#64748B] uppercase tracking-wide">Action</th>
              </tr>
            </thead>
            <tbody>
              {latestShops.map((shop) => (
                <tr key={shop.id} className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-4 px-4">
                    <div className="font-semibold text-[#1E293B] text-sm">{shop.name}</div>
                  </td>
                  <td className="py-4 px-4 text-[#64748B] text-sm">{shop.owner}</td>
                  <td className="py-4 px-4 text-[#64748B] text-sm">{shop.category}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(shop.status)}`}>
                      {shop.status.charAt(0).toUpperCase() + shop.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <button className="text-[#3B82F6] hover:text-[#2563EB] transition-colors">
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Latest Professionals Registered */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#E0E4EA]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-[#0D1B2A] flex items-center gap-2">
              <User className="w-6 h-6 text-[#3B82F6]" />
              Latest Professionals Registered
            </h3>
            <p className="text-[#6B7280] text-sm mt-1">Recently joined professionals on the platform</p>
          </div>
          <button className="text-[#FF7A00] font-semibold text-sm hover:text-[#FFB800] transition-colors">
            View All →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E0E4EA]">
                <th className="text-left py-3 px-4 text-sm font-bold text-[#0D1B2A]">Name</th>
                <th className="text-left py-3 px-4 text-sm font-bold text-[#0D1B2A]">Phone</th>
                <th className="text-left py-3 px-4 text-sm font-bold text-[#0D1B2A]">Category</th>
                <th className="text-left py-3 px-4 text-sm font-bold text-[#0D1B2A]">KYC Status</th>
                <th className="text-left py-3 px-4 text-sm font-bold text-[#0D1B2A]">Action</th>
              </tr>
            </thead>
            <tbody>
              {latestProfessionals.map((professional) => (
                <tr key={professional.id} className="border-b border-[#E0E4EA] hover:bg-[#F5F7FA] transition-colors">
                  <td className="py-4 px-4">
                    <div className="font-semibold text-[#0D1B2A]">{professional.name}</div>
                  </td>
                  <td className="py-4 px-4 text-[#6B7280]">{professional.phone}</td>
                  <td className="py-4 px-4 text-[#6B7280]">{professional.category}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(professional.kycStatus)}`}>
                      {professional.kycStatus.charAt(0).toUpperCase() + professional.kycStatus.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <button className="text-[#3B82F6] hover:text-[#2563EB] transition-colors">
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#E0E4EA]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-[#0D1B2A] flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-[#2ECC71]" />
              Recent Orders
            </h3>
            <p className="text-[#6B7280] text-sm mt-1">Latest orders placed on the platform</p>
          </div>
          <button className="text-[#FF7A00] font-semibold text-sm hover:text-[#FFB800] transition-colors">
            View All →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E0E4EA]">
                <th className="text-left py-3 px-4 text-sm font-bold text-[#0D1B2A]">Order ID</th>
                <th className="text-left py-3 px-4 text-sm font-bold text-[#0D1B2A]">Professional</th>
                <th className="text-left py-3 px-4 text-sm font-bold text-[#0D1B2A]">Shop</th>
                <th className="text-left py-3 px-4 text-sm font-bold text-[#0D1B2A]">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-bold text-[#0D1B2A]">Status</th>
                <th className="text-left py-3 px-4 text-sm font-bold text-[#0D1B2A]">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-[#E0E4EA] hover:bg-[#F5F7FA] transition-colors">
                  <td className="py-4 px-4">
                    <div className="font-semibold text-[#0D1B2A]">{order.id}</div>
                  </td>
                  <td className="py-4 px-4 text-[#6B7280]">{order.professional}</td>
                  <td className="py-4 px-4 text-[#6B7280]">{order.shop}</td>
                  <td className="py-4 px-4">
                    <span className="font-bold text-[#0D1B2A]">₹{order.amount}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-[#6B7280]">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
