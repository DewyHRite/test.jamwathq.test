#!/usr/bin/env python3
"""
Script to add the mandatory "How many times have you used this agency?" question
to all agency review forms in agencies.html (excluding the first one which already has it).
"""

import re
import sys

def add_usage_frequency_to_forms(file_path):
    """
    Add usage frequency field to all forms except the first one (10881).
    """
    # Read the file
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find all form IDs
    form_pattern = r'<form id="reviewForm-([^"]+)">'
    forms = re.findall(form_pattern, content)

    print(f"Total forms found: {len(forms)}")
    print(f"Forms: {forms}")
    print()

    # Skip the first form (10881) as it already has the field
    forms_to_modify = [f for f in forms if f != '10881']

    print(f"Forms to modify: {len(forms_to_modify)}")
    print()

    modified_count = 0
    modified_agencies = []

    # For each form (except 10881), add the usage frequency field
    for agency_id in forms_to_modify:
        # Pattern to find the location to insert the new field
        # We look for: </div>\n      <br />\n      <!-- Comments -->
        # And insert before <!-- Comments -->

        pattern = (
            r'(</div>\n                      <br />\n)'
            r'(                      <!-- Comments -->\n'
            r'                      <label for="comments-' + re.escape(agency_id) + r'">Comments:</label>)'
        )

        # The replacement includes the usage frequency field
        replacement = (
            r'\1'
            r'\n'
            r'                      <!-- Mandatory Question: Usage Frequency -->\n'
            r'                      <div class="usage-frequency-group">\n'
            r'                        <label for="usageFrequency-' + agency_id + r'">\n'
            r'                          How many times have you used this agency?\n'
            r'                        </label>\n'
            r'                        <select id="usageFrequency-' + agency_id + r'" name="usageFrequency-' + agency_id + r'" required>\n'
            r'                          <option value="" disabled selected>Please select...</option>\n'
            r'                          <option value="1">1 time</option>\n'
            r'                          <option value="2-3">2-3 times</option>\n'
            r'                          <option value="4-5">4-5 times</option>\n'
            r'                          <option value="6+">6+ times</option>\n'
            r'                        </select>\n'
            r'                      </div>\n'
            r'\n'
            r'\2'
        )

        # Check if pattern exists
        if re.search(pattern, content):
            content = re.sub(pattern, replacement, content)
            modified_count += 1
            modified_agencies.append(agency_id)
            print(f"✓ Modified form: {agency_id}")
        else:
            print(f"✗ Could not find pattern for: {agency_id}")

    # Write the modified content back
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print()
    print("=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"Total forms found: {len(forms)}")
    print(f"Total forms modified: {modified_count}")
    print(f"Expected modifications: {len(forms_to_modify)}")
    print()
    print("Modified agency IDs:")
    for i, agency_id in enumerate(modified_agencies, 1):
        print(f"  {i}. {agency_id}")

    if modified_count == len(forms_to_modify):
        print()
        print("SUCCESS: All forms have been updated!")
        return 0
    else:
        print()
        print(f"WARNING: Expected to modify {len(forms_to_modify)} forms but only modified {modified_count}")
        return 1

if __name__ == "__main__":
    file_path = r"c:\Users\Dewy\OneDrive\Documents\JamWatHQ\Main\Code\frontend\agencies.html"
    sys.exit(add_usage_frequency_to_forms(file_path))
