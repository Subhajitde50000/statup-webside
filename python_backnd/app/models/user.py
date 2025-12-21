"""
User model for MongoDB
"""

from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime
from enum import Enum
from bson import ObjectId


class UserRole(str, Enum):
    USER = "user"
    PROFESSIONAL = "professional"
    SHOPKEEPER = "shopkeeper"
    MANAGER = "manager"
    ADMIN = "admin"


class ManagerType(str, Enum):
    """Different types of managers with specific permissions"""
    USER_MANAGER = "user_manager"  # Manages users, shops, professionals, orders, payments
    BUSINESS_MANAGER = "business_manager"  # Manages shops, products, inventory
    MARKETING_MANAGER = "marketing_manager"  # Manages campaigns, promotions, analytics
    HR_MANAGER = "hr_manager"  # Manages vacancies, applications, employees
    OPERATIONS_MANAGER = "operations_manager"  # Manages orders, deliveries, logistics
    GENERAL_MANAGER = "general_manager"  # Full manager access (like admin but limited)


class AuthProvider(str, Enum):
    LOCAL = "local"
    GOOGLE = "google"
    FACEBOOK = "facebook"


class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v, values=None):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, field_schema):
        field_schema.update(type="string")


class UserBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    role: UserRole = UserRole.USER
    manager_type: Optional[ManagerType] = None  # Only for managers
    is_verified: bool = False
    is_active: bool = True
    profile_image: Optional[str] = None


class UserInDB(UserBase):
    id: Optional[str] = Field(default=None, alias="_id")
    hashed_password: Optional[str] = None
    auth_provider: AuthProvider = AuthProvider.LOCAL
    provider_id: Optional[str] = None  # Google/Facebook user ID
    email_verified: bool = False
    phone_verified: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class UserResponse(BaseModel):
    id: str
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    role: UserRole
    manager_type: Optional[ManagerType] = None
    is_verified: bool
    profile_image: Optional[str] = None
    email_verified: bool = False
    phone_verified: bool = False
    created_at: datetime
    
    class Config:
        from_attributes = True


def user_helper(user: dict) -> dict:
    """Convert MongoDB user document to response format"""
    return {
        "id": str(user.get("_id")),
        "name": user.get("name"),
        "email": user.get("email"),
        "phone": user.get("phone"),
        "role": user.get("role", "user"),
        "manager_type": user.get("manager_type"),
        "is_verified": user.get("is_verified", False),
        "is_active": user.get("is_active", True),
        "profile_image": user.get("profile_image"),
        "email_verified": user.get("email_verified", False),
        "phone_verified": user.get("phone_verified", False),
        "created_at": user.get("created_at"),
        "updated_at": user.get("updated_at"),
        "last_login": user.get("last_login"),
    }
