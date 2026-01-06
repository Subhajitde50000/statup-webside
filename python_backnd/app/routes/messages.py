"""
Messages and Conversations API Routes
Real-time messaging between users and professionals
"""

from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional, List
from datetime import datetime
from bson import ObjectId

from app.database import get_database
from app.utils.security import get_current_user
from app.schemas.message import (
    SendMessageRequest, StartConversationRequest, UpdateMessageStatusRequest,
    EditMessageRequest, MessageResponse, ConversationResponse, 
    ConversationListResponse, MessagesListResponse, SendMessageResponse,
    ConversationDetailResponse, ParticipantResponse, BookingReferenceResponse,
    LocationDataResponse, ImageDataResponse
)
from app.models.message import (
    MessageType, MessageStatus, ConversationStatus, ParticipantRole,
    Participant, MessageInDB, ConversationInDB, LocationData, ImageData,
    BookingReference
)
from app.socket_manager import (
    sio, send_notification_to_user, is_user_online,
    emit_new_message, emit_message_status_update, emit_typing_indicator
)

router = APIRouter()


# ============================================
# HELPER FUNCTIONS
# ============================================

def serialize_message(message: dict, sender_info: dict = None) -> MessageResponse:
    """Convert database message to response format"""
    return MessageResponse(
        id=str(message["_id"]),
        conversation_id=message["conversation_id"],
        sender_id=message["sender_id"],
        sender_role=message["sender_role"],
        message_type=message["message_type"],
        content=message["content"],
        status=message["status"],
        image_data=ImageDataResponse(**message["image_data"]) if message.get("image_data") else None,
        location_data=LocationDataResponse(**message["location_data"]) if message.get("location_data") else None,
        reply_to_message_id=message.get("reply_to_message_id"),
        is_deleted=message.get("is_deleted", False),
        created_at=message["created_at"].isoformat() if isinstance(message["created_at"], datetime) else message["created_at"],
        delivered_at=message["delivered_at"].isoformat() if message.get("delivered_at") and isinstance(message["delivered_at"], datetime) else message.get("delivered_at"),
        seen_at=message["seen_at"].isoformat() if message.get("seen_at") and isinstance(message["seen_at"], datetime) else message.get("seen_at"),
        edited_at=message["edited_at"].isoformat() if message.get("edited_at") and isinstance(message["edited_at"], datetime) else message.get("edited_at"),
        sender_name=sender_info.get("name") if sender_info else None,
        sender_photo=sender_info.get("photo") if sender_info else None
    )


def serialize_participant(participant: dict) -> ParticipantResponse:
    """Convert participant to response format"""
    return ParticipantResponse(
        user_id=participant["user_id"],
        role=participant["role"],
        name=participant["name"],
        photo=participant.get("photo"),
        phone=participant.get("phone"),
        is_online=participant.get("is_online", False),
        last_seen=participant["last_seen"].isoformat() if participant.get("last_seen") and isinstance(participant["last_seen"], datetime) else participant.get("last_seen"),
        unread_count=participant.get("unread_count", 0),
        is_muted=participant.get("is_muted", False)
    )


def serialize_conversation(conversation: dict, current_user_id: str) -> ConversationResponse:
    """Convert database conversation to response format"""
    participants = [serialize_participant(p) for p in conversation.get("participants", [])]
    
    # Find other participant for display
    other_participant = None
    unread_count = 0
    for p in conversation.get("participants", []):
        if p["user_id"] == current_user_id:
            unread_count = p.get("unread_count", 0)
        else:
            other_participant = serialize_participant(p)
    
    booking_ref = None
    if conversation.get("booking_reference"):
        booking_ref = BookingReferenceResponse(**conversation["booking_reference"])
    
    return ConversationResponse(
        id=str(conversation["_id"]),
        user_id=conversation["user_id"],
        professional_id=conversation["professional_id"],
        participants=participants,
        booking_id=conversation.get("booking_id"),
        booking_reference=booking_ref,
        status=conversation["status"],
        last_message_content=conversation.get("last_message_content"),
        last_message_type=conversation.get("last_message_type"),
        last_message_sender_id=conversation.get("last_message_sender_id"),
        last_message_at=conversation["last_message_at"].isoformat() if conversation.get("last_message_at") and isinstance(conversation["last_message_at"], datetime) else conversation.get("last_message_at"),
        is_priority=conversation.get("is_priority", False),
        priority_text=conversation.get("priority_text"),
        service_badge=conversation.get("service_badge"),
        service_badge_color=conversation.get("service_badge_color"),
        unread_count=unread_count,
        created_at=conversation["created_at"].isoformat() if isinstance(conversation["created_at"], datetime) else conversation["created_at"],
        updated_at=conversation["updated_at"].isoformat() if isinstance(conversation["updated_at"], datetime) else conversation["updated_at"],
        other_participant=other_participant
    )


