const fs = require('fs');
const path = require('path');

// Path to agencies.html
const filePath = path.join(__dirname, 'frontend', 'agencies.html');

console.log('🔧 Fixing agency wrapper spacing issues...\n');

// Read the file
let content = fs.readFileSync(filePath, 'utf8');

// Count occurrences before fix
const beforeCount = (content.match(/\<\/div\>\<div class="agency-wrapper"/g) || []).length;
console.log(`Found ${beforeCount} instances of merged closing/opening div tags\n`);

// Replace all instances of </div><div class="agency-wrapper" with proper spacing
content = content.replace(
  /(\s*)<\/div><div class="agency-wrapper"/g,
  '$1</div>\n\n            <div class="agency-wrapper"'
);

// Count occurrences after fix
const afterCount = (content.match(/\<\/div\>\<div class="agency-wrapper"/g) || []).length;

// Write back to file
fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ Fix complete!');
console.log(`   Before: ${beforeCount} merged tags`);
console.log(`   After:  ${afterCount} merged tags`);
console.log(`   Fixed:  ${beforeCount - afterCount} instances\n`);

if (afterCount === 0) {
  console.log('🎉 All agency wrapper tags are now properly formatted!');
} else {
  console.log('⚠️  Warning: Some merged tags may still exist. Manual review needed.');
}
