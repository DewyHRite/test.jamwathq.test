/**
 * Login Modal Functions
 * Extracted from inline scripts for security (CSP compliance)
 */

// Login with Google
function loginWithGoogle() {
  if (window.authManager) {
    window.authManager.loginWithGoogle();
  }
}

// Login with Facebook
function loginWithFacebook() {
  if (window.authManager) {
    window.authManager.loginWithFacebook();
  }
}

// Open login modal
function openLoginModal() {
  const modal = document.getElementById('loginModal');
  if (modal) {
    modal.style.display = 'flex';
    // Focus first button for accessibility
    setTimeout(() => {
      const firstBtn = modal.querySelector('.btn-google, #btn-google-login');
      if (firstBtn) firstBtn.focus();
    }, 100);
  } else {
    console.error('Login modal element not found');
  }
}

// Close login modal
function closeLoginModal() {
  const modal = document.getElementById('loginModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

// Initialize modal event listeners
function initializeLoginModal() {
  // Attach button click handlers
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

  // Close modal when clicking outside
  window.addEventListener('click', function(event) {
    const modal = document.getElementById('loginModal');
    if (event.target === modal) {
      closeLoginModal();
    }
  });

  // Close modal with Escape key
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' || event.keyCode === 27) {
      const modal = document.getElementById('loginModal');
      if (modal && (modal.style.display === 'flex' || modal.style.display === 'block')) {
        closeLoginModal();
      }
    }
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeLoginModal);
} else {
  initializeLoginModal();
}
