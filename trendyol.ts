import {
  cleanUp,
  generateInformationLoop,
  registerPrompts,
  runNotion,
  showPrompt,
  writeToExcel,
} from "./helpers/utils";
import configFileObject from "./config/config.json";

import { KDVT, categoryT, currencyT, phonesT } from "./variables/variables";
import { TrendyolFields, promptAnswersT } from "./types/types";
import { promptQuestionsT } from "./variables/prompts";

registerPrompts();
(async () => {
  const result = (await showPrompt(
    promptQuestionsT(configFileObject)
  )) as promptAnswersT;
  compile(result);
})();

// - Helpers

async function compile(props: promptAnswersT) {
  const {
    path,
    askToRunNotion,
    mainModalCode,
    caseBrand,
    title,
    writtenPhonesList,
    phonesList,
    phonesCollection,
  } = props;

  const mergedPhonesList = [
    ...writtenPhonesList,
    ...phonesList,
    ...phonesCollection,
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
      mainModalCode,
      caseBrand,
      "trendyol"
    );

    if (askToRunNotion) await runNotion(title, objectArray);
  } catch (error) {
    console.log(error);
  }
}

// TODO: Create without the list because most of redmi phone is not included or create secondary list and merge it but the merged list should not be included in the Telefon Modeli
// TODO: Merge phones in one list => iPhone 11: {hepsiburada: "iPhone 11", trendyol: "iphone 11"}
// TODO: Add second message to the config.json

// TODO: Colors Collection
// TODO: Check if Main Code exists
// TODO: use collection and all other phones methods. Some times you need to extend 1 phone. Just make sure that they are combined. Create typed collection for example {trendyolList: ["iPhone 11"], outOfTrendyolList: ["G1s 2001"]}
