"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { 
  ArrowRight, 
  Cuboid, 
  PaintRoller, 
  Layers, 
  Anvil, 
  Pickaxe 
} from "lucide-react";
import { SectionWave } from "@/components/SectionWave";
import { cn } from "@/lib/utils";

// Suppression de la propriété "span" pour que toutes les cartes aient la même taille
const collections = [
  { 
    title: "Ciment", 
    desc: "Liens hydrauliques et ciments en sac — uniquement.",
    icon: Cuboid,
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop"
  },
  { 
    title: "Mortier", 
    desc: "Mortiers-colle, coulis, latex et mortiers techniques Sika.",
    icon: Pickaxe,
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format&fit=crop"
  },
  { 
    title: "Plâtre", 
    desc: "Plaques de plâtre, plâtre en poudre et fillasse.",
    icon: Layers,
    image: "https://images.unsplash.com/photo-1620288627223-53302f4e8c74?q=80&w=800&auto=format&fit=crop"
  },
  { 
    title: "Acier", 
    desc: "Tôles, profilés IBR et tubes acier pour structures robustes.",
    icon: Anvil,
    image: "https://images.unsplash.com/photo-1530230588828-9173d1f568b2?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Peintures",
    desc: "Peintures et mastiques pour finitions durables.",
    icon: PaintRoller,
    image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?q=80&w=800&auto=format&fit=crop"
  },
];

export function HomeCatalogSection() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-50px" });

  const ctaRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ctaRef,
    offset: ["start end", "end start"]
  });
  const ctaBgY = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease: [0.2, 0.65, 0.3, 0.9] as const } },
  };

  return (
    <section
      id="catalog"
      className="scroll-mt-20 relative z-20 w-full overflow-x-clip bg-iba-sky py-20 text-white md:py-28 lg:py-32"
    >
      <div className="relative z-10 mx-auto max-w-[90rem] px-5 sm:px-8 md:px-16 lg:px-20">
        <div className="relative mb-10 border-b border-white/15 pb-10 md:mb-12">
          <div className="relative max-w-3xl">
            <div className="absolute -left-4 -top-12 -z-10 select-none text-[9rem] font-black leading-none text-white/[0.06] sm:text-[11rem] md:text-[13rem]">
              04
            </div>

            <div className="flex flex-col gap-5">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <span className="inline-flex w-fit items-center rounded-full border border-white/25 bg-white/10 px-5 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
                  Notre catalogue
                </span>
              </motion.div>

              <div className="flex items-start gap-3">
                <span className="mt-2 h-[2px] w-8 shrink-0 bg-iba-navy" aria-hidden />
                <p className="text-xs font-bold uppercase tracking-widest text-white/70">
                  04 — Réseau et catalogue
                </p>
              </div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl font-extrabold uppercase leading-[1.08] tracking-tight text-white md:text-5xl lg:text-6xl"
              >
                Matière <br className="hidden sm:block" />
                <span className="text-iba-navy">Première.</span>
              </motion.h2>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-[90rem] px-5 sm:px-8 md:px-16 lg:px-20">
        {/* Grille Uniforme et Plus Petite */}
        {/* On force des colonnes de tailles égales (3 sur PC, 2 sur tablette, 1 sur mobile) */}
        <motion.div 
          ref={containerRef}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-6 md:gap-4"
        >
          {collections.map((item, index) => {
            const Icon = item.icon;
            const isLast = index === collections.length - 1;
            return (
              <motion.div 
                key={item.title} 
                variants={itemVariants}
                className={cn(
                  "group relative min-h-[220px] overflow-hidden rounded-2xl bg-white ring-1 ring-iba-navy/10 shadow-lg shadow-iba-navy/5",
                  index < 3 && "md:col-span-2",
                  index >= 3 && "md:col-span-3",
                  isLast && "sm:col-span-2",
                )}
              >
                {/* Image de fond */}
                <Image 
                  src={item.image} 
                  alt={item.title} 
                  fill 
                  className="object-cover opacity-35 transition-all duration-[2s] ease-out group-hover:scale-110 group-hover:opacity-50"
                />
                
                {/* Overlay dégradé */}
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-iba-sky/20 opacity-95 transition-opacity duration-700 group-hover:opacity-90" />

                {/* Grande icône en filigrane (Rétrécie) */}
                <div className="absolute -top-4 -right-4 p-4 opacity-[0.08] transition-all duration-700 group-hover:opacity-[0.14] group-hover:-rotate-12 group-hover:scale-110">
                  <Icon className="w-24 h-24 text-iba-navy" />
                </div>
                
                {/* Contenu de la carte (Paddings p-5) */}
                <div className="relative z-10 flex h-full flex-col justify-between p-5">
                  <div>
                    {/* Icône principale (Rétrécie) */}
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-iba-sky/30 bg-iba-sky/15 text-iba-navy backdrop-blur-md transition-all duration-500 group-hover:bg-iba-navy group-hover:text-white group-hover:scale-110 group-hover:border-iba-navy group-hover:shadow-[0_0_15px_rgba(40,37,97,0.25)]">
                      <Icon className="w-5 h-5" />
                    </div>
                    {/* Titre et description (Rétrécis) */}
                    <h3 className="mb-1.5 text-xl font-bold tracking-tight text-iba-navy">
                      {item.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-iba-navy/65 line-clamp-2">
                      {item.desc}
                    </p>
                  </div>
                  
                  <div className="mt-4 flex items-center">
                    <Link 
                      href="/products" 
                      className="group/link inline-flex items-center text-[10px] font-bold uppercase tracking-widest text-iba-navy transition-colors hover:text-iba-sky"
                    >
                      Explorer
                      <span className="ml-2 flex h-6 w-6 items-center justify-center rounded-full bg-iba-sky/25 backdrop-blur-sm transition-all duration-300 group-hover/link:bg-iba-navy group-hover/link:text-white group-hover/link:translate-x-1">
                        <ArrowRight className="h-3 w-3" />
                      </span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bannière CTA Immersive - Tailles encore réduites */}
        <motion.div 
          ref={ctaRef}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mt-8 md:mt-10 relative overflow-hidden rounded-2xl p-6 md:p-10 text-center shadow-lg"
        >
          <motion.div className="absolute inset-0 w-full h-[140%] -top-[20%] z-0" style={{ y: ctaBgY }}>
            <Image 
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" 
              alt="Projets emblématiques"
              fill
              className="object-cover"
            />
          </motion.div>
          
              <div className="absolute inset-0 bg-iba-navy/75 backdrop-blur-[2px] z-10" />
          
          <div className="relative z-20 mx-auto max-w-xl flex flex-col items-center">
            <span className="mb-2 inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[9px] font-semibold uppercase tracking-widest text-white backdrop-blur-md">
              Nos Réalisations
            </span>
            <h3 className="mb-3 text-2xl font-bold tracking-tight text-white md:text-3xl">
              L&apos;ambition architecturale.
            </h3>
            <p className="text-xs md:text-sm text-white/80 leading-relaxed mb-6 font-light">
              Une sélection de projets illustrant notre maîtrise technique et notre impact concret sur les infrastructures.
            </p>
            <Link
              href="/projects"
              className="group relative overflow-hidden inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-xs font-bold text-iba-navy transition-all duration-500 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              <span className="relative z-10 flex items-center">
                Voir les projets
                <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full" />
            </Link>
          </div>
        </motion.div>
      </div>

      <SectionWave fillClassName="fill-background" heightClassName="h-8 sm:h-10 md:h-12" />
    </section>
  );
}