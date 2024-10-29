import Image from "next/image";
// Type
import { ShortMenu } from "@/types";
// Component
import SearchBar from "@/components/SearchBar";
import Carousel from "@/components/home/Carousel";
import CreateRecipeButton from "@/components/home/CreateRecipeButton";
// Server
import { getData } from "@/app/actions";

export default async function Home() {
  const recommended: ShortMenu[] = await getData("/recommend");

  return (
    <main className="main-container items-center">
      {/* Hero */}
      <section className="flex justify-center items-center flex-col gap-6 w-full relative h-96 bg-gray-50 bg-opacity-80 px-4">
        <Image
          src="/hero.jpg"
          fill
          priority
          alt="hero image"
          className="object-cover -z-10"
        />
        <h1 className="font-bodoni-moda text-primary text-4xl text-center">
          TASTY RECIPES FOR TASTE-DEE PEOPLE
        </h1>
        <p className="font-light text-center text-sm max-w-[32rem]">
          Discover a world of flavors through the magic of sharing. Explore
          countless recipes, experiment with new ingredients, and share your
          culinary creations with the world.
        </p>
        <SearchBar className="sm:w-2/3 lg:w-1/2" />
      </section>
      {/* Carousel */}
      <Carousel data={recommended} />
      {/* Share */}
      <section className="bg-gray-50 py-6 w-full text-center px-4">
        <h2 className="font-semibold text-2xl mb-5">GOT YOUR OWN TASTE ?</h2>
        <p className="text-gray-700 font-light mb-6 max-w-[32rem] mx-auto">
          Share your culinary creations and inspire others! Your unique recipes
          and kitchen tips can make a big impact in our community.
        </p>
        <CreateRecipeButton />
      </section>
    </main>
  );
}
