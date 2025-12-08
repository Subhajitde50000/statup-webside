'use client';

import React, { useState } from 'react';
import { Star, CheckCircle, Shield, Clock, Award, CreditCard, Users, Phone, Mail, TrendingUp, Zap, MapPin, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Navbar from '../Component/Navbar';
import Footer from '../Component/Footer';
import Notifications from '../Component/Notifications';

export default function Home() {
  const router = useRouter();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [location, setLocation] = useState('');

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <Navbar 
        onNotificationClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
        isNotificationsOpen={isNotificationsOpen}
      />

      {/* 2. HERO SECTION */}
      <section className="mt-[70px] relative min-h-[450px] sm:h-[500px] md:h-[600px] lg:h-[650px] bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-32 sm:w-48 md:w-72 h-32 sm:h-48 md:h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-40 right-10 w-32 sm:w-48 md:w-72 h-32 sm:h-48 md:h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-32 sm:w-48 md:w-72 h-32 sm:h-48 md:h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 h-full flex items-center py-8">
          <div className="relative z-10 w-full lg:max-w-3xl">
            {/* Main Heading */}
            <h1 className="text-[28px] sm:text-4xl md:text-5xl lg:text-[60px] font-black leading-[1.15] sm:leading-[1.1] text-gray-900 mb-3 sm:mb-4 md:mb-6 tracking-tight">
              Hire Trusted Home<br />
              Service Experts <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 animate-gradient bg-[length:200%_auto]">Instantly</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-sm sm:text-base md:text-xl lg:text-2xl text-gray-600 mb-4 sm:mb-6 md:mb-10 leading-relaxed font-medium">
              Electricians, plumbers, cooks, cleaners & drivers at your doorstep in minutes.
            </p>
            
            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 md:gap-8 mb-4 sm:mb-6 md:mb-10">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white shadow-lg"></div>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-white shadow-lg"></div>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 border-2 border-white shadow-lg"></div>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 border-2 border-white shadow-lg flex items-center justify-center text-white text-[10px] sm:text-xs font-bold">10k+</div>
                </div>
                <span className="text-xs sm:text-xs md:text-sm font-bold text-gray-700">Happy Customers</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-xs sm:text-xs md:text-sm font-bold text-gray-700">4.9/5 Rating</span>
              </div>
            </div>

            {/* Search Panel */}
            <div className="bg-white/98 backdrop-blur-md rounded-2xl md:rounded-[28px] shadow-2xl p-4 sm:p-6 md:p-8 w-full max-w-3xl border-2 border-white/50 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30 pointer-events-none"></div>
              <div className="relative z-10">
              <div className="flex flex-col gap-2.5 sm:gap-3 md:gap-4">
                {/* Service Category Dropdown */}
                <div className="flex-1">
                  <select 
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-gray-200 rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 font-bold bg-white hover:border-gray-300 transition-all cursor-pointer shadow-sm hover:shadow-md text-sm md:text-base"
                  >
                    <option value="">Select Service: Electrical, Plumbing, Cleaning, Cooking…</option>
                    <option value="Electrical Services">⚡ Electrical Services</option>
                    <option value="Plumbing Services">🔧 Plumbing Services</option>
                    <option value="Housekeeping">🧹 Housekeeping</option>
                    <option value="Cooking Services">👨‍🍳 Cooking Services</option>
                    <option value="Driving Services">🚗 Driving Services</option>
                  </select>
                </div>

                {/* Location Field */}
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter your location"
                    className="w-full pl-10 sm:pl-12 pr-4 sm:pr-5 py-3 sm:py-4 border-2 border-gray-200 rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white hover:border-gray-300 transition-all font-bold text-gray-700 shadow-sm hover:shadow-md text-sm md:text-base"
                  />
                </div>

                {/* Search Button */}
                <button 
                  onClick={() => {
                    const searchQuery = selectedService || 'service';
                    router.push(`/search?q=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(location || 'Salt Lake, Kolkata')}`);
                  }}
                  className="w-full px-6 py-3 sm:py-3.5 md:py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-[length:200%_auto] hover:bg-right text-white font-bold rounded-xl md:rounded-2xl hover:shadow-2xl active:scale-95 md:hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-xl group text-sm md:text-base"
                >
                  Search Now
                  <Search className="w-4 h-4 md:w-5 md:h-5 group-hover:rotate-90 transition-transform duration-300" />
                </button>
              </div>

              {/* Success Counter */}
              <div className="mt-4 sm:mt-6 flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600 bg-green-50/50 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-green-100">
                <div className="p-1 bg-green-100 rounded-lg flex-shrink-0">
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
                </div>
                <span className="leading-tight"><span className="font-bold text-gray-900">50,000+</span> successful services delivered this month</span>
              </div>
              </div>
            </div>
          </div>

          {/* Background Image Collage */}
          <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-1/2 opacity-40">
            <div className="grid grid-cols-2 gap-4 h-full p-8">
              <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl overflow-hidden flex items-center justify-center">
                <img src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=400&fit=crop" alt="Electrician" className="w-full h-full object-cover" />
              </div>
              <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-3xl overflow-hidden flex items-center justify-center">
                <img src="https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&h=400&fit=crop" alt="Plumber" className="w-full h-full object-cover" />
              </div>
              <div className="bg-gradient-to-br from-pink-400 to-pink-600 rounded-3xl overflow-hidden flex items-center justify-center">
                <img src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=400&fit=crop" alt="Cleaner" className="w-full h-full object-cover" />
              </div>
              <div className="bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-3xl overflow-hidden flex items-center justify-center">
                <img src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&h=400&fit=crop" alt="Cook" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-8 md:py-12 bg-white border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <div className="text-center group cursor-pointer">
              <div className="flex items-center justify-center mb-2 md:mb-3">
                <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-blue-600 group-hover:scale-125 transition-transform" />
              </div>
              <div className="text-xl sm:text-2xl md:text-4xl font-black text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">50K+</div>
              <div className="text-[10px] sm:text-xs md:text-sm font-semibold text-gray-600 px-2">Services Completed</div>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="flex items-center justify-center mb-2 md:mb-3">
                <Users className="w-6 h-6 md:w-8 md:h-8 text-purple-600 group-hover:scale-125 transition-transform" />
              </div>
              <div className="text-xl sm:text-2xl md:text-4xl font-black text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">2,500+</div>
              <div className="text-[10px] sm:text-xs md:text-sm font-semibold text-gray-600 px-2">Verified professional_views</div>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="flex items-center justify-center mb-2 md:mb-3">
                <Star className="w-6 h-6 md:w-8 md:h-8 text-yellow-500 group-hover:scale-125 transition-transform fill-yellow-500" />
              </div>
              <div className="text-xl sm:text-2xl md:text-4xl font-black text-gray-900 mb-1 group-hover:text-yellow-600 transition-colors">4.9/5</div>
              <div className="text-[10px] sm:text-xs md:text-sm font-semibold text-gray-600 px-2">Average Rating</div>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="flex items-center justify-center mb-2 md:mb-3">
                <Zap className="w-6 h-6 md:w-8 md:h-8 text-orange-600 group-hover:scale-125 transition-transform" />
              </div>
              <div className="text-xl sm:text-2xl md:text-4xl font-black text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">30 Min</div>
              <div className="text-[10px] sm:text-xs md:text-sm font-semibold text-gray-600 px-2">Avg. Response Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SERVICE CATEGORY GRID */}
      <section className="py-12 md:py-20 lg:py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-3 md:mb-4 text-center tracking-tight">Book By Category</h2>
          <p className="text-center text-gray-600 text-base md:text-lg mb-10 md:mb-16 max-w-2xl mx-auto">Choose from our wide range of professional_view home services</p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {/* Electrical */}
            <div className="group bg-white rounded-2xl md:rounded-[24px] p-5 sm:p-6 md:p-8 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer active:scale-95 md:hover:-translate-y-3 border-2 border-gray-100 hover:border-blue-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-100 to-yellow-200 opacity-0 group-hover:opacity-20 rounded-full blur-2xl transition-opacity"></div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl md:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 md:mb-5 group-hover:scale-125 group-hover:rotate-6 transition-all shadow-sm group-hover:shadow-lg">
                <span className="text-2xl sm:text-2xl md:text-3xl">⚡</span>
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-black text-gray-900 mb-1.5 sm:mb-2 group-hover:text-blue-600 transition-colors">Electrical</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">Rewiring, short circuits, appliance repair</p>
              <div className="mt-3 sm:mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] sm:text-xs font-bold text-blue-600 flex items-center gap-1">
                  View Services <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </div>
            </div>

            {/* Plumbing */}
            <div className="group bg-white rounded-[24px] p-8 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-3 border border-gray-100 hover:border-blue-200">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-sm">
                <span className="text-3xl">🔧</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">Plumbing</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Leak fixing, pipe repair, bathroom fittings</p>
            </div>

            {/* Housekeeping */}
            <div className="group bg-white rounded-[24px] p-8 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-3 border border-gray-100 hover:border-blue-200">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-sm">
                <span className="text-3xl">🧹</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">Housekeeping</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Cleaning, laundry, ironing</p>
            </div>

            {/* Cooking */}
            <div className="group bg-white rounded-[24px] p-8 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-3 border border-gray-100 hover:border-blue-200">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-sm">
                <span className="text-3xl">👨‍🍳</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">Cooking</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Home cooks, meal prep, catering</p>
            </div>

            {/* Driving */}
            <div className="group bg-white rounded-[24px] p-8 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-3 border border-gray-100 hover:border-blue-200">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-sm">
                <span className="text-3xl">🚗</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">Driving</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Chauffeur, pickup-drop services</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ONE-TAP QUICK SERVICES */}
      <section className="py-12 md:py-20 lg:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 md:mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-2 tracking-tight">Book in One Tap</h2>
              <p className="text-gray-600 text-sm md:text-lg">Fast booking for urgent needs</p>
            </div>
            <div className="flex gap-3">
              <button className="p-3 rounded-full bg-white shadow-md hover:bg-blue-600 hover:text-white transition-all w-10 h-10 flex items-center justify-center hover:scale-110">←</button>
              <button className="p-3 rounded-full bg-white shadow-md hover:bg-blue-600 hover:text-white transition-all w-10 h-10 flex items-center justify-center hover:scale-110">→</button>
            </div>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {[
              { title: 'Emergency Electrician', subtitle: '30 Min Arrival', gradient: 'from-red-500 to-orange-500', emoji: '⚡' },
              { title: 'Quick Plumber', subtitle: 'Fix Leaks', gradient: 'from-blue-500 to-cyan-500', emoji: '🔧' },
              { title: 'Home Deep Cleaning', subtitle: 'Full Service', gradient: 'from-green-500 to-emerald-500', emoji: '🧹' },
              { title: 'Driver for 4 Hours', subtitle: 'Local Trips', gradient: 'from-purple-500 to-pink-500', emoji: '🚗' },
              { title: 'Cook for Tonight', subtitle: 'Fresh Meals', gradient: 'from-orange-500 to-yellow-500', emoji: '👨‍🍳' },
              { title: 'AC Repair', subtitle: 'Same Day', gradient: 'from-indigo-500 to-blue-500', emoji: '❄️' }
            ].map((service, idx) => (
              <div key={idx} className={`min-w-[240px] sm:min-w-[280px] md:min-w-[300px] bg-gradient-to-br ${service.gradient} rounded-2xl md:rounded-[24px] p-5 sm:p-6 md:p-7 text-white shadow-xl active:scale-95 md:hover:scale-105 hover:shadow-2xl transition-all cursor-pointer`}>
                <div className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4">{service.emoji}</div>
                <h3 className="text-lg sm:text-xl font-bold mb-1.5 sm:mb-2">{service.title}</h3>
                <p className="text-xs sm:text-sm opacity-90 font-medium">{service.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FEATURED professional_viewS */}
      <section className="py-12 md:py-20 lg:py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-3 md:mb-4 text-center tracking-tight">Top Rated professional_views Near You</h2>
          <p className="text-center text-gray-600 text-base md:text-lg mb-10 md:mb-16 max-w-2xl mx-auto">Verified experts with exceptional ratings and reviews</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              { name: 'Suman Das', role: 'Electrician', rating: 4.9, reviews: 320, desc: 'Expert in wiring, fan repair, switchboards; 8+ years experience', price: 199 },
              { name: 'Rajesh Kumar', role: 'Plumber', rating: 4.8, reviews: 285, desc: 'Specialist in leak detection, bathroom fittings; 6+ years', price: 179 },
              { name: 'Priya Sharma', role: 'House Cleaner', rating: 5.0, reviews: 412, desc: 'Deep cleaning expert, eco-friendly products; 5+ years', price: 149 },
              { name: 'Amit Singh', role: 'Cook', rating: 4.7, reviews: 198, desc: 'Multi-cuisine expert, hygiene certified; 7+ years', price: 299 },
              { name: 'Rahul Verma', role: 'Driver', rating: 4.9, reviews: 356, desc: 'Safe driver, city expert, punctual; 10+ years', price: 250 },
              { name: 'Anita Roy', role: 'Housekeeper', rating: 4.8, reviews: 267, desc: 'Full home management, laundry expert; 4+ years', price: 169 }
            ].map((pro, idx) => (
              <div key={idx} className="bg-white rounded-2xl md:rounded-[24px] shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden active:scale-95 md:hover:-translate-y-3 border border-gray-100">
                <div className="h-44 sm:h-48 md:h-56 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute top-3 right-3 md:top-4 md:right-4 bg-white px-2 py-1 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-bold text-gray-700 shadow-md">Top Rated</div>
                  <img 
                    src={`https://i.pravatar.cc/300?img=${idx + 1}`} 
                    alt={pro.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 sm:p-5 md:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">{pro.name}</h3>
                  <p className="text-blue-600 font-medium mb-2 text-sm sm:text-base">{pro.role}</p>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-sm sm:text-base">{pro.rating}</span>
                    </div>
                    <span className="text-xs sm:text-sm text-gray-500">({pro.reviews} reviews)</span>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2">{pro.desc}</p>

                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div>
                      <span className="text-xl sm:text-2xl font-bold text-gray-900">₹{pro.price}</span>
                      <span className="text-xs sm:text-sm text-gray-500">/hour</span>
                      <p className="text-[10px] sm:text-xs text-green-600">No additional visit fees</p>
                    </div>
                  </div>

                  <div className="flex gap-2 sm:gap-3">
                    <button 
                      onClick={() => router.push('/professional_view')}
                      className="flex-1 py-2 sm:py-2.5 md:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl font-semibold hover:bg-gray-50 hover:border-blue-600 transition-all text-xs sm:text-sm md:text-base"
                    >
                      View Profile
                    </button>
                    <button 
                      onClick={() => router.push('/professional_view')}
                      className="flex-1 py-2 sm:py-2.5 md:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg sm:rounded-xl font-bold active:scale-95 md:hover:shadow-xl md:hover:scale-105 transition-all text-xs sm:text-sm md:text-base"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. TRUST & SAFETY SECTION */}
      <section className="py-12 md:py-20 lg:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-3 md:mb-4 text-center tracking-tight">Trust & Safety</h2>
          <p className="text-center text-gray-600 text-base md:text-lg mb-10 md:mb-16 max-w-2xl mx-auto">Your safety and satisfaction are our top priorities</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="flex items-start gap-4 bg-white p-7 rounded-2xl shadow-md hover:shadow-xl transition-all border border-gray-100">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                <Shield className="w-7 h-7 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Background-verified experts</h3>
                <p className="text-sm text-gray-600 leading-relaxed">All professional_views undergo thorough background checks</p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white p-6 rounded-2xl shadow-md">
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-7 h-7 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Fixed pricing — no overcharging</h3>
                <p className="text-sm text-gray-600">Transparent pricing with no hidden charges</p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white p-6 rounded-2xl shadow-md">
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Award className="w-7 h-7 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Money-back guarantee</h3>
                <p className="text-sm text-gray-600">100% satisfaction or full refund</p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white p-6 rounded-2xl shadow-md">
              <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Clock className="w-7 h-7 text-orange-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">24/7 customer support</h3>
                <p className="text-sm text-gray-600">Round-the-clock assistance for any issues</p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white p-6 rounded-2xl shadow-md">
              <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Users className="w-7 h-7 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">5+ layers of identity verification</h3>
                <p className="text-sm text-gray-600">Multi-step verification for your safety</p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white p-6 rounded-2xl shadow-md">
              <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-7 h-7 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Secure digital payments</h3>
                <p className="text-sm text-gray-600">Encrypted transactions with multiple payment options</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CUSTOMER REVIEWS CAROUSEL */}
      <section className="py-12 md:py-20 lg:py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-3 md:mb-4 text-center tracking-tight">What Our Customers Say</h2>
          <p className="text-center text-gray-600 text-base md:text-lg mb-10 md:mb-16 max-w-2xl mx-auto">Real experiences from our satisfied customers</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              { name: 'Suman Das', location: 'Electrician', review: 'The electrician arrived in 38 minutes and fixed sockets drop if I needed anything...', rating: 4.9, reviews: '320 reviews' },
              { name: 'Erys Sharma', location: 'Electrician', review: 'The electrician arrived in 30 minutes and fixed the issue perfectly. Highly professional_view!', rating: 4.9, reviews: '320 reviews', price: '₹199/hour' },
              { name: 'Amit Gupta', location: 'New Town', review: 'Amazing service! The plumber was very skilled and completed the work efficiently.', rating: 4.8, reviews: '285 reviews' }
            ].map((review, idx) => (
              <div key={idx} className="bg-white rounded-[24px] shadow-lg p-8 border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all">
                <div className="flex items-center gap-4 mb-5">
                  <img 
                    src={`https://i.pravatar.cc/150?img=${idx + 10}`}
                    alt={review.name}
                    className="w-14 h-14 rounded-full object-cover shadow-md"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">{review.name}</h4>
                    <p className="text-sm text-gray-500">{review.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">{review.rating}</span>
                </div>

                <p className="text-gray-700 leading-relaxed">"{review.review}"</p>
                
                {review.price && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <span className="text-lg font-bold text-gray-900">{review.price}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. DOWNLOAD THE APP SECTION */}
      <section className="py-12 md:py-20 lg:py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-purple-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-0">
            {/* Left - Mobile Mockup */}
            <div className="w-full lg:w-1/2 flex justify-center order-2 lg:order-1">
              <div className="relative">
                <div className="w-[300px] h-[600px] bg-gray-900 rounded-[50px] shadow-2xl p-3 border-8 border-gray-800 relative">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-gray-900 rounded-b-3xl z-10"></div>
                  {/* Screen Content */}
                  <div className="w-full h-full bg-white rounded-[42px] overflow-hidden relative">
                    <img 
                      src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&h=600&fit=crop" 
                      alt="App Screenshot"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-purple-600/90 flex flex-col items-center justify-center p-6">
                      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 w-full">
                        <div className="text-white text-center">
                          <div className="text-3xl font-black mb-2">HomeExpert</div>
                          <div className="text-sm mb-4">Book Services Instantly</div>
                          <div className="grid grid-cols-2 gap-2 mb-4">
                            <div className="bg-white/20 rounded-xl p-3">
                              <div className="text-2xl mb-1">⚡</div>
                              <div className="text-xs font-bold">Electrical</div>
                            </div>
                            <div className="bg-white/20 rounded-xl p-3">
                              <div className="text-2xl mb-1">🔧</div>
                              <div className="text-xs font-bold">Plumbing</div>
                            </div>
                            <div className="bg-white/20 rounded-xl p-3">
                              <div className="text-2xl mb-1">🧹</div>
                              <div className="text-xs font-bold">Cleaning</div>
                            </div>
                            <div className="bg-white/20 rounded-xl p-3">
                              <div className="text-2xl mb-1">👨‍🍳</div>
                              <div className="text-xs font-bold">Cooking</div>
                            </div>
                          </div>
                          <button 
                            onClick={() => router.push('/professional_view')}
                            className="w-full py-2 bg-white text-blue-600 rounded-full font-bold text-sm"
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Content */}
            <div className="w-full lg:w-1/2 text-white text-center lg:text-left order-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 md:mb-6 leading-tight tracking-tight">
                Hire professional_views anytime, anywhere.
              </h2>
              <p className="text-lg md:text-xl mb-6 md:mb-10 opacity-95 leading-relaxed">
                Get exclusive app-only discounts and priority booking.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start">
                <button className="px-7 py-4 bg-black rounded-xl flex items-center gap-3 hover:bg-gray-900 hover:scale-105 transition-all shadow-xl hover:shadow-2xl">
                  <span className="text-3xl">▶</span>
                  <div className="text-left">
                    <div className="text-xs opacity-75 font-medium">GET IT ON</div>
                    <div className="text-lg font-bold">Google Play</div>
                  </div>
                </button>

                <button className="px-7 py-4 bg-black rounded-xl flex items-center gap-3 hover:bg-gray-900 hover:scale-105 transition-all shadow-xl hover:shadow-2xl">
                  <span className="text-3xl">🍎</span>
                  <div className="text-left">
                    <div className="text-xs opacity-75 font-medium">Download on the</div>
                    <div className="text-lg font-bold">App Store</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. POPULAR SERVICE AREAS */}
      <section className="py-12 md:py-20 lg:py-24 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-3 md:mb-4 text-center tracking-tight">Popular in Your City</h2>
          <p className="text-center text-gray-600 text-base md:text-lg mb-8 md:mb-12 max-w-2xl mx-auto">Quick access to services in popular locations</p>
          
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              'Electricians in Salt Lake',
              'Plumbers in New Town',
              'Cleaners in Howrah',
              'Drivers in Garia',
              'Cooks in Behala',
              'Electricians in Park Street',
              'Plumbers in Ballygunge',
              'Cleaners in Alipore',
              'Drivers in Jadavpur',
              'Cooks in Tollygunge'
            ].map((area, idx) => (
              <button key={idx} className="px-6 py-3 bg-white rounded-full border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 hover:shadow-md transition-all text-gray-700 font-semibold hover:scale-105">
                {area}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT CTA SECTION */}
      <section className="py-12 md:py-20 lg:py-24 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4wNSIvPjwvZz48L3N2Zz4=')] opacity-10"></div>
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 md:mb-6 tracking-tight">Need Help? We're Here 24/7</h2>
            <p className="text-lg md:text-xl text-white/90 mb-6 md:mb-10 font-medium leading-relaxed">Get in touch with our expert team for any queries or immediate assistance</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
              <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-gray-900 rounded-full font-bold active:scale-95 md:hover:scale-105 transition-all shadow-2xl flex items-center justify-center gap-2 sm:gap-3 group text-sm md:text-base">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform" />
                Call Us Now
              </button>
              <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-sm border-2 border-white/50 text-white rounded-full font-bold hover:bg-white hover:text-gray-900 transition-all shadow-2xl flex items-center justify-center gap-2 sm:gap-3 group text-sm md:text-base">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                Email Support
              </button>
            </div>
            <div className="mt-8 sm:mt-10 md:mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8">
              <div className="text-center">
                <div className="text-lg sm:text-xl md:text-2xl font-black text-white mb-1">Response Time</div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-black text-blue-300">&lt; 2 Min</div>
              </div>
              <div className="w-16 sm:w-px h-px sm:h-16 bg-white/20"></div>
              <div className="text-center">
                <div className="text-lg sm:text-xl md:text-2xl font-black text-white mb-1">Support Available</div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-black text-purple-300">24/7</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FOOTER */}
      <Footer />

      {/* Notifications Panel */}
      <Notifications 
        isOpen={isNotificationsOpen} 
        onClose={() => setIsNotificationsOpen(false)} 
      />
    </div>
  );
}