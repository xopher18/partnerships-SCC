/**
 * SCC Football sponsorship deck — .pptx exporter (screenshot-based).
 *
 * Instead of rebuilding the deck in PowerPoint's coordinate system (fragile,
 * looks nothing like the web deck), we render each web section into an
 * off-screen 1920×1080 container, screenshot it with html2canvas, and drop
 * each screenshot into a 16:9 PPT slide as a full-bleed image.
 *
 * Result: the PowerPoint file is pixel-identical to the web deck.
 *
 * Trade-off: text is not editable in PowerPoint (each slide is an image),
 * but for a sponsor-facing deck this is the standard trade to guarantee
 * fidelity, and is how Pitch, Beautiful.ai and Gamma export.
 */
import PptxGenJS from "pptxgenjs";
import html2canvas from "html2canvas";
import { sectionsMeta } from "@/data/deckContent";

// Slide size (16:9 widescreen inches)
const SLIDE_W = 13.333;
const SLIDE_H = 7.5;

// Capture canvas resolution (16:9 at ~1080p — high quality, still email-friendly)
const CAP_W = 1920;
const CAP_H = 1080;

/**
 * Wait for every <img> inside a node to be loaded (or timeout).
 */
function waitForImages(root, timeoutMs = 4000) {
  const imgs = Array.from(root.querySelectorAll("img"));
  if (imgs.length === 0) return Promise.resolve();
  return Promise.all(
    imgs.map(
      (img) =>
        new Promise((resolve) => {
          if (img.complete && img.naturalWidth > 0) return resolve();
          const done = () => resolve();
          img.addEventListener("load", done, { once: true });
          img.addEventListener("error", done, { once: true });
          setTimeout(done, timeoutMs);
        })
    )
  );
}

/**
 * Neutralise things on the cloned tree that would otherwise:
 *   • ghost the shot (framer-motion pre-animation transforms)
 *   • overflow the 16:9 capture (huge py-28 / py-36 scroll-mode padding)
 *   • cluster content at the top with a large empty stripe beneath
 */
function prepareCloneForCapture(root) {
  // Kill motion-driven inline transforms / opacity so nothing is ghosted
  const all = [root, ...root.querySelectorAll("*")];
  for (const el of all) {
    if (!el.style) continue;
    el.style.transform = "none";
    el.style.opacity = "1";
    el.style.filter = "none";
    if (el.style.maxHeight && el.style.maxHeight.includes("vh")) {
      el.style.maxHeight = "none";
    }
  }
  // Compress the giant scroll-mode padding AND turn the padded wrapper into
  // a flex column that vertically centres its content — unless it already
  // opts into a specific justify-* strategy (Cover / Partner use
  // `justify-between`). Also clamp `min-h-screen` to the capture height so
  // sections don't drift off the slide.
  const padded = root.querySelectorAll(
    "[class*='py-28'], [class*='py-32'], [class*='py-36'], [class*='py-40']"
  );
  padded.forEach((el) => {
    el.style.paddingTop = "56px";
    el.style.paddingBottom = "56px";
    el.style.minHeight = `${CAP_H}px`;
    const cls = el.getAttribute("class") || "";
    const hasOwnJustify = /\bjustify-(between|start|end|around|evenly)\b/.test(cls);
    if (!hasOwnJustify) {
      el.style.display = "flex";
      el.style.flexDirection = "column";
      el.style.justifyContent = "center";
    }
  });
  const screenTall = root.querySelectorAll("[class*='min-h-screen']");
  screenTall.forEach((el) => {
    el.style.minHeight = `${CAP_H}px`;
  });
}

/**
 * Capture one section (looked up by DOM id) as a JPEG data URL. Returns the
 * captured dimensions too, so the caller can letterbox the image into a 16:9
 * PPT slide without stretching or cropping.
 */
