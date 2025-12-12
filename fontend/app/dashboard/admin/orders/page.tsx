'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { ShoppingCart, Search, Filter, Download, RefreshCw, Eye, Edit, MapPin, Phone, Clock, CheckCircle2, XCircle, AlertTriangle, Package, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface Order {
  id: string;
  customer: {
    name: string;
    phone: string;
    avatar: string;
  };
  professional: {
    name: string;
    category: string;
  };
  shop: {
    name: string;
    location: string;
  };
  items: string[];
  amount: number;
  paymentStatus: 'Paid' | 'Pending' | 'Failed';
  orderStatus: 'Pending' | 'Accepted' | 'Processing' | 'Ready' | 'Completed' | 'Cancelled';
  time: string;
  orderType: 'Material Order' | 'Service Order';
}

export default function OrdersListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const itemsPerPage = 10;

  // Mock data
  const orders: Order[] = [
    {
      id: 'ORD001234',
      customer: { name: 'Rajesh Kumar', phone: '+91 98765 43210', avatar: 'RK' },
      professional: { name: 'Amit Singh', category: 'Electrician' },
      shop: { name: 'Super Electronics', location: 'Connaught Place' },
      items: ['Wire 10m', 'Switch Board', 'LED Bulb x5'],
      amount: 2450,
      paymentStatus: 'Paid',
      orderStatus: 'Processing',
      time: '12 mins ago',
      orderType: 'Material Order',
    },
    {
      id: 'ORD001235',
      customer: { name: 'Priya Sharma', phone: '+91 98234 56789', avatar: 'PS' },
      professional: { name: 'Ravi Verma', category: 'Plumber' },
      shop: { name: 'Hardware Hub', location: 'Lajpat Nagar' },
      items: ['Pipe 20ft', 'Tap x2', 'Sealant'],
      amount: 1850,
      paymentStatus: 'Pending',
      orderStatus: 'Accepted',
      time: '28 mins ago',
      orderType: 'Material Order',
    },
    {
      id: 'ORD001236',
      customer: { name: 'Vikram Malhotra', phone: '+91 99876 54321', avatar: 'VM' },
      professional: { name: 'Suresh Yadav', category: 'Carpenter' },
      shop: { name: 'Wood Works', location: 'Nehru Place' },
      items: ['Plywood 8x4', 'Nails 1kg', 'Wood Glue'],
      amount: 4200,
      paymentStatus: 'Paid',
      orderStatus: 'Completed',
      time: '1 hour ago',
      orderType: 'Service Order',
    },
    {
      id: 'ORD001237',
      customer: { name: 'Anjali Gupta', phone: '+91 97654 32109', avatar: 'AG' },
      professional: { name: 'Mohan Lal', category: 'Painter' },
      shop: { name: 'Color Palace', location: 'Saket' },
      items: ['Paint 10L', 'Brush Set', 'Roller'],
      amount: 3600,
      paymentStatus: 'Failed',
      orderStatus: 'Cancelled',
      time: '2 hours ago',
      orderType: 'Material Order',
    },
  ];

  const stats = [
    { label: 'Total Orders', value: '8,420', icon: ShoppingCart, color: 'bg-[#1A73E8]', textColor: 'text-[#1A73E8]' },
    { label: 'Pending', value: '156', icon: Clock, color: 'bg-[#FFAB00]', textColor: 'text-[#FFAB00]' },
    { label: 'Processing', value: '89', icon: Package, color: 'bg-[#6C63FF]', textColor: 'text-[#6C63FF]' },
    { label: 'Completed Today', value: '234', icon: CheckCircle2, color: 'bg-[#00C853]', textColor: 'text-[#00C853]' },
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      'Pending': 'bg-sky-100 text-sky-700 border-sky-200',
      'Accepted': 'bg-green-100 text-green-700 border-green-200',
      'Processing': 'bg-amber-100 text-amber-700 border-amber-200',
      'Ready': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'Completed': 'bg-green-100 text-green-800 border-green-300',
      'Cancelled': 'bg-red-100 text-red-700 border-red-200',
    };
    return colors[status as keyof typeof colors] || colors.Pending;
  };

  const getPaymentColor = (status: string) => {
    const colors = {
      'Paid': 'bg-green-100 text-green-700',
      'Pending': 'bg-yellow-100 text-yellow-700',
      'Failed': 'bg-red-100 text-red-700',
    };
    return colors[status as keyof typeof colors] || colors.Pending;
  };

  // Search debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 500);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Auto-refresh logic
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchOrders();
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const fetchOrders = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    showToast('Orders refreshed successfully');
  };

  const handleExport = async (format: 'csv' | 'pdf') => {
    setIsExporting(true);
    // Simulate export
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsExporting(false);
    showToast(`Orders exported as ${format.toUpperCase()} successfully`);
  };

  const showToast = (message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const paginatedOrders = orders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F7FA]">
      <AdminSidebar />
      
      <div className="flex-1 ml-72 flex flex-col">
        {/* Top Navigation */}
        <div className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <div>
            <h1 className="text-2xl font-bold text-[#0B0F19]">Order Management</h1>
            <p className="text-sm text-gray-500">Super Premium Control Panel</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold transition-colors ${
                autoRefresh
                  ? 'bg-[#00C853] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
              <span>Auto-Refresh {autoRefresh ? '10s' : 'OFF'}</span>
            </button>
            <button 
              onClick={() => handleExport('csv')}
              disabled={isExporting}
              className="flex items-center space-x-2 px-4 py-2 bg-[#1A73E8] text-white rounded-xl hover:bg-[#1557b0] transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              <span>Export CSV</span>
            </button>
            <button 
              onClick={() => handleExport('pdf')}
              disabled={isExporting}
              className="flex items-center space-x-2 px-4 py-2 bg-[#D32F2F] text-white rounded-xl hover:bg-[#b71c1c] transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              <span>Export PDF</span>
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

          {/* Filters Section */}
          <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by Order ID, Customer, Professional, Shop, Phone..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A73E8] focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3 flex-wrap">
              <select
                className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A73E8] bg-white text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="processing">Processing</option>
                <option value="ready">Ready</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <select className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A73E8] bg-white text-sm">
                <option>Date Range</option>
                <option>Today</option>
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Custom</option>
              </select>

              <select className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A73E8] bg-white text-sm">
                <option>Payment Status</option>
                <option>Paid</option>
                <option>Pending</option>
                <option>Failed</option>
              </select>

              <select className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A73E8] bg-white text-sm">
                <option>Order Type</option>
                <option>Material Order</option>
                <option>Service Order</option>
              </select>

              <select className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A73E8] bg-white text-sm">
                <option>City / Area</option>
                <option>Delhi</option>
                <option>Mumbai</option>
                <option>Bangalore</option>
              </select>
            </div>
          </div>

          {/* Toast Notification */}
          {showNotification && (
            <div className="fixed top-24 right-8 z-50 animate-slide-in">
              <div className="bg-[#00C853] text-white px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 border border-green-300">
                <CheckCircle2 className="w-5 h-5" />
                <p className="font-semibold">{notificationMessage}</p>
              </div>
            </div>
          )}

          {/* Orders Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {isLoading && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-2xl">
                <div className="flex flex-col items-center space-y-3">
                  <Loader2 className="w-12 h-12 text-[#1A73E8] animate-spin" />
                  <p className="text-gray-600 font-semibold">Loading orders...</p>
                </div>
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Professional</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Shop</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Items</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Payment</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link href={`/dashboard/admin/orders/${order.id}`} className="text-[#1A73E8] font-bold hover:underline">
                          {order.id}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-[#1A73E8] to-[#6C63FF] rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {order.customer.avatar}
                          </div>
                          <div>
                            <p className="font-semibold text-[#0B0F19]">{order.customer.name}</p>
                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                              <Phone className="w-3 h-3" />
                              <span>{order.customer.phone}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                            {order.professional.category}
                          </span>
                          <p className="font-semibold text-[#0B0F19] mt-1">{order.professional.name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-[#0B0F19]">{order.shop.name}</p>
                          <div className="flex items-center space-x-1 text-xs text-gray-500 mt-1">
                            <MapPin className="w-3 h-3" />
                            <span>{order.shop.location}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="font-semibold text-[#0B0F19]">{order.items[0]}</p>
                          {order.items.length > 1 && (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                              +{order.items.length - 1} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-[#0B0F19]">₹{order.amount.toLocaleString()}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPaymentColor(order.paymentStatus)}`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.orderStatus)}`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>{order.time}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/dashboard/admin/orders/${order.id}`}
                            className="p-2 bg-blue-50 text-[#1A73E8] rounded-lg hover:bg-blue-100 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <Link
                            href={`/dashboard/admin/orders/tracking?id=${order.id}`}
                            className="p-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
                          >
                            <MapPin className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
              <div className="flex items-center space-x-2">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-semibold">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                  <span className="font-semibold">{Math.min(currentPage * itemsPerPage, orders.length)}</span> of{' '}
                  <span className="font-semibold">{orders.length}</span> orders
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      currentPage === page
                        ? 'bg-[#1A73E8] text-white'
                        : 'border border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
