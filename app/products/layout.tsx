import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Catalogue produits",
  description:
    "Matériaux de construction de première qualité : ciment, acier, peintures, pavés et outillage. Approvisionnement IBA pour vos chantiers en RDC.",
  path: "/products",
});

export default function ProductsLayout({ children }: { children: ReactNode }) {
  return children;
}
