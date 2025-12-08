# Search Results Page Documentation

## Overview
The search results page is a comprehensive professional service listing page with advanced filtering, sorting, and navigation capabilities.

## Features

### 1. **Sticky Header with Search**
- Back button to return to previous page
- Inline search bar with search icon
- Blue (#1A73E8) background matching the theme
- Fully responsive

### 2. **Location Display**
- Shows current search location (e.g., "Salt Lake, Sector 2")
- "Change Location" link to update location
- Modal popup for location changes
- Auto-detect or manual location entry

### 3. **Advanced Filters & Sorting**
- **Rating Filter**: All Ratings, 4.5+, 4.0+
- **Price Range**: All, Low → High, High → Low
- **Distance**: 1km, 3km, 5km, 10km
- **Availability**: Available now, Today, This week
- **Experience**: 1-3 years, 3-5 years, 5+ years
- **Sort By**: Best Match, Rating, Price, Experience, Fastest Arrival
- Active filters highlighted in blue
- Inactive filters with yellow outline
- Clear All Filters button

### 4. **Professional Cards**
Each professional card displays:
- **Profile Photo**: 80×80 circular image with yellow border
- **Name & Profession**: Bold name with blue profession tag
- **Rating**: Star rating + review count (e.g., ⭐ 4.8 • 320 reviews)
- **Pricing**: 
  - Hourly rate (₹299/hr)
  - Inspection fee (₹149)
- **Skills**: Icon-based skill tags (⚡ Wiring, 🔌 Switchboard, etc.)
- **Verification**: Jobs completed + Verified badge
- **Availability**: Real-time availability status
- **Distance Badge**: Shows distance from user location
- **Action Buttons**:
  - Book Now (Blue solid button)
  - View Profile (Blue outline button)

### 5. **Category-Specific Services**
Each card shows specialized services with icons:
- Electricians: ⚡ Emergency Fixing, 🔧 Appliance Repair, 🎛 Wiring Check
- Plumbers: 🚰 Pipe Repair, 🚿 Bathroom Fitting, 🔩 Leakage Fix

### 6. **Offer Banners**
- Random promotional banners between results
- Gradient yellow background (#FFB800)
- Example: "🎉 Flat 10% OFF on first electrician booking"

### 7. **View Toggle**
- **List View**: Default card-based layout
- **Map View**: Split screen with map (placeholder for future implementation)

### 8. **Pagination**
- Previous/Next buttons
- Numbered page buttons (1, 2, 3...)
- Active page highlighted in blue
- Disabled state for first/last pages

### 9. **No Results State**
When no professionals are found:
- 😕 Sad emoji illustration
- Helpful message
- Suggestions to try:
  - Expanding search radius
  - Changing filters
  - Checking another time slot
- "Clear All Filters" CTA button

### 10. **Mobile Responsiveness**
- Sticky bottom CTA button on mobile
- Horizontal scroll for filters
- Full-width cards on mobile
- Responsive text sizing
- Touch-optimized buttons

## Color Theme
- **Primary Blue**: #1A73E8
- **White**: #FFFFFF
- **Soft Gray**: #F5F7FA
- **Yellow Accent**: #FFB800
- **Text Gray**: #6B7280
- **Success Green**: #10B981

## Routing
- **Access**: `/search?q=[query]&location=[location]&category=[category]`
- **Book Now**: Routes to `/booking?professional=[id]`
- **View Profile**: Routes to `/professional/[id]`
- **Back Button**: Returns to previous page
- **Search Bar**: Updates search results on Enter

## Integration Points

### From Home Page
- Main search form routes to search results
- Service selection populates query parameter
- Location field populates location parameter

### From Service Page
- "Book Now" buttons route to search results
- Service name populates query parameter
- Category parameter included

### From Navbar
- Search bar routes to search results on Enter
- Query parameter populated from search input

## Data Structure
Each professional object contains:
```javascript
{
  id: number,
  name: string,
  profession: string,
  photo: string,
  rating: number,
  reviews: number,
  pricePerHour: number,
  inspectionFee: number,
  distance: number,
  skills: string[],
  jobsCompleted: number,
  verified: boolean,
  availability: string
}
```

## Future Enhancements
- [ ] Implement actual API integration
- [ ] Add Google Maps integration for map view
- [ ] Implement infinite scroll option
- [ ] Add filter presets (Popular, Budget, Premium)
- [ ] Real-time availability updates
- [ ] Save favorite professionals
- [ ] Share search results
- [ ] Advanced search with multiple filters
- [ ] Professional comparison feature

## File Structure
```
app/
├── search/
│   └── page.tsx          # Main search results page
├── booking/
│   └── page.tsx          # Booking page
├── professional/
│   └── [id]/
│       └── page.tsx      # Professional profile page
├── Component/
│   ├── Navbar.jsx        # Updated with search routing
│   └── BookingForm.jsx   # Booking form component
└── Page/
    ├── Home.jsx          # Updated with search routing
    └── Service.jsx       # Updated with search routing
```

## Usage Example

### Search from Home
```javascript
// User selects "Electrical Services" and enters location
router.push(`/search?q=Electrical Services&location=Salt Lake, Kolkata`);
```

### Book Professional
```javascript
// User clicks "Book Now" on a professional card
router.push(`/booking?professional=1`);
```

### Filter Results
```javascript
// User applies filters
setFilters({
  rating: '4.5',
  distance: '5',
  availability: 'now'
});
```

## Performance Considerations
- Lazy loading for professional images
- Debounced search input
- Optimized filter rendering
- Memoized card components
- Efficient pagination

## Accessibility
- ARIA labels for interactive elements
- Keyboard navigation support
- Screen reader friendly
- High contrast text
- Focus indicators on all interactive elements
