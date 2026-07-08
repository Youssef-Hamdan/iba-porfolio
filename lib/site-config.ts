export const siteConfig = {
  name: "International Business Alliance",
  shortName: "IBA",
  description:
    "Nous connectons les gouvernements, les industries et les capitaux pour bâtir une économie mondiale résiliente, transparente et durable.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://iba-rdc.com",
  locale: "fr_FR",
  email: "info@rdcsteel.com",
  phone: "+24390000922",
  phoneDisplay: "+243 900 009 22",
  address: {
    streetAddress: "Imm. Infinity Center, Bureau n°501, Ave de la Libération",
    addressLocality: "Gombe, Kinshasa",
    addressCountry: "CD",
  },
  logoPath: "/images/logo/iba-logo.png",
  ogImagePath: "/images/hero.webp",
} as const;

export const publicRoutes = [
  { path: "/", changeFrequency: "weekly" as const, priority: 1 },
  { path: "/about", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/products", changeFrequency: "weekly" as const, priority: 0.9 },
  { path: "/projects", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/quotation", changeFrequency: "monthly" as const, priority: 0.7 },
  { path: "/contact", changeFrequency: "monthly" as const, priority: 0.7 },
];
