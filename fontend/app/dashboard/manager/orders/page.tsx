'use client';

import React, { useState } from 'react';
import { 
  Search, Download, Filter, Eye, UserX, Truck, XCircle, DollarSign, 
  Phone, Calendar, Package, CreditCard, MapPin, Clock, MoreVertical
} from 'lucide-react';
import Link from 'next/link';
import TopNavbar from '../components/TopNavbar';
import LeftSidebar from '../components/LeftSidebar';

export default function OrdersListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
  const [deliveryModeFilter, setDeliveryModeFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all'); // shop or professional
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const orders = [
    {
      id: 'ORD-2024-001',
      customer: { name: 'Amit Sharma', phone: '+91 98765 43210' },
      shop: 'ElectroWorld Pro',
      type: 'shop',
      amount: 2500,
      paymentMode: 'UPI',
      paymentStatus: 'paid',
      orderStatus: 'out-for-delivery',
      deliveryPerson: 'Rajesh Kumar',
      date: '2024-12-10 10:30 AM',
      deliveryMode: 'home-delivery',
    },
    {
      id: 'ORD-2024-002',
      customer: { name: 'Priya Singh', phone: '+91 98765 43211' },
      shop: 'Fresh Mart Groceries',
      type: 'shop',
      amount: 1850,
      paymentMode: 'COD',
      paymentStatus: 'pending',
      orderStatus: 'processing',
      deliveryPerson: null,
      date: '2024-12-10 11:15 AM',
      deliveryMode: 'home-delivery',
    },
    {
      id: 'ORD-2024-003',
      customer: { name: 'Rahul Verma', phone: '+91 98765 43212' },
      shop: 'Tasty Bites Restaurant',
      type: 'shop',
      amount: 650,
      paymentMode: 'Card',
      paymentStatus: 'paid',
      orderStatus: 'completed',
      deliveryPerson: 'Amit Yadav',
      date: '2024-12-09 08:45 PM',
      deliveryMode: 'pickup',
    },
    {
      id: 'BOOK-2024-001',
      customer: { name: 'Arjun Mehta', phone: '+91 98765 43217' },
      shop: 'Rajesh Kumar - Electrician',
      type: 'professional',
      amount: 1200,
      paymentMode: 'UPI',
      paymentStatus: 'paid',
      orderStatus: 'completed',
      deliveryPerson: null,
      date: '2024-12-09 03:00 PM',
      deliveryMode: 'service-location',
    },
    {
      id: 'BOOK-2024-002',
      customer: { name: 'Kavita Desai', phone: '+91 98765 43218' },
      shop: 'Suresh Reddy - Plumber',
      type: 'professional',
      amount: 800,
      paymentMode: 'COD',
      paymentStatus: 'pending',
      orderStatus: 'accepted',
      deliveryPerson: null,
      date: '2024-12-10 11:45 AM',
      deliveryMode: 'service-location',
    },
    {
      id: 'BOOK-2024-003',
      customer: { name: 'Rohan Patel', phone: '+91 98765 43219' },
      shop: 'Amit Yadav - Carpenter',
      type: 'professional',
      amount: 2500,
      paymentMode: 'UPI',
      paymentStatus: 'paid',
      orderStatus: 'processing',
      deliveryPerson: null,
      date: '2024-12-10 09:30 AM',
      deliveryMode: 'service-location',
    },
    {
      id: 'ORD-2024-004',
      customer: { name: 'Sneha Patel', phone: '+91 98765 43213' },
      shop: 'Quick Repairs',
      type: 'shop',
      amount: 3200,
      paymentMode: 'UPI',
      paymentStatus: 'failed',
      orderStatus: 'cancelled',
      deliveryPerson: null,
      date: '2024-12-09 02:30 PM',
      deliveryMode: 'home-delivery',
    },
    {
      id: 'ORD-2024-005',
      customer: { name: 'Vikram Singh', phone: '+91 98765 43214' },
      shop: 'ElectroWorld Pro',
      type: 'shop',
      amount: 4500,
      paymentMode: 'Card',
      paymentStatus: 'paid',
      orderStatus: 'accepted',
      deliveryPerson: 'Suresh Reddy',
      date: '2024-12-10 09:00 AM',
      deliveryMode: 'home-delivery',
    },
  ];

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.shop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.phone.includes(searchQuery);
    
    const matchesOrderStatus = orderStatusFilter === 'all' || order.orderStatus === orderStatusFilter;
    const matchesPaymentStatus = paymentStatusFilter === 'all' || order.paymentStatus === paymentStatusFilter;
    const matchesDeliveryMode = deliveryModeFilter === 'all' || order.deliveryMode === deliveryModeFilter;
    const matchesType = typeFilter === 'all' || order.type === typeFilter;
    
    return matchesSearch && matchesOrderStatus && matchesPaymentStatus && matchesDeliveryMode && matchesType;
  });

  const getOrderStatusColor = (status: string) => {
    const colors = {
      'processing': 'bg-[#DBEAFE] text-[#2563EB]',
      'accepted': 'bg-[#E0E7FF] text-[#6366F1]',
      'out-for-delivery': 'bg-[#FEF3C7] text-[#D97706]',
      'completed': 'bg-[#D1FAE5] text-[#059669]',
      'cancelled': 'bg-[#FEE2E2] text-[#DC2626]',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-600';
  };

  const getPaymentStatusColor = (status: string) => {
    const colors = {
      'paid': 'bg-[#D1FAE5] text-[#059669]',
      'pending': 'bg-[#FEF3C7] text-[#D97706]',
      'failed': 'bg-[#FEE2E2] text-[#DC2626]',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <TopNavbar />
      <div className="flex">
        <LeftSidebar isOpen={sidebarOpen} />
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
          <div className="p-8">
            <div className="max-w-[1600px] mx-auto">
              {/* Header Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-semibold text-[#1E293B] mb-2">Orders & Bookings Management</h1>
                    <p className="text-[#64748B] text-sm">Monitor and manage all customer orders from shops and professional bookings</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-white border border-[#E2E8F0] text-[#64748B] rounded-lg hover:bg-[#F8FAFC] transition-colors flex items-center gap-2 text-sm font-medium">
                      <Download className="w-4 h-4" />
                      Export CSV
                    </button>
                    <Link href="/dashboard/manager/orders/analytics">
                      <button className="px-4 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors flex items-center gap-2 text-sm font-medium shadow-sm">
                        <Package className="w-4 h-4" />
                        View Analytics
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-xl p-5 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm opacity-90">Total Orders</span>
                      <Package className="w-5 h-5 opacity-80" />
                    </div>
                    <h3 className="text-2xl font-bold">{orders.length}</h3>
                    <p className="text-xs opacity-75 mt-1">Shop + Professional</p>
                  </div>

                  <div className="bg-gradient-to-br from-[#6366F1] to-[#4F46E5] rounded-xl p-5 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm opacity-90">Shop Orders</span>
                      <Package className="w-5 h-5 opacity-80" />
                    </div>
                    <h3 className="text-2xl font-bold">{orders.filter(o => o.type === 'shop').length}</h3>
                    <p className="text-xs opacity-75 mt-1">Product orders</p>
                  </div>

                  <div className="bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] rounded-xl p-5 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm opacity-90">Bookings</span>
                      <Package className="w-5 h-5 opacity-80" />
                    </div>
                    <h3 className="text-2xl font-bold">{orders.filter(o => o.type === 'professional').length}</h3>
                    <p className="text-xs opacity-75 mt-1">Service bookings</p>
                  </div>

                  <div className="bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl p-5 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm opacity-90">Completed</span>
                      <Package className="w-5 h-5 opacity-80" />
                    </div>
                    <h3 className="text-2xl font-bold">{orders.filter(o => o.orderStatus === 'completed').length}</h3>
                    <p className="text-xs opacity-75 mt-1">Successfully delivered</p>
                  </div>

                  <div className="bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-xl p-5 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm opacity-90">In Progress</span>
                      <Clock className="w-5 h-5 opacity-80" />
                    </div>
                    <h3 className="text-2xl font-bold">
                      {orders.filter(o => ['processing', 'accepted', 'out-for-delivery'].includes(o.orderStatus)).length}
                    </h3>
                    <p className="text-xs opacity-75 mt-1">Active orders</p>
                  </div>

                  <div className="bg-gradient-to-br from-[#EF4444] to-[#DC2626] rounded-xl p-5 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm opacity-90">Cancelled</span>
                      <XCircle className="w-5 h-5 opacity-80" />
                    </div>
                    <h3 className="text-2xl font-bold">{orders.filter(o => o.orderStatus === 'cancelled').length}</h3>
                    <p className="text-xs opacity-75 mt-1">Need review</p>
                  </div>

                  <div className="bg-gradient-to-br from-[#14B8A6] to-[#0D9488] rounded-xl p-5 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm opacity-90">Revenue</span>
                      <DollarSign className="w-5 h-5 opacity-80" />
                    </div>
                    <h3 className="text-2xl font-bold">
                      ₹{orders.filter(o => o.paymentStatus === 'paid').reduce((sum, o) => sum + o.amount, 0).toLocaleString()}
                    </h3>
                    <p className="text-xs opacity-75 mt-1">Total paid</p>
                  </div>
                </div>
                {/* Search and Filters */}
                <div className="bg-white rounded-xl border border-[#E2E8F0] p-4">
                  <div className="flex flex-col lg:flex-row gap-4 mb-4">
                    {/* Search Bar */}
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#94A3B8] w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search by Order ID, Customer Name, Shop, or Phone..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 text-gray-700 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
                      />
                    </div>

                    {/* Filters */}
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="px-4 py-2.5 text-gray-700 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] bg-white"
                    >
                      <option value="all">All Types</option>
                      <option value="shop">Shop Orders</option>
                      <option value="professional">Professional Bookings</option>
                    </select>

                    <select
                      value={paymentStatusFilter}
                      onChange={(e) => setPaymentStatusFilter(e.target.value)}
                      className="px-4 py-2.5 text-gray-700 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] bg-white"
                    >
                      <option value="all">All Payment Status</option>
                      <option value="paid">Paid</option>
                      <option value="pending">Pending</option>
                      <option value="failed">Failed</option>
                    </select>

                    <select
                      value={deliveryModeFilter}
                      onChange={(e) => setDeliveryModeFilter(e.target.value)}
                      className="px-4 py-2.5 text-gray-700 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] bg-white"
                    >
                      <option value="all">All Delivery Modes</option>
                      <option value="home-delivery">Home Delivery</option>
                      <option value="pickup">Pickup</option>
                      <option value="service-location">Service Location</option>
                    </select>
                  </div>

                  {/* Status Filter Chips */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {['all', 'processing', 'accepted', 'out-for-delivery', 'completed', 'cancelled'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setOrderStatusFilter(status)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          orderStatusFilter === status
                            ? 'bg-[#3B82F6] text-white shadow-sm'
                            : 'bg-[#F8FAFC] text-[#64748B] hover:bg-[#E2E8F0]'
                        }`}
                      >
                        {status === 'all' ? 'All Orders' : status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Table Section */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="sticky top-0 bg-[#F8FAFC] z-10">
                      <tr className="border-b border-[#E2E8F0]">
                        <th className="text-left py-4 px-6 text-xs font-semibold text-[#64748B] uppercase tracking-wide">Order ID</th>
                        <th className="text-left py-4 px-6 text-xs font-semibold text-[#64748B] uppercase tracking-wide">Type</th>
                        <th className="text-left py-4 px-6 text-xs font-semibold text-[#64748B] uppercase tracking-wide">Customer</th>
                        <th className="text-left py-4 px-6 text-xs font-semibold text-[#64748B] uppercase tracking-wide">Shop/Professional</th>
                        <th className="text-left py-4 px-6 text-xs font-semibold text-[#64748B] uppercase tracking-wide">Amount</th>
                        <th className="text-left py-4 px-6 text-xs font-semibold text-[#64748B] uppercase tracking-wide">Payment</th>
                        <th className="text-left py-4 px-6 text-xs font-semibold text-[#64748B] uppercase tracking-wide">Status</th>
                        <th className="text-left py-4 px-6 text-xs font-semibold text-[#64748B] uppercase tracking-wide">Date & Time</th>
                        <th className="text-left py-4 px-6 text-xs font-semibold text-[#64748B] uppercase tracking-wide">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order) => (
                        <tr 
                          key={order.id} 
                          className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors cursor-pointer group"
                        >
                          {/* Order ID */}
                          <td className="py-4 px-6">
                            <Link href={`/dashboard/manager/orders/${order.id}`}>
                              <span className="font-mono text-sm font-semibold text-[#3B82F6] group-hover:underline">
                                {order.id}
                              </span>
                            </Link>
                          </td>

                          {/* Type */}
                          <td className="py-4 px-6">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              order.type === 'shop' 
                                ? 'bg-[#DBEAFE] text-[#2563EB]' 
                                : 'bg-[#E0E7FF] text-[#6366F1]'
                            }`}>
                              {order.type === 'shop' ? 'SHOP' : 'BOOKING'}
                            </span>
                          </td>

                          {/* Customer */}
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <div>
                                <p className="font-semibold text-[#1E293B] text-sm">{order.customer.name}</p>
                                <div className="flex items-center gap-1 mt-1">
                                  <Phone className="w-3 h-3 text-[#64748B]" />
                                  <a href={`tel:${order.customer.phone}`} className="text-xs text-[#3B82F6] hover:underline">
                                    {order.customer.phone}
                                  </a>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Shop/Professional */}
                          <td className="py-4 px-6">
                            <span className="text-sm font-medium text-[#1E293B]">{order.shop}</span>
                          </td>

                          {/* Amount */}
                          <td className="py-4 px-6">
                            <span className="text-sm font-bold text-[#1E293B]">₹{order.amount.toLocaleString()}</span>
                          </td>

                          {/* Payment */}
                          <td className="py-4 px-6">
                            <div className="space-y-1">
                              <p className="text-xs font-medium text-[#64748B]">{order.paymentMode}</p>
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${getPaymentStatusColor(order.paymentStatus)}`}>
                                {order.paymentStatus.toUpperCase()}
                              </span>
                            </div>
                          </td>

                          {/* Order Status */}
                          <td className="py-4 px-6">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getOrderStatusColor(order.orderStatus)}`}>
                              {order.orderStatus.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                            </span>
                          </td>

                          {/* Delivery Person */}
                          <td className="py-4 px-6">
                            {order.deliveryPerson ? (
                              <span className="text-sm text-[#1E293B]">{order.deliveryPerson}</span>
                            ) : (
                              <span className="text-xs text-[#94A3B8] italic">Not assigned</span>
                            )}
                          </td>

                          {/* Date & Time */}
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-1 text-xs text-[#64748B]">
                              <Calendar className="w-3 h-3" />
                              <span>{order.date}</span>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <Link href={`/dashboard/manager/orders/${order.id}`}>
                                <button className="p-2 text-[#3B82F6] hover:bg-[#EFF6FF] rounded-lg transition-colors" title="View Order">
                                  <Eye className="w-4 h-4" />
                                </button>
                              </Link>
                              {!order.deliveryPerson && order.orderStatus !== 'cancelled' && order.orderStatus !== 'completed' && (
                                <button className="p-2 text-[#10B981] hover:bg-[#D1FAE5] rounded-lg transition-colors" title="Assign Delivery">
                                  <Truck className="w-4 h-4" />
                                </button>
                              )}
                              {order.orderStatus !== 'cancelled' && order.orderStatus !== 'completed' && (
                                <button className="p-2 text-[#EF4444] hover:bg-[#FEE2E2] rounded-lg transition-colors" title="Cancel Order">
                                  <XCircle className="w-4 h-4" />
                                </button>
                              )}
                              <button className="p-2 text-[#F59E0B] hover:bg-[#FEF3C7] rounded-lg transition-colors" title="More Options">
                                <MoreVertical className="w-4 h-4" />
                              </button>
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
                    Showing <span className="font-semibold text-[#1E293B]">{filteredOrders.length}</span> of <span className="font-semibold text-[#1E293B]">{orders.length}</span> orders
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
