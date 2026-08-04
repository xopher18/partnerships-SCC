import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import DeckNav from "@/components/DeckNav";
import PresenterControls from "@/components/PresenterControls";
import { sectionsMeta } from "@/data/deckContent";
import { Cover, WhyNow, Heritage, AtAGlance } from "@/sections/OpeningSections";
import {
  Ecosystem,
  Pathway,
  Audience,
  Alignment,
} from "@/sections/ProofSections";
import { Inventory, Packages, Custom } from "@/sections/CommercialSections";
import {
  Events,
  WhyItWorks,
  Metrics,
  Needs,
  Partner,
} from "@/sections/ClosingSections";

/**
 * Deck — orchestrates scroll narrative and presenter mode.
 *  - Scroll: renders all 16 sections stacked.
 *  - Presenter: renders one section at 100vh with keyboard nav.
 */
export default function Deck() {
  const [presenterMode, setPresenterMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const sectionComponents = useMemo(
    () => [
      { id: "cover", Comp: Cover },
      { id: "why-now", Comp: WhyNow },
      { id: "heritage", Comp: Heritage },
      { id: "at-a-glance", Comp: AtAGlance },
      { id: "ecosystem", Comp: Ecosystem },
      { id: "pathway", Comp: Pathway },
      { id: "audience", Comp: Audience },
      { id: "alignment", Comp: Alignment },
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
                onJumpNext={
                  s.id === "cover" ? () => jumpTo("why-now") : undefined
                }
              />
            );
          })}
          {/* Footer spacer */}
          <div className="no-print text-center text-[10px] tracking-[0.28em] uppercase text-white/30 py-10 font-display border-t border-white/5">
            SCC Football — Sponsorship Deck · 2026
          </div>
        </main>
      )}

      {presenterMode && (
        <main
          data-testid="presenter-mode"
          className="fixed inset-0 z-30 bg-[var(--scc-black)] pt-16"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="h-[calc(100vh-4rem)] overflow-y-auto"
            >
              {(() => {
                const Comp = active.Comp;
                return <Comp presenter={true} />;
              })()}
            </motion.div>
          </AnimatePresence>

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
