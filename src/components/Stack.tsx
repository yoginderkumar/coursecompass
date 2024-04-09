import { forwardRef } from "react";
import { Box, BoxProps } from "./Box";
import { PolymorphicRef } from "../utils";

const DefaultElement = "div";

export type StackComponent = <
  C extends React.ElementType = typeof DefaultElement
>(
  props: BoxProps<C>
) => React.ReactNode;

export const Stack: StackComponent = forwardRef(
  <C extends React.ElementType = typeof DefaultElement>(
    { as, ...rest }: BoxProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Element: React.ElementType = as || DefaultElement;
    return (
      <Box
        display="flex"
        flexDirection={"col"}
        ref={ref}
        as={Element}
        {...rest}
      />
    );
  }
);

export default Stack;
