"""
Socket.IO manager for real-time notifications
"""

import socketio
from typing import Dict, Set
from datetime import datetime
import json


# Create Socket.IO server with async mode
sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins='*',  # Allow all origins for Socket.IO
    ping_timeout=60,
    ping_interval=25,
    logger=True,
    engineio_logger=True
)

# Store connected users - user_id -> set of session IDs
connected_users: Dict[str, Set[str]] = {}


def get_socket_app():
    """Get Socket.IO ASGI app"""
    return socketio.ASGIApp(sio)


@sio.event
async def connect(sid, environ, auth):
    """Handle client connection"""
    print(f"Client connected: {sid}")
    
    # Get user_id from auth data
    user_id = None
    if auth and isinstance(auth, dict):
        user_id = auth.get('user_id')
    
    if user_id:
        # Add to connected users
        if user_id not in connected_users:
            connected_users[user_id] = set()
        connected_users[user_id].add(sid)
        
        # Join user's personal room
        await sio.enter_room(sid, f"user_{user_id}")
        
        # Save user_id in session
        await sio.save_session(sid, {'user_id': user_id})
        
        print(f"User {user_id} connected with session {sid}")
        
        # Send connection confirmation
        await sio.emit('connected', {
            'message': 'Connected to notification server',
            'user_id': user_id,
            'timestamp': datetime.utcnow().isoformat()
        }, room=sid)


@sio.event
async def disconnect(sid):
    """Handle client disconnection"""
    print(f"Client disconnected: {sid}")
    
    # Get user_id from session
    session = await sio.get_session(sid)
    user_id = session.get('user_id') if session else None
    
    if user_id and user_id in connected_users:
        connected_users[user_id].discard(sid)
        if not connected_users[user_id]:
            del connected_users[user_id]
        print(f"User {user_id} disconnected")


@sio.event
async def authenticate(sid, data):
    """Handle authentication after connection"""
    user_id = data.get('user_id')
    
    if user_id:
        # Add to connected users
        if user_id not in connected_users:
            connected_users[user_id] = set()
        connected_users[user_id].add(sid)
        
        # Join user's personal room
        await sio.enter_room(sid, f"user_{user_id}")
        
        # Save user_id in session
        await sio.save_session(sid, {'user_id': user_id})
        
        print(f"User {user_id} authenticated with session {sid}")
        
        await sio.emit('authenticated', {
            'success': True,
            'user_id': user_id
        }, room=sid)
    else:
        await sio.emit('authenticated', {
            'success': False,
            'error': 'No user_id provided'
        }, room=sid)


@sio.event
async def join_room(sid, data):
    """Allow user to join additional rooms (e.g., for booking updates)"""
    room = data.get('room')
    if room:
        await sio.enter_room(sid, room)
        print(f"Session {sid} joined room {room}")


@sio.event
async def leave_room(sid, data):
    """Allow user to leave a room"""
    room = data.get('room')
    if room:
        await sio.leave_room(sid, room)
        print(f"Session {sid} left room {room}")


@sio.event
async def mark_read(sid, data):
    """Handle mark notification as read event"""
    notification_id = data.get('notification_id')
    if notification_id:
        # This event can be handled by the frontend to sync across tabs
        session = await sio.get_session(sid)
        user_id = session.get('user_id') if session else None
        
        if user_id:
            # Emit to all user's sessions
            await sio.emit('notification_read', {
                'notification_id': notification_id,
                'timestamp': datetime.utcnow().isoformat()
            }, room=f"user_{user_id}")


# Utility functions for sending notifications

async def send_notification_to_user(user_id: str, notification: dict):
    """Send notification to a specific user"""
    room = f"user_{user_id}"
    
    # Add timestamp if not present
    if 'timestamp' not in notification:
        notification['timestamp'] = datetime.utcnow().isoformat()
    
    await sio.emit('new_notification', notification, room=room)
    print(f"Sent notification to user {user_id}: {notification.get('title', 'No title')}")


