const fs = require('fs');
const path = require('path');

console.log('🎨 Adding Profile Hub HTML and JavaScript...\n');

// Files to update
const files = [
  'frontend/news.html',
  'frontend/faq.html',
  'frontend/guide.html',
  'frontend/share-experience.html',
  'frontend/index.html',
  'frontend/tos.html',
  'frontend/about.html'
];

// JavaScript for profile hub
const profileHubJS = `    <!-- Profile Hub JavaScript -->
    <script>
      // Update profile hub based on login status
      function updateProfileHub() {
        const loginBtn = document.getElementById('login-status-btn');
        if (!loginBtn) return;

        // Check if user is logged in using authManager
        if (window.authManager) {
          window.authManager.checkAuthStatus().then(status => {
            if (status.isAuthenticated && status.user) {
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
            // Update UI after logout
            setTimeout(() => {
              updateProfileHub();
            }, 500);
          }
        } else {
          // User is not logged in - show login modal
          const loginModal = document.getElementById('loginModal');
          if (loginModal) {
            loginModal.style.display = 'block';
          }
        }
      }

      // Update profile hub on page load
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
          updateProfileHub();
        }, 1000); // Wait for authManager to initialize
      });

      // Listen for auth state changes
      window.addEventListener('authStateChanged', () => {
        updateProfileHub();
      });
    </script>

    <!-- Profile Hub Container - Positioned Above Support Container -->
    <div class="profile-hub-container">
      <!-- Login Status Button (Left) -->
      <button id="login-status-btn" class="login-status-btn" onclick="handleLoginStatus()">
        Login
      </button>
      <!-- Profile Icon with Yellow Glow (Right) -->
      <div class="profile-icon" title="User Profile">
        <i class="fa fa-user"></i>
      </div>
    </div>

`;

let successCount = 0;

files.forEach(file => {
  const filePath = path.join(__dirname, file);

  try {
    let content = fs.readFileSync(filePath, 'utf8');

    // Find the support container comment and add profile hub before it
    const patterns = [
      /(\s*)<!-- Support Container - Vertical Layout with Report Button Above Gear Icon -->/,
      /(\s*)<!-- Support Container - Horizontal Layout with Report Button Beside Gear Icon -->/,
      /(\s*)<!-- Support Container.*?-->/
    ];

    let found = false;
    for (const pattern of patterns) {
      if (pattern.test(content)) {
        content = content.replace(pattern, profileHubJS + '$1<!-- Support Container - Horizontal Layout with Report Button Beside Gear Icon -->');
        found = true;
        console.log(`✅ Added Profile Hub to ${file}`);
        successCount++;
        break;
      }
    }

    if (!found) {
      console.log(`⚠️  Could not find Support Container comment in ${file}`);
    } else {
      fs.writeFileSync(filePath, content, 'utf8');
    }

  } catch (error) {
    console.error(`❌ Error processing ${file}:`, error.message);
  }
});

console.log(`\n🎉 Complete!`);
console.log(`✅ Successfully updated: ${successCount} files`);
