'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, SlidersHorizontal, Star, Clock, Wrench, Shield, CheckCircle, ChevronRight, 
  X, MapPin, ChevronDown, ArrowRight, TrendingUp, User, Filter, Zap, Droplet, 
  Hammer, PaintBucket, Wind, Sparkles, Home, Package, Sun, Phone, Calendar,
  BadgeCheck, AlertCircle, Loader2, Heart, Share2, Info, ChevronLeft, RefreshCw,
  IndianRupee, Eye, Award, Briefcase, MessageCircle
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '../Component/Navbar';
import Footer from '../Component/Footer';
import Notifications from '../Component/Notifications';
import FavoriteButton from '../Component/FavoriteButton';
import { getAllServices, getProfessionalPublicProfile } from '../../utils/services';

// Service categories with icons
const SERVICE_CATEGORIES = [
  { value: 'Electrical', label: 'Electrical', icon: Zap, color: 'from-yellow-400 to-orange-500' },
  { value: 'Plumbing', label: 'Plumbing', icon: Droplet, color: 'from-blue-400 to-cyan-500' },
  { value: 'Carpentry', label: 'Carpentry', icon: Hammer, color: 'from-orange-400 to-amber-500' },
  { value: 'Painting', label: 'Painting', icon: PaintBucket, color: 'from-purple-400 to-pink-500' },
  { value: 'AC & Refrigeration', label: 'AC & Cooling', icon: Wind, color: 'from-cyan-400 to-blue-500' },
  { value: 'Appliance Repair', label: 'Appliances', icon: Wrench, color: 'from-red-400 to-rose-500' },
  { value: 'Cleaning', label: 'Cleaning', icon: Sparkles, color: 'from-green-400 to-emerald-500' },
  { value: 'Pest Control', label: 'Pest Control', icon: Shield, color: 'from-lime-400 to-green-500' },
  { value: 'Home Renovation', label: 'Renovation', icon: Home, color: 'from-indigo-400 to-violet-500' },
  { value: 'Security Systems', label: 'Security', icon: Shield, color: 'from-gray-400 to-slate-500' },
  { value: 'Solar Installation', label: 'Solar', icon: Sun, color: 'from-amber-400 to-yellow-500' },
  { value: 'Other', label: 'Other', icon: Package, color: 'from-slate-400 to-gray-500' }
];

// Sort options
const SORT_OPTIONS = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Newest First' }
];

// Filter options
const FILTER_OPTIONS = [
  { id: 'available_today', label: 'Available Today', icon: Calendar },
  { id: 'high_rated', label: '4.5+ Rating', icon: Star },
  { id: 'budget', label: 'Budget Friendly', icon: TrendingUp },
  { id: 'emergency', label: 'Emergency', icon: AlertCircle },
  { id: 'verified', label: 'Verified', icon: BadgeCheck }
];

