"use client";

import { Marquee } from "@/components/ui/marquee";
import { cn } from "@/lib/utils";

export type CatalogPartner = {
  name: string;
  /** Official logo URL — optional; wordmark is shown when omitted */
  img: string | null;
  /** Short line under the name (optional) */
  caption?: string;
};

/** Construction / materials partners — drop assets into `public/` and point `img` here when ready */
const partners: CatalogPartner[] = [
  {
    name: "BBC",
    img: null,
    caption: "Matériaux",
  },
  {
    name: "Sika",
    img: "https://cdn.simpleicons.org/sika/282561",
  },
  {
    name: "Eagle Color",
    img: null,
    caption: "Peintures & finitions",
  },
  {
    name: "Famico",
    img: null,
  },
];

/** Repeat sequence so the strip feels full before the infinite clone. */
const partnersTrack = [...partners, ...partners, ...partners];

function PartnerCard({ name, img, caption }: CatalogPartner) {
  return (
    <article
      className={cn(
        "flex min-h-[5rem] min-w-[11.5rem] max-w-[14rem] shrink-0 flex-col items-center justify-center gap-1 rounded-2xl px-5 py-3.5",
        "border border-iba-navy/[0.08] bg-white/95 shadow-md shadow-iba-navy/[0.06]",
        "ring-1 ring-white/80 backdrop-blur-sm transition-[border-color,box-shadow,transform] duration-300",
        "hover:-translate-y-1 hover:border-iba-sky/45 hover:shadow-lg hover:shadow-iba-sky/10 hover:ring-iba-sky/25",
      )}
    >
      {img ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element -- external brand assets */}
          <img
            src={img}
            alt={name}
            className="max-h-9 w-auto max-w-[7.5rem] object-contain object-center"
          />
          {caption ? (
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-iba-navy/50">
              {caption}
            </p>
          ) : null}
        </>
      ) : (
        <>
          <p className="text-center text-[13px] font-extrabold uppercase leading-tight tracking-[0.12em] text-iba-navy">
            {name}
          </p>
          {caption ? (
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-iba-navy/50">
              {caption}
            </p>
          ) : null}
        </>
      )}
    </article>
  );
}

function PartnerSeparator() {
  return (
    <span
      className="flex h-8 w-8 shrink-0 items-center justify-center self-center"
      aria-hidden
    >
      <span className="h-1 w-1 rounded-full bg-iba-navy/25 shadow-[0_0_0_3px_rgba(255,255,255,0.35)] ring-1 ring-iba-sky/40" />
    </span>
  );
}

function PartnerMarqueeGroup({ partner }: { partner: CatalogPartner }) {
  return (
    <div className="flex shrink-0 items-center gap-3 sm:gap-4">
      <PartnerCard {...partner} />
      <PartnerSeparator />
    </div>
  );
}

export function CatalogPartnerMarquee() {
  return (
    <div className="w-full min-w-0">
      <div className="mx-auto mb-6 max-w-[90rem] px-5 sm:px-8 md:mb-10 md:px-16 lg:px-20">
        <div className="relative flex max-w-3xl flex-col gap-5">
          <div className="absolute -left-4 -top-12 -z-10 select-none text-[9rem] font-black leading-none text-white/[0.06] sm:text-[11rem] md:text-[13rem]">
            03
          </div>
          <span className="inline-flex w-fit items-center rounded-full border border-white/25 bg-white/10 px-5 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
            Notre réseau
          </span>
          <div className="flex items-start gap-3">
            <span className="mt-2 h-[2px] w-8 shrink-0 bg-iba-navy" aria-hidden />
            <p className="text-xs font-bold uppercase tracking-widest text-white/70">
              03 — Partenaires &amp; fournisseurs
            </p>
          </div>
          <h2
            id="partners-heading"
            className="text-4xl font-extrabold uppercase leading-[1.08] tracking-tight text-white md:text-5xl lg:text-6xl"
          >
            L&apos;excellence des{" "}
            <span className="text-iba-navy">matériaux</span>
          </h2>
          <p className="max-w-xl text-lg font-medium leading-relaxed text-white/80">
            Une sélection rigoureuse approuvée par les leaders mondiaux&nbsp;:
          </p>
        </div>
      </div>

      <div
        className={cn(
          "relative w-full min-w-0 overflow-hidden",
          "border-y border-white/20 bg-white/[0.12] py-9 backdrop-blur-md md:py-11",
          "[mask-image:linear-gradient(90deg,transparent_0%,#000_6%,#000_94%,transparent_100%)]",
          "[-webkit-mask-image:linear-gradient(90deg,transparent_0%,#000_6%,#000_94%,transparent_100%)]",
        )}
      >
        <Marquee
          className="w-full min-w-0 [--duration:42s] [--gap:0.5rem] sm:[--gap:0.75rem] md:[--gap:1rem]"
          pauseOnHover
        >
          {partnersTrack.map((partner, i) => (
            <PartnerMarqueeGroup key={`${partner.name}-${i}`} partner={partner} />
          ))}
        </Marquee>

        <p className="sr-only">
          Partenaires&nbsp;: {partners.map((p) => p.name).join(", ")}
        </p>
      </div>
    </div>
  );
}
