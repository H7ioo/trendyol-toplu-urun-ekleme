import { QuestionCollection, prompt, registerPrompt } from "inquirer";
import {
  capitalizeLetters,
  cleanUp,
  digitGen,
  lengthValidator,
  numberValidator,
  removeWhiteSpaces,
} from "./helpers/utils";
// import * as fs from "fs";
import * as XLSX from "xlsx";
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
} from "./variables/variables";
import { promptAnswersH } from "./types/types";
// import * as ExcelJS from "exceljs";

// eslint-disable-next-line @typescript-eslint/no-var-requires
registerPrompt("search-list", require("inquirer-search-list"));
// eslint-disable-next-line @typescript-eslint/no-var-requires
registerPrompt("search-checkbox", require("inquirer-search-checkbox"));

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
  {
    type: "search-checkbox",
    name: "phonesList",
    message: "Telefon modelleri seçiniz",
    choices: phonesH,
    validate: lengthValidator,
    suffix: ":",
  },
  // {
  //   type: "search-checkbox",
  //   name: "phoneBrandCrap",
  //   message: "phoneBrandCrap seçiniz",
  //   choices: crap,
  //   suffix: ":",
  // },
  {
    type: "input",
    name: "options",
    message: "Seçenekler yazınız (aralarında virgül koyarak)",
    filter: (input) => {
      return cleanUp(input)
        .split(",")
        .map((option) => {
          // return removeWhiteSpaces(upperLetters(phoneAnswer));
          return capitalizeLetters(option);
        });
    },
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
    type: "search-checkbox",
    name: "colors",
    message: "Renkleri seçiniz",
    choices: colorsH,
    validate: lengthValidator,
    suffix: ":",
  },
  {
    type: "input",
    name: "price",
    message: "Satış fiyatı yazınız",
    validate: numberValidator,
    suffix: ":",
  },
  {
    type: "input",
    name: "stockAmount",
    message: "Stock adedi yazınız",
    validate: numberValidator,
    suffix: ":",
  },
  {
    type: "input",
    name: "productDescription",
    message: "Ürün açıklaması yazınız",
    validate: lengthValidator,
    suffix: ":",
  },
  {
    type: "search-list",
    name: "material",
    message: "Materyal seçiniz",
    choices: materialsH,
    suffix: ":",
  },
  {
    type: "search-list",
    name: "caseType",
    message: "Kılıf modeli seçiniz",
    choices: casesTypesH,
    suffix: ":",
  },
  {
    type: "search-list",
    name: "caseBrand",
    message: "Uyumlu marka seçiniz",
    choices: caseBrandsH,
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
  const result = res as promptAnswersH;
  compile(result);
}
main();

function compile({
  brand,
  caseBrand,
  caseType,
  colors,
  productDescription,
  mainModalCode,
  material,
  phoneType,
  phonesList,
  price,
  stockAmount,
  title,
  path,
  options,
}: // phoneBrandCrap,
promptAnswersH) {
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
      // Example: SuarSB-11Pro-Sari-691
      const barcode = `${capitalizeLetters(
        brand ?? ""
      )}${productModal}-${removeWhiteSpaces(color)}-${randomDigits}`;

      // Example: SB-11Pro-Siyah
      const iHateHepsiburada = `${productModal}-${removeWhiteSpaces(color)}`;

      for (let x = 0; x < options.length; x++) {
        const option = options[x];
        // Fields
        const fields = {
          "Ürün Adı": productTitle,
          "Satıcı Stok Kodu": iHateHepsiburada.toUpperCase(), // Cause HEPSIBURADA SUCKS
          Barkod: barcode,
          "Varyant Grup Id": productModal,
          "Ürün Açıklaması": productDescription,
          Marka: brand ?? "",
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
          "Malzeme Türü": material,
          "Garanti Tipi2": "",
          "Kılıf Tipi": caseType,
        };

        // Push to the array
        res.push(fields);
      }
    }
  }
  writeToExcel(res, cleanUp(path, false).replace(/"/gi, ""), mainModalCode);
}

function replaceTurkishI(text: string) {
  return text.replace(/i̇/gi, "i").replace(/İ/gi, "I");
}

function writeToExcel(
  resultArray: object[],
  path: string,
  mainModalCode: string
) {
  const sheetName = "Kılıflar";
  // Read the file into memory
  const workbook = XLSX.readFile("./xlsx/hepsiburada.xlsx");

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
  XLSX.writeFile(newBook, `${path}\\${mainModalCode}-hepsiburada.xlsx`);

  // [
  //   'Ürünlerinizi Burada Listeleyin',
  //   'Urun_Ozellik_Bilgileri',
  //   'Yardım'
  // ]
}

// I hate both of Trendyol and Hepsiburada but Hepsiburada takes the throne
