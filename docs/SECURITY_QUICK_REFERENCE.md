# 🔐 Security Quick Reference Card

**Source**: CLAUDE.md v2.0 - Security & Design Best Practices Mandate
**Last Updated**: 2025-10-30

---

## 🚨 Security is Top Priority

**All code contributions must be secure, auditable, and aligned with modern web security standards.**

This is **MANDATORY** — security takes precedence over speed, convenience, or feature completeness.

---

## ✅ Pre-Commit Security Checklist

Before committing **ANY** code, verify:

### Input Security (4 items)
- [ ] All user inputs validated (type, length, format)
- [ ] All user inputs sanitized (HTML, SQL, NoSQL injection)
- [ ] File uploads restricted (type, size, malware scan)
- [ ] URL parameters validated

### Authentication Security (5 items)
- [ ] Passwords hashed (bcrypt, min 12 rounds)
- [ ] Sessions use httpOnly, secure, sameSite cookies
- [ ] JWT tokens have expiry (max 1 hour)
- [ ] Refresh tokens stored securely
- [ ] Rate limiting on auth endpoints

### Data Security (5 items)
- [ ] Sensitive data encrypted at rest
- [ ] HTTPS enforced (no HTTP fallback)
- [ ] Database credentials in .env (never committed)
- [ ] API keys stored in environment variables
- [ ] No secrets in client-side code

### API Security (5 items)
- [ ] CORS configured (no wildcard origins)
- [ ] CSP headers implemented
- [ ] Rate limiting on all endpoints
- [ ] Authentication required for sensitive endpoints
- [ ] Authorization checks (user can only access own data)

### Frontend Security (5 items)
- [ ] No inline scripts (CSP compliant)
- [ ] All scripts in external .js files
- [ ] No eval() or Function() constructors
- [ ] XSS prevention (sanitize outputs)
- [ ] CSRF tokens on forms

### Error Handling (4 items)
- [ ] No sensitive data in error messages
- [ ] Generic errors to client ("Internal server error")
- [ ] Detailed errors logged server-side only
- [ ] No stack traces exposed to client

**Total**: 28 security items

---

## ✅ Pre-Commit Design Checklist

Before committing **ANY** UI code, verify:

### Responsive Design (5 items)
- [ ] Mobile-first CSS (min-width media queries)
- [ ] Tested on 375px (mobile), 768px (tablet), 1920px (desktop)
- [ ] No horizontal scroll on mobile
- [ ] Touch targets minimum 44x44px
- [ ] Text readable without zoom (min 16px base)

### Accessibility (6 items)
- [ ] Semantic HTML (`<header>`, `<nav>`, `<main>`, `<article>`)
- [ ] ARIA labels on interactive elements
- [ ] Keyboard navigation support (tab order)
- [ ] Focus indicators visible
- [ ] Color contrast ratio ≥ 4.5:1 (WCAG AA)
- [ ] Screen reader tested (NVDA/JAWS)

### Visual Consistency (5 items)
- [ ] Uses shared CSS modules (modal-standard.css, shared-buttons.css)
- [ ] CSS variables for colors, spacing, typography
- [ ] No inline styles
- [ ] No duplicate CSS
- [ ] Matches design system (button styles, colors, spacing)

### Performance (5 items)
- [ ] CSS minified for production
- [ ] Images optimized (WebP, lazy loading)
- [ ] No render-blocking resources
- [ ] Fonts preloaded
- [ ] Critical CSS inlined (if needed)

### Browser Compatibility (5 items)
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

**Total**: 26 design items

---

## 🚨 Security Severity Levels

### 🔴 Critical
- **Response Time**: STOP ALL WORK, fix within 4 hours
- **Action**: Immediate notification to project manager
- **Example**: Authentication bypass, data breach, remote code execution

### 🟠 High
- **Response Time**: Fix within 24 hours
- **Action**: Immediate notification to project manager
- **Example**: XSS vulnerability, SQL injection, exposed API keys

### 🟡 Medium
- **Response Time**: Fix within 7 days
- **Action**: Document in security-flaws.md
- **Example**: Missing input validation, weak session config

### 🟢 Low
- **Response Time**: Add to backlog
- **Action**: Document in code comments
- **Example**: Missing ARIA labels, non-critical CSP violation

