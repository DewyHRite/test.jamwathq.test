const fs = require('fs');
const path = require('path');

console.log('🔐 Adding Login Modal to Pages...\n');

const files = [
  'frontend/news.html',
  'frontend/faq.html',
  'frontend/guide.html',
  'frontend/index.html',
  'frontend/tos.html',
  'frontend/about.html'
];

// Login Modal HTML
const loginModalHTML = `
    <!-- Login Modal -->
    <div id="loginModal" class="modal" role="dialog" aria-labelledby="loginModalTitle" aria-describedby="loginModalDesc" aria-modal="true">
      <div class="modal-content auth-modal-content" style="max-width: 500px; background: #1a1a1a; border: 3px solid #ffee00; padding: 2em; text-align: center; border-radius: 8px;">
        <h2 id="loginModalTitle" style="color: #ffee00; margin-bottom: 1em;"><i class="fas fa-sign-in-alt" aria-hidden="true"></i> Login Required</h2>
        <p id="loginModalDesc" style="color: #ffffff; margin-bottom: 1em;">Please log in to access your account and manage your profile.</p>
        <p style="color: #ffffff; margin-bottom: 1.5em;">Log in with Google or Facebook to continue.</p>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 1em;">
          <button onclick="loginWithGoogle()" class="btn-standard btn-google" aria-label="Sign in with Google" style="width: 280px;">
            <i class="fab fa-google"></i> Sign in with Google
          </button>
          <button onclick="loginWithFacebook()" class="btn-standard btn-facebook" aria-label="Sign in with Facebook" style="width: 280px;">
            <i class="fab fa-facebook"></i> Sign in with Facebook
          </button>
          <button onclick="closeLoginModal()" class="btn-standard btn-secondary" aria-label="Cancel login and close modal" style="width: 280px;">Cancel</button>
        </div>
      </div>
    </div>
`;

// Login Modal CSS
const loginModalCSS = `
    <style>
      /* Login Modal Styles */
      .modal {
        display: none;
        position: fixed;
        z-index: 10001;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.8);
        overflow: auto;
        justify-content: center;
        align-items: center;
      }

      .modal-content {
        background-color: #1a1a1a;
        margin: auto;
        padding: 20px;
        border: 3px solid #ffee00;
        width: 90%;
        max-width: 500px;
        border-radius: 8px;
        position: relative;
        top: 50%;
        transform: translateY(-50%);
      }

      .btn-standard {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        padding: 12px 24px;
        border: none;
        border-radius: 6px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
        font-family: "Montserrat", Arial, sans-serif;
      }

      .btn-google {
        background: #ffffff;
        color: #000000;
        border: 2px solid #4285f4;
      }

      .btn-google:hover {
        background: #4285f4;
        color: #ffffff;
        transform: scale(1.05);
      }

      .btn-facebook {
        background: #1877f2;
        color: #ffffff;
        border: 2px solid #1877f2;
      }

      .btn-facebook:hover {
        background: #145dbf;
        transform: scale(1.05);
      }

      .btn-secondary {
        background: #333333;
        color: #ffee00;
        border: 2px solid #ffee00;
      }

      .btn-secondary:hover {
        background: #ffee00;
        color: #000000;
        transform: scale(1.05);
      }
    </style>
`;

// Login Modal JavaScript Functions
const loginModalJS = `
    <script>
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

      // Close login modal
      function closeLoginModal() {
        const modal = document.getElementById('loginModal');
        if (modal) {
          modal.style.display = 'none';
        }
      }

      // Close modal when clicking outside
      window.addEventListener('click', function(event) {
        const modal = document.getElementById('loginModal');
        if (event.target === modal) {
          closeLoginModal();
        }
      });
    </script>
`;

let successCount = 0;

files.forEach(file => {
  try {
    let content = fs.readFileSync(file, 'utf8');

    // Check if login modal already exists
    if (content.includes('id="loginModal"')) {
      console.log(`⏭️  Login modal already exists in ${file}`);
      return;
    }

    // Add CSS before </head>
    if (content.includes('</head>')) {
      content = content.replace('</head>', `${loginModalCSS}\n  </head>`);
    }

    // Add JavaScript before </body>
    if (content.includes('</body>')) {
      content = content.replace('</body>', `${loginModalJS}\n${loginModalHTML}\n  </body>`);
    }

    fs.writeFileSync(file, content, 'utf8');
    console.log(`✅ Added login modal to ${file}`);
    successCount++;
  } catch (error) {
    console.error(`❌ Error processing ${file}:`, error.message);
  }
});

console.log(`\n🎉 Complete!`);
console.log(`✅ Successfully updated: ${successCount} files`);
