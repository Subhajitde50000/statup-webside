'use client';

import React, { useState, useEffect, use } from 'react';
import { 
  ArrowLeft, CheckCircle, Ban, MessageSquare, FileText, Mail, Phone, MapPin, 
  Calendar, Briefcase, Star, Award, TrendingUp, Clock, AlertTriangle, 
  Download, Eye, XCircle, Flag, User, Languages, DollarSign, RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import TopNavbar from '../../components/TopNavbar';
import LeftSidebar from '../../components/LeftSidebar';

interface Professional {
  id: string;
  name: string;
  email?: string;
  phone: string;
  role: string;
  is_active: boolean;
  is_verified?: boolean;
  profile_image?: string;
  created_at: string;
  updated_at: string;
}

export default function ProfessionalProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [activeTab, setActiveTab] = useState('personal');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfessionalData();
  }, [resolvedParams.id]);

  const fetchProfessionalData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        setError('No access token found. Please login.');
        return;
      }

      const response = await fetch(`http://localhost:8000/api/users/list?role=professional&per_page=100`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch professional data');
      }

      const data = await response.json();
      const foundProfessional = data.users?.find((u: Professional) => u.id === resolvedParams.id);
      
      if (!foundProfessional) {
        setError('Professional not found');
        return;
      }

      setProfessional(foundProfessional);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load professional data');
      console.error('Error fetching professional:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <TopNavbar />
        <div className="flex">
          <LeftSidebar isOpen={sidebarOpen} />
          <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
            <div className="p-8 flex items-center justify-center min-h-screen">
              <div className="text-center">
                <RefreshCw className="w-12 h-12 text-[#3B82F6] animate-spin mx-auto mb-4" />
                <p className="text-[#64748B]">Loading professional details...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error || !professional) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <TopNavbar />
        <div className="flex">
          <LeftSidebar isOpen={sidebarOpen} />
          <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
            <div className="p-8">
              <Link href="/dashboard/manager/professionals">
                <button className="flex items-center gap-2 text-[#64748B] hover:text-[#3B82F6] mb-4 transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm font-medium">Back to Professionals</span>
                </button>
              </Link>
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-12 text-center">
                <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-[#1E293B] mb-2">Error Loading Professional</h2>
                <p className="text-[#64748B]">{error || 'Professional not found'}</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <TopNavbar />
      <div className="flex">
        <LeftSidebar isOpen={sidebarOpen} />
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
          <div className="p-8">
            <div className="max-w-[1400px] mx-auto">
              {/* Header */}
              <div className="mb-8">
                <Link href="/dashboard/manager/professionals">
                  <button className="flex items-center gap-2 text-[#64748B] hover:text-[#3B82F6] mb-4 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm font-medium">Back to Professionals</span>
                  </button>
                </Link>

                <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-24 rounded-full bg-[#3B82F6] flex items-center justify-center text-white text-2xl font-bold overflow-hidden ring-4 ring-[#E2E8F0]">
                        {professional.profile_image ? (
                          <img 
                            src={`http://localhost:8000${professional.profile_image}`} 
                            alt={professional.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          professional.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <h1 className="text-2xl font-semibold text-[#1E293B] mb-2">{professional.name}</h1>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="px-3 py-1 bg-[#EFF6FF] text-[#3B82F6] rounded-full text-sm font-semibold">
                            {professional.role === 'pending_professional' ? 'Pending Professional' : 'Professional'}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            professional.is_active 
                              ? 'bg-[#D1FAE5] text-[#059669]' 
                              : 'bg-[#FEE2E2] text-[#DC2626]'
                          }`}>
                            {professional.is_active ? 'ACTIVE' : 'INACTIVE'}
                          </span>
                          {professional.is_verified && (
                            <div className="flex items-center gap-1 text-[#059669]">
                              <CheckCircle className="w-4 h-4" />
                              <span className="text-xs font-semibold">Verified</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {!professional.is_verified && (
                        <button className="px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-colors text-sm font-medium flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </button>
                      )}
                      <button className="px-4 py-2 bg-[#EF4444] text-white rounded-lg hover:bg-[#DC2626] transition-colors text-sm font-medium flex items-center gap-2">
                        <Ban className="w-4 h-4" />
                        Suspend
                      </button>
                      <button className="px-4 py-2 bg-[#DC2626] text-white rounded-lg hover:bg-[#B91C1C] transition-colors text-sm font-medium flex items-center gap-2">
                        <XCircle className="w-4 h-4" />
                        Ban
                      </button>
                      <button className="px-4 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors text-sm font-medium flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Message
                      </button>
                      <button className="px-4 py-2 bg-white border border-[#E2E8F0] text-[#64748B] rounded-lg hover:bg-[#F8FAFC] transition-colors text-sm font-medium flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        View Reports
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] mb-6 overflow-hidden">
                <div className="flex items-center gap-1 p-2 overflow-x-auto">
                  {['personal'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                        activeTab === tab
                          ? 'bg-[#3B82F6] text-white shadow-sm'
                          : 'text-[#64748B] hover:bg-[#F8FAFC]'
                      }`}
                    >
                      {tab.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Sections */}
              {activeTab === 'personal' && (
                <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-[#1E293B] mb-6">Personal Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">Full Name</label>
                        <p className="text-sm text-[#1E293B] mt-1 font-medium">{professional.name}</p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide flex items-center gap-1">
                          <Mail className="w-3 h-3" /> Email
                        </label>
                        <p className="text-sm text-[#3B82F6] mt-1">{professional.email || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide flex items-center gap-1">
                          <Phone className="w-3 h-3" /> Phone
                        </label>
                        <p className="text-sm text-[#3B82F6] mt-1">{professional.phone}</p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">Role</label>
                        <p className="text-sm text-[#1E293B] mt-1">{professional.role}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">Account Status</label>
                        <p className="text-sm text-[#1E293B] mt-1 font-medium">{professional.is_active ? 'Active' : 'Inactive'}</p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">Verification Status</label>
                        <p className="text-sm text-[#1E293B] mt-1">{professional.is_verified ? 'Verified' : 'Not Verified'}</p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> Joining Date
                        </label>
                        <p className="text-sm text-[#1E293B] mt-1">
                          {new Date(professional.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">Last Updated</label>
                        <p className="text-sm text-[#1E293B] mt-1">
                          {new Date(professional.updated_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
