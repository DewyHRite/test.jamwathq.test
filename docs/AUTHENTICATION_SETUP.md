# JamWatHQ Authentication Setup Guide

This guide will walk you through setting up Google and Facebook authentication for the JamWatHQ review system.

## Overview

The authentication system allows users to:
- Sign in with Google or Facebook
- Submit reviews only when authenticated
- Track reviews with their Google/Facebook account
- Display only their first name publicly in reviews

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Google Cloud account
- Facebook Developer account

---

## Step 1: MongoDB Setup

### Option A: Local MongoDB

1. **Download and Install MongoDB**
   - Visit: https://www.mongodb.com/try/download/community
   - Download the Community Server for your OS
   - Install with default settings

2. **Start MongoDB**
   ```bash
   # Windows (if installed as service, it starts automatically)
   # Or manually:
   mongod

   # Mac
   brew services start mongodb-community

   # Linux
   sudo systemctl start mongod
   ```

3. **Update .env file**
   ```env
   MONGODB_URI=mongodb://localhost:27017/jamwathq
   ```

### Option B: MongoDB Atlas (Cloud - Recommended)

1. **Create Account**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Sign up for free tier

2. **Create Cluster**
   - Click "Build a Database" → "Free" tier
   - Choose cloud provider and region
   - Click "Create Cluster"

3. **Configure Access**
   - Database Access → Add New Database User
   - Choose password authentication
   - Remember username and password

   - Network Access → Add IP Address
   - Click "Allow Access from Anywhere" (for development)
   - In production, whitelist specific IPs

4. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

5. **Update .env file**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/jamwathq?retryWrites=true&w=majority
   ```

---

## Step 2: Google OAuth Setup

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create or Select Project**
   - Click project dropdown → "New Project"
   - Enter project name: "JamWatHQ" → Create

3. **Enable Google+ API**
   - Go to: APIs & Services → Library
   - Search for "Google+ API"
   - Click and Enable

4. **Create OAuth Credentials**
   - Go to: APIs & Services → Credentials
   - Click "Create Credentials" → "OAuth client ID"
   - Configure consent screen if prompted:
     - User Type: External → Create
     - App name: JamWatHQ
     - Support email: your email
     - Add scopes: email, profile
     - Save and Continue

5. **Configure OAuth Client**
   - Application type: **Web application**
   - Name: JamWatHQ Web Client

   - **Authorized JavaScript origins:**
     ```
     http://localhost:3000
     https://yourdomain.com (for production)
     ```

   - **Authorized redirect URIs:**
     ```
     http://localhost:3000/auth/google/callback
     https://yourdomain.com/auth/google/callback (for production)
     ```

   - Click "Create"

6. **Copy Credentials**
   - Copy the Client ID and Client Secret
   - Update .env file:
   ```env
   GOOGLE_CLIENT_ID=your-google-client-id-here.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-google-client-secret-here
   GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
   ```

---

## Step 3: Facebook OAuth Setup

1. **Go to Facebook Developers**
   - Visit: https://developers.facebook.com/apps/
   - Log in with your Facebook account

2. **Create New App**
   - Click "Create App"
   - Choose use case: **Consumer** → Next
   - App name: JamWatHQ
   - App contact email: your email
   - Click "Create App"

3. **Get App Credentials**
   - Go to Settings → Basic
   - Copy **App ID** and **App Secret**
   - Update .env file:
   ```env
   FACEBOOK_APP_ID=your-facebook-app-id-here
   FACEBOOK_APP_SECRET=your-facebook-app-secret-here
   FACEBOOK_CALLBACK_URL=http://localhost:3000/auth/facebook/callback
   ```

4. **Add Facebook Login**
   - In left sidebar, click "+ Add Product"
   - Find "Facebook Login" → Click "Set Up"
   - Choose "Web" platform

5. **Configure OAuth Redirect URIs**
   - Go to: Facebook Login → Settings
   - **Valid OAuth Redirect URIs:**
     ```
     http://localhost:3000/auth/facebook/callback
     https://yourdomain.com/auth/facebook/callback (for production)
     ```
   - **Allowed Domains for the JavaScript SDK:**
     ```
     localhost
     yourdomain.com (for production)
     ```
   - Save Changes

6. **Set App to Live Mode**
   - Go to Settings → Basic
   - At the top, toggle from "Development" to "Live"
   - This makes the app publicly available

---

## Step 4: Generate Session Secret

Generate a secure random string for session encryption:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and update .env:
```env
SESSION_SECRET=<paste-generated-secret-here>
```

---

## Step 5: Install Dependencies

```bash
cd "C:\Users\Dewy\OneDrive\Documents\JamWatHQ\Main\Experimenting - Optimizing for ads"
npm install
```

---

## Step 6: Start the Server

```bash
npm run dev
```

You should see:
```
🚀 JamWatHQ Server Started!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📡 Server: http://localhost:3000
🔐 Authentication: Google & Facebook OAuth enabled
✅ MongoDB Connected: ...
✅ Google OAuth strategy configured
✅ Facebook OAuth strategy configured
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Step 7: Test Authentication

