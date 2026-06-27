/** Folder name under `/public/images/` (physical storage). */
export type ImageStorageFolder =
  | "cement-mortar-plaster"
  | "paints-coatings-sealants"
  | "sheet-metal-pipes-wood"
  | "tools-consumables"
  | "brique"
  | "pave";

/**
 * One commercial family per id (some categories group related finishes on purpose).
 */
export type ProductCategoryId =
  | "acier-fer"
  | "ciment"
  | "ciment-colle"
  | "produits-sika"
  | "beton"
  | "brique"
  | "peinture"
  | "bois"
  | "outillage-quincaillerie"
  | "plafonds"
  | "panneaux-sandwich"
  | "pave";

export type AcierFerSubcategoryId = "fer-a-beton" | "clous" | "acier";
export type PeintureSubcategoryId = "peinture-a-eau" | "peinture-a-huile" | "antirouille";
export type ProductSubcategoryId = AcierFerSubcategoryId | PeintureSubcategoryId;

export interface ProductSubcategory {
  id: ProductSubcategoryId;
  categoryId: "acier-fer" | "peinture";
  label: string;
}

export interface ProductCategory {
  id: ProductCategoryId;
  label: string;
  description: string;
  coverStorageFolder: ImageStorageFolder;
  coverFile: string;
}

export interface ProductItem {
  id: string;
  categoryId: ProductCategoryId;
  subcategoryId?: ProductSubcategoryId;
  storageFolder: ImageStorageFolder;
  file: string;
  name: string;
}

export const productSubcategories: ProductSubcategory[] = [
  { id: "fer-a-beton", categoryId: "acier-fer", label: "Fer à Béton" },
  { id: "clous", categoryId: "acier-fer", label: "Clous" },
  { id: "acier", categoryId: "acier-fer", label: "Acier" },
  { id: "peinture-a-eau", categoryId: "peinture", label: "Peinture à Eau" },
  { id: "peinture-a-huile", categoryId: "peinture", label: "Peinture à Huile" },
  { id: "antirouille", categoryId: "peinture", label: "Antirouille" },
];

export const productCategories: ProductCategory[] = [
  {
    id: "acier-fer",
    label: "Acier & Fer",
    description: "Fer à béton, clous, tôles, profilés et tubes acier pour structures robustes.",
    coverStorageFolder: "sheet-metal-pipes-wood",
    coverFile: "tole IBR.png",
  },
  {
    id: "ciment",
    label: "Ciment",
    description: "Liens hydrauliques et ciments en sac pour gros œuvre.",
    coverStorageFolder: "cement-mortar-plaster",
    coverFile: "CIMENT.jpeg",
  },
  {
    id: "ciment-colle",
    label: "Ciment Colle",
    description: "Ciments-colles et mortiers-colles pour carrelage et finitions.",
    coverStorageFolder: "cement-mortar-plaster",
    coverFile: "CIMENT COLLE C2 EAGLE 20 KG -GRIS.png",
  },
  {
    id: "produits-sika",
    label: "Produits Sika",
    description: "Produits Sika : ancrages, joints, enduits et solutions techniques.",
    coverStorageFolder: "cement-mortar-plaster",
    coverFile: "Super Sikalite.webp",
  },
  {
    id: "beton",
    label: "Béton Prêt à l'Emploi",
    description: "Béton prêt à l'emploi livré directement sur vos chantiers.",
    coverStorageFolder: "cement-mortar-plaster",
    coverFile: "Super Sikalite.webp",
  },
  {
    id: "brique",
    label: "Brique",
    description: "Briques de construction pleines et creuses de haute qualité.",
    coverStorageFolder: "brique",
    coverFile: "BRIQUE 10 PLEINE.webp",
  },
  {
    id: "peinture",
    label: "Peinture",
    description: "Peintures à l'eau, à l'huile et traitements antirouille.",
    coverStorageFolder: "paints-coatings-sealants",
    coverFile: "LATEX INT EAGLE.webp",
  },
  {
    id: "bois",
    label: "Bois",
    description: "Bois de charpente, coffrage, menuiserie et panneaux dérivés.",
    coverStorageFolder: "sheet-metal-pipes-wood",
    coverFile: "PLYWOOD.png",
  },
  {
    id: "outillage-quincaillerie",
    label: "Outillage Quincaillerie JKL",
    description: "Outils de coupe, d'atelier et quincaillerie générale.",
    coverStorageFolder: "tools-consumables",
    coverFile: "Cisaille.png",
  },
  {
    id: "plafonds",
    label: "Plafonds",
    description: "Solutions complètes pour plafonds suspendus, plâtre et isolation.",
    coverStorageFolder: "cement-mortar-plaster",
    coverFile: "gyproc.webp",
  },
  {
    id: "panneaux-sandwich",
    label: "Panneaux Sandwich",
    description: "Panneaux isolants pour toitures et bardages industriels.",
    coverStorageFolder: "sheet-metal-pipes-wood",
    coverFile: "panneau-sandwich.jpeg",
  },
  {
    id: "pave",
    label: "Pavé",
    description: "Pavés autobloquants pour aménagements extérieurs.",
    coverStorageFolder: "pave",
    coverFile: "PAVE BARKIA 6 CM.webp",
  },
];

