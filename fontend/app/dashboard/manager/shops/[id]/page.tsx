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
  profile_image?: string;
  created_at: string;
  updated_at: string;
}

export default function ShopProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [activeTab, setActiveTab] = useState('info');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
                      shop.is_active 
                        ? 'bg-[#D1FAE5] text-[#059669]' 
                        : 'bg-[#FEE2E2] text-[#DC2626]'
                    }`}>
                      {shop.is_active ? 'ACTIVE' : 'INACTIVE'}
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
                <button className="px-4 py-2 bg-[#EF4444] text-white rounded-lg hover:bg-[#DC2626] transition-colors text-sm font-medium flex items-center gap-2">
                  <Ban className="w-4 h-4" />
                  Suspend
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
            {['info'].map((tab) => (
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
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#1E293B] mb-6">Shop Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">Shop Name</label>
                  <p className="text-sm text-[#1E293B] mt-1 font-medium">{shop.name}</p>
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
                  <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">Role</label>
                  <p className="text-sm text-[#1E293B] mt-1 font-mono">{shop.role}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">Account Status</label>
                  <p className="text-sm text-[#1E293B] mt-1 font-medium">{shop.is_active ? 'Active' : 'Inactive'}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">Verification Status</label>
                  <p className="text-sm text-[#1E293B] mt-1">{shop.is_verified ? 'Verified' : 'Not Verified'}</p>
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
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
