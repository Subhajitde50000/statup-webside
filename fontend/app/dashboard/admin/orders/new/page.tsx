'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { AlertTriangle, CheckCircle2, XCircle, Phone, MapPin, Package, Clock, RefreshCw, Eye } from 'lucide-react';
import Link from 'next/link';

interface NewOrder {
  id: string;
  customer: { name: string; phone: string; avatar: string };
  professional: { name: string; category: string };
  shop: { name: string; location: string };
  items: string[];
  amount: number;
  time: string;
  riskFlags: string[];
}

export default function NewOrdersPage() {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [countdown, setCountdown] = useState(10);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedAction, setSelectedAction] = useState<{ orderId: string; action: 'accept' | 'reject' } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        setCountdown((prev) => (prev === 1 ? 10 : prev - 1));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const handleOrderAction = (orderId: string, action: 'accept' | 'reject') => {
    setSelectedAction({ orderId, action });
    setShowConfirmDialog(true);
  };

  const confirmAction = async () => {
    if (!selectedAction) return;
    
    setIsProcessing(true);
    setShowConfirmDialog(false);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsProcessing(false);
    setNotificationType('success');
    setNotificationMessage(
      selectedAction.action === 'accept' 
        ? `Order ${selectedAction.orderId} accepted successfully!`
        : `Order ${selectedAction.orderId} rejected successfully!`
    );
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
    setSelectedAction(null);
  };

  const cancelAction = () => {
    setShowConfirmDialog(false);
    setSelectedAction(null);
  };

  const newOrders: NewOrder[] = [
    {
      id: 'ORD001245',
      customer: { name: 'Mohit Sharma', phone: '+91 98123 45678', avatar: 'MS' },
      professional: { name: 'Rakesh Kumar', category: 'Plumber' },
      shop: { name: 'Hardware Hub', location: 'Lajpat Nagar' },
      items: ['PVC Pipe 20ft', 'Elbow Joint x4', 'Teflon Tape'],
      amount: 1850,
      time: '2 mins ago',
      riskFlags: ['High complaint professional'],
    },
    {
      id: 'ORD001246',
      customer: { name: 'Neha Verma', phone: '+91 97234 56789', avatar: 'NV' },
      professional: { name: 'Vijay Singh', category: 'Electrician' },
      shop: { name: 'Super Electronics', location: 'Connaught Place' },
      items: ['MCB 32A', 'RCCB 63A', 'Cable Ties'],
      amount: 3200,
      time: '5 mins ago',
      riskFlags: [],
    },
    {
      id: 'ORD001247',
      customer: { name: 'Amit Patel', phone: '+91 96543 21098', avatar: 'AP' },
      professional: { name: 'Deepak Yadav', category: 'Carpenter' },
      shop: { name: 'Wood Paradise', location: 'Rohini' },
      items: ['Plywood 6mm', 'Hinges x6', 'Screws Set'],
      amount: 4500,
      time: '8 mins ago',
      riskFlags: ['Low shop rating', 'Out-of-stock risk'],
    },
  ];

  const stats = [
    { label: 'Pending Review', value: '24', color: 'bg-amber-500', textColor: 'text-amber-500' },
    { label: 'Auto-Accepted', value: '12', color: 'bg-green-500', textColor: 'text-green-500' },
    { label: 'With Risk Flags', value: '8', color: 'bg-red-500', textColor: 'text-red-500' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F7FA]">
      <AdminSidebar />
      
      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center mb-6">
              {selectedAction?.action === 'accept' ? (
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
              ) : (
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
              )}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedAction?.action === 'accept' ? 'Accept Order?' : 'Reject Order?'}
              </h3>
              <p className="text-gray-600">
                Are you sure you want to {selectedAction?.action} order{' '}
                <span className="font-bold text-[#1A73E8]">{selectedAction?.orderId}</span>?
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={cancelAction}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className={`flex-1 px-4 py-3 text-white rounded-xl transition-colors font-semibold ${
                  selectedAction?.action === 'accept'
                    ? 'bg-[#00C853] hover:bg-[#00a844]'
                    : 'bg-[#D32F2F] hover:bg-[#b71c1c]'
                }`}
              >
                {selectedAction?.action === 'accept' ? 'Accept Order' : 'Reject Order'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showNotification && (
        <div className="fixed top-24 right-8 z-50 animate-slide-in">
          <div className={`px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 border ${
            notificationType === 'success' 
              ? 'bg-[#00C853] text-white border-green-300' 
              : 'bg-[#D32F2F] text-white border-red-300'
          }`}>
            {notificationType === 'success' ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
            <p className="font-semibold">{notificationMessage}</p>
          </div>
        </div>
      )}

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40">
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <div className="flex flex-col items-center space-y-4">
              <RefreshCw className="w-12 h-12 text-[#1A73E8] animate-spin" />
              <p className="text-gray-600 font-semibold">Processing order...</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex-1 ml-72 flex flex-col">
        {/* Top Navigation */}
        <div className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <div>
            <h1 className="text-2xl font-bold text-[#0B0F19]">New Orders - Pending Review</h1>
            <p className="text-sm text-gray-500">Real-time order monitoring</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl">
              <Clock className="w-5 h-5 text-amber-600" />
              <span className="font-bold text-amber-900">Next refresh: {countdown}s</span>
            </div>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold transition-colors ${
                autoRefresh
                  ? 'bg-[#00C853] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
              <span>Auto-Refresh {autoRefresh ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.color} bg-opacity-10 rounded-xl flex items-center justify-center`}>
                    <div className={`w-6 h-6 ${stat.color} rounded-full`} />
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-[#0B0F19]">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* New Orders Grid */}
          <div className="grid grid-cols-1 gap-6">
            {newOrders.map((order) => (
              <div
                key={order.id}
                className={`bg-white rounded-2xl border-2 shadow-lg overflow-hidden transition-all hover:shadow-xl ${
                  order.riskFlags.length > 0
                    ? 'border-amber-400 shadow-amber-200/50'
                    : 'border-blue-200 shadow-blue-100/50'
                }`}
                style={{
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                }}
              >
                <div className={`h-2 ${order.riskFlags.length > 0 ? 'bg-amber-400' : 'bg-blue-400'}`} />
                
                <div className="p-6">
                  {/* Order Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <Link href={`/dashboard/admin/orders/${order.id}`} className="text-xl font-bold text-[#1A73E8] hover:underline">
                        {order.id}
                      </Link>
                      <div className="flex items-center space-x-2 mt-1">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{order.time}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 mb-1">Order Amount</p>
                      <p className="text-2xl font-bold text-[#00C853]">₹{order.amount.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Risk Indicators */}
                  {order.riskFlags.length > 0 && (
                    <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                      <div className="flex items-start space-x-2">
                        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="font-semibold text-amber-900 mb-2">Risk Indicators Detected:</p>
                          <div className="flex flex-wrap gap-2">
                            {order.riskFlags.map((flag, index) => (
                              <span key={index} className="px-3 py-1 bg-amber-200 text-amber-900 rounded-full text-xs font-semibold">
                                {flag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Order Details Grid */}
                  <div className="grid grid-cols-3 gap-6 mb-6">
                    {/* Customer */}
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                      <p className="text-xs text-blue-700 font-semibold mb-3">CUSTOMER</p>
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#1A73E8] to-[#6C63FF] rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {order.customer.avatar}
                        </div>
                        <p className="font-bold text-blue-900">{order.customer.name}</p>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-blue-700">
                        <Phone className="w-3 h-3" />
                        <span>{order.customer.phone}</span>
                      </div>
                    </div>

                    {/* Professional */}
                    <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                      <p className="text-xs text-green-700 font-semibold mb-3">PROFESSIONAL</p>
                      <span className="px-2 py-1 bg-green-200 text-green-800 rounded-full text-xs font-semibold">
                        {order.professional.category}
                      </span>
                      <p className="font-bold text-green-900 mt-2">{order.professional.name}</p>
                    </div>

                    {/* Shop */}
                    <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                      <p className="text-xs text-purple-700 font-semibold mb-3">SHOP</p>
                      <p className="font-bold text-purple-900 mb-2">{order.shop.name}</p>
                      <div className="flex items-center space-x-1 text-xs text-purple-700">
                        <MapPin className="w-3 h-3" />
                        <span>{order.shop.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Package className="w-5 h-5 text-gray-600" />
                      <p className="font-semibold text-gray-900">Ordered Items:</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {order.items.map((item, index) => (
                        <span key={index} className="px-3 py-1 bg-white border border-gray-300 rounded-lg text-sm text-gray-700">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-3">
                    <Link
                      href={`/dashboard/admin/orders/${order.id}`}
                      className="flex-1 px-4 py-3 bg-[#1A73E8] text-white rounded-xl hover:bg-[#1557b0] transition-colors font-semibold flex items-center justify-center space-x-2"
                    >
                      <Eye className="w-5 h-5" />
                      <span>Quick View</span>
                    </Link>
                    <button 
                      onClick={() => handleOrderAction(order.id, 'accept')}
                      disabled={isProcessing}
                      className="flex-1 px-4 py-3 bg-[#00C853] text-white rounded-xl hover:bg-[#00a844] transition-colors font-semibold flex items-center justify-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Accept Order</span>
                    </button>
                    <button 
                      onClick={() => handleOrderAction(order.id, 'reject')}
                      disabled={isProcessing}
                      className="flex-1 px-4 py-3 bg-[#D32F2F] text-white rounded-xl hover:bg-[#b71c1c] transition-colors font-semibold flex items-center justify-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      <XCircle className="w-5 h-5" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {newOrders.length === 0 && (
            <div className="bg-white rounded-2xl p-12 border border-gray-100 shadow-sm text-center">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <p className="text-gray-600 font-semibold text-lg">All caught up!</p>
              <p className="text-sm text-gray-500 mt-1">No new orders pending review</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
