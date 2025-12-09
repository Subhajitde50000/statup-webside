'use client';

import React, { useState } from 'react';
import { 
  ArrowLeft, AlertTriangle, User, Phone, Mail, MapPin, Package, 
  Image as ImageIcon, FileText, Clock, CheckCircle, XCircle, Shield,
  UserCheck, AlertOctagon, DollarSign, MessageSquare, Lock
} from 'lucide-react';
import Link from 'next/link';
import TopNavbar from '../../../components/TopNavbar';
import LeftSidebar from '../../../components/LeftSidebar';

export default function ComplaintDetailsPage({ params }: { params: { id: string } }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [internalNote, setInternalNote] = useState('');

  const complaint = {
    complaintId: 'CMP20241210001',
    status: 'Pending',
    priority: 'High',
    raisedBy: { name: 'Rajesh Kumar', type: 'Customer', phone: '+91 98765 43210', email: 'rajesh@email.com' },
    against: { name: 'Quick Repairs', type: 'Professional', phone: '+91 98765 11111', email: 'quick@repairs.com' },
    orderId: 'ORD12345',
    category: 'Service Quality',
    subCategory: 'Late Arrival',
    description: 'The professional arrived 2 hours late for the scheduled appointment. I had to wait without any prior notification. This caused significant inconvenience as I had to cancel my other plans.',
    hasEvidence: true,
    evidenceCount: 3,
    source: 'Customer App',
    previousWarnings: 2,
    raisedOn: '2024-12-10 10:30 AM',
  };

  const orderSummary = {
    serviceCategory: 'AC Repair',
    scheduledDate: '2024-12-10',
    scheduledTime: '10:00 AM',
    actualArrival: '12:15 PM',
    price: 1500,
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
  };

  const timeline = [
    { time: '10:30 AM', event: 'Complaint filed by customer', type: 'info', user: 'Rajesh Kumar' },
    { time: '10:35 AM', event: 'Automatic notification sent to professional', type: 'info', user: 'System' },
    { time: '11:00 AM', event: 'Professional response received', type: 'info', user: 'Quick Repairs' },
    { time: '11:20 AM', event: 'Admin started review', type: 'pending', user: 'Admin' },
  ];

  const internalNotes = [
    { time: '11:25 AM', note: 'Verified GPS logs - professional was at previous location', user: 'Agent Riya', date: '2024-12-10' },
    { time: '11:30 AM', note: 'Checked professional history - 2 previous warnings for same issue', user: 'Agent Riya', date: '2024-12-10' },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      <TopNavbar />
      <div className="flex">
        <LeftSidebar isOpen={sidebarOpen} />
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
          <div className="p-8">
            <div className="max-w-[1600px] mx-auto">
              {/* Back Button */}
              <Link href="/dashboard/manager/complaints/all">
                <button className="flex items-center gap-2 text-[#64748B] hover:text-[#10B981] mb-6 transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm font-medium">Back to Complaints</span>
                </button>
              </Link>

              {/* Header */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 mb-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-2xl font-semibold text-[#1E293B]">Complaint Details</h1>
                      <span className={`px-3 py-1 rounded-full text-sm font-bold border-2 ${
                        complaint.priority === 'Critical' ? 'bg-[#FEE2E2] text-[#991B1B] border-[#EF4444]' :
                        complaint.priority === 'High' ? 'bg-[#FED7AA] text-[#9A3412] border-[#F59E0B]' :
                        complaint.priority === 'Medium' ? 'bg-[#FEF3C7] text-[#92400E] border-[#F59E0B]' :
                        'bg-[#D1FAE5] text-[#065F46] border-[#10B981]'
                      }`}>
                        {complaint.priority} Priority
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        complaint.status === 'Resolved' ? 'bg-[#D1FAE5] text-[#065F46]' :
                        complaint.status === 'Pending' ? 'bg-[#FEF3C7] text-[#92400E]' :
                        complaint.status === 'Under Review' ? 'bg-[#DBEAFE] text-[#1E40AF]' :
                        'bg-[#FEE2E2] text-[#991B1B]'
                      }`}>
                        {complaint.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-[#64748B]">
                      <span className="font-mono text-[#10B981] font-medium">{complaint.complaintId}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Raised on {complaint.raisedOn}
                      </span>
                      <span>•</span>
                      <Link href={`/dashboard/manager/orders/${complaint.orderId}`}>
                        <span className="text-[#10B981] hover:underline cursor-pointer">Order: {complaint.orderId}</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Main Details */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Complaint Information */}
                  <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-[#1E293B] mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-[#10B981]" />
                      Complaint Information
                    </h2>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-[#64748B] mb-1">Category</p>
                          <p className="text-sm font-medium text-[#1E293B]">{complaint.category}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#64748B] mb-1">Sub-category</p>
                          <p className="text-sm font-medium text-[#1E293B]">{complaint.subCategory}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#64748B] mb-1">Source</p>
                          <p className="text-sm font-medium text-[#1E293B]">{complaint.source}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#64748B] mb-1">Previous Warnings</p>
                          <p className="text-sm font-bold text-[#EF4444]">{complaint.previousWarnings} warnings</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-[#64748B] mb-2">Detailed Description</p>
                        <div className="p-4 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                          <p className="text-sm text-[#1E293B] leading-relaxed">{complaint.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-[#1E293B] mb-4 flex items-center gap-2">
                      <Package className="w-5 h-5 text-[#10B981]" />
                      Related Order Summary
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-[#64748B] mb-1">Service Category</p>
                        <p className="text-sm font-medium text-[#1E293B]">{orderSummary.serviceCategory}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[#64748B] mb-1">Scheduled Date & Time</p>
                        <p className="text-sm font-medium text-[#1E293B]">{orderSummary.scheduledDate} at {orderSummary.scheduledTime}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[#64748B] mb-1">Actual Arrival</p>
                        <p className="text-sm font-bold text-[#EF4444]">{orderSummary.actualArrival} (2h 15m late)</p>
                      </div>
                      <div>
                        <p className="text-sm text-[#64748B] mb-1">Price</p>
                        <p className="text-sm font-bold text-[#1E293B]">₹{orderSummary.price.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[#64748B] mb-1">Payment Method</p>
                        <p className="text-sm font-medium text-[#1E293B]">{orderSummary.paymentMethod}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[#64748B] mb-1">Payment Status</p>
                        <span className="inline-block px-3 py-1 bg-[#D1FAE5] text-[#065F46] rounded-full text-xs font-medium">
                          {orderSummary.paymentStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Evidence Section */}
                  <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-[#1E293B] mb-4 flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-[#10B981]" />
                      Evidence & Attachments
                    </h2>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="aspect-square bg-[#F8FAFC] rounded-lg border-2 border-dashed border-[#E2E8F0] flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-[#64748B]" />
                      </div>
                      <div className="aspect-square bg-[#F8FAFC] rounded-lg border-2 border-dashed border-[#E2E8F0] flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-[#64748B]" />
                      </div>
                      <div className="aspect-square bg-[#F8FAFC] rounded-lg border-2 border-dashed border-[#E2E8F0] flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-[#64748B]" />
                      </div>
                    </div>
                    <p className="text-sm text-[#64748B] mt-4">{complaint.evidenceCount} photos uploaded • Screenshots, Chat history available</p>
                  </div>

                  {/* Admin Action Panel */}
                  <div className="bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] rounded-xl border border-[#3B82F6]/20 p-6">
                    <h2 className="text-lg font-semibold text-[#1E293B] mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-[#3B82F6]" />
                      Admin Actions
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <button className="px-4 py-2 bg-white border border-[#3B82F6] text-[#3B82F6] rounded-lg hover:bg-[#3B82F6] hover:text-white transition-all text-sm font-medium flex items-center justify-center gap-2">
                        <UserCheck className="w-4 h-4" />
                        Assign Agent
                      </button>
                      <button className="px-4 py-2 bg-white border border-[#F59E0B] text-[#F59E0B] rounded-lg hover:bg-[#F59E0B] hover:text-white transition-all text-sm font-medium flex items-center justify-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Change Priority
                      </button>
                      <button className="px-4 py-2 bg-white border border-[#8B5CF6] text-[#8B5CF6] rounded-lg hover:bg-[#8B5CF6] hover:text-white transition-all text-sm font-medium flex items-center justify-center gap-2">
                        <Clock className="w-4 h-4" />
                        Under Review
                      </button>
                      <button className="px-4 py-2 bg-white border border-[#64748B] text-[#64748B] rounded-lg hover:bg-[#64748B] hover:text-white transition-all text-sm font-medium flex items-center justify-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Ask More Info
                      </button>
                      <button className="px-4 py-2 bg-white border border-[#EF4444] text-[#EF4444] rounded-lg hover:bg-[#EF4444] hover:text-white transition-all text-sm font-medium flex items-center justify-center gap-2">
                        <AlertOctagon className="w-4 h-4" />
                        Send Warning
                      </button>
                      <button className="px-4 py-2 bg-white border border-[#64748B] text-[#64748B] rounded-lg hover:bg-[#64748B] hover:text-white transition-all text-sm font-medium flex items-center justify-center gap-2">
                        <Lock className="w-4 h-4" />
                        Suspend User
                      </button>
                      <button className="px-4 py-2 bg-white border border-[#10B981] text-[#10B981] rounded-lg hover:bg-[#10B981] hover:text-white transition-all text-sm font-medium flex items-center justify-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Issue Refund
                      </button>
                      <button className="px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-all text-sm font-medium flex items-center justify-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Resolve
                      </button>
                      <button className="px-4 py-2 bg-[#EF4444] text-white rounded-lg hover:bg-[#DC2626] transition-all text-sm font-medium flex items-center justify-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Escalate
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Column - User Details & Timeline */}
                <div className="space-y-6">
                  {/* Raised By */}
                  <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-[#1E293B] mb-4 flex items-center gap-2">
                      <User className="w-5 h-5 text-[#10B981]" />
                      Raised By
                    </h2>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-[#64748B] mb-1">Name</p>
                        <p className="text-sm font-medium text-[#1E293B]">{complaint.raisedBy.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#64748B] mb-1">Type</p>
                        <span className="inline-block px-2 py-1 bg-[#DBEAFE] text-[#1E40AF] rounded text-xs font-medium">
                          {complaint.raisedBy.type}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-[#64748B] mb-1">Phone</p>
                        <a href={`tel:${complaint.raisedBy.phone}`} className="text-sm text-[#10B981] hover:underline flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {complaint.raisedBy.phone}
                        </a>
                      </div>
                      <div>
                        <p className="text-xs text-[#64748B] mb-1">Email</p>
                        <a href={`mailto:${complaint.raisedBy.email}`} className="text-sm text-[#10B981] hover:underline flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {complaint.raisedBy.email}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Against */}
                  <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-[#1E293B] mb-4 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-[#EF4444]" />
                      Against
                    </h2>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-[#64748B] mb-1">Name</p>
                        <p className="text-sm font-medium text-[#1E293B]">{complaint.against.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#64748B] mb-1">Type</p>
                        <span className="inline-block px-2 py-1 bg-[#E9D5FF] text-[#6B21A8] rounded text-xs font-medium">
                          {complaint.against.type}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-[#64748B] mb-1">Phone</p>
                        <a href={`tel:${complaint.against.phone}`} className="text-sm text-[#10B981] hover:underline flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {complaint.against.phone}
                        </a>
                      </div>
                      <div>
                        <p className="text-xs text-[#64748B] mb-1">Previous Warnings</p>
                        <p className="text-sm font-bold text-[#EF4444]">{complaint.previousWarnings} times</p>
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-[#1E293B] mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-[#10B981]" />
                      Timeline
                    </h2>
                    <div className="space-y-3">
                      {timeline.map((item, index) => (
                        <div key={index} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className={`w-2 h-2 rounded-full ${
                              item.type === 'info' ? 'bg-[#10B981]' : 
                              item.type === 'pending' ? 'bg-[#F59E0B]' : 'bg-[#64748B]'
                            }`} />
                            {index < timeline.length - 1 && (
                              <div className="w-0.5 h-8 bg-[#E2E8F0]" />
                            )}
                          </div>
                          <div className="flex-1 pb-4">
                            <p className="text-xs text-[#64748B] mb-1">{item.time}</p>
                            <p className="text-sm text-[#1E293B]">{item.event}</p>
                            <p className="text-xs text-[#64748B] mt-1">by {item.user}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Internal Notes */}
                  <div className="bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] rounded-xl border border-[#F59E0B]/20 p-6">
                    <h2 className="text-lg font-semibold text-[#1E293B] mb-4">Internal Notes (Admin Only)</h2>
                    <div className="space-y-3 mb-4">
                      {internalNotes.map((note, index) => (
                        <div key={index} className="p-3 bg-white rounded-lg">
                          <p className="text-sm text-[#1E293B] mb-2">{note.note}</p>
                          <div className="flex items-center justify-between text-xs text-[#64748B]">
                            <span>{note.user}</span>
                            <span>{note.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <textarea
                      value={internalNote}
                      onChange={(e) => setInternalNote(e.target.value)}
                      placeholder="Add internal note..."
                      className="w-full p-3 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] resize-none"
                      rows={3}
                    />
                    <button className="mt-3 w-full px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-colors text-sm font-medium">
                      Add Note
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
