'use client';

import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  Shield,
  TrendingUp,
  TrendingDown,
  Search,
  Download,
  Filter,
  Eye,
  ArrowRight,
  BarChart3,
} from 'lucide-react';
import Link from 'next/link';

export default function VacancyDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial data load
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  // Mock data
  const metrics = [
    {
      title: 'Total Vacancies Open',
      value: '47',
      trend: '+12%',
      isPositive: true,
      icon: <Briefcase className="w-6 h-6" />,
      color: '#0057D9',
      bgColor: '#E3F2FD',
    },
    {
      title: 'Active Hiring Roles',
      value: '28',
      trend: '+8%',
      isPositive: true,
      icon: <Users className="w-6 h-6" />,
      color: '#3CB878',
      bgColor: '#E8F5E9',
    },
    {
      title: 'Positions Filled This Month',
      value: '34',
      trend: '+24%',
      isPositive: true,
      icon: <CheckCircle2 className="w-6 h-6" />,
      color: '#3CB878',
      bgColor: '#E8F5E9',
    },
    {
      title: 'Interviews Pending',
      value: '62',
      trend: '-5%',
      isPositive: false,
      icon: <Clock className="w-6 h-6" />,
      color: '#FFB020',
      bgColor: '#FFF8E1',
    },
    {
      title: 'Rejected Applicants',
      value: '128',
      trend: '+18%',
      isPositive: false,
      icon: <XCircle className="w-6 h-6" />,
      color: '#E53935',
      bgColor: '#FFEBEE',
    },
    {
      title: 'Background Checks Pending',
      value: '19',
      trend: '-12%',
      isPositive: true,
      icon: <Shield className="w-6 h-6" />,
      color: '#00A8E8',
      bgColor: '#E1F5FE',
    },
  ];

  const vacancyStatusData = [
    { status: 'Open', count: 47, color: '#0057D9', percentage: 41 },
    { status: 'In Progress', count: 28, color: '#FFB020', percentage: 24 },
    { status: 'Closed', count: 34, color: '#3CB878', percentage: 30 },
    { status: 'On Hold', count: 6, color: '#E53935', percentage: 5 },
  ];

  const applicantFunnel = [
    { stage: 'Applied', count: 486, percentage: 100, color: '#0057D9' },
    { stage: 'Screened', count: 324, percentage: 67, color: '#00A8E8' },
    { stage: 'Shortlisted', count: 186, percentage: 38, color: '#3CB878' },
    { stage: 'Interviewed', count: 94, percentage: 19, color: '#FFB020' },
    { stage: 'Hired', count: 34, percentage: 7, color: '#3CB878' },
    { stage: 'Rejected', count: 128, percentage: 26, color: '#E53935' },
  ];

  const recentApplicants = [
    {
      id: 'APP001',
      name: 'Rajesh Kumar',
      appliedFor: 'Service Professional - Plumber',
      phone: '+91 98765 43210',
      experience: '5 years',
      status: 'Shortlisted',
      statusColor: '#3CB878',
    },
    {
      id: 'APP002',
      name: 'Priya Sharma',
      appliedFor: 'Shop Manager - Electronics',
      phone: '+91 98765 43211',
      experience: '3 years',
      status: 'Interview Scheduled',
      statusColor: '#FFB020',
    },
    {
      id: 'APP003',
      name: 'Amit Patel',
      appliedFor: 'Delivery Partner',
      phone: '+91 98765 43212',
      experience: '2 years',
      status: 'Background Check',
      statusColor: '#00A8E8',
    },
    {
      id: 'APP004',
      name: 'Sneha Reddy',
      appliedFor: 'Customer Support Executive',
      phone: '+91 98765 43213',
      experience: '1 year',
      status: 'Under Review',
      statusColor: '#0057D9',
    },
    {
      id: 'APP005',
      name: 'Vikram Singh',
      appliedFor: 'Service Professional - Electrician',
      phone: '+91 98765 43214',
      experience: '7 years',
      status: 'Offer Released',
      statusColor: '#3CB878',
    },
  ];

  const recruiterActivity = [
    {
      action: 'Vacancy Created',
      details: 'Service Professional - AC Repair',
      user: 'Admin Rakesh',
      time: '2 hours ago',
      icon: <Briefcase className="w-4 h-4" />,
      color: '#0057D9',
    },
    {
      action: 'Applicant Moved to Next Stage',
      details: 'Priya Sharma → Interview Scheduled',
      user: 'HR Manager Sunita',
      time: '3 hours ago',
      icon: <ArrowRight className="w-4 h-4" />,
      color: '#3CB878',
    },
    {
      action: 'Offer Letter Sent',
      details: 'Vikram Singh - Electrician Role',
      user: 'Admin Rakesh',
      time: '5 hours ago',
      icon: <CheckCircle2 className="w-4 h-4" />,
      color: '#3CB878',
    },
    {
      action: 'Interview Completed',
      details: 'Amit Patel - Delivery Partner',
      user: 'Interviewer Rahul',
      time: '1 day ago',
      icon: <Users className="w-4 h-4" />,
      color: '#FFB020',
    },
    {
      action: 'Vacancy Closed',
      details: 'Shop Manager Position - Target Achieved',
      user: 'Admin Rakesh',
      time: '1 day ago',
      icon: <XCircle className="w-4 h-4" />,
      color: '#E53935',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F7FB]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#0057D9] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#1B1F3B] font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7FB] p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold text-[#1B1F3B] mb-2">Vacancy & Job Management</h1>
            <p className="text-[#6B7280]">Internal hiring, onboarding & role management system</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/dashboard/admin/vacancies/create"
              className="px-6 py-3 bg-gradient-to-r from-[#0057D9] to-[#0044AA] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#0057D9]/30 transition-all duration-200 flex items-center gap-2"
            >
              <Briefcase className="w-5 h-5" />
              Create New Vacancy
            </Link>
            <Link
              href="/dashboard/admin/vacancies/list"
              className="px-6 py-3 bg-white text-[#1B1F3B] rounded-xl font-semibold hover:shadow-lg transition-all duration-200 border-2 border-[#E5E7EB] flex items-center gap-2"
            >
              View All Vacancies
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: metric.bgColor, color: metric.color }}
              >
                {metric.icon}
              </div>
              <div className="flex items-center gap-1">
                {metric.isPositive ? (
                  <TrendingUp className="w-4 h-4 text-[#3CB878]" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-[#E53935]" />
                )}
                <span
                  className={`text-sm font-semibold ${
                    metric.isPositive ? 'text-[#3CB878]' : 'text-[#E53935]'
                  }`}
                >
                  {metric.trend}
                </span>
              </div>
            </div>
            <h3 className="text-3xl font-bold text-[#1B1F3B] mb-1">{metric.value}</h3>
            <p className="text-sm text-[#6B7280]">{metric.title}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Vacancy Status Overview */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-[#1B1F3B] mb-6 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#0057D9]" />
            Vacancy Status Overview
          </h2>
          <div className="flex items-center justify-center mb-6">
            {/* Donut Chart */}
            <div className="relative w-48 h-48">
              <svg viewBox="0 0 100 100" className="transform -rotate-90">
                {vacancyStatusData.map((item, index) => {
                  const prevPercentage = vacancyStatusData
                    .slice(0, index)
                    .reduce((sum, i) => sum + i.percentage, 0);
                  const circumference = 2 * Math.PI * 35;
                  const offset = circumference - (item.percentage / 100) * circumference;
                  const rotation = (prevPercentage / 100) * 360;

                  return (
                    <circle
                      key={index}
                      cx="50"
                      cy="50"
                      r="35"
                      fill="none"
                      stroke={item.color}
                      strokeWidth="12"
                      strokeDasharray={circumference}
                      strokeDashoffset={offset}
                      style={{
                        transformOrigin: '50% 50%',
                        transform: `rotate(${rotation}deg)`,
                      }}
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-3xl font-bold text-[#1B1F3B]">115</span>
                <span className="text-sm text-[#6B7280]">Total</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {vacancyStatusData.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <div>
                  <p className="text-sm font-semibold text-[#1B1F3B]">{item.status}</p>
                  <p className="text-xs text-[#6B7280]">
                    {item.count} ({item.percentage}%)
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Applicant Funnel */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-[#1B1F3B] mb-6 flex items-center gap-2">
            <Users className="w-6 h-6 text-[#0057D9]" />
            Applicants Funnel
          </h2>
          <div className="space-y-4">
            {applicantFunnel.map((stage, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-[#1B1F3B]">{stage.stage}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#1B1F3B]">{stage.count}</span>
                    <span className="text-xs text-[#6B7280]">({stage.percentage}%)</span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${stage.percentage}%`,
                      backgroundColor: stage.color,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Applicants & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Applicants */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#1B1F3B] flex items-center gap-2">
              <Users className="w-6 h-6 text-[#0057D9]" />
              Recent Applicants
            </h2>
            <Link
              href="/dashboard/admin/vacancies/applicants"
              className="text-sm text-[#0057D9] font-semibold hover:underline flex items-center gap-1"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#6B7280]">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#6B7280]">Applied For</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#6B7280]">Phone</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#6B7280]">Experience</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#6B7280]">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#6B7280]">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentApplicants.map((applicant) => (
                  <tr key={applicant.id} className="border-b border-gray-50 hover:bg-[#F4F7FB] transition-colors">
                    <td className="py-4 px-4">
                      <p className="font-semibold text-[#1B1F3B]">{applicant.name}</p>
                      <p className="text-xs text-[#6B7280]">{applicant.id}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-[#1B1F3B]">{applicant.appliedFor}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-[#1B1F3B]">{applicant.phone}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-[#1B1F3B]">{applicant.experience}</p>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                        style={{ backgroundColor: applicant.statusColor }}
                      >
                        {applicant.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <Link
                        href={`/dashboard/admin/vacancies/applicants/${applicant.id}`}
                        className="text-[#0057D9] hover:text-[#0044AA] font-semibold text-sm flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recruiter Activity Log */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-[#1B1F3B] mb-6 flex items-center gap-2">
            <Clock className="w-6 h-6 text-[#0057D9]" />
            Activity Log
          </h2>
          <div className="space-y-4">
            {recruiterActivity.map((activity, index) => (
              <div key={index} className="flex gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${activity.color}20`, color: activity.color }}
                >
                  {activity.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#1B1F3B] mb-1">{activity.action}</p>
                  <p className="text-xs text-[#6B7280] mb-1 truncate">{activity.details}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-[#6B7280]">{activity.user}</p>
                    <p className="text-xs text-[#6B7280]">{activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
