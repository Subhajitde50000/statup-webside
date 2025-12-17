"""
Authentication routes - Signup, Login, OTP, Password Reset
"""

from fastapi import APIRouter, HTTPException, status, Depends
from datetime import datetime
from bson import ObjectId

from app.database import get_users_collection, get_otps_collection
from app.schemas.auth import (
    SignupRequest, SignupResponse,
    LoginRequest, LoginWithOTPRequest, LoginResponse,
    SendOTPRequest, VerifyOTPRequest, VerifyOTPResponse, ResendOTPRequest,
    ForgotPasswordRequest, ForgotPasswordResponse,
    ResetPasswordRequest, ResetPasswordResponse,
    RefreshTokenRequest, TokenResponse,
    MessageResponse
)
from app.models.user import UserRole, AuthProvider, user_helper
from app.models.otp import OTPPurpose, OTPType
from app.utils.security import (
    hash_password, verify_password, 
    create_tokens_for_user, refresh_access_token,
    get_current_user
)
from app.utils.otp import create_otp, verify_otp, send_otp


router = APIRouter()


# ============ SIGNUP ============

@router.post("/signup", response_model=SignupResponse)
async def signup(request: SignupRequest):
    """Register a new user with email/phone and password"""
    users = get_users_collection()
    print("Users collection:", users)
    print(users)
    
    # Check if email already exists
    existing_email = await users.find_one({"email": request.email})
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Check if phone already exists
    existing_phone = await users.find_one({"phone": request.phone})
    if existing_phone:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Phone number already registered"
        )
    
    # Store user data temporarily with OTP
    user_data = {
        "name": request.name,
        "email": request.email,
        "phone": request.phone,
        "hashed_password": hash_password(request.password),
        "role": UserRole.USER.value,
        "auth_provider": AuthProvider.LOCAL.value,
    }
    
    # Generate OTP code (same for both email and phone)
    otp_code = await create_otp(
        identifier=request.phone,
        otp_type=OTPType.PHONE,
        purpose=OTPPurpose.SIGNUP,
        user_data=user_data
    )
    print("Generated OTP Code:", otp_code)
    
    # Also create OTP for email with same code
    if request.email:
        await create_otp(
            identifier=request.email,
            otp_type=OTPType.EMAIL,
            purpose=OTPPurpose.SIGNUP,
            user_data=user_data,
            otp_code=otp_code  # Use same OTP code
        )
    
    # Send OTP via SMS
    await send_otp(request.phone, otp_code, OTPType.PHONE)
    
    # Send OTP via Email if available
    if request.email:
        await send_otp(request.email, otp_code, OTPType.EMAIL)
    
    return SignupResponse(
        message="OTP sent to your phone and email. Please verify to complete registration.",
        requires_otp=True,
        otp_sent_to=f"Phone: ***{request.phone[-4:]} and Email: {request.email[:2]}***"
    )


@router.post("/signup/verify", response_model=LoginResponse)
async def verify_signup(request: VerifyOTPRequest):
    """Verify OTP and complete signup"""
    # Verify OTP
    result = await verify_otp(
        identifier=request.identifier,
        otp_code=request.otp_code,
        purpose=OTPPurpose.SIGNUP
    )
    
    if not result["valid"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result["error"]
        )
    
    user_data = result.get("user_data")
    if not user_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid signup session. Please signup again."
        )
    
    users = get_users_collection()
    
    # Create user document
    user_doc = {
        **user_data,
        "is_verified": True,
        "is_active": True,
        "phone_verified": True,  # Phone is verified since OTP was sent to both
        "email_verified": True,   # Email is verified since same OTP was sent
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "last_login": datetime.utcnow(),
    }
    
    # Insert user
    result = await users.insert_one(user_doc)
    user_doc["_id"] = result.inserted_id
    
    # Generate tokens
    tokens = create_tokens_for_user(user_doc)
    
    return LoginResponse(
        message="Account created successfully",
        access_token=tokens["access_token"],
        refresh_token=tokens["refresh_token"],
        token_type="bearer",
        user=user_helper(user_doc),
        requires_otp=False
    )


# ============ LOGIN ============

@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    """Login with email/phone and password"""
    users = get_users_collection()
    
    # Find user by email or phone
    if request.login_method.value == "email":
        user = await users.find_one({"email": request.identifier})
    else:
        user = await users.find_one({"phone": request.identifier})
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    # Check if user has a password (could be OAuth user)
    if not user.get("hashed_password"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please login with Google or Facebook"
        )
    
    # Verify password
    if not verify_password(request.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    # Check if user is active
    if not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account is deactivated"
        )
    
    # Update last login
    await users.update_one(
        {"_id": user["_id"]},
        {"$set": {"last_login": datetime.utcnow()}}
    )
    
    # Generate tokens
    tokens = create_tokens_for_user(user)
    
    return LoginResponse(
        message="Login successful",
        access_token=tokens["access_token"],
        refresh_token=tokens["refresh_token"],
        token_type="bearer",
        user=user_helper(user),
        requires_otp=False
    )


@router.post("/login/otp/send", response_model=MessageResponse)
async def send_login_otp(request: LoginWithOTPRequest):
    """Send OTP for login"""
    users = get_users_collection()
    
    # Find user by email or phone
    if request.login_method.value == "email":
        user = await users.find_one({"email": request.identifier})
        otp_type = OTPType.EMAIL
    else:
        user = await users.find_one({"phone": request.identifier})
        otp_type = OTPType.PHONE
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found. Please signup first."
        )
    
    # Check if user is active
    if not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account is deactivated"
        )
    
    # Create and send OTP
    otp_code = await create_otp(
        identifier=request.identifier,
        otp_type=otp_type,
        purpose=OTPPurpose.LOGIN,
        user_data={"user_id": str(user["_id"])}
    )
    
    await send_otp(request.identifier, otp_code, otp_type)
    
    return MessageResponse(
        message=f"OTP sent to {request.identifier[-4:].rjust(len(request.identifier), '*')}",
        success=True
    )


