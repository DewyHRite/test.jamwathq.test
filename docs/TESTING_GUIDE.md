# Review System Testing Guide

## Overview
This guide provides comprehensive testing instructions for the review submission system with authentication, TOS compliance, and state analytics.

---

## Prerequisites

### 1. Start the Backend Server
```bash
cd backend
npm install
npm start
```
Expected output:
```
🚀 JamWatHQ Server Started!
📡 Server: https://localhost:3000
🔐 Authentication: Google & Facebook OAuth enabled
```

### 2. Environment Variables Required
Ensure your `backend/.env` file contains:
```
MONGODB_URI=mongodb://localhost:27017/jamwathq
SESSION_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
CLIENT_URL=http://localhost:3000
```

---

## Test Scenarios

### Test 1: Submit Review Without Login
**Objective:** Verify that unauthenticated users cannot submit reviews.

**Steps:**
1. Open `http://localhost:3000/share-experience.html` in your browser
2. Click on any state (e.g., "California")
3. Fill out the review form:
   - Job Title: "Lifeguard"
   - Employer: "Beach Resort"
   - City: "Los Angeles"
   - Hourly Wage: "$15.00"
   - Hours per Week: "40"
   - Rating: Click 4 stars
   - How many times worked: "2"
   - Experience: "Great summer experience!"
4. Click "Submit Experience"

**Expected Result:**
- ✅ Login modal should appear
- ✅ Modal should show "Login Required" title
- ✅ Two login options: Google and Facebook
- ❌ Review should NOT be saved to database

**Verification:**
```bash
# Check MongoDB - no new review should exist
mongosh jamwathq
db.reviews.countDocuments()
```

---

### Test 2: Cancel Login (No Submission)
**Objective:** Verify that canceling login does not save the review.

**Steps:**
1. Continue from Test 1 (login modal is open)
2. Click "Cancel" button on login modal

**Expected Result:**
- ✅ Login modal should close
- ✅ Review form should still be visible with data intact
- ❌ No review saved to database

---

### Test 3: Successful Login with Google OAuth
**Objective:** Verify Google OAuth login flow.

**Steps:**
1. Open `http://localhost:3000/share-experience.html`
2. Click on a state and fill out the review form
3. Click "Submit Experience"
4. In the login modal, click "Sign in with Google"
5. Complete Google OAuth flow (select account, grant permissions)

**Expected Result:**
- ✅ Browser redirects to Google OAuth page
- ✅ After successful OAuth, redirects back to `/share-experience.html?auth=success`
- ✅ User session is established (check via `/auth/status`)
- ✅ Welcome message: "Welcome, [FirstName]! You are now logged in."
- ✅ TOS modal should automatically appear
- ✅ Form data should be preserved

**Verification:**
```bash
# Check auth status endpoint
curl -X GET http://localhost:3000/auth/status --cookie-jar cookies.txt
# Should return: { "authenticated": true, "user": { ... } }
```

---

### Test 4: Decline Terms of Service
**Objective:** Verify that declining TOS prevents review submission.

**Steps:**
1. Continue from Test 3 (TOS modal is open)
2. Do NOT check the TOS acceptance checkbox
3. Notice "Accept & Submit Experience" button is disabled
4. Click "Decline" button

**Expected Result:**
- ✅ "Accept & Submit Experience" button is disabled when checkbox unchecked
- ✅ TOS modal closes when "Decline" is clicked
- ✅ Alert: "Experience submission cancelled. Your experience has not been saved."
- ❌ No review saved to database

**Verification:**
```bash
mongosh jamwathq
db.reviews.countDocuments()
# Should be 0 or unchanged from before
```

---

### Test 5: Accept TOS and Submit Review Successfully
**Objective:** Verify complete end-to-end review submission.

**Steps:**
1. Open `http://localhost:3000/share-experience.html`
2. If not logged in, log in via Google/Facebook
3. Click on a state (e.g., "Florida")
4. Fill out the form completely:
   - Job Title: "Hotel Receptionist"
   - Employer: "Sunshine Inn"
   - City: "Miami"
   - Hourly Wage: "$14.50"
   - Hours per Week: "35"
   - Rating: 5 stars
   - How many times worked: "1"
   - Experience: "Amazing experience, friendly staff and great location!"
