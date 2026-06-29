"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ExternalLink, MapPin, Phone, User, Building2 } from "lucide-react";
import { SectionWave } from "@/components/SectionWave";

interface Site {
  name: string;
  manager: string;
  phone: string;
  address: string;
  mapQuery?: string;
}

const sites: Site[] = [
  {
    name: "Poids Lourd",
    manager: "Yanick",
    phone: "089 677 6842",
    address: "Limete 15ème rue sur Poids Lourds, en face de l'Eglise Tabernacle",
    mapQuery: "4°22'2.30\"S 15°21'6.33\"E"
  },
  {
    name: "Limite Polar",
    manager: "Yannick",
    phone: "081 610 2973",
    address: "Avenue Poids Lourd, arrêt Polar",
    mapQuery: "4°19'40.79\"S 15°20'16.69\"E"
  },
  {
    name: "14ème Limite",
    manager: "Theo",
    phone: "090 162 0370",
    address: "13ème rue résidentielle Saint Dominique n°13",
    mapQuery: "4°21'50.67\"S 15°20'25.67\"E"
  },
  {
    name: "Kinkole",
    manager: "Michee",
    phone: "082 098 5396",
    address: "Commune Nsele, Q. Lagos (Mosquée Makanza, face collège Modeste)",
    mapQuery: "4°19'58.33\"S 15°30'52.98\"E"
  },
  {
    name: "Bandal",
    manager: "Basile",
    phone: "081 037 3592",
    address: "Av. Kasavubu n°8, Concession catholique (Arrêt école C. Kintambo)",
    mapQuery: "4°20'46.82\"S 15°15'56.17\"E"
  },
  {
    name: "Matadi Kibala",
    manager: "Pele",
    phone: "089 918 8868",
    address: "Route Matadi, arrêt Libulu (Réf: Université Panafricaine)",
    mapQuery: "4°26'6.43\"S 15°15'28.34\"E"
  },
  {
    name: "Huilerie",
    manager: "Kevin",
    phone: "082 423 5167",
    address: "Croisement Av Kitega-Huilerie, C/Lingwala (Réf: Station Cobil)",
    mapQuery: "4°19'15.17\"S 15°18'18.60\"E"
  },
  {
    name: "Mont Ngafula",
    manager: "Matt",
    phone: "081 758 2920",
    address: "By pass, entrée Masanga Mbila (Réf: Station Ledya / Police Mbata)",
    mapQuery: "4°26'5.40\"S 15°16'40.69\"E"
  },
  {
    name: "Commerce",
    manager: "Titan",
    phone: "085 643 0561",
    address: "Croisement Tombalbay et Prince Kasa-Vubu (entrée Hôpital Maman Yemo)",
    mapQuery: "4°18'27.21\"S 15°18'25.40\"E"
  },
  {
    name: "Lubudi",
    manager: "Samon",
    phone: "081 500 7982",
    address: "Av. de la Libération n°32, croisement av Zongo Q/ Lubudi",
    mapQuery: "4°22'2.14\"S 15°17'7.45\"E"
  },
  {
    name: "UPN",
    manager: "Kabo",
    phone: "099 999 2905",
    address: "Route Matadi n°563 Biza UPN"
  }
];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.5, 
      ease: [0.21, 0.47, 0.32, 0.98] as const // Add this cast
    },
  },
};

// Animation presets for performance & readability
const gridContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};


