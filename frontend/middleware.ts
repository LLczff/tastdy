import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { SORT_LIST, CATEGORIES_FILTER } from "@/constants";
import { diff, findDuplicates } from "@/utils";

export function middleware(request: NextRequest) {
  // Add pathname in header for using in server side
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);
  requestHeaders.set("x-params", request.nextUrl.searchParams.toString());

  if (request.nextUrl.pathname.startsWith("/recipe")) {
    const searchParams = request.nextUrl.searchParams;
    // get original for reference
    const originalParams = searchParams.toString();

    // if sort is not defined or not a valid value, redirect to default value
    const validSort = SORT_LIST.map((item) => item.value);
    if (!validSort.includes(searchParams.get("sort") ?? ""))
      searchParams.set("sort", validSort[0]);

    // if page is not valid, redirect to default value
    if (!searchParams.has("page") || Number(searchParams.get("page")) < 1)
      searchParams.set("page", "1");

    /** Category validation start */
    const categories = searchParams.getAll("categories");
    const categoryQueryStringArray = CATEGORIES_FILTER.map(
      (item) => item.value
    );

    const invalidFilterArr = diff(categories, categoryQueryStringArray);

    // if filter is not defined or not a valid value, remove filter from query string
    if (invalidFilterArr.length > 0) {
      invalidFilterArr.forEach((item) =>
        searchParams.delete("categories", item)
      ); // remove all
    }

    // if filter is duplicate, make it unique
    // first, find all duplicate (it could be ["value1", "value1", "value2"])
    // second, ensure that array of duplicate has unique values (resulted as ["value1", "value2"])
    const duplicateFilterArr = Array.from(new Set(findDuplicates(categories)));

    if (duplicateFilterArr.length > 0) {
      duplicateFilterArr.forEach((item) => {
        searchParams.delete("categories", item); // remove all duplicate
        searchParams.append("categories", item); // set it again
        // now this filter has only one value
      });
    }
    /** Category validation end */

    // if params has been modified, redirect to valid url
    const params = searchParams.toString();
    if (params !== originalParams) {
      return NextResponse.redirect(new URL("/recipe?" + params, request.url), {
        headers: requestHeaders,
      });
    }
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}
