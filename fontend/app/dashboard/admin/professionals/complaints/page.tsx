'use client';

import React, { useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { Search, AlertCircle, MessageSquare, User, Calendar, X, CheckCircle2, XCircle, AlertTriangle, Ban, FileText, Eye } from 'lucide-react';

interface Complaint {
  id: string;
  complaintId: string;
  date: string;
  customer: string;
  customerId: string;
  professional: string;
  professionalId: string;
  category: string;
  issueType: string;
  description: string;
  evidence: string[];
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  severity: 'low' | 'medium' | 'high' | 'critical';
  assignedTo: string;
}

export default function ComplaintsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);

  // Mock data
  const complaints: Complaint[] = [
    {
      id: '1',
      complaintId: 'COMP001',
      date: '2024-12-10',
      customer: 'Amit Sharma',
      customerId: 'CUST456',
      professional: 'Rajesh Kumar',
      professionalId: 'PRO123',
      category: 'Service Quality',
      issueType: 'Unprofessional Behavior',
      description: 'The professional was rude and did not complete the work properly. Left the site messy and refused to clean up.',
      evidence: ['photo1.jpg', 'photo2.jpg'],
      status: 'pending',
      severity: 'high',
      assignedTo: 'Admin Team',
    },
    {
      id: '2',
      complaintId: 'COMP002',
      date: '2024-12-09',
      customer: 'Priya Patel',
      customerId: 'CUST457',
      professional: 'Amit Singh',
      professionalId: 'PRO124',
      category: 'Safety Violation',
      issueType: 'Unsafe Practices',
      description: 'Professional did not follow safety protocols while working with electrical installations.',
      evidence: ['video1.mp4'],
      status: 'investigating',
      severity: 'critical',
      assignedTo: 'Safety Team',
    },
    {
      id: '3',
      complaintId: 'COMP003',
      date: '2024-12-08',
      customer: 'Rahul Gupta',
      customerId: 'CUST458',
      professional: 'Neha Sharma',
      professionalId: 'PRO125',
      category: 'Payment Dispute',
      issueType: 'Overcharging',
      description: 'Professional charged more than the quoted price without prior approval.',
      evidence: ['invoice.pdf'],
      status: 'resolved',
      severity: 'medium',
      assignedTo: 'Finance Team',
    },
  ];

  const stats = [
    { label: 'Total Complaints', value: '342', icon: AlertCircle, color: 'bg-[#D32F2F]', textColor: 'text-[#D32F2F]' },
    { label: 'Pending Review', value: '89', icon: AlertTriangle, color: 'bg-[#FFAB00]', textColor: 'text-[#FFAB00]' },
    { label: 'Investigating', value: '45', icon: Eye, color: 'bg-[#1A73E8]', textColor: 'text-[#1A73E8]' },
    { label: 'Resolved', value: '208', icon: CheckCircle2, color: 'bg-[#00C853]', textColor: 'text-[#00C853]' },
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      investigating: 'bg-blue-50 text-blue-700 border-blue-200',
      resolved: 'bg-green-50 text-green-700 border-green-200',
      dismissed: 'bg-gray-50 text-gray-700 border-gray-200',
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  const getSeverityBadge = (severity: string) => {
    const styles = {
      low: 'bg-green-50 text-green-700 border-green-200',
      medium: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      high: 'bg-orange-50 text-orange-700 border-orange-200',
      critical: 'bg-red-50 text-red-700 border-red-200',
    };
    return styles[severity as keyof typeof styles] || styles.low;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F7FA]">
      <AdminSidebar />
      
      <div className="flex-1 ml-72 flex flex-col">
        {/* Top Navigation */}
        <div className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <div>
            <h1 className="text-2xl font-bold text-[#0B0F19]">Complaints Management</h1>
            <p className="text-sm text-gray-500">Review and resolve customer complaints</p>
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
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by complaint ID, customer, professional..."
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
                <option value="pending">Pending</option>
                <option value="investigating">Investigating</option>
                <option value="resolved">Resolved</option>
                <option value="dismissed">Dismissed</option>
              </select>
              <select
                className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A73E8] bg-white"
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
              >
                <option value="all">All Severity</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          {/* Complaints Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-[#1A73E8] to-[#6C63FF] text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Complaint ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Customer</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Professional</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Issue Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Severity</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {complaints.map((complaint) => (
                    <tr key={complaint.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-semibold text-[#1A73E8]">{complaint.complaintId}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{new Date(complaint.date).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-[#0B0F19]">{complaint.customer}</p>
                          <p className="text-xs text-gray-500">ID: {complaint.customerId}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-[#0B0F19]">{complaint.professional}</p>
                          <p className="text-xs text-gray-500">ID: {complaint.professionalId}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{complaint.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{complaint.issueType}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityBadge(complaint.severity)}`}>
                          <span className="capitalize">{complaint.severity}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(complaint.status)}`}>
                          <span className="capitalize">{complaint.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => {
                            setSelectedComplaint(complaint);
                            setShowDrawer(true);
                          }}
                          className="px-4 py-2 bg-[#1A73E8] text-white rounded-lg hover:bg-[#1557b0] transition-colors text-sm font-medium flex items-center space-x-1"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View Details</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <p className="text-sm text-gray-600">Showing 1-3 of 342 complaints</p>
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

      {/* Complaint Details Drawer */}
      {showDrawer && selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="w-[600px] bg-white h-full overflow-y-auto shadow-2xl">
            {/* Drawer Header */}
            <div className="bg-gradient-to-r from-[#1A73E8] to-[#6C63FF] p-6 text-white sticky top-0 z-10">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{selectedComplaint.complaintId}</h2>
                  <p className="text-white text-opacity-90 text-sm">Filed on {new Date(selectedComplaint.date).toLocaleDateString()}</p>
                </div>
                <button
                  onClick={() => setShowDrawer(false)}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex items-center space-x-3 mt-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border bg-white bg-opacity-20 ${selectedComplaint.severity === 'critical' ? 'border-red-300' : selectedComplaint.severity === 'high' ? 'border-orange-300' : 'border-yellow-300'}`}>
                  {selectedComplaint.severity.toUpperCase()} SEVERITY
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border bg-white bg-opacity-20`}>
                  {selectedComplaint.status.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Drawer Content */}
            <div className="p-6 space-y-6">
              {/* Parties Involved */}
              <div>
                <h3 className="text-lg font-bold text-[#0B0F19] mb-4">Parties Involved</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-xs text-blue-600 mb-1">Customer</p>
                    <p className="font-bold text-blue-900">{selectedComplaint.customer}</p>
                    <p className="text-xs text-blue-600">ID: {selectedComplaint.customerId}</p>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                    <p className="text-xs text-purple-600 mb-1">Professional</p>
                    <p className="font-bold text-purple-900">{selectedComplaint.professional}</p>
                    <p className="text-xs text-purple-600">ID: {selectedComplaint.professionalId}</p>
                  </div>
                </div>
              </div>

              {/* Complaint Details */}
              <div>
                <h3 className="text-lg font-bold text-[#0B0F19] mb-4">Complaint Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Category</span>
                    <span className="font-semibold text-[#0B0F19]">{selectedComplaint.category}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Issue Type</span>
                    <span className="font-semibold text-[#0B0F19]">{selectedComplaint.issueType}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Assigned To</span>
                    <span className="font-semibold text-[#0B0F19]">{selectedComplaint.assignedTo}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-bold text-[#0B0F19] mb-4">Description</h3>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <p className="text-sm text-gray-700 leading-relaxed">{selectedComplaint.description}</p>
                </div>
              </div>

              {/* Evidence */}
              <div>
                <h3 className="text-lg font-bold text-[#0B0F19] mb-4 flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-[#1A73E8]" />
                  <span>Evidence ({selectedComplaint.evidence.length})</span>
                </h3>
                <div className="space-y-2">
                  {selectedComplaint.evidence.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">{file}</span>
                      </div>
                      <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">View</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Admin Notes */}
              <div>
                <h3 className="text-lg font-bold text-[#0B0F19] mb-4">Admin Notes</h3>
                <textarea
                  className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A73E8] resize-none"
                  rows={4}
                  placeholder="Add internal notes about this complaint..."
                />
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <button className="w-full px-6 py-3 bg-[#00C853] text-white rounded-xl hover:bg-[#00a844] transition-colors font-semibold flex items-center justify-center space-x-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Mark as Resolved</span>
                </button>
                <button className="w-full px-6 py-3 bg-[#FFAB00] text-white rounded-xl hover:bg-[#ff9100] transition-colors font-semibold flex items-center justify-center space-x-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Issue Warning to Professional</span>
                </button>
                <button className="w-full px-6 py-3 bg-[#D32F2F] text-white rounded-xl hover:bg-[#b71c1c] transition-colors font-semibold flex items-center justify-center space-x-2">
                  <Ban className="w-5 h-5" />
                  <span>Add Strike & Suspend</span>
                </button>
                <button className="w-full px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors font-semibold flex items-center justify-center space-x-2">
                  <XCircle className="w-5 h-5" />
                  <span>Dismiss Complaint</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
