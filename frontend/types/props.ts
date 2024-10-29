import { ShortMenu, Menu, UserData, UserProfile, RecipePost } from "@/types";
import type { Dispatch, SetStateAction } from "react";

export type ChildrenProps = {
  children?: React.ReactNode;
};

export type HeaderProps = {
  user: UserData | null;
};

export type ClassNameProps = {
  className?: string;
};

export type CloseFunctionProps = {
  closeFunc: () => void;
};

export type ModalProps = ClassNameProps &
  ChildrenProps &
  Partial<CloseFunctionProps>;

export type AuthModalProps = {
  sign: string | string[];
};

export type NormalFieldProps = {
  fieldName: string;
  fieldValue: string;
};

export type PasswordFieldProps = NormalFieldProps & {
  showState: boolean;
  toggleStateFunc: Dispatch<SetStateAction<boolean>>;
};

export type SubmitButtonProps = {
  label: string;
};

export type CarouselProps = {
  data: ShortMenu[];
};

export type ThumbnailProps = {
  data: Menu[];
};

export type PaginationProps = {
  totalItems: number;
};

export type CategoryProps = ClassNameProps & PaginationProps;

export type UserProfileProps = UserData & UserProfile;

export type UserPostProps = UserProfile & {
  posts: Menu[];
};

export type PostKebabProps = {
  openEditorFunc: () => Promise<void>;
  deletePostFunc: () => void;
};

export type PostEditorProps = CloseFunctionProps & {
  post: RecipePost | null;
};
