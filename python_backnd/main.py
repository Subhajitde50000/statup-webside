"""
Electronics Authentication Backend
FastAPI with MongoDB, JWT, OAuth, OTP, and RBAC
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.database import connect_to_mongo, close_mongo_connection
from app.routes import auth, users, oauth


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
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(oauth.router, prefix="/api/oauth", tags=["OAuth"])


@app.get("/")
async def root():
    return {"message": "Electronics Auth API", "status": "running"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
