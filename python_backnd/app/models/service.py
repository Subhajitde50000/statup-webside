"""
Service model for MongoDB - Professional services offered
Like Urban Company / Zomato style service listings
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from bson import ObjectId


class ServiceBase(BaseModel):
    name: str = Field(..., min_length=3, max_length=200)
    category: str = Field(..., min_length=2, max_length=100)
    description: str = Field(..., min_length=10, max_length=2000)
    price: float = Field(..., ge=0)
    price_type: str = Field(default="fixed")  # fixed, starting_from, hourly
    duration: str = Field(..., min_length=2, max_length=50)
    image: Optional[str] = None
    gallery_images: Optional[List[str]] = None  # Multiple images
    is_active: bool = True
    
    # Service Details
    service_area: Optional[str] = None  # Area where service is available
    service_includes: Optional[List[str]] = None  # What's included
    service_excludes: Optional[List[str]] = None  # What's not included
    tags: Optional[List[str]] = None  # Searchable tags
    
    # Service Features
    features: Optional[List[str]] = None  # e.g., "Tools included", "7-day warranty"
    warranty_days: Optional[int] = None  # Warranty period in days
    
    # Availability
    available_days: Optional[List[str]] = None  # ["Monday", "Tuesday", etc.]
    available_time_start: Optional[str] = None  # "09:00"
    available_time_end: Optional[str] = None  # "18:00"
    emergency_available: bool = False  # Available for emergency calls


class ServiceCreate(ServiceBase):
    pass


class ServiceUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    price_type: Optional[str] = None
    duration: Optional[str] = None
    image: Optional[str] = None
    gallery_images: Optional[List[str]] = None
    is_active: Optional[bool] = None
    
    # Service Details
    service_area: Optional[str] = None
    service_includes: Optional[List[str]] = None
    service_excludes: Optional[List[str]] = None
    tags: Optional[List[str]] = None
    
    # Service Features
    features: Optional[List[str]] = None
    warranty_days: Optional[int] = None
    
    # Availability
    available_days: Optional[List[str]] = None
    available_time_start: Optional[str] = None
    available_time_end: Optional[str] = None
    emergency_available: Optional[bool] = None


class ServiceInDB(ServiceBase):
    id: str
    professional_id: str
    professional_name: str
    professional_image: Optional[str] = None
    professional_rating: Optional[float] = None
    professional_experience: Optional[str] = None
    professional_verified: bool = False
    bookings_count: int = 0
    rating: float = 0.0
    total_ratings: int = 0
    reviews_count: int = 0
    earnings: float = 0.0
    created_at: datetime
    updated_at: datetime

    class Config:
        json_schema_extra = {
            "example": {
                "id": "507f1f77bcf86cd799439011",
                "name": "Fan Repair & Installation",
                "category": "Electrical",
                "description": "Complete fan repair, installation, and maintenance services",
                "price": 350.0,
                "price_type": "starting_from",
                "duration": "45-60 min",
                "image": "https://example.com/image.jpg",
                "is_active": True,
                "service_area": "Mumbai, Thane, Navi Mumbai",
                "service_includes": ["Fan inspection", "Noise fixing", "Speed regulation"],
                "service_excludes": ["Spare parts", "New fan purchase"],
                "tags": ["fan", "ceiling fan", "repair", "installation"],
                "features": ["Tools included", "7-day warranty", "Verified professional"],
                "warranty_days": 7,
                "professional_id": "507f1f77bcf86cd799439012",
                "professional_name": "John Doe",
                "professional_verified": True,
                "bookings_count": 45,
                "rating": 4.8,
                "total_ratings": 40,
                "earnings": 15750.0,
                "created_at": "2024-01-15T10:30:00",
                "updated_at": "2024-01-15T10:30:00"
            }
        }


def service_helper(service: dict, professional: dict = None) -> dict:
    """Convert MongoDB document to response format with professional details"""
    result = {
        "id": str(service["_id"]),
        "name": service.get("name", ""),
        "category": service.get("category", ""),
        "description": service.get("description", ""),
        "price": service.get("price", 0),
        "price_type": service.get("price_type", "fixed"),
        "duration": service.get("duration", ""),
        "image": service.get("image"),
        "gallery_images": service.get("gallery_images", []),
        "is_active": service.get("is_active", True),
        
        # Service Details
        "service_area": service.get("service_area"),
        "service_includes": service.get("service_includes", []),
        "service_excludes": service.get("service_excludes", []),
        "tags": service.get("tags", []),
        
        # Service Features
        "features": service.get("features", []),
        "warranty_days": service.get("warranty_days"),
        
        # Availability
        "available_days": service.get("available_days", []),
        "available_time_start": service.get("available_time_start"),
        "available_time_end": service.get("available_time_end"),
        "emergency_available": service.get("emergency_available", False),
        
        # Professional Info
        "professional_id": str(service.get("professional_id", "")),
        "professional_name": service.get("professional_name", ""),
        "professional_image": service.get("professional_image"),
        "professional_rating": service.get("professional_rating"),
        "professional_experience": service.get("professional_experience"),
        "professional_verified": service.get("professional_verified", False),
        
        # Stats
        "bookings_count": service.get("bookings_count", 0),
        "rating": service.get("rating", 0.0),
        "total_ratings": service.get("total_ratings", 0),
        "reviews_count": service.get("reviews_count", 0),
        "earnings": service.get("earnings", 0.0),
        "created_at": service.get("created_at", datetime.utcnow()).isoformat(),
        "updated_at": service.get("updated_at", datetime.utcnow()).isoformat()
    }
    
    # Add professional details if provided
    if professional:
        result["professional_name"] = professional.get("name", result["professional_name"])
        result["professional_image"] = professional.get("profile_image")
        result["professional_rating"] = professional.get("approval_data", {}).get("rating")
        result["professional_experience"] = professional.get("approval_data", {}).get("experience")
        result["professional_verified"] = professional.get("is_verified", False)
    
    return result
