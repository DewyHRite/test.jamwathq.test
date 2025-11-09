# Google OAuth 2.0 Setup Guide - Fix 400 Error
**Date:** October 14, 2025
**Issue:** "400. That's an error. The server cannot process the request because it is malformed."

---

## 🔍 Root Cause Analysis

### Why the 400 Error Occurs:
The Google OAuth 400 error happens because the `.env` file contains **placeholder credentials** instead of real Google OAuth credentials:

```env
GOOGLE_CLIENT_ID=your-google-client-id-here          # ❌ Placeholder
GOOGLE_CLIENT_SECRET=your-google-client-secret-here  # ❌ Placeholder
```

When the backend tries to initiate OAuth with these invalid credentials, Google rejects the request as malformed.

---

## ✅ Solution: Configure Real Google OAuth Credentials

### Step 1: Create Google Cloud Project

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com/

2. **Create a New Project (or select existing):**
   - Click "Select a project" dropdown (top left)
   - Click "NEW PROJECT"
   - Enter project name: `JamWatHQ-Dev` (or your preferred name)
   - Click "CREATE"

3. **Enable Google+ API:**
   - Go to: https://console.cloud.google.com/apis/library
   - Search for "Google+ API"
   - Click "Google+ API"
   - Click "ENABLE"

---

### Step 2: Configure OAuth Consent Screen

1. **Go to OAuth consent screen:**
   - Visit: https://console.cloud.google.com/apis/credentials/consent

2. **Select User Type:**
   - Choose "External" (for testing with any Google account)
   - Click "CREATE"

3. **Fill in App Information:**
   - **App name:** `JamWatHQ Review System`
   - **User support email:** `jamwathq@outlook.com` (or your email)
   - **App logo:** (Optional - can upload later)
   - **Application home page:** `http://localhost:3000`
   - **Application privacy policy link:** `http://localhost:3000/privacy` (optional for dev)
   - **Application terms of service link:** `http://localhost:3000/terms` (optional for dev)

4. **Developer contact information:**
   - **Email addresses:** `jamwathq@outlook.com`

5. **Click "SAVE AND CONTINUE"**

6. **Scopes (Step 2):**
   - Click "ADD OR REMOVE SCOPES"
   - Select the following scopes:
     - ✅ `.../auth/userinfo.email` - See your primary Google Account email address
     - ✅ `.../auth/userinfo.profile` - See your personal info, including any personal info you've made publicly available
   - Click "UPDATE"
   - Click "SAVE AND CONTINUE"

7. **Test users (Step 3):**
   - Click "ADD USERS"
   - Add your Google email address for testing
   - Click "ADD"
   - Click "SAVE AND CONTINUE"

8. **Summary (Step 4):**
   - Review the information
   - Click "BACK TO DASHBOARD"

---

### Step 3: Create OAuth 2.0 Credentials

1. **Go to Credentials:**
   - Visit: https://console.cloud.google.com/apis/credentials

2. **Create Credentials:**
   - Click "CREATE CREDENTIALS" button (top)
   - Select "OAuth client ID"

3. **Application type:**
   - Select "Web application"

4. **Name:**
   - Enter: `JamWatHQ Web Client`

5. **Authorized JavaScript origins:**
   - Click "ADD URI"
   - Add: `http://localhost:3000`
   - Click "ADD URI"
   - Add: `http://localhost:8000`
   - Click "ADD URI"
   - Add: `http://127.0.0.1:8000`

6. **Authorized redirect URIs:**
   - Click "ADD URI"
   - Add: `http://localhost:3000/auth/google/callback`
   - **Important:** This MUST match the `GOOGLE_CALLBACK_URL` in your `.env` file

7. **Click "CREATE"**

8. **Copy Credentials:**
   - A modal will appear with your credentials
   - **Copy the Client ID** (looks like: `123456789-abc123.apps.googleusercontent.com`)
   - **Copy the Client Secret** (looks like: `GOCSPX-abcd1234efgh5678`)
   - Click "OK"

---

### Step 4: Update Backend .env File

Open `backend/.env` and update the Google OAuth section:

```env
# Google OAuth 2.0 Credentials
GOOGLE_CLIENT_ID=123456789-abc123def456.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your_actual_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
```

**Replace:**
- `123456789-abc123def456.apps.googleusercontent.com` with your actual Client ID
- `GOCSPX-your_actual_client_secret_here` with your actual Client Secret

---

### Step 5: Restart Backend Server

```bash
cd backend
npm run dev
```

**Expected output:**
```
✅ Google OAuth strategy configured
✅ Facebook OAuth strategy configured

🚀 JamWatHQ Server Started!
```

If you see: `⚠️ Google OAuth not configured (missing credentials in .env)`, then the credentials weren't loaded correctly.

---

### Step 6: Test OAuth Flow

1. **Open browser:**
   ```
   http://127.0.0.1:8000/share-experience.html
   ```

2. **Click any state button**

3. **Click "Submit Experience"** (without filling form)

4. **Click "Sign in with Google"**

5. **Expected behavior:**
   - ✅ Redirects to Google login page
   - ✅ Shows consent screen: "JamWatHQ Review System wants to access your Google Account"
   - ✅ Lists requested permissions: email and profile
   - ✅ After clicking "Continue", redirects back to `http://localhost:3000/auth/google/callback`
   - ✅ User is logged in
   - ✅ Can submit review

6. **If you see 400 error:**
   - Check that Client ID and Secret are correctly copied
   - Check that redirect URI matches exactly: `http://localhost:3000/auth/google/callback`
   - Check that you added your email as a test user in OAuth consent screen

---

## 🔧 Troubleshooting

### Error: "400. That's an error. The server cannot process the request because it is malformed."

**Cause:** Invalid Client ID or Client Secret

