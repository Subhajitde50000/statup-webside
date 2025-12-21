"""
File upload routes for documents
"""

from fastapi import APIRouter, UploadFile, File, HTTPException, status
from typing import List
import os
import uuid
from pathlib import Path
import shutil

router = APIRouter(prefix="/upload", tags=["Upload"])

# Create uploads directory if it doesn't exist
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# Subdirectories for different document types
(UPLOAD_DIR / "verification_documents").mkdir(exist_ok=True)
(UPLOAD_DIR / "profile_images").mkdir(exist_ok=True)

# Allowed file extensions
ALLOWED_EXTENSIONS = {".pdf", ".jpg", ".jpeg", ".png"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB


def validate_file(file: UploadFile) -> None:
    """Validate uploaded file"""
    
    # Check file extension
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        )


def save_upload_file(upload_file: UploadFile, destination: Path) -> str:
    """Save uploaded file to destination"""
    try:
        with destination.open("wb") as buffer:
            shutil.copyfileobj(upload_file.file, buffer)
        return str(destination)
    finally:
        upload_file.file.close()


@router.post("/document")
async def upload_document(file: UploadFile = File(...)):
    """Upload a single verification document"""
    
    # Validate file
    validate_file(file)
    
    # Generate unique filename
    file_ext = os.path.splitext(file.filename)[1].lower()
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = UPLOAD_DIR / "verification_documents" / unique_filename
    
    # Save file
    save_upload_file(file, file_path)
    
    # Return file URL/path
    return {
        "filename": unique_filename,
        "original_filename": file.filename,
        "file_path": f"/uploads/verification_documents/{unique_filename}",
        "file_size": os.path.getsize(file_path)
    }


@router.post("/documents")
async def upload_multiple_documents(files: List[UploadFile] = File(...)):
    """Upload multiple verification documents"""
    
    if len(files) > 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Maximum 10 files allowed"
        )
    
    uploaded_files = []
    
    for file in files:
        # Validate file
        validate_file(file)
        
        # Generate unique filename
        file_ext = os.path.splitext(file.filename)[1].lower()
        unique_filename = f"{uuid.uuid4()}{file_ext}"
        file_path = UPLOAD_DIR / "verification_documents" / unique_filename
        
        # Save file
        save_upload_file(file, file_path)
        
        uploaded_files.append({
            "filename": unique_filename,
            "original_filename": file.filename,
            "file_path": f"/uploads/verification_documents/{unique_filename}",
            "file_size": os.path.getsize(file_path)
        })
    
    return {
        "message": f"Successfully uploaded {len(uploaded_files)} file(s)",
        "files": uploaded_files
    }


@router.post("/profile-image")
async def upload_profile_image(file: UploadFile = File(...)):
    """Upload profile image"""
    
    # Validate file (only images)
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in {".jpg", ".jpeg", ".png"}:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid image type. Allowed: .jpg, .jpeg, .png"
        )
    
    # Generate unique filename
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = UPLOAD_DIR / "profile_images" / unique_filename
    
    # Save file
    save_upload_file(file, file_path)
    
    return {
        "filename": unique_filename,
        "original_filename": file.filename,
        "file_path": f"/uploads/profile_images/{unique_filename}",
        "file_size": os.path.getsize(file_path)
    }
