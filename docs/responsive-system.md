# Site-Wide Responsive System

This document outlines the standardized responsive design rules for the Duta Mita Luhur project.

## Breakpoint Scale

| Name | Width | Usage |
|---|---|---|
| (base) | 0–639px | Phones, default/mobile-first styles |
| `sm` | 640px | Large phones / small tablets in portrait |
| `md` | 768px | Tablets |
| `lg` | 1024px | Small laptops — "desktop nav appears" threshold, layout stacking |
| `xl` | 1280px | Standard desktop |
| `2xl` | 1536px | Large desktop |

**Core Rule:** 320px is the mandatory floor. No page may overflow horizontally or break down to 320px.

## Container & Max-Width

- **Site-Wide Maximum Width:** `max-w-7xl` (1280px equivalent).
- **Standard Padding:** `px-space-4` on mobile, `md:px-space-6` on tablets and above.

## Fluid Typography

Display typography uses CSS `clamp()` to scale smoothly between 320px and 1280px, avoiding oversized text on mobile while maintaining the original desktop ceiling.

- `display-xl`: `clamp(2rem, 1.4rem + 3vw, 2.75rem)` (32px to 44px)
- `display-lg`: `clamp(1.5rem, 1.1rem + 2vw, 2rem)` (24px to 32px)
- `display-md`: `clamp(1.25rem, 1rem + 1vw, 1.625rem)` (20px to 26px)

## Touch Targets

Every interactive element (buttons, form inputs, hamburger menu, filter pills, thumbnails) must have a **minimum tappable area of 44x44px**. 
- Add padding or minimum dimensions (`min-h-[44px] min-w-[44px]`) to small interactive elements to increase hit area without necessarily enlarging the icon visually.

## Images & Aspect Ratios

- Product galleries and facility images use a standard `aspect-[4/3]` or `aspect-[16/9]` ratio where appropriate.
- Images use `next/image` with proper `sizes` attributes.
