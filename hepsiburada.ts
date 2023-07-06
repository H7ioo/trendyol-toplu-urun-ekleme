import { compile, registerPrompts, showPrompt } from "./helpers/utils";
import {
  caseBrandsH,
  caseMaterialsH,
  caseTypesH,
  colorsH,
  phonesH,
} from "./variables/variables";
import { productPrompt } from "./variables/prompts";
import {} from "./lib/notion";
import configFileData from "./config/config.json";
import { ProductPromptType } from "./types/types";

registerPrompts();
(async () => {
  const result = (await showPrompt(
    productPrompt({
      company: "hepsiburada",
      configFileData,
      caseBrands: caseBrandsH,
      caseMaterials: caseMaterialsH,
      caseTypes: caseTypesH,
      phonesList: phonesH,
      colors: colorsH,
    })
  )) as ProductPromptType;
  compile(result);
})();
