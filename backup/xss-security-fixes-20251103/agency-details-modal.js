/**
 * JamWatHQ Agency Details Modal - JavaScript
 * Displays agency contact information in a popup modal
 * See docs/agency-ranking.md for documentation
 * Date: 2025-11-02
 * See CLAUDE.md for AI usage discipline
 */

(function() {
  'use strict';

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
   * Validate and sanitize URL
   * @param {string} url - URL to validate
   * @returns {string|null} Safe URL or null if invalid
   */
  function sanitizeURL(url) {
    if (!url || url === 'Not found') return null;
    try {
      const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
      // Only allow http and https protocols
      if (['http:', 'https:'].includes(parsed.protocol)) {
        return parsed.href;
      }
    } catch (e) {
      console.warn(`Invalid URL: ${url}`);
    }
    return null;
  }

  /**
   * Agency contact information database
   * This data is sourced from agencies.html (updated 2025-11-02)
   * Includes social media links where available
   */
  const agencyContactInfo = {
    '10881': {
      id: '10881',
      name: '10881 Entertainment Agency',
      contact: '876-314-2564, 876-671-7705',
      email: '10881agency@gmail.com',
      website: 'Not found',
      location: 'Door #6, 63 Dumbarton Avenue, Kingston 10, St. Andrew, Jamaica',
      facebook: null,
      instagram: null,
      whatsapp: null
    },
    'arize': {
      id: 'arize',
      name: 'A-Rize Work & Travel Services',
      contact: '876-990-6427, 876-490-9482',
      email: 'info@arizeworkandtravel.com, support@arizeworkandtravel.com',
      website: 'http://www.arizeworkandtravel.com',
      location: '12 Wiltshire Complex, Spalding P.O., Clarendon, Jamaica',
      facebook: 'https://www.facebook.com/ARWTS1/',
      instagram: 'https://www.instagram.com/arizeworkandtravel1/?hl=en',
      whatsapp: null
    },
    'interexchange': {
      id: 'interexchange',
      name: 'InterExchange (Sponsor)',
      contact: '1-800-621-1202',
      email: 'worktravel@interexchange.org',
      website: 'https://www.interexchange.org/programs/work-travel-usa/international-staff/jamaica/how-it-works/',
      location: '100 Wall Street Suite 301, New York, New York 10005',
      facebook: null,
      instagram: 'https://www.instagram.com/interexchange/',
      whatsapp: null
    },
    'a1': {
      id: 'a1',
      name: 'A1 Placement Service Limited',
      contact: '876-503-1257',
      email: 'Not found',
      website: 'Not found',
      location: 'Shop #8, 6 Hagley Park Road, Kingston 10, Jamaica',
      facebook: null,
      instagram: null,
      whatsapp: null
    },
    'access': {
      id: 'access',
      name: 'Access to Success Business Solution',
      contact: '876-815-7494, 876-929-3633',
      email: 'accessemployment2019@gmail.com',
      website: 'http://atseagency.org/',
      location: 'Shop #3, Bisayne Plaza, 51 Slipe Road, Kingston 5, Jamaica',
      facebook: null,
      instagram: 'https://www.instagram.com/_access_to_success_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
      whatsapp: null
    },
    'adnil': {
      id: 'adnil',
      name: 'Adnil Services',
      contact: '876-963-5480, (876) 963-5700',
      email: 'info@adnilservices.com',
      website: 'https://www.adnilservices.com/',
      location: 'Market Street, Whitehouse, Westmoreland, Jamaica',
      facebook: null,
      instagram: null,
      whatsapp: null
    },
    'acep': {
      id: 'acep',
      name: 'Agency for Cultural Exchange Program Company Limited',
      contact: '876-330-9151, 876-906-9311',
      email: 'info@acepja.com, applicant.acepja@gmail.com',
      website: 'http://www.acepja.com',
      location: '3 Cargill Avenue, Suite #13, Kingston 10, Jamaica',
      facebook: null,
      instagram: null,
      whatsapp: null
    },
    'akey1': {
      id: 'akey1',
      name: 'Akey1 Limited',
      contact: '876-402-8302',
      email: 'Not found',
      website: 'Not found',
      location: 'Shop #50, Little Premier Plaza, Kingston 10, St. Andrew, Jamaica',
      facebook: null,
      instagram: null,
      whatsapp: null
    },
    'alphanso': {
      id: 'alphanso',
      name: 'Alphanso Agency Limited',
      contact: '876-667-7194',
      email: 'info@alphansoagency.com',
      website: 'http://www.alphansoagency.com',
      location: '30A Constant Spring Road, Kingston 10, Jamaica',
      facebook: null,
      instagram: 'https://www.instagram.com/alphansoagencyltd/?hl=en',
      whatsapp: null
    },
    'atlantic': {
      id: 'atlantic',
      name: 'Atlantic International Travel Services',
      contact: '876-700-8819, 876-325-5235',
      email: 'atlanticinternationaltravel69@gmail.com',
      website: 'https://www2.inteletravel.com/',
      location: '3A Green Vale Road, Mandeville, Manchester, Jamaica',
      facebook: null,
      instagram: null,
      whatsapp: null
    },
    'beadles': {
      id: 'beadles',
      name: 'Beadles & Associates',
      contact: '876-472-4479, 876-727-6240',
      email: 'Not found',
      website: 'Not found',
      location: 'Shop #9, Four Paths Shopping Centre, Clarendon, Jamaica',
      facebook: null,
      instagram: null,
      whatsapp: null
    },
    'cy': {
      id: 'cy',
      name: 'C & Y Employment Agency',
      contact: '876-469-1634, 876-862-2416, (876) 408-7818',
      email: 'Not found',
      website: 'Not found',
      location: '40 Jarett Street, Liberty Plaza, Montego Bay, St. James, Jamaica',
      facebook: null,
      instagram: null,
      whatsapp: null
    }
  };

  /**
   * Agency ID aliases for normalization
   * Maps common variations to the canonical ID
   */
  const agencyIdAliases = {
    'candyemploymentagency': 'cy',
    'candy': 'cy',
    'c&y': 'cy',
    'candyemployment': 'cy',
    'arizeworktravel': 'arize',
    'arizeworkandtravel': 'arize',
    'a1placement': 'a1',
    'a1placementservice': 'a1',
    'accesstosuccess': 'access',
    'alphansoagency': 'alphanso',
    'atlanticinternational': 'atlantic',
    'atlantictravelservices': 'atlantic',
    'beadlesassociates': 'beadles',
    '10881entertainment': '10881',
    'acepja': 'acep'
  };

  /**
   * Normalize agency ID to handle variations
   * @param {string} id - The raw agency ID
   * @returns {string} The normalized agency ID
   */
  function normalizeAgencyId(id) {
    if (!id) return '';

    // Convert to lowercase and remove special characters
    const normalized = id
      .toLowerCase()
      .replace(/[&\s\-_'".]/g, '') // Remove &, spaces, hyphens, underscores, quotes
      .replace(/[^a-z0-9]/g, '');  // Remove any remaining special chars

    console.log(`🔄 Normalized "${id}" → "${normalized}"`);

    // Check if normalized version exists in database
    if (agencyContactInfo[normalized]) {
      return normalized;
    }

    // Check aliases
    if (agencyIdAliases[normalized]) {
      const aliasedId = agencyIdAliases[normalized];
      console.log(`🔗 Alias found: "${normalized}" → "${aliasedId}"`);
      return aliasedId;
    }

    // Return original if exact match exists
    if (agencyContactInfo[id]) {
      return id;
    }

    // Return normalized version as last resort
    return normalized;
  }

  /**
   * Initialize agency details modal system
   */
  function initAgencyDetailsModal() {
    console.log('✅ Agency Details Modal initialized');

    // Create modal on page load
    createModalHTML();

    // Attach event listeners
    attachModalListeners();
  }

  /**
   * Open agency details modal
   * @param {string} agencyId - The agency identifier
   * @param {string} agencyName - The agency name for display
   */
  function openAgencyDetailsModal(agencyId, agencyName) {
    console.log(`📋 Opening details modal for agency: ${agencyId}`);

    const modal = document.getElementById('agencyDetailsModal');
    if (!modal) {
      console.error('Agency details modal not found');
      return;
    }

    // Normalize agency ID to handle variations
    const normalizedId = normalizeAgencyId(agencyId);

    // Get agency data using normalized ID
    const agency = agencyContactInfo[normalizedId];

    if (!agency) {
      console.error(`❌ No contact information found for agency: ${agencyId} (normalized: ${normalizedId})`);
      console.log(`📊 Available agencies: ${Object.keys(agencyContactInfo).join(', ')}`);
      showErrorMessage(modal, agencyName || agencyId, agencyId);
      return;
    }

    // Populate modal with agency data
    populateModal(modal, agency);

    // Show modal
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';

    // Focus on close button for accessibility
    const closeButton = modal.querySelector('.agency-details-close');
    if (closeButton) {
      setTimeout(() => closeButton.focus(), 100);
    }

    console.log(`✅ Displayed contact info for: ${agency.name}`);
  }

  /**
   * Close agency details modal
   */
  function closeAgencyDetailsModal() {
    const modal = document.getElementById('agencyDetailsModal');
    if (modal) {
      modal.classList.remove('show');
      document.body.style.overflow = '';
      console.log('✅ Closed agency details modal');
    }
  }

  /**
   * Populate modal with agency data
   * NOTE: Uses safe DOM manipulation to prevent XSS (SEC-001)
   * @param {HTMLElement} modal - The modal element
   * @param {Object} agency - The agency data object
   */
  function populateModal(modal, agency) {
    // Update agency name - safe with textContent
    const nameElement = modal.querySelector('.agency-details-name');
    if (nameElement) {
      nameElement.textContent = agency.name;
    }

    // Update contact info - safe with textContent
    const contactElement = modal.querySelector('.agency-detail-contact');
    if (contactElement) {
      contactElement.textContent = agency.contact;
    }

    // Update email with link - safe DOM creation
    const emailElement = modal.querySelector('.agency-detail-email');
    if (emailElement) {
      emailElement.textContent = ''; // Clear existing content
      if (agency.email && agency.email !== 'Not found') {
        const emailLink = document.createElement('a');
        emailLink.href = `mailto:${agency.email}`; // Safe - mailto: protocol
        emailLink.textContent = agency.email; // Safe - textContent
        emailElement.appendChild(emailLink);
      } else {
        emailElement.textContent = 'Not provided';
      }
    }

    // Update website with link - safe DOM creation with URL validation
    const websiteElement = modal.querySelector('.agency-detail-website');
    if (websiteElement) {
      websiteElement.textContent = ''; // Clear existing content
      if (agency.website && agency.website !== 'Not found') {
        const safeURL = sanitizeURL(agency.website);
        if (safeURL) {
          const websiteLink = document.createElement('a');
          websiteLink.href = safeURL; // Safe - validated URL
          websiteLink.textContent = agency.website; // Safe - textContent
          websiteLink.target = '_blank';
          websiteLink.rel = 'noopener noreferrer';
          websiteElement.appendChild(websiteLink);
        } else {
          websiteElement.textContent = 'Invalid URL';
        }
      } else {
        websiteElement.textContent = 'Not provided';
      }
    }

    // Update location - safe with textContent
    const locationElement = modal.querySelector('.agency-detail-location');
    if (locationElement) {
      locationElement.textContent = agency.location || 'Not provided';
    }

    // Update social media links - safe DOM creation
    const socialMediaContainer = modal.querySelector('.agency-social-media');
    if (socialMediaContainer) {
      const hasSocialMedia = agency.facebook || agency.instagram || agency.whatsapp;

      if (hasSocialMedia) {
        socialMediaContainer.classList.remove('hidden');
        const linksContainer = socialMediaContainer.querySelector('.social-links');

        if (linksContainer) {
          linksContainer.textContent = ''; // Clear existing content

          // Create Facebook link safely
          if (agency.facebook) {
            const safeFacebookURL = sanitizeURL(agency.facebook);
            if (safeFacebookURL) {
              const fbLink = createSocialLink(safeFacebookURL, 'facebook', 'Facebook', 'fab fa-facebook-f');
              linksContainer.appendChild(fbLink);
            }
          }

          // Create Instagram link safely
          if (agency.instagram) {
            const safeInstagramURL = sanitizeURL(agency.instagram);
            if (safeInstagramURL) {
              const igLink = createSocialLink(safeInstagramURL, 'instagram', 'Instagram', 'fab fa-instagram');
              linksContainer.appendChild(igLink);
            }
          }

          // Create WhatsApp link safely
          if (agency.whatsapp) {
            const whatsappURL = `https://wa.me/${agency.whatsapp}`;
            const waLink = createSocialLink(whatsappURL, 'whatsapp', 'WhatsApp', 'fab fa-whatsapp');
            linksContainer.appendChild(waLink);
          }
        }
      } else {
        socialMediaContainer.classList.add('hidden');
      }
    }
  }

  /**
   * Create a social media link element safely
   * @param {string} url - The URL
   * @param {string} platform - Platform name (lowercase)
   * @param {string} label - Display label
   * @param {string} iconClass - Font Awesome icon class
   * @returns {HTMLElement} The link element
   */
  function createSocialLink(url, platform, label, iconClass) {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.className = `social-link ${platform}`;
    link.title = label;

    const icon = document.createElement('i');
    icon.className = iconClass;
    link.appendChild(icon);

    const span = document.createElement('span');
    span.textContent = label;
    link.appendChild(span);

    return link;
  }

  /**
   * Show error message in modal
   * NOTE: Uses safe DOM manipulation to prevent XSS (SEC-001)
   * @param {HTMLElement} modal - The modal element
   * @param {string} agencyName - The agency name
   * @param {string} agencyId - The original agency ID for debugging
   */
  function showErrorMessage(modal, agencyName, agencyId) {
    const contentArea = modal.querySelector('.agency-details-content');
    if (contentArea) {
      contentArea.textContent = ''; // Clear existing content

      // Create error container
      const errorDiv = document.createElement('div');
      errorDiv.className = 'agency-details-error';

      // Icon
      const icon = document.createElement('i');
      icon.className = 'fas fa-exclamation-triangle';
      errorDiv.appendChild(icon);

      // Error title
      const titleP = document.createElement('p');
      titleP.className = 'error-title';
      titleP.textContent = 'Contact information not available';
      errorDiv.appendChild(titleP);

      // Error message with safe text
      const messageP = document.createElement('p');
      messageP.className = 'error-message';
      messageP.textContent = 'We couldn\'t find contact details for ';
      const strong = document.createElement('strong');
      strong.textContent = agencyName; // Safe - textContent
      messageP.appendChild(strong);
      messageP.appendChild(document.createTextNode('.'));
      errorDiv.appendChild(messageP);

      // Action buttons
      const actionsDiv = document.createElement('div');
      actionsDiv.className = 'error-actions';

      const viewAllLink = document.createElement('a');
      viewAllLink.href = 'agencies.html';
      viewAllLink.className = 'btn-standard btn-primary';
      const viewIcon = document.createElement('i');
      viewIcon.className = 'fas fa-building';
      viewAllLink.appendChild(viewIcon);
      viewAllLink.appendChild(document.createTextNode(' View All Agencies'));
      actionsDiv.appendChild(viewAllLink);

      const reportLink = document.createElement('a');
      reportLink.href = 'report-problem.html';
      reportLink.className = 'btn-standard btn-secondary';
      const reportIcon = document.createElement('i');
      reportIcon.className = 'fas fa-flag';
      reportLink.appendChild(reportIcon);
      reportLink.appendChild(document.createTextNode(' Report Missing Info'));
      actionsDiv.appendChild(reportLink);

      errorDiv.appendChild(actionsDiv);

      // Help text
      const helpP = document.createElement('p');
      helpP.className = 'error-help';
      helpP.textContent = 'You can find complete agency listings on our ';
      const agenciesLink = document.createElement('a');
      agenciesLink.href = 'agencies.html';
      agenciesLink.textContent = 'Agencies page';
      helpP.appendChild(agenciesLink);
      helpP.appendChild(document.createTextNode(' or '));
      const reportLink2 = document.createElement('a');
      reportLink2.href = 'report-problem.html';
      reportLink2.textContent = 'report this issue';
      helpP.appendChild(reportLink2);
      helpP.appendChild(document.createTextNode(' to help us improve.'));
      errorDiv.appendChild(helpP);

      contentArea.appendChild(errorDiv);
    }

    modal.classList.add('show');
    document.body.style.overflow = 'hidden';

    // Log for debugging
    console.log(`⚠️ Missing agency data - ID: ${agencyId}, Name: ${agencyName}`);
  }

  /**
   * Create modal HTML structure
   */
  function createModalHTML() {
    const modal = document.createElement('div');
    modal.id = 'agencyDetailsModal';
    modal.className = 'agency-details-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-labelledby', 'agencyDetailsTitle');
    modal.setAttribute('aria-modal', 'true');

    modal.innerHTML = `
      <div class="agency-details-box">
        <button type="button" class="agency-details-close" aria-label="Close details">
          <i class="fas fa-times"></i>
        </button>

        <div class="agency-details-header">
          <h2 class="agency-details-name" id="agencyDetailsTitle">Agency Details</h2>
        </div>

        <div class="agency-details-content">
          <div class="agency-detail-row">
            <div class="agency-detail-icon">
              <i class="fas fa-phone"></i>
            </div>
            <div class="agency-detail-info">
              <label>Contact Number</label>
              <p class="agency-detail-contact">Loading...</p>
            </div>
          </div>

          <div class="agency-detail-row">
            <div class="agency-detail-icon">
              <i class="fas fa-envelope"></i>
            </div>
            <div class="agency-detail-info">
              <label>Email Address</label>
              <p class="agency-detail-email">Loading...</p>
            </div>
          </div>

          <div class="agency-detail-row">
            <div class="agency-detail-icon">
              <i class="fas fa-globe"></i>
            </div>
            <div class="agency-detail-info">
              <label>Website</label>
              <p class="agency-detail-website">Loading...</p>
            </div>
          </div>

          <div class="agency-detail-row">
            <div class="agency-detail-icon">
              <i class="fas fa-map-marker-alt"></i>
            </div>
            <div class="agency-detail-info">
              <label>Location</label>
              <p class="agency-detail-location">Loading...</p>
            </div>
          </div>

          <div class="agency-social-media hidden">
            <div class="social-media-header">
              <i class="fas fa-share-alt"></i>
              <label>Connect on Social Media</label>
            </div>
            <div class="social-links"></div>
          </div>
        </div>

        <div class="agency-details-footer">
          <button type="button" class="btn-standard btn-secondary" data-action="close-details">
            Close
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  }

  /**
   * Attach event listeners for modal interactions
   */
  function attachModalListeners() {
    const modal = document.getElementById('agencyDetailsModal');
    if (!modal) return;

    // Close button
    const closeButton = modal.querySelector('.agency-details-close');
    if (closeButton) {
      closeButton.addEventListener('click', closeAgencyDetailsModal);
    }

    // Footer close button
    const footerCloseButton = modal.querySelector('button[data-action="close-details"]');
    if (footerCloseButton) {
      footerCloseButton.addEventListener('click', closeAgencyDetailsModal);
    }

    // Background click to close
    modal.addEventListener('click', function(event) {
      if (event.target === modal) {
        closeAgencyDetailsModal();
      }
    });

    // Escape key to close
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape' && modal.classList.contains('show')) {
        closeAgencyDetailsModal();
      }
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAgencyDetailsModal);
  } else {
    initAgencyDetailsModal();
  }

  // Expose functions to global scope
  window.AgencyDetailsModal = {
    open: openAgencyDetailsModal,
    close: closeAgencyDetailsModal
  };

})();