**Fix:**
1. Double-check that you copied the full Client ID (including the `.apps.googleusercontent.com` part)
2. Double-check that you copied the full Client Secret (including the `GOCSPX-` prefix)
3. Ensure there are no extra spaces or quotes in the `.env` file
4. Restart the backend server after updating `.env`

---

### Error: "redirect_uri_mismatch"

**Cause:** The redirect URI in your app doesn't match what's registered in Google Console

**Fix:**
1. Go to: https://console.cloud.google.com/apis/credentials
2. Click on your OAuth 2.0 Client ID
3. Check "Authorized redirect URIs"
4. Ensure it includes: `http://localhost:3000/auth/google/callback`
5. If not, add it and click "SAVE"

**Important:** The redirect URI is case-sensitive and must match EXACTLY:
- ✅ `http://localhost:3000/auth/google/callback`
- ❌ `http://localhost:3000/auth/google/callback/` (extra slash)
- ❌ `http://127.0.0.1:3000/auth/google/callback` (different host)
- ❌ `https://localhost:3000/auth/google/callback` (https vs http)

---

### Error: "access_denied - This app is blocked"

**Cause:** App is not verified and user is not added as test user

**Fix:**
1. Go to: https://console.cloud.google.com/apis/credentials/consent
2. Click "ADD USERS" under "Test users"
3. Add your Google email address
4. Click "ADD"
5. Try logging in again

---

### Error: "Error: Missing required parameter: scope"

**Cause:** OAuth strategy not configured with proper scopes

**Fix:**
This is already configured correctly in `backend/config/passport.js`:
```javascript
scope: ['profile', 'email']  // Minimal scopes
```

No action needed unless you modified this file.

---

## 📋 Configuration Checklist

Before testing, ensure:

- [ ] Google Cloud project created
- [ ] OAuth consent screen configured
- [ ] Test users added (your Google email)
- [ ] OAuth 2.0 Client ID created
- [ ] Client ID copied to `backend/.env`
- [ ] Client Secret copied to `backend/.env`
- [ ] Redirect URI matches: `http://localhost:3000/auth/google/callback`
- [ ] Backend server restarted
- [ ] Backend shows: `✅ Google OAuth strategy configured`

---

## 🔒 Security Best Practices

### For Development:
- ✅ Use placeholder credentials in `.env.example`
- ✅ Add `.env` to `.gitignore` (already done)
- ✅ Never commit real credentials to Git
- ✅ Use "External" user type for OAuth consent (allows testing with any Google account)

### For Production:
- ✅ Update `GOOGLE_CALLBACK_URL` to production domain: `https://yourdomain.com/auth/google/callback`
- ✅ Update OAuth consent screen with production URLs
- ✅ Verify app with Google (required for >100 users)
- ✅ Use environment variables (not `.env` file) in production
- ✅ Enable HTTPS enforcement (`ALLOW_INSECURE_HTTP=false`)
- ✅ Update `CLIENT_URL` to production domain

---

## 📊 OAuth Flow Diagram

```
User clicks "Sign in with Google"
    ↓
Frontend redirects to: http://localhost:3000/auth/google
    ↓
Backend (Passport.js) generates OAuth request with:
    - client_id: YOUR_CLIENT_ID
    - redirect_uri: http://localhost:3000/auth/google/callback
    - response_type: code
    - scope: profile email
    - state: [random token for CSRF protection]
    ↓
Redirects to Google OAuth: https://accounts.google.com/o/oauth2/v2/auth?client_id=...
    ↓
User logs in with Google account
    ↓
User sees consent screen and clicks "Continue"
    ↓
Google redirects back to: http://localhost:3000/auth/google/callback?code=...
    ↓
Backend exchanges authorization code for access token
    ↓
Backend fetches user profile from Google
    ↓
Backend creates/updates user in MongoDB
    ↓
Backend creates session and redirects to frontend
    ↓
User is logged in ✅
```

---

## 🧪 Testing Without Real Credentials (Temporary Workaround)

If you want to test the UI without setting up Google OAuth:

1. **Comment out OAuth button functionality temporarily:**
   - This is NOT recommended for final testing
   - Only for UI/layout testing

2. **Mock the login:**
   - Manually set `isUserLoggedIn = true` in JavaScript console
   - This allows testing the review form without actual authentication

**Important:** This is only for UI testing. For production, you MUST set up real OAuth credentials.

---

## 📁 Related Files

| File | Purpose |
|------|---------|
| `backend/.env` | OAuth credentials configuration |
| `backend/config/passport.js` | Passport.js OAuth strategy setup |
| `backend/routes/auth.js` | OAuth route handlers |
| `frontend/share-experience.html` | Frontend OAuth button triggers |

---

## 🆘 Still Having Issues?

### Check Backend Logs:
```bash
cd backend
npm run dev
```

Look for:
- ✅ `✅ Google OAuth strategy configured` (good)
- ⚠️ `⚠️ Google OAuth not configured (missing credentials in .env)` (need to add credentials)

### Check Browser Console:
1. Open DevTools (F12)
2. Go to "Console" tab
3. Look for errors when clicking "Sign in with Google"

### Check Network Tab:
1. Open DevTools (F12)
2. Go to "Network" tab
3. Click "Sign in with Google"
4. Look for requests to `/auth/google`
5. Check the response status code

---

## 📞 Support Resources

- **Google OAuth Documentation:** https://developers.google.com/identity/protocols/oauth2
- **Passport.js Google Strategy:** http://www.passportjs.org/packages/passport-google-oauth20/
- **Google Cloud Console:** https://console.cloud.google.com/

---

**Guide Created By:** Claude (AI Assistant)
**Last Updated:** October 14, 2025
**Status:** OAuth credentials need to be configured to resolve 400 error
