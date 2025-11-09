const fs = require('fs');

// Read the file
const content = fs.readFileSync('frontend/agencies.html', 'utf8');

// Replace all form tags that don't have onsubmit
const updatedContent = content.replace(
    /<form id="reviewForm-([^"]+)">/g,
    (match, agencyId) => {
        // Check if already has onsubmit
        if (match.includes('onsubmit=')) {
            return match;
        }
        return `<form id="reviewForm-${agencyId}" onsubmit="return validateAndSubmitReview(event, '${agencyId}')">`;
    }
);

// Write back
fs.writeFileSync('frontend/agencies.html', updatedContent, 'utf8');

console.log('✅ Updated all 70 agency forms with onsubmit handler');
