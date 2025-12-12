'use client';

import React, { useState } from 'react';
import {
  Shield,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  Users,
  Eye,
  Lock,
  Settings,
} from 'lucide-react';

export default function RoleManagementPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRole, setNewRole] = useState({ name: '', description: '' });
  const [showNotification, setShowNotification] = useState(false);

  const roles = [
    {
      id: 1,
      name: 'Super Admin',
      description: 'Full system access with all permissions',
      usersCount: 3,
      color: '#E53935',
      permissions: {
        view: true,
        edit: true,
        delete: true,
        manageOrders: true,
        manageEarnings: true,
        accessReports: true,
        suspensionRights: true,
        userManagement: true,
      },
    },
    {
      id: 2,
      name: 'Admin',
      description: 'Administrative access with limited restrictions',
      usersCount: 12,
      color: '#0057D9',
      permissions: {
        view: true,
        edit: true,
        delete: false,
        manageOrders: true,
        manageEarnings: true,
        accessReports: true,
        suspensionRights: true,
        userManagement: false,
      },
    },
    {
      id: 3,
      name: 'Moderator',
      description: 'Content and user moderation capabilities',
      usersCount: 24,
      color: '#6C63FF',
      permissions: {
        view: true,
        edit: true,
        delete: false,
        manageOrders: false,
        manageEarnings: false,
        accessReports: true,
        suspensionRights: true,
        userManagement: false,
      },
    },
    {
      id: 4,
      name: 'Shop Manager',
      description: 'Manage shop operations and inventory',
      usersCount: 98,
      color: '#3CB878',
      permissions: {
        view: true,
        edit: true,
        delete: false,
        manageOrders: true,
        manageEarnings: false,
        accessReports: true,
        suspensionRights: false,
        userManagement: false,
      },
    },
    {
      id: 5,
      name: 'Professional',
      description: 'Service professional role with basic access',
      usersCount: 228,
      color: '#FFB020',
      permissions: {
        view: true,
        edit: false,
        delete: false,
        manageOrders: true,
        manageEarnings: false,
        accessReports: false,
        suspensionRights: false,
        userManagement: false,
      },
    },
    {
      id: 6,
      name: 'Support Team',
      description: 'Customer support and helpdesk access',
      usersCount: 45,
      color: '#00A8E8',
      permissions: {
        view: true,
        edit: false,
        delete: false,
        manageOrders: false,
        manageEarnings: false,
        accessReports: false,
        suspensionRights: false,
        userManagement: false,
      },
    },
  ];

  const permissionLabels = {
    view: 'View Access',
    edit: 'Edit Access',
    delete: 'Delete Access',
    manageOrders: 'Manage Orders',
    manageEarnings: 'Manage Earnings',
    accessReports: 'Access Reports',
    suspensionRights: 'Suspension Rights',
    userManagement: 'User Management',
  };

  const handleCreateRole = () => {
    if (!newRole.name || !newRole.description) {
      alert('Please fill all fields');
      return;
    }
    setShowCreateModal(false);
    setNewRole({ name: '', description: '' });
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#1B1F3B] mb-2">Role Management</h1>
              <p className="text-[#6B7280]">Create and manage user roles with custom permissions</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-[#0057D9] to-[#0044AA] text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create New Role
            </button>
          </div>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {roles.map((role) => (
            <div
              key={role.id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${role.color}20`, color: role.color }}
                  >
                    <Shield className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#1B1F3B] mb-1">{role.name}</h3>
                    <p className="text-sm text-[#6B7280] mb-2">{role.description}</p>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#6B7280]" />
                      <span className="text-sm text-[#6B7280]">
                        {role.usersCount} {role.usersCount === 1 ? 'user' : 'users'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-[#E3F2FD] rounded-lg transition-colors">
                    <Edit className="w-4 h-4 text-[#0057D9]" />
                  </button>
                  {role.id > 2 && (
                    <button className="p-2 hover:bg-[#FFEBEE] rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4 text-[#E53935]" />
                    </button>
                  )}
                </div>
              </div>

              {/* Permissions */}
              <div className="space-y-2 pt-4 border-t border-gray-100">
                <h4 className="text-sm font-semibold text-[#1B1F3B] mb-3">Permissions</h4>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(role.permissions).map(([key, value]) => (
                    <div
                      key={key}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                        value ? 'bg-[#E8F5E9]' : 'bg-gray-50'
                      }`}
                    >
                      {value ? (
                        <CheckCircle2 className="w-4 h-4 text-[#3CB878]" />
                      ) : (
                        <Lock className="w-4 h-4 text-[#6B7280]" />
                      )}
                      <span
                        className={`text-xs font-medium ${
                          value ? 'text-[#3CB878]' : 'text-[#6B7280]'
                        }`}
                      >
                        {permissionLabels[key as keyof typeof permissionLabels]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Role Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#1B1F3B]">Create New Role</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5 text-[#6B7280]" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-[#1B1F3B] mb-2">
                  Role Name <span className="text-[#E53935]">*</span>
                </label>
                <input
                  type="text"
                  value={newRole.name}
                  onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                  placeholder="e.g. Content Manager"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#0057D9] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1B1F3B] mb-2">
                  Description <span className="text-[#E53935]">*</span>
                </label>
                <textarea
                  rows={3}
                  value={newRole.description}
                  onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                  placeholder="Describe the role and its responsibilities..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#0057D9] transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1B1F3B] mb-4">
                  Select Permissions
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(permissionLabels).map(([key, label]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between p-4 bg-[#F4F7FB] rounded-xl"
                    >
                      <span className="text-sm font-medium text-[#1B1F3B]">{label}</span>
                      <input type="checkbox" className="w-5 h-5 rounded text-[#0057D9]" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t border-gray-100">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-200 text-[#1B1F3B] rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateRole}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#0057D9] to-[#0044AA] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Create Role
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {showNotification && (
        <div className="fixed top-24 right-8 z-50 animate-slide-in">
          <div className="px-6 py-4 bg-[#3CB878] text-white rounded-xl shadow-lg flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-semibold">Role created successfully!</span>
          </div>
        </div>
      )}
    </div>
  );
}
