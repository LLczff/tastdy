"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
// Type
import {
  FormActionState,
  UserData,
  FormDataFields,
  ErrorMessage,
  CategoryValue,
  Tag,
} from "@/types";
import { PostState } from "@/types/post";
// Constant
import { BASE_API_URL, CATEGORIES_FILTER } from "@/constants";

/**
 * Call GET API to specify path with or without authorization
 * @param path path to request
 * @returns data from API
 */
export async function getData(path: string, tag?: string): Promise<any> {
  const token = getToken();

  const res = await fetch(BASE_API_URL + path, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    next: { tags: tag ? [tag] : undefined },
  });
  if (!res.ok) {
    if (res.status === 404) notFound();
    throw new Error(ErrorMessage.FetchFailed);
  }

  return res.json();
}

/**
 * Register form action
 * @param prevState previous status and error, will use initial states at first call
 * @param formData data from register form
 * @returns success status and error if any
 */
export async function signUp(
  prevState: FormActionState,
  formData: FormData
): Promise<FormActionState> {
  const username = formData.get(FormDataFields.Username);
  const password = formData.get(FormDataFields.Password);
  const confirmPassword = formData.get(FormDataFields.ConfirmPassword);

  if (!username || !password || !confirmPassword) {
    return { success: false, error: "please fill out all mandatories" };
  }

  // validate password matching
  if (password !== confirmPassword) {
    return { success: false, error: "password do not match" };
  }

  const res = await fetch(BASE_API_URL + "/sign-up", {
    method: "POST",
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  });

  if (!res.ok) {
    const error: { error: string } = await res.json();
    return { success: false, ...error };
  }

  return { success: true, error: "" };
}

/**
 * Login form action
 * @param prevState previous status and error, will use initial states at first call
 * @param formData data from login form
 * @returns success status and error if any
 */
export async function login(
  prevState: FormActionState,
  formData: FormData
): Promise<FormActionState> {
  const username = formData.get(FormDataFields.Username);
  const password = formData.get(FormDataFields.Password);

  if (!username || !password) {
    return { success: false, error: "please fill out all mandatories" };
  }

  const res = await fetch(BASE_API_URL + "/login", {
    method: "POST",
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  });

  if (!res.ok) {
    const error: { error: string } = await res.json();
    return { success: false, ...error };
  }

  const data: { token: string } = await res.json();
  setToken(data.token);

  return { success: true, error: "" };
}

/**
 * Get data from logged in user
 * @returns user data if succeed
 */
export async function auth(): Promise<UserData | null> {
  const token = getToken();

  const res = await fetch(BASE_API_URL + "/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    return null;
  }

  return res.json();
}

/**
 * Like post
 * @param id post id
 * @returns current like status and total like
 */
export async function likeRecipe(id: string): Promise<number> {
  const token = getToken();

  const res = await fetch(`${BASE_API_URL}/recipe/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // since in production, client cannot access Error.message
  // client component will be handling error itself
  return res.status;
}

/**
 * Upload user profile image form action
 * @param prevState previous status and error, will use initial states at first call
 * @param formData data from image upload form
 * @returns success status and error if any
 */
export async function uploadUserImage(
  prevState: FormActionState,
  formData: FormData
): Promise<FormActionState> {
  const file = formData.get(FormDataFields.Image) as File;
  if (!file) {
    return { success: false, error: "no image uploaded" };
  }

  const buffer = await file.arrayBuffer();

  if (buffer.byteLength === 0) {
    return { success: false, error: "no image uploaded" };
  }

  const metadata = `data:${file.type};base64,`;
  const base64 = metadata + Buffer.from(buffer).toString("base64");

  const token = getToken();

  const res = await fetch(BASE_API_URL + "/user/image", {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      image: base64,
    }),
  });

  if (!res.ok) {
    const error: { error: string } = await res.json();
    return { success: false, ...error };
  }

  await revalidateTag(Tag.UserData);

  return { success: true, error: "" };
}

/**
 * Create a recipe post
 * @param data recipe data
 * @returns success status and error if any
 */
export async function createRecipe(data: PostState): Promise<void> {
  const categoryValue = CATEGORIES_FILTER.map(
    (item) => item.value
  ) as CategoryValue[];

  // check empty value
  if (
    data.dish === "" ||
    data.image === "" ||
    !categoryValue.includes(data.category) ||
    data.ingredients.length === 0 ||
    data.procedures.length === 0
  ) {
    throw new Error(ErrorMessage.MissingField);
  }

  const token = getToken();

  const res = await fetch(BASE_API_URL + "/recipe", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      dish: data.dish,
      category: data.category,
      image: data.image,
      ingredients: data.ingredients,
      procedures: data.procedures,
    }),
  });

  if (!res.ok) {
    if (res.status === 401) throw new Error(ErrorMessage.Unautorized);
    throw new Error(ErrorMessage.ServerError);
  }

  // finally, re-fetch post
  revalidateTag(Tag.UserData);
}

/**
 * Update a recipe post
 * @param id target post id
 * @param data data to update
 */
export async function updateRecipe(id: string, data: PostState): Promise<void> {
  const categoryValue = CATEGORIES_FILTER.map(
    (item) => item.value
  ) as CategoryValue[];

  // check empty value
  if (
    data.dish === "" ||
    data.image === "" ||
    !categoryValue.includes(data.category) ||
    data.ingredients.length === 0 ||
    data.procedures.length === 0
  ) {
    throw new Error(ErrorMessage.MissingField);
  }

  const token = getToken();

  const res = await fetch(BASE_API_URL + `/recipe/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      dish: data.dish,
      category: data.category,
      image: data.image,
      ingredients: data.ingredients,
      procedures: data.procedures,
    }),
  });

  if (!res.ok) {
    if (res.status === 401) throw new Error(ErrorMessage.Unautorized);
    throw new Error(ErrorMessage.ServerError);
  }

  // finally, re-fetch post
  revalidateTag(Tag.UserData);
}

export async function deleteRecipe(id: string): Promise<void> {
  const token = getToken();

  const res = await fetch(BASE_API_URL + `/recipe/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    if (res.status === 401) throw new Error(ErrorMessage.Unautorized);
    throw new Error(ErrorMessage.ServerError);
  }

  // finally, re-fetch post
  revalidateTag(Tag.UserData);
}

/**
 * Remove token on sign-out
 */
// function from server action that used in client component must be async
export async function removeToken(): Promise<void> {
  cookies().delete("token");
}

/**
 * Set access token on cookie
 * @param token JWT token
 */
function setToken(token: string): void {
  const oneDay = 24 * 60 * 60 * 1000;
  cookies().set("token", token, {
    expires: Date.now() + oneDay,
    path: "/",
    httpOnly: true,
    sameSite: "lax",
  });
}

/**
 * Get access token from cookie
 */
function getToken(): string {
  const tokenCookie = cookies().get("token");
  if (!tokenCookie) {
    return "";
  }

  return tokenCookie.value;
}

/**
 * Revalidate tag from client component
 * @param tag tag to revalidate
 */
export async function revalidateTagClient(tag: string): Promise<void> {
  revalidateTag(tag);
}
