'use client';

import React, { useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { Package, AlertTriangle, TrendingUp, TrendingDown, Search, BarChart3, Brain, Calendar } from 'lucide-react';

interface InventoryItem {
  id: string;
  shopName: string;
  shopId: string;
  productName: string;
  category: string;
  currentStock: number;
  reorderLevel: number;
  lastRestocked: string;
  weeklyDemand: number;
  monthlyDemand: number;
  status: 'out-of-stock' | 'low-stock' | 'high-demand' | 'normal';
  aiRecommendation?: {
    suggestedStock: number;
    reason: string;
    confidence: number;
  };
}

export default function ShopInventoryMonitoringPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Mock data
  const inventoryItems: InventoryItem[] = [
    {
      id: 'INV001',
      shopName: 'Super Electronics',
      shopId: 'SHOP001',
      productName: 'iPhone 15 Pro',
      category: 'Electronics',
      currentStock: 0,
      reorderLevel: 10,
      lastRestocked: '2024-11-25',
      weeklyDemand: 15,
      monthlyDemand: 60,
      status: 'out-of-stock',
      aiRecommendation: {
        suggestedStock: 25,
        reason: 'High seasonal demand expected in December',
        confidence: 92,
      },
    },
    {
      id: 'INV002',
      shopName: 'Fresh Mart',
      shopId: 'SHOP002',
      productName: 'Organic Rice 5kg',
      category: 'Groceries',
      currentStock: 8,
      reorderLevel: 20,
      lastRestocked: '2024-12-05',
      weeklyDemand: 25,
      monthlyDemand: 100,
      status: 'low-stock',
      aiRecommendation: {
        suggestedStock: 50,
        reason: 'Consistent weekly demand pattern',
        confidence: 88,
      },
    },
    {
      id: 'INV003',
      shopName: 'Fashion Corner',
      shopId: 'SHOP003',
      productName: 'Winter Jackets',
      category: 'Fashion',
      currentStock: 45,
      reorderLevel: 15,
      lastRestocked: '2024-12-08',
      weeklyDemand: 35,
      monthlyDemand: 140,
      status: 'high-demand',
      aiRecommendation: {
        suggestedStock: 80,
        reason: 'Winter season peak demand + 45% increase vs last month',
        confidence: 95,
      },
    },
    {
      id: 'INV004',
      shopName: 'Health Store',
      shopId: 'SHOP004',
      productName: 'Vitamin C Tablets',
      category: 'Health',
      currentStock: 120,
      reorderLevel: 30,
      lastRestocked: '2024-12-01',
      weeklyDemand: 12,
      monthlyDemand: 48,
      status: 'normal',
    },
  ];

  const stats = [
    { label: 'Out of Stock', value: '42', icon: AlertTriangle, color: 'bg-[#D32F2F]', textColor: 'text-[#D32F2F]' },
    { label: 'Low Stock', value: '128', icon: TrendingDown, color: 'bg-[#FFAB00]', textColor: 'text-[#FFAB00]' },
    { label: 'High Demand', value: '85', icon: TrendingUp, color: 'bg-[#00C853]', textColor: 'text-[#00C853]' },
    { label: 'AI Predictions', value: '213', icon: Brain, color: 'bg-[#6C63FF]', textColor: 'text-[#6C63FF]' },
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      'out-of-stock': 'bg-red-50 text-red-700 border-red-200',
      'low-stock': 'bg-yellow-50 text-yellow-700 border-yellow-200',
      'high-demand': 'bg-green-50 text-green-700 border-green-200',
      'normal': 'bg-blue-50 text-blue-700 border-blue-200',
    };
    return colors[status as keyof typeof colors] || colors.normal;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'out-of-stock': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'low-stock': return <TrendingDown className="w-5 h-5 text-yellow-600" />;
      case 'high-demand': return <TrendingUp className="w-5 h-5 text-green-600" />;
      default: return <Package className="w-5 h-5 text-blue-600" />;
    }
  };

  const outOfStock = inventoryItems.filter(item => item.status === 'out-of-stock');
  const lowStock = inventoryItems.filter(item => item.status === 'low-stock');
  const highDemand = inventoryItems.filter(item => item.status === 'high-demand');

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F7FA]">
      <AdminSidebar />
      
      <div className="flex-1 ml-72 flex flex-col">
        {/* Top Navigation */}
        <div className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <div>
            <h1 className="text-2xl font-bold text-[#0B0F19]">Inventory Monitoring</h1>
            <p className="text-sm text-gray-500">AI-powered stock management and demand prediction</p>
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

          {/* Filters */}
          <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products, shops..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A73E8] focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select
                className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A73E8] bg-white"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="electronics">Electronics</option>
                <option value="groceries">Groceries</option>
                <option value="fashion">Fashion</option>
                <option value="health">Health</option>
              </select>
            </div>
          </div>

          {/* Out of Stock Section */}
          <div className="bg-white rounded-2xl p-6 mb-8 border border-red-200 shadow-sm">
            <h3 className="text-xl font-bold text-red-900 mb-6 flex items-center space-x-2">
              <AlertTriangle className="w-6 h-6" />
              <span>Out of Stock ({outOfStock.length})</span>
            </h3>
            <div className="space-y-4">
              {outOfStock.map((item) => (
                <div key={item.id} className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getStatusIcon(item.status)}
                        <div>
                          <p className="font-bold text-red-900">{item.productName}</p>
                          <p className="text-sm text-red-700">{item.shopName} ({item.shopId})</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-3">
                        <div className="text-sm">
                          <p className="text-red-600">Weekly Demand</p>
                          <p className="font-bold text-red-900">{item.weeklyDemand} units</p>
                        </div>
                        <div className="text-sm">
                          <p className="text-red-600">Reorder Level</p>
                          <p className="font-bold text-red-900">{item.reorderLevel} units</p>
                        </div>
                        <div className="text-sm">
                          <p className="text-red-600">Last Restocked</p>
                          <p className="font-bold text-red-900">{new Date(item.lastRestocked).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold ml-4">
                      Notify Shop
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Low Stock Section */}
          <div className="bg-white rounded-2xl p-6 mb-8 border border-yellow-200 shadow-sm">
            <h3 className="text-xl font-bold text-yellow-900 mb-6 flex items-center space-x-2">
              <TrendingDown className="w-6 h-6" />
              <span>Low Stock ({lowStock.length})</span>
            </h3>
            <div className="space-y-4">
              {lowStock.map((item) => (
                <div key={item.id} className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getStatusIcon(item.status)}
                        <div>
                          <p className="font-bold text-yellow-900">{item.productName}</p>
                          <p className="text-sm text-yellow-700">{item.shopName} ({item.shopId})</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-4 mt-3">
                        <div className="text-sm">
                          <p className="text-yellow-600">Current Stock</p>
                          <p className="font-bold text-yellow-900">{item.currentStock} units</p>
                        </div>
                        <div className="text-sm">
                          <p className="text-yellow-600">Reorder Level</p>
                          <p className="font-bold text-yellow-900">{item.reorderLevel} units</p>
                        </div>
                        <div className="text-sm">
                          <p className="text-yellow-600">Weekly Demand</p>
                          <p className="font-bold text-yellow-900">{item.weeklyDemand} units</p>
                        </div>
                        <div className="text-sm">
                          <p className="text-yellow-600">Days Until Empty</p>
                          <p className="font-bold text-yellow-900">{Math.floor((item.currentStock / item.weeklyDemand) * 7)} days</p>
                        </div>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-semibold ml-4">
                      Send Alert
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* High Demand Products */}
          <div className="bg-white rounded-2xl p-6 mb-8 border border-green-200 shadow-sm">
            <h3 className="text-xl font-bold text-green-900 mb-6 flex items-center space-x-2">
              <TrendingUp className="w-6 h-6" />
              <span>High Demand Products ({highDemand.length})</span>
            </h3>
            <div className="space-y-4">
              {highDemand.map((item) => (
                <div key={item.id} className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getStatusIcon(item.status)}
                        <div>
                          <p className="font-bold text-green-900">{item.productName}</p>
                          <p className="text-sm text-green-700">{item.shopName} ({item.shopId})</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-3 mb-4">
                        <div className="text-sm">
                          <p className="text-green-600">Current Stock</p>
                          <p className="font-bold text-green-900">{item.currentStock} units</p>
                        </div>
                        <div className="text-sm">
                          <p className="text-green-600">Weekly Demand</p>
                          <p className="font-bold text-green-900">{item.weeklyDemand} units</p>
                        </div>
                      </div>

                      {/* AI Recommendation */}
                      {item.aiRecommendation && (
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                          <div className="flex items-center space-x-2 mb-2">
                            <Brain className="w-5 h-5 text-purple-600" />
                            <p className="font-semibold text-purple-900">AI Restock Suggestion</p>
                            <span className="ml-auto px-2 py-1 bg-purple-200 text-purple-800 rounded-full text-xs font-bold">
                              {item.aiRecommendation.confidence}% confidence
                            </span>
                          </div>
                          <p className="text-sm text-purple-800 mb-2">
                            Recommended stock: <span className="font-bold">{item.aiRecommendation.suggestedStock} units</span>
                          </p>
                          <p className="text-xs text-purple-700">{item.aiRecommendation.reason}</p>
                        </div>
                      )}
                    </div>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold ml-4">
                      View Analytics
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Demand Analysis Chart */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-[#0B0F19] mb-6 flex items-center space-x-2">
              <BarChart3 className="w-6 h-6 text-[#1A73E8]" />
              <span>Seasonal Demand Prediction</span>
            </h3>
            <div className="space-y-4">
              {['Electronics', 'Fashion', 'Groceries', 'Health'].map((category) => (
                <div key={category}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-[#0B0F19]">{category}</span>
                    <span className="text-sm text-gray-600">+{Math.floor(Math.random() * 40 + 10)}% expected growth</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-gradient-to-r from-[#1A73E8] to-[#6C63FF] h-4 rounded-full transition-all"
                      style={{ width: `${Math.random() * 40 + 50}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
