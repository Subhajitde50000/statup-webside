'use client';

import React, { useState } from 'react';
import { 
  ArrowLeft, ArrowRight, Camera, CheckCircle2, 
  IndianRupee, TrendingUp, Loader2, Store, Users, Truck,
  AlertCircle, Eye, EyeOff
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Shop categories
const shopCategories = [
  { id: 'electronics', name: 'Electronics', icon: '📱' },
  { id: 'mobile', name: 'Mobile & Accessories', icon: '📲' },
  { id: 'fashion', name: 'Fashion & Apparel', icon: '👕' },
  { id: 'grocery', name: 'Grocery & Essentials', icon: '🛒' },
  { id: 'pharmacy', name: 'Pharmacy', icon: '💊' },
  { id: 'hardware', name: 'Hardware & Tools', icon: '🔧' },
  { id: 'home_decor', name: 'Home & Decor', icon: '🏠' },
  { id: 'beauty', name: 'Beauty & Personal Care', icon: '💄' },
  { id: 'sports', name: 'Sports & Fitness', icon: '⚽' },
  { id: 'stationery', name: 'Books & Stationery', icon: '📚' },
  { id: 'jewelry', name: 'Jewelry', icon: '💎' },
  { id: 'other', name: 'Other', icon: '🏪' },
];

const benefits = [
  { icon: Users, title: '10,000+', desc: 'Daily Active Users' },
  { icon: TrendingUp, title: '40%', desc: 'Average Sales Increase' },
  { icon: IndianRupee, title: '₹50,000+', desc: 'Avg Monthly Earnings' },
  { icon: Truck, title: 'Free', desc: 'Delivery Support' },
];

export default function ShopRegistrationPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    ownerName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    shopName: '',
    category: '',
    description: '',
    shopAddress: '',
    city: '',
    pincode: '',
    gstNumber: '',
    hasGst: false,
    agreeTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [shopImage, setShopImage] = useState<string>('');
  const [shopImageFile, setShopImageFile] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { setApiError('Image size should be less than 5MB'); return; }
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) { setApiError('Please select a valid image file'); return; }
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
        if (!formData.ownerName.trim()) newErrors.ownerName = 'Owner name is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Enter valid 10-digit number';
        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        break;
      case 2:
        if (!formData.shopName.trim()) newErrors.shopName = 'Shop name is required';
        if (!formData.category) newErrors.category = 'Select your shop category';
        break;
      case 3:
        if (!formData.shopAddress.trim()) newErrors.shopAddress = 'Shop address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
        else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = 'Enter valid 6-digit pincode';
        if (!formData.agreeTerms) newErrors.agreeTerms = 'Please accept the terms';
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (currentStep === 0) { setCurrentStep(1); return; }
    if (validateStep(currentStep) && currentStep < 3) setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => { if (currentStep > 1) setCurrentStep(prev => prev - 1); };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;
    setIsSubmitting(true);
    setApiError('');
    
    try {
      let shopImageUrl = '';
      if (shopImageFile) {
        const formDataImg = new FormData();
        formDataImg.append('file', shopImageFile);
        try {
          const uploadResponse = await fetch('http://localhost:8000/api/upload/shop-image', { method: 'POST', body: formDataImg });
          if (uploadResponse.ok) { const uploadData = await uploadResponse.json(); shopImageUrl = uploadData.file_url; }
        } catch (err) { console.error('Image upload failed:', err); }
      }
      
      const registrationData = {
        owner_name: formData.ownerName,
        phone: formData.phone,
        email: formData.email || undefined,
        password: formData.password,
        shop_name: formData.shopName,
        category: formData.category,
        description: formData.description || undefined,
        shop_address: formData.shopAddress,
        city: formData.city,
        pincode: formData.pincode,
        gst_number: formData.gstNumber || undefined,
        has_gst: formData.hasGst,
        shop_image: shopImageUrl || undefined,
      };
      
      const response = await fetch('http://localhost:8000/api/verifications/shop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationData),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Registration failed');
      router.push(`/register/status?phone=${encodeURIComponent(formData.phone)}`);
    } catch (error: any) {
      setApiError(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Landing Page
  if (currentStep === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Store className="w-5 h-5" />
                </div>
                <span className="font-bold text-lg">ElectroMart Seller</span>
              </Link>
              <Link href="/auth" className="text-sm font-medium hover:underline">Already Registered? Login</Link>
            </div>
          </div>
          <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Grow Your Business <span className="text-yellow-400">Online</span></h1>
              <p className="text-lg text-blue-100 mb-8">Register your shop and reach thousands of customers. Easy setup, powerful tools, and dedicated support.</p>
              <button onClick={() => setCurrentStep(1)} className="bg-white text-blue-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-lg">
                Register Your Shop <ArrowRight className="w-5 h-5 inline ml-2" />
              </button>
            </div>
          </div>
        </div>
        <div className="py-12 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="bg-white rounded-xl p-6 text-center shadow-sm">
                  <benefit.icon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-gray-900">{benefit.title}</h3>
                  <p className="text-sm text-gray-500">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="py-12">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">Choose Your Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {shopCategories.slice(0, 8).map((category) => (
                <div key={category.id} className="bg-white border rounded-xl p-4 hover:shadow-md transition-all cursor-pointer">
                  <div className="text-3xl mb-2">{category.icon}</div>
                  <h3 className="font-semibold text-gray-900">{category.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="py-12 bg-blue-700 text-white">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start?</h2>
            <p className="text-blue-100 mb-6">Join thousands of sellers growing their business with ElectroMart</p>
            <button onClick={() => setCurrentStep(1)} className="bg-white text-blue-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all">
              Register Now - It's Free
            </button>
          </div>
        </div>
      </div>
    );
  }

  const stepTitles = ['', 'Owner Details', 'Shop Info', 'Location'];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => currentStep === 1 ? setCurrentStep(0) : prevStep()} className="p-2">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="text-center">
            <h1 className="font-semibold text-gray-900">{stepTitles[currentStep]}</h1>
            <p className="text-xs text-gray-500">Step {currentStep} of 3</p>
          </div>
          <div className="w-9" />
        </div>
        <div className="h-1 bg-gray-100">
          <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${(currentStep / 3) * 100}%` }} />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {apiError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
            <p className="text-red-700 text-sm">{apiError}</p>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name *</label>
              <input type="text" name="ownerName" value={formData.ownerName} onChange={handleInputChange} className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 ${errors.ownerName ? 'border-red-500' : 'border-gray-300'}`} placeholder="Enter owner's full name" />
              {errors.ownerName && <p className="text-red-500 text-xs mt-1">{errors.ownerName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
              <div className="flex">
                <span className="px-4 py-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-xl text-gray-500">+91</span>
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} maxLength={10} className={`flex-1 px-4 py-3 border rounded-r-xl focus:ring-2 focus:ring-blue-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`} placeholder="10-digit mobile number" />
              </div>
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email (Optional)</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500" placeholder="your@email.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleInputChange} className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`} placeholder="Create a password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                  {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`} placeholder="Confirm your password" />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <label className="relative cursor-pointer">
                <div className="w-32 h-32 rounded-xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                  {shopImage ? <img src={shopImage} alt="Shop" className="w-full h-full object-cover" /> : <Camera className="w-8 h-8 text-gray-400" />}
                </div>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <Camera className="w-4 h-4 text-white" />
                </div>
              </label>
            </div>
            <p className="text-center text-sm text-gray-500">Upload shop photo (optional)</p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name *</label>
              <input type="text" name="shopName" value={formData.shopName} onChange={handleInputChange} className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 ${errors.shopName ? 'border-red-500' : 'border-gray-300'}`} placeholder="Your shop name" />
              {errors.shopName && <p className="text-red-500 text-xs mt-1">{errors.shopName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Shop Category *</label>
              <div className="grid grid-cols-2 gap-3">
                {shopCategories.map((category) => (
                  <button key={category.id} type="button" onClick={() => setFormData(prev => ({ ...prev, category: category.id }))}
                    className={`p-4 border rounded-xl text-left transition-all ${formData.category === category.id ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-600' : 'border-gray-200 hover:border-gray-300'}`}>
                    <span className="text-2xl">{category.icon}</span>
                    <h3 className="font-medium text-gray-900 mt-1">{category.name}</h3>
                  </button>
                ))}
              </div>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} rows={2} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500" placeholder="Brief description of your shop..." />
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Shop Address *</label>
              <textarea name="shopAddress" value={formData.shopAddress} onChange={handleInputChange} rows={2} className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 ${errors.shopAddress ? 'border-red-500' : 'border-gray-300'}`} placeholder="Your shop's full address" />
              {errors.shopAddress && <p className="text-red-500 text-xs mt-1">{errors.shopAddress}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                <input type="text" name="city" value={formData.city} onChange={handleInputChange} className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 ${errors.city ? 'border-red-500' : 'border-gray-300'}`} placeholder="City" />
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} maxLength={6} className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 ${errors.pincode ? 'border-red-500' : 'border-gray-300'}`} placeholder="6-digit pincode" />
                {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" name="hasGst" checked={formData.hasGst} onChange={handleInputChange} className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <label className="text-sm text-gray-700">I have GST registration</label>
            </div>
            {formData.hasGst && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
                <input type="text" name="gstNumber" value={formData.gstNumber} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500" placeholder="Your GST number" />
              </div>
            )}
            <div className="pt-4 border-t">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" name="agreeTerms" checked={formData.agreeTerms} onChange={handleInputChange} className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-0.5" />
                <span className="text-sm text-gray-600">I agree to the <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>. I understand my registration will be reviewed.</span>
              </label>
              {errors.agreeTerms && <p className="text-red-500 text-xs mt-1">{errors.agreeTerms}</p>}
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800">What happens next?</h4>
                  <p className="text-sm text-blue-700 mt-1">After you submit, our team will review your registration. This usually takes 24-48 hours. You'll be able to login once approved.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="max-w-2xl mx-auto">
          {currentStep < 3 ? (
            <button onClick={nextStep} className="w-full py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
              Continue <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={isSubmitting} className="w-full py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
              {isSubmitting ? (<><Loader2 className="w-5 h-5 animate-spin" />Submitting...</>) : (<><CheckCircle2 className="w-5 h-5" />Submit Registration</>)}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
