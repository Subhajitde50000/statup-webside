"""
Job Application routes - Create, Read, Update applications
"""

from fastapi import APIRouter, HTTPException, status, Depends
from typing import List, Optional
from datetime import datetime
from bson import ObjectId

from app.database import get_database
from app.models.application import ApplicationCreate, ApplicationUpdate, application_helper
from app.models.user import UserRole
from app.utils.security import get_current_user
from app.middleware.rbac import require_roles
from app.utils.email import send_application_status_update


router = APIRouter()


async def get_applications_collection():
    """Get applications collection from database"""
    db = get_database()
    return db["applications"]


async def get_vacancies_collection():
    """Get vacancies collection from database"""
    db = get_database()
    return db["vacancies"]


# ============ CREATE APPLICATION ============

@router.post("/", response_model=dict, status_code=status.HTTP_201_CREATED)
async def submit_application(
    application_data: ApplicationCreate
):
    """Submit a job application (Public - no authentication required)"""
    applications = await get_applications_collection()
    vacancies = await get_vacancies_collection()
    
    # Validate vacancy exists
    if not ObjectId.is_valid(application_data.vacancy_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid vacancy ID"
        )
    
    vacancy = await vacancies.find_one({"_id": ObjectId(application_data.vacancy_id)})
    if not vacancy:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vacancy not found"
        )
    
    # Check if user already applied
    existing_application = await applications.find_one({
        "vacancy_id": ObjectId(application_data.vacancy_id),
        "email": application_data.email
    })
    
    if existing_application:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This email has already been used to apply for this position"
        )
    
    # Create application document
    application_doc = {
        **application_data.model_dump(exclude={"vacancy_id"}),
        "vacancy_id": ObjectId(application_data.vacancy_id),
        "vacancy_title": vacancy["job_title"],
        "user_id": None,  # No authentication required
        "stage": "Under Review",
        "score": 0.0,
        "status": "pending",
        "notes": "",
        "applied_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    # Insert application
    result = await applications.insert_one(application_doc)
    application_doc["_id"] = result.inserted_id
    
    # Update vacancy applicant count
    await vacancies.update_one(
        {"_id": ObjectId(application_data.vacancy_id)},
        {"$inc": {"applicant_count": 1}}
    )
    
    return {
        "message": "Application submitted successfully",
        "application": application_helper(application_doc)
    }


# ============ GET ALL APPLICATIONS (ADMIN) ============

@router.get("/admin/list", response_model=dict)
async def get_all_applications(
    stage: Optional[str] = None,
    vacancy_id: Optional[str] = None,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    current_user: dict = Depends(require_roles([UserRole.ADMIN, UserRole.MANAGER]))
):
    """Get all applications for admin dashboard"""
    applications = await get_applications_collection()
    
    # Build query
    query = {}
    
    if stage:
        query["stage"] = stage
    
    if vacancy_id and ObjectId.is_valid(vacancy_id):
        query["vacancy_id"] = ObjectId(vacancy_id)
    
    if search:
        query["$or"] = [
            {"first_name": {"$regex": search, "$options": "i"}},
            {"last_name": {"$regex": search, "$options": "i"}},
            {"email": {"$regex": search, "$options": "i"}},
            {"phone": {"$regex": search, "$options": "i"}}
        ]
    
    # Get total count
    total = await applications.count_documents(query)
    
    # Get applications
    cursor = applications.find(query).sort("applied_at", -1).skip(skip).limit(limit)
    applications_list = []
    
    async for app in cursor:
        applications_list.append(application_helper(app))
    
    return {
        "total": total,
        "applications": applications_list,
        "skip": skip,
        "limit": limit
    }


# ============ GET APPLICATION BY ID ============

@router.get("/{application_id}", response_model=dict)
async def get_application_by_id(
    application_id: str,
    current_user: dict = Depends(require_roles([UserRole.ADMIN, UserRole.MANAGER]))
):
    """Get specific application details (Admin/Manager only)"""
    applications = await get_applications_collection()
    
    if not ObjectId.is_valid(application_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid application ID"
        )
    
    application = await applications.find_one({"_id": ObjectId(application_id)})
    
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )
    
    return {
        "application": application_helper(application)
    }


# ============ UPDATE APPLICATION ============

@router.put("/{application_id}", response_model=dict)
async def update_application(
    application_id: str,
    application_data: ApplicationUpdate,
    current_user: dict = Depends(require_roles([UserRole.ADMIN, UserRole.MANAGER]))
):
    """Update application stage/score/notes (Admin/Manager only)"""
    applications = await get_applications_collection()
    
    if not ObjectId.is_valid(application_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid application ID"
        )
    
    # Get existing application
    existing_app = await applications.find_one({"_id": ObjectId(application_id)})
    if not existing_app:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )
    
    # Update only provided fields
    update_data = {k: v for k, v in application_data.model_dump(exclude_unset=True).items()}
    
    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No data to update"
        )
    
    update_data["updated_at"] = datetime.utcnow()
    
    # Check if stage is being updated (for email notification)
    old_stage = existing_app.get("stage")
    new_stage = update_data.get("stage")
    stage_changed = new_stage and new_stage != old_stage
    
    # Update application
    await applications.update_one(
        {"_id": ObjectId(application_id)},
        {"$set": update_data}
    )
    
    # Get updated application
    updated_app = await applications.find_one({"_id": ObjectId(application_id)})
    
    # Send email notification if stage changed
    if stage_changed:
        try:
            send_application_status_update(
                applicant_email=updated_app["email"],
                applicant_name=f"{updated_app['first_name']} {updated_app['last_name']}",
                vacancy_title=updated_app["vacancy_title"],
                old_stage=old_stage,
                new_stage=new_stage,
                notes=update_data.get("notes"),
                salary=updated_app.get("expected_salary")
            )
        except Exception as e:
            # Log error but don't fail the update
            print(f"Error sending email notification: {str(e)}")
    
    return {
        "message": "Application updated successfully",
        "application": application_helper(updated_app)
    }


# ============ GET USER'S APPLICATIONS ============

@router.get("/user/my-applications", response_model=dict)
async def get_my_applications(
    current_user: dict = Depends(get_current_user)
):
    """Get current user's job applications"""
    applications = await get_applications_collection()
    
    cursor = applications.find({"user_id": current_user["_id"]}).sort("applied_at", -1)
    applications_list = []
    
    async for app in cursor:
        applications_list.append(application_helper(app))
    
    return {
        "total": len(applications_list),
        "applications": applications_list
    }
