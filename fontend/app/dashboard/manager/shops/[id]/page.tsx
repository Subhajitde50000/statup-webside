'use client';

import React, { useState, useEffect, use } from 'react';
import { 
  ArrowLeft, CheckCircle, Ban, MessageSquare, Download, Mail, Phone, MapPin, 
  Calendar, Package, Star, Clock, AlertTriangle, FileText, Eye, XCircle, Edit, Trash2,
  Image as ImageIcon, RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import TopNavbar from '../../components/TopNavbar';
import LeftSidebar from '../../components/LeftSidebar';

interface Shop {
  id: string;
  name: string;
  email?: string;
  phone: string;
  role: string;
  is_active: boolean;
  is_verified?: boolean;
  is_suspended?: boolean;
  suspension_reason?: string;
  suspended_at?: string;
  suspended_by?: string;
  profile_image?: string;
  created_at: string;
  updated_at: string;
  approval_data?: {
    shop_name?: string;
    shop_type?: string;
    shop_address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    gst_number?: string;
    business_license?: string;
    shop_image?: string;
  };
}

export default function ShopProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [activeTab, setActiveTab] = useState('info');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [suspensionReason, setSuspensionReason] = useState('');
  const [isSuspending, setIsSuspending] = useState(false);

  useEffect(() => {
    fetchShopData();
  }, [resolvedParams.id]);

  const fetchShopData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        setError('No access token found. Please login.');
        return;
      }

      const response = await fetch(`http://localhost:8000/api/users/list?role=shopkeeper&per_page=100`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch shop data');
      }

      const data = await response.json();
      const foundShop = data.users?.find((u: Shop) => u.id === resolvedParams.id);
      
      if (!foundShop) {
        setError('Shop not found');
        return;
      }

      setShop(foundShop);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load shop data');
      console.error('Error fetching shop:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSuspendClick = () => {
    setSuspensionReason(shop?.suspension_reason || '');
    setShowSuspendModal(true);
  };

  const handleConfirmSuspend = async () => {
    if (!shop) return;

    try {
      setIsSuspending(true);
      const token = localStorage.getItem('access_token');
      
      const endpoint = shop.is_suspended 
        ? `http://localhost:8000/api/users/${shop.id}/unsuspend`
        : `http://localhost:8000/api/users/${shop.id}/suspend?suspension_reason=${encodeURIComponent(suspensionReason)}`;
      
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update suspension status');
      }

      // Refresh shop data
      await fetchShopData();
      setShowSuspendModal(false);
      setSuspensionReason('');
      
      alert(`Shop ${shop.is_suspended ? 'unsuspended' : 'suspended'} successfully!`);
    } catch (error) {
      console.error('Error updating suspension:', error);
      alert(error instanceof Error ? error.message : 'Failed to update suspension status');
    } finally {
      setIsSuspending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <TopNavbar />
        <div className="flex">
          <LeftSidebar isOpen={sidebarOpen} />
          <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
            <div className="p-8 flex items-center justify-center min-h-screen">
              <div className="text-center">
                <RefreshCw className="w-12 h-12 text-[#3B82F6] animate-spin mx-auto mb-4" />
                <p className="text-[#64748B]">Loading shop details...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <TopNavbar />
        <div className="flex">
          <LeftSidebar isOpen={sidebarOpen} />
          <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
            <div className="p-8">
              <Link href="/dashboard/manager/shops">
                <button className="flex items-center gap-2 text-[#64748B] hover:text-[#3B82F6] mb-4 transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm font-medium">Back to Shops</span>
                </button>
              </Link>
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-12 text-center">
                <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-[#1E293B] mb-2">Error Loading Shop</h2>
                <p className="text-[#64748B]">{error || 'Shop not found'}</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <TopNavbar />
      <div className="flex">
        <LeftSidebar isOpen={sidebarOpen} />
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
          <div className="p-8">
            <div className="max-w-[1400px] mx-auto">
              {/* Header */}
              <div className="mb-8">
          <Link href="/dashboard/manager/shops">
            <button className="flex items-center gap-2 text-[#64748B] hover:text-[#3B82F6] mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back to Shops</span>
            </button>
          </Link>

          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl bg-[#3B82F6] flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
                  {shop.profile_image ? (
                    <img src={`http://localhost:8000${shop.profile_image}`} alt={shop.name} className="w-full h-full object-cover" />
                  ) : (
                    shop.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-[#1E293B] mb-2">{shop.name}</h1>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      shop.is_suspended
                        ? 'bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA]'
                        : shop.is_active 
                        ? 'bg-[#D1FAE5] text-[#059669]' 
                        : 'bg-[#FEE2E2] text-[#DC2626]'
                    }`}>
                      {shop.is_suspended ? 'SUSPENDED' : (shop.is_active ? 'ACTIVE' : 'INACTIVE')}
                    </span>
                    {shop.is_verified && (
                      <div className="flex items-center gap-1 text-[#059669]">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-xs font-semibold">Verified</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!shop.is_verified && (
                  <button className="px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-colors text-sm font-medium flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </button>
                )}
                <button 
                  onClick={handleSuspendClick}
                  className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium flex items-center gap-2 ${
                    shop.is_suspended
                      ? 'bg-[#10B981] text-white hover:bg-[#059669]'
                      : 'bg-[#EF4444] text-white hover:bg-[#DC2626]'
                  }`}
                >
                  <Ban className="w-4 h-4" />
                  {shop.is_suspended ? 'Unsuspend' : 'Suspend'}
                </button>
                <button className="px-4 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors text-sm font-medium flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Message
                </button>
                <button className="px-4 py-2 bg-white border border-[#E2E8F0] text-[#64748B] rounded-lg hover:bg-[#F8FAFC] transition-colors text-sm font-medium flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download All
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] mb-6 overflow-hidden">
          <div className="flex items-center gap-1 p-2 overflow-x-auto">
            {['info', 'sales', 'reports'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-[#3B82F6] text-white shadow-sm'
                    : 'text-[#64748B] hover:bg-[#F8FAFC]'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        {activeTab === 'info' && (
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-[#1E293B] mb-6">Shop Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">Shop Name</label>
                    <p className="text-sm text-[#1E293B] mt-1 font-medium">{shop.approval_data?.shop_name || shop.name}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">Shop Type</label>
                    <p className="text-sm text-[#1E293B] mt-1">{shop.approval_data?.shop_type || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide flex items-center gap-1">
                      <Mail className="w-3 h-3" /> Email
                    </label>
                    <p className="text-sm text-[#3B82F6] mt-1">{shop.email || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide flex items-center gap-1">
                      <Phone className="w-3 h-3" /> Phone
                    </label>
                    <p className="text-sm text-[#3B82F6] mt-1">{shop.phone}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">GST Number</label>
                    <p className="text-sm text-[#1E293B] mt-1 font-mono">{shop.approval_data?.gst_number || 'Not provided'}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> Address
                    </label>
                    <p className="text-sm text-[#1E293B] mt-1">{shop.approval_data?.shop_address || 'Not provided'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">City</label>
                      <p className="text-sm text-[#1E293B] mt-1">{shop.approval_data?.city || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">State</label>
                      <p className="text-sm text-[#1E293B] mt-1">{shop.approval_data?.state || 'N/A'}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">Pincode</label>
                    <p className="text-sm text-[#1E293B] mt-1">{shop.approval_data?.pincode || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">Business License</label>
                    <p className="text-sm text-[#1E293B] mt-1">{shop.approval_data?.business_license || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Status */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-[#1E293B] mb-6">Account Status</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">Account Status</label>
                  <p className="text-sm text-[#1E293B] mt-1 font-medium">{shop.is_active ? 'Active' : 'Inactive'}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">Verification Status</label>
                  <p className="text-sm text-[#1E293B] mt-1">{shop.is_verified ? 'Verified' : 'Not Verified'}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">Role</label>
                  <p className="text-sm text-[#1E293B] mt-1 font-mono">{shop.role}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Registration Date
                  </label>
                  <p className="text-sm text-[#1E293B] mt-1">
                    {new Date(shop.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">Last Updated</label>
                  <p className="text-sm text-[#1E293B] mt-1">
                    {new Date(shop.updated_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sales' && (
          <div className="space-y-6">
            {/* Sales Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-xl p-6 text-white shadow-lg">
                <Package className="w-8 h-8 mb-3 opacity-80" />
                <p className="text-sm opacity-90 mb-1">Total Products</p>
                <p className="text-3xl font-bold">0</p>
              </div>
              <div className="bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl p-6 text-white shadow-lg">
                <Star className="w-8 h-8 mb-3 opacity-80" />
                <p className="text-sm opacity-90 mb-1">Total Orders</p>
                <p className="text-3xl font-bold">0</p>
              </div>
              <div className="bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-xl p-6 text-white shadow-lg">
                <Clock className="w-8 h-8 mb-3 opacity-80" />
                <p className="text-sm opacity-90 mb-1">Pending Orders</p>
                <p className="text-3xl font-bold">0</p>
              </div>
              <div className="bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] rounded-xl p-6 text-white shadow-lg">
                <Package className="w-8 h-8 mb-3 opacity-80" />
                <p className="text-sm opacity-90 mb-1">Total Revenue</p>
                <p className="text-3xl font-bold">₹0</p>
              </div>
            </div>

            {/* Inventory Information */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-[#1E293B] mb-4">Inventory Overview</h2>
              <div className="text-center py-12 text-[#64748B]">
                <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No inventory data available</p>
                <p className="text-sm">Products and stock information will appear here once the shop adds inventory</p>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-[#1E293B] mb-4">Recent Orders</h2>
              <div className="text-center py-12 text-[#64748B]">
                <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No orders yet</p>
                <p className="text-sm">Order history will be displayed here</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-6">
            {/* Suspension History */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-[#1E293B] mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[#EF4444]" />
                Suspension History
              </h2>
              {shop.is_suspended ? (
                <div className="bg-[#FEF2F2] border border-[#FEE2E2] rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Ban className="w-5 h-5 text-[#DC2626] mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-semibold text-[#DC2626]">Currently Suspended</p>
                        <span className="text-xs text-[#64748B]">
                          {shop.suspended_at ? new Date(shop.suspended_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : 'Date unknown'}
                        </span>
                      </div>
                      <p className="text-sm text-[#1E293B] mb-1"><strong>Reason:</strong></p>
                      <p className="text-sm text-[#475569] bg-white p-3 rounded border border-[#E5E7EB]">
                        {shop.suspension_reason || 'No reason provided'}
                      </p>
                      {shop.suspended_by && (
                        <p className="text-xs text-[#64748B] mt-2">Suspended by: <strong>{shop.suspended_by}</strong></p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3 p-3 bg-[#F0FDF4] rounded-lg border border-[#BBF7D0]">
                  <CheckCircle className="w-4 h-4 text-[#16A34A] mt-1" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#16A34A]">Account Active</p>
                    <p className="text-xs text-[#64748B] mt-1">This shop has never been suspended</p>
                  </div>
                </div>
              )}
            </div>

            {/* Manager Notes */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-[#1E293B] mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#3B82F6]" />
                Manager Notes
              </h2>
              <textarea
                className="w-full p-4 border border-[#E2E8F0] rounded-lg text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] resize-none"
                rows={6}
                placeholder="Add internal notes about this shop (visible only to managers and admins)..."
              ></textarea>
              <div className="mt-4 flex justify-end">
                <button className="px-4 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors text-sm font-medium">
                  Save Notes
                </button>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-[#1E293B] mb-6">Performance Overview</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-[#64748B]">Total Revenue</p>
                    <p className="text-xs text-[#94A3B8] mt-0.5">Lifetime earnings</p>
                  </div>
                  <p className="text-2xl font-bold text-[#1E293B]">₹0</p>
                </div>
                <div className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-[#64748B]">Order Fulfillment Rate</p>
                    <p className="text-xs text-[#94A3B8] mt-0.5">Successfully completed orders</p>
                  </div>
                  <p className="text-2xl font-bold text-[#1E293B]">0%</p>
                </div>
                <div className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-[#64748B]">Average Response Time</p>
                    <p className="text-xs text-[#94A3B8] mt-0.5">Time to process orders</p>
                  </div>
                  <p className="text-2xl font-bold text-[#1E293B]">N/A</p>
                </div>
              </div>
            </div>

            {/* Export Reports */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-[#1E293B] mb-4">Export Reports</h2>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-colors text-sm font-medium">
                  <Download className="w-4 h-4" />
                  Download PDF Report
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E2E8F0] text-[#64748B] rounded-lg hover:bg-[#F8FAFC] transition-colors text-sm font-medium">
                  <Download className="w-4 h-4" />
                  Export as Excel
                </button>
              </div>
            </div>
          </div>
        )}
            </div>
          </div>
        </main>
      </div>

      {/* Suspend Modal */}
      {showSuspendModal && shop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-[#1E293B] mb-4">
              {shop.is_suspended ? 'Unsuspend Shop' : 'Suspend Shop'}
            </h3>
            
            {shop.is_suspended ? (
              <div className="mb-6">
                <p className="text-sm text-[#64748B] mb-4">
                  Are you sure you want to unsuspend <strong>{shop.name}</strong>? 
                  They will regain access to their shop dashboard immediately.
                </p>
                <div className="bg-[#FEF3C7] border border-[#FDE68A] rounded-lg p-4">
                  <p className="text-sm font-semibold text-[#92400E] mb-1">Current Suspension Reason:</p>
                  <p className="text-sm text-[#92400E]">{shop.suspension_reason || 'No reason provided'}</p>
                </div>
              </div>
            ) : (
              <div className="mb-6">
                <p className="text-sm text-[#64748B] mb-4">
                  You are about to suspend <strong>{shop.name}</strong>. 
                  They will lose access to their shop dashboard and their shop will not appear in user searches.
                </p>
                <label className="block text-sm font-medium text-[#1E293B] mb-2">
                  Reason for suspension <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={suspensionReason}
                  onChange={(e) => setSuspensionReason(e.target.value)}
                  placeholder="Enter the reason for suspending this shop..."
                  className="w-full p-3 border border-[#E2E8F0] rounded-lg text-sm text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent resize-none"
                  rows={4}
                  required
                />
              </div>
            )}
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setShowSuspendModal(false);
                  setSuspensionReason('');
                }}
                disabled={isSuspending}
                className="flex-1 px-4 py-2 bg-[#F1F5F9] text-[#64748B] rounded-lg hover:bg-[#E2E8F0] transition-colors font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSuspend}
                disabled={isSuspending || (!shop.is_suspended && !suspensionReason.trim())}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors font-medium disabled:opacity-50 ${
                  shop.is_suspended
                    ? 'bg-[#10B981] text-white hover:bg-[#059669]'
                    : 'bg-[#EF4444] text-white hover:bg-[#DC2626]'
                }`}
              >
                {isSuspending ? 'Processing...' : (shop.is_suspended ? 'Unsuspend' : 'Suspend')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
