import { defineProperties, createSprinkles } from "@vanilla-extract/sprinkles";
import { SIZES, BREAKPOINTS } from "./theme";

const sizeProperties = defineProperties({
  conditions: BREAKPOINTS,
  defaultCondition: "xs",
  properties: {
    width: SIZES,
    height: SIZES,
  },
  shorthands: {
    size: ["width", "height"],
  },
});

export const sizeStyles = createSprinkles(sizeProperties);

export type TSizeStyles = Parameters<typeof sizeStyles>[0];
