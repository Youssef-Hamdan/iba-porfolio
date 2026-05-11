import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Contact | International Business Alliance",
  description:
    "Écrivez à l’IBA : demande d’information, partenariat ou prise de contact générale. Réponse sous 24h ouvrées.",
};

export default function ContactLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
