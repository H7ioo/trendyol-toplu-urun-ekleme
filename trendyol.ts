import {
  cleanUp,
  generateInformationLoop,
  registerPrompts,
  runNotion,
  showPrompt,
  writeToExcel,
} from "./helpers/utils";
import configFileData from "./config/config.json";

import {
  KDVT,
  caseBrandsT,
  caseMaterialsT,
  caseTypesT,
  categoryT,
  currencyT,
  guaranteePeriodsT,
  phonesT,
} from "./variables/variables";
import { ProductPromptType, TrendyolFields } from "./types/types";
import { promptQuestionsT } from "./variables/prompts";

registerPrompts();
(async () => {
  const result = (await showPrompt(
    promptQuestionsT({
      company: "trendyol",
      configFileData,
      caseBrands: caseBrandsT,
      caseMaterials: caseMaterialsT,
      caseTypes: caseTypesT,
      phonesList: phonesT,
      guaranteePeriods: guaranteePeriodsT,
    })
  )) as ProductPromptType;
  compile(result);
})();

// - Helpers

async function compile(props: ProductPromptType) {
  const {
    path,
    askToRunNotion,
    productCode,
    caseBrand,
    title,
    writtenPhonesList,
    phonesList,
    phonesCollections,
  } = props;

  const mergedPhonesList = [
    ...writtenPhonesList,
    ...phonesList,
    ...phonesCollections,
  ];
  const objectArray: TrendyolFields[] = [];
  generateInformationLoop({
    ...props,
    mergedPhonesList,
    category: categoryT,
    currency: currencyT,
    KDV: KDVT,
    objectArray: objectArray,
    mainList: phonesT,
  });

  try {
    // Write to excel file
    writeToExcel(
      objectArray,
      cleanUp(path, false).replace(/"/gi, ""),
      productCode,
      caseBrand,
      "trendyol"
    );

    if (askToRunNotion) await runNotion(title, objectArray);
  } catch (error) {
    console.log(error);
  }
}

// TODO: useCollections config.json
// TODO: Create without the list because most of redmi phone is not included or create secondary list and merge it but the merged list should not be included in the Telefon Modeli
// TODO: Merge phones in one list => iPhone 11: {hepsiburada: "iPhone 11", trendyol: "iphone 11"}
// TODO: Add second message to the config.json

// TODO: Colors Collection
// TODO: Check if Main Code exists
// TODO: use collection and all other phones methods. Some times you need to extend 1 phone. Just make sure that they are combined. Create typed collection for example {trendyolList: ["iPhone 11"], outOfTrendyolList: ["G1s 2001"]}
// TODO: writeToExcel Don't override props. Just append to them. (for now it works but not in the way that I want. It should not replace props it should append rows only.)

// TODO: Choice between Hepsiburada and Trendyol. Instead of exporting 2 variables, 1 for trendyol and another for hepsiburada we just have config file. If we choose hepsiburada it will get hepsiburada's variables. The problem is that it's not consistent. Hepsiburada has more variables, but we can just not use it.
// import * as variables from "./PATH_DEPENDING_ON_CHOICE"
// import {x} from "./PATH_DEPENDING_ON_CHOICE"
