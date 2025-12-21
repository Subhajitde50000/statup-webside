'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, ArrowRight, User, MapPin, Phone, Camera, Check, 
  IndianRupee, TrendingUp, Shield, CheckCircle2, ChevronRight,
  Star, X, Loader2, Gift, Zap, BadgeCheck, Clock, Briefcase,
  Award, Users, Wallet, Calendar, Home, Wrench, Paintbrush,
  Scissors, Car, Dumbbell, ChefHat, Laptop, Sparkles, Heart,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signup, sendOTP, verifySignup, uploadProfileImage, APIError } from '@/utils/auth';
import { registerProfessional } from '@/utils/verifications';
import { useAuth } from '@/utils/AuthContext';

// Professional categories based on Urban Company model
const professionCategories = [
  { id: 'ac_repair', name: 'AC Repair', icon: '❄️', earnings: '₹25,000+', popular: true },
  { id: 'electrician', name: 'Electrician', icon: '⚡', earnings: '₹20,000+', popular: true },
  { id: 'plumber', name: 'Plumber', icon: '🔧', earnings: '₹22,000+', popular: true },
  { id: 'carpenter', name: 'Carpenter', icon: '🪚', earnings: '₹18,000+', popular: true },
  { id: 'cleaner', name: 'Home Cleaning', icon: '🧹', earnings: '₹15,000+', popular: true },
  { id: 'painter', name: 'Painter', icon: '🎨', earnings: '₹20,000+', popular: false },
  { id: 'appliance', name: 'Appliance Repair', icon: '📺', earnings: '₹22,000+', popular: false },
  { id: 'beauty', name: 'Beauty & Salon', icon: '💇', earnings: '₹30,000+', popular: true },
  { id: 'massage', name: 'Spa & Massage', icon: '💆', earnings: '₹35,000+', popular: false },
  { id: 'pest', name: 'Pest Control', icon: '🦟', earnings: '₹18,000+', popular: false },
  { id: 'driver', name: 'Driver', icon: '🚗', earnings: '₹25,000+', popular: false },
  { id: 'other', name: 'Other Services', icon: '🛠️', earnings: 'Varies', popular: false },
];

const benefits = [
  { icon: IndianRupee, title: '₹25,000+', desc: 'Avg Monthly Earnings' },
  { icon: Calendar, title: 'Flexible', desc: 'Work on Your Time' },
  { icon: Users, title: '50,000+', desc: 'Active Customers' },
  { icon: Shield, title: '100%', desc: 'Payment Protection' },
];

const features = [
  { icon: Wallet, title: 'Weekly Payments', desc: 'Get paid every week directly to your bank' },
  { icon: Users, title: 'Regular Leads', desc: 'Get 5-10 new service requests daily' },
  { icon: Award, title: 'Free Training', desc: 'Skill development & certification programs' },
  { icon: Shield, title: 'Insurance Cover', desc: 'Accident & health insurance included' },
];

const testimonials = [
  { name: 'Ramesh Singh', service: 'Electrician', city: 'Delhi', earnings: '₹35,000/month', text: 'Left my factory job. Now I earn double!', img: '👨‍🔧' },
  { name: 'Sunita Devi', service: 'Beauty Expert', city: 'Mumbai', earnings: '₹45,000/month', text: 'Best platform for beauty professionals.', img: '👩‍🎨' },
  { name: 'Mohan Kumar', service: 'AC Technician', city: 'Bangalore', earnings: '₹40,000/month', text: 'Regular work, timely payments. Very happy!', img: '👨‍🏭' },
];

