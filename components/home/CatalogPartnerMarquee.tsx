"use client";

import { useTranslations } from "next-intl";
import { Marquee } from "@/components/ui/marquee";
import { cn } from "@/lib/utils";

export type CatalogPartner = {
  name: string;
  /** Official logo URL — optional; wordmark is shown when omitted */
  img: string | null;
  captionKey: "materials" | "paints" | "mortars" | "distribution";
};

/** Logos locaux (`public/images/partners/`) — encoder les espaces dans les noms de fichier. */
const partnerLogo = (filename: string) =>
  `/images/partners/${encodeURIComponent(filename)}`;

/** Construction / materials partners */
const partners: CatalogPartner[] = [
  {
    name: "BBC",
    img: partnerLogo("BBC logo grey.png"),
    captionKey: "materials",
  },
  {
    name: "Eagle Color",
    img: partnerLogo("eagle logo grey.png"),
    captionKey: "paints",
  },
  {
    name: "Sika",
    img: partnerLogo("Logo_Sika.png"),
    captionKey: "mortars",
  },
  {
    name: "Famico",
    img: partnerLogo("fameco logo grey.webp"),
    captionKey: "distribution",
  },
  {
    name: "JKL",
    img: partnerLogo("JKL Logo grey-01.png"),
    captionKey: "distribution",
  },
];

/** Repeat sequence so the strip feels full before the infinite clone. */
const partnersTrack = [...partners, ...partners, ...partners];

function PartnerLogoBlock({
  name,
  img,
  caption,
}: {
  name: string;
  img: string | null;
  caption: string;
}) {
  return (
    <div
      className={cn(
        "group/logo flex shrink-0 flex-col items-center justify-center gap-2 px-3 py-2 sm:px-6 sm:py-3 md:px-8",
        "min-w-[8rem] sm:min-w-[14rem] md:min-w-[17rem]",
      )}
    >
      {img ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element -- static brand assets from /public */}
          <img
            src={img}
            alt={name}
            className="max-h-16 w-auto max-w-[10rem] object-contain object-center opacity-90 drop-shadow-[0_2px_12px_rgba(0,0,0,0.2)] transition-[transform,opacity] duration-300 ease-out group-hover/logo:scale-105 group-hover/logo:opacity-100 sm:max-h-24 sm:max-w-[14rem] md:max-h-32 md:max-w-[20rem] lg:max-h-36 lg:max-w-[22rem]"
          />
          <p className="text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-white/45">
            {caption}
          </p>
        </>
      ) : (
        <>
          <p className="text-center text-sm font-extrabold uppercase leading-tight tracking-[0.12em] text-white">
            {name}
          </p>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/45">
            {caption}
          </p>
        </>
      )}
    </div>
  );
}

function PartnerSeparator() {
  return (
    <span
      className="mx-1 h-12 w-px shrink-0 self-center bg-white/20 sm:mx-2 sm:h-16 md:h-20"
      aria-hidden
    />
  );
}

function PartnerMarqueeGroup({
  partner,
  caption,
}: {
  partner: CatalogPartner;
  caption: string;
}) {
  return (
    <div className="flex shrink-0 items-center">
      <PartnerLogoBlock name={partner.name} img={partner.img} caption={caption} />
      <PartnerSeparator />
    </div>
  );
}

export function CatalogPartnerMarquee() {
  const t = useTranslations("HomePartners");

  return (
    <div className="w-full min-w-0">
      <div className="mx-auto mb-6 max-w-[90rem] px-5 sm:px-8 md:mb-10 md:px-16 lg:px-20">
        <div className="relative flex max-w-3xl flex-col gap-5">
          <div className="absolute -left-4 -top-12 -z-10 select-none text-[9rem] font-black leading-none text-white/[0.06] sm:text-[11rem] md:text-[13rem]">
            03
          </div>
          <span className="inline-flex w-fit items-center rounded-full border border-white/25 bg-white/10 px-5 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
            {t("badge")}
          </span>
          <div className="flex items-start gap-3">
            <span className="mt-2 h-[2px] w-8 shrink-0 bg-iba-orange" aria-hidden />
            <p className="text-xs font-bold uppercase tracking-widest text-white/70">
              {t("kicker")}
            </p>
          </div>
          <h2
            id="partners-heading"
            className="text-4xl font-extrabold uppercase leading-[1.08] tracking-tight text-white md:text-5xl lg:text-6xl"
          >
            {t("titleBefore")}{" "}
            <span className="text-iba-sky">{t("titleAccent")}</span>
          </h2>
          <p className="max-w-xl text-lg font-medium leading-relaxed text-white/80">
            {t("subtitle")}
          </p>
        </div>
      </div>

      <div
        className={cn(
          "relative w-full min-w-0 overflow-hidden",
          "border-y border-white/25 bg-white/[0.12] py-12 backdrop-blur-md md:py-16",
        )}
      >
        <Marquee
          className="relative z-[1] w-full min-w-0 [--duration:52s] [--gap:0.75rem] sm:[--gap:1.25rem] md:[--gap:1.75rem]"
          pauseOnHover
        >
          {partnersTrack.map((partner, i) => (
            <PartnerMarqueeGroup
              key={`${partner.name}-${i}`}
              partner={partner}
              caption={t(`captions.${partner.captionKey}`)}
            />
          ))}
        </Marquee>

        <p className="sr-only">
          {t("srPartners")}&nbsp;: {partners.map((p) => p.name).join(", ")}
        </p>
      </div>
    </div>
  );
}
