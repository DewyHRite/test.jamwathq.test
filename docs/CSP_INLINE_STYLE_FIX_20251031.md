# CSP Inline Style Violation Fix - October 31, 2025

## Issue Description

**Date Discovered**: 2025-10-31
**Severity**: High (Security - CSP Violation)
**Status**: ✅ Resolved
**Affected Pages**: state-scoreboard.html, report-problem.html

---

## Problem Description

Browser console showed Content Security Policy (CSP) violations for inline styles on both state-scoreboard.html and report-problem.html pages.

**Console Errors:**

```
Refused to apply inline style because it violates the following Content Security Policy directive:
"style-src 'self' https://cdnjs.cloudflare.com https://fonts.googleapis.com".
Either the 'unsafe-inline' keyword, a hash ('sha256-...'), or a nonce ('nonce-...') is required
to enable inline execution.
```

**Violations Detected:**

1. **state-scoreboard.html (line 27-32)**: Inline `style` attribute on `<section id="header">`
2. **state-scoreboard.html (line 264)**: Inline `style="display: none"` on modal
3. **report-problem.html (lines 22-53)**: Inline `<style>` tag in `<head>`

---

## Security Impact

**CSP (Content Security Policy)** is a critical security feature that prevents:
- Cross-Site Scripting (XSS) attacks
- Code injection attacks
- Unauthorized inline script/style execution

**Why This Matters:**
- Inline styles violate CSP `style-src 'self'` directive
- CSP blocks inline styles to prevent malicious code injection
- Proper CSP compliance is a **CLAUDE.md Security Mandate**

---

## Root Cause

### Violation 1: state-scoreboard.html Header Background

**Location**: state-scoreboard.html:27-32

```html
<section
  id="header"
  class="wrapper"
  style="
    background-image: url(&quot;assets/images/wp4013673.jpg&quot;) !important;
    background-size: cover !important;
    background-position: center !important;
    background-repeat: no-repeat !important;
  "
>
```

**Issue**: Inline `style` attribute violates CSP

### Violation 2: state-scoreboard.html Modal

**Location**: state-scoreboard.html:264

```html
<div id="reviews-popup" class="modal" ... style="display: none;">
```

**Issue**: Inline `style` attribute violates CSP

### Violation 3: report-problem.html Style Tag

**Location**: report-problem.html:22-53

```html
<style>
  /* Page-specific styles */
  .report-problem-btn.report-current { ... }
  .hero-banner { background-image: url('...'); }
</style>
```

**Issue**: Inline `<style>` tag in `<head>` violates CSP

---

## Solution Implemented

### Step 1: Backup Branch Created

```bash
git checkout -b backup/csp-inline-style-fix-20251031
```

### Step 2: Move Inline Styles to External CSS

**Per CLAUDE.md Security Best Practices**: All inline styles must be moved to external CSS files.

#### Fix 1: state-scoreboard.html → state-scoreboard.css

**Added to `styles/state-scoreboard.css`:**

```css
/* ================================================
   CSP COMPLIANCE FIX - 2025-10-31
   Moved inline styles to external CSS per CLAUDE.md
   ================================================ */

/* Header background image (was inline style) */
.scoreboard-page #header {
    background-image: url("../assets/images/wp4013673.jpg") !important;
    background-size: cover !important;
    background-position: center !important;
    background-repeat: no-repeat !important;
}

/* Modal hidden by default (was inline style="display: none") */
#reviews-popup {
    display: none;
}
```

**Updated HTML** (state-scoreboard.html:26):

```html
<!-- Before -->
<section id="header" class="wrapper" style="...">

<!-- After -->
<section id="header" class="wrapper">
```

```html
<!-- Before -->
<div id="reviews-popup" class="modal" ... style="display: none;">

<!-- After -->
<div id="reviews-popup" class="modal" ...>
```

#### Fix 2: report-problem.html → report-problem.css

**Added to `styles/report-problem.css`:**

```css
/* ========================================
   CSP COMPLIANCE FIX - 2025-10-31
   Moved inline <style> to external CSS per CLAUDE.md
   ======================================== */

/* Report problem button current page indicator (was in <style> tag) */
.report-problem-btn.report-current {
  background: #ffee00;
  color: #000000;
  border-color: #ffee00;
  pointer-events: none;
  box-shadow:
    0 6px 18px rgba(255, 238, 0, 0.6),
    0 0 25px rgba(255, 238, 0, 0.4);
}

.report-problem-btn.report-current::after {
  content: "You're here";
  font-size: 0.75em;
  text-transform: uppercase;
  margin-left: 10px;
  color: #000000;
  letter-spacing: 1px;
}

/* Hero banner background image (was in <style> tag) */
.hero-banner {
  background-image: url('../assets/images/wp4013673.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
```

**Updated HTML** (report-problem.html:20-24):

```html
<!-- Before -->
<link rel="stylesheet" href="styles/modal-standard.css" />
<style>
  /* Page-specific styles */
  ...
</style>
</head>

<!-- After -->
<link rel="stylesheet" href="styles/modal-standard.css" />
<!-- CSP Compliance Fix: Moved inline <style> to report-problem.css - See CLAUDE.md -->
<!-- Date: 2025-10-31 -->
</head>
```

---

## Testing Protocol

**See CLAUDE.md - Testing Requirements**

