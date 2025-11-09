# Modal Component Guidelines

**Version**: 1.0
**Date**: October 29, 2025
**Status**: 📘 **IMPLEMENTATION GUIDE** (For Future Component Migration)

---

## Purpose

This document provides practical guidelines for implementing and using modal components in the JamWatHQ application following the behavior specification defined in `modal-behavior.md`.

**Target Audience**: Developers implementing modal features

**Prerequisites**:
- Read `docs/modal-behavior.md` first
- Understand ARIA dialog pattern
- Familiarity with JavaScript event handling

---

## Quick Start

### 1. Copy Modal Template

```html
<!-- Add to your HTML file before </body> -->
<div id="yourModal"
     class="modal"
     role="dialog"
     aria-modal="true"
     aria-labelledby="yourModalTitle"
     aria-describedby="yourModalDesc">

  <div class="modal-content auth-modal-content">
    <h2 id="yourModalTitle" class="auth-modal-heading">
      <i class="fas fa-icon" aria-hidden="true"></i>
      Modal Title
    </h2>

    <p id="yourModalDesc" class="auth-modal-text">
      Modal description text
    </p>

    <div class="auth-modal-actions">
      <button id="btn-action" class="btn-standard btn-primary auth-modal-btn">
        Action
      </button>
      <button id="btn-cancel" class="btn-standard btn-secondary auth-modal-btn">
        Cancel
      </button>
    </div>
  </div>
</div>
```

### 2. Load Required Files

```html
<!-- In <head> -->
<link rel="stylesheet" href="styles/modal-standard.css" />

<!-- Before </body> -->
<script src="scripts/login-modal.js"></script>
<script src="scripts/login-init.js"></script>
```

### 3. Trigger Modal

```javascript
// Open modal when button clicked
document.getElementById('openModalBtn').addEventListener('click', function() {
  openLoginModal(); // Or your custom openModal function
});
```

---

## HTML Structure

### Required ARIA Attributes

| Attribute | Required | Purpose | Example |
|-----------|----------|---------|---------|
| `role="dialog"` | ✅ Yes | Identifies element as dialog | `<div role="dialog">` |
| `aria-modal="true"` | ✅ Yes | Indicates background is inert | `<div aria-modal="true">` |
| `aria-labelledby` | ✅ Yes | Points to modal heading | `aria-labelledby="modalTitle"` |
| `aria-describedby` | ✅ Yes | Points to description | `aria-describedby="modalDesc"` |

### Required CSS Classes

| Class | Purpose | Applied To |
|-------|---------|-----------|
| `modal` | Modal container | Outer div |
| `modal-content` | Content container | Inner div |
| `auth-modal-heading` | Heading styling | h2 |
| `auth-modal-text` | Text styling | p |
| `auth-modal-intro` | Intro paragraph | p |
| `auth-modal-actions` | Button container | div |
| `auth-modal-btn` | Button styling | button |

### Complete Example: Login Modal

```html
<!-- Login Modal - Standard Implementation -->
<div id="loginModal"
     class="modal"
     role="dialog"
     aria-labelledby="loginModalTitle"
     aria-describedby="loginModalDesc"
     aria-modal="true">

  <div class="modal-content auth-modal-content">
    <!-- Heading with icon -->
    <h2 id="loginModalTitle" class="auth-modal-heading">
      <i class="fas fa-sign-in-alt" aria-hidden="true"></i>
      Login Required
    </h2>

    <!-- Description -->
    <p id="loginModalDesc" class="auth-modal-text">
      Please log in to access your account and manage your profile.
    </p>

    <!-- Additional context (optional) -->
    <p class="auth-modal-intro">
      Log in with Google or Facebook to continue.
    </p>

    <!-- Action buttons -->
    <div class="auth-modal-actions">
      <button id="btn-google-login"
              class="btn-standard btn-google auth-modal-btn"
              aria-label="Sign in with Google">
        <i class="fab fa-google" aria-hidden="true"></i>
        Sign in with Google
      </button>

      <button id="btn-facebook-login"
              class="btn-standard btn-facebook auth-modal-btn"
              aria-label="Sign in with Facebook">
        <i class="fab fa-facebook" aria-hidden="true"></i>
        Sign in with Facebook
      </button>

      <button id="btn-cancel-login"
              class="btn-standard btn-secondary auth-modal-btn"
              aria-label="Cancel login and close modal">
        Cancel
      </button>
    </div>
  </div>
</div>
```

