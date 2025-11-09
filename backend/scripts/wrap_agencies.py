import os
import re

base_dir = os.path.dirname(__file__)
target_path = os.path.normpath(os.path.join(base_dir, '../../frontend/agencies.html'))

# Read the file
with open(target_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Find all agency cards that are NOT already wrapped
# Pattern to match agency cards not in a wrapper
pattern = r'(?<!<div class="agency-wrapper"[^>]*>\n)(<div class="agency-info compact">.*?</div>\n)'

# Counter for unique IDs
agency_count = 0

def wrap_agency(match):
    global agency_count
    agency_count += 1

    # Extract agency name from the card
    agency_card = match.group(1)
    name_match = re.search(r'<h3[^>]*>(.*?)</h3>', agency_card)

    # Create a simple ID based on count
    agency_id = f'agency-{agency_count}'

    # Create the wrapper with reviews box
    wrapped = f'''<div class="agency-wrapper" id="wrapper-{agency_id}">
{agency_card}
    <div class="past-reviews-box" id="reviews-{agency_id}">
        <h3>Past Reviews</h3>
        <div class="no-reviews-message">
            No reviews as yet
        </div>
    </div>
</div>

'''
    return wrapped

# This is complex because agency cards span multiple lines
# Let's use a different approach - find each card individually

# Split content by agency cards
lines = content.split('\n')
output_lines = []
i = 0

while i < len(lines):
    line = lines[i]

    # Check if this is a standalone agency card (not already in wrapper)
    if '<div class="agency-info compact">' in line:
        # Check if previous line is NOT a wrapper opening
        if i == 0 or 'agency-wrapper' not in lines[i-1]:
            # Found a standalone card, need to wrap it
            agency_count += 1
            agency_id = f'agency-{agency_count}'

            # Add wrapper opening
            output_lines.append(f'<div class="agency-wrapper" id="wrapper-{agency_id}">')
            output_lines.append(line)

            # Continue until we find the closing </div> for this card
            i += 1
            depth = 1
            while i < len(lines) and depth > 0:
                line = lines[i]
                if '<div' in line and 'class=' in line:
                    depth += 1
                if '</div>' in line:
                    depth -= 1

                output_lines.append(line)

                if depth == 0:
                    # Add reviews box
                    output_lines.append('')
                    output_lines.append(f'    <div class="past-reviews-box" id="reviews-{agency_id}">')
                    output_lines.append('        <h3>Past Reviews</h3>')
                    output_lines.append('        <div class="no-reviews-message">')
                    output_lines.append('            No reviews as yet')
                    output_lines.append('        </div>')
                    output_lines.append('    </div>')
                    output_lines.append('</div>')
                    break

                i += 1
        else:
            # Already wrapped, just copy
            output_lines.append(line)
    else:
        output_lines.append(line)

    i += 1

# Write the output
output_path = os.path.normpath(os.path.join(base_dir, '../../frontend/agencies_wrapped.html'))
with open(output_path, 'w', encoding='utf-8') as f:
    f.write('\n'.join(output_lines))

print(f"Wrapped {agency_count} agency cards")
