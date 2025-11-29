# EventHub Authentication Module - Setup Guide

## 🔐 Authentication System Overview

This authentication module provides a complete, production-ready authentication system for EventHub with:

- **Dual-Token Authentication**: Access tokens (15min) + Refresh tokens (7 days)
- **HTTP-Only Cookies**: Secure token storage preventing XSS attacks
- **Role-Based Access**: Support for Normal Users and Organizers
- **Redux State Management**: Professional architecture with separate API/slice/thunks layers
- **Modern UI**: Animated forms with Framer Motion and Tailwind CSS

## 📋 Prerequisites

- Node.js 18+ installed
- MongoDB instance (local or MongoDB Atlas)
- Git

## 🚀 Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the project root:

```bash
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/eventhub
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/eventhub

# JWT Secrets (generate strong random strings for production)
ACCESS_TOKEN_SECRET=your-access-token-secret-change-this
REFRESH_TOKEN_SECRET=your-refresh-token-secret-change-this

# Environment
NODE_ENV=development
```

**Generate secure secrets:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Install Dependencies

Dependencies are already installed. If needed, run:

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
EventHub/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx          # Login page
│   │   └── signup/page.tsx         # Signup page
│   ├── api/auth/
│   │   ├── signup/route.ts         # Signup API endpoint
│   │   ├── login/route.ts          # Login API endpoint
│   │   ├── logout/route.ts         # Logout API endpoint
│   │   └── refresh/route.ts        # Token refresh endpoint
│   └── layout.tsx                  # Root layout with Redux Provider
├── redux/
│   ├── store/
│   │   └── store.ts                # Redux store configuration
│   ├── states/auth/
│   │   ├── authAPI.ts              # Axios API calls
│   │   ├── authSlice.ts            # Redux slice
│   │   └── authThunks.ts           # Async thunks
│   └── StoreProvider.tsx           # Redux Provider component
├── lib/
│   ├── connectDb.ts                # MongoDB connection utility
│   └── auth.ts                     # Authentication utilities
├── models/
│   └── User.ts                     # User Mongoose model
├── middleware/
│   └── authMiddleware.ts           # Route protection middleware
└── types/
    └── auth.ts                     # TypeScript type definitions
```

## 🔑 API Endpoints

### POST /api/auth/signup

Register a new user

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user", // or "organizer"
  "description": "Optional bio"
}
```

### POST /api/auth/login

Authenticate user

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### POST /api/auth/logout

Logout current user (requires authentication)

### POST /api/auth/refresh

Refresh access token using refresh token

## 🎨 Frontend Pages

### `/signup`

- Full registration form with validation
- Role selection (Normal User / Organizer)
- Optional description field
- Animated UI with error handling

### `/login`

- Email and password authentication
- Automatic redirect on success
- Error feedback

## 🔒 Security Features

1. **Password Hashing**: bcryptjs with 10 salt rounds
2. **HTTP-Only Cookies**: Tokens inaccessible to JavaScript
3. **Token Expiration**: Short-lived access tokens, long-lived refresh tokens
4. **Database Token Validation**: Refresh tokens verified against database
5. **Token Revocation**: Logout removes refresh token from database

## 🧪 Testing the Authentication

### 1. Test Signup

1. Navigate to `http://localhost:3000/signup`
2. Fill in the form:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
   - Confirm Password: password123
   - Role: Normal User or Organizer
3. Click "Create Account"
4. Should redirect to login page

### 2. Test Login

1. Navigate to `http://localhost:3000/login`
2. Enter credentials:
   - Email: test@example.com
   - Password: password123
3. Click "Sign In"
4. Should redirect to home page
5. Check browser DevTools > Application > Cookies to see `accessToken` and `refreshToken`

### 3. Test Redux State

1. After login, open Redux DevTools
2. Check `auth` state:
   - `user` should contain user data
   - `isAuthenticated` should be `true`

### 4. Test Logout

Use the logout thunk in any component:

```typescript
import { logoutThunk } from "@/redux/states/auth/authThunks";
import { useAppDispatch } from "@/redux/store/store";

const dispatch = useAppDispatch();
await dispatch(logoutThunk());
```

## 🛠️ Using Authentication in Your Code

### Protect API Routes

```typescript
import { authMiddleware } from "@/middleware/authMiddleware";

export async function GET(req: NextRequest) {
  const authResult = await authMiddleware(req);
  if (authResult.error) {
    return authResult.response;
  }

  const user = authResult.user; // Access authenticated user
  // Your protected route logic here
}
```

### Access User in Components

```typescript
"use client";
import { useAppSelector } from "@/redux/store/store";

export default function MyComponent() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return <div>Welcome, {user?.name}!</div>;
}
```

### Dispatch Auth Actions

```typescript
import { useAppDispatch } from "@/redux/store/store";
import { loginThunk, logoutThunk } from "@/redux/states/auth/authThunks";

const dispatch = useAppDispatch();

// Login
await dispatch(loginThunk({ email, password }));

// Logout
await dispatch(logoutThunk());
```

## 📝 Important Notes for Team

1. **Do NOT modify** files in other team members' modules
2. **Environment variables** must be set before running the app
3. **MongoDB** must be running and accessible
4. **Cookies** are automatically managed - no manual handling needed
5. **Token refresh** happens automatically when access token expires

## 🐛 Troubleshooting

### MongoDB Connection Error

- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env.local`
- For Atlas, ensure IP whitelist is configured

### JWT Errors

- Verify `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET` are set
- Ensure secrets are strong random strings

### Cookie Not Set

- Check browser console for errors
- Ensure you're using `http://localhost` (not `127.0.0.1`)
- In production, ensure HTTPS is enabled

## 📚 Code Comments

All code includes comprehensive comments explaining:

- What each function does
- Why certain approaches were chosen
- How to use the code
- Security considerations

This makes it easy for team members to understand and extend the authentication system.

## ✅ What's Implemented

- ✅ User registration (signup)
- ✅ User authentication (login)
- ✅ Token refresh mechanism
- ✅ Logout with token revocation
- ✅ Role-based user types (user/organizer)
- ✅ Protected route middleware
- ✅ Redux state management
- ✅ Form validation
- ✅ Error handling
- ✅ Modern, animated UI

## 🔜 Next Steps (For Other Team Members)

- Implement event creation (Organizer feature)
- Implement event listing and filtering
- Implement booking system
- Implement profile page
- Add authentication checks to protected pages
