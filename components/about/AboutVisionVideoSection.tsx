"use client";

import { useVimeoVisionSlot } from "@/components/vimeo-vision/VimeoVisionProvider";

/**
 * Slot pour le lecteur Vimeo global (`VimeoVisionProvider`) : un seul iframe,
 * préchargé hors page puis déplacé ici → lecture quasi instantanée.
 */
export function AboutVisionVideoSection() {
  const { setSlotElement } = useVimeoVisionSlot();

  return (
    <section
      className="relative overflow-x-hidden border-b border-iba-sky/10 bg-background py-16 md:py-24 lg:py-28"
      aria-label="Vidéo de présentation"
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle at 0 0, var(--iba-sky) 1px, transparent 2px)`,
          backgroundSize: "40px 40px",
        }}
        aria-hidden
      />

      <div
        ref={setSlotElement}
        className="relative z-10 mx-auto aspect-video  max-w-full min-w-0 overflow-hidden bg-white border border-iba-sky/15 shadow-[0_24px_60px_-24px_rgba(40,37,97,0.25)]"
      />
    </section>
  );
}
