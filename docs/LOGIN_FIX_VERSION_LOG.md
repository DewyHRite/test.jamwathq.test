# Login Redirection & UI Visibility Fixes - Version History

**Date**: October 16, 2025
**Version**: 2.1.0
**Developer**: Claude (AI Assistant)
**Backup Location**: `backups/fix-20251016_083728/`

---

## Summary

Fixed three critical issues affecting user experience:
1. **Login redirection bug** - Users logging in from Agencies page were incorrectly redirected to Share Experience page
2. **State selector not visible** - State selection interface hidden on Share Experience page
3. **Scoreboard not visible** - Scoreboard hidden along with state selector

Additionally documented the need for dynamic agency review fetching.

---

## Issues Fixed

### 1. ✅ Login Redirection Bug

**Problem**: When users clicked "Sign in with Google" on the **Agencies page**, they were always redirected to the **Share Experience page** after successful authentication, regardless of where they initiated the login.

**Root Cause**: Backend OAuth callback handlers in [backend/routes/auth.js](backend/routes/auth.js) were hardcoded to redirect to `share-experience.html`:

```javascript
// BEFORE - Line 19
res.redirect('http://localhost:8000/share-experience.html?auth=success');
```

**Solution**: Implemented session-based "returnTo" logic that remembers the page where login was initiated:

```javascript
// AFTER - Lines 7-35
router.get('/google',
    (req, res, next) => {
        // Store the referring page in session to redirect back after auth
        const referer = req.get('Referrer') || req.get('Referer');
        if (referer) {
            const refererUrl = new URL(referer);
            req.session.returnTo = refererUrl.pathname + refererUrl.search;
        }
        next();
    },
    passport.authenticate('google', {
        scope: ['profile', 'email']
    })
);

router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: 'http://localhost:8000/?auth=failed',
        failureMessage: true
    }),
    (req, res) => {
        // Successful authentication - redirect back to the page they came from
        const returnTo = req.session.returnTo || '/';
        delete req.session.returnTo; // Clean up

        const redirectUrl = `http://localhost:8000${returnTo}${returnTo.includes('?') ? '&' : '?'}auth=success`;
        res.redirect(redirectUrl);
    }
);
```

**Benefits**:
- Users stay on the page where they initiated login
- Maintains user context and improves UX
- Works for Google OAuth, Facebook OAuth, and Logout

---

### 2. ✅ State Selector Not Visible on Share Experience

**Problem**: The state selector (map/grid interface) was not displaying on the Share Experience page, preventing users from selecting a state to review.

**Root Cause**: The `auth-client.js` module's `updateUI()` function (line 113) hides the `#state-selection` div when users are not logged in:

```javascript
// auth-client.js - Line 113
if (stateSelection) stateSelection.style.display = 'none';
```

However, on the Share Experience page, the state selector should ALWAYS be visible so users can browse states and click to leave reviews (login happens when they try to submit).

**Solution**: Added explicit code in `share-experience.html` to ensure the state selector is always visible on page load:

```javascript
// share-experience.html - Lines 2504-2508
// Ensure state selector and scoreboard are always visible on this page
const stateSelection = document.getElementById('state-selection');
if (stateSelection) {
    stateSelection.style.display = 'block';
}
```

**Benefits**:
- State selector now visible to all users (logged in or not)
- Users can browse states before deciding to review
- Consistent with expected UX for review submission pages

---

### 3. ✅ Scoreboard Not Visible on Share Experience

**Problem**: The state scoreboard (showing top-rated J-1 destinations) was not displaying.

**Root Cause**: The scoreboard is located inside the `#state-selection` div (line 1456-1464), so when state-selection was hidden, the scoreboard was also hidden.

