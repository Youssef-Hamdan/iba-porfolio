import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Nos réalisations",
  description:
    "Portfolio IBA : infrastructures fluviales, complexes résidentiels, River Tower et projets industriels. Matériaux de construction pour grands chantiers en RDC.",
  path: "/projects",
});

export default function ProjectsLayout({ children }: { children: ReactNode }) {
  return children;
}
