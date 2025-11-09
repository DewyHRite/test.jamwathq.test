# Security Remediation Phases - JamWatHQ

**Date**: 2025-11-04
**Created By**: Megumi Fushiguro (Security Analyst)
**Status**: Ready for Implementation
**Total Estimated Time**: 15-20 hours across 3 phases

---

## 📊 EXECUTIVE SUMMARY

This document provides detailed, step-by-step remediation plans for all remaining security issues in the JamWatHQ platform. Issues are organized into 3 phases by priority:

- **Phase 1 (HIGH Priority)**: 5-6 hours - Address all HIGH severity issues
- **Phase 2 (MEDIUM Priority)**: 6-8 hours - Code quality and robustness improvements
- **Phase 3 (Testing & Validation)**: 4-6 hours - Comprehensive security testing

**Current Status**: 0 CRITICAL, 5+ HIGH, 9 MEDIUM issues remaining

---

## 🎯 PHASE 1: HIGH PRIORITY SECURITY FIXES

**Target**: Eliminate all HIGH severity vulnerabilities
**Total Time**: 5-6 hours
**Blocking**: Recommended before production (non-blocking)
**Success Criteria**: Zero HIGH severity issues, strict CSP enforcement enabled

---

### **TASK 1.1: Remove Inline Event Handlers from share-experience.html**

**Issue ID**: HIGH-003
**Severity**: HIGH
**File**: `frontend/share-experience.html`
**Estimated Time**: 2 hours
**Complexity**: Medium

#### **Current State**
12 inline `onclick` handlers violate CSP and create XSS vectors:
- Line 1705: `onclick="openUSLegalModal(event)"`
- Lines 2037-2041: `onclick="setRating(1-5)"` (5 star ratings)
- Line 2868: `onclick="openReviewsPopup('${state}')"`
- Line 3382: `onclick="acceptTOS()"`
- Line 3385: `onclick="declineTOS()"`
- Line 3397: `onclick="closeReviewsPopup()"`
- Lines 3403, 3407: `onclick="changePage(-1)"`, `onclick="changePage(1)"`

#### **Step-by-Step Remediation**

**Step 1: Create Event Delegation System** (30 min)

Create `frontend/scripts/share-experience-events.js`:

```javascript
/**
 * JamWatHQ Share Experience - Event Delegation Handler
 * Replaces inline onclick handlers with CSP-compliant event delegation
 * Date: 2025-11-04
 * Issue: HIGH-003
 */

(function() {
  'use strict';

  /**
   * Initialize event delegation system
   */
  function initEventDelegation() {
    console.log('✅ Share Experience event delegation initialized');

    // Event delegation for the entire document
    document.addEventListener('click', handleDocumentClick);

    // Event delegation for star ratings
    attachStarRatingListeners();
  }

  /**
   * Handle all click events via delegation
   * @param {Event} event - Click event
   */
  function handleDocumentClick(event) {
    const action = event.target.dataset.action ||
                   event.target.closest('[data-action]')?.dataset.action;

    if (!action) return;

    // Prevent default for button/link actions
    if (event.target.tagName === 'BUTTON' || event.target.tagName === 'A') {
      event.preventDefault();
    }

    // Route to appropriate handler
    switch(action) {
      case 'open-us-legal-modal':
        if (typeof openUSLegalModal === 'function') {
          openUSLegalModal(event);
        }
        break;

      case 'accept-tos':
        if (typeof acceptTOS === 'function') {
          acceptTOS();
        }
        break;

      case 'decline-tos':
        if (typeof declineTOS === 'function') {
          declineTOS();
        }
        break;

      case 'close-reviews-popup':
        if (typeof closeReviewsPopup === 'function') {
          closeReviewsPopup();
        }
        break;

      case 'change-page-prev':
        if (typeof changePage === 'function') {
          changePage(-1);
        }
        break;

      case 'change-page-next':
        if (typeof changePage === 'function') {
          changePage(1);
        }
        break;

      case 'open-reviews-popup':
        const state = event.target.dataset.state;
        if (state && typeof openReviewsPopup === 'function') {
          openReviewsPopup(state);
        }
        break;

      default:
        console.warn('Unknown action:', action);
    }
  }

  /**
   * Attach star rating listeners
   * Handles the 5 star rating icons (lines 2037-2041)
   */
  function attachStarRatingListeners() {
    const ratingContainer = document.querySelector('.star-rating');
    if (!ratingContainer) return;

    ratingContainer.addEventListener('click', function(event) {
      const star = event.target.closest('i[data-rating]');
      if (!star) return;

      const rating = parseInt(star.dataset.rating);
      if (rating >= 1 && rating <= 5 && typeof setRating === 'function') {
        setRating(rating);
      }
    });
  }

  // Initialize on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEventDelegation);
  } else {
    initEventDelegation();
  }
})();
```

**Step 2: Update HTML - Remove Inline Handlers** (45 min)

Edit `frontend/share-experience.html`:

