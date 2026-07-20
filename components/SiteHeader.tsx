"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { BrandLogo } from "@/components/BrandLogo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Link } from "@/i18n/navigation";

export function SiteHeader() {
  const t = useTranslations("Nav");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  const nav = [
    { href: "/", label: t("home") },
    { href: "/about", label: t("about") },
    { href: "/projects", label: t("projects") },
    { href: "/products", label: t("products") },
    { href: "/quotation", label: t("quotation") },
  ] as const;

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;

    if (latest > 20) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }

    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [open]);

  return (
    <motion.header
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden && !open ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={`fixed top-0 z-50 w-full border-b border-iba-sky/10 bg-white transition-shadow duration-300 ${
        scrolled ? "shadow-sm" : "shadow-none"
      }`}
    >
      <div
        className={`relative mx-auto flex w-full max-w-[90rem] items-center transition-[padding] duration-300 ${
          scrolled ? "py-1 sm:py-1" : "py-1 sm:py-1"
        } px-5 pr-3 sm:px-8 sm:pr-4 md:px-16 lg:px-20`}
      >
        <div className="flex min-w-0 flex-1 items-center justify-start">
          <Link
            href="/"
            className="flex shrink-0 items-center leading-none transition-opacity hover:opacity-90"
            aria-label={t("brandAria")}
          >
            <BrandLogo
              priority
              className="h-20 w-auto max-w-[min(100vw,500px)] object-contain object-left sm:h-20 sm:max-w-[500px] md:h-24 lg:h-28"
            />
          </Link>
        </div>

        <nav
          className="hidden shrink-0 items-center gap-6 whitespace-nowrap md:flex lg:gap-10"
          aria-label={t("ariaMain")}
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              prefetch={item.href === "/about" ? true : undefined}
              className="group relative text-sm font-bold uppercase tracking-widest text-iba-sky transition-colors hover:text-iba-orange"
            >
              {item.label}
              <span className="absolute -bottom-2 left-0 h-[2px] w-0 bg-iba-orange transition-all duration-300 ease-out group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-2 sm:gap-3">
          <LanguageSwitcher className="hidden sm:inline-flex" />

          <button
            type="button"
            className="group relative z-50 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-iba-sky/5 text-iba-sky transition-colors hover:bg-iba-sky hover:text-white md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? t("closeMenu") : t("openMenu")}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link
            href="/contact"
            className="hidden shrink-0 items-center justify-center rounded-md bg-iba-orange px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-iba-orange/90 md:inline-flex"
          >
            {t("contact")}
          </Link>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="absolute inset-x-0 top-full border-b border-iba-sky/10 bg-white px-4 py-4 shadow-md sm:px-6 md:hidden"
          >
            <nav className="flex flex-col gap-2" aria-label={t("ariaMobile")}>
              {nav.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.3 }}
                >
                  <Link
                    href={item.href}
                    prefetch={item.href === "/about" ? true : undefined}
                    className="group flex items-center justify-between rounded-2xl px-4 py-4 text-xl font-black uppercase tracking-wide text-iba-sky transition-colors hover:bg-iba-sky/5 hover:text-iba-orange"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                    <ArrowRight className="h-5 w-5 opacity-0 transition-all group-hover:translate-x-2 group-hover:opacity-100" />
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: nav.length * 0.1, duration: 0.3 }}
                className="mt-4 flex items-center justify-between gap-3 border-t border-iba-sky/10 pt-4"
              >
                <LanguageSwitcher />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: nav.length * 0.1 + 0.1, duration: 0.3 }}
                className="mt-2"
              >
                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center justify-center rounded-md bg-iba-orange px-6 py-4 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-iba-orange/90"
                >
                  {t("contact")}
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
