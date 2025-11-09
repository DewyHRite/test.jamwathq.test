# 🎯 Native Ads Quick Reference Card

## 📋 3-Step Setup

### 1. Add to HTML `<head>`:
```html
<link rel="stylesheet" href="assets/css/native-ads.css" />
```

### 2. Add before `</body>`:
```html
<script src="assets/js/native-ads.js"></script>
```

### 3. Copy template from `native-ad-templates.html`

---

## 🎨 Ad Format Chooser

| Format | Best For | Layout | Size |
|--------|----------|--------|------|
| **Banner** | Top of page, between sections | Horizontal | Full width |
| **Inline** | Between paragraphs | Horizontal | Full width |
| **Card** | Sidebar, grid | Vertical | 300px+ |
| **Sidebar** | Widgets | Vertical | 300px |
| **Feed** | News lists | Horizontal | Full width |

---

## 💰 Ad Network Setup

### Google AdSense
1. Sign up: https://www.google.com/adsense
2. Get ID: `ca-pub-XXXXXXXXXXXXXXXX`
3. Update `Assets/js/native-ads.js` line 10
4. Add ad unit HTML from `native-ad-templates.html`

### Media.net
1. Sign up: https://www.media.net
2. Get Site ID and Ad Unit ID
3. Add script tag to `<head>`
4. Use templates from `native-ad-templates.html`

---

## 📍 Recommended Placements

### Per Page Limits
- **Maximum:** 3-4 ads per page
- **Minimum spacing:** 2-3 sections apart
- **Above fold:** Only 1 ad

### Homepage
- ✅ Banner after intro
- ✅ Inline in overview section
- Sidebar (if added)

### Content Pages
- Banner at top
- Inline mid-content
- Card/sidebar in widgets
- Feed between items

---

## 🎨 Brand Colors

```css
Yellow:  #ffee00  (Primary - Borders, titles, CTAs)
Green:   #28a745  (Secondary - Hover, accents)
Black:   #000000  (Background)
White:   #ffffff  (Text)
```

---

## 📊 Tracking Events

### Console Logs
```
🎯 Native Ads Manager Initialized
👁️ Ad impression: [format]
🖱️ Ad clicked: [format] ([index])
```

### Google Analytics
```javascript
// Click events
gtag('event', 'ad_click', {
  'event_category': 'Native Ads',
  'event_label': 'banner',
  'value': 0
});

// Impression events
gtag('event', 'ad_impression', {
  'event_category': 'Native Ads',
  'event_label': 'inline'
});
```

---

## 🔧 Common Issues

### Ads not showing?
1. Check console (F12) for errors
2. Verify CSS/JS files loaded
3. Check file paths
4. Disable ad blocker

### Styling issues?
1. Clear browser cache
2. Check for CSS conflicts
3. Verify responsive breakpoints

### Tracking not working?
1. Check console for init message
2. Verify JS is loaded
3. Test with dev tools

---

## 📱 Responsive Breakpoints

```
Desktop:  > 980px  (Horizontal layouts)
Tablet:   737-980px (Stack vertically)
Mobile:   < 736px  (Full vertical, optimized)
```

---

## ✅ Quick Checklist

Before going live:
- [ ] CSS file linked on all pages
- [ ] JS file added before `</body>`
- [ ] Ad network IDs configured
- [ ] Tested on desktop
- [ ] Tested on mobile
- [ ] Ad density is reasonable (3-4 max)
- [ ] All links have `rel="noopener sponsored"`
- [ ] "Sponsored" labels visible
- [ ] Console shows no errors

---

## 📖 Full Documentation

- **NATIVE_ADS_GUIDE.md** - Complete setup guide
- **native-ad-templates.html** - All templates
- **native-ads-demo.html** - Visual examples
- **IMPLEMENTATION_SUMMARY.md** - What was built

---

## 🚀 File Locations

```
Assets/
  css/native-ads.css          ← Styling
  js/native-ads.js            ← Management & tracking

native-ad-templates.html      ← Copy templates
native-ads-demo.html          ← View examples
NATIVE_ADS_GUIDE.md          ← Full guide
```

---

## 💡 Pro Tips

✅ Start with 2-3 ads per page
✅ Use relevant images (800x600px min)
✅ Test on actual devices
✅ Monitor page speed
✅ A/B test placements
✅ Don't click your own ads!

---

**Questions?** → Check `NATIVE_ADS_GUIDE.md`
**Examples?** → Open `native-ads-demo.html`
**Templates?** → Copy from `native-ad-templates.html`

---

🎉 **You're ready to monetize!**
