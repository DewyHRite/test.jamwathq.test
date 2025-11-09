# Quick Start Guide - Review System

## 🚀 To Test the System

### 1. Start the Server
```bash
cd backend
npm start
```
Expected: Server starts on port 3000

### 2. Open Your Browser
```
http://localhost:3000/share-experience.html
```

### 3. Test the Flow
1. Click any state (e.g., "California")
2. Fill out the review form
3. Click "Submit Experience"
4. **Login modal appears** ✅
5. Click "Sign in with Google" or "Sign in with Facebook"
6. Complete OAuth login
7. **TOS modal appears** ✅
8. Check the "I agree..." checkbox
9. Click "Accept & Submit Experience"
10. **Success!** Review is saved ✅

---

## 🔍 Quick Verification

### Check if authentication works:
```bash
curl http://localhost:3000/auth/status
# Should return: { "authenticated": false }

# After logging in via browser:
curl http://localhost:3000/auth/status --cookie cookies.txt
# Should return: { "authenticated": true, "user": {...} }
```

### Check if review was saved:
```bash
mongosh jamwathq
db.reviews.find().sort({createdAt: -1}).limit(1).pretty()
```

Expected fields:
- `tosAccepted: true`
- `tosAcceptedAt: <Date>`
- `timesUsed: <Number>`
- `userId: <ObjectId>`

### Check scoreboard:
```bash
curl http://localhost:3000/api/reviews/stats
curl http://localhost:3000/api/reviews/analytics
```

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `frontend/share-experience.html` | Main review form page |
| `backend/routes/reviews.js` | API endpoints |
| `backend/models/Review.js` | Database schema |
| `TESTING_GUIDE.md` | Full test scenarios (13 tests) |
| `REVIEW_SYSTEM_SUMMARY.md` | Complete implementation details |
| `CHANGELOG_REVIEW_SYSTEM.md` | Version history + rollback |

---

## ⚠️ Common Issues

### "Login modal doesn't appear"
- Check browser console for errors
- Verify `isUserLoggedIn` variable
- Refresh page and try again

### "OAuth redirect fails"
- Check `.env` file has Google/Facebook credentials
- Verify callback URLs in OAuth console
- Check server logs for errors

### "Review not saving"
- Check authentication: `curl http://localhost:3000/auth/status`
- Check TOS acceptance in request payload
- Check MongoDB is running: `mongosh`

### "Scoreboard not updating"
- Hard refresh: Ctrl+Shift+R
- Check `/api/reviews/stats` endpoint
- Check browser console for fetch errors

---

## ✅ What Should Work

- ✅ Submit button triggers login modal (if not logged in)
- ✅ Login modal allows Google/Facebook OAuth
- ✅ TOS modal appears after login
- ✅ TOS checkbox must be checked to submit
- ✅ Review saves with `tosAccepted: true`
- ✅ Scoreboard displays visitor count and revisit metrics
- ✅ Direct API POST without auth → 401 error
- ✅ Direct API POST without TOS → 400 error

---

## 🎯 Next Steps

1. **Test thoroughly:** Follow [TESTING_GUIDE.md](TESTING_GUIDE.md)
2. **Apply to agencies page:** Copy the same workflow
3. **Monitor production:** Check logs and database regularly
4. **Optimize performance:** Add caching if needed

---

## 📞 Need Help?

1. Check console errors (F12)
2. Review `TESTING_GUIDE.md` for specific test cases
3. Check `REVIEW_SYSTEM_SUMMARY.md` for implementation details
4. Contact: jamwathq@outlook.com

---

**Quick Reference:**
- **Login endpoint:** `/auth/google`, `/auth/facebook`
- **Auth status:** `/auth/status`
- **Submit review:** `POST /api/reviews` (requires auth + TOS)
- **Get stats:** `/api/reviews/stats`
- **Get analytics:** `/api/reviews/analytics`

**Backup Location:** `backups/review-system-20251014_220121/`
