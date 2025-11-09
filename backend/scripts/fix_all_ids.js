const fs = require('fs');
const path = require('path');
const targetPath = path.resolve(__dirname, '../../frontend/agencies.html');
let content = fs.readFileSync(targetPath, 'utf8');

// Find all agencies and their correct IDs from submitReview functions
const agencies = [];
const submitRegex = /onclick="submitReview([A-Za-z0-9]+)\(\)">Submit Review<\/button>([\s\S]*?)<button type="button" class="btn btn-primary" onclick="toggleReviewSection\(this\)">Leave a Review<\/button>\s*<\/div>/g;

let match;
while ((match = submitRegex.exec(content)) !== null) {
    agencies.push({
        id: match[1],
        endPos: match.index + match[0].length
    });
}

console.log(`Found ${agencies.length} agencies`);

// Now replace each agency's reviews box and wrapper with correct IDs
for (let i = 0; i < agencies.length; i++) {
    const currentId = agencies[i].id;
    const nextPos = i < agencies.length - 1 ? agencies[i + 1].endPos : content.length;

    // Pattern to find the reviews box after this agency
    const reviewsPattern = new RegExp(
        `(onclick="submitReview${currentId}\\(\\)">Submit Review</button>[\\s\\S]*?` +
        `<button type="button" class="btn btn-primary" onclick="toggleReviewSection\\(this\\)">Leave a Review</button>\\s*</div>)\\s*\\n\\s*\\n\\s*` +
        `<div class="past-reviews-box" id="reviews-[^"]*">`,
        'g'
    );

    content = content.replace(reviewsPattern,
        `$1\n\n    <div class="past-reviews-box" id="reviews-${currentId.toLowerCase()}">`);

    // Pattern to find the wrapper opening for next agency
    if (i < agencies.length - 1) {
        const nextId = agencies[i + 1].id;
        const wrapperPattern = new RegExp(
            `(<div class="past-reviews-box" id="reviews-${currentId.toLowerCase()}">` +
            `[\\s\\S]*?</div>\\s*</div>)\\s*\\n\\s*\\n\\s*` +
            `<div class="agency-wrapper" id="wrapper-[^"]*">`,
            'g'
        );

        content = content.replace(wrapperPattern,
            `$1\n\n<div class="agency-wrapper" id="wrapper-${nextId.toLowerCase()}">`);
    }
}

fs.writeFileSync(targetPath, content, 'utf8');
console.log('All IDs fixed!');
