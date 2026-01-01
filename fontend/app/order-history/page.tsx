'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, SlidersHorizontal, Zap, Wrench, ChefHat, Car, UtensilsCrossed, Star, MapPin, Clock, Calendar, Download, Eye, Package, X, Check, Search, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Order interface
interface Order {
  id: string;
  service: string;
  category: 'electrical' | 'plumbing' | 'housekeeping' | 'cooking' | 'driving';
  status: 'completed' | 'cancelled' | 'ongoing';
  professional: {
    name: string;
    role: string;
    rating: number;
    image: string;
  };
  date: string;
  time: string;
  location: string;
  duration: string;
  payment: string;
  paymentStatus: string;
}

// Sample data
const sampleOrders: Order[] = [
  {
    id: '#123456',
    service: 'Electrical – Fan Repair',
    category: 'electrical',
    status: 'completed',
    professional: {
      name: 'Rahul Das',
      role: 'Electrician',
      rating: 4.9,
      image: 'https://placehold.co/64x64'
    },
    date: '12 Oct 2025',
    time: '3:00 PM – 4:30 PM',
    location: '22/5 Lake Town, Kolkata',
    duration: '1.5 hours',
    payment: '₹450',
    paymentStatus: 'Paid Online'
  },
  {
    id: '#123457',
    service: 'Plumbing - Pipe Leak Fix',
    category: 'plumbing',
    status: 'cancelled',
    professional: {
      name: 'Rahul Das',
      role: 'Electrician',
      rating: 4.9,
      image: 'https://placehold.co/64x64'
    },
    date: '12 Oct 2025',
    time: '3:00 PM – 4:30 PM',
    location: '22/5 Lake Town, Kolkata',
    duration: '1.5 hours',
    payment: '₹450',
    paymentStatus: 'Paid Online'
  },
  {
    id: '#123458',
    service: 'Cooking - Lunch Preparation',
    category: 'cooking',
    status: 'ongoing',
    professional: {
      name: 'Rahul Das',
      role: 'Electrician',
      rating: 4.9,
      image: 'https://placehold.co/64x64'
    },
    date: '12 Oct 2025',
    time: '3:00 PM – 4:30 PM',
    location: '22/5 Lake Town, Kolkata',
    duration: '1.5 hours',
    payment: '₹450',
    paymentStatus: 'Paid Online'
  }
];

