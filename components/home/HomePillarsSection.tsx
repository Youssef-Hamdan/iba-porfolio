"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Handshake,
  Lightbulb,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { SectionWave } from "@/components/SectionWave";
import { SectionHalfCircle } from "@/components/SectionHalfCircle";
import { cn } from "@/lib/utils";

type Pillar = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  icon: LucideIcon;
};

const PILLARS: Pillar[] = [
  {
    id: "partnerships",
    title: "Partenariats stratégiques",
    description:
      "Nous tissons des alliances durables avec des institutions financières, des bailleurs et des acteurs industriels pour sécuriser les chaînes d’approvisionnement, mutualiser l’expertise et accélérer des projets d’envergure au service du développement national et régional.",
    icon: Handshake,
    imageUrl:
      "https://images.unsplash.com/photo-1709949908058-a08659bfa922?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "growth",
    title: "Croissance économique",
    description:
      "Nos initiatives visent à renforcer les filières locales, à créer de l’emploi qualifié et à soutenir une croissance mesurable et équilibrée sur les territoires où nous investissons, en reliant production, distribution et besoins du marché.",
    icon: TrendingUp,
    imageUrl:
      "https://images.unsplash.com/photo-1548192746-dd526f154ed9?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "infrastructure",
    title: "Infrastructure",
    description:
      "Nous contribuons à des infrastructures résilientes — du gros œuvre aux équipements urbains — en respectant les normes techniques, les délais convenus et les exigences de qualité et de sécurité propres aux grands chantiers.",
    icon: Building2,
    imageUrl:
      "https://images.unsplash.com/photo-1693581176773-a5f2362209e6?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "innovation",
    title: "Innovation",
    description:
      "Nous intégrons des solutions matériaux, des procédés et des modèles de gouvernance qui améliorent la performance, la traçabilité et la durabilité des ouvrages, tout en restant alignés sur les standards internationaux du secteur.",
    icon: Lightbulb,
    imageUrl:
      "https://images.unsplash.com/photo-1581092918056-0c4c3ac33e2c?q=80&w=1200&auto=format&fit=crop",
  },
];

