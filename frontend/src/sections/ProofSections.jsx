import React from "react";
import SectionShell from "@/components/SectionShell";
import {
  ecosystem,
  pathway,
  audienceGroups,
  audienceDemographics,
  broaderScc,
  alignmentPillars,
  heroImages,
} from "@/data/deckContent";
import {
  Users,
  Trophy,
  UserPlus,
  Heart,
  Baby,
  Home as HomeIcon,
  ArrowRight,
} from "lucide-react";

const ECO_ICONS = [Baby, Trophy, Users, UserPlus, HomeIcon, Heart];

/* 05 - ECOSYSTEM */
export function Ecosystem({ presenter }) {
  return (
    <SectionShell
      id="ecosystem"

      eyebrow="Our Football Ecosystem"
      presenter={presenter}
    >
      <div className="grid lg:grid-cols-12 gap-10 items-end mb-14">
        <h2 className="lg:col-span-8 font-heritage text-4xl md:text-6xl leading-[1.02] tracking-[-0.02em]">
          More than a team. A footballing community.
        </h2>
        <p className="lg:col-span-4 text-white/60 leading-relaxed">
          SCC Football operates a full ecosystem - from academy grassroots through to
          senior competition, women&rsquo;s football and lifelong social football.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 border border-white/10">
        {ecosystem.map((e, i) => {
          const Icon = ECO_ICONS[i % ECO_ICONS.length];
          return (
            <div
              key={e.title}
              data-testid={`ecosystem-${i}`}
              className="bg-black p-8 tile-hover flex flex-col gap-4 min-h-[220px]"
            >
              <div className="h-10 w-10 border border-[var(--scc-yellow)] text-[var(--scc-yellow)] grid place-items-center">
                <Icon size={18} />
              </div>
              <div className="font-heritage text-2xl">{e.title}</div>
              <p className="text-white/60 text-sm leading-relaxed">{e.copy}</p>
            </div>
          );
        })}
      </div>

      {/* Ladies at National Stadium - portrait photo + adjacent caption so the
          full image is visible (the source is a 3:4 vertical) */}
      <div className="mt-14 grid lg:grid-cols-12 gap-8 items-stretch">
        <div
          data-testid="ecosystem-ladies-photo"
          className="lg:col-span-5 relative overflow-hidden border border-white/10 bg-black"
        >
          <img
            src={heroImages.ladies}
            alt="SCC Ladies at Singapore National Stadium"
            className="w-full h-auto block"
          />
        </div>
        <div className="lg:col-span-7 border border-white/10 bg-black p-8 md:p-10 flex flex-col justify-between">
          <div>
            <div className="font-display text-[10px] tracking-[0.28em] uppercase text-[var(--scc-yellow)]">
              Ladies Team · At the National Stadium
            </div>
            <div className="font-heritage text-3xl md:text-5xl text-white mt-4 leading-[1.05] tracking-[-0.01em]">
              Inclusion, excellence,{" "}
              <span className="italic text-[var(--scc-yellow)]">
                national-stage football.
              </span>
            </div>
            <p className="mt-6 text-white/60 leading-relaxed max-w-md">
              SCC Football fields a full women&rsquo;s team that plays at
              Singapore&rsquo;s National Stadium - the same turf as the
              Singapore national side. Sponsoring SCC means sponsoring the
              growth of women&rsquo;s football in Singapore.
            </p>
          </div>
          <div className="mt-8 flex items-center gap-4 border-t border-white/10 pt-6">
            <div className="h-10 w-10 border border-[var(--scc-yellow)] text-[var(--scc-yellow)] grid place-items-center">
              <Heart size={16} />
            </div>
            <div className="font-display uppercase tracking-[0.24em] text-[11px] text-white/70">
              Women&rsquo;s &amp; Girls&rsquo; Pathway
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

/* 08 - PATHWAY */
export function Pathway({ presenter }) {
  return (
    <SectionShell
      id="pathway"

      eyebrow="Youth to Senior · The Pathway"
      presenter={presenter}
      className="border-t border-white/5"
    >
      <div className="grid lg:grid-cols-12 gap-10 items-end">
        <h2 className="lg:col-span-7 font-heritage text-4xl md:text-6xl leading-[1.02] tracking-[-0.02em]">
          One club. One journey.
          <br />
          <span className="italic text-[var(--scc-yellow)]">A lifetime of belonging.</span>
        </h2>
        <p className="lg:col-span-5 text-white/60 leading-relaxed">
          Few clubs in Singapore can offer a complete pathway from a first coaching session
          to lifelong senior football - under the same crest. That&rsquo;s the SCC advantage.
        </p>
      </div>

      <div className="mt-16 relative">
        {/* Connecting line */}
        <div className="hidden md:block absolute left-0 right-0 top-8 h-px bg-white/10">
          <div className="h-px bg-[var(--scc-yellow)]" style={{ width: "100%" }} />
        </div>

        <ol className="grid md:grid-cols-4 gap-8 md:gap-6 relative">
          {pathway.map((p, i) => (
            <li
              key={p.title}
              data-testid={`pathway-step-${i}`}
              className="relative"
            >
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 rounded-full bg-[var(--scc-yellow)] ring-4 ring-black relative z-10" />
                <span className="font-display text-[11px] tracking-[0.28em] uppercase text-[var(--scc-yellow)]">
                  Step {i + 1}
                </span>
              </div>
              <div className="mt-6 pl-1">
                <div className="font-display text-[11px] tracking-[0.22em] uppercase text-white/40">
                  {p.stage}
                </div>
                <div className="font-heritage text-2xl mt-1">{p.title}</div>
                <p className="mt-3 text-white/60 text-sm leading-relaxed">{p.copy}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </SectionShell>
  );
}

/* 09 - AUDIENCE */
export function Audience({ presenter }) {
  return (
    <SectionShell
      id="audience"
      eyebrow="Audience & Reach"
      presenter={presenter}
    >
      <div className="grid lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-5">
          <h2 className="font-heritage text-4xl md:text-6xl leading-[1.02] tracking-[-0.02em]">
            The people <br />
            <span className="italic text-[var(--scc-yellow)]">your brand meets.</span>
          </h2>
          <p className="mt-8 text-white/60 leading-relaxed max-w-lg">
            SCC Football is a network of engaged players, families and members - and it
            sits inside one of Singapore&rsquo;s most respected clubs.
          </p>
          <div className="mt-6 p-5 border-l-2 border-[var(--scc-yellow)] bg-white/[0.02]">
            <div className="text-[10px] tracking-[0.28em] uppercase text-[var(--scc-yellow)] font-display">
              Beyond Football
            </div>
            <p className="mt-2 text-white/75 text-sm leading-relaxed">{broaderScc}</p>
          </div>
        </div>

        <ul className="lg:col-span-4 divide-y divide-white/10 border-y border-white/10">
          {audienceGroups.map((a, i) => (
            <li
              key={a.label}
              data-testid={`audience-${i}`}
              className="flex items-center justify-between py-4 group cursor-default"
            >
              <div>
                <div className="font-display text-base md:text-lg">{a.label}</div>
                <div className="text-white/50 text-xs md:text-sm">{a.note}</div>
              </div>
              <ArrowRight
                size={14}
                className="text-white/30 group-hover:text-[var(--scc-yellow)] group-hover:translate-x-1 transition-all"
              />
            </li>
          ))}
        </ul>

        <div className="lg:col-span-3">
          <div className="text-[10px] tracking-[0.28em] uppercase text-[var(--scc-yellow)] font-display mb-4">
            Member Demographics
          </div>
          <ul className="flex flex-col gap-2">
            {audienceDemographics.map((d, i) => (
              <li
                key={d}
                data-testid={`demographic-${i}`}
                className="text-white/75 text-sm border-b border-white/10 pb-2"
              >
                {d}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SectionShell>
  );
}

/* 10 - ALIGNMENT */
export function Alignment({ presenter }) {
  return (
    <SectionShell
      id="alignment"
      eyebrow="What Sponsors Align With"
      presenter={presenter}
      className="border-t border-white/5"
    >
      <div className="grid lg:grid-cols-12 gap-10 items-end mb-14">
        <h2 className="lg:col-span-8 font-heritage text-4xl md:text-6xl leading-[1.02] tracking-[-0.02em]">
          A brand association with substance.
        </h2>
        <p className="lg:col-span-4 text-white/60 leading-relaxed">
          Partners align with values that matter to their customers - youth, community,
          heritage and performance - all lived weekly at SCC Football.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10">
        {alignmentPillars.map((p, i) => (
          <div
            key={p.title}
            data-testid={`alignment-${i}`}
            className="bg-black p-6 tile-hover min-h-[170px] flex flex-col justify-between"
          >
            <div className="font-display font-semibold text-[var(--scc-yellow)] text-2xl">
              {String(i + 1).padStart(2, "0")}
            </div>
            <div>
              <div className="font-heritage text-xl mt-4">{p.title}</div>
              <p className="text-white/60 text-sm mt-2 leading-relaxed">{p.copy}</p>
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