```html
<!-- Line 1705: BEFORE -->
<a href="#" class="learn-more-link btn-standard btn-primary" onclick="openUSLegalModal(event)">

<!-- Line 1705: AFTER -->
<a href="#" class="learn-more-link btn-standard btn-primary" data-action="open-us-legal-modal">

<!-- Lines 2037-2041: BEFORE -->
<i class="far fa-star" data-rating="1" onclick="setRating(1)"></i>
<i class="far fa-star" data-rating="2" onclick="setRating(2)"></i>
<i class="far fa-star" data-rating="3" onclick="setRating(3)"></i>
<i class="far fa-star" data-rating="4" onclick="setRating(4)"></i>
<i class="far fa-star" data-rating="5" onclick="setRating(5)"></i>

<!-- Lines 2037-2041: AFTER -->
<i class="far fa-star" data-rating="1"></i>
<i class="far fa-star" data-rating="2"></i>
<i class="far fa-star" data-rating="3"></i>
<i class="far fa-star" data-rating="4"></i>
<i class="far fa-star" data-rating="5"></i>

<!-- Line 2868: BEFORE (in template literal) -->
<div class="scoreboard-item" onclick="openReviewsPopup('${state}')" style="cursor: pointer;">

<!-- Line 2868: AFTER -->
<div class="scoreboard-item" data-action="open-reviews-popup" data-state="${state}" style="cursor: pointer;">

<!-- Line 3382: BEFORE -->
<button class="btn-standard btn-success" id="tosAcceptBtn" disabled onclick="acceptTOS()">

<!-- Line 3382: AFTER -->
<button class="btn-standard btn-success" id="tosAcceptBtn" disabled data-action="accept-tos">

<!-- Line 3385: BEFORE -->
<button class="btn-standard btn-danger" onclick="declineTOS()">

<!-- Line 3385: AFTER -->
<button class="btn-standard btn-danger" data-action="decline-tos">

<!-- Line 3397: BEFORE -->
<span class="close-modal" onclick="closeReviewsPopup()" aria-label="Close reviews popup">&times;</span>

<!-- Line 3397: AFTER -->
<span class="close-modal" data-action="close-reviews-popup" aria-label="Close reviews popup">&times;</span>

<!-- Line 3403: BEFORE -->
<button id="prevPageBtn" class="pagination-btn btn-standard btn-primary btn-small" onclick="changePage(-1)">

<!-- Line 3403: AFTER -->
<button id="prevPageBtn" class="pagination-btn btn-standard btn-primary btn-small" data-action="change-page-prev">

<!-- Line 3407: BEFORE -->
<button id="nextPageBtn" class="pagination-btn btn-standard btn-primary btn-small" onclick="changePage(1)">

<!-- Line 3407: AFTER -->
<button id="nextPageBtn" class="pagination-btn btn-standard btn-primary btn-small" data-action="change-page-next">
```

**Step 3: Add Script Tag** (5 min)

Add to `frontend/share-experience.html` in the `<head>` section or before `</body>`:

```html
<!-- Event delegation handler (HIGH-003 fix) -->
<script src="scripts/share-experience-events.js"></script>
```

**Step 4: Testing** (30 min)

Test all interactions:
- [ ] Click "Learn More" link (US Legal Modal opens)
- [ ] Click each of 5 star rating icons (rating updates)
- [ ] Click scoreboard items (reviews popup opens)
- [ ] Click "Accept" TOS button (TOS accepted)
- [ ] Click "Decline" TOS button (TOS declined)
- [ ] Click close reviews popup (popup closes)
- [ ] Click "Previous" page button (page changes)
- [ ] Click "Next" page button (page changes)

**Verification Command**:
```bash
grep -c "onclick=" frontend/share-experience.html
# Expected: 0 (down from 12)
```

**Rollback Plan**:
```bash
# If issues occur, restore from backup
cp backup/high-003-inline-handlers-fix-20251105/share-experience.html frontend/share-experience.html
```

---

### **TASK 1.2: Refactor TOS Modal to External CSS**

**Issue ID**: HIGH-005 (also addresses HIGH-002)
**Severity**: HIGH
**File**: `frontend/scripts/tos-modal.js`
**Estimated Time**: 1 hour
**Complexity**: Low-Medium

#### **Current State**
TOS modal injects inline styles via JavaScript, requiring CSP `'unsafe-inline'` for `style-src`.

#### **Step-by-Step Remediation**

**Step 1: Create External CSS File** (30 min)

Create `frontend/styles/tos-modal.css` (if not exists, or update existing):

```css
/* TOS Modal Styles - Extracted from inline injection (HIGH-005 fix) */
/* Replaces dynamic style injection in tos-modal.js */

/* Modal overlay */
.tos-modal {
  display: none;
  position: fixed;
  z-index: 10000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.7);
  animation: fadeIn 0.3s ease-in-out;
}

.tos-modal.show {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Modal content container */
.tos-modal .modal-content {
  background-color: #ffffff;
  margin: auto;
  padding: 30px;
  border: 2px solid #000000;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  position: relative;
  animation: slideIn 0.3s ease-in-out;
}

/* Modal header */
.tos-modal h2 {
  color: #000000;
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
  border-bottom: 2px solid #FFD700;
  padding-bottom: 10px;
}

/* Modal text content */
.tos-modal p,
.tos-modal ul,
.tos-modal ol {
  color: #333333;
  line-height: 1.6;
  margin-bottom: 15px;
}

.tos-modal ul,
.tos-modal ol {
  padding-left: 25px;
}

.tos-modal li {
  margin-bottom: 8px;
}

/* Modal buttons */
.tos-modal .modal-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 25px;
}

.tos-modal .btn-accept {
  background-color: #228B22;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.tos-modal .btn-accept:hover {
  background-color: #1a6b1a;
}

/* Close button (X) */
.tos-modal .close-modal {
  position: absolute;
  top: 15px;
  right: 20px;
  color: #000000;
  font-size: 32px;
  font-weight: bold;
  cursor: pointer;
  line-height: 1;
  transition: color 0.3s ease;
}

.tos-modal .close-modal:hover {
  color: #FFD700;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .tos-modal .modal-content {
    width: 95%;
    padding: 20px;
    max-height: 90vh;
  }

  .tos-modal h2 {
    font-size: 20px;
  }

  .tos-modal .btn-accept {
    padding: 10px 20px;
    font-size: 14px;
  }
}
```

**Step 2: Update tos-modal.js** (20 min)

Edit `frontend/scripts/tos-modal.js`:

```javascript
// BEFORE (remove this entire function):
function addStyles() {
  // Check if styles already added
  if (document.getElementById('tos-modal-styles')) {
    return;
  }

  const style = document.createElement('style');
  style.id = 'tos-modal-styles';
  style.textContent = `
    /* ... inline styles ... */
  `;
  document.head.appendChild(style);
}

// AFTER (replace with simple comment):
/**
 * TOS Modal Styles
 * Styles now externalized to styles/tos-modal.css (HIGH-005 fix)
 * No dynamic style injection needed - CSP compliant
 */
```

