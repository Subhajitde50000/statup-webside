"""
Verifications routes - Handle professional and shop registration approvals
Registrations are stored directly in users collection with approval_status
"""

from fastapi import APIRouter, HTTPException, status, Depends
from datetime import datetime
from bson import ObjectId
from typing import Optional, List
from pydantic import BaseModel, Field

from app.database import get_users_collection, get_database
from app.models.user import UserRole, user_helper
from app.utils.security import get_current_user, hash_password


router = APIRouter()


# ============ SCHEMAS ============

class ProfessionalRegistrationRequest(BaseModel):
    """Professional registration data"""
    name: str
    phone: str
    email: Optional[str] = None
    password: str
    
    # Professional details
    profession: str
    experience: str
    qualifications: Optional[str] = None
    
    # Location
    address: str
    city: str
    pincode: str
    service_radius: str = "5"
    
    # Documents (optional at registration)
    aadhaar_number: Optional[str] = None
    pan_number: Optional[str] = None
    
    # Profile
    profile_image: Optional[str] = None


class ShopRegistrationRequest(BaseModel):
    """Shop registration data"""
    owner_name: str
    phone: str
    email: Optional[str] = None
    password: str
    
    # Shop details
    shop_name: str
    category: str
    description: Optional[str] = None
    
    # Location
    shop_address: str
    city: str
    pincode: str
    
    # Business details
    gst_number: Optional[str] = None
    has_gst: bool = False
    pan_number: Optional[str] = None
    
    # Profile
    shop_image: Optional[str] = None


class ApprovalUpdateRequest(BaseModel):
    """Manager approval update"""
    status: str  # 'approved', 'rejected', 'more_info_needed'
    admin_notes: Optional[str] = None
    rejection_reason: Optional[str] = None


class RegistrationResponse(BaseModel):
    """Response after registration"""
    message: str
    user_id: str
    approval_status: str


# ============ PROFESSIONAL REGISTRATION ============

@router.post("/verifications/professional", response_model=RegistrationResponse)
async def register_professional(request: ProfessionalRegistrationRequest):
    """Register as a professional - saved directly to users with pending status"""
    users = get_users_collection()
    
    # Check if phone already exists
    existing = await users.find_one({"phone": request.phone})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Phone number already registered. Please login instead."
        )
    
    # Check if email already exists (if provided)
    if request.email:
        existing_email = await users.find_one({"email": request.email})
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
    
    # Generate email if not provided
    email = request.email or f"pro_{request.phone}@electromart.local"
    
    # Create user with pending approval status
    user_doc = {
        "name": request.name,
        "email": email,
        "phone": request.phone,
        "hashed_password": hash_password(request.password),
        "role": UserRole.PROFESSIONAL.value,
        "is_verified": False,  # Will be True after manager approval
        "is_active": False,    # Will be True after manager approval
        "phone_verified": True,
        "email_verified": False,
        
        # Approval status
        "approval_status": "pending",  # pending, approved, rejected, more_info_needed
        "approval_data": {
            "profession": request.profession,
            "experience": request.experience,
            "qualifications": request.qualifications,
            "address": request.address,
            "city": request.city,
            "pincode": request.pincode,
            "service_radius": request.service_radius,
            "aadhaar_number": request.aadhaar_number,
            "pan_number": request.pan_number,
        },
        "admin_notes": None,
        "rejection_reason": None,
        "reviewed_by": None,
        "reviewed_at": None,
        
        "profile_image": request.profile_image,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }
    
    result = await users.insert_one(user_doc)
    
    return RegistrationResponse(
        message="Registration submitted successfully. Please wait for manager approval.",
        user_id=str(result.inserted_id),
        approval_status="pending"
    )


# ============ SHOP REGISTRATION ============

