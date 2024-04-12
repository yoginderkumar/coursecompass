import React, {
  useRef,
  useReducer,
  useCallback,
  useState,
  useMemo,
  useEffect,
} from "react";
import { ArrowDropDownIcon, CancelIcon, PlusIcon, SpinnerIcon } from "./Icons";
import { MenuContext, MenuList } from "./Menu";
import classNames from "classnames";
import { Inline } from "./Inline";
import { Stack } from "./Stack";
import { Box } from "./Box";
import { Text } from "./Text";
import { Optional } from "utility-types";
import { useFocusWithin } from "react-aria";
import { useOverlayTriggerState } from "./Modal";
import { useMount } from "../utils";

export type TSelectableBaseOption = {
  id: string | number;
  label: string;
  heading?: boolean;
};

type SearchSelectProps<TOption extends TSelectableBaseOption> = {
  actionLabel?: React.ReactNode;
  control?: "input" | "button";
  hasValue?: boolean;
  label?: string;
  onChange: (option: TOption | null) => void;
  options?: Array<TOption>;
  fetchOptions?: (q: string) => Promise<Array<TOption>>;
  searchDisabled?: boolean;
  searchPlaceholder?: string;
  value: TOption | null | string;
  createOptionLabel?: (q: string) => React.ReactNode;
  onCreateOption?: (q: string, onSuccess: () => void) => void;
  isCreating?: boolean;
  height?: React.ComponentProps<typeof Box>["height"];
  removeActionButtons?: boolean;
  focusInputOnKey?: string;
  labelButton?: React.ReactNode;
  align?: "bottom-right" | "top-right";
  footer?: React.ReactNode;
  alignOptions?: "top-right" | "bottom-right";
};

