"""
Service routes - CRUD operations for professional services
Like Urban Company / Zomato style service listings
"""

from fastapi import APIRouter, HTTPException, status, Depends
from typing import List, Optional
from datetime import datetime
from bson import ObjectId

from app.database import get_database, get_users_collection
from app.models.service import ServiceCreate, ServiceUpdate, service_helper
from app.models.user import UserRole
from app.utils.security import get_current_user
from app.middleware.rbac import require_roles


router = APIRouter()


async def get_services_collection():
    """Get services collection from database"""
    db = get_database()
    return db["services"]


async def get_professional_data(professional_id):
    """Get professional user data"""
    users = get_users_collection()
    if isinstance(professional_id, str):
        professional_id = ObjectId(professional_id)
    return await users.find_one({"_id": professional_id})


# ============ CREATE SERVICE ============

@router.post("/", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_service(
    service_data: ServiceCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create a new service (Professional only)"""
    # Check if user is a professional
    if current_user.get("role") != "professional":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only professionals can create services"
        )
    
    # Check if professional is approved
    if current_user.get("approval_status") != "approved":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your professional account must be approved to create services"
        )
    
    services = await get_services_collection()
    
    # Get professional details from approval_data
    approval_data = current_user.get("approval_data", {})
    
    # Prepare service document with all new fields
    service_doc = {
        **service_data.model_dump(),
        "professional_id": current_user["_id"],
        "professional_name": current_user.get("name", "Unknown"),
        "professional_image": current_user.get("profile_image"),
        "professional_rating": approval_data.get("rating"),
        "professional_experience": approval_data.get("experience"),
        "professional_verified": current_user.get("is_verified", False),
        "bookings_count": 0,
        "rating": 0.0,
        "total_ratings": 0,
        "reviews_count": 0,
        "earnings": 0.0,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    # Insert service
    result = await services.insert_one(service_doc)
    service_doc["_id"] = result.inserted_id
    
    return {
        "message": "Service created successfully",
        "service": service_helper(service_doc)
    }


# ============ GET MY SERVICES ============

@router.get("/my-services", response_model=dict)
async def get_my_services(
    is_active: Optional[bool] = None,
    category: Optional[str] = None,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    current_user: dict = Depends(get_current_user)
):
    """Get all services for the current professional"""
    if current_user.get("role") != "professional":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only professionals can access their services"
        )
    
    services = await get_services_collection()
    
    # Build query
    query = {"professional_id": current_user["_id"]}
    
    if is_active is not None:
        query["is_active"] = is_active
    
    if category:
        query["category"] = category
    
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}}
        ]
    
    # Get total count
    total = await services.count_documents(query)
    
    # Get services
    cursor = services.find(query).sort("created_at", -1).skip(skip).limit(limit)
    service_list = []
    
    async for service in cursor:
        service_list.append(service_helper(service))
    
    # Calculate stats
    all_services_query = {"professional_id": current_user["_id"]}
    all_services_cursor = services.find(all_services_query)
    
    total_services = 0
    active_services = 0
    total_bookings = 0
    total_earnings = 0.0
    total_rating_sum = 0.0
    total_rating_count = 0
    
    async for service in all_services_cursor:
        total_services += 1
        if service.get("is_active", True):
            active_services += 1
        total_bookings += service.get("bookings_count", 0)
        total_earnings += service.get("earnings", 0.0)
        if service.get("total_ratings", 0) > 0:
            total_rating_sum += service.get("rating", 0.0) * service.get("total_ratings", 0)
            total_rating_count += service.get("total_ratings", 0)
    
    avg_rating = round(total_rating_sum / total_rating_count, 1) if total_rating_count > 0 else 0.0
    
    return {
        "total": total,
        "services": service_list,
        "skip": skip,
        "limit": limit,
        "stats": {
            "total_services": total_services,
            "active_services": active_services,
            "total_bookings": total_bookings,
            "total_earnings": total_earnings,
            "avg_rating": avg_rating
        }
    }


# ============ GET ALL SERVICES (PUBLIC) ============

@router.get("/", response_model=dict)
async def get_all_services(
    category: Optional[str] = None,
    search: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    min_rating: Optional[float] = None,
    professional_id: Optional[str] = None,
    service_area: Optional[str] = None,
    emergency_available: Optional[bool] = None,
    sort_by: Optional[str] = "recommended",  # recommended, price_low, price_high, rating, newest
    skip: int = 0,
    limit: int = 100
):
    """Get all active services (public - for customers) - Urban Company style"""
    services = await get_services_collection()
    users = get_users_collection()
    
    # Build query - only show active services
    query = {"is_active": True}
    
    if category:
        query["category"] = {"$regex": category, "$options": "i"}
    
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
            {"category": {"$regex": search, "$options": "i"}},
            {"tags": {"$regex": search, "$options": "i"}}
        ]
    
    if min_price is not None:
        query["price"] = {"$gte": min_price}
    
    if max_price is not None:
        if "price" in query:
            query["price"]["$lte"] = max_price
        else:
            query["price"] = {"$lte": max_price}
    
    if min_rating is not None:
        query["rating"] = {"$gte": min_rating}
    
    if professional_id and ObjectId.is_valid(professional_id):
        query["professional_id"] = ObjectId(professional_id)
    
    if service_area:
        query["service_area"] = {"$regex": service_area, "$options": "i"}
    
    if emergency_available is not None:
        query["emergency_available"] = emergency_available
    
    # Get total count
    total = await services.count_documents(query)
    
    # Sort options
    sort_options = {
        "recommended": [("rating", -1), ("bookings_count", -1)],
        "price_low": [("price", 1)],
        "price_high": [("price", -1)],
        "rating": [("rating", -1), ("total_ratings", -1)],
        "newest": [("created_at", -1)],
        "popular": [("bookings_count", -1)]
    }
    sort_order = sort_options.get(sort_by, sort_options["recommended"])
    
    # Get services
    cursor = services.find(query).sort(sort_order).skip(skip).limit(limit)
    service_list = []
    
    async for service in cursor:
        # Get professional details if not already in service
        professional = None
        if not service.get("professional_image") or not service.get("professional_verified"):
            professional = await get_professional_data(service.get("professional_id"))
        
        service_list.append(service_helper(service, professional))
    
    # Get unique categories for filtering
    categories = await services.distinct("category", {"is_active": True})
    
    return {
        "total": total,
        "services": service_list,
        "skip": skip,
        "limit": limit,
        "categories": sorted(categories),
        "filters_applied": {
            "category": category,
            "search": search,
            "min_price": min_price,
            "max_price": max_price,
            "min_rating": min_rating,
            "service_area": service_area,
            "emergency_available": emergency_available,
            "sort_by": sort_by
        }
    }


# ============ GET SERVICE BY ID ============

@router.get("/{service_id}", response_model=dict)
async def get_service(service_id: str):
    """Get a single service by ID"""
    services = await get_services_collection()
    
    if not ObjectId.is_valid(service_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid service ID"
        )
    
    service = await services.find_one({"_id": ObjectId(service_id)})
    
    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service not found"
        )
    
    return {"service": service_helper(service)}


# ============ UPDATE SERVICE ============

@router.put("/{service_id}", response_model=dict)
async def update_service(
    service_id: str,
    service_data: ServiceUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update a service (Owner only)"""
    services = await get_services_collection()
    
    if not ObjectId.is_valid(service_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid service ID"
        )
    
    # Find existing service
    existing_service = await services.find_one({"_id": ObjectId(service_id)})
    
    if not existing_service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service not found"
        )
    
    # Check ownership
    if str(existing_service["professional_id"]) != str(current_user["_id"]):
        # Allow admin to update any service
        if current_user.get("role") not in ["admin", "manager"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to update this service"
            )
    
    # Prepare update data
    update_data = service_data.model_dump(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow()
    
    # Update service
    await services.update_one(
        {"_id": ObjectId(service_id)},
        {"$set": update_data}
    )
    
    # Get updated service
    updated_service = await services.find_one({"_id": ObjectId(service_id)})
    
    return {
        "message": "Service updated successfully",
        "service": service_helper(updated_service)
    }


# ============ TOGGLE SERVICE STATUS ============

@router.patch("/{service_id}/toggle-status", response_model=dict)
async def toggle_service_status(
    service_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Toggle service active/inactive status (Owner only)"""
    services = await get_services_collection()
    
    if not ObjectId.is_valid(service_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid service ID"
        )
    
    # Find existing service
    existing_service = await services.find_one({"_id": ObjectId(service_id)})
    
    if not existing_service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service not found"
        )
    
    # Check ownership
    if str(existing_service["professional_id"]) != str(current_user["_id"]):
        if current_user.get("role") not in ["admin", "manager"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to update this service"
            )
    
    # Toggle status
    new_status = not existing_service.get("is_active", True)
    
    await services.update_one(
        {"_id": ObjectId(service_id)},
        {"$set": {"is_active": new_status, "updated_at": datetime.utcnow()}}
    )
    
    # Get updated service
    updated_service = await services.find_one({"_id": ObjectId(service_id)})
    
    return {
        "message": f"Service {'activated' if new_status else 'deactivated'} successfully",
        "service": service_helper(updated_service)
    }


# ============ DELETE SERVICE ============

@router.delete("/{service_id}", response_model=dict)
async def delete_service(
    service_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete a service (Owner only)"""
    services = await get_services_collection()
    
    if not ObjectId.is_valid(service_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid service ID"
        )
    
    # Find existing service
    existing_service = await services.find_one({"_id": ObjectId(service_id)})
    
    if not existing_service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service not found"
        )
    
    # Check ownership
    if str(existing_service["professional_id"]) != str(current_user["_id"]):
        if current_user.get("role") not in ["admin", "manager"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to delete this service"
            )
    
    # Delete service
    await services.delete_one({"_id": ObjectId(service_id)})
    
    return {"message": "Service deleted successfully"}


# ============ GET SERVICES BY PROFESSIONAL ============

@router.get("/professional/{professional_id}", response_model=dict)
async def get_services_by_professional(
    professional_id: str,
    skip: int = 0,
    limit: int = 100
):
    """Get all active services for a specific professional (public)"""
    services = await get_services_collection()
    
    if not ObjectId.is_valid(professional_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid professional ID"
        )
    
    # Build query - only show active services for public
    query = {
        "professional_id": ObjectId(professional_id),
        "is_active": True
    }
    
    # Get total count
    total = await services.count_documents(query)
    
    # Get services
    cursor = services.find(query).sort("created_at", -1).skip(skip).limit(limit)
    service_list = []
    
    async for service in cursor:
        service_list.append(service_helper(service))
    
    return {
        "total": total,
        "services": service_list,
        "skip": skip,
        "limit": limit
    }


# ============ GET SERVICE CATEGORIES ============

@router.get("/categories/list", response_model=dict)
async def get_service_categories():
    """Get all unique service categories"""
    services = await get_services_collection()
    
    # Get distinct categories
    categories = await services.distinct("category")
    
    return {
        "categories": sorted(categories)
    }
