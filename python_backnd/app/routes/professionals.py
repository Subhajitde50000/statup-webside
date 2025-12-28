"""
Advanced Professional Search and Discovery Routes
Similar to Zomato/Flipkart search functionality
"""

from fastapi import APIRouter, Query, Depends, HTTPException, status
from typing import Optional, List
from bson import ObjectId
from app.database import get_users_collection
from app.routes.auth import get_current_user
import re
from datetime import datetime

router = APIRouter(prefix="/professionals", tags=["professionals"])


@router.get("/search")
async def search_professionals(
    query: Optional[str] = Query(None, description="Search by name, profession, skills"),
    profession: Optional[str] = Query(None, description="Filter by profession type"),
    city: Optional[str] = Query(None, description="Filter by city"),
    min_experience: Optional[int] = Query(None, ge=0, description="Minimum years of experience"),
    max_hourly_rate: Optional[float] = Query(None, ge=0, description="Maximum hourly rate"),
    sort_by: Optional[str] = Query("relevance", description="Sort by: relevance, experience, rate_low, rate_high, recent"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Results per page"),
    current_user: Optional[dict] = Depends(get_current_user)
):
    """
    Advanced professional search with multiple filters and sorting
    Similar to Zomato/Flipkart search experience
    """
    users_collection = get_users_collection()
    
    # Build search query
    search_filter = {
        "role": "professional",
        "is_active": True,
        "approval_status": "approved"
    }
    
    # Text search
    if query:
        search_filter["$or"] = [
            {"name": {"$regex": query, "$options": "i"}},
            {"approval_data.profession": {"$regex": query, "$options": "i"}},
            {"approval_data.skills": {"$regex": query, "$options": "i"}},
            {"approval_data.bio": {"$regex": query, "$options": "i"}}
        ]
    
    # Profession filter
    if profession:
        search_filter["approval_data.profession"] = {"$regex": profession, "$options": "i"}
    
    # City filter
    if city:
        search_filter["approval_data.city"] = {"$regex": city, "$options": "i"}
    
    # Experience filter
    if min_experience is not None:
        search_filter["approval_data.experience_years"] = {"$gte": min_experience}
    
    # Hourly rate filter
    if max_hourly_rate is not None:
        search_filter["approval_data.hourly_rate"] = {"$lte": max_hourly_rate}
    
    # Determine sort order
    sort_field = "created_at"
    sort_direction = -1
    
    if sort_by == "experience":
        sort_field = "approval_data.experience_years"
        sort_direction = -1
    elif sort_by == "rate_low":
        sort_field = "approval_data.hourly_rate"
        sort_direction = 1
    elif sort_by == "rate_high":
        sort_field = "approval_data.hourly_rate"
        sort_direction = -1
    elif sort_by == "recent":
        sort_field = "created_at"
        sort_direction = -1
    
    # Calculate pagination
    skip = (page - 1) * limit
    
    # Get total count
    total_count = await users_collection.count_documents(search_filter)
    
    # Get user's favorites if authenticated
    user_favorites = []
    if current_user:
        user = await users_collection.find_one({"_id": ObjectId(current_user["_id"])})
        user_favorites = user.get("favorite_professionals", []) if user else []
    
    # Fetch professionals
    professionals = []
    cursor = users_collection.find(search_filter).sort(sort_field, sort_direction).skip(skip).limit(limit)
    
    async for professional in cursor:
        approval_data = professional.get("approval_data", {})
        prof_id = str(professional["_id"])
        
        professionals.append({
            "id": prof_id,
            "name": professional.get("name", "N/A"),
            "phone": professional.get("phone"),
            "email": professional.get("email"),
            "profile_image": professional.get("profile_image"),
            "profession": approval_data.get("profession", "N/A"),
            "experience_years": approval_data.get("experience_years", 0),
            "hourly_rate": approval_data.get("hourly_rate"),
            "address": approval_data.get("address", "N/A"),
            "city": approval_data.get("city", "N/A"),
            "pincode": approval_data.get("pincode", "N/A"),
            "bio": approval_data.get("bio"),
            "skills": approval_data.get("skills", []),
            "languages": approval_data.get("languages", []),
            "is_verified": professional.get("is_verified", False),
            "is_favorited": prof_id in user_favorites,
            "rating": 4.5,  # Placeholder - implement rating system later
            "total_reviews": 0  # Placeholder
        })
    
    # Calculate pagination info
    total_pages = (total_count + limit - 1) // limit
    
    return {
        "success": True,
        "data": professionals,
        "pagination": {
            "current_page": page,
            "per_page": limit,
            "total_items": total_count,
            "total_pages": total_pages,
            "has_next": page < total_pages,
            "has_prev": page > 1
        },
        "filters": {
            "query": query,
            "profession": profession,
            "city": city,
            "min_experience": min_experience,
            "max_hourly_rate": max_hourly_rate,
            "sort_by": sort_by
        }
    }


@router.get("/professions")
async def get_professions():
    """Get list of all available professions"""
    users_collection = get_users_collection()
    
    # Get unique professions
    professions = await users_collection.distinct(
        "approval_data.profession",
        {
            "role": "professional",
            "is_active": True,
            "approval_status": "approved"
        }
    )
    
    return {
        "success": True,
        "professions": sorted([p for p in professions if p])
    }


@router.get("/cities")
async def get_cities():
    """Get list of all cities where professionals are available"""
    users_collection = get_users_collection()
    
    cities = await users_collection.distinct(
        "approval_data.city",
        {
            "role": "professional",
            "is_active": True,
            "approval_status": "approved"
        }
    )
    
    return {
        "success": True,
        "cities": sorted([c for c in cities if c])
    }


@router.get("/{professional_id}")
async def get_professional_detail(
    professional_id: str,
    current_user: Optional[dict] = Depends(get_current_user)
):
    """Get detailed information about a specific professional"""
    users_collection = get_users_collection()
    
    if not ObjectId.is_valid(professional_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid professional ID"
        )
    
    professional = await users_collection.find_one({
        "_id": ObjectId(professional_id),
        "role": "professional",
        "is_active": True
    })
    
    if not professional:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Professional not found"
        )
    
    approval_data = professional.get("approval_data", {})
    
    # Check if favorited
    is_favorited = False
    if current_user:
        user = await users_collection.find_one({"_id": ObjectId(current_user["_id"])})
        user_favorites = user.get("favorite_professionals", []) if user else []
        is_favorited = professional_id in user_favorites
    
    return {
        "success": True,
        "data": {
            "id": str(professional["_id"]),
            "name": professional.get("name"),
            "phone": professional.get("phone"),
            "email": professional.get("email"),
            "profile_image": professional.get("profile_image"),
            "profession": approval_data.get("profession"),
            "experience_years": approval_data.get("experience_years", 0),
            "hourly_rate": approval_data.get("hourly_rate"),
            "address": approval_data.get("address"),
            "city": approval_data.get("city"),
            "state": approval_data.get("state"),
            "pincode": approval_data.get("pincode"),
            "bio": approval_data.get("bio"),
            "skills": approval_data.get("skills", []),
            "languages": approval_data.get("languages", []),
            "certifications": approval_data.get("certifications", []),
            "working_hours": approval_data.get("working_hours"),
            "is_verified": professional.get("is_verified", False),
            "is_favorited": is_favorited,
            "approval_status": professional.get("approval_status"),
            "created_at": professional.get("created_at"),
            "rating": 4.5,
            "total_reviews": 0
        }
    }


