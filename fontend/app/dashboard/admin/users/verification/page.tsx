'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Download,
  FileText,
  MapPin,
  Camera,
  Smartphone,
  CheckCircle,
  XCircle,
  Clock,
  Upload,
  Eye,
  AlertTriangle,
  User,
  Calendar,
  Shield,
  RefreshCw,
  Plus,
  Bell,
  Settings as SettingsIcon,
  User as UserIcon
} from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';

interface VerificationDocument {
  type: 'id_proof' | 'address_proof' | 'selfie' | 'otp';
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  uploadedDate: string;
  documentName?: string;
  documentUrl?: string;
  rejectionReason?: string;
  verifiedBy?: string;
  verifiedDate?: string;
}

interface PendingVerificationUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  submittedDate: string;
  documents: VerificationDocument[];
  kycStatus: 'incomplete' | 'pending_review' | 'under_review' | 'verified' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  completionPercentage: number;
  lastActivity: string;
  accountAge: string;
  bookingsCount: number;
}

export default function VerificationPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUser, setSelectedUser] = useState<PendingVerificationUser | null>(null);
  const [showDocumentModal, setShowDocumentModal] = useState(false);

  // Mock verification users data
  const verificationUsers: PendingVerificationUser[] = [
    {
      id: 'V001',
      name: 'Anita Deshmukh',
      email: 'anita.deshmukh@email.com',
      phone: '+91 98765 43210',
      avatar: 'AD',
      submittedDate: '2024-01-22',
      kycStatus: 'pending_review',
      priority: 'high',
      completionPercentage: 100,
      lastActivity: '2024-01-22',
      accountAge: '2 days',
      bookingsCount: 0,
      documents: [
        {
          type: 'id_proof',
          status: 'pending',
          uploadedDate: '2024-01-22',
          documentName: 'aadhaar_card.pdf',
          documentUrl: '/docs/aadhaar_card.pdf'
        },
        {
          type: 'address_proof',
          status: 'pending',
          uploadedDate: '2024-01-22',
          documentName: 'electricity_bill.pdf',
          documentUrl: '/docs/electricity_bill.pdf'
        },
        {
          type: 'selfie',
          status: 'pending',
          uploadedDate: '2024-01-22',
          documentName: 'selfie_verification.jpg',
          documentUrl: '/docs/selfie.jpg'
        },
        {
          type: 'otp',
          status: 'approved',
          uploadedDate: '2024-01-22',
          verifiedBy: 'System Auto',
          verifiedDate: '2024-01-22'
        }
      ]
    },
    {
      id: 'V002',
      name: 'Karan Mehta',
      email: 'karan.mehta@email.com',
      phone: '+91 98765 43211',
      avatar: 'KM',
      submittedDate: '2024-01-20',
      kycStatus: 'under_review',
      priority: 'medium',
      completionPercentage: 75,
      lastActivity: '2024-01-21',
      accountAge: '4 days',
      bookingsCount: 1,
      documents: [
        {
          type: 'id_proof',
          status: 'approved',
          uploadedDate: '2024-01-20',
          documentName: 'pan_card.pdf',
          verifiedBy: 'Admin Kumar',
          verifiedDate: '2024-01-21'
        },
        {
          type: 'address_proof',
          status: 'pending',
          uploadedDate: '2024-01-20',
          documentName: 'rent_agreement.pdf'
        },
        {
          type: 'selfie',
          status: 'rejected',
          uploadedDate: '2024-01-20',
          documentName: 'selfie_blurry.jpg',
          rejectionReason: 'Image too blurry, please upload a clearer photo'
        },
        {
          type: 'otp',
          status: 'approved',
          uploadedDate: '2024-01-20',
          verifiedBy: 'System Auto',
          verifiedDate: '2024-01-20'
        }
      ]
    },
    {
      id: 'V003',
      name: 'Divya Nair',
      email: 'divya.nair@email.com',
      phone: '+91 98765 43212',
      avatar: 'DN',
      submittedDate: '2024-01-23',
      kycStatus: 'incomplete',
      priority: 'low',
      completionPercentage: 25,
      lastActivity: '2024-01-23',
      accountAge: '1 day',
      bookingsCount: 0,
      documents: [
        {
          type: 'id_proof',
          status: 'pending',
          uploadedDate: '2024-01-23',
          documentName: 'driving_license.pdf'
        },
        {
          type: 'address_proof',
          status: 'pending',
          uploadedDate: '2024-01-23'
        },
        {
          type: 'selfie',
          status: 'pending',
          uploadedDate: '2024-01-23'
        },
        {
          type: 'otp',
          status: 'pending',
          uploadedDate: '2024-01-23'
        }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'approved': return 'text-green-600 bg-green-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      case 'expired': return 'text-gray-600 bg-gray-50';
      default: return 'text-blue-600 bg-blue-50';
    }
  };

  const getKycStatusColor = (status: string) => {
    switch (status) {
      case 'incomplete': return 'text-orange-600 bg-orange-50';
      case 'pending_review': return 'text-blue-600 bg-blue-50';
      case 'under_review': return 'text-purple-600 bg-purple-50';
      case 'verified': return 'text-green-600 bg-green-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'id_proof': return <FileText className="w-5 h-5" />;
      case 'address_proof': return <MapPin className="w-5 h-5" />;
      case 'selfie': return <Camera className="w-5 h-5" />;
      case 'otp': return <Smartphone className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getDocumentLabel = (type: string) => {
    switch (type) {
      case 'id_proof': return 'ID Proof';
      case 'address_proof': return 'Address Proof';
      case 'selfie': return 'Selfie Verification';
      case 'otp': return 'OTP Verification';
      default: return type;
    }
  };

  return (
    <div className="flex h-screen bg-[#F5F7FA] overflow-hidden">
      {/* Admin Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-72 flex flex-col overflow-hidden">
        {/* Top Navigation Bar */}
        <div className="bg-white border-b border-gray-200 flex-shrink-0 z-20">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.back()}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-xl font-bold text-[#0B0F19]">KYC Verification</h1>
                  <p className="text-xs text-gray-600">Review verification documents</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <SettingsIcon className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                  <div className="w-9 h-9 bg-gradient-to-br from-[#10B981] to-[#10B981]/80 rounded-lg flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Admin User</p>
                    <p className="text-xs text-gray-500">Super Admin</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Header */}
        <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-[#0B0F19]">KYC Verification</h1>
                <p className="text-sm text-gray-600 mt-1">Review and approve user verification documents</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Pending Review</p>
            <p className="text-3xl font-bold text-[#0B0F19]">310</p>
            <p className="text-xs text-blue-600 mt-2">Awaiting verification</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-50 rounded-lg">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Under Review</p>
            <p className="text-3xl font-bold text-[#0B0F19]">89</p>
            <p className="text-xs text-purple-600 mt-2">Being processed</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Verified Today</p>
            <p className="text-3xl font-bold text-[#0B0F19]">127</p>
            <p className="text-xs text-green-600 mt-2">↑ 15% from yesterday</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-50 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Rejected</p>
            <p className="text-3xl font-bold text-[#0B0F19]">43</p>
            <p className="text-xs text-red-600 mt-2">Need reupload</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl border border-gray-200 mb-6">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A73E8] focus:border-transparent"
                />
              </div>

              {/* Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
            </div>

            {/* Filter Dropdowns */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">KYC Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A73E8] focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="incomplete">Incomplete</option>
                    <option value="pending_review">Pending Review</option>
                    <option value="under_review">Under Review</option>
                    <option value="verified">Verified</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A73E8] focus:border-transparent"
                  >
                    <option value="all">All Priorities</option>
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Verification List */}
        <div className="space-y-4">
          {verificationUsers.map((user) => (
            <div key={user.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  {/* User Info */}
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#1A73E8] to-[#4285F4] rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      {user.avatar}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-xs text-gray-500">{user.phone}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-xs text-gray-500">ID: {user.id}</span>
                        <span className="text-xs text-gray-500">Account: {user.accountAge}</span>
                        <span className="text-xs text-gray-500">Bookings: {user.bookingsCount}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getKycStatusColor(user.kycStatus)}`}>
                      {user.kycStatus.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(user.priority)}`}>
                      {user.priority.toUpperCase()} PRIORITY
                    </span>
                    <span className="text-xs text-gray-500">
                      Submitted {new Date(user.submittedDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Verification Progress</span>
                    <span className="text-sm font-semibold text-[#1A73E8]">{user.completionPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-[#1A73E8] to-[#4285F4] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${user.completionPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Documents Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {user.documents.map((doc, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2 text-gray-700">
                          {getDocumentIcon(doc.type)}
                          <span className="text-sm font-medium">{getDocumentLabel(doc.type)}</span>
                        </div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                          {doc.status}
                        </span>
                      </div>
                      
                      {doc.documentName && (
                        <p className="text-xs text-gray-600 mb-2 truncate">{doc.documentName}</p>
                      )}
                      
                      <p className="text-xs text-gray-500 mb-3">
                        {new Date(doc.uploadedDate).toLocaleDateString()}
                      </p>

                      {doc.rejectionReason && (
                        <div className="bg-red-50 border border-red-200 rounded p-2 mb-3">
                          <p className="text-xs text-red-700">{doc.rejectionReason}</p>
                        </div>
                      )}

                      {doc.status === 'pending' && doc.documentUrl && (
                        <div className="flex items-center space-x-2">
                          <button className="flex-1 px-3 py-1.5 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors flex items-center justify-center space-x-1">
                            <CheckCircle className="w-3 h-3" />
                            <span>Approve</span>
                          </button>
                          <button className="flex-1 px-3 py-1.5 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors flex items-center justify-center space-x-1">
                            <XCircle className="w-3 h-3" />
                            <span>Reject</span>
                          </button>
                        </div>
                      )}

                      {doc.status === 'rejected' && (
                        <button className="w-full px-3 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1">
                          <Upload className="w-3 h-3" />
                          <span>Request Re-upload</span>
                        </button>
                      )}

                      {doc.verifiedBy && (
                        <p className="text-xs text-green-600 mt-2">
                          Verified by {doc.verifiedBy}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
                    <Eye className="w-4 h-4" />
                    <span>View Documents</span>
                  </button>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2">
                    <XCircle className="w-4 h-4" />
                    <span>Reject All</span>
                  </button>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Approve All</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-6 bg-white rounded-xl border border-gray-200 px-6 py-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing <span className="font-medium">1-3</span> of <span className="font-medium">310</span> pending verifications
          </p>
          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              Previous
            </button>
            <button className="px-4 py-2 bg-[#1A73E8] text-white rounded-lg text-sm hover:bg-[#1557B0] transition-colors">
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
