import { createPageMetadata } from "@/lib/seo";
import { HomeCatalogSection } from "@/components/home/HomeCatalogSection";
import { HomePartnersSection } from "@/components/home/HomePartnersSection";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeImpactSection } from "@/components/home/HomeImpactSection";
import { HomePillarsSection } from "@/components/home/HomePillarsSection";
import { HomeSitesSection } from "@/components/home/HomeSitesSection";

export const metadata = createPageMetadata({
  title: "International Business Alliance",
  description:
    "Nous connectons les gouvernements, les industries et les capitaux pour bâtir une économie mondiale résiliente, transparente et durable.",
  path: "/",
});

export default function HomePage() {
  return (
    <main className="flex min-h-[100dvh] md:min-h-screen flex-col bg-background">
      <HomeHero />
      <HomeImpactSection />
      <HomeSitesSection />
      <HomePartnersSection />
    </main>
  );
}
