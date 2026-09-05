# UI/UX Reference: MSN Weather-Style Design System

> Use this as a design brief. It describes the visual language, layout structure, and interaction patterns of MSN Weather (msn.com/weather) so they can be adapted to a new website — not copied verbatim (don't reuse MSN's exact logo, wordmark, or branded assets).

---

## 1. Overall Design Philosophy

- **One-page, scroll-driven experience.** Everything (current conditions → hourly → daily → radar → details → "life index" cards → news) lives on a single vertical scroll instead of separate tabs/pages.
- **Hero-first.** The very top of the page is a large, immersive "hero" panel dominated by the current temperature and a full-bleed background that visually matches the weather condition (clear sky gradient, rain texture, snow, night sky, etc.).
- **Card-based modularity.** Below the hero, information is broken into discrete rounded "cards" (Current Conditions, Air Quality, UV Index, Sunrise/Sunset, Wind, Humidity, Feels Like, Visibility). Each card is self-contained, scannable in under 2 seconds, and can be reordered/resized independently.
- **Data-dense but airy.** Lots of numbers and stats, but generous padding and whitespace keep it from feeling cluttered — achieved via a strict grid and consistent card padding rather than sparse content.
- **Glanceable + Explorable.** Primary numbers (temp, condition) are huge and legible from a distance; secondary detail (dew point, pressure, pollen) is smaller and requires a deliberate glance or tap/expand.

---

## 2. Page Structure (top → bottom)

1. **Top navigation bar** — logo/wordmark (left), location search bar (center/left), unit toggle °C/°F, sign-in, hamburger/more menu (right). Slim, ~56–64px tall, semi-transparent over the hero, becomes solid on scroll.
2. **Location + date strip** — city, region, "as of [time]" last-updated timestamp, small settings/share icons.
3. **Hero module**
   - Giant temperature number (often 96–140px font size), degree symbol as superscript.
   - Weather condition icon (animated/lottie-style: sun, clouds, rain drops, snowflakes).
   - Condition text label ("Partly Cloudy", "Light Rain").
   - "Feels like X°" directly under the main temp, smaller and muted.
   - High/Low for the day, small horizontal row.
   - Background: dynamic gradient or photo/illustration reflecting time-of-day + condition (day blue-sky gradient, dusk orange/purple, night navy with stars, rain = darker desaturated blue).
4. **Hourly forecast strip** — horizontally scrollable row of cards, one per hour, each showing time, small icon, temp, precip % beneath. Snap-scroll, subtle left/right fade/gradient mask to hint more content.
5. **Daily / 10-day forecast list** — vertical list, one row per day: day name (left), icon + short condition, precip %, low–high temperature range visualized as a **horizontal gradient bar/pill** (a color-coded temp range bar is a signature MSN Weather element — cold=blue, hot=orange/red, positioned within the min/max range of the week).
6. **"Current Conditions" detail card grid** — a responsive grid (2–4 columns) of small stat cards: Wind, Humidity, UV Index, Visibility, Pressure, Dew Point. Each card = icon + label (top, muted) + big value (bottom, bold) + occasionally a mini sparkline or radial gauge.
7. **Sunrise/Sunset card** — arc/半circle progress visualization showing sun position between sunrise and sunset times, with a small sun icon traveling along the arc.
8. **Air Quality Index card** — colored gauge/badge (green/yellow/orange/red scale) with a headline number and short descriptive text ("Good", "Moderate").
9. **Radar/Map module** — embedded interactive precipitation map, layer toggle (radar/temp/clouds), zoom controls.
10. **"Life Index" / recommendation cards** — small horizontally-scrolling cards with practical advice: "Good day for running," "Bring an umbrella," "High pollen today," each with an icon + one-line text.
11. **Historical/Trends & Records section** — comparison of today vs. historical averages, small bar/line chart.
12. **News/content feed footer** — MSN's broader content feed (weather-adjacent news, articles) in a masonry/card grid — optional if adapting for a standalone weather app.

---

## 3. Visual Language

### Color System
- **Dynamic, condition-driven backgrounds** rather than one static brand color — the hero gradient itself acts as the primary "theme color" per view.
  - Clear day: sky blue → lighter cyan gradient
  - Cloudy: soft gray-blue gradient
  - Rain: deep slate blue, slightly desaturated
  - Night: navy/indigo to near-black, with subtle star specks
  - Snow: pale icy blue-white
- **Neutral surface for cards:** white or near-white cards (light mode) / dark charcoal cards (dark mode) sitting on top of the hero color, with soft shadows (`0 2px 8px rgba(0,0,0,0.08)`) and large border-radius (16–20px).
- **Accent colors used sparingly and functionally:**
  - Blue for precipitation/rain data
  - Orange/red for heat, UV, "feels like" warnings
  - Green/yellow/orange/red for air-quality gauge severity
