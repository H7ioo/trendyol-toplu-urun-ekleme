import {
  caseBrandsH,
  caseTypesH,
  colorsH,
  caseMaterialsH,
  phonesH,
  caseBrandsT,
  phonesT,
  categoryT,
  currencyT,
  KDVT,
  caseMaterialsT,
  caseTypesT,
  guaranteePeriodsT,
  KDVH,
  productTypes,
  watchMaterialT,
  myWatchList,
  watchBrandsH,
  mmT,
  categoryWatchT,
  watchBrandsT,
  earPhonesGuaranteePeriodsT,
  earPhonesAccessoryTypesH,
  earPhonesBrandsT,
  earPhonesT,
  myEarPhones,
  categoryEarPhonesT,
  phonesTExtends,
  phonesHExtends,
} from "../variables/variables";

import configFileObject from "../config/config.json";
export type ConfigFileObjectType = typeof configFileObject;

export type ConfigFileKeys = keyof ConfigFileObjectType;

export type TrendyolWatchFields = {
  Barkod: string;
  "Model Kodu": string;
  Marka: string;
  Kategori: typeof categoryWatchT;
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
  Beden: (typeof mmT)[number] | "";
  Materyal: (typeof watchMaterialT)[number] | "";
  "Garanti Süresi": (typeof guaranteePeriodsT)[number];
  "Uyumlu Marka": (typeof watchBrandsT)[number];
};

export type HepsiburadaWatchFields = {
  "Ürün Adı": string;
  "Satıcı Stok Kodu": string;
  Barkod: string;
  "Varyant Grup Id": string;
  "Ürün Açıklaması": string;
  Marka: string;
  Desi: number;
  KDV: (typeof KDVH)[3];
  "Garanti Süresi (Ay)": 0;
  Görsel1: unknown;
  Görsel2: unknown;
  Görsel3: unknown;
  Görsel4: unknown;
  Görsel5: unknown;
  Fiyat: string;
  Stok: number;
  Video: unknown;
  Renk: (typeof colorsH)[number];
  Seçenek: string;
  "Uyumlu Marka": (typeof watchBrandsH)[number];
};

export interface TrendyolEarPhonesFields {
  Barkod: string;
  "Model Kodu": string;
  Marka: string;
  Kategori: typeof categoryEarPhonesT;
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
  "Garanti Süresi": (typeof earPhonesGuaranteePeriodsT)[number];
  "Uyumlu Marka": (typeof earPhonesBrandsT)[number];
  "Uyumlu Model": (typeof earPhonesT)[number] | "";
}

export interface HepsiburadaEarPhonesFields {
  "Ürün Adı": string;
  "Satıcı Stok Kodu": string;
  Barkod: string;
  "Varyant Grup Id": string;
  "Ürün Açıklaması": string;
  Marka: string;
  Desi: number;
  KDV: (typeof KDVH)[3];
  "Garanti Süresi (Ay)": 0;
  Görsel1: unknown;
  Görsel2: unknown;
  Görsel3: unknown;
  Görsel4: unknown;
  Görsel5: unknown;
  Fiyat: string;
  Stok: number;
  Video: unknown;
  Renk: (typeof colorsH)[number];
  "Kulaklık Aksesuarı Türü": (typeof earPhonesAccessoryTypesH)[number];
}

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