async def get_or_create_conversation(
    db, user_id: str, professional_id: str, booking_id: str = None
) -> dict:
    """Get existing conversation or create new one"""
    # Try to find existing conversation
    query = {
        "user_id": user_id,
        "professional_id": professional_id,
        "status": {"$ne": ConversationStatus.CLOSED.value}
    }
    
    if booking_id:
        query["booking_id"] = booking_id
    
    conversation = await db.conversations.find_one(query)
    
    if conversation:
        return conversation
    
    # Create new conversation
    # Get user and professional info
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    professional = await db.users.find_one({"_id": ObjectId(professional_id)})
    
    if not user or not professional:
        raise HTTPException(status_code=404, detail="User or professional not found")
    
    # Get booking info if provided
    booking_reference = None
    service_badge = None
    service_badge_color = "bg-teal-500"
    
    if booking_id:
        booking = await db.bookings.find_one({"_id": ObjectId(booking_id)})
        if booking:
            booking_reference = {
                "booking_id": str(booking["_id"]),
                "service_name": booking.get("service_name", booking.get("service_type", "")),
                "service_type": booking.get("service_type", ""),
                "scheduled_date": booking.get("date", ""),
                "scheduled_time": booking.get("time", ""),
                "status": booking.get("status", ""),
                "price": booking.get("price", 0),
                "address": booking.get("address_display", "")
            }
            service_badge = booking.get("service_name", booking.get("service_type", ""))
    
    # Create participants
    participants = [
        {
            "user_id": user_id,
            "role": ParticipantRole.USER.value,
            "name": user.get("name", "User"),
            "photo": user.get("profile_image"),
            "phone": user.get("phone"),
            "is_online": is_user_online(user_id),
            "last_seen": datetime.utcnow(),
            "unread_count": 0,
            "is_muted": False,
            "is_blocked": False,
            "joined_at": datetime.utcnow()
        },
        {
            "user_id": professional_id,
            "role": ParticipantRole.PROFESSIONAL.value,
            "name": professional.get("name", "Professional"),
            "photo": professional.get("profile_image"),
            "phone": professional.get("phone"),
            "is_online": is_user_online(professional_id),
            "last_seen": datetime.utcnow(),
            "unread_count": 0,
            "is_muted": False,
            "is_blocked": False,
            "joined_at": datetime.utcnow()
        }
    ]
    
    new_conversation = {
        "participants": participants,
        "user_id": user_id,
        "professional_id": professional_id,
        "booking_id": booking_id,
        "booking_reference": booking_reference,
        "status": ConversationStatus.ACTIVE.value,
        "last_message_id": None,
        "last_message_content": None,
        "last_message_type": None,
        "last_message_sender_id": None,
        "last_message_at": None,
        "is_priority": False,
        "priority_text": None,
        "service_badge": service_badge,
        "service_badge_color": service_badge_color,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    result = await db.conversations.insert_one(new_conversation)
    new_conversation["_id"] = result.inserted_id
    
    return new_conversation


# ============================================
# CONVERSATION ENDPOINTS
# ============================================

@router.get("/conversations", response_model=ConversationListResponse)
async def get_conversations(
    status: Optional[str] = Query(None, description="Filter by conversation status"),
    booking_status: Optional[str] = Query(None, description="Filter by booking status"),
    search: Optional[str] = Query(None, description="Search in participant names or messages"),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    current_user: dict = Depends(get_current_user)
):
    """Get all conversations for the current user"""
    db = get_database()
    user_id = str(current_user["_id"])
    
    # Build query
    query = {
        "$or": [
            {"user_id": user_id},
            {"professional_id": user_id}
        ]
    }
    
    if status:
        query["status"] = status
    
    if booking_status:
        query["booking_reference.status"] = booking_status
    
    if search:
        query["$or"] = [
            {"participants.name": {"$regex": search, "$options": "i"}},
            {"last_message_content": {"$regex": search, "$options": "i"}},
            {"service_badge": {"$regex": search, "$options": "i"}}
        ]
    
    # Get total count
    total = await db.conversations.count_documents(query)
    
    # Get conversations sorted by last message time
    cursor = db.conversations.find(query).sort("last_message_at", -1).skip(skip).limit(limit)
    conversations = await cursor.to_list(length=limit)
    
    # Calculate total unread
    unread_total = 0
    serialized_conversations = []
    for conv in conversations:
        serialized = serialize_conversation(conv, user_id)
        serialized_conversations.append(serialized)
        unread_total += serialized.unread_count
    
    return ConversationListResponse(
        conversations=serialized_conversations,
        total=total,
        unread_total=unread_total,
        skip=skip,
        limit=limit
    )


@router.get("/conversations/{conversation_id}", response_model=ConversationDetailResponse)
async def get_conversation_detail(
    conversation_id: str,
    messages_limit: int = Query(50, ge=1, le=100),
    current_user: dict = Depends(get_current_user)
):
    """Get conversation details with recent messages"""
    db = get_database()
    user_id = str(current_user["_id"])
    
    # Get conversation
    conversation = await db.conversations.find_one({"_id": ObjectId(conversation_id)})
    
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    # Check if user is a participant
    if conversation["user_id"] != user_id and conversation["professional_id"] != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to view this conversation")
    
    # Get recent messages
    messages_cursor = db.messages.find(
        {"conversation_id": conversation_id}
    ).sort("created_at", -1).limit(messages_limit)
    messages = await messages_cursor.to_list(length=messages_limit)
    messages.reverse()  # Reverse to get chronological order
    
    # Get total message count
    total_messages = await db.messages.count_documents({"conversation_id": conversation_id})
    
    # Serialize messages with sender info
    serialized_messages = []
    for msg in messages:
        sender_info = None
        for p in conversation.get("participants", []):
            if p["user_id"] == msg["sender_id"]:
                sender_info = {"name": p["name"], "photo": p.get("photo")}
                break
        serialized_messages.append(serialize_message(msg, sender_info))
    
    return ConversationDetailResponse(
        conversation=serialize_conversation(conversation, user_id),
        messages=serialized_messages,
        total_messages=total_messages
    )


@router.post("/conversations/start", response_model=ConversationResponse)
async def start_conversation(
    request: StartConversationRequest,
    current_user: dict = Depends(get_current_user)
):
    """Start a new conversation with a professional"""
    db = get_database()
    user_id = str(current_user["_id"])
    
    # Get or create conversation
    conversation = await get_or_create_conversation(
        db, user_id, request.professional_id, request.booking_id
    )
    
    # If initial message provided, send it
    if request.initial_message:
        await create_and_send_message(
            db=db,
            conversation=conversation,
            sender_id=user_id,
            sender_role=ParticipantRole.USER.value,
            message_type=MessageType.TEXT.value,
            content=request.initial_message
        )
        # Refresh conversation
        conversation = await db.conversations.find_one({"_id": conversation["_id"]})
    
    return serialize_conversation(conversation, user_id)


# ============================================
# MESSAGE ENDPOINTS
# ============================================

@router.get("/conversations/{conversation_id}/messages", response_model=MessagesListResponse)
async def get_messages(
    conversation_id: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    before_id: Optional[str] = Query(None, description="Get messages before this message ID"),
    current_user: dict = Depends(get_current_user)
):
    """Get messages for a conversation with pagination"""
    db = get_database()
    user_id = str(current_user["_id"])
    
    # Get conversation
    conversation = await db.conversations.find_one({"_id": ObjectId(conversation_id)})
    
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    # Check authorization
    if conversation["user_id"] != user_id and conversation["professional_id"] != user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Build query
    query = {"conversation_id": conversation_id}
    
    if before_id:
        query["_id"] = {"$lt": ObjectId(before_id)}
    
    # Get total count
    total = await db.messages.count_documents({"conversation_id": conversation_id})
    
    # Get messages
    messages_cursor = db.messages.find(query).sort("created_at", -1).skip(skip).limit(limit)
    messages = await messages_cursor.to_list(length=limit)
    messages.reverse()
    
    # Serialize messages
    serialized_messages = []
    for msg in messages:
        sender_info = None
        for p in conversation.get("participants", []):
            if p["user_id"] == msg["sender_id"]:
                sender_info = {"name": p["name"], "photo": p.get("photo")}
                break
        serialized_messages.append(serialize_message(msg, sender_info))
    
    return MessagesListResponse(
        messages=serialized_messages,
        conversation=serialize_conversation(conversation, user_id),
        total=total,
        has_more=skip + limit < total,
        skip=skip,
        limit=limit
    )


async def create_and_send_message(
    db, conversation: dict, sender_id: str, sender_role: str,
    message_type: str, content: str, image_data: dict = None,
    location_data: dict = None, reply_to_message_id: str = None
) -> dict:
    """Create and send a message, update conversation, emit socket event"""
    conversation_id = str(conversation["_id"])
    
    # Create message
    message = {
        "conversation_id": conversation_id,
        "sender_id": sender_id,
        "sender_role": sender_role,
        "message_type": message_type,
        "content": content,
        "image_data": image_data,
        "location_data": location_data,
        "status": MessageStatus.SENT.value,
        "reply_to_message_id": reply_to_message_id,
        "is_deleted": False,
        "created_at": datetime.utcnow(),
        "delivered_at": None,
        "seen_at": None,
        "edited_at": None
    }
    
    result = await db.messages.insert_one(message)
    message["_id"] = result.inserted_id
    
    # Update conversation
    receiver_id = conversation["professional_id"] if sender_id == conversation["user_id"] else conversation["user_id"]
    
    # Increment unread count for receiver
    await db.conversations.update_one(
        {"_id": conversation["_id"]},
        {
            "$set": {
                "last_message_id": str(result.inserted_id),
                "last_message_content": content[:100] if len(content) > 100 else content,
                "last_message_type": message_type,
                "last_message_sender_id": sender_id,
                "last_message_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            "$inc": {
                f"participants.$[elem].unread_count": 1
            }
        },
        array_filters=[{"elem.user_id": receiver_id}]
    )
    
    # Get sender info
    sender_info = None
    for p in conversation.get("participants", []):
        if p["user_id"] == sender_id:
            sender_info = {"name": p["name"], "photo": p.get("photo")}
            break
    
    # Emit socket event
    try:
        await emit_new_message(
            conversation_id=conversation_id,
            message=serialize_message(message, sender_info).model_dump(),
            sender_id=sender_id,
            receiver_id=receiver_id
        )
    except Exception as e:
        print(f"Error emitting message: {e}")
    
    return message


@router.post("/messages/send", response_model=SendMessageResponse)
async def send_message(
    request: SendMessageRequest,
    current_user: dict = Depends(get_current_user)
):
    """Send a new message"""
    db = get_database()
    user_id = str(current_user["_id"])
    user_role = current_user.get("role", "user")
    
    # Determine sender role
    sender_role = ParticipantRole.PROFESSIONAL.value if user_role == "professional" else ParticipantRole.USER.value
    
    # Get or create conversation
    if request.conversation_id:
        conversation = await db.conversations.find_one({"_id": ObjectId(request.conversation_id)})
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        # Check authorization
        if conversation["user_id"] != user_id and conversation["professional_id"] != user_id:
            raise HTTPException(status_code=403, detail="Not authorized")
    else:
        # Create new conversation
        professional_id = request.receiver_id
        if user_role == "professional":
            # Professional starting conversation with user
            conversation = await get_or_create_conversation(
                db, request.receiver_id, user_id, request.booking_id
            )
        else:
            # User starting conversation with professional
            conversation = await get_or_create_conversation(
                db, user_id, professional_id, request.booking_id
            )
    
    # Prepare optional data
    image_data = None
    if request.message_type == MessageType.IMAGE and request.image_url:
        image_data = {
            "url": request.image_url,
            "thumbnail_url": request.image_thumbnail
        }
    
    location_data = None
    if request.message_type == MessageType.LOCATION and request.latitude and request.longitude:
        location_data = {
            "latitude": request.latitude,
            "longitude": request.longitude,
            "address": request.location_address
        }
    
    # Create and send message
    message = await create_and_send_message(
        db=db,
        conversation=conversation,
        sender_id=user_id,
        sender_role=sender_role,
        message_type=request.message_type.value,
        content=request.content,
        image_data=image_data,
        location_data=location_data,
        reply_to_message_id=request.reply_to_message_id
    )
    
    # Get sender info
    sender_info = {"name": current_user.get("name"), "photo": current_user.get("profile_image")}
    
    return SendMessageResponse(
        message="Message sent successfully",
        data=serialize_message(message, sender_info),
        conversation_id=str(conversation["_id"])
    )


@router.put("/messages/{message_id}/status", response_model=dict)
async def update_message_status(
    message_id: str,
    status: MessageStatus,
    current_user: dict = Depends(get_current_user)
):
    """Update message status (delivered/seen)"""
    db = get_database()
    user_id = str(current_user["_id"])
    
    # Get message
    message = await db.messages.find_one({"_id": ObjectId(message_id)})
    
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    # Get conversation to verify authorization
    conversation = await db.conversations.find_one({"_id": ObjectId(message["conversation_id"])})
    
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    if conversation["user_id"] != user_id and conversation["professional_id"] != user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Update status
    update_data = {"status": status.value}
    if status == MessageStatus.DELIVERED:
        update_data["delivered_at"] = datetime.utcnow()
    elif status == MessageStatus.SEEN:
        update_data["seen_at"] = datetime.utcnow()
        if not message.get("delivered_at"):
            update_data["delivered_at"] = datetime.utcnow()
    
    await db.messages.update_one(
        {"_id": ObjectId(message_id)},
        {"$set": update_data}
    )
    
    # Emit socket event
    try:
        await emit_message_status_update(
            conversation_id=message["conversation_id"],
            message_id=message_id,
            status=status.value,
            sender_id=message["sender_id"]
        )
    except Exception as e:
        print(f"Error emitting status update: {e}")
    
    return {"message": "Status updated", "status": status.value}


@router.post("/conversations/{conversation_id}/mark-read", response_model=dict)
async def mark_conversation_read(
    conversation_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Mark all messages in a conversation as read"""
    db = get_database()
    user_id = str(current_user["_id"])
    
    # Get conversation
    conversation = await db.conversations.find_one({"_id": ObjectId(conversation_id)})
    
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    if conversation["user_id"] != user_id and conversation["professional_id"] != user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Update all unread messages from other participants as seen
    other_participant_id = conversation["professional_id"] if conversation["user_id"] == user_id else conversation["user_id"]
    
    await db.messages.update_many(
        {
            "conversation_id": conversation_id,
            "sender_id": other_participant_id,
            "status": {"$ne": MessageStatus.SEEN.value}
        },
        {
            "$set": {
                "status": MessageStatus.SEEN.value,
                "seen_at": datetime.utcnow()
            }
        }
    )
    
    # Reset unread count for current user
    await db.conversations.update_one(
        {"_id": ObjectId(conversation_id)},
        {
            "$set": {
                "participants.$[elem].unread_count": 0
            }
        },
        array_filters=[{"elem.user_id": user_id}]
    )
    
    # Emit socket event for message status updates
    try:
        await emit_message_status_update(
            conversation_id=conversation_id,
            message_id="all",
            status=MessageStatus.SEEN.value,
            sender_id=other_participant_id
        )
    except Exception as e:
        print(f"Error emitting bulk status update: {e}")
    
    return {"message": "Conversation marked as read"}


@router.delete("/messages/{message_id}", response_model=dict)
async def delete_message(
    message_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete a message (soft delete)"""
    db = get_database()
    user_id = str(current_user["_id"])
    
    # Get message
    message = await db.messages.find_one({"_id": ObjectId(message_id)})
    
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    # Only sender can delete
    if message["sender_id"] != user_id:
        raise HTTPException(status_code=403, detail="Only sender can delete this message")
    
    # Soft delete
    await db.messages.update_one(
        {"_id": ObjectId(message_id)},
        {
            "$set": {
                "is_deleted": True,
                "deleted_at": datetime.utcnow(),
                "content": "This message was deleted"
            }
        }
    )
    
    return {"message": "Message deleted"}


@router.put("/messages/{message_id}/edit", response_model=MessageResponse)
async def edit_message(
    message_id: str,
    request: EditMessageRequest,
    current_user: dict = Depends(get_current_user)
):
    """Edit a message"""
    db = get_database()
    user_id = str(current_user["_id"])
    
    # Get message
    message = await db.messages.find_one({"_id": ObjectId(message_id)})
    
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    # Only sender can edit
    if message["sender_id"] != user_id:
        raise HTTPException(status_code=403, detail="Only sender can edit this message")
    
    # Only text messages can be edited
    if message["message_type"] != MessageType.TEXT.value:
        raise HTTPException(status_code=400, detail="Only text messages can be edited")
    
    # Update message
    await db.messages.update_one(
        {"_id": ObjectId(message_id)},
        {
            "$set": {
                "content": request.content,
                "edited_at": datetime.utcnow()
            }
        }
    )
    
    # Get updated message
    updated_message = await db.messages.find_one({"_id": ObjectId(message_id)})
    
    return serialize_message(updated_message)


@router.post("/conversations/{conversation_id}/typing", response_model=dict)
async def send_typing_indicator(
    conversation_id: str,
    is_typing: bool = True,
    current_user: dict = Depends(get_current_user)
):
    """Send typing indicator"""
    db = get_database()
    user_id = str(current_user["_id"])
    user_name = current_user.get("name", "User")
    
    # Get conversation to verify authorization and get receiver
    conversation = await db.conversations.find_one({"_id": ObjectId(conversation_id)})
    
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    if conversation["user_id"] != user_id and conversation["professional_id"] != user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Get receiver id
    receiver_id = conversation["professional_id"] if conversation["user_id"] == user_id else conversation["user_id"]
    
    # Emit typing indicator
    try:
        await emit_typing_indicator(
            conversation_id=conversation_id,
            user_id=user_id,
            user_name=user_name,
            is_typing=is_typing,
            receiver_id=receiver_id
        )
    except Exception as e:
        print(f"Error emitting typing indicator: {e}")
    
    return {"message": "Typing indicator sent"}


# ============================================
# CONVERSATION MANAGEMENT
# ============================================

@router.put("/conversations/{conversation_id}/mute", response_model=dict)
async def mute_conversation(
    conversation_id: str,
    mute: bool = True,
    current_user: dict = Depends(get_current_user)
):
    """Mute/unmute a conversation"""
    db = get_database()
    user_id = str(current_user["_id"])
    
    # Update user's mute status in conversation
    result = await db.conversations.update_one(
        {
            "_id": ObjectId(conversation_id),
            "$or": [{"user_id": user_id}, {"professional_id": user_id}]
        },
        {
            "$set": {
                "participants.$[elem].is_muted": mute
            }
        },
        array_filters=[{"elem.user_id": user_id}]
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Conversation not found or not authorized")
    
    return {"message": f"Conversation {'muted' if mute else 'unmuted'}"}


@router.put("/conversations/{conversation_id}/archive", response_model=dict)
async def archive_conversation(
    conversation_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Archive a conversation"""
    db = get_database()
    user_id = str(current_user["_id"])
    
    result = await db.conversations.update_one(
        {
            "_id": ObjectId(conversation_id),
            "$or": [{"user_id": user_id}, {"professional_id": user_id}]
        },
        {"$set": {"status": ConversationStatus.ARCHIVED.value, "updated_at": datetime.utcnow()}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Conversation not found or not authorized")
    
    return {"message": "Conversation archived"}


@router.get("/conversations/unread-count", response_model=dict)
async def get_unread_count(
    current_user: dict = Depends(get_current_user)
):
    """Get total unread message count"""
    db = get_database()
    user_id = str(current_user["_id"])
    
    # Aggregate unread counts
    pipeline = [
        {
            "$match": {
                "$or": [{"user_id": user_id}, {"professional_id": user_id}],
                "status": ConversationStatus.ACTIVE.value
            }
        },
        {"$unwind": "$participants"},
        {"$match": {"participants.user_id": user_id}},
        {"$group": {"_id": None, "total_unread": {"$sum": "$participants.unread_count"}}}
    ]
    
    result = await db.conversations.aggregate(pipeline).to_list(1)
    
    total_unread = result[0]["total_unread"] if result else 0
    
    return {"unread_count": total_unread}
