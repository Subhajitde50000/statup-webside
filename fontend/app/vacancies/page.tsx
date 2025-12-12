'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Briefcase, MapPin, Clock, DollarSign, Search, Filter, 
  Calendar, Users, Building2, TrendingUp, ChevronRight,
  Star, Award, Target
} from 'lucide-react';

export default function VacanciesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedExperience, setSelectedExperience] = useState('all');

  // Mock data - Replace with API call
  const vacancies = [
    {
      id: 'VAC001',
      title: 'Senior Full Stack Developer',
      department: 'Engineering',
      location: 'Bangalore, India',
      type: 'Full-time',
      experience: '5-8 years',
      salary: '₹18-25 LPA',
      postedDate: '2 days ago',
      applicants: 156,
      description: 'Looking for an experienced Full Stack Developer to join our engineering team.',
      skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
      featured: true,
      urgent: false
    },
    {
      id: 'VAC002',
      title: 'Product Manager',
      department: 'Product',
      location: 'Mumbai, India',
      type: 'Full-time',
      experience: '3-5 years',
      salary: '₹20-30 LPA',
      postedDate: '1 week ago',
      applicants: 234,
      description: 'Seeking a Product Manager to lead product development initiatives.',
      skills: ['Product Strategy', 'Agile', 'Data Analysis'],
      featured: true,
      urgent: true
    },
    {
      id: 'VAC003',
      title: 'UI/UX Designer',
      department: 'Design',
      location: 'Remote',
      type: 'Full-time',
      experience: '2-4 years',
      salary: '₹12-18 LPA',
      postedDate: '3 days ago',
      applicants: 89,
      description: 'Creative UI/UX Designer needed to craft beautiful user experiences.',
      skills: ['Figma', 'Adobe XD', 'User Research'],
      featured: false,
      urgent: false
    },
    {
      id: 'VAC004',
      title: 'DevOps Engineer',
      department: 'Engineering',
      location: 'Hyderabad, India',
      type: 'Full-time',
      experience: '4-6 years',
      salary: '₹15-22 LPA',
      postedDate: '5 days ago',
      applicants: 67,
      description: 'DevOps Engineer to manage and optimize our cloud infrastructure.',
      skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
      featured: false,
      urgent: true
    },
    {
      id: 'VAC005',
      title: 'Marketing Manager',
      department: 'Marketing',
      location: 'Delhi NCR, India',
      type: 'Full-time',
      experience: '5-7 years',
      salary: '₹18-28 LPA',
      postedDate: '1 day ago',
      applicants: 123,
      description: 'Experienced Marketing Manager to drive our marketing strategies.',
      skills: ['Digital Marketing', 'SEO', 'Content Strategy'],
      featured: true,
      urgent: false
    },
    {
      id: 'VAC006',
      title: 'Data Scientist',
      department: 'Data',
      location: 'Pune, India',
      type: 'Full-time',
      experience: '3-5 years',
      salary: '₹16-24 LPA',
      postedDate: '4 days ago',
      applicants: 98,
      description: 'Data Scientist to build ML models and drive data-driven decisions.',
      skills: ['Python', 'Machine Learning', 'SQL', 'Statistics'],
      featured: false,
      urgent: false
    }
  ];

  const stats = [
    { label: 'Active Openings', value: '47', icon: Briefcase, color: 'bg-blue-500' },
    { label: 'Companies Hiring', value: '12', icon: Building2, color: 'bg-emerald-500' },
    { label: 'Applications Today', value: '234', icon: Users, color: 'bg-amber-500' },
    { label: 'Placement Rate', value: '94%', icon: TrendingUp, color: 'bg-purple-500' }
  ];

  const departments = ['All Departments', 'Engineering', 'Product', 'Design', 'Marketing', 'Data', 'HR', 'Sales'];
  const jobTypes = ['All Types', 'Full-time', 'Part-time', 'Contract', 'Internship'];
  const experienceLevels = ['All Levels', '0-2 years', '2-4 years', '4-6 years', '6+ years'];

  const filteredVacancies = vacancies.filter(vacancy => {
    const matchesSearch = vacancy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vacancy.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || vacancy.department === selectedDepartment;
    const matchesType = selectedType === 'all' || vacancy.type === selectedType;
    const matchesExperience = selectedExperience === 'all' || vacancy.experience === selectedExperience;
    
    return matchesSearch && matchesDepartment && matchesType && matchesExperience;
  });

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
        <div className="space-y-4">
          {filteredVacancies.map((vacancy) => (
            <div
              key={vacancy.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#0057D9] group"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-[#0057D9] transition-colors">
                        {vacancy.title}
                      </h3>
                      {vacancy.featured && (
                        <span className="bg-gradient-to-r from-[#FFB020] to-amber-500 text-white text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          Featured
                        </span>
                      )}
                      {vacancy.urgent && (
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
                        <span>{vacancy.type}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <DollarSign className="w-4 h-4 text-[#E53935]" />
                        <span className="font-semibold">{vacancy.salary}</span>
                      </div>
                    </div>

                    {/* Skills Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {vacancy.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-blue-50 text-[#0057D9] px-3 py-1 rounded-full text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{vacancy.postedDate}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{vacancy.applicants} applicants</span>
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
          ))}
        </div>

        {/* No Results */}
        {filteredVacancies.length === 0 && (
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
