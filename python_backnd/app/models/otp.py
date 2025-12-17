"""
OTP model for MongoDB
"""

from pydantic import BaseModel, Field
from datetime import datetime
from enum import Enum
from typing import Optional


class OTPPurpose(str, Enum):
    SIGNUP = "signup"
    LOGIN = "login"
    PASSWORD_RESET = "password_reset"
    EMAIL_VERIFICATION = "email_verification"
    PHONE_VERIFICATION = "phone_verification"


class OTPType(str, Enum):
    EMAIL = "email"
    PHONE = "phone"


class OTPDocument(BaseModel):
    identifier: str  # email or phone
    otp_type: OTPType
    purpose: OTPPurpose
    otp_code: str
    is_verified: bool = False
    attempts: int = 0
    max_attempts: int = 3
    created_at: datetime = Field(default_factory=datetime.utcnow)
    expires_at: datetime
    user_data: Optional[dict] = None  # Store temp user data for signup


def otp_helper(otp: dict) -> dict:
    """Convert MongoDB OTP document to response format"""
    return {
        "id": str(otp.get("_id")),
        "identifier": otp.get("identifier"),
        "otp_type": otp.get("otp_type"),
        "purpose": otp.get("purpose"),
        "is_verified": otp.get("is_verified", False),
        "attempts": otp.get("attempts", 0),
        "expires_at": otp.get("expires_at"),
        "created_at": otp.get("created_at"),
    }
