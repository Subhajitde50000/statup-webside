'use client';

import React, { useState } from 'react';
import { 
  ArrowLeft, Shield, CheckCircle, XCircle, AlertTriangle, Clock, 
  User, Phone, Mail, MapPin, Calendar, Star, Download, Eye, ZoomIn,
  FileText, Upload, MessageSquare, AlertOctagon, Award, Video, PhoneCall,
  Edit2, Package, Save, Send, Paperclip
} from 'lucide-react';
import Link from 'next/link';
import TopNavbar from '../../components/TopNavbar';
import LeftSidebar from '../../components/LeftSidebar';

export default function VerificationPage({ params }: { params: { id: string } }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [moreInfoText, setMoreInfoText] = useState('');
  const [chatMessage, setChatMessage] = useState('');

  // Mock data
  const user = {
    id: 'PRO12345',
    type: 'Professional', // or 'Shop'
    verificationStatus: 'Pending',
    name: 'Rajesh Kumar Singh',
    phone: '+91 98765 43210',
    email: 'rajesh.kumar@email.com',
    category: 'Electrician',
    subCategory: 'Residential Electrician',
    address: '123, MG Road, Sector 15, Noida, UP - 201301',
    registrationDate: '2024-12-05',
    profilePhoto: '/placeholder-user.jpg',
    ratings: 4.5,
    reviewsCount: 0,
    riskScore: 'Low',
    dob: '1990-05-15',
    alternativePhone: '+91 98765 43211',
    emergencyContact: '+91 98765 43212',
    serviceRadius: '10 km',
  };

  const documents = [
    {
      id: 'doc1',
      name: 'Government ID (Aadhaar)',
      category: 'mandatory',
      status: 'Pending',
      uploadedOn: '2024-12-05 10:02 AM',
      fileType: 'image',
      aiVerified: true,
      aiWarnings: [],
      extractedText: 'Name: RAJESH KUMAR SINGH\nAadhaar: **** **** 1234\nDOB: 15/05/1990',
    },
    {
      id: 'doc2',
      name: 'Address Proof',
      category: 'mandatory',
      status: 'Pending',
      uploadedOn: '2024-12-05 10:05 AM',
      fileType: 'image',
      aiVerified: true,
      aiWarnings: ['Address mismatch detected'],
      extractedText: 'Address: 123, MG Road, Sector 15, Noida',
    },
    {
      id: 'doc3',
      name: 'Qualification Certificate',
      category: 'mandatory',
      status: 'Pending',
      uploadedOn: '2024-12-05 10:08 AM',
      fileType: 'pdf',
      aiVerified: false,
      aiWarnings: [],
      extractedText: 'ITI Electrician Certificate - 2015',
    },
    {
      id: 'doc4',
      name: 'Profile Photo',
      category: 'mandatory',
      status: 'Verified',
      uploadedOn: '2024-12-05 10:10 AM',
      fileType: 'image',
      aiVerified: true,
      aiWarnings: [],
      extractedText: 'Face detected - Quality: Good',
    },
    {
      id: 'doc5',
      name: 'Bank Passbook',
      category: 'optional',
      status: 'Pending',
      uploadedOn: '2024-12-05 10:12 AM',
      fileType: 'image',
      aiVerified: true,
      aiWarnings: [],
      extractedText: 'Account Number: ****1234\nIFSC: SBIN0001234',
    },
  ];

  const timeline = [
    { time: '10:02 AM', event: 'Documents uploaded by user', user: 'Rajesh Kumar', type: 'info' },
    { time: '10:05 AM', event: 'Auto AI Check completed', user: 'System', type: 'success' },
    { time: '10:15 AM', event: 'Admin started review', user: 'Admin Riya', type: 'info' },
    { time: '10:17 AM', event: 'Requested clearer ID photo', user: 'Admin Riya', type: 'warning' },
    { time: '11:00 AM', event: 'User re-uploaded document', user: 'Rajesh Kumar', type: 'info' },
  ];

  const fraudAlerts = [
    { severity: 'Low', message: 'Profile photo quality acceptable', action: 'No action needed' },
    { severity: 'Medium', message: 'Address proof shows slight mismatch', action: 'Verify manually' },
  ];

  const chatHistory = [
    { time: '10:17 AM', sender: 'Admin', message: 'Please upload a clearer photo of your Aadhaar card.' },
    { time: '10:45 AM', sender: 'User', message: 'I have uploaded a new photo. Please check.' },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      <TopNavbar />
      <div className="flex">
        <LeftSidebar isOpen={sidebarOpen} />
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
          <div className="p-8">
            <div className="max-w-[1800px] mx-auto">
              {/* Back Button */}
              <Link href="/dashboard/manager/verifications">
                <button className="flex items-center gap-2 text-[#64748B] hover:text-[#0AA06E] mb-6 transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm font-medium">Back to Verification List</span>
                </button>
              </Link>

              {/* Page Header */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 mb-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-[#1E293B] mb-2">
                      Verification Center: {user.name}
                    </h1>
                    <div className="flex items-center gap-4">
                      <span className="px-3 py-1 bg-[#E9D5FF] text-[#6B21A8] rounded-full text-sm font-medium">
                        {user.type}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                        user.verificationStatus === 'Approved' ? 'bg-[#D1FAE5] text-[#065F46]' :
                        user.verificationStatus === 'Rejected' ? 'bg-[#FEE2E2] text-[#991B1B]' :
                        user.verificationStatus === 'Pending' ? 'bg-[#FEF3C7] text-[#92400E]' :
                        'bg-[#DBEAFE] text-[#1E40AF]'
                      }`}>
                        {user.verificationStatus}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${
                        user.riskScore === 'High' ? 'bg-[#FEE2E2] text-[#991B1B] border-[#EF4444]' :
                        user.riskScore === 'Medium' ? 'bg-[#FED7AA] text-[#9A3412] border-[#F59E0B]' :
                        'bg-[#D1FAE5] text-[#065F46] border-[#10B981]'
                      }`}>
                        Risk Score: {user.riskScore}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Left Column - Main Content */}
                <div className="xl:col-span-2 space-y-6">
                  {/* User Summary Card */}
                  <div className="bg-white rounded-xl border-l-4 border-[#0AA06E] p-6 shadow-lg">
                    <div className="flex items-start gap-6">
                      <div className="w-24 h-24 bg-[#F8FAFC] rounded-xl flex items-center justify-center border-2 border-[#E2E8F0]">
                        <User className="w-12 h-12 text-[#64748B]" />
                      </div>
                      <div className="flex-1">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-[#64748B] mb-1">Full Name</p>
                            <p className="text-sm font-bold text-[#1E293B]">{user.name}</p>
                          </div>
                          <div>
                            <p className="text-xs text-[#64748B] mb-1">Category</p>
                            <p className="text-sm font-bold text-[#1E293B]">{user.category}</p>
                          </div>
                          <div>
                            <p className="text-xs text-[#64748B] mb-1">Phone Number</p>
                            <a href={`tel:${user.phone}`} className="text-sm text-[#0AA06E] hover:underline flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {user.phone}
                            </a>
                          </div>
                          <div>
                            <p className="text-xs text-[#64748B] mb-1">Email</p>
                            <a href={`mailto:${user.email}`} className="text-sm text-[#0AA06E] hover:underline flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {user.email}
                            </a>
                          </div>
                          <div>
                            <p className="text-xs text-[#64748B] mb-1">Registration Date</p>
                            <p className="text-sm font-medium text-[#1E293B] flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {user.registrationDate}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-[#64748B] mb-1">Ratings</p>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" />
                              <span className="text-sm font-bold text-[#1E293B]">{user.ratings}</span>
                              <span className="text-xs text-[#64748B]">({user.reviewsCount} reviews)</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4">
                          <p className="text-xs text-[#64748B] mb-1">Address</p>
                          <p className="text-sm text-[#1E293B] flex items-start gap-1">
                            <MapPin className="w-4 h-4 text-[#0AA06E] flex-shrink-0 mt-0.5" />
                            {user.address}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Documents Section */}
                  <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-bold text-[#1E293B] flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[#0AA06E]" />
                        Documents Verification
                      </h2>
                      <button className="px-4 py-2 bg-[#0AA06E] text-white rounded-lg hover:bg-[#098F5E] transition-colors flex items-center gap-2 text-sm font-medium">
                        <Download className="w-4 h-4" />
                        Download All
                      </button>
                    </div>

                    <div className="space-y-4">
                      {documents.map((doc) => (
                        <div key={doc.id} className="border border-[#E2E8F0] rounded-xl p-5 hover:shadow-md transition-shadow">
                          {/* Header Row */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-base font-bold text-[#1E293B]">{doc.name}</h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                  doc.status === 'Verified' ? 'bg-[#D1FAE5] text-[#065F46]' :
                                  doc.status === 'Rejected' ? 'bg-[#FEE2E2] text-[#991B1B]' :
                                  doc.status === 'Expired' ? 'bg-[#FED7AA] text-[#9A3412]' :
                                  'bg-[#FED7AA] text-[#9A3412]'
                                }`}>
                                  {doc.status}
                                </span>
                                {doc.category === 'mandatory' && (
                                  <span className="px-2 py-1 bg-[#FEE2E2] text-[#991B1B] rounded text-xs font-bold">
                                    MANDATORY
                                  </span>
                                )}
                                {doc.aiVerified && (
                                  <span className="px-2 py-1 bg-[#DBEAFE] text-[#1E40AF] rounded text-xs font-bold flex items-center gap-1">
                                    <Shield className="w-3 h-3" />
                                    AI Verified
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-[#64748B]">Uploaded: {doc.uploadedOn}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Preview Box */}
                            <div className="md:col-span-1">
                              <div className="aspect-video bg-[#F8FAFC] rounded-lg border-2 border-dashed border-[#E2E8F0] flex items-center justify-center relative group">
                                {doc.fileType === 'image' ? (
                                  <div className="text-center">
                                    <FileText className="w-12 h-12 text-[#64748B] mx-auto mb-2" />
                                    <p className="text-xs text-[#64748B]">Image Document</p>
                                  </div>
                                ) : (
                                  <div className="text-center">
                                    <Package className="w-12 h-12 text-[#64748B] mx-auto mb-2" />
                                    <p className="text-xs text-[#64748B]">PDF Document</p>
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                                  <button className="p-2 bg-white rounded-lg hover:bg-[#F8FAFC] transition-colors">
                                    <Eye className="w-5 h-5 text-[#1E293B]" />
                                  </button>
                                  <button className="p-2 bg-white rounded-lg hover:bg-[#F8FAFC] transition-colors">
                                    <ZoomIn className="w-5 h-5 text-[#1E293B]" />
                                  </button>
                                  <button className="p-2 bg-white rounded-lg hover:bg-[#F8FAFC] transition-colors">
                                    <Download className="w-5 h-5 text-[#1E293B]" />
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* AI Auto-Check Box */}
                            <div className="md:col-span-1">
                              <div className="p-4 bg-[#F0FDF4] border border-[#10B981]/20 rounded-lg">
                                <h4 className="text-xs font-bold text-[#065F46] mb-2 flex items-center gap-1">
                                  <Shield className="w-4 h-4" />
                                  AI Analysis
                                </h4>
                                {doc.aiWarnings.length > 0 ? (
                                  <div className="space-y-2">
                                    {doc.aiWarnings.map((warning, idx) => (
                                      <div key={idx} className="flex items-start gap-2 p-2 bg-[#FEF3C7] rounded">
                                        <AlertTriangle className="w-4 h-4 text-[#F59E0B] flex-shrink-0 mt-0.5" />
                                        <p className="text-xs text-[#92400E]">{warning}</p>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-xs text-[#065F46]">✓ No issues detected</p>
                                )}
                                <div className="mt-3 p-2 bg-white rounded border border-[#E2E8F0]">
                                  <p className="text-xs text-[#64748B] font-mono whitespace-pre-wrap">{doc.extractedText}</p>
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="md:col-span-1">
                              <div className="space-y-2">
                                <button className="w-full px-4 py-2 bg-[#D1FAE5] text-[#065F46] rounded-lg hover:bg-[#10B981] hover:text-white transition-all text-sm font-medium flex items-center justify-center gap-2">
                                  <CheckCircle className="w-4 h-4" />
                                  Approve
                                </button>
                                <button className="w-full px-4 py-2 bg-[#FEE2E2] text-[#991B1B] rounded-lg hover:bg-[#EF4444] hover:text-white transition-all text-sm font-medium flex items-center justify-center gap-2">
                                  <XCircle className="w-4 h-4" />
                                  Reject
                                </button>
                                <button className="w-full px-4 py-2 bg-[#FED7AA] text-[#9A3412] rounded-lg hover:bg-[#F59E0B] hover:text-white transition-all text-sm font-medium flex items-center justify-center gap-2">
                                  <Upload className="w-4 h-4" />
                                  Request Re-upload
                                </button>
                                <button className="w-full px-4 py-2 bg-[#DBEAFE] text-[#1E40AF] rounded-lg hover:bg-[#3B82F6] hover:text-white transition-all text-sm font-medium flex items-center justify-center gap-2">
                                  <MessageSquare className="w-4 h-4" />
                                  Chat
                                </button>
                                <button className="w-full px-4 py-2 bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] rounded-lg hover:bg-[#E2E8F0] transition-all text-sm font-medium flex items-center justify-center gap-2">
                                  <FileText className="w-4 h-4" />
                                  Add Notes
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* KYC Information Section */}
                  <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-bold text-[#1E293B] flex items-center gap-2">
                        <Shield className="w-5 h-5 text-[#0AA06E]" />
                        KYC Information
                      </h2>
                      <div className="flex gap-2">
                        <button className="px-4 py-2 bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] rounded-lg hover:bg-[#E2E8F0] transition-colors flex items-center gap-2 text-sm font-medium">
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </button>
                        <button className="px-4 py-2 bg-[#0AA06E] text-white rounded-lg hover:bg-[#098F5E] transition-colors flex items-center gap-2 text-sm font-medium">
                          <Download className="w-4 h-4" />
                          Download KYC
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      <div>
                        <p className="text-xs text-[#64748B] mb-1">Full Legal Name</p>
                        <p className="text-sm font-bold text-[#1E293B]">{user.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#64748B] mb-1">Date of Birth</p>
                        <p className="text-sm font-medium text-[#1E293B]">{user.dob}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#64748B] mb-1">Alternative Phone</p>
                        <p className="text-sm font-medium text-[#1E293B]">{user.alternativePhone}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#64748B] mb-1">Emergency Contact</p>
                        <p className="text-sm font-medium text-[#1E293B]">{user.emergencyContact}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#64748B] mb-1">Service Radius</p>
                        <p className="text-sm font-medium text-[#1E293B]">{user.serviceRadius}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#64748B] mb-1">Sub-Category</p>
                        <p className="text-sm font-medium text-[#1E293B]">{user.subCategory}</p>
                      </div>
                    </div>
                    <div className="mt-4 p-4 bg-[#F0FDF4] border border-[#10B981]/20 rounded-lg">
                      <p className="text-xs font-bold text-[#065F46] mb-1">✓ Name Comparison</p>
                      <p className="text-xs text-[#064E3B]">Document name matches registration name</p>
                    </div>
                  </div>

                  {/* Verification Timeline */}
                  <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-[#1E293B] mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-[#0AA06E]" />
                      Verification Timeline
                    </h2>
                    <div className="space-y-3">
                      {timeline.map((item, index) => (
                        <div key={index} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className={`w-3 h-3 rounded-full ${
                              item.type === 'success' ? 'bg-[#10B981]' :
                              item.type === 'warning' ? 'bg-[#F59E0B]' :
                              'bg-[#3B82F6]'
                            }`} />
                            {index < timeline.length - 1 && (
                              <div className="w-0.5 h-12 bg-[#E2E8F0]" />
                            )}
                          </div>
                          <div className="flex-1 pb-4">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-medium text-[#1E293B]">{item.event}</p>
                              <span className="text-xs text-[#64748B]">{item.time}</span>
                            </div>
                            <p className="text-xs text-[#64748B]">by {item.user}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column - Decision Panel & Alerts */}
                <div className="space-y-6">
                  {/* Verification Decision Panel */}
                  <div className="bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] rounded-xl border-2 border-[#3B82F6] p-6 shadow-lg">
                    <h2 className="text-lg font-bold text-[#1E293B] mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-[#3B82F6]" />
                      Verification Decision
                    </h2>
                    <div className="space-y-3">
                      <button className="w-full px-6 py-4 bg-gradient-to-r from-[#10B981] to-[#059669] text-white rounded-xl hover:shadow-lg transition-all text-base font-bold flex items-center justify-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Approve User
                      </button>
                      <button className="w-full px-6 py-4 bg-gradient-to-r from-[#EF4444] to-[#DC2626] text-white rounded-xl hover:shadow-lg transition-all text-base font-bold flex items-center justify-center gap-2">
                        <XCircle className="w-5 h-5" />
                        Reject User
                      </button>
                      <button className="w-full px-6 py-4 bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white rounded-xl hover:shadow-lg transition-all text-base font-bold flex items-center justify-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        Request More Info
                      </button>
                      <button className="w-full px-6 py-4 bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white rounded-xl hover:shadow-lg transition-all text-base font-bold flex items-center justify-center gap-2">
                        <AlertOctagon className="w-5 h-5" />
                        Escalate to Senior Team
                      </button>
                    </div>

                    {/* Request More Info Form */}
                    <div className="mt-4 p-4 bg-white rounded-lg">
                      <label className="text-xs font-bold text-[#64748B] mb-2 block">Quick Message Template:</label>
                      <textarea
                        value={moreInfoText}
                        onChange={(e) => setMoreInfoText(e.target.value)}
                        placeholder="Please upload a clearer image of your ID..."
                        className="w-full p-3 border border-[#E2E8F0] rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#0AA06E]"
                        rows={3}
                      />
                      <button className="mt-2 w-full px-4 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors text-sm font-medium">
                        Send Request
                      </button>
                    </div>
                  </div>

                  {/* Fraud Detection Alerts */}
                  <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-[#1E293B] mb-4 flex items-center gap-2">
                      <AlertOctagon className="w-5 h-5 text-[#EF4444]" />
                      Fraud Detection Alerts
                    </h2>
                    <div className="space-y-3">
                      {fraudAlerts.map((alert, index) => (
                        <div key={index} className={`p-4 rounded-lg border-l-4 ${
                          alert.severity === 'High' ? 'bg-[#FEE2E2] border-[#EF4444]' :
                          alert.severity === 'Medium' ? 'bg-[#FEF3C7] border-[#F59E0B]' :
                          'bg-[#F0FDF4] border-[#10B981]'
                        }`}>
                          <div className="flex items-start justify-between mb-2">
                            <span className={`text-xs font-bold ${
                              alert.severity === 'High' ? 'text-[#991B1B]' :
                              alert.severity === 'Medium' ? 'text-[#92400E]' :
                              'text-[#065F46]'
                            }`}>
                              {alert.severity} Risk
                            </span>
                          </div>
                          <p className="text-sm font-medium text-[#1E293B] mb-2">{alert.message}</p>
                          <p className="text-xs text-[#64748B] mb-2">Action: {alert.action}</p>
                          <button className="text-xs text-[#3B82F6] hover:underline font-medium">
                            View Evidence →
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Additional Actions */}
                  <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-[#1E293B] mb-4">Additional Actions</h2>
                    <div className="space-y-2">
                      <button className="w-full px-4 py-3 bg-[#F0FDF4] text-[#065F46] border border-[#10B981]/20 rounded-lg hover:bg-[#10B981] hover:text-white transition-all text-sm font-medium flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        Mark as Skill Verified
                      </button>
                      <button className="w-full px-4 py-3 bg-[#EFF6FF] text-[#1E40AF] border border-[#3B82F6]/20 rounded-lg hover:bg-[#3B82F6] hover:text-white transition-all text-sm font-medium flex items-center gap-2">
                        <PhoneCall className="w-4 h-4" />
                        Schedule Phone Verification
                      </button>
                      <button className="w-full px-4 py-3 bg-[#EFF6FF] text-[#1E40AF] border border-[#3B82F6]/20 rounded-lg hover:bg-[#3B82F6] hover:text-white transition-all text-sm font-medium flex items-center gap-2">
                        <Video className="w-4 h-4" />
                        Schedule Video Call
                      </button>
                      <button className="w-full px-4 py-3 bg-[#FEF2F2] text-[#991B1B] border border-[#EF4444]/20 rounded-lg hover:bg-[#EF4444] hover:text-white transition-all text-sm font-medium flex items-center gap-2">
                        <AlertOctagon className="w-4 h-4" />
                        Add to High-Risk List
                      </button>
                    </div>
                  </div>

                  {/* Chat & Support Section */}
                  <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-[#1E293B] mb-4 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-[#0AA06E]" />
                      Chat with User
                    </h2>
                    <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                      {chatHistory.map((chat, index) => (
                        <div key={index} className={`p-3 rounded-lg ${
                          chat.sender === 'Admin' ? 'bg-[#EFF6FF] ml-4' : 'bg-[#F8FAFC] mr-4'
                        }`}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-[#1E293B]">{chat.sender}</span>
                            <span className="text-xs text-[#64748B]">{chat.time}</span>
                          </div>
                          <p className="text-sm text-[#1E293B]">{chat.message}</p>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <div className="flex gap-2 flex-wrap">
                        <button className="px-3 py-1 bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] rounded-lg hover:bg-[#E2E8F0] text-xs">
                          "Please upload clearer ID"
                        </button>
                        <button className="px-3 py-1 bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] rounded-lg hover:bg-[#E2E8F0] text-xs">
                          "Need address proof"
                        </button>
                        <button className="px-3 py-1 bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] rounded-lg hover:bg-[#E2E8F0] text-xs">
                          "Document approved"
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={chatMessage}
                          onChange={(e) => setChatMessage(e.target.value)}
                          placeholder="Type your message..."
                          className="flex-1 px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0AA06E]"
                        />
                        <button className="p-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg hover:bg-[#E2E8F0] transition-colors">
                          <Paperclip className="w-5 h-5 text-[#64748B]" />
                        </button>
                        <button className="px-4 py-2 bg-[#0AA06E] text-white rounded-lg hover:bg-[#098F5E] transition-colors flex items-center gap-2">
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
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
