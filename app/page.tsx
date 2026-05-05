import { HomeCatalogSection } from "@/components/home/HomeCatalogSection";
import { HomePartnersSection } from "@/components/home/HomePartnersSection";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeImpactSection } from "@/components/home/HomeImpactSection";
import { HomePillarsSection } from "@/components/home/HomePillarsSection";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <HomeHero />
      <HomeImpactSection />
      <HomePillarsSection />
      <HomePartnersSection />
      {/* <HomeCatalogSection /> */}
    </main>
  );
}
