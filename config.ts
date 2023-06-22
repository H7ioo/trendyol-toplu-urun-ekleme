// ############ Imports
import { Question, prompt } from "inquirer";
import { lengthValidator } from "./helpers/utils";
import configFileObject from "./config.json";
import { ConfigFileKeys } from "./types/types";

(async () => {
  const configPromptArray: Question[] = [];
  // .replace(/"/gi, "")
  const pathRegex = new RegExp(/^[a-zA-Z]:\\(\w+\\)*\w*$/, "i");

  await Promise.all(
    Object.keys(configFileObject).map((_) => {
      const key = _ as ConfigFileKeys;
      const value = configFileObject[key];
      configPromptArray.push({
        type: "input",
        name: key,
        message: value.message,
        suffix: " (Atlamak için Enter tuşunu basınız.)",
        validate: (input: string | null) => {
          if (input === null) return true;
          switch (key) {
            case "path":
              return pathRegex.test(input);

            default:
              break;
          }
          return true;
        },
        filter: (input) => {
          if (lengthValidator(input)) {
            switch (key) {
              case "path":
                return input.replace(/"/gi, "");
              default:
                break;
            }

            return input;
          }
          return null;
        },
      });
    })
  );

  const response = await prompt(configPromptArray);
  console.log(response);
})();
