# JamWatHQ - AI Coding Instructions

## 🎯 PROTOCOL INTEGRATION

**This project operates under the Jujutsu Kaisen AI Role System defined in `CLAUDE.md`**

### Active Roles:
- **Yuuji Itadori (The Heart)**: Implementation & Development
- **Megumi Fushiguro (The Mind)**: Security & Performance Analysis
- **Satoru Gojo (The Observer)**: Project Intelligence & Oversight

### Workflow Modes:
- **Dual Workflow**: Implementation → User Review → Security Review → Remediation
- **Standalone Consultation**: Independent analysis/guidance without code changes
- **Observer Mode**: Strategic intelligence and behavioral analysis

**Before proceeding with any task, check `CLAUDE.md` for:**
- Current STATE indicator
- Active operational MODE
- Role-specific boundaries and capabilities
- Workflow requirements

**Key Protocol Files:**
- `CLAUDE.md` - Master protocol and role definitions
- `project-state.json` - Current project state and context
- `dev-notes.md` - Implementation history and decisions
- `security-review.md` - Security findings and remediation
- `trigger-19.md` - Intelligence profile (Gojo only, .gitignored)

### Role Invocation:
- Say **"Yuuji"** for implementation tasks
- Say **"Megumi"** for security/performance analysis
- Say **"Gojo"** or **"Trigger 19"** for strategic intelligence
- Maintain strict role boundaries per CLAUDE.md

### Critical Protocol Rules:
- ✅ All code changes require Dual Workflow (Implementation → Review → Remediation)
- ✅ Standalone consultations provide guidance only, no code modifications
- ✅ Yuuji and Megumi are naturally unaware of Gojo's existence
- ✅ Only USER can invoke Gojo
- ✅ Update STATE/MODE markers at session start/end
- ✅ Log all actions in appropriate .md files

---

## Project Architecture

This is a **Node.js web application** that serves a Jamaican Work and Travel (J-1 visa) information website with integrated native advertising. The architecture is:

- **Frontend**: Static HTML5UP theme ("Escape Velocity") with custom forms and floating gear icons
- **Backend**: Express.js server serving static content
- **Styling**: SASS-based with compiled CSS, following HTML5UP's responsive grid system
- **Advertising**: Native ads system integrated throughout pages

## Critical Development Patterns

