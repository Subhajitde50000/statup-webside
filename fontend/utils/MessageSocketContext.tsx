'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { 
  Message, 
  Conversation, 
  NewMessageEvent, 
  MessageStatusEvent, 
  TypingEvent, 
  UserOnlineStatusEvent 
} from './messages';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:8000';

interface MessageSocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  
  // Join/leave conversation rooms
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
  
  // Typing indicator
  emitTyping: (conversationId: string, isTyping: boolean) => void;
  
  // Message seen
  emitMessageSeen: (messageId: string, conversationId: string) => void;
  
  // Event listeners
  onNewMessage: (callback: (event: NewMessageEvent) => void) => () => void;
  onMessageStatusChange: (callback: (event: MessageStatusEvent) => void) => () => void;
  onTyping: (callback: (event: TypingEvent) => void) => () => void;
  onUserOnlineStatus: (callback: (event: UserOnlineStatusEvent) => void) => () => void;
  
  // Active conversation tracking
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  
  // Online users
  onlineUsers: Set<string>;
  isUserOnline: (userId: string) => boolean;
  
  // Current user info
  getCurrentUserId: () => string;
}

const MessageSocketContext = createContext<MessageSocketContextType | null>(null);

export function MessageSocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  
  // Event listener refs to prevent memory leaks
  const messageListenersRef = useRef<Set<(event: NewMessageEvent) => void>>(new Set());
  const statusListenersRef = useRef<Set<(event: MessageStatusEvent) => void>>(new Set());
  const typingListenersRef = useRef<Set<(event: TypingEvent) => void>>(new Set());
  const onlineStatusListenersRef = useRef<Set<(event: UserOnlineStatusEvent) => void>>(new Set());
  
  // Helper to get user_id from localStorage (direct or from user object)
  const getUserIdFromStorage = (): string | null => {
    if (typeof window === 'undefined') return null;
    
    // Try direct user_id first
    let userId = localStorage.getItem('user_id');
    if (userId) return userId;
    
    // Fallback: get from stored user object
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user?.id) {
          // Store it for future use
          localStorage.setItem('user_id', user.id);
          if (user.name) localStorage.setItem('user_name', user.name);
          return user.id;
        }
      } catch (e) {
        console.error('Error parsing user from localStorage:', e);
      }
    }
    return null;
  };

  // Initialize socket connection
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    const userId = getUserIdFromStorage();
    
    if (!userId) return;
    
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      auth: { user_id: userId },
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    
    newSocket.on('connect', () => {
      console.log('Message socket connected');
      setIsConnected(true);
      
      // Authenticate after connection
      newSocket.emit('authenticate', { user_id: userId });
    });
    
    newSocket.on('disconnect', () => {
      console.log('Message socket disconnected');
      setIsConnected(false);
    });
    
    newSocket.on('authenticated', (data) => {
      console.log('Message socket authenticated:', data);
    });
    
    // Handle new message events
    newSocket.on('new_message', (event: NewMessageEvent) => {
      console.log('New message received:', event);
      messageListenersRef.current.forEach(listener => listener(event));
    });
    
    // Handle message status changes
    newSocket.on('message_status_changed', (event: MessageStatusEvent) => {
      console.log('Message status changed:', event);
      statusListenersRef.current.forEach(listener => listener(event));
    });
    
    // Handle typing indicators
    newSocket.on('user_typing', (event: TypingEvent) => {
      typingListenersRef.current.forEach(listener => listener(event));
    });
    
    // Handle user online status
    newSocket.on('user_online_status', (event: UserOnlineStatusEvent) => {
      console.log('User online status:', event);
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        if (event.is_online) {
          newSet.add(event.user_id);
        } else {
          newSet.delete(event.user_id);
        }
        return newSet;
      });
      onlineStatusListenersRef.current.forEach(listener => listener(event));
    });
    
    // Handle joined conversation confirmation
    newSocket.on('joined_conversation', (data) => {
      console.log('Joined conversation:', data);
    });
    
    setSocket(newSocket);
    
    return () => {
      newSocket.close();
      setSocket(null);
      setIsConnected(false);
    };
  }, []);
  
  // Join conversation room
  const joinConversation = useCallback((conversationId: string) => {
    if (socket && isConnected) {
      socket.emit('join_conversation', { conversation_id: conversationId });
      setActiveConversationId(conversationId);
    }
  }, [socket, isConnected]);
  
  // Leave conversation room
  const leaveConversation = useCallback((conversationId: string) => {
    if (socket && isConnected) {
      socket.emit('leave_conversation', { conversation_id: conversationId });
      if (activeConversationId === conversationId) {
        setActiveConversationId(null);
      }
    }
  }, [socket, isConnected, activeConversationId]);
  
  // Emit typing indicator
  const emitTyping = useCallback((conversationId: string, isTyping: boolean) => {
    if (socket && isConnected) {
      const userName = typeof window !== 'undefined' ? localStorage.getItem('user_name') : 'User';
      socket.emit('typing', { 
        conversation_id: conversationId, 
        is_typing: isTyping,
        user_name: userName 
      });
    }
  }, [socket, isConnected]);
  
  // Emit message seen
  const emitMessageSeen = useCallback((messageId: string, conversationId: string) => {
    if (socket && isConnected) {
      socket.emit('message_seen', { 
        message_id: messageId, 
        conversation_id: conversationId 
      });
    }
  }, [socket, isConnected]);
  
  // Event listener registration
  const onNewMessage = useCallback((callback: (event: NewMessageEvent) => void) => {
    messageListenersRef.current.add(callback);
    return () => {
      messageListenersRef.current.delete(callback);
    };
  }, []);
  
  const onMessageStatusChange = useCallback((callback: (event: MessageStatusEvent) => void) => {
    statusListenersRef.current.add(callback);
    return () => {
      statusListenersRef.current.delete(callback);
    };
  }, []);
  
  const onTyping = useCallback((callback: (event: TypingEvent) => void) => {
    typingListenersRef.current.add(callback);
    return () => {
      typingListenersRef.current.delete(callback);
    };
  }, []);
  
  const onUserOnlineStatus = useCallback((callback: (event: UserOnlineStatusEvent) => void) => {
    onlineStatusListenersRef.current.add(callback);
    return () => {
      onlineStatusListenersRef.current.delete(callback);
    };
  }, []);
  
  // Check if user is online
  const isUserOnline = useCallback((userId: string) => {
    return onlineUsers.has(userId);
  }, [onlineUsers]);
  
  // Get current user ID
  const getCurrentUserId = useCallback(() => {
    if (typeof window === 'undefined') return '';
    
    // Try direct user_id first
    let userId = localStorage.getItem('user_id');
    if (userId) return userId;
    
    // Fallback: get from stored user object
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user?.id) {
          // Store it for future use
          localStorage.setItem('user_id', user.id);
          return user.id;
        }
      } catch (e) {
        console.error('Error parsing user from localStorage:', e);
      }
    }
    return '';
  }, []);
  
  const value: MessageSocketContextType = {
    socket,
    isConnected,
    joinConversation,
    leaveConversation,
    emitTyping,
    emitMessageSeen,
    onNewMessage,
    onMessageStatusChange,
    onTyping,
    onUserOnlineStatus,
    activeConversationId,
    setActiveConversationId,
    onlineUsers,
    isUserOnline,
    getCurrentUserId,
  };
  
  return (
    <MessageSocketContext.Provider value={value}>
      {children}
    </MessageSocketContext.Provider>
  );
}

export function useMessageSocket() {
  const context = useContext(MessageSocketContext);
  if (!context) {
    throw new Error('useMessageSocket must be used within a MessageSocketProvider');
  }
  return context;
}

export default MessageSocketContext;
