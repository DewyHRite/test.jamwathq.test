const fs = require('fs');

console.log('Converting past reviews boxes to popup modals...');

let content = fs.readFileSync('frontend/agencies.html', 'utf-8');

// Pattern to match the current past-reviews-box structure
const pattern = /(<div class="past-reviews-box" id="reviews-([^"]+)">)\s*(<h3>Past Reviews<\/h3>)/g;

let count = 0;
const newContent = content.replace(pattern, (match, openingDiv, agencyId, h3Tag) => {
  count++;
  return `<div class="past-reviews-modal" id="reviews-modal-${agencyId}">
              ${openingDiv}
                <button class="past-reviews-close" onclick="closePastReviews('${agencyId}')" aria-label="Close past reviews">&times;</button>
                ${h3Tag}`;
});

fs.writeFileSync('frontend/agencies.html', newContent, 'utf-8');

console.log(`✅ Successfully converted ${count} past review boxes to popup modals!`);
console.log('Each popup now includes:');
console.log('  - Modal wrapper with backdrop');
console.log('  - Close button (×) in top-right corner');
console.log('  - Updated styling for better popup appearance');
