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


class ApprovalStatus(str, Enum):
    """Approval status for professionals and shopkeepers"""
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    MORE_INFO_NEEDED = "more_info_needed"


class UserBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    role: UserRole = UserRole.USER
    manager_type: Optional[ManagerType] = None  # Only for managers
    is_verified: bool = False
    is_active: bool = True
    profile_image: Optional[str] = None
    
    # User addresses
    addresses: List[dict] = Field(default_factory=list)
    
    # Approval fields for professionals/shopkeepers
    approval_status: Optional[str] = None  # pending, approved, rejected, more_info_needed
    approval_data: Optional[dict] = None   # Stores professional/shop specific data
    admin_notes: Optional[str] = None
    rejection_reason: Optional[str] = None
    reviewed_by: Optional[str] = None
    reviewed_at: Optional[datetime] = None
    
    # Suspension fields for professionals
    is_suspended: bool = False
    suspended_at: Optional[datetime] = None
    suspended_by: Optional[str] = None  # Manager/Admin who suspended
    suspension_reason: Optional[str] = None
    
    # Favorites
    favorite_professionals: List[str] = Field(default_factory=list)  # List of professional user IDs


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
    
    # Approval fields
    approval_status: Optional[str] = None
    approval_data: Optional[dict] = None
    rejection_reason: Optional[str] = None
    
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
        
        # Addresses
        "addresses": user.get("addresses", []),
        
        # Approval fields
        "approval_status": user.get("approval_status"),
        "approval_data": user.get("approval_data"),
        "rejection_reason": user.get("rejection_reason"),
        
        # Suspension fields
        "is_suspended": user.get("is_suspended", False),
        "suspended_at": user.get("suspended_at"),
        "suspended_by": user.get("suspended_by"),
        "suspension_reason": user.get("suspension_reason"),
        
        # Favorites
        "favorite_professionals": user.get("favorite_professionals", []),
    }
