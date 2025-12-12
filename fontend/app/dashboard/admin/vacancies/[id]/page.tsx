'use client';

import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  DollarSign,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
  TrendingUp,
  Award,
  Building2,
  FileText,
} from 'lucide-react';
import Link from 'next/link';

export default function VacancyDetailPage({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600);
  }, []);

  const vacancy = {
    id: params.id,
    title: 'Service Professional - Plumber',
    roleLevel: 'Mid Level',
    department: 'Operations',
    hiringFor: 'Service Professional',
    employmentType: 'Full-time',
    positions: 5,
    salaryRange: '₹25,000 - ₹40,000/month',
    location: 'Mumbai, Pune, Bangalore',
    experience: '3-5 years',
    description:
      'We are looking for skilled plumbers to join our service professional team. The role involves providing plumbing services to customers, maintaining service quality, and ensuring customer satisfaction.',
    responsibilities: [
      'Perform plumbing repairs and installations at customer locations',
      'Diagnose plumbing issues and provide effective solutions',
      'Maintain service quality standards and customer satisfaction',
      'Manage service equipment and tools efficiently',
      'Complete service documentation and reports',
    ],
    skills: [
      'Plumbing installation and repair',
      'Problem-solving skills',
      'Customer communication',
      'Basic smartphone usage',
      'Time management',
    ],
    createdBy: 'Admin Rakesh',
    createdOn: '2025-01-05',
    lastUpdated: '2025-01-07',
    status: 'Open',
    applicantCount: 42,
  };

  const timeline = [
    { stage: 'Created', date: '2025-01-05', completed: true },
    { stage: 'First Applicant', date: '2025-01-05', completed: true },
    { stage: 'Shortlisting Started', date: '2025-01-06', completed: true },
    { stage: 'Interviews Started', date: '2025-01-07', completed: true },
    { stage: 'Offer Released', date: '-', completed: false },
    { stage: 'Vacancy Filled', date: '-', completed: false },
  ];

  const analytics = [
    { label: 'Total Applicants', value: 42, color: '#0057D9', icon: <Users className="w-5 h-5" /> },
    { label: 'Shortlisted', value: 18, color: '#00A8E8', icon: <CheckCircle2 className="w-5 h-5" /> },
    { label: 'In Interview', value: 8, color: '#FFB020', icon: <Clock className="w-5 h-5" /> },
    { label: 'Final Stage', value: 3, color: '#3CB878', icon: <Award className="w-5 h-5" /> },
    { label: 'Rejected', value: 13, color: '#E53935', icon: <XCircle className="w-5 h-5" /> },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F7FB]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#0057D9] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#1B1F3B] font-medium">Loading vacancy details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7FB] p-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/admin/vacancies/list"
          className="inline-flex items-center gap-2 text-[#0057D9] hover:text-[#0044AA] font-semibold mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Vacancies
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#1B1F3B] mb-2">{vacancy.title}</h1>
            <div className="flex items-center gap-4 text-[#6B7280]">
              <span className="flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                {vacancy.department}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {vacancy.location}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Posted on {vacancy.createdOn}
              </span>
            </div>
          </div>
          <span className="px-4 py-2 bg-[#0057D9] text-white rounded-xl font-semibold">{vacancy.status}</span>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        {analytics.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow"
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
              style={{ backgroundColor: `${item.color}20`, color: item.color }}
            >
              {item.icon}
            </div>
            <h3 className="text-3xl font-bold text-[#1B1F3B] mb-1">{item.value}</h3>
            <p className="text-sm text-[#6B7280]">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Vacancy Overview */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-[#1B1F3B] mb-6 flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-[#0057D9]" />
              Vacancy Overview
            </h2>
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <p className="text-sm text-[#6B7280] mb-1">Role Level</p>
                <p className="font-semibold text-[#1B1F3B]">{vacancy.roleLevel}</p>
              </div>
              <div>
                <p className="text-sm text-[#6B7280] mb-1">Employment Type</p>
                <p className="font-semibold text-[#1B1F3B]">{vacancy.employmentType}</p>
              </div>
              <div>
                <p className="text-sm text-[#6B7280] mb-1">Positions</p>
                <p className="font-semibold text-[#1B1F3B]">{vacancy.positions}</p>
              </div>
              <div>
                <p className="text-sm text-[#6B7280] mb-1">Salary Range</p>
                <p className="font-semibold text-[#1B1F3B]">{vacancy.salaryRange}</p>
              </div>
              <div>
                <p className="text-sm text-[#6B7280] mb-1">Experience Required</p>
                <p className="font-semibold text-[#1B1F3B]">{vacancy.experience}</p>
              </div>
              <div>
                <p className="text-sm text-[#6B7280] mb-1">Hiring For</p>
                <p className="font-semibold text-[#1B1F3B]">{vacancy.hiringFor}</p>
              </div>
            </div>

            <div className="mb-8 pb-8 border-b border-gray-100">
              <h3 className="font-bold text-[#1B1F3B] mb-3">Job Description</h3>
              <p className="text-[#6B7280] leading-relaxed">{vacancy.description}</p>
            </div>

            <div className="mb-8 pb-8 border-b border-gray-100">
              <h3 className="font-bold text-[#1B1F3B] mb-3">Key Responsibilities</h3>
              <ul className="space-y-2">
                {vacancy.responsibilities.map((resp, index) => (
                  <li key={index} className="flex items-start gap-3 text-[#6B7280]">
                    <CheckCircle2 className="w-5 h-5 text-[#3CB878] flex-shrink-0 mt-0.5" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-[#1B1F3B] mb-3">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {vacancy.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-[#E3F2FD] text-[#0057D9] rounded-lg text-sm font-semibold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Timeline */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-[#1B1F3B] mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-[#0057D9]" />
              Hiring Progress
            </h2>
            <div className="space-y-4">
              {timeline.map((stage, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="relative">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        stage.completed
                          ? 'bg-[#3CB878] text-white'
                          : 'bg-gray-200 text-[#6B7280]'
                      }`}
                    >
                      {stage.completed ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                    </div>
                    {index < timeline.length - 1 && (
                      <div className="absolute left-5 top-10 w-0.5 h-6 bg-gray-200"></div>
                    )}
                  </div>
                  <div className="flex-1 pt-2">
                    <p className={`font-semibold ${stage.completed ? 'text-[#1B1F3B]' : 'text-[#6B7280]'}`}>
                      {stage.stage}
                    </p>
                    <p className="text-xs text-[#6B7280] mt-1">{stage.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-[#1B1F3B] mb-6">Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-[#6B7280] mb-1">Created By</p>
                <p className="font-semibold text-[#1B1F3B]">{vacancy.createdBy}</p>
              </div>
              <div>
                <p className="text-sm text-[#6B7280] mb-1">Created On</p>
                <p className="font-semibold text-[#1B1F3B]">{vacancy.createdOn}</p>
              </div>
              <div>
                <p className="text-sm text-[#6B7280] mb-1">Last Updated</p>
                <p className="font-semibold text-[#1B1F3B]">{vacancy.lastUpdated}</p>
              </div>
              <div>
                <p className="text-sm text-[#6B7280] mb-1">Total Applicants</p>
                <p className="font-semibold text-[#1B1F3B]">{vacancy.applicantCount}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-[#1B1F3B] mb-4">Actions</h2>
            <div className="space-y-3">
              <Link
                href={`/dashboard/admin/vacancies/applicants?vacancy=${params.id}`}
                className="block w-full px-4 py-3 bg-[#0057D9] text-white rounded-xl font-semibold text-center hover:bg-[#0044AA] transition-colors"
              >
                View All Applicants
              </Link>
              <Link
                href={`/dashboard/admin/vacancies/edit/${params.id}`}
                className="block w-full px-4 py-3 bg-white border-2 border-[#0057D9] text-[#0057D9] rounded-xl font-semibold text-center hover:bg-[#E3F2FD] transition-colors"
              >
                Edit Vacancy
              </Link>
              <button className="w-full px-4 py-3 bg-[#E53935] text-white rounded-xl font-semibold hover:bg-[#C62828] transition-colors">
                Close Vacancy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
