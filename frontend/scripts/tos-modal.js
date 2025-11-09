/**
 * JamWatHQ Terms of Service Modal
 * Displays ToS on first visit, tracks acceptance in localStorage
 * CSP-compliant (no inline scripts)
 */

'use strict';

(function(window, document) {
    const TOS_STORAGE_KEY = 'jamwathq_tos_accepted';
    const COOKIES_STORAGE_KEY = 'jamwathq_cookies_acknowledged';
    
    // Check if user has already accepted ToS
    function hasAcceptedToS() {
        try {
            const acceptance = localStorage.getItem(TOS_STORAGE_KEY);
            return acceptance === 'true';
        } catch (e) {
            console.warn('localStorage not available:', e);
            return false;
        }
    }

    // Record ToS acceptance
    function acceptToS() {
        try {
            localStorage.setItem(TOS_STORAGE_KEY, 'true');
            localStorage.setItem(COOKIES_STORAGE_KEY, 'true');
            localStorage.setItem(TOS_STORAGE_KEY + '_timestamp', new Date().toISOString());
            return true;
        } catch (e) {
            console.error('Failed to record ToS acceptance:', e);
            return false;
        }
    }

    // Create modal HTML
    function createModal() {
        const modal = document.createElement('div');
        modal.id = 'tos-modal';
        modal.className = 'tos-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-labelledby', 'tos-modal-title');
        modal.setAttribute('aria-modal', 'true');

        modal.innerHTML = `
            <div class="tos-modal-overlay"></div>
            <div class="tos-modal-content">
                <div class="tos-modal-header">
                    <h2 id="tos-modal-title">Welcome to JamWatHQ! 🇯🇲</h2>
                </div>
                <div class="tos-modal-body">
                    <p><strong>Your #1 Jamaican J-1 Visa Info Hub</strong></p>
                    <p>Before you continue, please review our Terms of Service and Cookie Policy:</p>
                    
                    <div class="tos-summary">
                        <h3>📋 Quick Summary:</h3>
                        <ul>
                            <li><strong>🎓 Educational Project:</strong> We provide J-1 visa information for the Jamaican community</li>
                            <li><strong>🍪 Cookies:</strong> We use essential cookies for login and security</li>
                            <li><strong>🔒 Privacy:</strong> Your data is secure and never sold</li>
                            <li><strong>📢 Ads:</strong> We display native ads to cover hosting costs</li>
                            <li><strong>⚖️ Disclaimer:</strong> We're not a visa agency or legal advisor</li>
                        </ul>
                    </div>

                    <div class="tos-agreement">
                        <label class="tos-checkbox-label">
                            <input type="checkbox" id="tos-agree-checkbox" class="tos-checkbox">
                            <span>I have read and agree to the <a href="tos.html" target="_blank">Terms of Service</a> and <a href="tos.html#section-6" target="_blank">Cookie Policy</a></span>
                        </label>
                    </div>
                </div>
                <div class="tos-modal-footer">
                    <button id="tos-decline" class="tos-btn tos-btn-danger">
                        <i class="fas fa-times"></i> Decline
                    </button>
                    <button id="tos-learn-more" class="tos-btn tos-btn-secondary">
                        <i class="fas fa-book-open"></i> Learn More
                    </button>
                    <button id="tos-accept" class="tos-btn tos-btn-primary" disabled>
                        <i class="fas fa-check"></i> Accept & Continue
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        return modal;
    }

    // HIGH-005 CLEANUP: Dead code removed (2025-11-08)
    // The addStyles() function (445 lines) has been deleted.
    // Styles are now loaded from external CSS: styles/tos-modal.css
    // This improves CSP compliance and code maintainability.

    // Close modal with animation
    function closeModal(modal) {
        modal.style.animation = 'tosModalFadeOut 0.3s ease-out';
        document.body.classList.remove('tos-modal-open');
        
        setTimeout(() => {
            if (modal && modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }

    // Initialize modal
    function initModal() {
        // Check if already accepted
        if (hasAcceptedToS()) {
            return;
        }

        // Add styles
        // DISABLED: Styles now loaded from external CSS file (styles/tos-modal.css)
        // addStyles();

        // Create modal
        const modal = createModal();
        document.body.classList.add('tos-modal-open');

        // Get elements
        const checkbox = document.getElementById('tos-agree-checkbox');
        const acceptBtn = document.getElementById('tos-accept');
        const declineBtn = document.getElementById('tos-decline');
        const learnMoreBtn = document.getElementById('tos-learn-more');

        // Enable/disable accept button based on checkbox
        checkbox.addEventListener('change', function() {
            acceptBtn.disabled = !this.checked;
        });

        // Accept button handler
        acceptBtn.addEventListener('click', function() {
            if (acceptToS()) {
                closeModal(modal);

                // Show welcome banner after a short delay
                setTimeout(() => {
                    if (window.JamWatHQ && window.JamWatHQ.showWelcomeBanner) {
                        window.JamWatHQ.showWelcomeBanner();
                    }
                }, 500);
            }
        });

        // Decline button handler - redirect to Google
        declineBtn.addEventListener('click', function() {
            const confirmed = confirm(
                'If you decline the Terms of Service, you will not be able to use JamWatHQ. ' +
                'You will be redirected to Google.com.\n\n' +
                'Are you sure you want to decline?'
            );

            if (confirmed) {
                // Redirect to Google
                window.location.href = 'https://www.google.com';
            }
        });

        // Learn more button handler
        learnMoreBtn.addEventListener('click', function() {
            window.open('tos.html', '_blank');
        });

        // Prevent closing by clicking overlay (force users to make a choice)
        // If you want to allow closing, uncomment this:
        /*
        const overlay = modal.querySelector('.tos-modal-overlay');
        overlay.addEventListener('click', function() {
            if (confirm('You need to accept our Terms of Service to use this website. Continue without accepting?')) {
                closeModal(modal);
            }
        });
        */

        // Keyboard accessibility
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                // Uncomment to allow ESC key to close
                // closeModal(modal);
            }
        });

        // Focus first interactive element
        checkbox.focus();
    }

    // Export to global namespace
    window.JamWatHQ = window.JamWatHQ || {};
    window.JamWatHQ.tosModal = {
        init: initModal,
        hasAccepted: hasAcceptedToS,
        accept: acceptToS
    };

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initModal);
    } else {
        initModal();
    }

})(window, document);
