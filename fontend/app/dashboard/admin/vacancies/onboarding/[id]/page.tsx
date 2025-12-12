'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  Upload,
  Shield,
  Video,
  Award,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  User,
} from 'lucide-react';
import Link from 'next/link';

export default function OnboardingProgressPage({ params }: { params: { id: string } }) {
  const onboardingSteps = [
    {
      id: 1,
      title: 'Document Upload',
      description: 'Upload required documents and forms',
      status: 'Completed',
      progress: 100,
      icon: <Upload className="w-5 h-5" />,
      color: '#3CB878',
      files: ['Offer Letter - Signed.pdf', 'Bank Details Form.pdf', 'Tax Declaration.pdf'],
    },
    {
      id: 2,
      title: 'ID Verification',
      description: 'Verify identity documents',
      status: 'Completed',
      progress: 100,
      icon: <User className="w-5 h-5" />,
      color: '#3CB878',
      files: ['Aadhaar Card.pdf', 'PAN Card.pdf'],
    },
    {
      id: 3,
      title: 'Police Verification',
      description: 'Background and police verification check',
      status: 'In Progress',
      progress: 60,
      icon: <Shield className="w-5 h-5" />,
      color: '#FFB020',
      files: ['Police Verification Form.pdf'],
    },
    {
      id: 4,
      title: 'Training Videos',
      description: 'Complete mandatory training modules',
      status: 'Pending',
      progress: 0,
      icon: <Video className="w-5 h-5" />,
      color: '#6B7280',
      files: [],
    },
    {
      id: 5,
      title: 'Certification',
      description: 'Pass certification assessment',
      status: 'Pending',
      progress: 0,
      icon: <Award className="w-5 h-5" />,
      color: '#6B7280',
      files: [],
    },
    {
      id: 6,
      title: 'Final Approval',
      description: 'Admin final approval and activation',
      status: 'Pending',
      progress: 0,
      icon: <CheckCircle2 className="w-5 h-5" />,
      color: '#6B7280',
      files: [],
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle2 className="w-6 h-6 text-[#3CB878]" />;
      case 'In Progress':
        return <Clock className="w-6 h-6 text-[#FFB020] animate-pulse" />;
      default:
        return <AlertCircle className="w-6 h-6 text-[#6B7280]" />;
    }
  };

  const overallProgress = Math.round(
    onboardingSteps.reduce((sum, step) => sum + step.progress, 0) / onboardingSteps.length
  );

  return (
    <div className="min-h-screen bg-[#F4F7FB] p-8">
      <Link
        href="/dashboard/admin/vacancies/applicants"
        className="inline-flex items-center gap-2 text-[#0057D9] hover:text-[#0044AA] font-semibold mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Applicants
      </Link>

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[#1B1F3B] mb-2">Onboarding Progress</h1>
              <p className="text-[#6B7280]">Track the onboarding status of Rajesh Kumar</p>
            </div>
            <span className="px-4 py-2 bg-[#FFB020] text-white rounded-xl font-semibold">
              In Progress
            </span>
          </div>

          {/* Overall Progress */}
          <div className="p-6 bg-gradient-to-br from-[#0057D9] to-[#0044AA] rounded-2xl text-white">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm opacity-90">Overall Progress</span>
              <span className="text-2xl font-bold">{overallProgress}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Onboarding Steps */}
        <div className="space-y-6">
          {onboardingSteps.map((step, index) => (
            <div
              key={step.id}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-6">
                {/* Step Number */}
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${step.color}20`, color: step.color }}
                >
                  {step.icon}
                </div>

                {/* Step Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-[#1B1F3B] mb-1">
                        Step {step.id}: {step.title}
                      </h3>
                      <p className="text-sm text-[#6B7280]">{step.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(step.status)}
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          step.status === 'Completed'
                            ? 'bg-[#E8F5E9] text-[#3CB878]'
                            : step.status === 'In Progress'
                            ? 'bg-[#FFF8E1] text-[#FFB020]'
                            : 'bg-gray-100 text-[#6B7280]'
                        }`}
                      >
                        {step.status}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-[#6B7280]">Progress</span>
                      <span className="font-semibold text-[#1B1F3B]">{step.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${step.progress}%`, backgroundColor: step.color }}
                      ></div>
                    </div>
                  </div>

                  {/* Uploaded Files */}
                  {step.files.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-[#1B1F3B] mb-2">Uploaded Files:</p>
                      <div className="space-y-2">
                        {step.files.map((file, fileIndex) => (
                          <div
                            key={fileIndex}
                            className="flex items-center gap-3 p-3 bg-[#F4F7FB] rounded-lg"
                          >
                            <FileText className="w-4 h-4 text-[#0057D9]" />
                            <span className="text-sm text-[#1B1F3B] flex-1">{file}</span>
                            <button className="text-[#0057D9] hover:text-[#0044AA] text-sm font-semibold">
                              View
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  {step.status === 'In Progress' && (
                    <button className="mt-4 px-6 py-3 bg-[#0057D9] text-white rounded-xl font-semibold hover:bg-[#0044AA] transition-colors">
                      Review & Approve
                    </button>
                  )}
                  {step.status === 'Pending' && (
                    <button
                      disabled
                      className="mt-4 px-6 py-3 bg-gray-200 text-[#6B7280] rounded-xl font-semibold cursor-not-allowed"
                    >
                      Waiting for Previous Steps
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Final Actions */}
        {overallProgress === 100 && (
          <div className="mt-8 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-[#1B1F3B] mb-4">All Steps Completed!</h3>
            <p className="text-[#6B7280] mb-6">
              The candidate has completed all onboarding steps. You can now activate their account.
            </p>
            <div className="flex gap-4">
              <button className="px-6 py-3 bg-gradient-to-r from-[#3CB878] to-[#2FA968] text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Activate Account
              </button>
              <button className="px-6 py-3 bg-white border-2 border-[#0057D9] text-[#0057D9] rounded-xl font-semibold hover:bg-[#E3F2FD] transition-colors">
                Send Welcome Email
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
