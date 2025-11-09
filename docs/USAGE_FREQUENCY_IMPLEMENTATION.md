# Usage Frequency Question Implementation

## Overview
This document details the implementation of a mandatory usage frequency question across both agency review forms and state experience forms in the JamWatHQ application.

---

## 📋 Implementation Summary

### **Task Completed**
Added a mandatory multiple-choice question asking users how many times they've used an agency (for agency reviews) or worked in a state (for state reviews), with options limited to 1, 2, 3, 4, and 5+.

### **Files Modified**
1. ✅ **`frontend/agencies.html`** - Already had usage frequency implementation (verified)
2. ✅ **`frontend/share-experience.html`** - Added usage frequency question (new implementation)

---

## 🎨 Design & Styling

### **Visual Design**
- **Highlighted Container**: Yellow-tinted background (`rgba(255, 238, 0, 0.08)`) with left border
- **Required Field Indicator**: Red asterisk (*) auto-appended to label
- **Focus State**: Green border with glow effect on focus
- **Invalid State**: Red border when field is invalid
- **Responsive**: Full-width on mobile (max-width: 768px)

### **CSS Classes**
```css
.usage-frequency-group {
    background: rgba(255, 238, 0, 0.08);
    border-left: 3px solid #ffee00;
    border-radius: 6px;
    padding: 1em;
    margin: 1em 0;
}
```

---

## 📝 Form Implementation Details

### **Agency Review Forms** (`agencies.html`)
**Location**: After star rating, before comments textarea
**Question Text**: "How many times have you used this agency?"
**Implementation Status**: ✅ Already Complete (70 forms)

**HTML Structure**:
```html
<!-- Mandatory Question: Usage Frequency -->
<div class="usage-frequency-group">
    <label for="usageFrequency-{agencyId}">
        How many times have you used this agency?
    </label>
    <select id="usageFrequency-{agencyId}" name="usageFrequency-{agencyId}" required>
        <option value="" disabled selected>Please select...</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5+</option>
    </select>
</div>
```

**Field IDs**: Unique per agency (e.g., `usageFrequency-10881`, `usageFrequency-arize`)

---

### **State Experience Form** (`share-experience.html`)
**Location**: After star rating, before experience textarea
**Question Text**: "How many times have you worked in this state?"
**Implementation Status**: ✅ Newly Added

**HTML Structure** (lines 713-726):
```html
<!-- Mandatory Question: Usage Frequency -->
<div class="usage-frequency-group">
    <label for="usageFrequency">
        How many times have you worked in this state?
    </label>
    <select id="usageFrequency" name="usageFrequency" required>
        <option value="" disabled selected>Please select...</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5+</option>
    </select>
</div>
```

**Field ID**: Single global field (`usageFrequency`) since only one state review at a time

**JavaScript Integration** (lines 1127, 1147):
```javascript
// Form data collection now includes:
usageFrequency: document.getElementById('usageFrequency').value
```

---

## ✅ Validation & Requirements

### **Client-Side Validation**
- **HTML5 Required Attribute**: `<select required>` prevents submission without selection
- **Browser Validation**: Native browser validation kicks in on form submit
- **Visual Feedback**: Invalid fields show red border (CSS: `select:required:invalid`)

### **Form Submission Flow**
1. User fills out form
2. User clicks "Submit"
3. Browser validates all `required` fields
4. If usage frequency not selected → Browser shows error
5. If all fields valid → OAuth/TOS flow proceeds

### **Default State**
- Placeholder option: "Please select..." (disabled, selected by default)
- Value: `""` (empty string, triggers validation failure)

---

## ♿ Accessibility Features

### **Keyboard Navigation**
- ✅ **Tab Order**: Field is keyboard-navigable via Tab key
- ✅ **Arrow Keys**: Dropdown navigable with up/down arrows
- ✅ **Enter/Space**: Opens dropdown for selection

### **Screen Reader Support**
- ✅ **Label Association**: `<label for="usageFrequency">` properly linked to `<select id="usageFrequency">`
- ✅ **Required Announcement**: Screen readers announce field as "required"
- ✅ **Clear Question Text**: Descriptive label text for context
- ✅ **Option Values**: Each option has clear numeric text (1, 2, 3, 4, 5+)

