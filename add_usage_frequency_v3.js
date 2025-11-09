#!/usr/bin/env node
/**
 * Script to add the mandatory "How many times have you used this agency?" question
 * to the remaining forms that don't have the <!-- Comments --> comment line.
 * Version 3: Handle forms without the Comments comment
 */

const fs = require('fs');
const path = require('path');

function addUsageFrequencyToForms(filePath) {
    // Read the file
    let content = fs.readFileSync(filePath, 'utf-8');

    // List of forms that are still missing the field (from check_missing.js)
    const missingForms = [
        'mayfos', 'mcleans', 'owt', 'patriots', 'platinum', 'polaris',
        'practical', 'progressive', 'seaview', 'seramil', 'skills',
        'steep', 'snow', 'sora', 'summerchoice', 'swat', 'tander',
        'passport', 'thelia', 'trailes', 'travelaire'
    ];

    console.log(`Forms to modify: ${missingForms.length}`);
    console.log();

    let modifiedCount = 0;
    const modifiedAgencies = [];
    const failedAgencies = [];

    // For each missing form, add the usage frequency field
    for (const agencyId of missingForms) {
        // Pattern for forms WITHOUT the <!-- Comments --> comment line
        // Looking for: </div>\n      <br />\n      <label for="comments-{id}">
        const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        const pattern = new RegExp(
            '</div>\\s*' +
            '<br\\s*/?>\\s*' +
            '(<label\\s+for="comments-' + escapeRegex(agencyId) + '">)',
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
            '                      <br />\n' +
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
    console.log(`Total forms to modify: ${missingForms.length}`);
    console.log(`Total forms modified: ${modifiedCount}`);
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

    if (modifiedCount === missingForms.length) {
        console.log('SUCCESS: All remaining forms have been updated!');
        return 0;
    } else {
        console.log(`WARNING: Expected to modify ${missingForms.length} forms but only modified ${modifiedCount}`);
        return 1;
    }
}

const filePath = path.join('c:', 'Users', 'Dewy', 'OneDrive', 'Documents', 'JamWatHQ', 'Main', 'Code', 'frontend', 'agencies.html');
process.exit(addUsageFrequencyToForms(filePath));
