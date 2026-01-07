"""
Favorites management routes
"""

from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from bson import ObjectId
from app.database import get_users_collection
from app.routes.auth import get_current_user, get_optional_current_user

router = APIRouter(prefix="/favorites", tags=["favorites"])


@router.post("/toggle/{professional_id}")
async def toggle_favorite(
    professional_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Toggle a professional in user's favorites.
    If already favorited, removes it. If not favorited, adds it.
    """
    users_collection = get_users_collection()
    
    # Validate professional_id
    if not ObjectId.is_valid(professional_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid professional ID"
        )
    
    # Check if professional exists and has professional role
    professional = await users_collection.find_one({
        "_id": ObjectId(professional_id),
        "role": "professional",
        "approval_status": "approved",
        "is_active": True
    })
    
    if not professional:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Professional not found or not active"
        )
    
    user_id = current_user["_id"]
    
    # Get current favorites list
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    favorites = user.get("favorite_professionals", [])
    
    # Toggle favorite
    is_favorited = professional_id in favorites
    
    if is_favorited:
        # Remove from favorites
        await users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$pull": {"favorite_professionals": professional_id}}
        )
        return {
            "success": True,
            "message": "Professional removed from favorites",
            "is_favorited": False
        }
    else:
        # Add to favorites
        await users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$addToSet": {"favorite_professionals": professional_id}}
        )
        return {
            "success": True,
            "message": "Professional added to favorites",
            "is_favorited": True
        }


@router.get("/check/{professional_id}")
async def check_favorite(
    professional_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Check if a professional is in user's favorites
    """
    try:
        users_collection = get_users_collection()
        user_id = current_user["_id"]
        
        user = await users_collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            return {"is_favorited": False}
        
        favorites = user.get("favorite_professionals", [])
        
        return {
            "is_favorited": professional_id in favorites
        }
    except Exception as e:
        # If any error, just return false
        print(f"Error checking favorite: {str(e)}")
        return {"is_favorited": False}


@router.get("/list")
async def get_favorites(
    current_user: dict = Depends(get_current_user)
):
    """
    Get list of user's favorite professionals with their details
    """
    users_collection = get_users_collection()
    user_id = current_user["_id"]
    
    # Get user's favorites list
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    favorite_ids = user.get("favorite_professionals", [])
    
    if not favorite_ids:
        return {"favorites": []}
    
    # Convert string IDs to ObjectIds
    object_ids = [ObjectId(fav_id) for fav_id in favorite_ids if ObjectId.is_valid(fav_id)]
    
    # Fetch all favorite professionals
    favorites = []
    async for professional in users_collection.find({
        "_id": {"$in": object_ids},
        "role": "professional",
        "is_active": True
    }):
        # Get approval data
        approval_data = professional.get("approval_data", {})
        
        favorites.append({
            "id": str(professional["_id"]),
            "name": professional.get("name", "N/A"),
            "phone": professional.get("phone"),
            "email": professional.get("email"),
            "profile_image": professional.get("profile_image"),
            "profession": approval_data.get("profession", "N/A"),
            "experience_years": approval_data.get("experience_years", 0),
            "address": approval_data.get("address", "N/A"),
            "city": approval_data.get("city", "N/A"),
            "pincode": approval_data.get("pincode", "N/A"),
            "hourly_rate": approval_data.get("hourly_rate"),
            "visiting_charge": approval_data.get("visiting_charge"),
            "approval_status": professional.get("approval_status", "pending"),
            "is_favorited": True  # All items in this list are favorited
        })
    
    return {"favorites": favorites}


@router.delete("/clear")
async def clear_favorites(
    current_user: dict = Depends(get_current_user)
):
    """
    Clear all favorites for the current user
    """
    users_collection = get_users_collection()
    user_id = current_user["_id"]
    
    await users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"favorite_professionals": []}}
    )
    
    return {
        "success": True,
        "message": "All favorites cleared"
    }


@router.get("/count")
async def get_favorites_count(
    current_user: Optional[dict] = Depends(get_optional_current_user)
):
    """
    Get the count of favorites for the current user.
    Returns 0 if not authenticated.
    """
    if not current_user:
        return {"count": 0}
    
    users_collection = get_users_collection()
    user_id = current_user["_id"]
    
    user = await users_collection.find_one(
        {"_id": ObjectId(user_id)},
        {"favorite_professionals": 1}
    )
    
    if not user or "favorite_professionals" not in user:
        return {"count": 0}
    
    return {"count": len(user["favorite_professionals"])}
