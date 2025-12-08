'use client';

import React from 'react';
import { Star } from 'lucide-react';

interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date?: string;
  service?: string;
}

interface RecentReviewsProps {
  reviews: Review[];
  onViewAll: () => void;
}

export default function RecentReviews({ reviews, onViewAll }: RecentReviewsProps) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg">
      <h3 className="text-lg font-bold text-gray-900 mb-4">⭐ Customer Feedback</h3>
      
      <div className="space-y-4 mb-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-l-4 border-teal-500 pl-4 py-3 bg-gray-50 rounded-r-xl pr-4">
            <p className="text-gray-700 italic mb-3">"{review.comment}"</p>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <p className="text-sm font-semibold text-gray-900">— {review.customerName}</p>
                {review.service && (
                  <p className="text-xs text-gray-500">{review.service}</p>
                )}
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-1">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                  <span className="text-sm font-bold text-gray-700 ml-1">
                    ({review.rating})
                  </span>
                </div>
                {review.date && (
                  <span className="text-xs text-gray-500">{review.date}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onViewAll}
        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-xl transition-colors"
      >
        View all reviews
      </button>
    </div>
  );
}
