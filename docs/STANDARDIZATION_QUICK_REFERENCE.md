# Quick Reference: Standardized Components

**Use this guide** for quick copy-paste when building new pages or migrating existing ones.

---

## 📦 Required Files

### CSS (in `<head>`)
```html
<link rel="stylesheet" href="styles/shared-buttons.css" />
<link rel="stylesheet" href="styles/profile-hub.css" />
<link rel="stylesheet" href="styles/support-container.css" />
<link rel="stylesheet" href="styles/login-modal.css" />
```

### JavaScript (before `</body>`)
```html
<script src="scripts/auth-client.js"></script>
<script src="scripts/profile-hub.js"></script>
<script src="scripts/login-modal.js"></script>
```

---

## 🔨 HTML Components

### Profile Hub
```html
<div class="profile-hub-container">
  <button id="profile-hub-btn" class="profile-hub-btn" onclick="handleProfileHub()">
    Login
  </button>
  <div class="profile-icon" title="User Profile">
    <i class="fa fa-user"></i>
  </div>
</div>
```

### Support Container
```html
<div class="support-container">
  <a href="#footer" class="report-problem-btn" title="Report a problem">
    Report a problem
  </a>
  <a href="#footer" class="floating-gear-icon" title="Contact & Support">
    <i class="fa fa-cog"></i>
  </a>
</div>
```

### Login Modal
```html
<div id="loginModal" class="modal" role="dialog" aria-labelledby="loginModalTitle" aria-modal="true">
  <div class="modal-content auth-modal-content" style="max-width: 500px; background: #1a1a1a; border: 3px solid #ffee00; padding: 2em; text-align: center; border-radius: 8px;">
    <h2 id="loginModalTitle" style="color: #ffee00; margin-bottom: 1em;">
      <i class="fas fa-sign-in-alt"></i> Login Required
    </h2>
    <p style="color: #ffffff; margin-bottom: 1em;">Please log in to access your account.</p>
    <p style="color: #ffffff; margin-bottom: 1.5em;">Log in with Google or Facebook to continue.</p>
    <div style="display: flex; flex-direction: column; align-items: center; gap: 1em;">
      <button onclick="loginWithGoogle()" class="btn-standard btn-google" aria-label="Sign in with Google" style="width: 280px;">
        <i class="fab fa-google"></i> Sign in with Google
      </button>
      <button onclick="loginWithFacebook()" class="btn-standard btn-facebook" aria-label="Sign in with Facebook" style="width: 280px;">
        <i class="fab fa-facebook"></i> Sign in with Facebook
      </button>
      <button onclick="closeLoginModal()" class="btn-standard btn-secondary" aria-label="Cancel" style="width: 280px;">Cancel</button>
    </div>
  </div>
</div>
```

---

## ✅ Migration Checklist

When migrating an existing HTML file:

- [ ] Remove inline `<style>` blocks for:
  - `.profile-hub-container`, `.profile-hub-btn`, `.profile-icon`
  - `.support-container`, `.report-problem-btn`, `.floating-gear-icon`
  - `.modal`, `.modal-content`

- [ ] Remove inline `<script>` blocks containing:
  - `updateProfileHub()` function
  - `handleProfileHub()` function
  - `loginWithGoogle()`, `loginWithFacebook()`, `closeLoginModal()` functions

- [ ] Add CSS links to `<head>`

- [ ] Add JS script includes before `</body>`

- [ ] Test all functionality:
  - Login/logout works
  - Modal opens and closes
  - Buttons are pill-shaped
  - Mobile responsive

---

**Full Documentation:** See [STANDARDIZATION_GUIDE.md](STANDARDIZATION_GUIDE.md)
