import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";
import { siteConfig } from "@/lib/site-config";

type PageSeoInput = {
  title: string;
  description: string;
  path?: string;
  noIndex?: boolean;
  locale?: string;
};

const ogLocaleByLang: Record<Locale, string> = {
  fr: "fr_FR",
  en: "en_US",
  zh: "zh_CN",
};

function absoluteUrl(path: string) {
  return new URL(path, siteConfig.url).toString();
}

/** Locale-prefixed path (`as-needed`: default locale has no prefix). */
export function localizedHref(path: string, locale: string): string {
  const normalized = path === "/" ? "/" : path.startsWith("/") ? path : `/${path}`;
  if (locale === routing.defaultLocale) {
    return normalized;
  }
  if (normalized === "/") {
    return `/${locale}`;
  }
  return `/${locale}${normalized}`;
}

function languageAlternates(path: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = absoluteUrl(localizedHref(path, locale));
  }
  languages["x-default"] = absoluteUrl(localizedHref(path, routing.defaultLocale));
  return languages;
}

export function createPageMetadata({
  title,
  description,
  path = "/",
  noIndex = false,
  locale = routing.defaultLocale,
}: PageSeoInput): Metadata {
  const canonical = absoluteUrl(localizedHref(path, locale));
  const ogImage = absoluteUrl(siteConfig.ogImagePath);
  const ogLocale =
    ogLocaleByLang[locale as Locale] ?? siteConfig.locale;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: languageAlternates(path),
    },
    openGraph: {
      type: "website",
      locale: ogLocale,
      url: canonical,
      siteName: siteConfig.name,
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export function rootMetadata(): Metadata {
  const pageSeo = createPageMetadata({
    title: siteConfig.name,
    description: siteConfig.description,
    path: "/",
  });
  const googleVerification = process.env.GOOGLE_SITE_VERIFICATION;

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: siteConfig.name,
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    applicationName: siteConfig.shortName,
    creator: siteConfig.name,
    publisher: siteConfig.name,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    alternates: pageSeo.alternates,
    openGraph: pageSeo.openGraph,
    twitter: pageSeo.twitter,
    robots: pageSeo.robots,
    ...(googleVerification
      ? {
          verification: {
            google: googleVerification,
          },
        }
      : {}),
  };
}
