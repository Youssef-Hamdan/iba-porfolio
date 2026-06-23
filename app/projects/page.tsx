"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { ArrowRight, MapPin, X, Maximize2 } from "lucide-react";
import { SectionWave } from "@/components/SectionWave";
import { cn } from "@/lib/utils";

// --- DATA SOURCE ---
export type ProjectRecord = {
  id: string;
  title: string;
  category: string;
  location: string;
  image: string;
  description: string;
  objectives: string[];
  gallery: {
    src: string;
    alt: string;
  }[];
};

function projectImage(file: string): string {
  return `/images/projects/${encodeURIComponent(file)}`;
}

const flotteFluvialeGallery = [
  { file: "river1.webp", alt: "Vue du chantier fluvial — texte provisoire" },
  { file: "river2.webp", alt: "Activités de transport sur les voies navigables — texte provisoire" },
] as const;

const complexeCommercialGallery = [
  { file: "factory1.webp", alt: "Vue du site de construction — texte provisoire" },
  { file: "factory2.webp", alt: "Avancement des travaux immobiliers — texte provisoire" },
] as const;

export const projectData: Record<string, Omit<ProjectRecord, "id">> = {
  "flotte-fluviale": {
    title: "Flotte fluviale",
    category: "Infrastructure & Transport",
    location: "République Démocratique du Congo",
    image: projectImage(flotteFluvialeGallery[0].file),
    description:
      "Chani_metal est un partenaire de confiance dans le secteur du transport fluvial et de la construction navale. Nous l’accompagnons dans ses projets en fournissant des matériaux de qualité, notamment des tôles noires, tôles navales, tubes, cornières et autres produits sidérurgiques essentiels à ses activités. Cette collaboration témoigne de notre engagement à soutenir le développement des infrastructures fluviales en RDC.",
    objectives: [],
    gallery: flotteFluvialeGallery.map(({ file, alt }) => ({
      src: projectImage(file),
      alt,
    })),
  },
  "complexe-commercial": {
    title: "Complexe commercial",
    category: "Bâtiment & Aménagement",
    location: "Kinshasa, République Démocratique du Congo",
    image: projectImage(complexeCommercialGallery[0].file),
    description:
      "SIG est un partenaire de confiance dans le secteur de la construction immobilière. Nous l’accompagnons dans la réalisation de ses projets en fournissant des matériaux de qualité, notamment des barres de fer, peintures et béton, essentiels à la construction d’immeubles durables et modernes.",
    objectives: [],
    gallery: complexeCommercialGallery.map(({ file, alt }) => ({
      src: projectImage(file),
      alt,
    })),
  },
};

const projects: ProjectRecord[] = Object.entries(projectData).map(([key, data], index) => ({
  id: (index + 1).toString().padStart(2, "0"),
  ...data,
}));

const fade = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
};

