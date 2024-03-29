import fs from "fs";
import { QuestionCollection, prompt, registerPrompt } from "inquirer";
import * as XLSX from "xlsx";
import {
  hepsiburadaNotionCreateProduct,
  hepsiburadaNotionCreateStockCode,
  trendyolNotionCreateBarcode,
  trendyolNotionCreateModelCode,
  trendyolNotionCreateProduct,
} from "../lib/notion";
import {
  HepsiburadaEarPhonesFields,
  HepsiburadaEarPhonesPromptType,
  HepsiburadaFields,
  HepsiburadaPromptType,
  HepsiburadaWatchFields,
  HepsiburadaWatchPromptType,
  InformationLoopType,
  ProductPromptType,
  ProductTypes,
  PromptQuestionFunctionProps,
  TrendyolEarPhonesFields,
  TrendyolEarPhonesPromptType,
  TrendyolFields,
  TrendyolPromptType,
  TrendyolWatchFields,
  TrendyolWatchPromptType,
  phonesCollectionPromptType,
} from "../types/types";
import {
  KDVH,
  KDVT,
  categoryEarPhonesT,
  categoryT,
  categoryWatchT,
  crapH,
  currencyT,
  earPhonesT,
  emptyStringWord,
  mmT,
  phonesH,
  phonesT,
} from "../variables/variables";

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

export function lengthValidator<T extends string | T[]>(
  text: T | T[] | [],
  errorMessage = false
) {
  if (Array.isArray(text)) {
    const arrayLength = text.length > 0;
    // [{}][0].length => undefined so we need to check for it.
    if (typeof text[0] === "string") {
      return arrayLength && text[0].length > 0
        ? true
        : errorMessage
        ? "Alan boş bırakılmamalı!"
        : false;
    } else {
      return arrayLength
        ? true
        : errorMessage
        ? "Alan boş bırakılmamalı!"
        : false;
    }
  }
  if (text.trim().length <= 0)
    return errorMessage ? "Alan boş bırakılmamalı!" : false;
  return true;
}

/**
 * It checks if the passed value is a number
 * @param value the value which might be a string or a number.
 * @param errorMessage the default is true. When set to true it returns an error message instead of boolean value
 * @returns If the value is a number return true.
 */
export function numberValidator(value: string, errorMessage = true) {
  if (typeof value === "string") {
    const validator = !isNaN(parseFloat(value)) && lengthValidator(value);
    if (errorMessage) return validator ? true : "Sadece sayılar yazılmalı!";
    return validator;
  } else {
    return true;
  }
}

/**
 * Converts string to a number
 * @param value string which will get converted to a number
 * @param float I want number with float
 * @returns a number
 */
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
 * @param text
 * @returns a text without Turkish letters
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
      throw new Error(error.isTtyError);
      // Prompt couldn't be rendered in the current environment
    } else {
      console.log(error);
      throw new Error(error);

      // Something else went wrong
    }
  });
  return result;
}

/**
 * Regex to remove phoneBrand
 * @param phoneBrand Name of the phone brand
 * @returns
 */
export const removePhoneBrandRegEx = (phoneBrand: string) => {
  return new RegExp(replaceTurkishI(phoneBrand).toLowerCase(), "gi");
};

/**
 * Generate information about the product like barcode and adds it to a field
 * @param props
 */
