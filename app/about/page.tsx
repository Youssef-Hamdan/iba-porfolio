import { AboutPage } from "@/components/about/AboutPage";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "À propos",
  description:
    "Mission, vision et valeurs d’IBA : approvisionnement durable, partenariats de référence et gouvernance éthique au service de la construction.",
  path: "/about",
});

export default function AboutRoutePage() {
  return <AboutPage />;
}
