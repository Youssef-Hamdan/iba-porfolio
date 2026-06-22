
"use client";

import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, PackageSearch, Boxes, X, Maximize2 } from "lucide-react";
import { SectionWave } from "@/components/SectionWave";
import { cn } from "@/lib/utils";

// Assurez-vous que ce chemin correspond à l'emplacement de votre fichier de données
import {
  allProducts,
  productCategories,
  productImageUrl,
  ProductCategoryId,
  ProductSubcategoryId,
  categoryHasSubcategories,
  getSubcategoriesForCategory,
  subcategoryLabel,
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

function ProductViewer({
  product,
  index,
  total,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: {
  product: Product;
  index: number;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}) {
  const categoryLabel = categoryLabelMap.get(product.categoryId) ?? "";
  const imageSrc = productImageUrl(product.storageFolder, product.file);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev) onPrev();
      if (e.key === "ArrowRight" && hasNext) onNext();
    };

    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-viewer-title"
      className="fixed inset-0 z-[200] flex items-center justify-center bg-iba-navy/25 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
        className="relative w-full max-w-lg rounded-2xl border border-iba-sky/10 bg-white p-5 shadow-2xl shadow-iba-navy/10 sm:max-w-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-iba-sky/15 bg-white text-iba-navy transition-colors hover:border-iba-navy/30 hover:bg-iba-navy/5 hover:text-iba-sky"
          aria-label="Fermer l'aperçu"
        >
          <X className="h-4 w-4" strokeWidth={2} />
        </button>

        <p className="pr-10 text-[10px] font-bold uppercase tracking-[0.2em] text-iba-sky/70">
          {categoryLabel}
        </p>
        <p
          id="product-viewer-title"
          className="mt-1 pr-10 text-lg font-black uppercase leading-tight tracking-tight text-iba-navy sm:text-xl"
        >
          {product.name}
        </p>

        <div className="mt-6 flex items-center gap-2 sm:gap-4">
          <button
            type="button"
            onClick={onPrev}
            disabled={!hasPrev}
            className={cn(
              "flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full border transition-colors",
              hasPrev
                ? "border-iba-sky/20 bg-white text-iba-navy hover:border-iba-sky hover:bg-iba-sky/5 hover:text-iba-sky"
                : "cursor-not-allowed border-iba-sky/10 bg-iba-navy/5 text-iba-sky/25",
            )}
            aria-label="Produit précédent"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2.5} />
          </button>

          <div className="relative min-h-[220px] flex-1 overflow-hidden rounded-xl border border-iba-sky/10 bg-white sm:min-h-[360px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: hasPrev ? 12 : -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: hasNext ? -12 : 12 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0"
              >
                <Image
                  src={imageSrc}
                  alt={product.name}
                  fill
                  className="object-contain p-4 sm:p-8"
                  sizes="(max-width: 640px) 90vw, 640px"
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <button
            type="button"
            onClick={onNext}
            disabled={!hasNext}
            className={cn(
              "flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full border transition-colors",
              hasNext
                ? "border-iba-sky/20 bg-white text-iba-navy hover:border-iba-sky hover:bg-iba-sky/5 hover:text-iba-sky"
                : "cursor-not-allowed border-iba-sky/10 bg-iba-navy/5 text-iba-sky/25",
            )}
            aria-label="Produit suivant"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2.5} />
          </button>
        </div>

        <p className="mt-4 text-center text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-iba-sky/60">
          {index + 1} / {total}
        </p>
      </motion.div>
    </motion.div>
  );
}

