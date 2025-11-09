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

	function createIcon(className) {
		const icon = document.createElement('i');
		icon.className = className;
		return icon;
	}

	function createLoadingElement(message) {
		const wrapper = document.createElement('div');
		wrapper.className = 'scoreboard-loading';
		wrapper.appendChild(createIcon('fas fa-spinner'));
		const text = document.createElement('span');
		text.textContent = ` ${message}`;
		wrapper.appendChild(text);
		return wrapper;
	}

	function createErrorElement(message) {
		const wrapper = document.createElement('div');
		wrapper.className = 'scoreboard-error';
		wrapper.appendChild(createIcon('fas fa-exclamation-triangle'));
		const paragraph = document.createElement('p');
		paragraph.textContent = message;
		wrapper.appendChild(paragraph);
		return wrapper;
	}

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

		// Set up modal close handler
		setupModalCloseHandler();

		// Set up sort dropdown
		setupSortDropdown();

		// Set up filter buttons
		setupFilterButtons();
	}

	/**
	 * Set up modal close button event listener
	 */
	function setupModalCloseHandler() {
		const popup = document.getElementById('reviews-popup');
		if (!popup) return;

		const closeBtn = popup.querySelector('.modal-close');
		if (closeBtn) {
			closeBtn.addEventListener('click', function() {
				popup.style.display = 'none';
				popup.classList.remove('show');
			});
		}

		// Close modal when clicking outside of it
		popup.addEventListener('click', function(e) {
			if (e.target === popup) {
				popup.style.display = 'none';
				popup.classList.remove('show');
			}
		});
	}

	/**
	 * Set up sort dropdown event listener
	 */
	function setupSortDropdown() {
		const sortDropdown = document.getElementById('scoreboard-sort');
		if (!sortDropdown) {
			console.warn('Sort dropdown not found');
			return;
		}

		sortDropdown.addEventListener('change', function(e) {
			const sortBy = e.target.value;
			console.log(`Sorting by: ${sortBy}`);
			sortStates(sortBy);
		});
	}

	/**
	 * Set up filter buttons event listeners
	 */
	function setupFilterButtons() {
		const filterButtons = document.querySelectorAll('.scoreboard-filter-button');
		if (!filterButtons.length) {
			console.warn('Filter buttons not found');
			return;
		}

		filterButtons.forEach(button => {
			button.addEventListener('click', function() {
				const filter = this.getAttribute('data-filter');
				console.log(`Filtering by: ${filter}`);

				// Update active button
				filterButtons.forEach(btn => btn.classList.remove('is-active'));
				this.classList.add('is-active');

				// Apply filter
				filterStates(filter);
			});
		});
	}

	/**
	 * Sort states based on selected criteria
	 */
	function sortStates(sortBy) {
		if (!allStatesData || allStatesData.length === 0) {
			console.warn('No state data to sort');
			return;
		}

		// Create a copy to avoid mutating original
		let sortedStates = [...allStatesData];

		switch (sortBy) {
			case 'rating':
				sortedStates.sort((a, b) => b.avgRating - a.avgRating);
				break;
			case 'reviews':
				sortedStates.sort((a, b) => b.reviewCount - a.reviewCount);
				break;
			case 'wage':
				sortedStates.sort((a, b) => b.avgWage - a.avgWage);
				break;
			case 'alphabetical':
				sortedStates.sort((a, b) => a.state.localeCompare(b.state));
				break;
			default:
				console.warn(`Unknown sort option: ${sortBy}`);
				return;
		}

		// Update global data
		allStatesData = sortedStates;

		// Re-render both groups
		renderScoreboardGroup(1);
		renderScoreboardGroup(2);

		console.log(`States sorted by ${sortBy}`);
	}

	/**
	 * Filter states based on selected criteria
	 */
	function filterStates(filterType) {
		const allCards = document.querySelectorAll('.scoreboard-item');
		let visibleCount = 0;

		allCards.forEach(card => {
			const reviewCount = parseInt(card.querySelector('.scoreboard-reviews')?.textContent || '0');
			const ratingText = card.querySelector('.scoreboard-rating span:last-child')?.textContent || '0';
			const rating = parseFloat(ratingText);

			let shouldShow = false;

			switch (filterType) {
				case 'all':
					shouldShow = true;
					break;
				case 'reviewed':
					shouldShow = reviewCount > 0;
					break;
				case 'top-rated':
					shouldShow = rating >= 4.0 && reviewCount > 0;
					break;
				default:
					shouldShow = true;
			}

			if (shouldShow) {
				card.style.display = '';
				card.classList.remove('filter-hidden');
				visibleCount++;
			} else {
				card.style.display = 'none';
				card.classList.add('filter-hidden');
			}
		});

		// Update visible count
		const visibleCountElement = document.getElementById('visible-count');
		if (visibleCountElement) {
			visibleCountElement.textContent = visibleCount;
		}

		console.log(`Filter applied: ${filterType}, showing ${visibleCount} states`);
	}

	/**
	 * Set up tab navigation event listeners
	 */
	function setupTabNavigation() {
		const tabButtons = document.querySelectorAll('.scoreboard-tabs .scoreboard-tab-button');

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
		const tabButtons = document.querySelectorAll('.scoreboard-tabs .scoreboard-tab-button');
		tabButtons.forEach(button => {
			const buttonGroup = parseInt(button.getAttribute('data-group'));
			if (buttonGroup === group) {
				button.classList.add('is-active');
				button.setAttribute('aria-selected', 'true');
			} else {
				button.classList.remove('is-active');
				button.setAttribute('aria-selected', 'false');
			}
		});

		// Update containers
		const containers = document.querySelectorAll('.scoreboard-container');
		containers.forEach(container => {
			const containerGroup = parseInt(container.getAttribute('data-group'));
			if (containerGroup === group) {
				container.classList.add('is-active');
				container.setAttribute('aria-hidden', 'false');
			} else {
				container.classList.remove('is-active');
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
		if (container1) container1.replaceChildren(createLoadingElement('Loading states...'));

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

			// Update total count
			const totalCountElement = document.getElementById('total-count');
			const visibleCountElement = document.getElementById('visible-count');
			if (totalCountElement) {
				totalCountElement.textContent = allStatesData.length;
			}
			if (visibleCountElement) {
				visibleCountElement.textContent = allStatesData.length;
			}

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
			container.replaceChildren(createErrorElement('No states available'));
			return;
		}

		const listWrapper = document.createElement('div');
		listWrapper.className = 'scoreboard-list';

		statesToShow.forEach((state, index) => {
			const rank = startIndex + index + 1; // Actual rank (1-50)
			listWrapper.appendChild(createStateCardElement(state, rank));
		});

		container.replaceChildren(listWrapper);
	}

	/**
	 * Generate DOM element for a single state card
	 */
	function createStateCardElement(state, rank) {
		const isTop3 = rank <= 3;
		const hasReviews = state.reviewCount > 0;
		const noReviewsClass = hasReviews ? '' : 'no-reviews';

		// Format average wage
		const avgWageDisplay = state.avgWage > 0 ? `$${state.avgWage.toFixed(2)}/hr` : 'No data';

		const card = document.createElement('div');
		card.className = `scoreboard-item ${noReviewsClass}`.trim();
		card.dataset.state = state.state;
		card.setAttribute('role', 'button');
		card.setAttribute('tabindex', '0');
		card.setAttribute('aria-label', `View reviews for ${state.state}. Rank ${rank}. ${state.avgRating} stars. ${state.reviewCount} reviews.`);

		const rankDiv = document.createElement('div');
		rankDiv.className = `scoreboard-rank ${isTop3 ? 'top3' : ''}`.trim();
		rankDiv.textContent = `#${rank}`;
		card.appendChild(rankDiv);

		const stateDiv = document.createElement('div');
		stateDiv.className = 'scoreboard-state';
		stateDiv.textContent = state.state;
		card.appendChild(stateDiv);

		const statsWrapper = document.createElement('div');
		statsWrapper.className = 'scoreboard-stats';

		const ratingWrapper = document.createElement('div');
		ratingWrapper.className = 'scoreboard-rating';
		const starsSpan = document.createElement('span');
		starsSpan.className = 'scoreboard-stars';
		starsSpan.appendChild(createStarsFragment(state.avgRating));
		ratingWrapper.appendChild(starsSpan);
		const ratingValue = document.createElement('span');
		ratingValue.textContent = state.avgRating.toFixed(1);
		ratingWrapper.appendChild(ratingValue);
		statsWrapper.appendChild(ratingWrapper);

		const reviewsDiv = document.createElement('div');
		reviewsDiv.className = 'scoreboard-reviews';
		reviewsDiv.textContent = `${state.reviewCount} review${state.reviewCount !== 1 ? 's' : ''}`;
		statsWrapper.appendChild(reviewsDiv);

		card.appendChild(statsWrapper);

		const wageDiv = document.createElement('div');
		wageDiv.className = 'scoreboard-avg-wage';
		wageDiv.textContent = `Avg. Wage: ${avgWageDisplay}`;
		card.appendChild(wageDiv);

		if (!hasReviews) {
			const noReviewsMsg = document.createElement('div');
			noReviewsMsg.className = 'scoreboard-no-reviews-msg';
			noReviewsMsg.textContent = 'No reviews yet';
			card.appendChild(noReviewsMsg);
		}

		return card;
	}

	/**
	 * Generate DOM fragment for star rating display
	 */
	function createStarsFragment(rating) {
		const fullStars = Math.floor(rating);
		const hasHalfStar = (rating % 1) >= 0.5;
		const fragment = document.createDocumentFragment();

		for (let i = 0; i < fullStars; i++) {
			fragment.appendChild(createIcon('fas fa-star'));
		}

		if (hasHalfStar) {
			fragment.appendChild(createIcon('fas fa-star-half-alt'));
		}

		const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
		for (let i = 0; i < emptyStars; i++) {
			fragment.appendChild(createIcon('far fa-star'));
		}

		return fragment;
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
			const fragments = reviews.map(review => createReviewElement(review));
			popupContent.replaceChildren(...fragments);
		}

		// Show popup
		popup.classList.add('show');
		popup.style.display = 'flex';
	}

	/**
	 * Generate HTML for a single review (with original production design)
	 * See docs/review-container.md for design documentation
	 * Updated: 2025-10-31 - Restored original production design from share-experience.html
	 */
	function createReviewElement(review) {
		// Main review card wrapper
		const wrapper = document.createElement('div');
		wrapper.className = 'scoreboard-review-item';

		// Header: User Icon + User Info + Rating
		const header = document.createElement('div');
		header.className = 'scoreboard-review-header';

		// User Icon (gender-based)
		const userIcon = document.createElement('div');
		userIcon.className = 'scoreboard-review-user-icon';
		userIcon.appendChild(createGenderIcon(review.userGender));
		header.appendChild(userIcon);

		// User Info (name + metadata)
		const userInfo = document.createElement('div');
		userInfo.className = 'scoreboard-review-user-info';

		const userName = document.createElement('div');
		userName.className = 'scoreboard-review-user-name';
		userName.textContent = review.userFirstName || 'Anonymous';
		userInfo.appendChild(userName);

		const metadata = document.createElement('div');
		metadata.className = 'scoreboard-review-metadata';
		let metadataText = review.jobTitle || '';
		if (review.employer) {
			metadataText += ` at ${review.employer}`;
		}
		metadataText += ` • ${formatDate(review.createdAt)}`;
		metadata.textContent = metadataText;
		userInfo.appendChild(metadata);

		header.appendChild(userInfo);

		// Rating Stars
		const ratingDiv = document.createElement('div');
		ratingDiv.className = 'scoreboard-review-rating';
		ratingDiv.appendChild(createStarsFragment(review.rating));
		header.appendChild(ratingDiv);

		wrapper.appendChild(header);

		// Review Details Grid (Location, Wage, Hours/Week, Year(s) Visited, Times Visited, Rating)
		const detailsGrid = document.createElement('div');
		detailsGrid.className = 'scoreboard-review-details';

		// Location
		const locationItem = createDetailItem('Location', review.city || 'Not specified');
		detailsGrid.appendChild(locationItem);

		// Hourly Wage
		const wageItem = createDetailItem('Hourly Wage', `$${review.wages.toFixed(2)}`);
		detailsGrid.appendChild(wageItem);

		// Hours/Week
		const hoursItem = createDetailItem('Hours/Week', `${review.hoursPerWeek} hrs`);
		detailsGrid.appendChild(hoursItem);

		// Year(s) Visited - Display the year or range of years from form
		const yearVisitedItem = createDetailItem('Year(s) Visited', review.visitYear || 'Not specified');
		detailsGrid.appendChild(yearVisitedItem);

		// Times Visited - Number of times (1-10)
		const timesVisitedItem = createDetailItem('Times Visited', `${review.timesUsed || 1}x`);
		detailsGrid.appendChild(timesVisitedItem);

		// Overall Rating
		const ratingItem = createDetailItem('Overall Rating', `${review.rating}/5 stars`);
		detailsGrid.appendChild(ratingItem);

		wrapper.appendChild(detailsGrid);

		// Review Experience Text
		const experienceText = document.createElement('div');
		experienceText.className = 'scoreboard-review-experience-text';

		const experienceLabel = document.createElement('span');
		experienceLabel.className = 'scoreboard-review-experience-label';
		experienceLabel.textContent = 'Experience:';
		experienceText.appendChild(experienceLabel);

		const experienceContent = document.createTextNode(` ${review.experience}`);
		experienceText.appendChild(experienceContent);

		wrapper.appendChild(experienceText);

		return wrapper;
	}

	/**
	 * Create a gender-based icon for review user
	 * See CLAUDE.md for security and design best practices
	 * Updated: 2025-10-31 - Added for original production design
	 */
	function createGenderIcon(gender) {
		const icon = document.createElement('i');
		if (gender === 'male') {
			icon.className = 'fas fa-male';
		} else if (gender === 'female') {
			icon.className = 'fas fa-female';
		} else {
			icon.className = 'fas fa-user';
		}
		return icon;
	}

	/**
	 * Create a detail item for review details grid
	 * See CLAUDE.md for security and design best practices
	 * Updated: 2025-10-31 - Added for original production design
	 */
	function createDetailItem(label, value) {
		const item = document.createElement('div');
		item.className = 'scoreboard-review-detail-item';

		const labelDiv = document.createElement('div');
		labelDiv.className = 'scoreboard-review-detail-label';
		labelDiv.textContent = `${label}:`;
		item.appendChild(labelDiv);

		const valueDiv = document.createElement('div');
		valueDiv.className = 'scoreboard-review-detail-value';
		valueDiv.textContent = value;
		item.appendChild(valueDiv);

		return item;
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
		container.replaceChildren(createErrorElement(message));
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
