/**
 * JamWatHQ Share Experience - Profile Hub Update
 * Handles profile button state based on authentication
 *
 * HIGH-002 Security Fix: Extracted from inline script to enable strict CSP
 * XSS Fix: Replaced innerHTML with safe DOM methods on line 30
 *
 * Date: 2025-11-08
 * Author: Yuuji Itadori
 */

(function() {
  'use strict';

  /**
   * Update profile hub based on login status
   * HIGH-002 XSS FIX: Replaced innerHTML with safe DOM methods
   */
  function updateProfileHub() {
    const profileBtn = document.getElementById('profile-hub-btn');
    if (!profileBtn) return;

    // Check if user is logged in using authManager
    if (window.authManager) {
      window.authManager.checkAuthStatus().then(status => {
        if (status.authenticated && status.user) {
          // User is logged in - show username and logout option
          const username = status.user.firstName || status.user.name || status.user.email.split('@')[0];

          // XSS-SAFE: Use DOM methods instead of innerHTML
          profileBtn.textContent = ''; // Clear existing content

          const usernameSpan = document.createElement('span');
          usernameSpan.className = 'profile-username';
          usernameSpan.textContent = username; // Auto-escapes HTML

          const logoutSpan = document.createElement('span');
          logoutSpan.className = 'profile-logout';
          logoutSpan.textContent = '(Logout)'; // Safe: static text

          profileBtn.appendChild(usernameSpan);
          profileBtn.appendChild(logoutSpan);
          profileBtn.classList.add('logged-in');
          profileBtn.title = `Logged in as ${status.user.email}`;
        } else {
          // User is not logged in - show login button
          profileBtn.textContent = 'Login';
          profileBtn.classList.remove('logged-in');
          profileBtn.title = 'Click to login';
        }
      }).catch(err => {
        console.error('Error checking auth status:', err);
        profileBtn.textContent = 'Login';
        profileBtn.classList.remove('logged-in');
      });
    } else {
      // authManager not available yet - show login
      profileBtn.textContent = 'Login';
      profileBtn.classList.remove('logged-in');
    }
  }

  /**
   * Handle login/logout button click
   */
  function handleProfileHub() {
    const profileBtn = document.getElementById('profile-hub-btn');
    if (!profileBtn) return;

    if (profileBtn.classList.contains('logged-in')) {
      // User is logged in - perform logout
      if (window.authManager) {
        window.authManager.logout();
      }
    } else {
      // User is not logged in - show login modal
      const loginModal = document.getElementById('loginModal');
      if (loginModal) {
        loginModal.style.display = 'flex';
      }
    }
  }

  /**
   * Initialize profile hub on page load
   */
  function initProfileHub() {
    // Wait a bit for authManager to initialize
    setTimeout(updateProfileHub, 500);

    // Listen for auth state changes
    window.addEventListener('authStateChanged', function(event) {
      console.log('Auth state changed:', event.detail);
      updateProfileHub();
    });

    // Also update when page becomes visible (user returns to tab)
    document.addEventListener('visibilitychange', function() {
      if (!document.hidden) {
        updateProfileHub();
      }
    });
  }

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProfileHub);
  } else {
    initProfileHub();
  }

  // Expose handleProfileHub globally (used by event delegation)
  window.handleProfileHub = handleProfileHub;

})();
