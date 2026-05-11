"use client";

import { useLayoutEffect, useRef, useState } from "react";
import {
  type MotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Full-width symmetric bump: same height at x=0 and x=1440, smooth arch in the middle
 * (edge-anchored curve, not a semicircle). intensity in [0, 1] grows the bump.
 */
export function getSectionBumpPath(intensity: number): string {
  const u = Math.max(0, Math.min(1, intensity));

  // DRAMATIC EFFECT: 
  // u=0 -> Completely flat line at the bottom (120)
  // u=1 -> Sides lift slightly to 80, but the center peaks massively to -60
  const sideY = 120 - u * 40;  
  const peakY = 120 - u * 180; 

  return `M0 120L0 ${sideY}Q720 ${peakY} 1440 ${sideY}L1440 120H0Z`;
}

// Default state is completely flat
export const SECTION_BUMP_PATH = getSectionBumpPath(0);

type SectionHalfCircleProps = {
  edge?: "bottom" | "top";
  fillClassName?: string;
  className?: string;
  heightClassName?: string;
};

function MorphBumpPath({
  dMotion,
  className,
}: {
  dMotion: MotionValue<string>;
  className?: string;
}) {
  const [d, setD] = useState(SECTION_BUMP_PATH);

  useMotionValueEvent(dMotion, "change", setD);
  useLayoutEffect(() => {
    setD(dMotion.get());
  }, [dMotion]);

  return <path d={d} className={className} />;
}

// Looser spring for a more fluid, elastic, noticeable follow-through
const SCROLL_SPRING = { stiffness: 120, damping: 20, mass: 0.5 };

export function SectionHalfCircle({
  edge = "top",
  fillClassName = "fill-iba-navy",
  className,
  heightClassName,
}: SectionHalfCircleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    // Animation starts when the top of the element hits 95% of viewport
    // Animation finishes when the top hits 25% of viewport
    offset: ["start 0.95", "start 0.25"],
  });

  // Map the scroll progress directly to the intensity (0 to 1) without artificial clamping gaps
  const drive = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const stiffSpring = { stiffness: 8000, damping: 120, mass: 0.2 };
  const smoothed = useSpring(drive, reduceMotion ? stiffSpring : SCROLL_SPRING);

  const pathMotion = useTransform(smoothed, (p) =>
    getSectionBumpPath(reduceMotion ? 1 : p),
  );

  if (edge === "bottom") {
    return (
      <div
        ref={ref}
        className={cn(
          "pointer-events-none absolute -bottom-px left-0 z-20 w-full select-none",
          className,
        )}
        aria-hidden
      >
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className={cn("block w-full rotate-180 transition-transform", heightClassName)}
        >
          <MorphBumpPath dMotion={pathMotion} className={fillClassName} />
        </svg>
      </div>
    );
  }

  // Increased default height band to accommodate the massive stretch
  const topBand = heightClassName ?? "h-20 md:h-32";

  return (
    <div
      ref={ref}
      className={cn(
        "pointer-events-none absolute left-0 right-0 top-0 z-20 w-full -translate-y-full select-none",
        topBand,
        className,
      )}
      aria-hidden
    >
      <svg
        viewBox="0 0 1440 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="h-full w-full"
      >
        <MorphBumpPath dMotion={pathMotion} className={fillClassName} />
      </svg>
    </div>
  );
}