5. Click "Submit Experience"
6. TOS modal appears
7. Check the "I have read and agree..." checkbox
8. Click "Accept & Submit Experience"

**Expected Result:**
- ✅ "Accept & Submit Experience" button enables after checkbox checked
- ✅ Review is submitted to backend (`POST /api/reviews`)
- ✅ Success alert: "Thank you for sharing your experience in Florida! Your experience has been submitted successfully."
- ✅ Modal closes
- ✅ Scoreboard refreshes with new data
- ✅ Review is saved in database with `tosAccepted: true`

**Verification:**
```bash
# Check MongoDB for new review
mongosh jamwathq
db.reviews.find().sort({createdAt: -1}).limit(1).pretty()

# Verify fields:
# - userId: <ObjectId>
# - userFirstName: <string>
# - state: "Florida"
# - jobTitle: "Hotel Receptionist"
# - timesUsed: 1
# - tosAccepted: true
# - tosAcceptedAt: <Date>
# - isApproved: true
```

---

### Test 6: Direct POST Request Without Authentication
**Objective:** Verify server-side authentication enforcement.

**Steps:**
1. Use curl or Postman to send a POST request without auth:
```bash
curl -X POST http://localhost:3000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "state": "Texas",
    "jobTitle": "Server",
    "wages": "12.00",
    "hoursPerWeek": "40",
    "rating": 5,
    "experience": "Test",
    "timesUsed": 1,
    "tosAccepted": true
  }'
```

**Expected Result:**
- ❌ Request should fail with 401 Unauthorized
- ❌ Response: `{ "success": false, "message": "Authentication required..." }`
- ❌ No review saved to database

---

### Test 7: Direct POST Request Without TOS Acceptance
**Objective:** Verify server-side TOS validation.

**Steps:**
1. Log in via browser to establish session
2. Get CSRF token:
```bash
curl -X GET http://localhost:3000/api/csrf-token \
  --cookie cookies.txt --cookie-jar cookies.txt
```
3. Attempt to submit review with `tosAccepted: false`:
```bash
curl -X POST http://localhost:3000/api/reviews \
  -H "Content-Type: application/json" \
  -H "CSRF-Token: <token-from-step-2>" \
  --cookie cookies.txt \
  -d '{
    "state": "New York",
    "jobTitle": "Tour Guide",
    "wages": "16.00",
    "hoursPerWeek": "30",
    "rating": 4,
    "experience": "Great city!",
    "timesUsed": 1,
    "tosAccepted": false
  }'
```

**Expected Result:**
- ❌ Request should fail with 400 Bad Request
- ❌ Response: `{ "success": false, "message": "You must accept the Terms of Service..." }`
- ❌ No review saved to database

---

### Test 8: State Scoreboard - Ratings Display
**Objective:** Verify scoreboard displays correct ratings.

**Steps:**
1. Submit at least 3 reviews for different states (follow Test 5)
2. Scroll down to "State Scoreboard" section
3. Observe the displayed data

**Expected Result:**
- ✅ Top 25 states ranked by average rating displayed
- ✅ Each state card shows:
  - Rank number (e.g., "#1", "#2", "#3")
  - State name
  - Star rating (visual stars + numeric rating)
  - Review count (e.g., "3 reviews")
  - Average wage (e.g., "Avg. Wage: $15.00/hr")
- ✅ Top 3 states have special styling (golden gradient)
- ✅ States are sorted by avgRating descending

**Verification:**
```bash
# Check stats endpoint
curl -X GET http://localhost:3000/api/reviews/stats
# Verify output matches displayed scoreboard
```

---

### Test 9: State Analytics - Visitor Count and Average Revisit
**Objective:** Verify analytics metrics are calculated correctly.

