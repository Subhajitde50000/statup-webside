'use client';

import React, { useState } from 'react';
import { ArrowLeft, Heart, Phone, MessageCircle, Calendar, Star, CheckCircle, Clock, MapPin, ChevronDown, Award, Briefcase, Zap, Wrench, Lightbulb, Home as HomeIcon, Shield, Settings } from 'lucide-react';
import Link from 'next/link';
import Navbar from '../Component/Navbar';
import Footer from '../Component/Footer';
import Notifications from '../Component/Notifications';
import BookingForm from '../Component/BookingForm';

export default function Professional() {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const professional = {
    name: 'Rahul Das',
    title: 'Electrician',
    certified: true,
    rating: 4.8,
    reviews: 320,
    jobsCompleted: 1450,
    hourlyRate: 299,
    inspectionFee: 149,
    image: 'https://i.pravatar.cc/300?img=12',
    about: 'Rahul has a malaxr.honetonil\'s experience in r.ratting the kow drivim.rt. hite.light experience & switchboard repair. Fo a practure for Light fitting mwa performance and home electrical ano.ronage gaven wiring.',
    expertiseLevel: 'Advanced',
    languages: ['Bengali', 'Hindi', 'English'],
    location: 'Salt Lake, Sector 2, Kolkata',
    serviceRadius: 7,
    distanceFromUser: 1.2
  };

  const skills = [
    { icon: Zap, name: 'Wiring & Rewiring', color: 'text-yellow-600' },
    { icon: Settings, name: 'Switchboard Repair', color: 'text-blue-600' },
    { icon: Lightbulb, name: 'Light Fitting', color: 'text-yellow-500' },
    { icon: Wrench, name: 'Appliance Repair', color: 'text-gray-700' },
    { icon: Shield, name: 'Short Circuit Fix', color: 'text-red-600' },
    { icon: HomeIcon, name: 'Home Electrical Audit', color: 'text-green-600' }
  ];

  const experience = [
    {
      role: 'Senior Electrician',
      company: 'UrbanFix Solutions',
      period: '2019–Present',
      description: 'Handled 1200+ home visits and large wiring projects.'
    },
    {
      role: 'Electrician',
      company: 'HomeCare Services',
      period: '2016–2019',
      description: 'Performed appliance repairs, emergency fault resolution.'
    }
  ];

  const packages = [
    {
      name: 'Fan Repair',
      price: 199,
      features: ['Motor check', 'Vibration fix', 'Blade replacement']
    },
    {
      name: 'Switchboard Installation',
      price: 249,
      features: ['Wiring', 'Socket fitting', 'Testing with tools']
    },
    {
      name: 'Full Home Wiring Check',
      price: 499,
      features: ['Load inspection', 'Safety assessment', 'Fuse & MCB check']
    }
  ];

  const reviews = [
    {
      name: 'Pooja Sharma',
      rating: 5,
      comment: 'Thank you for rating to comness and wearly to service and staller reviews.',
      avatar: 'https://i.pravatar.cc/100?img=1'
    },
    {
      name: 'Dev Raj',
      rating: 5,
      comment: 'Devm Dan was switchboard and bunched as his chalctered number fro in their rning.',
      avatar: 'https://i.pravatar.cc/100?img=2'
    },
    {
      name: 'Ananya Paul',
      rating: 5,
      comment: 'Rahul Das electricted a Home Evolting and really resting.',
      avatar: 'https://i.pravatar.cc/100?img=3'
    }
  ];

  const availability = [
    { day: 'Monday', hours: '10 am - 1:0 pm' },
    { day: 'Tuesday', hours: '10 am - 1:0 pm' },
    { day: 'Wednesday', hours: '10 am - 1:0 pm' },
    { day: 'Thursday', hours: '10 am - 1:0 pm' },
    { day: 'Friday', hours: '10 am - 1:0 pm' }
  ];

  const ratingBreakdown = {
    quality: 4.9,
    timing: 4.8,
    behaviour: 4.9
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        onNotificationClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
        isNotificationsOpen={isNotificationsOpen}
      />

      {/* 1. HEADER SECTION */}
      <div className="fixed top-[70px] left-0 right-0 bg-blue-600 z-40 shadow-lg">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link href="/service" className="flex items-center gap-2 text-white hover:text-blue-100 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-bold hidden sm:inline">Back</span>
          </Link>
          <h1 className="text-lg md:text-xl font-black text-white text-center flex-1">
            {professional.name} — {professional.title}
          </h1>
          <button 
            onClick={() => setIsSaved(!isSaved)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
              isSaved ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <Heart className={`w-5 h-5 ${isSaved ? 'fill-white' : ''}`} />
            <span className="hidden sm:inline font-bold">Save</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-[126px] pb-12">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-[1fr_400px] gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* 2. PROVIDER HERO CARD */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-24"></div>
                <div className="px-6 pb-6">
                  {/* Profile Photo */}
                  <div className="relative -mt-16 mb-4">
                    <div className="w-32 h-32 rounded-full border-4 border-yellow-400 overflow-hidden shadow-xl mx-auto bg-white">
                      <img
                        src={professional.image}
                        alt={professional.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Name + Badge */}
                  <div className="text-center mb-4">
                    <h2 className="text-3xl font-black text-gray-900 mb-2">
                      {professional.name}
                    </h2>
                    {professional.certified && (
                      <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full">
                        <CheckCircle className="w-4 h-4" />
                        <span className="font-bold text-sm">Certified {professional.title}</span>
                      </div>
                    )}
                  </div>

                  {/* Ratings + Jobs */}
                  <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      <span className="font-bold text-gray-900">
                        {professional.rating} ({professional.reviews} reviews)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-bold text-gray-900">
                        {professional.jobsCompleted}+ jobs completed
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-center mb-6">
                    <div className="text-4xl font-black text-blue-600 mb-1">
                      ₹{professional.hourlyRate} / hour
                    </div>
                    <p className="text-gray-600 font-semibold">
                      ₹{professional.inspectionFee} for inspection visit
                      <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">
                        Optional offer
                      </span>
                    </p>
                  </div>

                  {/* 3. QUICK ACTION BUTTONS */}
                  <div className="grid grid-cols-3 gap-3">
                    <button className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 rounded-xl hover:border-blue-600 hover:bg-blue-50 transition-all font-bold text-blue-600">
                      <Phone className="w-5 h-5" />
                      <span className="hidden sm:inline">Call</span>
                    </button>
                    <button className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 rounded-xl hover:border-blue-600 hover:bg-blue-50 transition-all font-bold text-blue-600">
                      <MessageCircle className="w-5 h-5" />
                      <span className="hidden sm:inline">Chat</span>
                    </button>
                    <button className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold shadow-lg col-span-3 sm:col-span-1">
                      <Calendar className="w-5 h-5" />
                      <span>Book Now</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 4. ABOUT THE PROFESSIONAL */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-2xl font-black text-gray-900 mb-4">About the Professional</h3>
                <p className="text-gray-700 leading-relaxed mb-4 font-medium">
                  {professional.about}
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-bold text-gray-900">Expertise Level:</span>
                    <span className="ml-2 text-gray-700 font-semibold">{professional.expertiseLevel}</span>
                  </div>
                  <div>
                    <span className="font-bold text-gray-900">Languages:</span>
                    <span className="ml-2 text-gray-700 font-semibold">{professional.languages.join(', ')}</span>
                  </div>
                </div>
              </div>

              {/* 5. SKILLS & SPECIALIZATIONS */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-2xl font-black text-gray-900 mb-6">Skills & Specializations</h3>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {skills.map((skill, idx) => {
                    const Icon = skill.icon;
                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-4 bg-yellow-50 rounded-xl border-2 border-yellow-200 hover:border-yellow-400 transition-all"
                      >
                        <Icon className={`w-6 h-6 ${skill.color}`} />
                        <span className="font-bold text-gray-900 text-sm">{skill.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 6. EXPERIENCE TIMELINE */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-2xl font-black text-gray-900 mb-6">Experience Timeline</h3>
                <div className="space-y-6">
                  {experience.map((exp, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full ${idx === 0 ? 'bg-blue-600' : 'bg-gray-400'}`}></div>
                        {idx < experience.length - 1 && (
                          <div className="w-0.5 h-full bg-blue-300 mt-2"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-black text-gray-900 text-lg">
                            {exp.role} — {exp.company}
                          </h4>
                          <span className="text-sm text-gray-600 font-semibold whitespace-nowrap ml-2">
                            {exp.period}
                          </span>
                        </div>
                        <p className="text-gray-700 font-medium">{exp.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 7. SERVICE PACKAGES & PRICING */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-black text-gray-900">Service Packages & Pricing</h3>
                  <span className="bg-yellow-400 text-gray-900 px-3 py-1.5 rounded-full text-xs font-black">
                    💰 Save 15%
                  </span>
                </div>
                <p className="text-gray-600 font-medium mb-6">Salve packages reacion on offer services</p>
                <div className="space-y-4">
                  {packages.map((pkg, idx) => (
                    <div key={idx} className="border-2 border-gray-200 rounded-xl p-4 hover:border-blue-400 hover:bg-blue-50 transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-black text-gray-900 text-lg">{pkg.name}</h4>
                        <span className="text-2xl font-black text-blue-600">₹{pkg.price}</span>
                      </div>
                      <ul className="space-y-2">
                        {pkg.features.map((feature, fidx) => (
                          <li key={fidx} className="flex items-center gap-2 text-gray-700 font-medium">
                            <span className="text-yellow-600">●</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* 8. CUSTOMER REVIEWS & RATINGS */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-2xl font-black text-gray-900 mb-2">Customer Reviews & Ratings</h3>
                <p className="text-gray-600 font-medium mb-6">Reviews and 2 ratings</p>

                {/* Summary Bar */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-5xl font-black text-gray-900">{professional.rating}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-6 h-6 ${i < Math.floor(professional.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <p className="text-gray-700 font-bold">{professional.reviews} Reviews</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-black text-gray-900">{ratingBreakdown.quality}</div>
                      <div className="text-xs text-gray-600 font-semibold">Quality</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-black text-gray-900">{ratingBreakdown.timing}</div>
                      <div className="text-xs text-gray-600 font-semibold">Timing</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-black text-gray-900">{ratingBreakdown.behaviour}</div>
                      <div className="text-xs text-gray-600 font-semibold">Behaviour</div>
                    </div>
                  </div>
                </div>

                {/* Review Cards */}
                <div className="space-y-4">
                  {reviews.map((review, idx) => (
                    <div key={idx} className="border-2 border-gray-100 rounded-xl p-4 hover:border-blue-200 transition-all">
                      <div className="flex items-start gap-3 mb-3">
                        <img
                          src={review.avatar}
                          alt={review.name}
                          className="w-12 h-12 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-bold text-gray-900">{review.name}</h4>
                            <div className="flex items-center gap-1">
                              {[...Array(review.rating)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 font-medium">{review.comment}</p>
                    </div>
                  ))}
                </div>

                <button className="w-full mt-6 py-3 border-2 border-blue-600 text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-all">
                  Show All Reviews
                </button>
              </div>

              {/* 9. LOCATION & SERVICE AREA */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-2xl font-black text-gray-900 mb-6">Service Area</h3>
                <div className="bg-gray-200 rounded-xl h-64 mb-4 flex items-center justify-center relative overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=600&h=300&fit=crop"
                    alt="Map"
                    className="w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <MapPin className="w-16 h-16 text-red-600 drop-shadow-lg" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-700 font-semibold">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <span>Service area. Radius: {professional.serviceRadius} km</span>
                  </div>
                  <p className="text-gray-700 font-semibold ml-7">
                    Distance from you: <span className="text-blue-600 font-black">{professional.distanceFromUser} km</span>
                  </p>
                </div>
              </div>

              {/* 10. AVAILABILITY SCHEDULE */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-2xl font-black text-gray-900 mb-6">Availability Schedule</h3>
                <div className="space-y-3">
                  {availability.map((slot, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                      <span className="font-bold text-gray-900">{slot.day}</span>
                      <span className="font-semibold text-blue-600">{slot.hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Booking Form */}
            <BookingForm 
              professionalName={professional.name}
              hourlyRate={professional.hourlyRate}
            />
          </div>
        </div>
      </div>

      <Footer />
      <Notifications
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </div>
  );
}
