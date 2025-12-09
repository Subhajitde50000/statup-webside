'use client';

import React, { useState } from 'react';
import { AlertTriangle, Clock, UserCheck, FileText, Shield, Ban, Download } from 'lucide-react';
import TopNavbar from '../../../components/TopNavbar';
import LeftSidebar from '../../../components/LeftSidebar';

export default function EscalationsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState('all');

  const escalations = [
    {
      escalationId: 'ESC001',
      complaintId: 'CMP20241210005',
      priority: 'Critical',
      department: 'Legal',
      level: 'Level 3',
      assignedTo: 'Legal Team',
      reason: 'Fraud - Fake documents',
      status: 'Under Investigation',
      timePending: '2h 15m',
      customerName: 'Rajesh Kumar',
      professionalName: 'Quick Repairs',
    },
    {
      escalationId: 'ESC002',
      complaintId: 'CMP20241209018',
      priority: 'High',
      department: 'Quality',
      level: 'Level 2',
      assignedTo: 'Quality Manager',
      reason: 'Multiple similar complaints',
      status: 'In Progress',
      timePending: '1d 3h',
      customerName: 'Priya Sharma',
      professionalName: 'Home Services Pro',
    },
    {
      escalationId: 'ESC003',
      complaintId: 'CMP20241208022',
      priority: 'Critical',
      department: 'Safety',
      level: 'Level 3',
      assignedTo: 'Safety Team',
      reason: 'Harassment complaint',
      status: 'Resolved',
      timePending: '4h 30m',
      customerName: 'Amit Patel',
      professionalName: 'Tech Solutions',
    },
    {
      escalationId: 'ESC004',
      complaintId: 'CMP20241210012',
      priority: 'High',
      department: 'Quality',
      level: 'Level 2',
      assignedTo: 'Senior Agent',
      reason: 'Escalated by customer',
      status: 'Pending',
      timePending: '45m',
      customerName: 'Sneha Reddy',
      professionalName: 'Quick Fix Services',
    },
  ];

  const filteredEscalations = selectedLevel === 'all' 
    ? escalations 
    : escalations.filter(e => e.level === selectedLevel);

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
                <h1 className="text-2xl font-semibold text-[#1E293B] mb-2">Escalated Complaints</h1>
                <p className="text-sm text-[#64748B]">High-priority complaints requiring senior management attention</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-gradient-to-br from-[#FEE2E2] to-[#FECACA] rounded-xl p-6 border border-[#EF4444]/20">
                  <div className="flex items-center justify-between mb-2">
                    <AlertTriangle className="w-8 h-8 text-[#EF4444]" />
                    <span className="text-2xl font-bold text-[#1E293B]">4</span>
                  </div>
                  <p className="text-sm font-medium text-[#64748B]">Active Escalations</p>
                </div>

                <div className="bg-gradient-to-br from-[#FED7AA] to-[#FDBA74] rounded-xl p-6 border border-[#F59E0B]/20">
                  <div className="flex items-center justify-between mb-2">
                    <Clock className="w-8 h-8 text-[#F59E0B]" />
                    <span className="text-2xl font-bold text-[#1E293B]">2</span>
                  </div>
                  <p className="text-sm font-medium text-[#64748B]">Pending >24h</p>
                </div>

                <div className="bg-gradient-to-br from-[#E9D5FF] to-[#DDD6FE] rounded-xl p-6 border border-[#8B5CF6]/20">
                  <div className="flex items-center justify-between mb-2">
                    <Shield className="w-8 h-8 text-[#8B5CF6]" />
                    <span className="text-2xl font-bold text-[#1E293B]">2</span>
                  </div>
                  <p className="text-sm font-medium text-[#64748B]">Level 3 (Critical)</p>
                </div>

                <div className="bg-gradient-to-br from-[#D1FAE5] to-[#A7F3D0] rounded-xl p-6 border border-[#10B981]/20">
                  <div className="flex items-center justify-between mb-2">
                    <UserCheck className="w-8 h-8 text-[#10B981]" />
                    <span className="text-2xl font-bold text-[#1E293B]">1</span>
                  </div>
                  <p className="text-sm font-medium text-[#64748B]">Resolved Today</p>
                </div>
              </div>

              {/* Escalation Levels Info */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 mb-6 shadow-sm">
                <h2 className="text-lg font-semibold text-[#1E293B] mb-4">Escalation Levels</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border-l-4 border-[#10B981] bg-[#F0FDF4] rounded-lg">
                    <h3 className="text-sm font-bold text-[#1E293B] mb-2">Level 1 - Support Team</h3>
                    <p className="text-xs text-[#64748B]">Standard complaints handled by support agents</p>
                  </div>
                  <div className="p-4 border-l-4 border-[#F59E0B] bg-[#FFFBEB] rounded-lg">
                    <h3 className="text-sm font-bold text-[#1E293B] mb-2">Level 2 - Quality Team</h3>
                    <p className="text-xs text-[#64748B]">Complex issues requiring quality manager review</p>
                  </div>
                  <div className="p-4 border-l-4 border-[#EF4444] bg-[#FEF2F2] rounded-lg">
                    <h3 className="text-sm font-bold text-[#1E293B] mb-2">Level 3 - Legal/Safety</h3>
                    <p className="text-xs text-[#64748B]">Critical issues: fraud, harassment, safety concerns</p>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 mb-6 shadow-sm">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[#64748B]">Filter by Level:</span>
                    <button 
                      onClick={() => setSelectedLevel('all')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedLevel === 'all' ? 'bg-[#10B981] text-white' : 'bg-[#F8FAFC] text-[#64748B] hover:bg-[#E2E8F0]'
                      }`}
                    >
                      All
                    </button>
                    <button 
                      onClick={() => setSelectedLevel('Level 1')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedLevel === 'Level 1' ? 'bg-[#10B981] text-white' : 'bg-[#F8FAFC] text-[#64748B] hover:bg-[#E2E8F0]'
                      }`}
                    >
                      Level 1
                    </button>
                    <button 
                      onClick={() => setSelectedLevel('Level 2')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedLevel === 'Level 2' ? 'bg-[#10B981] text-white' : 'bg-[#F8FAFC] text-[#64748B] hover:bg-[#E2E8F0]'
                      }`}
                    >
                      Level 2
                    </button>
                    <button 
                      onClick={() => setSelectedLevel('Level 3')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedLevel === 'Level 3' ? 'bg-[#10B981] text-white' : 'bg-[#F8FAFC] text-[#64748B] hover:bg-[#E2E8F0]'
                      }`}
                    >
                      Level 3
                    </button>
                  </div>
                  <button className="ml-auto px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-colors flex items-center gap-2 text-sm font-medium">
                    <Download className="w-4 h-4" />
                    Export Report
                  </button>
                </div>
              </div>

              {/* Escalations Table */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Escalation ID</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Complaint ID</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Priority</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Level</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Department</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Assigned To</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Reason</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Time Pending</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0]">
                      {filteredEscalations.map((escalation) => (
                        <tr key={escalation.escalationId} className="hover:bg-[#F8FAFC] transition-colors">
                          <td className="px-4 py-4">
                            <span className="text-sm font-mono text-[#10B981] font-medium">{escalation.escalationId}</span>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-sm text-[#3B82F6] hover:underline cursor-pointer">{escalation.complaintId}</span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold border-2 ${
                              escalation.priority === 'Critical' ? 'bg-[#FEE2E2] text-[#991B1B] border-[#EF4444]' :
                              'bg-[#FED7AA] text-[#9A3412] border-[#F59E0B]'
                            }`}>
                              {escalation.priority}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              escalation.level === 'Level 3' ? 'bg-[#FEE2E2] text-[#991B1B]' :
                              escalation.level === 'Level 2' ? 'bg-[#FED7AA] text-[#9A3412]' :
                              'bg-[#ECFDF5] text-[#065F46]'
                            }`}>
                              {escalation.level}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-sm font-medium text-[#1E293B]">{escalation.department}</span>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-sm text-[#64748B]">{escalation.assignedTo}</span>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-sm text-[#1E293B]">{escalation.reason}</span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              escalation.status === 'Resolved' ? 'bg-[#D1FAE5] text-[#065F46]' :
                              escalation.status === 'Pending' ? 'bg-[#FEF3C7] text-[#92400E]' :
                              'bg-[#DBEAFE] text-[#1E40AF]'
                            }`}>
                              {escalation.status}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-sm text-[#64748B]">{escalation.timePending}</span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <button className="p-2 hover:bg-[#F8FAFC] rounded-lg transition-colors" title="View Details">
                                <FileText className="w-4 h-4 text-[#3B82F6]" />
                              </button>
                              <button className="p-2 hover:bg-[#F8FAFC] rounded-lg transition-colors" title="Reassign">
                                <UserCheck className="w-4 h-4 text-[#10B981]" />
                              </button>
                              <button className="p-2 hover:bg-[#FEE2E2] rounded-lg transition-colors" title="Take Action">
                                <Ban className="w-4 h-4 text-[#EF4444]" />
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
