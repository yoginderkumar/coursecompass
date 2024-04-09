"use client";
import React, { useMemo } from "react";
import classNames from "classnames";
import { $PropertyType } from "utility-types";
import {
  Field,
  FieldProps,
  FormikConfig,
  FormikErrors,
  connect,
  getIn,
} from "formik";
import { DayPicker, Matcher } from "react-day-picker";
import { Text } from "./Text";
import { Menu, MenuButton, MenuList } from "./Menu";
import {
  formatDate,
  getHours,
  getMinutes,
  getSeconds,
  setHours,
  setMinutes,
  setSeconds,
} from "../utils";
import { CalendarIcon } from "./Icons";
import { Box } from "./Box";
import toast from "react-hot-toast";
import { Stack } from "./Stack";

type FormFieldProps = Omit<
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >,
  "name"
> & {
  label?: React.ReactNode;
  name: string;
  secondaryLabel?: string;
  actionLabel?: React.ReactNode;
  renderInput?: (props: FieldProps) => React.ReactNode;
  help?: React.ReactNode;
  noMargin?: boolean;
  invisibleInput?: boolean;
  hideError?: boolean;
  hideAsterisk?: boolean;
  fullWidth?: boolean;
};

export const Input = React.forwardRef<
  HTMLInputElement,
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
>(function Input({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={classNames(
        "block rounded bg:gray-100 py-2 text-[14px] px-3 placeholder-gray-500 border border-gray-100",
        className,
        props.type === "checkbox"
          ? "form-checkbox"
          : props.type === "radio"
          ? "form-radio"
          : "form-input"
      )}
      {...props}
    />
  );
});

interface TextareaProps
  extends React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > {
  label?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ className, label, ...props }, ref) {
    return (
      <Stack gap="1">
        {label ? (
          <InputLabel fieldId={props.name || "missing"}>{label}</InputLabel>
        ) : null}
        <textarea
          ref={ref}
          className={classNames(
            "block rounded bg:gray-100 py-2 text-[14px] px-3 placeholder-gray-500 border border-gray-100",
            className,
            "form-textarea"
          )}
          {...props}
        ></textarea>
      </Stack>
    );
  }
);

export function FormField({
  label,
  name,
  id,
  ref,
  renderInput,
  help,
  noMargin = false,
  invisibleInput = false,
  hideError = false,
  secondaryLabel,
  actionLabel,
  hideAsterisk,
  fullWidth,
  ...props
}: FormFieldProps) {
  const fieldId = id || name;
  const labelAlignment =
    props.type === "checkbox" || props.type === "radio" ? "After" : "Before";

  return (
    <Field name={name} type={props.type} value={props.value}>
      {(fieldProps: FieldProps) => {
        const { field, meta } = fieldProps;
        return (
          <div
            className={classNames(
              "relative ",
              { "mb-6": !noMargin, "w-full": fullWidth },
              invisibleInput ? props.className : ""
            )}
          >
            <div
              className={classNames(
                "flex",
                props.type === "radio" || props.type === "checkbox"
                  ? `flex-row items-center${
                      !invisibleInput ? " space-x-2" : ""
                    }`
                  : "flex-col space-y-1"
              )}
            >
              {label && labelAlignment === "Before" ? (
                <InputLabel
                  fieldId={fieldId}
                  secondaryLabel={secondaryLabel}
                  actionLabel={actionLabel}
                >
                  <Text>
                    {label}
                    {!hideAsterisk && props.required ? (
                      <Text
                        as="span"
                        fontSize="b1"
                        color="iconError"
                        className="ml-1"
                      >
                        *
                      </Text>
                    ) : null}
                  </Text>
                </InputLabel>
              ) : null}

              {renderInput ? (
                renderInput(fieldProps)
              ) : (
                <Input
                  id={fieldId}
                  ref={ref as unknown as React.Ref<HTMLInputElement>}
                  {...field}
                  {...props}
                  className={classNames(props.className, {
                    "opacity-0 top-0 left-0 w-1 h-1 absolute": invisibleInput,
                  })}
                />
              )}
              {label && labelAlignment === "After" ? (
                <InputLabel
                  fieldId={fieldId}
                  secondaryLabel={secondaryLabel}
                  actionLabel={actionLabel}
                >
                  {label}
                </InputLabel>
              ) : null}
            </div>
            {help ? (
              <div className="text-gray-500 text-xs mt-1">{help}</div>
            ) : null}
            {!hideError && meta.error && meta.touched ? (
              <ErrorMessage name={name} />
            ) : null}
          </div>
        );
      }}
    </Field>
  );
}

