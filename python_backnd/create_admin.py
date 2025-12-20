"""
Script to create an admin user in the database
Run this script once to add an admin account
"""

import asyncio
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient
from app.utils.security import hash_password
from app.config import settings

# Admin credentials
ADMIN_DATA = {
    "name": "Admin User",
    "email": "admin@electronics.com",
    "phone": "+919999999999",
    "password": "Admin@123",  # Change this to a secure password
    "role": "admin"
}


async def create_admin():
    """Create admin user in MongoDB"""
    
    # Connect to MongoDB
    client = AsyncIOMotorClient(settings.MONGO_URL)
    db = client[settings.DATABASE_NAME]
    users_collection = db["users"]
    
    try:
        # Check if admin already exists
        existing_admin = await users_collection.find_one({
            "email": ADMIN_DATA["email"]
        })
        
        if existing_admin:
            print(f"❌ Admin user already exists with email: {ADMIN_DATA['email']}")
            return
        
        # Create admin user document
        admin_user = {
            "name": ADMIN_DATA["name"],
            "email": ADMIN_DATA["email"],
            "phone": ADMIN_DATA["phone"],
            "hashed_password": hash_password(ADMIN_DATA["password"]),
            "role": ADMIN_DATA["role"],
            "auth_provider": "local",
            "is_verified": True,  # Admin is pre-verified
            "is_active": True,
            "email_verified": True,
            "phone_verified": True,
            "profile_image": None,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }
        
        # Insert admin user
        result = await users_collection.insert_one(admin_user)
        
        print("✅ Admin user created successfully!")
        print(f"📧 Email: {ADMIN_DATA['email']}")
        print(f"📱 Phone: {ADMIN_DATA['phone']}")
        print(f"🔑 Password: {ADMIN_DATA['password']}")
        print(f"🆔 User ID: {result.inserted_id}")
        print("\n⚠️  Please change the password after first login!")
        
    except Exception as e:
        print(f"❌ Error creating admin user: {str(e)}")
    finally:
        client.close()


if __name__ == "__main__":
    print("🚀 Creating admin user...")
    asyncio.run(create_admin())
