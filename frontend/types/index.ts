export type ServerSearchParams = { [key: string]: string | string[] };

/**
 * Form data attributes from server action
 */
export enum FormDataFields {
  Username = "username",
  Password = "pwd",
  ConfirmPassword = "confirm-pwd",
  Image = "user-image",
}

/**
 * Form server acton response
 */
export type FormActionState = {
  success: boolean;
  error: string;
};

/**
 * Data fetching tag
 */
export enum Tag {
  SingleRecipe = "single_recipe",
  Recipes = "recipes",
  UserData = "user_data",
}

export enum ErrorMessage {
  Unautorized = "you have no permission to perform this action",
  NotFound = "data not found",
  FetchFailed = "failed to fetch data",
  MissingField = "please fill all mandatory",
  ServerError = "unknown error occur",
}

export enum Category {
  MainDish = "main",
  Soup = "soup",
  Dessert = "dessert",
  Salad = "salad",
  Snack = "snack",
  Beverage = "beverage",
}

export type CategoryValue = `${Category}`;

export type ShortMenu = {
  _id: string;
  image: string;
  dish: string;
  author: string;
  favorite: number;
};

export type Menu = ShortMenu & {
  category: CategoryValue;
  liked: boolean;
  createdAt: string; // date string
};

export type Recipes = {
  data: Menu[] | null;
  total: number;
};

// modify author types
export type RecipePost = Omit<Menu, "author"> & {
  ingredients: string[];
  procedures: string[];
  author: UserData;
};

export type UserData = {
  _id: string;
  username: string;
  image: string;
};

export type UserDetails = UserData & {
  posts: Menu[];
};

export type UserProfile = {
  owner: boolean;
  totalPosts: number;
};
