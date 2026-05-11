"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Search,
  Plus,
  Trash2,
  Send,
  Building2,
  User,
  Mail,
  Phone,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { SectionWave } from "@/components/SectionWave";
import { cn } from "@/lib/utils";
import type { QuoteFieldKey } from "@/app/api/quote/route";

// Importer vos données de produits existantes
import { allProducts, productCategories } from "@/lib/products";

type FieldErrors = Partial<Record<QuoteFieldKey, string>>;

type SelectedItem = {
  id: string;
  name: string;
  categoryLabel: string;
  quantity: number;
};

const fade = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
};

export default function QuotePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [deliveryHint, setDeliveryHint] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  // Form State
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);

  const clearFieldError = (key: QuoteFieldKey) => {
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

  // Filtrer les produits pour la barre de recherche
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return allProducts.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.categoryId.toLowerCase().includes(query)
    ).slice(0, 8); // Limiter à 8 résultats pour l'UI
  }, [searchQuery]);

  // Ajouter un produit au devis
  const addItem = (product: typeof allProducts[0]) => {
    if (!selectedItems.find(item => item.id === product.id)) {
      const categoryLabel = productCategories.find(c => c.id === product.categoryId)?.label || "Autre";
      setSelectedItems([...selectedItems, { 
        id: product.id, 
        name: product.name, 
        categoryLabel, 
        quantity: 1 
      }]);
    }
    setSearchQuery("");
    setIsSearchFocused(false);
    clearFieldError("items");
  };

  // Modifier la quantité
  const updateQuantity = (id: string, delta: number) => {
    setSelectedItems(items => items.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  // Retirer un produit
  const removeItem = (id: string) => {
    setSelectedItems(items => items.filter(item => item.id !== id));
  };

  // Soumission du formulaire → API Resend (voir app/api/quote/route.ts)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);
    setDeliveryHint(null);
    setFieldErrors({});
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      company: String(formData.get("company") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
      items: selectedItems,
    };

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json().catch(() => ({}))) as {
        error?: string;
        deliveryHint?: string;
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
      setDeliveryHint(
        typeof json.deliveryHint === "string" ? json.deliveryHint : null,
      );
      setIsSuccess(true);
    } catch {
      setSubmitError("Problème de connexion. Vérifiez votre réseau et réessayez.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-background selection:bg-iba-navy selection:text-white">
      
      {/* 1. Hero — même logique que Projects : ciel, grille marine, accroche en bandeau tiers (max-w-4xl + paragraphe bordé) */}
      <section className="relative overflow-hidden bg-iba-navy pt-[calc(6rem+2rem)] pb-24 text-white md:pt-[calc(8rem+2rem)] md:pb-32">
        <div className="pointer-events-none absolute -right-24 top-1/4 h-[480px] w-[480px] rounded-full bg-white/[0.06] blur-[100px]" aria-hidden />

        <div
          className="absolute inset-0 z-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(var(--iba-sky) 1px, transparent 1px), linear-gradient(90deg, var(--iba-sky) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 mx-auto max-w-[90rem] px-5 sm:px-8 md:px-16 lg:px-20">
          <motion.div {...fade} className="max-w-4xl">
            <div
              className="absolute -left-6 -top-10 -z-10 select-none text-[8rem] font-black leading-none text-white/[0.06] md:-left-10 md:-top-16 md:text-[12rem]"
              aria-hidden
            >
              REQ
            </div>

            <div className="mb-6 flex items-center gap-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-iba-sky shadow-[0_0_8px_rgba(40,37,97,0.5)]" />
                Formulaire d&apos;acquisition
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-iba-sky/35 to-transparent" aria-hidden />
            </div>

            <h1 className="mt-4 text-5xl font-black uppercase leading-[0.95] tracking-tighter text-white sm:text-6xl md:text-8xl">
              Demande de{" "}
              <span className="text-iba-sky">devis</span>
            </h1>
            <p className="mt-8 max-w-2xl border-l-2 border-iba-sky pl-6 text-lg font-medium leading-relaxed text-white/85 md:text-xl">
              Configurez vos besoins en matériaux pour votre prochain chantier. Notre équipe technique vous fournira une cotation précise dans les plus brefs délais.
            </p>
          </motion.div>
        </div>
        <SectionWave edge="bottom" fillClassName="fill-background" heightClassName="h-12 md:h-16" />
      </section>

      {/* 2. THE QUOTATION FORM (TECHNICAL MANIFEST) — ligne verticale au centre comme Projects */}
      <section className="relative bg-background py-16 md:py-24 lg:py-32">
        <div className="absolute left-1/2 top-0 bottom-0 hidden w-px -translate-x-1/2 bg-iba-navy/15 lg:block" aria-hidden />

        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(circle at 0 0, var(--iba-sky) 1px, transparent 2px)`,
            backgroundSize: "40px 40px",
          }}
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
              <h2 className="mb-4 text-3xl font-black uppercase tracking-tighter text-iba-sky md:text-4xl">
                Demande Transmise
              </h2>
              <p className="max-w-lg text-lg font-medium text-iba-sky/70">
                Votre manifeste a été envoyé à notre bureau d&apos;études. Un ingénieur commercial prendra contact avec vous sous 24h ouvrées.
              </p>
              {deliveryHint ? (
                <p className="mt-6 max-w-xl rounded-sm border border-amber-200 bg-amber-50 px-4 py-3 text-left text-sm text-amber-950">
                  {deliveryHint}
                </p>
              ) : null}
              <button onClick={() => { setIsSuccess(false); setSelectedItems([]); setSubmitError(null); setDeliveryHint(null); setFieldErrors({}); }} className="mt-8 font-mono text-sm font-bold uppercase tracking-widest text-iba-navy hover:text-iba-sky transition-colors">
                Nouveau Devis →
              </button>
            </motion.div>
          ) : (
            <>
            <form onSubmit={handleSubmit} className="flex flex-col gap-12 lg:col-span-2">
              
              {/* PHASE 01: Identification */}
              <div className="relative border border-iba-sky/15 bg-white p-8 md:p-12 shadow-[0_10px_40px_rgba(40,37,97,0.03)]">
                {/* Structural Corners */}
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-iba-sky" />
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-iba-sky" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-iba-sky" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-iba-sky" />

                <div className="mb-8 flex items-end gap-4 border-b border-iba-sky/10 pb-4">
                  <span className="font-mono text-4xl font-black text-iba-sky/10">01</span>
                  <h2 className="text-2xl font-black uppercase tracking-tighter text-iba-sky">Identification du Client</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="quote-name" className="font-mono text-[10px] font-bold uppercase tracking-widest text-iba-sky/60">Nom complet *</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-iba-sky/40" />
                      <input
                        id="quote-name"
                        name="name"
                        type="text"
                        required
                        autoComplete="name"
                        aria-invalid={fieldErrors.name ? true : undefined}
                        aria-describedby={fieldErrors.name ? "quote-name-error" : undefined}
                        onChange={() => clearFieldError("name")}
                        className={cn(
                          "w-full border border-iba-sky/20 bg-background pl-12 pr-4 py-3 font-medium text-iba-sky placeholder:text-iba-sky/30 focus:border-iba-navy focus:outline-none focus:ring-1 focus:ring-iba-navy transition-all",
                          fieldBorderClass(!!fieldErrors.name),
                        )}
                        placeholder="Jean Dupont"
                      />
                    </div>
                    {fieldErrors.name ? (
                      <p id="quote-name-error" className="text-sm font-medium text-red-600" role="alert">
                        {fieldErrors.name}
                      </p>
                    ) : null}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="quote-company" className="font-mono text-[10px] font-bold uppercase tracking-widest text-iba-sky/60">Entreprise / Projet</label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-iba-sky/40" />
                      <input
                        id="quote-company"
                        name="company"
                        type="text"
                        autoComplete="organization"
                        aria-invalid={fieldErrors.company ? true : undefined}
                        aria-describedby={fieldErrors.company ? "quote-company-error" : undefined}
                        onChange={() => clearFieldError("company")}
                        className={cn(
                          "w-full border border-iba-sky/20 bg-background pl-12 pr-4 py-3 font-medium text-iba-sky placeholder:text-iba-sky/30 focus:border-iba-navy focus:outline-none focus:ring-1 focus:ring-iba-navy transition-all",
                          fieldBorderClass(!!fieldErrors.company),
                        )}
                        placeholder="Construction S.A."
                      />
                    </div>
                    {fieldErrors.company ? (
                      <p id="quote-company-error" className="text-sm font-medium text-red-600" role="alert">
                        {fieldErrors.company}
                      </p>
                    ) : null}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="quote-email" className="font-mono text-[10px] font-bold uppercase tracking-widest text-iba-sky/60">Adresse Email *</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-iba-sky/40" />
                      <input
                        id="quote-email"
                        required
                        name="email"
                        type="email"
                        autoComplete="email"
                        aria-invalid={fieldErrors.email ? true : undefined}
                        aria-describedby={fieldErrors.email ? "quote-email-error" : undefined}
                        onChange={() => clearFieldError("email")}
                        className={cn(
                          "w-full border border-iba-sky/20 bg-background pl-12 pr-4 py-3 font-medium text-iba-sky placeholder:text-iba-sky/30 focus:border-iba-navy focus:outline-none focus:ring-1 focus:ring-iba-navy transition-all",
                          fieldBorderClass(!!fieldErrors.email),
                        )}
                        placeholder="contact@entreprise.com"
                      />
                    </div>
                    {fieldErrors.email ? (
                      <p id="quote-email-error" className="text-sm font-medium text-red-600" role="alert">
                        {fieldErrors.email}
                      </p>
                    ) : null}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="quote-phone" className="font-mono text-[10px] font-bold uppercase tracking-widest text-iba-sky/60">Téléphone *</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-iba-sky/40" />
                      <input
                        id="quote-phone"
                        required
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        aria-invalid={fieldErrors.phone ? true : undefined}
                        aria-describedby={fieldErrors.phone ? "quote-phone-error" : undefined}
                        onChange={() => clearFieldError("phone")}
                        className={cn(
                          "w-full border border-iba-sky/20 bg-background pl-12 pr-4 py-3 font-medium text-iba-sky placeholder:text-iba-sky/30 focus:border-iba-navy focus:outline-none focus:ring-1 focus:ring-iba-navy transition-all",
                          fieldBorderClass(!!fieldErrors.phone),
                        )}
                        placeholder="+243 ..."
                      />
                    </div>
                    {fieldErrors.phone ? (
                      <p id="quote-phone-error" className="text-sm font-medium text-red-600" role="alert">
                        {fieldErrors.phone}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* PHASE 02: Matériaux */}
              <div className="relative border border-iba-sky/15 bg-white p-8 md:p-12 shadow-[0_10px_40px_rgba(40,37,97,0.03)]">
                {/* Structural Corners */}
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-iba-sky" />
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-iba-sky" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-iba-sky" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-iba-sky" />

                <div className="mb-8 flex items-end gap-4 border-b border-iba-sky/10 pb-4">
                  <span className="font-mono text-4xl font-black text-iba-sky/10">02</span>
                  <h2 className="text-2xl font-black uppercase tracking-tighter text-iba-sky">Spécifications Matériaux</h2>
                </div>

                {/* SEARCH BAR (Product Selector) */}
                <div className="relative mb-8 z-50">
                  <label htmlFor="quote-product-search" className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-widest text-iba-sky/60">Rechercher et ajouter un produit</label>
                  {fieldErrors.items ? (
                    <p id="quote-items-error" className="mb-3 text-sm font-medium text-red-600" role="alert">
                      {fieldErrors.items}
                    </p>
                  ) : null}
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-iba-navy" />
                    <input 
                      id="quote-product-search"
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        clearFieldError("items");
                      }}
                      onFocus={() => setIsSearchFocused(true)}
                      aria-invalid={fieldErrors.items ? true : undefined}
                      aria-describedby={fieldErrors.items ? "quote-items-error" : undefined}
                      className={cn(
                        "w-full border-2 border-iba-sky bg-background pl-12 pr-4 py-4 font-bold text-iba-sky placeholder:text-iba-sky/30 focus:border-iba-navy focus:outline-none transition-all",
                        fieldBorderClass(!!fieldErrors.items),
                      )}
                      placeholder="Ex: Tôle IBR, Ciment, Sikalite..." 
                    />
                  </div>

                  {/* Dropdown Results */}
                  <AnimatePresence>
                    {isSearchFocused && searchQuery.trim().length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                        className="absolute left-0 right-0 top-full mt-2 overflow-hidden border border-iba-sky/20 bg-white shadow-2xl"
                      >
                        {searchResults.length > 0 ? (
                          <ul className="max-h-64 overflow-y-auto">
                            {searchResults.map(product => (
                              <li key={product.id}>
                                <button
                                  type="button"
                                  onClick={() => addItem(product)}
                                  className="flex w-full items-center justify-between border-b border-iba-sky/5 px-4 py-3 text-left hover:bg-iba-sky/5"
                                >
                                  <div>
                                    <p className="font-bold text-iba-sky">{product.name}</p>
                                    <p className="font-mono text-[10px] uppercase text-iba-sky/50">{productCategories.find(c => c.id === product.categoryId)?.label}</p>
                                  </div>
                                  <Plus className="h-4 w-4 text-iba-navy" />
                                </button>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="p-4 text-center text-sm font-medium text-iba-sky/50">Aucun produit trouvé.</div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* SELECTED ITEMS CART */}
                <div className="bg-iba-sky/[0.02] border border-iba-sky/10 p-1 min-h-[150px]">
                  {selectedItems.length === 0 ? (
                    <div className="flex h-[150px] items-center justify-center flex-col text-center">
                      <p className="font-mono text-xs font-bold uppercase tracking-widest text-iba-sky/40">Le manifeste est vide</p>
                      <p className="text-sm text-iba-sky/40 mt-1">Utilisez la barre de recherche pour ajouter des matériaux</p>
                    </div>
                  ) : (
                    <ul className="divide-y divide-iba-sky/10">
                      {selectedItems.map((item, index) => (
                        <motion.li 
                          layout
                          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                          key={item.id} 
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white hover:bg-iba-sky/[0.01] transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <span className="font-mono text-[10px] font-bold text-iba-sky/30">
                              {(index + 1).toString().padStart(2, '0')}
                            </span>
                            <div>
                              <p className="font-bold text-iba-sky">{item.name}</p>
                              <p className="font-mono text-[10px] uppercase text-iba-navy">{item.categoryLabel}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 self-end sm:self-auto">
                            <div className="flex items-center border border-iba-sky/20 bg-background">
                              <button type="button" onClick={() => updateQuantity(item.id, -1)} className="px-3 py-1 text-iba-sky hover:text-iba-navy hover:bg-iba-sky/5 transition-colors">-</button>
                              <span className="w-12 text-center font-mono text-sm font-bold text-iba-sky">{item.quantity}</span>
                              <button type="button" onClick={() => updateQuantity(item.id, 1)} className="px-3 py-1 text-iba-sky hover:text-iba-navy hover:bg-iba-sky/5 transition-colors">+</button>
                            </div>
                            <span className="font-mono text-[10px] uppercase text-iba-sky/50 mr-2">Unités</span>
                            <button type="button" onClick={() => removeItem(item.id)} className="p-2 text-red-500/50 hover:bg-red-50 hover:text-red-600 transition-colors rounded-sm">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </motion.li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* PHASE 03: Logistique */}
              <div className="relative border border-iba-sky/15 bg-white p-8 md:p-12 shadow-[0_10px_40px_rgba(40,37,97,0.03)]">
                {/* Structural Corners */}
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-iba-sky" />
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-iba-sky" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-iba-sky" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-iba-sky" />

                <div className="mb-8 flex items-end gap-4 border-b border-iba-sky/10 pb-4">
                  <span className="font-mono text-4xl font-black text-iba-sky/10">03</span>
                  <h2 className="text-2xl font-black uppercase tracking-tighter text-iba-sky">Détails Logistiques</h2>
                </div>

                <div className="space-y-2">
                  <label htmlFor="quote-message" className="font-mono text-[10px] font-bold uppercase tracking-widest text-iba-sky/60">Informations supplémentaires (Lieu de livraison, délais, contraintes)</label>
                  <textarea
                    id="quote-message"
                    name="message"
                    rows={5}
                    aria-invalid={fieldErrors.message ? true : undefined}
                    aria-describedby={fieldErrors.message ? "quote-message-error" : undefined}
                    onChange={() => clearFieldError("message")}
                    className={cn(
                      "w-full border border-iba-sky/20 bg-background p-4 font-medium text-iba-sky placeholder:text-iba-sky/30 focus:border-iba-navy focus:outline-none focus:ring-1 focus:ring-iba-navy transition-all resize-none",
                      fieldBorderClass(!!fieldErrors.message),
                    )}
                    placeholder="Veuillez préciser le lieu exact de livraison à Kinshasa et toute contrainte d&apos;accès pour les camions lourds..."
                  />
                  {fieldErrors.message ? (
                    <p id="quote-message-error" className="text-sm font-medium text-red-600" role="alert">
                      {fieldErrors.message}
                    </p>
                  ) : null}
                </div>
              </div>

              {/* SUBMIT */}
              {submitError ? (
                <div
                  role="alert"
                  className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
                >
                  {submitError}
                </div>
              ) : null}
              <div className="flex justify-end lg:justify-start">
                <button
                  type="submit"
                  disabled={isSubmitting || selectedItems.length === 0}
                  className={cn(
                    "group relative inline-flex items-center justify-center overflow-hidden border-2 bg-iba-orange px-10 py-5 font-mono text-sm font-bold uppercase tracking-widest text-white transition-all",
                    isSubmitting || selectedItems.length === 0 
                      ? "opacity-50 cursor-not-allowed border-iba-orange" 
                      : "border-iba-orange hover:bg-iba-orange/90 hover:border-iba-orange/90 shadow-[0_0_20px_rgba(255,157,0,0.2)] hover:shadow-[0_0_30px_rgba(255,157,0,0.4)]"
                  )}
                >
                  <span className="relative z-10 flex items-center">
                    {isSubmitting ? "Transmission..." : "Soumettre le Manifeste"}
                    {!isSubmitting && <Send className="ml-3 h-4 w-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />}
                  </span>
                  {!isSubmitting && selectedItems.length > 0 && (
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
                  )}
                </button>
              </div>

            </form>

            <aside className="hidden lg:col-span-1 lg:block">
              <div className="sticky top-28 space-y-10 border-l border-iba-sky/10 pl-8">
                <div>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-iba-sky/45">
                    Parcours
                  </p>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-iba-sky/65">
                    Trois phases : identité, matériaux, puis contraintes logistiques.
                  </p>
                </div>
                <ol className="space-y-6 border-t border-iba-sky/10 pt-8">
                  <li className="flex gap-4">
                    <span className="font-mono text-2xl font-black text-iba-navy/80">01</span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-iba-sky">Identification</p>
                      <p className="mt-1 text-xs text-iba-sky/55">Coordonnées et société</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="font-mono text-2xl font-black text-iba-navy/80">02</span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-iba-sky">Matériaux</p>
                      <p className="mt-1 text-xs text-iba-sky/55">Recherche et manifeste</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="font-mono text-2xl font-black text-iba-navy/80">03</span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-iba-sky">Logistique</p>
                      <p className="mt-1 text-xs text-iba-sky/55">Livraison, délais, accès</p>
                    </div>
                  </li>
                </ol>
                <p className="border-t border-iba-sky/10 pt-8 font-mono text-[10px] uppercase leading-relaxed text-iba-sky/40">
                  Réponse ciblée sous 24h ouvrées après réception du manifeste complet.
                </p>
              </div>
            </aside>
            </>
          )}
          </div>
        </div>
      </section>

      {/* 3. CTA — aligné sur Projects */}
      <section className="relative overflow-hidden bg-iba-navy py-24 text-center text-white">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          aria-hidden
        />
        <div className="relative z-10 mx-auto max-w-3xl px-5">
          <h2 className="mb-6 text-3xl font-black uppercase tracking-tight md:text-5xl">
            Une question avant{" "}
            <span className="text-iba-sky">d&apos;envoyer</span> ?
          </h2>
          <p className="mb-10 text-lg font-medium text-white/90">
            Notre équipe peut vous guider sur les matériaux et les délais avant de finaliser votre manifeste.
          </p>
          <Link
            href="/contact"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-iba-orange px-8 py-4 text-sm font-bold uppercase tracking-widest text-white shadow-lg shadow-iba-orange/25 transition-all hover:bg-white hover:text-iba-orange"
          >
            <span className="relative z-10 flex items-center">
              Contacter IBA
              <ArrowRight className="ml-3 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}