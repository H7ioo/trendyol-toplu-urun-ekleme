import fs from "fs";
import { QuestionCollection } from "inquirer";
import {
  capitalizeLetters,
  cleanUp,
  convertPath,
  convertToNumber,
  lengthValidator,
  numberValidator,
  pathRegex,
} from "../helpers/utils";
import { phonesT, phonesH } from "./variables";
import {
  ProductPromptType,
  PromptQuestionFunctionProps,
  phonesCollectionPromptType,
} from "../types/types";

import phonesCollectionData from "../config/phonesCollections.json";
import configFileData from "../config/config.json";

// Questions collection
export const productPrompt = (companies: PromptQuestionFunctionProps[]) => {
  // TODO: Found a solution for type safety

  const mainCollection: QuestionCollection = [
    {
      type: "input",
      name: "title",
      message: "Ürün adı yazınız",
      filter: (input: string) => {
        return capitalizeLetters(cleanUp(input));
      },
      validate: lengthValidator,
      suffix: ":",
    },
    {
      type: "input",
      name: "phoneBrand",
      message: "Telefonun bilinen adı yazınız",
      filter: (input: string) => {
        return cleanUp(input, false);
      },
      validate: lengthValidator,
      suffix: ":",
    },
    {
      type: "input",
      name: "productCode",
      message: "Ana model kodu yazınız",
      filter: (input: string) => {
        return cleanUp(input).toUpperCase();
      },
      validate: lengthValidator,
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
      validate: lengthValidator,
      suffix: ":",
    },
  ];
  const companyBasedCollections: QuestionCollection[] = [];
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
  for (let index = 0; index < companies.length; index++) {
    const companyData = companies[index];
    const { caseBrands, caseMaterials, caseTypes, company, phonesList } =
      companyData;
    const questionCollection: QuestionCollection = [
      {
        type: "input",
        name: "trademark",
        message: "Marka adı yazınız",
        // validate: lengthValidator,
        suffix: ` (${companyData.company}):`,
      },
      {
        type: "search-checkbox",
        name: "phonesCollections",
        message: "Telefon koleksiyonu seçiniz",
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
        suffix: ` (${companyData.company}):`,
      },
      {
        type: "search-checkbox",
        name: "phonesList",
        message: "Telefon modelleri seçiniz",
        choices: phonesList,
        validate: (input: string[]) => {
          console.log(`Count: ${input.length}`);
          return true;
        },
        suffix: ` (${companyData.company}):`,
      },
      {
        // TODO: Can't trim empty string
        type: "input",
        name: "writtenPhonesList",
        message: "Telefon modelleri yazınız (aralarında virgül koyarak)",
        filter: (input: string) => {
          if (!lengthValidator(input)) return [];
          return cleanUp(input)
            .split(",")
            .map((phone) => {
              // return removeWhiteSpaces(capitalizeLetters(colorAnswer));
              return capitalizeLetters(phone);
            });
        },
        validate: (input: string, answers: ProductPromptType) => {
          if (
            lengthValidator(answers?.phonesList) ||
            // Because it might not exist
            lengthValidator(answers?.phonesCollections ?? [])
          )
            return true;
          return lengthValidator(input)
            ? true
            : "En az 1 telefon modeli yazılmalı ya da seçilmeli.";
        },
        suffix: ` (${companyData.company}):`,
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
        validate: lengthValidator,
        suffix: ` (${companyData.company}):`,
        when: company === "trendyol",
      },

      {
        type: "search-checkbox",
        name: "colors",
        message: "Renkleri seçiniz",
        choices: company === "hepsiburada" ? companyData.colors : [],
        validate: lengthValidator,
        suffix: ` (${companyData.company}):`,
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
        suffix: ` (${companyData.company}):`,
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
        suffix: ` (${companyData.company}):`,
        when: company === "trendyol",
      },
      {
        type: "search-list",
        name: "caseMaterial",
        message: "Materyal seçiniz",
        choices: caseMaterials,
        suffix: ` (${companyData.company}):`,
      },
      {
        type: "search-list",
        name: "caseType",
        message: "Kılıf modeli seçiniz",
        choices: caseTypes,
        suffix: ` (${companyData.company}):`,
      },
      {
        type: "search-list",
        name: "guaranteePeriod",
        message: "Garanti süresi seçiniz",
        choices: company === "trendyol" ? companyData.guaranteePeriods : [],
        suffix: ` (${companyData.company}):`,
        when: company === "trendyol",
      },
      {
        type: "search-list",
        name: "caseBrand",
        message: "Uyumlu marka seçiniz",
        choices: caseBrands,
        suffix: ` (${companyData.company}):`,
      },
    ];
    companyBasedCollections.push(questionCollection);
  }

  return [mainCollection, companyBasedCollections, configCollection] as const;
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
