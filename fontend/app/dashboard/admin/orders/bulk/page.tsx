'use client';

import React, { useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { CheckSquare, Download, RefreshCw, DollarSign, FileText, Edit2 } from 'lucide-react';

export default function BulkManagementPage() {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState('');
  const [bulkStatus, setBulkStatus] = useState('');

  const orders = [
    { id: 'ORD001234', customer: 'Rajesh Kumar', amount: 2450, status: 'Processing' },
    { id: 'ORD001235', customer: 'Priya Sharma', amount: 1850, status: 'Accepted' },
    { id: 'ORD001236', customer: 'Vikram Malhotra', amount: 4200, status: 'Ready' },
    { id: 'ORD001237', customer: 'Anjali Gupta', amount: 3600, status: 'Pending' },
    { id: 'ORD001238', customer: 'Karan Mehta', amount: 2100, status: 'Accepted' },
  ];

  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const toggleSelectAll = () => {
    setSelectedOrders(
      selectedOrders.length === orders.length
        ? []
        : orders.map(o => o.id)
    );
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F7FA]">
      <AdminSidebar />
      
      <div className="flex-1 ml-72 flex flex-col">
        <div className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <div>
            <h1 className="text-2xl font-bold text-[#0B0F19]">Bulk Management</h1>
            <p className="text-sm text-gray-500">Manage multiple orders at once</p>
          </div>
          {selectedOrders.length > 0 && (
            <div className="flex items-center space-x-2 px-4 py-2 bg-[#1A73E8] bg-opacity-10 rounded-xl border border-[#1A73E8]">
              <CheckSquare className="w-5 h-5 text-[#1A73E8]" />
              <span className="font-bold text-[#1A73E8]">{selectedOrders.length} orders selected</span>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {/* Bulk Action Tools */}
          <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-[#0B0F19] mb-4">Bulk Actions</h3>
            <div className="grid grid-cols-3 gap-6">
              {/* Bulk Status Change */}
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-center space-x-2 mb-3">
                  <Edit2 className="w-5 h-5 text-blue-700" />
                  <p className="font-semibold text-blue-900">Change Status</p>
                </div>
                <select
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white mb-3"
                  value={bulkStatus}
                  onChange={(e) => setBulkStatus(e.target.value)}
                  disabled={selectedOrders.length === 0}
                >
                  <option value="">Select Status</option>
                  <option value="accepted">Mark as Accepted</option>
                  <option value="processing">Mark as Processing</option>
                  <option value="ready">Mark as Ready</option>
                  <option value="completed">Mark as Completed</option>
                  <option value="cancelled">Mark as Cancelled</option>
                </select>
                <button
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
                  disabled={selectedOrders.length === 0 || !bulkStatus}
                >
                  Update {selectedOrders.length} Orders
                </button>
              </div>

              {/* Bulk Refunds */}
              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center space-x-2 mb-3">
                  <DollarSign className="w-5 h-5 text-green-700" />
                  <p className="font-semibold text-green-900">Process Refunds</p>
                </div>
                <p className="text-sm text-green-700 mb-4">
                  Initiate refunds for selected orders with online payment
                </p>
                <button
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
                  disabled={selectedOrders.length === 0}
                >
                  Process {selectedOrders.length} Refunds
                </button>
              </div>

              {/* Bulk Export */}
              <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                <div className="flex items-center space-x-2 mb-3">
                  <Download className="w-5 h-5 text-purple-700" />
                  <p className="font-semibold text-purple-900">Export Data</p>
                </div>
                <div className="space-y-2">
                  <button
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
                    disabled={selectedOrders.length === 0}
                  >
                    Export as CSV
                  </button>
                  <button
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
                    disabled={selectedOrders.length === 0}
                  >
                    Export as PDF
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bulk Report Generation */}
          <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-[#0B0F19] mb-4 flex items-center space-x-2">
              <FileText className="w-5 h-5 text-[#1A73E8]" />
              <span>Bulk Report Generation</span>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="px-6 py-3 bg-amber-100 border border-amber-300 text-amber-900 rounded-xl hover:bg-amber-200 transition-colors font-semibold">
                Generate Daily Report
              </button>
              <button className="px-6 py-3 bg-amber-100 border border-amber-300 text-amber-900 rounded-xl hover:bg-amber-200 transition-colors font-semibold">
                Generate Weekly Report
              </button>
              <button className="px-6 py-3 bg-amber-100 border border-amber-300 text-amber-900 rounded-xl hover:bg-amber-200 transition-colors font-semibold">
                Generate Monthly Report
              </button>
              <button className="px-6 py-3 bg-amber-100 border border-amber-300 text-amber-900 rounded-xl hover:bg-amber-200 transition-colors font-semibold">
                Custom Date Range Report
              </button>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#0B0F19]">Select Orders</h3>
                <button
                  onClick={toggleSelectAll}
                  className="px-4 py-2 bg-[#1A73E8] text-white rounded-lg hover:bg-[#1557b0] transition-colors font-semibold flex items-center space-x-2"
                >
                  <CheckSquare className="w-4 h-4" />
                  <span>{selectedOrders.length === orders.length ? 'Deselect All' : 'Select All'}</span>
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      <input
                        type="checkbox"
                        checked={selectedOrders.length === orders.length}
                        onChange={toggleSelectAll}
                        className="w-5 h-5 text-[#1A73E8] rounded focus:ring-2 focus:ring-[#1A73E8]"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Order ID</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Customer</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className={`hover:bg-gray-50 transition-colors ${
                        selectedOrders.includes(order.id) ? 'bg-blue-50' : ''
                      }`}
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order.id)}
                          onChange={() => toggleOrderSelection(order.id)}
                          className="w-5 h-5 text-[#1A73E8] rounded focus:ring-2 focus:ring-[#1A73E8]"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-[#1A73E8]">{order.id}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-[#0B0F19]">{order.customer}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-[#00C853]">₹{order.amount.toLocaleString()}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold border border-amber-200">
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
