"use client";

import { motion } from "framer-motion";
import { CatalogPartnerMarquee } from "@/components/home/CatalogPartnerMarquee";
import { SectionWave } from "@/components/SectionWave";

export function HomePartnersSection() {
  return (
    <section
      id="partners"
      className="scroll-mt-20 relative z-20 w-full overflow-x-clip bg-iba-sky py-16 text-white md:py-20 lg:py-24"
      aria-labelledby="partners-heading"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="w-full"
      >
        <CatalogPartnerMarquee />
      </motion.div>

    </section>
  );
}
