declare module "plural" {
  export default function (word: string, num: number): string;
  export function addRule(
    word: string | RegExp,
    result: string | ((word: string, match: string) => string)
  ): void;
}
