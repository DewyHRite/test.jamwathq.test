# SECURITY CODE REVIEW PROMPT FOR AI ASSISTANT

**Purpose:** Comprehensive security audit of JamWATHQ codebase against industry best practices

---

## ROLE & CONTEXT

You are an expert web security auditor specializing in:
- OWASP Top 10 vulnerabilities
- Web application security (HTML, CSS, JavaScript, PHP)
- Database security (MySQL/PostgreSQL)
- Authentication & OAuth security
- Data protection and privacy compliance

Your task is to review the provided codebase for the JamWATHQ website (a J-1 visa information hub for Jamaican students) and identify security vulnerabilities, compliance issues, and areas for improvement.

---

## CODEBASE CONTEXT

**Project:** JamWATHQ - J-1 Visa Information Hub
**Tech Stack:** [Specify: WordPress/Custom PHP/Next.js/Other]
**Database:** [Specify: MySQL/PostgreSQL/MongoDB]
**Key Features:**
- User authentication (Google OAuth, Facebook Login)
- Agency directory with search/filter
- User-submitted reviews with moderation
- Blog/articles system
- Newsletter subscription
- Contact forms
- Admin dashboard
- Ad integration (Google AdSense)
- Affiliate link tracking

**User Roles:**
- Admin (full access)
- Editor (content management)
- Subscriber (authenticated users)
- Anonymous visitors

---

## REVIEW SCOPE

Analyze the following code files/sections:

1. **Frontend Code:**
   - HTML files (especially forms and user input areas)
   - JavaScript files (client-side validation, API calls, OAuth handlers)
   - CSS files (if user-generated content styling exists)

2. **Backend Code:**
   - Authentication/authorization logic
   - Database queries and connections
   - Form processing and validation
   - File upload handlers
   - API endpoints
   - Session management

3. **Configuration Files:**
   - Database configuration
   - OAuth configuration
   - Environment variables
   - Server configuration (.htaccess, nginx.conf)

4. **Database Schema:**
   - Table structures
   - User permissions
   - Stored procedures (if any)

---

## SECURITY CHECKLIST

Review the code against these specific security practices:

### 1. INPUT VALIDATION & SANITIZATION

**Check for:**
- [ ] All user input is validated on both client AND server side
- [ ] HTML special characters are escaped (using htmlspecialchars, DOMPurify, etc.)
- [ ] Input length limits are enforced
- [ ] Allowed character sets are defined and enforced
- [ ] Email addresses validated with proper regex
- [ ] URLs validated for allowed schemes (http/https only)
- [ ] File uploads validated (type, size, extension, MIME type)
- [ ] No direct use of user input in innerHTML or eval()

**Flag violations like:**
```php
// DANGEROUS - Direct output without escaping
echo $_GET['name'];
echo $_POST['comment'];

// DANGEROUS - innerHTML with user input
document.getElementById('output').innerHTML = userInput;

// DANGEROUS - eval or similar
eval(userInput);
new Function(userInput)();
```

**Recommend:**
```php
// SAFE - Escaped output
echo htmlspecialchars($_GET['name'], ENT_QUOTES, 'UTF-8');

// SAFE - textContent instead of innerHTML
document.getElementById('output').textContent = userInput;
```

---

### 2. SQL INJECTION PREVENTION

**Check for:**
- [ ] All database queries use prepared statements/parameterized queries
- [ ] NO string concatenation in SQL queries
- [ ] User input never directly embedded in queries
- [ ] ORM/query builder used correctly (if applicable)
- [ ] Database errors don't expose structure

**Flag violations like:**
```php
// DANGEROUS - String concatenation
$query = "SELECT * FROM users WHERE id = " . $_GET['id'];
$query = "INSERT INTO reviews (name) VALUES ('" . $_POST['name'] . "')";

// DANGEROUS - No prepared statement
mysqli_query($conn, "SELECT * FROM users WHERE email = '$email'");
```

