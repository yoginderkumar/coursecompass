import type { ElementType, ForwardedRef } from "react";
import { forwardRef } from "react";
import type {
  PolymorphicForwardRefExoticComponent,
  PolymorphicPropsWithoutRef,
  PolymorphicPropsWithRef,
} from "react-polymorphic-types";
import { boxStyles, TBoxStyles } from "./box.css";
import { colorStyles, TColorStyles } from "../css/color.css";
import { sizeStyles, TSizeStyles } from "../css/size.css";
import { textStyles, TTextStyles } from "../css/text.css";
import { transformStyles, TTransformStyles } from "../css/transform.css";
import classnames from "classnames";

const DefaultBoxElement = "div";

export type BoxOwnProps = TColorStyles &
  TSizeStyles &
  TTextStyles &
  TBoxStyles &
  Omit<TTransformStyles, "transform">;

export type BoxProps<T extends React.ElementType = typeof DefaultBoxElement> =
  PolymorphicPropsWithRef<BoxOwnProps, T>;

export const Box: PolymorphicForwardRefExoticComponent<
  BoxOwnProps,
  typeof DefaultBoxElement
> = forwardRef(function Box<T extends ElementType = typeof DefaultBoxElement>(
  {
    as,
    color,
    padding,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    paddingX,
    paddingY,
    margin,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    marginX,
    marginY,
    bgColor,
    backgroundColor,
    textAlign,
    position,
    top,
    right,
    bottom,
    left,
    insetX,
    insetY,
    inset,
    cursor,
    pointerEvents,
    zIndex,
    flexDirection,
    flexGrow,
    flexWrap,
    alignItems,
    alignSelf,
    justifyContent,
    display,
    gap,
    className,
    size,
    width,
    height,
    borderTopWidth,
    borderRightWidth,
    borderBottomWidth,
    borderLeftWidth,
    borderWidth,
    borderXWidth,
    borderYWidth,
    borderColor,
    borderTopColor,
    borderTopLeftRadius,
    borderTopRightRadius,
    borderBottomRightRadius,
    borderBottomLeftRadius,
    borderRadius,
    rounded,
    roundedTopRight,
    roundedTopLeft,
    roundedBottomRight,
    roundedBottomLeft,
    roundedTop,
    roundedRight,
    roundedBottom,
    roundedLeft,
    minWidth,
    maxWidth,
    minHeight,
    flex,
    flexShrink,
    overflowX,
    overflowY,
    overflow,
    opacity,
    fontSize,
    fontWeight,
    textTransform,
    rotate,
    scaleX,
    scaleY,
    scale,
    whiteSpace,
    ...restProps
  }: PolymorphicPropsWithoutRef<BoxOwnProps, T>,
  ref: ForwardedRef<Element>
) {
  const Element: React.ElementType = as || DefaultBoxElement;
  const transform =
    scale !== undefined ||
    scaleX !== undefined ||
    scaleY !== undefined ||
    rotate !== undefined
      ? "1"
      : undefined;
  return (
    <Element
      ref={ref}
      {...restProps}
      className={classnames(
        colorStyles({ color }),
        textStyles({
          fontSize,
          fontWeight,
          textTransform,
          whiteSpace,
        }),
        sizeStyles({
          size,
          width,
          height,
        }),
        transformStyles({ scale, scaleX, scaleY, rotate, transform }),
        boxStyles({
          padding,
          paddingTop,
          paddingRight,
          paddingBottom,
          paddingLeft,
          paddingX,
          paddingY,
          margin,
          marginTop,
          marginRight,
          marginBottom,
          marginLeft,
          marginX,
          marginY,
          bgColor,
          backgroundColor,
          textAlign,
          position,
          top,
          right,
          bottom,
          left,
          insetX,
          insetY,
          inset,
          cursor,
          pointerEvents,
          display,
          alignItems,
          alignSelf,
          justifyContent,
          zIndex,
          flexDirection,
          flexGrow,
          flexWrap,
          gap,
          minWidth,
          borderColor,
          borderTopColor,
          borderTopWidth,
          borderRightWidth,
          borderBottomWidth,
          borderLeftWidth,
          borderWidth,
          borderXWidth,
          borderYWidth,
          borderTopLeftRadius,
          borderTopRightRadius,
          borderBottomRightRadius,
          borderBottomLeftRadius,
          borderRadius,
          rounded,
          roundedTopRight,
          roundedTopLeft,
          roundedBottomRight,
          roundedBottomLeft,
          roundedTop,
          roundedRight,
          roundedBottom,
          roundedLeft,
          maxWidth,
          minHeight,
          flex,
          flexShrink,
          overflowX,
          overflowY,
          overflow,
          opacity,
        }),
        className
      )}
    />
  );
});
