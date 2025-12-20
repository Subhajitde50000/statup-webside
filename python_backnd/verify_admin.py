"""
Verification script to check if admin user exists and system is properly configured
"""

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings
from app.utils.security import verify_password


async def verify_admin():
    """Verify admin user exists and can be authenticated"""
    
    # Connect to MongoDB
    client = AsyncIOMotorClient(settings.MONGO_URL)
    db = client[settings.DATABASE_NAME]
    users_collection = db["users"]
    
    try:
        print("🔍 Checking admin user...")
        print("-" * 50)
        
        # Find admin user
        admin = await users_collection.find_one({
            "role": "admin"
        })
        
        if not admin:
            print("❌ No admin user found in database")
            print("💡 Run: python create_admin.py")
            return False
        
        print("✅ Admin user found!")
        print(f"📧 Email: {admin.get('email')}")
        print(f"📱 Phone: {admin.get('phone')}")
        print(f"👤 Name: {admin.get('name')}")
        print(f"🆔 ID: {admin.get('_id')}")
        print(f"✓ Verified: {admin.get('is_verified')}")
        print(f"✓ Active: {admin.get('is_active')}")
        print(f"🔑 Role: {admin.get('role')}")
        print("-" * 50)
        
        # Check multiple admins
        admin_count = await users_collection.count_documents({"role": "admin"})
        if admin_count > 1:
            print(f"⚠️  Warning: {admin_count} admin users found")
            print("💡 Consider keeping only one admin account")
        
        # Check user roles distribution
        print("\n📊 User Roles Distribution:")
        print("-" * 50)
        for role in ["admin", "manager", "professional", "shopkeeper", "user"]:
            count = await users_collection.count_documents({"role": role})
            if count > 0:
                print(f"  {role.capitalize()}: {count}")
        
        # Test password verification
        print("\n🔐 Testing Default Password...")
        print("-" * 50)
        if admin.get('hashed_password'):
            test_password = "Admin@123"
            if verify_password(test_password, admin['hashed_password']):
                print("✅ Default password works!")
                print(f"   Password: {test_password}")
                print("⚠️  IMPORTANT: Change this password after first login!")
            else:
                print("ℹ️  Custom password is set (not default)")
        
        print("\n✅ System is ready!")
        print("\n🚀 Next Steps:")
        print("  1. Start backend: uvicorn main:app --reload")
        print("  2. Start frontend: cd ../fontend && npm run dev")
        print("  3. Login at: http://localhost:3000/auth")
        print(f"  4. Use email: {admin.get('email')}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False
    finally:
        client.close()


async def check_database_connection():
    """Check if MongoDB is accessible"""
    try:
        client = AsyncIOMotorClient(settings.MONGO_URL, serverSelectionTimeoutMS=5000)
        await client.admin.command('ping')
        client.close()
        print("✅ MongoDB connection successful")
        return True
    except Exception as e:
        print(f"❌ MongoDB connection failed: {str(e)}")
        print("💡 Make sure MongoDB is running")
        return False


async def main():
    print("\n" + "=" * 50)
    print("     ADMIN USER VERIFICATION")
    print("=" * 50 + "\n")
    
    # Check database connection first
    if not await check_database_connection():
        return
    
    print()
    
    # Verify admin user
    await verify_admin()
    
    print("\n" + "=" * 50 + "\n")


if __name__ == "__main__":
    asyncio.run(main())
