"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Mail,
  MessageSquare,
  Phone,
  Send,
  User,
} from "lucide-react";
import { SectionWave } from "@/components/SectionWave";
import { cn } from "@/lib/utils";
import { PHONE_MAX_LENGTH, validatePhoneValue } from "@/lib/phone-validation";
import type { ContactFieldKey } from "@/app/api/contact/route";

type FieldErrors = Partial<Record<ContactFieldKey, string>>;

const fade = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
};

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const clearFieldError = (key: ContactFieldKey) => {
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const fieldBorderClass = (hasError: boolean) =>
    cn(
      hasError &&
        "border-red-400 focus:border-red-500 focus:ring-red-500/40 aria-[invalid=true]:border-red-400",
    );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);
    setFieldErrors({});
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      company: String(formData.get("company") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
    };

    const phoneError = validatePhoneValue(payload.phone);
    if (phoneError) {
      setFieldErrors({ phone: phoneError });
      setSubmitError("Veuillez corriger les champs indiqués.");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json().catch(() => ({}))) as {
        error?: string;
        errors?: FieldErrors;
      };

      if (!res.ok) {
        if (json.errors && typeof json.errors === "object") {
          setFieldErrors(json.errors);
        }
        setSubmitError(
          typeof json.error === "string"
            ? json.error
            : "Envoi impossible pour le moment. Réessayez plus tard.",
        );
        return;
      }

      setFieldErrors({});
      setIsSuccess(true);
    } catch {
      setSubmitError("Problème de connexion. Vérifiez votre réseau et réessayez.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-[100dvh] md:min-h-screen flex-col bg-background selection:bg-iba-navy selection:text-white">
      <section className="relative overflow-hidden bg-iba-navy pt-[calc(6rem+2rem)] pb-24 text-white md:pt-[calc(8rem+2rem)] md:pb-32">
        <div
          className="pointer-events-none absolute -right-24 top-1/4 h-[480px] w-[480px] rounded-full bg-white/[0.06] blur-[100px]"
          aria-hidden
        />

        <div
          className="absolute inset-0 z-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(var(--iba-sky) 1px, transparent 1px), linear-gradient(90deg, var(--iba-sky) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
          aria-hidden
        />

        <div className="relative z-10 mx-auto max-w-[90rem] px-5 sm:px-8 md:px-16 lg:px-20">
          <motion.div {...fade} className="max-w-4xl">
            <div
              className="absolute -left-6 -top-10 -z-10 select-none text-[8rem] font-black leading-none text-white/[0.06] md:-left-10 md:-top-16 md:text-[12rem]"
              aria-hidden
            >
              MSG
            </div>

            <div className="mb-6 flex items-center gap-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-iba-sky shadow-[0_0_8px_rgba(40,37,97,0.5)]" />
                Formulaire de contact
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-iba-sky/35 to-transparent" aria-hidden />
            </div>

            <h1 className="mt-4 text-5xl font-black uppercase leading-[0.95] tracking-tighter text-white sm:text-6xl md:text-8xl">
              Nous{" "}
              <span className="text-iba-sky">contacter</span>
            </h1>
            <p className="mt-8 max-w-2xl border-l-2 border-iba-sky pl-6 text-lg font-medium leading-relaxed text-white/85 md:text-xl">
              Une question, un projet ou un partenariat&nbsp;? Décrivez votre besoin : notre équipe vous répond sous 24h ouvrées.
            </p>
          </motion.div>
        </div>
        <SectionWave edge="bottom" fillClassName="fill-background" heightClassName="h-12 md:h-16" />
      </section>

      <section className="relative bg-background py-16 md:py-24 lg:py-28">
        <div className="absolute left-1/2 top-0 bottom-0 hidden w-px -translate-x-1/2 bg-iba-navy/15 lg:block" aria-hidden />

        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(circle at 0 0, var(--iba-sky) 1px, transparent 2px)`,
            backgroundSize: "40px 40px",
          }}
          aria-hidden
        />

        <div className="relative z-10 mx-auto max-w-[90rem] px-5 sm:px-8 md:px-16 lg:px-20">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-16">
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center border-y-8 border-double border-iba-navy/20 bg-iba-navy/5 p-12 text-center shadow-lg lg:col-span-3"
              >
                <CheckCircle2 className="mb-6 h-20 w-20 text-iba-navy" />
                <h2 className="mb-4 text-3xl font-black uppercase tracking-tighter text-iba-navy md:text-4xl">
                  Message envoyé
                </h2>
                <p className="max-w-lg text-lg font-medium text-iba-navy/75">
                  Merci pour votre message. Nous vous recontactons très prochainement.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsSuccess(false);
                    setSubmitError(null);
                    setFieldErrors({});
                  }}
                  className="mt-8 font-mono text-sm font-bold uppercase tracking-widest text-iba-navy transition-colors hover:text-iba-sky"
                >
                  Nouveau message →
                </button>
              </motion.div>
            ) : (
              <>
                <form onSubmit={handleSubmit} className="flex flex-col gap-10 lg:col-span-2">
                  <div className="relative border border-iba-sky/15 bg-white p-8 shadow-[0_10px_40px_rgba(40,37,97,0.03)] md:p-12">
                    <div className="absolute left-0 top-0 h-3 w-3 border-l-2 border-t-2 border-iba-sky" />
                    <div className="absolute right-0 top-0 h-3 w-3 border-r-2 border-t-2 border-iba-sky" />
                    <div className="absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2 border-iba-sky" />
                    <div className="absolute bottom-0 right-0 h-3 w-3 border-b-2 border-r-2 border-iba-sky" />

                    <div className="mb-8 flex items-end gap-4 border-b border-iba-sky/10 pb-4">
                      <span className="font-mono text-4xl font-black text-iba-navy/12">01</span>
                      <h2 className="text-2xl font-black uppercase tracking-tighter text-iba-navy">
                        Coordonnées
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-2 md:col-span-2">
                        <label
                          htmlFor="contact-name"
                          className="font-mono text-[10px] font-bold uppercase tracking-widest text-iba-navy/70"
                        >
                          Nom complet *
                        </label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-iba-navy/45" />
                          <input
                            id="contact-name"
                            name="name"
                            type="text"
                            required
                            autoComplete="name"
                            aria-invalid={fieldErrors.name ? true : undefined}
                            aria-describedby={fieldErrors.name ? "contact-name-error" : undefined}
                            onChange={() => clearFieldError("name")}
                            className={cn(
                              "w-full border border-iba-sky/20 bg-background py-3 pl-12 pr-4 text-base font-medium text-iba-navy placeholder:text-iba-navy/35 focus:border-iba-navy focus:outline-none focus:ring-1 focus:ring-iba-navy",
                              fieldBorderClass(!!fieldErrors.name),
                            )}
                            placeholder="Jean Dupont"
                          />
                        </div>
                        {fieldErrors.name ? (
                          <p id="contact-name-error" className="text-sm font-medium text-red-600" role="alert">
                            {fieldErrors.name}
                          </p>
                        ) : null}
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <label
                          htmlFor="contact-company"
                          className="font-mono text-[10px] font-bold uppercase tracking-widest text-iba-navy/70"
                        >
                          Entreprise / organisation
                        </label>
                        <div className="relative">
                          <Building2 className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-iba-navy/45" />
                          <input
                            id="contact-company"
                            name="company"
                            type="text"
                            autoComplete="organization"
                            aria-invalid={fieldErrors.company ? true : undefined}
                            aria-describedby={fieldErrors.company ? "contact-company-error" : undefined}
                            onChange={() => clearFieldError("company")}
                            className={cn(
                              "w-full border border-iba-sky/20 bg-background py-3 pl-12 pr-4 text-base font-medium text-iba-navy placeholder:text-iba-navy/35 focus:border-iba-navy focus:outline-none focus:ring-1 focus:ring-iba-navy",
                              fieldBorderClass(!!fieldErrors.company),
                            )}
                            placeholder="Société ou institution (optionnel)"
                          />
                        </div>
                        {fieldErrors.company ? (
                          <p id="contact-company-error" className="text-sm font-medium text-red-600" role="alert">
                            {fieldErrors.company}
                          </p>
                        ) : null}
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="contact-email"
                          className="font-mono text-[10px] font-bold uppercase tracking-widest text-iba-navy/70"
                        >
                          Adresse e-mail *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-iba-navy/45" />
                          <input
                            id="contact-email"
                            name="email"
                            type="email"
                            required
                            autoComplete="email"
                            aria-invalid={fieldErrors.email ? true : undefined}
                            aria-describedby={fieldErrors.email ? "contact-email-error" : undefined}
                            onChange={() => clearFieldError("email")}
                            className={cn(
                              "w-full border border-iba-sky/20 bg-background py-3 pl-12 pr-4 text-base font-medium text-iba-navy placeholder:text-iba-navy/35 focus:border-iba-navy focus:outline-none focus:ring-1 focus:ring-iba-navy",
                              fieldBorderClass(!!fieldErrors.email),
                            )}
                            placeholder="vous@exemple.com"
                          />
                        </div>
                        {fieldErrors.email ? (
                          <p id="contact-email-error" className="text-sm font-medium text-red-600" role="alert">
                            {fieldErrors.email}
                          </p>
                        ) : null}
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="contact-phone"
                          className="font-mono text-[10px] font-bold uppercase tracking-widest text-iba-navy/70"
                        >
                          Téléphone *
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-iba-navy/45" />
                          <input
                            id="contact-phone"
                            name="phone"
                            type="tel"
                            inputMode="tel"
                            required
                            maxLength={PHONE_MAX_LENGTH}
                            autoComplete="tel"
                            aria-invalid={fieldErrors.phone ? true : undefined}
                            aria-describedby={fieldErrors.phone ? "contact-phone-error" : undefined}
                            onChange={() => clearFieldError("phone")}
                            className={cn(
                              "w-full border border-iba-sky/20 bg-background py-3 pl-12 pr-4 text-base font-medium text-iba-navy placeholder:text-iba-navy/35 focus:border-iba-navy focus:outline-none focus:ring-1 focus:ring-iba-navy",
                              fieldBorderClass(!!fieldErrors.phone),
                            )}
                            placeholder="+243 …"
                          />
                        </div>
                        {fieldErrors.phone ? (
                          <p id="contact-phone-error" className="text-sm font-medium text-red-600" role="alert">
                            {fieldErrors.phone}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="relative border border-iba-sky/15 bg-white p-8 shadow-[0_10px_40px_rgba(40,37,97,0.03)] md:p-12">
                    <div className="absolute left-0 top-0 h-3 w-3 border-l-2 border-t-2 border-iba-sky" />
                    <div className="absolute right-0 top-0 h-3 w-3 border-r-2 border-t-2 border-iba-sky" />
                    <div className="absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2 border-iba-sky" />
                    <div className="absolute bottom-0 right-0 h-3 w-3 border-b-2 border-r-2 border-iba-sky" />

                    <div className="mb-8 flex items-end gap-4 border-b border-iba-sky/10 pb-4">
                      <span className="font-mono text-4xl font-black text-iba-navy/12">02</span>
                      <h2 className="text-2xl font-black uppercase tracking-tighter text-iba-navy">Votre message</h2>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="contact-message"
                        className="font-mono text-[10px] font-bold uppercase tracking-widest text-iba-navy/70"
                      >
                        Message * (min. 10 caractères)
                      </label>
                      <div className="relative">
                        <MessageSquare className="absolute left-4 top-4 h-4 w-4 text-iba-navy/45" />
                        <textarea
                          id="contact-message"
                          name="message"
                          rows={6}
                          required
                          minLength={10}
                          maxLength={8000}
                          aria-invalid={fieldErrors.message ? true : undefined}
                          aria-describedby={fieldErrors.message ? "contact-message-error" : undefined}
                          onChange={() => clearFieldError("message")}
                          className={cn(
                            "w-full resize-y border border-iba-sky/20 bg-background py-3 pl-12 pr-4 text-base font-medium text-iba-navy placeholder:text-iba-navy/35 focus:border-iba-navy focus:outline-none focus:ring-1 focus:ring-iba-navy",
                            fieldBorderClass(!!fieldErrors.message),
                          )}
                          placeholder="Décrivez votre demande, le contexte et la meilleure façon de vous joindre…"
                        />
                      </div>
                      {fieldErrors.message ? (
                        <p id="contact-message-error" className="text-sm font-medium text-red-600" role="alert">
                          {fieldErrors.message}
                        </p>
                      ) : null}
                    </div>

                    {submitError ? (
                      <div
                        role="alert"
                        className="mt-6 rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
                      >
                        {submitError}
                      </div>
                    ) : null}

                    <div className="mt-8 flex flex-wrap items-center justify-end gap-4">
                      <Link
                        href="/quotation"
                        className="text-xs font-bold uppercase tracking-wider text-iba-navy/75 underline-offset-4 hover:text-iba-sky hover:underline"
                      >
                        Besoin d&apos;un devis matériaux ?
                      </Link>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={cn(
                          "group inline-flex items-center justify-center border-2 bg-iba-orange px-8 py-4 font-mono text-sm font-bold uppercase tracking-widest text-white transition-all",
                          isSubmitting
                            ? "cursor-not-allowed border-iba-orange opacity-60"
                            : "border-iba-orange hover:bg-iba-orange/90 hover:shadow-[0_0_24px_rgba(255,157,0,0.25)]",
                        )}
                      >
                        <span className="flex items-center">
                          {isSubmitting ? "Envoi…" : "Envoyer le message"}
                          {!isSubmitting && (
                            <Send className="ml-2 h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                          )}
                        </span>
                      </button>
                    </div>
                  </div>
                </form>

                <aside className="hidden lg:block">
                  <div className="sticky top-28 space-y-8 border-l border-iba-sky/10 pl-8">
                    <div>
                      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-iba-navy/55">
                        Direct
                      </p>
                      <p className="mt-2 text-sm font-medium leading-relaxed text-iba-navy/75">
                        Pour une demande de prix sur des produits précis, utilisez plutôt le formulaire devis.
                      </p>
                      <Link
                        href="/quotation"
                        className="mt-4 inline-flex items-center text-xs font-bold uppercase tracking-wider text-iba-navy hover:text-iba-orange"
                      >
                        Demander un devis
                        <ArrowRight className="ml-1 h-3.5 w-3.5" />
                      </Link>
                    </div>
                    <div className="border-t border-iba-sky/10 pt-8">
                      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-iba-navy/55">
                        Délai
                      </p>
                      <p className="mt-2 text-sm text-iba-navy/70">
                        Réponse visée sous <strong className="text-iba-navy">24h ouvrées</strong> après réception.
                      </p>
                    </div>
                  </div>
                </aside>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-iba-navy py-20 text-center text-white">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          aria-hidden
        />
        <div className="relative z-10 mx-auto max-w-3xl px-5">
          <h2 className="mb-6 text-3xl font-black uppercase tracking-tight md:text-4xl">
            Préférez-vous le <span className="text-iba-sky">téléphone</span> ?
          </h2>
          <p className="mb-8 text-lg font-medium text-white/90">
            Appelez-nous au{" "}
            <a href="tel:+24390000922" className="font-bold text-iba-orange hover:underline">
              +243 900 009 22
            </a>
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border-2 border-white bg-transparent px-8 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-iba-navy"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </section>
    </main>
  );
}
