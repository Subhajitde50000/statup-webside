'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { handleOAuthCallback, getCurrentUser, saveAuthData } from '@/utils/auth';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function GoogleCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing Google login...');

  useEffect(() => {
    const processCallback = async () => {
      try {
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        const error = searchParams.get('error');

        if (error) {
          setStatus('error');
          setMessage('Google login was cancelled or failed');
          return;
        }

        if (!accessToken || !refreshToken) {
          setStatus('error');
          setMessage('Invalid callback parameters');
          return;
        }

        // Store tokens
        handleOAuthCallback(accessToken, refreshToken);

        // Get user info
        const user = await getCurrentUser();
        saveAuthData(accessToken, refreshToken, user);

        setStatus('success');
        setMessage('Login successful! Redirecting...');

        // Redirect to home or dashboard
        setTimeout(() => {
          router.push('/');
        }, 1500);

      } catch (error) {
        console.error('Google callback error:', error);
        setStatus('error');
        setMessage('Failed to complete login. Please try again.');
      }
    };

    processCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4F7FB] via-white to-[#E8F4F8] flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center">
        {status === 'loading' && (
          <>
            <div className="bg-gradient-to-r from-[#0057D9] to-[#0048B8] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Connecting with Google
            </h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="bg-green-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Welcome!
            </h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="bg-red-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Login Failed
            </h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <button
              onClick={() => router.push('/auth')}
              className="bg-gradient-to-r from-[#0057D9] to-[#0048B8] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
}
