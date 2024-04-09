import { createVar, fallbackVar } from "@vanilla-extract/css";
import { defineProperties, createSprinkles } from "@vanilla-extract/sprinkles";

const translateXVar = createVar();
const translateYVar = createVar();
const rotateVar = createVar();
const scaleXVar = createVar();
const scaleYVar = createVar();

const transformProperties = defineProperties({
  properties: {
    transform: {
      "1": {
        transform: `translate(${fallbackVar(translateXVar, "0")}, ${fallbackVar(
          translateYVar,
          "0"
        )}) rotate(${fallbackVar(rotateVar, "0")}) scaleX(${fallbackVar(
          scaleXVar,
          "1"
        )}) scaleY(${fallbackVar(scaleYVar, "1")})`,
      },
    },
    rotate: {
      "90": { vars: { [rotateVar]: "90deg" } },
      "180": { vars: { [rotateVar]: "180deg" } },
      "270": { vars: { [rotateVar]: "270deg" } },
    },
    scaleX: {
      "50": { vars: { [scaleXVar]: ".5" } },
    },
    scaleY: {
      "50": { vars: { [scaleXVar]: ".5" } },
    },
  },
  shorthands: {
    scale: ["scaleX", "scaleY"],
  },
});

export const transformStyles = createSprinkles(transformProperties);

export type TTransformStyles = Parameters<typeof transformStyles>[0];