function humanizeFilename(file: string): string {
  const base = file.replace(/\.[^.]+$/i, "");
  return base.replace(/\s+/g, " ").trim();
}

function slugFromFile(categoryId: string, storageFolder: string, file: string): string {
  const safe = file.replace(/\.[^.]+$/i, "").replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase();
  return `${categoryId}-${storageFolder}-${safe}`;
}

function buildItems(
  categoryId: ProductCategoryId,
  storageFolder: ImageStorageFolder,
  files: readonly string[],
  subcategoryId?: ProductSubcategoryId,
): ProductItem[] {
  return files.map((file) => ({
    id: slugFromFile(categoryId, storageFolder, file),
    categoryId,
    subcategoryId,
    storageFolder,
    file,
    name: humanizeFilename(file),
  }));
}

const cimentFiles = [
  "CIMENT.jpeg",
  "CIMENT CILU 32.5.webp",
  "CIMENT CILU 42.5.webp",
  "CIMKO 32.5.webp",
  "CIMKO 42.5.webp",
  "PPC 32.5.webp",
  "PPC 42.5.webp",
] as const;

const cimentColleFiles = [
  "CIMENT COLLE C2 EAGLE 20 KG -GRIS.png",
  "CIMENT COLLE C2 EAGLE 20 KG-BLANC.png",
  "CIMENT COLLE EAGLE PRO 20KG-GREY C1.png",
  "CIMENT COLLE EAGLE PRO 20KG-WHITE C1.png",
  "CIMENT KIN COLLE BLANC 20 KG C1.png",
  // "FILLASSE EAGLE.webp",
] as const;

const sikaFiles = [
  "Super Sikalite.webp",
  "SIKA ANCHORFIX 3030(AB).webp",
  "SIKA IGOL P 25KG.webp",
  "SIKAGROUT 212  30KG.webp",
  "SIKALATEX LIGHT  5 L.webp",
  "SIKATOP -107 SEAL  COMP.B 20KG.webp",
  "Sikadur-31+ 1.2kg.webp",
  "Sikaflex 11FC.webp",
  "SIKA FLEX PRO-3 600ML.webp",
  "SIKAFLOOR-3 QUARTZ TOP 25 KG.webp",
  // "Sikagard 570 pele elástica+fibra.webp",
  "SIKA PRIMER-3N 250 ML.webp",
] as const;

const platreFiles = ["gyproc.webp", "PLATRE.webp", "FILLASSE.webp"] as const;

const betonFiles = ["CENTRALE A BETON.png"] as const;

const ferABetonFiles = ["Barre Fameco 1.webp", "barre fameco.jpeg"] as const;

const clousFiles = ["CLOUS.png"] as const;

const acierFiles = [
  "CORNIERE.jpg",
  "Fer-plat.jpg",
  "TÔLE NOIR.png",
  "UPN.webp",
] as const;

