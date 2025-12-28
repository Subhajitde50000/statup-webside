"""
Migration script to add favorite_professionals field to existing users
"""

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings


async def migrate_favorites_field():
    """Add favorite_professionals field to users who don't have it"""
    
    # Connect to MongoDB
    client = AsyncIOMotorClient(settings.MONGO_URL)
    db = client[settings.DATABASE_NAME]
    users_collection = db["users"]
    
    print("Starting migration: Adding favorite_professionals field...")
    
    # Update all users that don't have the field
    result = await users_collection.update_many(
        {"favorite_professionals": {"$exists": False}},
        {"$set": {"favorite_professionals": []}}
    )
    
    print(f"✅ Migration complete!")
    print(f"   - Modified {result.modified_count} user documents")
    print(f"   - Matched {result.matched_count} user documents without the field")
    
    # Close connection
    client.close()


if __name__ == "__main__":
    print("=" * 50)
    print("Favorites Field Migration")
    print("=" * 50)
    asyncio.run(migrate_favorites_field())
