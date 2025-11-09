const express = require('express');
const router = express.Router();
const passport = require('passport');

// Google OAuth Routes
// See docs/authentication-flow.md for redirect logic
router.get('/google', (req, res, next) => {
    // Priority 1: Use origin query parameter from frontend
    // Priority 2: Fall back to HTTP Referer header
    // Priority 3: Default to '/'
    let returnTo = '/';

    if (req.query.origin) {
        returnTo = decodeURIComponent(req.query.origin);
        console.log(`📍 Origin from query param: ${returnTo}`);
    } else {
        const referer = req.get('Referrer') || req.get('Referer');
        if (referer) {
            try {
                const refererUrl = new URL(referer);
                returnTo = refererUrl.pathname + refererUrl.search;
                console.log(`📍 Origin from referer header: ${returnTo}`);
            } catch (e) {
                console.warn('⚠️ Invalid referer URL, using default');
            }
        } else {
            console.warn('⚠️ No origin parameter or referer, using default');
        }
    }

    console.log(`🔐 Passing returnTo via OAuth state parameter: ${returnTo}`);

    // Use OAuth2 state parameter (best practice)
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        state: { returnTo: returnTo }  // Pass custom state data
    })(req, res, next);
});

router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: 'http://localhost:8000/?auth=failed',
        failureMessage: true
    }),
    (req, res) => {
        // Successful authentication - redirect back to the page they came from
        console.log('🔍 [Google Callback] Auth info:', {
            sessionID: req.sessionID,
            authInfo: req.authInfo,
            hasUser: !!req.user
        });

        // Get returnTo from OAuth state parameter (via req.authInfo)
        let returnTo = '/';
        if (req.authInfo && req.authInfo.state && req.authInfo.state.returnTo) {
            returnTo = req.authInfo.state.returnTo;
            console.log(`✅ Got returnTo from OAuth state: ${returnTo}`);
        }

        console.log(`✅ [Google Callback] Redirecting to: ${returnTo}`);

        // Construct full URL for frontend on port 8000
        const redirectUrl = `http://localhost:8000${returnTo}${returnTo.includes('?') ? '&' : '?'}auth=success`;
        console.log(`🎯 [Google Callback] Final redirect URL: ${redirectUrl}`);
        res.redirect(redirectUrl);
    }
);

// Facebook OAuth Routes
// See docs/authentication-flow.md for redirect logic
router.get('/facebook', (req, res, next) => {
    // Priority 1: Use origin query parameter from frontend
    // Priority 2: Fall back to HTTP Referer header
    // Priority 3: Default to '/'
    let returnTo = '/';

    if (req.query.origin) {
        returnTo = decodeURIComponent(req.query.origin);
        console.log(`📍 Origin from query param: ${returnTo}`);
    } else {
        const referer = req.get('Referrer') || req.get('Referer');
        if (referer) {
            try {
                const refererUrl = new URL(referer);
                returnTo = refererUrl.pathname + refererUrl.search;
                console.log(`📍 Origin from referer header: ${returnTo}`);
            } catch (e) {
                console.warn('⚠️ Invalid referer URL, using default');
            }
        } else {
            console.warn('⚠️ No origin parameter or referer, using default');
        }
    }

    console.log(`🔐 Passing returnTo via OAuth state parameter: ${returnTo}`);

    // Use OAuth2 state parameter (best practice)
    passport.authenticate('facebook', {
        scope: ['email', 'public_profile'],
        state: { returnTo: returnTo }  // Pass custom state data
    })(req, res, next);
});

router.get('/facebook/callback',
    passport.authenticate('facebook', {
        failureRedirect: 'http://localhost:8000/?auth=failed',
        failureMessage: true
    }),
    (req, res) => {
        // Successful authentication - redirect back to the page they came from
        console.log('🔍 [Facebook Callback] Auth info:', {
            sessionID: req.sessionID,
            authInfo: req.authInfo,
            hasUser: !!req.user
        });

        // Get returnTo from OAuth state parameter (via req.authInfo)
        let returnTo = '/';
        if (req.authInfo && req.authInfo.state && req.authInfo.state.returnTo) {
            returnTo = req.authInfo.state.returnTo;
            console.log(`✅ Got returnTo from OAuth state: ${returnTo}`);
        }

        console.log(`✅ [Facebook Callback] Redirecting to: ${returnTo}`);

        // Construct full URL for frontend on port 8000
        const redirectUrl = `http://localhost:8000${returnTo}${returnTo.includes('?') ? '&' : '?'}auth=success`;
        console.log(`🎯 [Facebook Callback] Final redirect URL: ${redirectUrl}`);
        res.redirect(redirectUrl);
    }
);

// Logout Route
// See docs/authentication-flow.md for redirect logic
router.get('/logout', (req, res) => {
    // Priority 1: Use origin query parameter from frontend
    // Priority 2: Fall back to HTTP Referer header
    // Priority 3: Default to '/'
    let returnTo = '/';

    if (req.query.origin) {
        returnTo = decodeURIComponent(req.query.origin);
        console.log(`📍 [Logout] Origin from query param: ${returnTo}`);
    } else {
        const referer = req.get('Referrer') || req.get('Referer');
        if (referer) {
            try {
                const refererUrl = new URL(referer);
                returnTo = refererUrl.pathname + refererUrl.search;
                console.log(`📍 [Logout] Origin from referer header: ${returnTo}`);
            } catch (e) {
                console.warn('⚠️ [Logout] Invalid referer URL, using default');
            }
        } else {
            console.warn('⚠️ [Logout] No origin parameter or referer, using default');
        }
    }

    console.log(`🚪 [Logout] Will redirect to: ${returnTo}`);

    req.logout((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({
                success: false,
                message: 'Error logging out'
            });
        }
        req.session.destroy((err) => {
            if (err) {
                console.error('Session destroy error:', err);
            }
            // Redirect back to the page they came from on frontend port 8000
            const redirectUrl = `http://localhost:8000${returnTo}${returnTo.includes('?') ? '&' : '?'}auth=loggedout`;
            console.log(`✅ [Logout] Redirecting to: ${redirectUrl}`);
            res.redirect(redirectUrl);
        });
    });
});

// API endpoint to check authentication status
router.get('/status', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({
            authenticated: true,
            user: {
                id: req.user._id,
                firstName: req.user.firstName,
                email: req.user.email,
                profilePicture: req.user.profilePicture,
                authProvider: req.user.authProvider
            }
        });
    } else {
        res.json({
            authenticated: false,
            user: null
        });
    }
});

// API endpoint to get current user details
router.get('/user', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({
            success: true,
            user: {
                id: req.user._id,
                firstName: req.user.firstName,
                email: req.user.email,
                profilePicture: req.user.profilePicture,
                authProvider: req.user.authProvider,
                createdAt: req.user.createdAt
            }
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'Not authenticated'
        });
    }
});

module.exports = router;
