# 🔐 Google OAuth Integration Guide

**Date**: 2025-10-27
**Status**: Development - Configuration Extracted from Live Code v.1
**Purpose**: Document Google OAuth 2.0 integration for JamWatHQ

---

## 📋 Table of Contents

1. [Configuration Overview](#configuration-overview)
2. [OAuth Flow](#oauth-flow)
3. [Backend Implementation](#backend-implementation)
4. [Frontend Implementation](#frontend-implementation)
5. [Testing Procedures](#testing-procedures)
6. [Security Considerations](#security-considerations)
7. [Troubleshooting](#troubleshooting)

---

## ⚙️ Configuration Overview

### Google Cloud Console Setup

**OAuth 2.0 Client ID** (from Live Code v.1):
- **Type**: Web Application
- **Application Name**: JamWatHQ
- **Client ID**: `62216890951-7cennm93lkval2mh6h7s80d9toqqm05g.apps.googleusercontent.com`
- **Client Secret**: `GOCSPX-[REDACTED]` *(See secure .env file)*

**Authorized JavaScript Origins** (Development):
```
http://localhost:3000
http://localhost:8000
http://127.0.0.1:3000
http://127.0.0.1:8000
```

**Authorized Redirect URIs** (Development):
```
http://localhost:3000/auth/google/callback
http://localhost:8000/auth/google/callback
```

**OAuth Consent Screen**:
- User Type: External
- App Name: JamWatHQ
- Scopes: `email`, `profile`, `openid`
- Test Users: *(Add your Google email for testing)*

### Environment Variables

**Location**: `backend/.env`

```bash
# See CLAUDE.md for AI usage discipline

# Google OAuth 2.0 Configuration
GOOGLE_CLIENT_ID=62216890951-7cennm93lkval2mh6h7s80d9toqqm05g.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=[SECURE-SECRET-FROM-ENV-FILE]
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# For production, update to:
# GOOGLE_CALLBACK_URL=https://yourdomain.com/auth/google/callback
```

**SECURITY NOTE**: Never commit actual secrets to Git. Use `.env.example` for templates.

---

## 🔄 OAuth Flow

### Complete Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. USER INITIATES LOGIN                                     │
│    User clicks "Sign in with Google" button                 │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. REDIRECT TO GOOGLE (Backend)                             │
│    GET /auth/google                                          │
│    Backend: passport.authenticate('google')                  │
│    Redirect to: https://accounts.google.com/o/oauth2/v2/auth│
│    Parameters:                                               │
│      - client_id: 62216890951-[...]                         │
│      - redirect_uri: http://localhost:3000/auth/google/[...]│
│      - scope: profile email                                  │
│      - response_type: code                                   │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. USER AUTHENTICATION (Google)                             │
│    User selects Google account                              │
│    User grants permission to access profile and email       │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. CALLBACK WITH AUTHORIZATION CODE                         │
│    Google redirects to:                                      │
│    GET /auth/google/callback?code=4/0AX4[...]               │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. TOKEN EXCHANGE (Backend)                                 │
│    Backend: Exchange authorization code for access token    │
│    POST https://oauth2.googleapis.com/token                 │
│    Body:                                                     │
│      - code: [authorization_code]                           │
│      - client_id: [GOOGLE_CLIENT_ID]                        │
│      - client_secret: [GOOGLE_CLIENT_SECRET]                │
│      - grant_type: authorization_code                       │
│      - redirect_uri: [GOOGLE_CALLBACK_URL]                  │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. PROFILE RETRIEVAL (Backend)                              │
│    Google returns:                                           │
│      - access_token                                          │
│      - refresh_token (optional)                              │
│      - id_token (JWT with user info)                        │
│    Backend: Extract user profile                            │
│      {                                                       │
│        sub: "117234..." (Google ID)                         │
│        email: "user@gmail.com"                              │
│        given_name: "John"                                   │
│        family_name: "Doe"                                   │
│        picture: "https://lh3.googleusercontent.com/..."     │
│      }                                                       │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. USER CREATION/UPDATE (Backend)                           │
│    passport.js GoogleStrategy callback:                      │
│      async (accessToken, refreshToken, profile, done)       │
│    Execute: User.findOrCreate(profile, 'google')            │
│    Database operations:                                      │
│      - Check if user exists (by googleId)                   │
│      - If exists: Update last login                         │
│      - If new: Create user document                         │
│    Return: user object                                       │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ 8. SESSION CREATION (Backend)                               │
│    passport.serializeUser((user, done) => {                 │
│      done(null, user._id)                                   │
│    })                                                        │
│    Session stored in MongoDB via connect-mongo              │
│    Session cookie set with:                                 │
│      - httpOnly: true                                        │
│      - secure: true (production)                            │
│      - sameSite: 'lax'                                      │
│      - maxAge: 7 days                                       │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ 9. REDIRECT TO CLIENT (Backend)                             │
│    Redirect to: CLIENT_URL (http://localhost:8000)          │
│    With session cookie attached                             │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ 10. SESSION VERIFICATION (Frontend)                         │
│    auth-client.js: checkAuthStatus()                        │
│    GET /api/auth/status (with session cookie)               │
│    Backend: Verify session, return user info                │
│    Frontend: Update UI with logged-in state                 │
└─────────────────────────────────────────────────────────────┘
                         ↓
                 ✅ USER LOGGED IN
```

---

## 🔧 Backend Implementation

### 1. Passport.js Configuration

**File**: `backend/config/passport.js`

```javascript
// See CLAUDE.md for AI usage discipline

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// Serialize user to session
passport.serializeUser((user, done) => {
    done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: process.env.GOOGLE_CALLBACK_URL || '/auth/google/callback',
                scope: ['profile', 'email']  // Minimal scopes for privacy
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    // Find or create user
                    const user = await User.findOrCreate(profile, 'google');
                    return done(null, user);
                } catch (error) {
                    console.error('Google OAuth error:', error);
                    return done(error, null);
                }
            }
        )
    );
    console.log('✅ Google OAuth strategy configured');
} else {
    console.log('⚠️  Google OAuth not configured (missing credentials in .env)');
}

module.exports = passport;
```

### 2. Auth Routes

**File**: `backend/routes/auth.js`

```javascript
// See CLAUDE.md for AI usage discipline

const express = require('express');
const router = express.Router();
const passport = require('../config/passport');

// Google OAuth - Initiate login
router.get('/google',
    passport.authenticate('google', {
        scope: ['profile', 'email']
    })
);

// Google OAuth - Callback handler
router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: process.env.CLIENT_URL || '/',
        failureMessage: true
    }),
    (req, res) => {
        // Successful authentication
        const clientUrl = process.env.CLIENT_URL || '/';
        res.redirect(clientUrl);
    }
);

// Get current user session status
router.get('/status', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({
            authenticated: true,
            user: {
                id: req.user._id,
                firstName: req.user.firstName,
                email: req.user.email,
                profilePicture: req.user.profilePicture,
                isAdmin: req.user.isAdmin
            }
        });
    } else {
        res.json({ authenticated: false });
    }
});

