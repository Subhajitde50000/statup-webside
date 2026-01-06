'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { getAccessToken, getStoredUser } from '@/utils/auth';
import { Booking } from '@/utils/bookings';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:8000';

// Booking status types
export type BookingStatus = 'pending' | 'confirmed' | 'accepted' | 'ongoing' | 'completed' | 'cancelled';

// Event types for booking updates
export interface BookingStatusEvent {
  booking_id: string;
  status: BookingStatus;
  message?: string;
  booking?: Booking;
  timestamp: string;
}

export interface OTPRequestEvent {
  booking_id: string;
  message: string;
  otp: string;
  timestamp: string;
}

export interface BookingCancelledEvent {
  booking_id: string;
  cancelled_by: 'user' | 'professional';
  reason?: string;
  message: string;
  timestamp: string;
}

interface BookingSocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  
  // Current booking state
  currentBookingStatus: BookingStatus | null;
  currentBookingOTP: string | null;
  otpRequested: boolean;
  
  // Event handlers
  onBookingConfirmed: ((event: BookingStatusEvent) => void) | null;
  onBookingAccepted: ((event: BookingStatusEvent) => void) | null;
  onOTPRequested: ((event: OTPRequestEvent) => void) | null;
  onWorkStarted: ((event: BookingStatusEvent) => void) | null;
  onWorkCompleted: ((event: BookingStatusEvent) => void) | null;
  onBookingCancelled: ((event: BookingCancelledEvent) => void) | null;
  
  // Actions
  joinBookingRoom: (bookingId: string) => void;
  leaveBookingRoom: (bookingId: string) => void;
  setBookingEventHandlers: (handlers: BookingEventHandlers) => void;
  clearBookingState: () => void;
}

interface BookingEventHandlers {
  onBookingConfirmed?: (event: BookingStatusEvent) => void;
  onBookingAccepted?: (event: BookingStatusEvent) => void;
  onOTPRequested?: (event: OTPRequestEvent) => void;
  onWorkStarted?: (event: BookingStatusEvent) => void;
  onWorkCompleted?: (event: BookingStatusEvent) => void;
  onBookingCancelled?: (event: BookingCancelledEvent) => void;
}

const BookingSocketContext = createContext<BookingSocketContextType | undefined>(undefined);

