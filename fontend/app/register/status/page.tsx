'use client';

import React, { useState, useEffect } from 'react';
import { 
  Clock, CheckCircle2, XCircle, AlertCircle, ArrowLeft, RefreshCw, 
  Phone, FileText, LogIn
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

interface RegistrationData {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: string;
  approval_status: string;
  approval_data?: Record<string, any>;
  admin_notes?: string;
  rejection_reason?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  submitted_at: string;
  is_active: boolean;
}

export default function VerificationStatusPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const phone = searchParams.get('phone');
  const [registration, setRegistration] = useState<RegistrationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (phone) {
      fetchRegistrationStatus();
    } else {
      setError('No phone number provided');
      setLoading(false);
    }
  }, [phone]);

  const fetchRegistrationStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8000/api/verifications/status/${phone}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch registration status');
      }
      
      const data = await response.json();
      setRegistration(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load registration status');
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          icon: Clock,
          color: 'text-yellow-600',
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          title: 'Under Review',
          message: 'Your registration is being reviewed by our team. This usually takes 24-48 hours.'
        };
      case 'approved':
        return {
          icon: CheckCircle2,
          color: 'text-green-600',
          bg: 'bg-green-50',
          border: 'border-green-200',
          title: 'Approved!',
          message: 'Congratulations! Your registration has been approved. You can now log in to your dashboard.'
        };
      case 'rejected':
        return {
          icon: XCircle,
          color: 'text-red-600',
          bg: 'bg-red-50',
          border: 'border-red-200',
          title: 'Rejected',
          message: 'Unfortunately, your registration was not approved. Please see the reason below or contact support.'
        };
      case 'more_info_needed':
        return {
          icon: AlertCircle,
          color: 'text-orange-600',
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          title: 'More Information Required',
          message: 'Please provide additional information to complete your registration.'
        };
      default:
        return {
          icon: Clock,
          color: 'text-gray-600',
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          title: 'Processing',
          message: 'Your registration is being processed.'
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading registration status...</p>
        </div>
      </div>
    );
  }

  if (error || !registration) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'No registration found for this phone number.'}</p>
          <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
            <ArrowLeft className="w-5 h-5" /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(registration.approval_status);
  const StatusIcon = statusConfig.icon;
  const registrationType = registration.role === 'professional' ? 'Professional' : 'Shop';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-2xl mx-auto py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium">
            <ArrowLeft className="w-5 h-5" /> Back to Home
          </Link>
          <button onClick={fetchRegistrationStatus} className="inline-flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 font-medium">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className={`${statusConfig.bg} ${statusConfig.border} border-b p-6`}>
            <div className="flex items-start gap-4">
              <div className={`w-16 h-16 ${statusConfig.bg} rounded-xl flex items-center justify-center ring-4 ring-white`}>
                <StatusIcon className={`w-8 h-8 ${statusConfig.color}`} />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">{statusConfig.title}</h1>
                <p className="text-gray-600">{statusConfig.message}</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Registration Details</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Registration Type</p>
                  <p className="font-medium text-gray-900">{registrationType}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900">{registration.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium text-gray-900">{registration.name}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Submitted</p>
                  <p className="font-medium text-gray-900">
                    {new Date(registration.submitted_at).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Admin Notes */}
            {registration.admin_notes && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <h3 className="font-medium text-blue-800 mb-1">Notes from Team</h3>
                <p className="text-blue-700">{registration.admin_notes}</p>
              </div>
            )}

            {/* Rejection Reason */}
            {registration.rejection_reason && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <h3 className="font-medium text-red-800 mb-1">Rejection Reason</h3>
                <p className="text-red-700">{registration.rejection_reason}</p>
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              {registration.approval_status === 'approved' && (
                <Link href="/auth" className="flex-1 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                  <LogIn className="w-5 h-5" /> Login to Dashboard
                </Link>
              )}
              
              {registration.approval_status === 'pending' && (
                <div className="flex-1 py-3 bg-gray-100 text-gray-600 font-medium rounded-xl text-center">
                  Please wait for approval...
                </div>
              )}

              {registration.approval_status === 'rejected' && (
                <Link href={`/register/${registrationType.toLowerCase()}`} className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                  Register Again
                </Link>
              )}

              {registration.approval_status === 'more_info_needed' && (
                <Link href={`/register/${registrationType.toLowerCase()}?edit=${registration.id}`} className="flex-1 py-3 bg-orange-600 text-white font-semibold rounded-xl hover:bg-orange-700 transition-colors flex items-center justify-center gap-2">
                  Update Information
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Application Timeline</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Application Submitted</p>
                <p className="text-sm text-gray-500">
                  {new Date(registration.submitted_at).toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            {registration.reviewed_at && (
              <div className="flex gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  registration.approval_status === 'approved' ? 'bg-green-100' : 
                  registration.approval_status === 'rejected' ? 'bg-red-100' : 'bg-orange-100'
                }`}>
                  {registration.approval_status === 'approved' ? 
                    <CheckCircle2 className="w-4 h-4 text-green-600" /> :
                    registration.approval_status === 'rejected' ?
                    <XCircle className="w-4 h-4 text-red-600" /> :
                    <AlertCircle className="w-4 h-4 text-orange-600" />
                  }
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {registration.approval_status === 'approved' ? 'Application Approved' :
                     registration.approval_status === 'rejected' ? 'Application Rejected' :
                     'More Information Requested'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(registration.reviewed_at).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
