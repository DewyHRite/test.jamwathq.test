# Quick Start - MongoDB Atlas Setup (5 minutes)

Since you don't have MongoDB installed locally, the easiest way is to use MongoDB Atlas (free cloud database).

## Step 1: Create Free MongoDB Atlas Account

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up with Google/Email (free forever tier)
3. Choose "Free" plan (M0 Sandbox)
4. Select cloud provider (AWS recommended) and region closest to you
5. Name your cluster (e.g., "JamWatHQ") and click "Create"

## Step 2: Configure Database Access

1. In Atlas dashboard, click "Database Access" in left sidebar
2. Click "+ ADD NEW DATABASE USER"
   - Authentication Method: Password
   - Username: `jamwathq`
   - Password: Click "Autogenerate Secure Password" and copy it
   - Database User Privileges: "Read and write to any database"
3. Click "Add User"

## Step 3: Configure Network Access

1. Click "Network Access" in left sidebar
2. Click "+ ADD IP ADDRESS"
3. Click "ALLOW ACCESS FROM ANYWHERE" (for development)
   - In production, you'd whitelist specific IPs
4. Click "Confirm"

## Step 4: Get Connection String

1. Click "Database" in left sidebar
2. Click "Connect" button on your cluster
3. Choose "Connect your application"
4. Driver: Node.js, Version: 5.5 or later
5. Copy the connection string (looks like):
   ```
   mongodb+srv://jamwathq:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<password>` with the password you generated in Step 2

## Step 5: Update .env File

Open `.env` file and replace the MongoDB line:

```env
# Replace this line:
MONGODB_URI=mongodb://localhost:27017/jamwathq

# With your Atlas connection string:
MONGODB_URI=mongodb+srv://jamwathq:YOUR_PASSWORD_HERE@cluster0.xxxxx.mongodb.net/jamwathq?retryWrites=true&w=majority
```

**Important:** Make sure to add `/jamwathq` before the `?` in the connection string to specify the database name!

## Step 6: Restart Server

```bash
# The server should auto-restart if nodemon is running
# Or stop and restart manually:
npm run dev
```

You should now see:
```
✅ MongoDB Connected: cluster0-shard-00-00.xxxxx.mongodb.net
```

## Done! Test Your App

1. Open browser: http://localhost:3000/share-experience.html
2. You should see the authentication gate
3. MongoDB is now ready to store users and reviews!

---

## Alternative: Install MongoDB Locally (If You Prefer)

If you want to run MongoDB on your computer instead:

### Windows:
1. Download: https://www.mongodb.com/try/download/community
2. Install MongoDB Community Server
3. MongoDB runs as a service automatically
4. Keep `.env` as: `MONGODB_URI=mongodb://localhost:27017/jamwathq`
5. Restart server: `npm run dev`

### Verify MongoDB is Running:
```bash
# Check if MongoDB service is running (Windows)
sc query MongoDB

# Or test connection
mongosh
```

---

## Next: OAuth Setup

Once MongoDB is connected, you'll need to set up Google and Facebook OAuth:
- See `AUTHENTICATION_SETUP.md` for detailed OAuth setup instructions
- Or continue with placeholder credentials for now (auth buttons won't work until you configure OAuth)
