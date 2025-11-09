const fs = require('fs');

console.log('Removing old hide buttons from bottom of static HTML...');

let content = fs.readFileSync('frontend/agencies.html', 'utf-8');

// Remove the hide button elements that are in the static HTML (not dynamically added)
// These are between the no-reviews-message and closing divs
const pattern = /\s*<button class="hide-reviews-btn"[^>]*>[\s\S]*?<\/button>\s*(?=<\/div>[\s\S]*?<\/div>[\s\S]*?<div class="agency-wrapper")/g;

const matches = content.match(pattern);
const count = matches ? matches.length : 0;
console.log(`Found ${count} static hide buttons to remove`);

const newContent = content.replace(pattern, '\n              ');

fs.writeFileSync('frontend/agencies.html', newContent, 'utf-8');

console.log(`✅ Successfully removed ${count} static hide buttons!`);
console.log('Hide buttons are now added dynamically at the top of the popup.');
