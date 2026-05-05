"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

// Importer vos données de produits existantes
import { allProducts, productCategories } from "@/lib/products"; 

type SelectedItem = {
  id: string;
  name: string;
  categoryLabel: string;
  quantity: number;
}

export default function QuotePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [deliveryHint, setDeliveryHint] = useState<string | null>(null);

  // Form State
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);

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
      };

      if (!res.ok) {
        setSubmitError(
          typeof json.error === "string"
            ? json.error
            : "Envoi impossible pour le moment. Réessayez plus tard.",
        );
        return;
      }

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
    <main className="flex min-h-screen flex-col bg-background selection:bg-iba-sky selection:text-white">
      
      {/* 1. ARCHITECTURAL HERO SECTION */}
      <section className="relative overflow-hidden bg-iba-navy pt-[calc(6rem+2rem)] pb-16 md:pt-[calc(8rem+2rem)] md:pb-24 text-white border-b-4 border-iba-sky">
        
        {/* Blueprint Background */}
        <div className="absolute inset-0 z-0 opacity-[0.05] mix-blend-screen"
          style={{ 
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px' 
          }} 
        />
        
        <div className="relative z-10 mx-auto max-w-[90rem] px-5 sm:px-8 md:px-16 lg:px-20">
          {/* Règle des tiers : ~2/3 titre (poids visuel gauche), ~1/3 texte d’appui */}
          <div className="grid min-h-[min(52vh,36rem)] grid-cols-1 items-end gap-10 pb-2 lg:grid-cols-3 lg:gap-x-12 lg:gap-y-14">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative lg:col-span-2"
            >
              <div className="absolute -left-6 -top-10 -z-10 select-none text-[8rem] font-black leading-none text-transparent md:-left-10 md:-top-16 md:text-[12rem] [-webkit-text-stroke:2px_rgba(255,255,255,0.05)]">
                REQ
              </div>

              <div className="mb-6 flex items-center gap-4">
                <span className="flex items-center gap-2 rounded-sm border border-iba-sky/30 bg-iba-sky/10 px-4 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-iba-sky backdrop-blur-md">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-iba-sky" />
                  Formulaire d&apos;acquisition
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-iba-sky/30 to-transparent lg:max-w-[66%]" />
              </div>

              <h1 className="mt-4 text-5xl font-black uppercase leading-[0.95] tracking-tighter text-white sm:text-6xl md:text-7xl xl:text-8xl">
                Demande de{" "}
                <span className="bg-gradient-to-r from-white via-iba-sky to-iba-blue bg-clip-text text-transparent">
                  Devis
                </span>
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-1 lg:self-end lg:border-l lg:border-iba-sky/25 lg:pl-8"
            >
              <p className="max-w-md text-base font-medium leading-relaxed text-white/70 md:text-lg">
                Configurez vos besoins en matériaux pour votre prochain chantier. Notre équipe technique vous fournira une cotation précise dans les plus brefs délais.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. THE QUOTATION FORM (TECHNICAL MANIFEST) */}
      <section className="relative bg-background py-16 md:py-24">
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none"
          style={{ 
            backgroundImage: `radial-gradient(circle at 0 0, var(--iba-navy) 1px, transparent 2px)`,
            backgroundSize: '40px 40px',
            opacity: 0.05
          }} 
        />

        <div className="relative z-10 mx-auto max-w-[90rem] px-5 sm:px-8 md:px-12 lg:px-20">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-16">
          {isSuccess ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className="flex flex-col items-center justify-center border-y-8 border-double border-iba-sky/20 bg-iba-sky/5 p-12 text-center shadow-lg lg:col-span-3"
            >
              <CheckCircle2 className="mb-6 h-20 w-20 text-iba-sky" />
              <h2 className="mb-4 text-3xl font-black uppercase tracking-tighter text-iba-navy md:text-4xl">
                Demande Transmise
              </h2>
              <p className="max-w-lg text-lg font-medium text-iba-navy/70">
                Votre manifeste a été envoyé à notre bureau d'études. Un ingénieur commercial prendra contact avec vous sous 24h ouvrées.
              </p>
              {deliveryHint ? (
                <p className="mt-6 max-w-xl rounded-sm border border-amber-200 bg-amber-50 px-4 py-3 text-left text-sm text-amber-950">
                  {deliveryHint}
                </p>
              ) : null}
              <button onClick={() => { setIsSuccess(false); setSelectedItems([]); setSubmitError(null); setDeliveryHint(null); }} className="mt-8 font-mono text-sm font-bold uppercase tracking-widest text-iba-sky hover:text-iba-navy transition-colors">
                Nouveau Devis →
              </button>
            </motion.div>
          ) : (
            <>
            <form onSubmit={handleSubmit} className="flex flex-col gap-12 lg:col-span-2">
              
              {/* PHASE 01: Identification */}
              <div className="relative border border-iba-navy/15 bg-white p-8 md:p-12 shadow-[0_10px_40px_rgba(40,37,97,0.03)]">
                {/* Structural Corners */}
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-iba-navy" />
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-iba-navy" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-iba-navy" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-iba-navy" />

                <div className="mb-8 flex items-end gap-4 border-b border-iba-navy/10 pb-4">
                  <span className="font-mono text-4xl font-black text-iba-navy/10">01</span>
                  <h2 className="text-2xl font-black uppercase tracking-tighter text-iba-navy">Identification du Client</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-iba-navy/60">Nom complet *</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-iba-navy/40" />
                      <input required name="name" type="text" className="w-full border border-iba-navy/20 bg-background pl-12 pr-4 py-3 font-medium text-iba-navy placeholder:text-iba-navy/30 focus:border-iba-sky focus:outline-none focus:ring-1 focus:ring-iba-sky transition-all" placeholder="Jean Dupont" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-iba-navy/60">Entreprise / Projet</label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-iba-navy/40" />
                      <input name="company" type="text" className="w-full border border-iba-navy/20 bg-background pl-12 pr-4 py-3 font-medium text-iba-navy placeholder:text-iba-navy/30 focus:border-iba-sky focus:outline-none focus:ring-1 focus:ring-iba-sky transition-all" placeholder="Construction S.A." />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-iba-navy/60">Adresse Email *</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-iba-navy/40" />
                      <input required name="email" type="email" className="w-full border border-iba-navy/20 bg-background pl-12 pr-4 py-3 font-medium text-iba-navy placeholder:text-iba-navy/30 focus:border-iba-sky focus:outline-none focus:ring-1 focus:ring-iba-sky transition-all" placeholder="contact@entreprise.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-iba-navy/60">Téléphone *</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-iba-navy/40" />
                      <input required name="phone" type="tel" className="w-full border border-iba-navy/20 bg-background pl-12 pr-4 py-3 font-medium text-iba-navy placeholder:text-iba-navy/30 focus:border-iba-sky focus:outline-none focus:ring-1 focus:ring-iba-sky transition-all" placeholder="+243 ..." />
                    </div>
                  </div>
                </div>
              </div>

              {/* PHASE 02: Matériaux */}
              <div className="relative border border-iba-navy/15 bg-white p-8 md:p-12 shadow-[0_10px_40px_rgba(40,37,97,0.03)]">
                {/* Structural Corners */}
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-iba-navy" />
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-iba-navy" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-iba-navy" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-iba-navy" />

                <div className="mb-8 flex items-end gap-4 border-b border-iba-navy/10 pb-4">
                  <span className="font-mono text-4xl font-black text-iba-navy/10">02</span>
                  <h2 className="text-2xl font-black uppercase tracking-tighter text-iba-navy">Spécifications Matériaux</h2>
                </div>

                {/* SEARCH BAR (Product Selector) */}
                <div className="relative mb-8 z-50">
                  <label className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-widest text-iba-navy/60">Rechercher et ajouter un produit</label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-iba-sky" />
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setIsSearchFocused(true)}
                      className="w-full border-2 border-iba-navy bg-background pl-12 pr-4 py-4 font-bold text-iba-navy placeholder:text-iba-navy/30 focus:border-iba-sky focus:outline-none transition-all" 
                      placeholder="Ex: Tôle IBR, Ciment, Sikalite..." 
                    />
                  </div>

                  {/* Dropdown Results */}
                  <AnimatePresence>
                    {isSearchFocused && searchQuery.trim().length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                        className="absolute left-0 right-0 top-full mt-2 overflow-hidden border border-iba-navy/20 bg-white shadow-2xl"
                      >
                        {searchResults.length > 0 ? (
                          <ul className="max-h-64 overflow-y-auto">
                            {searchResults.map(product => (
                              <li key={product.id}>
                                <button
                                  type="button"
                                  onClick={() => addItem(product)}
                                  className="flex w-full items-center justify-between border-b border-iba-navy/5 px-4 py-3 text-left hover:bg-iba-navy/5"
                                >
                                  <div>
                                    <p className="font-bold text-iba-navy">{product.name}</p>
                                    <p className="font-mono text-[10px] uppercase text-iba-navy/50">{productCategories.find(c => c.id === product.categoryId)?.label}</p>
                                  </div>
                                  <Plus className="h-4 w-4 text-iba-sky" />
                                </button>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="p-4 text-center text-sm font-medium text-iba-navy/50">Aucun produit trouvé.</div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* SELECTED ITEMS CART */}
                <div className="bg-iba-navy/[0.02] border border-iba-navy/10 p-1 min-h-[150px]">
                  {selectedItems.length === 0 ? (
                    <div className="flex h-[150px] items-center justify-center flex-col text-center">
                      <p className="font-mono text-xs font-bold uppercase tracking-widest text-iba-navy/40">Le manifeste est vide</p>
                      <p className="text-sm text-iba-navy/40 mt-1">Utilisez la barre de recherche pour ajouter des matériaux</p>
                    </div>
                  ) : (
                    <ul className="divide-y divide-iba-navy/10">
                      {selectedItems.map((item, index) => (
                        <motion.li 
                          layout
                          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                          key={item.id} 
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white hover:bg-iba-navy/[0.01] transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <span className="font-mono text-[10px] font-bold text-iba-navy/30">
                              {(index + 1).toString().padStart(2, '0')}
                            </span>
                            <div>
                              <p className="font-bold text-iba-navy">{item.name}</p>
                              <p className="font-mono text-[10px] uppercase text-iba-sky">{item.categoryLabel}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 self-end sm:self-auto">
                            <div className="flex items-center border border-iba-navy/20 bg-background">
                              <button type="button" onClick={() => updateQuantity(item.id, -1)} className="px-3 py-1 text-iba-navy hover:text-iba-sky hover:bg-iba-navy/5 transition-colors">-</button>
                              <span className="w-12 text-center font-mono text-sm font-bold text-iba-navy">{item.quantity}</span>
                              <button type="button" onClick={() => updateQuantity(item.id, 1)} className="px-3 py-1 text-iba-navy hover:text-iba-sky hover:bg-iba-navy/5 transition-colors">+</button>
                            </div>
                            <span className="font-mono text-[10px] uppercase text-iba-navy/50 mr-2">Unités</span>
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
              <div className="relative border border-iba-navy/15 bg-white p-8 md:p-12 shadow-[0_10px_40px_rgba(40,37,97,0.03)]">
                {/* Structural Corners */}
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-iba-navy" />
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-iba-navy" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-iba-navy" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-iba-navy" />

                <div className="mb-8 flex items-end gap-4 border-b border-iba-navy/10 pb-4">
                  <span className="font-mono text-4xl font-black text-iba-navy/10">03</span>
                  <h2 className="text-2xl font-black uppercase tracking-tighter text-iba-navy">Détails Logistiques</h2>
                </div>

                <div className="space-y-2">
                  <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-iba-navy/60">Informations supplémentaires (Lieu de livraison, délais, contraintes)</label>
                  <textarea name="message" rows={5} className="w-full border border-iba-navy/20 bg-background p-4 font-medium text-iba-navy placeholder:text-iba-navy/30 focus:border-iba-sky focus:outline-none focus:ring-1 focus:ring-iba-sky transition-all resize-none" placeholder="Veuillez préciser le lieu exact de livraison à Kinshasa et toute contrainte d'accès pour les camions lourds..."></textarea>
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
              <div className="flex justify-end lg:justify-start lg:pl-[11.11%]">
                <button
                  type="submit"
                  disabled={isSubmitting || selectedItems.length === 0}
                  className={cn(
                    "group relative inline-flex items-center justify-center overflow-hidden border-2 bg-iba-navy px-10 py-5 font-mono text-sm font-bold uppercase tracking-widest text-white transition-all",
                    isSubmitting || selectedItems.length === 0 
                      ? "opacity-50 cursor-not-allowed border-iba-navy" 
                      : "border-iba-navy hover:bg-iba-sky hover:border-iba-sky shadow-[0_0_20px_rgba(40,37,97,0.2)] hover:shadow-[0_0_30px_rgba(0,170,226,0.4)]"
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
              <div className="sticky top-28 space-y-10 border-l border-iba-navy/10 pl-8">
                <div>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-iba-navy/45">
                    Parcours
                  </p>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-iba-navy/65">
                    Trois phases : identité, matériaux, puis contraintes logistiques.
                  </p>
                </div>
                <ol className="space-y-6 border-t border-iba-navy/10 pt-8">
                  <li className="flex gap-4">
                    <span className="font-mono text-2xl font-black text-iba-sky/80">01</span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-iba-navy">Identification</p>
                      <p className="mt-1 text-xs text-iba-navy/55">Coordonnées et société</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="font-mono text-2xl font-black text-iba-sky/80">02</span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-iba-navy">Matériaux</p>
                      <p className="mt-1 text-xs text-iba-navy/55">Recherche et manifeste</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="font-mono text-2xl font-black text-iba-sky/80">03</span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-iba-navy">Logistique</p>
                      <p className="mt-1 text-xs text-iba-navy/55">Livraison, délais, accès</p>
                    </div>
                  </li>
                </ol>
                <p className="border-t border-iba-navy/10 pt-8 font-mono text-[10px] uppercase leading-relaxed text-iba-navy/40">
                  Réponse ciblée sous 24h ouvrées après réception du manifeste complet.
                </p>
              </div>
            </aside>
            </>
          )}
          </div>
        </div>
      </section>
    </main>
  );
}