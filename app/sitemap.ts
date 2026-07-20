import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { localizedHref } from "@/lib/seo";
import { publicRoutes, siteConfig } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return publicRoutes.flatMap(({ path, changeFrequency, priority }) => {
    const languages = Object.fromEntries(
      routing.locales.map((locale) => [
        locale,
        new URL(localizedHref(path, locale), siteConfig.url).toString(),
      ]),
    ) as Record<string, string>;

    return routing.locales.map((locale) => ({
      url: new URL(localizedHref(path, locale), siteConfig.url).toString(),
      lastModified,
      changeFrequency,
      priority,
      alternates: { languages },
    }));
  });
}
