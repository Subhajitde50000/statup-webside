'use client';

import React from 'react';
import { X, Star, Calendar, Clock, MapPin, User, Briefcase, CreditCard, CheckCircle, Camera } from 'lucide-react';
import Image from 'next/image';

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: {
    id: string;
    service: string;
    professional: {
      name: string;
      role: string;
      rating: number;
      image: string;
    };
    date: string;
    time: string;
    location: string;
    duration: string;
    payment: string;
    paymentStatus: string;
    workDescription?: string;
    timeLog?: {
      start: string;
      end: string;
    };
    otp?: string;
    paymentMethod?: string;
    customerReview?: {
      rating: number;
      comment: string;
    };
    photos?: string[];
  };
}

export default function OrderDetailModal({ isOpen, onClose, order }: OrderDetailModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">View Details</h3>
            <p className="text-sm text-gray-600">Booking ID: {order.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Professional Card */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-600 mb-3">Professional</p>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-white shadow-md">
                <Image
                  src={order.professional.image}
                  alt={order.professional.name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 mb-1">{order.professional.name}</h4>
                <p className="text-sm text-gray-600 mb-1">{order.professional.role}</p>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-semibold text-gray-900">{order.professional.rating}</span>
                </div>
              </div>
              <button className="bg-white text-[#0066FF] px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors shadow-sm">
                View Profile
              </button>
            </div>
          </div>

          {/* Work Description */}
          {order.workDescription && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="w-5 h-5 text-[#0066FF]" />
                <h4 className="font-bold text-gray-900">Work Description</h4>
              </div>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                {order.workDescription}
              </p>
            </div>
          )}

          {/* Job Details */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-[#0066FF]" />
              <h4 className="font-bold text-gray-900">Job Details</h4>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-semibold text-gray-900">{order.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time:</span>
                <span className="font-semibold text-gray-900">{order.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Location:</span>
                <span className="font-semibold text-gray-900 text-right max-w-xs">{order.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-semibold text-gray-900">{order.duration}</span>
              </div>
            </div>
          </div>

          {/* Time Logs */}
          {order.timeLog && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-5 h-5 text-[#0066FF]" />
                <h4 className="font-bold text-gray-900">Time Logs</h4>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Start Time:</span>
                  <span className="font-semibold text-gray-900">{order.timeLog.start}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">End Time:</span>
                  <span className="font-semibold text-gray-900">{order.timeLog.end}</span>
                </div>
              </div>
            </div>
          )}

          {/* OTP */}
          {order.otp && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <h4 className="font-bold text-gray-900">OTP Verification</h4>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">OTP Entered:</span>
                  <span className="font-bold text-green-700 text-xl tracking-wider">{order.otp}</span>
                </div>
              </div>
            </div>
          )}

          {/* Payment Details */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="w-5 h-5 text-[#0066FF]" />
              <h4 className="font-bold text-gray-900">Payment Details</h4>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-bold text-gray-900 text-lg">{order.payment}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-semibold text-green-600">{order.paymentStatus}</span>
              </div>
              {order.paymentMethod && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Method:</span>
                  <span className="font-semibold text-gray-900">{order.paymentMethod}</span>
                </div>
              )}
            </div>
          </div>

          {/* Customer Review */}
          {order.customerReview && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <h4 className="font-bold text-gray-900">Customer Review</h4>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < order.customerReview!.rating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-700">{order.customerReview.comment}</p>
              </div>
            </div>
          )}

          {/* Photos */}
          {order.photos && order.photos.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Camera className="w-5 h-5 text-[#0066FF]" />
                <h4 className="font-bold text-gray-900">Photos Uploaded by Professional</h4>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {order.photos.map((photo, index) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-200">
                    <Image
                      src={photo}
                      alt={`Photo ${index + 1}`}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3">
          <button className="flex-1 bg-[#0066FF] text-white py-3 rounded-lg font-semibold hover:bg-[#0052CC] transition-colors">
            Book Again
          </button>
          <button className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
            Download Invoice
          </button>
        </div>
      </div>
    </div>
  );
}
