'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Plus, Edit, Trash2, Clock, DollarSign, Star, TrendingUp, Eye, EyeOff, Save, X, 
  CheckCircle, Calendar, Briefcase, Loader2, AlertCircle, Upload, MapPin, Tag, 
  ChevronRight, ChevronLeft, Image as ImageIcon, Zap, Wrench, Droplet, Hammer,
  PaintBucket, Wind, Package, Sparkles, Home, Shield, Sun, Check
} from 'lucide-react';
import { ProfessionalNavbar } from '../professional/components';
import { 
  Service, 
  ServiceCreate, 
  ServiceUpdate, 
  ServiceStats,
  getMyServices, 
  createService, 
  updateService, 
  deleteService, 
  toggleServiceStatus 
} from '../../utils/services';
import { useAuth } from '../../utils/AuthContext';

// Service categories with icons
const SERVICE_CATEGORIES = [
  { value: 'Electrical', label: 'Electrical', icon: Zap, color: 'yellow' },
  { value: 'Plumbing', label: 'Plumbing', icon: Droplet, color: 'blue' },
  { value: 'Carpentry', label: 'Carpentry', icon: Hammer, color: 'orange' },
  { value: 'Painting', label: 'Painting', icon: PaintBucket, color: 'purple' },
  { value: 'AC & Refrigeration', label: 'AC & Refrigeration', icon: Wind, color: 'cyan' },
  { value: 'Appliance Repair', label: 'Appliance Repair', icon: Wrench, color: 'red' },
  { value: 'Cleaning', label: 'Cleaning', icon: Sparkles, color: 'green' },
  { value: 'Pest Control', label: 'Pest Control', icon: Shield, color: 'lime' },
  { value: 'Home Renovation', label: 'Home Renovation', icon: Home, color: 'indigo' },
  { value: 'Security Systems', label: 'Security Systems', icon: Shield, color: 'gray' },
  { value: 'Solar Installation', label: 'Solar Installation', icon: Sun, color: 'amber' },
  { value: 'Other', label: 'Other Services', icon: Package, color: 'slate' }
];

// Common service durations
const DURATION_OPTIONS = [
  '15-30 min',
  '30-45 min',
  '45-60 min',
  '1-2 hours',
  '2-3 hours',
  '3-4 hours',
  'Half day (4-6 hours)',
  'Full day (8+ hours)',
  'Multiple days'
];

