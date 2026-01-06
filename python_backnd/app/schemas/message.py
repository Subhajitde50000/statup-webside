"""
Message and Conversation schemas for API requests/responses
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


# ============================================
# ENUMS
# ============================================

class MessageType(str, Enum):
    TEXT = "text"
    IMAGE = "image"
    LOCATION = "location"
    SYSTEM = "system"


class MessageStatus(str, Enum):
    SENT = "sent"
    DELIVERED = "delivered"
    SEEN = "seen"


class ConversationStatus(str, Enum):
    ACTIVE = "active"
    ARCHIVED = "archived"
    CLOSED = "closed"


class ParticipantRole(str, Enum):
    USER = "user"
    PROFESSIONAL = "professional"


# ============================================
# REQUEST SCHEMAS
# ============================================

class SendMessageRequest(BaseModel):
    """Request to send a new message"""
    conversation_id: Optional[str] = None  # If not provided, create new conversation
    receiver_id: str
    message_type: MessageType = MessageType.TEXT
    content: str
    
    # For image messages
    image_url: Optional[str] = None
    image_thumbnail: Optional[str] = None
    
    # For location messages
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    location_address: Optional[str] = None
    
    # For booking-related conversations
    booking_id: Optional[str] = None
    
    # Reply to specific message
    reply_to_message_id: Optional[str] = None


class StartConversationRequest(BaseModel):
    """Request to start a new conversation"""
    professional_id: str
    booking_id: Optional[str] = None
    initial_message: Optional[str] = None


class UpdateMessageStatusRequest(BaseModel):
    """Request to update message status"""
    message_ids: List[str]
    status: MessageStatus


class TypingIndicatorRequest(BaseModel):
    """Request to send typing indicator"""
    conversation_id: str
    is_typing: bool


class EditMessageRequest(BaseModel):
    """Request to edit a message"""
    content: str


# ============================================
# RESPONSE SCHEMAS
# ============================================

class ParticipantResponse(BaseModel):
    """Participant information in response"""
    user_id: str
    role: str
    name: str
    photo: Optional[str] = None
    phone: Optional[str] = None
    is_online: bool = False
    last_seen: Optional[str] = None
    unread_count: int = 0
    is_muted: bool = False


class LocationDataResponse(BaseModel):
    """Location data in response"""
    latitude: float
    longitude: float
    address: Optional[str] = None
    label: Optional[str] = None


class ImageDataResponse(BaseModel):
    """Image data in response"""
    url: str
    thumbnail_url: Optional[str] = None
    width: Optional[int] = None
    height: Optional[int] = None


class MessageResponse(BaseModel):
    """Single message response"""
    id: str
    conversation_id: str
    sender_id: str
    sender_role: str
    message_type: str
    content: str
    status: str
    image_data: Optional[ImageDataResponse] = None
    location_data: Optional[LocationDataResponse] = None
    reply_to_message_id: Optional[str] = None
    is_deleted: bool = False
    created_at: str
    delivered_at: Optional[str] = None
    seen_at: Optional[str] = None
    edited_at: Optional[str] = None
    
    # Sender info for display
    sender_name: Optional[str] = None
    sender_photo: Optional[str] = None


class BookingReferenceResponse(BaseModel):
    """Booking reference in conversation"""
    booking_id: str
    service_name: str
    service_type: str
    scheduled_date: str
    scheduled_time: str
    status: str
    price: float
    address: Optional[str] = None


class ConversationResponse(BaseModel):
    """Single conversation response"""
    id: str
    user_id: str
    professional_id: str
    participants: List[ParticipantResponse]
    booking_id: Optional[str] = None
    booking_reference: Optional[BookingReferenceResponse] = None
    status: str
    last_message_content: Optional[str] = None
    last_message_type: Optional[str] = None
    last_message_sender_id: Optional[str] = None
    last_message_at: Optional[str] = None
    is_priority: bool = False
    priority_text: Optional[str] = None
    service_badge: Optional[str] = None
    service_badge_color: Optional[str] = None
    unread_count: int = 0
    created_at: str
    updated_at: str
    
    # For display - other participant info
    other_participant: Optional[ParticipantResponse] = None


class ConversationListResponse(BaseModel):
    """List of conversations response"""
    conversations: List[ConversationResponse]
    total: int
    unread_total: int
    skip: int
    limit: int


class MessagesListResponse(BaseModel):
    """List of messages response"""
    messages: List[MessageResponse]
    conversation: ConversationResponse
    total: int
    has_more: bool
    skip: int
    limit: int


class SendMessageResponse(BaseModel):
    """Response after sending a message"""
    message: str
    data: MessageResponse
    conversation_id: str


class ConversationDetailResponse(BaseModel):
    """Detailed conversation response"""
    conversation: ConversationResponse
    messages: List[MessageResponse]
    total_messages: int


# ============================================
# SOCKET EVENT SCHEMAS
# ============================================

class NewMessageEvent(BaseModel):
    """Socket event for new message"""
    message: MessageResponse
    conversation_id: str
    sender_id: str


class MessageStatusUpdateEvent(BaseModel):
    """Socket event for message status update"""
    message_id: str
    conversation_id: str
    status: str
    updated_at: str


class TypingEvent(BaseModel):
    """Socket event for typing indicator"""
    conversation_id: str
    user_id: str
    user_name: str
    is_typing: bool


class UserOnlineStatusEvent(BaseModel):
    """Socket event for user online status"""
    user_id: str
    is_online: bool
    last_seen: Optional[str] = None
