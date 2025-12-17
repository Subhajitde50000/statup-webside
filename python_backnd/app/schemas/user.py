"""
User schemas for request/response validation
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from app.models.user import UserRole


class UserProfileResponse(BaseModel):
    id: str
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    role: UserRole
    is_verified: bool
    profile_image: Optional[str] = None
    email_verified: bool = False
    phone_verified: bool = False
    created_at: datetime


class UpdateProfileRequest(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    profile_image: Optional[str] = None


class ChangePasswordRequest(BaseModel):
    current_password: str = Field(..., min_length=6)
    new_password: str = Field(..., min_length=6)
    confirm_password: str = Field(..., min_length=6)


class VerifyEmailRequest(BaseModel):
    otp_code: str = Field(..., min_length=6, max_length=6)


class VerifyPhoneRequest(BaseModel):
    otp_code: str = Field(..., min_length=6, max_length=6)


class UserListResponse(BaseModel):
    users: list
    total: int
    page: int
    per_page: int
