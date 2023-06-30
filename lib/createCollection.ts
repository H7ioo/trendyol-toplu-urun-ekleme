import { registerPrompts, showPrompt, writeToJSON } from "../helpers/utils";
import { phonesCollectionPromptType } from "../types/types";
import { createCollectionPrompt } from "../variables/prompts";
import phonesCollectionData from "../config/phonesCollections.json";

registerPrompts();
(async () => {
  const result = (await showPrompt(
    createCollectionPrompt
  )) as phonesCollectionPromptType;

  // Loop over the phones if the name is the same override it
  let addNewObject = true;
  const array = phonesCollectionData.phonesCollections.map((collection) => {
    const c = collection as phonesCollectionPromptType;
    if (c.collectionName === result.collectionName) {
      addNewObject = false;
      return {
        collectionName: result.collectionName,
        phonesCollection: result.phonesCollection,
        company: result.company,
      };
    }
    return collection;
  });
  const obj = {
    phonesCollections: [...array],
  };
  // If we didn't override then add it to the array
  if (addNewObject)
    obj.phonesCollections.push({
      collectionName: result.collectionName,
      phonesCollection: result.phonesCollection,
      company: result.company,
    });
  writeToJSON(obj, "./config/phonesCollections.json");
})();