export default function ProjectsPage() {
  return (
    <main className="flex min-h-[100dvh] md:min-h-screen flex-col bg-background selection:bg-iba-navy selection:text-white">
      
      {/* 1. Hero — 60% navy · 30% white copy · 10% sky accents */}
      <section className="relative overflow-hidden bg-iba-navy pt-[calc(6rem+2rem)] pb-24 text-white md:pt-[calc(8rem+2rem)] md:pb-32">
        <div className="pointer-events-none absolute -right-24 top-1/4 h-[480px] w-[480px] rounded-full bg-white/[0.06] blur-[100px]" aria-hidden />

        {/* Grille technique légère (marine sur ciel) */}
        <div
          className="absolute inset-0 z-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(var(--iba-sky) 1px, transparent 1px), linear-gradient(90deg, var(--iba-sky) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 mx-auto max-w-[90rem] px-5 sm:px-8 md:px-16 lg:px-20">
          <motion.div {...fade} className="max-w-4xl">
            <div
              className="absolute -left-6 -top-10 -z-10 select-none text-[8rem] font-black leading-none text-white/[0.06] md:-left-10 md:-top-16 md:text-[12rem]"
              aria-hidden
            >
              PRJ
            </div>

            <div className="mb-6 flex items-center gap-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-iba-sky shadow-[0_0_8px_rgba(40,37,97,0.5)]" />
                PROJECTS
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-iba-sky/35 to-transparent" aria-hidden />
            </div>

            <h1 className="mt-4 text-5xl font-black uppercase leading-[0.95] tracking-tighter text-white sm:text-6xl md:text-8xl">
              Nos{" "}
              <span className="text-iba-sky">réalisations</span>
            </h1>
            <p className="mt-8 max-w-2xl border-l-2 border-iba-sky pl-6 text-lg font-medium leading-relaxed text-white/85 md:text-xl">
              Découvrez notre portfolio d&apos;infrastructures. De l&apos;ingénierie civile aux charpentes métalliques de haute précision, nous bâtissons les fondations de demain.
            </p>
          </motion.div>
        </div>
        <SectionWave edge="bottom" fillClassName="fill-background" heightClassName="h-12 md:h-16" />
      </section>

      {/* 2. PROJECT LIST (ALTERNATING STRUCTURAL BLOCKS) */}
      <section className="relative bg-background py-16 md:py-24 lg:py-32">
        
        {/* Vertical alignment grid line running through the whole section */}
        <div className="absolute left-1/2 top-0 bottom-0 hidden w-px -translate-x-1/2 bg-iba-navy/15 lg:block" aria-hidden />

        <div className="mx-auto max-w-[90rem] px-5 sm:px-8 md:px-16 lg:px-20 flex flex-col gap-24 md:gap-32">
          {projects.map((project, index) => {
            const isEven = index % 2 === 0;
            
            return (
              <ProjectBlock key={project.id} project={project} isEven={isEven} />
            );
          })}
        </div>
      </section>

      {/* 3. CTA — navy band, sky accent on keyword + CTA control */}
      <section className="relative overflow-hidden bg-iba-navy py-24 text-center text-white">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          aria-hidden
        />
        <div className="relative z-10 mx-auto max-w-3xl px-5">
          <h2 className="mb-6 text-3xl font-black uppercase tracking-tight md:text-5xl">
            Prêt à construire{" "}
            <span className="text-iba-sky">l&apos;avenir</span> ?
          </h2>
          <p className="mb-10 text-lg font-medium text-white/90">
            Soumettez-nous vos plans. Nos ingénieurs évalueront la faisabilité et les besoins en acier de votre projet.
          </p>
          <Link
            href="/quotation"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-iba-orange px-8 py-4 text-sm font-bold uppercase tracking-widest text-white shadow-lg shadow-iba-orange/25 transition-all hover:bg-white hover:text-iba-orange"
          >
            <span className="relative z-10 flex items-center">
              Démarrer un projet
              <ArrowRight className="ml-3 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}

// --- PROJECT BLOCK COMPONENT ---
function ProjectBlock({ project, isEven }: { project: ProjectRecord; isEven: boolean }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-15%" });
  const [lightboxOpen, setLightboxOpen] = useState(false);
  
  // Use index for active image
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [imageHoverActive, setImageHoverActive] = useState(false);

  const openLightbox = useCallback(() => {
    setActiveImageIndex(imageHoverActive && project.gallery.length > 1 ? 1 : 0);
    setLightboxOpen(true);
  }, [imageHoverActive, project.gallery.length]);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightboxOpen, closeLightbox]);

  const activeSrc = project.gallery[activeImageIndex]?.src || project.image;
  const activeLabel = `Vue ${activeImageIndex + 1} / ${project.gallery.length}`;

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "relative flex flex-col gap-8 lg:items-center lg:gap-16",
        isEven ? "lg:flex-row" : "lg:flex-row-reverse",
      )}
    >
      <div
        className="group/img relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-iba-navy/15 ring-1 ring-iba-sky/10 md:aspect-[16/10] lg:w-1/2"
        onMouseEnter={() => setImageHoverActive(true)}
        onMouseLeave={() => setImageHoverActive(false)}
      >
        <button
          type="button"
          onClick={openLightbox}
          className="absolute inset-0 z-10 block h-full w-full cursor-zoom-in overflow-hidden rounded-[inherit] border-0 bg-transparent p-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-iba-navy focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label={`Agrandir les visuels du projet : ${project.title}`}
        >
          <Image
            src={project.image}
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-[opacity,transform] duration-500 ease-out group-hover/img:scale-105 group-hover/img:opacity-0"
          />
          <Image
            src={project.gallery[1]?.src || project.image}
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover opacity-0 transition-[opacity,transform] duration-500 ease-out group-hover/img:scale-105 group-hover/img:opacity-100"
          />
          <span className="sr-only">Ouvrir la vue agrandie</span>
        </button>

        <div
          className="pointer-events-none absolute inset-0 z-[5] bg-gradient-to-t from-iba-sky/35 via-transparent to-iba-navy/10"
          aria-hidden
        />

        <div
          className="pointer-events-none absolute bottom-4 left-1/2 z-[6] -translate-x-1/2 opacity-0 transition-opacity duration-300 group-hover/img:opacity-100"
          aria-hidden
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-iba-sky/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg backdrop-blur-sm">
            <Maximize2 className="h-3.5 w-3.5" />
            Cliquer pour agrandir
          </span>
        </div>

        <div className="pointer-events-none absolute left-4 top-4 z-[6] h-8 w-8 border-t-2 border-l-2 border-white/70" aria-hidden />
        <div className="pointer-events-none absolute bottom-4 right-4 z-[6] h-8 w-8 border-b-2 border-r-2 border-white/70" aria-hidden />

        <div className="pointer-events-none absolute right-0 top-0 z-[6] bg-iba-sky px-4 py-2 font-mono text-lg font-black text-white shadow-lg">
          {project.id}
        </div>

        <div
          className="pointer-events-none absolute bottom-0 left-0 z-[6] h-1 w-0 bg-iba-sky transition-all duration-700 ease-out group-hover/img:w-full"
          aria-hidden
        />
      </div>

      {/* CONTENT — texte marine sur blanc, accents ciel légers */}
      <div className="flex w-full flex-col justify-center lg:w-1/2">
        <div className="mb-4 inline-flex w-fit items-center rounded-full border border-iba-sky/12 bg-white px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-iba-sky shadow-sm ring-1 ring-iba-navy/15">
          <span className="mr-2 text-iba-navy" aria-hidden>
            ✦
          </span>
          {project.category}
        </div>

        <h2 className="mb-6 text-3xl font-black uppercase leading-[1.1] tracking-tighter text-iba-sky md:text-4xl lg:text-5xl">
          {project.title}
        </h2>

        <p className="mb-8 text-base font-medium leading-relaxed text-iba-muted md:text-lg">
          {project.description}
        </p>

          {/* Objectifs - Liste sous la description */}
          {project.objectives && project.objectives.length > 0 && (
            <div className="mb-8">
              <h4 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-iba-sky/60">Objectifs & Vision</h4>
              <ul className="flex flex-col gap-2">
                {project.objectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-iba-orange" aria-hidden />
                    <span className="text-sm font-medium text-iba-muted">{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        <div className="mb-8 flex items-center gap-4 border-y border-iba-sky/10 py-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-iba-orange text-background">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-iba-sky/55">Localisation</p>
            <p className="font-bold text-iba-sky">{project.location}</p>
          </div>
        </div>

      </div>

      <AnimatePresence>
        {lightboxOpen ? (
          <motion.div
            key={`lightbox-${project.id}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`lightbox-title-${project.id}`}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/88 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
              className="relative w-full max-w-6xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={closeLightbox}
                className="absolute -top-1 right-0 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white hover:text-iba-sky md:-right-2 md:-top-14"
                aria-label="Fermer la galerie"
              >
                <X className="h-5 w-5" strokeWidth={2} />
              </button>

              <p
                id={`lightbox-title-${project.id}`}
                className="mb-3 text-center text-xs font-bold uppercase tracking-[0.2em] text-white/70 md:text-left"
              >
                {project.title}
              </p>

              <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-iba-sky ring-1 ring-white/15 md:aspect-[21/9] md:min-h-[min(70vh,520px)]">
                <AnimatePresence initial={false} mode="wait">
                  <motion.div
                    key={activeImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={activeSrc}
                      alt={project.gallery.find(g => g.src === activeSrc)?.alt || ""}
                      fill
                      className="object-contain md:object-cover"
                      sizes="100vw"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              <p className="mt-2 text-center text-[11px] font-medium text-white/60">{activeLabel}</p>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                {project.gallery.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImageIndex(i)}
                    className={cn(
                      "rounded-full border px-5 py-2 text-xs font-bold uppercase tracking-wider transition-colors",
                      i === activeImageIndex
                        ? "border-white bg-white text-iba-sky"
                        : "border-white/25 bg-white/10 text-white hover:border-white/40",
                    )}
                  >
                    Vue {i + 1}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.article>
  );
}