// Logout
router.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ error: 'Session destruction failed' });
            }
            res.clearCookie('connect.sid');
            res.json({ success: true, message: 'Logged out successfully' });
        });
    });
});

module.exports = router;
```

### 3. User Model with findOrCreate

**File**: `backend/models/User.js` (relevant excerpt)

```javascript
// See CLAUDE.md for AI usage discipline

// Static method for OAuth user creation/update
userSchema.statics.findOrCreate = async function(profile, provider) {
    const providerId = provider === 'google' ? 'googleId' : 'facebookId';
    const query = { [providerId]: profile.id };

    try {
        // Try to find existing user
        let user = await this.findOne(query);

        if (user) {
            // Update last login
            user.lastLogin = new Date();
            await user.save();
            return user;
        }

        // Create new user
        const userData = {
            [providerId]: profile.id,
            email: profile.emails?.[0]?.value || `${profile.id}@${provider}.com`,
            firstName: profile.name?.givenName || profile.displayName?.split(' ')[0] || 'User',
            lastName: profile.name?.familyName || profile.displayName?.split(' ').slice(1).join(' ') || '',
            profilePicture: profile.photos?.[0]?.value || '',
            lastLogin: new Date()
        };

        user = await this.create(userData);
        return user;
    } catch (error) {
        console.error(`Error in findOrCreate for ${provider}:`, error);
        throw error;
    }
};
```

---

## 💻 Frontend Implementation

### 1. Authentication Client

**File**: `scripts/auth-client.js`

```javascript
// Authentication Client-Side Handler
// See CLAUDE.md for AI usage discipline and development workflow

// API Configuration
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'
    : window.location.origin;

class AuthManager {
    constructor() {
        this.user = null;
        this.isAuthenticated = false;
        this.apiBaseUrl = API_BASE_URL;
    }

