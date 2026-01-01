'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  ArrowLeft, Heart, Phone, MessageCircle, Calendar, Star, CheckCircle, Clock, 
  MapPin, Award, Briefcase, Zap, Shield, User, Loader2, AlertCircle,
  Globe, BadgeCheck, ChevronRight, Wrench, IndianRupee, DollarSign, Share2
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

const getSkillIcon = (skillName) => {
  for (const [key, icon] of Object.entries(SKILL_ICONS)) {
    if (skillName.toLowerCase().includes(key.toLowerCase())) {
      return icon;
    }
  }
  return SKILL_ICONS.default;
};

export default function Professional() {
  const searchParams = useSearchParams();
  const professionalId = searchParams.get('id');
  
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [professional, setProfessional] = useState(null);
  const [services, setServices] = useState([]);
  const [isPriceOfferModalOpen, setIsPriceOfferModalOpen] = useState(false);

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
        
      } catch (err) {
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
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Loading professional profile...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !professional) {
    return (
      <div className="min-h-screen bg-gray-50">
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
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
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

  const formatTime = (time) => {
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
        // Use native share API if available
        await navigator.share(shareData);
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      // If share is cancelled or fails, try clipboard
      if (error.name !== 'AbortError') {
        try {
          await navigator.clipboard.writeText(shareUrl);
          alert('Link copied to clipboard!');
        } catch (clipboardError) {
          console.error('Share failed:', clipboardError);
          alert('Unable to share. Please copy the URL manually.');
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        onNotificationClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
        isNotificationsOpen={isNotificationsOpen}
      />

      <div className="fixed top-[70px] left-0 right-0 bg-gradient-to-r from-blue-600 to-indigo-600 z-40 shadow-lg">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link href="/service" className="flex items-center gap-2 text-white hover:text-blue-100 transition-colors">
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
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-24"></div>
                <div className="px-6 pb-6">
                  <div className="relative -mt-16 mb-4">
                    <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-xl mx-auto bg-gradient-to-br from-blue-500 to-purple-600">
                      {professional.profile_image ? (
                        <img
                          src={professional.profile_image.startsWith('http') ? professional.profile_image : `http://localhost:8000${professional.profile_image}`}
                          alt={professional.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-16 h-16 text-white" />
                        </div>
                      )}
                    </div>
                    {professional.is_verified && (
                      <div className="absolute bottom-0 right-1/2 translate-x-1/2 translate-y-1/2 bg-green-500 rounded-full p-2 border-4 border-white shadow-lg">
                        <BadgeCheck className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="text-center mb-4 mt-6">
                    <h2 className="text-3xl font-black text-gray-900 mb-2">
                      {professional.name}
                    </h2>
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                      {professional.is_verified && (
                        <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1.5 rounded-full">
                          <CheckCircle className="w-4 h-4" />
                          <span className="font-bold text-sm">Verified Professional</span>
                        </span>
                      )}
                      {professional.category && (
                        <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full">
                          <Briefcase className="w-4 h-4" />
                          <span className="font-bold text-sm">{professional.category}</span>
                        </span>
                      )}
                      {professional.emergency_available && (
                        <span className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-1.5 rounded-full">
                          <Zap className="w-4 h-4" />
                          <span className="font-bold text-sm">24/7 Available</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
                    <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-xl">
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      <span className="font-bold text-gray-900">
                        {(professional.rating || 0).toFixed(1)}
                      </span>
                      <span className="text-gray-500">({professional.total_reviews || 0} reviews)</span>
                    </div>
                    {professional.total_bookings > 0 && (
                      <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-xl">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="font-bold text-gray-900">
                          {professional.total_bookings}+ jobs completed
                        </span>
                      </div>
                    )}
                  </div>

                  {professional.hourly_rate && (
                    <div className="text-center mb-6">
                      <div className="text-4xl font-black text-blue-600 mb-1 flex items-center justify-center gap-1">
                        <IndianRupee className="w-8 h-8" />
                        {professional.hourly_rate} / hour
                      </div>
                      <p className="text-gray-500 font-medium">Service charges may vary based on requirements</p>
                    </div>
                  )}

                  <div className="grid grid-cols-4 gap-3">
                    {professional.phone && (
                      <a 
                        href={`tel:${professional.phone}`}
                        className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-blue-600 hover:bg-blue-50 transition-all font-bold text-blue-600"
                      >
                        <Phone className="w-5 h-5" />
                        <span className="hidden sm:inline">Call</span>
                      </a>
                    )}
                    <Link
                      href={`/messages/${professionalId}`}
                      className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-blue-600 hover:bg-blue-50 transition-all font-bold text-blue-600"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span className="hidden sm:inline">Chat</span>
                    </Link>
                    <button
                      onClick={handleShare}
                      className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-purple-600 hover:bg-purple-50 transition-all font-bold text-purple-600"
                      title="Share profile"
                    >
                      <Share2 className="w-5 h-5" />
                      <span className="hidden sm:inline">Share</span>
                    </button>
                    <button
                      onClick={() => setIsPriceOfferModalOpen(true)}
                      className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all font-bold text-green-600 col-span-4 sm:col-span-4"
                    >
                      <DollarSign className="w-5 h-5" />
                      <span>Make Price Offer</span>
                    </button>
                    <Link
                      href={`/booking-flow/${professionalId}`}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold shadow-lg col-span-4 sm:col-span-4"
                    >
                      <Calendar className="w-5 h-5" />
                      
                      <span>Book Now</span>
                    </Link>
                  </div>
                </div>
              </div>

              {professional.bio && (
                <div className="bg-white rounded-2xl shadow-md p-6">
                  <h3 className="text-2xl font-black text-gray-900 mb-4">About</h3>
                  <p className="text-gray-700 leading-relaxed mb-4 font-medium whitespace-pre-wrap">
                    {professional.bio}
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    {professional.experience && (
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                        <Briefcase className="w-5 h-5 text-blue-600" />
                        <div>
                          <span className="font-bold text-gray-900">Experience</span>
                          <p className="text-gray-600">{professional.experience}</p>
                        </div>
                      </div>
                    )}
                    {professional.languages && professional.languages.length > 0 && (
                      <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
                        <Globe className="w-5 h-5 text-purple-600" />
                        <div>
                          <span className="font-bold text-gray-900">Languages</span>
                          <p className="text-gray-600">{professional.languages.join(', ')}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {professional.skills && professional.skills.length > 0 && (
                <div className="bg-white rounded-2xl shadow-md p-6">
                  <h3 className="text-2xl font-black text-gray-900 mb-6">Skills & Specializations</h3>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {professional.skills.map((skill, idx) => {
                      const SkillIcon = getSkillIcon(skill);
                      return (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-100 hover:border-blue-300 transition-all"
                        >
                          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                            <SkillIcon className="w-5 h-5 text-white" />
                          </div>
                          <span className="font-bold text-gray-900 text-sm">{skill}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {professional.certifications && professional.certifications.length > 0 && (
                <div className="bg-white rounded-2xl shadow-md p-6">
                  <h3 className="text-2xl font-black text-gray-900 mb-6">Certifications</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {professional.certifications.map((cert, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border-2 border-amber-200"
                      >
                        <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center">
                          <Award className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-gray-900">{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {services.length > 0 && (
                <div className="bg-white rounded-2xl shadow-md p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-black text-gray-900">Services Offered</h3>
                    <span className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-sm font-bold">
                      {services.length} Services
                    </span>
                  </div>
                  <div className="space-y-4">
                    {services.map((service, idx) => (
                      <Link
                        key={idx}
                        href={`/booking/${service.id}`}
                        className="flex items-center justify-between p-4 border-2 border-gray-100 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          {service.image ? (
                            <img src={service.image} alt={service.name} className="w-16 h-16 rounded-xl object-cover" />
                          ) : (
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                              <Wrench className="w-8 h-8 text-white" />
                            </div>
                          )}
                          <div>
                            <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{service.name}</h4>
                            <p className="text-sm text-gray-500">{service.duration}</p>
                            {service.features && service.features.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {service.features.slice(0, 2).map((f, i) => (
                                  <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{f}</span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-black text-blue-600 flex items-center gap-0.5">
                            <IndianRupee className="w-4 h-4" />
                            {service.price?.toLocaleString('en-IN')}
                          </div>
                          <span className="text-xs text-gray-500">
                            {service.price_type === 'starting_from' ? 'Starting' : service.price_type === 'hourly' ? '/hour' : 'Fixed'}
                          </span>
                          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 mt-1 ml-auto" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {(professional.city || (professional.service_areas && professional.service_areas.length > 0)) && (
                <div className="bg-white rounded-2xl shadow-md p-6">
                  <h3 className="text-2xl font-black text-gray-900 mb-6">Service Area</h3>
                  
                  {professional.city && (
                    <div className="flex items-center gap-3 mb-4 p-4 bg-orange-50 rounded-xl border border-orange-200">
                      <MapPin className="w-6 h-6 text-orange-600" />
                      <div>
                        <span className="font-bold text-gray-900">Location</span>
                        <p className="text-gray-600">{professional.city}{professional.state && `, ${professional.state}`}</p>
                      </div>
                    </div>
                  )}
                  
                  {professional.service_areas && professional.service_areas.length > 0 && (
                    <div>
                      <p className="font-bold text-gray-900 mb-3">Areas Covered:</p>
                      <div className="flex flex-wrap gap-2">
                        {professional.service_areas.map((area, idx) => (
                          <span key={idx} className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-medium">
                            <MapPin className="w-4 h-4 inline mr-1" />
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {professional.working_days && professional.working_days.length > 0 && (
                <div className="bg-white rounded-2xl shadow-md p-6">
                  <h3 className="text-2xl font-black text-gray-900 mb-6">Availability</h3>
                  
                  {professional.working_hours_start && professional.working_hours_end && (
                    <div className="flex items-center gap-3 mb-4 p-4 bg-indigo-50 rounded-xl border border-indigo-200">
                      <Clock className="w-6 h-6 text-indigo-600" />
                      <div>
                        <span className="font-bold text-gray-900">Working Hours</span>
                        <p className="text-gray-600">
                          {formatTime(professional.working_hours_start)} - {formatTime(professional.working_hours_end)}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <p className="font-bold text-gray-900 mb-3">Available Days:</p>
                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
                        const isAvailable = professional.working_days.includes(day);
                        return (
                          <div
                            key={day}
                            className={`text-center p-3 rounded-xl font-medium ${
                              isAvailable 
                                ? 'bg-green-100 text-green-700 border-2 border-green-300' 
                                : 'bg-gray-100 text-gray-400 border-2 border-gray-200'
                            }`}
                          >
                            <span className="text-sm">{day.slice(0, 3)}</span>
                            {isAvailable && <CheckCircle className="w-4 h-4 mx-auto mt-1" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {professional.member_since && (
                <div className="bg-white rounded-2xl shadow-md p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                      <Award className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <span className="text-gray-500">Member Since</span>
                      <p className="font-bold text-gray-900">
                        {new Date(professional.member_since).toLocaleDateString('en-IN', { 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              )}
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
