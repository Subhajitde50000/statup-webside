'use client';

import React, { useState } from 'react';
import { Search, SlidersHorizontal, Star, Clock, Wrench, Shield, CheckCircle, ChevronRight, X, MapPin, ChevronDown, ArrowRight, TrendingUp, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '../Component/Navbar';
import Footer from '../Component/Footer';
import Notifications from '../Component/Notifications';

export default function Service() {
  const router = useRouter();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [sortBy, setSortBy] = useState('recommended');
  const [selectedService, setSelectedService] = useState(null);

  const filterOptions = [
    'Available Today',
    '4.5★ & Above',
    'Budget Friendly',
    'Emergency Services'
  ];

  const subCategories = [
    { id: 1, name: 'Fan Repair & Fitting', icon: '🌀' },
    { id: 2, name: 'Switchboard Repair', icon: '🔌' },
    { id: 3, name: 'Light / Tube Installation', icon: '💡' },
    { id: 4, name: 'Wiring & Rewiring', icon: '🔧' },
    { id: 5, name: 'Appliance Repair', icon: '🔨' },
    { id: 6, name: 'Inverter / Stabilizer', icon: '⚡' },
    { id: 7, name: 'Meter Box Service', icon: '📊' },
    { id: 8, name: 'Safety Inspection', icon: '🛡️' }
  ];

  const services = [
    {
      id: 1,
      name: 'Fan Repair & Full Servicing',
      description: 'professional_view electricians for ceiling/stand fan repair, noise issues, slow speed, and wiring faults.',
      image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&h=300&fit=crop',
      rating: 4.9,
      reviews: 320,
      badge: 'Highly booked this week',
      duration: '45-60 mins',
      priceRange: '₹199 - ₹399',
      features: ['Tools included', '7-day warranty', 'Verified professional_view'],
      includes: ['Fan inspection', 'Noise fixing', 'Speed regulation', 'Wiring check', 'Cleaning & lubrication'],
      notIncluded: ['Spare parts', 'New fan installation', 'Ceiling work']
    },
    {
      id: 2,
      name: 'Switchboard Installation & Repair',
      description: 'Switchboard installation & repair faults. Expert electricians for safe and reliable work.',
      image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=300&fit=crop',
      rating: 4.9,
      reviews: 320,
      badge: 'Most popular',
      duration: '45-60 mins',
      priceRange: '₹199 - ₹399',
      features: ['Tools included', '7-day warranty', 'Verified professional_view'],
      includes: ['Board inspection', 'Switch replacement', 'Wiring correction', 'Safety check'],
      notIncluded: ['New board purchase', 'Wall drilling', 'Painting work']
    },
    {
      id: 3,
      name: 'Full Home Wiring Inspection',
      description: 'Full Home Wiring inspection is full home electrician and wiring faults.',
      image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop',
      rating: 4.9,
      reviews: 320,
      badge: 'Safety certified',
      duration: '45-60 mins',
      priceRange: '₹199 - ₹399',
      features: ['Tools included', '7-day warranty', 'Verified professional_view'],
      includes: ['Complete wiring check', 'Load testing', 'Safety report', 'Fault detection'],
      notIncluded: ['Rewiring work', 'New installations', 'Repair services']
    },
    {
      id: 4,
      name: 'Light & Tube Installation',
      description: 'professional_view installation of lights, tube lights, chandeliers, and decorative lighting.',
      image: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=400&h=300&fit=crop',
      rating: 4.8,
      reviews: 285,
      badge: 'Quick service',
      duration: '30-45 mins',
      priceRange: '₹149 - ₹299',
      features: ['Tools included', '7-day warranty', 'Verified professional_view'],
      includes: ['Light fitting', 'Wiring connection', 'Testing', 'Wall mounting'],
      notIncluded: ['Light fixtures', 'Drilling in concrete', 'Ceiling work']
    },
    {
      id: 5,
      name: 'Appliance Repair Service',
      description: 'Expert repair for home appliances - refrigerators, washing machines, ACs, and more.',
      image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop',
      rating: 4.7,
      reviews: 412,
      badge: 'Trusted service',
      duration: '60-90 mins',
      priceRange: '₹299 - ₹599',
      features: ['Tools included', '7-day warranty', 'Verified professional_view'],
      includes: ['Diagnosis', 'Minor repairs', 'Testing', 'Performance check'],
      notIncluded: ['Spare parts', 'Major component replacement', 'Gas refilling']
    },
    {
      id: 6,
      name: 'Inverter / Stabilizer Setup',
      description: 'professional_view installation and maintenance of inverters and voltage stabilizers.',
      image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=300&fit=crop',
      rating: 4.8,
      reviews: 198,
      badge: 'Power backup expert',
      duration: '45-60 mins',
      priceRange: '₹249 - ₹449',
      features: ['Tools included', '7-day warranty', 'Verified professional_view'],
      includes: ['Installation', 'Wiring setup', 'Load testing', 'Battery check'],
      notIncluded: ['Inverter unit', 'Battery', 'Stabilizer unit']
    }
  ];

  const aiRecommended = [
    { id: 1, name: 'Fan Repair', price: '₹199', image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=200&h=150&fit=crop' },
    { id: 2, name: 'Wiring Check', price: '₹149', image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=200&h=150&fit=crop' },
    { id: 3, name: 'Light Installation', price: '₹179', image: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=200&h=150&fit=crop' },
    { id: 4, name: 'Switch Repair', price: '₹129', image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=200&h=150&fit=crop' }
  ];

  const reviews = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      avatar: 'https://i.pravatar.cc/100?img=1',
      rating: 5,
      comment: 'Excellent service! The electrician was professional_view, punctual, and fixed my fan issue perfectly.',
      service: 'Fan Repair',
      time: '2 days ago'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      avatar: 'https://i.pravatar.cc/100?img=2',
      rating: 5,
      comment: 'Very satisfied with the work quality. Great attention to detail and clean execution.',
      service: 'Switchboard Repair',
      time: '1 week ago'
    },
    {
      id: 3,
      name: 'Amit Banerjee',
      avatar: 'https://i.pravatar.cc/100?img=3',
      rating: 5,
      comment: 'Outstanding service! Thorough inspection and clear communication throughout the process.',
      service: 'Wiring Inspection',
      time: '2 weeks ago'
    }
  ];

  const toggleFilter = (filter) => {
    setSelectedFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar
        onNotificationClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
        isNotificationsOpen={isNotificationsOpen}
      />

      {/* 1. CATEGORY HERO SECTION */}
      <section className="mt-[70px] relative min-h-[350px] bg-gradient-to-br from-[#EAF0FF] to-[#F9FBFF] overflow-hidden">
        {/* Background Icon */}
        <div className="absolute right-0 top-0 w-[500px] h-[500px] opacity-[0.08]">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <path d="M100,20 L120,80 L180,80 L130,120 L150,180 L100,140 L50,180 L70,120 L20,80 L80,80 Z" fill="currentColor" className="text-blue-600"/>
          </svg>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-12 md:py-16">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left: Text */}
            <div className="relative z-10">
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 leading-tight">
                professional_view Electrical Services
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 font-medium leading-relaxed">
                Expert electricians for repairs, installations, emergency services, and comprehensive home safety inspections.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm text-black">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-sm">Verified professional_views</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm text-black">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-sm">7-Day Warranty</span>
                </div>
              </div>
            </div>

            {/* Right: Illustration */}
            <div className="relative hidden lg:block">
              <img
                src="https://images.unsplash.com/photo-1621905252472-365c7a5c9e0a?w=600&h=400&fit=crop"
                alt="Electrician"
                className="rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. SEARCH + FILTER BAR */}
      <div className="sticky top-[70px] z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search services: fan repair, wiring, switchboard, appliance repair..."
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm font-medium text-gray-900 placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Sort */}
            <div className="flex gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3.5 border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-semibold cursor-pointer text-gray-700 hover:border-gray-300 transition-colors"
              >
                <option value="recommended">Sort by: Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating: High to Low</option>
              </select>

              <button className="px-6 py-3.5 border-2 border-blue-600 text-blue-600 rounded-full font-bold hover:bg-blue-50 transition-all flex items-center gap-2 hover:shadow-md">
                <SlidersHorizontal className="w-5 h-5" />
                <span className="hidden sm:inline">Filters</span>
              </button>
            </div>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap gap-2 mt-4">
            {filterOptions.map((filter) => (
              <button
                key={filter}
                onClick={() => toggleFilter(filter)}
                className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                  selectedFilters.includes(filter)
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. SUB-CATEGORY CARDS */}
      <section className="bg-gray-50 py-8">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {subCategories.map((cat) => (
              <button
                key={cat.id}
                className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-all group border-2 border-transparent hover:border-blue-200"
              >
                <div className="text-3xl mb-2">{cat.icon}</div>
                <h3 className="text-xs font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {cat.name}
                </h3>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Location Bar */}
      <div className="bg-blue-50 border-y border-blue-100">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-3">
          <button className="flex items-center gap-2 text-sm font-bold text-gray-900 hover:text-blue-600 transition-colors group">
            <MapPin className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
            <span>Service Location: Kolkata, Salt Lake</span>
            <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* 4. MAIN SERVICE LIST */}
      <section className="py-8 md:py-12">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6">
          <div className="space-y-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl shadow-[0_3px_10px_rgba(0,0,0,0.1)] hover:shadow-[0_5px_20px_rgba(0,0,0,0.15)] transition-all overflow-hidden border border-gray-100"
              >
                <div className="grid md:grid-cols-[300px_1fr_auto] gap-6 p-6">
                  {/* Image */}
                  <div className="relative rounded-2xl overflow-hidden h-48 md:h-auto">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>

                  {/* Details */}
                  <div className="flex flex-col justify-between">
                    <div>
                      <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-2">
                        {service.name}
                      </h2>
                      <p className="text-gray-600 font-medium mb-4 leading-relaxed">
                        {service.description}
                      </p>

                      {/* Rating */}
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <div className="flex items-center gap-1 bg-green-50 px-3 py-1 rounded-full">
                          <Star className="w-4 h-4 text-green-600 fill-green-600" />
                          <span className="font-bold text-green-900">{service.rating}</span>
                        </div>
                        <span className="text-sm text-gray-600 font-semibold">
                          ({service.reviews} reviews)
                        </span>
                        <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-bold">
                          {service.badge}
                        </span>
                      </div>

                      {/* Features */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Clock className="w-4 h-4 text-blue-600" />
                          <span className="font-semibold">{service.duration}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Wrench className="w-4 h-4 text-blue-600" />
                          <span className="font-semibold">Tools included</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Shield className="w-4 h-4 text-blue-600" />
                          <span className="font-semibold">7-day warranty</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-blue-600" />
                          <span className="font-semibold">Verified professional_view</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pricing & CTA */}
                  <div className="flex flex-col justify-between items-end min-w-[200px]">
                    <div className="text-right">
                      <div className="text-2xl md:text-3xl font-black text-gray-900 mb-1">
                        {service.priceRange}
                      </div>
                      <p className="text-xs text-gray-500 font-medium">
                        *Final price after inspection
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 w-full">
                      <button
                        onClick={() => router.push('/professional_view')}
                        className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-bold hover:scale-105 transition-all shadow-lg hover:shadow-xl"
                      >
                        Book Now
                      </button>
                      <button
                        onClick={() => setSelectedService(service)}
                        className="w-full px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-full font-bold hover:bg-blue-50 transition-all"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. AI-RECOMMENDED SERVICES */}
      <section className="py-12 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">
                Recommended for You
              </h2>
              <p className="text-gray-600 font-medium">
                AI-powered service recommendations based on your needs
              </p>
            </div>
            <button className="hidden md:flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all">
              See all <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {aiRecommended.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all group"
              >
                <div className="relative h-40">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-2 text-sm">{item.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black text-blue-600">{item.price}</span>
                    <button 
                      onClick={() => router.push(`/search?q=${encodeURIComponent(item.name)}&category=electrical`)}
                      className="px-4 py-1.5 bg-blue-600 text-white text-sm font-bold rounded-full hover:bg-blue-700 transition-colors hover:shadow-md active:scale-95"
                    >
                      Book
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CUSTOMER REVIEWS */}
      <section className="py-12">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">
            Customer Reviews
          </h2>
          <p className="text-gray-600 font-medium mb-8">What our customers are saying</p>

          <div className="grid md:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-2xl p-6 shadow-[0_3px_10px_rgba(0,0,0,0.1)] hover:shadow-[0_5px_20px_rgba(0,0,0,0.15)] transition-all"
              >
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900">{review.name}</h4>
                    <div className="flex items-center gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 font-medium mb-3 leading-relaxed">{review.comment}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500 font-semibold mt-2">
                  <span className="bg-gray-100 px-2 py-1 rounded-md">{review.service}</span>
                  <span>•</span>
                  <span>{review.time}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-full font-bold hover:bg-blue-50 transition-all hover:shadow-md active:scale-95">
              View All Reviews
            </button>
          </div>
        </div>
      </section>

      {/* 9. MOBILE APP PROMO */}
      <section className="py-12 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-white">
              <h2 className="text-3xl md:text-4xl font-black mb-4 leading-tight">
                Book Electricians Faster with Our Mobile App
              </h2>
              <p className="text-xl text-blue-100 mb-6 font-medium leading-relaxed">
                Download our app for instant booking, real-time tracking, and exclusive mobile-only offers.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-black text-white px-6 py-3 rounded-xl font-bold flex items-center gap-3 hover:scale-105 transition-all">
                  <span className="text-2xl">▶</span>
                  <div className="text-left">
                    <div className="text-xs">GET IT ON</div>
                    <div className="text-sm">Google Play</div>
                  </div>
                </button>
                <button className="bg-black text-white px-6 py-3 rounded-xl font-bold flex items-center gap-3 hover:scale-105 transition-all">
                  <span className="text-2xl">🍎</span>
                  <div className="text-left">
                    <div className="text-xs">Download on the</div>
                    <div className="text-sm">App Store</div>
                  </div>
                </button>
              </div>
            </div>
            <div className="relative hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=600&fit=crop"
                alt="Mobile App"
                className="rounded-3xl shadow-2xl mx-auto w-64"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Notifications */}
      <Notifications
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      {/* Service Detail Modal */}
      {selectedService && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-black text-gray-900">{selectedService.name}</h2>
              <button
                onClick={() => setSelectedService(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <img
                src={selectedService.image}
                alt={selectedService.name}
                className="w-full h-64 object-cover rounded-2xl mb-6"
              />

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-black text-gray-900 mb-3">Description</h3>
                  <p className="text-gray-700 font-medium">{selectedService.description}</p>
                </div>

                <div>
                  <h3 className="text-xl font-black text-gray-900 mb-3">What's Included</h3>
                  <ul className="space-y-2">
                    {selectedService.includes.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-gray-700 font-medium">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-black text-gray-900 mb-3">What's NOT Included</h3>
                  <ul className="space-y-2">
                    {selectedService.notIncluded.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-gray-700 font-medium">
                        <X className="w-5 h-5 text-red-600" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-3xl font-black text-gray-900">{selectedService.priceRange}</div>
                      <p className="text-sm text-gray-600 font-medium">*Final price after inspection</p>
                    </div>
                  </div>
                  <button className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-bold text-lg hover:scale-[1.02] transition-all shadow-xl hover:shadow-2xl active:scale-95">
                    Book This Service
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
