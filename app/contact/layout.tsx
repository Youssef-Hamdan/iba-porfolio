import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Contact",
  description:
    "Écrivez à l’IBA : demande d’information, partenariat ou prise de contact générale. Réponse sous 24 h ouvrées.",
  path: "/contact",
});

export default function ContactLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
