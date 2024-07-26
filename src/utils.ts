import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import {
  useProp,
  exists,
  doWatch,
  ReadonlyProp,
  WriteonlyProp,
  doNow,
} from "miwi";
import { createRoot } from "solid-js";

// SECTION: Dev Logs
export const { devLogs, devLog } = doNow(() => {
  const _devLogs = createRoot(() => useProp(`Waiting for attempt.`));
  return {
    devLogs: _devLogs as ReadonlyProp<string>,
    devLog: (msg: string) => (_devLogs.value = `${_devLogs.value}\n${msg}`),
  };
});

// SECTION: Auto Saving Prop
export function autoSavingProp<T extends number | boolean | string>(
  name: string,
  initValue: T | null,
): ReadonlyProp<T | null> & WriteonlyProp<T> {
  const savedValue = createRoot(() => useProp<T | null>(null));
  const saveFileName = `${name}.json`;
  readFile(saveFileName).then((result) => {
    savedValue.value = exists(result) ? JSON.parse(result) : initValue;
    createRoot(() =>
      doWatch(() => {
        writeFile(saveFileName, JSON.stringify(savedValue.value));
      }),
    );
  });
  return savedValue as any;
  async function readFile(path: string) {
    try {
      const results = await Filesystem.readFile({
        path: path,
        directory: Directory.Data,
        encoding: Encoding.UTF8,
      });
      return results.data as string;
    } catch (e) {
      console.log(`Failed to read: ${path}`);
      console.log(e);
      return undefined;
    }
  }
  async function writeFile(path: string, contents: string) {
    await Filesystem.writeFile({
      path: path,
      data: contents,
      recursive: true,
      directory: Directory.Data,
      encoding: Encoding.UTF8,
    });
  }
}

export function formatNumWithCommas(
  num: number,
  digits: number | `min` = 0,
): string {
  const rounded = roundToString(num, digits);
  const [whole, decimal] = rounded.split(`.`);
  const wholeWithComma = whole.replace(/\B(?=(\d{3})+(?!\d))/g, `,`);
  return `${wholeWithComma}${exists(decimal) ? `.${decimal}` : ``}`;
}

export function roundToMatch(num: number, digits: number | `min` = 0): number {
  const rounded = roundToString(num, digits);
  return Number(rounded);
}

export function roundToString(num: number, digits: number | `min` = 0): string {
  // Sometimes there are rounding errors. adding a 0.000..01 on the end seems to reduce these.
  const significantDecimals = num.toString().split(`.`)[1]?.length ?? 0;
  const actualDigits = digits === `min` ? significantDecimals : digits;
  const numRoundingOffset = Math.pow(10, -significantDecimals - 1);
  const digitRoundOffset = Math.pow(10, -actualDigits - 1);
  const roundingOffset = Math.min(numRoundingOffset, digitRoundOffset);
  const result = (num + roundingOffset).toFixed(actualDigits);
  return result;
}

export type NONE_SELECTED = typeof NONE_SELECTED;
export const NONE_SELECTED = null;
export type ONE_TIME = typeof ONE_TIME;
export const ONE_TIME = `oneTime`;
export type JUST_FUEL = typeof JUST_FUEL;
export const JUST_FUEL = `justFuel`;
export type pending = typeof pending;
export const pending = Symbol(`pending`);

export function formatPhoneNumber(input: string, event: InputEvent) {
  let ogInputLength = input?.length; // GET FULL LENGTH OF INPUT STRING
  let caretPos = (event.target as any)?.selectionStart; // GET CURRENT CURSOR POSITION
  let justNums = input?.replace(/\D/g, ""); // STRIP NON-NUMERIC CHARS
  let justNumsLength = justNums?.length; // GET LENGTH OF NUMBER STRING

  if (justNumsLength > 10) {
    input =
      justNums?.slice(0, 3) +
      "-" +
      justNums?.slice(3, 6) +
      "-" +
      justNums?.slice(6, 10) +
      "#" +
      justNums?.slice(10, justNumsLength);

    if (justNumsLength == 11 && caretPos == 13 && ogInputLength != 14) {
      caretPos = 14;
    }
  } else if (justNumsLength > 6) {
    input =
      justNums?.slice(0, 3) +
      "-" +
      justNums?.slice(3, 6) +
      "-" +
      justNums?.slice(6, 10);

    if (justNumsLength == 7 && caretPos == 8 && ogInputLength != 9) {
      caretPos = 9;
    }
  } else if (justNumsLength > 3) {
    input = justNums?.slice(0, 3) + "-" + justNums?.slice(3, 6);

    if (justNumsLength == 4 && caretPos == 4 && ogInputLength != 5) {
      caretPos = 5;
    }
  } else {
    input = justNums;
  }

  return {
    input: input,
    caret: caretPos as number,
  };
}

export function formatIdNumber(input: string, event: InputEvent) {
  let caretPos = (event.target as any)?.selectionStart; // GET CURRENT CURSOR POSITION
  let justNums = input?.replace(/\D/g, ""); // STRIP NON-NUMERIC CHARS
  return {
    input: justNums,
    caret: caretPos as number,
  };
}

// Tue, March 10th 2021 - 3:00 PM
export function formatPosixTime(posixTime: number) {
  // Create a new Date object from the posix time
  let date = new Date(posixTime);

  // Array of day names
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Array of month names
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Get the day of the week, the month and the date
  let dayOfWeek = days[date.getDay()];
  let month = months[date.getMonth()];
  let day = date.getDate();
  let time = date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });

  // Add the ordinal suffix
  let suffix = "";
  switch (day % 10) {
    case 1:
      suffix = day === 11 ? "th" : "st";
      break;
    case 2:
      suffix = day === 12 ? "th" : "nd";
      break;
    case 3:
      suffix = day === 13 ? "th" : "rd";
      break;
    default:
      suffix = "th";
  }

  // Get the year
  let year = date.getFullYear();

  // Return the formatted string
  return `${dayOfWeek}, ${month} ${day}${suffix} ${year} - ${time}`;
}
