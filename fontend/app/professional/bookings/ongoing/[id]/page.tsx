'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Phone, MessageCircle, MapPin, Clock, Camera, Image as ImageIcon, CheckCircle, Pause, Play } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

export default function OngoingJobPage() {
  const params = useParams();
  const router = useRouter();
  
  const [otpValue, setOtpValue] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [jobStartTime, setJobStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [beforePhotos, setBeforePhotos] = useState<string[]>([]);
  const [afterPhotos, setAfterPhotos] = useState<string[]>([]);
  const [workSummary, setWorkSummary] = useState('');

  // Sample data
  const job = {
    id: params.id,
    customerName: 'Subhajit De',
    customerPhoto: 'https://i.pravatar.cc/150?img=33',
    customerRating: 4.8,
    customerPhone: '+91 98765 43210',
    service: 'Fan Repair – Electrical',
    startTime: '4:35 PM',
    expectedCompletion: '5:20 PM',
    address: '22/5 Lake Town, Kolkata',
    distance: 2.2,
    correctOtp: '1234'
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (jobStartTime && !isPaused) {
      interval = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - jobStartTime) / 1000);
        setElapsedTime(elapsed);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [jobStartTime, isPaused]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerifyOtp = () => {
    if (otpValue === job.correctOtp) {
      setIsOtpVerified(true);
      setJobStartTime(Date.now());
      alert('✅ OTP Verified!\n\nYou can now start the job.');
    } else {
      alert('❌ Invalid OTP\n\nPlease check with the customer and try again.');
    }
  };

  const handleTogglePause = () => {
    setIsPaused(!isPaused);
  };

  const handleFileUpload = (type: 'before' | 'after', event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const urls = Array.from(files).map(file => URL.createObjectURL(file));
      if (type === 'before') {
        setBeforePhotos([...beforePhotos, ...urls]);
      } else {
        setAfterPhotos([...afterPhotos, ...urls]);
      }
    }
  };

  const handleCompleteJob = () => {
    if (!isOtpVerified) {
      alert('Please verify OTP first before completing the job.');
      return;
    }

    if (beforePhotos.length === 0 || afterPhotos.length === 0) {
      const proceed = confirm('You haven\'t uploaded before/after photos. Continue anyway?');
      if (!proceed) return;
    }

    const confirmed = confirm(`Complete this job?\n\nTime taken: ${formatTime(elapsedTime)}\n\nThis action cannot be undone.`);
    
    if (confirmed) {
      alert('✅ Job Completed!\n\nInvoice sent to customer.\n\nMoving to Completed Jobs...');
      router.push('/bookings/completed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 pb-20">
      {/* Header */}
      <header className="bg-gradient-to-r from-teal-600 to-green-600 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/bookings/accepted"
              className="flex items-center gap-2 text-white hover:text-teal-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-bold">Back</span>
            </Link>

            <h1 className="text-lg font-black text-white">Ongoing Job</h1>
            
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 1. Customer Header */}
        <div className="bg-white rounded-3xl p-6 shadow-lg mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src={job.customerPhoto}
                alt={job.customerName}
                className="w-16 h-16 rounded-full object-cover border-4 border-teal-400"
              />
              <div>
                <h2 className="text-xl font-bold text-gray-900">{job.customerName}</h2>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500">⭐</span>
                  <span className="font-bold text-gray-700">{job.customerRating}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <a
                href={`tel:${job.customerPhone}`}
                className="bg-teal-600 hover:bg-teal-700 p-4 rounded-full transition-colors shadow-md"
              >
                <Phone className="w-6 h-6 text-white" />
              </a>
              <a
                href={`sms:${job.customerPhone}`}
                className="bg-blue-600 hover:bg-blue-700 p-4 rounded-full transition-colors shadow-md"
              >
                <MessageCircle className="w-6 h-6 text-white" />
              </a>
            </div>
          </div>
        </div>

        {/* 2. Job Details Block */}
        <div className="bg-white rounded-3xl p-6 shadow-lg mb-6">
          <h3 className="text-lg font-black text-gray-900 mb-4">Job Details</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 font-semibold">Service:</span>
              <span className="font-bold text-gray-900">{job.service}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 font-semibold">Started at:</span>
              <span className="font-bold text-gray-900">{job.startTime}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 font-semibold">Expected completion:</span>
              <span className="font-bold text-gray-900">{job.expectedCompletion}</span>
            </div>
            
            <div className="flex justify-between items-center pt-3 border-t-2 border-gray-100">
              <span className="text-gray-600 font-semibold">OTP Verified:</span>
              <span className={`font-bold text-lg ${isOtpVerified ? 'text-green-600' : 'text-red-600'}`}>
                {isOtpVerified ? '✅ YES' : '❌ NO'}
              </span>
            </div>
          </div>
        </div>

        {/* 3. Navigation Details */}
        <div className="bg-white rounded-3xl p-6 shadow-lg mb-6">
          <h3 className="text-lg font-black text-gray-900 mb-4">Navigation Details</h3>
          
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-6 h-6 text-red-500" />
            <div className="flex-1">
              <p className="font-bold text-gray-900">{job.address}</p>
              <p className="text-sm text-gray-600">Distance: {job.distance} km</p>
            </div>
          </div>

          <Link
            href={`https://maps.google.com/?q=${job.address}`}
            target="_blank"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors text-center"
          >
            Open Maps
          </Link>
        </div>

        {/* 4. OTP Confirmation */}
        {!isOtpVerified && (
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-3xl p-6 shadow-lg mb-6 border-2 border-orange-300">
            <h3 className="text-lg font-black text-gray-900 mb-4">🔐 OTP Confirmation Step</h3>
            
            <p className="text-gray-700 mb-4 font-semibold">
              Before starting the job, please ask the customer for the 4-digit OTP:
            </p>

            <div className="flex gap-3 mb-4">
              <input
                type="text"
                maxLength={4}
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ''))}
                placeholder="• • • •"
                className="flex-1 text-center text-3xl font-bold tracking-widest border-2 border-gray-300 rounded-xl p-4 focus:border-teal-500 focus:outline-none"
              />
            </div>

            <button
              onClick={handleVerifyOtp}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 px-6 rounded-xl transition-colors shadow-md"
            >
              Verify OTP
            </button>
          </div>
        )}

        {isOtpVerified && (
          <>
            {/* 5. Job Timer */}
            <div className="bg-gradient-to-br from-teal-500 to-green-500 rounded-3xl p-8 shadow-lg mb-6 text-white text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Clock className="w-8 h-8" />
                <h3 className="text-xl font-black">Job Duration</h3>
              </div>
              
              <div className="text-6xl font-black mb-6 tracking-wider">
                {formatTime(elapsedTime)}
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleTogglePause}
                  className="bg-white hover:bg-gray-100 text-teal-700 font-bold py-3 px-8 rounded-xl transition-colors shadow-md flex items-center gap-2"
                >
                  {isPaused ? (
                    <>
                      <Play className="w-5 h-5" />
                      Resume
                    </>
                  ) : (
                    <>
                      <Pause className="w-5 h-5" />
                      Pause
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 6. Upload Work Photos */}
            <div className="bg-white rounded-3xl p-6 shadow-lg mb-6">
              <h3 className="text-lg font-black text-gray-900 mb-4">📸 Upload Work Photos</h3>
              
              {/* Before Photos */}
              <div className="mb-6">
                <h4 className="font-bold text-gray-700 mb-3">Before Work Photos</h4>
                <div className="grid grid-cols-3 gap-3 mb-3">
                  {beforePhotos.map((photo, index) => (
                    <div key={index} className="aspect-square rounded-xl overflow-hidden border-2 border-gray-200">
                      <img src={photo} alt={`Before ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <label className="bg-blue-50 hover:bg-blue-100 border-2 border-blue-300 text-blue-700 font-bold py-3 px-4 rounded-xl transition-colors cursor-pointer text-center flex items-center justify-center gap-2">
                    <Camera className="w-5 h-5" />
                    Camera
                    <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => handleFileUpload('before', e)} />
                  </label>
                  <label className="bg-blue-50 hover:bg-blue-100 border-2 border-blue-300 text-blue-700 font-bold py-3 px-4 rounded-xl transition-colors cursor-pointer text-center flex items-center justify-center gap-2">
                    <ImageIcon className="w-5 h-5" />
                    Gallery
                    <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFileUpload('before', e)} />
                  </label>
                </div>
              </div>

              {/* After Photos */}
              <div>
                <h4 className="font-bold text-gray-700 mb-3">After Work Photos</h4>
                <div className="grid grid-cols-3 gap-3 mb-3">
                  {afterPhotos.map((photo, index) => (
                    <div key={index} className="aspect-square rounded-xl overflow-hidden border-2 border-gray-200">
                      <img src={photo} alt={`After ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <label className="bg-green-50 hover:bg-green-100 border-2 border-green-300 text-green-700 font-bold py-3 px-4 rounded-xl transition-colors cursor-pointer text-center flex items-center justify-center gap-2">
                    <Camera className="w-5 h-5" />
                    Camera
                    <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => handleFileUpload('after', e)} />
                  </label>
                  <label className="bg-green-50 hover:bg-green-100 border-2 border-green-300 text-green-700 font-bold py-3 px-4 rounded-xl transition-colors cursor-pointer text-center flex items-center justify-center gap-2">
                    <ImageIcon className="w-5 h-5" />
                    Gallery
                    <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFileUpload('after', e)} />
                  </label>
                </div>
              </div>
            </div>

            {/* 7. Work Summary */}
            <div className="bg-white rounded-3xl p-6 shadow-lg mb-6">
              <h3 className="text-lg font-black text-gray-900 mb-4">Work Summary (Optional)</h3>
              
              <textarea
                value={workSummary}
                onChange={(e) => setWorkSummary(e.target.value)}
                placeholder="Example: Fan internal wire replaced, required lubrication..."
                className="w-full border-2 border-gray-300 rounded-xl p-4 focus:border-teal-500 focus:outline-none resize-none"
                rows={4}
              />
            </div>

            {/* 8. Mark as Completed */}
            <button
              onClick={handleCompleteJob}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-black py-6 px-8 rounded-2xl transition-all shadow-lg hover:shadow-xl text-xl flex items-center justify-center gap-3"
            >
              <CheckCircle className="w-8 h-8" />
              🟢 MARK JOB AS COMPLETED
            </button>
          </>
        )}
      </main>
    </div>
  );
}
