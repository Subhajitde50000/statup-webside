'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getVacancyById, Vacancy } from '@/utils/vacancies';
import { 
  ArrowLeft, Briefcase, MapPin, Clock, DollarSign, Calendar, Users, 
  Building2, CheckCircle, Award, Target, Globe, Share2, Bookmark,
  TrendingUp, Heart, ChevronRight, Shield, Zap, Star, Loader2, AlertCircle
} from 'lucide-react';

export default function VacancyDetailPage() {
  const params = useParams();
  const [isSaved, setIsSaved] = useState(false);
  const [vacancy, setVacancy] = useState<Vacancy | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch vacancy details from API
  useEffect(() => {
    const fetchVacancy = async () => {
      try {
        const response = await getVacancyById(params.id as string);
        setVacancy(response.vacancy);
      } catch (err) {
        setError('Failed to load vacancy details');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVacancy();
  }, [params.id]);

  const similarJobs = [
    { id: 'VAC002', title: 'Full Stack Developer', department: 'Engineering', salary: '₹12-18 LPA' },
    { id: 'VAC003', title: 'Backend Developer', department: 'Engineering', salary: '₹15-20 LPA' },
    { id: 'VAC004', title: 'Frontend Developer', department: 'Engineering', salary: '₹10-15 LPA' }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#F4F7FB] via-white to-[#E8F4F8]">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-[#0057D9] animate-spin mx-auto mb-4" />
          <p className="text-[#1B1F3B] font-medium">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error || !vacancy) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#F4F7FB] via-white to-[#E8F4F8]">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-[#1B1F3B] font-medium mb-4">{error || 'Job not found'}</p>
          <Link href="/vacancies">
            <button className="px-6 py-3 bg-[#0057D9] text-white rounded-lg">
              Browse Jobs
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4F7FB] via-white to-[#E8F4F8]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0057D9] to-[#1B1F3B] text-white py-6">
        <div className="max-w-7xl mx-auto px-6">
          <Link href="/vacancies">
            <button className="flex items-center gap-2 text-white hover:text-blue-200 transition-colors mb-4">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to All Jobs</span>
            </button>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    {vacancy.priority === 'high' && (
                      <span className="bg-gradient-to-r from-[#FFB020] to-amber-500 text-white text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        Featured
                      </span>
                    )}
                    {vacancy.priority === 'urgent' && (
                      <span className="bg-gradient-to-r from-[#E53935] to-red-600 text-white text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1 animate-pulse">
                        <Target className="w-3 h-3" />
                        Urgent Hiring
                      </span>
                    )}
                  </div>
                  <h1 className="text-4xl font-bold text-gray-800 mb-2">{vacancy.job_title}</h1>
                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <Building2 className="w-5 h-5 text-[#0057D9]" />
                    <span className="text-lg font-semibold">{vacancy.hiring_for}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setIsSaved(!isSaved)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      isSaved 
                        ? 'bg-[#0057D9] border-[#0057D9] text-white' 
                        : 'border-gray-200 text-gray-600 hover:border-[#0057D9]'
                    }`}
                  >
                    {isSaved ? <Heart className="w-5 h-5 fill-current" /> : <Heart className="w-5 h-5" />}
                  </button>
                  <button className="p-3 rounded-lg border-2 border-gray-200 text-gray-600 hover:border-[#0057D9] transition-all">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Key Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <MapPin className="w-5 h-5 text-[#0057D9]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="font-semibold text-gray-800">{vacancy.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <DollarSign className="w-5 h-5 text-[#3CB878]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Salary</p>
                    <p className="font-semibold text-gray-800">₹{vacancy.salary_min}-{vacancy.salary_max} LPA</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-amber-50 p-3 rounded-lg">
                    <Clock className="w-5 h-5 text-[#FFB020]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Job Type</p>
                    <p className="font-semibold text-gray-800">{vacancy.employment_type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <Briefcase className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Experience</p>
                    <p className="font-semibold text-gray-800">{vacancy.experience}</p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Users className="w-6 h-6 text-[#0057D9] mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-800">{vacancy.applicant_count || 0}</p>
                  <p className="text-xs text-gray-500">Applicants</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-[#3CB878] mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-800">{vacancy.positions}</p>
                  <p className="text-xs text-gray-500">Positions</p>
                </div>
                <div className="text-center p-4 bg-amber-50 rounded-lg">
                  <Calendar className="w-6 h-6 text-[#FFB020] mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-800">{new Date(vacancy.created_at).toLocaleDateString()}</p>
                  <p className="text-xs text-gray-500">Posted</p>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Zap className="w-6 h-6 text-[#FFB020]" />
                Job Description
              </h2>
              <p className="text-gray-600 leading-relaxed">{vacancy.description}</p>
            </div>

            {/* Responsibilities */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-[#3CB878]" />
                Key Responsibilities
              </h2>
              <ul className="space-y-3">
                {vacancy.responsibilities.map((resp, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="bg-green-50 p-1 rounded-full mt-1">
                      <CheckCircle className="w-4 h-4 text-[#3CB878]" />
                    </div>
                    <span className="text-gray-600 flex-1">{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6 text-[#0057D9]" />
                Requirements
              </h2>
              <div className="text-gray-600 leading-relaxed">
                <p><strong>Experience:</strong> {vacancy.experience}</p>
                <p className="mt-2"><strong>Role Level:</strong> {vacancy.role_level}</p>
                <p className="mt-2"><strong>Department:</strong> {vacancy.department}</p>
                <p className="mt-2"><strong>Employment Type:</strong> {vacancy.employment_type}</p>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Required Skills</h2>
              <div className="flex flex-wrap gap-3">
                {vacancy.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-gradient-to-r from-blue-50 to-blue-100 text-[#0057D9] px-5 py-2 rounded-full text-sm font-semibold border border-blue-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Card */}
            <div className="bg-gradient-to-br from-[#0057D9] to-[#1B1F3B] rounded-2xl shadow-xl p-8 text-white sticky top-6">
              <h3 className="text-2xl font-bold mb-4">Ready to Apply?</h3>
              <p className="text-blue-100 mb-6">
                Take the next step in your career journey
              </p>
              <Link href={`/vacancies/${vacancy.id}/apply`}>
                <button className="w-full bg-white text-[#0057D9] py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all hover:scale-105 flex items-center justify-center gap-2">
                  Apply Now
                  <ChevronRight className="w-5 h-5" />
                </button>
              </Link>
              <div className="mt-6 pt-6 border-t border-white/20">
                <div className="flex items-center justify-between text-sm text-blue-100 mb-2">
                  <span>Positions Available</span>
                  <span className="font-semibold text-white">{vacancy.positions}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-blue-100">
                  <span>Posted</span>
                  <span className="font-semibold text-white">{new Date(vacancy.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Company Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#0057D9]" />
                Company Info
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500">Hiring For</p>
                  <p className="font-semibold text-gray-800">{vacancy.hiring_for}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Department</p>
                  <p className="font-semibold text-gray-800">{vacancy.department}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Posting Type</p>
                  <p className="font-semibold text-gray-800">{vacancy.posting_type}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <p className="font-semibold text-gray-800 capitalize">{vacancy.status}</p>
                </div>
              </div>
            </div>

            {/* Similar Jobs */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Similar Jobs</h3>
              <div className="space-y-3">
                {similarJobs.map((job) => (
                  <Link key={job.id} href={`/vacancies/${job.id}`}>
                    <div className="p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-all cursor-pointer border border-transparent hover:border-[#0057D9]">
                      <h4 className="font-semibold text-gray-800 mb-1">{job.title}</h4>
                      <p className="text-xs text-gray-500 mb-2">{job.department}</p>
                      <p className="text-sm font-semibold text-[#0057D9]">{job.salary}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
