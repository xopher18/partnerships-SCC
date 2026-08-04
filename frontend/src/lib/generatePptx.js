/**
 * SCC Football sponsorship deck — .pptx exporter.
 *
 * Client‑side PPTX generation using PptxGenJS. Produces a 16:9 widescreen
 * deck (13.333in × 7.5in) that matches the web deck's structure and brand.
 * All content pulled from src/data/deckContent.js to stay in sync.
 */
import PptxGenJS from "pptxgenjs";
import {
  sectionsMeta,
  glanceStats,
  ecosystem,
  scc7s,
  regionalTournaments,
  pathway,
  audienceGroups,
  audienceDemographics,
  broaderScc,
  alignmentPillars,
  charity,
  inventory,
  packages,
  customOptions,
  events,
  whyItWorks,
  metrics,
  needs,
  contact,
  heroImages,
} from "@/data/deckContent";

// ── SCC brand tokens ─────────────────────────────────────────
const BRAND = {
  yellow: "FFCC00",
  black: "050505",
  surface: "121212",
  white: "FFFFFF",
  textMuted: "A3A3A3",
  divider: "262626",
};

const FONTS = {
  heritage: "Cormorant Garamond",
  display: "Oswald",
  body: "Manrope",
};

// Slide size (16:9 widescreen inches)
const W = 13.333;
const H = 7.5;
const MARGIN_X = 0.7;
const MARGIN_Y = 0.55;

/**
 * Fetch a remote image and return a data URL. Keeps PPT self-contained.
 * Falls back to null on error so a slide still renders without the image.
 */
async function fetchImageDataUrl(url) {
  try {
    const res = await fetch(url, { mode: "cors" });
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const r = new FileReader();
      r.onloadend = () => resolve(r.result);
      r.onerror = () => resolve(null);
      r.readAsDataURL(blob);
    });
  } catch (e) {
    console.warn("PPT image fetch failed for", url, e);
    return null;
  }
}

/**
 * Add the common header (section number + eyebrow) to every slide.
 */
function addHeader(slide, number, eyebrow, isYellowBg = false) {
  slide.addText(
    [
      {
        text: number + "  ",
        options: {
          color: BRAND.yellow,
          fontFace: FONTS.display, autoFit: false, shrinkText: false,
          bold: true,
          charSpacing: 4,
        },
      },
      {
        text: "— " + eyebrow.toUpperCase(),
        options: {
          color: isYellowBg ? "1a1a1a" : BRAND.textMuted,
          fontFace: FONTS.display, autoFit: false, shrinkText: false,
          charSpacing: 6,
        },
      },
    ],
    {
      x: MARGIN_X,
      y: MARGIN_Y,
      w: W - MARGIN_X * 2,
      h: 0.4,
      fontSize: 10,
    }
  );
}

/**
 * Footer with brand credit and slide number.
 */
function addFooter(slide, current, total, isYellowBg = false) {
  const color = isYellowBg ? "1a1a1a" : BRAND.textMuted;
  slide.addText("SCC Football · Est. 1852", {
    x: MARGIN_X,
    y: H - 0.4,
    w: 4,
    h: 0.3,
    fontSize: 8,
    color,
    fontFace: FONTS.display, autoFit: false, shrinkText: false,
    charSpacing: 4,
  });
  slide.addText(
    `${String(current).padStart(2, "0")} / ${String(total).padStart(2, "0")}`,
    {
      x: W - MARGIN_X - 2,
      y: H - 0.4,
      w: 2,
      h: 0.3,
      align: "right",
      fontSize: 8,
      color,
      fontFace: FONTS.display, autoFit: false, shrinkText: false,
      charSpacing: 4,
    }
  );
}

/**
 * Pick a stat-tile font size that guarantees no letter-wrapping.
 * Empirically calibrated for Oswald bold — assumes ~0.55x em width per char.
 * Returns a font size (pt) that fits the given tile width for the given value.
 */
function fitStatFont(width, value, cap = 44) {
  const chars = String(value).length || 1;
  // Available inner width in inches (after our 0.2in horizontal padding)
  const inner = Math.max(0.5, width - 0.4);
  // fontSize (pt) at which "chars" letters just fill the inner width
  // 1 inch = 72 pt.  em width ≈ fontSize * 0.55, so:
  //   chars * fontSize * 0.55 / 72 ≤ inner
  //   fontSize ≤ inner * 72 / (chars * 0.55)
  const maxByWidth = Math.floor((inner * 72) / (chars * 0.55));
  return Math.max(12, Math.min(cap, maxByWidth));
}

/**
 * Common text defaults to prevent PowerPoint's "shrink text on overflow" from
 * rendering paragraphs twice.  Applied to all body copy.
 */
const BODY = {
  valign: "top",
  autoFit: false,
  shrinkText: false,
  paraSpaceBefore: 0,
  paraSpaceAfter: 0,
};

/**
 * Reusable stat tile.
 */
function addStatTile(slide, x, y, w, h, value, label) {
  slide.addShape("rect", {
    x,
    y,
    w,
    h,
    fill: { color: BRAND.black },
    line: { color: BRAND.divider, width: 0.75 },
  });
  slide.addText(value, {
    x: x + 0.2,
    y: y + 0.15,
    w: w - 0.4,
    h: h * 0.55,
    fontSize: fitStatFont(w, value),
    color: BRAND.yellow,
    fontFace: FONTS.display,
    bold: true,
    valign: "top",
    autoFit: false,
    shrinkText: false,
  });
  slide.addText(label, {
    x: x + 0.2,
    y: y + h * 0.62,
    w: w - 0.4,
    h: h * 0.36,
    fontSize: 9,
    color: BRAND.textMuted,
    fontFace: FONTS.display,
    charSpacing: 4,
    valign: "top",
    autoFit: false,
    shrinkText: false,
  });
}

