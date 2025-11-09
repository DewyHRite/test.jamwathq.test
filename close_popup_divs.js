const fs = require('fs');

console.log('Adding closing tags and hide buttons to popup modals...');

let content = fs.readFileSync('frontend/agencies.html', 'utf-8');

// Pattern to match the closing of past-reviews-box and find where to add the modal closing div
// We need to find: </div>\n            </div> (where first is past-reviews-box, second is agency-wrapper)
const pattern = /(id="reviews-([^"]+)">[\s\S]*?)(<\/div>\s*<\/div>\s*(?=\s*<div class="agency-wrapper"|$))/g;

let count = 0;
const newContent = content.replace(pattern, (match, beforeClosing, agencyId, closingDivs) => {
  count++;
  // Extract just the first closing div (for past-reviews-box) and keep the second one (for agency-wrapper)
  const parts = closingDivs.match(/(<\/div>)(\s*)(<\/div>)/);
  if (parts) {
    return `${beforeClosing}
                <button class="hide-reviews-btn" onclick="closePastReviews('${agencyId}')">
                  <i class="fas fa-times-circle"></i> Hide Reviews
                </button>${parts[1]}${parts[2]}</div>${parts[2]}${parts[3]}`;
  }
  return match;
});

fs.writeFileSync('frontend/agencies.html', newContent, 'utf-8');

console.log(`✅ Successfully added closing tags and hide buttons to ${count} popup modals!`);
