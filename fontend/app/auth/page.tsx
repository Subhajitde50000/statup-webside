'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Mail, Phone, Lock, User, Eye, EyeOff, CheckCircle, AlertCircle,
  Loader2, ArrowRight, Shield, Zap, Star, Chrome, Facebook,
  Apple, MessageSquare, X
} from 'lucide-react';
import {
  signup,
  verifySignup,
  login,
  sendLoginOTP,
  verifyLoginOTP,
  getGoogleAuthUrl,
  getFacebookAuthUrl,
  APIError
} from '@/utils/auth';

export default function AuthPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('phone');
  const [verifyMethod, setVerifyMethod] = useState<'email' | 'phone'>('phone');
  const [showPassword, setShowPassword] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpPurpose, setOtpPurpose] = useState<'login' | 'signup'>('login');
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const [errors, setErrors] = useState<any>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: '' }));
    }
  };

  const handleOTPChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOTP = [...otp];
      newOTP[index] = value;
      setOtp(newOTP);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleOTPKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const validateLogin = () => {
    const newErrors: any = {};

    if (loginMethod === 'email') {
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
    } else {
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) newErrors.phone = 'Invalid phone number';
    }

    if (!showOTP && !formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSignup = () => {
    const newErrors: any = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) newErrors.phone = 'Invalid phone number';
    
    if (!showOTP) {
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 6) newErrors.password = 'Password must be 6+ characters';
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOTP = async () => {
    if (activeTab === 'login') {
      if (!validateLogin()) return;
      
      setIsLoading(true);
      setErrors({});
      
      try {
        const identifier = loginMethod === 'email' ? formData.email : formData.phone;
        await sendLoginOTP(identifier, loginMethod);
        setShowOTP(true);
        setOtpPurpose('login');
        setSuccessMessage('OTP sent successfully!');
      } catch (err) {
        if (err instanceof APIError) {
          setErrors({ general: err.message });
        } else {
          setErrors({ general: 'Failed to send OTP. Please try again.' });
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      if (!validateSignup()) return;
      
      setIsLoading(true);
      setErrors({});
      
      try {
        await signup({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        });
        setShowOTP(true);
        setOtpPurpose('signup');
        setSuccessMessage('OTP sent to your phone and email!');
      } catch (err) {
        if (err instanceof APIError) {
          setErrors({ general: err.message });
        } else {
          setErrors({ general: 'Failed to signup. Please try again.' });
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.join('').length !== 6) {
      setErrors({ otp: 'Please enter complete OTP' });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const otpCode = otp.join('');
      
      if (otpPurpose === 'signup') {
        // For signup, user can choose to verify with email or phone
        const identifier = verifyMethod === 'email' ? formData.email : formData.phone;
        await verifySignup({
          identifier,
          otp_code: otpCode,
          purpose: 'signup'
        });
      } else {
        const identifier = loginMethod === 'email' ? formData.email : formData.phone;
        await verifyLoginOTP({
          identifier,
          otp_code: otpCode,
          purpose: 'login'
        });
      }
      
      // Redirect to home
      router.push('/');
    } catch (err) {
      if (err instanceof APIError) {
        setErrors({ otp: err.message });
      } else {
        setErrors({ otp: 'Invalid OTP. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (showOTP) {
      handleVerifyOTP();
      return;
    }

    if (activeTab === 'login') {
      if (!validateLogin()) return;
      
      setIsLoading(true);
      setErrors({});
      
      try {
        const identifier = loginMethod === 'email' ? formData.email : formData.phone;
        await login({
          identifier,
          password: formData.password,
          login_method: loginMethod
        });
        router.push('/');
      } catch (err) {
        if (err instanceof APIError) {
          setErrors({ general: err.message });
        } else {
          setErrors({ general: 'Login failed. Please try again.' });
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      // For signup, always send OTP first
      handleSendOTP();
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const authUrl = await getGoogleAuthUrl();
      window.location.href = authUrl;
    } catch (err) {
      setErrors({ general: 'Google login not available. Please try another method.' });
    }
  };

  const handleFacebookLogin = async () => {
    try {
      const authUrl = await getFacebookAuthUrl();
      window.location.href = authUrl;
    } catch (err) {
      setErrors({ general: 'Facebook login not available. Please try another method.' });
    }
  };

  const socialLogins = [
    { name: 'Google', icon: Chrome, color: 'hover:bg-red-50 hover:border-red-500', onClick: handleGoogleLogin },
    { name: 'Facebook', icon: Facebook, color: 'hover:bg-blue-50 hover:border-blue-500', onClick: handleFacebookLogin },
    { name: 'Apple', icon: Apple, color: 'hover:bg-gray-50 hover:border-gray-700', onClick: () => {} }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4F7FB] via-white to-[#E8F4F8] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex flex-col justify-center p-12">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0057D9] to-[#0048B8] text-white px-4 py-2 rounded-full mb-4">
              <Star className="w-4 h-4" />
              <span className="text-sm font-semibold">Trusted by 10M+ Users</span>
            </div>
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              Welcome to <span className="text-[#0057D9]">Electronics</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Your one-stop solution for all electronics needs. Shop, repair, and services all in one place.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: Zap, title: 'Fast Delivery', desc: 'Get your orders delivered within 24 hours' },
              { icon: Shield, title: 'Secure Payments', desc: '100% secure and encrypted transactions' },
              { icon: Star, title: 'Best Quality', desc: 'Original products with warranty' }
            ].map((feature, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="bg-gradient-to-r from-[#0057D9] to-[#0048B8] p-3 rounded-lg">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-500">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-100">
            {/* Tabs */}
            <div className="flex gap-2 mb-8 bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => {
                  setActiveTab('login');
                  setShowOTP(false);
                  setErrors({});
                  setSuccessMessage('');
                }}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === 'login'
                    ? 'bg-gradient-to-r from-[#0057D9] to-[#0048B8] text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => {
                  setActiveTab('signup');
                  setShowOTP(false);
                  setErrors({});
                  setSuccessMessage('');
                }}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === 'signup'
                    ? 'bg-gradient-to-r from-[#0057D9] to-[#0048B8] text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Success Message */}
            {successMessage && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
                <CheckCircle className="w-5 h-5" />
                {successMessage}
              </div>
            )}

            {/* Error Message */}
            {errors.general && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                <AlertCircle className="w-5 h-5" />
                {errors.general}
              </div>
            )}

            {!showOTP ? (
              <>
                {/* Social Login */}
                <div className="mb-6">
                  <div className="grid grid-cols-3 gap-3">
                    {socialLogins.map((social) => (
                      <button
                        key={social.name}
                        onClick={social.onClick}
                        className={`flex items-center justify-center gap-2 p-3 border-2 border-gray-200 rounded-lg transition-all ${social.color}`}
                      >
                        <social.icon className="w-5 h-5" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">or continue with</span>
                  </div>
                </div>

                {/* Login Method Toggle (Login Only) */}
                {activeTab === 'login' && (
                  <div className="flex gap-2 mb-6">
                    <button
                      onClick={() => setLoginMethod('phone')}
                      className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                        loginMethod === 'phone'
                          ? 'bg-blue-50 text-[#0057D9] border-2 border-[#0057D9]'
                          : 'bg-gray-50 text-gray-600 border-2 border-transparent'
                      }`}
                    >
                      <Phone className="w-4 h-4" />
                      Phone
                    </button>
                    <button
                      onClick={() => setLoginMethod('email')}
                      className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                        loginMethod === 'email'
                          ? 'bg-blue-50 text-[#0057D9] border-2 border-[#0057D9]'
                          : 'bg-gray-50 text-gray-600 border-2 border-transparent'
                      }`}
                    >
                      <Mail className="w-4 h-4" />
                      Email
                    </button>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Signup Fields */}
                  {activeTab === 'signup' && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`w-full pl-11 pr-4 py-3 text-gray-900 border-2 rounded-xl focus:ring-2 focus:ring-[#0057D9] focus:border-transparent outline-none transition-all ${
                            errors.name ? 'border-red-500' : 'border-gray-200'
                          }`}
                          placeholder="John Doe"
                        />
                      </div>
                      {errors.name && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.name}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Email (Always show in signup, conditional in login) */}
                  {(activeTab === 'signup' || loginMethod === 'email') && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full pl-11 pr-4 py-3 text-gray-900 border-2 rounded-xl focus:ring-2 focus:ring-[#0057D9] focus:border-transparent outline-none transition-all ${
                            errors.email ? 'border-red-500' : 'border-gray-200'
                          }`}
                          placeholder="john@example.com"
                        />
                      </div>
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.email}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Phone (Always show in signup, conditional in login) */}
                  {(activeTab === 'signup' || loginMethod === 'phone') && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`w-full pl-11 pr-4 py-3 text-gray-900 border-2 rounded-xl focus:ring-2 focus:ring-[#0057D9] focus:border-transparent outline-none transition-all ${
                            errors.phone ? 'border-red-500' : 'border-gray-200'
                          }`}
                          placeholder="+91 9876543210"
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`w-full pl-11 pr-12 py-3 text-gray-900 border-2 rounded-xl focus:ring-2 focus:ring-[#0057D9] focus:border-transparent outline-none transition-all ${
                          errors.password ? 'border-red-500' : 'border-gray-200'
                        }`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password (Signup only) */}
                  {activeTab === 'signup' && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Confirm Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className={`w-full pl-11 pr-4 py-3 text-gray-900 border-2 rounded-xl focus:ring-2 focus:ring-[#0057D9] focus:border-transparent outline-none transition-all ${
                            errors.confirmPassword ? 'border-red-500' : 'border-gray-200'
                          }`}
                          placeholder="••••••••"
                        />
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Terms (Signup only) */}
                  {activeTab === 'signup' && (
                    <div>
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          name="agreeToTerms"
                          checked={formData.agreeToTerms}
                          onChange={handleInputChange}
                          className={`mt-1 w-5 h-5 rounded border-gray-300 text-[#0057D9] focus:ring-[#0057D9] ${
                            errors.agreeToTerms ? 'border-red-500' : ''
                          }`}
                        />
                        <label className="text-sm text-gray-600">
                          I agree to the{' '}
                          <Link href="/terms" className="text-[#0057D9] font-semibold hover:underline">
                            Terms & Conditions
                          </Link>
                          {' '}and{' '}
                          <Link href="/privacy" className="text-[#0057D9] font-semibold hover:underline">
                            Privacy Policy
                          </Link>
                        </label>
                      </div>
                      {errors.agreeToTerms && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.agreeToTerms}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Forgot Password (Login only) */}
                  {activeTab === 'login' && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-gray-300 text-[#0057D9] focus:ring-[#0057D9]"
                        />
                        <label className="text-sm text-gray-600">Remember me</label>
                      </div>
                      <Link href="/auth/forgot-password" className="text-sm text-[#0057D9] font-semibold hover:underline">
                        Forgot Password?
                      </Link>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-[#0057D9] to-[#0048B8] text-white py-3.5 rounded-xl font-bold text-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        {activeTab === 'login' ? 'Login' : 'Create Account'}
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>

                  {/* Or use OTP */}
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={handleSendOTP}
                      className="text-[#0057D9] font-semibold hover:underline flex items-center justify-center gap-2 mx-auto"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Or use OTP instead
                    </button>
                  </div>
                </form>
              </>
            ) : (
              /* OTP Verification */
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="bg-gradient-to-r from-[#0057D9] to-[#0048B8] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Verify OTP</h2>
                  <p className="text-gray-600">
                    {otpPurpose === 'signup' ? (
                      <>We've sent a 6-digit code to your phone and email</>
                    ) : (
                      <>
                        We've sent a 6-digit code to{' '}
                        <span className="font-semibold text-gray-800">
                          {loginMethod === 'phone' 
                            ? `***${formData.phone.slice(-4)}` 
                            : formData.email.replace(/(.{2})(.*)(@.*)/, '$1***$3')}
                        </span>
                      </>
                    )}
                  </p>
                </div>

                {/* Verification Method Selection (Signup only) */}
                {otpPurpose === 'signup' && (
                  <div className="flex gap-2 mb-4">
                    <button
                      type="button"
                      onClick={() => setVerifyMethod('phone')}
                      className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                        verifyMethod === 'phone'
                          ? 'bg-[#0057D9] text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <Phone className="w-4 h-4 inline mr-2" />
                      Verify with Phone
                    </button>
                    <button
                      type="button"
                      onClick={() => setVerifyMethod('email')}
                      className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                        verifyMethod === 'email'
                          ? 'bg-[#0057D9] text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <Mail className="w-4 h-4 inline mr-2" />
                      Verify with Email
                    </button>
                  </div>
                )}

                <div className="flex gap-3 justify-center mb-6">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOTPChange(index, e.target.value)}
                      onKeyDown={(e) => handleOTPKeyDown(index, e)}
                      className="w-14 h-14 text-center text-2xl font-bold text-gray-900 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0057D9] focus:border-transparent outline-none transition-all"
                    />
                  ))}
                </div>

                {errors.otp && (
                  <p className="text-red-500 text-sm text-center flex items-center justify-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.otp}
                  </p>
                )}

                <button
                  onClick={handleVerifyOTP}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#0057D9] to-[#0048B8] text-white py-3.5 rounded-xl font-bold text-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Verify & Continue
                    </>
                  )}
                </button>

                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-600">
                    Didn't receive the code?{' '}
                    <button 
                      onClick={handleSendOTP}
                      disabled={isLoading}
                      className="text-[#0057D9] font-semibold hover:underline disabled:opacity-50"
                    >
                      Resend OTP
                    </button>
                  </p>
                  <button
                    onClick={() => {
                      setShowOTP(false);
                      setOtp(['', '', '', '', '', '']);
                      setErrors({});
                    }}
                    className="text-sm text-gray-600 hover:text-gray-800 flex items-center justify-center gap-1 mx-auto"
                  >
                    <X className="w-4 h-4" />
                    Change {loginMethod === 'phone' ? 'phone number' : 'email'}
                  </button>
                </div>
              </div>
            )}

            {/* Footer Links */}
            {!showOTP && (
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  {activeTab === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
                  <button
                    onClick={() => setActiveTab(activeTab === 'login' ? 'signup' : 'login')}
                    className="text-[#0057D9] font-semibold hover:underline"
                  >
                    {activeTab === 'login' ? 'Sign Up' : 'Login'}
                  </button>
                </p>
              </div>
            )}
          </div>

          {/* Mobile Branding */}
          <div className="lg:hidden mt-6 text-center">
            <p className="text-sm text-gray-500">
              Trusted by 10M+ users worldwide
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