Also remove any calls to `addStyles()` in the file:
```javascript
// REMOVE:
addStyles();
```

**Step 3: Add CSS Link to All HTML Pages** (10 min)

Add to all pages that use TOS modal (in `<head>` section):

```html
<!-- TOS Modal Styles (HIGH-005 fix - external CSS) -->
<link rel="stylesheet" href="styles/tos-modal.css">
```

**Pages to Update**:
- frontend/index.html
- frontend/about.html
- frontend/agencies.html
- frontend/share-experience.html
- frontend/state-scoreboard.html
- frontend/agency-ranking.html
- frontend/faq.html
- frontend/guide.html
- frontend/news.html
- frontend/report-problem.html
- frontend/tos.html

**Step 4: Testing** (15 min)

Test TOS modal on all pages:
- [ ] Modal displays correctly (centered, styled)
- [ ] Accept button works
- [ ] Close button works
- [ ] Animations work (fade in, slide in)
- [ ] Responsive design works on mobile

**Verification**: Check browser DevTools > Elements > `<head>` - no `<style id="tos-modal-styles">` should exist.

---

### **TASK 1.3: Escape State Name Interpolation**

**Issue ID**: HIGH-004
**Severity**: HIGH
**File**: `frontend/scripts/share-experience-main.js`
**Line**: 879
**Estimated Time**: 15 minutes
**Complexity**: Low

#### **Current State**
State name interpolated into error message without escaping, creating XSS potential.

#### **Step-by-Step Remediation**

**Step 1: Add escapeHTML Function** (5 min)

Add to `frontend/scripts/share-experience-main.js` at the top of the file:

```javascript
/**
 * Escape HTML special characters to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text safe for HTML insertion
 */
function escapeHTML(text) {
  if (text === null || text === undefined) return '';
  const div = document.createElement('div');
  div.textContent = String(text);
  return div.innerHTML;
}
```

**Step 2: Update Line 879** (5 min)

Find line 879 (error message with state name):

```javascript
// BEFORE:
alert(`Error: State "${selectedState}" not found in data.`);

// AFTER:
alert(`Error: State "${escapeHTML(selectedState)}" not found in data.`);
```

**Step 3: Find and Fix Similar Patterns** (5 min)

Search for other unescaped interpolations:

```bash
grep -n "selectedState\|stateName" frontend/scripts/share-experience-main.js
```

Apply escapeHTML() to all user-controlled data in error messages or DOM insertion.

**Testing**:
- [ ] Try submitting review with invalid state name
- [ ] Verify error message displays correctly
- [ ] Test with XSS payload: `<script>alert(1)</script>`
- [ ] Confirm script tags are escaped, not executed

---

### **TASK 1.4: Decouple CSS from onclick Attributes**

**Issue ID**: HIGH-006
**Severity**: HIGH
**File**: `frontend/agencies.html`
**Lines**: 459, 467, 1231, 1236
**Estimated Time**: 1 hour
**Complexity**: Low-Medium

#### **Current State**
CSS selectors target `[onclick]` attribute, coupling styling to inline handlers. When handlers are removed, styling breaks.

#### **Step-by-Step Remediation**

**Step 1: Identify CSS Rules** (15 min)

Search for CSS rules targeting onclick:

```bash
grep -n "\[onclick\]" frontend/agencies.html
grep -n "\[onclick\]" frontend/styles/*.css
```

**Step 2: Add Semantic Classes** (20 min)

Replace attribute selectors with class-based selectors:

```css
/* BEFORE: */
button[onclick] {
  cursor: pointer;
  background-color: #007bff;
}

.review-section [onclick] {
  border: 1px solid #ccc;
}

/* AFTER: */
button.clickable,
button[data-action] {
  cursor: pointer;
  background-color: #007bff;
}

.review-section .clickable,
.review-section [data-action] {
  border: 1px solid #ccc;
}
```

**Step 3: Update HTML Elements** (15 min)

Add `.clickable` class to elements that need styling:

```html
<!-- BEFORE: -->
<button onclick="someFunction()">Click Me</button>

<!-- AFTER: -->
<button data-action="some-function" class="clickable">Click Me</button>
```

**Step 4: Testing** (10 min)

- [ ] Verify all interactive elements styled correctly
- [ ] Check hover states work
- [ ] Verify responsive behavior
- [ ] Test across browsers

---

### **TASK 1.5: Remove CSP 'unsafe-inline' Requirement**

**Issue ID**: HIGH-002
**Severity**: HIGH
**Files**: All HTML pages
**Estimated Time**: 30 minutes
**Complexity**: Low
**Prerequisites**: Tasks 1.1 and 1.2 must be complete

#### **Current State**
CSP headers require `'unsafe-inline'` for both `script-src` (inline handlers) and `style-src` (TOS modal).

#### **Step-by-Step Remediation**

**Step 1: Update CSP Headers** (20 min)

Edit CSP meta tag in all HTML pages:

```html
<!-- BEFORE: -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://accounts.google.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' http://localhost:3000;
">

<!-- AFTER: -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' https://cdn.jsdelivr.net https://accounts.google.com;
  style-src 'self';
  img-src 'self' data: https:;
  connect-src 'self' http://localhost:3000;
  font-src 'self' data:;
">
```

**Pages to Update**: All 13 HTML pages

**Step 2: Testing** (10 min)

- [ ] Open browser DevTools Console
- [ ] Check for CSP violation warnings
- [ ] Verify no "Refused to execute inline script" errors
- [ ] Verify no "Refused to apply inline style" errors
- [ ] Test all page functionality

**Expected Result**: Zero CSP violations

---

## 🎯 PHASE 2: MEDIUM PRIORITY IMPROVEMENTS

**Target**: Code quality and robustness enhancements
**Total Time**: 6-8 hours
**Blocking**: No (quality improvements)
**Success Criteria**: Zero MEDIUM severity issues

---

### **TASK 2.1: NoSQL Injection Prevention**

