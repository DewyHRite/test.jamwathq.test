const fs = require('fs');
const path = require('path');

const targetPath = path.resolve(__dirname, '../../frontend/agencies.html');

// Read the file
let content = fs.readFileSync(targetPath, 'utf-8');

// Fix duplicate form endings and button containers
// Pattern: Find cases where we have:
// 1. Original submit button + </form></section></div>
// 2. Followed by review-buttons-container with duplicate submit button
// 3. Followed by another </form></section></div>
// 4. Followed by view-past-reviews buttons

const duplicatePattern = /(<button[^>]*onclick="submitReview[^"]*\(\)">Submit Review<\/button>\s*<\/form>\s*<\/section>\s*<\/div>)\s*<div class="review-buttons-container">\s*<button[^>]*onclick="submitReview[^"]*\(\)">Submit Review<\/button>\s*<button[^>]*class="view-past-reviews-btn"[^>]*onclick="togglePastReviews\('[^']*'\)"[^>]*>[^<]*<\/button>\s*<\/div>\s*<\/form>\s*<\/section>\s*<\/div>/gi;

const fixed1 = content.replace(duplicatePattern, '$1');

// Now fix the view-past-reviews-btn to view-past-reviews-btn-semi
const fixed2 = fixed1.replace(/<button[^>]*class="view-past-reviews-btn view-past-reviews-btn-semi"/gi, '<button type="button" class="view-past-reviews-btn-semi"');

// Write back
fs.writeFileSync(targetPath, fixed2, 'utf-8');

console.log('Cleaned up duplicate structures');
