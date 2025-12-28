from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from bson import ObjectId

class SubscriptionPlan(BaseModel):
    """Subscription plan model"""
    id: Optional[str] = Field(None, alias="_id")
    name: str  # e.g., "1 Month Plan", "3 Month Plan"
    duration_months: int  # 1, 2, 3, 6, 12
    price: float  # in INR
    discount_percentage: float = 0  # discount on original price
    features: List[str] = []  # list of features included
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}


class UserSubscription(BaseModel):
    """User subscription model"""
    id: Optional[str] = Field(None, alias="_id")
    user_id: str
    user_type: str  # "professional" or "shopkeeper"
    plan_id: str
    plan_name: str
    duration_months: int
    amount_paid: float
    
    # Trial and status
    is_trial: bool = True  # First 3 months free
    trial_end_date: Optional[datetime] = None
    
    # Subscription dates
    start_date: datetime = Field(default_factory=datetime.utcnow)
    end_date: datetime
    
    # Payment details
    payment_method: Optional[str] = None  # "credit_card", "debit_card", "upi", "net_banking"
    payment_id: Optional[str] = None
    payment_status: str = "pending"  # "pending", "completed", "failed"
    
    # Status
    status: str = "active"  # "active", "expired", "cancelled"
    auto_renew: bool = False
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}


class PaymentHistory(BaseModel):
    """Payment history model"""
    id: Optional[str] = Field(None, alias="_id")
    user_id: str
    subscription_id: str
    plan_name: str
    amount: float
    payment_method: str
    payment_id: str
    payment_status: str
    transaction_date: datetime = Field(default_factory=datetime.utcnow)
    receipt_url: Optional[str] = None
    
    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}


def subscription_plan_helper(plan) -> dict:
    """Helper to convert subscription plan document to dict"""
    return {
        "id": str(plan["_id"]),
        "name": plan["name"],
        "duration_months": plan["duration_months"],
        "price": plan["price"],
        "discount_percentage": plan.get("discount_percentage", 0),
        "features": plan.get("features", []),
        "is_active": plan.get("is_active", True),
        "created_at": plan.get("created_at"),
    }


def user_subscription_helper(subscription) -> dict:
    """Helper to convert user subscription document to dict"""
    return {
        "id": str(subscription["_id"]),
        "user_id": subscription["user_id"],
        "user_type": subscription["user_type"],
        "plan_id": subscription["plan_id"],
        "plan_name": subscription["plan_name"],
        "duration_months": subscription["duration_months"],
        "amount_paid": subscription["amount_paid"],
        "is_trial": subscription.get("is_trial", False),
        "trial_end_date": subscription.get("trial_end_date"),
        "start_date": subscription["start_date"],
        "end_date": subscription["end_date"],
        "payment_method": subscription.get("payment_method"),
        "payment_id": subscription.get("payment_id"),
        "payment_status": subscription.get("payment_status", "pending"),
        "status": subscription.get("status", "active"),
        "auto_renew": subscription.get("auto_renew", False),
        "created_at": subscription.get("created_at"),
        "updated_at": subscription.get("updated_at"),
    }


def payment_history_helper(payment) -> dict:
    """Helper to convert payment history document to dict"""
    return {
        "id": str(payment["_id"]),
        "user_id": payment["user_id"],
        "subscription_id": payment["subscription_id"],
        "plan_name": payment["plan_name"],
        "amount": payment["amount"],
        "payment_method": payment["payment_method"],
        "payment_id": payment["payment_id"],
        "payment_status": payment["payment_status"],
        "transaction_date": payment["transaction_date"],
        "receipt_url": payment.get("receipt_url"),
    }
