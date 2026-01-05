'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TopNavbar from '../../components/TopNavbar';
import LeftSidebar from '../../components/LeftSidebar';
import { 
  ArrowLeft, Store, TrendingUp, TrendingDown, Star, DollarSign, 
  Clock, MapPin, Award, Filter, Download, Activity, Search,
  CheckCircle, XCircle, AlertCircle, Eye, RefreshCw, Settings,
  Phone, Mail, Calendar, Target, ThumbsUp, Package, BarChart3,
  PieChart, ShoppingBag, Users, Zap, AlertTriangle, BadgeCheck,
  MessageSquare, TrendingUp as ArrowUp, Shield, Ban, LineChart
} from 'lucide-react';

export default function ShopsAnalyticsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');
  const [sortBy, setSortBy] = useState('revenue');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Comprehensive Shop Data
  const shops = [
    {
      id: 'SHP-2001',
      name: 'TechZone Electronics',
      owner: 'Rahul Mehta',
      category: 'Electronics',
      rating: 4.8,
      totalOrders: 1547,
      revenue: '₹8,45,230',
      revenueNum: 845230,
      status: 'Active',
      phone: '+91 9876543220',
      email: 'techzone@email.com',
      location: 'Sector 18, Noida',
      established: '2019-05-15',
      products: 342,
      avgOrderValue: '₹5,465',
      completionRate: 97,
      responseTime: '2 hours',
      repeatCustomers: 68,
      badges: ['Top Rated', 'Verified', 'Fast Shipping'],
      availability: 'Mon-Sat, 10AM-8PM',
      specializations: ['Mobile', 'Laptops', 'Accessories'],
      lastActive: '1 hour ago',
      totalReviews: 1289,
      positiveReviews: 95,
      monthlyGrowth: '+18%',
      inventory: 'High Stock',
      returnRate: '2.1%',
      deliveryTime: '1-2 days'
    },
    {
      id: 'SHP-2002',
      name: 'Fashion Hub Store',
      owner: 'Priya Sharma',
      category: 'Fashion',
      rating: 4.7,
      totalOrders: 2134,
      revenue: '₹12,56,780',
      revenueNum: 1256780,
      status: 'Active',
      phone: '+91 9876543221',
      email: 'fashionhub@email.com',
      location: 'Saket, Delhi',
      established: '2018-11-20',
      products: 568,
      avgOrderValue: '₹5,890',
      completionRate: 96,
      responseTime: '3 hours',
      repeatCustomers: 72,
      badges: ['Top Seller', 'Trending', 'Premium'],
      availability: 'Daily, 10AM-10PM',
      specializations: ['Ethnic', 'Western', 'Accessories'],
      lastActive: '30 min ago',
      totalReviews: 1876,
      positiveReviews: 93,
      monthlyGrowth: '+22%',
      inventory: 'Medium Stock',
      returnRate: '3.5%',
      deliveryTime: '2-3 days'
    },
    {
      id: 'SHP-2003',
      name: 'Home Decor Paradise',
      owner: 'Amit Kumar',
      category: 'Home & Living',
      rating: 4.9,
      totalOrders: 986,
      revenue: '₹6,78,450',
      revenueNum: 678450,
      status: 'Active',
      phone: '+91 9876543222',
      email: 'homedecor@email.com',
      location: 'Gurgaon',
      established: '2020-03-10',
      products: 245,
      avgOrderValue: '₹6,880',
      completionRate: 99,
      responseTime: '1.5 hours',
      repeatCustomers: 81,
      badges: ['Best Quality', 'Top Rated', 'Expert'],
      availability: 'Mon-Sun, 9AM-9PM',
      specializations: ['Furniture', 'Decor', 'Lighting'],
      lastActive: '2 hours ago',
      totalReviews: 845,
      positiveReviews: 98,
      monthlyGrowth: '+15%',
      inventory: 'High Stock',
      returnRate: '1.2%',
      deliveryTime: '3-5 days'
    },
    {
      id: 'SHP-2004',
      name: 'Sports Arena',
      owner: 'Vikram Singh',
      category: 'Sports',
      rating: 4.6,
      totalOrders: 1289,
      revenue: '₹5,67,890',
      revenueNum: 567890,
      status: 'Active',
      phone: '+91 9876543223',
      email: 'sportsarena@email.com',
      location: 'Dwarka, Delhi',
      established: '2019-08-22',
      products: 412,
      avgOrderValue: '₹4,405',
      completionRate: 95,
      responseTime: '4 hours',
      repeatCustomers: 58,
      badges: ['Authentic', 'Wide Range'],
      availability: 'Daily, 10AM-9PM',
      specializations: ['Cricket', 'Fitness', 'Outdoor'],
      lastActive: '4 hours ago',
      totalReviews: 1045,
      positiveReviews: 91,
      monthlyGrowth: '+12%',
      inventory: 'Medium Stock',
      returnRate: '4.2%',
      deliveryTime: '2-4 days'
    },
    {
      id: 'SHP-2005',
      name: 'Book Haven',
      owner: 'Neha Gupta',
      category: 'Books',
      rating: 4.8,
      totalOrders: 1678,
      revenue: '₹4,89,560',
      revenueNum: 489560,
      status: 'Active',
      phone: '+91 9876543224',
      email: 'bookhaven@email.com',
      location: 'Connaught Place, Delhi',
      established: '2017-06-15',
      products: 1250,
      avgOrderValue: '₹2,918',
      completionRate: 98,
      responseTime: '2.5 hours',
      repeatCustomers: 76,
      badges: ['Best Collection', 'Fast Delivery', 'Trusted'],
      availability: 'Mon-Sat, 9AM-8PM',
      specializations: ['Fiction', 'Academic', 'Comics'],
      lastActive: '1 hour ago',
      totalReviews: 1456,
      positiveReviews: 96,
      monthlyGrowth: '+10%',
      inventory: 'Very High Stock',
      returnRate: '1.8%',
      deliveryTime: '1 day'
    },
    {
      id: 'SHP-2006',
      name: 'Beauty Bazaar',
      owner: 'Sunita Verma',
      category: 'Beauty',
      rating: 4.7,
      totalOrders: 1923,
      revenue: '₹9,34,120',
      revenueNum: 934120,
      status: 'Active',
      phone: '+91 9876543225',
      email: 'beautybazaar@email.com',
      location: 'South Delhi',
      established: '2019-01-10',
      products: 687,
      avgOrderValue: '₹4,856',
      completionRate: 96,
      responseTime: '3 hours',
      repeatCustomers: 79,
      badges: ['Original Products', 'Top Rated', 'Premium'],
      availability: 'Daily, 10AM-9PM',
      specializations: ['Skincare', 'Makeup', 'Haircare'],
      lastActive: '45 min ago',
      totalReviews: 1678,
      positiveReviews: 94,
      monthlyGrowth: '+20%',
      inventory: 'High Stock',
      returnRate: '2.8%',
      deliveryTime: '1-2 days'
    },
    {
      id: 'SHP-2007',
      name: 'Kitchen Essentials',
      owner: 'Rajesh Patel',
      category: 'Kitchen',
      rating: 4.5,
      totalOrders: 1098,
      revenue: '₹5,23,450',
      revenueNum: 523450,
      status: 'Busy',
      phone: '+91 9876543226',
      email: 'kitchen@email.com',
      location: 'Rohini, Delhi',
      established: '2020-07-05',
      products: 324,
      avgOrderValue: '₹4,767',
      completionRate: 94,
      responseTime: '5 hours',
      repeatCustomers: 62,
      badges: ['Quality Products'],
      availability: 'Mon-Sat, 10AM-7PM',
      specializations: ['Cookware', 'Appliances', 'Tools'],
      lastActive: 'Active now',
      totalReviews: 892,
      positiveReviews: 89,
      monthlyGrowth: '+8%',
      inventory: 'Low Stock',
      returnRate: '5.1%',
      deliveryTime: '3-4 days'
    },
    {
      id: 'SHP-2008',
      name: 'Pet Paradise',
      owner: 'Kavita Reddy',
      category: 'Pet Supplies',
      rating: 4.9,
      totalOrders: 1456,
      revenue: '₹7,12,340',
      revenueNum: 712340,
      status: 'Active',
      phone: '+91 9876543227',
      email: 'petparadise@email.com',
      location: 'Bangalore',
      established: '2018-09-12',
      products: 456,
      avgOrderValue: '₹4,893',
      completionRate: 99,
      responseTime: '2 hours',
      repeatCustomers: 84,
      badges: ['Top Rated', 'Verified', 'Pet Friendly', 'Expert'],
      availability: 'Daily, 9AM-9PM',
      specializations: ['Food', 'Toys', 'Grooming'],
      lastActive: '3 hours ago',
      totalReviews: 1289,
      positiveReviews: 98,
      monthlyGrowth: '+17%',
      inventory: 'High Stock',
      returnRate: '1.5%',
      deliveryTime: '1-2 days'
    },
    {
      id: 'SHP-2009',
      name: 'Toys World',
      owner: 'Manoj Kumar',
      category: 'Toys',
      rating: 4.6,
      totalOrders: 1734,
      revenue: '₹6,45,890',
      revenueNum: 645890,
      status: 'Active',
      phone: '+91 9876543228',
      email: 'toysworld@email.com',
      location: 'Pune',
      established: '2019-12-18',
      products: 589,
      avgOrderValue: '₹3,725',
      completionRate: 97,
      responseTime: '3.5 hours',
      repeatCustomers: 71,
      badges: ['Safe Products', 'Wide Range', 'Trending'],
      availability: 'Daily, 10AM-8PM',
      specializations: ['Educational', 'Action', 'Board Games'],
      lastActive: '2 hours ago',
      totalReviews: 1456,
      positiveReviews: 92,
      monthlyGrowth: '+14%',
      inventory: 'Medium Stock',
      returnRate: '3.2%',
      deliveryTime: '2-3 days'
    },
    {
      id: 'SHP-2010',
      name: 'Garden Paradise',
      owner: 'Arjun Malhotra',
      category: 'Garden',
      rating: 4.7,
      totalOrders: 892,
      revenue: '₹4,56,780',
      revenueNum: 456780,
      status: 'Active',
      phone: '+91 9876543229',
      email: 'garden@email.com',
      location: 'Noida',
      established: '2020-04-20',
      products: 278,
      avgOrderValue: '₹5,122',
      completionRate: 96,
      responseTime: '4 hours',
      repeatCustomers: 65,
      badges: ['Organic', 'Expert Advice'],
      availability: 'Mon-Sat, 8AM-6PM',
      specializations: ['Plants', 'Tools', 'Seeds'],
      lastActive: '5 hours ago',
      totalReviews: 756,
      positiveReviews: 93,
      monthlyGrowth: '+11%',
      inventory: 'Seasonal Stock',
      returnRate: '2.5%',
      deliveryTime: '2-4 days'
    }
  ];

  // Performance Statistics
  const performanceStats = {
    totalShops: 147,
    activeShops: 142,
    avgRating: 4.7,
    totalOrders: 14845,
    totalRevenue: '₹68.9L',
    avgOrderValue: '₹4,642',
    completionRate: 96.8,
    customerSatisfaction: 93.5
  };

  // Category Distribution
  const categoryStats = [
    { category: 'Fashion', count: 28, percentage: 19, revenue: '₹18.5L', color: '#F59E0B' },
    { category: 'Electronics', count: 22, percentage: 15, revenue: '₹15.2L', color: '#3B82F6' },
    { category: 'Home & Living', count: 25, percentage: 17, revenue: '₹12.8L', color: '#10B981' },
    { category: 'Beauty', count: 18, percentage: 12, revenue: '₹9.4L', color: '#8B5CF6' },
    { category: 'Books', count: 16, percentage: 11, revenue: '₹5.6L', color: '#EF4444' },
    { category: 'Sports', count: 14, percentage: 10, revenue: '₹4.9L', color: '#06B6D4' },
    { category: 'Others', count: 24, percentage: 16, revenue: '₹2.5L', color: '#64748B' },
  ];

  // Monthly Trend Data
  const monthlyTrend = [
    { month: 'Jan', shops: 138, orders: 12450, revenue: 5890000 },
    { month: 'Feb', orders: 13200, revenue: 6120000 },
    { month: 'Mar', shops: 142, orders: 13850, revenue: 6450000 },
    { month: 'Apr', shops: 147, orders: 14845, revenue: 6890000 },
  ];

  // Filter and Search Logic
  const filteredShops = shops.filter(shop => {
    const matchesSearch = shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         shop.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         shop.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         shop.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || shop.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || shop.status === selectedStatus;
    const matchesRating = selectedRating === 'all' || 
                          (selectedRating === '4.5+' && shop.rating >= 4.5) ||
                          (selectedRating === '4.0-4.5' && shop.rating >= 4.0 && shop.rating < 4.5);
    return matchesSearch && matchesCategory && matchesStatus && matchesRating;
  });

  // Sort Logic
  const sortedShops = [...filteredShops].sort((a, b) => {
    switch(sortBy) {
      case 'revenue': return b.revenueNum - a.revenueNum;
      case 'rating': return b.rating - a.rating;
      case 'orders': return b.totalOrders - a.totalOrders;
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
                  <div className="w-16 h-16 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-2xl flex items-center justify-center shadow-lg">
                    <Store className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-[#1E293B] mb-1 flex items-center gap-3">
                      Top Selling Shops Analytics
                      <span className="px-3 py-1 bg-gradient-to-r from-[#10B981] to-[#059669] text-white text-xs font-bold rounded-full flex items-center gap-1">
                        <Activity className="w-3 h-3" />
                        {performanceStats.activeShops} ACTIVE
                      </span>
                    </h1>
                    <p className="text-sm text-[#64748B] flex items-center gap-3">
                      Comprehensive insights into shop performance & sales metrics
                      <span className="text-xs text-[#10B981] font-semibold">
                        Updated: {currentTime.toLocaleTimeString()}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="px-5 py-2.5 bg-white border border-[#E2E8F0] text-[#64748B] rounded-xl hover:border-[#10B981] hover:text-[#10B981] transition-all flex items-center gap-2 text-sm font-bold">
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                  </button>
                  <button className="px-5 py-2.5 bg-gradient-to-r from-[#10B981] to-[#059669] text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2 text-sm font-bold">
                    <Download className="w-4 h-4" />
                    Export Data
                  </button>
                </div>
              </div>

              {/* Performance Summary KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl flex items-center justify-center">
                      <Store className="w-6 h-6 text-white" />
                    </div>
                    <span className="px-3 py-1 bg-[#D1FAE5] text-[#065F46] rounded-full text-xs font-bold">+8.5%</span>
                  </div>
                  <p className="text-sm font-semibold text-[#64748B] mb-1">Total Shops</p>
                  <p className="text-3xl font-bold text-[#1E293B]">{performanceStats.totalShops}</p>
                  <p className="text-xs text-[#10B981] mt-1">{performanceStats.activeShops} currently active</p>
                </div>

                <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-xl flex items-center justify-center">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <span className="px-3 py-1 bg-[#D1FAE5] text-[#065F46] rounded-full text-xs font-bold">+0.2</span>
                  </div>
                  <p className="text-sm font-semibold text-[#64748B] mb-1">Average Rating</p>
                  <p className="text-3xl font-bold text-[#1E293B]">{performanceStats.avgRating}</p>
                  <p className="text-xs text-[#64748B] mt-1">{performanceStats.customerSatisfaction}% satisfaction</p>
                </div>

                <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-xl flex items-center justify-center">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <span className="px-3 py-1 bg-[#D1FAE5] text-[#065F46] rounded-full text-xs font-bold">+15%</span>
                  </div>
                  <p className="text-sm font-semibold text-[#64748B] mb-1">Total Orders</p>
                  <p className="text-3xl font-bold text-[#1E293B]">{performanceStats.totalOrders.toLocaleString()}</p>
                  <p className="text-xs text-[#64748B] mt-1">{performanceStats.completionRate}% completion</p>
                </div>

                <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] rounded-xl flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <span className="px-3 py-1 bg-[#D1FAE5] text-[#065F46] rounded-full text-xs font-bold">+18%</span>
                  </div>
                  <p className="text-sm font-semibold text-[#64748B] mb-1">Total Revenue</p>
                  <p className="text-3xl font-bold text-[#1E293B]">{performanceStats.totalRevenue}</p>
                  <p className="text-xs text-[#64748B] mt-1">Avg: {performanceStats.avgOrderValue}/order</p>
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
                        placeholder="Search by shop name, ID, owner, or location..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 text-gray-700 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent font-medium"
                      />
                    </div>
                  </div>
                  
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-3 text-gray-700 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent font-medium"
                  >
                    <option value="all">All Categories</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Home & Living">Home & Living</option>
                    <option value="Beauty">Beauty</option>
                    <option value="Books">Books</option>
                    <option value="Sports">Sports</option>
                    <option value="Kitchen">Kitchen</option>
                    <option value="Pet Supplies">Pet Supplies</option>
                    <option value="Toys">Toys</option>
                    <option value="Garden">Garden</option>
                  </select>

                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-4 py-3 text-gray-700 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent font-medium"
                  >
                    <option value="all">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Busy">Busy</option>
                    <option value="Inactive">Inactive</option>
                  </select>

                  <select
                    value={selectedRating}
                    onChange={(e) => setSelectedRating(e.target.value)}
                    className="px-4 py-3 text-gray-700 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent font-medium"
                  >
                    <option value="all">All Ratings</option>
                    <option value="4.5+">4.5+ Stars</option>
                    <option value="4.0-4.5">4.0-4.5 Stars</option>
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-3 text-gray-700 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent font-medium"
                  >
                    <option value="revenue">Sort by Revenue</option>
                    <option value="rating">Sort by Rating</option>
                    <option value="orders">Sort by Orders</option>
                    <option value="name">Sort by Name</option>
                  </select>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-[#64748B]">
                    Showing <span className="font-bold text-[#1E293B]">{sortedShops.length}</span> of <span className="font-bold text-[#1E293B]">{shops.length}</span> shops
                  </p>
                  <button className="text-sm text-[#10B981] hover:text-[#059669] font-bold flex items-center gap-1">
                    <RefreshCw className="w-4 h-4" />
                    Clear Filters
                  </button>
                </div>
              </div>

              {/* Shop Cards Grid */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-[#1E293B] mb-5 flex items-center gap-2">
                  <Store className="w-6 h-6 text-[#10B981]" />
                  Shop Directory ({sortedShops.length})
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {sortedShops.map((shop, index) => (
                    <div 
                      key={shop.id}
                      className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer"
                    >
                      {/* Header Section */}
                      <div className="flex items-start justify-between mb-5">
                        <div className="flex items-start gap-4 flex-1">
                          {/* Shop Icon */}
                          <div className="relative">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-2xl flex items-center justify-center shadow-md">
                              <Store className="w-8 h-8 text-white" />
                            </div>
                            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                              shop.status === 'Active' ? 'bg-[#10B981]' : shop.status === 'Busy' ? 'bg-[#F59E0B]' : 'bg-[#64748B]'
                            }`} />
                          </div>
                          
                          {/* Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-bold text-[#1E293B]">{shop.name}</h3>
                              <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${
                                shop.status === 'Active' ? 'bg-[#D1FAE5] text-[#065F46]' :
                                shop.status === 'Busy' ? 'bg-[#FEF3C7] text-[#92400E]' :
                                'bg-[#F1F5F9] text-[#64748B]'
                              }`}>
                                {shop.status}
                              </span>
                            </div>
                            <p className="text-sm text-[#64748B] mb-2">{shop.id} • {shop.category}</p>
                            <p className="text-xs text-[#64748B] mb-2">Owner: {shop.owner}</p>
                            
                            {/* Rating */}
                            <div className="flex items-center gap-3 mb-2">
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" />
                                <span className="text-sm font-bold text-[#1E293B]">{shop.rating}</span>
                                <span className="text-xs text-[#64748B]">({shop.totalReviews})</span>
                              </div>
                              <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <div 
                                    key={i} 
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      i < Math.floor(shop.rating) ? 'bg-[#F59E0B]' : 'bg-[#E2E8F0]'
                                    }`} 
                                  />
                                ))}
                              </div>
                            </div>
                            
                            {/* Badges */}
                            <div className="flex flex-wrap gap-1.5">
                              {shop.badges.map((badge, idx) => (
                                <span 
                                  key={idx}
                                  className="px-2 py-0.5 bg-gradient-to-r from-[#D1FAE5] to-[#A7F3D0] text-[#065F46] rounded-md text-xs font-bold"
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
                            {shop.monthlyGrowth}
                          </span>
                          <span className="text-xs text-[#64748B]">{shop.lastActive}</span>
                        </div>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-4 gap-3 mb-5">
                        <div className="bg-gradient-to-br from-[#F8FAFC] to-white p-3 rounded-xl text-center">
                          <p className="text-xs font-semibold text-[#64748B] mb-1">Orders</p>
                          <p className="text-xl font-bold text-[#1E293B]">{shop.totalOrders}</p>
                        </div>
                        <div className="bg-gradient-to-br from-[#F8FAFC] to-white p-3 rounded-xl text-center">
                          <p className="text-xs font-semibold text-[#64748B] mb-1">Revenue</p>
                          <p className="text-sm font-bold text-[#10B981]">{shop.revenue}</p>
                        </div>
                        <div className="bg-gradient-to-br from-[#F8FAFC] to-white p-3 rounded-xl text-center">
                          <p className="text-xs font-semibold text-[#64748B] mb-1">Products</p>
                          <p className="text-xl font-bold text-[#3B82F6]">{shop.products}</p>
                        </div>
                        <div className="bg-gradient-to-br from-[#F8FAFC] to-white p-3 rounded-xl text-center">
                          <p className="text-xs font-semibold text-[#64748B] mb-1">Repeat</p>
                          <p className="text-xl font-bold text-[#8B5CF6]">{shop.repeatCustomers}%</p>
                        </div>
                      </div>

                      {/* Progress Bars */}
                      <div className="space-y-3 mb-5">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-[#64748B]">Completion Rate</span>
                            <span className="text-xs font-bold text-[#10B981]">{shop.completionRate}%</span>
                          </div>
                          <div className="w-full bg-[#F1F5F9] rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-[#10B981] to-[#059669] h-2 rounded-full transition-all duration-500"
                              style={{ width: `${shop.completionRate}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-[#64748B]">Positive Reviews</span>
                            <span className="text-xs font-bold text-[#3B82F6]">{shop.positiveReviews}%</span>
                          </div>
                          <div className="w-full bg-[#F1F5F9] rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-[#3B82F6] to-[#2563EB] h-2 rounded-full transition-all duration-500"
                              style={{ width: `${shop.positiveReviews}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-4 p-4 bg-[#F8FAFC] rounded-xl">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#64748B]" />
                          <div>
                            <p className="text-xs text-[#64748B]">Location</p>
                            <p className="text-xs font-bold text-[#1E293B]">{shop.location}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[#64748B]" />
                          <div>
                            <p className="text-xs text-[#64748B]">Response</p>
                            <p className="text-xs font-bold text-[#1E293B]">{shop.responseTime}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-[#64748B]" />
                          <div>
                            <p className="text-xs text-[#64748B]">Avg Order</p>
                            <p className="text-xs font-bold text-[#10B981]">{shop.avgOrderValue}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-[#64748B]" />
                          <div>
                            <p className="text-xs text-[#64748B]">Inventory</p>
                            <p className="text-xs font-bold text-[#1E293B]">{shop.inventory}</p>
                          </div>
                        </div>
                      </div>

                      {/* Specializations */}
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-[#64748B] mb-2">Specializations:</p>
                        <div className="flex flex-wrap gap-2">
                          {shop.specializations.map((spec, idx) => (
                            <span key={idx} className="px-2 py-1 bg-white border border-[#E2E8F0] text-[#64748B] rounded-lg text-xs">
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-4 border-t border-[#E2E8F0]">
                        <button className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#10B981] to-[#059669] text-white rounded-xl hover:shadow-lg transition-all text-sm font-bold flex items-center justify-center gap-2">
                          <Eye className="w-4 h-4" />
                          View Shop
                        </button>
                        <button className="px-4 py-2.5 bg-white border border-[#E2E8F0] text-[#64748B] rounded-xl hover:border-[#3B82F6] hover:text-[#3B82F6] transition-all text-sm font-bold">
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        <button className="px-4 py-2.5 bg-white border border-[#E2E8F0] text-[#64748B] rounded-xl hover:border-[#10B981] hover:text-[#10B981] transition-all text-sm font-bold">
                          <Phone className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
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
                      <p className="text-xs text-[#64748B]">Shops & revenue by category</p>
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
                            <span className="text-xs font-bold text-[#10B981]">{cat.revenue}</span>
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
                      <p className="text-xs text-[#64748B]">Shops, orders & revenue growth</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {monthlyTrend.map((month, idx) => (
                      <div key={idx} className="p-4 bg-gradient-to-br from-[#F8FAFC] to-white rounded-xl border border-[#E2E8F0]">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-bold text-[#1E293B]">{month.month} 2024</span>
                          <div className="flex items-center gap-3 text-xs font-bold">
                            {month.shops && <span className="text-[#10B981]">{month.shops} Shops</span>}
                            <span className="text-[#3B82F6]">{month.orders.toLocaleString()} Orders</span>
                            <span className="text-[#8B5CF6]">₹{(month.revenue / 100000).toFixed(1)}L</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="h-2 bg-[#3B82F6] rounded-full" style={{ width: `${(month.orders / 14845) * 100}%` }} />
                          <div className="h-2 bg-[#8B5CF6] rounded-full" style={{ width: `${(month.revenue / 6890000) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Insights */}
              <div className="bg-gradient-to-br from-[#10B981] to-[#059669] rounded-2xl p-8 text-white shadow-lg">
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
                    <p className="text-sm text-white/90">Fashion Hub Store leads with ₹12.5L revenue and 22% growth. Pet Paradise has highest satisfaction at 98%.</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm p-5 rounded-xl">
                    <TrendingUp className="w-8 h-8 text-white mb-3" />
                    <h3 className="font-bold mb-2">Growth Opportunities</h3>
                    <p className="text-sm text-white/90">Electronics and Beauty categories show strong demand. Consider promoting shops in these segments.</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm p-5 rounded-xl">
                    <AlertCircle className="w-8 h-8 text-white mb-3" />
                    <h3 className="font-bold mb-2">Needs Attention</h3>
                    <p className="text-sm text-white/90">Kitchen Essentials has low stock and high return rate (5.1%). Provide inventory management support.</p>
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
