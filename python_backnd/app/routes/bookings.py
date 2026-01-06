from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional, List
from datetime import datetime, timedelta
from bson import ObjectId
from ..database import db
from ..utils.security import get_current_user
from ..socket_manager import (
    emit_booking_confirmed,
    emit_booking_accepted,
    emit_otp_sent,
    emit_work_started,
    emit_work_completed,
    emit_booking_cancelled
)
from ..services.notification_service import NotificationService
import random
import string
import asyncio

router = APIRouter()


def booking_helper(booking, professional=None, service=None, user=None) -> dict:
    """Helper function to format booking data"""
    
    # Generate booking ID in format XXX-XXXXXX
    booking_id_display = booking.get("booking_id_display")
    if not booking_id_display:
        category_prefix = {
            "Electrical": "ELX",
            "Plumbing": "PLB",
            "Cleaning": "CLN",
            "Appliance": "APL",
            "AC & Refrigeration": "ACR",
            "Carpentry": "CAR",
            "Painting": "PNT",
            "Pest Control": "PST",
            "Home Renovation": "HMR",
            "Security Systems": "SEC",
            "Solar Installation": "SOL",
        }.get(booking.get("category", ""), "SRV")
        booking_id_display = f"#{category_prefix}-{str(booking['_id'])[-6:].upper()}"
    
    result = {
        "id": str(booking["_id"]),
        "booking_id": booking_id_display,
        "service_type": booking.get("service_type", ""),
        "service_name": booking.get("service_name", booking.get("service_type", "")),
        "category": booking.get("category", "Other"),
        "status": booking.get("status", "pending"),
        "date": booking.get("scheduled_date", ""),
        "time": booking.get("scheduled_time", ""),
        "address": booking.get("address", {}),
        "address_display": "",
        "price": booking.get("price", 0),
        "payment_status": booking.get("payment_status", "pending"),
        "payment_method": booking.get("payment_method", ""),
        "otp": booking.get("otp", ""),
        "notes": booking.get("notes", ""),
        "rating": booking.get("rating"),
        "review": booking.get("review", ""),
        "cancellation_reason": booking.get("cancellation_reason", ""),
        "cancelled_by": booking.get("cancelled_by", ""),
        "refund_status": booking.get("refund_status", ""),
        "created_at": booking.get("created_at", datetime.utcnow()).isoformat() if booking.get("created_at") else None,
        "updated_at": booking.get("updated_at", datetime.utcnow()).isoformat() if booking.get("updated_at") else None,
        "accepted_at": booking.get("accepted_at").isoformat() if booking.get("accepted_at") else None,
        "started_at": booking.get("started_at").isoformat() if booking.get("started_at") else None,
        "completed_at": booking.get("completed_at").isoformat() if booking.get("completed_at") else None,
        "otp_requested_at": booking.get("otp_requested_at").isoformat() if booking.get("otp_requested_at") else None,
        "professional": None,
        "service": None,
        "user": None,
    }
    
    # Format address display
    addr = booking.get("address", {})
    if isinstance(addr, dict):
        parts = []
        if addr.get("house_no"):
            parts.append(addr["house_no"])
        if addr.get("area"):
            parts.append(addr["area"])
        if addr.get("city"):
            parts.append(addr["city"])
        result["address_display"] = ", ".join(parts) if parts else "Address not provided"
    elif isinstance(addr, str):
        result["address_display"] = addr
    else:
        result["address_display"] = "Address not provided"
    
    # Add professional info
    if professional:
        result["professional"] = {
            "id": str(professional.get("_id", "")),
            "name": professional.get("name", "Professional"),
            "photo": professional.get("profile_image", ""),
            "rating": professional.get("rating", 0),
            "phone": professional.get("phone", ""),
            "category": professional.get("category", ""),
        }
    
    # Add service info
    if service:
        result["service"] = {
            "id": str(service.get("_id", "")),
            "name": service.get("name", ""),
            "category": service.get("category", ""),
            "price": service.get("price", 0),
            "duration": service.get("duration", ""),
            "image": service.get("image", ""),
        }
    
    # Add user info (for professional view)
    if user:
        result["user"] = {
            "id": str(user.get("_id", "")),
            "name": user.get("name", "Customer"),
            "phone": user.get("phone", ""),
            "email": user.get("email", ""),
        }
    
    return result


