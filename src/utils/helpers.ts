import plural, { addRule as addPluralRule } from "plural";

export function getInitials(str: string, length?: number) {
  length = length || 2;
  let initials = "";
  const brokenString = str.split(" ");
  let i = 0;
  while (i < length && i < brokenString.length) {
    initials = initials + brokenString[i][0];
    i++;
  }
  return initials;
}

export function getLanguageValue(str: string) {
  str = str.toLowerCase();
  switch (str) {
    case "en":
      return "English";
    case "hi":
      return "Hindi";
    case "fr":
      return "French";
    case "es":
      return "Spanish";
    case "de":
      return "German";
    default:
      return "Unknown";
  }
}

export function getCurrencySymbols(str: string) {
  str = str.toLowerCase();
  switch (str) {
    case "inr":
      return "₹";
    case "usd":
      return "$";
    case "eur":
      return "€";
    default:
      return "Unknown";
  }
}

export function normalizeNumber(
  n: number,
  digitsAfterDecimal: number | undefined = 2
): number {
  let str = n.toString();
  if (digitsAfterDecimal !== undefined) {
    str = Number(str).toFixed(digitsAfterDecimal).toString();
  }
  if (parseInt(str) === parseFloat(str)) {
    str = parseInt(str).toString();
  }
  return Number(str);
}

addPluralRule("is", "are");

const __PLURALIZED_CACHE__: { [key: string]: string } = {};
export function pluralize(word: string, count: number | Array<unknown> = 2) {
  if (Array.isArray(count)) count = count.length;
  const key = `${word}__${count}`;
  if (!__PLURALIZED_CACHE__[key]) {
    __PLURALIZED_CACHE__[key] = plural(word, count);
  }
  return __PLURALIZED_CACHE__[key];
}

export const arrayGroupBy = function (arr: Array<string | number>) {
  const obj: { [key: string | number]: number } = {};
  arr.forEach((item) => {
    if (obj[item]) {
      ++obj[item];
    } else {
      obj[item] = 1;
    }
  });
  return obj;
};
