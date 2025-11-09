# 🏗️ JamWatHQ Architecture Overview

**Date**: 2025-10-27
**Status**: Development
**Purpose**: Comprehensive system architecture and component documentation

---

## 📋 Table of Contents

1. [System Overview](#system-overview)
2. [Technology Stack](#technology-stack)
3. [Directory Structure](#directory-structure)
4. [Component Architecture](#component-architecture)
5. [Data Flow](#data-flow)
6. [Security Architecture](#security-architecture)
7. [Dependencies](#dependencies)
8. [Environment Configuration](#environment-configuration)

---

## 🌐 System Overview

### Project Purpose
JamWatHQ (Jamaican Work and Travel Headquarters) is a web application that provides information, reviews, and resources for Jamaican J-1 visa participants. The platform enables users to:

- Browse and search employment agencies
- Read and submit agency reviews
- Share work experiences
- Access guides and resources
- Report issues and provide feedback
- View news and updates

### Architecture Pattern
**Separation of Concerns**: Frontend/Backend Split
- **Frontend**: Static HTML/CSS/JS served from root or port 8000
- **Backend**: Express.js REST API running on port 3000
- **Database**: MongoDB for persistent data storage
- **Authentication**: Passport.js with OAuth 2.0 (Google, Facebook)

### Deployment Model
**Current**: Local Development
**Target**: GitHub Pages (frontend) + VPS/Cloud (backend)

---

## 💻 Technology Stack

### Frontend
| Technology | Purpose | Version |
|------------|---------|---------|
| HTML5 | Page structure | - |
| CSS3 / Sass | Styling and themes | - |
| Vanilla JavaScript | Client-side logic | ES6+ |
| jQuery | DOM manipulation | 3.x |
| Bootstrap | Responsive framework | Via custom CSS |
| Font Awesome | Icons | 5.x |

### Backend
| Technology | Purpose | Version |
|------------|---------|---------|
| Node.js | Runtime environment | 14+ |
| Express.js | Web framework | 4.x |
| MongoDB | Database | 4.x+ |
| Mongoose | ODM for MongoDB | 6.x |
| Passport.js | Authentication | 0.6.x |

### Security & Middleware
| Package | Purpose |
|---------|---------|
| helmet | Security headers |
| cors | Cross-origin resource sharing |
| csurf | CSRF protection |
| express-rate-limit | Rate limiting |
| hpp | HTTP parameter pollution prevention |
| express-session | Session management |
| connect-mongo | MongoDB session store |

### OAuth Providers
| Provider | Strategy | Status |
|----------|----------|--------|
| Google | passport-google-oauth20 | ✅ Configured |
| Facebook | passport-facebook | ✅ Configured |

---

## 📁 Directory Structure

### Full Development Codebase (Current)

```
Full Codebase/
├── backend/                    # Express.js server
│   ├── config/
│   │   ├── database.js        # MongoDB connection
│   │   └── passport.js        # OAuth strategies
│   ├── middleware/
│   │   ├── auth.js            # Authentication middleware
│   │   └── adminAuth.js       # Admin authorization
│   ├── models/
│   │   ├── User.js            # User schema
│   │   ├── Review.js          # State review schema
│   │   ├── AgencyReview.js    # Agency review schema
│   │   ├── Admin.js           # Admin user schema
│   │   ├── ActivityLog.js     # Audit logging
│   │   └── SecurityLog.js     # Security events
│   ├── routes/
│   │   ├── auth.js            # OAuth/login endpoints
│   │   ├── reviews.js         # State reviews API
│   │   ├── agencyReviews.js   # Agency reviews API
│   │   └── reports.js         # Problem reporting API
│   ├── scripts/               # Utility scripts
│   │   ├── init-database.js   # DB initialization
│   │   ├── cleanup_duplicates.js
│   │   └── wrap_agencies.js   # Data migration
│   ├── server.js              # Main entry point
│   ├── package.json           # Dependencies
│   ├── .env                   # Environment variables (gitignored)
│   └── .env.example           # Template for .env
│
├── frontend/ (planned migration target)
│   └── [Static files to be moved here]
│
├── scripts/                   # Frontend JavaScript
│   ├── auth-client.js         # Client-side auth handler
│   ├── login-modal.js         # Login UI component
│   ├── profile-hub.js         # User profile management
│   ├── agencies.js            # Agency directory logic
│   ├── share-experience.js    # Experience submission
│   ├── news-page.js           # News display
│   ├── native-ads.js          # Ad management
│   ├── video-ad.js            # Video ad integration
│   └── main.js                # Global scripts
│
├── styles/                    # CSS and Sass
│   ├── main.css               # Core styles
│   ├── header-layout.css      # Header components
│   ├── profile-hub.css        # Profile styles
│   ├── native-ads.css         # Ad styles
│   ├── video-ad.css           # Video ad styles
│   └── sass/                  # Sass source files
│
├── assets/                    # Static assets
│   ├── images/                # Site images
│   └── fonts/                 # Font Awesome fonts
│
├── docs/                      # Documentation
│   ├── CLAUDE.md              # AI usage discipline (NEW)
│   ├── architecture-overview.md  # This file
│   ├── auth-google-oauth.md      # OAuth integration (NEW)
│   └── [Various feature docs]
│
├── *.html                     # Page files (root level)
│   ├── index.html
│   ├── agencies.html
│   ├── share-experience.html
│   ├── news.html
│   ├── guide.html
│   ├── faq.html
│   ├── about.html
│   └── report-problem.html
│
└── README.md                  # Project documentation
```

### Live Code v.1 (Reference/Production)

```
Live Code v.1/Code/
├── backend/                   # Same structure as Full Development
├── frontend/                  # Fully migrated frontend
├── docs/                      # Extensive documentation
├── scripts/                   # Build and utility scripts
├── public/                    # Public static assets
└── [Extensive .md documentation files]
```

---

## 🔧 Component Architecture

### Backend Components

#### 1. Server Core (`server.js`)
```
Express App
├── Security Middleware
│   ├── Helmet (security headers)
│   ├── CORS (cross-origin)
│   ├── CSRF Protection
│   ├── Rate Limiting
│   └── HPP (parameter pollution)
├── Session Management
│   ├── express-session
│   ├── MongoStore (session persistence)
│   └── Passport initialization
├── Static File Serving
│   └── Serves frontend/ or root HTML files
└── API Routes
    ├── /auth/* (OAuth endpoints)
    ├── /api/reviews
    ├── /api/agency-reviews
    ├── /api/reports
    └── /api/health (health check)
```

#### 2. Database Layer (`config/database.js`)
```
MongoDB Connection
├── Mongoose ODM
├── Connection pooling
├── Error handling
├── Connection retry logic
└── Index management
```

#### 3. Authentication (`config/passport.js`)
```
Passport.js
├── Serialization/Deserialization
├── Google OAuth Strategy
│   ├── Client ID/Secret
│   ├── Callback URL
│   ├── Profile extraction
│   └── User.findOrCreate()
└── Facebook OAuth Strategy
    ├── App ID/Secret
    ├── Callback URL
    ├── Profile extraction
    └── User.findOrCreate()
```

#### 4. Data Models

**User Model** (`models/User.js`)
```javascript
{
  googleId: String (indexed)
  facebookId: String (indexed)
  email: String (unique, indexed)
  firstName: String
  lastName: String
  profilePicture: String
  isAdmin: Boolean (default: false)
  createdAt: Date
  lastLogin: Date
}
```

**Review Model** (`models/Review.js`)
```javascript
{
  userId: ObjectId (ref: 'User')
  state: String (indexed)
  rating: Number
  content: String
  jobTitle: String
  city: String
  verified: Boolean
  createdAt: Date
}
```

**AgencyReview Model** (`models/AgencyReview.js`)
```javascript
{
  userId: ObjectId (ref: 'User')
  agencyName: String (indexed)
  rating: Number
  content: String
  recommended: Boolean
  createdAt: Date
}
```

### Frontend Components

#### 1. Page Structure
```
HTML Pages
├── Navigation Header (shared)
├── Login Modal (auth-client.js)
├── Profile Hub (profile-hub.js)
├── Page Content (page-specific)
├── Native Ads (native-ads.js)
└── Footer (shared)
```

#### 2. JavaScript Modules

**Authentication Client** (`scripts/auth-client.js`)
```
AuthManager Class
├── ensureCsrfToken()
├── checkAuthStatus()
├── handleOAuthCallback()
├── getUser()
└── logout()
```

**Login Modal** (`scripts/login-modal.js`)
```
Login UI
├── Modal display/hide
├── OAuth button handlers
├── Error display
└── Redirect after login
```

**Profile Hub** (`scripts/profile-hub.js`)
```
User Profile
├── Display user info
├── Show user reviews
├── Edit profile
└── Delete account
```

---

## 🔄 Data Flow

### 1. User Authentication Flow

```
User clicks "Login"
    ↓
login-modal.js displays modal
    ↓
User clicks "Sign in with Google"
    ↓
Redirect to: /auth/google (backend)
    ↓
Backend: passport.authenticate('google')
    ↓
Redirect to: Google OAuth consent screen
    ↓
User grants permission
    ↓
Google redirects to: /auth/google/callback?code=...
    ↓
Backend: Exchange code for access token
    ↓
Backend: passport GoogleStrategy callback
    ↓
Backend: User.findOrCreate(profile, 'google')
    ↓
Backend: Create session (MongoStore)
    ↓
Backend: Redirect to CLIENT_URL with session cookie
    ↓
Frontend: auth-client.js detects session
    ↓
Frontend: Display logged-in state
```

### 2. Review Submission Flow

```
User fills review form
    ↓
Click "Submit"
    ↓
auth-client.js checks login status
    ↓
IF NOT LOGGED IN:
    → Show login modal
    → Complete auth flow (see above)
    → Return to review flow
    ↓
IF LOGGED IN:
    ↓
    Get CSRF token from /api/csrf-token
    ↓
    POST /api/reviews with:
        ├── Review data
        ├── CSRF token
        └── Session cookie
    ↓
    Backend: Verify CSRF token
    ↓
    Backend: Verify session
    ↓
    Backend: Extract userId from session
    ↓
    Backend: Save review to MongoDB
    ↓
    Backend: Return success response
    ↓
    Frontend: Display confirmation
```

### 3. Agency Search Flow

```
User enters search term
    ↓
agencies.js filters DOM elements
    ↓
Filter by:
    ├── Agency name
    ├── Services offered
    ├── Country
    └── Rating
    ↓
Display matching agencies
    ↓
User clicks agency
    ↓
Display agency details
    ├── Contact info
    ├── Services
    ├── Reviews
    └── Ratings
```

---

## 🔒 Security Architecture

### 1. Security Headers (Helmet)
```javascript
helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "accounts.google.com", "connect.facebook.net"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "localhost:3000"]
    }
  },
  hsts: { maxAge: 31536000, includeSubDomains: true }
})
```

### 2. CORS Configuration
```javascript
{
  origin: [
    'http://localhost:3000',
    'http://localhost:8000',
    'http://127.0.0.1:8000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'CSRF-Token']
}
```

### 3. CSRF Protection
```
Client requests /api/csrf-token
    ↓
Server generates token, stores in session
    ↓
Server returns token to client
    ↓
Client includes token in POST/PUT/DELETE requests
    ↓
Server validates token matches session
```

### 4. Rate Limiting
```javascript
{
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                   // 100 requests per window
  message: 'Too many requests'
}
```

### 5. Session Security
```javascript
{
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: !process.env.ALLOW_INSECURE_HTTP,  // HTTPS only in prod
    httpOnly: true,                            // No JS access
    maxAge: 1000 * 60 * 60 * 24 * 7,          // 7 days
    sameSite: 'lax'                            // CSRF protection
  },
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    touchAfter: 24 * 3600
  })
}
```

### 6. Input Validation
- HPP middleware prevents parameter pollution
- Mongoose schema validation
- DOMPurify on frontend (XSS prevention)
- CSRF token validation on state-changing requests

---

## 📦 Dependencies

### Backend Core Dependencies
```json
{
  "express": "^4.18.0",
  "mongoose": "^6.0.0",
  "passport": "^0.6.0",
  "passport-google-oauth20": "^2.0.0",
  "passport-facebook": "^3.0.0",
  "dotenv": "^16.0.0"
}
```

### Security Dependencies
```json
{
  "helmet": "^6.0.0",
  "cors": "^2.8.5",
  "csurf": "^1.11.0",
  "express-rate-limit": "^6.0.0",
  "hpp": "^0.2.3",
  "express-session": "^1.17.0",
  "connect-mongo": "^4.6.0"
}
```

### Utility Dependencies
```json
{
  "nodemailer": "^6.9.0",
  "nodemon": "^2.0.20"
}
```

---

## ⚙️ Environment Configuration

### Development Environment

**Backend Port**: 3000
**Frontend Port**: 8000 (or served from backend)
**Database**: Local MongoDB on port 27017

### Environment Variables (`.env`)

```bash
# See CLAUDE.md for AI usage discipline

# Server
PORT=3000
NODE_ENV=development
BASE_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/jamwathq

# Session (CRITICAL - use secure random in production)
SESSION_SECRET=[64-character-random-string]

# OAuth - Google
GOOGLE_CLIENT_ID=[redacted].apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=[redacted]
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# OAuth - Facebook
FACEBOOK_APP_ID=[redacted]
FACEBOOK_APP_SECRET=[redacted]
FACEBOOK_CALLBACK_URL=http://localhost:3000/auth/facebook/callback

# CORS
CLIENT_URL=http://localhost:3000,http://localhost:8000,http://127.0.0.1:8000

# Security
ALLOW_INSECURE_HTTP=true  # MUST be false in production

# Email
EMAIL_USER=[redacted]@outlook.com
EMAIL_PASS=[redacted-app-password]
EMAIL_SERVICE=outlook
ADMIN_EMAILS=admin@jamwathq.com
```

**IMPORTANT**: See `backend/.env.example` for full template with instructions.

---

## 🧪 Testing Requirements

### Local Testing Protocol (from CLAUDE.md)

**MANDATORY**: All testing must follow this discipline:

1. **Backend**: Run on port 3000
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Frontend**: Run on port 8000
   ```bash
   # Option 1: Python
   python -m http.server 8000

   # Option 2: Live Server extension in VS Code
   # Right-click index.html → Open with Live Server (configure to port 8000)
   ```

3. **Integration Testing**
   - Both servers must run simultaneously
   - Test OAuth flow end-to-end
   - Verify CSRF protection
   - Check CORS configuration
   - Validate session persistence

4. **Production Deployment**
   - ❌ DISABLED during development
   - ✅ Only after explicit approval
   - ✅ Only after local testing complete
   - ✅ Only after documentation updated

---

## 📊 System Components Summary

| Component | Technology | Port | Purpose |
|-----------|------------|------|---------|
| Backend API | Express.js | 3000 | REST API, OAuth, Sessions |
| Frontend | HTML/CSS/JS | 8000 | User interface |
| Database | MongoDB | 27017 | Data persistence |
| Session Store | MongoDB | 27017 | Session persistence |
| OAuth Provider | Google/Facebook | N/A | Authentication |

---

## 🔗 Related Documentation

- **[CLAUDE.md](../CLAUDE.md)** - AI usage discipline and workflow
- **[auth-google-oauth.md](auth-google-oauth.md)** - OAuth implementation details
- **[AUTHENTICATION_SETUP.md](../AUTHENTICATION_SETUP.md)** - Auth setup guide
- **[QUICK_START.md](../QUICK_START.md)** - Getting started guide
- **[MONGODB_COMPASS_GUIDE.md](../MONGODB_COMPASS_GUIDE.md)** - Database management

---

## 🔄 Version History

- **v1.0** (2025-10-27) - Initial architecture documentation
  - System overview
  - Component breakdown
  - Data flow diagrams
  - Security architecture
  - Testing requirements

---

## 📝 Maintenance Notes

**Update This Document When:**
- New components are added
- Architecture changes are made
- New dependencies are introduced
- Security policies change
- Deployment model changes

**Review Frequency**: After each major feature addition or architectural change

**Maintainer**: Development Team
**Last Updated**: 2025-10-27

---

**Following**: CLAUDE.md workflow discipline
**Testing Protocol**: Backend :3000, Frontend :8000
**Production**: Disabled during development
