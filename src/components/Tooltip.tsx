import { FocusScope, DismissButton, useOverlay } from "react-aria";
import classNames from "classnames";
import React, { useMemo, useReducer } from "react";

type TTooltipContext = {
  isExpended: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

const TooltipContext = React.createContext<TTooltipContext>({
  isExpended: false,
  open: () => undefined,
  close: () => undefined,
  toggle: () => undefined,
});

function useTooltip() {
  return React.useContext(TooltipContext);
}

export function Tooltip({
  event,
  content,
  position,
  ...props
}: React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  position?: "top" | "bottom" | "left" | "right";
  event?: "onHover" | "onClick";
  content: React.ReactNode;
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
    <TooltipContext.Provider value={contextValue}>
      <span
        className={classNames("relative inline-block ", {
          "cursor-pointer": event === "onClick",
        })}
        onMouseEnter={() => {
          if (event === "onHover") contextValue.open();
        }}
        onMouseLeave={() => {
          if (event === "onHover") contextValue.close();
        }}
        onClick={() => {
          if (event === "onClick") {
            contextValue.toggle();
          }
        }}
      >
        {props.children}
        <TooltipContent position={position}>{content}</TooltipContent>
      </span>
    </TooltipContext.Provider>
  );
}

function TooltipContent({
  className,
  children,
  position,
  event,
}: {
  className?: string;
  children: React.ReactNode;
  event?: "onHover" | "onClick";
  position?: "top" | "bottom" | "left" | "right";
}) {
  const { isExpended, close } = useTooltip();
  // Handle events that should cause the menu to close,
  // e.g. blur, clicking outside, or pressing the escape key.
  const overlayRef = React.useRef<HTMLDivElement>(null);
  const { overlayProps } = useOverlay(
    {
      onClose: close,
      shouldCloseOnBlur: true,
      isOpen: true,
      isDismissable: true,
    },
    overlayRef
  );

  if (!isExpended) return null;
  return (
    <FocusScope restoreFocus>
      <div {...overlayProps}>
        {event === "onClick" ? <DismissButton onDismiss={close} /> : null}
        <div
          className={classNames(
            "absolute w-2 left-[50%] h-2 bg-[#2D3142] -bottom-3",
            {
              "-top-3 ": position === "top",
              "right-3 left-[100%]": position === "right",
            }
          )}
          tabIndex={0}
          style={{
            transform: "translateX(-50%) rotate(45deg)",
            rotate: "",
          }}
        />
        <div
          className={classNames(
            "absolute bg-[#2D3142] left-[50%] text-white shadow-lg w-max rounded overflow-hidden z-10 py-2 px-4 font-medium text-sm transform -translate-x-1/2 mt-2 ",
            {
              "bottom-[100%] mb-2 ": position === "top",
            },
            isExpended ? "block" : "hidden",
            className
          )}
          tabIndex={0}
          style={{
            transform: "translateX(-50%)",
          }}
        >
          {children}
        </div>
        {event === "onClick" ? <DismissButton onDismiss={close} /> : null}
      </div>
    </FocusScope>
  );
}
