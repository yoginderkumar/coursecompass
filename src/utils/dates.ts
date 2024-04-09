import { Timestamp } from "firebase/firestore";
import {
  parseISO as parseISODate,
  format as formatDate,
  setHours,
  getHours,
  setMinutes,
  getMinutes,
  setSeconds,
  getSeconds,
  subMonths,
} from "date-fns";

export {
  subMonths,
  formatDate,
  parseISODate,
  setHours,
  getHours,
  setMinutes,
  getMinutes,
  setSeconds,
  getSeconds,
};

export function timeStampToDate(
  time:
    | string
    | {
        seconds?: number;
        nanoseconds?: number;
        _seconds?: number;
        _nanoseconds?: number;
        toDate?: () => Date;
      }
    | Timestamp
): Date {
  // we need to handle many cases for the timestamp as the there are different
  // ways in which the timestamp has been created over the application updates
  try {
    if (typeof time === "string") {
      return new Date(time);
    }
    if (time instanceof Timestamp) {
      return time.toDate();
    }
    if (typeof time.seconds !== "undefined") {
      return new Timestamp(time.seconds, time.nanoseconds || 0).toDate();
    }
    if (typeof time._seconds !== "undefined") {
      return new Timestamp(time._seconds, time._nanoseconds || 0).toDate();
    }
    throw new Error("Can not convert timestamp to date");
  } catch (e) {
    // report it. find the exceptions and add more catches
    console.error(e, { contexts: { data: { time } } });
    return new Date();
  }
}

export function dateToTimestamp(date: Date) {
  return Timestamp.fromDate(date);
}
