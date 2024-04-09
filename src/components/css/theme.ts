"use client";
export const BREAKPOINTS = {
  xs: {},
  sm: { "@media": "screen and (min-width: 640px)" },
  md: { "@media": "screen and (min-width: 768px)" },
  lg: { "@media": "screen and (min-width: 1024px)" },
  xl: { "@media": "screen and (min-width: 1280px)" },
  "2xl": { "@media": "screen and (min-width: 1440px)" },
} as const;

const LIGHT_COLORS = {
  //Blue
  blue5: "#F6F7FD",
  blue10: "#EDEFFB",
  blue20: "#DAE0F6",
  blue30: "#B6C1EE",
  blue40: "#91A1E5",
  blue50: "#4863D4",
  blue60: "#4159BF",
  blue70: "#3A4FAA",
  blue80: "#2B3B7F",
  blue90: "#1D2855",

  //Green
  green5: "#F3FAF6",
  green10: "#E8F5EE",
  green20: "#D1ECDC",
  green30: "#A2D9B9",
  green40: "#74C597",
  green50: "#179F51",
  green60: "#158F49",
  green70: "#127F41",
  green80: "#0E5F31",
  green90: "#094020",

  //Red
  red5: "#FCF5F5",
  red10: "#FAEBEB",
  red20: "#F4D8D8",
  red30: "#E9B1B1",
  red40: "#DF8989",
  red50: "#C93B3B",
  red60: "#B53535",
  red70: "#A12F2F",
  red80: "#792323",
  red90: "#501818",

  //Grey
  grey0: "#FFFFFF",
  grey5: "#FAFAFA",
  grey10: "#F5F5F5",
  grey20: "#EEEEEE",
  grey30: "#E0E0E0",
  grey40: "#BDBDBD",
  grey50: "#9E9E9E",
  grey60: "#757575",
  grey70: "#616161",
  grey80: "#424242",
  grey90: "#212121",

  yellow50: "#faf2d2",
  yellow100: "#EDCF5A",
  yellow300: "#E9C535",
  yellow500: "#E8C021",
  yellow700: "#CAA616",
  yellow900: "#A58812",
};

export const COLORS = {
  transparent: "transparent",
  red: "red",
  black: "#000",
  white: "#fff",
  ratingColor: "#ffe234",

  //Surfaces
  surfaceDefault: LIGHT_COLORS.grey0,
  surfacePrimary: LIGHT_COLORS.yellow500,
  surfaceError: LIGHT_COLORS.red50,
  surfaceSuccess: LIGHT_COLORS.green50,
  surfacePrimaryLowest: LIGHT_COLORS.yellow50,
  surfaceSuccessLowest: LIGHT_COLORS.green10,
  surfaceErrorLowest: LIGHT_COLORS.red10,
  surfaceNeutral: LIGHT_COLORS.grey70,
  surfaceNeutralLowest: LIGHT_COLORS.grey10,
  surfaceBase: LIGHT_COLORS.grey80,

  //Borders
  borderOutline: LIGHT_COLORS.grey30,
  borderDividers: LIGHT_COLORS.grey20,
  borderPrimary: LIGHT_COLORS.yellow500,
  borderSuccess: LIGHT_COLORS.green50,
  borderError: LIGHT_COLORS.red50,
  borderPrimaryLow: LIGHT_COLORS.yellow50,
  borderSuccessLow: LIGHT_COLORS.green30,
  borderErrorLow: LIGHT_COLORS.red30,

  //Texts
  textHigh: LIGHT_COLORS.grey90,
  textMedium: LIGHT_COLORS.grey60,
  textLow: LIGHT_COLORS.grey50,
  textOnSurface: LIGHT_COLORS.grey0,
  textPrimary: LIGHT_COLORS.yellow500,
  textSuccess: LIGHT_COLORS.green50,
  textError: LIGHT_COLORS.red50,
  textOnButton: LIGHT_COLORS.grey90,
  textAlt1: LIGHT_COLORS.blue50,

  //Icons
  iconHigh: LIGHT_COLORS.grey90,
  iconMedium: LIGHT_COLORS.grey60,
  iconLow: LIGHT_COLORS.grey50,
  iconLowest: LIGHT_COLORS.grey40,
  iconOnSurface: LIGHT_COLORS.grey0,
  iconPrimary: LIGHT_COLORS.yellow500,
  iconPrimaryLow: LIGHT_COLORS.yellow300,
  iconPrimaryLowest: LIGHT_COLORS.yellow100,
  iconSuccess: LIGHT_COLORS.green50,
  iconError: LIGHT_COLORS.red50,
  iconAlt1: LIGHT_COLORS.blue50,
} as const;

export const SPACING = {
  "0": "0",
  px: "1px",
  "1": ".25rem",
  "2": ".5rem",
  "3": ".75rem",
  "4": "1rem",
  "5": "1.25rem",
  "6": "1.5rem",
  "7": "1.75rem",
  "8": "2rem",
  "9": "2.25rem",
  "10": "2.5rem",
  "12": "3rem",
  "14": "3.5rem",
  "16": "4rem",
  "18": "4.5rem",
  "24": "6rem",
  auto: "auto",
} as const;

export const SIZES = {
  ...SPACING,
  "1/2": "50%",
  "1/3": "33.33333%",
  full: "100%",
} as const;

export const BREAKPOINTS_NAMES = Object.keys(
  BREAKPOINTS
) as never as keyof typeof BREAKPOINTS;
