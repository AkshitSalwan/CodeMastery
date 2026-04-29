# Admin User Setup & Authentication Guide

## Overview

CodeMastery uses a **role-based access control (RBAC)** system with three roles:
- **learner** (default role for new users)
- **interviewer** (can create/update problems and contests)
- **admin** (full platform access + user management)

---

## 1. How Admin Users Are Created

### Automatic Creation (On Server Start)

The admin user is **automatically created on the first server startup** via the seeder:

**File:** [server/seeders/createAdminUser.js](server/seeders/createAdminUser.js)

```javascript
export const createAdminUser = async () => {
  // Checks if admin@codemastery.com already exists
  // If not, creates it with default credentials
  // The seeder checks for existing admin before creating
}
```

This seeder is called in [server/server.js](server/server.js) during database sync:

```javascript
// When server starts:
await testConnection();
await syncDatabase();
await createAdminUser();  // <-- Creates default admin
```

### Manual Admin Creation

To programmatically create additional admins:

```javascript
import { User } from './models/index.js';

const createAdminAccount = async (email, username, password) => {
  const admin = await User.build({
    email: email,
    username: username,
    role: 'admin',
    is_active: true,
    password_hash: 'temp'
  });

  // Set password (hashes with bcrypt)
  await admin.setPassword(password);
  await admin.save();
  
  return admin;
};
```

---

## 2. Default Admin Credentials

⚠️ **IMPORTANT: Change these immediately in production!**

### Initial Admin Account

| Field | Value |
|-------|-------|
| **Email** | `admin@codemastery.com` |
| **Username** | `admin` |
| **Password** | `admin123456` |
| **Role** | `admin` |

**Source:** [server/seeders/createAdminUser.js](server/seeders/createAdminUser.js) (lines 9-12)

### How to Change Admin Password

1. Login with the default credentials
2. Update password through the user profile (if implemented)
3. Or directly update database:

```sql
UPDATE users 
SET password_hash = bcrypt.hash('new_password', salt)
WHERE email = 'admin@codemastery.com' AND role = 'admin';
```

---

## 3. Admin Authentication & Authorization

### Role Hierarchy

**File:** [server/middleware/rbac.js](server/middleware/rbac.js)

```javascript
const ROLE_HIERARCHY = {
  admin: 3,        // Highest level
  interviewer: 2,  // Medium level
  learner: 1       // Lowest level
};
```

### Admin Middleware

**Exact Role Check:**
```javascript
app.use('/admin', adminOnly);  // Only exact 'admin' role
```

**Minimum Role Check:**
```javascript
app.use('/admin', requireMinRole('admin'));  // Admin or higher
```

### Admin Permissions

**File:** [server/middleware/rbac.js](server/middleware/rbac.js) (lines 87-125)

```javascript
const PERMISSIONS = {
  // Topic permissions (Admin only)
  'topic:create': [ROLES.ADMIN],
  'topic:update': [ROLES.ADMIN],
  'topic:delete': [ROLES.ADMIN],
  
  // Problem permissions (Admin + Interviewer)
  'problem:create': [ROLES.ADMIN, ROLES.INTERVIEWER],
  'problem:update': [ROLES.ADMIN, ROLES.INTERVIEWER],
  'problem:delete': [ROLES.ADMIN],  // Only Admin
  
  // Contest permissions (Admin + Interviewer)
  'contest:create': [ROLES.ADMIN, ROLES.INTERVIEWER],
  'contest:update': [ROLES.ADMIN, ROLES.INTERVIEWER],
  'contest:delete': [ROLES.ADMIN, ROLES.INTERVIEWER],
  'contest:view_candidates': [ROLES.ADMIN, ROLES.INTERVIEWER],
  'contest:shortlist': [ROLES.ADMIN, ROLES.INTERVIEWER],
  
  // User management (Admin only)
  'user:view_all': [ROLES.ADMIN],
  'user:update_role': [ROLES.ADMIN],
  'user:delete': [ROLES.ADMIN],
  
  // Badge permissions (Admin only)
  'badge:create': [ROLES.ADMIN],
  'badge:assign': [ROLES.ADMIN],
  
  // Analytics (Admin only)
  'analytics:view': [ROLES.ADMIN, ROLES.INTERVIEWER],
  'analytics:platform': [ROLES.ADMIN]
};
```

---

## 4. Files Handling Admin Creation & Authentication

### Backend Files

| File | Purpose |
|------|---------|
| [server/seeders/createAdminUser.js](server/seeders/createAdminUser.js) | Seeder that creates default admin user |
| [server/server.js](server/server.js) | Calls `createAdminUser()` on startup (line 171) |
| [server/models/user.js](server/models/user.js) | User model with password hashing |
| [server/middleware/auth.js](server/middleware/auth.js) | Authentication middleware (JWT, token generation) |
| [server/middleware/rbac.js](server/middleware/rbac.js) | Role-based access control middleware |
| [server/routes/auth.js](server/routes/auth.js) | Authentication routes (register, login) |
| [server/controllers/authController.js](server/controllers/authController.js) | Auth logic + Clerk webhook handling |

### Frontend Files

| File | Purpose |
|------|---------|
| [src/pages/AdminPage.jsx](src/pages/AdminPage.jsx) | Admin dashboard UI |
| [src/utils/roles.js](src/utils/roles.js) | Role utility functions |
| [src/context/AuthContext.jsx](src/context/AuthContext.jsx) | Auth context (if exists) |

---

## 5. Database Schema for Admin Roles

### User Table Schema

**File:** [server/models/user.js](server/models/user.js)

