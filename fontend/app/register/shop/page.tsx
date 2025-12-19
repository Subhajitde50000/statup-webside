'use client';

import React, { useState } from 'react';
import { 
  ArrowLeft, ArrowRight, Store, MapPin, Phone, Camera, 
  Check, IndianRupee, TrendingUp, Users, Shield, CheckCircle2, 
  ChevronRight, Truck, X, Loader2, Gift, Zap, BadgeCheck, 
  MessageCircle, BarChart3, Smartphone, Clock, Star
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Shop categories based on real market
const shopCategories = [
  { id: 'electronics', name: 'Electronics', icon: '📱', popular: true },
  { id: 'mobile', name: 'Mobile & Accessories', icon: '📲', popular: true },
  { id: 'fashion', name: 'Fashion & Apparel', icon: '👕', popular: true },
  { id: 'grocery', name: 'Grocery & Essentials', icon: '🛒', popular: true },
  { id: 'pharmacy', name: 'Pharmacy', icon: '💊', popular: false },
  { id: 'hardware', name: 'Hardware & Tools', icon: '🔧', popular: false },
  { id: 'home_decor', name: 'Home & Decor', icon: '🏠', popular: false },
  { id: 'beauty', name: 'Beauty & Personal Care', icon: '💄', popular: false },
  { id: 'sports', name: 'Sports & Fitness', icon: '⚽', popular: false },
  { id: 'stationery', name: 'Books & Stationery', icon: '📚', popular: false },
  { id: 'jewelry', name: 'Jewelry', icon: '💎', popular: false },
  { id: 'other', name: 'Other', icon: '🏪', popular: false },
];

const benefits = [
  { icon: Users, title: '10,000+', desc: 'Daily Active Users' },
  { icon: TrendingUp, title: '40%', desc: 'Average Sales Increase' },
  { icon: IndianRupee, title: '₹50,000+', desc: 'Avg Monthly Earnings' },
  { icon: Truck, title: 'Free', desc: 'Delivery Support' },
];

const features = [
  { icon: Smartphone, title: 'Easy Dashboard', desc: 'Manage orders from your phone' },
  { icon: BarChart3, title: 'Analytics', desc: 'Track your sales & growth' },
  { icon: MessageCircle, title: '24/7 Support', desc: 'Dedicated partner support' },
  { icon: Gift, title: 'Zero Commission', desc: 'First 3 months free' },
];

const testimonials = [
  { name: 'Rajesh Kumar', shop: 'RK Electronics', city: 'Delhi', text: 'Sales increased by 60% in just 2 months!', rating: 5 },
  { name: 'Priya Sharma', shop: 'Fashion Hub', city: 'Mumbai', text: 'Best decision for my business. Easy to use platform.', rating: 5 },
  { name: 'Amit Patel', shop: 'Grocery Mart', city: 'Ahmedabad', text: 'Now I get 50+ orders daily. Amazing support team!', rating: 5 },
];

export default function ShopRegistrationPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0); // 0 = landing, 1-4 = form steps
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Simplified form data
  const [formData, setFormData] = useState({
    // Step 1: Basic
    ownerName: '',
    phone: '',
    email: '',
    
    // Step 2: Shop Info
    shopName: '',
    category: '',
    
    // Step 3: Location
    shopAddress: '',
    city: '',
    pincode: '',
    
    // Step 4: Verification
    gstNumber: '',
    hasGst: true,
    agreeTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [shopImage, setShopImage] = useState<string>('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      if (value && index < 3) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const sendOtp = () => {
    if (formData.phone.length === 10) {
      setOtpSent(true);
    }
  };

  const verifyOtp = () => {
    if (otp.join('').length === 4) {
      setOtpVerified(true);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setShopImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.ownerName.trim()) newErrors.ownerName = 'Required';
        if (!formData.phone.trim()) newErrors.phone = 'Required';
        else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Enter valid 10-digit number';
        if (!otpVerified) newErrors.otp = 'Please verify your phone';
        break;
      case 2:
        if (!formData.shopName.trim()) newErrors.shopName = 'Required';
        if (!formData.category) newErrors.category = 'Select a category';
        break;
      case 3:
        if (!formData.shopAddress.trim()) newErrors.shopAddress = 'Required';
        if (!formData.city.trim()) newErrors.city = 'Required';
        if (!formData.pincode.trim()) newErrors.pincode = 'Required';
        else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = 'Enter valid pincode';
        break;
      case 4:
        if (formData.hasGst && !formData.gstNumber.trim()) newErrors.gstNumber = 'Enter GST number';
        if (!formData.agreeTerms) newErrors.agreeTerms = 'Please accept terms';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (currentStep === 0) {
      setCurrentStep(1);
      return;
    }
    if (validateStep(currentStep) && currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setShowSuccess(true);
  };

  // Landing Page (Step 0)
  if (currentStep === 0) {
    return (
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-[#0057D9] via-[#0046B0] to-[#003080] text-white">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Store className="w-5 h-5" />
                </div>
                <span className="font-bold text-lg">ElectroMart Partner</span>
              </Link>
              <Link href="/auth" className="text-sm font-medium hover:underline">
                Already a Partner? Login
              </Link>
            </div>
          </div>
          
          <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-6">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm">Join 5,000+ Partner Shops</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  Grow Your Business<br />
                  <span className="text-yellow-400">10x Faster</span>
                </h1>
                <p className="text-lg text-blue-100 mb-8">
                  Partner with us and reach thousands of customers in your area. 
                  Zero setup cost, easy onboarding, and dedicated support.
                </p>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="bg-white text-[#0057D9] px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  Register Your Shop
                  <ArrowRight className="w-5 h-5" />
                </button>
                <p className="text-sm text-blue-200 mt-4 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Takes only 2 minutes • No documents needed to start
                </p>
              </div>
              
              <div className="hidden md:block">
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 relative">
                  <div className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                    ₹0 Joining Fee
                  </div>
                  <img 
                    src="https://illustrations.popsy.co/blue/online-shopping.svg" 
                    alt="Shop Partner" 
                    className="w-full h-64 object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="max-w-6xl mx-auto px-4 -mt-8 relative z-10">
          <div className="bg-white rounded-2xl shadow-xl p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            {benefits.map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <item.icon className="w-6 h-6 text-[#0057D9]" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{item.title}</p>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">Why Partner With Us?</h2>
          <p className="text-gray-600 text-center mb-12">Everything you need to grow your business online</p>
          
          <div className="grid md:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-gray-50 rounded-2xl p-6 hover:bg-blue-50 hover:shadow-lg transition-all cursor-pointer group">
                <div className="w-12 h-12 bg-[#0057D9] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How it Works */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Start in 3 Easy Steps</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: '1', title: 'Register', desc: 'Enter basic details & verify your phone number', time: '1 min' },
                { step: '2', title: 'Add Shop Details', desc: 'Shop name, category & location', time: '1 min' },
                { step: '3', title: 'Go Live!', desc: 'Start receiving orders within 24 hours', time: 'Instant' },
              ].map((item, idx) => (
                <div key={idx} className="relative">
                  <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 bg-[#0057D9] rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-gray-600 mb-3">{item.desc}</p>
                    <span className="inline-block bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
                      {item.time}
                    </span>
                  </div>
                  {idx < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <ChevronRight className="w-8 h-8 text-gray-300" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">Trusted by Shop Owners</h2>
          <p className="text-gray-600 text-center mb-12">See what our partners say about us</p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((item, idx) => (
              <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-blue-200 hover:shadow-lg transition-all">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"{item.text}"</p>
                <div className="border-t pt-4">
                  <p className="font-semibold text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.shop}, {item.city}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-6xl mx-auto px-4 py-8 pb-16">
          <div className="bg-gradient-to-r from-[#0057D9] to-[#0046B0] rounded-3xl p-8 md:p-12 text-white text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Grow Your Business?</h2>
            <p className="text-blue-100 mb-8">Join thousands of successful shop partners today</p>
            <button
              onClick={() => setCurrentStep(1)}
              className="bg-white text-[#0057D9] px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all inline-flex items-center gap-2"
            >
              Start Free Registration
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-900 text-white py-8">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <p className="text-gray-400 text-sm">
              © 2025 ElectroMart. All rights reserved. | 
              <a href="#" className="hover:text-white ml-2">Privacy Policy</a> | 
              <a href="#" className="hover:text-white ml-2">Terms of Service</a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Success Screen
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Aboard! 🎉</h2>
          <p className="text-gray-600 mb-6">
            Your shop registration is complete. Our team will verify and activate your account within 24 hours.
          </p>
          
          <div className="bg-gray-50 rounded-xl p-4 mb-4 text-left">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">Application ID</span>
              <span className="font-mono font-bold text-[#0057D9]">SHOP{Date.now().toString().slice(-6)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Shop</span>
              <span className="font-medium text-gray-900">{formData.shopName}</span>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-left">
            <div className="flex gap-3">
              <Phone className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800">What's Next?</p>
                <p className="text-sm text-amber-700">Our team will call you on +91 {formData.phone} to complete verification.</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Link href="/shopkeeper" className="block w-full bg-[#0057D9] text-white py-4 rounded-xl font-semibold hover:bg-[#004BB5] transition-colors">
              Go to Dashboard
            </Link>
            <Link href="/" className="block w-full text-gray-600 py-3 font-medium hover:text-gray-900">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Registration Form Steps
  const stepTitles = ['', 'Verify Phone', 'Shop Details', 'Location', 'Complete'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-3">
            <button onClick={prevStep} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div className="flex-1">
              <h1 className="font-semibold text-gray-900">{stepTitles[currentStep]}</h1>
            </div>
            <span className="text-sm font-medium text-[#0057D9]">{currentStep}/4</span>
          </div>
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#0057D9] rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>
      </header>

      {/* Form Content */}
      <main className="max-w-lg mx-auto px-4 py-6">
        {/* Step 1: Phone Verification */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-[#0057D9]" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Let's start with your phone</h2>
              <p className="text-gray-500 mt-1">We'll send an OTP to verify</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
              <input
                type="text"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-[#0057D9] focus:border-[#0057D9] outline-none text-lg ${
                  errors.ownerName ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {errors.ownerName && <p className="text-red-500 text-sm mt-1">{errors.ownerName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <div className="flex gap-2">
                <div className="flex items-center px-4 bg-gray-100 rounded-xl border-2 border-gray-200 text-gray-600 font-medium">
                  +91
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  disabled={otpVerified}
                  className={`flex-1 px-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-[#0057D9] focus:border-[#0057D9] outline-none text-lg ${
                    errors.phone ? 'border-red-500' : 'border-gray-200'
                  } ${otpVerified ? 'bg-green-50 border-green-400' : ''}`}
                />
                {otpVerified && (
                  <div className="flex items-center px-3 bg-green-100 rounded-xl">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                )}
              </div>
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            {!otpVerified && formData.phone.length === 10 && (
              <div className="space-y-4">
                {!otpSent ? (
                  <button
                    onClick={sendOtp}
                    className="w-full py-4 border-2 border-[#0057D9] text-[#0057D9] rounded-xl font-semibold hover:bg-blue-50 transition-colors"
                  >
                    Send OTP
                  </button>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-center text-gray-600">
                      Enter 4-digit OTP sent to <strong>+91 {formData.phone}</strong>
                    </p>
                    <div className="flex gap-3 justify-center">
                      {otp.map((digit, idx) => (
                        <input
                          key={idx}
                          id={`otp-${idx}`}
                          type="text"
                          inputMode="numeric"
                          value={digit}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                          maxLength={1}
                          className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl focus:border-[#0057D9] focus:ring-2 focus:ring-[#0057D9] outline-none"
                        />
                      ))}
                    </div>
                    <button
                      onClick={verifyOtp}
                      disabled={otp.join('').length !== 4}
                      className="w-full py-4 bg-[#0057D9] text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Verify OTP
                    </button>
                    <p className="text-center">
                      <button className="text-sm text-[#0057D9] font-medium hover:underline">
                        Didn't receive? Resend OTP
                      </button>
                    </p>
                  </div>
                )}
              </div>
            )}

            {otpVerified && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="text-green-800 font-medium">Phone verified successfully!</span>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Shop Info */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Store className="w-8 h-8 text-[#0057D9]" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Tell us about your shop</h2>
              <p className="text-gray-500 mt-1">This helps customers find you</p>
            </div>

            {/* Shop Photo */}
            <div className="flex justify-center">
              <label className="cursor-pointer group">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                <div className={`w-32 h-32 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all overflow-hidden ${
                  shopImage ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-[#0057D9] group-hover:bg-blue-50'
                }`}>
                  {shopImage ? (
                    <img src={shopImage} alt="Shop" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <Camera className="w-10 h-10 text-gray-400 group-hover:text-[#0057D9] transition-colors" />
                      <span className="text-sm text-gray-500 mt-2">Add Photo</span>
                    </>
                  )}
                </div>
                <p className="text-xs text-gray-400 text-center mt-2">Shop photo (optional)</p>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Shop Name</label>
              <input
                type="text"
                name="shopName"
                value={formData.shopName}
                onChange={handleInputChange}
                placeholder="e.g., Kumar Electronics"
                className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-[#0057D9] focus:border-[#0057D9] outline-none text-lg ${
                  errors.shopName ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {errors.shopName && <p className="text-red-500 text-sm mt-1">{errors.shopName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">What do you sell?</label>
              <div className="grid grid-cols-3 gap-2">
                {shopCategories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, category: cat.id }))}
                    className={`p-3 rounded-xl border-2 transition-all text-center relative ${
                      formData.category === cat.id
                        ? 'border-[#0057D9] bg-blue-50 shadow-md'
                        : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                    }`}
                  >
                    {cat.popular && (
                      <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                        Popular
                      </span>
                    )}
                    <span className="text-2xl block">{cat.icon}</span>
                    <span className="text-xs font-medium text-gray-700 mt-1 block leading-tight">{cat.name}</span>
                  </button>
                ))}
              </div>
              {errors.category && <p className="text-red-500 text-sm mt-2">{errors.category}</p>}
            </div>
          </div>
        )}

        {/* Step 3: Location */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-[#0057D9]" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Where is your shop?</h2>
              <p className="text-gray-500 mt-1">Help customers find you easily</p>
            </div>

            <button
              type="button"
              className="w-full py-4 border-2 border-dashed border-[#0057D9] bg-blue-50 rounded-xl flex items-center justify-center gap-3 text-[#0057D9] font-semibold hover:bg-blue-100 transition-colors"
            >
              <MapPin className="w-5 h-5" />
              <span>Use Current Location</span>
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-50 text-gray-500">or enter manually</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Shop Address</label>
              <textarea
                name="shopAddress"
                value={formData.shopAddress}
                onChange={handleInputChange}
                rows={2}
                placeholder="Shop no., Building name, Street"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#0057D9] focus:border-[#0057D9] outline-none resize-none ${
                  errors.shopAddress ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {errors.shopAddress && <p className="text-red-500 text-sm mt-1">{errors.shopAddress}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="City"
                  className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-[#0057D9] focus:border-[#0057D9] outline-none ${
                    errors.city ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  placeholder="6-digit"
                  maxLength={6}
                  className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-[#0057D9] focus:border-[#0057D9] outline-none ${
                    errors.pincode ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Final */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Almost done!</h2>
              <p className="text-gray-500 mt-1">Review and complete registration</p>
            </div>

            {/* Summary Card */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Registration Summary</h3>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Owner</span>
                  <span className="font-medium text-gray-900">{formData.ownerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Phone</span>
                  <span className="font-medium text-gray-900">+91 {formData.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Shop</span>
                  <span className="font-medium text-gray-900">{formData.shopName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Category</span>
                  <span className="font-medium text-gray-900">
                    {shopCategories.find(c => c.id === formData.category)?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Location</span>
                  <span className="font-medium text-gray-900">{formData.city}, {formData.pincode}</span>
                </div>
              </div>
            </div>

            {/* GST */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <label className="font-medium text-gray-900">Do you have GST?</label>
                  <p className="text-xs text-gray-500">Optional - can add later</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, hasGst: true }))}
                    className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                      formData.hasGst ? 'bg-[#0057D9] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, hasGst: false, gstNumber: '' }))}
                    className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                      !formData.hasGst ? 'bg-[#0057D9] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>
              
              {formData.hasGst && (
                <input
                  type="text"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={(e) => handleInputChange({ ...e, target: { ...e.target, value: e.target.value.toUpperCase() } } as any)}
                  placeholder="Enter 15-digit GST number"
                  maxLength={15}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#0057D9] focus:border-[#0057D9] outline-none uppercase font-mono ${
                    errors.gstNumber ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
              )}
              {errors.gstNumber && <p className="text-red-500 text-sm mt-1">{errors.gstNumber}</p>}
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer p-4 bg-gray-50 rounded-xl">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleInputChange}
                className="mt-0.5 w-5 h-5 rounded border-gray-300 text-[#0057D9] focus:ring-[#0057D9]"
              />
              <span className="text-sm text-gray-600">
                I agree to the <a href="#" className="text-[#0057D9] font-medium hover:underline">Terms of Service</a> and <a href="#" className="text-[#0057D9] font-medium hover:underline">Partner Agreement</a>
              </span>
            </label>
            {errors.agreeTerms && <p className="text-red-500 text-sm">{errors.agreeTerms}</p>}
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 pt-4">
          {currentStep < 4 ? (
            <button
              onClick={nextStep}
              disabled={currentStep === 1 && !otpVerified}
              className="w-full py-4 bg-[#0057D9] text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#004BB5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200"
            >
              Continue
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full py-4 bg-green-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-green-700 transition-colors disabled:opacity-50 shadow-lg shadow-green-200"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating your account...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Complete Registration
                </>
              )}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
