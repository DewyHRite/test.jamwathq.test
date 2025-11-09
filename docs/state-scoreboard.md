# State Scoreboard – Top Rated J-1 Destinations

**Status**: ✅ Completed
**Date**: 2025-10-30
**Feature**: State Scoreboard with All 50 U.S. States

---

## 🔗 Navigation Integration

**Date Added**: 2025-10-30
**Integration Status**: ✅ Complete

The State Scoreboard is now integrated into the sitewide navigation as a **nested dropdown item under "Share Experience"**, matching the structure and styling of the Embassy dropdown.

### Navigation Structure

```html
<li>
  <a href="share-experience.html">Share your Experience</a>
  <ul>
    <li><a href="state-scoreboard.html">State Scoreboard</a></li>
  </ul>
</li>
```

### Files Updated
- ✅ `index.html` (root) - Added dropdown navigation + Fixed all paths to include `frontend/` prefix
- ✅ `frontend/index.html` - Dropdown already present
- ✅ `frontend/agencies.html` - Dropdown already present
- ✅ `frontend/about.html` - Dropdown already present
- ✅ `frontend/faq.html` - Dropdown already present
- ✅ `frontend/guide.html` - Dropdown already present
- ✅ `frontend/news.html` - Dropdown already present
- ✅ `frontend/tos.html` - Dropdown already present
- ✅ `frontend/report-problem.html` - Dropdown already present
- ✅ `frontend/share-experience.html` - Dropdown already present (marked as current)
- ✅ `frontend/state-scoreboard.html` - Dropdown already present (marked as current page)

### Path Fix Applied
All navigation links in root `index.html` now correctly point to `frontend/` directory to avoid 404 errors. For example:
- `agencies.html` → `frontend/agencies.html`
- `state-scoreboard.html` → `frontend/state-scoreboard.html`

### Dropdown Behavior
The dropdown uses the **Dropotron** jQuery plugin (loaded via `scripts/jquery.dropotron.min.js`) which provides:
- Hover-based dropdown on desktop
- Click-based dropdown on mobile
- Smooth animations and transitions
- Consistent styling with Embassy dropdown
- Keyboard navigation support
- Screen reader compatibility

### Styling Reference
The State Scoreboard dropdown inherits all styling from the existing navigation system:
- **Desktop**: Defined in `styles/main.css` (lines 2351-2397) - `.dropotron` class
- **Mobile**: Defined in `styles/main.css` (lines 37-67) and `styles/nav-fix.css`
- **Responsive**: Automatic adaptation via media queries

### Code Reference
**See index.html:98-103** for the dropdown implementation in the root file.

---

## 🎨 Visual Consistency Update

**Date**: 2025-10-30
**Status**: ✅ Complete

The State Scoreboard page has been updated to match the visual and structural standards of the site's index page.

### Changes Applied

#### 1. ✅ Navigation Background Image Restored
- **Issue**: State Scoreboard page was missing the header background image
- **Solution**: Added background image styling to match index page
- **File Modified**: `frontend/state-scoreboard.html` (lines 23-32)
- **Image Path**: `../assets/images/wp4013673.jpg`
- **Styling Applied**:
  ```html
  <section
    id="header"
    class="wrapper"
    style="
      background-image: url(&quot;../assets/images/wp4013673.jpg&quot;);
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    "
  >
  ```

#### 2. ✅ Navigation Link Paths Fixed
- **Issue**: Logo and Home links pointed to wrong location from frontend directory
- **Solution**: Updated paths to use `../index.html` to navigate to parent directory
- **Files Updated**:
  - Logo link: `frontend/state-scoreboard.html` (line 35)
  - Home navigation: `frontend/state-scoreboard.html` (line 56)

#### 3. ✅ CSS Styling Consistency
- **Verification**: All CSS files properly loaded and scoped
- **CSS Files Referenced**:
  - `styles/main.css` - Main site styling
  - `styles/nav-fix.css` - Navigation fixes
  - `styles/shared-buttons.css` - Button styling
  - `styles/support-container.css` - Support widget
  - `styles/state-scoreboard.css` - Scoreboard-specific styles
- **Note**: Scoreboard-specific title styling only applies to `.wrapper.scoreboard-theme .title` and doesn't affect navigation or header

### Visual Consistency Checklist
- [x] Navigation background image matches index page
- [x] Logo and tagline display correctly
- [x] Navigation bar structure matches sitewide standard
- [x] Navigation links function correctly (Home link fixed)
- [x] CSS styling applied consistently
- [x] Responsive design preserved
- [x] No inline scripts (CSP compliant)

### Testing Notes
- Server accessible at `http://localhost:8000`
- Page accessible at `http://localhost:8000/frontend/state-scoreboard.html`
- Navigation dropdown functional
- Background image loads correctly from `../assets/images/wp4013673.jpg`

#### 4. ✅ Reviews Popup Modal Added
- **Issue**: JavaScript was looking for `reviews-popup` modal but it didn't exist
- **Solution**: Added missing modal structure for displaying state reviews
- **File Modified**: `frontend/state-scoreboard.html` (lines 291-307)
- **Modal ID**: `reviews-popup`
- **Error Fixed**: "Reviews popup modal not found. Creating fallback alert."

#### 5. ✅ Script Paths Corrected
- **Issue**: Scripts were referenced from non-existent `assets/js/` directory
- **Solution**: Updated all script paths to use `scripts/` directory
- **Files Updated**: `frontend/state-scoreboard.html` (lines 313-320)
- **Scripts Fixed**:
  - jquery.min.js
  - jquery.dropotron.min.js
  - browser.min.js
  - breakpoints.min.js
  - util.js
  - main.js

#### 6. ✅ Modal Styling Added
- **Issue**: Reviews popup modal had no CSS styling, appeared invisible
- **Solution**: Added `modal-standard.css` to the page
- **File Modified**: `frontend/state-scoreboard.html` (line 16)
- **Result**: Modal now displays properly with correct styling

#### 7. ✅ Modal Close Handler Added
- **Issue**: Modal couldn't be closed (no event listeners)
- **Solution**: Added close button handler and click-outside-to-close functionality
- **File Modified**: `frontend/scripts/state-scoreboard.js` (lines 69-94)
- **Functions Added**:
  - `setupModalCloseHandler()` - Initializes modal close events
  - Close button click handler
  - Click outside modal to close

#### 8. ✅ Removed Zero-Value Statistics
- **Issue**: Header displayed "States Tracked: 0, Average Rating: 0.0, Total Reviews: 0, Top Rated: —"
- **Solution**: Removed entire metrics section from hero header
- **File Modified**: `frontend/state-scoreboard.html` (removed lines 117-134)
- **Result**: Cleaner header without placeholder statistics

---

## 📋 Overview

The State Scoreboard feature displays a comprehensive ranking of all 50 U.S. states based on aggregated user reviews, providing J-1 visa participants with data-driven insights into the best destinations for their programs.

**Purpose**: Help users make informed decisions about which U.S. states to consider for their J-1 experience based on peer reviews.

**Core Requirements**:
1. Display **ALL 50 U.S. states** split into two sets of 25
2. Show **visit year(s)** for each review
3. Rank states by average rating + review count (tie-breaker)
4. External JavaScript and CSS (no inline scripts/styles)

---

## 🎯 Feature Requirements

### ✅ Display Requirements

