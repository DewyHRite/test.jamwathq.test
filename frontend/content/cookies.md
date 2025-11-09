# Cookie & Cache Policy

**Last Updated:** October 12, 2025  
**Effective Date:** October 12, 2025

---

## Introduction

This Cookie Policy explains how **JamWatHQ** ("we," "us," or "our") uses cookies, cache, and similar tracking technologies when you visit our website at jamwathq.com (the "Site").

This policy should be read alongside our [Terms of Service](./tos.md) and forms part of our commitment to transparency about how we collect and use your information.

---

## What Are Cookies?

**Cookies** are small text files that are placed on your computer or mobile device when you visit a website. Cookies are widely used to make websites work more efficiently, provide a better user experience, and supply information to website owners.

### Types of Cookies

#### Session Cookies
Temporary cookies that are erased when you close your browser. These are essential for maintaining your logged-in state during your visit.

#### Persistent Cookies
Cookies that remain on your device after you close your browser. These remember your preferences for future visits.

#### First-Party Cookies
Cookies set by JamWatHQ directly.

#### Third-Party Cookies
Cookies set by external services like advertising networks or analytics providers.

---

## What Is Browser Cache?

**Browser cache** is a temporary storage location on your computer where your browser saves copies of web pages, images, and other media files. This allows pages to load faster on repeat visits.

JamWatHQ uses standard browser caching for:
- Static assets (images, CSS stylesheets, JavaScript files)
- Font files
- Page content that doesn't change frequently

### How Cache Works

1. **First Visit**: Your browser downloads and stores files locally
2. **Repeat Visits**: Browser loads stored files instead of downloading again
3. **Faster Performance**: Pages load significantly faster
4. **Automatic Management**: Your browser manages cache size and expiration

---

## Cookies We Use

### 1. Essential Cookies (Strictly Necessary)

These cookies are **required** for the Site to function and cannot be switched off. Without these cookies, you won't be able to log in or submit reviews.

#### Session Cookie
- **Name**: `connect.sid`
- **Purpose**: Maintains your logged-in state across page visits
- **Type**: First-party, session cookie
- **Storage Location**: MongoDB backend
- **Duration**: 24 hours of inactivity OR until you log out
- **Data Stored**:
  - Session ID (random identifier)
  - User authentication status
  - CSRF token for security
  - Last activity timestamp
- **Flags**: Secure, HttpOnly, SameSite=strict
- **Can be disabled?**: ❌ No - Required for login functionality

**Why we need this:** Without session cookies, the Site couldn't remember that you're logged in, and you'd have to re-authenticate on every page.

#### CSRF Protection Cookie
- **Name**: `_csrf`
- **Purpose**: Prevents cross-site request forgery attacks
- **Type**: First-party, session cookie
- **Duration**: Same as session cookie (24 hours or logout)
- **Data Stored**: Random security token
- **Flags**: HttpOnly, Secure
- **Can be disabled?**: ❌ No - Required for security

**Why we need this:** This cookie protects you from malicious websites that might try to perform actions on your behalf without your knowledge.

---

### 2. Consent & Preference Cookies

These cookies remember your choices and preferences.

#### Terms of Service Acceptance
- **Storage Method**: localStorage (not a cookie)
- **Key**: `jamwathq_tos_accepted`
- **Purpose**: Records that you've accepted our Terms of Service
- **Data Stored**: Boolean (true/false) and timestamp
- **Duration**: Persists until manually cleared
- **Can be disabled?**: ⚠️ Yes, but you'll see the ToS prompt on every visit

#### Cookie Policy Acknowledgment
- **Storage Method**: localStorage (not a cookie)
- **Key**: `jamwathq_cookies_acknowledged`
- **Purpose**: Records that you've read our cookie notice
- **Data Stored**: Boolean (true/false) and timestamp
- **Duration**: Persists until manually cleared
- **Can be disabled?**: ⚠️ Yes, but you'll see the notice again

#### Banner Dismissal
- **Storage Method**: localStorage (not a cookie)
- **Key**: `jamwathq_banner_dismissed`
- **Purpose**: Remembers that you've dismissed the "Hello Molly" welcome banner
- **Data Stored**: Boolean (true/false)
- **Duration**: Persists until manually cleared
- **Can be disabled?**: ✅ Yes - Banner reappears on next visit

