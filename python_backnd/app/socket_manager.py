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
