# 🏠 PG Finder Chennai

A fully-featured, responsive frontend web application for finding PG accommodations in Chennai. Built with pure **HTML, CSS, and JavaScript** — no frameworks, no dependencies.

---

## 📁 Project Structure

```
pg-finder/
│
├── index.html              ← Homepage (Hero, Search, Listings, Areas, Testimonials)
│
├── pages/
│   ├── listings.html       ← Browse All PGs (Sidebar filters, Sort, Advanced search)
│   ├── areas.html          ← Browse by Chennai Area
│   └── contact.html        ← Contact Form
│
├── css/
│   ├── style.css           ← Main design system (variables, navbar, cards, modals...)
│   └── listings.css        ← Listings page specific styles (sidebar, sort bar)
│
└── js/
    ├── data.js             ← All PG data, areas, testimonials (JSON-like objects)
    └── app.js              ← All logic: filtering, rendering, modals, toast, counters
```

---

## ✨ Features

### Search & Filter
- Search by **location**, **budget**, and **gender**
- Advanced sidebar filters: price range slider, amenity checkboxes, availability toggle
- **Sort** by price (asc/desc) or rating
- Real-time filter with zero page reload

### PG Listings
- 9 sample PGs with realistic Chennai data
- **Card view** with rating, gender badge, amenities, availability
- **Detail modal** on click — full description, amenities, price, WhatsApp button
- **Enquiry modal** with form validation

### UX Features
- Animated counter on stats (1240+, 28 areas, 8500+ tenants)
- Scroll reveal animations on cards and sections
- Toast notification system for user feedback
- Responsive mobile layout with hamburger menu
- Sticky navbar with glassmorphism blur effect
- WhatsApp direct contact integration

### Pages
- **Home** — Hero, search, listings, areas, how-it-works, testimonials, CTA
- **Listings** — Full browse with sidebar filters and sort
- **Areas** — All 10 Chennai areas as clickable cards
- **Contact** — Contact form with role selection

---

## 🎨 Design System

| Token        | Value                        |
|--------------|------------------------------|
| Primary font | Syne (display headings)      |
| Body font    | Outfit (clean readability)   |
| Gold accent  | `#D4943A`                    |
| Background   | `#0F0D0B` (dark warm black)  |
| Card BG      | `#181512`                    |
| Success      | `#27A86E`                    |
| Danger       | `#D94F35`                    |

---

## 💡 Key JavaScript Concepts Used

- `Array.filter()` — for multi-criteria search
- `Array.sort()` — for dynamic sorting
- `IntersectionObserver` — for scroll reveal animations
- `querySelectorAll + forEach` — for DOM manipulation
- `setTimeout` — for toast auto-dismiss
- `setInterval` — for counter animation
- `event.stopPropagation()` — to prevent card click on button click
- `localStorage` — (can be added for saved searches)
- Template literals for dynamic HTML rendering

---

## 📱 Responsive Breakpoints

| Breakpoint | Layout             |
|------------|--------------------|
| > 768px    | Full desktop layout |
| ≤ 768px    | Mobile layout, hamburger menu, stacked grids |
| ≤ 480px    | Compact spacing, single column |

---

## 🔧 Future Enhancements (for interviews)

- **Django backend** for real data persistence
- **Google Maps API** for location-based search
- **Image upload** for PG photos
- **User authentication** (login/register)
- **Booking system** with date picker
- **Review & rating** system
- **Email notifications** on enquiry
- **PostgreSQL** for production database

---

