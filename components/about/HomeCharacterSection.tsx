"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useInView } from "framer-motion";
import { AboutSectionHeader } from "@/components/about/AboutSectionHeader";
import { cn } from "@/lib/utils";

const principleKeys = ["integrity", "sustainability", "innovation", "social"] as const;

const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const plateVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

export function HomeCharterSection() {
  const t = useTranslations("About.charter");
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-10%" });

  return (
    <section className="relative bg-background pt-16 pb-24 md:pt-32 lg:pb-40 overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none flex justify-center opacity-60">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(var(--iba-sky) 1px, transparent 1px), 
              linear-gradient(90deg, var(--iba-sky) 1px, transparent 1px)
            `,
            backgroundSize: "120px 120px",
            opacity: 0.03,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 0 0, var(--iba-sky) 2px, transparent 3px)`,
            backgroundSize: "120px 120px",
            opacity: 0.08,
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[90rem] px-5 sm:px-8 md:px-16 lg:px-20">
        <AboutSectionHeader
          variant="white"
          waterNumber={t("waterNumber")}
          badge={t("badge")}
          kicker={t("kicker")}
          title={
            <>
              {t("headline")}{" "}
              <span className="text-iba-navy">{t("headlineAccent")}</span>
            </>
          }
          lead={t("intro")}
          className="mb-12 md:mb-16"
        />

        <motion.div
          ref={containerRef}
          variants={gridVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid auto-rows-[180px] grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-16"
        >
          {principleKeys.map((key, idx) => {
            const isWide = idx === 0;

            return (
              <motion.div
                key={key}
                variants={plateVariants}
                className={cn(
                  "group relative flex flex-col justify-between border border-iba-sky/20 bg-white p-6 md:p-8 transition-colors duration-300 hover:bg-iba-sky",
                  isWide ? "md:col-span-2" : "col-span-1",
                )}
              >
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-iba-sky transition-colors group-hover:border-iba-navy" />
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-iba-sky transition-colors group-hover:border-iba-navy" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-iba-sky transition-colors group-hover:border-iba-navy" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-iba-sky transition-colors group-hover:border-iba-navy" />

                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-iba-sky/40 transition-colors group-hover:text-iba-navy">
                    ID_0{idx + 1}
                  </span>

                  <span className="text-iba-sky/20 transition-colors group-hover:text-iba-navy/50 text-[10px]">
                    ⬢
                  </span>
                </div>

                <h3 className="font-sans text-2xl md:text-3xl font-black uppercase tracking-tight text-iba-sky transition-colors group-hover:text-white">
                  {t(`principles.${key}`)}
                </h3>

                <div className="absolute bottom-0 left-0 h-1 w-0 bg-iba-orange transition-all duration-500 ease-out group-hover:w-full" />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
