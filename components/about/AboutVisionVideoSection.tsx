"use client";

import { useEffect, useRef, useState } from "react";
import { useSiteReady } from "@/components/site-ready-context";
import { ABOUT_VISION_VIMEO_EMBED_URL, VIMEO_PLAYER_SCRIPT_URL } from "@/lib/about-vision-vimeo";

/**
 * Chromeless Vimeo (`controls=0`, `loop=1`). Préchargement global (`AboutVideoWarmup` + écran d’accueil) ;
 * ici on monte l’iframe dès que le site est prêt ou à l’approche du viewport.
 */
type VimeoPlayerApi = {
  ready(): Promise<void>;
  play(): Promise<void>;
  pause(): Promise<void>;
  destroy(): void;
};

function whenIframeLoaded(iframe: HTMLIFrameElement): Promise<void> {
  return new Promise((resolve) => {
    iframe.addEventListener("load", () => resolve(), { once: true });
    window.setTimeout(resolve, 4000);
  });
}

function getVimeoPlayerCtor(): (new (el: HTMLIFrameElement) => VimeoPlayerApi) | null {
  if (typeof window === "undefined") return null;
  const Vimeo = (window as unknown as { Vimeo?: { Player: new (el: HTMLIFrameElement) => VimeoPlayerApi } })
    .Vimeo;
  return Vimeo?.Player ?? null;
}

function ensureVimeoPlayerScript(onReady: () => void): void {
  const w = window as Window & { Vimeo?: { Player?: unknown } };
  if (w.Vimeo?.Player) {
    onReady();
    return;
  }
  const existing = document.querySelector(
    `script[src="${VIMEO_PLAYER_SCRIPT_URL}"]`,
  ) as HTMLScriptElement | null;
  if (existing) {
    existing.addEventListener("load", onReady, { once: true });
    existing.addEventListener("error", onReady, { once: true });
    return;
  }
  const s = document.createElement("script");
  s.src = VIMEO_PLAYER_SCRIPT_URL;
  s.async = true;
  s.onload = onReady;
  s.onerror = onReady;
  document.head.appendChild(s);
}

export function AboutVisionVideoSection() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<VimeoPlayerApi | null>(null);
  const siteReady = useSiteReady();
  const [vimeoScriptReady, setVimeoScriptReady] = useState(false);
  const [embedActive, setEmbedActive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [playerBound, setPlayerBound] = useState(false);

  useEffect(() => {
    ensureVimeoPlayerScript(() => setVimeoScriptReady(true));
  }, []);

  useEffect(() => {
    if (siteReady) setEmbedActive(true);
  }, [siteReady]);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const prefetchObs = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (e?.isIntersecting) setEmbedActive(true);
      },
      { threshold: 0, rootMargin: "120px 0px" },
    );

    const playbackObs = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        setIsVisible(Boolean(e?.isIntersecting));
      },
      { threshold: 0, rootMargin: "0px" },
    );

    prefetchObs.observe(el);
    playbackObs.observe(el);
    return () => {
      prefetchObs.disconnect();
      playbackObs.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!vimeoScriptReady || !embedActive) return;
    let cancelled = false;
    const iframe = iframeRef.current;
    const PlayerCtor = getVimeoPlayerCtor();
    if (!iframe || !PlayerCtor) return;

    void (async () => {
      await whenIframeLoaded(iframe);
      if (cancelled) return;
      try {
        const player = new PlayerCtor(iframe);
        await player.ready();
        if (cancelled) {
          try {
            player.destroy();
          } catch {
            /* ignore */
          }
          return;
        }
        playerRef.current = player;
        setPlayerBound(true);
      } catch {
        if (!cancelled) setPlayerBound(false);
      }
    })();

    return () => {
      cancelled = true;
      try {
        playerRef.current?.destroy();
      } catch {
        /* ignore */
      }
      playerRef.current = null;
      setPlayerBound(false);
    };
  }, [vimeoScriptReady, embedActive]);

  useEffect(() => {
    const player = playerRef.current;
    if (!playerBound || !player) return;
    if (isVisible) {
      void player.play().catch(() => {});
    } else {
      void player.pause().catch(() => {});
    }
  }, [isVisible, playerBound]);

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
        ref={viewportRef}
        className="relative z-10 aspect-video w-full min-w-0 overflow-hidden bg-black border-y border-iba-sky/15 shadow-[0_24px_60px_-24px_rgba(40,37,97,0.25)]"
      >
        {embedActive ? (
          <iframe
            ref={iframeRef}
            src={ABOUT_VISION_VIMEO_EMBED_URL}
            title="IBA FAMECO SCREEN EMPIRE"
            className="pointer-events-none absolute inset-0 h-full w-full border-0"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : null}
      </div>
    </section>
  );
}