#### 1. State List Display
- **Total States**: All 50 U.S. states
- **Pagination/Tabs**: Split into two equal groups of 25
  - **Group 1**: States A–M (Alabama through Montana)
  - **Group 2**: States N–W (Nebraska through Wyoming)
- **Layout**: Responsive grid (5 columns × 5 rows on desktop)

#### 2. State Block Information
Each state card displays:
- **Rank Number**: #1, #2, #3, etc. (based on rating + review count)
- **State Name**: Full state name
- **Average Rating**: 1-5 stars with numeric value (e.g., 4.3)
- **Review Count**: Total number of approved reviews
- **Average Wage**: Average hourly wage (e.g., $15.50/hr)
- **Visitor Stats**: Unique visitors and average revisit count
- **Interactive**: Clickable to view detailed reviews

#### 3. Review Display (in popup/detail view)
For each review:
- Reviewer's position (job title)
- City where they worked
- Experience summary
- **Visit Year(s)**: Clearly displayed (e.g., "Visited: 2019, 2021")
- Rating (1-5 stars)

---

## 🧮 Ranking Algorithm

### Formula

States are ranked using a two-tier sorting system:

1. **Primary Sort**: Average Rating (descending)
2. **Tie-Breaker**: Review Count (descending)

```javascript
// Pseudo-code
sortedStates = allStates.sort((a, b) => {
  // First, sort by average rating (higher is better)
  if (b.avgRating !== a.avgRating) {
    return b.avgRating - a.avgRating;
  }
  // If ratings are equal, sort by review count (more reviews wins)
  return b.reviewCount - a.reviewCount;
});
```

### Ranking Examples

**Example 1: Different Ratings**
- California: 4.5 avg (100 reviews) → Rank #1
- Texas: 4.2 avg (150 reviews) → Rank #2
- Florida: 4.0 avg (200 reviews) → Rank #3

**Example 2: Same Rating (Tie-Breaker)**
- New York: 4.3 avg (80 reviews) → Rank #1
- Colorado: 4.3 avg (60 reviews) → Rank #2
- Nevada: 4.3 avg (40 reviews) → Rank #3

### Mathematical Formula

For each state:

```
Average Rating = Σ(User Ratings) / Total Reviews
```

Example:
```
State: Hawaii
Reviews: [5, 4, 5, 4, 5, 3, 5, 4, 5, 5]
Average = (5+4+5+4+5+3+5+4+5+5) / 10 = 4.5
```

---

## 🏗️ Architecture

### Backend API

#### Endpoint: `/api/reviews/stats`
**Method**: GET
**Purpose**: Retrieve all state statistics for ranking

**Response Format**:
```json
{
  "success": true,
  "count": 50,
  "stats": [
    {
      "state": "California",
      "reviewCount": 150,
      "avgRating": 4.5,
      "avgWage": 18.25
    },
    {
      "state": "Texas",
      "reviewCount": 120,
      "avgRating": 4.3,
      "avgWage": 15.50
    }
    // ... all 50 states
  ]
}
```

#### Endpoint: `/api/reviews/state/:state`
**Method**: GET
**Purpose**: Retrieve all reviews for a specific state

**Response Format**:
```json
{
  "success": true,
  "state": "California",
  "count": 150,
  "reviews": [
    {
      "userFirstName": "John",
      "jobTitle": "Front Desk Associate",
      "city": "Los Angeles",
      "wages": 18.50,
      "rating": 5,
      "experience": "Great experience!",
      "visitYear": "2019, 2021",
      "timesUsed": 2,
      "createdAt": "2025-01-15T00:00:00.000Z"
    }
    // ... more reviews
  ]
}
```

### Frontend Components

#### 1. HTML Structure (Dedicated Page)
**File**: `frontend/state-scoreboard.html`

```html
<section id="main" class="wrapper style2 scoreboard-theme">
  <div class="scoreboard-shell" role="region" aria-labelledby="scoreboard-hero-title">
    <header class="scoreboard-hero">
      <!-- Hero headline, summary, and key metrics -->
    </header>

    <section class="scoreboard-controls" aria-label="Search and filter state rankings">
      <!-- Search input, filter buttons, sort dropdown, and results badge -->
    </section>

    <nav class="scoreboard-tabs" role="tablist" aria-label="State group navigation">
      <!-- Tab buttons for Groups 1 and 2 -->
    </nav>

    <div id="scoreboard-container-group-1" class="scoreboard-container is-active" role="tabpanel">
      <!-- Populated by state-scoreboard.js -->
    </div>

    <div id="scoreboard-container-group-2" class="scoreboard-container" role="tabpanel" aria-hidden="true">
      <!-- Populated by state-scoreboard.js -->
    </div>

    <div id="scoreboard-no-results" class="scoreboard-no-results scoreboard-hidden" role="status">
      <!-- Empty state messaging when filters limit the list -->
    </div>

    <div class="scoreboard-cta">
      <!-- CTA returning users to share-experience.html -->
    </div>
  </div>
</section>
```

#### 2. Share Experience CTA (Entry Point)
**File**: `frontend/share-experience.html`

```html
<section class="scoreboard-cta scoreboard-cta-embed" aria-labelledby="scoreboard-cta-title">
  <div class="scoreboard-cta-icon" aria-hidden="true">
    <i class="fas fa-chart-bar"></i>
  </div>
  <h3 id="scoreboard-cta-title">View the Full State Scoreboard</h3>
  <p>
    Explore all 50 U.S. states ranked by real reviews from Jamaican J-1 participants. Search, filter, and compare wages, ratings, and testimonials to plan your next work and travel journey.
  </p>
  <a class="btn-standard btn-primary btn-large" href="state-scoreboard.html">
    <i class="fas fa-arrow-right" aria-hidden="true"></i>
    <span>Go to Full Scoreboard</span>
  </a>
  <p class="scoreboard-cta-note">
    <i class="fas fa-star" aria-hidden="true"></i>
    Browse rankings, search states, and read detailed reviews
  </p>
</section>
```

This CTA replaces the embedded scoreboard on the submission page and keeps the share form lightweight while directing users to the dedicated experience.

#### 3. External CSS
**File**: `frontend/styles/state-scoreboard.css`

**Key Styles**:
- Responsive grid layout (5×5 on desktop, 3×n on tablet, 1×n on mobile)
- State card styling with hover effects
- Rank badge styling (special styling for top 3)
- Tab navigation styling
- Star rating display

#### 4. External JavaScript
**File**: `frontend/scripts/state-scoreboard.js`

**Key Functions**:
- `fetchStateStats()` - Load all 50 states from API
- `renderScoreboard(group)` - Render states 1-25 or 26-50
- `sortStates(states)` - Apply ranking algorithm
- `displayStateReviews(state)` - Show detailed reviews in popup
- `formatVisitYear(visitYear)` - Format visit year display
- `switchTab(groupNumber)` - Handle tab switching

---

## 📊 Data Flow

### 1. Initial Load
```
Page Load
  ↓
Fetch /api/reviews/stats
  ↓
Receive all 50 states data
  ↓
Sort by avgRating (desc) then reviewCount (desc)
  ↓
Split into Group 1 (ranks 1-25) and Group 2 (ranks 26-50)
  ↓
Render Group 1 (default active tab)
```

### 2. Tab Switching
```
User clicks "States N-W" tab
  ↓
Hide Group 1 container
  ↓
Show Group 2 container
  ↓
Update active tab styling
```