export function generateCaseInfoLoop(props: InformationLoopType) {
  if (props.productType === "kordon") throw new Error("Wrong loop!");
  if (props.productType === "kulaklık") throw new Error("Wrong loop!");
  if (props.productType === "charm") throw new Error("Wrong loop!");
  const {
    mergedPhonesList,
    productBrand,
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
      const regex = removePhoneBrandRegEx(productBrand);
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
      const productTitle = `${productBrand} ${phoneNameWithoutBrand} Uyumlu ${title}`;
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
      const regex = removePhoneBrandRegEx(productBrand);
      // Example: Iphone 11 Pro (from Excel Sheet)
      const phoneName = mergedPhonesList[i] as (typeof phonesH)[number] &
        (typeof crapH)[number];
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
      const productTitle = `${productBrand} ${phoneNameWithoutBrand} Uyumlu ${title}`;
      // Example: SB-11Pro
      const productModal = `${productCode}-${phoneCode}`;
      // Example: 691
      // const randomDigits = digitGen(3);
      for (let j = 0; j < colors.length; j++) {
        // Example: Kırmızı
        const color = colors[j];
        // Example: SuarSB-11Pro-Sari-691
        // TODO: check if there is a better way to the barcode
        // const barcode = `${capitalizeLetters(
        //   trademark ?? ""
        // )}${productModal}-${removeWhiteSpaces(color)}-${randomDigits}`;
        // const barcode = randomDigits;

        // Example: SB-11Pro-Siyah
        const iHateHepsiburada = `${productModal}-${removeWhiteSpaces(
          color
        )}`.toUpperCase();

        // This runs because props is ['']
        for (let x = 0; x < props.options.length; x++) {
          const randomDigits = generateStupidHepsiburadaBarcode();
          const option = props.options[x];
          // Fields
          const fields: HepsiburadaFields = {
            "Ürün Adı": productTitle,
            "Satıcı Stok Kodu": option
              ? `${iHateHepsiburada}-${option}`
              : iHateHepsiburada, // Cause HEPSIBURADA SUCKS
            Barkod: randomDigits,
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
            Fiyat: convertToCommaNumber(price),
            Stok: stockAmount,
            Video: "",
            "Uyumlu Model": crapH.includes(phoneName) ? phoneName : "",
            Renk: color,
            Seçenek: option,
            "Telefon Modeli": phonesH.includes(phoneName) ? phoneName : "",
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

export function generateEarPhonesInfoLoop(props: InformationLoopType) {
  if (props.productType === "kordon") throw new Error("Wrong loop!");
  if (props.productType === "kılıf") throw new Error("Wrong loop!");
  if (props.productType === "charm") throw new Error("Wrong loop!");
  const {
    mergedPhonesList,
    productBrand,
    title,
    productCode,
    colors,
    trademark,
    productDescription,
    stockAmount,
    price,
    objectArray,
    company,
  } = props;
  if (company === "trendyol") {
    for (let i = 0; i < mergedPhonesList.length; i++) {
      // - This works only if I wrote the phoneType the same as the phone brand written in the file
      // TODO: if the phoneType is 2 words, match for each one. For example: Samsung Galaxy, regex for both individually because sometimes the name is Galaxy without the samsung. The solution is to match for array of words ["samsung", "galaxy"]
      const regex = removePhoneBrandRegEx(productBrand);
      // Example: Iphone 11 Pro (from Excel Sheet)
      const phoneName = mergedPhonesList[i] as (typeof earPhonesT)[number];
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
      const productTitle = `${productBrand} ${phoneNameWithoutBrand} Uyumlu ${title}`;
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
        const fields: TrendyolEarPhonesFields = {
          Barkod: barcode,
          "Model Kodu": productModal,
          Marka: trademark ?? "",
          Kategori: categoryEarPhonesT,
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
          "Garanti Süresi": props.guaranteePeriod,
          "Uyumlu Marka": props.earPhonesBrand,
          "Uyumlu Model": earPhonesT.includes(phoneName) ? phoneName : "",
        };

        // Push to the array
        objectArray.push(fields);
      }
    }
  } else if (company === "hepsiburada") {
    for (let i = 0; i < mergedPhonesList.length; i++) {
      // Example: Iphone 11 Pro (from Excel Sheet)
      const regex = removePhoneBrandRegEx(productBrand);
      // Example: Iphone 11 Pro (from Excel Sheet)
      const phoneName = mergedPhonesList[i] as (typeof phonesH)[number] &
        (typeof crapH)[number];
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
      const productTitle = `${productBrand} ${phoneNameWithoutBrand} Uyumlu ${title}`;
      // Example: SB-11Pro
      const productModal = `${productCode}-${phoneCode}`;
      // Example: 691
      // const randomDigits = digitGen(3);
      for (let j = 0; j < colors.length; j++) {
        // Example: Kırmızı
        const color = colors[j];
        // Example: SuarSB-11Pro-Sari-691
        // TODO: check if there is a better way to the barcode
        // const barcode = `${capitalizeLetters(
        //   trademark ?? ""
        // )}${productModal}-${removeWhiteSpaces(color)}-${randomDigits}`;
        // const barcode = randomDigits;

        // Example: SB-11Pro-Siyah
        const iHateHepsiburada = `${productModal}-${removeWhiteSpaces(
          color
        )}`.toUpperCase();

        const randomDigits = generateStupidHepsiburadaBarcode();
        // Fields
        const fields: HepsiburadaEarPhonesFields = {
          "Ürün Adı": productTitle,
          "Satıcı Stok Kodu": iHateHepsiburada, // Cause HEPSIBURADA SUCKS
          Barkod: randomDigits,
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
          Fiyat: convertToCommaNumber(price),
          Stok: stockAmount,
          Video: "",
          Renk: color,
          "Kulaklık Aksesuarı Türü": props.earPhonesAccessoryType,
        };

        // Push to the array
        objectArray.push(fields);
      }
    }
  }
}

// TODO: Remove duplicated code );
export function generateWatchInfoLoop(props: InformationLoopType) {
  if (props.productType === "kılıf") throw new Error("Wrong loop!");
  if (props.productType === "kulaklık") throw new Error("Wrong loop!");
  if (props.productType === "charm") throw new Error("Wrong loop!");
  const {
    mergedPhonesList,
    productBrand,
    title,
    productCode,
    colors,
    trademark,
    productDescription,
    stockAmount,
    price,
    objectArray,
    company,
  } = props;
  if (company === "trendyol") {
    const { watchMaterial, mmList, writtenMmList, watchBrand } = props;
    const mergedMmList = [...mmList, ...writtenMmList];
    for (let i = 0; i < mergedPhonesList.length; i++) {
      // - This works only if I wrote the phoneType the same as the phone brand written in the file
      // TODO: if the phoneType is 2 words, match for each one. For example: Samsung Galaxy, regex for both individually because sometimes the name is Galaxy without the samsung. The solution is to match for array of words ["samsung", "galaxy"]
      const regex = removePhoneBrandRegEx(productBrand);
      // Example: Iphone 11 Pro (from Excel Sheet)
      const phoneName = mergedPhonesList[i] as (typeof phonesT)[number];
      // Example: 11 Pro
      const phoneNameWithoutBrand = capitalizeLetters(
        cleanUp(
          replaceTurkishI(phoneName).toLowerCase().replace(regex, ""),
          false
        )
      );
      // // Example: 11Pro
      // const phoneCode = removeWhiteSpaces(phoneNameWithoutBrand);
      // Example: 691
      const randomDigits = digitGen(3);

      for (let j = 0; j < colors.length; j++) {
        for (let m = 0; m < mergedMmList.length; m++) {
          const mm = removeWhiteSpaces(mergedMmList[m].replace(/m/gi, ""));
          // Example: SB-11Pro
          const productModal = `${productCode}-${productBrand}-${mm}mm`;

          // Example: iPhone 11 Pro Uyumlu I Love Your Mom
          const productTitle = `${productBrand} ${phoneNameWithoutBrand} (${mm} mm) Uyumlu ${title}`;

          // Example: Kırmızı
          const color = colors[j];
          // Example: SuarSB-11ProSari-691
          const barcode = `${capitalizeLetters(
            trademark ?? ""
          )}${productCode}-${removeWhiteSpaces(color)}-${mm}mm-${randomDigits}`;

          // Fields
          const fields: TrendyolWatchFields = {
            Barkod: barcode,
            "Model Kodu": productModal,
            Marka: trademark ?? "",
            Kategori: categoryWatchT,
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
            Beden: mmT.includes(`${mm.slice(0, 2)} mm` as (typeof mmT)[number])
              ? (`${mm.slice(0, 2)} mm` as (typeof mmT)[number])
              : "",
            Materyal: replaceEmptyStringWord(watchMaterial, emptyStringWord),
            "Garanti Süresi": props.guaranteePeriod,
            "Uyumlu Marka": watchBrand,
          };

          // Push to the array
          objectArray.push(fields);
        }
      }
    }
  } else if (company === "hepsiburada") {
    const { watchBrand, writtenMmList } = props;
    for (let i = 0; i < mergedPhonesList.length; i++) {
      // Example: Iphone 11 Pro (from Excel Sheet)
      const regex = removePhoneBrandRegEx(productBrand);
      // Example: Iphone 11 Pro (from Excel Sheet)
      const phoneName = mergedPhonesList[i] as (typeof phonesH)[number] &
        (typeof crapH)[number];
      // Example: 11 Pro
      const phoneNameWithoutBrand = capitalizeLetters(
        cleanUp(
          replaceTurkishI(phoneName).toLowerCase().replace(regex, ""),
          false
        )
      );
      // // Example: 11Pro
      // const phoneCode = removeWhiteSpaces(phoneNameWithoutBrand);
      // Example: 691
      // const randomDigits = digitGen(3);
      for (let j = 0; j < colors.length; j++) {
        for (let m = 0; m < writtenMmList.length; m++) {
          const mm = removeWhiteSpaces(writtenMmList[m].replace(/m/gi, ""));
          // Example: SB-11Pro
          const productModal = `${productCode}-${productBrand}-${mm}mm`;

          // Example: iPhone 11 Pro Uyumlu I Love Your Mom
          const productTitle = `${productBrand} ${phoneNameWithoutBrand} (${mm} mm) Uyumlu ${title}`;

          // Example: Kırmızı
          const color = colors[j];
          // Example: SuarSB-11Pro-Sari-691

          // Example: SB-11Pro-Siyah
          const iHateHepsiburada = `${productModal}-${removeWhiteSpaces(
            color
          )}`.toUpperCase();

          for (let x = 0; x < props.options.length; x++) {
            const randomDigits = generateStupidHepsiburadaBarcode();
            const option = props.options[x];
            // Fields
            const fields: HepsiburadaWatchFields = {
              "Ürün Adı": productTitle,
              "Satıcı Stok Kodu": iHateHepsiburada, // Cause HEPSIBURADA SUCKS
              Barkod: randomDigits,
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
              Fiyat: convertToCommaNumber(price),
              Stok: stockAmount,
              Video: "",
              Renk: color,
              Seçenek: option,
              "Uyumlu Marka": watchBrand,
            };

            // Push to the array
            objectArray.push(fields);
          }
        }
      }
    }
  }
}
export function generateCharmInfoLoop(props: InformationLoopType) {
  if (props.productType === "kılıf") throw new Error("Wrong loop!");
  if (props.productType === "kulaklık") throw new Error("Wrong loop!");
  if (props.productType === "kordon") throw new Error("Wrong loop!");
  const {
    productBrand,
    title,
    productCode,
    colors,
    trademark,
    productDescription,
    stockAmount,
    price,
    objectArray,
    company,
  } = props;
  if (company === "trendyol") {
    const { watchMaterial, watchBrand, charmLetters } = props;
    if (charmLetters.length > 0) {
      for (let j = 0; j < colors.length; j++) {
        for (let k = 0; k < charmLetters.length; k++) {
          const charmLetter = charmLetters[k];
          const productModal = `${productBrand}-${productCode}`;
          const randomDigits = digitGen(3);

          // Example: Apple Watch
          const productTitle = `${productBrand} Uyumlu ${charmLetter} ${title}`;

          // Example: Kırmızı
          const color = colors[j];
          // Example: SuarSB-11ProSari-691
          const barcode = `${capitalizeLetters(
            trademark ?? ""
          )}${productCode}-${charmLetter}-${removeWhiteSpaces(
            color
          )}-${randomDigits}`;

          // Fields
          const fields: TrendyolWatchFields = {
            Barkod: barcode,
            "Model Kodu": productModal,
            Marka: trademark ?? "",
            Kategori: categoryWatchT,
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
            Beden: "",
            Materyal: replaceEmptyStringWord(watchMaterial, emptyStringWord),
            "Garanti Süresi": props.guaranteePeriod,
            "Uyumlu Marka": watchBrand,
          };

          // Push to the array
          objectArray.push(fields);
        }
      }
    } else {
      for (let j = 0; j < colors.length; j++) {
        const productModal = `${productBrand}-${productCode}`;
        const randomDigits = digitGen(3);

        // Example: Apple Watch
        const productTitle = `${productBrand} Uyumlu ${title}`;

        // Example: Kırmızı
        const color = colors[j];
        // Example: SuarSB-11ProSari-691
        const barcode = `${capitalizeLetters(
          trademark ?? ""
        )}${productCode}-${removeWhiteSpaces(color)}-${randomDigits}`;

        // Fields
        const fields: TrendyolWatchFields = {
          Barkod: barcode,
          "Model Kodu": productModal,
          Marka: trademark ?? "",
          Kategori: categoryWatchT,
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
          Beden: "",
          Materyal: replaceEmptyStringWord(watchMaterial, emptyStringWord),
          "Garanti Süresi": props.guaranteePeriod,
          "Uyumlu Marka": watchBrand,
        };

        // Push to the array
        objectArray.push(fields);
      }
    }
  } else if (company === "hepsiburada") {
    const { watchBrand, charmLetters } = props;
    if (charmLetters.length > 0) {
      for (let j = 0; j < colors.length; j++) {
        for (let k = 0; k < charmLetters.length; k++) {
          const charmLetter = charmLetters[k];
          // Example: SB-11Pro
          const productModal = `${productBrand}-${productCode}`;

          // Example: iPhone 11 Pro Uyumlu I Love Your Mom
          const productTitle = `${productBrand} Uyumlu ${charmLetter} ${title}`;

          // Example: Kırmızı
          const color = colors[j];
          // Example: SuarSB-11Pro-Sari-691

          // Example: SB-11Pro-Siyah
          const iHateHepsiburada =
            `${productModal}-${charmLetter}-${removeWhiteSpaces(
              color
            )}`.toUpperCase();

          for (let x = 0; x < props.options.length; x++) {
            const randomDigits = generateStupidHepsiburadaBarcode();
            const option = props.options[x];
            // Fields
            const fields: HepsiburadaWatchFields = {
              "Ürün Adı": productTitle,
              "Satıcı Stok Kodu": iHateHepsiburada, // Cause HEPSIBURADA SUCKS
              Barkod: randomDigits,
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
              Fiyat: convertToCommaNumber(price),
              Stok: stockAmount,
              Video: "",
              Renk: color,
              Seçenek: option,
              "Uyumlu Marka": watchBrand,
            };

            // Push to the array
            objectArray.push(fields);
          }
        }
      }
    } else {
      for (let j = 0; j < colors.length; j++) {
        // Example: SB-11Pro
        const productModal = `${productBrand}-${productCode}`;

        // Example: iPhone 11 Pro Uyumlu I Love Your Mom
        const productTitle = `${productBrand} Uyumlu ${title}`;

        // Example: Kırmızı
        const color = colors[j];
        // Example: SuarSB-11Pro-Sari-691

        // Example: SB-11Pro-Siyah
        const iHateHepsiburada = `${productModal}-${removeWhiteSpaces(
          color
        )}`.toUpperCase();

        for (let x = 0; x < props.options.length; x++) {
          const randomDigits = generateStupidHepsiburadaBarcode();
          const option = props.options[x];
          // Fields
          const fields: HepsiburadaWatchFields = {
            "Ürün Adı": productTitle,
            "Satıcı Stok Kodu": iHateHepsiburada, // Cause HEPSIBURADA SUCKS
            Barkod: randomDigits,
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
            Fiyat: convertToCommaNumber(price),
            Stok: stockAmount,
            Video: "",
            Renk: color,
            Seçenek: option,
            "Uyumlu Marka": watchBrand,
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

/**
 * Generates information inside of notion
 * @param props
 */
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
        title: title,
        price: convertToNumber(product["Fiyat"]),
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
        // ! Barcode in hepsiburada is meaningless
        // await hepsiburadaNotionCreateBarcode({
        //   barcode: obj["Barkod"],
        //   relationId: productId,
        // });
        // await sleep(300);
      }
    } catch (error) {
      console.log(error);
    }
  }
}

/**
 * Checks if the passed value equals to the word. If it does we pass empty string else we pass the value.
 * @param value usually a string value
 * @param emptyStringWord a word
 * @returns
 */
export function replaceEmptyStringWord<T>(value: T, word: string) {
  return value === word ? "" : value;
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
  if (props.productType === "kılıf") {
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

    const phonesCollectionsCheck: string[] = [];

    if (phonesCollections) {
      phonesCollectionsCheck.push(...phonesCollections.flat());
    }

    const mergedPhonesList = [
      ...writtenPhonesList,
      ...phonesList,
      ...phonesCollectionsCheck,
    ];

    const objectArray: TrendyolFields[] & HepsiburadaFields[] = [];
    generateCaseInfoLoop({
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
  } else if (props.productType === "kordon") {
    const {
      path,
      askToRunNotion,
      productCode,
      title,
      writtenWatchList,
      company,
      watchList,
      watchCollections,
      watchBrand,
    } = props;

    const phonesCollectionsCheck = [];

    if (watchCollections) {
      phonesCollectionsCheck.push(...watchCollections);
    }

    const mergedPhonesList = [
      ...writtenWatchList,
      ...watchList,
      ...phonesCollectionsCheck,
    ];
    const objectArray: TrendyolFields[] & HepsiburadaFields[] = [];
    generateWatchInfoLoop({
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
        // company === "hepsiburada" ? props.watchBrand : props.productBrand,
        watchBrand,
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
  } else if (props.productType === "kulaklık") {
    const {
      path,
      askToRunNotion,
      productCode,
      title,
      company,
      earPhonesList,
      earPhonesCollections,
      writtenEarPhonesList,
      productBrand,
    } = props;

    const phonesCollectionsCheck = [];

    if (earPhonesCollections) {
      phonesCollectionsCheck.push(...earPhonesCollections);
    }

    const mergedPhonesList = [
      ...writtenEarPhonesList,
      ...earPhonesList,
      ...phonesCollectionsCheck,
    ];
    const objectArray: TrendyolFields[] & HepsiburadaFields[] = [];
    generateEarPhonesInfoLoop({
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
        company === "trendyol" ? props.earPhonesBrand : productBrand,
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
  } else if (props.productType === "charm") {
    const { path, askToRunNotion, productCode, title, company, watchBrand } =
      props;

    const objectArray: TrendyolFields[] & HepsiburadaFields[] = [];
    generateCharmInfoLoop({
      ...props,
      mergedPhonesList: [],
      objectArray,
    });

    try {
      // Write to excel file
      writeToExcel(
        objectArray,
        cleanUp(path, false).replace(/"/gi, ""),
        productCode,
        watchBrand,
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
}

/**
 * Converts a number to a string that contains a comma instead of a dot
 * @param number
 * @returns number string with comma instead of dot. 149.90 => "149,90"
 */
export function convertToCommaNumber(number: number) {
  return number.toString().replace(/\./gi, ",");
}

export function wordBasedOnProductType(productType: ProductTypes) {
  switch (productType) {
    case "kordon":
      return "Saat";
    case "kılıf":
      return "Telefon";
    case "kulaklık":
      return "Kulaklık";
    case "charm":
      return "Charm";
  }
}

import phonesCollectionData from "../config/phonesCollections.json";

export function generateCompanyBasedCollections(
  companies: PromptQuestionFunctionProps[]
) {
  const companyBasedCollections: QuestionCollection[] = [];
  for (let index = 0; index < companies.length; index++) {
    const companyData = companies[index];
    const { company, productType } = companyData;
    const productName = wordBasedOnProductType(productType);
    const suffix = companies.length > 1 ? ` (${company}):` : ":";
    if (productType === "kılıf") {
      const { caseBrands, caseMaterials, caseTypes, company, phonesList } =
        companyData;
      const questionCollection: QuestionCollection = [
        {
          type: "input",
          name: "trademark",
          message: "Marka adı yazınız",
          // validate: lengthValidator,
          suffix,
        },
        {
          type: "search-checkbox",
          name: "phonesCollections",
          message: `${productName} koleksiyonu seçiniz`,
          choices: () => {
            // Get only THIS company array (trendyol)
            const onlyCompanyArray =
              phonesCollectionData.phonesCollections.filter((collection) => {
                const c = collection as phonesCollectionPromptType;
                return c.company === company;
              });
            // Get all collection names and show an array with it
            const collectionNames = onlyCompanyArray.map((collection) => {
              const c = collection as phonesCollectionPromptType;
              return `${c.collectionName} => ${JSON.stringify(
                c.phonesCollection
              )}`;
            });
            return collectionNames;
          },
          filter: (input: string[]) => {
            if (!lengthValidator(input)) return [];
            // Get all collection names from the previous choices and split it by ( =>) and get the first element that contains the name of the collection
            const collectionNames = input.map((collectionName) =>
              collectionName.split(" =>")[0].trim()
            );
            const collections = phonesCollectionData.phonesCollections.filter(
              (collection) => {
                if (
                  collectionNames.includes(collection.collectionName) &&
                  collection.company === company
                )
                  return true;
              }
            );
            return collections.map((collection) => collection.phonesCollection);
          },
          when: () => {
            const onlyCompanyArray =
              phonesCollectionData.phonesCollections.filter((collection) => {
                const c = collection as phonesCollectionPromptType;
                return c.company === company;
              });

            if (onlyCompanyArray.length <= 0) return false;
            return true;
          },
          suffix,
        },
        {
          type: "search-checkbox",
          name: "phonesList",
          message: `${productName} modelleri seçiniz`,
          choices: phonesList,
          validate: (input: string[]) => {
            console.log(`Count: ${input.length}`);
            return true;
          },
          suffix,
        },
        {
          // TODO: Can't trim empty string
          type: "input",
          name: "writtenPhonesList",
          message: `${productName} modelleri yazınız (aralarında virgül koyarak)`,
          filter: (input: string) => {
            if (!lengthValidator(input)) return [];
            return cleanUp(input)
              .split(",")
              .map((phone) => {
                // return removeWhiteSpaces(capitalizeLetters(colorAnswer));
                return capitalizeLetters(phone);
              });
          },
          validate: (
            input: string,
            answers: HepsiburadaPromptType | TrendyolPromptType
          ) => {
            if (
              lengthValidator(answers?.phonesList) ||
              // Because it might not exist
              lengthValidator(answers?.phonesCollections?.flat() ?? [])
            )
              return true;
            return lengthValidator(input)
              ? true
              : `En az 1 ${productName} modeli yazılmalı ya da seçilmeli.`;
          },
          suffix,
        },

        {
          type: "input",
          name: "colors",
          message: "Renkleri yazınız (aralarında virgül koyarak)",
          filter: (input: string) => {
            return cleanUp(input)
              .split(",")
              .map((colorAnswer) => {
                // return removeWhiteSpaces(capitalizeLetters(colorAnswer));
                return capitalizeLetters(colorAnswer);
              });
          },
          validate: (input) => lengthValidator(input, true),
          suffix,
          when: company === "trendyol",
        },

        {
          type: "search-checkbox",
          name: "colors",
          message: "Renkleri seçiniz",
          choices: company === "hepsiburada" ? companyData.colors : [],
          validate: (input) => lengthValidator(input, true),
          suffix,
          when: company === "hepsiburada",
        },
        {
          type: "input",
          name: "options",
          message: "Seçenekler yazınız (aralarında virgül koyarak)",
          filter: (input) => {
            return cleanUp(input)
              .split(",")
              .map((option) => {
                return capitalizeLetters(option);
              });
          },
          suffix,
          when: company === "hepsiburada",
        },
        {
          type: "input",
          name: "marketPrice",
          message: "Piyasa fiyatı yazınız",
          filter: (input) => {
            if (numberValidator(input, false)) {
              return convertToNumber(input);
            } else {
              return input;
            }
          },
          validate: numberValidator,
          suffix,
          when: company === "trendyol",
        },
        {
          type: "search-list",
          name: "caseMaterial",
          message: "Materyal seçiniz",
          choices: caseMaterials,
          suffix,
        },
        {
          type: "search-list",
          name: "caseType",
          message: "Kılıf modeli seçiniz",
          choices: caseTypes,
          suffix,
        },
        {
          type: "search-list",
          name: "guaranteePeriod",
          message: "Garanti süresi seçiniz",
          choices: company === "trendyol" ? companyData.guaranteePeriods : [],
          suffix,
          when: company === "trendyol",
        },
        {
          type: "search-list",
          name: "caseBrand",
          message: "Uyumlu marka seçiniz",
          choices: caseBrands,
          suffix,
        },
      ];
      companyBasedCollections.push(questionCollection);
    } else if (productType === "kordon") {
      const { watchList, watchBrands } = companyData;
      const questionCollection: QuestionCollection = [
        {
          type: "input",
          name: "trademark",
          message: "Marka adı yazınız",
          // validate: lengthValidator,
          suffix,
        },
        {
          type: "search-checkbox",
          name: "watchCollections",
          message: `${productName} koleksiyonu seçiniz`,
          // TODO: Change to watch collection
          choices: () => {
            // Get only THIS company array (trendyol)
            const onlyCompanyArray =
              phonesCollectionData.phonesCollections.filter((collection) => {
                const c = collection as phonesCollectionPromptType;
                return c.company === company;
              });
            // Get all collection names and show an array with it
            const collectionNames = onlyCompanyArray.map((collection) => {
              const c = collection as phonesCollectionPromptType;
              return `${c.collectionName} => ${JSON.stringify(
                c.phonesCollection
              )}`;
            });
            return collectionNames;
          },
          filter: (input: string[]) => {
            if (!lengthValidator(input)) return [];
            // Get all collection names from the previous choices and split it by ( =>) and get the first element that contains the name of the collection
            const collectionNames = input.map((collectionName) =>
              collectionName.split(" =>")[0].trim()
            );
            const collections = phonesCollectionData.phonesCollections.filter(
              (collection) => {
                if (collectionNames.includes(collection.collectionName))
                  return true;
              }
            );
            return collections.map((collection) => collection.phonesCollection);
          },
          when: () => {
            const onlyCompanyArray =
              phonesCollectionData.phonesCollections.filter((collection) => {
                const c = collection as phonesCollectionPromptType;
                return c.company === company;
              });

            if (onlyCompanyArray.length <= 0) return false;
            return true;
          },
          suffix,
        },
        {
          type: "search-checkbox",
          name: "watchList",
          message: `${productName} modelleri seçiniz`,
          choices: watchList,
          validate: (input: string[]) => {
            console.log(`Count: ${input.length}`);
            return true;
          },
          suffix,
        },
        {
          // TODO: Can't trim empty string
          type: "input",
          name: "writtenWatchList",
          message: `${productName} modelleri yazınız (aralarında virgül koyarak)`,
          filter: (input: string) => {
            if (!lengthValidator(input)) return [];
            return cleanUp(input)
              .split(",")
              .map((phone) => {
                // return removeWhiteSpaces(capitalizeLetters(colorAnswer));
                return capitalizeLetters(phone);
              });
          },
          validate: (
            input: string,
            answers: HepsiburadaWatchPromptType | TrendyolWatchPromptType
          ) => {
            if (
              lengthValidator(answers?.watchList) ||
              // Because it might not exist
              lengthValidator(answers?.watchCollections ?? [])
            )
              return true;
            return lengthValidator(input)
              ? true
              : `En az 1 ${productName} modeli yazılmalı ya da seçilmeli.`;
          },
          suffix,
        },
        {
          type: "search-checkbox",
          name: "mmList",
          message: `MM seçiniz`,
          choices: mmT,
          validate: (input: string[]) => {
            console.log(`Count: ${input.length}`);
            return true;
          },
          suffix,
          when: company === "trendyol",
        },
        {
          // TODO: Can't trim empty string
          type: "input",
          name: "writtenMmList",
          message: `MM yazınız (aralarında virgül koyarak)`,
          filter: (input: string) => {
            if (!lengthValidator(input)) return [];
            return cleanUp(input)
              .split(",")
              .map((phone) => {
                // return removeWhiteSpaces(capitalizeLetters(colorAnswer));
                return capitalizeLetters(phone);
              });
          },
          validate: (
            input: string,
            answers: HepsiburadaWatchPromptType | TrendyolWatchPromptType
          ) => {
            // TODO: Add validation
            return true;
            return lengthValidator(input)
              ? true
              : `En az 1 ${productName} modeli yazılmalı ya da seçilmeli.`;
          },
          suffix,
        },
        {
          type: "input",
          name: "colors",
          message: "Renkleri yazınız (aralarında virgül koyarak)",
          filter: (input: string) => {
            return cleanUp(input)
              .split(",")
              .map((colorAnswer) => {
                // return removeWhiteSpaces(capitalizeLetters(colorAnswer));
                return capitalizeLetters(colorAnswer);
              });
          },
          validate: (input) => lengthValidator(input, true),
          suffix,
          when: company === "trendyol",
        },

        {
          type: "search-checkbox",
          name: "colors",
          message: "Renkleri seçiniz",
          choices: company === "hepsiburada" ? companyData.colors : [],
          validate: (input) => lengthValidator(input, true),
          suffix,
          when: company === "hepsiburada",
        },
        {
          type: "input",
          name: "options",
          message: "Seçenekler yazınız (aralarında virgül koyarak)",
          filter: (input) => {
            return cleanUp(input)
              .split(",")
              .map((option) => {
                return capitalizeLetters(option);
              });
          },
          suffix,
          when: company === "hepsiburada",
        },
        {
          type: "input",
          name: "marketPrice",
          message: "Piyasa fiyatı yazınız",
          filter: (input) => {
            if (numberValidator(input, false)) {
              return convertToNumber(input);
            } else {
              return input;
            }
          },
          validate: numberValidator,
          suffix,
          when: company === "trendyol",
        },
        {
          type: "search-list",
          name: "watchMaterial",
          message: "Materyal seçiniz",
          choices:
            company === "trendyol" ? companyData.watchMaterial : undefined,
          suffix,
          when: company === "trendyol",
        },

        {
          type: "search-list",
          name: "guaranteePeriod",
          message: "Garanti süresi seçiniz",
          choices: company === "trendyol" ? companyData.guaranteePeriods : [],
          suffix,
          when: company === "trendyol",
        },
        {
          type: "search-list",
          name: "watchBrand",
          message: "Uyumlu marka seçiniz",
          choices: watchBrands,
          suffix,
        },
      ];
      companyBasedCollections.push(questionCollection);
    } else if (productType === "kulaklık") {
      const { earPhonesList } = companyData;
      const questionCollection: QuestionCollection = [
        {
          type: "input",
          name: "trademark",
          message: "Marka adı yazınız",
          // validate: lengthValidator,
          suffix,
        },
        {
          type: "search-checkbox",
          name: "earPhonesCollections",
          message: `${productName} koleksiyonu seçiniz`,
          // TODO: Change to watch collection
          choices: () => {
            // Get only THIS company array (trendyol)
            const onlyCompanyArray =
              phonesCollectionData.phonesCollections.filter((collection) => {
                const c = collection as phonesCollectionPromptType;
                return c.company === company;
              });
            // Get all collection names and show an array with it
            const collectionNames = onlyCompanyArray.map((collection) => {
              const c = collection as phonesCollectionPromptType;
              return `${c.collectionName} => ${JSON.stringify(
                c.phonesCollection
              )}`;
            });
            return collectionNames;
          },
          filter: (input: string[]) => {
            if (!lengthValidator(input)) return [];
            // Get all collection names from the previous choices and split it by ( =>) and get the first element that contains the name of the collection
            const collectionNames = input.map((collectionName) =>
              collectionName.split(" =>")[0].trim()
            );
            const collections = phonesCollectionData.phonesCollections.filter(
              (collection) => {
                if (collectionNames.includes(collection.collectionName))
                  return true;
              }
            );
            return collections.map((collection) => collection.phonesCollection);
          },
          when: () => {
            const onlyCompanyArray =
              phonesCollectionData.phonesCollections.filter((collection) => {
                const c = collection as phonesCollectionPromptType;
                return c.company === company;
              });

            if (onlyCompanyArray.length <= 0) return false;
            return true;
          },
          suffix,
        },
        {
          type: "search-checkbox",
          name: "earPhonesList",
          message: `${productName} modelleri seçiniz`,
          choices: earPhonesList,
          validate: (input: string[]) => {
            console.log(`Count: ${input.length}`);
            return true;
          },
          suffix,
        },
        {
          // TODO: Can't trim empty string
          type: "input",
          name: "writtenEarPhonesList",
          message: `${productName} modelleri yazınız (aralarında virgül koyarak)`,
          filter: (input: string) => {
            if (!lengthValidator(input)) return [];
            return cleanUp(input)
              .split(",")
              .map((phone) => {
                // return removeWhiteSpaces(capitalizeLetters(colorAnswer));
                return capitalizeLetters(phone);
              });
          },
          validate: (
            input: string,
            answers:
              | HepsiburadaEarPhonesPromptType
              | TrendyolEarPhonesPromptType
          ) => {
            if (
              lengthValidator(answers?.earPhonesList) ||
              // Because it might not exist
              lengthValidator(answers?.earPhonesCollections ?? [])
            )
              return true;
            return lengthValidator(input)
              ? true
              : `En az 1 ${productName} modeli yazılmalı ya da seçilmeli.`;
          },
          suffix,
        },
        {
          type: "input",
          name: "colors",
          message: "Renkleri yazınız (aralarında virgül koyarak)",
          filter: (input: string) => {
            return cleanUp(input)
              .split(",")
              .map((colorAnswer) => {
                // return removeWhiteSpaces(capitalizeLetters(colorAnswer));
                return capitalizeLetters(colorAnswer);
              });
          },
          validate: (input) => lengthValidator(input, true),
          suffix,
          when: company === "trendyol",
        },
        {
          type: "search-checkbox",
          name: "colors",
          message: "Renkleri seçiniz",
          choices: company === "hepsiburada" ? companyData.colors : [],
          validate: (input) => lengthValidator(input, true),
          suffix,
          when: company === "hepsiburada",
        },
        {
          type: "input",
          name: "marketPrice",
          message: "Piyasa fiyatı yazınız",
          filter: (input) => {
            if (numberValidator(input, false)) {
              return convertToNumber(input);
            } else {
              return input;
            }
          },
          validate: numberValidator,
          suffix,
          when: company === "trendyol",
        },
        {
          type: "search-list",
          name: "guaranteePeriod",
          message: "Garanti süresi seçiniz",
          choices: company === "trendyol" ? companyData.guaranteePeriods : [],
          suffix,
          when: company === "trendyol",
        },
        {
          type: "search-list",
          name: "earPhonesBrand",
          message: "Uyumlu marka seçiniz",
          choices: company === "trendyol" ? companyData.earPhonesBrands : [],
          suffix,
          when: company === "trendyol",
        },
        {
          type: "search-list",
          name: "earPhonesAccessoryType",
          message: "Aksesuar türü seçiniz",
          choices:
            company === "hepsiburada"
              ? companyData.earPhonesAccessoryTypes
              : [],
          suffix,
          when: company === "hepsiburada",
        },
      ];
      companyBasedCollections.push(questionCollection);
    } else if (productType === "charm") {
      const { watchBrands } = companyData;
      const questionCollection: QuestionCollection = [
        {
          type: "input",
          name: "trademark",
          message: "Marka adı yazınız",
          // validate: lengthValidator,
          suffix,
        },
        {
          type: "input",
          name: "charmLetters",
          message: `Charm harfi yazınız (aralarında virgül koyarak)`,
          filter: (input: string) => {
            if (!lengthValidator(input)) return [];
            return cleanUp(input)
              .split(",")
              .map((phone) => {
                // return removeWhiteSpaces(capitalizeLetters(colorAnswer));
                return capitalizeLetters(phone);
              });
          },
          suffix,
        },
        {
          type: "input",
          name: "colors",
          message: "Renkleri yazınız (aralarında virgül koyarak)",
          filter: (input: string) => {
            return cleanUp(input)
              .split(",")
              .map((colorAnswer) => {
                // return removeWhiteSpaces(capitalizeLetters(colorAnswer));
                return capitalizeLetters(colorAnswer);
              });
          },
          validate: (input) => lengthValidator(input, true),
          suffix,
          when: company === "trendyol",
        },

        {
          type: "search-checkbox",
          name: "colors",
          message: "Renkleri seçiniz",
          choices: company === "hepsiburada" ? companyData.colors : [],
          validate: (input) => lengthValidator(input, true),
          suffix,
          when: company === "hepsiburada",
        },
        {
          type: "input",
          name: "options",
          message: "Seçenekler yazınız (aralarında virgül koyarak)",
          filter: (input) => {
            return cleanUp(input)
              .split(",")
              .map((option) => {
                return capitalizeLetters(option);
              });
          },
          suffix,
          when: company === "hepsiburada",
        },
        {
          type: "input",
          name: "marketPrice",
          message: "Piyasa fiyatı yazınız",
          filter: (input) => {
            if (numberValidator(input, false)) {
              return convertToNumber(input);
            } else {
              return input;
            }
          },
          validate: numberValidator,
          suffix,
          when: company === "trendyol",
        },
        {
          type: "search-list",
          name: "watchMaterial",
          message: "Materyal seçiniz",
          choices:
            company === "trendyol" ? companyData.watchMaterial : undefined,
          suffix,
          when: company === "trendyol",
        },

        {
          type: "search-list",
          name: "guaranteePeriod",
          message: "Garanti süresi seçiniz",
          choices: company === "trendyol" ? companyData.guaranteePeriods : [],
          suffix,
          when: company === "trendyol",
        },
        {
          type: "search-list",
          name: "watchBrand",
          message: "Uyumlu marka seçiniz",
          choices: watchBrands,
          suffix,
        },
      ];
      companyBasedCollections.push(questionCollection);
    }
  }
  // console.log(companyBasedCollections);
  return companyBasedCollections;
}
