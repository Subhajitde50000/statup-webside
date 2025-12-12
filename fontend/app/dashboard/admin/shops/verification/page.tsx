'use client';

import React, { useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { CheckCircle2, XCircle, AlertTriangle, FileText, User, Store, MapPin, Phone, Mail, Calendar, Eye, Download, Shield, TrendingUp, Scan } from 'lucide-react';

export default function ShopVerificationPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [verificationData, setVerificationData] = useState({
    shopDetails: { verified: false, notes: '' },
    ownerVerification: { verified: false, notes: '' },
    documents: { verified: false, notes: '' },
    photos: { verified: false, notes: '' },
    businessLicense: { verified: false, notes: '' },
  });

  const shopData = {
    id: 'SHOP002',
    name: 'Fresh Mart Groceries',
    owner: {
      name: 'Priya Sharma',
      email: 'priya.sharma@email.com',
      phone: '+91 87654 32109',
      aadhar: 'XXXX-XXXX-1234',
    },
    address: {
      street: '456 Market Road',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110001',
    },
    business: {
      type: 'Retail Store',
      gst: 'GST9876543210',
      category: 'Groceries',
      appliedDate: '2024-11-20',
    },
    documents: [
      { id: 1, name: 'Owner Aadhar Card', type: 'ID Proof', status: 'pending', url: '#', issues: [] },
      { id: 2, name: 'GST Certificate', type: 'Tax Document', status: 'pending', url: '#', issues: ['Low resolution detected'] },
      { id: 3, name: 'Trade License', type: 'Business License', status: 'pending', url: '#', issues: [] },
      { id: 4, name: 'Shop Registration', type: 'Registration', status: 'pending', url: '#', issues: ['Expiry date approaching'] },
    ],
    photos: [
      { id: 1, type: 'Exterior', url: '#', quality: 'good' },
      { id: 2, type: 'Interior', url: '#', quality: 'low' },
      { id: 3, type: 'Work Area', url: '#', quality: 'good' },
    ],
    riskScore: 35, // Out of 100 (lower is better)
  };

  const steps = [
    { id: 1, name: 'Shop Details', icon: Store },
    { id: 2, name: 'Owner Verification', icon: User },
    { id: 3, name: 'Documents', icon: FileText },
    { id: 4, name: 'Photos', icon: Eye },
    { id: 5, name: 'Risk Assessment', icon: Shield },
  ];

  const getRiskColor = (score: number) => {
    if (score < 30) return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', label: 'Low Risk' };
    if (score < 60) return { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', label: 'Medium Risk' };
    return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', label: 'High Risk' };
  };

  const riskColors = getRiskColor(shopData.riskScore);

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F7FA]">
      <AdminSidebar />
      
      <div className="flex-1 ml-72 flex flex-col">
        {/* Top Navigation */}
        <div className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <div>
            <h1 className="text-2xl font-bold text-[#0B0F19]">Shop Verification</h1>
            <p className="text-sm text-gray-500">Step-by-step verification process</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className={`px-4 py-2 ${riskColors.bg} ${riskColors.border} border rounded-lg`}>
              <div className="flex items-center space-x-2">
                <Shield className={`w-5 h-5 ${riskColors.text}`} />
                <span className={`font-semibold ${riskColors.text}`}>{riskColors.label}</span>
                <span className={`text-sm ${riskColors.text}`}>({shopData.riskScore}/100)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {/* Shop Info Header */}
          <div className="bg-gradient-to-r from-[#1A73E8] to-[#6C63FF] rounded-2xl p-6 mb-8 text-white shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">{shopData.name}</h2>
                <p className="text-white text-opacity-90">Owner: {shopData.owner.name}</p>
                <p className="text-white text-opacity-80 text-sm">Applied on {new Date(shopData.business.appliedDate).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="text-white text-opacity-80 text-sm">Application ID</p>
                <p className="text-xl font-bold">{shopData.id}</p>
              </div>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                      currentStep === step.id 
                        ? 'bg-[#1A73E8] text-white shadow-lg scale-110' 
                        : currentStep > step.id 
                        ? 'bg-[#00C853] text-white' 
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {currentStep > step.id ? <CheckCircle2 className="w-6 h-6" /> : <step.icon className="w-6 h-6" />}
                    </div>
                    <p className={`text-xs mt-2 font-semibold ${
                      currentStep === step.id ? 'text-[#1A73E8]' : currentStep > step.id ? 'text-[#00C853]' : 'text-gray-500'
                    }`}>
                      {step.name}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-1 mx-4 rounded-full ${
                      currentStep > step.id ? 'bg-[#00C853]' : 'bg-gray-200'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Step 1: Shop Details */}
          {currentStep === 1 && (
            <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-[#0B0F19] mb-6">Shop Details Review</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Shop Name</p>
                    <p className="font-semibold text-[#0B0F19]">{shopData.name}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Category</p>
                    <p className="font-semibold text-[#0B0F19]">{shopData.business.category}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Business Type</p>
                    <p className="font-semibold text-[#0B0F19]">{shopData.business.type}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Address</p>
                    <p className="font-semibold text-[#0B0F19]">{shopData.address.street}</p>
                    <p className="text-sm text-gray-600">{shopData.address.city}, {shopData.address.state} - {shopData.address.pincode}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">GST Number</p>
                    <p className="font-semibold text-[#0B0F19]">{shopData.business.gst}</p>
                  </div>
                </div>
              </div>
              <textarea
                className="w-full mt-6 p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A73E8] resize-none"
                rows={3}
                placeholder="Add verification notes..."
              />
            </div>
          )}

          {/* Step 2: Owner Verification */}
          {currentStep === 2 && (
            <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-[#0B0F19] mb-6">Owner Verification</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="flex items-center space-x-3 mb-3">
                      <User className="w-5 h-5 text-blue-600" />
                      <p className="font-semibold text-blue-900">Owner Information</p>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-blue-600">Full Name</p>
                        <p className="font-semibold text-blue-900">{shopData.owner.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-blue-600">Aadhar Number</p>
                        <p className="font-semibold text-blue-900">{shopData.owner.aadhar}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center space-x-3 mb-3">
                      <Phone className="w-5 h-5 text-green-600" />
                      <p className="font-semibold text-green-900">Contact Details</p>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-green-600">Phone</p>
                        <p className="font-semibold text-green-900">{shopData.owner.phone}</p>
                      </div>
                      <div>
                        <p className="text-xs text-green-600">Email</p>
                        <p className="font-semibold text-green-900">{shopData.owner.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
                  <div className="flex items-center space-x-3 mb-4">
                    <Scan className="w-5 h-5 text-purple-600" />
                    <p className="font-semibold text-purple-900">Auto-Verification Results</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <span className="text-sm text-gray-700">Phone Verification</span>
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <span className="text-sm text-gray-700">Email Verification</span>
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <span className="text-sm text-gray-700">ID Match</span>
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    </div>
                  </div>
                </div>
              </div>
              <textarea
                className="w-full mt-6 p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A73E8] resize-none"
                rows={3}
                placeholder="Add verification notes..."
              />
            </div>
          )}

          {/* Step 3: Documents */}
          {currentStep === 3 && (
            <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-[#0B0F19] mb-6 flex items-center space-x-2">
                <FileText className="w-6 h-6 text-[#1A73E8]" />
                <span>Document Verification</span>
              </h3>
              <div className="space-y-4">
                {shopData.documents.map((doc) => (
                  <div key={doc.id} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <FileText className="w-5 h-5 text-[#1A73E8]" />
                          <p className="font-semibold text-[#0B0F19]">{doc.name}</p>
                        </div>
                        <p className="text-sm text-gray-600">{doc.type}</p>
                        {doc.issues.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {doc.issues.map((issue, index) => (
                              <div key={index} className="flex items-center space-x-2 text-sm text-red-600">
                                <AlertTriangle className="w-4 h-4" />
                                <span>{issue}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-2 bg-[#1A73E8] text-white rounded-lg hover:bg-[#1557b0] transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="flex-1 px-4 py-2 bg-[#00C853] text-white rounded-lg hover:bg-[#00a844] transition-colors font-semibold">
                        Approve
                      </button>
                      <button className="flex-1 px-4 py-2 bg-[#D32F2F] text-white rounded-lg hover:bg-[#b71c1c] transition-colors font-semibold">
                        Reject
                      </button>
                      <button className="px-4 py-2 bg-[#FFAB00] text-white rounded-lg hover:bg-[#ff9100] transition-colors font-semibold">
                        Request More Info
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Photos */}
          {currentStep === 4 && (
            <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-[#0B0F19] mb-6">Shop Photos Verification</h3>
              <div className="grid grid-cols-3 gap-4">
                {shopData.photos.map((photo) => (
                  <div key={photo.id} className="border border-gray-200 rounded-xl p-4">
                    <div className="aspect-video bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                      <Eye className="w-12 h-12 text-gray-400" />
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-[#0B0F19]">{photo.type}</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        photo.quality === 'good' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {photo.quality}
                      </span>
                    </div>
                    <button className="w-full px-3 py-2 bg-[#1A73E8] text-white rounded-lg hover:bg-[#1557b0] transition-colors text-sm">
                      View Full Size
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Risk Assessment */}
          {currentStep === 5 && (
            <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-[#0B0F19] mb-6 flex items-center space-x-2">
                <Shield className="w-6 h-6 text-[#1A73E8]" />
                <span>AI Risk Assessment</span>
              </h3>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-[#0B0F19]">Overall Risk Score</span>
                  <span className={`text-2xl font-bold ${riskColors.text}`}>{shopData.riskScore}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full transition-all ${
                      shopData.riskScore < 30 ? 'bg-green-500' : shopData.riskScore < 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${shopData.riskScore}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <p className="font-semibold text-green-900">Positive Indicators</p>
                  </div>
                  <ul className="space-y-1 text-sm text-green-700">
                    <li>• All documents submitted</li>
                    <li>• Contact verification successful</li>
                    <li>• Clear shop photos provided</li>
                  </ul>
                </div>
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <p className="font-semibold text-red-900">Risk Factors</p>
                  </div>
                  <ul className="space-y-1 text-sm text-red-700">
                    <li>• Low resolution document detected</li>
                    <li>• ID mismatch needs review</li>
                    <li>• One license expiring soon</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Navigation & Action Buttons */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous Step
              </button>
              <div className="flex items-center space-x-3">
                {currentStep === 5 ? (
                  <>
                    <button className="px-6 py-3 bg-[#00C853] text-white rounded-xl hover:bg-[#00a844] transition-colors font-semibold flex items-center space-x-2">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Approve Shop</span>
                    </button>
                    <button className="px-6 py-3 bg-[#FFAB00] text-white rounded-xl hover:bg-[#ff9100] transition-colors font-semibold">
                      Request More Information
                    </button>
                    <button className="px-6 py-3 bg-[#D32F2F] text-white rounded-xl hover:bg-[#b71c1c] transition-colors font-semibold flex items-center space-x-2">
                      <XCircle className="w-5 h-5" />
                      <span>Reject Shop</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setCurrentStep(Math.min(5, currentStep + 1))}
                    className="px-6 py-3 bg-[#1A73E8] text-white rounded-xl hover:bg-[#1557b0] transition-colors font-semibold"
                  >
                    Next Step
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
