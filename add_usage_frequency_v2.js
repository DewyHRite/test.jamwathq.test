#!/usr/bin/env node
/**
 * Script to add the mandatory "How many times have you used this agency?" question
 * to all agency review forms in agencies.html (excluding the first one which already has it).
 * Version 2: More flexible pattern matching
 */

const fs = require('fs');
const path = require('path');

function addUsageFrequencyToForms(filePath) {
    // Read the file
    let content = fs.readFileSync(filePath, 'utf-8');

    // Find all form IDs
    const formPattern = /<form id="reviewForm-([^"]+)">/g;
    const forms = [];
    let match;

    while ((match = formPattern.exec(content)) !== null) {
        forms.push(match[1]);
    }

    console.log(`Total forms found: ${forms.length}`);
    console.log(`Forms: ${forms.join(', ')}`);
    console.log();

    // Skip the first form (10881) as it already has the field
    const formsToModify = forms.filter(f => f !== '10881');

    console.log(`Forms to modify: ${formsToModify.length}`);
    console.log();

    let modifiedCount = 0;
    const modifiedAgencies = [];
    const failedAgencies = [];

    // For each form (except 10881), add the usage frequency field
    for (const agencyId of formsToModify) {
        // Pattern to find the location to insert the new field
        // More flexible pattern that handles various spacing
        const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        const pattern = new RegExp(
            '</div>\\s*' +
            '<br\\s*/?>\\s*' +
            '(<!--\\s*Comments\\s*-->\\s*' +
            '<label\\s+for="comments-' + escapeRegex(agencyId) + '">)',
            ''
        );

        // The replacement includes the usage frequency field
        const replacement =
            '</div>\n' +
            '                      <br />\n' +
            '\n' +
            '                      <!-- Mandatory Question: Usage Frequency -->\n' +
            '                      <div class="usage-frequency-group">\n' +
            '                        <label for="usageFrequency-' + agencyId + '">\n' +
            '                          How many times have you used this agency?\n' +
            '                        </label>\n' +
            '                        <select id="usageFrequency-' + agencyId + '" name="usageFrequency-' + agencyId + '" required>\n' +
            '                          <option value="" disabled selected>Please select...</option>\n' +
            '                          <option value="1">1 time</option>\n' +
            '                          <option value="2-3">2-3 times</option>\n' +
            '                          <option value="4-5">4-5 times</option>\n' +
            '                          <option value="6+">6+ times</option>\n' +
            '                        </select>\n' +
            '                      </div>\n' +
            '\n' +
            '                      $1';

        // Check if pattern exists
        const matches = content.match(pattern);
        if (matches) {
            content = content.replace(pattern, replacement);
            modifiedCount++;
            modifiedAgencies.push(agencyId);
            console.log(`✓ Modified form: ${agencyId}`);
        } else {
            failedAgencies.push(agencyId);
            console.log(`✗ Could not find pattern for: ${agencyId}`);
        }
    }

    // Write the modified content back
    fs.writeFileSync(filePath, content, 'utf-8');

    console.log();
    console.log('='.repeat(60));
    console.log('SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total forms found: ${forms.length}`);
    console.log(`Total forms modified: ${modifiedCount}`);
    console.log(`Expected modifications: ${formsToModify.length}`);
    console.log();

    if (modifiedAgencies.length > 0) {
        console.log('Modified agency IDs:');
        modifiedAgencies.forEach((id, i) => {
            console.log(`  ${i + 1}. ${id}`);
        });
        console.log();
    }

    if (failedAgencies.length > 0) {
        console.log('Failed agency IDs (need manual review):');
        failedAgencies.forEach((id, i) => {
            console.log(`  ${i + 1}. ${id}`);
        });
        console.log();
    }

    if (modifiedCount === formsToModify.length) {
        console.log('SUCCESS: All forms have been updated!');
        return 0;
    } else {
        console.log(`WARNING: Expected to modify ${formsToModify.length} forms but only modified ${modifiedCount}`);
        console.log(`Need to handle ${failedAgencies.length} forms manually or with a different pattern.`);
        return 1;
    }
}

const filePath = path.join('c:', 'Users', 'Dewy', 'OneDrive', 'Documents', 'JamWatHQ', 'Main', 'Code', 'frontend', 'agencies.html');
process.exit(addUsageFrequencyToForms(filePath));
