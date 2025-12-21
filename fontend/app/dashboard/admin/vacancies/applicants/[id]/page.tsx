'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, User, Mail, Phone, MapPin, Calendar, Briefcase, 
  GraduationCap, DollarSign, Clock, FileText, Link2, Github, 
  Linkedin, Twitter, Download, Star, Edit, CheckCircle, XCircle,
  Loader2, AlertCircle, Award, Globe
} from 'lucide-react';
import { getApplicationById, Application, updateApplication, APIError } from '@/utils/applications';

export default function ApplicantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [applicant, setApplicant] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedScore, setEditedScore] = useState(0);
  const [editedStage, setEditedStage] = useState('');
  const [editedNotes, setEditedNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchApplicantDetails();
  }, [params.id]);

  const fetchApplicantDetails = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await getApplicationById(params.id as string);
      setApplicant(response.application);
      setEditedScore(response.application.score);
      setEditedStage(response.application.stage);
      setEditedNotes(response.application.notes || '');
    } catch (err) {
      if (err instanceof APIError) {
        setError(err.message);
      } else {
        setError('Failed to load applicant details');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    if (!applicant) return;
    
    setIsSaving(true);
    try {
      await updateApplication(applicant.id, {
        stage: editedStage,
        score: editedScore,
        notes: editedNotes
      });
      
      setApplicant({
        ...applicant,
        stage: editedStage,
        score: editedScore,
        notes: editedNotes
      });
      
      setIsEditing(false);
    } catch (err) {
      if (err instanceof APIError) {
        alert(err.message);
      } else {
        alert('Failed to update application');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const getStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      'Under Review': '#0057D9',
      'Shortlisted': '#3CB878',
      'Interview Scheduled': '#FFB020',
      'Background Check': '#00A8E8',
      'Offer Released': '#3CB878',
      'Rejected': '#E53935',
    };
    return colors[stage] || '#6B7280';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F7FB]">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-[#0057D9] animate-spin mx-auto mb-4" />
          <p className="text-[#1B1F3B] font-medium">Loading applicant details...</p>
        </div>
      </div>
    );
  }

  if (error || !applicant) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F7FB]">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-[#1B1F3B] font-medium mb-4">{error || 'Applicant not found'}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-[#0057D9] text-white rounded-lg hover:bg-[#0044AA]"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7FB] p-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#0057D9] hover:text-[#0044AA] mb-4 font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to All Applicants
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#1B1F3B] mb-2">{applicant.full_name}</h1>
            <p className="text-[#6B7280]">Application for {applicant.vacancy_title}</p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
              style={{ backgroundColor: getStageColor(applicant.stage) }}
            >
              {applicant.stage}
            </span>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-3 bg-[#0057D9] text-white rounded-lg font-semibold hover:bg-[#0044AA] flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Update Status
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                  className="px-6 py-3 bg-[#3CB878] text-white rounded-lg font-semibold hover:bg-[#2FA366] flex items-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedScore(applicant.score);
                    setEditedStage(applicant.stage);
                    setEditedNotes(applicant.notes || '');
                  }}
                  className="px-6 py-3 bg-gray-200 text-[#1B1F3B] rounded-lg font-semibold hover:bg-gray-300 flex items-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-[#1B1F3B] mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-[#0057D9]" />
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#6B7280] mt-1" />
                <div>
                  <p className="text-xs text-[#6B7280] mb-1">Email</p>
                  <p className="font-semibold text-[#1B1F3B]">{applicant.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#6B7280] mt-1" />
                <div>
                  <p className="text-xs text-[#6B7280] mb-1">Phone</p>
                  <p className="font-semibold text-[#1B1F3B]">{applicant.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#6B7280] mt-1" />
                <div>
                  <p className="text-xs text-[#6B7280] mb-1">Location</p>
                  <p className="font-semibold text-[#1B1F3B]">{applicant.current_location}</p>
                </div>
              </div>
              {applicant.date_of_birth && (
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-[#6B7280] mt-1" />
                  <div>
                    <p className="text-xs text-[#6B7280] mb-1">Date of Birth</p>
                    <p className="font-semibold text-[#1B1F3B]">{applicant.date_of_birth}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Professional Information */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-[#1B1F3B] mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#3CB878]" />
              Professional Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {applicant.current_company && (
                <div>
                  <p className="text-xs text-[#6B7280] mb-1">Current Company</p>
                  <p className="font-semibold text-[#1B1F3B]">{applicant.current_company}</p>
                </div>
              )}
              {applicant.current_designation && (
                <div>
                  <p className="text-xs text-[#6B7280] mb-1">Current Designation</p>
                  <p className="font-semibold text-[#1B1F3B]">{applicant.current_designation}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-[#6B7280] mb-1">Total Experience</p>
                <p className="font-semibold text-[#1B1F3B] flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#FFB020]" />
                  {applicant.total_experience}
                </p>
              </div>
              {applicant.current_salary && (
                <div>
                  <p className="text-xs text-[#6B7280] mb-1">Current Salary</p>
                  <p className="font-semibold text-[#1B1F3B]">{applicant.current_salary}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-[#6B7280] mb-1">Expected Salary</p>
                <p className="font-semibold text-[#1B1F3B] flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-[#3CB878]" />
                  {applicant.expected_salary}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280] mb-1">Notice Period</p>
                <p className="font-semibold text-[#1B1F3B]">{applicant.notice_period}</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {applicant.willing_to_relocate ? (
                    <CheckCircle className="w-5 h-5 text-[#3CB878]" />
                  ) : (
                    <XCircle className="w-5 h-5 text-[#E53935]" />
                  )}
                  <span className="text-sm text-[#1B1F3B]">Willing to Relocate</span>
                </div>
                <div className="flex items-center gap-2">
                  {applicant.available_for_interview ? (
                    <CheckCircle className="w-5 h-5 text-[#3CB878]" />
                  ) : (
                    <XCircle className="w-5 h-5 text-[#E53935]" />
                  )}
                  <span className="text-sm text-[#1B1F3B]">Available for Interview</span>
                </div>
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-[#1B1F3B] mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-purple-600" />
              Education
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-[#6B7280] mb-1">Highest Qualification</p>
                <p className="font-semibold text-[#1B1F3B]">{applicant.highest_qualification}</p>
              </div>
              {applicant.university && (
                <div>
                  <p className="text-xs text-[#6B7280] mb-1">University/College</p>
                  <p className="font-semibold text-[#1B1F3B]">{applicant.university}</p>
                </div>
              )}
              {applicant.graduation_year && (
                <div>
                  <p className="text-xs text-[#6B7280] mb-1">Graduation Year</p>
                  <p className="font-semibold text-[#1B1F3B]">{applicant.graduation_year}</p>
                </div>
              )}
              {applicant.cgpa && (
                <div>
                  <p className="text-xs text-[#6B7280] mb-1">CGPA/Percentage</p>
                  <p className="font-semibold text-[#1B1F3B]">{applicant.cgpa}</p>
                </div>
              )}
            </div>
          </div>

          {/* Cover Letter */}
          {applicant.cover_letter && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-[#1B1F3B] mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#FFB020]" />
                Cover Letter
              </h2>
              <p className="text-[#1B1F3B] leading-relaxed whitespace-pre-wrap">{applicant.cover_letter}</p>
            </div>
          )}

          {/* Social Profiles */}
          {(applicant.portfolio || applicant.github || applicant.linkedin || applicant.twitter) && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-[#1B1F3B] mb-4 flex items-center gap-2">
                <Link2 className="w-5 h-5 text-[#0057D9]" />
                Social Profiles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {applicant.portfolio && (
                  <a
                    href={applicant.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Globe className="w-5 h-5 text-[#0057D9]" />
                    <span className="text-sm font-semibold text-[#0057D9]">Portfolio</span>
                  </a>
                )}
                {applicant.github && (
                  <a
                    href={applicant.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Github className="w-5 h-5 text-[#1B1F3B]" />
                    <span className="text-sm font-semibold text-[#1B1F3B]">GitHub</span>
                  </a>
                )}
                {applicant.linkedin && (
                  <a
                    href={applicant.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Linkedin className="w-5 h-5 text-[#0057D9]" />
                    <span className="text-sm font-semibold text-[#0057D9]">LinkedIn</span>
                  </a>
                )}
                {applicant.twitter && (
                  <a
                    href={applicant.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Twitter className="w-5 h-5 text-[#0057D9]" />
                    <span className="text-sm font-semibold text-[#0057D9]">Twitter</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Score & Stage Card */}
          <div className="bg-gradient-to-br from-[#0057D9] to-[#1B1F3B] rounded-2xl p-6 shadow-xl text-white">
            <h3 className="text-lg font-bold mb-4">Application Status</h3>
            
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-blue-100 mb-2 block">Stage</label>
                  <select
                    value={editedStage}
                    onChange={(e) => setEditedStage(e.target.value)}
                    className="w-full px-4 py-2 bg-black/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white"
                  >
                    <option value="Under Review">Under Review</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Interview Scheduled">Interview Scheduled</option>
                    <option value="Background Check">Background Check</option>
                    <option value="Offer Released">Offer Released</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm text-blue-100 mb-2 block">Score (0-10)</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={editedScore}
                    onChange={(e) => setEditedScore(parseFloat(e.target.value))}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="text-sm text-blue-100 mb-2 block">Notes</label>
                  <textarea
                    value={editedNotes}
                    onChange={(e) => setEditedNotes(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white resize-none"
                    placeholder="Add notes about this application..."
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/20">
                  <span className="text-blue-100">Current Stage</span>
                  <span className="font-bold">{applicant.stage}</span>
                </div>
                
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/20">
                  <span className="text-blue-100">Score</span>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-[#FFB020] fill-[#FFB020]" />
                    <span className="text-2xl font-bold">{applicant.score.toFixed(1)}</span>
                    <span className="text-blue-100">/10</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-blue-100">Applied On</span>
                  <span className="font-semibold">{new Date(applicant.applied_at).toLocaleDateString()}</span>
                </div>
              </>
            )}
          </div>

          {/* Documents Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-[#1B1F3B] mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#0057D9]" />
              Documents
            </h3>
            <div className="space-y-3">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-[#0057D9]" />
                    <div>
                      <p className="font-semibold text-[#1B1F3B]">Resume/CV</p>
                      <p className="text-xs text-[#6B7280]">PDF Document</p>
                    </div>
                  </div>
                  <button className="p-2 bg-[#0057D9] text-white rounded-lg hover:bg-[#0044AA] transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <p className="text-xs text-[#6B7280] text-center mt-4">
                Note: Document download functionality requires backend file storage implementation
              </p>
            </div>
          </div>

          {/* Timeline Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-[#1B1F3B] mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#FFB020]" />
              Timeline
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-50 p-2 rounded-full">
                  <CheckCircle className="w-4 h-4 text-[#0057D9]" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-[#1B1F3B]">Application Submitted</p>
                  <p className="text-xs text-[#6B7280]">{new Date(applicant.applied_at).toLocaleString()}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-green-50 p-2 rounded-full">
                  <Award className="w-4 h-4 text-[#3CB878]" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-[#1B1F3B]">Current Status</p>
                  <p className="text-xs text-[#6B7280]">{applicant.stage}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Notes */}
          {!isEditing && applicant.notes && (
            <div className="bg-amber-50 rounded-2xl p-6 shadow-sm border border-amber-200">
              <h3 className="text-lg font-bold text-[#1B1F3B] mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#FFB020]" />
                Admin Notes
              </h3>
              <p className="text-sm text-[#1B1F3B] whitespace-pre-wrap">{applicant.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
