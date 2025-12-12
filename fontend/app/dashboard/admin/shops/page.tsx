'use client';

import React, { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { Search, Filter, Store, Phone, Mail, MapPin, CheckCircle2, Clock, XCircle, AlertTriangle, Eye, Ban, MessageSquare, Download, Plus, Star, TrendingUp } from 'lucide-react';

interface Shop {
  id: string;
  logo: string;
  name: string;
  city: string;
  ownerName: string;
  ownerAvatar: string;
  phone: string;
  email: string;
  status: 'active' | 'pending' | 'suspended' | 'rejected';
  verified: boolean;
  documentsStatus: {
    gst: 'verified' | 'pending' | 'rejected' | 'missing';
    license: 'verified' | 'pending' | 'rejected' | 'missing';
    registration: 'verified' | 'pending' | 'rejected' | 'missing';
  };
  rating: number;
  totalOrders: number;
  lastActive: string;
  category: string;
  joinedDate: string;
}

export default function ShopsListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterVerification, setFilterVerification] = useState('all');
  const [selectedShops, setSelectedShops] = useState<string[]>([]);

  // Mock data
  const shops: Shop[] = [
    {
      id: 'SHOP001',
      logo: 'SE',
      name: 'Super Electronics Store',
      city: 'Mumbai',
      ownerName: 'Rajesh Kumar',
      ownerAvatar: 'RK',
      phone: '+91 98765 43210',
      email: 'super.electronics@email.com',
      status: 'active',
      verified: true,
      documentsStatus: { gst: 'verified', license: 'verified', registration: 'verified' },
      rating: 4.7,
      totalOrders: 1245,
      lastActive: '5 minutes ago',
      category: 'Electronics',
      joinedDate: '2024-01-15',
    },
    {
      id: 'SHOP002',
      logo: 'FM',
      name: 'Fresh Mart Groceries',
      city: 'Delhi',
      ownerName: 'Priya Sharma',
      ownerAvatar: 'PS',
      phone: '+91 87654 32109',
      email: 'freshmart@email.com',
      status: 'pending',
      verified: false,
      documentsStatus: { gst: 'pending', license: 'verified', registration: 'pending' },
      rating: 4.5,
      totalOrders: 820,
      lastActive: '2 hours ago',
      category: 'Groceries',
      joinedDate: '2024-11-20',
    },
    {
      id: 'SHOP003',
      logo: 'FC',
      name: 'Fashion Corner',
      city: 'Bangalore',
      ownerName: 'Amit Patel',
      ownerAvatar: 'AP',
      phone: '+91 76543 21098',
      email: 'fashioncorner@email.com',
      status: 'suspended',
      verified: true,
      documentsStatus: { gst: 'verified', license: 'rejected', registration: 'verified' },
      rating: 3.8,
      totalOrders: 520,
      lastActive: '2 days ago',
      category: 'Fashion',
      joinedDate: '2024-03-10',
    },
  ];

  const stats = [
    { label: 'Total Shops', value: '2,456', icon: Store, color: 'bg-[#1A73E8]', textColor: 'text-[#1A73E8]' },
    { label: 'Active Shops', value: '2,180', icon: CheckCircle2, color: 'bg-[#00C853]', textColor: 'text-[#00C853]' },
    { label: 'Pending Approval', value: '156', icon: Clock, color: 'bg-[#FFAB00]', textColor: 'text-[#FFAB00]' },
    { label: 'Suspended', value: '120', icon: Ban, color: 'bg-[#D32F2F]', textColor: 'text-[#D32F2F]' },
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-50 text-green-700 border-green-200',
      pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      suspended: 'bg-red-50 text-red-700 border-red-200',
      rejected: 'bg-gray-50 text-gray-700 border-gray-200',
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  const getDocStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <div className="w-3 h-3 bg-green-500 rounded-full" title="Verified" />;
      case 'pending': return <div className="w-3 h-3 bg-yellow-500 rounded-full" title="Pending" />;
      case 'rejected': return <div className="w-3 h-3 bg-red-500 rounded-full" title="Rejected" />;
      case 'missing': return <div className="w-3 h-3 bg-gray-400 rounded-full" title="Missing" />;
      default: return <div className="w-3 h-3 bg-gray-400 rounded-full" />;
    }
  };

  const handleSelectShop = (shopId: string) => {
    setSelectedShops(prev => 
      prev.includes(shopId) ? prev.filter(id => id !== shopId) : [...prev, shopId]
    );
  };

  const handleSelectAll = () => {
    setSelectedShops(selectedShops.length === shops.length ? [] : shops.map(s => s.id));
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F7FA]">
      <AdminSidebar />
      
      <div className="flex-1 ml-72 flex flex-col">
        {/* Top Navigation */}
        <div className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <div>
            <h1 className="text-2xl font-bold text-[#0B0F19]">Shop Management</h1>
            <p className="text-sm text-gray-500">Manage all shops and their verification status</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
            <button className="px-4 py-2 bg-[#1A73E8] text-white rounded-lg hover:bg-[#1557b0] transition-colors font-medium flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Shop</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.color} bg-opacity-10 rounded-xl flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-[#0B0F19]">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Filters & Search */}
          <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Smart search: shop name, owner, phone, GST..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A73E8] focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select
                className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A73E8] bg-white"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
                <option value="rejected">Rejected</option>
              </select>
              <select
                className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A73E8] bg-white"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="electronics">Electronics</option>
                <option value="groceries">Groceries</option>
                <option value="fashion">Fashion</option>
                <option value="food">Food & Beverages</option>
              </select>
              <select
                className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A73E8] bg-white"
                value={filterVerification}
                onChange={(e) => setFilterVerification(e.target.value)}
              >
                <option value="all">All Verification</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Bulk Actions */}
            {selectedShops.length > 0 && (
              <div className="flex items-center space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <p className="text-sm font-semibold text-blue-900">{selectedShops.length} shops selected</p>
                <div className="flex-1" />
                <button className="px-4 py-2 bg-[#00C853] text-white rounded-lg hover:bg-[#00a844] transition-colors text-sm font-medium">
                  Bulk Approve
                </button>
                <button className="px-4 py-2 bg-[#D32F2F] text-white rounded-lg hover:bg-[#b71c1c] transition-colors text-sm font-medium">
                  Bulk Suspend
                </button>
                <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium">
                  Bulk Reject
                </button>
                <button className="px-4 py-2 bg-[#6C63FF] text-white rounded-lg hover:bg-[#5850e6] transition-colors text-sm font-medium">
                  Assign Category
                </button>
              </div>
            )}
          </div>

          {/* Shops Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-[#1A73E8] to-[#6C63FF] text-white">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      <input
                        type="checkbox"
                        checked={selectedShops.length === shops.length}
                        onChange={handleSelectAll}
                        className="w-4 h-4 rounded"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Shop</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Owner Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Phone</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Verification</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Documents</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Rating</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Last Active</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {shops.map((shop) => (
                    <tr key={shop.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedShops.includes(shop.id)}
                          onChange={() => handleSelectShop(shop.id)}
                          className="w-4 h-4 rounded"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3 group-hover:scale-105 transition-transform">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#1A73E8] to-[#6C63FF] rounded-xl flex items-center justify-center text-white font-bold">
                            {shop.logo}
                          </div>
                          <div>
                            <p className="font-semibold text-[#0B0F19]">{shop.name}</p>
                            <p className="text-xs text-gray-500 flex items-center space-x-1">
                              <MapPin className="w-3 h-3" />
                              <span>{shop.city}</span>
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-700 text-xs font-bold">
                            {shop.ownerAvatar}
                          </div>
                          <span className="text-sm font-medium text-[#0B0F19]">{shop.ownerName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <a href={`tel:${shop.phone}`} className="flex items-center space-x-2 text-[#1A73E8] hover:text-[#1557b0] transition-colors">
                          <Phone className="w-4 h-4" />
                          <span className="text-sm">{shop.phone}</span>
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(shop.status)}`}>
                          <span className="capitalize">{shop.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {shop.verified ? (
                          <div className="flex items-center space-x-1 text-blue-600">
                            <CheckCircle2 className="w-5 h-5" />
                            <span className="text-sm font-semibold">Verified</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1 text-gray-400">
                            <Clock className="w-5 h-5" />
                            <span className="text-sm">Pending</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {getDocStatusIcon(shop.documentsStatus.gst)}
                          {getDocStatusIcon(shop.documentsStatus.license)}
                          {getDocStatusIcon(shop.documentsStatus.registration)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="font-semibold text-[#0B0F19]">{shop.rating}</span>
                          <span className="text-xs text-gray-500">({shop.totalOrders})</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{shop.lastActive}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button className="p-2 bg-[#1A73E8] bg-opacity-10 text-[#1A73E8] rounded-lg hover:bg-opacity-20 transition-colors" title="View">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 bg-[#00C853] bg-opacity-10 text-[#00C853] rounded-lg hover:bg-opacity-20 transition-colors" title="Verify">
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button className="p-2 bg-[#D32F2F] bg-opacity-10 text-[#D32F2F] rounded-lg hover:bg-opacity-20 transition-colors" title="Suspend">
                            <Ban className="w-4 h-4" />
                          </button>
                          <button className="p-2 bg-[#6C63FF] bg-opacity-10 text-[#6C63FF] rounded-lg hover:bg-opacity-20 transition-colors" title="Message">
                            <MessageSquare className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <p className="text-sm text-gray-600">Showing 1-3 of 2,456 shops</p>
              <div className="flex items-center space-x-2">
                <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                  Previous
                </button>
                <button className="px-4 py-2 bg-[#1A73E8] text-white rounded-lg text-sm font-medium hover:bg-[#1557b0] transition-colors">
                  1
                </button>
                <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                  2
                </button>
                <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                  3
                </button>
                <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