@router.get("/featured/top")
async def get_featured_professionals(
    limit: int = Query(10, ge=1, le=50),
    current_user: Optional[dict] = Depends(get_current_user)
):
    """Get top/featured professionals for homepage"""
    users_collection = get_users_collection()
    
    # Get user's favorites
    user_favorites = []
    if current_user:
        user = await users_collection.find_one({"_id": ObjectId(current_user["_id"])})
        user_favorites = user.get("favorite_professionals", []) if user else []
    
    professionals = []
    cursor = users_collection.find({
        "role": "professional",
        "is_active": True,
        "approval_status": "approved",
        "is_verified": True
    }).sort("created_at", -1).limit(limit)
    
    async for professional in cursor:
        approval_data = professional.get("approval_data", {})
        prof_id = str(professional["_id"])
        
        professionals.append({
            "id": prof_id,
            "name": professional.get("name"),
            "profession": approval_data.get("profession"),
            "experience_years": approval_data.get("experience_years", 0),
            "hourly_rate": approval_data.get("hourly_rate"),
            "city": approval_data.get("city"),
            "profile_image": professional.get("profile_image"),
            "is_verified": True,
            "is_favorited": prof_id in user_favorites,
            "rating": 4.5
        })
    
    return {
        "success": True,
        "data": professionals
    }
