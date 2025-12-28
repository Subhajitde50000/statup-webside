from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from datetime import datetime, timedelta
from bson import ObjectId
import secrets

from app.database import db
from app.middleware.rbac import get_current_user
from app.models.subscription import (
    SubscriptionPlan,
    UserSubscription,
    PaymentHistory,
    subscription_plan_helper,
    user_subscription_helper,
    payment_history_helper,
)

router = APIRouter()


@router.get("/plans")
async def get_subscription_plans(user_type: Optional[str] = None):
    """Get all active subscription plans"""
    try:
        subscription_plans_collection = db.db.get_collection("subscription_plans")
        plans = []
        async for plan in subscription_plans_collection.find({"is_active": True}):
            plans.append(subscription_plan_helper(plan))
        
        # Sort by duration
        plans.sort(key=lambda x: x["duration_months"])
        return {"plans": plans}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/my-subscription")
async def get_my_subscription(current_user: dict = Depends(get_current_user)):
    """Get current user's active subscription"""
    try:
        user_subscriptions_collection = db.db.get_collection("user_subscriptions")
        users_collection = db.db.get_collection("users")
        user_id = str(current_user["_id"])
        
        # Check for active subscription
        subscription = await user_subscriptions_collection.find_one({
            "user_id": user_id,
            "status": "active"
        })
        
        if not subscription:
            # Check if user is in trial period (first 3 months)
            user = await users_collection.find_one({"_id": ObjectId(user_id)})
            created_at = user.get("created_at")
            
            if created_at:
                trial_end = created_at + timedelta(days=90)  # 3 months
                days_remaining = (trial_end - datetime.utcnow()).days
                
                if days_remaining > 0:
                    return {
                        "subscription": None,
                        "in_trial": True,
                        "trial_days_remaining": days_remaining,
                        "trial_end_date": trial_end.isoformat(),
                        "message": f"You are in free trial period. {days_remaining} days remaining."
                    }
                else:
                    return {
                        "subscription": None,
                        "in_trial": False,
                        "trial_expired": True,
                        "message": "Your free trial has expired. Please subscribe to continue using the platform."
                    }
            
            return {"subscription": None, "in_trial": False, "message": "No active subscription"}
        
        return {
            "subscription": user_subscription_helper(subscription),
            "in_trial": False
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/subscribe/{plan_id}")
async def subscribe_to_plan(
    plan_id: str,
    payment_method: str,
    current_user: dict = Depends(get_current_user)
):
    """Subscribe to a plan"""
    try:
        subscription_plans_collection = db.db.get_collection("subscription_plans")
        user_subscriptions_collection = db.db.get_collection("user_subscriptions")
        payment_history_collection = db.db.get_collection("payment_history")
        
        user_id = str(current_user["_id"])
        user_type = current_user.get("role", "professional")
        
        # Get plan details
        plan = await subscription_plans_collection.find_one({"_id": ObjectId(plan_id)})
        if not plan:
            raise HTTPException(status_code=404, detail="Plan not found")
        
        # Check if user already has active subscription
        existing = await user_subscriptions_collection.find_one({
            "user_id": user_id,
            "status": "active"
        })
        
        if existing:
            raise HTTPException(
                status_code=400,
                detail="You already have an active subscription. Please cancel it first."
            )
        
        # Calculate dates
        start_date = datetime.utcnow()
        duration_months = plan["duration_months"]
        end_date = start_date + timedelta(days=duration_months * 30)
        
        # Generate payment ID
        payment_id = f"PAY_{secrets.token_hex(8).upper()}"
        
        # Create subscription
        subscription_data = {
            "user_id": user_id,
            "user_type": user_type,
            "plan_id": str(plan["_id"]),
            "plan_name": plan["name"],
            "duration_months": duration_months,
            "amount_paid": plan["price"],
            "is_trial": False,
            "trial_end_date": None,
            "start_date": start_date,
            "end_date": end_date,
            "payment_method": payment_method,
            "payment_id": payment_id,
            "payment_status": "completed",
            "status": "active",
            "auto_renew": False,
            "created_at": start_date,
            "updated_at": start_date,
        }
        
        result = await user_subscriptions_collection.insert_one(subscription_data)
        subscription_id = str(result.inserted_id)
        
        # Create payment history
        payment_data = {
            "user_id": user_id,
            "subscription_id": subscription_id,
            "plan_name": plan["name"],
            "amount": plan["price"],
            "payment_method": payment_method,
            "payment_id": payment_id,
            "payment_status": "completed",
            "transaction_date": start_date,
            "receipt_url": f"/api/subscriptions/receipt/{subscription_id}",
        }
        
        await payment_history_collection.insert_one(payment_data)
        
        # Get the created subscription
        new_subscription = await user_subscriptions_collection.find_one({"_id": result.inserted_id})
        
        return {
            "message": "Subscription created successfully",
            "subscription": user_subscription_helper(new_subscription),
            "payment_id": payment_id
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/cancel")
async def cancel_subscription(current_user: dict = Depends(get_current_user)):
    """Cancel current subscription"""
    try:
        user_subscriptions_collection = db.db.get_collection("user_subscriptions")
        user_id = str(current_user["_id"])
        
        # Find active subscription
        subscription = await user_subscriptions_collection.find_one({
            "user_id": user_id,
            "status": "active"
        })
        
        if not subscription:
            raise HTTPException(status_code=404, detail="No active subscription found")
        
        # Update subscription status
        await user_subscriptions_collection.update_one(
            {"_id": subscription["_id"]},
            {
                "$set": {
                    "status": "cancelled",
                    "auto_renew": False,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        return {"message": "Subscription cancelled successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/payment-history")
async def get_payment_history(current_user: dict = Depends(get_current_user)):
    """Get user's payment history"""
    try:
        payment_history_collection = db.db.get_collection("payment_history")
        user_id = str(current_user["_id"])
        
        payments = []
        async for payment in payment_history_collection.find({"user_id": user_id}).sort("transaction_date", -1):
            payments.append(payment_history_helper(payment))
        
        return {"payments": payments}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/receipt/{subscription_id}")
async def get_receipt(subscription_id: str, current_user: dict = Depends(get_current_user)):
    """Get receipt for a subscription"""
    try:
        user_subscriptions_collection = db.db.get_collection("user_subscriptions")
        users_collection = db.db.get_collection("users")
        payment_history_collection = db.db.get_collection("payment_history")
        
        user_id = str(current_user["_id"])
        
        # Get subscription
        subscription = await user_subscriptions_collection.find_one({
            "_id": ObjectId(subscription_id),
            "user_id": user_id
        })
        
        if not subscription:
            raise HTTPException(status_code=404, detail="Subscription not found")
        
        # Get user details
        user = await users_collection.find_one({"_id": ObjectId(user_id)})
        
        # Get payment history
        payment = await payment_history_collection.find_one({
            "subscription_id": subscription_id
        })
        
        receipt = {
            "receipt_id": f"RCP_{subscription['payment_id']}",
            "subscription_id": subscription_id,
            "customer_name": user.get("name", "N/A"),
            "customer_email": user.get("email", "N/A"),
            "plan_name": subscription["plan_name"],
            "duration_months": subscription["duration_months"],
            "amount": subscription["amount_paid"],
            "payment_method": subscription.get("payment_method", "N/A"),
            "payment_id": subscription.get("payment_id", "N/A"),
            "payment_status": subscription.get("payment_status", "N/A"),
            "transaction_date": subscription.get("created_at", datetime.utcnow()).isoformat(),
            "start_date": subscription["start_date"].isoformat(),
            "end_date": subscription["end_date"].isoformat(),
            "company_name": "Electronics Platform",
            "company_address": "123 Business Street, City, State - 700001",
            "company_email": "support@electronicsplatform.com",
            "company_phone": "+91-1234567890",
        }
        
        return receipt
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/check-eligibility")
async def check_subscription_eligibility(current_user: dict = Depends(get_current_user)):
    """Check if user needs to subscribe (trial expired)"""
    try:
        user_subscriptions_collection = db.db.get_collection("user_subscriptions")
        users_collection = db.db.get_collection("users")
        user_id = str(current_user["_id"])
        
        # Check for active subscription
        subscription = await user_subscriptions_collection.find_one({
            "user_id": user_id,
            "status": "active"
        })
        
        if subscription:
            return {
                "needs_subscription": False,
                "has_active_subscription": True,
                "subscription_valid_until": subscription["end_date"].isoformat()
            }
        
        # Check trial period
        user = await users_collection.find_one({"_id": ObjectId(user_id)})
        created_at = user.get("created_at")
        
        if created_at:
            trial_end = created_at + timedelta(days=90)
            days_remaining = (trial_end - datetime.utcnow()).days
            
            if days_remaining > 0:
                return {
                    "needs_subscription": False,
                    "in_trial": True,
                    "trial_days_remaining": days_remaining,
                    "trial_end_date": trial_end.isoformat()
                }
            else:
                return {
                    "needs_subscription": True,
                    "trial_expired": True,
                    "message": "Your free trial has expired. Please subscribe to continue."
                }
        
        return {
            "needs_subscription": True,
            "message": "Please subscribe to use the platform."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
