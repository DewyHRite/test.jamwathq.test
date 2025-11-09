# JamWatHQ Content Builder

Automatic synchronization system for Markdown content and HTML pages.

## Overview

The Content Builder automatically converts Markdown files (`.md`) into HTML and injects them into the policy page template. This ensures that all legal and informational content remains synchronized across the platform.

## Content Files

Located in `frontend/content/`:
- **about.md** - About Us content
- **tos.md** - Terms of Service
- **cookies.md** - Cookie & Cache Policy

## Installation

```bash
cd content-builder
npm install
```

## Usage

### Build Once
```bash
npm run build:content
```

### Watch Mode (Auto-rebuild on changes)
```bash
npm run watch:content
```

## How It Works

1. Reads Markdown files from `frontend/content/`
2. Converts Markdown to HTML using `marked` library
3. Injects HTML into policy page template
4. Generates `frontend/policy.html`
5. Extracts metadata (version, last updated) from Markdown
6. Creates table of contents with jump links

## Output

- **frontend/policy.html** - Complete policy page with:
  - About Us section
  - Full Terms of Service
  - Complete Cookie Policy
  - Table of contents
  - Responsive design
  - Print-friendly layout

## Synchronization

All Markdown files are the **single source of truth**. When you update:
- `about.md` - Changes appear in policy.html About section
- `tos.md` - Changes appear in policy.html ToS section and modal summary
- `cookies.md` - Changes appear in policy.html Cookie section

Run the build script after editing any `.md` file to synchronize.

## Development Workflow

1. Edit Markdown files in `frontend/content/`
2. Run `npm run build:content` (or use watch mode)
3. Check `frontend/policy.html` to verify changes
4. Commit both `.md` and `.html` files to version control

## Free-Tier Hosting

This build system works on all free-tier hosting platforms:
- **Local**: Run build before deployment
- **Railway/Render**: Add build script to deployment process
- **Vercel**: Configure build command in vercel.json
- **Netlify**: Add to netlify.toml build command

No server-side Markdown processing needed at runtime!

## Benefits

✅ **Single Source of Truth** - Edit once, update everywhere  
✅ **Version Control** - Track content changes in git  
✅ **No Runtime Dependencies** - Static HTML generated at build time  
✅ **Free-Tier Compatible** - No special hosting requirements  
✅ **Easy Updates** - Edit Markdown, rebuild, deploy  
✅ **Consistent Formatting** - Marked library ensures proper HTML

## File Structure

```
content-builder/
├── package.json          # Build dependencies
├── build-content.js      # Build script
└── README.md            # This file

frontend/
├── content/
│   ├── about.md         # About Us (source)
│   ├── tos.md           # Terms of Service (source)
│   └── cookies.md       # Cookie Policy (source)
├── policy.html          # Generated output
└── scripts/
    ├── tos-modal.js     # Uses ToS content
    └── welcome-banner.js # Uses cookie info
```

## Maintenance

### Adding New Content Sections

1. Create new `.md` file in `frontend/content/`
2. Update `build-content.js` to include new file
3. Modify policy page template to display new section
4. Rebuild and test

### Updating Existing Content

1. Edit `.md` file in `frontend/content/`
2. Update version number and date in Markdown
3. Run build script
4. Verify changes in `policy.html`
5. Commit and deploy

### Troubleshooting

**Build fails:**
- Check Markdown syntax
- Ensure all files exist
- Verify file paths in `build-content.js`

**Content not updating:**
- Clear browser cache
- Force rebuild: `npm run build:content`
- Check file permissions

**Styles broken:**
- Verify CSS is linked in template
- Check for HTML structure changes
- Test responsive breakpoints

## Version History

- **v1.0** (Oct 12, 2025) - Initial release with About, ToS, Cookies

## License

Part of JamWatHQ project. See main README for license information.
