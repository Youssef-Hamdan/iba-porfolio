"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

const LOGO_SRC = "/images/logo/iba-logo-horiz.png";

/**
 * Horizontal logo: visible size is driven by HEIGHT (`h-*`) + `w-auto`.
 * Do not rely on a wide empty box + `fill` — for wide assets, `object-contain`
 * stops scaling once height is filled, so bumping width alone looks unchanged.
 */
const INTRINSIC_W = 1600;
const INTRINSIC_H = 380;

export function BrandLogo({
  className,
  priority,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={LOGO_SRC}
      alt="International Business Alliance"
      width={INTRINSIC_W}
      height={INTRINSIC_H}
      className={cn(
        "h-16 w-auto max-w-[calc(100vw-5.5rem)] object-contain object-left sm:h-[4.75rem] md:h-[5.25rem] lg:h-24 xl:h-[6.25rem]",
        className
      )}
      priority={priority}
      sizes="(max-width: 640px) min(calc(100vw - 5.5rem), 480px), (max-width: 1024px) 640px, 900px"
    />
  );
}
