# Electronics Authentication System

A complete authentication backend built with FastAPI and MongoDB, featuring OTP verification, JWT tokens, OAuth integration, and Role-Based Access Control (RBAC).

## Features

### Authentication Methods
- ✅ **Email/Phone + Password Login**
- ✅ **OTP Login** (via Email or SMS)
- ✅ **Sign Up with OTP Verification**
- ✅ **Google OAuth**
- ✅ **Facebook OAuth**
- ✅ **Password Reset with OTP**

### Security
- ✅ **JWT Access & Refresh Tokens**
- ✅ **Bcrypt Password Hashing**
- ✅ **OTP Expiry & Rate Limiting**
- ✅ **Role-Based Access Control (RBAC)**

### User Roles
- `user` - Regular users
- `professional` - Service professionals
- `shopkeeper` - Shop owners
- `manager` - Platform managers
- `admin` - Full system administrators

## Project Structure

```
python_backnd/
├── main.py                 # FastAPI application entry point
├── requirements.txt        # Python dependencies
├── .env.example           # Environment variables template
└── app/
    ├── __init__.py
    ├── config.py          # Application settings
    ├── database.py        # MongoDB connection
    ├── models/
    │   ├── __init__.py
    │   ├── user.py        # User model
    │   └── otp.py         # OTP model
    ├── schemas/
    │   ├── __init__.py
    │   ├── auth.py        # Auth request/response schemas
    │   └── user.py        # User schemas
    ├── routes/
    │   ├── __init__.py
    │   ├── auth.py        # Auth endpoints
    │   ├── users.py       # User management endpoints
    │   └── oauth.py       # OAuth endpoints
    ├── utils/
    │   ├── __init__.py
    │   ├── security.py    # JWT & password utilities
    │   └── otp.py         # OTP utilities
    └── middleware/
        ├── __init__.py
        └── rbac.py        # Role-based access control
```

## Setup

### 1. Install Dependencies

```bash
cd python_backnd
pip install -r requirements.txt
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Required environment variables:
- `MONGO_URL` - MongoDB connection string
- `JWT_SECRET_KEY` - Secret key for JWT (change in production!)
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` - For Google OAuth
- `FACEBOOK_APP_ID` / `FACEBOOK_APP_SECRET` - For Facebook OAuth

### 3. Start MongoDB

Make sure MongoDB is running locally or update `MONGO_URL` to your MongoDB instance.

### 4. Run the Server

```bash
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/signup/verify` | Verify signup OTP |
| POST | `/api/auth/login` | Login with password |
| POST | `/api/auth/login/otp/send` | Send login OTP |
| POST | `/api/auth/login/otp/verify` | Verify login OTP |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset password with OTP |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Get current user |

### OAuth

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/oauth/google/login` | Get Google OAuth URL |
| GET | `/api/oauth/google/callback` | Google OAuth callback |
| GET | `/api/oauth/facebook/login` | Get Facebook OAuth URL |
| GET | `/api/oauth/facebook/callback` | Facebook OAuth callback |

### User Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/profile` | Get user profile |
| PUT | `/api/users/profile` | Update profile |
| POST | `/api/users/change-password` | Change password |
| POST | `/api/users/verify-email/send` | Send email verification |
| POST | `/api/users/verify-email` | Verify email |
| POST | `/api/users/verify-phone/send` | Send phone verification |
| POST | `/api/users/verify-phone` | Verify phone |
| GET | `/api/users/list` | List users (Admin/Manager) |
| PUT | `/api/users/{id}/role` | Update user role (Admin) |
| PUT | `/api/users/{id}/status` | Activate/deactivate user (Admin) |

## Frontend Integration

The frontend utilities are in `fontend/utils/auth.ts`:

```typescript
import { login, signup, verifySignup, logout } from '@/utils/auth';

// Login
const response = await login({
  identifier: 'user@example.com',
  password: 'password123',
  login_method: 'email'
});

// Signup
await signup({
  name: 'John Doe',
  email: 'john@example.com',
  phone: '9876543210',
  password: 'password123'
});

// Logout
await logout();
```

### Auth Context

Use the `AuthProvider` in your app layout:

```tsx
import { AuthProvider } from '@/utils/AuthContext';

export default function Layout({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
```

Use the `useAuth` hook in components:

```tsx
import { useAuth } from '@/utils/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <LoginPrompt />;
  }
  
  return <div>Welcome, {user.name}!</div>;
}
```

## OTP Configuration

### Development Mode
In development, OTPs are printed to the console:
```
[DEV] SMS OTP sent to 9876543210: 123456
[DEV] Email OTP sent to user@example.com: 654321
```

### Production Mode
Configure the following for production:

**Email (SMTP):**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

**SMS (Twilio):**
```env
TWILIO_ACCOUNT_SID=your-sid
TWILIO_AUTH_TOKEN=your-token
TWILIO_PHONE_NUMBER=+1234567890
```

## Security Notes

1. **JWT Secret**: Change `JWT_SECRET_KEY` in production
2. **CORS**: Update allowed origins in `main.py`
3. **HTTPS**: Use HTTPS in production
4. **Rate Limiting**: Implement rate limiting for OTP endpoints
5. **Password Policy**: Consider adding stronger password requirements

## License

MIT