async def send_notification_to_room(room: str, notification: dict):
    """Send notification to a room (e.g., all users in a booking)"""
    if 'timestamp' not in notification:
        notification['timestamp'] = datetime.utcnow().isoformat()
    
    await sio.emit('new_notification', notification, room=room)
    print(f"Sent notification to room {room}")


async def broadcast_notification(notification: dict, exclude_user: str = None):
    """Broadcast notification to all connected users"""
    if 'timestamp' not in notification:
        notification['timestamp'] = datetime.utcnow().isoformat()
    
    for user_id in connected_users.keys():
        if user_id != exclude_user:
            await sio.emit('new_notification', notification, room=f"user_{user_id}")


def is_user_online(user_id: str) -> bool:
    """Check if a user is currently connected"""
    return user_id in connected_users and len(connected_users[user_id]) > 0


def get_online_users() -> list:
    """Get list of online user IDs"""
    return list(connected_users.keys())


def get_online_count() -> int:
    """Get count of online users"""
    return len(connected_users)


# ============================================
# BOOKING REAL-TIME EVENTS
# ============================================

@sio.event
async def join_booking_room(sid, data):
    """Allow user to join a booking-specific room for real-time updates"""
    booking_id = data.get('booking_id')
    if booking_id:
        room = f"booking_{booking_id}"
        await sio.enter_room(sid, room)
        print(f"Session {sid} joined booking room {room}")
        await sio.emit('joined_booking_room', {
            'booking_id': booking_id,
            'message': f'Joined booking room {booking_id}'
        }, room=sid)


@sio.event
async def leave_booking_room(sid, data):
    """Allow user to leave a booking room"""
    booking_id = data.get('booking_id')
    if booking_id:
        room = f"booking_{booking_id}"
        await sio.leave_room(sid, room)
        print(f"Session {sid} left booking room {room}")


async def emit_booking_status_update(booking_id: str, status: str, data: dict = None):
    """Emit booking status update to all users in the booking room"""
    room = f"booking_{booking_id}"
    event_data = {
        'booking_id': booking_id,
        'status': status,
        'timestamp': datetime.utcnow().isoformat(),
        **(data or {})
    }
    await sio.emit('booking_status_update', event_data, room=room)
    print(f"Emitted booking status update to room {room}: {status}")


async def emit_booking_confirmed(booking_id: str, user_id: str, professional_id: str, booking_data: dict = None):
    """Emit when user confirms a booking - notify professional"""
    # Notify both user and professional
    for uid in [user_id, professional_id]:
        await sio.emit('booking_confirmed', {
            'booking_id': booking_id,
            'message': 'New booking confirmed',
            'booking': booking_data,
            'timestamp': datetime.utcnow().isoformat()
        }, room=f"user_{uid}")
    
    # Also emit to booking room
    await emit_booking_status_update(booking_id, 'confirmed', booking_data)
    print(f"Booking {booking_id} confirmed - notified user {user_id} and professional {professional_id}")


async def emit_booking_accepted(booking_id: str, user_id: str, professional_id: str, booking_data: dict = None):
    """Emit when professional accepts a booking - notify user"""
    # Notify user
    await sio.emit('booking_accepted', {
        'booking_id': booking_id,
        'message': 'Professional has accepted your booking',
        'booking': booking_data,
        'timestamp': datetime.utcnow().isoformat()
    }, room=f"user_{user_id}")
    
    # Notify professional (confirmation)
    await sio.emit('booking_accepted', {
        'booking_id': booking_id,
        'message': 'You have accepted the booking',
        'booking': booking_data,
        'timestamp': datetime.utcnow().isoformat()
    }, room=f"user_{professional_id}")
    
    # Emit to booking room
    await emit_booking_status_update(booking_id, 'accepted', booking_data)
    print(f"Booking {booking_id} accepted by professional {professional_id}")


