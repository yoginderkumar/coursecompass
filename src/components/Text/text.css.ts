import { BREAKPOINTS } from "../css/theme";
import { defineProperties, createSprinkles } from "@vanilla-extract/sprinkles";

const fontSizeProperties = defineProperties({
  conditions: BREAKPOINTS,
  defaultCondition: "xs",
  properties: {
    fontSize: {
      h1: { fontSize: "32px", lineHeight: "39px", fontWeight: 600 },
      h2: { fontSize: "28px", lineHeight: "34px", fontWeight: 600 },
      h3: { fontSize: "28px", lineHeight: "34px", fontWeight: 500 },
      h4: { fontSize: "24px", lineHeight: "29px", fontWeight: 600 },
      h5: { fontSize: "24px", lineHeight: "29px", fontWeight: 500 },
      s1: { fontSize: "20px", lineHeight: "24px", fontWeight: 600 },
      s2: { fontSize: "20px", lineHeight: "24px", fontWeight: 500 },
      s3: { fontSize: "16px", lineHeight: "20px", fontWeight: 600 },
      s4: { fontSize: "14px", lineHeight: "17px", fontWeight: 600 },
      b1: { fontSize: "16px", lineHeight: "20px", fontWeight: 500 },
      b2: { fontSize: "16px", lineHeight: "20px", fontWeight: 400 },
      b3: { fontSize: "14px", lineHeight: "17px", fontWeight: 500 },
      b4: { fontSize: "14px", lineHeight: "17px", fontWeight: 400 },
      bt: { fontSize: "14px", lineHeight: "17px", fontWeight: 600 },
      c1: { fontSize: "12px", lineHeight: "15px", fontWeight: 600 },
      c2: { fontSize: "12px", lineHeight: "15px", fontWeight: 500 },
      c3: { fontSize: "12px", lineHeight: "15px", fontWeight: 400 },
      c4: { fontSize: "0.75rem", lineHeight: "1rem", fontWeight: 400 },
    },
  },
});

const fontWeightProperties = defineProperties({
  properties: {
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
    },
  },
});

const textTransformProperties = defineProperties({
  properties: {
    textTransform: {
      uppercase: "uppercase",
    },
  },
});

export const textStyles = createSprinkles(
  fontSizeProperties,
  fontWeightProperties,
  textTransformProperties
);

export type TTextStyles = Parameters<typeof textStyles>[0];