export function SearchSelect<TOption extends TSelectableBaseOption>({
  actionLabel,
  control = "button",
  hasValue,
  label,
  onChange,
  options,
  searchDisabled,
  searchPlaceholder,
  value,
  fetchOptions,
  createOptionLabel,
  onCreateOption,
  isCreating,
  height,
  footer,
  removeActionButtons,
  focusInputOnKey,
  labelButton,
  align,
  alignOptions,
}: SearchSelectProps<TOption>) {
  hasValue = hasValue !== undefined ? hasValue : Boolean(value);
  const { q, filteredOptions, handleQueryChange, filtering } =
    useFilteredOptions({
      options,
      fetchOptions,
    });
  const [isFocusWithin, setFocusWithin] = useState(false);
  const menuState = useOverlayTriggerState({});
  const { focusWithinProps } = useFocusWithin({
    onFocusWithinChange: (isFocusWithin) => setFocusWithin(isFocusWithin),
  });
  const controlInputRef = useRef<HTMLInputElement | null>(null);
  const controlContainerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!isFocusWithin) menuState.close();
  }, [menuState, isFocusWithin]);
  const menuContextValue = useMemo(() => {
    return {
      isExpended: menuState.isOpen,
      open: () => {
        menuState.open();
        // This will ensure that we have latest options available on every open
        handleQueryChange(q);
      },
      close: () => {
        // focus the container before closing for better focus management
        controlContainerRef.current?.focus();
        menuState.close();
        // reset the query
        handleQueryChange("");
      },
      toggle: () => (menuState.isOpen ? menuState.close() : menuState.open()),
    };
  }, [menuState, q, handleQueryChange]);
  return (
    <div {...focusWithinProps} className="relative bg-white">
      <MenuContext.Provider value={menuContextValue}>
        {control === "input" ? (
          <Stack gap="1">
            {labelButton ? (
              <button
                type="button"
                tabIndex={-1}
                onClick={menuContextValue.toggle}
              >
                {labelButton}
              </button>
            ) : label ? (
              <Box>
                <Inline justifyContent="between">
                  <Text>{label}</Text>
                  {actionLabel ? <Box>{actionLabel}</Box> : null}
                </Inline>
              </Box>
            ) : null}
            <Inline<"div">
              rounded="md"
              className={
                isFocusWithin
                  ? "ring-1 ring-blue-900 border border-blue-900"
                  : "border border-gray100"
              }
              ref={controlContainerRef}
              tabIndex={-1}
              onKeyDown={(e) => {
                if (focusInputOnKey === e.key) {
                  controlInputRef.current?.focus();
                }
                // open on arrow down
                if (e.keyCode === 40 && !menuContextValue.isExpended) {
                  menuContextValue.open();
                }
                // close on escape
                if (e.keyCode === 27 && menuContextValue.isExpended) {
                  menuContextValue.close();
                }
              }}
            >
              <input
                type="search"
                autoComplete="off"
                ref={controlInputRef}
                onClick={menuContextValue.open}
                placeholder={searchPlaceholder}
                readOnly={isCreating}
                disabled={isCreating}
                value={
                  isCreating
                    ? "Creating..."
                    : menuContextValue.isExpended
                    ? q
                    : value
                    ? typeof value === "string"
                      ? value
                      : value.label
                    : ""
                }
                className="flex-1 block px-3 py-2 rounded bg:gray-100 placeholder-gray-500 border border-gray-100 border-0 outline-none shadow-none"
                onChange={(e) => {
                  const q = e.currentTarget.value;
                  if (!menuContextValue.isExpended) menuContextValue.open();
                  handleQueryChange(q || "");
                }}
              />
              {hasValue && !isCreating ? (
                <Box
                  as="button"
                  disabled={isCreating || filtering}
                  onClick={() => onChange(null)}
                  type="button"
                  padding="2"
                  tabIndex={-1}
                >
                  <CancelIcon size="5" color="textMedium" />
                </Box>
              ) : null}
              <Box
                as="button"
                disabled={isCreating || filtering}
                onClick={menuContextValue.toggle}
                type="button"
                padding="2"
                borderLeftWidth="1"
                tabIndex={-1}
              >
                {filtering || isCreating ? (
                  <SpinnerIcon size="6" />
                ) : (
                  <ArrowDropDownIcon size="6" />
                )}
              </Box>
            </Inline>
          </Stack>
        ) : labelButton ? (
          <button type="button" tabIndex={-1} onClick={menuContextValue.toggle}>
            {labelButton}
          </button>
        ) : (
          <Chip
            height={height}
            isApplied={hasValue}
            label={label || "Select"}
            onClick={menuContextValue.toggle}
          />
        )}
        <MenuList
          align={align || alignOptions}
          autoFocus={control !== "input"}
          fullWidth={control === "input"}
          alternateBase
        >
          <div>
            {!(searchDisabled || control === "input") ? (
              <div className="p-3 border-b">
                <input
                  type="search"
                  placeholder={searchPlaceholder}
                  name="q"
                  value={q}
                  autoComplete="off"
                  className="w-full h-[40px] px-4 form-input py-0 h-[36px] border-gray-100 rounded text-base"
                  onChange={(e) => {
                    const q = e.currentTarget.value;
                    handleQueryChange(q || "");
                  }}
                />
              </div>
            ) : null}
            <div
              className={classNames("overflow-auto", {
                "max-h-[230px] w-full": control === "input",
                "max-h-[300px] w-[280px]": control !== "input",
              })}
            >
              <ol className="py-2">
                {!filteredOptions.length ? (
                  <li className="py-3 px-5 text-sm font-medium text-center text-gray-500">
                    No results found
                  </li>
                ) : (
                  filteredOptions.map((option) => {
                    const isSelected =
                      typeof value === "string"
                        ? value === option.id || value === option.label
                        : value?.id === option.id;
                    return (
                      <li key={option.id}>
                        <label
                          className={classNames(
                            "flex gap-4 items-center break-words break-all py-3 px-5",
                            {
                              "cursor-pointer hover:bg-[#F5F5F5]": !isSelected,
                              "bg-[#EBEEFD]": isSelected,
                            }
                          )}
                        >
                          <input
                            type="radio"
                            name="member"
                            value={option.id}
                            readOnly={Boolean(option.heading)}
                            className={
                              option.heading ? "invisible opacity-0" : ""
                            }
                            checked={isSelected}
                            onChange={(e) => {
                              if (option.heading) return;
                              if (e.currentTarget.checked) {
                                onChange(option);
                              }
                              menuContextValue.close();
                            }}
                          />
                          {option.heading ? (
                            <span className="flex-1 pointer-event-none break-all break-words font-medium text-gray-600 text-sm">
                              {option.label}
                            </span>
                          ) : (
                            <span className="flex-1 pointer-event-none break-all break-words font-medium">
                              {option.label}
                            </span>
                          )}
                        </label>
                      </li>
                    );
                  })
                )}
              </ol>
            </div>
            {createOptionLabel && onCreateOption && !isCreating ? (
              <div className="p-3">
                <button
                  type="button"
                  className="w-full flex gap-2 border border-gray-100 bg-blue-50 p-2 items-center rounded"
                  onClick={() => {
                    menuContextValue.close();
                    onCreateOption(q, () =>
                      controlContainerRef.current?.focus()
                    );
                  }}
                >
                  <PlusIcon size="5" color="iconPrimary" />
                  <span className="flex-1 min-w-0 font-medium text-left break-words">
                    {createOptionLabel(q)}
                  </span>
                </button>
              </div>
            ) : null}
            {footer ? footer : null}
            {control !== "input" && !removeActionButtons ? (
              <footer className="flex gap-8 flex-row-reverse border-t py-4 px-5">
                <button
                  type="button"
                  onClick={() => {
                    menuContextValue.close();
                  }}
                  className="text-blue-900 font-semibold"
                >
                  Done
                </button>
                <button
                  type="button"
                  className="text-gray-500 font-semibold"
                  onClick={() => {
                    onChange?.(null);
                    menuContextValue.close();
                  }}
                >
                  Clear
                </button>
              </footer>
            ) : null}
          </div>
        </MenuList>
      </MenuContext.Provider>
    </div>
  );
}

