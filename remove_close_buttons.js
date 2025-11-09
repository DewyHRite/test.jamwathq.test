const fs = require('fs');

console.log('Removing redundant close buttons from past reviews popups...');

let content = fs.readFileSync('frontend/agencies.html', 'utf-8');

// Remove the close button elements
const pattern = /<button class="past-reviews-close"[^>]*>.*?<\/button>\s*/g;

const matches = content.match(pattern);
const count = matches ? matches.length : 0;
console.log(`Found ${count} close buttons to remove`);

const newContent = content.replace(pattern, '');

fs.writeFileSync('frontend/agencies.html', newContent, 'utf-8');

console.log(`✅ Successfully removed ${count} close buttons!`);
console.log('Now only the "Hide Reviews" button will be shown in each popup.');
