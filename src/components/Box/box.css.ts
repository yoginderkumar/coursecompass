import { defineProperties, createSprinkles } from "@vanilla-extract/sprinkles";
import { BREAKPOINTS, COLORS, SPACING } from "../css/theme";

const backgroundColorProperties = defineProperties({
  conditions: {
    default: {},
    hover: { selector: "&:hover" },
  },
  defaultCondition: "default",
  properties: {
    backgroundColor: COLORS,
  },
  shorthands: {
    bgColor: ["backgroundColor"],
  },
});

const textAlignProperties = defineProperties({
  conditions: BREAKPOINTS,
  defaultCondition: "xs",
  properties: {
    textAlign: ["left", "center", "right"],
  },
});

const paddingProperties = defineProperties({
  conditions: BREAKPOINTS,
  defaultCondition: "xs",
  properties: {
    paddingTop: SPACING,
    paddingBottom: SPACING,
    paddingLeft: SPACING,
    paddingRight: SPACING,
  },
  shorthands: {
    padding: ["paddingTop", "paddingBottom", "paddingLeft", "paddingRight"],
    paddingX: ["paddingLeft", "paddingRight"],
    paddingY: ["paddingTop", "paddingBottom"],
  },
});

const marginProperties = defineProperties({
  conditions: BREAKPOINTS,
  defaultCondition: "xs",
  properties: {
    marginTop: SPACING,
    marginBottom: SPACING,
    marginLeft: SPACING,
    marginRight: SPACING,
  },
  shorthands: {
    margin: ["marginTop", "marginBottom", "marginLeft", "marginRight"],
    marginX: ["marginLeft", "marginRight"],
    marginY: ["marginTop", "marginBottom"],
  },
});

const displayProperties = defineProperties({
  conditions: BREAKPOINTS,
  defaultCondition: "xs",
  properties: {
    display: {
      block: "block",
      flex: "flex",
      inline: "inline",
      inlineBlock: "inline-block",
      grid: "grid",
      none: "none",
    },
  },
});

const flexProperties = defineProperties({
  conditions: BREAKPOINTS,
  defaultCondition: "xs",
  properties: {
    flexDirection: {
      col: "column",
      row: "row",
      colReverse: "column-reverse",
      rowReverse: "row-reverse",
    },
    alignItems: {
      center: "center",
      end: "flex-end",
      start: "flex-start",
      stretch: "stretch",
    },
    alignSelf: {
      center: "center",
      stretch: "stretch",
    },
    justifyContent: {
      center: "center",
      start: "flex-start",
      end: "flex-end",
      between: "space-between",
      evenly: "space-evenly",
    },
    flex: {
      "1": {
        flex: "1 1 0%",
      },
      auto: {
        flex: "1 1 auto",
      },
      initial: {
        flex: "0 1 auto",
      },
      none: {
        flex: "none",
      },
    },
    flexGrow: {
      "0": 0,
      "1": 1,
    },
    flexShrink: {
      "0": 0,
      "1": 1,
    },
    flexWrap: {
      wrap: "wrap",
      nowrap: "nowrap",
    },
  },
});

const gapProperties = defineProperties({
  conditions: BREAKPOINTS,
  defaultCondition: "xs",
  properties: {
    gap: {
      px: "px",
      "0": "0",
      "1": ".25rem",
      "2": ".5rem",
      "3": ".75rem",
      "4": "1rem",
      "6": "1.5rem",
      "8": "2rem",
      "10": "2.5rem",
      "12": "3rem",
      "14": "3.5rem",
      "16": "4rem",
    },
  },
});

const positionProperties = defineProperties({
  conditions: BREAKPOINTS,
  defaultCondition: "xs",
  properties: {
    position: ["absolute", "relative", "fixed", "sticky"],
    top: {
      "0": 0,
    },
    right: {
      "0": 0,
    },
    bottom: {
      "0": 0,
    },
    left: {
      "0": 0,
    },
  },
  shorthands: {
    inset: ["top", "right", "bottom", "left"],
    insetX: ["left", "right"],
    insetY: ["top", "bottom"],
  },
});

const cursorProperties = defineProperties({
  properties: {
    pointerEvents: ["none"],
    cursor: { pointer: "pointer", disabled: "not-allowed" },
  },
});

const BORDER_WIDTH = {
  "0": 0,
  "1": "1px",
  "2": "2px",
  "4": "4px",
} as const;

