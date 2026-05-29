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
  | "ciments"
  | "beton"
  | "brique"
  | "peinture"
  | "bois"
  | "outillage-quincaillerie"
  | "plafonds"
  | "panneaux-sandwich"
  | "pave";

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
  storageFolder: ImageStorageFolder;
  file: string;
  name: string;
}

export const productCategories: ProductCategory[] = [
  {
    id: "acier-fer",
    label: "Acier & Fer",
    description: "Tôles, profilés et tubes acier pour structures robustes.",
    coverStorageFolder: "sheet-metal-pipes-wood",
    coverFile: "tole IBR.png",
  },
  {
    id: "ciments",
    label: "Ciments",
    description: "Liens hydrauliques, ciments en sac et mortiers.",
    coverStorageFolder: "cement-mortar-plaster",
    coverFile: "Super Sikalite.png",
  },
  {
    id: "beton",
    label: "Béton Prêt à l'Emploi",
    description: "Béton prêt à l'emploi livré directement sur vos chantiers.",
    coverStorageFolder: "cement-mortar-plaster",
    coverFile: "Super Sikalite.png",
  },
  {
    id: "brique",
    label: "Brique",
    description: "Briques de construction pleines et creuses de haute qualité.",
    coverStorageFolder: "brique",
    coverFile: "BRIQUE 10 PLEINE.png",
  },
  {
    id: "peinture",
    label: "Peinture",
    description: "Peintures, mastiques, sceaux d’étanchéité et traitements antirouille.",
    coverStorageFolder: "paints-coatings-sealants",
    coverFile: "latex eagle.png",
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
    label: "Outillage Quincaillerie",
    description: "Outils de coupe, d'atelier et quincaillerie générale.",
    coverStorageFolder: "tools-consumables",
    coverFile: "Cisaille.png",
  },
  {
    id: "plafonds",
    label: "Plafonds",
    description: "Solutions complètes pour plafonds suspendus, plâtre et isolation.",
    coverStorageFolder: "cement-mortar-plaster",
    coverFile: "GYPROC.png",
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
    coverFile: "PAVE BARKIA 6 CM.png",
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
  files: readonly string[]
): ProductItem[] {
  return files.map((file) => ({
    id: slugFromFile(categoryId, storageFolder, file),
    categoryId,
    storageFolder,
    file,
    name: humanizeFilename(file),
  }));
}

const cimentFiles = ["CIMENT.jpeg", "Super Sikalite.png"] as const;

/** Stockés dans paints-coatings-sealants, rangés commercialement sous Ciment. */
const cimentCiluFiles = [] as const;

const mortierCementFolderFiles = [
  "CIMENT COLLE C2 EAGLE 20 KG -GRIS.png",
  "CIMENT COLLE C2 EAGLE 20 KG-BLANC.png",
  "CIMENT COLLE EAGLE PRO 20KG-GREY C1.png",
  "CIMENT COLLE EAGLE PRO 20KG-WHITE C1.png",
  "CIMENT KIN COLLE BLANC 20 KG C1.png",
] as const;

const platreFiles = ["GYPROC.png", "PLATRE ET FILLASSE.png"] as const;

const betonFiles = ["CENTRALE A BETON.png"] as const;

const acierFiles = [
  "CLOUS.png",
  "CORNIERE.jpg",
  "Fer-plat.jpg",
  "TÔLE NOIR.png",
  "barre fameco.jpeg",
  "tole IBR.png",
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

const peintureLiquideFiles = [
  "ANTIROUILLE ROUGE EAGLE.png",
  "EMAIL AFRICA.JPG",
  "EMAIL EAGLE COULEUR.JPG",
  "latex eagle.png",
  "mastique eagle.png",
] as const;

const peintureCategoryFiles = [...peintureLiquideFiles] as const;

const briqueFiles = [
  "BRIQUE 2 RECTANGULAIRE.png",
  "BRIQUE 10 PLEINE.png",
  "BRIQUE 10 RECTANGULAIRE.png",
  "BRIQUE 12 RONDE.png",
  "BRIQUE 15 RONDE.png",
] as const;

const paveFiles = [
  "PAVE BARKIA 6 CM.png",
  "PAVE BOWTIE GRAND 5 CM.png",
  "PAVE HEXAGONE 6CM.png",
  "PAVE LOSANGE.png",
] as const;

export const allProducts: ProductItem[] = [
  ...buildItems("ciments", "cement-mortar-plaster", cimentFiles),
  ...buildItems("ciments", "paints-coatings-sealants", cimentCiluFiles),
  ...buildItems("ciments", "cement-mortar-plaster", mortierCementFolderFiles),
  ...buildItems("brique", "brique", briqueFiles),
  ...buildItems("pave", "pave", paveFiles),
  ...buildItems("beton", "cement-mortar-plaster", betonFiles),
  ...buildItems("plafonds", "cement-mortar-plaster", platreFiles),
  ...buildItems("acier-fer", "sheet-metal-pipes-wood", acierFiles),
  ...buildItems("bois", "sheet-metal-pipes-wood", panneauxBoisFiles),
  ...buildItems("panneaux-sandwich", "sheet-metal-pipes-wood", panneauxSandwichFiles),
  ...buildItems("peinture", "paints-coatings-sealants", peintureCategoryFiles),
  ...buildItems("outillage-quincaillerie", "tools-consumables", outillageFiles),
  ...buildItems("outillage-quincaillerie", "tools-consumables", consommablesFiles),
];

export function productImageUrl(storageFolder: ImageStorageFolder, file: string): string {
  return `/images/${storageFolder}/${encodeURIComponent(file)}`;
}

export function categoryLabel(id: ProductCategoryId): string {
  return productCategories.find((c) => c.id === id)?.label ?? id;
}

const categoryIdSet = new Set<ProductCategoryId>(productCategories.map((c) => c.id));

export function isProductCategoryId(value: string): value is ProductCategoryId {
  return categoryIdSet.has(value as ProductCategoryId);
}

export function getProductsByCategory(categoryId: ProductCategoryId): ProductItem[] {
  return allProducts.filter((p) => p.categoryId === categoryId);
}
