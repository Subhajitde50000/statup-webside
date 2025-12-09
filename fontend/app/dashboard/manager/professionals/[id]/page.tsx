'use client';

import React, { useState } from 'react';
import { 
  ArrowLeft, CheckCircle, Ban, MessageSquare, FileText, Mail, Phone, MapPin, 
  Calendar, Briefcase, Star, Award, TrendingUp, Clock, AlertTriangle, 
  Download, Eye, XCircle, Flag, User, Languages, DollarSign
} from 'lucide-react';
import Link from 'next/link';
import TopNavbar from '../../components/TopNavbar';
import LeftSidebar from '../../components/LeftSidebar';

export default function ProfessionalProfilePage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('personal');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Mock data
  const professional = {
    id: params.id,
    name: 'Rajesh Kumar',
    photo: 'https://i.pravatar.cc/150?img=11',
    email: 'rajesh.kumar@email.com',
    phone: '+91 98765 43210',
    category: 'Electrician',
    status: 'active',
    kycVerified: true,
    rating: 4.9,
    reviewCount: 134,
    completedJobs: 245,
    totalEarnings: 245000,
    joiningDate: '2023-03-15',
    gender: 'Male',
    dob: '1985-06-20',
    address: '123 Service Lane, Electronic City, Bangalore',
    city: 'Bangalore',
    state: 'Karnataka',
    zip: '560100',
    languages: ['English', 'Hindi', 'Kannada'],
    experience: 8,
    acceptanceRate: 95,
    cancellationRate: 2,
    onTimeRate: 98,
  };

  const skills = {
    primary: 'Electrical Work',
    subSkills: ['Wiring', 'AC Repair', 'Short-circuit Fixing', 'MCB Installation', 'Fan Installation'],
    certificates: ['Electrician License - Karnataka', 'Safety Training Certificate', 'ITI Electrical - 2015']
  };

  const jobs = [
    { id: 1, date: '2024-12-05', customer: 'Amit Sharma', service: 'AC Repair', earnings: 1200, rating: 5 },
    { id: 2, date: '2024-12-03', customer: 'Priya Singh', service: 'Wiring Installation', earnings: 2500, rating: 4.8 },
    { id: 3, date: '2024-12-01', customer: 'Rahul Verma', service: 'Fan Installation', earnings: 800, rating: 5 },
    { id: 4, date: '2024-11-28', customer: 'Sneha Patel', service: 'Short Circuit Fix', earnings: 1500, rating: 4.9 },
  ];

  const reviews = [
    { id: 1, customer: 'Amit Sharma', rating: 5, review: 'Excellent work! Very professional and quick.', date: '2024-12-05' },
    { id: 2, customer: 'Priya Singh', rating: 4, review: 'Good service, but took longer than expected.', date: '2024-12-03' },
    { id: 3, customer: 'Rahul Verma', rating: 5, review: 'Highly skilled and polite. Will hire again!', date: '2024-12-01' },
  ];

  const documents = [
    { id: 1, name: 'Government ID (Aadhaar)', type: 'govt-id', status: 'approved', url: '#' },
    { id: 2, name: 'Address Proof', type: 'address', status: 'approved', url: '#' },
    { id: 3, name: 'Electrician License', type: 'certificate', status: 'approved', url: '#' },
    { id: 4, name: 'Background Check Report', type: 'background', status: 'pending', url: '#' },
  ];

  const warnings = [
    { id: 1, type: 'Late Arrival', date: '2024-10-15', severity: 'low', description: 'Arrived 30 minutes late to job', issuedBy: 'System' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <TopNavbar />
      <div className="flex">
        <LeftSidebar isOpen={sidebarOpen} />
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
          <div className="p-8">
            <div className="max-w-[1400px] mx-auto">
              {/* Header */}
              <div className="mb-8">
                <Link href="/dashboard/manager/professionals">
                  <button className="flex items-center gap-2 text-[#64748B] hover:text-[#3B82F6] mb-4 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm font-medium">Back to Professionals</span>
                  </button>
                </Link>

                <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <img 
                        src={professional.photo} 
                        alt={professional.name}
                        className="w-24 h-24 rounded-full object-cover ring-4 ring-[#E2E8F0]"
                      />
                      <div>
                        <h1 className="text-2xl font-semibold text-[#1E293B] mb-2">{professional.name}</h1>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="px-3 py-1 bg-[#EFF6FF] text-[#3B82F6] rounded-full text-sm font-semibold">
                            {professional.category}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            professional.status === 'active' 
                              ? 'bg-[#D1FAE5] text-[#059669]' 
                              : 'bg-[#FEE2E2] text-[#DC2626]'
                          }`}>
                            {professional.status.toUpperCase()}
                          </span>
                          {professional.kycVerified && (
                            <div className="flex items-center gap-1 text-[#059669]">
                              <CheckCircle className="w-4 h-4" />
                              <span className="text-xs font-semibold">KYC Verified</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                          <span className="text-sm font-semibold text-[#1E293B]">{professional.rating}</span>
                          <span className="text-xs text-[#64748B]">({professional.reviewCount} reviews)</span>
                          <span className="text-xs text-[#64748B] ml-2">• {professional.completedJobs} jobs completed</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {!professional.kycVerified && (
                        <button className="px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-colors text-sm font-medium flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Approve KYC
                        </button>
                      )}
                      <button className="px-4 py-2 bg-[#EF4444] text-white rounded-lg hover:bg-[#DC2626] transition-colors text-sm font-medium flex items-center gap-2">
                        <Ban className="w-4 h-4" />
                        Suspend
                      </button>
                      <button className="px-4 py-2 bg-[#DC2626] text-white rounded-lg hover:bg-[#B91C1C] transition-colors text-sm font-medium flex items-center gap-2">
                        <XCircle className="w-4 h-4" />
                        Ban
                      </button>
                      <button className="px-4 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors text-sm font-medium flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Message
                      </button>
                      <button className="px-4 py-2 bg-white border border-[#E2E8F0] text-[#64748B] rounded-lg hover:bg-[#F8FAFC] transition-colors text-sm font-medium flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        View Reports
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] mb-6 overflow-hidden">
                <div className="flex items-center gap-1 p-2 overflow-x-auto">
                  {['personal', 'skills', 'work-history', 'jobs', 'reviews', 'documents', 'warnings'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                        activeTab === tab
                          ? 'bg-[#3B82F6] text-white shadow-sm'
                          : 'text-[#64748B] hover:bg-[#F8FAFC]'
                      }`}
                    >
                      {tab.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Sections */}
              {activeTab === 'personal' && (
                <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-[#1E293B] mb-6">Personal Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">Full Name</label>
                        <p className="text-sm text-[#1E293B] mt-1 font-medium">{professional.name}</p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide flex items-center gap-1">
                          <Mail className="w-3 h-3" /> Email
                        </label>
                        <p className="text-sm text-[#3B82F6] mt-1">{professional.email}</p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide flex items-center gap-1">
                          <Phone className="w-3 h-3" /> Phone
                        </label>
                        <p className="text-sm text-[#3B82F6] mt-1">{professional.phone}</p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide flex items-center gap-1">
                          <User className="w-3 h-3" /> Gender
                        </label>
                        <p className="text-sm text-[#1E293B] mt-1">{professional.gender}</p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> Date of Birth
                        </label>
                        <p className="text-sm text-[#1E293B] mt-1">{professional.dob}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> Address
                        </label>
                        <p className="text-sm text-[#1E293B] mt-1 leading-relaxed">{professional.address}</p>
                        <p className="text-sm text-[#64748B] mt-1">{professional.city}, {professional.state} - {professional.zip}</p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide flex items-center gap-1">
                          <Languages className="w-3 h-3" /> Languages Spoken
                        </label>
                        <div className="flex items-center gap-2 mt-2">
                          {professional.languages.map((lang, idx) => (
                            <span key={idx} className="px-2 py-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded text-xs font-medium text-[#1E293B]">
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> Joining Date
                        </label>
                        <p className="text-sm text-[#1E293B] mt-1">{professional.joiningDate}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'skills' && (
                <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-[#1E293B] mb-6 flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#3B82F6]" />
                    Skills & Professional Category
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">Primary Skill</label>
                      <p className="text-lg font-semibold text-[#1E293B] mt-2">{skills.primary}</p>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">Sub Skills</label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {skills.subSkills.map((skill, idx) => (
                          <span key={idx} className="px-3 py-2 bg-[#EFF6FF] text-[#3B82F6] rounded-lg text-sm font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide flex items-center gap-1">
                        <Briefcase className="w-3 h-3" /> Years of Experience
                      </label>
                      <p className="text-lg font-semibold text-[#1E293B] mt-2">{professional.experience} years</p>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">Training Certificates</label>
                      <div className="space-y-2 mt-2">
                        {skills.certificates.map((cert, idx) => (
                          <div key={idx} className="flex items-center gap-2 p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                            <Award className="w-4 h-4 text-[#10B981]" />
                            <span className="text-sm font-medium text-[#1E293B]">{cert}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'work-history' && (
                <div className="space-y-6">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-xl p-6 text-white">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm opacity-90">Total Earnings</span>
                        <DollarSign className="w-6 h-6 opacity-80" />
                      </div>
                      <h3 className="text-3xl font-bold">₹{professional.totalEarnings.toLocaleString()}</h3>
                      <p className="text-xs opacity-75 mt-2">From {professional.completedJobs} jobs</p>
                    </div>

                    <div className="bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl p-6 text-white">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm opacity-90">Acceptance Rate</span>
                        <TrendingUp className="w-6 h-6 opacity-80" />
                      </div>
                      <h3 className="text-3xl font-bold">{professional.acceptanceRate}%</h3>
                      <p className="text-xs opacity-75 mt-2">Industry avg: 85%</p>
                    </div>

                    <div className="bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-xl p-6 text-white">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm opacity-90">On-Time Arrivals</span>
                        <Clock className="w-6 h-6 opacity-80" />
                      </div>
                      <h3 className="text-3xl font-bold">{professional.onTimeRate}%</h3>
                      <p className="text-xs opacity-75 mt-2">Very punctual!</p>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-[#1E293B] mb-6">Performance Metrics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-[#64748B]">Cancellation Rate</span>
                          <span className="text-sm font-semibold text-[#1E293B]">{professional.cancellationRate}%</span>
                        </div>
                        <div className="w-full bg-[#F1F5F9] rounded-full h-2">
                          <div className="bg-[#10B981] h-2 rounded-full" style={{width: `${100 - professional.cancellationRate}%`}}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-[#64748B]">Average Rating</span>
                          <span className="text-sm font-semibold text-[#1E293B]">{professional.rating}/5.0</span>
                        </div>
                        <div className="w-full bg-[#F1F5F9] rounded-full h-2">
                          <div className="bg-[#F59E0B] h-2 rounded-full" style={{width: `${(professional.rating / 5) * 100}%`}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'jobs' && (
                <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-[#E2E8F0]">
                    <h2 className="text-lg font-semibold text-[#1E293B]">Jobs Completed</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                          <th className="text-left py-3 px-6 text-xs font-semibold text-[#64748B] uppercase">Job ID</th>
                          <th className="text-left py-3 px-6 text-xs font-semibold text-[#64748B] uppercase">Date</th>
                          <th className="text-left py-3 px-6 text-xs font-semibold text-[#64748B] uppercase">Customer</th>
                          <th className="text-left py-3 px-6 text-xs font-semibold text-[#64748B] uppercase">Service</th>
                          <th className="text-left py-3 px-6 text-xs font-semibold text-[#64748B] uppercase">Earnings</th>
                          <th className="text-left py-3 px-6 text-xs font-semibold text-[#64748B] uppercase">Rating</th>
                        </tr>
                      </thead>
                      <tbody>
                        {jobs.map((job) => (
                          <tr key={job.id} className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC]">
                            <td className="py-4 px-6 font-mono text-sm text-[#64748B]">#{job.id}</td>
                            <td className="py-4 px-6 text-sm text-[#1E293B]">{job.date}</td>
                            <td className="py-4 px-6 text-sm font-medium text-[#1E293B]">{job.customer}</td>
                            <td className="py-4 px-6 text-sm text-[#64748B]">{job.service}</td>
                            <td className="py-4 px-6 text-sm font-semibold text-[#10B981]">₹{job.earnings}</td>
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 fill-[#F59E0B] text-[#F59E0B]" />
                                <span className="text-sm font-semibold">{job.rating}</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-[#1E293B] mb-6">Customer Reviews</h2>
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="border border-[#E2E8F0] rounded-lg p-4 hover:border-[#3B82F6] transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-[#1E293B] text-sm">{review.customer}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`w-4 h-4 ${i < review.rating ? 'fill-[#F59E0B] text-[#F59E0B]' : 'text-[#E2E8F0]'}`} 
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-[#64748B]">{review.date}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="p-1.5 text-[#EF4444] hover:bg-[#FEF2F2] rounded transition-colors text-xs">
                              <XCircle className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 text-[#F59E0B] hover:bg-[#FFFBEB] rounded transition-colors text-xs">
                              <Flag className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-[#64748B] leading-relaxed">{review.review}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'documents' && (
                <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-[#1E293B] mb-6">Uploaded Documents</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {documents.map((doc) => (
                      <div key={doc.id} className="border border-[#E2E8F0] rounded-lg p-4 hover:border-[#3B82F6] transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-[#EFF6FF] flex items-center justify-center">
                              <FileText className="w-6 h-6 text-[#3B82F6]" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-[#1E293B] text-sm">{doc.name}</h3>
                              <span className={`text-xs font-semibold mt-1 inline-block ${
                                doc.status === 'approved' ? 'text-[#059669]' : 'text-[#F59E0B]'
                              }`}>
                                {doc.status.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="flex-1 px-3 py-2 bg-[#F8FAFC] text-[#3B82F6] rounded-lg hover:bg-[#EFF6FF] transition-colors text-xs font-medium flex items-center justify-center gap-1">
                            <Eye className="w-3 h-3" />
                            View
                          </button>
                          {doc.status === 'pending' && (
                            <>
                              <button className="flex-1 px-3 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-colors text-xs font-medium flex items-center justify-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                Approve
                              </button>
                              <button className="flex-1 px-3 py-2 bg-[#EF4444] text-white rounded-lg hover:bg-[#DC2626] transition-colors text-xs font-medium flex items-center justify-center gap-1">
                                <XCircle className="w-3 h-3" />
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'warnings' && (
                <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-[#1E293B] mb-6 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />
                    Warnings & Strike History
                  </h2>
                  {warnings.length > 0 ? (
                    <div className="space-y-4">
                      {warnings.map((warning) => (
                        <div 
                          key={warning.id} 
                          className={`border-l-4 rounded-lg p-4 ${
                            warning.severity === 'high' 
                              ? 'border-[#EF4444] bg-[#FEF2F2]' 
                              : warning.severity === 'medium' 
                              ? 'border-[#F59E0B] bg-[#FFFBEB]' 
                              : 'border-[#3B82F6] bg-[#EFF6FF]'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-[#1E293B] text-sm mb-1">{warning.type}</h3>
                              <p className="text-sm text-[#64748B] mb-2">{warning.description}</p>
                              <div className="flex items-center gap-3 text-xs text-[#64748B]">
                                <span>{warning.date}</span>
                                <span>• Issued by: {warning.issuedBy}</span>
                              </div>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              warning.severity === 'high' 
                                ? 'bg-[#FEE2E2] text-[#DC2626]' 
                                : warning.severity === 'medium' 
                                ? 'bg-[#FEF3C7] text-[#D97706]' 
                                : 'bg-[#DBEAFE] text-[#2563EB]'
                            }`}>
                              {warning.severity.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <CheckCircle className="w-12 h-12 text-[#10B981] mx-auto mb-3" />
                      <p className="text-[#64748B]">No warnings or strikes</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