---

## JavaScript API

### Current Implementation (login-modal.js)

#### Opening a Modal

```javascript
/**
 * Opens the login modal
 * - Saves focus reference
 * - Shows modal
 * - Focuses first element
 * - Sets up click-outside handler
 */
function openLoginModal() {
  const modal = document.getElementById('loginModal');
  if (!modal) {
    console.error('Login modal not found');
    return;
  }

  // Save last focused element for restoration
  lastFocusedElement = document.activeElement;

  // Show modal
  modal.style.display = 'flex'; // TODO: Change to classList.add('show')

  // Focus first button
  setTimeout(() => {
    const firstButton = modal.querySelector('button');
    if (firstButton) {
      firstButton.focus();
    }
  }, 100);
}
```

**Current Issues**:
- ❌ Uses `style.display` instead of CSS class
- ❌ No focus trap
- ❌ No scroll lock
- ❌ No aria-hidden management

#### Closing a Modal

```javascript
/**
 * Closes the login modal
 * - Hides modal
 * - Restores focus (TODO)
 * - Unlocks scroll (TODO)
 */
function closeLoginModal() {
  const modal = document.getElementById('loginModal');
  if (modal) {
    modal.style.display = 'none'; // TODO: Change to classList.remove('show')
  }

  // TODO: Restore focus
  // TODO: Unlock scroll
  // TODO: Remove aria-hidden from background
}
```

**Current Issues**:
- ❌ Uses `style.display` instead of CSS class
- ❌ No focus restoration
- ❌ No scroll unlock
- ❌ No aria-hidden cleanup

#### Event Listeners

```javascript
/**
 * Initialize modal event listeners
 * Called on DOMContentLoaded
 */
function initializeLoginModal() {
  const googleBtn = document.getElementById('btn-google-login');
  const facebookBtn = document.getElementById('btn-facebook-login');
  const cancelBtn = document.getElementById('btn-cancel-login');

  if (googleBtn) {
    googleBtn.addEventListener('click', loginWithGoogle);
  }

  if (facebookBtn) {
    facebookBtn.addEventListener('click', loginWithFacebook);
  }

  if (cancelBtn) {
    cancelBtn.addEventListener('click', closeLoginModal);
  }

  // Click outside to close
  const modal = document.getElementById('loginModal');
  if (modal) {
    modal.addEventListener('click', function(event) {
      if (event.target === modal) {
        closeLoginModal();
      }
    });
  }

  console.log('[Login Modal] Initialized');
}

// Auto-initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeLoginModal);
} else {
  initializeLoginModal();
}
```

---

## Future Implementation (Recommended)

### Improved Modal Controller

