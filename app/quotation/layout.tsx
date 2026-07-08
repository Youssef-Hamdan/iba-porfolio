import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Demande de devis",
  description:
    "Demandez un devis pour vos matériaux de construction. L’équipe commerciale IBA vous répond sous 24 h ouvrées avec une cotation adaptée à votre chantier.",
  path: "/quotation",
});

export default function QuotationLayout({ children }: { children: ReactNode }) {
  return children;
}
