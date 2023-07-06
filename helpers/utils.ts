import { QuestionCollection, prompt, registerPrompt } from "inquirer";
import fs from "fs";
import * as XLSX from "xlsx";
import {
  HepsiburadaFields,
  InformationLoopType,
  ProductPromptType,
  TrendyolFields,
} from "../types/types";
import {
  KDVH,
  KDVT,
  categoryT,
  currencyT,
  emptyStringWord,
  phonesT,
} from "../variables/variables";
import {
  hepsiburadaNotionCreateBarcode,
  hepsiburadaNotionCreateProduct,
  hepsiburadaNotionCreateStockCode,
  trendyolNotionCreateBarcode,
  trendyolNotionCreateModelCode,
  trendyolNotionCreateProduct,
} from "../lib/notion";

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

export function numberValidator(value: string | number, errorMessage = true) {
  if (typeof value === "string") {
    const validator = !isNaN(parseFloat(value)) && lengthValidator(value);
    if (errorMessage) return validator ? true : "Sadece sayılar yazılmalı!";
    return validator;
  } else {
    return true;
  }
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

export function writeToExcel(
  resultArray: object[],
  path: string,
  mainModalCode: string,
  caseBrand: string,
  company: "trendyol" | "hepsiburada"
) {
  // Sheet name depending on company
  let sheetName;
  switch (company) {
    case "hepsiburada":
      sheetName = "Kılıflar";
      break;
    case "trendyol":
      sheetName = "Ürünlerinizi Burada Listeleyin";
      break;
  }
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

// Phone brand
export const removePhoneBrandRegEx = (phoneType: string) => {
  return new RegExp(replaceTurkishI(phoneType).toLowerCase(), "gi");
};

export async function generateInformationLoop(props: InformationLoopType) {
  const {
    mergedPhonesList,
    phoneBrand,
    title,
    productCode,
    colors,
    trademark,
    productDescription,
    stockAmount,
    price,
    caseMaterial,
    caseType,
    caseBrand,
    objectArray,
    company,
  } = props;
  if (company === "trendyol") {
    for (let i = 0; i < mergedPhonesList.length; i++) {
      // - This works only if I wrote the phoneType the same as the phone brand written in the file
      // TODO: if the phoneType is 2 words, match for each one. For example: Samsung Galaxy, regex for both individually because sometimes the name is Galaxy without the samsung. The solution is to match for array of words ["samsung", "galaxy"]
      const regex = removePhoneBrandRegEx(phoneBrand);
      // Example: Iphone 11 Pro (from Excel Sheet)
      const phoneName = mergedPhonesList[i] as (typeof phonesT)[number];
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
      const productModal = `${productCode}-${phoneCode}`;
      // Example: 691
      const randomDigits = digitGen(3);
      for (let j = 0; j < colors.length; j++) {
        // Example: Kırmızı
        const color = colors[j];
        // Example: SuarSB-11ProSari-691
        const barcode = `${capitalizeLetters(
          trademark ?? ""
        )}${productModal}-${removeWhiteSpaces(color)}-${randomDigits}`;

        // Fields
        const fields: TrendyolFields = {
          Barkod: barcode,
          "Model Kodu": productModal,
          Marka: trademark ?? "",
          Kategori: categoryT,
          "Para Birimi": currencyT,
          "Ürün Adı": productTitle,
          "Ürün Açıklaması": productDescription,
          "Piyasa Satış Fiyatı (KDV Dahil)": props.marketPrice,
          "Trendyol'da Satılacak Fiyat (KDV Dahil)": price,
          "Ürün Stok Adedi": stockAmount,
          "Stok Kodu": productCode,
          "KDV Oranı": KDVT["3"],
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
          Materyal: replaceEmptyStringWord(caseMaterial, emptyStringWord),
          Model: replaceEmptyStringWord(caseType, emptyStringWord),
          "Cep Telefonu Modeli": phonesT.includes(phoneName) ? phoneName : "",
          "Garanti Tipi": "",
          "Garanti Süresi": props.guaranteePeriod,
          "Uyumlu Marka": caseBrand,
        };

        // Push to the array
        objectArray.push(fields);
      }
    }
  } else if (company === "hepsiburada") {
    for (let i = 0; i < mergedPhonesList.length; i++) {
      // Example: Iphone 11 Pro (from Excel Sheet)
      const regex = removePhoneBrandRegEx(phoneBrand);
      // Example: Iphone 11 Pro (from Excel Sheet)
      const phoneName = mergedPhonesList[i] as (typeof phonesT)[number];
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
      const productModal = `${productCode}-${phoneCode}`;
      // Example: 691
      // const randomDigits = digitGen(3);
      const randomDigits = generateStupidHepsiburadaBarcode();
      for (let j = 0; j < colors.length; j++) {
        // Example: Kırmızı
        const color = colors[j];
        // Example: SuarSB-11Pro-Sari-691
        // TODO: check if there is a better way to the barcode
        // const barcode = `${capitalizeLetters(
        //   trademark ?? ""
        // )}${productModal}-${removeWhiteSpaces(color)}-${randomDigits}`;
        const barcode = randomDigits;

        // Example: SB-11Pro-Siyah
        const iHateHepsiburada = `${productModal}-${removeWhiteSpaces(
          color
        )}`.toUpperCase();

        for (let x = 0; x < props.options.length; x++) {
          const option = props.options[x];
          // Fields
          const fields = {
            "Ürün Adı": productTitle,
            "Satıcı Stok Kodu": iHateHepsiburada, // Cause HEPSIBURADA SUCKS
            Barkod: barcode,
            "Varyant Grup Id": productModal,
            "Ürün Açıklaması": productDescription,
            Marka: trademark ?? "",
            Desi: 1,
            KDV: KDVH[3],
            "Garanti Süresi (Ay)": 0,
            Görsel1: "",
            Görsel2: "",
            Görsel3: "",
            Görsel4: "",
            Görsel5: "",
            Fiyat: price,
            Stok: stockAmount,
            Video: "",
            "Uyumlu Model": "", // TODO: it might not match or it won't
            Renk: color,
            Seçenek: option,
            "Telefon Modeli": phoneName,
            "Uyumlu Marka": caseBrand,
            "Garanti Tipi": "",
            "Su Geçirmezlik": "",
            "Ürün  Kodu": "",
            "Malzeme Türü": caseMaterial,
            "Garanti Tipi2": "",
            "Kılıf Tipi": caseType,
          };

          // Push to the array
          objectArray.push(fields);
        }
      }
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

// TODO: Add an option to create a new product or add to existing product
// - Query notion database => pass it to inq search list

export async function runNotion(
  props: { title: string } & (
    | { company: "trendyol"; objectArray: TrendyolFields[] }
    | {
        company: "hepsiburada";
        objectArray: HepsiburadaFields[];
        productCode: string;
      }
  )
) {
  const { title, objectArray, company } = props;
  if (company === "trendyol") {
    const product = objectArray[0];
    try {
      // Create product (it's 1 product so it won't matter if it's the first product of the last one)
      const productId = await trendyolNotionCreateProduct({
        title: title,
        price: product["Trendyol'da Satılacak Fiyat (KDV Dahil)"],
        piyasa: product["Piyasa Satış Fiyatı (KDV Dahil)"],
        mainModalCode: product["Stok Kodu"],
        description: product["Ürün Açıklaması"],
      });

      const currentModelCode: {
        relation: string | null;
        modelCode: string | null;
      } = { relation: null, modelCode: null };
      // Loop over each object, If the model code is the same as the last one then don't create any, it it is not then create new model code
      // null !== "SB-11" => TruFe
      // "SB-11" !== "SB-11" => False
      // "SB-11" !== "SB-12" => True

      for (let index = 0; index < objectArray.length; index++) {
        const obj = objectArray[index];
        if (currentModelCode.modelCode !== obj["Model Kodu"]) {
          const modelId = await trendyolNotionCreateModelCode({
            modelCode: obj["Model Kodu"],
            relationId: productId,
          });
          await trendyolNotionCreateBarcode({
            barcode: obj["Barkod"],
            relationId: modelId,
          });
          currentModelCode.modelCode = obj["Model Kodu"];
          currentModelCode.relation = modelId;
        } else {
          await trendyolNotionCreateBarcode({
            barcode: obj["Barkod"],
            // This will definitely will not run on the first time
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            relationId: currentModelCode.relation!,
          });
        }
        await sleep(300);
      }
    } catch (error) {
      console.log(error);
    }
  } else if (company === "hepsiburada") {
    const product = objectArray[0];
    try {
      // Create product (it's 1 product so it won't matter if it's the first product of the last one)
      const productId = await hepsiburadaNotionCreateProduct({
        title: product["Ürün Adı"],
        price: product["Fiyat"],
        mainModalCode: props.productCode,
        description: product["Ürün Açıklaması"],
      });
      for (let index = 0; index < objectArray.length; index++) {
        const obj = objectArray[index];
        await hepsiburadaNotionCreateStockCode({
          stockCode: obj["Satıcı Stok Kodu"],
          relationId: productId,
        });
        await sleep(300);
        await hepsiburadaNotionCreateBarcode({
          barcode: obj["Barkod"],
          relationId: productId,
        });
        await sleep(300);
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export function replaceEmptyStringWord<T>(value: T, emptyStringWord: string) {
  return value === emptyStringWord ? "" : value;
}

export function generateStupidHepsiburadaBarcode() {
  // Generate 12 random digits
  let digits = "";
  for (let i = 0; i < 12; i++) {
    digits += Math.floor(Math.random() * 10);
  }

  // Calculate the check digit
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(digits.charAt(i)) * (i % 2 === 0 ? 1 : 3);
  }
  const checkDigit = (10 - (sum % 10)) % 10;

  // Construct the final EAN-13 barcode
  const barcode = digits + checkDigit;
  return `kılıfsuaraksesuar${barcode}`;
}

export async function compile(props: ProductPromptType) {
  const {
    path,
    askToRunNotion,
    productCode,
    caseBrand,
    title,
    writtenPhonesList,
    phonesList,
    phonesCollections,
    company,
  } = props;

  const mergedPhonesList = [
    ...writtenPhonesList,
    ...phonesList,
    ...phonesCollections,
  ];
  const objectArray: TrendyolFields[] & HepsiburadaFields[] = [];
  generateInformationLoop({
    ...props,
    mergedPhonesList,
    objectArray,
  });

  try {
    // Write to excel file
    writeToExcel(
      objectArray,
      cleanUp(path, false).replace(/"/gi, ""),
      productCode,
      caseBrand,
      company
    );

    if (askToRunNotion)
      await runNotion({
        title: title,
        objectArray: objectArray,
        company: company,
        productCode,
      });
  } catch (error) {
    console.log(error);
  }
}
