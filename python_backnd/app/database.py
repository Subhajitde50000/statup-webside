"""
Database configuration and connection management for MongoDB
"""

import os
from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional


class Database:
    client: Optional[AsyncIOMotorClient] = None
    db = None


db = Database()


# MongoDB Configuration
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "electronics_db")


async def connect_to_mongo():
    """Connect to MongoDB"""
    db.client = AsyncIOMotorClient(MONGO_URL)
    db.db = db.client[DATABASE_NAME]
    
    # Create indexes for better performance
    await create_indexes()
    
    print(f"Connected to MongoDB: {DATABASE_NAME}")


async def close_mongo_connection():
    """Close MongoDB connection"""
    if db.client:
        db.client.close()
        print("Closed MongoDB connection")


async def create_indexes():
    """Create database indexes"""
    try:
        # Get existing indexes
        existing_indexes = await db.db.users.index_information()
        
        # User collection indexes - only create if they don't exist
        if "email_1" not in existing_indexes:
            await db.db.users.create_index("email", unique=True, sparse=True)
        
        if "phone_1" not in existing_indexes:
            await db.db.users.create_index("phone", unique=True, sparse=True)
        
        if "role_1" not in existing_indexes:
            await db.db.users.create_index("role")
        
        # OTP collection indexes with TTL for auto-expiry
        otp_indexes = await db.db.otps.index_information()
        if "created_at_1" not in otp_indexes:
            await db.db.otps.create_index("created_at", expireAfterSeconds=600)  # 10 min expiry
        
        if "identifier_1_purpose_1" not in otp_indexes:
            await db.db.otps.create_index([("identifier", 1), ("purpose", 1)])
        
        # Password reset tokens with TTL
        reset_indexes = await db.db.password_resets.index_information()
        if "created_at_1" not in reset_indexes:
            await db.db.password_resets.create_index("created_at", expireAfterSeconds=3600)  # 1 hour expiry
        
        # Notification collection indexes
        notif_indexes = await db.db.notifications.index_information()
        if "user_id_1" not in notif_indexes:
            await db.db.notifications.create_index("user_id")
        if "user_id_1_created_at_-1" not in notif_indexes:
            await db.db.notifications.create_index([("user_id", 1), ("created_at", -1)])
        if "user_id_1_is_read_1" not in notif_indexes:
            await db.db.notifications.create_index([("user_id", 1), ("is_read", 1)])
        if "expires_at_1" not in notif_indexes:
            await db.db.notifications.create_index("expires_at", expireAfterSeconds=0)  # TTL index
        
        # Message collection indexes
        msg_indexes = await db.db.messages.index_information()
        if "conversation_id_1_created_at_-1" not in msg_indexes:
            await db.db.messages.create_index([("conversation_id", 1), ("created_at", -1)])
        if "sender_id_1" not in msg_indexes:
            await db.db.messages.create_index("sender_id")
        if "status_1" not in msg_indexes:
            await db.db.messages.create_index("status")
        
        # Conversation collection indexes
        conv_indexes = await db.db.conversations.index_information()
        if "user_id_1_professional_id_1" not in conv_indexes:
            await db.db.conversations.create_index([("user_id", 1), ("professional_id", 1)])
        if "user_id_1_status_1" not in conv_indexes:
            await db.db.conversations.create_index([("user_id", 1), ("status", 1)])
        if "professional_id_1_status_1" not in conv_indexes:
            await db.db.conversations.create_index([("professional_id", 1), ("status", 1)])
        if "last_message_at_-1" not in conv_indexes:
            await db.db.conversations.create_index([("last_message_at", -1)])
        if "booking_id_1" not in conv_indexes:
            await db.db.conversations.create_index("booking_id", sparse=True)
    
    except Exception as e:
        print(f"Warning: Error creating indexes: {e}")
        # Continue anyway - indexes might already exist


def get_database():
    """Get database instance"""
    return db.db


def get_users_collection():
    """Get users collection"""
    return db.db.users


def get_otps_collection():
    """Get OTPs collection"""
    return db.db.otps


def get_password_resets_collection():
    """Get password resets collection"""
    return db.db.password_resets


def get_refresh_tokens_collection():
    """Get refresh tokens collection"""
    return db.db.refresh_tokens


def get_verifications_collection():
    """Get verifications collection"""
    return db.db.verifications


def get_notifications_collection():
    """Get notifications collection"""
    return db.db.notifications


def get_notification_settings_collection():
    """Get notification settings collection"""
    return db.db.notification_settings