### **WCAG Compliance**
- ✅ **Color Contrast**: Yellow text (#ffee00) on dark background meets AA standards
- ✅ **Focus Indicators**: Visible focus ring (green border + box-shadow)
- ✅ **Error States**: Visual and semantic indication of invalid state

---

## 🎯 Consistency Across Forms

### **Matching Elements**
| Feature | Agency Forms | State Form | Status |
|---------|-------------|------------|--------|
| **Question Position** | After star rating | After star rating | ✅ Consistent |
| **Field Type** | `<select>` dropdown | `<select>` dropdown | ✅ Consistent |
| **Options** | 1, 2, 3, 4, 5+ | 1, 2, 3, 4, 5+ | ✅ Consistent |
| **Required** | Yes | Yes | ✅ Consistent |
| **Styling** | `.usage-frequency-group` | `.usage-frequency-group` | ✅ Consistent |
| **Yellow Highlight** | Yes | Yes | ✅ Consistent |
| **Red Asterisk** | Yes | Yes | ✅ Consistent |
| **Focus Effect** | Green border + glow | Green border + glow | ✅ Consistent |

### **Styling Differences**
None - Both forms use identical CSS classes and styles.

---

## 📊 Data Collection

### **Agency Review Data**
```javascript
{
  agencyId: "10881",
  userId: "abc123",
  overallRating: 5,
  usageFrequency: "2",  // ← New field
  comments: "Great agency!"
}
```

### **State Experience Data**
```javascript
{
  state: "Florida",
  jobTitle: "Lifeguard",
  wages: "$15/hour",
  hoursPerWeek: 40,
  rating: 5,
  usageFrequency: "1",  // ← New field
  experience: "Awesome summer!",
  userEmail: "user@example.com",
  userName: "John",
  googleId: "123456"
}
```

---

## 🧪 Testing Checklist

### **Functional Testing**
- ✅ Field displays correctly in both forms
- ✅ Dropdown opens and closes properly
- ✅ All 5 options (1, 2, 3, 4, 5+) are selectable
- ✅ Required validation prevents submission without selection
- ✅ Selected value is included in form data submission
- ✅ Form resets properly after submission

### **Visual Testing**
- ✅ Styling matches design (yellow background, left border)
- ✅ Red asterisk appears after label
- ✅ Focus state shows green border + glow
- ✅ Invalid state shows red border
- ✅ Responsive design works on mobile (full-width dropdown)

### **Accessibility Testing**
- ✅ Keyboard navigation works (Tab, Arrow keys, Enter)
- ✅ Screen reader announces label and required status
- ✅ Focus visible for keyboard users
- ✅ Error messages clear and understandable

### **Cross-Browser Testing**
- ⚠️ **To Test**: Chrome, Firefox, Safari, Edge
- ⚠️ **To Test**: Mobile browsers (iOS Safari, Chrome Android)

---

## 🔧 Technical Details

### **HTML Attributes**
- `id`: Unique identifier for label association
- `name`: Form field name for data submission
- `required`: HTML5 validation
- `disabled`: On placeholder option to prevent selection
- `selected`: Default selected option

### **CSS Specificity**
- `.usage-frequency-group label` - Targets label within container
- `.usage-frequency-group select` - Targets dropdown within container
- `.usage-frequency-group label::after` - Adds red asterisk via CSS
- `.usage-frequency-group select:focus` - Focus state styling
- `.usage-frequency-group select:required:invalid` - Invalid state styling

### **JavaScript Integration**
**File**: `share-experience.html`
**Lines**: 1127, 1147 (form data collection)

```javascript
// In submitExperience() function:
const formData = {
  state: selectedState,
  jobTitle: document.getElementById('jobTitle').value,
  employer: document.getElementById('employer').value,
  city: document.getElementById('city').value,
  wages: document.getElementById('wages').value,
  hoursPerWeek: document.getElementById('hoursPerWeek').value,
  rating: selectedRating,
  usageFrequency: document.getElementById('usageFrequency').value,  // ← Added
  experience: document.getElementById('experience').value
};
```

---

## 📱 Responsive Design

### **Desktop** (> 768px)
- Dropdown max-width: 300px
- Left-aligned within container

### **Mobile** (≤ 768px)
- Dropdown max-width: 100% (full container width)
- Touch-friendly dropdown size

### **CSS Media Query** (lines 255-260):
```css
@media screen and (max-width: 768px) {
  .usage-frequency-group select {
    max-width: 100%;
  }
}
```

---

## 🎨 Color Palette

| Element | Color | Hex Code | Usage |
|---------|-------|----------|-------|
| **Background Tint** | Yellow (8% opacity) | `rgba(255, 238, 0, 0.08)` | Container background |
| **Border** | Yellow | `#ffee00` | Left border, default border |
| **Label Text** | Yellow | `#ffee00` | Question text |
| **Asterisk** | Red | `#ff4d4f` | Required indicator |
| **Focus Border** | Green | `#28a745` | Focus state |
| **Invalid Border** | Red | `#ff4d4f` | Invalid state |
| **Dropdown BG** | Dark Gray | `#1a1a1a` | Select background |
| **Dropdown Text** | White | `#ffffff` | Select text |

---

## 🚀 Deployment Notes

### **Changes Ready for Production**
1. ✅ CSS added to `share-experience.html` (lines 209-260)
2. ✅ HTML form field added to `share-experience.html` (lines 713-726)
3. ✅ JavaScript integration updated (lines 1127, 1147)
4. ✅ No changes needed for `agencies.html` (already complete)

### **No Breaking Changes**
- All changes are additive (new field only)
- Existing forms continue to work
- No database migrations needed (field is new)

### **Backend Integration (Future)**
When backend is connected, ensure:
- API accepts `usageFrequency` field
- Database schema includes `usageFrequency` column (VARCHAR or INT)
- Data validation on server side (values: 1, 2, 3, 4, 5)

---

## 📈 Future Enhancements

### **Potential Improvements**
1. **Analytics**: Track distribution of usage frequency (how many users select 1 vs 5+)
2. **Conditional Logic**: Show different follow-up questions based on frequency
3. **Weighting**: Weight reviews differently based on usage frequency (e.g., 5+ times = more credible)
4. **Filtering**: Allow users to filter reviews by usage frequency
5. **Display**: Show usage frequency in review cards ("Used 3 times")

### **Not Implemented (As Per Requirements)**
- ❌ Radio buttons (requirement specified `<select>` dropdown)
- ❌ Open text input (requirement specified fixed options 1-5)
- ❌ Optional field (requirement specified mandatory)

---

## ✅ Verification Completed

### **Agency Forms** (`agencies.html`)
- ✅ 70 forms verified with usage frequency question
- ✅ All using consistent structure
- ✅ CSS styling present and correct

### **State Form** (`share-experience.html`)
- ✅ Usage frequency question added (lines 713-726)
- ✅ CSS styling added (lines 209-260)
- ✅ JavaScript integration complete (lines 1127, 1147)
- ✅ Matches agency form styling exactly

---

## 📞 Support & Maintenance

### **Code Location Reference**
- **Agency Forms CSS**: `agencies.html` (inline `<style>` section)
- **State Form CSS**: `share-experience.html` lines 209-260
- **State Form HTML**: `share-experience.html` lines 713-726
- **State Form JS**: `share-experience.html` lines 1127, 1147

### **Common Issues & Solutions**
1. **Field not showing?**
   - Check CSS class `.usage-frequency-group` is present
   - Verify HTML is between star rating and experience textarea

2. **Validation not working?**
   - Ensure `required` attribute is on `<select>` element
   - Check placeholder option has `value=""`

3. **Styling inconsistent?**
   - Verify `.usage-frequency-group` CSS is identical in both files
   - Check media query for mobile responsiveness

---

## 📝 Change Log

### **2025-10-14**
- ✅ Added usage frequency question to `share-experience.html`
- ✅ Added CSS styling for `.usage-frequency-group`
- ✅ Updated JavaScript form data collection
- ✅ Verified consistency with existing agency forms
- ✅ Created comprehensive documentation

---

## 👥 Stakeholders

- **Developers**: Use this document for implementation reference
- **QA Team**: Use testing checklist for validation
- **Designers**: Reference color palette and responsive design
- **Product Team**: Understand feature capabilities and limitations

---

**Implementation Status**: ✅ **COMPLETE**
**Documentation Version**: 1.0
**Last Updated**: October 14, 2025
