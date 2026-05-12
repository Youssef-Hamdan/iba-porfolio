"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUp, Mail, Phone } from "lucide-react";

const FOOTER_LOGO_SRC = "/images/logo/iba-logo.png";

const PHONE_DISPLAY = "+243 900 009 22";
const PHONE_HREF = "tel:+24390000922";
const WHATSAPP_HREF = `https://wa.me/${PHONE_HREF.replace(/\D/g, "")}`;
const EMAIL = "commercial@rdcsteel.com";

const ADDRESS =
  "Imm. Infinity Center, Bureau n°501, Ave de la Libération, Gombe, République démocratique du Congo";

/** Bannière — image industrielle (domaine autorisé dans next.config). */
const FOOTER_HERO_SRC =
  "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=2070&auto=format&fit=crop";

const mainNav = [
  { href: "/", label: "Accueil" },
  { href: "/about", label: "À propos" },
  { href: "/projects", label: "Projets" },
  { href: "/products", label: "Produits" },
  { href: "/quotation", label: "Devis" },
  { href: "/contact", label: "Contact" },
] as const;

const secondaryNav = [
  { href: "/partners", label: "Partenariats" },
  { href: "/governance", label: "Gouvernance" },
] as const;

const legalLinks = [
  { href: "/politique-de-confidentialite", label: "Confidentialité" },
  { href: "/conditions-d-utilisation", label: "Conditions" },
  { href: "/politique-des-cookies", label: "Cookies" },
] as const;

export function SiteFooter() {
  const year = new Date().getFullYear();

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="mt-auto bg-background pt-24 font-sans md:pt-32">
      <div className="mx-auto w-[min(100%,80rem)] px-6">
        <div className="relative z-10 -mb-20 md:-mb-24">
          <div className="group relative h-[min(22rem,70vw)] overflow-hidden rounded-2xl shadow-[0_24px_60px_-12px_rgba(40,37,97,0.22)] md:h-96">
            <Image
              src={FOOTER_HERO_SRC}
              alt="Chantier et infrastructure — International Business Alliance"
              fill
              className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-[1.03]"
              sizes="(max-width: 1280px) 100vw, 80rem"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-iba-navy/88 via-iba-navy/72 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-16 lg:p-24">
              <h2 className="mb-6 max-w-2xl text-3xl font-bold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
                Alliances stratégiques pour une{" "}
                <span className="text-iba-sky">croissance durable</span>.
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-6">
        <div className="rounded-t-3xl bg-iba-navy pb-16 pt-36 text-white md:px-12 md:pb-20 md:pt-40">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-12 pb-10 lg:grid-cols-2 lg:gap-16 lg:pb-14">
              <div className="space-y-10">
                <Link
                  href="/"
                  className="group relative inline-flex shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-iba-orange focus-visible:ring-offset-2 focus-visible:ring-offset-iba-navy rounded-full"
                  aria-label="International Business Alliance — accueil"
                >
                  <span className="block rounded-full bg-white p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.35)] ring-2 ring-iba-sky/35 transition group-hover:ring-iba-orange/60 sm:p-2">
                    <span className="relative block size-36 sm:size-40 md:size-48 lg:size-56 xl:size-64">
                      <Image
                        src={FOOTER_LOGO_SRC}
                        alt="International Business Alliance"
                        fill
                        className="object-contain"
                        sizes="(max-width: 640px) 9rem, (max-width: 1024px) 12rem, 16rem"
                      />
                    </span>
                  </span>
                </Link>

                <div>
                  <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-iba-sky/90">
                    Réseaux sociaux
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={WHATSAPP_HREF}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex size-11 items-center justify-center rounded-full border border-white/20 text-white transition hover:border-[#25D366] hover:bg-[#25D366] hover:text-white"
                      aria-label="Discuter sur WhatsApp"
                    >
                      <svg className="size-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="flex size-11 items-center justify-center rounded-full border border-white/20 text-white transition hover:border-iba-orange hover:bg-iba-orange hover:text-iba-navy"
                      aria-label="Instagram"
                    >
                      <svg className="size-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="flex size-11 items-center justify-center rounded-full border border-white/20 text-white transition hover:border-iba-orange hover:bg-iba-orange hover:text-iba-navy"
                      aria-label="Facebook"
                    >
                      <svg className="size-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path d="M22.675 0h-21.35C.597 0 0 .597 0 1.325v21.351C0 23.403.597 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.597 1.323-1.325V1.325C24 .597 23.403 0 22.675 0z" />
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="flex size-11 items-center justify-center rounded-full border border-white/20 text-white transition hover:border-iba-orange hover:bg-iba-orange hover:text-iba-navy"
                      aria-label="LinkedIn"
                    >
                      <svg className="size-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              <div className="space-y-6 lg:pl-8 lg:text-right" id="contact">
                <h3 className="text-lg font-semibold text-white md:text-xl">Contact</h3>
                <div className="space-y-6 text-white/80">
                  <p>
                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-iba-sky">
                      Adresse
                    </span>
                    <span className="mt-2 block text-left text-sm font-medium leading-relaxed text-white/90 lg:text-right">
                      {ADDRESS}
                    </span>
                  </p>
                  <p>
                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-iba-sky">
                      Téléphone
                    </span>
                    <a
                      href={PHONE_HREF}
                      className="mt-1 inline-flex items-center gap-2 text-lg font-medium text-white transition hover:text-iba-orange lg:ml-auto"
                    >
                      <Phone className="size-4 shrink-0 opacity-80" aria-hidden />
                      {PHONE_DISPLAY}
                    </a>
                  </p>
                  <p>
                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-iba-sky">
                      E-mail
                    </span>
                    <a
                      href={`mailto:${EMAIL}`}
                      className="mt-1 inline-flex items-start gap-2 break-all text-left text-lg font-medium text-white transition hover:text-iba-orange lg:ml-auto lg:text-right"
                    >
                      <Mail className="mt-1 size-4 shrink-0 opacity-80" aria-hidden />
                      {EMAIL}
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <nav
              className="grid grid-cols-2 gap-x-4 gap-y-3 border-t border-white/15 py-10 text-sm font-medium text-white/70 md:grid-cols-4 lg:flex lg:flex-wrap lg:justify-center lg:gap-x-8 lg:gap-y-2"
              aria-label="Pied de page"
            >
              {mainNav.map((item) => (
                <Link key={item.href} href={item.href} className="hover:text-iba-orange">
                  {item.label}
                </Link>
              ))}
              {secondaryNav.map((item) => (
                <Link key={item.href} href={item.href} className="hover:text-iba-orange">
                  {item.label}
                </Link>
              ))}
            </nav>

            <nav
              className="flex flex-wrap justify-center gap-x-6 gap-y-2 border-t border-white/10 py-6 text-xs text-white/55"
              aria-label="Mentions légales"
            >
              {legalLinks.map((item) => (
                <Link key={item.href} href={item.href} className="hover:text-iba-orange">
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex flex-col items-center justify-between gap-6 border-t border-white/15 py-8 md:flex-row">
              <span className="text-center text-sm font-semibold text-white/90 md:text-left">
                © {year} International Business Alliance. Tous droits réservés.
              </span>
              <button
                type="button"
                onClick={scrollTop}
                className="flex items-center gap-2 text-sm text-white/55 transition hover:text-white"
              >
                Haut de page
                <span className="flex size-10 items-center justify-center rounded-full bg-iba-sky text-white transition hover:bg-iba-orange hover:text-iba-navy">
                  <ArrowUp className="size-5" strokeWidth={2} aria-hidden />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
