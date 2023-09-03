import {
  compile,
  lengthValidator,
  registerPrompts,
  showPrompt,
} from "./helpers/utils";

import {
  caseBrandsH,
  caseBrandsT,
  caseMaterialsH,
  caseMaterialsT,
  caseTypesH,
  caseTypesT,
  colorsH,
  companies,
  earPhonesAccessoryTypesH,
  earPhonesBrandsT,
  earPhonesGuaranteePeriodsT,
  earPhonesT,
  guaranteePeriodsT,
  myEarPhones,
  myWatchList,
  phonesH,
  phonesHExtends,
  phonesT,
  phonesTExtends,
  productTypes,
  watchBrandsH,
  watchBrandsT,
  watchMaterialT,
} from "./variables/variables";
import type {
  CompanyType,
  ConfigProductPromptType,
  HepsiburadaPromptType,
  HepsiburadaWatchPromptType,
  MainProductPromptType,
  ProductPromptType,
  ProductTypes,
  PromptQuestionFunctionProps,
  TrendyolPromptType,
  TrendyolWatchPromptType,
} from "./types/types";
import { productPrompt } from "./variables/prompts";
import { prompt } from "inquirer";

registerPrompts();

const companySwitch = async ({
  companies,
  productType,
}: {
  companies: CompanyType[];
  productType: ProductTypes;
}) => {
  // TODO: Move into separate file
  const caseCompaniesData = {
    trendyol: {
      company: "trendyol",
      productType: "kılıf",
      caseBrands: caseBrandsT,
      caseMaterials: caseMaterialsT,
      caseTypes: caseTypesT,
      phonesList: [...phonesT, ...phonesTExtends],
      guaranteePeriods: guaranteePeriodsT,
    },
    hepsiburada: {
      company: "hepsiburada",
      productType: "kılıf",
      caseBrands: caseBrandsH,
      caseMaterials: caseMaterialsH,
      caseTypes: caseTypesH,
      phonesList: [...phonesH, ...phonesHExtends],
      colors: colorsH,
    },
  };

  const watchCompaniesData = {
    trendyol: {
      company: "trendyol",
      productType: "kordon",
      watchMaterial: watchMaterialT,
      watchList: myWatchList,
      guaranteePeriods: guaranteePeriodsT,
      watchBrands: watchBrandsT,
    },
    hepsiburada: {
      company: "hepsiburada",
      productType: "kordon",
      watchBrands: watchBrandsH,
      watchList: myWatchList,
      colors: colorsH,
    },
  };

  const earPhonesCompaniesData = {
    trendyol: {
      company: "trendyol",
      productType: "kulaklık",
      guaranteePeriods: earPhonesGuaranteePeriodsT,
      earPhonesBrands: earPhonesBrandsT,
      earPhonesList: earPhonesT,
    },
    hepsiburada: {
      company: "hepsiburada",
      productType: "kulaklık",
      earPhonesAccessoryTypes: earPhonesAccessoryTypesH,
      colors: colorsH,
      earPhonesList: myEarPhones,
    },
  };

  const charmCompaniesData = {
    trendyol: {
      company: "trendyol",
      productType: "charm",
      watchMaterial: watchMaterialT,
      guaranteePeriods: guaranteePeriodsT,
      watchBrands: watchBrandsT,
    },
    hepsiburada: {
      company: "hepsiburada",
      productType: "charm",
      watchBrands: watchBrandsH,
      colors: colorsH,
    },
  };

  // TODO: Comment the code

  const data = companies.map((company) => {
    if (productType === "kılıf") {
      return caseCompaniesData[company] as PromptQuestionFunctionProps;
    } else if (productType === "kordon") {
      return watchCompaniesData[company] as PromptQuestionFunctionProps;
    } else if (productType === "kulaklık") {
      return earPhonesCompaniesData[company] as PromptQuestionFunctionProps;
    } else if (productType === "charm") {
      return charmCompaniesData[company] as PromptQuestionFunctionProps;
    }
    throw new Error("Something went wrong! Product type was wrong.");
  });

  const { mainCollection, companyBasedCollections, configCollection } =
    productPrompt(data);

  // TODO: For some reason it's prompting twice, first prompt (Marka) When mainAnswers is not prompted it works fine
  const mainAnswers = (await showPrompt(
    mainCollection
  )) as MainProductPromptType;
  const companyAnswers = [] as (
    | (HepsiburadaPromptType | TrendyolPromptType)
    | (HepsiburadaWatchPromptType | TrendyolWatchPromptType)
  )[];
  for (let index = 0; index < companyBasedCollections.length; index++) {
    const company = companyBasedCollections[index];
    const companyAnswer = (await showPrompt(company)) as
      | HepsiburadaPromptType
      | TrendyolPromptType;
    companyAnswers.push(companyAnswer);
  }
  const configAnswers = (await showPrompt(
    configCollection
  )) as ConfigProductPromptType;
  for (let index = 0; index < companyAnswers.length; index++) {
    const obj = companyAnswers[index];
    await compile({
      ...mainAnswers,
      ...obj,
      ...configAnswers,
      company: companies[index],
      productType,
    } as ProductPromptType);
  }
};

(async () => {
  const result = (await prompt([
    {
      type: "search-checkbox",
      name: "companies",
      message: "Şirket seçiniz",
      choices: companies,
      validate: lengthValidator,
      suffix: ":",
    },
    {
      type: "search-list",
      name: "productType",
      message: "Ürün türü seçiniz",
      choices: productTypes,
      validate: lengthValidator,
      suffix: ":",
    },
  ])) as { companies: CompanyType[]; productType: ProductTypes };

  await companySwitch(result);
  // Quit
  process.exit(0);
})();

// TODO: useCollections config.json
// TODO: Create without the list because most of redmi phone is not included or create secondary list and merge it but the merged list should not be included in the Telefon Modeli
// TODO: Merge phones in one list => iPhone 11: {hepsiburada: "iPhone 11", trendyol: "iphone 11"}
// TODO: Add second message to the config.json

// TODO: Colors Collection
// TODO: Check if Main Code exists
// TODO: use collection and all other phones methods. Some times you need to extend 1 phone. Just make sure that they are combined. Create typed collection for example {trendyolList: ["iPhone 11"], outOfTrendyolList: ["G1s 2001"]}
// TODO: writeToExcel Don't override props. Just append to them. (for now it works but not in the way that I want. It should not replace props it should append rows only.)

// TODO: Check if main code exists in notion

// TODO: Search-checkbox validate in a way you can't write spaces // It's not possible. I need to register a new prompt
// readline.emitKeypressEvents(process.stdin);

// if (process.stdin.isTTY) process.stdin.setRawMode(true);

// process.stdin.on("keypress", (chunk, key) => {
//   console.log(key);
// });
