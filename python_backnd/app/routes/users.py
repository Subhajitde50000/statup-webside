"""
User management routes
"""

from fastapi import APIRouter, HTTPException, status, Depends, Query, UploadFile, File
from fastapi.responses import FileResponse
from datetime import datetime
from bson import ObjectId
from typing import Optional, List
import os
import uuid
import shutil
from pathlib import Path

from app.database import get_users_collection
from app.schemas.user import (
    UserProfileResponse,
    UpdateProfileRequest,
    ChangePasswordRequest,
    VerifyEmailRequest,
    VerifyPhoneRequest,
    UserListResponse,
    AddressCreate,
    AddressUpdate,
    AddressResponse,
    AddressListResponse
)
from app.schemas.auth import MessageResponse
from app.models.user import UserRole, user_helper
from app.models.otp import OTPPurpose, OTPType
from app.utils.security import (
    hash_password, verify_password, get_current_user
)
from app.utils.otp import create_otp, verify_otp, send_otp
from app.middleware.rbac import require_roles


router = APIRouter()

# Create uploads directory if it doesn't exist
UPLOAD_DIR = Path("uploads/profile_images")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# Allowed image extensions
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB


@router.post("/upload-profile-image")
async def upload_profile_image(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """Upload profile image"""
    # Validate file extension
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type not allowed. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    # Read file content
    content = await file.read()
    
    # Validate file size
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File too large. Maximum size: {MAX_FILE_SIZE // (1024*1024)}MB"
        )
    
    # Generate unique filename
    unique_filename = f"{current_user['_id']}_{uuid.uuid4().hex[:8]}{file_ext}"
    file_path = UPLOAD_DIR / unique_filename
    
    # Delete old profile image if exists
    users = get_users_collection()
    old_image = current_user.get("profile_image")
    if old_image and old_image.startswith("/api/users/profile-image/"):
        old_filename = old_image.split("/")[-1]
        old_file_path = UPLOAD_DIR / old_filename
        if old_file_path.exists():
            old_file_path.unlink()
    
    # Save new file
    with open(file_path, "wb") as f:
        f.write(content)
    
    # Update user profile with new image URL
    image_url = f"/api/users/profile-image/{unique_filename}"
    await users.update_one(
        {"_id": current_user["_id"]},
        {"$set": {"profile_image": image_url, "updated_at": datetime.utcnow()}}
    )
    
    # Fetch updated user
    updated_user = await users.find_one({"_id": current_user["_id"]})
    
    return {
        "message": "Profile image uploaded successfully",
        "image_url": image_url,
        "user": user_helper(updated_user)
    }


@router.get("/profile-image/{filename}")
async def get_profile_image(filename: str):
    """Get profile image by filename"""
    file_path = UPLOAD_DIR / filename
    
    if not file_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Image not found"
        )
    
    return FileResponse(file_path)


@router.delete("/profile-image")
async def delete_profile_image(current_user: dict = Depends(get_current_user)):
    """Delete profile image"""
    users = get_users_collection()
    
    old_image = current_user.get("profile_image")
    if old_image and old_image.startswith("/api/users/profile-image/"):
        old_filename = old_image.split("/")[-1]
        old_file_path = UPLOAD_DIR / old_filename
        if old_file_path.exists():
            old_file_path.unlink()
    
    # Remove image URL from user profile
    await users.update_one(
        {"_id": current_user["_id"]},
        {"$set": {"profile_image": None, "updated_at": datetime.utcnow()}}
    )
    
    return {"message": "Profile image deleted successfully"}


@router.get("/me", response_model=UserProfileResponse)
async def get_current_user_profile(current_user: dict = Depends(get_current_user)):
    """Get current authenticated user profile (alias for /profile)"""
    return UserProfileResponse(**user_helper(current_user))


@router.get("/profile", response_model=UserProfileResponse)
async def get_profile(current_user: dict = Depends(get_current_user)):
    """Get current user profile"""
    return UserProfileResponse(**user_helper(current_user))


