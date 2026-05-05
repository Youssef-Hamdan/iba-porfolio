import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";

const orgLinks = [
  { href: "/about", label: "À Propos" },
  { href: "/projects", label: "Nos Projets" },
  { href: "/products", label: "Produits" },
  { href: "/partners", label: "Partenariats" },
  { href: "/governance", label: "Gouvernance" },
];

const legalLinks = [
  { href: "/politique-de-confidentialite", label: "Politique de Confidentialité" },
  { href: "/conditions-d-utilisation", label: "Conditions d'Utilisation" },
  { href: "/politique-des-cookies", label: "Politique des Cookies" },
];

function SocialLink({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-iba-navy/50 transition-colors hover:text-iba-blue"
      aria-label="Social link"
    >
      <span className="size-5 inline-block rounded-full border border-current" />
    </a>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-iba-navy/10 bg-white/50 backdrop-blur-sm">
      <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-8 md:px-16 lg:px-20">
        <Link href="/" className="mb-8 inline-block" aria-label="International Business Alliance — accueil">
          <BrandLogo className="h-28 w-auto max-w-full opacity-95 hover:opacity-100 sm:h-36 md:h-44 lg:h-52 xl:h-56" />
        </Link>
        <p className="max-w-3xl text-sm leading-relaxed text-iba-navy/85">
          Construire des alliances stratégiques pour une croissance durable au-delà des frontières. Nous
          connectons institutions, gouvernements et entreprises pour favoriser le développement
          international.
        </p>

        <div className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-iba-navy/55">
              Organisation
            </h2>
            <ul className="mt-4 space-y-2">
              {orgLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-iba-navy hover:text-iba-blue"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-iba-navy/55">
              Contact
            </h2>
            <address className="mt-4 space-y-2 text-sm not-italic leading-relaxed text-iba-navy/90">
              <p>
                Imm. Infinity Center, Bureau n°501 Ave de la Libération, Gombe, Democratic Republic of the
                Congo
              </p>
              <p>
                <a href="tel:+24390000922" className="hover:text-iba-blue">
                  +243 900 009 22
                </a>
              </p>
              <p>
                <a href="mailto:commercial@rdcsteel.com" className="hover:text-iba-blue">
                  commercial@rdcsteel.com
                </a>
              </p>
            </address>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-iba-navy/55">
              Suivez-nous
            </h2>
            <div className="mt-4 flex gap-3">
              <SocialLink href="#" />
              <SocialLink href="#" />
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-iba-navy/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-iba-navy/55">
            © {year} International Business Alliance. Tous droits réservés.
          </p>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-xs" aria-label="Mentions légales">
            {legalLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-iba-navy/75 hover:text-iba-blue"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