**Severity**: MEDIUM
**Files**: `backend/routes/*.js`, `backend/models/*.js`
**Estimated Time**: 2 hours
**Complexity**: Medium

#### **Issue**
MongoDB query parameters not sanitized, allowing potential NoSQL injection attacks.

#### **Step-by-Step Remediation**

**Step 1: Install mongo-sanitize** (5 min)

```bash
cd backend
npm install mongo-sanitize
```

**Step 2: Create Sanitization Middleware** (20 min)

Create `backend/middleware/sanitize.js`:

```javascript
const mongoSanitize = require('mongo-sanitize');

/**
 * Sanitize request data to prevent NoSQL injection
 * Removes $ and . characters from user input
 */
function sanitizeInput(req, res, next) {
  // Sanitize body
  if (req.body) {
    req.body = mongoSanitize(req.body);
  }

  // Sanitize query parameters
  if (req.query) {
    req.query = mongoSanitize(req.query);
  }

  // Sanitize URL parameters
  if (req.params) {
    req.params = mongoSanitize(req.params);
  }

  next();
}

module.exports = sanitizeInput;
```

**Step 3: Apply Middleware Globally** (10 min)

Edit `backend/server.js`:

```javascript
const sanitizeInput = require('./middleware/sanitize');

// Apply after body parser, before routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sanitizeInput); // Add sanitization middleware

// ... routes ...
```

**Step 4: Add Mongoose Schema Validation** (45 min)

Update `backend/models/*.js` with strict type validation:

```javascript
// Example: backend/models/Review.js
const reviewSchema = new mongoose.Schema({
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true,
    maxlength: [50, 'State name too long'],
    // Whitelist allowed characters
    validate: {
      validator: function(v) {
        return /^[a-zA-Z\s\-]+$/.test(v);
      },
      message: 'State name contains invalid characters'
    }
  },
  comments: {
    type: String,
    required: true,
    minlength: [20, 'Comments must be at least 20 characters'],
    maxlength: [5000, 'Comments too long'],
    trim: true
  }
  // ... other fields with strict validation
});
```

**Step 5: Testing** (40 min)

Test with injection payloads:

```javascript
// Test cases
const injectionPayloads = [
  { state: { $ne: null } },  // Bypass state validation
  { state: { $gt: "" } },     // Return all records
  { comments: { $regex: ".*" } } // Regex injection
];

// Expected: All payloads sanitized/rejected
```

---

### **TASK 2.2: Input Validation Hardening**

**Severity**: MEDIUM
**Files**: `backend/routes/*.js`
**Estimated Time**: 2 hours
**Complexity**: Low-Medium

#### **Step-by-Step Remediation**

**Step 1: Install Validator Library** (5 min)

```bash
cd backend
npm install validator
```

**Step 2: Create Validation Utilities** (30 min)

Create `backend/utils/validators.js`:

```javascript
const validator = require('validator');

/**
 * Validate email address
 */
function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  return validator.isEmail(email, {
    allow_display_name: false,
    require_tld: true,
    allow_utf8_local_part: false
  });
}

/**
 * Validate phone number (Philippine format)
 */
function isValidPhoneNumber(phone) {
  if (!phone || typeof phone !== 'string') return false;
  // Philippine numbers: +63 or 0, followed by 10 digits
  return /^(\+63|0)[0-9]{10}$/.test(phone.replace(/[\s\-]/g, ''));
}

/**
 * Validate URL
 */
function isValidURL(url) {
  if (!url || typeof url !== 'string') return false;
  return validator.isURL(url, {
    protocols: ['http', 'https'],
    require_protocol: true,
    require_valid_protocol: true,
    allow_underscores: true
  });
}

/**
 * Sanitize string input
 */
function sanitizeString(str, maxLength = 5000) {
  if (!str || typeof str !== 'string') return '';

  // Remove null bytes
  str = str.replace(/\0/g, '');

  // Trim whitespace
  str = str.trim();

  // Limit length
  if (str.length > maxLength) {
    str = str.substring(0, maxLength);
  }

  return str;
}

module.exports = {
  isValidEmail,
  isValidPhoneNumber,
  isValidURL,
  sanitizeString
};
```

**Step 3: Apply Validation in Routes** (1 hour)

Update `backend/routes/agencyReviews.js`:

```javascript
const { isValidEmail, sanitizeString } = require('../utils/validators');

router.post('/', isAuthenticated, async (req, res) => {
  try {
    // Validate email if provided
    if (req.body.email && !isValidEmail(req.body.email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address format'
      });
    }

    // Sanitize comments
    const comments = sanitizeString(req.body.comments, 5000);
    if (comments.length < 20) {
      return res.status(400).json({
        success: false,
        message: 'Comments must be at least 20 characters'
      });
    }

    // ... rest of validation ...
  } catch (error) {
    // ...
  }
});
```

**Step 4: Testing** (25 min)

Test with invalid inputs:
- [ ] Invalid email: `test@`, `test.com`, `@example.com`
- [ ] Invalid phone: `123`, `abcdefghij`, `+1234567890`
- [ ] Invalid URL: `javascript:alert(1)`, `htp://example.com`
- [ ] Oversized input: 10,000 character string
- [ ] Null bytes: `test\0test`

---

### **TASK 2.3: Error Response Sanitization**

**Severity**: MEDIUM
**Files**: `backend/server.js`, `backend/routes/*.js`
**Estimated Time**: 1 hour
**Complexity**: Low

#### **Step-by-Step Remediation**

**Step 1: Create Error Handler Middleware** (30 min)

Create `backend/middleware/errorHandler.js`:

