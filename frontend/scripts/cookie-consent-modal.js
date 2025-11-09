// Cookie Consent Modal Handler
// See CLAUDE.md for AI usage discipline
// See docs/cookie-consent-implementation.md for implementation details

class CookieConsentManager {
    constructor() {
        this.modal = null;
        this.acceptButton = null;
        this.learnMoreButton = null;
        this.consentStorageKey = 'jamwat_cookie_consent';
        this.consentGivenKey = 'jamwat_cookie_consent_given';
    }

    init() {
        console.log('🍪 [Cookie Modal] Initializing cookie consent manager...');
        console.log('🍪 [Cookie Modal] DOM readyState:', document.readyState);

        this.modal = document.getElementById('cookieConsentModal');
        this.acceptButton = document.getElementById('btn-accept-cookies');
        this.learnMoreButton = document.getElementById('btn-learn-more-cookies');

        console.log('🍪 [Cookie Modal] Modal element found:', !!this.modal);
        console.log('🍪 [Cookie Modal] Accept button found:', !!this.acceptButton);
        console.log('🍪 [Cookie Modal] Learn more button found:', !!this.learnMoreButton);

        if (!this.modal) {
            console.error('❌ [Cookie Modal] Cookie consent modal element #cookieConsentModal not found in DOM');
            return;
        }

        // Attach event listeners
        if (this.acceptButton) {
            this.acceptButton.addEventListener('click', () => this.acceptCookies());
        }

        if (this.learnMoreButton) {
            this.learnMoreButton.addEventListener('click', () => this.learnMore());
        }

        // Listen for auth state changes
        window.addEventListener('authStateChanged', (event) => {
            console.log('🍪 [Cookie Modal] authStateChanged event received:', event.detail);
            this.handleAuthStateChange(event.detail);
        });

        console.log('✅ [Cookie Modal] Cookie consent manager initialized successfully');
    }

    handleAuthStateChange(authData) {
        console.log('🍪 [Cookie Modal] handleAuthStateChange called');
        console.log('🍪 [Cookie Modal] isAuthenticated:', authData.isAuthenticated);
        console.log('🍪 [Cookie Modal] user:', authData.user);

        // Show modal only after successful login
        if (authData.isAuthenticated) {
            console.log('🔐 [Cookie Modal] User logged in, checking cookie consent status');
            this.checkAndShowConsent();
        } else {
            console.log('ℹ️ [Cookie Modal] User not authenticated, skipping modal');
        }
    }

    checkAndShowConsent() {
        const consentGiven = localStorage.getItem(this.consentGivenKey);
        console.log('🍪 [Cookie Modal] Checking consent status...');
        console.log('🍪 [Cookie Modal] localStorage key:', this.consentGivenKey);
        console.log('🍪 [Cookie Modal] Consent value:', consentGiven);

        if (consentGiven === 'true') {
            console.log('✅ [Cookie Modal] Cookie consent already given, skipping modal');
            return;
        }

        console.log('📢 [Cookie Modal] Cookie consent not given, showing modal');
        this.showModal();
    }

    showModal() {
        console.log('🍪 [Cookie Modal] showModal() called');
        console.log('🍪 [Cookie Modal] Modal element exists:', !!this.modal);

        if (!this.modal) {
            console.error('❌ [Cookie Modal] Cookie consent modal element not found in showModal()');
            return;
        }

        console.log('🍪 [Cookie Modal] Current modal display:', window.getComputedStyle(this.modal).display);
        console.log('🍪 [Cookie Modal] Current modal classes:', this.modal.className);

        // Add show class for animation
        this.modal.classList.add('show');
        this.modal.style.display = 'flex';

        console.log('🍪 [Cookie Modal] After setting display - classes:', this.modal.className);
        console.log('🍪 [Cookie Modal] After setting display - style.display:', this.modal.style.display);

        // Focus management for accessibility
        if (this.acceptButton) {
            this.acceptButton.focus();
        }

        // Prevent background scroll
        document.body.style.overflow = 'hidden';

        console.log('✅ [Cookie Modal] Cookie consent modal displayed successfully');
    }

    closeModal() {
        if (!this.modal) return;

        this.modal.classList.remove('show');
        this.modal.style.display = 'none';

        // Restore background scroll
        document.body.style.overflow = '';

        console.log('✅ Cookie consent modal closed');
    }

    acceptCookies() {
        // Store consent in localStorage
        localStorage.setItem(this.consentGivenKey, 'true');
        localStorage.setItem(this.consentStorageKey, new Date().toISOString());

        console.log('✅ Cookie consent accepted and stored');

        // Close the modal
        this.closeModal();

        // Optional: Show confirmation notification
        if (window.authManager && typeof window.authManager.showNotification === 'function') {
            window.authManager.showNotification('Cookie preferences saved', 'success');
        }
    }

    learnMore() {
        // Redirect to Terms of Service page
        window.location.href = 'tos.html';
    }

    // Manual trigger for testing
    showConsentModal() {
        this.showModal();
    }

    // Reset consent (for testing)
    resetConsent() {
        localStorage.removeItem(this.consentGivenKey);
        localStorage.removeItem(this.consentStorageKey);
        console.log('🔄 Cookie consent reset');
    }
}

// Create global instance
const cookieConsentManager = new CookieConsentManager();
window.cookieConsentManager = cookieConsentManager;

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => cookieConsentManager.init());
} else {
    cookieConsentManager.init();
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = cookieConsentManager;
}
