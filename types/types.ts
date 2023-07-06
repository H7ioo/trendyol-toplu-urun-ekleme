import {
  KDVH,
  caseBrandsH,
  caseTypesH,
  colorsH,
  crapH,
  guaranteeTypesH,
  caseMaterialsH,
  phonesH,
  waterProofH,
  caseBrandsT,
  phonesT,
  categoryT,
  currencyT,
  KDVT,
  caseMaterialsT,
  caseTypesT,
  guaranteePeriodsT,
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
  "Piyasa Satış Fiyatı (KDV Dahil)": number;
  "Trendyol'da Satılacak Fiyat (KDV Dahil)": number;
  "Ürün Stok Adedi": number;
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
  Materyal: (typeof caseMaterialsT)[number] | "";
  Model: (typeof caseTypesT)[number] | "";
  "Cep Telefonu Modeli": (typeof phonesT)[number] | string;
  "Garanti Tipi": unknown;
  "Garanti Süresi": (typeof guaranteePeriodsT)[number];
  "Uyumlu Marka": (typeof caseBrandsT)[number];
}

export type CompanyType = "trendyol" | "hepsiburada";

export type PromptQuestionFunctionProps = {
  configFileData: ConfigFileObjectType;
} & (
  | {
      company: "trendyol";
      phonesList: typeof phonesT;
      caseMaterials: typeof caseMaterialsT;
      caseTypes: typeof caseTypesT;
      caseBrands: typeof caseBrandsT;
      guaranteePeriods: typeof guaranteePeriodsT;
    }
  | {
      company: "hepsiburada";
      phonesList: typeof phonesH;
      colors: typeof colorsH;
      caseMaterials: typeof caseMaterialsH;
      caseTypes: typeof caseTypesH;
      caseBrands: typeof caseBrandsH;
    }
);

export type TrendyolPromptType = {
  company: "trendyol";
  phonesList: (typeof phonesT)[number][] | [];
  caseMaterial: (typeof caseMaterialsT)[number];
  caseType: (typeof caseTypesT)[number];
  caseBrand: (typeof caseBrandsT)[number];
  guaranteePeriod: (typeof guaranteePeriodsT)[number];
  colors: string[];
  marketPrice: number;
  phonesCollections: TrendyolPhonesCollection["phonesCollection"];
};

export type HepsiburadaPromptType = {
  company: "hepsiburada";
  phonesList: (typeof phonesH)[number][] | [];
  colors: (typeof colorsH)[number][] | [];
  options: string[] | [];
  caseMaterial: (typeof caseMaterialsH)[number];
  caseType: (typeof caseTypesH)[number];
  caseBrand: (typeof caseBrandsH)[number];
  phonesCollections: HepsiburadaPhonesCollection["phonesCollection"];
};

export type ProductPromptType = {
  title: string; // Lazer Panda Stantlı Kılıf
  phoneBrand: string; // iPhone, Samsung (written by user)
  productCode: string; // SB
  trademark: string; // SUAR, Kılıfsuar
  price: number; // 159.90
  stockAmount: number; // 100
  productDescription: string; // <div><ul><li>Awesome Product!</li></ul></div>
  writtenPhonesList: string[];
  // Options
  path: string;
  askToRunNotion: boolean;
  // Features
} & (HepsiburadaPromptType | TrendyolPromptType);

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
  guaranteeType: (typeof guaranteeTypesH)[number] | undefined;
  waterProof: (typeof waterProofH)[number] | undefined;
  material: (typeof caseMaterialsH)[number];
  caseType: (typeof caseTypesH)[number];

  // Helpers
  mainModalCode: string;
  phoneType: string;
  path: string;
}

export type TrendyolPhonesCollection = {
  company: "trendyol";
  phonesCollection: (typeof phonesT)[number][];
};
export type HepsiburadaPhonesCollection = {
  company: "hepsiburada";
  phonesCollection: (typeof phonesH)[number][];
};

export type phonesCollectionPromptType = {
  collectionName: string;
} & (TrendyolPhonesCollection | HepsiburadaPhonesCollection);