```javascript
/**
 * Global error handler middleware
 * Sanitizes error responses to prevent information leakage
 */
function errorHandler(err, req, res, next) {
  // Log full error server-side (for debugging)
  console.error('Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip
  });

  // Determine status code
  const statusCode = err.statusCode || err.status || 500;

  // Generic error response (hide internal details)
  const response = {
    success: false,
    message: sanitizeErrorMessage(err.message, statusCode),
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      details: err.details
    })
  };

  res.status(statusCode).json(response);
}

/**
 * Sanitize error message based on status code
 */
function sanitizeErrorMessage(message, statusCode) {
  // Client errors (4xx) - can show specific message
  if (statusCode >= 400 && statusCode < 500) {
    // Still sanitize to remove sensitive info
    return message.replace(/mongodb|mongoose|database|collection/gi, 'data');
  }

  // Server errors (5xx) - generic message only
  return 'An internal server error occurred. Please try again later.';
}

module.exports = errorHandler;
```

**Step 2: Apply Error Handler** (10 min)

Edit `backend/server.js`:

```javascript
const errorHandler = require('./middleware/errorHandler');

// ... routes ...

// Error handler must be last middleware
app.use(errorHandler);
```

**Step 3: Remove Stack Traces in Production** (10 min)

Update all catch blocks:

```javascript
// BEFORE:
catch (error) {
  res.status(500).json({
    success: false,
    message: error.message,  // Leaks internal details
    stack: error.stack       // Exposes file paths
  });
}

// AFTER:
catch (error) {
  next(error); // Pass to error handler middleware
}
```

**Step 4: Testing** (10 min)

- [ ] Trigger 500 error, verify generic message in production
- [ ] Trigger 400 error, verify specific message allowed
- [ ] Check logs contain full error details
- [ ] Verify no stack traces in production responses

---

### **TASK 2.4: Security Event Logging**

**Severity**: MEDIUM
**Files**: `backend/utils/securityLogger.js`, `backend/middleware/*.js`
**Estimated Time**: 2 hours
**Complexity**: Medium

#### **Step-by-Step Remediation**

**Step 1: Enhance Security Logger** (45 min)

Update `backend/utils/securityLogger.js`:

```javascript
const fs = require('fs').promises;
const path = require('path');

const LOG_DIR = path.join(__dirname, '../logs');
const SECURITY_LOG = path.join(LOG_DIR, 'security.log');

/**
 * Ensure log directory exists
 */
async function ensureLogDirectory() {
  try {
    await fs.mkdir(LOG_DIR, { recursive: true });
  } catch (error) {
    console.error('Failed to create log directory:', error);
  }
}

/**
 * Log security event
 */
async function logSecurityEvent(event) {
  try {
    await ensureLogDirectory();

    const logEntry = {
      timestamp: new Date().toISOString(),
      type: event.type,
      severity: event.severity || 'INFO',
      userId: event.userId || 'anonymous',
      ip: event.ip,
      userAgent: event.userAgent,
      action: event.action,
      resource: event.resource,
      result: event.result,
      details: event.details
    };

    const logLine = JSON.stringify(logEntry) + '\n';
    await fs.appendFile(SECURITY_LOG, logLine);

    // Also log to console for immediate visibility
    console.log(`[SECURITY] ${event.type}:`, logEntry);
  } catch (error) {
    console.error('Failed to write security log:', error);
  }
}

/**
 * Log authentication failure
 */
function logAuthFailure(req, reason) {
  return logSecurityEvent({
    type: 'AUTH_FAILURE',
    severity: 'WARNING',
    ip: req.ip,
    userAgent: req.get('user-agent'),
    action: 'login_attempt',
    result: 'denied',
    details: { reason }
  });
}

/**
 * Log CSRF violation
 */
function logCSRFViolation(req) {
  return logSecurityEvent({
    type: 'CSRF_VIOLATION',
    severity: 'HIGH',
    ip: req.ip,
    userAgent: req.get('user-agent'),
    action: req.method + ' ' + req.path,
    result: 'blocked',
    details: {
      referer: req.get('referer'),
      origin: req.get('origin')
    }
  });
}

/**
 * Log rate limit trigger
 */
function logRateLimitTrigger(req, limit) {
  return logSecurityEvent({
    type: 'RATE_LIMIT',
    severity: 'WARNING',
    ip: req.ip,
    userAgent: req.get('user-agent'),
    action: req.method + ' ' + req.path,
    result: 'blocked',
    details: {
      limit: limit.max,
      window: limit.windowMs
    }
  });
}

/**
 * Log suspicious activity
 */
function logSuspiciousActivity(req, reason) {
  return logSecurityEvent({
    type: 'SUSPICIOUS_ACTIVITY',
    severity: 'HIGH',
    userId: req.user?.id,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    action: req.method + ' ' + req.path,
    result: 'flagged',
    details: { reason, body: req.body }
  });
}

module.exports = {
  logSecurityEvent,
  logAuthFailure,
  logCSRFViolation,
  logRateLimitTrigger,
  logSuspiciousActivity
};
```

**Step 2: Integrate Logging** (45 min)

Update `backend/middleware/auth.js`:

```javascript
const { logAuthFailure } = require('../utils/securityLogger');

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  // Log authentication failure
  logAuthFailure(req, 'not_authenticated');

  res.status(401).json({
    success: false,
    message: 'Authentication required'
  });
}
```

Update rate limiters in `backend/server.js`:

```javascript
const { logRateLimitTrigger } = require('./utils/securityLogger');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  handler: (req, res) => {
    logRateLimitTrigger(req, { max: 10, windowMs: 15 * 60 * 1000 });
    res.status(429).json({
      success: false,
      message: 'Too many login attempts. Please try again later.'
    });
  }
});
```

**Step 3: Testing** (30 min)

- [ ] Trigger auth failure, check log file created
- [ ] Trigger rate limit, verify logged
- [ ] Check log format is JSON
- [ ] Verify timestamps are ISO 8601

---

### **TASK 2.5: OAuth State Parameter Crypto Verification**

**Severity**: MEDIUM
**File**: `backend/config/passport.js`
**Estimated Time**: 1 hour
**Complexity**: Medium

#### **Step-by-Step Remediation**

**Step 1: Generate Cryptographic State** (30 min)

Edit `backend/config/passport.js`:

