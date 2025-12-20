"""
Vacancy routes - Create, Read, Update, Delete vacancies
"""

from fastapi import APIRouter, HTTPException, status, Depends
from typing import List, Optional
from datetime import datetime
from bson import ObjectId

from app.database import get_database
from app.models.vacancy import VacancyCreate, VacancyUpdate, VacancyInDB, vacancy_helper
from app.models.user import UserRole
from app.utils.security import get_current_user
from app.middleware.rbac import require_roles


router = APIRouter()


async def get_vacancies_collection():
    """Get vacancies collection from database"""
    db = get_database()
    return db["vacancies"]


# ============ CREATE VACANCY ============

@router.post("/", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_vacancy(
    vacancy_data: VacancyCreate,
    current_user: dict = Depends(require_roles([UserRole.ADMIN, UserRole.MANAGER]))
):
    """Create a new vacancy (Admin/Manager only)"""
    vacancies = await get_vacancies_collection()
    
    # Prepare vacancy document
    vacancy_doc = {
        **vacancy_data.model_dump(),
        "created_by": current_user["_id"],
        "created_by_name": current_user.get("name", "Unknown"),
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "status": "open",
        "applicant_count": 0
    }
    
    # Insert vacancy
    result = await vacancies.insert_one(vacancy_doc)
    vacancy_doc["_id"] = result.inserted_id
    
    return {
        "message": "Vacancy created successfully",
        "vacancy": vacancy_helper(vacancy_doc)
    }


# ============ GET ALL VACANCIES ============

@router.get("/", response_model=dict)
async def get_all_vacancies(
    status: Optional[str] = None,
    department: Optional[str] = None,
    employment_type: Optional[str] = None,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 100
):
    """Get all vacancies (public - for job seekers)"""
    vacancies = await get_vacancies_collection()
    
    # Build query
    query = {}
    
    # Only show open vacancies for public (or all if authenticated admin)
    if status:
        query["status"] = status
    else:
        query["status"] = "open"  # Default to open vacancies
    
    if department:
        query["department"] = department
    
    if employment_type:
        query["employment_type"] = employment_type
    
    if search:
        query["$or"] = [
            {"job_title": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
            {"location": {"$regex": search, "$options": "i"}}
        ]
    
    # Get total count
    total = await vacancies.count_documents(query)
    
    # Get vacancies
    cursor = vacancies.find(query).sort("created_at", -1).skip(skip).limit(limit)
    vacancy_list = []
    
    async for vacancy in cursor:
        vacancy_list.append(vacancy_helper(vacancy))
    
    return {
        "total": total,
        "vacancies": vacancy_list,
        "skip": skip,
        "limit": limit
    }


# ============ GET VACANCY BY ID ============

@router.get("/{vacancy_id}", response_model=dict)
async def get_vacancy(vacancy_id: str):
    """Get a single vacancy by ID"""
    vacancies = await get_vacancies_collection()
    
    if not ObjectId.is_valid(vacancy_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid vacancy ID"
        )
    
    vacancy = await vacancies.find_one({"_id": ObjectId(vacancy_id)})
    
    if not vacancy:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vacancy not found"
        )
    
    return {"vacancy": vacancy_helper(vacancy)}


# ============ UPDATE VACANCY ============

@router.put("/{vacancy_id}", response_model=dict)
async def update_vacancy(
    vacancy_id: str,
    vacancy_data: VacancyUpdate,
    current_user: dict = Depends(require_roles([UserRole.ADMIN, UserRole.MANAGER]))
):
    """Update a vacancy (Admin/Manager only)"""
    vacancies = await get_vacancies_collection()
    
    if not ObjectId.is_valid(vacancy_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid vacancy ID"
        )
    
    # Get existing vacancy
    existing_vacancy = await vacancies.find_one({"_id": ObjectId(vacancy_id)})
    if not existing_vacancy:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vacancy not found"
        )
    
    # Update only provided fields
    update_data = {k: v for k, v in vacancy_data.model_dump(exclude_unset=True).items()}
    
    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No data to update"
        )
    
    update_data["updated_at"] = datetime.utcnow()
    
    # Update vacancy
    await vacancies.update_one(
        {"_id": ObjectId(vacancy_id)},
        {"$set": update_data}
    )
    
    # Get updated vacancy
    updated_vacancy = await vacancies.find_one({"_id": ObjectId(vacancy_id)})
    
    return {
        "message": "Vacancy updated successfully",
        "vacancy": vacancy_helper(updated_vacancy)
    }


# ============ DELETE VACANCY ============

@router.delete("/{vacancy_id}", response_model=dict)
async def delete_vacancy(
    vacancy_id: str,
    current_user: dict = Depends(require_roles([UserRole.ADMIN]))
):
    """Delete a vacancy (Admin only)"""
    vacancies = await get_vacancies_collection()
    
    if not ObjectId.is_valid(vacancy_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid vacancy ID"
        )
    
    result = await vacancies.delete_one({"_id": ObjectId(vacancy_id)})
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vacancy not found"
        )
    
    return {"message": "Vacancy deleted successfully"}


# ============ GET ADMIN VACANCIES ============

@router.get("/admin/list", response_model=dict)
async def get_admin_vacancies(
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    current_user: dict = Depends(require_roles([UserRole.ADMIN, UserRole.MANAGER]))
):
    """Get all vacancies for admin dashboard (includes drafts, closed, etc.)"""
    vacancies = await get_vacancies_collection()
    
    query = {}
    if status:
        query["status"] = status
    
    # Get total count
    total = await vacancies.count_documents(query)
    
    # Get vacancies
    cursor = vacancies.find(query).sort("created_at", -1).skip(skip).limit(limit)
    vacancy_list = []
    
    async for vacancy in cursor:
        vacancy_list.append(vacancy_helper(vacancy))
    
    return {
        "total": total,
        "vacancies": vacancy_list,
        "skip": skip,
        "limit": limit
    }
