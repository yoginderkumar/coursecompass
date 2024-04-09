import React, { forwardRef } from "react";
import { boxStyles, TBoxStyles } from "./box.css";
import { sizeStyles, TSizeStyles } from "../css/size.css";
import { transformStyles, TTransformStyles } from "../css/transform.css";
import classnames from "classnames";
import { PolymorphicComponentPropWithRef, PolymorphicRef } from "../../utils";
import { colorStyles, TColorStyles } from "../css/color.css";
import { textStyles, TTextStyles } from "../css/text.css";

const DefaultBoxElement = "div";

export type BoxOwnProps = TColorStyles &
  TSizeStyles &
  TTextStyles &
  TBoxStyles &
  Omit<TTransformStyles, "transform">;

export type BoxProps<C extends React.ElementType> =
  PolymorphicComponentPropWithRef<C, BoxOwnProps>;

export type BoxComponent = <
  C extends React.ElementType = typeof DefaultBoxElement
>(
  props: BoxProps<C>
) => React.ReactNode;

export const Box: BoxComponent = forwardRef(
  <C extends React.ElementType = typeof DefaultBoxElement>(
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
      borderTopLeftRadius,
      borderTopRightRadius,
      borderBottomRightRadius,
      borderBottomLeftRadius,
      borderRadius,
      borderTopColor,
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
      // fontSize,
      // fontWeight,
      // textTransform,
      rotate,
      scaleX,
      scaleY,
      scale,
      whiteSpace,

      // variation,
      // textColor,

      // maxHeightProperties,
      // borderStyle = 'solid',
      fontSize,
      fontWeight,
      textTransform,
      ...restProps
    }: BoxProps<C>,
    ref?: PolymorphicRef<C>
  ) => {
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
          sizeStyles({
            size,
            width,
            height,
          }),
          transformStyles({ scale, scaleX, scaleY, rotate, transform }),
          textStyles({
            fontSize,
            fontWeight,
            textTransform,
            whiteSpace,
          }),
          boxStyles({
            bgColor,
            backgroundColor,
            textAlign,
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
            borderTopColor,
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
  }
);
