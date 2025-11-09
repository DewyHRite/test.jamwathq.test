# How to Connect MongoDB Compass

MongoDB Compass is a visual GUI tool to explore and manage your MongoDB databases.

## Step 1: Install MongoDB Compass (if not already installed)

### Check if Compass is Installed:
MongoDB Compass is usually installed automatically when you install MongoDB Community Server.

**Find Compass:**
- Windows: Search "MongoDB Compass" in Start Menu
- Or check: `C:\Program Files\MongoDB\Tools\Compass\`

### If Not Installed:
1. Download from: https://www.mongodb.com/try/download/compass
2. Choose "Download Compass"
3. Install with default settings
4. Launch MongoDB Compass

## Step 2: Connect to Your Local Database

### Option A: Quick Connection (Easiest)

1. **Open MongoDB Compass**

2. **Connection String:**
   When Compass opens, you'll see a connection screen.

   In the connection string field, enter:
   ```
   mongodb://localhost:27017
   ```

3. **Click "Connect"**

4. **You should see:**
   - `admin` database
   - `config` database
   - `local` database
   - **`jamwathq`** database ← This is your JamWatHQ database!

### Option B: Advanced Connection

1. **New Connection**
2. Fill in these fields:
   - **Host:** localhost
   - **Port:** 27017
   - **Authentication:** None (for local development)
3. Click "Connect"

## Step 3: Explore Your JamWatHQ Database

1. **Click on `jamwathq` database** in the left sidebar

2. **You should see 3 collections:**
   - `users` - User accounts (Google/Facebook logins)
   - `reviews` - J-1 work experience reviews
   - `sessions` - User session data

3. **View Collection Data:**
   - Click on any collection name (e.g., `users`)
   - You'll see the documents (data) inside
   - Right now they should be empty (0 documents)

4. **View Indexes:**
   - Click "Indexes" tab in any collection
   - You'll see all the indexes we created for fast queries

## Step 4: Monitor Database Activity

### View Real-Time Data

Once your app is running and users start logging in:

1. **Users Collection:**
   - Click `users` collection
   - You'll see user accounts created when people log in
   - Each document shows: firstName, email, authProvider, profilePicture, etc.

2. **Reviews Collection:**
   - Click `reviews` collection
   - You'll see reviews submitted by users
   - Each document shows: state, rating, wages, experience, userFirstName, etc.

3. **Sessions Collection:**
   - Click `sessions` collection
   - Shows active user sessions
   - Automatically cleaned up when sessions expire

### Example User Document:
```json
{
  "_id": ObjectId("..."),
  "authProvider": "google",
  "providerId": "123456789",
  "email": "john@gmail.com",
  "firstName": "John",
  "profilePicture": "https://lh3.googleusercontent.com/...",
  "createdAt": ISODate("2025-10-12T04:00:00.000Z"),
  "lastLogin": ISODate("2025-10-12T05:00:00.000Z")
}
```

### Example Review Document:
```json
{
  "_id": ObjectId("..."),
  "userId": ObjectId("..."),
  "userFirstName": "John",
  "state": "California",
  "jobTitle": "Lifeguard",
  "employer": "Beach Resort",
  "city": "Los Angeles",
  "wages": 18.5,
  "hoursPerWeek": 40,
  "rating": 5,
  "experience": "Amazing experience! Great team and location.",
  "isApproved": true,
  "createdAt": ISODate("2025-10-12T05:30:00.000Z")
}
```

## Step 5: Useful Compass Features

### Search and Filter
- In any collection, use the filter bar to search:
  ```json
  { "state": "California" }
  ```
  or
  ```json
  { "rating": { "$gte": 4 } }
  ```

### Sort Documents
- Click column headers to sort
- Or use sort syntax: `{ "createdAt": -1 }` (newest first)

### Export Data
- Click "..." menu → "Export Collection"
- Choose JSON or CSV format

### Import Data
- Click "..." menu → "Import Data"
- Upload JSON or CSV files

## Step 6: Quick Troubleshooting

### "Unable to connect"
- **Make sure MongoDB is running:**
  ```bash
  sc query MongoDB
  ```
- **Restart MongoDB service if needed:**
  ```bash
  net stop MongoDB
  net start MongoDB
  ```

### "Authentication failed"
- Local MongoDB doesn't require authentication by default
- Use connection string: `mongodb://localhost:27017`
- No username/password needed for local development

### Can't find jamwathq database
- The database is created when first data is inserted
- Run the init script again:
  ```bash
  node init-database.js
  ```

## Alternative: mongosh (Command Line)

If you prefer command line over GUI:

```bash
# Connect to MongoDB
mongosh

# Switch to jamwathq database
use jamwathq

# Show collections
show collections

# Count users
db.users.countDocuments()

# Count reviews
db.reviews.countDocuments()

# View all users
db.users.find().pretty()

# View all reviews
db.reviews.find().pretty()

# View indexes
db.users.getIndexes()
db.reviews.getIndexes()

# Exit
exit
```

## Pro Tips

1. **Keep Compass Open While Developing**
   - See data update in real-time
   - Click refresh button to see new data
   - Monitor your collections as users interact with your app

2. **Use Schema Tab**
   - Compass analyzes your data structure
   - Shows field types and value distributions
   - Helpful for understanding your data

3. **Performance Tab**
   - See which queries are slow
   - Verify indexes are being used
   - Optimize database performance

4. **Aggregation Builder**
   - Build complex queries visually
   - Great for generating statistics
   - Export aggregation pipelines to code

---

## Connection String Saved for Reference:

**Local MongoDB:**
```
mongodb://localhost:27017
```

**Database Name:** jamwathq

**Collections:**
- users
- reviews
- sessions

---

Need help? The database is running and ready to explore!