const BORDER_RADIUS = {
  none: 0,
  sm: "0.125rem",
  md: "0.25rem",
  lg: "0.5rem",
  full: "999px",
} as const;

const borderProperties = defineProperties({
  properties: {
    borderTopWidth: BORDER_WIDTH,
    borderRightWidth: BORDER_WIDTH,
    borderBottomWidth: BORDER_WIDTH,
    borderLeftWidth: BORDER_WIDTH,
    borderTopLeftRadius: BORDER_RADIUS,
    borderTopRightRadius: BORDER_RADIUS,
    borderBottomRightRadius: BORDER_RADIUS,
    borderBottomLeftRadius: BORDER_RADIUS,
    borderColor: COLORS,
    borderTopColor: COLORS,
  },
  shorthands: {
    borderRadius: [
      "borderTopLeftRadius",
      "borderTopRightRadius",
      "borderBottomRightRadius",
      "borderBottomLeftRadius",
    ],
    borderTopRadius: ["borderTopLeftRadius", "borderTopRightRadius"],
    borderRightRadius: ["borderTopRightRadius", "borderBottomRightRadius"],
    borderBottomRadius: ["borderBottomLeftRadius", "borderBottomRightRadius"],
    borderLeftRadius: ["borderBottomLeftRadius", "borderTopLeftRadius"],
    rounded: [
      "borderTopLeftRadius",
      "borderTopRightRadius",
      "borderBottomRightRadius",
      "borderBottomLeftRadius",
    ],
    roundedTop: ["borderTopLeftRadius", "borderTopRightRadius"],
    roundedRight: ["borderTopRightRadius", "borderBottomRightRadius"],
    roundedBottom: ["borderBottomLeftRadius", "borderBottomRightRadius"],
    roundedLeft: ["borderBottomLeftRadius", "borderTopLeftRadius"],
    roundedTopLeft: ["borderTopLeftRadius"],
    roundedTopRight: ["borderTopRightRadius"],
    roundedBottomRight: ["borderBottomRightRadius"],
    roundedBottomLeft: ["borderBottomLeftRadius"],
    borderWidth: [
      "borderTopWidth",
      "borderRightWidth",
      "borderBottomWidth",
      "borderLeftWidth",
    ],
    borderXWidth: ["borderLeftWidth", "borderRightWidth"],
    borderYWidth: ["borderTopWidth", "borderBottomWidth"],
  },
});

const zIndexProperties = defineProperties({
  properties: {
    zIndex: { "0": 0, "10": 10, "50": 50, "100": 100 },
  },
});

const minWidthProperties = defineProperties({
  properties: {
    minWidth: {
      "0": 0,
      full: "100%",
      min: "min-content",
      max: "max-content",
      screenMd: "760px",
    },
  },
});

const maxWidthProperties = defineProperties({
  conditions: BREAKPOINTS,
  defaultCondition: "xs",
  properties: {
    maxWidth: {
      xs: "20rem",
      sm: "24rem",
      md: "28rem",
      lg: "32rem",
      xl: "36rem",
      "2xl": "42rem",
      "3xl": "48rem",
      "4xl": "56rem",
      screen2xl: "1440px",
      full: "100%",
    },
  },
});

const minHeightProperties = defineProperties({
  conditions: BREAKPOINTS,
  defaultCondition: "xs",
  properties: {
    minHeight: { "0": 0, screen: "100vh", full: "100%" },
  },
});

const overflowProperties = defineProperties({
  properties: {
    overflowX: ["auto", "hidden", "visible"],
    overflowY: ["auto", "hidden", "visible"],
  },
  shorthands: {
    overflow: ["overflowX", "overflowY"],
  },
});

const opacityProperties = defineProperties({
  properties: {
    opacity: { "0": "0", "50": ".5", "70": ".7", "100": "1" },
  },
});

export const boxStyles = createSprinkles(
  paddingProperties,
  marginProperties,
  backgroundColorProperties,
  textAlignProperties,
  displayProperties,
  flexProperties,
  gapProperties,
  positionProperties,
  cursorProperties,
  zIndexProperties,
  borderProperties,
  minWidthProperties,
  maxWidthProperties,
  minHeightProperties,
  overflowProperties,
  opacityProperties
);

export type TBoxStyles = Parameters<typeof boxStyles>[0];