**Steps:**
1. Submit reviews with different `timesUsed` values:
   - User A: California, timesUsed=2
   - User A: California, timesUsed=2 (duplicate state)
   - User B: California, timesUsed=1
   - User B: Florida, timesUsed=3
2. Reload the page
3. Check scoreboard for California and Florida

**Expected Result for California:**
- ✅ Total Visitors: 2 (User A + User B)
- ✅ Avg. Revisit: 1.5x (average of [2, 1])
- ✅ Display format: "👥 2 visitors | 🔄 Avg. 1.5x revisit"

**Expected Result for Florida:**
- ✅ Total Visitors: 1 (User B only)
- ✅ Avg. Revisit: 3.0x
- ✅ Display format: "👥 1 visitors | 🔄 Avg. 3.0x revisit"

**Verification:**
```bash
# Check analytics endpoint
curl -X GET http://localhost:3000/api/reviews/analytics

# Expected output:
# {
#   "success": true,
#   "analytics": [
#     { "state": "California", "totalVisitors": 2, "avgRevisit": 1.5 },
#     { "state": "Florida", "totalVisitors": 1, "avgRevisit": 3.0 }
#   ]
# }
```

---

### Test 10: Accessibility - Keyboard Navigation
**Objective:** Verify modals are keyboard accessible.

**Steps:**
1. Open share-experience.html
2. Click a state to open review modal
3. Try to submit without login to trigger login modal
4. Use keyboard only:
   - Press `Tab` to navigate between login buttons
   - Press `Enter` on "Cancel" button to close modal
5. Fill form again, submit, log in
6. When TOS modal appears:
   - Press `Tab` to navigate to checkbox
   - Press `Space` to check/uncheck checkbox
   - Press `Tab` to navigate to "Accept" button
   - Press `Enter` to submit

