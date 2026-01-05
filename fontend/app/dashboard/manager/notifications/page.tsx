'use client';

import React, { useState } from 'react';
import { 
  Bell, Search, Filter, CheckCheck, Trash2, Package, Wrench, 
  DollarSign, Store, RotateCcw, User, Settings, Clock, X
} from 'lucide-react';
import TopNavbar from '../components/TopNavbar';
import LeftSidebar from '../components/LeftSidebar';

export default function NotificationsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedNotifications, setSelectedNotifications] = useState<number[]>([]);

  // Mock notifications data
  const allNotifications = [
    {
      id: 1,
      type: 'order',
      title: 'New Order Received',
      message: 'Order #ORD-2024-001 from Amit Sharma has been placed. Total amount: ₹2,500. Payment status: Paid via UPI.',
      time: '5 min ago',
      timestamp: '2024-12-10 10:30 AM',
      read: false,
      icon: Package,
      color: 'bg-[#DBEAFE] text-[#2563EB]',
      actionUrl: '/dashboard/manager/orders/ORD-2024-001'
    },
    {
      id: 2,
      type: 'booking',
      title: 'Service Booking Confirmed',
      message: 'Rajesh Kumar (Electrician) accepted booking #BOOK-2024-003. Scheduled for Dec 12, 10:00 AM.',
      time: '15 min ago',
      timestamp: '2024-12-10 10:20 AM',
      read: false,
      icon: Wrench,
      color: 'bg-[#E0E7FF] text-[#6366F1]',
      actionUrl: '/dashboard/manager/orders/BOOK-2024-003'
    },
    {
      id: 3,
      type: 'payment',
      title: 'Payment Received',
      message: 'Payment of ₹2,500 received for Order #ORD-2024-005. Transaction ID: TXN2024120100125',
      time: '1 hour ago',
      timestamp: '2024-12-10 09:35 AM',
      read: false,
      icon: DollarSign,
      color: 'bg-[#D1FAE5] text-[#059669]',
      actionUrl: '/dashboard/manager/orders/ORD-2024-005'
    },
    {
      id: 4,
      type: 'shop',
      title: 'Shop Approval Pending',
      message: 'New shop "TechZone Electronics" registration submitted. Owner: Suresh Reddy. Awaiting document verification.',
      time: '2 hours ago',
      timestamp: '2024-12-10 08:35 AM',
      read: true,
      icon: Store,
      color: 'bg-[#FEF3C7] text-[#D97706]',
      actionUrl: '/dashboard/manager/shops'
    },
    {
      id: 5,
      type: 'refund',
      title: 'Refund Request',
      message: 'Customer Sneha Patel requested refund for Order #ORD-2024-004. Reason: Payment failed but amount deducted. Amount: ₹3,200',
      time: '3 hours ago',
      timestamp: '2024-12-10 07:35 AM',
      read: true,
      icon: RotateCcw,
      color: 'bg-[#FEE2E2] text-[#DC2626]',
      actionUrl: '/dashboard/manager/orders/refunds'
    },
    {
      id: 6,
      type: 'professional',
      title: 'Professional Verification Request',
      message: 'New professional "Amit Yadav - Carpenter" submitted verification documents. Experience: 5 years. Location: Bangalore.',
      time: '4 hours ago',
      timestamp: '2024-12-10 06:35 AM',
      read: true,
      icon: User,
      color: 'bg-[#E0E7FF] text-[#6366F1]',
      actionUrl: '/dashboard/manager/professionals'
    },
    {
      id: 7,
      type: 'system',
      title: 'System Maintenance Scheduled',
      message: 'Platform maintenance scheduled for tonight at 2:00 AM. Expected downtime: 30 minutes. Please inform users.',
      time: '5 hours ago',
      timestamp: '2024-12-10 05:35 AM',
      read: true,
      icon: Settings,
      color: 'bg-[#F3F4F6] text-[#6B7280]',
      actionUrl: null
    },
    {
      id: 8,
      type: 'order',
      title: 'Order Cancelled',
      message: 'Order #ORD-2024-004 cancelled by customer. Refund of ₹3,200 needs to be processed.',
      time: '6 hours ago',
      timestamp: '2024-12-10 04:35 AM',
      read: true,
      icon: Package,
      color: 'bg-[#DBEAFE] text-[#2563EB]',
      actionUrl: '/dashboard/manager/orders/ORD-2024-004'
    },
    {
      id: 9,
      type: 'booking',
      title: 'Booking Rescheduled',
      message: 'Customer rescheduled booking #BOOK-2024-002. New date: Dec 15, 2:00 PM. Professional: Suresh Reddy (Plumber).',
      time: '7 hours ago',
      timestamp: '2024-12-10 03:35 AM',
      read: true,
      icon: Wrench,
      color: 'bg-[#E0E7FF] text-[#6366F1]',
      actionUrl: '/dashboard/manager/orders/BOOK-2024-002'
    },
    {
      id: 10,
      type: 'payment',
      title: 'Payment Failed',
      message: 'Payment failed for Order #ORD-2024-006. Customer notified to retry payment. Amount: ₹1,850',
      time: '8 hours ago',
      timestamp: '2024-12-10 02:35 AM',
      read: true,
      icon: DollarSign,
      color: 'bg-[#D1FAE5] text-[#059669]',
      actionUrl: '/dashboard/manager/orders/ORD-2024-006'
    }
  ];

  const filteredNotifications = allNotifications.filter((notif) => {
    const matchesSearch = 
      notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notif.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === 'all' || notif.type === typeFilter;
    const matchesStatus = 
      statusFilter === 'all' ? true :
      statusFilter === 'unread' ? !notif.read :
      statusFilter === 'read' ? notif.read : true;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const unreadCount = allNotifications.filter(n => !n.read).length;
  const todayCount = filteredNotifications.length;

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map(n => n.id));
    }
  };

  const handleSelectNotification = (id: number) => {
    if (selectedNotifications.includes(id)) {
      setSelectedNotifications(selectedNotifications.filter(nId => nId !== id));
    } else {
      setSelectedNotifications([...selectedNotifications, id]);
    }
  };

  const getTypeIcon = (type: string) => {
    const icons: { [key: string]: any } = {
      order: Package,
      booking: Wrench,
      payment: DollarSign,
      shop: Store,
      refund: RotateCcw,
      professional: User,
      system: Settings
    };
    return icons[type] || Bell;
  };

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
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-semibold text-[#1E293B] mb-2">Notifications</h1>
                    <p className="text-[#64748B] text-sm">Stay updated with all platform activities</p>
                  </div>

                  <div className="flex items-center gap-3">
                    {selectedNotifications.length > 0 && (
                      <>
                        <button className="px-4 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors flex items-center gap-2 text-sm font-medium">
                          <CheckCheck className="w-4 h-4" />
                          Mark as Read ({selectedNotifications.length})
                        </button>
                        <button className="px-4 py-2 bg-[#EF4444] text-white rounded-lg hover:bg-[#DC2626] transition-colors flex items-center gap-2 text-sm font-medium">
                          <Trash2 className="w-4 h-4" />
                          Delete ({selectedNotifications.length})
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-xl p-5 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm opacity-90">Total Notifications</span>
                      <Bell className="w-5 h-5 opacity-80" />
                    </div>
                    <h3 className="text-2xl font-bold">{allNotifications.length}</h3>
                    <p className="text-xs opacity-75 mt-1">All time</p>
                  </div>

                  <div className="bg-gradient-to-br from-[#EF4444] to-[#DC2626] rounded-xl p-5 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm opacity-90">Unread</span>
                      <Bell className="w-5 h-5 opacity-80" />
                    </div>
                    <h3 className="text-2xl font-bold">{unreadCount}</h3>
                    <p className="text-xs opacity-75 mt-1">Needs attention</p>
                  </div>

                  <div className="bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl p-5 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm opacity-90">Today</span>
                      <Clock className="w-5 h-5 opacity-80" />
                    </div>
                    <h3 className="text-2xl font-bold">{todayCount}</h3>
                    <p className="text-xs opacity-75 mt-1">Last 24 hours</p>
                  </div>

                  <div className="bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] rounded-xl p-5 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm opacity-90">Selected</span>
                      <CheckCheck className="w-5 h-5 opacity-80" />
                    </div>
                    <h3 className="text-2xl font-bold">{selectedNotifications.length}</h3>
                    <p className="text-xs opacity-75 mt-1">Currently selected</p>
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
                        placeholder="Search notifications..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 text-gray-700 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
                      />
                    </div>

                    {/* Type Filter */}
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="px-4 py-2.5 text-gray-700 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] bg-white"
                    >
                      <option value="all">All Types</option>
                      <option value="order">Orders</option>
                      <option value="booking">Bookings</option>
                      <option value="payment">Payments</option>
                      <option value="shop">Shops</option>
                      <option value="refund">Refunds</option>
                      <option value="professional">Professionals</option>
                      <option value="system">System</option>
                    </select>

                    {/* Status Filter */}
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-4 py-2.5 text-gray-700 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] bg-white"
                    >
                      <option value="all">All Status</option>
                      <option value="unread">Unread Only</option>
                      <option value="read">Read Only</option>
                    </select>
                  </div>

                  {/* Bulk Actions */}
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-sm text-[#64748B] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedNotifications.length === filteredNotifications.length && filteredNotifications.length > 0}
                        onChange={handleSelectAll}
                        className="w-4 h-4 rounded border-[#E2E8F0] text-[#3B82F6] focus:ring-[#3B82F6]"
                      />
                      Select All ({filteredNotifications.length})
                    </label>
                  </div>
                </div>
              </div>

              {/* Notifications List */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-16">
                    <Bell className="w-16 h-16 text-[#CBD5E1] mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-[#1E293B] mb-2">No notifications found</h3>
                    <p className="text-sm text-[#64748B]">Try adjusting your filters</p>
                  </div>
                ) : (
                  <div className="divide-y divide-[#E2E8F0]">
                    {filteredNotifications.map((notification) => {
                      const Icon = notification.icon;
                      const isSelected = selectedNotifications.includes(notification.id);

                      return (
                        <div
                          key={notification.id}
                          className={`p-6 hover:bg-[#F8FAFC] transition-colors ${
                            !notification.read ? 'bg-[#EFF6FF]' : ''
                          } ${isSelected ? 'bg-[#DBEAFE]' : ''}`}
                        >
                          <div className="flex items-start gap-4">
                            {/* Checkbox */}
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleSelectNotification(notification.id)}
                              className="mt-1 w-4 h-4 rounded border-[#E2E8F0] text-[#3B82F6] focus:ring-[#3B82F6]"
                            />

                            {/* Icon */}
                            <div className={`w-12 h-12 rounded-lg ${notification.color} flex items-center justify-center flex-shrink-0`}>
                              <Icon className="w-6 h-6" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-4 mb-2">
                                <h3 className={`text-base font-semibold ${
                                  !notification.read ? 'text-[#1E293B]' : 'text-[#64748B]'
                                }`}>
                                  {notification.title}
                                  {!notification.read && (
                                    <span className="ml-2 inline-block w-2 h-2 bg-[#3B82F6] rounded-full"></span>
                                  )}
                                </h3>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <span className="text-xs text-[#94A3B8]">{notification.time}</span>
                                  <button className="p-1 text-[#94A3B8] hover:text-[#EF4444] transition-colors">
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                              <p className="text-sm text-[#64748B] mb-3 leading-relaxed">
                                {notification.message}
                              </p>
                              <div className="flex items-center gap-3">
                                <span className="text-xs text-[#94A3B8] flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {notification.timestamp}
                                </span>
                                {notification.actionUrl && (
                                  <a
                                    href={notification.actionUrl}
                                    className="text-xs text-[#3B82F6] font-medium hover:underline"
                                  >
                                    View Details →
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Pagination */}
                {filteredNotifications.length > 0 && (
                  <div className="border-t border-[#E2E8F0] px-6 py-4 flex items-center justify-between bg-[#F8FAFC]">
                    <div className="text-sm text-[#64748B]">
                      Showing <span className="font-semibold text-[#1E293B]">{filteredNotifications.length}</span> of{' '}
                      <span className="font-semibold text-[#1E293B]">{allNotifications.length}</span> notifications
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="px-4 py-2 border border-[#E2E8F0] text-[#64748B] rounded-lg hover:bg-white transition-colors text-sm font-medium">
                        Previous
                      </button>
                      <button className="px-4 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors text-sm font-medium">
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