**Solution**: Fixed automatically when state-selection div was made visible (same fix as #2).

**Benefits**:
- Users can now see state rankings
- Better engagement with review system
- Helps users discover top destinations

---

### 4. ℹ️ Agency Reviews in History Cards (Documentation)

**Current State**: Agency reviews are hardcoded in HTML with "No reviews as yet" messages:

```html
<!-- Line 2067-2070 -->
<div class="past-reviews-box" id="reviews-10881">
    <h3>Past Reviews</h3>
    <div class="no-reviews-message">No reviews as yet</div>
</div>
```

**Backend API**: The endpoint `/api/agency-reviews/:agencyId` exists and returns reviews (confirmed in backend logs).

**Issue**: The frontend doesn't fetch and render reviews dynamically. The `togglePastReviews()` function only shows/hides existing HTML content.

**Recommendation**: Implement dynamic review fetching when "View Past Reviews" button is clicked:

```javascript
async function togglePastReviews(agencyId) {
    const reviewsBox = document.getElementById("reviews-" + agencyId);

    if (!reviewsBox.dataset.loaded) {
        // Fetch reviews from backend
        const response = await fetch(`http://localhost:3000/api/agency-reviews/${agencyId}`);
        const data = await response.json();

        if (data.success && data.reviews.length > 0) {
            // Render reviews
            reviewsBox.innerHTML = renderAgencyReviews(data.reviews);
        } else {
            reviewsBox.innerHTML = '<div class="no-reviews-message">No reviews as yet</div>';
        }

        reviewsBox.dataset.loaded = 'true';
    }

    // Toggle visibility
    // ... existing toggle logic
}
```

**Status**: Not implemented in this fix (would require significant changes to agencies.html). Documented for future implementation.

---

## Files Modified

### Backend Files

#### 1. `backend/routes/auth.js`

**Changes Made**:
- Added referer capture middleware to `/auth/google` route (lines 7-16)
- Updated Google OAuth callback to use returnTo session variable (lines 22-36)
- Added referer capture middleware to `/auth/facebook` route (lines 40-48)
- Updated Facebook OAuth callback to use returnTo (lines 54-67)
- Updated `/auth/logout` to remember source page (lines 70-100)

**Lines Changed**: 60+ lines modified

**Before**:
```javascript
router.get('/google', passport.authenticate('google', {...}));
router.get('/google/callback', ..., (req, res) => {
    res.redirect('http://localhost:8000/share-experience.html?auth=success');
});
```

**After**:
```javascript
router.get('/google',
    (req, res, next) => { /* capture referer */ },
    passport.authenticate('google', {...})
);
router.get('/google/callback', ..., (req, res) => {
    const returnTo = req.session.returnTo || '/';
    delete req.session.returnTo;
    const redirectUrl = `http://localhost:8000${returnTo}...`;
    res.redirect(redirectUrl);
});
```

### Frontend Files

#### 2. `frontend/share-experience.html`

**Changes Made**:
- Added code to ensure state-selection div is always visible (lines 2504-2508)

**Lines Changed**: 5 lines added

**Before**:
```javascript
await checkExistingSession();
updateHUD();

