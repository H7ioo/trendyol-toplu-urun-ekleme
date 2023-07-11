import {
  compile,
  lengthValidator,
  registerPrompts,
  showPrompt,
  sleep,
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
  guaranteePeriodsT,
  phonesH,
  phonesT,
} from "./variables/variables";
import {
  CompanyType,
  ConfigProductPromptType,
  HepsiburadaPromptType,
  MainProductPromptType,
  ProductPromptType,
  PromptQuestionFunctionProps,
  TrendyolPromptType,
} from "./types/types";
import { productPrompt } from "./variables/prompts";
import { prompt } from "inquirer";

registerPrompts();

const companySwitch = async (companies: CompanyType[]) => {
  // TODO: Move into separate file
  const companiesData = {
    trendyol: {
      company: "trendyol",
      caseBrands: caseBrandsT,
      caseMaterials: caseMaterialsT,
      caseTypes: caseTypesT,
      phonesList: phonesT,
      guaranteePeriods: guaranteePeriodsT,
    },
    hepsiburada: {
      company: "hepsiburada",
      caseBrands: caseBrandsH,
      caseMaterials: caseMaterialsH,
      caseTypes: caseTypesH,
      phonesList: phonesH,
      colors: colorsH,
    },
  };

  // TODO: Comment the code

  const data = companies.map((company) => {
    return companiesData[company] as PromptQuestionFunctionProps;
  });

  const { mainCollection, companyBasedCollections, configCollection } =
    productPrompt(data);

  // TODO: For some reason it's prompting twice, first prompt (Marka) When mainAnswers is not prompted it works fine
  const mainAnswers = (await showPrompt(
    mainCollection
  )) as MainProductPromptType;
  const companyAnswers = [] as (HepsiburadaPromptType | TrendyolPromptType)[];
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
    } as ProductPromptType);
  }
};

(async () => {
  const { companies: com } = (await prompt([
    {
      type: "search-checkbox",
      name: "companies",
      message: "Şirket seçiniz",
      choices: companies,
      validate: lengthValidator,
      suffix: ":",
    },
  ])) as { companies: CompanyType[] };

  await companySwitch(com);
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
