"""
Script to create managers with different types
Run this script to add various manager accounts
"""

import asyncio
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient
from app.utils.security import hash_password
from app.config import settings

# Manager accounts with different types
MANAGERS = [
    {
        "name": "User Manager",
        "email": "user.manager@electronics.com",
        "phone": "+919876543210",
        "password": "UserManager@123",
        "role": "manager",
        "manager_type": "user_manager",
        "description": "Manages users, shops, professionals, orders, and payments"
    },
    {
        "name": "Business Manager",
        "email": "business.manager@electronics.com",
        "phone": "+919876543211",
        "password": "BusinessManager@123",
        "role": "manager",
        "manager_type": "business_manager",
        "description": "Manages shops, products, and inventory"
    },
    {
        "name": "Marketing Manager",
        "email": "marketing.manager@electronics.com",
        "phone": "+919876543212",
        "password": "MarketingManager@123",
        "role": "manager",
        "manager_type": "marketing_manager",
        "description": "Manages campaigns, promotions, and analytics"
    },
    {
        "name": "HR Manager",
        "email": "hr.manager@electronics.com",
        "phone": "+919876543213",
        "password": "HRManager@123",
        "role": "manager",
        "manager_type": "hr_manager",
        "description": "Manages vacancies, applications, and employees"
    },
    {
        "name": "Operations Manager",
        "email": "operations.manager@electronics.com",
        "phone": "+919876543214",
        "password": "OperationsManager@123",
        "role": "manager",
        "manager_type": "operations_manager",
        "description": "Manages orders, deliveries, and logistics"
    },
    {
        "name": "General Manager",
        "email": "general.manager@electronics.com",
        "phone": "+919876543215",
        "password": "GeneralManager@123",
        "role": "manager",
        "manager_type": "general_manager",
        "description": "Full manager access across all departments"
    }
]


async def create_managers():
    """Create manager users in MongoDB"""
    
    # Connect to MongoDB
    client = AsyncIOMotorClient(settings.MONGO_URL)
    db = client[settings.DATABASE_NAME]
    users_collection = db["users"]
    
    try:
        created_count = 0
        skipped_count = 0
        
        print("\n🚀 Creating manager accounts...\n")
        print("=" * 80)
        
        for manager_data in MANAGERS:
            # Check if manager already exists
            existing_manager = await users_collection.find_one({
                "email": manager_data["email"]
            })
            
            if existing_manager:
                print(f"\n⚠️  Manager already exists:")
                print(f"   📧 Email: {manager_data['email']}")
                print(f"   👤 Type: {manager_data['manager_type']}")
                skipped_count += 1
                continue
            
            # Create manager user document
            manager_user = {
                "name": manager_data["name"],
                "email": manager_data["email"],
                "phone": manager_data["phone"],
                "hashed_password": hash_password(manager_data["password"]),
                "role": manager_data["role"],
                "manager_type": manager_data["manager_type"],
                "auth_provider": "local",
                "is_verified": True,  # Managers are pre-verified
                "is_active": True,
                "email_verified": True,
                "phone_verified": True,
                "profile_image": None,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow(),
            }
            
            # Insert manager user
            result = await users_collection.insert_one(manager_user)
            
            print(f"\n✅ Manager created successfully!")
            print(f"   👤 Name: {manager_data['name']}")
            print(f"   📧 Email: {manager_data['email']}")
            print(f"   📱 Phone: {manager_data['phone']}")
            print(f"   🔑 Password: {manager_data['password']}")
            print(f"   🏢 Type: {manager_data['manager_type']}")
            print(f"   📝 Description: {manager_data['description']}")
            print(f"   🆔 User ID: {result.inserted_id}")
            
            created_count += 1
        
        print("\n" + "=" * 80)
        print(f"\n📊 Summary:")
        print(f"   ✅ Created: {created_count} manager(s)")
        print(f"   ⏭️  Skipped: {skipped_count} manager(s) (already exist)")
        print(f"\n⚠️  Please change passwords after first login for security!")
        
        # Print manager types and their permissions
        print("\n" + "=" * 80)
        print("\n📋 Manager Types and Permissions:\n")
        print("1. 👥 USER MANAGER (user.manager@electronics.com)")
        print("   • Manage all users (customers)")
        print("   • Manage shops and shopkeepers")
        print("   • Manage professionals and service providers")
        print("   • View and manage orders")
        print("   • Handle payment issues and refunds")
        print("   • User verification and activation")
        
        print("\n2. 🏪 BUSINESS MANAGER (business.manager@electronics.com)")
        print("   • Manage shops and store listings")
        print("   • Manage product catalog")
        print("   • Inventory management")
        print("   • Shop performance analytics")
        print("   • Vendor management")
        
        print("\n3. 📢 MARKETING MANAGER (marketing.manager@electronics.com)")
        print("   • Create and manage campaigns")
        print("   • Manage promotions and discounts")
        print("   • View analytics and reports")
        print("   • Customer engagement")
        print("   • Email marketing")
        
        print("\n4. 👔 HR MANAGER (hr.manager@electronics.com)")
        print("   • Manage job vacancies")
        print("   • View and process job applications")
        print("   • Employee onboarding")
        print("   • Performance reviews")
        print("   • Training management")
        
        print("\n5. 🚚 OPERATIONS MANAGER (operations.manager@electronics.com)")
        print("   • Order management and tracking")
        print("   • Delivery coordination")
        print("   • Logistics planning")
        print("   • Supply chain management")
        print("   • Quality control")
        
        print("\n6. 🏆 GENERAL MANAGER (general.manager@electronics.com)")
        print("   • Full access across all departments")
        print("   • Strategic decision making")
        print("   • Cross-departmental coordination")
        print("   • High-level oversight")
        print("   • Similar to admin but focused on operations")
        
        print("\n" + "=" * 80 + "\n")
        
    except Exception as e:
        print(f"\n❌ Error creating managers: {str(e)}")
    finally:
        client.close()