```javascript
/**
 * Modal Controller - Future Implementation
 * Handles all modal behavior consistently
 */
class ModalController {
  constructor(modalId) {
    this.modalId = modalId;
    this.modal = document.getElementById(modalId);
    this.lastFocusedElement = null;
    this.focusTrapHandler = null;

    if (!this.modal) {
      console.error(`Modal not found: ${modalId}`);
      return;
    }

    this.init();
  }

  init() {
    // Add event listeners
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal && this.shouldCloseOnBackdrop()) {
        this.close();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen() && this.shouldCloseOnEscape()) {
        this.close();
      }
    });
  }

  open(options = {}) {
    // Save focus
    this.lastFocusedElement = document.activeElement;

    // Lock scroll
    if (options.lockScroll !== false) {
      document.body.style.overflow = 'hidden';
    }

    // Hide background from screen readers
    const pageWrapper = document.querySelector('#page-wrapper');
    if (pageWrapper) {
      pageWrapper.setAttribute('aria-hidden', 'true');
    }

    // Show modal (using CSS class)
    this.modal.classList.add('show');

    // Focus first element
    if (options.focusFirst !== false) {
      this.focusFirstElement();
    }

    // Enable focus trap
    this.enableFocusTrap();

    return true;
  }

  close(options = {}) {
    // Hide modal
    this.modal.classList.remove('show');

    // Unlock scroll
    document.body.style.overflow = '';

    // Restore background accessibility
    const pageWrapper = document.querySelector('#page-wrapper');
    if (pageWrapper) {
      pageWrapper.setAttribute('aria-hidden', 'false');
    }

    // Disable focus trap
    this.disableFocusTrap();

    // Restore focus
    if (options.restoreFocus !== false && this.lastFocusedElement) {
      if (document.contains(this.lastFocusedElement)) {
        this.lastFocusedElement.focus();
      }
    }

    this.lastFocusedElement = null;

    return true;
  }

  isOpen() {
    return this.modal.classList.contains('show');
  }

  focusFirstElement() {
    const focusableElements = this.getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  }

  getFocusableElements() {
    return Array.from(this.modal.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    ));
  }

  enableFocusTrap() {
    this.focusTrapHandler = (e) => {
      if (e.key !== 'Tab') return;

      const focusableElements = this.getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    this.modal.addEventListener('keydown', this.focusTrapHandler);
  }

  disableFocusTrap() {
    if (this.focusTrapHandler) {
      this.modal.removeEventListener('keydown', this.focusTrapHandler);
      this.focusTrapHandler = null;
    }
  }

  shouldCloseOnEscape() {
    // Override for TOS modal
    return this.modalId !== 'tosModal';
  }

  shouldCloseOnBackdrop() {
    // Override for TOS modal
    return this.modalId !== 'tosModal';
  }
}

// Usage:
const loginModal = new ModalController('loginModal');

// Open modal
document.getElementById('login-btn').addEventListener('click', () => {
  loginModal.open();
});

// Action buttons can close modal
document.getElementById('btn-cancel-login').addEventListener('click', () => {
  loginModal.close();
});
```

---

## CSS Guidelines

### Required Stylesheet

**File**: `styles/modal-standard.css`

All modals MUST load this stylesheet:

```html
<link rel="stylesheet" href="styles/modal-standard.css" />
```

### CSS Structure

```css
/* Modal overlay (backdrop) */
.modal {
  display: none; /* Hidden by default */
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  z-index: var(--z-modal-overlay, 5000);
  overflow: auto;
}

/* Show state */
.modal.show {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Modal content container */
.modal-content {
  background: #1a1a1a;
  border: 3px solid #ffee00;
  border-radius: 8px;
  padding: 2em;
  text-align: center;
  margin: 5% auto;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideDown 0.3s ease;
  box-shadow: 0 10px 40px rgba(255, 238, 0, 0.4);
  z-index: var(--z-modal-content, 5001);
}

/* Animation */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Respect reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  .modal-content {
    animation: none;
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    padding: 1.5em;
    margin: 10% auto;
  }
}
```

### Z-Index Scale (Required)

**File**: `styles/z-index-scale.css` (create if not exists)

```css
:root {
  --z-base: 1;
  --z-dropdown: 1000;
  --z-sticky: 2000;
  --z-floating-controls: 3000;
  --z-video-ad: 4000;
  --z-modal-overlay: 5000;
  --z-modal-content: 5001;
  --z-toast: 6000;
}
```

### ❌ DO NOT Use Inline Styles

**Bad**:
```html
<!-- DON'T DO THIS -->
<button style="width: 280px;">Sign in</button>
<div style="display: flex; flex-direction: column;">...</div>
<h2 style="color: #ffffff; margin-bottom: 1.5em;">Title</h2>
```

**Good**:
```html
<!-- DO THIS -->
<button class="auth-modal-btn btn-standard btn-google">Sign in</button>
<div class="auth-modal-actions">...</div>
<h2 class="auth-modal-heading">Title</h2>
```

---

## Common Patterns

### Pattern 1: Simple Confirmation Modal