export default function Service() {
  const router = useRouter();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  // Data state
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalServices, setTotalServices] = useState(0);
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [sortBy, setSortBy] = useState('recommended');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [showFilters, setShowFilters] = useState(false);
  
  // Modal state
  const [selectedService, setSelectedService] = useState(null);
  const [loadingService, setLoadingService] = useState(false);
  const [professionalDetails, setProfessionalDetails] = useState(null);

  // Fetch services
  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        search: searchQuery || undefined,
        category: selectedCategory || undefined,
        sort_by: sortBy,
        min_price: priceRange.min ? parseFloat(priceRange.min) : undefined,
        max_price: priceRange.max ? parseFloat(priceRange.max) : undefined,
        min_rating: selectedFilters.includes('high_rated') ? 4.5 : undefined,
        emergency_available: selectedFilters.includes('emergency') ? true : undefined,
        limit: 50
      };
      
      Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);
      
      const response = await getAllServices(params);
      setServices(response.services || []);
      setTotalServices(response.total || 0);
      if (response.categories) {
        setCategories(response.categories);
      }
    } catch (err) {
      console.error('Error fetching services:', err);
      setError(err.message || 'Failed to load services');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory, sortBy, priceRange, selectedFilters]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchServices();
  };

  const toggleFilter = (filterId) => {
    setSelectedFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(f => f !== filterId)
        : [...prev, filterId]
    );
  };

  const openServiceDetails = async (service) => {
    setSelectedService(service);
    setLoadingService(true);
    setProfessionalDetails(null);
    
    try {
      const profResponse = await getProfessionalPublicProfile(service.professional_id);
      setProfessionalDetails(profResponse.professional);
    } catch (err) {
      console.error('Error fetching professional details:', err);
    } finally {
      setLoadingService(false);
    }
  };

  const closeServiceDetails = () => {
    setSelectedService(null);
    setProfessionalDetails(null);
  };

  const formatPrice = (price, priceType) => {
    const formattedPrice = price?.toLocaleString('en-IN') || '0';
    if (priceType === 'starting_from') return `From Rs.${formattedPrice}`;
    if (priceType === 'hourly') return `Rs.${formattedPrice}/hr`;
    return `Rs.${formattedPrice}`;
  };

  const getCategoryInfo = (categoryName) => {
    return SERVICE_CATEGORIES.find(cat => cat.value === categoryName) || SERVICE_CATEGORIES[SERVICE_CATEGORIES.length - 1];
  };

  // Enhanced Service Card Component - Detailed View
  const ServiceCard = ({ service }) => {
    const categoryInfo = getCategoryInfo(service.category);
    const CategoryIcon = categoryInfo.icon;
    
    return (
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group">
        {/* Image Section */}
        <div className="relative h-48 overflow-hidden">
          {service.image ? (
            <img 
              src={service.image} 
              alt={service.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${categoryInfo.color}`}>
              <CategoryIcon className="w-16 h-16 text-white/80" />
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <div className={`flex items-center gap-1.5 bg-gradient-to-r ${categoryInfo.color} px-3 py-1.5 rounded-full shadow-lg`}>
              <CategoryIcon className="w-4 h-4 text-white" />
              <span className="text-xs font-bold text-white">{service.category}</span>
            </div>
          </div>
          
          {/* Emergency Badge */}
          {service.emergency_available && (
            <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1.5 rounded-full flex items-center gap-1 shadow-lg animate-pulse">
              <Zap className="w-3 h-3" />
              24/7
            </div>
          )}
          
          {/* Price Badge on Image */}
          <div className="absolute bottom-3 left-3">
            <div className="bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg">
              <p className="text-lg font-black text-green-600 flex items-center">
                <IndianRupee className="w-4 h-4" />
                {service.price?.toLocaleString('en-IN') || 0}
              </p>
              <p className="text-xs text-gray-500">
                {service.price_type === 'hourly' ? 'Per Hour' : service.price_type === 'starting_from' ? 'Starting' : 'Fixed'}
              </p>
            </div>
          </div>
          
          {/* Rating Badge on Image */}
          <div className="absolute bottom-3 right-3">
            <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-bold text-gray-900">{(service.rating || 0).toFixed(1)}</span>
              <span className="text-xs text-gray-500">({service.total_ratings || 0})</span>
            </div>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="p-4">
          {/* Title */}
          <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {service.name}
          </h3>
          
          {/* Description */}
          <p className="text-gray-500 text-sm mb-3 line-clamp-2 leading-relaxed">
            {service.description}
          </p>
          
          {/* Quick Info Row */}
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Clock className="w-4 h-4 text-blue-500" />
              <span>{service.duration}</span>
            </div>
            {service.bookings_count > 0 && (
              <div className="flex items-center gap-1 text-sm text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span>{service.bookings_count}+ booked</span>
              </div>
            )}
            {service.warranty_days && (
              <div className="flex items-center gap-1 text-sm text-purple-600">
                <Shield className="w-4 h-4" />
                <span>{service.warranty_days} days warranty</span>
              </div>
            )}
          </div>
          
          {/* Professional Info Card */}
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl mb-3 border border-gray-100">
            <div className="relative flex-shrink-0">
              {service.professional_image ? (
                <img 
                  src={service.professional_image.startsWith('http') ? service.professional_image : `http://localhost:8000${service.professional_image}`}
                  alt={service.professional_name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
                  <User className="w-7 h-7 text-white" />
                </div>
              )}
              {service.professional_verified && (
                <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5 border-2 border-white">
                  <BadgeCheck className="w-3.5 h-3.5 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate flex items-center gap-1">
                {service.professional_name}
                {service.professional_verified && (
                  <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">Verified</span>
                )}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5 flex-wrap">
                {service.professional_experience && (
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3 h-3 text-blue-500" />
                    {service.professional_experience}
                  </span>
                )}
                {service.service_area && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-red-500" />
                    {service.service_area.split(',')[0]}
                  </span>
                )}
              </div>
              {service.professional_rating && (
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  <span className="text-xs font-semibold text-gray-700">{service.professional_rating.toFixed(1)} rating</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Features Tags */}
          {service.features && service.features.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {service.features.slice(0, 3).map((feature, idx) => (
                <span key={idx} className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full border border-blue-100">
                  <CheckCircle className="w-3 h-3" />
                  {feature}
                </span>
              ))}
              {service.features.length > 3 && (
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                  +{service.features.length - 3} more
                </span>
              )}
            </div>
          )}
          
          {/* Service Includes Preview */}
          {service.service_includes && service.service_includes.length > 0 && (
            <div className="mb-3 p-2.5 bg-green-50 rounded-xl border border-green-100">
              <p className="text-xs font-semibold text-green-700 mb-1.5 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Includes:
              </p>
              <div className="flex flex-wrap gap-1">
                {service.service_includes.slice(0, 3).map((item, idx) => (
                  <span key={idx} className="text-xs text-green-600 bg-white px-2 py-0.5 rounded">
                    {item}
                  </span>
                ))}
                {service.service_includes.length > 3 && (
                  <span className="text-xs text-green-500">+{service.service_includes.length - 3} more</span>
                )}
              </div>
            </div>
          )}
          
          {/* Action Buttons - Book Now & View Profile */}
          <div className="flex gap-2 mt-4">
            <Link 
              href={`/booking/${service.id}`}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30"
            >
              <Calendar className="w-4 h-4" />
              Book Now
            </Link>
            <Link
              href={`/professional_view?id=${service.professional_id}`}
              className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-all border border-gray-200"
            >
              <User className="w-4 h-4" />
              Profile
            </Link>
            <button
              onClick={(e) => {
                e.stopPropagation();
                openServiceDetails(service);
              }}
              className="flex items-center justify-center gap-1 bg-white hover:bg-gray-50 text-blue-600 font-semibold py-3 px-3 rounded-xl transition-all border border-blue-200"
              title="View Details"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Service Detail Modal
  const ServiceDetailModal = () => {
    if (!selectedService) return null;
    
    const categoryInfo = getCategoryInfo(selectedService.category);
    const CategoryIcon = categoryInfo.icon;
    
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeServiceDetails}>
        <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <button onClick={closeServiceDetails} className="p-2 hover:bg-white rounded-full transition-colors">
              <X className="w-6 h-6 text-gray-600" />
            </button>
            <h2 className="font-bold text-lg text-gray-900">Service Details</h2>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-white rounded-full transition-colors">
                <Heart className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-white rounded-full transition-colors">
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Hero Image */}
            <div className="relative h-72">
              {selectedService.image ? (
                <img src={selectedService.image} alt={selectedService.name} className="w-full h-full object-cover" />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${categoryInfo.color} flex items-center justify-center`}>
                  <CategoryIcon className="w-32 h-32 text-white/80" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              
              {/* Price Badge */}
              <div className="absolute bottom-4 left-4 bg-white rounded-xl px-4 py-3 shadow-xl">
                <p className="text-2xl font-black text-green-600">{formatPrice(selectedService.price, selectedService.price_type)}</p>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <Clock className="w-4 h-4" /> {selectedService.duration}
                </p>
              </div>
              
              {/* Rating Badge */}
              <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-white rounded-xl px-3 py-2 shadow-xl">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="font-bold text-gray-900">{(selectedService.rating || 0).toFixed(1)}</span>
                <span className="text-gray-500">({selectedService.total_ratings || 0})</span>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Title Section */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`inline-flex items-center gap-1 bg-gradient-to-r ${categoryInfo.color} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                    <CategoryIcon className="w-3 h-3" />
                    {selectedService.category}
                  </span>
                  {selectedService.professional_verified && (
                    <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                      <BadgeCheck className="w-3 h-3" /> Verified Pro
                    </span>
                  )}
                  {selectedService.emergency_available && (
                    <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full">
                      <Zap className="w-3 h-3" /> 24/7 Available
                    </span>
                  )}
                </div>
                <h1 className="text-2xl font-black text-gray-900 mb-2">{selectedService.name}</h1>
                <p className="text-gray-600 leading-relaxed">{selectedService.description}</p>
              </div>
              
              {/* Professional Card */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    Service Provider
                  </h3>
                  {selectedService.professional_id && (
                    <FavoriteButton 
                      key={`fav-${selectedService.professional_id}`}
                      professionalId={selectedService.professional_id}
                      size="small"
                    />
                  )}
                </div>
                {loadingService ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                  </div>
                ) : (
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      {selectedService.professional_image ? (
                        <img 
                          src={selectedService.professional_image.startsWith('http') ? selectedService.professional_image : `http://localhost:8000${selectedService.professional_image}`}
                          alt={selectedService.professional_name}
                          className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-lg"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                          <User className="w-10 h-10 text-white" />
                        </div>
                      )}
                      {selectedService.professional_verified && (
                        <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1 border-3 border-white shadow-md">
                          <BadgeCheck className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg text-gray-900">{selectedService.professional_name}</h4>
                      {professionalDetails && (
                        <div className="space-y-2 mt-2">
                          {professionalDetails.experience && (
                            <p className="text-sm text-gray-600 flex items-center gap-2">
                              <Briefcase className="w-4 h-4 text-blue-500" />
                              {professionalDetails.experience} Experience
                            </p>
                          )}
                          {professionalDetails.city && (
                            <p className="text-sm text-gray-600 flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-red-500" />
                              {professionalDetails.city}, {professionalDetails.state}
                            </p>
                          )}
                          {professionalDetails.languages && professionalDetails.languages.length > 0 && (
                            <p className="text-sm text-gray-600 flex items-center gap-2">
                              <MessageCircle className="w-4 h-4 text-green-500" />
                              Speaks: {professionalDetails.languages.join(', ')}
                            </p>
                          )}
                          {professionalDetails.skills && professionalDetails.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {professionalDetails.skills.slice(0, 5).map((skill, idx) => (
                                <span key={idx} className="text-xs bg-white text-gray-700 px-2 py-1 rounded-full shadow-sm">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                      <Link
                        href={`/professional_view?id=${selectedService.professional_id}`}
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold text-sm mt-3"
                      >
                        View Full Profile <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Service Includes */}
              {selectedService.service_includes && selectedService.service_includes.length > 0 && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    What's Included
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedService.service_includes.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-green-50 text-green-700 p-3 rounded-xl">
                        <CheckCircle className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Service Excludes */}
              {selectedService.service_excludes && selectedService.service_excludes.length > 0 && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <X className="w-5 h-5 text-red-500" />
                    What's Not Included
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedService.service_excludes.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-red-50 text-red-600 p-3 rounded-xl">
                        <X className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Features */}
              {selectedService.features && selectedService.features.length > 0 && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-500" />
                    Service Features
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedService.features.map((feature, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                        <CheckCircle className="w-4 h-4" />
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Warranty & Service Area */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedService.warranty_days && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 flex items-center gap-4 border border-green-200">
                    <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                      <Shield className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-green-800">{selectedService.warranty_days}-Day Warranty</h4>
                      <p className="text-sm text-green-600">Service guarantee included</p>
                    </div>
                  </div>
                )}
                
                {selectedService.service_area && (
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-4 flex items-center gap-4 border border-orange-200">
                    <div className="w-14 h-14 rounded-full bg-orange-500 flex items-center justify-center shadow-lg">
                      <MapPin className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-orange-800">Service Area</h4>
                      <p className="text-sm text-orange-600">{selectedService.service_area}</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Availability */}
              {selectedService.available_days && selectedService.available_days.length > 0 && (
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-4 border border-indigo-200">
                  <h4 className="font-bold text-indigo-800 mb-2 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Availability
                  </h4>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedService.available_days.map((day, idx) => (
                      <span key={idx} className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                        {day}
                      </span>
                    ))}
                  </div>
                  {selectedService.available_time_start && selectedService.available_time_end && (
                    <p className="text-sm text-indigo-600">
                      <Clock className="w-4 h-4 inline mr-1" />
                      {selectedService.available_time_start} - {selectedService.available_time_end}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Footer Actions */}
          <div className="p-4 border-t border-gray-100 bg-white flex gap-3">
            <Link
              href={`/professional_view?id=${selectedService.professional_id}`}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 px-6 rounded-xl transition-all"
            >
              <User className="w-5 h-5" />
              View Profile
            </Link>
            <Link 
              href={`/booking/${selectedService.id}`}
              className="flex-[2] flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-blue-500/25"
            >
              <Calendar className="w-5 h-5" />
              Book This Service
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <Notifications isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
      
      <div className="min-h-screen bg-gray-50 mt-[70px]">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
            <div className="text-center mb-8">
              <h1 className="text-3xl lg:text-5xl font-black mb-4">Find Expert Home Services</h1>
              <p className="text-blue-100 text-lg lg:text-xl max-w-2xl mx-auto">
                Book trusted professionals for all your home service needs
              </p>
            </div>
            
            <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for services like AC repair, plumbing, electrician..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-36 py-5 rounded-2xl text-gray-900 placeholder-gray-400 bg-white shadow-2xl focus:outline-none focus:ring-4 focus:ring-white/30 text-lg"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold px-8 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
          
          {/* Category Pills */}
          <div className="border-t border-white/10 bg-white/5 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold transition-all ${
                    selectedCategory === '' ? 'bg-white text-blue-600 shadow-lg' : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  All Services
                </button>
                {SERVICE_CATEGORIES.slice(0, 8).map((cat) => {
                  const CatIcon = cat.icon;
                  return (
                    <button
                      key={cat.value}
                      onClick={() => setSelectedCategory(cat.value)}
                      className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold transition-all ${
                        selectedCategory === cat.value ? 'bg-white text-blue-600 shadow-lg' : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      <CatIcon className="w-4 h-4" />
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 font-semibold transition-all ${
                  showFilters || selectedFilters.length > 0 ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <SlidersHorizontal className="w-5 h-5" />
                Filters
                {selectedFilters.length > 0 && (
                  <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">{selectedFilters.length}</span>
                )}
              </button>
              
              <div className="hidden lg:flex items-center gap-2">
                {FILTER_OPTIONS.map((filter) => {
                  const Icon = filter.icon;
                  const isActive = selectedFilters.includes(filter.id);
                  return (
                    <button
                      key={filter.id}
                      onClick={() => toggleFilter(filter.id)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                        isActive ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-500' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {filter.label}
                    </button>
                  );
                })}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500 font-medium">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2.5 rounded-xl border-2 border-gray-200 bg-white text-gray-700 font-semibold focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Expanded Filters Panel */}
          {showFilters && (
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">Quick Filters</h3>
                  <div className="flex flex-wrap gap-2">
                    {FILTER_OPTIONS.map((filter) => {
                      const Icon = filter.icon;
                      const isActive = selectedFilters.includes(filter.id);
                      return (
                        <button
                          key={filter.id}
                          onClick={() => toggleFilter(filter.id)}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            isActive ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-500' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {filter.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">Price Range</h3>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="number"
                        placeholder="Min"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                        className="w-full pl-9 pr-3 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <span className="text-gray-400 font-bold">-</span>
                    <div className="relative flex-1">
                      <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="number"
                        placeholder="Max"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                        className="w-full pl-9 pr-3 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSelectedFilters([]);
                      setPriceRange({ min: '', max: '' });
                      setSelectedCategory('');
                      setSearchQuery('');
                    }}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold"
                  >
                    <X className="w-4 h-4" />
                    Clear all filters
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">
              {loading ? 'Loading...' : (
                <>
                  <span className="font-bold text-gray-900 text-lg">{totalServices}</span> services found
                  {selectedCategory && <span className="text-blue-600 font-medium"> in {selectedCategory}</span>}
                </>
              )}
            </p>
            <button onClick={fetchServices} className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold">
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
          </div>
          
          {/* Error State */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 mb-8 text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <p className="text-red-700 font-semibold text-lg mb-4">{error}</p>
              <button onClick={fetchServices} className="bg-red-100 text-red-700 px-6 py-3 rounded-xl font-bold hover:bg-red-200 transition-colors">
                Try Again
              </button>
            </div>
          )}
          
          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                  <div className="h-52 bg-gray-200" />
                  <div className="p-5 space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-16 bg-gray-100 rounded-xl" />
                    <div className="grid grid-cols-2 gap-3">
                      <div className="h-16 bg-gray-100 rounded-xl" />
                      <div className="h-16 bg-gray-100 rounded-xl" />
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1 h-12 bg-gray-200 rounded-xl" />
                      <div className="h-12 w-24 bg-gray-100 rounded-xl" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Services Grid */}
          {!loading && !error && services.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}
          
          {/* Empty State */}
          {!loading && !error && services.length === 0 && (
            <div className="text-center py-20">
              <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
                <Search className="w-16 h-16 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No services found</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                {searchQuery || selectedCategory || selectedFilters.length > 0
                  ? "Try adjusting your filters or search query to find more services"
                  : "No services are available at the moment. Check back later!"}
              </p>
              {(searchQuery || selectedCategory || selectedFilters.length > 0) && (
                <button
                  onClick={() => {
                    setSelectedFilters([]);
                    setPriceRange({ min: '', max: '' });
                    setSelectedCategory('');
                    setSearchQuery('');
                  }}
                  className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
      <ServiceDetailModal />
    </>
  );
}