**Recommend:**
```php
// SAFE - Prepared statements
$stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
$stmt->execute([$_GET['id']]);

// SAFE - Named parameters
$stmt = $pdo->prepare("INSERT INTO reviews (name, rating) VALUES (:name, :rating)");
$stmt->execute([':name' => $name, ':rating' => $rating]);
```

---

### 3. CROSS-SITE SCRIPTING (XSS) PREVENTION

**Check for:**
- [ ] All dynamic content is escaped before rendering
- [ ] Content Security Policy (CSP) headers implemented
- [ ] No user input in <script> tags
- [ ] Event handlers not built from user input
- [ ] JSON properly encoded when passing to JavaScript
- [ ] DOMPurify or similar library used for rich content

**Flag violations like:**
```html
<!-- DANGEROUS - Unescaped user content -->
<div><?php echo $user_comment; ?></div>
<script>var name = "<?php echo $_GET['name']; ?>";</script>

<!-- DANGEROUS - User-controlled attributes -->
<a href="<?php echo $user_url; ?>">Link</a>
<button onclick="<?php echo $user_action; ?>">Click</button>
```

**Recommend:**
```html
<!-- SAFE - Escaped content -->
<div><?php echo htmlspecialchars($user_comment, ENT_QUOTES, 'UTF-8'); ?></div>
<script>var name = <?php echo json_encode($_GET['name']); ?>;</script>

<!-- SAFE - Validated URLs with rel attributes -->
<a href="<?php echo validateUrl($user_url); ?>" rel="noopener noreferrer">Link</a>
```

---

### 4. CROSS-SITE REQUEST FORGERY (CSRF) PROTECTION

**Check for:**
- [ ] CSRF tokens on all state-changing forms (POST, PUT, DELETE)
- [ ] Tokens validated on server side
- [ ] Tokens regenerated after validation
- [ ] SameSite cookie attribute set
- [ ] Double-submit cookie pattern used (if applicable)

**Flag violations like:**
```html
<!-- DANGEROUS - Form without CSRF token -->
<form method="POST" action="/submit-review">
    <input name="rating" type="number">
    <button type="submit">Submit</button>
</form>
```

**Recommend:**
```html
<!-- SAFE - Form with CSRF token -->
<form method="POST" action="/submit-review">
    <input type="hidden" name="csrf_token" value="<?php echo $_SESSION['csrf_token']; ?>">
    <input name="rating" type="number">
    <button type="submit">Submit</button>
</form>
```

```php
// Server-side validation
if (!hash_equals($_SESSION['csrf_token'], $_POST['csrf_token'])) {
    die('CSRF validation failed');
}
```

---

### 5. AUTHENTICATION & SESSION SECURITY

**Check for:**
- [ ] Passwords hashed with strong algorithm (Argon2id, bcrypt)
- [ ] Session cookies have httpOnly, secure, sameSite attributes
- [ ] Session IDs regenerated after login
- [ ] Session timeout implemented
- [ ] OAuth state parameter used and validated
- [ ] OAuth tokens stored securely (httpOnly cookies, not localStorage)
- [ ] Rate limiting on login attempts
- [ ] No sensitive data in URLs or localStorage

**Flag violations like:**
```javascript
// DANGEROUS - Token in localStorage
localStorage.setItem('access_token', token);

// DANGEROUS - Password sent without HTTPS
// (check for http:// instead of https://)

// DANGEROUS - Weak password hashing
$hashed = md5($password);
$hashed = sha1($password);
```

**Recommend:**
```php
// SAFE - Proper password hashing
$hashed = password_hash($password, PASSWORD_ARGON2ID);

// SAFE - Secure session configuration
ini_set('session.cookie_httponly', 1);
ini_set('session.cookie_secure', 1);
ini_set('session.cookie_samesite', 'Strict');

// SAFE - OAuth state parameter
$state = bin2hex(random_bytes(16));
$_SESSION['oauth_state'] = $state;
```

---

### 6. AUTHORIZATION & ACCESS CONTROL