export function HomePillarsSection() {
  const [activeId, setActiveId] = useState(PILLARS[0].id);
  const active = PILLARS.find((p) => p.id === activeId) ?? PILLARS[0];
  const activeIndex = PILLARS.findIndex((p) => p.id === activeId);
  const ActiveIcon = active.icon;

  return (
    <section
      id="pillars"
      className="scroll-mt-20 relative w-full overflow-x-clip bg-iba-navy text-white py-20 md:py-28 lg:py-32"
      aria-labelledby="pillars-heading"
    >
      <SectionHalfCircle edge="top" fillClassName="fill-iba-navy" />

      <div
        className="pointer-events-none absolute -right-24 top-1/4 h-[520px] w-[520px] rounded-full bg-white/[0.06] blur-[100px]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-[90rem] px-5 sm:px-8 md:px-16 lg:px-20">
        <div className="relative mb-14 md:mb-20 lg:mb-24">
          <div className="absolute -left-4 -top-12 -z-10 select-none text-[9rem] font-black leading-none text-white/[0.06] sm:text-[11rem] md:text-[13rem]">
            02
          </div>
          <div className="flex max-w-3xl flex-col gap-5">
            <span className="inline-flex w-fit items-center rounded-full border border-white/25 bg-white/10 px-5 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
              Nos piliers
            </span>
            <div className="flex items-start gap-3">
              <span className="mt-2 h-[2px] w-8 shrink-0 bg-iba-sky" aria-hidden />
              <p className="text-xs font-bold uppercase tracking-widest text-white/70">
                02 — Axes stratégiques
              </p>
            </div>
            <h2
              id="pillars-heading"
              className="text-4xl font-extrabold uppercase leading-[1.08] tracking-tight text-white md:text-5xl lg:text-6xl"
            >
              Ce qui structure{" "}
              <span className="text-iba-sky">
                notre action
              </span>
            </h2>
            <p className="max-w-xl text-lg font-medium leading-relaxed text-white/80">
              Quatre leviers complémentaires pour transformer les ambitions en projets
              concrets, avec rigueur et vision long terme.
            </p>
          </div>
        </div>

        <div className="grid items-start gap-10 max-lg:grid-flow-dense lg:grid-cols-12 lg:gap-14">
          {/* Rail + tabs */}
          <div className="relative max-lg:order-2 lg:col-span-5">
            {/* <div
              className="pointer-events-none absolute left-[19px] top-3 bottom-3 hidden w-px bg-gradient-to-b from-iba-sky/0 via-iba-sky/15 to-iba-sky/0 md:block"
              aria-hidden
            /> */}
            <div
              className="flex flex-col gap-2"
              role="tablist"
              aria-label="Piliers stratégiques"
            >
              {PILLARS.map((pillar, index) => {
                const isActive = pillar.id === activeId;
                const Icon = pillar.icon;
                return (
                  <button
                    key={pillar.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    id={`pillar-tab-${pillar.id}`}
                    aria-controls={`pillar-panel-${pillar.id}`}
                    onClick={() => setActiveId(pillar.id)}
                    className={cn(
                      "group relative flex w-full gap-4 rounded-[1.75rem] border p-4 text-left transition-all duration-300 md:pl-8 md:pr-5 md:py-5",
                      isActive
                        ? "border-white bg-white shadow-lg shadow-iba-sky/10 ring-1 ring-white/50"
                        : "border-white/20 bg-white/[0.05] hover:border-white/30 hover:bg-white/10",
                    )}
                  >
                    <span
                      className={cn(
                        "relative z-10 mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-white transition-transform duration-300 md:absolute md:left-0 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:mt-0",
                        isActive
                          ? "bg-iba-sky shadow-md shadow-iba-sky/25"
                          : "bg-white/15 group-hover:scale-105 group-hover:bg-white/25",
                      )}
                      aria-hidden
                    >
                      <Icon className="h-5 w-5" strokeWidth={2} />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline justify-between gap-3">
                        <span
                          className={cn(
                            "text-[10px] font-bold uppercase tracking-[0.18em] tabular-nums",
                            isActive ? "text-iba-navy" : "text-white/50",
                          )}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </span>
                      <span
                        className={cn(
                          "mt-1 block text-base font-bold uppercase tracking-tight md:text-lg",
                          isActive ? "text-iba-sky" : "text-white/80",
                        )}
                      >
                        {pillar.title}
                      </span>
                    </span>

                    <ArrowRight
                      className={cn(
                        "mt-1 h-5 w-5 shrink-0 transition-all duration-300",
                        isActive
                          ? "translate-x-0 text-iba-sky opacity-100"
                          : "-translate-x-1 text-white/30 opacity-0 group-hover:translate-x-0 group-hover:opacity-100",
                      )}
                      aria-hidden
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Image stage */}
          <div className="relative max-lg:order-1 lg:col-span-7">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2.25rem] shadow-2xl shadow-iba-sky/15 ring-1 ring-iba-sky/10 md:aspect-[16/11] lg:rounded-[2.5rem]">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={active.imageUrl}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
                  className="absolute inset-0"
                >
                  <Image
                    src={active.imageUrl}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    priority={activeIndex === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-iba-sky/95 via-iba-sky/55 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-iba-orange/25 to-transparent mix-blend-multiply" />
                </motion.div>
              </AnimatePresence>

              <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col justify-end p-6 pb-8 md:p-10 md:pb-12">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active.id}
                    role="tabpanel"
                    id={`pillar-panel-${active.id}`}
                    aria-labelledby={`pillar-tab-${active.id}`}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
                    className="pointer-events-auto flex w-full flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-8"
                  >
                    <div className="max-w-full sm:max-w-[min(100%,42rem)]">
                      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/75">
                        Pilier {activeIndex + 1} / {PILLARS.length}
                      </p>
                      <p className="mt-1 text-2xl font-extrabold uppercase leading-tight tracking-tight text-white md:text-3xl lg:text-4xl">
                        {active.title}
                      </p>
                      <p className="mt-3 text-sm font-medium leading-relaxed text-white/90 md:text-base lg:max-w-xl">
                        {active.description}
                      </p>
                    </div>
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-white/25 backdrop-blur-md sm:mb-1 md:h-14 md:w-14">
                      <ActiveIcon className="h-6 w-6 md:h-7 md:w-7" strokeWidth={2} />
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Floating accent */}
            <div className="absolute -left-4 top-8 z-20 hidden md:flex md:-left-6">
              <div className="flex items-center gap-2 rounded-full bg-white/95 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-iba-sky shadow-xl ring-1 ring-iba-sky/5 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-iba-orange" />
                Vision intégrée
              </div>
            </div>
          </div>
        </div>
      </div>

      <SectionWave heightClassName="h-12 sm:h-16 md:h-20" />
    </section>
  );
}
