'use client';

import React, { useState, useEffect } from 'react';
import { Edit2, MapPin, Upload, X, Camera, Clock, Check, Copy, Calendar, Save, AlertCircle, CheckCircle2, Building2, Mail, Phone as PhoneIcon, FileText, Image as ImageIcon, RefreshCw, CreditCard, ShieldCheck } from 'lucide-react';
import ShopkeeperNavbar from '../components/ShopkeeperNavbar';
import Link from 'next/link';

interface UserProfile {
  id: string;
  name: string;
  email?: string;
  phone: string;
  role: string;
  is_active: boolean;
  is_verified?: boolean;
  profile_image?: string;
  created_at: string;
  updated_at: string;
}

export default function ShopProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  
  const [shopData, setShopData] = useState({
    shopName: '',
    email: '',
    phone: '',
    countryCode: '+91',
    address: '',
    gstNumber: '',
    category: 'Electrical & Hardware',
    established: '',
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        console.error('No access token found');
        return;
      }

      const response = await fetch('http://localhost:8000/api/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setUserProfile(data);
      
      // Populate form with user data
      setShopData({
        shopName: data.name || '',
        email: data.email || '',
        phone: data.phone?.replace(/^\+91/, '') || '',
        countryCode: '+91',
        address: '',
        gstNumber: '',
        category: 'Electrical & Hardware',
        established: '',
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const [shopPhotos, setShopPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=800',
    'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800',
    'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800',
  ]);

  const [operatingHours, setOperatingHours] = useState([
    { day: 'Monday', openTime: '09:00 AM', closeTime: '10:00 PM', isOpen: true },
    { day: 'Tuesday', openTime: '09:00 AM', closeTime: '10:00 PM', isOpen: true },
    { day: 'Wednesday', openTime: '09:00 AM', closeTime: '10:00 PM', isOpen: true },
    { day: 'Thursday', openTime: '09:00 AM', closeTime: '10:00 PM', isOpen: true },
    { day: 'Friday', openTime: '09:00 AM', closeTime: '10:00 PM', isOpen: true },
    { day: 'Saturday', openTime: '09:00 AM', closeTime: '10:00 PM', isOpen: true },
    { day: 'Sunday', openTime: '09:00 AM', closeTime: '10:00 PM', isOpen: false },
  ]);

  const handleProfilePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      setProfilePhotoFile(file);
      setProfilePhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleProfilePhotoUpload = async () => {
    if (!profilePhotoFile) return;

    setIsUploadingPhoto(true);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        alert('Please login again');
        return;
      }

      const formData = new FormData();
      formData.append('file', profilePhotoFile);

      const response = await fetch('http://localhost:8000/api/users/upload-profile-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to upload photo');
      }

      await fetchUserProfile();
      setProfilePhotoFile(null);
      setProfilePhotoPreview(null);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 4000);
    } catch (err) {
      console.error('Error uploading photo:', err);
      alert(err instanceof Error ? err.message : 'Failed to upload photo');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const cancelProfilePhotoUpload = () => {
    setProfilePhotoFile(null);
    setProfilePhotoPreview(null);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPhotos = Array.from(files).slice(0, 5 - shopPhotos.length).map(file => URL.createObjectURL(file));
      setShopPhotos([...shopPhotos, ...newPhotos]);
    }
  };

  const removePhoto = (index: number) => {
    setShopPhotos(shopPhotos.filter((_, i) => i !== index));
  };

  const replacePhoto = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newPhoto = URL.createObjectURL(file);
      const updated = [...shopPhotos];
      updated[index] = newPhoto;
      setShopPhotos(updated);
    }
  };

  const toggleDay = (index: number) => {
    const updated = [...operatingHours];
    updated[index].isOpen = !updated[index].isOpen;
    setOperatingHours(updated);
  };

  const updateTime = (index: number, field: 'openTime' | 'closeTime', value: string) => {
    const updated = [...operatingHours];
    updated[index][field] = value;
    setOperatingHours(updated);
  };

  const copyToAllDays = () => {
    const firstDay = operatingHours[0];
    const updated = operatingHours.map(day => ({
      ...day,
      openTime: firstDay.openTime,
      closeTime: firstDay.closeTime,
      isOpen: firstDay.isOpen,
    }));
    setOperatingHours(updated);
  };

  const markHoliday = (index: number) => {
    const updated = [...operatingHours];
    updated[index].isOpen = false;
    setOperatingHours(updated);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateGST = (gst: string) => {
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gst === '' || gstRegex.test(gst);
  };

  const validatePhone = (phone: string) => {
    return phone.length === 10 && /^\d+$/.test(phone);
  };

  const handleInputChange = (field: string, value: string) => {
    setShopData({ ...shopData, [field]: value });
    // Clear error when user types
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!shopData.shopName.trim()) newErrors.shopName = 'Shop name is required';
    if (!shopData.email.trim()) newErrors.email = 'Email is required';
    else if (!validateEmail(shopData.email)) newErrors.email = 'Invalid email format';
    if (!shopData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!validatePhone(shopData.phone)) newErrors.phone = 'Phone must be 10 digits';
    if (!shopData.address.trim()) newErrors.address = 'Address is required';
    if (shopData.gstNumber && !validateGST(shopData.gstNumber)) {
      newErrors.gstNumber = 'Invalid GST format (e.g., 07AAACA8765D1Z4)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSaving(true);
    
    try {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        alert('Please login again');
        return;
      }

      const response = await fetch('http://localhost:8000/api/users/update-profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: shopData.shopName,
          email: shopData.email || undefined,
          phone: shopData.countryCode + shopData.phone,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update profile');
      }

      await fetchUserProfile();
      
      setIsEditing(false);
      setShowSuccessMessage(true);
      
      setTimeout(() => setShowSuccessMessage(false), 4000);
    } catch (err) {
      console.error('Error saving profile:', err);
      alert(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to discard all changes?')) {
      // Reset to original data
      if (userProfile) {
        setShopData({
          shopName: userProfile.name || '',
          email: userProfile.email || '',
          phone: userProfile.phone?.replace(/^\+91/, '') || '',
          countryCode: '+91',
          address: '',
          gstNumber: '',
          category: 'Electrical & Hardware',
          established: '',
        });
      }
      setIsEditing(false);
      setErrors({});
    }
  };

  if (isLoading) {
    return (
      <>
        <ShopkeeperNavbar />
        <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="w-12 h-12 text-[#FF7A22] animate-spin mx-auto mb-4" />
            <p className="text-[#777777]">Loading profile...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <ShopkeeperNavbar />
      <div className="min-h-screen bg-[#F8F8F8] pb-24 lg:pb-8">
        {/* Success Message */}
        {showSuccessMessage && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
            <div className="bg-[#28C76F] text-white px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3">
              <CheckCircle2 className="w-6 h-6" />
              <span className="font-semibold">Profile updated successfully!</span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 lg:px-8 py-6 lg:py-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-[#1F1F1F] flex items-center space-x-3">
                <Building2 className="w-8 h-8 text-[#FF7A22]" />
                <span>Shop Profile</span>
              </h1>
              <p className="text-sm lg:text-base text-[#777777] mt-2">
                {isEditing ? 'Edit your business details below' : 'Update your business details anytime'}
              </p>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-[#FF7A22] text-white px-4 md:px-6 py-2.5 md:py-3 rounded-lg font-semibold hover:bg-[#E66A12] transition-all duration-200 shadow-md hover:shadow-lg flex items-center space-x-2"
              >
                <Edit2 className="w-4 h-4 md:w-5 md:h-5" />
                <span className="hidden md:inline">Edit Profile</span>
                <span className="md:hidden">Edit</span>
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="px-4 lg:px-8 py-6 lg:py-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Profile Photo Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 lg:p-8">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="bg-[#FF7A22]/10 p-3 rounded-xl">
                    <Camera className="w-6 h-6 text-[#FF7A22]" />
                  </div>
                  <div>
                    <h2 className="text-lg lg:text-xl font-bold text-[#1F1F1F]">Profile Photo</h2>
                    <p className="text-xs text-[#777777] mt-0.5">Upload your shop or profile picture</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Current Photo */}
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#FF7A22] bg-gray-100 flex items-center justify-center">
                    {profilePhotoPreview ? (
                      <img src={profilePhotoPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : userProfile?.profile_image ? (
                      <img src={`http://localhost:8000${userProfile.profile_image}`} alt={userProfile.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-[#FF7A22] flex items-center justify-center text-white text-3xl font-bold">
                        {shopData.shopName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>

                {/* Upload Controls */}
                <div className="flex-1">
                  {profilePhotoFile ? (
                    <div className="space-y-3">
                      <p className="text-sm text-[#28C76F] font-medium flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Photo selected: {profilePhotoFile.name}
                      </p>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={handleProfilePhotoUpload}
                          disabled={isUploadingPhoto}
                          className="bg-[#28C76F] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#22A55D] transition-all duration-200 shadow-md hover:shadow-lg flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isUploadingPhoto ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              <span>Uploading...</span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4" />
                              <span>Upload Photo</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={cancelProfilePhotoUpload}
                          disabled={isUploadingPhoto}
                          className="bg-gray-200 text-[#2E2E2E] px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <X className="w-4 h-4" />
                          <span>Cancel</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-[#777777]">
                        Choose a photo that represents your shop. Accepted formats: JPG, PNG (max 5MB)
                      </p>
                      <label className="inline-flex items-center space-x-2 bg-[#FF7A22] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#E66A12] transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer">
                        <Camera className="w-4 h-4" />
                        <span>Choose Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePhotoSelect}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Shop Details Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 lg:p-8">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="bg-[#FF7A22]/10 p-3 rounded-xl">
                    <Building2 className="w-6 h-6 text-[#FF7A22]" />
                  </div>
                  <div>
                    <h2 className="text-lg lg:text-xl font-bold text-[#1F1F1F]">Shop Details</h2>
                    <p className="text-xs text-[#777777] mt-0.5">Basic information about your business</p>
                  </div>
                </div>
                {!isEditing && (
                  <div className="flex items-center space-x-2 text-[#28C76F]">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-sm font-medium hidden sm:inline">Verified</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Shop Name */}
                <div>
                  <label className="block text-sm font-semibold text-[#2E2E2E] mb-2 flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-[#777777]" />
                    <span>Shop Name <span className="text-[#EA5455]">*</span></span>
                  </label>
                  <input
                    type="text"
                    value={shopData.shopName}
                    onChange={(e) => handleInputChange('shopName', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Enter shop name"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 disabled:bg-gray-50 disabled:text-gray-600 transition ${
                      errors.shopName ? 'border-[#EA5455] focus:ring-[#EA5455]' : 'border-gray-300 focus:ring-[#FF7A22] focus:border-transparent'
                    }`}
                  />
                  {errors.shopName && (
                    <p className="text-[#EA5455] text-xs mt-1 flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.shopName}</span>
                    </p>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-sm font-semibold text-[#2E2E2E] mb-2 flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-[#777777]" />
                    <span>Email Address <span className="text-[#EA5455]">*</span></span>
                  </label>
                  <input
                    type="email"
                    value={shopData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                    placeholder="shop@example.com"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 disabled:bg-gray-50 disabled:text-gray-600 transition ${
                      errors.email ? 'border-[#EA5455] focus:ring-[#EA5455]' : 'border-gray-300 focus:ring-[#FF7A22] focus:border-transparent'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-[#EA5455] text-xs mt-1 flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-semibold text-[#2E2E2E] mb-2 flex items-center space-x-2">
                    <PhoneIcon className="w-4 h-4 text-[#777777]" />
                    <span>Phone Number <span className="text-[#EA5455]">*</span></span>
                  </label>
                  <div className="flex space-x-2">
                    <select
                      value={shopData.countryCode}
                      onChange={(e) => setShopData({ ...shopData, countryCode: e.target.value })}
                      disabled={!isEditing}
                      className="w-24 px-3 py-3 border border-gray-300 rounded-lg bg-gray-50 text-sm font-medium text-[#2E2E2E] focus:outline-none focus:ring-2 focus:ring-[#FF7A22] disabled:opacity-60"
                    >
                      <option value="+91">🇮🇳 +91</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+971">🇦🇪 +971</option>
                    </select>
                    <input
                      type="tel"
                      value={shopData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                      disabled={!isEditing}
                      placeholder="9876543210"
                      maxLength={10}
                      className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 disabled:bg-gray-50 disabled:text-gray-600 transition ${
                        errors.phone ? 'border-[#EA5455] focus:ring-[#EA5455]' : 'border-gray-300 focus:ring-[#FF7A22] focus:border-transparent'
                      }`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-[#EA5455] text-xs mt-1 flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.phone}</span>
                    </p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">
                    Business Category <span className="text-[#EA5455]">*</span>
                  </label>
                  <select
                    value={shopData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7A22] disabled:bg-gray-50 disabled:text-gray-600 transition"
                  >
                    <option value="Electrical & Hardware">Electrical & Hardware</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Grocery">Grocery</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Home & Kitchen">Home & Kitchen</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Established Year */}
                <div>
                  <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">
                    Established Year
                  </label>
                  <input
                    type="text"
                    value={shopData.established}
                    onChange={(e) => handleInputChange('established', e.target.value.replace(/\D/g, '').slice(0, 4))}
                    disabled={!isEditing}
                    placeholder="2015"
                    maxLength={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7A22] disabled:bg-gray-50 disabled:text-gray-600 transition"
                  />
                </div>

                {/* GST Number */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-[#2E2E2E] mb-2 flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-[#777777]" />
                    <span>GST Number <span className="text-[#777777] font-normal text-xs">(optional but recommended)</span></span>
                  </label>
                  <input
                    type="text"
                    value={shopData.gstNumber}
                    onChange={(e) => handleInputChange('gstNumber', e.target.value.toUpperCase())}
                    disabled={!isEditing}
                    placeholder="07AAACA8765D1Z4"
                    maxLength={15}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 disabled:bg-gray-50 disabled:text-gray-600 transition uppercase ${
                      errors.gstNumber ? 'border-[#EA5455] focus:ring-[#EA5455]' : 'border-gray-300 focus:ring-[#FF7A22] focus:border-transparent'
                    }`}
                  />
                  {errors.gstNumber && (
                    <p className="text-[#EA5455] text-xs mt-1 flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.gstNumber}</span>
                    </p>
                  )}
                  {!errors.gstNumber && shopData.gstNumber && (
                    <p className="text-[#28C76F] text-xs mt-1 flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>GST format is valid</span>
                    </p>
                  )}
                </div>

                {/* Full Address - Full Width */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-[#2E2E2E] mb-2 flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-[#777777]" />
                      <span>Full Address <span className="text-[#EA5455]">*</span></span>
                    </span>
                    {isEditing && (
                      <button 
                        onClick={() => alert('Google Maps integration coming soon')}
                        className="text-[#4A90E2] text-xs font-medium flex items-center space-x-1 hover:text-[#357ABD] transition bg-[#4A90E2]/10 px-3 py-1.5 rounded-lg"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Use Google Maps</span>
                      </button>
                    )}
                  </label>
                  <textarea
                    value={shopData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Enter complete address with landmark (Shop No., Street, Area, City, State, PIN Code)"
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 disabled:bg-gray-50 disabled:text-gray-600 transition resize-none ${
                      errors.address ? 'border-[#EA5455] focus:ring-[#EA5455]' : 'border-gray-300 focus:ring-[#FF7A22] focus:border-transparent'
                    }`}
                  />
                  {errors.address && (
                    <p className="text-[#EA5455] text-xs mt-1 flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.address}</span>
                    </p>
                  )}
                  <p className="text-[#777777] text-xs mt-2">This address will be shown to customers placing orders</p>
                </div>
              </div>
            </div>

            {/* Shop Photos Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 lg:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-4 border-b border-gray-200 gap-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-[#FF7A22]/10 p-3 rounded-xl">
                    <Camera className="w-6 h-6 text-[#FF7A22]" />
                  </div>
                  <div>
                    <h2 className="text-lg lg:text-xl font-bold text-[#1F1F1F]">Shop Photos</h2>
                    <p className="text-xs text-[#777777] mt-0.5">Showcase your shop to customers</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 bg-[#4A90E2]/10 px-3 py-2 rounded-lg">
                  <ImageIcon className="w-4 h-4 text-[#4A90E2]" />
                  <p className="text-xs text-[#4A90E2] font-medium">
                    <span className="font-bold">{shopPhotos.length}/5</span> photos • 1200x800px recommended
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {shopPhotos.map((photo, index) => (
                  <div key={index} className="relative group aspect-square">
                    <img
                      src={photo}
                      alt={`Shop ${index + 1}`}
                      className="w-full h-full object-cover rounded-xl border-2 border-gray-200 group-hover:border-[#FF7A22] transition"
                    />
                    <div className="absolute top-2 left-2 bg-[#FF7A22] text-white text-xs font-bold px-2 py-1 rounded-md">
                      #{index + 1}
                    </div>
                    {isEditing && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 flex flex-col items-center justify-end pb-3 space-y-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => replacePhoto(index, e)}
                          className="hidden"
                          id={`replace-${index}`}
                        />
                        <label
                          htmlFor={`replace-${index}`}
                          className="cursor-pointer bg-[#4A90E2] text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-[#357ABD] transition flex items-center space-x-1 shadow-lg"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Replace</span>
                        </label>
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to remove this photo?')) {
                              removePhoto(index);
                            }
                          }}
                          className="bg-[#EA5455] text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-[#D63031] transition flex items-center space-x-1 shadow-lg"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                {/* Add Photo Box */}
                {shopPhotos.length < 5 && isEditing && (
                  <div className="aspect-square">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                      className="hidden"
                      id="add-photo"
                    />
                    <label
                      htmlFor="add-photo"
                      className="w-full h-full border-2 border-dashed border-[#FF7A22] rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-[#FF7A22]/5 transition group"
                    >
                      <Upload className="w-8 h-8 text-[#FF7A22] mb-2 group-hover:scale-110 transition" />
                      <span className="text-sm font-medium text-[#FF7A22]">Add Photo</span>
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Operating Hours Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 lg:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-4 border-b border-gray-200 gap-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-[#FF7A22]/10 p-3 rounded-xl">
                    <Clock className="w-6 h-6 text-[#FF7A22]" />
                  </div>
                  <div>
                    <h2 className="text-lg lg:text-xl font-bold text-[#1F1F1F]">Operating Hours</h2>
                    <p className="text-xs text-[#777777] mt-0.5">Set your business hours</p>
                  </div>
                </div>
                {isEditing && (
                  <button
                    onClick={() => {
                      if (window.confirm('Copy Monday\'s timings to all days?')) {
                        copyToAllDays();
                      }
                    }}
                    className="text-[#4A90E2] text-sm font-semibold flex items-center space-x-2 hover:text-[#357ABD] transition bg-[#4A90E2]/10 px-4 py-2 rounded-lg"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy to All Days</span>
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {operatingHours.map((schedule, index) => (
                  <div
                    key={schedule.day}
                    className={`grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 rounded-lg border transition ${
                      schedule.isOpen
                        ? 'bg-white border-gray-200'
                        : 'bg-gray-50 border-gray-200 opacity-60'
                    }`}
                  >
                    {/* Day Name */}
                    <div className="md:col-span-2">
                      <span className="font-semibold text-[#2E2E2E] flex items-center space-x-2">
                        <span>{schedule.day}</span>
                        {!schedule.isOpen && (
                          <span className="text-xs bg-[#EA5455] text-white px-2 py-0.5 rounded-full">Holiday</span>
                        )}
                      </span>
                    </div>

                    {/* Open Time */}
                    <div className="md:col-span-3">
                      <label className="block text-xs text-[#777777] mb-1 md:hidden">Open Time</label>
                      <select
                        value={schedule.openTime}
                        onChange={(e) => updateTime(index, 'openTime', e.target.value)}
                        disabled={!isEditing || !schedule.isOpen}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90E2] disabled:bg-gray-100 disabled:text-gray-500 text-sm"
                      >
                        {generateTimeOptions().map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>

                    {/* Separator */}
                    <div className="hidden md:flex md:col-span-1 justify-center">
                      <span className="text-[#777777]">to</span>
                    </div>

                    {/* Close Time */}
                    <div className="md:col-span-3">
                      <label className="block text-xs text-[#777777] mb-1 md:hidden">Close Time</label>
                      <select
                        value={schedule.closeTime}
                        onChange={(e) => updateTime(index, 'closeTime', e.target.value)}
                        disabled={!isEditing || !schedule.isOpen}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90E2] disabled:bg-gray-100 disabled:text-gray-500 text-sm"
                      >
                        {generateTimeOptions().map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>

                    {/* Toggle & Actions */}
                    <div className="md:col-span-3 flex items-center justify-between md:justify-end space-x-3">
                      {isEditing && schedule.isOpen && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Mark ${schedule.day} as holiday?`)) {
                              markHoliday(index);
                            }
                          }}
                          className="text-[#EA5455] text-xs font-semibold flex items-center space-x-1 hover:text-[#D63031] transition bg-[#EA5455]/10 px-3 py-1.5 rounded-lg"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Holiday</span>
                        </button>
                      )}
                      <button
                        onClick={() => isEditing && toggleDay(index)}
                        disabled={!isEditing}
                        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-200 ${
                          schedule.isOpen ? 'bg-[#28C76F] shadow-md' : 'bg-gray-300'
                        } ${!isEditing ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:shadow-lg'}`}
                      >
                        <span
                          className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-200 ${
                            schedule.isOpen ? 'translate-x-7' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Bottom Bar - Only show when editing */}
        {isEditing && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-2xl z-40 lg:left-0">
            <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
              <div className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
                <div className="hidden sm:flex items-center space-x-2 text-[#777777] text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>Make sure to save your changes before leaving</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:flex-1 sm:justify-end">
                  <button
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="flex-1 sm:flex-initial sm:w-36 px-6 py-3 bg-gray-200 text-[#2E2E2E] rounded-lg font-semibold hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <X className="w-5 h-5" />
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 sm:flex-initial sm:w-44 px-6 py-3 bg-[#FF7A22] text-white rounded-lg font-semibold hover:bg-[#E66A12] transition shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isSaving ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Subscription Section - Mobile Only */}
      <div className="lg:hidden px-4 pb-6">
        <Link href="/shopkeeper/subscription">
          <div className="bg-gradient-to-r from-[#FF7A22] to-[#E66A12] rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Subscription Plans</h3>
                  <p className="text-sm text-orange-100 mt-1">Manage your subscription</p>
                </div>
              </div>
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
          </div>
        </Link>
      </div>
    </>
  );
}

// Helper function to generate time options
function generateTimeOptions() {
  const times = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let min = 0; min < 60; min += 30) {
      const period = hour < 12 ? 'AM' : 'PM';
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      const displayMin = min.toString().padStart(2, '0');
      times.push(`${displayHour.toString().padStart(2, '0')}:${displayMin} ${period}`);
    }
  }
  return times;
}
