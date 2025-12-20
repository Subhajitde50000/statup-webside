"""
Vacancy model for MongoDB
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from bson import ObjectId


class VacancyBase(BaseModel):
    job_title: str = Field(..., min_length=3, max_length=200)
    role_level: str
    department: str
    hiring_for: str
    employment_type: str
    positions: int = Field(ge=1)
    salary_min: int
    salary_max: int
    location: str
    description: str
    responsibilities: List[str] = []
    skills: List[str] = []
    experience: str
    auto_close: bool = True
    ai_screening: bool = False
    priority: str = "medium"
    posting_type: str = "both"  # internal, external, both


class VacancyCreate(VacancyBase):
    pass


class VacancyUpdate(BaseModel):
    job_title: Optional[str] = None
    role_level: Optional[str] = None
    department: Optional[str] = None
    hiring_for: Optional[str] = None
    employment_type: Optional[str] = None
    positions: Optional[int] = None
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    location: Optional[str] = None
    description: Optional[str] = None
    responsibilities: Optional[List[str]] = None
    skills: Optional[List[str]] = None
    experience: Optional[str] = None
    auto_close: Optional[bool] = None
    ai_screening: Optional[bool] = None
    priority: Optional[str] = None
    posting_type: Optional[str] = None
    status: Optional[str] = None


class VacancyInDB(VacancyBase):
    id: str
    created_by: str
    created_by_name: str
    created_at: datetime
    updated_at: datetime
    status: str = "open"  # open, closed, filled, draft
    applicant_count: int = 0
    
    class Config:
        json_schema_extra = {
            "example": {
                "job_title": "Service Professional - Plumber",
                "role_level": "Mid Level",
                "department": "Operations",
                "hiring_for": "Service Professional",
                "employment_type": "Full-time",
                "positions": 5,
                "salary_min": 25000,
                "salary_max": 40000,
                "location": "Mumbai, Pune",
                "description": "We are looking for skilled plumbers...",
                "responsibilities": ["Perform repairs", "Diagnose issues"],
                "skills": ["Plumbing", "Customer service"],
                "experience": "3-5 years",
                "status": "open"
            }
        }


def vacancy_helper(vacancy) -> dict:
    """Convert MongoDB vacancy document to dict"""
    return {
        "id": str(vacancy["_id"]),
        "job_title": vacancy["job_title"],
        "role_level": vacancy["role_level"],
        "department": vacancy["department"],
        "hiring_for": vacancy["hiring_for"],
        "employment_type": vacancy["employment_type"],
        "positions": vacancy["positions"],
        "salary_min": vacancy["salary_min"],
        "salary_max": vacancy["salary_max"],
        "location": vacancy["location"],
        "description": vacancy["description"],
        "responsibilities": vacancy.get("responsibilities", []),
        "skills": vacancy.get("skills", []),
        "experience": vacancy["experience"],
        "auto_close": vacancy.get("auto_close", True),
        "ai_screening": vacancy.get("ai_screening", False),
        "priority": vacancy.get("priority", "medium"),
        "posting_type": vacancy.get("posting_type", "both"),
        "status": vacancy.get("status", "open"),
        "created_by": str(vacancy["created_by"]),
        "created_by_name": vacancy.get("created_by_name", "Unknown"),
        "created_at": vacancy["created_at"].isoformat() if isinstance(vacancy["created_at"], datetime) else vacancy["created_at"],
        "updated_at": vacancy["updated_at"].isoformat() if isinstance(vacancy["updated_at"], datetime) else vacancy["updated_at"],
        "applicant_count": vacancy.get("applicant_count", 0),
    }