async def emit_otp_sent(booking_id: str, user_id: str, professional_id: str, otp: str = None):
    """Emit when professional sends OTP request - notify user to share OTP"""
    # Notify user that professional has arrived and needs OTP
    await sio.emit('otp_requested', {
        'booking_id': booking_id,
        'message': 'Professional has arrived. Please share the OTP to start work.',
        'otp': otp,  # Send OTP to user so they can verify
        'timestamp': datetime.utcnow().isoformat()
    }, room=f"user_{user_id}")
    
    # Notify professional that OTP request was sent
    await sio.emit('otp_request_sent', {
        'booking_id': booking_id,
        'message': 'OTP request sent to customer',
        'timestamp': datetime.utcnow().isoformat()
    }, room=f"user_{professional_id}")
    
    # Emit to booking room
    await emit_booking_status_update(booking_id, 'otp_requested', {'message': 'Professional arrived, OTP verification pending'})
    print(f"OTP request sent for booking {booking_id}")


async def emit_work_started(booking_id: str, user_id: str, professional_id: str, booking_data: dict = None):
    """Emit when OTP is verified and work starts"""
    # Notify user
    await sio.emit('work_started', {
        'booking_id': booking_id,
        'message': 'Work has started on your booking',
        'booking': booking_data,
        'timestamp': datetime.utcnow().isoformat()
    }, room=f"user_{user_id}")
    
    # Notify professional
    await sio.emit('work_started', {
        'booking_id': booking_id,
        'message': 'Work started - OTP verified successfully',
        'booking': booking_data,
        'timestamp': datetime.utcnow().isoformat()
    }, room=f"user_{professional_id}")
    
    # Emit to booking room
    await emit_booking_status_update(booking_id, 'ongoing', booking_data)
    print(f"Work started on booking {booking_id}")


async def emit_work_completed(booking_id: str, user_id: str, professional_id: str, booking_data: dict = None):
    """Emit when work is completed"""
    # Notify user
    await sio.emit('work_completed', {
        'booking_id': booking_id,
        'message': 'Work has been completed. Please rate your experience.',
        'booking': booking_data,
        'timestamp': datetime.utcnow().isoformat()
    }, room=f"user_{user_id}")
    
    # Notify professional
    await sio.emit('work_completed', {
        'booking_id': booking_id,
        'message': 'Job completed successfully',
        'booking': booking_data,
        'timestamp': datetime.utcnow().isoformat()
    }, room=f"user_{professional_id}")
    
    # Emit to booking room
    await emit_booking_status_update(booking_id, 'completed', booking_data)
    print(f"Work completed on booking {booking_id}")


async def emit_booking_cancelled(booking_id: str, user_id: str, professional_id: str, cancelled_by: str, reason: str = None):
    """Emit when booking is cancelled"""
    cancel_data = {
        'booking_id': booking_id,
        'cancelled_by': cancelled_by,
        'reason': reason,
        'timestamp': datetime.utcnow().isoformat()
    }
    
    # Notify user
    await sio.emit('booking_cancelled', {
        **cancel_data,
        'message': 'Your booking has been cancelled' if cancelled_by == 'user' else 'Professional has cancelled the booking'
    }, room=f"user_{user_id}")
    
    # Notify professional
    if professional_id:
        await sio.emit('booking_cancelled', {
            **cancel_data,
            'message': 'Booking has been cancelled by customer' if cancelled_by == 'user' else 'You have cancelled the booking'
        }, room=f"user_{professional_id}")
    
    # Emit to booking room
    await emit_booking_status_update(booking_id, 'cancelled', cancel_data)
    print(f"Booking {booking_id} cancelled by {cancelled_by}")


# ============================================
# REAL-TIME MESSAGING EVENTS
# ============================================

@sio.event
async def join_conversation(sid, data):
    """Allow user to join a conversation room for real-time messages"""
    conversation_id = data.get('conversation_id')
    if conversation_id:
        room = f"conversation_{conversation_id}"
        await sio.enter_room(sid, room)
        print(f"Session {sid} joined conversation room {room}")
        await sio.emit('joined_conversation', {
            'conversation_id': conversation_id,
            'message': f'Joined conversation room'
        }, room=sid)


