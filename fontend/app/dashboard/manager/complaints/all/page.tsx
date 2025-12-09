'use client';

import React, { useState } from 'react';
import { 
  Search, Filter, Download, Eye, UserCheck, AlertTriangle, 
  XCircle, Phone, Calendar, MoreVertical, User, Briefcase, ShoppingBag
} from 'lucide-react';
import Link from 'next/link';
import TopNavbar from '../../components/TopNavbar';
import LeftSidebar from '../../components/LeftSidebar';

export default function AllComplaintsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const complaints = [
    {
      complaintId: 'CMP20241210001',
      userType: 'Customer',
      userName: 'Rajesh Kumar',
      userPhone: '+91 98765 43210',
      against: { name: 'Quick Repairs', type: 'Professional' },
      category: 'Service Quality',
      subCategory: 'Late Arrival',
      priority: 'High',
      orderId: 'ORD12345',
      status: 'Pending',
      source: 'Customer App',
      raisedOn: '2024-12-10 10:30 AM',
    },
    {
      complaintId: 'CMP20241210002',
      userType: 'Professional',
      userName: 'Ramesh Singh',
      userPhone: '+91 98765 43211',
      against: { name: 'Priya Sharma', type: 'Customer' },
      category: 'Payment Issue',
      subCategory: 'Payment Not Received',
      priority: 'Medium',
      orderId: 'ORD12346',
      status: 'Under Review',
      source: 'Professional App',
      raisedOn: '2024-12-09 03:15 PM',
    },
    {
      complaintId: 'CMP20241210003',
      userType: 'Customer',
      userName: 'Amit Patel',
      userPhone: '+91 98765 43212',
      against: { name: 'ElectroWorld Pro', type: 'Shop' },
      category: 'Product Issue',
      subCategory: 'Damaged Product',
      priority: 'Low',
      orderId: 'ORD12347',
      status: 'Resolved',
      source: 'Customer App',
      raisedOn: '2024-12-08 11:45 AM',
    },
    {
      complaintId: 'CMP20241210004',
      userType: 'Shop',
      userName: 'Fresh Mart Groceries',
      userPhone: '+91 98765 43213',
      against: { name: 'Sneha Verma', type: 'Customer' },
      category: 'Fraud',
      subCategory: 'False Complaint',
      priority: 'Critical',
      orderId: 'ORD12348',
      status: 'Escalated',
      source: 'Shop App',
      raisedOn: '2024-12-07 05:20 PM',
    },
    {
      complaintId: 'CMP20241210005',
      userType: 'Customer',
      userName: 'Vikram Singh',
      userPhone: '+91 98765 43214',
      against: { name: 'Home Services', type: 'Professional' },
      category: 'Behavior',
      subCategory: 'Rude Behavior',
      priority: 'High',
      orderId: 'ORD12349',
      status: 'Pending',
      source: 'Customer App',
      raisedOn: '2024-12-10 02:30 PM',
    },
    {
      complaintId: 'CMP20241210006',
      userType: 'Customer',
      userName: 'Neha Gupta',
      userPhone: '+91 98765 43215',
      against: { name: 'Tasty Bites', type: 'Shop' },
      category: 'Service Quality',
      subCategory: 'Overcharging',
      priority: 'Medium',
      orderId: 'ORD12350',
      status: 'Under Review',
      source: 'Auto-System',
      raisedOn: '2024-12-09 09:00 AM',
    },
  ];

  const getUserTypeIcon = (type: string) => {
    switch (type) {
      case 'Customer': return <User className="w-4 h-4" />;
      case 'Professional': return <Briefcase className="w-4 h-4" />;
      case 'Shop': return <ShoppingBag className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getUserTypeColor = (type: string) => {
    switch (type) {
      case 'Customer': return 'bg-[#DBEAFE] text-[#1E40AF]';
      case 'Professional': return 'bg-[#E9D5FF] text-[#6B21A8]';
      case 'Shop': return 'bg-[#FEF3C7] text-[#92400E]';
      default: return 'bg-[#F1F5F9] text-[#475569]';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-[#FEE2E2] text-[#991B1B] border-[#EF4444]';
      case 'High': return 'bg-[#FED7AA] text-[#9A3412] border-[#F59E0B]';
      case 'Medium': return 'bg-[#FEF3C7] text-[#92400E] border-[#F59E0B]';
      case 'Low': return 'bg-[#D1FAE5] text-[#065F46] border-[#10B981]';
      default: return 'bg-[#F1F5F9] text-[#475569] border-[#64748B]';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resolved': return 'bg-[#D1FAE5] text-[#065F46]';
      case 'Pending': return 'bg-[#FEF3C7] text-[#92400E]';
      case 'Under Review': return 'bg-[#DBEAFE] text-[#1E40AF]';
      case 'Escalated': return 'bg-[#FEE2E2] text-[#991B1B]';
      default: return 'bg-[#F1F5F9] text-[#475569]';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      <TopNavbar />
      <div className="flex">
        <LeftSidebar isOpen={sidebarOpen} />
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
          <div className="p-8">
            <div className="max-w-[1600px] mx-auto">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-semibold text-[#1E293B] mb-2">All Complaints</h1>
                    <p className="text-[#64748B] text-sm">View and manage all customer complaints and reports</p>
                  </div>
                  <button className="px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-colors flex items-center gap-2 text-sm font-medium">
                    <Download className="w-4 h-4" />
                    Export Report
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 mb-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#64748B] w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search Complaint ID, Order ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                    />
                  </div>

                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                  >
                    <option value="all">All Categories</option>
                    <option value="service">Service Quality</option>
                    <option value="payment">Payment Issue</option>
                    <option value="behavior">Behavior</option>
                    <option value="fraud">Fraud</option>
                    <option value="product">Product Issue</option>
                    <option value="other">Other</option>
                  </select>

                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                  >
                    <option value="all">All Priorities</option>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="review">Under Review</option>
                    <option value="resolved">Resolved</option>
                    <option value="escalated">Escalated</option>
                  </select>

                  <select
                    className="px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                  >
                    <option value="all">All Sources</option>
                    <option value="customer-app">Customer App</option>
                    <option value="professional-app">Professional App</option>
                    <option value="shop-app">Shop App</option>
                    <option value="auto-system">Auto-System</option>
                  </select>

                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#64748B] w-4 h-4" />
                    <input
                      type="date"
                      className="w-full pl-10 pr-4 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                    />
                  </div>
                </div>
              </div>

              {/* Complaints Table */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] sticky top-0">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Complaint ID</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">User Type</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Name</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Against</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Category</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Priority</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Order ID</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Raised On</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0]">
                      {complaints.map((complaint) => (
                        <tr key={complaint.complaintId} className="hover:bg-[#F8FAFC] transition-colors">
                          <td className="px-6 py-4">
                            <span className="text-sm font-mono text-[#10B981] font-medium">{complaint.complaintId}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${getUserTypeColor(complaint.userType)}`}>
                              {getUserTypeIcon(complaint.userType)}
                              {complaint.userType}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-sm font-medium text-[#1E293B]">{complaint.userName}</p>
                              <a href={`tel:${complaint.userPhone}`} className="text-xs text-[#10B981] hover:underline flex items-center gap-1 mt-1">
                                <Phone className="w-3 h-3" />
                                {complaint.userPhone}
                              </a>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-sm font-medium text-[#1E293B]">{complaint.against.name}</p>
                              <p className="text-xs text-[#64748B]">{complaint.against.type}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-sm font-medium text-[#1E293B]">{complaint.category}</p>
                              <p className="text-xs text-[#64748B]">{complaint.subCategory}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getPriorityColor(complaint.priority)}`}>
                              {complaint.priority}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <Link href={`/dashboard/manager/orders/${complaint.orderId}`}>
                              <span className="text-sm font-mono text-[#10B981] hover:underline cursor-pointer">{complaint.orderId}</span>
                            </Link>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                              {complaint.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-[#64748B]">{complaint.raisedOn}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Link href={`/dashboard/manager/complaints/${complaint.complaintId}`}>
                                <button className="p-2 text-[#10B981] hover:bg-[#F0FDF4] rounded-lg transition-colors" title="View Details">
                                  <Eye className="w-4 h-4" />
                                </button>
                              </Link>
                              {complaint.status === 'Pending' && (
                                <>
                                  <button className="px-3 py-1.5 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors text-xs font-medium flex items-center gap-1">
                                    <UserCheck className="w-3 h-3" />
                                    Assign
                                  </button>
                                  <button className="px-3 py-1.5 bg-[#EF4444] text-white rounded-lg hover:bg-[#DC2626] transition-colors text-xs font-medium flex items-center gap-1">
                                    <AlertTriangle className="w-3 h-3" />
                                    Escalate
                                  </button>
                                </>
                              )}
                              {complaint.status === 'Under Review' && (
                                <button className="px-3 py-1.5 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-colors text-xs font-medium flex items-center gap-1">
                                  <XCircle className="w-3 h-3" />
                                  Close
                                </button>
                              )}
                              <button className="p-2 text-[#64748B] hover:bg-[#F8FAFC] rounded-lg transition-colors" title="More Options">
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
                <div className="px-6 py-4 border-t border-[#E2E8F0] flex items-center justify-between">
                  <p className="text-sm text-[#64748B]">Showing 1 to 6 of 45 complaints</p>
                  <div className="flex items-center gap-2">
                    <button className="px-4 py-2 border border-[#E2E8F0] text-[#64748B] rounded-lg hover:bg-[#F8FAFC] transition-colors text-sm">
                      Previous
                    </button>
                    <button className="px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-colors text-sm">
                      1
                    </button>
                    <button className="px-4 py-2 border border-[#E2E8F0] text-[#64748B] rounded-lg hover:bg-[#F8FAFC] transition-colors text-sm">
                      2
                    </button>
                    <button className="px-4 py-2 border border-[#E2E8F0] text-[#64748B] rounded-lg hover:bg-[#F8FAFC] transition-colors text-sm">
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
