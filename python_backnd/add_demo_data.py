"""
Script to add demo professionals and shops from JSON files to the database
Run this script to populate your database with test data
"""

import asyncio
import json
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient
from app.utils.security import hash_password
from app.config import settings


def parse_datetime(date_string):
    """Convert ISO format string to datetime object"""
    if date_string:
        return datetime.fromisoformat(date_string.replace('Z', '+00:00'))
    return None


async def add_professionals():
    """Add demo professionals from JSON file"""
    
    # Read JSON file
    try:
        with open('demo_professionals.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
    except FileNotFoundError:
        print("❌ Error: demo_professionals.json not found!")
        return
    except json.JSONDecodeError as e:
        print(f"❌ Error parsing JSON: {str(e)}")
        return
    
    # Connect to MongoDB
    client = AsyncIOMotorClient(settings.MONGO_URL)
    db = client[settings.DATABASE_NAME]
    users_collection = db["users"]
    
    try:
        professionals = data.get('professionals', [])
        created_count = 0
        skipped_count = 0
        
        print("\n🚀 Adding demo professionals...\n")
        print("=" * 80)
        
        for professional in professionals:
            # Check if professional already exists
            existing = await users_collection.find_one({
                "$or": [
                    {"email": professional["email"]},
                    {"phone": professional["phone"]}
                ]
            })
            
            if existing:
                print(f"\n⚠️  Professional already exists:")
                print(f"   👤 Name: {professional['name']}")
                print(f"   📧 Email: {professional['email']}")
                skipped_count += 1
                continue
            
            # Create user document
            user_doc = {
                "name": professional["name"],
                "email": professional["email"],
                "phone": professional["phone"],
                "hashed_password": hash_password(professional["password"]),
                "role": professional["role"],
                "auth_provider": professional["auth_provider"],
                "is_verified": professional["is_verified"],
                "is_active": professional["is_active"],
                "email_verified": professional["email_verified"],
                "phone_verified": professional["phone_verified"],
                "profile_image": professional.get("profile_image"),
                "approval_status": professional["approval_status"],
                "approval_data": professional["approval_data"],
                "admin_notes": professional.get("admin_notes"),
                "rejection_reason": professional.get("rejection_reason"),
                "reviewed_by": professional.get("reviewed_by"),
                "reviewed_at": parse_datetime(professional.get("reviewed_at")),
                "favorite_professionals": professional.get("favorite_professionals", []),
                "created_at": parse_datetime(professional.get("created_at")) or datetime.utcnow(),
                "updated_at": parse_datetime(professional.get("updated_at")) or datetime.utcnow(),
                "last_login": parse_datetime(professional.get("last_login")),
            }
            
            # Insert professional
            result = await users_collection.insert_one(user_doc)
            
            print(f"\n✅ Professional added successfully!")
            print(f"   👤 Name: {professional['name']}")
            print(f"   📧 Email: {professional['email']}")
            print(f"   📱 Phone: {professional['phone']}")
            print(f"   💼 Profession: {professional['approval_data'].get('profession')}")
            print(f"   📍 City: {professional['approval_data'].get('city')}")
            print(f"   🆔 User ID: {result.inserted_id}")
            
            created_count += 1
        
        print("\n" + "=" * 80)
        print(f"\n📊 Professionals Summary:")
        print(f"   ✅ Added: {created_count}")
        print(f"   ⏭️  Skipped: {skipped_count} (already exist)")
        
        return created_count, skipped_count
        
    except Exception as e:
        print(f"\n❌ Error adding professionals: {str(e)}")
        return 0, 0
    finally:
        client.close()


async def add_shops():
    """Add demo shops from JSON file"""
    
    # Read JSON file
    try:
        with open('demo_shops.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
    except FileNotFoundError:
        print("❌ Error: demo_shops.json not found!")
        return
    except json.JSONDecodeError as e:
        print(f"❌ Error parsing JSON: {str(e)}")
        return
    
    # Connect to MongoDB
    client = AsyncIOMotorClient(settings.MONGO_URL)
    db = client[settings.DATABASE_NAME]
    users_collection = db["users"]
    
    try:
        shops = data.get('shops', [])
        created_count = 0
        skipped_count = 0
        
        print("\n🚀 Adding demo shops...\n")
        print("=" * 80)
        
        for shop in shops:
            # Check if shop already exists
            existing = await users_collection.find_one({
                "$or": [
                    {"email": shop["email"]},
                    {"phone": shop["phone"]}
                ]
            })
            
            if existing:
                print(f"\n⚠️  Shop already exists:")
                print(f"   🏪 Name: {shop['name']}")
                print(f"   📧 Email: {shop['email']}")
                skipped_count += 1
                continue
            
            # Create user document
            user_doc = {
                "name": shop["name"],
                "email": shop["email"],
                "phone": shop["phone"],
                "hashed_password": hash_password(shop["password"]),
                "role": shop["role"],
                "auth_provider": shop["auth_provider"],
                "is_verified": shop["is_verified"],
                "is_active": shop["is_active"],
                "email_verified": shop["email_verified"],
                "phone_verified": shop["phone_verified"],
                "profile_image": shop.get("profile_image"),
                "approval_status": shop["approval_status"],
                "approval_data": shop["approval_data"],
                "admin_notes": shop.get("admin_notes"),
                "rejection_reason": shop.get("rejection_reason"),
                "reviewed_by": shop.get("reviewed_by"),
                "reviewed_at": parse_datetime(shop.get("reviewed_at")),
                "favorite_professionals": shop.get("favorite_professionals", []),
                "created_at": parse_datetime(shop.get("created_at")) or datetime.utcnow(),
                "updated_at": parse_datetime(shop.get("updated_at")) or datetime.utcnow(),
                "last_login": parse_datetime(shop.get("last_login")),
            }
            
            # Insert shop
            result = await users_collection.insert_one(user_doc)
            
            print(f"\n✅ Shop added successfully!")
            print(f"   🏪 Name: {shop['name']}")
            print(f"   📧 Email: {shop['email']}")
            print(f"   📱 Phone: {shop['phone']}")
            print(f"   🏷️  Shop: {shop['approval_data'].get('shop_name')}")
            print(f"   📦 Category: {shop['approval_data'].get('category')}")
            print(f"   📍 City: {shop['approval_data'].get('city')}")
            print(f"   🆔 User ID: {result.inserted_id}")
            
            created_count += 1
        
        print("\n" + "=" * 80)
        print(f"\n📊 Shops Summary:")
        print(f"   ✅ Added: {created_count}")
        print(f"   ⏭️  Skipped: {skipped_count} (already exist)")
        
        return created_count, skipped_count
        
    except Exception as e:
        print(f"\n❌ Error adding shops: {str(e)}")
        return 0, 0
    finally:
        client.close()


async def add_all_demo_data():
    """Add all demo data (professionals and shops)"""
    
    print("\n" + "=" * 80)
    print("🎯 ADDING DEMO DATA TO DATABASE")
    print("=" * 80)
    
    # Add professionals
    prof_created, prof_skipped = await add_professionals()
    
    # Add shops
    shop_created, shop_skipped = await add_shops()
    
    # Final summary
    print("\n" + "=" * 80)
    print("📊 FINAL SUMMARY")
    print("=" * 80)
    print(f"\n👥 Professionals:")
    print(f"   ✅ Added: {prof_created}")
    print(f"   ⏭️  Skipped: {prof_skipped}")
    print(f"\n🏪 Shops:")
    print(f"   ✅ Added: {shop_created}")
    print(f"   ⏭️  Skipped: {shop_skipped}")
    print(f"\n🎉 Total Records Added: {prof_created + shop_created}")
    print("=" * 80 + "\n")


if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        data_type = sys.argv[1].lower()
        
        if data_type == "professionals":
            print("🚀 Adding only professionals...")
            asyncio.run(add_professionals())
        elif data_type == "shops":
            print("🚀 Adding only shops...")
            asyncio.run(add_shops())
        else:
            print("❌ Invalid argument. Use 'professionals' or 'shops'")
            print("\nUsage:")
            print("  python add_demo_data.py              # Add all demo data")
            print("  python add_demo_data.py professionals # Add only professionals")
            print("  python add_demo_data.py shops         # Add only shops")
    else:
        # Add all demo data
        asyncio.run(add_all_demo_data())
