import {
  compile,
  lengthValidator,
  registerPrompts,
  showPrompt,
} from "./helpers/utils";
import configFileData from "./config/config.json";

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
import { CompanyType, ProductPromptType } from "./types/types";
import { productPrompt } from "./variables/prompts";
import { prompt } from "inquirer";

registerPrompts();

const companySwitch = async (company: CompanyType) => {
  let result;
  switch (company) {
    case "trendyol":
      result = await showPrompt(
        productPrompt({
          company: "trendyol",
          configFileData,
          caseBrands: caseBrandsT,
          caseMaterials: caseMaterialsT,
          caseTypes: caseTypesT,
          phonesList: phonesT,
          guaranteePeriods: guaranteePeriodsT,
        })
      );
      break;
    case "hepsiburada":
      result = await showPrompt(
        productPrompt({
          company: "hepsiburada",
          configFileData,
          caseBrands: caseBrandsH,
          caseMaterials: caseMaterialsH,
          caseTypes: caseTypesH,
          phonesList: phonesH,
          colors: colorsH,
        })
      );
      break;
  }
  // TODO: After notion adding is done it's not exiting the console - I forget to put await. this might fix the problem
  await compile({ ...result, company } as ProductPromptType);
};

(async () => {
  const { company } = (await prompt([
    {
      type: "search-list",
      name: "company",
      message: "Şirket seçiniz",
      choices: companies,
      validate: lengthValidator,
      suffix: ":",
    },
  ])) as { company: CompanyType };

  await companySwitch(company);
})();

// TODO: useCollections config.json
// TODO: Create without the list because most of redmi phone is not included or create secondary list and merge it but the merged list should not be included in the Telefon Modeli
// TODO: Merge phones in one list => iPhone 11: {hepsiburada: "iPhone 11", trendyol: "iphone 11"}
// TODO: Add second message to the config.json

// TODO: Colors Collection
// TODO: Check if Main Code exists
// TODO: use collection and all other phones methods. Some times you need to extend 1 phone. Just make sure that they are combined. Create typed collection for example {trendyolList: ["iPhone 11"], outOfTrendyolList: ["G1s 2001"]}
// TODO: writeToExcel Don't override props. Just append to them. (for now it works but not in the way that I want. It should not replace props it should append rows only.)

// TODO: Hepsiburada convert number to string that is "159,90"
