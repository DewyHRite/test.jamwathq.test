# Comprehensive Testing Guidelines - JamWatHQ
**Last Updated:** 2025-11-03
**Version:** 1.0.0
**Maintained by:** Claude1 (Senior Full Stack Developer)

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Frontend Testing](#frontend-testing)
3. [Backend Testing](#backend-testing)
4. [Integration Testing](#integration-testing)
5. [Performance Testing](#performance-testing)
6. [Security Testing](#security-testing)
7. [Accessibility Testing](#accessibility-testing)
8. [Browser Compatibility](#browser-compatibility)
9. [Testing Workflows](#testing-workflows)
10. [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

### Prerequisites
1. **Node.js** installed (v14+)
2. **MongoDB** running (local or Atlas)
3. **Backend dependencies** installed: `cd backend && npm install`

### Starting Local Test Environment

```bash
# Terminal 1: Start Backend Server (Port 3000)
cd backend
npm run dev

# Expected Output:
# ✅ MongoDB Connected: localhost
# 🚀 JamWatHQ Server Started!
# 📡 Server: https://localhost:3000

# Terminal 2: Start Frontend Server (Port 8000)
cd frontend
http-server -p 8000 --cors

# Expected Output:
# Starting up http-server, serving ./
# Available on:
#   http://127.0.0.1:8000
```

### Accessing Frontend Pages
All pages accessible via: `http://localhost:8000/[page-name].html`

**Core Pages:**
- `http://localhost:8000/index.html` - Home page
- `http://localhost:8000/agencies.html` - Agency directory
- `http://localhost:8000/share-experience.html` - Review submission
- `http://localhost:8000/state-scoreboard.html` - State rankings
- `http://localhost:8000/report-problem.html` - Issue reporting

**Backend API:**
- `http://localhost:3000/api/*` - All API endpoints
- Frontend on port 8000 connects to backend on port 3000

---

## 🎨 Frontend Testing

### 1. TOS Modal Testing (CRITICAL)

**Test File:** `scripts/tos-modal.js`
**Affected Pages:** All 11 frontend pages
**Last Updated:** 2025-11-03 (File sync fix)

#### Test Setup
```javascript
// Clear localStorage to reset TOS acceptance
localStorage.removeItem('jamwathq_tos_accepted');
localStorage.removeItem('jamwathq_tos_accepted_timestamp');

// Reload page to trigger modal
location.reload();
```

#### Visual Verification Checklist
- [ ] **Modal appears as centered overlay** (NOT at bottom of page)
- [ ] **Dark backdrop** with blur effect visible behind modal
- [ ] **Yellow header** with text "Welcome to JamWatHQ! 🇯🇲"
- [ ] **White content area** with 5 bullet points
- [ ] **Yellow border** (3px solid #ffee00) around modal
- [ ] **Three buttons visible**:
  - Red "Decline" button (left)
  - Yellow "Learn More" button (center)
  - Green "Accept & Continue" button (right, initially disabled)
- [ ] **Checkbox** for TOS acceptance (initially unchecked)
- [ ] **Fixed positioning** (z-index: 10000)

#### Functional Testing

**Test 1.1: Modal Appearance**
```
1. Open http://localhost:8000/state-scoreboard.html
2. Verify modal appears on first visit
3. Verify backdrop prevents interaction with page content
```
**Expected:** Modal appears within 300ms, blocks page interaction

**Test 1.2: Checkbox Interaction**
```
1. Try to click "Accept & Continue" (should be disabled)
2. Click checkbox to check it
3. Verify "Accept & Continue" button becomes enabled
4. Uncheck checkbox
5. Verify button becomes disabled again
```
**Expected:** Button state toggles correctly

**Test 1.3: Decline Action**
```
1. Click "Decline" button
2. Confirm alert appears
```
**Expected:** Confirmation dialog → redirects to google.com if confirmed

**Test 1.4: Learn More Action**
```
1. Click "Learn More" button
```
**Expected:** Opens tos.html in new tab

**Test 1.5: Accept Action**
```
1. Check TOS checkbox
2. Click "Accept & Continue"
3. Verify modal closes with fade-out animation
4. Reload page
5. Verify modal does NOT appear again
```
**Expected:** Modal closes, acceptance stored in localStorage

#### Responsive Testing

**Desktop (>768px)**
- [ ] Modal width: 600px max-width
- [ ] Buttons in horizontal row
- [ ] Proper spacing and padding

**Tablet (480px-768px)**
- [ ] Modal width: 90% viewport width
- [ ] Buttons may stack vertically
- [ ] Touch targets adequate (44px minimum)

**Mobile (<480px)**
- [ ] Modal width: 98% viewport width
- [ ] Buttons stack vertically
- [ ] Font sizes adjusted for readability
- [ ] Checkbox larger (26px) for easy tapping

#### Cross-Page Consistency Test
Test on all 11 pages to ensure identical styling:

```bash
# Pages to test:
- index.html
- about.html
- agencies.html
- agency-ranking.html
- faq.html
- guide.html
- news.html
- report-problem.html
- share-experience.html
- state-scoreboard.html
- tos.html
```

**Verification:**
- [ ] Modal HTML structure identical
- [ ] No inline styles overriding tos-modal.js
- [ ] Single script reference (no duplicates)
- [ ] Same visual appearance on all pages

---

### 2. Modal System Testing

#### Login Modal (share-experience.html)

**Test 2.1: Trigger Login Modal**
```
1. Open share-experience.html
2. Fill out review form
3. Click "Submit Experience" (without logging in)
```
**Expected:** Login modal appears

**Test 2.2: Login Modal Content**
- [ ] Title: "Login Required"
- [ ] Description explaining authentication need
- [ ] Two OAuth buttons: Google and Facebook
- [ ] Cancel button
- [ ] Proper styling with modal-standard.css

**Test 2.3: OAuth Flow**
```
1. Click "Sign in with Google"
2. Complete OAuth flow
3. Return to page
```
**Expected:** Redirects to Google OAuth, returns with session

#### Review Submission Modal (agencies.html, share-experience.html)

**Test 2.4: Review Modal Trigger**
```
1. Open agencies.html
2. Click "Add Experience" on any agency
3. Fill form and submit
```
**Expected:** TOS confirmation modal appears before submission

---

### 3. Form Validation Testing

#### share-experience.html

**Test 3.1: Required Fields**
```
1. Leave all fields empty
2. Click submit
```
**Expected:** Validation errors for required fields

**Test 3.2: Field Formats**
- [ ] Wage: Must be numeric with up to 2 decimals
- [ ] Hours: Integer between 1-80
- [ ] Rating: 1-5 stars required
- [ ] Experience text: Minimum 20 characters

#### report-problem.html

**Test 3.3: Problem Report Validation**
- [ ] Category selection required
- [ ] Description minimum 20 characters
- [ ] Email format validation
- [ ] Reference ID format (AGY-XXX-001)

---

### 4. Navigation Testing

**Test 4.1: Header Navigation**
```
1. Test all navigation links in header
2. Verify dropdown menus work
3. Check mobile hamburger menu (< 768px)
```

**Test 4.2: Footer Navigation**
```
1. Verify all footer links functional
2. Test social media links
3. Verify mailto: links open email client
```

---

### 5. Visual Regression Testing

#### CSS Consistency Check

**Test 5.1: Color Scheme**
- [ ] Jamaica flag colors present (yellow: #ffee00, green: #28a745, black: #000)
- [ ] Consistent button styling across pages
- [ ] Proper contrast ratios (WCAG AA minimum)

**Test 5.2: Typography**
- [ ] Font sizes consistent
- [ ] Line heights appropriate
- [ ] Headings hierarchy clear

**Test 5.3: Spacing**
- [ ] Consistent padding/margins
- [ ] Proper whitespace between sections
- [ ] No overlapping elements

---

## 🔧 Backend Testing

### 1. API Endpoint Testing

#### Authentication Endpoints

**Test 1.1: GET /auth/status**
```bash
# Without session
curl -X GET https://localhost:3000/auth/status

# Expected:
# { "authenticated": false }
```

**Test 1.2: GET /auth/google**
```bash
curl -X GET https://localhost:3000/auth/google

# Expected: 302 Redirect to Google OAuth
```

**Test 1.3: GET /auth/facebook**
```bash
curl -X GET https://localhost:3000/auth/facebook

# Expected: 302 Redirect to Facebook OAuth
```

**Test 1.4: GET /auth/logout**
```bash
curl -X GET https://localhost:3000/auth/logout \
  --cookie cookies.txt

# Expected: Session destroyed, redirect to home
```

#### Review Endpoints

**Test 1.5: GET /api/reviews**
```bash
curl -X GET https://localhost:3000/api/reviews

# Expected: Array of approved reviews
```

**Test 1.6: POST /api/reviews (Unauthenticated)**
```bash
curl -X POST https://localhost:3000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "state": "Florida",
    "jobTitle": "Lifeguard",
    "wages": "15.00",
    "hoursPerWeek": "40",
    "rating": 5,
    "experience": "Great experience!",
    "timesUsed": 1,
    "tosAccepted": true
  }'

# Expected: 401 Unauthorized
# { "success": false, "message": "Authentication required" }
```

**Test 1.7: POST /api/reviews (Without TOS)**
```bash
# First, get authenticated session and CSRF token
curl -X POST https://localhost:3000/api/reviews \
  -H "Content-Type: application/json" \
  -H "CSRF-Token: <token>" \
  --cookie cookies.txt \
  -d '{
    "state": "Florida",
    "jobTitle": "Lifeguard",
    "wages": "15.00",
    "hoursPerWeek": "40",
    "rating": 5,
    "experience": "Great experience!",
    "timesUsed": 1,
    "tosAccepted": false
  }'

# Expected: 400 Bad Request
# { "success": false, "message": "You must accept the Terms of Service" }
```

**Test 1.8: GET /api/reviews/stats**
```bash
curl -X GET https://localhost:3000/api/reviews/stats

# Expected: State statistics with rankings
# {
#   "success": true,
#   "stats": [
#     {
#       "state": "Florida",
#       "avgRating": 4.5,
#       "reviewCount": 10,
#       "avgWage": 15.00
#     }
#   ]
# }
```

#### Agency Review Endpoints

**Test 1.9: POST /api/agency-reviews**
```bash
# Must be authenticated
curl -X POST https://localhost:3000/api/agency-reviews \
  -H "Content-Type: application/json" \
  -H "CSRF-Token: <token>" \
  --cookie cookies.txt \
  -d '{
    "agencyId": "AGY-001",
    "rating": 5,
    "experience": "Excellent agency service!",
    "tosAccepted": true
  }'

# Expected: 201 Created
# { "success": true, "review": { ... } }
```

**Test 1.10: GET /api/agency-reviews/:agencyId**
```bash
curl -X GET https://localhost:3000/api/agency-reviews/AGY-001

# Expected: Array of reviews for agency
```

---

### 2. Database Testing

#### MongoDB Verification

**Test 2.1: Check Collections**
```javascript
// In mongosh
use jamwathq
show collections

// Expected collections:
// - users
// - reviews
// - agencyreviews
// - sessions
```

**Test 2.2: Review Document Structure**
```javascript
db.reviews.findOne()

// Expected schema:
// {
//   _id: ObjectId,
//   userId: ObjectId,
//   userFirstName: String,
//   state: String,
//   jobTitle: String,
//   employer: String,
//   city: String,
//   wages: Number,
//   hoursPerWeek: Number,
//   rating: Number (1-5),
//   experience: String,
//   timesUsed: Number,
//   tosAccepted: Boolean,
//   tosAcceptedAt: Date,
//   isApproved: Boolean,
//   createdAt: Date,
//   updatedAt: Date
// }
```

**Test 2.3: User Document Structure**
```javascript
db.users.findOne()

// Expected schema:
// {
//   _id: ObjectId,
//   googleId: String (or facebookId),
//   email: String,
//   firstName: String,
//   lastName: String,
//   profilePicture: String,
//   createdAt: Date
// }
```

**Test 2.4: Data Integrity Checks**
```javascript
// Check for reviews without TOS acceptance (should be 0)
db.reviews.countDocuments({ tosAccepted: { $ne: true } })
// Expected: 0

// Check for reviews without user info
db.reviews.countDocuments({ userId: { $exists: false } })
// Expected: 0

// Check rating validity
db.reviews.find({ $or: [{ rating: { $lt: 1 } }, { rating: { $gt: 5 } }] })
// Expected: empty array
```

---

### 3. Session Management Testing

**Test 3.1: Session Creation**
```bash
# Login via OAuth and verify session created
curl -X GET https://localhost:3000/auth/status \
  --cookie-jar cookies.txt

# Expected: Session cookie set in cookies.txt
```

**Test 3.2: Session Persistence**
```bash
# Make multiple requests with same cookie
curl -X GET https://localhost:3000/auth/status --cookie cookies.txt
curl -X GET https://localhost:3000/api/reviews --cookie cookies.txt

# Expected: Both requests use same session
```

**Test 3.3: Session Expiration**
```javascript
// Wait for session to expire (default: 24 hours)
// Or manually delete from MongoDB:
db.sessions.deleteMany({})

// Then try authenticated request
// Expected: 401 Unauthorized
```

---

### 4. Security Testing

#### CSRF Protection

**Test 4.1: POST Without CSRF Token**
```bash
curl -X POST https://localhost:3000/api/reviews \
  -H "Content-Type: application/json" \
  --cookie cookies.txt \
  -d '{ "state": "Florida", ... }'

# Expected: 403 Forbidden - Invalid CSRF token
```

**Test 4.2: POST With Valid CSRF Token**
```bash
# Get CSRF token first
TOKEN=$(curl -X GET https://localhost:3000/api/csrf-token \
  --cookie cookies.txt | jq -r '.csrfToken')

# Use token in POST request
curl -X POST https://localhost:3000/api/reviews \
  -H "Content-Type: application/json" \
  -H "CSRF-Token: $TOKEN" \
  --cookie cookies.txt \
  -d '{ ... }'

# Expected: 201 Created (if authenticated)
```

#### Rate Limiting

**Test 4.3: Rate Limit Enforcement**
```bash
# Send 301+ requests within 15 minutes
for i in {1..350}; do
  curl -X GET https://localhost:3000/api/reviews
  echo "Request $i"
done

# Expected: After 300 requests, receive 429 Too Many Requests
```

#### Input Sanitization

**Test 4.4: XSS Attempt**
```bash
curl -X POST https://localhost:3000/api/reviews \
  -H "Content-Type: application/json" \
  -H "CSRF-Token: <token>" \
  --cookie cookies.txt \
  -d '{
    "state": "Florida",
    "experience": "<script>alert(\"XSS\")</script>",
    "tosAccepted": true,
    ...
  }'

# Expected: Script tags sanitized or rejected
```

**Test 4.5: SQL Injection Attempt**
```bash
curl -X GET "https://localhost:3000/api/reviews?state=' OR '1'='1"

# Expected: No SQL injection vulnerability (using MongoDB/Mongoose)
```

---

## 🔗 Integration Testing

### 1. End-to-End User Flow

**Test 1.1: New User Review Submission**
```
1. Open share-experience.html (clear localStorage first)
2. TOS modal appears → Accept TOS
3. Fill review form for a state
4. Click "Submit Experience"
5. Login modal appears → Click "Sign in with Google"
6. Complete OAuth flow
7. Return to page → TOS modal appears (for review submission)
8. Check TOS checkbox → Click "Accept & Submit Experience"
9. Success message appears
10. Verify review appears in state scoreboard
11. Verify review saved in MongoDB
```

**Expected Result:** Complete flow succeeds, review visible on site

**Test 1.2: Returning User Review**
```
1. User already logged in (session exists)
2. User already accepted site TOS (localStorage set)
3. Open share-experience.html
4. No TOS modal appears (already accepted)
5. Fill form and submit
6. Review TOS modal appears (for submission only)
7. Accept and submit
8. Review saved
```

**Expected Result:** No site TOS modal, only submission TOS

---

### 2. OAuth Integration

**Test 2.1: Google OAuth Flow**
```
1. Click "Sign in with Google"
2. Redirects to Google OAuth consent screen
3. Select Google account
4. Grant permissions
5. Redirects to callback: /auth/google/callback
6. Server exchanges code for tokens
7. User profile fetched from Google
8. User record created/updated in MongoDB
9. Session established
10. Redirect to frontend with ?auth=success
```

**Expected:** User successfully authenticated

**Test 2.2: Facebook OAuth Flow**
```
Similar to Google OAuth, using Facebook endpoints
```

**Test 2.3: OAuth Failure Handling**
```
1. Start OAuth flow
2. Click "Cancel" on consent screen
3. Redirects back with ?auth=failed
4. Error message displayed to user
5. No session created
```

**Expected:** Graceful error handling

---

## ⚡ Performance Testing

### 1. Page Load Testing

**Test 1.1: Homepage Load Time**
```bash
# Use Chrome DevTools Lighthouse or:
curl -w "@curl-format.txt" -o /dev/null -s https://localhost:3000/index.html

# Target metrics:
# - Time to First Byte (TTFB): < 200ms
# - First Contentful Paint (FCP): < 1.5s
# - Largest Contentful Paint (LCP): < 2.5s
```

**Test 1.2: Share Experience Page Load**
```bash
# Measure with Network tab throttling (Slow 3G)
# Target: Page usable in < 5s
```

### 2. API Performance Testing

**Test 2.1: Reviews Endpoint Load Test**
```bash
# Using Apache Bench
ab -n 1000 -c 50 https://localhost:3000/api/reviews

# Target:
# - Requests per second: > 100
# - Mean response time: < 100ms
# - No failed requests
```

**Test 2.2: Database Query Performance**
```javascript
// In mongosh
db.reviews.explain("executionStats").aggregate([
  { $match: { isApproved: true } },
  { $group: { _id: "$state", avgRating: { $avg: "$rating" } } },
  { $sort: { avgRating: -1 } }
])

// Check executionTimeMillis < 50ms
```

### 3. Concurrent User Testing

**Test 3.1: Simulate 100 Concurrent Users**
```bash
# Using Apache JMeter or similar
# Scenario: 100 users browsing and submitting reviews
# Duration: 5 minutes
# Expected: No errors, response times < 2s
```

---

## 🔐 Security Testing

### 1. Authentication & Authorization

**Test 1.1: Unauthorized Access Attempts**
- [ ] Try accessing /api/reviews (POST) without auth → 401
- [ ] Try accessing admin routes without admin role → 403
- [ ] Try accessing other user's data → 403

**Test 1.2: Session Hijacking Prevention**
- [ ] Verify session cookies have HttpOnly flag
- [ ] Verify session cookies have Secure flag (HTTPS only)
- [ ] Verify session cookies have SameSite=Strict

**Test 1.3: CSRF Protection**
- [ ] POST requests without CSRF token fail
- [ ] CSRF token rotates after each request
- [ ] CSRF token tied to user session

### 2. Content Security Policy (CSP)

**Test 2.1: CSP Header Verification**
```bash
curl -I https://localhost:3000/index.html | grep -i content-security-policy

# Expected: CSP header present with appropriate directives
```

**Test 2.2: Inline Script Blocking**
- [ ] Verify no inline scripts execute (all external)
- [ ] Verify no eval() usage
- [ ] Verify no unsafe-inline in CSP

### 3. Data Protection

**Test 3.1: Sensitive Data Exposure**
- [ ] No passwords stored in plain text
- [ ] No API keys in client-side code
- [ ] No sensitive data in error messages
- [ ] No sensitive data in logs

**Test 3.2: Input Validation**
- [ ] All user inputs sanitized
- [ ] Special characters properly escaped
- [ ] File upload restrictions enforced
- [ ] Size limits enforced

---

## ♿ Accessibility Testing

### 1. Keyboard Navigation

**Test 1.1: Tab Navigation**
```
1. Open any page
2. Press Tab repeatedly
3. Verify focus moves through all interactive elements
4. Verify focus visible (outline or custom indicator)
5. Verify no keyboard traps
```

**Test 1.2: Modal Keyboard Access**
```
1. Open TOS modal
2. Press Tab → Focus should move to first interactive element (checkbox)
3. Press Space → Checkbox toggles
4. Press Tab → Focus moves to buttons
5. Press Enter on "Accept" → Modal closes
6. Press Escape → Modal closes (if allowed)
```

### 2. Screen Reader Testing

**Test 2.1: ARIA Attributes**
- [ ] All modals have role="dialog"
- [ ] All modals have aria-modal="true"
- [ ] All modals have aria-labelledby pointing to title
- [ ] All modals have aria-describedby pointing to description
- [ ] All form inputs have associated labels
- [ ] All buttons have descriptive text or aria-label

**Test 2.2: Screen Reader Announcement**
```
1. Enable screen reader (NVDA/JAWS/VoiceOver)
2. Navigate through page
3. Verify all content announced
4. Verify modal opening/closing announced
5. Verify form errors announced
```

### 3. Color Contrast

**Test 3.1: Contrast Ratios**
```
Use Chrome DevTools or WAVE extension to check:
- Text contrast ratio: Minimum 4.5:1 (WCAG AA)
- Large text (18pt+): Minimum 3:1
- UI components: Minimum 3:1
```

**Test 3.2: Color Blindness Simulation**
```
Use browser extension to simulate:
- Protanopia (red-blind)
- Deuteranopia (green-blind)
- Tritanopia (blue-blind)

Verify:
- Information not conveyed by color alone
- Interactive elements still distinguishable
```

### 4. Semantic HTML

**Test 4.1: Document Structure**
- [ ] Single h1 per page
- [ ] Heading hierarchy logical (h1 → h2 → h3)
- [ ] Landmarks used (<nav>, <main>, <footer>)
- [ ] Lists use <ul>/<ol>/<li>
- [ ] Forms use <form>, <label>, <input>

---

## 🌐 Browser Compatibility

### Desktop Browsers

**Test 1.1: Chrome (Latest)**
- [ ] All features functional
- [ ] Styling correct
- [ ] OAuth works
- [ ] Modals display correctly

**Test 1.2: Firefox (Latest)**
- [ ] All features functional
- [ ] CSS Grid/Flexbox works
- [ ] Fetch API works

**Test 1.3: Safari (Latest)**
- [ ] All features functional
- [ ] Date inputs work
- [ ] Backdrop-filter works

**Test 1.4: Edge (Latest)**
- [ ] All features functional
- [ ] Windows-specific features work

### Mobile Browsers

**Test 1.5: Chrome Mobile (Android)**
- [ ] Touch targets adequate (44x44px minimum)
- [ ] Modals display correctly
- [ ] Forms usable
- [ ] OAuth redirects work

**Test 1.6: Safari Mobile (iOS)**
- [ ] All features functional
- [ ] Fixed positioning works
- [ ] Input zoom disabled where appropriate

### Legacy Support

**Test 1.7: IE11 (If Required)**
- [ ] Polyfills loaded for missing features
- [ ] Graceful degradation for unsupported features
- [ ] Basic functionality works

---

## 🔄 Testing Workflows

### Daily Development Testing

1. **Before Starting Work**
   - [ ] Pull latest code from repository
   - [ ] Start backend server
   - [ ] Verify environment variables set
   - [ ] Check MongoDB connection

2. **During Development**
   - [ ] Test changes in browser after each modification
   - [ ] Check browser console for errors
   - [ ] Verify no network errors in Dev Tools
   - [ ] Test on mobile viewport

3. **Before Committing**
   - [ ] Run full manual test on affected pages
   - [ ] Verify no console errors
   - [ ] Test authentication flow if affected
   - [ ] Document changes in commit message

### Pre-Deployment Testing

1. **Feature Complete Testing**
   - [ ] Run comprehensive test suite
   - [ ] Test all user flows end-to-end
   - [ ] Verify database migrations (if any)
   - [ ] Check performance metrics
   - [ ] Run accessibility audit

2. **Security Review**
   - [ ] Review code for security issues
   - [ ] Test authentication/authorization
   - [ ] Verify input sanitization
   - [ ] Check CSP headers
   - [ ] Review error handling

3. **Documentation**
   - [ ] Update CHANGELOG
   - [ ] Update API documentation
   - [ ] Update testing documentation
   - [ ] Create deployment notes

### Post-Deployment Testing

1. **Smoke Testing**
   - [ ] Verify homepage loads
   - [ ] Test login/logout
   - [ ] Submit test review
   - [ ] Check error logs

2. **Monitoring**
   - [ ] Check server metrics
   - [ ] Monitor error rates
   - [ ] Review user feedback
   - [ ] Check database performance

---

## 🛠️ Troubleshooting

### Common Issues

#### Issue: Port 3000 already in use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

#### Issue: MongoDB connection failed
```bash
# Check if MongoDB is running
# Windows
sc query MongoDB

# macOS/Linux
systemctl status mongod

# Start MongoDB
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

#### Issue: OAuth fails with "redirect_uri_mismatch"
```
Solution:
1. Check Google/Facebook console
2. Verify callback URL matches:
   - Google: https://localhost:3000/auth/google/callback
   - Facebook: https://localhost:3000/auth/facebook/callback
3. Ensure HTTPS used (not HTTP)
```

#### Issue: TOS modal displays at bottom of page
```
Solution:
1. Verify scripts/tos-modal.js is latest version
2. Check for inline styles overriding modal CSS
3. Clear browser cache and reload
4. Check browser console for CSS/JS errors
```

#### Issue: Session not persisting
```
Solution:
1. Verify MongoDB session store configured
2. Check SESSION_SECRET in .env
3. Ensure cookies not blocked
4. Verify secure cookies if using HTTPS
```

#### Issue: CSRF token invalid
```
Solution:
1. Verify CSRF token fetched before POST
2. Check credentials: 'include' in fetch
3. Ensure cookies sent with request
4. Verify token not expired
```

---

## 📝 Test Results Template

### Test Session Information
- **Tester:** ___________________
- **Date:** ___________________
- **Environment:** Development / Staging / Production
- **Browser:** ___________________
- **Device:** ___________________

### Test Results

| Test Category | Tests Run | Passed | Failed | Skipped | Notes |
|---------------|-----------|--------|--------|---------|-------|
| TOS Modal | | | | | |
| Frontend Forms | | | | | |
| Backend API | | | | | |
| Authentication | | | | | |
| Database | | | | | |
| Security | | | | | |
| Accessibility | | | | | |
| Performance | | | | | |

### Issues Found

#### Issue #1
- **Severity:** Critical / High / Medium / Low
- **Description:**
- **Steps to Reproduce:**
- **Expected:**
- **Actual:**
- **Screenshot/Logs:**

### Sign-Off

- [ ] ✅ All critical tests passed
- [ ] ✅ No critical security issues
- [ ] ✅ Acceptable performance
- [ ] ✅ Documentation updated
- [ ] ✅ Ready for deployment

**Tester Signature:** ___________________
**Date:** ___________________

---

## 📚 Related Documentation

- [TESTING_GUIDE.md](TESTING_GUIDE.md) - Review system testing
- [QUICK_TEST_GUIDE.md](QUICK_TEST_GUIDE.md) - Quick button/OAuth testing
- [TESTING_CHECKLIST.md](TESTING_CHECKLIST.md) - Report problem testing
- [MODAL_TESTING_CHECKLIST.md](MODAL_TESTING_CHECKLIST.md) - Modal-specific tests
- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Deployment procedures
- [AUTHENTICATION_SETUP.md](AUTHENTICATION_SETUP.md) - OAuth configuration

---

**Document Version:** 1.0.0
**Last Updated:** 2025-11-03
**Maintained by:** Claude1 (Senior Full Stack Developer)

🤖 Generated with [Claude Code](https://claude.com/claude-code)
