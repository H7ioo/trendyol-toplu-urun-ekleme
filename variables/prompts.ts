import fs from "fs";
import { QuestionCollection } from "inquirer";
import {
  capitalizeLetters,
  cleanUp,
  convertPath,
  convertToNumber,
  generateCompanyBasedCollections,
  lengthValidator,
  numberValidator,
  pathRegex,
} from "../helpers/utils";
import {
  CompanyType,
  PromptQuestionFunctionProps,
  phonesCollectionPromptType,
} from "../types/types";
import { phonesH, phonesT } from "./variables";

import configFileData from "../config/config.json";
import phonesCollectionData from "../config/phonesCollections.json";
import { NotionProductCodeExists } from "../lib/notion";

// Questions collection
export const productPrompt = (companies: PromptQuestionFunctionProps[]) => {
  // TODO: Found a solution for type safety
  type ProductCodeExistFlagType = {
    [key in CompanyType]: { flag: boolean };
  };

  // TODO: Better way so I don't have to write them one by one
  const productCodeExistsFlag: ProductCodeExistFlagType = {
    trendyol: {
      flag: true,
    },
    hepsiburada: {
      flag: true,
    },
  };
  const mainCollection: QuestionCollection = [
    {
      type: "input",
      name: "title",
      message: "Ürün adı yazınız",
      filter: (input: string) => {
        return capitalizeLetters(cleanUp(input));
      },
      validate: (input) => lengthValidator(input, true),
      suffix: ":",
    },
    {
      type: "input",
      name: "productBrand",
      message: "Markanın bilinen adı yazınız",
      filter: (input: string) => {
        if (companies[0].productType === "kordon" && !lengthValidator(input))
          return "";
        return cleanUp(input, false);
      },
      validate: (input) => {
        if (companies[0].productType === "kordon") return true;
        return lengthValidator(input, true);
      },
      suffix: ":",
    },
    {
      type: "input",
      name: "productCode",
      message: "Ana model kodu yazınız",
      filter: (input: string) => {
        return cleanUp(input).toUpperCase();
      },
      validate: async (input) => {
        // Loop over companies
        for (let i = 0; i < companies.length; i++) {
          const company = companies[i];
          console.log("\nKontrol ediliyor...");
          // Check if the product code exists
          let productCodeExists;
          if (productCodeExistsFlag[company.company].flag) {
            productCodeExists = await NotionProductCodeExists(
              input,
              company.company
            );
          }

          // Check the flag and product code
          // TODO: Add to the product code don't create new one
          // TODO: Create a new one with the same product code
          // TODO: Get the count of the results (how many product with the same product code)
          // TODO: Add an option to create a new product or add to existing product
          // - Query notion database => pass it to inq search list

          if (
            productCodeExistsFlag[company.company].flag &&
            productCodeExists
          ) {
            productCodeExistsFlag[company.company].flag = false;
            return `Model kodu ${company.company}'da mevcut! Devam etmek için Enter tuşu basınız.`;
          }
        }
        return lengthValidator(input, true);
      },
      suffix: ":",
    },
    {
      type: "input",
      name: "price",
      message: "Satış fiyatı yazınız (.)",
      validate: numberValidator,
      filter: (input: string) => {
        if (numberValidator(input, false)) {
          return convertToNumber(input);
        } else {
          return input;
        }
      },
      suffix: ":",
    },
    {
      type: "input",
      name: "stockAmount",
      message: "Stock adedi yazınız",
      validate: numberValidator,
      filter: (input) => {
        if (numberValidator(input, false)) {
          return convertToNumber(input);
        } else {
          return input;
        }
      },
      suffix: ":",
    },
    {
      type: "input",
      name: "productDescription",
      message: "Ürün açıklaması yazınız",
      validate: (input) => lengthValidator(input, true),
      suffix: ":",
    },
  ];
  const configCollection: QuestionCollection = [
    {
      type: "input",
      name: configFileData.path.name,
      message: configFileData.path.message,
      validate: (input) => {
        // Check for the length
        if (lengthValidator(input)) {
          // if it matches the regex continue
          if (pathRegex.test(input) && fs.existsSync(input)) {
            return true;
          } else {
            // Convert the path and try again
            return (
              pathRegex.test(convertPath(input)) &&
              fs.existsSync(convertPath(input))
            );
          }
        }
        return false;
      },
      suffix: ":",
      default: configFileData.path.value ?? undefined,
    },
    {
      type: "confirm",
      name: configFileData.askToRunNotion.name,
      message: configFileData.askToRunNotion.message,
      validate: lengthValidator,
      suffix: ":",
      when: configFileData.askToRunNotion.value ?? true,
      default: true,
    },
  ];
  const companyBasedCollections = generateCompanyBasedCollections(companies);
  return { mainCollection, companyBasedCollections, configCollection };
};

// Questions collection

let createCollectionNameFlag = false;
export const createCollectionPrompt: QuestionCollection = [
  {
    type: "list",
    name: "company",
    message: "Şirket seçiniz",
    choices: ["trendyol", "hepsiburada"],
    suffix: ":",
  },
  {
    type: "search-checkbox",
    name: "phonesCollection",
    message: "Telefon modelleri seçiniz",
    choices: (answers) => {
      const company: phonesCollectionPromptType["company"] = answers.company;
      if (company === "hepsiburada") return phonesH;
      if (company === "trendyol") return phonesT;
    },
    validate: lengthValidator,
    suffix: ":",
  },
  {
    type: "input",
    name: "collectionName",
    message: "Koleksiyon adı yazınız",
    validate: (input) => {
      // Check for the length
      if (lengthValidator(input)) {
        // If there is a similar names throw a warning
        const foundSimilarName = phonesCollectionData.phonesCollections.some(
          (collection) => {
            const c = collection as phonesCollectionPromptType;
            // Set the flag to true if the user wants to override the existing fields
            if (c.collectionName === input) return true;
          }
        );
        // If the flag is true then override
        if (createCollectionNameFlag === true) return true;
        if (!foundSimilarName) {
          return true;
        } else {
          createCollectionNameFlag = true;
          return "Koleksiyon adı mevcut, farklı bir adı yazınız. Koleksiyonu değiştirmek için Enter basınız.";
        }
      }
      return false;
    },
    suffix: ":",
  },
];

// TODO: Might have an error. Prefer to use another way from the TrendyolPrompt up there
export const deleteCollectionPrompt: QuestionCollection = [
  {
    type: "search-checkbox",
    name: "phonesCollections",
    message: "Silmek istediğiniz koleksiyonları işaretleyiniz",
    // Map over the collections and display them
    choices: phonesCollectionData.phonesCollections.map((collection) => {
      const c = collection as phonesCollectionPromptType;
      return `${c.collectionName} => ${JSON.stringify(c.phonesCollection)}`;
    }),
    validate: lengthValidator,
    // Filter the result to get only the name of the collection
    filter: (input) => {
      if (input.length) {
        return input
          .toString()
          .split(", ")
          .map((value: string) => value.split(" =>")[0].trim());
      } else {
        return "";
      }
    },
    suffix: ":",
  },
];
