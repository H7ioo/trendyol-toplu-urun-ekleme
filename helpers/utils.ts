import fs from "fs";

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// - Helpers

/**
 * Trims extra whitespace and lowercases the text
 * @param text The text.
 * @param lowerCase Option to lowerCase the text. Defaults to true.
 * @returns Cleared up text.
 * @example cleanUp("   Text HERE ")
 */

export function cleanUp(text: string, lowerCase = true) {
  const res = text.trim().replace(/\s+/g, " ");
  return lowerCase ? res.toLowerCase() : res;
}

/**
 * Trims extra whitespace, split it and uppercase first letter then it joins to create a string.
 *
 * @param text The text.
 * @returns Capitalized text.
 */
export function capitalizeLetters(text: string) {
  return text
    .toLowerCase()
    .trim()
    .split(" ")
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(" ");
}

/**
 * Removes all whitespace.
 *
 * @param text The text.
 * @returns Text without any whitespace.
 */
export function removeWhiteSpaces(text: string) {
  return text.replace(/\s/g, "");
}

/**
 * Generates random number.
 * @param length The length of the generated number.
 * @returns Random set of numbers.
 */
export function digitGen(length: number) {
  let digit = "";
  for (let index = 0; index < length; index++) {
    digit += Math.round(Math.random() * 9);
  }
  return digit;
}
/**
 * It validates the string or the array. It checks if the length is bigger than zero. Since split returns [''], we need to check multiple times for the Array
 * @param text The text.
 * @returns true if the string is longer than zero
 */
export function lengthValidator(text: string | string[]) {
  if (Array.isArray(text))
    return text.length > 0 && text[0].length > 0 ? true : false;
  if (text.trim().length <= 0) return false;
  return true;
}

export function numberValidator(value: string) {
  return !isNaN(parseInt(value)) && lengthValidator(value);
}

export function convertToNumber(value: string, float = true) {
  const v = value.replace(/,/gi, ".");
  if (float) return parseFloat(v);
  return parseInt(v);
}

// I didn't bother, it's from ChatGPT
// TODO: add it to inqurier
export function convertPath(path: string) {
  // Remove extra slashes and replace them with a single slash
  const cleanedPath = path.replace(/\/+/g, "/");

  // Split the path into individual segments
  const segments = cleanedPath.split("/");

  // Remove empty segments
  const filteredSegments = segments.filter((segment) => segment !== "");

  // Join the segments with double backslashes
  const convertedPath = filteredSegments.join("\\");

  // Add the drive letter and trailing backslash
  return (
    convertedPath.charAt(0).toUpperCase() +
    ":" +
    "\\" +
    convertedPath.slice(1) +
    "\\"
  );
}

export const writeToJSONConfig = (objStringify: string) => {
  // ! The path is dependent on where is the function called from. Remove the ./ if you want to make it accessible from everywhere
  fs.writeFile("../config/config.json", objStringify, "utf8", (err) => {
    if (err) {
      console.log(err);
    }
  });
  JSON.stringify;
};

export const pathRegex = new RegExp(/^[a-zA-Z]:\\(\w+\\)*\w*$/, "i");
