import type { ElementType } from "react";
import { forwardRef } from "react";
import { PolymorphicRef, PolymorphicComponentPropWithRef } from "../utils";
import { Box, BoxOwnProps } from "./Box";
import { BREAKPOINTS, BREAKPOINTS_NAMES } from "./css/theme";

const DefaultElement = "div";

export type InlineOwnProps = Omit<BoxOwnProps, "display"> & {
  collapseBelow?: ResponsiveRangeProps["below"];
};

export type InlineProps<C extends React.ElementType = typeof DefaultElement> =
  PolymorphicComponentPropWithRef<C, InlineOwnProps>;

export type InlineComponent = <
  C extends React.ElementType = typeof DefaultElement
>(
  props: InlineProps<C>
) => React.ReactNode;

export const Inline: InlineComponent = forwardRef(
  <C extends React.ElementType = typeof DefaultElement>(
    { as, collapseBelow, ...rest }: InlineProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Element: ElementType = as || DefaultElement;
    const [collapseXs, collapseSm, collapseMd] = resolveResponsiveRangeProps({
      below: collapseBelow,
    });
    return (
      <Box
        flexDirection={{
          xs: collapseXs ? "col" : "row",
          sm: collapseSm ? "col" : "row",
          md: collapseMd ? "col" : "row",
        }}
        {...rest}
        as={Element}
        ref={ref}
        display="flex"
      />
    );
  }
);

export interface ResponsiveRangeProps {
  above?: Exclude<keyof typeof BREAKPOINTS, "2xl">;
  below?: Exclude<keyof typeof BREAKPOINTS, "xs">;
}

// eslint-disable-next-line react-refresh/only-export-components
export const resolveResponsiveRangeProps = (
  props: ResponsiveRangeProps
): [
  xs: boolean,
  sm: boolean,
  md: boolean,
  lg: boolean,
  xl: boolean,
  _2xl: boolean
] => {
  const { above, below } = props;

  if (!above && !below) {
    return [false, false, false, false, false, false];
  }

  const startIndex = above ? BREAKPOINTS_NAMES.indexOf(above) + 1 : 0;
  const endIndex = below
    ? BREAKPOINTS_NAMES.indexOf(below) - 1
    : BREAKPOINTS_NAMES.length - 1;
  const range = BREAKPOINTS_NAMES.slice(startIndex, endIndex + 1);

  return [
    range.indexOf("xs") >= 0,
    range.indexOf("sm") >= 0,
    range.indexOf("md") >= 0,
    range.indexOf("lg") >= 0,
    range.indexOf("xl") >= 0,
    range.indexOf("2xl") >= 0,
  ];
};
