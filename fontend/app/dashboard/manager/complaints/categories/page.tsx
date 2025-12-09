'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, AlertTriangle, Save } from 'lucide-react';
import TopNavbar from '../../../components/TopNavbar';
import LeftSidebar from '../../../components/LeftSidebar';

export default function CategoriesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showAddCategory, setShowAddCategory] = useState(false);

  const categories = [
    {
      id: 1,
      name: 'Service Quality',
      subCategories: ['Late Arrival', 'Bad Behavior', 'Overcharging', 'Damage to Property', 'Poor Work Quality'],
      autoPriority: 'Medium',
      visibleInApp: true,
      complaintsCount: 84,
    },
    {
      id: 2,
      name: 'Payment Issue',
      subCategories: ['Wrong Amount Charged', 'Refund Not Received', 'Discount Not Applied', 'Hidden Charges'],
      autoPriority: 'High',
      visibleInApp: true,
      complaintsCount: 53,
    },
    {
      id: 3,
      name: 'Behavior/Abuse',
      subCategories: ['Rude Behavior', 'Harassment', 'Verbal Abuse', 'Inappropriate Comments'],
      autoPriority: 'Critical',
      visibleInApp: true,
      complaintsCount: 38,
    },
    {
      id: 4,
      name: 'Fraud/Scam',
      subCategories: ['Fake Documents', 'Identity Theft', 'Payment Fraud', 'Fake Service Provider'],
      autoPriority: 'Critical',
      visibleInApp: true,
      complaintsCount: 29,
    },
    {
      id: 5,
      name: 'Product Quality',
      subCategories: ['Defective Product', 'Wrong Item Delivered', 'Expired Product', 'Missing Parts'],
      autoPriority: 'Medium',
      visibleInApp: true,
      complaintsCount: 22,
    },
    {
      id: 6,
      name: 'Safety Issue',
      subCategories: ['Unsafe Practices', 'Health Risk', 'Equipment Damage', 'Property Damage'],
      autoPriority: 'Critical',
      visibleInApp: true,
      complaintsCount: 15,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      <TopNavbar />
      <div className="flex">
        <LeftSidebar isOpen={sidebarOpen} />
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
          <div className="p-8">
            <div className="max-w-[1400px] mx-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-semibold text-[#1E293B]">Complaint Categories</h1>
                  <p className="text-sm text-[#64748B] mt-1">Manage complaint categories and sub-categories</p>
                </div>
                <button 
                  onClick={() => setShowAddCategory(true)}
                  className="px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-colors flex items-center gap-2 text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add New Category
                </button>
              </div>

              {/* Add Category Modal */}
              {showAddCategory && (
                <div className="mb-6 p-6 bg-white rounded-xl border-2 border-[#10B981] shadow-lg">
                  <h2 className="text-lg font-semibold text-[#1E293B] mb-4">Add New Category</h2>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-sm font-medium text-[#64748B] mb-2 block">Category Name</label>
                      <input type="text" placeholder="e.g., App Technical Issue" className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-[#64748B] mb-2 block">Auto Priority</label>
                      <select className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm">
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                        <option>Critical</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="text-sm font-medium text-[#64748B] mb-2 block">Sub-categories (comma separated)</label>
                    <input type="text" placeholder="e.g., App Crash, Login Issue, Payment Error" className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm" />
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <input type="checkbox" id="visible" className="w-4 h-4" defaultChecked />
                    <label htmlFor="visible" className="text-sm text-[#64748B]">Visible in Customer/Professional App</label>
                  </div>
                  <div className="flex gap-3">
                    <button className="px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-colors text-sm font-medium flex items-center gap-2">
                      <Save className="w-4 h-4" />
                      Save Category
                    </button>
                    <button 
                      onClick={() => setShowAddCategory(false)}
                      className="px-4 py-2 bg-[#64748B] text-white rounded-lg hover:bg-[#475569] transition-colors text-sm font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Categories Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {categories.map((category) => (
                  <div key={category.id} className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm hover:shadow-md transition-shadow">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-[#1E293B]">{category.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold border-2 ${
                          category.autoPriority === 'Critical' ? 'bg-[#FEE2E2] text-[#991B1B] border-[#EF4444]' :
                          category.autoPriority === 'High' ? 'bg-[#FED7AA] text-[#9A3412] border-[#F59E0B]' :
                          category.autoPriority === 'Medium' ? 'bg-[#FEF3C7] text-[#92400E] border-[#F59E0B]' :
                          'bg-[#D1FAE5] text-[#065F46] border-[#10B981]'
                        }`}>
                          {category.autoPriority}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-[#F8FAFC] rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4 text-[#3B82F6]" />
                        </button>
                        <button className="p-2 hover:bg-[#F8FAFC] rounded-lg transition-colors">
                          {category.visibleInApp ? (
                            <Eye className="w-4 h-4 text-[#10B981]" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-[#64748B]" />
                          )}
                        </button>
                        <button className="p-2 hover:bg-[#FEE2E2] rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4 text-[#EF4444]" />
                        </button>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="px-3 py-1 bg-[#F8FAFC] rounded-lg">
                        <span className="text-xs text-[#64748B]">Total Complaints: </span>
                        <span className="text-sm font-bold text-[#1E293B]">{category.complaintsCount}</span>
                      </div>
                      <div className="px-3 py-1 bg-[#F8FAFC] rounded-lg">
                        <span className="text-xs text-[#64748B]">Sub-categories: </span>
                        <span className="text-sm font-bold text-[#1E293B]">{category.subCategories.length}</span>
                      </div>
                    </div>

                    {/* Sub-categories */}
                    <div>
                      <p className="text-xs font-medium text-[#64748B] mb-2">Sub-categories:</p>
                      <div className="flex flex-wrap gap-2">
                        {category.subCategories.map((sub, index) => (
                          <span key={index} className="px-3 py-1 bg-[#ECFDF5] text-[#065F46] rounded-full text-xs font-medium">
                            {sub}
                          </span>
                        ))}
                        <button className="px-3 py-1 border-2 border-dashed border-[#10B981] text-[#10B981] rounded-full text-xs font-medium hover:bg-[#ECFDF5] transition-colors">
                          + Add Sub
                        </button>
                      </div>
                    </div>

                    {/* Visibility Status */}
                    <div className="mt-4 pt-4 border-t border-[#E2E8F0]">
                      <div className="flex items-center gap-2">
                        {category.visibleInApp ? (
                          <>
                            <div className="w-2 h-2 bg-[#10B981] rounded-full" />
                            <span className="text-xs text-[#64748B]">Visible in apps</span>
                          </>
                        ) : (
                          <>
                            <div className="w-2 h-2 bg-[#64748B] rounded-full" />
                            <span className="text-xs text-[#64748B]">Hidden from apps</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
