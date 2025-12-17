# Authentication System - Setup & Testing Guide

## Prerequisites
- Python 3.10+
- Node.js 18+
- MongoDB 6.0+
- VS Code (recommended)

## Backend Setup (FastAPI)

### 1. Navigate to Backend Directory
```bash
cd python_backnd
```

### 2. Create Virtual Environment
```bash
python -m venv venv
```

### 3. Activate Virtual Environment
```bash
# Windows
.\venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

### 4. Install Dependencies
```bash
pip install -r requirements.txt
```

If requirements.txt doesn't exist, install manually:
```bash
pip install fastapi==0.109.0 uvicorn[standard] motor pymongo python-jose[cryptography] passlib[bcrypt] python-multipart httpx pydantic-settings
```

### 5. Create .env File
Create `python_backnd/.env`:
```env
# Database
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=electronics_db

# JWT Settings
SECRET_KEY=your-super-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# OTP Settings
OTP_LENGTH=6
OTP_EXPIRE_MINUTES=10

# Email (SMTP) - Configure for production
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=your-email@gmail.com

# SMS (Twilio) - Configure for production
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number

# OAuth - Configure for production
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback/google

FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
FACEBOOK_REDIRECT_URI=http://localhost:3000/auth/callback/facebook

# CORS
FRONTEND_URL=http://localhost:3000
```

### 6. Start MongoDB
Ensure MongoDB is running:
```bash
# Windows
mongod

# Linux/Mac with service
sudo systemctl start mongod

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 7. Run Backend Server
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: http://localhost:8000
API Documentation: http://localhost:8000/docs

## Frontend Setup (Next.js)

### 1. Navigate to Frontend Directory
```bash
cd fontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Verify .env.local File
Should already exist with:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 4. Run Frontend Development Server
```bash
npm run dev
```

Frontend will be available at: http://localhost:3000

## Testing the Authentication Flow

### Test 1: Signup with Email + Phone + Password

1. Navigate to http://localhost:3000/auth
2. Click on "Sign Up" tab
3. Fill in the form:
   - Name: Test User
   - Email: test@example.com
   - Phone: +919876543210
   - Password: password123
   - Confirm Password: password123
   - Check "I agree to terms"
4. Click "Create Account"
5. You should see:
   - Success message: "OTP sent to your phone and email"
   - OTP verification screen
   - Toggle buttons to choose verification method (Phone/Email)

### Test 2: OTP Verification

**Backend Console Check:**
- Look for printed OTP in terminal (since SMTP/Twilio not configured)
- Example output: `Generated OTP Code: 123456`

**Frontend:**
1. Choose verification method (Phone or Email)
2. Enter the 6-digit OTP
3. Click "Verify & Continue"
4. Should redirect to home page with user logged in

**Database Check:**
```javascript
// Connect to MongoDB
use electronics_db

// Check user was created
db.users.findOne({email: "test@example.com"})

// Should show:
// - email_verified: true
// - phone_verified: true
// - is_active: true
// - role: "user"
```

### Test 3: Login with Password

1. Go to http://localhost:3000/auth
2. Stay on "Login" tab
3. Select "Phone" or "Email" login method
4. Enter credentials
5. Click "Sign In"
6. Should login successfully

### Test 4: Login with OTP

1. Go to http://localhost:3000/auth
2. Click "Or use OTP instead"
3. Enter email or phone
4. OTP sent (check backend console)
5. Enter OTP
6. Should login successfully

### Test 5: Password Reset

1. Go to http://localhost:3000/auth/forgot-password
2. Choose reset method (Email or Phone)
3. Enter identifier
4. Click "Send OTP"
5. Check backend console for OTP
6. Go to reset password page
7. Enter identifier, OTP, and new password
8. Click "Reset Password"
9. Should show success message
10. Try logging in with new password

## Troubleshooting

### Backend Issues

**Error: MongoDB connection failed**
- Solution: Ensure MongoDB is running on port 27017
- Check: `mongo` or `mongosh` to connect to MongoDB

**Error: ModuleNotFoundError**
- Solution: Ensure virtual environment is activated
- Solution: Reinstall dependencies: `pip install -r requirements.txt`

**Error: Index conflict**
- Solution: Already handled in code with graceful index creation
- Manual fix: Drop indexes: `db.otps.dropIndexes()`

### Frontend Issues

**Error: Failed to fetch**
- Solution: Ensure backend is running on port 8000
- Check: Visit http://localhost:8000/docs
- Solution: Check .env.local has correct API_URL

**Error: CORS error**
- Solution: Backend CORS already configured for localhost:3000
- Check: Backend console for CORS errors

**OTP not received**
- Reason: SMTP/Twilio not configured (development)
- Solution: Check backend console for printed OTP
- Example: `Generated OTP Code: 123456`

### Database Issues

**Clear test data:**
```javascript
// Connect to MongoDB
use electronics_db

// Delete test user
db.users.deleteOne({email: "test@example.com"})

// Clear all OTPs
db.otps.deleteMany({})
```

## Development Notes

### OTP in Development
- OTPs are printed to backend console
- No actual SMS/Email sent (requires configuration)
- Check terminal running `uvicorn` for OTP codes

### Production Setup Required
1. Configure SMTP (Gmail, SendGrid, etc.)
2. Configure Twilio for SMS
3. Set up OAuth apps (Google, Facebook)
4. Change SECRET_KEY to secure random value
5. Set proper CORS origins
6. Use environment-specific settings

### Testing Checklist
- [ ] Signup with email + phone + password
- [ ] Verify OTP with phone identifier
- [ ] Verify OTP with email identifier
- [ ] Login with password (email)
- [ ] Login with password (phone)
- [ ] Login with OTP (email)
- [ ] Login with OTP (phone)
- [ ] Password reset with email
- [ ] Password reset with phone
- [ ] OAuth login (requires configuration)

## API Endpoints Quick Reference

### Authentication
- POST /api/auth/signup - Register new user
- POST /api/auth/signup/verify - Verify signup OTP
- POST /api/auth/login - Login with password
- POST /api/auth/login/otp/send - Send login OTP
- POST /api/auth/login/otp/verify - Verify login OTP
- POST /api/auth/forgot-password - Request password reset
- POST /api/auth/reset-password - Reset password with OTP
- POST /api/auth/refresh - Refresh access token

### User Management
- GET /api/users/me - Get current user profile
- PUT /api/users/me - Update user profile
- POST /api/users/verify/email - Send email verification
- POST /api/users/verify/phone - Send phone verification
- PUT /api/users/change-password - Change password

### OAuth
- GET /api/oauth/google - Get Google OAuth URL
- GET /api/oauth/google/callback - Google OAuth callback
- GET /api/oauth/facebook - Get Facebook OAuth URL
- GET /api/oauth/facebook/callback - Facebook OAuth callback

## Support
For issues or questions:
1. Check backend console for errors
2. Check frontend console (browser DevTools)
3. Verify MongoDB is running
4. Ensure all dependencies are installed
5. Review OTP_FLOW_DOCUMENTATION.md for flow details
