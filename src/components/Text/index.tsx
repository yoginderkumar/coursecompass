import type { ElementType } from "react";
import { forwardRef } from "react";
import { TTextStyles } from "../css/text.css";
import { TColorStyles } from "../css/color.css";
import { Box, BoxOwnProps } from "../Box";
import { PolymorphicComponentPropWithRef, PolymorphicRef } from "../../utils";

const DefaultTextElement = "p";

export type TextOwnProps = TColorStyles & TTextStyles;

export type TextProps<C extends React.ElementType = typeof DefaultTextElement> =
  PolymorphicComponentPropWithRef<C, BoxOwnProps & TextOwnProps>;

type TextComponent = <C extends React.ElementType = typeof DefaultTextElement>(
  props: TextProps<C>
) => React.ReactNode;

export const Text: TextComponent = forwardRef(
  <C extends React.ElementType = typeof DefaultTextElement>(
    { as, ...restProps }: TextProps<C>,
    ref?: PolymorphicRef<C>
  ) => {
    const Element: ElementType = as || DefaultTextElement;
    return <Box {...restProps} as={Element} ref={ref} />;
  }
);