```html
<div id="confirmModal" class="modal" role="dialog" aria-modal="true"
     aria-labelledby="confirmTitle" aria-describedby="confirmDesc">
  <div class="modal-content">
    <h2 id="confirmTitle">Confirm Action</h2>
    <p id="confirmDesc">Are you sure you want to proceed?</p>
    <div class="auth-modal-actions">
      <button id="btn-confirm" class="btn-standard btn-primary">Yes</button>
      <button id="btn-cancel-confirm" class="btn-standard btn-secondary">No</button>
    </div>
  </div>
</div>
```

```javascript
const confirmModal = new ModalController('confirmModal');

document.getElementById('btn-confirm').addEventListener('click', () => {
  // Perform action
  confirmModal.close();
});

document.getElementById('btn-cancel-confirm').addEventListener('click', () => {
  confirmModal.close();
});
```

### Pattern 2: Form Modal

```html
<div id="formModal" class="modal" role="dialog" aria-modal="true"
     aria-labelledby="formTitle" aria-describedby="formDesc">
  <div class="modal-content">
    <h2 id="formTitle">Submit Form</h2>
    <p id="formDesc">Please fill out the form below.</p>

    <form id="modalForm">
      <input type="text" name="name" placeholder="Your name" required />
      <textarea name="message" placeholder="Message" required></textarea>

      <div class="auth-modal-actions">
        <button type="submit" class="btn-standard btn-primary">Submit</button>
        <button type="button" id="btn-cancel-form" class="btn-standard btn-secondary">Cancel</button>
      </div>
    </form>
  </div>
</div>
```

```javascript
const formModal = new ModalController('formModal');

document.getElementById('modalForm').addEventListener('submit', (e) => {
  e.preventDefault();
  // Handle form submission
  formModal.close();
});

document.getElementById('btn-cancel-form').addEventListener('click', () => {
  formModal.close();
});
```

### Pattern 3: Info/Alert Modal

```html
<div id="infoModal" class="modal" role="dialog" aria-modal="true"
     aria-labelledby="infoTitle" aria-describedby="infoDesc">
  <div class="modal-content">
    <h2 id="infoTitle">
      <i class="fas fa-info-circle" aria-hidden="true"></i>
      Information
    </h2>
    <p id="infoDesc">This is important information for you to know.</p>

    <div class="auth-modal-actions">
      <button id="btn-ok-info" class="btn-standard btn-primary">OK</button>
    </div>
  </div>
</div>
```

```javascript
const infoModal = new ModalController('infoModal');

document.getElementById('btn-ok-info').addEventListener('click', () => {
  infoModal.close();
});

// Auto-close on any key press (optional)
infoModal.modal.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === 'Escape') {
    infoModal.close();
  }
});
```

---

## Accessibility Checklist

Before deploying any modal, verify:

### Structure
- [ ] `role="dialog"` attribute present
- [ ] `aria-modal="true"` attribute present
- [ ] `aria-labelledby` points to heading ID
- [ ] `aria-describedby` points to description ID
- [ ] Heading has unique ID
- [ ] Description has unique ID

### Buttons
- [ ] All buttons have accessible names
- [ ] Icon-only buttons have `aria-label`
- [ ] Decorative icons have `aria-hidden="true"`
- [ ] Buttons use semantic `<button>` element

### Behavior
- [ ] Focus trap works (Tab/Shift+Tab)
- [ ] Focus restoration works
- [ ] Escape key closes modal (unless exception)
- [ ] Click outside closes modal (unless exception)
- [ ] Background scroll locked when open

### Visual
- [ ] Text contrast meets WCAG AA (4.5:1)
- [ ] Focus indicators visible
- [ ] Modal visible above all content
- [ ] Responsive on mobile
- [ ] Animation respects `prefers-reduced-motion`

### Testing
- [ ] Keyboard-only navigation works
- [ ] Screen reader announces properly (NVDA/JAWS)
- [ ] No console errors
- [ ] Works without JavaScript (progressive enhancement)

---

## Migration Plan

### Phase 1: Fix Current Implementation

**Files to Update**: `scripts/login-modal.js`

1. **Replace display style with CSS class**:
   ```javascript
   // BEFORE
   modal.style.display = 'flex';
   modal.style.display = 'none';

   // AFTER
   modal.classList.add('show');
   modal.classList.remove('show');
   ```

