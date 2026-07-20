"use client";

import { useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform } from "framer-motion";
import { SectionWave } from "@/components/SectionWave";
import { Link } from "@/i18n/navigation";

export function HomeHero() {
  const t = useTranslations("HomeHero");
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
        staggerChildren: 0.2,
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
      className="relative flex min-h-[100dvh] w-full items-center justify-start overflow-hidden bg-iba-sky text-white"
    >
      <motion.div
        className="absolute inset-0 z-0 h-[115%] w-full transform-gpu overflow-hidden backface-hidden will-change-transform"
        style={{ y: backgroundY, z: 0 }}
      >
        <Image
          src="/images/hero.webp"
          alt={t("imageAlt")}
          fill
          priority
          sizes="100vw"
          className="object-cover transform-gpu"
        />
      </motion.div>

      <div className="absolute inset-0 z-[1] bg-gradient-to-tr from-iba-navy via-iba-navy/30 to-transparent mix-blend-multiply" />

      <motion.div
        style={{ opacity: contentOpacity }}
        className="relative z-10 mx-auto w-full max-w-[90rem] px-5 pt-16 text-left will-change-[opacity] sm:px-8 sm:pt-24 md:px-16 lg:px-20 lg:pt-28"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-start"
        >
          <motion.h1
            variants={itemVariants}
            className="mb-5 text-[2.5rem] font-extrabold leading-[1.05] tracking-tighter drop-shadow-md sm:mb-6 sm:text-5xl md:text-6xl lg:text-7xl"
          >
            <span className="text-iba-sky">{t("titlePart1")} </span>
            <br className="hidden sm:block" />
            <span className="text-white">{t("titlePart2")}</span>{" "}
            <span className="text-iba-sky">{t("titlePart3")}</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mb-8 max-w-2xl text-base leading-relaxed text-gray-200 sm:mb-10 sm:text-lg md:text-xl"
          >
            {t("subtitle")}
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex w-fit flex-col gap-3 sm:w-auto sm:flex-row sm:justify-start sm:gap-5"
          >
            <Link
              href="/about"
              className="group relative flex w-fit items-center justify-center overflow-hidden rounded-full bg-iba-orange px-8 py-3.5 text-sm font-semibold text-white shadow-[0_0_30px_rgba(255,157,0,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_50px_rgba(255,157,0,0.6)] sm:w-auto sm:py-4 sm:text-base"
            >
              <span className="relative z-10">{t("ctaVision")}</span>
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full" />
            </Link>
            <Link
              href="/products"
              className="flex w-fit items-center justify-center rounded-full border border-white/30 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-white/15 hover:border-white/50 sm:w-auto sm:py-4 sm:text-base"
            >
              {t("ctaProducts")}
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      <SectionWave className="z-20" />
    </section>
  );
}
