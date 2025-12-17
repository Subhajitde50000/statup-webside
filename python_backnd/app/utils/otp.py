"""
OTP utilities for generation, sending, and verification
"""

import random
import string
from datetime import datetime, timedelta
from typing import Optional

from app.config import settings
from app.database import get_otps_collection
from app.models.otp import OTPPurpose, OTPType


def generate_otp(length: int = 6) -> str:
    """Generate a random numeric OTP"""
    return ''.join(random.choices(string.digits, k=length))


async def create_otp(
    identifier: str,
    otp_type: OTPType,
    purpose: OTPPurpose,
    user_data: Optional[dict] = None,
    otp_code: Optional[str] = None
) -> str:
    """Create and store OTP in database"""
    otps = get_otps_collection()
    
    # Delete any existing OTPs for this identifier and purpose
    await otps.delete_many({
        "identifier": identifier,
        "purpose": purpose.value
    })
    
    # Generate new OTP or use provided one
    if otp_code is None:
        otp_code = generate_otp(settings.OTP_LENGTH)
    expires_at = datetime.utcnow() + timedelta(minutes=settings.OTP_EXPIRE_MINUTES)
    
    # Store OTP
    otp_doc = {
        "identifier": identifier,
        "otp_type": otp_type.value,
        "purpose": purpose.value,
        "otp_code": otp_code,
        "is_verified": False,
        "attempts": 0,
        "max_attempts": 3,
        "created_at": datetime.utcnow(),
        "expires_at": expires_at,
        "user_data": user_data
    }
    
    await otps.insert_one(otp_doc)
    
    return otp_code


async def verify_otp(
    identifier: str,
    otp_code: str,
    purpose: OTPPurpose
) -> dict:
    """Verify OTP and return result with user_data if valid"""
    otps = get_otps_collection()
    
    # Find OTP
    otp_doc = await otps.find_one({
        "identifier": identifier,
        "purpose": purpose.value,
        "is_verified": False
    })
    
    if not otp_doc:
        return {
            "valid": False,
            "error": "OTP not found or already used"
        }
    
    # Check expiry
    if datetime.utcnow() > otp_doc["expires_at"]:
        await otps.delete_one({"_id": otp_doc["_id"]})
        return {
            "valid": False,
            "error": "OTP has expired"
        }
    
    # Check attempts
    if otp_doc["attempts"] >= otp_doc["max_attempts"]:
        await otps.delete_one({"_id": otp_doc["_id"]})
        return {
            "valid": False,
            "error": "Maximum OTP attempts exceeded"
        }
    
    # Verify OTP code
    if otp_doc["otp_code"] != otp_code:
        # Increment attempts
        await otps.update_one(
            {"_id": otp_doc["_id"]},
            {"$inc": {"attempts": 1}}
        )
        remaining = otp_doc["max_attempts"] - otp_doc["attempts"] - 1
        return {
            "valid": False,
            "error": f"Invalid OTP. {remaining} attempts remaining"
        }
    
    # Mark as verified
    await otps.update_one(
        {"_id": otp_doc["_id"]},
        {"$set": {"is_verified": True}}
    )
    
    # Return success with user data
    return {
        "valid": True,
        "user_data": otp_doc.get("user_data")
    }


async def send_email_otp(email: str, otp_code: str) -> bool:
    """Send OTP via email"""
    # In production, integrate with an email service like SendGrid, AWS SES, etc.
    # For now, we'll just print it (development mode)
    
    try:
        # TODO: Implement actual email sending
        # Example with SMTP:
        import smtplib
        from email.mime.text import MIMEText
        # 
        msg = MIMEText(f"Your OTP is: {otp_code}")
        msg['Subject'] = "Your OTP Code"
        msg['From'] = settings.EMAIL_FROM
        msg['To'] = email
        # 
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.send_message(msg)
        
        print(f"[DEV] Email OTP sent to {email}: {otp_code}")
        return True
        
    except Exception as e:
        print(f"Failed to send email OTP: {e}")
        return False


async def send_sms_otp(phone: str, otp_code: str) -> bool:
    """Send OTP via SMS"""
    # In production, integrate with Twilio, AWS SNS, etc.
    # For now, we'll just print it (development mode)
    
    try:
        # TODO: Implement actual SMS sending
        # Example with Twilio:
        # from twilio.rest import Client
        # 
        # client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        # message = client.messages.create(
        #     body=f"Your OTP is: {otp_code}",
        #     from_=settings.TWILIO_PHONE_NUMBER,
        #     to=phone
        # )
        
        print(f"[DEV] SMS OTP sent to {phone}: {otp_code}")
        return True
        
    except Exception as e:
        print(f"Failed to send SMS OTP: {e}")
        return False


async def send_otp(
    identifier: str,
    otp_code: str,
    otp_type: OTPType
) -> bool:
    """Send OTP via appropriate channel"""
    if otp_type == OTPType.EMAIL:
        return await send_email_otp(identifier, otp_code)
    else:
        return await send_sms_otp(identifier, otp_code)
