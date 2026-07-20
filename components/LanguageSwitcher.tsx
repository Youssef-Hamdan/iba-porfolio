"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const localeLabels: Record<Locale, string> = {
  fr: "FR",
  en: "EN",
  zh: "中文",
};

export function LanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations("LanguageSwitcher");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div
      className={cn("inline-flex items-center gap-0.5 rounded-md border border-iba-sky/15 bg-iba-sky/5 p-0.5", className)}
      role="group"
      aria-label={t("label")}
    >
      {locales.map((code) => {
        const active = code === locale;
        return (
          <button
            key={code}
            type="button"
            onClick={() => router.replace(pathname, { locale: code })}
            className={cn(
              "rounded px-2 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors sm:text-[11px]",
              active
                ? "bg-iba-sky text-white"
                : "text-iba-sky/70 hover:bg-white hover:text-iba-sky",
            )}
            aria-pressed={active}
            aria-label={t(code)}
          >
            {localeLabels[code]}
          </button>
        );
      })}
    </div>
  );
}
