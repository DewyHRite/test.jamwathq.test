# Old Implementation Cleanup Status

**Date:** 2025-10-17
**Purpose:** Track removal of old profile hub implementations across all HTML files

---

## Overview

The old profile hub implementation showed only "Logout" text when logged in. The new implementation shows "Username (Logout)" for better UX.

### Old Implementation Characteristics:
- Button ID: `login-status-btn`
- Function: `handleLoginStatus()`
- CSS Class: `.login-status-btn`
- Display: Just "Logout" text when logged in

### New Implementation Characteristics:
- Button ID: `profile-hub-btn`
- Function: `handleProfileHub()`
- CSS Class: `.profile-hub-btn`
- Display: "Username (Logout)" when logged in
- Additional CSS: `.profile-username` and `.profile-logout` classes

---

## Cleanup Status

### ✅ COMPLETED

1. **index.html** - Updated
   - CSS classes renamed
   - JavaScript functions updated
   - HTML elements updated
   - Username display implemented

2. **agencies.html** - Updated
   - CSS classes renamed
   - JavaScript functions updated
   - HTML elements updated
   - Username display implemented

3. **about.html** - Updated
   - CSS classes renamed
   - JavaScript functions updated
   - HTML elements updated
   - Username display implemented

### 🚧 IN PROGRESS / PENDING

4. **tos.html** - Needs Update
   - Still using `login-status-btn`
   - Still using `handleLoginStatus()`
   - Shows only "Logout" text

5. **guide.html** - Needs Update
   - Still using `login-status-btn`
   - Still using `handleLoginStatus()`
   - Shows only "Logout" text

6. **news.html** - Needs Update
   - Still using `login-status-btn`
   - Still using `handleLoginStatus()`
   - Shows only "Logout" text

7. **faq.html** - Needs Update
   - Still using `login-status-btn`
   - Still using `handleLoginStatus()`
   - Shows only "Logout" text

8. **share-experience.html** - Needs Update
   - Still using `login-status-btn`
   - Still using `handleLoginStatus()`
   - Shows only "Logout" text

---

## Changes Required for Each File

For each pending file, the following changes are needed:

### CSS Changes:
1. Rename `.login-status-btn` → `.profile-hub-btn`
2. Add `gap: 8px` to `.profile-hub-btn`
3. Add `.profile-username` class (font-size: 13px)
4. Add `.profile-logout` class (font-size: 11px, opacity: 0.9)
5. Update responsive CSS for mobile

### JavaScript Changes:
1. Rename `handleLoginStatus()` → `handleProfileHub()`
2. Change `getElementById('login-status-btn')` → `getElementById('profile-hub-btn')`
3. Update display logic to show username:
   ```javascript
   const username = status.user.firstName || status.user.name || status.user.email.split('@')[0];
   profileBtn.innerHTML = `<span class="profile-username">${username}</span><span class="profile-logout">(Logout)</span>`;
   ```

### HTML Changes:
1. Change button ID: `id="login-status-btn"` → `id="profile-hub-btn"`
2. Change button class: `class="login-status-btn"` → `class="profile-hub-btn"`
3. Change onclick: `onclick="handleLoginStatus()"` → `onclick="handleProfileHub()"`

---

## Testing Checklist

After updating each file, verify:
- [ ] Profile hub displays "Login" when logged out
- [ ] Profile hub displays "Username (Logout)" when logged in (not just "Logout")
- [ ] Clicking profile hub opens login modal when logged out
- [ ] Clicking profile hub logs out when logged in
- [ ] Green accent appears when logged in
- [ ] Mobile responsive styling works
- [ ] Profile icon remains visible

---

## Progress: 3/8 Complete (37.5%)

**Next Steps:**
1. Update tos.html
2. Update guide.html
3. Update news.html
4. Update faq.html
5. Update share-experience.html
6. Test all pages
7. Remove this tracking document once complete

---

**Last Updated:** 2025-10-17 | **Updated By:** AI Assistant