@sio.event
async def leave_conversation(sid, data):
    """Allow user to leave a conversation room"""
    conversation_id = data.get('conversation_id')
    if conversation_id:
        room = f"conversation_{conversation_id}"
        await sio.leave_room(sid, room)
        print(f"Session {sid} left conversation room {room}")


@sio.event
async def typing(sid, data):
    """Handle typing indicator event from client"""
    conversation_id = data.get('conversation_id')
    is_typing = data.get('is_typing', False)
    
    session = await sio.get_session(sid)
    user_id = session.get('user_id') if session else None
    user_name = data.get('user_name', 'User')
    
    if conversation_id and user_id:
        # Emit to conversation room (excluding sender)
        await sio.emit('user_typing', {
            'conversation_id': conversation_id,
            'user_id': user_id,
            'user_name': user_name,
            'is_typing': is_typing,
            'timestamp': datetime.utcnow().isoformat()
        }, room=f"conversation_{conversation_id}", skip_sid=sid)


@sio.event
async def message_seen(sid, data):
    """Handle message seen event from client"""
    message_id = data.get('message_id')
    conversation_id = data.get('conversation_id')
    
    session = await sio.get_session(sid)
    user_id = session.get('user_id') if session else None
    
    if message_id and conversation_id and user_id:
        # Emit to conversation room
        await sio.emit('message_status_changed', {
            'message_id': message_id,
            'conversation_id': conversation_id,
            'status': 'seen',
            'seen_by': user_id,
            'timestamp': datetime.utcnow().isoformat()
        }, room=f"conversation_{conversation_id}")


# Utility functions for messaging

async def emit_new_message(conversation_id: str, message: dict, sender_id: str, receiver_id: str):
    """Emit new message to conversation participants"""
    room = f"conversation_{conversation_id}"
    
    event_data = {
        'message': message,
        'conversation_id': conversation_id,
        'sender_id': sender_id,
        'timestamp': datetime.utcnow().isoformat()
    }
    
    # Emit to conversation room (both participants if they're in it)
    await sio.emit('new_message', event_data, room=room)
    
    # Also emit to receiver's personal room in case they're not in conversation room
    await sio.emit('new_message', event_data, room=f"user_{receiver_id}")
    
    # Also emit to sender's personal room for immediate feedback/sync across tabs
    await sio.emit('new_message', event_data, room=f"user_{sender_id}")
    
    print(f"Emitted new message to conversation {conversation_id} (sender: {sender_id}, receiver: {receiver_id})")


async def emit_message_status_update(conversation_id: str, message_id: str, status: str, sender_id: str):
    """Emit message status update (delivered/seen)"""
    room = f"conversation_{conversation_id}"
    
    event_data = {
        'message_id': message_id,
        'conversation_id': conversation_id,
        'status': status,
        'timestamp': datetime.utcnow().isoformat()
    }
    
    await sio.emit('message_status_changed', event_data, room=room)
    
    # Also notify the original sender
    await sio.emit('message_status_changed', event_data, room=f"user_{sender_id}")
    
    print(f"Emitted message status update: {message_id} -> {status}")


async def emit_typing_indicator(conversation_id: str, user_id: str, user_name: str, is_typing: bool, receiver_id: str):
    """Emit typing indicator to conversation"""
    event_data = {
        'conversation_id': conversation_id,
        'user_id': user_id,
        'user_name': user_name,
        'is_typing': is_typing,
        'timestamp': datetime.utcnow().isoformat()
    }
    
    # Emit to conversation room
    await sio.emit('user_typing', event_data, room=f"conversation_{conversation_id}")
    
    # Also emit to receiver's personal room
    await sio.emit('user_typing', event_data, room=f"user_{receiver_id}")


async def emit_user_online_status(user_id: str, is_online: bool):
    """Emit user online status change"""
    event_data = {
        'user_id': user_id,
        'is_online': is_online,
        'last_seen': datetime.utcnow().isoformat() if not is_online else None,
        'timestamp': datetime.utcnow().isoformat()
    }
    
    # Broadcast to all connected users (they can filter relevant ones)
    await sio.emit('user_online_status', event_data)


