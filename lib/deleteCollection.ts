// TODO: Command system like discord files structure etc. loop over files and add the commands and it's just cli with -h and -c [command name]

import { registerPrompts, showPrompt, writeToJSON } from "../helpers/utils";
import { deleteCollectionPrompt } from "../variables/prompts";
import phonesCollectionData from "../config/phonesCollections.json";
import { phonesCollectionPromptType } from "../types/types";

registerPrompts();
(async () => {
  if (phonesCollectionData.phonesCollections.length <= 0)
    return console.error("Koleksiyon bulunmamaktadır!");
  const result = (await showPrompt(deleteCollectionPrompt)) as {
    phonesCollections: string[];
  };

  const newArray: phonesCollectionPromptType[] = [];

  for (let i = 0; i < phonesCollectionData.phonesCollections.length; i++) {
    const collection = phonesCollectionData.phonesCollections[
      i
    ] as phonesCollectionPromptType;
    if (result.phonesCollections.includes(collection.collectionName)) continue;
    newArray.push(collection);
  }

  writeToJSON(
    { phonesCollections: newArray },
    "./config/phonesCollections.json"
  );
})();
