import {
  capitalizeLetters,
  cleanUp,
  convertToNumber,
  digitGen,
  registerPrompts,
  removeWhiteSpaces,
  replaceTurkishI,
  showPrompt,
  sleep,
  writeToExcel,
} from "./helpers/utils";
import configFileObject from "./config/config.json";

// import * as fs from "fs";
import { KDVT, categoryT, currencyT } from "./variables/variables";
import { promptAnswersT } from "./types/types";
import { promptQuestionsT } from "./variables/prompts";
import {
  trendyolNotionCreateBarcode,
  trendyolNotionCreateModelCode,
  trendyolNotionCreateProduct,
} from "./lib/notion";
// import * as ExcelJS from "exceljs";

registerPrompts();

(async () => {
  const result = (await showPrompt(
    promptQuestionsT(configFileObject)
  )) as promptAnswersT;
  compile(result);
})();

// - Helpers

async function compile({
  brand,
  caseBrand,
  caseType,
  colors,
  description,
  globalPrice,
  guaranteePeriod,
  mainModalCode,
  material,
  phoneType,
  phonesList,
  price,
  stock,
  title,
  path,
  askToRunNotion,
}: promptAnswersT) {
  const res = [];
  for (let i = 0; i < phonesList.length; i++) {
    // Example: Iphone 11 Pro (from Excel Sheet)
    const phoneName = phonesList[i];
    // - This doesn't work on 2 words brand
    // const phoneCode = capitalizeLetters(
    //   phonesList[i].split(" ").slice(1).join(" ")
    // );
    // - This works only if I wrote the phoneType the same as the phone brand written in the file
    // TODO: if the phoneType is 2 words, match for each one. For example: Samsung Galaxy, regex for both individually because sometimes the name is Galaxy without the samsung
    // TODO: Replace words from array of words ["samsung", "galaxy"]
    const regex = new RegExp(replaceTurkishI(phoneType).toLowerCase(), "gi");
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
    const productTitle = `${phoneType} ${phoneNameWithoutBrand} Uyumlu ${title}`;
    // Example: SB-11Pro
    const productModal = `${mainModalCode}-${phoneCode}`;
    // Example: 691
    const randomDigits = digitGen(3);
    for (let j = 0; j < colors.length; j++) {
      // Example: Kırmızı
      const color = colors[j];
      // Example: SuarSB-11ProSari-691
      const barcode = `${capitalizeLetters(
        brand ?? ""
      )}${productModal}-${removeWhiteSpaces(color)}-${randomDigits}`;

      // Fields
      const fields = {
        Barkod: barcode,
        "Model Kodu": productModal,
        Marka: brand ?? "",
        Kategori: categoryT,
        "Para Birimi": currencyT,
        "Ürün Adı": productTitle,
        "Ürün Açıklaması": description,
        "Piyasa Satış Fiyatı (KDV Dahil)": globalPrice,
        "Trendyol'da Satılacak Fiyat (KDV Dahil)": price,
        "Ürün Stok Adedi": stock,
        "Stok Kodu": mainModalCode,
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
        Materyal: material,
        Model: caseType,
        "Cep Telefonu Modeli": phoneName,
        "Garanti Tipi": "",
        "Garanti Süresi": guaranteePeriod,
        "Uyumlu Marka": caseBrand,
      };

      // Push to the array
      res.push(fields);
    }
  }

  try {
    // Write to excel file
    writeToExcel(
      res,
      cleanUp(path, false).replace(/"/gi, ""),
      mainModalCode,
      caseBrand,
      "trendyol"
    );

    if (!askToRunNotion) return;
    // Create product (it's 1 product so it won't matter if it's the first product of the last one)
    const productId = await trendyolNotionCreateProduct({
      title: title,
      price: convertToNumber(res[0]["Trendyol'da Satılacak Fiyat (KDV Dahil)"]),
      piyasa: convertToNumber(res[0]["Piyasa Satış Fiyatı (KDV Dahil)"]),
      mainModalCode: res[0]["Stok Kodu"],
      description: res[0]["Ürün Açıklaması"],
    });

    const currentModelCode: {
      relation: string | null;
      modelCode: string | null;
    } = { relation: null, modelCode: null };
    // Loop over each object, If the model code is the same as the last one then don't create any, it it is not then create new model code
    // null !== "SB-11" => TruFe
    // "SB-11" !== "SB-11" => False
    // "SB-11" !== "SB-12" => True
    // TODO: I'm sure there is better way with guard clause
    // res.forEach(async (obj, index) => {
    // });

    for (let index = 0; index < res.length; index++) {
      const obj = res[index];
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
          // This will definitely not run on the first time
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          relationId: currentModelCode.relation!,
        });
      }
      await sleep(300);
    }
  } catch (error) {
    console.log(error);
  }
}

// TODO: Create without the list because most of redmi phone is not included or create secondary list and merge it but the merged list should not be included in the Telefon Modeli
// TODO: Pack of phones in the config file
// TODO: Count of phones selected
// TODO: Add second message to the config.json
// TODO: Merge phones in one list => iPhone 11: {hepsiburada: "iPhone 11", trendyol: "iphone 11"}
// TODO: Add an option to create a new product or add to existing product
