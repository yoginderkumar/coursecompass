import React, { useMemo } from "react";
import { Box } from "../components";
import { Text, TextProps } from "../components/Text";
import { CURRENCY_TYPES } from "../data";
import { normalizeNumber } from "../utils";

const currencies_supported: { [key in CURRENCY_TYPES]: string } = {
  INR: "₹",
  USD: "$",
  EUR: "€",
};

export const Amount = React.forwardRef<
  HTMLSpanElement,
  TextProps<"span"> & {
    currency?: CURRENCY_TYPES;
    amount: number;
    currencySpacing?: React.ComponentProps<typeof Box>["paddingRight"];
  }
>(function Amount({ currency, amount, currencySpacing, ...props }, ref) {
  return (
    <Text
      as="span"
      ref={ref}
      itemScope
      itemType="http://schema.org/UnitPriceSpecification"
      {...props}
    >
      {currency ? (
        <Box
          as="span"
          paddingRight={currencySpacing || "1"}
          itemProp="priceCurrency"
        >
          {currencies_supported[currency]}
        </Box>
      ) : null}
      <Box itemProp="price" display="inline">
        <LocalizedNumber number={amount} />
      </Box>
    </Text>
  );
});

export const LocalizedNumber = React.forwardRef<
  HTMLSpanElement,
  TextProps<"span"> & {
    number: number;
  }
>(function LocalizedNumber({ number, ...props }, ref) {
  const format = useNumberFormatter();
  return (
    <Text as="span" {...props} ref={ref}>
      {format(number)}
    </Text>
  );
});

export function useNumberFormatter(options?: Intl.NumberFormatOptions) {
  const formatter = useMemo(
    (newOptions?: Intl.NumberFormatOptions) => {
      newOptions = { ...options, ...newOptions };
      const maximumFractionDigits =
        newOptions?.maximumFractionDigits === undefined
          ? 2
          : newOptions?.maximumFractionDigits;
      try {
        if (typeof Intl !== "undefined") {
          return new Intl.NumberFormat(`en-IN`, {
            ...newOptions,
            maximumFractionDigits,
          }).format;
        }
        throw new Error("Intl not supported");
      } catch (e) {
        const error = e as Error;
        return (n: number) =>
          fallbackNumberToLocalString(n, maximumFractionDigits);
      }
    },
    [options]
  );
  return formatter;
}

function fallbackNumberToLocalString(
  n: number | null | undefined,
  digitsAfterDecimal: number | undefined = 2
) {
  if (n === null || n === undefined) return "";
  const str = normalizeNumber(n, digitsAfterDecimal).toString();
  // we dont want to add commas in the after the decimal point
  const parts = str.split(".");
  // reading the regex
  // ?= means something MUST follow (called sometimes lookahead matches)
  //      e.g. "a?=b" => a follows b matches ab but not ac
  // ?! means something MUST NOT follow
  //      e.g  "a?!b" => a must not follow b matches ac but not ab
  // So bellow regex reads as follows
  // Other than boundries (\B), something (empty space) should be follow (?=)
  //  (\d{2}+\d{3})|(\d{3}) i.e. group of 2 digits with a group of 3 digit at end
  //  and MUST NOT (?!) follow a single digit (\d)
  // How this works ?
  // e.g. Suppose we a the input as 1234567 which should ouput 12,34,567
  // so we will start to find a match, looking at the first not boundry whitespce
  // e.g. space between 1,2, we will see that it is does not follows \d{2}+\d{3} pattern,
  // it follows \d{2}+\d{2} pattern, and so there will be no match
  // Next we move to the space between 2,3, we see that it has a match i.e. \d{2}+ => "34" and
  // \d{3} => '567', and so we put a "," at the place of this space.
  // Same goes for the space between 3,4 which does not pass the criteria.
  // Now we move to the space between 4,5. This does not passes the pattern of \d{2}+\d{3} but passes
  // \d{3} pattern (we have an OR statement for this case) and so we put a "," here.
  // Afterwards we find no match
  parts[0] = parts[0].replace(/\B(?=(((\d{2})+\d{3})|\d{3})(?!\d))/g, ",");
  return parts.join(".");
}
