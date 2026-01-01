"""
Notification routes for the API
"""

from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
from datetime import datetime
from bson import ObjectId

from app.database import db
from app.utils.security import get_current_user
from app.models.notification import (
    NotificationType, 
    NotificationCategory, 
    NotificationPriority,
    NotificationCreate,
    NotificationResponse,
    NotificationListResponse,
    NotificationSettings
)

router = APIRouter()


# Helper function to get notifications collection
def get_notifications_collection():
    return db.db.notifications


def get_notification_settings_collection():
    return db.db.notification_settings


# Helper to convert MongoDB doc to response
def notification_to_response(doc: dict) -> NotificationResponse:
    return NotificationResponse(
        id=str(doc["_id"]),
        user_id=doc["user_id"],
        type=doc["type"],
        category=doc["category"],
        priority=doc.get("priority", "normal"),
        title=doc["title"],
        message=doc["message"],
        data=doc.get("data"),
        action_url=doc.get("action_url"),
        action_text=doc.get("action_text"),
        image_url=doc.get("image_url"),
        icon=doc.get("icon"),
        is_read=doc.get("is_read", False),
        created_at=doc["created_at"],
        read_at=doc.get("read_at")
    )


@router.get("/notifications", response_model=NotificationListResponse)
async def get_notifications(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    category: Optional[str] = None,
    is_read: Optional[bool] = None,
    current_user: dict = Depends(get_current_user)
):
    """Get user's notifications with pagination"""
    collection = get_notifications_collection()
    user_id = str(current_user["_id"])
    
    # Build query
    query = {
        "user_id": user_id,
        "is_deleted": {"$ne": True}
    }
    
    # Filter by category
    if category:
        query["category"] = category
    
    # Filter by read status
    if is_read is not None:
        query["is_read"] = is_read
    
    # Filter expired notifications
    query["$or"] = [
        {"expires_at": None},
        {"expires_at": {"$gt": datetime.utcnow()}}
    ]
    
    # Get total count
    total = await collection.count_documents(query)
    
    # Get unread count
    unread_query = {
        "user_id": user_id,
        "is_deleted": {"$ne": True},
        "is_read": False,
        "$or": [
            {"expires_at": None},
            {"expires_at": {"$gt": datetime.utcnow()}}
        ]
    }
    unread_count = await collection.count_documents(unread_query)
    
    # Get paginated notifications
    skip = (page - 1) * limit
    cursor = collection.find(query).sort("created_at", -1).skip(skip).limit(limit)
    notifications = await cursor.to_list(length=limit)
    
    return NotificationListResponse(
        notifications=[notification_to_response(n) for n in notifications],
        total=total,
        unread_count=unread_count,
        page=page,
        limit=limit
    )


@router.get("/notifications/unread-count")
async def get_unread_count(current_user: dict = Depends(get_current_user)):
    """Get count of unread notifications"""
    collection = get_notifications_collection()
    user_id = str(current_user["_id"])
    
    count = await collection.count_documents({
        "user_id": user_id,
        "is_read": False,
        "is_deleted": {"$ne": True},
        "$or": [
            {"expires_at": None},
            {"expires_at": {"$gt": datetime.utcnow()}}
        ]
    })
    
    return {"unread_count": count}


