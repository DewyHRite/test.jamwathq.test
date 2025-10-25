/**
 * Login Button Initialization
 * Centralized script to initialize login buttons across all pages
 * This avoids CSP violations from inline onclick handlers
 */

(function() {
  'use strict';


  // Initialize event listeners for login modal buttons
  function initializeLoginButtons() {
    console.log('[Login Init] Initializing login buttons...');

    // Profile hub button - Show "Under Development" popup
    const profileBtn = document.getElementById('profile-hub-btn');
    if (profileBtn) {
      profileBtn.addEventListener('click', function() {
        // REMOVED: Development modal - showAuthUnderDevelopmentPopup();
      });
      console.log('[Login Init] Profile hub button listener attached');
    }

    // Google login button - Show "Under Development" popup
    const googleBtn = document.getElementById('btn-google-login');
    if (googleBtn) {
      googleBtn.addEventListener('click', function() {
        // REMOVED: Development modal - showAuthUnderDevelopmentPopup();
      });
      console.log('[Login Init] Google login button listener attached');
    }

    // Facebook login button - Show "Under Development" popup
    const facebookBtn = document.getElementById('btn-facebook-login');
    if (facebookBtn) {
      facebookBtn.addEventListener('click', function() {
        // REMOVED: Development modal - showAuthUnderDevelopmentPopup();
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
