import { Category } from "@/types";

export const BASE_API_URL = process.env.BASE_API_URL;

export const DROPDOWN_ITEM_HEIGHT = 37;

export const ITEM_PER_EXPLORE_PAGE = 24;

export const SORT_LIST = [
  {
    label: "Popular",
    value: "popular",
  },
  {
    label: "Newest",
    value: "timestamp",
  },
];

export const CATEGORIES_FILTER = [
  {
    label: "Main dish",
    value: Category.MainDish,
  },
  {
    label: "Soup",
    value: Category.Soup,
  },
  {
    label: "Dessert",
    value: Category.Dessert,
  },
  {
    label: "Salad",
    value: Category.Salad,
  },
  {
    label: "Snack",
    value: Category.Snack,
  },
  {
    label: "Beverage",
    value: Category.Beverage,
  },
];

export const INITIAL_FORM_ACTION_STATE = { success: false, error: "" };
