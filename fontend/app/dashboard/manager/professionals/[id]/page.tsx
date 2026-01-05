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
  is_suspended?: boolean;
  suspension_reason?: string;
  suspended_at?: string;
  approval_data?: {
    profession?: string;
    category?: string;
    experience?: string;
    experience_years?: number;
    hourly_rate?: number;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    bio?: string;
    skills?: string[];
    languages?: string[];
    certifications?: string[];
    availability?: string;
  };
}

export default function ProfessionalProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [activeTab, setActiveTab] = useState('personal');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [suspending, setSuspending] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [suspensionReason, setSuspensionReason] = useState('');
  const [bookings, setBookings] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalJobs: 0,
    completedJobs: 0,
    rating: 0,
    earnings: 0,
    responseTime: 'N/A',
    completionRate: 0,
    satisfactionRate: 0
  });

  useEffect(() => {
    fetchProfessionalData();
    fetchBookingsData();
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

  const fetchBookingsData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      // Fetch bookings for this professional
      const bookingsResponse = await fetch(`http://localhost:8000/api/bookings?professional_id=${resolvedParams.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json();
        const allBookings = bookingsData.bookings || [];
        setBookings(allBookings);

        // Calculate statistics
        const completed = allBookings.filter((b: any) => b.status === 'completed');
        const totalEarnings = completed.reduce((sum: number, b: any) => sum + (b.total_amount || 0), 0);
        const avgRating = completed.length > 0 
          ? completed.reduce((sum: number, b: any) => sum + (b.rating || 0), 0) / completed.length 
          : 0;

        setStats({
          totalJobs: allBookings.length,
          completedJobs: completed.length,
          rating: avgRating,
          earnings: totalEarnings,
          responseTime: allBookings.length > 0 ? '2 hours' : 'N/A',
          completionRate: allBookings.length > 0 ? (completed.length / allBookings.length) * 100 : 0,
          satisfactionRate: avgRating > 0 ? (avgRating / 5) * 100 : 0
        });
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    }
  };

  // Open modal to suspend/unsuspend
  const handleOpenSuspendModal = () => {
    if (!professional) return;
    // If already suspended, prefill the reason for context
    setSuspensionReason(professional.is_suspended ? (professional.suspension_reason || '') : '');
    setShowSuspendModal(true);
  };

  const handleCloseSuspendModal = () => {
    setShowSuspendModal(false);
    setSuspensionReason('');
  };

  const handleConfirmSuspend = async () => {
    if (!professional) return;

    // If suspending, require a reason
    if (!professional.is_suspended && !suspensionReason.trim()) {
      alert('Please enter a suspension reason.');
      return;
    }

    try {
      setSuspending(true);
      const token = localStorage.getItem('access_token');
      if (!token) {
        alert('No access token found. Please login.');
        return;
      }

      const endpoint = professional.is_suspended
        ? `http://localhost:8000/api/users/${professional.id}/unsuspend`
        : `http://localhost:8000/api/users/${professional.id}/suspend?suspension_reason=${encodeURIComponent(suspensionReason)}`;

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Failed to update suspension status');
      }

      // Determine action based on previous state
      const action = professional.is_suspended ? 'unsuspended' : 'suspended';

      await fetchProfessionalData();
      await fetchBookingsData();
      handleCloseSuspendModal();
      alert(`Professional ${action} successfully!`);
    } catch (err) {
      console.error('Error updating suspension:', err);
      alert(err instanceof Error ? err.message : 'Failed to update suspension status');
    } finally {
      setSuspending(false);
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
                          {professional.is_suspended && (
                            <>
                              <span className="px-3 py-1 bg-[#FEF3C7] text-[#D97706] rounded-full text-xs font-semibold">
                                SUSPENDED
                              </span>
                              {professional.suspension_reason && (
                                <p className="text-xs text-[#D97706] mt-1">Reason: {professional.suspension_reason}</p>
                              )}
                            </>
                          )}
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
                      <button 
                        onClick={handleOpenSuspendModal}
                        disabled={suspending}
                        className={`px-4 py-2 text-white rounded-lg transition-colors text-sm font-medium flex items-center gap-2 ${
                          professional.is_suspended 
                            ? 'bg-[#10B981] hover:bg-[#059669]' 
                            : 'bg-[#EF4444] hover:bg-[#DC2626]'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <Ban className="w-4 h-4" />
                        {suspending ? 'Processing...' : professional.is_suspended ? 'Unsuspend' : 'Suspend'}
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
                  {['personal', 'working', 'reports'].map((tab) => (
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
                        <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> Address
                        </label>
                        <p className="text-sm text-[#1E293B] mt-1">
                          {professional.approval_data?.address || 'Not provided'}
                          {professional.approval_data?.city && `, ${professional.approval_data.city}`}
                          {professional.approval_data?.state && `, ${professional.approval_data.state}`}
                          {professional.approval_data?.pincode && ` - ${professional.approval_data.pincode}`}
                        </p>
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
                      {professional.approval_data?.bio && (
                        <div>
                          <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">Bio</label>
                          <p className="text-sm text-[#1E293B] mt-1">{professional.approval_data.bio}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'working' && (
                <div className="space-y-6">
                  {/* Professional Information */}
                  <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-[#1E293B] mb-6 flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-[#3B82F6]" />
                      Professional Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">Profession</label>
                        <p className="text-sm text-[#1E293B] mt-1 font-medium">{professional.approval_data?.profession || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">Category</label>
                        <p className="text-sm text-[#1E293B] mt-1">{professional.approval_data?.category || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide flex items-center gap-1">
                          <Award className="w-3 h-3" /> Experience
                        </label>
                        <p className="text-sm text-[#1E293B] mt-1">
                          {professional.approval_data?.experience_years 
                            ? `${professional.approval_data.experience_years} years` 
                            : professional.approval_data?.experience || 'Not specified'}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide flex items-center gap-1">
                          <DollarSign className="w-3 h-3" /> Hourly Rate
                        </label>
                        <p className="text-sm text-[#059669] mt-1 font-semibold">
                          {professional.approval_data?.hourly_rate 
                            ? `₹${professional.approval_data.hourly_rate}/hr` 
                            : 'Not set'}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wide flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Availability
                        </label>
                        <p className="text-sm text-[#1E293B] mt-1">{professional.approval_data?.availability || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Skills & Languages */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                      <h3 className="text-md font-semibold text-[#1E293B] mb-4 flex items-center gap-2">
                        <Star className="w-4 h-4 text-[#F59E0B]" />
                        Skills
                      </h3>
                      {professional.approval_data?.skills && professional.approval_data.skills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {professional.approval_data.skills.map((skill, index) => (
                            <span key={index} className="px-3 py-1 bg-[#EFF6FF] text-[#3B82F6] rounded-full text-xs font-medium">
                              {skill}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-[#94A3B8]">No skills added</p>
                      )}
                    </div>

                    <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                      <h3 className="text-md font-semibold text-[#1E293B] mb-4 flex items-center gap-2">
                        <Languages className="w-4 h-4 text-[#8B5CF6]" />
                        Languages
                      </h3>
                      {professional.approval_data?.languages && professional.approval_data.languages.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {professional.approval_data.languages.map((language, index) => (
                            <span key={index} className="px-3 py-1 bg-[#F3E8FF] text-[#8B5CF6] rounded-full text-xs font-medium">
                              {language}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-[#94A3B8]">No languages specified</p>
                      )}
                    </div>
                  </div>

                  {/* Certifications */}
                  {professional.approval_data?.certifications && professional.approval_data.certifications.length > 0 && (
                    <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                      <h3 className="text-md font-semibold text-[#1E293B] mb-4 flex items-center gap-2">
                        <Award className="w-4 h-4 text-[#10B981]" />
                        Certifications
                      </h3>
                      <div className="space-y-2">
                        {professional.approval_data.certifications.map((cert, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-[#1E293B]">
                            <CheckCircle className="w-4 h-4 text-[#10B981]" />
                            {cert}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Work Statistics */}
                  <div className="bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-xl p-6 text-white shadow-lg">
                    <h3 className="text-md font-semibold mb-4">Work Statistics</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white/10 rounded-lg p-4">
                        <p className="text-xs opacity-75 mb-1">Total Jobs</p>
                        <p className="text-2xl font-bold">{stats.totalJobs}</p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <p className="text-xs opacity-75 mb-1">Completed</p>
                        <p className="text-2xl font-bold">{stats.completedJobs}</p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <p className="text-xs opacity-75 mb-1">Rating</p>
                        <p className="text-2xl font-bold">{stats.rating.toFixed(1)}</p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <p className="text-xs opacity-75 mb-1">Earnings</p>
                        <p className="text-2xl font-bold">₹{stats.earnings.toFixed(0)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Recent Bookings */}
                  {bookings.length > 0 && (
                    <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                      <h3 className="text-md font-semibold text-[#1E293B] mb-4 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#3B82F6]" />
                        Recent Bookings
                      </h3>
                      <div className="space-y-3">
                        {bookings.slice(0, 5).map((booking: any) => (
                          <div key={booking.id} className="flex items-center justify-between p-3 bg-[#F8FAFC] rounded-lg">
                            <div>
                              <p className="text-sm font-medium text-[#1E293B]">{booking.service_name || 'Service'}</p>
                              <p className="text-xs text-[#64748B]">{new Date(booking.created_at).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                booking.status === 'completed' ? 'bg-[#D1FAE5] text-[#059669]' :
                                booking.status === 'confirmed' ? 'bg-[#DBEAFE] text-[#2563EB]' :
                                booking.status === 'cancelled' ? 'bg-[#FEE2E2] text-[#DC2626]' :
                                'bg-[#FEF3C7] text-[#D97706]'
                              }`}>
                                {booking.status}
                              </span>
                              <p className="text-sm font-semibold text-[#1E293B] mt-1">₹{booking.total_amount || 0}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'reports' && (
                <div className="space-y-6">
                  {/* Suspension/Warning History */}
                  <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-[#1E293B] mb-6 flex items-center gap-2">
                      <Flag className="w-5 h-5 text-[#EF4444]" />
                      Account Actions History
                    </h2>
                    {professional.is_suspended ? (
                      <div className="bg-[#FEF3C7] border border-[#FCD34D] rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-[#D97706] mt-0.5" />
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-[#D97706] mb-1">Currently Suspended</h4>
                            <p className="text-sm text-[#92400E] mb-2">
                              <strong>Reason:</strong> {professional.suspension_reason || 'No reason provided'}
                            </p>
                            {professional.suspended_at && (
                              <p className="text-xs text-[#92400E]">
                                Suspended on: {new Date(professional.suspended_at).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-[#D1FAE5] border border-[#6EE7B7] rounded-lg p-4">
                        <div className="flex items-center gap-2 text-[#059669]">
                          <CheckCircle className="w-5 h-5" />
                          <span className="text-sm font-medium">No active suspensions or warnings</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Manager Notes */}
                  <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-[#1E293B] mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-[#3B82F6]" />
                      Manager Notes
                    </h2>
                    <textarea
                      className="w-full p-4 border border-[#E2E8F0] rounded-lg text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] resize-none"
                      rows={6}
                      placeholder="Add internal notes about this professional (visible only to managers and admins)..."
                    ></textarea>
                    <div className="mt-4 flex justify-end">
                      <button className="px-4 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors text-sm font-medium">
                        Save Notes
                      </button>
                    </div>
                  </div>

                  {/* Performance Reports */}
                  <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-[#1E293B] mb-6 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-[#10B981]" />
                      Performance Overview
                    </h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-[#64748B]">Customer Satisfaction</p>
                          <p className="text-xs text-[#94A3B8] mt-0.5">Based on customer reviews</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-[#1E293B]">{stats.satisfactionRate.toFixed(0)}%</p>
                          <div className="flex items-center gap-1 text-xs text-[#64748B] mt-0.5">
                            <Star className="w-3 h-3 fill-[#F59E0B] text-[#F59E0B]" />
                            {stats.rating.toFixed(1)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-[#64748B]">Response Time</p>
                          <p className="text-xs text-[#94A3B8] mt-0.5">Average booking acceptance time</p>
                        </div>
                        <p className="text-2xl font-bold text-[#1E293B]">{stats.responseTime}</p>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-[#64748B]">Completion Rate</p>
                          <p className="text-xs text-[#94A3B8] mt-0.5">Jobs completed vs cancelled</p>
                        </div>
                        <p className="text-2xl font-bold text-[#1E293B]">{stats.completionRate.toFixed(0)}%</p>
                      </div>
                    </div>
                  </div>

                  {/* Export Reports */}
                  <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-[#1E293B] mb-4">Export Reports</h2>
                    <div className="flex items-center gap-3">
                      <button className="flex items-center gap-2 px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-colors text-sm font-medium">
                        <Download className="w-4 h-4" />
                        Download PDF Report
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E2E8F0] text-[#64748B] rounded-lg hover:bg-[#F8FAFC] transition-colors text-sm font-medium">
                        <Download className="w-4 h-4" />
                        Export as Excel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Suspend Modal */}
          {showSuspendModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
              <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-gray-900 text-lg font-semibold mb-2">{professional?.is_suspended ? 'Confirm Unsuspend' : 'Suspend Professional'}</h3>
                <p className="text-sm text-gray-600 mb-3">This reason will be recorded and visible to the professional.</p>

                {professional?.is_suspended ? (
                  <div className="bg-gray-50 p-3 rounded-md mb-4">
                    <p className="text-sm text-gray-700">Reason: {suspensionReason || 'No reason provided'}</p>
                  </div>
                ) : (
                  <textarea
                    value={suspensionReason}
                    onChange={(e) => setSuspensionReason(e.target.value)}
                    placeholder="Enter suspension reason (required)"
                    className="w-full p-3 text-gray-700 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-[#EF4444]"
                    rows={4}
                  />
                )}

                <div className="flex items-center justify-end gap-3">
                  <button onClick={handleCloseSuspendModal} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">Cancel</button>
                  <button onClick={handleConfirmSuspend} disabled={suspending} className={`px-4 py-2 rounded-lg text-white ${professional?.is_suspended ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} disabled:opacity-50`}>
                    {suspending ? 'Processing...' : professional?.is_suspended ? 'Unsuspend' : 'Suspend'}
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