@router.get("/notifications/{notification_id}", response_model=NotificationResponse)
async def get_notification(
    notification_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get a specific notification"""
    collection = get_notifications_collection()
    user_id = str(current_user["_id"])
    
    if not ObjectId.is_valid(notification_id):
        raise HTTPException(status_code=400, detail="Invalid notification ID")
    
    notification = await collection.find_one({
        "_id": ObjectId(notification_id),
        "user_id": user_id,
        "is_deleted": {"$ne": True}
    })
    
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    return notification_to_response(notification)


@router.put("/notifications/{notification_id}/read")
async def mark_notification_read(
    notification_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Mark a notification as read"""
    collection = get_notifications_collection()
    user_id = str(current_user["_id"])
    
    if not ObjectId.is_valid(notification_id):
        raise HTTPException(status_code=400, detail="Invalid notification ID")
    
    result = await collection.update_one(
        {
            "_id": ObjectId(notification_id),
            "user_id": user_id
        },
        {
            "$set": {
                "is_read": True,
                "read_at": datetime.utcnow()
            }
        }
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    return {"message": "Notification marked as read"}


@router.put("/notifications/read-all")
async def mark_all_notifications_read(
    current_user: dict = Depends(get_current_user)
):
    """Mark all notifications as read"""
    collection = get_notifications_collection()
    user_id = str(current_user["_id"])
    
    result = await collection.update_many(
        {
            "user_id": user_id,
            "is_read": False
        },
        {
            "$set": {
                "is_read": True,
                "read_at": datetime.utcnow()
            }
        }
    )
    
    return {
        "message": "All notifications marked as read",
        "count": result.modified_count
    }


@router.delete("/notifications/{notification_id}")
async def delete_notification(
    notification_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Soft delete a notification"""
    collection = get_notifications_collection()
    user_id = str(current_user["_id"])
    
    if not ObjectId.is_valid(notification_id):
        raise HTTPException(status_code=400, detail="Invalid notification ID")
    
    result = await collection.update_one(
        {
            "_id": ObjectId(notification_id),
            "user_id": user_id
        },
        {
            "$set": {"is_deleted": True}
        }
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    return {"message": "Notification deleted"}


@router.delete("/notifications/clear-all")
async def clear_all_notifications(
    current_user: dict = Depends(get_current_user)
):
    """Soft delete all notifications"""
    collection = get_notifications_collection()
    user_id = str(current_user["_id"])
    
    result = await collection.update_many(
        {"user_id": user_id},
        {"$set": {"is_deleted": True}}
    )
    
    return {
        "message": "All notifications cleared",
        "count": result.modified_count
    }


# Notification Settings
@router.get("/notifications/settings/me")
async def get_notification_settings(
    current_user: dict = Depends(get_current_user)
):
    """Get user's notification settings"""
    collection = get_notification_settings_collection()
    user_id = str(current_user["_id"])
    
    settings = await collection.find_one({"user_id": user_id})
    
    if not settings:
        # Return default settings
        return NotificationSettings(user_id=user_id)
    
    # Remove _id from response
    settings.pop("_id", None)
    return settings


@router.put("/notifications/settings/me")
async def update_notification_settings(
    settings: dict,
    current_user: dict = Depends(get_current_user)
):
    """Update user's notification settings"""
    collection = get_notification_settings_collection()
    user_id = str(current_user["_id"])
    
    settings["user_id"] = user_id
    settings["updated_at"] = datetime.utcnow()
    
    await collection.update_one(
        {"user_id": user_id},
        {"$set": settings},
        upsert=True
    )
    
    return {"message": "Settings updated successfully"}


# Internal function to create notification (used by other services)
async def create_notification(notification_data: NotificationCreate) -> str:
    """Create a new notification - internal use"""
    collection = get_notifications_collection()
    
    doc = {
        "user_id": notification_data.user_id,
        "type": notification_data.type.value,
        "category": notification_data.category.value,
        "priority": notification_data.priority.value,
        "title": notification_data.title,
        "message": notification_data.message,
        "data": notification_data.data,
        "action_url": notification_data.action_url,
        "action_text": notification_data.action_text,
        "image_url": notification_data.image_url,
        "icon": notification_data.icon,
        "is_read": False,
        "is_deleted": False,
        "created_at": datetime.utcnow(),
        "expires_at": notification_data.expires_at
    }
    
    result = await collection.insert_one(doc)
    return str(result.inserted_id)


# Admin/Internal endpoint to send notification
@router.post("/notifications/send")
async def send_notification(
    notification: NotificationCreate,
    current_user: dict = Depends(get_current_user)
):
    """Send a notification to a user (admin/internal use)"""
    # Allow for testing - in production, restrict to admin
    notification_id = await create_notification(notification)
    
    return {
        "message": "Notification sent",
        "notification_id": notification_id
    }


# Bulk notification (for offers, announcements)
@router.post("/notifications/broadcast")
async def broadcast_notification(
    title: str,
    message: str,
    category: str = "promotional",
    notification_type: str = "new_offer",
    action_url: Optional[str] = None,
    user_ids: Optional[List[str]] = None,
    current_user: dict = Depends(get_current_user)
):
    """Broadcast notification to multiple users (admin only)"""
    # Check if admin
    if current_user.get("role") not in ["admin", "manager"]:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    collection = get_notifications_collection()
    
    # If no user_ids provided, get all users
    if not user_ids:
        users_collection = db.db.users
        users = await users_collection.find(
            {"role": "user"},
            {"_id": 1}
        ).to_list(length=None)
        user_ids = [str(u["_id"]) for u in users]
    
    # Create notifications for all users
    notifications = []
    for user_id in user_ids:
        notifications.append({
            "user_id": user_id,
            "type": notification_type,
            "category": category,
            "priority": "normal",
            "title": title,
            "message": message,
            "action_url": action_url,
            "is_read": False,
            "is_deleted": False,
            "created_at": datetime.utcnow()
        })
    
    if notifications:
        await collection.insert_many(notifications)
    
    return {
        "message": f"Notification sent to {len(notifications)} users",
        "count": len(notifications)
    }


# Test endpoint to create sample notification (for development/testing)
@router.post("/notifications/test/{user_id}")
async def create_test_notification(
    user_id: str,
    notification_type: str = "booking_confirmed"
):
    """Create a test notification for a user (development only)"""
    from app.socket_manager import send_notification_to_user
    
    collection = get_notifications_collection()
    
    # Sample notification templates
    templates = {
        "booking_confirmed": {
            "title": "Booking Confirmed! ✓",
            "message": "Your Fan Repair service with Rahul Das is confirmed for today at 3:00 PM",
            "icon": "CheckCircle",
            "category": "booking",
            "action_url": "/booking/ELX-824412",
            "action_text": "View Booking"
        },
        "professional_on_way": {
            "title": "Professional On The Way 🚗",
            "message": "Rajesh Kumar is on the way! ETA: 15 minutes",
            "icon": "Truck",
            "category": "booking",
            "action_url": "/booking/ELX-824412",
            "action_text": "Track"
        },
        "new_offer": {
            "title": "🎉 Special Offer!",
            "message": "Get 20% off on your next plumbing service. Use code: SAVE20",
            "icon": "Tag",
            "category": "offer",
            "action_url": "/offers",
            "action_text": "Claim Offer"
        },
        "rate_service": {
            "title": "Rate Your Experience ⭐",
            "message": "How was your home cleaning service with Suman Das?",
            "icon": "Star",
            "category": "booking",
            "action_url": "/booking/CLN-123456#review",
            "action_text": "Rate Now"
        },
        "payment_received": {
            "title": "Payment Successful 💰",
            "message": "₹450 paid successfully via UPI",
            "icon": "DollarSign",
            "category": "payment",
            "action_url": "/booking/ELX-824412",
            "action_text": "View Receipt"
        }
    }
    
    template = templates.get(notification_type, templates["booking_confirmed"])
    
    # Get icon colors
    icon_colors = {
        "CheckCircle": {"bg": "bg-green-50", "icon": "text-green-600"},
        "Truck": {"bg": "bg-blue-50", "icon": "text-blue-600"},
        "Tag": {"bg": "bg-orange-50", "icon": "text-orange-600"},
        "Star": {"bg": "bg-blue-50", "icon": "text-blue-600"},
        "DollarSign": {"bg": "bg-green-50", "icon": "text-green-600"},
    }
    colors = icon_colors.get(template["icon"], {"bg": "bg-purple-50", "icon": "text-purple-600"})
    
    doc = {
        "user_id": user_id,
        "type": notification_type,
        "category": template["category"],
        "priority": "normal",
        "title": template["title"],
        "message": template["message"],
        "icon": template["icon"],
        "icon_color": colors["icon"],
        "bg_color": colors["bg"],
        "action_url": template["action_url"],
        "action_text": template["action_text"],
        "is_read": False,
        "is_deleted": False,
        "created_at": datetime.utcnow()
    }
    
    result = await collection.insert_one(doc)
    notification_id = str(result.inserted_id)
    
    # Send real-time notification via Socket.IO
    notification_data = {
        "id": notification_id,
        "user_id": user_id,
        "type": notification_type,
        "category": template["category"],
        "priority": "normal",
        "title": template["title"],
        "message": template["message"],
        "icon": template["icon"],
        "icon_color": colors["icon"],
        "bg_color": colors["bg"],
        "action_url": template["action_url"],
        "action_text": template["action_text"],
        "is_read": False,
        "created_at": datetime.utcnow().isoformat()
    }
    
    try:
        await send_notification_to_user(user_id, notification_data)
    except Exception as e:
        print(f"Socket.IO error: {e}")
    
    return {
        "message": "Test notification created and sent",
        "notification_id": notification_id,
        "notification": notification_data
    }
