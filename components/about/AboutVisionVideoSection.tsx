"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { loadYoutubeIframeAPI, type YTPlayerInstance } from "@/lib/youtube-iframe-api";

const SCROLL_SPRING = { stiffness: 120, damping: 32, mass: 0.35 };
const STIFF_SPRING = { stiffness: 8000, damping: 120, mass: 0.2 };

export function AboutVisionVideoSection() {
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const reduceMotion = useReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  const playerHostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayerInstance | null>(null);

  // ---> INSERT YOUR IBA YOUTUBE VIDEO ID HERE <---
  // If you don't have one yet, it will use the factory desktop video temporarily.
  const videoId = "CijA6Ql2RgE";

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"],
  });

  // Spring + transform (not width) — avoids layout thrash with the YouTube iframe.
  const smoothed = useSpring(
    scrollYProgress,
    reduceMotion ? STIFF_SPRING : SCROLL_SPRING,
  );
  const videoScale = useTransform(smoothed, [0, 1], [0.78, 1]);

  useEffect(() => {
    let cancelled = false;
    if (!playerHostRef.current) return;

    const host = playerHostRef.current;
    host.replaceChildren();

    const mount = document.createElement("div");
    mount.style.width = "100%";
    mount.style.height = "100%";
    host.appendChild(mount);

    void loadYoutubeIframeAPI().then(() => {
      if (cancelled) return;
      const YT = window.YT;
      if (!YT?.Player) return;

      new YT.Player(mount, {
        videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          cc_load_policy: 0,
          mute: 1, // Must be muted to autoplay in background
          loop: 1,
          playlist: videoId, // Required by YT API to loop a single video
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
        },
        events: {
          onReady: (e: { target: YTPlayerInstance }) => {
            if (cancelled) return;
            playerRef.current = e.target;
            try {
              e.target.unloadModule("captions");
              e.target.unloadModule("cc");
              e.target.setOption("captions", "track", {});
            } catch {
              /* captions API not always available */
            }
            setIsPlayerReady(true);
          },
        },
      });
    });

    return () => {
      cancelled = true;
      try {
        playerRef.current?.destroy();
      } catch {
        /* ignore */
      }
      playerRef.current = null;
      setIsPlayerReady(false);
    };
  }, [videoId]);

  // Handle Play/Pause based on Intersection (Scroll Visibility)
  useEffect(() => {
    if (!isPlayerReady || !sectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const isVisible = entries[0]?.isIntersecting;
        const player = playerRef.current;
        if (!player) return;

        if (isVisible) {
          player.playVideo();
        } else {
          player.pauseVideo();
        }
      },
      // Root margin triggers playback slightly before it scrolls into view
      { threshold: 0, rootMargin: "400px 0px 400px 0px" }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [isPlayerReady]);

  return (
    <section
      ref={sectionRef}
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

      <motion.div
        className="relative z-10 mx-auto aspect-video w-full min-w-0 overflow-hidden rounded-none border border-iba-sky/15 bg-white shadow-[0_24px_60px_-24px_rgba(40,37,97,0.25)] will-change-transform [transform:translateZ(0)]"
        style={{ scale: videoScale }}
      >
        <div
          ref={playerHostRef}
          className="relative z-10 h-full w-full pointer-events-none [&_iframe]:absolute [&_iframe]:inset-0 [&_iframe]:h-full [&_iframe]:w-full [&_iframe]:border-0"
        />
      </motion.div>
    </section>
  );
}