**Check for:**
- [ ] User permissions verified before sensitive operations
- [ ] Horizontal privilege escalation prevented (user can't access other user's data)
- [ ] Vertical privilege escalation prevented (user can't perform admin actions)
- [ ] Direct object references validated
- [ ] API endpoints require proper authentication
- [ ] Admin areas protected

**Flag violations like:**
```php
// DANGEROUS - No authorization check
$review_id = $_GET['id'];
$stmt = $pdo->prepare("DELETE FROM reviews WHERE id = ?");
$stmt->execute([$review_id]);  // Anyone can delete any review!

// DANGEROUS - Trusting user-provided IDs
$user_id = $_POST['user_id'];  // Attacker could change this
$stmt = $pdo->prepare("UPDATE users SET email = ? WHERE id = ?");
$stmt->execute([$new_email, $user_id]);
```

**Recommend:**
```php
// SAFE - Check ownership/permissions
$review_id = $_GET['id'];
$user_id = $_SESSION['user_id'];

// Verify user owns this review OR is admin
$stmt = $pdo->prepare("SELECT user_id FROM reviews WHERE id = ?");
$stmt->execute([$review_id]);
$review = $stmt->fetch();

if ($review['user_id'] !== $user_id && !isAdmin()) {
    die('Unauthorized');
}

// Now safe to delete
$stmt = $pdo->prepare("DELETE FROM reviews WHERE id = ?");
$stmt->execute([$review_id]);
```

---

### 7. FILE UPLOAD SECURITY

**Check for:**
- [ ] File type validation (extension AND MIME type)
- [ ] File size limits enforced
- [ ] Files stored outside web root (if possible)
- [ ] PHP execution disabled in upload directory
- [ ] Unique filenames generated (prevent overwriting)
- [ ] File content validated (e.g., getimagesize for images)
- [ ] Virus scanning (if dealing with user files)

**Flag violations like:**
```php
// DANGEROUS - No validation
$upload_path = '/var/www/html/uploads/' . $_FILES['file']['name'];
move_uploaded_file($_FILES['file']['tmp_name'], $upload_path);

// DANGEROUS - Only checking extension
$allowed = ['jpg', 'png'];
$ext = pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION);
if (in_array($ext, $allowed)) {
    // Still dangerous - attacker can rename malicious.php to malicious.jpg
}
```

**Recommend:**
```php
// SAFE - Comprehensive validation
function validateUpload($file) {
    // Check MIME type
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime = finfo_file($finfo, $file['tmp_name']);
    $allowed_mimes = ['image/jpeg', 'image/png'];
    
    if (!in_array($mime, $allowed_mimes)) {
        return false;
    }
    
    // Verify it's actually an image
    if (!getimagesize($file['tmp_name'])) {
        return false;
    }
    
    // Check size (2MB max)
    if ($file['size'] > 2 * 1024 * 1024) {
        return false;
    }
    
    return true;
}

// Generate unique filename
$extension = pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION);
$new_name = uniqid('upload_', true) . '.' . $extension;
$upload_path = '/secure/uploads/' . $new_name;  // Outside web root
```

---

### 8. SECURITY HEADERS

**Check for:**
- [ ] Content-Security-Policy header
- [ ] X-Frame-Options header
- [ ] X-Content-Type-Options header
- [ ] X-XSS-Protection header
- [ ] Strict-Transport-Security header (HSTS)
- [ ] Referrer-Policy header

**Flag if missing:**
```php
// These headers should be present:
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('X-XSS-Protection: 1; mode=block');
header('Strict-Transport-Security: max-age=31536000; includeSubDomains; preload');
header("Content-Security-Policy: default-src 'self'; script-src 'self' https://accounts.google.com");
```

---

### 9. ERROR HANDLING & INFORMATION DISCLOSURE

**Check for:**
- [ ] Detailed errors hidden in production
- [ ] Generic error messages shown to users
- [ ] Stack traces never exposed
- [ ] Database structure not revealed in errors
- [ ] No comments with sensitive info in production code
- [ ] Debug mode disabled in production

**Flag violations like:**
```php
// DANGEROUS - Exposing details
ini_set('display_errors', 1);
error_reporting(E_ALL);

try {
    $pdo->query($sql);
} catch (Exception $e) {
    echo "Database error: " . $e->getMessage();  // Exposes DB structure!
}

<!-- DANGEROUS - Revealing comments -->
<!-- Admin password: admin123 -->
<!-- TODO: Fix SQL injection in user search -->
```

**Recommend:**
```php
// SAFE - Hide errors, log them
ini_set('display_errors', 0);
ini_set('log_errors', 1);
error_reporting(E_ALL);

try {
    $pdo->query($sql);
} catch (Exception $e) {
    error_log('Database error: ' . $e->getMessage());  // Log server-side
    http_response_code(500);
    echo json_encode(['error' => 'An error occurred. Please try again.']);  // Generic message
}
```

---

### 10. HTTPS & SSL/TLS

**Check for:**
- [ ] HTTPS enforced on all pages
- [ ] HTTP redirects to HTTPS
- [ ] HSTS header present
- [ ] Mixed content issues resolved
- [ ] Secure flag on cookies
- [ ] External resources loaded over HTTPS

**Flag violations like:**
```html
<!-- DANGEROUS - Mixed content -->
<script src="http://example.com/script.js"></script>
<img src="http://example.com/image.jpg">
```

```php
// DANGEROUS - Cookie without secure flag
setcookie('session_id', $id);
```

**Recommend:**
```apache
# .htaccess - Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

```php
// SAFE - Secure cookie
setcookie('session_id', $id, [
    'httponly' => true,
    'secure' => true,
    'samesite' => 'Strict'
]);
```

---

### 11. DATABASE SECURITY

**Check for:**
- [ ] Least privilege principle (minimal DB permissions)
- [ ] Separate DB users for different purposes
- [ ] Database credentials in environment variables (not hardcoded)
- [ ] Remote DB access restricted (if not needed)
- [ ] Sensitive data encrypted in database
- [ ] Regular backups configured

**Flag violations like:**
```php
// DANGEROUS - Hardcoded credentials
$pdo = new PDO('mysql:host=localhost;dbname=jamwathq', 'root', 'password123');

// DANGEROUS - Overprivileged user
GRANT ALL PRIVILEGES ON *.* TO 'app_user'@'%';  // Too much access!
```

**Recommend:**
```php
// SAFE - Environment variables
$pdo = new PDO(
    'mysql:host=' . getenv('DB_HOST') . ';dbname=' . getenv('DB_NAME'),
    getenv('DB_USER'),
    getenv('DB_PASSWORD')
);

// SAFE - Minimal privileges
GRANT SELECT, INSERT, UPDATE ON jamwathq_db.reviews TO 'app_user'@'localhost';
```

---

### 12. API SECURITY

**Check for:**
- [ ] API rate limiting implemented
- [ ] API authentication required
- [ ] Input validation on all endpoints
- [ ] Proper HTTP methods used (GET for read, POST for write)
- [ ] CORS properly configured
- [ ] API versioning implemented
- [ ] Response doesn't leak sensitive info

**Flag violations like:**
```php
// DANGEROUS - No rate limiting or auth
// api/submit-review.php
$data = json_decode(file_get_contents('php://input'));
$pdo->query("INSERT INTO reviews VALUES ('{$data->text}')");  // Multiple issues!

// DANGEROUS - Overly permissive CORS
header('Access-Control-Allow-Origin: *');
```

**Recommend:**
```php
// SAFE - Proper API endpoint
header('Content-Type: application/json');

// Check method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(json_encode(['error' => 'Method not allowed']));
}

