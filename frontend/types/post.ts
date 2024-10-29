/**
 * this file's purpose is to serve PostEditor component and it's child
 */

import { CategoryValue } from "@/types";

export enum PostFields {
  Dish = "dish-editor",
  Category = "category-editor",
  Ingredients = "ingredient-editor",
  Procedures = "procedure-editor",
}

export enum PostUpdateType {
  DISH = "DISH",
  CATEGORY = "CATEGORY",
  INGREDIENT = "INGREDIENT",
  PROCEDURE = "PROCEDURE",
  IMAGE = "IMAGE",
  IMAGE_NAME = "IMAGE_NAME",
}

export type PostState = {
  dish: string;
  image: string; // base64 image for support props
  category: CategoryValue;
  ingredients: string[];
  procedures: string[];
  // other
  imageName: string; // this present when user upload image
};

export type PostAction =
  | { type: PostUpdateType.DISH; payload: string }
  | { type: PostUpdateType.CATEGORY; payload: CategoryValue }
  | { type: PostUpdateType.INGREDIENT; payload: string[] }
  | { type: PostUpdateType.PROCEDURE; payload: string[] }
  | { type: PostUpdateType.IMAGE; payload: string }
  | { type: PostUpdateType.IMAGE_NAME; payload: string };
