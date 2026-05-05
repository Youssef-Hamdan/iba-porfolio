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
  | "ciment"
  | "mortier"
  | "platre"
  | "acier"
  | "panneaux-bois"
  | "peinture"
  | "primaire-metaux"
  | "outillage"
  | "consommables";

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
    id: "ciment",
    label: "Ciment",
    description: "Liens hydrauliques et ciments en sac — uniquement.",
    coverStorageFolder: "cement-mortar-plaster",
    coverFile: "Super Sikalite.png",
  },
  {
    id: "mortier",
    label: "Mortier",
    description: "Mortiers-colle, coulis, latex et mortiers techniques Sika — pas de ciment pur ni de plâtre.",
    coverStorageFolder: "sika-products",
    coverFile: "SikaGrout 212 AO 30KG.png",
  },
  {
    id: "platre",
    label: "Plâtre",
    description: "Plaques de plâtre, plâtre en poudre et fillasse — uniquement.",
    coverStorageFolder: "cement-mortar-plaster",
    coverFile: "GYPROC2.png",
  },
  {
    id: "acier",
    label: "Acier",
    description: "Tôles, profilés IBR et tubes acier — pas de bois.",
    coverStorageFolder: "sheet-metal-pipes-wood",
    coverFile: "tole IBR STORY1.png",
  },
  {
    id: "panneaux-bois",
    label: "Panneaux bois",
    description: "Contreplaqué et panneaux dérivés du bois — pas de métal.",
    coverStorageFolder: "sheet-metal-pipes-wood",
    coverFile: "PLYWOOD 2.png",
  },
  {
    id: "peinture",
    label: "Peintures & finitions",
    description:
      "Peintures, mastiques et sceaux d’étanchéité, traitements antirouille — une même famille produits.",
    coverStorageFolder: "paints-coatings-sealants",
    coverFile: "africa color c.png",
  },
  {
    id: "primaire-metaux",
    label: "Primaire métaux",
    description: "Primaires et apprêts pour préparation des métaux (ex. Sikaprimer).",
    coverStorageFolder: "sika-products",
    coverFile: "Sikaprimer 3N.PNG",
  },
  {
    id: "outillage",
    label: "Outillage",
    description: "Outils de coupe et d’atelier — pas de consommables jetables.",
    coverStorageFolder: "tools-consumables",
    coverFile: "Cisaille 2.png",
  },
  {
    id: "consommables",
    label: "Consommables",
    description: "Ficelle, papier abrasif, tamis, plateau de ponçage, ampoules, etc. — pas d’outils.",
    coverStorageFolder: "tools-consumables",
    coverFile: "papier verre 3.png",
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
  ...buildItems("ciment", "cement-mortar-plaster", cimentFiles),
  ...buildItems("ciment", "paints-coatings-sealants", cimentCiluFiles),
  ...buildItems("mortier", "cement-mortar-plaster", mortierCementFolderFiles),
  ...buildItems("mortier", "sika-products", mortierSikaFiles),
  ...buildItems("platre", "cement-mortar-plaster", platreFiles),
  ...buildItems("acier", "sheet-metal-pipes-wood", acierFiles),
  ...buildItems("panneaux-bois", "sheet-metal-pipes-wood", panneauxBoisFiles),
  ...buildItems("peinture", "paints-coatings-sealants", peintureCategoryFiles),
  ...buildItems("primaire-metaux", "sika-products", primaireMetauxFiles),
  ...buildItems("outillage", "tools-consumables", outillageFiles),
  ...buildItems("consommables", "tools-consumables", consommablesFiles),
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