**Expected Result:**
- ✅ All interactive elements are focusable via Tab
- ✅ Visual focus indicators appear (browser default or custom)
- ✅ Enter/Space keys work on buttons/checkboxes
- ✅ Escape key closes login modal (but NOT TOS modal)
- ✅ Focus traps within modal (doesn't escape to background)

---

### Test 11: Accessibility - Screen Reader Compatibility
**Objective:** Verify ARIA attributes and screen reader support.

**Steps:**
1. Enable screen reader (NVDA/JAWS on Windows, VoiceOver on Mac)
2. Open share-experience.html
3. Navigate to login modal
4. Navigate to TOS modal

**Expected Result:**
- ✅ Modals have `role="dialog"` attribute
- ✅ Modals have `aria-modal="true"` attribute
- ✅ Modal titles have `aria-labelledby` pointing to heading
- ✅ Modal content has `aria-describedby` pointing to description
- ✅ Buttons have descriptive `aria-label` attributes
- ✅ Checkbox has `aria-required="true"` (for TOS)
- ✅ Screen reader announces modal opening/closing

**Verification:**
Inspect HTML elements:
```html
<!-- Login Modal -->
<div id="loginModal" class="modal" role="dialog" aria-labelledby="loginModalTitle" aria-describedby="loginModalDesc" aria-modal="true">
  <h2 id="loginModalTitle">Login Required</h2>
  <p id="loginModalDesc">You must be logged in...</p>
</div>

<!-- TOS Modal -->
<div id="tosModal" class="modal" role="dialog" aria-labelledby="tosModalTitle" aria-describedby="tosModalDesc" aria-modal="true">
  <input type="checkbox" id="tosCheckbox" aria-required="true" aria-label="I have read and agree...">
</div>
```

---

### Test 12: JavaScript Disabled - Server-Side Validation
**Objective:** Verify server rejects requests even if client-side JS is bypassed.

**Steps:**
1. Disable JavaScript in browser settings
2. Try to access `/api/reviews` directly (GET should still work)
3. Re-enable JavaScript
4. Use browser dev tools to modify frontend code:
   - Remove `tosAccepted` check in `submitExperience` function
   - Try to submit without TOS
5. Inspect network request in Dev Tools

**Expected Result:**
- ❌ Server should reject POST request with 400 Bad Request
- ❌ Response: `{ "success": false, "message": "You must accept the Terms of Service..." }`
- ✅ Server-side validation prevents bypass

---

## Performance Testing

### Test 13: Load Test - Multiple Concurrent Submissions
**Objective:** Verify system handles multiple users simultaneously.

**Steps:**
1. Use a tool like Apache Bench or `wrk`:
```bash
# First, get valid session cookies from authenticated user
ab -n 100 -c 10 -H "Cookie: connect.sid=<session-id>" \
   -H "Content-Type: application/json" \
   -H "CSRF-Token: <csrf-token>" \
   -p review_payload.json \
   http://localhost:3000/api/reviews
```

**Expected Result:**
- ✅ All requests complete without errors (or expected auth errors)
- ✅ Rate limiter may throttle requests (300 requests per 15 min)
- ✅ Database maintains data integrity (no duplicates)
- ✅ Server logs show successful request handling

---

## Database Verification Queries

### Check Review Count
```javascript
db.reviews.countDocuments()
```

### View Recent Reviews
```javascript
db.reviews.find().sort({createdAt: -1}).limit(5).pretty()
```

### Check TOS Acceptance Rate
```javascript
db.reviews.aggregate([
  {
    $group: {
      _id: "$tosAccepted",
      count: { $sum: 1 }
    }
  }
])
// Expected: All should have tosAccepted: true
```

### Verify Analytics Calculation
```javascript
db.reviews.aggregate([
  { $match: { isApproved: true, tosAccepted: true } },
  {
    $group: {
      _id: { state: "$state", userId: "$userId" },
      timesUsed: { $first: "$timesUsed" }
    }
  },
  {
    $group: {
      _id: "$_id.state",
      totalVisitors: { $sum: 1 },
      avgRevisit: { $avg: "$timesUsed" }
    }
  },
  { $sort: { totalVisitors: -1 } }
])
```

---

## Common Issues and Troubleshooting

### Issue 1: CSRF Token Invalid
**Symptom:** POST requests fail with "Invalid or missing CSRF token"
**Solution:**
- Ensure cookies are enabled
- Check `credentials: 'include'` in fetch requests
- Verify CSRF token is fetched before POST

### Issue 2: OAuth Callback Fails
**Symptom:** Redirect to `?auth=failed` after OAuth
**Solution:**
- Check OAuth credentials in `.env`
- Verify callback URLs in Google/Facebook console
- Check server logs for detailed error

### Issue 3: Session Not Persisting
**Symptom:** User appears logged out after page refresh
**Solution:**
- Verify MongoDB is running
- Check `connect-mongo` session store
- Ensure cookies are not blocked

### Issue 4: Scoreboard Not Updating
**Symptom:** New reviews don't appear in scoreboard
**Solution:**
- Check browser console for fetch errors
- Verify `/api/reviews/stats` endpoint returns data
- Hard refresh page (Ctrl+Shift+R)

---

## Test Results Checklist

| Test # | Test Name | Pass/Fail | Notes |
|--------|-----------|-----------|-------|
| 1 | Submit Without Login | ☐ | |
| 2 | Cancel Login | ☐ | |
| 3 | Google OAuth Login | ☐ | |
| 4 | Decline TOS | ☐ | |
| 5 | Accept TOS & Submit | ☐ | |
| 6 | Direct POST No Auth | ☐ | |
| 7 | Direct POST No TOS | ☐ | |
| 8 | Scoreboard Ratings | ☐ | |
| 9 | State Analytics | ☐ | |
| 10 | Keyboard Navigation | ☐ | |
| 11 | Screen Reader | ☐ | |
| 12 | JS Disabled Validation | ☐ | |
| 13 | Load Test | ☐ | |

---

## Final Sign-Off

**Tester Name:** _____________________
**Date:** _____________________
**Environment:** Development / Staging / Production
**Overall Result:** PASS / FAIL

**Notes:**
```
[Any additional comments or observations]
```

---

**Document Version:** 1.0
**Last Updated:** 2025-10-14
**Author:** Claude AI Assistant
