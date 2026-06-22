"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type ParallaxImageBlockProps = {
  src?: string;
  images?: string[];
  title: string;
  titleNode?: React.ReactNode;
  desc: string;
  /** 1-based index among sibling blocks (for “01 / 03” style kickers) */
  index?: number;
  total?: number;
};

const AUTO_SWIPE_MS = 3000;

export function ParallaxImageBlock({
  src,
  images,
  title,
  titleNode,
  desc,
  index,
  total = 3,
}: ParallaxImageBlockProps) {
  const ref = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Swipe gesture states
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const slides = images ?? (src ? [src] : []);
  const hasCarousel = slides.length > 1;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

  const goTo = useCallback(
    (nextIndex: number) => {
      if (slides.length === 0) return;
      setActiveIndex((nextIndex + slides.length) % slides.length);
    },
    [slides.length],
  );

  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  // Touch handlers for mobile swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchEndX(null); // Reset end position on new touch
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return;
    
    const distance = touchStartX - touchEndX;
    const minSwipeDistance = 50; // Minimum distance in pixels to trigger a swipe

    if (distance > minSwipeDistance) {
      goNext(); // Swiped left
    } else if (distance < -minSwipeDistance) {
      goPrev(); // Swiped right
    }

    // Reset touch coordinates
    setTouchStartX(null);
    setTouchEndX(null);
  };

  useEffect(() => {
    if (!hasCarousel || isPaused) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, AUTO_SWIPE_MS);

    return () => window.clearInterval(timer);
  }, [hasCarousel, isPaused, slides.length]);

  useEffect(() => {
    if (!hasCarousel) return;

    slides.forEach((slide) => {
      const preload = new window.Image();
      preload.src = slide;
    });
  }, [hasCarousel, slides]);

  const kicker =
    typeof index === "number"
      ? `${String(index).padStart(2, "0")} — ${String(total).padStart(2, "0")}`
      : null;

  return (
    <div
      ref={ref}
      className="group relative h-[min(72dvh,520px)] md:h-[min(70vh,560px)] w-full min-h-[400px] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
      // Add touch event listeners to the main container
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <motion.div
        className="absolute inset-0 -top-[20%] z-0 h-[140%] w-full bg-iba-navy"
        style={{ y: imageY }}
      >
        {slides.map((slide, slideIndex) => (
          <div
            key={slide}
            className={cn(
              "absolute inset-0 transition-opacity duration-700 ease-out",
              slideIndex === activeIndex ? "opacity-100" : "opacity-0",
            )}
            aria-hidden={slideIndex !== activeIndex}
          >
            <Image
              src={slide}
              alt={slideIndex === activeIndex ? title : ""}
              fill
              className="object-cover"
              sizes="100vw"
              priority={hasCarousel || (index === 1 && slideIndex === 0)}
              draggable={false} // Prevents default image drag interference on some devices
            />
          </div>
        ))}
      </motion.div>

      {/* Readability: darken image */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-tr from-iba-navy/100 via-iba-navy/20 to-iba-navy/15"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-black/55 via-transparent to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-[3] bg-gradient-to-tr from-iba-navy/25 to-transparent mix-blend-soft-light opacity-80"
        aria-hidden
      />

      {hasCarousel ? (
        <>
          {/* Hiding Arrows on Mobile (hidden md:flex) */}
          <button
            type="button"
            onClick={goPrev}
            className="hidden absolute left-4 top-1/2 z-20 md:flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-iba-navy/45 text-white backdrop-blur-sm transition-all hover:border-white/50 hover:bg-iba-navy/70 md:left-8"
            aria-label="Image précédente"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={2.5} />
          </button>
          <button
            type="button"
            onClick={goNext}
            className="hidden absolute right-4 top-1/2 z-20 md:flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-iba-navy/45 text-white backdrop-blur-sm transition-all hover:border-white/50 hover:bg-iba-navy/70 md:right-8"
            aria-label="Image suivante"
          >
            <ChevronRight className="h-5 w-5" strokeWidth={2.5} />
          </button>

          <div className="absolute bottom-6 right-5 z-20 flex items-center gap-2 md:bottom-8 md:right-16 lg:right-20">
            {slides.map((slide, slideIndex) => (
              <button
                key={slide}
                type="button"
                onClick={() => setActiveIndex(slideIndex)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  slideIndex === activeIndex ? "w-7 bg-iba-sky" : "w-1.5 bg-white/40 hover:bg-white/70",
                )}
                aria-label={`Afficher l'image ${slideIndex + 1}`}
                aria-current={slideIndex === activeIndex}
              />
            ))}
          </div>
        </>
      ) : null}

      <div className="relative z-10 mx-auto grid h-full w-full max-w-[90rem] grid-cols-1 grid-rows-[1fr_auto] px-5 pb-10 pt-6 sm:px-8 md:grid-cols-3 md:grid-rows-3 md:px-16 md:pb-14 md:pt-0 lg:px-20 lg:pb-16 pointer-events-none">
        <div
          className="hidden min-h-0 md:col-span-2 md:row-start-1 md:block"
          aria-hidden
        />

        {/* Note: pointer-events-auto added here so text selection/links inside still work if you add them later */}
        <div className="col-start-1 row-start-2 flex min-w-0 flex-col justify-end gap-4 md:col-span-2 md:col-start-1 md:row-span-2 md:row-start-2 lg:gap-5 pointer-events-auto">
          {kicker ? (
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/55">{kicker}</p>
          ) : null}
          <div className="flex max-w-xl flex-col gap-3 md:max-w-2xl lg:max-w-[42rem]">
            <h3 className="text-balance text-3xl font-extrabold uppercase leading-[1.1] tracking-tight text-white drop-shadow-md md:text-4xl lg:text-5xl">
              {titleNode || title}
            </h3>
            <p className="text-pretty text-base font-medium leading-relaxed text-white/90 md:text-lg">
              {desc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}