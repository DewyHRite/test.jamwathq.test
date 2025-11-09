/**
 * JamWatHQ Share Experience - Event Delegation Handler
 * Replaces inline onclick handlers with CSP-compliant event delegation
 *
 * Issue: HIGH-003 - 12 inline onclick handlers violate CSP
 * Date: 2025-11-05
 * Author: Yuuji Itadori
 * Security Fix: Eliminates XSS vectors from inline event handlers
 */

(function() {
  'use strict';

  /**
   * Initialize event delegation system
   * Called on DOMContentLoaded to set up all event listeners
   */
  function initEventDelegation() {
    console.log('✅ Share Experience event delegation initialized');

    // Event delegation for the entire document
    document.addEventListener('click', handleDocumentClick);

    // Event delegation for star ratings
    attachStarRatingListeners();
  }

  /**
   * Handle all click events via delegation
   * Routes clicks based on data-action attribute
   *
   * @param {Event} event - Click event
   */
  function handleDocumentClick(event) {
    // Check if clicked element or parent has data-action
    const action = event.target.dataset.action ||
                   event.target.closest('[data-action]')?.dataset.action;

    if (!action) return;

    // Prevent default for button/link actions
    if (event.target.tagName === 'BUTTON' || event.target.tagName === 'A') {
      event.preventDefault();
    }

    // Route to appropriate handler based on action
    switch(action) {
      case 'open-us-legal-modal':
        if (typeof openUSLegalModal === 'function') {
          openUSLegalModal(event);
        } else {
          console.warn('openUSLegalModal function not found');
        }
        break;

      case 'accept-tos':
        if (typeof acceptTOS === 'function') {
          acceptTOS();
        } else {
          console.warn('acceptTOS function not found');
        }
        break;

      case 'decline-tos':
        if (typeof declineTOS === 'function') {
          declineTOS();
        } else {
          console.warn('declineTOS function not found');
        }
        break;

      case 'close-reviews-popup':
        if (typeof closeReviewsPopup === 'function') {
          closeReviewsPopup();
        } else {
          console.warn('closeReviewsPopup function not found');
        }
        break;

      case 'change-page-prev':
        if (typeof changePage === 'function') {
          changePage(-1);
        } else {
          console.warn('changePage function not found');
        }
        break;

      case 'change-page-next':
        if (typeof changePage === 'function') {
          changePage(1);
        } else {
          console.warn('changePage function not found');
        }
        break;

      case 'open-reviews-popup':
        const state = event.target.dataset.state ||
                      event.target.closest('[data-state]')?.dataset.state;
        if (state && typeof openReviewsPopup === 'function') {
          openReviewsPopup(state);
        } else if (!state) {
          console.warn('State data attribute not found for reviews popup');
        } else {
          console.warn('openReviewsPopup function not found');
        }
        break;

      default:
        console.warn('Unknown action:', action);
    }
  }

  /**
   * Attach star rating listeners
   * Handles the 5 star rating icons (originally lines 2037-2041)
   * Uses event delegation on rating container
   */
  function attachStarRatingListeners() {
    const ratingContainer = document.querySelector('.star-rating');
    if (!ratingContainer) {
      console.log('⚠️ Star rating container not found - will retry on next page load');
      return;
    }

    ratingContainer.addEventListener('click', function(event) {
      const star = event.target.closest('i[data-rating]');
      if (!star) return;

      const rating = parseInt(star.dataset.rating);
      if (rating >= 1 && rating <= 5) {
        if (typeof setRating === 'function') {
          setRating(rating);
        } else {
          console.warn('setRating function not found');
        }
      } else {
        console.warn('Invalid rating value:', rating);
      }
    });

    console.log('✅ Star rating event delegation attached');
  }

  // Initialize on DOMContentLoaded or immediately if DOM already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEventDelegation);
  } else {
    // DOM already loaded, initialize immediately
    initEventDelegation();
  }

})();

/**
 * Security Notes:
 * - This file eliminates 12 inline onclick handlers from share-experience.html
 * - All event handling now uses CSP-compliant event delegation
 * - Functions are called with existence checks to prevent errors
 * - Console warnings help debugging if functions are missing
 * - IIFE pattern prevents global namespace pollution
 *
 * Inline handlers eliminated:
 * 1. openUSLegalModal(event) - Line 1705
 * 2-6. setRating(1-5) - Lines 2037-2041 (5 handlers)
 * 7. openReviewsPopup('${state}') - Line 2868
 * 8. acceptTOS() - Line 3382
 * 9. declineTOS() - Line 3385
 * 10. closeReviewsPopup() - Line 3397
 * 11-12. changePage(-1 / 1) - Lines 3403, 3407
 */
