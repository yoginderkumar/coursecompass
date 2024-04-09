import { DismissButton, useOverlay, FocusScope } from "react-aria";
import classNames from "classnames";
import React, { useMemo, useReducer } from "react";
import { Link } from "react-router-dom";
import { Button } from "./Button";

type TMenuContext = {
  isExpended: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

export const MenuContext = React.createContext<TMenuContext>({
  isExpended: false,
  open: () => undefined,
  close: () => undefined,
  toggle: () => undefined,
});

function useMenu() {
  return React.useContext(MenuContext);
}

export function Menu({
  children,
}: {
  children: React.ReactNode | ((props: TMenuContext) => React.ReactNode);
}) {
  const [state, dispatch] = useReducer<
    React.Reducer<{ isExpended: boolean }, { type: "OPEN" | "CLOSE" }>
  >(
    (state, action) => {
      switch (action.type) {
        case "OPEN":
          return { ...state, isExpended: true };
        case "CLOSE":
          return { ...state, isExpended: false };
        default:
          return state;
      }
    },
    { isExpended: false }
  );
  const contextValue = useMemo(() => {
    function open() {
      dispatch({ type: "OPEN" });
    }
    function close() {
      dispatch({ type: "CLOSE" });
    }
    return {
      isExpended: state.isExpended,
      open,
      close,
      toggle: () => (state.isExpended ? close() : open()),
    };
  }, [state]);
  return (
    <MenuContext.Provider value={contextValue}>
      <div className="relative">
        {typeof children === "function" ? children(contextValue) : children}
      </div>
    </MenuContext.Provider>
  );
}

export function MenuButton(props: React.ComponentProps<typeof Button>) {
  const { toggle } = useMenu();
  return <Button verticalAlign="middle" {...props} onClick={() => toggle()} />;
}

export function MenuList({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  alignRight,
  align,
  className,
  autoFocus = true,
  fullWidth,
  alternateBase = false,
  ...props
}: React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLUListElement>,
  HTMLUListElement
> & {
  alignRight?: boolean;
  align?: "top-right" | "bottom-right";
  autoFocus?: boolean;
  fullWidth?: boolean;
  alternateBase?: boolean;
}) {
  const { isExpended, close } = useMenu();
  // Handle events that should cause the menu to close,
  // e.g. blur, clicking outside, or pressing the escape key.
  const overlayRef = React.useRef<HTMLDivElement>(null);
  const { overlayProps } = useOverlay(
    {
      onClose: close,
      shouldCloseOnBlur: true,
      isOpen: isExpended,
      isDismissable: true,
    },
    overlayRef
  );
  if (!isExpended) return null;
  return (
    <FocusScope restoreFocus autoFocus={autoFocus}>
      <div {...overlayProps}>
        <DismissButton onDismiss={close} />
        <ul
          tabIndex={-1}
          style={{
            width: fullWidth ? "100%" : "fit-content",
          }}
          className={classNames(
            "absolute bg-gray-600 shadow-lg rounded-lg overflow-hidden z-10",
            isExpended ? "block" : "hidden",
            {
              "top-0 left-full": align === "top-right",
              "right-0": align === "bottom-right",
              "bg-white text-[#212121]": alternateBase,
              "text-white": !alternateBase,
            },
            className
          )}
          {...props}
        />
        <DismissButton onDismiss={close} />
      </div>
    </FocusScope>
  );
}

export function MenuItemHeader({
  header,
  ...props
}: React.DetailedHTMLProps<
  React.LiHTMLAttributes<HTMLLIElement>,
  HTMLLIElement
> & { header?: boolean }) {
  return (
    <li
      {...props}
      className={classNames(
        props.className,
        "px-3 pt-2 text-xs text-gray-500 font-medium"
      )}
    />
  );
}

export function MenuItem(
  props: React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  > & { action: string }
) {
  const { close } = useMenu();
  return (
    <li onClick={close}>
      <a
        href={`#${props.action}`}
        {...props}
        className={classNames(
          props.className,
          "px-4 py-3 block hover:bg-[#616161] font-medium"
        )}
      >
        {props.children}
      </a>
    </li>
  );
}

export function MenuLink(props: React.ComponentProps<typeof Link>) {
  const { close } = useMenu();
  return (
    <li onClick={close}>
      <Link
        {...props}
        className={classNames(
          props?.className || "",
          "px-4 py-3 block hover:bg-[#616161] font-medium"
        )}
      />
    </li>
  );
}