type MultiSearchSelectProps<TOption extends TSelectableBaseOption> = {
  onChange: (option: Array<TOption> | null) => void;
  options?: Array<TOption>;
  value: Array<TOption> | null | undefined;
  label: string;
  searchPlaceholder?: string;
  searchDisabled?: boolean;
  hasValue?: boolean;
  helpOnEmptyResults?: React.ReactNode;
};

export function MultiSearchSelect<TOption extends TSelectableBaseOption>({
  value,
  label = "Select",
  hasValue,
  ...props
}: MultiSearchSelectProps<TOption>) {
  hasValue = hasValue !== undefined ? hasValue : Boolean(value?.length);
  const [isFocusWithin, setFocusWithin] = useState(false);
  const menuState = useOverlayTriggerState({});
  const { focusWithinProps } = useFocusWithin({
    onFocusWithinChange: (isFocusWithin) => setFocusWithin(isFocusWithin),
  });
  useEffect(() => {
    if (!isFocusWithin) menuState.close();
  }, [menuState, isFocusWithin]);
  const menuContextValue = useMemo(() => {
    return {
      isExpended: menuState.isOpen,
      open: menuState.open,
      close: menuState.close,
      toggle: () => (menuState.isOpen ? menuState.close() : menuState.open()),
    };
  }, [menuState]);
  return (
    <div {...focusWithinProps} className="relative">
      <MenuContext.Provider value={menuContextValue}>
        <Chip
          label={label}
          isApplied={hasValue}
          onClick={menuContextValue.toggle}
        />
        <MenuList>
          <MultiSearchMenu
            {...props}
            value={value}
            onClose={menuContextValue.close}
          />
        </MenuList>
      </MenuContext.Provider>
    </div>
  );
}

