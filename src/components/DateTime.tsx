import React from "react";
import { Text, TextProps } from "./Text";
import { Timestamp } from "firebase/firestore";
import { formatDate, parseISODate, timeStampToDate } from "../utils";

export const Time = React.forwardRef<
  HTMLTimeElement,
  Omit<TextProps<"time">, "as" | "children"> & {
    /**
     * This is the server time stamp value returned by firebase
     */
    timeStamp?: Timestamp;
    /**
     * Date parsed value or a ISO datetime string
     */
    date?: Date | string;
    /**
     * Custom format to render the date in
     * @default dd MMM, yyyy
     */
    format?: string;
    children?: (props: { date: Date; format: string }) => React.ReactNode;
  }
>(function Time(
  { timeStamp, date, format = "dd MMM, yyyy", children, ...props },
  ref
) {
  let value: Date | null = null;
  if (timeStamp) {
    value = timeStampToDate(timeStamp);
  } else if (date) {
    value = typeof date === "string" ? parseISODate(date) : date;
  }
  if (!value) return null;
  return (
    <Text as="time" dateTime={value.toISOString()} ref={ref} {...props}>
      {children ? children({ date: value, format }) : formatDate(value, format)}
    </Text>
  );
});
