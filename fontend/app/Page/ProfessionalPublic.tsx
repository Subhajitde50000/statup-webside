'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  ArrowLeft, Heart, Phone, MessageCircle, Calendar, Star, CheckCircle, Clock, 
  MapPin, Award, Briefcase, Zap, Shield, User, Loader2, AlertCircle,
  Globe, BadgeCheck, ChevronRight, Wrench, IndianRupee, DollarSign, Share2,
  Mail, Building, CalendarDays, TrendingUp, ThumbsUp, FileText, Camera,
  MapPinned
} from 'lucide-react';
import Link from 'next/link';
import Navbar from '../Component/Navbar';
import Footer from '../Component/Footer';
import Notifications from '../Component/Notifications';
import PriceOfferModal from '../Component/PriceOfferModal';
import FavoriteButton from '../Component/FavoriteButton';
import { getProfessionalPublicProfile } from '../../utils/services';

const SKILL_ICONS = {
  'Wiring': Zap,
  'Rewiring': Zap,
  'Electrical': Zap,
  'Plumbing': Wrench,
  'Repair': Wrench,
  'Installation': Wrench,
  'default': Wrench
};

const getSkillIcon = (skillName: string) => {
  for (const [key, icon] of Object.entries(SKILL_ICONS)) {
    if (skillName.toLowerCase().includes(key.toLowerCase())) {
      return icon;
    }
  }
  return SKILL_ICONS.default;
};