export interface HepsiburadaFields {
  "Ürün Adı": string;
  "Satıcı Stok Kodu": string;
  Barkod: string;
  "Varyant Grup Id": string;
  "Ürün Açıklaması": string;
  Marka: string;
  Desi: number;
  KDV: (typeof KDVH)[3];
  "Garanti Süresi (Ay)": 0;
  Görsel1: unknown;
  Görsel2: unknown;
  Görsel3: unknown;
  Görsel4: unknown;
  Görsel5: unknown;
  Fiyat: string;
  Stok: number;
  Video: unknown;
  "Uyumlu Model": unknown;
  Renk: (typeof colorsH)[number];
  Seçenek: string;
  "Telefon Modeli": (typeof phonesH)[number][] | string;
  "Uyumlu Marka": (typeof caseBrandsH)[number];
  "Garanti Tipi": unknown;
  "Su Geçirmezlik": unknown;
  "Ürün  Kodu": unknown;
  "Malzeme Türü": (typeof caseMaterialsH)[number] | "";
  "Garanti Tipi2": unknown;
  "Kılıf Tipi": (typeof caseTypesH)[number] | "";
}

export type CompanyType = "trendyol" | "hepsiburada";

export type PromptQuestionFunctionProps =
  | (
      | {
          company: "trendyol";
          productType: "kılıf";
          phonesList: typeof phonesT & typeof phonesTExtends;
          caseMaterials: typeof caseMaterialsT;
          caseTypes: typeof caseTypesT;
          caseBrands: typeof caseBrandsT;
          guaranteePeriods: typeof guaranteePeriodsT;
        }
      | {
          company: "hepsiburada";
          productType: "kılıf";
          phonesList: typeof phonesH & typeof phonesHExtends;
          colors: typeof colorsH;
          caseMaterials: typeof caseMaterialsH;
          caseTypes: typeof caseTypesH;
          caseBrands: typeof caseBrandsH;
        }
    )
  | (
      | {
          company: "trendyol";
          productType: "kordon";
          watchMaterial: typeof watchMaterialT;
          watchList: typeof myWatchList;
          guaranteePeriods: typeof guaranteePeriodsT;
          watchBrands: typeof watchBrandsT;
        }
      | {
          company: "hepsiburada";
          productType: "kordon";
          watchBrands: typeof watchBrandsH;
          colors: typeof colorsH;
          watchList: typeof myWatchList;
        }
    )
  | (
      | {
          company: "trendyol";
          productType: "charm";
          watchMaterial: typeof watchMaterialT;
          guaranteePeriods: typeof guaranteePeriodsT;
          watchBrands: typeof watchBrandsT;
        }
      | {
          company: "hepsiburada";
          productType: "charm";
          watchBrands: typeof watchBrandsH;
          colors: typeof colorsH;
        }
    )
  | (
      | {
          company: "trendyol";
          productType: "kulaklık";
          guaranteePeriods: typeof earPhonesGuaranteePeriodsT;
          earPhonesBrands: typeof earPhonesBrandsT;
          earPhonesList: typeof earPhonesT;
        }
      | {
          company: "hepsiburada";
          productType: "kulaklık";
          earPhonesAccessoryTypes: typeof earPhonesAccessoryTypesH;
          colors: typeof colorsH;
          earPhonesList: typeof myEarPhones;
        }
    );

export type TrendyolCharmPromptType = {
  company: "trendyol";
  productType: "charm";
  watchMaterial: (typeof watchMaterialT)[number];
  guaranteePeriod: (typeof guaranteePeriodsT)[number];
  colors: string[];
  marketPrice: number;
  watchBrand: (typeof watchBrandsT)[number];
  charmLetters: string[] | [];
};

export type HepsiburadaCharmPromptType = {
  company: "hepsiburada";
  productType: "charm";
  colors: (typeof colorsH)[number][] | [];
  options: string[] | [];
  watchBrand: (typeof watchBrandsH)[number];
  charmLetters: string[] | [];
};

