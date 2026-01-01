'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { 
  CheckCircle, Clock, MapPin, Calendar, CreditCard, Gift, 
  ChevronRight, ChevronLeft, Star, User, Phone, Home, 
  IndianRupee, Sparkles, Award, Shield, Loader2, AlertCircle,
  Check, X, Zap, TrendingUp, Lock, Wallet, Smartphone,
  QrCode, Building2, Landmark, MessageSquare, BadgeCheck,
  PartyPopper, Download, Eye, Trash2, Edit2
} from 'lucide-react';
import Link from 'next/link';
import Navbar from '../../Component/Navbar';
import Footer from '../../Component/Footer';
import { getProfessionalPublicProfile } from '../../../utils/services';
import { 
  getUserAddresses, 
  addUserAddress, 
  deleteUserAddress, 
  setDefaultAddress,
  Address, 
  AddressCreate,
  getAccessToken
} from '../../../utils/auth';

// Premium Color Palette
const colors = {
  primary: '#1E2A5E',
  secondary: '#00BFA6',
  accent: '#FF9F43',
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  background: '#F6F7FB',
  card: '#FFFFFF',
  textMain: '#1F2937',
  textMuted: '#6B7280',
  divider: '#E5E7EB',
};

// Booking Steps Configuration
const BOOKING_STEPS = [
  { id: 1, label: 'Professional', icon: User },
  { id: 2, label: 'Schedule & Address', icon: Calendar },
  { id: 3, label: 'Offers', icon: Gift },
  { id: 4, label: 'Payment', icon: CreditCard },
  { id: 5, label: 'Confirm', icon: CheckCircle },
];

