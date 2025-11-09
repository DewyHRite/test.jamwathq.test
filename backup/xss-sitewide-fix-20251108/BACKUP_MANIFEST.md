# Backup Manifest: XSS Sitewide Fix
**Date**: 2025-11-08
**Purpose**: Backup before fixing critical XSS vulnerabilities across 4 pages + inline handler + dead code cleanup

## Files Backed Up

1. **faq.html** - XSS vulnerability at line 2643 (profileBtn.innerHTML)
2. **guide.html** - XSS vulnerability at line 1881 (profileBtn.innerHTML)
3. **tos.html** - XSS vulnerability at line 1533 (profileBtn.innerHTML)
4. **news.html** - XSS vulnerability at line 2461 (profileBtn.innerHTML)
5. **share-experience.html** - Inline onchange handler at line 3351
6. **scripts/tos-modal.js** - Dead code (addStyles function, lines 93-538)

## Issues Being Fixed

### P0 - CRITICAL (XSS Vulnerabilities)
- **HIGH-008**: Profile button XSS in 4 pages
- **Attack Vector**: Malicious OAuth account with XSS payload in firstName field
- **Impact**: Cookie theft, session hijacking, XSS execution sitewide

### P1 - HIGH (CSP Violation)
- **HIGH-003**: Inline onchange handler prevents strict CSP

### P2 - MEDIUM (Code Cleanup)
- **HIGH-005**: Dead code cleanup (addStyles function already disabled)

## Remediation Applied

**Safe DOM Pattern** (replacing innerHTML):
```javascript
// BEFORE (Vulnerable):
profileBtn.innerHTML = `<span class="profile-username">${username}</span><span class="profile-logout">(Logout)</span>`;

// AFTER (Safe):
profileBtn.textContent = '';
const usernameSpan = document.createElement('span');
usernameSpan.className = 'profile-username';
usernameSpan.textContent = username; // Auto-escapes HTML
const logoutSpan = document.createElement('span');
logoutSpan.className = 'profile-logout';
logoutSpan.textContent = '(Logout)';
profileBtn.appendChild(usernameSpan);
profileBtn.appendChild(logoutSpan);
```

## Rollback Instructions

If issues occur after deployment:

```bash
# Restore from backup
cp backup/xss-sitewide-fix-20251108/faq.html frontend/
cp backup/xss-sitewide-fix-20251108/guide.html frontend/
cp backup/xss-sitewide-fix-20251108/tos.html frontend/
cp backup/xss-sitewide-fix-20251108/news.html frontend/
cp backup/xss-sitewide-fix-20251108/share-experience.html frontend/
cp backup/xss-sitewide-fix-20251108/tos-modal.js frontend/scripts/
```

## Expected Outcome

**Security Score**: 7.2/10 (C+) → 8.5/10 (A-)
**XSS Vulnerabilities**: 4 critical → 0
**CSP Compliance**: Improved
**Code Quality**: Dead code removed

---

**Implemented by**: Yuuji Itadori
**Verified by**: Megumi Fushiguro (pending @re-review)
