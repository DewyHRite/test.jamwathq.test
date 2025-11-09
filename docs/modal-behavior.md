# Modal Behavior Specification

**Version**: 1.0
**Date**: October 29, 2025
**Status**: 📋 **SPECIFICATION** (Implementation Pending)

---

## Purpose

This document defines the expected behavior for all modal dialogs in the JamWatHQ application to ensure consistent user experience, accessibility compliance, and maintainable code.

**Scope**: All modal dialogs including:
- Login modal (`#loginModal`)
- Terms of Service modal (`#tosModal`)
- Future modals (review submission, profile, etc.)

---

## Core Principles

1. **Consistency**: All modals behave the same way unless explicitly documented as exceptions
2. **Accessibility**: All modals meet WCAG 2.1 Level AA standards
3. **Predictability**: Users can rely on consistent interaction patterns
4. **Progressive Enhancement**: Modals work without JavaScript (where possible)

---

## Modal Lifecycle

### 1. Opening a Modal

**Trigger Actions**:
- User clicks a button/link that opens a modal
- Programmatic call to `openModal(modalId)`
- Keyboard shortcut (if implemented)

**Opening Sequence**:
1. **Save Focus Reference**
   ```javascript
   lastFocusedElement = document.activeElement;
   ```

2. **Lock Background Scroll**
   ```javascript
   document.body.style.overflow = 'hidden';
   ```

3. **Hide Background from Screen Readers**
   ```javascript
   document.querySelector('#page-wrapper').setAttribute('aria-hidden', 'true');
   ```

4. **Show Modal**
   ```javascript
   modal.classList.add('show');
   // NOT: modal.style.display = 'block' or 'flex'
   ```

5. **Move Focus to Modal**
   ```javascript
   const firstFocusable = modal.querySelector(
     'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
   );
   firstFocusable.focus();
   ```

6. **Initialize Focus Trap**
   - Enable focus trapping within modal
   - Tab/Shift+Tab cycle through modal controls only

7. **Announce to Screen Readers** (Optional but Recommended)
   ```javascript
   // Use aria-live region or focus management announces modal
   ```

**Timing**:
- Opening animation: 0.3s (slide-down effect)
- Focus delay: Immediate (no setTimeout unless necessary for animation)

---

### 2. Modal Open State

