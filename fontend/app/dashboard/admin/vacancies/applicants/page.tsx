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
  Loader2,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { getAllApplications, Application, APIError } from '@/utils/applications';

export default function ApplicantListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [applicants, setApplicants] = useState<Application[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState('');
  const itemsPerPage = 10;

  // Fetch applications from API
  useEffect(() => {
    fetchApplications();
  }, [stageFilter, currentPage]);

  const fetchApplications = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const params: any = {
        skip: (currentPage - 1) * itemsPerPage,
        limit: itemsPerPage,
      };
      
      if (stageFilter !== 'all') {
        params.stage = stageFilter;
      }
      
      const response = await getAllApplications(params);
      setApplicants(response.applications);
      setTotalCount(response.total);
    } catch (err) {
      if (err instanceof APIError) {
        setError(err.message);
      } else {
        setError('Failed to load applications. Please try again.');
      }
      setApplicants([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Local filtering for search only (other filters handled by API)
  const filteredApplicants = applicants.filter((applicant) => {
    const matchesSearch =
      applicant.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.id.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const getStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      'Under Review': '#0057D9',
      'Shortlisted': '#3CB878',
      'Interview Scheduled': '#FFB020',
      'Background Check': '#00A8E8',
      'Offer Released': '#3CB878',
      'Rejected': '#E53935',
    };
    return colors[stage] || '#6B7280';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F7FB]">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-[#0057D9] animate-spin mx-auto mb-4" />
          <p className="text-[#1B1F3B] font-medium">Loading applicants...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F7FB]">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-[#1B1F3B] font-medium mb-4">{error}</p>
          <button
            onClick={() => fetchApplications()}
            className="px-6 py-3 bg-[#0057D9] text-white rounded-lg hover:bg-[#0044AA]"
          >
            Try Again
          </button>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              {filteredApplicants.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No applicants found</p>
                  </td>
                </tr>
              ) : (
                filteredApplicants.map((applicant) => (
                  <tr key={applicant.id} className="border-t border-gray-100 hover:bg-[#F4F7FB] transition-colors">
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-semibold text-[#1B1F3B]">{applicant.full_name}</p>
                        <p className="text-xs text-[#6B7280]">{applicant.id.slice(0, 8)}</p>
                        <div className="flex items-center gap-1 mt-1 text-xs text-[#6B7280]">
                          <MapPin className="w-3 h-3" />
                          {applicant.current_location}
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
                        <span className="text-sm font-semibold text-[#1B1F3B]">{applicant.total_experience}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-start gap-2">
                        <Briefcase className="w-4 h-4 text-[#0057D9] mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-[#1B1F3B]">{applicant.vacancy_title}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                        style={{ backgroundColor: getStageColor(applicant.stage) }}
                      >
                        {applicant.stage}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-4 h-4 text-[#FFB020] fill-[#FFB020]" />
                        <span className="font-bold text-[#1B1F3B]">{applicant.score.toFixed(1)}</span>
                        <span className="text-xs text-[#6B7280]">/10</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <Link
                        href={`/dashboard/admin/vacancies/applicants/${applicant.id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#0057D9] text-white rounded-lg font-semibold hover:bg-[#0044AA] transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        View Deteils
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          <p className="text-sm text-[#6B7280]">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount}{' '}
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
