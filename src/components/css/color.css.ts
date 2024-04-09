import { defineProperties, createSprinkles } from "@vanilla-extract/sprinkles";
import { COLORS } from "./theme";

const colorProperties = defineProperties({
  conditions: {
    default: {},
    hover: { selector: "&:hover" },
    focus: { selector: "&:focus" },
  },
  defaultCondition: "default",
  properties: {
    color: COLORS,
  },
});

export const colorStyles = createSprinkles(colorProperties);

export type TColorStyles = Parameters<typeof colorStyles>[0];
