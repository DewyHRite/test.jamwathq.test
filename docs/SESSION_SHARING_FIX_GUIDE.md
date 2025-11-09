# Session Sharing Fix Guide
## Synchronizing Login Sessions Between Agencies and Share Experience Pages

**Date:** October 15, 2025
**Priority:** High
**Status:** Not Yet Implemented

---

## 🔍 Problem Identified

**Current Situation:**
- **Share Experience Page** (`share-experience.html`): Uses OAuth authentication via `auth-client.js` with server-side sessions
- **Agencies Page** (`agencies.html`): Uses `sessionStorage` for client-side-only session management

**Issue:**
Users who log in on one page are NOT logged in on the other page because they use different authentication mechanisms.

---

## ✅ Solution Overview

### Goal
Both pages should use the same server-side OAuth authentication system via `authManager` from `auth-client.js`.

### Benefits
1. Login persists across both pages
2. Single source of truth for authentication
3. Consistent user experience
4. Secure server-side session management
5. Automatic session expiration handling

---

## 📝 Implementation Steps

### Step 1: Add auth-client.js to agencies.html

**Location:** Before closing `</body>` tag in `frontend/agencies.html`

**Add this line:**
```html
<script src="scripts/auth-client.js"></script>
```

**Current script section in agencies.html (around line 17400+):**
```html
<script src="scripts/jquery.min.js"></script>
<script src="scripts/jquery.dropotron.min.js"></script>
<script src="scripts/browser.min.js"></script>
<script src="scripts/breakpoints.min.js"></script>
<script src="scripts/util.js"></script>
<script src="scripts/main.js"></script>
<!-- ADD HERE -->
<script src="scripts/auth-client.js"></script>
```

---

### Step 2: Replace Session Storage Functions

**Find and replace the following in agencies.html:**

#### A. Replace `checkExistingSession()` function

**OLD CODE (around line 17219-17230):**
```javascript
function checkExistingSession() {
    const savedUser = sessionStorage.getItem('user');
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');

    if (isLoggedIn === 'true' && savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
            isUserLoggedIn = true;
            console.log('User session restored:', currentUser);
        } catch (error) {
            console.error('Error restoring session:', error);
            sessionStorage.clear();
        }
    }
}
```

**NEW CODE:**
```javascript
async function checkExistingSession() {
    try {
        const authStatus = await window.authManager.checkAuthStatus();

        if (authStatus.authenticated && authStatus.user) {
            currentUser = authStatus.user;
            isUserLoggedIn = true;
            console.log('User session restored:', currentUser);
        } else {
            isUserLoggedIn = false;
            currentUser = null;
        }

        updateHUD();
    } catch (error) {
        console.error('Error checking auth status:', error);
        isUserLoggedIn = false;
        currentUser = null;
    }
}
```

---

#### B. Replace Google OAuth callback handler

**OLD CODE (around line 17162-17198):**
```javascript
function handleGoogleLogin(response) {
    console.log('Google login response received');

    try {
        const payload = parseJwt(response.credential);

        currentUser = {
            id: payload.sub,
            email: payload.email,
            firstName: payload.given_name || payload.name || 'User',
            profilePicture: payload.picture || ''
        };

        isUserLoggedIn = true;

        // Store in sessionStorage for persistence
        sessionStorage.setItem('user', JSON.stringify(currentUser));
        sessionStorage.setItem('isLoggedIn', 'true');

        // Close login modal
        closeLoginModal();

        // Update HUD to show logged-in state
        updateHUD();

        // If there's pending review data, show TOS modal
        if (pendingReviewData) {
            openTOSModal();
        }
    } catch (error) {
        console.error('Error handling Google login:', error);
        alert('Login failed. Please try again.');
    }
}
```

**NEW CODE:**
```javascript
// Remove this entire function - OAuth is now handled by the backend
// The user will be redirected to /auth/google which handles the OAuth flow
```

---

#### C. Update login button handlers

**OLD CODE:**
```javascript
<button onclick="handleGoogleLogin()" ...>Sign in with Google</button>
```

**NEW CODE:**
```javascript
<button onclick="initiateGoogleLogin()" ...>Sign in with Google</button>
<button onclick="initiateFacebookLogin()" ...>Sign in with Facebook</button>
```

**Add these functions:**
```javascript
function initiateGoogleLogin() {
    window.location.href = '/auth/google';
}

function initiateFacebookLogin() {
    window.location.href = '/auth/facebook';
}
```

---

#### D. Update logout function

**OLD CODE (around line 17243-17245):**
```javascript
function logout() {
    sessionStorage.clear();
    isUserLoggedIn = false;
    currentUser = null;
    updateHUD();
}
```

**NEW CODE:**
```javascript
function logout() {
    if (confirm('Are you sure you want to log out?')) {
        window.location.href = '/auth/logout';
    }
}
```

---

#### E. Update DOMContentLoaded event

**OLD CODE (around line 17430):**
```javascript
document.addEventListener('DOMContentLoaded', function() {
    checkExistingSession();
    updateHUD();
    // ... rest of code
});
```

