---
description: Repository Information Overview
alwaysApply: true
---

# JamWatHQ Website Information

## Summary
JamWatHQ is a website project that serves as an information hub for Jamaican J1 students participating in work and travel programs. The site provides resources, guidance, and official links to help students navigate their J1 experience safely and confidently.

## Structure
- **Assets/**: Contains all frontend resources
  - **css/**: CSS stylesheets including main styling and custom fixes
  - **js/**: JavaScript files for site functionality
  - **sass/**: SASS source files for CSS generation
  - **webfonts/**: Font files for the website
- **Root**: Contains HTML pages for the website

## Language & Runtime
**Language**: HTML, CSS, JavaScript, SASS
**Framework**: Based on "Escape Velocity" template by HTML5 UP
**Build System**: Manual CSS compilation from SASS

## Dependencies
**Main Dependencies**:
- jQuery (Assets/js/jquery.min.js)
- Font Awesome (Assets/css/fontawesome-all.min.css)
- Google Fonts (Source Sans Pro)

**Frontend Libraries**:
- jQuery Dropotron (Assets/js/jquery.dropotron.min.js) - For dropdown menus
- Breakpoints.js (Assets/js/breakpoints.min.js) - For responsive design
- Browser.js (Assets/js/browser.min.js) - For browser compatibility

## Build & Installation
The website appears to be a static HTML site that doesn't require a build process. Files can be deployed directly to a web server.

```bash
# To serve the site locally with a simple HTTP server (if Python is installed)
python -m http.server
```

## Main Files & Resources
**Entry Point**: index.html - Main landing page for the website
**Key HTML Pages**:
- index.html - Homepage with introduction and program overview
- Sample index.html - Template or alternative version of the homepage

**CSS Structure**:
- main.css - Primary stylesheet compiled from SASS
- nav-fix.css - Custom fixes for navigation
- desktop-nav-fix.css - Desktop-specific navigation fixes
- header-layout.css - Header styling

**JavaScript Structure**:
- main.js - Primary JavaScript for site functionality
- util.js - Utility functions
- jquery.dropotron.min.js - Dropdown menu functionality

## Project Features
- Responsive design with breakpoints for different screen sizes
- Dropdown navigation menus
- Styled sections for content organization
- Contact form
- External links to official J1 program resources
- Information sections about the J1 program, agencies, and eligibility