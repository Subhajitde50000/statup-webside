'use client';

import React, { useState } from 'react';
import { AlertOctagon, Shield, Ban, Eye, Clock, AlertTriangle, FileText } from 'lucide-react';
import TopNavbar from '../../../components/TopNavbar';
import LeftSidebar from '../../../components/LeftSidebar';

export default function FraudMonitoringPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedSeverity, setSelectedSeverity] = useState('all');

  const autoFlags = [
    {
      flagId: 'FLAG001',
      userId: 'USR8745',
      userName: 'Suspicious User 1',
      userType: 'Professional',
      reason: 'Multiple complaints in 24h',
      details: '5 complaints received from different customers',
      severity: 'High',
      status: 'Under Review',
      flaggedOn: '2024-12-10 09:30 AM',
      complaintsCount: 5,
    },
    {
      flagId: 'FLAG002',
      userId: 'USR9821',
      userName: 'Fake Documents Pro',
      userType: 'Professional',
      reason: 'Fraudulent documents detected',
      details: 'Document verification failed - Fake Aadhaar',
      severity: 'Critical',
      status: 'Action Taken',
      flaggedOn: '2024-12-09 02:15 PM',
      complaintsCount: 3,
    },
    {
      flagId: 'FLAG003',
      userId: 'USR4532',
      userName: 'Scammer Customer',
      userType: 'Customer',
      reason: 'Payment fraud suspected',
      details: 'Multiple failed payment attempts, chargeback pattern',
      severity: 'Critical',
      status: 'Suspended',
      flaggedOn: '2024-12-10 11:00 AM',
      complaintsCount: 8,
    },
    {
      flagId: 'FLAG004',
      userId: 'USR7621',
      userName: 'Chat Abuse User',
      userType: 'Customer',
      reason: 'Suspicious chat behavior',
      details: 'Inappropriate language detected in multiple chats',
      severity: 'Medium',
      status: 'Warning Sent',
      flaggedOn: '2024-12-09 08:45 PM',
      complaintsCount: 2,
    },
    {
      flagId: 'FLAG005',
      userId: 'SHP2341',
      userName: 'Fake Products Shop',
      userType: 'Shop',
      reason: 'Multiple product complaints',
      details: 'Defective/fake products reported by 7 customers',
      severity: 'High',
      status: 'Under Investigation',
      flaggedOn: '2024-12-08 05:20 PM',
      complaintsCount: 7,
    },
  ];

  const filteredFlags = selectedSeverity === 'all' 
    ? autoFlags 
    : autoFlags.filter(f => f.severity === selectedSeverity);

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
                <h1 className="text-2xl font-semibold text-[#1E293B] mb-2 flex items-center gap-3">
                  <Shield className="w-8 h-8 text-[#EF4444]" />
                  Auto-Flag & Fraud Monitoring
                </h1>
                <p className="text-sm text-[#64748B]">Automated system detecting suspicious behavior and fraudulent activities</p>
              </div>

              {/* Alert Banner */}
              <div className="bg-gradient-to-r from-[#FEE2E2] to-[#FECACA] border-l-4 border-[#EF4444] rounded-xl p-4 mb-6 flex items-start gap-3">
                <AlertOctagon className="w-6 h-6 text-[#EF4444] flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-[#991B1B] mb-1">⚠️ 2 Critical Alerts Pending Review</h3>
                  <p className="text-xs text-[#64748B]">Immediate action required for fraud and payment fraud cases</p>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                <div className="bg-gradient-to-br from-[#FEE2E2] to-[#FECACA] rounded-xl p-5 border border-[#EF4444]/20">
                  <div className="flex items-center justify-between mb-2">
                    <AlertOctagon className="w-7 h-7 text-[#EF4444]" />
                    <span className="text-2xl font-bold text-[#1E293B]">5</span>
                  </div>
                  <p className="text-xs font-medium text-[#64748B]">Active Flags</p>
                </div>

                <div className="bg-gradient-to-br from-[#FED7AA] to-[#FDBA74] rounded-xl p-5 border border-[#F59E0B]/20">
                  <div className="flex items-center justify-between mb-2">
                    <AlertTriangle className="w-7 h-7 text-[#F59E0B]" />
                    <span className="text-2xl font-bold text-[#1E293B]">2</span>
                  </div>
                  <p className="text-xs font-medium text-[#64748B]">Critical Severity</p>
                </div>

                <div className="bg-gradient-to-br from-[#DBEAFE] to-[#BFDBFE] rounded-xl p-5 border border-[#3B82F6]/20">
                  <div className="flex items-center justify-between mb-2">
                    <Clock className="w-7 h-7 text-[#3B82F6]" />
                    <span className="text-2xl font-bold text-[#1E293B]">3</span>
                  </div>
                  <p className="text-xs font-medium text-[#64748B]">Under Review</p>
                </div>

                <div className="bg-gradient-to-br from-[#E9D5FF] to-[#DDD6FE] rounded-xl p-5 border border-[#8B5CF6]/20">
                  <div className="flex items-center justify-between mb-2">
                    <Ban className="w-7 h-7 text-[#8B5CF6]" />
                    <span className="text-2xl font-bold text-[#1E293B]">1</span>
                  </div>
                  <p className="text-xs font-medium text-[#64748B]">Suspended Users</p>
                </div>

                <div className="bg-gradient-to-br from-[#D1FAE5] to-[#A7F3D0] rounded-xl p-5 border border-[#10B981]/20">
                  <div className="flex items-center justify-between mb-2">
                    <Shield className="w-7 h-7 text-[#10B981]" />
                    <span className="text-2xl font-bold text-[#1E293B]">12</span>
                  </div>
                  <p className="text-xs font-medium text-[#64748B]">Resolved This Week</p>
                </div>
              </div>

              {/* Auto-Detection Rules */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 mb-6 shadow-sm">
                <h2 className="text-lg font-semibold text-[#1E293B] mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#10B981]" />
                  Automatic Detection Rules
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-[#FEF2F2] rounded-lg border border-[#EF4444]/20">
                    <h3 className="text-sm font-bold text-[#991B1B] mb-2">🚨 Immediate Flags</h3>
                    <ul className="text-xs text-[#64748B] space-y-1">
                      <li>• Multiple complaints (3+ in 24h)</li>
                      <li>• Fake/invalid documents</li>
                      <li>• Payment fraud patterns</li>
                      <li>• Harassment reports</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-[#FFFBEB] rounded-lg border border-[#F59E0B]/20">
                    <h3 className="text-sm font-bold text-[#92400E] mb-2">⚠️ Warning Triggers</h3>
                    <ul className="text-xs text-[#64748B] space-y-1">
                      <li>• Suspicious chat activity</li>
                      <li>• Unusual GPS patterns</li>
                      <li>• Multiple account attempts</li>
                      <li>• Fake reviews/ratings</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-[#F0FDF4] rounded-lg border border-[#10B981]/20">
                    <h3 className="text-sm font-bold text-[#065F46] mb-2">✅ Monitor Only</h3>
                    <ul className="text-xs text-[#64748B] space-y-1">
                      <li>• Delayed arrivals (2+ times)</li>
                      <li>• Customer misuse patterns</li>
                      <li>• Unusual order frequencies</li>
                      <li>• Low ratings trends</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 mb-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-[#64748B]">Filter by Severity:</span>
                  <button 
                    onClick={() => setSelectedSeverity('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedSeverity === 'all' ? 'bg-[#10B981] text-white' : 'bg-[#F8FAFC] text-[#64748B] hover:bg-[#E2E8F0]'
                    }`}
                  >
                    All ({autoFlags.length})
                  </button>
                  <button 
                    onClick={() => setSelectedSeverity('Critical')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedSeverity === 'Critical' ? 'bg-[#EF4444] text-white' : 'bg-[#F8FAFC] text-[#64748B] hover:bg-[#E2E8F0]'
                    }`}
                  >
                    Critical
                  </button>
                  <button 
                    onClick={() => setSelectedSeverity('High')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedSeverity === 'High' ? 'bg-[#F59E0B] text-white' : 'bg-[#F8FAFC] text-[#64748B] hover:bg-[#E2E8F0]'
                    }`}
                  >
                    High
                  </button>
                  <button 
                    onClick={() => setSelectedSeverity('Medium')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedSeverity === 'Medium' ? 'bg-[#F59E0B] text-white' : 'bg-[#F8FAFC] text-[#64748B] hover:bg-[#E2E8F0]'
                    }`}
                  >
                    Medium
                  </button>
                </div>
              </div>

              {/* Auto Flags Table */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Flag ID</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">User</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">User Type</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Reason</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Details</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Severity</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Flagged On</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0]">
                      {filteredFlags.map((flag) => (
                        <tr key={flag.flagId} className="hover:bg-[#F8FAFC] transition-colors">
                          <td className="px-4 py-4">
                            <span className="text-sm font-mono text-[#EF4444] font-medium">{flag.flagId}</span>
                          </td>
                          <td className="px-4 py-4">
                            <div>
                              <p className="text-sm font-medium text-[#1E293B]">{flag.userName}</p>
                              <p className="text-xs text-[#64748B]">ID: {flag.userId}</p>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              flag.userType === 'Customer' ? 'bg-[#DBEAFE] text-[#1E40AF]' :
                              flag.userType === 'Professional' ? 'bg-[#E9D5FF] text-[#6B21A8]' :
                              'bg-[#FED7AA] text-[#9A3412]'
                            }`}>
                              {flag.userType}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-sm font-medium text-[#1E293B]">{flag.reason}</span>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-sm text-[#64748B] max-w-xs block truncate">{flag.details}</span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${
                              flag.severity === 'Critical' ? 'bg-[#FEE2E2] text-[#991B1B] border-[#EF4444]' :
                              flag.severity === 'High' ? 'bg-[#FED7AA] text-[#9A3412] border-[#F59E0B]' :
                              'bg-[#FEF3C7] text-[#92400E] border-[#F59E0B]'
                            }`}>
                              {flag.severity}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              flag.status === 'Suspended' ? 'bg-[#FEE2E2] text-[#991B1B]' :
                              flag.status === 'Action Taken' ? 'bg-[#D1FAE5] text-[#065F46]' :
                              flag.status === 'Warning Sent' ? 'bg-[#FEF3C7] text-[#92400E]' :
                              'bg-[#DBEAFE] text-[#1E40AF]'
                            }`}>
                              {flag.status}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-sm text-[#64748B]">{flag.flaggedOn}</span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <button className="px-3 py-1 bg-[#DBEAFE] text-[#1E40AF] rounded-lg hover:bg-[#3B82F6] hover:text-white transition-colors text-xs font-medium flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                Review
                              </button>
                              <button className="px-3 py-1 bg-[#FED7AA] text-[#9A3412] rounded-lg hover:bg-[#F59E0B] hover:text-white transition-colors text-xs font-medium flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" />
                                Warn
                              </button>
                              <button className="px-3 py-1 bg-[#FEE2E2] text-[#991B1B] rounded-lg hover:bg-[#EF4444] hover:text-white transition-colors text-xs font-medium flex items-center gap-1">
                                <Ban className="w-3 h-3" />
                                Ban
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
