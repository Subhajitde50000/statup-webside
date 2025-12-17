from app.schemas.auth import (
    SignupRequest,
    SignupResponse,
    LoginRequest,
    LoginWithOTPRequest,
    LoginResponse,
    SendOTPRequest,
    VerifyOTPRequest,
    VerifyOTPResponse,
    ResendOTPRequest,
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    ResetPasswordRequest,
    ResetPasswordResponse,
    TokenData,
    RefreshTokenRequest,
    TokenResponse,
    MessageResponse,
    ErrorResponse,
)

from app.schemas.user import (
    UserProfileResponse,
    UpdateProfileRequest,
    ChangePasswordRequest,
    VerifyEmailRequest,
    VerifyPhoneRequest,
    UserListResponse,
)
