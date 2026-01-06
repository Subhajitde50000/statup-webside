/**
 * Messages and Conversations API Utility Functions
 * Real-time messaging between users and professionals
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Get access token from localStorage
function getAccessToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
}

// API request helper
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAccessToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(error.detail || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}

// ============================================
// TYPES
// ============================================

export type MessageType = 'text' | 'image' | 'location' | 'system';
export type MessageStatus = 'sent' | 'delivered' | 'seen';
export type ConversationStatus = 'active' | 'archived' | 'closed';
export type ParticipantRole = 'user' | 'professional';

export interface Participant {
  user_id: string;
  role: ParticipantRole;
  user_type?: 'user' | 'professional'; // Alias for role
  name: string;
  photo?: string;
  phone?: string;
  is_online: boolean;
  last_seen?: string;
  unread_count: number;
  is_muted: boolean;
  rating?: number;
  profession?: string;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
  label?: string;
}

export interface ImageData {
  url: string;
  thumbnail_url?: string;
  width?: number;
  height?: number;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_role: ParticipantRole;
  message_type: MessageType;
  content: string;
  status: MessageStatus;
  image_data?: ImageData;
  location_data?: LocationData;
  reply_to_message_id?: string;
  is_deleted: boolean;
  created_at: string;
  delivered_at?: string;
  seen_at?: string;
  edited_at?: string;
  sender_name?: string;
  sender_photo?: string;
}

export interface BookingReference {
  booking_id: string;
  service_name: string;
  service_type: string;
  scheduled_date: string;
  scheduled_time: string;
  status: string;
  price: number;
  address?: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  professional_id: string;
  participants: Participant[];
  booking_id?: string;
  booking_reference?: BookingReference;
  status: ConversationStatus;
  last_message?: string; // Display text of last message
  last_message_content?: string;
  last_message_type?: MessageType;
  last_message_sender_id?: string;
  last_message_status?: MessageStatus;
  last_message_at?: string;
  is_priority: boolean;
  priority_text?: string;
  service_badge?: string;
  service_badge_color?: string;
  unread_count: number;
  created_at: string;
  updated_at: string;
  other_participant?: Participant;
}

// ============================================
// REQUEST TYPES
// ============================================

export interface SendMessageRequest {
  conversation_id?: string;
  receiver_id: string;
  message_type?: MessageType;
  content: string;
  image_url?: string;
  image_thumbnail?: string;
  latitude?: number;
  longitude?: number;
  location_address?: string;
  booking_id?: string;
  reply_to_message_id?: string;
}

export interface StartConversationRequest {
  professional_id: string;
  booking_id?: string;
  initial_message?: string;
}

// ============================================
// SOCKET EVENT TYPES
// ============================================

export interface NewMessageEvent {
  conversation_id: string;
  message_id: string;
  sender_id: string;
  content: string;
  message_type: MessageType;
  created_at: string;
  message: Message;
}

export interface MessageStatusEvent {
  conversation_id: string;
  message_id: string;
  status: MessageStatus;
  updated_at: string;
}

export interface TypingEvent {
  conversation_id: string;
  user_id: string;
  is_typing: boolean;
}

// ============================================
// RESPONSE TYPES
// ============================================

// Wrapper type for consistent API responses
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ConversationListResponse {
  conversations: Conversation[];
  total: number;
  unread_total: number;
  skip: number;
  limit: number;
}

export interface MessagesListResponse {
  messages: Message[];
  conversation: Conversation;
  total: number;
  has_more: boolean;
  skip: number;
  limit: number;
}

export interface SendMessageResponse {
  message: string;
  data: Message;
  conversation_id: string;
}

export interface ConversationDetailResponse {
  conversation: Conversation;
  messages: Message[];
  total_messages: number;
  booking?: any;
}

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Get all conversations for the current user
 */
export async function getConversations(params?: {
  status?: string;
  booking_status?: string;
  search?: string;
  skip?: number;
  limit?: number;
}): Promise<ApiResponse<Conversation[]>> {
  try {
    const searchParams = new URLSearchParams();
    
    if (params?.status) searchParams.append('status', params.status);
    if (params?.booking_status) searchParams.append('booking_status', params.booking_status);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.skip !== undefined) searchParams.append('skip', String(params.skip));
    if (params?.limit !== undefined) searchParams.append('limit', String(params.limit));
    
    const queryString = searchParams.toString();
    const response = await apiRequest<ConversationListResponse>(`/messages/conversations${queryString ? `?${queryString}` : ''}`);
    
    // Add user_type to participants (alias for role)
    const conversations = response.conversations.map(conv => ({
      ...conv,
      last_message: conv.last_message_content,
      participants: conv.participants.map(p => ({
        ...p,
        user_type: p.role as 'user' | 'professional'
      }))
    }));
    
    return { success: true, data: conversations };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch conversations' };
  }
}