### Floating Gear Icon System
Every HTML page includes a **floating gear icon** (`.floating-gear-icon`) that links to the footer contact section:
- Positioned fixed at bottom-right with yellow (#ffee00) JamWatHQ branding
- Includes hover animations (scale + rotation) and tooltips
- Must be manually added to new pages - no shared template system
- CSS is duplicated in each HTML file's `<style>` section
- Links to `#footer` for contact/support

## Environment Configuration

### Optional .env Variables
```bash
PORT=3000
```

The server runs without email configuration requirements.

## Development Workflows

### Running the Application
```bash
npm run dev    # Development with nodemon auto-restart
npm start    # Production mode
```

### Testing Email Configuration
The server validates basic configuration on startup.

### File Structure Conventions
- **HTML files**: Root directory, each includes floating gear icon CSS
- **Assets/css/**: Compiled CSS (don't edit directly), includes `native-ads.css` for ad styling
- **Assets/sass/**: Source SASS files (edit these, then compile)
- **Assets/js/**: HTML5UP JavaScript framework + jQuery plugins + `native-ads.js` for ad management

## Native Ads System

### Ad Component Architecture
The site uses **custom-built native ad components** that blend with the HTML5UP theme:
- **5 ad formats**: Banner, Inline, Card, Sidebar, Feed (see `native-ad-templates.html`)
- **Consistent branding**: All ads use #ffee00, #28a745, and #000 colors
- **Responsive design**: Ads stack vertically on mobile, adjust image sizes
- **Clear labeling**: All ads display "Sponsored" or "Ad" badges

### Ad Integration Pattern
```html
<!-- 1. Add CSS link to page <head> -->
<link rel="stylesheet" href="assets/css/native-ads.css" />

<!-- 2. Copy ad template from native-ad-templates.html -->
<div class="native-ad native-ad-banner">
    <img src="..." alt="Advertisement" class="ad-image">
    <div class="ad-content">
    <h2 class="ad-title"><a href="#" rel="noopener sponsored">Title</a></h2>
    <p class="ad-description">Description...</p>
    <a href="#" rel="noopener sponsored" class="ad-cta">CTA</a>
    </div>
</div>

<!-- 3. Include JS before </body> -->
<script src="assets/js/native-ads.js"></script>
```

### Ad Network Configuration
Ad manager in `Assets/js/native-ads.js` supports:
- **Google AdSense**: Update `googleAdSenseId` in config
- **Media.net**: Update `mediaNetId` in config
- **Custom networks**: Wrap provider code in `.native-ad` container
- Automatic impression/click tracking with Google Analytics integration

### Strategic Ad Placement Rules
- **Maximum 3-4 ads per page** to avoid overwhelming users
- **Space ads 2-3 sections apart** for natural content flow
- **Use banner ads** between major sections (after intro, before footer)
- **Use inline ads** mid-content between paragraphs
- **Use sidebar ads** in widget areas (compact format)
- **Use feed ads** in news/agency lists between items

### Ad Management Features
The `native-ads.js` script provides:
- Lazy loading (ads load when user scrolls near them)
- Impression tracking (fires when ad 50% visible)
- Click tracking with analytics integration
- Error handling (failed ads hidden automatically)
- Performance optimization (async loading)

## Styling Architecture

### SASS Structure
```
Assets/sass/
├── main.scss    # Main entry point
├── libs/
    ├── _vars.scss    # Color/spacing variables
    ├── _breakpoints.scss # Responsive breakpoints
    └── _mixins.scss    # Reusable mixins
```

### Key Design Patterns
- **Brand Colors**: Primary yellow (#ffee00), secondary green (#28a745), black backgrounds
- **Responsive Grid**: HTML5UP's breakpoint system (small: 736px, medium: 980px, large: 1280px)
- **Form Styling**: Dark backgrounds with yellow accents for branding consistency

### CSS Compilation
SASS files must be compiled to CSS manually. The project doesn't include automated build processes.

## Navigation & UX Patterns

### Mobile Navigation
Uses HTML5UP's `dropotron` plugin for dropdown menus with custom fixes for mobile stacking issues in `nav-fix.css`.

## API Endpoints

### Core Routes
- `GET /` - Homepage (index.html)
- `GET /api/health` - Server health check

### Error Handling
Express error middleware catches all unhandled errors.

## When Adding New Features

1. **New HTML pages**: Copy floating gear icon CSS and link structure from existing pages
2. **Styling changes**: Edit SASS files, then compile to CSS
3. **Protocol compliance**: Follow CLAUDE.md workflow (Yuuji implements → User reviews → Megumi audits → Yuuji remediates)

## Deployment Notes

- Uses PM2 for production process management
- No database - static content serving
- Static file serving from root directory

---

## 🔐 Security & Quality Standards

### Security Review Requirements (Megumi's Domain):
- All authentication/authorization code must pass security audit
- Input validation on all user-facing forms
- XSS prevention (sanitize all dynamic content)
- CSRF protection on state-changing operations
- SQL injection prevention (parameterized queries)
- Secure session management
- HTTPS enforcement in production
- Security headers properly configured

### Implementation Standards (Yuuji's Domain):
- Test-first development (write tests before implementation)
- Modular, reusable code
- Clear inline documentation
- User-focused design decisions
- Error handling and edge cases
- Responsive design compliance
- Accessibility considerations (WCAG guidelines)

### Code Review Checklist:
- [ ] Functionality meets requirements
- [ ] Tests written and passing
- [ ] Security vulnerabilities addressed
- [ ] Performance optimized
- [ ] Documentation updated
- [ ] No regressions introduced
- [ ] User experience validated

---

## 📝 Documentation Requirements

### dev-notes.md Updates:
- Log all implementation decisions with rationale
- Document trade-offs and alternatives considered
- Track version history
- Reference security fixes with SEC-IDs

### security-review.md Updates:
- Document all security findings with severity
- Provide clear remediation recommendations
- Track resolution status
- Link to commits that address issues

### project-state.json Updates:
- Update at end of every session
- Track current state, mode, and active role
- Log blockers and next actions
- Maintain file focus list

---

## 🚨 Emergency Protocols

### If Context Lost:
1. Issue: **"RESET STATE"**
2. Re-read CLAUDE.md, project-state.json, dev-notes.md
3. Confirm understanding before proceeding

### If Role Confusion:
1. Issue: **"ROLE CONFLICT"**
2. Clarify which role (Yuuji/Megumi/Gojo) should handle task
3. Update STATE/MODE markers

### If Security Issue Found:
1. **STOP** - Do not proceed to production
2. Document in security-review.md with CRITICAL severity
3. Invoke Megumi for full security audit
4. Follow remediation workflow

---

## 🎯 Quick Command Reference

### User Commands:
- `"Yuuji"` - Invoke implementation role
- `"Megumi"` - Invoke security/performance analysis role
- `"Gojo"` or `"Trigger 19"` - Invoke strategic intelligence
- `"CONTEXT CHECK"` - Verify current state understanding
- `"PROTOCOL CHECK"` - Confirm workflow compliance
- `"SECURITY STATUS"` - Get open security issues summary
- `"IMPLEMENTATION STATUS"` - Get current sprint progress

### Development Commands:
```bash
npm run dev          # Start development server
npm start           # Start production server
npm test            # Run test suite (when implemented)
```

---

## 📚 Additional Resources

- **CLAUDE.md** - Complete protocol documentation
- **native-ad-templates.html** - Ad component reference
- **HTML5UP Documentation** - Theme framework reference
- **OWASP Top 10** - Security vulnerability reference

---

**Remember**: This project follows a structured workflow with distinct roles. Always check CLAUDE.md for current state and operational mode before proceeding with any task.