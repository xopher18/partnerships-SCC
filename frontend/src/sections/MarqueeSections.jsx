import React from "react";
import SectionShell from "@/components/SectionShell";
import { scc7s, regionalTournaments, heroImages } from "@/data/deckContent";
import { Trophy, MapPin, CalendarDays, Radio, Users, Star } from "lucide-react";

/* 06 - SCC FOOTBALL 7s (marquee event) */
export function Scc7s({ presenter }) {
  return (
    <section
      id="scc-7s"
      data-testid="section-scc-7s"
      data-presenter={presenter ? "true" : "false"}
      className={`relative w-full bg-[var(--scc-black)] text-white overflow-hidden ${
        presenter ? "min-h-full" : "min-h-screen"
      }`}
    >
      {/* Backdrop hero */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src={heroImages.atmosphere}
          alt="SCC Football 7s atmosphere placeholder"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/85 to-black" />
      </div>

      <div
        className={`relative z-10 mx-auto max-w-[1400px] w-full px-6 md:px-12 lg:px-20 ${
          presenter
            ? "min-h-[calc(100vh-4rem)] flex flex-col justify-center py-10 md:py-14"
            : "py-28 md:py-36"
        }`}
      >
        <div className="flex items-center gap-4 mb-10">
          <span className="font-display text-[var(--scc-yellow)] text-xs tracking-[0.4em]">06</span>
          <span className="font-display uppercase tracking-[0.32em] text-[11px] text-white/60">
            - {scc7s.eyebrow}
          </span>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-8">
            <h2
              className={
                presenter
                  ? "font-heritage text-4xl md:text-5xl lg:text-6xl leading-[0.98] tracking-[-0.02em]"
                  : "font-heritage text-5xl md:text-7xl lg:text-8xl leading-[0.98] tracking-[-0.02em]"
              }
            >
              {scc7s.headline}
              <br />
              <span className="italic text-[var(--scc-yellow)]">{scc7s.italic}</span>
            </h2>
            <p className="mt-8 max-w-2xl text-white/70 text-lg leading-relaxed">
              {scc7s.intro}
            </p>
          </div>

          {/* Big stat block */}
          <div className="lg:col-span-4">
            <div className="border border-white/10 bg-black/60 p-8 backdrop-blur-sm">
              <div className="font-display text-[10px] tracking-[0.28em] uppercase text-[var(--scc-yellow)]">
                Signature Impact
              </div>
              <div
                data-testid="scc7s-hero-stat"
                className={
                  presenter
                    ? "font-display text-[var(--scc-yellow)] text-[72px] leading-none mt-3"
                    : "font-display text-[var(--scc-yellow)] text-[96px] leading-none mt-3"
                }
              >
                1M+
              </div>
              <div className="text-white/70 font-body mt-2">
                Views & digital reach for a single weekend
              </div>
            </div>
          </div>
        </div>

        {/* Stat strip */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 border border-white/10">
          {scc7s.bigStats.map((s, i) => (
            <div
              key={s.label}
              data-testid={`scc7s-stat-${i}`}
              className="bg-black/70 backdrop-blur-sm p-6"
            >
              <div className="font-display text-[var(--scc-yellow)] text-3xl md:text-4xl">
                {s.value}
              </div>
              <div className="mt-2 text-[11px] tracking-[0.22em] uppercase text-white/60 font-display">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Marquee players + sponsor benefits */}
        <div className="mt-14 grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-6">
            <div className="flex items-center gap-3 mb-5">
              <Star size={16} className="text-[var(--scc-yellow)]" />
              <span className="font-display uppercase tracking-[0.28em] text-[11px] text-white/70">
                Recent Marquee Guests
              </span>
            </div>
            <div className="grid sm:grid-cols-3 gap-px bg-white/10 border border-white/10">
              {scc7s.marqueePlayers.map((p, i) => (
                <div
                  key={p.name}
                  data-testid={`scc7s-marquee-${i}`}
                  className="bg-black/70 p-5"
                >
                  <div className="font-heritage text-xl leading-tight">{p.name}</div>
                  <div className="mt-2 text-[10px] tracking-[0.22em] uppercase text-white/50 font-display">
                    {p.club}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-5 text-white/55 text-sm leading-relaxed max-w-md">
              Ex‑professionals join the tournament weekend - appearing at the Gala Dinner
              and playing on the sponsor‑backed all‑star team.
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="flex items-center gap-3 mb-5">
              <Trophy size={16} className="text-[var(--scc-yellow)]" />
              <span className="font-display uppercase tracking-[0.28em] text-[11px] text-white/70">
                What Sponsors Get at the 7s
              </span>
            </div>
            <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
              {scc7s.sponsorBenefits.map((b, i) => (
                <li
                  key={b}
                  data-testid={`scc7s-benefit-${i}`}
                  className="flex items-start gap-3 text-sm text-white/80 leading-relaxed"
                >
                  <span className="mt-2 h-1.5 w-1.5 bg-[var(--scc-yellow)] shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* 07 - REGIONAL CIRCUIT */
export function Regional({ presenter }) {
  return (
    <SectionShell
      id="regional"
      eyebrow="Regional 7s Circuit"
      presenter={presenter}
      className="border-t border-white/5"
    >
      <div className="grid lg:grid-cols-12 gap-10 items-start mb-10">
        <h2 className="lg:col-span-7 font-heritage text-4xl md:text-6xl leading-[1.02] tracking-[-0.02em]">
          Your brand.
          <br />
          <span className="italic text-[var(--scc-yellow)]">On tour across Asia.</span>
        </h2>
        <div className="lg:col-span-5 space-y-4">
          <p className="text-white/60 leading-relaxed">
            SCC Football doesn&rsquo;t only host. Our teams travel a prestigious regional 7s
            calendar - carrying sponsor branding across three of Asia&rsquo;s most storied
            clubs, plus our own headline event.
          </p>
          <div
            data-testid="regional-hero-photo"
            className="relative aspect-[16/9] overflow-hidden border border-white/10"
          >
            <img
              src={heroImages.regional}
              alt="SCC Football at Hong Kong 7s"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
              <div>
                <div className="font-display text-[10px] tracking-[0.28em] uppercase text-[var(--scc-yellow)]">
                  On Tour · Hong Kong 7s
                </div>
                <div className="font-heritage text-lg text-white mt-1 leading-tight">
                  Men&rsquo;s side representing SCC in the region
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-px bg-white/10 border border-white/10">
        {regionalTournaments.map((t, i) => {
          // Diagonal yellow layout: positions 1 & 4 (indexes 0 and 3)
          const isYellow = i === 0 || i === 3;
          return (
          <div
            key={t.title}
            data-testid={`regional-${i}`}
            className={`p-8 tile-hover ${
              isYellow ? "bg-[var(--scc-yellow)] text-black" : "bg-black text-white"
            }`}
          >
            <div
              className={`flex items-center justify-between text-[10px] tracking-[0.28em] uppercase font-display ${
                isYellow ? "text-black/70" : "text-[var(--scc-yellow)]"
              }`}
            >
              <span className="flex items-center gap-2">
                <CalendarDays size={12} />
                {t.month}
              </span>
              {t.highlight && (
                <span
                  className={`flex items-center gap-1.5 px-2 py-0.5 ${
                    isYellow
                      ? "bg-black text-[var(--scc-yellow)]"
                      : "bg-[var(--scc-yellow)] text-black"
                  }`}
                >
                  {t.highlight === "Live TV" ? <Radio size={10} /> : <Trophy size={10} />}
                  {t.highlight}
                </span>
              )}
            </div>
            <div className="font-heritage text-3xl md:text-4xl mt-4 leading-tight">
              {t.title}
            </div>
            <div
              className={`mt-3 flex items-center gap-2 text-sm ${
                isYellow ? "text-black/70" : "text-white/60"
              }`}
            >
              <MapPin size={14} />
              {t.place}
            </div>
            <p
              className={`mt-4 text-sm leading-relaxed ${
                isYellow ? "text-black/80" : "text-white/60"
              }`}
            >
              {t.note}
            </p>
          </div>
          );
        })}
      </div>

      <div className="mt-10 flex items-center gap-3 text-white/50 text-sm">
        <Users size={14} className="text-[var(--scc-yellow)]" />
        Sponsor branding travels with the team across every stop on the circuit.
      </div>
    </SectionShell>
  );
}
