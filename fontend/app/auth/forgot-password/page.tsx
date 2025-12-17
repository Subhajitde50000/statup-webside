'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Phone, ArrowLeft, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { forgotPassword, APIError } from '@/utils/auth';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [resetMethod, setResetMethod] = useState<'email' | 'phone'>('email');
  const [identifier, setIdentifier] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim()) {
      setError(`Please enter your ${resetMethod}`);
      return;
    }

    setIsLoading(true);

    try {
      await forgotPassword(identifier, resetMethod);
      setSuccess(true);
      
      // Redirect to reset password page with identifier
      setTimeout(() => {
        router.push(`/auth/reset-password?identifier=${encodeURIComponent(identifier)}&method=${resetMethod}`);
      }, 2000);
    } catch (err) {
      if (err instanceof APIError) {
        setError(err.message);
      } else {
        setError('Failed to send OTP. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F4F7FB] via-white to-[#E8F4F8] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 max-w-md w-full text-center">
          <div className="bg-green-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">OTP Sent!</h2>
          <p className="text-gray-600 mb-4">
            We've sent a verification code to your {resetMethod}. 
            Redirecting to reset password page...
          </p>
          <Loader2 className="w-6 h-6 text-[#0057D9] animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4F7FB] via-white to-[#E8F4F8] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 max-w-md w-full">
        {/* Back Button */}
        <Link 
          href="/auth" 
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">Forgot Password</h1>
        <p className="text-gray-600 mb-8">
          Enter your email or phone number and we'll send you a verification code.
        </p>

        {/* Method Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => {
              setResetMethod('email');
              setIdentifier('');
              setError('');
            }}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
              resetMethod === 'email'
                ? 'bg-blue-50 text-[#0057D9] border-2 border-[#0057D9]'
                : 'bg-gray-50 text-gray-600 border-2 border-transparent'
            }`}
          >
            <Mail className="w-4 h-4" />
            Email
          </button>
          <button
            onClick={() => {
              setResetMethod('phone');
              setIdentifier('');
              setError('');
            }}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
              resetMethod === 'phone'
                ? 'bg-blue-50 text-[#0057D9] border-2 border-[#0057D9]'
                : 'bg-gray-50 text-gray-600 border-2 border-transparent'
            }`}
          >
            <Phone className="w-4 h-4" />
            Phone
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {resetMethod === 'email' ? 'Email Address' : 'Phone Number'}{' '}
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              {resetMethod === 'email' ? (
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              ) : (
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              )}
              <input
                type={resetMethod === 'email' ? 'email' : 'tel'}
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  setError('');
                }}
                className={`w-full pl-11 pr-4 py-3 text-gray-900 border-2 rounded-xl focus:ring-2 focus:ring-[#0057D9] focus:border-transparent outline-none transition-all ${
                  error ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder={resetMethod === 'email' ? 'john@example.com' : '+91 9876543210'}
              />
            </div>
            {error && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#0057D9] to-[#0048B8] text-white py-3.5 rounded-xl font-bold text-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sending OTP...
              </>
            ) : (
              'Send Verification Code'
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Remember your password?{' '}
          <Link href="/auth" className="text-[#0057D9] font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
