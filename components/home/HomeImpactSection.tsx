"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { Handshake, Store, Target, Users } from "lucide-react";
import { ParallaxImageBlock } from "@/components/home/ParallaxImageBlock";
import { SectionWave } from "@/components/SectionWave";

const parallaxBlocks: {
  images: string[];
  title: string;
  titleNode: React.ReactNode;
  desc: string;
}[] = [
  {
    images: ["/images/pillar1.webp", "/images/pillar2.webp"],
    title: "Innovation & standards internationaux",
    titleNode: <>Innovation & <span className="text-iba-sky">standards internationaux</span></>,
    desc: "Nous améliorons continuellement nos procédés et notre offre pour proposer des solutions performantes, durables et adaptées aux besoins du marché.",
  },
  {
    images: [
      "/images/2D7A8740-ezgif.com-png-to-webp-converter.webp",
      "/images/2D7A8755-ezgif.com-png-to-webp-converter.webp",
    ],
    title: "Un approvisionnement fiable et continu",
    titleNode: <>Un approvisionnement <span className="text-iba-sky">fiable et continu</span></>,
    desc: "Notre entrepôt moderne et notre gestion rigoureuse des stocks garantissent une disponibilité permanente de nos matériaux de construction. Nous assurons un approvisionnement rapide, des produits stockés dans des conditions optimales et une réponse efficace aux besoins de chacun de vos projets.",
  },
  {
    images: [
      "/images/2D7A8728-ezgif.com-png-to-webp-converter-2.webp",
      "/images/2D7A8731-ezgif.com-png-to-webp-converter.webp",
    ],
    title: "Commerce & valorisation des filières",
    titleNode: <>Commerce & <span className="text-iba-sky">valorisation des filières</span></>,
    desc: "En collaborant avec des fournisseurs et acteurs de référence, nous contribuons au développement d’un secteur de la construction plus performant et durable.",
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
    <section className="relative z-20 w-full overflow-hidden bg-background">
      
      {/* 1. ZONE DARK : STATISTIQUES */}
      <div className="relative bg-iba-navy py-12 text-white md:py-16">
        <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-iba-orange via-transparent to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-[90rem] px-4 sm:px-8 md:px-16 lg:px-20">
          <div className="mb-8 grid grid-cols-1 gap-8 sm:mb-10 md:mb-12 md:grid-cols-3 md:items-end md:gap-x-8 lg:mb-14 lg:gap-x-10">
            <div className="relative min-w-0 md:col-span-2">
              <div
                className="pointer-events-none absolute -left-2 -top-8 -z-10 select-none text-[7rem] font-black leading-none text-white/[0.06] sm:-left-2 sm:-top-12 sm:text-[11rem] md:text-[13rem]"
                aria-hidden
              >
                01
              </div>

              <div className="flex max-w-[min(100%,42rem)] flex-col gap-4 sm:gap-5 md:max-w-none">
                <span className="inline-flex w-fit items-center rounded-full border border-white/25 bg-white/10 px-4 py-2 sm:px-5 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
                  En chiffres
                </span>

                <div className="flex items-start gap-3">
                  <span className="mt-2 h-[2px] w-8 shrink-0 bg-iba-sky" aria-hidden />
                  <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white/70">
                    01 — Notre réseau
                  </p>
                </div>

                <h2 className="text-balance text-3xl font-extrabold uppercase leading-[1.08] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
                  Présence &{" "}
                  <span className="text-iba-sky">
                    performance
                  </span>
                </h2>
              </div>
            </div>
          </div>

          <motion.div
            ref={statsRef}
            variants={containerVariants}
            initial="hidden"
            animate={isStatsInView ? "visible" : "hidden"}
            // CHANGED HERE: grid-cols-2 base class so it's 2 columns on mobile. 
            // Also reduced the gap for mobile so cards fit nicer.
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
          >
            <StatCard icon={<Handshake />} numericValue={5} suffix="" label="Partenaires" />
            <StatCard icon={<Store />} numericValue={70} suffix="+" label="Magasins" />
            <StatCard icon={<Target />} numericValue={25} suffix="+" label="Projets" />
            <StatCard icon={<Users />} numericValue={40} suffix="+" label="Employés" />
          </motion.div>
        </div>

        <SectionWave
          edge="top"
          fillClassName="fill-white"
          heightClassName="h-10 sm:h-12 md:h-16"
          className="z-30"
        />
      </div>

      {/* 2. BLOCS PARALLAXE */}
      <div className="flex w-full flex-col">
        {parallaxBlocks.map((block, i) => (
          <ParallaxImageBlock
            key={block.title}
            images={block.images}
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

/* --- COMPOSANT STAT CARD --- */
function StatCard({ icon, numericValue, suffix, label }: { icon: React.ReactNode, numericValue: number, suffix: string, label: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-10%" });
  
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.floor(latest));

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, numericValue, { 
        duration: 2, 
        ease: [0.16, 1, 0.3, 1] 
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
      style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 1.5rem), calc(100% - 1.5rem) 100%, 0 100%)" }}
      // Adjusted height and padding for mobile 2-column layout so it doesn't cramp
      className="group relative flex h-[150px] sm:h-[200px] md:h-[220px] flex-col justify-between overflow-hidden border-t-2 border-l border-white/10 bg-white/5 p-4 sm:p-6 backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/30"
    >
      {/* Reduced background watermark text size for mobile */}
      <div className="absolute -bottom-4 -right-2 z-0 select-none font-mono text-[4.5rem] sm:text-[8rem] font-black leading-none text-white/10 transition-transform duration-700 group-hover:-translate-y-4 group-hover:scale-110">
        {numericValue}
      </div>

      <div className="absolute left-6 top-0 h-2 w-px bg-white/30" />
      <div className="absolute left-0 top-6 h-px w-2 bg-white/30" />
      
      <div className="relative z-10 flex items-start justify-between">
        <div className="flex h-7 w-7 sm:h-10 sm:w-10 items-center justify-center bg-iba-orange/80 text-white backdrop-blur-sm shadow-md transition-transform duration-300 group-hover:scale-110">
          <div className="[&>svg]:h-3.5 [&>svg]:w-3.5 sm:[&>svg]:h-5 sm:[&>svg]:w-5">{icon}</div>
        </div>
        <div className="mt-3 sm:mt-5 h-px w-8 sm:w-16 bg-gradient-to-r from-iba-sky to-transparent opacity-50" />
      </div>
      
      <div className="relative z-10 mt-auto">
        {/* Shrunk primary number base font for 2 columns */}
        <h3 className="flex items-baseline font-mono text-3xl sm:text-5xl font-black tracking-tighter text-white tabular-nums md:text-6xl">
          <motion.span>{rounded}</motion.span>
          <span className="ml-0.5 sm:ml-1 text-lg sm:text-2xl font-bold text-iba-sky">{suffix}</span>
        </h3>
        
        <div className="mt-1 sm:mt-3 flex items-center gap-1.5 sm:gap-3">
          <span className="h-1 sm:h-1.5 w-1 sm:w-1.5 shrink-0 rounded-full bg-iba-sky shadow-[0_0_8px_rgba(40,37,97,0.8)]" />
          {/* Shrunk label font for 2 columns */}
          <p className="font-sans text-[8px] sm:text-[11px] font-bold uppercase tracking-[0.15em] text-white/80 line-clamp-1">
            {label}
          </p>
        </div>
      </div>

      <div className="absolute inset-0 z-20 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-[1.5s] ease-in-out group-hover:translate-x-full pointer-events-none" />
    </motion.div>
  );
}