'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Video,
  User,
  Mail,
  Phone,
  CheckCircle2,
  Save,
} from 'lucide-react';
import Link from 'next/link';

export default function InterviewSchedulingPage({ params }: { params: { id: string } }) {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    interviewer: '',
    videoLink: '',
    sendSMS: true,
    sendEmail: true,
    notes: '',
  });

  const [showNotification, setShowNotification] = useState(false);

  const interviewers = [
    'HR Manager Sunita',
    'Technical Lead Rahul',
    'Operations Manager Priya',
    'Admin Rakesh',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate save
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] p-8">
      <Link
        href={`/dashboard/admin/vacancies/applicants/${params.id}`}
        className="inline-flex items-center gap-2 text-[#0057D9] hover:text-[#0044AA] font-semibold mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Applicant Profile
      </Link>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h1 className="text-3xl font-bold text-[#1B1F3B] mb-2">Schedule Interview</h1>
          <p className="text-[#6B7280] mb-8">Set up interview date, time, and send notifications</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#1B1F3B] mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Interview Date <span className="text-[#E53935]">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#0057D9] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1B1F3B] mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Interview Time <span className="text-[#E53935]">*</span>
                </label>
                <input
                  type="time"
                  required
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#0057D9] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1B1F3B] mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Select Interviewer <span className="text-[#E53935]">*</span>
              </label>
              <select
                required
                value={formData.interviewer}
                onChange={(e) => setFormData({ ...formData, interviewer: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#0057D9] transition-colors"
              >
                <option value="">Choose interviewer...</option>
                {interviewers.map((interviewer) => (
                  <option key={interviewer} value={interviewer}>
                    {interviewer}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1B1F3B] mb-2">
                <Video className="w-4 h-4 inline mr-1" />
                Video Call Link (Google Meet / Zoom)
              </label>
              <input
                type="url"
                value={formData.videoLink}
                onChange={(e) => setFormData({ ...formData, videoLink: e.target.value })}
                placeholder="https://meet.google.com/xxx-xxxx-xxx"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#0057D9] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1B1F3B] mb-2">Interview Notes</label>
              <textarea
                rows={4}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Add any special instructions or notes..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#0057D9] transition-colors resize-none"
              />
            </div>

            <div className="p-6 bg-[#F4F7FB] rounded-xl space-y-4">
              <h3 className="font-semibold text-[#1B1F3B]">Send Notifications</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-[#0057D9]" />
                  <span className="text-[#1B1F3B]">Send SMS Notification</span>
                </div>
                <label className="relative inline-block w-14 h-7">
                  <input
                    type="checkbox"
                    checked={formData.sendSMS}
                    onChange={(e) => setFormData({ ...formData, sendSMS: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-300 rounded-full peer peer-checked:bg-[#0057D9] transition-colors cursor-pointer"></div>
                  <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-7"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-[#0057D9]" />
                  <span className="text-[#1B1F3B]">Send Email Notification</span>
                </div>
                <label className="relative inline-block w-14 h-7">
                  <input
                    type="checkbox"
                    checked={formData.sendEmail}
                    onChange={(e) => setFormData({ ...formData, sendEmail: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-300 rounded-full peer peer-checked:bg-[#0057D9] transition-colors cursor-pointer"></div>
                  <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-7"></div>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-100">
              <Link
                href={`/dashboard/admin/vacancies/applicants/${params.id}`}
                className="px-6 py-3 text-[#6B7280] hover:text-[#1B1F3B] font-semibold"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-[#0057D9] to-[#0044AA] text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Save className="w-5 h-5" />
                Schedule Interview
              </button>
            </div>
          </form>
        </div>
      </div>

      {showNotification && (
        <div className="fixed top-24 right-8 z-50 animate-slide-in">
          <div className="px-6 py-4 bg-[#3CB878] text-white rounded-xl shadow-lg flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-semibold">Interview scheduled successfully!</span>
          </div>
        </div>
      )}
    </div>
  );
}
