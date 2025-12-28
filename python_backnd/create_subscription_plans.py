"""
Script to create subscription plans in the database
Run this once to populate the subscription_plans collection
"""

import asyncio
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

async def create_subscription_plans():
    """Create subscription plans in database"""
    
    # Connect to MongoDB
    client = AsyncIOMotorClient(settings.MONGO_URL)
    db = client[settings.DATABASE_NAME]
    subscription_plans_collection = db["subscription_plans"]
    
    # Clear existing plans (optional)
    await subscription_plans_collection.delete_many({})
    
    # Define subscription plans
    plans = [
        {
            "name": "1 Month Plan",
            "duration_months": 1,
            "price": 499.0,
            "discount_percentage": 0,
            "features": [
                "Unlimited service listings",
                "Customer inquiry management",
                "Profile visibility",
                "Basic analytics",
                "Email support"
            ],
            "is_active": True,
            "created_at": datetime.utcnow()
        },
        {
            "name": "2 Month Plan",
            "duration_months": 2,
            "price": 899.0,
            "discount_percentage": 10,
            "features": [
                "Unlimited service listings",
                "Customer inquiry management",
                "Profile visibility",
                "Basic analytics",
                "Email support",
                "10% discount"
            ],
            "is_active": True,
            "created_at": datetime.utcnow()
        },
        {
            "name": "3 Month Plan",
            "duration_months": 3,
            "price": 1299.0,
            "discount_percentage": 13,
            "features": [
                "Unlimited service listings",
                "Customer inquiry management",
                "Profile visibility",
                "Advanced analytics",
                "Priority support",
                "13% discount"
            ],
            "is_active": True,
            "created_at": datetime.utcnow()
        },
        {
            "name": "6 Month Plan",
            "duration_months": 6,
            "price": 2399.0,
            "discount_percentage": 20,
            "features": [
                "Unlimited service listings",
                "Customer inquiry management",
                "Profile visibility",
                "Advanced analytics",
                "Priority support",
                "Featured profile badge",
                "20% discount"
            ],
            "is_active": True,
            "created_at": datetime.utcnow()
        },
        {
            "name": "12 Month Plan (Best Value)",
            "duration_months": 12,
            "price": 3999.0,
            "discount_percentage": 33,
            "features": [
                "Unlimited service listings",
                "Customer inquiry management",
                "Profile visibility",
                "Advanced analytics",
                "24/7 Priority support",
                "Featured profile badge",
                "Premium visibility boost",
                "33% discount - Best Value!"
            ],
            "is_active": True,
            "created_at": datetime.utcnow()
        }
    ]
    
    # Insert plans
    result = await subscription_plans_collection.insert_many(plans)
    
    print(f"✅ Successfully created {len(result.inserted_ids)} subscription plans!")
    print("\nCreated plans:")
    for plan in plans:
        print(f"  - {plan['name']}: ₹{plan['price']}/- ({plan['duration_months']} months)")
    
    # Close connection
    client.close()

if __name__ == "__main__":
    print("Creating subscription plans...")
    asyncio.run(create_subscription_plans())
    print("\n✨ Done!")
