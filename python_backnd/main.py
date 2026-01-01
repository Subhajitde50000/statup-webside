"""
Electronics Authentication Backend
FastAPI with MongoDB, JWT, OAuth, OTP, RBAC, and Real-time Notifications
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
from pathlib import Path
import socketio

from app.database import connect_to_mongo, close_mongo_connection
from app.routes import auth, users, oauth, vacancies, applications, verifications, upload, subscriptions
from app.routes import services, offers, favorites, professionals, notifications
from app.socket_manager import sio


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application lifecycle - connect/disconnect from MongoDB"""
    await connect_to_mongo()
    yield
    await close_mongo_connection()


app = FastAPI(
    title="Electronics Auth API",
    description="Authentication API with OTP, JWT, OAuth, RBAC, and Real-time Notifications",
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
app.include_router(services.router, prefix="/api/services", tags=["Services"])
app.include_router(subscriptions.router, prefix="/api/subscriptions", tags=["Subscriptions"])
app.include_router(offers.router, prefix="/api/offers", tags=["Offers"])
app.include_router(favorites.router, prefix="/api", tags=["Favorites"])
app.include_router(professionals.router, prefix="/api", tags=["Professionals"])
app.include_router(notifications.router, prefix="/api", tags=["Notifications"])

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


# Create combined ASGI app with Socket.IO
socket_app = socketio.ASGIApp(sio, other_asgi_app=app)
