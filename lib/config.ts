// ############ Imports
import { Question, prompt } from "inquirer";
import {
  cleanUp,
  lengthValidator,
  pathRegex,
  writeToJSON,
} from "../helpers/utils";
import configFileObject from "../config/config.json";
import { ConfigFileKeys } from "../types/types";

(async () => {
  // Prompt Array
  const configPromptArray: Question[] = [];

  await Promise.all(
    // Loop over the config file
    Object.keys(configFileObject).map((_) => {
      const key = _ as ConfigFileKeys;
      const value = configFileObject[key];

      // Validate function
      const validateConfig: Question["validate"] = (input) => {
        // If the input is null continue
        if (input === null) return true;
        switch (key) {
          // Check if the path matches the regex
          case "path":
            return pathRegex.test(input);

          default:
            break;
        }
        // Continue
        return true;
      };

      // Filter function
      const filterConfig: Question["filter"] = (_) => {
        // trim up extra spaces
        const input = cleanUp(_);
        // Check the length of the input
        if (lengthValidator(input)) {
          // If null is written set the value to null
          if (input.toLowerCase() === "null") return null;
          switch (key) {
            // Remove "" if found
            case "path":
              return input.replace(/"/gi, "");
            default:
              break;
          }

          return input;
        }
        // Return the settings in the file
        return configFileObject[key].value;
      };

      // Push a question to the array
      configPromptArray.push({
        type: "number",
        name: key,
        message: value.message,
        // suffix: " (Atlamak için Enter tuşunu basınız.)",
        validate: validateConfig,
        filter: filterConfig,
      });
    })
  );

  const response = await prompt(configPromptArray);
  console.log(response);
  Object.keys(response).map((_) => {
    const key = _ as ConfigFileKeys;
    configFileObject[key].value = response[key];
  });
  writeToJSON(configFileObject, "../config/config.json");
})();
