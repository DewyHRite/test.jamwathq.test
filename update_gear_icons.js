const fs = require('fs');
const path = require('path');

console.log('🔧 Updating gear icon styling across all pages...\n');

// Files to update
const files = [
  'frontend/faq.html',
  'frontend/guide.html'
];

// CSS to search for and replace
const oldCSS = `      /* Floating Gear Icon - Optimized */
      .floating-gear-icon {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: #ffee00;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(255, 238, 0, 0.3);
        cursor: pointer;
        z-index: 1000;
        transition: all 0.3s ease;
        text-decoration: none !important;
      }

      .floating-gear-icon:hover {
        background: #fff700;
        transform: scale(1.1) rotate(90deg);
        box-shadow: 0 6px 20px rgba(255, 238, 0, 0.5);
      }

      .floating-gear-icon i {
        font-size: 20px;
        color: #000000;
        transition: transform 0.3s ease;
      }

      .floating-gear-icon:hover i {
        color: #333333;
      }

      /* Tooltip for gear icon */
      .floating-gear-icon::before {
        content: "Report a problem";
        position: absolute;
        left: auto;
        right: calc(100% + 12px);
        top: 50%;
        transform: translateY(-50%);
        background: #333333;
        color: #ffffff;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        font-family: "Montserrat", Arial, sans-serif;
        white-space: nowrap;
        opacity: 0;
        visibility: hidden;
        transition:
          opacity 0.3s ease,
          visibility 0.3s ease;
        pointer-events: none;
        display: block;
        text-align: center;
        min-width: 100px;
        border: 1px solid #ffee00;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      }

      .floating-gear-icon::after {
        content: "";
        position: absolute;
        left: auto;
        right: calc(100% + 2px);
        top: 50%;
        transform: translateY(-50%);
        width: 0;
        height: 0;
        border-right: 8px solid #333333;
        border-top: 6px solid transparent;
        border-bottom: 6px solid transparent;
        opacity: 0;
        visibility: hidden;
        transition:
          opacity 0.3s ease,
          visibility 0.3s ease;
        pointer-events: none;
      }

      .floating-gear-icon:hover::before,
      .floating-gear-icon:hover::after {
        opacity: 1;
        visibility: visible;
      }

      /* Responsive adjustments */
      @media (max-width: 768px) {
        .floating-gear-icon {
          width: 45px;
          height: 45px;
          bottom: 15px;
          right: 15px;
        }

        .floating-gear-icon i {
          font-size: 18px;
        }

        .floating-gear-icon::before {
          right: calc(100% + 10px);
          font-size: 11px;
          padding: 6px 10px;
        }

        .floating-gear-icon::after {
          right: calc(100% + 1px);
          border-right-width: 6px;
        }
      }`;

const newCSS = `      /* Fixed Support Container - Vertical Layout with Button Above Gear Icon */
      .support-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 15px;
        z-index: 1000;
      }

      /* Vertical Report Button - Positioned Above Gear Icon */
      .report-problem-btn {
        writing-mode: vertical-rl;
        text-orientation: mixed;
        transform: rotate(180deg);
        background: #000000;
        color: #ffee00;
        border: 2px solid #ffee00;
        border-radius: 25px;
        padding: 15px 10px;
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
      }

      .report-problem-btn:hover {
        background: #ffee00;
        color: #000000;
        border-color: #28a745;
        box-shadow: 0 6px 20px rgba(255, 238, 0, 0.5);
        transform: rotate(180deg) scale(1.05);
      }

      /* Floating Gear Icon - Positioned Below Button with Yellow Glow */
      .floating-gear-icon {
        width: 50px;
        height: 50px;
        background: #ffee00;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow:
          0 4px 12px rgba(255, 238, 0, 0.4),
          0 0 20px rgba(255, 238, 0, 0.6),
          0 0 40px rgba(255, 238, 0, 0.3);
        cursor: pointer;
        transition: all 0.3s ease;
        text-decoration: none !important;
        border: 2px solid #ffee00;
      }

      .floating-gear-icon:hover {
        background: #fff700;
        transform: scale(1.1) rotate(90deg);
        box-shadow:
          0 6px 20px rgba(255, 238, 0, 0.6),
          0 0 30px rgba(255, 238, 0, 0.8),
          0 0 60px rgba(255, 238, 0, 0.5);
      }

      .floating-gear-icon i {
        font-size: 20px;
        color: #000000;
        transition: transform 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .floating-gear-icon:hover i {
        color: #333333;
      }

      /* Responsive adjustments */
      @media (max-width: 768px) {
        .support-container {
          bottom: 15px;
          right: 15px;
          gap: 12px;
        }

        .report-problem-btn {
          padding: 12px 8px;
          font-size: 11px;
        }

        .floating-gear-icon {
          width: 45px;
          height: 45px;
        }

        .floating-gear-icon i {
          font-size: 18px;
        }
      }`;

// HTML to search for and replace
const oldHTML = `    <!-- Floating Gear Icon for Settings/Support -->
    <a href="#footer" class="floating-gear-icon" title="Contact & Support">
      <i class="fa fa-cog"></i>
    </a>`;

const newHTML = `    <!-- Support Container - Vertical Layout with Report Button Above Gear Icon -->
    <div class="support-container">
      <!-- Vertical Report Problem Button (Above) -->
      <a href="#footer" class="report-problem-btn" title="Report a problem">
        Report a problem
      </a>
      <!-- Floating Gear Icon with Yellow Glow (Below) -->
      <a href="#footer" class="floating-gear-icon" title="Contact & Support">
        <i class="fa fa-cog"></i>
      </a>
    </div>`;

let totalUpdates = 0;

files.forEach(file => {
  const filePath = path.join(__dirname, file);

  try {
    // Read file
    let content = fs.readFileSync(filePath, 'utf8');

    let updates = 0;

    // Replace CSS
    if (content.includes(oldCSS)) {
      content = content.replace(oldCSS, newCSS);
      updates++;
      console.log(`✅ Updated CSS in ${file}`);
    }

    // Replace HTML
    if (content.includes(oldHTML)) {
      content = content.replace(oldHTML, newHTML);
      updates++;
      console.log(`✅ Updated HTML in ${file}`);
    }

    if (updates > 0) {
      // Write back to file
      fs.writeFileSync(filePath, content, 'utf8');
      totalUpdates += updates;
      console.log(`   ${updates} changes made to ${file}\n`);
    } else {
      console.log(`⚠️  No changes needed for ${file}\n`);
    }

  } catch (error) {
    console.error(`❌ Error processing ${file}:`, error.message);
  }
});

console.log(`\n🎉 Complete! Total updates: ${totalUpdates}`);
console.log('\nUpdated files:');
files.forEach(file => console.log(`  - ${file}`));
