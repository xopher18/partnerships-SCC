import React from "react";
import SectionShell from "@/components/SectionShell";
import { charity } from "@/data/deckContent";
import { Heart, GraduationCap, Users, HandHeart } from "lucide-react";

const ICONS = [Heart, Users, GraduationCap];

/* 11 — CHARITY & COMMUNITY */
export function Charity({ presenter }) {
  return (
    <SectionShell
      id="charity"
      eyebrow={charity.eyebrow}
      presenter={presenter}
      className="border-t border-white/5"
    >
      <div className="grid lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-7">
          <h2
            className={
              presenter
                ? "font-heritage text-4xl md:text-5xl lg:text-6xl leading-[1.02] tracking-[-0.02em]"
                : "font-heritage text-4xl md:text-6xl lg:text-7xl leading-[1.02] tracking-[-0.02em]"
            }
          >
            {charity.headline}
            <br />
            <span className="italic text-[var(--scc-yellow)]">{charity.italic}</span>
          </h2>
          <p className="mt-8 max-w-xl text-white/70 text-lg leading-relaxed">
            {charity.intro}
          </p>
        </div>

        <div className="lg:col-span-5">
          <div
            data-testid="charity-headline-stat"
            className="border border-white/10 bg-black/60 p-8"
          >
            <div className="flex items-center gap-2 text-[10px] tracking-[0.28em] uppercase text-[var(--scc-yellow)] font-display">
              <HandHeart size={14} />
              Flagship Commitment
            </div>
            <div className="font-display text-[var(--scc-yellow)] text-[72px] leading-none mt-4 tracking-tight">
              {charity.headlineStat.value}
            </div>
            <div className="mt-3 text-white/70">
              {charity.headlineStat.label}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-14 grid md:grid-cols-3 gap-px bg-white/10 border border-white/10">
        {charity.programmes.map((p, i) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <div
              key={p.title}
              data-testid={`charity-programme-${i}`}
              className="bg-black p-8 tile-hover flex flex-col gap-4 min-h-[240px]"
            >
              <div className="h-10 w-10 border border-[var(--scc-yellow)] text-[var(--scc-yellow)] grid place-items-center">
                <Icon size={16} />
              </div>
              <div>
                <div className="font-display text-[10px] tracking-[0.28em] uppercase text-[var(--scc-yellow)]">
                  {p.duration}
                </div>
                <div className="font-heritage text-2xl mt-2 leading-tight">
                  {p.title}
                </div>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">{p.copy}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid md:grid-cols-12 gap-6 items-center">
        <p className="md:col-span-6 text-white/45 text-sm italic">
          {charity.csrFootnote}
        </p>
        <div className="md:col-span-6 border-l-2 border-[var(--scc-yellow)] pl-5 py-2">
          <div className="text-[10px] tracking-[0.28em] uppercase text-[var(--scc-yellow)] font-display">
            Sponsor Hook · CSR / ESG
          </div>
          <p className="mt-2 text-white/85 text-sm leading-relaxed">
            {charity.sponsorHook}
          </p>
        </div>
      </div>
    </SectionShell>
  );
}
