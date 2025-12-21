"""
Job Application models
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from bson import ObjectId


class ApplicationCreate(BaseModel):
    vacancy_id: str
    first_name: str
    last_name: str
    email: EmailStr
    phone: str
    current_location: str
    date_of_birth: Optional[str] = None
    
    # Professional
    current_company: Optional[str] = None
    current_designation: Optional[str] = None
    total_experience: str
    current_salary: Optional[str] = None
    expected_salary: str
    notice_period: str
    
    # Education
    highest_qualification: str
    university: Optional[str] = None
    graduation_year: Optional[str] = None
    cgpa: Optional[str] = None
    
    # Additional
    cover_letter: Optional[str] = None
    portfolio: Optional[str] = None
    github: Optional[str] = None
    linkedin: Optional[str] = None
    twitter: Optional[str] = None
    
    # Preferences
    willing_to_relocate: bool = False
    available_for_interview: bool = True


class ApplicationUpdate(BaseModel):
    stage: Optional[str] = None
    score: Optional[float] = None
    notes: Optional[str] = None
    status: Optional[str] = None


class ApplicationInDB(BaseModel):
    id: str
    vacancy_id: str
    vacancy_title: str
    first_name: str
    last_name: str
    email: str
    phone: str
    current_location: str
    total_experience: str
    expected_salary: str
    notice_period: str
    highest_qualification: str
    stage: str
    score: float
    status: str
    applied_at: datetime
    updated_at: datetime
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat(),
        }


def application_helper(application: dict) -> dict:
    """Convert MongoDB application document to dict"""
    return {
        "id": str(application["_id"]),
        "vacancy_id": str(application["vacancy_id"]),
        "vacancy_title": application.get("vacancy_title", ""),
        "first_name": application["first_name"],
        "last_name": application["last_name"],
        "full_name": f"{application['first_name']} {application['last_name']}",
        "email": application["email"],
        "phone": application["phone"],
        "current_location": application["current_location"],
        "date_of_birth": application.get("date_of_birth"),
        
        # Professional
        "current_company": application.get("current_company"),
        "current_designation": application.get("current_designation"),
        "total_experience": application["total_experience"],
        "current_salary": application.get("current_salary"),
        "expected_salary": application["expected_salary"],
        "notice_period": application["notice_period"],
        
        # Education
        "highest_qualification": application["highest_qualification"],
        "university": application.get("university"),
        "graduation_year": application.get("graduation_year"),
        "cgpa": application.get("cgpa"),
        
        # Additional
        "cover_letter": application.get("cover_letter"),
        "portfolio": application.get("portfolio"),
        "github": application.get("github"),
        "linkedin": application.get("linkedin"),
        "twitter": application.get("twitter"),
        
        # Preferences
        "willing_to_relocate": application.get("willing_to_relocate", False),
        "available_for_interview": application.get("available_for_interview", True),
        
        # Tracking
        "stage": application.get("stage", "Under Review"),
        "score": application.get("score", 0.0),
        "status": application.get("status", "pending"),
        "notes": application.get("notes", ""),
        "applied_at": application["applied_at"].isoformat() if isinstance(application["applied_at"], datetime) else application["applied_at"],
        "updated_at": application["updated_at"].isoformat() if isinstance(application["updated_at"], datetime) else application["updated_at"],
        
        # User tracking
        "user_id": str(application["user_id"]) if application.get("user_id") else None,
    }
