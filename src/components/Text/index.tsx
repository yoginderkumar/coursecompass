import type { ElementType, ForwardedRef } from "react";
import { forwardRef } from "react";
import type {
  PolymorphicForwardRefExoticComponent,
  PolymorphicPropsWithoutRef,
  PolymorphicPropsWithRef,
} from "react-polymorphic-types";
import { TTextStyles } from "../css/text.css";
import { TColorStyles } from "../css/color.css";
import { Box } from "../Box";

const DefaultTextElement = "p";

export type TextOwnProps = TColorStyles & TTextStyles;

export type TextProps<T extends React.ElementType = typeof DefaultTextElement> =
  PolymorphicPropsWithRef<TextOwnProps, T>;

export const Text: PolymorphicForwardRefExoticComponent<
  TextOwnProps,
  typeof DefaultTextElement
> = forwardRef(function Text<T extends ElementType = typeof DefaultTextElement>(
  { as, ...restProps }: PolymorphicPropsWithoutRef<TextOwnProps, T>,
  ref: ForwardedRef<Element>
) {
  const Element: ElementType = as || DefaultTextElement;
  return <Box {...restProps} as={Element} ref={ref} />;
});

const DefaultHeadingElement = "h3";

export const Heading: PolymorphicForwardRefExoticComponent<
  TextOwnProps,
  typeof DefaultHeadingElement
> = forwardRef(function Heading<
  T extends ElementType = typeof DefaultHeadingElement
>(
  { as, ...restProps }: PolymorphicPropsWithoutRef<TextOwnProps, T>,
  ref: ForwardedRef<Element>
) {
  const Element: ElementType = as || DefaultHeadingElement;
  return <Text as={Element} ref={ref} {...restProps} />;
});
