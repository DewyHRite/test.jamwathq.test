/**
 * Agency Ranking Page - JavaScript
 * See docs/agency-ranking.md for documentation
 * Based on State Scoreboard design patterns
 * Created: 2025-11-01
 * See CLAUDE.md for AI usage discipline
 */

(function() {
  'use strict';

  let allAgencies = [];
  let filteredAgencies = [];
  let currentFilter = 'all';
  let currentSort = 'overall-rating';
  let searchQuery = '';

  /**
   * Escape HTML to prevent XSS attacks
   * @param {string} text - Text to escape
   * @returns {string} HTML-safe text
   */
  function escapeHTML(text) {
    if (text === null || text === undefined) return '';
    const div = document.createElement('div');
    div.textContent = String(text);
    return div.innerHTML;
  }

  /**
   * Initialize the agency ranking page
   */
  async function initAgencyRanking() {
    console.log('✅ Agency Ranking initialized');

    // Attach event listeners
    attachEventListeners();

    // Load agency data
    await loadAgencyData();

    // Render initial view
    renderAgencies();

    // Update last updated time
    updateLastUpdated();
  }

  /**
   * Attach all event listeners
   */
  function attachEventListeners() {
    // Search input
    const searchInput = document.getElementById('agency-search');
    if (searchInput) {
      searchInput.addEventListener('input', handleSearch);
    }

    // Filter buttons
    const filterButtons = document.querySelectorAll('.scoreboard-filter-button');
    filterButtons.forEach(button => {
      button.addEventListener('click', handleFilterClick);
    });

    // Sort dropdown
    const sortSelect = document.getElementById('agency-sort');
    if (sortSelect) {
      sortSelect.addEventListener('change', handleSortChange);
    }

    // Clear filters button
    const clearBtn = document.getElementById('clear-filters-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', clearFilters);
    }
  }

  /**
   * Load agency data from API
   */
  async function loadAgencyData() {
    const container = document.getElementById('agency-ranking-container');

    try {
      // Fetch agency reviews data
      const apiUrl = window.location.hostname === 'localhost'
        ? 'http://localhost:3000/api/agency-reviews/rankings'
        : '/api/agency-reviews/rankings';

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.agencies) {
        allAgencies = data.agencies;
        filteredAgencies = [...allAgencies];

        // Update counts
        document.getElementById('total-agencies-count').textContent = allAgencies.length;
        document.getElementById('total-reviews-count').textContent = calculateTotalReviews(allAgencies);

        console.log(`✅ Loaded ${allAgencies.length} agencies`);
      } else {
        throw new Error('Invalid response format');
      }

    } catch (error) {
      console.error('❌ Error loading agency data:', error);

      // Load sample data for development
      loadSampleData();
    }
  }

  /**
   * Load sample data for development/testing
   */
  function loadSampleData() {
    console.log('📝 Loading sample agency data');

    allAgencies = [
      {
        id: '10881',
        name: '10881 Entertainment Agency',
        overallRating: 4.5,
        reviewCount: 127,
        metrics: {
          applicationProcess: 4.3,
          customerService: 4.6,
          communication: 4.7,
          supportServices: 4.4,
          overallExperience: 4.7
        },
        verified: true,
        mlssApproved: true,
        recentActivity: true,
        lastReviewDate: new Date('2025-11-01')
      },
      {
        id: 'arize',
        name: 'ARIZE USA',
        overallRating: 4.2,
        reviewCount: 85,
        metrics: {
          applicationProcess: 4.1,
          customerService: 4.2,
          communication: 4.3,
          supportServices: 4.0,
          overallExperience: 4.4
        },
        verified: true,
        mlssApproved: true,
        recentActivity: false,
        lastReviewDate: new Date('2025-10-28')
      },
      {
        id: 'interexchange',
        name: 'InterExchange',
        overallRating: 3.8,
        reviewCount: 64,
        metrics: {
          applicationProcess: 3.9,
          customerService: 3.7,
          communication: 3.8,
          supportServices: 3.6,
          overallExperience: 4.0
        },
        verified: false,
        mlssApproved: false,
        recentActivity: true,
        lastReviewDate: new Date('2025-10-30')
      }
    ];

    filteredAgencies = [...allAgencies];

    // Update counts
    document.getElementById('total-agencies-count').textContent = allAgencies.length;
    document.getElementById('total-reviews-count').textContent = calculateTotalReviews(allAgencies);

    console.log('✅ Sample data loaded');
  }

  /**
   * Handle search input
   */
  function handleSearch(event) {
    searchQuery = event.target.value.toLowerCase().trim();
    filterAndSortAgencies();
  }

  /**
   * Handle filter button clicks
   */
  function handleFilterClick(event) {
    const button = event.currentTarget;
    const filter = button.dataset.filter;

    // Update active state
    document.querySelectorAll('.scoreboard-filter-button').forEach(btn => {
      btn.classList.remove('is-active');
    });
    button.classList.add('is-active');

    currentFilter = filter;
    filterAndSortAgencies();
  }

  /**
   * Handle sort dropdown change
   */
  function handleSortChange(event) {
    currentSort = event.target.value;
    filterAndSortAgencies();
  }

  /**
   * Filter and sort agencies based on current criteria
   */
  function filterAndSortAgencies() {
    // Start with all agencies
    let result = [...allAgencies];

    // Apply search filter
    if (searchQuery) {
      result = result.filter(agency =>
        agency.name.toLowerCase().includes(searchQuery) ||
        agency.id.toLowerCase().includes(searchQuery)
      );
    }

    // Apply category filter
    switch (currentFilter) {
      case 'reviewed':
        result = result.filter(agency => agency.reviewCount > 0);
        break;
      case 'top-rated':
        result = result.filter(agency => agency.overallRating >= 4.0);
        break;
      case 'verified':
        result = result.filter(agency => agency.verified === true);
        break;
      default:
        // 'all' - no additional filtering
        break;
    }

    // Apply sorting
    result = sortAgencies(result, currentSort);

    filteredAgencies = result;
    renderAgencies();
  }

  /**
   * Sort agencies based on criteria
   */
  function sortAgencies(agencies, sortBy) {
    const sorted = [...agencies];

    switch (sortBy) {
      case 'overall-rating':
        sorted.sort((a, b) => b.overallRating - a.overallRating);
        break;
      case 'reviews':
        sorted.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'support':
        sorted.sort((a, b) => b.metrics.supportServices - a.metrics.supportServices);
        break;
      case 'communication':
        sorted.sort((a, b) => b.metrics.communication - a.metrics.communication);
        break;
      case 'application':
        sorted.sort((a, b) => b.metrics.applicationProcess - a.metrics.applicationProcess);
        break;
      case 'alphabetical':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'recent':
        sorted.sort((a, b) => b.lastReviewDate - a.lastReviewDate);
        break;
      default:
        break;
    }

    return sorted;
  }

  /**
   * Render agency cards
   */
  function renderAgencies() {
    const container = document.getElementById('agency-ranking-container');
    const noResultsMsg = document.getElementById('no-results-message');

    // Update result counts
    document.getElementById('visible-count').textContent = filteredAgencies.length;
    document.getElementById('total-count').textContent = allAgencies.length;

    if (filteredAgencies.length === 0) {
      container.innerHTML = '';
      noResultsMsg.style.display = 'block';
      return;
    }

    noResultsMsg.style.display = 'none';

    // Render each agency card
    const html = filteredAgencies.map(agency => createAgencyCard(agency)).join('');
    container.innerHTML = html;

    // Attach event listeners to action buttons
    attachCardActionListeners();

    console.log(`✅ Rendered ${filteredAgencies.length} agencies`);
  }

  /**
   * Attach event listeners to card action buttons
   */
  function attachCardActionListeners() {
    const container = document.getElementById('agency-ranking-container');

    container.addEventListener('click', function(event) {
      const button = event.target.closest('button[data-action]');
      if (!button) return;

      const action = button.dataset.action;
      const agencyId = button.dataset.agencyId;
      const agencyName = button.dataset.agencyName;

      switch (action) {
        case 'view-details':
          handleViewDetails(agencyId);
          break;
        case 'view-reviews':
          handleViewReviews(agencyId, agencyName);
          break;
      }
    });
  }

  /**
   * Handle View Details button click
   * Opens popup modal with agency contact information
   */
  function handleViewDetails(agencyId) {
    console.log(`🔍 View Details clicked for agency: ${agencyId}`);

    // Get agency name from the card
    const card = document.querySelector(`[data-agency-id="${agencyId}"]`);
    let agencyName = agencyId;

    if (card) {
      const nameElement = card.querySelector('.agency-card-title');
      if (nameElement) {
        agencyName = nameElement.textContent.trim();
      }
    }

    // Open agency details modal
    if (window.AgencyDetailsModal && typeof window.AgencyDetailsModal.open === 'function') {
      window.AgencyDetailsModal.open(agencyId, agencyName);
      console.log(`✅ Opened details modal for: ${agencyName}`);
    } else {
      console.error('AgencyDetailsModal not available');
      alert('Agency details system is loading. Please try again in a moment.');
    }
  }

  /**
   * Handle View Reviews button click
   * Opens the reviews DISPLAY modal (shows past reviews, not submission form)
   */
  function handleViewReviews(agencyId, agencyName) {
    // Use the reviews DISPLAY modal (not the submission modal)
    if (window.AgencyReviewsDisplay && typeof window.AgencyReviewsDisplay.open === 'function') {
      window.AgencyReviewsDisplay.open(agencyId, agencyName);
      console.log(`✅ Opening reviews display modal for: ${agencyName}`);
    } else {
      console.error('AgencyReviewsDisplay not available');
      alert('Reviews display is loading. Please try again in a moment.');
    }
  }

  /**
   * Create HTML for an agency card
   * NOTE: All dynamic content is escaped to prevent XSS attacks (SEC-001)
   */
  function createAgencyCard(agency) {
    const stars = generateStarRating(agency.overallRating);
    const badges = generateBadges(agency);
    const metrics = generateMetricsHTML(agency.metrics);
    const ratingColor = getRatingColorClass(agency.overallRating);

    // Escape all user-controlled or external data
    const safeId = escapeHTML(agency.id);
    const safeName = escapeHTML(agency.name);
    const safeRating = escapeHTML(agency.overallRating.toFixed(1));
    const safeReviewCount = escapeHTML(agency.reviewCount);

    return `
      <article class="agency-card" data-agency-id="${safeId}">
        <div class="agency-card-header">
          <h3 class="agency-card-title">${safeName}</h3>
          <div class="agency-card-badges">
            ${badges}
          </div>
        </div>

        <div class="agency-overall-rating">
          <div class="agency-overall-score">
            <div class="agency-overall-number ${ratingColor}">${safeRating}</div>
            <div class="agency-overall-outof">out of 5.0</div>
            <div class="agency-stars">${stars}</div>
          </div>
          <div class="agency-overall-meta">
            <p class="agency-review-count">
              Based on <strong>${safeReviewCount}</strong> ${agency.reviewCount === 1 ? 'review' : 'reviews'}
            </p>
          </div>
        </div>

        <div class="agency-metrics-grid">
          ${metrics}
        </div>

        <div class="agency-card-actions">
          <button type="button" class="agency-action-btn agency-action-btn--primary" data-action="view-details" data-agency-id="${safeId}">
            <i class="fas fa-eye" aria-hidden="true"></i>
            View Details
          </button>
          <button type="button" class="agency-action-btn agency-action-btn--secondary" data-action="view-reviews" data-agency-id="${safeId}" data-agency-name="${safeName}">
            <i class="fas fa-comment-dots" aria-hidden="true"></i>
            View Reviews
          </button>
        </div>
      </article>
    `;
  }

  /**
   * Generate star rating HTML
   */
  function generateStarRating(rating) {
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
   * Generate badges HTML
   */
  function generateBadges(agency) {
    let html = '';

    // MLSS Approved badge - Jamaica Ministry of Labour approved (replaces generic "Verified")
    if (agency.verified || agency.mlssApproved) {
      html += `
        <span class="agency-badge agency-badge--verified">
          <i class="fas fa-certificate" aria-hidden="true"></i>
          MLSS Approved
        </span>
      `;
    }

    // Top Rated badge - 4.0 stars or above
    if (agency.overallRating >= 4.0) {
      html += `
        <span class="agency-badge agency-badge--top-rated">
          <i class="fas fa-trophy" aria-hidden="true"></i>
          Top Rated
        </span>
      `;
    }

    // Popular badge - High volume of reviews (50+)
    if (agency.reviewCount >= 50) {
      html += `
        <span class="agency-badge agency-badge--popular">
          <i class="fas fa-fire" aria-hidden="true"></i>
          Popular
        </span>
      `;
    }

    // Highly Responsive badge - Excellent communication (4.5+)
    if (agency.metrics && agency.metrics.communication >= 4.5) {
      html += `
        <span class="agency-badge agency-badge--responsive">
          <i class="fas fa-comments" aria-hidden="true"></i>
          Highly Responsive
        </span>
      `;
    }

    // Limited Data badge - Fewer than 10 reviews
    if (agency.reviewCount < 10) {
      html += `
        <span class="agency-badge agency-badge--warning">
          <i class="fas fa-exclamation-triangle" aria-hidden="true"></i>
          Limited Data
        </span>
      `;
    }

    return html;
  }

  /**
   * Generate metrics grid HTML
   */
  function generateMetricsHTML(metrics) {
    const metricNames = {
      applicationProcess: 'Application',
      customerService: 'Support',
      communication: 'Communication',
      supportServices: 'Services',
      overallExperience: 'Experience'
    };

    return Object.entries(metrics).map(([key, value]) => {
      const stars = generateStarRating(value);
      const colorClass = getRatingColorClass(value);

      return `
        <div class="agency-metric-card">
          <div class="agency-metric-label">${metricNames[key]}</div>
          <div class="agency-metric-value ${colorClass}">${value.toFixed(1)}</div>
          <div class="agency-metric-stars">${stars}</div>
        </div>
      `;
    }).join('');
  }

  /**
   * Get rating color class based on score
   */
  function getRatingColorClass(rating) {
    if (rating >= 4.5) return 'agency-metric-value--excellent';
    if (rating >= 4.0) return 'agency-metric-value--good';
    if (rating >= 3.5) return 'agency-metric-value--average';
    if (rating >= 3.0) return 'agency-metric-value--poor';
    return 'agency-metric-value--critical';
  }

  /**
   * Calculate total reviews across all agencies
   */
  function calculateTotalReviews(agencies) {
    return agencies.reduce((total, agency) => total + agency.reviewCount, 0);
  }

  /**
   * Format date relative to now
   */
  function formatDate(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  }

  /**
   * Update last updated timestamp
   */
  function updateLastUpdated() {
    const element = document.getElementById('last-updated');
    if (element) {
      element.textContent = 'Just now';
    }
  }

  /**
   * Clear all filters and search
   */
  function clearFilters() {
    // Reset search
    const searchInput = document.getElementById('agency-search');
    if (searchInput) {
      searchInput.value = '';
      searchQuery = '';
    }

    // Reset filter to 'all'
    document.querySelectorAll('.scoreboard-filter-button').forEach(btn => {
      btn.classList.remove('is-active');
      if (btn.dataset.filter === 'all') {
        btn.classList.add('is-active');
      }
    });
    currentFilter = 'all';

    // Reset sort
    const sortSelect = document.getElementById('agency-sort');
    if (sortSelect) {
      sortSelect.value = 'overall-rating';
      currentSort = 'overall-rating';
    }

    // Re-render
    filterAndSortAgencies();
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAgencyRanking);
  } else {
    initAgencyRanking();
  }

})();