const ProductCard = memo(function ProductCard({
  product,
  onView,
  showSubcategory = false,
}: {
  product: Product;
  onView: () => void;
  showSubcategory?: boolean;
}) {
  const categoryLabel = categoryLabelMap.get(product.categoryId) ?? "";
  const badgeLabel =
    showSubcategory && product.subcategoryId
      ? subcategoryLabel(product.subcategoryId)
      : categoryLabel;
  const imageSrc = productImageUrl(product.storageFolder, product.file);

  return (
    <article className="group relative flex flex-col justify-between border border-iba-sky/10 bg-white p-2 sm:p-4 lg:p-6 shadow-sm shadow-iba-sky/[0.04] transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-iba-navy/40 hover:shadow-[0_8px_28px_rgba(0,170,226,0.1)]">
      
      <div
        className="hidden sm:block absolute left-0 top-0 h-3 w-3 border-l-2 border-t-2 border-iba-sky/25 transition-colors group-hover:border-iba-navy"
        aria-hidden
      />
      <div
        className="hidden sm:block absolute right-0 top-0 h-3 w-3 border-r-2 border-t-2 border-iba-sky/25 transition-colors group-hover:border-iba-navy"
        aria-hidden
      />

      <div className="mb-2 sm:mb-4 lg:mb-6 flex items-start justify-between">
        <span className="max-w-full truncate rounded-full border border-iba-sky/10 bg-iba-navy/10 px-1.5 py-0.5 text-[6.5px] font-bold uppercase tracking-widest text-iba-navy transition-colors group-hover:text-iba-sky sm:px-2.5 sm:py-1 sm:text-[9px]">
          {badgeLabel}
        </span>
        <span className="hidden sm:inline-block text-[10px] text-iba-sky/20 transition-colors group-hover:text-iba-navy/50" aria-hidden>
          ⬢
        </span>
      </div>

      <div className="group/img relative mb-2 sm:mb-4 lg:mb-6 aspect-square w-full overflow-hidden rounded-md sm:rounded-lg border border-iba-sky/5 bg-iba-navy/[0.06] transition-colors group-hover:bg-iba-navy/10">
        <Image
          src={imageSrc}
          alt=""
          fill
          className="z-0 object-contain p-1 sm:p-2 drop-shadow-md transition-transform duration-300 ease-out group-hover/img:scale-105"
          sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 20vw"
        />

        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-iba-sky/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover/img:opacity-100"
          aria-hidden
        />

        <div
          className="pointer-events-none absolute bottom-3 left-1/2 z-[2] -translate-x-1/2 hidden sm:block opacity-0 transition-opacity duration-300 group-hover/img:opacity-100"
          aria-hidden
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-iba-sky/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg backdrop-blur-sm">
            <Maximize2 className="h-3.5 w-3.5" />
            Cliquer pour agrandir
          </span>
        </div>

        <button
          type="button"
          onClick={onView}
          className="absolute inset-0 z-[3] block h-full w-full cursor-zoom-in rounded-[inherit] border-0 bg-transparent p-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-iba-navy focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label={`Agrandir l'image : ${product.name}`}
        >
          <span className="sr-only">Ouvrir la vue agrandie</span>
        </button>
      </div>

      <h3 className="line-clamp-2 text-center font-sans text-[8.5px] font-black uppercase leading-tight tracking-tight text-iba-navy transition-colors group-hover:text-iba-sky sm:text-sm lg:text-lg">
        {product.name}
      </h3>

      <div
        className="absolute bottom-0 left-0 h-0.5 sm:h-1 w-0 bg-iba-sky transition-[width] duration-300 ease-out group-hover:w-full"
        aria-hidden
      />
    </article>
  );
});

