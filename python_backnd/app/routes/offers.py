"""
Offer Routes - Price negotiation between users and professionals
"""
from fastapi import APIRouter, Depends, HTTPException, Query, Body
from typing import List, Optional
from datetime import datetime, timedelta
from bson import ObjectId
from pydantic import BaseModel

from app.database import db
from app.middleware.rbac import get_current_user
from app.models.offer import offer_helper
from app.socket_manager import emit_new_offer, emit_offer_accepted, emit_offer_rejected, emit_offer_cancelled, emit_offer_revoked

router = APIRouter()


class CreateOfferRequest(BaseModel):
    professional_id: str
    service_type: str
    description: str
    offered_price: float


@router.post("/create")
async def create_price_offer(
    request: CreateOfferRequest,
    current_user: dict = Depends(get_current_user)
):
    """Create a new price offer from user to professional"""
    try:
        offers_collection = db.db.get_collection("offers")
        users_collection = db.db.get_collection("users")
        
        user_id = str(current_user["_id"])
        
        # Check if professional exists
        professional = await users_collection.find_one({
            "_id": ObjectId(request.professional_id),
            "role": "professional"
        })
        
        if not professional:
            raise HTTPException(status_code=404, detail="Professional not found")
        
        # Create offer
        offer_data = {
            "user_id": user_id,
            "professional_id": request.professional_id,
            "service_type": request.service_type,
            "description": request.description,
            "offered_price": request.offered_price,
            "status": "pending",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "expires_at": datetime.utcnow() + timedelta(days=7),  # Expires in 7 days
            "response_message": None,
            "booking_id": None,
        }
        
        result = await offers_collection.insert_one(offer_data)
        new_offer = await offers_collection.find_one({"_id": result.inserted_id})
        
        # Emit real-time event to professional
        offer_dict = offer_helper(new_offer)
        # Add user details
        offer_dict["user_name"] = current_user.get("name")
        offer_dict["user_image"] = current_user.get("profile_image")
        await emit_new_offer(request.professional_id, user_id, offer_dict)
        
        return {
            "message": "Offer sent successfully",
            "offer": offer_dict
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/my-offers")
async def get_my_offers(
    status: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """Get all offers made by current user"""
    try:
        offers_collection = db.db.get_collection("offers")
        users_collection = db.db.get_collection("users")
        
        user_id = str(current_user["_id"])
        
        # Build query
        query = {"user_id": user_id}
        if status:
            query["status"] = status
        
        offers = []
        async for offer in offers_collection.find(query).sort("created_at", -1):
            offer_dict = offer_helper(offer)
            
            # Get professional details
            professional = await users_collection.find_one({"_id": ObjectId(offer["professional_id"])})
            if professional:
                offer_dict["professional_name"] = professional.get("name")
                offer_dict["professional_image"] = professional.get("profile_image")
            
            offers.append(offer_dict)
        
        return {"offers": offers}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/received-offers")
async def get_received_offers(
    status: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """Get all offers received by professional"""
    try:
        offers_collection = db.db.get_collection("offers")
        users_collection = db.db.get_collection("users")
        
        professional_id = str(current_user["_id"])
        
        # Check if user is professional
        if current_user.get("role") != "professional":
            raise HTTPException(status_code=403, detail="Only professionals can access this endpoint")
        
        # Build query
        query = {"professional_id": professional_id}
        if status:
            query["status"] = status
        
        offers = []
        async for offer in offers_collection.find(query).sort("created_at", -1):
            offer_dict = offer_helper(offer)
            
            # Get user details
            user = await users_collection.find_one({"_id": ObjectId(offer["user_id"])})
            if user:
                offer_dict["user_name"] = user.get("name")
                offer_dict["user_image"] = user.get("profile_image")
                offer_dict["user_phone"] = user.get("phone")
            
            offers.append(offer_dict)
        
        return {"offers": offers}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/check-accepted/{professional_id}")
async def check_accepted_offer(
    professional_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Check if user has an accepted/valid offer with a professional"""
    try:
        offers_collection = db.db.get_collection("offers")
        users_collection = db.db.get_collection("users")
        
        user_id = str(current_user["_id"])
        
        # Find accepted offer that is still valid
        offer = await offers_collection.find_one({
            "user_id": user_id,
            "professional_id": professional_id,
            "status": "accepted",
            "$or": [
                {"accepted_price_valid_until": {"$gt": datetime.utcnow()}},
                {"accepted_price_valid_until": None}
            ]
        })
        
        if not offer:
            return {"has_accepted_offer": False, "offer": None}
        
        offer_dict = offer_helper(offer)
        
        # Get professional details
        professional = await users_collection.find_one({"_id": ObjectId(professional_id)})
        if professional:
            offer_dict["professional_name"] = professional.get("name")
            offer_dict["professional_image"] = professional.get("profile_image")
        
        return {
            "has_accepted_offer": True,
            "offer": offer_dict
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/accept/{offer_id}")
async def accept_offer(
    offer_id: str,
    response_message: Optional[str] = None,
    validity_hours: Optional[int] = Query(default=168, description="Validity in hours for accepted price (default 7 days = 168 hours)"),
    current_user: dict = Depends(get_current_user)
):
    """Accept a price offer - sets validity for the accepted price"""
    try:
        offers_collection = db.db.get_collection("offers")
        
        professional_id = str(current_user["_id"])
        
        # Get offer
        offer = await offers_collection.find_one({
            "_id": ObjectId(offer_id),
            "professional_id": professional_id,
            "status": "pending"
        })
        
        if not offer:
            raise HTTPException(status_code=404, detail="Offer not found or already processed")
        
        # Check if expired
        if offer.get("expires_at") and offer["expires_at"] < datetime.utcnow():
            await offers_collection.update_one(
                {"_id": ObjectId(offer_id)},
                {"$set": {"status": "expired", "updated_at": datetime.utcnow()}}
            )
            raise HTTPException(status_code=400, detail="Offer has expired")
        
        # Calculate validity until
        accepted_price_valid_until = datetime.utcnow() + timedelta(hours=validity_hours)
        
        # Update offer status (no booking created - user will book at this price)
        await offers_collection.update_one(
            {"_id": ObjectId(offer_id)},
            {
                "$set": {
                    "status": "accepted",
                    "updated_at": datetime.utcnow(),
                    "response_message": response_message,
                    "accepted_price_valid_until": accepted_price_valid_until,
                }
            }
        )
        
        updated_offer = await offers_collection.find_one({"_id": ObjectId(offer_id)})
        offer_dict = offer_helper(updated_offer)
        
        # Emit real-time event to user
        users_collection = db.db.get_collection("users")
        professional_data = await users_collection.find_one({"_id": ObjectId(professional_id)})
        if professional_data:
            offer_dict["professional_name"] = professional_data.get("name")
            offer_dict["professional_image"] = professional_data.get("profile_image")
        await emit_offer_accepted(offer["user_id"], professional_id, offer_dict)
        
        return {
            "message": "Offer accepted",
            "offer": offer_dict,
            "valid_until": accepted_price_valid_until.isoformat()
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/reject/{offer_id}")
async def reject_offer(
    offer_id: str,
    response_message: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """Reject a price offer"""
    try:
        offers_collection = db.db.get_collection("offers")
        
        professional_id = str(current_user["_id"])
        
        # Get offer
        offer = await offers_collection.find_one({
            "_id": ObjectId(offer_id),
            "professional_id": professional_id,
            "status": "pending"
        })
        
        if not offer:
            raise HTTPException(status_code=404, detail="Offer not found or already processed")
        
        # Update offer status
        await offers_collection.update_one(
            {"_id": ObjectId(offer_id)},
            {
                "$set": {
                    "status": "rejected",
                    "updated_at": datetime.utcnow(),
                    "response_message": response_message,
                }
            }
        )
        
        updated_offer = await offers_collection.find_one({"_id": ObjectId(offer_id)})
        offer_dict = offer_helper(updated_offer)
        
        # Emit real-time event to user
        users_collection = db.db.get_collection("users")
        professional_data = await users_collection.find_one({"_id": ObjectId(professional_id)})
        if professional_data:
            offer_dict["professional_name"] = professional_data.get("name")
            offer_dict["professional_image"] = professional_data.get("profile_image")
        await emit_offer_rejected(offer["user_id"], professional_id, offer_dict)
        
        return {
            "message": "Offer rejected",
            "offer": offer_dict
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{offer_id}")
async def cancel_offer(
    offer_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Cancel/delete an offer (only by the user who created it)"""
    try:
        offers_collection = db.db.get_collection("offers")
        
        user_id = str(current_user["_id"])
        
        # Get offer
        offer = await offers_collection.find_one({
            "_id": ObjectId(offer_id),
            "user_id": user_id,
            "status": "pending"
        })
        
        if not offer:
            raise HTTPException(status_code=404, detail="Offer not found or cannot be cancelled")
        
        # Delete offer
        # Get offer data before deletion for socket event
        offer_dict = offer_helper(offer)
        
        await offers_collection.delete_one({"_id": ObjectId(offer_id)})
        
        # Emit real-time event to professional
        users_collection = db.db.get_collection("users")
        user_data = await users_collection.find_one({"_id": ObjectId(user_id)})
        if user_data:
            offer_dict["user_name"] = user_data.get("name")
            offer_dict["user_image"] = user_data.get("profile_image")
        await emit_offer_cancelled(user_id, offer["professional_id"], offer_dict)
        
        return {"message": "Offer cancelled successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/revoke/{offer_id}")
async def revoke_accepted_offer(
    offer_id: str,
    response_message: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """Revoke an accepted offer (professional only) - expires the offer before validity ends"""
    try:
        offers_collection = db.db.get_collection("offers")
        users_collection = db.db.get_collection("users")
        
        professional_id = str(current_user["_id"])
        
        # Check if user is professional
        if current_user.get("role") != "professional":
            raise HTTPException(status_code=403, detail="Only professionals can revoke offers")
        
        # Get offer
        offer = await offers_collection.find_one({
            "_id": ObjectId(offer_id),
            "professional_id": professional_id,
            "status": "accepted"
        })
        
        if not offer:
            raise HTTPException(status_code=404, detail="Accepted offer not found")
        
        # Update offer status to expired/revoked
        await offers_collection.update_one(
            {"_id": ObjectId(offer_id)},
            {
                "$set": {
                    "status": "expired",
                    "updated_at": datetime.utcnow(),
                    "response_message": response_message or "Offer revoked by professional",
                    "accepted_price_valid_until": datetime.utcnow(),  # Expire immediately
                }
            }
        )
        
        updated_offer = await offers_collection.find_one({"_id": ObjectId(offer_id)})
        offer_dict = offer_helper(updated_offer)
        
        # Add professional details
        professional_data = await users_collection.find_one({"_id": ObjectId(professional_id)})
        if professional_data:
            offer_dict["professional_name"] = professional_data.get("name")
            offer_dict["professional_image"] = professional_data.get("profile_image")
        
        # Emit real-time event to user
        await emit_offer_revoked(offer["user_id"], professional_id, offer_dict)
        
        return {
            "message": "Offer revoked successfully",
            "offer": offer_dict
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