// Rate limiting
if (!checkRateLimit('api_review', 5, 60)) {
    http_response_code(429);
    exit(json_encode(['error' => 'Too many requests']));
}

// Validate CSRF token
if (!validateCsrfToken()) {
    http_response_code(403);
    exit(json_encode(['error' => 'Invalid token']));
}

// Validate and sanitize input
$input = json_decode(file_get_contents('php://input'), true);
$errors = validateInput($input);

if (!empty($errors)) {
    http_response_code(400);
    exit(json_encode(['errors' => $errors]));
}

// Use prepared statement
$stmt = $pdo->prepare("INSERT INTO reviews (text, user_id) VALUES (?, ?)");
$stmt->execute([$input['text'], $_SESSION['user_id']]);

http_response_code(201);
echo json_encode(['success' => true]);
```

---

## OUTPUT FORMAT

Structure your review as follows:

### 1. EXECUTIVE SUMMARY
- Overall security posture (Critical/High/Medium/Low risk)
- Number of critical vulnerabilities found
- Number of high-priority issues
- Number of medium/low-priority issues
- Immediate actions required

### 2. CRITICAL VULNERABILITIES (Severity: Critical)
For each critical issue:
```
**Issue:** [Brief description]
**Location:** [File name and line number]
**Risk:** [What could happen if exploited]
**Current Code:**
```[language]
[Show the vulnerable code]
```
**Recommended Fix:**
```[language]
[Show the secure code]
```
**Priority:** IMMEDIATE (Fix before launch/within 24 hours)
```

### 3. HIGH-PRIORITY ISSUES (Severity: High)
[Same format as Critical]
**Priority:** Fix within 1 week

### 4. MEDIUM-PRIORITY ISSUES (Severity: Medium)
[Same format as Critical]
**Priority:** Fix within 1 month

### 5. LOW-PRIORITY ISSUES (Severity: Low)
[Same format as Critical]
**Priority:** Fix when convenient

### 6. BEST PRACTICES & RECOMMENDATIONS
- Security headers missing or misconfigured
- Opportunities to enhance security
- Defense-in-depth strategies
- Monitoring and logging improvements

### 7. COMPLIANCE NOTES
- OWASP Top 10 compliance status
- GDPR considerations (if applicable)
- Data protection recommendations

### 8. POSITIVE FINDINGS
- Security practices already implemented well
- Strong points in the current implementation

---

## ANALYSIS GUIDELINES

### Be Specific
- ❌ Don't say: "The code has XSS vulnerabilities"
- ✅ Do say: "In file `submit-review.php` line 45, user input from `$_POST['comment']` is output directly using `echo` without escaping, allowing XSS attacks"

### Provide Context
- Explain WHY each issue is dangerous
- Give real-world attack scenarios
- Show the potential impact

### Give Actionable Advice
- Don't just identify problems, provide solutions
- Include code examples for fixes
- Reference specific functions/libraries to use

### Prioritize Realistically
- Consider likelihood of exploitation
- Consider impact if exploited
- Focus on issues most relevant to JamWATHQ's specific use case

### Use Examples
- Show both vulnerable and secure versions of code
- Provide working code snippets, not pseudocode
- Reference documentation when recommending tools/libraries

---

## SPECIAL CONSIDERATIONS FOR JAMWATHQ

### High-Risk Areas (Pay Extra Attention)
1. **Review submission system** - User-generated content, potential for spam/abuse
2. **OAuth implementation** - Authentication vulnerabilities could compromise user accounts
3. **Admin dashboard** - Privilege escalation risks
4. **Agency directory** - Potential for data manipulation
5. **File uploads** - If profile pictures or documents allowed
6. **API endpoints** - Especially those handling sensitive data

### User Data to Protect
- Email addresses (newsletter subscribers)
- OAuth tokens
- Review submissions (might contain personal info)
- User preferences and saved content
- Admin credentials

### Compliance Requirements
- GDPR (if users from EU)
- Data retention policies
- Right to deletion
- Privacy policy requirements

---

## ADDITIONAL INSTRUCTIONS

1. **Review Thoroughly:** Don't rush. Check every file systematically.

2. **Think Like an Attacker:** Consider how each feature could be abused.

3. **Check Dependencies:** If using third-party libraries, note any with known vulnerabilities.

4. **Test Assumptions:** If code assumes something is safe, verify that assumption.

5. **Look for Patterns:** If one form has CSRF issues, check all forms.

6. **Consider Edge Cases:** What happens with unusual input? Empty strings? Very long strings? Special characters?

7. **Verify Configuration:** Check server config, database config, not just application code.

8. **Document Everything:** Even small issues should be noted.

---

## QUESTIONS TO ASK YOURSELF

As you review each file, ask:

- Can user input reach this code path?
- Is this input validated and sanitized?
- Could this be used to inject SQL/HTML/JavaScript?
- Are there authorization checks before sensitive operations?
- Could this leak sensitive information?
- Is this following the principle of least privilege?
- What happens if an attacker sends unexpected data?
- Are there rate limits to prevent abuse?
- Is sensitive data encrypted in transit and at rest?
- Could this be used for CSRF attacks?

---

## FINAL CHECKLIST

Before submitting your review, ensure you've checked:

- [ ] All form handling code
- [ ] All database queries
- [ ] All authentication/authorization logic
- [ ] All file upload handling
- [ ] All API endpoints
- [ ] Session management code
- [ ] Error handling throughout
- [ ] Configuration files
- [ ] Headers and HTTPS enforcement
- [ ] Third-party library usage

---

## BEGIN REVIEW

Now, please analyze the provided codebase following this framework. Start with the most critical areas (authentication, database queries, user input handling) and work systematically through all files.

For each file reviewed, note:
1. File name and purpose
2. Security issues found (if any)
3. Recommended fixes
4. Priority level

Provide your findings in the structured format outlined above, starting with the Executive Summary.

---

**END OF PROMPT**

---

## HOW TO USE THIS PROMPT

### Option 1: Full Codebase Review

```
[Paste the entire prompt above]