```javascript
User = {
  id: Integer (Primary Key, Auto-increment),
  email: String (Unique, Email validation),
  username: String (Unique),
  password_hash: String (Bcrypt hashed),
  role: ENUM('learner', 'interviewer', 'admin'),  // Default: 'learner'
  avatar: String (Optional URL),
  bio: Text (Optional),
  github_url: String (Optional),
  linkedin_url: String (Optional),
  is_active: Boolean (Default: true),
  last_login: DateTime (Nullable),
  created_at: DateTime (Auto),
  updated_at: DateTime (Auto),
  clerk_id: String (Optional - for Clerk integration)
};
```

### Key Fields for Admin

```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('learner', 'interviewer', 'admin') NOT NULL DEFAULT 'learner',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 6. Bootstrap Admin via Environment Variables

### Email-Based Admin Whitelist

**Frontend:** [src/utils/roles.js](src/utils/roles.js)

```javascript
const getAdminEmailAllowlist = () =>
  String(import.meta.env.VITE_ADMIN_EMAILS || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

export const isAdminEmail = (email) =>
  getAdminEmailAllowlist().includes(email);
```

### Environment Variable Setup

Add to `.env`:
```env
# Add comma-separated emails that auto-get admin privileges
VITE_ADMIN_EMAILS=admin@codemastery.com,your-email@example.com,another-admin@example.com
```

This creates a **bootstrap admin allowlist** - emails in this list are automatically treated as admins on the frontend and in the Admin Panel.

---

## 7. Admin Panel Features

**URL:** `/admin`

**File:** [src/pages/AdminPage.jsx](src/pages/AdminPage.jsx)

### Features Available

1. **Role Management**
   - Assign/update user roles (interviewer, admin, learner)
   - Add users by email

2. **Admin Monitoring**
   - View bootstrap admin emails (from `VITE_ADMIN_EMAILS`)
   - See managed interviewers
   - See managed admins

3. **Metrics & Analytics**
   - Questions added count
   - Contests created count
   - Test cases designed
   - User role distribution (pie chart)

4. **Key Performance Indicators**
   - Allowed Admin Emails count
   - Interviewer Accounts
   - Questions Added
   - Contests Arranged

---

## 8. Setting Up Admin in Your Environment

### Step 1: Initial Setup
```bash
# Server auto-creates admin on first startup
npm run dev
# Check console for:
# ✓ Admin user created successfully
# ✓ Email: admin@codemastery.com
# ✓ Password: admin123456
```

### Step 2: Login
```javascript
// POST /api/auth/login
{
  "email": "admin@codemastery.com",
  "password": "admin123456"
}

// Response
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "admin@codemastery.com",
    "username": "admin",
    "role": "admin"
  }
}
```

### Step 3: Update Admin Email Whitelist (Optional)
```env
# .env (frontend uses VITE prefix)
VITE_ADMIN_EMAILS=admin@codemastery.com,your-email@example.com
```

### Step 4: Change Password
1. Login to Admin Panel
2. Update profile with new password
3. Or directly update database with bcrypt hash

### Step 5: Create Additional Admins
Use the Admin Panel at `/admin`:
- Fill in email, name
- Select "Admin" role
- Click "Save role"

---

## 9. Authentication Flow

### Login Process

1. **User submits credentials** → POST `/api/auth/login`
2. **Server verifies password** → bcrypt.compare()
3. **Token generated** → JWT signed with `JWT_SECRET`
4. **Client stores token** → localStorage
5. **Token sent** → Authorization header: `Bearer <token>`
6. **Server verifies** → `req.dbUser` loaded from database

### Protected Routes

```javascript
// Middleware: [requireAuth, getOrCreateUser, adminOnly]
router.get('/admin/data', requireAuth, getOrCreateUser, adminOnly, handler);
```

---

## 10. Security Considerations

### ✅ Best Practices Implemented

- Password hashing with **bcrypt** (salt: 10)
- JWT tokens with **7-day expiration**
- Role-based access control (RBAC)
- Password hidden from API responses (`toJSON()` override)

### ⚠️ Production Requirements

1. **Change default password immediately**
   ```sql
   -- Only after changing via UI or setting new hash
   ```

2. **Update JWT_SECRET in .env**
   ```env
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ```

3. **Enable HTTPS only**
   - Store JWT in httpOnly cookies (consider update)

4. **Audit admin accounts regularly**
   - Remove unused admin accounts
   - Review permissions in rbac.js

5. **Implement rate limiting**
   - Prevent brute force attacks on login

---

## Summary Table

| Item | Details |
|------|---------|
| **Default Email** | `admin@codemastery.com` |
| **Default Password** | `admin123456` |
| **Creation Method** | Auto-seeded on server startup |
| **Auth Method** | JWT token-based |
| **Password Hashing** | bcrypt (salt: 10) |
| **Token Expiration** | 7 days |
| **Role System** | RBAC with 3 roles |
| **Admin Panel URL** | `/admin` |
| **Env Variable** | `VITE_ADMIN_EMAILS` (email whitelist) |
| **Database Field** | `users.role` ENUM |
| **Middleware** | `adminOnly`, `requireRole('admin')` |

---

## References

- **Password hashing:** [server/models/user.js](server/models/user.js#L69-L71)
- **RBAC middleware:** [server/middleware/rbac.js](server/middleware/rbac.js)
- **Authentication:** [server/middleware/auth.js](server/middleware/auth.js)
- **Admin seeder:** [server/seeders/createAdminUser.js](server/seeders/createAdminUser.js)
- **Admin UI:** [src/pages/AdminPage.jsx](src/pages/AdminPage.jsx)
- **Role utilities:** [src/utils/roles.js](src/utils/roles.js)
