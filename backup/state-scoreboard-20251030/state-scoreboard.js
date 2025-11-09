/**
 * State Scoreboard - External JavaScript
 * See docs/state-scoreboard.md for full documentation
 * Generated: 2025-10-30
 *
 * Features:
 * - Fetch all 50 U.S. states from /api/reviews/stats
 * - Display in two groups of 25 (ranks 1-25 and 26-50)
 * - Tab navigation between groups
 * - Visit year display in review popups
 * - Responsive grid layout
 *
 * IMPORTANT: No inline scripts - CSP compliant
 */

// See CLAUDE.md - Security & Design Best Practices Mandate
// All JavaScript logic must be in external .js files

(function() {
	'use strict';

	// Global state
	let allStatesData = [];
	let currentGroup = 1;
	const API_BASE = 'http://localhost:3000/api';

	/**
	 * Initialize scoreboard on page load
	 */
	function initScoreboard() {
		console.log('Initializing State Scoreboard...');

		// Set up tab navigation
		setupTabNavigation();

		// Load state data
		loadStateData();

		// Set up event delegation for state clicks
		setupStateClickHandlers();
	}

	/**
	 * Set up tab navigation event listeners
	 */
	function setupTabNavigation() {
		const tabButtons = document.querySelectorAll('.scoreboard-tabs .tab-btn');

		tabButtons.forEach(button => {
			button.addEventListener('click', function() {
				const group = parseInt(this.getAttribute('data-group'));
				switchToGroup(group);
			});

			// Keyboard accessibility
			button.addEventListener('keypress', function(e) {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					const group = parseInt(this.getAttribute('data-group'));
					switchToGroup(group);
				}
			});
		});
	}

	/**
	 * Switch between state groups (1-25 or 26-50)
	 */
	function switchToGroup(group) {
		if (group === currentGroup) return;

		currentGroup = group;

		// Update tab buttons
		const tabButtons = document.querySelectorAll('.scoreboard-tabs .tab-btn');
		tabButtons.forEach(button => {
			const buttonGroup = parseInt(button.getAttribute('data-group'));
			if (buttonGroup === group) {
				button.classList.add('active');
				button.setAttribute('aria-selected', 'true');
			} else {
				button.classList.remove('active');
				button.setAttribute('aria-selected', 'false');
			}
		});

		// Update containers
		const containers = document.querySelectorAll('.scoreboard-container');
		containers.forEach(container => {
			const containerGroup = parseInt(container.getAttribute('data-group'));
			if (containerGroup === group) {
				container.classList.add('active');
				container.setAttribute('aria-hidden', 'false');
			} else {
				container.classList.remove('active');
				container.setAttribute('aria-hidden', 'true');
			}
		});

		console.log(`Switched to Group ${group} (Ranks ${group === 1 ? '1-25' : '26-50'})`);
	}

	/**
	 * Load all state statistics from backend
	 */
	async function loadStateData() {
		const container1 = document.getElementById('scoreboard-container-group-1');
		const container2 = document.getElementById('scoreboard-container-group-2');

		// Show loading state
		if (container1) container1.innerHTML = '<div class="scoreboard-loading"><i class="fas fa-spinner"></i> Loading states...</div>';

		try {
			const response = await fetch(`${API_BASE}/reviews/stats`);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();

			if (!data.success || !data.stats) {
				throw new Error('Invalid response format');
			}

			allStatesData = data.stats;

			console.log(`Loaded ${allStatesData.length} states`);

			// Render both groups
			renderScoreboardGroup(1);
			renderScoreboardGroup(2);

		} catch (error) {
			console.error('Error loading state data:', error);
			showError(container1, 'Failed to load state data. Please refresh the page.');
			if (container2) {
				showError(container2, 'Failed to load state data. Please refresh the page.');
			}
		}
	}

	/**
	 * Render scoreboard for specific group (1-25 or 26-50)
	 */
	function renderScoreboardGroup(group) {
		const container = document.getElementById(`scoreboard-container-group-${group}`);
		if (!container) {
			console.error(`Container for group ${group} not found`);
			return;
		}

		// Determine which states to show
		const startIndex = (group - 1) * 25; // Group 1: 0, Group 2: 25
		const endIndex = startIndex + 25;    // Group 1: 25, Group 2: 50
		const statesToShow = allStatesData.slice(startIndex, endIndex);

		if (statesToShow.length === 0) {
			container.innerHTML = '<div class="scoreboard-error"><i class="fas fa-exclamation-triangle"></i><p>No states available</p></div>';
			return;
		}

		// Generate HTML for each state
		const stateCardsHTML = statesToShow.map((state, index) => {
			const rank = startIndex + index + 1; // Actual rank (1-50)
			return generateStateCard(state, rank);
		}).join('');

		container.innerHTML = `<div class="scoreboard-list">${stateCardsHTML}</div>`;
	}

	/**
	 * Generate HTML for a single state card
	 */
	function generateStateCard(state, rank) {
		const isTop3 = rank <= 3;
		const hasReviews = state.reviewCount > 0;
		const noReviewsClass = hasReviews ? '' : 'no-reviews';

		// Generate star rating HTML
		const starsHTML = generateStarsHTML(state.avgRating);

		// Format average wage
		const avgWageDisplay = state.avgWage > 0 ? `$${state.avgWage.toFixed(2)}/hr` : 'No data';

		return `
			<div class="scoreboard-item ${noReviewsClass}"
			     data-state="${state.state}"
			     role="button"
			     tabindex="0"
			     aria-label="View reviews for ${state.state}. Rank ${rank}. ${state.avgRating} stars. ${state.reviewCount} reviews.">
				<div class="scoreboard-rank ${isTop3 ? 'top3' : ''}">#${rank}</div>
				<div class="scoreboard-state">${state.state}</div>
				<div class="scoreboard-stats">
					<div class="scoreboard-rating">
						<span class="scoreboard-stars">${starsHTML}</span>
						<span>${state.avgRating.toFixed(1)}</span>
					</div>
					<div class="scoreboard-reviews">${state.reviewCount} review${state.reviewCount !== 1 ? 's' : ''}</div>
				</div>
				<div class="scoreboard-avg-wage">Avg. Wage: ${avgWageDisplay}</div>
				${hasReviews ? '' : '<div class="scoreboard-no-reviews-msg">No reviews yet</div>'}
			</div>
		`;
	}

	/**
	 * Generate HTML for star rating display
	 */
	function generateStarsHTML(rating) {
		const fullStars = Math.floor(rating);
		const hasHalfStar = (rating % 1) >= 0.5;
		let starsHTML = '';

		// Full stars
		for (let i = 0; i < fullStars; i++) {
			starsHTML += '<i class="fas fa-star"></i>';
		}

		// Half star
		if (hasHalfStar) {
			starsHTML += '<i class="fas fa-star-half-alt"></i>';
		}

		// Empty stars
		const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
		for (let i = 0; i < emptyStars; i++) {
			starsHTML += '<i class="far fa-star"></i>';
		}

		return starsHTML;
	}

	/**
	 * Set up event delegation for state card clicks
	 */
	function setupStateClickHandlers() {
		// Use event delegation on the scoreboard containers
		document.addEventListener('click', function(e) {
			const stateCard = e.target.closest('.scoreboard-item:not(.no-reviews)');
			if (stateCard) {
				const stateName = stateCard.getAttribute('data-state');
				if (stateName) {
					openStateReviews(stateName);
				}
			}
		});

		// Keyboard accessibility
		document.addEventListener('keypress', function(e) {
			if (e.key === 'Enter' || e.key === ' ') {
				const stateCard = e.target.closest('.scoreboard-item:not(.no-reviews)');
				if (stateCard) {
					e.preventDefault();
					const stateName = stateCard.getAttribute('data-state');
					if (stateName) {
						openStateReviews(stateName);
					}
				}
			}
		});
	}

	/**
	 * Open reviews popup for specific state
	 * Note: This function integrates with existing review popup system
	 */
	async function openStateReviews(stateName) {
		console.log(`Opening reviews for ${stateName}`);

		// Check if there's an existing openReviewsPopup function
		if (typeof window.openReviewsPopup === 'function') {
			window.openReviewsPopup(stateName);
			return;
		}

		// Otherwise, fetch and display reviews manually
		try {
			const response = await fetch(`${API_BASE}/reviews/state/${encodeURIComponent(stateName)}`);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();

			if (!data.success || !data.reviews) {
				throw new Error('Invalid response format');
			}

			displayReviewsPopup(stateName, data.reviews);

		} catch (error) {
			console.error('Error loading reviews:', error);
			alert(`Failed to load reviews for ${stateName}. Please try again.`);
		}
	}

	/**
	 * Display reviews in a popup modal
	 */
	function displayReviewsPopup(stateName, reviews) {
		// Check if reviews popup modal exists
		let popup = document.getElementById('reviews-popup');

		if (!popup) {
			console.warn('Reviews popup modal not found. Creating fallback alert.');
			const reviewCount = reviews.length;
			const avgRating = reviews.length > 0
				? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
				: 0;
			alert(`${stateName}:\\n${reviewCount} reviews\\nAverage Rating: ${avgRating} stars`);
			return;
		}

		// Update popup content
		const popupTitle = popup.querySelector('.reviews-popup-title');
		const popupContent = popup.querySelector('.reviews-popup-list');

		if (popupTitle) {
			popupTitle.textContent = `Reviews for ${stateName}`;
		}

		if (popupContent) {
			popupContent.innerHTML = reviews.map(review => generateReviewHTML(review)).join('');
		}

		// Show popup
		popup.classList.add('show');
		popup.style.display = 'flex';
	}

	/**
	 * Generate HTML for a single review (with visit year)
	 */
	function generateReviewHTML(review) {
		const starsHTML = generateStarsHTML(review.rating);
		const visitYearHTML = formatVisitYear(review.visitYear);

		return `
			<div class="review-item">
				<div class="review-header">
					<div class="review-stars">${starsHTML}</div>
					<div class="review-date">${formatDate(review.createdAt)}</div>
				</div>
				<div class="review-position">
					<strong>${review.jobTitle}</strong>
					${review.city ? ` - ${review.city}` : ''}
				</div>
				${visitYearHTML}
				<div class="review-experience">${review.experience}</div>
				<div class="review-wage">Wage: $${review.wages.toFixed(2)}/hr (${review.hoursPerWeek} hrs/week)</div>
			</div>
		`;
	}

	/**
	 * Format visit year for display
	 * See docs/state-scoreboard.md for visit year requirements
	 */
	function formatVisitYear(visitYear) {
		if (!visitYear || visitYear.trim() === '') {
			return '<div class="review-visit-year review-visit-year-none"><i class="fas fa-calendar-alt"></i> <span>Visited: Not specified</span></div>';
		}

		return `
			<div class="review-visit-year">
				<i class="fas fa-calendar-alt"></i>
				<span class="review-visit-year-label">Visited:</span>
				<span class="review-visit-year-value">${visitYear.trim()}</span>
			</div>
		`;
	}

	/**
	 * Format date for display
	 */
	function formatDate(dateString) {
		const date = new Date(dateString);
		const options = { year: 'numeric', month: 'short', day: 'numeric' };
		return date.toLocaleDateString('en-US', options);
	}

	/**
	 * Show error message in container
	 */
	function showError(container, message) {
		if (!container) return;

		container.innerHTML = `
			<div class="scoreboard-error">
				<i class="fas fa-exclamation-triangle"></i>
				<p>${message}</p>
			</div>
		`;
	}

	/**
	 * Public API - expose necessary functions to window
	 */
	window.StateScoreboard = {
		init: initScoreboard,
		switchGroup: switchToGroup,
		refresh: loadStateData
	};

	// Auto-initialize when DOM is ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initScoreboard);
	} else {
		initScoreboard();
	}

})();
