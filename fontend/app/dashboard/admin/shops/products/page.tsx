'use client';

import React, { useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { Package, AlertTriangle, TrendingUp, TrendingDown, Eye, CheckCircle2, XCircle, Clock, Search, Filter } from 'lucide-react';

interface Product {
  id: string;
  shopName: string;
  shopId: string;
  productName: string;
  image: string;
  category: string;
  previousPrice?: number;
  currentPrice: number;
  stock: number;
  flags: string[];
  status: 'new' | 'edited' | 'flagged' | 'blocked';
  submittedDate: string;
}

export default function ShopProductApprovalPage() {
  const [activeTab, setActiveTab] = useState<'new' | 'edited' | 'flagged' | 'blocked'>('new');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock data
  const products: Product[] = [
    {
      id: 'PROD001',
      shopName: 'Super Electronics',
      shopId: 'SHOP001',
      productName: 'iPhone 15 Pro Max',
      image: 'IP',
      category: 'Electronics',
      currentPrice: 159900,
      stock: 15,
      flags: [],
      status: 'new',
      submittedDate: '2024-12-10',
    },
    {
      id: 'PROD002',
      shopName: 'Fashion Corner',
      shopId: 'SHOP003',
      productName: 'Designer Handbag',
      image: 'DH',
      category: 'Fashion',
      previousPrice: 5999,
      currentPrice: 12999,
      stock: 8,
      flags: ['Suspicious price change', 'High price increase'],
      status: 'edited',
      submittedDate: '2024-12-09',
    },
    {
      id: 'PROD003',
      shopName: 'Fresh Mart',
      shopId: 'SHOP002',
      productName: 'Organic Rice 5kg',
      image: 'OR',
      category: 'Groceries',
      currentPrice: 450,
      stock: 100,
      flags: ['Duplicate item detected'],
      status: 'flagged',
      submittedDate: '2024-12-08',
    },
    {
      id: 'PROD004',
      shopName: 'Health Store',
      shopId: 'SHOP004',
      productName: 'Banned Supplement',
      image: 'BS',
      category: 'Health',
      currentPrice: 2500,
      stock: 0,
      flags: ['Illegal product', 'Banned substance'],
      status: 'blocked',
      submittedDate: '2024-12-07',
    },
  ];

  const stats = [
    { label: 'New Products', value: '245', icon: Package, color: 'bg-[#1A73E8]', textColor: 'text-[#1A73E8]' },
    { label: 'Edited Items', value: '89', icon: TrendingUp, color: 'bg-[#FFAB00]', textColor: 'text-[#FFAB00]' },
    { label: 'Flagged Items', value: '42', icon: AlertTriangle, color: 'bg-[#D32F2F]', textColor: 'text-[#D32F2F]' },
    { label: 'Blocked Items', value: '15', icon: XCircle, color: 'bg-gray-500', textColor: 'text-gray-500' },
  ];

  const filteredProducts = products.filter(p => p.status === activeTab);

  const getStatusColor = (status: string) => {
    const colors = {
      new: 'bg-blue-50 text-blue-700 border-blue-200',
      edited: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      flagged: 'bg-red-50 text-red-700 border-red-200',
      blocked: 'bg-gray-50 text-gray-700 border-gray-200',
    };
    return colors[status as keyof typeof colors] || colors.new;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F7FA]">
      <AdminSidebar />
      
      <div className="flex-1 ml-72 flex flex-col">
        {/* Top Navigation */}
        <div className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <div>
            <h1 className="text-2xl font-bold text-[#0B0F19]">Product Approval</h1>
            <p className="text-sm text-gray-500">Review and approve product submissions</p>
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

          {/* Tabs */}
          <div className="bg-white rounded-2xl mb-6 border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex border-b border-gray-200">
              {['new', 'edited', 'flagged', 'blocked'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as typeof activeTab)}
                  className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                    activeTab === tab
                      ? 'bg-[#1A73E8] text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {tab === 'new' && 'New Product Requests'}
                  {tab === 'edited' && 'Edited Items'}
                  {tab === 'flagged' && 'Flagged Items'}
                  {tab === 'blocked' && 'Blocked Items'}
                </button>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products, shop name..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A73E8] focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select
                className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A73E8] bg-white"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="electronics">Electronics</option>
                <option value="fashion">Fashion</option>
                <option value="groceries">Groceries</option>
                <option value="health">Health</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start gap-6">
                    {/* Product Image */}
                    <div className="w-32 h-32 bg-gradient-to-br from-[#1A73E8] to-[#6C63FF] rounded-xl flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
                      {product.image}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-[#0B0F19] mb-1">{product.productName}</h3>
                          <p className="text-sm text-gray-600">
                            {product.shopName} <span className="text-gray-400">({product.shopId})</span>
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Submitted: {new Date(product.submittedDate).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(product.status)}`}>
                          {product.status.toUpperCase()}
                        </span>
                      </div>

                      <div className="grid grid-cols-4 gap-4 mb-4">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-500">Category</p>
                          <p className="font-semibold text-[#0B0F19]">{product.category}</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-500">Stock</p>
                          <p className="font-semibold text-[#0B0F19]">{product.stock} units</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-500">Current Price</p>
                          <p className="font-semibold text-[#00C853]">₹{product.currentPrice.toLocaleString()}</p>
                        </div>
                        {product.previousPrice && (
                          <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                            <p className="text-xs text-yellow-700">Previous Price</p>
                            <div className="flex items-center space-x-2">
                              <p className="font-semibold text-yellow-900 line-through">₹{product.previousPrice.toLocaleString()}</p>
                              {product.currentPrice > product.previousPrice ? (
                                <TrendingUp className="w-4 h-4 text-red-600" />
                              ) : (
                                <TrendingDown className="w-4 h-4 text-green-600" />
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Flags */}
                      {product.flags.length > 0 && (
                        <div className="mb-4">
                          <div className="flex items-start space-x-2">
                            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="font-semibold text-red-900 mb-2">Detected Issues:</p>
                              <div className="flex flex-wrap gap-2">
                                {product.flags.map((flag, index) => (
                                  <span key={index} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold border border-red-200">
                                    {flag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Notes Input */}
                      <textarea
                        className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A73E8] resize-none text-sm mb-4"
                        rows={2}
                        placeholder="Add notes for this review..."
                      />

                      {/* Action Buttons */}
                      <div className="flex items-center gap-3">
                        <button className="flex-1 px-4 py-3 bg-[#1A73E8] text-white rounded-xl hover:bg-[#1557b0] transition-colors font-semibold flex items-center justify-center space-x-2">
                          <Eye className="w-5 h-5" />
                          <span>View Full Details</span>
                        </button>
                        <button className="flex-1 px-4 py-3 bg-[#00C853] text-white rounded-xl hover:bg-[#00a844] transition-colors font-semibold flex items-center justify-center space-x-2">
                          <CheckCircle2 className="w-5 h-5" />
                          <span>Approve</span>
                        </button>
                        <button className="flex-1 px-4 py-3 bg-[#D32F2F] text-white rounded-xl hover:bg-[#b71c1c] transition-colors font-semibold flex items-center justify-center space-x-2">
                          <XCircle className="w-5 h-5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="bg-white rounded-2xl p-12 border border-gray-100 shadow-sm text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-semibold">No products in this category</p>
              <p className="text-sm text-gray-500 mt-1">All caught up!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
