"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { ArrowRight, BarChart3, Globe2, Target, Briefcase } from "lucide-react";
import { ParallaxImageBlock } from "@/components/home/ParallaxImageBlock";
import { SectionWave } from "@/components/SectionWave";

const parallaxBlocks = [
  {
    src: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2071&auto=format&fit=crop",
    title: "Infrastructure & grands ouvrages",
    titleNode: <>Infrastructure & <span className="text-iba-sky">grands ouvrages</span></>,
    desc: "Maîtrise technique et déploiement de solutions adaptées aux projets urbains et industriels à forte exigence.",
  },
  {
    src: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop",
    title: "Commerce & valorisation des filières",
    titleNode: <>Commerce & <span className="text-iba-sky">valorisation des filières</span></>,
    desc: "Structuration des chaînes de valeur et des partenariats pour soutenir une croissance économique durable.",
  },
  {
    src: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?q=80&w=2072&auto=format&fit=crop",
    title: "Innovation & standards internationaux",
    titleNode: <>Innovation & <span className="text-iba-sky">standards internationaux</span></>,
    desc: "Alignement sur les meilleures pratiques et intégration continue de solutions performantes et traçables.",
  },
];

export function HomeImpactSection() {
  const statsRef = useRef(null);
  const isStatsInView = useInView(statsRef, { once: false, margin: "-10%" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  return (
    <section className="relative z-20 w-full bg-background overflow-hidden">
      
      {/* 1. ZONE DARK : STATISTIQUES */}
      <div className="relative bg-iba-navy py-12 text-white md:py-16">
        <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-iba-orange via-transparent to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-[90rem] px-5 sm:px-8 md:px-16 lg:px-20">
          {/*
            Rule of thirds: primary copy occupies the left 2/3; secondary action sits on the right 1/3,
            aligned to the lower intersection so the band reads as headline (upper weight) + metrics below.
          */}
          <div className="mb-10 grid grid-cols-1 gap-8 md:mb-12 md:grid-cols-3 md:items-end md:gap-x-8 lg:mb-14 lg:gap-x-10">
            <div className="relative min-w-0 md:col-span-2">
              <div
                className="pointer-events-none absolute -left-4 -top-12 -z-10 select-none text-[9rem] font-black leading-none text-white/[0.06] sm:-left-2 sm:text-[11rem] md:text-[13rem]"
                aria-hidden
              >
                01
              </div>

              <div className="flex max-w-[min(100%,42rem)] flex-col gap-5 md:max-w-none">
                <span className="inline-flex w-fit items-center rounded-full border border-white/25 bg-white/10 px-5 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
                  Indicateurs clés
                </span>

                <div className="flex items-start gap-3">
                  <span className="mt-2 h-[2px] w-8 shrink-0 bg-iba-sky" aria-hidden />
                  <p className="text-xs font-bold uppercase tracking-widest text-white/70">
                    01 — IMPACT GLOBAL
                  </p>
                </div>

                <h2 className="text-balance text-4xl font-extrabold uppercase leading-[1.08] tracking-tight text-white md:text-5xl lg:text-6xl">
                  Mesurer le{" "}
                  <span className="text-iba-sky">
                    changement
                  </span>
                </h2>
              </div>
            </div>

            <div className="flex shrink-0 md:col-span-1 md:justify-end md:pb-1">
              <Link
                href="/governance"
                className="group inline-flex items-center text-xs font-bold uppercase tracking-widest text-iba-sky transition-colors hover:text-white"
              >
                Nos rapports
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          <motion.div
            ref={statsRef}
            variants={containerVariants}
            initial="hidden"
            animate={isStatsInView ? "visible" : "hidden"}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
          >
            <StatCard icon={<BarChart3 />} numericValue={500} suffix=" M" label="Millions $ investis" />
            <StatCard icon={<Globe2 />} numericValue={12} suffix="+" label="Pays partenaires" />
            <StatCard icon={<Target />} numericValue={50} suffix="+" label="Projets livrés" />
            <StatCard icon={<Briefcase />} numericValue={2000} suffix="+" label="Emplois créés" />
          </motion.div>
        </div>

        <SectionWave
          edge="top"
          fillClassName="fill-white"
          heightClassName="h-12 md:h-16"
          className="z-30"
        />
      </div>

      {/* 2. BLOCS PARALLAXE */}
      <div className="flex w-full flex-col">
        {parallaxBlocks.map((block, i) => (
          <ParallaxImageBlock
            key={block.title}
            src={block.src}
            title={block.title}
            titleNode={block.titleNode}
            desc={block.desc}
            index={i + 1}
            total={parallaxBlocks.length}
          />
        ))}
      </div>
    </section>
  );
}

/* --- COMPOSANT STAT CARD (CREATIVE MODERN READOUT) --- */
function StatCard({ icon, numericValue, suffix, label }: { icon: React.ReactNode, numericValue: number, suffix: string, label: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-10%" });
  
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.floor(latest));

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, numericValue, { 
        duration: 2, 
        ease: [0.16, 1, 0.3, 1] // Custom ease-out for a more mechanical "gauge" feel
      });
      return controls.stop;
    } else {
      count.set(0); 
    }
  }, [isInView, numericValue, count]);

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: "easeOut" as const } },
  };

  return (
    <motion.div 
      ref={ref}
      variants={itemVariants}
      // Industrial clipped corner effect
      style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 1.5rem), calc(100% - 1.5rem) 100%, 0 100%)" }}
      className="group relative flex h-[220px] flex-col justify-between overflow-hidden border-t-2 border-l border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/30"
    >
      {/* Dynamic Background Watermark Number */}
      <div className="absolute -bottom-6 -right-2 z-0 select-none font-mono text-[8rem] font-black leading-none text-white/10 transition-transform duration-700 group-hover:-translate-y-4 group-hover:scale-110">
        {numericValue}
      </div>

      {/* Blueprint Measuring Lines / Crosshairs */}
      <div className="absolute left-6 top-0 h-2 w-px bg-white/30" />
      <div className="absolute left-0 top-6 h-px w-2 bg-white/30" />
      
      {/* Icon & Accent Header */}
      <div className="relative z-10 flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center bg-iba-orange/80 text-white backdrop-blur-sm shadow-md transition-transform duration-300 group-hover:scale-110">
          <div className="[&>svg]:h-5 [&>svg]:w-5">{icon}</div>
        </div>
        <div className="mt-5 h-px w-16 bg-gradient-to-r from-iba-sky to-transparent opacity-50" />
      </div>
      
      {/* Main Digital Readout */}
      <div className="relative z-10 mt-auto">
        <h3 className="flex items-baseline font-mono text-5xl font-black tracking-tighter text-white tabular-nums md:text-6xl">
          <motion.span>{rounded}</motion.span>
          <span className="ml-1 text-2xl font-bold text-iba-sky">{suffix}</span>
        </h3>
        
        {/* Label with structural connection line */}
        <div className="mt-3 flex items-center gap-3">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-iba-sky shadow-[0_0_8px_rgba(40,37,97,0.8)]" />
          <p className="font-sans text-[11px] font-bold uppercase tracking-[0.15em] text-white/80">
            {label}
          </p>
        </div>
      </div>

      {/* Subtle Hover Sweep Effect */}
      <div className="absolute inset-0 z-20 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-[1.5s] ease-in-out group-hover:translate-x-full" pointer-events-none="true" />
    </motion.div>
  );
}