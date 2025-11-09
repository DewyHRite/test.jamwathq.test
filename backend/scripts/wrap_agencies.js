const fs = require('fs');
const path = require('path');

const targetPath = path.resolve(__dirname, '../../frontend/agencies.html');

// Read the file
let content = fs.readFileSync(targetPath, 'utf8');

// List of all agency IDs
const agencyIds = [
    '10881', 'A1', 'Access', 'Acep', 'Adnil', 'Akey1', 'Alphanso', 'Arize',
    'Atlantic', 'Atsed', 'Beadles', 'CapeCod', 'CCS', 'Checkin', 'Csa', 'Cuse',
    'CY', 'Dallas', 'Destin', 'Dgs', 'DJ', 'Dorryus', 'Ejam', 'ExploreWork',
    'ExploreYourWorld', 'FaithPlacement', 'FirstClass', 'FlyerZone', 'Gamma',
    'GlobalInsight', 'GoldenLuxe', 'GTG', 'HRElite', 'ICDE', 'InterExchange',
    'IRSS', 'IslandPlus', 'ITCE', 'IWTS', 'JAB', 'JD', 'Joyst', 'Laconic',
    'LenClair', 'Lils', 'MaxJ', 'Mayfos', 'Mcleans', 'MH', 'Owt', 'Passport',
    'Patriots', 'Platinum', 'Polaris', 'Practical', 'Progressive', 'Seaview',
    'Seramil', 'Skills', 'Snow', 'Sora', 'Steep', 'Summerchoice', 'Swat',
    'Tander', 'Thelia', 'Trailes', 'Travelaire', 'TrevorHamilton', 'WorkAbroad'
];

// Already wrapped IDs (from grep count)
const wrapped = ['10881', 'Arize', 'A1', 'Access', 'Adnil', 'Acep', 'Akey1', 'Alphanso', 'Atlantic', 'Atsed', 'Beadles'];

// IDs that need wrapping
const needsWrapping = agencyIds.filter(id => !wrapped.includes(id));

console.log(`Need to wrap ${needsWrapping.length} agencies`);

// Process each agency
let wrappedCount = 0;
for (const agencyId of needsWrapping) {
    // Pattern to find the submit button for this agency
    const submitPattern = `onclick="submitReview${agencyId}()">Submit Review</button>`;

    if (!content.includes(submitPattern)) {
        console.log(`Skipping ${agencyId} - not found`);
        continue;
    }

    // Find the pattern: submit button, closing tags, leave review button, closing div, then next card
    const pattern = new RegExp(
        `(submitReview${agencyId}\\(\\)">Submit Review</button>[\\s\\S]*?` +
        `<button type="button" class="btn btn-primary" onclick="toggleReviewSection\\(this\\)">Leave a Review</button>\\s*` +
        `</div>)\\s*\\n\\s*\\n\\s*` +
        `(<div class="agency-info compact">)`,
        'g'
    );

    const replacement = `$1\n\n    <div class="past-reviews-box" id="reviews-${agencyId.toLowerCase()}">\n` +
        `        <h3>Past Reviews</h3>\n` +
        `        <div class="no-reviews-message">\n` +
        `            No reviews as yet\n` +
        `        </div>\n` +
        `    </div>\n` +
        `</div>\n\n` +
        `<div class="agency-wrapper" id="wrapper-${agencyId.toLowerCase()}">\n    $2`;

    const newContent = content.replace(pattern, replacement);

    if (newContent !== content) {
        content = newContent;
        wrappedCount++;
        console.log(`Wrapped ${agencyId}`);
    } else {
        console.log(`Could not wrap ${agencyId}`);
    }
}

// Handle the last agency - it won't have a next card to match
const lastAgency = needsWrapping[needsWrapping.length - 1];
const lastPattern = new RegExp(
    `(submitReview${lastAgency}\\(\\)">Submit Review</button>[\\s\\S]*?` +
    `<button type="button" class="btn btn-primary" onclick="toggleReviewSection\\(this\\)">Leave a Review</button>\\s*` +
    `</div>)\\s*\\n`,
    'g'
);

const lastReplacement = `$1\n\n    <div class="past-reviews-box" id="reviews-${lastAgency.toLowerCase()}">\n` +
    `        <h3>Past Reviews</h3>\n` +
    `        <div class="no-reviews-message">\n` +
    `            No reviews as yet\n` +
    `        </div>\n` +
    `    </div>\n` +
    `</div>\n`;

content = content.replace(lastPattern, lastReplacement);

// Write the result
fs.writeFileSync(targetPath, content, 'utf8');

console.log(`\\nTotal wrapped: ${wrappedCount} agencies`);
console.log('File updated successfully!');
