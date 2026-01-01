"""
Notification service for creating and sending notifications
"""

from datetime import datetime
from typing import Optional, Dict, Any
from bson import ObjectId

from app.database import db
from app.socket_manager import send_notification_to_user, is_user_online
from app.models.notification import (
    NotificationType,
    NotificationCategory,
    NotificationPriority,
    NotificationCreate
)


class NotificationService:
    """Service for managing notifications"""
    
    @staticmethod
    def get_collection():
        return db.db.notifications
    
    @staticmethod
    def get_icon_for_type(notification_type: NotificationType) -> str:
        """Get icon name for notification type"""
        icons = {
            # Booking
            NotificationType.BOOKING_CONFIRMED: "CheckCircle",
            NotificationType.BOOKING_CANCELLED: "XCircle",
            NotificationType.BOOKING_RESCHEDULED: "Calendar",
            NotificationType.BOOKING_COMPLETED: "CheckCircle",
            NotificationType.BOOKING_STARTED: "Play",
            NotificationType.PROFESSIONAL_ASSIGNED: "User",
            NotificationType.PROFESSIONAL_ON_WAY: "Truck",
            NotificationType.PROFESSIONAL_ARRIVED: "MapPin",
            NotificationType.OTP_GENERATED: "Key",
            
            # Payment
            NotificationType.PAYMENT_RECEIVED: "DollarSign",
            NotificationType.PAYMENT_FAILED: "AlertCircle",
            NotificationType.REFUND_INITIATED: "RefreshCw",
            NotificationType.REFUND_COMPLETED: "CheckCircle",
            
            # Offer
            NotificationType.NEW_OFFER: "Tag",
            NotificationType.OFFER_EXPIRING: "Clock",
            NotificationType.FLASH_SALE: "Zap",
            
            # Rating
            NotificationType.RATE_SERVICE: "Star",
            NotificationType.REVIEW_RESPONSE: "MessageCircle",
            
            # Account
            NotificationType.ACCOUNT_VERIFIED: "Shield",
            NotificationType.PROFILE_UPDATED: "User",
            NotificationType.PASSWORD_CHANGED: "Lock",
            
            # System
            NotificationType.SYSTEM_UPDATE: "Settings",
            NotificationType.NEW_FEATURE: "Sparkles",
            NotificationType.MAINTENANCE: "Tool",
            
            # Promotional
            NotificationType.WELCOME: "Heart",
            NotificationType.BIRTHDAY_OFFER: "Gift",
            NotificationType.LOYALTY_REWARD: "Award",
            NotificationType.REFERRAL_BONUS: "Users",
            
            # General
            NotificationType.INFO: "Info",
            NotificationType.ALERT: "AlertCircle",
            NotificationType.SUCCESS: "CheckCircle",
            NotificationType.WARNING: "AlertTriangle",
        }
        return icons.get(notification_type, "Bell")
    
    @staticmethod
    def get_color_for_type(notification_type: NotificationType) -> dict:
        """Get colors for notification type"""
        booking_types = [
            NotificationType.BOOKING_CONFIRMED,
            NotificationType.BOOKING_COMPLETED,
            NotificationType.PROFESSIONAL_ASSIGNED,
        ]
        
        success_types = [
            NotificationType.PAYMENT_RECEIVED,
            NotificationType.REFUND_COMPLETED,
            NotificationType.ACCOUNT_VERIFIED,
        ]
        
        warning_types = [
            NotificationType.BOOKING_CANCELLED,
            NotificationType.PAYMENT_FAILED,
            NotificationType.OFFER_EXPIRING,
        ]
        
        info_types = [
            NotificationType.PROFESSIONAL_ON_WAY,
            NotificationType.PROFESSIONAL_ARRIVED,
            NotificationType.BOOKING_STARTED,
            NotificationType.NEW_FEATURE,
        ]
        
        promo_types = [
            NotificationType.NEW_OFFER,
            NotificationType.FLASH_SALE,
            NotificationType.BIRTHDAY_OFFER,
            NotificationType.LOYALTY_REWARD,
        ]
        
        if notification_type in booking_types or notification_type in success_types:
            return {"bg": "bg-green-50", "icon": "text-green-600"}
        elif notification_type in warning_types:
            return {"bg": "bg-red-50", "icon": "text-red-600"}
        elif notification_type in info_types:
            return {"bg": "bg-blue-50", "icon": "text-blue-600"}
        elif notification_type in promo_types:
            return {"bg": "bg-orange-50", "icon": "text-orange-600"}
        else:
            return {"bg": "bg-purple-50", "icon": "text-purple-600"}
    
    @classmethod
    async def create(
        cls,
        user_id: str,
        notification_type: NotificationType,
        title: str,
        message: str,
        category: NotificationCategory = NotificationCategory.SYSTEM,
        priority: NotificationPriority = NotificationPriority.NORMAL,
        data: Optional[Dict[str, Any]] = None,
        action_url: Optional[str] = None,
        action_text: Optional[str] = None,
        image_url: Optional[str] = None,
        expires_at: Optional[datetime] = None,
        send_realtime: bool = True
    ) -> str:
        """Create a notification and optionally send via Socket.IO"""
        
        collection = cls.get_collection()
        icon = cls.get_icon_for_type(notification_type)
        colors = cls.get_color_for_type(notification_type)
        
        doc = {
            "user_id": user_id,
            "type": notification_type.value,
            "category": category.value,
            "priority": priority.value,
            "title": title,
            "message": message,
            "data": data or {},
            "action_url": action_url,
            "action_text": action_text,
            "image_url": image_url,
            "icon": icon,
            "icon_color": colors["icon"],
            "bg_color": colors["bg"],
            "is_read": False,
            "is_deleted": False,
            "created_at": datetime.utcnow(),
            "expires_at": expires_at
        }
        
        result = await collection.insert_one(doc)
        notification_id = str(result.inserted_id)
        
        # Send real-time notification if user is online
        if send_realtime:
            await cls.send_realtime(user_id, {
                "id": notification_id,
                "type": notification_type.value,
                "category": category.value,
                "priority": priority.value,
                "title": title,
                "message": message,
                "data": data or {},
                "action_url": action_url,
                "action_text": action_text,
                "icon": icon,
                "icon_color": colors["icon"],
                "bg_color": colors["bg"],
                "is_read": False,
                "created_at": datetime.utcnow().isoformat()
            })
        
        return notification_id
    
    @classmethod
    async def send_realtime(cls, user_id: str, notification: dict):
        """Send notification via Socket.IO"""
        try:
            await send_notification_to_user(user_id, notification)
        except Exception as e:
            print(f"Error sending real-time notification: {e}")
    
    # Convenience methods for common notifications
    
    @classmethod
    async def booking_confirmed(
        cls,
        user_id: str,
        booking_id: str,
        service_name: str,
        professional_name: str,
        date: str,
        time: str
    ):
        """Send booking confirmation notification"""
        return await cls.create(
            user_id=user_id,
            notification_type=NotificationType.BOOKING_CONFIRMED,
            title="Booking Confirmed! ✓",
            message=f"Your {service_name} booking with {professional_name} is confirmed for {date} at {time}",
            category=NotificationCategory.BOOKING,
            priority=NotificationPriority.HIGH,
            data={
                "booking_id": booking_id,
                "service_name": service_name,
                "professional_name": professional_name,
                "date": date,
                "time": time
            },
            action_url=f"/booking/{booking_id}",
            action_text="View Booking"
        )
    
    @classmethod
    async def professional_on_way(
        cls,
        user_id: str,
        booking_id: str,
        professional_name: str,
        eta_minutes: int
    ):
        """Send professional on the way notification"""
        return await cls.create(
            user_id=user_id,
            notification_type=NotificationType.PROFESSIONAL_ON_WAY,
            title="Professional On The Way 🚗",
            message=f"{professional_name} is on the way! ETA: {eta_minutes} minutes",
            category=NotificationCategory.BOOKING,
            priority=NotificationPriority.HIGH,
            data={
                "booking_id": booking_id,
                "professional_name": professional_name,
                "eta_minutes": eta_minutes
            },
            action_url=f"/booking/{booking_id}",
            action_text="Track"
        )
    
    @classmethod
    async def professional_arrived(
        cls,
        user_id: str,
        booking_id: str,
        professional_name: str,
        otp: str
    ):
        """Send professional arrived notification"""
        return await cls.create(
            user_id=user_id,
            notification_type=NotificationType.PROFESSIONAL_ARRIVED,
            title="Professional Arrived 📍",
            message=f"{professional_name} has arrived! Share OTP: {otp} to start service",
            category=NotificationCategory.BOOKING,
            priority=NotificationPriority.URGENT,
            data={
                "booking_id": booking_id,
                "professional_name": professional_name,
                "otp": otp
            },
            action_url=f"/booking/{booking_id}",
            action_text="View OTP"
        )
    
    @classmethod
    async def booking_completed(
        cls,
        user_id: str,
        booking_id: str,
        service_name: str,
        amount: float
    ):
        """Send booking completed notification"""
        return await cls.create(
            user_id=user_id,
            notification_type=NotificationType.BOOKING_COMPLETED,
            title="Service Completed ✓",
            message=f"Your {service_name} service has been completed. Total: ₹{amount}",
            category=NotificationCategory.BOOKING,
            priority=NotificationPriority.NORMAL,
            data={
                "booking_id": booking_id,
                "service_name": service_name,
                "amount": amount
            },
            action_url=f"/booking/{booking_id}",
            action_text="View Details"
        )
    
    @classmethod
    async def rate_service(
        cls,
        user_id: str,
        booking_id: str,
        service_name: str,
        professional_name: str
    ):
        """Send rate service notification"""
        return await cls.create(
            user_id=user_id,
            notification_type=NotificationType.RATE_SERVICE,
            title="Rate Your Experience ⭐",
            message=f"How was your {service_name} service with {professional_name}?",
            category=NotificationCategory.BOOKING,
            priority=NotificationPriority.NORMAL,
            data={
                "booking_id": booking_id,
                "service_name": service_name,
                "professional_name": professional_name
            },
            action_url=f"/booking/{booking_id}#review",
            action_text="Rate Now"
        )
    
    @classmethod
    async def new_offer(
        cls,
        user_id: str,
        offer_id: str,
        title: str,
        discount: str,
        valid_until: str
    ):
        """Send new offer notification"""
        return await cls.create(
            user_id=user_id,
            notification_type=NotificationType.NEW_OFFER,
            title=f"🎉 {title}",
            message=f"Get {discount} off! Valid until {valid_until}",
            category=NotificationCategory.OFFER,
            priority=NotificationPriority.NORMAL,
            data={
                "offer_id": offer_id,
                "discount": discount,
                "valid_until": valid_until
            },
            action_url=f"/offers/{offer_id}",
            action_text="Claim Offer"
        )
    
    @classmethod
    async def payment_received(
        cls,
        user_id: str,
        booking_id: str,
        amount: float,
        payment_method: str
    ):
        """Send payment received notification"""
        return await cls.create(
            user_id=user_id,
            notification_type=NotificationType.PAYMENT_RECEIVED,
            title="Payment Successful 💰",
            message=f"₹{amount} paid successfully via {payment_method}",
            category=NotificationCategory.PAYMENT,
            priority=NotificationPriority.HIGH,
            data={
                "booking_id": booking_id,
                "amount": amount,
                "payment_method": payment_method
            },
            action_url=f"/booking/{booking_id}",
            action_text="View Receipt"
        )
    
    @classmethod
    async def welcome_notification(cls, user_id: str, user_name: str):
        """Send welcome notification to new users"""
        return await cls.create(
            user_id=user_id,
            notification_type=NotificationType.WELCOME,
            title=f"Welcome, {user_name}! 🎉",
            message="Thanks for joining! Explore our services and book your first appointment.",
            category=NotificationCategory.PROMOTIONAL,
            priority=NotificationPriority.NORMAL,
            action_url="/services",
            action_text="Browse Services"
        )


# Create singleton instance
notification_service = NotificationService()
