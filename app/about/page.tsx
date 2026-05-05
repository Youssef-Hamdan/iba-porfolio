import type { Metadata } from "next";
import { AboutPage } from "@/components/about/AboutPage";

export const metadata: Metadata = {
  title: "À propos | International Business Alliance",
  description:
    "Mission, vision et valeurs d’IBA : approvisionnement durable, partenariats de référence et gouvernance éthique au service de la construction.",
};

export default function AboutRoutePage() {
  return <AboutPage />;
}
