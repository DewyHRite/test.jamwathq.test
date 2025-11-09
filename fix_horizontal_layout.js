const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing gear icon layout - Horizontal with 45deg rotation...\n');

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

// Old CSS pattern (vertical layout, 180deg rotation)
const oldCSSPattern1 = /\/\* Fixed Support Container - Vertical Layout with Button Above Gear Icon \*\/\s+\.support-container\s*\{[\s\S]*?flex-direction:\s*column;[\s\S]*?\}\s+\/\* Vertical Report Button - Positioned Above Gear Icon \*\/\s+\.report-problem-btn\s*\{[\s\S]*?transform:\s*rotate\(180deg\);[\s\S]*?\}\s+\.report-problem-btn:hover\s*\{[\s\S]*?transform:\s*rotate\(180deg\)\s*scale\(1\.05\);[\s\S]*?\}/;

// New CSS (horizontal layout, 45deg rotation)
const newCSS = `/* Fixed Support Container - Horizontal Layout with Button Beside Gear Icon */
      .support-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 15px;
        z-index: 1000;
      }

      /* Report Button - Positioned Beside Gear Icon with 45deg Rotation */
      .report-problem-btn {
        transform: rotate(45deg);
        background: #000000;
        color: #ffee00;
        border: 2px solid #ffee00;
        border-radius: 25px;
        padding: 12px 20px;
        font-size: 13px;
        font-weight: bold;
        font-family: "Montserrat", Arial, sans-serif;
        cursor: pointer;
        transition: all 0.3s ease;
        text-decoration: none !important;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(255, 238, 0, 0.2);
        letter-spacing: 1px;
        white-space: nowrap;
      }

      .report-problem-btn:hover {
        background: #ffee00;
        color: #000000;
        border-color: #28a745;
        box-shadow: 0 6px 20px rgba(255, 238, 0, 0.5);
        transform: rotate(45deg) scale(1.05);
      }`;

// Old responsive CSS pattern
const oldResponsivePattern = /\.report-problem-btn\s*\{\s*padding:\s*12px\s+8px;\s*font-size:\s*11px;\s*\}/;

// New responsive CSS
const newResponsive = `.report-problem-btn {
          padding: 10px 16px;
          font-size: 11px;
        }`;

let totalUpdates = 0;
let successCount = 0;
let failCount = 0;

files.forEach(file => {
  const filePath = path.join(__dirname, file);

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let fileUpdates = 0;

    // Try to find and replace the main CSS
    // Pattern 1: Look for "flex-direction: column" and "rotate(180deg)"
    if (content.includes('flex-direction: column') && content.includes('rotate(180deg)')) {
      // Replace flex-direction
      content = content.replace(/flex-direction:\s*column;/g, 'flex-direction: row;');

      // Replace writing-mode and text-orientation (remove them)
      content = content.replace(/writing-mode:\s*vertical-rl;\s*/g, '');
      content = content.replace(/text-orientation:\s*mixed;\s*/g, '');

      // Replace rotate(180deg) with rotate(45deg)
      content = content.replace(/transform:\s*rotate\(180deg\);/g, 'transform: rotate(45deg);');
      content = content.replace(/transform:\s*rotate\(180deg\)\s*scale\(1\.05\);/g, 'transform: rotate(45deg) scale(1.05);');

      // Update padding from vertical to horizontal
      content = content.replace(/padding:\s*15px\s+10px;/g, 'padding: 12px 20px;');

      // Add white-space: nowrap
      if (!content.includes('white-space: nowrap;')) {
        content = content.replace(
          /(\.report-problem-btn\s*\{[^}]*letter-spacing:\s*1px;)/,
          '$1\n        white-space: nowrap;'
        );
      }

      // Update comment from "Vertical" to "Horizontal" and "Above" to "Beside"
      content = content.replace(
        /\/\* Fixed Support Container - Vertical Layout with Button Above Gear Icon \*\//g,
        '/* Fixed Support Container - Horizontal Layout with Button Beside Gear Icon */'
      );
      content = content.replace(
        /\/\* Vertical Report Button - Positioned Above Gear Icon \*\//g,
        '/* Report Button - Positioned Beside Gear Icon with 45deg Rotation */'
      );
      content = content.replace(
        /\/\* Floating Gear Icon - Positioned Below Button with Yellow Glow \*\//g,
        '/* Floating Gear Icon - Positioned Beside Button with Yellow Glow */'
      );

      // Update responsive padding
      content = content.replace(/padding:\s*12px\s+8px;/g, 'padding: 10px 16px;');

      fileUpdates++;
      console.log(`✅ Updated ${file}`);
    } else {
      console.log(`⚠️  Pattern not found in ${file}`);
    }

    if (fileUpdates > 0) {
      fs.writeFileSync(filePath, content, 'utf8');
      totalUpdates += fileUpdates;
      successCount++;
    } else {
      failCount++;
    }

  } catch (error) {
    console.error(`❌ Error processing ${file}:`, error.message);
    failCount++;
  }
});

console.log(`\n🎉 Complete!`);
console.log(`✅ Successfully updated: ${successCount} files`);
console.log(`⚠️  Failed/Skipped: ${failCount} files`);
console.log(`\nTotal changes: ${totalUpdates}`);