# ============================================
# PRICE OFFER REAL-TIME EVENTS
# ============================================

@sio.event
async def join_offers_room(sid, data):
    """Allow professional to join their offers room for real-time updates"""
    session = await sio.get_session(sid)
    user_id = session.get('user_id') if session else None
    
    if user_id:
        room = f"offers_{user_id}"
        await sio.enter_room(sid, room)
        print(f"Session {sid} joined offers room {room}")
        await sio.emit('joined_offers_room', {
            'message': f'Joined offers room for user {user_id}'
        }, room=sid)


@sio.event
async def leave_offers_room(sid, data):
    """Allow user to leave their offers room"""
    session = await sio.get_session(sid)
    user_id = session.get('user_id') if session else None
    
    if user_id:
        room = f"offers_{user_id}"
        await sio.leave_room(sid, room)
        print(f"Session {sid} left offers room {room}")


async def emit_new_offer(professional_id: str, user_id: str, offer_data: dict):
    """Emit when a new price offer is created - notify professional"""
    event_data = {
        'type': 'new_offer',
        'offer': offer_data,
        'message': 'You received a new price offer',
        'timestamp': datetime.utcnow().isoformat()
    }
    
    # Notify professional
    await sio.emit('new_offer', event_data, room=f"user_{professional_id}")
    await sio.emit('new_offer', event_data, room=f"offers_{professional_id}")
    
    print(f"New offer from user {user_id} to professional {professional_id}")


async def emit_offer_accepted(user_id: str, professional_id: str, offer_data: dict):
    """Emit when professional accepts an offer - notify user"""
    event_data = {
        'type': 'offer_accepted',
        'offer': offer_data,
        'message': 'Your price offer has been accepted!',
        'timestamp': datetime.utcnow().isoformat()
    }
    
    # Notify user
    await sio.emit('offer_accepted', event_data, room=f"user_{user_id}")
    await sio.emit('offer_accepted', event_data, room=f"offers_{user_id}")
    
    print(f"Offer accepted by professional {professional_id} for user {user_id}")


async def emit_offer_rejected(user_id: str, professional_id: str, offer_data: dict):
    """Emit when professional rejects an offer - notify user"""
    event_data = {
        'type': 'offer_rejected',
        'offer': offer_data,
        'message': 'Your price offer has been rejected',
        'timestamp': datetime.utcnow().isoformat()
    }
    
    # Notify user
    await sio.emit('offer_rejected', event_data, room=f"user_{user_id}")
    await sio.emit('offer_rejected', event_data, room=f"offers_{user_id}")
    
    print(f"Offer rejected by professional {professional_id} for user {user_id}")


async def emit_offer_cancelled(user_id: str, professional_id: str, offer_data: dict):
    """Emit when user cancels an offer - notify professional"""
    event_data = {
        'type': 'offer_cancelled',
        'offer': offer_data,
        'message': 'A price offer has been cancelled',
        'timestamp': datetime.utcnow().isoformat()
    }
    
    # Notify professional
    await sio.emit('offer_cancelled', event_data, room=f"user_{professional_id}")
    await sio.emit('offer_cancelled', event_data, room=f"offers_{professional_id}")
    
    print(f"Offer cancelled by user {user_id} to professional {professional_id}")


async def emit_offer_revoked(user_id: str, professional_id: str, offer_data: dict):
    """Emit when professional revokes an accepted offer - notify user"""
    event_data = {
        'type': 'offer_revoked',
        'offer': offer_data,
        'message': 'The professional has revoked the accepted price offer',
        'timestamp': datetime.utcnow().isoformat()
    }
    
    # Notify user
    await sio.emit('offer_revoked', event_data, room=f"user_{user_id}")
    await sio.emit('offer_revoked', event_data, room=f"offers_{user_id}")
    
    print(f"Offer revoked by professional {professional_id} for user {user_id}")
