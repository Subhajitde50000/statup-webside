'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, ArrowRight, Store, MapPin, Phone, Camera, 
  Check, IndianRupee, TrendingUp, Users, Shield, CheckCircle2, 
  ChevronRight, Truck, X, Loader2, Gift, Zap, BadgeCheck, 
  MessageCircle, BarChart3, Smartphone, Clock, Star, AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signup, verifySignup, uploadProfileImage, APIError } from '@/utils/auth';
import { registerShop } from '@/utils/verifications';
import { useAuth } from '@/utils/AuthContext';

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
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit'); // Get verification ID for editing
  const { login } = useAuth();
  const [currentStep, setCurrentStep] = useState(0); // 0 = landing, 1-4 = form steps
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [apiError, setApiError] = useState('');
  const [registeredUserId, setRegisteredUserId] = useState('');
  const [isLoadingData, setIsLoadingData] = useState(false);
  
  // Simplified form data
  const [formData, setFormData] = useState({
    // Step 1: Basic
    ownerName: '',
    phone: '',
    email: '',
    alternatePhone: '',
    
    // Step 2: Shop Info
    shopName: '',
    category: '',
    shopType: 'retail', // retail, restaurant, service
    description: '',
    establishedYear: '',
    
    // Step 3: Location & Timing
    shopAddress: '',
    landmark: '',
    city: '',
    pincode: '',
    openingTime: '09:00',
    closingTime: '21:00',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    
    // Step 4: Business Details
    gstNumber: '',
    hasGst: true,
    panNumber: '',
    fssaiNumber: '', // For food businesses
    tradeLicense: '',
    
    // Step 5: Banking & Additional
    bankAccountNumber: '',
    ifscCode: '',
    accountHolderName: '',
    deliveryAvailable: false,
    deliveryRadius: '5',
    minimumOrderValue: '',
    
    agreeTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [shopImage, setShopImage] = useState<string>('');
  const [shopImageFile, setShopImageFile] = useState<File | null>(null);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  // Load existing verification data if editing
  useEffect(() => {
    if (editId) {
      loadVerificationData(editId);
    }
  }, [editId]);

  const loadVerificationData = async (verificationId: string) => {
    setIsLoadingData(true);
    try {
      const response = await fetch(`http://localhost:8000/api/verifications/${verificationId}`);
      if (!response.ok) throw new Error('Failed to load verification data');
      
      const data = await response.json();
      
      // Auto-fill form with existing data
      setFormData({
        ownerName: data.name || '',
        phone: data.phone || '',
        email: data.email || '',
        alternatePhone: data.alternate_phone || '',
        shopName: data.shop_name || '',
        category: data.category || '',
        shopType: data.shop_type || 'retail',
        description: data.description || '',
        establishedYear: data.established_year || '',
        shopAddress: data.shop_address || '',
        landmark: data.landmark || '',
        city: data.city || '',
        pincode: data.pincode || '',
        openingTime: data.opening_time || '09:00',
        closingTime: data.closing_time || '21:00',
        workingDays: data.working_days || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        gstNumber: data.gst_number || '',
        hasGst: data.has_gst ?? true,
        panNumber: data.pan_number || '',
        fssaiNumber: data.fssai_number || '',
        tradeLicense: data.trade_license || '',
        bankAccountNumber: data.bank_account_number || '',
        ifscCode: data.ifsc_code || '',
        accountHolderName: data.account_holder_name || '',
        deliveryAvailable: data.delivery_available || false,
        deliveryRadius: data.delivery_radius || '5',
        minimumOrderValue: data.minimum_order_value || '',
        agreeTerms: false,
      });

      if (data.shop_image) {
        setShopImage(data.shop_image);
      }

      // Skip to step 1 (phone already verified)
      setOtpVerified(true);
      setCurrentStep(1);
    } catch (error) {
      console.error('Error loading verification data:', error);
      setApiError('Failed to load existing data. Please try again.');
    } finally {
      setIsLoadingData(false);
    }
  };

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

  const sendOtp = async () => {
    // Validate required fields before sending OTP
    if (!formData.ownerName.trim()) {
      setApiError('Please enter owner name');
      return;
    }
    
    if (formData.phone.length !== 10) {
      setApiError('Please enter valid 10-digit phone number');
      return;
    }
    
    setIsSendingOtp(true);
    setApiError('');
    
    try {
      // Call backend signup API with proper data
      const signupData: any = {
        name: formData.ownerName,
        phone: formData.phone,
        password: `Shop${formData.phone}@123`
      };
      
      // Only include email if provided (backend will generate if missing)
      if (formData.email && formData.email.trim()) {
        signupData.email = formData.email;
      }
      
      console.log('Sending signup request:', signupData);
      
      await signup(signupData);
      
      setOtpSent(true);
    } catch (error) {
      console.error('Signup error:', error);
      if (error instanceof APIError) {
        setApiError(error.message);
      } else {
        setApiError('Failed to send OTP. Please try again.');
      }
    } finally {
      setIsSendingOtp(false);
    }
  };

  const verifyOtp = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) return;
    
    setIsVerifyingOtp(true);
    setApiError('');
    
    try {
      // Verify OTP with backend
      const response = await verifySignup({ 
        identifier: formData.phone, 
        otp_code: otpCode,
        purpose: 'signup'
      });
      
      // Tokens are already saved by verifySignup function
      // Login to AuthContext
      if (response.user) {
        await login(response.user);
        setRegisteredUserId(response.user.id);
        setOtpVerified(true);
      }
    } catch (error) {
      if (error instanceof APIError) {
        setApiError(error.message);
      } else {
        setApiError('Invalid OTP. Please try again.');
      }
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setApiError('Image size should be less than 5MB');
        return;
      }
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setApiError('Please select a valid image file (JPG, PNG, GIF, or WebP)');
        return;
      }
      
      setShopImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setShopImage(reader.result as string);
      reader.readAsDataURL(file);
      setApiError('');
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
    setApiError('');
    
    try {
      // Upload shop image if provided
      if (shopImageFile) {
        try {
          await uploadProfileImage(shopImageFile);
        } catch (error) {
          console.error('Failed to upload shop image:', error);
          // Continue even if image upload fails
        }
      }
      
      const shopData = {
        owner_name: formData.ownerName,
        phone: formData.phone,
        email: formData.email || undefined,
        alternate_phone: formData.alternatePhone || undefined,
        shop_name: formData.shopName,
        category: formData.category,
        shop_type: formData.shopType,
        description: formData.description || undefined,
        established_year: formData.establishedYear || undefined,
        shop_address: formData.shopAddress,
        landmark: formData.landmark || undefined,
        city: formData.city,
        pincode: formData.pincode,
        opening_time: formData.openingTime,
        closing_time: formData.closingTime,
        working_days: formData.workingDays,
        gst_number: formData.gstNumber || undefined,
        has_gst: formData.hasGst,
        pan_number: formData.panNumber || undefined,
        fssai_number: formData.fssaiNumber || undefined,
        trade_license: formData.tradeLicense || undefined,
        bank_account_number: formData.bankAccountNumber || undefined,
        ifsc_code: formData.ifscCode || undefined,
        account_holder_name: formData.accountHolderName || undefined,
        delivery_available: formData.deliveryAvailable,
        delivery_radius: formData.deliveryRadius || undefined,
        minimum_order_value: formData.minimumOrderValue || undefined,
        shop_image: shopImage || undefined,
      };
      
      if (editId) {
        // Update existing verification
        const response = await fetch(`http://localhost:8000/api/verifications/edit/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(shopData)
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to update registration');
        }
      } else {
        // Submit new shop registration for verification
        await registerShop(shopData);
      }
      
      // Redirect to status page
      router.push(`/register/status?phone=${encodeURIComponent(formData.phone)}`);
    } catch (error) {
      if (error instanceof APIError) {
        setApiError(error.message);
      } else {
        setApiError('Failed to complete registration. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
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
              <Link href="/register/shop/login" className="text-sm font-medium hover:underline">
                Already Registered? Check Status
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

  // Success Screen - No longer needed, redirecting to status page instead
  if (showSuccess) {
    return null; // This should never be reached as we redirect before setting showSuccess
  }

  // Loading screen when fetching edit data
  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#0057D9] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your registration details...</p>
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
                className={`w-full px-4 py-4 text-gray-700 border-2 rounded-xl focus:ring-2 focus:ring-[#0057D9] focus:border-[#0057D9] outline-none text-lg ${
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
                  className={`flex-1 px-4 py-4 text-gray-700 border-2 rounded-xl focus:ring-2 focus:ring-[#0057D9] focus:border-[#0057D9] outline-none text-lg ${
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address (Optional)</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your.email@example.com"
                className={`w-full px-4 py-4 text-gray-700 border-2 rounded-xl focus:ring-2 focus:ring-[#0057D9] focus:border-[#0057D9] outline-none text-lg ${
                  errors.email ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              <p className="text-xs text-gray-500 mt-1">We'll use this for important updates about your shop</p>
            </div>

            {!otpVerified && formData.phone.length === 10 && (
              <div className="space-y-4">
                {!otpSent ? (
                  <>
                    {apiError && (
                      <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {apiError}
                      </div>
                    )}
                    <button
                      onClick={sendOtp}
                      disabled={isSendingOtp}
                      className="w-full py-4 border-2 border-[#0057D9] text-[#0057D9] rounded-xl font-semibold hover:bg-blue-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
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
                  </>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-center text-gray-600">
                      Enter 6-digit OTP sent to <strong>+91 {formData.phone}</strong>
                    </p>
                    {apiError && (
                      <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {apiError}
                      </div>
                    )}
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
                          disabled={isVerifyingOtp}
                          className="w-14 h-14 text-center text-2xl text-gray-700 font-bold border-2 border-gray-200 rounded-xl focus:border-[#0057D9] focus:ring-2 focus:ring-[#0057D9] outline-none disabled:opacity-50"
                        />
                      ))}
                    </div>
                    <button
                      onClick={verifyOtp}
                      disabled={otp.join('').length !== 6 || isVerifyingOtp}
                      className="w-full py-4 bg-[#0057D9] text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isVerifyingOtp ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        'Verify OTP'
                      )}
                    </button>
                    <p className="text-center">
                      <button 
                        onClick={sendOtp}
                        disabled={isSendingOtp}
                        className="text-sm text-[#0057D9] font-medium hover:underline disabled:opacity-50"
                      >
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

            {/* Documents Upload */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3">📄 Business Documents</h3>
              <p className="text-sm text-gray-500 mb-4">Upload supporting documents (optional - can add later)</p>
              
              <div className="space-y-3">
                <label className="block p-4 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#0057D9] hover:bg-blue-50 transition-colors">
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-[#0057D9]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Shop License / Registration</p>
                      <p className="text-xs text-gray-500">PDF, JPG, or PNG • Max 5MB</p>
                    </div>
                    <span className="text-sm text-[#0057D9] font-medium">Upload</span>
                  </div>
                </label>
                
                <label className="block p-4 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#0057D9] hover:bg-blue-50 transition-colors">
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <BadgeCheck className="w-5 h-5 text-[#0057D9]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Owner ID Proof (Aadhaar/PAN)</p>
                      <p className="text-xs text-gray-500">PDF, JPG, or PNG • Max 5MB</p>
                    </div>
                    <span className="text-sm text-[#0057D9] font-medium">Upload</span>
                  </div>
                </label>
                
                <label className="block p-4 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#0057D9] hover:bg-blue-50 transition-colors">
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Store className="w-5 h-5 text-[#0057D9]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Shop/Store Photos</p>
                      <p className="text-xs text-gray-500">JPG or PNG • Max 5MB each</p>
                    </div>
                    <span className="text-sm text-[#0057D9] font-medium">Upload</span>
                  </div>
                </label>
              </div>
              
              <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Documents help speed up verification process
              </p>
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
