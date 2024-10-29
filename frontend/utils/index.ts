import { ServerSearchParams } from "@/types";

/**
 * Extract the search parameters from URL to object
 * @param params URL query params
 * @returns query params object
 */
export function extractSearchParams(params: string | null): ServerSearchParams {
  let result: ServerSearchParams = {};

  if (!params) return result;

  params.split("&").forEach((param) => {
    const [key, value] = param.split("=");
    // Check if key exists
    if (key in result) {
      if (typeof result[key] === "string") {
        // there is only value
        result[key] = [result[key], value];
        return; // this in forEach equilvalent to continute in for-loop
      }
      // already have multiple values
      result[key].push(value);
      return;
    }
    // there is no key
    result[key] = value;
  });

  return result;
}

/**
 * Check array equality both value and order
 * @param arr1
 * @param arr2
 * @returns
 */
export function isArrayEqual(arr1: any[], arr2: any[]): boolean {
  return (
    arr1.length === arr2.length && arr1.every((ele, idx) => ele === arr2[idx])
  );
}

/**
 * Find any different element from target that not have in prototype array
 * @param target array to scan for
 * @param prototype
 * @returns right outersection of child compared to prototype
 */
export function diff(target: Array<any>, prototype: Array<any>): any[] {
  return target.filter((item) => prototype.indexOf(item) === -1);
}

/**
 * Find any element duplicates in array
 * @param arr target
 * @returns duplicate element
 */
export function findDuplicates(arr: Array<any>): any[] {
  return arr.filter((item, idx) => arr.indexOf(item) !== idx);
}

/**
 * Truncate string to the given length
 * @param str target string
 * @param length length which allowed string to display
 * @returns a truncated string
 */
export function truncateString(str: string, length = 10) {
  return str.length > length ? str.slice(0, length).trim() + "..." : str;
}

/**
 * Convert image file to base64 string in client component
 * @param image image file
 * @returns base64 image
 */
export async function imageToBase64(image: File | null) {
  if (!image) {
    throw new Error("image is required");
  }
  const reader = new FileReader();
  reader.readAsDataURL(image);

  return new Promise<string>((resolve, reject) => {
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
}

/**
 * Abbreviate number into K format if it more than one thousand
 * @param num target number
 * @returns number in K format
 */
export function kNumber(num: number): string {
  return num >= 1000 ? (Math.abs(num) / 1000).toFixed(1) + "K" : String(num);
}

/**
 * Format datetime as "ago" if it less than a day
 *
 * Otherwise, return date string
 * @param date target datetime
 * @returns
 */
export function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000); // Difference in seconds
  const minute = 60;
  const hour = minute * 60;
  const day = hour * 24;

  if (diff < minute) {
    // return ... minute ago
    return `${Math.floor(diff)} minute${Math.floor(diff) !== 1 ? "s" : ""} ago`;
  } else if (diff < hour) {
    // return ... minute ago
    const minutesAgo = Math.floor(diff / minute);
    return `${minutesAgo} minute${minutesAgo !== 1 ? "s" : ""} ago`;
  } else if (diff < day) {
    // return ... hour ago
    const hoursAgo = Math.floor(diff / hour);
    return `${hoursAgo} hour${hoursAgo !== 1 ? "s" : ""} ago`;
    // return date in dd-mmm-YYYY format e.g. 1 Jan 2024
  } else {
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }
}