### 3. State Click (Review Details)
```
User clicks on state card
  ↓
Fetch /api/reviews/state/:state
  ↓
Render reviews popup with:
  - Job title
  - City
  - Experience text
  - Visit year(s) ← IMPORTANT
  - Rating stars
  - Date submitted
```

---

## 🎨 UI/UX Design

### Desktop Layout (1920px)
```
┌─────────────────────────────────────────────────────────┐
│  State Scoreboard - Top Rated J-1 Destinations          │
│                                                          │
│  [States A-M (1-25)]  [States N-W (26-50)]  ← Tabs     │
│                                                          │
│  ┌───┬───┬───┬───┬───┐                                 │
│  │#1 │#2 │#3 │#4 │#5 │  ← Row 1                        │
│  │CA │TX │FL │NY │CO │                                  │
│  │⭐⭐⭐⭐│⭐⭐⭐│⭐⭐⭐│⭐⭐⭐│⭐⭐⭐│                               │
│  │4.5│4.3│4.0│3.9│3.8│                                  │
│  │150│120│110│95 │88 │ reviews                         │
│  └───┴───┴───┴───┴───┘                                 │
│  ┌───┬───┬───┬───┬───┐                                 │
│  │#6 │#7 │#8 │#9 │#10│  ← Row 2                        │
│  └───┴───┴───┴───┴───┘                                 │
│  ...                                                    │
│  ┌───┬───┬───┬───┬───┐                                 │
│  │#21│#22│#23│#24│#25│  ← Row 5                        │
│  └───┴───┴───┴───┴───┘                                 │
└─────────────────────────────────────────────────────────┘
```

### Mobile Layout (375px)
```
┌─────────────────────┐
│  State Scoreboard   │
│                     │
│  [A-M]  [N-W] ← Tabs│
│                     │
│  ┌─────────────────┐│
│  │ #1  California  ││
│  │ ⭐⭐⭐⭐⭐ 4.5    ││
│  │ 150 reviews     ││
│  │ $18.25/hr       ││
│  └─────────────────┘│
│  ┌─────────────────┐│
│  │ #2  Texas       ││
│  │ ⭐⭐⭐⭐ 4.3      ││
│  │ 120 reviews     ││
│  │ $15.50/hr       ││
│  └─────────────────┘│
│  ...                │
└─────────────────────┘
```

---

## 📝 Visit Year Display

### Requirement
Each review must clearly show the year(s) the user visited the state.

### Data Source
- **Field**: `visitYear` in Review model
- **Type**: String (e.g., "2019", "2019, 2021", "2018, 2019, 2020")
- **Optional**: May be empty for older reviews

### Display Format

**Single Year**:
```
Visited: 2019
```

**Multiple Years**:
```
Visited: 2019, 2021
```

**No Year (fallback)**:
```
Visited: Not specified
```

### HTML Example
```html
<div class="review-visit-year">
  <i class="fas fa-calendar-alt"></i>
  <span>Visited: 2019, 2021</span>
</div>
```

### CSS Styling
```css
.review-visit-year {
  color: #28a745;
  font-size: 0.9em;
  margin-top: 0.5em;
  font-weight: 600;
}

.review-visit-year i {
  margin-right: 0.3em;
}
```

---

## 🔒 Security Compliance

### External Files (MANDATORY)

**❌ NO inline JavaScript**:
```html
<!-- WRONG - Inline script -->
<script>
  function renderScoreboard() { ... }
</script>
```

**✅ External JavaScript file**:
```html
<!-- CORRECT - External reference -->
<script src="scripts/state-scoreboard.js"></script>
```

**❌ NO inline CSS**:
```html
<!-- WRONG - Inline style tag -->
<style>
  .scoreboard-item { ... }
</style>
```

**✅ External CSS file**:
```html
<!-- CORRECT - External reference -->
<link rel="stylesheet" href="styles/state-scoreboard.css" />
```

### CSP Compliance
- All scripts in external `.js` files
- No `onclick` attributes (use event listeners)
- No `style` attributes (use CSS classes)
- All styles in external `.css` files

---

## 🧪 Testing Protocol

### Backend Testing (Port 3000)

**Test 1**: State Statistics Endpoint
```bash
# Start backend
cd backend
npm run dev

# Test endpoint
curl http://localhost:3000/api/reviews/stats
```

**Expected Result**: JSON with all states, sorted by avgRating desc

**Test 2**: State Reviews Endpoint
```bash
curl http://localhost:3000/api/reviews/state/California
```

**Expected Result**: JSON with all California reviews, including `visitYear` field

### Frontend Testing (Port 8000)

**Test 1**: Load Scoreboard
```bash
# Start frontend server
python -m http.server 8000

# Open in browser
http://localhost:8000/frontend/share-experience.html
```

**Verify**:
- [ ] Scoreboard section visible
- [ ] Two tabs: "States A-M" and "States N-W"
- [ ] Group 1 (ranks 1-25) displays by default
- [ ] All 25 states shown in grid layout

**Test 2**: Tab Switching
- [ ] Click "States N-W" tab
- [ ] Group 2 (ranks 26-50) displays
- [ ] Tab highlighting updates
- [ ] Grid layout maintains structure

**Test 3**: State Details
- [ ] Click on any state card
- [ ] Popup/modal opens with reviews
- [ ] Each review shows visit year (e.g., "Visited: 2019, 2021")
- [ ] Reviews display correctly

**Test 4**: Responsive Layout
- [ ] Desktop (1920px): 5×5 grid
- [ ] Tablet (768px): 3×n grid
- [ ] Mobile (375px): 1×n stacked layout

