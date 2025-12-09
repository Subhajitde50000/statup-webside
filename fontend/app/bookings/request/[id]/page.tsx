'use client';

import React from 'react';
import { ArrowLeft, MapPin, Phone, CheckCircle, Clock, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

export default function BookingRequestDetailsPage() {
  const params = useParams();
  const router = useRouter();
  
  // Sample data - replace with API call using params.id
  const request = {
    id: params.id,
    customerName: 'Subhajit De',
    customerPhoto: 'https://i.pravatar.cc/150?img=33',
    customerRating: 4.8,
    isVerified: true,
    previousBookings: 12,
    isRepeatCustomer: true,
    serviceCategory: 'Electrical',
    service: 'Fan Repair',
    problemDescription: 'Fan is not rotating properly, motor sound, needs inspection',
    estimatedDuration: '60 mins',
    customerBudget: 300,
    address: '22/5 Lake Town, Kolkata',
    distance: 2.2,
    timeToReach: '8 mins',
    date: '15 Dec 2025',
    time: '4:30 PM – 5:30 PM',
    customerPrefersSooner: true,
    basePrice: 300,
    platformFee: 50,
    earnings: 250
  };

  const handleAccept = () => {
    alert(`✅ Booking Accepted!\n\nYou can now contact ${request.customerName}.\n\nMoving to Accepted Bookings...`);
    router.push('/bookings/accepted');
  };

  const handleReject = () => {
    const confirmed = confirm(`Are you sure you want to reject this booking?`);
    if (confirmed) {
      alert('Booking rejected.');
      router.push('/bookings/requests');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/bookings/requests"
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-bold">Back</span>
            </Link>

            <h1 className="text-lg font-black text-gray-900">Booking Request Details</h1>
            
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Section 1 — Customer Details */}
        <div className="bg-white rounded-3xl p-6 shadow-lg mb-6">
          <h2 className="text-xl font-black text-gray-900 mb-4">Customer Details</h2>
          
          <div className="flex items-center gap-4 mb-4">
            <img
              src={request.customerPhoto}
              alt={request.customerName}
              className="w-20 h-20 rounded-full object-cover border-4 border-teal-400"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-2xl font-bold text-gray-900">{request.customerName}</h3>
                {request.isVerified && (
                  <CheckCircle className="w-6 h-6 text-blue-500 fill-blue-500" />
                )}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500 text-lg">⭐</span>
                  <span className="font-bold text-gray-900">{request.customerRating}</span>
                </div>
                <span>•</span>
                <span className="font-semibold">{request.previousBookings} previous bookings</span>
              </div>
              {request.isRepeatCustomer && (
                <span className="inline-block mt-2 bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                  🔁 Repeat Customer
                </span>
              )}
            </div>
          </div>

          <div className="bg-teal-50 p-4 rounded-xl border-2 border-teal-100">
            <p className="text-sm text-gray-600">
              <strong>Note:</strong> Contact options will be enabled after you accept the booking
            </p>
          </div>
        </div>

        {/* Section 2 — Job Information */}
        <div className="bg-white rounded-3xl p-6 shadow-lg mb-6">
          <h2 className="text-xl font-black text-gray-900 mb-4">Job Information</h2>
          
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <span className="text-gray-600 font-semibold">Service Category:</span>
              <span className="font-bold text-gray-900">{request.serviceCategory}</span>
            </div>
            
            <div className="flex items-start justify-between">
              <span className="text-gray-600 font-semibold">Service:</span>
              <span className="font-bold text-gray-900">{request.service}</span>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-100">
              <p className="text-sm font-semibold text-gray-700 mb-2">Problem Description:</p>
              <p className="text-gray-900">{request.problemDescription}</p>
            </div>
            
            <div className="flex items-start justify-between">
              <span className="text-gray-600 font-semibold">Estimated Duration:</span>
              <span className="font-bold text-gray-900">{request.estimatedDuration}</span>
            </div>
            
            <div className="flex items-start justify-between">
              <span className="text-gray-600 font-semibold">Customer Budget:</span>
              <span className="font-bold text-green-600 text-xl">₹{request.customerBudget}</span>
            </div>
          </div>
        </div>

        {/* Section 3 — Location Details */}
        <div className="bg-white rounded-3xl p-6 shadow-lg mb-6">
          <h2 className="text-xl font-black text-gray-900 mb-4">Location Details</h2>
          
          <div className="bg-gray-200 rounded-xl h-48 mb-4 flex items-center justify-center relative overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=600&h=300&fit=crop"
              alt="Map"
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <MapPin className="w-16 h-16 text-red-600 drop-shadow-lg" />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-red-500" />
              <span className="font-bold text-gray-900">{request.address}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 bg-teal-50 p-4 rounded-xl border-2 border-teal-100">
              <div>
                <p className="text-sm text-gray-600 mb-1">Distance</p>
                <p className="font-bold text-gray-900">{request.distance} km</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Time to reach</p>
                <p className="font-bold text-gray-900">{request.timeToReach}</p>
              </div>
            </div>

            <Link
              href={`https://maps.google.com/?q=${request.address}`}
              target="_blank"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors text-center"
            >
              Directions → Google Maps
            </Link>
          </div>
        </div>

        {/* Section 4 — Date & Time */}
        <div className="bg-white rounded-3xl p-6 shadow-lg mb-6">
          <h2 className="text-xl font-black text-gray-900 mb-4">Date & Time</h2>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📅</span>
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-bold text-gray-900 text-lg">{request.date}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-teal-600" />
              <div>
                <p className="text-sm text-gray-600">Time</p>
                <p className="font-bold text-gray-900 text-lg">{request.time}</p>
              </div>
            </div>

            {request.customerPrefersSooner && (
              <div className="bg-orange-50 p-4 rounded-xl border-2 border-orange-200">
                <p className="text-orange-700 font-bold flex items-center gap-2">
                  ⚡ Customer prefers sooner: <span className="text-orange-900">YES</span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Section 5 — Earnings Summary */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-6 shadow-lg mb-6 border-2 border-green-200">
          <h2 className="text-xl font-black text-gray-900 mb-4">Earnings Summary</h2>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-semibold">Base Price:</span>
              <span className="font-bold text-gray-900">₹{request.basePrice}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-semibold">Platform Fee:</span>
              <span className="font-bold text-red-600">- ₹{request.platformFee}</span>
            </div>
            
            <div className="border-t-2 border-green-300 pt-3 mt-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-900 font-bold text-lg">You Earn:</span>
                <span className="text-3xl font-black text-green-600 flex items-center gap-2">
                  <DollarSign className="w-7 h-7" />
                  ₹{request.earnings}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 6 — Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <button
            onClick={handleAccept}
            className="bg-teal-600 hover:bg-teal-700 text-white font-black py-5 px-8 rounded-2xl transition-all shadow-lg hover:shadow-xl text-lg"
          >
            ✅ Accept Booking
          </button>
          
          <button
            onClick={handleReject}
            className="bg-white hover:bg-gray-50 text-gray-700 font-bold py-5 px-8 rounded-2xl transition-all border-2 border-gray-300 hover:border-gray-400"
          >
            ❌ Reject Request
          </button>
        </div>
      </main>
    </div>
  );
}
