"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

type ParallaxImageBlockProps = {
  src: string;
  title: string;
  titleNode?: React.ReactNode;
  desc: string;
  /** 1-based index among sibling blocks (for “01 / 03” style kickers) */
  index?: number;
  total?: number;
};

export function ParallaxImageBlock({
  src,
  title,
  titleNode,
  desc,
  index,
  total = 3,
}: ParallaxImageBlockProps) {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

  const kicker =
    typeof index === "number"
      ? `${String(index).padStart(2, "0")} — ${String(total).padStart(2, "0")}`
      : null;

  return (
    <div ref={ref} className="group relative h-[min(72vh,520px)] w-full min-h-[400px] overflow-hidden md:h-[min(70vh,560px)]">
      <motion.div className="absolute inset-0 -top-[20%] z-0 h-[140%] w-full" style={{ y: imageY }}>
        <Image src={src} alt={title} fill className="object-cover" sizes="100vw" priority={index === 1} />
      </motion.div>

      {/* Readability: darken image (esp. under copy in lower-left third) */}
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

      {/*
        Rule of thirds (md+): 3×3 grid — copy in left 2 columns, bottom 2 rows (lower-left focal area).
        Mobile: two-row grid (1fr + auto) so text sits on the bottom without an empty top band.
      */}
      <div className="relative z-10 mx-auto grid h-full w-full max-w-[90rem] grid-cols-1 grid-rows-[1fr_auto] px-5 pb-10 pt-6 sm:px-8 md:grid-cols-3 md:grid-rows-3 md:px-16 md:pb-14 md:pt-0 lg:px-20 lg:pb-16">
        <div
          className="hidden min-h-0 md:col-span-2 md:row-start-1 md:block"
          aria-hidden
        />

        <div className="col-start-1 row-start-2 flex min-w-0 flex-col justify-end gap-4 md:col-span-2 md:col-start-1 md:row-span-2 md:row-start-2 lg:gap-5">
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