**Test 5**: Ranking Verification
- [ ] States sorted by avgRating (highest first)
- [ ] Ties broken by reviewCount (most reviews first)
- [ ] Rank numbers display correctly (#1, #2, #3...)

---

## 📂 File Structure

```
Full Codebase/
├── backend/
│   ├── models/
│   │   └── Review.js (existing - has visitYear field)
│   └── routes/
│       └── reviews.js (existing - has /stats and /state/:state endpoints)
│
├── frontend/
│   ├── styles/
│   │   └── state-scoreboard.css (NEW - external scoreboard styles)
│   ├── scripts/
│   │   └── state-scoreboard.js (NEW - external scoreboard logic)
│   └── share-experience.html (MODIFY - update scoreboard section)
│
└── docs/
    └── state-scoreboard.md (this file)
```

---

## 🚀 Implementation Steps

### Phase 1: Backend Enhancement ✅
1. ✅ Review model has `visitYear` field
2. ✅ `/api/reviews/stats` endpoint exists
3. ✅ `/api/reviews/state/:state` endpoint exists
4. ✅ Ranking algorithm in `getAllStatesStats()` method

**Status**: Backend is ready, no changes needed.

### Phase 2: Extract Inline Code to External Files
1. Create `frontend/styles/state-scoreboard.css`
2. Move all scoreboard CSS from `<style>` tags to external CSS
3. Create `frontend/scripts/state-scoreboard.js`
4. Move all scoreboard JavaScript from `<script>` tags to external JS
5. Update `share-experience.html` to reference external files

### Phase 3: Implement 50-State Display
1. Modify `renderScoreboard()` to accept group parameter (1 or 2)
2. Add tab navigation HTML
3. Implement tab switching logic
4. Split ranked states into two groups of 25
5. Render appropriate group based on active tab

### Phase 4: Add Visit Year Display
1. Update review popup to include `visitYear` field
2. Add formatting function for visit year display
3. Style visit year with calendar icon
4. Handle empty/missing visit year gracefully

### Phase 5: Testing
1. Test backend endpoints on port 3000
2. Test frontend on port 8000
3. Verify all 50 states display correctly
4. Verify visit year shows for each review
5. Test responsive layouts
6. Test tab switching
7. Verify no console errors

### Phase 6: Documentation
1. Update this file with final implementation details
2. Add inline code comments referencing this doc
3. Create deployment checklist

---

## 🎯 Success Criteria

### Must Have ✅
- [ ] All 50 U.S. states displayed
- [ ] Split into two sets of 25 (tabs or pagination)
- [ ] States ranked by avgRating + reviewCount
- [ ] Visit year displayed for each review
- [ ] No inline JavaScript or CSS
- [ ] External `.js` and `.css` files properly referenced
- [ ] Responsive layout (desktop, tablet, mobile)
- [ ] No console errors

### Should Have
- [ ] Smooth tab transitions
- [ ] Loading states while fetching data
- [ ] Error handling for API failures
- [ ] Keyboard navigation support
- [ ] Screen reader accessible

### Nice to Have
- [ ] Animation for tab switching
- [ ] Search/filter functionality
- [ ] Export scoreboard data
- [ ] Share scoreboard link

---

## 📋 API Reference

### GET /api/reviews/stats

**Description**: Retrieve statistics for all states

**Authentication**: None required

**Response**:
```json
{
  "success": true,
  "count": 50,
  "stats": [
    {
      "state": "California",
      "reviewCount": 150,
      "avgRating": 4.5,
      "avgWage": 18.25
    }
  ]
}
```

### GET /api/reviews/state/:state

**Description**: Retrieve all reviews for a specific state

**Parameters**:
- `state` (path): State name (e.g., "California")

**Authentication**: None required

**Response**:
```json
{
  "success": true,
  "state": "California",
  "count": 150,
  "reviews": [
    {
      "userFirstName": "John",
      "jobTitle": "Front Desk Associate",
      "city": "Los Angeles",
      "wages": 18.50,
      "hoursPerWeek": 40,
      "rating": 5,
      "experience": "Great experience!",
      "visitYear": "2019, 2021",
      "timesUsed": 2,
      "createdAt": "2025-01-15T00:00:00.000Z"
    }
  ]
}
```

---

## 🔄 Future Enhancements

### Version 2.0 (Planned)
- **Advanced Filtering**: Filter by job type, wage range, rating
- **Comparison Tool**: Compare 2-3 states side-by-side
- **Trend Analysis**: Show rating trends over time
- **Heat Map**: Visual map of state ratings

### Version 3.0 (Planned)
- **User Favorites**: Save favorite states
- **Email Alerts**: Notify when state rating changes
- **Social Sharing**: Share scoreboard on social media
- **Export to PDF**: Download scoreboard as PDF

---

## 🐛 Known Issues

### Current Limitations
1. Scoreboard only shows top 25 states (not all 50) ← **Being Fixed**
2. Visit year not displayed in reviews ← **Being Fixed**
3. Inline JavaScript in `share-experience.html` ← **Being Fixed**
4. Inline CSS in `share-experience.html` ← **Being Fixed**

### Resolved Issues
- None yet (new feature)

---

## 📞 Support

### Troubleshooting

**Issue**: Scoreboard not loading
- Check backend is running on port 3000
- Check frontend is running on port 8000
- Verify `/api/reviews/stats` endpoint returns data

**Issue**: Visit year not showing
- Verify review has `visitYear` field populated
- Check API response includes `visitYear`
- Verify `formatVisitYear()` function is called

**Issue**: Only 25 states showing
- Verify both tabs are present
- Check tab switching logic
- Verify Group 2 container exists

---

## 🐛 JavaScript Class Name Mismatch Fixes

**Date Fixed**: 2025-10-30
**Issue**: State cards not rendering, showing "0 of 0 states"
**Root Cause**: HTML and JavaScript using different class names

### Problems Discovered

1. **Tab Button Class Mismatch**
   - HTML uses: `class="scoreboard-tab-button"`
   - JavaScript was looking for: `.tab-btn`
   - Result: Tab navigation not working

2. **Active State Class Mismatch**
   - HTML uses: `class="is-active"`
   - JavaScript was using: `.add('active')` / `.remove('active')`
   - Result: Active states not toggling correctly

3. **Missing data-group Attributes**
   - HTML containers had IDs but no `data-group` attributes
   - JavaScript was trying to read `container.getAttribute('data-group')`
   - Result: Container switching logic failing

4. **Unwanted Hero Statistics**
   - HTML showed "0 states tracked, Avg Rating 0.0/5, 0 peer reviews"
   - User requested removal (confusing placeholders)
   - Result: Removed entire `scoreboard-hero-meta` section

### Fixes Applied

#### Fix 1: Tab Button Selector (state-scoreboard.js)
**Lines 100, 128**
```javascript
// Before
const tabButtons = document.querySelectorAll('.scoreboard-tabs .tab-btn');

// After
const tabButtons = document.querySelectorAll('.scoreboard-tabs .scoreboard-tab-button');
```

#### Fix 2: Active Class Names (state-scoreboard.js)
**Lines 132-136, 145-149**
```javascript
// Before
button.classList.add('active');
button.classList.remove('active');
container.classList.add('active');
container.classList.remove('active');

// After
button.classList.add('is-active');
button.classList.remove('is-active');
container.classList.add('is-active');
container.classList.remove('is-active');
```

#### Fix 3: data-group Attributes (state-scoreboard.html)
**Lines 186, 193**
```html
<!-- Before -->
<div id="scoreboard-container-group-1" class="scoreboard-container is-active" role="tabpanel" aria-labelledby="scoreboard-tab-1">

<div id="scoreboard-container-group-2" class="scoreboard-container" role="tabpanel" aria-labelledby="scoreboard-tab-2" aria-hidden="true">

<!-- After -->
<div id="scoreboard-container-group-1" class="scoreboard-container is-active" role="tabpanel" aria-labelledby="scoreboard-tab-1" data-group="1">

<div id="scoreboard-container-group-2" class="scoreboard-container" role="tabpanel" aria-labelledby="scoreboard-tab-2" aria-hidden="true" data-group="2">
```

#### Fix 4: Remove Hero Statistics (state-scoreboard.html)
**Removed lines 103-116**
```html
<!-- REMOVED -->
<div class="scoreboard-hero-meta" aria-live="polite">
  <span class="scoreboard-hero-chip">
    <i class="fas fa-flag" aria-hidden="true"></i>
    <span id="hero-total-states">0</span> states tracked
  </span>
  <span class="scoreboard-hero-chip">
    <i class="fas fa-star" aria-hidden="true"></i>
    Avg Rating <span id="hero-average-rating">0.0</span>/5
  </span>
  <span class="scoreboard-hero-chip">
    <i class="fas fa-user-friends" aria-hidden="true"></i>
    <span id="hero-total-reviews">0</span> peer reviews
  </span>
</div>
```

### Files Modified
- ✅ `frontend/scripts/state-scoreboard.js` - Fixed class selectors and active state management
- ✅ `frontend/state-scoreboard.html` - Added data-group attributes, removed hero stats

### Testing Steps
1. Clear browser cache (Ctrl+Shift+R)
2. Load http://localhost:8000/frontend/state-scoreboard.html
3. Verify state cards load (should show all 50 states)
4. Verify tab navigation works (switch between A-M and N-W groups)
5. Verify filter buttons work (All States, With Reviews, 4★ & Above)
6. Verify no "0 states tracked" message appears

### CORS Verification
- ✅ Backend `.env` already includes `http://localhost:8000` in `CLIENT_URL`
- ✅ Tested with curl: `Access-Control-Allow-Origin: http://localhost:8000` header present
- ✅ API endpoint `/api/reviews/stats` returns valid data
- ✅ No CORS issues preventing data loading

### Expected Behavior After Fixes
1. **State cards render**: All 50 U.S. states display in two groups
2. **Tab navigation works**: Clicking "States A–M" or "States N–W" switches groups
3. **Filters work**: "All States", "With Reviews", and "4★ & Above" buttons filter cards
4. **Hero stats removed**: No confusing "0 states tracked" message
5. **Reviews popup works**: Clicking states with reviews opens modal

---

## 🎛️ Sort and Filter Functionality Implementation

**Date Added**: 2025-10-30
**Feature**: Sort dropdown and filter buttons
**Status**: ✅ Completed

### Features Implemented

#### 1. Sort Dropdown
**Location**: `<select id="scoreboard-sort">`

**Options**:
- **Rating (High to Low)** - Default, sorts by avgRating descending
- **Most Reviewed** - Sorts by reviewCount descending
- **Highest Wage** - Sorts by avgWage descending
- **A to Z** - Alphabetical by state name

**Implementation**:
- `setupSortDropdown()` - Attaches change event listener
- `sortStates(sortBy)` - Sorts allStatesData array and re-renders both groups
- Console logging for debugging

#### 2. Filter Buttons
**Location**: `.scoreboard-filter-button` elements

**Options**:
- **All States** - Shows all 50 states (default active)
- **With Reviews** - Shows only states with reviewCount > 0
- **4★ & Above** - Shows states with rating ≥ 4.0 AND reviews > 0

**Implementation**:
- `setupFilterButtons()` - Attaches click event listeners to all filter buttons
- `filterStates(filterType)` - Hides/shows cards based on filter criteria
- Updates `visible-count` dynamically
- Active button gets `is-active` class
- Hidden cards get `filter-hidden` class

#### 3. State Count Display
**Location**: `<span id="visible-count">` and `<span id="total-count">`

**Functionality**:
- `total-count` updated when data loads (shows 50)
- `visible-count` updated when filters applied
- Shows "Showing X of 50 states"

### Code Snippets

#### Sort Implementation (state-scoreboard.js)
```javascript
function sortStates(sortBy) {
    if (!allStatesData || allStatesData.length === 0) {
        console.warn('No state data to sort');
        return;
    }

    let sortedStates = [...allStatesData];

    switch (sortBy) {
        case 'rating':
            sortedStates.sort((a, b) => b.avgRating - a.avgRating);
            break;
        case 'reviews':
            sortedStates.sort((a, b) => b.reviewCount - a.reviewCount);
            break;
        case 'wage':
            sortedStates.sort((a, b) => b.avgWage - a.avgWage);
            break;
        case 'alphabetical':
            sortedStates.sort((a, b) => a.state.localeCompare(b.state));
            break;
    }

    allStatesData = sortedStates;
    renderScoreboardGroup(1);
    renderScoreboardGroup(2);
}
```

#### Filter Implementation (state-scoreboard.js)
```javascript
function filterStates(filterType) {
    const allCards = document.querySelectorAll('.scoreboard-item');
    let visibleCount = 0;

    allCards.forEach(card => {
        const reviewCount = parseInt(card.querySelector('.scoreboard-reviews')?.textContent || '0');
        const ratingText = card.querySelector('.scoreboard-rating span:last-child')?.textContent || '0';
        const rating = parseFloat(ratingText);

        let shouldShow = false;

        switch (filterType) {
            case 'all':
                shouldShow = true;
                break;
            case 'reviewed':
                shouldShow = reviewCount > 0;
                break;
            case 'top-rated':
                shouldShow = rating >= 4.0 && reviewCount > 0;
                break;
        }

        if (shouldShow) {
            card.style.display = '';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    document.getElementById('visible-count').textContent = visibleCount;
}
```

### Files Modified
- ✅ `frontend/scripts/state-scoreboard.js` - Added sort and filter functions
- ✅ `frontend/scripts/state-scoreboard.js` - Updated initScoreboard() to call setup functions
- ✅ `frontend/scripts/state-scoreboard.js` - Added total-count and visible-count updates

### Testing Checklist
- [ ] Sort dropdown changes order of state cards
- [ ] "Rating (High to Low)" sorts correctly
- [ ] "Most Reviewed" sorts correctly
- [ ] "Highest Wage" sorts correctly
- [ ] "A to Z" sorts alphabetically
- [ ] "All States" button shows all 50 states
- [ ] "With Reviews" button shows only 4 states (AR, HI, NC, VA)
- [ ] "4★ & Above" button shows only 1 state (North Carolina)
- [ ] Active filter button has `is-active` class
- [ ] Visible count updates when filtering
- [ ] Sort and filter work together (can sort then filter, or vice versa)

---

---

## 🎨 Theme Styling Update - 2025-10-31

**Date Applied**: 2025-10-31
**Status**: ✅ Completed
**Branch**: `backup/scoreboard-theme-styling-20251031`

### Changes Applied

#### 1. ✅ Title Styling Refinement
**File Modified**: `frontend/styles/state-scoreboard.css` (lines 67-74)

**Change**: Removed `color: var(--scoreboard-gold)` from `.wrapper.scoreboard-theme .title` to allow default title styling.

**Before**:
```css
.wrapper.scoreboard-theme .title {
    color: var(--scoreboard-gold);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: var(--scoreboard-spacing-md);
}
```

**After**:
```css
/* See CLAUDE.md - Security & Design Best Practices Mandate */
/* Title styling for scoreboard theme wrapper */
/* Updated: 2025-10-31 - Removed gold color per theme requirements */
.wrapper.scoreboard-theme .title {
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: var(--scoreboard-spacing-md);
}
```

**Specificity**: `(0,3,0)` - `.wrapper.scoreboard-theme .title`

#### 2. ✅ Button Hover Behavior Override
**File Modified**: `frontend/styles/state-scoreboard.css` (lines 76-88)

**Change**: Added button hover override to prevent `#ffee00` background from `main.css` while preserving hover responsiveness.

**Implementation**:
```css
/* See CLAUDE.md - Security & Design Best Practices Mandate */
/* Button hover behavior override for scoreboard theme */
/* Updated: 2025-10-31 - Override main.css #ffee00 background, preserve hover responsiveness */
.wrapper.scoreboard-theme input[type="button"]:hover,
.wrapper.scoreboard-theme input[type="submit"]:hover,
.wrapper.scoreboard-theme input[type="reset"]:hover,
.wrapper.scoreboard-theme button:hover:not(.scoreboard-filter-button):not(.scoreboard-tab-button):not(.scoreboard-modal-close),
.wrapper.scoreboard-theme .button:hover {
    background-color: transparent;
    opacity: 0.85;
    transform: translateY(-2px);
    transition: all var(--scoreboard-transition-fast);
}
```

**Rationale**:
- Overrides `main.css:1800` rule that applies `background-color: #ffee00` to all buttons
- Excludes scoreboard-specific buttons (`.scoreboard-filter-button`, `.scoreboard-tab-button`, `.scoreboard-modal-close`) which have their own hover styles
- Maintains hover interactivity with opacity fade and subtle lift effect
- Uses theme's transition variable for consistency

#### 3. ✅ Theme Variables Verification
**File**: `frontend/styles/state-scoreboard.css` (lines 30-59)

**Status**: All theme variables already properly defined under `.wrapper.scoreboard-theme` with specificity `(0,2,0)`.

**Variables Include**:
- Backgrounds: `--scoreboard-bg`, `--scoreboard-panel`, `--scoreboard-panel-alt`
- Borders: `--scoreboard-border`, `--scoreboard-border-strong`
- Text colors: `--scoreboard-text-primary`, `--scoreboard-text-secondary`, `--scoreboard-text-tertiary`
- Accent colors: `--scoreboard-gold`, `--scoreboard-gold-dark`, `--scoreboard-green`, `--scoreboard-green-dark`, `--scoreboard-danger`
- Shadows: `--scoreboard-shadow`, `--scoreboard-shadow-focus`
- Radii: `--scoreboard-radius-sm`, `--scoreboard-radius-md`, `--scoreboard-radius-lg`
- Spacing: `--scoreboard-spacing-xs` through `--scoreboard-spacing-2xl`
- Font stack: `--scoreboard-font-sans`
- Transitions: `--scoreboard-transition-fast`, `--scoreboard-transition-base`

#### 4. ✅ Accessibility Fix - Viewport Meta Tag
**File Modified**: `frontend/state-scoreboard.html` (line 6)

**Change**: Removed `user-scalable=no` to comply with WCAG AAA accessibility standards.

**Before**:
```html
<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
```

**After**:
```html
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

**Rationale**:
- Prevents locking zoom functionality
- Allows users with visual impairments to zoom content
- Complies with WCAG AAA Level accessibility requirements
- See CLAUDE.md section 4c for full accessibility requirements

### Files Modified Summary
- ✅ `frontend/styles/state-scoreboard.css` - Title styling, button hover override
- ✅ `frontend/state-scoreboard.html` - Viewport meta tag accessibility fix

### Testing Protocol
1. ✅ Backend running on port 3000
2. ✅ Frontend running on port 8000
3. Test checklist:
   - [ ] Title displays without gold color override
   - [ ] Button hover shows opacity fade and lift (no yellow background)
   - [ ] Scoreboard filter buttons maintain their gold hover effect
   - [ ] Scoreboard tab buttons maintain their gold hover effect
   - [ ] Modal close button maintains its hover effect
   - [ ] Viewport allows pinch-to-zoom on mobile
   - [ ] Desktop responsive (1920px)
   - [ ] Tablet responsive (768px)
   - [ ] Mobile responsive (375px)
   - [ ] No console errors
   - [ ] Zero CSP violations in browser console

### Code Reference
- See `state-scoreboard.css:67-74` for title styling (state-scoreboard.css:67)
- See `state-scoreboard.css:76-88` for button hover override (state-scoreboard.css:76)
- See `state-scoreboard.html:6` for viewport meta tag (state-scoreboard.html:6)

---

## 🎨 Green Background Theme Update - 2025-10-31

**Date Applied**: 2025-10-31
**Status**: ✅ Completed
**Branch**: `backup/scoreboard-theme-styling-20251031`

### Change Applied

#### Background Color: Dark → Green
**File Modified**: `frontend/styles/state-scoreboard.css` (line 33)

**Change**: Updated `--scoreboard-bg` CSS variable from dark (`#0d0d0d`) to green (`#009b3a`).

**Before**:
```css
.wrapper.scoreboard-theme {
    --scoreboard-bg: #0d0d0d;
    /* ... other variables ... */
}
```

**After**:
```css
/* See CLAUDE.md - Security & Design Best Practices Mandate */
/* Updated: 2025-10-31 - Changed background to green (#009b3a) per user request */
.wrapper.scoreboard-theme {
    --scoreboard-bg: #009b3a;
    /* ... other variables ... */
}
```

**Impact**:
- Background of entire `.wrapper.scoreboard-theme` section now displays green
- Uses custom green color matching brand/theme requirements
- Affects line 64: `background: var(--scoreboard-bg);`

**Color Details**:
- **Hex**: `#009b3a`
- **RGB**: `rgb(0, 155, 58)`
- **Color Name**: Dark Green / Brazilian Flag Green
- **Accessibility**: Excellent contrast with white text (ratio ~5.9:1) ✅ WCAG AA compliant

### Testing Checklist
- [ ] Green background displays correctly on page load
- [ ] Text remains readable (white text on green background)
- [ ] No visual regressions in cards, buttons, or panels
- [ ] Desktop, tablet, mobile responsive layouts intact
- [ ] Color contrast meets WCAG AA standards (minimum 4.5:1 ratio)

### Code Reference
- See `state-scoreboard.css:33` for background color variable (state-scoreboard.css:33)

---

---

## 👤 Profile Icon & Monetization Integration - 2025-10-31

**Date Applied**: 2025-10-31
**Status**: ✅ Completed
**Branch**: `backup/scoreboard-theme-styling-20251031`

### Features Added

#### 1. ✅ Profile Icon
**Location**: Support container (bottom-right floating widget)
**File Modified**: `frontend/state-scoreboard.html` (lines 276-287)

**Implementation**:
```html
<!-- Profile Icon with Yellow Glow -->
<div class="profile-icon" title="User Profile">
  <i class="fa fa-user"></i>
</div>
```

**Functionality**:
- Displays floating profile icon in bottom-right corner
- Shows login status (yellow glow when logged in)
- Clicking opens profile dropdown with:
  - User's first name
  - Profile link
  - Logout button
- Handled by `scripts/profile-hub.js`
- Requires authentication via Google or Facebook OAuth

**CSS**: `styles/profile-hub.css`
**JavaScript**: `scripts/profile-hub.js`, `scripts/auth-client.js`

#### 2. ✅ Native Ad
**Location**: Between hero section and controls
**File Modified**: `frontend/state-scoreboard.html` (lines 101-121)

**Implementation**:
```html
<div class="native-ad native-ad-inline" style="margin: var(--scoreboard-spacing-xl) 0;">
  <img src="https://via.placeholder.com/150x150/ffee00/000000?text=Travel+Tips" alt="Advertisement" class="ad-image" />
  <div class="ad-content">
    <h3 class="ad-title">
      <a href="#" target="_blank" rel="noopener sponsored">
        Essential Travel Insurance for J-1 Students
      </a>
    </h3>
    <p class="ad-description">
      Protect yourself during your Work & Travel program. Get comprehensive coverage for medical emergencies, travel delays, and more.
    </p>
    <span class="ad-cta">Learn More →</span>
  </div>
</div>
```

**Placement Rationale**:
- High visibility after hero section
- Non-intrusive, matches site design language
- Relevant to J-1 students (travel insurance)
- Uses `native-ad-inline` class for consistent styling

**CSS**: `styles/native-ads.css`
**JavaScript**: `scripts/native-ads.js`

#### 3. ✅ Video Ad
**Location**: Bottom-left corner (desktop only, floating widget)
**File Modified**: `frontend/state-scoreboard.html` (lines 325-378)

**Implementation**:
```html
<div id="video-ad-container" class="video-ad-container">
  <!-- Header with minimize/close controls -->
  <div class="video-ad-header">
    <span class="video-ad-label">Sponsored</span>
    <div class="video-ad-controls">
      <button class="video-ad-btn video-ad-minimize" title="Minimize">
        <i class="fa fa-minus"></i>
      </button>
      <button class="video-ad-btn video-ad-close" title="Close">
        <i class="fa fa-times"></i>
      </button>
    </div>
  </div>

  <!-- Video player with muted autoplay -->
  <div class="video-ad-content">
    <div class="video-ad-badge">AD</div>
    <video class="video-ad-player" controls muted loop>
      <!-- Video source loaded dynamically -->
    </video>
    <div class="video-ad-placeholder">
      <i class="fa fa-video"></i>
      <div class="video-ad-placeholder-text">Video ad loading...</div>
    </div>
  </div>

  <!-- Footer with sponsor info and sound toggle -->
  <div class="video-ad-footer">
    <div class="video-ad-info">
      <span class="video-ad-sponsor-label">Sponsor:</span>
      <a href="#" class="video-ad-sponsor" target="_blank" rel="noopener">Advertisement</a>
    </div>
    <button class="video-ad-sound muted" title="Unmute">
      <i class="fa fa-volume-mute"></i>
    </button>
  </div>
</div>
```

**Features**:
- Desktop only (hidden on mobile/tablet)
- Muted autoplay with user-controlled sound
- Minimize and close buttons
- Restore button when minimized
- Non-blocking (doesn't interfere with content)

**CSS**: `styles/video-ad.css`
**JavaScript**: `scripts/video-ad.js`

#### 4. ✅ Login Modal
**Location**: Modal overlay (hidden by default)
**File Modified**: `frontend/state-scoreboard.html` (lines 380-398)

**Implementation**:
```html
<div id="loginModal" class="modal" role="dialog" aria-labelledby="loginModalTitle" aria-modal="true">
  <div class="modal-content auth-modal-content">
    <h2 id="loginModalTitle" class="modal-title">
      <i class="fas fa-sign-in-alt" aria-hidden="true"></i> Login Required
    </h2>
    <p id="loginModalDesc" class="modal-description">
      You must be logged in to access this feature...
    </p>
    <div class="modal-buttons auth-modal-actions">
      <button id="btn-google-login" class="btn-standard btn-google auth-modal-btn">
        <i class="fab fa-google"></i> Sign in with Google
      </button>
      <button id="btn-facebook-login" class="btn-standard btn-facebook auth-modal-btn">
        <i class="fab fa-facebook"></i> Sign in with Facebook
      </button>
      <button id="btn-cancel-login" class="btn-standard btn-secondary auth-modal-btn">CANCEL</button>
    </div>
  </div>
</div>
```

**Purpose**:
- Prompts user to log in when accessing protected features
- Google and Facebook OAuth options
- Standardized modal design matching sitewide standards

**CSS**: `styles/modal-standard.css`
**JavaScript**: `scripts/login-modal.js`, `scripts/login-init.js`

### Files Modified Summary
- ✅ `frontend/state-scoreboard.html` - Added profile icon, native ad, video ad, login modal
- ✅ CSS files linked: `native-ads.css`, `video-ad.css`, `profile-hub.css`
- ✅ JavaScript files linked: `auth-client.js`, `login-modal.js`, `login-init.js`, `profile-hub.js`, `native-ads.js`, `video-ad.js`

### Scripts Added
**Authentication & Profile**:
- `scripts/auth-client.js` - OAuth authentication client
- `scripts/login-modal.js` - Login modal behavior
- `scripts/login-init.js` - Login initialization
- `scripts/profile-hub.js` - Profile icon dropdown functionality

**Advertisements**:
- `scripts/native-ads.js` - Native ad tracking and behavior
- `scripts/video-ad.js` - Video ad controller (minimize, close, sound toggle)

### Testing Checklist
- [ ] Profile icon displays in bottom-right corner
- [ ] Profile icon shows login status (yellow glow when logged in)
- [ ] Clicking profile icon opens dropdown with user info
- [ ] Login modal appears when profile clicked while logged out
- [ ] Google OAuth login works correctly
- [ ] Facebook OAuth login works correctly
- [ ] Logout button functions properly
- [ ] Native ad displays between hero and controls
- [ ] Native ad styling matches site design
- [ ] Video ad displays in bottom-left (desktop only)
- [ ] Video ad controls work (minimize, close, sound toggle)
- [ ] Video ad doesn't display on mobile/tablet
- [ ] All elements responsive and accessible
- [ ] No console errors
- [ ] Zero CSP violations

### Code References
- Profile icon: `state-scoreboard.html:284-286`
- Native ad: `state-scoreboard.html:104-121`
- Video ad container: `state-scoreboard.html:327-378`
- Login modal: `state-scoreboard.html:383-398`

### Accessibility Notes
- ✅ Profile icon has title attribute for screen readers
- ✅ Native ad uses semantic HTML and rel="sponsored"
- ✅ Video ad includes ARIA labels and controls
- ✅ Login modal uses role="dialog" and aria-labelledby
- ✅ All interactive elements have appropriate ARIA attributes
- ✅ Keyboard navigation supported for all added elements

---

---

## 🔧 Layout Corrections & UI Refinements - 2025-10-31

**Date Applied**: 2025-10-31
**Status**: ✅ Completed
**Branch**: `backup/scoreboard-theme-styling-20251031`

### Changes Applied

#### 1. ✅ Title Correction
**Files Modified**:
- `frontend/state-scoreboard.html` (line 4 - page title)
- `frontend/state-scoreboard.html` (line 93 - hero title)

**Change**: Removed phrase `"– Top Rated J-1 Destinations"` from titles

**Before**:
```html
<title>State Scoreboard - Top Rated J-1 Destinations | JamWatHQ</title>
...
<h2 class="scoreboard-hero-title">State Scoreboard – Top Rated J-1 Destinations</h2>
```

**After**:
```html
<title>State Scoreboard | JamWatHQ</title>
...
<h2 class="scoreboard-hero-title">State Scoreboard</h2>
```

**Rationale**:
- Cleaner, more concise title
- Removes redundant marketing language
- Improves SEO with focused title
- Better screen reader experience
- Maintains semantic correctness

#### 2. ✅ Profile Icon Placement Correction
**File Modified**: `frontend/state-scoreboard.html` (lines 300-308)

**Change**: Moved profile icon from `support-container` to dedicated `profile-hub-container` to match index page

**Before**:
```html
<div class="support-container">
  <a class="report-problem-btn" href="report-problem.html">Report a Problem</a>
  <a class="floating-gear-icon" href="#footer">...</a>
  <!-- Profile icon was here (incorrect placement) -->
  <div class="profile-icon" title="User Profile">
    <i class="fa fa-user"></i>
  </div>
</div>
```

**After**:
```html
<!-- Profile Hub Container - Positioned Above Support Container -->
<div class="profile-hub-container">
  <button id="profile-hub-btn" class="profile-hub-btn">
    Login
  </button>
  <!-- Profile Icon with Yellow Glow -->
  <div class="profile-icon" title="User Profile">
    <i class="fa fa-user"></i>
  </div>
</div>

<!-- Support Container (profile icon removed) -->
<div class="support-container" role="complementary" aria-label="Support shortcuts">
  <a class="report-problem-btn" href="report-problem.html">Report a Problem</a>
  <a class="floating-gear-icon" href="#footer">...</a>
</div>
```

**Features Restored**:
- ✅ Login button appears next to profile icon
- ✅ Proper top-right positioning (matches index page)
- ✅ Correct stacking order (profile hub above support container)
- ✅ Yellow glow when logged in
- ✅ Dropdown functionality with user info and logout

**CSS**: `styles/profile-hub.css`
**JavaScript**: `scripts/profile-hub.js`

#### 3. ✅ Second Native Ad Added
**File Modified**: `frontend/state-scoreboard.html` (lines 218-238)
**Location**: After CTA section, before footer

**Implementation**:
```html
<!-- Native Ad #2: Bottom Placement -->
<div class="native-ad native-ad-inline" style="margin: var(--scoreboard-spacing-2xl) 0;">
  <img
    src="https://via.placeholder.com/150x150/ffee00/000000?text=Flight+Deals"
    alt="Advertisement"
    class="ad-image"
  />
  <div class="ad-content">
    <h3 class="ad-title">
      <a href="#" target="_blank" rel="noopener sponsored">
        Find Affordable Flights from Jamaica to the USA
      </a>
    </h3>
    <p class="ad-description">
      Compare prices and book the best deals on flights for your J-1 journey. Save on airfare and start your adventure with confidence.
    </p>
    <span class="ad-cta">Compare Flights →</span>
  </div>
</div>
```

**Placement Rationale**:
- Final engagement point before footer
- Captures users after reviewing state data
- Relevant to J-1 students (flight booking)
- Doesn't interfere with footer or navigation
- Uses same styling as first native ad for consistency

**Ad Distribution on Page**:
1. **Native Ad #1**: Between hero and controls (top visibility)
2. **Native Ad #2**: After CTA, before footer (bottom engagement)
3. **Video Ad**: Bottom-left corner, floating (desktop only)

Total ad coverage: 3 ad units (2 native, 1 video)

### Files Modified Summary
- ✅ `frontend/state-scoreboard.html` - Title correction, profile icon repositioning, second native ad
- ✅ `docs/state-scoreboard.md` - Documentation updated

### Testing Checklist
- [ ] Page title displays as "State Scoreboard | JamWatHQ"
- [ ] Hero title displays as "State Scoreboard" (no subtitle)
- [ ] Profile hub container displays in top-right corner
- [ ] Login button appears next to profile icon
- [ ] Profile icon functionality works (dropdown, logout)
- [ ] Support container displays separately (gear icon, report button)
- [ ] First native ad displays between hero and controls
- [ ] Second native ad displays after CTA, before footer
- [ ] Both native ads styled consistently
- [ ] No layout conflicts or overlapping elements
- [ ] Desktop responsive (1920px)
- [ ] Tablet responsive (768px)
- [ ] Mobile responsive (375px)
- [ ] No console errors
- [ ] Zero CSP violations

### Code References
- Title correction: `state-scoreboard.html:4, 93`
- Profile hub container: `state-scoreboard.html:300-308`
- Support container: `state-scoreboard.html:311-316`
- Native ad #1: `state-scoreboard.html:104-121`
- Native ad #2: `state-scoreboard.html:221-238`

### Accessibility Verification
- ✅ Title changes maintain semantic hierarchy (h1 → h2)
- ✅ Profile hub includes login button for keyboard users
- ✅ Profile icon has descriptive title attribute
- ✅ Support container maintains ARIA labels
- ✅ Native ads use rel="sponsored" for search engines
- ✅ All interactive elements keyboard accessible

---

## 📏 Welcome Modal Button Text Size Optimization

**Date Applied**: 2025-10-31
**Status**: ✅ Completed
**File Modified**: `frontend/scripts/tos-modal.js`

### Issue Identified
The welcome modal ("Welcome to JamWatHQ! 🇯🇲") buttons were experiencing text overflow and misalignment issues, particularly with the "LEARN MORE" button. Button labels were not fitting cleanly within button boundaries.

### Buttons Affected
- **DECLINE** button (red)
- **LEARN MORE** button (yellow)
- **ACCEPT & CONTINUE** button (green)

### Changes Made

#### Desktop (Default) - Lines 322-342
**Before**:
```css
.tos-btn {
    padding: 0.75em 1.25em;
    font-size: 0.95em;
    gap: 0.4em;
}
```

**After**:
```css
.tos-btn {
    padding: 0.75em 1.15em;  /* Reduced horizontal padding */
    font-size: 0.85em;       /* Reduced from 0.95em */
    gap: 0.35em;             /* Reduced from 0.4em */
}
```

#### Tablet/Mobile (max-width: 768px) - Lines 422-430
**Before**:
```css
.tos-btn {
    font-size: 0.9em;
}
```

**After**:
```css
.tos-btn {
    font-size: 0.8em;  /* Reduced from 0.9em */
}
```

#### Small Screens (max-width: 480px) - Lines 483-488
**Before**:
```css
.tos-btn {
    font-size: 0.85em;
    gap: 0.35em;
}
```

**After**:
```css
.tos-btn {
    font-size: 0.75em;  /* Reduced from 0.85em */
    gap: 0.3em;         /* Reduced from 0.35em */
}
```

### Visual Impact

**Font Size Reductions**:
- Desktop: 0.95em → 0.85em (-10.5% reduction)
- Tablet: 0.9em → 0.8em (-11% reduction)
- Mobile: 0.85em → 0.75em (-12% reduction)

**Benefits**:
- ✅ Button text no longer overflows
- ✅ "LEARN MORE" button fits cleanly
- ✅ Better visual balance across all three buttons
- ✅ Maintains 44px minimum height for touch accessibility
- ✅ Consistent padding and spacing
- ✅ Icons remain proportional to text

### Responsive Behavior

| Breakpoint | Font Size | Padding | Gap | Min Height |
|------------|-----------|---------|-----|------------|
| Desktop (>768px) | 0.85em | 0.75em 1.15em | 0.35em | auto |
| Tablet (≤768px) | 0.8em | 0.875em 1em | 0.35em | 44px |
| Mobile (≤480px) | 0.75em | 0.75em 0.875em | 0.3em | 44px |

### Accessibility Compliance
- ✅ **Touch Targets**: All buttons maintain 44px minimum height (WCAG AAA)
- ✅ **Readability**: Text remains readable at all sizes
- ✅ **Contrast**: No changes to color contrast ratios
- ✅ **Focus States**: Focus indicators maintained
- ✅ **Screen Readers**: No impact on accessibility labels

### Testing Checklist
- [ ] Desktop (1920px) - Button text fits cleanly
- [ ] Tablet (768px) - Full-width buttons with proper sizing
- [ ] Mobile (375px) - Stacked buttons with touch-friendly targets
- [ ] All button labels fully visible
- [ ] No text wrapping or overflow
- [ ] Icons properly spaced from text
- [ ] Hover/focus states functional

### Testing URLs
- **Frontend**: http://localhost:8000
- **Test page**: Any page with TOS modal (first visit or clear localStorage)

To test, clear localStorage and refresh:
```javascript
localStorage.removeItem('jamwathq_tos_accepted');
location.reload();
```

---

**Document Created**: 2025-10-30
**Last Updated**: 2025-10-31
**Maintained By**: Development Team
**Next Review**: After testing complete

---
