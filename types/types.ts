import {
  KDVH,
  caseBrandsH,
  casesTypesH,
  colorsH,
  crapH,
  guaranteesTypeH,
  materialsH,
  phonesH,
  waterProofH,
  caseBrandsT,
  casesTypesT,
  guaranteesPeriodT,
  materialsT,
  phonesT,
  categoryT,
  currencyT,
  KDVT,
} from "../variables/variables";

import configFileObject from "../config/config.json";
export type ConfigFileObjectType = typeof configFileObject;

export type ConfigFileKeys = keyof ConfigFileObjectType;

export interface TrendyolFields {
  Barkod: string;
  "Model Kodu": string;
  Marka: string;
  Kategori: typeof categoryT;
  "Para Birimi": typeof currencyT;
  "Ürün Adı": string;
  "Ürün Açıklaması": string;
  "Piyasa Satış Fiyatı (KDV Dahil)": string;
  "Trendyol'da Satılacak Fiyat (KDV Dahil)": string;
  "Ürün Stok Adedi": string;
  "Stok Kodu": string;
  "KDV Oranı": (typeof KDVT)["3"];
  Desi: string;
  "Görsel 1": unknown;
  "Görsel 2": unknown;
  "Görsel 3": unknown;
  "Görsel 4": unknown;
  "Görsel 5": unknown;
  "Görsel 6": unknown;
  "Görsel 7": unknown;
  "Görsel 8": unknown;
  "Sevkiyat Süresi": unknown;
  "Sevkiyat Tipi": unknown;
  Renk: string;
  Materyal: (typeof materialsT)[number] | "";
  Model: (typeof casesTypesT)[number] | "";
  "Cep Telefonu Modeli": (typeof phonesT)[number] | string;
  "Garanti Tipi": unknown;
  "Garanti Süresi": (typeof guaranteesPeriodT)[number];
  "Uyumlu Marka": (typeof caseBrandsT)[number];
}

export interface promptAnswersT {
  // Title
  title: string;
  // Phone brand (iPhone, Samsung)
  phoneBrand: string;
  // Phones List (["11", "12 Pro Max"])
  phonesList: string[];
  // Modal Code (YSS)
  mainModalCode: string;
  // Colors ["Sarı", "Siyah"]
  colors: string[];
  // Company Brand (SUAR)
  companyBrand: string | undefined;
  // Global Price (200)
  globalPrice: string;
  // Price (149.90)
  price: string;
  // Stock Count (100)
  stock: string;
  // Description (<div> <ul> <li> Description Here </li></ul>  </div>)
  description: string;
  // Case Material (Plastik)
  caseMaterial: (typeof materialsT)[number];
  // Case Type (Arka Kapak)
  caseType: (typeof casesTypesT)[number];
  // Guarantee Period (1 Yıl)
  guaranteePeriod: (typeof guaranteesPeriodT)[number];
  // Case Brand is the same as Phone Brand (iPhone, Samsung)
  caseBrand: (typeof caseBrandsT)[number];

  // Options
  path: string;
  askToRunNotion: boolean;
  writtenPhonesList: string[];
  phonesCollection: phonesCollectionPromptType["phonesCollection"];
}

export interface promptAnswersH {
  title: string;
  // sellerStockCode: string; // = mainModalCode
  barcode: string;
  // groupId: string; // gets generated
  productDescription: string;
  brand: string | undefined;
  desi: string; // number
  KDV: (typeof KDVH)[number];
  guaranteePeriod: string; // number
  // IMAGES
  price: string;
  stockAmount: string;
  // VIDEO
  phoneBrandCrap: (typeof crapH)[number][] | undefined;
  colors: (typeof colorsH)[number][];
  options: string[];
  phonesList: (typeof phonesH)[number][];
  caseBrand: (typeof caseBrandsH)[number];
  guaranteeType: (typeof guaranteesTypeH)[number] | undefined;
  waterProof: (typeof waterProofH)[number] | undefined;
  material: (typeof materialsH)[number];
  caseType: (typeof casesTypesH)[number];

  // Helpers
  mainModalCode: string;
  phoneType: string;
  path: string;
}

// TODO: Dynamic Types Extends

export interface phonesCollectionPromptType {
  company: "hepsiburada" | "trendyol";
  phonesCollection: (typeof phonesT)[number][] | (typeof phonesH)[number][];
  collectionName: string;
}