export default function ServicesPage() {
  const { user, isAuthenticated } = useAuth();
  const [currentTime, setCurrentTime] = useState<string>('--:--');
  const [mounted, setMounted] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [stats, setStats] = useState<ServiceStats>({
    total_services: 0,
    active_services: 0,
    total_bookings: 0,
    total_earnings: 0,
    avg_rating: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  // Multi-step form state
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  // Form state interface for handling input
  interface ServiceFormData {
    name: string;
    category: string;
    description: string;
    price: number;
    duration: string;
    image: string;
    is_active: boolean;
    serviceArea: string;
    tags: string;  // String for input, converted to array on submit
  }

  // Form state with enhanced fields
  const [formData, setFormData] = useState<ServiceFormData>({
    name: '',
    category: 'Electrical',
    description: '',
    price: 0,
    duration: '45-60 min',
    image: '',
    is_active: true,
    serviceArea: '',
    tags: ''
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  
  // Image upload state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageUploading, setImageUploading] = useState(false);

  // Fetch services
  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: { is_active?: boolean } = {};
      if (filterStatus === 'active') params.is_active = true;
      if (filterStatus === 'inactive') params.is_active = false;
      
      const response = await getMyServices(params);
      setServices(response.services);
      if (response.stats) {
        setStats(response.stats);
      }
    } catch (err: any) {
      console.error('Error fetching services:', err);
      setError(err.message || 'Failed to load services');
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (mounted && isAuthenticated) {
      fetchServices();
    }
  }, [mounted, isAuthenticated, fetchServices]);

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      category: 'Electrical',
      description: '',
      price: 0,
      duration: '45-60 min',
      image: '',
      is_active: true,
      serviceArea: '',
      tags: ''
    });
    setFormError(null);
    setCurrentStep(1);
    setImageFile(null);
    setImagePreview('');
  };

  // Handle image file selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setFormError('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setFormError('Image size must be less than 5MB');
      return;
    }

    setImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    setFormError(null);
  };

  // Upload image to server
  const uploadImage = async (): Promise<string> => {
    if (!imageFile) return formData.image || '';

    setImageUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', imageFile);

      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/upload/document', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataUpload,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      return `http://localhost:8000${data.file_path}`;
    } catch (err: any) {
      console.error('Error uploading image:', err);
      throw new Error('Failed to upload image. Please try again.');
    } finally {
      setImageUploading(false);
    }
  };

  // Open add modal
  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  // Open edit modal
  const openEditModal = (service: Service) => {
    setFormData({
      name: service.name,
      category: service.category,
      description: service.description,
      price: service.price,
      duration: service.duration,
      image: service.image || '',
      is_active: service.is_active,
      serviceArea: service.service_area || '',
      tags: (service.tags || []).join(', ')
    });
    setImagePreview(service.image || '');
    setEditingService(service);
    setFormError(null);
    setCurrentStep(1);
  };

  // Close modals
  const closeModals = () => {
    setShowAddModal(false);
    setEditingService(null);
    resetForm();
  };

  // Validate current step
  const validateStep = (step: number): boolean => {
    setFormError(null);

    if (step === 1) {
      if (!formData.name.trim()) {
        setFormError('Service name is required');
        return false;
      }
      if (formData.name.length < 5) {
        setFormError('Service name must be at least 5 characters');
        return false;
      }
      if (!formData.category) {
        setFormError('Please select a category');
        return false;
      }
    }

    if (step === 2) {
      if (!formData.description.trim() || formData.description.length < 20) {
        setFormError('Description must be at least 20 characters');
        return false;
      }
      if (formData.price <= 0) {
        setFormError('Price must be greater than 0');
        return false;
      }
      if (formData.price > 100000) {
        setFormError('Price seems too high. Please enter a valid amount.');
        return false;
      }
      if (!formData.duration) {
        setFormError('Please select service duration');
        return false;
      }
    }

    return true;
  };

  // Next step
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  // Previous step
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setFormError(null);
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      return;
    }

    setFormError(null);
    setFormLoading(true);

    try {
      // Upload image if selected
      let imageUrl = formData.image;
      if (imageFile) {
        imageUrl = await uploadImage();
      }

      const serviceData: ServiceCreate | ServiceUpdate = {
        name: formData.name.trim(),
        category: formData.category,
        description: formData.description.trim(),
        price: formData.price,
        duration: formData.duration.trim(),
        image: imageUrl || undefined,
        is_active: formData.is_active
      };

      if (editingService) {
        await updateService(editingService.id, serviceData);
      } else {
        await createService(serviceData as ServiceCreate);
      }

      closeModals();
      fetchServices();
    } catch (err: any) {
      console.error('Error saving service:', err);
      setFormError(err.message || 'Failed to save service');
    } finally {
      setFormLoading(false);
    }
  };

  // Toggle service status
  const handleToggleStatus = async (serviceId: string) => {
    try {
      setActionLoading(serviceId);
      await toggleServiceStatus(serviceId);
      fetchServices();
    } catch (err: any) {
      console.error('Error toggling status:', err);
      setError(err.message || 'Failed to update service status');
    } finally {
      setActionLoading(null);
    }
  };

  // Delete service
  const handleDelete = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
      return;
    }

    try {
      setActionLoading(serviceId);
      await deleteService(serviceId);
      fetchServices();
    } catch (err: any) {
      console.error('Error deleting service:', err);
      setError(err.message || 'Failed to delete service');
    } finally {
      setActionLoading(null);
    }
  };

  const ServiceCard = ({ service }: { service: Service }) => (
    <div className={`bg-white rounded-3xl shadow-lg overflow-hidden border-2 ${service.is_active ? 'border-teal-200' : 'border-gray-200'} hover:shadow-2xl transition-all transform hover:-translate-y-1`}>
      {/* Image Header */}
      <div className="relative h-48 overflow-hidden">
        {service.image ? (
          <img 
            src={service.image} 
            alt={service.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Service';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center">
            <Briefcase className="w-16 h-16 text-white/80" />
          </div>
        )}
        <div className={`absolute inset-0 bg-gradient-to-t ${service.is_active ? 'from-teal-600/60 to-blue-600/40' : 'from-gray-600/60 to-gray-400/40'}`}></div>
        
        {/* Status Badge */}
        <div className={`absolute top-3 right-3 ${service.is_active ? 'bg-green-500' : 'bg-gray-500'} text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1`}>
          <span className={`w-2 h-2 rounded-full ${service.is_active ? 'bg-white animate-pulse' : 'bg-gray-300'}`}></span>
          {service.is_active ? 'ACTIVE' : 'INACTIVE'}
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-gray-900 font-bold text-xs px-3 py-1.5 rounded-full shadow-lg">
          {service.category}
        </div>

        {/* Rating */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-lg flex items-center gap-2">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="font-black text-gray-900">{service.rating.toFixed(1)}</span>
          <span className="text-xs text-gray-600 font-semibold">({service.total_ratings})</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-black text-gray-900 mb-2">
          {service.name}
        </h3>
        <p className="text-gray-600 text-sm font-medium mb-4 line-clamp-2">
          {service.description}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-blue-50 rounded-xl p-3 text-center border-2 border-blue-200">
            <DollarSign className="w-4 h-4 text-blue-600 mx-auto mb-1" />
            <p className="text-lg font-black text-blue-900">₹{service.price}</p>
            <p className="text-xs text-gray-600 font-semibold">Price</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-3 text-center border-2 border-purple-200">
            <Clock className="w-4 h-4 text-purple-600 mx-auto mb-1" />
            <p className="text-sm font-black text-purple-900">{service.duration}</p>
            <p className="text-xs text-gray-600 font-semibold">Duration</p>
          </div>
          <div className="bg-green-50 rounded-xl p-3 text-center border-2 border-green-200">
            <TrendingUp className="w-4 h-4 text-green-600 mx-auto mb-1" />
            <p className="text-lg font-black text-green-900">{service.bookings_count}</p>
            <p className="text-xs text-gray-600 font-semibold">Bookings</p>
          </div>
        </div>

        {/* Earnings */}
        <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-3 mb-4 border-2 border-green-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">Total Earned</span>
            <span className="text-xl font-black text-green-700">₹{service.earnings.toLocaleString()}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => handleToggleStatus(service.id)}
            disabled={actionLoading === service.id}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold transition-all disabled:opacity-50 ${
              service.is_active 
                ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border-2 border-yellow-300'
                : 'bg-green-100 hover:bg-green-200 text-green-800 border-2 border-green-300'
            }`}
          >
            {actionLoading === service.id ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : service.is_active ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
            <span>{service.is_active ? 'Deactivate' : 'Activate'}</span>
          </button>
          <button
            onClick={() => openEditModal(service)}
            disabled={actionLoading === service.id}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-xl font-bold border-2 border-blue-300 transition-all disabled:opacity-50"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(service.id)}
            disabled={actionLoading === service.id}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-100 hover:bg-red-200 text-red-800 rounded-xl font-bold border-2 border-red-300 transition-all disabled:opacity-50"
          >
            {actionLoading === service.id ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );

  // Enhanced Service Form Modal with Multi-Step Wizard
  const ServiceFormModal = () => {
    const selectedCategory = SERVICE_CATEGORIES.find(cat => cat.value === formData.category);
    const CategoryIcon = selectedCategory?.icon || Package;

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[95vh] overflow-hidden flex flex-col">
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-teal-500 to-blue-500 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-black text-white">
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h2>
              <button
                onClick={closeModals}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((step) => (
                <React.Fragment key={step}>
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                      currentStep >= step 
                        ? 'bg-white text-teal-600' 
                        : 'bg-white/30 text-white/70'
                    }`}>
                      {currentStep > step ? <Check className="w-5 h-5" /> : step}
                    </div>
                    <span className="text-xs text-white/90 mt-1 font-semibold">
                      {step === 1 ? 'Basic Info' : step === 2 ? 'Details' : 'Preview'}
                    </span>
                  </div>
                  {step < 3 && (
                    <div className={`flex-1 h-1 mx-2 rounded ${
                      currentStep > step ? 'bg-white' : 'bg-white/30'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              {formError && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-red-700 font-medium">{formError}</p>
                </div>
              )}

              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-5">
                  <div className="text-center pb-4">
                    <h3 className="text-xl font-black text-gray-900 mb-2">Service Basic Information</h3>
                    <p className="text-gray-600">Tell us about your service offering</p>
                  </div>

                  {/* Service Name */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Service Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all font-medium"
                      placeholder="e.g., Complete Home Electrical Repair & Installation"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Choose a clear, descriptive name for your service</p>
                  </div>

                  {/* Category Selection with Icons */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      Service Category *
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {SERVICE_CATEGORIES.map((category) => {
                        const Icon = category.icon;
                        const isSelected = formData.category === category.value;
                        return (
                          <button
                            key={category.value}
                            type="button"
                            onClick={() => setFormData({ ...formData, category: category.value })}
                            className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                              isSelected
                                ? 'border-teal-500 bg-teal-50'
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                          >
                            <Icon className={`w-6 h-6 ${isSelected ? 'text-teal-600' : 'text-gray-400'}`} />
                            <span className={`text-xs font-semibold text-center ${
                              isSelected ? 'text-teal-700' : 'text-gray-600'
                            }`}>
                              {category.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Service Area */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Service Area (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.serviceArea}
                      onChange={(e) => setFormData({ ...formData, serviceArea: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all font-medium"
                      placeholder="e.g., Mumbai, Thane, Navi Mumbai"
                    />
                    <p className="text-xs text-gray-500 mt-1">Specify cities or areas where you provide this service</p>
                  </div>
                </div>
              )}

              {/* Step 2: Pricing & Details */}
              {currentStep === 2 && (
                <div className="space-y-5">
                  <div className="text-center pb-4">
                    <h3 className="text-xl font-black text-gray-900 mb-2">Service Details</h3>
                    <p className="text-gray-600">Set pricing and describe your service</p>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Detailed Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all font-medium resize-none"
                      rows={4}
                      placeholder="Describe your service in detail... What's included? What makes it special? Any guarantees or warranties?"
                      required
                      minLength={20}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.description.length}/1000 characters • Minimum 20 characters
                    </p>
                  </div>

                  {/* Price and Duration */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        <DollarSign className="w-4 h-4 inline mr-1" />
                        Service Price (₹) *
                      </label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all font-medium"
                        placeholder="500"
                        min="0"
                        step="10"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">Base price for this service</p>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        <Clock className="w-4 h-4 inline mr-1" />
                        Duration *
                      </label>
                      <select
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all font-medium"
                        required
                      >
                        {DURATION_OPTIONS.map((duration) => (
                          <option key={duration} value={duration}>{duration}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      <Tag className="w-4 h-4 inline mr-1" />
                      Tags (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all font-medium"
                      placeholder="emergency, 24/7, certified, warranty"
                    />
                    <p className="text-xs text-gray-500 mt-1">Comma-separated keywords to help customers find your service</p>
                  </div>
                </div>
              )}

              {/* Step 3: Image & Preview */}
              {currentStep === 3 && (
                <div className="space-y-5">
                  <div className="text-center pb-4">
                    <h3 className="text-xl font-black text-gray-900 mb-2">Service Image & Preview</h3>
                    <p className="text-gray-600">Add an image and review your service</p>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      <ImageIcon className="w-4 h-4 inline mr-1" />
                      Service Image
                    </label>
                    
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Service preview"
                          className="w-full h-64 object-cover rounded-2xl border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview('');
                            setImageFile(null);
                            setFormData({ ...formData, image: '' });
                          }}
                          className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex flex-col items-center justify-center py-8">
                          <Upload className="w-12 h-12 text-gray-400 mb-4" />
                          <p className="text-sm font-bold text-gray-700 mb-1">Click to upload image</p>
                          <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageSelect}
                        />
                      </label>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      A high-quality image helps attract more customers
                    </p>
                  </div>

                  {/* Service Preview Card */}
                  <div className="bg-gradient-to-br from-gray-50 to-teal-50 p-6 rounded-2xl border-2 border-teal-200">
                    <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Eye className="w-5 h-5 text-teal-600" />
                      Service Preview
                    </h4>
                    
                    <div className="bg-white rounded-xl p-5 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CategoryIcon className="w-5 h-5 text-teal-600" />
                            <span className="text-xs font-bold text-gray-600 uppercase">{formData.category}</span>
                          </div>
                          <h5 className="text-lg font-black text-gray-900 mb-1">{formData.name || 'Service Name'}</h5>
                          <p className="text-sm text-gray-600 line-clamp-2">{formData.description || 'Service description...'}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3 pt-3 border-t-2 border-gray-100">
                        <div className="text-center">
                          <p className="text-xs text-gray-600 font-semibold mb-1">Price</p>
                          <p className="text-lg font-black text-blue-600">₹{formData.price}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-600 font-semibold mb-1">Duration</p>
                          <p className="text-sm font-bold text-purple-600">{formData.duration}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-600 font-semibold mb-1">Status</p>
                          <p className="text-sm font-bold text-green-600">
                            {formData.is_active ? 'Active' : 'Inactive'}
                          </p>
                        </div>
                      </div>
                      
                      {formData.serviceArea && (
                        <div className="pt-2 flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 text-teal-600" />
                          <span>{formData.serviceArea}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Active Status Toggle */}
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                    <div>
                      <p className="font-bold text-gray-900 mb-1">Publish Service</p>
                      <p className="text-sm text-gray-600">Make this service visible and bookable by customers</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-teal-500"></div>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Form Footer with Navigation */}
            <div className="border-t-2 border-gray-100 p-6 bg-gray-50">
              <div className="flex justify-between gap-4">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-100 text-gray-700 font-bold rounded-xl border-2 border-gray-300 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    <span>Previous</span>
                  </button>
                )}

                <div className="flex-1" />

                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-bold rounded-xl transition-all"
                  >
                    <span>Next Step</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={formLoading || imageUploading}
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {formLoading || imageUploading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>{imageUploading ? 'Uploading...' : 'Saving...'}</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>{editingService ? 'Update Service' : 'Create Service'}</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Check authentication
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-teal-500 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please login to access your services.</p>
          <a
            href="/auth"
            className="inline-block bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-bold py-3 px-8 rounded-xl transition-all"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  if (user?.role !== 'professional') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">This page is only accessible to professionals.</p>
          <a
            href="/"
            className="inline-block bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-bold py-3 px-8 rounded-xl transition-all"
          >
            Go Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50">
      {/* Navbar */}
      <ProfessionalNavbar
        activeTab="services"
        notificationCount={3}
        currentTime={currentTime}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-1">
                My Services
              </h1>
              <p className="text-gray-600 font-medium">
                Manage your service offerings and pricing
              </p>
            </div>
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span>Add New Service</span>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700 font-medium">{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-md border-2 border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-teal-600" />
              <span className="text-xs text-gray-600 font-semibold">Total</span>
            </div>
            <p className="text-3xl font-black text-gray-900">{stats.total_services}</p>
            <p className="text-xs text-gray-600 font-semibold">Services</p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-md border-2 border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-5 h-5 text-green-600" />
              <span className="text-xs text-gray-600 font-semibold">Active</span>
            </div>
            <p className="text-3xl font-black text-green-600">{stats.active_services}</p>
            <p className="text-xs text-gray-600 font-semibold">Available</p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-md border-2 border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span className="text-xs text-gray-600 font-semibold">Total</span>
            </div>
            <p className="text-3xl font-black text-blue-600">{stats.total_bookings}</p>
            <p className="text-xs text-gray-600 font-semibold">Bookings</p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-md border-2 border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="text-xs text-gray-600 font-semibold">Rating</span>
            </div>
            <p className="text-3xl font-black text-yellow-600">{stats.avg_rating.toFixed(1)}</p>
            <p className="text-xs text-gray-600 font-semibold">Average</p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-md border-2 border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className="text-xs text-gray-600 font-semibold">Total</span>
            </div>
            <p className="text-2xl font-black text-green-600">₹{stats.total_earnings.toLocaleString()}</p>
            <p className="text-xs text-gray-600 font-semibold">Earned</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-3 flex-wrap">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-5 py-2.5 rounded-xl font-bold transition-all ${
              filterStatus === 'all'
                ? 'bg-teal-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:bg-gray-50'
            }`}
          >
            All Services ({stats.total_services})
          </button>
          <button
            onClick={() => setFilterStatus('active')}
            className={`px-5 py-2.5 rounded-xl font-bold transition-all ${
              filterStatus === 'active'
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:bg-gray-50'
            }`}
          >
            Active ({stats.active_services})
          </button>
          <button
            onClick={() => setFilterStatus('inactive')}
            className={`px-5 py-2.5 rounded-xl font-bold transition-all ${
              filterStatus === 'inactive'
                ? 'bg-gray-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:bg-gray-50'
            }`}
          >
            Inactive ({stats.total_services - stats.active_services})
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-teal-500 animate-spin" />
          </div>
        ) : (
          <>
            {/* Services Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map(service => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>

            {/* Empty State */}
            {services.length === 0 && (
              <div className="text-center py-16">
                <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Services Found</h3>
                <p className="text-gray-600 mb-6">
                  {filterStatus === 'all' 
                    ? 'Start by adding your first service'
                    : `No ${filterStatus} services available`}
                </p>
                {filterStatus === 'all' && (
                  <button
                    onClick={openAddModal}
                    className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 rounded-xl transition-colors"
                  >
                    Add Your First Service
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* Modals */}
      {(showAddModal || editingService) && <ServiceFormModal />}
    </div>
  );
}