```javascript
const crypto = require('crypto');

// Store for state validation (use Redis in production)
const stateStore = new Map();

/**
 * Generate cryptographic state token
 */
function generateStateToken() {
  const token = crypto.randomBytes(32).toString('hex');
  const timestamp = Date.now();

  stateStore.set(token, {
    timestamp,
    expiresAt: timestamp + (5 * 60 * 1000) // 5 minutes
  });

  return token;
}

/**
 * Validate state token
 */
function validateStateToken(token) {
  const state = stateStore.get(token);

  if (!state) return false;
  if (Date.now() > state.expiresAt) {
    stateStore.delete(token);
    return false;
  }

  // One-time use
  stateStore.delete(token);
  return true;
}

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    state: true, // Enable state parameter
  },
  async (accessToken, refreshToken, profile, done) => {
    // ... existing code ...
  }
));
```

**Step 2: Add State Validation Route** (20 min)

Update `backend/routes/auth.js`:

```javascript
// Google OAuth initiation
router.get('/google', (req, res, next) => {
  const state = generateStateToken();

  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: state
  })(req, res, next);
});

// Google OAuth callback
router.get('/google/callback', (req, res, next) => {
  const state = req.query.state;

  if (!validateStateToken(state)) {
    return res.status(403).json({
      success: false,
      message: 'Invalid OAuth state parameter'
    });
  }

  passport.authenticate('google', {
    failureRedirect: '/login'
  })(req, res, next);
}, (req, res) => {
  res.redirect('/');
});
```

**Step 3: Testing** (10 min)

- [ ] Initiate OAuth flow, verify state parameter in URL
- [ ] Complete OAuth flow, verify state validated
- [ ] Try replaying state token, verify rejected
- [ ] Wait 6 minutes, verify state expired

---

## 🎯 PHASE 3: COMPREHENSIVE TESTING & VALIDATION

**Target**: Validate all security controls
**Total Time**: 4-6 hours
**Blocking**: No (validation phase)
**Success Criteria**: All tests pass, zero security violations detected

---

### **TASK 3.1: XSS Payload Testing**

**Estimated Time**: 2 hours
**Complexity**: Medium

#### **Test Cases**

**Step 1: Prepare Test Payloads** (15 min)

Create `test/security/xss-payloads.json`:

```json
[
  "<script>alert('XSS')</script>",
  "<img src=x onerror=alert('XSS')>",
  "<svg/onload=alert('XSS')>",
  "javascript:alert('XSS')",
  "<iframe src='javascript:alert(\"XSS\")'></iframe>",
  "<body onload=alert('XSS')>",
  "<input onfocus=alert('XSS') autofocus>",
  "'-alert('XSS')-'",
  "\"><script>alert(String.fromCharCode(88,83,83))</script>",
  "<IMG SRC=\"javascript:alert('XSS');\">",
  "<SCRIPT SRC=http://xss.rocks/xss.js></SCRIPT>",
  "%3Cscript%3Ealert('XSS')%3C/script%3E",
  "<IMG SRC=javascript:alert(&quot;XSS&quot;)>"
]
```

**Step 2: Test Agency Review Submission** (45 min)

```javascript
// Test each payload in review comments field
xssPayloads.forEach(payload => {
  // Submit review with payload
  const review = {
    agencyId: 'test-agency',
    agencyName: payload,  // Test in name field
    comments: payload,     // Test in comments field
    applicationProcess: 5,
    customerService: 5,
    communication: 5,
    supportServices: 5,
    overallExperience: 5,
    usageFrequency: '1',
    tosAccepted: true
  };

  // Expected: All payloads sanitized/escaped
  // No script execution in browser
  // No unescaped HTML in response
});
```

**Step 3: Test DOMPurify Effectiveness** (30 min)

```javascript
// Test DOMPurify in share-experience.html
const dirtyHTML = '<img src=x onerror=alert("XSS")> <script>alert("XSS")</script>';
const cleanHTML = DOMPurify.sanitize(dirtyHTML);

// Expected: '<img src="x">' (onerror removed, script tag removed)
console.assert(!cleanHTML.includes('onerror'));
console.assert(!cleanHTML.includes('<script>'));
```

**Step 4: Document Results** (30 min)

Create `docs/XSS_TEST_REPORT_[DATE].md` documenting:
- Payloads tested
- Results (sanitized/blocked/escaped)
- Any failures requiring remediation

---

### **TASK 3.2: Authentication & Authorization Testing**

**Estimated Time**: 1 hour
**Complexity**: Low-Medium

#### **Test Cases**

**Step 1: OAuth Flow Testing** (30 min)

- [ ] Initiate Google OAuth, verify redirect to Google
- [ ] Complete OAuth flow, verify user logged in
- [ ] Check session cookie set (httpOnly, sameSite)
- [ ] Verify user profile data saved to database
- [ ] Test logout, verify session destroyed
- [ ] Test Facebook OAuth (if configured)

**Step 2: Protected Endpoint Testing** (20 min)

```bash
# Test without authentication
curl -X POST http://localhost:3000/api/agencyReviews \
  -H "Content-Type: application/json" \
  -d '{"agencyId":"test","comments":"test comments"}'

# Expected: 401 Unauthorized

# Test with valid session
curl -X POST http://localhost:3000/api/agencyReviews \
  -H "Content-Type: application/json" \
  -H "Cookie: connect.sid=..." \
  -d '{"agencyId":"test","comments":"test comments"}'

# Expected: 200 OK or 400 with validation errors
```

**Step 3: Admin Authorization Testing** (10 min)

- [ ] Login as admin user (ADMIN_EMAILS)
- [ ] Access admin-only endpoint
- [ ] Login as regular user
- [ ] Attempt admin endpoint access
- [ ] Expected: 403 Forbidden for non-admin

---

### **TASK 3.3: CSRF Testing**

**Estimated Time**: 1 hour
**Complexity**: Medium

#### **Test Cases**

**Step 1: Valid CSRF Token Test** (20 min)