export type TrendyolEarPhonesPromptType = {
  company: "trendyol";
  productType: "kulaklık";
  guaranteePeriod: (typeof earPhonesGuaranteePeriodsT)[number];
  earPhonesBrand: (typeof earPhonesBrandsT)[number];
  earPhonesList: (typeof earPhonesT)[number][0];
  writtenEarPhonesList: string[];
  earPhonesCollections:
    | TrendyolPhonesCollection["phonesCollection"]
    | undefined;
  colors: string[];
  marketPrice: number;
};
export type HepsiburadaEarPhonesPromptType = {
  company: "hepsiburada";
  productType: "kulaklık";
  earPhonesAccessoryType: (typeof earPhonesAccessoryTypesH)[number];
  earPhonesList: (typeof myEarPhones)[number][0];
  writtenEarPhonesList: string[];
  earPhonesCollections:
    | HepsiburadaPhonesCollection["phonesCollection"]
    | undefined;
  colors: (typeof colorsH)[number][] | [];
};

// TODO: Is empty array necessary? What about undefined or null?

export type TrendyolPromptType = {
  company: "trendyol";
  productType: "kılıf";
  phonesList: (typeof phonesT)[number][] | [];
  caseMaterial: (typeof caseMaterialsT)[number];
  caseType: (typeof caseTypesT)[number];
  caseBrand: (typeof caseBrandsT)[number];
  guaranteePeriod: (typeof guaranteePeriodsT)[number];
  colors: string[];
  marketPrice: number;
  phonesCollections: TrendyolPhonesCollection["phonesCollection"][] | undefined;
  writtenPhonesList: string[];
};

export type HepsiburadaPromptType = {
  company: "hepsiburada";
  productType: "kılıf";
  phonesList: (typeof phonesH)[number][] | [];
  colors: (typeof colorsH)[number][] | [];
  options: string[] | [];
  caseMaterial: (typeof caseMaterialsH)[number];
  caseType: (typeof caseTypesH)[number];
  caseBrand: (typeof caseBrandsH)[number];
  phonesCollections:
    | HepsiburadaPhonesCollection["phonesCollection"][]
    | undefined;
  writtenPhonesList: string[];
};

export type TrendyolWatchPromptType = {
  company: "trendyol";
  productType: "kordon";
  watchList: (typeof myWatchList)[number][] | [];
  watchMaterial: (typeof watchMaterialT)[number];
  guaranteePeriod: (typeof guaranteePeriodsT)[number];
  colors: string[];
  marketPrice: number;
  // TODO:
  watchCollections: TrendyolPhonesCollection["phonesCollection"] | undefined;
  writtenWatchList: string[];
  mmList: (typeof mmT)[number][];
  writtenMmList: string[];
  watchBrand: (typeof watchBrandsH)[number];
};

export type HepsiburadaWatchPromptType = {
  company: "hepsiburada";
  productType: "kordon";
  watchList: (typeof myWatchList)[number][] | [];
  colors: (typeof colorsH)[number][] | [];
  options: string[] | [];
  watchBrand: (typeof watchBrandsH)[number];
  // TODO:
  watchCollections: HepsiburadaPhonesCollection["phonesCollection"] | undefined;
  writtenWatchList: string[];
  writtenMmList: string[];
};

export type ConfigProductPromptType = {
  path: string;
  askToRunNotion: boolean;
};

export type MainProductPromptType = {
  title: string; // Lazer Panda Stantlı Kılıf
  productBrand: string; // iPhone, Samsung (written by user)
  productCode: string; // SB
  trademark: string; // SUAR, Kılıfsuar
  price: number; // 159.90
  stockAmount: number; // 100
  productDescription: string; // <div><ul><li>Awesome Product!</li></ul></div>
};

export type ProductPromptType = MainProductPromptType &
  ConfigProductPromptType &
  (
    | (HepsiburadaPromptType | TrendyolPromptType)
    | (HepsiburadaWatchPromptType | TrendyolWatchPromptType)
    | (TrendyolEarPhonesPromptType | HepsiburadaEarPhonesPromptType)
    | (TrendyolCharmPromptType | HepsiburadaCharmPromptType)
  );

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

export type InformationLoopType = {
  objectArray: object[];
  mergedPhonesList: string[];
} & ProductPromptType;

export type ProductTypes = (typeof productTypes)[number];
