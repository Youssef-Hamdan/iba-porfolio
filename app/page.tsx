import { HomeCatalogSection } from "@/components/home/HomeCatalogSection";
import { HomePartnersSection } from "@/components/home/HomePartnersSection";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeImpactSection } from "@/components/home/HomeImpactSection";
import { HomePillarsSection } from "@/components/home/HomePillarsSection";
import { HomeSitesSection } from "@/components/home/HomeSitesSection";

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