@router.post("/verifications/shop", response_model=RegistrationResponse)
async def register_shop(request: ShopRegistrationRequest):
    """Register as a shop - saved directly to users with pending status"""
    users = get_users_collection()
    
    # Check if phone already exists
    existing = await users.find_one({"phone": request.phone})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Phone number already registered. Please login instead."
        )
    
    # Check if email already exists (if provided)
    if request.email:
        existing_email = await users.find_one({"email": request.email})
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
    
    # Generate email if not provided
    email = request.email or f"shop_{request.phone}@electromart.local"
    
    # Create user with pending approval status
    user_doc = {
        "name": request.owner_name,
        "email": email,
        "phone": request.phone,
        "hashed_password": hash_password(request.password),
        "role": UserRole.SHOPKEEPER.value,
        "is_verified": False,
        "is_active": False,
        "phone_verified": True,
        "email_verified": False,
        
        # Approval status
        "approval_status": "pending",
        "approval_data": {
            "shop_name": request.shop_name,
            "category": request.category,
            "description": request.description,
            "shop_address": request.shop_address,
            "city": request.city,
            "pincode": request.pincode,
            "gst_number": request.gst_number,
            "has_gst": request.has_gst,
            "pan_number": request.pan_number,
        },
        "admin_notes": None,
        "rejection_reason": None,
        "reviewed_by": None,
        "reviewed_at": None,
        
        "profile_image": request.shop_image,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }
    
    result = await users.insert_one(user_doc)
    
    return RegistrationResponse(
        message="Registration submitted successfully. Please wait for manager approval.",
        user_id=str(result.inserted_id),
        approval_status="pending"
    )


# ============ CHECK STATUS BY PHONE ============

@router.get("/verifications/status/{phone}")
async def get_registration_status(phone: str):
    """Get registration status by phone number"""
    users = get_users_collection()
    
    # Find user by phone
    user = await users.find_one({"phone": phone})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No registration found for this phone number"
        )
    
    return {
        "id": str(user["_id"]),
        "name": user.get("name"),
        "phone": user.get("phone"),
        "email": user.get("email"),
        "role": user.get("role"),
        "approval_status": user.get("approval_status", "pending"),
        "approval_data": user.get("approval_data", {}),
        "admin_notes": user.get("admin_notes"),
        "rejection_reason": user.get("rejection_reason"),
        "reviewed_by": user.get("reviewed_by"),
        "reviewed_at": user.get("reviewed_at"),
        "submitted_at": user.get("created_at"),
        "is_active": user.get("is_active", False),
    }


# ============ MANAGER ENDPOINTS ============

@router.get("/verifications/stats")
async def get_verification_stats(current_user: dict = Depends(get_current_user)):
    """Get verification statistics for managers"""
    if current_user.get("role") not in ["manager", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Manager or admin access required"
        )
    
    users = get_users_collection()
    
    # Count pending registrations
    pending = await users.count_documents({
        "approval_status": "pending",
        "role": {"$in": ["professional", "shopkeeper"]}
    })
    
    # Count approved today
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    approved_today = await users.count_documents({
        "approval_status": "approved",
        "reviewed_at": {"$gte": today_start},
        "role": {"$in": ["professional", "shopkeeper"]}
    })
    
    # Count rejected today
    rejected_today = await users.count_documents({
        "approval_status": "rejected",
        "reviewed_at": {"$gte": today_start},
        "role": {"$in": ["professional", "shopkeeper"]}
    })
    
    # Count total professionals and shops
    total_professionals = await users.count_documents({"role": "professional"})
    total_shops = await users.count_documents({"role": "shopkeeper"})
    
    return {
        "pending": pending,
        "approved_today": approved_today,
        "rejected_today": rejected_today,
        "high_risk": 0,  # Not using risk score in simplified system
        "total_professionals": total_professionals,
        "total_shops": total_shops,
    }


@router.get("/verifications")
async def get_all_verifications(
    status: Optional[str] = None,
    verification_type: Optional[str] = None,
    search: Optional[str] = None,
    page: int = 1,
    limit: int = 20,
    current_user: dict = Depends(get_current_user)
):
    """Get all pending registrations for manager review"""
    if current_user.get("role") not in ["manager", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Manager or admin access required"
        )
    
    users = get_users_collection()
    
    # Build query
    query = {"role": {"$in": ["professional", "shopkeeper"]}}
    
    if status and status != "all":
        query["approval_status"] = status
    
    if verification_type and verification_type != "all":
        role = "professional" if verification_type == "professional" else "shopkeeper"
        query["role"] = role
    
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"phone": {"$regex": search, "$options": "i"}},
            {"email": {"$regex": search, "$options": "i"}},
        ]
    
    # Get total count
    total = await users.count_documents(query)
    
    # Get paginated results
    skip = (page - 1) * limit
    cursor = users.find(query).sort("created_at", -1).skip(skip).limit(limit)
    
    verifications = []
    async for user in cursor:
        approval_data = user.get("approval_data", {})
        verifications.append({
            "id": str(user["_id"]),
            "user_id": str(user["_id"]),
            "verification_type": "professional" if user.get("role") == "professional" else "shop",
            "status": user.get("approval_status", "pending"),
            "risk_score": "low",  # Simplified - no risk scoring
            "name": user.get("name"),
            "phone": user.get("phone"),
            "email": user.get("email"),
            "city": approval_data.get("city", ""),
            "pincode": approval_data.get("pincode", ""),
            
            # Professional fields
            "profession": approval_data.get("profession"),
            "experience": approval_data.get("experience"),
            "service_radius": approval_data.get("service_radius"),
            "aadhaar_number": approval_data.get("aadhaar_number"),
            
            # Shop fields
            "shop_name": approval_data.get("shop_name"),
            "category": approval_data.get("category"),
            "shop_address": approval_data.get("shop_address"),
            "gst_number": approval_data.get("gst_number"),
            "has_gst": approval_data.get("has_gst"),
            
            # Admin fields
            "admin_notes": user.get("admin_notes"),
            "rejection_reason": user.get("rejection_reason"),
            "reviewed_by": user.get("reviewed_by"),
            "reviewed_at": user.get("reviewed_at"),
            
            # Documents count (simplified)
            "documents": [],
            "documents_count": 0,
            
            "submitted_at": user.get("created_at"),
            "updated_at": user.get("updated_at"),
        })
    
    return {
        "verifications": verifications,
        "total": total,
        "page": page,
        "limit": limit,
    }


