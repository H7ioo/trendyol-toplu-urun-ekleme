/* eslint-disable @typescript-eslint/no-var-requires */
import { QuestionCollection, prompt, registerPrompt } from "inquirer";
import {
  capitalizeLetters,
  cleanUp,
  digitGen,
  lengthValidator,
  numberValidator,
  removeWhiteSpaces,
} from "./helpers/utils";

registerPrompt("search-list", require("inquirer-search-list"));
registerPrompt("search-checkbox", require("inquirer-search-checkbox"));

// # Cep telefon modeli

// TODO: Add KDV (no need if it's always 18)

type promptAnswers = {
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
};

// Questions collection
const promptQuestions: QuestionCollection = [
  {
    type: "input",
    name: "title",
    message: "Ürün adı yazınız",
    filter: (input) => {
      return capitalizeLetters(cleanUp(input));
    },
    validate: lengthValidator,
    suffix: ":",
  },
  {
    type: "input",
    name: "phoneType",
    message: "Telefonun bilinen adı yazınız",
    filter: (input) => {
      return cleanUp(input, false);
    },
    validate: lengthValidator,
    suffix: ":",
  },
  // {
  //   type: "input",
  //   name: "phonesList",
  //   message: "Telefon modelleri yazınız (aralarında virgül koyarak)",
  //   filter: (input, answer) => {
  //     return cleanUp(input)
  //       .split(",")
  //       .map((phoneAnswer) => {
  //         // return removeWhiteSpaces(upperLetters(phoneAnswer));
  //         return capitalizeLetters(phoneAnswer);
  //       });
  //   },
  //   validate: lengthValidator,
  //   suffix: ":",
  // },
  {
    type: "search-checkbox",
    name: "phonesList",
    message: "Telefon modelleri yazınız (aralarında virgül koyarak)",
    choices: phonesT,
    validate: lengthValidator,
    suffix: ":",
  },
  {
    type: "input",
    name: "mainModalCode",
    message: "Ana model kodu yazınız",
    filter: (input) => {
      return cleanUp(input).toUpperCase();
    },
    validate: lengthValidator,
    suffix: ":",
  },
  {
    type: "input",
    name: "brand",
    message: "Marka adı yazınız",
    // validate: lengthValidator,
    suffix: ":",
  },
  {
    type: "input",
    name: "colors",
    message: "Renkleri yazınız (aralarında virgül koyarak)",
    filter: (input) => {
      return cleanUp(input)
        .split(",")
        .map((colorAnswer) => {
          // return removeWhiteSpaces(capitalizeLetters(colorAnswer));
          return capitalizeLetters(colorAnswer);
        });
    },
    validate: lengthValidator,
    suffix: ":",
  },
  {
    type: "input",
    name: "globalPrice",
    message: "Piyasa fiyatı yazınız",
    validate: numberValidator,
    suffix: ":",
  },
  {
    type: "input",
    name: "price",
    message: "Trendyol satış fiyatı yazınız",
    validate: numberValidator,
    suffix: ":",
  },
  {
    type: "input",
    name: "stock",
    message: "Stock adedi yazınız",
    validate: numberValidator,
    suffix: ":",
  },
  {
    type: "input",
    name: "description",
    message: "Ürün açıklaması yazınız",
    validate: lengthValidator,
    suffix: ":",
  },
  {
    type: "search-list",
    name: "material",
    message: "Materyal seçiniz",
    choices: materialsT,
    suffix: ":",
  },
  {
    type: "search-list",
    name: "caseType",
    message: "Kılıf modeli seçiniz",
    choices: casesTypesT,
    suffix: ":",
  },
  {
    type: "search-list",
    name: "guaranteePeriod",
    message: "Garanti süresi seçiniz",
    choices: guaranteesPeriodT,
    suffix: ":",
  },
  {
    type: "search-list",
    name: "caseBrand",
    message: "Uyumlu marka seçiniz",
    choices: caseBrandsT,
    suffix: ":",
  },
  {
    type: "input",
    name: "path",
    message: "Path?",
    validate: lengthValidator,
    suffix: ":",
  },
];