def generate_otp():
    """Generate a 5-digit OTP"""
    return ''.join(random.choices(string.digits, k=5))


@router.get("/my-bookings")
async def get_user_bookings(
    status: Optional[str] = Query(None, description="Filter by status: pending, confirmed, ongoing, completed, cancelled"),
    category: Optional[str] = Query(None, description="Filter by category"),
    search: Optional[str] = Query(None, description="Search by booking ID or service"),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    current_user: dict = Depends(get_current_user)
):
    """Get all bookings for the current user"""
    try:
        bookings_collection = db.db.get_collection("bookings")
        users_collection = db.db.get_collection("users")
        services_collection = db.db.get_collection("services")
        
        user_id = str(current_user["_id"])
        
        # Build query
        query = {"user_id": user_id}
        
        if status and status != "all":
            query["status"] = status
        
        if category and category != "all":
            query["category"] = category
        
        if search:
            query["$or"] = [
                {"booking_id_display": {"$regex": search, "$options": "i"}},
                {"service_type": {"$regex": search, "$options": "i"}},
                {"service_name": {"$regex": search, "$options": "i"}},
            ]
        
        # Get total count
        total = await bookings_collection.count_documents(query)
        
        # Get bookings with pagination, sorted by created_at desc
        cursor = bookings_collection.find(query).sort("created_at", -1).skip(skip).limit(limit)
        bookings = await cursor.to_list(length=limit)
        
        # Enrich with professional and service details
        result_bookings = []
        for booking in bookings:
            professional = None
            service = None
            
            # Get professional details
            if booking.get("professional_id"):
                try:
                    professional = await users_collection.find_one({"_id": ObjectId(booking["professional_id"])})
                except:
                    pass
            
            # Get service details
            if booking.get("service_id"):
                try:
                    service = await services_collection.find_one({"_id": ObjectId(booking["service_id"])})
                except:
                    pass
            
            result_bookings.append(booking_helper(booking, professional, service))
        
        # Get counts by status
        status_counts = {
            "all": total,
            "pending": await bookings_collection.count_documents({"user_id": user_id, "status": "pending"}),
            "confirmed": await bookings_collection.count_documents({"user_id": user_id, "status": "confirmed"}),
            "upcoming": await bookings_collection.count_documents({"user_id": user_id, "status": {"$in": ["pending", "confirmed"]}}),
            "ongoing": await bookings_collection.count_documents({"user_id": user_id, "status": "ongoing"}),
            "completed": await bookings_collection.count_documents({"user_id": user_id, "status": "completed"}),
            "cancelled": await bookings_collection.count_documents({"user_id": user_id, "status": "cancelled"}),
        }
        
        return {
            "bookings": result_bookings,
            "total": total,
            "status_counts": status_counts,
            "skip": skip,
            "limit": limit,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/booking/{booking_id}")
async def get_booking_details(
    booking_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get detailed information about a specific booking"""
    try:
        bookings_collection = db.db.get_collection("bookings")
        users_collection = db.db.get_collection("users")
        services_collection = db.db.get_collection("services")
        
        user_id = str(current_user["_id"])
        user_role = current_user.get("role", "user")
        
        # Find booking
        booking = await bookings_collection.find_one({"_id": ObjectId(booking_id)})
        
        if not booking:
            raise HTTPException(status_code=404, detail="Booking not found")
        
        # Check access - user can view their own bookings, professionals can view bookings assigned to them
        if booking.get("user_id") != user_id and booking.get("professional_id") != user_id:
            if user_role not in ["admin", "manager"]:
                raise HTTPException(status_code=403, detail="Access denied")
        
        # Get professional details
        professional = None
        if booking.get("professional_id"):
            try:
                professional = await users_collection.find_one({"_id": ObjectId(booking["professional_id"])})
            except:
                pass
        
        # Get service details
        service = None
        if booking.get("service_id"):
            try:
                service = await services_collection.find_one({"_id": ObjectId(booking["service_id"])})
            except:
                pass
        
        # Get user details (for professional view)
        user = None
        if booking.get("user_id") and booking.get("professional_id") == user_id:
            try:
                user = await users_collection.find_one({"_id": ObjectId(booking["user_id"])})
            except:
                pass
        
        return {
            "booking": booking_helper(booking, professional, service, user)
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/create")
async def create_booking(
    booking_data: dict,
    current_user: dict = Depends(get_current_user)
):
    """Create a new booking"""
    try:
        bookings_collection = db.db.get_collection("bookings")
        users_collection = db.db.get_collection("users")
        services_collection = db.db.get_collection("services")
        
        user_id = str(current_user["_id"])
        
        # Validate required fields
        required_fields = ["professional_id", "scheduled_date", "scheduled_time"]
        for field in required_fields:
            if not booking_data.get(field):
                raise HTTPException(status_code=400, detail=f"Missing required field: {field}")
        
        # Get professional details
        professional = await users_collection.find_one({"_id": ObjectId(booking_data["professional_id"])})
        if not professional:
            raise HTTPException(status_code=404, detail="Professional not found")
        
        # Check for existing active booking with same professional at same date/time
        existing_booking = await bookings_collection.find_one({
            "user_id": user_id,
            "professional_id": booking_data["professional_id"],
            "scheduled_date": booking_data["scheduled_date"],
            "scheduled_time": booking_data["scheduled_time"],
            "status": {"$in": ["pending", "confirmed", "accepted", "ongoing"]}
        })
        if existing_booking:
            raise HTTPException(
                status_code=400, 
                detail="You already have an active booking with this professional at this time slot"
            )
        
        # Get service details if provided
        service = None
        if booking_data.get("service_id"):
            service = await services_collection.find_one({"_id": ObjectId(booking_data["service_id"])})
        
        # Generate OTP for verification
        otp = generate_otp()
        
        # Prepare booking document
        booking_doc = {
            "user_id": user_id,
            "professional_id": booking_data["professional_id"],
            "service_id": booking_data.get("service_id"),
            "service_type": booking_data.get("service_type") or (service.get("name") if service else professional.get("category", "Service")),
            "service_name": booking_data.get("service_name") or (service.get("name") if service else ""),
            "category": booking_data.get("category") or (service.get("category") if service else professional.get("category", "Other")),
            "description": booking_data.get("description", ""),
            "scheduled_date": booking_data["scheduled_date"],
            "scheduled_time": booking_data["scheduled_time"],
            "address": booking_data.get("address", {}),
            "price": booking_data.get("price", service.get("price", 0) if service else 0),
            "payment_method": booking_data.get("payment_method", "cash"),
            "payment_status": "pending",
            "status": "pending",
            "otp": otp,
            "notes": booking_data.get("notes", ""),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }
        
        # Insert booking
        result = await bookings_collection.insert_one(booking_doc)
        booking_doc["_id"] = result.inserted_id
        
        # Generate display ID
        category_prefix = {
            "Electrical": "ELX",
            "Plumbing": "PLB",
            "Cleaning": "CLN",
            "Appliance": "APL",
            "AC & Refrigeration": "ACR",
            "Carpentry": "CAR",
            "Painting": "PNT",
            "Pest Control": "PST",
            "Home Renovation": "HMR",
            "Security Systems": "SEC",
            "Solar Installation": "SOL",
        }.get(booking_doc["category"], "SRV")
        booking_id_display = f"#{category_prefix}-{str(result.inserted_id)[-6:].upper()}"
        
        # Update with display ID
        await bookings_collection.update_one(
            {"_id": result.inserted_id},
            {"$set": {"booking_id_display": booking_id_display}}
        )
        booking_doc["booking_id_display"] = booking_id_display
        
        # Prepare booking response
        booking_response = booking_helper(booking_doc, professional, service)
        
        # Emit real-time notification to professional about new booking
        asyncio.create_task(emit_booking_confirmed(
            booking_id=str(result.inserted_id),
            user_id=user_id,
            professional_id=booking_data["professional_id"],
            booking_data=booking_response
        ))
        
        # Create persistent notification for professional
        asyncio.create_task(NotificationService.new_booking_request(
            professional_id=booking_data["professional_id"],
            booking_id=str(result.inserted_id),
            service_name=booking_doc.get("service_name") or booking_doc.get("service_type", "Service"),
            customer_name=current_user.get("name", "Customer"),
            date=booking_data["scheduled_date"],
            time=booking_data["scheduled_time"],
            price=booking_doc.get("price", 0)
        ))
        
        return {
            "message": "Booking created successfully",
            "booking": booking_response,
            "otp": otp,
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/update/{booking_id}")
async def update_booking(
    booking_id: str,
    update_data: dict,
    current_user: dict = Depends(get_current_user)
):
    """Update a booking (reschedule, update status, etc.)"""
    try:
        bookings_collection = db.db.get_collection("bookings")
        
        user_id = str(current_user["_id"])
        user_role = current_user.get("role", "user")
        
        # Find booking
        booking = await bookings_collection.find_one({"_id": ObjectId(booking_id)})
        
        if not booking:
            raise HTTPException(status_code=404, detail="Booking not found")
        
        # Check access
        is_owner = booking.get("user_id") == user_id
        is_professional = booking.get("professional_id") == user_id
        is_admin = user_role in ["admin", "manager"]
        
        if not (is_owner or is_professional or is_admin):
            raise HTTPException(status_code=403, detail="Access denied")
        
        # Prepare update fields
        allowed_user_fields = ["scheduled_date", "scheduled_time", "address", "notes"]
        allowed_professional_fields = ["status", "otp"]
        allowed_admin_fields = ["status", "price", "payment_status", "refund_status"]
        
        update_fields = {"updated_at": datetime.utcnow()}
        
        # Track if date/time changed for rescheduling notification
        is_rescheduled = False
        old_date = booking.get("scheduled_date", "")
        old_time = booking.get("scheduled_time", "")
        new_date = old_date
        new_time = old_time
        
        for key, value in update_data.items():
            if is_owner and key in allowed_user_fields:
                update_fields[key] = value
                if key == "scheduled_date":
                    new_date = value
                    is_rescheduled = True
                if key == "scheduled_time":
                    new_time = value
                    is_rescheduled = True
            elif is_professional and key in allowed_professional_fields:
                update_fields[key] = value
            elif is_admin and key in allowed_admin_fields:
                update_fields[key] = value
        
        # Update booking
        await bookings_collection.update_one(
            {"_id": ObjectId(booking_id)},
            {"$set": update_fields}
        )
        
        updated_booking = await bookings_collection.find_one({"_id": ObjectId(booking_id)})
        
        # If user rescheduled, notify professional
        if is_owner and is_rescheduled and booking.get("professional_id"):
            asyncio.create_task(NotificationService.booking_rescheduled_professional(
                professional_id=booking.get("professional_id"),
                booking_id=booking_id,
                service_name=booking.get("service_name") or booking.get("service_type", "Service"),
                customer_name=current_user.get("name", "Customer"),
                old_date=old_date,
                old_time=old_time,
                new_date=new_date,
                new_time=new_time
            ))
        
        return {
            "message": "Booking updated successfully",
            "booking": booking_helper(updated_booking),
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/cancel/{booking_id}")
async def cancel_booking(
    booking_id: str,
    cancellation_reason: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """Cancel a booking"""
    try:
        bookings_collection = db.db.get_collection("bookings")
        
        user_id = str(current_user["_id"])
        user_role = current_user.get("role", "user")
        
        # Find booking
        booking = await bookings_collection.find_one({"_id": ObjectId(booking_id)})
        
        if not booking:
            raise HTTPException(status_code=404, detail="Booking not found")
        
        # Check if user owns the booking or is the professional
        is_owner = booking.get("user_id") == user_id
        is_professional = booking.get("professional_id") == user_id
        
        if not (is_owner or is_professional):
            raise HTTPException(status_code=403, detail="Access denied")
        
        # Check if booking can be cancelled
        if booking.get("status") in ["completed", "cancelled"]:
            raise HTTPException(status_code=400, detail="Booking cannot be cancelled")
        
        # Calculate refund
        refund_status = ""
        if booking.get("payment_status") == "paid":
            refund_status = f"Refund of ₹{booking.get('price', 0)} initiated"
        
        cancelled_by = "professional" if is_professional else "user"
        
        # Update booking
        await bookings_collection.update_one(
            {"_id": ObjectId(booking_id)},
            {
                "$set": {
                    "status": "cancelled",
                    "cancellation_reason": cancellation_reason or f"Cancelled by {cancelled_by}",
                    "cancelled_by": cancelled_by,
                    "refund_status": refund_status,
                    "cancelled_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow(),
                }
            }
        )
        
        updated_booking = await bookings_collection.find_one({"_id": ObjectId(booking_id)})
        
        # Emit real-time cancellation notification
        asyncio.create_task(emit_booking_cancelled(
            booking_id=booking_id,
            user_id=booking.get("user_id"),
            professional_id=booking.get("professional_id"),
            cancelled_by=cancelled_by,
            reason=cancellation_reason
        ))
        
        # Get user and professional details for notifications
        users_collection = db.db.get_collection("users")
        booking_user = await users_collection.find_one({"_id": ObjectId(booking.get("user_id"))})
        professional = await users_collection.find_one({"_id": ObjectId(booking.get("professional_id"))}) if booking.get("professional_id") else None
        
        # Create persistent notification for the other party
        if cancelled_by == "user" and booking.get("professional_id"):
            # Notify professional that user cancelled
            asyncio.create_task(NotificationService.booking_cancelled_notify_professional(
                professional_id=booking.get("professional_id"),
                booking_id=booking_id,
                service_name=booking.get("service_name") or booking.get("service_type", "Service"),
                customer_name=booking_user.get("name", "Customer") if booking_user else "Customer",
                date=booking.get("scheduled_date", ""),
                time=booking.get("scheduled_time", ""),
                reason=cancellation_reason
            ))
        elif cancelled_by == "professional":
            # Notify user that professional cancelled
            asyncio.create_task(NotificationService.booking_cancelled_notify_user(
                user_id=booking.get("user_id"),
                booking_id=booking_id,
                service_name=booking.get("service_name") or booking.get("service_type", "Service"),
                professional_name=professional.get("name", "Professional") if professional else "Professional",
                reason=cancellation_reason
            ))
        
        return {
            "message": "Booking cancelled successfully",
            "booking": booking_helper(updated_booking),
            "refund_status": refund_status,
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/rate/{booking_id}")
async def rate_booking(
    booking_id: str,
    rating: int = Query(..., ge=1, le=5),
    review: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """Rate a completed booking"""
    try:
        bookings_collection = db.db.get_collection("bookings")
        users_collection = db.db.get_collection("users")
        
        user_id = str(current_user["_id"])
        
        # Find booking
        booking = await bookings_collection.find_one({"_id": ObjectId(booking_id)})
        
        if not booking:
            raise HTTPException(status_code=404, detail="Booking not found")
        
        # Check if user owns the booking
        if booking.get("user_id") != user_id:
            raise HTTPException(status_code=403, detail="Access denied")
        
        # Check if booking is completed
        if booking.get("status") != "completed":
            raise HTTPException(status_code=400, detail="Only completed bookings can be rated")
        
        # Check if already rated
        if booking.get("rating"):
            raise HTTPException(status_code=400, detail="Booking already rated")
        
        # Update booking with rating
        await bookings_collection.update_one(
            {"_id": ObjectId(booking_id)},
            {
                "$set": {
                    "rating": rating,
                    "review": review or "",
                    "rated_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow(),
                }
            }
        )
        
        # Update professional's average rating
        if booking.get("professional_id"):
            try:
                professional_id = booking["professional_id"]
                
                # Get all rated bookings for this professional
                rated_bookings = await bookings_collection.find({
                    "professional_id": professional_id,
                    "rating": {"$exists": True, "$ne": None}
                }).to_list(length=1000)
                
                if rated_bookings:
                    avg_rating = sum(b.get("rating", 0) for b in rated_bookings) / len(rated_bookings)
                    
                    await users_collection.update_one(
                        {"_id": ObjectId(professional_id)},
                        {
                            "$set": {
                                "rating": round(avg_rating, 2),
                                "total_ratings": len(rated_bookings),
                            }
                        }
                    )
                
                # Notify professional about the new review
                asyncio.create_task(NotificationService.new_review_received(
                    professional_id=professional_id,
                    booking_id=booking_id,
                    customer_name=current_user.get("name", "Customer"),
                    rating=rating,
                    review=review
                ))
            except Exception as e:
                print(f"Error updating professional rating: {e}")
        
        updated_booking = await bookings_collection.find_one({"_id": ObjectId(booking_id)})
        
        return {
            "message": "Rating submitted successfully",
            "booking": booking_helper(updated_booking),
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/professional-bookings")
async def get_professional_bookings(
    status: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    current_user: dict = Depends(get_current_user)
):
    """Get all bookings for the current professional"""
    try:
        bookings_collection = db.db.get_collection("bookings")
        users_collection = db.db.get_collection("users")
        services_collection = db.db.get_collection("services")
        
        professional_id = str(current_user["_id"])
        
        # Check if user is a professional
        if current_user.get("role") != "professional":
            raise HTTPException(status_code=403, detail="Only professionals can access this endpoint")
        
        # Build query
        query = {"professional_id": professional_id}
        
        if status and status != "all":
            query["status"] = status
        
        # Get total count
        total = await bookings_collection.count_documents(query)
        
        # Get bookings
        cursor = bookings_collection.find(query).sort("created_at", -1).skip(skip).limit(limit)
        bookings = await cursor.to_list(length=limit)
        
        # Enrich with user and service details
        result_bookings = []
        for booking in bookings:
            user = None
            service = None
            
            # Get user details
            if booking.get("user_id"):
                try:
                    user = await users_collection.find_one({"_id": ObjectId(booking["user_id"])})
                except:
                    pass
            
            # Get service details
            if booking.get("service_id"):
                try:
                    service = await services_collection.find_one({"_id": ObjectId(booking["service_id"])})
                except:
                    pass
            
            result_bookings.append(booking_helper(booking, None, service, user))
        
        return {
            "bookings": result_bookings,
            "total": total,
            "skip": skip,
            "limit": limit,
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/start/{booking_id}")
async def start_booking(
    booking_id: str,
    otp: str,
    current_user: dict = Depends(get_current_user)
):
    """Start a booking (professional verifies OTP)"""
    try:
        bookings_collection = db.db.get_collection("bookings")
        
        professional_id = str(current_user["_id"])
        
        # Find booking
        booking = await bookings_collection.find_one({"_id": ObjectId(booking_id)})
        
        if not booking:
            raise HTTPException(status_code=404, detail="Booking not found")
        
        # Check if professional owns the booking
        if booking.get("professional_id") != professional_id:
            raise HTTPException(status_code=403, detail="Access denied")
        
        # Check booking status
        if booking.get("status") not in ["pending", "confirmed", "accepted"]:
            raise HTTPException(status_code=400, detail="Booking cannot be started")
        
        # Verify OTP
        if booking.get("otp") != otp:
            raise HTTPException(status_code=400, detail="Invalid OTP")
        
        # Update booking status
        await bookings_collection.update_one(
            {"_id": ObjectId(booking_id)},
            {
                "$set": {
                    "status": "ongoing",
                    "started_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow(),
                }
            }
        )
        
        updated_booking = await bookings_collection.find_one({"_id": ObjectId(booking_id)})
        booking_response = booking_helper(updated_booking)
        
        # Emit real-time work started notification
        asyncio.create_task(emit_work_started(
            booking_id=booking_id,
            user_id=booking.get("user_id"),
            professional_id=professional_id,
            booking_data=booking_response
        ))
        
        # Create persistent notification for user that work has started
        asyncio.create_task(NotificationService.work_started_user(
            user_id=booking.get("user_id"),
            booking_id=booking_id,
            service_name=booking.get("service_name") or booking.get("service_type", "Service"),
            professional_name=current_user.get("name", "Professional")
        ))
        
        return {
            "message": "Booking started successfully",
            "booking": booking_response,
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/complete/{booking_id}")
async def complete_booking(
    booking_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Complete a booking (professional marks as done)"""
    try:
        bookings_collection = db.db.get_collection("bookings")
        
        professional_id = str(current_user["_id"])
        
        # Find booking
        booking = await bookings_collection.find_one({"_id": ObjectId(booking_id)})
        
        if not booking:
            raise HTTPException(status_code=404, detail="Booking not found")
        
        # Check if professional owns the booking
        if booking.get("professional_id") != professional_id:
            raise HTTPException(status_code=403, detail="Access denied")
        
        # Check booking status
        if booking.get("status") != "ongoing":
            raise HTTPException(status_code=400, detail="Only ongoing bookings can be completed")
        
        # Update booking status
        await bookings_collection.update_one(
            {"_id": ObjectId(booking_id)},
            {
                "$set": {
                    "status": "completed",
                    "completed_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow(),
                }
            }
        )
        
        updated_booking = await bookings_collection.find_one({"_id": ObjectId(booking_id)})
        booking_response = booking_helper(updated_booking)
        
        # Emit real-time work completed notification
        asyncio.create_task(emit_work_completed(
            booking_id=booking_id,
            user_id=booking.get("user_id"),
            professional_id=professional_id,
            booking_data=booking_response
        ))
        
        # Get user details for notification
        users_collection = db.db.get_collection("users")
        booking_user = await users_collection.find_one({"_id": ObjectId(booking.get("user_id"))})
        
        # Create persistent notification for user that work is complete
        asyncio.create_task(NotificationService.work_completed_user(
            user_id=booking.get("user_id"),
            booking_id=booking_id,
            service_name=booking.get("service_name") or booking.get("service_type", "Service"),
            professional_name=current_user.get("name", "Professional"),
            amount=booking.get("price", 0)
        ))
        
        # Create persistent notification for professional
        asyncio.create_task(NotificationService.work_completed_professional(
            professional_id=professional_id,
            booking_id=booking_id,
            service_name=booking.get("service_name") or booking.get("service_type", "Service"),
            customer_name=booking_user.get("name", "Customer") if booking_user else "Customer",
            amount=booking.get("price", 0)
        ))
        
        return {
            "message": "Booking completed successfully",
            "booking": booking_response,
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/accept/{booking_id}")
async def accept_booking(
    booking_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Accept a booking (professional accepts the job)"""
    try:
        bookings_collection = db.db.get_collection("bookings")
        
        professional_id = str(current_user["_id"])
        
        # Check if user is a professional
        if current_user.get("role") != "professional":
            raise HTTPException(status_code=403, detail="Only professionals can accept bookings")
        
        # Find booking
        booking = await bookings_collection.find_one({"_id": ObjectId(booking_id)})
        
        if not booking:
            raise HTTPException(status_code=404, detail="Booking not found")
        
        # Check if professional owns the booking
        if booking.get("professional_id") != professional_id:
            raise HTTPException(status_code=403, detail="Access denied")
        
        # Check booking status
        if booking.get("status") not in ["pending", "confirmed"]:
            raise HTTPException(status_code=400, detail="Booking cannot be accepted")
        
        # Update booking status
        await bookings_collection.update_one(
            {"_id": ObjectId(booking_id)},
            {
                "$set": {
                    "status": "accepted",
                    "accepted_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow(),
                }
            }
        )
        
        updated_booking = await bookings_collection.find_one({"_id": ObjectId(booking_id)})
        booking_response = booking_helper(updated_booking)
        
        # Emit real-time booking accepted notification
        asyncio.create_task(emit_booking_accepted(
            booking_id=booking_id,
            user_id=booking.get("user_id"),
            professional_id=professional_id,
            booking_data=booking_response
        ))
        
        # Create persistent notification for user that professional accepted
        asyncio.create_task(NotificationService.booking_accepted_user(
            user_id=booking.get("user_id"),
            booking_id=booking_id,
            service_name=booking.get("service_name") or booking.get("service_type", "Service"),
            professional_name=current_user.get("name", "Professional"),
            date=booking.get("scheduled_date", ""),
            time=booking.get("scheduled_time", "")
        ))
        
        return {
            "message": "Booking accepted successfully",
            "booking": booking_response,
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/reject/{booking_id}")
async def reject_booking(
    booking_id: str,
    rejection_reason: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """Reject a booking (professional rejects the job)"""
    try:
        bookings_collection = db.db.get_collection("bookings")
        
        professional_id = str(current_user["_id"])
        
        # Check if user is a professional
        if current_user.get("role") != "professional":
            raise HTTPException(status_code=403, detail="Only professionals can reject bookings")
        
        # Find booking
        booking = await bookings_collection.find_one({"_id": ObjectId(booking_id)})
        
        if not booking:
            raise HTTPException(status_code=404, detail="Booking not found")
        
        # Check if professional owns the booking
        if booking.get("professional_id") != professional_id:
            raise HTTPException(status_code=403, detail="Access denied")
        
        # Check booking status
        if booking.get("status") not in ["pending", "confirmed"]:
            raise HTTPException(status_code=400, detail="Booking cannot be rejected")
        
        # Update booking status
        await bookings_collection.update_one(
            {"_id": ObjectId(booking_id)},
            {
                "$set": {
                    "status": "cancelled",
                    "cancellation_reason": rejection_reason or "Rejected by professional",
                    "cancelled_by": "professional",
                    "rejected_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow(),
                }
            }
        )
        
        updated_booking = await bookings_collection.find_one({"_id": ObjectId(booking_id)})
        
        # Emit real-time cancellation notification
        asyncio.create_task(emit_booking_cancelled(
            booking_id=booking_id,
            user_id=booking.get("user_id"),
            professional_id=professional_id,
            cancelled_by="professional",
            reason=rejection_reason
        ))
        
        # Create persistent notification for user that professional rejected
        asyncio.create_task(NotificationService.booking_rejected_user(
            user_id=booking.get("user_id"),
            booking_id=booking_id,
            service_name=booking.get("service_name") or booking.get("service_type", "Service"),
            professional_name=current_user.get("name", "Professional"),
            reason=rejection_reason
        ))
        
        return {
            "message": "Booking rejected",
            "booking": booking_helper(updated_booking),
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/send-otp/{booking_id}")
async def send_otp_request(
    booking_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Send OTP request to user (professional arrived at location)"""
    try:
        bookings_collection = db.db.get_collection("bookings")
        
        professional_id = str(current_user["_id"])
        
        # Check if user is a professional
        if current_user.get("role") != "professional":
            raise HTTPException(status_code=403, detail="Only professionals can send OTP requests")
        
        # Find booking
        booking = await bookings_collection.find_one({"_id": ObjectId(booking_id)})
        
        if not booking:
            raise HTTPException(status_code=404, detail="Booking not found")
        
        # Check if professional owns the booking
        if booking.get("professional_id") != professional_id:
            raise HTTPException(status_code=403, detail="Access denied")
        
        # Check booking status
        if booking.get("status") not in ["pending", "confirmed", "accepted"]:
            raise HTTPException(status_code=400, detail="Cannot request OTP for this booking")
        
        # Update booking with OTP request timestamp
        await bookings_collection.update_one(
            {"_id": ObjectId(booking_id)},
            {
                "$set": {
                    "otp_requested_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow(),
                }
            }
        )
        
        # Emit real-time OTP request notification to user
        asyncio.create_task(emit_otp_sent(
            booking_id=booking_id,
            user_id=booking.get("user_id"),
            professional_id=professional_id,
            otp=booking.get("otp")  # Send OTP to user
        ))
        
        # Create persistent notification for user that professional has arrived
        asyncio.create_task(NotificationService.professional_arrived(
            user_id=booking.get("user_id"),
            booking_id=booking_id,
            professional_name=current_user.get("name", "Professional"),
            otp=booking.get("otp")
        ))
        
        return {
            "message": "OTP request sent to customer",
            "booking_id": booking_id,
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
