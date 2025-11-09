# Report a Problem - Testing Checklist

**Tester:** __________________
**Date:** __________________
**Browser:** __________________
**Device:** __________________

---

## 🎯 Quick Start

1. Open: `frontend/agencies.test-gear-icon.html`
2. Click gear icon (bottom-right)
3. Should navigate to `report-problem.html`
4. Fill out form and submit
5. Check all items below

---

## ✅ Essential Tests

### Gear Icon
- [ ] Gear icon visible in bottom-right
- [ ] Clicking navigates to report-problem.html
- [ ] Title shows "Report a Problem"

### Page Loads
- [ ] No errors in browser console (F12)
- [ ] All sections visible (header, form, FAQ, footer)
- [ ] Auto-detected fields populated

### Form Validation
- [ ] Empty form → Error alert
- [ ] Category required
- [ ] Description requires 20+ characters
- [ ] Reference ID validates pattern (AGY-XXX-001)
- [ ] Email validates format

### Form Submission
- [ ] Submit button shows loading spinner
- [ ] Success message appears (~1.5s)
- [ ] "Submit Another" resets form

### Draft System
- [ ] Fill form partially → Wait 30s → Refresh
- [ ] Prompt to restore draft appears
- [ ] Accepting restores data

### Responsive
- [ ] Desktop: Full width layout
- [ ] Mobile (<768px): Stacked buttons, single column

---

## 🐛 Issues Found

Issue #1: ___________________________________________

Issue #2: ___________________________________________

---

## 🚀 Approval

- [ ] ✅ Approve for deployment
- [ ] ⚠️ Approve with minor fixes
- [ ] ❌ Needs significant changes

**Tester:** __________________
**Date:** __________________
