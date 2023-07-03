import {
  cleanUp,
  convertToNumber,
  generateInformationLoop,
  registerPrompts,
  showPrompt,
  sleep,
  writeToExcel,
} from "./helpers/utils";
import configFileObject from "./config/config.json";

import { KDVT, categoryT, currencyT, phonesT } from "./variables/variables";
import { TrendyolFields, promptAnswersT } from "./types/types";
import { promptQuestionsT } from "./variables/prompts";
import {
  trendyolNotionCreateBarcode,
  trendyolNotionCreateModelCode,
  trendyolNotionCreateProduct,
} from "./lib/notion";

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
  } = props;

  const objectArray: TrendyolFields[] = [];
  generateInformationLoop({
    ...props,
    category: categoryT,
    currency: currencyT,
    KDV: KDVT,
    objectArray: objectArray,
    mainList: phonesT,
  });

  console.log(writtenPhonesList);

  try {
    // Write to excel file
    writeToExcel(
      objectArray,
      cleanUp(path, false).replace(/"/gi, ""),
      mainModalCode,
      caseBrand,
      "trendyol"
    );

    if (!askToRunNotion) return;
    // Create product (it's 1 product so it won't matter if it's the first product of the last one)
    const productId = await trendyolNotionCreateProduct({
      title: title,
      price: convertToNumber(
        objectArray[0]["Trendyol'da Satılacak Fiyat (KDV Dahil)"]
      ),
      piyasa: convertToNumber(
        objectArray[0]["Piyasa Satış Fiyatı (KDV Dahil)"]
      ),
      mainModalCode: objectArray[0]["Stok Kodu"],
      description: objectArray[0]["Ürün Açıklaması"],
    });

    const currentModelCode: {
      relation: string | null;
      modelCode: string | null;
    } = { relation: null, modelCode: null };
    // Loop over each object, If the model code is the same as the last one then don't create any, it it is not then create new model code
    // null !== "SB-11" => TruFe
    // "SB-11" !== "SB-11" => False
    // "SB-11" !== "SB-12" => True

    for (let index = 0; index < objectArray.length; index++) {
      const obj = objectArray[index];
      if (currentModelCode.modelCode !== obj["Model Kodu"]) {
        const modelId = await trendyolNotionCreateModelCode({
          modelCode: obj["Model Kodu"],
          relationId: productId,
        });
        await trendyolNotionCreateBarcode({
          barcode: obj["Barkod"],
          relationId: modelId,
        });
        currentModelCode.modelCode = obj["Model Kodu"];
        currentModelCode.relation = modelId;
      } else {
        await trendyolNotionCreateBarcode({
          barcode: obj["Barkod"],
          // This will definitely will not run on the first time
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          relationId: currentModelCode.relation!,
        });
      }
      await sleep(300);
    }
  } catch (error) {
    console.log(error);
  }
}

// TODO: Create without the list because most of redmi phone is not included or create secondary list and merge it but the merged list should not be included in the Telefon Modeli
// TODO: Merge phones in one list => iPhone 11: {hepsiburada: "iPhone 11", trendyol: "iphone 11"}
// TODO: Add second message to the config.json

// TODO: Add an option to create a new product or add to existing product
// - Query notion database => pass it to inq search list

// TODO: Check if Main Code exists
// TODO: Colors Collection
// TODO: use collection and all other phones methods. Some times you need to extend 1 phone. Just make sure that they are combined. Create typed collection for example {trendyolList: ["iPhone 11"], outOfTrendyolList: ["G1s 2001"]}
