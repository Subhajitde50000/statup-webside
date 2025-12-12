'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Save, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Lock,
  Calendar,
  AlertCircle,
  Wallet,
  Tag,
  Plus,
  Bell,
  Settings as SettingsIcon,
  User as UserIcon
} from 'lucide-react';
import Link from 'next/link';
import AdminSidebar from '../../components/AdminSidebar';

export default function AddUserPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: 'male',
    dob: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    password: '',
    confirmPassword: '',
    initialBalance: '0',
    promoCode: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    router.push('/dashboard/admin/users');
  };

  return (
    <div className="flex h-screen bg-[#F5F7FA] overflow-hidden">
      {/* Admin Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-72 flex flex-col overflow-hidden">
        {/* Top Navigation Bar */}
        <div className="bg-white border-b border-gray-200 flex-shrink-0 z-20">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.back()}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-xl font-bold text-[#0B0F19]">Add New User</h1>
                  <p className="text-xs text-gray-600">Create a new customer account</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Settings */}
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <SettingsIcon className="w-5 h-5 text-gray-600" />
                </button>

                {/* Admin Profile */}
                <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                  <div className="w-9 h-9 bg-gradient-to-br from-[#10B981] to-[#10B981]/80 rounded-lg flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Admin User</p>
                    <p className="text-xs text-gray-500">Super Admin</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8">
            <div className="max-w-4xl mx-auto">

      {/* Form */}
      <form onSubmit={handleSubmit}>
        {/* Personal Information */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8ECF2] mb-6">
          <h2 className="text-xl font-bold text-[#0B0F19] mb-6">Personal Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#0B0F19] mb-2">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-[#F5F7FA] border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A73E8] focus:bg-white transition-all"
                  placeholder="Enter full name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0B0F19] mb-2">
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-[#F5F7FA] border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A73E8] focus:bg-white transition-all"
                  placeholder="email@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0B0F19] mb-2">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-[#F5F7FA] border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A73E8] focus:bg-white transition-all"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0B0F19] mb-2">
                Gender *
              </label>
              <select
                required
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-4 py-3 bg-[#F5F7FA] border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A73E8] focus:bg-white transition-all"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#0B0F19] mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                className="w-full px-4 py-3 bg-[#F5F7FA] border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A73E8] focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8ECF2] mb-6">
          <h2 className="text-xl font-bold text-[#0B0F19] mb-6">Address Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#0B0F19] mb-2">
                Street Address *
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 w-5 h-5 text-[#6B7280]" />
                <textarea
                  required
                  rows={3}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-[#F5F7FA] border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A73E8] focus:bg-white transition-all resize-none"
                  placeholder="Enter complete address"
                ></textarea>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0B0F19] mb-2">
                City *
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-3 bg-[#F5F7FA] border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A73E8] focus:bg-white transition-all"
                placeholder="City"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0B0F19] mb-2">
                State *
              </label>
              <input
                type="text"
                required
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-4 py-3 bg-[#F5F7FA] border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A73E8] focus:bg-white transition-all"
                placeholder="State"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0B0F19] mb-2">
                Pincode *
              </label>
              <input
                type="text"
                required
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                className="w-full px-4 py-3 bg-[#F5F7FA] border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A73E8] focus:bg-white transition-all"
                placeholder="123456"
              />
            </div>
          </div>
        </div>

        {/* Account Security */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8ECF2] mb-6">
          <h2 className="text-xl font-bold text-[#0B0F19] mb-6">Account Security</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#0B0F19] mb-2">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-[#F5F7FA] border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A73E8] focus:bg-white transition-all"
                  placeholder="Enter password"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0B0F19] mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-[#F5F7FA] border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A73E8] focus:bg-white transition-all"
                  placeholder="Confirm password"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Additional Settings */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8ECF2] mb-6">
          <h2 className="text-xl font-bold text-[#0B0F19] mb-6">Additional Settings</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#0B0F19] mb-2">
                Initial Wallet Balance
              </label>
              <div className="relative">
                <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                <input
                  type="number"
                  value={formData.initialBalance}
                  onChange={(e) => setFormData({ ...formData, initialBalance: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-[#F5F7FA] border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A73E8] focus:bg-white transition-all"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0B0F19] mb-2">
                Assign Promo Code
              </label>
              <div className="relative">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                <input
                  type="text"
                  value={formData.promoCode}
                  onChange={(e) => setFormData({ ...formData, promoCode: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-[#F5F7FA] border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A73E8] focus:bg-white transition-all"
                  placeholder="WELCOME100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          <button
            type="submit"
            className="px-8 py-3 bg-[#1A73E8] hover:bg-[#1557B0] text-white rounded-xl font-medium transition-colors"
          >
            Create User Account
          </button>
          <Link
            href="/dashboard/admin/users"
            className="px-8 py-3 bg-[#E8ECF2] hover:bg-[#D1D5DB] text-[#0B0F19] rounded-xl font-medium transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}