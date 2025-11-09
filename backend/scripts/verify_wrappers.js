const fs = require('fs');
const path = require('path');
const targetPath = path.resolve(__dirname, '../../frontend/agencies.html');
const content = fs.readFileSync(targetPath, 'utf8');

// Extract all submitReview IDs
const submitMatches = content.matchAll(/submitReview([A-Za-z0-9]+)/g);
const submitIds = new Set();
for (const match of submitMatches) {
    submitIds.add(match[1]);
}

// Extract all wrapper IDs
const wrapperMatches = content.matchAll(/wrapper-([a-z0-9]+)/g);
const wrapperIds = new Set();
for (const match of wrapperMatches) {
    wrapperIds.add(match[1]);
}

console.log('Submit IDs:', submitIds.size);
console.log('Wrapper IDs:', wrapperIds.size);

// Find missing wrappers
const missing = [];
for (const id of submitIds) {
    const lowerId = id.toLowerCase();
    if (!wrapperIds.has(lowerId)) {
        missing.push(id);
    }
}

if (missing.length > 0) {
    console.log('\nMissing wrappers for:');
    missing.forEach(id => console.log(`  - ${id}`));
} else {
    console.log('\nAll agencies have wrappers!');
}

// Find extra wrappers
const extra = [];
for (const id of wrapperIds) {
    let found = false;
    for (const submitId of submitIds) {
        if (submitId.toLowerCase() === id) {
            found = true;
            break;
        }
    }
    if (!found) {
        extra.push(id);
    }
}

if (extra.length > 0) {
    console.log('\nExtra wrappers (no matching submitReview):');
    extra.forEach(id => console.log(`  - ${id}`));
}