```javascript
// Get CSRF token from frontend
const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;

// Submit with valid token
fetch('/api/agencyReviews', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': csrfToken
  },
  credentials: 'include',
  body: JSON.stringify({ /* review data */ })
});

// Expected: 200 OK
```

**Step 2: Missing CSRF Token Test** (20 min)

```javascript
// Submit without CSRF token
fetch('/api/agencyReviews', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
    // No X-CSRF-Token header
  },
  credentials: 'include',
  body: JSON.stringify({ /* review data */ })
});

// Expected: 403 Forbidden or CSRF error
```

**Step 3: Invalid CSRF Token Test** (20 min)

```javascript
// Submit with invalid token
fetch('/api/agencyReviews', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': 'invalid-token-12345'
  },
  credentials: 'include',
  body: JSON.stringify({ /* review data */ })
});

// Expected: 403 Forbidden or CSRF error
```

---

### **TASK 3.4: Rate Limiting Verification**

**Estimated Time**: 30 minutes
**Complexity**: Low

#### **Test Cases**

**Step 1: Login Rate Limit Test** (15 min)

```bash
# Send 15 login attempts (limit is 10/15min)
for i in {1..15}; do
  curl -X GET http://localhost:3000/auth/google
  echo "Attempt $i"
done

# Expected: First 10 succeed, attempts 11-15 return 429 Too Many Requests
```

**Step 2: Review Submission Rate Limit Test** (15 min)

```bash
# Send 10 review submissions (limit is 5/15min)
for i in {1..10}; do
  curl -X POST http://localhost:3000/api/agencyReviews \
    -H "Content-Type: application/json" \
    -H "Cookie: ..." \
    -H "X-CSRF-Token: ..." \
    -d '{"agencyId":"test","comments":"test comments..."}'
  echo "Attempt $i"
done

# Expected: First 5 succeed, attempts 6-10 return 429
```

---

### **TASK 3.5: Cross-Browser Compatibility Testing**

**Estimated Time**: 1 hour
**Complexity**: Low

#### **Browsers to Test**
- Chrome (latest)
- Firefox (latest)
- Safari (latest - macOS/iOS)
- Edge (latest)

#### **Test Cases** (15 min per browser)

**For Each Browser**:
- [ ] Load homepage, verify no console errors
- [ ] Test TOS modal display and functionality
- [ ] Test review submission form
- [ ] Test agency card rendering
- [ ] Test OAuth login flow
- [ ] Verify DOMPurify works (check `typeof DOMPurify`)
- [ ] Test CSP enforcement (check console for violations)
- [ ] Test responsive design on mobile viewport

---

### **TASK 3.6: Load Testing**

**Estimated Time**: 30 minutes
**Complexity**: Medium

#### **Tool Setup**

Install Apache Bench or Artillery:

```bash
npm install -g artillery
```

#### **Test Scenarios**

**Scenario 1: Homepage Load** (10 min)

```bash
artillery quick --count 50 --num 100 http://localhost:8000/
```

Expected:
- 95th percentile < 500ms
- No server errors
- All responses 200 OK

**Scenario 2: API Review Submission** (20 min)

Create `test/load/review-submission.yml`:

```yaml
config:
  target: 'http://localhost:3000'
  phases:
    - duration: 60
      arrivalRate: 10
  processor: "./processor.js"

scenarios:
  - name: "Submit Review"
    flow:
      - post:
          url: "/api/agencyReviews"
          headers:
            Content-Type: "application/json"
            X-CSRF-Token: "{{ csrfToken }}"
          json:
            agencyId: "test-agency"
            agencyName: "Test Agency"
            comments: "This is a test review with sufficient length to pass validation requirements."
            applicationProcess: 4
            customerService: 5
            communication: 4
            supportServices: 5
            overallExperience: 5
            usageFrequency: "1"
            tosAccepted: true
```

Run test:
```bash
artillery run test/load/review-submission.yml
```

Expected:
- No 500 errors
- Rate limiting triggers appropriately
- Database handles concurrent writes

---

## 📋 IMPLEMENTATION CHECKLIST

### **Phase 1: HIGH Priority** (5-6 hours)

- [ ] **1.1** Remove inline handlers from share-experience.html (2 hours)
  - [ ] Create share-experience-events.js
  - [ ] Update HTML (remove 12 onclick handlers)
  - [ ] Add script tag
  - [ ] Test all interactions
  - [ ] Verify: `grep -c "onclick=" frontend/share-experience.html` returns 0

- [ ] **1.2** Refactor TOS modal to external CSS (1 hour)
  - [ ] Create/update tos-modal.css
  - [ ] Remove style injection from tos-modal.js
  - [ ] Add CSS link to all 11 HTML pages
  - [ ] Test modal on all pages

- [ ] **1.3** Escape state name interpolation (15 min)
  - [ ] Add escapeHTML() function
  - [ ] Update line 879
  - [ ] Find and fix similar patterns
  - [ ] Test with XSS payload

- [ ] **1.4** Decouple CSS from onclick attributes (1 hour)
  - [ ] Identify CSS rules targeting [onclick]
  - [ ] Add semantic classes
  - [ ] Update HTML elements
  - [ ] Test styling

- [ ] **1.5** Remove CSP 'unsafe-inline' (30 min)
  - [ ] Update CSP headers in all HTML pages
  - [ ] Test for CSP violations
  - [ ] Verify zero violations

**Phase 1 Success Criteria**:
- ✅ Zero inline event handlers
- ✅ Zero inline style injection
- ✅ Strict CSP enforcement enabled
- ✅ Zero CSP violations in console
- ✅ All functionality working

---

### **Phase 2: MEDIUM Priority** (6-8 hours)

- [ ] **2.1** NoSQL injection prevention (2 hours)
  - [ ] Install mongo-sanitize
  - [ ] Create sanitization middleware
  - [ ] Apply globally
  - [ ] Add schema validation
  - [ ] Test with injection payloads

- [ ] **2.2** Input validation hardening (2 hours)
  - [ ] Install validator library
  - [ ] Create validation utilities
  - [ ] Apply in routes
  - [ ] Test with invalid inputs

