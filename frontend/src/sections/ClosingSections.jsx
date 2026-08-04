import React from "react";
import SectionShell from "@/components/SectionShell";
import { events, whyItWorks, metrics, needs, contact, heroImages, sectionsMeta } from "@/data/deckContent";
import { Mail, Globe, Phone, ArrowUpRight } from "lucide-react";

/* 12 — EVENTS & ACTIVATION */
export function Events({ presenter }) {
  return (
    <SectionShell
      id="events"

      eyebrow="Events, Programmes & Activation"
      presenter={presenter}
      className="border-t border-white/5"
    >
      <div className="grid lg:grid-cols-12 gap-10 items-end mb-14">
        <h2 className="lg:col-span-8 font-heritage text-4xl md:text-6xl leading-[1.02] tracking-[-0.02em]">
          Sponsorship that shows up
          <br />
          <span className="italic text-[var(--scc-yellow)]">in real moments.</span>
        </h2>
        <p className="lg:col-span-4 text-white/60 leading-relaxed">
          Football happens seven days a week at SCC — training, matchdays, tournaments,
          camps, community days. Every one of them is an activation opportunity.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 border border-white/10">
        {events.map((e, i) => (
          <div
            key={e.title}
            data-testid={`event-${i}`}
            className="bg-black p-8 tile-hover min-h-[180px]"
          >
            <div className="font-display text-[10px] tracking-[0.28em] uppercase text-[var(--scc-yellow)]">
              Activation {String(i + 1).padStart(2, "0")}
            </div>
            <div className="font-heritage text-2xl mt-4">{e.title}</div>
            <p className="text-white/60 text-sm mt-3 leading-relaxed">{e.copy}</p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

/* 13 — WHY IT WORKS FOR SPONSORS */
export function WhyItWorks({ presenter }) {
  return (
    <SectionShell
      id="why-it-works"

      eyebrow="Why It Works for Sponsors"
      presenter={presenter}
    >
      <div className="max-w-4xl">
        <h2 className="font-heritage text-4xl md:text-6xl lg:text-7xl leading-[1.02] tracking-[-0.02em]">
          The commercial case, simply.
        </h2>
        <p className="mt-6 text-white/60 max-w-2xl">
          Six reasons partners choose SCC Football — each one measurable, storyable and
          repeatable across a full season.
        </p>
      </div>

      <div className="mt-14 grid md:grid-cols-2 gap-px bg-white/10 border border-white/10">
        {whyItWorks.map((w, i) => (
          <div
            key={w.title}
            data-testid={`why-${i}`}
            className="bg-black p-8 md:p-10 flex gap-6 items-start tile-hover"
          >
            <div className="font-display text-5xl text-[var(--scc-yellow)] leading-none min-w-[70px]">
              {String(i + 1).padStart(2, "0")}
            </div>
            <div>
              <div className="font-heritage text-2xl">{w.title}</div>
              <p className="text-white/60 mt-3 leading-relaxed">{w.copy}</p>
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

/* 14 — METRICS */
export function Metrics({ presenter }) {
  return (
    <SectionShell
      id="metrics"

      eyebrow="What Partners Receive"
      presenter={presenter}
      className="border-t border-white/5"
    >
      <div className="grid lg:grid-cols-12 gap-10 items-end mb-14">
        <h2 className="lg:col-span-8 font-heritage text-4xl md:text-6xl leading-[1.02] tracking-[-0.02em]">
          Success, measured.
        </h2>
        <p className="lg:col-span-4 text-white/60 leading-relaxed">
          Every partnership comes with a reporting rhythm — so you can show ROI internally
          and defend the investment with confidence.
        </p>
      </div>

      <ul className="divide-y divide-white/10 border-y border-white/10">
        {metrics.map((m, i) => (
          <li
            key={m.label}
            data-testid={`metric-${i}`}
            className="grid md:grid-cols-12 items-center py-7 gap-6"
          >
            <div className="md:col-span-1 font-display text-[var(--scc-yellow)] text-xl">
              {String(i + 1).padStart(2, "0")}
            </div>
            <div className="md:col-span-4 font-heritage text-2xl">{m.label}</div>
            <div className="md:col-span-7 text-white/60">{m.note}</div>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}

/* 15 — CURRENT NEEDS */
export function Needs({ presenter }) {
  return (
    <SectionShell
      id="needs"

      eyebrow="Where Sponsorship Goes"
      presenter={presenter}
    >
      <div className="grid lg:grid-cols-12 gap-10 items-end mb-14">
        <h2 className="lg:col-span-8 font-heritage text-4xl md:text-6xl leading-[1.02] tracking-[-0.02em]">
          Real impact.
          <br />
          <span className="italic text-[var(--scc-yellow)]">Real destinations.</span>
        </h2>
        <p className="lg:col-span-4 text-white/60 leading-relaxed">
          Sponsors know exactly what their support funds. Below are the current priorities
          for SCC Football — the areas we are actively seeking backing for.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 border border-white/10">
        {needs.map((n, i) => (
          <div
            key={n.title}
            data-testid={`need-${i}`}
            className="bg-black p-8 tile-hover min-h-[200px]"
          >
            <div className="h-1 w-10 bg-[var(--scc-yellow)]" />
            <div className="font-heritage text-2xl mt-6">{n.title}</div>
            <p className="text-white/60 text-sm mt-3 leading-relaxed">{n.copy}</p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

/* 16 — PARTNER WITH US */
export function Partner({ presenter }) {
  return (
    <section
      id="partner"
      data-testid="section-partner"
      className={`relative w-full bg-[var(--scc-yellow)] text-black overflow-hidden ${
        presenter ? "h-screen" : "min-h-screen"
      }`}
    >
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <img
          src={heroImages.team}
          alt="SCC Football team placeholder"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[var(--scc-yellow)] mix-blend-multiply" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] w-full px-6 md:px-12 lg:px-20 py-28 md:py-36 min-h-screen flex flex-col justify-between">
        <div className="flex items-center gap-4">
          <span className="font-display text-black text-xs tracking-[0.4em]">
            {sectionsMeta.find((s) => s.id === "partner")?.number}
          </span>
          <span className="font-display uppercase tracking-[0.32em] text-[11px] text-black/70">
            — Partner With Us
          </span>
        </div>

        <div className="max-w-4xl">
          <h2 className="font-heritage text-5xl md:text-7xl lg:text-8xl leading-[0.98] tracking-[-0.02em]">
            {contact.headline}
          </h2>
          <p className="mt-8 text-black/75 text-lg md:text-xl max-w-2xl leading-relaxed">
            {contact.subline}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10 md:gap-6 pt-10 border-t border-black/20">
          {contact.people.map((c, i) => {
            const Icon = i === 0 ? Phone : i === 1 ? Mail : Globe;
            return (
              <div key={c.role} data-testid={`contact-${i}`}>
                <div className="flex items-center gap-2 text-[11px] tracking-[0.28em] uppercase font-display text-black/60">
                  <Icon size={12} /> {c.role}
                </div>
                <div className="font-heritage text-2xl md:text-3xl mt-3">{c.name}</div>
                <div className="text-sm text-black/60 mt-2">{c.detail}</div>
              </div>
            );
          })}

          <div className="md:col-span-3 flex flex-wrap gap-4 pt-4">
            <a
              data-testid="cta-email"
              href="mailto:partnerships@sccfootball.sg"
              className="inline-flex items-center gap-2 bg-black text-white px-6 h-12 font-display uppercase tracking-[0.22em] text-xs hover:bg-white hover:text-black transition-colors"
            >
              Start a Conversation <ArrowUpRight size={14} />
            </a>
            <button
              data-testid="cta-print"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 border border-black text-black px-6 h-12 font-display uppercase tracking-[0.22em] text-xs hover:bg-black hover:text-[var(--scc-yellow)] transition-colors"
            >
              Download / Print Deck
            </button>
          </div>
        </div>

        <div className="pt-10 flex items-center justify-between text-[10px] tracking-[0.28em] uppercase text-black/60 font-display">
          <span>SCC Football · Est. 1852</span>
          <span>Sponsorship Opportunities · 2026</span>
        </div>
      </div>
    </section>
  );
}
