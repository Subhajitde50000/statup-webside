"""
Offer Models
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from bson import ObjectId


class PriceOffer(BaseModel):
    """Price offer from user to professional"""
    user_id: str
    professional_id: str
    service_type: str
    description: str
    offered_price: float
    status: str = "pending"  # pending, accepted, rejected, expired
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    expires_at: Optional[datetime] = None
    response_message: Optional[str] = None
    booking_id: Optional[str] = None


def offer_helper(offer) -> dict:
    """Convert MongoDB offer document to dict"""
    return {
        "id": str(offer["_id"]),
        "user_id": offer["user_id"],
        "professional_id": offer["professional_id"],
        "service_type": offer["service_type"],
        "description": offer["description"],
        "offered_price": offer["offered_price"],
        "status": offer["status"],
        "created_at": offer["created_at"].isoformat() if isinstance(offer.get("created_at"), datetime) else offer.get("created_at"),
        "updated_at": offer["updated_at"].isoformat() if isinstance(offer.get("updated_at"), datetime) else offer.get("updated_at"),
        "expires_at": offer["expires_at"].isoformat() if isinstance(offer.get("expires_at"), datetime) and offer.get("expires_at") else None,
        "response_message": offer.get("response_message"),
        "booking_id": offer.get("booking_id"),
    }
