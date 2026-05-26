"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin, Phone, User, Building2 } from "lucide-react";
import { SectionWave } from "@/components/SectionWave";
import { SectionHalfCircle } from "../SectionHalfCircle";

const sites = [
  {
    name: "Poids Lourd",
    manager: "Yanick",
    phone: "089 677 6842",
    address: "Limete 15ème rue sur Poids Lourds, en face de l'Eglise Tabernacle"
  },
  {
    name: "Limite Polar",
    manager: "Yannick",
    phone: "081 610 2973",
    address: "Avenue Poids Lourd, arrêt Polar"
  },
  {
    name: "14ème Limite",
    manager: "Theo",
    phone: "090 162 0370",
    address: "13ème rue résidentielle Saint Dominique n°13"
  },
  {
    name: "Kinkole",
    manager: "Michee",
    phone: "082 098 5396",
    address: "Commune Nsele, Q. Lagos (Mosquée Makanza, face collège Modeste)"
  },
  {
    name: "Bandal",
    manager: "Basile",
    phone: "081 037 3592",
    address: "Av. Kasavubu n°8, Concession catholique (Arrêt école C. Kintambo)"
  },
  {
    name: "Matadi Kibala",
    manager: "Pele",
    phone: "089 918 8868",
    address: "Route Matadi, arrêt Libulu (Réf: Université Panafricaine)"
  },
  {
    name: "Huilerie",
    manager: "Kevin",
    phone: "082 423 5167",
    address: "Croisement Av Kitega-Huilerie, C/Lingwala (Réf: Station Cobil)"
  },
  {
    name: "Mont Ngafula",
    manager: "Matt",
    phone: "081 758 2920",
    address: "By pass, entrée Masanga Mbila (Réf: Station Ledya / Police Mbata)"
  },
  {
    name: "Commerce",
    manager: "Titan",
    phone: "085 643 0561",
    address: "Croisement Tombalbay et Prince Kasa-Vubu (entrée Hôpital Maman Yemo)"
  },
  {
    name: "Lubudi",
    manager: "Samon",
    phone: "081 500 7982",
    address: "Av. de la Libération n°32, croisement av Zongo Q/ Lubudi"
  },
  {
    name: "UPN",
    manager: "Kabo",
    phone: "099 999 2905",
    address: "Route Matadi n°563 Biza UPN"
  }
];

export function HomeSitesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-10%" });

  return (
    <section
      ref={sectionRef}
      className="relative z-20 w-full bg-background py-16 md:py-24"
    >
      <SectionWave
        edge="top"
        scrollTargetRef={sectionRef}
        fillClassName="fill-background"
        heightClassName="h-10 sm:h-12 md:h-16"
      />
      <div className="mx-auto w-full max-w-[90rem] px-5 sm:px-8 md:px-16 lg:px-20 mt-8 md:mt-12">

        {/* Section Header */}
        <div 
          ref={headerRef}
          className="mb-12 md:mb-16 lg:mb-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex max-w-[min(100%,42rem)] flex-col gap-5"
          >
            <span className="inline-flex w-fit items-center rounded-full border border-iba-navy/10 bg-iba-navy/5 px-5 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-iba-navy">
              Notre Réseau
            </span>

            <div className="flex items-start gap-3">
              <span className="mt-2 h-[2px] w-8 shrink-0 bg-iba-orange" aria-hidden />
              <p className="text-xs font-bold uppercase tracking-widest text-iba-navy/70">
                Implantation Locale
              </p>
            </div>

            <h2 className="text-balance text-4xl font-extrabold uppercase leading-[1.08] tracking-tight text-iba-navy md:text-5xl lg:text-6xl">
              Nos sites à travers la{" "}
              <span className="text-iba-orange">
                capitale
              </span>
            </h2>
          </motion.div>
        </div>

        {/* Sites Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sites.map((site, index) => (
            <SiteCard key={site.name} site={site} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SiteCard({ site, index }: { site: typeof sites[0]; index: number }) {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-5%" });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: "easeOut" }}
      className="group relative flex h-full flex-col justify-between overflow-hidden border border-iba-navy/10 bg-white p-6 shadow-sm transition-all duration-300 hover:border-iba-navy/30 hover:shadow-md"
      style={{
        clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 1.25rem), calc(100% - 1.25rem) 100%, 0 100%)"
      }}
    >
      {/* Blueprint Corner Cut decoration */}
      <div className="absolute bottom-0 right-0 h-5 w-5 bg-iba-navy/5 transition-colors duration-300 group-hover:bg-iba-orange/20" />

      {/* Decorative Index */}
      <div className="absolute -right-4 -top-6 select-none font-mono text-[6rem] font-black leading-none text-iba-navy/[0.03] transition-transform duration-500 group-hover:-translate-y-2 group-hover:scale-110">
        {(index + 1).toString().padStart(2, "0")}
      </div>

      <div className="relative z-10">
        {/* Header: Name and Icon */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <h3 className="font-sans text-xl font-bold uppercase tracking-tight text-iba-navy">
            {site.name}
          </h3>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-iba-navy/5 text-iba-orange transition-transform duration-300 group-hover:scale-110 group-hover:bg-iba-orange group-hover:text-white">
            <Building2 className="h-5 w-5" />
          </div>
        </div>

        {/* Details List */}
        <ul className="flex flex-col gap-4">
          {/* Manager */}
          <li className="flex items-start gap-3">
            <User className="mt-0.5 h-4 w-4 shrink-0 text-iba-sky" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-iba-navy/50">Gérant</span>
              <span className="text-sm font-semibold text-iba-navy/90">{site.manager}</span>
            </div>
          </li>

          {/* Phone */}
          <li className="flex items-start gap-3">
            <Phone className="mt-0.5 h-4 w-4 shrink-0 text-iba-sky" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-iba-navy/50">Téléphone</span>
              <a href={`tel:${site.phone.replace(/\s+/g, '')}`} className="text-sm font-medium text-iba-navy/90 transition-colors hover:text-iba-orange">
                {site.phone}
              </a>
            </div>
          </li>

          {/* Address */}
          <li className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-iba-sky" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-iba-navy/50">Adresse</span>
              <span className="text-sm font-medium leading-relaxed text-iba-navy/80">{site.address}</span>
            </div>
          </li>
        </ul>
      </div>

      {/* Subtle bottom border line */}
      <div className="absolute bottom-0 left-0 h-1 w-0 bg-iba-orange transition-all duration-500 ease-out group-hover:w-full" />
    </motion.div>
  );
}
