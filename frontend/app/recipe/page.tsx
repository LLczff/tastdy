// Type
import { Recipes, Tag } from "@/types";
// Component
import SearchBar from "@/components/SearchBar";
import Sort from "@/components/recipe/Sort";
import Category from "@/components/recipe/Category";
import Thumbnail from "@/components/recipe/Thumbnail";
import Pagination from "@/components/recipe/Pagination";
// Server
import { getData } from "@/app/actions";
// Icon
import { RiEmotionSadFill } from "react-icons/ri";

type RecipeSearchParams = {
  search: string;
  sort: "popular" | "timestamp";
  page: string;
  categories: string | string[];
};

function generateQueryParams(searchParams: RecipeSearchParams) {
  const searchTerm = searchParams.search || "";
  let params = new URLSearchParams({
    sort: searchParams.sort,
    page: searchParams.page,
    // Optional
    keyword: searchTerm.trim(),
  });

  // if it has only one element, this will be string
  let categories = searchParams.categories || [];

  // turn a string into an array
  if (typeof categories === "string") {
    categories = [categories];
  }

  categories.forEach((category) => {
    params.append("category[]", category);
  });

  return params.toString();
}

export default async function Page({
  searchParams,
}: {
  searchParams: RecipeSearchParams;
}) {
  const params = generateQueryParams(searchParams);
  const recipes: Recipes = await getData("/recipe?" + params, Tag.Recipes);
  const totalItems =
    recipes.data && recipes.data.length > 0 ? recipes.total : 0;

  return (
    <main className="main-container bg-gray-100">
      <section className="grid gap-2 px-4 py-4 mb-6">
        <SearchBar className="col-span-2 xs:col-span-1" />
        <Sort className="row-start-2 xs:row-start-1 xs:col-start-1 xs:max-w-[200px] xs:justify-self-end" />
        <Category
          className="row-start-2 col-start-2 xs:row-start-1 xs:col-start-3 xs:max-w-[200px]"
          totalItems={totalItems}
        />
      </section>
      {recipes.data && totalItems > 0 ? (
        <section className="grid gap-y-6 mb-6 xs:grid-cols-2 xs:mt-4 lg:grid-cols-3 lg:mt-6 xl:grid-cols-4 2xl:grid-cols-6">
          {recipes.data.map((item, idx) => (
            <Thumbnail key={idx} {...item} />
          ))}
        </section>
      ) : (
        <section className="text-center font-medium mt-20">
          <RiEmotionSadFill className="text-8xl mx-auto" />
          <p className="text-2xl px-5">No result match your search</p>
        </section>
      )}
      <Pagination totalItems={totalItems} />
    </main>
  );
}