2. **Add focus trap**:
   - Copy `enableFocusTrap()` from future implementation
   - Call on modal open

3. **Add focus restoration**:
   - Save `lastFocusedElement` on open
   - Restore on close

4. **Add scroll lock**:
   ```javascript
   // On open
   document.body.style.overflow = 'hidden';

   // On close
   document.body.style.overflow = '';
   ```

5. **Add aria-hidden management**:
   ```javascript
   // On open
   document.querySelector('#page-wrapper').setAttribute('aria-hidden', 'true');

   // On close
   document.querySelector('#page-wrapper').setAttribute('aria-hidden', 'false');
   ```

### Phase 2: Create Modal Controller

**New File**: `scripts/modal-controller.js`

- Copy future implementation code
- Test thoroughly
- Document usage

### Phase 3: Migrate All Modals

**Files**: All 9 HTML files + any future modals

- Replace inline modal code with ModalController
- Remove duplicate JavaScript
- Verify all functionality
- Update documentation

---

## Common Mistakes

### ❌ Mistake 1: Using Inline Display Styles

```javascript
// BAD
modal.style.display = 'block';
modal.style.display = 'flex';

if (modal.style.display === 'block') { ... } // Breaks with 'flex'
```

**Fix**: Use CSS class
```javascript
// GOOD
modal.classList.add('show');
modal.classList.remove('show');

if (modal.classList.contains('show')) { ... }
```

### ❌ Mistake 2: No Focus Trap

User tabs out of modal to background page.

**Fix**: Implement focus trap (see future implementation)

### ❌ Mistake 3: No Focus Restoration

User loses keyboard position after closing modal.

**Fix**: Save and restore `document.activeElement`

### ❌ Mistake 4: Inconsistent Z-Index

Modal appears behind other elements.

**Fix**: Use CSS variables for z-index scale

### ❌ Mistake 5: No ARIA Attributes

Screen readers don't announce modal properly.

**Fix**: Add `role`, `aria-modal`, `aria-labelledby`, `aria-describedby`

---

## Troubleshooting

### Modal Won't Open

**Symptoms**: Click button, nothing happens

**Checks**:
1. Is modal HTML present in page? (`document.getElementById('modalId')`)
2. Is `initializeLoginModal()` called?
3. Are event listeners attached? (Check console log)
4. Any JavaScript errors? (Check console)

**Fix**:
```javascript
// Add debugging
function openLoginModal() {
  console.log('openLoginModal called');
  const modal = document.getElementById('loginModal');
  console.log('Modal element:', modal);
  if (!modal) {
    console.error('Modal not found!');
    return;
  }
  // ... rest of function
}
```

### Escape Key Doesn't Close Modal

**Symptoms**: Pressing Escape does nothing

**Checks**:
1. Is modal opened with `display: 'flex'` but Escape handler checks for `'block'`?
2. Is Escape handler attached?
3. Is this TOS modal (intentionally doesn't close on Escape)?

**Fix**: Change to CSS class-based state (see Phase 1)

### Focus Doesn't Restore

**Symptoms**: After closing modal, focus goes to body

**Checks**:
1. Is `lastFocusedElement` being saved?
2. Is trigger element still in DOM?

**Fix**: Save and restore focus (see Phase 1)

### Modal Appears Behind Other Elements

**Symptoms**: Modal obscured by video ad, floating controls, etc.

**Checks**:
1. What is modal's z-index?
2. What are z-indexes of other elements?

**Fix**: Use CSS variable z-index scale

---

## Related Documentation

- `docs/modal-behavior.md` - Behavior specification
- `docs/MODAL_COMPREHENSIVE_AUDIT_20251029.md` - Audit findings
- `docs/MODAL_TESTING_CHECKLIST.md` - Testing procedures
- [ARIA Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [MDN: Dialog Role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/dialog_role)

---

**Document Status**: 📘 **READY FOR USE**

**Next Steps**:
1. Review guidelines
2. Begin Phase 1 migration (fix current implementation)
3. Test thoroughly
4. Proceed to Phase 2 (create ModalController)
5. Complete Phase 3 (migrate all modals)

---

**End of Modal Component Guidelines**
