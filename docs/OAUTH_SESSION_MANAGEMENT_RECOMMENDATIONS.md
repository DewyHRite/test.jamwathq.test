# OAuth Session Management Recommendations

**Date:** 2025-10-17
**Purpose:** Best practices and recommendations for managing Google and Facebook OAuth sessions

---

## Executive Summary

This document provides comprehensive recommendations for improving authentication rate limiting and session management for your Google and Facebook OAuth implementation.

---

## Problem: Rate Limiting Error

### Current Issue
Users experiencing: `{"success":false,"message":"Too many authentication attempts. Please retry in 15 minutes."}`

### Root Cause
The `authLimiter` in [backend/server.js:155-167](backend/server.js#L155-L167) restricts ALL `/auth` routes to **20 requests per 15 minutes**.

**Affected Routes:**
- `/auth/google` - Google login initiation
- `/auth/google/callback` - Google callback
- `/auth/facebook` - Facebook login initiation
- `/auth/facebook/callback` - Facebook callback
- `/auth/status` - Authentication status check (called frequently)
- `/auth/logout` - User logout

**Primary Culprit:** The `/auth/status` endpoint is called every time a page loads or the profile hub checks authentication state, quickly exhausting the 20-request limit.

---

## Immediate Fixes

### Option 1: Increase Limit (Quick Fix)

**File:** `backend/server.js` line 157

**Change:**
```javascript
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,  // ← Increased from 20
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many authentication attempts. Please retry in 15 minutes.'
    }
});
```

**Pros:** Simple, immediate fix
**Cons:** Still a blanket limit on all auth routes

---

### Option 2: Skip Successful Requests (Recommended)

**File:** `backend/server.js` lines 155-167

**Change:**
```javascript
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    skipSuccessfulRequests: true,  // ← Only count failed attempts
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many authentication attempts. Please retry in 15 minutes.'
    }
});
```

**Pros:** Prevents brute force attacks while allowing normal usage
**Cons:** Requires response status codes to be properly set

---

### Option 3: Separate Limiters (Best Practice)

**File:** `backend/server.js` lines 155-179

**Implementation:**
```javascript
// Strict limiter for login attempts (prevent brute force)
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 10,                    // 10 login attempts
    skipSuccessfulRequests: true,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many login attempts. Please try again later.'
    }
});

// Lenient limiter for status checks and logout
const statusLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 100,                   // 100 status checks
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many requests. Please slow down.'
    }
});

// Apply different limits to different routes
app.use('/auth/google', loginLimiter);
app.use('/auth/google/callback', loginLimiter);
app.use('/auth/facebook', loginLimiter);
app.use('/auth/facebook/callback', loginLimiter);
app.use('/auth/status', statusLimiter);
app.use('/auth/logout', statusLimiter);
```

**Pros:** Granular control, prevents abuse while allowing normal use
**Cons:** More complex configuration

---

## Google OAuth Best Practices

### 1. Token Management

**Current Behavior:**
- Google access tokens expire after 1 hour
- Passport.js handles basic token management

**Recommendations:**

**A. Request Offline Access for Refresh Tokens**

**File:** `backend/config/passport.js`

**Update Google Strategy:**
```javascript
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    accessType: 'offline',      // ← Request refresh token
    prompt: 'consent'           // ← Force consent to get refresh token
}, async (accessToken, refreshToken, profile, done) => {
    // Store refreshToken in user document
    // ...existing code...
}));
```

**B. Store Refresh Tokens Securely**

Add to User model:
```javascript
googleRefreshToken: {
    type: String,
    encrypted: true  // Use encryption if available
}
```

**C. Implement Token Refresh**

Create utility function:
```javascript
// backend/utils/tokenRefresh.js
const refreshGoogleToken = async (user) => {
    if (!user.googleRefreshToken) {
        throw new Error('No refresh token available');
    }

    const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            refresh_token: user.googleRefreshToken,
            grant_type: 'refresh_token'
        })
    });

    const data = await response.json();
    return data.access_token;  // New access token (1 hour expiry)
};
```

---

### 2. Session Configuration

**Current Configuration:** Good foundation already in place

**File:** `backend/server.js` lines 80-95

**Recommended Enhancements:**
```javascript
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        touchAfter: 24 * 3600,
        crypto: {
            secret: process.env.SESSION_SECRET  // ← Encrypt session data
        }
    }),
    cookie: {
        secure: process.env.NODE_ENV === 'production',  // HTTPS in production
        httpOnly: true,                                  // Prevent XSS
        sameSite: 'lax',                                // ← Add CSRF protection
        maxAge: 1000 * 60 * 60 * 24 * 30                // ← 30 days (was 7)
    }
}));
```

**Changes:**
1. Added `sameSite: 'lax'` for CSRF protection
2. Increased `maxAge` to 30 days for better UX
3. Added session encryption in MongoDB store

---

### 3. Error Handling

**Create Middleware for Token Validation:**

```javascript
// backend/middleware/validateToken.js
const validateGoogleToken = async (req, res, next) => {
    if (!req.user || !req.user.googleId) {
        return next();  // Not a Google user
    }

    try {
        // Check if token is still valid
        const response = await fetch(
            `https://oauth2.googleapis.com/tokeninfo?access_token=${req.user.googleAccessToken}`
        );

        if (!response.ok) {
            // Token expired - attempt refresh
            const newToken = await refreshGoogleToken(req.user);
            req.user.googleAccessToken = newToken;
            await req.user.save();
        }

        next();
    } catch (error) {
        console.error('Token validation failed:', error);
        // Clear session and redirect to login
        req.logout();
        res.redirect('/');
    }
};
```

---

## Facebook OAuth Best Practices

### 1. Long-Lived Token Exchange

**Problem:** Facebook access tokens expire after 1-2 hours by default

**Solution:** Exchange for long-lived tokens (60 days)

**File:** `backend/config/passport.js`

**Implementation:**
```javascript
// Add utility function
const exchangeFacebookToken = async (shortLivedToken) => {
    try {
        const response = await fetch(
            `https://graph.facebook.com/oauth/access_token?` +
            `grant_type=fb_exchange_token&` +
            `client_id=${process.env.FACEBOOK_APP_ID}&` +
            `client_secret=${process.env.FACEBOOK_APP_SECRET}&` +
            `fb_exchange_token=${shortLivedToken}`
        );

        const data = await response.json();
        return data.access_token;  // 60-day token
    } catch (error) {
        console.error('Token exchange failed:', error);
        return shortLivedToken;  // Fall back to short-lived token
    }
};

