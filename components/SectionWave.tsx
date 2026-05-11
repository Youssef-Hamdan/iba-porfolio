"use client";

import type { RefObject } from "react";
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
 * Wave path driven by intensity in [0, 1]: always curved (never flat).
 * 0 = shallow wave, 0.5 = symmetrical standard curve, 1 = deep / dramatic scoop (max scroll).
 */
export function getSectionWavePath(intensity: number): string {
  const u = Math.max(0, Math.min(1, intensity));

  // Using a symmetric quadratic bezier (Q) to center the curve exactly at x = 720.
  const soft = { edgeY: 60, cy: 45 };
  const brand = { edgeY: 75, cy: -5 };
  const peak = { edgeY: 115, cy: -115 };

  let edgeY: number;
  let cy: number;

  if (u < 0.5) {
    const t = u / 0.5;
    edgeY = soft.edgeY + (brand.edgeY - soft.edgeY) * t;
    cy = soft.cy + (brand.cy - soft.cy) * t;
  } else {
    const t = (u - 0.5) / 0.5;
    edgeY = brand.edgeY + (peak.edgeY - brand.edgeY) * t;
    cy = brand.cy + (peak.cy - brand.cy) * t;
  }

  return `M0 0H1440V${edgeY}Q720 ${cy} 0 ${edgeY}V0Z`;
}

/** Default static path (legacy IBA shape, matches intensity 0.5) */
export const SECTION_WAVE_PATH = getSectionWavePath(0.5);

type SectionWaveProps = {
  /** Bottom edge (default, same as hero) or top edge of the `relative` parent */
  edge?: "bottom" | "top";
  fillClassName?: string;
  className?: string;
  /**
   * Tailwind height on the wave strip.
   * Bottom: applied to `<svg>` (omit = intrinsic height from width).
   * Top: applied to the wrapper so lift (`-translate-y-full`) is correct.
   */
  heightClassName?: string;
  /**
   * When set, scroll-driven wave depth uses this element (e.g. parent `section`)
   * instead of the wave node — use for top waves so the bump grows as the section approaches.
   */
  scrollTargetRef?: RefObject<HTMLElement | null>;
  /** Passed to `useScroll({ offset })` when driving morph from `scrollTargetRef` (or overrides default). */
  scrollOffset?: [string, string];
};

function MorphWavePath({
  dMotion,
  className,
}: {
  dMotion: MotionValue<string>;
  className?: string;
}) {
  const [d, setD] = useState(SECTION_WAVE_PATH);

  useMotionValueEvent(dMotion, "change", setD);
  useLayoutEffect(() => {
    setD(dMotion.get());
  }, [dMotion]);

  return <path d={d} className={className} />;
}

const SCROLL_SPRING = { stiffness: 200, damping: 28, mass: 0.22 };

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

/**
 * Full-width IBA wave divider (navy accent by default). Parent must be `position: relative`.
 * Scroll: wave stays curved; curvature increases as the divider moves up through the viewport.
 */
export function SectionWave({
  edge = "bottom",
  fillClassName = "fill-iba-navy",
  className,
  heightClassName,
  scrollTargetRef,
  scrollOffset,
}: SectionWaveProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const scrollTarget = scrollTargetRef ?? ref;
  const resolvedOffset: [string, string] =
    scrollOffset ??
    (scrollTargetRef ? ["start 0.92", "start 0.18"] : ["start 0.95", "start 0.1"]);

  const { scrollYProgress } = useScroll({
    target: scrollTarget,
    offset: resolvedOffset as never,
  });

  /** Map viewport progress → morph intensity. */
  const drive = useTransform(scrollYProgress, (p) =>
    scrollTargetRef
      ? clamp01((p - 0.03) / 0.55)
      : clamp01((p - 0.02) / 0.42),
  );

  const stiffSpring = { stiffness: 8000, damping: 120, mass: 0.2 };
  const smoothed = useSpring(drive, reduceMotion ? stiffSpring : SCROLL_SPRING);

  const pathMotion = useTransform(smoothed, (p) =>
    getSectionWavePath(reduceMotion ? 0.5 : p),
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
          className={cn("block w-full rotate-180", heightClassName)}
        >
          <MorphWavePath dMotion={pathMotion} className={fillClassName} />
        </svg>
      </div>
    );
  }

  const topBand = heightClassName ?? "h-14 md:h-20";

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
        className="h-full w-full -scale-y-100"
      >
        <MorphWavePath dMotion={pathMotion} className={fillClassName} />
      </svg>
    </div>
  );
}
