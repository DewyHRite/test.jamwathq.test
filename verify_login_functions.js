const fs = require('fs');

console.log('🔍 Verifying Login Function Implementations...\n');

const files = [
  'frontend/agencies.html',
  'frontend/share-experience.html',
  'frontend/news.html',
  'frontend/faq.html',
  'frontend/guide.html',
  'frontend/index.html',
  'frontend/tos.html',
  'frontend/about.html'
];

const results = [];

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');

  const hasLoginModal = content.includes('id="loginModal"');
  const hasLoginWithGoogle = /function\s+loginWithGoogle/.test(content);
  const hasInitiateGoogleLogin = /function\s+initiateGoogleLogin/.test(content);
  const hasLoginWithFacebook = /function\s+loginWithFacebook/.test(content);
  const hasInitiateFacebookLogin = /function\s+initiateFacebookLogin/.test(content);
  const hasCloseLoginModal = /function\s+closeLoginModal/.test(content);

  // Find button onclick handlers
  const googleButtonMatch = content.match(/onclick="(loginWithGoogle|initiateGoogleLogin)\(\)"/);
  const facebookButtonMatch = content.match(/onclick="(loginWithFacebook|initiateFacebookLogin)\(\)"/);

  const status = {
    file: file.replace('frontend/', ''),
    hasLoginModal,
    googleFunction: hasLoginWithGoogle ? 'loginWithGoogle' : (hasInitiateGoogleLogin ? 'initiateGoogleLogin' : 'NONE'),
    googleButton: googleButtonMatch ? googleButtonMatch[1] : 'NONE',
    facebookFunction: hasLoginWithFacebook ? 'loginWithFacebook' : (hasInitiateFacebookLogin ? 'initiateFacebookLogin' : 'NONE'),
    facebookButton: facebookButtonMatch ? facebookButtonMatch[1] : 'NONE',
    hasCloseModal: hasCloseLoginModal
  };

  // Check for mismatches
  status.googleMismatch = status.googleButton !== 'NONE' && status.googleFunction !== 'NONE' && status.googleButton !== status.googleFunction;
  status.facebookMismatch = status.facebookButton !== 'NONE' && status.facebookFunction !== 'NONE' && status.facebookButton !== status.facebookFunction;
  status.hasIssue = status.googleMismatch || status.facebookMismatch ||
                    (status.hasLoginModal && status.googleFunction === 'NONE') ||
                    (status.hasLoginModal && !status.hasCloseModal);

  results.push(status);
});

// Print results
console.log('📊 Login Function Status:\n');
console.log('File'.padEnd(30) + 'Modal  Google Fn'.padEnd(25) + 'FB Fn'.padEnd(25) + 'Close  Status');
console.log('='.repeat(110));

results.forEach(r => {
  const modalStr = r.hasLoginModal ? '✓' : '✗';
  const googleStr = `${r.googleFunction}`;
  const googleBtnStr = r.googleButton !== r.googleFunction ? `⚠️ btn:${r.googleButton}` : '';
  const fbStr = `${r.facebookFunction}`;
  const fbBtnStr = r.facebookButton !== r.facebookFunction ? `⚠️ btn:${r.facebookButton}` : '';
  const closeStr = r.hasCloseModal ? '✓' : '✗';
  const statusStr = r.hasIssue ? '❌ ISSUE' : '✅ OK';

  console.log(
    r.file.padEnd(30) +
    modalStr.padEnd(7) +
    (googleStr + ' ' + googleBtnStr).padEnd(25) +
    (fbStr + ' ' + fbBtnStr).padEnd(25) +
    closeStr.padEnd(7) +
    statusStr
  );
});

// Print issues
const issues = results.filter(r => r.hasIssue);
if (issues.length > 0) {
  console.log('\n⚠️  Issues Found:\n');
  issues.forEach(r => {
    console.log(`${r.file}:`);
    if (r.googleMismatch) {
      console.log(`  - Google button calls "${r.googleButton}()" but function is "${r.googleFunction}"`);
    }
    if (r.facebookMismatch) {
      console.log(`  - Facebook button calls "${r.facebookButton}()" but function is "${r.facebookFunction}"`);
    }
    if (r.hasLoginModal && r.googleFunction === 'NONE') {
      console.log(`  - Has login modal but no Google login function`);
    }
    if (r.hasLoginModal && !r.hasCloseModal) {
      console.log(`  - Has login modal but no closeLoginModal function`);
    }
  });
} else {
  console.log('\n✅ All pages have matching login functions!');
}