@router.post("/login/otp/verify", response_model=LoginResponse)
async def verify_login_otp(request: VerifyOTPRequest):
    """Verify OTP and login"""
    # Verify OTP
    result = await verify_otp(
        identifier=request.identifier,
        otp_code=request.otp_code,
        purpose=OTPPurpose.LOGIN
    )
    
    if not result["valid"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result["error"]
        )
    
    user_data = result.get("user_data")
    if not user_data or not user_data.get("user_id"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid login session"
        )
    
    users = get_users_collection()
    user = await users.find_one({"_id": ObjectId(user_data["user_id"])})
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Update last login
    await users.update_one(
        {"_id": user["_id"]},
        {"$set": {"last_login": datetime.utcnow()}}
    )
    
    # Generate tokens
    tokens = create_tokens_for_user(user)
    
    return LoginResponse(
        message="Login successful",
        access_token=tokens["access_token"],
        refresh_token=tokens["refresh_token"],
        token_type="bearer",
        user=user_helper(user),
        requires_otp=False
    )


# ============ PASSWORD RESET ============

@router.post("/forgot-password", response_model=ForgotPasswordResponse)
async def forgot_password(request: ForgotPasswordRequest):
    """Send OTP for password reset"""
    users = get_users_collection()
    
    # Find user
    if request.reset_method.value == "email":
        user = await users.find_one({"email": request.identifier})
        otp_type = OTPType.EMAIL
    else:
        user = await users.find_one({"phone": request.identifier})
        otp_type = OTPType.PHONE
    
    if not user:
        # Don't reveal if user exists
        return ForgotPasswordResponse(
            message="If the account exists, OTP has been sent",
            otp_sent_to=request.identifier[-4:].rjust(len(request.identifier), '*')
        )
    
    # Create and send OTP
    otp_code = await create_otp(
        identifier=request.identifier,
        otp_type=otp_type,
        purpose=OTPPurpose.PASSWORD_RESET,
        user_data={"user_id": str(user["_id"])}
    )
    
    await send_otp(request.identifier, otp_code, otp_type)
    
    return ForgotPasswordResponse(
        message="OTP sent successfully",
        otp_sent_to=request.identifier[-4:].rjust(len(request.identifier), '*')
    )


@router.post("/reset-password", response_model=ResetPasswordResponse)
async def reset_password(request: ResetPasswordRequest):
    """Reset password with OTP verification"""
    # Verify OTP
    result = await verify_otp(
        identifier=request.identifier,
        otp_code=request.otp_code,
        purpose=OTPPurpose.PASSWORD_RESET
    )
    
    if not result["valid"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result["error"]
        )
    
    user_data = result.get("user_data")
    if not user_data or not user_data.get("user_id"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid reset session"
        )
    
    users = get_users_collection()
    
    # Update password
    new_hashed_password = hash_password(request.new_password)
    
    await users.update_one(
        {"_id": ObjectId(user_data["user_id"])},
        {
            "$set": {
                "hashed_password": new_hashed_password,
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    return ResetPasswordResponse(
        message="Password reset successfully",
        success=True
    )


# ============ OTP GENERAL ============

@router.post("/otp/send", response_model=MessageResponse)
async def send_otp_general(request: SendOTPRequest):
    """General OTP sending endpoint"""
    otp_type = OTPType.EMAIL if request.otp_type == "email" else OTPType.PHONE
    
    purpose_map = {
        "login": OTPPurpose.LOGIN,
        "signup": OTPPurpose.SIGNUP,
        "password_reset": OTPPurpose.PASSWORD_RESET,
        "email_verification": OTPPurpose.EMAIL_VERIFICATION,
        "phone_verification": OTPPurpose.PHONE_VERIFICATION,
    }
    
    purpose = purpose_map.get(request.purpose, OTPPurpose.LOGIN)
    
    otp_code = await create_otp(
        identifier=request.identifier,
        otp_type=otp_type,
        purpose=purpose
    )
    
    await send_otp(request.identifier, otp_code, otp_type)
    
    return MessageResponse(
        message=f"OTP sent to {request.identifier[-4:].rjust(len(request.identifier), '*')}",
        success=True
    )


@router.post("/otp/resend", response_model=MessageResponse)
async def resend_otp(request: ResendOTPRequest):
    """Resend OTP"""
    return await send_otp_general(SendOTPRequest(
        identifier=request.identifier,
        otp_type=request.otp_type,
        purpose=request.purpose
    ))


# ============ TOKEN REFRESH ============

@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(request: RefreshTokenRequest):
    """Refresh access token"""
    tokens = await refresh_access_token(request.refresh_token)
    return TokenResponse(**tokens)


# ============ LOGOUT ============

@router.post("/logout", response_model=MessageResponse)
async def logout(current_user: dict = Depends(get_current_user)):
    """Logout user (client should discard tokens)"""
    # In a more complete implementation, you could:
    # 1. Add the token to a blacklist
    # 2. Delete refresh token from database
    
    return MessageResponse(
        message="Logged out successfully",
        success=True
    )


# ============ CURRENT USER ============

@router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    """Get current authenticated user"""
    return user_helper(current_user)
