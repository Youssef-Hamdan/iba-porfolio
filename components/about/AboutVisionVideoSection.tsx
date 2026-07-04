"use client";

import { useVimeoVisionSlot } from "@/components/vimeo-vision/VimeoVisionProvider";
import { cn } from "@/lib/utils";

export function AboutVisionVideoSection() {
  // Grab the actual playing state from the provider
  const { setSlotElement, isActuallyPlaying } = useVimeoVisionSlot();

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

      <div className="relative z-10 mx-auto aspect-video max-w-full min-w-0 overflow-hidden bg-white border border-iba-sky/15 shadow-[0_24px_60px_-24px_rgba(40,37,97,0.25)]">
        
        {/* 1. The Thumbnail Layer */}
        <div 
          className={cn(
            "absolute inset-0 z-20 transition-opacity duration-700 ease-in-out",
            // The thumbnail only disappears once the video timeline is moving
            isActuallyPlaying ? "opacity-0 pointer-events-none" : "opacity-100"
          )}
        >
          <img
            src="/images/iba-video-thumbnail.jpg"
            alt="IBA Vision Video Thumbnail"
            className="h-full w-full object-cover"
          />
        </div>

        {/* 2. The Video Slot */}
        <div
          ref={setSlotElement}
          className="relative z-10 h-full w-full"
        />
      </div>
    </section>
  );
}