---

### 3. Third-Party Cookies (Optional)

These cookies are set by external services we use. You can control these through your browser settings or opt-out mechanisms provided by the third parties.

#### Advertising Cookies (When Active)

**Google AdSense**
- **Provider**: Google LLC
- **Purpose**: 
  - Display relevant advertisements
  - Measure ad performance
  - Prevent ad fraud
  - Frequency capping (limit how often you see the same ad)
- **Data Collected**: 
  - Ad viewing history
  - Click behavior
  - Device information
  - Approximate location (based on IP address)
- **Duration**: Varies (up to 2 years)
- **Privacy Policy**: [Google Privacy Policy](https://policies.google.com/privacy)
- **Opt-Out**: [Google Ad Settings](https://adssettings.google.com/)
- **Can be disabled?**: ✅ Yes

**Media.net** (If Configured)
- **Provider**: Media.net Advertising FZ-LLC
- **Purpose**: Alternative ad network for displaying relevant ads
- **Data Collected**: Similar to Google AdSense
- **Privacy Policy**: [Media.net Privacy Policy](https://www.media.net/privacy-policy)
- **Can be disabled?**: ✅ Yes

#### Analytics Cookies (If Enabled)

**Google Analytics** (When Active)
- **Provider**: Google LLC
- **Purpose**: 
  - Understand how visitors use the Site
  - Track page views, session duration, bounce rate
  - Identify popular content
  - Improve user experience
- **Cookies Used**:
  - `_ga` - Distinguishes users (2 years)
  - `_gid` - Distinguishes users (24 hours)
  - `_gat` - Throttles request rate (1 minute)
- **Data Collected**:
  - Page views and navigation paths
  - Time spent on pages
  - Device and browser information
  - Approximate location (city-level)
  - Referral source
- **Privacy Policy**: [Google Analytics Privacy](https://support.google.com/analytics/answer/6004245)
- **Opt-Out**: [Google Analytics Opt-Out](https://tools.google.com/dlpage/gaoptout)
- **Can be disabled?**: ✅ Yes

**Important**: We use Google Analytics with **IP anonymization enabled**, which masks part of your IP address before it's stored.

#### OAuth Authentication Cookies

**Google OAuth**
- **Provider**: Google LLC
- **Purpose**: Enable "Sign in with Google" functionality
- **Cookies**: Set by accounts.google.com during login
- **Duration**: Managed by Google
- **Privacy Policy**: [Google Privacy Policy](https://policies.google.com/privacy)

**Facebook OAuth**
- **Provider**: Meta Platforms, Inc.
- **Purpose**: Enable "Sign in with Facebook" functionality
- **Cookies**: Set by facebook.com during login
- **Duration**: Managed by Facebook
- **Privacy Policy**: [Facebook Privacy Policy](https://www.facebook.com/privacy/explanation)

**Note**: We only use OAuth for authentication. We don't use Facebook or Google tracking pixels elsewhere on the Site.

---

## How We Use Cookies

### Authentication & Security
- **Maintain logged-in state** across pages
- **Protect against CSRF attacks** and security threats
- **Rate limiting** to prevent abuse
- **Session management** for secure user experience

### User Experience
- **Remember preferences** (e.g., ToS acceptance, banner dismissal)
- **Provide personalized content** based on your account
- **Improve navigation** and functionality

### Analytics & Improvement
- **Understand visitor behavior** and popular content
- **Identify technical issues** and improve performance
- **Measure feature usage** and effectiveness
- **Optimize user interface** based on data

### Advertising
- **Display relevant ads** based on browsing behavior
- **Measure ad performance** and effectiveness
- **Prevent ad fraud** and abuse
- **Support site operations** through ad revenue

---

## Managing Cookies

### Browser Settings

You can control and/or delete cookies through your browser settings:

#### Google Chrome
1. Click the three dots menu → Settings → Privacy and security → Cookies and other site data
2. Choose your preferred cookie settings
3. Manage exceptions and clear data

#### Mozilla Firefox
1. Click menu → Options → Privacy & Security
2. Choose cookie blocking level
3. Manage Data to view and remove cookies

#### Safari
1. Safari menu → Preferences → Privacy
2. Choose cookie blocking options
3. Manage Website Data to view/remove cookies

#### Microsoft Edge
1. Settings → Cookies and site permissions → Manage and delete cookies
2. Choose your cookie settings
3. View and clear site data

### Mobile Browsers

#### iOS (Safari)
Settings → Safari → Block All Cookies (or exceptions)

#### Android (Chrome)
Chrome app → Settings → Site settings → Cookies

---

### Ad Network Opt-Outs

You can opt out of personalized advertising through these tools:

- **Google Ad Settings**: https://adssettings.google.com/
- **Network Advertising Initiative**: https://optout.networkadvertising.org/
- **Digital Advertising Alliance**: https://optout.aboutads.info/
- **Your Online Choices** (EU): https://www.youronlinechoices.com/

### Analytics Opt-Outs

- **Google Analytics Opt-Out Browser Add-on**: https://tools.google.com/dlpage/gaoptout

### Using Browser Extensions

Consider privacy-focused browser extensions:
- **uBlock Origin**: Blocks ads and trackers
- **Privacy Badger**: Learns to block invisible trackers
- **Ghostery**: Shows and blocks trackers
- **DuckDuckGo Privacy Essentials**: Blocks trackers and forces encryption

---

## Impact of Disabling Cookies

### Essential Cookies Disabled
If you block essential cookies:
- ❌ **Cannot log in** to your account
- ❌ **Cannot submit reviews** or access user features
- ❌ **Security features won't work** properly
- ⚠️ **Site may not function correctly**

We strongly recommend keeping essential cookies enabled for security and functionality.

### Preference Cookies Disabled
If you clear localStorage:
- 📝 **ToS prompt appears** on every visit
- 📝 **Cookie notice reappears** each time
- 📝 **Banner dismissal not remembered**
- ✅ Site still functions normally

### Third-Party Cookies Disabled
If you block third-party cookies:
- ✅ **Site works normally** - Full functionality maintained
- 📊 **Analytics may not track** your visit (less accurate stats for us)
- 🎯 **Ads become less relevant** (you still see ads, just generic ones)
- 🔒 **Enhanced privacy** - Less tracking across websites

**We support your choice to block third-party cookies!** The core platform works perfectly without them.

---

## localStorage and sessionStorage

In addition to cookies, we use HTML5 web storage:

### localStorage (Persistent)
- **jamwathq_tos_accepted**: ToS acceptance status
- **jamwathq_cookies_acknowledged**: Cookie policy acknowledgment
- **jamwathq_banner_dismissed**: Welcome banner dismissal

**Duration**: Persists indefinitely until manually cleared
**Size**: Small (< 1 KB total)
**Access**: Only accessible by JamWatHQ domain

### sessionStorage (Temporary)
- **Purpose**: Temporary data storage during your visit
- **Duration**: Cleared when you close the browser tab
- **Current usage**: Reserved for future features
- **Access**: Only accessible by JamWatHQ domain

### Clearing Web Storage
You can clear localStorage and sessionStorage through:
- Browser developer tools (F12 → Application/Storage → Local Storage)
- Browser "Clear browsing data" feature (check "Site settings" or "Cookies")
- Privacy-focused browser extensions

---

## Data Protection & Privacy

### Security Measures
All cookies containing sensitive data are protected with:
- **Secure flag**: Only transmitted over HTTPS
- **HttpOnly flag**: Not accessible via JavaScript (prevents XSS)
- **SameSite=strict**: Protection against CSRF attacks
- **Encryption**: Session data encrypted in MongoDB

### GDPR Compliance (If Applicable)
If you're in the European Union, you have additional rights:
- **Right to access**: See what data we store
- **Right to rectification**: Correct inaccurate data
- **Right to erasure**: Request data deletion ("right to be forgotten")
- **Right to restrict processing**: Limit how we use your data
- **Right to data portability**: Receive your data in a portable format
- **Right to object**: Object to processing of your data

To exercise these rights, contact us at jamwathq@outlook.com

### CCPA Compliance (California Residents)
California residents have rights under the California Consumer Privacy Act:
- **Know**: What personal information we collect and why
- **Delete**: Request deletion of personal information
- **Opt-out**: Opt out of sale of personal information (we don't sell data)
- **Non-discrimination**: Equal service regardless of privacy choices

---

## Cookies and Children

JamWatHQ is not directed at children under 13 years of age. We do not knowingly collect personal information from children under 13.

If you are under 13, please do not use this Site or provide any information.

For J-1 programs, participants must typically be:
- At least 18 years old
- Enrolled in post-secondary education
- Meeting program sponsor requirements

---

## International Data Transfers

### Where Data Is Stored
- **Application servers**: Cloud hosting (Railway, Render, or Vercel)
- **Database**: MongoDB Atlas (may be stored in multiple regions)
- **CDN assets**: Distributed globally for performance
- **Third-party services**: Stored by respective providers (Google, Facebook, etc.)

### Data Protection
Even when data crosses borders, we maintain:
- Industry-standard encryption (HTTPS/TLS)
- Secure session management
- Regular security audits
- Compliance with applicable data protection laws

---

## Changes to This Policy

### Updates
We may update this Cookie Policy to reflect:
- Changes in cookie usage
- New features or services
- Legal or regulatory requirements
- Improvements to transparency

### Notification
When we make significant changes, we will:
- Update the "Last Updated" date at the top
- Notify users via a prominent banner
- Require re-acceptance of significant changes (if applicable)

### Your Responsibility
Please review this policy periodically to stay informed about our cookie practices.

---

## Cookie Summary Table

| Cookie/Storage | Type | Purpose | Duration | Essential? | Can Disable? |
|----------------|------|---------|----------|------------|--------------|
| `connect.sid` | Session | Authentication & security | 24h / logout | ✅ Yes | ❌ No |
| `_csrf` | Security | CSRF protection | 24h / logout | ✅ Yes | ❌ No |
| `jamwathq_tos_accepted` | localStorage | ToS acceptance | Until cleared | ❌ No | ✅ Yes |
| `jamwathq_cookies_acknowledged` | localStorage | Cookie policy | Until cleared | ❌ No | ✅ Yes |
| `jamwathq_banner_dismissed` | localStorage | Banner preference | Until cleared | ❌ No | ✅ Yes |
| Google AdSense | Third-party | Advertising | Up to 2 years | ❌ No | ✅ Yes |
| Google Analytics (`_ga`, `_gid`) | Third-party | Analytics | 2 years / 24h | ❌ No | ✅ Yes |
| OAuth (Google/Facebook) | Third-party | Authentication | Managed by provider | ⚠️ For login | ⚠️ Affects login |

---

## Additional Resources

### Learn More About Cookies
- **All About Cookies**: https://www.allaboutcookies.org/
- **ICC Cookie Guide**: https://www.cookielaw.org/
- **ICO Cookie Guidance**: https://ico.org.uk/for-organisations/guide-to-pecr/cookies-and-similar-technologies/

### Browser Privacy
- **Mozilla Firefox Privacy**: https://www.mozilla.org/privacy/firefox/
- **Google Chrome Privacy**: https://www.google.com/chrome/privacy/
- **Apple Safari Privacy**: https://www.apple.com/privacy/control/

### Privacy Organizations
- **Electronic Frontier Foundation**: https://www.eff.org/
- **Privacy International**: https://privacyinternational.org/
- **Center for Democracy & Technology**: https://cdt.org/

---

## Contact Us

If you have questions about this Cookie Policy or our use of cookies, please contact us:

**Email**: jamwathq@outlook.com  
**Website**: jamwathq.com  
**Subject Line**: "Cookie Policy Inquiry"

We will respond to your inquiry within **30 days**.

---

## Your Consent

By using JamWatHQ, you consent to our use of cookies as described in this policy.

You can withdraw consent by:
- Disabling cookies in your browser
- Using opt-out tools for advertising and analytics
- Clearing your browser data and localStorage
- Contacting us to delete your account

**Thank you for taking the time to understand how we use cookies!** 🍪

---

*Last updated: October 12, 2025*  
*Version: 1.0*

---

**Quick Reference:**
- ✅ Essential cookies = Required for login
- ⚠️ Preference storage = Remember your choices
- 🎯 Ad cookies = Optional, can be blocked
- 📊 Analytics cookies = Optional, can be blocked
- 🔒 All cookies protected with security flags
- 🌐 localStorage used for consent preferences