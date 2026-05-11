"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { CatalogPartnerMarquee } from "@/components/home/CatalogPartnerMarquee";
import { SectionWave } from "@/components/SectionWave";

export function HomePartnersSection() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      id="partners"
      className="scroll-mt-20 relative z-20 w-full bg-iba-navy py-16 text-white md:py-20 lg:py-24"
      aria-labelledby="partners-heading"
    >
      <SectionWave
        edge="top"
        scrollTargetRef={sectionRef}
        fillClassName="fill-iba-navy"
        heightClassName="h-10 sm:h-12 md:h-16"
      />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="w-full overflow-x-clip"
      >
        <CatalogPartnerMarquee />
        <SectionWave
        edge="bottom"
        scrollTargetRef={sectionRef}
        fillClassName="fill-white"
        heightClassName="h-10 sm:h-12 md:h-16"
      />
      </motion.div>
    </section>
  );
}
