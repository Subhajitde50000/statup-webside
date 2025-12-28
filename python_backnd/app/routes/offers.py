"""
Offer Routes - Price negotiation between users and professionals
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from datetime import datetime, timedelta
from bson import ObjectId

from app.database import db
from app.middleware.rbac import get_current_user
from app.models.offer import offer_helper

router = APIRouter()


@router.post("/create")
async def create_price_offer(
    professional_id: str,
    service_type: str,
    description: str,
    offered_price: float,
    current_user: dict = Depends(get_current_user)
):
    """Create a new price offer from user to professional"""
    try:
        offers_collection = db.db.get_collection("offers")
        users_collection = db.db.get_collection("users")
        
        user_id = str(current_user["_id"])
        
        # Check if professional exists
        professional = await users_collection.find_one({
            "_id": ObjectId(professional_id),
            "role": "professional"
        })
        
        if not professional:
            raise HTTPException(status_code=404, detail="Professional not found")
        
        # Create offer
        offer_data = {
            "user_id": user_id,
            "professional_id": professional_id,
            "service_type": service_type,
            "description": description,
            "offered_price": offered_price,
            "status": "pending",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "expires_at": datetime.utcnow() + timedelta(days=7),  # Expires in 7 days
            "response_message": None,
            "booking_id": None,
        }
        
        result = await offers_collection.insert_one(offer_data)
        new_offer = await offers_collection.find_one({"_id": result.inserted_id})
        
        return {
            "message": "Offer sent successfully",
            "offer": offer_helper(new_offer)
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


@router.post("/accept/{offer_id}")
async def accept_offer(
    offer_id: str,
    response_message: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """Accept a price offer and create booking"""
    try:
        offers_collection = db.db.get_collection("offers")
        bookings_collection = db.db.get_collection("bookings")
        
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
        
        # Create booking
        booking_data = {
            "user_id": offer["user_id"],
            "professional_id": professional_id,
            "service_type": offer["service_type"],
            "description": offer["description"],
            "price": offer["offered_price"],
            "status": "confirmed",
            "payment_status": "pending",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "offer_id": offer_id,
        }
        
        booking_result = await bookings_collection.insert_one(booking_data)
        booking_id = str(booking_result.inserted_id)
        
        # Update offer status
        await offers_collection.update_one(
            {"_id": ObjectId(offer_id)},
            {
                "$set": {
                    "status": "accepted",
                    "updated_at": datetime.utcnow(),
                    "response_message": response_message,
                    "booking_id": booking_id,
                }
            }
        )
        
        updated_offer = await offers_collection.find_one({"_id": ObjectId(offer_id)})
        
        return {
            "message": "Offer accepted and booking created",
            "offer": offer_helper(updated_offer),
            "booking_id": booking_id
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
        
        return {
            "message": "Offer rejected",
            "offer": offer_helper(updated_offer)
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
        await offers_collection.delete_one({"_id": ObjectId(offer_id)})
        
        return {"message": "Offer cancelled successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
