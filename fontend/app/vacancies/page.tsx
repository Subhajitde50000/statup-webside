'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Briefcase, MapPin, Clock, DollarSign, Search, Filter, 
  Calendar, Users, Building2, TrendingUp, ChevronRight,
  Star, Award, Target, Loader2, AlertCircle
} from 'lucide-react';
import { getVacancies, Vacancy, APIError } from '@/utils/vacancies';

export default function VacanciesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedExperience, setSelectedExperience] = useState('all');
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalCount, setTotalCount] = useState(0);

  // Fetch vacancies from API
  useEffect(() => {
    fetchVacancies();
  }, [selectedDepartment, selectedType, searchQuery]);

  const fetchVacancies = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const params: any = {
        status: 'open',
        limit: 100
      };
      
      if (selectedDepartment !== 'all') {
        params.department = selectedDepartment;
      }
      if (selectedType !== 'all') {
        params.employment_type = selectedType;
      }
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }
      
      const response = await getVacancies(params);
      setVacancies(response.vacancies);
      setTotalCount(response.total);
    } catch (err) {
      if (err instanceof APIError) {
        setError(err.message);
      } else {
        setError('Failed to load vacancies. Please try again.');
      }
      setVacancies([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock data removed - now using API data
  const stats = [
    { label: 'Active Openings', value: totalCount.toString(), icon: Briefcase, color: 'bg-blue-500' },
    { label: 'Companies Hiring', value: '1', icon: Building2, color: 'bg-emerald-500' },
    { label: 'Applications Today', value: '-', icon: Users, color: 'bg-amber-500' },
    { label: 'Placement Rate', value: '-', icon: TrendingUp, color: 'bg-purple-500' }
  ];

  const departments = ['All Departments', 'Operations', 'Customer Support', 'Sales & Marketing', 'Technology', 'HR & Recruitment', 'Finance'];
  const jobTypes = ['All Types', 'Full-time', 'Part-time', 'Contract', 'Temporary'];
  const experienceLevels = ['All Levels', 'Fresher (0-1 years)', '1-3 years', '3-5 years', '5-10 years', '10+ years'];

  const filteredVacancies = vacancies;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4F7FB] via-white to-[#E8F4F8]">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#0057D9] to-[#1B1F3B] text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
              <Star className="w-4 h-4 text-[#FFB020]" />
              <span className="text-sm font-medium">Join Our Growing Team</span>
            </div>
            <h1 className="text-5xl font-bold mb-4">Find Your Dream Job</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Explore exciting career opportunities and take the next step in your professional journey
            </p>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-2xl shadow-2xl p-2 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search job title, skills, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder-gray-400"
                />
              </div>
              <button className="bg-[#0057D9] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#0048B8] transition-all hover:scale-105 shadow-lg">
                Search Jobs
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters & Results */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filter Bar */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-[#0057D9]" />
            <h3 className="font-semibold text-gray-700">Filter Jobs</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0057D9] focus:border-transparent outline-none"
            >
              {departments.map(dept => (
                <option key={dept} value={dept === 'All Departments' ? 'all' : dept}>
                  {dept}
                </option>
              ))}
            </select>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0057D9] focus:border-transparent outline-none"
            >
              {jobTypes.map(type => (
                <option key={type} value={type === 'All Types' ? 'all' : type}>
                  {type}
                </option>
              ))}
            </select>
            <select
              value={selectedExperience}
              onChange={(e) => setSelectedExperience(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0057D9] focus:border-transparent outline-none"
            >
              {experienceLevels.map(level => (
                <option key={level} value={level === 'All Levels' ? 'all' : level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {filteredVacancies.length} {filteredVacancies.length === 1 ? 'Job' : 'Jobs'} Found
          </h2>
          <p className="text-gray-500">Browse through our latest job openings</p>
        </div>

        {/* Job Cards */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-[#0057D9] animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading vacancies...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="bg-red-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-12 h-12 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Error Loading Vacancies</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button 
              onClick={fetchVacancies}
              className="px-6 py-2 bg-[#0057D9] text-white rounded-lg font-semibold hover:bg-[#0044AA] transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredVacancies.map((vacancy) => {
              const salaryRange = `₹${vacancy.salary_min.toLocaleString()} - ₹${vacancy.salary_max.toLocaleString()}/month`;
              const postedDate = new Date(vacancy.created_at).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              });
              
              return (
                <div
                  key={vacancy.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#0057D9] group"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-800 group-hover:text-[#0057D9] transition-colors">
                            {vacancy.job_title}
                          </h3>
                          {vacancy.priority === 'high' && (
                            <span className="bg-gradient-to-r from-[#E53935] to-red-600 text-white text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1 animate-pulse">
                              <Target className="w-3 h-3" />
                              Urgent
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mb-4">{vacancy.description}</p>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Building2 className="w-4 h-4 text-[#0057D9]" />
                            <span>{vacancy.department}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4 text-[#3CB878]" />
                            <span>{vacancy.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4 text-[#FFB020]" />
                            <span>{vacancy.employment_type}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <DollarSign className="w-4 h-4 text-[#E53935]" />
                            <span className="font-semibold">{salaryRange}</span>
                          </div>
                        </div>

                        {/* Skills Tags */}
                        {vacancy.skills && vacancy.skills.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {vacancy.skills.slice(0, 5).map((skill, index) => (
                              <span
                                key={index}
                                className="bg-blue-50 text-[#0057D9] px-3 py-1 rounded-full text-xs font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                            {vacancy.skills.length > 5 && (
                              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                                +{vacancy.skills.length - 5} more
                              </span>
                            )}
                          </div>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{postedDate}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>{vacancy.positions} position{vacancy.positions > 1 ? 's' : ''}</span>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <Link href={`/vacancies/${vacancy.id}`}>
                              <button className="px-4 py-2 border-2 border-[#0057D9] text-[#0057D9] rounded-lg font-semibold hover:bg-blue-50 transition-all">
                                View Details
                              </button>
                            </Link>
                            <Link href={`/vacancies/${vacancy.id}/apply`}>
                              <button className="px-6 py-2 bg-gradient-to-r from-[#0057D9] to-[#0048B8] text-white rounded-lg font-semibold hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2">
                                Apply Now
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* No Results */}
        {!isLoading && !error && filteredVacancies.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Jobs Found</h3>
            <p className="text-gray-500">Try adjusting your filters or search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
