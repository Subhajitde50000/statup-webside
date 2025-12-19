'use client';

import React, { useState } from 'react';
import { 
  ArrowLeft, ArrowRight, User, MapPin, Phone, Camera, Check, 
  IndianRupee, TrendingUp, Shield, CheckCircle2, ChevronRight,
  Star, X, Loader2, Gift, Zap, BadgeCheck, Clock, Briefcase,
  Award, Users, Wallet, Calendar, Home, Wrench, Paintbrush,
  Scissors, Car, Dumbbell, ChefHat, Laptop, Sparkles, Heart
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
  const [currentStep, setCurrentStep] = useState(0); // 0 = landing, 1-4 = form steps
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Simplified form data
  const [formData, setFormData] = useState({
    // Step 1: Basic
    fullName: '',
    phone: '',
    
    // Step 2: Service
    profession: '',
    experience: '',
    
    // Step 3: Location
    address: '',
    city: '',
    pincode: '',
    serviceRadius: '5',
    
    // Step 4: Final
    aadhaarNumber: '',
    agreeTerms: false,
    agreeBackground: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [profileImage, setProfileImage] = useState<string>('');
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
      reader.onloadend = () => setProfileImage(reader.result as string);
      reader.readAsDataURL(file);
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
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setShowSuccess(true);
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
              <Link href="/auth" className="text-sm font-medium hover:underline">
                Already Registered? Login
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

  // Success Screen
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to the Team! 🎉</h2>
          <p className="text-gray-600 mb-6">
            Your application is submitted. Complete your profile to start getting jobs.
          </p>
          
          <div className="bg-gray-50 rounded-xl p-4 mb-4 text-left">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">Partner ID</span>
              <span className="font-mono font-bold text-emerald-600">PRO{Date.now().toString().slice(-6)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Service</span>
              <span className="font-medium text-gray-900">
                {professionCategories.find(c => c.id === formData.profession)?.name}
              </span>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6 text-left">
            <div className="flex gap-3">
              <BadgeCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-emerald-800">Next Steps</p>
                <ol className="text-sm text-emerald-700 mt-2 space-y-1 list-decimal list-inside">
                  <li>Complete document verification</li>
                  <li>Attend free training session</li>
                  <li>Start receiving jobs!</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Link href="/professional" className="block w-full bg-emerald-600 text-white py-4 rounded-xl font-semibold hover:bg-emerald-700 transition-colors">
              Complete Your Profile
            </Link>
            <Link href="/" className="block w-full text-gray-600 py-3 font-medium hover:text-gray-900">
              I'll do it later
            </Link>
          </div>
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

            {!otpVerified && formData.phone.length === 10 && (
              <div className="space-y-4">
                {!otpSent ? (
                  <button
                    onClick={sendOtp}
                    className="w-full py-4 border-2 border-emerald-600 text-emerald-600 rounded-xl font-semibold hover:bg-emerald-50 transition-colors"
                  >
                    Send OTP
                  </button>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-center text-gray-600">
                      Enter OTP sent to <strong>+91 {formData.phone}</strong>
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
                          className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                      ))}
                    </div>
                    <button
                      onClick={verifyOtp}
                      disabled={otp.join('').length !== 4}
                      className="w-full py-4 bg-emerald-600 text-white rounded-xl font-semibold disabled:opacity-50"
                    >
                      Verify OTP
                    </button>
                    <p className="text-center">
                      <button className="text-sm text-emerald-600 font-medium hover:underline">
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
