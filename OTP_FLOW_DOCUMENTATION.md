# OTP Flow Documentation

## Overview
This document describes the OTP (One-Time Password) authentication flow for both signup and password reset functionalities.

## Signup Flow

### Backend Implementation
When a user signs up with email, phone number, and password:

1. **OTP Generation**: A single 6-digit OTP code is generated
2. **Dual Storage**: The same OTP is stored twice in MongoDB:
   - Once with phone number as identifier
   - Once with email as identifier
3. **Dual Delivery**: The OTP is sent to both channels:
   - SMS to phone number
   - Email to email address
4. **Flexible Verification**: User can verify with either email or phone

### User Experience
- User enters: name, email, phone, password
- System sends same OTP to both email and phone
- User receives OTP on both channels
- User can choose to verify using either:
  - The OTP received on phone
  - The OTP received on email
- Both email and phone are marked as verified after OTP confirmation

### Code Flow
```python
# Generate one OTP code
otp_code = await create_otp(
    identifier=request.phone,
    otp_type=OTPType.PHONE,
    purpose=OTPPurpose.SIGNUP,
    user_data=user_data
)

# Create second entry with same code for email
if request.email:
    await create_otp(
        identifier=request.email,
        otp_type=OTPType.EMAIL,
        purpose=OTPPurpose.SIGNUP,
        user_data=user_data,
        otp_code=otp_code  # Use same code
    )

# Send to both channels
await send_otp(request.phone, otp_code, OTPType.PHONE)
if request.email:
    await send_otp(request.email, otp_code, OTPType.EMAIL)
```

## Password Reset Flow

### Backend Implementation
When a user requests password reset:

1. **Method Selection**: User chooses reset method (email OR phone)
2. **Single OTP**: OTP is generated and sent ONLY to chosen method
3. **Security**: For security, OTP is sent only to the verified channel selected

### User Experience
- User selects reset method (email or phone)
- OTP is sent ONLY to selected channel
- User verifies with OTP from that channel only
- Password is reset after successful verification

### Code Flow
```python
# Send OTP only to chosen method
if request.reset_method.value == "email":
    user = await users.find_one({"email": request.identifier})
    otp_type = OTPType.EMAIL
else:
    user = await users.find_one({"phone": request.identifier})
    otp_type = OTPType.PHONE

# Create and send OTP to single channel
otp_code = await create_otp(
    identifier=request.identifier,
    otp_type=otp_type,
    purpose=OTPPurpose.PASSWORD_RESET,
    user_data={"user_id": str(user["_id"])}
)

await send_otp(request.identifier, otp_code, otp_type)
```

## Key Differences

| Feature | Signup | Password Reset |
|---------|--------|----------------|
| OTP Delivery | Both email AND phone | Email OR phone (user choice) |
| OTP Code | Same code for both | Single code for chosen method |
| Verification | Can verify with either | Must verify with chosen method |
| Purpose | Confirm identity for new account | Secure password recovery |

## Security Considerations

### Signup
- Same OTP for convenience (user gets code on both channels)
- Both email and phone marked as verified
- User flexibility in verification method

### Password Reset
- Single channel for security
- User must have access to specific verified contact
- Prevents unauthorized password reset attempts

## Technical Details

### OTP Properties
- **Length**: 6 digits
- **Expiry**: 10 minutes
- **Max Attempts**: 3
- **Storage**: MongoDB with TTL index for auto-deletion

### Database Schema
```javascript
{
  identifier: "email@example.com" or "+1234567890",
  otp_type: "email" or "phone",
  purpose: "signup" or "password_reset" or "login",
  otp_code: "123456",
  is_verified: false,
  attempts: 0,
  max_attempts: 3,
  created_at: ISODate("2024-01-01T00:00:00Z"),
  expires_at: ISODate("2024-01-01T00:10:00Z"),
  user_data: {...}
}
```

## Frontend Integration

### Signup OTP Verification
```typescript
// User can choose verification method
const [verifyMethod, setVerifyMethod] = useState<'email' | 'phone'>('phone');

// Verify with chosen method
const identifier = verifyMethod === 'email' ? formData.email : formData.phone;
await verifySignup({
  identifier,
  otp_code: otpCode,
  purpose: 'signup'
});
```

### UI Components
- Toggle buttons to switch between email/phone verification
- Clear messaging about OTP sent to both channels
- Visual indicators for selected verification method

## Testing

### Test Signup Flow
1. Register with email + phone + password
2. Verify OTP sent to both channels
3. Confirm same OTP code works for both
4. Test verification with phone identifier
5. Test verification with email identifier
6. Verify both are marked as verified in database

### Test Password Reset Flow
1. Request reset with email
2. Verify OTP sent only to email
3. Request reset with phone
4. Verify OTP sent only to phone
5. Confirm different OTPs for email vs phone requests
