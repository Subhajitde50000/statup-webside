'use client';

import React, { useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { Ban, AlertTriangle, Clock, Calendar, FileText, User, Store, XCircle, CheckCircle2 } from 'lucide-react';

export default function ShopSuspensionPage() {
  const [selectedDuration, setSelectedDuration] = useState('');
  const [selectedReason, setSelectedReason] = useState('');
  const [customDate, setCustomDate] = useState('');
  const [notes, setNotes] = useState('');
  const [evidence, setEvidence] = useState<File | null>(null);

  const shopData = {
    id: 'SHOP003',
    name: 'Fashion Corner',
    owner: 'Amit Patel',
    email: 'fashioncorner@email.com',
    phone: '+91 76543 21098',
    currentStrikes: 2,
    status: 'active',
  };

  const suspensionDurations = [
    { id: '24h', label: '24 Hours', duration: '1 day', color: 'bg-yellow-500' },
    { id: '3days', label: '3 Days', duration: '3 days', color: 'bg-orange-500' },
    { id: '7days', label: '7 Days', duration: '1 week', color: 'bg-red-500' },
    { id: '30days', label: '30 Days', duration: '1 month', color: 'bg-purple-500' },
    { id: 'custom', label: 'Custom Date', duration: 'custom', color: 'bg-blue-500' },
    { id: 'permanent', label: 'Permanent Ban', duration: 'permanent', color: 'bg-black' },
  ];

  const violationReasons = [
    'Fake documents submitted',
    'Bad behavior / Customer harassment',
    'High number of complaints',
    'Order manipulation / Fraud',
    'Selling illegal items',
    'Repeated late deliveries',
    'Poor product quality',
    'Policy violations',
    'Other (specify in notes)',
  ];

  const strikeHistory = [
    {
      id: 1,
      date: '2024-11-15',
      reason: 'Late delivery complaints',
      issuedBy: 'Admin Team',
      evidence: 'complaint_report.pdf',
      status: 'active',
    },
    {
      id: 2,
      date: '2024-10-20',
      reason: 'Poor product quality reports',
      issuedBy: 'Quality Team',
      evidence: 'quality_issues.pdf',
      status: 'active',
    },
  ];

  const suspensionHistory = [
    {
      id: 1,
      startDate: '2024-09-10',
      endDate: '2024-09-17',
      duration: '7 days',
      reason: 'Multiple customer complaints',
      issuedBy: 'Admin Team',
      status: 'completed',
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F7FA]">
      <AdminSidebar />
      
      <div className="flex-1 ml-72 flex flex-col">
        {/* Top Navigation */}
        <div className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <div>
            <h1 className="text-2xl font-bold text-[#0B0F19]">Shop Suspension / Ban</h1>
            <p className="text-sm text-gray-500">Manage violations and enforce penalties</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {/* Shop Profile Header */}
          <div className="bg-gradient-to-r from-[#D32F2F] to-[#B71C1C] rounded-2xl p-6 mb-8 text-white shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">{shopData.name}</h2>
                <p className="text-white text-opacity-90">Owner: {shopData.owner}</p>
                <p className="text-white text-opacity-80 text-sm">{shopData.email} • {shopData.phone}</p>
              </div>
              <div className="text-right">
                <div className="bg-white bg-opacity-20 rounded-xl px-4 py-3">
                  <p className="text-xs text-white text-opacity-80 mb-1">Current Strikes</p>
                  <p className="text-3xl font-bold">{shopData.currentStrikes}/3</p>
                  {shopData.currentStrikes >= 3 && (
                    <p className="text-xs text-yellow-300 mt-1">Auto-ban threshold reached!</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {/* Left Column - Suspension Tools */}
            <div className="space-y-8">
              {/* Suspension Duration */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-xl font-bold text-[#0B0F19] mb-6 flex items-center space-x-2">
                  <Clock className="w-6 h-6 text-[#1A73E8]" />
                  <span>Suspension Duration</span>
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {suspensionDurations.map((duration) => (
                    <button
                      key={duration.id}
                      onClick={() => setSelectedDuration(duration.id)}
                      className={`${duration.color} text-white rounded-xl p-4 hover:opacity-90 transition-all ${
                        selectedDuration === duration.id ? 'ring-4 ring-offset-2 ring-blue-400' : ''
                      }`}
                    >
                      <p className="font-bold text-lg">{duration.label}</p>
                      <p className="text-xs opacity-90">{duration.duration}</p>
                    </button>
                  ))}
                </div>
                {selectedDuration === 'custom' && (
                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-[#0B0F19] mb-2">Select End Date</label>
                    <input
                      type="date"
                      value={customDate}
                      onChange={(e) => setCustomDate(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A73E8]"
                    />
                  </div>
                )}
              </div>

              {/* Violation Reason */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-xl font-bold text-[#0B0F19] mb-6 flex items-center space-x-2">
                  <AlertTriangle className="w-6 h-6 text-[#FFAB00]" />
                  <span>Violation Reason</span>
                </h3>
                <div className="space-y-2">
                  {violationReasons.map((reason) => (
                    <label key={reason} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                      <input
                        type="radio"
                        name="reason"
                        value={reason}
                        checked={selectedReason === reason}
                        onChange={(e) => setSelectedReason(e.target.value)}
                        className="mr-3"
                      />
                      <span className="text-sm text-[#0B0F19]">{reason}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Evidence & Notes */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-xl font-bold text-[#0B0F19] mb-6 flex items-center space-x-2">
                  <FileText className="w-6 h-6 text-[#6C63FF]" />
                  <span>Evidence & Notes</span>
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#0B0F19] mb-2">Upload Evidence (Screenshots, Documents)</label>
                    <input
                      type="file"
                      onChange={(e) => setEvidence(e.target.files?.[0] || null)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A73E8]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#0B0F19] mb-2">Admin Notes (Required)</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A73E8] resize-none"
                      rows={4}
                      placeholder="Describe the violation and action taken..."
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="space-y-3">
                  <button className="w-full px-6 py-4 bg-[#FFAB00] text-white rounded-xl hover:bg-[#ff9100] transition-colors font-semibold flex items-center justify-center space-x-2">
                    <AlertTriangle className="w-5 h-5" />
                    <span>Issue Strike Only (No Suspension)</span>
                  </button>
                  <button className="w-full px-6 py-4 bg-[#D32F2F] text-white rounded-xl hover:bg-[#b71c1c] transition-colors font-semibold flex items-center justify-center space-x-2">
                    <Ban className="w-5 h-5" />
                    <span>Suspend Shop</span>
                  </button>
                  <button className="w-full px-6 py-4 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold flex items-center justify-center space-x-2">
                    <XCircle className="w-5 h-5" />
                    <span>Permanent Ban</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - History */}
            <div className="space-y-8">
              {/* Strike History */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-xl font-bold text-[#0B0F19] mb-6 flex items-center space-x-2">
                  <AlertTriangle className="w-6 h-6 text-[#D32F2F]" />
                  <span>Strike History</span>
                </h3>
                <div className="space-y-4">
                  {strikeHistory.map((strike) => (
                    <div key={strike.id} className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-bold text-red-900">Strike #{strike.id}</p>
                          <p className="text-sm text-red-700 mt-1">{strike.reason}</p>
                        </div>
                        <span className="px-3 py-1 bg-red-200 text-red-800 rounded-full text-xs font-semibold">
                          {strike.status}
                        </span>
                      </div>
                      <div className="mt-3 pt-3 border-t border-red-200 flex items-center justify-between">
                        <div className="text-xs text-red-600">
                          <p>Date: {new Date(strike.date).toLocaleDateString()}</p>
                          <p>Issued by: {strike.issuedBy}</p>
                        </div>
                        <button className="text-xs text-red-700 hover:text-red-900 font-semibold underline">
                          View Evidence
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suspension History */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-xl font-bold text-[#0B0F19] mb-6 flex items-center space-x-2">
                  <Calendar className="w-6 h-6 text-[#6C63FF]" />
                  <span>Suspension History</span>
                </h3>
                <div className="space-y-4">
                  {suspensionHistory.map((suspension) => (
                    <div key={suspension.id} className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-bold text-purple-900">Suspension #{suspension.id}</p>
                          <p className="text-sm text-purple-700 mt-1">{suspension.reason}</p>
                        </div>
                        <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-xs font-semibold">
                          {suspension.status}
                        </span>
                      </div>
                      <div className="mt-3 pt-3 border-t border-purple-200">
                        <div className="grid grid-cols-2 gap-2 text-xs text-purple-700">
                          <div>
                            <p className="text-purple-500">Start Date</p>
                            <p className="font-semibold">{new Date(suspension.startDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-purple-500">End Date</p>
                            <p className="font-semibold">{new Date(suspension.endDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-purple-600">
                          <p>Duration: {suspension.duration}</p>
                          <p>Issued by: {suspension.issuedBy}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Auto-Ban Rules */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-xl font-bold text-[#0B0F19] mb-6 flex items-center space-x-2">
                  <Ban className="w-6 h-6 text-[#1A73E8]" />
                  <span>Auto-Ban Rules</span>
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${shopData.currentStrikes >= 3 ? 'bg-red-500' : 'bg-green-500'}`} />
                      <span className="text-sm font-semibold text-blue-900">3 Strikes = Auto Ban</span>
                    </div>
                    <span className="text-sm font-bold text-blue-900">{shopData.currentStrikes}/3</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span className="text-sm font-semibold text-yellow-900">10+ Complaints = Review</span>
                    </div>
                    <span className="text-sm font-bold text-yellow-900">5/10</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span className="text-sm font-semibold text-red-900">Illegal Items = Instant Ban</span>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
