"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowDownRight } from "lucide-react";
import { SectionWave } from "@/components/SectionWave";
import { AboutSectionHeader } from "@/components/about/AboutSectionHeader";
import { AboutVisionVideoSection } from "@/components/about/AboutVisionVideoSection";
import { aboutPageData } from "@/lib/about-page-data";
import { cn } from "@/lib/utils";
import { HomeCharterSection } from "./HomeCharacterSection";

const fade = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }, // Custom spring-like easing
};

export function AboutPage() {
  const { mission, vision, focusAreas, charter, pageTitle, pageIntro } = aboutPageData;

  // Duplication des principes pour créer un effet de boucle infinie fluide (Marquee)
  const marqueeItems = [...charter.principles, ...charter.principles, ...charter.principles];

  return (
    <main className="flex min-h-screen flex-col bg-background selection:bg-iba-navy selection:text-white">
      
      {/* 1. INTRO ARCHITECTURALE (Blueprint Grid) */}
      <section
        className="relative scroll-mt-20 bg-background pt-[calc(6rem+1.5rem)] pb-16 sm:pt-[calc(7rem+1.5rem)] md:pb-24 overflow-hidden"
        aria-labelledby="about-page-heading"
      >
        {/* Subtle Architectural Grid */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.03]"
          style={{ 
            backgroundImage: `linear-gradient(var(--iba-sky) 1px, transparent 1px), linear-gradient(90deg, var(--iba-sky) 1px, transparent 1px)`,
            backgroundSize: '40px 40px' 
          }} 
        />
        
        <div className="relative z-10 mx-auto max-w-[90rem] px-5 sm:px-8 md:px-16 lg:px-20">
          <motion.div {...fade} className="max-w-4xl">
            <div className="mb-6 flex items-center gap-4">
              <span className="h-px w-12 bg-iba-orange" />
              <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-iba-navy">
                International Business Alliance
              </p>
            </div>
            <h1
              id="about-page-heading"
              className="mt-3 text-5xl font-black uppercase leading-[0.95] tracking-tighter text-iba-sky sm:text-6xl md:text-8xl"
            >
              {pageTitle}
            </h1>
            <p className="mt-8 max-w-2xl text-lg font-medium leading-relaxed text-iba-sky/70 md:text-xl border-l-2 border-iba-orange pl-6">
              {pageIntro}
            </p>
          </motion.div>
        </div>

      <SectionWave />
      </section>



      {/* 2. MISSION — BANDEAU navy (Structural Layout) */}
      <section className="relative overflow-hidden bg-iba-navy py-20 text-white md:py-28 lg:py-32">
        {/* Decorative ambient glows */}
        <div className="pointer-events-none absolute -right-32 top-0 h-[600px] w-[600px] rounded-full bg-white/[0.04] blur-[100px]" aria-hidden />
        <div className="pointer-events-none absolute -left-32 bottom-0 h-[400px] w-[400px] rounded-full bg-iba-sky/[0.04] blur-[100px]" aria-hidden />

        <div className="relative z-10 mx-auto max-w-[90rem] px-5 sm:px-8 md:px-16 lg:px-20">
          <AboutSectionHeader
            variant="navy"
            waterNumber={mission.waterNumber}
            badge={mission.badge}
            kicker={mission.kicker}
            title={
              <>
                {mission.headline}{" "}
                <span className="text-iba-sky italic">{mission.headlineAccent}</span>
              </>
            }
            lead={mission.intro}
          />

          <motion.div
            {...fade}
            className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-16 lg:items-start"
          >
            {/* Main Narrative */}
            <div className="lg:col-span-8 space-y-6 text-base font-medium leading-relaxed text-white/90 md:text-lg">
              <h3 className="text-2xl font-black uppercase tracking-tight text-white md:text-3xl border-b border-white/10 pb-4">
                {mission.narrativeTitle}
              </h3>
              <p className="text-xl font-light text-white/95">{mission.narrativeLead}</p>
              <p className="text-white/80">{mission.narrativeBody}</p>
            </div>
            
            {/* Structural Aside Box */}
            <aside className="group relative lg:col-span-4 overflow-hidden rounded-sm bg-iba-sky p-8 shadow-2xl lg:sticky lg:top-32 transition-transform hover:-translate-y-1">
              {/* Top heavy steel beam accent */}
              <div className="absolute top-0 left-0 h-1.5 w-full bg-iba-orange transition-all duration-500 group-hover:bg-white" />
              
              <div className="relative z-10">
                <ArrowDownRight className="mb-6 h-8 w-8 text-iba-navy opacity-50" />
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-iba-navy">
                  {mission.international.title}
                </p>
                <p className="mt-4 text-sm font-medium leading-relaxed text-white/85 md:text-base">
                  {mission.international.body}
                </p>
              </div>
            </aside>
          </motion.div>
        </div>

        <SectionWave fillClassName="fill-background" heightClassName="h-16 md:h-24" />
      </section>

      <AboutVisionVideoSection />
      {/* 3. VISION — FOND BLANC (Oversized Typography) */}
      <section className="relative bg-background py-20 md:py-32">
        <div className="mx-auto max-w-[90rem] px-5 sm:px-8 md:px-16 lg:px-20 text-center flex flex-col items-center">
          <span className="mb-6 inline-block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-iba-navy">
            {vision.badge} // {vision.kicker}
          </span>
          <motion.h2 
            {...fade}
            className="text-balance text-4xl font-black uppercase leading-[1.05] tracking-tighter text-iba-sky md:text-6xl lg:text-7xl max-w-5xl"
          >
            {vision.headline}{" "}
            <span className="relative inline-block text-iba-navy">
              {vision.headlineAccent}
              {/* Decorative underline */}
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-iba-navy/30" preserveAspectRatio="none" viewBox="0 0 100 100" fill="none">
                <path d="M0,50 L100,50" stroke="currentColor" strokeWidth="6" />
              </svg>
            </span>
          </motion.h2>
          <motion.p {...fade} transition={{ delay: 0.1 }} className="mt-8 max-w-3xl text-lg font-medium leading-relaxed text-iba-muted md:text-xl">
            {vision.intro}
          </motion.p>
        </div>
        <SectionWave />
      </section>

      {/* 4. AXES — navy (Industrial Pillar Cards) */}
      <section className="relative overflow-x-clip bg-iba-navy py-20 text-white md:py-28 lg:py-32">
        <div className="relative z-10 mx-auto max-w-[90rem] px-5 sm:px-8 md:px-16 lg:px-20">
          <AboutSectionHeader
            variant="navy"
            waterNumber={focusAreas.waterNumber}
            badge={focusAreas.badge}
            kicker={focusAreas.kicker}
            title={
              <>
                {focusAreas.headline}{" "}
                <span className="text-iba-sky">{focusAreas.headlineAccent}</span>
              </>
            }
            lead={focusAreas.intro}
          />

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {focusAreas.cards.map((card, i) => (
              <motion.article
                key={card.id}
                {...fade}
                transition={{ ...fade.transition, delay: i * 0.1 }}
                className="group relative flex min-h-[16rem] flex-col bg-white/5 p-8 transition-all hover:bg-white/10"
              >
                {/* Structural left border */}
                <div className="absolute left-0 top-0 h-full w-1.5 bg-iba-orange transition-all duration-500 group-hover:w-2 group-hover:bg-white" />
                
                {/* Number indicator */}
                <span className="mb-4 font-mono text-4xl font-black text-white/10 transition-colors group-hover:text-white/20">
                  0{i + 1}
                </span>

                <h3 className="text-xl font-black uppercase tracking-tight text-white md:text-2xl">
                  {card.title}
                </h3>
                <p className="mt-4 flex-1 text-sm font-medium leading-relaxed text-white/80 md:text-base">
                  {card.body}
                </p>

                {"ctaHref" in card && card.ctaHref ? (
                  <Link
                    href={card.ctaHref}
                    className="mt-8 inline-flex w-fit items-center border-b border-transparent pb-1 font-mono text-[10px] font-bold uppercase tracking-widest text-iba-sky transition-all hover:border-white hover:text-white"
                  >
                    {"ctaLabel" in card && card.ctaLabel ? card.ctaLabel : "Explorer"}
                    <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                ) : null}
              </motion.article>
            ))}
          </div>
        </div>

        <SectionWave fillClassName="fill-background" heightClassName="h-16 md:h-24" />
      </section>

      {/* 5. CHARTE — BLANC + MARQUEE INFINI */}
      <HomeCharterSection />
    </main>
  );
}