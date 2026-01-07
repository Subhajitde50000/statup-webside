'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Edit2, MapPin, Upload, X, Camera, Award, Check, Calendar, Save, AlertCircle, 
  CheckCircle2, User, Mail, Phone as PhoneIcon, FileText, Briefcase, RefreshCw,
  IndianRupee, Clock, Star, Shield, BadgeCheck, Wrench, Languages, Plus, Globe,
  Building, Zap, MapPinned, CalendarDays, CreditCard, ShieldCheck, LogOut
} from 'lucide-react';
import ProfessionalNavbar from '../components/ProfessionalNavbar';
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
  approval_data?: {
    bio?: string;
    experience?: string;
    hourly_rate?: number;
    service_areas?: string[];
    skills?: string[];
    languages?: string[];
    certifications?: string[];
    working_hours_start?: string;
    working_hours_end?: string;
    working_days?: string[];
    emergency_available?: boolean;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    category?: string;
    sub_category?: string;
  };
}

// Days of the week for working days selection
const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Available languages
const AVAILABLE_LANGUAGES = ['Hindi', 'English', 'Bengali', 'Telugu', 'Marathi', 'Tamil', 'Gujarati', 'Kannada', 'Malayalam', 'Punjabi', 'Odia'];

// Service categories
const SERVICE_CATEGORIES = [
  'Electrician', 'Plumber', 'Carpenter', 'Painter', 'AC Technician', 
  'Appliance Repair', 'Cleaning', 'Pest Control', 'Home Renovation', 'Security Systems', 'Solar Installation', 'Other'
];