type FormTextareaProps = Omit<
  React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  >,
  "name"
> & {
  label?: React.ReactNode;
  name: string;
  secondaryLabel?: string;
  actionLabel?: React.ReactNode;
  help?: React.ReactNode;
  noMargin?: boolean;
  hideError?: boolean;
  hideAsterisk?: boolean;
};

export function FormTextArea({
  id,
  // ref,
  name,
  help,
  label,
  noMargin,
  hideError,
  actionLabel,
  secondaryLabel,
  hideAsterisk,
  ...props
}: FormTextareaProps) {
  const fieldId = id || name;
  return (
    <Field name={name} value={props.value}>
      {(fieldProps: FieldProps) => {
        const { field, meta } = fieldProps;
        return (
          <div className={classNames("relative", { "mb-6": !noMargin })}>
            <div className={classNames("flex flex-col space-y-1")}>
              {label ? (
                <InputLabel
                  fieldId={fieldId}
                  secondaryLabel={secondaryLabel}
                  actionLabel={actionLabel}
                >
                  <Text>
                    {label}
                    {!hideAsterisk && props.required ? (
                      <Text
                        as="span"
                        fontSize="b1"
                        color="iconError"
                        className="ml-1"
                      >
                        *
                      </Text>
                    ) : null}
                  </Text>
                </InputLabel>
              ) : null}
              <Textarea {...field} {...props} />
            </div>
            {help ? (
              <div className="text-gray-500 text-xs mt-1">{help}</div>
            ) : null}
            {!hideError && meta.error && meta.touched ? (
              <ErrorMessage name={name} />
            ) : null}
          </div>
        );
      }}
    </Field>
  );
}

export const ErrorMessage = connect<{ name: string }>(function ErrorMessage({
  formik,
  name,
}) {
  const errors: Record<string, unknown> = formik.errors || {};
  const allTouched = formik.touched;
  const error = errors[name as unknown as string] || getIn(errors, name);
  const touched: boolean = getIn(allTouched, name);
  if (!error || !touched) return null;
  return (
    <div className="px-2 py-1 mt-1 bg-red-100 border rounded border-red-100 text-red-900 text-sm">
      {Array.isArray(error) ? error.join(", ") : error}
    </div>
  );
});

export function InputLabel({
  children,
  fieldId,
  className,
  // secondaryLabel,
  actionLabel,
  ...props
}: React.DetailedHTMLProps<
  React.LabelHTMLAttributes<HTMLLabelElement>,
  HTMLLabelElement
> & {
  fieldId: string;
  secondaryLabel?: string;
  actionLabel?: React.ReactNode;
}) {
  return (
    <div
      className={classNames("text-sm font-medium flex-1", {
        flex: actionLabel,
      })}
    >
      <label
        htmlFor={fieldId}
        className={classNames("cursor-pointer flex-1", className)}
        {...props}
      >
        {children}
      </label>
      {actionLabel ? <div>{actionLabel}</div> : null}
    </div>
  );
}