### Local Testing (Port 8000)

```bash
cd frontend
python -m http.server 8000
```

### Test Checklist

- [x] **state-scoreboard.html** (`http://localhost:8000/state-scoreboard.html`)
  - ✅ No CSP violations in console
  - ✅ Header background image displays correctly (wp4013673.jpg)
  - ✅ Modal starts hidden (display: none)
  - ✅ All functionality intact

- [x] **report-problem.html** (`http://localhost:8000/report-problem.html`)
  - ✅ No CSP violations in console
  - ✅ Hero banner background image displays correctly
  - ✅ "You're here" button indicator works
  - ✅ All functionality intact

### Browser Testing

- [x] Chrome/Edge DevTools Console - No CSP errors
- [x] Firefox DevTools Console - No CSP errors
- [x] Visual regression testing - No layout changes

---

## Files Modified

### CSS Files (External Styles Added)

1. **frontend/styles/state-scoreboard.css**
   - Added `.scoreboard-page #header` background image styles
   - Added `#reviews-popup` display: none

2. **frontend/styles/report-problem.css**
   - Added `.report-problem-btn.report-current` styles
   - Added `.hero-banner` background image styles

### HTML Files (Inline Styles Removed)

3. **frontend/state-scoreboard.html**
   - Removed inline `style` from `<section id="header">` (line 27-32)
   - Removed inline `style="display: none"` from `#reviews-popup` (line 264)

4. **frontend/report-problem.html**
   - Removed entire `<style>` tag from `<head>` (lines 22-53)

---

## Security Compliance

**✅ CLAUDE.md Security Best Practices Mandate**

### Before Fix:
- ❌ CSP violations (inline styles blocked)
- ❌ Security risk (could allow style injection if CSP relaxed)
- ❌ Non-compliant with CLAUDE.md security standards

### After Fix:
- ✅ Zero CSP violations
- ✅ Strict CSP policy maintained (`style-src 'self'`)
- ✅ All styles in external CSS files
- ✅ Fully compliant with CLAUDE.md security mandate
- ✅ No 'unsafe-inline' keyword required
- ✅ Enhanced XSS protection maintained

---

## Design Impact

**Visual Regression Testing**: ✅ No changes

- ✅ Background images display identically
- ✅ Modal behavior unchanged
- ✅ Button indicators work as before
- ✅ All responsive layouts intact

**Performance**: ✅ Improved

- External CSS is cached by browser
- No inline styles = smaller HTML files
- Better separation of concerns

---

## Rollback Procedure

If this fix causes issues:

1. Switch back to previous branch:
   ```bash
   git checkout backup/nav-wp4013673-investigation-20251031
   ```

2. Or restore inline styles:
   - Revert `state-scoreboard.html` changes
   - Revert `report-problem.html` changes
   - Remove new CSS rules from `.css` files

---

## Related Issues

### Other Resource 404 Errors (Not Related to CSP)

The console also showed 404 errors for:

1. **overlay.png** and **shadow.png** - Missing CSS texture images (cosmetic)
2. **banner.jpg** - Referenced in main.css but not used (legacy)

**Status**: Separate issues, lower priority (cosmetic only)

---

## CLAUDE.md Update Required

Per user request, CLAUDE.md has been updated with:

1. **Mandatory Rule**: No inline styles allowed
2. **Enforcement**: All styles must be in external CSS files
3. **Periodic Check**: CSP violation audits required during code review

**See**: CLAUDE.md Section "Security & Design Best Practices Mandate"

---

## Prevention & Future Compliance

### Code Review Checklist

Before committing ANY HTML file, verify:

- [ ] No `style="..."` attributes on HTML elements
- [ ] No `<style>` tags in `<head>` or `<body>`
- [ ] All CSS in external `.css` files
- [ ] CSP policy remains strict (no `'unsafe-inline'`)
- [ ] Browser console shows zero CSP violations

### Automated Checks

**Recommended** (future enhancement):

```bash
# Pre-commit hook to detect inline styles
grep -r "style=\"" frontend/*.html && echo "ERROR: Inline styles detected" || echo "OK"
grep -r "<style>" frontend/*.html && echo "ERROR: Inline <style> tags detected" || echo "OK"
```

---

## Conclusion

**Root Cause**: Inline styles violated Content Security Policy

**Resolution**: Moved all inline styles to external CSS files

**Security Impact**: ✅ CSP compliance fully restored

**wp4013673.jpg Background Image**: ✅ Now displays correctly without CSP violations

**CLAUDE.md Compliance**: ✅ Fully aligned with security best practices

---

## Maintainer Notes

**Date**: 2025-10-31
**Author**: Claude AI (See CLAUDE.md for AI usage discipline)
**Issue Type**: Security (CSP Violation)
**Resolution**: Code Refactoring (Inline → External CSS)
**Code Impact**: 4 files modified (2 HTML, 2 CSS)
**Testing**: ✅ Passed (localhost:8000)
**Production Ready**: ✅ Yes (after approval)

**Follow-up Tasks**:
- [x] Fix CSP violations
- [x] Document fix
- [x] Update CLAUDE.md with inline style prohibition
- [ ] Add pre-commit hook to prevent future violations (optional)
- [ ] Address overlay.png/shadow.png 404 errors (separate task)

---

**End of Report**
