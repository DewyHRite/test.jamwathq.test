# Backup Manifest - HIGH-003 Inline Handlers Fix

**Created**: 2025-11-05
**Session**: Yuuji Itadori - Implementation
**Branch**: backup/tos-modal-standardization-20251103
**Purpose**: Backup before removing 12 inline onclick handlers from share-experience.html

## Files Backed Up

- `frontend/share-experience.html` - Main review submission page with 12 inline onclick handlers

## Issue Being Fixed

**Issue ID**: HIGH-003
**Severity**: HIGH
**Description**: 12 inline onclick handlers violate CSP and create XSS vectors

**Handlers to Remove**:
- Line 1705: `onclick="openUSLegalModal(event)"`
- Lines 2037-2041: `onclick="setRating(1-5)"` (5 star ratings)
- Line 2868: `onclick="openReviewsPopup('${state}')"`
- Line 3382: `onclick="acceptTOS()"`
- Line 3385: `onclick="declineTOS()"`
- Line 3397: `onclick="closeReviewsPopup()"`
- Lines 3403, 3407: `onclick="changePage(-1)"`, `onclick="changePage(1)"`

## Restore Instructions

To restore these files if needed:

```bash
# Copy file back to original location
cp backup/high-003-inline-handlers-fix-20251105/share-experience.html frontend/share-experience.html
```

## Changes to Be Made After Backup

1. Create `frontend/scripts/share-experience-events.js` with event delegation system
2. Remove all 12 inline onclick handlers from share-experience.html
3. Replace with data-action attributes
4. Add script tag to load event delegation handler
5. Test all interactions (8 test cases)
6. Verify zero onclick handlers remain

## Rollback Tested

- [ ] Rollback tested successfully
- [ ] Rollback date: [TBD]
- [ ] Rollback verified by: [TBD]

## Expected Outcome

- Zero inline onclick handlers in share-experience.html
- CSP-compliant event delegation
- All user interactions work correctly
- Security score improves from 7.8 to 8.5

---

**Yuuji Itadori** - Implementation Specialist
*"Backup created. Ready to proceed with confidence!"*
