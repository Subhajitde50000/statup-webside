"""
User schemas for request/response validation
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from app.models.user import UserRole


# Address schemas
class AddressBase(BaseModel):
    label: Optional[str] = Field(None, description="e.g., Home, Office, Other")
    house_no: str = Field(..., min_length=1, max_length=100, description="House/Flat/Building number")
    area: str = Field(..., min_length=2, max_length=200, description="Area/Street/Locality")
    landmark: Optional[str] = Field(None, max_length=200, description="Nearby landmark")
    city: str = Field(..., min_length=2, max_length=100)
    state: Optional[str] = Field(None, max_length=100)
    pincode: str = Field(..., min_length=5, max_length=10)
    is_default: bool = Field(False, description="Set as default address")


class AddressCreate(AddressBase):
    pass


class AddressUpdate(BaseModel):
    label: Optional[str] = None
    house_no: Optional[str] = None
    area: Optional[str] = None
    landmark: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    is_default: Optional[bool] = None


class AddressResponse(AddressBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None


class AddressListResponse(BaseModel):
    addresses: List[AddressResponse]
    total: int


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
