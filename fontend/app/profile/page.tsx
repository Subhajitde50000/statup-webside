'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Settings, Edit2, MapPin, CreditCard, Star, Clock, Shield, HelpCircle, Phone, MessageCircle, AlertCircle, LogOut, Plus, ChevronRight, Home, Briefcase, Check, Circle, Loader2, Mail, User as UserIcon, X, Eye, EyeOff, Camera } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/utils/AuthContext';
import { updateProfile, changePassword, APIError } from '@/utils/auth';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout, refreshUser } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Edit modal states
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');
  
  // Edit form states
  const [editName, setEditName] = useState('');
  const [editProfileImage, setEditProfileImage] = useState('');
  
  // Password form states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [isLoading, isAuthenticated, router]);

  // Initialize edit form with current user data
  useEffect(() => {
    if (user) {
      setEditName(user.name || '');
      setEditProfileImage(user.profile_image || '');
    }
  }, [user]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setUpdateError('');
    setUpdateSuccess('');

    try {
      const updateData: { name?: string; profile_image?: string } = {};
      
      if (editName && editName !== user?.name) {
        updateData.name = editName;
      }
      if (editProfileImage !== user?.profile_image) {
        updateData.profile_image = editProfileImage || undefined;
      }

      if (Object.keys(updateData).length === 0) {
        setUpdateError('No changes to save');
        setIsUpdating(false);
        return;
      }

      await updateProfile(updateData);
      await refreshUser();
      setUpdateSuccess('Profile updated successfully!');
      
      setTimeout(() => {
        setShowEditProfileModal(false);
        setUpdateSuccess('');
      }, 1500);
    } catch (error) {
      if (error instanceof APIError) {
        setUpdateError(error.message);
      } else {
        setUpdateError('Failed to update profile. Please try again.');
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setUpdateError('');
    setUpdateSuccess('');

    if (newPassword !== confirmPassword) {
      setUpdateError('New passwords do not match');
      setIsUpdating(false);
      return;
    }

    if (newPassword.length < 6) {
      setUpdateError('Password must be at least 6 characters');
      setIsUpdating(false);
      return;
    }

    try {
      await changePassword({
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword
      });
      setUpdateSuccess('Password changed successfully!');
      
      // Reset form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      setTimeout(() => {
        setShowChangePasswordModal(false);
        setUpdateSuccess('');
      }, 1500);
    } catch (error) {
      if (error instanceof APIError) {
        setUpdateError(error.message);
      } else {
        setUpdateError('Failed to change password. Please try again.');
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const openEditProfileModal = () => {
    setEditName(user?.name || '');
    setEditProfileImage(user?.profile_image || '');
    setUpdateError('');
    setUpdateSuccess('');
    setShowEditProfileModal(true);
  };

  const openChangePasswordModal = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setUpdateError('');
    setUpdateSuccess('');
    setShowChangePasswordModal(true);
  };

  // Calculate profile completion
  const calculateProfileCompletion = () => {
    if (!user) return 0;
    let completed = 0;
    const total = 6;
    
    if (user.name) completed++;
    if (user.email) completed++;
    if (user.phone) completed++;
    if (user.email_verified) completed++;
    if (user.phone_verified) completed++;
    if (user.profile_image) completed++;
    
    return Math.round((completed / total) * 100);
  };

  const profileCompletion = calculateProfileCompletion();

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#0066FF] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#0066FF] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">My Profile</h1>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Settings className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Profile Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* User Identity Section */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Profile Photo */}
                <div className="relative">
                  <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gradient-to-br from-[#0066FF] to-[#0052CC] flex items-center justify-center">
                    {user.profile_image ? (
                      <Image 
                        src={user.profile_image} 
                        alt="Profile"
                        width={112}
                        height={112}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-4xl font-bold">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={openEditProfileModal}
                    className="absolute bottom-0 right-0 bg-[#0066FF] text-white p-2 rounded-full shadow-lg hover:bg-[#0052CC] transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>

                {/* User Details */}
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">{user.name || 'User'}</h2>
                  <p className="text-gray-600 mb-1">{user.phone || 'No phone added'}</p>
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-3 flex-wrap">
                    <p className="text-gray-600">{user.email || 'No email added'}</p>
                    {user.is_verified && (
                      <span className="flex items-center gap-1 text-[#0066FF] text-sm font-medium">
                        <Check className="w-4 h-4" />
                        Verified User
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                      user.role === 'professional' ? 'bg-green-100 text-green-700' :
                      user.role === 'shopkeeper' ? 'bg-orange-100 text-orange-700' :
                      user.role === 'manager' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {user.role}
                    </span>
                    {user.email_verified && (
                      <span className="flex items-center gap-1 text-green-600 text-xs">
                        <Mail className="w-3 h-3" />
                        Email Verified
                      </span>
                    )}
                    {user.phone_verified && (
                      <span className="flex items-center gap-1 text-green-600 text-xs">
                        <Phone className="w-3 h-3" />
                        Phone Verified
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={openEditProfileModal}
                    className="bg-[#0066FF] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#0052CC] transition-colors flex items-center gap-2 mx-auto md:mx-0"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                </div>
              </div>

              {/* Profile Completion Bar */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-700">
                    YOUR PROFILE IS {profileCompletion}% COMPLETE
                  </p>
                  <span className="text-sm text-gray-600">{profileCompletion}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      profileCompletion === 100 ? 'bg-green-500' : 'bg-[#0066FF]'
                    }`} 
                    style={{ width: `${profileCompletion}%` }}
                  ></div>
                </div>
                {profileCompletion < 100 && (
                  <p className="text-sm text-gray-500 mt-2">
                    {!user.profile_image && 'Add a profile photo. '}
                    {!user.email_verified && 'Verify your email. '}
                    {!user.phone_verified && 'Verify your phone. '}
                  </p>
                )}
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Full Name:</label>
                  <p className="text-gray-900 font-medium">{user.name || 'Not set'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Phone Number:</label>
                  <div className="flex items-center gap-2">
                    <p className="text-gray-900 font-medium">{user.phone || 'Not added'}</p>
                    {user.phone_verified && <Check className="w-4 h-4 text-green-500" />}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Email Address:</label>
                  <div className="flex items-center gap-2">
                    <p className="text-gray-900 font-medium">{user.email || 'Not added'}</p>
                    {user.email_verified && <Check className="w-4 h-4 text-green-500" />}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Role:</label>
                  <p className="text-gray-900 font-medium capitalize">{user.role}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Account Created:</label>
                  <p className="text-gray-900 font-medium">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    }) : 'Unknown'}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Account Status:</label>
                  <p className={`font-medium ${user.is_verified ? 'text-green-600' : 'text-orange-600'}`}>
                    {user.is_verified ? 'Verified' : 'Pending Verification'}
                  </p>
                </div>
              </div>
              <button 
                onClick={openEditProfileModal}
                className="w-full mt-6 bg-[#0066FF] text-white py-3 rounded-lg font-medium hover:bg-[#0052CC] transition-colors flex items-center justify-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Edit Details
              </button>
            </div>

            {/* Saved Addresses */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Saved Addresses</h3>
              
              {/* Empty state */}
              <div className="text-center py-8 text-gray-500">
                <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="mb-2">No addresses saved yet</p>
                <p className="text-sm">Add your home or work address for faster booking</p>
              </div>

              {/* Add Address Button */}
              <button className="w-full mt-4 bg-[#00C28C] text-white py-3 rounded-lg font-medium hover:bg-[#00A876] transition-colors flex items-center justify-center gap-2">
                <Plus className="w-5 h-5" />
                Add Address
              </button>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Methods</h3>
              
              {/* Empty state */}
              <div className="text-center py-8 text-gray-500">
                <CreditCard className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="mb-2">No payment methods added</p>
                <p className="text-sm">Add a card or UPI for seamless payments</p>
              </div>

              <div className="flex gap-3 mt-4">
                <button className="flex-1 bg-[#0066FF] text-white py-3 rounded-lg font-medium hover:bg-[#0052CC] transition-colors">
                  Add Card
                </button>
                <button className="flex-1 bg-[#0066FF] text-white py-3 rounded-lg font-medium hover:bg-[#0052CC] transition-colors">
                  Link UPI
                </button>
              </div>
            </div>

            {/* Booking History */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Booking History</h3>
              
              {/* Empty state */}
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="mb-2">No bookings yet</p>
                <p className="text-sm">Your completed bookings will appear here</p>
                <button 
                  onClick={() => router.push('/service')}
                  className="mt-4 bg-[#0066FF] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#0052CC] transition-colors"
                >
                  Browse Services
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Favorite Professionals */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Favorite Professionals</h3>
              
              {/* Empty state */}
              <div className="text-center py-6 text-gray-500">
                <Star className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No favorites yet</p>
                <p className="text-xs mt-1">Save professionals you like for quick booking</p>
              </div>
            </div>

            {/* Support Tickets */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Support Tickets</h3>
              
              {/* Empty state */}
              <div className="text-center py-6 text-gray-500">
                <HelpCircle className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No support tickets</p>
              </div>
            </div>

            {/* App Settings */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">App Settings</h3>
              
              <div className="space-y-4">
                {/* Dark Mode */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                      <Circle className="w-5 h-5 text-gray-700" />
                    </div>
                    <span className="text-gray-900 font-medium">Dark Mode</span>
                  </div>
                  <button 
                    onClick={() => setDarkMode(!darkMode)}
                    className={`w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-[#00C28C]' : 'bg-gray-300'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-1'}`}></div>
                  </button>
                </div>

                {/* Notification Settings */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-gray-700" />
                    </div>
                    <span className="text-gray-900 font-medium">Notification Settings</span>
                  </div>
                  <button 
                    onClick={() => setNotifications(!notifications)}
                    className={`w-12 h-6 rounded-full transition-colors ${notifications ? 'bg-[#00C28C]' : 'bg-gray-300'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${notifications ? 'translate-x-6' : 'translate-x-1'}`}></div>
                  </button>
                </div>

                {/* Language */}
                <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                      <Globe className="w-5 h-5 text-gray-700" />
                    </div>
                    <span className="text-gray-900 font-medium">Language</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Privacy & Security */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Privacy & Security</h3>
              
              <div className="space-y-2">
                <button 
                  onClick={openChangePasswordModal}
                  className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-gray-700" />
                    <span className="text-gray-900 font-medium">Change Password</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>

                <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-gray-700" />
                    <span className="text-gray-900 font-medium">Enable 2-Step OTP</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>

                <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-700" />
                    <span className="text-gray-900 font-medium">Active Sessions</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>

                <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors text-red-600">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-medium">Delete Account</span>
                  </div>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Help & Support */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Help & Support</h3>
              
              <div className="space-y-2">
                <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-5 h-5 text-gray-700" />
                    <span className="text-gray-900 font-medium">Chat with Support</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>

                <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-700" />
                    <span className="text-gray-900 font-medium">Call Support</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>

                <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-gray-700" />
                    <span className="text-gray-900 font-medium">FAQs</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>

                <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-gray-700" />
                    <span className="text-gray-900 font-medium">Report an Issue</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Logout Button */}
            <button 
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-4 rounded-xl font-bold hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Logging out...
                </>
              ) : (
                <>
                  <LogOut className="w-5 h-5" />
                  Log Out
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
              <button 
                onClick={() => setShowEditProfileModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={handleUpdateProfile} className="p-6 space-y-6">
              {/* Profile Image Preview */}
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gradient-to-br from-[#0066FF] to-[#0052CC] flex items-center justify-center mb-4">
                  {editProfileImage ? (
                    <Image 
                      src={editProfileImage} 
                      alt="Profile"
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-3xl font-bold">
                      {editName?.charAt(0).toUpperCase() || user?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  )}
                </div>
                <label className="text-sm text-gray-500">Profile Image URL (optional)</label>
              </div>

              {/* Profile Image URL Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Image URL
                </label>
                <input
                  type="url"
                  value={editProfileImage}
                  onChange={(e) => setEditProfileImage(e.target.value)}
                  placeholder="https://example.com/your-image.jpg"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0066FF] focus:border-transparent outline-none transition-all text-gray-900"
                />
                <p className="text-xs text-gray-500 mt-1">Enter a URL to an image, or leave blank to use initials</p>
              </div>

              {/* Name Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0066FF] focus:border-transparent outline-none transition-all text-gray-900"
                />
              </div>

              {/* Read-only fields */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">The following fields cannot be changed here:</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500">Email</label>
                    <p className="text-gray-700 text-sm">{user?.email || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Phone</label>
                    <p className="text-gray-700 text-sm">{user?.phone || 'Not set'}</p>
                  </div>
                </div>
              </div>

              {/* Error/Success Messages */}
              {updateError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {updateError}
                </div>
              )}
              {updateSuccess && (
                <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  {updateSuccess}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isUpdating}
                className="w-full bg-[#0066FF] text-white py-3 rounded-xl font-bold hover:bg-[#0052CC] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Change Password</h2>
              <button 
                onClick={() => setShowChangePasswordModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={handleChangePassword} className="p-6 space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    required
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0066FF] focus:border-transparent outline-none transition-all text-gray-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    minLength={6}
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0066FF] focus:border-transparent outline-none transition-all text-gray-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0066FF] focus:border-transparent outline-none transition-all text-gray-900"
                />
              </div>

              {/* Error/Success Messages */}
              {updateError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {updateError}
                </div>
              )}
              {updateSuccess && (
                <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  {updateSuccess}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isUpdating}
                className="w-full bg-[#0066FF] text-white py-3 rounded-xl font-bold hover:bg-[#0052CC] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Changing Password...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    Change Password
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Missing Globe import - adding it
function Globe({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
