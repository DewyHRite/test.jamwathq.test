const fs = require('fs');
const path = require('path');

console.log('🎨 Adding Profile Hub to all pages...\n');

// Files to update (excluding agencies.html which is already done)
const files = [
  'frontend/news.html',
  'frontend/faq.html',
  'frontend/guide.html',
  'frontend/share-experience.html',
  'frontend/index.html',
  'frontend/tos.html',
  'frontend/about.html'
];

// CSS to add (will be inserted after .support-container definition)
const profileHubCSS = `
      /* Profile Hub Container - Positioned Above Support Container */
      .profile-hub-container {
        position: fixed;
        bottom: 90px;
        right: 20px;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 15px;
        z-index: 1000;
      }

      /* Profile Icon - Matching Gear Icon Style with Yellow Glow */
      .profile-icon {
        width: 50px;
        height: 50px;
        background: #ffee00;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow:
          0 4px 12px rgba(255, 238, 0, 0.4),
          0 0 20px rgba(255, 238, 0, 0.6),
          0 0 40px rgba(255, 238, 0, 0.3);
        cursor: pointer;
        transition: all 0.3s ease;
        text-decoration: none !important;
        border: 2px solid #ffee00;
        position: relative;
      }

      .profile-icon:hover {
        background: #fff700;
        transform: scale(1.1);
        box-shadow:
          0 6px 20px rgba(255, 238, 0, 0.6),
          0 0 30px rgba(255, 238, 0, 0.8),
          0 0 60px rgba(255, 238, 0, 0.5);
      }

      .profile-icon i {
        font-size: 20px;
        color: #000000;
        transition: transform 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .profile-icon:hover i {
        color: #333333;
      }

      /* Login Status Button - Positioned Beside Profile Icon */
      .login-status-btn {
        background: #000000;
        color: #ffee00;
        border: 2px solid #ffee00;
        border-radius: 25px;
        padding: 12px 20px;
        font-size: 13px;
        font-weight: bold;
        font-family: "Montserrat", Arial, sans-serif;
        cursor: pointer;
        transition: all 0.3s ease;
        text-decoration: none !important;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(255, 238, 0, 0.2);
        letter-spacing: 1px;
        white-space: nowrap;
      }

      .login-status-btn:hover {
        background: #ffee00;
        color: #000000;
        border-color: #28a745;
        box-shadow: 0 6px 20px rgba(255, 238, 0, 0.5);
        transform: scale(1.05);
      }

      /* Logged-in state - green accent */
      .login-status-btn.logged-in {
        border-color: #28a745;
        box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
      }

      .login-status-btn.logged-in:hover {
        background: #28a745;
        color: #ffffff;
        border-color: #ffee00;
        box-shadow: 0 6px 20px rgba(40, 167, 69, 0.5);
      }
`;

// Responsive CSS to add to @media block
const profileHubResponsiveCSS = `
        .profile-hub-container {
          bottom: 75px;
          right: 15px;
          gap: 12px;
        }

        .profile-icon {
          width: 45px;
          height: 45px;
        }

        .profile-icon i {
          font-size: 18px;
        }

        .login-status-btn {
          padding: 10px 16px;
          font-size: 11px;
        }
`;

// JavaScript for profile hub
const profileHubJS = `
    <!-- Profile Hub JavaScript -->
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
`;

// HTML for profile hub
const profileHubHTML = `
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
let totalUpdates = 0;

files.forEach(file => {
  const filePath = path.join(__dirname, file);

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let updates = 0;

    // 1. Add Profile Hub CSS after support-container definition
    const supportContainerMatch = content.match(/(\/\* Fixed Support Container.*?\n\s+\.support-container\s*\{[\s\S]*?\n\s+\})/);
    if (supportContainerMatch) {
      content = content.replace(supportContainerMatch[0], profileHubCSS + '\n' + supportContainerMatch[0]);
      updates++;
      console.log(`✅ Added Profile Hub CSS to ${file}`);
    } else {
      console.log(`⚠️  Could not find support-container CSS in ${file}`);
    }

    // 2. Add responsive CSS to @media block
    const mediaQueryMatch = content.match(/(@media \(max-width: 768px\)\s*\{[\s\S]*?)(\.support-container\s*\{)/);
    if (mediaQueryMatch) {
      content = content.replace(mediaQueryMatch[0], mediaQueryMatch[1] + profileHubResponsiveCSS + '\n        ' + mediaQueryMatch[2]);
      updates++;
      console.log(`✅ Added Profile Hub responsive CSS to ${file}`);
    }

    // 3. Add JavaScript before closing </body> tag (before Support Container HTML)
    const supportContainerHTMLMatch = content.match(/(\s+<!-- Support Container - Horizontal Layout)/);
    if (supportContainerHTMLMatch) {
      content = content.replace(supportContainerHTMLMatch[0], profileHubJS + '\n' + supportContainerHTMLMatch[0]);
      updates++;
      console.log(`✅ Added Profile Hub JavaScript to ${file}`);
    }

    // 4. Add Profile Hub HTML before Support Container
    if (supportContainerHTMLMatch) {
      content = content.replace(supportContainerHTMLMatch[0], profileHubHTML + supportContainerHTMLMatch[0]);
      updates++;
      console.log(`✅ Added Profile Hub HTML to ${file}`);
    }

    if (updates > 0) {
      fs.writeFileSync(filePath, content, 'utf8');
      successCount++;
      totalUpdates += updates;
      console.log(`   Total changes in ${file}: ${updates}\n`);
    }

  } catch (error) {
    console.error(`❌ Error processing ${file}:`, error.message);
  }
});

console.log(`\n🎉 Complete!`);
console.log(`✅ Successfully updated: ${successCount} files`);
console.log(`📝 Total changes: ${totalUpdates}`);
console.log('\nProfile Hub Features:');
console.log('  • Yellow glowing profile icon (matching gear icon)');
console.log('  • Login/Logout button with status display');
console.log('  • Positioned directly above gear icon');
console.log('  • Green accent when user is logged in');
console.log('  • Fully responsive design');