if (isUserLoggedIn) {
    console.log('User is logged in:', currentUser.firstName);
```

**After**:
```javascript
await checkExistingSession();
updateHUD();

// Ensure state selector and scoreboard are always visible on this page
const stateSelection = document.getElementById('state-selection');
if (stateSelection) {
    stateSelection.style.display = 'block';
}

if (isUserLoggedIn) {
    console.log('User is logged in:', currentUser.firstName);
```

---

## Backup Information

**Backup Location**: `backups/fix-20251016_083728/`

**Files Backed Up**:
1. `agencies.html` (925 KB)
2. `auth.js` (3.1 KB) - Backend routes
3. `auth-client.js` (14 KB) - Centralized auth client
4. `share-experience.html` (97 KB)

**Restore Command** (if needed):
```bash
cd /c/Users/Dewy/OneDrive/Documents/JamWatHQ/Main/Code
cp backups/fix-20251016_083728/auth.js backend/routes/
cp backups/fix-20251016_083728/share-experience.html frontend/
```

---

## Testing Checklist

### ✅ Login Redirection Test

**Test 1: Login from Agencies Page**
1. Navigate to http://localhost:8000/agencies.html
2. Click "Leave a Review" for any agency
3. Click "Sign in with Google" in the login modal
4. Complete Google OAuth
5. ✅ **Expected**: Redirected back to http://localhost:8000/agencies.html?auth=success
6. ✅ **Expected**: User HUD displays on Agencies page

**Test 2: Login from Share Experience Page**
1. Navigate to http://localhost:8000/share-experience.html
2. Click on any state
3. Click "Sign in with Google" in the login modal
4. Complete Google OAuth
5. ✅ **Expected**: Redirected back to http://localhost:8000/share-experience.html?auth=success
6. ✅ **Expected**: User HUD displays on Share Experience page

**Test 3: Logout from Agencies**
1. While logged in on http://localhost:8000/agencies.html
2. Click "Logout" button in HUD
3. ✅ **Expected**: Redirected back to http://localhost:8000/agencies.html?auth=loggedout
4. ✅ **Expected**: User HUD hidden

**Test 4: Logout from Share Experience**
1. While logged in on http://localhost:8000/share-experience.html
2. Click "Logout" button in HUD
3. ✅ **Expected**: Redirected back to http://localhost:8000/share-experience.html?auth=loggedout
4. ✅ **Expected**: User HUD hidden

---

### ✅ State Selector & Scoreboard Test

**Test 1: State Selector Visible (Not Logged In)**
1. Open http://localhost:8000/share-experience.html in incognito/private mode
2. ✅ **Expected**: State grid/map is visible
3. ✅ **Expected**: States are clickable
4. ✅ **Expected**: Clicking a state opens review modal with login prompt

**Test 2: State Selector Visible (Logged In)**
1. Login via Google OAuth
2. Navigate to http://localhost:8000/share-experience.html
3. ✅ **Expected**: State grid/map is visible
4. ✅ **Expected**: States are clickable
5. ✅ **Expected**: Clicking a state opens review form directly

**Test 3: Scoreboard Visible**
1. Open http://localhost:8000/share-experience.html
2. Scroll down to "State Scoreboard" section
3. ✅ **Expected**: Scoreboard section is visible
4. ✅ **Expected**: "Top Rated J-1 Destinations" heading visible
5. ✅ **Expected**: Scoreboard content loads (if reviews exist)

---

### ℹ️ Agency Reviews Test (Current Limitation)

**Test 1: View Past Reviews Button**
1. Navigate to http://localhost:8000/agencies.html
2. Click "◄ View Past Reviews" for any agency
3. ✅ **Expected**: Review box slides down/appears
4. ⚠️ **Current**: Shows "No reviews as yet" (hardcoded)
5. ❌ **Expected (Future)**: Should fetch and display actual reviews from `/api/agency-reviews/:agencyId`

**Test 2: Submit Agency Review**
1. Login via Google OAuth
2. Fill out agency review form
3. Accept TOS
4. Submit review
5. ✅ **Expected**: Backend receives review (confirmed in logs)
6. ❌ **Current**: Review not displayed in "Past Reviews" section
7. ❌ **Expected (Future)**: Review should appear dynamically after submission

---

## Technical Details

### Session Flow for Login Redirection

```
1. User on agencies.html clicks "Sign in with Google"
   ↓
2. Browser sends GET /auth/google with Referer: http://localhost:8000/agencies.html
   ↓
3. Backend middleware captures referer and stores in session:
   req.session.returnTo = "/agencies.html"
   ↓
4. Passport redirects to Google OAuth
   ↓
5. Google OAuth callback: GET /auth/google/callback
   ↓
6. Backend retrieves returnTo from session: "/agencies.html"
   ↓
7. Backend constructs redirect URL: "http://localhost:8000/agencies.html?auth=success"
   ↓
8. Backend deletes req.session.returnTo (cleanup)
   ↓
9. User redirected back to agencies.html with auth success
```

### State Selector Visibility Logic

**Old Behavior** (via auth-client.js):
```javascript
if (status.authenticated && status.user) {
    if (stateSelection) stateSelection.style.display = 'block';
} else {
    if (stateSelection) stateSelection.style.display = 'none'; // ❌ Hides state selector!
}
```

**New Behavior** (share-experience.html override):
```javascript
// After auth check, force state selector to be visible
const stateSelection = document.getElementById('state-selection');
if (stateSelection) {
    stateSelection.style.display = 'block'; // ✅ Always visible!
}
```

---

## Known Issues & Limitations

### 1. Agency Reviews Not Displayed Dynamically

**Issue**: Past reviews are not fetched from `/api/agency-reviews/:agencyId` endpoint.

**Impact**: Users cannot see submitted reviews in the "Past Reviews" section.

**Workaround**: None currently. Reviews are stored in the database but not displayed.

**Future Fix**: Implement `fetchAgencyReviews(agencyId)` function that:
1. Makes GET request to `/api/agency-reviews/:agencyId`
2. Parses response and renders reviews
3. Caches loaded reviews in memory
4. Updates review count/rating displays

### 2. Hardcoded Localhost URLs

**Issue**: OAuth redirect URLs are hardcoded to `http://localhost:8000`.

**Impact**: Won't work in production without modification.

**Fix Required**: Use environment variables or dynamic URL construction:
```javascript
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:8000';
const redirectUrl = `${CLIENT_URL}${returnTo}...`;
```

### 3. HTTP vs HTTPS in Production

**Issue**: All URLs use `http://` instead of `https://`.

**Impact**: Insecure in production, OAuth providers may reject.

**Fix Required**: Implement protocol detection:
```javascript
const protocol = req.secure || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
const redirectUrl = `${protocol}://...`;
```

---

## Production Deployment Notes

### Environment Variables Required

```env
# Backend .env
CLIENT_URL=https://yourdomain.com
PORT=3000
SESSION_SECRET=<strong-random-secret>
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
GOOGLE_CALLBACK_URL=https://yourdomain.com/auth/google/callback
```

### Security Checklist

- [ ] Update all OAuth redirect URLs to use HTTPS
- [ ] Configure CORS for production domain
- [ ] Enable secure session cookies (`secure: true`)
- [ ] Implement rate limiting on auth endpoints
- [ ] Add CSRF protection for all POST requests
- [ ] Enable session rotation on login
- [ ] Implement session timeout (currently 7 days)

### Code Changes for Production

1. **backend/routes/auth.js**:
   ```javascript
   // Replace hardcoded localhost with environment variable
   const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:8000';
   const redirectUrl = `${CLIENT_URL}${returnTo}...`;
   ```

2. **frontend/scripts/auth-client.js**:
   ```javascript
   // Update API_BASE_URL for production
   const API_BASE_URL = window.location.protocol === 'file:' || window.location.hostname === 'localhost'
       ? 'http://localhost:3000'
       : window.location.origin;
   ```

---

## Change Log

### Version 2.1.0 (2025-10-16)

#### Added
- Session-based returnTo logic for OAuth callbacks
- State selector visibility override in share-experience.html
- Comprehensive testing checklist
- Documentation for agency review dynamic fetching (future work)

#### Fixed
- Login redirection now respects originating page
- State selector now visible on Share Experience page
- Scoreboard now visible on Share Experience page
- Logout now redirects to originating page

#### Changed
- Google OAuth callback route (backend/routes/auth.js)
- Facebook OAuth callback route (backend/routes/auth.js)
- Logout route (backend/routes/auth.js)
- Share Experience page initialization (share-experience.html)

#### Known Issues
- Agency reviews not fetched dynamically (requires future implementation)
- Hardcoded localhost URLs (requires environment variable configuration)
- HTTP URLs in production (requires HTTPS enforcement)

---

## Rollback Instructions

If issues occur, restore from backup:

```bash
# Navigate to project root
cd /c/Users/Dewy/OneDrive/Documents/JamWatHQ/Main/Code

# Restore backend auth routes
cp backups/fix-20251016_083728/auth.js backend/routes/

# Restore frontend share experience page
cp backups/fix-20251016_083728/share-experience.html frontend/

# Restart backend server
cd backend
# Kill existing process (Ctrl+C in terminal)
npm run dev

# Frontend server auto-reloads (http-server with -c-1)
```

**Verification After Rollback**:
1. Login from Agencies page redirects to Share Experience (old behavior)
2. State selector hidden when not logged in (old behavior)
3. Scoreboard hidden (old behavior)

---

## Future Enhancements

### High Priority

1. **Dynamic Agency Review Fetching**
   - Implement AJAX call to `/api/agency-reviews/:agencyId`
   - Render reviews in past-reviews-box
   - Update review count badges
   - Add pagination if many reviews

2. **Environment Variable Configuration**
   - Replace hardcoded URLs with env vars
   - Support multiple environments (dev, staging, prod)

3. **HTTPS Enforcement**
   - Auto-detect protocol
   - Enforce HTTPS in production
   - Update OAuth providers

### Medium Priority

4. **Enhanced Error Handling**
   - Better error messages for auth failures
   - Retry logic for network errors
   - Graceful degradation if backend offline

5. **Performance Optimization**
   - Cache review data client-side
   - Lazy load reviews on scroll
   - Optimize bundle size

6. **Analytics**
   - Track login success/failure rates
   - Monitor OAuth flow completion
   - Measure review submission rates

---

## Contributors

- **Claude (AI Assistant)**: Implementation, testing, documentation
- **User (Dewy)**: Requirements, testing, approval

---

## Support

If you encounter issues:

1. Check browser console for JavaScript errors
2. Check backend logs for authentication errors
3. Verify session cookie is being set (DevTools → Application → Cookies)
4. Ensure MongoDB is running
5. Refer to this log for troubleshooting steps

**Common Issues**:

**Issue**: Still redirected to wrong page
**Solution**: Clear browser cookies, restart backend server

**Issue**: State selector not visible
**Solution**: Hard refresh (Ctrl+F5), check browser console for errors

**Issue**: Reviews not showing
**Solution**: Expected behavior - requires future implementation of dynamic fetching

---

*End of Version History Log*

**Status**: ✅ **READY FOR TESTING**
