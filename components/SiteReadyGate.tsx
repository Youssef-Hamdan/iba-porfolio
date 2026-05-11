"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { AboutVideoWarmup } from "@/components/AboutVideoWarmup";
import { SiteReadyContext } from "@/components/site-ready-context";
import { VIMEO_PLAYER_SCRIPT_URL } from "@/lib/about-vision-vimeo";

const SESSION_KEY = "iba_site_preload_done";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function loadVimeoPlayerScript(): Promise<void> {
  const w = window as Window & { Vimeo?: { Player?: unknown } };
  if (w.Vimeo?.Player) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const existing = document.querySelector(
      `script[src="${VIMEO_PLAYER_SCRIPT_URL}"]`,
    ) as HTMLScriptElement | null;
    if (existing) {
      if (w.Vimeo?.Player) {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("vimeo script")), { once: true });
      return;
    }
    const s = document.createElement("script");
    s.src = VIMEO_PLAYER_SCRIPT_URL;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("vimeo script"));
    document.head.appendChild(s);
  });
}

type LoaderPhase = "full" | "fade" | null;

export function SiteReadyGate({ children }: { children: React.ReactNode }) {
  const [siteReady, setSiteReady] = useState(false);
  const [loader, setLoader] = useState<LoaderPhase>("full");
  const skipLoadRef = useRef(false);

  useLayoutEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY) === "1") {
        skipLoadRef.current = true;
        setLoader(null);
        setSiteReady(true);
      }
    } catch {
      /* private mode */
    }
  }, []);

  useEffect(() => {
    if (skipLoadRef.current) return;

    document.body.style.overflow = "hidden";

    const run = async () => {
      try {
        await Promise.all([
          loadVimeoPlayerScript().catch(() => {}),
          sleep(900),
          document.fonts?.ready?.catch(() => {}) ?? Promise.resolve(),
        ]);
      } finally {
        try {
          sessionStorage.setItem(SESSION_KEY, "1");
        } catch {
          /* ignore */
        }
        document.body.style.overflow = "";
        setSiteReady(true);
        setLoader("fade");
        window.setTimeout(() => setLoader(null), 520);
      }
    };

    void run();

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <SiteReadyContext.Provider value={siteReady}>
      {children}
      <AboutVideoWarmup />
      {loader !== null ? (
        <div
          className={`fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 bg-background px-6 transition-opacity duration-500 ease-out motion-reduce:transition-none ${
            loader === "fade" ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
          aria-busy={loader === "full"}
          aria-live="polite"
        >
          <div className="relative h-24 w-24 shrink-0 md:h-28 md:w-28">
            <Image
              src="/images/logo/iba-logo.png"
              alt="IBA"
              fill
              className="object-contain"
              priority
              sizes="112px"
            />
          </div>
          <div className="flex flex-col items-center gap-3">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-iba-navy/70">
              International Business Alliance
            </p>
            <p className="text-sm font-semibold text-iba-sky/85 md:text-base">
              {loader === "full" ? "Chargement du contenu…" : ""}
            </p>
            {loader === "full" ? (
              <div
                className="mt-2 h-8 w-8 shrink-0 rounded-full border-2 border-iba-sky/25 border-t-iba-orange motion-safe:animate-spin motion-reduce:animate-none"
                role="status"
                aria-label="Chargement en cours"
              />
            ) : null}
          </div>
        </div>
      ) : null}
    </SiteReadyContext.Provider>
  );
}