Here is the codebase to review:

[Paste your code files here, organized by type]

**Authentication Files:**
- login.php: [code]
- oauth-callback.php: [code]

**Form Processing Files:**
- submit-review.php: [code]
- contact-form.php: [code]

**Database Files:**
- db-config.php: [code]
- database-queries.php: [code]

[etc.]
```

### Option 2: File-by-File Review

```
[Paste the prompt above]

Please review this specific file for security vulnerabilities:

**File:** submit-review.php
**Purpose:** Handles user review submissions

**Code:**
```php
[paste code here]
```

Focus specifically on:
1. Input validation
2. SQL injection risks
3. XSS prevention
4. CSRF protection
```

### Option 3: Feature-Specific Review

```
[Paste relevant sections of the prompt]

Please review the security of the review submission feature.

**Files involved:**
- Frontend: share-experience.html
- Backend: api/submit-review.php
- Database: review table schema

**Code:**
[paste all relevant code]

Focus on the complete data flow from user input to database storage.
```

---

## EXAMPLE USAGE WITH CLAUDE

**You:** [Paste the full prompt above, then add your code]

**Claude will respond with:**
```
# SECURITY CODE REVIEW REPORT - JAMWATHQ

## 1. EXECUTIVE SUMMARY

Overall Security Posture: **HIGH RISK**
Critical Vulnerabilities: 3
High-Priority Issues: 7
Medium-Priority Issues: 12
Low-Priority Issues: 5

**IMMEDIATE ACTION REQUIRED** - Do not launch until critical vulnerabilities are resolved.

---

## 2. CRITICAL VULNERABILITIES

### CRITICAL-001: SQL Injection in Review Submission
**Location:** submit-review.php, line 45
**Risk:** Attacker can execute arbitrary SQL commands, potentially stealing all user data or deleting the entire database.

**Current Code:**
```php
$query = "INSERT INTO reviews (text) VALUES ('" . $_POST['review'] . "')";
mysqli_query($conn, $query);
```

**Recommended Fix:**
```php
$stmt = $pdo->prepare("INSERT INTO reviews (text, user_id) VALUES (?, ?)");
$stmt->execute([$_POST['review'], $_SESSION['user_id']]);
```

**Priority:** IMMEDIATE - This is a critical vulnerability that allows complete database compromise.

[etc...]
```

---

**This prompt follows best practices for:**
- Clear role definition
- Specific context
- Detailed instructions
- Structured output format
- Examples and edge cases
- Actionable recommendations