function MultiSearchMenu<TOption extends TSelectableBaseOption>({
  onChange,
  value,
  options,
  searchPlaceholder = "Search..",
  searchDisabled,
  onClose,
  helpOnEmptyResults,
}: Omit<MultiSearchSelectProps<TOption>, "label" | "hasValue"> & {
  onClose: () => void;
}) {
  const { q, filteredOptions, handleQueryChange } = useFilteredOptions({
    options,
  });
  return (
    <div>
      {!searchDisabled ? (
        <div className="p-3 border-b">
          <input
            type="search"
            placeholder={searchPlaceholder}
            name="q"
            value={q}
            className="w-full h-[40px] px-4 form-input py-0 h-[36px] border-gray-100 rounded text-base"
            onChange={(e) => {
              const q = e.currentTarget.value;
              handleQueryChange(q || "");
            }}
          />
        </div>
      ) : null}
      <div className="max-h-[300px] overflow-auto w-[280px]">
        <ol className="py-2">
          {!options?.length ? (
            <li>
              <div className="py-4 px-5">
                {helpOnEmptyResults || (
                  <>
                    <div className="font-semibold mb-1">
                      No options available!
                    </div>
                  </>
                )}
              </div>
              <footer className="border-t py-4 px-5 text-right">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                  }}
                  autoFocus
                  className="text-blue-900 font-semibold"
                >
                  Ok, Got it
                </button>
              </footer>
            </li>
          ) : (
            filteredOptions.map((option) => {
              const optionIndexInValue = !value
                ? -1
                : value.findIndex((val) =>
                    typeof val === "string"
                      ? val === option.id || val === option.label
                      : val?.id === option.id
                  );
              return (
                <li key={option.id}>
                  <label
                    className={classNames(
                      "flex gap-4 items-center cursor-pointer py-3 px-5 ",
                      {
                        "cursor-pointer hover:bg-[#F5F5F5]":
                          optionIndexInValue === -1,
                        "bg-[#EBEEFD]": optionIndexInValue !== -1,
                      }
                    )}
                  >
                    <input
                      type="checkbox"
                      name="member"
                      value={option.id}
                      checked={optionIndexInValue !== -1}
                      onChange={() => {
                        if (optionIndexInValue === -1) {
                          onChange(value ? value.concat([option]) : [option]);
                        } else {
                          const newValue = value ? value.concat() : [];
                          if (newValue.length) {
                            newValue.splice(optionIndexInValue, 1);
                          }
                          onChange(newValue);
                        }
                      }}
                    />
                    <span className="flex-1 pointer-event-none font-medium">
                      {option.label}
                    </span>
                  </label>
                </li>
              );
            })
          )}
        </ol>
      </div>
      {options?.length ? (
        <footer className="flex gap-8 flex-row-reverse border-t py-4 px-5">
          <button
            type="button"
            onClick={() => {
              onClose();
            }}
            className="text-blue-900 font-semibold"
          >
            Done
          </button>
          <button
            type="button"
            className="text-gray-500 font-semibold"
            onClick={() => {
              onChange?.(null);
              onClose();
            }}
          >
            Clear
          </button>
        </footer>
      ) : null}
    </div>
  );
}

function useFilteredOptions<TOption extends TSelectableBaseOption>({
  options,
  fetchOptions,
}: {
  options?: Array<TOption>;
  fetchOptions?: (q: string) => Promise<Array<TOption>>;
}) {
  type TState = {
    q: string;
    allOptions: Array<TOption>;
    filteredOptions: Array<TOption>;
    filtering: boolean;
  };
  const [state, dispatch] = useReducer(
    (state: TState, action: Optional<TState>) => ({ ...state, ...action }),
    {
      q: "",
      allOptions: options || [],
      filteredOptions: options || [],
      filtering: false,
    }
  );
  useMount(() => {
    if (fetchOptions) handleQueryChange("");
  });
  const filterWorkerRef = useRef<NodeJS.Timeout | null>(null);
  const handleQueryChange = useCallback(
    (q = "") => {
      if (filterWorkerRef.current) clearTimeout(filterWorkerRef.current);
      dispatch({ q, filtering: Boolean(fetchOptions) });
      // filterout the options
      filterWorkerRef.current = setTimeout(async () => {
        const filteredOptions: Array<TOption> = [];
        let allOptions: Array<TOption> = [];
        let lastHeaderToInclude: TOption | null = null;
        if (fetchOptions) {
          allOptions = await fetchOptions(q);
        } else {
          allOptions = options || [];
        }
        if (!allOptions.length) return;
        for (const option of allOptions) {
          if (option.heading) {
            lastHeaderToInclude = option;
            continue;
          }
          const shouldIncludeOption =
            option.label.toLowerCase().indexOf(q.toLowerCase()) !== -1;
          if (shouldIncludeOption) {
            if (lastHeaderToInclude) {
              // push the header first
              filteredOptions.push(lastHeaderToInclude);
            }
            filteredOptions.push(option);
            // reset the header to remove duplicate inclusion
            lastHeaderToInclude = null;
          }
        }
        dispatch({ filteredOptions, filtering: false, allOptions });
      }, 100);
    },
    [options, fetchOptions]
  );

  return {
    ...state,
    handleQueryChange,
  };
}

