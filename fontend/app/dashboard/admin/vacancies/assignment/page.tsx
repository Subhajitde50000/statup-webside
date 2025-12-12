'use client';

import React, { useState } from 'react';
import {
  Users,
  Shield,
  Store,
  Wrench,
  Headphones,
  CheckCircle2,
  Save,
  Search,
} from 'lucide-react';
import Link from 'next/link';

export default function JobAssignmentPage() {
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [permissions, setPermissions] = useState({
    view: false,
    edit: false,
    manageOrders: false,
    manageEarnings: false,
    accessReports: false,
    suspensionRights: false,
  });
  const [showNotification, setShowNotification] = useState(false);

  const roleTypes = [
    { id: 'admin', label: 'Admin Staff', icon: <Users className="w-5 h-5" />, color: '#0057D9' },
    { id: 'moderator', label: 'Moderators', icon: <Shield className="w-5 h-5" />, color: '#6C63FF' },
    { id: 'shop', label: 'Shop Managers', icon: <Store className="w-5 h-5" />, color: '#3CB878' },
    { id: 'professional', label: 'Professionals', icon: <Wrench className="w-5 h-5" />, color: '#FFB020' },
    { id: 'support', label: 'Support Team', icon: <Headphones className="w-5 h-5" />, color: '#00A8E8' },
  ];

  const permissionList = [
    { key: 'view', label: 'View Access', description: 'Can view data and reports' },
    { key: 'edit', label: 'Edit Access', description: 'Can modify and update information' },
    { key: 'manageOrders', label: 'Manage Orders', description: 'Full control over order management' },
    { key: 'manageEarnings', label: 'Manage Earnings', description: 'Can process payments and earnings' },
    { key: 'accessReports', label: 'Access Reports', description: 'Can generate and view reports' },
    { key: 'suspensionRights', label: 'Suspension Rights', description: 'Can suspend/ban users or entities' },
  ];

  const users = [
    { id: '1', name: 'Rajesh Kumar', role: 'Service Professional' },
    { id: '2', name: 'Priya Sharma', role: 'Shop Manager' },
    { id: '3', name: 'Amit Patel', role: 'Support Executive' },
    { id: '4', name: 'Sneha Reddy', role: 'Admin Staff' },
  ];

  const handlePermissionToggle = (key: string) => {
    setPermissions({ ...permissions, [key]: !permissions[key as keyof typeof permissions] });
  };

  const handleSubmit = () => {
    if (!selectedRole || !selectedUser) {
      alert('Please select both role and user');
      return;
    }
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1B1F3B] mb-2">Job & Role Assignment</h1>
          <p className="text-[#6B7280]">Assign roles and permissions to team members</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Role Selection */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-[#1B1F3B] mb-6">Select Role Type</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {roleTypes.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`p-6 rounded-2xl text-left transition-all border-4 ${
                      selectedRole === role.id
                        ? 'border-[#0057D9] shadow-lg'
                        : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                      style={{ backgroundColor: `${role.color}20`, color: role.color }}
                    >
                      {role.icon}
                    </div>
                    <h3 className="font-bold text-[#1B1F3B] text-lg">{role.label}</h3>
                  </button>
                ))}
              </div>
            </div>

            {/* User Selection */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-[#1B1F3B] mb-6">Select User/Staff</h2>
              <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6B7280] w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#0057D9] transition-colors"
                />
              </div>
              <div className="space-y-2">
                {users.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => setSelectedUser(user.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all flex items-center justify-between ${
                      selectedUser === user.id
                        ? 'bg-[#E3F2FD] border-2 border-[#0057D9]'
                        : 'bg-[#F4F7FB] hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#0057D9] text-white rounded-lg flex items-center justify-center font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-[#1B1F3B]">{user.name}</p>
                        <p className="text-xs text-[#6B7280]">{user.role}</p>
                      </div>
                    </div>
                    {selectedUser === user.id && (
                      <CheckCircle2 className="w-6 h-6 text-[#0057D9]" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Permissions */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-[#1B1F3B] mb-6">Assign Permissions</h2>
              <div className="space-y-4">
                {permissionList.map((permission) => (
                  <div
                    key={permission.key}
                    className="flex items-center justify-between p-4 bg-[#F4F7FB] rounded-xl"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-[#1B1F3B]">{permission.label}</p>
                      <p className="text-sm text-[#6B7280]">{permission.description}</p>
                    </div>
                    <label className="relative inline-block w-14 h-7">
                      <input
                        type="checkbox"
                        checked={permissions[permission.key as keyof typeof permissions]}
                        onChange={() => handlePermissionToggle(permission.key)}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-7 bg-gray-300 rounded-full peer peer-checked:bg-[#0057D9] transition-colors cursor-pointer"></div>
                      <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-7"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-8">
              <h2 className="text-xl font-bold text-[#1B1F3B] mb-6">Assignment Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm text-[#6B7280] mb-1">Selected Role</p>
                  <p className="font-semibold text-[#1B1F3B]">
                    {selectedRole ? roleTypes.find((r) => r.id === selectedRole)?.label : 'Not selected'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[#6B7280] mb-1">Selected User</p>
                  <p className="font-semibold text-[#1B1F3B]">
                    {selectedUser ? users.find((u) => u.id === selectedUser)?.name : 'Not selected'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[#6B7280] mb-1">Active Permissions</p>
                  <p className="font-semibold text-[#1B1F3B]">
                    {Object.values(permissions).filter(Boolean).length} of {permissionList.length}
                  </p>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full px-6 py-3 bg-gradient-to-r from-[#0057D9] to-[#0044AA] text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                Save Assignment
              </button>

              <Link
                href="/dashboard/admin/vacancies"
                className="block w-full px-6 py-3 mt-3 bg-white border-2 border-gray-200 text-[#1B1F3B] rounded-xl font-semibold text-center hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </div>

      {showNotification && (
        <div className="fixed top-24 right-8 z-50 animate-slide-in">
          <div className="px-6 py-4 bg-[#3CB878] text-white rounded-xl shadow-lg flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-semibold">Role assigned successfully!</span>
          </div>
        </div>
      )}
    </div>
  );
}
