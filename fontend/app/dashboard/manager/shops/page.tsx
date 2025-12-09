'use client';

import React, { useState } from 'react';
import { Search, Download, Filter, ChevronDown, Eye, CheckCircle, Ban, MoreVertical, Star, Phone, MapPin, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import TopNavbar from '../components/TopNavbar';
import LeftSidebar from '../components/LeftSidebar';

export default function ShopsListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showMoreMenu, setShowMoreMenu] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const shops = [
    {
      id: 1,
      name: 'ElectroWorld Pro',
      photo: 'https://i.pravatar.cc/100?img=1',
      owner: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      status: 'active',
      verified: true,
      rating: 4.8,
      reviewCount: 234,
      location: 'Sector V, Kolkata',
      category: 'Electronics'
    },
    {
      id: 2,
      name: 'TechFix Solutions',
      photo: 'https://i.pravatar.cc/100?img=2',
      owner: 'Priya Sharma',
      phone: '+91 98765 43211',
      status: 'pending',
      verified: false,
      rating: 4.5,
      reviewCount: 156,
      location: 'Park Street, Kolkata',
      category: 'Electronics Repair'
    },
    {
      id: 3,
      name: 'HomeService Supplies',
      photo: 'https://i.pravatar.cc/100?img=3',
      owner: 'Amit Verma',
      phone: '+91 98765 43212',
      status: 'active',
      verified: true,
      rating: 4.9,
      reviewCount: 312,
      location: 'Salt Lake, Kolkata',
      category: 'Home Repair'
    },
    {
      id: 4,
      name: 'QuickFix Hub',
      photo: 'https://i.pravatar.cc/100?img=4',
      owner: 'Neha Singh',
      phone: '+91 98765 43213',
      status: 'suspended',
      verified: true,
      rating: 3.2,
      reviewCount: 89,
      location: 'New Market, Kolkata',
      category: 'General Services'
    },
    {
      id: 5,
      name: 'MegaStore Electronics',
      photo: 'https://i.pravatar.cc/100?img=5',
      owner: 'Suresh Patel',
      phone: '+91 98765 43214',
      status: 'inactive',
      verified: false,
      rating: 4.1,
      reviewCount: 67,
      location: 'Howrah, Kolkata',
      category: 'Electronics'
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-[#D1FAE5] text-[#059669] border border-[#A7F3D0]';
      case 'pending':
        return 'bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]';
      case 'suspended':
        return 'bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA]';
      case 'inactive':
        return 'bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]';
      default:
        return 'bg-[#F1F5F9] text-[#64748B]';
    }
  };

  const filteredShops = shops.filter(shop => {
    const matchesSearch = 
      shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.phone.includes(searchQuery);
    
    const matchesFilter = statusFilter === 'all' || shop.status === statusFilter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <TopNavbar />
      <div className="flex">
        <LeftSidebar isOpen={sidebarOpen} />
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
          <div className="p-8">
            <div className="max-w-[1400px] mx-auto">
              {/* Header Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-semibold text-[#1E293B] mb-2">All Shops</h1>
              <p className="text-[#64748B] text-sm">Manage and monitor all registered shops on the platform</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-white border border-[#E2E8F0] text-[#64748B] rounded-lg hover:bg-[#F8FAFC] transition-colors flex items-center gap-2 text-sm font-medium">
                <Download className="w-4 h-4" />
                Export CSV
              </button>
              <Link href="/dashboard/manager/shops/verification-requests">
                <button className="px-4 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors flex items-center gap-2 text-sm font-medium shadow-sm">
                  <AlertTriangle className="w-4 h-4" />
                  Verification Requests
                </button>
              </Link>
            </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-xl border border-[#E2E8F0] p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#94A3B8] w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by shop name, owner, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-sm text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
                />
              </div>

              {/* Filter Chips */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-[#64748B] font-medium">Filters:</span>
                {['all', 'active', 'suspended', 'pending', 'inactive'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setStatusFilter(filter)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      statusFilter === filter
                        ? 'bg-[#3B82F6] text-white shadow-sm'
                        : 'bg-[#F8FAFC] text-[#64748B] hover:bg-[#E2E8F0] border border-[#E2E8F0]'
                    }`}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
            </div>
                </div>
              </div>

              {/* Table Section */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                        <th className="text-left py-4 px-6 text-xs font-semibold text-[#64748B] uppercase tracking-wide">Shop</th>
                        <th className="text-left py-4 px-6 text-xs font-semibold text-[#64748B] uppercase tracking-wide">Owner</th>
                        <th className="text-left py-4 px-6 text-xs font-semibold text-[#64748B] uppercase tracking-wide">Phone</th>
                        <th className="text-left py-4 px-6 text-xs font-semibold text-[#64748B] uppercase tracking-wide">Status</th>
                        <th className="text-left py-4 px-6 text-xs font-semibold text-[#64748B] uppercase tracking-wide">Verification</th>
                        <th className="text-left py-4 px-6 text-xs font-semibold text-[#64748B] uppercase tracking-wide">Ratings</th>
                        <th className="text-left py-4 px-6 text-xs font-semibold text-[#64748B] uppercase tracking-wide">Location</th>
                        <th className="text-left py-4 px-6 text-xs font-semibold text-[#64748B] uppercase tracking-wide">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                {filteredShops.map((shop) => (
                  <tr 
                    key={shop.id} 
                    className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors cursor-pointer group"
                  >
                    {/* Shop Name + Photo */}
                    <td className="py-4 px-6">
                      <Link href={`/dashboard/manager/shops/${shop.id}`}>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-[#3B82F6] flex items-center justify-center text-white font-semibold overflow-hidden">
                            {shop.photo ? (
                              <img src={shop.photo} alt={shop.name} className="w-full h-full object-cover" />
                            ) : (
                              shop.name.charAt(0)
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-[#1E293B] text-sm group-hover:text-[#3B82F6] transition-colors">
                              {shop.name}
                            </div>
                            <div className="text-xs text-[#64748B]">{shop.category}</div>
                          </div>
                        </div>
                      </Link>
                    </td>

                    {/* Owner Name */}
                    <td className="py-4 px-6">
                      <div className="text-sm text-[#1E293B] font-medium">{shop.owner}</div>
                    </td>

                    {/* Phone Number */}
                    <td className="py-4 px-6">
                      <a 
                        href={`tel:${shop.phone}`}
                        className="text-sm text-[#3B82F6] hover:text-[#2563EB] font-medium flex items-center gap-1 transition-colors"
                      >
                        <Phone className="w-3 h-3" />
                        {shop.phone}
                      </a>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(shop.status)}`}>
                        {shop.status.charAt(0).toUpperCase() + shop.status.slice(1)}
                      </span>
                    </td>

                    {/* Verification Badge */}
                    <td className="py-4 px-6">
                      {shop.verified ? (
                        <div className="flex items-center gap-1 text-[#059669]">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-xs font-semibold">Verified</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-[#64748B]">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="text-xs font-semibold">Not Verified</span>
                        </div>
                      )}
                    </td>

                    {/* Ratings */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                          <span className="text-sm font-semibold text-[#1E293B]">{shop.rating}</span>
                        </div>
                        <span className="text-xs text-[#64748B]">({shop.reviewCount})</span>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1 text-sm text-[#64748B]">
                        <MapPin className="w-3 h-3" />
                        {shop.location}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Link href={`/dashboard/manager/shops/${shop.id}`}>
                          <button className="p-2 text-[#3B82F6] hover:bg-[#EFF6FF] rounded-lg transition-colors" title="View">
                            <Eye className="w-4 h-4" />
                          </button>
                        </Link>
                        
                        {!shop.verified && (
                          <button className="p-2 text-[#10B981] hover:bg-[#ECFDF5] rounded-lg transition-colors" title="Approve">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        
                        {shop.status !== 'suspended' && (
                          <button className="p-2 text-[#EF4444] hover:bg-[#FEF2F2] rounded-lg transition-colors" title="Suspend">
                            <Ban className="w-4 h-4" />
                          </button>
                        )}
                        
                        <div className="relative">
                          <button 
                            onClick={() => setShowMoreMenu(showMoreMenu === shop.id ? null : shop.id)}
                            className="p-2 text-[#64748B] hover:bg-[#F8FAFC] rounded-lg transition-colors"
                            title="More"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          
                          {showMoreMenu === shop.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-[#E2E8F0] py-2 z-50">
                              <button className="w-full px-4 py-2 text-left text-sm text-[#1E293B] hover:bg-[#F8FAFC] transition-colors">
                                Delete Shop
                              </button>
                              <button className="w-full px-4 py-2 text-left text-sm text-[#1E293B] hover:bg-[#F8FAFC] transition-colors">
                                View History
                              </button>
                              <button className="w-full px-4 py-2 text-left text-sm text-[#1E293B] hover:bg-[#F8FAFC] transition-colors">
                                Reset Password
                              </button>
                              <button className="w-full px-4 py-2 text-left text-sm text-[#EF4444] hover:bg-[#FEF2F2] transition-colors">
                                Send Warning
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="border-t border-[#E2E8F0] px-6 py-4 flex items-center justify-between">
                  <div className="text-sm text-[#64748B]">
                    Showing <span className="font-semibold text-[#1E293B]">{filteredShops.length}</span> of <span className="font-semibold text-[#1E293B]">{shops.length}</span> shops
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-4 py-2 border border-[#E2E8F0] text-[#64748B] rounded-lg hover:bg-[#F8FAFC] transition-colors text-sm font-medium">
                      Previous
                    </button>
                    <button className="px-4 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors text-sm font-medium">
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
