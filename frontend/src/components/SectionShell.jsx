import React from "react";
import { motion } from "framer-motion";
import { sectionsMeta } from "@/data/deckContent";

/**
 * Section wrapper for both scroll and presenter mode.
 *  - In scroll: sections are stacked with generous padding.
 *  - In presenter: the parent renders one shell at a time at 100vh.
 *  - Number auto-derived from sectionsMeta by id (kept in sync with nav).
 */
export default function SectionShell({
  id,
  eyebrow,
  number: numberProp,
  presenter,
  children,
  className = "",
  bg = "black",
  testId,
}) {
  const meta = sectionsMeta.find((s) => s.id === id);
  const number = numberProp || meta?.number;
  const bgClass =
    bg === "yellow"
      ? "bg-[var(--scc-yellow)] text-black"
      : bg === "white"
      ? "bg-white text-black"
      : "bg-[var(--scc-black)] text-white";

  return (
    <section
      id={id}
      data-testid={testId || `section-${id}`}
      data-presenter={presenter ? "true" : "false"}
      className={`relative w-full ${bgClass} ${
        presenter ? "min-h-full" : "min-h-screen"
      } ${className}`}
    >
      <div
        className={`relative mx-auto max-w-[1400px] w-full px-6 md:px-12 lg:px-20 ${
          presenter
            ? "min-h-[calc(100vh-4rem)] flex flex-col justify-center py-10 md:py-14"
            : "py-28 md:py-36"
        }`}
      >
        {(eyebrow || number) && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-4 mb-8"
          >
            {number && (
              <span className="font-display text-[var(--scc-yellow)] text-xs tracking-[0.4em]">
                {number}
              </span>
            )}
            {eyebrow && (
              <span
                className={`font-display uppercase tracking-[0.32em] text-[11px] ${
                  bg === "yellow" ? "text-black/70" : "text-white/60"
                }`}
              >
                — {eyebrow}
              </span>
            )}
          </motion.div>
        )}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}
