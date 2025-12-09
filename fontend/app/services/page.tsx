'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Clock, DollarSign, Star, TrendingUp, Eye, EyeOff, Image as ImageIcon, Save, X, CheckCircle, Calendar, Briefcase } from 'lucide-react';
import { ProfessionalNavbar } from '../professional/components';

interface Service {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  duration: string;
  image: string;
  isActive: boolean;
  bookingsCount: number;
  rating: number;
  earnings: number;
}

export default function ServicesPage() {
  const [currentTime, setCurrentTime] = useState<string>('--:--');
  const [mounted, setMounted] = useState(false);
  const [services, setServices] = useState<Service[]>([
    {
      id: 1,
      name: 'Fan Repair & Installation',
      category: 'Electrical',
      description: 'Complete fan repair, installation, and maintenance services including cleaning, rewinding, and speed regulator replacement',
      price: 350,
      duration: '45-60 min',
      image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&h=300&fit=crop',
      isActive: true,
      bookingsCount: 45,
      rating: 4.8,
      earnings: 15750
    },
    {
      id: 2,
      name: 'Switch & Socket Installation',
      category: 'Electrical',
      description: 'Installation and replacement of electrical switches, sockets, and board fittings with safety testing',
      price: 250,
      duration: '30-45 min',
      image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=300&fit=crop',
      isActive: true,
      bookingsCount: 38,
      rating: 4.9,
      earnings: 9500
    },
    {
      id: 3,
      name: 'Wiring & Rewiring',
      category: 'Electrical',
      description: 'Complete house wiring, rewiring services, circuit installation, and electrical panel setup',
      price: 800,
      duration: '2-3 hours',
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop',
      isActive: true,
      bookingsCount: 12,
      rating: 5.0,
      earnings: 9600
    },
    {
      id: 4,
      name: 'Light Fixture Installation',
      category: 'Electrical',
      description: 'Installation of LED lights, chandeliers, tube lights, and decorative lighting with proper wiring',
      price: 400,
      duration: '45 min',
      image: 'https://images.unsplash.com/photo-1565008576549-57569a49371d?w=400&h=300&fit=crop',
      isActive: true,
      bookingsCount: 28,
      rating: 4.7,
      earnings: 11200
    },
    {
      id: 5,
      name: 'Electrical Troubleshooting',
      category: 'Electrical',
      description: 'Diagnose and fix electrical issues, short circuits, tripping problems, and power fluctuations',
      price: 500,
      duration: '60-90 min',
      image: 'https://images.unsplash.com/photo-1621905252472-be5c44c3e8c0?w=400&h=300&fit=crop',
      isActive: false,
      bookingsCount: 20,
      rating: 4.6,
      earnings: 10000
    },
    {
      id: 6,
      name: 'Inverter & UPS Service',
      category: 'Electrical',
      description: 'Inverter installation, battery replacement, UPS repair, and backup power system maintenance',
      price: 600,
      duration: '60 min',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
      isActive: true,
      bookingsCount: 15,
      rating: 4.9,
      earnings: 9000
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

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

  const totalServices = services.length;
  const activeServices = services.filter(s => s.isActive).length;
  const totalEarnings = services.reduce((sum, s) => sum + s.earnings, 0);
  const totalBookings = services.reduce((sum, s) => sum + s.bookingsCount, 0);
  const avgRating = (services.reduce((sum, s) => sum + s.rating * s.bookingsCount, 0) / totalBookings).toFixed(1);

  const filteredServices = services.filter(service => {
    if (filterStatus === 'active') return service.isActive;
    if (filterStatus === 'inactive') return !service.isActive;
    return true;
  });

  const toggleServiceStatus = (id: number) => {
    setServices(services.map(service => 
      service.id === id ? { ...service, isActive: !service.isActive } : service
    ));
  };

  const deleteService = (id: number) => {
    if (confirm('Are you sure you want to delete this service?')) {
      setServices(services.filter(service => service.id !== id));
    }
  };

  const ServiceCard = ({ service }: { service: Service }) => (
    <div className={`bg-white rounded-3xl shadow-lg overflow-hidden border-2 ${service.isActive ? 'border-teal-200' : 'border-gray-200'} hover:shadow-2xl transition-all transform hover:-translate-y-1`}>
      {/* Image Header */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={service.image} 
          alt={service.name}
          className="w-full h-full object-cover"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${service.isActive ? 'from-teal-600/60 to-blue-600/40' : 'from-gray-600/60 to-gray-400/40'}`}></div>
        
        {/* Status Badge */}
        <div className={`absolute top-3 right-3 ${service.isActive ? 'bg-green-500' : 'bg-gray-500'} text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1`}>
          <span className={`w-2 h-2 rounded-full ${service.isActive ? 'bg-white animate-pulse' : 'bg-gray-300'}`}></span>
          {service.isActive ? 'ACTIVE' : 'INACTIVE'}
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-gray-900 font-bold text-xs px-3 py-1.5 rounded-full shadow-lg">
          {service.category}
        </div>

        {/* Rating */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-lg flex items-center gap-2">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="font-black text-gray-900">{service.rating}</span>
          <span className="text-xs text-gray-600 font-semibold">({service.bookingsCount})</span>
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
            <p className="text-lg font-black text-green-900">{service.bookingsCount}</p>
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
            onClick={() => toggleServiceStatus(service.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold transition-all ${
              service.isActive 
                ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border-2 border-yellow-300'
                : 'bg-green-100 hover:bg-green-200 text-green-800 border-2 border-green-300'
            }`}
          >
            {service.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{service.isActive ? 'Deactivate' : 'Activate'}</span>
          </button>
          <button
            onClick={() => setEditingService(service)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-xl font-bold border-2 border-blue-300 transition-all"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => deleteService(service.id)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-100 hover:bg-red-200 text-red-800 rounded-xl font-bold border-2 border-red-300 transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

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
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span>Add New Service</span>
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-md border-2 border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-teal-600" />
              <span className="text-xs text-gray-600 font-semibold">Total</span>
            </div>
            <p className="text-3xl font-black text-gray-900">{totalServices}</p>
            <p className="text-xs text-gray-600 font-semibold">Services</p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-md border-2 border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-5 h-5 text-green-600" />
              <span className="text-xs text-gray-600 font-semibold">Active</span>
            </div>
            <p className="text-3xl font-black text-green-600">{activeServices}</p>
            <p className="text-xs text-gray-600 font-semibold">Available</p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-md border-2 border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span className="text-xs text-gray-600 font-semibold">Total</span>
            </div>
            <p className="text-3xl font-black text-blue-600">{totalBookings}</p>
            <p className="text-xs text-gray-600 font-semibold">Bookings</p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-md border-2 border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="text-xs text-gray-600 font-semibold">Rating</span>
            </div>
            <p className="text-3xl font-black text-yellow-600">{avgRating}</p>
            <p className="text-xs text-gray-600 font-semibold">Average</p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-md border-2 border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className="text-xs text-gray-600 font-semibold">Total</span>
            </div>
            <p className="text-2xl font-black text-green-600">₹{totalEarnings.toLocaleString()}</p>
            <p className="text-xs text-gray-600 font-semibold">Earned</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-3">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-5 py-2.5 rounded-xl font-bold transition-all ${
              filterStatus === 'all'
                ? 'bg-teal-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:bg-gray-50'
            }`}
          >
            All Services ({totalServices})
          </button>
          <button
            onClick={() => setFilterStatus('active')}
            className={`px-5 py-2.5 rounded-xl font-bold transition-all ${
              filterStatus === 'active'
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:bg-gray-50'
            }`}
          >
            Active ({activeServices})
          </button>
          <button
            onClick={() => setFilterStatus('inactive')}
            className={`px-5 py-2.5 rounded-xl font-bold transition-all ${
              filterStatus === 'inactive'
                ? 'bg-gray-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:bg-gray-50'
            }`}
          >
            Inactive ({totalServices - activeServices})
          </button>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map(service => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        {/* Empty State */}
        {filteredServices.length === 0 && (
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
                onClick={() => setShowAddModal(true)}
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 rounded-xl transition-colors"
              >
                Add Your First Service
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
