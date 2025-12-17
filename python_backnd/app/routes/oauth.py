"""
OAuth routes - Google and Facebook authentication
"""

from fastapi import APIRouter, HTTPException, status, Query
from fastapi.responses import RedirectResponse
from datetime import datetime
import httpx
from typing import Optional

from app.config import settings
from app.database import get_users_collection
from app.schemas.auth import LoginResponse
from app.models.user import UserRole, AuthProvider, user_helper
from app.utils.security import create_tokens_for_user


router = APIRouter()


# ============ GOOGLE OAUTH ============

@router.get("/google/login")
async def google_login():
    """Redirect to Google OAuth"""
    if not settings.GOOGLE_CLIENT_ID:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Google OAuth not configured"
        )
    
    google_auth_url = (
        "https://accounts.google.com/o/oauth2/v2/auth?"
        f"client_id={settings.GOOGLE_CLIENT_ID}&"
        f"redirect_uri={settings.GOOGLE_REDIRECT_URI}&"
        "response_type=code&"
        "scope=email%20profile&"
        "access_type=offline"
    )
    
    return {"auth_url": google_auth_url}


@router.get("/google/callback")
async def google_callback(code: str = Query(...)):
    """Handle Google OAuth callback"""
    if not settings.GOOGLE_CLIENT_ID or not settings.GOOGLE_CLIENT_SECRET:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Google OAuth not configured"
        )
    
    # Exchange code for tokens
    async with httpx.AsyncClient() as client:
        token_response = await client.post(
            "https://oauth2.googleapis.com/token",
            data={
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "code": code,
                "grant_type": "authorization_code",
                "redirect_uri": settings.GOOGLE_REDIRECT_URI
            }
        )
    
    if token_response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to exchange code for token"
        )
    
    token_data = token_response.json()
    access_token = token_data.get("access_token")
    
    # Get user info
    async with httpx.AsyncClient() as client:
        user_response = await client.get(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            headers={"Authorization": f"Bearer {access_token}"}
        )
    
    if user_response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to get user info from Google"
        )
    
    google_user = user_response.json()
    
    # Find or create user
    users = get_users_collection()
    user = await users.find_one({"email": google_user["email"]})
    
    if user:
        # Update provider info if needed
        if user.get("auth_provider") == AuthProvider.LOCAL.value:
            await users.update_one(
                {"_id": user["_id"]},
                {
                    "$set": {
                        "provider_id": google_user["id"],
                        "profile_image": google_user.get("picture"),
                        "email_verified": True,
                        "updated_at": datetime.utcnow(),
                        "last_login": datetime.utcnow()
                    }
                }
            )
        else:
            await users.update_one(
                {"_id": user["_id"]},
                {"$set": {"last_login": datetime.utcnow()}}
            )
        
        user = await users.find_one({"_id": user["_id"]})
    else:
        # Create new user
        user_doc = {
            "name": google_user.get("name", google_user["email"].split("@")[0]),
            "email": google_user["email"],
            "phone": None,
            "role": UserRole.USER.value,
            "auth_provider": AuthProvider.GOOGLE.value,
            "provider_id": google_user["id"],
            "profile_image": google_user.get("picture"),
            "is_verified": True,
            "is_active": True,
            "email_verified": True,
            "phone_verified": False,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "last_login": datetime.utcnow()
        }
        
        result = await users.insert_one(user_doc)
        user_doc["_id"] = result.inserted_id
        user = user_doc
    
    # Generate tokens
    tokens = create_tokens_for_user(user)
    
    # Redirect to frontend with tokens
    redirect_url = (
        f"{settings.FRONTEND_URL}/auth/callback/google?"
        f"access_token={tokens['access_token']}&"
        f"refresh_token={tokens['refresh_token']}"
    )
    
    return RedirectResponse(url=redirect_url)


# ============ FACEBOOK OAUTH ============

@router.get("/facebook/login")
async def facebook_login():
    """Redirect to Facebook OAuth"""
    if not settings.FACEBOOK_APP_ID:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Facebook OAuth not configured"
        )
    
    facebook_auth_url = (
        "https://www.facebook.com/v18.0/dialog/oauth?"
        f"client_id={settings.FACEBOOK_APP_ID}&"
        f"redirect_uri={settings.FACEBOOK_REDIRECT_URI}&"
        "scope=email,public_profile"
    )
    
    return {"auth_url": facebook_auth_url}


@router.get("/facebook/callback")
async def facebook_callback(code: str = Query(...)):
    """Handle Facebook OAuth callback"""
    if not settings.FACEBOOK_APP_ID or not settings.FACEBOOK_APP_SECRET:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Facebook OAuth not configured"
        )
    
    # Exchange code for token
    async with httpx.AsyncClient() as client:
        token_response = await client.get(
            "https://graph.facebook.com/v18.0/oauth/access_token",
            params={
                "client_id": settings.FACEBOOK_APP_ID,
                "client_secret": settings.FACEBOOK_APP_SECRET,
                "code": code,
                "redirect_uri": settings.FACEBOOK_REDIRECT_URI
            }
        )
    
    if token_response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to exchange code for token"
        )
    
    token_data = token_response.json()
    access_token = token_data.get("access_token")
    
    # Get user info
    async with httpx.AsyncClient() as client:
        user_response = await client.get(
            "https://graph.facebook.com/me",
            params={
                "fields": "id,name,email,picture.type(large)",
                "access_token": access_token
            }
        )
    
    if user_response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to get user info from Facebook"
        )
    
    fb_user = user_response.json()
    
    if not fb_user.get("email"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email not provided by Facebook. Please ensure your Facebook account has a verified email."
        )
    
    # Find or create user
    users = get_users_collection()
    user = await users.find_one({"email": fb_user["email"]})
    
    profile_picture = None
    if fb_user.get("picture", {}).get("data", {}).get("url"):
        profile_picture = fb_user["picture"]["data"]["url"]
    
    if user:
        # Update provider info if needed
        await users.update_one(
            {"_id": user["_id"]},
            {
                "$set": {
                    "last_login": datetime.utcnow()
                }
            }
        )
        
        if user.get("auth_provider") == AuthProvider.LOCAL.value:
            await users.update_one(
                {"_id": user["_id"]},
                {
                    "$set": {
                        "provider_id": fb_user["id"],
                        "profile_image": profile_picture,
                        "email_verified": True,
                        "updated_at": datetime.utcnow()
                    }
                }
            )
        
        user = await users.find_one({"_id": user["_id"]})
    else:
        # Create new user
        user_doc = {
            "name": fb_user.get("name", fb_user["email"].split("@")[0]),
            "email": fb_user["email"],
            "phone": None,
            "role": UserRole.USER.value,
            "auth_provider": AuthProvider.FACEBOOK.value,
            "provider_id": fb_user["id"],
            "profile_image": profile_picture,
            "is_verified": True,
            "is_active": True,
            "email_verified": True,
            "phone_verified": False,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "last_login": datetime.utcnow()
        }
        
        result = await users.insert_one(user_doc)
        user_doc["_id"] = result.inserted_id
        user = user_doc
    
    # Generate tokens
    tokens = create_tokens_for_user(user)
    
    # Redirect to frontend with tokens
    redirect_url = (
        f"{settings.FRONTEND_URL}/auth/callback/facebook?"
        f"access_token={tokens['access_token']}&"
        f"refresh_token={tokens['refresh_token']}"
    )
    
    return RedirectResponse(url=redirect_url)