export default function OrderHistoryPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'all' | 'completed' | 'cancelled' | 'ongoing'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('latest');
  const [orders, setOrders] = useState<Order[]>(sampleOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  // Simulate API call on mount
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      setOrders(sampleOrders);
    } catch (err) {
      setError('Failed to load orders. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Advanced filtering logic
  const filteredOrders = useMemo(() => {
    let filtered = [...orders];

    // Filter by active tab
    if (activeTab !== 'all') {
      filtered = filtered.filter(order => order.status === activeTab);
    }

    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(order => 
        selectedCategories.includes(order.category)
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order => 
        order.service.toLowerCase().includes(query) ||
        order.professional.name.toLowerCase().includes(query) ||
        order.location.toLowerCase().includes(query) ||
        order.id.toLowerCase().includes(query)
      );
    }

    // Filter by date range
    if (dateFrom) {
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.date);
        return orderDate >= new Date(dateFrom);
      });
    }
    if (dateTo) {
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.date);
        return orderDate <= new Date(dateTo);
      });
    }

    // Sort orders
    switch (sortBy) {
      case 'oldest':
        filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case 'rating':
        filtered.sort((a, b) => b.professional.rating - a.professional.rating);
        break;
      case 'price':
        filtered.sort((a, b) => {
          const priceA = parseInt(a.payment.replace(/[^0-9]/g, ''));
          const priceB = parseInt(b.payment.replace(/[^0-9]/g, ''));
          return priceA - priceB;
        });
        break;
      case 'latest':
      default:
        filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    return filtered;
  }, [orders, activeTab, selectedCategories, searchQuery, dateFrom, dateTo, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, selectedCategories, searchQuery, dateFrom, dateTo]);

  // Handle actions
  const handleBookAgain = (order: Order) => {
    router.push(`/service?category=${order.category}&professionalId=${order.professional.name}`);
  };

  const handleViewDetails = (order: Order) => {
    router.push(`/booking/${order.id.replace('#', '')}`);
  };

  const handleDownloadInvoice = (order: Order) => {
    // Simulate invoice download
    console.log('Downloading invoice for:', order.id);
    // In production: window.open(`/api/invoice/${order.id}`, '_blank');
  };

  const handleViewProfile = (professionalName: string) => {
    router.push(`/professional?name=${professionalName}`);
  };

  const handleApplyFilters = () => {
    setShowFilters(false);
    // Filters are already applied via useMemo
  };

  const handleResetFilters = () => {
    setSelectedCategories([]);
    setSortBy('latest');
    setDateFrom('');
    setDateTo('');
    setSearchQuery('');
  };

  const handleRetry = () => {
    fetchOrders();
  };

  // Get service icon
  const getServiceIcon = (category: string) => {
    switch (category) {
      case 'electrical':
        return <Zap className="w-5 h-5 text-[#0066FF]" />;
      case 'plumbing':
        return <Wrench className="w-5 h-5 text-red-500" />;
      case 'cooking':
        return <ChefHat className="w-5 h-5 text-[#0066FF]" />;
      case 'housekeeping':
        return <UtensilsCrossed className="w-5 h-5 text-purple-500" />;
      case 'driving':
        return <Car className="w-5 h-5 text-green-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="px-3 py-1 bg-[#00C28C] text-white text-xs font-semibold rounded-full">
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
            Cancelled
          </span>
        );
      case 'ongoing':
        return (
          <span className="px-3 py-1 bg-[#0066FF] text-white text-xs font-semibold rounded-full">
            Ongoing
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Order History</h1>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleRetry}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Refresh orders"
              disabled={isLoading}
            >
              <RefreshCw className={`w-5 h-5 text-gray-700 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
              aria-label="Open filters"
            >
              <SlidersHorizontal className="w-6 h-6 text-gray-700" />
              {(selectedCategories.length > 0 || dateFrom || dateTo || sortBy !== 'latest') && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#0066FF] rounded-full"></span>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-7xl mx-auto px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by service, professional, location, or booking ID..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066FF] focus:border-[#0066FF] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                aria-label="Clear search"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 flex gap-6">
            {['all', 'completed', 'cancelled', 'ongoing'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`pb-3 px-2 text-sm font-semibold transition-colors relative ${
                  activeTab === tab
                    ? 'text-[#0066FF]'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0066FF]"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Filter Panel */}
      {showFilters && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-20">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl animate-slide-down">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Filters</h3>
              <button 
                onClick={() => setShowFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Service Category */}
            <div className="mb-6">
              <h4 className="text-sm font-bold text-gray-900 mb-3">Service Category</h4>
              <div className="space-y-2">
                {['Electrical', 'Plumbing', 'Housekeeping', 'Cooking', 'Driving'].map((category) => (
                  <label key={category} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.toLowerCase())}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCategories([...selectedCategories, category.toLowerCase()]);
                        } else {
                          setSelectedCategories(selectedCategories.filter(c => c !== category.toLowerCase()));
                        }
                      }}
                      className="w-5 h-5 rounded border-gray-300 text-[#0066FF] focus:ring-[#0066FF]"
                    />
                    <span className="text-gray-700 font-medium">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div className="mb-6">
              <h4 className="text-sm font-bold text-gray-900 mb-3">Date Range</h4>
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    placeholder="From"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066FF] focus:border-[#0066FF]"
                  />
                </div>
                <span className="text-gray-500">–</span>
                <div className="flex-1 relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    placeholder="To"
                    min={dateFrom}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066FF] focus:border-[#0066FF]"
                  />
                </div>
              </div>
            </div>

            {/* Sort By */}
            <div className="mb-6">
              <h4 className="text-sm font-bold text-gray-900 mb-3">Sort By</h4>
              <div className="space-y-2">
                {[
                  { value: 'latest', label: 'Latest First' },
                  { value: 'oldest', label: 'Oldest First' },
                  { value: 'rating', label: 'High Rating First' },
                  { value: 'price', label: 'Low Price First' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="sortBy"
                      value={option.value}
                      checked={sortBy === option.value}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-5 h-5 border-gray-300 text-[#0066FF] focus:ring-[#0066FF]"
                    />
                    <span className="text-gray-700 font-medium">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Active Filters Summary */}
            {(selectedCategories.length > 0 || dateFrom || dateTo || sortBy !== 'latest') && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">Active Filters:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedCategories.length > 0 && (
                    <span className="text-xs bg-white px-2 py-1 rounded border border-blue-200">
                      {selectedCategories.length} categories
                    </span>
                  )}
                  {dateFrom && (
                    <span className="text-xs bg-white px-2 py-1 rounded border border-blue-200">
                      From: {dateFrom}
                    </span>
                  )}
                  {dateTo && (
                    <span className="text-xs bg-white px-2 py-1 rounded border border-blue-200">
                      To: {dateTo}
                    </span>
                  )}
                  {sortBy !== 'latest' && (
                    <span className="text-xs bg-white px-2 py-1 rounded border border-blue-200">
                      Sort: {sortBy}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleResetFilters}
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Reset
              </button>
              <button
                onClick={handleApplyFilters}
                className="flex-1 px-4 py-3 bg-[#0066FF] text-white rounded-lg font-semibold hover:bg-[#0052CC] transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Results Summary */}
        {!isLoading && !error && (
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold">{paginatedOrders.length}</span> of{' '}
              <span className="font-semibold">{filteredOrders.length}</span> orders
              {searchQuery && (
                <span> matching &quot;<span className="font-medium">{searchQuery}</span>&quot;</span>
              )}
            </p>
            {filteredOrders.length > ordersPerPage && (
              <p className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </p>
            )}
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-12 h-12 text-[#0066FF] animate-spin mb-4" />
            <p className="text-gray-600 font-medium">Loading your orders...</p>
          </div>
        ) : error ? (
          // Error State
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h3>
            <p className="text-gray-600 mb-6 text-center max-w-sm">{error}</p>
            <button
              onClick={handleRetry}
              className="bg-[#0066FF] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#0052CC] transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </button>
          </div>
        ) : filteredOrders.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative w-48 h-48 mb-6">
              <div className="absolute inset-0 flex items-center justify-center">
                <Package className="w-24 h-24 text-gray-300" />
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-4xl">?</span>
                </div>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No bookings yet!</h3>
            <p className="text-gray-600 mb-6 text-center max-w-sm">
              Once you book a service, your orders will appear here.
            </p>
            <button className="bg-[#00C28C] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#00A876] transition-colors shadow-lg">
              Book Your First Service
            </button>

            {/* Popular Services */}
            <div className="mt-16 w-full">
              <h4 className="text-lg font-bold text-gray-900 mb-4">Popular Services Near You</h4>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: '🧹', name: 'Deep Cleaning' },
                  { icon: '❄️', name: 'AC Repair' },
                  { icon: '🛵', name: 'Driver on Demand' }
                ].map((service) => (
                  <div key={service.name} className="bg-white rounded-xl p-4 text-center hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="text-4xl mb-2">{service.icon}</div>
                    <p className="text-sm font-semibold text-gray-900">{service.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Order Cards
          <>
            <div className="space-y-4">
              {paginatedOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow">
                {/* Top Row */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      {getServiceIcon(order.category)}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{order.service}</h3>
                    </div>
                  </div>
                  {getStatusBadge(order.status)}
                </div>

                {/* Professional Details */}
                <div className="mb-4 pb-4 border-b border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 mb-2">Professional</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                        <Image
                          src={order.professional.image}
                          alt={order.professional.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{order.professional.name}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-gray-600">{order.professional.role}</p>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                            <span className="text-sm font-medium text-gray-900">{order.professional.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleViewProfile(order.professional.name)}
                      className="text-[#0066FF] text-sm font-semibold hover:underline"
                    >
                      View Profile
                    </button>
                  </div>
                  {order.status === 'completed' && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded">
                        ✓ Trnit Booking
                      </span>
                      <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded">
                        Formethes
                      </span>
                    </div>
                  )}
                </div>

                {/* Job Summary */}
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-500 mb-3">Job Summary</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-start gap-2">
                      <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500">Date:</p>
                        <p className="text-sm font-medium text-gray-900">{order.date}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500">Time:</p>
                        <p className="text-sm font-medium text-gray-900">{order.time}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500">Location:</p>
                        <p className="text-sm font-medium text-gray-900">{order.location}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500">Duration:</p>
                        <p className="text-sm font-medium text-gray-900">{order.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 col-span-2">
                      <div className="w-4 h-4 flex items-center justify-center mt-0.5">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Payment:</p>
                        <p className="text-sm font-medium text-gray-900">
                          {order.payment} ({order.paymentStatus})
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={() => handleBookAgain(order)}
                    className="flex-1 min-w-[120px] bg-[#0066FF] text-white py-2.5 rounded-lg font-semibold hover:bg-[#0052CC] transition-colors"
                  >
                    Book Again
                  </button>
                  <button 
                    onClick={() => handleViewDetails(order)}
                    className="flex-1 min-w-[120px] border-2 border-[#0066FF] text-[#0066FF] py-2.5 rounded-lg font-semibold hover:bg-[#0066FF] hover:text-white transition-colors"
                  >
                    View Details
                  </button>
                  {order.status === 'completed' && (
                    <button 
                      onClick={() => handleDownloadInvoice(order)}
                      className="border-2 border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      <span className="hidden sm:inline">Invoice</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <div className="flex gap-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                          currentPage === pageNum
                            ? 'bg-[#0066FF] text-white'
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
