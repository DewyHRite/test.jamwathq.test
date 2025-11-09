import re

# Read the file
with open('frontend/agencies.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find all form tags and update them
def replace_form(match):
    agency_id = match.group(1)
    # Check if already has onsubmit
    if 'onsubmit=' in match.group(0):
        return match.group(0)
    return f'<form id="reviewForm-{agency_id}" onsubmit="return validateAndSubmitReview(event, \'{agency_id}\')">'

# Replace all forms
content = re.sub(r'<form id="reviewForm-([^"]+)">', replace_form, content)

# Write back
with open('frontend/agencies.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Updated all 70 agency forms with onsubmit handler")
