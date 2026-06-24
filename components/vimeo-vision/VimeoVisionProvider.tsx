"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSiteReady } from "@/components/site-ready-context";
import { ABOUT_VISION_VIMEO_EMBED_URL, ABOUT_VISION_VIMEO_TITLE, VIMEO_PLAYER_SCRIPT_URL } from "@/lib/about-vision-vimeo";

type VimeoPlayerApi = {
  ready(): Promise<void>;
  play(): Promise<void>;
  pause(): Promise<void>;
  destroy(): void;
};

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

type VimeoVisionContextValue = {
  setSlotElement: (el: HTMLDivElement | null) => void;
};

const VimeoVisionContext = createContext<VimeoVisionContextValue | null>(null);

export function useVimeoVisionSlot() {
  const ctx = useContext(VimeoVisionContext);
  if (!ctx) {
    throw new Error("useVimeoVisionSlot must be used within VimeoVisionProvider");
  }
  return ctx;
}

/**
 * Un seul iframe Vimeo pour toute l’app : créé après `siteReady`, lu hors écran pour buffer,
 * puis déplacé dans le slot À propos (même nœud DOM = pas de rechargement).
 */
export function VimeoVisionProvider({ children }: { children: React.ReactNode }) {
  const siteReady = useSiteReady();
  const pathname = usePathname();
  const router = useRouter();

  const holderRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const playerRef = useRef<VimeoPlayerApi | null>(null);
  const slotRef = useRef<HTMLDivElement | null>(null);
  const [slotNonce, setSlotNonce] = useState(0);
  const [scriptReady, setScriptReady] = useState(false);
  const [iframeReady, setIframeReady] = useState(false);
  const [playerBound, setPlayerBound] = useState(false);

  useEffect(() => {
    if (!siteReady) return;
    router.prefetch("/about");
  }, [siteReady, router]);

  useEffect(() => {
    if (!siteReady) return;
    ensureVimeoPlayerScript(() => setScriptReady(true));
  }, [siteReady]);

  useEffect(() => {
    if (!siteReady || !scriptReady || iframeRef.current) return;
    const holder = holderRef.current;
    if (!holder) return;

    const iframe = document.createElement("iframe");
    iframe.src = ABOUT_VISION_VIMEO_EMBED_URL;
    iframe.title = ABOUT_VISION_VIMEO_TITLE;
    iframe.className = "pointer-events-none absolute inset-0 h-full w-full border-0";
    iframe.allow = "autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share";
    iframe.referrerPolicy = "strict-origin-when-cross-origin";

    iframeRef.current = iframe;
    holder.appendChild(iframe);
    setIframeReady(true);

    let cancelled = false;
    void (async () => {
      await new Promise<void>((resolve) => {
        iframe.addEventListener("load", () => resolve(), { once: true });
        window.setTimeout(resolve, 4000);
      });
      if (cancelled) return;
      const Ctor = getVimeoPlayerCtor();
      if (!Ctor) return;
      try {
        const player = new Ctor(iframe);
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
      iframe.remove();
      iframeRef.current = null;
      setIframeReady(false);
      setPlayerBound(false);
    };
  }, [siteReady, scriptReady]);

  const setSlotElement = useCallback((el: HTMLDivElement | null) => {
    slotRef.current = el;
    setSlotNonce((n) => n + 1);
  }, []);

  /** Place l’iframe dans le slot À propos ou dans le holder ; pas de remount. */
  useEffect(() => {
    const iframe = iframeRef.current;
    const holder = holderRef.current;
    if (!iframe || !holder || !iframeReady) return;

    const slot = slotRef.current;
    const onAbout = pathname === "/about";

    if (onAbout && slot) {
      slot.appendChild(iframe);
      void playerRef.current?.play().catch(() => {});
    } else {
      holder.appendChild(iframe);
      void playerRef.current?.pause().catch(() => {});
    }
  }, [pathname, slotNonce, iframeReady]);

  /** Pause hors page À propos (évite lecture invisible). */
  useEffect(() => {
    if (!playerBound || pathname === "/about") return;
    void playerRef.current?.pause().catch(() => {});
  }, [pathname, playerBound]);

  /** Lecture seulement quand le bloc est dans le viewport (À propos). */
  useEffect(() => {
    if (!playerBound || pathname !== "/about") return;
    const slot = slotRef.current;
    if (!slot) return;

    const io = new IntersectionObserver(
      (entries) => {
        const vis = Boolean(entries[0]?.isIntersecting);
        const p = playerRef.current;
        if (!p) return;
        if (vis) void p.play().catch(() => {});
        else void p.pause().catch(() => {});
      },
      { threshold: 0, rootMargin: "0px" },
    );
    io.observe(slot);
    return () => io.disconnect();
  }, [playerBound, pathname, slotNonce]);

  return (
    <VimeoVisionContext.Provider value={{ setSlotElement }}>
      <div
        ref={holderRef}
        className="pointer-events-none fixed left-[-9999px] top-0 z-0 h-[200px] w-[356px] overflow-hidden opacity-0"
        aria-hidden
      />
      {children}
    </VimeoVisionContext.Provider>
  );
}
