import React from "react";
import SectionShell from "@/components/SectionShell";
import { inventory, packages, customOptions } from "@/data/deckContent";
import { Check, Sparkles } from "lucide-react";

/* 09 — INVENTORY */
export function Inventory({ presenter }) {
  return (
    <SectionShell
      id="inventory"
      number="09"
      eyebrow="Sponsorship Inventory"
      presenter={presenter}
    >
      <div className="grid lg:grid-cols-12 gap-10 items-end mb-14">
        <h2 className="lg:col-span-8 font-heritage text-4xl md:text-6xl leading-[1.02] tracking-[-0.02em]">
          Every asset a sponsor
          <br />
          <span className="italic text-[var(--scc-yellow)]">could actually own.</span>
        </h2>
        <p className="lg:col-span-4 text-white/60 leading-relaxed">
          A clear inventory of what is available across kit, digital, events, matchdays
          and hospitality — combinable to suit any partner.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 border border-white/10">
        {inventory.map((it, i) => (
          <div
            key={it.title}
            data-testid={`inventory-${i}`}
            className="bg-black p-7 flex items-start gap-5 tile-hover"
          >
            <div className="font-display text-[var(--scc-yellow)] text-2xl leading-none">
              {String(i + 1).padStart(2, "0")}
            </div>
            <div>
              <div className="font-heritage text-xl">{it.title}</div>
              <div className="text-white/55 text-sm mt-2">{it.note}</div>
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

/* 10 — PACKAGES */
export function Packages({ presenter }) {
  return (
    <SectionShell
      id="packages"
      number="10"
      eyebrow="Sponsorship Packages"
      presenter={presenter}
      className="border-t border-white/5"
    >
      <div className="grid lg:grid-cols-12 gap-10 items-end mb-14">
        <h2 className="lg:col-span-8 font-heritage text-4xl md:text-6xl leading-[1.02] tracking-[-0.02em]">
          A ladder built for every ambition.
        </h2>
        <p className="lg:col-span-4 text-white/60 leading-relaxed">
          Five tiers — from category exclusivity to community backing. Every conversation
          starts from your objectives; we build the package around them.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-px bg-white/10 border border-white/10">
        {packages.map((p, i) => {
          const featured = p.tier === "Title Partner";
          return (
            <div
              key={p.tier}
              data-testid={`package-${i}`}
              className={`p-7 flex flex-col ${
                featured
                  ? "bg-[var(--scc-yellow)] text-black"
                  : "bg-black text-white"
              }`}
            >
              <div
                className={`font-display text-[10px] tracking-[0.28em] uppercase ${
                  featured ? "text-black/60" : "text-white/50"
                }`}
              >
                Tier {String(i + 1).padStart(2, "0")}
              </div>
              <div className="font-heritage text-2xl md:text-3xl mt-3 leading-tight">
                {p.tier}
              </div>
              <div
                className={`text-sm mt-2 ${
                  featured ? "text-black/70" : "text-white/55"
                }`}
              >
                {p.tagline}
              </div>

              <ul className="mt-6 flex-1 space-y-3">
                {p.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm leading-snug">
                    <Check
                      size={14}
                      className={
                        featured ? "text-black mt-0.5" : "text-[var(--scc-yellow)] mt-0.5"
                      }
                    />
                    <span className={featured ? "text-black/85" : "text-white/75"}>{b}</span>
                  </li>
                ))}
              </ul>

              <div
                className={`mt-6 pt-5 border-t ${
                  featured ? "border-black/20" : "border-white/10"
                }`}
              >
                <div
                  className={`text-[10px] tracking-[0.24em] uppercase font-display ${
                    featured ? "text-black/60" : "text-white/40"
                  }`}
                >
                  Investment
                </div>
                <div
                  className={`font-heritage text-xl mt-1 ${
                    featured ? "text-black" : "text-[var(--scc-yellow)]"
                  }`}
                >
                  On Request
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </SectionShell>
  );
}

/* 11 — CUSTOM */
export function Custom({ presenter }) {
  return (
    <SectionShell
      id="custom"
      number="11"
      eyebrow="Custom Sponsorship"
      presenter={presenter}
    >
      <div className="grid lg:grid-cols-12 gap-10 items-end mb-14">
        <h2 className="lg:col-span-8 font-heritage text-4xl md:text-6xl leading-[1.02] tracking-[-0.02em]">
          Built for brands of every size.
        </h2>
        <p className="lg:col-span-4 text-white/60 leading-relaxed">
          The tiers are the starting point — not the ceiling. We tailor packages by
          category, budget and ambition. Cash‑first, in‑kind welcome, always bespoke.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customOptions.map((o, i) => (
          <div
            key={o.title}
            data-testid={`custom-${i}`}
            className="border border-white/10 p-7 hover:border-[var(--scc-yellow)]/60 tile-hover bg-black"
          >
            <Sparkles size={18} className="text-[var(--scc-yellow)]" />
            <div className="font-heritage text-2xl mt-5">{o.title}</div>
            <p className="text-white/60 text-sm mt-3 leading-relaxed">{o.copy}</p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
