/**
 * JamWatHQ Agency Reviews Display Modal - JavaScript
 * Displays past reviews for agencies in a centered popup modal
 * See CLAUDE.md for AI usage discipline
 * Date: 2025-11-01
 *
 * IMPORTANT: This modal is for DISPLAYING past reviews, not submitting them
 * For submission, see agencies-review-modal.js
 */

(function() {
  'use strict';

  /**
   * Initialize the reviews display modal system
   */
  function initReviewsDisplayModal() {
    console.log('✅ Agency Reviews Display Modal initialized');

    // Attach event listeners for closing modal
    attachModalListeners();
  }

  /**
   * Open reviews display modal for a specific agency
   * @param {string} agencyId - The agency identifier
   * @param {string} agencyName - The agency name for display
   */
  async function openReviewsDisplayModal(agencyId, agencyName) {
    console.log(`📖 Opening reviews display modal for: ${agencyName} (${agencyId})`);

    // Get or create modal
    let modal = document.getElementById('agencyReviewsDisplayModal');
    if (!modal) {
      modal = createReviewsDisplayModalHTML();
      document.body.appendChild(modal);
      attachModalListeners();
    }

    // Update modal title
    const modalTitle = modal.querySelector('.past-reviews-agency-name');
    if (modalTitle) {
      modalTitle.textContent = agencyName;
    }

    // Show loading state
    const reviewsContainer = modal.querySelector('.reviews-list');
    if (reviewsContainer) {
      reviewsContainer.innerHTML = `
        <div class="loading-reviews">
          <i class="fas fa-spinner fa-spin"></i>
          <p>Loading reviews...</p>
        </div>
      `;
    }

    // Show modal
    modal.classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevent background scroll

    // Fetch and display reviews
    await loadAndDisplayReviews(agencyId);

    // Focus management for accessibility
    const closeButton = modal.querySelector('.hide-reviews-btn');
    if (closeButton) {
      setTimeout(() => closeButton.focus(), 100);
    }
  }

  /**
   * Close the reviews display modal
   */
  function closeReviewsDisplayModal() {
    const modal = document.getElementById('agencyReviewsDisplayModal');
    if (modal) {
      modal.classList.remove('show');
      document.body.style.overflow = ''; // Restore scroll

      console.log('✅ Closed reviews display modal');
    }
  }

  /**
   * Load and display reviews for an agency
   * @param {string} agencyId - The agency identifier
   */
  async function loadAndDisplayReviews(agencyId) {
    const reviewsContainer = document.querySelector('#agencyReviewsDisplayModal .reviews-list');
    if (!reviewsContainer) return;

    try {
      // Fetch reviews from API - endpoint is /api/agency-reviews/:agencyId
      const apiUrl = window.location.hostname === 'localhost'
        ? `http://localhost:3000/api/agency-reviews/${agencyId}`
        : `/api/agency-reviews/${agencyId}`;

      console.log(`📡 Fetching reviews from: ${apiUrl}`);

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      if (!response.ok) {
        console.error(`❌ API Error: ${response.status} for agency: ${agencyId}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.reviews && data.reviews.length > 0) {
        // Display reviews
        renderReviews(data.reviews, reviewsContainer);
      } else {
        // No reviews found
        reviewsContainer.innerHTML = `
          <div class="no-reviews-message">
            <i class="fas fa-inbox"></i>
            <p>No reviews yet for this agency.</p>
            <p>Be the first to share your experience!</p>
          </div>
        `;
      }

      console.log(`✅ Loaded ${data.reviews?.length || 0} reviews for agency: ${agencyId}`);

    } catch (error) {
      console.error('❌ Error loading reviews:', error);
      reviewsContainer.innerHTML = `
        <div class="error-message">
          <i class="fas fa-exclamation-triangle"></i>
          <p>Failed to load reviews.</p>
          <p>Please try again later.</p>
        </div>
      `;
    }
  }

  /**
   * Render reviews in the modal
   * @param {Array} reviews - Array of review objects
   * @param {HTMLElement} container - Container element for reviews
   */
  function renderReviews(reviews, container) {
    const reviewsHTML = reviews.map(review => {
      const stars = generateStars(review.overallRating);
      const date = formatDate(review.createdAt);

      return `
        <div class="review-item">
          <div class="review-header">
            <div class="review-rating">
              <span class="review-overall-rating">${review.overallRating.toFixed(1)}/5.0</span>
              <div class="review-stars">${stars}</div>
            </div>
            <div class="review-date">
              <i class="fas fa-calendar-alt" aria-hidden="true"></i>
              ${date}
            </div>
          </div>

          <div class="review-metrics">
            <div class="metric-item">
              <span class="metric-label">Application:</span>
              <span class="metric-value">${review.applicationProcess}/5</span>
              <div class="metric-stars">${generateStars(review.applicationProcess)}</div>
            </div>
            <div class="metric-item">
              <span class="metric-label">Service:</span>
              <span class="metric-value">${review.customerService}/5</span>
              <div class="metric-stars">${generateStars(review.customerService)}</div>
            </div>
            <div class="metric-item">
              <span class="metric-label">Communication:</span>
              <span class="metric-value">${review.communication}/5</span>
              <div class="metric-stars">${generateStars(review.communication)}</div>
            </div>
            <div class="metric-item">
              <span class="metric-label">Support:</span>
              <span class="metric-value">${review.supportServices}/5</span>
              <div class="metric-stars">${generateStars(review.supportServices)}</div>
            </div>
            <div class="metric-item">
              <span class="metric-label">Experience:</span>
              <span class="metric-value">${review.overallExperience}/5</span>
              <div class="metric-stars">${generateStars(review.overallExperience)}</div>
            </div>
          </div>

          <div class="review-comments">
            <p class="review-comment-text">${escapeHTML(review.comments)}</p>
          </div>

          ${review.usageFrequency ? `
            <div class="review-usage">
              <i class="fas fa-repeat" aria-hidden="true"></i>
              Used agency ${review.usageFrequency} time${review.usageFrequency > 1 ? 's' : ''}
            </div>
          ` : ''}
        </div>
      `;
    }).join('');

    container.innerHTML = reviewsHTML;
  }

  /**
   * Generate star rating HTML
   * @param {number} rating - Rating value (0-5)
   * @returns {string} HTML string for stars
   */
  function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    let html = '';

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      html += '<i class="fas fa-star" aria-hidden="true"></i>';
    }

    // Half star
    if (hasHalfStar) {
      html += '<i class="fas fa-star-half-alt" aria-hidden="true"></i>';
    }

    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
      html += '<i class="far fa-star" aria-hidden="true"></i>';
    }

    return html;
  }

  /**
   * Format date to readable string
   * @param {string|Date} date - Date to format
   * @returns {string} Formatted date string
   */
  function formatDate(date) {
    const reviewDate = new Date(date);
    const now = new Date();
    const diffMs = now - reviewDate;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;

    // Fallback to formatted date
    return reviewDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  /**
   * Escape HTML to prevent XSS
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Create the reviews display modal HTML structure
   * @returns {HTMLElement} Modal element
   */
  function createReviewsDisplayModalHTML() {
    const modal = document.createElement('div');
    modal.id = 'agencyReviewsDisplayModal';
    modal.className = 'past-reviews-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-labelledby', 'reviewsDisplayModalTitle');
    modal.setAttribute('aria-modal', 'true');

    modal.innerHTML = `
      <div class="past-reviews-box">
        <div class="past-reviews-header">
          <h2 class="past-reviews-agency-name" id="reviewsDisplayModalTitle">Agency Reviews</h2>
          <button type="button" class="hide-reviews-btn" aria-label="Close reviews">
            <i class="fas fa-times" aria-hidden="true"></i>
            Hide Reviews
          </button>
        </div>

        <h3>Community Reviews</h3>

        <div class="reviews-list">
          <div class="loading-reviews">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Loading reviews...</p>
          </div>
        </div>
      </div>
    `;

    return modal;
  }

  /**
   * Attach event listeners for modal interactions
   */
  function attachModalListeners() {
    const modal = document.getElementById('agencyReviewsDisplayModal');
    if (!modal) return;

    // Close button
    const closeButton = modal.querySelector('.hide-reviews-btn');
    if (closeButton) {
      closeButton.addEventListener('click', closeReviewsDisplayModal);
    }

    // Background click to close
    modal.addEventListener('click', function(event) {
      if (event.target === modal) {
        closeReviewsDisplayModal();
      }
    });

    // Escape key to close
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape' && modal.classList.contains('show')) {
        closeReviewsDisplayModal();
      }
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReviewsDisplayModal);
  } else {
    initReviewsDisplayModal();
  }

  // Expose functions to global scope for external access
  window.AgencyReviewsDisplay = {
    open: openReviewsDisplayModal,
    close: closeReviewsDisplayModal
  };

})();
