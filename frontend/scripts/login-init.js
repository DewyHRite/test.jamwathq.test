/**
 * Login Button Initialization
 * Centralized script to initialize login buttons across all pages
 * This avoids CSP violations from inline onclick handlers
 * See docs/index-fix.md for "Under Development" modal removal
 */

(function() {
  'use strict';

  // Initialize event listeners for login modal buttons
  function initializeLoginButtons() {
    console.log('[Login Init] Initializing login buttons...');

    // Profile hub button is handled by profile-hub.js
    // See docs/session-logout.md for logout flow fix
    // Previously, login-init.js attached a duplicate listener that always opened the modal,
    // conflicting with profile-hub.js which correctly handles login/logout toggle logic.
    // This duplicate listener caused the login modal to appear after logout.

    // Google login button - Call auth manager
    const googleBtn = document.getElementById('btn-google-login');
    if (googleBtn) {
      googleBtn.addEventListener('click', function() {
        if (window.authManager && typeof window.authManager.loginWithGoogle === 'function') {
          window.authManager.loginWithGoogle();
        } else if (typeof loginWithGoogle === 'function') {
          loginWithGoogle();
        } else {
          console.warn('[Login Init] Google login function not available');
        }
      });
      console.log('[Login Init] Google login button listener attached');
    }

    // Facebook login button - Call auth manager
    const facebookBtn = document.getElementById('btn-facebook-login');
    if (facebookBtn) {
      facebookBtn.addEventListener('click', function() {
        if (window.authManager && typeof window.authManager.loginWithFacebook === 'function') {
          window.authManager.loginWithFacebook();
        } else if (typeof loginWithFacebook === 'function') {
          loginWithFacebook();
        } else {
          console.warn('[Login Init] Facebook login function not available');
        }
      });
      console.log('[Login Init] Facebook login button listener attached');
    }

    // Cancel button
    const cancelBtn = document.getElementById('btn-cancel-login');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', function() {
        if (typeof closeLoginModal === 'function') {
          closeLoginModal();
        }
      });
      console.log('[Login Init] Cancel button listener attached');
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeLoginButtons);
  } else {
    initializeLoginButtons();
  }

})();
