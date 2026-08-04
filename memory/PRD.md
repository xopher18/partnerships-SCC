# SCC Football — Sponsorship Deck (PRD)

## Original Problem Statement
Build a premium sponsorship deck for SCC Football (Singapore Cricket Club Football) in the club's Yellow & Black. Primary goal: attract CASH sponsorship. Deliver as both a scroll narrative and a presenter/slide mode. 16 sections total. Pricing shown as "Investment on request". User will provide real photos later — placeholders for now.

## User Personas
- Corporate brand marketing / partnerships / CSR decision‑makers
- Local SMEs, community backers, football-related partners
- Alumni & internal SCC stakeholders who share the deck onward

## Core Requirements (Static)
- Yellow (#FFCC00) + Black brand palette, no gradients / no AI slop
- Heritage-modern typography (Cormorant Garamond + Oswald + Manrope)
- Both scroll and presenter modes with keyboard nav
- 16 sponsor-first sections
- Print / PDF friendly
- Every interactive element carries a data-testid

## Architecture (MVP)
- Frontend only, React 19 + Tailwind + framer-motion + lucide-react
- No backend needed (static deck)
- Files:
  - `src/App.js` — Router with single `/` route
  - `src/pages/Deck.jsx` — Orchestrates scroll + presenter mode, keyboard nav
  - `src/components/DeckNav.jsx` — Sticky nav with Sections dropdown
  - `src/components/PresenterControls.jsx` — Slide counter, arrows, progress bar
  - `src/components/SectionShell.jsx` — Section wrapper with motion reveals
  - `src/sections/OpeningSections.jsx` — Cover, WhyNow, Heritage, AtAGlance
  - `src/sections/ProofSections.jsx` — Ecosystem, Pathway, Audience, Alignment
  - `src/sections/CommercialSections.jsx` — Inventory, Packages, Custom
  - `src/sections/ClosingSections.jsx` — Events, WhyItWorks, Metrics, Needs, Partner
  - `src/data/deckContent.js` — All narrative content in one place (easy edits)
  - `src/index.css` — Design tokens, font loading, grain, print styles

## What's Been Implemented — 2026‑01‑04
- 16-section deck with sponsor-first narrative and polished copy
- Yellow & Black premium design system with editorial serif/display/body pairing
- Scroll narrative with framer-motion reveals and asymmetric layouts
- Presenter mode: fullscreen slide-by-slide, keyboard nav (←/→/Space/Home/End/Esc), slide counter (04/16), progress bar
- Compact Sections dropdown for jumping to any of the 16 sections
- Print / Download deck button (uses browser print dialog for PDF export)
- Data-testids on every interactive and key informational element
- Placeholder photography from Unsplash (heritage/stadium/team) — swappable

## Backlog (P1)
- Real SCC photography — swap Unsplash placeholders in `heroImages` and per-section images
- Confirm SCC audience/reach numbers and update Audience section
- Add real contact names, email, phone in `contact` object

## Backlog (P2)
- Sponsor logo strip (existing partners)
- Sponsor-specific variants (SME cut, corporate cut) selectable via URL param
- 1-page summary PDF as an alternate export
- Landing-page mode for outreach email links
- Testimonial section (member/parent quotes)

## Testing
- Manual visual QA via screenshot tool across cover, stats, packages, partner
- Presenter mode verified with keyboard nav
- All lint passes; no compile errors
