import React from "react";
import { motion } from "framer-motion";
import SectionShell from "@/components/SectionShell";
import { heroImages, glanceStats, sectionsMeta } from "@/data/deckContent";
import { ArrowDown } from "lucide-react";

/* 01 — COVER */
export function Cover({ presenter, onJumpNext }) {
  return (
    <section
      id="cover"
      data-testid="section-cover"
      data-presenter={presenter ? "true" : "false"}
      className={`relative w-full bg-black text-white overflow-hidden ${
        presenter ? "min-h-full" : "min-h-screen"
      }`}
    >
      {/* Full-bleed hero image */}
      <div className="absolute inset-0">
        <img
          src={heroImages.cover}
          alt="SCC Football hero"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
      </div>

      <div
        className={`relative z-10 mx-auto max-w-[1400px] px-6 md:px-12 lg:px-20 flex flex-col justify-between ${
          presenter
            ? "min-h-[calc(100vh-4rem)] py-10"
            : "min-h-screen pt-28 pb-20"
        }`}
      >
        <div className="flex items-center gap-4">
          <span className="font-display text-[var(--scc-yellow)] text-xs tracking-[0.4em]">
            {sectionsMeta.find((s) => s.id === "cover")?.number}
          </span>
          <span className="font-display uppercase tracking-[0.32em] text-[11px] text-white/60">
            — Sponsorship Opportunities
          </span>
        </div>

        <div className="max-w-4xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="eyebrow mb-6"
          >
            Est. 1852 — Singapore Cricket Club
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className={
              presenter
                ? "font-heritage text-[44px] md:text-[68px] lg:text-[88px] leading-[0.95] tracking-[-0.02em]"
                : "font-heritage text-[52px] md:text-[92px] lg:text-[128px] leading-[0.92] tracking-[-0.02em]"
            }
          >
            Partner with <br />
            <span className="italic text-[var(--scc-yellow)]">SCC Football.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-10 max-w-2xl text-lg md:text-xl text-white/70 font-body leading-relaxed"
          >
            Heritage. Community. Performance. Pathway. A sponsorship platform built
            around one of Singapore&rsquo;s most established sporting institutions.
          </motion.p>
        </div>

        <div className="flex items-end justify-between">
          <div className="hidden md:flex items-center gap-10">
            {glanceStats.slice(0, 3).map((s) => (
              <div key={s.label}>
                <div className="font-display text-[var(--scc-yellow)] text-3xl md:text-4xl leading-none">
                  {s.value}
                </div>
                <div className="mt-2 text-[11px] tracking-[0.22em] uppercase text-white/50 font-display">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
          {!presenter && (
            <button
              data-testid="cover-scroll-cue"
              onClick={onJumpNext}
              className="no-print flex items-center gap-2 text-[11px] tracking-[0.28em] uppercase text-white/60 hover:text-[var(--scc-yellow)] transition-colors font-display"
            >
              Scroll <ArrowDown size={14} />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

/* 02 — WHY SCC / WHY NOW */
export function WhyNow({ presenter }) {
  return (
    <SectionShell
      id="why-now"

      eyebrow="Why SCC · Why Now"
      presenter={presenter}
    >
      <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        <div className="lg:col-span-7">
          <h2 className="font-heritage text-4xl md:text-6xl lg:text-7xl leading-[1.02] tracking-[-0.02em]">
            A commercial moment,
            <br />
            <span className="italic text-[var(--scc-yellow)]">not just a history lesson.</span>
          </h2>
          <p className="mt-8 max-w-2xl text-white/70 text-lg leading-relaxed">
            SCC Football is entering its strongest era in modern history — a champion side,
            a scaling academy and a seven‑day‑a‑week presence at the heart of Singaporean sport.
            The next chapter is being written now. Partners who move first will shape it.
          </p>
        </div>
        <div className="lg:col-span-5 lg:pt-10">
          <div className="grid grid-cols-2 gap-px bg-white/10 border border-white/10">
            {[
              { k: "SFL D1", v: "Champions on the pitch" },
              { k: "234+", v: "Section members and growing" },
              { k: "Academy", v: "Youth pipeline scaling up" },
              { k: "170+", v: "Years of trusted heritage" },
            ].map((t) => (
              <div
                key={t.k}
                className="bg-black p-6 tile-hover"
                data-testid={`whynow-tile-${t.k}`}
              >
                <div className="font-display text-3xl text-[var(--scc-yellow)]">{t.k}</div>
                <div className="mt-2 text-sm text-white/60 leading-snug">{t.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

/* 03 — HERITAGE */
export function Heritage({ presenter }) {
  return (
    <SectionShell
      id="heritage"

      eyebrow="Heritage · Est. 1852"
      presenter={presenter}
      className="border-t border-white/5"
    >
      <div className="grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 order-2 lg:order-1">
          <h2 className="font-heritage text-4xl md:text-6xl leading-[1.02] tracking-[-0.02em]">
            One of Singapore&rsquo;s oldest, most trusted sporting institutions.
          </h2>
          <p className="mt-8 text-white/70 text-lg leading-relaxed max-w-xl">
            Founded in 1852, the Singapore Cricket Club has been a fixture of Singaporean sport
            for over 170 years. Our football section carries that heritage forward &mdash; merging
            legacy with modern ambition.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-6">
            {[
              { n: "1852", l: "Founded" },
              { n: "170+", l: "Years of Sport" },
              { n: "Prestige", l: "Standing" },
            ].map((h) => (
              <div key={h.l} className="border-l-2 border-[var(--scc-yellow)] pl-4">
                <div className="font-display text-2xl md:text-3xl">{h.n}</div>
                <div className="text-[11px] tracking-[0.22em] uppercase text-white/50 mt-1">
                  {h.l}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-6 order-1 lg:order-2 relative aspect-[4/5] overflow-hidden">
          <img
            src={heroImages.heritage}
            alt="SCC Ladies at Singapore National Stadium"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
            <div>
              <div className="font-display text-[var(--scc-yellow)] text-xs tracking-[0.3em] uppercase">
                Est. 1852
              </div>
              <div className="font-heritage text-3xl mt-1">Singapore Cricket Club</div>
            </div>
            <div className="text-[10px] tracking-[0.24em] uppercase text-white/50">
              At the National Stadium
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

/* 04 — AT A GLANCE */
export function AtAGlance({ presenter }) {
  return (
    <SectionShell
      id="at-a-glance"

      eyebrow="SCC Football at a Glance"
      presenter={presenter}
    >
      <div className="max-w-4xl">
        <h2 className="font-heritage text-4xl md:text-6xl lg:text-7xl leading-[1.02] tracking-[-0.02em]">
          The proof, in numbers.
        </h2>
        <p className="mt-6 text-white/60 max-w-2xl">
          A fast, scannable snapshot of what SCC Football delivers today — the base every
          sponsorship conversation should start from.
        </p>
      </div>

      {/* SFL D1 Champions moment — the proof behind the stat */}
      <div
        data-testid="glance-champions-photo"
        className="mt-12 relative aspect-[21/9] overflow-hidden border border-white/10"
      >
        <img
          src={heroImages.champions}
          alt="SCC Football lifting the Singapore Football League Division 1 trophy"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
        <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
          <div>
            <div className="font-display text-[10px] tracking-[0.28em] uppercase text-[var(--scc-yellow)]">
              Singapore Football League · Division 1
            </div>
            <div className="font-heritage text-2xl md:text-3xl text-white mt-1 leading-tight">
              Champions.
            </div>
          </div>
          <div className="hidden md:block font-display text-[10px] tracking-[0.24em] uppercase text-white/50">
            $15,000 prize · trophy lifted
          </div>
        </div>
      </div>

      <div className="mt-14 grid grid-cols-2 md:grid-cols-3 gap-px bg-white/10 border border-white/10">
        {glanceStats.map((s, i) => (
          <div
            key={s.label}
            data-testid={`stat-tile-${i}`}
            className="bg-black p-8 md:p-10 tile-hover"
          >
            <div className="font-display text-[var(--scc-yellow)] text-5xl md:text-6xl leading-none">
              {s.value}
            </div>
            <div className="mt-4 text-[12px] tracking-[0.22em] uppercase text-white/70 font-display">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
