# SCC Football — Sponsorship Deck (PRD)

## Original Problem Statement
Premium sponsorship deck for SCC Football (Singapore Cricket Club Football) in club Yellow & Black. Primary goal: attract CASH sponsorship. Delivered as both scroll narrative + presenter/slide mode. "Investment on request" (no numbers).

## User Personas
- Corporate marketing / partnerships / CSR decision‑makers
- Local SMEs, community backers, football-related partners
- Alumni & internal SCC stakeholders

## Core Requirements
- Yellow (#FFCC00) + Black brand palette
- Heritage-modern typography (Cormorant Garamond + Oswald + Manrope)
- Both scroll and presenter modes with keyboard nav
- 18 sponsor-first sections (was 16)
- Clean print / PDF export (light theme, yellow accents preserved)
- Every interactive element carries data-testid

## Architecture
- Frontend only (React 19 + Tailwind + framer-motion + lucide-react)
- Files:
  - `src/pages/Deck.jsx` — Orchestrator (18 sections, scroll + presenter, beforeprint listener)
  - `src/components/DeckNav.jsx` — Sticky nav + Sections dropdown
  - `src/components/PresenterControls.jsx` — Slide counter (X / 18), arrows, progress bar
  - `src/components/SectionShell.jsx` — Section wrapper; auto-derives numbers from sectionsMeta
  - `src/sections/OpeningSections.jsx` — 01 Cover · 02 Why Now · 03 Heritage · 04 At a Glance
  - `src/sections/MarqueeSections.jsx` — 06 SCC Football 7s · 07 Regional Circuit
  - `src/sections/ProofSections.jsx` — 05 Ecosystem · 08 Pathway · 09 Audience · 10 Alignment
  - `src/sections/CommercialSections.jsx` — 11 Inventory · 12 Packages · 13 Custom
  - `src/sections/ClosingSections.jsx` — 14 Events · 15 ROI · 16 Metrics · 17 Impact · 18 Partner
  - `src/data/deckContent.js` — All narrative content in one place
  - `src/index.css` — Design tokens, fonts, grain, **A4 landscape print CSS**

## What's Been Implemented
### 2026‑01‑04 · MVP
- 16-section deck with sponsor-first narrative, Yellow/Black premium design
- Scroll narrative + presenter mode (keyboard ← / → / Space / Home / End / Esc)
- Compact Sections dropdown, Partner With Us CTA
- Print / Download via browser print dialog
- Placeholder Unsplash imagery on Cover / Heritage / Partner

### 2026‑01‑04 · v2 (client feedback)
- **Added SCC Football 7s marquee section (06)** — hero 1M+ views stat, 82 teams / 2 days / Padang, Riise / Sheringham / Berger marquee player callouts, 6 sponsor benefits including Gala Dinner seats + play in all‑star team
- **Added Regional Circuit section (07)** — 4 tournaments: SCC 7s (Home), Hong Kong FC 7s (Live TV, May), Royal Selangor 7s (July), Bangkok 7s (Royal Bangkok Sports Club). Home + Live TV tiles rendered in yellow.
- **Expanded At a Glance** to 9 stats including 1M+, 82 teams, 4 regional circuits
- **Rebuilt Audience** into 3-column layout with expanded 8 groups (incl. All SCC Sports Sections, Wider SCC Membership, SCC 7s Attendees, Regional Football Community) + 8-item Member Demographics panel (Doctors, Lawyers, Finance, Entrepreneurs, Teachers, Elite Sportspeople, Corporate Leaders, Diplomatic community) + "Beyond Football" callout emphasising cross‑section club-wide visibility
- **Updated Alignment / ROI / Events / Inventory / Packages** to reference SCC 7s and regional presence — Title Partner benefits now include 7s title association, Gala top table, marquee player photo access, play in all‑star team
- **Rewrote print @media CSS** — A4 landscape, forces white bg + dark text, keeps yellow accents (deep gold #B8860B for print legibility), hides no-print chrome. `beforeprint` listener automatically flips presenter → scroll so full 18-section PDF is exported. Cover hero image hidden in print for cleaner first page.

## Testing
- Testing agent iteration_1: **100% pass rate**, no ui bugs, no console errors
- Verified: 18 sections load, dropdown lists all, SCC 7s + Regional content, contrast (yellow bg = black text; black bg = white text), presenter mode keyboard nav & counter 01/18–18/18, `beforeprint` correctly flips mode, print media shows white bg + dark text with yellow accents preserved

## Backlog (P1)
- Real SCC photography — swap Unsplash placeholders in `heroImages` + per-section
- Confirm real reach numbers if available (kept 1M+ SCC 7s number per user brief)
- Add real contact names / email / phone in `contact` object
- Add SCC Football crest / logo (currently a stylised "SCC" mark placeholder)

## Backlog (P2)
- Existing sponsor logo strip
- Sponsor-specific variants (SME cut / corporate cut) selectable via URL param
- 1-page summary PDF as alternate export
- Testimonial section (member / parent quotes)
- Video hero on Cover once matchday footage available
