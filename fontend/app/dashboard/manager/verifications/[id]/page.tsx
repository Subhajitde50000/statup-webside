'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield, ArrowLeft, CheckCircle, XCircle, Clock, AlertTriangle, 
  User, Store, Phone, Mail, MapPin, Building, FileText, Calendar,
  Loader2, Save, X, MessageSquare, AlertCircle as AlertIcon
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import TopNavbar from '../../components/TopNavbar';
import LeftSidebar from '../../components/LeftSidebar';
import { 
  getVerificationById, 
  updateVerification, 
  Verification,
  getStatusColor,
  getRiskScoreColor,
  formatVerificationType,
  formatStatus
} from '@/utils/verifications';

export default function VerificationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const verificationId = params.id as string;
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [verification, setVerification] = useState<Verification | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  
  // Edit form state
  const [editData, setEditData] = useState({
    status: '',
    risk_score: '',
    admin_notes: '',
    rejection_reason: ''
  });

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/auth');
      return;
    }
    
    fetchVerification();
  }, [verificationId]);

  const fetchVerification = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getVerificationById(verificationId);
      setVerification(data);
      setEditData({
        status: data.status,
        risk_score: data.risk_score,
        admin_notes: data.admin_notes || '',
        rejection_reason: data.rejection_reason || ''
      });
    } catch (err: any) {
      if (err.message?.includes('Not authenticated')) {
        router.push('/auth');
        return;
      }
      setError(err.message || 'Failed to fetch verification');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setSaving(true);
    setError('');
    try {
      const updated = await updateVerification(verificationId, {
        status: editData.status as any,
        risk_score: editData.risk_score as any,
        admin_notes: editData.admin_notes,
        rejection_reason: editData.rejection_reason
      });
      setVerification(updated);
      setEditMode(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update verification');
    } finally {
      setSaving(false);
    }
  };

  const handleQuickAction = async (action: 'approve' | 'reject' | 'more_info') => {
    setSaving(true);
    setError('');
    try {
      const statusMap = {
        approve: 'approved',
        reject: 'rejected',
        more_info: 'more_info_needed'
      };
      
      const updated = await updateVerification(verificationId, {
        status: statusMap[action] as any,
        admin_notes: editData.admin_notes || `Quick action: ${action}`,
        rejection_reason: action === 'reject' ? editData.rejection_reason : undefined
      });
      setVerification(updated);
    } catch (err: any) {
      setError(err.message || 'Failed to update verification');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#0AA06E]" />
      </div>
    );
  }

  if (error || !verification) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex items-center justify-center">
        <div className="text-center">
          <AlertIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error || 'Verification not found'}</p>
          <Link href="/dashboard/manager/verifications">
            <button className="px-4 py-2 bg-[#0AA06E] text-white rounded-lg hover:bg-[#098F5E]">
              Back to Verifications
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const isProfessional = verification.verification_type === 'professional';

  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      <TopNavbar />
      <div className="flex">
        <LeftSidebar isOpen={sidebarOpen} />
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
          <div className="p-8">
            <div className="max-w-[1200px] mx-auto">
              {/* Header */}
              <div className="mb-6">
                <Link href="/dashboard/manager/verifications" className="inline-flex items-center gap-2 text-[#64748B] hover:text-[#1E293B] mb-4">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Verifications
                </Link>
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-[#1E293B] flex items-center gap-3">
                      {isProfessional ? <User className="w-8 h-8 text-[#6B21A8]" /> : <Store className="w-8 h-8 text-[#9A3412]" />}
                      {isProfessional ? verification.name : verification.shop_name}
                    </h1>
                    <p className="text-sm text-[#64748B] mt-1">
                      {formatVerificationType(verification.verification_type)} Verification • ID: {verification.id?.slice(-8).toUpperCase() || 'N/A'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(verification.status)}`}>
                      {formatStatus(verification.status)}
                    </span>
                    <span className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${getRiskScoreColor(verification.risk_score || 'low')}`}>
                      {(verification.risk_score || 'low').toUpperCase()} RISK
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Contact Information */}
                  <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-[#1E293B] mb-4 flex items-center gap-2">
                      <User className="w-5 h-5 text-[#0AA06E]" />
                      Contact Information
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-[#64748B] uppercase tracking-wider">Full Name</label>
                        <p className="text-[#1E293B] font-medium mt-1">{verification.name}</p>
                      </div>
                      <div>
                        <label className="text-xs text-[#64748B] uppercase tracking-wider">Phone</label>
                        <p className="text-[#1E293B] font-medium mt-1 flex items-center gap-2">
                          <Phone className="w-4 h-4 text-[#64748B]" />
                          {verification.phone}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs text-[#64748B] uppercase tracking-wider">Email</label>
                        <p className="text-[#1E293B] font-medium mt-1 flex items-center gap-2">
                          <Mail className="w-4 h-4 text-[#64748B]" />
                          {verification.email || 'Not provided'}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs text-[#64748B] uppercase tracking-wider">Location</label>
                        <p className="text-[#1E293B] font-medium mt-1 flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#64748B]" />
                          {verification.city}, {verification.pincode}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Professional/Shop Specific Info */}
                  {isProfessional ? (
                    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-6">
                      <h2 className="text-lg font-semibold text-[#1E293B] mb-4 flex items-center gap-2">
                        <Building className="w-5 h-5 text-[#0AA06E]" />
                        Professional Details
                      </h2>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-[#64748B] uppercase tracking-wider">Profession</label>
                          <p className="text-[#1E293B] font-medium mt-1 capitalize">{verification.profession?.replace('_', ' ')}</p>
                        </div>
                        <div>
                          <label className="text-xs text-[#64748B] uppercase tracking-wider">Experience</label>
                          <p className="text-[#1E293B] font-medium mt-1">{verification.experience} years</p>
                        </div>
                        <div>
                          <label className="text-xs text-[#64748B] uppercase tracking-wider">Service Radius</label>
                          <p className="text-[#1E293B] font-medium mt-1">{verification.service_radius || '5'} km</p>
                        </div>
                        <div>
                          <label className="text-xs text-[#64748B] uppercase tracking-wider">Aadhaar Number</label>
                          <p className="text-[#1E293B] font-medium mt-1">{verification.aadhaar_number || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-6">
                      <h2 className="text-lg font-semibold text-[#1E293B] mb-4 flex items-center gap-2">
                        <Store className="w-5 h-5 text-[#0AA06E]" />
                        Shop Details
                      </h2>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <label className="text-xs text-[#64748B] uppercase tracking-wider">Shop Name</label>
                          <p className="text-[#1E293B] font-medium mt-1">{verification.shop_name}</p>
                        </div>
                        <div>
                          <label className="text-xs text-[#64748B] uppercase tracking-wider">Category</label>
                          <p className="text-[#1E293B] font-medium mt-1 capitalize">{verification.category?.replace('_', ' ')}</p>
                        </div>
                        <div>
                          <label className="text-xs text-[#64748B] uppercase tracking-wider">GST Status</label>
                          <p className="text-[#1E293B] font-medium mt-1">
                            {verification.has_gst ? (
                              <span className="text-green-600">✓ GST Registered</span>
                            ) : (
                              <span className="text-orange-600">✗ Not Registered</span>
                            )}
                          </p>
                        </div>
                        {verification.gst_number && (
                          <div className="col-span-2">
                            <label className="text-xs text-[#64748B] uppercase tracking-wider">GST Number</label>
                            <p className="text-[#1E293B] font-medium mt-1 font-mono">{verification.gst_number}</p>
                          </div>
                        )}
                        <div className="col-span-2">
                          <label className="text-xs text-[#64748B] uppercase tracking-wider">Shop Address</label>
                          <p className="text-[#1E293B] font-medium mt-1">{verification.shop_address}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Documents */}
                  <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-[#1E293B] mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-[#0AA06E]" />
                      Documents ({verification.documents_count || 0})
                    </h2>
                    {(!verification.documents || verification.documents.length === 0) ? (
                      <div className="text-center py-8 text-[#64748B]">
                        <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No documents uploaded</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-4">
                        {verification.documents.map((doc, index) => (
                          <div key={index} className="border border-[#E2E8F0] rounded-lg p-4">
                            <p className="font-medium text-[#1E293B]">{doc.document_name}</p>
                            <p className="text-sm text-[#64748B]">{doc.document_type}</p>
                            {doc.verified ? (
                              <span className="text-xs text-green-600">✓ Verified</span>
                            ) : (
                              <span className="text-xs text-orange-600">⏳ Pending</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Sidebar - Actions */}
                <div className="space-y-6">
                  {/* Quick Actions */}
                  {verification.status === 'pending' && (
                    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-6">
                      <h2 className="text-lg font-semibold text-[#1E293B] mb-4">Quick Actions</h2>
                      <div className="space-y-3">
                        <button
                          onClick={() => handleQuickAction('approve')}
                          disabled={saving}
                          className="w-full px-4 py-3 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-colors flex items-center justify-center gap-2 font-medium disabled:opacity-50"
                        >
                          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                          Approve
                        </button>
                        <button
                          onClick={() => handleQuickAction('reject')}
                          disabled={saving}
                          className="w-full px-4 py-3 bg-[#EF4444] text-white rounded-lg hover:bg-[#DC2626] transition-colors flex items-center justify-center gap-2 font-medium disabled:opacity-50"
                        >
                          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                          Reject
                        </button>
                        <button
                          onClick={() => handleQuickAction('more_info')}
                          disabled={saving}
                          className="w-full px-4 py-3 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors flex items-center justify-center gap-2 font-medium disabled:opacity-50"
                        >
                          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />}
                          Request More Info
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Edit Status */}
                  <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-[#1E293B]">Update Status</h2>
                      {!editMode && (
                        <button
                          onClick={() => setEditMode(true)}
                          className="text-sm text-[#0AA06E] hover:underline"
                        >
                          Edit
                        </button>
                      )}
                    </div>
                    
                    {editMode ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-[#64748B] mb-2">Status</label>
                          <select
                            value={editData.status}
                            onChange={(e) => setEditData({...editData, status: e.target.value})}
                            className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0AA06E]"
                          >
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                            <option value="more_info_needed">More Info Needed</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-[#64748B] mb-2">Risk Score</label>
                          <select
                            value={editData.risk_score}
                            onChange={(e) => setEditData({...editData, risk_score: e.target.value})}
                            className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0AA06E]"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-[#64748B] mb-2">Admin Notes</label>
                          <textarea
                            value={editData.admin_notes}
                            onChange={(e) => setEditData({...editData, admin_notes: e.target.value})}
                            rows={3}
                            className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0AA06E]"
                            placeholder="Add notes about this verification..."
                          />
                        </div>
                        
                        {editData.status === 'rejected' && (
                          <div>
                            <label className="block text-sm font-medium text-[#64748B] mb-2">Rejection Reason</label>
                            <textarea
                              value={editData.rejection_reason}
                              onChange={(e) => setEditData({...editData, rejection_reason: e.target.value})}
                              rows={2}
                              className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0AA06E]"
                              placeholder="Reason for rejection..."
                            />
                          </div>
                        )}
                        
                        {error && (
                          <p className="text-sm text-red-600">{error}</p>
                        )}
                        
                        <div className="flex gap-2">
                          <button
                            onClick={handleUpdate}
                            disabled={saving}
                            className="flex-1 px-4 py-2 bg-[#0AA06E] text-white rounded-lg hover:bg-[#098F5E] transition-colors flex items-center justify-center gap-2 text-sm font-medium disabled:opacity-50"
                          >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save
                          </button>
                          <button
                            onClick={() => setEditMode(false)}
                            disabled={saving}
                            className="px-4 py-2 border border-[#E2E8F0] rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-[#64748B] uppercase tracking-wider">Current Status</label>
                          <p className={`mt-1 inline-block px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(verification.status)}`}>
                            {formatStatus(verification.status)}
                          </p>
                        </div>
                        <div>
                          <label className="text-xs text-[#64748B] uppercase tracking-wider">Risk Score</label>
                          <p className={`mt-1 inline-block px-3 py-1 rounded-full text-sm font-bold border-2 ${getRiskScoreColor(verification.risk_score || 'low')}`}>
                            {(verification.risk_score || 'low').toUpperCase()}
                          </p>
                        </div>
                        {verification.admin_notes && (
                          <div>
                            <label className="text-xs text-[#64748B] uppercase tracking-wider">Admin Notes</label>
                            <p className="text-[#1E293B] mt-1 text-sm">{verification.admin_notes}</p>
                          </div>
                        )}
                        {verification.rejection_reason && (
                          <div>
                            <label className="text-xs text-[#64748B] uppercase tracking-wider">Rejection Reason</label>
                            <p className="text-red-600 mt-1 text-sm">{verification.rejection_reason}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Timeline */}
                  <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-[#1E293B] mb-4 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-[#0AA06E]" />
                      Timeline
                    </h2>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-[#0AA06E] rounded-full mt-2" />
                        <div>
                          <p className="text-sm font-medium text-[#1E293B]">Submitted</p>
                          <p className="text-xs text-[#64748B]">
                            {new Date(verification.submitted_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      {verification.reviewed_at && (
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-[#3B82F6] rounded-full mt-2" />
                          <div>
                            <p className="text-sm font-medium text-[#1E293B]">Reviewed</p>
                            <p className="text-xs text-[#64748B]">
                              {new Date(verification.reviewed_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-[#64748B] rounded-full mt-2" />
                        <div>
                          <p className="text-sm font-medium text-[#1E293B]">Last Updated</p>
                          <p className="text-xs text-[#64748B]">
                            {new Date(verification.updated_at).toLocaleString()}
                          </p>
                        </div>
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