/**
 * Get conversation details with messages
 */
export async function getConversationDetail(
  conversationId: string,
  messagesLimit?: number
): Promise<ApiResponse<ConversationDetailResponse>> {
  try {
    const params = messagesLimit ? `?messages_limit=${messagesLimit}` : '';
    const response = await apiRequest<ConversationDetailResponse>(`/messages/conversations/${conversationId}${params}`);
    
    // Add user_type to participants
    if (response.conversation?.participants) {
      response.conversation.participants = response.conversation.participants.map(p => ({
        ...p,
        user_type: p.role as 'user' | 'professional'
      }));
    }
    
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch conversation' };
  }
}

/**
 * Start a new conversation with a professional
 */
export async function startConversation(
  data: StartConversationRequest
): Promise<Conversation> {
  return apiRequest<Conversation>('/messages/conversations/start', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Get messages for a conversation with pagination
 */
export async function getMessages(
  conversationId: string,
  params?: {
    skip?: number;
    limit?: number;
    before_id?: string;
  }
): Promise<MessagesListResponse> {
  const searchParams = new URLSearchParams();
  
  if (params?.skip !== undefined) searchParams.append('skip', String(params.skip));
  if (params?.limit !== undefined) searchParams.append('limit', String(params.limit));
  if (params?.before_id) searchParams.append('before_id', params.before_id);
  
  const queryString = searchParams.toString();
  return apiRequest<MessagesListResponse>(
    `/messages/conversations/${conversationId}/messages${queryString ? `?${queryString}` : ''}`
  );
}

/**
 * Send a new message
 */
export async function sendMessage(data: SendMessageRequest): Promise<SendMessageResponse> {
  return apiRequest<SendMessageResponse>('/messages/messages/send', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Update message status (delivered/seen)
 */
export async function updateMessageStatus(
  messageId: string,
  status: MessageStatus
): Promise<{ message: string; status: string }> {
  return apiRequest<{ message: string; status: string }>(
    `/messages/messages/${messageId}/status?status=${status}`,
    { method: 'PUT' }
  );
}

/**
 * Mark all messages in a conversation as read
 */
export async function markConversationRead(
  conversationId: string
): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(
    `/messages/conversations/${conversationId}/mark-read`,
    { method: 'POST' }
  );
}

/**
 * Delete a message (soft delete)
 */
export async function deleteMessage(messageId: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/messages/messages/${messageId}`, {
    method: 'DELETE',
  });
}

/**
 * Edit a message
 */
export async function editMessage(
  messageId: string,
  content: string
): Promise<Message> {
  return apiRequest<Message>(`/messages/messages/${messageId}/edit`, {
    method: 'PUT',
    body: JSON.stringify({ content }),
  });
}

/**
 * Send typing indicator
 */
export async function sendTypingIndicator(
  conversationId: string,
  isTyping: boolean
): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(
    `/messages/conversations/${conversationId}/typing?is_typing=${isTyping}`,
    { method: 'POST' }
  );
}

/**
 * Mute/unmute a conversation
 */
export async function muteConversation(
  conversationId: string,
  mute: boolean
): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(
    `/messages/conversations/${conversationId}/mute?mute=${mute}`,
    { method: 'PUT' }
  );
}

/**
 * Archive a conversation
 */
export async function archiveConversation(
  conversationId: string
): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(
    `/messages/conversations/${conversationId}/archive`,
    { method: 'PUT' }
  );
}

/**
 * Get total unread message count
 */
export async function getUnreadCount(): Promise<{ unread_count: number }> {
  return apiRequest<{ unread_count: number }>('/messages/conversations/unread-count');
}

// ============================================
// SOCKET EVENT TYPES
// ============================================

export interface NewMessageEvent {
  message: Message;
  conversation_id: string;
  sender_id: string;
  timestamp: string;
}

export interface MessageStatusEvent {
  message_id: string;
  conversation_id: string;
  status: MessageStatus;
  timestamp: string;
}

export interface TypingEvent {
  conversation_id: string;
  user_id: string;
  user_name: string;
  is_typing: boolean;
  timestamp: string;
}

export interface UserOnlineStatusEvent {
  user_id: string;
  is_online: boolean;
  last_seen?: string;
  timestamp: string;
}
