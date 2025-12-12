'use client';

import React, { useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { Search, Filter, FileText, Download, Eye, CheckCircle2, XCircle, Clock, AlertTriangle, Upload, Calendar } from 'lucide-react';

interface Document {
  id: string;
  professionalName: string;
  professionalId: string;
  documentName: string;
  documentType: string;
  uploadDate: string;
  expiryDate: string;
  status: 'approved' | 'pending' | 'rejected' | 'expired' | 'missing';
  fileUrl: string;
}

export default function ProfessionalDocumentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data
  const documents: Document[] = [
    {
      id: 'DOC001',
      professionalName: 'Rajesh Kumar',
      professionalId: 'PRO123',
      documentName: 'Aadhaar Card',
      documentType: 'Government ID',
      uploadDate: '2024-12-01',
      expiryDate: '2034-12-01',
      status: 'approved',
      fileUrl: '#',
    },
    {
      id: 'DOC002',
      professionalName: 'Priya Sharma',
      professionalId: 'PRO124',
      documentName: 'Electrical License',
      documentType: 'Professional Certificate',
      uploadDate: '2024-11-15',
      expiryDate: '2025-01-15',
      status: 'pending',
      fileUrl: '#',
    },
    {
      id: 'DOC003',
      professionalName: 'Amit Patel',
      professionalId: 'PRO125',
      documentName: 'Police Clearance',
      documentType: 'Background Check',
      uploadDate: '2024-10-20',
      expiryDate: '2024-12-10',
      status: 'expired',
      fileUrl: '#',
    },
    {
      id: 'DOC004',
      professionalName: 'Neha Singh',
      professionalId: 'PRO126',
      documentName: 'PAN Card',
      documentType: 'Government ID',
      uploadDate: '2024-11-28',
      expiryDate: '2030-11-28',
      status: 'rejected',
      fileUrl: '#',
    },
  ];

  const stats = [
    { label: 'Total Documents', value: '8,320', icon: FileText, color: 'bg-[#1A73E8]', textColor: 'text-[#1A73E8]' },
    { label: 'Pending Approval', value: '156', icon: Clock, color: 'bg-[#FFAB00]', textColor: 'text-[#FFAB00]' },
    { label: 'Expired', value: '42', icon: AlertTriangle, color: 'bg-[#D32F2F]', textColor: 'text-[#D32F2F]' },
    { label: 'Missing Documents', value: '89', icon: XCircle, color: 'bg-[#6C63FF]', textColor: 'text-[#6C63FF]' },
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      approved: 'bg-green-50 text-green-700 border-green-200',
      pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      rejected: 'bg-red-50 text-red-700 border-red-200',
      expired: 'bg-orange-50 text-orange-700 border-orange-200',
      missing: 'bg-gray-50 text-gray-700 border-gray-200',
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle2 className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'expired': return <AlertTriangle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F7FA]">
      <AdminSidebar />
      
      <div className="flex-1 ml-72 flex flex-col">
        {/* Top Navigation */}
        <div className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <div>
            <h1 className="text-2xl font-bold text-[#0B0F19]">Document Management</h1>
            <p className="text-sm text-gray-500">Manage professional documents and certifications</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 bg-[#1A73E8] text-white rounded-lg hover:bg-[#1557b0] transition-colors font-medium flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export Report</span>
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

          {/* Filters & Search */}
          <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by professional name, document type..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A73E8] focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select
                className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A73E8] bg-white"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Document Types</option>
                <option value="government">Government ID</option>
                <option value="certificate">Professional Certificate</option>
                <option value="background">Background Check</option>
                <option value="address">Address Proof</option>
              </select>
              <select
                className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A73E8] bg-white"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending Approval</option>
                <option value="expired">Expired</option>
                <option value="rejected">Rejected</option>
                <option value="missing">Missing Documents</option>
              </select>
            </div>
          </div>

          {/* Documents Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-[#1A73E8] to-[#6C63FF] text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Professional</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Document Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Document Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Upload Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Expiry Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {documents.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-[#0B0F19]">{doc.professionalName}</p>
                          <p className="text-xs text-gray-500">ID: {doc.professionalId}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-[#1A73E8]" />
                          <span className="text-sm text-[#0B0F19]">{doc.documentName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{doc.documentType}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{new Date(doc.uploadDate).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{new Date(doc.expiryDate).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(doc.status)}`}>
                          {getStatusIcon(doc.status)}
                          <span className="capitalize">{doc.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button className="p-2 bg-[#1A73E8] bg-opacity-10 text-[#1A73E8] rounded-lg hover:bg-opacity-20 transition-colors" title="View Document">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 bg-[#00C853] bg-opacity-10 text-[#00C853] rounded-lg hover:bg-opacity-20 transition-colors" title="Download">
                            <Download className="w-4 h-4" />
                          </button>
                          {doc.status === 'pending' && (
                            <>
                              <button className="p-2 bg-[#00C853] bg-opacity-10 text-[#00C853] rounded-lg hover:bg-opacity-20 transition-colors" title="Approve">
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                              <button className="p-2 bg-[#D32F2F] bg-opacity-10 text-[#D32F2F] rounded-lg hover:bg-opacity-20 transition-colors" title="Reject">
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          {doc.status === 'expired' && (
                            <button className="p-2 bg-[#FFAB00] bg-opacity-10 text-[#FFAB00] rounded-lg hover:bg-opacity-20 transition-colors" title="Request Upload">
                              <Upload className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <p className="text-sm text-gray-600">Showing 1-4 of 8,320 documents</p>
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
    </div>
  );
}
