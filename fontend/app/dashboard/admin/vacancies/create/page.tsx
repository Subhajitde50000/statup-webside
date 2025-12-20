'use client';

import React, { useState } from 'react';
import {
  Briefcase,
  Building2,
  MapPin,
  DollarSign,
  Users,
  FileText,
  List,
  Award,
  Clock,
  Save,
  Send,
  X,
  Plus,
  Trash2,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createVacancy, APIError } from '@/utils/vacancies';

export default function CreateVacancyPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');

  const [formData, setFormData] = useState({
    jobTitle: '',
    roleLevel: '',
    department: '',
    hiringFor: '',
    employmentType: '',
    positions: '1',
    salaryMin: '',
    salaryMax: '',
    location: '',
    description: '',
    responsibilities: [''],
    skills: [''],
    experience: '',
    autoClose: true,
    aiScreening: false,
    priority: 'medium',
    postingType: 'both',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const roleLevels = ['Entry Level', 'Mid Level', 'Senior Level', 'Lead', 'Manager'];
  const departments = [
    'Operations',
    'Customer Support',
    'Sales & Marketing',
    'Technology',
    'HR & Recruitment',
    'Finance',
  ];
  const hiringTypes = [
    'Service Professional',
    'Shop Staff',
    'Admin Staff',
    'Customer Support',
    'Delivery Partner',
    'KYC Verifier',
    'Quality Analyst',
  ];
  const employmentTypes = ['Full-time', 'Part-time', 'Contract', 'Temporary'];
  const experienceLevels = [
    'Fresher (0-1 years)',
    '1-3 years',
    '3-5 years',
    '5-10 years',
    '10+ years',
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
    if (formErrors[field]) {
      setFormErrors({ ...formErrors, [field]: '' });
    }
  };

  const handleArrayChange = (field: 'responsibilities' | 'skills', index: number, value: string) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field: 'responsibilities' | 'skills') => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const removeArrayItem = (field: 'responsibilities' | 'skills', index: number) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.jobTitle.trim()) errors.jobTitle = 'Job title is required';
    if (!formData.roleLevel) errors.roleLevel = 'Role level is required';
    if (!formData.department) errors.department = 'Department is required';
    if (!formData.hiringFor) errors.hiringFor = 'Hiring type is required';
    if (!formData.employmentType) errors.employmentType = 'Employment type is required';
    if (!formData.positions || parseInt(formData.positions) < 1)
      errors.positions = 'Valid position count required';
    if (!formData.salaryMin || !formData.salaryMax) errors.salary = 'Salary range is required';
    if (parseInt(formData.salaryMin) >= parseInt(formData.salaryMax))
      errors.salary = 'Max salary must be greater than min';
    if (!formData.location.trim()) errors.location = 'Location is required';
    if (!formData.description.trim()) errors.description = 'Job description is required';
    if (!formData.experience) errors.experience = 'Experience requirement is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (isDraft: boolean) => {
    if (!isDraft && !validateForm()) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data for API
      const vacancyData = {
        job_title: formData.jobTitle,
        role_level: formData.roleLevel,
        department: formData.department,
        hiring_for: formData.hiringFor,
        employment_type: formData.employmentType,
        positions: parseInt(formData.positions),
        salary_min: parseInt(formData.salaryMin),
        salary_max: parseInt(formData.salaryMax),
        location: formData.location,
        description: formData.description,
        responsibilities: formData.responsibilities.filter(r => r.trim() !== ''),
        skills: formData.skills.filter(s => s.trim() !== ''),
        experience: formData.experience,
        auto_close: formData.autoClose,
        ai_screening: formData.aiScreening,
        priority: formData.priority,
        posting_type: formData.postingType,
      };

      const response = await createVacancy(vacancyData);
      
      showToast(
        response.message || 'Vacancy created successfully!',
        'success'
      );
      
      setTimeout(() => {
        router.push('/dashboard/admin/vacancies/list');
      }, 1500);
    } catch (err) {
      if (err instanceof APIError) {
        if (err.status === 403) {
          showToast('Access denied. Please login as Admin or Manager.', 'error');
          setTimeout(() => {
            router.push('/auth');
          }, 2000);
        } else {
          showToast(err.message, 'error');
        }
      } else {
        showToast('Failed to create vacancy. Please try again.', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#1B1F3B] mb-2">Create New Vacancy</h1>
            <p className="text-[#6B7280]">Fill in the details to post a new job opening</p>
          </div>
          <Link
            href="/dashboard/admin/vacancies/list"
            className="px-4 py-2 text-[#6B7280] hover:text-[#1B1F3B] font-semibold flex items-center gap-2"
          >
            <X className="w-5 h-5" />
            Cancel
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {/* Basic Information */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-[#1B1F3B] mb-6 flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-[#0057D9]" />
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-[#1B1F3B] mb-2">
                  Job Title <span className="text-[#E53935]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.jobTitle}
                  onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                  placeholder="e.g. Service Professional - Plumber"
                  className={`w-full px-4 py-3 text-gray-700 border-2 rounded-xl focus:outline-none focus:border-[#0057D9] transition-colors ${
                    formErrors.jobTitle ? 'border-[#E53935]' : 'border-gray-200'
                  }`}
                />
                {formErrors.jobTitle && (
                  <p className="text-[#E53935] text-sm mt-1">{formErrors.jobTitle}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1B1F3B] mb-2">
                  Role Level <span className="text-[#E53935]">*</span>
                </label>
                <select
                  value={formData.roleLevel}
                  onChange={(e) => handleInputChange('roleLevel', e.target.value)}
                  className={`w-full px-4 py-3 text-gray-700 border-2 rounded-xl focus:outline-none focus:border-[#0057D9] transition-colors ${
                    formErrors.roleLevel ? 'border-[#E53935]' : 'border-gray-200'
                  }`}
                >
                  <option value="">Select Level</option>
                  {roleLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1B1F3B] mb-2">
                  Department <span className="text-[#E53935]">*</span>
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  className={`w-full px-4 py-3 text-gray-700 border-2 rounded-xl focus:outline-none focus:border-[#0057D9] transition-colors ${
                    formErrors.department ? 'border-[#E53935]' : 'border-gray-200'
                  }`}
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1B1F3B] mb-2">
                  Hiring For <span className="text-[#E53935]">*</span>
                </label>
                <select
                  value={formData.hiringFor}
                  onChange={(e) => handleInputChange('hiringFor', e.target.value)}
                  className={`w-full px-4 py-3 text-gray-700 border-2 rounded-xl focus:outline-none focus:border-[#0057D9] transition-colors ${
                    formErrors.hiringFor ? 'border-[#E53935]' : 'border-gray-200'
                  }`}
                >
                  <option value="">Select Type</option>
                  {hiringTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1B1F3B] mb-2">
                  Employment Type <span className="text-[#E53935]">*</span>
                </label>
                <select
                  value={formData.employmentType}
                  onChange={(e) => handleInputChange('employmentType', e.target.value)}
                  className={`w-full px-4 py-3 text-gray-700 border-2 rounded-xl focus:outline-none focus:border-[#0057D9] transition-colors ${
                    formErrors.employmentType ? 'border-[#E53935]' : 'border-gray-200'
                  }`}
                >
                  <option value="">Select Type</option>
                  {employmentTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1B1F3B] mb-2">
                  Number of Positions <span className="text-[#E53935]">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.positions}
                  onChange={(e) => handleInputChange('positions', e.target.value)}
                  className={`w-full px-4 py-3 text-gray-700 border-2 rounded-xl focus:outline-none focus:border-[#0057D9] transition-colors ${
                    formErrors.positions ? 'border-[#E53935]' : 'border-gray-200'
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1B1F3B] mb-2">
                  Salary Range (₹/month) <span className="text-[#E53935]">*</span>
                </label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={formData.salaryMin}
                    onChange={(e) => handleInputChange('salaryMin', e.target.value)}
                    placeholder="Min"
                    className={`w-full px-4 py-3 text-gray-700 border-2 rounded-xl focus:outline-none focus:border-[#0057D9] transition-colors ${
                      formErrors.salary ? 'border-[#E53935]' : 'border-gray-200'
                    }`}
                  />
                  <input
                    type="number"
                    value={formData.salaryMax}
                    onChange={(e) => handleInputChange('salaryMax', e.target.value)}
                    placeholder="Max"
                    className={`w-full px-4 py-3 text-gray-700 border-2 rounded-xl focus:outline-none focus:border-[#0057D9] transition-colors ${
                      formErrors.salary ? 'border-[#E53935]' : 'border-gray-200'
                    }`}
                  />
                </div>
                {formErrors.salary && <p className="text-[#E53935] text-sm mt-1">{formErrors.salary}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1B1F3B] mb-2">
                  Job Location <span className="text-[#E53935]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="e.g. Mumbai, Bangalore, Remote"
                  className={`w-full px-4 py-3 text-gray-700 border-2 rounded-xl focus:outline-none focus:border-[#0057D9] transition-colors ${
                    formErrors.location ? 'border-[#E53935]' : 'border-gray-200'
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1B1F3B] mb-2">
                  Experience Required <span className="text-[#E53935]">*</span>
                </label>
                <select
                  value={formData.experience}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  className={`w-full px-4 py-3 text-gray-700 border-2 rounded-xl focus:outline-none focus:border-[#0057D9] transition-colors ${
                    formErrors.experience ? 'border-[#E53935]' : 'border-gray-200'
                  }`}
                >
                  <option value="">Select Experience</option>
                  {experienceLevels.map((exp) => (
                    <option key={exp} value={exp}>
                      {exp}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className="mb-8 pb-8 border-b border-gray-100">
            <h2 className="text-xl font-bold text-[#1B1F3B] mb-6 flex items-center gap-2">
              <FileText className="w-6 h-6 text-[#0057D9]" />
              Job Description
            </h2>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={6}
              placeholder="Describe the role, what the candidate will do, and the impact they'll have..."
              className={`w-full px-4 py-3 text-gray-700 border-2 rounded-xl focus:outline-none focus:border-[#0057D9] transition-colors resize-none ${
                formErrors.description ? 'border-[#E53935]' : 'border-gray-200'
              }`}
            />
          </div>

          {/* Responsibilities */}
          <div className="mb-8 pb-8 border-b border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#1B1F3B] flex items-center gap-2">
                <List className="w-6 h-6 text-[#0057D9]" />
                Key Responsibilities
              </h2>
              <button
                onClick={() => addArrayItem('responsibilities')}
                className="px-4 py-2 bg-[#0057D9] text-white rounded-lg font-semibold hover:bg-[#0044AA] transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
            <div className="space-y-3">
              {formData.responsibilities.map((resp, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    type="text"
                    value={resp}
                    onChange={(e) => handleArrayChange('responsibilities', index, e.target.value)}
                    placeholder={`Responsibility ${index + 1}`}
                    className="flex-1 px-4 py-3 text-gray-700 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#0057D9] transition-colors"
                  />
                  {formData.responsibilities.length > 1 && (
                    <button
                      onClick={() => removeArrayItem('responsibilities', index)}
                      className="px-3 py-2 text-[#E53935] hover:bg-[#FFEBEE] rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Required Skills */}
          <div className="mb-8 pb-8 border-b border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#1B1F3B] flex items-center gap-2">
                <Award className="w-6 h-6 text-[#0057D9]" />
                Required Skills
              </h2>
              <button
                onClick={() => addArrayItem('skills')}
                className="px-4 py-2 bg-[#0057D9] text-white rounded-lg font-semibold hover:bg-[#0044AA] transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
            <div className="space-y-3">
              {formData.skills.map((skill, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => handleArrayChange('skills', index, e.target.value)}
                    placeholder={`Skill ${index + 1}`}
                    className="flex-1 px-4 py-3 text-gray-700 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#0057D9] transition-colors"
                  />
                  {formData.skills.length > 1 && (
                    <button
                      onClick={() => removeArrayItem('skills', index)}
                      className="px-3 py-2 text-[#E53935] hover:bg-[#FFEBEE] rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Advanced Options */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-[#1B1F3B] mb-6 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-[#0057D9]" />
              Advanced Options
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#F4F7FB] rounded-xl">
                <div>
                  <p className="font-semibold text-[#1B1F3B]">Auto-close when filled</p>
                  <p className="text-sm text-[#6B7280]">Automatically close vacancy when positions are filled</p>
                </div>
                <label className="relative inline-block w-14 h-7">
                  <input
                    type="checkbox"
                    checked={formData.autoClose}
                    onChange={(e) => handleInputChange('autoClose', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-300 rounded-full peer peer-checked:bg-[#0057D9] transition-colors cursor-pointer"></div>
                  <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-7"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-[#F4F7FB] rounded-xl">
                <div>
                  <p className="font-semibold text-[#1B1F3B]">AI-based auto-screening</p>
                  <p className="text-sm text-[#6B7280]">Use AI to automatically screen applicants</p>
                </div>
                <label className="relative inline-block w-14 h-7">
                  <input
                    type="checkbox"
                    checked={formData.aiScreening}
                    onChange={(e) => handleInputChange('aiScreening', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-300 rounded-full peer peer-checked:bg-[#0057D9] transition-colors cursor-pointer"></div>
                  <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-7"></div>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#1B1F3B] mb-2">Priority Level</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                    className="w-full px-4 py-3 text-gray-700 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#0057D9] transition-colors"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#1B1F3B] mb-2">Posting Type</label>
                  <select
                    value={formData.postingType}
                    onChange={(e) => handleInputChange('postingType', e.target.value)}
                    className="w-full px-4 py-3 text-gray-700 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#0057D9] transition-colors"
                  >
                    <option value="internal">Internal Only</option>
                    <option value="external">External Only</option>
                    <option value="both">Both Internal & External</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-100">
            <Link
              href="/dashboard/admin/vacancies/list"
              className="px-6 py-3 text-[#6B7280] hover:text-[#1B1F3B] font-semibold rounded-xl hover:bg-gray-100 transition-colors"
            >
              Cancel
            </Link>
            <button
              onClick={() => handleSubmit(true)}
              disabled={isSubmitting}
              className="px-6 py-3 bg-gray-200 text-[#1B1F3B] rounded-xl font-semibold hover:bg-gray-300 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              Save as Draft
            </button>
            <button
              onClick={() => handleSubmit(false)}
              disabled={isSubmitting}
              className="px-6 py-3 bg-gradient-to-r from-[#0057D9] to-[#0044AA] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#0057D9]/30 transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
              {isSubmitting ? 'Publishing...' : 'Publish Vacancy'}
            </button>
          </div>
        </div>
      </div>

      {/* Processing Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-sm mx-4 text-center">
            <div className="w-16 h-16 border-4 border-[#0057D9] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#1B1F3B] font-semibold text-lg">Publishing Vacancy...</p>
            <p className="text-[#6B7280] text-sm mt-2">Please wait while we create the job posting</p>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showNotification && (
        <div className="fixed top-24 right-8 z-50 animate-slide-in">
          <div
            className={`px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 ${
              notificationType === 'success'
                ? 'bg-[#3CB878] text-white'
                : 'bg-[#E53935] text-white'
            }`}
          >
            {notificationType === 'success' ? (
              <AlertCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="font-semibold">{notificationMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