const panneauxBoisFiles = ["PLYWOOD.png", "triplex 4mm.jpg"] as const;

const panneauxSandwichFiles = ["panneau-sandwich.jpeg"] as const;

const outillageFiles = [
  "Cisaille.png",
  "HACHE.png",
  "MARTEAU ARRACHE CLOU.png",
  "NIVEAU.png",
  "PELLE.png",
  "Truelle.png",
] as const;

const consommablesFiles = [
  "Ampoule economique.png",
  "FICELLE NYLON.png",
  "PAPIER VERRE.png",
  "Plateau Poncage.png",
  "ROULEAU PONCAGE.png",
  "ROULEAU ETANCHE.png",
  "ROULEAUX PEINTURE.png",
  "TAMIS DE CONSTRUCTION.png",
] as const;

const peintureAEauFiles = [
  "LATEX AFRCIA.webp",
  "LATEX INT EAGLE.webp",
  "LATEX INT KINPAINT.webp",
  "LATEX EXT EAGLE.png",
  // "MASTIC AFRICA.webp",
  // "MASTIC INT EAGLE.webp",
  // "MASTIC INT KINPAINT.webp",
  // "mastique eagle.png",
] as const;

const peintureAHuileFiles = [
  "EMAIL AFRICA.JPG",
  "EMAIL EAGLE COULEUR.JPG",
  "EMAIL EAGLE.webp",
] as const;

const antirouilleFiles = [
  "ANTIROUILLE GRIS 1KG.webp",
  "ANTIROUILLE ROUGE EAGLE 1KG.webp",
] as const;

const briqueFiles = [
  "BRIQUE 2 RECTANGULAIRE.png",
  "BRIQUE 10 PLEINE.webp",
  "BRIQUE 10 RECTANGULAIRE.webp",
  "BRIQUE 12 RECTANGULAIRE.webp",
  "BRIQUE 12 RONDE.webp",
  "BRIQUE 15 CARRE SPECIALE.webp",
  "BRIQUE 15 CARRE.webp",
  "BRIQUE 15 PLEINE.webp",
  "BRIQUE 15 RONDE.webp",
  "BRIQUE 20 CARRE SPECIALE.webp",
  "BRIQUE 20 PLEINE.webp",
  "BRIQUE 20 RECTANGULAIRE.webp",
  "BRIQUE 20 RONDE.webp",
  "CLAUSTRA 20.webp",
  "HOURDIS 14 FERME.webp",
  "HOURDIS 14 OUVERT.webp",
  "HOURDIS 18 FERME.webp",
  "HOURDIS 18 OUVERT.webp",
  "HOURDIS 24 OUVERT.webp",
  "BORDURE 1M.webp",
  "BORDURE 60CM.webp",
] as const;

const paveFiles = [
  "PAVE 3D 6CM.webp",
  "PAVE 8 SUR 8 4CM.webp",
  "PAVE ARC 6CM.webp",
  "PAVE BARKIA 6 CM.webp",
  "PAVE BAROK 4CM.webp",
  "PAVE BAZEL 6CM.webp",
  "PAVE BOWTIE 6CM.webp",
  "PAVE BOWTIE GRAND 5 CM.webp",
  "PAVE BOWTIE MACHINE 6CM.webp",
  "PAVE BUTTERFLY 6CM.webp",
  "PAVE CAMEL 6CM.webp",
  "PAVE CARRE LISSE MACHINE 6CM.webp",
  "PAVE CARRE MACHINE 6CM.webp",
  "PAVE COEUR 4CM.webp",
  "PAVE COEUR 6CM.webp",
  "PAVE ECAILLE 6CM.webp",
  "PAVE ECAILLE MACHINE 6CM.webp",
  "PAVE FLEUR MIXTE 4 CM.webp",
  "PAVE HEXAGONE 6CM.webp",
  "PAVE HEXAGONE 8CM.webp",
  "PAVE LAVESTA 6CM.webp",
  "PAVE LOSANGE 4CM ET 6CM.webp",
  "PAVE LOSANGE.webp",
  "PAVE LUNETTE FLEUR 4CM.webp",
  "PAVE LUNETTE FLEUR 6CM.webp",
  "PAVE LUNETTE PLUS 6CM.webp",
  "PAVE MARTEAU MACHINE 6CM.webp",
  "PAVE MOG ELBAHER 6CM.webp",
  "PAVE MOKAMLA 4CM.webp",
  "PAVE MOKAMLA MACHINE 6CM.webp",
  "PAVE MONDIALE 6CM.webp",
  "PAVE NEAPOLIS 8CM.webp",
  "PAVE NEAPOLIS LISSE 6CM.webp",
  "PAVE NEAPOLIS.webp",
  "PAVE OCTO 6CM.webp",
  "PAVE SODASSE CHISEL 6CM.webp",
  "PAVE SODASSE LISSE 6CM.webp",
  "PAVE TAWOS 4CM.webp",
  "PAVE TRAVEL 6CM.webp",
  "PAVE TRAVEL MACHINE 6CM.webp",
  "PAVE TREE 6CM.webp",
  "PAVE VAGUE 6CM.webp",
  "PAVE XO MIXTE.webp",
  "PAVE ZIG ZAG PETIT.webp",
  "PAVE ZIG-ZAG MACHINE 6CM.webp",
] as const;

