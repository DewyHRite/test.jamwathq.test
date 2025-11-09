const fs = require('fs');

// Read the file
const content = fs.readFileSync('frontend/agencies.html', 'utf-8');

// Pattern to match: View Past Reviews button followed by Leave a Review button
const pattern = /(\s+)<button type="button" class="view-past-reviews-btn-semi" onclick="togglePastReviews\('([^']+)'\)">\s+◄ View Past Reviews\s+<\/button>\s+<button type="button" class="btn btn-primary" onclick="toggleReviewSection\(this, event\)">\s+Leave a Review\s+<\/button>/g;

// Count matches
const matches = content.match(pattern);
const count = matches ? matches.length : 0;
console.log(`Found ${count} button pairs to swap`);

// Replacement: Leave a Review first, then View Past Reviews
const newContent = content.replace(pattern, (match, spaces, agencyId) => {
    return `${spaces}<button type="button" class="btn btn-primary" onclick="toggleReviewSection(this, event)">
${spaces}  Leave a Review
${spaces}</button>
${spaces}<button type="button" class="view-past-reviews-btn-semi" onclick="togglePastReviews('${agencyId}')">
${spaces}  ◄ View Past Reviews
${spaces}</button>`;
});

// Write back to file
fs.writeFileSync('frontend/agencies.html', newContent, 'utf-8');

console.log(`Button order swap complete! Swapped ${count} button pairs.`);
