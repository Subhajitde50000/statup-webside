'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { submitApplication, APIError } from '@/utils/applications';
import { getVacancyById, Vacancy } from '@/utils/vacancies';
import { 
  ArrowLeft, Upload, FileText, Mail, Phone, MapPin, User, Briefcase, 
  GraduationCap, Calendar, Award, Link2, Github, Linkedin, Twitter,
  CheckCircle, AlertCircle, Loader2, Star, Shield, Info
} from 'lucide-react';

export default function ApplyPage() {
  const params = useParams();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [job, setJob] = useState<Vacancy | null>(null);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    currentLocation: '',
    dateOfBirth: '',
    
    // Professional Information
    currentCompany: '',
    currentDesignation: '',
    totalExperience: '',
    currentSalary: '',
    expectedSalary: '',
    noticePeriod: '',
    
    // Education
    highestQualification: '',
    university: '',
    graduationYear: '',
    cgpa: '',
    
    // Additional Information
    coverLetter: '',
    portfolio: '',
    github: '',
    linkedin: '',
    twitter: '',
    
    // Documents
    resume: null,
    additionalDocs: null,
    
    // Preferences
    willingToRelocate: false,
    availableForInterview: true,
    agreedToTerms: false
  });

  const [errors, setErrors] = useState<any>({});

  // Fetch job details
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await getVacancyById(params.id as string);
        setJob(response.vacancy);
      } catch (err) {
        setError('Failed to load job details');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchJob();
  }, [params.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, [fieldName]: file }));
      if (errors[fieldName]) {
        setErrors((prev: any) => ({ ...prev, [fieldName]: '' }));
      }
    }
  };

  const validateStep = (step: number) => {
    const newErrors: any = {};

    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) newErrors.phone = 'Invalid phone number';
      if (!formData.currentLocation.trim()) newErrors.currentLocation = 'Location is required';
    }

    if (step === 2) {
      if (!formData.totalExperience) newErrors.totalExperience = 'Experience is required';
      if (!formData.expectedSalary) newErrors.expectedSalary = 'Expected salary is required';
      if (!formData.noticePeriod) newErrors.noticePeriod = 'Notice period is required';
    }

    if (step === 3) {
      if (!formData.highestQualification) newErrors.highestQualification = 'Qualification is required';
    }

    if (step === 4) {
      if (!formData.resume) newErrors.resume = 'Resume is required';
      if (!formData.agreedToTerms) newErrors.agreedToTerms = 'You must agree to terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(4)) return;

    setIsSubmitting(true);

    try {
      const applicationData = {
        vacancy_id: params.id as string,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        current_location: formData.currentLocation,
        date_of_birth: formData.dateOfBirth,
        
        current_company: formData.currentCompany,
        current_designation: formData.currentDesignation,
        total_experience: formData.totalExperience,
        current_salary: formData.currentSalary,
        expected_salary: formData.expectedSalary,
        notice_period: formData.noticePeriod,
        
        highest_qualification: formData.highestQualification,
        university: formData.university,
        graduation_year: formData.graduationYear,
        cgpa: formData.cgpa,
        
        cover_letter: formData.coverLetter,
        portfolio: formData.portfolio,
        github: formData.github,
        linkedin: formData.linkedin,
        twitter: formData.twitter,
        
        willing_to_relocate: formData.willingToRelocate,
        available_for_interview: formData.availableForInterview,
      };

      await submitApplication(applicationData);
      setShowSuccess(true);
    } catch (err) {
      if (err instanceof APIError) {
        if (err.status === 400 && err.message.includes('already')) {
          setErrors({ submit: 'This email has already been used to apply for this position' });
        } else {
          setErrors({ submit: err.message });
        }
      } else {
        setErrors({ submit: 'Failed to submit application. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { number: 1, title: 'Personal Info', icon: User },
    { number: 2, title: 'Professional', icon: Briefcase },
    { number: 3, title: 'Education', icon: GraduationCap },
    { number: 4, title: 'Documents', icon: FileText }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#F4F7FB] via-white to-[#E8F4F8]">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-[#0057D9] animate-spin mx-auto mb-4" />
          <p className="text-[#1B1F3B] font-medium">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#F4F7FB] via-white to-[#E8F4F8]">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-[#1B1F3B] font-medium mb-4">{error || 'Job not found'}</p>
          <Link href="/vacancies">
            <button className="px-6 py-3 bg-[#0057D9] text-white rounded-lg">
              Browse Jobs
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F4F7FB] via-white to-[#E8F4F8] flex items-center justify-center p-6">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-12 text-center">
          <div className="bg-gradient-to-r from-[#3CB878] to-emerald-500 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Application Submitted!</h1>
          <p className="text-xl text-gray-600 mb-8">
            Your application for <span className="font-semibold text-[#0057D9]">{job.job_title}</span> has been successfully submitted.
          </p>
          <div className="bg-blue-50 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-gray-800 mb-2">What's Next?</h3>
            <ul className="text-left space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-[#3CB878] mt-0.5" />
                <span>Our HR team will review your application within 2-3 business days</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-[#3CB878] mt-0.5" />
                <span>You'll receive an email confirmation shortly</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-[#3CB878] mt-0.5" />
                <span>Track your application status in your dashboard</span>
              </li>
            </ul>
          </div>
          <div className="flex gap-4 justify-center">
            <Link href="/vacancies">
              <button className="px-8 py-3 bg-gradient-to-r from-[#0057D9] to-[#0048B8] text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                Browse More Jobs
              </button>
            </Link>
            <Link href="/profile">
              <button className="px-8 py-3 border-2 border-[#0057D9] text-[#0057D9] rounded-xl font-semibold hover:bg-blue-50 transition-all">
                View My Applications
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4F7FB] via-white to-[#E8F4F8]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0057D9] to-[#1B1F3B] text-white py-6">
        <div className="max-w-4xl mx-auto px-6">
          <Link href={`/vacancies/${params.id}`}>
            <button className="flex items-center gap-2 text-white hover:text-blue-200 transition-colors mb-4">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Job Details</span>
            </button>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Apply for {job.job_title}</h1>
          <p className="text-blue-100">{job.department} - {job.hiring_for}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Progress Steps */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                    currentStep >= step.number
                      ? 'bg-gradient-to-r from-[#0057D9] to-[#0048B8] text-white shadow-lg'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {currentStep > step.number ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <step.icon className="w-6 h-6" />
                    )}
                  </div>
                  <span className={`text-sm font-semibold mt-2 ${
                    currentStep >= step.number ? 'text-[#0057D9]' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-1 flex-1 mx-4 rounded transition-all ${
                    currentStep > step.number ? 'bg-[#0057D9]' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <User className="w-6 h-6 text-[#0057D9]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Personal Information</h2>
                    <p className="text-gray-500">Tell us about yourself</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 text-gray-700 border rounded-lg focus:ring-2 focus:ring-[#0057D9] focus:border-transparent outline-none transition-all ${
                        errors.firstName ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="John"
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 text-gray-700 border rounded-lg focus:ring-2 focus:ring-[#0057D9] focus:border-transparent outline-none transition-all ${
                        errors.lastName ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="Doe"
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full pl-11 pr-4 py-3 text-gray-700 border rounded-lg focus:ring-2 focus:ring-[#0057D9] focus:border-transparent outline-none transition-all ${
                          errors.email ? 'border-red-500' : 'border-gray-200'
                        }`}
                        placeholder="john.doe@example.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full pl-11 pr-4 py-3 text-gray-700 border rounded-lg focus:ring-2 focus:ring-[#0057D9] focus:border-transparent outline-none transition-all ${
                          errors.phone ? 'border-red-500' : 'border-gray-200'
                        }`}
                        placeholder="+91 9876543210"
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Current Location <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="currentLocation"
                        value={formData.currentLocation}
                        onChange={handleInputChange}
                        className={`w-full pl-11 pr-4 py-3 text-gray-700 border rounded-lg focus:ring-2 focus:ring-[#0057D9] focus:border-transparent outline-none transition-all ${
                          errors.currentLocation ? 'border-red-500' : 'border-gray-200'
                        }`}
                        placeholder="Bangalore, India"
                      />
                    </div>
                    {errors.currentLocation && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.currentLocation}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className="w-full pl-11 pr-4 py-3 text-gray-700 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0057D9] focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Professional Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <Briefcase className="w-6 h-6 text-[#3CB878]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Professional Information</h2>
                    <p className="text-gray-500">Share your work experience</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Current Company
                    </label>
                    <input
                      type="text"
                      name="currentCompany"
                      value={formData.currentCompany}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 text-gray-700 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0057D9] focus:border-transparent outline-none transition-all"
                      placeholder="ABC Technologies"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Current Designation
                    </label>
                    <input
                      type="text"
                      name="currentDesignation"
                      value={formData.currentDesignation}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 text-gray-700 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0057D9] focus:border-transparent outline-none transition-all"
                      placeholder="Software Engineer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Total Experience <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="totalExperience"
                      value={formData.totalExperience}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 text-gray-700 border rounded-lg focus:ring-2 focus:ring-[#0057D9] focus:border-transparent outline-none transition-all ${
                        errors.totalExperience ? 'border-red-500' : 'border-gray-200'
                      }`}
                    >
                      <option value="">Select experience</option>
                      <option value="0-1">0-1 years</option>
                      <option value="1-2">1-2 years</option>
                      <option value="2-4">2-4 years</option>
                      <option value="4-6">4-6 years</option>
                      <option value="6-8">6-8 years</option>
                      <option value="8+">8+ years</option>
                    </select>
                    {errors.totalExperience && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.totalExperience}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Notice Period <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="noticePeriod"
                      value={formData.noticePeriod}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 text-gray-700 border rounded-lg focus:ring-2 focus:ring-[#0057D9] focus:border-transparent outline-none transition-all ${
                        errors.noticePeriod ? 'border-red-500' : 'border-gray-200'
                      }`}
                    >
                      <option value="">Select notice period</option>
                      <option value="immediate">Immediate</option>
                      <option value="15-days">15 Days</option>
                      <option value="1-month">1 Month</option>
                      <option value="2-months">2 Months</option>
                      <option value="3-months">3 Months</option>
                    </select>
                    {errors.noticePeriod && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.noticePeriod}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Current Salary (LPA)
                    </label>
                    <input
                      type="text"
                      name="currentSalary"
                      value={formData.currentSalary}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 text-gray-700 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0057D9] focus:border-transparent outline-none transition-all"
                      placeholder="₹12"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Expected Salary (LPA) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="expectedSalary"
                      value={formData.expectedSalary}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 text-gray-700 border rounded-lg focus:ring-2 focus:ring-[#0057D9] focus:border-transparent outline-none transition-all ${
                        errors.expectedSalary ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="₹18"
                    />
                    {errors.expectedSalary && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.expectedSalary}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="willingToRelocate"
                    checked={formData.willingToRelocate}
                    onChange={handleInputChange}
                    className="w-5 h-5 rounded text-gray-700 border-gray-300 text-[#0057D9] focus:ring-[#0057D9]"
                  />
                  <label className="text-sm text-gray-700">Willing to relocate</label>
                </div>
              </div>
            )}

            {/* Step 3: Education */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <GraduationCap className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Education Details</h2>
                    <p className="text-gray-500">Your academic background</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Highest Qualification <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="highestQualification"
                      value={formData.highestQualification}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 text-gray-700 border rounded-lg focus:ring-2 focus:ring-[#0057D9] focus:border-transparent outline-none transition-all ${
                        errors.highestQualification ? 'border-red-500' : 'border-gray-200'
                      }`}
                    >
                      <option value="">Select qualification</option>
                      <option value="B.Tech">B.Tech</option>
                      <option value="M.Tech">M.Tech</option>
                      <option value="BCA">BCA</option>
                      <option value="MCA">MCA</option>
                      <option value="B.Sc">B.Sc</option>
                      <option value="M.Sc">M.Sc</option>
                      <option value="MBA">MBA</option>
                      <option value="PhD">PhD</option>
                    </select>
                    {errors.highestQualification && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.highestQualification}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      University/College
                    </label>
                    <input
                      type="text"
                      name="university"
                      value={formData.university}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 text-gray-700 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0057D9] focus:border-transparent outline-none transition-all"
                      placeholder="ABC University"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Graduation Year
                    </label>
                    <input
                      type="text"
                      name="graduationYear"
                      value={formData.graduationYear}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 text-gray-700 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0057D9] focus:border-transparent outline-none transition-all"
                      placeholder="2020"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      CGPA/Percentage
                    </label>
                    <input
                      type="text"
                      name="cgpa"
                      value={formData.cgpa}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 text-gray-700 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0057D9] focus:border-transparent outline-none transition-all"
                      placeholder="8.5 or 85%"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Cover Letter
                  </label>
                  <textarea
                    name="coverLetter"
                    value={formData.coverLetter}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-4 py-3 text-gray-700 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0057D9] focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Tell us why you're a great fit for this role..."
                  />
                  <p className="text-xs text-gray-500 mt-1">Optional but recommended</p>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-[#0057D9] mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Social Profiles (Optional)</h4>
                      <div className="space-y-3 mt-3">
                        <div className="flex items-center gap-3">
                          <Link2 className="w-5 h-5 text-gray-400" />
                          <input
                            type="url"
                            name="portfolio"
                            value={formData.portfolio}
                            onChange={handleInputChange}
                            className="flex-1 px-3 py-2 text-gray-700 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0057D9] focus:border-transparent outline-none bg-white"
                            placeholder="Portfolio URL"
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          <Github className="w-5 h-5 text-gray-400" />
                          <input
                            type="url"
                            name="github"
                            value={formData.github}
                            onChange={handleInputChange}
                            className="flex-1 px-3 py-2 text-gray-700 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0057D9] focus:border-transparent outline-none bg-white"
                            placeholder="GitHub Profile"
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          <Linkedin className="w-5 h-5 text-gray-400" />
                          <input
                            type="url"
                            name="linkedin"
                            value={formData.linkedin}
                            onChange={handleInputChange}
                            className="flex-1 px-3 py-2 text-gray-700 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0057D9] focus:border-transparent outline-none bg-white"
                            placeholder="LinkedIn Profile"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Documents */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-amber-50 p-3 rounded-lg">
                    <FileText className="w-6 h-6 text-[#FFB020]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Upload Documents</h2>
                    <p className="text-gray-500">Required documents for your application</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Resume/CV <span className="text-red-500">*</span>
                    </label>
                    <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                      errors.resume ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-[#0057D9] hover:bg-blue-50'
                    }`}>
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => handleFileChange(e, 'resume')}
                        className="hidden"
                        id="resume-upload"
                      />
                      <label htmlFor="resume-upload" className="cursor-pointer">
                        {formData.resume ? (
                          <div className="flex items-center justify-center gap-2">
                            <CheckCircle className="w-5 h-5 text-[#3CB878]" />
                            <span className="text-gray-700 font-semibold">{(formData.resume as any).name}</span>
                          </div>
                        ) : (
                          <>
                            <p className="text-gray-700 font-semibold mb-1">Click to upload resume</p>
                            <p className="text-xs text-gray-500">PDF, DOC, DOCX (Max 5MB)</p>
                          </>
                        )}
                      </label>
                    </div>
                    {errors.resume && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.resume}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Additional Documents (Optional)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#0057D9] hover:bg-blue-50 transition-all">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        multiple
                        onChange={(e) => handleFileChange(e, 'additionalDocs')}
                        className="hidden"
                        id="additional-upload"
                      />
                      <label htmlFor="additional-upload" className="cursor-pointer">
                        {formData.additionalDocs ? (
                          <div className="flex items-center justify-center gap-2">
                            <CheckCircle className="w-5 h-5 text-[#3CB878]" />
                            <span className="text-gray-700 font-semibold">{(formData.additionalDocs as any).name}</span>
                          </div>
                        ) : (
                          <>
                            <p className="text-gray-700 font-semibold mb-1">Upload certificates, recommendations</p>
                            <p className="text-xs text-gray-500">PDF, DOC, DOCX (Max 5MB each)</p>
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[#0057D9]" />
                    Terms & Conditions
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        name="availableForInterview"
                        checked={formData.availableForInterview}
                        onChange={handleInputChange}
                        className="mt-1 w-5 h-5 rounded border-gray-300 text-[#0057D9] focus:ring-[#0057D9]"
                      />
                      <label className="text-sm text-gray-700">
                        I am available for interviews and willing to start as per the notice period mentioned
                      </label>
                    </div>
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        name="agreedToTerms"
                        checked={formData.agreedToTerms}
                        onChange={handleInputChange}
                        className={`mt-1 w-5 h-5 rounded border-gray-300 text-[#0057D9] focus:ring-[#0057D9] ${
                          errors.agreedToTerms ? 'border-red-500' : ''
                        }`}
                      />
                      <label className="text-sm text-gray-700">
                        I agree that the information provided is accurate and I accept the{' '}
                        <span className="text-[#0057D9] font-semibold cursor-pointer hover:underline">
                          Terms & Conditions
                        </span>
                        {' '}and{' '}
                        <span className="text-[#0057D9] font-semibold cursor-pointer hover:underline">
                          Privacy Policy
                        </span>
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                    </div>
                    {errors.agreedToTerms && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.agreedToTerms}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              {errors.submit && (
                <div className="flex-1 mr-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {errors.submit}
                  </p>
                </div>
              )}
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  currentStep === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Previous
              </button>

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-8 py-3 bg-gradient-to-r from-[#0057D9] to-[#0048B8] text-white rounded-lg font-semibold hover:shadow-lg transition-all hover:scale-105"
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-gradient-to-r from-[#3CB878] to-emerald-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Submit Application
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