export default function ProfessionalRegistrationPage() {
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
    fullName: '',
    phone: '',
    email: '',
    dateOfBirth: '',
    gender: '',
    
    // Step 2: Service
    profession: '',
    subCategory: '', // e.g., AC Repair, House Cleaning, etc.
    experience: '',
    qualifications: '',
    certifications: '',
    languages: [] as string[], // Languages spoken
    
    // Step 3: Location & Availability
    address: '',
    landmark: '',
    city: '',
    pincode: '',
    serviceRadius: '5',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    startTime: '09:00',
    endTime: '18:00',
    
    // Step 4: Documents & Banking
    aadhaarNumber: '',
    panNumber: '',
    drivingLicense: '',
    policeVerification: false,
    
    // Step 5: Banking
    bankAccountNumber: '',
    ifscCode: '',
    accountHolderName: '',
    
    // Equipment owned (for applicable services)
    ownEquipment: false,
    equipmentList: '',
    
    agreeTerms: false,
    agreeBackground: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [profileImage, setProfileImage] = useState<string>('');
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [tempEmail, setTempEmail] = useState('');

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
        fullName: data.name || '',
        phone: data.phone || '',
        email: data.email || '',
        dateOfBirth: data.date_of_birth || '',
        gender: data.gender || '',
        profession: data.profession || '',
        subCategory: data.sub_category || '',
        experience: data.experience || '',
        qualifications: data.qualifications || '',
        certifications: data.certifications || '',
        languages: data.languages || [],
        address: data.address || '',
        landmark: data.landmark || '',
        city: data.city || '',
        pincode: data.pincode || '',
        serviceRadius: data.service_radius || '5',
        availableDays: data.available_days || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        startTime: data.start_time || '09:00',
        endTime: data.end_time || '18:00',
        aadhaarNumber: data.aadhaar_number || '',
        panNumber: data.pan_number || '',
        drivingLicense: data.driving_license || '',
        policeVerification: data.police_verification || false,
        bankAccountNumber: data.bank_account_number || '',
        ifscCode: data.ifsc_code || '',
        accountHolderName: data.account_holder_name || '',
        ownEquipment: data.own_equipment || false,
        equipmentList: data.equipment_list || '',
        agreeTerms: false,
        agreeBackground: false,
      });

      if (data.profile_image) {
        setProfileImage(data.profile_image);
      }

      if (data.email) {
        setTempEmail(data.email);
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
    if (!formData.fullName.trim()) {
      setApiError('Please enter your full name');
      return;
    }
    
    if (formData.phone.length !== 10) {
      setApiError('Please enter valid 10-digit phone number');
      return;
    }
    
    setIsSendingOtp(true);
    setApiError('');
    
    try {
      // Call backend signup API
      const signupData: any = {
        name: formData.fullName,
        phone: formData.phone,
        password: `Pro${formData.phone}@123`
      };
      
      // Only include email if provided (backend will generate if missing)
      if (tempEmail && tempEmail.trim()) {
        signupData.email = tempEmail;
      }
      
      await signup(signupData);
      
      setOtpSent(true);
    } catch (error) {
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
      
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result as string);
      reader.readAsDataURL(file);
      setApiError('');
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.fullName.trim()) newErrors.fullName = 'Required';
        if (!formData.phone.trim()) newErrors.phone = 'Required';
        else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Enter valid 10-digit number';
        if (!otpVerified) newErrors.otp = 'Please verify your phone';
        break;
      case 2:
        if (!formData.profession) newErrors.profession = 'Select your service';
        if (!formData.experience) newErrors.experience = 'Select experience';
        break;
      case 3:
        if (!formData.city.trim()) newErrors.city = 'Required';
        if (!formData.pincode.trim()) newErrors.pincode = 'Required';
        else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = 'Enter valid pincode';
        break;
      case 4:
        if (!formData.agreeTerms) newErrors.agreeTerms = 'Please accept terms';
        if (!formData.agreeBackground) newErrors.agreeBackground = 'Background check consent required';
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
      // Upload profile image if provided
      if (profileImageFile) {
        try {
          await uploadProfileImage(profileImageFile);
        } catch (error) {
          console.error('Failed to upload profile image:', error);
          // Continue even if image upload fails
        }
      }
      
      const professionalData = {
        name: formData.fullName,
        phone: formData.phone,
        email: tempEmail || formData.email || undefined,
        date_of_birth: formData.dateOfBirth || undefined,
        gender: formData.gender || undefined,
        profession: formData.profession,
        sub_category: formData.subCategory || undefined,
        experience: formData.experience,
        qualifications: formData.qualifications || undefined,
        certifications: formData.certifications || undefined,
        languages: formData.languages,
        address: formData.address,
        landmark: formData.landmark || undefined,
        city: formData.city,
        pincode: formData.pincode,
        service_radius: formData.serviceRadius,
        available_days: formData.availableDays,
        start_time: formData.startTime,
        end_time: formData.endTime,
        aadhaar_number: formData.aadhaarNumber || undefined,
        pan_number: formData.panNumber || undefined,
        driving_license: formData.drivingLicense || undefined,
        police_verification: formData.policeVerification,
        bank_account_number: formData.bankAccountNumber || undefined,
        ifsc_code: formData.ifscCode || undefined,
        account_holder_name: formData.accountHolderName || undefined,
        own_equipment: formData.ownEquipment,
        equipment_list: formData.equipmentList || undefined,
        profile_image: profileImage || undefined,
      };
      
      if (editId) {
        // Update existing verification
        const response = await fetch(`http://localhost:8000/api/verifications/edit/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(professionalData)
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to update registration');
        }
      } else {
        // Submit new professional registration for verification
        await registerProfessional(professionalData);
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
        <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Briefcase className="w-5 h-5" />
                </div>
                <span className="font-bold text-lg">ElectroMart Pro</span>
              </Link>
              <Link href="/register/professional/login" className="text-sm font-medium hover:underline">
                Already Registered? Check Status
              </Link>
            </div>
          </div>
          
          <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-6">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm">Join 10,000+ Service Professionals</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  Earn <span className="text-yellow-400">₹25,000+</span><br />
                  Every Month
                </h1>
                <p className="text-lg text-emerald-100 mb-8">
                  Join our network of skilled professionals. Get regular work, 
                  flexible hours, and guaranteed weekly payments.
                </p>
                
                {/* Quick Earnings Preview */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                      <IndianRupee className="w-6 h-6 text-emerald-800" />
                    </div>
                    <div>
                      <p className="text-sm text-emerald-200">Average Monthly Earnings</p>
                      <p className="text-2xl font-bold">₹20,000 - ₹50,000</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setCurrentStep(1)}
                  className="bg-white text-emerald-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  Start Earning Today
                  <ArrowRight className="w-5 h-5" />
                </button>
                <p className="text-sm text-emerald-200 mt-4 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  2-minute registration • No joining fee
                </p>
              </div>
              
              <div className="hidden md:block">
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6">
                  <div className="grid grid-cols-2 gap-4">
                    {professionCategories.slice(0, 6).map((cat, idx) => (
                      <div key={idx} className="bg-white/10 rounded-xl p-4 text-center">
                        <span className="text-3xl">{cat.icon}</span>
                        <p className="font-medium mt-2">{cat.name}</p>
                        <p className="text-emerald-200 text-sm">{cat.earnings}</p>
                      </div>
                    ))}
                  </div>
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
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <item.icon className="w-6 h-6 text-emerald-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{item.title}</p>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Why Join */}
        <div className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">Why Work With Us?</h2>
          <p className="text-gray-600 text-center mb-12">Benefits that make a difference</p>
          
          <div className="grid md:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-gray-50 rounded-2xl p-6 hover:bg-emerald-50 hover:shadow-lg transition-all cursor-pointer group">
                <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
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
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Start Earning in 3 Steps</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: '1', title: 'Register', desc: 'Enter your details & verify phone', time: '2 min' },
                { step: '2', title: 'Complete Profile', desc: 'Add skills, experience & documents', time: '5 min' },
                { step: '3', title: 'Start Working', desc: 'Get jobs & earn from day 1', time: 'Instant' },
              ].map((item, idx) => (
                <div key={idx} className="relative">
                  <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-gray-600 mb-3">{item.desc}</p>
                    <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-medium px-3 py-1 rounded-full">
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

        {/* Earnings Calculator */}
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-8 md:p-12 text-white">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Calculate Your Earnings</h2>
                <p className="text-emerald-100 mb-6">See how much you can earn with us</p>
                
                <div className="space-y-4">
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="flex justify-between items-center">
                      <span>5 jobs/day × ₹300 avg</span>
                      <span className="font-bold">₹1,500/day</span>
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="flex justify-between items-center">
                      <span>25 working days</span>
                      <span className="font-bold text-yellow-400 text-xl">₹37,500/month</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="bg-white rounded-2xl p-6 text-gray-900">
                  <p className="text-sm text-gray-500 mb-2">Top Earners Make</p>
                  <p className="text-4xl font-bold text-emerald-600">₹80,000+</p>
                  <p className="text-gray-500">per month</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="max-w-6xl mx-auto px-4 py-8 pb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">Success Stories</h2>
          <p className="text-gray-600 text-center mb-12">Real professionals, real earnings</p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((item, idx) => (
              <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-emerald-200 hover:shadow-lg transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center text-3xl">
                    {item.img}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.service}, {item.city}</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">"{item.text}"</p>
                <div className="bg-emerald-50 rounded-lg p-3 flex items-center justify-between">
                  <span className="text-sm text-gray-600">Earnings</span>
                  <span className="font-bold text-emerald-600">{item.earnings}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 py-16">
          <div className="max-w-6xl mx-auto px-4 text-center text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Start Earning?</h2>
            <p className="text-emerald-100 mb-8">Join thousands of professionals already earning with us</p>
            <button
              onClick={() => setCurrentStep(1)}
              className="bg-white text-emerald-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all inline-flex items-center gap-2"
            >
              Register Now - It's Free
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
          <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your registration details...</p>
        </div>
      </div>
    );
  }

  // Registration Form Steps
  const stepTitles = ['', 'Verify Phone', 'Select Service', 'Your Location', 'Final Step'];

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
            <span className="text-sm font-medium text-emerald-600">{currentStep}/4</span>
          </div>
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-600 rounded-full transition-all duration-500"
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
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Let's create your account</h2>
              <p className="text-gray-500 mt-1">Enter your details to get started</p>
            </div>

            {/* Profile Photo */}
            <div className="flex justify-center">
              <label className="cursor-pointer group">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                <div className={`w-24 h-24 rounded-full border-2 border-dashed flex items-center justify-center transition-all overflow-hidden ${
                  profileImage ? 'border-emerald-400 bg-emerald-50' : 'border-gray-300 hover:border-emerald-500'
                }`}>
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="w-8 h-8 text-gray-400 group-hover:text-emerald-600" />
                  )}
                </div>
                <p className="text-xs text-gray-400 text-center mt-2">Add Photo</p>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter your name"
                className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-lg ${
                  errors.fullName ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
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
                  placeholder="10-digit number"
                  maxLength={10}
                  disabled={otpVerified}
                  className={`flex-1 px-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-lg ${
                    errors.phone ? 'border-red-500' : 'border-gray-200'
                  } ${otpVerified ? 'bg-emerald-50 border-emerald-400' : ''}`}
                />
                {otpVerified && (
                  <div className="flex items-center px-3 bg-emerald-100 rounded-xl">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
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
                className={`w-full px-4 py-4 text-gray-700 border-2 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-lg ${
                  errors.email ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              <p className="text-xs text-gray-500 mt-1">We'll use this for job updates and customer inquiries</p>
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
                      className="w-full py-4 border-2 border-emerald-600 text-emerald-600 rounded-xl font-semibold hover:bg-emerald-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
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
                          className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 outline-none disabled:opacity-50"
                        />
                      ))}
                    </div>
                    <button
                      onClick={verifyOtp}
                      disabled={otp.join('').length !== 6 || isVerifyingOtp}
                      className="w-full py-4 bg-emerald-600 text-white rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
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
                        className="text-sm text-emerald-600 font-medium hover:underline disabled:opacity-50"
                      >
                        Didn't receive? Resend OTP
                      </button>
                    </p>
                  </div>
                )}
              </div>
            )}

            {otpVerified && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="text-emerald-800 font-medium">Phone verified!</span>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Service Selection */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">What service do you offer?</h2>
              <p className="text-gray-500 mt-1">Select your primary skill</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Select Service Category</label>
              <div className="grid grid-cols-3 gap-2">
                {professionCategories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, profession: cat.id }))}
                    className={`p-3 rounded-xl border-2 transition-all text-center relative ${
                      formData.profession === cat.id
                        ? 'border-emerald-500 bg-emerald-50 shadow-md'
                        : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                    }`}
                  >
                    {cat.popular && (
                      <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                        Hot
                      </span>
                    )}
                    <span className="text-2xl block">{cat.icon}</span>
                    <span className="text-xs font-medium text-gray-700 mt-1 block leading-tight">{cat.name}</span>
                  </button>
                ))}
              </div>
              {errors.profession && <p className="text-red-500 text-sm mt-2">{errors.profession}</p>}
            </div>

            {/* Earnings Preview */}
            {formData.profession && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <IndianRupee className="w-5 h-5 text-emerald-600" />
                    <span className="text-gray-700">Expected Earnings</span>
                  </div>
                  <span className="font-bold text-emerald-600">
                    {professionCategories.find(c => c.id === formData.profession)?.earnings}/month
                  </span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Experience Level</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'fresher', name: 'Fresher', desc: '< 1 year' },
                  { id: '1-3', name: '1-3 Years', desc: 'Intermediate' },
                  { id: '3-5', name: '3-5 Years', desc: 'Experienced' },
                  { id: '5+', name: '5+ Years', desc: 'Expert' },
                ].map((exp) => (
                  <button
                    key={exp.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, experience: exp.id }))}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      formData.experience === exp.id
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className="font-semibold text-gray-900">{exp.name}</p>
                    <p className="text-sm text-gray-500">{exp.desc}</p>
                  </button>
                ))}
              </div>
              {errors.experience && <p className="text-red-500 text-sm mt-2">{errors.experience}</p>}
            </div>
          </div>
        )}

        {/* Step 3: Location */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Where will you work?</h2>
              <p className="text-gray-500 mt-1">We'll show you nearby jobs</p>
            </div>

            <button
              type="button"
              className="w-full py-4 border-2 border-dashed border-emerald-500 bg-emerald-50 rounded-xl flex items-center justify-center gap-3 text-emerald-600 font-semibold hover:bg-emerald-100 transition-colors"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Address (Optional)</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows={2}
                placeholder="House/Flat no., Street, Area"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none"
              />
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
                  className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${
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
                  className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${
                    errors.pincode ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">How far can you travel for work?</label>
              <select
                name="serviceRadius"
                value={formData.serviceRadius}
                onChange={handleInputChange}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white"
              >
                <option value="5">Within 5 km</option>
                <option value="10">Within 10 km</option>
                <option value="15">Within 15 km</option>
                <option value="20">Within 20 km</option>
                <option value="any">Anywhere in city</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 4: Final */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">You're almost done!</h2>
              <p className="text-gray-500 mt-1">Review and submit your application</p>
            </div>

            {/* Summary Card */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Your Profile</h3>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Name</span>
                  <span className="font-medium text-gray-900">{formData.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Phone</span>
                  <span className="font-medium text-gray-900">+91 {formData.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Service</span>
                  <span className="font-medium text-gray-900">
                    {professionCategories.find(c => c.id === formData.profession)?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Experience</span>
                  <span className="font-medium text-gray-900">{formData.experience} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Location</span>
                  <span className="font-medium text-gray-900">{formData.city}, {formData.pincode}</span>
                </div>
              </div>
            </div>

            {/* Documents Upload */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3">📄 Verification Documents</h3>
              <p className="text-sm text-gray-500 mb-4">Upload documents (optional - can add later)</p>
              
              <div className="space-y-3">
                <label className="block p-4 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-colors">
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Aadhaar Card</p>
                      <p className="text-xs text-gray-500">PDF, JPG, or PNG • Max 5MB</p>
                    </div>
                    <span className="text-sm text-emerald-600 font-medium">Upload</span>
                  </div>
                </label>
                
                <label className="block p-4 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-colors">
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <BadgeCheck className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Experience Certificate</p>
                      <p className="text-xs text-gray-500">PDF, JPG, or PNG • Max 5MB</p>
                    </div>
                    <span className="text-sm text-emerald-600 font-medium">Upload</span>
                  </div>
                </label>
                
                <label className="block p-4 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-colors">
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Skill Certificates</p>
                      <p className="text-xs text-gray-500">PDF, JPG, or PNG • Max 5MB</p>
                    </div>
                    <span className="text-sm text-emerald-600 font-medium">Upload</span>
                  </div>
                </label>
              </div>
              
              <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Verified professionals get 50% more bookings
              </p>
            </div>

            {/* Aadhaar (Optional) */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aadhaar Number <span className="text-gray-400">(Optional - can add later)</span>
              </label>
              <input
                type="text"
                name="aadhaarNumber"
                value={formData.aadhaarNumber}
                onChange={handleInputChange}
                placeholder="12-digit Aadhaar number"
                maxLength={12}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Required for profile verification & higher earnings
              </p>
            </div>

            {/* Agreements */}
            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer p-4 bg-gray-50 rounded-xl">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleInputChange}
                  className="mt-0.5 w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-600">
                  I agree to the <a href="#" className="text-emerald-600 font-medium hover:underline">Terms of Service</a> and <a href="#" className="text-emerald-600 font-medium hover:underline">Partner Guidelines</a>
                </span>
              </label>
              {errors.agreeTerms && <p className="text-red-500 text-sm">{errors.agreeTerms}</p>}
              
              <label className="flex items-start gap-3 cursor-pointer p-4 bg-gray-50 rounded-xl">
                <input
                  type="checkbox"
                  name="agreeBackground"
                  checked={formData.agreeBackground}
                  onChange={handleInputChange}
                  className="mt-0.5 w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-600">
                  I consent to background verification for customer safety
                </span>
              </label>
              {errors.agreeBackground && <p className="text-red-500 text-sm">{errors.agreeBackground}</p>}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 pt-4">
          {currentStep < 4 ? (
            <button
              onClick={nextStep}
              disabled={currentStep === 1 && !otpVerified}
              className="w-full py-4 bg-emerald-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-200"
            >
              Continue
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full py-4 bg-emerald-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors disabled:opacity-50 shadow-lg shadow-emerald-200"
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
