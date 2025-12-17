"""
User management routes
"""

from fastapi import APIRouter, HTTPException, status, Depends, Query
from datetime import datetime
from bson import ObjectId
from typing import Optional

from app.database import get_users_collection
from app.schemas.user import (
    UserProfileResponse,
    UpdateProfileRequest,
    ChangePasswordRequest,
    VerifyEmailRequest,
    VerifyPhoneRequest,
    UserListResponse
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


@router.get("/profile", response_model=UserProfileResponse)
async def get_profile(current_user: dict = Depends(get_current_user)):
    """Get current user profile"""
    return UserProfileResponse(**user_helper(current_user))


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
