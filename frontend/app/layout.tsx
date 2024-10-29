import type { Metadata } from "next";
import "@/app/globals.css";
import { noto_sans, bodoni_moda, dancing_script } from "@/app/font";
// Type
import { UserData, RecipePost, Tag } from "@/types";
import { ChildrenProps } from "@/types/props";
// Component
import Header from "@/components/header/Header";
import Footer from "@/components/Footer";
import AuthModal from "@/components/auth/AuthModal";
import PostModal from "@/components/post/PostModal";
// Server
import { auth, getData } from "@/app/actions";
// Utility
import { extractSearchParams } from "@/utils";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Tastdy",
  description: "Recipes sharing platform",
};

export default async function RootLayout({
  children,
}: Readonly<ChildrenProps>) {
  const headerList = headers();
  const user: UserData | null = await auth();
  const params = headerList.get("x-params");
  const searchParams = extractSearchParams(params);
  let post: RecipePost | null = null;
  if (searchParams.post) {
    post = await getData(`/recipe/${searchParams.post}`, Tag.SingleRecipe);
  }

  return (
    <html lang="en">
      <body
        className={`${noto_sans.variable} ${bodoni_moda.variable} ${dancing_script.variable}`}
      >
        <Header user={user} />
        {children}
        <Footer />
        {/* Post info Modal */}
        {post && <PostModal {...post} />}
        {/* Sign-in & Sign-up Modal */}
        {searchParams.sign && <AuthModal sign={searchParams.sign} />}
      </body>
    </html>
  );
}