export function DatePicker({
  onChange,
  value,
  inputProps,
  min,
  max,
  placeholder,
  onOpen,
}: {
  onChange: (date: Date | undefined) => void;
  inputProps?: React.HTMLProps<HTMLInputElement> & { error?: string };
  value?: Date;
  min?: Date;
  max?: Date;
  placeholder?: string;
  onOpen?: () => void;
}) {
  const disabledDays: Matcher = useMemo(() => {
    let disableDaysObj = {};
    if (min || max) {
      if (min) {
        disableDaysObj = { ...disableDaysObj, before: new Date(min) };
      }
      if (max) {
        disableDaysObj = {
          ...disableDaysObj,
          after: new Date(max),
        };
      }
    }
    return disableDaysObj as Matcher;
  }, [min, max]);
  return (
    <Menu>
      {({ isExpended, toggle }) => (
        <>
          <MenuButton
            inline
            onClick={() => {
              if (!isExpended) {
                onOpen?.();
              }
            }}
          >
            <DateInput
              value={`${
                value ? formatDate(value as Date, "dd MMM, yyyy") : ""
              }`}
              readOnly
              error={inputProps?.error}
              placeholder={placeholder || "DD MMM, YYYY"}
              style={{ color: "black" }}
              className={classNames(inputProps?.className, "w-full")}
            />
          </MenuButton>
          <MenuList alternateBase fullWidth>
            <DayPicker
              selected={new Date(value as Date)}
              mode={"single"}
              modifiersStyles={{
                selected: { color: "white", background: "#4863D4" },
                today: {
                  color:
                    new Date().toDateString() ===
                    new Date(value as Date).toDateString()
                      ? "white"
                      : "red",
                },
              }}
              disabled={disabledDays}
              onDayClick={(date: Date) => {
                if (value) {
                  // update the time (h,m,s) from the value
                  // because the the library removes and sets it to 12:00:00
                  date = (
                    [
                      [setHours, getHours],
                      [setMinutes, getMinutes],
                      [setSeconds, getSeconds],
                    ] as Array<[typeof setHours, typeof getHours]>
                  ).reduce<Date>(
                    (date, [setFn, getFn]) => setFn(date, getFn(value)),
                    date
                  );
                }
                onChange(new Date(date));
                toggle();
              }}
            />
          </MenuList>
        </>
      )}
    </Menu>
  );
}

type DateExtraInputs = React.ComponentProps<typeof Input> & {
  error?: string;
};

const DateInput = React.forwardRef<HTMLInputElement, DateExtraInputs>(
  function DateInputInner(props, ref) {
    return (
      <div>
        <div className="relative">
          <div className="flex absolute inset-y-0 left-0 items-center pointer-events-none pl-3 ">
            <CalendarIcon color="iconAlt1" />
          </div>
          <Input
            {...props}
            ref={ref}
            color="black"
            className={` focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5   dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 h-[40px] dark:focus:border-blue-500 ${props.className}`}
          />
        </div>
        {props.error ? (
          <Box
            paddingY="1"
            paddingX="2"
            marginY="1"
            textAlign="left"
            rounded="md"
            backgroundColor="surfaceErrorLowest"
          >
            <Text fontSize="c2" color="textError">
              {props.error}
            </Text>
          </Box>
        ) : null}
      </div>
    );
  }
);

// wrap formik onSubmit to automatically handle errors
type TOnSubmit<T> = $PropertyType<FormikConfig<T>, "onSubmit">;
// eslint-disable-next-line react-refresh/only-export-components
export function formikOnSubmitWithErrorHandling<T>(
  handleSubmit: TOnSubmit<T>,
  rethrow?: boolean
): TOnSubmit<T> {
  return async (values, actions) => {
    if (!navigator.onLine)
      return toast.error("No internet available. Please try again later!");
    actions.setStatus();
    try {
      return await Promise.resolve(handleSubmit(values, actions));
    } catch (e) {
      if (!navigator.onLine) {
        return actions.setStatus(
          "No internet available. Please try again later!"
        );
      }
      if (!e) return;
      const error = e as string | (Error & { formikErrors?: FormikErrors<T> });
      if (typeof error === "string") {
        actions.setStatus(error);
      } else if (error.message) {
        actions.setStatus(error.message);
        if (error.formikErrors) {
          actions.setErrors(error.formikErrors);
        }
      }
      if (rethrow) {
        return Promise.reject(e);
      }
    }
  };
}
