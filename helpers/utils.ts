import { QuestionCollection, prompt, registerPrompt } from "inquirer";
import fs from "fs";

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// - Helpers

/**
 * Trims extra whitespace and lowercases the text
 * @param text The text.
 * @param lowerCase Option to lowerCase the text. Defaults to true.
 * @returns Cleared up text.
 * @example cleanUp("   Text HERE ")
 */

export function cleanUp(text: string, lowerCase = true) {
  const res = text.trim().replace(/\s+/g, " ");
  return lowerCase ? res.toLowerCase() : res;
}

/**
 * Trims extra whitespace, split it and uppercase first letter then it joins to create a string.
 *
 * @param text The text.
 * @returns Capitalized text.
 */
export function capitalizeLetters(text: string) {
  return text
    .toLowerCase()
    .trim()
    .split(" ")
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(" ");
}

/**
 * Removes all whitespace.
 *
 * @param text The text.
 * @returns Text without any whitespace.
 */
export function removeWhiteSpaces(text: string) {
  return text.replace(/\s/g, "");
}

/**
 * Generates random number.
 * @param length The length of the generated number.
 * @returns Random set of numbers.
 */
export function digitGen(length: number) {
  let digit = "";
  for (let index = 0; index < length; index++) {
    digit += Math.round(Math.random() * 9);
  }
  return digit;
}
/**
 * It validates the string or the array. It checks if the length is bigger than zero. Since split returns [''], we need to check multiple times for the Array
 * @param text The text.
 * @returns true if the string is longer than zero
 */

export function lengthValidator(text: string | string[]) {
  // TODO: Prompt an error message but sometimes I wan't to get false because it's conditional
  if (Array.isArray(text))
    return text.length > 0 && text[0].length > 0 ? true : false;
  if (text.trim().length <= 0) return false;
  return true;
}

export function numberValidator(value: string, errorMessage = true) {
  const validator = !isNaN(parseInt(value)) && lengthValidator(value);
  if (errorMessage) return validator ? true : "Sadece sayılar yazılmalı!";
  return validator;
}

export function convertToNumber(value: string, float = true) {
  const v = value.replace(/,/gi, ".");
  if (float) return parseFloat(v);
  return parseInt(v);
}

// I didn't bother, it's from ChatGPT
export function convertPath(path: string) {
  // Remove extra slashes and replace them with a single slash
  const cleanedPath = path.replace(/\/+/g, "/");

  // Split the path into individual segments
  const segments = cleanedPath.split("/");

  // Remove empty segments
  const filteredSegments = segments.filter((segment) => segment !== "");

  // Join the segments with double backslashes
  const convertedPath = filteredSegments.join("\\");

  // Add the drive letter and trailing backslash
  return (
    convertedPath.charAt(0).toUpperCase() + ":" + convertedPath.slice(1) + "\\"
  );
}

/**
 * It writes to JSON file with fs.writeFile
 * @param objStringify the new JSON object
 */
export const writeToJSON = (obj: object, path: string) => {
  const stringify = JSON.stringify(obj);
  // ! The path is dependent on where is the function called from. Remove the ./ if you want to make it accessible from everywhere
  fs.writeFile(path, stringify, "utf8", (err) => {
    if (err) {
      console.log(err);
    }
  });
  JSON.stringify;
};

/**
 * Regex for folder path
 * @example pathRegex.test("C:\\ILoveMyMom")
 */
export const pathRegex = new RegExp(/^[a-zA-Z]:\\(\w+\\)*\w*$/, "i");

/**
 * Replaces Turkish weird I letter with English I letter
 */
export function replaceTurkishI(text: string) {
  return text.replace(/i̇/gi, "i").replace(/İ/gi, "I");
}

import * as XLSX from "xlsx";
import { TrendyolFields, promptAnswersT } from "../types/types";
import { KDVT, categoryT, currencyT, phonesT } from "../variables/variables";

export function writeToExcel(
  resultArray: object[],
  path: string,
  mainModalCode: string,
  caseBrand: string,
  company: "trendyol" | "hepsiburada"
) {
  const sheetName = "Ürünlerinizi Burada Listeleyin";
  // Read the file into memory
  const workbook = XLSX.readFile(`./xlsx/${company}.xlsx`);

  // Convert the XLSX to JSON
  type worksheetsType = {
    [key: string]: object[];
  };
  const worksheets: worksheetsType = {};
  for (const sheetName of workbook.SheetNames) {
    // Some helper functions in XLSX.utils generate different views of the sheets:
    //     XLSX.utils.sheet_to_csv generates CSV
    //     XLSX.utils.sheet_to_txt generates UTF16 Formatted Text
    //     XLSX.utils.sheet_to_html generates HTML
    //     XLSX.utils.sheet_to_json generates an array of objects
    //     XLSX.utils.sheet_to_formulae generates a list of formulae
    worksheets[sheetName] = XLSX.utils.sheet_to_json(
      workbook.Sheets[sheetName]
    );
    // console.log(XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]));
  }

  // Show the data as JSON
  // console.log(
  //   "json:\n",
  //   JSON.stringify(worksheets["Ürünlerinizi Burada Listeleyin"]),
  //   "\n\n"
  // );

  // console.log(worksheets["Ürünlerinizi Burada Listeleyin"][0]);

  // Modify the XLSX
  worksheets[sheetName].push(...resultArray);

  // Update the XLSX file
  // XLSX.utils.sheet_add_json(workbook.Sheets[sheetName], worksheets[sheetName]);
  // XLSX.writeFile(workbook, path);

  // Create a new XLSX file
  const newBook = XLSX.utils.book_new();
  const newSheet = XLSX.utils.json_to_sheet(worksheets[sheetName]);
  XLSX.utils.book_append_sheet(newBook, newSheet, sheetName);
  XLSX.writeFile(
    newBook,
    `${path}\\${caseBrand}-${mainModalCode}-${company}.xlsx`
  );

  // [
  //   'Ürünlerinizi Burada Listeleyin',
  //   'Urun_Ozellik_Bilgileri',
  //   'Yardım'
  // ]
}

