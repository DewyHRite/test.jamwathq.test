# Native Ads Implementation Guide - JamWatHQ

## 🎯 Overview

This guide covers the complete implementation of native ads for JamWatHQ. The ads are designed to blend seamlessly with your HTML5UP Escape Velocity theme while maintaining the distinct JamWatHQ branding (#ffee00 yellow, #28a745 green, #000 black).

## 📁 Files Created

1. **Assets/css/native-ads.css** - Complete styling for all ad formats
2. **Assets/js/native-ads.js** - Ad management, tracking, and loading
3. **native-ad-templates.html** - Copy-paste templates for all ad types
4. **index.html** - Updated with integrated ads (example)

## 🚀 Quick Start

### Step 1: Add CSS to Your Pages

Add this link in the `<head>` section of all pages where you want ads:

```html
<link rel="stylesheet" href="assets/css/native-ads.css" />
```

### Step 2: Add JavaScript Before Closing `</body>`

```html
<script src="assets/js/native-ads.js"></script>
```

### Step 3: Copy Ad Templates

Open `native-ad-templates.html` and copy the ad format you need into your page.

## 🎨 Available Ad Formats

### 1. Banner Ad (Full Width)
**Best for:** Top of page, between major sections
```html
<div class="native-ad native-ad-banner">
	<img src="your-image.jpg" alt="Advertisement" class="ad-image">
	<div class="ad-content">
		<h2 class="ad-title">
			<a href="#" target="_blank" rel="noopener sponsored">Ad Title</a>
		</h2>
		<p class="ad-description">Ad description...</p>
		<a href="#" target="_blank" rel="noopener sponsored" class="ad-cta">Call to Action</a>
	</div>
</div>
```

### 2. Inline Ad
**Best for:** Between paragraphs, mid-content
```html
<div class="native-ad native-ad-inline">
	<img src="your-image.jpg" alt="Advertisement" class="ad-image">
	<div class="ad-content">
		<h3 class="ad-title">
			<a href="#" target="_blank" rel="noopener sponsored">Ad Title</a>
		</h3>
		<p class="ad-description">Ad description...</p>
		<a href="#" target="_blank" rel="noopener sponsored" class="ad-cta">Call to Action</a>
	</div>
</div>
```

### 3. Card Ad
**Best for:** Sidebar, grid layouts
```html
<div class="native-ad native-ad-card">
	<img src="your-image.jpg" alt="Advertisement" class="ad-image">
	<div class="ad-content">
		<h3 class="ad-title">
			<a href="#" target="_blank" rel="noopener sponsored">Ad Title</a>
		</h3>
		<p class="ad-description">Ad description...</p>
		<a href="#" target="_blank" rel="noopener sponsored" class="ad-cta">Call to Action</a>
	</div>
</div>
```

### 4. Sidebar Ad (Compact)
**Best for:** Sidebar widgets
```html
<div class="native-ad native-ad-sidebar">
	<img src="your-image.jpg" alt="Advertisement" class="ad-image">
	<h3 class="ad-title">
		<a href="#" target="_blank" rel="noopener sponsored">Ad Title</a>
	</h3>
	<p class="ad-description">Ad description...</p>
	<a href="#" target="_blank" rel="noopener sponsored" class="ad-cta">Call to Action</a>
</div>
```

### 5. Feed/List Ad
**Best for:** News feeds, article lists
```html
<div class="native-ad native-ad-feed">
	<img src="your-image.jpg" alt="Advertisement" class="ad-image">
	<div class="ad-content">
		<h3 class="ad-title">
			<a href="#" target="_blank" rel="noopener sponsored">Ad Title</a>
		</h3>
		<p class="ad-description">Ad description...</p>
	</div>
</div>
```

## 💰 Integrating Ad Networks

### Google AdSense Setup

1. **Sign up for Google AdSense** at https://www.google.com/adsense
2. **Get your Publisher ID** (format: ca-pub-XXXXXXXXXXXXXXXX)
3. **Update the ad manager** in `Assets/js/native-ads.js`:

```javascript
const AdManager = {
	config: {
		googleAdSenseId: 'ca-pub-YOUR-ACTUAL-ID-HERE',
		// ... rest of config
	},
```

4. **Add AdSense ad unit to your page:**

```html
<div class="adsense-native">
	<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR-ID"
		crossorigin="anonymous"></script>
	<ins class="adsbygoogle"
		style="display:block"
		data-ad-client="ca-pub-YOUR-ID"
		data-ad-slot="YOUR-AD-SLOT-ID"
		data-ad-format="fluid"
		data-full-width-responsive="true"></ins>
	<script>
		(adsbygoogle = window.adsbygoogle || []).push({});
	</script>
</div>
```

### Media.net Setup

1. **Sign up at** https://www.media.net
2. **Get your Site ID and Ad Unit ID**
3. **Add Media.net script** to your page `<head>`:

```html
<script type="text/javascript">
	window._mNHandle = window._mNHandle || {};
	window._mNHandle.queue = window._mNHandle.queue || [];
	medianet_versionId = "3121199";
</script>
<script src="https://contextual.media.net/dmjs/v2/YOUR-SITE-ID.js" async="async"></script>
```

4. **Add Media.net ad unit:**

```html
<div class="native-ad" style="min-height: 250px;">
	<div id="YOUR-AD-UNIT-ID">
		<script type="text/javascript">
			try {
				window._mNHandle.queue.push(function (){
					window._mNDetails.loadTag("YOUR-AD-UNIT-ID", "300x250", "YOUR-AD-UNIT-ID");
				});
			}
			catch (error) {}
		</script>
	</div>
</div>
```

### Other Ad Networks

The system supports any ad network that provides HTML/JavaScript code:
- **Ezoic**
- **PropellerAds**
- **AdThrive**
- **Mediavine**

Simply wrap their ad code in the `.native-ad` container for consistent styling.

## 📍 Strategic Ad Placement

### Homepage (index.html)
✅ Already implemented:
- Banner ad after introduction section
- Inline ad in J-1 Program Overview section

Suggested additional placements:
- Sidebar ad in right column (if you add a sidebar)
- Feed ad at the bottom before footer

### FAQ Page (faq.html)
Recommended placements:
- **Top:** Banner ad
- **Middle:** Inline ad between Q&A sections
- **Sidebar:** Card/sidebar ads in a side column

### Agency List (agencies.html)
Recommended placements:
- **Top:** Banner ad
- **Between agencies:** Feed ads every 5-7 agency listings
- **Sidebar:** Sidebar ads with relevant services

### Guide Page (guide.html)
Recommended placements:
- **Top:** Banner ad
- **In-content:** Inline ads between sections
- **Bottom:** Card ad grid (2-3 cards)

### News Page (news.html)
Recommended placements:
- **Between articles:** Feed ads
- **Sidebar:** Multiple sidebar ads
- **Bottom:** Banner ad

## 🎯 Best Practices

### Ad Density
- **Don't overdo it:** Maximum 3-4 ads per page
- **Space them out:** At least 2-3 sections between ads
- **Above the fold:** Maximum 1 ad in initial viewport

### SEO & Performance
- All ads use `rel="noopener sponsored"` for proper attribution
- JavaScript loads asynchronously
- Images are lazy-loaded when possible
- Ads don't block page rendering

### User Experience
- Ads clearly labeled as "Sponsored" or "Ad"
- Match site branding and design
- Hover effects for better interaction
- Responsive on all devices

### Mobile Optimization
- Ads stack vertically on mobile
- Reduced padding and font sizes
- Images resize appropriately
- No horizontal scrolling

## 📊 Ad Tracking & Analytics

The `native-ads.js` script includes built-in tracking:

### Click Tracking
Automatically tracks all ad clicks and logs them:
```javascript
console.log('🖱️ Ad clicked: banner (0)');
```

### Impression Tracking
Tracks when ads are 50% visible in viewport:
```javascript
console.log('👁️ Ad impression: inline');
```

### Google Analytics Integration
If you have Google Analytics:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

Events are automatically sent:
- `ad_click` - When user clicks an ad
- `ad_impression` - When ad becomes visible

### Custom Analytics Endpoint
To send data to your own server, uncomment and configure in `native-ads.js`:

```javascript
sendAnalytics: function(eventType, data) {
	fetch('/api/ad-analytics', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			event: eventType,
			data: data
		})
	});
}
```

## 🛠️ Customization

### Changing Colors
Edit `Assets/css/native-ads.css`:

```css
/* Change yellow accent */
.native-ad {
	border-color: #YOUR-COLOR;
}

/* Change green hover */
.native-ad:hover {
	border-color: #YOUR-COLOR;
}
```

### Adding New Ad Formats
1. Create CSS class in `native-ads.css`
2. Add HTML template to `native-ad-templates.html`
3. Document usage in this guide

### Lazy Loading Ads
Add `data-lazy="true"` to any ad container:

```html
<div class="native-ad native-ad-card" data-lazy="true">
	<!-- Ad content -->
</div>
```

The ad will only load when user scrolls near it.

## 🔧 Troubleshooting

### Ads Not Showing
1. Check browser console for errors
2. Verify CSS file is loaded: `assets/css/native-ads.css`
3. Verify JS file is loaded: `assets/js/native-ads.js`
4. Check ad blocker is disabled for testing

### AdSense Not Loading
1. Verify Publisher ID is correct
2. Check AdSense account is approved
3. Wait 24-48 hours after first setup
4. Check browser console for specific errors

### Styling Issues
1. Clear browser cache
2. Check for CSS conflicts with main.css
3. Verify responsive breakpoints in dev tools
4. Test on multiple devices

### Performance Issues
1. Enable lazy loading for ads
2. Limit ads per page (max 3-4)
3. Use responsive images
4. Optimize image file sizes

## 📝 Compliance & Legal

### Required Disclosures
- All ads are labeled "Sponsored" or "Ad"
- Links include `rel="noopener sponsored"` attribute
- Clear visual distinction from content

### Privacy & GDPR
If using ad networks that track users:
1. Add privacy policy
2. Implement cookie consent
3. Disclose data collection
4. Provide opt-out options

### Ad Network Policies
- Follow Google AdSense program policies
- Don't click your own ads
- Don't encourage clicks ("Click here")
- Maintain ad quality standards

## 🚀 Next Steps

1. **Test the implementation:**
   - Open index.html in a browser
   - Check all ad formats display correctly
   - Test on mobile devices

2. **Set up ad network:**
   - Apply for Google AdSense or Media.net
   - Get your Publisher IDs
   - Update configuration in `native-ads.js`

3. **Add ads to other pages:**
   - Copy templates from `native-ad-templates.html`
   - Follow strategic placement guidelines
   - Test each page thoroughly

4. **Monitor performance:**
   - Track click-through rates
   - Monitor page load times
   - Adjust placement based on data
   - A/B test different formats

## 📞 Support

For questions or issues:
- Check browser console for errors
- Review `native-ad-templates.html` for examples
- Test with ad blocker disabled
- Verify all file paths are correct

## 📄 License

These native ad components are part of the JamWatHQ project and follow the same license as the HTML5UP Escape Velocity theme (CCA 3.0).

---

**Good luck with your ads implementation!** 🎉
