# Backup Manifest: Site-wide TOS Modal CSS Fix

**Issue**: HIGH-005 - TOS modal appearing at bottom of pages instead of centered overlay
**Date**: 2025-11-05
**Author**: Yuuji (Domain Zero Protocol v6.0)

## Changes Made

Added `<link rel="stylesheet" href="styles/tos-modal.css" />` to all HTML files that load `scripts/tos-modal.js` to ensure consistent TOS modal styling across the entire site.

### Files Modified (10 files)

1. **frontend/about.html**
   - Added tos-modal.css link after cookie-consent-modal.css (line 25)

2. **frontend/agencies.html**
   - Added tos-modal.css link after cookie-consent-modal.css (line 42)
   - Removed duplicate tos-modal.css link that existed at line 44

3. **frontend/agency-ranking.html**
   - Added tos-modal.css link after cookie-consent-modal.css (line 24)

4. **frontend/diagnose-tos-modal.html**
   - Added tos-modal.css link in head section (line 37)

5. **frontend/faq.html**
   - Added tos-modal.css link after cookie-consent-modal.css (line 26)

6. **frontend/guide.html**
   - Added tos-modal.css link after cookie-consent-modal.css (line 26)

7. **frontend/news.html**
   - Added tos-modal.css link after cookie-consent-modal.css (line 24)

8. **frontend/report-problem.html**
   - Added tos-modal.css link after cookie-consent-modal.css (line 25)

9. **frontend/tos.html**
   - Added tos-modal.css link after cookie-consent-modal.css (line 23)

### Files Already Fixed (2 files)

10. **frontend/index.html**
    - Already had tos-modal.css link (added in previous fix)

11. **frontend/share-experience.html**
    - Already had tos-modal.css link (added in previous fix)

### Files That Already Had CSS Link (1 file)

12. **frontend/state-scoreboard.html**
    - Already had tos-modal.css link at line 23

## Verification

```bash
# Verify all 12 HTML files that load tos-modal.js now have tos-modal.css
cd frontend
grep -l "tos-modal\.js" *.html | wc -l  # Returns: 12
grep -l "tos-modal\.css" *.html | wc -l  # Returns: 12
```

## Root Cause

The TOS modal CSS was created and the inline styles in `tos-modal.js` were disabled, but the CSS file was only linked in 2 of the 12 HTML files, causing the modal to appear unstyled at the bottom of pages.

## Solution

Systematically added the CSS link to all pages that use the TOS modal, ensuring consistent appearance site-wide.

## Testing Required

Test TOS modal appearance on all 12 pages to verify:
- Modal appears centered as overlay (not at bottom)
- Styling matches original design (yellow header, white background, green borders)
- Consistent appearance across all pages

## Related Issues

- HIGH-005: TOS modal positioning and styling
- Phase 1 Task 1.2: Complete site-wide TOS modal standardization

## Rollback Instructions

```bash
# To rollback changes
cd "C:\Users\Dewy\OneDrive\Documents\JamWatHQ\Full Codebase"

# Restore individual files
cp backup/high-005-sitewide-tos-css-20251105/about.html frontend/
cp backup/high-005-sitewide-tos-css-20251105/agencies.html frontend/
cp backup/high-005-sitewide-tos-css-20251105/agency-ranking.html frontend/
cp backup/high-005-sitewide-tos-css-20251105/diagnose-tos-modal.html frontend/
cp backup/high-005-sitewide-tos-css-20251105/faq.html frontend/
cp backup/high-005-sitewide-tos-css-20251105/guide.html frontend/
cp backup/high-005-sitewide-tos-css-20251105/news.html frontend/
cp backup/high-005-sitewide-tos-css-20251105/report-problem.html frontend/
cp backup/high-005-sitewide-tos-css-20251105/tos.html frontend/
```
