'use client';

import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Wrench, FileText, IndianRupee, CheckCircle, AlertCircle } from 'lucide-react';

export default function BookingForm({ professionalName, hourlyRate }) {
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [address, setAddress] = useState('');
    const [addressType, setAddressType] = useState('home');
    const [serviceType, setServiceType] = useState('');
    const [issueDescription, setIssueDescription] = useState('');
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const today = new Date().toISOString().split('T')[0];

    const validateForm = () => {
        const newErrors = {};
        if (!selectedDate) newErrors.date = 'Please select a date';
        if (!selectedTime) newErrors.time = 'Please select a time slot';
        if (!address.trim()) newErrors.address = 'Please enter your address';
        if (!serviceType) newErrors.service = 'Please select a service type';
        if (!issueDescription.trim()) newErrors.description = 'Please describe the issue';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsSubmitting(true);
        setTimeout(() => {
            console.log({ professionalName, selectedDate, selectedTime, address, addressType, serviceType, issueDescription, estimatedPrice: hourlyRate });
            setIsSubmitting(false);
            alert('Booking request submitted successfully!');
        }, 1500);
    };

    const clearError = (field) => {
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
        });
    };

    return (
        <div className="lg:sticky lg:top-[150px] h-fit">
            <div className="bg-white rounded-2xl shadow-2xl border-2 border-blue-100 hover:border-blue-200 transition-all max-h-[calc(100vh-170px)] overflow-hidden flex flex-col">
                <div className="p-6 md:p-8 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg">
                            <Calendar className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-gray-900">Booking Form</h3>
                            <p className="text-sm text-gray-600 font-medium">Fill details to proceed</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 md:px-8 py-6 scrollbar-hide">
                    <form onSubmit={handleSubmit} className="space-y-5" id="booking-form">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
                                <Calendar className="w-4 h-4 text-blue-600" />
                                Date
                            </label>
                            <input type="date" value={selectedDate} min={today} onChange={(e) => { setSelectedDate(e.target.value); clearError('date'); }} className={`w-full px-4 py-3 border-2 ${errors.date ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-semibold transition-all hover:border-gray-300`} />
                            {errors.date && <div className="flex items-center gap-1 mt-1 text-red-600 text-xs font-semibold"><AlertCircle className="w-3 h-3" />{errors.date}</div>}
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
                                <Clock className="w-4 h-4 text-blue-600" />
                                Time slot
                            </label>
                            <select value={selectedTime} onChange={(e) => { setSelectedTime(e.target.value); clearError('time'); }} className={`w-full px-4 py-3 border-2 ${errors.time ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-semibold appearance-none cursor-pointer transition-all hover:border-gray-300 bg-white text-gray-700`}>
                                <option value="">Select time slot</option>
                                <option value="9am">9:00 AM - 10:00 AM</option>
                                <option value="10am">10:00 AM - 11:00 AM</option>
                                <option value="11am">11:00 AM - 12:00 PM</option>
                                <option value="12pm">12:00 PM - 1:00 PM</option>
                                <option value="2pm">2:00 PM - 3:00 PM</option>
                                <option value="3pm">3:00 PM - 4:00 PM</option>
                                <option value="4pm">4:00 PM - 5:00 PM</option>
                                <option value="5pm">5:00 PM - 6:00 PM</option>
                                <option value="6pm">6:00 PM - 7:00 PM</option>
                            </select>
                            {errors.time && <div className="flex items-center gap-1 mt-1 text-red-600 text-xs font-semibold"><AlertCircle className="w-3 h-3" />{errors.time}</div>}
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
                                <MapPin className="w-4 h-4 text-blue-600" />
                                Address Type
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                <button type="button" onClick={() => setAddressType('home')} className={`py-2.5 px-3 rounded-xl font-bold text-sm transition-all ${addressType === 'home' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>🏠 Home</button>
                                <button type="button" onClick={() => setAddressType('work')} className={`py-2.5 px-3 rounded-xl font-bold text-sm transition-all ${addressType === 'work' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>💼 Work</button>
                                <button type="button" onClick={() => setAddressType('other')} className={`py-2.5 px-3 rounded-xl font-bold text-sm transition-all ${addressType === 'other' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>📍 Other</button>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-bold text-gray-900 mb-2 block">Full Address</label>
                            <textarea placeholder="Enter your complete address with landmark..." value={address} onChange={(e) => { setAddress(e.target.value); clearError('address'); }} rows={3} className={`w-full px-4 py-3 border-2 ${errors.address ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-semibold resize-none transition-all hover:border-gray-300`}></textarea>
                            {errors.address && <div className="flex items-center gap-1 mt-1 text-red-600 text-xs font-semibold"><AlertCircle className="w-3 h-3" />{errors.address}</div>}
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
                                <Wrench className="w-4 h-4 text-blue-600" />
                                Service type
                            </label>
                            <select value={serviceType} onChange={(e) => { setServiceType(e.target.value); clearError('service'); }} className={`w-full px-4 py-3 border-2 ${errors.service ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-semibold appearance-none cursor-pointer transition-all hover:border-gray-300 bg-white`}>
                                <option value="">Select service type</option>
                                <option value="fan-repair">🌀 Fan Repair & Servicing</option>
                                <option value="switchboard">🔌 Switchboard Installation</option>
                                <option value="wiring">⚡ Full Wiring Check</option>
                                <option value="light">💡 Light Fitting</option>
                                <option value="appliance">🔧 Appliance Repair</option>
                                <option value="inverter">🔋 Inverter Setup</option>
                                <option value="emergency">🚨 Emergency Service</option>
                            </select>
                            {errors.service && <div className="flex items-center gap-1 mt-1 text-red-600 text-xs font-semibold"><AlertCircle className="w-3 h-3" />{errors.service}</div>}
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
                                <FileText className="w-4 h-4 text-blue-600" />
                                Issue description
                            </label>
                            <textarea placeholder="Describe your issue in detail. E.g., 'Fan making noise and rotating slowly...'" value={issueDescription} onChange={(e) => { setIssueDescription(e.target.value); clearError('description'); }} rows={4} className={`w-full px-4 py-3 border-2 ${errors.description ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-semibold resize-none transition-all hover:border-gray-300`}></textarea>
                            <div className="flex items-center justify-between mt-1">
                                {errors.description && <div className="flex items-center gap-1 text-red-600 text-xs font-semibold"><AlertCircle className="w-3 h-3" />{errors.description}</div>}
                                <span className="text-xs text-gray-500 font-medium ml-auto">{issueDescription.length}/500</span>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-5 border-2 border-blue-200 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <IndianRupee className="w-5 h-5 text-blue-600" />
                                    <span className="font-bold text-gray-900">Estimated price</span>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-black text-blue-600">₹{hourlyRate}</div>
                                    <span className="text-xs text-gray-600 font-semibold">per hour</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-600 mt-3 pt-3 border-t border-blue-200">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span className="font-medium">Final price after inspection</span>
                            </div>
                        </div>

                        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
                            <div className="flex gap-3">
                                <div className="text-2xl">💡</div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm mb-1">Quick Tips</h4>
                                    <ul className="text-xs text-gray-700 space-y-1 font-medium">
                                        <li>• Professional will call before arrival</li>
                                        <li>• Inspection fee may apply separately</li>
                                        <li>• Payment after service completion</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="p-6 md:px-8 border-t border-gray-100 bg-gray-50">
                    <button type="submit" form="booking-form" disabled={isSubmitting} className={`w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-black text-lg transition-all shadow-xl hover:shadow-2xl ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}>
                        {isSubmitting ? <span className="flex items-center justify-center gap-2"><div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>Processing...</span> : 'Proceed to Payment'}
                    </button>
                </div>
            </div>
        </div>
    );
}