type DateSelectProps<TOption extends TSelectableBaseOption> = {
  label?: string;
  control?: "input" | "button";
  hasValue?: boolean;
  value?: TOption;
  options: Array<TOption>;
  labelButton?: React.ReactNode;
  removeActionButtons?: boolean;
  removeOpeningBalance?: boolean;
  isOpeningBalanceEnabled?: boolean;
  height?: React.ComponentProps<typeof Box>["height"];
  onApply?: (
    option: TOption | undefined,
    shouldEnableOpeningBalance?: boolean
  ) => void;
  onChange?: (
    option: TOption | undefined,
    shouldEnableOpeningBalance?: boolean
  ) => void;
};
export function DateSelect<TOption extends TSelectableBaseOption>({
  label,
  control = "button",
  hasValue,
  options,
  value,
  height,
  labelButton,
  removeActionButtons,
  removeOpeningBalance,
  isOpeningBalanceEnabled,
  onApply,
  onChange,
}: DateSelectProps<TOption>) {
  hasValue = hasValue !== undefined ? hasValue : Boolean(value);
  const [isFocusWithin, setFocusWithin] = useState(false);
  const [selectedOption, setSelectedOption] = useState<TOption | undefined>(
    value
  );
  const [shouldEnableOpeningBalance, setShouldEnableOpeningBalance] = useState<
    boolean | undefined
  >(isOpeningBalanceEnabled);
  const menuState = useOverlayTriggerState({});
  const { focusWithinProps } = useFocusWithin({
    onFocusWithinChange: (isFocusWithin) => setFocusWithin(isFocusWithin),
  });
  const controlContainerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!isFocusWithin) menuState.close();
  }, [menuState, isFocusWithin]);

  useEffect(() => {
    if (!menuState.isOpen) {
      setSelectedOption(value);
      setShouldEnableOpeningBalance(isOpeningBalanceEnabled);
    }
  }, [menuState.isOpen, value, isOpeningBalanceEnabled]);

  const menuContextValue = useMemo(() => {
    return {
      isExpended: menuState.isOpen,
      open: () => {
        menuState.open();
        // This will ensure that we have latest options available on every open
      },
      close: () => {
        // focus the container before closing for better focus management
        controlContainerRef.current?.focus();
        menuState.close();
        // reset the query
      },
      toggle: () => (menuState.isOpen ? menuState.close() : menuState.open()),
    };
  }, [menuState]);

  return (
    <div {...focusWithinProps} className="relative bg-white">
      <MenuContext.Provider value={menuContextValue}>
        {labelButton ? (
          <button type="button" tabIndex={-1} onClick={menuContextValue.toggle}>
            {labelButton}
          </button>
        ) : (
          <Chip
            height={height}
            isApplied={hasValue}
            label={label || "Select"}
            onClick={menuContextValue.toggle}
          />
        )}
        <MenuList
          autoFocus={control !== "input"}
          fullWidth={control === "input"}
        >
          <div>
            <div
              className={classNames("overflow-auto", {
                "max-h-[230px] w-full": control === "input",
                "max-h-[300px] w-[280px]": control !== "input",
              })}
            >
              <ol className="py-2">
                {options.map((option) => {
                  return (
                    <li key={option.id}>
                      <label
                        className={classNames(
                          "flex gap-4 items-center py-3 px-5 cursor-pointer",
                          {
                            "hover:bg-[#F5F5F5]":
                              selectedOption?.id !== option.id,
                            "bg-[#EBEEFD]": selectedOption?.id === option.id,
                          }
                        )}
                      >
                        <input
                          type="radio"
                          name="member"
                          value={option.id}
                          readOnly={Boolean(option.heading)}
                          checked={selectedOption?.id === option.id}
                          onChange={(e) => {
                            if (e.currentTarget.checked) {
                              onChange?.(option);
                              setSelectedOption(option);
                              if (!onApply) {
                                menuContextValue.close();
                              }
                            }
                          }}
                          onClick={() => {
                            if (option.id === "custom") {
                              onChange?.(option);
                            }
                          }}
                        />
                        <Text
                          fontSize="b3"
                          className={classNames("flex-1  pointer-event-none ")}
                        >
                          {option.label}
                        </Text>
                        {selectedOption?.id === option.id &&
                        option.id === "custom" ? (
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            className="pointer "
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g clipPath="url(#clip0_475_9108)">
                              <path
                                d="M14.06 9.02L14.98 9.94L5.92 19H5V18.08L14.06 9.02ZM17.66 3C17.41 3 17.15 3.1 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C18.17 3.09 17.92 3 17.66 3ZM14.06 6.19L3 17.25V21H6.75L17.81 9.94L14.06 6.19Z"
                                fill="#757575"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_475_9108">
                                <rect width="24" height="24" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>
                        ) : null}
                      </label>
                      {selectedOption?.id !== "all" &&
                      option.id === selectedOption?.id &&
                      !removeOpeningBalance ? (
                        <div className="relative">
                          <ol
                            className={classNames("pl-7", {
                              "bg-[#EBEEFD]": selectedOption?.id === option.id,
                            })}
                          >
                            <li className="cursor-pointer">
                              <div className="ml-5 w-[76%] h-[1px] rounded absolute bg-[#B6C1EE]" />
                              <label
                                className={classNames(
                                  "flex gap-2 items-center py-3 px-5"
                                )}
                              >
                                <input
                                  type="checkbox"
                                  readOnly={Boolean(isOpeningBalanceEnabled)}
                                  value={"includeOpeningBalance"}
                                  checked={shouldEnableOpeningBalance}
                                  onChange={(e) => {
                                    setShouldEnableOpeningBalance(
                                      e.currentTarget.checked
                                    );
                                  }}
                                />
                                <Text fontSize="c2">
                                  Include opening balance
                                </Text>
                              </label>
                            </li>
                          </ol>
                        </div>
                      ) : null}
                    </li>
                  );
                })}
              </ol>
            </div>
            {control !== "input" && !removeActionButtons ? (
              <footer className="flex gap-8 flex-row-reverse border-t py-4 px-5">
                <button
                  type="button"
                  onClick={() => {
                    onApply?.(selectedOption, shouldEnableOpeningBalance);
                    menuContextValue.close();
                  }}
                  className="text-blue-900 font-semibold"
                >
                  Done
                </button>
                <button
                  type="button"
                  className="text-gray-500 font-semibold"
                  onClick={() => {
                    onApply?.(undefined);
                    onChange?.(undefined);
                    setSelectedOption(undefined);
                    menuContextValue.close();
                  }}
                >
                  Clear
                </button>
              </footer>
            ) : null}
          </div>
        </MenuList>
      </MenuContext.Provider>
    </div>
  );
}

function Chip({
  label,
  height,
  isApplied,
  onClick,
}: {
  label: string;
  height?: React.ComponentProps<typeof Box>["height"];
  isApplied?: boolean;
  onClick: () => void;
}) {
  return (
    <Box
      as="button"
      display="flex"
      gap="3"
      paddingLeft="3"
      paddingRight="1"
      paddingY="2"
      borderWidth="1"
      rounded="md"
      alignItems="center"
      borderColor={isApplied ? "borderPrimaryLow" : "borderOutline"}
      height={height || "8"}
      backgroundColor={isApplied ? "surfacePrimaryLowest" : "surfaceDefault"}
      color={isApplied ? "textPrimary" : "textHigh"}
      onClick={onClick}
      className={classNames("", {
        "hover:bg-blue-5": !isApplied,
      })}
    >
      <Text fontSize={isApplied ? "c1" : "c2"}>{label}</Text>
      <ArrowDropDownIcon size="5" />
    </Box>
  );
}
