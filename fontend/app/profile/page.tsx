'use client';

import React, { useState } from 'react';
import { ArrowLeft, Settings, Edit2, MapPin, CreditCard, Star, Clock, Shield, HelpCircle, Phone, MessageCircle, AlertCircle, LogOut, Plus, ChevronRight, Home, Briefcase, Check, Circle } from 'lucide-react';
import Image from 'next/image';

export default function ProfilePage() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
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
                  <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <Image 
                      src="/api/placeholder/112/112" 
                      alt="Profile"
                      width={112}
                      height={112}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button className="absolute bottom-0 right-0 bg-[#0066FF] text-white p-2 rounded-full shadow-lg hover:bg-[#0052CC] transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>

                {/* User Details */}
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">Subhajit De</h2>
                  <p className="text-gray-600 mb-1">+91 XXXXXXX</p>
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                    <p className="text-gray-600">user@gmail.com</p>
                    <span className="flex items-center gap-1 text-[#0066FF] text-sm font-medium">
                      <Check className="w-4 h-4" />
                      Verified User
                    </span>
                  </div>
                  <button className="bg-[#0066FF] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#0052CC] transition-colors flex items-center gap-2 mx-auto md:mx-0">
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                </div>
              </div>

              {/* Profile Completion Bar */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-700">
                    YOUR PROFILE IS 70% COMPLETE
                  </p>
                  <span className="text-sm text-gray-600">70%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-[#0066FF] rounded-full" style={{ width: '70%' }}></div>
                </div>
                <p className="text-sm text-gray-500 mt-2">Add an address to finish.</p>
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Full Name:</label>
                  <p className="text-gray-900 font-medium">Subhajit De</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Phone Number:</label>
                  <p className="text-gray-900 font-medium">+91 XXXXXXX</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Email Address:</label>
                  <p className="text-gray-900 font-medium">user@gmail.com</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Gender:</label>
                  <p className="text-gray-900 font-medium">Male</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Date of Birth:</label>
                  <p className="text-gray-900 font-medium">01/01/1990</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Preferred Language:</label>
                  <p className="text-gray-900 font-medium">English</p>
                </div>
              </div>
              <button className="w-full mt-6 bg-[#0066FF] text-white py-3 rounded-lg font-medium hover:bg-[#0052CC] transition-colors flex items-center justify-center gap-2">
                <Edit2 className="w-4 h-4" />
                Edit Details
              </button>
            </div>

            {/* Saved Addresses */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Saved Addresses</h3>
              
              {/* Home Address */}
              <div className="border border-gray-200 rounded-xl p-4 mb-3">
                <div className="flex items-start gap-3">
                  <div className="bg-[#0066FF]/10 p-2 rounded-lg">
                    <Home className="w-5 h-5 text-[#0066FF]" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">Home</h4>
                    <p className="text-sm text-gray-600">Sample Address, Address, Sexfo roa...</p>
                  </div>
                </div>
                <div className="flex gap-3 mt-3 pl-11">
                  <button className="text-[#0066FF] text-sm font-medium hover:underline">Edit</button>
                  <span className="text-gray-300">|</span>
                  <button className="text-red-500 text-sm font-medium hover:underline">Delete</button>
                </div>
              </div>

              {/* Work Address */}
              <div className="border border-gray-200 rounded-xl p-4 mb-4">
                <div className="flex items-start gap-3">
                  <div className="bg-[#0066FF]/10 p-2 rounded-lg">
                    <Briefcase className="w-5 h-5 text-[#0066FF]" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">Work</h4>
                    <p className="text-sm text-gray-600">Sample Address, Address, Costem i...</p>
                  </div>
                </div>
                <div className="flex gap-3 mt-3 pl-11">
                  <button className="text-[#0066FF] text-sm font-medium hover:underline">Edit</button>
                  <span className="text-gray-300">|</span>
                  <button className="text-red-500 text-sm font-medium hover:underline">Delete</button>
                </div>
              </div>

              {/* Location Picker */}
              <p className="text-sm text-gray-600 mb-3">
                <span className="font-semibold">Location Picker</span>
                <br />
                Open a moder location picker.
              </p>

              {/* Add Address Button */}
              <button className="w-full bg-[#00C28C] text-white py-3 rounded-lg font-medium hover:bg-[#00A876] transition-colors flex items-center justify-center gap-2">
                <Plus className="w-5 h-5" />
                Add Address
              </button>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Methods</h3>
              
              <div className="space-y-3 mb-4">
                {/* Visa Card */}
                <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl">
                  <CreditCard className="w-6 h-6 text-gray-700" />
                  <span className="text-gray-900 font-medium">Visa ending 4578</span>
                </div>

                {/* GPay */}
                <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 via-green-500 to-yellow-500"></div>
                  <span className="text-gray-900 font-medium">GPay linked</span>
                </div>

                {/* Paytm */}
                <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl">
                  <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-white text-xs font-bold">P</div>
                  <span className="text-gray-900 font-medium">Paytm Wallet linked</span>
                </div>
              </div>

              <div className="flex gap-3">
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
              
              <div className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-start gap-3 mb-3">
                  <Circle className="w-5 h-5 text-[#00C28C] fill-[#00C28C] mt-1" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">Electrical – Fan Repair</h4>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-600">
                        Provider: <span className="font-medium">Rahul Das</span>
                        <span className="ml-2 inline-flex items-center gap-1 text-[#00C28C]">
                          <Check className="w-3 h-3" />
                          Completed
                        </span>
                      </p>
                      <p className="text-gray-600">Date: 11 Oct 2025</p>
                      <p className="text-gray-600">Total Paid: <span className="font-semibold text-gray-900">₹450</span></p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="flex-1 border-2 border-[#0066FF] text-[#0066FF] py-2 rounded-lg font-medium hover:bg-[#0066FF] hover:text-white transition-colors">
                    View Invoice
                  </button>
                  <button className="flex-1 bg-[#0066FF] text-white py-2 rounded-lg font-medium hover:bg-[#0052CC] transition-colors">
                    Rate Service
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Favorite Professionals */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Favorite Professionals</h3>
              
              {/* Professional 1 */}
              <div className="border border-gray-200 rounded-xl p-4 mb-3">
                <div className="flex gap-3 mb-3">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                    <Image 
                      src="/api/placeholder/64/64" 
                      alt="Professional"
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">Rahul Das — Electrician</h4>
                    <div className="flex items-center gap-1 mb-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-medium text-gray-900">4.9</span>
                    </div>
                    <p className="text-xs text-gray-600">Wiring | Repairs | Installation</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">₹250/hr</span>
                  <button className="bg-[#0066FF] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0052CC] transition-colors">
                    Book Again
                  </button>
                </div>
              </div>

              {/* Professional 2 */}
              <div className="border border-gray-200 rounded-xl p-4">
                <div className="flex gap-3 mb-3">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                    <Image 
                      src="/api/placeholder/64/64" 
                      alt="Professional"
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">Mac leat</h4>
                    <div className="flex items-center gap-1 mb-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-medium text-gray-900">4.9</span>
                    </div>
                    <p className="text-xs text-gray-600">Wiring | Rep...</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">₹250/hr</span>
                  <button className="bg-[#0066FF] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0052CC] transition-colors">
                    Book Again
                  </button>
                </div>
              </div>
            </div>

            {/* Saved Support Tickets */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Saved Support Tickets</h3>
              
              <div className="border border-gray-200 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Ticket ID #2191 —</h4>
                <p className="text-sm text-gray-600 mb-3">Complaint about late arrival</p>
                <div className="flex items-center justify-between">
                  <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                    Resolved
                  </span>
                  <button className="border-2 border-[#0066FF] text-[#0066FF] px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-[#0066FF] hover:text-white transition-colors">
                    View Details
                  </button>
                </div>
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
                <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
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
            <button className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-4 rounded-xl font-bold hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
              <LogOut className="w-5 h-5" />
              Log Out
            </button>
          </div>
        </div>
      </div>
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