- **Text hierarchy:** near-black/near-white primary text, medium-gray secondary/meta text, and a muted tertiary tone for units/labels.

### Typography
- Clean, modern sans-serif (system font stack: Segoe UI / system-ui equivalent).
- **Extreme scale contrast:** the hero temperature is dramatically larger than any other text on the page (visual anchor), while supporting stats use a small, consistent size (~13–14px) for labels and a medium-bold size (~20–24px) for values.
- Numbers are typically **tabular/lining figures** so columns of stats align cleanly.
- Minimal use of italics or decorative type; weight (regular/medium/bold) is the primary tool for hierarchy, not size variation everywhere.

### Iconography & Illustration
- Custom, semi-3D/glossy weather icons (sun, cloud, rain, snow, lightning) — rounded, soft-shaded, slightly playful rather than flat/line icons.
- Small utility icons (wind, humidity, gauge, sunrise) are simpler, thinner line icons for the secondary detail cards.
- Subtle motion: sun icon glints, cloud drifts slightly, rain drops animate — used to give the hero a "living" feel without being distracting.

### Elevation & Shape
- Rounded corners everywhere (cards: 16–20px radius, buttons/pills: fully rounded/999px).
- Soft, low-opacity shadows for card elevation rather than hard borders.
- Pills/badges used for tags like "Feels like," AQI category, and forecast condition labels.

### Spacing & Grid
- Content constrained to a centered max-width container (~1100–1280px on desktop) with generous outer margins.
- Consistent 8px-based spacing scale (8/16/24/32/48px) between sections.
- Cards use internal padding of ~20–24px; grids use 16–20px gutters.

---

## 4. Interaction & Motion Patterns

- **Sticky/condensing header:** nav bar shrinks and gains a solid background after scrolling past the hero.
- **Horizontal snap-scroll carousels** for hourly forecast and "life index" tips (touch-friendly, with edge fade masks as scroll affordance).
- **Hover/tap micro-interactions:** cards lift slightly (increased shadow + 2–4px translateY) on hover; icons have subtle idle animation loops.
- **Unit toggle** (°C/°F) is instantly interactive, no page reload — updates all temperature values in place.
- **Expandable detail rows:** tapping a daily forecast row can expand to reveal hourly breakdown for that day inline (accordion-style), rather than navigating away.
- **Live-updating "as of" timestamp** with a subtle refresh indicator.
- **Skeleton loaders** (light gray pulsing blocks) while cards/data are fetching, keeping layout stable (no content jump).

---

## 5. Responsive Behavior

- **Desktop:** multi-column card grid (3–4 stat cards per row), hero and hourly strip side-by-side or stacked with plenty of breathing room.
- **Tablet:** grid drops to 2 columns; hourly strip remains horizontally scrollable.
- **Mobile:** everything stacks to a single column; hero temperature scales down but stays dominant (~64–80px); stat cards go full-width or 2-per-row; nav collapses to a hamburger + search icon.
- Touch targets enlarged on mobile (min 44px), horizontal carousels become the primary scan pattern for hourly/tips content.

---

## 6. Accessibility Notes to Preserve

- Maintain strong contrast between hero text and background gradient (test both light/dark and all weather-condition background variants).
- Don't rely on color alone for AQI/severity — pair color with a text label ("Good/Moderate/Unhealthy").
- Ensure the temperature range "bar" in the daily forecast list has a text equivalent (low–high numbers), not just the visual gradient bar.
- Icons should have accessible text alternatives (aria-label / sr-only text) since much of the UI is icon-led.

---

## 7. Suggested Prompt Block for Gemini

You can paste this directly to Gemini along with the sections above:

> "Design a weather website UI inspired by MSN Weather's structure: a full-bleed hero section with a dynamic gradient background that changes based on weather condition and time of day, a giant temperature readout, a horizontally scrollable hourly forecast strip, a 10-day forecast list using a color-coded low–high temperature range bar, and a modular grid of rounded stat cards (wind, humidity, UV, sunrise/sunset, air quality) with soft shadows and generous spacing. Use a clean sans-serif system font, tabular numerals for stats, rounded 16–20px corners, and subtle micro-interactions on hover (card lift) and scroll (sticky condensing nav, skeleton loaders while data loads). Keep it modular and responsive: 3–4 columns of stat cards on desktop collapsing to 1–2 columns on mobile, with the hero temperature remaining the dominant visual anchor at every breakpoint."

---

## 8. What NOT to Copy Directly

- MSN's exact logo, wordmark, or brand name.
- MSN's specific news-feed content/algorithm below the weather section (that's a separate, unrelated content product — omit entirely for a standalone weather app).
- Any literal text/copy from the site — treat this document as a description of *structure and style*, and write your own original copy, icon set, and illustration style.
