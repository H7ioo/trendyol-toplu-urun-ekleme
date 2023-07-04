import fs from "fs";
import { QuestionCollection } from "inquirer";
import {
  capitalizeLetters,
  cleanUp,
  convertPath,
  lengthValidator,
  numberValidator,
  pathRegex,
} from "../helpers/utils";
import {
  phonesT,
  materialsT,
  casesTypesT,
  guaranteesPeriodT,
  caseBrandsT,
  phonesH,
  colorsH,
  materialsH,
  casesTypesH,
  caseBrandsH,
} from "./variables";
import {
  ConfigFileObjectType,
  phonesCollectionPromptType,
} from "../types/types";

import phonesCollectionData from "../config/phonesCollections.json";

// Questions collection
export const promptQuestionsT = (data: ConfigFileObjectType) => {
  const company = "trendyol";
  const promptCollection: QuestionCollection = [
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
      name: "phoneBrand",
      message: "Telefonun bilinen adı yazınız",
      filter: (input) => {
        return cleanUp(input, false);
      },
      validate: lengthValidator,
      suffix: ":",
    },

    {
      type: "search-checkbox",
      name: "phonesCollection",
      message: "Telefon koleksiyonu seçiniz",
      choices: () => {
        // Get only t his company array (trendyol)
        const onlyComponyArray = phonesCollectionData.phonesCollections.filter(
          (collection) => {
            const c = collection as phonesCollectionPromptType;
            return c.company === company;
          }
        );
        // Get all collection names and show an array with it
        const collectionNames = onlyComponyArray.map((collection) => {
          const c = collection as phonesCollectionPromptType;
          return `${c.collectionName} => ${JSON.stringify(c.phonesCollection)}`;
        });
        return collectionNames;
      },
      filter: (input: string[]) => {
        if (lengthValidator(input)) {
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
        } else {
          return [];
        }
      },
      suffix: ":",
    },
    {
      type: "search-checkbox",
      name: "phonesList",
      message: "Telefon modelleri seçiniz",
      choices: phonesT,
      validate: (input) => {
        console.log(`Count: ${input.length}`);
        return true;
      },
      suffix: ":",
    },
    {
      type: "input",
      name: "writtenPhonesList",
      message: "Telefon modelleri yazınız (aralarında virgül koyarak)",
      filter: (input) => {
        return cleanUp(input)
          .split(",")
          .map((phone) => {
            // return removeWhiteSpaces(capitalizeLetters(colorAnswer));
            return capitalizeLetters(phone);
          });
      },
      validate: (input, answers) => {
        if (lengthValidator(answers?.phonesList)) return true;
        return lengthValidator(input)
          ? true
          : "En az 1 telefon modeli yazılmalı ya da seçilmeli.";
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
      name: "companyBrand",
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
      message: "Trendyol satış fiyatı yazınız (.)",
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
      name: "caseMaterial",
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
      name: data.path.name,
      message: data.path.message,
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
      default: data.path.value ?? undefined,
    },
    {
      type: "confirm",
      name: data.askToRunNotion.name,
      message: data.askToRunNotion.message,
      validate: lengthValidator,
      suffix: ":",
      when: data.askToRunNotion.value ?? true,
      default: true,
    },
  ];

  return promptCollection;
};

// Questions collection

export const promptQuestionsH: QuestionCollection = [
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
    message: "Satış fiyatı yazınız (,)",
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

// TODO: Global it
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

// TODO: Replace telefonun bilen adi with the brand itself on the end of the prompt (*)
// TODO: Undefined material
