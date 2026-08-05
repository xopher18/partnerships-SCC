import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import DeckNav from "@/components/DeckNav";
import PresenterControls from "@/components/PresenterControls";
import { sectionsMeta } from "@/data/deckContent";
import { Cover, WhyNow, Heritage, AtAGlance } from "@/sections/OpeningSections";
import { Scc7s, Regional } from "@/sections/MarqueeSections";
import {
  Ecosystem,
  Pathway,
  Audience,
  Alignment,
} from "@/sections/ProofSections";
import { Charity } from "@/sections/CharitySection";
import { Inventory, Packages, Custom } from "@/sections/CommercialSections";
import {
  Events,
  WhyItWorks,
  Metrics,
  Needs,
  Partner,
} from "@/sections/ClosingSections";

/**
 * Deck - orchestrates scroll narrative and presenter mode.
 *  - Scroll: renders all 16 sections stacked.
 *  - Presenter: renders one section at 100vh with keyboard nav.
 */
export default function Deck() {
  const [presenterMode, setPresenterMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [presenterScale, setPresenterScale] = useState(1);
  const stageContentRef = React.useRef(null);

  // Measure natural content height + compute scale-to-fit for presenter mode.
  // The stage is 1920px wide and height=auto, so scrollHeight gives the real
  // content height. We then scale down to fit the viewport (nav+controls
  // reserved). CSS transforms don't affect layout, so the measurement stays
  // stable even after we apply the scale. We re-measure repeatedly after
  // slide change to catch late-loading images that would grow the content.
  useEffect(() => {
    if (!presenterMode) return;
    const NAV_H = 64;
    const CONTROLS_H = 80;
    const el = stageContentRef.current;
    if (!el) return;
    const update = () => {
      const node = stageContentRef.current;
      if (!node) return;
      const measuredH = Math.max(1080, node.scrollHeight);
      const availW = window.innerWidth;
      const availH = window.innerHeight - NAV_H - CONTROLS_H;
      const s = Math.min(availW / 1920, availH / measuredH);
      setPresenterScale(Math.max(0.15, Math.min(1, s)));
    };
    // Immediate + several delayed re-measurements to catch images loading in
    const raf = requestAnimationFrame(update);
    const timers = [
      setTimeout(update, 150),
      setTimeout(update, 400),
      setTimeout(update, 900),
      setTimeout(update, 1800),
    ];
    // Live re-measure whenever the stage's own box size changes
    const ro = new ResizeObserver(update);
    ro.observe(el);
    // Also re-measure whenever any image inside finishes loading
    const imgs = Array.from(el.querySelectorAll("img"));
    const onLoad = () => update();
    imgs.forEach((img) => {
      if (!img.complete) img.addEventListener("load", onLoad, { once: true });
    });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      ro.disconnect();
      imgs.forEach((img) => img.removeEventListener("load", onLoad));
      window.removeEventListener("resize", update);
    };
  }, [presenterMode, currentIndex]);

  const sectionComponents = useMemo(
    () => [
      { id: "cover", Comp: Cover },
      { id: "why-now", Comp: WhyNow },
      { id: "heritage", Comp: Heritage },
      { id: "at-a-glance", Comp: AtAGlance },
      { id: "ecosystem", Comp: Ecosystem },
      { id: "scc-7s", Comp: Scc7s },
      { id: "regional", Comp: Regional },
      { id: "pathway", Comp: Pathway },
      { id: "audience", Comp: Audience },
      { id: "alignment", Comp: Alignment },
      { id: "charity", Comp: Charity },
      { id: "inventory", Comp: Inventory },
      { id: "packages", Comp: Packages },
      { id: "custom", Comp: Custom },
      { id: "events", Comp: Events },
      { id: "why-it-works", Comp: WhyItWorks },
      { id: "metrics", Comp: Metrics },
      { id: "needs", Comp: Needs },
      { id: "partner", Comp: Partner },
    ],
    []
  );

  const total = sectionComponents.length;

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => Math.max(0, i - 1));
  }, []);
  const goNext = useCallback(() => {
    setCurrentIndex((i) => Math.min(total - 1, i + 1));
  }, [total]);

  const jumpTo = useCallback(
    (id) => {
      const idx = sectionComponents.findIndex((s) => s.id === id);
      if (idx === -1) return;
      if (presenterMode) {
        setCurrentIndex(idx);
      } else {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    [presenterMode, sectionComponents]
  );

  // Lock body scroll in presenter mode
  useEffect(() => {
    if (presenterMode) {
      document.body.classList.add("presenter-lock");
    } else {
      document.body.classList.remove("presenter-lock");
    }
    return () => document.body.classList.remove("presenter-lock");
  }, [presenterMode]);

  // Force scroll mode before print so all 18 sections render into the PDF
  useEffect(() => {
    const onBeforePrint = () => setPresenterMode(false);
    window.addEventListener("beforeprint", onBeforePrint);
    return () => window.removeEventListener("beforeprint", onBeforePrint);
  }, []);

  // Keyboard listener for presenter mode
  useEffect(() => {
    if (!presenterMode) return;
    const onKey = (e) => {
      if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "Escape") {
        setPresenterMode(false);
      } else if (e.key === "Home") {
        setCurrentIndex(0);
      } else if (e.key === "End") {
        setCurrentIndex(total - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [presenterMode, goNext, goPrev, total]);

  const active = sectionComponents[currentIndex];

  return (
    <div className="relative grain-overlay bg-[var(--scc-black)]">
      <DeckNav
        presenterMode={presenterMode}
        setPresenterMode={setPresenterMode}
        onJump={jumpTo}
      />

      {!presenterMode && (
        <main data-testid="scroll-narrative">
          {sectionComponents.map((s) => {
            const Comp = s.Comp;
            return (
              <Comp
                key={s.id}
                presenter={false}
                setPresenterMode={setPresenterMode}
                onJumpNext={
                  s.id === "cover" ? () => jumpTo("why-now") : undefined
                }
              />
            );
          })}
          {/* Footer spacer */}
          <div className="no-print text-center text-[10px] tracking-[0.28em] uppercase text-white/30 py-10 font-display border-t border-white/5">
            SCC Football - Sponsorship Deck · 2026
          </div>
        </main>
      )}

      {presenterMode && (
        <main
          data-testid="presenter-mode"
          className="fixed inset-0 z-30 bg-[var(--scc-black)] pt-16 overflow-hidden"
        >
          <div className="h-[calc(100vh-4rem-80px)] w-screen flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <div
                  data-testid="presenter-stage"
                  ref={stageContentRef}
                  style={{
                    width: 1920,
                    minHeight: 1080,
                    transform: `scale(${presenterScale})`,
                    transformOrigin: "center center",
                    flexShrink: 0,
                  }}
                >
                  {(() => {
                    const Comp = active.Comp;
                    return <Comp presenter={true} setPresenterMode={setPresenterMode} />;
                  })()}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <PresenterControls
            currentIndex={currentIndex}
            total={total}
            onPrev={goPrev}
            onNext={goNext}
            onExit={() => setPresenterMode(false)}
          />
        </main>
      )}
    </div>
  );
}
