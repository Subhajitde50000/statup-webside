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
            # Booking - User side
            NotificationType.BOOKING_CONFIRMED: "CheckCircle",
            NotificationType.BOOKING_CANCELLED: "XCircle",
            NotificationType.BOOKING_RESCHEDULED: "Calendar",
            NotificationType.BOOKING_COMPLETED: "CheckCircle",
            NotificationType.BOOKING_STARTED: "Play",
            NotificationType.BOOKING_ACCEPTED: "CheckCircle",
            NotificationType.BOOKING_REJECTED: "XCircle",
            NotificationType.PROFESSIONAL_ASSIGNED: "User",
            NotificationType.PROFESSIONAL_ON_WAY: "Truck",
            NotificationType.PROFESSIONAL_ARRIVED: "MapPin",
            NotificationType.OTP_GENERATED: "Key",
            
            # Booking - Professional side
            NotificationType.NEW_BOOKING_REQUEST: "Calendar",
            NotificationType.BOOKING_CANCELLED_BY_USER: "XCircle",
            NotificationType.BOOKING_RESCHEDULED_BY_USER: "Calendar",
            NotificationType.USER_SHARED_OTP: "Key",
            NotificationType.NEW_REVIEW_RECEIVED: "Star",
            
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
    
    # =============================================
    # PROFESSIONAL-SIDE NOTIFICATIONS
    # =============================================
    
    @classmethod
    async def new_booking_request(
        cls,
        professional_id: str,
        booking_id: str,
        service_name: str,
        customer_name: str,
        date: str,
        time: str,
        price: float
    ):
        """Send new booking notification to professional"""
        return await cls.create(
            user_id=professional_id,
            notification_type=NotificationType.NEW_BOOKING_REQUEST,
            title="New Booking Request! 📅",
            message=f"{customer_name} booked {service_name} for {date} at {time}",
            category=NotificationCategory.BOOKING,
            priority=NotificationPriority.HIGH,
            data={
                "booking_id": booking_id,
                "service_name": service_name,
                "customer_name": customer_name,
                "date": date,
                "time": time,
                "price": price
            },
            action_url=f"/professional/bookings/requests",
            action_text="View Request"
        )
    
    @classmethod
    async def booking_accepted_user(
        cls,
        user_id: str,
        booking_id: str,
        service_name: str,
        professional_name: str,
        date: str,
        time: str
    ):
        """Notify user when professional accepts their booking"""
        return await cls.create(
            user_id=user_id,
            notification_type=NotificationType.BOOKING_ACCEPTED,
            title="Booking Accepted! ✓",
            message=f"{professional_name} has accepted your {service_name} booking for {date} at {time}",
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
    async def booking_rejected_user(
        cls,
        user_id: str,
        booking_id: str,
        service_name: str,
        professional_name: str,
        reason: str = None
    ):
        """Notify user when professional rejects their booking"""
        return await cls.create(
            user_id=user_id,
            notification_type=NotificationType.BOOKING_REJECTED,
            title="Booking Not Available",
            message=f"{professional_name} couldn't accept your {service_name} booking. {reason or 'Please try another time slot.'}",
            category=NotificationCategory.BOOKING,
            priority=NotificationPriority.HIGH,
            data={
                "booking_id": booking_id,
                "service_name": service_name,
                "professional_name": professional_name,
                "reason": reason
            },
            action_url=f"/service",
            action_text="Book Again"
        )
    
    @classmethod
    async def booking_cancelled_notify_professional(
        cls,
        professional_id: str,
        booking_id: str,
        service_name: str,
        customer_name: str,
        date: str,
        time: str,
        reason: str = None
    ):
        """Notify professional when user cancels booking"""
        return await cls.create(
            user_id=professional_id,
            notification_type=NotificationType.BOOKING_CANCELLED_BY_USER,
            title="Booking Cancelled",
            message=f"{customer_name} cancelled their {service_name} booking for {date} at {time}",
            category=NotificationCategory.BOOKING,
            priority=NotificationPriority.HIGH,
            data={
                "booking_id": booking_id,
                "service_name": service_name,
                "customer_name": customer_name,
                "date": date,
                "time": time,
                "reason": reason
            },
            action_url=f"/professional/bookings",
            action_text="View Bookings"
        )
    
    @classmethod
    async def booking_cancelled_notify_user(
        cls,
        user_id: str,
        booking_id: str,
        service_name: str,
        professional_name: str,
        reason: str = None
    ):
        """Notify user when professional cancels/rejects booking"""
        return await cls.create(
            user_id=user_id,
            notification_type=NotificationType.BOOKING_CANCELLED,
            title="Booking Cancelled",
            message=f"Your {service_name} booking with {professional_name} has been cancelled. {reason or ''}",
            category=NotificationCategory.BOOKING,
            priority=NotificationPriority.HIGH,
            data={
                "booking_id": booking_id,
                "service_name": service_name,
                "professional_name": professional_name,
                "reason": reason
            },
            action_url=f"/service",
            action_text="Book Again"
        )
    
    @classmethod
    async def work_started_user(
        cls,
        user_id: str,
        booking_id: str,
        service_name: str,
        professional_name: str
    ):
        """Notify user when work starts"""
        return await cls.create(
            user_id=user_id,
            notification_type=NotificationType.BOOKING_STARTED,
            title="Work Started! 🔧",
            message=f"{professional_name} has started working on your {service_name}",
            category=NotificationCategory.BOOKING,
            priority=NotificationPriority.HIGH,
            data={
                "booking_id": booking_id,
                "service_name": service_name,
                "professional_name": professional_name
            },
            action_url=f"/booking/{booking_id}",
            action_text="Track Progress"
        )
    
    @classmethod
    async def work_completed_user(
        cls,
        user_id: str,
        booking_id: str,
        service_name: str,
        professional_name: str,
        amount: float
    ):
        """Notify user when work is completed"""
        return await cls.create(
            user_id=user_id,
            notification_type=NotificationType.BOOKING_COMPLETED,
            title="Service Completed! ✅",
            message=f"Your {service_name} with {professional_name} is complete. Total: ₹{amount}",
            category=NotificationCategory.BOOKING,
            priority=NotificationPriority.HIGH,
            data={
                "booking_id": booking_id,
                "service_name": service_name,
                "professional_name": professional_name,
                "amount": amount
            },
            action_url=f"/booking/{booking_id}",
            action_text="Rate Service"
        )
    
    @classmethod
    async def work_completed_professional(
        cls,
        professional_id: str,
        booking_id: str,
        service_name: str,
        customer_name: str,
        amount: float
    ):
        """Notify professional when work is completed"""
        return await cls.create(
            user_id=professional_id,
            notification_type=NotificationType.BOOKING_COMPLETED,
            title="Job Completed! 💰",
            message=f"You've completed {service_name} for {customer_name}. Earnings: ₹{amount}",
            category=NotificationCategory.BOOKING,
            priority=NotificationPriority.NORMAL,
            data={
                "booking_id": booking_id,
                "service_name": service_name,
                "customer_name": customer_name,
                "amount": amount
            },
            action_url=f"/professional/bookings/completed",
            action_text="View Completed"
        )
    
    @classmethod
    async def new_review_received(
        cls,
        professional_id: str,
        booking_id: str,
        customer_name: str,
        rating: int,
        review: str = None
    ):
        """Notify professional when they receive a review"""
        stars = "⭐" * rating
        return await cls.create(
            user_id=professional_id,
            notification_type=NotificationType.NEW_REVIEW_RECEIVED,
            title=f"New Review: {stars}",
            message=f"{customer_name} rated you {rating}/5. {review[:50] + '...' if review and len(review) > 50 else review or ''}",
            category=NotificationCategory.BOOKING,
            priority=NotificationPriority.NORMAL,
            data={
                "booking_id": booking_id,
                "customer_name": customer_name,
                "rating": rating,
                "review": review
            },
            action_url=f"/professional/profile",
            action_text="View Reviews"
        )
    
    @classmethod
    async def booking_rescheduled_professional(
        cls,
        professional_id: str,
        booking_id: str,
        service_name: str,
        customer_name: str,
        old_date: str,
        old_time: str,
        new_date: str,
        new_time: str
    ):
        """Notify professional when user reschedules"""
        return await cls.create(
            user_id=professional_id,
            notification_type=NotificationType.BOOKING_RESCHEDULED_BY_USER,
            title="Booking Rescheduled 📅",
            message=f"{customer_name} rescheduled {service_name} from {old_date} to {new_date} at {new_time}",
            category=NotificationCategory.BOOKING,
            priority=NotificationPriority.HIGH,
            data={
                "booking_id": booking_id,
                "service_name": service_name,
                "customer_name": customer_name,
                "old_date": old_date,
                "old_time": old_time,
                "new_date": new_date,
                "new_time": new_time
            },
            action_url=f"/professional/bookings/accepted",
            action_text="View Booking"
        )


# Create singleton instance
notification_service = NotificationService()
