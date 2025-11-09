#!/usr/bin/env node
/**
 * Check which forms are missing the usage frequency field
 */

const fs = require('fs');
const path = require('path');

function checkMissingForms(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');

    // Find all form IDs
    const formPattern = /<form id="reviewForm-([^"]+)">/g;
    const allForms = [];
    let match;

    while ((match = formPattern.exec(content)) !== null) {
        allForms.push(match[1]);
    }

    // Find all forms that have usageFrequency
    const usagePattern = /usageFrequency-([a-zA-Z0-9]+)/g;
    const formsWithUsage = new Set();

    while ((match = usagePattern.exec(content)) !== null) {
        formsWithUsage.add(match[1]);
    }

    console.log(`Total forms: ${allForms.length}`);
    console.log(`Forms with usageFrequency: ${formsWithUsage.size}`);
    console.log();

    const missingForms = allForms.filter(id => !formsWithUsage.has(id));

    console.log(`Missing usageFrequency field (${missingForms.length} forms):`);
    missingForms.forEach((id, i) => {
        console.log(`  ${i + 1}. ${id}`);
    });

    console.log();
    console.log(`Forms with usageFrequency (${formsWithUsage.size} forms):`);
    Array.from(formsWithUsage).sort().forEach((id, i) => {
        console.log(`  ${i + 1}. ${id}`);
    });

    return missingForms;
}

const filePath = path.join('c:', 'Users', 'Dewy', 'OneDrive', 'Documents', 'JamWatHQ', 'Main', 'Code', 'frontend', 'agencies.html');
const missing = checkMissingForms(filePath);

// Save missing forms to a file for reference
fs.writeFileSync('missing_forms.json', JSON.stringify(missing, null, 2));
console.log();
console.log('Missing forms saved to missing_forms.json');