@router.put("/update-profile")
async def update_user_profile(
    name: Optional[str] = None,
    email: Optional[str] = None,
    phone: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """Update user profile with flexible fields"""
    users = get_users_collection()
    
    update_data = {}
    if name:
        update_data["name"] = name
    if email:
        update_data["email"] = email
    if phone:
        update_data["phone"] = phone
    
    if update_data:
        update_data["updated_at"] = datetime.utcnow()
        await users.update_one(
            {"_id": current_user["_id"]},
            {"$set": update_data}
        )
    
    # Fetch updated user
    updated_user = await users.find_one({"_id": current_user["_id"]})
    return {"message": "Profile updated successfully", "user": user_helper(updated_user)}


@router.put("/profile", response_model=UserProfileResponse)
async def update_profile(
    request: UpdateProfileRequest,
    current_user: dict = Depends(get_current_user)
):
    """Update user profile"""
    users = get_users_collection()
    
    update_data = {}
    if request.name:
        update_data["name"] = request.name
    if request.profile_image is not None:
        update_data["profile_image"] = request.profile_image
    
    if update_data:
        update_data["updated_at"] = datetime.utcnow()
        await users.update_one(
            {"_id": current_user["_id"]},
            {"$set": update_data}
        )
    
    # Fetch updated user
    updated_user = await users.find_one({"_id": current_user["_id"]})
    return UserProfileResponse(**user_helper(updated_user))


@router.post("/change-password", response_model=MessageResponse)
async def change_password(
    request: ChangePasswordRequest,
    current_user: dict = Depends(get_current_user)
):
    """Change user password"""
    # Verify current password
    if not verify_password(request.current_password, current_user.get("hashed_password", "")):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )
    
    # Validate new password
    if request.new_password != request.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New passwords do not match"
        )
    
    users = get_users_collection()
    
    # Update password
    await users.update_one(
        {"_id": current_user["_id"]},
        {
            "$set": {
                "hashed_password": hash_password(request.new_password),
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    return MessageResponse(
        message="Password changed successfully",
        success=True
    )


@router.post("/verify-email/send", response_model=MessageResponse)
async def send_email_verification(current_user: dict = Depends(get_current_user)):
    """Send email verification OTP"""
    if not current_user.get("email"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No email address on file"
        )
    
    if current_user.get("email_verified"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already verified"
        )
    
    otp_code = await create_otp(
        identifier=current_user["email"],
        otp_type=OTPType.EMAIL,
        purpose=OTPPurpose.EMAIL_VERIFICATION,
        user_data={"user_id": str(current_user["_id"])}
    )
    
    await send_otp(current_user["email"], otp_code, OTPType.EMAIL)
    
    return MessageResponse(
        message="Verification OTP sent to your email",
        success=True
    )


@router.post("/verify-email", response_model=MessageResponse)
async def verify_email(
    request: VerifyEmailRequest,
    current_user: dict = Depends(get_current_user)
):
    """Verify email with OTP"""
    result = await verify_otp(
        identifier=current_user["email"],
        otp_code=request.otp_code,
        purpose=OTPPurpose.EMAIL_VERIFICATION
    )
    
    if not result["valid"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result["error"]
        )
    
    users = get_users_collection()
    await users.update_one(
        {"_id": current_user["_id"]},
        {
            "$set": {
                "email_verified": True,
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    return MessageResponse(
        message="Email verified successfully",
        success=True
    )


@router.post("/verify-phone/send", response_model=MessageResponse)
async def send_phone_verification(current_user: dict = Depends(get_current_user)):
    """Send phone verification OTP"""
    if not current_user.get("phone"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No phone number on file"
        )
    
    if current_user.get("phone_verified"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Phone already verified"
        )
    
    otp_code = await create_otp(
        identifier=current_user["phone"],
        otp_type=OTPType.PHONE,
        purpose=OTPPurpose.PHONE_VERIFICATION,
        user_data={"user_id": str(current_user["_id"])}
    )
    
    await send_otp(current_user["phone"], otp_code, OTPType.PHONE)
    
    return MessageResponse(
        message="Verification OTP sent to your phone",
        success=True
    )


@router.post("/verify-phone", response_model=MessageResponse)
async def verify_phone(
    request: VerifyPhoneRequest,
    current_user: dict = Depends(get_current_user)
):
    """Verify phone with OTP"""
    result = await verify_otp(
        identifier=current_user["phone"],
        otp_code=request.otp_code,
        purpose=OTPPurpose.PHONE_VERIFICATION
    )
    
    if not result["valid"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result["error"]
        )
    
    users = get_users_collection()
    await users.update_one(
        {"_id": current_user["_id"]},
        {
            "$set": {
                "phone_verified": True,
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    return MessageResponse(
        message="Phone verified successfully",
        success=True
    )


# ============ PROFESSIONAL BUSINESS PROFILE ============

@router.put("/professional-profile", response_model=dict)
async def update_professional_profile(
    current_user: dict = Depends(get_current_user),
    bio: Optional[str] = None,
    experience: Optional[str] = None,
    hourly_rate: Optional[float] = None,
    service_areas: Optional[List[str]] = None,
    skills: Optional[List[str]] = None,
    languages: Optional[List[str]] = None,
    certifications: Optional[List[str]] = None,
    working_hours_start: Optional[str] = None,
    working_hours_end: Optional[str] = None,
    working_days: Optional[List[str]] = None,
    emergency_available: Optional[bool] = None,
    address: Optional[str] = None,
    city: Optional[str] = None,
    state: Optional[str] = None,
    pincode: Optional[str] = None
):
    """Update professional business profile details"""
    # Check if user is a professional
    if current_user.get("role") != "professional":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only professionals can update business profile"
        )
    
    users = get_users_collection()
    
    # Get existing approval_data or create new
    approval_data = current_user.get("approval_data", {})
    
    # Update business profile fields
    if bio is not None:
        approval_data["bio"] = bio
    if experience is not None:
        approval_data["experience"] = experience
    if hourly_rate is not None:
        approval_data["hourly_rate"] = hourly_rate
    if service_areas is not None:
        approval_data["service_areas"] = service_areas
    if skills is not None:
        approval_data["skills"] = skills
    if languages is not None:
        approval_data["languages"] = languages
    if certifications is not None:
        approval_data["certifications"] = certifications
    if working_hours_start is not None:
        approval_data["working_hours_start"] = working_hours_start
    if working_hours_end is not None:
        approval_data["working_hours_end"] = working_hours_end
    if working_days is not None:
        approval_data["working_days"] = working_days
    if emergency_available is not None:
        approval_data["emergency_available"] = emergency_available
    if address is not None:
        approval_data["address"] = address
    if city is not None:
        approval_data["city"] = city
    if state is not None:
        approval_data["state"] = state
    if pincode is not None:
        approval_data["pincode"] = pincode
    
    # Update user
    await users.update_one(
        {"_id": current_user["_id"]},
        {"$set": {"approval_data": approval_data, "updated_at": datetime.utcnow()}}
    )
    
    # Fetch updated user
    updated_user = await users.find_one({"_id": current_user["_id"]})
    
    return {
        "message": "Professional profile updated successfully",
        "user": user_helper(updated_user)
    }


@router.get("/professional-profile", response_model=dict)
async def get_professional_profile(current_user: dict = Depends(get_current_user)):
    """Get professional business profile details"""
    if current_user.get("role") != "professional":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only professionals can access business profile"
        )
    
    approval_data = current_user.get("approval_data", {})
    
    return {
        "profile": {
            "id": str(current_user["_id"]),
            "name": current_user.get("name"),
            "email": current_user.get("email"),
            "phone": current_user.get("phone"),
            "profile_image": current_user.get("profile_image"),
            "is_verified": current_user.get("is_verified", False),
            "approval_status": current_user.get("approval_status"),
            
            # Business Profile
            "bio": approval_data.get("bio", ""),
            "experience": approval_data.get("experience", ""),
            "hourly_rate": approval_data.get("hourly_rate"),
            "service_areas": approval_data.get("service_areas", []),
            "skills": approval_data.get("skills", []),
            "languages": approval_data.get("languages", []),
            "certifications": approval_data.get("certifications", []),
            "working_hours_start": approval_data.get("working_hours_start", "09:00"),
            "working_hours_end": approval_data.get("working_hours_end", "18:00"),
            "working_days": approval_data.get("working_days", ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]),
            "emergency_available": approval_data.get("emergency_available", False),
            
            # Address
            "address": approval_data.get("address", ""),
            "city": approval_data.get("city", ""),
            "state": approval_data.get("state", ""),
            "pincode": approval_data.get("pincode", ""),
            
            # Professional category from registration
            "category": approval_data.get("category", ""),
            "sub_category": approval_data.get("sub_category", ""),
            
            # Stats
            "rating": approval_data.get("rating", 0),
            "total_reviews": approval_data.get("total_reviews", 0),
            "total_bookings": approval_data.get("total_bookings", 0),
            "member_since": current_user.get("created_at").isoformat() if current_user.get("created_at") else None
        }
    }


@router.get("/professional/{professional_id}/public", response_model=dict)
async def get_professional_public_profile(professional_id: str):
    """Get public professional profile (for customers viewing professional details)"""
    if not ObjectId.is_valid(professional_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid professional ID"
        )
    
    users = get_users_collection()
    professional = await users.find_one({"_id": ObjectId(professional_id), "role": "professional"})
    
    if not professional:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Professional not found"
        )
    
    approval_data = professional.get("approval_data", {})
    
    return {
        "professional": {
            "id": str(professional["_id"]),
            "name": professional.get("name"),
            "phone": professional.get("phone"),
            "profile_image": professional.get("profile_image"),
            "is_verified": professional.get("is_verified", False),
            "approval_status": professional.get("approval_status"),
            
            # Business Profile (public info only)
            "bio": approval_data.get("bio", ""),
            "experience": approval_data.get("experience", ""),
            "hourly_rate": approval_data.get("hourly_rate"),
            "category": approval_data.get("category", ""),
            "sub_category": approval_data.get("sub_category", ""),
            "service_areas": approval_data.get("service_areas", []),
            "skills": approval_data.get("skills", []),
            "languages": approval_data.get("languages", []),
            "certifications": approval_data.get("certifications", []),
            "working_hours_start": approval_data.get("working_hours_start", "09:00"),
            "working_hours_end": approval_data.get("working_hours_end", "18:00"),
            "working_days": approval_data.get("working_days", []),
            "emergency_available": approval_data.get("emergency_available", False),
            
            # Location (city only for privacy)
            "city": approval_data.get("city", ""),
            "state": approval_data.get("state", ""),
            
            # Stats
            "rating": approval_data.get("rating", 0),
            "total_reviews": approval_data.get("total_reviews", 0),
            "total_bookings": approval_data.get("total_bookings", 0),
            "member_since": professional.get("created_at").isoformat() if professional.get("created_at") else None
        }
    }


# ============ ADMIN ROUTES ============

@router.get("/list", response_model=UserListResponse)
async def list_users(
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=100),
    role: Optional[str] = None,
    search: Optional[str] = None,
    current_user: dict = Depends(require_roles([UserRole.ADMIN, UserRole.MANAGER]))
):
    """List all users (Admin/Manager only)"""
    users = get_users_collection()
    
    # Build query
    query = {}
    if role:
        query["role"] = role
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"email": {"$regex": search, "$options": "i"}},
            {"phone": {"$regex": search, "$options": "i"}}
        ]
    
    # Get total count
    total = await users.count_documents(query)
    
    # Get paginated users
    skip = (page - 1) * per_page
    cursor = users.find(query).skip(skip).limit(per_page).sort("created_at", -1)
    
    user_list = []
    async for user in cursor:
        user_list.append(user_helper(user))
    
    return UserListResponse(
        users=user_list,
        total=total,
        page=page,
        per_page=per_page
    )


@router.put("/{user_id}/role")
async def update_user_role(
    user_id: str,
    role: UserRole,
    current_user: dict = Depends(require_roles([UserRole.ADMIN]))
):
    """Update user role (Admin only)"""
    users = get_users_collection()
    
    # Can't change own role
    if str(current_user["_id"]) == user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot change your own role"
        )
    
    result = await users.update_one(
        {"_id": ObjectId(user_id)},
        {
            "$set": {
                "role": role.value,
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    if result.modified_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return MessageResponse(
        message=f"User role updated to {role.value}",
        success=True
    )


@router.put("/{user_id}/status")
async def update_user_status(
    user_id: str,
    is_active: bool,
    current_user: dict = Depends(require_roles([UserRole.ADMIN]))
):
    """Activate/Deactivate user (Admin only)"""
    users = get_users_collection()
    
    # Can't change own status
    if str(current_user["_id"]) == user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot change your own status"
        )
    
    result = await users.update_one(
        {"_id": ObjectId(user_id)},
        {
            "$set": {
                "is_active": is_active,
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    if result.modified_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    status_text = "activated" if is_active else "deactivated"
    return MessageResponse(
        message=f"User {status_text} successfully",
        success=True
    )


# ==================== ADDRESS MANAGEMENT ====================

@router.get("/addresses", response_model=AddressListResponse)
async def get_user_addresses(current_user: dict = Depends(get_current_user)):
    """Get all addresses for current user"""
    addresses = current_user.get("addresses", [])
    return AddressListResponse(
        addresses=addresses,
        total=len(addresses)
    )


@router.post("/addresses", response_model=AddressResponse)
async def add_user_address(
    address: AddressCreate,
    current_user: dict = Depends(get_current_user)
):
    """Add a new address for current user"""
    users = get_users_collection()
    
    # Create address with unique ID
    address_data = address.dict()
    address_data["id"] = str(uuid.uuid4())
    address_data["created_at"] = datetime.utcnow()
    address_data["updated_at"] = None
    
    # Get current addresses
    current_addresses = current_user.get("addresses", [])
    
    # If this is set as default, unset other defaults
    if address_data.get("is_default"):
        for addr in current_addresses:
            addr["is_default"] = False
    
    # If this is the first address, make it default
    if len(current_addresses) == 0:
        address_data["is_default"] = True
    
    current_addresses.append(address_data)
    
    # Update user
    await users.update_one(
        {"_id": current_user["_id"]},
        {
            "$set": {
                "addresses": current_addresses,
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    return AddressResponse(**address_data)


@router.get("/addresses/{address_id}", response_model=AddressResponse)
async def get_address(
    address_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get a specific address"""
    addresses = current_user.get("addresses", [])
    
    for address in addresses:
        if address.get("id") == address_id:
            return AddressResponse(**address)
    
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Address not found"
    )


@router.put("/addresses/{address_id}", response_model=AddressResponse)
async def update_address(
    address_id: str,
    address_update: AddressUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update an existing address"""
    users = get_users_collection()
    addresses = current_user.get("addresses", [])
    
    address_index = None
    for i, addr in enumerate(addresses):
        if addr.get("id") == address_id:
            address_index = i
            break
    
    if address_index is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Address not found"
        )
    
    # Update address fields
    update_data = address_update.dict(exclude_unset=True)
    
    # If setting as default, unset other defaults
    if update_data.get("is_default"):
        for addr in addresses:
            addr["is_default"] = False
    
    for key, value in update_data.items():
        if value is not None:
            addresses[address_index][key] = value
    
    addresses[address_index]["updated_at"] = datetime.utcnow()
    
    # Update user
    await users.update_one(
        {"_id": current_user["_id"]},
        {
            "$set": {
                "addresses": addresses,
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    return AddressResponse(**addresses[address_index])


@router.delete("/addresses/{address_id}")
async def delete_address(
    address_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete an address"""
    users = get_users_collection()
    addresses = current_user.get("addresses", [])
    
    new_addresses = [addr for addr in addresses if addr.get("id") != address_id]
    
    if len(new_addresses) == len(addresses):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Address not found"
        )
    
    # If deleted address was default and there are other addresses, set first as default
    if new_addresses and not any(addr.get("is_default") for addr in new_addresses):
        new_addresses[0]["is_default"] = True
    
    # Update user
    await users.update_one(
        {"_id": current_user["_id"]},
        {
            "$set": {
                "addresses": new_addresses,
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    return {"message": "Address deleted successfully"}


@router.put("/addresses/{address_id}/default")
async def set_default_address(
    address_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Set an address as default"""
    users = get_users_collection()
    addresses = current_user.get("addresses", [])
    
    found = False
    for addr in addresses:
        if addr.get("id") == address_id:
            addr["is_default"] = True
            addr["updated_at"] = datetime.utcnow()
            found = True
        else:
            addr["is_default"] = False
    
    if not found:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Address not found"
        )
    
    # Update user
    await users.update_one(
        {"_id": current_user["_id"]},
        {
            "$set": {
                "addresses": addresses,
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    return {"message": "Default address updated successfully"}
