import re

# Read the file
with open('frontend/agencies.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern to match: View Past Reviews button followed by Leave a Review button
# This pattern captures the agency ID and handles the swap
pattern = r'(\s+)<button type="button" class="view-past-reviews-btn-semi" onclick="togglePastReviews\(\'([^\']+)\'\)">\s+◄ View Past Reviews\s+</button>\s+<button type="button" class="btn btn-primary" onclick="toggleReviewSection\(this, event\)">\s+Leave a Review\s+</button>'

# Replacement: Leave a Review first, then View Past Reviews
replacement = r'\1<button type="button" class="btn btn-primary" onclick="toggleReviewSection(this, event)">\n\1  Leave a Review\n\1</button>\n\1<button type="button" class="view-past-reviews-btn-semi" onclick="togglePastReviews(\'\2\')">\n\1  ◄ View Past Reviews\n\1</button>'

# Perform the replacement
new_content = re.sub(pattern, replacement, content)

# Count how many replacements were made
count = len(re.findall(pattern, content))
print(f"Found and swapped {count} button pairs")

# Write back to file
with open('frontend/agencies.html', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Button order swap complete!")