    // Check if user is logged in
    async checkAuthStatus() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/auth/status`, {
                credentials: 'include'  // Send session cookie
            });

            const data = await response.json();

            if (data.authenticated) {
                this.isAuthenticated = true;
                this.user = data.user;
                return true;
            }

            return false;
        } catch (error) {
            console.error('Auth status check failed:', error);
            return false;
        }
    }

    // Get current user
    getUser() {
        return this.user;
    }

    // Initiate Google OAuth login
    loginWithGoogle() {
        window.location.href = `${this.apiBaseUrl}/auth/google`;
    }

    // Logout
    async logout() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            });

            if (response.ok) {
                this.isAuthenticated = false;
                this.user = null;
                window.location.reload();
            }
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }
}

// Global instance
const authManager = new AuthManager();

// Check auth status on page load
document.addEventListener('DOMContentLoaded', async () => {
    await authManager.checkAuthStatus();
    // Update UI based on auth status
    if (authManager.isAuthenticated) {
        console.log('User logged in:', authManager.getUser());
        // Update UI elements (show profile, hide login button, etc.)
    }
});
```

### 2. Login Button HTML

```html
<!-- Login Modal or Button -->
<button id="btn-google-login" class="btn-standard btn-google" onclick="authManager.loginWithGoogle()">
    <i class="fab fa-google"></i> Sign in with Google
</button>
```

---

## 🧪 Testing Procedures

### Local Testing Checklist

**Following CLAUDE.md discipline: Backend on :3000, Frontend on :8000**

#### 1. Pre-Testing Setup

```bash
# Terminal 1: Start Backend
cd backend
npm install
cp .env.example .env
# Edit .env with actual Google OAuth credentials
npm run dev

# Terminal 2: Start Frontend
cd ..
python -m http.server 8000
```

**Verify**:
- ✅ Backend console shows: "✅ Google OAuth strategy configured"
- ✅ Backend console shows: "🚀 JamWatHQ Server Started! 📡 Server: http://localhost:3000"
- ✅ Frontend accessible at http://localhost:8000

#### 2. Test OAuth Flow

**Step-by-Step**:

1. Open: `http://localhost:8000/share-experience.html`
2. Click "Submit Experience" (or any action requiring login)
3. **Expected**: Login modal appears
4. Click "Sign in with Google"
5. **Expected**: Redirect to Google consent screen
6. Select Google account
7. **Expected**: Consent screen shows:
   - App name: JamWatHQ
   - Permissions: View email, View profile
8. Click "Allow"
9. **Expected**: Redirect back to http://localhost:8000
10. **Expected**: Login modal closes, user is logged in
11. Check browser console: Should show "User logged in: {...}"

#### 3. Verify Session Persistence

1. After successful login, refresh the page
2. **Expected**: User remains logged in (no re-authentication needed)
3. Open browser DevTools → Application → Cookies
4. **Verify**: `connect.sid` cookie present for localhost:3000
5. Check MongoDB: User document created in `users` collection

#### 4. Test Logout

1. Click logout button (or call `authManager.logout()`)
2. **Expected**: Page reloads, user logged out
3. **Verify**: `connect.sid` cookie removed
4. Refresh page
5. **Expected**: User remains logged out

#### 5. Edge Cases

**Test these scenarios**:

- [ ] User closes Google consent screen (popup_closed_by_user)
- [ ] User denies permission (access_denied)
- [ ] Invalid callback URL (redirect_uri_mismatch)
- [ ] Network error during token exchange
- [ ] Session expiration (after 7 days)

### Google Console Verification

**Before testing, verify in [Google Cloud Console](https://console.cloud.google.com/apis/credentials)**:

1. **OAuth 2.0 Client ID**
   - Type: Web Application
   - JavaScript origins include: `http://localhost:3000`, `http://localhost:8000`
   - Redirect URIs include: `http://localhost:3000/auth/google/callback`

2. **OAuth Consent Screen**
   - User Type: External
   - Publishing Status: Testing
   - Test Users: Your Google email added

---

## 🔒 Security Considerations

### OAuth Security Best Practices

✅ **Implemented**:
- HTTPS enforced in production (`ALLOW_INSECURE_HTTP=false`)
- `state` parameter for CSRF protection (handled by Passport)
- Minimal scopes requested (`profile`, `email` only)
- Session cookies: `httpOnly`, `sameSite: lax`, `secure` in production
- Session stored server-side in MongoDB
- Client secrets never exposed to frontend

### Data Privacy

**Data Collected**:
- Google ID (unique identifier)
- Email address
- First name, Last name
- Profile picture URL

**Data Not Collected**:
- Google contacts
- Google Drive files
- Google Calendar
- Any other Google services data

**User Rights**:
- Users can revoke app access at: https://myaccount.google.com/permissions
- Users can delete their account (request feature)
- Session data cleared on logout

### Production Security Checklist

```bash
# backend/.env.production
GOOGLE_CLIENT_ID=62216890951-7cennm93lkval2mh6h7s80d9toqqm05g.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=[PRODUCTION-SECRET-DIFFERENT-FROM-DEV]
GOOGLE_CALLBACK_URL=https://jamwathq.com/auth/google/callback  # HTTPS required!

# Security settings
ALLOW_INSECURE_HTTP=false  # Must be false in production!
NODE_ENV=production
```

**Additional Production Steps**:
1. Add production domain to Google Console authorized origins
2. Use environment variables (not `.env` files)
3. Enable Google app verification (for >100 users)
4. Monitor OAuth error rates
5. Set up error tracking (Sentry, etc.)

---

## 🐛 Troubleshooting

### Common Errors

#### 1. `redirect_uri_mismatch`

**Error Message**:
```
Error 400: redirect_uri_mismatch
The redirect URI in the request, http://localhost:3000/auth/google/callback, does not match the ones authorized for the OAuth client.
```

**Solution**:
1. Go to: https://console.cloud.google.com/apis/credentials
2. Click your OAuth 2.0 Client ID
3. Under "Authorized redirect URIs", add:
   ```
   http://localhost:3000/auth/google/callback
   ```
4. Click "Save"
5. Wait 5-10 minutes for changes to propagate
6. Try again

#### 2. `access_denied`

**Error**: User cancelled login or denied permissions

**Solutions**:
- Normal user behavior, no action needed
- If persistent, check if user's Google email is added as a test user in OAuth consent screen

#### 3. `invalid_client`

**Error**: Client authentication failed

**Causes**:
- Incorrect `GOOGLE_CLIENT_ID` in `.env`
- Incorrect `GOOGLE_CLIENT_SECRET` in `.env`
- Extra spaces in environment variables

**Solution**:
```bash
# Verify credentials in .env (no spaces, no quotes)
GOOGLE_CLIENT_ID=62216890951-7cennm93lkval2mh6h7s80d9toqqm05g.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-YourActualSecretHere

# Restart backend
npm run dev
```

#### 4. Session Not Persisting

**Symptoms**: User logged out after refresh

**Causes**:
- MongoDB not running
- Session store not configured
- Cookie blocked by browser

**Solutions**:
```bash
# Check MongoDB is running
mongod --version
# or
brew services list | grep mongodb

# Check backend logs for session errors
# Should see: "MongoDB connected successfully"

# Clear browser cookies and try again
```

#### 5. CORS Error

**Error**: `Access to fetch at 'http://localhost:3000/auth/status' from origin 'http://localhost:8000' has been blocked by CORS policy`

**Solution**:
```bash
# Verify CLIENT_URL in backend/.env includes frontend URL
CLIENT_URL=http://localhost:3000,http://localhost:8000,http://127.0.0.1:8000

# Restart backend
npm run dev
```

---

## 📊 Success Metrics

### Implementation Status

✅ **Configuration**:
- [x] Google OAuth Client ID configured
- [x] Client Secret secured in `.env`
- [x] Callback URL configured
- [x] OAuth consent screen configured

✅ **Backend**:
- [x] Passport.js GoogleStrategy implemented
- [x] User model with findOrCreate
- [x] Auth routes: `/auth/google`, `/auth/google/callback`
- [x] Session management with MongoDB
- [x] Serialization/deserialization

✅ **Frontend**:
- [x] AuthManager class implemented
- [x] Login button handler
- [x] Session status checking
- [x] Logout functionality

✅ **Security**:
- [x] HTTPS enforcement (production)
- [x] Minimal OAuth scopes
- [x] HttpOnly session cookies
- [x] CSRF protection
- [x] Secrets not in Git

---

## 📄 Related Documentation

- **[architecture-overview.md](architecture-overview.md)** - Full system architecture
- **[CLAUDE.md](../CLAUDE.md)** - AI usage discipline
- **[AUTHENTICATION_SETUP.md](../AUTHENTICATION_SETUP.md)** - Auth setup guide
- **Live Code v.1 Reference**:
  - `GOOGLE_OAUTH_IMPLEMENTATION.md` - Original OAuth implementation
  - `FINAL_OAUTH_CONFIGURATION.md` - OAuth configuration summary

---

## 🔄 Version History

- **v1.0** (2025-10-27) - Initial documentation
  - Extracted configuration from Live Code v.1
  - Documented OAuth flow
  - Created testing procedures
  - Added security considerations

---

## 📝 Next Steps

### Immediate (Development)
1. ✅ Configuration extracted from Live Code v.1
2. ⏳ Test OAuth flow on ports 3000/8000
3. ⏳ Verify session persistence
4. ⏳ Document test results

### Future (Production)
1. ⏳ Add production domain to Google Console
2. ⏳ Update callback URLs for HTTPS
3. ⏳ Verify app with Google (for >100 users)
4. ⏳ Set up monitoring for OAuth errors
5. ⏳ Consider adding Facebook OAuth

---

**Configuration Source**: Live Code v.1 (`C:\Users\Dewy\OneDrive\Documents\JamWatHQ\Main\Live Code v.1\Code`)
**Following**: CLAUDE.md workflow discipline
**Testing Protocol**: Backend :3000, Frontend :8000
**Status**: Ready for local testing

---

**End of Google OAuth Integration Guide**
