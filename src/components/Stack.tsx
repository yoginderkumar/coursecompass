import type { ElementType, ForwardedRef } from "react";
import { forwardRef } from "react";
import type {
  PolymorphicForwardRefExoticComponent,
  PolymorphicPropsWithoutRef,
  PolymorphicPropsWithRef,
} from "react-polymorphic-types";
import { Box, BoxOwnProps } from "./Box";

const DefaultElement = "div";

export type StackOwnProps = Omit<BoxOwnProps, "display">;

export type StackProps<T extends React.ElementType = typeof DefaultElement> =
  PolymorphicPropsWithRef<StackOwnProps, T>;

export const Stack: PolymorphicForwardRefExoticComponent<
  StackOwnProps,
  typeof DefaultElement
> = forwardRef(function Stack<T extends ElementType = typeof DefaultElement>(
  { as, ...restProps }: PolymorphicPropsWithoutRef<StackOwnProps, T>,
  ref: ForwardedRef<Element>
) {
  const Element: ElementType = as || DefaultElement;
  return (
    <Box
      flexDirection="col"
      {...restProps}
      as={Element}
      ref={ref}
      display="flex"
    />
  );
});
