'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Phone, 
  MessageCircle, 
  MapPin, 
  Clock, 
  Camera, 
  Image as ImageIcon, 
  CheckCircle, 
  Pause, 
  Play,
  Navigation,
  Star,
  AlertCircle,
  FileText,
  X,
  Check,
  ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import ProfessionalNavbar from '../../../components/ProfessionalNavbar';

export default function OngoingJobPage() {
  const params = useParams();
  const router = useRouter();
  
  const [otpValue, setOtpValue] = useState(['', '', '', '']);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [jobStartTime, setJobStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [pauseStartTime, setPauseStartTime] = useState<number | null>(null);
  const [totalPausedTime, setTotalPausedTime] = useState(0);
  const [beforePhotos, setBeforePhotos] = useState<string[]>([]);
  const [afterPhotos, setAfterPhotos] = useState<string[]>([]);
  const [workSummary, setWorkSummary] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  // Sample data
  const job = {
    id: params.id,
    customerName: 'Subhajit De',
    customerPhoto: 'https://i.pravatar.cc/150?img=33',
    customerRating: 4.8,
    totalBookings: 23,
    customerPhone: '+91 98765 43210',
    service: 'Switchboard Repair',
    description: 'Main switchboard tripping frequently. Need urgent inspection and repair.',
    startTime: '2:00 PM',
    expectedDuration: '40-50 min',
    address: '22/5, Sector 5, Salt Lake, Kolkata - 700091',
    distance: 1.1,
    earnings: 450,
    correctOtp: '1234'
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (jobStartTime && !isPaused) {
      interval = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - jobStartTime - totalPausedTime) / 1000);
        setElapsedTime(elapsed);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [jobStartTime, isPaused, totalPausedTime]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otpValue];
    newOtp[index] = value;
    setOtpValue(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpValue[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerifyOtp = () => {
    const enteredOtp = otpValue.join('');
    if (enteredOtp === job.correctOtp) {
      setIsOtpVerified(true);
      setJobStartTime(Date.now());
      setCurrentStep(2);
    } else {
      alert('❌ Invalid OTP\n\nPlease check with the customer and try again.');
      setOtpValue(['', '', '', '']);
      document.getElementById('otp-0')?.focus();
    }
  };

  const handleTogglePause = () => {
    if (isPaused) {
      // Resume: calculate total paused time
      if (pauseStartTime) {
        const pauseDuration = Date.now() - pauseStartTime;
        setTotalPausedTime(totalPausedTime + pauseDuration);
        setPauseStartTime(null);
      }
      setIsPaused(false);
    } else {
      // Pause
      setPauseStartTime(Date.now());
      setIsPaused(true);
    }
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

  const removePhoto = (type: 'before' | 'after', index: number) => {
    if (type === 'before') {
      setBeforePhotos(beforePhotos.filter((_, i) => i !== index));
    } else {
      setAfterPhotos(afterPhotos.filter((_, i) => i !== index));
    }
  };

  const handleCompleteJob = () => {
    if (!isOtpVerified) {
      alert('⚠️ Please verify OTP first before completing the job.');
      return;
    }

    if (beforePhotos.length === 0 || afterPhotos.length === 0) {
      const proceed = confirm('⚠️ No before/after photos uploaded.\n\nPhotos help build trust with customers. Continue anyway?');
      if (!proceed) return;
    }

    if (!workSummary.trim()) {
      const proceed = confirm('⚠️ No work summary provided.\n\nSummaries help customers understand the work done. Continue anyway?');
      if (!proceed) return;
    }

    const confirmed = confirm(`✅ Complete this job?\n\nTime taken: ${formatTime(elapsedTime)}\nEarnings: ₹${job.earnings}\n\nInvoice will be sent to customer.`);
    
    if (confirmed) {
      // Simulate API call
      setTimeout(() => {
        alert('🎉 Job Completed Successfully!\n\n✓ Invoice sent to customer\n✓ Payment credited to your account\n✓ Customer can now rate your service\n\nCheck your earnings in the dashboard!');
        router.push('/professional/bookings/completed');
      }, 500);
    }
  };

  const progressSteps = [
    { id: 1, name: 'Verify OTP', icon: ShieldCheck },
    { id: 2, name: 'Start Work', icon: Play },
    { id: 3, name: 'Document', icon: Camera },
    { id: 4, name: 'Complete', icon: CheckCircle }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50">
      <ProfessionalNavbar activeTab="bookings" />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Back Button */}
        <div className="mb-8">
          <Link
            href="/professional/bookings/accepted"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-bold mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Accepted Jobs
          </Link>
          <h1 className="text-4xl font-black text-gray-900">Ongoing Job</h1>
        </div>

        {/* Progress Tracker */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 mb-8">
          <h2 className="text-lg font-black text-gray-900 mb-6">Job Progress</h2>
          <div className="flex items-center justify-between">
            {progressSteps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-2 transition-all ${
                      isCompleted ? 'bg-green-500' :
                      isActive ? 'bg-gradient-to-br from-purple-600 to-pink-600 animate-pulse' :
                      'bg-gray-200'
                    }`}>
                      {isCompleted ? (
                        <Check className="w-7 h-7 text-white" />
                      ) : (
                        <StepIcon className={`w-7 h-7 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                      )}
                    </div>
                    <span className={`text-xs font-bold text-center ${
                      isActive || isCompleted ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                      {step.name}
                    </span>
                  </div>
                  {index < progressSteps.length - 1 && (
                    <div className={`flex-1 h-1 mx-2 rounded-full transition-all ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Customer & Job Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Info Card */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
              <h2 className="text-xl font-black text-gray-900 mb-4">Customer Information</h2>
              
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <img
                    src={job.customerPhoto}
                    alt={job.customerName}
                    className="w-20 h-20 rounded-full border-4 border-purple-200 shadow-md"
                  />
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 mb-1">{job.customerName}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      <span className="font-bold text-gray-700">{job.customerRating}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-600 font-semibold">{job.totalBookings} bookings</span>
                    </div>
                    <p className="text-sm text-gray-600 font-semibold">{job.customerPhone}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <a
                    href={`tel:${job.customerPhone}`}
                    className="p-3 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-all border-2 border-green-200"
                    title="Call Customer"
                  >
                    <Phone className="w-5 h-5" />
                  </a>
                  <a
                    href={`sms:${job.customerPhone}`}
                    className="p-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-all border-2 border-blue-200"
                    title="Message Customer"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* Service Details */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-200">
                <h4 className="font-black text-gray-900 text-lg mb-2">{job.service}</h4>
                <p className="text-sm text-gray-700 font-medium">{job.description}</p>
              </div>

              {/* Job Details Grid */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                  <Clock className="w-5 h-5 text-blue-600 mb-2" />
                  <p className="text-xs text-gray-600 font-semibold mb-1">Start Time</p>
                  <p className="font-black text-gray-900">{job.startTime}</p>
                </div>
                
                <div className="bg-purple-50 rounded-xl p-4 border-2 border-purple-200">
                  <Clock className="w-5 h-5 text-purple-600 mb-2" />
                  <p className="text-xs text-gray-600 font-semibold mb-1">Duration</p>
                  <p className="font-black text-gray-900">{job.expectedDuration}</p>
                </div>
                
                <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
                  <MapPin className="w-5 h-5 text-green-600 mb-2" />
                  <p className="text-xs text-gray-600 font-semibold mb-1">Distance</p>
                  <p className="font-black text-gray-900">{job.distance} km</p>
                </div>
                
                <div className="bg-yellow-50 rounded-xl p-4 border-2 border-yellow-200">
                  <p className="text-xs text-gray-600 font-semibold mb-1">Earnings</p>
                  <p className="font-black text-green-600 text-xl">₹{job.earnings}</p>
                </div>
              </div>
            </div>

            {/* Location & Navigation */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
              <h3 className="text-xl font-black text-gray-900 mb-4">Location</h3>
              
              <div className="flex items-start gap-3 mb-4">
                <MapPin className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <p className="font-semibold text-gray-700">{job.address}</p>
              </div>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(job.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:shadow-xl text-white font-bold py-4 rounded-xl transition-all"
              >
                <Navigation className="w-5 h-5" />
                Navigate with Google Maps
              </a>
            </div>

            {/* OTP Verification Section */}
            {!isOtpVerified && (
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl shadow-lg border-2 border-orange-300 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <ShieldCheck className="w-8 h-8 text-orange-600" />
                  <h3 className="text-xl font-black text-gray-900">OTP Verification Required</h3>
                </div>
                
                <p className="text-gray-700 font-semibold mb-6">
                  Ask the customer for their 4-digit OTP to start the job:
                </p>

                <div className="flex gap-3 justify-center mb-6">
                  {otpValue.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-16 h-16 text-center text-3xl font-black border-3 border-orange-400 rounded-xl focus:border-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-200 transition-all"
                    />
                  ))}
                </div>

                <button
                  onClick={handleVerifyOtp}
                  disabled={otpValue.some(d => !d)}
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:shadow-xl text-white font-black py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Verify OTP & Start Job
                </button>

                <div className="mt-4 bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                  <p className="text-sm text-blue-800 font-semibold">
                    💡 <strong>Why OTP?</strong> This ensures the customer is present and ready for service.
                  </p>
                </div>
              </div>
            )}

            {/* Job Timer & Work Documentation (Shown after OTP) */}
            {isOtpVerified && (
              <>
                {/* Timer */}
                <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-lg p-8 text-white">
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <Clock className="w-10 h-10" />
                    <h3 className="text-2xl font-black">Job Duration</h3>
                  </div>
                  
                  <div className="text-7xl font-black text-center mb-8 tracking-wider">
                    {formatTime(elapsedTime)}
                  </div>

                  <div className="flex justify-center">
                    <button
                      onClick={handleTogglePause}
                      className="flex items-center gap-3 bg-white hover:bg-gray-100 text-purple-700 font-black py-4 px-8 rounded-xl transition-all shadow-lg"
                    >
                      {isPaused ? (
                        <>
                          <Play className="w-6 h-6" />
                          Resume Timer
                        </>
                      ) : (
                        <>
                          <Pause className="w-6 h-6" />
                          Pause Timer
                        </>
                      )}
                    </button>
                  </div>

                  {isPaused && (
                    <div className="mt-4 bg-white bg-opacity-20 rounded-xl p-4 text-center">
                      <p className="font-bold">⏸️ Timer Paused</p>
                      <p className="text-sm opacity-90">Click Resume when ready to continue</p>
                    </div>
                  )}
                </div>

                {/* Work Photos */}
                <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Camera className="w-7 h-7 text-purple-600" />
                    <h3 className="text-xl font-black text-gray-900">Work Documentation</h3>
                  </div>
                  
                  {/* Before Photos */}
                  <div className="mb-8">
                    <h4 className="font-black text-gray-700 mb-4 flex items-center gap-2">
                      📷 Before Work Photos
                      {beforePhotos.length > 0 && (
                        <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          {beforePhotos.length}
                        </span>
                      )}
                    </h4>
                    
                    {beforePhotos.length > 0 && (
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        {beforePhotos.map((photo, index) => (
                          <div key={index} className="relative aspect-square rounded-xl overflow-hidden border-2 border-blue-200 group">
                            <img src={photo} alt={`Before ${index + 1}`} className="w-full h-full object-cover" />
                            <button
                              onClick={() => removePhoto('before', index)}
                              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-3">
                      <label className="bg-blue-50 hover:bg-blue-100 border-2 border-blue-300 text-blue-700 font-bold py-4 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2">
                        <Camera className="w-5 h-5" />
                        Take Photo
                        <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => handleFileUpload('before', e)} />
                      </label>
                      <label className="bg-blue-50 hover:bg-blue-100 border-2 border-blue-300 text-blue-700 font-bold py-4 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2">
                        <ImageIcon className="w-5 h-5" />
                        From Gallery
                        <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFileUpload('before', e)} />
                      </label>
                    </div>
                  </div>

                  {/* After Photos */}
                  <div>
                    <h4 className="font-black text-gray-700 mb-4 flex items-center gap-2">
                      ✅ After Work Photos
                      {afterPhotos.length > 0 && (
                        <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          {afterPhotos.length}
                        </span>
                      )}
                    </h4>
                    
                    {afterPhotos.length > 0 && (
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        {afterPhotos.map((photo, index) => (
                          <div key={index} className="relative aspect-square rounded-xl overflow-hidden border-2 border-green-200 group">
                            <img src={photo} alt={`After ${index + 1}`} className="w-full h-full object-cover" />
                            <button
                              onClick={() => removePhoto('after', index)}
                              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-3">
                      <label className="bg-green-50 hover:bg-green-100 border-2 border-green-300 text-green-700 font-bold py-4 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2">
                        <Camera className="w-5 h-5" />
                        Take Photo
                        <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => handleFileUpload('after', e)} />
                      </label>
                      <label className="bg-green-50 hover:bg-green-100 border-2 border-green-300 text-green-700 font-bold py-4 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2">
                        <ImageIcon className="w-5 h-5" />
                        From Gallery
                        <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFileUpload('after', e)} />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Work Summary */}
                <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="w-7 h-7 text-purple-600" />
                    <h3 className="text-xl font-black text-gray-900">Work Summary</h3>
                  </div>
                  
                  <textarea
                    value={workSummary}
                    onChange={(e) => setWorkSummary(e.target.value)}
                    placeholder="Describe the work performed..&#10;&#10;Example:&#10;• Replaced faulty MCB&#10;• Checked all wire connections&#10;• Tested the circuit&#10;• Issue resolved"
                    className="w-full border-2 border-gray-300 rounded-xl p-4 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-100 resize-none font-medium"
                    rows={6}
                  />
                  
                  <p className="text-sm text-gray-500 font-semibold mt-2">
                    💡 A detailed summary helps customers understand the value of your work
                  </p>
                </div>

                {/* Complete Job Button */}
                <button
                  onClick={handleCompleteJob}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-black py-6 px-8 rounded-2xl transition-all shadow-lg hover:shadow-2xl text-xl flex items-center justify-center gap-3"
                >
                  <CheckCircle className="w-8 h-8" />
                  COMPLETE JOB & GET PAID
                </button>
              </>
            )}
          </div>

          {/* Right Column - Tips & Status */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
              <h3 className="text-lg font-black text-gray-900 mb-4">Job Status</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-semibold text-sm">OTP Status</span>
                  <span className={`font-black ${isOtpVerified ? 'text-green-600' : 'text-orange-600'}`}>
                    {isOtpVerified ? '✅ Verified' : '🔒 Pending'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-semibold text-sm">Job Timer</span>
                  <span className={`font-black ${jobStartTime ? 'text-purple-600' : 'text-gray-400'}`}>
                    {jobStartTime ? (isPaused ? '⏸️ Paused' : '⏱️ Running') : 'Not Started'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-semibold text-sm">Photos</span>
                  <span className="font-black text-gray-900">
                    {beforePhotos.length + afterPhotos.length}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-semibold text-sm">Summary</span>
                  <span className={`font-black ${workSummary ? 'text-green-600' : 'text-gray-400'}`}>
                    {workSummary ? '✓ Added' : 'Not Added'}
                  </span>
                </div>
              </div>
            </div>

            {/* Pro Tips */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-black mb-4">💡 Pro Tips</h3>
              <div className="space-y-3">
                <div className="bg-white bg-opacity-20 rounded-xl p-3">
                  <p className="text-sm font-bold mb-1">Take Clear Photos</p>
                  <p className="text-xs opacity-90">Before & after photos build customer trust</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-xl p-3">
                  <p className="text-sm font-bold mb-1">Detailed Summary</p>
                  <p className="text-xs opacity-90">Explain what was done and why</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-xl p-3">
                  <p className="text-sm font-bold mb-1">Track Time</p>
                  <p className="text-xs opacity-90">Accurate timing helps with future estimates</p>
                </div>
              </div>
            </div>

            {/* Help Card */}
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-5">
              <AlertCircle className="w-6 h-6 text-yellow-600 mb-3" />
              <h4 className="font-black text-yellow-900 mb-2">Need Help?</h4>
              <p className="text-sm text-yellow-800 font-semibold mb-4">
                If you encounter any issues during the job, contact support immediately.
              </p>
              <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 rounded-xl transition-colors">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}