"""
Message and Conversation models for MongoDB
Real-time messaging system between users and professionals
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum
from bson import ObjectId


class MessageType(str, Enum):
    """Types of messages"""
    TEXT = "text"
    IMAGE = "image"
    LOCATION = "location"
    SYSTEM = "system"


class MessageStatus(str, Enum):
    """Status of a message"""
    SENT = "sent"
    DELIVERED = "delivered"
    SEEN = "seen"


class ConversationStatus(str, Enum):
    """Status of a conversation"""
    ACTIVE = "active"
    ARCHIVED = "archived"
    CLOSED = "closed"


class ParticipantRole(str, Enum):
    """Role of participant in conversation"""
    USER = "user"
    PROFESSIONAL = "professional"


class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v, values=None):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, field_schema):
        field_schema.update(type="string")


# ============================================
# PARTICIPANT MODEL
# ============================================

class Participant(BaseModel):
    """Participant in a conversation"""
    user_id: str
    role: ParticipantRole
    name: str
    photo: Optional[str] = None
    phone: Optional[str] = None
    is_online: bool = False
    last_seen: Optional[datetime] = None
    unread_count: int = 0
    is_muted: bool = False
    is_blocked: bool = False
    joined_at: datetime = Field(default_factory=datetime.utcnow)


# ============================================
# MESSAGE MODEL
# ============================================

class LocationData(BaseModel):
    """Location data for location messages"""
    latitude: float
    longitude: float
    address: Optional[str] = None
    label: Optional[str] = None


class ImageData(BaseModel):
    """Image data for image messages"""
    url: str
    thumbnail_url: Optional[str] = None
    width: Optional[int] = None
    height: Optional[int] = None
    file_size: Optional[int] = None


class MessageBase(BaseModel):
    """Base message model"""
    conversation_id: str
    sender_id: str
    sender_role: ParticipantRole
    message_type: MessageType = MessageType.TEXT
    content: str  # For text messages, or caption for images
    
    # For image messages
    image_data: Optional[ImageData] = None
    
    # For location messages
    location_data: Optional[LocationData] = None
    
    # Status
    status: MessageStatus = MessageStatus.SENT
    
    # Metadata
    reply_to_message_id: Optional[str] = None
    is_deleted: bool = False
    deleted_at: Optional[datetime] = None
    edited_at: Optional[datetime] = None


class MessageInDB(MessageBase):
    """Message stored in database"""
    id: Optional[str] = Field(default=None, alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    delivered_at: Optional[datetime] = None
    seen_at: Optional[datetime] = None
    
    class Config:
        populate_by_name = True
        json_encoders = {
            ObjectId: str,
            datetime: lambda v: v.isoformat()
        }


# ============================================
# CONVERSATION MODEL
# ============================================

class BookingReference(BaseModel):
    """Reference to a booking in conversation"""
    booking_id: str
    service_name: str
    service_type: str
    scheduled_date: str
    scheduled_time: str
    status: str
    price: float
    address: Optional[str] = None


class ConversationBase(BaseModel):
    """Base conversation model"""
    # Participants
    participants: List[Participant]
    user_id: str  # Regular user
    professional_id: str  # Professional
    
    # Booking reference (optional - conversation can exist without booking)
    booking_id: Optional[str] = None
    booking_reference: Optional[BookingReference] = None
    
    # Conversation metadata
    status: ConversationStatus = ConversationStatus.ACTIVE
    
    # Last message info
    last_message_id: Optional[str] = None
    last_message_content: Optional[str] = None
    last_message_type: Optional[MessageType] = None
    last_message_sender_id: Optional[str] = None
    last_message_at: Optional[datetime] = None
    
    # Priority/flags
    is_priority: bool = False
    priority_text: Optional[str] = None
    
    # Service badge
    service_badge: Optional[str] = None
    service_badge_color: Optional[str] = None


class ConversationInDB(ConversationBase):
    """Conversation stored in database"""
    id: Optional[str] = Field(default=None, alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        json_encoders = {
            ObjectId: str,
            datetime: lambda v: v.isoformat()
        }


# ============================================
# TYPING INDICATOR MODEL
# ============================================

class TypingIndicator(BaseModel):
    """Typing indicator for real-time updates"""
    conversation_id: str
    user_id: str
    is_typing: bool
    timestamp: datetime = Field(default_factory=datetime.utcnow)