/**
 * It shows a prompt
 * @param questionsCollection Question Collection
 * @returns Answers result
 */
export async function showPrompt(questionsCollection: QuestionCollection) {
  const result = await prompt(questionsCollection).catch((error) => {
    if (error.isTtyError) {
      console.log(error.isTtyError);
      // Prompt couldn't be rendered in the current environment
    } else {
      console.log(error);
      // Something else went wrong
    }
  });
  return result;
}

// TODO:
interface InformationLoopType extends promptAnswersT {
  category: typeof categoryT;
  currency: typeof currencyT;
  KDV: typeof KDVT;
  objectArray: object[];
  mainList: typeof phonesT;
  mergedPhonesList: string[];
}

// Phone brand
export const removePhoneBrandRegEx = (phoneType: string) => {
  return new RegExp(replaceTurkishI(phoneType).toLowerCase(), "gi");
};

export async function generateInformationLoop({
  mergedPhonesList,
  phoneBrand,
  title,
  mainModalCode,
  colors,
  companyBrand,
  category,
  currency,
  description,
  stock,
  KDV,
  price,
  globalPrice,
  caseMaterial,
  caseType,
  guaranteePeriod,
  caseBrand,
  objectArray,
  mainList,
}: InformationLoopType) {
  for (let i = 0; i < mergedPhonesList.length; i++) {
    // - This works only if I wrote the phoneType the same as the phone brand written in the file
    // TODO: if the phoneType is 2 words, match for each one. For example: Samsung Galaxy, regex for both individually because sometimes the name is Galaxy without the samsung. The solution is to match for array of words ["samsung", "galaxy"]
    const regex = removePhoneBrandRegEx(phoneBrand);
    // Example: Iphone 11 Pro (from Excel Sheet)
    const phoneName = mergedPhonesList[i] as (typeof mainList)[number];
    // Example: 11 Pro
    const phoneNameWithoutBrand = capitalizeLetters(
      cleanUp(
        replaceTurkishI(phoneName).toLowerCase().replace(regex, ""),
        false
      )
    );
    // Example: 11Pro
    const phoneCode = removeWhiteSpaces(phoneNameWithoutBrand);
    // Example: iPhone 11 Pro Uyumlu I Love Your Mom
    const productTitle = `${phoneBrand} ${phoneNameWithoutBrand} Uyumlu ${title}`;
    // Example: SB-11Pro
    const productModal = `${mainModalCode}-${phoneCode}`;
    // Example: 691
    const randomDigits = digitGen(3);
    for (let j = 0; j < colors.length; j++) {
      // Example: Kırmızı
      const color = colors[j];
      // Example: SuarSB-11ProSari-691
      const barcode = `${capitalizeLetters(
        companyBrand ?? ""
      )}${productModal}-${removeWhiteSpaces(color)}-${randomDigits}`;

      // Fields
      const fields: TrendyolFields = {
        Barkod: barcode,
        "Model Kodu": productModal,
        Marka: companyBrand ?? "",
        Kategori: category,
        "Para Birimi": currency,
        "Ürün Adı": productTitle,
        "Ürün Açıklaması": description,
        "Piyasa Satış Fiyatı (KDV Dahil)": globalPrice,
        "Trendyol'da Satılacak Fiyat (KDV Dahil)": price,
        "Ürün Stok Adedi": stock,
        "Stok Kodu": mainModalCode,
        "KDV Oranı": KDV["3"],
        Desi: "",
        "Görsel 1": "",
        "Görsel 2": "",
        "Görsel 3": "",
        "Görsel 4": "",
        "Görsel 5": "",
        "Görsel 6": "",
        "Görsel 7": "",
        "Görsel 8": "",
        "Sevkiyat Süresi": "",
        "Sevkiyat Tipi": "",
        Renk: color,
        Materyal: caseMaterial,
        Model: caseType,
        "Cep Telefonu Modeli": mainList.includes(phoneName) ? phoneName : "",
        "Garanti Tipi": "",
        "Garanti Süresi": guaranteePeriod,
        "Uyumlu Marka": caseBrand,
      };

      // Push to the array
      objectArray.push(fields);
    }
  }
}

/**
 * Registers the prompts
 */
export function registerPrompts() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  registerPrompt("search-list", require("inquirer-search-list"));
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  registerPrompt("search-checkbox", require("inquirer-search-checkbox"));
}
