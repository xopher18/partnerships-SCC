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

### 2026‑01‑04 · v3 (presentation fixes)
- **Fixed presenter‑mode clipping** — SectionShell / Cover / Partner / SCC 7s no longer force `h-screen overflow-hidden`. Slides now use `min-h-full` + inner `min-h-[calc(100vh-4rem)] flex flex-col justify-center` so short slides center‑fill and tall slides scroll within the viewport. Verified at 1366×700 and 1280×720.
- Reduced Cover / SCC 7s / Partner headline sizes when in presenter mode so hero content fits laptop screens.
- **Added real .pptx download** — client‑side generator using pptxgenjs 4.0.1 (`src/lib/generatePptx.js`). Two entry points: `data-testid='download-pptx'` in top nav, and `data-testid='cta-download-pptx'` on Partner slide. Produces a 546KB, 19‑slide, 16:9 widescreen `.pptx` — 18 sections + one extra SCC 7s Sponsor Value slide, with Yellow #FFCC00 accents, Cormorant / Oswald / Manrope fonts, Title Partner tile rendered on yellow, Partner slide fully yellow.
- Fixed webpack: added NormalModuleReplacementPlugin for `node:*` imports so pptxgenjs bundles cleanly in the browser (`craco.config.js` + `plugins/empty-node-stub.js`).

### 2026‑01‑04 · v4 (charity & community)
- **Added Charity & Community section** (id `charity`, position 11 of 19) between Alignment and Inventory. Content: 20‑year support of Youth Football Home in Phuket (education, tuition fees, stationery, living quarters upkeep); Catch Plus grassroots partnership for under‑privileged children; long‑term individual support of a young Singaporean with cerebral palsy from toddler to university. Includes a Sponsor Hook · CSR / ESG callout and a "Full CSR portfolio available on request" footnote.
- Updated Alignment pillar to include "20‑Year CSR Track Record" and ROI pillar to include "CSR / ESG Substance"
- Extended `.pptx` generator with Slide 12 · Charity — flagship 20 Years stat, three programme cards, sponsor hook + footnote. Total PPT now 20 slides (~572KB).

### 2026‑02‑04 · v7 (better heritage photo + concept-lock decision)
- **Replaced the flat 2006 side-angle SCC clubhouse photo** with a proper front-facade hero shot from Wikimedia Commons (CC-BY 2.0). The new image shows the SCC clubhouse with its trademark red-tile roof, white columns, colonial arches and the SCC flag flying — a legitimate, licensed, high-resolution photo of the actual building.
- **Concept-lock agreement with user**: PPT rebuild is deliberately paused until the deck's content and design concept are finalised. This avoids rework — every edit currently invalidates hand-tuned slide layouts. Next PPT rebuild will use dedicated 16:9 slide layouts (Option A) once user signs off on final content.

## Locked-but-pending decisions
- Better SCC clubhouse photo — DONE (Wikimedia Commons front-facade shot)
- Content / wording review — PENDING user feedback
- Sponsor logos strip — PENDING assets from user
- Real contact details — PENDING from user
- Dedicated 16:9 slide layout rebuild — PENDING content-lock signal from user

### 2026‑02‑04 · v6 (PPTX rewritten as screenshot-based export)
- **Ditched hand-coded pptxgenjs coordinates** — the old approach was fundamentally fragile: every text/image change drifted the layout. Rewrote `generatePptx.js` to use **`html2canvas` + `pptxgenjs`**. Each web section is cloned into an off-screen 1920px stage, styled to compress scroll-mode padding, vertically centre its content and pin `min-h-screen` to 1080px, then screenshot with `useCORS: true`. Each capture becomes a full-bleed image on a 16:9 PPT slide.
- **Aspect-ratio letterboxing** — sections that need more than 1080px (At a Glance, Ecosystem, Inventory) capture at their natural height and are letterboxed inside the 16:9 slide with the same black slide background, so nothing is cropped and no bars are visible.
- **Result: PPT is pixel-identical to the web deck.** Real SCC clubhouse photo, sponsor kit branding, ladies team at national stadium, trophy-lift, HK 7s all render exactly as designed. Verified by downloading the 3.06 MB output via Playwright and extracting all 19 slide images.
- **Progress indicator** — DOWNLOAD PPT button now shows `Building 4/19…` so users know the browser is still working.
- **Desktop-width guard** — refuses to run at <1280px and shows a clear message, because responsive Tailwind breakpoints would otherwise produce mobile layouts in the PPT.
- **Trade-off (documented for the user)**: text in the PPT is now non-editable in PowerPoint. This is the standard trade Pitch / Beautiful.ai / Gamma exports make to guarantee visual fidelity.
- New dep: `html2canvas@1.4.1` (~120KB gz).

## Testing
- iteration_1..7: previous history retained
- 2026‑02‑04 self‑test: browser Playwright download + Gemini visual sweep across all 19 slides → PASS

## Backlog (P1)
- Sponsor logos strip (Helios Fitness, Ryudben, Futbolita, Select) on Packages / Visibility slides
- Confirm real contact names / email / phone in `contact` object
- Real SCC crest / logo (currently a stylised "SCC" mark placeholder)

## Backlog (P2)
- SCC 7s highlight video clip on live web Cover
- Existing sponsor logo strip
- Sponsor-specific variants (SME cut / corporate cut) selectable via URL param
- 1-page summary PDF as alternate export
- Testimonial section (member / parent quotes)
- Video hero on Cover once matchday footage available
