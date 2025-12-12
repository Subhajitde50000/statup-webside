'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  ArrowRight,
  Clock,
  XCircle,
  FileText,
  Download,
  Send,
} from 'lucide-react';
import Link from 'next/link';

export default function HiringDecisionPage({ params }: { params: { id: string } }) {
  const [selectedAction, setSelectedAction] = useState('');
  const [notes, setNotes] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const actions = [
    {
      id: 'hire',
      label: 'Select for Hiring',
      icon: <CheckCircle2 className="w-6 h-6" />,
      color: '#3CB878',
      description: 'Send offer letter and proceed with onboarding',
    },
    {
      id: 'next-round',
      label: 'Move to Next Round',
      icon: <ArrowRight className="w-6 h-6" />,
      color: '#0057D9',
      description: 'Schedule another round of interviews',
    },
    {
      id: 'hold',
      label: 'Keep on Hold',
      icon: <Clock className="w-6 h-6" />,
      color: '#FFB020',
      description: 'Put the application on hold for future consideration',
    },
    {
      id: 'reject',
      label: 'Reject Application',
      icon: <XCircle className="w-6 h-6" />,
      color: '#E53935',
      description: 'Decline the application and send rejection notification',
    },
  ];

  const handleSubmit = () => {
    if (!selectedAction) {
      alert('Please select an action');
      return;
    }
    setShowConfirmation(true);
  };

  const confirmDecision = () => {
    setShowConfirmation(false);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const selectedActionData = actions.find((a) => a.id === selectedAction);

  return (
    <div className="min-h-screen bg-[#F4F7FB] p-8">
      <Link
        href={`/dashboard/admin/vacancies/applicants/${params.id}`}
        className="inline-flex items-center gap-2 text-[#0057D9] hover:text-[#0044AA] font-semibold mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Applicant Profile
      </Link>

      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h1 className="text-3xl font-bold text-[#1B1F3B] mb-2">Make Hiring Decision</h1>
          <p className="text-[#6B7280] mb-8">Choose the next step for this applicant</p>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {actions.map((action) => (
              <button
                key={action.id}
                onClick={() => setSelectedAction(action.id)}
                className={`p-6 rounded-2xl text-left transition-all border-4 ${
                  selectedAction === action.id
                    ? 'border-[#0057D9] shadow-lg'
                    : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${action.color}20`, color: action.color }}
                >
                  {action.icon}
                </div>
                <h3 className="font-bold text-[#1B1F3B] text-lg mb-2">{action.label}</h3>
                <p className="text-sm text-[#6B7280]">{action.description}</p>
              </button>
            ))}
          </div>

          {/* Notes */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-[#1B1F3B] mb-2">
              <FileText className="w-4 h-4 inline mr-1" />
              Decision Notes
            </label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about your decision..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#0057D9] transition-colors resize-none"
            />
          </div>

          {/* Offer Letter Preview (If hiring) */}
          {selectedAction === 'hire' && (
            <div className="mb-8 p-6 bg-[#E8F5E9] border-2 border-[#3CB878] rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[#1B1F3B] text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#3CB878]" />
                  Offer Letter Template
                </h3>
                <button className="px-4 py-2 bg-white border-2 border-[#3CB878] text-[#3CB878] rounded-lg font-semibold hover:bg-[#F1F8F4] transition-colors flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Preview
                </button>
              </div>
              <div className="space-y-2 text-sm text-[#1B1F3B]">
                <p><strong>Position:</strong> Service Professional - Plumber</p>
                <p><strong>Salary:</strong> ₹30,000/month</p>
                <p><strong>Joining Date:</strong> 2025-02-01</p>
                <p><strong>Probation Period:</strong> 3 months</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-100">
            <Link
              href={`/dashboard/admin/vacancies/applicants/${params.id}`}
              className="px-6 py-3 text-[#6B7280] hover:text-[#1B1F3B] font-semibold"
            >
              Cancel
            </Link>
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-gradient-to-r from-[#0057D9] to-[#0044AA] text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              Confirm Decision
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && selectedActionData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: `${selectedActionData.color}20`, color: selectedActionData.color }}
            >
              {selectedActionData.icon}
            </div>
            <h2 className="text-2xl font-bold text-[#1B1F3B] text-center mb-2">
              Confirm {selectedActionData.label}?
            </h2>
            <p className="text-[#6B7280] text-center mb-6">
              This action will {selectedActionData.description.toLowerCase()}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 px-6 py-3 bg-gray-200 text-[#1B1F3B] rounded-xl font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDecision}
                className="flex-1 px-6 py-3 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                style={{ backgroundColor: selectedActionData.color }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {showNotification && (
        <div className="fixed top-24 right-8 z-50 animate-slide-in">
          <div className="px-6 py-4 bg-[#3CB878] text-white rounded-xl shadow-lg flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-semibold">Decision saved successfully!</span>
          </div>
        </div>
      )}
    </div>
  );
}
