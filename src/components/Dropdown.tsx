import { useOverlayTriggerState } from "@react-stately/overlays";
import { useMemo, useRef, useState } from "react";
import { useFocusWithin } from "react-aria";
import { Box } from "./Box";
import { Inline } from "./Inline";
import { Stack } from "./Stack";
import { Text } from "./Text";
import { MenuContext, MenuList } from "./Menu";
import classNames from "classnames";

export type DropdownOption = {
  id: string;
  label: string;
  heading?: boolean;
};

type DropdownProps<TOption extends DropdownOption> = {
  actionLabel?: React.ReactNode;
  control?: "input" | "button";
  hasValue?: boolean;
  label?: string;
  onChange: (option: TOption | null) => void;
  options?: Array<TOption>;
  // fetchOptions?: (q: string) => Promise<Array<TOption>>
  // searchDisabled?: boolean
  searchPlaceholder?: string;
  value: string | undefined;
  // createOptionLabel?: (q: string) => React.ReactNode
  // onCreateOption?: (q: string, onSuccess: () => void) => void
  // isCreating?: boolean
  // height?: React.ComponentProps<typeof Box>["height"]
  removeActionButtons?: boolean;
  focusInputOnKey?: string;
  labelButton?: React.ReactNode;
  align?: "bottom-right" | "top-right";
  footer?: React.ReactNode;
  alternateBase?: boolean;
  // alignOptions?: "top-right" | "bottom-right"
};

export function Dropdown<TOption extends DropdownOption>({
  label,
  value,
  align,
  footer,
  control,
  options,
  // hasValue,
  actionLabel,
  labelButton,
  focusInputOnKey,
  searchPlaceholder,
  removeActionButtons,
  alternateBase,

  onChange,
}: DropdownProps<TOption>) {
  // hasValue = hasValue !== undefined ? hasValue : Boolean(value);
  const [isFocusWithin, setFocusWithin] = useState(false);
  const [q, setQuery] = useState("");
  const menuState = useOverlayTriggerState({});
  const { focusWithinProps } = useFocusWithin({
    onFocusWithinChange: (isFocusWithin) => setFocusWithin(isFocusWithin),
  });

  const controlInputRef = useRef<HTMLInputElement | null>(null);
  const controlContainerRef = useRef<HTMLDivElement | null>(null);
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
      },
      toggle: () => (menuState.isOpen ? menuState.close() : menuState.open()),
    };
  }, [menuState]);

  const filteredOptions: TOption[] = useMemo(() => {
    return (
      options?.filter((option) =>
        option.label.toLowerCase().includes(q.toLowerCase())
      ) || []
    );
  }, [options, q]);

  const extractedValue: TOption | undefined = useMemo(() => {
    return options?.find((option) => option.id === value);
  }, [options, value]);

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
                  <Text className="text-sm font-medium">{label}</Text>
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
              onKeyDown={(e: { key: string | undefined; keyCode: number }) => {
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
                value={menuContextValue.isExpended ? q : extractedValue?.label}
                className="flex-1 block px-3 py-2 rounded text-sm bg:gray-100 placeholder-gray-500 border border-gray-100 border-0 outline-none shadow-none"
                onChange={(e) => {
                  const q = e.currentTarget.value;
                  if (!menuContextValue.isExpended) menuContextValue.open();
                  setQuery(q || "");
                }}
              />
              {/* {hasValue && !isCreating ? (
                  <Box
                    as="button"
                    disabled={isCreating || filtering}
                    onClick={() => onChange(null)}
                    type="button"
                    padding="2"
                    tabIndex={-1}
                  >
                    <CancelIcon size="5" color="gray500" />
                  </Box>
                ) : null} */}
            </Inline>
          </Stack>
        ) : labelButton ? (
          <button type="button" tabIndex={-1} onClick={menuContextValue.toggle}>
            {labelButton}
          </button>
        ) : control === "button" ? (
          <button className="border rounded py-3 px-4">
            <Text fontSize="b3">{label}</Text>
          </button>
        ) : null}
        <MenuList
          align={align}
          autoFocus={control !== "input"}
          fullWidth={control === "input"}
          alternateBase={alternateBase}
        >
          <div>
            {/* {!(searchDisabled || control === "input") ? (
                <div className="p-3 border-b">
                  <input
                    type="search"
                    placeholder={searchPlaceholder}
                    name="q"
                    value={q}
                    autoComplete="off"
                    className="w-full h-[40px] px-4 form-input py-0 h-[36px] border-gray-100 rounded text-base"
                    onChange={(e) => {
                      const q = e.currentTarget.value
                      handleQueryChange(q || "")
                    }}
                  />
                </div>
              ) : null} */}
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
                    const isSelected = extractedValue?.id === option.id;

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
                            className={classNames("w-4 h-4")}
                            checked={isSelected}
                            onChange={(e) => {
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
            {/* {createOptionLabel && onCreateOption && !isCreating ? (
                <div className="p-3">
                  <button
                    type="button"
                    className="w-full flex gap-2 border border-gray-100 bg-blue-50 p-2 items-center rounded"
                    onClick={() => {
                      menuContextValue.close()
                      onCreateOption(q, () =>
                        controlContainerRef.current?.focus()
                      )
                    }}
                  >
                    <PlusIcon size="5" color="blue900" />
                    <span className="flex-1 min-w-0 font-medium text-left break-words">
                      {createOptionLabel(q)}
                    </span>
                  </button>
                </div>
              ) : null} */}
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
