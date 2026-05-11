"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSiteReady } from "@/components/site-ready-context";
import { ABOUT_VISION_VIMEO_WARMUP_EMBED_URL } from "@/lib/about-vision-vimeo";

/**
 * Après l’écran de chargement : iframe hors écran + prefetch `/about` pour que la vidéo
 * et la page soient prêtes avant la navigation vers À propos.
 */
export function AboutVideoWarmup() {
  const siteReady = useSiteReady();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!siteReady) return;
    router.prefetch("/about");
  }, [siteReady, router]);

  if (!siteReady || pathname === "/about") return null;

  return (
    <iframe
      src={ABOUT_VISION_VIMEO_WARMUP_EMBED_URL}
      title=""
      aria-hidden
      tabIndex={-1}
      className="pointer-events-none fixed top-0 left-[-9999px] z-0 h-[120px] w-[200px] opacity-0"
      allow="autoplay; encrypted-media"
    />
  );
}
