'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Store, Phone, Mail, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function ShopLoginPage() {
  const router = useRouter();
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpSent, setOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async () => {
    if (!identifier) {
      setError(`Please enter your ${loginMethod}`);
      return;
    }

    setIsSendingOtp(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/api/auth/login/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier,
          login_method: loginMethod
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to send OTP');
      }

      setOtpSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter complete OTP');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/api/auth/login/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier,
          otp: otpString,
          login_method: loginMethod
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Invalid OTP');
      }

      const data = await response.json();
      
      // Store tokens
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      
      // Redirect to status page with their phone number
      const phone = loginMethod === 'phone' ? identifier : data.user.phone;
      router.push(`/register/status?phone=${encodeURIComponent(phone)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify OTP');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Store className="w-8 h-8 text-[#0057D9]" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Check Registration Status</h1>
          <p className="text-gray-600">Enter your registered phone or email to view your application status</p>
        </div>

        {!otpSent ? (
          // Identifier Input
          <div className="space-y-6">
            {/* Login Method Tabs */}
            <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
              <button
                onClick={() => setLoginMethod('phone')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
                  loginMethod === 'phone'
                    ? 'bg-white text-[#0057D9] shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Phone className="w-4 h-4" />
                Phone
              </button>
              <button
                onClick={() => setLoginMethod('email')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
                  loginMethod === 'email'
                    ? 'bg-white text-[#0057D9] shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Mail className="w-4 h-4" />
                Email
              </button>
            </div>

            {/* Input Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {loginMethod === 'phone' ? 'Phone Number' : 'Email Address'}
              </label>
              <input
                type={loginMethod === 'phone' ? 'tel' : 'email'}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={loginMethod === 'phone' ? '+91XXXXXXXXXX' : 'your.email@example.com'}
                className="w-full px-4 py-3 text-gray-700 border-2 border-gray-200 rounded-xl focus:border-[#0057D9] focus:outline-none transition-colors"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              onClick={handleSendOtp}
              disabled={isSendingOtp}
              className="w-full bg-[#0057D9] text-white py-3 rounded-xl font-semibold hover:bg-[#0046B0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSendingOtp ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending OTP...
                </>
              ) : (
                'Send OTP'
              )}
            </button>
          </div>
        ) : (
          // OTP Input
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                Enter 6-digit OTP sent to {identifier}
              </label>
              <div className="flex gap-2 justify-center mb-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-200 rounded-xl focus:border-[#0057D9] focus:outline-none transition-colors"
                  />
                ))}
              </div>
              <button
                onClick={() => setOtpSent(false)}
                className="text-sm text-[#0057D9] hover:underline"
              >
                Change {loginMethod}
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              onClick={handleVerifyOtp}
              disabled={isVerifying}
              className="w-full bg-[#0057D9] text-white py-3 rounded-xl font-semibold hover:bg-[#0046B0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify & Continue'
              )}
            </button>

            <button
              onClick={handleSendOtp}
              disabled={isSendingOtp}
              className="w-full text-gray-600 hover:text-gray-900 font-medium"
            >
              Resend OTP
            </button>
          </div>
        )}

        {/* Back Link */}
        <Link
          href="/"
          className="mt-6 flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Register Link */}
        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            Haven't registered yet?{' '}
            <Link href="/register/shop" className="text-[#0057D9] hover:underline font-medium">
              Register as Shop Partner
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
