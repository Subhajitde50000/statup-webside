'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Save,
  AlertCircle,
  CheckCircle,
  Power,
  PowerOff
} from 'lucide-react';
import ProfessionalNavbar from '../components/ProfessionalNavbar';

interface TimeSlot {
  time: string;
  available: boolean;
}

interface DayAvailability {
  date: string;
  slots: TimeSlot[];
  isFullyAvailable: boolean;
}

export default function SchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availability, setAvailability] = useState<Map<string, DayAvailability>>(new Map());
  const [hasChanges, setHasChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  // Generate time slots from 8 AM to 10 PM
  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    for (let hour = 8; hour <= 22; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00`;
      slots.push({ time, available: true });
    }
    return slots;
  };

  // Initialize default availability for a date
  const getOrCreateDayAvailability = (date: Date): DayAvailability => {
    const dateStr = formatDate(date);
    const existing = availability.get(dateStr);
    
    if (existing) return existing;
    
    return {
      date: dateStr,
      slots: generateTimeSlots(),
      isFullyAvailable: true
    };
  };

  // Format date as YYYY-MM-DD
  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  // Get calendar days for current month
  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDay.getDay();
    
    const days: (Date | null)[] = [];
    
    // Add empty slots for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  // Check if date is today
  const isToday = (date: Date | null): boolean => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Check if date is selected
  const isSelectedDate = (date: Date | null): boolean => {
    if (!date) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  // Check if date is in the past
  const isPastDate = (date: Date | null): boolean => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate < today;
  };

  // Get availability status for a date
  const getDateAvailabilityStatus = (date: Date): 'available' | 'partial' | 'unavailable' => {
    const dateStr = formatDate(date);
    const dayAvail = availability.get(dateStr);
    
    if (!dayAvail) return 'available';
    
    const availableSlots = dayAvail.slots.filter(s => s.available).length;
    const totalSlots = dayAvail.slots.length;
    
    if (availableSlots === totalSlots) return 'available';
    if (availableSlots === 0) return 'unavailable';
    return 'partial';
  };

  // Toggle single time slot
  const toggleTimeSlot = (time: string) => {
    const dateStr = formatDate(selectedDate);
    const dayAvail = getOrCreateDayAvailability(selectedDate);
    
    const updatedSlots = dayAvail.slots.map(slot =>
      slot.time === time ? { ...slot, available: !slot.available } : slot
    );
    
    const availableCount = updatedSlots.filter(s => s.available).length;
    
    const newAvailability = new Map(availability);
    newAvailability.set(dateStr, {
      ...dayAvail,
      slots: updatedSlots,
      isFullyAvailable: availableCount === updatedSlots.length
    });
    
    setAvailability(newAvailability);
    setHasChanges(true);
  };

  // Mark entire day as available/unavailable
  const setDayAvailability = (available: boolean) => {
    const dateStr = formatDate(selectedDate);
    const dayAvail = getOrCreateDayAvailability(selectedDate);
    
    const updatedSlots = dayAvail.slots.map(slot => ({
      ...slot,
      available
    }));
    
    const newAvailability = new Map(availability);
    newAvailability.set(dateStr, {
      ...dayAvail,
      slots: updatedSlots,
      isFullyAvailable: available
    });
    
    setAvailability(newAvailability);
    setHasChanges(true);
  };

  // Navigate months
  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Save availability changes
  const saveChanges = async () => {
    setSaveStatus('saving');
    
    try {
      // TODO: Implement API call to save availability
      // const token = localStorage.getItem('access_token');
      // await fetch('http://localhost:8000/api/professionals/availability', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(Array.from(availability.values()))
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaveStatus('success');
      setHasChanges(false);
      
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Error saving availability:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const calendarDays = getCalendarDays();
  const selectedDayAvailability = getOrCreateDayAvailability(selectedDate);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <ProfessionalNavbar
       activeTab="schedule" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-teal-600 to-green-600 rounded-xl shadow-lg">
              <CalendarIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Schedule</h1>
              <p className="text-gray-600">Manage your availability and time slots</p>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        {hasChanges && (
          <div className="mb-6 bg-yellow-50 border-2 border-yellow-400 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
              <div>
                <p className="font-bold text-yellow-900">You have unsaved changes</p>
                <p className="text-sm text-yellow-700">Save your availability updates to make them active</p>
              </div>
            </div>
            <button
              onClick={saveChanges}
              disabled={saveStatus === 'saving'}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-green-600 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}

        {/* Success/Error Messages */}
        {saveStatus === 'success' && (
          <div className="mb-6 bg-green-50 border-2 border-green-400 rounded-xl p-4 flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <p className="font-bold text-green-900">Availability saved successfully!</p>
          </div>
        )}

        {saveStatus === 'error' && (
          <div className="mb-6 bg-red-50 border-2 border-red-400 rounded-xl p-4 flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <p className="font-bold text-red-900">Failed to save availability. Please try again.</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calendar Section */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={previousMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-700" />
                </button>
                <h2 className="text-2xl font-bold text-gray-900">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <button
                  onClick={nextMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-6 h-6 text-gray-700" />
                </button>
              </div>

              {/* Day names */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {dayNames.map(day => (
                  <div key={day} className="text-center text-sm font-bold text-gray-600 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((date, index) => {
                  if (!date) {
                    return <div key={`empty-${index}`} className="aspect-square" />;
                  }

                  const isPast = isPastDate(date);
                  const status = getDateAvailabilityStatus(date);
                  
                  let bgColor = 'bg-white hover:bg-gray-50';
                  let borderColor = 'border-gray-200';
                  let dotColor = '';

                  if (isSelectedDate(date)) {
                    bgColor = 'bg-gradient-to-br from-teal-600 to-green-600';
                    borderColor = 'border-teal-600';
                  } else if (isPast) {
                    bgColor = 'bg-gray-100';
                    borderColor = 'border-gray-300';
                  } else {
                    if (status === 'unavailable') {
                      dotColor = 'bg-red-500';
                    } else if (status === 'partial') {
                      dotColor = 'bg-yellow-500';
                    } else {
                      dotColor = 'bg-green-500';
                    }
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => !isPast && setSelectedDate(date)}
                      disabled={isPast}
                      className={`aspect-square border-2 rounded-xl flex flex-col items-center justify-center transition-all ${bgColor} ${borderColor} ${
                        isPast ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                      } ${isToday(date) ? 'ring-2 ring-blue-500' : ''}`}
                    >
                      <span className={`text-sm font-bold ${
                        isSelectedDate(date) ? 'text-white' : 'text-gray-900'
                      }`}>
                        {date.getDate()}
                      </span>
                      {!isPast && !isSelectedDate(date) && dotColor && (
                        <div className={`w-2 h-2 rounded-full mt-1 ${dotColor}`} />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-6 pt-6 border-t-2 border-gray-100 space-y-2">
                <p className="text-sm font-bold text-gray-700 mb-3">Legend:</p>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-sm text-gray-600">Fully Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="text-sm text-gray-600">Partially Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-sm text-gray-600">Unavailable</span>
                </div>
              </div>
            </div>
          </div>

          {/* Time Slots Section */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {isToday(selectedDate) ? 'Today' : isPastDate(selectedDate) ? 'Past Date (Read Only)' : 'Click time slots to toggle availability'}
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              {!isPastDate(selectedDate) && (
                <div className="flex gap-3 mb-6">
                  <button
                    onClick={() => setDayAvailability(true)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-50 text-green-700 font-bold rounded-xl hover:bg-green-100 transition-colors border-2 border-green-200"
                  >
                    <Power className="w-5 h-5" />
                    Mark Day Available
                  </button>
                  <button
                    onClick={() => setDayAvailability(false)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-700 font-bold rounded-xl hover:bg-red-100 transition-colors border-2 border-red-200"
                  >
                    <PowerOff className="w-5 h-5" />
                    Mark Day Offline
                  </button>
                </div>
              )}

              {/* Time Slots Grid */}
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                {selectedDayAvailability.slots.map((slot) => {
                  const hour = parseInt(slot.time.split(':')[0]);
                  const displayTime = hour === 0 ? '12:00 AM' :
                                     hour === 12 ? '12:00 PM' :
                                     hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`;

                  return (
                    <button
                      key={slot.time}
                      onClick={() => !isPastDate(selectedDate) && toggleTimeSlot(slot.time)}
                      disabled={isPastDate(selectedDate)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                        slot.available
                          ? 'bg-green-50 border-green-200 hover:bg-green-100'
                          : 'bg-red-50 border-red-200 hover:bg-red-100'
                      } ${isPastDate(selectedDate) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div className="flex items-center gap-3">
                        <Clock className={`w-5 h-5 ${slot.available ? 'text-green-600' : 'text-red-600'}`} />
                        <span className={`font-bold ${slot.available ? 'text-green-900' : 'text-red-900'}`}>
                          {displayTime}
                        </span>
                      </div>
                      <span className={`text-sm font-bold px-3 py-1 rounded-lg ${
                        slot.available
                          ? 'bg-green-200 text-green-800'
                          : 'bg-red-200 text-red-800'
                      }`}>
                        {slot.available ? 'Available' : 'Offline'}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Summary */}
              <div className="mt-6 pt-6 border-t-2 border-gray-100">
                <div className="bg-gradient-to-r from-teal-50 to-green-50 rounded-xl p-4 border-2 border-teal-200">
                  <p className="text-sm text-gray-700 mb-2">
                    <span className="font-bold">Available Slots:</span>{' '}
                    {selectedDayAvailability.slots.filter(s => s.available).length} of {selectedDayAvailability.slots.length}
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-teal-600 to-green-600 h-full transition-all"
                      style={{
                        width: `${(selectedDayAvailability.slots.filter(s => s.available).length / selectedDayAvailability.slots.length) * 100}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
          <div className="flex gap-4">
            <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0" />
            <div className="space-y-2">
              <p className="font-bold text-blue-900">How to use your schedule:</p>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>Click any future date on the calendar to view and edit time slots</li>
                <li>Toggle individual time slots or use quick actions to mark entire days</li>
                <li>Green indicates you&apos;re available, red means offline</li>
                <li>Don&apos;t forget to save your changes!</li>
                <li>Past dates cannot be modified</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
