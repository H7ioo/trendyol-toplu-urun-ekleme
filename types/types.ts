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
} from "../variables/variables";

import configFileObject from "../config/config.json";
export type ConfigFileObjectType = typeof configFileObject;

export type ConfigFileKeys = keyof ConfigFileObjectType;

export interface promptAnswersT {
  title: string;
  phoneType: string;
  phonesList: string[];
  mainModalCode: string;
  brand: string | undefined;
  colors: string[];
  globalPrice: string;
  price: string;
  stock: string;
  description: string;
  material: (typeof materialsT)[number];
  caseType: (typeof casesTypesT)[number];
  guaranteePeriod: (typeof guaranteesPeriodT)[number];
  caseBrand: (typeof caseBrandsT)[number];
  path: string;
  askToRunNotion: boolean;
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