// PAGINATION CONSTANTS
const ITEMS_PER_PAGE = 15;

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState<ProductCategoryId | "all">("all");
  const [activeSubcategory, setActiveSubcategory] = useState<ProductSubcategoryId | null>(null);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const productsTopRef = useRef<HTMLDivElement>(null);
  const skipInitialScrollRef = useRef(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeSubcategories = useMemo(
    () =>
      activeCategory !== "all" && categoryHasSubcategories(activeCategory)
        ? getSubcategoriesForCategory(activeCategory)
        : [],
    [activeCategory],
  );

  const filteredProducts = useMemo(() => {
    let products =
      activeCategory === "all"
        ? allProducts
        : allProducts.filter((p) => p.categoryId === activeCategory);

    if (activeSubcategory) {
      products = products.filter((p) => p.subcategoryId === activeSubcategory);
    }

    return products;
  }, [activeCategory, activeSubcategory]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const currentProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handleCategoryChange = useCallback((category: ProductCategoryId | "all") => {
    setActiveCategory(category);
    setCurrentPage(1); // Reset page on category change

    if (category !== "all" && categoryHasSubcategories(category)) {
      const subs = getSubcategoriesForCategory(category);
      setActiveSubcategory(subs[0]?.id ?? null);
      return;
    }

    setActiveSubcategory(null);
  }, []);

  useEffect(() => {
    if (activeSubcategories.length === 0) {
      if (activeSubcategory !== null) {
        setActiveSubcategory(null);
        setCurrentPage(1); // Reset page
      }
      return;
    }

    const isValid =
      activeSubcategory !== null &&
      activeSubcategories.some((sub) => sub.id === activeSubcategory);

    if (!isValid) {
      setActiveSubcategory(activeSubcategories[0].id);
      setCurrentPage(1); // Reset page
    } else {
       // Also reset page if subcategory is manually changed
       setCurrentPage(1);
    }
  }, [activeSubcategories, activeSubcategory]); // Note: In a real app, you might want to break apart the dependency so it doesn't reset on initial load if not needed, but this works safely.

  // Helper for pagination button clicks
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    scrollToProductsTop(productsTopRef.current);
  };

  const viewerProduct = viewerIndex !== null ? filteredProducts[viewerIndex] : null;

  const openViewer = useCallback((indexInCurrentPage: number) => {
    // We need to map the index from the current page view back to the global filtered array index
    const globalIndex = (currentPage - 1) * ITEMS_PER_PAGE + indexInCurrentPage;
    setViewerIndex(globalIndex);
  }, [currentPage]);

  const closeViewer = useCallback(() => {
    setViewerIndex(null);
  }, []);

  const goToPrev = useCallback(() => {
    setViewerIndex((current) => (current !== null && current > 0 ? current - 1 : current));
  }, []);

  const goToNext = useCallback(() => {
    setViewerIndex((current) =>
      current !== null && current < filteredProducts.length - 1 ? current + 1 : current,
    );
  }, [filteredProducts.length]);

  useEffect(() => {
    if (viewerIndex !== null && viewerIndex >= filteredProducts.length) {
      setViewerIndex(filteredProducts.length > 0 ? filteredProducts.length - 1 : null);
    }
  }, [filteredProducts.length, viewerIndex]);

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
  }, [activeCategory, activeSubcategory]);

  return (
    <main className="flex min-h-[100dvh] md:min-h-screen flex-col bg-background selection:bg-iba-navy selection:text-white">
      
      {/* 1. Hero */}
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
              className="absolute -left-6 -top-10 -z-10 select-none text-[6rem] font-black leading-none text-white/[0.06] sm:text-[8rem] md:-left-10 md:-top-16 md:text-[12rem]"
              aria-hidden
            >
              MAT
            </div>

            <div className="mb-4 sm:mb-6 flex items-center gap-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 sm:px-4 sm:py-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-iba-sky shadow-[0_0_8px_rgba(40,37,97,0.5)]" />
                PRODUITS
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-iba-sky/35 to-transparent" aria-hidden />
            </div>

            <h1 className="mt-4 text-4xl font-black uppercase leading-[0.95] tracking-tighter text-white sm:text-6xl md:text-8xl">
              Catalogue{" "}
              <span className="text-iba-sky">produits</span>
            </h1>
            <p className="mt-6 sm:mt-8 max-w-2xl border-l-2 border-iba-sky pl-4 sm:pl-6 text-sm sm:text-lg font-medium leading-relaxed text-white/85 md:text-xl">
              Une sélection rigoureuse de matériaux de construction de première qualité. Du gros œuvre aux finitions spécialisées, nous équipons vos chantiers avec les standards internationaux.
            </p>
          </motion.div>
        </div>
        <SectionWave edge="bottom" fillClassName="fill-background" heightClassName="h-10 sm:h-12 md:h-16" />
      </section>

      {/* 2. Catalogue */}
      <section
        id="catalog-content"
        className="scroll-mt-24 relative min-h-[50vh] bg-background py-8 sm:py-10 md:py-16 lg:py-20"
      >
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 0 0, var(--iba-sky) 1px, transparent 2px)`,
            backgroundSize: "40px 40px",
          }}
          aria-hidden
        />

        <div className="relative z-10 mx-auto max-w-[90rem] px-3 sm:px-8 md:px-16 lg:px-20">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10 xl:gap-12">
            {/* Sidebar filtres */}
            <nav
              aria-label="Filtrer par catégorie"
              className="shrink-0 lg:sticky lg:top-24 lg:w-[min(100%,15.5rem)] xl:w-64"
            >
              <p className="mb-3 pl-1 sm:pl-0 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-iba-sky/45">
                Catégories
              </p>
              <div className="grid grid-cols-2 gap-1.5 sm:gap-2 border-b border-iba-sky/10 pb-5 sm:grid-cols-3 lg:flex lg:flex-col lg:border-b-0 lg:border-r lg:border-iba-sky/10 lg:pb-0 lg:pr-6 xl:pr-8">
                <button
                  type="button"
                  onClick={() => handleCategoryChange("all")}
                  className={cn(
                    "flex w-full items-center justify-center lg:justify-start rounded-lg border px-1.5 py-2.5 sm:px-2 sm:py-3 text-center lg:text-left text-[9px] sm:text-[11px] font-bold uppercase tracking-wide transition-all",
                    activeCategory === "all"
                      ? "border-iba-sky bg-iba-sky text-white shadow-md shadow-iba-sky/15"
                      : "border-iba-sky/12 bg-white text-iba-navy hover:border-iba-navy/45 hover:text-iba-sky",
                  )}
                >
                  Tous les produits
                </button>
                {productCategories.map((cat) => (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={cn(
                      "flex w-full items-center justify-center lg:justify-start rounded-lg border px-1.5 py-2.5 sm:px-2 sm:py-3 text-center lg:text-left text-[9px] sm:text-[11px] font-bold uppercase tracking-wide transition-all",
                      activeCategory === cat.id
                        ? "border-iba-navy bg-iba-navy text-white shadow-md shadow-iba-navy/20"
                        : "border-iba-sky/12 bg-white text-iba-navy hover:border-iba-navy/45 hover:text-iba-sky",
                    )}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </nav>

            {/* Contenu */}
            <div ref={productsTopRef} className="min-w-0 flex-1 scroll-mt-28">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.18, ease: [0.25, 1, 0.5, 1] as const }}
                  className="mb-6 flex items-start gap-3 sm:gap-4 border-l-4 border-iba-sky bg-iba-navy/10 p-4 ring-1 ring-iba-sky/5 sm:p-6 lg:mb-10"
                >
                  <Boxes className="h-5 w-5 sm:h-6 sm:w-6 shrink-0 text-iba-sky" aria-hidden />
                  <div>
                    <h2 className="text-sm sm:text-base font-bold uppercase tracking-tight text-iba-navy">
                      {activeCategory === "all"
                        ? "Inventaire complet"
                        : productCategories.find((c) => c.id === activeCategory)?.label}
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm font-medium text-iba-sky/70">
                      {activeCategory === "all"
                        ? "Parcourez l'intégralité de nos références disponibles en stock."
                        : productCategories.find((c) => c.id === activeCategory)?.description}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {activeSubcategories.length > 0 ? (
                <div className="mb-5 flex flex-wrap gap-1.5 sm:gap-2 lg:mb-8">
                  {activeSubcategories.map((sub) => (
                    <button
                      type="button"
                      key={sub.id}
                      onClick={() => {
                        setActiveSubcategory(sub.id);
                        setCurrentPage(1); // Reset page when subcategory changes
                      }}
                      className={cn(
                        "rounded-full border px-2.5 py-1 sm:px-3 sm:py-1.5 text-[8px] sm:text-[10px] font-bold uppercase tracking-wide transition-all",
                        activeSubcategory === sub.id
                          ? "border-iba-navy bg-iba-navy text-white shadow-sm shadow-iba-navy/15"
                          : "border-iba-sky/15 bg-white text-iba-navy hover:border-iba-navy/40 hover:text-iba-sky",
                      )}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              ) : null}

              {/* Grid renders currentProducts instead of filteredProducts */}
              <div className="grid grid-cols-3 gap-1.5 sm:gap-5 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {currentProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onView={() => openViewer(index)}
                    showSubcategory={activeSubcategories.length > 0}
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2 sm:mt-14">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-iba-sky/20 bg-white text-iba-navy transition-colors disabled:cursor-not-allowed disabled:opacity-50 hover:bg-iba-sky/10"
                    aria-label="Page précédente"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  
                  <div className="flex items-center gap-1 sm:gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={cn(
                          "flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full text-[10px] sm:text-xs font-bold transition-colors",
                          currentPage === page
                            ? "bg-iba-navy text-white shadow-md"
                            : "bg-transparent text-iba-navy hover:bg-iba-sky/10"
                        )}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-iba-sky/20 bg-white text-iba-navy transition-colors disabled:cursor-not-allowed disabled:opacity-50 hover:bg-iba-sky/10"
                    aria-label="Page suivante"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}

              {filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center lg:py-24">
                  <PackageSearch className="mb-3 sm:mb-4 h-12 w-12 sm:h-16 sm:w-16 text-iba-navy/40" aria-hidden />
                  <p className="text-lg sm:text-xl font-bold uppercase text-iba-sky">Aucun produit trouvé</p>
                  <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-iba-sky/60">Veuillez sélectionner une autre catégorie.</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* 3. CTA */}
      <section className="relative overflow-hidden border-t border-white/20 bg-iba-navy py-16 sm:py-20 text-center text-white">
        <div className="pointer-events-none absolute right-1/4 top-0 z-0 h-[300px] w-[300px] sm:h-[400px] sm:w-[400px] rounded-full bg-white/[0.08] blur-[100px]" aria-hidden />
        <div className="relative z-10 mx-auto max-w-3xl px-5">
          <h2 className="mb-4 sm:mb-6 text-2xl font-black uppercase tracking-tight sm:text-3xl md:text-5xl">
            Commandes en gros &{" "}
            <span className="text-iba-sky">devis</span>
          </h2>
          <p className="mb-8 sm:mb-10 text-sm sm:text-lg font-medium text-white/90">
            Besoin de grandes quantités pour votre chantier ? Contactez notre équipe commerciale pour obtenir une tarification adaptée et organiser la logistique.
          </p>
          <Link
            href="/quotation"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-iba-orange px-6 py-3 sm:px-8 sm:py-4 text-xs sm:text-sm font-bold uppercase tracking-widest text-white shadow-lg shadow-iba-orange/25 transition-all hover:bg-white hover:text-iba-orange"
          >
            <span className="relative z-10 flex items-center">
              Demander un devis
              <ArrowRight className="ml-2 sm:ml-3 h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Link>
        </div>
        <SectionWave edge="top" fillClassName="fill-background" heightClassName="h-6 sm:h-8 md:h-12" />
      </section>

      {mounted
        ? createPortal(
            <AnimatePresence>
              {viewerProduct && viewerIndex !== null ? (
                <ProductViewer
                  key="product-viewer"
                  product={viewerProduct}
                  index={viewerIndex}
                  total={filteredProducts.length}
                  onClose={closeViewer}
                  onPrev={goToPrev}
                  onNext={goToNext}
                  hasPrev={viewerIndex > 0}
                  hasNext={viewerIndex < filteredProducts.length - 1}
                />
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </main>
  );
}