// Update Facebook Strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    profileFields: ['id', 'emails', 'name', 'picture']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Exchange for long-lived token
        const longLivedToken = await exchangeFacebookToken(accessToken);

        // Store longLivedToken in user document
        // ...existing code...
    } catch (error) {
        return done(error);
    }
}));
```

---

### 2. Token Validation

**Validate Facebook Tokens Periodically:**

```javascript
// backend/utils/facebookTokenValidation.js
const validateFacebookToken = async (accessToken) => {
    try {
        const response = await fetch(
            `https://graph.facebook.com/debug_token?` +
            `input_token=${accessToken}&` +
            `access_token=${process.env.FACEBOOK_APP_ID}|${process.env.FACEBOOK_APP_SECRET}`
        );

        const data = await response.json();

        if (!data.data.is_valid) {
            throw new Error('Token is invalid');
        }

        // Check expiration
        const expiresAt = data.data.expires_at;
        const now = Math.floor(Date.now() / 1000);

        if (expiresAt && expiresAt < now) {
            throw new Error('Token has expired');
        }

        return true;
    } catch (error) {
        console.error('Facebook token validation failed:', error);
        return false;
    }
};
```

---

### 3. Permission Management

**Request Minimum Permissions:**

```javascript
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    profileFields: ['id', 'emails', 'name', 'picture'],
    scope: ['email', 'public_profile']  // ← Minimum required permissions
}, // ...callback...
));
```

**Handle Permission Denials:**

```javascript
// In Facebook callback route
app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/' }),
    (req, res) => {
        // Check if email permission was granted
        if (!req.user.email) {
            req.flash('error', 'Email permission is required to use this service');
            return res.redirect('/');
        }

        res.redirect('/agencies');
    }
);
```

---

## Additional Recommendations

### 1. Environment-Based Configuration

**Create separate configs for development and production:**

```javascript
// backend/config/rateLimits.js
module.exports = {
    development: {
        login: { windowMs: 15 * 60 * 1000, max: 100 },
        status: { windowMs: 15 * 60 * 1000, max: 1000 }
    },
    production: {
        login: { windowMs: 15 * 60 * 1000, max: 10 },
        status: { windowMs: 15 * 60 * 1000, max: 100 }
    }
};

// In server.js
const rateLimitConfig = require('./config/rateLimits')[process.env.NODE_ENV || 'development'];

