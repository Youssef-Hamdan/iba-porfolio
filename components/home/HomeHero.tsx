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
      // using only 100dvh natively fixes the iOS Safari jumping bug
      className="relative flex min-h-[100dvh] w-full items-center justify-start overflow-hidden bg-iba-sky text-white"
    >
      {/* 1. ANIMATED PARALLAX BACKGROUND */}
      <motion.div
        className="absolute inset-0 z-0 h-[115%] w-full will-change-transform"
        style={{ y: backgroundY }}
      >
        <Image
          src="/images/hero.webp"
          alt="International Business Alliance"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      <div className="absolute inset-0 z-[1] bg-gradient-to-tr from-iba-navy via-iba-navy/30 to-transparent mix-blend-multiply" />    
      
      {/* 2. MAIN CONTENT WITH STAGGERED FADE-IN */}
      <motion.div
        style={{ opacity: contentOpacity }}
        // Adjusted top padding for mobile to ensure it doesn't get pushed too far down on small screens like iPhone SE
        className="relative z-10 mx-auto w-full max-w-[90rem] px-5 pt-16 text-left will-change-[opacity] sm:px-8 sm:pt-24 md:px-16 lg:px-20 lg:pt-28"
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
            // Shrunk mobile font slightly and tightened leading to prevent awkward text wrapping
            className="mb-5 text-[2.5rem] font-extrabold leading-[1.05] tracking-tighter drop-shadow-md sm:mb-6 sm:text-5xl md:text-6xl lg:text-7xl"
          >
            <span className="text-iba-sky">La Force </span><br className="hidden sm:block" />
            <span className="text-white">
              qui bâtit
            </span>{" "}
            <span className="text-iba-sky">l&apos;avenir.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            variants={itemVariants}
            // Adjusted mobile text size and margin
            className="mb-8 max-w-2xl text-base leading-relaxed text-gray-200 sm:mb-10 sm:text-lg md:text-xl"
          >
            Nous accompagnons le développement des villes, des entreprises et des communautés grâce à des
            solutions de construction durables, contribuant à un avenir plus solide et prospère.
          </motion.p>

          {/* Action Buttons */}
          <motion.div 
            variants={itemVariants} 
            // Changed gap-5 to gap-3 on mobile. Buttons now correctly span 100% width on mobile and snap to auto on SM+
            className="flex w-fit flex-col gap-3 sm:w-auto sm:flex-row sm:justify-start sm:gap-5"
          >
            <Link
              href="/about"
              // Added flex, items-center, and justify-center so text centers nicely on mobile when button is 100% wide
              className="group relative flex w-fit items-center justify-center overflow-hidden rounded-full bg-iba-orange px-8 py-3.5 text-sm font-semibold text-white shadow-[0_0_30px_rgba(255,157,0,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_50px_rgba(255,157,0,0.6)] sm:w-auto sm:py-4 sm:text-base"
            >
              <span className="relative z-10">Notre Vision</span>
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full" />
            </Link>
            <Link
              href="/products"
              // Same flex and alignment fixes applied here
              className="flex w-fit items-center justify-center rounded-full border border-white/30 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-white/15 hover:border-white/50 sm:w-auto sm:py-4 sm:text-base"
            >
              Découvrir les Produits
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      <SectionWave className="z-20" />
    </section>
  );
}