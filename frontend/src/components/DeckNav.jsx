import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sectionsMeta } from "@/data/deckContent";
import { Play, Layers, ArrowUpRight, ChevronDown, Download } from "lucide-react";
import { generateSccPptx } from "@/lib/generatePptx";

/**
 * Compact sticky top nav.
 *  - SCC mark
 *  - "Sections" dropdown (all 16)
 *  - Presenter toggle
 *  - Partner With Us CTA
 */
export default function DeckNav({ presenterMode, setPresenterMode, onJump }) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [downloading, setDownloading] = React.useState(false);
  const menuRef = React.useRef(null);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      await generateSccPptx();
    } catch (e) {
      console.error("PPT generation failed", e);
    } finally {
      setDownloading(false);
    }
  };

  React.useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [menuOpen]);

  const handleJump = (id) => {
    onJump(id);
    setMenuOpen(false);
  };

  return (
    <header
      data-testid="deck-nav"
      className="no-print fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-black/60 border-b border-white/10"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 h-16 flex items-center justify-between gap-4">
        <button
          data-testid="deck-nav-logo"
          onClick={() => onJump("cover")}
          className="flex items-center gap-3 group shrink-0"
        >
          <div className="h-8 w-8 rounded-sm bg-[var(--scc-yellow)] flex items-center justify-center">
            <span className="font-display text-black text-sm font-bold">SCC</span>
          </div>
          <div className="hidden sm:flex flex-col leading-tight text-left">
            <span className="font-display text-[11px] tracking-[0.28em] text-white uppercase">
              SCC Football
            </span>
            <span className="font-body text-[10px] tracking-[0.18em] text-white/50 uppercase">
              Est. 1852 · Singapore
            </span>
          </div>
        </button>

        <div className="flex items-center gap-2">
          {/* Sections dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              data-testid="nav-sections-toggle"
              onClick={() => setMenuOpen((v) => !v)}
              className={`inline-flex items-center gap-2 px-4 h-10 border text-[11px] tracking-[0.22em] uppercase font-display transition-colors ${
                menuOpen
                  ? "bg-white/10 border-white/30 text-white"
                  : "border-white/15 text-white/80 hover:border-[var(--scc-yellow)] hover:text-white"
              }`}
            >
              Sections
              <ChevronDown
                size={14}
                className={`transition-transform ${menuOpen ? "rotate-180" : ""}`}
              />
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  data-testid="nav-sections-menu"
                  className="absolute right-0 mt-2 w-[min(92vw,520px)] bg-black/95 backdrop-blur-2xl border border-white/10 shadow-2xl"
                >
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 p-4">
                    {sectionsMeta.map((s) => (
                      <button
                        key={s.id}
                        data-testid={`nav-jump-${s.id}`}
                        onClick={() => handleJump(s.id)}
                        className="group flex items-baseline gap-3 text-left px-3 py-2.5 hover:bg-white/5 transition-colors"
                      >
                        <span className="font-display text-[var(--scc-yellow)] text-[11px] tracking-[0.22em]">
                          {s.number}
                        </span>
                        <span className="font-body text-white/80 group-hover:text-white text-sm">
                          {s.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            data-testid="presenter-toggle"
            onClick={() => setPresenterMode((v) => !v)}
            className={`hidden md:inline-flex items-center gap-2 px-4 h-10 border text-[11px] tracking-[0.22em] uppercase font-display transition-colors ${
              presenterMode
                ? "bg-[var(--scc-yellow)] text-black border-[var(--scc-yellow)]"
                : "bg-transparent text-white/80 border-white/20 hover:border-[var(--scc-yellow)] hover:text-white"
            }`}
          >
            {presenterMode ? <Layers size={14} /> : <Play size={14} />}
            {presenterMode ? "Exit Presenter" : "Presenter"}
          </button>

          <button
            data-testid="download-pptx"
            onClick={handleDownload}
            disabled={downloading}
            className="hidden md:inline-flex items-center gap-2 px-4 h-10 border border-white/20 text-white/80 hover:border-[var(--scc-yellow)] hover:text-white text-[11px] tracking-[0.22em] uppercase font-display transition-colors disabled:opacity-50 disabled:cursor-wait"
          >
            <Download size={14} />
            {downloading ? "Building…" : "Download PPT"}
          </button>

          <button
            data-testid="cta-partner-nav"
            onClick={() => onJump("partner")}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 h-10 bg-white text-black text-[11px] tracking-[0.22em] uppercase font-display hover:bg-[var(--scc-yellow)] transition-colors"
          >
            Partner With Us
            <ArrowUpRight size={14} />
          </button>
        </div>
      </div>
    </header>
  );
}