export function HomeSitesSection() {
  const sectionRef = useRef<HTMLElement>(null);

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
      <div className="mx-auto w-full max-w-[90rem] px-3 sm:px-8 md:px-16 lg:px-20 mt-8 md:mt-12">

        {/* Section Header */}
        <div className="mb-10 md:mb-16 lg:mb-20 px-1 sm:px-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex max-w-[min(100%,42rem)] flex-col gap-4 sm:gap-5"
          >
            <span className="inline-flex w-fit items-center rounded-full border border-iba-navy/10 bg-iba-navy/5 px-4 sm:px-5 py-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-iba-navy">
              Notre Réseau
            </span>

            <div className="flex items-start gap-3">
              <span className="mt-2 h-[2px] w-8 shrink-0 bg-iba-orange" aria-hidden="true" />
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-iba-navy/70">
                Implantation Locale
              </p>
            </div>

            <h2 className="text-balance text-3xl font-extrabold uppercase leading-[1.08] tracking-tight text-iba-navy sm:text-4xl md:text-5xl lg:text-6xl">
              Nos sites à travers la{" "}
              <span className="text-iba-orange">capitale</span>
            </h2>
          </motion.div>
        </div>

        {/* Sites Grid - Optimized performance via orchestrated entry */}
        <motion.div 
          variants={gridContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-5%" }}
          className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4"
        >
          {sites.map((site, index) => (
            <SiteCard key={site.name} site={site} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function SiteCard({ site, index }: { site: Site; index: number }) {
  // Built standard Google Maps search URL wrapper safely handles coordinates & text descriptions
  const fallbackQuery = `${site.name}, Kinshasa`;
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.mapQuery || fallbackQuery)}`;

  return (
    <motion.div
      variants={cardVariants}
      className="group relative flex h-full flex-col justify-between overflow-hidden border border-iba-navy/10 bg-white p-3 sm:p-6 shadow-sm transition-all duration-300 hover:border-iba-navy/30 hover:shadow-md"
      style={{
        clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 1rem), calc(100% - 1rem) 100%, 0 100%)"
      }}
    >
      <div className="absolute bottom-0 right-0 h-4 w-4 bg-iba-navy/5 transition-colors duration-300 group-hover:bg-iba-orange/20" />

      {/* Decorative Index */}
      <div className="absolute -right-2 -top-4 select-none font-mono text-[4rem] sm:text-[6rem] font-black leading-none text-iba-navy/[0.03] transition-transform duration-500 group-hover:-translate-y-2 group-hover:scale-110">
        {(index + 1).toString().padStart(2, "0")}
      </div>

      <div className="relative z-10 min-w-0 w-full">
        {/* Header: Name and Icon */}
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4">
          <h3 className="font-sans text-sm sm:text-xl font-bold uppercase tracking-tight text-iba-navy pr-4 sm:pr-0 break-words">
            {site.name}
          </h3>
          <div className="flex h-7 w-7 sm:h-10 sm:w-10 shrink-0 items-center justify-center bg-iba-navy/5 text-iba-orange transition-transform duration-300 group-hover:scale-110 group-hover:bg-iba-orange group-hover:text-white">
            <Building2 className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
          </div>
        </div>

        {/* Details List */}
        <ul className="flex flex-col gap-3 sm:gap-5">
          {/* Manager */}
          <li className="flex items-start gap-2 sm:gap-3 min-w-0">
            <User className="mt-0.5 h-3 w-3 sm:h-4 sm:w-4 shrink-0 text-iba-sky" />
            <div className="flex flex-col min-w-0">
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-iba-navy/50">Gérant</span>
              <span className="text-xs sm:text-sm font-semibold text-iba-navy/90 truncate">{site.manager}</span>
            </div>
          </li>

          {/* Phone */}
          <li className="flex items-start gap-2 sm:gap-3 min-w-0">
            <Phone className="mt-0.5 h-3 w-3 sm:h-4 sm:w-4 shrink-0 text-iba-sky" />
            <div className="flex flex-col min-w-0">
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-iba-navy/50">Téléphone</span>
              <a 
                href={`tel:${site.phone.replace(/\s+/g, '')}`} 
                className="inline-block py-0.5 text-xs sm:text-sm font-medium text-iba-navy/90 transition-colors hover:text-iba-orange active:text-iba-orange/70 break-all"
              >
                {site.phone}
              </a>
            </div>
          </li>

          {/* Address */}
          <li className="flex items-start gap-2 sm:gap-3 min-w-0">
            <MapPin className="mt-0.5 h-3 w-3 sm:h-4 sm:w-4 shrink-0 text-iba-sky" />
            <div className="flex flex-col min-w-0 w-full">
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-iba-navy/50">Adresse</span>
              <span className="text-[11px] sm:text-sm font-medium leading-relaxed text-iba-navy/80 line-clamp-4 sm:line-clamp-none break-words">
                {site.address}
              </span>
              
              <a 
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 sm:mt-3 inline-flex w-fit items-center gap-1 sm:gap-1.5 rounded-full border border-iba-navy/10 bg-iba-navy/5 px-2 py-1 sm:px-3 sm:py-1.5 text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-iba-navy transition-all active:scale-95 hover:border-iba-sky hover:bg-iba-sky hover:text-white"
              >
                <span className="hidden sm:inline">Voir sur la carte</span>
                <span className="sm:hidden">Carte</span>
                <ExternalLink className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              </a>
            </div>
          </li>
        </ul>
      </div>

      <div className="absolute bottom-0 left-0 h-1 w-0 bg-iba-orange transition-all duration-500 ease-out group-hover:w-full" />
    </motion.div>
  );
}