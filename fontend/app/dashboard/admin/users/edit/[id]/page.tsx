'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
  CheckCircle,
  Wallet,
  Tag,
  Shield,
  Clock,
  Trash2,
  Plus,
  Bell,
  Settings as SettingsIcon,
  User as UserIcon
} from 'lucide-react';
import AdminSidebar from '../../../components/AdminSidebar';

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id;

  // Mock user data - in real app, fetch based on userId
  const [formData, setFormData] = useState({
    firstName: 'Amit',
    lastName: 'Kumar',
    email: 'amit.kumar@email.com',
    phone: '+91 98765 43210',
    gender: 'male',
    dateOfBirth: '1995-05-15',
    street: '123 MG Road',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    walletBalance: '1250',
    accountStatus: 'active',
    emailVerified: true,
    phoneVerified: true,
    kycStatus: 'verified',
    registrationDate: '2023-06-10',
    lastLogin: '2024-01-23',
    totalBookings: '45',
    totalSpent: '₹25,430'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    router.push('/dashboard/admin/users');
  };

  const handleDelete = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
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
                  <h1 className="text-xl font-bold text-[#0B0F19]">Edit User</h1>
                  <p className="text-xs text-gray-600">Update user information</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <SettingsIcon className="w-5 h-5 text-gray-600" />
                </button>
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

        {/* Page Header */}
        <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-[#0B0F19]">Edit User</h1>
                <p className="text-sm text-gray-600 mt-1">Update user information and settings</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 bg-white border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete User</span>
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-6 py-2 bg-[#1A73E8] text-white rounded-lg hover:bg-[#1557B0] transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-6xl mx-auto">
        {/* User ID Info Card */}
        <div className="bg-gradient-to-r from-[#1A73E8] to-[#4285F4] rounded-xl p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">User ID</p>
              <p className="text-2xl font-bold">{userId}</p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90 mb-1">Member Since</p>
              <p className="text-lg font-semibold">{new Date(formData.registrationDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-blue-50 rounded-lg">
                <User className="w-5 h-5 text-[#1A73E8]" />
              </div>
              <h2 className="text-xl font-semibold text-[#0B0F19]">Personal Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A73E8] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A73E8] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A73E8] focus:border-transparent"
                  />
                  {formData.emailVerified && (
                    <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A73E8] focus:border-transparent"
                  />
                  {formData.phoneVerified && (
                    <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A73E8] focus:border-transparent"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A73E8] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-purple-50 rounded-lg">
                <MapPin className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-[#0B0F19]">Address Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A73E8] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A73E8] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A73E8] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pincode
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A73E8] focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-green-50 rounded-lg">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-[#0B0F19]">Account Settings</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Status
                </label>
                <select
                  name="accountStatus"
                  value={formData.accountStatus}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A73E8] focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  KYC Status
                </label>
                <select
                  name="kycStatus"
                  value={formData.kycStatus}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A73E8] focus:border-transparent"
                >
                  <option value="pending">Pending</option>
                  <option value="verified">Verified</option>
                  <option value="rejected">Rejected</option>
                  <option value="not_required">Not Required</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Wallet Balance (₹)
                </label>
                <div className="relative">
                  <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    name="walletBalance"
                    value={formData.walletBalance}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A73E8] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Account Statistics (Read-only) */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-orange-50 rounded-lg">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <h2 className="text-xl font-semibold text-[#0B0F19]">Account Statistics</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
                <p className="text-2xl font-bold text-[#0B0F19]">{formData.totalBookings}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Total Spent</p>
                <p className="text-2xl font-bold text-[#0B0F19]">{formData.totalSpent}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Last Login</p>
                <p className="text-sm font-semibold text-[#0B0F19]">{new Date(formData.lastLogin).toLocaleDateString()}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Registration</p>
                <p className="text-sm font-semibold text-[#0B0F19]">{new Date(formData.registrationDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Warning Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-900 mb-1">Important Notice</h3>
                <p className="text-sm text-yellow-800">
                  Any changes made to this user account will be logged and auditable. Ensure all information is accurate before saving. Critical changes like email or phone updates may trigger verification emails/SMS to the user.
                </p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3 bg-[#1A73E8] text-white rounded-lg hover:bg-[#1557B0] transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              <span>{isLoading ? 'Saving Changes...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-red-50 rounded-full">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Delete User Account</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this user account? This action cannot be undone and will permanently remove all user data, bookings, and transaction history.
            </p>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800">
                <strong>Warning:</strong> User ID <strong>{userId}</strong> will be permanently deleted along with:
              </p>
              <ul className="list-disc list-inside text-sm text-red-700 mt-2 space-y-1">
                <li>All booking history ({formData.totalBookings} bookings)</li>
                <li>Wallet balance (₹{formData.walletBalance})</li>
                <li>Personal information and documents</li>
                <li>Associated complaints and reviews</li>
              </ul>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
        </div>
        </div>
      </div>
    </div>
  );
}
