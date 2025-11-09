# Backup Manifest: Share Experience Review Validation Fix

**Issue**: Missing 20-character minimum validation for experience/comments field
**Date**: 2025-11-05
**Author**: Yuuji (Domain Zero Protocol v6.0)

## Problem

The share-experience page review form was missing validation to ensure users provide at least 20 characters of detail in their experience comments. The agencies-review-modal.js had this validation, but share-experience-page.js did not.

### User Report
> "This should be on the share experience 'Comments must be at least 20 characters. Please provide more detail about your experience.' for reviews"

## Changes Made

### File Modified: `frontend/scripts/share-experience-page.js`

**Added validation after usageFrequency check (lines 227-243):**

```javascript
// Validate experience/comments minimum length (20 characters)
const experienceText = document.getElementById('experience')?.value || '';
const experienceTrimmed = experienceText.trim();
if (experienceTrimmed.length < 20) {
    alert('Comments must be at least 20 characters. Please provide more detail about your experience.');

    // Highlight the experience field
    const experienceField = document.getElementById('experience');
    if (experienceField) {
        experienceField.focus();
        experienceField.style.borderColor = '#ff0000';
        setTimeout(() => {
            experienceField.style.borderColor = '';
        }, 3000);
    }
    return;
}
```

**Updated payload to use trimmed value (line 253):**
- Before: `experience: document.getElementById('experience')?.value || '',`
- After: `experience: experienceTrimmed,`

## Validation Behavior

1. **Minimum Length**: User must enter at least 20 characters (after trimming whitespace)
2. **Visual Feedback**: Field border turns red for 3 seconds when validation fails
3. **Focus**: Cursor automatically moves to the invalid field
4. **Alert Message**: Clear error message explaining the requirement
5. **Submission Prevention**: Form submission blocked until validation passes

## Consistency

This brings the share-experience page validation in line with the agencies-review-modal.js validation (lines 521-534), ensuring consistent user experience across both review interfaces.

## Testing Steps

1. Go to http://localhost:8000/share-experience.html
2. Select a state and fill out the review form
3. In the "Tell us about your experience" field, enter less than 20 characters
4. Click "Submit Experience"
5. **Expected**: Alert appears with message "Comments must be at least 20 characters. Please provide more detail about your experience."
6. **Expected**: Experience field border turns red and receives focus
7. Enter 20+ characters and submit again
8. **Expected**: Form submits successfully

## Related Files

- `frontend/scripts/agencies-review-modal.js` - Similar validation (reference implementation)
- `frontend/share-experience.html` - HTML form with textarea#experience field

## Rollback Instructions

```bash
# To rollback changes
cd "C:\Users\Dewy\OneDrive\Documents\JamWatHQ\Full Codebase"
cp backup/share-experience-validation-20251105/share-experience-page.js frontend/scripts/
```
