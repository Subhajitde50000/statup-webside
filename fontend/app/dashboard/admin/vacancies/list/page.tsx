'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  XCircle,
  Copy,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Users,
  Briefcase,
} from 'lucide-react';
import Link from 'next/link';

export default function VacancyListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [hiringTypeFilter, setHiringTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 10;

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600);
  }, []);

  const vacancies = [
    {
      id: 'VAC001',
      title: 'Service Professional - Plumber',
      department: 'Operations',
      hiringFor: 'Service Professional',
      positions: 5,
      applicants: 42,
      status: 'Open',
      createdOn: '2025-01-05',
      statusColor: '#0057D9',
    },
    {
      id: 'VAC002',
      title: 'Shop Manager - Electronics',
      department: 'Sales & Marketing',
      hiringFor: 'Shop Staff',
      positions: 2,
      applicants: 28,
      status: 'In Progress',
      createdOn: '2025-01-03',
      statusColor: '#FFB020',
    },
    {
      id: 'VAC003',
      title: 'Customer Support Executive',
      department: 'Customer Support',
      hiringFor: 'Customer Support',
      positions: 10,
      applicants: 86,
      status: 'Open',
      createdOn: '2025-01-02',
      statusColor: '#0057D9',
    },
    {
      id: 'VAC004',
      title: 'Delivery Partner',
      department: 'Operations',
      hiringFor: 'Delivery Partner',
      positions: 15,
      applicants: 124,
      status: 'In Progress',
      createdOn: '2024-12-28',
      statusColor: '#FFB020',
    },
    {
      id: 'VAC005',
      title: 'Service Professional - Electrician',
      department: 'Operations',
      hiringFor: 'Service Professional',
      positions: 8,
      applicants: 64,
      status: 'Closed',
      createdOn: '2024-12-25',
      statusColor: '#3CB878',
    },
    {
      id: 'VAC006',
      title: 'KYC Verification Officer',
      department: 'HR & Recruitment',
      hiringFor: 'KYC Verifier',
      positions: 3,
      applicants: 18,
      status: 'On Hold',
      createdOn: '2024-12-20',
      statusColor: '#E53935',
    },
    {
      id: 'VAC007',
      title: 'Quality Analyst - Service',
      department: 'Technology',
      hiringFor: 'Quality Analyst',
      positions: 4,
      applicants: 32,
      status: 'Open',
      createdOn: '2024-12-18',
      statusColor: '#0057D9',
    },
    {
      id: 'VAC008',
      title: 'Admin Staff - Operations',
      department: 'Operations',
      hiringFor: 'Admin Staff',
      positions: 2,
      applicants: 15,
      status: 'Closed',
      createdOn: '2024-12-15',
      statusColor: '#3CB878',
    },
  ];

  const filteredVacancies = vacancies.filter((vacancy) => {
    const matchesSearch =
      vacancy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vacancy.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || vacancy.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || vacancy.department === departmentFilter;
    const matchesHiringType = hiringTypeFilter === 'all' || vacancy.hiringFor === hiringTypeFilter;

    return matchesSearch && matchesStatus && matchesDepartment && matchesHiringType;
  });

  const totalPages = Math.ceil(filteredVacancies.length / itemsPerPage);
  const paginatedVacancies = filteredVacancies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F7FB]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#0057D9] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#1B1F3B] font-medium">Loading vacancies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7FB] p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#1B1F3B] mb-2">All Vacancies</h1>
            <p className="text-[#6B7280]">Manage all job openings and hiring requirements</p>
          </div>
          <Link
            href="/dashboard/admin/vacancies/create"
            className="px-6 py-3 bg-gradient-to-r from-[#0057D9] to-[#0044AA] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#0057D9]/30 transition-all duration-200 flex items-center gap-2"
          >
            <Briefcase className="w-5 h-5" />
            Create New Vacancy
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6B7280] w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by title or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#0057D9] transition-colors"
                />
              </div>
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#0057D9] transition-colors"
              >
                <option value="all">All Status</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Closed">Closed</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>
            <div>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#0057D9] transition-colors"
              >
                <option value="all">All Departments</option>
                <option value="Operations">Operations</option>
                <option value="Customer Support">Customer Support</option>
                <option value="Sales & Marketing">Sales & Marketing</option>
                <option value="Technology">Technology</option>
                <option value="HR & Recruitment">HR & Recruitment</option>
              </select>
            </div>
            <div>
              <select
                value={hiringTypeFilter}
                onChange={(e) => setHiringTypeFilter(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#0057D9] transition-colors"
              >
                <option value="all">All Types</option>
                <option value="Service Professional">Service Professional</option>
                <option value="Shop Staff">Shop Staff</option>
                <option value="Customer Support">Customer Support</option>
                <option value="Delivery Partner">Delivery Partner</option>
                <option value="Admin Staff">Admin Staff</option>
                <option value="KYC Verifier">KYC Verifier</option>
                <option value="Quality Analyst">Quality Analyst</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F4F7FB]">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-[#1B1F3B]">Vacancy ID</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-[#1B1F3B]">Job Title</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-[#1B1F3B]">Department</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-[#1B1F3B]">Hiring For</th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-[#1B1F3B]">Positions</th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-[#1B1F3B]">Applicants</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-[#1B1F3B]">Status</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-[#1B1F3B]">Created On</th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-[#1B1F3B]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedVacancies.map((vacancy) => (
                <tr key={vacancy.id} className="border-t border-gray-100 hover:bg-[#F4F7FB] transition-colors">
                  <td className="py-4 px-6">
                    <span className="font-semibold text-[#0057D9]">{vacancy.id}</span>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-semibold text-[#1B1F3B]">{vacancy.title}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-[#6B7280]">{vacancy.department}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 bg-[#E3F2FD] text-[#0057D9] rounded-lg text-xs font-semibold">
                      {vacancy.hiringFor}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="font-semibold text-[#1B1F3B]">{vacancy.positions}</span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Users className="w-4 h-4 text-[#6B7280]" />
                      <span className="font-semibold text-[#1B1F3B]">{vacancy.applicants}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                      style={{ backgroundColor: vacancy.statusColor }}
                    >
                      {vacancy.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-[#6B7280]">{vacancy.createdOn}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href={`/dashboard/admin/vacancies/${vacancy.id}`}
                        className="p-2 hover:bg-[#E3F2FD] rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4 text-[#0057D9]" />
                      </Link>
                      <Link
                        href={`/dashboard/admin/vacancies/edit/${vacancy.id}`}
                        className="p-2 hover:bg-[#FFF8E1] rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4 text-[#FFB020]" />
                      </Link>
                      <button className="p-2 hover:bg-[#FFEBEE] rounded-lg transition-colors" title="Close">
                        <XCircle className="w-4 h-4 text-[#E53935]" />
                      </button>
                      <button className="p-2 hover:bg-[#E8F5E9] rounded-lg transition-colors" title="Duplicate">
                        <Copy className="w-4 h-4 text-[#3CB878]" />
                      </button>
                    </div>
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
            {Math.min(currentPage * itemsPerPage, filteredVacancies.length)} of {filteredVacancies.length}{' '}
            vacancies
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border-2 border-gray-200 hover:bg-[#F4F7FB] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-[#1B1F3B]" />
            </button>
            {[...Array(totalPages)].map((_, index) => (
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