**Visual Characteristics**:
- Backdrop overlay: `rgba(0,0,0,0.8)` with `z-index: var(--z-modal-overlay)`
- Modal content: Centered, `max-width: 500px`, `z-index: var(--z-modal-content)`
- Animation: Slide down from top
- Border: 3px solid yellow (#ffee00)
- Background: Dark (#1a1a1a)
- Box shadow: Glowing yellow effect

**Interaction Constraints**:
- Background page is not scrollable
- Background elements are not clickable
- Background elements are not focusable (focus trap active)
- Background content hidden from screen readers (`aria-hidden="true"`)

**Allowed Interactions**:
- Click buttons within modal
- Tab/Shift+Tab to navigate modal controls
- Escape key to close (see exceptions)
- Click backdrop to close (see exceptions)
- Type in input fields (if present)

---

### 3. Closing a Modal

**Trigger Actions**:
- User clicks Cancel/Close button
- User presses Escape key (default behavior)
- User clicks backdrop/overlay (default behavior)
- Successful form submission (e.g., login success)
- Programmatic call to `closeModal(modalId)`

**Closing Sequence**:
1. **Hide Modal**
   ```javascript
   modal.classList.remove('show');
   ```

2. **Unlock Background Scroll**
   ```javascript
   document.body.style.overflow = '';
   ```

3. **Restore Background Accessibility**
   ```javascript
   document.querySelector('#page-wrapper').setAttribute('aria-hidden', 'false');
   ```

4. **Restore Focus**
   ```javascript
   if (lastFocusedElement) {
     lastFocusedElement.focus();
   }
   ```

5. **Remove Focus Trap**
   - Disable focus trap event listeners

6. **Clean Up State**
   ```javascript
   lastFocusedElement = null;
   ```

**Timing**:
- Closing animation: 0.2s (fade out)
- Focus restoration: Immediate after animation

---

## Keyboard Interaction

### Required Keyboard Support

| Key | Behavior | Notes |
|-----|----------|-------|
| **Tab** | Move focus to next focusable element within modal | Wraps to first element after last |
| **Shift + Tab** | Move focus to previous focusable element | Wraps to last element before first |
| **Escape** | Close modal | See exceptions below |
| **Enter** | Activate focused button | Standard button behavior |
| **Space** | Activate focused button | Standard button behavior |

### Focus Trap Implementation

**Requirement**: Focus must not leave the modal while it is open.

**Implementation**:
```javascript
function trapFocus(modal) {
  const focusableElements = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  modal.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
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
    }

    if (e.key === 'Escape' && shouldCloseOnEscape(modal)) {
      e.preventDefault();
      closeModal(modal.id);
    }
  });
}
```

### Focus Restoration

**Requirement**: When modal closes, focus must return to the element that triggered the modal.

**Example**:
- User clicks "Login" button
- Login modal opens
- User presses Escape
- Focus returns to "Login" button (not lost to body)

---

## Mouse/Touch Interaction

### Click Target Behaviors

| Target | Behavior | Notes |
|--------|----------|-------|
| **Cancel button** | Close modal | Always closes, no confirmation |
| **Close button (×)** | Close modal | If present (optional) |
| **Backdrop/Overlay** | Close modal | Default behavior, see exceptions |
| **Modal content** | No action | Clicks on modal itself do nothing |
| **Action buttons** | Perform action | May close modal after action |

### Backdrop Click Behavior

**Default**: Clicking backdrop closes the modal

**Implementation**:
```javascript
modal.addEventListener('click', function(e) {
  if (e.target === modal) { // Clicked backdrop, not content
    closeModal(modal.id);
  }
});
```

**User Expectation**: Industry standard (used by Bootstrap, Material UI, etc.)

---

## Scroll Behavior

### Background Scroll Lock

**Requirement**: When modal is open, background page should not scroll.

**Implementation**:
```javascript
// On open
document.body.style.overflow = 'hidden';

// On close
document.body.style.overflow = '';
```

**Edge Case**: Preserve scroll position
```javascript
// Save scroll position on open
const scrollY = window.scrollY;

// Restore scroll position on close (if needed)
window.scrollTo(0, scrollY);
```

### Modal Content Scroll

**Behavior**: If modal content exceeds viewport height, modal content should scroll internally.

**Implementation**:
```css
.modal-content {
  max-height: 90vh;
  overflow-y: auto;
}
```

**User Experience**: Scrollbar appears inside modal, not on background page.

---

## Screen Reader Behavior

### Announcements

**On Modal Open**:
- Screen reader should announce: "Dialog. Login Required."
- Modal heading becomes screen reader focus

**Focus Management**:
- First focusable element receives focus
- Focus trap keeps screen reader within modal
- Background content hidden (`aria-hidden="true"`)

### ARIA Attributes Required

```html
<div id="loginModal"
     class="modal"
     role="dialog"
     aria-modal="true"
     aria-labelledby="loginModalTitle"
     aria-describedby="loginModalDesc">

  <div class="modal-content">
    <h2 id="loginModalTitle">Login Required</h2>
    <p id="loginModalDesc">Please log in to access your account.</p>

    <button id="btn-google-login" aria-label="Sign in with Google">
      <i class="fab fa-google" aria-hidden="true"></i>
      Sign in with Google
    </button>

    <button id="btn-cancel-login" aria-label="Cancel login and close modal">
      Cancel
    </button>
  </div>
</div>
```

### Screen Reader Testing Checklist

- [ ] Modal purpose announced when opened
- [ ] Heading text read correctly
- [ ] All buttons have accessible names
- [ ] Icons do not interfere (aria-hidden)
- [ ] Focus trapped within modal
- [ ] Background content not reachable
- [ ] Modal closes predictably
- [ ] Focus restoration announced

---

## Exception Cases

### Terms of Service Modal

**Special Behavior**: TOS modal does NOT close on backdrop click or Escape key.

**Rationale**: User must explicitly accept or decline terms.

**Dismissal Methods**:
- Click "Accept" button → Accept terms and close
- Click "Decline" button → Decline terms and close

**Implementation**:
```javascript
function shouldCloseOnEscape(modal) {
  // TOS modal requires explicit action
  if (modal.id === 'tosModal') {
    return false;
  }
  return true;
}

function shouldCloseOnBackdropClick(modal) {
  if (modal.id === 'tosModal') {
    return false;
  }
  return true;
}
```

**Documentation**: Clearly document this exception in TOS modal code comments.

### Confirmation Dialogs (Future)

If implementing confirmation dialogs (e.g., "Are you sure you want to delete?"):
- MAY disable backdrop click to close
- SHOULD allow Escape to close (as a "Cancel" action)
- MUST have explicit action buttons

---

## Error Handling

### Modal Fails to Open

**Scenario**: Modal element not found, JavaScript error, etc.

**Behavior**:
- Log error to console
- Do NOT block user
- Provide fallback (e.g., redirect to login page)

**Implementation**:
```javascript
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) {
    console.error(`Modal not found: ${modalId}`);
    // Fallback behavior
    return false;
  }
  // ... proceed with opening
  return true;
}
```

### Focus Restoration Fails

**Scenario**: Trigger element removed from DOM, no lastFocusedElement

**Behavior**:
- Focus moves to body or first focusable element on page
- Do NOT throw error

**Implementation**:
```javascript
function closeModal(modalId) {
  // ... close modal

  if (lastFocusedElement && document.contains(lastFocusedElement)) {
    lastFocusedElement.focus();
  } else {
    // Fallback: focus first heading or main content
    const fallback = document.querySelector('h1, main, #page-wrapper');
    if (fallback) fallback.focus();
  }
}
```

---

## Animation Specifications

### Opening Animation

**Name**: `slideDown`
**Duration**: 0.3s
**Easing**: ease
**Effect**: Modal slides down from slightly above final position

```css
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

.modal.show .modal-content {
  animation: slideDown 0.3s ease;
}
```

### Closing Animation (Optional)

**Name**: `fadeOut`
**Duration**: 0.2s
**Easing**: ease
**Effect**: Modal fades out

```css
@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.modal.closing .modal-content {
  animation: fadeOut 0.2s ease;
}
```

### Reduced Motion

**Requirement**: Respect user's `prefers-reduced-motion` setting

```css
@media (prefers-reduced-motion: reduce) {
  .modal.show .modal-content {
    animation: none;
  }
}
```

---

## Visual Specifications

### Z-Index Scale

```css
:root {
  --z-modal-overlay: 5000;
  --z-modal-content: 5001;
}
```

**Requirement**: Modal must appear above all other content including:
- Floating controls (z-index: 3000)
- Video ads (z-index: 4000)
- Sticky headers (z-index: 2000)

### Color Specifications

```css
.modal {
  /* Backdrop */
  background: rgba(0, 0, 0, 0.8);
}

.modal-content {
  /* Modal container */
  background: #1a1a1a;
  border: 3px solid #ffee00;
  box-shadow: 0 10px 40px rgba(255, 238, 0, 0.4);
}
```

### Size Specifications

```css
.modal-content {
  max-width: 500px;
  width: 90%; /* Responsive on small screens */
  max-height: 90vh;
  margin: 5% auto;
  padding: 2em;
}
```

---

## Implementation Checklist

### For Each New Modal:

- [ ] Add `role="dialog"` to modal container
- [ ] Add `aria-modal="true"`
- [ ] Add `aria-labelledby` pointing to heading
- [ ] Add `aria-describedby` pointing to description
- [ ] Ensure all buttons have accessible names
- [ ] Hide decorative icons with `aria-hidden="true"`
- [ ] Implement focus trap
- [ ] Implement focus restoration
- [ ] Lock background scroll on open
- [ ] Hide background with `aria-hidden` on open
- [ ] Add Escape key handler (unless exception)
- [ ] Add backdrop click handler (unless exception)
- [ ] Use CSS class state (`.show`) not inline styles
- [ ] Test with keyboard only
- [ ] Test with screen reader
- [ ] Test on mobile viewport
- [ ] Verify z-index stacking
- [ ] Check color contrast (WCAG AA)

---

## Testing Requirements

### Manual Testing (Required)

**Keyboard Navigation**:
- [ ] Tab moves forward through modal controls
- [ ] Shift+Tab moves backward
- [ ] Focus trapped within modal
- [ ] Escape closes modal (or doesn't, if exception)
- [ ] Enter activates buttons

**Screen Reader** (Test with NVDA or JAWS):
- [ ] Modal announced when opened
- [ ] Background hidden from navigation
- [ ] All controls have clear labels
- [ ] Focus restoration announced

**Visual**:
- [ ] Modal centered on screen
- [ ] Backdrop visible and consistent
- [ ] Animation smooth
- [ ] No layout shifts
- [ ] Responsive on mobile

### Automated Testing (Recommended)

**E2E Tests** (Playwright/Cypress):
```javascript
test('login modal opens and closes with keyboard', async () => {
  await page.click('#profile-hub-btn');
  await expect(page.locator('#loginModal')).toBeVisible();

  await page.keyboard.press('Tab');
  await expect(page.locator('#btn-google-login')).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(page.locator('#loginModal')).not.toBeVisible();
  await expect(page.locator('#profile-hub-btn')).toBeFocused();
});
```

**Accessibility Tests** (axe-core):
```javascript
test('login modal has no accessibility violations', async () => {
  await page.click('#profile-hub-btn');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
```

---

## Change Log

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2025-10-29 | Initial specification | Claude AI |

---

## Related Documentation

- `docs/MODAL_COMPREHENSIVE_AUDIT_20251029.md` - Audit findings
- `docs/modal-component-guidelines.md` - Implementation guide (to be created)
- `docs/MODAL_TESTING_CHECKLIST.md` - Testing procedures
- [ARIA Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Specification Status**: 📋 **APPROVED FOR IMPLEMENTATION**

**Next Steps**:
1. Review and approve specification
2. Implement Phase 1: Focus trap and restoration
3. Update existing modals to follow specification
4. Create automated tests
5. Conduct accessibility audit

---

**End of Modal Behavior Specification**