- [ ] **2.3** Error response sanitization (1 hour)
  - [ ] Create error handler middleware
  - [ ] Apply globally
  - [ ] Remove stack traces in production
  - [ ] Test error responses

- [ ] **2.4** Security event logging (2 hours)
  - [ ] Enhance security logger
  - [ ] Integrate in middleware
  - [ ] Test logging
  - [ ] Verify log format

- [ ] **2.5** OAuth state parameter crypto (1 hour)
  - [ ] Generate cryptographic state tokens
  - [ ] Add state validation
  - [ ] Update OAuth routes
  - [ ] Test OAuth flow

**Phase 2 Success Criteria**:
- ✅ NoSQL injection prevention implemented
- ✅ Comprehensive input validation
- ✅ Error responses sanitized
- ✅ Security events logged
- ✅ OAuth CSRF protection enhanced

---

### **Phase 3: Testing & Validation** (4-6 hours)

- [ ] **3.1** XSS payload testing (2 hours)
  - [ ] Prepare test payloads
  - [ ] Test review submission
  - [ ] Test DOMPurify
  - [ ] Document results

- [ ] **3.2** Authentication testing (1 hour)
  - [ ] Test OAuth flows
  - [ ] Test protected endpoints
  - [ ] Test admin authorization

- [ ] **3.3** CSRF testing (1 hour)
  - [ ] Test valid CSRF token
  - [ ] Test missing token
  - [ ] Test invalid token

- [ ] **3.4** Rate limiting verification (30 min)
  - [ ] Test login rate limit
  - [ ] Test review submission rate limit

- [ ] **3.5** Cross-browser testing (1 hour)
  - [ ] Test in Chrome
  - [ ] Test in Firefox
  - [ ] Test in Safari
  - [ ] Test in Edge

- [ ] **3.6** Load testing (30 min)
  - [ ] Test homepage load
  - [ ] Test API review submission

**Phase 3 Success Criteria**:
- ✅ All XSS payloads sanitized
- ✅ Authentication flows secure
- ✅ CSRF protection working
- ✅ Rate limiting effective
- ✅ Cross-browser compatible
- ✅ Load testing passed

---

## 📊 PROGRESS TRACKING

### **Overall Progress**

```
Phase 1 (HIGH):    [ ] 0/5 tasks complete (0%)
Phase 2 (MEDIUM):  [ ] 0/5 tasks complete (0%)
Phase 3 (Testing): [ ] 0/6 tasks complete (0%)

Total: 0/16 tasks complete (0%)
```

### **Estimated Timeline**

| Phase | Duration | Start Date | Target Completion |
|-------|----------|------------|-------------------|
| Phase 1 | 5-6 hours | TBD | Day 1 |
| Phase 2 | 6-8 hours | TBD | Day 2-3 |
| Phase 3 | 4-6 hours | TBD | Day 4 |

**Total Project Duration**: 3-4 days (assuming 4-5 hours/day)

---

## 🎯 SUCCESS CRITERIA

### **Phase 1 Complete When:**
- ✅ Zero inline event handlers in codebase
- ✅ Zero inline style injection
- ✅ Strict CSP headers enforced (no 'unsafe-inline')
- ✅ Zero CSP violations in browser console
- ✅ All user interactions functional
- ✅ Code reviewed and approved

### **Phase 2 Complete When:**
- ✅ NoSQL injection attacks blocked
- ✅ Invalid input rejected with proper error messages
- ✅ Error responses never leak internal details
- ✅ All security events logged to file
- ✅ OAuth CSRF attacks prevented

### **Phase 3 Complete When:**
- ✅ All XSS test payloads sanitized/blocked
- ✅ Authentication flows tested and secure
- ✅ CSRF protection verified
- ✅ Rate limiting functional
- ✅ All browsers display correctly
- ✅ Load testing shows acceptable performance

### **Overall Project Complete When:**
- ✅ All 16 tasks completed
- ✅ Zero HIGH severity issues
- ✅ Zero MEDIUM severity issues
- ✅ All tests passing
- ✅ Documentation updated
- ✅ Security audit report finalized

---

## 🚨 ROLLBACK PROCEDURES

### **Before Starting Each Phase:**

1. **Create Comprehensive Backup**:
```bash
# Example for Phase 1
mkdir -p backup/phase-1-high-priority-fixes-$(date +%Y%m%d)
cp -r frontend/scripts backup/phase-1-high-priority-fixes-$(date +%Y%m%d)/
cp -r frontend/*.html backup/phase-1-high-priority-fixes-$(date +%Y%m%d)/
```

2. **Create Git Commit** (if using version control):
```bash
git add .
git commit -m "Checkpoint before Phase 1 security fixes"
git tag phase-1-start
```

3. **Document Current State**:
```bash
# Count baseline metrics
echo "Inline handlers: $(grep -r 'onclick=' frontend/*.html | wc -l)" > backup/phase-1-metrics.txt
echo "CSP violations: [manual check]" >> backup/phase-1-metrics.txt
```

### **If Rollback Needed:**

**Option 1: File-Level Rollback**:
```bash
# Restore specific files
cp backup/phase-1-high-priority-fixes-20251105/share-experience.html frontend/
cp backup/phase-1-high-priority-fixes-20251105/scripts/*.js frontend/scripts/
```

**Option 2: Git Rollback**:
```bash
git reset --hard phase-1-start
```

**Option 3: Full Directory Restore**:
```bash
cp -r backup/phase-1-high-priority-fixes-20251105/* frontend/
```

---

## 📚 REFERENCES

- [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [Content Security Policy (CSP) Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [DOMPurify Documentation](https://github.com/cure53/DOMPurify)
- [OWASP NoSQL Injection](https://owasp.org/www-community/attacks/NoSQL_Injection)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

---

**🔍 Megumi Fushiguro**
*Security Analyst, JamWatHQ Project*
*"Systematic remediation ensures lasting security."*

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