export default function ProfessionalProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isSavingBusinessProfile, setIsSavingBusinessProfile] = useState(false);
  const [activeTab, setActiveTab] = useState<'personal' | 'business'>('personal');
  
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phone: '',
    countryCode: '+91',
    address: '',
    city: '',
    state: '',
    pincode: '',
    category: 'Electrician',
    subCategory: '',
    experience: '',
    hourlyRate: '',
    visitingCharge: '',
    availability: 'full-time',
    languages: [] as string[],
    skills: [] as string[],
    bio: '',
    aadharNumber: '',
    // Business profile fields
    serviceAreas: [] as string[],
    certifications: [] as string[],
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as string[],
    workingHoursStart: '09:00',
    workingHoursEnd: '18:00',
    emergencyAvailable: false,
  });

  const [newSkill, setNewSkill] = useState('');
  const [newServiceArea, setNewServiceArea] = useState('');
  const [newCertification, setNewCertification] = useState('');

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
      
      // Get approval_data for business profile
      const approvalData = data.approval_data || {};
      
      // Populate form with user data
      setProfileData({
        fullName: data.name || '',
        email: data.email || '',
        phone: data.phone?.replace(/^\+91/, '') || '',
        countryCode: '+91',
        address: approvalData.address || '',
        city: approvalData.city || '',
        state: approvalData.state || '',
        pincode: approvalData.pincode || '',
        category: approvalData.category || 'Electrician',
        subCategory: approvalData.sub_category || '',
        experience: approvalData.experience || '',
        hourlyRate: approvalData.hourly_rate?.toString() || '',
        visitingCharge: approvalData.visiting_charge?.toString() || '',
        availability: 'full-time',
        languages: approvalData.languages || [],
        skills: approvalData.skills || [],
        bio: approvalData.bio || '',
        aadharNumber: '',
        // Business profile
        serviceAreas: approvalData.service_areas || [],
        certifications: approvalData.certifications || [],
        workingDays: approvalData.working_days || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        workingHoursStart: approvalData.working_hours_start || '09:00',
        workingHoursEnd: approvalData.working_hours_end || '18:00',
        emergencyAvailable: approvalData.emergency_available || false,
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
      setProfileData({ ...profileData, skills: [...profileData.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setProfileData({ ...profileData, skills: profileData.skills.filter(s => s !== skill) });
  };

  const addServiceArea = () => {
    if (newServiceArea.trim() && !profileData.serviceAreas.includes(newServiceArea.trim())) {
      setProfileData({ ...profileData, serviceAreas: [...profileData.serviceAreas, newServiceArea.trim()] });
      setNewServiceArea('');
    }
  };

  const removeServiceArea = (area: string) => {
    setProfileData({ ...profileData, serviceAreas: profileData.serviceAreas.filter(a => a !== area) });
  };

  const addCertification = () => {
    if (newCertification.trim() && !profileData.certifications.includes(newCertification.trim())) {
      setProfileData({ ...profileData, certifications: [...profileData.certifications, newCertification.trim()] });
      setNewCertification('');
    }
  };

  const removeCertification = (cert: string) => {
    setProfileData({ ...profileData, certifications: profileData.certifications.filter(c => c !== cert) });
  };

  const toggleWorkingDay = (day: string) => {
    if (profileData.workingDays.includes(day)) {
      setProfileData({ ...profileData, workingDays: profileData.workingDays.filter(d => d !== day) });
    } else {
      setProfileData({ ...profileData, workingDays: [...profileData.workingDays, day] });
    }
  };

  const toggleLanguage = (lang: string) => {
    if (profileData.languages.includes(lang)) {
      setProfileData({ ...profileData, languages: profileData.languages.filter(l => l !== lang) });
    } else {
      setProfileData({ ...profileData, languages: [...profileData.languages, lang] });
    }
  };

  // Save business profile to backend
  const saveBusinessProfile = async () => {
    setIsSavingBusinessProfile(true);
    
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        alert('Please login again');
        return;
      }

      // Build query params for the business profile update
      const params = new URLSearchParams();
      
      if (profileData.bio) params.append('bio', profileData.bio);
      if (profileData.experience) params.append('experience', profileData.experience);
      if (profileData.hourlyRate) params.append('hourly_rate', profileData.hourlyRate);
      if (profileData.visitingCharge) params.append('visiting_charge', profileData.visitingCharge);
      profileData.serviceAreas.forEach(area => params.append('service_areas', area));
      profileData.skills.forEach(skill => params.append('skills', skill));
      profileData.languages.forEach(lang => params.append('languages', lang));
      profileData.certifications.forEach(cert => params.append('certifications', cert));
      if (profileData.workingHoursStart) params.append('working_hours_start', profileData.workingHoursStart);
      if (profileData.workingHoursEnd) params.append('working_hours_end', profileData.workingHoursEnd);
      profileData.workingDays.forEach(day => params.append('working_days', day));
      params.append('emergency_available', String(profileData.emergencyAvailable));
      if (profileData.address) params.append('address', profileData.address);
      if (profileData.city) params.append('city', profileData.city);
      if (profileData.state) params.append('state', profileData.state);
      if (profileData.pincode) params.append('pincode', profileData.pincode);

      const response = await fetch(`http://localhost:8000/api/users/professional-profile?${params.toString()}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update business profile');
      }

      await fetchUserProfile();
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 4000);
    } catch (err) {
      console.error('Error saving business profile:', err);
      alert(err instanceof Error ? err.message : 'Failed to save business profile');
    } finally {
      setIsSavingBusinessProfile(false);
    }
  };

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

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    return phone.length === 10 && /^\d+$/.test(phone);
  };

  const validateAadhar = (aadhar: string) => {
    return aadhar === '' || (aadhar.length === 12 && /^\d+$/.test(aadhar));
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData({ ...profileData, [field]: value });
    // Clear error when user types
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!profileData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!profileData.email.trim()) newErrors.email = 'Email is required';
    else if (!validateEmail(profileData.email)) newErrors.email = 'Invalid email format';
    if (!profileData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!validatePhone(profileData.phone)) newErrors.phone = 'Phone must be 10 digits';
    if (!profileData.address.trim()) newErrors.address = 'Address is required';
    if (!profileData.city.trim()) newErrors.city = 'City is required';
    if (!profileData.state.trim()) newErrors.state = 'State is required';
    if (!profileData.pincode.trim()) newErrors.pincode = 'Pincode is required';
    else if (profileData.pincode.length !== 6) newErrors.pincode = 'Pincode must be 6 digits';
    if (profileData.aadharNumber && !validateAadhar(profileData.aadharNumber)) {
      newErrors.aadharNumber = 'Aadhar must be 12 digits';
    }
    if (profileData.hourlyRate && isNaN(Number(profileData.hourlyRate))) {
      newErrors.hourlyRate = 'Please enter a valid rate';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      // Clear all auth data
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      // Redirect to login
      router.push('/auth');
    }
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
          name: profileData.fullName,
          email: profileData.email || undefined,
          phone: profileData.countryCode + profileData.phone,
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
        setProfileData({
          fullName: userProfile.name || '',
          email: userProfile.email || '',
          phone: userProfile.phone?.replace(/^\+91/, '') || '',
          countryCode: '+91',
          address: '',
          city: '',
          state: '',
          pincode: '',
          category: 'Electrician',
          subCategory: '',
          experience: '',
          hourlyRate: '',
          visitingCharge: '',
          availability: 'full-time',
          languages: [],
          skills: [],
          bio: '',
          aadharNumber: '',
          serviceAreas: [],
          certifications: [],
          workingDays: [],
          workingHoursStart: '09:00',
          workingHoursEnd: '18:00',
          emergencyAvailable: false,
        });
      }
      setIsEditing(false);
      setErrors({});
    }
  };

  if (isLoading) {
    return (
      <>
        <ProfessionalNavbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
            <p className="text-[#64748B] font-medium">Loading your profile...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <ProfessionalNavbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 pb-24 lg:pb-8">
        {/* Success Message */}
        {showSuccessMessage && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
            <div className="bg-gradient-to-r from-teal-600 to-green-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center space-x-3">
              <CheckCircle2 className="w-6 h-6" />
              <span className="font-semibold text-lg">Profile updated successfully!</span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-green-600 text-white border-b border-teal-700/20 px-4 lg:px-8 py-8 lg:py-12 shadow-xl">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold flex items-center space-x-4">
                <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                  <User className="w-8 h-8" />
                </div>
                <span>Professional Profile</span>
              </h1>
              <p className="text-base lg:text-lg text-blue-100 mt-3 ml-16">
                {isEditing ? 'Edit your professional details below' : 'Manage your professional information'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {!isEditing && (
                <>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 md:px-8 py-3 md:py-3.5 rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2 transform hover:scale-105"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-white text-teal-600 px-6 md:px-8 py-3 md:py-3.5 rounded-xl font-bold hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2 transform hover:scale-105"
                  >
                    <Edit2 className="w-5 h-5 md:w-5 md:h-5" />
                    <span className="hidden md:inline">Edit Profile</span>
                    <span className="md:hidden">Edit</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 lg:px-8 py-6 lg:py-8">
          <div className="max-w-7xl mx-auto">
            {/* Tab Navigation */}
            <div className="flex gap-2 mb-6 bg-white p-2 rounded-2xl shadow-lg border border-gray-100">
              <button
                onClick={() => setActiveTab('personal')}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold transition-all ${
                  activeTab === 'personal'
                    ? 'bg-gradient-to-r from-teal-600 to-green-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <User className="w-5 h-5" />
                Personal Info
              </button>
              <button
                onClick={() => setActiveTab('business')}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold transition-all ${
                  activeTab === 'business'
                    ? 'bg-gradient-to-r from-teal-600 to-green-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Briefcase className="w-5 h-5" />
                Business Profile
              </button>
            </div>

            {/* Business Profile Tab Content */}
            {activeTab === 'business' && (
              <div className="space-y-6">
                {/* Bio Section */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
                  <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
                    <div className="bg-gradient-to-br from-teal-500 to-green-600 p-3 rounded-xl shadow-lg">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">About You</h2>
                      <p className="text-sm text-gray-500">Tell customers about yourself and your services</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Professional Bio</label>
                      <textarea
                        value={profileData.bio}
                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                        rows={4}
                        placeholder="Describe your experience, expertise, and what makes you stand out..."
                        className="w-full px-4 py-3 text-gray-900 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all resize-none"
                      />
                      <p className="text-xs text-gray-400 mt-1">{profileData.bio.length}/500 characters</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Experience</label>
                        <select
                          value={profileData.experience}
                          onChange={(e) => setProfileData({ ...profileData, experience: e.target.value })}
                          className="w-full px-4 py-3 text-gray-900 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 bg-white"
                        >
                          <option value="">Select experience</option>
                          <option value="0-1 years">0-1 years</option>
                          <option value="1-3 years">1-3 years</option>
                          <option value="3-5 years">3-5 years</option>
                          <option value="5-10 years">5-10 years</option>
                          <option value="10+ years">10+ years</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Service Charge (₹)</label>
                        <div className="relative">
                          <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="number"
                            value={profileData.hourlyRate}
                            onChange={(e) => setProfileData({ ...profileData, hourlyRate: e.target.value })}
                            placeholder="e.g., 500"
                            className="w-full pl-12 pr-4 py-3 text-gray-900 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Fixed charge for your services</p>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Visiting Charge (₹/hour)</label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="number"
                            value={profileData.visitingCharge}
                            onChange={(e) => setProfileData({ ...profileData, visitingCharge: e.target.value })}
                            placeholder="e.g., 100"
                            className="w-full pl-12 pr-4 py-3 text-gray-900 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Hourly charge for visiting customer</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Service Areas Section */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
                  <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl shadow-lg">
                      <MapPinned className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Service Areas</h2>
                      <p className="text-sm text-gray-500">Where do you provide your services?</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newServiceArea}
                        onChange={(e) => setNewServiceArea(e.target.value)}
                        placeholder="e.g., Mumbai, Thane, Navi Mumbai"
                        className="flex-1 px-4 py-3 text-gray-900 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addServiceArea())}
                      />
                      <button
                        onClick={addServiceArea}
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2"
                      >
                        <Plus className="w-5 h-5" />
                        Add
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {profileData.serviceAreas.map((area, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full font-medium"
                        >
                          <MapPin className="w-4 h-4" />
                          {area}
                          <button
                            onClick={() => removeServiceArea(area)}
                            className="hover:bg-green-200 rounded-full p-0.5 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </span>
                      ))}
                      {profileData.serviceAreas.length === 0 && (
                        <p className="text-gray-400 text-sm italic">No service areas added yet</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Skills Section */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
                  <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
                    <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-3 rounded-xl shadow-lg">
                      <Wrench className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Skills & Expertise</h2>
                      <p className="text-sm text-gray-500">Highlight your technical skills</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="e.g., Wiring, Fan Repair, AC Installation"
                        className="flex-1 px-4 py-3 text-gray-900 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      />
                      <button
                        onClick={addSkill}
                        className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2"
                      >
                        <Plus className="w-5 h-5" />
                        Add
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {profileData.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium"
                        >
                          {skill}
                          <button
                            onClick={() => removeSkill(skill)}
                            className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </span>
                      ))}
                      {profileData.skills.length === 0 && (
                        <p className="text-gray-400 text-sm italic">No skills added yet</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Languages Section */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
                  <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
                    <div className="bg-gradient-to-br from-orange-500 to-red-500 p-3 rounded-xl shadow-lg">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Languages</h2>
                      <p className="text-sm text-gray-500">Languages you can communicate in</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {AVAILABLE_LANGUAGES.map((lang) => {
                      const isSelected = profileData.languages.includes(lang);
                      return (
                        <button
                          key={lang}
                          onClick={() => toggleLanguage(lang)}
                          className={`px-4 py-3 rounded-xl font-medium transition-all ${
                            isSelected
                              ? 'bg-orange-500 text-white shadow-lg'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {lang}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Certifications Section */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
                  <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
                    <div className="bg-gradient-to-br from-yellow-500 to-amber-600 p-3 rounded-xl shadow-lg">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Certifications</h2>
                      <p className="text-sm text-gray-500">Professional certifications you hold</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newCertification}
                        onChange={(e) => setNewCertification(e.target.value)}
                        placeholder="e.g., Electrical Safety Certificate, ITI Diploma"
                        className="flex-1 px-4 py-3 text-gray-900 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
                      />
                      <button
                        onClick={addCertification}
                        className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2"
                      >
                        <Plus className="w-5 h-5" />
                        Add
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {profileData.certifications.map((cert, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full font-medium"
                        >
                          <Award className="w-4 h-4" />
                          {cert}
                          <button
                            onClick={() => removeCertification(cert)}
                            className="hover:bg-amber-200 rounded-full p-0.5 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </span>
                      ))}
                      {profileData.certifications.length === 0 && (
                        <p className="text-gray-400 text-sm italic">No certifications added yet</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Working Hours & Availability Section */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
                  <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
                    <div className="bg-gradient-to-br from-indigo-500 to-violet-600 p-3 rounded-xl shadow-lg">
                      <CalendarDays className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Working Hours & Availability</h2>
                      <p className="text-sm text-gray-500">Set your working schedule</p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Working Days */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Working Days</label>
                      <div className="flex flex-wrap gap-2">
                        {DAYS_OF_WEEK.map((day) => {
                          const isSelected = profileData.workingDays.includes(day);
                          return (
                            <button
                              key={day}
                              onClick={() => toggleWorkingDay(day)}
                              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                isSelected
                                  ? 'bg-indigo-500 text-white shadow-md'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              {day.slice(0, 3)}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    
                    {/* Working Hours */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Start Time</label>
                        <input
                          type="time"
                          value={profileData.workingHoursStart}
                          onChange={(e) => setProfileData({ ...profileData, workingHoursStart: e.target.value })}
                          className="w-full px-4 py-3 text-gray-900 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">End Time</label>
                        <input
                          type="time"
                          value={profileData.workingHoursEnd}
                          onChange={(e) => setProfileData({ ...profileData, workingHoursEnd: e.target.value })}
                          className="w-full px-4 py-3 text-gray-900 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                    
                    {/* Emergency Availability */}
                    <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border-2 border-red-200">
                      <div className="flex items-center gap-3">
                        <Zap className="w-6 h-6 text-red-500" />
                        <div>
                          <h4 className="font-semibold text-gray-900">Emergency Services</h4>
                          <p className="text-sm text-gray-500">Available for urgent/emergency calls</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setProfileData({ ...profileData, emergencyAvailable: !profileData.emergencyAvailable })}
                        className={`relative w-14 h-8 rounded-full transition-colors ${
                          profileData.emergencyAvailable ? 'bg-red-500' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                            profileData.emergencyAvailable ? 'right-1' : 'left-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Address Section */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
                  <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
                    <div className="bg-gradient-to-br from-teal-500 to-cyan-600 p-3 rounded-xl shadow-lg">
                      <Building className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Business Address</h2>
                      <p className="text-sm text-gray-500">Your workshop/office location</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Street Address</label>
                      <input
                        type="text"
                        value={profileData.address}
                        onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                        placeholder="Enter your full address"
                        className="w-full px-4 py-3 text-gray-900 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                      <input
                        type="text"
                        value={profileData.city}
                        onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                        placeholder="e.g., Mumbai"
                        className="w-full px-4 py-3 text-gray-900 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                      <input
                        type="text"
                        value={profileData.state}
                        onChange={(e) => setProfileData({ ...profileData, state: e.target.value })}
                        placeholder="e.g., Maharashtra"
                        className="w-full px-4 py-3 text-gray-900 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Pincode</label>
                      <input
                        type="text"
                        value={profileData.pincode}
                        onChange={(e) => setProfileData({ ...profileData, pincode: e.target.value })}
                        placeholder="e.g., 400001"
                        maxLength={6}
                        className="w-full px-4 py-3 text-gray-900 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex flex-col sm:flex-row gap-4 justify-end">
                  <button
                    onClick={handleLogout}
                    className="bg-red-50 hover:bg-red-100 text-red-600 px-8 py-4 rounded-xl font-bold transition-all border-2 border-red-200 hover:border-red-300 flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                  <button
                    onClick={saveBusinessProfile}
                    disabled={isSavingBusinessProfile}
                    className="bg-gradient-to-r from-teal-600 to-green-600 hover:from-teal-700 hover:to-green-700 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSavingBusinessProfile ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Save Business Profile
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Personal Info Tab Content */}
            {activeTab === 'personal' && (
              <div className="space-y-6">{/* Profile Photo Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-[#E2E8F0] p-6 md:p-8 lg:p-10 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-br from-teal-500 to-green-600 p-4 rounded-2xl shadow-lg">
                    <Camera className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl lg:text-2xl font-bold text-[#1E293B]">Profile Photo</h2>
                    <p className="text-sm text-[#64748B] mt-1">Upload a professional headshot</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Current Photo */}
                <div className="relative group">
                  <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-teal-600 bg-gradient-to-br from-teal-50 to-green-50 flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-shadow duration-300">
                    {profilePhotoPreview ? (
                      <img src={profilePhotoPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : userProfile?.profile_image ? (
                      <img src={`http://localhost:8000${userProfile.profile_image}`} alt={userProfile.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#2563EB] to-[#1E40AF] flex items-center justify-center text-white text-4xl font-bold">
                        {profileData.fullName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-2 right-2 bg-[#10B981] p-3 rounded-full shadow-lg">
                    <BadgeCheck className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* Upload Controls */}
                <div className="flex-1 w-full">
                  {profilePhotoFile ? (
                    <div className="space-y-4">
                      <div className="bg-[#F0FDF4] border border-[#86EFAC] rounded-xl p-4">
                        <p className="text-sm text-[#166534] font-medium flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5" />
                          Photo selected: {profilePhotoFile.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={handleProfilePhotoUpload}
                          disabled={isUploadingPhoto}
                          className="flex-1 bg-gradient-to-r from-[#10B981] to-[#059669] text-white px-6 py-3.5 rounded-xl font-bold hover:from-[#059669] hover:to-[#047857] transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                        >
                          {isUploadingPhoto ? (
                            <>
                              <RefreshCw className="w-5 h-5 animate-spin" />
                              <span>Uploading...</span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-5 h-5" />
                              <span>Upload Photo</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={cancelProfilePhotoUpload}
                          disabled={isUploadingPhoto}
                          className="bg-[#F1F5F9] text-[#475569] px-6 py-3.5 rounded-xl font-semibold hover:bg-[#E2E8F0] transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <X className="w-5 h-5" />
                          <span>Cancel</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] border-2 border-dashed border-[#93C5FD] rounded-xl p-6">
                        <p className="text-sm text-[#1E40AF] font-medium mb-4">
                          <strong>Tips for a great profile photo:</strong>
                        </p>
                        <ul className="text-xs text-[#475569] space-y-2 ml-4">
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                            Clear, well-lit headshot
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                            Professional attire preferred
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                            JPG, PNG formats (max 5MB)
                          </li>
                        </ul>
                      </div>
                      <label className="inline-flex items-center justify-center space-x-3 bg-gradient-to-r from-[#2563EB] to-[#1E40AF] text-white px-8 py-3.5 rounded-xl font-bold hover:from-[#1E40AF] hover:to-[#1E3A8A] transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer transform hover:scale-105">
                        <Camera className="w-5 h-5" />
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

            {/* Personal Details Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-[#E2E8F0] p-6 md:p-8 lg:p-10 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-br from-teal-500 to-green-600 p-4 rounded-2xl shadow-lg">
                    <User className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl lg:text-2xl font-bold text-[#1E293B]">Personal Details</h2>
                    <p className="text-sm text-[#64748B] mt-1">Basic information about yourself</p>
                  </div>
                </div>
                {!isEditing && userProfile?.is_verified && (
                  <div className="flex items-center space-x-2 bg-gradient-to-r from-teal-600 to-green-600 text-white px-4 py-2 rounded-xl shadow-lg">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-sm font-semibold hidden sm:inline">Verified</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-bold text-[#1E293B] mb-3 flex items-center space-x-2">
                    <div className="bg-gradient-to-br from-[#2563EB]/10 to-[#1E40AF]/10 p-2 rounded-lg">
                      <User className="w-4 h-4 text-[#2563EB]" />
                    </div>
                    <span>Full Name <span className="text-[#DC2626]">*</span></span>
                  </label>
                  <input
                    type="text"
                    value={profileData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Enter your full name"
                    className={`w-full px-5 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 disabled:bg-[#F1F5F9] disabled:text-[#64748B] transition-all duration-200 text-base ${
                      errors.fullName ? 'border-[#DC2626] focus:ring-[#DC2626]' : 'border-[#CBD5E1] focus:ring-teal-500 focus:border-teal-500'
                    }`}
                  />
                  {errors.fullName && (
                    <p className="text-[#DC2626] text-sm mt-2 flex items-center space-x-1.5 font-medium">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.fullName}</span>
                    </p>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-sm font-bold text-[#1E293B] mb-3 flex items-center space-x-2">
                    <div className="bg-gradient-to-br from-[#2563EB]/10 to-[#1E40AF]/10 p-2 rounded-lg">
                      <Mail className="w-4 h-4 text-[#2563EB]" />
                    </div>
                    <span>Email Address <span className="text-[#DC2626]">*</span></span>
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                    placeholder="your@email.com"
                    className={`w-full px-5 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 disabled:bg-[#F1F5F9] disabled:text-[#64748B] transition-all duration-200 text-base ${
                      errors.email ? 'border-[#DC2626] focus:ring-[#DC2626]' : 'border-[#CBD5E1] focus:ring-teal-500 focus:border-teal-500'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-[#DC2626] text-sm mt-2 flex items-center space-x-1.5 font-medium">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-bold text-[#1E293B] mb-3 flex items-center space-x-2">
                    <div className="bg-gradient-to-br from-[#2563EB]/10 to-[#1E40AF]/10 p-2 rounded-lg">
                      <PhoneIcon className="w-4 h-4 text-[#2563EB]" />
                    </div>
                    <span>Phone Number <span className="text-[#DC2626]">*</span></span>
                  </label>
                  <div className="flex space-x-3">
                    <select
                      value={profileData.countryCode}
                      onChange={(e) => setProfileData({ ...profileData, countryCode: e.target.value })}
                      disabled={!isEditing}
                      className="w-28 px-3 py-4 border-2 border-[#CBD5E1] rounded-xl bg-[#F8FAFC] text-sm font-bold text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] disabled:opacity-50 transition-all duration-200"
                    >
                      <option value="+91">🇮🇳 +91</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+971">🇦🇪 +971</option>
                    </select>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                      disabled={!isEditing}
                      placeholder="9876543210"
                      maxLength={10}
                      className={`flex-1 px-5 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 disabled:bg-[#F1F5F9] disabled:text-[#64748B] transition-all duration-200 text-base ${
                        errors.phone ? 'border-[#DC2626] focus:ring-[#DC2626]' : 'border-[#CBD5E1] focus:ring-teal-500 focus:border-teal-500'
                      }`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-[#DC2626] text-sm mt-2 flex items-center space-x-1.5 font-medium">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.phone}</span>
                    </p>
                  )}
                </div>

                {/* Service Category */}
                <div>
                  <label className="block text-sm font-bold text-[#1E293B] mb-3 flex items-center space-x-2">
                    <div className="bg-gradient-to-br from-[#2563EB]/10 to-[#1E40AF]/10 p-2 rounded-lg">
                      <Briefcase className="w-4 h-4 text-[#2563EB]" />
                    </div>
                    <span>Service Category <span className="text-[#DC2626]">*</span></span>
                  </label>
                  <select
                    value={profileData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-5 py-4 border-2 border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB] disabled:bg-[#F1F5F9] disabled:text-[#64748B] transition-all duration-200 text-base font-medium"
                  >
                    <option value="Electrician">Electrician</option>
                    <option value="Plumber">Plumber</option>
                    <option value="Carpenter">Carpenter</option>
                    <option value="Painter">Painter</option>
                    <option value="AC Technician">AC Technician</option>
                    <option value="Appliance Repair">Appliance Repair</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Sub Category */}
                <div>
                  <label className="block text-sm font-bold text-[#1E293B] mb-3 flex items-center space-x-2">
                    <div className="bg-gradient-to-br from-[#2563EB]/10 to-[#1E40AF]/10 p-2 rounded-lg">
                      <Wrench className="w-4 h-4 text-[#2563EB]" />
                    </div>
                    <span>Sub Category</span>
                  </label>
                  <input
                    type="text"
                    value={profileData.subCategory}
                    onChange={(e) => handleInputChange('subCategory', e.target.value)}
                    disabled={!isEditing}
                    placeholder="e.g., Residential Wiring, Industrial"
                    className="w-full px-5 py-4 border-2 border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-[#F1F5F9] disabled:text-[#64748B] transition-all duration-200 text-base"
                  />
                </div>

                {/* Years of Experience */}
                <div>
                  <label className="block text-sm font-bold text-[#1E293B] mb-3 flex items-center space-x-2">
                    <div className="bg-gradient-to-br from-[#2563EB]/10 to-[#1E40AF]/10 p-2 rounded-lg">
                      <Award className="w-4 h-4 text-[#2563EB]" />
                    </div>
                    <span>Years of Experience</span>
                  </label>
                  <input
                    type="text"
                    value={profileData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value.replace(/\D/g, '').slice(0, 2))}
                    disabled={!isEditing}
                    placeholder="5"
                    maxLength={2}
                    className="w-full px-5 py-4 border-2 border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-[#F1F5F9] disabled:text-[#64748B] transition-all duration-200 text-base"
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-bold text-[#1E293B] mb-3 flex items-center space-x-2">
                    <div className="bg-gradient-to-br from-[#2563EB]/10 to-[#1E40AF]/10 p-2 rounded-lg">
                      <MapPin className="w-4 h-4 text-[#2563EB]" />
                    </div>
                    <span>City <span className="text-[#DC2626]">*</span></span>
                  </label>
                  <input
                    type="text"
                    value={profileData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    disabled={!isEditing}
                    placeholder="e.g., Mumbai"
                    className={`w-full px-5 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 disabled:bg-[#F1F5F9] disabled:text-[#64748B] transition-all duration-200 text-base ${
                      errors.city ? 'border-[#DC2626] focus:ring-[#DC2626]' : 'border-[#CBD5E1] focus:ring-teal-500 focus:border-teal-500'
                    }`}
                  />
                  {errors.city && (
                    <p className="text-[#DC2626] text-sm mt-2 flex items-center space-x-1.5 font-medium">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.city}</span>
                    </p>
                  )}
                </div>

                {/* State */}
                <div>
                  <label className="block text-sm font-bold text-[#1E293B] mb-3 flex items-center space-x-2">
                    <div className="bg-gradient-to-br from-[#2563EB]/10 to-[#1E40AF]/10 p-2 rounded-lg">
                      <MapPin className="w-4 h-4 text-[#2563EB]" />
                    </div>
                    <span>State <span className="text-[#DC2626]">*</span></span>
                  </label>
                  <input
                    type="text"
                    value={profileData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    disabled={!isEditing}
                    placeholder="e.g., Maharashtra"
                    className={`w-full px-5 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 disabled:bg-[#F1F5F9] disabled:text-[#64748B] transition-all duration-200 text-base ${
                      errors.state ? 'border-[#DC2626] focus:ring-[#DC2626]' : 'border-[#CBD5E1] focus:ring-teal-500 focus:border-teal-500'
                    }`}
                  />
                  {errors.state && (
                    <p className="text-[#DC2626] text-sm mt-2 flex items-center space-x-1.5 font-medium">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.state}</span>
                    </p>
                  )}
                </div>

                {/* PIN Code */}
                <div>
                  <label className="block text-sm font-bold text-[#1E293B] mb-3 flex items-center space-x-2">
                    <div className="bg-gradient-to-br from-[#2563EB]/10 to-[#1E40AF]/10 p-2 rounded-lg">
                      <MapPin className="w-4 h-4 text-[#2563EB]" />
                    </div>
                    <span>PIN Code <span className="text-[#DC2626]">*</span></span>
                  </label>
                  <input
                    type="text"
                    value={profileData.pincode}
                    onChange={(e) => handleInputChange('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                    disabled={!isEditing}
                    placeholder="400001"
                    maxLength={6}
                    className={`w-full px-5 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 disabled:bg-[#F1F5F9] disabled:text-[#64748B] transition-all duration-200 text-base ${
                      errors.pincode ? 'border-[#DC2626] focus:ring-[#DC2626]' : 'border-[#CBD5E1] focus:ring-teal-500 focus:border-teal-500'
                    }`}
                  />
                  {errors.pincode && (
                    <p className="text-[#DC2626] text-sm mt-2 flex items-center space-x-1.5 font-medium">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.pincode}</span>
                    </p>
                  )}
                </div>

                {/* Hourly Rate */}
                <div>
                  <label className="block text-sm font-bold text-[#1E293B] mb-3 flex items-center space-x-2">
                    <div className="bg-gradient-to-br from-[#2563EB]/10 to-[#1E40AF]/10 p-2 rounded-lg">
                      <IndianRupee className="w-4 h-4 text-[#2563EB]" />
                    </div>
                    <span>Service Charge (₹)</span>
                  </label>
                  <input
                    type="text"
                    value={profileData.hourlyRate}
                    onChange={(e) => handleInputChange('hourlyRate', e.target.value.replace(/\D/g, '').slice(0, 5))}
                    disabled={!isEditing}
                    placeholder="500"
                    className="w-full px-5 py-4 border-2 border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-[#F1F5F9] disabled:text-[#64748B] transition-all duration-200 text-base"
                  />
                  <p className="text-xs text-gray-500 mt-1">Fixed charge for your services</p>
                </div>

                {/* Visiting Charge */}
                <div>
                  <label className="block text-sm font-bold text-[#1E293B] mb-3 flex items-center space-x-2">
                    <div className="bg-gradient-to-br from-[#10B981]/10 to-[#059669]/10 p-2 rounded-lg">
                      <MapPin className="w-4 h-4 text-[#10B981]" />
                    </div>
                    <span>Visiting Charge (₹/hour)</span>
                  </label>
                  <input
                    type="text"
                    value={profileData.visitingCharge}
                    onChange={(e) => handleInputChange('visitingCharge', e.target.value.replace(/\D/g, '').slice(0, 5))}
                    disabled={!isEditing}
                    placeholder="100"
                    className="w-full px-5 py-4 border-2 border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-[#F1F5F9] disabled:text-[#64748B] transition-all duration-200 text-base"
                  />
                  <p className="text-xs text-gray-500 mt-1">Hourly charge for visiting customer location</p>
                </div>

                {/* Availability */}
                <div>
                  <label className="block text-sm font-bold text-[#1E293B] mb-3 flex items-center space-x-2">
                    <div className="bg-gradient-to-br from-[#2563EB]/10 to-[#1E40AF]/10 p-2 rounded-lg">
                      <Clock className="w-4 h-4 text-[#2563EB]" />
                    </div>
                    <span>Availability</span>
                  </label>
                  <select
                    value={profileData.availability}
                    onChange={(e) => handleInputChange('availability', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-5 py-4 border-2 border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB] disabled:bg-[#F1F5F9] disabled:text-[#64748B] transition-all duration-200 text-base font-medium"
                  >
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="weekends">Weekends Only</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>

                {/* Aadhar Number */}
                <div>
                  <label className="block text-sm font-bold text-[#1E293B] mb-3 flex items-center space-x-2">
                    <div className="bg-gradient-to-br from-[#2563EB]/10 to-[#1E40AF]/10 p-2 rounded-lg">
                      <FileText className="w-4 h-4 text-[#2563EB]" />
                    </div>
                    <span>Aadhar Number <span className="text-[#64748B] font-normal text-xs">(optional)</span></span>
                  </label>
                  <input
                    type="text"
                    value={profileData.aadharNumber}
                    onChange={(e) => handleInputChange('aadharNumber', e.target.value.replace(/\D/g, '').slice(0, 12))}
                    disabled={!isEditing}
                    placeholder="123456789012"
                    maxLength={12}
                    className={`w-full px-5 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 disabled:bg-[#F1F5F9] disabled:text-[#64748B] transition-all duration-200 text-base ${
                      errors.aadharNumber ? 'border-[#DC2626] focus:ring-[#DC2626]' : 'border-[#CBD5E1] focus:ring-teal-500 focus:border-teal-500'
                    }`}
                  />
                  {errors.aadharNumber && (
                    <p className="text-[#DC2626] text-sm mt-2 flex items-center space-x-1.5 font-medium">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.aadharNumber}</span>
                    </p>
                  )}
                  {!errors.aadharNumber && profileData.aadharNumber && profileData.aadharNumber.length === 12 && (
                    <p className="text-[#10B981] text-sm mt-2 flex items-center space-x-1.5 font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Valid Aadhar number</span>
                    </p>
                  )}
                </div>

                {/* Full Address - Full Width */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-[#1E293B] mb-3 flex items-center space-x-2">
                    <div className="bg-gradient-to-br from-[#2563EB]/10 to-[#1E40AF]/10 p-2 rounded-lg">
                      <MapPin className="w-4 h-4 text-[#2563EB]" />
                    </div>
                    <span>Full Address <span className="text-[#DC2626]">*</span></span>
                  </label>
                  <textarea
                    value={profileData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    disabled={!isEditing}
                    placeholder="House No., Street, Area, Landmark..."
                    rows={3}
                    className={`w-full px-5 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 disabled:bg-[#F1F5F9] disabled:text-[#64748B] transition-all duration-200 resize-none text-base ${
                      errors.address ? 'border-[#DC2626] focus:ring-[#DC2626]' : 'border-[#CBD5E1] focus:ring-teal-500 focus:border-teal-500'
                    }`}
                  />
                  {errors.address && (
                    <p className="text-[#DC2626] text-sm mt-2 flex items-center space-x-1.5 font-medium">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.address}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-[#E2E8F0] p-6 md:p-8 lg:p-10 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-br from-teal-500 to-green-600 p-4 rounded-2xl shadow-lg">
                    <Wrench className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl lg:text-2xl font-bold text-[#1E293B]">Skills & Expertise</h2>
                    <p className="text-sm text-[#64748B] mt-1">Add your professional skills</p>
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="mb-6">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addSkill();
                        }
                      }}
                      placeholder="e.g., Circuit Installation, Troubleshooting"
                      className="flex-1 px-5 py-4 border-2 border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200 text-base"
                    />
                    <button
                      onClick={addSkill}
                      className="bg-gradient-to-r from-[#2563EB] to-[#1E40AF] text-white px-8 py-4 rounded-xl font-bold hover:from-[#1E40AF] hover:to-[#1E3A8A] transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2 transform hover:scale-105"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                {profileData.skills.length > 0 ? (
                  profileData.skills.map((skill, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-teal-50 to-green-50 border-2 border-teal-300 text-teal-800 px-5 py-3 rounded-xl font-semibold flex items-center space-x-3 shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <span>{skill}</span>
                      {isEditing && (
                        <button
                          onClick={() => removeSkill(skill)}
                          className="hover:bg-[#DC2626] hover:text-white rounded-lg p-1 transition-all duration-200"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center w-full py-8">
                    <div className="bg-[#F1F5F9] p-6 rounded-xl inline-block">
                      <Star className="w-12 h-12 text-[#94A3B8] mx-auto mb-3" />
                      <p className="text-[#64748B] font-medium">No skills added yet</p>
                      {isEditing && (
                        <p className="text-sm text-[#94A3B8] mt-2">Add skills to showcase your expertise</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Languages Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-[#E2E8F0] p-6 md:p-8 lg:p-10 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-br from-teal-500 to-green-600 p-4 rounded-2xl shadow-lg">
                    <Languages className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl lg:text-2xl font-bold text-[#1E293B]">Languages</h2>
                    <p className="text-sm text-[#64748B] mt-1">Select languages you can communicate in</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Bengali', 'Marathi'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => isEditing && toggleLanguage(lang)}
                    disabled={!isEditing}
                    className={`px-5 py-4 rounded-xl font-semibold transition-all duration-200 text-base ${
                      profileData.languages.includes(lang)
                        ? 'bg-gradient-to-r from-teal-600 to-green-600 text-white shadow-lg transform scale-105'
                        : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]'
                    } ${!isEditing ? 'cursor-default' : 'cursor-pointer hover:shadow-md'}`}
                  >
                    {profileData.languages.includes(lang) && (
                      <CheckCircle2 className="w-5 h-5 inline-block mr-2" />
                    )}
                    {lang}
                  </button>
                ))}
              </div>

              {profileData.languages.length === 0 && (
                <div className="text-center py-8 mt-6">
                  <div className="bg-[#F1F5F9] p-6 rounded-xl inline-block">
                    <Languages className="w-12 h-12 text-[#94A3B8] mx-auto mb-3" />
                    <p className="text-[#64748B] font-medium">No languages selected</p>
                    {isEditing && (
                      <p className="text-sm text-[#94A3B8] mt-2">Select at least one language</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Bio Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-[#E2E8F0] p-6 md:p-8 lg:p-10 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-br from-teal-500 to-green-600 p-4 rounded-2xl shadow-lg">
                    <FileText className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl lg:text-2xl font-bold text-[#1E293B]">Professional Bio</h2>
                    <p className="text-sm text-[#64748B] mt-1">Tell clients about yourself</p>
                  </div>
                </div>
              </div>

              <div>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Write a brief introduction about your professional background, expertise, and what makes you stand out..."
                  rows={6}
                  maxLength={500}
                  className="w-full px-5 py-4 border-2 border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-[#F1F5F9] disabled:text-[#64748B] transition-all duration-200 resize-none text-base"
                />
                <div className="flex items-center justify-between mt-3">
                  <p className="text-sm text-[#64748B]">
                    {profileData.bio ? (
                      <span className="font-medium text-[#2563EB]">{profileData.bio.length}/500 characters</span>
                    ) : (
                      <span>Maximum 500 characters</span>
                    )}
                  </p>
                  {isEditing && (
                    <div className="bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] px-4 py-2 rounded-lg border border-[#93C5FD]">
                      <p className="text-xs text-[#1E40AF] font-medium">💡 Tip: Highlight your unique skills and achievements</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="bg-white rounded-2xl shadow-lg border border-[#E2E8F0] p-6 md:p-8 flex items-center justify-end space-x-4 sticky bottom-4">
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="px-8 py-4 border-2 border-[#CBD5E1] text-[#475569] rounded-xl font-bold hover:bg-[#F1F5F9] hover:border-[#94A3B8] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md transform hover:scale-105"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-8 py-4 bg-gradient-to-r from-teal-600 to-green-600 text-white rounded-xl font-bold hover:from-teal-700 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-6 h-6 animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-6 h-6" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            )}
              </div>
            )}

            {/* Subscription Section - Mobile Only */}
            <div className="lg:hidden mt-6">
              <Link href="/professional/subscription">
                <div className="bg-gradient-to-r from-teal-600 to-green-600 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                        <CreditCard className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">Subscription Plans</h3>
                        <p className="text-sm text-blue-100 mt-1">Manage your subscription</p>
                      </div>
                    </div>
                    <ShieldCheck className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Link>
            </div>

            {/* Logout Button for Mobile */}
            <div className="lg:hidden mt-6">
              {!isEditing && (
                <button
                  onClick={handleLogout}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-4 rounded-2xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
                >
                  <LogOut className="w-6 h-6" />
                  <span className="text-lg">Logout from Account</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