async function main() {
  // Handling prompt
  const res = await prompt(promptQuestions)
    .then((answers) => {
      return answers;
    })
    .catch((error) => {
      if (error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
      } else {
        // Something else went wrong
      }
    });
  //
  const result = res as promptAnswers;
  compile(result);
}
main();

// - Helpers

function compile({
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
}: promptAnswers) {
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
        Barkod: "",
        "Model Kodu": "",
        Marka: "",
        Kategori: "",
        "Para Birimi": "",
        "Ürün Adı": "",
        "Ürün Açıklaması": "",
        "Piyasa Satış Fiyatı (KDV Dahil)": "",
        "Trendyol'da Satılacak Fiyat (KDV Dahil)": "",
        "Ürün Stok Adedi": "",
        "Stok Kodu": "",
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
        Renk: "",
        Materyal: "",
        Model: "",
        "Cep Telefonu Modeli": "",
        "Garanti Tipi": "",
        "Garanti Süresi": "",
        "Uyumlu Marka": "",
      };

      // let fields = {
      //   Barkod: "",
      //   "Model Kodu": "",
      //   Marka: "",
      //   Kategori: "",
      //   "Para Birimi": "",
      //   "Ürün Adı": "",
      //   "Ürün Açıklaması": "",
      //   "Piyasa Satış Fiyatı (KDV Dahil)": "",
      //   "Trendyol'da Satılacak Fiyat (KDV Dahil)": "",
      //   "Ürün Stok Adedi": "",
      //   "KDV Oranı": KDV["3"],
      //   Renk: "",
      //   Materyal: "",
      //   Model: "",
      //   "Cep Telefonu Modeli": "",
      //   "Garanti Süresi": "",
      //   "Uyumlu Marka": "",
      // };

      // Pass the data to the fields
      fields.Barkod = barcode;
      fields["Model Kodu"] = productModal;
      fields["Marka"] = brand ?? "";
      fields.Kategori = categoryT;
      fields["Para Birimi"] = currencyT;
      fields["Ürün Adı"] = productTitle;
      fields["Ürün Açıklaması"] = description;
      fields["Piyasa Satış Fiyatı (KDV Dahil)"] = globalPrice;
      fields["Trendyol'da Satılacak Fiyat (KDV Dahil)"] = price;
      fields["Ürün Stok Adedi"] = stock;
      fields["Stok Kodu"] = mainModalCode;
      fields["KDV Oranı"] = KDVT["3"];
      fields.Renk = color;
      fields.Materyal = material;
      fields.Model = caseType;
      fields["Cep Telefonu Modeli"] = phoneName;
      fields["Garanti Süresi"] = guaranteePeriod;
      fields["Uyumlu Marka"] = caseBrand;
      // Push to the array
      res.push(fields);
    }
  }
  writeToExcel(res, cleanUp(path, false).replace(/"/gi, ""), mainModalCode);
}

function replaceTurkishI(text: string) {
  return text.replace(/i̇/gi, "i").replace(/İ/gi, "I");
}

// import * as fs from "fs";
import * as XLSX from "xlsx";
import {
  KDVT,
  caseBrandsT,
  casesTypesT,
  categoryT,
  currencyT,
  guaranteesPeriodT,
  materialsT,
  phonesT,
} from "./variables/trendyol";
// import * as ExcelJS from "exceljs";

// TODO: Don't override props. Just append to them. (for now it works but not in the way that I want. It should not replace props it should append rows only.)
// TODO: Create a file
function writeToExcel(
  resultArray: object[],
  path: string,
  mainModalCode: string
) {
  const sheetName = "Ürünlerinizi Burada Listeleyin";
  // Read the file into memory
  const workbook = XLSX.readFile("./xlsx/trendyol.xlsx");

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
  XLSX.writeFile(newBook, `${path}\\${mainModalCode}-trendyol.xlsx`);

  // [
  //   'Ürünlerinizi Burada Listeleyin',
  //   'Urun_Ozellik_Bilgileri',
  //   'Yardım'
  // ]
}

// const fields = {
//   Barkod: "732SuarKFAS-11Pembe",
//   "Model Kodu": "KFAS-11",
//   Marka: "SUAR",
//   Kategori: "766",
//   "Para Birimi": "TRY",
//   "Ürün Adı": "iPhone 11 Uyumlu Kedi Figürlü Aynalı Silikon Kılıf",
//   "Ürün Açıklaması":
//     "<div><ul>\r\n" +
//     "\t<li> Bu üstün kaliteli ve sağlam silikon kılıf, en üst düzeyde darbelere karşı koruma sağlar ve cihazınızı güvende tutar. Yüksek kaliteli malzeme kullanılarak üretilmiş olan kılıf, renk değişimi, sararma veya benzeri sorunlarla karşılaşmanızı engeller. Ürün modeli, cihazınızla mükemmel bir uyum sağlar ve tam oturur, böylece her açıdan maksimum koruma sağlar. Kapağı çıkartmadan kolaylıkla tüm slotlara (sarj ve kulaklık girişleri) erişebilirsiniz. Özel kalıbı sayesinde cihazınıza mükemmel bir şekilde uyar ve pratik kullanım sağlar. Ayrıca, kılıfın üzerinde yer alan muhteşem kedi figürleri ve ayna detaylarıyla da dikkat çeker, telefonunuza şık ve göz alıcı bir görünüm kazandırır.\r\n" +
//     "\t</li>\r\n" +
//     "</ul><div>",
//   "Piyasa Satış Fiyatı (KDV Dahil)": 200,
//   "Trendyol'da Satılacak Fiyat (KDV Dahil)": 149.9,
//   "Ürün Stok Adedi": 100,
//   "KDV Oranı": "18",
//   "Görsel 1":
//     "https://marketplace-supplier-media-center.oss-eu-central-1.aliyuncs.com/prod/582477/4b5535dc-338f-4ae1-86ee-729135adf76c/KFAS-11-pembe.jpg?x-oss-process=style/resized",
//   "Görsel 2":
//     "https://marketplace-supplier-media-center.oss-eu-central-1.aliyuncs.com/prod/582477/9dd2015a-f0cb-418f-9ab6-09aa489d63f3/KFAS-11-pembe2.jpg?x-oss-process=style/resized",
//   Renk: "Pembe",
//   Materyal: "Silikon",
//   Model: "Arka Kapak",
//   "Cep Telefonu Modeli": "Iphone 11",
//   "Garanti Süresi": "Belirtilmemiş",
//   "Uyumlu Marka": "Apple",
// };

// const fields = {
//   Barkod: "",
//   "Model Kodu": "",
//   Marka: "",
//   Kategori: "",
//   "Para Birimi": "",
//   "Ürün Adı": "",
//   "Ürün Açıklaması": "",
//   "Piyasa Satış Fiyatı (KDV Dahil)": 1,
//   "Trendyol'da Satılacak Fiyat (KDV Dahil)": 1,
//   "Ürün Stok Adedi": 1,
//   "KDV Oranı": "1",
//   Desi: 1,
//   "Görsel 1": "",
//   "Görsel 2": "",
//   "Görsel 3": "",
//   "Görsel 4": "",
//   "Görsel 5": "",
//   "Görsel 6": "",
//   "Görsel 7": "",
//   "Görsel 8": "",
//   "Sevkiyat Süresi": 1,
//   "Sevkiyat Tipi": "",
//   Renk: "",
//   Materyal: "",
//   Model: "",
//   "Cep Telefonu Modeli": "",
//   "Garanti Tipi": "",
//   "Garanti Süresi": "",
//   "Uyumlu Marka": "",
// };

// TODO: Remove unnecessary code and structure the files
