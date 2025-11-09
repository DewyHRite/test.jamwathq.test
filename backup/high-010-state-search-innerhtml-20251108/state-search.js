/**
 * State Search Functionality
 * UI/UX Enhancement for State Scoreboard
 * See docs/state-scoreboard.md for full documentation
 * Generated: 2025-10-30
 *
 * Features:
 * - Real-time search filtering of states
 * - Updates visible count dynamically
 * - Keyboard accessible
 * - CSP compliant (external JS only)
 */

(function() {
	'use strict';

	/**
	 * Initialize search functionality when DOM is ready
	 */
	function initSearch() {
		const searchInput = document.getElementById('state-search');
		const visibleCount = document.getElementById('visible-count');

		if (!searchInput) {
			console.warn('State search input not found');
			return;
		}

		// Add input event listener for real-time search
		searchInput.addEventListener('input', function(e) {
			const searchTerm = e.target.value.toLowerCase().trim();
			filterStates(searchTerm, visibleCount);
		});

		// Add keyboard accessibility
		searchInput.addEventListener('keydown', function(e) {
			if (e.key === 'Escape') {
				searchInput.value = '';
				filterStates('', visibleCount);
				searchInput.blur();
			}
		});

		console.log('State search initialized');
	}

	/**
	 * Filter state cards based on search term
	 */
	function filterStates(searchTerm, visibleCountElement) {
		const stateCards = document.querySelectorAll('.scoreboard-item');
		let visibleStates = 0;

		stateCards.forEach(card => {
			const stateName = card.getAttribute('data-state');

			if (!stateName) {
				return;
			}

			const matches = stateName.toLowerCase().includes(searchTerm);

			if (matches || searchTerm === '') {
				card.style.display = '';
				card.classList.remove('search-hidden');
				visibleStates++;
			} else {
				card.style.display = 'none';
				card.classList.add('search-hidden');
			}
		});

		// Update visible count if element exists
		if (visibleCountElement) {
			visibleCountElement.textContent = visibleStates;
		}

		// If no results, show a message
		showNoResultsMessage(visibleStates);
	}

	/**
	 * Show/hide no results message
	 */
	function showNoResultsMessage(count) {
		const containers = document.querySelectorAll('.scoreboard-container');

		containers.forEach(container => {
			let noResultsMsg = container.querySelector('.no-results-message');

			if (count === 0) {
				if (!noResultsMsg) {
					noResultsMsg = document.createElement('div');
					noResultsMsg.className = 'no-results-message';
					noResultsMsg.style.cssText = 'text-align: center; padding: 3em; color: #888; font-size: 1.2em;';
					noResultsMsg.innerHTML = '<i class="fas fa-search" style="font-size: 2em; margin-bottom: 0.5em; display: block; color: #ffee00;"></i><p>No states found matching your search.</p><p style="font-size: 0.9em; margin-top: 0.5em;">Try a different search term.</p>';
					container.appendChild(noResultsMsg);
				}
				noResultsMsg.style.display = 'block';
			} else if (noResultsMsg) {
				noResultsMsg.style.display = 'none';
			}
		});
	}

	/**
	 * Public API
	 */
	window.StateSearch = {
		init: initSearch,
		filter: filterStates
	};

	// Auto-initialize when DOM is ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initSearch);
	} else {
		// DOM already loaded, wait a bit for scoreboard to render
		setTimeout(initSearch, 500);
	}

})();
