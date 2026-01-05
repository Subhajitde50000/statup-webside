'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TopNavbar from '../../components/TopNavbar';
import LeftSidebar from '../../components/LeftSidebar';
import { 
  ArrowLeft, Users, TrendingUp, TrendingDown, Star, DollarSign, 
  Clock, MapPin, Award, Filter, Download, Activity, Search,
  CheckCircle, XCircle, AlertCircle, Eye, RefreshCw, Settings,
  Phone, Mail, Calendar, Target, ThumbsUp, ThumbsDown, Zap,
  Wrench, Home, ShoppingBag, Car, ChefHat, BarChart3, PieChart,
  TrendingUp as ArrowUp, Package, MessageSquare, Shield, Ban
} from 'lucide-react';

export default function ProfessionalsAnalyticsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');
  const [sortBy, setSortBy] = useState('earnings');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Category Icons
  const categoryIcons: { [key: string]: any } = {
    'Electrician': Zap,
    'Plumber': Wrench,
    'Carpenter': Home,
    'Cleaner': ShoppingBag,
    'Driver': Car,
    'Cook': ChefHat,
  };

  // Comprehensive Professional Data
  const professionals = [
    { 
      id: 'PRO-1001',
      name: 'Rajesh Kumar', 
      category: 'Electrician', 
      rating: 4.8, 
      jobs: 342, 
      earnings: '₹1,23,450',
      earningsNum: 123450,
      cancelRate: '2%',
      cancelNum: 2,
      status: 'Active',
      phone: '+91 9876543210',
      email: 'rajesh.kumar@email.com',
      location: 'Sector 15, Noida',
      experience: '8 years',
      joined: '2020-03-15',
      completionRate: 98,
      responseTime: '15 min',
      repeatCustomers: 67,
      badges: ['Top Rated', 'Fast Response'],
      availability: 'Mon-Sat, 9AM-6PM',
      specializations: ['Wiring', 'Installation', 'Repair'],
      lastActive: '2 hours ago',
      totalReviews: 287,
      positiveReviews: 95,
      avgJobValue: '₹3,610',
      monthlyGrowth: '+12%'
    },
    { 
      id: 'PRO-1002',
      name: 'Amit Sharma', 
      category: 'Plumber', 
      rating: 4.7, 
      jobs: 298, 
      earnings: '₹98,760',
      earningsNum: 98760,
      cancelRate: '3%',
      cancelNum: 3,
      status: 'Active',
      phone: '+91 9876543211',
      email: 'amit.sharma@email.com',
      location: 'Dwarka, Delhi',
      experience: '6 years',
      joined: '2020-07-22',
      completionRate: 97,
      responseTime: '18 min',
      repeatCustomers: 58,
      badges: ['Reliable', 'Expert'],
      availability: 'Mon-Fri, 8AM-5PM',
      specializations: ['Pipe Repair', 'Installation', 'Maintenance'],
      lastActive: '1 hour ago',
      totalReviews: 245,
      positiveReviews: 92,
      avgJobValue: '₹3,314',
      monthlyGrowth: '+8%'
    },
    { 
      id: 'PRO-1003',
      name: 'Priya Patel', 
      category: 'Carpenter', 
      rating: 4.9, 
      jobs: 256, 
      earnings: '₹1,45,230',
      earningsNum: 145230,
      cancelRate: '1%',
      cancelNum: 1,
      status: 'Active',
      phone: '+91 9876543212',
      email: 'priya.patel@email.com',
      location: 'Gurgaon Cyber City',
      experience: '10 years',
      joined: '2019-11-10',
      completionRate: 99,
      responseTime: '12 min',
      repeatCustomers: 78,
      badges: ['Top Rated', 'Expert', 'Best Quality'],
      availability: 'Mon-Sat, 7AM-4PM',
      specializations: ['Furniture', 'Doors', 'Custom Work'],
      lastActive: '30 min ago',
      totalReviews: 312,
      positiveReviews: 98,
      avgJobValue: '₹5,673',
      monthlyGrowth: '+15%'
    },
    { 
      id: 'PRO-1004',
      name: 'Vikram Singh', 
      category: 'Driver', 
      rating: 4.6, 
      jobs: 412, 
      earnings: '₹87,650',
      earningsNum: 87650,
      cancelRate: '4%',
      cancelNum: 4,
      status: 'Active',
      phone: '+91 9876543213',
      email: 'vikram.singh@email.com',
      location: 'Rohini, Delhi',
      experience: '5 years',
      joined: '2021-02-18',
      completionRate: 96,
      responseTime: '10 min',
      repeatCustomers: 52,
      badges: ['Punctual', 'Safe Driver'],
      availability: 'Daily, 6AM-10PM',
      specializations: ['Long Distance', 'Airport', 'Corporate'],
      lastActive: '5 min ago',
      totalReviews: 389,
      positiveReviews: 89,
      avgJobValue: '₹2,128',
      monthlyGrowth: '+5%'
    },
    { 
      id: 'PRO-1005',
      name: 'Neha Gupta', 
      category: 'Cleaner', 
      rating: 4.8, 
      jobs: 378, 
      earnings: '₹76,340',
      earningsNum: 76340,
      cancelRate: '2%',
      cancelNum: 2,
      status: 'Active',
      phone: '+91 9876543214',
      email: 'neha.gupta@email.com',
      location: 'Vasant Kunj, Delhi',
      experience: '4 years',
      joined: '2021-08-05',
      completionRate: 98,
      responseTime: '20 min',
      repeatCustomers: 72,
      badges: ['Thorough', 'Eco-Friendly'],
      availability: 'Daily, 7AM-3PM',
      specializations: ['Deep Clean', 'Sanitization', 'Home Cleaning'],
      lastActive: '1 hour ago',
      totalReviews: 298,
      positiveReviews: 96,
      avgJobValue: '₹2,020',
      monthlyGrowth: '+9%'
    },
    { 
      id: 'PRO-1006',
      name: 'Arjun Malhotra', 
      category: 'Electrician', 
      rating: 4.7, 
      jobs: 289, 
      earnings: '₹1,05,420',
      earningsNum: 105420,
      cancelRate: '2%',
      cancelNum: 2,
      status: 'Active',
      phone: '+91 9876543215',
      email: 'arjun.m@email.com',
      location: 'Sector 18, Noida',
      experience: '7 years',
      joined: '2020-05-20',
      completionRate: 97,
      responseTime: '16 min',
      repeatCustomers: 61,
      badges: ['Certified', 'Fast Response'],
      availability: 'Mon-Sat, 10AM-7PM',
      specializations: ['Circuit Repair', 'Smart Home', 'Solar'],
      lastActive: '3 hours ago',
      totalReviews: 234,
      positiveReviews: 93,
      avgJobValue: '₹3,646',
      monthlyGrowth: '+11%'
    },
    { 
      id: 'PRO-1007',
      name: 'Sunita Verma', 
      category: 'Cook', 
      rating: 4.9, 
      jobs: 198, 
      earnings: '₹89,100',
      earningsNum: 89100,
      cancelRate: '1%',
      cancelNum: 1,
      status: 'Active',
      phone: '+91 9876543216',
      email: 'sunita.v@email.com',
      location: 'South Delhi',
      experience: '12 years',
      joined: '2019-09-12',
      completionRate: 99,
      responseTime: '25 min',
      repeatCustomers: 85,
      badges: ['Master Chef', 'Top Rated', 'Specialist'],
      availability: 'Daily, 6AM-2PM & 5PM-9PM',
      specializations: ['Indian', 'Continental', 'Party Catering'],
      lastActive: '45 min ago',
      totalReviews: 189,
      positiveReviews: 99,
      avgJobValue: '₹4,500',
      monthlyGrowth: '+18%'
    },
    { 
      id: 'PRO-1008',
      name: 'Ramesh Yadav', 
      category: 'Plumber', 
      rating: 4.5, 
      jobs: 267, 
      earnings: '₹82,350',
      earningsNum: 82350,
      cancelRate: '3%',
      cancelNum: 3,
      status: 'Busy',
      phone: '+91 9876543217',
      email: 'ramesh.y@email.com',
      location: 'Lajpat Nagar, Delhi',
      experience: '5 years',
      joined: '2021-01-08',
      completionRate: 96,
      responseTime: '22 min',
      repeatCustomers: 48,
      badges: ['Reliable'],
      availability: 'Mon-Sat, 9AM-6PM',
      specializations: ['Bathroom', 'Kitchen', 'Emergency'],
      lastActive: 'Active now',
      totalReviews: 218,
      positiveReviews: 90,
      avgJobValue: '₹3,084',
      monthlyGrowth: '+6%'
    },
    { 
      id: 'PRO-1009',
      name: 'Kavita Reddy', 
      category: 'Cleaner', 
      rating: 4.8, 
      jobs: 312, 
      earnings: '₹65,520',
      earningsNum: 65520,
      cancelRate: '1%',
      cancelNum: 1,
      status: 'Active',
      phone: '+91 9876543218',
      email: 'kavita.r@email.com',
      location: 'Bangalore',
      experience: '6 years',
      joined: '2020-10-15',
      completionRate: 99,
      responseTime: '18 min',
      repeatCustomers: 80,
      badges: ['Top Rated', 'Eco-Friendly', 'Detail Oriented'],
      availability: 'Daily, 6AM-2PM',
      specializations: ['Office', 'Residential', 'Move-in/out'],
      lastActive: '2 hours ago',
      totalReviews: 276,
      positiveReviews: 97,
      avgJobValue: '₹2,100',
      monthlyGrowth: '+10%'
    },
    { 
      id: 'PRO-1010',
      name: 'Manoj Kumar', 
      category: 'Carpenter', 
      rating: 4.6, 
      jobs: 223, 
      earnings: '₹1,12,300',
      earningsNum: 112300,
      cancelRate: '2%',
      cancelNum: 2,
      status: 'Active',
      phone: '+91 9876543219',
      email: 'manoj.k@email.com',
      location: 'Pune',
      experience: '9 years',
      joined: '2020-04-25',
      completionRate: 98,
      responseTime: '14 min',
      repeatCustomers: 69,
      badges: ['Expert', 'Quality Work'],
      availability: 'Mon-Sat, 8AM-5PM',
      specializations: ['Modular Kitchen', 'Wardrobes', 'Renovation'],
      lastActive: '1 hour ago',
      totalReviews: 198,
      positiveReviews: 94,
      avgJobValue: '₹5,035',
      monthlyGrowth: '+13%'
    },
  ];

  // Performance Statistics
  const performanceStats = {
    totalProfessionals: 213,
    activeProfessionals: 198,
    avgRating: 4.7,
    totalJobs: 2847,
    totalRevenue: '₹10.8L',
    avgResponseTime: '17 min',
    completionRate: 97.5,
    customerSatisfaction: 94.8
  };

  // Category Distribution
  const categoryStats = [
    { category: 'Electrician', count: 45, percentage: 21, color: '#F59E0B' },
    { category: 'Plumber', count: 38, percentage: 18, color: '#3B82F6' },
    { category: 'Carpenter', count: 32, percentage: 15, color: '#10B981' },
    { category: 'Cleaner', count: 52, percentage: 24, color: '#8B5CF6' },
    { category: 'Driver', count: 28, percentage: 13, color: '#EF4444' },
    { category: 'Cook', count: 18, percentage: 9, color: '#06B6D4' },
  ];

  // Monthly Performance Trend
  const monthlyTrend = [
    { month: 'Jan', professionals: 195, jobs: 2450, revenue: 920000 },
    { month: 'Feb', professionals: 201, jobs: 2680, revenue: 985000 },
    { month: 'Mar', professionals: 208, jobs: 2890, revenue: 1045000 },
    { month: 'Apr', professionals: 213, jobs: 2847, revenue: 1080000 },
  ];

  // Filter and Search Logic
  const filteredProfessionals = professionals.filter(pro => {
    const matchesSearch = pro.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pro.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pro.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || pro.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || pro.status === selectedStatus;
    const matchesRating = selectedRating === 'all' || 
                          (selectedRating === '4.5+' && pro.rating >= 4.5) ||
                          (selectedRating === '4.0-4.5' && pro.rating >= 4.0 && pro.rating < 4.5);
    return matchesSearch && matchesCategory && matchesStatus && matchesRating;
  });

  // Sort Logic
  const sortedProfessionals = [...filteredProfessionals].sort((a, b) => {
    switch(sortBy) {
      case 'earnings': return b.earningsNum - a.earningsNum;
      case 'rating': return b.rating - a.rating;
      case 'jobs': return b.jobs - a.jobs;
      case 'name': return a.name.localeCompare(b.name);
      default: return 0;
    }
  });

  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      <TopNavbar />
      <div className="flex">
        <LeftSidebar isOpen={sidebarOpen} />
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
          <div className="p-8">
            <div className="max-w-[1800px] mx-auto">
              {/* Page Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => router.back()}
                    className="w-12 h-12 bg-white border border-[#E2E8F0] rounded-xl hover:bg-[#F8FAFC] transition-all flex items-center justify-center group"
                  >
                    <ArrowLeft className="w-5 h-5 text-[#64748B] group-hover:text-[#1E293B]" />
                  </button>
                  <div className="w-16 h-16 bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] rounded-2xl flex items-center justify-center shadow-lg">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-[#1E293B] mb-1 flex items-center gap-3">
                      Professional Performance Analytics
                      <span className="px-3 py-1 bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white text-xs font-bold rounded-full flex items-center gap-1">
                        <Activity className="w-3 h-3" />
                        {performanceStats.activeProfessionals} ACTIVE
                      </span>
                    </h1>
                    <p className="text-sm text-[#64748B] flex items-center gap-3">
                      Comprehensive insights into professional performance & metrics
                      <span className="text-xs text-[#8B5CF6] font-semibold">
                        Updated: {currentTime.toLocaleTimeString()}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="px-5 py-2.5 bg-white border border-[#E2E8F0] text-[#64748B] rounded-xl hover:border-[#8B5CF6] hover:text-[#8B5CF6] transition-all flex items-center gap-2 text-sm font-bold">
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                  </button>
                  <button className="px-5 py-2.5 bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2 text-sm font-bold">
                    <Download className="w-4 h-4" />
                    Export Data
                  </button>
                </div>
              </div>

              {/* Performance Summary KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <span className="px-3 py-1 bg-[#D1FAE5] text-[#065F46] rounded-full text-xs font-bold">+7.5%</span>
                  </div>
                  <p className="text-sm font-semibold text-[#64748B] mb-1">Total Professionals</p>
                  <p className="text-3xl font-bold text-[#1E293B]">{performanceStats.totalProfessionals}</p>
                  <p className="text-xs text-[#10B981] mt-1">{performanceStats.activeProfessionals} currently active</p>
                </div>

                <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-xl flex items-center justify-center">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <span className="px-3 py-1 bg-[#D1FAE5] text-[#065F46] rounded-full text-xs font-bold">+0.3</span>
                  </div>
                  <p className="text-sm font-semibold text-[#64748B] mb-1">Average Rating</p>
                  <p className="text-3xl font-bold text-[#1E293B]">{performanceStats.avgRating}</p>
                  <p className="text-xs text-[#64748B] mt-1">{performanceStats.customerSatisfaction}% satisfaction</p>
                </div>

                <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl flex items-center justify-center">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <span className="px-3 py-1 bg-[#D1FAE5] text-[#065F46] rounded-full text-xs font-bold">+12%</span>
                  </div>
                  <p className="text-sm font-semibold text-[#64748B] mb-1">Total Jobs</p>
                  <p className="text-3xl font-bold text-[#1E293B]">{performanceStats.totalJobs}</p>
                  <p className="text-xs text-[#64748B] mt-1">{performanceStats.completionRate}% completion</p>
                </div>

                <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-xl flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <span className="px-3 py-1 bg-[#D1FAE5] text-[#065F46] rounded-full text-xs font-bold">+15%</span>
                  </div>
                  <p className="text-sm font-semibold text-[#64748B] mb-1">Total Revenue</p>
                  <p className="text-3xl font-bold text-[#1E293B]">{performanceStats.totalRevenue}</p>
                  <p className="text-xs text-[#64748B] mt-1">This month</p>
                </div>
              </div>

              {/* Search and Filters */}
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 mb-8 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                  <div className="lg:col-span-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#64748B]" />
                      <input
                        type="text"
                        placeholder="Search by name, ID, or location..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 text-gray-700 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent font-medium"
                      />
                    </div>
                  </div>
                  
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-3 text-gray-700 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent font-medium"
                  >
                    <option value="all">All Categories</option>
                    <option value="Electrician">Electrician</option>
                    <option value="Plumber">Plumber</option>
                    <option value="Carpenter">Carpenter</option>
                    <option value="Cleaner">Cleaner</option>
                    <option value="Driver">Driver</option>
                    <option value="Cook">Cook</option>
                  </select>

                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-4 py-3 text-gray-700 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent font-medium"
                  >
                    <option value="all">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Busy">Busy</option>
                    <option value="Offline">Offline</option>
                  </select>

                  <select
                    value={selectedRating}
                    onChange={(e) => setSelectedRating(e.target.value)}
                    className="px-4 py-3 text-gray-700 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent font-medium"
                  >
                    <option value="all">All Ratings</option>
                    <option value="4.5+">4.5+ Stars</option>
                    <option value="4.0-4.5">4.0-4.5 Stars</option>
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-3 text-gray-700 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent font-medium"
                  >
                    <option value="earnings">Sort by Earnings</option>
                    <option value="rating">Sort by Rating</option>
                    <option value="jobs">Sort by Jobs</option>
                    <option value="name">Sort by Name</option>
                  </select>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-[#64748B]">
                    Showing <span className="font-bold text-[#1E293B]">{sortedProfessionals.length}</span> of <span className="font-bold text-[#1E293B]">{professionals.length}</span> professionals
                  </p>
                  <button className="text-sm text-[#8B5CF6] hover:text-[#7C3AED] font-bold flex items-center gap-1">
                    <RefreshCw className="w-4 h-4" />
                    Clear Filters
                  </button>
                </div>
              </div>

              {/* Professional Cards Grid */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-[#1E293B] mb-5 flex items-center gap-2">
                  <Users className="w-6 h-6 text-[#8B5CF6]" />
                  Professional Directory ({sortedProfessionals.length})
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {sortedProfessionals.map((pro) => {
                    const Icon = categoryIcons[pro.category];
                    return (
                      <div 
                        key={pro.id}
                        className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer"
                      >
                        {/* Header Section */}
                        <div className="flex items-start justify-between mb-5">
                          <div className="flex items-start gap-4 flex-1">
                            {/* Avatar */}
                            <div className="relative">
                              <div className="w-16 h-16 bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-md">
                                {pro.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                                pro.status === 'Active' ? 'bg-[#10B981]' : pro.status === 'Busy' ? 'bg-[#F59E0B]' : 'bg-[#64748B]'
                              }`} />
                            </div>
                            
                            {/* Info */}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-lg font-bold text-[#1E293B]">{pro.name}</h3>
                                <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${
                                  pro.status === 'Active' ? 'bg-[#D1FAE5] text-[#065F46]' :
                                  pro.status === 'Busy' ? 'bg-[#FEF3C7] text-[#92400E]' :
                                  'bg-[#F1F5F9] text-[#64748B]'
                                }`}>
                                  {pro.status}
                                </span>
                              </div>
                              <p className="text-sm text-[#64748B] mb-2">{pro.id} • {pro.category}</p>
                              
                              {/* Rating */}
                              <div className="flex items-center gap-3 mb-2">
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" />
                                  <span className="text-sm font-bold text-[#1E293B]">{pro.rating}</span>
                                  <span className="text-xs text-[#64748B]">({pro.totalReviews})</span>
                                </div>
                                <div className="flex gap-0.5">
                                  {[...Array(5)].map((_, i) => (
                                    <div 
                                      key={i} 
                                      className={`w-1.5 h-1.5 rounded-full ${
                                        i < Math.floor(pro.rating) ? 'bg-[#F59E0B]' : 'bg-[#E2E8F0]'
                                      }`} 
                                    />
                                  ))}
                                </div>
                              </div>
                              
                              {/* Badges */}
                              <div className="flex flex-wrap gap-1.5">
                                {pro.badges.map((badge, idx) => (
                                  <span 
                                    key={idx}
                                    className="px-2 py-0.5 bg-gradient-to-r from-[#EFF6FF] to-[#DBEAFE] text-[#1E40AF] rounded-md text-xs font-bold"
                                  >
                                    {badge}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Growth Indicator */}
                          <div className="flex flex-col items-end gap-1">
                            <span className="px-3 py-1.5 bg-[#D1FAE5] text-[#065F46] rounded-full text-xs font-bold flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              {pro.monthlyGrowth}
                            </span>
                            <span className="text-xs text-[#64748B]">{pro.lastActive}</span>
                          </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-4 gap-3 mb-5">
                          <div className="bg-gradient-to-br from-[#F8FAFC] to-white p-3 rounded-xl text-center">
                            <p className="text-xs font-semibold text-[#64748B] mb-1">Jobs</p>
                            <p className="text-xl font-bold text-[#1E293B]">{pro.jobs}</p>
                          </div>
                          <div className="bg-gradient-to-br from-[#F8FAFC] to-white p-3 rounded-xl text-center">
                            <p className="text-xs font-semibold text-[#64748B] mb-1">Earnings</p>
                            <p className="text-sm font-bold text-[#10B981]">{pro.earnings}</p>
                          </div>
                          <div className="bg-gradient-to-br from-[#F8FAFC] to-white p-3 rounded-xl text-center">
                            <p className="text-xs font-semibold text-[#64748B] mb-1">Complete</p>
                            <p className="text-xl font-bold text-[#10B981]">{pro.completionRate}%</p>
                          </div>
                          <div className="bg-gradient-to-br from-[#F8FAFC] to-white p-3 rounded-xl text-center">
                            <p className="text-xs font-semibold text-[#64748B] mb-1">Repeat</p>
                            <p className="text-xl font-bold text-[#8B5CF6]">{pro.repeatCustomers}%</p>
                          </div>
                        </div>

                        {/* Progress Bars */}
                        <div className="space-y-3 mb-5">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-semibold text-[#64748B]">Completion Rate</span>
                              <span className="text-xs font-bold text-[#10B981]">{pro.completionRate}%</span>
                            </div>
                            <div className="w-full bg-[#F1F5F9] rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-[#10B981] to-[#059669] h-2 rounded-full transition-all duration-500"
                                style={{ width: `${pro.completionRate}%` }}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-semibold text-[#64748B]">Positive Reviews</span>
                              <span className="text-xs font-bold text-[#3B82F6]">{pro.positiveReviews}%</span>
                            </div>
                            <div className="w-full bg-[#F1F5F9] rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-[#3B82F6] to-[#2563EB] h-2 rounded-full transition-all duration-500"
                                style={{ width: `${pro.positiveReviews}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Contact & Details */}
                        <div className="grid grid-cols-2 gap-3 mb-4 p-4 bg-[#F8FAFC] rounded-xl">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-[#64748B]" />
                            <div>
                              <p className="text-xs text-[#64748B]">Location</p>
                              <p className="text-xs font-bold text-[#1E293B]">{pro.location}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-[#64748B]" />
                            <div>
                              <p className="text-xs text-[#64748B]">Response</p>
                              <p className="text-xs font-bold text-[#1E293B]">{pro.responseTime}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[#64748B]" />
                            <div>
                              <p className="text-xs text-[#64748B]">Experience</p>
                              <p className="text-xs font-bold text-[#1E293B]">{pro.experience}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-[#64748B]" />
                            <div>
                              <p className="text-xs text-[#64748B]">Avg Job</p>
                              <p className="text-xs font-bold text-[#10B981]">{pro.avgJobValue}</p>
                            </div>
                          </div>
                        </div>

                        {/* Specializations */}
                        <div className="mb-4">
                          <p className="text-xs font-semibold text-[#64748B] mb-2">Specializations:</p>
                          <div className="flex flex-wrap gap-2">
                            {pro.specializations.map((spec, idx) => (
                              <span key={idx} className="px-2 py-1 bg-white border border-[#E2E8F0] text-[#64748B] rounded-lg text-xs">
                                {spec}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-4 border-t border-[#E2E8F0]">
                          <button className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white rounded-xl hover:shadow-lg transition-all text-sm font-bold flex items-center justify-center gap-2">
                            <Eye className="w-4 h-4" />
                            View Profile
                          </button>
                          <button className="px-4 py-2.5 bg-white border border-[#E2E8F0] text-[#64748B] rounded-xl hover:border-[#3B82F6] hover:text-[#3B82F6] transition-all text-sm font-bold">
                            <MessageSquare className="w-4 h-4" />
                          </button>
                          <button className="px-4 py-2.5 bg-white border border-[#E2E8F0] text-[#64748B] rounded-xl hover:border-[#10B981] hover:text-[#10B981] transition-all text-sm font-bold">
                            <Phone className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Category Distribution & Monthly Trends */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Category Distribution */}
                <div className="bg-white rounded-2xl border border-[#E2E8F0] p-7 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-xl flex items-center justify-center">
                      <PieChart className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-[#1E293B]">Category Distribution</h2>
                      <p className="text-xs text-[#64748B]">Professional count by service</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {categoryStats.map((cat, idx) => (
                      <div key={idx} className="group">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded" style={{ backgroundColor: cat.color }} />
                            <span className="text-sm font-semibold text-[#1E293B]">{cat.category}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-[#1E293B]">{cat.count}</span>
                            <span className="text-xs font-bold text-[#64748B] bg-[#F8FAFC] px-2 py-1 rounded-md min-w-[50px] text-center">
                              {cat.percentage}%
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-[#F1F5F9] rounded-full h-2 overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-500"
                            style={{ 
                              width: `${cat.percentage}%`,
                              backgroundColor: cat.color 
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Monthly Growth Trend */}
                <div className="bg-white rounded-2xl border border-[#E2E8F0] p-7 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-[#1E293B]">Growth Trend (4 Months)</h2>
                      <p className="text-xs text-[#64748B]">Professionals, jobs & revenue</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {monthlyTrend.map((month, idx) => (
                      <div key={idx} className="p-4 bg-gradient-to-br from-[#F8FAFC] to-white rounded-xl border border-[#E2E8F0]">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-bold text-[#1E293B]">{month.month} 2024</span>
                          <div className="flex items-center gap-3 text-xs font-bold">
                            <span className="text-[#8B5CF6]">{month.professionals} Pros</span>
                            <span className="text-[#3B82F6]">{month.jobs} Jobs</span>
                            <span className="text-[#10B981]">₹{(month.revenue / 1000).toFixed(0)}K</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="h-2 bg-[#8B5CF6] rounded-full" style={{ width: `${(month.professionals / 213) * 100}%` }} />
                          <div className="h-2 bg-[#3B82F6] rounded-full" style={{ width: `${(month.jobs / 2890) * 100}%` }} />
                          <div className="h-2 bg-[#10B981] rounded-full" style={{ width: `${(month.revenue / 1080000) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Insights */}
              <div className="bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] rounded-2xl p-8 text-white shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold">Performance Insights & Recommendations</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm p-5 rounded-xl">
                    <ThumbsUp className="w-8 h-8 text-white mb-3" />
                    <h3 className="font-bold mb-2">Top Performers</h3>
                    <p className="text-sm text-white/90">Priya Patel (Carpenter) leads with 4.9 rating and 99% completion. Consider featuring as case study.</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm p-5 rounded-xl">
                    <TrendingUp className="w-8 h-8 text-white mb-3" />
                    <h3 className="font-bold mb-2">Growth Opportunity</h3>
                    <p className="text-sm text-white/90">Cleaner category has highest satisfaction (97%) but needs more professionals to meet demand.</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm p-5 rounded-xl">
                    <AlertCircle className="w-8 h-8 text-white mb-3" />
                    <h3 className="font-bold mb-2">Needs Attention</h3>
                    <p className="text-sm text-white/90">Monitor professionals with 3% cancel rate. Provide training and support to improve.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
