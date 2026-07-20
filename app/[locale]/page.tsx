import { getTranslations, setRequestLocale } from "next-intl/server";
import { HomePartnersSection } from "@/components/home/HomePartnersSection";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeImpactSection } from "@/components/home/HomeImpactSection";
import { HomeSitesSection } from "@/components/home/HomeSitesSection";
import { createPageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta.home" });
  return createPageMetadata({
    title: t("title"),
    description: t("description"),
    path: "/",
    locale,
  });
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="flex min-h-[100dvh] md:min-h-screen flex-col bg-background">
      <HomeHero />
      <HomeImpactSection />
      <HomeSitesSection />
      <HomePartnersSection />
    </main>
  );
}