---

## 🛡️ Security Rules (Never Break These)

### Rule 1: No Inline Scripts
```html
❌ WRONG
<script>
  function login() { /* ... */ }
</script>
<button onclick="login()">Login</button>

✅ CORRECT
<script src="scripts/login.js"></script>
<button id="login-btn">Login</button>
```

### Rule 2: Always Validate Input
```javascript
❌ WRONG
function saveReview(data) {
  database.save(data); // DANGEROUS!
}

✅ CORRECT
function saveReview(data) {
  if (!data.rating || data.rating < 1 || data.rating > 5) {
    throw new Error('Invalid rating');
  }
  const sanitized = sanitizeHTML(data.comment);
  database.save({ ...data, comment: sanitized });
}
```

### Rule 3: Never Expose Secrets
```javascript
❌ WRONG
const API_KEY = 'sk_live_123abc'; // DANGEROUS!

✅ CORRECT
const API_KEY = process.env.API_KEY; // From .env
```

### Rule 4: Secure Sessions
```javascript
❌ WRONG
app.use(session({
  secret: 'password123',
  cookie: { secure: false }
}));

✅ CORRECT
app.use(session({
  secret: process.env.SESSION_SECRET,
  cookie: {
    secure: true,      // HTTPS only
    httpOnly: true,    // No JavaScript access
    sameSite: 'strict' // CSRF protection
  }
}));
```

### Rule 5: Safe Error Handling
```javascript
❌ WRONG
catch (err) {
  res.json({ error: err.stack }); // Exposes internals!
}

✅ CORRECT
catch (err) {
  console.error('Error:', err); // Log server-side
  res.status(500).json({ error: 'Internal server error' });
}
```

---

## 🧩 7-Step Security Fix Workflow

1. **Backup First**
   ```bash
   git checkout -b backup/security-fix-YYYYMMDD
   ```

2. **Document in Phase File**
   Update relevant .md file in docs/

3. **Implement Fix**
   Apply fix following security best practices

4. **Local Testing (MANDATORY)**
   ```bash
   cd backend && npm run dev          # Port 3000
   python -m http.server 8000         # Port 8000
   ```

5. **Frontend/Backend Sync**
   Ensure both layers are updated

6. **Documentation Update**
   Update security-flaws.md with resolution

7. **Approval Gate**
   Get explicit approval before production deployment

---

## 📝 Code Comment Standard

```javascript
// See CLAUDE.md - Security & Design Best Practices Mandate
// Security Fix: Input validation for user submissions
// Date: 2025-10-30

function submitData(userInput) {
  const validated = validateInput(userInput);
  return validated;
}
```

---

## 🔍 Quick Security Review Questions

Before approving code, ask:

1. **Threat Modeling**: What could an attacker do?
2. **Input Validation**: Are all inputs validated and sanitized?
3. **Authentication**: Are auth checks in place and tested?
4. **Data Exposure**: Could this leak sensitive information?
5. **Dependencies**: Are all packages up-to-date and secure?

---

## ⚠️ Non-Compliance Consequences

If security best practices are violated:

1. **Code will be rejected** and must be rewritten
2. **Deployment will be blocked** until fixed
3. **Documentation will flag the violation**
4. **Rollback procedure will be triggered** if already deployed

**No exceptions** — security is non-negotiable.

---

## 📚 Full Documentation

For complete details, see:
- **CLAUDE.md** (lines 373-977) - Full security mandate
- **docs/security-flaws.md** - Security flaw tracking
- **docs/claude-security-update-v2.md** - Update summary

---

## 🆘 Emergency Security Response

**Critical security flaw discovered?**

1. ⛔ **STOP ALL WORK** immediately
2. 🔔 **Notify project manager** immediately
3. 💾 Create emergency backup branch
4. 📝 Document in docs/security-flaws.md
5. 🔧 Implement fix within 4 hours
6. ✅ Security audit before deployment
7. 🚀 Deploy only after explicit approval

---

**Print this card and keep it visible during development.**

**Maintainer**: Development Team
**Last Updated**: 2025-10-30
**Version**: 2.0 (matches CLAUDE.md v2.0)
