'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { getAccessToken, getStoredUser } from '@/utils/auth';
import { PriceOffer } from '@/utils/offers';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:8000';

// Event types for offer updates
export interface OfferEvent {
  type: 'new_offer' | 'offer_accepted' | 'offer_rejected' | 'offer_cancelled' | 'offer_revoked';
  offer: PriceOffer;
  message: string;
  timestamp: string;
}

// Context type
interface OfferSocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  newOffers: OfferEvent[];
  acceptedOffers: OfferEvent[];
  rejectedOffers: OfferEvent[];
  cancelledOffers: OfferEvent[];
  revokedOffers: OfferEvent[];
  clearOfferEvent: (eventId: string) => void;
  clearAllOfferEvents: () => void;
  joinOffersRoom: () => void;
  leaveOffersRoom: () => void;
}

const OfferSocketContext = createContext<OfferSocketContextType>({
  socket: null,
  isConnected: false,
  newOffers: [],
  acceptedOffers: [],
  rejectedOffers: [],
  cancelledOffers: [],
  revokedOffers: [],
  clearOfferEvent: () => {},
  clearAllOfferEvents: () => {},
  joinOffersRoom: () => {},
  leaveOffersRoom: () => {},
});

export const useOfferSocket = () => useContext(OfferSocketContext);

interface OfferSocketProviderProps {
  children: ReactNode;
}

export function OfferSocketProvider({ children }: OfferSocketProviderProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [newOffers, setNewOffers] = useState<OfferEvent[]>([]);
  const [acceptedOffers, setAcceptedOffers] = useState<OfferEvent[]>([]);
  const [rejectedOffers, setRejectedOffers] = useState<OfferEvent[]>([]);
  const [cancelledOffers, setCancelledOffers] = useState<OfferEvent[]>([]);
  const [revokedOffers, setRevokedOffers] = useState<OfferEvent[]>([]);

  useEffect(() => {
    const token = getAccessToken();
    const user = getStoredUser();

    if (!token || !user?.id) {
      return;
    }

    // Create socket connection
    const newSocket = io(SOCKET_URL, {
      auth: {
        user_id: user.id,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Connection events
    newSocket.on('connect', () => {
      console.log('Offer socket connected');
      setIsConnected(true);
      
      // Authenticate
      newSocket.emit('authenticate', { user_id: user.id });
    });

    newSocket.on('disconnect', () => {
      console.log('Offer socket disconnected');
      setIsConnected(false);
    });

    newSocket.on('authenticated', (data) => {
      console.log('Offer socket authenticated:', data);
    });

    // Offer events
    newSocket.on('new_offer', (data: OfferEvent) => {
      console.log('New offer received:', data);
      setNewOffers(prev => [...prev, data]);
      
      // Show browser notification if supported
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('New Price Offer', {
          body: data.message,
          icon: '/icon.png',
        });
      }
    });

    newSocket.on('offer_accepted', (data: OfferEvent) => {
      console.log('Offer accepted:', data);
      setAcceptedOffers(prev => [...prev, data]);
      
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Offer Accepted', {
          body: data.message,
          icon: '/icon.png',
        });
      }
    });

    newSocket.on('offer_rejected', (data: OfferEvent) => {
      console.log('Offer rejected:', data);
      setRejectedOffers(prev => [...prev, data]);
      
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Offer Rejected', {
          body: data.message,
          icon: '/icon.png',
        });
      }
    });

    newSocket.on('offer_cancelled', (data: OfferEvent) => {
      console.log('Offer cancelled:', data);
      setCancelledOffers(prev => [...prev, data]);
      
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Offer Cancelled', {
          body: data.message,
          icon: '/icon.png',
        });
      }
    });

    newSocket.on('offer_revoked', (data: OfferEvent) => {
      console.log('Offer revoked:', data);
      setRevokedOffers(prev => [...prev, data]);
      
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Offer Revoked', {
          body: data.message,
          icon: '/icon.png',
        });
      }
    });

    setSocket(newSocket);

    // Cleanup
    return () => {
      newSocket.close();
    };
  }, []);

  const clearOfferEvent = useCallback((eventId: string) => {
    setNewOffers(prev => prev.filter(e => e.offer.id !== eventId));
    setAcceptedOffers(prev => prev.filter(e => e.offer.id !== eventId));
    setRejectedOffers(prev => prev.filter(e => e.offer.id !== eventId));
    setCancelledOffers(prev => prev.filter(e => e.offer.id !== eventId));
    setRevokedOffers(prev => prev.filter(e => e.offer.id !== eventId));
  }, []);

  const clearAllOfferEvents = useCallback(() => {
    setNewOffers([]);
    setAcceptedOffers([]);
    setRejectedOffers([]);
    setCancelledOffers([]);
    setRevokedOffers([]);
  }, []);

  const joinOffersRoom = useCallback(() => {
    if (socket && isConnected) {
      socket.emit('join_offers_room', {});
      console.log('Joined offers room');
    }
  }, [socket, isConnected]);

  const leaveOffersRoom = useCallback(() => {
    if (socket && isConnected) {
      socket.emit('leave_offers_room', {});
      console.log('Left offers room');
    }
  }, [socket, isConnected]);

  return (
    <OfferSocketContext.Provider
      value={{
        socket,
        isConnected,
        newOffers,
        acceptedOffers,
        rejectedOffers,
        cancelledOffers,
        revokedOffers,
        clearOfferEvent,
        clearAllOfferEvents,
        joinOffersRoom,
        leaveOffersRoom,
      }}
    >
      {children}
    </OfferSocketContext.Provider>
  );
}
