"""
Electronics Authentication Backend
FastAPI with MongoDB, JWT, OAuth, OTP, and RBAC
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
from pathlib import Path

from app.database import connect_to_mongo, close_mongo_connection
from app.routes import auth, users, oauth, vacancies, applications, verifications, upload


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application lifecycle - connect/disconnect from MongoDB"""
    await connect_to_mongo()
    yield
    await close_mongo_connection()


app = FastAPI(
    title="Electronics Auth API",
    description="Authentication API with OTP, JWT, OAuth, and Role-Based Access Control",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(oauth.router, prefix="/api/oauth", tags=["OAuth"])
app.include_router(vacancies.router, prefix="/api/vacancies", tags=["Vacancies"])
app.include_router(applications.router, prefix="/api/applications", tags=["Applications"])
app.include_router(verifications.router, prefix="/api", tags=["Verifications"])
app.include_router(upload.router, prefix="/api", tags=["Upload"])

# Mount static files for uploads
uploads_dir = Path("uploads")
uploads_dir.mkdir(exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


@app.get("/")
async def root():
    return {"message": "Electronics Auth API", "status": "running"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
