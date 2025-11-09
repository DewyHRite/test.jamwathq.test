/**
 * JamWatHQ Agencies Review Modal - JavaScript Behavior
 * Handles modal open/close, form population, and submission
 * See docs/agencies-review-modal.md for documentation
 * Date: 2025-11-01
 *
 * IMPORTANT: This file follows CLAUDE.md best practices
 * - No inline scripts allowed
 * - All event handlers externalized
 * - Proper focus management for accessibility
 */

(function() {
  'use strict';

  // Modal state
  let currentAgencyId = null;
  let currentAgencyName = null;

  /**
   * Initialize modal system
   * Called on DOMContentLoaded
   */
  function initAgenciesReviewModal() {
    console.log('✅ Agencies Review Modal initialized');

    // Attach event listeners to all "Leave a Review" buttons
    attachReviewButtonListeners();

    // Attach close modal listeners
    attachCloseModalListeners();

    // Close modal on background click
    attachBackgroundClickListener();

    // Close modal on Escape key
    attachEscapeKeyListener();
  }

  /**
   * Attach click listeners to all "Leave a Review" buttons
   * NOTE: This function is now deprecated - event handling moved to agencies.js
   * via event delegation with proper authentication checks
   * Keeping function definition for backwards compatibility but not attaching listeners
   */
  function attachReviewButtonListeners() {
    // DEPRECATED: Button click handling moved to agencies.js for proper auth flow
    // agencies.js toggleReviewSection() handles:
    // 1. Authentication check
    // 2. Login modal if not authenticated
    // 3. Review modal if authenticated
    // Do not attach duplicate listeners here to prevent auth bypass
    console.log('⚠️ attachReviewButtonListeners is deprecated - using agencies.js event delegation');
  }

  /**
   * Open the review modal for a specific agency
   * @param {string} agencyId - The agency identifier
   * @param {string} agencyName - The agency name for display
   */
  function openReviewModal(agencyId, agencyName) {
    currentAgencyId = agencyId;
    currentAgencyName = agencyName;

    // Get or create modal
    let modal = document.getElementById('agenciesReviewModal');
    if (!modal) {
      modal = createModalHTML();
      document.body.appendChild(modal);
      attachCloseModalListeners();
      attachStarRatingListeners(); // CRIT-005 FIX: Event delegation for star ratings
    }

    // Update modal title
    const modalTitle = modal.querySelector('#agenciesModalTitle');
    if (modalTitle) {
      modalTitle.textContent = `Submit Your Review for ${agencyName}`;
    }

    // Update form agency ID
    const form = modal.querySelector('#agenciesReviewForm');
    if (form) {
      // Update form ID to match expected format: reviewForm-{agencyId}
      form.id = `reviewForm-${agencyId}`;
      form.dataset.agencyId = agencyId;

      // COMPREHENSIVE FORM RESET - Clear all previous data
      resetModalForm(form);

      // Update usage frequency field ID to match agency-specific validation
      const usageFrequencyField = form.querySelector('select[name="usageFrequency"]');
      if (usageFrequencyField) {
        usageFrequencyField.id = `usageFrequency-${agencyId}`;
        // Also update the label to match
        const label = form.querySelector('label[for="modal-usageFrequency"], label[for^="usageFrequency-"]');
        if (label) {
          label.setAttribute('for', `usageFrequency-${agencyId}`);
        }
      }
    }

    // Show modal
    modal.classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevent background scroll

    // Set focus to first form field for accessibility
    const firstInput = modal.querySelector('input[type="radio"], select, textarea');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }

    console.log(`✅ Opened review modal for agency: ${agencyId} (${agencyName})`);
  }

  /**
   * Reset modal form to blank state
   * Clears all form fields, star ratings, and visual indicators
   * @param {HTMLFormElement} form - The form element to reset
   */
  function resetModalForm(form) {
    if (!form) return;

    // Reset standard form fields (textareas, selects, etc.)
    form.reset();

    // Clear all hidden rating inputs
    const ratingInputs = form.querySelectorAll('input[type="hidden"]');
    ratingInputs.forEach(input => {
      input.value = '';
    });

    // Reset all star ratings to unselected state
    const allStars = form.querySelectorAll('.star-rating i');
    allStars.forEach(star => {
      star.classList.remove('fas', 'active');
      star.classList.add('far');
    });

    // Reset dropdown to default placeholder
    const usageFrequency = form.querySelector('select[name="usageFrequency"]');
    if (usageFrequency) {
      usageFrequency.selectedIndex = 0; // Select first option (placeholder)
    }

    // Clear textarea
    const commentsField = form.querySelector('textarea[name="comments"]');
    if (commentsField) {
      commentsField.value = '';
    }

    // Remove any error styling
    const allFields = form.querySelectorAll('input, textarea, select');
    allFields.forEach(field => {
      field.style.borderColor = '';
    });

    console.log('✅ Modal form reset to blank state');
  }

  /**
   * Close the review modal
   */
  function closeReviewModal() {
    const modal = document.getElementById('agenciesReviewModal');
    if (modal) {
      modal.classList.remove('show');
      document.body.style.overflow = ''; // Restore scroll

      // Reset form comprehensively (use querySelector since form ID changes dynamically)
      const form = modal.querySelector('form');
      if (form) {
        // Use comprehensive reset to clear all fields and visual indicators
        resetModalForm(form);

        // Reset form ID back to default
        form.id = 'agenciesReviewForm';
      }

      // Reset usage frequency field ID back to default
      const usageFrequencyField = modal.querySelector('select[name="usageFrequency"]');
      if (usageFrequencyField) {
        usageFrequencyField.id = 'modal-usageFrequency';
        const label = modal.querySelector('label[for^="usageFrequency-"]');
        if (label) {
          label.setAttribute('for', 'modal-usageFrequency');
        }
      }

      console.log('✅ Closed review modal');
    }

    currentAgencyId = null;
    currentAgencyName = null;
  }

  /**
   * Attach close modal listeners (close button and background click)
   */
  function attachCloseModalListeners() {
    const modal = document.getElementById('agenciesReviewModal');
    if (!modal) return;

    // Close button (X icon)
    const closeButton = modal.querySelector('.close-modal');
    if (closeButton) {
      // Add both click and touchend for mobile compatibility
      closeButton.addEventListener('click', closeReviewModal);
      closeButton.addEventListener('touchend', function(e) {
        e.preventDefault(); // Prevent double-firing on mobile
        closeReviewModal();
      });
    }

    // Cancel button (button with data-action="close-agencies-review-modal")
    const cancelButton = modal.querySelector('button[data-action="close-agencies-review-modal"]');
    if (cancelButton) {
      cancelButton.addEventListener('click', function(e) {
        e.preventDefault();
        closeReviewModal();
      });
    }
  }

  /**
   * Attach background click listener to close modal
   */
  function attachBackgroundClickListener() {
    const modal = document.getElementById('agenciesReviewModal');
    if (!modal) return;

    modal.addEventListener('click', function(event) {
      // Close if clicking on the background (not modal content)
      if (event.target === modal) {
        closeReviewModal();
      }
    });
  }

  /**
   * Attach Escape key listener to close modal
   */
  function attachEscapeKeyListener() {
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape') {
        const modal = document.getElementById('agenciesReviewModal');
        if (modal && modal.classList.contains('show')) {
          closeReviewModal();
        }
      }
    });
  }

  /**
   * Attach star rating listeners using event delegation
   * CRIT-005 FIX: Replaces 25 inline onclick handlers with CSP-compliant event delegation
   *
   * Handles clicks on star rating icons for all 5 rating categories:
   * - applicationProcess, customerService, communication, supportServices, overallExperience
   *
   * Uses event delegation on the modal to catch all star clicks without inline handlers
   */
  function attachStarRatingListeners() {
    const modal = document.getElementById('agenciesReviewModal');
    if (!modal) return;

    // Event delegation: Listen for clicks on the modal content
    modal.addEventListener('click', function(event) {
      // Check if clicked element is a star icon
      const star = event.target.closest('.star-rating i');
      if (!star) return;

      // Get the rating container and extract category name
      const ratingContainer = star.closest('.star-rating');
      if (!ratingContainer) return;

      // Extract category from container ID (e.g., "applicationProcessRating" -> "applicationProcess")
      const containerId = ratingContainer.id;
      const category = containerId.replace('Rating', '');

      // Get rating value from data attribute
      const ratingValue = star.getAttribute('data-rating');
      if (!ratingValue) return;

      // Update hidden input field
      const hiddenInput = document.getElementById(category);
      if (hiddenInput) {
        hiddenInput.value = ratingValue;
      }

      // Update visual state of stars
      updateStarVisuals(ratingContainer, parseInt(ratingValue));
    });
  }

  /**
   * Update visual state of star rating icons
   * @param {HTMLElement} container - The star rating container element
   * @param {number} rating - The selected rating value (1-5)
   */
  function updateStarVisuals(container, rating) {
    const stars = container.querySelectorAll('i');
    stars.forEach((star, index) => {
      if (index < rating) {
        // Fill stars up to the selected rating
        star.classList.remove('far');
        star.classList.add('fas');
      } else {
        // Empty stars after the selected rating
        star.classList.remove('fas');
        star.classList.add('far');
      }
    });
  }

  /**
   * Create modal HTML structure
   * Returns a complete modal DOM element
   */
  function createModalHTML() {
    const modal = document.createElement('div');
    modal.id = 'agenciesReviewModal';
    modal.className = 'agencies-review-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-labelledby', 'agenciesModalTitle');
    modal.setAttribute('aria-modal', 'true');

    modal.innerHTML = `
      <div class="modal-content">
        <span class="close-modal" data-action="close-agencies-review-modal" aria-label="Close review modal">&times;</span>
        <h2 id="agenciesModalTitle">Submit Your Review</h2>

        <form class="review-form" id="agenciesReviewForm">
          <!-- Application Process -->
          <div class="form-group">
            <label>Application Process: How smooth and transparent was the process of applying for placements? *</label>
            <div class="star-rating" id="applicationProcessRating">
              <i class="far fa-star" data-rating="1"></i>
              <i class="far fa-star" data-rating="2"></i>
              <i class="far fa-star" data-rating="3"></i>
              <i class="far fa-star" data-rating="4"></i>
              <i class="far fa-star" data-rating="5"></i>
            </div>
            <input type="hidden" id="applicationProcess" name="applicationProcess" required>
          </div>

          <!-- Customer Service -->
          <div class="form-group">
            <label>Customer Service: Were inquiries handled efficiently and professionally? *</label>
            <div class="star-rating" id="customerServiceRating">
              <i class="far fa-star" data-rating="1"></i>
              <i class="far fa-star" data-rating="2"></i>
              <i class="far fa-star" data-rating="3"></i>
              <i class="far fa-star" data-rating="4"></i>
              <i class="far fa-star" data-rating="5"></i>
            </div>
            <input type="hidden" id="customerService" name="customerService" required>
          </div>

          <!-- Communication -->
          <div class="form-group">
            <label>Communication: Are the placements aligned with expectations and qualifications? *</label>
            <div class="star-rating" id="communicationRating">
              <i class="far fa-star" data-rating="1"></i>
              <i class="far fa-star" data-rating="2"></i>
              <i class="far fa-star" data-rating="3"></i>
              <i class="far fa-star" data-rating="4"></i>
              <i class="far fa-star" data-rating="5"></i>
            </div>
            <input type="hidden" id="communication" name="communication" required>
          </div>

          <!-- Support Services -->
          <div class="form-group">
            <label>Support Services: How well does the agency assist users before, during, and after placements? *</label>
            <div class="star-rating" id="supportServicesRating">
              <i class="far fa-star" data-rating="1"></i>
              <i class="far fa-star" data-rating="2"></i>
              <i class="far fa-star" data-rating="3"></i>
              <i class="far fa-star" data-rating="4"></i>
              <i class="far fa-star" data-rating="5"></i>
            </div>
            <input type="hidden" id="supportServices" name="supportServices" required>
          </div>

          <!-- Overall Experience -->
          <div class="form-group">
            <label>Overall Experience: Would you recommend this agency to others? *</label>
            <div class="star-rating" id="overallExperienceRating">
              <i class="far fa-star" data-rating="1"></i>
              <i class="far fa-star" data-rating="2"></i>
              <i class="far fa-star" data-rating="3"></i>
              <i class="far fa-star" data-rating="4"></i>
              <i class="far fa-star" data-rating="5"></i>
            </div>
            <input type="hidden" id="overallExperience" name="overallExperience" required>
          </div>

          <!-- Usage Frequency -->
          <div class="usage-frequency-group">
            <label for="modal-usageFrequency">
              How many times have you used this agency? *
            </label>
            <select id="modal-usageFrequency" name="usageFrequency" required>
              <option value="" disabled selected>Please select...</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5+</option>
            </select>
          </div>

          <!-- Comments -->
          <div class="form-group">
            <label for="comments">Comments: *</label>
            <textarea
              id="comments"
              name="comments"
              required
              placeholder="Write your review here..."
              rows="4"
            ></textarea>
          </div>

          <!-- Form Actions -->
          <div class="form-actions">
            <button type="submit" class="btn-standard btn-primary">Submit Review</button>
            <button type="button" class="btn-standard btn-secondary" data-action="close-agencies-review-modal">Cancel</button>
          </div>
        </form>
      </div>
    `;

    // Attach form submit listener
    const form = modal.querySelector('#agenciesReviewForm');
    if (form) {
      form.addEventListener('submit', handleFormSubmit);
    }

    // Star ratings handled by CSS (direction: rtl + sibling selectors)
    // No JavaScript needed - matches agencies.html behavior

    return modal;
  }

  /**
   * Handle form submission
   * @param {Event} event - The submit event
   */
  function handleFormSubmit(event) {
    event.preventDefault();
    event.stopPropagation(); // Prevent document-level listeners from firing

    const form = event.target;
    const agencyId = form.dataset.agencyId;

    if (!agencyId) {
      console.error('No agency ID found for submission');
      alert('Error: Agency information not found. Please try again.');
      return;
    }

    // Collect form data
    const formData = {
      agencyId: agencyId,
      agencyName: currentAgencyName, // Add agency name from module variable
      applicationProcess: form.applicationProcess.value,
      customerService: form.customerService.value,
      communication: form.communication.value,
      supportServices: form.supportServices.value,
      overallExperience: form.overallExperience.value,
      usageFrequency: form.usageFrequency.value,
      comments: form.comments.value
    };

    // Frontend validation before submission
    if (!validateFormData(formData, form)) {
      return; // Validation failed, stop submission
    }

    console.log('📝 Form data collected and validated:', formData);

    // Store pending review data for TOS confirmation
    window.pendingReviewData = {
      agencyId: agencyId,
      formData: formData,
      isModalSubmission: true // Flag to identify modal submissions
    };

    // Show TOS modal - user must accept before submission
    if (window.openTOSModal && typeof window.openTOSModal === 'function') {
      window.openTOSModal();
    } else {
      console.error('TOS modal function not found');
      alert('Error: Terms of Service modal not available. Please refresh and try again.');
    }
  }

  /**
   * Validate form data before submission
   * @param {Object} formData - The form data to validate
   * @param {HTMLFormElement} form - The form element for showing errors
   * @returns {boolean} - True if valid, false otherwise
   */
  function validateFormData(formData, form) {
    // Validate all star ratings are provided
    const ratings = ['applicationProcess', 'customerService', 'communication', 'supportServices', 'overallExperience'];
    for (const rating of ratings) {
      if (!formData[rating] || formData[rating] < 1 || formData[rating] > 5) {
        alert('Please provide ratings for all categories (1-5 stars).');
        return false;
      }
    }

    // Validate usage frequency
    if (!formData.usageFrequency || formData.usageFrequency < 1 || formData.usageFrequency > 5) {
      alert('Please select how many times you have used this agency.');
      return false;
    }

    // Validate comments minimum length (20 characters)
    const comments = formData.comments.trim();
    if (comments.length < 20) {
      alert('Comments must be at least 20 characters. Please provide more detail about your experience.');

      // Highlight the comments field
      const commentsField = form.querySelector('#comments, textarea[name="comments"]');
      if (commentsField) {
        commentsField.focus();
        commentsField.style.borderColor = '#ff0000';
        setTimeout(() => {
          commentsField.style.borderColor = '';
        }, 3000);
      }

      return false;
    }

    return true;
  }

  /**
   * Submit agency review from modal (with TOS and authManager)
   * @param {Object} formData - The review data from modal
   * @param {string} agencyId - The agency ID
   */
  async function submitAgencyReviewFromModal(formData, agencyId) {
    console.log('📤 Submitting agency review from modal:', formData);

    // Add agency name from page
    const agencyNameElement = document.querySelector(`#wrapper-${agencyId} h3`);
    formData.agencyName = agencyNameElement ? agencyNameElement.textContent.trim() : agencyId;

    // Add TOS acceptance
    formData.tosAccepted = true;

    try {
      // Use authManager for submission (handles authentication)
      if (window.authManager && typeof window.authManager.submitAgencyReview === 'function') {
        const result = await window.authManager.submitAgencyReview(formData);

        if (result && result.success) {
          console.log('✅ Review submitted successfully:', result);
          alert('Thank you for your review! Your feedback helps the community.');
          closeReviewModal();

          // Reload reviews for this agency
          setTimeout(() => {
            if (typeof togglePastReviews === 'function') {
              togglePastReviews(agencyId);
            }
          }, 500);
        } else {
          throw new Error(result?.message || 'Failed to submit review');
        }
      } else {
        // Fallback: direct fetch if authManager not available
        const response = await fetch('/api/agency-reviews', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(formData)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Review submitted successfully:', data);
        alert('Thank you for your review! Your feedback helps the community.');
        closeReviewModal();

        // Reload reviews
        setTimeout(() => {
          if (typeof togglePastReviews === 'function') {
            togglePastReviews(agencyId);
          }
        }, 500);
      }
    } catch (error) {
      console.error('❌ Error submitting review:', error);
      alert(`Failed to submit your review: ${error.message}\n\nPlease try again or contact support.`);
    }
  }

  /**
   * Submit agency review to backend (legacy function - not used by modal)
   * @param {Object} formData - The review data
   */
  function submitAgencyReview(formData) {
    console.log('📤 Submitting agency review:', formData);

    // TODO: Replace with actual API call
    // This should match the backend route: POST /api/agency-reviews

    fetch('/api/agency-reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', // Include session cookies
      body: JSON.stringify(formData)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('✅ Review submitted successfully:', data);
      alert('Thank you for your review! It has been submitted successfully.');

      // Optionally refresh agency ratings
      if (typeof loadAgencyReviews === 'function') {
        loadAgencyReviews(formData.agencyId);
      }
    })
    .catch(error => {
      console.error('❌ Error submitting review:', error);
      alert('There was an error submitting your review. Please try again.');
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAgenciesReviewModal);
  } else {
    initAgenciesReviewModal();
  }

  /**
   * Star rating functions (global scope for onclick handlers)
   * Each category has its own setRating function
   */

  // Application Process Rating
  window.setApplicationProcessRating = function(rating) {
    document.getElementById('applicationProcess').value = rating;
    const stars = document.querySelectorAll('#applicationProcessRating i');
    stars.forEach((star, index) => {
      if (index < rating) {
        star.classList.remove('far');
        star.classList.add('fas', 'active');
      } else {
        star.classList.remove('fas', 'active');
        star.classList.add('far');
      }
    });
  };

  // Customer Service Rating
  window.setCustomerServiceRating = function(rating) {
    document.getElementById('customerService').value = rating;
    const stars = document.querySelectorAll('#customerServiceRating i');
    stars.forEach((star, index) => {
      if (index < rating) {
        star.classList.remove('far');
        star.classList.add('fas', 'active');
      } else {
        star.classList.remove('fas', 'active');
        star.classList.add('far');
      }
    });
  };

  // Communication Rating
  window.setCommunicationRating = function(rating) {
    document.getElementById('communication').value = rating;
    const stars = document.querySelectorAll('#communicationRating i');
    stars.forEach((star, index) => {
      if (index < rating) {
        star.classList.remove('far');
        star.classList.add('fas', 'active');
      } else {
        star.classList.remove('fas', 'active');
        star.classList.add('far');
      }
    });
  };

  // Support Services Rating
  window.setSupportServicesRating = function(rating) {
    document.getElementById('supportServices').value = rating;
    const stars = document.querySelectorAll('#supportServicesRating i');
    stars.forEach((star, index) => {
      if (index < rating) {
        star.classList.remove('far');
        star.classList.add('fas', 'active');
      } else {
        star.classList.remove('fas', 'active');
        star.classList.add('far');
      }
    });
  };

  // Overall Experience Rating
  window.setOverallExperienceRating = function(rating) {
    document.getElementById('overallExperience').value = rating;
    const stars = document.querySelectorAll('#overallExperienceRating i');
    stars.forEach((star, index) => {
      if (index < rating) {
        star.classList.remove('far');
        star.classList.add('fas', 'active');
      } else {
        star.classList.remove('fas', 'active');
        star.classList.add('far');
      }
    });
  };

  // Expose functions to global scope if needed for testing
  window.AgenciesReviewModal = {
    open: openReviewModal,
    close: closeReviewModal
  };

  // Also expose closeReviewModal directly for backwards compatibility
  window.closeReviewModal = closeReviewModal;

})();