**NEW CODE:**
```javascript
document.addEventListener('DOMContentLoaded', async function() {
    await checkExistingSession(); // Now async
    // ... rest of code
});
```

---

### Step 3: Verify Backend Session Configuration

**File:** `backend/server.js`

**Ensure these settings are present:**

```javascript
const session = require('express-session');
const MongoStore = require('connect-mongo');

app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/jamwathq',
        ttl: 24 * 60 * 60 // 24 hours
    }),
    cookie: {
        secure: false, // Set to true in production with HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: 'lax'
    }
}));
```

**Important:** The `sameSite: 'lax'` setting allows cookies to be sent with cross-page navigation.

---

### Step 4: Test the Implementation

#### Test Case 1: Login on Share Experience
1. Go to `share-experience.html`
2. Click "Share Your Experience" (triggers login)
3. Log in with Google/Facebook
4. Navigate to `agencies.html`
5. **Expected:** User is still logged in, HUD shows user info

#### Test Case 2: Login on Agencies
1. Go to `agencies.html`
2. Try to submit a review (triggers login)
3. Log in with Google/Facebook
4. Navigate to `share-experience.html`
5. **Expected:** User is still logged in

#### Test Case 3: Logout
1. Log in on either page
2. Click logout
3. Navigate to the other page
4. **Expected:** User is logged out on both pages

#### Test Case 4: Page Refresh
1. Log in on any page
2. Refresh the page
3. **Expected:** User remains logged in

---

## 🔐 Security Considerations

### Session Security
✅ **HttpOnly cookies** prevent XSS attacks
✅ **Server-side sessions** prevent tampering
✅ **Session expiration** after 24 hours
✅ **Secure flag** should be enabled in production (HTTPS)

### Authentication Flow
1. User clicks "Sign in with Google/Facebook"
2. Redirected to `/auth/google` or `/auth/facebook`
3. OAuth provider authenticates user
4. Backend receives OAuth token
5. Backend creates session and stores in MongoDB
6. User redirected back with session cookie
7. Session cookie is sent with all subsequent requests

---

## 🐛 Troubleshooting

### Issue: User not logged in after navigating to other page

**Possible Causes:**
1. Session cookie not being set
2. Cookie `sameSite` attribute too restrictive
3. Different domains/ports between pages
4. Ad blocker blocking third-party cookies

**Solution:**
- Check browser dev tools → Application → Cookies
- Verify `connect.sid` cookie exists
- Check cookie `SameSite` and `Secure` attributes
- Test without ad blockers

---

### Issue: Session expires too quickly

**Possible Causes:**
1. `maxAge` set too low
2. MongoDB TTL index deleting sessions early
3. Server restart clearing memory sessions

**Solution:**
- Increase `maxAge` in session config
- Verify MongoDB is being used as session store (not memory)
- Check MongoStore TTL setting

---

### Issue: Login works but data not persisting

**Possible Causes:**
1. Passport not serializing/deserializing user correctly
2. Session middleware not configured properly
3. Routes not using passport.authenticate()

**Solution:**
- Check `passport.serializeUser()` in `backend/config/passport.js`
- Verify session middleware is before passport in middleware chain
- Ensure auth routes use `passport.authenticate()`

---

## 📊 Testing Checklist

- [ ] auth-client.js added to agencies.html
- [ ] sessionStorage functions replaced with authManager calls
- [ ] Google/Facebook login buttons redirect to backend OAuth routes
- [ ] Logout redirects to /auth/logout
- [ ] DOMContentLoaded calls async checkExistingSession()
- [ ] Backend session configuration verified
- [ ] Test login on share-experience, navigate to agencies
- [ ] Test login on agencies, navigate to share-experience
- [ ] Test logout on one page, verify logged out on both
- [ ] Test page refresh maintains session
- [ ] Test session expires after 24 hours
- [ ] Test with different browsers (Chrome, Firefox, Safari)
- [ ] Test on mobile devices

---

## 📝 Files to Modify

### Frontend
- [ ] `frontend/agencies.html` - Add auth-client.js, replace sessionStorage logic

### Backend (verification only - should already be configured)
- [ ] `backend/server.js` - Session configuration
- [ ] `backend/config/passport.js` - OAuth strategies
- [ ] `backend/routes/auth.js` - Authentication routes

---

## 🎯 Expected Outcome

After implementation:

✅ Users log in once and stay logged in across both pages
✅ Session persists across page refreshes
✅ Logout works globally across all pages
✅ Secure, server-side session management
✅ Consistent authentication experience

---

## 📚 References

- [Express Session Documentation](https://github.com/expressjs/session)
- [connect-mongo (Session Store)](https://github.com/jdesboeufs/connect-mongo)
- [Passport.js Documentation](http://www.passportjs.org/docs/)
- [OAuth 2.0 Overview](https://oauth.net/2/)
- [Cookie Security Best Practices](https://owasp.org/www-community/controls/SecureCookieAttribute)

---

**Last Updated:** October 15, 2025
**Author:** Claude Code Assistant
**Status:** Ready for Implementation
