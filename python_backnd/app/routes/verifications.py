"""
Verification routes for professional and shop registrations
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import Optional, List
from datetime import datetime, timedelta
from bson import ObjectId

from app.database import get_database
from app.middleware.rbac import require_roles
from app.models.user import UserRole
from app.models.verification import (
    ProfessionalVerificationCreate,
    ProfessionalVerificationUpdate,
    ShopVerificationCreate,
    ShopVerificationUpdate,
    VerificationResponse,
    VerificationListResponse,
    VerificationStatsResponse,
    VerificationStatus,
    VerificationType,
    RiskScore,
    verification_helper
)

router = APIRouter(prefix="/verifications", tags=["Verifications"])


# ============ PUBLIC ENDPOINTS (for registration) ============

@router.post("/professional", response_model=VerificationResponse)
async def submit_professional_verification(
    data: ProfessionalVerificationCreate,
    db=Depends(get_database)
):
    """Submit professional registration for verification (called during registration)"""
    
    # Allow same phone for multiple roles (customer can also be professional)
    # Only check if already has pending/approved professional verification
    
    # Check if already submitted with same phone
    existing = await db.verifications.find_one({
        "phone": data.phone,
        "verification_type": "professional",
        "status": {"$in": ["pending", "approved"]}
    })
    
    if existing:
        if existing.get("status") == "approved":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Professional registration already approved"
            )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Verification request already pending"
        )
    
    # Calculate risk score based on data completeness
    risk_score = calculate_risk_score(data.dict(), "professional")
    
    # Create verification document
    verification_doc = {
        "verification_type": "professional",
        "status": "pending",
        "risk_score": risk_score,
        
        # Basic Info
        "name": data.name,
        "phone": data.phone,
        "email": data.email,
        "date_of_birth": data.date_of_birth,
        "gender": data.gender,
        
        # Service Details
        "profession": data.profession,
        "sub_category": data.sub_category,
        "experience": data.experience,
        "qualifications": data.qualifications,
        "certifications": data.certifications,
        "languages": data.languages,
        
        # Location & Availability
        "address": data.address,
        "landmark": data.landmark,
        "city": data.city,
        "pincode": data.pincode,
        "service_radius": data.service_radius,
        "available_days": data.available_days,
        "start_time": data.start_time,
        "end_time": data.end_time,
        
        # Documents
        "aadhaar_number": data.aadhaar_number,
        "pan_number": data.pan_number,
        "driving_license": data.driving_license,
        "police_verification": data.police_verification,
        
        # Banking
        "bank_account_number": data.bank_account_number,
        "ifsc_code": data.ifsc_code,
        "account_holder_name": data.account_holder_name,
        
        # Equipment
        "own_equipment": data.own_equipment,
        "equipment_list": data.equipment_list,
        
        "profile_image": data.profile_image,
        
        # Documents (can be uploaded later)
        "documents": [],
        
        # Timestamps
        "submitted_at": datetime.utcnow(),
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }
    
    result = await db.verifications.insert_one(verification_doc)
    verification_doc["_id"] = result.inserted_id
    
    # Create temporary user account for tracking verification status
    users_collection = db.users
    
    # Normalize phone number (remove spaces, ensure consistent format)
    normalized_phone = data.phone.replace(" ", "").replace("-", "")
    
    # Try to find existing user with any phone format
    existing_user = await users_collection.find_one({"phone": normalized_phone})
    if not existing_user and not normalized_phone.startswith("+"):
        existing_user = await users_collection.find_one({"phone": f"+91{normalized_phone}"})
    if not existing_user and normalized_phone.startswith("+91"):
        existing_user = await users_collection.find_one({"phone": normalized_phone[3:]})
    
    if not existing_user:
        # Create new temporary user account
        from app.utils.security import hash_password
        temp_user = {
            "name": data.name,
            "phone": normalized_phone,
            "email": data.email,
            "role": "pending_professional",
            "verification_id": str(result.inserted_id),
            "hashed_password": None,  # No password yet, only OTP login
            "auth_provider": "local",
            "is_verified": False,
            "is_active": True,  # Active so they can login to check status
            "email_verified": bool(data.email),
            "phone_verified": True,
            "profile_image": data.profile_image,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }
        await users_collection.insert_one(temp_user)
    else:
        # Update existing user with verification_id
        await users_collection.update_one(
            {"_id": existing_user["_id"]},
            {"$set": {
                "verification_id": str(result.inserted_id),
                "role": "pending_professional",
                "is_active": True,
                "updated_at": datetime.utcnow()
            }}
        )
    
    return verification_helper(verification_doc)


@router.post("/shop", response_model=VerificationResponse)
async def submit_shop_verification(
    data: ShopVerificationCreate,
    db=Depends(get_database)
):
    """Submit shop registration for verification (called during registration)"""
    
    # Allow same phone for multiple roles (customer can also be shop owner)
    # Only check if already has pending/approved shop verification
    
    # Check if already submitted with same phone
    existing = await db.verifications.find_one({
        "phone": data.phone,
        "verification_type": "shop",
        "status": {"$in": ["pending", "approved"]}
    })
    
    if existing:
        if existing.get("status") == "approved":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Shop registration already approved"
            )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Verification request already pending"
        )
    
    # Calculate risk score based on data completeness
    risk_score = calculate_risk_score(data.dict(), "shop")
    
    # Create verification document
    verification_doc = {
        "verification_type": "shop",
        "status": "pending",
        "risk_score": risk_score,
        
        # Owner Info
        "name": data.owner_name,  # Owner name stored as name
        "phone": data.phone,
        "email": data.email,
        "alternate_phone": data.alternate_phone,
        
        # Shop Info
        "shop_name": data.shop_name,
        "category": data.category,
        "shop_type": data.shop_type,
        "description": data.description,
        "established_year": data.established_year,
        
        # Location & Timing
        "shop_address": data.shop_address,
        "landmark": data.landmark,
        "city": data.city,
        "pincode": data.pincode,
        "opening_time": data.opening_time,
        "closing_time": data.closing_time,
        "working_days": data.working_days,
        
        # Business Documents
        "gst_number": data.gst_number,
        "has_gst": data.has_gst,
        "pan_number": data.pan_number,
        "fssai_number": data.fssai_number,
        "trade_license": data.trade_license,
        
        # Banking
        "bank_account_number": data.bank_account_number,
        "ifsc_code": data.ifsc_code,
        "account_holder_name": data.account_holder_name,
        
        # Delivery
        "delivery_available": data.delivery_available,
        "delivery_radius": data.delivery_radius,
        "minimum_order_value": data.minimum_order_value,
        
        "shop_image": data.shop_image,
        
        # Documents (can be uploaded later)
        "documents": [],
        
        # Timestamps
        "submitted_at": datetime.utcnow(),
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }
    
    result = await db.verifications.insert_one(verification_doc)
    verification_doc["_id"] = result.inserted_id
    
    # Create temporary user account for tracking verification status
    users_collection = db.users
    
    # Normalize phone number (remove spaces, ensure consistent format)
    normalized_phone = data.phone.replace(" ", "").replace("-", "")
    
    # Try to find existing user with any phone format
    existing_user = await users_collection.find_one({"phone": normalized_phone})
    if not existing_user and not normalized_phone.startswith("+"):
        existing_user = await users_collection.find_one({"phone": f"+91{normalized_phone}"})
    if not existing_user and normalized_phone.startswith("+91"):
        existing_user = await users_collection.find_one({"phone": normalized_phone[3:]})
    
    if not existing_user:
        # Create new temporary user account
        from app.utils.security import hash_password
        temp_user = {
            "name": data.owner_name,
            "phone": normalized_phone,
            "email": data.email,
            "role": "pending_shopkeeper",
            "verification_id": str(result.inserted_id),
            "hashed_password": None,  # No password yet, only OTP login
            "auth_provider": "local",
            "is_verified": False,
            "is_active": True,  # Active so they can login to check status
            "email_verified": bool(data.email),
            "phone_verified": True,
            "profile_image": data.shop_image,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }
        await users_collection.insert_one(temp_user)
    else:
        # Update existing user with verification_id
        await users_collection.update_one(
            {"_id": existing_user["_id"]},
            {"$set": {
                "verification_id": str(result.inserted_id),
                "role": "pending_shopkeeper",
                "is_active": True,
                "updated_at": datetime.utcnow()
            }}
        )
    
    return verification_helper(verification_doc)


# ============ MANAGER ENDPOINTS ============

@router.get("", response_model=VerificationListResponse)
async def get_all_verifications(
    status: Optional[str] = Query(None, description="Filter by status"),
    verification_type: Optional[str] = Query(None, description="Filter by type (professional/shop)"),
    search: Optional[str] = Query(None, description="Search by name or phone"),
    risk_score: Optional[str] = Query(None, description="Filter by risk score"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    current_user: dict = Depends(require_roles([UserRole.MANAGER, UserRole.ADMIN])),
    db=Depends(get_database)
):
    """Get all verification requests (for managers/admins)"""
    
    # Build query
    query = {}
    
    if status and status != "all":
        query["status"] = status
    
    if verification_type and verification_type != "all":
        query["verification_type"] = verification_type
    
    if risk_score and risk_score != "all":
        query["risk_score"] = risk_score
    
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"phone": {"$regex": search, "$options": "i"}},
            {"shop_name": {"$regex": search, "$options": "i"}},
        ]
    
    # Get total count
    total = await db.verifications.count_documents(query)
    
    # Get verifications with pagination
    skip = (page - 1) * limit
    cursor = db.verifications.find(query).sort("submitted_at", -1).skip(skip).limit(limit)
    verifications = await cursor.to_list(length=limit)
    
    return {
        "verifications": [verification_helper(v) for v in verifications],
        "total": total,
        "page": page,
        "limit": limit
    }


@router.get("/stats", response_model=VerificationStatsResponse)
async def get_verification_stats(
    current_user: dict = Depends(require_roles([UserRole.MANAGER, UserRole.ADMIN])),
    db=Depends(get_database)
):
    """Get verification statistics"""
    
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    
    # Count pending
    pending = await db.verifications.count_documents({"status": "pending"})
    
    # Count approved today
    approved_today = await db.verifications.count_documents({
        "status": "approved",
        "reviewed_at": {"$gte": today_start}
    })
    
    # Count rejected today
    rejected_today = await db.verifications.count_documents({
        "status": "rejected",
        "reviewed_at": {"$gte": today_start}
    })
    
    # Count high risk
    high_risk = await db.verifications.count_documents({
        "risk_score": "high",
        "status": "pending"
    })
    
    # Count by type
    total_professionals = await db.verifications.count_documents({"verification_type": "professional"})
    total_shops = await db.verifications.count_documents({"verification_type": "shop"})
    
    return {
        "pending": pending,
        "approved_today": approved_today,
        "rejected_today": rejected_today,
        "high_risk": high_risk,
        "total_professionals": total_professionals,
        "total_shops": total_shops
    }


@router.get("/{verification_id}", response_model=VerificationResponse)
async def get_verification_by_id(
    verification_id: str,
    current_user: dict = Depends(require_roles([UserRole.MANAGER, UserRole.ADMIN])),
    db=Depends(get_database)
):
    """Get verification details by ID"""
    
    if not ObjectId.is_valid(verification_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid verification ID"
        )
    
    verification = await db.verifications.find_one({"_id": ObjectId(verification_id)})
    
    if not verification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Verification not found"
        )
    
    return verification_helper(verification)


@router.put("/{verification_id}", response_model=VerificationResponse)
async def update_verification(
    verification_id: str,
    data: ProfessionalVerificationUpdate,
    current_user: dict = Depends(require_roles([UserRole.MANAGER, UserRole.ADMIN])),
    db=Depends(get_database)
):
    """Update verification status (approve/reject)"""
    
    if not ObjectId.is_valid(verification_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid verification ID"
        )
    
    verification = await db.verifications.find_one({"_id": ObjectId(verification_id)})
    
    if not verification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Verification not found"
        )
    
    # Build update data
    update_data = {
        "updated_at": datetime.utcnow(),
        "reviewed_by": current_user["_id"],
        "reviewed_at": datetime.utcnow(),
    }
    
    if data.status:
        update_data["status"] = data.status
    
    if data.risk_score:
        update_data["risk_score"] = data.risk_score
    
    if data.admin_notes is not None:
        update_data["admin_notes"] = data.admin_notes
    
    if data.rejection_reason is not None:
        update_data["rejection_reason"] = data.rejection_reason
    
    # Update verification
    await db.verifications.update_one(
        {"_id": ObjectId(verification_id)},
        {"$set": update_data}
    )
    
    # If approved, update user role
    if data.status == "approved":
        await update_user_role_on_approval(db, verification)
    
    # Fetch updated verification
    updated = await db.verifications.find_one({"_id": ObjectId(verification_id)})
    
    return verification_helper(updated)


@router.delete("/{verification_id}")
async def delete_verification(
    verification_id: str,
    current_user: dict = Depends(require_roles([UserRole.ADMIN])),
    db=Depends(get_database)
):
    """Delete verification request (admin only)"""
    
    if not ObjectId.is_valid(verification_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid verification ID"
        )
    
    result = await db.verifications.delete_one({"_id": ObjectId(verification_id)})
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Verification not found"
        )
    
    return {"message": "Verification deleted successfully"}


# ============ PUBLIC STATUS ENDPOINTS ============

@router.get("/status/{phone}", response_model=VerificationResponse)
async def get_verification_status(
    phone: str,
    db=Depends(get_database)
):
    """Get verification status by phone number (public endpoint for users to check their status)"""
    
    # Find latest verification for this phone
    verification = await db.verifications.find_one(
        {"phone": phone},
        sort=[("created_at", -1)]  # Get most recent
    )
    
    if not verification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No verification found for this phone number"
        )
    
    return verification_helper(verification)


@router.put("/edit/{verification_id}", response_model=VerificationResponse)
async def edit_verification(
    verification_id: str,
    data: dict,
    db=Depends(get_database)
):
    """Edit verification data (only allowed when status is 'more_info_needed')"""
    
    if not ObjectId.is_valid(verification_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid verification ID"
        )
    
    # Get current verification
    verification = await db.verifications.find_one({"_id": ObjectId(verification_id)})
    
    if not verification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Verification not found"
        )
    
    # Only allow edit if status is 'more_info_needed'
    if verification.get("status") != "more_info_needed":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Can only edit when more information is requested"
        )
    
    # Update verification with new data
    update_data = {
        **data,
        "status": "pending",  # Reset to pending after edit
        "updated_at": datetime.utcnow(),
        "resubmitted_at": datetime.utcnow()
    }
    
    # Recalculate risk score
    verification_type = verification.get("verification_type", "professional")
    update_data["risk_score"] = calculate_risk_score(update_data, verification_type)
    
    await db.verifications.update_one(
        {"_id": ObjectId(verification_id)},
        {"$set": update_data}
    )
    
    # Get updated verification
    updated_verification = await db.verifications.find_one({"_id": ObjectId(verification_id)})
    
    return verification_helper(updated_verification)


# ============ HELPER FUNCTIONS ============

def calculate_risk_score(data: dict, verification_type: str) -> str:
    """Calculate risk score based on data completeness"""
    
    score = 0
    max_score = 0
    
    if verification_type == "professional":
        # Check required fields
        fields = ["name", "phone", "profession", "experience", "city", "pincode"]
        optional_fields = ["email", "address", "aadhaar_number", "profile_image"]
        
        for field in fields:
            max_score += 2
            if data.get(field):
                score += 2
        
        for field in optional_fields:
            max_score += 1
            if data.get(field):
                score += 1
        
        # Aadhaar gives extra trust
        if data.get("aadhaar_number"):
            score += 2
            max_score += 2
    
    else:  # shop
        fields = ["owner_name", "phone", "shop_name", "category", "shop_address", "city", "pincode"]
        optional_fields = ["email", "gst_number", "shop_image"]
        
        for field in fields:
            max_score += 2
            if data.get(field):
                score += 2
        
        for field in optional_fields:
            max_score += 1
            if data.get(field):
                score += 1
        
        # GST gives extra trust
        if data.get("gst_number") and data.get("has_gst"):
            score += 3
            max_score += 3
    
    # Calculate percentage
    percentage = (score / max_score * 100) if max_score > 0 else 0
    
    if percentage >= 80:
        return "low"
    elif percentage >= 50:
        return "medium"
    else:
        return "high"


async def update_user_role_on_approval(db, verification: dict):
    """Update user role when verification is approved"""
    
    phone = verification.get("phone")
    if not phone:
        return
    
    # Find user by phone
    user = await db.users.find_one({"phone": phone})
    
    if not user:
        return
    
    # Determine new role based on verification type
    new_role = "professional" if verification.get("verification_type") == "professional" else "shopkeeper"
    
    # Update user role
    await db.users.update_one(
        {"_id": user["_id"]},
        {
            "$set": {
                "role": new_role,
                "is_verified": True,
                "updated_at": datetime.utcnow()
            }
        }
    )
