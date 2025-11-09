# Project Structure Documentation

**Date Created**: 2025-10-30
**Status**: 🔄 Restructuring in Progress
**Branch**: backup/project-restructure-20251030

---

## Table of Contents
1. [Current Structure (Before)](#current-structure-before)
2. [Target Structure (After)](#target-structure-after)
3. [Migration Plan](#migration-plan)
4. [Path Reference Guide](#path-reference-guide)
5. [Testing Checklist](#testing-checklist)

---

## Current Structure (Before)

```
Full Codebase/
├── index.html                    ⚠️ ROOT LEVEL (needs to move)
├── styles/                       ⚠️ ROOT LEVEL (needs to move)
│   ├── main.css
│   ├── modal-standard.css
│   ├── shared-buttons.css
│   ├── profile-hub.css
│   └── ...
├── scripts/                      ⚠️ ROOT LEVEL (needs to move)
│   ├── jquery.min.js
│   ├── auth-client.js
│   ├── login-init.js
│   ├── login-modal.js
│   ├── main.js
│   └── ...
├── assets/                       ⚠️ ROOT LEVEL (newly created)
│   └── images/
│       └── wp4013673.jpg
├── frontend/                     ✅ PROPERLY ORGANIZED
│   ├── index.html               (duplicate of root)
│   ├── agencies.html
│   ├── about.html
│   ├── faq.html
│   ├── guide.html
│   ├── assets/
│   │   └── images/
│   │       └── wp4013673.jpg
│   ├── scripts/
│   │   └── agencies.js
│   └── styles/
│       └── video-ad.css
├── backend/                      ✅ PROPERLY ORGANIZED
│   ├── server.js
│   ├── package.json
│   ├── config/
│   │   ├── passport.js
│   │   └── database.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── reviews.js
│   ├── models/
│   └── middleware/
├── docs/                         ✅ PROPERLY ORGANIZED
│   ├── CLAUDE.md
│   ├── modal-visual-diff.md
│   ├── index-fix.md
│   └── ...
└── backup/                       ✅ PROPERLY ORGANIZED
    └── index-login-modal-restore-20251030/
```

### Problems Identified

1. **Duplicate index.html files**
   - Root: `index.html`
   - Frontend: `frontend/index.html`
   - Both exist, causing confusion

2. **Shared assets at root level**
   - `styles/` at root
   - `scripts/` at root
   - `assets/` at root (newly created)
   - Frontend files at `frontend/`
   - Path inconsistencies cause 404 errors

3. **Server configuration issues**
   - Frontend server needs to know which directory to serve
   - Currently serving from root causes nested path problems

---

## Target Structure (After)

```
Full Codebase/
├── frontend/                     🎯 SINGLE FRONTEND DIRECTORY
│   ├── index.html               (consolidated from root)
│   ├── agencies.html
│   ├── about.html
│   ├── faq.html
│   ├── guide.html
│   ├── news.html
│   ├── report-problem.html
│   ├── share-experience.html
│   ├── tos.html
│   ├── styles/                  (moved from root)
│   │   ├── main.css
│   │   ├── modal-standard.css
│   │   ├── shared-buttons.css
│   │   ├── profile-hub.css
│   │   ├── nav-fix.css
│   │   ├── native-ads.css
│   │   ├── reference-id-badges.css
│   │   ├── support-container.css
│   │   └── video-ad.css
│   ├── scripts/                 (moved from root)
│   │   ├── jquery.min.js
│   │   ├── jquery.dropotron.min.js
│   │   ├── browser.min.js
│   │   ├── breakpoints.min.js
│   │   ├── util.js
│   │   ├── main.js
│   │   ├── auth-client.js
│   │   ├── login-init.js
│   │   ├── login-modal.js
│   │   ├── profile-hub.js
│   │   ├── reference-id-system.js
│   │   ├── native-ads.js
│   │   ├── tos-modal.js
│   │   ├── welcome-banner.js
│   │   ├── agencies.js
│   │   └── video-ad.js
│   ├── assets/                  (merged from root and frontend)
│   │   └── images/
│   │       └── wp4013673.jpg
│   ├── webfonts/               (FontAwesome fonts - to be added)
│   │   ├── fa-solid-900.woff2
│   │   ├── fa-brands-400.woff2
│   │   └── ...
│   └── components/              (templates and reusable components)
│       └── native-ad-templates.html
├── backend/                      ✅ UNCHANGED
│   ├── server.js
│   ├── package.json
│   ├── config/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   └── utils/
├── docs/                         ✅ UNCHANGED
│   ├── CLAUDE.md
│   ├── project-structure.md     (this file)
│   ├── modal-visual-diff.md
│   └── ...
├── backup/                       ✅ UNCHANGED
│   └── [timestamped backups]
└── README.md                     ✅ ROOT LEVEL (documentation)
```

---

## Migration Plan

### Phase 1: Backup ✅ COMPLETED
- [x] Created backup branch: `backup/project-restructure-20251030`
- [x] Git status captured before changes

### Phase 2: Move Files
- [ ] Compare root `index.html` vs `frontend/index.html`
- [ ] Decide which index.html to keep (or merge)
- [ ] Move `styles/` → `frontend/styles/` (merge if conflicts)
- [ ] Move `scripts/` → `frontend/scripts/` (merge if conflicts)
- [ ] Move `assets/` → `frontend/assets/` (merge with existing)

### Phase 3: Update Path References
All HTML files need path updates:

**Old paths (root index.html):**
```html
<link rel="stylesheet" href="styles/main.css" />
<script src="scripts/jquery.min.js"></script>
<img src="assets/images/wp4013673.jpg" />
```

**New paths (after moving to frontend/):**
```html
<link rel="stylesheet" href="styles/main.css" />
<script src="scripts/jquery.min.js"></script>
<img src="assets/images/wp4013673.jpg" />
```
(No change needed if files are in same directory!)

**For backend references:**
- Update server.js static file serving
- Update CORS configuration if needed

### Phase 4: Server Configuration
Update how servers are started:

**Backend (unchanged):**
```bash
cd backend
npm run dev
# Runs on http://localhost:3000
```

**Frontend (updated):**
```bash
cd frontend
python -m http.server 8000
# Runs on http://localhost:8000
```

### Phase 5: Testing
- [ ] Start backend on port 3000
- [ ] Start frontend on port 8000
- [ ] Test all pages load
- [ ] Test all modals work
- [ ] Test login functionality
- [ ] Verify no 404 errors
- [ ] Check browser console for errors

---

## Path Reference Guide

### Frontend Assets (After Migration)

All paths are relative to the HTML file location in `frontend/`:

```html
<!-- CSS -->
<link rel="stylesheet" href="styles/main.css" />
<link rel="stylesheet" href="styles/modal-standard.css" />
<link rel="stylesheet" href="styles/shared-buttons.css" />

<!-- JavaScript -->
<script src="scripts/jquery.min.js"></script>
<script src="scripts/auth-client.js"></script>
<script src="scripts/login-init.js"></script>

<!-- Images -->
<img src="assets/images/wp4013673.jpg" alt="Jamaican Flag" />

<!-- Fonts -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
```

### Backend API Endpoints

```javascript
const API_BASE = 'http://localhost:3000';

// Authentication
fetch(`${API_BASE}/auth/google`);
fetch(`${API_BASE}/auth/status`);

// Reviews
fetch(`${API_BASE}/api/reviews`);
fetch(`${API_BASE}/api/agency-reviews/:agencyId`);
```

---

## Testing Checklist

### Pre-Migration Verification
- [x] All files backed up
- [x] Git branch created
- [x] Current structure documented

### Post-Migration Verification

#### File Integrity
- [ ] No files lost during migration
- [ ] No duplicate files remain
- [ ] All assets copied correctly

#### Frontend Pages (http://localhost:8000/)
- [ ] index.html loads
- [ ] agencies.html loads
- [ ] about.html loads
- [ ] faq.html loads
- [ ] guide.html loads
- [ ] news.html loads
- [ ] report-problem.html loads
- [ ] share-experience.html loads
- [ ] tos.html loads

#### Visual Elements
- [ ] Jamaican flag header image displays
- [ ] All CSS styles load correctly
- [ ] FontAwesome icons display
- [ ] Buttons styled correctly
- [ ] Responsive design works on mobile

#### Functionality
- [ ] Login modal opens
- [ ] Login modal closes (Cancel button)
- [ ] Login modal closes (Escape key)
- [ ] Google login button functional
- [ ] Facebook login button functional
- [ ] Profile hub displays
- [ ] Native ads load
- [ ] Forms submit correctly

#### Backend Integration
- [ ] Backend server running on port 3000
- [ ] CORS allowing frontend requests
- [ ] Authentication endpoints responding
- [ ] Review endpoints responding
- [ ] Database connection active

#### No Errors
- [ ] No 404 errors in browser console
- [ ] No JavaScript errors in console
- [ ] No CSS warnings
- [ ] No broken links

---

## Rollback Procedure

If issues occur during migration:

```bash
# Restore from backup branch
git checkout backup/project-restructure-20251030

# Or restore specific files
git checkout backup/project-restructure-20251030 -- frontend/index.html
```

---

## Maintenance Notes

### Adding New Pages
When creating new HTML pages, place them in `frontend/` and use these paths:

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="styles/main.css" />
  <link rel="stylesheet" href="styles/modal-standard.css" />
</head>
<body>
  <!-- Content -->
  <script src="scripts/jquery.min.js"></script>
  <script src="scripts/main.js"></script>
</body>
</html>
```

### Adding New Assets
- **CSS**: Place in `frontend/styles/`
- **JS**: Place in `frontend/scripts/`
- **Images**: Place in `frontend/assets/images/`
- **Fonts**: Place in `frontend/webfonts/`

### Server Startup Reference

Always start from correct directories:

```bash
# Backend
cd C:\Users\Dewy\OneDrive\Documents\JamWatHQ\Main\Full Development\Full Codebase\backend
npm run dev

# Frontend (new terminal)
cd C:\Users\Dewy\OneDrive\Documents\JamWatHQ\Main\Full Development\Full Codebase\frontend
python -m http.server 8000
```

---

## Future Improvements

1. **Build Process**: Consider adding webpack or vite for bundling
2. **Environment Variables**: Use .env for API endpoints
3. **CDN**: Host static assets on CDN for production
4. **Minification**: Minify CSS and JS for production
5. **Testing**: Add automated tests for frontend and backend

---

**Status**: Ready for migration execution
**Last Updated**: 2025-10-30
**Maintained By**: Development Team
