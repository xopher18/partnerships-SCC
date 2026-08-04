import React from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { sectionsMeta } from "@/data/deckContent";

/**
 * On-screen chrome shown ONLY when presenter mode is active.
 * Keyboard nav is wired in the parent Deck page.
 */
export default function PresenterControls({
  currentIndex,
  total,
  onPrev,
  onNext,
  onExit,
}) {
  const current = sectionsMeta[currentIndex];
  return (
    <div
      data-testid="presenter-chrome"
      className="no-print fixed inset-x-0 bottom-0 z-40 pointer-events-none"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 pb-6 flex items-end justify-between gap-6">
        <div className="pointer-events-auto flex items-center gap-4 bg-black/70 backdrop-blur-xl border border-white/10 px-5 py-3">
          <span className="font-display text-[var(--scc-yellow)] text-lg tracking-widest">
            {String(currentIndex + 1).padStart(2, "0")}
            <span className="text-white/40 mx-2">/</span>
            <span className="text-white/60">{String(total).padStart(2, "0")}</span>
          </span>
          <span className="hidden md:block h-6 w-px bg-white/15" />
          <span className="hidden md:block font-display uppercase tracking-[0.25em] text-white/80 text-xs">
            {current?.label}
          </span>
        </div>

        <div className="pointer-events-auto flex items-center gap-2">
          <button
            data-testid="presenter-prev"
            onClick={onPrev}
            disabled={currentIndex === 0}
            className="h-11 w-11 grid place-items-center border border-white/15 bg-black/70 text-white hover:border-[var(--scc-yellow)] hover:text-[var(--scc-yellow)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            data-testid="presenter-next"
            onClick={onNext}
            disabled={currentIndex === total - 1}
            className="h-11 w-11 grid place-items-center border border-white/15 bg-black/70 text-white hover:border-[var(--scc-yellow)] hover:text-[var(--scc-yellow)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight size={18} />
          </button>
          <button
            data-testid="presenter-exit"
            onClick={onExit}
            className="h-11 px-4 grid place-items-center border border-[var(--scc-yellow)] bg-[var(--scc-yellow)] text-black hover:brightness-95 transition-colors font-display uppercase tracking-[0.2em] text-[11px]"
          >
            <span className="flex items-center gap-1.5">
              <X size={14} /> Exit
            </span>
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-[3px] w-full bg-white/5">
        <div
          data-testid="presenter-progress"
          className="h-full bg-[var(--scc-yellow)] transition-[width] duration-500 ease-out"
          style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
        />
      </div>
    </div>
  );
}
