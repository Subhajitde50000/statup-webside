'use client';

import React from 'react';
import { TrendingUp, AlertTriangle, Package, Flag } from 'lucide-react';

interface Product {
  name: string;
  sales: number;
  trend: number;
}

interface StockAlert {
  shop: string;
  product: string;
  stock: number;
  severity: 'critical' | 'low';
}

export default function ProductInventoryOverview() {
  const topProducts: Product[] = [
    { name: 'LED Light Bulbs', sales: 1245, trend: 12 },
    { name: 'Plumbing Tools Kit', sales: 892, trend: 8 },
    { name: 'Electrical Switches', sales: 678, trend: -3 },
    { name: 'Paint Brushes Set', sales: 456, trend: 15 },
  ];

  const stockAlerts: StockAlert[] = [
    { shop: 'TechMart', product: 'WiFi Routers', stock: 2, severity: 'critical' },
    { shop: 'HomeFix', product: 'Screwdriver Set', stock: 5, severity: 'critical' },
    { shop: 'BuildMart', product: 'Cement Bags', stock: 8, severity: 'low' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-[#1F2937] mb-1">Product & Inventory</h2>
        <p className="text-sm text-[#6B7280]">Top sellers & alerts</p>
      </div>

      {/* Top Selling Products */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="w-5 h-5 text-[#10B981]" />
          <h3 className="text-sm font-semibold text-[#1F2937]">Top Selling This Week</h3>
        </div>
        <div className="space-y-3">
          {topProducts.map((product, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-[#4C5BF5] to-[#8B5CF6] rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{index + 1}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#1F2937]">{product.name}</p>
                  <p className="text-xs text-[#6B7280]">{product.sales.toLocaleString()} units</p>
                </div>
              </div>
              <div className={`flex items-center space-x-1 text-xs font-semibold ${
                product.trend >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'
              }`}>
                <span>{product.trend >= 0 ? '+' : ''}{product.trend}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Low Stock Alerts */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-[#EF4444]" />
            <h3 className="text-sm font-semibold text-[#1F2937]">Low Stock Alerts</h3>
          </div>
          <span className="px-2 py-1 bg-[#FEE2E2] text-[#EF4444] text-xs font-bold rounded-lg">
            {stockAlerts.filter(a => a.severity === 'critical').length} Critical
          </span>
        </div>
        <div className="space-y-2">
          {stockAlerts.map((alert, index) => (
            <div
              key={index}
              className={`p-3 rounded-xl border ${
                alert.severity === 'critical'
                  ? 'bg-[#FEE2E2]/50 border-[#EF4444]/20'
                  : 'bg-[#FEF3C7]/50 border-[#F59E0B]/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#1F2937]">{alert.product}</p>
                  <p className="text-xs text-[#6B7280]">{alert.shop}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${
                    alert.severity === 'critical' ? 'text-[#EF4444]' : 'text-[#F59E0B]'
                  }`}>
                    {alert.stock} left
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-[#F4F6FA] rounded-xl">
            <Package className="w-5 h-5 text-[#4C5BF5] mx-auto mb-1" />
            <p className="text-xs text-[#6B7280]">Total Products</p>
            <p className="text-lg font-bold text-[#1F2937]">45,890</p>
          </div>
          <div className="text-center p-3 bg-[#FEE2E2] rounded-xl">
            <Flag className="w-5 h-5 text-[#EF4444] mx-auto mb-1" />
            <p className="text-xs text-[#6B7280]">Flagged</p>
            <p className="text-lg font-bold text-[#EF4444]">24</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-[#F4F6FA] border-t border-gray-100">
        <button className="w-full text-center text-sm text-[#4C5BF5] hover:text-[#8B5CF6] font-medium transition-colors">
          Manage Inventory →
        </button>
      </div>
    </div>
  );
}
