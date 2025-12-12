'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  Star,
  MessageSquare,
  CheckCircle2,
  Save,
} from 'lucide-react';
import Link from 'next/link';

export default function ApplicantEvaluationPage({ params }: { params: { id: string } }) {
  const [ratings, setRatings] = useState({
    communication: 0,
    experienceRelevance: 0,
    technicalSkills: 0,
    behavior: 0,
    problemSolving: 0,
    culturalFit: 0,
  });
  const [comments, setComments] = useState('');
  const [showNotification, setShowNotification] = useState(false);

  const criteria = [
    { key: 'communication', label: 'Communication Skills' },
    { key: 'experienceRelevance', label: 'Experience Relevance' },
    { key: 'technicalSkills', label: 'Technical Skills' },
    { key: 'behavior', label: 'Professional Behavior' },
    { key: 'problemSolving', label: 'Problem Solving' },
    { key: 'culturalFit', label: 'Cultural Fit' },
  ];

  const handleRating = (criterion: string, rating: number) => {
    setRatings({ ...ratings, [criterion]: rating });
  };

  const calculateFinalScore = () => {
    const values = Object.values(ratings);
    const sum = values.reduce((acc, val) => acc + val, 0);
    return values.length > 0 ? (sum / values.length).toFixed(1) : 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] p-8">
      <Link
        href={`/dashboard/admin/vacancies/applicants/${params.id}`}
        className="inline-flex items-center gap-2 text-[#0057D9] hover:text-[#0044AA] font-semibold mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Applicant Profile
      </Link>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h1 className="text-3xl font-bold text-[#1B1F3B] mb-2">Applicant Evaluation</h1>
          <p className="text-[#6B7280] mb-8">Rate the candidate on various parameters</p>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Rating Criteria */}
            {criteria.map((criterion) => (
              <div key={criterion.key} className="pb-6 border-b border-gray-100 last:border-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-[#1B1F3B] text-lg">{criterion.label}</h3>
                  <span className="text-sm text-[#6B7280]">
                    {ratings[criterion.key as keyof typeof ratings]}/5
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRating(criterion.key, star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-10 h-10 ${
                          star <= ratings[criterion.key as keyof typeof ratings]
                            ? 'text-[#FFB020] fill-[#FFB020]'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Comments */}
            <div>
              <label className="block text-sm font-semibold text-[#1B1F3B] mb-2">
                <MessageSquare className="w-4 h-4 inline mr-1" />
                Evaluation Comments
              </label>
              <textarea
                rows={6}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Provide detailed feedback about the candidate's performance..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#0057D9] transition-colors resize-none"
              />
            </div>

            {/* Final Score */}
            <div className="p-6 bg-gradient-to-br from-[#0057D9] to-[#0044AA] rounded-2xl text-white text-center">
              <p className="text-sm mb-2 opacity-90">Final Score</p>
              <div className="flex items-center justify-center gap-2">
                <Star className="w-8 h-8 fill-white" />
                <span className="text-5xl font-bold">{calculateFinalScore()}</span>
                <span className="text-2xl opacity-80">/5.0</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-100">
              <Link
                href={`/dashboard/admin/vacancies/applicants/${params.id}`}
                className="px-6 py-3 text-[#6B7280] hover:text-[#1B1F3B] font-semibold"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-[#3CB878] to-[#2FA968] text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Save className="w-5 h-5" />
                Save Evaluation
              </button>
            </div>
          </form>
        </div>
      </div>

      {showNotification && (
        <div className="fixed top-24 right-8 z-50 animate-slide-in">
          <div className="px-6 py-4 bg-[#3CB878] text-white rounded-xl shadow-lg flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-semibold">Evaluation saved successfully!</span>
          </div>
        </div>
      )}
    </div>
  );
}
