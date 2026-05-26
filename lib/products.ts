/** Folder name under `/public/images/` (physical storage). */
export type ImageStorageFolder =
  | "cement-mortar-plaster"
  | "sika-products"
  | "paints-coatings-sealants"
  | "sheet-metal-pipes-wood"
  | "tools-consumables";

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
  | "pave"
  | "service-transport";

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
    coverFile: "tole IBR STORY1.png",
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
    coverStorageFolder: "cement-mortar-plaster",
    coverFile: "Super Sikalite.png",
  },
  {
    id: "peinture",
    label: "Peinture",
    description: "Peintures, mastiques, sceaux d’étanchéité et traitements antirouille.",
    coverStorageFolder: "paints-coatings-sealants",
    coverFile: "africa color c.png",
  },
  {
    id: "bois",
    label: "Bois",
    description: "Bois de charpente, coffrage, menuiserie et panneaux dérivés.",
    coverStorageFolder: "sheet-metal-pipes-wood",
    coverFile: "PLYWOOD 2.png",
  },
  {
    id: "outillage-quincaillerie",
    label: "Outillage Quincaillerie",
    description: "Outils de coupe, d'atelier et quincaillerie générale.",
    coverStorageFolder: "tools-consumables",
    coverFile: "Cisaille 2.png",
  },
  {
    id: "plafonds",
    label: "Plafonds",
    description: "Solutions complètes pour plafonds suspendus, plâtre et isolation.",
    coverStorageFolder: "cement-mortar-plaster",
    coverFile: "GYPROC2.png",
  },
  {
    id: "panneaux-sandwich",
    label: "Panneaux Sandwich",
    description: "Panneaux isolants pour toitures et bardages industriels.",
    coverStorageFolder: "sheet-metal-pipes-wood",
    coverFile: "tole IBR STORY1.png",
  },
  {
    id: "pave",
    label: "Pavé",
    description: "Pavés autobloquants pour aménagements extérieurs.",
    coverStorageFolder: "cement-mortar-plaster",
    coverFile: "Super Sikalite.png",
  },
  {
    id: "service-transport",
    label: "Service Transport",
    description: "Livraison rapide et sécurisée de tous vos matériaux.",
    coverStorageFolder: "tools-consumables",
    coverFile: "Cisaille 2.png",
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

const cimentFiles = ["Super Sikalite.png", "surecem.webp"] as const;

/** Stockés dans paints-coatings-sealants, rangés commercialement sous Ciment. */
const cimentCiluFiles = ["cilu-p-2.png", "cilu-p-2FF.png"] as const;

const mortierCementFolderFiles = [
  "CIMENT COLLE kin colle.png",
  "CIMENT COLLE mortier colle C2.png",
  "CIMENT COLLE mortier colle gris C2.png",
  "CIMENT COLLE mortier colle gris.png",
  "CIMENT COLLE mortier colle.png",
] as const;

const mortierSikaFiles = [
  "SikaGrout 212 AO 30KG.png",
  "SikaLatex Light AO 5LT.png",
  "SikaTop - 107 Seal AO COMP. A 5KG.png",
  "SikaTop - 107 Seal AO COMP. B 20KG.png",
  "SikaTop - 209 AO (B) Bg 24Kg.png",
  "SikaTop- 209 AO (A) Bg 8Kg.png",
] as const;

const platreFiles = ["GYPROC2.png", "PLATRE ET FILLASSE 2.png"] as const;

const acierFiles = [
  "STAINLESS STEEL PIPES.png",
  "Steel Rectangular Pipde-Récupéré.png",
  "TÔLE NOIR 3.png",
  "tole IBR STORY1.png",
] as const;

const panneauxBoisFiles = ["PLYWOOD 2.png"] as const;

const peintureLiquideFiles = ["Gris png.png", "africa color c.png"] as const;

const mastiquesFiles = ["eagle mastique.png", "eaglet.png", "sceaux eagle.png"] as const;

const antirouilleFiles = [
  "Antirouille africa color  afrifood.png",
  "Antirouille-afrifood1.png",
] as const;

const primaireMetauxFiles = ["Sikaprimer 3N.PNG"] as const;

const outillageFiles = ["Cisaille 2.png"] as const;

const consommablesFiles = [
  "Ampoule economique 2.png",
  "Ficelle en nylon2.png",
  "papier verre 3.png",
  "Plateau Poncage2.png",
  "TAMIS DE 2.png",
] as const;

const peintureCategoryFiles = [
  ...peintureLiquideFiles,
  ...mastiquesFiles,
  ...antirouilleFiles,
] as const;

export const allProducts: ProductItem[] = [
  ...buildItems("ciments", "cement-mortar-plaster", cimentFiles),
  ...buildItems("ciments", "paints-coatings-sealants", cimentCiluFiles),
  ...buildItems("ciments", "cement-mortar-plaster", mortierCementFolderFiles),
  ...buildItems("ciments", "sika-products", mortierSikaFiles),
  ...buildItems("plafonds", "cement-mortar-plaster", platreFiles),
  ...buildItems("acier-fer", "sheet-metal-pipes-wood", acierFiles),
  ...buildItems("bois", "sheet-metal-pipes-wood", panneauxBoisFiles),
  ...buildItems("peinture", "paints-coatings-sealants", peintureCategoryFiles),
  ...buildItems("peinture", "sika-products", primaireMetauxFiles),
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
