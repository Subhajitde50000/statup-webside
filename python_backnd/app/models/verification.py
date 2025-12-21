
"""
Verification model for professional and shop registrations
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


class VerificationType(str, Enum):
    PROFESSIONAL = "professional"
    SHOP = "shop"


class VerificationStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    MORE_INFO_NEEDED = "more_info_needed"


class RiskScore(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class DocumentType(str, Enum):
    AADHAAR = "aadhaar"
    PAN = "pan"
    GST = "gst"
    BUSINESS_LICENSE = "business_license"
    PROFILE_PHOTO = "profile_photo"
    SHOP_PHOTO = "shop_photo"
    OTHER = "other"


class DocumentInfo(BaseModel):
    document_type: DocumentType
    document_url: str
    document_name: str
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)
    verified: bool = False


# ============ Professional Verification Schemas ============

class ProfessionalVerificationCreate(BaseModel):
    """Schema for creating professional verification request"""
    # Basic Info
    name: str
    phone: str
    email: Optional[str] = None
    date_of_birth: Optional[str] = None
    gender: Optional[str] = None
    
    # Service Details
    profession: str  # e.g., electrician, plumber, ac_repair
    sub_category: Optional[str] = None
    experience: str  # e.g., "1-2", "3-5", "5+"
    qualifications: Optional[str] = None
    certifications: Optional[str] = None
    languages: Optional[list[str]] = []
    
    # Location & Availability
    address: Optional[str] = None
    landmark: Optional[str] = None
    city: str
    pincode: str
    service_radius: Optional[str] = "5"  # km
    available_days: Optional[list[str]] = []
    start_time: Optional[str] = "09:00"
    end_time: Optional[str] = "18:00"
    
    # Documents
    aadhaar_number: Optional[str] = None
    pan_number: Optional[str] = None
    driving_license: Optional[str] = None
    police_verification: Optional[bool] = False
    
    # Banking
    bank_account_number: Optional[str] = None
    ifsc_code: Optional[str] = None
    account_holder_name: Optional[str] = None
    
    # Equipment
    own_equipment: Optional[bool] = False
    equipment_list: Optional[str] = None
    
    profile_image: Optional[str] = None


class ProfessionalVerificationUpdate(BaseModel):
    """Schema for updating professional verification"""
    status: Optional[VerificationStatus] = None
    risk_score: Optional[RiskScore] = None
    admin_notes: Optional[str] = None
    rejection_reason: Optional[str] = None


# ============ Shop Verification Schemas ============

class ShopVerificationCreate(BaseModel):
    """Schema for creating shop verification request"""
    # Owner Info
    owner_name: str
    phone: str
    email: Optional[str] = None
    alternate_phone: Optional[str] = None
    
    # Shop Info
    shop_name: str
    category: str  # e.g., electronics, mobile, grocery, restaurant
    shop_type: Optional[str] = "retail"  # retail, restaurant, service
    description: Optional[str] = None
    established_year: Optional[str] = None
    
    # Location & Timing
    shop_address: str
    landmark: Optional[str] = None
    city: str
    pincode: str
    opening_time: Optional[str] = "09:00"
    closing_time: Optional[str] = "21:00"
    working_days: Optional[list[str]] = []
    
    # Business Documents
    gst_number: Optional[str] = None
    has_gst: bool = True
    pan_number: Optional[str] = None
    fssai_number: Optional[str] = None  # For food businesses
    trade_license: Optional[str] = None
    
    # Banking
    bank_account_number: Optional[str] = None
    ifsc_code: Optional[str] = None
    account_holder_name: Optional[str] = None
    
    # Delivery
    delivery_available: Optional[bool] = False
    delivery_radius: Optional[str] = "5"
    minimum_order_value: Optional[str] = None
    
    shop_image: Optional[str] = None


class ShopVerificationUpdate(BaseModel):
    """Schema for updating shop verification"""
    status: Optional[VerificationStatus] = None
    risk_score: Optional[RiskScore] = None
    admin_notes: Optional[str] = None
    rejection_reason: Optional[str] = None


# ============ General Verification Response Schemas ============

class VerificationResponse(BaseModel):
    """Response schema for verification"""
    id: str
    user_id: Optional[str] = None
    verification_type: VerificationType
    status: VerificationStatus
    risk_score: RiskScore
    
    # Common fields
    name: str
    phone: str
    email: Optional[str] = None
    city: str
    pincode: str
    
    # Professional specific
    profession: Optional[str] = None
    experience: Optional[str] = None
    service_radius: Optional[str] = None
    aadhaar_number: Optional[str] = None
    
    # Shop specific
    shop_name: Optional[str] = None
    category: Optional[str] = None
    shop_address: Optional[str] = None
    gst_number: Optional[str] = None
    has_gst: Optional[bool] = None
    
    # Documents
    documents: List[DocumentInfo] = []
    documents_count: int = 0
    
    # Admin fields
    admin_notes: Optional[str] = None
    rejection_reason: Optional[str] = None
    reviewed_by: Optional[str] = None
    reviewed_at: Optional[datetime] = None
    
    # Timestamps
    submitted_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class VerificationListResponse(BaseModel):
    """Response for list of verifications"""
    verifications: List[VerificationResponse]
    total: int
    page: int
    limit: int


class VerificationStatsResponse(BaseModel):
    """Statistics for verifications"""
    pending: int
    approved_today: int
    rejected_today: int
    high_risk: int
    total_professionals: int = 0
    total_shops: int = 0


def verification_helper(verification: dict) -> dict:
    """Convert MongoDB verification document to response format"""
    from datetime import datetime
    
    # Get timestamps with fallbacks
    created_at = verification.get("created_at", datetime.utcnow())
    submitted_at = verification.get("submitted_at", created_at)
    updated_at = verification.get("updated_at", created_at)
    
    return {
        "id": str(verification["_id"]),
        "user_id": str(verification.get("user_id")) if verification.get("user_id") else None,
        "verification_type": verification.get("verification_type", "professional"),
        "status": verification.get("status", "pending"),
        "risk_score": verification.get("risk_score", "low"),
        
        # Common fields
        "name": verification.get("name", ""),
        "phone": verification.get("phone", ""),
        "email": verification.get("email"),
        "city": verification.get("city", ""),
        "pincode": verification.get("pincode", ""),
        
        # Professional specific
        "profession": verification.get("profession"),
        "experience": verification.get("experience"),
        "service_radius": verification.get("service_radius"),
        "aadhaar_number": verification.get("aadhaar_number"),
        
        # Shop specific
        "shop_name": verification.get("shop_name"),
        "category": verification.get("category"),
        "shop_address": verification.get("shop_address"),
        "gst_number": verification.get("gst_number"),
        "has_gst": verification.get("has_gst"),
        
        # Documents
        "documents": verification.get("documents", []),
        "documents_count": len(verification.get("documents", [])),
        
        # Admin fields
        "admin_notes": verification.get("admin_notes"),
        "rejection_reason": verification.get("rejection_reason"),
        "reviewed_by": str(verification.get("reviewed_by")) if verification.get("reviewed_by") else None,
        "reviewed_at": verification.get("reviewed_at"),
        
        # Timestamps
        "submitted_at": submitted_at,
        "updated_at": updated_at,
    }
