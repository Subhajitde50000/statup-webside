'use client';

import React, { useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { Search, Filter, CheckCircle2, XCircle, Clock, FileText, Upload, User, MapPin, Building2, Phone, Mail, Calendar, AlertCircle, Download, Eye } from 'lucide-react';

interface VerificationRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  category: string;
  city: string;
  appliedDate: string;
  governmentId: {
    type: string;
    number: string;
    status: 'pending' | 'approved' | 'rejected';
    url: string;
  };
  addressProof: {
    type: string;
    status: 'pending' | 'approved' | 'rejected';
    url: string;
  };
  selfie: {
    status: 'pending' | 'approved' | 'rejected';
    url: string;
  };
  certificate: {
    name: string;
    status: 'pending' | 'approved' | 'rejected';
    url: string;
  };
  backgroundCheck: 'pending' | 'passed' | 'failed';
  skillTest: 'pending' | 'passed' | 'failed';
}

export default function ProfessionalVerificationPage() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null);

  // Mock data
  const verificationRequests: VerificationRequest[] = [
    {
      id: 'VER001',
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@email.com',
      phone: '+91 98765 43210',
      category: 'Plumber',
      city: 'Mumbai',
      appliedDate: '2024-12-10',
      governmentId: { type: 'Aadhaar Card', number: 'XXXX-XXXX-1234', status: 'pending', url: '#' },
      addressProof: { type: 'Utility Bill', status: 'pending', url: '#' },
      selfie: { status: 'pending', url: '#' },
      certificate: { name: 'ITI Plumbing Certificate', status: 'pending', url: '#' },
      backgroundCheck: 'pending',
      skillTest: 'pending',
    },
    {
      id: 'VER002',
      name: 'Priya Sharma',
      email: 'priya.sharma@email.com',
      phone: '+91 87654 32109',
      category: 'Electrician',
      city: 'Delhi',
      appliedDate: '2024-12-09',
      governmentId: { type: 'PAN Card', number: 'ABCDE1234F', status: 'approved', url: '#' },
      addressProof: { type: 'Bank Statement', status: 'approved', url: '#' },
      selfie: { status: 'approved', url: '#' },
      certificate: { name: 'Electrical License', status: 'pending', url: '#' },
      backgroundCheck: 'passed',
      skillTest: 'pending',
    },
  ];

  const stats = [
    { label: 'Total Pending', value: '445', icon: Clock, color: 'bg-[#FFAB00]', textColor: 'text-[#FFAB00]' },
    { label: 'Approved Today', value: '23', icon: CheckCircle2, color: 'bg-[#00C853]', textColor: 'text-[#00C853]' },
    { label: 'Rejected', value: '12', icon: XCircle, color: 'bg-[#D32F2F]', textColor: 'text-[#D32F2F]' },
    { label: 'Avg. Processing', value: '2.5 days', icon: Calendar, color: 'bg-[#1A73E8]', textColor: 'text-[#1A73E8]' },
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      approved: 'bg-green-50 text-green-700 border-green-200',
      rejected: 'bg-red-50 text-red-700 border-red-200',
      passed: 'bg-green-50 text-green-700 border-green-200',
      failed: 'bg-red-50 text-red-700 border-red-200',
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F7FA]">
      <AdminSidebar />
      
      <div className="flex-1 ml-72 flex flex-col">
        {/* Top Navigation */}
        <div className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <div>
            <h1 className="text-2xl font-bold text-[#0B0F19]">Professional Verification</h1>
            <p className="text-sm text-gray-500">Review and approve KYC documents</p>
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
                  placeholder="Search by name, email, phone..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A73E8] focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select
                className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A73E8] bg-white"
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
              >
                <option value="all">All Requests</option>
                <option value="pending">Pending Review</option>
                <option value="documents">Documents Pending</option>
                <option value="background">Background Check Pending</option>
                <option value="skill">Skill Test Pending</option>
              </select>
            </div>
          </div>

          {/* Verification Requests */}
          <div className="space-y-6">
            {verificationRequests.map((request) => (
              <div key={request.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#1A73E8] to-[#6C63FF] p-6 text-white">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                        <User className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{request.name}</h3>
                        <p className="text-white text-opacity-90 text-sm">{request.category} • {request.city}</p>
                        <p className="text-white text-opacity-80 text-xs mt-1">Application ID: {request.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-white text-opacity-80">Applied On</p>
                      <p className="font-semibold">{new Date(request.appliedDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2 text-sm">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{request.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{request.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Documents Section */}
                <div className="p-6">
                  <h4 className="text-lg font-bold text-[#0B0F19] mb-4 flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-[#1A73E8]" />
                    <span>Identity Documents</span>
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {/* Government ID */}
                    <div className="border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-semibold text-[#0B0F19]">Government ID</p>
                          <p className="text-xs text-gray-500">{request.governmentId.type}</p>
                          <p className="text-xs text-gray-400 mt-1">{request.governmentId.number}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(request.governmentId.status)}`}>
                          {request.governmentId.status}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button className="flex-1 px-3 py-2 bg-[#1A73E8] text-white rounded-lg text-sm hover:bg-[#1557b0] transition-colors flex items-center justify-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </button>
                        <button className="flex-1 px-3 py-2 bg-[#00C853] text-white rounded-lg text-sm hover:bg-[#00a844] transition-colors flex items-center justify-center space-x-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Approve</span>
                        </button>
                        <button className="flex-1 px-3 py-2 bg-[#D32F2F] text-white rounded-lg text-sm hover:bg-[#b71c1c] transition-colors flex items-center justify-center space-x-1">
                          <XCircle className="w-4 h-4" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>

                    {/* Address Proof */}
                    <div className="border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-semibold text-[#0B0F19]">Address Proof</p>
                          <p className="text-xs text-gray-500">{request.addressProof.type}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(request.addressProof.status)}`}>
                          {request.addressProof.status}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button className="flex-1 px-3 py-2 bg-[#1A73E8] text-white rounded-lg text-sm hover:bg-[#1557b0] transition-colors flex items-center justify-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </button>
                        <button className="flex-1 px-3 py-2 bg-[#00C853] text-white rounded-lg text-sm hover:bg-[#00a844] transition-colors flex items-center justify-center space-x-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Approve</span>
                        </button>
                        <button className="flex-1 px-3 py-2 bg-[#D32F2F] text-white rounded-lg text-sm hover:bg-[#b71c1c] transition-colors flex items-center justify-center space-x-1">
                          <XCircle className="w-4 h-4" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>

                    {/* Selfie */}
                    <div className="border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-semibold text-[#0B0F19]">Selfie Verification</p>
                          <p className="text-xs text-gray-500">Face matching</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(request.selfie.status)}`}>
                          {request.selfie.status}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button className="flex-1 px-3 py-2 bg-[#1A73E8] text-white rounded-lg text-sm hover:bg-[#1557b0] transition-colors flex items-center justify-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </button>
                        <button className="flex-1 px-3 py-2 bg-[#00C853] text-white rounded-lg text-sm hover:bg-[#00a844] transition-colors flex items-center justify-center space-x-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Approve</span>
                        </button>
                        <button className="flex-1 px-3 py-2 bg-[#D32F2F] text-white rounded-lg text-sm hover:bg-[#b71c1c] transition-colors flex items-center justify-center space-x-1">
                          <XCircle className="w-4 h-4" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>

                    {/* Certificate */}
                    <div className="border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-semibold text-[#0B0F19]">Professional Certificate</p>
                          <p className="text-xs text-gray-500">{request.certificate.name}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(request.certificate.status)}`}>
                          {request.certificate.status}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button className="flex-1 px-3 py-2 bg-[#1A73E8] text-white rounded-lg text-sm hover:bg-[#1557b0] transition-colors flex items-center justify-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </button>
                        <button className="flex-1 px-3 py-2 bg-[#00C853] text-white rounded-lg text-sm hover:bg-[#00a844] transition-colors flex items-center justify-center space-x-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Approve</span>
                        </button>
                        <button className="flex-1 px-3 py-2 bg-[#D32F2F] text-white rounded-lg text-sm hover:bg-[#b71c1c] transition-colors flex items-center justify-center space-x-1">
                          <XCircle className="w-4 h-4" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Verification Checks */}
                  <h4 className="text-lg font-bold text-[#0B0F19] mb-4 flex items-center space-x-2 mt-6">
                    <AlertCircle className="w-5 h-5 text-[#1A73E8]" />
                    <span>Verification Checks</span>
                  </h4>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-[#0B0F19]">Background Check</p>
                        <p className="text-xs text-gray-500">Criminal & Credit History</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(request.backgroundCheck)}`}>
                        {request.backgroundCheck}
                      </span>
                    </div>

                    <div className="border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-[#0B0F19]">Skill Test</p>
                        <p className="text-xs text-gray-500">Category: {request.category}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(request.skillTest)}`}>
                        {request.skillTest}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4 pt-4 border-t border-gray-100">
                    <button className="flex-1 px-6 py-3 bg-[#00C853] text-white rounded-xl hover:bg-[#00a844] transition-colors font-semibold flex items-center justify-center space-x-2">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Approve All & Verify</span>
                    </button>
                    <button className="flex-1 px-6 py-3 bg-[#D32F2F] text-white rounded-xl hover:bg-[#b71c1c] transition-colors font-semibold flex items-center justify-center space-x-2">
                      <XCircle className="w-5 h-5" />
                      <span>Reject Application</span>
                    </button>
                    <button className="px-6 py-3 bg-[#FFAB00] text-white rounded-xl hover:bg-[#ff9100] transition-colors font-semibold flex items-center justify-center space-x-2">
                      <Upload className="w-5 h-5" />
                      <span>Request Re-upload</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
