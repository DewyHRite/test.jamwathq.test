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

    // Google login button - Trigger OAuth flow
    const googleBtn = document.getElementById('btn-google-login');
    if (googleBtn) {
      googleBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('[Login Init] Google login clicked');
        if (window.authManager && typeof window.authManager.loginWithGoogle === 'function') {
          window.authManager.loginWithGoogle();
        } else {
          console.error('[Login Init] authManager not available');
          alert('Authentication system is not ready. Please refresh the page and try again.');
        }
      });
      console.log('[Login Init] Google login button listener attached');
    }

    // Facebook login button - Trigger OAuth flow
    const facebookBtn = document.getElementById('btn-facebook-login');
    if (facebookBtn) {
      facebookBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('[Login Init] Facebook login clicked');
        if (window.authManager && typeof window.authManager.loginWithFacebook === 'function') {
          window.authManager.loginWithFacebook();
        } else {
          console.error('[Login Init] authManager not available');
          alert('Authentication system is not ready. Please refresh the page and try again.');
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

    // Initialize authManager for persistent login state
    if (window.authManager && typeof window.authManager.init === 'function') {
      console.log('[Login Init] Initializing authManager...');
      window.authManager.init().then(status => {
        console.log('[Login Init] Auth status:', status);
      }).catch(err => {
        console.error('[Login Init] Error initializing authManager:', err);
      });
    } else {
      console.warn('[Login Init] authManager.init() not available');
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeLoginButtons);
  } else {
    initializeLoginButtons();
  }

})();