async def create_specific_manager(manager_type: str):
    """Create a specific type of manager"""
    
    # Find the manager data for the specified type
    manager_data = None
    for m in MANAGERS:
        if m["manager_type"] == manager_type:
            manager_data = m
            break
    
    if not manager_data:
        print(f"❌ Invalid manager type: {manager_type}")
        print(f"Available types: {', '.join([m['manager_type'] for m in MANAGERS])}")
        return
    
    # Connect to MongoDB
    client = AsyncIOMotorClient(settings.MONGO_URL)
    db = client[settings.DATABASE_NAME]
    users_collection = db["users"]
    
    try:
        # Check if manager already exists
        existing_manager = await users_collection.find_one({
            "email": manager_data["email"]
        })
        
        if existing_manager:
            print(f"⚠️  Manager already exists:")
            print(f"📧 Email: {manager_data['email']}")
            print(f"👤 Type: {manager_data['manager_type']}")
            return
        
        # Create manager user document
        manager_user = {
            "name": manager_data["name"],
            "email": manager_data["email"],
            "phone": manager_data["phone"],
            "hashed_password": hash_password(manager_data["password"]),
            "role": manager_data["role"],
            "manager_type": manager_data["manager_type"],
            "auth_provider": "local",
            "is_verified": True,
            "is_active": True,
            "email_verified": True,
            "phone_verified": True,
            "profile_image": None,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }
        
        # Insert manager user
        result = await users_collection.insert_one(manager_user)
        
        print(f"\n✅ {manager_data['name']} created successfully!")
        print(f"📧 Email: {manager_data['email']}")
        print(f"📱 Phone: {manager_data['phone']}")
        print(f"🔑 Password: {manager_data['password']}")
        print(f"🏢 Type: {manager_data['manager_type']}")
        print(f"📝 Description: {manager_data['description']}")
        print(f"🆔 User ID: {result.inserted_id}")
        print(f"\n⚠️  Please change the password after first login!")
        
    except Exception as e:
        print(f"❌ Error creating manager: {str(e)}")
    finally:
        client.close()


if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        # Create specific manager type
        manager_type = sys.argv[1]
        print(f"🚀 Creating {manager_type}...")
        asyncio.run(create_specific_manager(manager_type))
    else:
        # Create all managers
        asyncio.run(create_managers())
