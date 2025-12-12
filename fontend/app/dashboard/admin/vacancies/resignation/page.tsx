'use client';

import React, { useState } from 'react';
import {
  FileText,
  Calendar,
  MessageSquare,
  ToggleLeft,
  AlertCircle,
  CheckCircle2,
  Save,
  User,
  Clock,
} from 'lucide-react';

export default function ResignationTerminationPage() {
  const [formType, setFormType] = useState<'resignation' | 'termination'>('resignation');
  const [formData, setFormData] = useState({
    userId: '',
    reason: '',
    noticePeriod: '30',
    exitInterviewNotes: '',
    deactivateAccount: false,
    rehireEligibility: true,
  });
  const [showNotification, setShowNotification] = useState(false);

  const suspensionHistory = [
    { date: '2024-10-15', reason: 'Customer Complaint', duration: '7 days', severity: 'Medium' },
    { date: '2024-08-22', reason: 'Late Delivery', duration: '3 days', severity: 'Low' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1B1F3B] mb-2">Resignation / Termination Management</h1>
          <p className="text-[#6B7280]">Process employee exits and manage account status</p>
        </div>

        {/* Type Selector */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setFormType('resignation')}
              className={`p-6 rounded-xl text-left transition-all border-4 ${
                formType === 'resignation'
                  ? 'border-[#0057D9] bg-[#E3F2FD]'
                  : 'border-gray-100 hover:border-gray-200'
              }`}
            >
              <FileText className="w-8 h-8 text-[#0057D9] mb-3" />
              <h3 className="font-bold text-[#1B1F3B] text-lg mb-1">Resignation</h3>
              <p className="text-sm text-[#6B7280]">Voluntary exit by employee</p>
            </button>

            <button
              onClick={() => setFormType('termination')}
              className={`p-6 rounded-xl text-left transition-all border-4 ${
                formType === 'termination'
                  ? 'border-[#E53935] bg-[#FFEBEE]'
                  : 'border-gray-100 hover:border-gray-200'
              }`}
            >
              <AlertCircle className="w-8 h-8 text-[#E53935] mb-3" />
              <h3 className="font-bold text-[#1B1F3B] text-lg mb-1">Termination</h3>
              <p className="text-sm text-[#6B7280]">Involuntary exit by company</p>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-[#1B1F3B] mb-6">
                {formType === 'resignation' ? 'Resignation' : 'Termination'} Details
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-[#1B1F3B] mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    Select Employee <span className="text-[#E53935]">*</span>
                  </label>
                  <select
                    required
                    value={formData.userId}
                    onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#0057D9] transition-colors"
                  >
                    <option value="">Choose employee...</option>
                    <option value="1">Rajesh Kumar - Service Professional</option>
                    <option value="2">Priya Sharma - Shop Manager</option>
                    <option value="3">Amit Patel - Support Executive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#1B1F3B] mb-2">
                    <FileText className="w-4 h-4 inline mr-1" />
                    Reason for {formType === 'resignation' ? 'Resignation' : 'Termination'}{' '}
                    <span className="text-[#E53935]">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    placeholder={
                      formType === 'resignation'
                        ? 'Employee reason for leaving...'
                        : 'Company reason for termination...'
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#0057D9] transition-colors resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#1B1F3B] mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Notice Period (Days) <span className="text-[#E53935]">*</span>
                  </label>
                  <select
                    required
                    value={formData.noticePeriod}
                    onChange={(e) => setFormData({ ...formData, noticePeriod: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#0057D9] transition-colors"
                  >
                    <option value="0">Immediate (0 days)</option>
                    <option value="7">1 Week (7 days)</option>
                    <option value="15">15 Days</option>
                    <option value="30">1 Month (30 days)</option>
                    <option value="60">2 Months (60 days)</option>
                    <option value="90">3 Months (90 days)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#1B1F3B] mb-2">
                    <MessageSquare className="w-4 h-4 inline mr-1" />
                    Exit Interview Notes
                  </label>
                  <textarea
                    rows={6}
                    value={formData.exitInterviewNotes}
                    onChange={(e) => setFormData({ ...formData, exitInterviewNotes: e.target.value })}
                    placeholder="Record feedback from exit interview..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#0057D9] transition-colors resize-none"
                  />
                </div>

                <div className="p-6 bg-[#F4F7FB] rounded-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ToggleLeft className="w-5 h-5 text-[#0057D9]" />
                      <div>
                        <p className="font-semibold text-[#1B1F3B]">Deactivate Account</p>
                        <p className="text-sm text-[#6B7280]">Immediately disable login access</p>
                      </div>
                    </div>
                    <label className="relative inline-block w-14 h-7">
                      <input
                        type="checkbox"
                        checked={formData.deactivateAccount}
                        onChange={(e) => setFormData({ ...formData, deactivateAccount: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-7 bg-gray-300 rounded-full peer peer-checked:bg-[#E53935] transition-colors cursor-pointer"></div>
                      <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-7"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-[#3CB878]" />
                      <div>
                        <p className="font-semibold text-[#1B1F3B]">Rehire Eligibility</p>
                        <p className="text-sm text-[#6B7280]">Eligible for future re-employment</p>
                      </div>
                    </div>
                    <label className="relative inline-block w-14 h-7">
                      <input
                        type="checkbox"
                        checked={formData.rehireEligibility}
                        onChange={(e) => setFormData({ ...formData, rehireEligibility: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-7 bg-gray-300 rounded-full peer peer-checked:bg-[#3CB878] transition-colors cursor-pointer"></div>
                      <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-7"></div>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-100">
                  <button
                    type="button"
                    className="px-6 py-3 text-[#6B7280] hover:text-[#1B1F3B] font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`px-6 py-3 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2 ${
                      formType === 'resignation'
                        ? 'bg-gradient-to-r from-[#0057D9] to-[#0044AA]'
                        : 'bg-gradient-to-r from-[#E53935] to-[#C62828]'
                    }`}
                  >
                    <Save className="w-5 h-5" />
                    Process {formType === 'resignation' ? 'Resignation' : 'Termination'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Suspension History */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-[#1B1F3B] mb-6 flex items-center gap-2">
                <Clock className="w-6 h-6 text-[#FFB020]" />
                Suspension History
              </h2>
              {suspensionHistory.length > 0 ? (
                <div className="space-y-4">
                  {suspensionHistory.map((item, index) => (
                    <div key={index} className="p-4 bg-[#FFF8E1] rounded-xl border-2 border-[#FFB020]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-[#FFB020]">{item.date}</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            item.severity === 'High'
                              ? 'bg-[#E53935] text-white'
                              : item.severity === 'Medium'
                              ? 'bg-[#FFB020] text-white'
                              : 'bg-[#00A8E8] text-white'
                          }`}
                        >
                          {item.severity}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-[#1B1F3B] mb-1">{item.reason}</p>
                      <p className="text-xs text-[#6B7280]">Duration: {item.duration}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[#6B7280] text-sm">No suspension history</p>
              )}
            </div>

            {/* Info Box */}
            <div className="bg-[#E3F2FD] border-2 border-[#0057D9] rounded-2xl p-6">
              <AlertCircle className="w-8 h-8 text-[#0057D9] mb-3" />
              <h3 className="font-bold text-[#1B1F3B] mb-2">Important Note</h3>
              <p className="text-sm text-[#1B1F3B]">
                {formType === 'resignation'
                  ? 'Ensure all exit formalities are completed before processing the resignation.'
                  : 'Termination requires HR approval and must be documented with valid reasons.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {showNotification && (
        <div className="fixed top-24 right-8 z-50 animate-slide-in">
          <div className="px-6 py-4 bg-[#3CB878] text-white rounded-xl shadow-lg flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-semibold">
              {formType === 'resignation' ? 'Resignation' : 'Termination'} processed successfully!
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
