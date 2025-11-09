      // Update profile hub based on login status
      function updateProfileHub() {
        const profileBtn = document.getElementById('profile-hub-btn');
        if (!profileBtn) return;

        // Check if user is logged in using authManager
        if (window.authManager) {
          window.authManager.checkAuthStatus().then(status => {
            if (status.authenticated && status.user) {
              // User is logged in - show username and logout option
              const username = status.user.firstName || status.user.name || status.user.email.split('@')[0];
              profileBtn.innerHTML = `<span class="profile-username">${username}</span><span class="profile-logout">(Logout)</span>`;
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

      // Handle login/logout button click
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

      // Initialize profile hub on page load
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
          // Wait a bit for authManager to initialize
          setTimeout(updateProfileHub, 500);
        });
      } else {
        setTimeout(updateProfileHub, 500);
      }

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
