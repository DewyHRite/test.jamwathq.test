# 🧪 Testing Guide - JamWatHQ Changes

## Files Modified Today (Oct 16, 2025)
- ✅ `frontend/agencies.html` - Updated at 16:00 (all toggleReviewSection buttons now pass event)
- ✅ `frontend/scripts/agencies.js` - Updated at 15:59 (added event.stopPropagation())
- ✅ `frontend/scripts/share-experience-page.js` - Updated at 15:20 (added usageFrequency)
- ✅ `frontend/scripts/tos-modal.js` - Updated at 15:19 (added decline button)

---

## 🔧 Step 1: Force Browser to Load New Files

### Option A: Hard Refresh (Try this first!)
1. Open your browser with JamWatHQ
2. Press **`Ctrl + Shift + Delete`**
3. Select **"Cached images and files"**
4. Click **"Clear data"**
5. **Close the browser completely** (don't just close the tab)
6. **Reopen the browser** and navigate to your site

### Option B: Incognito/Private Mode
1. Open a **new Incognito/Private window** (`Ctrl + Shift + N` in Chrome)
2. Navigate to `http://localhost:8000/agencies.html`
3. Test the "Leave a Review" button

### Option C: Disable Cache in DevTools
1. Press `F12` to open Developer Tools
2. Go to **Network** tab
3. Check ☑️ **"Disable cache"**
4. Keep DevTools open while testing
5. Press `Ctrl + Shift + R` to hard refresh

---

## ✅ Step 2: Verify JavaScript Files Loaded

Open browser console (`F12` → Console tab) and run:

```javascript
// Test 1: Check agencies.js loaded correctly
console.log("toggleReviewSection function:", typeof toggleReviewSection);
// Expected: "function"

// Test 2: Check if the function has event parameter (new version)
console.log("Function signature:", toggleReviewSection.toString().includes('event'));
// Expected: true

// Test 3: Check TOS modal loaded
console.log("TOS Modal:", window.JamWatHQ?.tosModal ? "✅ Loaded" : "❌ Not found");
// Expected: "✅ Loaded"

// Test 4: Check auth manager
console.log("Auth Manager:", window.authManager ? "✅ Loaded" : "❌ Not found");
// Expected: "✅ Loaded"

// Test 5: Check submitReviewGeneric is async
console.log("submitReviewGeneric is async:", submitReviewGeneric.constructor.name === 'AsyncFunction');
// Expected: true
```

**If any of these return `undefined` or `false`, the browser is still caching old files!**

---

## 🐛 Step 3: Test "Leave a Review" Button

### Test on Agencies Page:

1. **Navigate to:** `http://localhost:8000/agencies.html`

2. **First, expand a card:**
   - Click anywhere on an agency card
   - The card should expand to show full details

3. **Click "Leave a Review" button:**
   - Button should change to "Cancel"
   - Review form should appear below
   - Console should NOT show any errors

4. **If button doesn't work:**
   - Open console (`F12`)
   - Click the button again
   - Look for error messages
   - Share the error with me

---

## 🧪 Step 4: Test Review Submission

### Test Share Experience Page:

1. **Navigate to:** `http://localhost:8000/share-experience.html`

2. **Click on any state** (e.g., California)

3. **Fill in the form:**
   - Job Title: "Server"
   - Employer: "Test Hotel"
   - City: "Los Angeles"
   - Wages: "$15.00"
   - Hours per Week: "40"
   - Rating: Click 5 stars
   - **Usage Frequency:** Select "First time (1x)" ← **IMPORTANT!**
   - Experience: "This is a test review with more than 20 characters"

4. **Click "Submit Experience"**

5. **Expected Result:**
   - If NOT logged in: Should prompt "Please log in"
   - If logged in: Should submit successfully

### Test Agencies Page:

1. **Login first** (if not already logged in)

2. **Expand an agency card**

3. **Click "Leave a Review"**

4. **Fill in the form:**
   - Rate all 5 categories (1-5 stars each)
   - Comments: Type at least 20 characters
   - **Usage Frequency:** Select a value (1-5) ← **IMPORTANT!**

5. **Click "Submit Review"**

6. **Expected Result:**
   - Should validate all fields
   - Should check authentication
   - Should submit to backend API
   - Should close form on success
   - Should show success message

---

## 🎯 Step 5: Test TOS Modal Decline

1. **Clear localStorage:**
   ```javascript
   localStorage.clear();
   ```

2. **Refresh page** (`F5`)

3. **TOS modal should appear with 3 buttons:**
   - 🔴 **Decline** (red button)
   - 🟡 **Learn More** (yellow button)
   - 🟢 **Accept & Continue** (green button, disabled)

4. **Click "Decline" button**

5. **Expected Result:**
   - Confirmation dialog appears
   - If you confirm → Redirects to `https://www.google.com`

---

## 🔍 Troubleshooting

### Issue: Button still not working

**Check these in console:**
```javascript
// Does the function exist?
console.log(typeof toggleReviewSection);

// Check for error when clicking
document.querySelector('.btn.btn-primary[onclick*="toggleReviewSection"]').click();
```

**If you see errors, copy them and share with me!**

### Issue: "Cannot read property of undefined"

This means the browser is still loading old JavaScript. Solutions:
1. Close browser completely and reopen
2. Try Incognito mode
3. Clear all browser data (not just cache)

### Issue: Changes not visible

**Verify files are actually updated:**
```bash
cd "c:\Users\Dewy\OneDrive\Documents\JamWatHQ\Main\Code"
ls -lh frontend/scripts/agencies.js
# Should show time: 15:59 or later on Oct 16
```

**Check if server is running:**
- Is your backend server running?
- Are you accessing via `http://localhost:8000`?

---

## 📊 Expected Test Results

| Test | Expected Result | Status |
|------|----------------|--------|
| Hard refresh clears cache | No cached files | ⬜ |
| toggleReviewSection exists | "function" | ⬜ |
| Event parameter added | true | ⬜ |
| TOS modal loaded | "✅ Loaded" | ⬜ |
| "Leave a Review" button works | Form appears | ⬜ |
| Button changes to "Cancel" | Text changes | ⬜ |
| Form has usageFrequency field | Field exists | ⬜ |
| Share Experience submits | Success message | ⬜ |
| Agencies review submits | Success message | ⬜ |
| TOS decline redirects | Goes to Google | ⬜ |

---

## 🆘 If Nothing Works

1. **Stop the server** (if running)
2. **Clear browser cache completely**
3. **Restart the server:**
   ```bash
   cd "c:\Users\Dewy\OneDrive\Documents\JamWatHQ\Main\Code\backend"
   npm run dev
   ```
4. **Open Incognito window**
5. **Navigate to** `http://localhost:8000/agencies.html`
6. **Try again**

---

## 📝 Report Issues

If you still have problems, please share:

1. **Console errors:** (F12 → Console → screenshot or copy text)
2. **Which test failed:** (from the table above)
3. **Browser version:** (Chrome/Firefox/Edge + version number)
4. **Output of this command:**
   ```javascript
   console.log({
       toggleReviewSection: typeof toggleReviewSection,
       hasEvent: toggleReviewSection.toString().includes('event'),
       tosModal: !!window.JamWatHQ?.tosModal,
       authManager: !!window.authManager
   });
   ```

I'll help you debug further! 🚀
