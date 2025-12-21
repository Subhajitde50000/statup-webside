'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Clock, CheckCircle2, XCircle, AlertCircle, ArrowLeft, 
  RefreshCw, FileText, Phone, Mail, MapPin, Edit, Lock, Eye, EyeOff
} from 'lucide-react';
import Link from 'next/link';

interface VerificationData {
  id: string;
  verification_type: string;
  status: string;
  risk_score: string;
  name: string;
  phone: string;
  email?: string;
  city?: string;
  submitted_at: string;
  reviewed_by?: string;
  reviewed_at?: string;
  manager_notes?: string;
}

export default function VerificationStatusPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const phone = searchParams.get('phone');
  const [verification, setVerification] = useState<VerificationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Password setup state
  const [showPasswordSetup, setShowPasswordSetup] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [settingPassword, setSettingPassword] = useState(false);
  const [passwordSet, setPasswordSet] = useState(false);

  useEffect(() => {
    if (phone) {
      fetchVerificationStatus();
    } else {
      setError('No phone number provided');
      setLoading(false);
    }
  }, [phone]);

  const fetchVerificationStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8000/api/verifications/status/${phone}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch verification status');
      }
      
      const data = await response.json();
      setVerification(data);
      
      // If approved, show password setup form
      if (data.status === 'approved') {
        setShowPasswordSetup(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load verification status');
    } finally {
      setLoading(false);
    }
  };

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    
    // Validation
    if (!password || password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }
    
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    try {
      setSettingPassword(true);
      const response = await fetch('http://localhost:8000/api/auth/set-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: phone,
          password: password,
          confirm_password: confirmPassword,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to set password');
      }
      
      const data = await response.json();
      setPasswordSet(true);
      setShowPasswordSetup(false);
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'Failed to set password');
    } finally {
      setSettingPassword(false);
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
          message: 'Congratulations! Your registration has been approved. You can now log in to your account.'
        };
      case 'rejected':
        return {
          icon: XCircle,
          color: 'text-red-600',
          bg: 'bg-red-50',
          border: 'border-red-200',
          title: 'Rejected',
          message: 'Unfortunately, your registration was not approved. Please contact support for more information.'
        };
      case 'more_info_needed':
        return {
          icon: AlertCircle,
          color: 'text-orange-600',
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          title: 'More Information Required',
          message: 'Please update your registration with the requested information.'
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
          <p className="text-gray-600">Loading verification status...</p>
        </div>
      </div>
    );
  }

  if (error || !verification) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'No verification found for this phone number.'}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(verification.status);
  const StatusIcon = statusConfig.icon;
  const verificationType = verification.verification_type === 'professional' ? 'Professional' : 'Shop';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href={`/register/${verificationType.toLowerCase()}`}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
          <button
            onClick={fetchVerificationStatus}
            className="inline-flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
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
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="font-medium text-gray-900">{verificationType}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900">{verification.phone}</p>
                </div>
              </div>

              {verification.email && (
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{verification.email}</p>
                  </div>
                </div>
              )}

              {verification.city && (
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">City</p>
                    <p className="font-medium text-gray-900">{verification.city}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Submitted</p>
                  <p className="font-medium text-gray-900">
                    {new Date(verification.submitted_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Risk Score</p>
                  <p className="font-medium text-gray-900 capitalize">{verification.risk_score}</p>
                </div>
              </div>
            </div>

            {/* Manager Notes */}
            {verification.manager_notes && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-2">Manager's Notes</h3>
                <p className="text-gray-700">{verification.manager_notes}</p>
              </div>
            )}

            {/* Edit Mode Banner */}
            {verification.status === 'more_info_needed' && (
              <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Action Required</h3>
                    <p className="text-sm text-gray-700 mb-3">
                      The manager has requested additional information. Click "Update Registration" below to review and update your details. All your previous information will be pre-filled for your convenience.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              {verification.status === 'more_info_needed' && (
                <button
                  onClick={() => router.push(`/register/${verification.verification_type}?edit=${verification.id}`)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition-colors"
                >
                  <Edit className="w-5 h-5" />
                  Update Registration
                </button>
              )}
              
              {verification.status === 'approved' && !showPasswordSetup && !passwordSet && (
                <button
                  onClick={() => setShowPasswordSetup(true)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors"
                >
                  <Lock className="w-5 h-5" />
                  Set Password
                </button>
              )}
              
              {verification.status === 'approved' && passwordSet && (
                <Link
                  href={`/${verification.verification_type === 'professional' ? 'professional' : 'shopkeeper'}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Go to Dashboard
                </Link>
              )}
            </div>

            {/* Password Setup Form */}
            {verification.status === 'approved' && showPasswordSetup && !passwordSet && (
              <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-start gap-3 mb-4">
                  <Lock className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Set Your Password</h3>
                    <p className="text-sm text-gray-700">
                      Your account has been approved! Please set a password to access your dashboard.
                    </p>
                  </div>
                </div>
                
                <form onSubmit={handleSetPassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password (min 6 characters)"
                        className="w-full px-4 py-3 pr-12 text-gray-700 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your password"
                        className="w-full px-4 py-3 pr-12 text-gray-700 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  
                  {passwordError && (
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{passwordError}</span>
                    </div>
                  )}
                  
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowPasswordSetup(false)}
                      className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={settingPassword}
                      className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {settingPassword ? 'Setting Password...' : 'Set Password'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Application Timeline</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div className="w-0.5 bg-gray-200 flex-1 my-2"></div>
              </div>
              <div className="flex-1 pb-6">
                <h3 className="font-semibold text-gray-900">Application Submitted</h3>
                <p className="text-sm text-gray-500">
                  {new Date(verification.submitted_at).toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            {verification.reviewed_at && (
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 ${statusConfig.bg} rounded-full flex items-center justify-center`}>
                    <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{statusConfig.title}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(verification.reviewed_at).toLocaleString('en-IN')}
                  </p>
                  {verification.reviewed_by && (
                    <p className="text-sm text-gray-500">By: {verification.reviewed_by}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