// ── Build the deck ───────────────────────────────────────────
export async function generateSccPptx() {
  const pptx = new PptxGenJS();
  pptx.title = "SCC Football — Sponsorship Opportunities";
  pptx.subject = "Partnership deck for SCC Football";
  pptx.company = "Singapore Cricket Club — Football Section";
  pptx.author = "SCC Football";
  pptx.layout = "LAYOUT_WIDE"; // 13.333 x 7.5

  // Pre-fetch real photography so slides can embed data URLs (self-contained PPT).
  const [imgCover, imgAtmosphere, imgChampions, imgKits] = await Promise.all([
    fetchImageDataUrl(heroImages.cover),
    fetchImageDataUrl(heroImages.atmosphere),
    fetchImageDataUrl(heroImages.champions),
    fetchImageDataUrl(heroImages.kits),
  ]);

  const total = sectionsMeta.length;

  // Slide meta helper
  const meta = (id) => sectionsMeta.find((s) => s.id === id);
  const num = (id, i) => meta(id)?.number || String(i + 1).padStart(2, "0");
  const label = (id) => meta(id)?.label || "";

  // 01 · Cover ------------------------------------------------
  {
    const s = pptx.addSlide();
    s.background = { color: BRAND.black };
    // Full-bleed hero image with dark scrim
    if (imgCover) {
      s.addImage({ data: imgCover, x: 0, y: 0, w: W, h: H, sizing: { type: "cover", w: W, h: H } });
      // Dark overlay layer for text legibility
      s.addShape("rect", {
        x: 0, y: 0, w: W, h: H,
        fill: { color: BRAND.black, transparency: 30 },
        line: { color: BRAND.black, transparency: 100 },
      });
      s.addShape("rect", {
        x: 0, y: 0, w: W * 0.65, h: H,
        fill: { color: BRAND.black, transparency: 20 },
        line: { color: BRAND.black, transparency: 100 },
      });
    }
    // Yellow accent bar
    s.addShape("rect", { x: 0, y: 0, w: 0.15, h: H, fill: { color: BRAND.yellow }, line: { color: BRAND.yellow } });
    // Eyebrow
    s.addText("EST. 1852 — SINGAPORE CRICKET CLUB", {
      x: MARGIN_X, y: 1.2, w: W - MARGIN_X * 2, h: 0.35,
      fontSize: 10, color: BRAND.yellow, fontFace: FONTS.display, autoFit: false, shrinkText: false, charSpacing: 6,
    });
    // Hero title
    s.addText("Partner with", {
      x: MARGIN_X, y: 1.7, w: W - MARGIN_X * 2, h: 1.4,
      fontSize: 66, color: BRAND.white, fontFace: FONTS.heritage, autoFit: false, shrinkText: false,
    });
    s.addText("SCC Football.", {
      x: MARGIN_X, y: 2.9, w: W - MARGIN_X * 2, h: 1.6,
      fontSize: 78, color: BRAND.yellow, fontFace: FONTS.heritage, autoFit: false, shrinkText: false, italic: true,
    });
    // Tagline
    s.addText(
      "Heritage. Community. Performance. Pathway. A sponsorship platform built around one of Singapore's most established sporting institutions.",
      {
        x: MARGIN_X, y: 4.9, w: W - MARGIN_X * 2 - 2, h: 1,
        fontSize: 14, color: "CCCCCC", fontFace: FONTS.body, autoFit: false, shrinkText: false,
      }
    );
    // Stat strip
    const strip = glanceStats.slice(0, 3);
    strip.forEach((st, i) => {
      const x = MARGIN_X + i * 2.6;
      s.addText(st.value, {
        x, y: 6.1, w: 2.4, h: 0.55,
        fontSize: 22, color: BRAND.yellow, fontFace: FONTS.display, autoFit: false, shrinkText: false, bold: true,
      });
      s.addText(st.label, {
        x, y: 6.65, w: 2.4, h: 0.35,
        fontSize: 8, color: BRAND.textMuted, fontFace: FONTS.display, autoFit: false, shrinkText: false, charSpacing: 4,
      });
    });
    addFooter(s, 1, total);
  }

  // 02 · Why Now ---------------------------------------------
  {
    const s = pptx.addSlide();
    s.background = { color: BRAND.black };
    addHeader(s, num("why-now", 1), "Why SCC · Why Now");
    s.addText([
      { text: "A commercial moment,\n", options: { color: BRAND.white } },
      { text: "not just a history lesson.", options: { color: BRAND.yellow, italic: true } },
    ], {
      x: MARGIN_X, y: 1.2, w: W - MARGIN_X * 2 - 4, h: 2.4,
      fontSize: 40, fontFace: FONTS.heritage, autoFit: false, shrinkText: false,
    });
    s.addText(
      "SCC Football is entering its strongest era in modern history — a champion side, a scaling academy and a seven-day-a-week presence at the heart of Singaporean sport. The next chapter is being written now. Partners who move first will shape it.",
      {
        x: MARGIN_X, y: 3.8, w: W - MARGIN_X * 2 - 4, h: 2.5,
        fontSize: 13, color: "CCCCCC", fontFace: FONTS.body, autoFit: false, shrinkText: false,
      }
    );
    const tiles = [
      { k: "SFL D1", v: "Champions on the pitch" },
      { k: "234+", v: "Section members and growing" },
      { k: "Academy", v: "Youth pipeline scaling up" },
      { k: "170+", v: "Years of trusted heritage" },
    ];
    tiles.forEach((t, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      addStatTile(s, W - 4.4 + col * 1.9, 1.3 + row * 1.9, 1.7, 1.7, t.k, t.v);
    });
    addFooter(s, 2, total);
  }

  // 03 · Heritage --------------------------------------------
  {
    const s = pptx.addSlide();
    s.background = { color: BRAND.black };
    addHeader(s, num("heritage", 2), "Heritage · Est. 1852");
    s.addText("One of Singapore's oldest,\nmost trusted sporting\ninstitutions.", {
      x: MARGIN_X, y: 1.2, w: 7, h: 3,
      fontSize: 36, color: BRAND.white, fontFace: FONTS.heritage, autoFit: false, shrinkText: false,
    });
    s.addText(
      "Founded in 1852, the Singapore Cricket Club has been a fixture of Singaporean sport for over 170 years. Our football section carries that heritage forward — merging legacy with modern ambition.",
      {
        x: MARGIN_X, y: 4.4, w: 7, h: 1.6,
        fontSize: 13, color: "CCCCCC", fontFace: FONTS.body, autoFit: false, shrinkText: false,
      }
    );
    const h = [
      { n: "1852", l: "Founded" },
      { n: "170+", l: "Years of Sport" },
      { n: "Prestige", l: "Standing" },
    ];
    h.forEach((it, i) => {
      const x = MARGIN_X + i * 2.2;
      s.addShape("rect", { x, y: 6.05, w: 0.08, h: 0.55, fill: { color: BRAND.yellow }, line: { color: BRAND.yellow } });
      s.addText(it.n, {
        x: x + 0.2, y: 6, w: 2, h: 0.4,
        fontSize: 20, color: BRAND.white, fontFace: FONTS.display, autoFit: false, shrinkText: false, bold: true,
      });
      s.addText(it.l.toUpperCase(), {
        x: x + 0.2, y: 6.4, w: 2, h: 0.3,
        fontSize: 8, color: BRAND.textMuted, fontFace: FONTS.display, autoFit: false, shrinkText: false, charSpacing: 4,
      });
    });
    addFooter(s, 3, total);
  }

  // 04 · At a Glance ------------------------------------------
  {
    const s = pptx.addSlide();
    s.background = { color: BRAND.black };
    addHeader(s, num("at-a-glance", 3), "SCC Football at a Glance");
    s.addText("The proof, in numbers.", {
      x: MARGIN_X, y: 1.1, w: W - MARGIN_X * 2, h: 0.9,
      fontSize: 40, color: BRAND.white, fontFace: FONTS.heritage, autoFit: false, shrinkText: false,
    });
    s.addText(
      "A fast, scannable snapshot of what SCC Football delivers today — the base every sponsorship conversation should start from.",
      {
        x: MARGIN_X, y: 2.05, w: 8, h: 0.65,
        fontSize: 12, color: "CCCCCC", fontFace: FONTS.body, autoFit: false, shrinkText: false,
      }
    );
    const grid = glanceStats.slice(0, 9);
    const cellW = (W - MARGIN_X * 2) / 3 - 0.05;
    const cellH = 1.15;
    grid.forEach((st, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const x = MARGIN_X + col * (cellW + 0.05);
      const y = 3 + row * (cellH + 0.05);
      addStatTile(s, x, y, cellW, cellH, st.value, st.label);
    });
    addFooter(s, 4, total);
  }

  // 05 · Ecosystem --------------------------------------------
  {
    const s = pptx.addSlide();
    s.background = { color: BRAND.black };
    addHeader(s, num("ecosystem", 4), "Our Football Ecosystem");
    s.addText("More than a team.\nA footballing community.", {
      x: MARGIN_X, y: 1.1, w: W - MARGIN_X * 2, h: 1.6,
      fontSize: 34, color: BRAND.white, fontFace: FONTS.heritage, autoFit: false, shrinkText: false,
    });
    const gridW = (W - MARGIN_X * 2) / 3 - 0.06;
    ecosystem.forEach((e, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const x = MARGIN_X + col * (gridW + 0.06);
      const y = 3.1 + row * 1.9;
      s.addShape("rect", { x, y, w: gridW, h: 1.75, fill: { color: BRAND.black }, line: { color: BRAND.divider, width: 0.75 } });
      s.addText(String(i + 1).padStart(2, "0"), {
        x: x + 0.2, y: y + 0.15, w: 1, h: 0.4,
        fontSize: 20, color: BRAND.yellow, fontFace: FONTS.display, autoFit: false, shrinkText: false, bold: true,
      });
      s.addText(e.title, {
        x: x + 0.2, y: y + 0.55, w: gridW - 0.4, h: 0.5,
        fontSize: 18, color: BRAND.white, fontFace: FONTS.heritage, autoFit: false, shrinkText: false,
      });
      s.addText(e.copy, {
        x: x + 0.2, y: y + 1.05, w: gridW - 0.4, h: 0.65,
        fontSize: 10, color: BRAND.textMuted, fontFace: FONTS.body, autoFit: false, shrinkText: false,
      });
    });
    addFooter(s, 5, total);
  }

  // 06 · SCC Football 7s -------------------------------------
  {
    const s = pptx.addSlide();
    s.background = { color: BRAND.black };
    // Subtle atmosphere image full-bleed at low opacity, then dark scrim
    if (imgAtmosphere) {
      s.addImage({ data: imgAtmosphere, x: 0, y: 0, w: W, h: H, sizing: { type: "cover", w: W, h: H } });
      s.addShape("rect", {
        x: 0, y: 0, w: W, h: H,
        fill: { color: BRAND.black, transparency: 15 },
        line: { color: BRAND.black, transparency: 100 },
      });
    }
    addHeader(s, num("scc-7s", 5), scc7s.eyebrow);
    // Headline (smaller, single line where possible)
    s.addText([
      { text: scc7s.headline + "  ", options: { color: BRAND.white } },
      { text: scc7s.italic, options: { color: BRAND.yellow, italic: true } },
    ], {
      x: MARGIN_X, y: 1.1, w: 8.4, h: 1.9,
      fontSize: 36, fontFace: FONTS.heritage, autoFit: false, shrinkText: false, valign: "top",
    });
    // Intro paragraph — give it plenty of vertical room to avoid PPT shrink-to-fit doubling
    s.addText(scc7s.intro, {
      x: MARGIN_X, y: 3.15, w: 8.4, h: 1.6,
      fontSize: 12, color: "CCCCCC", fontFace: FONTS.body, autoFit: false, shrinkText: false, valign: "top",
    });

    // Signature 1M+ block on right (a touch shorter, aligned to headline)
    s.addShape("rect", {
      x: W - 3.6, y: 1.1, w: 2.9, h: 2.1,
      fill: { color: BRAND.surface }, line: { color: BRAND.divider, width: 0.75 },
    });
    s.addText("SIGNATURE IMPACT", {
      x: W - 3.4, y: 1.25, w: 2.6, h: 0.3,
      fontSize: 9, color: BRAND.yellow, fontFace: FONTS.display, autoFit: false, shrinkText: false, charSpacing: 6,
    });
    s.addText("1M+", {
      x: W - 3.4, y: 1.55, w: 2.6, h: 1.1,
      fontSize: 60, color: BRAND.yellow, fontFace: FONTS.display, autoFit: false, shrinkText: false, bold: true,
    });
    s.addText("Views & digital reach for a single weekend", {
      x: W - 3.4, y: 2.7, w: 2.6, h: 0.4,
      fontSize: 10, color: "CCCCCC", fontFace: FONTS.body, autoFit: false, shrinkText: false,
    });

    // Stat strip
    const bigW = (W - MARGIN_X * 2) / 4 - 0.06;
    scc7s.bigStats.forEach((st, i) => {
      const x = MARGIN_X + i * (bigW + 0.06);
      addStatTile(s, x, 5, bigW, 1.15, st.value, st.label);
    });

    // Marquee players — compact single row aligned above the footer
    s.addText("RECENT MARQUEE GUESTS", {
      x: MARGIN_X, y: 6.35, w: 5, h: 0.3,
      fontSize: 9, color: BRAND.yellow, fontFace: FONTS.display, autoFit: false, shrinkText: false, charSpacing: 6,
    });
    scc7s.marqueePlayers.forEach((p, i) => {
      const x = MARGIN_X + i * 3.2;
      s.addText([
        { text: p.name, options: { color: BRAND.white, fontSize: 12, fontFace: FONTS.heritage, bold: false } },
        { text: "   " + p.club, options: { color: BRAND.textMuted, fontSize: 9, fontFace: FONTS.display, charSpacing: 3 } },
      ], {
        x, y: 6.65, w: 3.1, h: 0.35,
        autoFit: false, shrinkText: false, valign: "top",
      });
    });
    addFooter(s, 6, total);
  }

  // 06b · SCC 7s Sponsor Benefits (extra slide)
  {
    const s = pptx.addSlide();
    s.background = { color: BRAND.black };
    addHeader(s, num("scc-7s", 5), "SCC Football 7s · Sponsor Value");
    s.addText("What sponsors get at the 7s.", {
      x: MARGIN_X, y: 1.1, w: W - MARGIN_X * 2, h: 0.9,
      fontSize: 34, color: BRAND.white, fontFace: FONTS.heritage, autoFit: false, shrinkText: false,
    });
    const half = (W - MARGIN_X * 2) / 2 - 0.15;
    scc7s.sponsorBenefits.forEach((b, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = MARGIN_X + col * (half + 0.3);
      const y = 2.5 + row * 1.2;
      s.addShape("rect", {
        x, y: y + 0.35, w: 0.12, h: 0.12,
        fill: { color: BRAND.yellow }, line: { color: BRAND.yellow },
      });
      s.addText(b, {
        x: x + 0.3, y, w: half - 0.3, h: 1,
        fontSize: 13, color: BRAND.white, fontFace: FONTS.body, autoFit: false, shrinkText: false,
      });
    });
    addFooter(s, 6, total);
  }

  // 07 · Regional Circuit -------------------------------------
  {
    const s = pptx.addSlide();
    s.background = { color: BRAND.black };
    addHeader(s, num("regional", 6), "Regional 7s Circuit");
    s.addText([
      { text: "Your brand.\n", options: { color: BRAND.white } },
      { text: "On tour across Asia.", options: { color: BRAND.yellow, italic: true } },
    ], {
      x: MARGIN_X, y: 1.1, w: 8, h: 2,
      fontSize: 34, fontFace: FONTS.heritage, autoFit: false, shrinkText: false, valign: "top",
    });
    // Champions photo on the right of the intro
    if (imgChampions) {
      s.addImage({
        data: imgChampions,
        x: W - 4.5, y: 1.1, w: 3.9, h: 2.15,
        sizing: { type: "cover", w: 3.9, h: 2.15 },
      });
      s.addText("CHAMPIONS · RSC INTERNATIONAL SOCCER 7s", {
        x: W - 4.5, y: 3.3, w: 3.9, h: 0.25,
        fontSize: 8, color: BRAND.yellow, fontFace: FONTS.display, charSpacing: 6, autoFit: false, shrinkText: false, align: "right",
      });
    }
    const cardW = (W - MARGIN_X * 2) / 2 - 0.15;
    regionalTournaments.forEach((t, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = MARGIN_X + col * (cardW + 0.3);
      const y = 3.4 + row * 1.7;
      // Diagonal yellow layout: positions 1 & 4 (index 0 and 3) — richer visual rhythm
      const isYellow = i === 0 || i === 3;
      s.addShape("rect", {
        x, y, w: cardW, h: 1.55,
        fill: { color: isYellow ? BRAND.yellow : BRAND.black },
        line: { color: isYellow ? BRAND.yellow : BRAND.divider, width: 0.75 },
      });
      s.addText(t.month.toUpperCase(), {
        x: x + 0.25, y: y + 0.15, w: cardW - 0.5, h: 0.25,
        fontSize: 8, color: isYellow ? "1a1a1a" : BRAND.yellow, fontFace: FONTS.display, autoFit: false, shrinkText: false, charSpacing: 6,
      });
      if (t.highlight) {
        // Chip inverts on yellow tiles for contrast
        s.addShape("rect", {
          x: x + cardW - 0.9, y: y + 0.12, w: 0.75, h: 0.3,
          fill: { color: isYellow ? BRAND.black : BRAND.yellow },
          line: { color: isYellow ? BRAND.black : BRAND.yellow },
        });
        s.addText(t.highlight.toUpperCase(), {
          x: x + cardW - 0.9, y: y + 0.13, w: 0.75, h: 0.28,
          fontSize: 8,
          color: isYellow ? BRAND.yellow : "050505",
          fontFace: FONTS.display, autoFit: false, shrinkText: false, charSpacing: 4, align: "center",
        });
      }
      s.addText(t.title, {
        x: x + 0.25, y: y + 0.4, w: cardW - 0.5, h: 0.55,
        fontSize: 22, color: isYellow ? "050505" : BRAND.white, fontFace: FONTS.heritage, autoFit: false, shrinkText: false,
      });
      s.addText(t.place, {
        x: x + 0.25, y: y + 0.95, w: cardW - 0.5, h: 0.3,
        fontSize: 10, color: isYellow ? "1a1a1a" : "CCCCCC", fontFace: FONTS.body, autoFit: false, shrinkText: false,
      });
      s.addText(t.note, {
        x: x + 0.25, y: y + 1.2, w: cardW - 0.5, h: 0.35,
        fontSize: 9, color: isYellow ? "1a1a1a" : BRAND.textMuted, fontFace: FONTS.body, autoFit: false, shrinkText: false,
      });
    });
    addFooter(s, 7, total);
  }

  // 08 · Pathway ---------------------------------------------
  {
    const s = pptx.addSlide();
    s.background = { color: BRAND.black };
    addHeader(s, num("pathway", 7), "Youth to Senior · The Pathway");
    s.addText([
      { text: "One club. One journey.\n", options: { color: BRAND.white } },
      { text: "A lifetime of belonging.", options: { color: BRAND.yellow, italic: true } },
    ], {
      x: MARGIN_X, y: 1.1, w: W - MARGIN_X * 2, h: 2,
      fontSize: 36, fontFace: FONTS.heritage, autoFit: false, shrinkText: false,
    });
    // Timeline line
    s.addShape("rect", {
      x: MARGIN_X, y: 4.15, w: W - MARGIN_X * 2, h: 0.03,
      fill: { color: BRAND.yellow }, line: { color: BRAND.yellow },
    });
    const stepW = (W - MARGIN_X * 2) / 4;
    pathway.forEach((p, i) => {
      const x = MARGIN_X + i * stepW;
      // Dot
      s.addShape("ellipse", {
        x: x + 0.05, y: 4.05, w: 0.22, h: 0.22,
        fill: { color: BRAND.yellow }, line: { color: BRAND.yellow },
      });
      s.addText(`STEP ${i + 1}`, {
        x: x + 0.35, y: 4.05, w: stepW - 0.5, h: 0.25,
        fontSize: 9, color: BRAND.yellow, fontFace: FONTS.display, autoFit: false, shrinkText: false, charSpacing: 6,
      });
      s.addText(p.stage.toUpperCase(), {
        x: x + 0.05, y: 4.6, w: stepW - 0.3, h: 0.3,
        fontSize: 9, color: BRAND.textMuted, fontFace: FONTS.display, autoFit: false, shrinkText: false, charSpacing: 6,
      });
      s.addText(p.title, {
        x: x + 0.05, y: 4.9, w: stepW - 0.3, h: 0.5,
        fontSize: 18, color: BRAND.white, fontFace: FONTS.heritage, autoFit: false, shrinkText: false,
      });
      s.addText(p.copy, {
        x: x + 0.05, y: 5.45, w: stepW - 0.3, h: 1.5,
        fontSize: 10, color: BRAND.textMuted, fontFace: FONTS.body, autoFit: false, shrinkText: false,
      });
    });
    addFooter(s, 8, total);
  }

  // 09 · Audience --------------------------------------------
  {
    const s = pptx.addSlide();
    s.background = { color: BRAND.black };
    addHeader(s, num("audience", 8), "Audience & Reach");
    s.addText([
      { text: "Who a partnership\n", options: { color: BRAND.white } },
      { text: "puts you in front of.", options: { color: BRAND.yellow, italic: true } },
    ], {
      x: MARGIN_X, y: 1.15, w: 5.2, h: 1.8,
      fontSize: 30, fontFace: FONTS.heritage, autoFit: false, shrinkText: false,
    });
    // Beyond Football callout
    s.addShape("rect", {
      x: MARGIN_X, y: 3.2, w: 0.06, h: 2.5,
      fill: { color: BRAND.yellow }, line: { color: BRAND.yellow },
    });
    s.addText("BEYOND FOOTBALL", {
      x: MARGIN_X + 0.2, y: 3.2, w: 5, h: 0.3,
      fontSize: 9, color: BRAND.yellow, fontFace: FONTS.display, autoFit: false, shrinkText: false, charSpacing: 6,
    });
    s.addText(broaderScc, {
      x: MARGIN_X + 0.2, y: 3.5, w: 5, h: 2.2,
      fontSize: 11, color: "DDDDDD", fontFace: FONTS.body, autoFit: false, shrinkText: false,
    });

    // Audience groups (middle)
    audienceGroups.slice(0, 8).forEach((a, i) => {
      const x = MARGIN_X + 5.6;
      const y = 1.15 + i * 0.62;
      s.addText(a.label, {
        x, y, w: 3.2, h: 0.3,
        fontSize: 12, color: BRAND.white, fontFace: FONTS.display, autoFit: false, shrinkText: false,
      });
      s.addText(a.note, {
        x, y: y + 0.28, w: 3.2, h: 0.25,
        fontSize: 8.5, color: BRAND.textMuted, fontFace: FONTS.body, autoFit: false, shrinkText: false,
      });
    });

    // Demographics (right)
    s.addText("MEMBER DEMOGRAPHICS", {
      x: MARGIN_X + 9, y: 1.15, w: 3.5, h: 0.3,
      fontSize: 9, color: BRAND.yellow, fontFace: FONTS.display, autoFit: false, shrinkText: false, charSpacing: 6,
    });
    audienceDemographics.forEach((d, i) => {
      const y = 1.5 + i * 0.55;
      s.addText(d, {
        x: MARGIN_X + 9, y, w: 3.5, h: 0.35,
        fontSize: 10.5, color: "DDDDDD", fontFace: FONTS.body, autoFit: false, shrinkText: false,
      });
      s.addShape("rect", {
        x: MARGIN_X + 9, y: y + 0.4, w: 3.5, h: 0.01,
        fill: { color: BRAND.divider }, line: { color: BRAND.divider },
      });
    });
    addFooter(s, 9, total);
  }

  // 10 · Alignment --------------------------------------------
  {
    const s = pptx.addSlide();
    s.background = { color: BRAND.black };
    addHeader(s, num("alignment", 9), "What Sponsors Align With");
    s.addText("A brand association with substance.", {
      x: MARGIN_X, y: 1.1, w: W - MARGIN_X * 2, h: 0.9,
      fontSize: 32, color: BRAND.white, fontFace: FONTS.heritage, autoFit: false, shrinkText: false,
    });
    const colW = (W - MARGIN_X * 2) / 4 - 0.08;
    alignmentPillars.forEach((p, i) => {
      const col = i % 4;
      const row = Math.floor(i / 4);
      const x = MARGIN_X + col * (colW + 0.08);
      const y = 2.6 + row * 2.05;
      s.addShape("rect", {
        x, y, w: colW, h: 1.9,
        fill: { color: BRAND.black }, line: { color: BRAND.divider, width: 0.75 },
      });
      s.addText(String(i + 1).padStart(2, "0"), {
        x: x + 0.2, y: y + 0.15, w: 1, h: 0.5,
        fontSize: 18, color: BRAND.yellow, fontFace: FONTS.display, autoFit: false, shrinkText: false, bold: true,
      });
      s.addText(p.title, {
        x: x + 0.2, y: y + 0.75, w: colW - 0.4, h: 0.5,
        fontSize: 14, color: BRAND.white, fontFace: FONTS.heritage, autoFit: false, shrinkText: false,
      });
      s.addText(p.copy, {
        x: x + 0.2, y: y + 1.2, w: colW - 0.4, h: 0.65,
        fontSize: 9, color: BRAND.textMuted, fontFace: FONTS.body, autoFit: false, shrinkText: false,
      });
    });
    addFooter(s, 10, total);
  }

  // 11 · Charity & Community ----------------------------------
  {
    const s = pptx.addSlide();
    s.background = { color: BRAND.black };
    addHeader(s, num("charity", 10), charity.eyebrow);

    // Headline (left) — smaller than before to prevent shrink-to-fit
    s.addText([
      { text: charity.headline + "  ", options: { color: BRAND.white } },
      { text: charity.italic, options: { color: BRAND.yellow, italic: true } },
    ], {
      x: MARGIN_X, y: 1.05, w: 8.4, h: 1.9,
      fontSize: 32, fontFace: FONTS.heritage, autoFit: false, shrinkText: false, valign: "top",
    });
    // Intro paragraph — generous height so PPT does not shrink-fit
    s.addText(charity.intro, {
      x: MARGIN_X, y: 3.1, w: 8.4, h: 1.4,
      fontSize: 12, color: "CCCCCC", fontFace: FONTS.body, autoFit: false, shrinkText: false, valign: "top",
    });

    // Flagship stat card (right)
    s.addShape("rect", {
      x: W - 3.6, y: 1.05, w: 2.9, h: 2.2,
      fill: { color: BRAND.surface }, line: { color: BRAND.divider, width: 0.75 },
    });
    s.addText("FLAGSHIP COMMITMENT", {
      x: W - 3.4, y: 1.2, w: 2.6, h: 0.25,
      fontSize: 9, color: BRAND.yellow, fontFace: FONTS.display, autoFit: false, shrinkText: false, charSpacing: 6, valign: "top",
    });
    s.addText(charity.headlineStat.value, {
      x: W - 3.4, y: 1.5, w: 2.6, h: 0.95,
      fontSize: 44, color: BRAND.yellow, fontFace: FONTS.display, autoFit: false, shrinkText: false, bold: true, valign: "top",
    });
    s.addText(charity.headlineStat.label, {
      x: W - 3.4, y: 2.55, w: 2.6, h: 0.6,
      fontSize: 10, color: "CCCCCC", fontFace: FONTS.body, autoFit: false, shrinkText: false, valign: "top",
    });

    // Three programme cards — taller cards, shorter copy region
    const cardW = (W - MARGIN_X * 2) / 3 - 0.15;
    const cardY = 4.6;
    const cardH = 2.0;
    charity.programmes.forEach((p, i) => {
      const x = MARGIN_X + i * (cardW + 0.15);
      s.addShape("rect", {
        x, y: cardY, w: cardW, h: cardH,
        fill: { color: BRAND.black }, line: { color: BRAND.divider, width: 0.75 },
      });
      s.addText(p.duration.toUpperCase(), {
        x: x + 0.25, y: cardY + 0.25, w: cardW - 0.5, h: 0.25,
        fontSize: 8, color: BRAND.yellow, fontFace: FONTS.display, autoFit: false, shrinkText: false, charSpacing: 6, valign: "top",
      });
      s.addText(p.title, {
        x: x + 0.25, y: cardY + 0.55, w: cardW - 0.5, h: 0.55,
        fontSize: 14, color: BRAND.white, fontFace: FONTS.heritage, autoFit: false, shrinkText: false, valign: "top",
      });
      s.addText(p.copy, {
        x: x + 0.25, y: cardY + 1.1, w: cardW - 0.5, h: 0.85,
        fontSize: 9, color: BRAND.textMuted, fontFace: FONTS.body, autoFit: false, shrinkText: false, valign: "top",
      });
    });

    // Sponsor hook strip + footnote — moved into the small gap between cards and footer
    // Cards end at 4.6+2.0=6.6; footer starts at 7.1; safe strip window 6.65-7.05
    const stripY = 6.7;
    s.addShape("rect", {
      x: MARGIN_X, y: stripY, w: 0.06, h: 0.35,
      fill: { color: BRAND.yellow }, line: { color: BRAND.yellow },
    });
    s.addText("SPONSOR HOOK · CSR / ESG", {
      x: MARGIN_X + 0.18, y: stripY, w: 3, h: 0.2,
      fontSize: 8, color: BRAND.yellow, fontFace: FONTS.display, autoFit: false, shrinkText: false, charSpacing: 6, valign: "top",
    });
    s.addText(charity.sponsorHook, {
      x: MARGIN_X + 0.18, y: stripY + 0.22, w: 7.5, h: 0.32,
      fontSize: 9, color: "DDDDDD", fontFace: FONTS.body, autoFit: false, shrinkText: false, valign: "top",
    });
    s.addText(charity.csrFootnote, {
      x: W - MARGIN_X - 4.5, y: stripY, w: 4.5, h: 0.55,
      fontSize: 8, color: "999999", fontFace: FONTS.body, autoFit: false, shrinkText: false, italic: true, valign: "top", align: "right",
    });
    addFooter(s, 11, total);
  }

  // 12 · Inventory --------------------------------------------
  {
    const s = pptx.addSlide();
    s.background = { color: BRAND.black };
    addHeader(s, num("inventory", 10), "Sponsorship Inventory");
    s.addText([
      { text: "Every asset a sponsor\n", options: { color: BRAND.white } },
      { text: "could actually own.", options: { color: BRAND.yellow, italic: true } },
    ], {
      x: MARGIN_X, y: 1.1, w: 8, h: 1.6,
      fontSize: 30, fontFace: FONTS.heritage, autoFit: false, shrinkText: false, valign: "top",
    });
    // Kit flat-lay photo on the right of the intro area — real sponsor visibility proof
    if (imgKits) {
      s.addImage({
        data: imgKits,
        x: W - 4.5, y: 1.1, w: 3.9, h: 1.9,
        sizing: { type: "cover", w: 3.9, h: 1.9 },
      });
      s.addText("SPONSOR VISIBILITY · IN THE FIELD", {
        x: W - 4.5, y: 3.05, w: 3.9, h: 0.25,
        fontSize: 8, color: BRAND.yellow, fontFace: FONTS.display, charSpacing: 6, autoFit: false, shrinkText: false, align: "right",
      });
    }
    const colW = (W - MARGIN_X * 2) / 4 - 0.06;
    inventory.forEach((it, i) => {
      const col = i % 4;
      const row = Math.floor(i / 4);
      const x = MARGIN_X + col * (colW + 0.06);
      const y = 3.55 + row * 1.15;
      s.addShape("rect", {
        x, y, w: colW, h: 1.05,
        fill: { color: BRAND.black }, line: { color: BRAND.divider, width: 0.75 },
      });
      s.addText(String(i + 1).padStart(2, "0"), {
        x: x + 0.15, y: y + 0.1, w: 0.6, h: 0.35,
        fontSize: 13, color: BRAND.yellow, fontFace: FONTS.display, autoFit: false, shrinkText: false, bold: true, valign: "top",
      });
      s.addText(it.title, {
        x: x + 0.15, y: y + 0.4, w: colW - 0.3, h: 0.35,
        fontSize: 11, color: BRAND.white, fontFace: FONTS.heritage, autoFit: false, shrinkText: false, valign: "top",
      });
      s.addText(it.note, {
        x: x + 0.15, y: y + 0.72, w: colW - 0.3, h: 0.32,
        fontSize: 8, color: BRAND.textMuted, fontFace: FONTS.body, autoFit: false, shrinkText: false, valign: "top",
      });
    });
    addFooter(s, 12, total);
  }

  // 13 · Packages ---------------------------------------------
  {
    const s = pptx.addSlide();
    s.background = { color: BRAND.black };
    addHeader(s, num("packages", 11), "Sponsorship Packages");
    s.addText("A ladder built for every ambition.", {
      x: MARGIN_X, y: 1.1, w: W - MARGIN_X * 2, h: 0.9,
      fontSize: 30, color: BRAND.white, fontFace: FONTS.heritage, autoFit: false, shrinkText: false,
    });
    const colW = (W - MARGIN_X * 2) / 5 - 0.06;
    packages.forEach((p, i) => {
      const x = MARGIN_X + i * (colW + 0.06);
      const y = 2.4;
      const isTitle = i === 0;
      s.addShape("rect", {
        x, y, w: colW, h: 4.8,
        fill: { color: isTitle ? BRAND.yellow : BRAND.black },
        line: { color: isTitle ? BRAND.yellow : BRAND.divider, width: 0.75 },
      });
      s.addText(`TIER ${String(i + 1).padStart(2, "0")}`, {
        x: x + 0.15, y: y + 0.2, w: colW - 0.3, h: 0.25,
        fontSize: 8, color: isTitle ? "1a1a1a" : BRAND.textMuted, fontFace: FONTS.display, autoFit: false, shrinkText: false, charSpacing: 6,
      });
      s.addText(p.tier, {
        x: x + 0.15, y: y + 0.5, w: colW - 0.3, h: 0.5,
        fontSize: 15, color: isTitle ? "050505" : BRAND.white, fontFace: FONTS.heritage, autoFit: false, shrinkText: false,
      });
      s.addText(p.tagline, {
        x: x + 0.15, y: y + 1.05, w: colW - 0.3, h: 0.4,
        fontSize: 8.5, color: isTitle ? "1a1a1a" : BRAND.textMuted, fontFace: FONTS.body, autoFit: false, shrinkText: false,
      });
      p.benefits.forEach((b, j) => {
        s.addText([
          { text: "✓  ", options: { color: isTitle ? "050505" : BRAND.yellow, bold: true } },
          { text: b, options: { color: isTitle ? "050505" : "DDDDDD" } },
        ], {
          x: x + 0.15, y: y + 1.55 + j * 0.36, w: colW - 0.3, h: 0.35,
          fontSize: 8, fontFace: FONTS.body, autoFit: false, shrinkText: false,
        });
      });
      s.addText("INVESTMENT", {
        x: x + 0.15, y: y + 4.15, w: colW - 0.3, h: 0.25,
        fontSize: 7.5, color: isTitle ? "1a1a1a" : BRAND.textMuted, fontFace: FONTS.display, autoFit: false, shrinkText: false, charSpacing: 6,
      });
      s.addText("On Request", {
        x: x + 0.15, y: y + 4.4, w: colW - 0.3, h: 0.35,
        fontSize: 13, color: isTitle ? "050505" : BRAND.yellow, fontFace: FONTS.heritage, autoFit: false, shrinkText: false,
      });
    });
    addFooter(s, 13, total);
  }

  // 14 · Custom -----------------------------------------------
  {
    const s = pptx.addSlide();
    s.background = { color: BRAND.black };
    addHeader(s, num("custom", 12), "Custom Sponsorship");
    s.addText("Built for brands of every size.", {
      x: MARGIN_X, y: 1.1, w: W - MARGIN_X * 2, h: 0.9,
      fontSize: 32, color: BRAND.white, fontFace: FONTS.heritage, autoFit: false, shrinkText: false,
    });
    const colW = (W - MARGIN_X * 2) / 3 - 0.15;
    customOptions.forEach((o, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const x = MARGIN_X + col * (colW + 0.15);
      const y = 2.6 + row * 2.15;
      s.addShape("rect", {
        x, y, w: colW, h: 2, fill: { color: BRAND.black },
        line: { color: BRAND.divider, width: 0.75 },
      });
      s.addText("✦", {
        x: x + 0.25, y: y + 0.2, w: 0.5, h: 0.4,
        fontSize: 16, color: BRAND.yellow, fontFace: FONTS.display, autoFit: false, shrinkText: false,
      });
      s.addText(o.title, {
        x: x + 0.25, y: y + 0.65, w: colW - 0.5, h: 0.5,
        fontSize: 16, color: BRAND.white, fontFace: FONTS.heritage, autoFit: false, shrinkText: false,
      });
      s.addText(o.copy, {
        x: x + 0.25, y: y + 1.2, w: colW - 0.5, h: 0.7,
        fontSize: 10, color: BRAND.textMuted, fontFace: FONTS.body, autoFit: false, shrinkText: false,
      });
    });
    addFooter(s, 14, total);
  }

  // 15 · Events -----------------------------------------------
  {
    const s = pptx.addSlide();
    s.background = { color: BRAND.black };
    addHeader(s, num("events", 13), "Events, Programmes & Activation");
    s.addText([
      { text: "Sponsorship that shows up\n", options: { color: BRAND.white } },
      { text: "in real moments.", options: { color: BRAND.yellow, italic: true } },
    ], {
      x: MARGIN_X, y: 1.1, w: W - MARGIN_X * 2, h: 1.8,
      fontSize: 32, fontFace: FONTS.heritage, autoFit: false, shrinkText: false,
    });
    const colW = (W - MARGIN_X * 2) / 4 - 0.06;
    events.forEach((e, i) => {
      const col = i % 4;
      const row = Math.floor(i / 4);
      const x = MARGIN_X + col * (colW + 0.06);
      const y = 3.3 + row * 1.7;
      s.addShape("rect", { x, y, w: colW, h: 1.6, fill: { color: BRAND.black }, line: { color: BRAND.divider, width: 0.75 } });
      s.addText(`ACTIVATION ${String(i + 1).padStart(2, "0")}`, {
        x: x + 0.15, y: y + 0.15, w: colW - 0.3, h: 0.3,
        fontSize: 8, color: BRAND.yellow, fontFace: FONTS.display, autoFit: false, shrinkText: false, charSpacing: 6,
      });
      s.addText(e.title, {
        x: x + 0.15, y: y + 0.45, w: colW - 0.3, h: 0.45,
        fontSize: 13, color: BRAND.white, fontFace: FONTS.heritage, autoFit: false, shrinkText: false,
      });
      s.addText(e.copy, {
        x: x + 0.15, y: y + 0.9, w: colW - 0.3, h: 0.65,
        fontSize: 9, color: BRAND.textMuted, fontFace: FONTS.body, autoFit: false, shrinkText: false,
      });
    });
    addFooter(s, 15, total);
  }

  // 16 · ROI --------------------------------------------------
  {
    const s = pptx.addSlide();
    s.background = { color: BRAND.black };
    addHeader(s, num("why-it-works", 14), "Why It Works for Sponsors");
    s.addText("The commercial case, simply.", {
      x: MARGIN_X, y: 1.1, w: W - MARGIN_X * 2, h: 0.9,
      fontSize: 32, color: BRAND.white, fontFace: FONTS.heritage, autoFit: false, shrinkText: false,
    });
    const colW = (W - MARGIN_X * 2) / 2 - 0.15;
    whyItWorks.forEach((w, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = MARGIN_X + col * (colW + 0.3);
      const y = 2.4 + row * 1.55;
      s.addShape("rect", { x, y, w: colW, h: 1.4, fill: { color: BRAND.black }, line: { color: BRAND.divider, width: 0.75 } });
      s.addText(String(i + 1).padStart(2, "0"), {
        x: x + 0.2, y: y + 0.25, w: 1, h: 0.9,
        fontSize: 32, color: BRAND.yellow, fontFace: FONTS.display, autoFit: false, shrinkText: false, bold: true,
      });
      s.addText(w.title, {
        x: x + 1.4, y: y + 0.2, w: colW - 1.6, h: 0.5,
        fontSize: 15, color: BRAND.white, fontFace: FONTS.heritage, autoFit: false, shrinkText: false,
      });
      s.addText(w.copy, {
        x: x + 1.4, y: y + 0.7, w: colW - 1.6, h: 0.65,
        fontSize: 10, color: BRAND.textMuted, fontFace: FONTS.body, autoFit: false, shrinkText: false,
      });
    });
    addFooter(s, 16, total);
  }

  // 17 · Metrics ----------------------------------------------
  {
    const s = pptx.addSlide();
    s.background = { color: BRAND.black };
    addHeader(s, num("metrics", 15), "What Partners Receive");
    s.addText("Success, measured.", {
      x: MARGIN_X, y: 1.1, w: W - MARGIN_X * 2, h: 0.9,
      fontSize: 32, color: BRAND.white, fontFace: FONTS.heritage, autoFit: false, shrinkText: false,
    });
    metrics.forEach((m, i) => {
      const y = 2.4 + i * 0.85;
      s.addShape("rect", {
        x: MARGIN_X, y: y + 0.85, w: W - MARGIN_X * 2, h: 0.01,
        fill: { color: BRAND.divider }, line: { color: BRAND.divider },
      });
      s.addText(String(i + 1).padStart(2, "0"), {
        x: MARGIN_X, y, w: 1, h: 0.5,
        fontSize: 16, color: BRAND.yellow, fontFace: FONTS.display, autoFit: false, shrinkText: false, bold: true,
      });
      s.addText(m.label, {
        x: MARGIN_X + 1.1, y, w: 4, h: 0.5,
        fontSize: 16, color: BRAND.white, fontFace: FONTS.heritage, autoFit: false, shrinkText: false,
      });
      s.addText(m.note, {
        x: MARGIN_X + 5.3, y, w: W - MARGIN_X * 2 - 5.5, h: 0.5,
        fontSize: 11, color: BRAND.textMuted, fontFace: FONTS.body, autoFit: false, shrinkText: false,
      });
    });
    addFooter(s, 17, total);
  }

  // 18 · Needs / Impact ---------------------------------------
  {
    const s = pptx.addSlide();
    s.background = { color: BRAND.black };
    addHeader(s, num("needs", 16), "Where Sponsorship Goes");
    s.addText([
      { text: "Real impact.\n", options: { color: BRAND.white } },
      { text: "Real destinations.", options: { color: BRAND.yellow, italic: true } },
    ], {
      x: MARGIN_X, y: 1.1, w: W - MARGIN_X * 2, h: 1.8,
      fontSize: 34, fontFace: FONTS.heritage, autoFit: false, shrinkText: false,
    });
    const colW = (W - MARGIN_X * 2) / 3 - 0.15;
    needs.forEach((n, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const x = MARGIN_X + col * (colW + 0.15);
      const y = 3.4 + row * 1.85;
      s.addShape("rect", { x, y, w: colW, h: 1.7, fill: { color: BRAND.black }, line: { color: BRAND.divider, width: 0.75 } });
      s.addShape("rect", {
        x: x + 0.25, y: y + 0.2, w: 0.6, h: 0.06,
        fill: { color: BRAND.yellow }, line: { color: BRAND.yellow },
      });
      s.addText(n.title, {
        x: x + 0.25, y: y + 0.45, w: colW - 0.5, h: 0.5,
        fontSize: 15, color: BRAND.white, fontFace: FONTS.heritage, autoFit: false, shrinkText: false,
      });
      s.addText(n.copy, {
        x: x + 0.25, y: y + 1, w: colW - 0.5, h: 0.65,
        fontSize: 10, color: BRAND.textMuted, fontFace: FONTS.body, autoFit: false, shrinkText: false,
      });
    });
    addFooter(s, 18, total);
  }

  // 19 · Partner ----------------------------------------------
  {
    const s = pptx.addSlide();
    s.background = { color: BRAND.yellow };
    addHeader(s, num("partner", 17), "Partner With Us", true);
    s.addText(contact.headline, {
      x: MARGIN_X, y: 1.4, w: W - MARGIN_X * 2, h: 2.2,
      fontSize: 60, color: "050505", fontFace: FONTS.heritage, autoFit: false, shrinkText: false,
    });
    s.addText(contact.subline, {
      x: MARGIN_X, y: 3.7, w: W - 5.5, h: 1.3,
      fontSize: 14, color: "1a1a1a", fontFace: FONTS.body, autoFit: false, shrinkText: false,
    });

    // Contact grid
    const colW = (W - MARGIN_X * 2) / 3 - 0.2;
    contact.people.forEach((c, i) => {
      const x = MARGIN_X + i * (colW + 0.3);
      const y = 5.4;
      s.addText(c.role.toUpperCase(), {
        x, y, w: colW, h: 0.25,
        fontSize: 8, color: "1a1a1a", fontFace: FONTS.display, autoFit: false, shrinkText: false, charSpacing: 6,
      });
      s.addText(c.name, {
        x, y: y + 0.3, w: colW, h: 0.55,
        fontSize: 18, color: "050505", fontFace: FONTS.heritage, autoFit: false, shrinkText: false,
      });
      s.addText(c.detail, {
        x, y: y + 0.9, w: colW, h: 0.3,
        fontSize: 10, color: "333333", fontFace: FONTS.body, autoFit: false, shrinkText: false,
      });
    });
    addFooter(s, 19, total, true);
  }

  // Save
  await pptx.writeFile({
    fileName: "SCC-Football-Sponsorship-Deck.pptx",
  });
}