export default function BookingFlowPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const professionalId = params.id as string;

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [professional, setProfessional] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Step 1: Professional Selection (Auto-filled)
  const [selectedProfessional, setSelectedProfessional] = useState<any>(null);

  // Step 2: Address & Schedule & Contact
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [contactNumber, setContactNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [newAddress, setNewAddress] = useState<AddressCreate>({
    label: '',
    house_no: '',
    area: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    is_default: false,
  });
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);

  // Step 3: Offers & Pricing
  const [offers, setOffers] = useState<any[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [showAllOffers, setShowAllOffers] = useState(false);
  const [pricing, setPricing] = useState({
    serviceCost: 0,
    discount: 0,
    platformFee: 50,
    tax: 0,
    total: 0,
  });

  // Step 4: Payment
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  // Step 5: Confirmation
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Time Slots
  const timeSlots = {
    morning: ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM'],
    afternoon: ['12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'],
    evening: ['05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM'],
  };

  // Fetch professional data
  useEffect(() => {
    const fetchProfessional = async () => {
      if (!professionalId) {
        setError('Professional ID not provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getProfessionalPublicProfile(professionalId);
        setProfessional(data.professional);
        setSelectedProfessional(data.professional);
        
        // Calculate initial pricing
        const baseCost = data.professional.hourly_rate || 500;
        const tax = baseCost * 0.18; // 18% GST
        setPricing({
          serviceCost: baseCost,
          discount: 0,
          platformFee: 50,
          tax: tax,
          total: baseCost + 50 + tax,
        });

      } catch (err: any) {
        console.error('Error fetching professional:', err);
        setError(err.message || 'Failed to load professional');
      } finally {
        setLoading(false);
      }
    };

    fetchProfessional();
    fetchOffers();
    fetchUserAddresses();
  }, [professionalId]);

  // Fetch available offers
  const fetchOffers = async () => {
    try {
      // Simulate offers - replace with actual API call
      setOffers([
        {
          id: 1,
          name: 'FIRST50',
          discount: 50,
          description: 'Flat ₹50 off on first booking',
          conditions: 'Valid for new users only',
          savings: 50,
        },
        {
          id: 2,
          name: 'SAVE10',
          discount: 10,
          description: '10% off on all services',
          conditions: 'Maximum discount ₹100',
          savings: pricing.serviceCost * 0.1,
        },
      ]);
    } catch (error) {
      console.error('Error fetching offers:', error);
    }
  };

  // Fetch user addresses
  const fetchUserAddresses = async () => {
    try {
      const token = getAccessToken();
      if (!token) return;

      const data = await getUserAddresses();
      setAddresses(data.addresses || []);
      
      // Auto-select default address
      const defaultAddr = data.addresses?.find((addr: Address) => addr.is_default);
      if (defaultAddr && !selectedAddress) {
        setSelectedAddress(defaultAddr);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  // Check availability for selected date/time/address
  const checkAvailability = async () => {
    if (!selectedDate || !selectedTimeSlot || !selectedAddress) {
      return;
    }

    setCheckingAvailability(true);
    try {
      // Simulate availability check - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo, randomly determine availability
      const available = Math.random() > 0.2; // 80% chance of being available
      setIsAvailable(available);
      
      if (!available) {
        alert('Professional is not available at this time. Please select a different slot.');
      }
    } catch (error) {
      console.error('Error checking availability:', error);
      setIsAvailable(false);
    } finally {
      setCheckingAvailability(false);
    }
  };

  // Apply offer
  const applyOffer = (offer: any) => {
    setSelectedOffer(offer);
    const discount = Math.min(offer.savings, pricing.serviceCost);
    const newTotal = pricing.serviceCost - discount + pricing.platformFee + pricing.tax;
    setPricing({
      ...pricing,
      discount,
      total: newTotal,
    });
  };

  // Process payment
  const handlePayment = async () => {
    if (!selectedPaymentMethod) {
      alert('Please select a payment method');
      return;
    }

    setPaymentProcessing(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate booking ID
      const generatedBookingId = `BK${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      setBookingId(generatedBookingId);
      setBookingSuccess(true);
      setCurrentStep(5);
      
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setPaymentProcessing(false);
    }
  };

  // Add new address
  const handleAddAddress = async () => {
    if (!newAddress.house_no || !newAddress.area || !newAddress.city || !newAddress.pincode) {
      setAddressError('Please fill all required fields');
      return;
    }

    const token = getAccessToken();
    if (!token) {
      setAddressError('Please login to continue');
      router.push('/auth');
      return;
    }

    setSavingAddress(true);
    setAddressError(null);

    try {
      const savedAddress = await addUserAddress(newAddress);
      setAddresses([...addresses, savedAddress]);
      setSelectedAddress(savedAddress);
      setShowAddressForm(false);
      setNewAddress({
        label: '',
        house_no: '',
        area: '',
        landmark: '',
        city: '',
        state: '',
        pincode: '',
        is_default: false,
      });
    } catch (error: any) {
      console.error('Error adding address:', error);
      setAddressError(error.message || 'Failed to add address');
    } finally {
      setSavingAddress(false);
    }
  };

  // Delete address
  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    
    try {
      await deleteUserAddress(addressId);
      setAddresses(addresses.filter(addr => addr.id !== addressId));
      if (selectedAddress?.id === addressId) {
        setSelectedAddress(null);
      }
    } catch (error: any) {
      console.error('Error deleting address:', error);
      setAddressError(error.message || 'Failed to delete address');
    }
  };

  // Check if current step is valid
  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return selectedProfessional !== null;
      case 2:
        return selectedDate && selectedTimeSlot && selectedAddress && contactNumber && isAvailable;
      case 3:
        return true; // Offers are optional
      case 4:
        return selectedPaymentMethod !== '';
      case 5:
        return bookingSuccess;
      default:
        return false;
    }
  };

  // Navigate to next step
  const nextStep = () => {
    if (currentStep === 2) {
      checkAvailability();
      if (!isAvailable) return;
    }
    
    if (isStepValid() && currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Navigate to previous step
  const prevStep = () => {
    if (currentStep > 1 && currentStep < 5) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Generate calendar dates (next 30 days)
  const generateCalendarDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const calendarDates = generateCalendarDates();

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
        <Navbar onNotificationClick={() => setIsNotificationsOpen(!isNotificationsOpen)} isNotificationsOpen={isNotificationsOpen} />
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: colors.primary }} />
            <p className="font-medium" style={{ color: colors.textMuted }}>Loading booking flow...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !professional) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
        <Navbar onNotificationClick={() => setIsNotificationsOpen(!isNotificationsOpen)} isNotificationsOpen={isNotificationsOpen} />
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${colors.error}20` }}>
              <AlertCircle className="w-10 h-10" style={{ color: colors.error }} />
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: colors.textMain }}>Something Went Wrong</h2>
            <p className="mb-6" style={{ color: colors.textMuted }}>{error || 'Failed to load booking details'}</p>
            <Link 
              href="/service"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-colors"
              style={{ backgroundColor: colors.primary }}
            >
              Back to Services
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <Navbar onNotificationClick={() => setIsNotificationsOpen(!isNotificationsOpen)} isNotificationsOpen={isNotificationsOpen} />

      {/* Progress Stepper */}
      <div className="sticky top-[70px] z-40 shadow-md" style={{ backgroundColor: colors.card }}>
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {BOOKING_STEPS.map((step, index) => {
              const StepIcon = step.icon;
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;
              const isUpcoming = currentStep < step.id;

              return (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold transition-all"
                      style={{
                        backgroundColor: isCompleted ? colors.secondary : isCurrent ? colors.primary : colors.divider,
                        color: isCompleted || isCurrent ? colors.card : colors.textMuted,
                        boxShadow: isCompleted ? `0 0 0 4px ${colors.secondary}30` : 'none',
                      }}
                    >
                      {isCompleted ? <Check className="w-5 h-5 sm:w-6 sm:h-6" /> : <StepIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
                    </div>
                    <span 
                      className="text-xs sm:text-sm font-bold text-center hidden sm:block"
                      style={{ color: isCompleted || isCurrent ? colors.textMain : colors.textMuted }}
                    >
                      {step.label}
                    </span>
                  </div>
                  {index < BOOKING_STEPS.length - 1 && (
                    <div className="flex-1 h-1 mx-1" style={{ backgroundColor: isCompleted ? colors.secondary : colors.divider }} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Booking Steps */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Professional Selection */}
            {currentStep === 1 && (
              <div className="rounded-2xl shadow-lg p-6 animate-fadeIn" style={{ backgroundColor: colors.card }}>
                <h2 className="text-2xl font-bold mb-6" style={{ color: colors.textMain }}>
                  Selected Professional
                </h2>
                
                <div className="border-2 rounded-xl p-6" style={{ borderColor: colors.secondary, backgroundColor: `${colors.secondary}10` }}>
                  <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0" style={{ backgroundColor: colors.primary }}>
                      {professional.profile_image ? (
                        <img
                          src={professional.profile_image.startsWith('http') ? professional.profile_image : `http://localhost:8000${professional.profile_image}`}
                          alt={professional.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-10 h-10 text-white" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-bold flex items-center gap-2" style={{ color: colors.textMain }}>
                            {professional.name}
                            {professional.is_verified && (
                              <BadgeCheck className="w-5 h-5" style={{ color: colors.success }} />
                            )}
                          </h3>
                          {professional.category && (
                            <p className="text-sm font-medium" style={{ color: colors.textMuted }}>
                              {professional.category}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-3 mb-3">
                        <div className="flex items-center gap-1 px-3 py-1 rounded-full" style={{ backgroundColor: colors.card }}>
                          <Star className="w-4 h-4" style={{ color: colors.warning, fill: colors.warning }} />
                          <span className="font-bold text-sm" style={{ color: colors.textMain }}>
                            {(professional.rating || 0).toFixed(1)}
                          </span>
                        </div>
                        {professional.experience && (
                          <div className="flex items-center gap-1 px-3 py-1 rounded-full" style={{ backgroundColor: colors.card }}>
                            <Award className="w-4 h-4" style={{ color: colors.primary }} />
                            <span className="font-bold text-sm" style={{ color: colors.textMain }}>
                              {professional.experience}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-1 px-3 py-1 rounded-full" style={{ backgroundColor: colors.card }}>
                          <IndianRupee className="w-4 h-4" style={{ color: colors.primary }} />
                          <span className="font-bold text-sm" style={{ color: colors.textMain }}>
                            {professional.hourly_rate || 500} / hour
                          </span>
                        </div>
                      </div>

                      {professional.emergency_available && (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: colors.success, color: colors.card }}>
                          <Zap className="w-4 h-4" />
                          <span className="text-sm font-bold">Available Now</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Address & Schedule */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fadeIn">
                {/* Address Section */}
                <div className="rounded-2xl shadow-lg p-6" style={{ backgroundColor: colors.card }}>
                  <h2 className="text-2xl font-bold mb-6" style={{ color: colors.textMain }}>
                    Service Address
                  </h2>

                  {/* Error Message */}
                  {addressError && (
                    <div className="mb-4 p-3 rounded-xl flex items-center gap-2" style={{ backgroundColor: `${colors.error}10` }}>
                      <AlertCircle className="w-5 h-5" style={{ color: colors.error }} />
                      <p className="text-sm font-medium" style={{ color: colors.error }}>{addressError}</p>
                    </div>
                  )}

                  {/* Saved Addresses */}
                  {addresses.length > 0 && !showAddressForm && (
                    <div className="space-y-3 mb-4">
                      {addresses.map((address: Address) => (
                        <div
                          key={address.id}
                          className="p-4 rounded-xl border-2 transition-all"
                          style={{
                            borderColor: selectedAddress?.id === address.id ? colors.secondary : colors.divider,
                            backgroundColor: selectedAddress?.id === address.id ? `${colors.secondary}10` : colors.card,
                            boxShadow: selectedAddress?.id === address.id ? `0 0 0 4px ${colors.secondary}30` : 'none',
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <div 
                              className="flex-shrink-0 cursor-pointer"
                              onClick={() => setSelectedAddress(address)}
                            >
                              <Home className="w-5 h-5" style={{ color: colors.primary }} />
                            </div>
                            <div 
                              className="flex-1 cursor-pointer"
                              onClick={() => setSelectedAddress(address)}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                {address.label && (
                                  <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>
                                    {address.label}
                                  </span>
                                )}
                                {address.is_default && (
                                  <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: `${colors.success}20`, color: colors.success }}>
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="font-bold" style={{ color: colors.textMain }}>
                                {address.house_no}, {address.area}
                              </p>
                              {address.landmark && (
                                <p className="text-sm" style={{ color: colors.textMuted }}>
                                  Near {address.landmark}
                                </p>
                              )}
                              <p className="text-sm" style={{ color: colors.textMuted }}>
                                {address.city}{address.state ? `, ${address.state}` : ''} - {address.pincode}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteAddress(address.id);
                                }}
                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                title="Delete address"
                              >
                                <Trash2 className="w-4 h-4" style={{ color: colors.error }} />
                              </button>
                              {selectedAddress?.id === address.id && (
                                <CheckCircle className="w-6 h-6" style={{ color: colors.secondary }} />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* No Addresses Message */}
                  {addresses.length === 0 && !showAddressForm && (
                    <div className="text-center py-8 mb-4 rounded-xl" style={{ backgroundColor: colors.background }}>
                      <MapPin className="w-12 h-12 mx-auto mb-3" style={{ color: colors.textMuted }} />
                      <p className="font-bold mb-1" style={{ color: colors.textMain }}>No saved addresses</p>
                      <p className="text-sm" style={{ color: colors.textMuted }}>Add an address to continue booking</p>
                    </div>
                  )}

                  {/* Add Address Form */}
                  {showAddressForm && (
                    <div className="space-y-4 mb-4 p-4 rounded-xl" style={{ backgroundColor: colors.background }}>
                      <h3 className="font-bold" style={{ color: colors.textMain }}>Add New Address</h3>
                      
                      {/* Address Label */}
                      <div>
                        <label className="block text-sm font-medium mb-1" style={{ color: colors.textMuted }}>
                          Label (Optional)
                        </label>
                        <div className="flex gap-2">
                          {['Home', 'Office', 'Other'].map((label) => (
                            <button
                              key={label}
                              type="button"
                              onClick={() => setNewAddress({ ...newAddress, label })}
                              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                                newAddress.label === label ? 'ring-2' : ''
                              }`}
                              style={{
                                backgroundColor: newAddress.label === label ? `${colors.primary}20` : colors.card,
                                color: newAddress.label === label ? colors.primary : colors.textMuted,
                                borderWidth: 1,
                                borderColor: newAddress.label === label ? colors.primary : colors.divider,
                              }}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1" style={{ color: colors.textMuted }}>
                            House / Flat No. *
                          </label>
                          <input
                            type="text"
                            placeholder="e.g., 12A, Block B"
                            value={newAddress.house_no}
                            onChange={(e) => setNewAddress({ ...newAddress, house_no: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border-2 font-medium focus:outline-none focus:ring-4 transition-all"
                            style={{ borderColor: colors.divider, backgroundColor: colors.card }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1" style={{ color: colors.textMuted }}>
                            Area / Street *
                          </label>
                          <input
                            type="text"
                            placeholder="e.g., MG Road"
                            value={newAddress.area}
                            onChange={(e) => setNewAddress({ ...newAddress, area: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border-2 font-medium focus:outline-none focus:ring-4 transition-all"
                            style={{ borderColor: colors.divider, backgroundColor: colors.card }}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1" style={{ color: colors.textMuted }}>
                          Landmark (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., Near City Mall"
                          value={newAddress.landmark || ''}
                          onChange={(e) => setNewAddress({ ...newAddress, landmark: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border-2 font-medium focus:outline-none focus:ring-4 transition-all"
                          style={{ borderColor: colors.divider, backgroundColor: colors.card }}
                        />
                      </div>

                      <div className="grid sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1" style={{ color: colors.textMuted }}>
                            City *
                          </label>
                          <input
                            type="text"
                            placeholder="e.g., Mumbai"
                            value={newAddress.city}
                            onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border-2 font-medium focus:outline-none focus:ring-4 transition-all"
                            style={{ borderColor: colors.divider, backgroundColor: colors.card }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1" style={{ color: colors.textMuted }}>
                            State (Optional)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g., Maharashtra"
                            value={newAddress.state || ''}
                            onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border-2 font-medium focus:outline-none focus:ring-4 transition-all"
                            style={{ borderColor: colors.divider, backgroundColor: colors.card }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1" style={{ color: colors.textMuted }}>
                            Pincode *
                          </label>
                          <input
                            type="text"
                            placeholder="e.g., 400001"
                            value={newAddress.pincode}
                            onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border-2 font-medium focus:outline-none focus:ring-4 transition-all"
                            style={{ borderColor: colors.divider, backgroundColor: colors.card }}
                          />
                        </div>
                      </div>

                      {/* Set as default checkbox */}
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newAddress.is_default || false}
                          onChange={(e) => setNewAddress({ ...newAddress, is_default: e.target.checked })}
                          className="w-4 h-4 rounded"
                        />
                        <span className="text-sm font-medium" style={{ color: colors.textMain }}>
                          Set as default address
                        </span>
                      </label>

                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={handleAddAddress}
                          disabled={savingAddress}
                          className="flex-1 px-6 py-3 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                          style={{ backgroundColor: colors.secondary }}
                        >
                          {savingAddress ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Check className="w-5 h-5" />
                              Save Address
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setShowAddressForm(false);
                            setAddressError(null);
                          }}
                          disabled={savingAddress}
                          className="px-6 py-3 rounded-xl font-bold border-2 transition-all"
                          style={{ borderColor: colors.divider, color: colors.textMain }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {!showAddressForm && (
                    <button
                      onClick={() => {
                        setShowAddressForm(true);
                        setAddressError(null);
                      }}
                      className="w-full px-6 py-3 rounded-xl font-bold border-2 transition-all flex items-center justify-center gap-2"
                      style={{ borderColor: colors.secondary, color: colors.secondary }}
                    >
                      <Home className="w-5 h-5" />
                      Add New Address
                    </button>
                  )}

                  <div className="mt-6">
                    <label className="block text-sm font-bold mb-2" style={{ color: colors.textMain }}>
                      Contact Number *
                    </label>
                    <input
                      type="tel"
                      placeholder="Enter your phone number"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 font-medium focus:outline-none focus:ring-4 transition-all"
                      style={{ borderColor: colors.divider, backgroundColor: colors.card }}
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-bold mb-2" style={{ color: colors.textMain }}>
                      Notes for Professional (Optional)
                    </label>
                    <textarea
                      placeholder="Any special instructions or requirements..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border-2 font-medium focus:outline-none focus:ring-4 transition-all resize-none"
                      style={{ borderColor: colors.divider, backgroundColor: colors.card }}
                    />
                  </div>
                </div>

                {/* Schedule Section - Only show if address is selected */}
                {selectedAddress && (
                  <>
                    <div className="rounded-2xl shadow-lg p-6" style={{ backgroundColor: colors.card }}>
                      <h2 className="text-2xl font-bold mb-6" style={{ color: colors.textMain }}>
                        Select Date & Time
                      </h2>

                      {/* Date Picker */}
                      <div className="mb-6">
                        <h3 className="text-lg font-bold mb-4" style={{ color: colors.textMain }}>
                          Choose Date
                        </h3>
                        <div className="grid grid-cols-7 gap-2">
                          {calendarDates.map((date, index) => {
                            const isSelected = selectedDate?.toDateString() === date.toDateString();
                            const isToday = new Date().toDateString() === date.toDateString();
                            
                            return (
                              <button
                                key={index}
                                onClick={() => {
                                  setSelectedDate(date);
                                  setIsAvailable(false);
                                }}
                                className="p-2 rounded-xl text-center transition-all"
                                style={{
                                  backgroundColor: isSelected ? colors.primary : isToday ? `${colors.accent}20` : colors.background,
                                  color: isSelected ? colors.card : colors.textMain,
                                  boxShadow: isSelected ? `0 0 0 4px ${colors.primary}30` : 'none',
                                }}
                              >
                                <div className="text-xs font-bold">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                                <div className="text-lg font-black">{date.getDate()}</div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Time Slots */}
                      {selectedDate && (
                        <div>
                          <h3 className="text-lg font-bold mb-4" style={{ color: colors.textMain }}>
                            Choose Time Slot
                          </h3>
                          
                          {Object.entries(timeSlots).map(([period, slots]) => (
                            <div key={period} className="mb-4">
                              <h4 className="text-sm font-bold mb-2 capitalize" style={{ color: colors.textMuted }}>
                                {period}
                              </h4>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {slots.map((slot) => {
                                  const isSelected = selectedTimeSlot === slot;
                                  const isPeakTime = period === 'evening';
                                  
                                  return (
                                    <button
                                      key={slot}
                                      onClick={() => {
                                        setSelectedTimeSlot(slot);
                                        setIsAvailable(false);
                                      }}
                                      className="px-4 py-3 rounded-xl font-bold transition-all border-2"
                                      style={{
                                        backgroundColor: isSelected ? colors.secondary : colors.card,
                                        borderColor: isSelected ? colors.secondary : colors.divider,
                                        color: isSelected ? colors.card : colors.textMain,
                                        boxShadow: isSelected ? `0 0 0 4px ${colors.secondary}30` : 'none',
                                      }}
                                    >
                                      {slot}
                                      {isPeakTime && (
                                        <TrendingUp className="w-3 h-3 inline ml-1" style={{ color: colors.warning }} />
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Check Availability Button */}
                      {selectedDate && selectedTimeSlot && selectedAddress && (
                        <button
                          onClick={checkAvailability}
                          disabled={checkingAvailability}
                          className="w-full mt-6 px-6 py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2"
                          style={{ backgroundColor: colors.primary }}
                        >
                          {checkingAvailability ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Checking Availability...
                            </>
                          ) : isAvailable ? (
                            <>
                              <CheckCircle className="w-5 h-5" />
                              Professional Available!
                            </>
                          ) : (
                            <>
                              <Clock className="w-5 h-5" />
                              Check Availability
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Step 3: Offers & Pricing */}
            {currentStep === 3 && (
              <div className="rounded-2xl shadow-lg p-6 animate-fadeIn" style={{ backgroundColor: colors.card }}>
                <h2 className="text-2xl font-bold mb-6" style={{ color: colors.textMain }}>
                  Offers & Discounts
                </h2>

                {/* Best Offer Auto-Applied */}
                {offers.length > 0 && !selectedOffer && (
                  <div className="mb-6 p-4 rounded-xl border-2" style={{ borderColor: colors.success, backgroundColor: `${colors.success}10` }}>
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-6 h-6 flex-shrink-0" style={{ color: colors.success }} />
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1" style={{ color: colors.textMain }}>
                          Best Offer Available!
                        </h3>
                        <p className="text-sm mb-3" style={{ color: colors.textMuted }}>
                          {offers[0].name} - {offers[0].description}
                        </p>
                        <button
                          onClick={() => applyOffer(offers[0])}
                          className="px-6 py-2 rounded-xl font-bold text-white transition-all"
                          style={{ backgroundColor: colors.success }}
                        >
                          Apply & Save ₹{offers[0].savings}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Selected Offer */}
                {selectedOffer && (
                  <div className="mb-6 p-4 rounded-xl" style={{ backgroundColor: `${colors.secondary}20`, borderLeft: `4px solid ${colors.secondary}` }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-6 h-6" style={{ color: colors.secondary }} />
                        <div>
                          <h3 className="font-bold" style={{ color: colors.textMain }}>{selectedOffer.name} Applied</h3>
                          <p className="text-sm" style={{ color: colors.textMuted }}>You saved ₹{selectedOffer.savings}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedOffer(null);
                          setPricing({
                            ...pricing,
                            discount: 0,
                            total: pricing.serviceCost + pricing.platformFee + pricing.tax,
                          });
                        }}
                        className="px-4 py-2 rounded-xl font-bold transition-all"
                        style={{ backgroundColor: colors.card, color: colors.error }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}

                {/* View All Offers */}
                {!showAllOffers && !selectedOffer && offers.length > 1 && (
                  <button
                    onClick={() => setShowAllOffers(true)}
                    className="w-full px-6 py-3 rounded-xl font-bold border-2 transition-all flex items-center justify-center gap-2"
                    style={{ borderColor: colors.primary, color: colors.primary }}
                  >
                    <Gift className="w-5 h-5" />
                    View All {offers.length} Offers
                  </button>
                )}

                {/* All Offers List */}
                {showAllOffers && !selectedOffer && (
                  <div className="space-y-3">
                    {offers.map((offer) => (
                      <div
                        key={offer.id}
                        className="p-4 rounded-xl border-2 transition-all"
                        style={{ borderColor: colors.divider }}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg mb-1" style={{ color: colors.textMain }}>
                              {offer.name}
                            </h3>
                            <p className="text-sm mb-2" style={{ color: colors.textMuted }}>
                              {offer.description}
                            </p>
                            <p className="text-xs font-bold" style={{ color: colors.warning }}>
                              {offer.conditions}
                            </p>
                          </div>
                          <button
                            onClick={() => applyOffer(offer)}
                            className="px-4 py-2 rounded-xl font-bold text-white whitespace-nowrap"
                            style={{ backgroundColor: colors.secondary }}
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Payment */}
            {currentStep === 4 && (
              <div className="rounded-2xl shadow-lg p-6 animate-fadeIn" style={{ backgroundColor: colors.card }}>
                <h2 className="text-2xl font-bold mb-6" style={{ color: colors.textMain }}>
                  Payment Method
                </h2>

                <div className="space-y-3">
                  {/* UPI */}
                  <div
                    onClick={() => setSelectedPaymentMethod('upi')}
                    className="p-4 rounded-xl border-2 cursor-pointer transition-all"
                    style={{
                      borderColor: selectedPaymentMethod === 'upi' ? colors.primary : colors.divider,
                      backgroundColor: selectedPaymentMethod === 'upi' ? `${colors.primary}10` : colors.card,
                      boxShadow: selectedPaymentMethod === 'upi' ? `0 0 0 4px ${colors.primary}30` : 'none',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <QrCode className="w-6 h-6" style={{ color: colors.primary }} />
                      <div className="flex-1">
                        <h3 className="font-bold" style={{ color: colors.textMain }}>UPI</h3>
                        <p className="text-sm" style={{ color: colors.textMuted }}>Google Pay, PhonePe, Paytm & more</p>
                      </div>
                      {selectedPaymentMethod === 'upi' && (
                        <CheckCircle className="w-6 h-6" style={{ color: colors.secondary }} />
                      )}
                    </div>
                  </div>

                  {/* Card */}
                  <div
                    onClick={() => setSelectedPaymentMethod('card')}
                    className="p-4 rounded-xl border-2 cursor-pointer transition-all"
                    style={{
                      borderColor: selectedPaymentMethod === 'card' ? colors.primary : colors.divider,
                      backgroundColor: selectedPaymentMethod === 'card' ? `${colors.primary}10` : colors.card,
                      boxShadow: selectedPaymentMethod === 'card' ? `0 0 0 4px ${colors.primary}30` : 'none',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-6 h-6" style={{ color: colors.primary }} />
                      <div className="flex-1">
                        <h3 className="font-bold" style={{ color: colors.textMain }}>Credit / Debit Card</h3>
                        <p className="text-sm" style={{ color: colors.textMuted }}>Visa, Mastercard, RuPay</p>
                      </div>
                      {selectedPaymentMethod === 'card' && (
                        <CheckCircle className="w-6 h-6" style={{ color: colors.secondary }} />
                      )}
                    </div>
                  </div>

                  {/* Wallet */}
                  <div
                    onClick={() => setSelectedPaymentMethod('wallet')}
                    className="p-4 rounded-xl border-2 cursor-pointer transition-all"
                    style={{
                      borderColor: selectedPaymentMethod === 'wallet' ? colors.primary : colors.divider,
                      backgroundColor: selectedPaymentMethod === 'wallet' ? `${colors.primary}10` : colors.card,
                      boxShadow: selectedPaymentMethod === 'wallet' ? `0 0 0 4px ${colors.primary}30` : 'none',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <Wallet className="w-6 h-6" style={{ color: colors.primary }} />
                      <div className="flex-1">
                        <h3 className="font-bold" style={{ color: colors.textMain }}>Wallet</h3>
                        <p className="text-sm" style={{ color: colors.textMuted }}>Amazon Pay, Mobikwik, Freecharge</p>
                      </div>
                      {selectedPaymentMethod === 'wallet' && (
                        <CheckCircle className="w-6 h-6" style={{ color: colors.secondary }} />
                      )}
                    </div>
                  </div>

                  {/* Cash */}
                  <div
                    onClick={() => setSelectedPaymentMethod('cash')}
                    className="p-4 rounded-xl border-2 cursor-pointer transition-all"
                    style={{
                      borderColor: selectedPaymentMethod === 'cash' ? colors.primary : colors.divider,
                      backgroundColor: selectedPaymentMethod === 'cash' ? `${colors.primary}10` : colors.card,
                      boxShadow: selectedPaymentMethod === 'cash' ? `0 0 0 4px ${colors.primary}30` : 'none',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <IndianRupee className="w-6 h-6" style={{ color: colors.primary }} />
                      <div className="flex-1">
                        <h3 className="font-bold" style={{ color: colors.textMain }}>Cash on Service</h3>
                        <p className="text-sm" style={{ color: colors.textMuted }}>Pay after service completion</p>
                      </div>
                      {selectedPaymentMethod === 'cash' && (
                        <CheckCircle className="w-6 h-6" style={{ color: colors.secondary }} />
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-xl flex items-center gap-3" style={{ backgroundColor: `${colors.success}10` }}>
                  <Shield className="w-6 h-6 flex-shrink-0" style={{ color: colors.success }} />
                  <p className="text-sm font-bold" style={{ color: colors.textMain }}>
                    100% Secure Payment • SSL Encrypted
                  </p>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={!selectedPaymentMethod || paymentProcessing}
                  className="w-full mt-6 px-6 py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: colors.success }}
                >
                  {paymentProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      Pay & Confirm Booking
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Step 5: Confirmation */}
            {currentStep === 5 && bookingSuccess && (
              <div className="rounded-2xl shadow-lg p-8 text-center animate-fadeIn" style={{ backgroundColor: colors.card }}>
                <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center animate-bounce" style={{ backgroundColor: `${colors.success}20` }}>
                  <PartyPopper className="w-10 h-10" style={{ color: colors.success }} />
                </div>

                <h2 className="text-3xl font-black mb-3" style={{ color: colors.textMain }}>
                  Booking Confirmed!
                </h2>
                <p className="text-lg mb-6" style={{ color: colors.textMuted }}>
                  Your service has been successfully booked
                </p>

                <div className="rounded-xl p-6 mb-6 text-left" style={{ backgroundColor: colors.background }}>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-4" style={{ borderBottom: `1px solid ${colors.divider}` }}>
                      <span className="font-bold" style={{ color: colors.textMuted }}>Booking ID</span>
                      <span className="font-black text-lg" style={{ color: colors.primary }}>{bookingId}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold" style={{ color: colors.textMuted }}>Professional</span>
                      <span className="font-bold" style={{ color: colors.textMain }}>{professional.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold" style={{ color: colors.textMuted }}>Service</span>
                      <span className="font-bold" style={{ color: colors.textMain }}>{professional.category}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold" style={{ color: colors.textMuted }}>Date & Time</span>
                      <span className="font-bold" style={{ color: colors.textMain }}>
                        {selectedDate?.toLocaleDateString()} {selectedTimeSlot}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold" style={{ color: colors.textMuted }}>Amount Paid</span>
                      <span className="font-black text-xl" style={{ color: colors.success }}>₹{pricing.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-3">
                  <Link
                    href="/bookings"
                    className="px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                    style={{ backgroundColor: colors.primary, color: colors.card }}
                  >
                    <Eye className="w-5 h-5" />
                    Track Booking
                  </Link>
                  <Link
                    href={`/messages/${professionalId}`}
                    className="px-6 py-3 rounded-xl font-bold border-2 transition-all flex items-center justify-center gap-2"
                    style={{ borderColor: colors.secondary, color: colors.secondary }}
                  >
                    <MessageSquare className="w-5 h-5" />
                    Chat
                  </Link>
                  <Link
                    href="/"
                    className="px-6 py-3 rounded-xl font-bold border-2 transition-all flex items-center justify-center gap-2"
                    style={{ borderColor: colors.divider, color: colors.textMain }}
                  >
                    Go Home
                  </Link>
                </div>
              </div>
            )}

            {/* Navigation Buttons - Inline After Each Step */}
            {currentStep > 0 && currentStep < 5 && (
              <div className="flex gap-3 justify-end">
                {currentStep > 1 && (
                  <button
                    onClick={prevStep}
                    className="px-8 py-3 rounded-xl font-bold border-2 transition-all flex items-center gap-2"
                    style={{ borderColor: colors.divider, color: colors.textMain }}
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Back
                  </button>
                )}
                <button
                  onClick={currentStep === 4 ? handlePayment : nextStep}
                  disabled={!isStepValid() || (currentStep === 2 && !isAvailable) || paymentProcessing}
                  className="px-8 py-4 rounded-xl font-bold text-white transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: currentStep === 4 ? colors.success : colors.primary }}
                >
                  {currentStep === 4 ? (
                    paymentProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5" />
                        Pay & Confirm Booking
                      </>
                    )
                  ) : (
                    <>
                      Continue
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Right Column - Price Summary (Sticky) */}
          {currentStep > 0 && currentStep < 5 && (
            <div className="lg:col-span-1">
              <div className="rounded-2xl shadow-lg p-6 sticky top-[170px]" style={{ backgroundColor: colors.card }}>
                <h3 className="text-xl font-bold mb-6" style={{ color: colors.textMain }}>
                  Price Summary
                </h3>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span style={{ color: colors.textMuted }}>Service Cost</span>
                    <span className="font-bold" style={{ color: colors.textMain }}>₹{pricing.serviceCost.toFixed(2)}</span>
                  </div>
                  {pricing.discount > 0 && (
                    <div className="flex items-center justify-between">
                      <span style={{ color: colors.success }}>Discount</span>
                      <span className="font-bold" style={{ color: colors.success }}>- ₹{pricing.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span style={{ color: colors.textMuted }}>Platform Fee</span>
                    <span className="font-bold" style={{ color: colors.textMain }}>₹{pricing.platformFee.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ color: colors.textMuted }}>GST (18%)</span>
                    <span className="font-bold" style={{ color: colors.textMain }}>₹{pricing.tax.toFixed(2)}</span>
                  </div>
                  <div className="pt-4" style={{ borderTop: `2px solid ${colors.divider}` }}>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold" style={{ color: colors.textMain }}>Total Payable</span>
                      <span className="text-2xl font-black" style={{ color: colors.primary }}>₹{pricing.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {pricing.discount > 0 && (
                  <div className="p-3 rounded-xl mb-4" style={{ backgroundColor: `${colors.success}10` }}>
                    <p className="text-sm font-bold flex items-center gap-2" style={{ color: colors.success }}>
                      <Sparkles className="w-4 h-4" />
                      You're saving ₹{pricing.discount.toFixed(2)}!
                    </p>
                  </div>
                )}

                <div className="p-4 rounded-xl" style={{ backgroundColor: colors.background }}>
                  <h4 className="font-bold mb-2" style={{ color: colors.textMain }}>
                    What's Included:
                  </h4>
                  <ul className="space-y-2 text-sm" style={{ color: colors.textMuted }}>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: colors.success }} />
                      <span>Professional verification</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: colors.success }} />
                      <span>Service guarantee</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: colors.success }} />
                      <span>24/7 customer support</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: colors.success }} />
                      <span>Secure payment</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