@router.get("/verifications/{verification_id}")
async def get_verification_detail(verification_id: str, current_user: dict = Depends(get_current_user)):
    """Get detailed verification info"""
    if current_user.get("role") not in ["manager", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Manager or admin access required"
        )
    
    users = get_users_collection()
    
    try:
        user = await users.find_one({"_id": ObjectId(verification_id)})
    except:
        raise HTTPException(status_code=400, detail="Invalid verification ID")
    
    if not user:
        raise HTTPException(status_code=404, detail="Verification not found")
    
    approval_data = user.get("approval_data", {})
    
    return {
        "id": str(user["_id"]),
        "user_id": str(user["_id"]),
        "verification_type": "professional" if user.get("role") == "professional" else "shop",
        "status": user.get("approval_status", "pending"),
        "risk_score": "low",
        "name": user.get("name"),
        "phone": user.get("phone"),
        "email": user.get("email"),
        "profile_image": user.get("profile_image"),
        
        # All approval data
        **approval_data,
        
        "admin_notes": user.get("admin_notes"),
        "rejection_reason": user.get("rejection_reason"),
        "reviewed_by": user.get("reviewed_by"),
        "reviewed_at": user.get("reviewed_at"),
        "submitted_at": user.get("created_at"),
        "updated_at": user.get("updated_at"),
    }


@router.put("/verifications/{verification_id}")
async def update_verification(
    verification_id: str, 
    request: ApprovalUpdateRequest,
    current_user: dict = Depends(get_current_user)
):
    """Approve or reject a registration"""
    if current_user.get("role") not in ["manager", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Manager or admin access required"
        )
    
    users = get_users_collection()
    
    try:
        user = await users.find_one({"_id": ObjectId(verification_id)})
    except:
        raise HTTPException(status_code=400, detail="Invalid verification ID")
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Prepare update
    update_data = {
        "approval_status": request.status,
        "admin_notes": request.admin_notes,
        "reviewed_by": str(current_user.get("_id")),
        "reviewed_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }
    
    # If approved, activate the user
    if request.status == "approved":
        update_data["is_verified"] = True
        update_data["is_active"] = True
    
    # If rejected, add reason
    if request.status == "rejected":
        update_data["rejection_reason"] = request.rejection_reason
        update_data["is_active"] = False
    
    # If more info needed
    if request.status == "more_info_needed":
        update_data["is_active"] = False
    
    await users.update_one(
        {"_id": ObjectId(verification_id)},
        {"$set": update_data}
    )
    
    # Fetch updated user
    updated_user = await users.find_one({"_id": ObjectId(verification_id)})
    approval_data = updated_user.get("approval_data", {})
    
    return {
        "id": str(updated_user["_id"]),
        "status": updated_user.get("approval_status"),
        "name": updated_user.get("name"),
        "phone": updated_user.get("phone"),
        "role": updated_user.get("role"),
        "is_active": updated_user.get("is_active"),
        "message": f"Registration {request.status} successfully"
    }


@router.delete("/verifications/{verification_id}")
async def delete_verification(verification_id: str, current_user: dict = Depends(get_current_user)):
    """Delete a registration (admin only)"""
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    users = get_users_collection()
    
    try:
        result = await users.delete_one({"_id": ObjectId(verification_id)})
    except:
        raise HTTPException(status_code=400, detail="Invalid verification ID")
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Registration not found")
    
    return {"message": "Registration deleted successfully"}