export function BookingSocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentBookingStatus, setCurrentBookingStatus] = useState<BookingStatus | null>(null);
  const [currentBookingOTP, setCurrentBookingOTP] = useState<string | null>(null);
  const [otpRequested, setOtpRequested] = useState(false);
  
  // Event handler refs
  const [handlers, setHandlers] = useState<BookingEventHandlers>({});

  // Initialize Socket.IO connection
  useEffect(() => {
    const token = getAccessToken();
    const user = getStoredUser();
    
    if (!token || !user) {
      return;
    }

    // Create socket connection
    const newSocket = io(SOCKET_URL, {
      transports: ['polling', 'websocket'],
      upgrade: true,
      auth: {
        user_id: user.id,
        token: token
      },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
      forceNew: true,
    });

    newSocket.on('connect', () => {
      console.log('Booking Socket connected');
      setIsConnected(true);
      
      // Authenticate after connection
      newSocket.emit('authenticate', { user_id: user.id });
    });

    newSocket.on('disconnect', () => {
      console.log('Booking Socket disconnected');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (err) => {
      console.error('Booking Socket connection error:', err);
    });

    // Handle booking confirmed event
    newSocket.on('booking_confirmed', (event: BookingStatusEvent) => {
      console.log('Booking confirmed:', event);
      setCurrentBookingStatus('confirmed');
      handlers.onBookingConfirmed?.(event);
      showNotification('Booking Confirmed', event.message || 'Your booking has been confirmed');
    });

    // Handle booking accepted event
    newSocket.on('booking_accepted', (event: BookingStatusEvent) => {
      console.log('Booking accepted:', event);
      setCurrentBookingStatus('accepted');
      handlers.onBookingAccepted?.(event);
      showNotification('Booking Accepted', event.message || 'Professional has accepted your booking');
    });

    // Handle OTP requested event
    newSocket.on('otp_requested', (event: OTPRequestEvent) => {
      console.log('OTP requested:', event);
      setCurrentBookingOTP(event.otp);
      setOtpRequested(true);
      handlers.onOTPRequested?.(event);
      showNotification('OTP Request', event.message || 'Professional has arrived. Please share the OTP.');
    });

    // Handle work started event
    newSocket.on('work_started', (event: BookingStatusEvent) => {
      console.log('Work started:', event);
      setCurrentBookingStatus('ongoing');
      setOtpRequested(false);
      handlers.onWorkStarted?.(event);
      showNotification('Work Started', event.message || 'Work has started on your booking');
    });

    // Handle work completed event
    newSocket.on('work_completed', (event: BookingStatusEvent) => {
      console.log('Work completed:', event);
      setCurrentBookingStatus('completed');
      handlers.onWorkCompleted?.(event);
      showNotification('Work Completed', event.message || 'Work has been completed');
    });

    // Handle booking cancelled event
    newSocket.on('booking_cancelled', (event: BookingCancelledEvent) => {
      console.log('Booking cancelled:', event);
      setCurrentBookingStatus('cancelled');
      handlers.onBookingCancelled?.(event);
      showNotification('Booking Cancelled', event.message || 'Booking has been cancelled');
    });

    // Handle booking status update (generic)
    newSocket.on('booking_status_update', (event: BookingStatusEvent) => {
      console.log('Booking status update:', event);
      setCurrentBookingStatus(event.status);
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.close();
    };
  }, []);

  // Update handlers when they change
  useEffect(() => {
    if (!socket) return;

    // Re-register event handlers with new callbacks
    socket.off('booking_confirmed');
    socket.off('booking_accepted');
    socket.off('otp_requested');
    socket.off('work_started');
    socket.off('work_completed');
    socket.off('booking_cancelled');

    socket.on('booking_confirmed', (event: BookingStatusEvent) => {
      setCurrentBookingStatus('confirmed');
      handlers.onBookingConfirmed?.(event);
    });

    socket.on('booking_accepted', (event: BookingStatusEvent) => {
      setCurrentBookingStatus('accepted');
      handlers.onBookingAccepted?.(event);
    });

    socket.on('otp_requested', (event: OTPRequestEvent) => {
      setCurrentBookingOTP(event.otp);
      setOtpRequested(true);
      handlers.onOTPRequested?.(event);
    });

    socket.on('work_started', (event: BookingStatusEvent) => {
      setCurrentBookingStatus('ongoing');
      setOtpRequested(false);
      handlers.onWorkStarted?.(event);
    });

    socket.on('work_completed', (event: BookingStatusEvent) => {
      setCurrentBookingStatus('completed');
      handlers.onWorkCompleted?.(event);
    });

    socket.on('booking_cancelled', (event: BookingCancelledEvent) => {
      setCurrentBookingStatus('cancelled');
      handlers.onBookingCancelled?.(event);
    });
  }, [socket, handlers]);

  const joinBookingRoom = useCallback((bookingId: string) => {
    if (socket && isConnected) {
      socket.emit('join_booking_room', { booking_id: bookingId });
      console.log(`Joined booking room: ${bookingId}`);
    }
  }, [socket, isConnected]);

  const leaveBookingRoom = useCallback((bookingId: string) => {
    if (socket && isConnected) {
      socket.emit('leave_booking_room', { booking_id: bookingId });
      console.log(`Left booking room: ${bookingId}`);
    }
  }, [socket, isConnected]);

  const setBookingEventHandlers = useCallback((newHandlers: BookingEventHandlers) => {
    setHandlers(newHandlers);
  }, []);

  const clearBookingState = useCallback(() => {
    setCurrentBookingStatus(null);
    setCurrentBookingOTP(null);
    setOtpRequested(false);
  }, []);

  return (
    <BookingSocketContext.Provider
      value={{
        socket,
        isConnected,
        currentBookingStatus,
        currentBookingOTP,
        otpRequested,
        onBookingConfirmed: handlers.onBookingConfirmed || null,
        onBookingAccepted: handlers.onBookingAccepted || null,
        onOTPRequested: handlers.onOTPRequested || null,
        onWorkStarted: handlers.onWorkStarted || null,
        onWorkCompleted: handlers.onWorkCompleted || null,
        onBookingCancelled: handlers.onBookingCancelled || null,
        joinBookingRoom,
        leaveBookingRoom,
        setBookingEventHandlers,
        clearBookingState,
      }}
    >
      {children}
    </BookingSocketContext.Provider>
  );
}

export function useBookingSocket() {
  const context = useContext(BookingSocketContext);
  if (context === undefined) {
    throw new Error('useBookingSocket must be used within a BookingSocketProvider');
  }
  return context;
}

// Helper function to show browser notifications
function showNotification(title: string, body: string) {
  if ('Notification' in window && window.Notification.permission === 'granted') {
    new window.Notification(title, {
      body,
      icon: '/favicon.ico',
    });
  }
  
  // Also play a sound
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  } catch (error) {
    console.log('Could not play notification sound');
  }
}

// Hook for subscribing to a specific booking's updates
export function useBookingUpdates(bookingId: string | null) {
  const { 
    joinBookingRoom, 
    leaveBookingRoom, 
    currentBookingStatus,
    currentBookingOTP,
    otpRequested,
    setBookingEventHandlers,
    isConnected
  } = useBookingSocket();
  
  const [status, setStatus] = useState<BookingStatus | null>(null);
  const [otp, setOtp] = useState<string | null>(null);
  const [otpPending, setOtpPending] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    if (bookingId && isConnected) {
      joinBookingRoom(bookingId);
      
      // Set up event handlers for this booking
      setBookingEventHandlers({
        onBookingAccepted: (event) => {
          if (event.booking_id === bookingId) {
            setStatus('accepted');
            setLastUpdate(new Date());
          }
        },
        onOTPRequested: (event) => {
          if (event.booking_id === bookingId) {
            setOtp(event.otp);
            setOtpPending(true);
            setLastUpdate(new Date());
          }
        },
        onWorkStarted: (event) => {
          if (event.booking_id === bookingId) {
            setStatus('ongoing');
            setOtpPending(false);
            setLastUpdate(new Date());
          }
        },
        onWorkCompleted: (event) => {
          if (event.booking_id === bookingId) {
            setStatus('completed');
            setLastUpdate(new Date());
          }
        },
        onBookingCancelled: (event) => {
          if (event.booking_id === bookingId) {
            setStatus('cancelled');
            setLastUpdate(new Date());
          }
        },
      });
      
      return () => {
        leaveBookingRoom(bookingId);
      };
    }
  }, [bookingId, isConnected, joinBookingRoom, leaveBookingRoom, setBookingEventHandlers]);

  // Sync with context state
  useEffect(() => {
    if (currentBookingStatus) {
      setStatus(currentBookingStatus);
    }
    if (currentBookingOTP) {
      setOtp(currentBookingOTP);
    }
    setOtpPending(otpRequested);
  }, [currentBookingStatus, currentBookingOTP, otpRequested]);

  return {
    status,
    otp,
    otpPending,
    lastUpdate,
    isConnected,
  };
}
