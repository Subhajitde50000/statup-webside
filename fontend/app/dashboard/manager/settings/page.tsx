'use client';

import React, { useState } from 'react';
import { 
  Settings, Save, RotateCcw, FileText, Layout, Briefcase, DollarSign, 
  CreditCard, Bell, Shield, Users, Palette, Code, Database, Smartphone,
  FileCheck, Globe, Mail, MessageSquare, Lock, Key, Upload, Download,
  Eye, EyeOff, Plus, Edit2, Trash2, CheckCircle, XCircle, AlertTriangle
} from 'lucide-react';
import TopNavbar from '../components/TopNavbar';
import LeftSidebar from '../components/LeftSidebar';

export default function SystemSettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('general');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);

  const settingsTabs = [
    { id: 'general', icon: Layout, label: 'General Settings' },
    { id: 'business', icon: Briefcase, label: 'Business Settings' },
    { id: 'commission', icon: DollarSign, label: 'Commission & Charges' },
    { id: 'payout', icon: CreditCard, label: 'Payout / Settlement' },
    { id: 'notifications', icon: Bell, label: 'Notification Settings' },
    { id: 'security', icon: Shield, label: 'Security Settings' },
    { id: 'roles', icon: Users, label: 'Roles & Permissions' },
    { id: 'customization', icon: Palette, label: 'Platform Customization' },
    { id: 'api', icon: Code, label: 'API & Integrations' },
    { id: 'backup', icon: Database, label: 'Backup & Restore' },
    { id: 'version', icon: Smartphone, label: 'App Version Control' },
    { id: 'legal', icon: FileCheck, label: 'Legal & Policy' },
  ];

  const serviceCategories = [
    { name: 'Electrical', icon: '⚡', color: '#F59E0B', enabled: true },
    { name: 'Plumbing', icon: '🔧', color: '#3B82F6', enabled: true },
    { name: 'Carpentry', icon: '🪚', color: '#10B981', enabled: true },
    { name: 'Cleaning', icon: '🧹', color: '#8B5CF6', enabled: true },
    { name: 'Driving', icon: '🚗', color: '#EF4444', enabled: true },
  ];

  const roles = [
    { name: 'Super Admin', users: 2, permissions: 'All Access' },
    { name: 'Admin', users: 5, permissions: 'Most Access' },
    { name: 'Support Agent', users: 12, permissions: 'Limited Access' },
    { name: 'Verifier', users: 8, permissions: 'Verification Only' },
    { name: 'Finance Manager', users: 3, permissions: 'Finance Access' },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      <TopNavbar />
      <div className="flex">
        <LeftSidebar isOpen={sidebarOpen} />
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
          <div className="p-8">
            <div className="max-w-[1800px] mx-auto">
              {/* Page Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-[#1E293B] mb-2 flex items-center gap-3">
                    <Settings className="w-8 h-8 text-[#10B981]" />
                    System Settings
                  </h1>
                  <p className="text-sm text-[#64748B]">Configure platform behavior, security, notifications, and operational controls</p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="px-4 py-2 bg-[#64748B] text-white rounded-lg hover:bg-[#475569] transition-colors flex items-center gap-2 text-sm font-medium">
                    <FileText className="w-4 h-4" />
                    View Logs
                  </button>
                  <button className="px-4 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors flex items-center gap-2 text-sm font-medium">
                    <RotateCcw className="w-4 h-4" />
                    Reset to Default
                  </button>
                  <button className="px-6 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-colors flex items-center gap-2 text-sm font-bold">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Left Sidebar - Settings Navigation */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-sm sticky top-24">
                    <h3 className="text-sm font-bold text-[#64748B] mb-3 px-2">SETTINGS</h3>
                    <nav className="space-y-1">
                      {settingsTabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left ${
                              isActive
                                ? 'bg-[#ECFDF5] text-[#10B981] font-medium'
                                : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#1E293B]'
                            }`}
                          >
                            <Icon className={`w-4 h-4 ${isActive ? 'text-[#10B981]' : 'text-[#64748B]'}`} />
                            <span className="text-sm">{tab.label}</span>
                          </button>
                        );
                      })}
                    </nav>
                  </div>
                </div>

                {/* Right Content Area */}
                <div className="lg:col-span-3">
                  {/* General Settings */}
                  {activeTab === 'general' && (
                    <div className="space-y-6">
                      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-[#1E293B] mb-6">🟩 Platform Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="text-sm font-medium text-[#64748B] mb-2 block">Platform Name</label>
                            <input type="text" defaultValue="Electronics Platform" className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm" />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-[#64748B] mb-2 block">Support Email</label>
                            <input type="email" defaultValue="support@platform.com" className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm" />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-[#64748B] mb-2 block">Support Phone</label>
                            <input type="tel" defaultValue="+91 1800-123-4567" className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm" />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-[#64748B] mb-2 block">Headquarters Location</label>
                            <input type="text" defaultValue="New Delhi, India" className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm" />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-[#64748B] mb-2 block">Default Timezone</label>
                            <select className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm">
                              <option>Asia/Kolkata (IST)</option>
                              <option>Asia/Dubai (GST)</option>
                              <option>UTC</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-[#64748B] mb-2 block">Default Currency</label>
                            <select className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm">
                              <option>₹ INR (Indian Rupee)</option>
                              <option>$ USD (US Dollar)</option>
                              <option>€ EUR (Euro)</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-[#1E293B] mb-6">🟩 Platform Status</h2>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-lg">
                            <div>
                              <p className="text-sm font-bold text-[#1E293B]">Maintenance Mode</p>
                              <p className="text-xs text-[#64748B]">Enable to block all users temporarily</p>
                            </div>
                            <button
                              onClick={() => setMaintenanceMode(!maintenanceMode)}
                              className={`relative w-14 h-7 rounded-full transition-colors ${
                                maintenanceMode ? 'bg-[#EF4444]' : 'bg-[#10B981]'
                              }`}
                            >
                              <span
                                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                                  maintenanceMode ? 'translate-x-7' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-[#64748B] mb-2 block">Scheduled Maintenance Time</label>
                            <input type="datetime-local" className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm" />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-[#64748B] mb-2 block">Custom Maintenance Message</label>
                            <textarea rows={3} placeholder="We are upgrading our systems. We'll be back soon!" className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm resize-none"></textarea>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-[#1E293B] mb-6">🟦 UI Customization</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="text-sm font-medium text-[#64748B] mb-2 block">Upload Logo</label>
                            <div className="border-2 border-dashed border-[#E2E8F0] rounded-lg p-6 text-center hover:border-[#10B981] transition-colors cursor-pointer">
                              <Upload className="w-8 h-8 text-[#64748B] mx-auto mb-2" />
                              <p className="text-sm text-[#64748B]">Click to upload logo</p>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-[#64748B] mb-2 block">Upload Favicon</label>
                            <div className="border-2 border-dashed border-[#E2E8F0] rounded-lg p-6 text-center hover:border-[#10B981] transition-colors cursor-pointer">
                              <Upload className="w-8 h-8 text-[#64748B] mx-auto mb-2" />
                              <p className="text-sm text-[#64748B]">Click to upload favicon</p>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-[#64748B] mb-2 block">Primary Theme Color</label>
                            <div className="flex items-center gap-3">
                              <input type="color" defaultValue="#10B981" className="w-12 h-10 border border-[#E2E8F0] rounded-lg" />
                              <input type="text" defaultValue="#10B981" className="flex-1 px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm font-mono" />
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-[#64748B] mb-2 block">Secondary Color</label>
                            <div className="flex items-center gap-3">
                              <input type="color" defaultValue="#3B82F6" className="w-12 h-10 border border-[#E2E8F0] rounded-lg" />
                              <input type="text" defaultValue="#3B82F6" className="flex-1 px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm font-mono" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Business Settings */}
                  {activeTab === 'business' && (
                    <div className="space-y-6">
                      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                          <h2 className="text-lg font-bold text-[#1E293B]">Service Categories Settings</h2>
                          <button className="px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-colors flex items-center gap-2 text-sm font-medium">
                            <Plus className="w-4 h-4" />
                            Add Category
                          </button>
                        </div>
                        <div className="space-y-3">
                          {serviceCategories.map((category, index) => (
                            <div key={index} className="flex items-center justify-between p-4 border border-[#E2E8F0] rounded-lg hover:shadow-sm transition-shadow">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-2xl" style={{ backgroundColor: `${category.color}20` }}>
                                  {category.icon}
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-[#1E293B]">{category.name}</p>
                                  <p className="text-xs text-[#64748B]">Color: {category.color}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <button className={`px-3 py-1 rounded-full text-xs font-bold ${
                                  category.enabled ? 'bg-[#D1FAE5] text-[#065F46]' : 'bg-[#FEE2E2] text-[#991B1B]'
                                }`}>
                                  {category.enabled ? 'Enabled' : 'Disabled'}
                                </button>
                                <button className="p-2 hover:bg-[#F8FAFC] rounded-lg transition-colors">
                                  <Edit2 className="w-4 h-4 text-[#3B82F6]" />
                                </button>
                                <button className="p-2 hover:bg-[#FEE2E2] rounded-lg transition-colors">
                                  <Trash2 className="w-4 h-4 text-[#EF4444]" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-[#1E293B] mb-6">Service Radius Settings</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <label className="text-sm font-medium text-[#64748B] mb-2 block">Default Radius</label>
                            <select className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm">
                              <option>5 km</option>
                              <option>10 km</option>
                              <option>15 km</option>
                              <option>Custom</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-[#64748B] mb-2 block">Maximum Radius</label>
                            <input type="number" defaultValue="50" className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm" />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-[#64748B] mb-2 block">Smart Calculation</label>
                            <select className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm">
                              <option>AI-based travel time</option>
                              <option>Fixed distance</option>
                              <option>Manual</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-[#1E293B] mb-6">Order Cancellation Rules</h2>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="text-sm font-medium text-[#64748B] mb-2 block">Customer Cancellation Time Limit</label>
                              <input type="number" defaultValue="5" placeholder="Minutes" className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm" />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-[#64748B] mb-2 block">Professional Cancellation Limit</label>
                              <input type="number" defaultValue="3" placeholder="Max per day" className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm" />
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <input type="checkbox" id="autoPenalty" defaultChecked className="w-4 h-4" />
                            <label htmlFor="autoPenalty" className="text-sm text-[#64748B]">Auto penalty rules enabled</label>
                          </div>
                          <div className="flex items-center gap-3">
                            <input type="checkbox" id="autoRefund" defaultChecked className="w-4 h-4" />
                            <label htmlFor="autoRefund" className="text-sm text-[#64748B]">Auto refund rules enabled</label>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-[#1E293B] mb-6">Booking Types</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {['Immediate booking', 'Scheduled booking', 'Priority booking (extra charge)', 'Overnight booking'].map((type, index) => (
                            <div key={index} className="flex items-center justify-between p-4 border border-[#E2E8F0] rounded-lg">
                              <span className="text-sm text-[#1E293B]">{type}</span>
                              <input type="checkbox" defaultChecked className="w-4 h-4" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Commission & Charges */}
                  {activeTab === 'commission' && (
                    <div className="space-y-6">
                      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-[#1E293B] mb-6">Commission for Professionals</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="text-sm font-medium text-[#64748B] mb-2 block">Category-wise Commission (%)</label>
                            <input type="number" defaultValue="15" className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm" />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-[#64748B] mb-2 block">Surge Commission (%)</label>
                            <input type="number" defaultValue="25" className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm" />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-[#64748B] mb-2 block">Minimum Commission per Job (₹)</label>
                            <input type="number" defaultValue="20" className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm" />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-[#64748B] mb-2 block">Penalty Deductions (%)</label>
                            <input type="number" defaultValue="5" className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm" />
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-[#1E293B] mb-6">Shop Commission</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <label className="text-sm font-medium text-[#64748B] mb-2 block">Item Commission (%)</label>
                            <input type="number" defaultValue="10" className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm" />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-[#64748B] mb-2 block">Delivery Commission (%)</label>
                            <input type="number" defaultValue="5" className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm" />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-[#64748B] mb-2 block">Minimum Payout Threshold (₹)</label>
                            <input type="number" defaultValue="1000" className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm" />
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-[#1E293B] mb-6">Platform Fees</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="text-sm font-medium text-[#64748B] mb-2 block">Service Charge (₹)</label>
                            <input type="number" defaultValue="10" className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm" />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-[#64748B] mb-2 block">Convenience Fee (₹)</label>
                            <input type="number" defaultValue="5" className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm" />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-[#64748B] mb-2 block">GST (%)</label>
                            <input type="number" defaultValue="18" className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm" />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-[#64748B] mb-2 block">Peak Hour Surcharge (%)</label>
                            <input type="number" defaultValue="20" className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm" />
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-[#1E293B] mb-6">Cancellation Fees</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="text-sm font-medium text-[#64748B] mb-2 block">Customer Cancellation Charge (₹)</label>
                            <input type="number" defaultValue="50" className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm" />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-[#64748B] mb-2 block">Professional Cancellation Charge (₹)</label>
                            <input type="number" defaultValue="100" className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm" />
                          </div>
                        </div>
                        <div className="mt-4 flex items-center gap-3">
                          <input type="checkbox" id="autoDeduct" defaultChecked className="w-4 h-4" />
                          <label htmlFor="autoDeduct" className="text-sm text-[#64748B]">Auto-deduct cancellation fees</label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Security Settings */}
                  {activeTab === 'security' && (
                    <div className="space-y-6">
                      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-[#1E293B] mb-6">Login Security</h2>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-lg">
                            <div>
                              <p className="text-sm font-bold text-[#1E293B]">Two Factor Authentication (2FA)</p>
                              <p className="text-xs text-[#64748B]">Require OTP for admin login</p>
                            </div>
                            <button
                              onClick={() => setTwoFactorAuth(!twoFactorAuth)}
                              className={`relative w-14 h-7 rounded-full transition-colors ${
                                twoFactorAuth ? 'bg-[#10B981]' : 'bg-[#64748B]'
                              }`}
                            >
                              <span
                                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                                  twoFactorAuth ? 'translate-x-7' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="text-sm font-medium text-[#64748B] mb-2 block">Failed Login Auto-lock (attempts)</label>
                              <input type="number" defaultValue="5" className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm" />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-[#64748B] mb-2 block">OTP Restrictions</label>
                              <select className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm">
                                <option>Max 3 per hour</option>
                                <option>Max 5 per hour</option>
                                <option>Unlimited</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-[#1E293B] mb-6">Password Policy</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="text-sm font-medium text-[#64748B] mb-2 block">Minimum Length</label>
                            <input type="number" defaultValue="8" className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm" />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-[#64748B] mb-2 block">Password Expiry (days)</label>
                            <input type="number" defaultValue="90" className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm" />
                          </div>
                        </div>
                        <div className="mt-4 space-y-3">
                          <div className="flex items-center gap-3">
                            <input type="checkbox" id="specialChars" defaultChecked className="w-4 h-4" />
                            <label htmlFor="specialChars" className="text-sm text-[#64748B]">Require special characters</label>
                          </div>
                          <div className="flex items-center gap-3">
                            <input type="checkbox" id="uppercase" defaultChecked className="w-4 h-4" />
                            <label htmlFor="uppercase" className="text-sm text-[#64748B]">Require uppercase letters</label>
                          </div>
                          <div className="flex items-center gap-3">
                            <input type="checkbox" id="numbers" defaultChecked className="w-4 h-4" />
                            <label htmlFor="numbers" className="text-sm text-[#64748B]">Require numbers</label>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-[#1E293B] mb-6">Session Controls</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="text-sm font-medium text-[#64748B] mb-2 block">Auto Logout Time (minutes)</label>
                            <input type="number" defaultValue="30" className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm" />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-[#64748B] mb-2 block">Allow Multiple Sessions</label>
                            <select className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm">
                              <option>No</option>
                              <option>Yes</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-[#1E293B] mb-6">Fraud Protection</h2>
                        <div className="space-y-3">
                          {['Auto-flag suspicious orders', 'Block VPN/Proxy users', 'IP-based restrictions', 'Device binding system'].map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-3 border border-[#E2E8F0] rounded-lg">
                              <span className="text-sm text-[#1E293B]">{item}</span>
                              <input type="checkbox" defaultChecked={index === 0 || index === 3} className="w-4 h-4" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Roles & Permissions */}
                  {activeTab === 'roles' && (
                    <div className="space-y-6">
                      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                          <h2 className="text-lg font-bold text-[#1E293B]">Role List</h2>
                          <button className="px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-colors flex items-center gap-2 text-sm font-medium">
                            <Plus className="w-4 h-4" />
                            Create New Role
                          </button>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-[#E2E8F0]">
                                <th className="text-left text-xs font-semibold text-[#64748B] pb-3">Role Name</th>
                                <th className="text-center text-xs font-semibold text-[#64748B] pb-3">Users</th>
                                <th className="text-left text-xs font-semibold text-[#64748B] pb-3">Permissions</th>
                                <th className="text-center text-xs font-semibold text-[#64748B] pb-3">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {roles.map((role, index) => (
                                <tr key={index} className="border-b border-[#E2E8F0] last:border-0">
                                  <td className="py-4 text-sm font-bold text-[#1E293B]">{role.name}</td>
                                  <td className="py-4 text-center">
                                    <span className="px-3 py-1 bg-[#DBEAFE] text-[#1E40AF] rounded-full text-xs font-bold">
                                      {role.users}
                                    </span>
                                  </td>
                                  <td className="py-4 text-sm text-[#64748B]">{role.permissions}</td>
                                  <td className="py-4">
                                    <div className="flex items-center justify-center gap-2">
                                      <button className="p-2 hover:bg-[#F8FAFC] rounded-lg transition-colors">
                                        <Edit2 className="w-4 h-4 text-[#3B82F6]" />
                                      </button>
                                      <button className="p-2 hover:bg-[#FEE2E2] rounded-lg transition-colors">
                                        <Trash2 className="w-4 h-4 text-[#EF4444]" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-[#1E293B] mb-6">Permission Matrix</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {['View Orders', 'Edit Orders', 'Manage Verification', 'Access Payments', 'Suspend Users', 'Edit Settings', 'View Reports', 'Delete Data'].map((permission, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 border border-[#E2E8F0] rounded-lg">
                              <input type="checkbox" defaultChecked={index < 5} className="w-4 h-4" />
                              <span className="text-sm text-[#1E293B]">{permission}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Backup & Restore */}
                  {activeTab === 'backup' && (
                    <div className="space-y-6">
                      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-[#1E293B] mb-6">Automatic Backup</h2>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-lg">
                            <div>
                              <p className="text-sm font-bold text-[#1E293B]">Enable Auto Backup</p>
                              <p className="text-xs text-[#64748B]">Automatically backup data at scheduled intervals</p>
                            </div>
                            <button
                              onClick={() => setAutoBackup(!autoBackup)}
                              className={`relative w-14 h-7 rounded-full transition-colors ${
                                autoBackup ? 'bg-[#10B981]' : 'bg-[#64748B]'
                              }`}
                            >
                              <span
                                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                                  autoBackup ? 'translate-x-7' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-[#64748B] mb-2 block">Backup Frequency</label>
                            <select className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm">
                              <option>Daily at 2:00 AM</option>
                              <option>Weekly on Sunday</option>
                              <option>Monthly on 1st</option>
                            </select>
                          </div>
                          <div className="p-4 bg-[#F0FDF4] border border-[#10B981]/20 rounded-lg">
                            <p className="text-sm font-bold text-[#065F46] mb-1">Last Backup</p>
                            <p className="text-xs text-[#064E3B]">December 10, 2025 at 2:00 AM</p>
                            <p className="text-xs text-[#064E3B] mt-1">Size: 245 MB</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-[#1E293B] mb-6">Manual Backup</h2>
                        <p className="text-sm text-[#64748B] mb-4">Download a complete backup including database, settings, and logs</p>
                        <button className="w-full px-6 py-4 bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white rounded-xl hover:shadow-lg transition-all text-base font-bold flex items-center justify-center gap-3">
                          <Download className="w-5 h-5" />
                          Download Backup ZIP
                        </button>
                      </div>

                      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-[#1E293B] mb-6">Restore System</h2>
                        <div className="border-2 border-dashed border-[#E2E8F0] rounded-lg p-8 text-center hover:border-[#10B981] transition-colors cursor-pointer">
                          <Upload className="w-12 h-12 text-[#64748B] mx-auto mb-3" />
                          <p className="text-sm font-medium text-[#1E293B] mb-1">Upload Backup File</p>
                          <p className="text-xs text-[#64748B]">Click to browse or drag & drop backup ZIP file</p>
                        </div>
                        <div className="mt-4 p-4 bg-[#FEF2F2] border border-[#EF4444]/20 rounded-lg">
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-[#EF4444] flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-bold text-[#991B1B]">⚠️ Warning</p>
                              <p className="text-xs text-[#991B1B] mt-1">Restoring will overwrite all current data. This action cannot be undone.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* App Version Control */}
                  {activeTab === 'version' && (
                    <div className="space-y-6">
                      {['Customer App', 'Professional App', 'Shop App'].map((appType, index) => (
                        <div key={index} className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                          <h2 className="text-lg font-bold text-[#1E293B] mb-6">{appType}</h2>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="text-sm font-medium text-[#64748B] mb-2 block">Current Version</label>
                              <input type="text" defaultValue="2.5.0" className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm" />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-[#64748B] mb-2 block">Minimum Required Version</label>
                              <input type="text" defaultValue="2.0.0" className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm" />
                            </div>
                          </div>
                          <div className="mt-4 flex items-center gap-3">
                            <input type="checkbox" id={`forceUpdate${index}`} className="w-4 h-4" />
                            <label htmlFor={`forceUpdate${index}`} className="text-sm text-[#64748B]">Force update for users</label>
                          </div>
                          <div className="mt-4">
                            <label className="text-sm font-medium text-[#64748B] mb-2 block">Update Notes</label>
                            <textarea rows={3} placeholder="What's new in this version..." className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm resize-none"></textarea>
                          </div>
                          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                            <button className="px-4 py-3 border-2 border-dashed border-[#E2E8F0] rounded-lg hover:border-[#10B981] transition-colors text-sm font-medium text-[#64748B] flex items-center justify-center gap-2">
                              <Upload className="w-4 h-4" />
                              Upload Android APK
                            </button>
                            <button className="px-4 py-3 border-2 border-dashed border-[#E2E8F0] rounded-lg hover:border-[#10B981] transition-colors text-sm font-medium text-[#64748B] flex items-center justify-center gap-2">
                              <Globe className="w-4 h-4" />
                              Add iOS Build Link
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Legal & Policy */}
                  {activeTab === 'legal' && (
                    <div className="space-y-6">
                      {['Terms & Conditions', 'Privacy Policy', 'Refund Policy', 'Trust & Safety Guidelines', 'Cookie Policy'].map((policy, index) => (
                        <div key={index} className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
                          <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-[#1E293B]">{policy}</h2>
                            <button className="px-4 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors flex items-center gap-2 text-sm font-medium">
                              <Eye className="w-4 h-4" />
                              Preview
                            </button>
                          </div>
                          <textarea 
                            rows={8} 
                            placeholder={`Enter ${policy.toLowerCase()} content...`}
                            className="w-full px-4 py-3 border border-[#E2E8F0] rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                            defaultValue={index === 0 ? 'By using this platform, you agree to comply with all terms and conditions...' : ''}
                          />
                          <div className="mt-4 flex items-center justify-between">
                            <p className="text-xs text-[#64748B]">Last updated: December 10, 2025</p>
                            <button className="px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-colors text-sm font-medium">
                              Save Changes
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
