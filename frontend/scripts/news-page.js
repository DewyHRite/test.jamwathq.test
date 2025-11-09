'use strict';

(function (window, document) {
    const updateFilterState = (isFiltering) => {
        const contentWrapper = document.querySelector('article.box.post');
        if (!contentWrapper) {
            return;
        }

        if (isFiltering) {
            contentWrapper.classList.add('filtering-active', 'content-wrapper');
        } else {
            contentWrapper.classList.remove('filtering-active', 'content-wrapper');
        }
    };

    // See CLAUDE.md for AI usage discipline
    // Updated: 2025-10-31 - Search/Filter Standardization
    // Changed IDs: searchAgencyForm → agency-search, locationForm → agency-location,
    //              servicesForm → agency-services, ratingForm → agency-rating
    // Added: Results counter with aria-live update
    const filterAgencyCards = () => {
        const searchInput = (document.getElementById('agency-search')?.value || '').toLowerCase();
        const locationFilter = (document.getElementById('agency-location')?.value || '').toLowerCase();
        const servicesFilter = (document.getElementById('agency-services')?.value || '').toLowerCase();
        const ratingFilter = parseInt(document.getElementById('agency-rating')?.value || '0', 10);
        const agencies = document.querySelectorAll('.news-info');

        const isFiltering = Boolean(searchInput || locationFilter || servicesFilter || ratingFilter);

        let visibleCount = 0;
        const totalCount = agencies.length;

        agencies.forEach((agency) => {
            const agencyName = agency.querySelector('header h3')?.textContent.toLowerCase() || '';
            const location = agency.querySelector('.location-tag')?.textContent.toLowerCase() || '';
            const servicesSection = Array.from(agency.querySelectorAll('section')).find((section) =>
                section.textContent.toLowerCase().includes('services:')
            );
            const servicesText = servicesSection?.textContent.toLowerCase() || '';

            // Get rating from data attribute or parse from stars
            const ratingElement = agency.querySelector('[data-rating]') || agency.querySelector('.user-rating');
            const agencyRating = ratingElement ? parseFloat(ratingElement.getAttribute('data-rating') || ratingElement.textContent) : 0;

            const matchesSearch = !searchInput || agencyName.includes(searchInput);
            const matchesLocation = !locationFilter || location.includes(locationFilter);
            const matchesServices = !servicesFilter || servicesText.includes(servicesFilter);
            const matchesRating = !ratingFilter || agencyRating >= ratingFilter;

            if (matchesSearch && matchesLocation && matchesServices && matchesRating) {
                agency.style.display = '';
                visibleCount++;
            } else {
                agency.style.display = 'none';
            }
        });

        // Update results counter
        const visibleCountEl = document.getElementById('visible-agencies-count');
        const totalCountEl = document.getElementById('total-agencies-count');
        if (visibleCountEl) visibleCountEl.textContent = visibleCount;
        if (totalCountEl) totalCountEl.textContent = totalCount;

        updateFilterState(isFiltering);
    };

    // Initialize results counter on page load for agencies
    document.addEventListener('DOMContentLoaded', function() {
        // Only run if we're on the agencies page
        if (document.getElementById('agency-search')) {
            const agencies = document.querySelectorAll('.news-info');
            const totalCount = agencies.length;
            const totalCountEl = document.getElementById('total-agencies-count');
            const visibleCountEl = document.getElementById('visible-agencies-count');

            if (totalCountEl) totalCountEl.textContent = totalCount;
            if (visibleCountEl) visibleCountEl.textContent = totalCount; // Initially all visible
        }
    });

    // See CLAUDE.md for AI usage discipline
    // Updated: 2025-10-31 - Search/Filter Standardization
    // Changed IDs: searchTitleForm → news-search, categoryForm → news-category, yearForm → news-year
    // Added: Results counter with aria-live update
    const filterNewsEntries = () => {
        const titleInput = (document.getElementById('news-search')?.value || '').toLowerCase();
        const categoryFilter = (document.getElementById('news-category')?.value || '').toLowerCase();
        const yearFilter = (document.getElementById('news-year')?.value || '').toLowerCase();
        const newsItems = document.querySelectorAll('.news-info');

        const isFiltering = Boolean(titleInput || categoryFilter || yearFilter);

        let visibleCount = 0;
        const totalCount = newsItems.length;

        newsItems.forEach((news) => {
            const newsTitle = news.querySelector('header h3')?.textContent.toLowerCase() || '';
            const categorySection = Array.from(news.querySelectorAll('section')).find((section) =>
                section.textContent.toLowerCase().includes('category:')
            );
            const categoryText = categorySection?.textContent.toLowerCase() || '';

            const yearSection = Array.from(news.querySelectorAll('section')).find((section) =>
                section.textContent.toLowerCase().includes('year:')
            );
            const yearText = yearSection?.textContent.toLowerCase() || '';

            const matchesTitle = !titleInput || newsTitle.includes(titleInput);
            const matchesCategory = !categoryFilter || categoryText.includes(categoryFilter);
            const matchesYear = !yearFilter || yearText.includes(yearFilter);

            if (matchesTitle && matchesCategory && matchesYear) {
                news.style.display = '';
                visibleCount++;
            } else {
                news.style.display = 'none';
            }
        });

        // Update results counter
        const visibleCountEl = document.getElementById('visible-news-count');
        const totalCountEl = document.getElementById('total-news-count');
        if (visibleCountEl) visibleCountEl.textContent = visibleCount;
        if (totalCountEl) totalCountEl.textContent = totalCount;

        updateFilterState(isFiltering);
    };

    // Initialize results counter on page load
    document.addEventListener('DOMContentLoaded', function() {
        const newsItems = document.querySelectorAll('.news-info');
        const totalCount = newsItems.length;
        const totalCountEl = document.getElementById('total-news-count');
        const visibleCountEl = document.getElementById('visible-news-count');

        if (totalCountEl) totalCountEl.textContent = totalCount;
        if (visibleCountEl) visibleCountEl.textContent = totalCount; // Initially all visible
    });

    window.filterAgencies = filterAgencyCards;
    window.filterNews = filterNewsEntries;
})(window, document);