async function captureSection(sectionId) {
  const original = document.getElementById(sectionId);
  if (!original) throw new Error(`Section not found: #${sectionId}`);

  // Off-screen capture stage — fixed width, natural (content-driven) height.
  const stage = document.createElement("div");
  Object.assign(stage.style, {
    position: "fixed",
    left: "0",
    top: "0",
    width: `${CAP_W}px`,
    height: "auto",
    overflow: "hidden",
    background: "#050505",
    zIndex: "-1",
    transform: `translate(-200000px, 0)`,
    pointerEvents: "none",
  });

  const clone = original.cloneNode(true);
  Object.assign(clone.style, {
    width: `${CAP_W}px`,
    margin: "0",
    position: "relative",
    // Do NOT force a fixed height — we want the section to lay itself out
    // naturally, then we capture at whatever height it needs. This preserves
    // each section's own flex layout (Cover: justify-between, Partner:
    // justify-between, others: SectionShell defaults).
    minHeight: `${CAP_H}px`,
  });

  stage.appendChild(clone);
  document.body.appendChild(stage);

  try {
    prepareCloneForCapture(clone);
    await waitForImages(clone);
    // Give fonts / gradients one paint frame
    await new Promise((r) => requestAnimationFrame(() => setTimeout(r, 120)));

    // Measure natural rendered dimensions
    const rect = clone.getBoundingClientRect();
    const capW = CAP_W;
    const capH = Math.max(CAP_H, Math.ceil(rect.height));

    const canvas = await html2canvas(clone, {
      width: capW,
      height: capH,
      windowWidth: capW,
      windowHeight: capH,
      useCORS: true,
      allowTaint: false,
      backgroundColor: "#050505",
      scale: 1,
      logging: false,
      ignoreElements: (el) =>
        el.classList && (el.classList.contains("no-print") ||
          el.getAttribute?.("data-testid") === "deck-nav" ||
          el.getAttribute?.("data-testid") === "presenter-controls"),
    });

    return {
      dataUrl: canvas.toDataURL("image/jpeg", 0.9),
      w: capW,
      h: capH,
    };
  } finally {
    document.body.removeChild(stage);
  }
}

/**
 * Build the sponsorship deck. Captures every section from the live DOM and
 * embeds them as full-bleed slide images in a 16:9 PPTX.
 *
 * @param {(state: {current:number,total:number,label:string}) => void} onProgress
 */
export async function generateSccPptx(onProgress) {
  // Pre-flight: require a desktop-width viewport so responsive Tailwind
  // breakpoints (md:, lg:) match the polished web design.
  if (typeof window !== "undefined" && window.innerWidth < 1280) {
    throw new Error(
      "PPT download needs a desktop-width browser (≥1280px). Please switch to a laptop or widen the window."
    );
  }

  // Ensure custom fonts are ready before capturing
  if (document.fonts && document.fonts.ready) {
    try {
      await document.fonts.ready;
    } catch (_e) {
      /* non-fatal */
    }
  }

  const pptx = new PptxGenJS();
  pptx.title = "SCC Football — Sponsorship Opportunities";
  pptx.subject = "Partnership deck for SCC Football";
  pptx.company = "Singapore Cricket Club — Football Section";
  pptx.author = "SCC Football";
  pptx.layout = "LAYOUT_WIDE"; // 13.333 x 7.5

  const total = sectionsMeta.length;
  const SLIDE_AR = SLIDE_W / SLIDE_H;
  for (let i = 0; i < total; i++) {
    const meta = sectionsMeta[i];
    onProgress?.({ current: i + 1, total, label: meta.label });
    let cap;
    try {
      cap = await captureSection(meta.id);
    } catch (e) {
      console.warn(`Failed to capture section #${meta.id}:`, e);
      continue;
    }
    const slide = pptx.addSlide();
    slide.background = { color: "050505" };
    // Fit the captured image inside the 16:9 slide while preserving aspect
    // ratio — letterbox with the black slide background if aspects differ.
    const imgAR = cap.w / cap.h;
    let iw;
    let ih;
    let ix;
    let iy;
    if (imgAR >= SLIDE_AR) {
      // Image wider than slide → fit width, centre vertically
      iw = SLIDE_W;
      ih = SLIDE_W / imgAR;
      ix = 0;
      iy = (SLIDE_H - ih) / 2;
    } else {
      // Image taller than slide → fit height, centre horizontally
      ih = SLIDE_H;
      iw = SLIDE_H * imgAR;
      ix = (SLIDE_W - iw) / 2;
      iy = 0;
    }
    slide.addImage({
      data: cap.dataUrl,
      x: ix,
      y: iy,
      w: iw,
      h: ih,
    });
  }

  await pptx.writeFile({
    fileName: "SCC-Football-Sponsorship-Deck.pptx",
  });
}
