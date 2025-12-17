"""
Authentication schemas for request/response validation
"""

from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional
from enum import Enum
import re


class LoginMethod(str, Enum):
    EMAIL = "email"
    PHONE = "phone"


# ============ SIGNUP SCHEMAS ============

class SignupRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: str = Field(..., min_length=10, max_length=15)
    password: str = Field(..., min_length=6, max_length=50)
    
    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v):
        # Remove non-digit characters
        digits = re.sub(r'\D', '', v)
        if len(digits) < 10:
            raise ValueError("Phone number must be at least 10 digits")
        return digits


class SignupResponse(BaseModel):
    message: str
    requires_otp: bool = True
    otp_sent_to: str  # email or phone


# ============ LOGIN SCHEMAS ============

class LoginRequest(BaseModel):
    identifier: str  # email or phone
    password: str = Field(..., min_length=1)
    login_method: LoginMethod = LoginMethod.PHONE


class LoginWithOTPRequest(BaseModel):
    identifier: str  # email or phone
    login_method: LoginMethod = LoginMethod.PHONE


class LoginResponse(BaseModel):
    message: str
    access_token: Optional[str] = None
    refresh_token: Optional[str] = None
    token_type: str = "bearer"
    user: Optional[dict] = None
    requires_otp: bool = False


# ============ OTP SCHEMAS ============

class SendOTPRequest(BaseModel):
    identifier: str  # email or phone
    otp_type: str = "phone"  # "email" or "phone"
    purpose: str = "login"  # "signup", "login", "password_reset"


class VerifyOTPRequest(BaseModel):
    identifier: str
    otp_code: str = Field(..., min_length=6, max_length=6)
    purpose: str = "login"


class VerifyOTPResponse(BaseModel):
    message: str
    success: bool
    access_token: Optional[str] = None
    refresh_token: Optional[str] = None
    user: Optional[dict] = None


class ResendOTPRequest(BaseModel):
    identifier: str
    otp_type: str = "phone"
    purpose: str = "login"


# ============ PASSWORD RESET SCHEMAS ============

class ForgotPasswordRequest(BaseModel):
    identifier: str  # email or phone
    reset_method: LoginMethod = LoginMethod.EMAIL


class ForgotPasswordResponse(BaseModel):
    message: str
    otp_sent_to: str


class ResetPasswordRequest(BaseModel):
    identifier: str
    otp_code: str = Field(..., min_length=6, max_length=6)
    new_password: str = Field(..., min_length=6, max_length=50)
    confirm_password: str = Field(..., min_length=6, max_length=50)
    
    @field_validator("confirm_password")
    @classmethod
    def passwords_match(cls, v, info):
        if "new_password" in info.data and v != info.data["new_password"]:
            raise ValueError("Passwords do not match")
        return v


class ResetPasswordResponse(BaseModel):
    message: str
    success: bool


# ============ TOKEN SCHEMAS ============

class TokenData(BaseModel):
    user_id: str
    email: Optional[str] = None
    role: str = "user"


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


# ============ GENERAL RESPONSE SCHEMAS ============

class MessageResponse(BaseModel):
    message: str
    success: bool = True


class ErrorResponse(BaseModel):
    detail: str
    error_code: Optional[str] = None
