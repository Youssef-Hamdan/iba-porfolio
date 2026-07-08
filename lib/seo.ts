import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

type PageSeoInput = {
  title: string;
  description: string;
  path?: string;
  noIndex?: boolean;
};

function absoluteUrl(path: string) {
  return new URL(path, siteConfig.url).toString();
}

export function createPageMetadata({
  title,
  description,
  path = "/",
  noIndex = false,
}: PageSeoInput): Metadata {
  const canonical = absoluteUrl(path);
  const ogImage = absoluteUrl(siteConfig.ogImagePath);

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
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
