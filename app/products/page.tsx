"use client";

import { memo, useLayoutEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, PackageSearch, Boxes } from "lucide-react";
import { SectionWave } from "@/components/SectionWave";
import { cn } from "@/lib/utils";

// Assurez-vous que ce chemin correspond à l'emplacement de votre fichier de données
import {
  allProducts,
  productCategories,
  productImageUrl,
  ProductCategoryId,
} from "@/lib/products";

type Product = (typeof allProducts)[number];

const categoryLabelMap = new Map(
  productCategories.map((c) => [c.id, c.label] as const),
);

function scrollToProductsTop(el: HTMLElement | null) {
  if (!el) return;

  const header = document.querySelector("header");
  const headerOffset = (header?.getBoundingClientRect().height ?? 96) + 8;
  const top = window.scrollY + el.getBoundingClientRect().top - headerOffset;

  window.scrollTo({ top: Math.max(0, top), left: 0, behavior: "auto" });
}

const fade = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
};

const ProductCard = memo(function ProductCard({ product }: { product: Product }) {
  const categoryLabel = categoryLabelMap.get(product.categoryId) ?? "";

  return (
    <article className="group relative flex flex-col justify-between border border-iba-sky/10 bg-white p-6 shadow-sm shadow-iba-sky/[0.04] transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-iba-navy/40 hover:shadow-[0_8px_28px_rgba(0,170,226,0.1)]">
      <div
        className="absolute left-0 top-0 h-3 w-3 border-l-2 border-t-2 border-iba-sky/25 transition-colors group-hover:border-iba-navy"
        aria-hidden
      />
      <div
        className="absolute right-0 top-0 h-3 w-3 border-r-2 border-t-2 border-iba-sky/25 transition-colors group-hover:border-iba-navy"
        aria-hidden
      />

      <div className="mb-6 flex items-start justify-between">
        <span className="rounded-full border border-iba-sky/10 bg-iba-navy/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-iba-sky">
          {categoryLabel}
        </span>
        <span className="text-[10px] text-iba-sky/20 transition-colors group-hover:text-iba-navy/50" aria-hidden>
          ⬢
        </span>
      </div>

      <div className="relative mb-6 flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg border border-iba-sky/5 bg-iba-navy/[0.06] p-4 transition-colors group-hover:bg-iba-navy/10">
        <Image
          src={productImageUrl(product.storageFolder, product.file)}
          alt={product.name}
          fill
          className="object-contain p-2 drop-shadow-md transition-transform duration-200 ease-out group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
      </div>

      <h3 className="line-clamp-2 text-center font-sans text-lg font-black uppercase leading-tight tracking-tight text-iba-sky transition-colors group-hover:text-iba-navy">
        {product.name}
      </h3>

      <div
        className="absolute bottom-0 left-0 h-1 w-0 bg-iba-sky transition-[width] duration-300 ease-out group-hover:w-full"
        aria-hidden
      />
    </article>
  );
});

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState<ProductCategoryId | "all">("all");
  const productsTopRef = useRef<HTMLDivElement>(null);
  const skipInitialScrollRef = useRef(true);

  const filteredProducts = useMemo(
    () =>
      activeCategory === "all"
        ? allProducts
        : allProducts.filter((p) => p.categoryId === activeCategory),
    [activeCategory],
  );

  useLayoutEffect(() => {
    if (skipInitialScrollRef.current) {
      skipInitialScrollRef.current = false;
      return;
    }

    scrollToProductsTop(productsTopRef.current);

    const raf = requestAnimationFrame(() => {
      scrollToProductsTop(productsTopRef.current);
    });

    const timeout = window.setTimeout(() => {
      scrollToProductsTop(productsTopRef.current);
    }, 200);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timeout);
    };
  }, [activeCategory, filteredProducts.length]);

  return (
    <main className="flex min-h-[100dvh] md:min-h-screen flex-col bg-background selection:bg-iba-navy selection:text-white">
      
      {/* 1. Hero — 60% navy · 30% white copy · 10% sky accents */}
      <section className="relative overflow-hidden bg-iba-navy pt-[calc(6rem+2rem)] pb-16 text-white md:pt-[calc(8rem+2rem)] md:pb-24">
        <div className="pointer-events-none absolute -right-24 top-1/4 h-[480px] w-[480px] rounded-full bg-white/[0.06] blur-[100px]" aria-hidden />

        <div
          className="absolute inset-0 z-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(var(--iba-sky) 1px, transparent 1px), linear-gradient(90deg, var(--iba-sky) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
          aria-hidden
        />

        <div className="relative z-10 mx-auto max-w-[90rem] px-5 sm:px-8 md:px-16 lg:px-20">
          <motion.div {...fade} className="max-w-4xl">
            <div
              className="absolute -left-6 -top-10 -z-10 select-none text-[8rem] font-black leading-none text-white/[0.06] md:-left-10 md:-top-16 md:text-[12rem]"
              aria-hidden
            >
              MAT
            </div>

            <div className="mb-6 flex items-center gap-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-iba-sky shadow-[0_0_8px_rgba(40,37,97,0.5)]" />
                Inventaire général
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-iba-sky/35 to-transparent" aria-hidden />
            </div>

            <h1 className="mt-4 text-5xl font-black uppercase leading-[0.95] tracking-tighter text-white sm:text-6xl md:text-8xl">
              Catalogue{" "}
              <span className="text-iba-sky">produits</span>
            </h1>
            <p className="mt-8 max-w-2xl border-l-2 border-iba-sky pl-6 text-lg font-medium leading-relaxed text-white/85 md:text-xl">
              Une sélection rigoureuse de matériaux de construction de première qualité. Du gros œuvre aux finitions spécialisées, nous équipons vos chantiers avec les standards internationaux.
            </p>
          </motion.div>
        </div>
        <SectionWave edge="bottom" fillClassName="fill-background" heightClassName="h-12 md:h-16" />
      </section>

      {/* 2. Catalogue : filtres à gauche (sidebar) + contenu */}
      <section
        id="catalog-content"
        className="scroll-mt-24 relative min-h-[50vh] bg-background py-10 md:py-16 lg:py-20"
      >
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 0 0, var(--iba-sky) 1px, transparent 2px)`,
            backgroundSize: "40px 40px",
          }}
          aria-hidden
        />

        <div className="relative z-10 mx-auto max-w-[90rem] px-5 sm:px-8 md:px-16 lg:px-20">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10 xl:gap-12">
            {/* Sidebar filtres */}
            <nav
              aria-label="Filtrer par catégorie"
              className="shrink-0 lg:sticky lg:top-24 lg:w-[min(100%,15.5rem)] xl:w-64"
            >
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-iba-sky/45">
                Catégories
              </p>
              <div className="grid grid-cols-2 gap-2 border-b border-iba-sky/10 pb-6 sm:grid-cols-3 lg:flex lg:flex-col lg:border-b-0 lg:border-r lg:border-iba-sky/10 lg:pb-0 lg:pr-6 xl:pr-8">
                <button
                  type="button"
                  onClick={() => setActiveCategory("all")}
                  className={cn(
                    "flex w-full items-center justify-center lg:justify-start rounded-lg border px-2 py-3 text-center lg:text-left text-[10px] sm:text-[11px] font-bold uppercase tracking-wide transition-all",
                    activeCategory === "all"
                      ? "border-iba-sky bg-iba-sky text-white shadow-md shadow-iba-sky/15"
                      : "border-iba-sky/12 bg-white text-iba-sky hover:border-iba-navy/45 hover:text-iba-navy",
                  )}
                >
                  Tous les produits
                </button>
                {productCategories.map((cat) => (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={cn(
                      "flex w-full items-center justify-center lg:justify-start rounded-lg border px-2 py-3 text-center lg:text-left text-[10px] sm:text-[11px] font-bold uppercase tracking-wide transition-all",
                      activeCategory === cat.id
                        ? "border-iba-navy bg-iba-navy text-white shadow-md shadow-iba-navy/20"
                        : "border-iba-sky/12 bg-white text-iba-sky hover:border-iba-navy/45 hover:text-iba-navy",
                    )}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </nav>

            {/* Contenu : bannière + grille */}
            <div ref={productsTopRef} className="min-w-0 flex-1 scroll-mt-28">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.18, ease: [0.25, 1, 0.5, 1] as const }}
                  className="mb-8 flex items-start gap-4 border-l-4 border-iba-sky bg-iba-navy/10 p-5 ring-1 ring-iba-sky/5 sm:p-6 lg:mb-10"
                >
                  <Boxes className="h-6 w-6 shrink-0 text-iba-sky" aria-hidden />
                  <div>
                    <h2 className="font-bold uppercase tracking-tight text-iba-sky">
                      {activeCategory === "all"
                        ? "Inventaire complet"
                        : productCategories.find((c) => c.id === activeCategory)?.label}
                    </h2>
                    <p className="mt-1 text-sm font-medium text-iba-sky/70">
                      {activeCategory === "all"
                        ? "Parcourez l'intégralité de nos références disponibles en stock."
                        : productCategories.find((c) => c.id === activeCategory)?.description}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center lg:py-24">
                  <PackageSearch className="mb-4 h-16 w-16 text-iba-navy/40" aria-hidden />
                  <p className="text-xl font-bold uppercase text-iba-sky">Aucun produit trouvé</p>
                  <p className="mt-2 text-sm text-iba-sky/60">Veuillez sélectionner une autre catégorie.</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* 3. CTA — bandeau navy, accent marine */}
      <section className="relative overflow-hidden border-t border-white/20 bg-iba-navy py-20 text-center text-white">
        <div className="pointer-events-none absolute right-1/4 top-0 z-0 h-[400px] w-[400px] rounded-full bg-white/[0.08] blur-[100px]" aria-hidden />
        <div className="relative z-10 mx-auto max-w-3xl px-5">
          <h2 className="mb-6 text-3xl font-black uppercase tracking-tight md:text-5xl">
            Commandes en gros &{" "}
            <span className="text-iba-sky">devis</span>
          </h2>
          <p className="mb-10 text-lg font-medium text-white/90">
            Besoin de grandes quantités pour votre chantier ? Contactez notre équipe commerciale pour obtenir une tarification adaptée et organiser la logistique.
          </p>
          <Link
            href="/quotation"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-iba-orange px-8 py-4 text-sm font-bold uppercase tracking-widest text-white shadow-lg shadow-iba-orange/25 transition-all hover:bg-white hover:text-iba-orange"
          >
            <span className="relative z-10 flex items-center">
              Demander un devis
              <ArrowRight className="ml-3 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Link>
        </div>
        <SectionWave edge="top" fillClassName="fill-background" heightClassName="h-8 md:h-12" />
      </section>
    </main>
  );
}