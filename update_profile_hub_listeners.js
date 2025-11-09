const fs = require('fs');
const path = require('path');

console.log('🔧 Updating Profile Hub Event Listeners...\n');

const files = [
  'frontend/agencies.html',
  'frontend/news.html',
  'frontend/faq.html',
  'frontend/guide.html',
  'frontend/share-experience.html',
  'frontend/index.html',
  'frontend/tos.html',
  'frontend/about.html'
];

// Improved profile hub JavaScript with proper event listeners
const improvedProfileHubJS = `    <!-- Profile Hub JavaScript -->
    <script>
      // Update profile hub based on login status
      function updateProfileHub() {
        const loginBtn = document.getElementById('login-status-btn');
        if (!loginBtn) return;

        // Check if user is logged in using authManager
        if (window.authManager) {
          window.authManager.checkAuthStatus().then(status => {
            if (status.authenticated && status.user) {
              // User is logged in - show logout button
              loginBtn.textContent = 'Logout';
              loginBtn.classList.add('logged-in');
              loginBtn.title = \`Logged in as \${status.user.firstName || status.user.email}\`;
            } else {
              // User is not logged in - show login button
              loginBtn.textContent = 'Login';
              loginBtn.classList.remove('logged-in');
              loginBtn.title = 'Click to login';
            }
          }).catch(err => {
            console.error('Error checking auth status:', err);
            loginBtn.textContent = 'Login';
            loginBtn.classList.remove('logged-in');
          });
        } else {
          // authManager not available yet - show login
          loginBtn.textContent = 'Login';
          loginBtn.classList.remove('logged-in');
        }
      }

      // Handle login/logout button click
      function handleLoginStatus() {
        const loginBtn = document.getElementById('login-status-btn');
        if (!loginBtn) return;

        if (loginBtn.classList.contains('logged-in')) {
          // User is logged in - perform logout
          if (window.authManager) {
            window.authManager.logout();
          }
        } else {
          // User is not logged in - show login modal
          const loginModal = document.getElementById('loginModal');
          if (loginModal) {
            loginModal.style.display = 'block';
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
    </script>`;

let successCount = 0;

files.forEach(file => {
  try {
    let content = fs.readFileSync(file, 'utf8');

    // Find and replace the old profile hub JavaScript
    // Pattern 1: Match the entire profile hub script block
    const pattern1 = /<!-- Profile Hub JavaScript -->\s*<script>[\s\S]*?<\/script>/;

    if (pattern1.test(content)) {
      content = content.replace(pattern1, improvedProfileHubJS);
      fs.writeFileSync(file, content, 'utf8');
      console.log(`✅ Updated Profile Hub in ${file}`);
      successCount++;
    } else {
      console.log(`⚠️  Could not find profile hub JavaScript in ${file}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${file}:`, error.message);
  }
});

console.log(`\n🎉 Complete!`);
console.log(`✅ Successfully updated: ${successCount} files`);
