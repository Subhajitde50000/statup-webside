"""
Notification model for MongoDB
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Any
from datetime import datetime
from enum import Enum
from bson import ObjectId


class NotificationType(str, Enum):
    # Booking related - User receives
    BOOKING_CONFIRMED = "booking_confirmed"
    BOOKING_CANCELLED = "booking_cancelled"
    BOOKING_RESCHEDULED = "booking_rescheduled"
    BOOKING_COMPLETED = "booking_completed"
    BOOKING_STARTED = "booking_started"
    BOOKING_ACCEPTED = "booking_accepted"
    BOOKING_REJECTED = "booking_rejected"
    PROFESSIONAL_ASSIGNED = "professional_assigned"
    PROFESSIONAL_ON_WAY = "professional_on_way"
    PROFESSIONAL_ARRIVED = "professional_arrived"
    OTP_GENERATED = "otp_generated"
    
    # Booking related - Professional receives
    NEW_BOOKING_REQUEST = "new_booking_request"
    BOOKING_CANCELLED_BY_USER = "booking_cancelled_by_user"
    BOOKING_RESCHEDULED_BY_USER = "booking_rescheduled_by_user"
    USER_SHARED_OTP = "user_shared_otp"
    NEW_REVIEW_RECEIVED = "new_review_received"
    
    # Payment related
    PAYMENT_RECEIVED = "payment_received"
    PAYMENT_FAILED = "payment_failed"
    REFUND_INITIATED = "refund_initiated"
    REFUND_COMPLETED = "refund_completed"
    
    # Offer related
    NEW_OFFER = "new_offer"
    OFFER_EXPIRING = "offer_expiring"
    FLASH_SALE = "flash_sale"
    
    # Rating & Review
    RATE_SERVICE = "rate_service"
    REVIEW_RESPONSE = "review_response"
    
    # Account related
    ACCOUNT_VERIFIED = "account_verified"
    PROFILE_UPDATED = "profile_updated"
    PASSWORD_CHANGED = "password_changed"
    
    # System
    SYSTEM_UPDATE = "system_update"
    NEW_FEATURE = "new_feature"
    MAINTENANCE = "maintenance"
    
    # Promotional
    WELCOME = "welcome"
    BIRTHDAY_OFFER = "birthday_offer"
    LOYALTY_REWARD = "loyalty_reward"
    REFERRAL_BONUS = "referral_bonus"
    
    # General
    INFO = "info"
    ALERT = "alert"
    SUCCESS = "success"
    WARNING = "warning"


class NotificationPriority(str, Enum):
    LOW = "low"
    NORMAL = "normal"
    HIGH = "high"
    URGENT = "urgent"


class NotificationCategory(str, Enum):
    BOOKING = "booking"
    PAYMENT = "payment"
    OFFER = "offer"
    ACCOUNT = "account"
    SYSTEM = "system"
    PROMOTIONAL = "promotional"


class NotificationInDB(BaseModel):
    """Notification document in MongoDB"""
    id: Optional[str] = Field(None, alias="_id")
    user_id: str  # User who receives the notification
    type: NotificationType
    category: NotificationCategory
    priority: NotificationPriority = NotificationPriority.NORMAL
    
    title: str
    message: str
    
    # Optional additional data (booking_id, offer_id, etc.)
    data: Optional[dict] = None
    
    # Action link (e.g., /booking/123, /offers/456)
    action_url: Optional[str] = None
    action_text: Optional[str] = None
    
    # Image/Icon
    image_url: Optional[str] = None
    icon: Optional[str] = None  # Icon name like 'CheckCircle', 'AlertCircle'
    
    # Status
    is_read: bool = False
    is_deleted: bool = False
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    read_at: Optional[datetime] = None
    expires_at: Optional[datetime] = None  # For time-limited notifications
    
    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str, datetime: lambda v: v.isoformat()}


class NotificationCreate(BaseModel):
    """Schema for creating a notification"""
    user_id: str
    type: NotificationType
    category: NotificationCategory
    priority: NotificationPriority = NotificationPriority.NORMAL
    title: str
    message: str
    data: Optional[dict] = None
    action_url: Optional[str] = None
    action_text: Optional[str] = None
    image_url: Optional[str] = None
    icon: Optional[str] = None
    expires_at: Optional[datetime] = None


class NotificationResponse(BaseModel):
    """Schema for notification response"""
    id: str
    user_id: str
    type: str
    category: str
    priority: str
    title: str
    message: str
    data: Optional[dict] = None
    action_url: Optional[str] = None
    action_text: Optional[str] = None
    image_url: Optional[str] = None
    icon: Optional[str] = None
    is_read: bool
    created_at: datetime
    read_at: Optional[datetime] = None
    
    class Config:
        json_encoders = {datetime: lambda v: v.isoformat()}


class NotificationListResponse(BaseModel):
    """Schema for notification list response"""
    notifications: List[NotificationResponse]
    total: int
    unread_count: int
    page: int
    limit: int


class NotificationSettings(BaseModel):
    """User notification preferences"""
    user_id: str
    
    # Push notification settings
    push_enabled: bool = True
    
    # Email notification settings
    email_enabled: bool = True
    email_booking_updates: bool = True
    email_offers: bool = True
    email_system_updates: bool = False
    
    # Category preferences
    booking_notifications: bool = True
    payment_notifications: bool = True
    offer_notifications: bool = True
    promotional_notifications: bool = True
    system_notifications: bool = True
    
    # Quiet hours (optional)
    quiet_hours_enabled: bool = False
    quiet_hours_start: Optional[str] = "22:00"  # 10 PM
    quiet_hours_end: Optional[str] = "08:00"    # 8 AM
    
    updated_at: datetime = Field(default_factory=datetime.utcnow)
