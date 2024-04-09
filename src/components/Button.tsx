import classNames from "classnames";
import { Box, BoxOwnProps } from "./Box";
import React, { ForwardedRef, useMemo } from "react";

export type ButtonStateTypes = "disabled" | "loading";
export type ButtonStatusTypes = "warning" | "danger" | "success";
export type ButtonLevel = "primary" | "secondary" | "tertiary";
export type ButtonProps = {
  size?: "sm" | "lg";
  status?: ButtonStatusTypes;
  level?: ButtonLevel;
  fullWidth?: boolean;
  children: React.ReactNode;
  inline?: boolean;
  type?: "submit" | "reset" | "button";
  iconPlacement?: "left" | "right";
  loading?: boolean;
  rounded?: React.ComponentProps<typeof Box>["rounded"];
  contentAlign?: "left" | "center";
};

export const Button = React.forwardRef<
  HTMLButtonElement,
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > &
    ButtonProps
>(function Button(
  {
    size = "sm",
    status,
    disabled,
    fullWidth,
    level,
    children,
    type,
    inline,
    loading,
    rounded,
    contentAlign = "center",
    iconPlacement,
    onClick,
  },
  ref: ForwardedRef<HTMLButtonElement>
) {
  const state: ButtonStateTypes | undefined = disabled
    ? "disabled"
    : loading
    ? "loading"
    : undefined;
  level = level || (type === "submit" ? "primary" : "secondary");
  const buttonProps = useMemo(
    () =>
      getCBButtonProps({
        size,
        status,
        level,
        fullWidth,
        inline,
        iconPlacement,
        state,
        rounded,
        contentAlign,
      }),
    [
      size,
      status,
      level,
      inline,
      fullWidth,
      state,
      iconPlacement,
      rounded,
      contentAlign,
    ]
  );

  const buttonClasses = useMemo(() => {
    return getBgColorClassesForButton({ state, level, inline, status });
  }, [inline, level, state, status]);

  return (
    <Box
      ref={ref}
      as={"button"}
      type={type || "button"}
      disabled={disabled || loading}
      className={buttonClasses}
      {...buttonProps}
      onClick={onClick}
    >
      {children}
    </Box>
  );
});

function getBgColorClassesForButton({
  state,
  level,
  status,
  inline,
}: {
  level?: ButtonLevel;
  inline?: boolean;
  state?: ButtonStateTypes;
  status?: ButtonStatusTypes;
}) {
  return classNames(
    level === "primary" && !inline && !state
      ? {
          "bg-[#E8C021]": !status,
          "bg-[#179F51]": status === "success",
          "bg-[#C93B3B]": status === "danger",
          "bg-[#BD610D]": status === "warning",
        }
      : null,
    level === "primary" && !inline && state
      ? {
          "bg-[#E0E0E0]": state === "disabled",
          "bg-[#E9C535]": state === "loading" && !status,
          "bg-[#74C597]": state === "loading" && status === "success",
          "bg-[#DF8989]": state === "loading" && status === "danger",
          "bg-[#D7A06E]": state === "loading" && status === "warning",
        }
      : null,
    {
      "cursor-not-allowed": state,
      "hover:bg-[#CAA616]": !inline && !state && level === "primary" && !status,
      "hover:bg-[#158F49]":
        !inline && !state && level === "primary" && status === "success",
      "hover:bg-[#AA570C]":
        !inline && !state && level === "primary" && status === "warning",
      "hover:bg-[#B53535]":
        !inline && !state && level === "primary" && status === "danger",
      "hover:border-[#E8C021]":
        !inline && !state && (level === "secondary" || level === "tertiary"),
    }
  );
}

function getColorsForButtons({
  level,
  state,
  status,
  inline,
}: {
  level?: ButtonLevel;
  status?: ButtonStatusTypes;
  state?: ButtonStateTypes;
  inline?: boolean;
}): Pick<BoxOwnProps, "color"> {
  switch (level) {
    case "primary":
      return {
        color:
          state === "disabled"
            ? "textLow"
            : inline
            ? status === "success"
              ? "textSuccess"
              : status === "danger"
              ? "textError"
              : "textPrimary"
            : "textOnSurface",
      };
    default:
      return {
        color:
          state === "disabled"
            ? "textLow"
            : inline
            ? status === "success"
              ? "textSuccess"
              : status === "danger"
              ? "textError"
              : "textPrimary"
            : "textPrimary",
      };
  }
}

function getCBButtonProps({
  size,
  status,
  level,
  fullWidth,
  state,
  inline,
  rounded,
  contentAlign,
  iconPlacement,
}: { state?: ButtonStateTypes } & Pick<
  ButtonProps,
  | "size"
  | "status"
  | "level"
  | "fullWidth"
  | "iconPlacement"
  | "inline"
  | "rounded"
  | "contentAlign"
>): BoxOwnProps {
  const colorStyles = getColorsForButtons({ level, status, state, inline });
  const props: BoxOwnProps = {
    rounded: rounded || "md",
    fontSize: "bt",
    display: "flex",
    alignItems: "center",
    justifyContent: contentAlign === "left" ? "start" : "center",
    textTransform: "capitalize",
    height: inline ? "auto" : size === "sm" ? "10" : "12",
    width: fullWidth ? "full" : "auto",
    gap: "2",
    paddingLeft: inline ? "0" : iconPlacement === "left" ? "7" : "8",
    paddingRight: inline ? "0" : iconPlacement === "right" ? "7" : "8",
    borderColor: !state
      ? status === "danger"
        ? "borderError"
        : "borderPrimary"
      : "borderDividers",
    borderWidth: level === "secondary" && !inline ? "1" : "0",
    ...colorStyles,
  };

  return props;
}
