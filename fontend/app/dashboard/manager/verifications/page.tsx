'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield, Eye, CheckCircle, XCircle, Clock, AlertTriangle, 
  User, Store, Search, Filter, Download, Loader2
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TopNavbar from '../components/TopNavbar';
import LeftSidebar from '../components/LeftSidebar';
import { getAllVerifications, getVerificationStats, Verification, VerificationStats } from '@/utils/verifications';

export default function VerificationsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [stats, setStats] = useState<VerificationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/auth');
      return;
    }
    
    fetchVerifications();
    fetchStats();
  }, [filterStatus, filterType]);

  const fetchVerifications = async () => {
    setLoading(true);
    setError('');
    try {
      const params: any = {};
      if (filterStatus !== 'all') params.status = filterStatus;
      if (filterType !== 'all') params.verification_type = filterType;
      if (searchQuery) params.search = searchQuery;
      
      const response = await getAllVerifications(params);
      setVerifications(response.verifications);
    } catch (err: any) {
      if (err.message?.includes('Not authenticated')) {
        router.push('/auth');
        return;
      }
      setError(err.message || 'Failed to fetch verifications');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const statsData = await getVerificationStats();
      setStats(statsData);
    } catch (err: any) {
      console.error('Failed to fetch stats:', err);
      // Don't show error for stats, just use defaults
      if (!err.message?.includes('Not authenticated')) {
        setStats({ pending: 0, approved_today: 0, rejected_today: 0, high_risk: 0 });
      }
    }
  };

  const handleSearch = () => {
    fetchVerifications();
  };

  const statsCards = stats ? [
    { label: 'Pending Reviews', count: stats.pending, color: 'from-[#FED7AA] to-[#FDBA74]', icon: Clock, iconColor: 'text-[#F59E0B]' },
    { label: 'Approved Today', count: stats.approved_today, color: 'from-[#D1FAE5] to-[#A7F3D0]', icon: CheckCircle, iconColor: 'text-[#10B981]' },
    { label: 'Rejected Today', count: stats.rejected_today, color: 'from-[#FEE2E2] to-[#FECACA]', icon: XCircle, iconColor: 'text-[#EF4444]' },
    { label: 'High Risk', count: stats.high_risk, color: 'from-[#FEE2E2] to-[#FECACA]', icon: AlertTriangle, iconColor: 'text-[#EF4444]' },
  ] : [];

  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      <TopNavbar />
      <div className="flex">
        <LeftSidebar isOpen={sidebarOpen} />
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
          <div className="p-8">
            <div className="max-w-[1600px] mx-auto">
              {/* Header */}
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#1E293B] mb-2 flex items-center gap-3">
                  <Shield className="w-8 h-8 text-[#0AA06E]" />
                  Verification Center
                </h1>
                <p className="text-sm text-[#64748B]">Review and approve professional and shop registrations</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                {statsCards.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className={`bg-gradient-to-br ${stat.color} rounded-xl p-6 border border-white/20 shadow-sm`}>
                      <div className="flex items-center justify-between mb-2">
                        <Icon className={`w-8 h-8 ${stat.iconColor}`} />
                        <span className="text-3xl font-bold text-[#1E293B]">{stat.count}</span>
                      </div>
                      <p className="text-sm font-medium text-[#64748B]">{stat.label}</p>
                    </div>
                  );
                })}
              </div>

              {/* Filters */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 mb-6 shadow-sm">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex-1 min-w-[250px]">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                      <input
                        type="text"
                        placeholder="Search by name or phone..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        className="w-full pl-10 pr-4 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0AA06E]"
                      />
                    </div>
                  </div>

                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0AA06E]"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="more_info_needed">More Info Needed</option>
                  </select>

                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0AA06E]"
                  >
                    <option value="all">All Types</option>
                    <option value="professional">Professional</option>
                    <option value="shop">Shop</option>
                  </select>

                  <button 
                    onClick={handleSearch}
                    className="px-4 py-2 bg-[#0AA06E] text-white rounded-lg hover:bg-[#098F5E] transition-colors flex items-center gap-2 text-sm font-medium"
                  >
                    <Search className="w-4 h-4" />
                    Search
                  </button>
                </div>
              </div>

              {/* Verifications Table */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
                {loading ? (
                  <div className="flex items-center justify-center py-16">
                    <Loader2 className="w-8 h-8 animate-spin text-[#0AA06E]" />
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="text-center">
                      <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                      <p className="text-red-600">{error}</p>
                    </div>
                  </div>
                ) : verifications.length === 0 ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="text-center">
                      <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No verification requests found</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                            <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">ID</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Name</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Type</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Category</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Risk Score</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Documents</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Submitted On</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E2E8F0]">
                          {verifications.map((verification) => (
                            <tr key={verification.id} className="hover:bg-[#F8FAFC] transition-colors">
                              <td className="px-4 py-4">
                                <span className="text-sm font-mono text-[#0AA06E] font-medium">{verification.id.slice(-8).toUpperCase()}</span>
                              </td>
                              <td className="px-4 py-4">
                                <div>
                                  <p className="text-sm font-medium text-[#1E293B]">
                                    {verification.verification_type === 'shop' ? verification.shop_name : verification.name}
                                  </p>
                                  <p className="text-xs text-[#64748B]">{verification.phone}</p>
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                                  verification.verification_type === 'professional' ? 'bg-[#E9D5FF] text-[#6B21A8]' : 'bg-[#FED7AA] text-[#9A3412]'
                                }`}>
                                  {verification.verification_type === 'professional' ? <User className="w-3 h-3" /> : <Store className="w-3 h-3" />}
                                  {verification.verification_type === 'professional' ? 'Professional' : 'Shop'}
                                </span>
                              </td>
                              <td className="px-4 py-4">
                                <span className="text-sm text-[#1E293B]">{verification.category || 'N/A'}</span>
                              </td>
                              <td className="px-4 py-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                  verification.status === 'approved' ? 'bg-[#D1FAE5] text-[#065F46]' :
                                  verification.status === 'rejected' ? 'bg-[#FEE2E2] text-[#991B1B]' :
                                  verification.status === 'pending' ? 'bg-[#FEF3C7] text-[#92400E]' :
                                  'bg-[#DBEAFE] text-[#1E40AF]'
                                }`}>
                                  {verification.status.replace('_', ' ').toUpperCase()}
                                </span>
                              </td>
                              <td className="px-4 py-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${
                                  verification.risk_score === 'high' ? 'bg-[#FEE2E2] text-[#991B1B] border-[#EF4444]' :
                                  verification.risk_score === 'medium' ? 'bg-[#FED7AA] text-[#9A3412] border-[#F59E0B]' :
                                  'bg-[#D1FAE5] text-[#065F46] border-[#10B981]'
                                }`}>
                                  {verification.risk_score.toUpperCase()}
                                </span>
                              </td>
                              <td className="px-4 py-4">
                                <span className="text-sm text-[#64748B]">{verification.documents_count} docs</span>
                              </td>
                              <td className="px-4 py-4">
                                <span className="text-sm text-[#64748B]">
                                  {new Date(verification.submitted_at).toLocaleDateString()}
                                </span>
                              </td>
                              <td className="px-4 py-4">
                                <Link href={`/dashboard/manager/verifications/${verification.id}`}>
                                  <button className="px-4 py-2 bg-[#0AA06E] text-white rounded-lg hover:bg-[#098F5E] transition-colors flex items-center gap-2 text-sm font-medium">
                                    <Eye className="w-4 h-4" />
                                    Review
                                  </button>
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-6 py-4 border-t border-[#E2E8F0] flex items-center justify-between">
                      <p className="text-sm text-[#64748B]">
                        Showing <span className="font-medium text-[#1E293B]">{verifications.length}</span> verification(s)
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
