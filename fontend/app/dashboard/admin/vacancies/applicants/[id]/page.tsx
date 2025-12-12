'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  FileText,
  Download,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Calendar,
  Star,
} from 'lucide-react';
import Link from 'next/link';

export default function ApplicantProfilePage({ params }: { params: { id: string } }) {
  const [showDocumentAction, setShowDocumentAction] = useState(false);

  const applicant = {
    id: params.id,
    name: 'Rajesh Kumar',
    photo: 'https://via.placeholder.com/150',
    age: 32,
    phone: '+91 98765 43210',
    email: 'rajesh.kumar@example.com',
    location: 'Mumbai, Maharashtra',
    appliedPosition: 'Service Professional - Plumber',
    currentStage: 'Shortlisted',
    score: 8.5,
    resume: '/resumes/rajesh-kumar.pdf',
    education: [
      { degree: 'ITI Plumbing', institution: 'Government ITI Mumbai', year: '2012' },
      { degree: '12th Standard', institution: 'Maharashtra State Board', year: '2010' },
    ],
    skills: ['Plumbing Installation', 'Repair & Maintenance', 'Pipe Fitting', 'Water Systems', 'Problem Solving'],
    experience: [
      {
        title: 'Senior Plumber',
        company: 'ABC Plumbing Services',
        duration: '2018 - 2024',
        description: 'Handled residential and commercial plumbing projects',
      },
      {
        title: 'Plumber',
        company: 'XYZ Construction',
        duration: '2014 - 2018',
        description: 'Installation and repair of plumbing systems',
      },
    ],
    certifications: ['ITI Plumbing Certificate', 'Safety Training Certified', 'Advanced Pipe Fitting'],
    professionalCategory: 'Service Professional',
    documents: [
      { type: 'ID Proof (Aadhaar)', status: 'Verified', file: 'aadhaar.pdf' },
      { type: 'Address Proof', status: 'Verified', file: 'address.pdf' },
      { type: 'ITI Certificate', status: 'Verified', file: 'iti-cert.pdf' },
      { type: 'Police Verification', status: 'Pending', file: 'police-verify.pdf' },
    ],
    interviewStatus: {
      scheduled: true,
      date: '2025-01-15',
      time: '10:00 AM',
      interviewer: 'HR Manager Sunita',
      notes: 'Initial screening completed. Technical round scheduled.',
      score: 8,
    },
  };

  const handleDocumentAction = (action: string, docType: string) => {
    alert(`${action} action performed on ${docType}`);
    setShowDocumentAction(false);
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] p-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/admin/vacancies/applicants"
          className="inline-flex items-center gap-2 text-[#0057D9] hover:text-[#0044AA] font-semibold mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Applicants
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Applicant Summary */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-start gap-6 mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-[#0057D9] to-[#0044AA] rounded-2xl flex items-center justify-center text-white text-3xl font-bold">
                {applicant.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-[#1B1F3B] mb-2">{applicant.name}</h1>
                <div className="flex flex-wrap gap-4 text-[#6B7280] mb-4">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {applicant.age} years
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {applicant.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {applicant.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {applicant.location}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-4 py-2 bg-[#3CB878] text-white rounded-xl font-semibold text-sm">
                    {applicant.currentStage}
                  </span>
                  <div className="flex items-center gap-1 px-4 py-2 bg-[#FFF8E1] rounded-xl">
                    <Star className="w-5 h-5 text-[#FFB020] fill-[#FFB020]" />
                    <span className="font-bold text-[#1B1F3B]">{applicant.score}</span>
                    <span className="text-sm text-[#6B7280]">/10</span>
                  </div>
                  <a
                    href={applicant.resume}
                    download
                    className="px-4 py-2 bg-[#0057D9] text-white rounded-xl font-semibold text-sm hover:bg-[#0044AA] transition-colors flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Resume
                  </a>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 bg-[#F4F7FB] rounded-xl">
              <div>
                <p className="text-sm text-[#6B7280] mb-1">Applied Position</p>
                <p className="font-semibold text-[#1B1F3B]">{applicant.appliedPosition}</p>
              </div>
              <div>
                <p className="text-sm text-[#6B7280] mb-1">Professional Category</p>
                <p className="font-semibold text-[#1B1F3B]">{applicant.professionalCategory}</p>
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-[#1B1F3B] mb-6 flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-[#0057D9]" />
              Education
            </h2>
            <div className="space-y-4">
              {applicant.education.map((edu, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-[#F4F7FB] rounded-xl">
                  <div className="w-12 h-12 bg-[#0057D9] text-white rounded-lg flex items-center justify-center font-bold">
                    {edu.year}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-[#1B1F3B] mb-1">{edu.degree}</p>
                    <p className="text-sm text-[#6B7280]">{edu.institution}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-[#1B1F3B] mb-6 flex items-center gap-2">
              <Award className="w-6 h-6 text-[#0057D9]" />
              Skills
            </h2>
            <div className="flex flex-wrap gap-3">
              {applicant.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-[#E3F2FD] text-[#0057D9] rounded-lg font-semibold text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Work Experience */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-[#1B1F3B] mb-6 flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-[#0057D9]" />
              Work Experience
            </h2>
            <div className="space-y-4">
              {applicant.experience.map((exp, index) => (
                <div key={index} className="relative pl-8 pb-6 border-l-2 border-[#E5E7EB] last:border-0 last:pb-0">
                  <div className="absolute -left-2 top-0 w-4 h-4 bg-[#0057D9] rounded-full"></div>
                  <div className="mb-1">
                    <p className="font-semibold text-[#1B1F3B]">{exp.title}</p>
                    <p className="text-sm text-[#6B7280]">{exp.company}</p>
                  </div>
                  <p className="text-xs text-[#6B7280] mb-2">{exp.duration}</p>
                  <p className="text-sm text-[#1B1F3B]">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-[#1B1F3B] mb-6 flex items-center gap-2">
              <Award className="w-6 h-6 text-[#0057D9]" />
              Certifications
            </h2>
            <div className="space-y-2">
              {applicant.certifications.map((cert, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-[#F4F7FB] rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-[#3CB878]" />
                  <span className="font-semibold text-[#1B1F3B]">{cert}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-[#1B1F3B] mb-6 flex items-center gap-2">
              <FileText className="w-6 h-6 text-[#0057D9]" />
              Uploaded Documents
            </h2>
            <div className="space-y-4">
              {applicant.documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-[#0057D9] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      doc.status === 'Verified' ? 'bg-[#E8F5E9]' : 'bg-[#FFF8E1]'
                    }`}>
                      {doc.status === 'Verified' ? (
                        <CheckCircle2 className="w-6 h-6 text-[#3CB878]" />
                      ) : (
                        <AlertCircle className="w-6 h-6 text-[#FFB020]" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-[#1B1F3B]">{doc.type}</p>
                      <p className="text-sm text-[#6B7280]">{doc.file}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      doc.status === 'Verified'
                        ? 'bg-[#E8F5E9] text-[#3CB878]'
                        : 'bg-[#FFF8E1] text-[#FFB020]'
                    }`}>
                      {doc.status}
                    </span>
                    {doc.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => handleDocumentAction('Approve', doc.type)}
                          className="px-4 py-2 bg-[#3CB878] text-white rounded-lg font-semibold hover:bg-[#2FA968] transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleDocumentAction('Reject', doc.type)}
                          className="px-4 py-2 bg-[#E53935] text-white rounded-lg font-semibold hover:bg-[#C62828] transition-colors"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <a
                      href={`/documents/${doc.file}`}
                      download
                      className="p-2 hover:bg-[#F4F7FB] rounded-lg transition-colors"
                    >
                      <Download className="w-5 h-5 text-[#0057D9]" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Interview Status */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-[#1B1F3B] mb-6 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-[#0057D9]" />
              Interview Status
            </h2>
            {applicant.interviewStatus.scheduled ? (
              <div className="space-y-4">
                <div className="p-4 bg-[#E3F2FD] rounded-xl">
                  <p className="text-sm text-[#6B7280] mb-1">Scheduled Date</p>
                  <p className="font-bold text-[#1B1F3B]">
                    {applicant.interviewStatus.date} at {applicant.interviewStatus.time}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[#6B7280] mb-1">Interviewer</p>
                  <p className="font-semibold text-[#1B1F3B]">{applicant.interviewStatus.interviewer}</p>
                </div>
                <div>
                  <p className="text-sm text-[#6B7280] mb-1">Interview Notes</p>
                  <p className="text-sm text-[#1B1F3B]">{applicant.interviewStatus.notes}</p>
                </div>
                <div>
                  <p className="text-sm text-[#6B7280] mb-2">Interview Score</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-[#FFB020] fill-[#FFB020]" />
                    <span className="font-bold text-[#1B1F3B]">{applicant.interviewStatus.score}</span>
                    <span className="text-sm text-[#6B7280]">/10</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-[#6B7280]">No interview scheduled yet</p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-[#1B1F3B] mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                href={`/dashboard/admin/vacancies/interview/${applicant.id}`}
                className="block w-full px-4 py-3 bg-[#0057D9] text-white rounded-xl font-semibold text-center hover:bg-[#0044AA] transition-colors"
              >
                Schedule Interview
              </Link>
              <Link
                href={`/dashboard/admin/vacancies/evaluation/${applicant.id}`}
                className="block w-full px-4 py-3 bg-[#3CB878] text-white rounded-xl font-semibold text-center hover:bg-[#2FA968] transition-colors"
              >
                Evaluate Applicant
              </Link>
              <Link
                href={`/dashboard/admin/vacancies/decision/${applicant.id}`}
                className="block w-full px-4 py-3 bg-white border-2 border-[#0057D9] text-[#0057D9] rounded-xl font-semibold text-center hover:bg-[#E3F2FD] transition-colors"
              >
                Make Decision
              </Link>
              <button className="w-full px-4 py-3 bg-[#E53935] text-white rounded-xl font-semibold hover:bg-[#C62828] transition-colors">
                Reject Applicant
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
