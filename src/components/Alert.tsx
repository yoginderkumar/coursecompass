import classnames from "classnames";
import React from "react";
import { alertStyles, TAlertStyles } from "./alert.css";
import { InformationCircleFilledIcon, InformationWarningIcon } from "./Icons";

import type { ElementType } from "react";
import { forwardRef } from "react";
import { PolymorphicComponentPropWithRef } from "../utils";

const DefaultAlertElement = "div";

export type AlertOwnProps = TAlertStyles & {
  status: "error" | "info" | "warning" | "success";
  children: React.ReactNode;
  customIcon?: React.ReactNode;
  removeIcon?: boolean;
};

export type AlertProps<C extends React.ElementType> =
  PolymorphicComponentPropWithRef<C, AlertOwnProps>;

export type AlertComponent = <
  C extends React.ElementType = typeof DefaultAlertElement
>(
  props: AlertProps<C>
) => React.ReactNode;

export const Alert: AlertComponent = forwardRef(function Alert<
  C extends ElementType = typeof DefaultAlertElement
>({
  status,
  children,
  customIcon,
  removeIcon,

  borderWidth,
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
  margin,
  marginX,
  marginY,
  marginTop,
  marginLeft,
  marginBottom,
  padding,
  paddingX,
  paddingY,
  paddingTop,
  paddingLeft,
  paddingBottom,
  ...restProps
}: AlertProps<C>) {
  const Element: React.ElementType = DefaultAlertElement;
  return (
    <Element
      {...restProps}
      role="status"
      aria-live={status === "error" ? "assertive" : "polite"}
      className={classnames(
        `${!rounded ? "rounded" : ""} ${borderWidth ? "" : "border"} ${
          !marginBottom ? "mb-4" : ""
        } px-4 py-3 flex gap-3 items-center font-medium`,
        {
          "bg-[#F8EFE7] border-[#EB974A] text-[#BD610D]": status === "warning",
          "bg-red-100 text-red-900 border-red-100": status === "error",
          "bg-[#EEEDFA] text-[#212121] px-6": status === "info",
          "bg-green-100 text-green-900 px-6": status === "success",
        },
        alertStyles({
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
          borderWidth,
          margin,
          marginX,
          marginY,
          marginTop,
          marginLeft,
          marginBottom,
          padding,
          paddingX,
          paddingY,
          paddingTop,
          paddingLeft,
          paddingBottom,
        })
      )}
    >
      {removeIcon ? null : customIcon ? (
        customIcon
      ) : status === "warning" ? (
        <InformationWarningIcon />
      ) : status === "info" ? (
        <InformationCircleFilledIcon className="h-5 w-5" color="textAlt1" />
      ) : null}
      <div className="flex-1 min-w-0 text-[14px]">{children}</div>
    </Element>
  );
});