const loginLimiter = rateLimit({
    ...rateLimitConfig.login,
    skipSuccessfulRequests: true
});
```

---

### 2. Monitoring and Logging

**Add logging for authentication events:**

```javascript
// backend/middleware/authLogger.js
const authLogger = (req, res, next) => {
    const originalSend = res.send;

    res.send = function(data) {
        // Log auth attempts
        if (req.path.includes('/auth/')) {
            console.log({
                timestamp: new Date(),
                path: req.path,
                ip: req.ip,
                user: req.user?.email || 'anonymous',
                statusCode: res.statusCode
            });
        }

        originalSend.call(this, data);
    };

    next();
};

app.use('/auth', authLogger);
```

---

### 3. Client-Side Improvements

**A. Reduce Status Check Frequency**

**File:** `frontend/scripts/profile-hub.js` line 67

**Current:** Checks immediately on page load
**Recommendation:** Add caching to reduce server calls

```javascript
// Cache auth status in sessionStorage
function updateProfileHub() {
    const profileBtn = document.getElementById('profile-hub-btn');
    if (!profileBtn) return;

    // Check cache first
    const cachedStatus = sessionStorage.getItem('authStatus');
    const cacheTime = sessionStorage.getItem('authStatusTime');
    const now = Date.now();

    // Use cache if less than 5 minutes old
    if (cachedStatus && cacheTime && (now - parseInt(cacheTime)) < 5 * 60 * 1000) {
        const status = JSON.parse(cachedStatus);
        updateUIWithStatus(status);
        return;
    }

    // Check with server
    if (window.authManager) {
        window.authManager.checkAuthStatus().then(status => {
            // Update cache
            sessionStorage.setItem('authStatus', JSON.stringify(status));
            sessionStorage.setItem('authStatusTime', now.toString());

            updateUIWithStatus(status);
        });
    }
}

function updateUIWithStatus(status) {
    const profileBtn = document.getElementById('profile-hub-btn');
    if (status.authenticated && status.user) {
        const username = status.user.firstName || status.user.name || status.user.email.split('@')[0];
        profileBtn.innerHTML = `<span class="profile-username">${username}</span><span class="profile-logout">(Logout)</span>`;
        profileBtn.classList.add('logged-in');
    } else {
        profileBtn.textContent = 'Login';
        profileBtn.classList.remove('logged-in');
    }
}
```

**B. Implement Retry Logic with Exponential Backoff**

```javascript
// frontend/scripts/auth-client.js
const retryWithBackoff = async (fn, maxRetries = 3) => {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            if (error.message.includes('Too many') && i < maxRetries - 1) {
                // Exponential backoff: 1s, 2s, 4s
                const delay = Math.pow(2, i) * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }
            throw error;
        }
    }
};
```

---

## Implementation Priority

### High Priority (Implement Immediately)
1. ✅ **Option 3: Separate Rate Limiters** - Fixes current issue while maintaining security
2. ✅ **Add sameSite cookie attribute** - Improves security
3. ✅ **Client-side caching** - Reduces server load

### Medium Priority (Implement This Week)
4. ⏳ **Facebook long-lived token exchange** - Improves user experience
5. ⏳ **Environment-based rate limit configs** - Better dev experience
6. ⏳ **Auth event logging** - Better monitoring

### Low Priority (Future Enhancement)
7. 📋 **Google refresh token implementation** - Long-term session management
8. 📋 **Token validation middleware** - Proactive token refresh
9. 📋 **Facebook token validation** - Additional security layer

---

## Testing Checklist

After implementing changes:

- [ ] Verify users can log in with Google without hitting rate limit
- [ ] Verify users can log in with Facebook without hitting rate limit
- [ ] Verify `/auth/status` can be called frequently (>20 times in 15 min)
- [ ] Test rate limiter still blocks actual brute force attempts
- [ ] Test session persists for 30 days
- [ ] Test logout works correctly
- [ ] Verify profile hub updates correctly across all pages
- [ ] Test on mobile devices
- [ ] Monitor server logs for auth errors

---

## Summary

**Root Cause:** Single rate limiter (20 req/15min) applied to all auth routes, including frequently-called `/auth/status`

**Quick Fix:** Increase limit to 100 requests

**Best Fix:** Implement separate rate limiters for login (strict) vs status checks (lenient)

**Long-term:**
- Implement client-side caching
- Exchange Facebook tokens for long-lived versions
- Add comprehensive logging
- Implement token refresh strategies

---

**Last Updated:** 2025-10-17
**Next Review:** After implementing high-priority items
