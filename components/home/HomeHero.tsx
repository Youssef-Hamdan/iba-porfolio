"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { SectionWave } from "@/components/SectionWave";

export function HomeHero() {
  const heroRef = useRef(null);
  
  // Parallax Setup
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Light background parallax only — avoid translating hero text on scroll (fights document
  // scrolling and reads as "wobble" at the handoff to the next section).
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  // Framer Motion Variants for smooth cascading entry
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Délai entre l'apparition de chaque élément
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] as const },
    },
  };

  return (
    <section
      ref={heroRef}
      className="relative flex min-h-[100vh] items-center justify-start overflow-hidden bg-iba-navy text-white"
    >
      {/* 1. ANIMATED PARALLAX BACKGROUND */}
      <motion.div
        className="absolute inset-0 z-0 h-[115%] w-full will-change-transform"
        style={{ y: backgroundY }}
      >
        <Image
          src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=2070&auto=format&fit=crop"
          alt="International Business Alliance"
          fill
          priority
        />

      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-tr from-iba-navy/70 to-transparent mix-blend-multiply" />
      {/* 2. MAIN CONTENT WITH STAGGERED FADE-IN */}
      <motion.div
        style={{ opacity: contentOpacity }}
        className="relative z-10 mx-auto w-full max-w-[90rem] px-5 pt-24 text-left will-change-[opacity] sm:px-8 md:px-16 lg:px-20 lg:pt-28"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-start"
        >
          {/* Typography */}
          <motion.h1 
            variants={itemVariants}
            className="mb-6 text-4xl font-extrabold leading-tight tracking-tighter drop-shadow-md md:text-6xl lg:text-7xl"
          >
            <span className="text-iba-sky">La Force </span><br className=" hidden md:block" />
            <span className="text-white italic pr-2">
              qui bâtit
            </span>{" "}
            <span className="text-iba-sky">l&apos;avenir.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            variants={itemVariants}
            className="mb-10 max-w-2xl text-lg leading-relaxed text-gray-200 md:text-xl"
          >
            Nous connectons les gouvernements, les industries et les capitaux pour bâtir une économie mondiale
            résiliente, transparente et durable.
          </motion.p>

          {/* Action Buttons */}
          <motion.div variants={itemVariants} className="flex w-full flex-col flex-wrap gap-5 sm:w-auto sm:flex-row sm:justify-start">
            <Link
              href="/about"
              className="group relative overflow-hidden rounded-full bg-iba-blue px-8 py-4 font-semibold text-white shadow-[0_0_30px_rgba(0,102,204,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_50px_rgba(0,102,204,0.6)]"
            >
              <span className="relative z-10">Notre Vision</span>
              {/* Effet de brillance au survol */}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full" />
            </Link>
            <Link
              href="/products"
              className="rounded-full border border-white/30 bg-white/5 px-8 py-4 font-semibold text-white backdrop-blur-md transition-all hover:bg-white/15 hover:border-white/50"
            >
              Découvrir les Produits
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      <SectionWave />
    </section>
  );
}