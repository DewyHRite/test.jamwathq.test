const fs = require('fs');
const path = require('path');

console.log('🔧 Removing rotation to fix crooked text alignment...\n');

// Files to update (excluding agencies.html which is already done)
const files = [
  'frontend/news.html',
  'frontend/faq.html',
  'frontend/guide.html',
  'frontend/share-experience.html',
  'frontend/index.html',
  'frontend/tos.html',
  'frontend/about.html'
];

let totalUpdates = 0;
let successCount = 0;

files.forEach(file => {
  const filePath = path.join(__dirname, file);

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let fileUpdates = 0;

    // Remove transform: rotate(45deg); from .report-problem-btn
    if (content.includes('transform: rotate(45deg);')) {
      // Remove the standalone transform line
      content = content.replace(/\s*transform:\s*rotate\(45deg\);\s*/g, '\n');
      fileUpdates++;
    }

    // Update hover transform from rotate(45deg) scale(1.05) to just scale(1.05)
    if (content.includes('transform: rotate(45deg) scale(1.05);')) {
      content = content.replace(/transform:\s*rotate\(45deg\)\s*scale\(1\.05\);/g, 'transform: scale(1.05);');
      fileUpdates++;
    }

    // Update comment
    content = content.replace(
      /\/\* Report Button - Positioned Beside Gear Icon with 45deg Rotation \*\//g,
      '/* Report Button - Positioned Beside Gear Icon */'
    );

    if (fileUpdates > 0) {
      fs.writeFileSync(filePath, content, 'utf8');
      totalUpdates += fileUpdates;
      successCount++;
      console.log(`✅ Updated ${file} (${fileUpdates} changes)`);
    } else {
      console.log(`⚠️  No rotation found in ${file}`);
    }

  } catch (error) {
    console.error(`❌ Error processing ${file}:`, error.message);
  }
});

console.log(`\n🎉 Complete!`);
console.log(`✅ Successfully updated: ${successCount} files`);
console.log(`Total changes: ${totalUpdates}`);
