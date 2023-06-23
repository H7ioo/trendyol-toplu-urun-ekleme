import {
  ListQuestion,
  Question,
  QuestionAnswer,
  QuestionCollection,
  QuestionMap,
} from "inquirer";
import {
  capitalizeLetters,
  cleanUp,
  lengthValidator,
  numberValidator,
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
import { ConfigFileObjectType } from "../types/types";

// Questions collection
export const promptQuestionsT = (data: ConfigFileObjectType) => {
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
      message: "Path",
      validate: lengthValidator,
      suffix: ":",
      default: data.path.value ?? undefined,
    },
  ];

  // const modifiedPrompt: Question[] = [...(promptCollection as [])];

  // // TODO: Check

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