1. **Open Browser**
   - Navigate to: http://localhost:3000/share-experience.html

2. **You Should See:**
   - Authentication gate with Google and Facebook buttons
   - "Sign In to Share Your Experience" message

3. **Test Google Login**
   - Click "Sign in with Google"
   - Select your Google account
   - Grant permissions (email, profile)
   - You should be redirected back with success message
   - Your profile picture and first name should appear

4. **Test Review Submission**
   - Click on any state
   - Fill out the review form
   - Submit
   - Check MongoDB to verify review was saved with userId

5. **Test Logout**
   - Click "Logout" button
   - You should see auth gate again

6. **Test Facebook Login**
   - Click "Sign in with Facebook"
   - Log in with Facebook credentials
   - Grant permissions
   - Verify profile appears correctly

---

## Troubleshooting

### MongoDB Connection Issues

**Error:** `MongoNetworkError: failed to connect to server`
- **Solution:** Make sure MongoDB is running locally or check MongoDB Atlas connection string

### Google OAuth Issues

**Error:** `redirect_uri_mismatch`
- **Solution:** Make sure the callback URL in Google Console exactly matches your .env file

**Error:** `access_denied`
- **Solution:** Configure OAuth consent screen and add test users in Google Console

### Facebook OAuth Issues

**Error:** `App Not Set Up`
- **Solution:** Make sure Facebook Login product is added to your app

**Error:** `URL Blocked`
- **Solution:** Add callback URL to "Valid OAuth Redirect URIs" in Facebook Login settings

### Session Issues

**Error:** Session not persisting across page reloads
- **Solution:** Check SESSION_SECRET is set in .env file
- Make sure MongoDB connection is working (sessions are stored in MongoDB)

---

## Production Deployment

When deploying to production:

1. **Update .env for production:**
   ```env
   NODE_ENV=production
   MONGODB_URI=<your-production-mongodb-uri>
   GOOGLE_CALLBACK_URL=https://yourdomain.com/auth/google/callback
   FACEBOOK_CALLBACK_URL=https://yourdomain.com/auth/facebook/callback
   CLIENT_URL=https://yourdomain.com
   SESSION_SECRET=<strong-random-secret>
   ```

2. **Update OAuth Consoles:**
   - Google Cloud Console: Add production URLs to Authorized origins and redirect URIs
   - Facebook Developer Console: Add production URLs to Valid OAuth Redirect URIs

3. **HTTPS Required:**
   - OAuth providers require HTTPS in production
   - Use services like Let's Encrypt for free SSL certificates

4. **Security Checklist:**
   - [ ] Use strong SESSION_SECRET
   - [ ] Enable HTTPS
   - [ ] Whitelist specific IPs in MongoDB Atlas
   - [ ] Review CORS settings
   - [ ] Enable rate limiting
   - [ ] Set secure cookies (automatic with HTTPS)

---

## API Endpoints

### Authentication
- `GET /auth/google` - Initiate Google OAuth
- `GET /auth/google/callback` - Google callback
- `GET /auth/facebook` - Initiate Facebook OAuth
- `GET /auth/facebook/callback` - Facebook callback
- `GET /auth/logout` - Logout
- `GET /auth/status` - Check auth status

### Reviews (Protected)
- `POST /api/reviews` - Submit review (requires auth)
- `GET /api/reviews` - Get all reviews
- `GET /api/reviews/stats` - Get state statistics
- `GET /api/reviews/my-reviews` - Get current user's reviews

---

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  authProvider: "google" | "facebook",
  providerId: String,
  email: String,
  firstName: String,
  profilePicture: String,
  createdAt: Date,
  lastLogin: Date
}
```

### Reviews Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  userFirstName: String,
  state: String,
  jobTitle: String,
  employer: String,
  city: String,
  wages: Number,
  hoursPerWeek: Number,
  rating: Number (1-5),
  experience: String,
  isApproved: Boolean,
  createdAt: Date
}
```

---

## Support

If you encounter issues:
1. Check the console for error messages
2. Verify all credentials in .env are correct
3. Ensure MongoDB is running
4. Check OAuth console settings match your configuration

For additional help, contact: jamwathq@outlook.com