export const allProducts: ProductItem[] = [
  ...buildItems("ciment", "cement-mortar-plaster", cimentFiles),
  ...buildItems("ciment-colle", "cement-mortar-plaster", cimentColleFiles),
  ...buildItems("produits-sika", "cement-mortar-plaster", sikaFiles),
  ...buildItems("brique", "brique", briqueFiles),
  ...buildItems("pave", "pave", paveFiles),
  ...buildItems("beton", "cement-mortar-plaster", betonFiles),
  ...buildItems("plafonds", "cement-mortar-plaster", platreFiles),
  ...buildItems("acier-fer", "sheet-metal-pipes-wood", ferABetonFiles, "fer-a-beton"),
  ...buildItems("acier-fer", "sheet-metal-pipes-wood", clousFiles, "clous"),
  ...buildItems("acier-fer", "sheet-metal-pipes-wood", acierFiles, "acier"),
  ...buildItems("bois", "sheet-metal-pipes-wood", panneauxBoisFiles),
  ...buildItems("panneaux-sandwich", "sheet-metal-pipes-wood", panneauxSandwichFiles),
  ...buildItems("peinture", "paints-coatings-sealants", peintureAEauFiles, "peinture-a-eau"),
  ...buildItems("peinture", "paints-coatings-sealants", peintureAHuileFiles, "peinture-a-huile"),
  ...buildItems("peinture", "paints-coatings-sealants", antirouilleFiles, "antirouille"),
  ...buildItems("outillage-quincaillerie", "tools-consumables", outillageFiles),
  ...buildItems("outillage-quincaillerie", "tools-consumables", consommablesFiles),
];

export function productImageUrl(storageFolder: ImageStorageFolder, file: string): string {
  return `/images/${storageFolder}/${encodeURIComponent(file)}`;
}

export function categoryLabel(id: ProductCategoryId): string {
  return productCategories.find((c) => c.id === id)?.label ?? id;
}

export function subcategoryLabel(id: ProductSubcategoryId): string {
  return productSubcategories.find((s) => s.id === id)?.label ?? id;
}

export function getSubcategoriesForCategory(
  categoryId: "acier-fer" | "peinture",
): ProductSubcategory[] {
  return productSubcategories.filter((s) => s.categoryId === categoryId);
}

export function categoryHasSubcategories(
  categoryId: ProductCategoryId,
): categoryId is "acier-fer" | "peinture" {
  return categoryId === "acier-fer" || categoryId === "peinture";
}

const categoryIdSet = new Set<ProductCategoryId>(productCategories.map((c) => c.id));

export function isProductCategoryId(value: string): value is ProductCategoryId {
  return categoryIdSet.has(value as ProductCategoryId);
}

export function getProductsByCategory(categoryId: ProductCategoryId): ProductItem[] {
  return allProducts.filter((p) => p.categoryId === categoryId);
}
