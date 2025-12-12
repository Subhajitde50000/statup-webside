'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Users,
  Eye,
  ChevronLeft,
  ChevronRight,
  Star,
  MapPin,
  Briefcase,
  Clock,
} from 'lucide-react';
import Link from 'next/link';

export default function ApplicantListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [skillFilter, setSkillFilter] = useState('all');
  const [experienceFilter, setExperienceFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 10;

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600);
  }, []);

  const applicants = [
    {
      id: 'APP001',
      name: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      email: 'rajesh.kumar@example.com',
      experience: '5 years',
      appliedPosition: 'Service Professional - Plumber',
      currentStage: 'Shortlisted',
      score: 8.5,
      stageColor: '#3CB878',
      city: 'Mumbai',
      skills: ['Plumbing', 'Installation'],
    },
    {
      id: 'APP002',
      name: 'Priya Sharma',
      phone: '+91 98765 43211',
      email: 'priya.sharma@example.com',
      experience: '3 years',
      appliedPosition: 'Shop Manager - Electronics',
      currentStage: 'Interview Scheduled',
      score: 7.8,
      stageColor: '#FFB020',
      city: 'Bangalore',
      skills: ['Management', 'Sales'],
    },
    {
      id: 'APP003',
      name: 'Amit Patel',
      phone: '+91 98765 43212',
      email: 'amit.patel@example.com',
      experience: '2 years',
      appliedPosition: 'Delivery Partner',
      currentStage: 'Background Check',
      score: 7.2,
      stageColor: '#00A8E8',
      city: 'Pune',
      skills: ['Driving', 'Navigation'],
    },
    {
      id: 'APP004',
      name: 'Sneha Reddy',
      phone: '+91 98765 43213',
      email: 'sneha.reddy@example.com',
      experience: '1 year',
      appliedPosition: 'Customer Support Executive',
      currentStage: 'Under Review',
      score: 6.9,
      stageColor: '#0057D9',
      city: 'Hyderabad',
      skills: ['Communication', 'CRM'],
    },
    {
      id: 'APP005',
      name: 'Vikram Singh',
      phone: '+91 98765 43214',
      email: 'vikram.singh@example.com',
      experience: '7 years',
      appliedPosition: 'Service Professional - Electrician',
      currentStage: 'Offer Released',
      score: 9.2,
      stageColor: '#3CB878',
      city: 'Delhi',
      skills: ['Electrical', 'Troubleshooting'],
    },
    {
      id: 'APP006',
      name: 'Anjali Gupta',
      phone: '+91 98765 43215',
      email: 'anjali.gupta@example.com',
      experience: '4 years',
      appliedPosition: 'KYC Verification Officer',
      currentStage: 'Rejected',
      score: 5.8,
      stageColor: '#E53935',
      city: 'Chennai',
      skills: ['Verification', 'Documentation'],
    },
    {
      id: 'APP007',
      name: 'Ravi Verma',
      phone: '+91 98765 43216',
      email: 'ravi.verma@example.com',
      experience: '6 years',
      appliedPosition: 'Service Professional - AC Repair',
      currentStage: 'Shortlisted',
      score: 8.0,
      stageColor: '#3CB878',
      city: 'Mumbai',
      skills: ['AC Repair', 'Maintenance'],
    },
    {
      id: 'APP008',
      name: 'Meera Nair',
      phone: '+91 98765 43217',
      email: 'meera.nair@example.com',
      experience: '3 years',
      appliedPosition: 'Quality Analyst',
      currentStage: 'Interview Scheduled',
      score: 7.5,
      stageColor: '#FFB020',
      city: 'Kochi',
      skills: ['QA', 'Testing'],
    },
  ];

  const filteredApplicants = applicants.filter((applicant) => {
    const matchesSearch =
      applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = stageFilter === 'all' || applicant.currentStage === stageFilter;
    const matchesSkill =
      skillFilter === 'all' || applicant.skills.some((s) => s.toLowerCase().includes(skillFilter.toLowerCase()));
    const matchesExperience = experienceFilter === 'all' || applicant.experience.includes(experienceFilter);

    return matchesSearch && matchesStage && matchesSkill && matchesExperience;
  });

  const totalPages = Math.ceil(filteredApplicants.length / itemsPerPage);
  const paginatedApplicants = filteredApplicants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F7FB]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#0057D9] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#1B1F3B] font-medium">Loading applicants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7FB] p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1B1F3B] mb-2">All Applicants</h1>
        <p className="text-[#6B7280]">View and manage all job applicants across vacancies</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6B7280] w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#0057D9] transition-colors"
              />
            </div>
          </div>
          <div>
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#0057D9] transition-colors"
            >
              <option value="all">All Stages</option>
              <option value="Under Review">Under Review</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview Scheduled">Interview Scheduled</option>
              <option value="Background Check">Background Check</option>
              <option value="Offer Released">Offer Released</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <div>
            <select
              value={experienceFilter}
              onChange={(e) => setExperienceFilter(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#0057D9] transition-colors"
            >
              <option value="all">All Experience</option>
              <option value="0-1">0-1 years</option>
              <option value="1-3">1-3 years</option>
              <option value="3-5">3-5 years</option>
              <option value="5-10">5-10 years</option>
              <option value="10+">10+ years</option>
            </select>
          </div>
          <div>
            <input
              type="text"
              placeholder="Filter by skill..."
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#0057D9] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F4F7FB]">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-[#1B1F3B]">Applicant</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-[#1B1F3B]">Contact</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-[#1B1F3B]">Experience</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-[#1B1F3B]">Applied Position</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-[#1B1F3B]">Current Stage</th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-[#1B1F3B]">Score</th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-[#1B1F3B]">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedApplicants.map((applicant) => (
                <tr key={applicant.id} className="border-t border-gray-100 hover:bg-[#F4F7FB] transition-colors">
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-semibold text-[#1B1F3B]">{applicant.name}</p>
                      <p className="text-xs text-[#6B7280]">{applicant.id}</p>
                      <div className="flex items-center gap-1 mt-1 text-xs text-[#6B7280]">
                        <MapPin className="w-3 h-3" />
                        {applicant.city}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm text-[#1B1F3B]">{applicant.phone}</p>
                    <p className="text-xs text-[#6B7280]">{applicant.email}</p>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-[#6B7280]" />
                      <span className="text-sm font-semibold text-[#1B1F3B]">{applicant.experience}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-start gap-2">
                      <Briefcase className="w-4 h-4 text-[#0057D9] mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-[#1B1F3B]">{applicant.appliedPosition}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                      style={{ backgroundColor: applicant.stageColor }}
                    >
                      {applicant.currentStage}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="w-4 h-4 text-[#FFB020] fill-[#FFB020]" />
                      <span className="font-bold text-[#1B1F3B]">{applicant.score}</span>
                      <span className="text-xs text-[#6B7280]">/10</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <Link
                      href={`/dashboard/admin/vacancies/applicants/${applicant.id}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#0057D9] text-white rounded-lg font-semibold hover:bg-[#0044AA] transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View Profile
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          <p className="text-sm text-[#6B7280]">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredApplicants.length)} of {filteredApplicants.length}{' '}
            applicants
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border-2 border-gray-200 hover:bg-[#F4F7FB] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-[#1B1F3B]" />
            </button>
            {[...Array(Math.min(totalPages, 5))].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  currentPage === index + 1
                    ? 'bg-[#0057D9] text-white'
                    : 'border-2 border-gray-200 text-[#1B1F3B] hover:bg-[#F4F7FB]'
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border-2 border-gray-200 hover:bg-[#F4F7FB] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-[#1B1F3B]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