export default function ProfessionalPublic() {
  const searchParams = useSearchParams();
  const professionalId = searchParams.get('id');
  
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [professional, setProfessional] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [isPriceOfferModalOpen, setIsPriceOfferModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'about' | 'services' | 'reviews'>('about');

  useEffect(() => {
    const fetchProfessionalData = async () => {
      if (!professionalId) {
        setError('Professional ID not provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await getProfessionalPublicProfile(professionalId);
        setProfessional(response.professional);
        
        try {
          const servicesRes = await fetch(`http://localhost:8000/api/services?professional_id=${professionalId}&limit=10`);
          if (servicesRes.ok) {
            const servicesData = await servicesRes.json();
            setServices(servicesData.services || []);
          }
        } catch (err) {
          console.error('Error fetching services:', err);
        }
        
      } catch (err: any) {
        console.error('Error fetching professional:', err);
        setError(err.message || 'Failed to load professional profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionalData();
  }, [professionalId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Loading professional profile...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !professional) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
            <p className="text-gray-600 mb-6">{error || 'The professional profile you are looking for could not be found.'}</p>
            <Link 
              href="/service"
              className="inline-flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-teal-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Services
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const formatTime = (time: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareData = {
      title: `${professional.name} - Professional Service`,
      text: `Check out ${professional.name}'s profile${professional.category ? ` - ${professional.category}` : ''}`,
      url: shareUrl
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard!');
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        try {
          await navigator.clipboard.writeText(shareUrl);
          alert('Link copied to clipboard!');
        } catch (clipboardError) {
          console.error('Share failed:', clipboardError);
        }
      }
    }
  };

  const completionPercentage = () => {
    let total = 0;
    let completed = 0;
    
    const fields = [
      professional.bio,
      professional.skills?.length > 0,
      professional.certifications?.length > 0,
      professional.service_areas?.length > 0,
      professional.languages?.length > 0,
      professional.hourly_rate,
      professional.working_hours_start,
      professional.profile_image
    ];
    
    fields.forEach(field => {
      total++;
      if (field) completed++;
    });
    
    return Math.round((completed / total) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50">
      <Navbar
        onNotificationClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
        isNotificationsOpen={isNotificationsOpen}
      />

      {/* Header Banner */}
      <div className="fixed top-[70px] left-0 right-0 bg-gradient-to-r from-teal-600 to-green-600 z-40 shadow-lg">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link href="/service" className="flex items-center gap-2 text-white hover:text-teal-100 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-bold hidden sm:inline">Back</span>
          </Link>
          <h1 className="text-lg md:text-xl font-black text-white text-center flex-1 truncate px-4">
            {professional.name} {professional.category && `- ${professional.category}`}
          </h1>
          <div className="flex items-center gap-2">
            <FavoriteButton 
              key={`fav-${professionalId}`}
              professionalId={professionalId}
              size="md"
            />
          </div>
        </div>
      </div>

      <div className="pt-[126px] pb-12">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            {/* Profile Header Card */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-6">
              {/* Cover Image */}
              <div className="bg-gradient-to-r from-teal-500 via-green-500 to-emerald-500 h-32 md:h-40 relative">
                <div className="absolute inset-0 bg-black/10"></div>
              </div>

              {/* Profile Info */}
              <div className="px-6 md:px-8 pb-6">
                <div className="relative -mt-20 md:-mt-24 mb-4">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white overflow-hidden shadow-2xl mx-auto bg-gradient-to-br from-teal-500 to-green-600">
                    {professional.profile_image ? (
                      <img
                        src={professional.profile_image.startsWith('http') ? professional.profile_image : `http://localhost:8000${professional.profile_image}`}
                        alt={professional.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-16 h-16 md:w-20 md:h-20 text-white" />
                      </div>
                    )}
                  </div>
                  {professional.is_verified && (
                    <div className="absolute bottom-2 right-1/2 translate-x-1/2 translate-y-1/2 bg-green-500 rounded-full p-2.5 border-4 border-white shadow-lg">
                      <BadgeCheck className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>

                {/* Name and Title */}
                <div className="text-center mb-6">
                  <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
                    {professional.name}
                  </h2>
                  
                  {/* Status Badges */}
                  <div className="flex items-center justify-center gap-2 flex-wrap mb-4">
                    {professional.is_verified && (
                      <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full border-2 border-green-300">
                        <BadgeCheck className="w-5 h-5" />
                        <span className="font-bold text-sm">Verified Pro</span>
                      </span>
                    )}
                    {professional.category && (
                      <span className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-4 py-2 rounded-full border-2 border-teal-300">
                        <Briefcase className="w-5 h-5" />
                        <span className="font-bold text-sm">{professional.category}</span>
                      </span>
                    )}
                    {professional.emergency_available && (
                      <span className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full border-2 border-red-300 animate-pulse">
                        <Zap className="w-5 h-5" />
                        <span className="font-bold text-sm">24/7 Available</span>
                      </span>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
                    <div className="flex items-center gap-2 bg-yellow-50 px-5 py-3 rounded-xl border-2 border-yellow-200">
                      <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                      <div className="text-left">
                        <span className="font-black text-gray-900 text-lg">
                          {(professional.rating || 4.5).toFixed(1)}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">({professional.total_reviews || 0})</span>
                      </div>
                    </div>
                    {professional.total_bookings > 0 && (
                      <div className="flex items-center gap-2 bg-green-50 px-5 py-3 rounded-xl border-2 border-green-200">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                        <span className="font-black text-gray-900">
                          {professional.total_bookings}+ Jobs
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 bg-purple-50 px-5 py-3 rounded-xl border-2 border-purple-200">
                      <TrendingUp className="w-6 h-6 text-purple-600" />
                      <span className="font-black text-gray-900">
                        {completionPercentage()}% Complete
                      </span>
                    </div>
                  </div>

                  {/* Pricing */}
                  {professional.hourly_rate && (
                    <div className="bg-gradient-to-r from-teal-50 to-green-50 border-2 border-teal-200 rounded-2xl p-4 mb-6">
                      <div className="text-4xl md:text-5xl font-black text-teal-600 mb-1 flex items-center justify-center gap-2">
                        <IndianRupee className="w-8 h-8 md:w-10 md:h-10" />
                        {professional.hourly_rate}
                        <span className="text-2xl text-gray-600">/ hour</span>
                      </div>
                      <p className="text-gray-600 font-medium text-sm">Starting price • Final cost depends on project requirements</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {professional.phone && (
                      <a 
                        href={`tel:${professional.phone}`}
                        className="flex flex-col md:flex-row items-center justify-center gap-2 px-4 py-3 border-2 border-teal-200 rounded-xl hover:border-teal-600 hover:bg-teal-50 transition-all font-bold text-teal-600"
                      >
                        <Phone className="w-5 h-5" />
                        <span className="text-sm">Call</span>
                      </a>
                    )}
                    {professional.email && (
                      <a
                        href={`mailto:${professional.email}`}
                        className="flex flex-col md:flex-row items-center justify-center gap-2 px-4 py-3 border-2 border-teal-200 rounded-xl hover:border-teal-600 hover:bg-teal-50 transition-all font-bold text-teal-600"
                      >
                        <Mail className="w-5 h-5" />
                        <span className="text-sm">Email</span>
                      </a>
                    )}
                    <Link
                      href={`/messages/${professionalId}`}
                      className="flex flex-col md:flex-row items-center justify-center gap-2 px-4 py-3 border-2 border-teal-200 rounded-xl hover:border-teal-600 hover:bg-teal-50 transition-all font-bold text-teal-600"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm">Chat</span>
                    </Link>
                    <button
                      onClick={handleShare}
                      className="flex flex-col md:flex-row items-center justify-center gap-2 px-4 py-3 border-2 border-purple-200 rounded-xl hover:border-purple-600 hover:bg-purple-50 transition-all font-bold text-purple-600"
                      title="Share profile"
                    >
                      <Share2 className="w-5 h-5" />
                      <span className="text-sm">Share</span>
                    </button>
                    <button
                      onClick={() => setIsPriceOfferModalOpen(true)}
                      className="flex flex-col md:flex-row items-center justify-center gap-2 px-4 py-3 border-2 border-orange-600 rounded-xl hover:bg-orange-600 hover:text-white transition-all font-bold text-orange-600 col-span-2 md:col-span-5"
                    >
                      <DollarSign className="w-5 h-5" />
                      <span>Make Price Offer</span>
                    </button>
                    <Link
                      href={`/booking-flow/${professionalId}`}
                      className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-teal-600 to-green-600 text-white rounded-xl hover:from-teal-700 hover:to-green-700 transition-all font-bold shadow-lg hover:shadow-xl col-span-2 md:col-span-5 text-lg"
                    >
                      <Calendar className="w-6 h-6" />
                      <span>Book Appointment Now</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white rounded-2xl shadow-lg p-2 mb-6 sticky top-[136px] z-30">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('about')}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold transition-all ${
                    activeTab === 'about'
                      ? 'bg-gradient-to-r from-teal-600 to-green-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span>About</span>
                </button>
                <button
                  onClick={() => setActiveTab('services')}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold transition-all ${
                    activeTab === 'services'
                      ? 'bg-gradient-to-r from-teal-600 to-green-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Wrench className="w-5 h-5" />
                  <span>Services ({services.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold transition-all ${
                    activeTab === 'reviews'
                      ? 'bg-gradient-to-r from-teal-600 to-green-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Star className="w-5 h-5" />
                  <span>Reviews ({professional.total_reviews || 0})</span>
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {activeTab === 'about' && (
                <>
                  {/* Professional Summary */}
                  <div className="bg-gradient-to-br from-teal-50 via-green-50 to-emerald-50 rounded-2xl shadow-lg p-6 md:p-8 border-2 border-teal-200">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="bg-gradient-to-br from-teal-600 to-green-600 p-4 rounded-xl shadow-lg">
                        <User className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-gray-900">Professional Overview</h3>
                        <p className="text-sm text-gray-600">Everything you need to know about this professional</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-white p-5 rounded-xl border-2 border-teal-200 text-center">
                        <div className="text-3xl font-black text-teal-600 mb-1">
                          {professional.total_bookings || 0}+
                        </div>
                        <p className="text-sm font-bold text-gray-600">Jobs Completed</p>
                      </div>
                      <div className="bg-white p-5 rounded-xl border-2 border-yellow-200 text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Star className="w-7 h-7 text-yellow-400 fill-yellow-400" />
                          <span className="text-3xl font-black text-yellow-600">
                            {(professional.rating || 4.5).toFixed(1)}
                          </span>
                        </div>
                        <p className="text-sm font-bold text-gray-600">Average Rating</p>
                      </div>
                      <div className="bg-white p-5 rounded-xl border-2 border-green-200 text-center">
                        <div className="text-3xl font-black text-green-600 mb-1">
                          {completionPercentage()}%
                        </div>
                        <p className="text-sm font-bold text-gray-600">Profile Complete</p>
                      </div>
                    </div>

                    {/* Key Highlights */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-xl border-2 border-teal-100">
                        <div className="flex items-center gap-3 mb-2">
                          <Shield className="w-6 h-6 text-teal-600" />
                          <span className="font-bold text-gray-900">Verified & Trusted</span>
                        </div>
                        <p className="text-sm text-gray-600">Background verified and identity confirmed</p>
                      </div>
                      <div className="bg-white p-4 rounded-xl border-2 border-green-100">
                        <div className="flex items-center gap-3 mb-2">
                          <ThumbsUp className="w-6 h-6 text-green-600" />
                          <span className="font-bold text-gray-900">Fast Response</span>
                        </div>
                        <p className="text-sm text-gray-600">Typically responds within 2 hours</p>
                      </div>
                      {professional.emergency_available && (
                        <div className="bg-white p-4 rounded-xl border-2 border-red-100">
                          <div className="flex items-center gap-3 mb-2">
                            <Zap className="w-6 h-6 text-red-600" />
                            <span className="font-bold text-gray-900">24/7 Emergency</span>
                          </div>
                          <p className="text-sm text-gray-600">Available for urgent service requests</p>
                        </div>
                      )}
                      <div className="bg-white p-4 rounded-xl border-2 border-purple-100">
                        <div className="flex items-center gap-3 mb-2">
                          <Award className="w-6 h-6 text-purple-600" />
                          <span className="font-bold text-gray-900">Quality Assured</span>
                        </div>
                        <p className="text-sm text-gray-600">All work comes with service guarantee</p>
                      </div>
                    </div>
                  </div>

                  {/* Bio Section */}
                  {professional.bio && (
                    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200">
                        <div className="bg-gradient-to-br from-teal-500 to-green-600 p-3 rounded-xl shadow-lg">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-black text-gray-900">About {professional.name}</h3>
                          <p className="text-sm text-gray-500">Professional background & expertise</p>
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed font-medium whitespace-pre-wrap text-lg mb-6">
                        {professional.bio}
                      </p>
                      
                      {/* Why Choose Me */}
                      <div className="bg-gradient-to-r from-teal-50 to-green-50 p-6 rounded-xl border-2 border-teal-200 mb-6">
                        <h4 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                          <CheckCircle className="w-6 h-6 text-teal-600" />
                          Why Choose Me?
                        </h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-teal-600 rounded-full mt-2"></div>
                            <div>
                              <p className="font-bold text-gray-900">Professional Expertise</p>
                              <p className="text-sm text-gray-600">Years of hands-on experience in the field</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-teal-600 rounded-full mt-2"></div>
                            <div>
                              <p className="font-bold text-gray-900">Quality Materials</p>
                              <p className="text-sm text-gray-600">Using only premium quality materials and tools</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-teal-600 rounded-full mt-2"></div>
                            <div>
                              <p className="font-bold text-gray-900">Punctual Service</p>
                              <p className="text-sm text-gray-600">Always on time and respectful of your schedule</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-teal-600 rounded-full mt-2"></div>
                            <div>
                              <p className="font-bold text-gray-900">Fair Pricing</p>
                              <p className="text-sm text-gray-600">Transparent pricing with no hidden charges</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Professional Details Grid */}
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {professional.experience && (
                          <div className="flex flex-col gap-2 p-4 bg-teal-50 rounded-xl border-2 border-teal-200 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-2">
                              <Briefcase className="w-5 h-5 text-teal-600" />
                              <span className="text-xs font-bold text-gray-500 uppercase">Experience</span>
                            </div>
                            <p className="text-lg font-black text-gray-900">{professional.experience}</p>
                          </div>
                        )}
                        {professional.languages && professional.languages.length > 0 && (
                          <div className="flex flex-col gap-2 p-4 bg-purple-50 rounded-xl border-2 border-purple-200 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-2">
                              <Globe className="w-5 h-5 text-purple-600" />
                              <span className="text-xs font-bold text-gray-500 uppercase">Languages</span>
                            </div>
                            <p className="text-sm font-bold text-gray-900">{professional.languages.join(', ')}</p>
                          </div>
                        )}
                        {professional.member_since && (
                          <div className="flex flex-col gap-2 p-4 bg-blue-50 rounded-xl border-2 border-blue-200 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-2">
                              <CalendarDays className="w-5 h-5 text-blue-600" />
                              <span className="text-xs font-bold text-gray-500 uppercase">Member Since</span>
                            </div>
                            <p className="text-sm font-bold text-gray-900">
                              {new Date(professional.member_since).toLocaleDateString('en-IN', { 
                                month: 'long', 
                                year: 'numeric' 
                              })}
                            </p>
                          </div>
                        )}
                        {professional.category && (
                          <div className="flex flex-col gap-2 p-4 bg-orange-50 rounded-xl border-2 border-orange-200 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-2">
                              <Wrench className="w-5 h-5 text-orange-600" />
                              <span className="text-xs font-bold text-gray-500 uppercase">Category</span>
                            </div>
                            <p className="text-sm font-bold text-gray-900">{professional.category}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Service Promise */}
                  <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                    <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200">
                      <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl shadow-lg">
                        <Shield className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-gray-900">Service Commitment</h3>
                        <p className="text-sm text-gray-500">What you can expect from my services</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl border-l-4 border-green-600">
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-black text-gray-900 mb-1">100% Satisfaction Guarantee</h4>
                          <p className="text-sm text-gray-600">If you're not happy with my work, I'll make it right at no extra cost</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl border-l-4 border-blue-600">
                        <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-black text-gray-900 mb-1">Professional Standards</h4>
                          <p className="text-sm text-gray-600">All work follows industry best practices and safety standards</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-xl border-l-4 border-purple-600">
                        <CheckCircle className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-black text-gray-900 mb-1">Clean & Respectful</h4>
                          <p className="text-sm text-gray-600">I maintain cleanliness during work and respect your property</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-xl border-l-4 border-orange-600">
                        <CheckCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-black text-gray-900 mb-1">Transparent Communication</h4>
                          <p className="text-sm text-gray-600">Clear explanation of work needed and costs before starting</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Skills Section */}
                  {professional.skills && professional.skills.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200">
                        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-3 rounded-xl shadow-lg">
                          <Wrench className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-black text-gray-900">Skills & Specializations</h3>
                          <p className="text-sm text-gray-500">{professional.skills.length} professional skills</p>
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {professional.skills.map((skill: string, idx: number) => {
                          const SkillIcon = getSkillIcon(skill);
                          return (
                            <div
                              key={idx}
                              className="flex items-center gap-3 p-4 bg-gradient-to-r from-teal-50 to-green-50 rounded-xl border-2 border-teal-200 hover:border-teal-400 hover:shadow-md transition-all"
                            >
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-600 to-green-600 flex items-center justify-center shadow-lg">
                                <SkillIcon className="w-6 h-6 text-white" />
                              </div>
                              <span className="font-bold text-gray-900 text-sm">{skill}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Certifications Section */}
                  {professional.certifications && professional.certifications.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200">
                        <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-3 rounded-xl shadow-lg">
                          <Award className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-black text-gray-900">Certifications & Awards</h3>
                          <p className="text-sm text-gray-500">{professional.certifications.length} verified certificates</p>
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {professional.certifications.map((cert: string, idx: number) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border-2 border-amber-300 hover:shadow-md transition-all"
                          >
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                              <Award className="w-6 h-6 text-white" />
                            </div>
                            <span className="font-bold text-gray-900">{cert}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Service Areas Section */}
                  {(professional.city || (professional.service_areas && professional.service_areas.length > 0)) && (
                    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200">
                        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl shadow-lg">
                          <MapPinned className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-black text-gray-900">Service Coverage Area</h3>
                          <p className="text-sm text-gray-500">Where I provide services</p>
                        </div>
                      </div>
                      
                      {professional.city && (
                        <div className="flex items-center gap-3 mb-6 p-4 bg-orange-50 rounded-xl border-2 border-orange-300">
                          <Building className="w-7 h-7 text-orange-600" />
                          <div>
                            <span className="font-bold text-gray-900 block">Based In</span>
                            <p className="text-gray-600 font-medium text-lg">{professional.city}{professional.state && `, ${professional.state}`}</p>
                          </div>
                        </div>
                      )}
                      
                      {professional.service_areas && professional.service_areas.length > 0 && (
                        <div>
                          <p className="font-bold text-gray-900 mb-4 text-lg">Coverage Areas:</p>
                          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {professional.service_areas.map((area: string, idx: number) => (
                              <div key={idx} className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-3 rounded-xl font-bold border-2 border-green-300">
                                <MapPin className="w-5 h-5" />
                                {area}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Availability Section */}
                  {professional.working_days && professional.working_days.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200">
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl shadow-lg">
                          <CalendarDays className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-black text-gray-900">Working Hours & Availability</h3>
                          <p className="text-sm text-gray-500">When I'm available for work</p>
                        </div>
                      </div>
                      
                      {professional.working_hours_start && professional.working_hours_end && (
                        <div className="flex items-center gap-3 mb-6 p-4 bg-indigo-50 rounded-xl border-2 border-indigo-300">
                          <Clock className="w-7 h-7 text-indigo-600" />
                          <div>
                            <span className="font-bold text-gray-900 block">Working Hours</span>
                            <p className="text-gray-600 font-medium text-lg">
                              {formatTime(professional.working_hours_start)} - {formatTime(professional.working_hours_end)}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <p className="font-bold text-gray-900 mb-4 text-lg">Available Days:</p>
                        <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
                          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
                            const isAvailable = professional.working_days.includes(day);
                            return (
                              <div
                                key={day}
                                className={`text-center p-4 rounded-xl font-bold ${
                                  isAvailable 
                                    ? 'bg-green-100 text-green-700 border-2 border-green-300 shadow-sm' 
                                    : 'bg-gray-100 text-gray-400 border-2 border-gray-200'
                                }`}
                              >
                                <span className="text-sm block mb-1">{day.slice(0, 3)}</span>
                                {isAvailable && <CheckCircle className="w-5 h-5 mx-auto" />}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {activeTab === 'services' && (
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                    <div>
                      <h3 className="text-2xl font-black text-gray-900">Services Offered</h3>
                      <p className="text-sm text-gray-500 mt-1">{services.length} services available</p>
                    </div>
                    <span className="bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-bold">
                      {services.length} Services
                    </span>
                  </div>
                  {services.length > 0 ? (
                    <div className="space-y-4">
                      {services.map((service, idx) => (
                        <Link
                          key={idx}
                          href={`/booking/${service.id}`}
                          className="flex items-center justify-between p-5 border-2 border-gray-200 rounded-xl hover:border-teal-400 hover:bg-teal-50 transition-all group"
                        >
                          <div className="flex items-center gap-4">
                            {service.image ? (
                              <img src={service.image} alt={service.name} className="w-20 h-20 rounded-xl object-cover shadow-md" />
                            ) : (
                              <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-teal-500 to-green-600 flex items-center justify-center shadow-md">
                                <Wrench className="w-10 h-10 text-white" />
                              </div>
                            )}
                            <div>
                              <h4 className="font-black text-gray-900 group-hover:text-teal-600 transition-colors text-lg">{service.name}</h4>
                              <p className="text-sm text-gray-500 font-medium">{service.duration}</p>
                              {service.features && service.features.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {service.features.slice(0, 3).map((f: string, i: number) => (
                                    <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded font-medium">{f}</span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-black text-teal-600 flex items-center gap-1">
                              <IndianRupee className="w-5 h-5" />
                              {service.price?.toLocaleString('en-IN')}
                            </div>
                            <span className="text-xs text-gray-500 font-medium">
                              {service.price_type === 'starting_from' ? 'Starting' : service.price_type === 'hourly' ? '/hour' : 'Fixed'}
                            </span>
                            <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-teal-600 mt-1 ml-auto" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Wrench className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 font-medium">No services listed yet</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                    <div>
                      <h3 className="text-2xl font-black text-gray-900">Customer Reviews</h3>
                      <p className="text-sm text-gray-500 mt-1">What customers say about this professional</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-3xl font-black text-yellow-500">
                        <Star className="w-8 h-8 fill-yellow-400 text-yellow-400" />
                        {(professional.rating || 4.5).toFixed(1)}
                      </div>
                      <p className="text-sm text-gray-500">{professional.total_reviews || 0} reviews</p>
                    </div>
                  </div>
                  <div className="text-center py-12">
                    <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">No reviews yet</p>
                    <p className="text-sm text-gray-400 mt-2">Be the first to review this professional</p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Booking CTA - Sticky Bottom */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 p-4 shadow-2xl z-40 lg:hidden">
              <Link
                href={`/booking-flow/${professionalId}`}
                className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-gradient-to-r from-teal-600 to-green-600 text-white rounded-xl font-bold shadow-lg text-lg"
              >
                <Calendar className="w-6 h-6" />
                <span>Book Now - ₹{professional.hourly_rate || 'Custom'}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <Notifications
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
      <PriceOfferModal
        isOpen={isPriceOfferModalOpen}
        onClose={() => setIsPriceOfferModalOpen(false)}
        professionalId={professionalId}
        professionalName={professional?.name || 'Professional'}
      />
    </div>
  );
}
